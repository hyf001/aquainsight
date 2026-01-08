/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Depths 主题配色
        ocean: {
          navy: '#1a2332',      // 深海军蓝 - 主色
          teal: '#2d8b8b',      // 青色 - 强调色
          seafoam: '#a8dadc',   // 海泡绿 - 辅助色
          cream: '#f1faee',     // 米白 - 背景色
        },
        // 语义化颜色（方便使用）
        primary: {
          DEFAULT: '#1a2332',
          50: '#f4f6f7',
          100: '#e3e7eb',
          200: '#cad2d9',
          300: '#a6b2be',
          400: '#7a8c9c',
          500: '#5f7281',
          600: '#4f5d6c',
          700: '#434e5a',
          800: '#3b444d',
          900: '#1a2332',
          950: '#0f1419',
        },
        secondary: {
          DEFAULT: '#2d8b8b',
          50: '#f2f9f9',
          100: '#dcefef',
          200: '#bde0e0',
          300: '#90caca',
          400: '#5daaaa',
          500: '#428f8f',
          600: '#2d8b8b',
          700: '#2a6565',
          800: '#275252',
          900: '#254545',
          950: '#102727',
        },
        accent: {
          DEFAULT: '#a8dadc',
          50: '#f3fafb',
          100: '#d9f0f1',
          200: '#b7e3e6',
          300: '#a8dadc',
          400: '#6cb8bd',
          500: '#509ba0',
          600: '#427e86',
          700: '#3a656d',
          800: '#35545a',
          900: '#30464c',
          950: '#1b2d32',
        },
        background: '#f1faee',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'ocean': '0 4px 6px -1px rgba(26, 35, 50, 0.1), 0 2px 4px -2px rgba(26, 35, 50, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-down': 'slideInDown 0.6s ease-out',
        'move-background': 'moveBackground 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        moveBackground: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      },
    },
  },
  plugins: [],
}
