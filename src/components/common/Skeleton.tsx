import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    animation?: 'pulse' | 'wave' | 'none';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rect',
    animation = 'pulse',
    width,
    height,
}) => {
    const baseClasses = 'bg-slate-200 dark:bg-slate-700/50';

    const variantClasses = {
        text: 'rounded h-4 w-full mb-2',
        rect: 'rounded-xl',
        circle: 'rounded-full',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        none: '',
    };

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
