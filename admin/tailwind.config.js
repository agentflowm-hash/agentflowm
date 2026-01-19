/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#FC682C',
        'accent-dark': '#e55a1f',
      },
    },
  },
  plugins: [],
};
