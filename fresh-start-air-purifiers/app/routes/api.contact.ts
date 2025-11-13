import {data, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Resend} from 'resend';

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

    // Get environment variables
    // Access extended env properties (RESEND_API_KEY and CONTACT_EMAIL)
    // Note: RESEND_API_KEY should have "Sending access" permissions only for security
    
    // Debug: Log what's in context.env (this will help diagnose the issue)
    console.log('=== DEBUG: Environment Variables ===');
    console.log('Available env keys:', Object.keys(context.env || {}));
    console.log('RESEND_API_KEY exists?', 'RESEND_API_KEY' in (context.env || {}));
    console.log('RESEND_API_KEY value:', (context.env as any)?.RESEND_API_KEY ? `${((context.env as any).RESEND_API_KEY as string).substring(0, 5)}...` : 'NOT SET');
    console.log('CONTACT_EMAIL:', (context.env as any)?.CONTACT_EMAIL || 'NOT SET (using default)');
    console.log('===================================');
    
    const resendApiKey = (context.env as {RESEND_API_KEY?: string}).RESEND_API_KEY;
    const contactEmail = (context.env as {CONTACT_EMAIL?: string}).CONTACT_EMAIL || 'contact@freshstartairpurifiers.com';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      console.error('Full context.env keys:', JSON.stringify(Object.keys(context.env || {})));
      console.error('context.env type:', typeof context.env);
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
      // Log the full error for debugging
      console.error('Resend API Error:', JSON.stringify(emailError, null, 2));
      console.error('Error details:', {
        message: emailError.message,
        name: emailError.name,
        statusCode: (emailError as any)?.statusCode,
        response: (emailError as any)?.response,
      });
      
      // Return a more helpful error message
      const errorMessage = emailError.message || 'Failed to send email';
      return data(
        {
          error: `Failed to send email: ${errorMessage}. Please check your Resend domain verification and API key configuration.`,
        },
        {status: 500},
      );
    }

    console.log('Contact form email sent successfully:', emailData);

    return data({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error) {
    // Log the full error for debugging
    console.error('Error processing contact form:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
    });
    
    return data(
      {
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
      },
      {status: 500},
    );
  }
}

// Handle GET requests (not allowed)
export async function loader() {
  return data({error: 'Method not allowed'}, {status: 405});
}

