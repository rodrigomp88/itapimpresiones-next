/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ocean-blue': {
          DEFAULT: '#0185C1',
          dark: '#016fa3',
          light: '#02a8e8',
        },
        'ocean-mist': {
          DEFAULT: '#02AE9C',
          dark: '#018a7c',
          light: '#03d4be',
        },
        'raspberry-red': {
          DEFAULT: '#E01358',
          dark: '#b80f48',
          light: '#f02870',
        },
        'prussian-blue': {
          DEFAULT: '#1A2333',
          light: '#253347',
          lighter: '#2c3d54',
        },
        'deep-saffron': {
          DEFAULT: '#FE900B',
          dark: '#d97a08',
          light: '#ffa333',
        },
        primary: {
          DEFAULT: '#0185C1',
          dark: '#016fa3',
          light: '#02a8e8',
        },
        accent: {
          DEFAULT: '#E01358',
          dark: '#b80f48',
          light: '#f02870',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
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
