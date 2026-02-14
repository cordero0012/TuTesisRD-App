import React, { ReactNode } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

interface BlogLayoutProps {
    children: ReactNode;
    showSidebar?: boolean; // Deprecated but kept for compatibility
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-slate-900 font-sans text-slate-800 dark:text-white transition-colors duration-200">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Area */}
            {/* Added pt-20 to account for fixed navbar height */}
            <main className="flex-1 w-full relative pt-24 pb-12">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default BlogLayout;
