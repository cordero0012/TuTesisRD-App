"use client";

import React, { useEffect, useState } from 'react';

export const ReadingProgressBar = () => {
    const [width, setWidth] = useState(0);

    const scrollHeight = () => {
        const el = document.documentElement;
        const ScrollTop = el.scrollTop || document.body.scrollTop;
        const ScrollHeight = el.scrollHeight || document.body.scrollHeight;
        const percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100;
        setWidth(percent);
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHeight);
        return () => window.removeEventListener('scroll', scrollHeight);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent pointer-events-none">
            <div
                className="h-full bg-brand-orange transition-all duration-150 ease-out shadow-[0_0_10px_rgba(217,119,6,0.7)]"
                style={{ width: `${width}%` }}
            />
        </div>
    );
};

export default ReadingProgressBar;
