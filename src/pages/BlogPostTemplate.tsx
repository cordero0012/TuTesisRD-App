import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import blogData from '../data/blogPosts.json';
import { logEvent } from '../utils/analytics';
import BlogLayout from '../components/blog/BlogLayout';
import ArticleLayout from '../components/blog/premium/ArticleLayout';
import CitationBox from '../components/blog/premium/CitationBox';
import AuthorBio from '../components/blog/premium/AuthorBio';
import ReadingProgressBar from '../components/blog/premium/ReadingProgressBar';

const BlogPostTemplate: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const post = blogData.find(p => p.id === postId);

    if (!post) return <Navigate to="/blog" replace />;

    React.useEffect(() => {
        logEvent('view_item', 'Blog', post.title);
    }, [post.id, post.title]);

    const handleConversion = () => {
        logEvent('generate_lead', 'Blog Conversion', `Post: ${post.title}`);
    };

    const imageUrl = `${import.meta.env.BASE_URL}blog/${post.image}`;

    // Default Author Data (mocked for now as it's not in JSON)
    const AUTHOR_DATA = {
        name: "Equipo TuTesisRD",
        image: "https://ui-avatars.com/api/?name=Tu+Tesis+RD&background=d97706&color=fff",
        role: "Expertos en Investigación",
        institution: "TuTesisRD",
        bio: "Somos un equipo multidisciplinario de asesores de tesis comprometidos con la excelencia académica. Te ayudamos a estructurar, redactar y defender tu investigación con éxito.",
        socials: {
            website: "https://tutesisrd.com",
            twitter: "https://twitter.com/tutesisrd",
            linkedin: "https://linkedin.com/company/tutesisrd"
        }
    };

    const currentUrl = window.location.href;
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    // Citation Generators
    const generateAPA = `${(post as any).author || "TuTesisRD"}. (${post.date.split(' ')[2] || new Date().getFullYear()}). ${post.title}. TuTesisRD Blog. ${currentUrl}`;
    const generateMLA = `${(post as any).author || "TuTesisRD"}. "${post.title}." TuTesisRD Blog, ${post.date}, ${currentUrl}.`;
    const generateBibTeX = `@article{tutesisrd_${post.id}, title={${post.title}}, author={${(post as any).author || "TuTesisRD"}}, year={${new Date().getFullYear()}}, url={${currentUrl}}}`;

    return (
        <div className="font-sans text-slate-800 dark:text-white">
            <ReadingProgressBar />
            <SEO
                title={post.title}
                description={post.excerpt}
                schema={{
                    "@context": "https://schema.org",
                    "@type": post.schemaType || "BlogPosting",
                    "headline": post.title,
                    "description": post.excerpt,
                    "image": `${window.location.origin}${imageUrl}`,
                    "datePublished": post.date,
                    "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href },
                    "author": { "@type": "Organization", "name": "TuTesisRD" }
                }}
            />

            <BlogLayout>
                <ArticleLayout
                    title={post.title}
                    subtitle={post.excerpt}
                    author={AUTHOR_DATA}
                    publishDate={post.date}
                    category={post.category}
                    readTime={post.readTime}
                    image={imageUrl}
                    sidebarContent={
                        <div className="flex flex-col gap-12">

                            {/* Author Bio - Sidebar */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <AuthorBio
                                    {...AUTHOR_DATA}
                                />
                            </div>

                            {/* Citation Box - Sidebar */}
                            <CitationBox
                                apa={generateAPA}
                                mla={generateMLA}
                                bibtex={generateBibTeX}
                            />

                            {/* Related Posts Section - Sidebar (Vertical & Larger) */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 lg:border-t-0 lg:pt-0">
                                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-8">
                                    También te podría interesar
                                </h3>

                                <div className="flex flex-col gap-8">
                                    {blogData
                                        .filter(p => p.id !== post.id) // Exclude current post
                                        .sort(() => 0.5 - Math.random()) // Shuffle
                                        .slice(0, 5) // Take 5
                                        .map((relatedPost) => (
                                            <div key={relatedPost.id} className="group">
                                                <Link to={`/blog/${relatedPost.id}`} className="block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800">
                                                    {/* Image - Larger & Vertical */}
                                                    <div className="relative aspect-video w-full overflow-hidden">
                                                        <img
                                                            src={`${import.meta.env.BASE_URL}blog/${relatedPost.image}`}
                                                            alt={relatedPost.title}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        <div className="absolute top-3 left-3">
                                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-brand-orange text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                                                                {relatedPost.category}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5">
                                                        <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-orange transition-colors leading-snug">
                                                            {relatedPost.title}
                                                        </h4>
                                                        <div className="flex items-center text-brand-orange font-bold text-xs uppercase tracking-wide group/link mt-3">
                                                            Leer artículo
                                                            <span className="material-icons text-xs ml-1 transform group-hover/link:translate-x-1 transition-transform">
                                                                arrow_forward
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Sticky CTA in Sidebar - Sans Serif & Improved */}
                            <div className="sticky top-24 bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-center shadow-xl overflow-hidden relative group">
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-brand-orange/20 transition-all duration-700"></div>

                                <div className="relative z-10">
                                    <h4 className="font-sans font-bold text-2xl text-white mb-3">
                                        ¿Necesitas ayuda con tu Tesis?
                                    </h4>
                                    <p className="font-sans text-slate-300 mb-8 leading-relaxed text-sm">
                                        Nuestros asesores expertos pueden guiarte paso a paso.
                                    </p>

                                    <div className="space-y-3">
                                        <Link
                                            to="/registro"
                                            onClick={handleConversion}
                                            className="block w-full bg-brand-orange hover:bg-orange-600 text-white font-sans font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5"
                                        >
                                            Solicitar Asesoría
                                        </Link>

                                        <a
                                            href="https://wa.me/message/YESJDSE3MZ3IM1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-sans font-semibold py-3 px-6 rounded-xl transition-colors backdrop-blur-sm border border-white/10"
                                        >
                                            <span className="material-icons text-lg mr-2">whatsapp</span>
                                            WhatsApp
                                        </a>
                                    </div>

                                    <p className="mt-6 text-xs text-slate-500 font-sans">
                                        Respuesta inmediata
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                >
                    {/* Content */}
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <hr className="my-12 border-slate-200 dark:border-slate-800" />

                </ArticleLayout>
            </BlogLayout>
        </div>
    );
};

export default BlogPostTemplate;
