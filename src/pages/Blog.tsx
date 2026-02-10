import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import blogData from '../data/blogPosts.json';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';

const Blog: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Blog Académico</h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Consejos, guías y recursos para estudiantes universitarios dominicanos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full">
                                    <Skeleton height={192} className="rounded-b-none" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <Skeleton variant="text" width="40%" />
                                        <Skeleton variant="text" height={28} className="mt-4" />
                                        <Skeleton variant="text" height={60} className="mt-4" />
                                        <div className="mt-auto flex items-center justify-between pt-6">
                                            <Skeleton variant="text" width="30%" />
                                            <Skeleton variant="text" width="20%" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            blogData.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.id}`}
                                    className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full"
                                >
                                    <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                        <img
                                            src={`${import.meta.env.BASE_URL}blog/${post.image}`}
                                            alt={post.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                                            <span className="flex items-center">
                                                <span className="material-icons text-sm mr-1">schedule</span> {post.readTime}
                                            </span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="mt-20 text-center">
                        <div className="inline-block p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-icons text-4xl text-slate-400 mb-2">construction</span>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Próximamente</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
                                Estamos preparando contenido de alto valor para ayudarte en tu camino académico. ¡Vuelve pronto!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
