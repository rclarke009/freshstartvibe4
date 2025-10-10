import { data, type ActionFunctionArgs } from '@shopify/remix-oxygen';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { email, needs, placement, picks } = body;

    // Validate required fields
    if (!email || !needs || !placement || !picks) {
      return data({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return data({ error: 'Invalid email format' }, { status: 400 });
    }

    // Here you would typically:
    // 1. Send an email with the recommendations
    // 2. Store the submission in a database
    // 3. Add to your email marketing list (with consent)
    
    // For now, we'll just log the submission and return success
    console.log('Email results submission:', {
      email,
      needs,
      placement,
      picks,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement actual email sending
    // You could use services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Or your existing email service

    return data({ 
      success: true, 
      message: 'Recommendations sent successfully' 
    });

  } catch (error) {
    console.error('Error processing email results:', error);
    return data({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Handle GET requests (not allowed)
export async function loader() {
  return data({ error: 'Method not allowed' }, { status: 405 });
}
