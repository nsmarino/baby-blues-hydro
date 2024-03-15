import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    colors: {
      blue: "#0057FF"
    },
    fontFamily: {
      'sans': 'Helvetica, Arial, sans-serif',
      'serif': 'Garamond',
      'mono': 'Courier New',
    }
  }
};
