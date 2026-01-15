module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "brand": {
                    orange: '#ea9a23',
                    dark: '#1a1a1a',
                    gray: '#f7f7f8',
                    light: '#ffffff',
                },
                "primary": "#ea9a23",
                "primary-dark": "#d98a12",
                "accent": "#FBBF24",
                "background-light": "#f6f7f8",
                "background-dark": "#101822",
                "surface-light": "#ffffff",
                "surface-dark": "#1a2430",
            },
            fontFamily: {
                "display": ["Inter", "Lexend", "sans-serif"],
                "body": ["Inter", "Noto Sans", "sans-serif"],
                "sans": ["Inter", "sans-serif"],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
