import { useState } from 'react';
import { PurifierModel } from './ResultCard';

interface EmailResultsProps {
  recommendations: PurifierModel[];
  answers: Record<string, string[]>;
  onSend?: (email: string) => void;
}

export function EmailResults({ recommendations, answers, onSend }: EmailResultsProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/email-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          recommendations,
          answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      onSend?.(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-600 text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Results Sent!
        </h3>
        <p className="text-green-700">
          We've sent your personalized air purifier recommendations to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#1e40af] mb-2">
          Get Your Results by Email
        </h3>
        <p className="text-gray-600">
          We'll send you a detailed summary of your recommendations and answers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={!email || isLoading}
          className="w-full add-to-cart-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send My Results'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          We respect your privacy. Your email will only be used to send your results. 
          You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
