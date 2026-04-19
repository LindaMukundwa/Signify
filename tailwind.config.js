/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          dark: '#0F6E56',
          light: '#E1F5EE',
        },
        danger: '#E24B4A',
        warning: '#BA7517',
        success: '#639922',
        bg: '#F8F8F7',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F1EFE8',
        },
        text: {
          primary: '#2C2C2A',
          secondary: '#5F5E5A',
          muted: '#888780',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.1)',
          strong: 'rgba(0,0,0,0.2)',
        },
      },
      maxWidth: {
        app: '512px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
