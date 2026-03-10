export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                "tutesis": {
                    orange: '#F29727',
                    white: '#F7F7F7',
                    gold: '#D99A4E',
                    light: '#F2F2F2',
                    black: '#0D0D0D',
                },
                "admin": {
                    "bg": "var(--admin-bg)",
                    "surface": "var(--admin-surface)",
                    "card": "var(--admin-card)",
                    "border": "var(--admin-border)",
                    "border-strong": "var(--admin-border-strong)",
                    "text": "var(--admin-text)",
                    "muted": "var(--admin-text-muted)",
                    "accent": "var(--admin-accent)",
                    "accent-hover": "var(--admin-accent-hover)",
                    "success": "var(--admin-success)",
                    "warning": "var(--admin-warning)",
                    "danger": "var(--admin-danger)",
                    "info": "var(--admin-info)",
                },
                "brand": {
                    orange: '#F29727',
                    'orange-light': '#D99A4E',
                    dark: '#0D0D0D',
                    gray: '#F7F7F7',
                    light: '#ffffff',
                    50: '#F7F7F7',
                    100: '#F2F2F2',
                    500: '#F29727',
                    600: '#D99A4E',
                    900: '#0D0D0D',
                    950: '#020617',
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
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
            },
        },
        plugins: [
            require('@tailwindcss/typography'),
        ],
    },
};
