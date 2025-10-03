import { scoreAnswers, getRecommendations, type QuizAnswers } from './quizLogic';

// Test the scoring logic with various scenarios
describe('Quiz Logic', () => {
  test('should recommend HealthMate Plus for VOC concerns', () => {
    const answers: QuizAnswers = {
      'filtration-needs': ['fragrances-vocs', 'formaldehyde'],
      'sensitivity-level': ['sensitive'],
      'noise-tolerance': ['any'],
      'budget-comfort': ['mid'],
      'space-placement': ['living-area']
    };

    const recommendations = getRecommendations(answers);
    expect(recommendations[0].id).toBe('HMP'); // HealthMate Plus should be top
  });

  test('should recommend Junior variants for small spaces', () => {
    const answers: QuizAnswers = {
      'filtration-needs': ['dust-pollen'],
      'sensitivity-level': ['typical'],
      'noise-tolerance': ['low'],
      'budget-comfort': ['entry'],
      'space-placement': ['small-office']
    };

    const recommendations = getRecommendations(answers);
    expect(recommendations[0].id).toBe('AllergyJr'); // Should recommend Junior variant
  });

  test('should recommend Bedroom Machine for virus concerns and low noise', () => {
    const answers: QuizAnswers = {
      'filtration-needs': ['viruses-bacteria'],
      'sensitivity-level': ['sensitive'],
      'noise-tolerance': ['low'],
      'budget-comfort': ['premium'],
      'space-placement': ['bedroom']
    };

    const recommendations = getRecommendations(answers);
    expect(recommendations[0].id).toBe('Bedroom'); // Bedroom Machine should be top
  });

  test('should recommend Immunity Machine for high exposure environments', () => {
    const answers: QuizAnswers = {
      'filtration-needs': ['fragrances-vocs', 'formaldehyde', 'viruses-bacteria'],
      'sensitivity-level': ['very-sensitive'],
      'noise-tolerance': ['any'],
      'budget-comfort': ['premium'],
      'space-placement': ['classroom-clinic']
    };

    const recommendations = getRecommendations(answers);
    expect(recommendations[0].id).toBe('Immunity'); // Immunity Machine should be top
  });

  test('should handle budget constraints correctly', () => {
    const answers: QuizAnswers = {
      'filtration-needs': ['general-freshness'],
      'sensitivity-level': ['typical'],
      'noise-tolerance': ['any'],
      'budget-comfort': ['entry'],
      'space-placement': ['living-area']
    };

    const recommendations = getRecommendations(answers);
    // Should not recommend premium models like Bedroom or Immunity
    expect(recommendations.every(rec => !['Bedroom', 'Immunity'].includes(rec.id))).toBe(true);
  });
});

// Helper function to run tests in browser console
if (typeof window !== 'undefined') {
  (window as any).testQuizLogic = () => {
    console.log('Running quiz logic tests...');
    
    const testAnswers: QuizAnswers = {
      'filtration-needs': ['fragrances-vocs', 'formaldehyde'],
      'sensitivity-level': ['sensitive'],
      'noise-tolerance': ['any'],
      'budget-comfort': ['mid'],
      'space-placement': ['living-area']
    };

    const recommendations = getRecommendations(testAnswers);
    console.log('Test recommendations:', recommendations);
    
    return recommendations;
  };
}
