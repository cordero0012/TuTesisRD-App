import React from 'react';
import blogData from '../data/blogPosts.json';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import BlogLayout from '../components/blog/BlogLayout';

const Blog: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <BlogLayout>
            <section className="px-6 py-10 md:py-12 md:px-12 max-w-5xl mx-auto">

                {/* Premium Header */}
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                        Blog Académico
                    </h1>
                    <p className="font-sans text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-light">
                        Estrategias de investigación, redacción académica y consejos para tu tesis.
                    </p>

                    {/* Visual Subscribe Form */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                        />
                        <button className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-md">
                            Suscribirse
                        </button>
                    </div>
                </div>

                {/* Blog List - Premium Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-8">
                                <Skeleton className="w-full h-64 rounded-xl mb-4" />
                                <Skeleton className="w-3/4 h-6 rounded mb-2" />
                                <Skeleton className="w-1/2 h-4 rounded" />
                            </div>
                        ))
                    ) : (
                        blogData.map((post) => (
                            <div key={post.id} className="break-inside-avoid mb-8 group">
                                <Link to={`/blog/${post.id}`} className="block bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-800 hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={`${import.meta.env.BASE_URL}blog/${post.image}`}
                                            alt={post.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-brand-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>

                                        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors leading-tight">
                                            {post.title}
                                        </h2>

                                        <p className="font-sans text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center text-brand-orange font-bold text-sm group/link">
                                            Leer Artículo
                                            <span className="material-icons text-sm ml-1 transform group-hover/link:translate-x-1 transition-transform">
                                                arrow_forward
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Newsletter / Promo Section at Bottom */}
                <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} TuTesisRD. Todos los derechos reservados.
                    </p>
                </div>

            </section>
        </BlogLayout>
    );
};

export default Blog;
