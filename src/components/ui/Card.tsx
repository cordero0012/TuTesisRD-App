import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient' | 'outline';
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hoverEffect = false,
    className = '',
    ...props
}) => {
    const baseStyles = "rounded-3xl transition-all duration-300 overflow-hidden";

    const hoverStyles = hoverEffect ? "hover:-translate-y-1 hover:shadow-xl" : "";

    const variants = {
        default: "bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm",
        glass: "bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-glass",
        gradient: "bg-gradient-to-br from-brand-orange to-red-500 text-white shadow-glow-lg",
        outline: "bg-transparent border-2 border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white",
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
