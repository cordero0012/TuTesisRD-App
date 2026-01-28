import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const variants = {
        primary: "bg-brand-orange text-white hover:bg-brand-600 shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 focus:ring-brand-orange/50",
        secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-gray-200",
        outline: "bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 focus:ring-brand-orange/50",
        ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-brand-orange focus:ring-gray-200",
        glass: "bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white backdrop-blur-md border border-white/20 hover:bg-white/90 dark:hover:bg-black/60 shadow-glass hover:shadow-glass-sm",
        gradient: "bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-glow hover:shadow-glow-lg hover:brightness-110 border-none",
    };

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className} ${isLoading ? 'cursor-wait' : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="material-icons animate-spin mr-2 text-sm">autorenew</span>
            )}
            {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
        </button>
    );
};

export default Button;
