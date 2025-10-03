import { PurifierModel } from '~/components/ResultCard';

export type Model = 'HM' | 'HMjr' | 'HMP' | 'HMPjr' | 'Allergy' | 'AllergyJr' | 'Bedroom' | 'Immunity';

export interface QuizAnswers {
  [stepId: string]: string[];
}

export interface ModelScores {
  [key in Model]: number;
}

// Product catalog data
export const PURIFIER_MODELS: Record<Model, PurifierModel> = {
  HM: {
    id: 'HM',
    name: 'HealthMate',
    slug: 'healthmate',
    whyFit: 'Balanced particle + odor removal with a large carbon bed—great everyday choice.',
    excelsAt: ['VOCs', 'Odors', 'General Air Quality'],
    sizeGuidance: 'Standard (up to 700 sq ft)',
    filterLife: '5 years',
    replacementCost: '$89',
    msrp: '$599',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  HMjr: {
    id: 'HMjr',
    name: 'HealthMate Junior',
    slug: 'healthmate-junior',
    whyFit: 'Compact version of our HealthMate, perfect for smaller spaces.',
    excelsAt: ['VOCs', 'Odors', 'Small Rooms'],
    sizeGuidance: 'Junior (up to 300 sq ft)',
    filterLife: '5 years',
    replacementCost: '$79',
    msrp: '$449',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  HMP: {
    id: 'HMP',
    name: 'HealthMate Plus',
    slug: 'healthmate-plus',
    whyFit: 'Renovations or new cabinetry? HealthMate Plus targets formaldehyde & VOCs with a specialized carbon/zeolite blend.',
    excelsAt: ['Formaldehyde', 'VOCs', 'New Construction'],
    sizeGuidance: 'Standard (up to 700 sq ft)',
    filterLife: '5 years',
    replacementCost: '$99',
    msrp: '$699',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  HMPjr: {
    id: 'HMPjr',
    name: 'HealthMate Plus Junior',
    slug: 'healthmate-plus-junior',
    whyFit: 'Compact version with enhanced VOC and formaldehyde protection.',
    excelsAt: ['Formaldehyde', 'VOCs', 'Small Rooms'],
    sizeGuidance: 'Junior (up to 300 sq ft)',
    filterLife: '5 years',
    replacementCost: '$89',
    msrp: '$549',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  Allergy: {
    id: 'Allergy',
    name: 'Allergy Machine',
    slug: 'allergy-machine',
    whyFit: 'Extra focus on pollen, dust, and mold allergens for reactive airways.',
    excelsAt: ['Pollen', 'Dust', 'Mold', 'Allergies'],
    sizeGuidance: 'Standard (up to 700 sq ft)',
    filterLife: '5 years',
    replacementCost: '$89',
    msrp: '$599',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  AllergyJr: {
    id: 'AllergyJr',
    name: 'Allergy Machine Junior',
    slug: 'allergy-machine-junior',
    whyFit: 'Compact allergy relief for smaller spaces.',
    excelsAt: ['Pollen', 'Dust', 'Mold', 'Small Rooms'],
    sizeGuidance: 'Junior (up to 300 sq ft)',
    filterLife: '5 years',
    replacementCost: '$79',
    msrp: '$449',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  Bedroom: {
    id: 'Bedroom',
    name: 'Bedroom Machine',
    slug: 'bedroom-machine',
    whyFit: 'For sleepers & sensitive airways: adds HEGA for gases and night-friendly operation.',
    excelsAt: ['Viruses', 'Bacteria', 'Night Use', 'Sensitive Sleepers'],
    sizeGuidance: 'Standard (up to 700 sq ft)',
    filterLife: '5 years',
    replacementCost: '$99',
    msrp: '$699',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  },
  Immunity: {
    id: 'Immunity',
    name: 'Immunity Machine',
    slug: 'immunity-machine',
    whyFit: 'Our most comprehensive 8-phase defense—prefilters, multi-carbon/zeolite, medical HEPA, and HEGA—for high-exposure environments.',
    excelsAt: ['VOCs', 'Formaldehyde', 'Viruses', 'High Exposure'],
    sizeGuidance: 'Standard (up to 700 sq ft)',
    filterLife: '5 years',
    replacementCost: '$119',
    msrp: '$899',
    imageUrl: '/fresh-start-air-purifiers-logo-circle.png'
  }
};

// Scoring weights based on requirements
const CONCERN_WEIGHTS: Record<string, Partial<ModelScores>> = {
  'fragrances-vocs': {
    HMP: 4,
    Bedroom: 3,
    Immunity: 5,
    HM: 2,
    HMPjr: 3,
    HMjr: 1
  },
  'formaldehyde': {
    HMP: 5,
    Immunity: 4,
    Bedroom: 3,
    HMPjr: 4,
    HM: 1,
    HMjr: 1
  },
  'smoke': {
    HMP: 4,
    HM: 3,
    Immunity: 4,
    HMPjr: 3,
    HMjr: 2,
    Bedroom: 2
  },
  'dust-pollen': {
    Allergy: 4,
    HM: 3,
    Bedroom: 2,
    Immunity: 2,
    AllergyJr: 4,
    HMjr: 2
  },
  'mold-sensitivity': {
    Allergy: 4,
    Bedroom: 3,
    HM: 2,
    Immunity: 2,
    AllergyJr: 4,
    HMjr: 1
  },
  'viruses-bacteria': {
    Bedroom: 4,
    Immunity: 3,
    HM: 2,
    HMP: 2,
    HMjr: 1,
    HMPjr: 1
  },
  'pet-dander': {
    HM: 3,
    HMP: 3,
    Bedroom: 2,
    Immunity: 2,
    HMjr: 2,
    HMPjr: 2
  },
  'general-freshness': {
    HM: 3,
    HMP: 2,
    Allergy: 2,
    Immunity: 2,
    HMjr: 2,
    HMPjr: 1
  }
};

const SENSITIVITY_WEIGHTS: Record<string, Partial<ModelScores>> = {
  'sensitive': {
    Allergy: 1,
    Bedroom: 1,
    HMP: 1,
    Immunity: 1,
    AllergyJr: 1,
    HMPjr: 1
  },
  'very-sensitive': {
    HMP: 2,
    Immunity: 2,
    Bedroom: 1,
    Allergy: 1,
    HMPjr: 2,
    AllergyJr: 1
  }
};

const NOISE_WEIGHTS: Record<string, Partial<ModelScores>> = {
  'low': {
    Bedroom: 1,
    Allergy: 1,
    HM: 1,
    HMP: 1,
    Immunity: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  },
  'any': {
    HM: 1,
    HMP: 1,
    Immunity: 1,
    Allergy: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  }
};

const BUDGET_WEIGHTS: Record<string, Partial<ModelScores>> = {
  'entry': {
    Bedroom: -2,
    Immunity: -2,
    HMP: -1,
    HM: 1,
    Allergy: 1,
    HMjr: 1,
    AllergyJr: 1,
    HMPjr: 1
  },
  'premium': {
    Bedroom: 2,
    HMP: 2,
    Immunity: 2,
    HM: 1,
    Allergy: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  }
};

const PLACEMENT_WEIGHTS: Record<string, Partial<ModelScores>> = {
  'bedroom': {
    Bedroom: 2,
    HM: 1,
    HMP: 1,
    Immunity: 1,
    Allergy: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  },
  'living-area': {
    HM: 1,
    HMP: 1,
    Immunity: 1,
    Allergy: 1,
    Bedroom: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  },
  'small-office': {
    HMjr: 2,
    HMPjr: 2,
    AllergyJr: 2,
    HM: 1,
    HMP: 1,
    Allergy: 1,
    Bedroom: 1,
    Immunity: 1
  },
  'classroom-clinic': {
    Immunity: 2,
    HM: 1,
    HMP: 1,
    Allergy: 1,
    Bedroom: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  },
  'whole-apartment': {
    HM: 1,
    HMP: 1,
    Immunity: 1,
    Allergy: 1,
    Bedroom: 1,
    HMjr: 1,
    HMPjr: 1,
    AllergyJr: 1
  }
};

export function scoreAnswers(answers: QuizAnswers): ModelScores {
  const scores: ModelScores = {
    HM: 0,
    HMjr: 0,
    HMP: 0,
    HMPjr: 0,
    Allergy: 0,
    AllergyJr: 0,
    Bedroom: 0,
    Immunity: 0
  };

  // Score based on filtration concerns
  const concerns = answers['filtration-needs'] || [];
  concerns.forEach(concern => {
    const weights = CONCERN_WEIGHTS[concern];
    if (weights) {
      Object.entries(weights).forEach(([model, weight]) => {
        scores[model as Model] += weight || 0;
      });
    }
  });

  // Score based on sensitivity level
  const sensitivity = answers['sensitivity-level']?.[0];
  if (sensitivity) {
    const weights = SENSITIVITY_WEIGHTS[sensitivity];
    if (weights) {
      Object.entries(weights).forEach(([model, weight]) => {
        scores[model as Model] += weight || 0;
      });
    }
  }

  // Score based on noise tolerance
  const noise = answers['noise-tolerance']?.[0];
  if (noise) {
    const weights = NOISE_WEIGHTS[noise];
    if (weights) {
      Object.entries(weights).forEach(([model, weight]) => {
        scores[model as Model] += weight || 0;
      });
    }
  }

  // Score based on budget
  const budget = answers['budget-comfort']?.[0];
  if (budget) {
    const weights = BUDGET_WEIGHTS[budget];
    if (weights) {
      Object.entries(weights).forEach(([model, weight]) => {
        scores[model as Model] += weight || 0;
      });
    }
  }

  // Score based on space & placement
  const placement = answers['space-placement']?.[0];
  if (placement) {
    const weights = PLACEMENT_WEIGHTS[placement];
    if (weights) {
      Object.entries(weights).forEach(([model, weight]) => {
        scores[model as Model] += weight || 0;
      });
    }
  }

  return scores;
}

export function inferSizeVariant(model: Model, placement: string): Model {
  // Convert to Junior variants for small spaces
  if (placement === 'small-office') {
    switch (model) {
      case 'HM': return 'HMjr';
      case 'HMP': return 'HMPjr';
      case 'Allergy': return 'AllergyJr';
      default: return model;
    }
  }
  
  return model;
}

export function rankModels(scores: ModelScores, placement: string): Model[] {
  // Apply size variant logic
  const adjustedScores: ModelScores = { ...scores };
  Object.keys(scores).forEach(model => {
    const variant = inferSizeVariant(model as Model, placement);
    if (variant !== model) {
      adjustedScores[variant] = scores[model as Model];
      adjustedScores[model as Model] = 0;
    }
  });

  // Sort by score and return top 3
  return Object.entries(adjustedScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([model]) => model as Model)
    .filter(model => adjustedScores[model] > 0);
}

export function getRecommendations(answers: QuizAnswers): PurifierModel[] {
  const scores = scoreAnswers(answers);
  const placement = answers['space-placement']?.[0] || '';
  const rankedModels = rankModels(scores, placement);
  
  return rankedModels.map(model => PURIFIER_MODELS[model]);
}
