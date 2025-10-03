import { MetaFunction } from '@remix-run/react';
import { useState } from 'react';
import { QuizStepper, type QuizStep, type QuizAnswers } from '~/components/QuizStepper';
import { ResultCard, type PurifierModel } from '~/components/ResultCard';
import { CompareTable } from '~/components/CompareTable';
import { EmailResults } from '~/components/EmailResults';
import { getRecommendations } from '~/lib/quizLogic';

export const meta: MetaFunction = () => {
  return [
    { title: 'Choose Your Purifier | Fresh Start Air Purifiers' },
    { name: 'description', content: 'Find the perfect air purifier for your space with our interactive selection tool. Get personalized recommendations based on your needs.' },
  ];
};

// Quiz steps configuration
const QUIZ_STEPS: QuizStep[] = [
  {
    id: 'filtration-needs',
    title: 'What are your main air quality concerns?',
    question: 'Select all that apply to help us recommend the right purifier for your needs.',
    type: 'multi-select',
    options: [
      { id: 'fragrances-vocs', label: 'Fragrances/VOCs', value: 'fragrances-vocs', hint: 'From cleaning products, paint, new flooring' },
      { id: 'smoke', label: 'Smoke', value: 'smoke', hint: 'Cigarettes, wildfire, cooking' },
      { id: 'formaldehyde', label: 'Formaldehyde/new materials', value: 'formaldehyde', hint: 'New furniture, cabinets, flooring' },
      { id: 'dust-pollen', label: 'Dust/pollen', value: 'dust-pollen', hint: 'Seasonal allergies, dust mites' },
      { id: 'mold-sensitivity', label: 'Mold/humidity sensitivity', value: 'mold-sensitivity', hint: 'Damp areas, mold spores' },
      { id: 'viruses-bacteria', label: 'Viruses/bacteria', value: 'viruses-bacteria', hint: 'Immune support, illness prevention' },
      { id: 'pet-dander', label: 'Pet dander/odors', value: 'pet-dander', hint: 'Pet allergies, pet odors' },
      { id: 'general-freshness', label: 'General air freshness', value: 'general-freshness', hint: 'Overall air quality improvement' }
    ]
  },
  {
    id: 'sensitivity-level',
    title: 'How sensitive are you to air quality?',
    question: 'This helps us recommend the right level of filtration for your needs.',
    type: 'single-select',
    options: [
      { id: 'typical', label: 'Typical', value: 'typical', hint: 'Standard air quality needs' },
      { id: 'sensitive', label: 'Sensitive', value: 'sensitive', hint: 'More reactive to pollutants' },
      { id: 'very-sensitive', label: 'Very sensitive (MCS/MCAS)', value: 'very-sensitive', hint: 'Multiple chemical sensitivity or mast cell activation' }
    ]
  },
  {
    id: 'noise-tolerance',
    title: 'What\'s your noise tolerance?',
    question: 'Consider if you\'ll use it while sleeping or need quiet operation.',
    type: 'single-select',
    options: [
      { id: 'low', label: 'Low', value: 'low', hint: 'Bedroom while sleeping' },
      { id: 'medium', label: 'Medium', value: 'medium', hint: 'General use with some noise' },
      { id: 'any', label: 'Any', value: 'any', hint: 'Noise is not a concern' }
    ]
  },
  {
    id: 'budget-comfort',
    title: 'What\'s your budget comfort level?',
    question: 'This helps us suggest models within your preferred price range.',
    type: 'single-select',
    options: [
      { id: 'entry', label: 'Entry', value: 'entry', hint: '$400-500 range' },
      { id: 'mid', label: 'Mid', value: 'mid', hint: '$500-700 range' },
      { id: 'premium', label: 'Premium', value: 'premium', hint: '$700+ range' }
    ]
  },
  {
    id: 'space-placement',
    title: 'Where will you use it most?',
    question: 'This helps us recommend the right size and features for your space.',
    type: 'single-select',
    options: [
      { id: 'bedroom', label: 'Bedroom', value: 'bedroom', hint: 'Typically ≤300-500 ft²' },
      { id: 'living-area', label: 'Living area / open space', value: 'living-area', hint: 'Typically 500-1200+ ft²' },
      { id: 'small-office', label: 'Small office / nursery', value: 'small-office', hint: '≤300 ft²' },
      { id: 'classroom-clinic', label: 'Classroom / clinic / high-traffic', value: 'classroom-clinic', hint: 'Shared space with high occupancy' },
      { id: 'whole-apartment', label: 'Whole small apartment / rotation', value: 'whole-apartment', hint: 'Multiple rooms or whole home' }
    ]
  }
];

type QuizState = 'quiz' | 'results';

export default function ChooseYourPurifier() {
  const [quizState, setQuizState] = useState<QuizState>('quiz');
  const [recommendations, setRecommendations] = useState<PurifierModel[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [compareModels, setCompareModels] = useState<PurifierModel[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleQuizComplete = (quizAnswers: QuizAnswers) => {
    setAnswers(quizAnswers);
    const recs = getRecommendations(quizAnswers);
    setRecommendations(recs);
    setQuizState('results');
  };

  const handleAddToCompare = (model: PurifierModel) => {
    if (!compareModels.find(m => m.id === model.id)) {
      setCompareModels([...compareModels, model]);
    }
    setShowCompare(true);
  };

  const handleEmailSend = (email: string) => {
    // In a real implementation, this would send to your API
    console.log('Email sent to:', email, 'with recommendations:', recommendations);
  };

  if (quizState === 'results') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
            Your Personalized Recommendations
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Based on your answers, here are our top recommendations for your air purification needs.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-8 mb-12">
          {recommendations.map((model, index) => (
            <ResultCard
              key={model.id}
              model={model}
              rank={index + 1}
              onAddToCompare={handleAddToCompare}
            />
          ))}
        </div>

        {/* Email Results */}
        <div className="mb-12">
          <EmailResults
            recommendations={recommendations}
            answers={answers}
            onSend={handleEmailSend}
          />
        </div>

        {/* Compare Table */}
        {showCompare && (
          <CompareTable
            models={compareModels}
            onClose={() => setShowCompare(false)}
          />
        )}

        {/* Back to Quiz */}
        <div className="text-center">
          <button
            onClick={() => {
              setQuizState('quiz');
              setRecommendations([]);
              setAnswers({});
              setCompareModels([]);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
          Choose Your Purifier
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Find the perfect air purifier for your space with our interactive selection tool. 
          Get personalized recommendations based on your room size, concerns, and preferences.
        </p>
      </div>

      <QuizStepper
        steps={QUIZ_STEPS}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}