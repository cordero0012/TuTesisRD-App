export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "brand": {
                    orange: '#d97706', // Updated from #ea9a23 for better contrast (WCAG AA compliant)
                    'orange-light': '#f59e0b', // For backgrounds where contrast isn't critical
                    dark: '#1a1a1a',
                    gray: '#f7f7f8',
                    light: '#ffffff',
                    // Compat for new components
                    50: '#f7f7f8',
                    100: '#ffdaa8',
                    500: '#d97706', // Updated
                    600: '#b45309',
                    900: '#1a1a1a',
                    950: '#1a1a1a',
                },
                "primary": "#d97706", // Updated for contrast
                "primary-dark": "#b45309",
                "accent": "#FBBF24",
                "background-light": "#f6f7f8",
                "background-dark": "#101822",
                "surface-light": "#ffffff",
                "surface-dark": "#1a2430",
                "academic": {
                    "navy": "#0F172A",
                    "gold": "#D97706",
                    "cream": "#F8FAFC",
                    "slate": "#334155",
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Outfit"', '"Inter"', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glass-sm': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(234, 154, 35, 0.5)',
                'glow-lg': '0 0 30px rgba(234, 154, 35, 0.6)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
