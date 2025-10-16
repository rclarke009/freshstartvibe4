import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Choose Your Purifier | Fresh Start Air Purifiers' },
    { name: 'description', content: 'Find the perfect air purifier for your space with our interactive selection tool. Get personalized recommendations based on your needs.' },
  ];
};

export default function ChooseYourPurifier() {
  return (
    <div className="coming-soon-page">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
          Choose Your Purifier
        </h1>
        
        <div className="bg-[#F0F8FF] rounded-2xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1e40af] mb-4">
            Coming Soon!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We're working on an interactive tool to help you find the perfect air purifier for your needs. 
            This will include questions about your space, concerns, and preferences to give you personalized recommendations.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1e40af] mb-4">
              What to expect:
            </h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-[#1e40af] mr-2">•</span>
                <span>Personalized recommendations based on your specific needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1e40af] mr-2">•</span>
                <span>Room size and usage analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1e40af] mr-2">•</span>
                <span>Allergy and sensitivity considerations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1e40af] mr-2">•</span>
                <span>Noise level preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1e40af] mr-2">•</span>
                <span>Budget-friendly options</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            In the meantime, you can browse our full collection of air purifiers:
          </p>
          <a 
            href="/collections" 
            className="inline-block bg-white border-2 border-[#1e40af] text-[#1e40af] px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] hover:text-white transition-colors"
          >
            Shop All
          </a>
        </div>
      </div>
    </div>
  );
}