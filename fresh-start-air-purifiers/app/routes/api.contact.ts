import {data, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Resend} from 'resend';

// Spam protection constants
const MIN_FORM_TIME_SECONDS = 3; // Minimum time between form load and submission
const RATE_LIMIT_SUBMISSIONS = 3; // Max submissions per time window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Common spam patterns
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'poker', 'lottery', 'winner', 'congratulations',
  'click here', 'limited time', 'act now', 'urgent', 'guaranteed', 'free money',
  'make money', 'work from home', 'get rich', 'no credit check', 'debt relief',
  'weight loss', 'diet pills', 'enlargement', 'cheap meds', 'pharmacy',
];

// Known spam email domains (common disposable/temporary email services)
const SPAM_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com',
];

/**
 * Get client IP address from request headers
 */
function getClientIP(request: Request): string {
  // Check Cloudflare headers first (Oxygen runs on Cloudflare)
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  // Check X-Forwarded-For header
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Check X-Real-IP header
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) return xRealIP;
  
  // Fallback (shouldn't happen in production with Cloudflare)
  return 'unknown';
}

/**
 * Check if content contains spam patterns
 */
function containsSpamPatterns(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return true;
    }
  }
  
  // Check for excessive URLs (more than 2 URLs is suspicious)
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 2) {
    return true;
  }
  
  // Check for excessive links (more than 3 link-like patterns)
  const linkPattern = /(www\.|[a-z0-9-]+\.(com|net|org|io|co|us|info|biz))/gi;
  const links = text.match(linkPattern);
  if (links && links.length > 3) {
    return true;
  }
  
  return false;
}

/**
 * Check if email domain is a known spam domain
 */
function isSpamEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return SPAM_EMAIL_DOMAINS.some(spamDomain => domain.includes(spamDomain));
}

/**
 * Rate limiting using Cache API
 */
async function checkRateLimit(
  ip: string,
  cache: Cache,
): Promise<{allowed: boolean; remainingTime?: number}> {
  const cacheKey = `https://rate-limit/contact-form:${ip}`;
  const cacheRequest = new Request(cacheKey);
  
  // Try to get existing rate limit data
  const cachedResponse = await cache.match(cacheRequest);
  
  if (cachedResponse) {
    try {
      const data = await cachedResponse.json();
      const {timestamps} = data;
      const now = Date.now();
      
      // Filter out timestamps outside the time window
      const validTimestamps = ((timestamps as number[]) || []).filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
      );
      
      // If we're at or over the limit, deny the request
      if (validTimestamps.length >= RATE_LIMIT_SUBMISSIONS) {
        const oldestTimestamp = Math.min(...validTimestamps);
        const remainingTime = Math.ceil(
          (RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp)) / 1000 / 60,
        );
        return {allowed: false, remainingTime};
      }
      
      // Add current timestamp and update cache
      validTimestamps.push(now);
      const newData = {
        count: validTimestamps.length,
        firstRequestTime: validTimestamps[0],
        timestamps: validTimestamps,
      };
      
      const response = new Response(JSON.stringify(newData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${Math.floor(RATE_LIMIT_WINDOW_MS / 1000)}`,
        },
      });
      
      // Store in cache with expiration
      await cache.put(cacheRequest, response);
      
      return {allowed: true};
    } catch (error) {
      // If we can't parse cached data, start fresh
      console.warn('Failed to parse rate limit cache data, starting fresh:', error);
    }
  }
  
  // First request from this IP
  const now = Date.now();
  const data = {
    count: 1,
    firstRequestTime: now,
    timestamps: [now],
  };
  
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${Math.floor(RATE_LIMIT_WINDOW_MS / 1000)}`,
    },
  });
  
  await cache.put(cacheRequest, response);
  
  return {allowed: true};
}

/**
 * Log spam attempt for monitoring
 */
function logSpamAttempt(
  reason: string,
  ip: string,
  data: {name?: string; email?: string; message?: string},
): void {
  console.warn('Spam attempt detected:', {
    reason,
    ip,
    timestamp: new Date().toISOString(),
    name: data.name,
    email: data.email,
    messagePreview: data.message?.substring(0, 100),
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const website = formData.get('website') as string; // Honeypot field
    const formLoadTime = formData.get('formLoadTime') as string;

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Get cache for rate limiting
    const cache = await caches.open('contact-form-rate-limit');

    // SPAM PROTECTION: Honeypot field check
    if (website && website.trim() !== '') {
      logSpamAttempt('Honeypot field filled', clientIP, {name, email, message});
      return data(
        {error: 'There was an error submitting your message. Please try again.'},
        {status: 400},
      );
    }

    // SPAM PROTECTION: Time-based validation
    if (formLoadTime) {
      const loadTime = parseInt(formLoadTime, 10);
      const submitTime = Date.now();
      const timeDiff = (submitTime - loadTime) / 1000; // Time difference in seconds
      
      if (timeDiff < MIN_FORM_TIME_SECONDS) {
        logSpamAttempt(`Form submitted too quickly (${timeDiff.toFixed(2)}s)`, clientIP, {name, email, message});
        return data(
          {error: 'There was an error submitting your message. Please try again.'},
          {status: 400},
        );
      }
    }

    // SPAM PROTECTION: Rate limiting (skip if IP is unknown)
    if (clientIP !== 'unknown') {
      try {
        const rateLimitCheck = await checkRateLimit(clientIP, cache);
        if (!rateLimitCheck.allowed) {
          logSpamAttempt(
            `Rate limit exceeded (${RATE_LIMIT_SUBMISSIONS} submissions per hour)`,
            clientIP,
            {name, email, message},
          );
          return data(
            {
              error: `Too many requests. Please wait ${rateLimitCheck.remainingTime} minutes before submitting again.`,
            },
            {status: 429},
          );
        }
      } catch (rateLimitError) {
        // If rate limiting fails, log but allow the request (fail open)
        console.warn('Rate limiting check failed, allowing request:', rateLimitError);
      }
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return data(
        {error: 'Missing required fields. Please fill in all required fields.'},
        {status: 400},
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return data({error: 'Invalid email format'}, {status: 400});
    }

    // SPAM PROTECTION: Check for spam email domains
    if (isSpamEmailDomain(email)) {
      logSpamAttempt('Spam email domain detected', clientIP, {name, email, message});
      return data(
        {error: 'There was an error submitting your message. Please try again.'},
        {status: 400},
      );
    }

    // SPAM PROTECTION: Content filtering
    const fullText = `${name} ${email} ${message}`.toLowerCase();
    if (containsSpamPatterns(fullText)) {
      logSpamAttempt('Spam patterns detected in content', clientIP, {name, email, message});
      return data(
        {error: 'There was an error submitting your message. Please try again.'},
        {status: 400},
      );
    }

    // Get environment variables
    // Access extended env properties (RESEND_API_KEY and CONTACT_EMAIL)
    // Note: RESEND_API_KEY should have "Sending access" permissions only for security
    const resendApiKey = (context.env as {RESEND_API_KEY?: string}).RESEND_API_KEY;
    const contactEmail = (context.env as {CONTACT_EMAIL?: string}).CONTACT_EMAIL || 'contact@freshstartairpurifiers.com';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return data(
        {error: 'Email service is not configured. Please contact support.'},
        {status: 500},
      );
    }

    // Initialize Resend
    // The API key should have "Sending access" permissions only (not full access)
    const resend = new Resend(resendApiKey);

    // Format email subject
    const subjectMap: Record<string, string> = {
      general: 'General Inquiry',
      product: 'Product Information',
      support: 'Technical Support',
      quote: 'Request a Quote',
      other: 'Other',
    };
    const emailSubject = `Contact Form: ${subjectMap[subject] || subject} - ${name}`;

    // Format email body
    const emailBody = `
New contact form submission from ${name}

Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subjectMap[subject] || subject}

Message:
${message}

---
This message was sent from the Fresh Start Air Purifiers contact form.
    `.trim();

    // Send email
    // Use verified domain: contact@freshstartairpurifiers.com
    // If domain verification isn't complete, you can temporarily use onboarding@resend.dev for testing
    const fromEmail = 'Fresh Start Air Purifiers <contact@freshstartairpurifiers.com>';
    
    const {data: emailData, error: emailError} = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: emailSubject,
      text: emailBody,
    });

    if (emailError) {
      // Log the full error for debugging (detailed logs for server monitoring)
      console.error('Resend API Error:', JSON.stringify(emailError, null, 2));
      console.error('Error details:', {
        message: emailError.message,
        name: emailError.name,
        statusCode: (emailError as any)?.statusCode,
        response: (emailError as any)?.response,
        ip: clientIP,
        email,
      });
      
      // Return generic error message to user (don't reveal system details)
      return data(
        {
          error: 'There was an error sending your message. Please try again later or contact us directly.',
        },
        {status: 500},
      );
    }

    console.log('Contact form email sent successfully:', {
      id: emailData?.id,
      email,
      subject,
      timestamp: new Date().toISOString(),
    });

    return data({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error) {
    // Log the full error for debugging (detailed logs for server monitoring)
    const clientIP = getClientIP(request);
    console.error('Error processing contact form:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      ip: clientIP,
    });
    
    // Return generic error message to user (don't reveal system details)
    return data(
      {
        error: 'An unexpected error occurred. Please try again later.',
      },
      {status: 500},
    );
  }
}

// Handle GET requests (not allowed)
export async function loader() {
  return data({error: 'Method not allowed'}, {status: 405});
}

