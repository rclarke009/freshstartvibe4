import { json, type ActionFunctionArgs } from '@remix-run/node';
import { PurifierModel } from '~/components/ResultCard';

interface EmailResultsRequest {
  email: string;
  recommendations: PurifierModel[];
  answers: Record<string, string[]>;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: EmailResultsRequest = await request.json();
    const { email, recommendations, answers } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return json({ error: 'Valid email required' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Send email using your email service (SendGrid, Mailgun, etc.)
    // 2. Store the results in your database
    // 3. Send confirmation email to user
    // 4. Possibly notify your team about the lead

    console.log('Email results request:', {
      email,
      recommendationCount: recommendations.length,
      answers: Object.keys(answers).length
    });

    // For now, just log the request and return success
    // TODO: Implement actual email sending
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

    return json({ 
      success: true, 
      message: 'Results sent successfully',
      email 
    });

  } catch (error) {
    console.error('Error processing email results:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
