/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx,css}',
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          50: '#ebf3ff',
          100: '#dceefe',
          200: '#b7dbfd',
          300: '#8fc8fb',
          400: '#5fb3f8',
          500: '#2f9ff5',
          600: '#1f7de0',
          700: '#175fb4',
          800: '#0f3f7f',
          900: '#07264a',
        },
        secondary: {
          DEFAULT: '#06b6d4',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        text: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.75rem',
        full: '9999px',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      borderRadius: {
        md: '0.375rem',
      },
    },
  },
  plugins: [],
};
