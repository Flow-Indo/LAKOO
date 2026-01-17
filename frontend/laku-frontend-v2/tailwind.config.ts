import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',   // Small mobile → 3-col grid
        'md': '768px',   // Tablet → Left sidebar appears
        'lg': '1024px',  // Desktop → Right sidebar appears
        'xl': '1280px',  // Desktop L → 5-col grid
        '2xl': '1536px', // Keep default
      },
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#FF4444',
          light: '#FF8E53',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          'from': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        slideDown: {
          'from': {
            transform: 'translateY(0)',
            opacity: '1'
          },
          'to': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      padding: {
        'safe': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
export default config


