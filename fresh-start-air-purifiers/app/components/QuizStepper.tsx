import { useState } from 'react';

export interface QuizStep {
  id: string;
  title: string;
  question: string;
  type: 'multi-select' | 'single-select';
  options: QuizOption[];
  required?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export interface QuizAnswers {
  [stepId: string]: string[];
}

interface QuizStepperProps {
  steps: QuizStep[];
  onComplete: (answers: QuizAnswers) => void;
  onStepChange?: (stepIndex: number, answers: QuizAnswers) => void;
}

export function QuizStepper({ steps, onComplete, onStepChange }: QuizStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleAnswerChange = (optionId: string, checked: boolean) => {
    const newAnswers = { ...answers };
    
    if (currentStep.type === 'multi-select') {
      newAnswers[currentStep.id] = newAnswers[currentStep.id] || [];
      if (checked) {
        newAnswers[currentStep.id] = [...newAnswers[currentStep.id], optionId];
      } else {
        newAnswers[currentStep.id] = newAnswers[currentStep.id].filter(id => id !== optionId);
      }
    } else {
      newAnswers[currentStep.id] = checked ? [optionId] : [];
    }
    
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex, answers);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex, answers);
    }
  };

  const canProceed = () => {
    const currentAnswers = answers[currentStep.id] || [];
    return currentAnswers.length > 0;
  };

  return (
    <div className="quiz-stepper max-w-4xl mx-auto px-6 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#1e40af] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e40af] mb-4">
            {currentStep.title}
          </h2>
          <p className="text-lg text-gray-700">
            {currentStep.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {currentStep.options.map((option) => {
            const isSelected = (answers[currentStep.id] || []).includes(option.id);
            
            return (
              <label
                key={option.id}
                className={`quiz-option flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#1e40af] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type={currentStep.type === 'multi-select' ? 'checkbox' : 'radio'}
                  name={currentStep.id}
                  value={option.id}
                  checked={isSelected}
                  onChange={(e) => handleAnswerChange(option.id, e.target.checked)}
                  className="mt-1 mr-4 w-5 h-5 text-[#1e40af] border-gray-300 rounded focus:ring-[#1e40af]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {option.label}
                  </div>
                  {option.hint && (
                    <div className="text-sm text-gray-600 mt-1">
                      {option.hint}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="add-to-cart-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastStep ? 'Get My Recommendations' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
