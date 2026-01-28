import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const DesignSystem: React.FC = () => {
    const [activeTab, setActiveTab] = useState('colors');

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO title="Design System" description="TuTesisRD Design System & UI Kit" />
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <header className="mb-16 text-center">
                    <div className="inline-block p-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in">
                        UI/UX Pro Max
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 animate-fade-in-up">Sistema de Diseño</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto animate-slide-up">
                        Documentación viva de tokens, componentes y patrones de diseño.
                    </p>
                </header>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {['colors', 'typography', 'components', 'effects'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105'
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

                    {/* COLORS SECTION */}
                    {activeTab === 'colors' && (
                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-icons text-brand-orange">palette</span> Brand Colors
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-50 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-brand-950">50</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-100 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-brand-950">100</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-200 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-brand-950">200</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-300 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-brand-950">300</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-400 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">400</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-500 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">500</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-600 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">600</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-700 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">700</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-800 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">800</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-900 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">900</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-24 bg-brand-950 rounded-2xl shadow-sm flex items-center justify-center text-xs font-bold text-white">950</div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-6">Neutral Palette</h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="p-4 bg-background-light rounded-xl border border-gray-200">
                                        <div className="text-sm font-bold">Background Light</div>
                                        <div className="text-xs text-slate-500">bg-background-light</div>
                                    </div>
                                    <div className="p-4 bg-background-dark text-white rounded-xl border border-gray-800">
                                        <div className="text-sm font-bold">Background Dark</div>
                                        <div className="text-xs text-slate-400">bg-background-dark</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* TYPOGRAPHY SECTION */}
                    {activeTab === 'typography' && (
                        <div className="space-y-12 max-w-4xl mx-auto">
                            <section className="space-y-8">
                                <div className="border-l-4 border-brand-orange pl-6">
                                    <h1 className="text-6xl font-black mb-4">Heading 1</h1>
                                    <p className="text-slate-500">Outfit / Black / 60px</p>
                                </div>
                                <div className="border-l-4 border-brand-400 pl-6">
                                    <h2 className="text-5xl font-bold mb-4">Heading 2</h2>
                                    <p className="text-slate-500">Outfit / Bold / 48px</p>
                                </div>
                                <div className="border-l-4 border-brand-300 pl-6">
                                    <h3 className="text-3xl font-bold mb-4">Heading 3</h3>
                                    <p className="text-slate-500">Outfit / Bold / 30px</p>
                                </div>
                                <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                                        Body Text (Leading Relaxed). Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* COMPONENTS SECTION */}
                    {activeTab === 'components' && (
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-xl font-bold mb-6">Buttons</h3>
                                <div className="flex flex-wrap gap-4 items-center p-8 bg-surface-light dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <Button variant="primary">Primary Application</Button>
                                    <Button variant="secondary">Secondary Action</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost Option</Button>
                                    <Button variant="glass">Glass Button</Button>
                                    <Button variant="gradient" rightIcon={<span className="material-icons text-sm">arrow_forward</span>}>
                                        Get Started
                                    </Button>
                                    <Button variant="primary" isLoading>Loading</Button>
                                    <Button variant="secondary" className="rounded-full w-12 h-12 !p-0 flex items-center justify-center">
                                        <span className="material-icons">add</span>
                                    </Button>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold mb-6">Inputs</h3>
                                <div className="grid md:grid-cols-2 gap-6 p-8 bg-surface-light dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <Input label="Full Name" placeholder="e.g. Juan Perez" />
                                    <Input label="Email Address" type="email" placeholder="juan@example.com" icon={<span className="material-icons">email</span>} />
                                    <Input label="Password" type="password" error="Password must be at least 8 characters" />
                                    <Input label="Search" placeholder="Search..." className="rounded-full" icon={<span className="material-icons">search</span>} />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold mb-6">Glassmorphic Cards</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card variant="glass" className="p-8">
                                        <h4 className="text-xl font-bold mb-2">Glass Card</h4>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            This component uses <code>variant="glass"</code>. Perfect for overlaying on complex backgrounds.
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-4">Learn More</Button>
                                    </Card>

                                    <Card variant="gradient" className="p-8 relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                                        <h4 className="text-xl font-bold mb-2">Gradient Card</h4>
                                        <p className="text-white/90">
                                            High emphasis card for call-to-actions. Uses brand gradient tokens.
                                        </p>
                                    </Card>

                                    <Card variant="default" hoverEffect className="p-8">
                                        <h4 className="text-xl font-bold mb-2">Default Interactive</h4>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Standard card with <code>hoverEffect</code> enabled. Smooth lift on hover.
                                        </p>
                                    </Card>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* EFFECTS SECTION */}
                    {activeTab === 'effects' && (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark shadow-glow flex flex-col items-center justify-center aspect-square animate-float">
                                <span className="font-bold">Floating & Glow</span>
                            </div>
                            <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark shadow-glass-sm flex flex-col items-center justify-center aspect-square">
                                <div className="w-16 h-16 bg-brand-orange rounded-full animate-pulse-slow"></div>
                                <span className="font-bold mt-4">Pulse Slow</span>
                            </div>
                            <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden relative">
                                <div className="absolute inset-0 bg-brand-orange/5 animate-fade-in"></div>
                                <span className="font-bold z-10">Fade In</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DesignSystem;

