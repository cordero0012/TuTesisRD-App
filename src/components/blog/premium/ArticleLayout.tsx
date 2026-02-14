import React from 'react';
import { Link } from 'react-router-dom';

type Author = {
    name: string;
    image: string;
    role: string;
};

type ArticleLayoutProps = {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    author?: Author;
    publishDate: string;
    category?: string;
    readTime?: string;
    image?: string;
    highlights?: string[];
    sidebarContent?: React.ReactNode;
};

export const ArticleLayout = ({
    children,
    title,
    subtitle,
    author,
    publishDate,
    category,
    readTime,
    image,
    highlights,
    sidebarContent
}: ArticleLayoutProps) => {
    return (
        <article className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Hero Header */}
            <header className="max-w-4xl mx-auto px-6 pt-12 pb-12 text-center relative">

                {/* Back Button */}
                <div className="absolute top-0 left-0 p-6 md:p-0 md:relative md:mb-8 md:flex md:justify-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-slate-500 hover:text-brand-orange transition-colors duration-200 group"
                    >
                        <span className="material-icons mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="font-bold text-sm uppercase tracking-wide">Volver al Blog</span>
                    </Link>
                </div>

                <div className="mb-6 flex justify-center items-center space-x-3 text-brand-orange font-bold tracking-widest uppercase text-xs">
                    {category && <span>{category}</span>}
                    {category && <span className="text-slate-300">•</span>}
                    <span className="text-slate-500 dark:text-slate-400">{publishDate}</span>
                    {readTime && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 dark:text-slate-400">{readTime}</span>
                        </>
                    )}
                </div>

                <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="font-sans text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {author && (
                    <div className="flex items-center justify-center space-x-4">
                        <img
                            src={author.image}
                            alt={author.name}
                            className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover"
                        />
                        <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{author.name}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{author.role}</p>
                        </div>
                    </div>
                )}
            </header>

            {/* Featured Image & Highlights Section */}
            {image && (
                <div className="max-w-6xl mx-auto mb-16 px-4 md:px-8">
                    {/* If highlights exist, show side-by-side layout */}
                    {highlights && highlights.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Image takes up 2/3 */}
                            <figure className="lg:col-span-2 w-full">
                                <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-200 dark:shadow-slate-900/50 relative aspect-video">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </figure>

                            {/* Highlights box takes up 1/3 - Subtle & Clean */}
                            <div className="lg:col-span-1 h-full">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 h-full border-l-4 border-blue-500 shadow-sm">
                                    <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white mb-4">
                                        Lo que aprenderás:
                                    </h3>
                                    <ul className="space-y-3">
                                        {highlights.map((item, index) => (
                                            <li key={index} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Default centered image for posts without highlights */
                        <figure className="w-full max-w-5xl mx-auto">
                            <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-200 dark:shadow-slate-900/50 relative aspect-[21/9] max-h-[500px]">
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </figure>
                    )}
                </div>
            )}

            {/* Content Container with Sidebar Layout */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content Column */}
                    <div className="w-full lg:w-[65%]">
                        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                            prose-p:font-sans prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-loose
                            prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-brand-orange prose-blockquote:bg-white dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-serif
                            prose-strong:text-slate-900 dark:prose-strong:text-white
                            prose-code:text-brand-orange prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                            ">
                            {children}
                        </div>
                    </div>

                    {/* Sidebar Column (Desktop: Right Sticky, Mobile: Bottom) */}
                    {sidebarContent && (
                        <aside className="w-full lg:w-[35%] space-y-8 mt-12 lg:mt-0">
                            <div className="lg:sticky lg:top-24 space-y-12">
                                {sidebarContent}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ArticleLayout;
