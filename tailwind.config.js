/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF1493',
          light: '#FFB3E6',
          dark: '#DC143C'
        },
        secondary: {
          DEFAULT: '#FF6B35',
          light: '#FFD6CC',
          dark: '#E55100'
        },
        accent: {
          DEFAULT: '#00E5FF',
          teal: '#00BFA5',
          lime: '#64DD17',
          purple: '#9C27B0'
        },
        surface: {
          50: '#fefefe',
          100: '#fafbfc',
          200: '#f0f4f8',
          300: '#dde7ee',
          400: '#a2b8c7',
          500: '#6b8199',
          600: '#54657a',
          700: '#3e4c59',
          800: '#2a3441',
          900: '#1a202a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'pregnant-glow': '0 0 30px rgba(233, 30, 99, 0.2), 0 0 60px rgba(233, 30, 99, 0.1)',
        'chat-glow': '0 0 20px rgba(233, 30, 99, 0.15), 0 0 40px rgba(233, 30, 99, 0.1)'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      animation: {
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'chat-float': 'chatFloat 4s ease-in-out infinite',
        'message-in': 'messageIn 0.3s ease-out',
        'typing-dot': 'typingDot 1.4s infinite ease-in-out',
        'chat-slide-up': 'chatSlideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s infinite'
      },
      keyframes: {
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        chatFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(1deg)' },
          '75%': { transform: 'translateY(-2px) rotate(-1deg)' }
        },
        messageIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0px) scale(1)' }
        },
        typingDot: {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' }
        },
        chatSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}