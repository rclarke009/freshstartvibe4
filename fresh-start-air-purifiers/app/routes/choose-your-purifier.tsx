import { MetaFunction } from '@remix-run/react';
import FindYourFilterQuiz from '~/components/FindYourFilterQuiz';

export const meta: MetaFunction = ({location}) => {
  return [
    { title: 'Choose Your Purifier | Fresh Start Air Purifiers' },
    { name: 'description', content: 'Find your perfect Austin Air purifier with our interactive tool. Get personalized recommendations for medical-grade HEPA + carbon filtration systems.' },
    {
      rel: 'canonical',
      href: location.pathname,
    },
  ];
};

export default function ChooseYourPurifier() {
  return (
    <div className="min-h-screen bg-[#F0F8FF] py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-4">
            Choose Your Purifier
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
            Answer 3 simple questions to find the perfect Austin Air purifier for your needs
          </p>
          <br></br>
        </div>
        
        <div className="quiz-frame mt-6" style={{border: '2px solid rgba(30, 64, 175, 0.4)', borderRadius: '1rem', background: '#fff'}}>
          <FindYourFilterQuiz />
        </div>
        <div className="h-8" />
        
        <div className="text-center mt-8">
          <br></br>
          <p className="text-gray-600 mb-4">
            Or browse our full collection:
          </p>
          <a 
            href="/collections" 
            className="quiz-button"
          >
            Shop All Air Purifiers
          </a>
        </div>
      </div>
    </div>
  );
}