"use client";

import React from 'react';
import { Linkedin, Twitter, Globe } from 'lucide-react';

type AuthorProps = {
    name: string;
    role: string; // e.g., "PhD Candidate, History"
    institution: string; // e.g., "Universidad Autónoma de Santo Domingo"
    bio: string;
    image: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
};

export const AuthorBio = ({ name, role, institution, bio, image, socials }: AuthorProps) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 my-16 shadow-sm">
            <img
                src={image}
                alt={name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover mb-4 md:mb-0 md:mr-8 flex-shrink-0"
            />
            <div className="text-center md:text-left">
                <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {name}
                </h4>
                <p className="text-brand-orange font-bold text-sm tracking-wide uppercase mb-3">
                    {role} <span className="text-slate-300 mx-2">•</span> {institution}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-sans text-base leading-relaxed mb-6">
                    {bio}
                </p>

                {socials && (
                    <div className="flex justify-center md:justify-start space-x-4 text-slate-400">
                        {socials.linkedin && (
                            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] hover:scale-110 transition-all p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {socials.twitter && (
                            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2] hover:scale-110 transition-all p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                <Twitter size={18} />
                            </a>
                        )}
                        {socials.website && (
                            <a href={socials.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange hover:scale-110 transition-all p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                <Globe size={18} />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorBio;
