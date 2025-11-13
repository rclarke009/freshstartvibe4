/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', // Enable dark mode based on prefers-color-scheme
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Covers all app subfolders
    "./app/routes/**/*.{js,ts,jsx,tsx}", // Explicitly includes routes subfolder
  ],
  theme: {
    extend: {
      colors: {
        'navytext': '#1e3a8a', // Custom navy color
        'tealwave': '#14b8a6', // Custom teal color
      },
    },
  },
};