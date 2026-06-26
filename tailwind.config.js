/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F7F7F7',
        'text-primary': '#101010',
        'text-secondary': '#606060',
        'text-muted': '#AAAAAA',
        'border': '#EFEFEF',
        'surface-secondary': '#F1F1F1',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Sofia Sans Condensed', 'system-ui', '-apple-system', 'sans-serif'],
        logo: ['Pacifico', 'cursive'],
      },
      fontSize: {
        display: ['64px', { lineHeight: '0.86', letterSpacing: '-2px' }],
        'h1': ['56px', { lineHeight: '1', letterSpacing: '-1px' }],
        'h2': ['40px', { lineHeight: '1.1', letterSpacing: '0px' }],
        'h3': ['28px', { lineHeight: '1.14', letterSpacing: '0px' }],
        body: ['20px', { lineHeight: '1.6', letterSpacing: '0px' }],
        'body-sm': ['16px', { lineHeight: '1.5', letterSpacing: '0px' }],
        label: ['14px', { lineHeight: '1.43', letterSpacing: '1.4px' }],
      },
      spacing: {
        section: '96px',
        'container-margin': '64px',
        'gutter': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.2, 0, 0, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
};
