import { useState } from 'react';

// Scoring rules from requirements
const rules = {
  pets: { HM: 3, HMP: 2, Bedroom: 1 },
  allergies: { Allergy: 4, HM: 2, Bedroom: 1 },
  vocs: { HMP: 4, Immunity: 3, Bedroom: 2, HM: 1 },
  smoke: { HMP: 3, Immunity: 3, HM: 2 },
  viruses: { Bedroom: 3, Immunity: 2 },
  unsure: { HM: 1, Bedroom: 1 },
};

const placementNudges = {
  bedroom: { Bedroom: 2, HM: 1 },
  small: { HMjr: 2, AllergyJr: 2 },
  living: { HM: 1, HMP: 1 },
  clinic: { Immunity: 2 },
};

// Model configurations (we'll expand this)
const models = {
  HM: {
    name: 'HealthMate',
    description: 'Perfect for general air cleaning and allergen reduction',
    handle: 'healthmate',
  },
  HMP: {
    name: 'HealthMate Plus',
    description: 'Advanced filtration for VOCs, smoke, and chemical odors',
    handle: 'healthmate-plus',
  },
  Bedroom: {
    name: 'Bedroom',
    description: 'Ultra-quiet operation perfect for bedrooms and virus protection',
    handle: 'bedroom',
  },
  Allergy: {
    name: 'Allergy',
    description: 'Specialized for pollen, dust, and allergen removal',
    handle: 'allergy',
  },
  Immunity: {
    name: 'Immunity',
    description: 'Medical-grade filtration for viruses and bacteria',
    handle: 'immunity',
  },
  HMjr: {
    name: 'HealthMate Jr',
    description: 'Compact version perfect for small spaces',
    handle: 'healthmate-jr',
  },
  AllergyJr: {
    name: 'Allergy Jr',
    description: 'Compact allergen fighter for small rooms',
    handle: 'allergy-jr',
  },
};

interface QuickPickerProps {
  className?: string;
}

export default function QuickPicker({ className = '' }: QuickPickerProps) {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<string>('');
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Recommendation logic
  function recommend(needs: string[], place: keyof typeof placementNudges) {
    const score: Record<string, number> = {};
    
    // Add scores from needs
    for (const need of needs) {
      for (const [model, value] of Object.entries(rules[need as keyof typeof rules] || {})) {
        score[model] = (score[model] || 0) + value;
      }
    }
    
    // Add placement nudges
    for (const [model, value] of Object.entries(placementNudges[place] || {})) {
      score[model] = (score[model] || 0) + value;
    }
    
    // Special rules
    if (needs.includes('vocs')) score['HMP'] = (score['HMP'] || 0) + 1;
    if (needs.includes('viruses') && place === 'bedroom') score['Bedroom'] = (score['Bedroom'] || 0) + 2;
    
    // Get top 2 models
    const top = Object.entries(score)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([model]) => model);
    
    return top;
  }

  const recommendations = selectedNeeds.length > 0 && selectedPlacement 
    ? recommend(selectedNeeds, selectedPlacement as keyof typeof placementNudges)
    : [];

  const handleNeedToggle = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          needs: selectedNeeds,
          placement: selectedPlacement,
          picks: recommendations,
        }),
      });

      if (response.ok) {
        setEmailSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit email:', error);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Needs Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#1e40af] mb-4">
          What do you need help with?
        </h2>
        <p className="text-gray-600 mb-4">Select all that apply:</p>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'pets', label: 'Pets' },
            { id: 'allergies', label: 'Allergies (pollen/mold)' },
            { id: 'vocs', label: 'Fragrances/VOCs' },
            { id: 'smoke', label: 'Smoke' },
            { id: 'viruses', label: 'Viruses' },
            { id: 'unsure', label: "I'm not sure" },
          ].map((need) => (
            <button
              key={need.id}
              onClick={() => handleNeedToggle(need.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                selectedNeeds.includes(need.id)
                  ? 'bg-[#1e40af] text-white border-[#1e40af]'
                  : 'bg-white text-[#1e40af] border-[#1e40af] hover:bg-blue-50'
              }`}
            >
              {need.label}
            </button>
          ))}
        </div>
      </div>

      {/* Placement Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#1e40af] mb-4">
          Where will it live?
        </h2>
        <p className="text-gray-600 mb-4">Choose one:</p>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'bedroom', label: 'Bedroom' },
            { id: 'small', label: 'Small office/nursery' },
            { id: 'living', label: 'Living room/open space' },
            { id: 'clinic', label: 'Classroom/clinic' },
          ].map((placement) => (
            <button
              key={placement.id}
              onClick={() => setSelectedPlacement(placement.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                selectedPlacement === placement.id
                  ? 'bg-[#1e40af] text-white border-[#1e40af]'
                  : 'bg-white text-[#1e40af] border-[#1e40af] hover:bg-blue-50'
              }`}
            >
              {placement.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e40af] mb-6">
            Our Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((modelKey, index) => {
              const model = models[modelKey as keyof typeof models];
              if (!model) return null;

              return (
                <div
                  key={modelKey}
                  className={`bg-white rounded-xl p-6 shadow-lg border-2 ${
                    index === 0 ? 'border-[#1e40af]' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[#1e40af]">
                      {model.name}
                    </h3>
                    {index === 0 && (
                      <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Best Match
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{model.description}</p>
                  <a
                    href={`/products/${model.handle}`}
                    className="add-to-cart-button inline-block text-center"
                  >
                    View Product
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Email Capture */}
      {recommendations.length > 0 && !emailSubmitted && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#1e40af] mb-2">
            Email me these results
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Get a copy of your recommendations sent to your inbox for easy reference.
          </p>
          <form onSubmit={handleEmailSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="add-to-cart-button px-6 py-2"
            >
              Send Results
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            We respect your privacy. Your email will only be used to send these recommendations.
          </p>
        </div>
      )}

      {emailSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800">
            ✅ Your recommendations have been sent to your email!
          </p>
        </div>
      )}
    </div>
  );
}
