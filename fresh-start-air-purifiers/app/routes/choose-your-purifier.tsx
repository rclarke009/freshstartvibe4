import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Choose Your Purifier | Fresh Start Air Purifiers' },
    { name: 'description', content: 'Find the perfect air purifier for your space with our interactive selection tool. Get personalized recommendations based on your needs.' },
  ];
};

export default function ChooseYourPurifier() {
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

      <div className="bg-[#F0F8FF] rounded-2xl p-8 md:p-12 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1e40af] mb-6 text-center">
          Coming Soon!
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center">
          We're working on an interactive tool to help you find the perfect air purifier for your needs. 
          This will include questions about your space, concerns, and preferences to give you personalized recommendations.
        </p>
        
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-[#1e40af] mb-4">
            What to Expect:
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-[#1e40af] mr-3">•</span>
              <span>Room size assessment and air quality concerns</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#1e40af] mr-3">•</span>
              <span>Personalized purifier recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#1e40af] mr-3">•</span>
              <span>Side-by-side model comparisons</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#1e40af] mr-3">•</span>
              <span>Filter replacement schedules and costs</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            In the meantime, you can browse our full collection or contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/collections" 
              className="inline-flex items-center justify-center px-6 py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#1e40af] hover:text-white transition-colors duration-200"
            >
              Browse All Purifiers
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1e40af] text-white font-medium rounded-lg hover:bg-[#0f2d6b] transition-colors duration-200"
            >
              Get Personal Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}