import React, { type PointerEvent, type ReactNode } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring
} from 'framer-motion';

const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;
const supportsViewportMotion = () => typeof window !== 'undefined' && 'IntersectionObserver' in window;

type MotionWrapperProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

const usePointerTilt = (horizontal = 4, vertical = 3) => {
    const reducedMotion = useReducedMotion() === true;
    const rawRotateX = useMotionValue(0);
    const rawRotateY = useMotionValue(0);
    const rotateX = useSpring(rawRotateX, { stiffness: 170, damping: 22, mass: 0.45 });
    const rotateY = useSpring(rawRotateY, { stiffness: 170, damping: 22, mass: 0.45 });

    const onPointerMove = (event: PointerEvent<HTMLElement>) => {
        if (reducedMotion || event.pointerType === 'touch') return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        rawRotateX.set(y * -vertical * 2);
        rawRotateY.set(x * horizontal * 2);
    };

    const resetTilt = () => {
        rawRotateX.set(0);
        rawRotateY.set(0);
    };

    return { reducedMotion, rotateX, rotateY, onPointerMove, resetTilt };
};

export const PageScrollProgress: React.FC = () => {
    const reducedMotion = useReducedMotion() === true;
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: 0.25 });

    if (reducedMotion) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="fixed inset-x-0 top-20 z-[60] h-[3px] origin-left bg-brand-orange shadow-[0_1px_0_rgba(14,14,15,0.16)]"
            style={{ scaleX }}
        />
    );
};

export const HeroEntrance: React.FC<MotionWrapperProps> = ({ children, className = '', delay = 0 }) => {
    const reducedMotion = useReducedMotion() === true;

    return (
        <motion.div
            className={className}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay, ease: EDITORIAL_EASE }}
        >
            {children}
        </motion.div>
    );
};

export const EditorialReveal: React.FC<MotionWrapperProps> = ({ children, className = '', delay = 0 }) => {
    const reducedMotion = useReducedMotion() === true;
    const canAnimate = !reducedMotion && supportsViewportMotion();

    return (
        <motion.div
            className={className}
            initial={canAnimate ? { opacity: 0, y: 34 } : false}
            whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
            viewport={canAnimate ? { once: true, amount: 0.16, margin: '0px 0px -8% 0px' } : undefined}
            transition={{ duration: 0.68, delay, ease: EDITORIAL_EASE }}
        >
            {children}
        </motion.div>
    );
};

export const PaperStack3D: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div data-testid="diagnostic-paper-stack" className="relative py-3 sm:px-3 sm:py-5">
            <div className="relative">
                <div
                    aria-hidden="true"
                    className="absolute inset-1 hidden border border-tutesis-black/20 bg-tutesis-white shadow-[0_18px_50px_rgba(14,14,15,0.08)] sm:block"
                    style={{ transform: 'translate(14px, 15px) rotate(2.1deg)' }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-1 hidden border border-tutesis-orange/60 bg-tutesis-gold sm:block"
                    style={{ transform: 'translate(-12px, 10px) rotate(-2.4deg)' }}
                />
                <div data-testid="diagnostic-paper-content" className="relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

type DiagnosticSummaryProps = {
    etapa: string;
    nivel: string;
};

export const LiveDiagnosticSummary: React.FC<DiagnosticSummaryProps> = ({ etapa, nivel }) => {
    const reducedMotion = useReducedMotion() === true;
    const valueMotion = reducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 5 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -5 },
            transition: { duration: 0.2 }
        };

    return (
        <div className="relative overflow-hidden border border-tutesis-black/20 bg-tutesis-white p-4" aria-live="polite">
            <div className="absolute inset-x-0 top-0 h-1 bg-brand-orange" aria-hidden="true" />
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-tutesis-black">Ruta seleccionada</p>
            <dl className="mt-3 grid gap-3 text-xs leading-5 sm:grid-cols-2">
                <div>
                    <dt className="font-bold text-tutesis-black/65">Etapa</dt>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.dd key={etapa} className="mt-1 font-semibold text-tutesis-black" {...valueMotion}>{etapa}</motion.dd>
                    </AnimatePresence>
                </div>
                <div>
                    <dt className="font-bold text-tutesis-black/65">Nivel</dt>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.dd key={nivel} className="mt-1 font-semibold text-tutesis-black" {...valueMotion}>{nivel}</motion.dd>
                    </AnimatePresence>
                </div>
            </dl>
        </div>
    );
};

type InteractiveArticleProps = {
    children: ReactNode;
    className?: string;
    direction?: 1 | -1;
};

export const InteractiveArticle: React.FC<InteractiveArticleProps> = ({ children, className = '', direction = 1 }) => {
    const reducedMotion = useReducedMotion() === true;
    const canReveal = !reducedMotion && supportsViewportMotion();

    return (
        <motion.article
            className={`${className} relative transform-gpu focus-within:bg-tutesis-white/5`}
            initial={canReveal ? { opacity: 0, y: 26 } : false}
            whileInView={canReveal ? { opacity: 1, y: 0 } : undefined}
            whileHover={reducedMotion ? undefined : { y: -7, rotateX: 1.8, rotateY: direction * 1.4 }}
            viewport={canReveal ? { once: true, amount: 0.2 } : undefined}
            transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
            style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-orange transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
            <div style={{ transform: reducedMotion ? undefined : 'translateZ(18px)' }}>{children}</div>
        </motion.article>
    );
};

export const PortraitDepth: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
    const { reducedMotion, rotateX, rotateY, onPointerMove, resetTilt } = usePointerTilt(2.2, 1.8);

    return (
        <div className={`relative [perspective:1100px] ${className}`} onPointerMove={onPointerMove} onPointerLeave={resetTilt}>
            <div className="absolute -bottom-3 -right-3 inset-y-3 left-3 border border-tutesis-orange/60 bg-tutesis-gold" aria-hidden="true" />
            <motion.div
                className="relative h-full overflow-hidden bg-tutesis-white [transform-style:preserve-3d]"
                style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
            >
                {children}
            </motion.div>
        </div>
    );
};
