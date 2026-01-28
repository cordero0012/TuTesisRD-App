import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import blogData from '../data/blogPosts.json';

const BlogPostTemplate: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const post = blogData.find(p => p.id === postId);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title={post.title}
                description={post.excerpt}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": post.title,
                    "image": `${window.location.origin}${import.meta.env.BASE_URL}blog/${post.image}`,
                    "datePublished": post.date,
                    "author": {
                        "@type": "Organization",
                        "name": "TuTesisRD"
                    }
                }}
            />
            <Navbar />

            <article className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-brand-orange font-bold mb-8 hover:translate-x-[-4px] transition-transform"
                    >
                        <span className="material-icons mr-2">arrow_back</span>
                        Volver al Blog
                    </Link>

                    <div className="mb-10">
                        <span className="bg-brand-orange text-white text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg mb-6 inline-block">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm space-x-6">
                            <span className="flex items-center">
                                <span className="material-icons text-sm mr-2">schedule</span>
                                {post.readTime} de lectura
                            </span>
                            <span className="flex items-center">
                                <span className="material-icons text-sm mr-2">calendar_today</span>
                                {post.date}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={`${import.meta.env.BASE_URL}blog/${post.image}`}
                            alt={post.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-black
                        prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                        prose-strong:text-brand-orange
                        prose-a:text-brand-orange"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-20 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">¿Necesitas ayuda con tu tesis?</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Nuestro equipo de expertos está listo para asesorarte en cada paso de tu investigación.
                            </p>
                        </div>
                        <Link
                            to="/registro"
                            className="bg-brand-orange text-white px-8 py-4 rounded-full font-black shadow-glow hover:shadow-glow-lg transition-all transform hover:scale-105 whitespace-nowrap"
                        >
                            Empezar Ahora
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPostTemplate;
