"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CitationBoxProps = {
    apa: string;
    mla: string;
    bibtex: string;
};

export const CitationBox = ({ apa, mla, bibtex }: CitationBoxProps) => {
    const [activeTab, setActiveTab] = useState<'APA' | 'MLA' | 'BibTeX'>('APA');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = activeTab === 'APA' ? apa : activeTab === 'MLA' ? mla : bibtex;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 my-12 shadow-sm">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-icons text-brand-orange text-base">format_quote</span>
                    Citar este Artículo
                </h3>
                <div className="flex space-x-2 text-sm bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['APA', 'MLA', 'BibTeX'].map((format) => (
                        <button
                            key={format}
                            onClick={() => setActiveTab(format as any)}
                            className={`px-3 py-1.5 rounded-md transition-all duration-200 font-medium ${activeTab === format
                                    ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            {format}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 transition-colors">
                    <p className="pr-10 break-words leading-relaxed select-all">
                        {activeTab === 'APA' ? apa : activeTab === 'MLA' ? mla : bibtex}
                    </p>
                </div>
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md text-slate-400 hover:text-brand-orange transition-all shadow-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copiar al portapapeles"
                >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};

export default CitationBox;
