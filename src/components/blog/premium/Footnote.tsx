"use client";

import React from 'react';

type FootnoteProps = {
    id: string;
    content: string;
};

export const Footnote = ({ id, content }: FootnoteProps) => {
    return (
        <span className="group relative inline-block align-super text-xs leading-none">
            <button
                aria-describedby={`footnote-${id}`}
                className="text-brand-orange hover:text-orange-700 font-bold px-0.5 cursor-pointer ml-0.5 transition-colors"
            >
                [{id}]
            </button>

            {/* Tooltip Content */}
            <span
                id={`footnote-${id}`}
                role="tooltip"
                className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded shadow-xl z-50 transition-all duration-200 font-sans leading-normal pointer-events-none text-center"
            >
                {content}
                {/* Triangle Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
            </span>
        </span>
    );
};

export default Footnote;
