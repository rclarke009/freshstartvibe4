# Choose Your Purifier Quiz Feature

This document describes the interactive air purifier selection quiz feature implemented for the Fresh Start Air Purifiers website.

## Overview

The quiz helps visitors find the perfect Austin Air purifier model based on their specific needs, concerns, and preferences. It follows the requirements outlined in `choose-your-purifier-requirements-2.md`.

## Features

- **5-step guided quiz** with progress bar
- **Multi-select and single-select questions**
- **Intelligent scoring algorithm** that matches concerns to purifier capabilities
- **Personalized recommendations** (top 1-3 models)
- **Side-by-side comparison** of recommended models
- **Email results** functionality for lead capture
- **Mobile-first responsive design**
- **Accessibility compliant** (WCAG AA)

## Quiz Flow

1. **Filtration Needs** - Multi-select chips for air quality concerns
2. **Sensitivity Level** - Typical, Sensitive, or Very Sensitive (MCS/MCAS)
3. **Noise Tolerance** - Low, Medium, or Any (with bedroom hint)
4. **Budget Comfort** - Entry, Mid, or Premium
5. **Space & Placement** - Where the purifier will be used most

## Components

### Core Components
- `QuizStepper.tsx` - Main quiz interface with progress tracking
- `ResultCard.tsx` - Individual recommendation display
- `CompareTable.tsx` - Side-by-side model comparison
- `EmailResults.tsx` - Email capture and sending

### Logic & Data
- `quizLogic.ts` - Scoring algorithm and product recommendations
- `api/email-results.ts` - API endpoint for email functionality

## Product Models

The quiz supports all Austin Air models:

- **HealthMate (HM/HM Jr)** - Balanced particle + odors
- **HealthMate Plus (HMP/HMP Jr)** - Enhanced VOC/formaldehyde capability
- **Allergy Machine (Allergy/Allergy Jr)** - Particle-first for allergies
- **Bedroom Machine** - HEGA + night-friendly operation
- **Immunity Machine** - 8-phase comprehensive defense

## Scoring Logic

The algorithm assigns points based on:

- **Concern weights** - Each concern maps to specific model strengths
- **Sensitivity level** - Higher sensitivity favors enhanced models
- **Noise tolerance** - Low noise preference favors quieter models
- **Budget constraints** - Entry budget limits premium models
- **Space size** - Automatically recommends Junior variants for small spaces

## Customization

### Adding New Questions
1. Add question to `QUIZ_STEPS` in `choose-your-purifier.tsx`
2. Update scoring weights in `quizLogic.ts`
3. Add corresponding logic to `scoreAnswers()` function

### Modifying Product Data
Edit the `PURIFIER_MODELS` object in `quizLogic.ts` to update:
- Product names and descriptions
- Pricing information
- Feature highlights
- Image URLs

### Styling
Quiz-specific styles are in `app/styles/app.css` under the "Quiz Components Styling" section.

## API Integration

### Email Results
The quiz includes an API endpoint at `/api/email-results` that:
- Accepts POST requests with email and quiz data
- Validates email format
- Logs the lead (ready for email service integration)
- Returns success/error responses

To integrate with your email service:
1. Replace the placeholder logic in `api/email-results.ts`
2. Add your email service credentials
3. Customize the email template

## Analytics Tracking

The quiz is ready for analytics integration. Track these events:
- Quiz start
- Step progression
- Quiz completion
- Product link clicks
- Compare table opens
- Email submissions

## Performance

- **Bundle size**: Quiz components are optimized for minimal impact
- **Loading**: Lazy loading for comparison images
- **Mobile**: Touch-friendly 44px minimum targets
- **Accessibility**: Full keyboard navigation and screen reader support

## Testing

Run the test suite with:
```bash
npm test quizLogic.test.ts
```

Or test in browser console:
```javascript
testQuizLogic() // Available in browser console
```

## Future Enhancements

The codebase is structured to easily add:
- "Good/Better/Best" budget ribbons
- Local AQI awareness
- User account integration
- Inline education cards
- A/B testing for different quiz flows

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Accessibility tools (screen readers, keyboard navigation)

## Maintenance

To update the quiz:
1. Modify product data in `quizLogic.ts`
2. Adjust scoring weights as needed
3. Update question text in `choose-your-purifier.tsx`
4. Test with various answer combinations

The scoring algorithm is designed to be easily tunable based on real user data and conversion metrics.
