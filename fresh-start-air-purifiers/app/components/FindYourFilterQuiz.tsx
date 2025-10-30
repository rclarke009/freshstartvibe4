import { useState } from 'react';
import { useNavigate } from '@remix-run/react';

interface QuizAnswers {
  concern?: string;
  size?: string;
  priority?: string;
}

export default function FindYourFilterQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (key: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 completed - calculate result and navigate
      setIsTransitioning(true);
      const productHandle = calculateRecommendation(newAnswers);
      
      setTimeout(() => {
        navigate(`/products/${productHandle}?from=quiz`);
      }, 500);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const restart = () => {
    setStep(1);
    setAnswers({});
    setIsTransitioning(false);
  };

  const calculateRecommendation = (answers: QuizAnswers): string => {
    const { concern, size, priority } = answers;

    // Product handle mapping to canonical Shopify slugs
    const productHandles = {
      'healthmate': 'austin-air-purifier-healthmate',
      'healthmate-jr': 'austin-healthmate-junior-air-purifier',
      'healthmate-plus': 'austin-healthmate-plus-air-purifier',
      'bedroom': 'austin-bedroom-machine-air-purifier',
      // Per instruction, map allergy to Bedroom Machine
      'allergy': 'austin-bedroom-machine-air-purifier',
      'immunity': 'austin-air-immunity-machine',
    } as const;

    // Recommendation logic
    if (concern === 'chemicals') {
      return size === 'small' ? productHandles['healthmate-jr'] : productHandles['healthmate-plus'];
    }
    
    if (concern === 'mold') {
      return productHandles['allergy'];
    }
    
    if (concern === 'sleep') {
      return productHandles['bedroom'];
    }
    
    if (concern === 'immune') {
      return productHandles['immunity'];
    }
    
    if (concern === 'general') {
      return size === 'small' ? productHandles['healthmate-jr'] : productHandles['healthmate'];
    }

    // Default fallback
    return productHandles['healthmate'];
  };

  if (isTransitioning) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-xl mx-auto my-12 border border-[#1e40af]/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af] mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-[#1e40af] mb-2">Finding your perfect match...</h2>
        <p className="text-gray-600">Analyzing your preferences</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 quiz-step-offset">Step {step} of 3</span>
          {step > 1 && (
            <button
              onClick={goBack}
              className="quiz-button quiz-button--sm quiz-button--muted"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#1e40af] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Main Concern */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-[#1e40af] mb-6">Find Your Perfect Air Purifier</h2>
          <p className="text-gray-700 quiz-prompt">What's your main air quality concern?</p>
          <div className="flex flex-col items-center quiz-group">
            <button 
              onClick={() => handleSelect('concern', 'chemicals')} 
              className="quiz-button"
            >
              Fragrance / Chemicals
            </button>
            <button 
              onClick={() => handleSelect('concern', 'mold')} 
              className="quiz-button"
            >
              Mold / Allergies
            </button>
            <button 
              onClick={() => handleSelect('concern', 'sleep')} 
              className="quiz-button"
            >
              Better Sleep
            </button>
            <button 
              onClick={() => handleSelect('concern', 'immune')} 
              className="quiz-button"
            >
              Immune Support
            </button>
            <button 
              onClick={() => handleSelect('concern', 'general')} 
              className="quiz-button"
            >
              General Clean Air
            </button>
          </div>
        </>
      )}

      {/* Step 2: Room Size */}
      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold text-[#1e40af] mb-6">Room Size</h2>
          <p className="text-gray-700 quiz-prompt">What size area are you purifying?</p>
          <div className="flex flex-col items-center quiz-group">
            <button 
              onClick={() => handleSelect('size', 'small')} 
              className="quiz-button"
            >
              Small Bedroom / Nursery
            </button>
            <button 
              onClick={() => handleSelect('size', 'medium')} 
              className="quiz-button"
            >
              Bedroom / Apartment
            </button>
            <button 
              onClick={() => handleSelect('size', 'large')} 
              className="quiz-button"
            >
              Living Room / Open Space
            </button>
          </div>
        </>
      )}

      {/* Step 3: Priority */}
      {step === 3 && (
        <>
          <h2 className="text-2xl font-semibold text-[#1e40af] mb-6">Priority</h2>
          <p className="text-gray-700 quiz-prompt">What's most important to you?</p>
          <div className="flex flex-col items-center quiz-group">
            <button 
              onClick={() => handleSelect('priority', 'chemical')} 
              className="quiz-button"
            >
              Chemical Removal
            </button>
            <button 
              onClick={() => handleSelect('priority', 'quiet')} 
              className="quiz-button"
            >
              Quiet Operation
            </button>
            <button 
              onClick={() => handleSelect('priority', 'budget')} 
              className="quiz-button"
            >
              Budget Friendly
            </button>
          </div>
        </>
      )}

      {/* Restart option */}
      <div className="mt-8 pt-1 quiz-actions">
        <button
          onClick={restart}
          className="quiz-button quiz-button--sm quiz-button--muted"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
