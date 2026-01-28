import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    className={`
                        w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 
                        border font-medium text-slate-900 dark:text-white placeholder-slate-400
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${icon ? 'pl-12' : ''}
                        ${error
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 ml-1 text-sm text-red-500 font-medium animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
