import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`}></div>
    );
};

export default Skeleton;
