import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Choose Your Purifier | Fresh Start Air Purifiers' },
    { name: 'description', content: 'Find the perfect air purifier for your space with our interactive selection tool.' },
  ];
};

export default function Quiz() {
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
      
      <div className="bg-[#F0F8FF] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-[#1e40af] mb-4">
          Quiz Coming Soon
        </h2>
        <p className="text-gray-700">
          We're working on an interactive quiz to help you find the perfect air purifier. 
          Check back soon!
        </p>
      </div>
    </div>
  );
}
