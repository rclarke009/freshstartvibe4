import { MetaFunction } from '@remix-run/react';
import QuickPicker from '~/components/QuickPicker';

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

      <QuickPicker />
    </div>
  );
}