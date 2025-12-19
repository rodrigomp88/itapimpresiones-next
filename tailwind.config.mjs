/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Usar class strategy para modo oscuro
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#196ee6',
          dark: '#0d47a1',
        },
        accent: '#fbc02d',
      },
      fontFamily: {
        display: ['Work Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
