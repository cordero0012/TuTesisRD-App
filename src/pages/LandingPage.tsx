import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowDownRight,
    ArrowRight,
    BookOpen,
    Check,
    ClipboardCheck,
    FileCheck2,
    GraduationCap,
    MapPin,
    MessageCircle,
    Monitor,
    Search,
    ShieldCheck,
    type LucideIcon
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import {
    EditorialReveal,
    HeroEntrance,
    InteractiveArticle,
    LiveDiagnosticSummary,
    PageScrollProgress,
    PaperStack3D,
    PortraitDepth
} from '../components/landing/EditorialMotion';
import { CONTACT, buildWhatsAppUrl } from '../config';
import { saveHeroLead } from '../services/leads/heroLeadService';
import { createEventId } from '../utils/analytics';

const ETAPAS = [
    'Tengo la idea inicial / Anteproyecto',
    'Desarrollando Marco Teórico',
    'Aplicando Metodología / Instrumentos',
    'Tesis terminada pero con correcciones de formato (APA)',
    'Tengo observaciones de mi asesor y no sé qué hacer',
    'Me preparo para la defensa'
];

const NIVELES = ['Grado / Licenciatura', 'Maestría / Posgrado', 'Doctorado'];

const METHOD_STEPS = [
    {
        number: '01',
        title: 'Nos cuentas tu caso',
        description: 'Revisamos la etapa, el nivel académico y las observaciones que ya tienes. Antes de proponer, entendemos.'
    },
    {
        number: '02',
        title: 'Revisamos tu etapa actual',
        description: 'Separamos lo metodológico, lo argumental y lo formal para que el problema deje de sentirse como un bloque.'
    },
    {
        number: '03',
        title: 'Definimos prioridades',
        description: 'Ordenamos qué debe resolverse primero para que inviertas tu tiempo en los ajustes que realmente desbloquean el proyecto.'
    },
    {
        number: '04',
        title: 'Trabajamos por partes',
        description: 'Dividimos el avance en entregas manejables, con objetivos concretos y criterios que puedes comprender.'
    },
    {
        number: '05',
        title: 'Corregimos y organizamos',
        description: 'Integramos las observaciones sin perder el hilo entre problema, objetivos, método, resultados y conclusiones.'
    },
    {
        number: '06',
        title: 'Te preparas para explicar',
        description: 'Tú mantienes la autoría y el dominio de tu investigación para conversar con tu asesor y defender tus decisiones.'
    }
];

const PROBLEM_SITUATIONS = [
    {
        title: 'No sé cómo empezar',
        response: 'Delimitamos el problema y convertimos la idea inicial en un primer entregable concreto.'
    },
    {
        title: 'Mi asesor me devuelve demasiadas correcciones',
        response: 'Agrupamos las observaciones por prioridad para que dejen de sentirse como una lista interminable.'
    },
    {
        title: 'No entiendo bien la metodología',
        response: 'Alineamos objetivos, enfoque, muestra e instrumentos y te explicamos el porqué de cada decisión.'
    },
    {
        title: 'Tengo poco tiempo y muchas dudas',
        response: 'Trazamos una secuencia realista y concentramos el esfuerzo en lo que mueve el proyecto.'
    },
    {
        title: 'Mi documento perdió coherencia',
        response: 'Reconectamos capítulos, argumentos y resultados para recuperar un hilo que puedas defender.'
    },
    {
        title: 'Me preocupa la defensa final',
        response: 'Sintetizamos tu investigación y practicamos cómo explicar sus decisiones con seguridad.'
    }
];

const ROUTE_COMPARISON = [
    ['Sin una ruta clara', ['Correcciones sin prioridad', 'Capítulos que no conversan', 'Dudas que se acumulan', 'Poco control del tiempo']],
    ['Con acompañamiento', ['Prioridades visibles', 'Decisiones metodológicas explicadas', 'Avances por entregas', 'Preparación para responder']]
] as const;

type Service = {
    number: string;
    title: string;
    description: string;
    note: string;
    icon: LucideIcon;
};

const SERVICES: Service[] = [
    {
        number: '01',
        title: 'Anteproyecto y planteamiento',
        description: 'Delimitación del tema, problema, objetivos, justificación y viabilidad de la propuesta.',
        note: 'Para empezar con una base coherente',
        icon: BookOpen
    },
    {
        number: '02',
        title: 'Metodología e instrumentos',
        description: 'Alineación entre enfoque, diseño, población, muestra, técnicas e instrumentos de recolección.',
        note: 'Para convertir objetivos en decisiones',
        icon: ClipboardCheck
    },
    {
        number: '03',
        title: 'Revisión por capítulos',
        description: 'Lectura crítica de estructura, argumentación, consistencia y observaciones del asesor o jurado.',
        note: 'Para avanzar sin perder el hilo',
        icon: FileCheck2
    },
    {
        number: '04',
        title: 'APA 7 y formato institucional',
        description: 'Citas, referencias, títulos, tablas, figuras y presentación formal según los lineamientos aplicables.',
        note: 'Para que la forma sostenga el contenido',
        icon: ShieldCheck
    },
    {
        number: '05',
        title: 'Resultados y discusión',
        description: 'Organización de hallazgos, lectura de resultados y articulación con antecedentes y marco teórico.',
        note: 'Para interpretar con rigor',
        icon: Search
    },
    {
        number: '06',
        title: 'Preparación para la defensa',
        description: 'Síntesis del estudio, estructura de presentación y práctica de preguntas sobre tu investigación.',
        note: 'Para explicar tu trabajo con seguridad',
        icon: GraduationCap
    }
];

const FAQS = [
    {
        question: '¿Pueden trabajar a partir de las observaciones de mi asesor?',
        answer: 'Sí. Las observaciones son el punto de partida para ordenar prioridades, aclarar qué debe corregirse y construir una ruta de trabajo comprensible.'
    },
    {
        question: '¿Tengo que contratar un proceso completo?',
        answer: 'No. El acompañamiento puede concentrarse en una etapa o capítulo específico, según el estado real de tu investigación.'
    },
    {
        question: '¿Atienden de forma presencial y en línea?',
        answer: 'La atención presencial se ofrece en Higüey y el acompañamiento en línea permite trabajar con estudiantes de toda República Dominicana.'
    },
    {
        question: '¿Pueden revisar una tesis que ya está avanzada?',
        answer: 'Sí. Primero se revisa la coherencia general y luego se priorizan los ajustes metodológicos, argumentales o formales que tengan mayor impacto.'
    },
    {
        question: '¿El acompañamiento sustituye a mi asesor universitario?',
        answer: 'No. Complementa su orientación. Las decisiones finales deben respetar los lineamientos de tu universidad y las observaciones de tu asesor o jurado.'
    }
];

const SectionLabel = ({ index, children, inverse = false }: { index: string; children: React.ReactNode; inverse?: boolean }) => (
    <div className={`mb-6 flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] ${inverse ? 'text-tutesis-white/70' : 'text-tutesis-black/65'}`}>
        <span className={`font-display text-base font-extrabold normal-case tracking-normal ${inverse ? 'text-tutesis-orange' : 'text-tutesis-black'}`}>{index}</span>
        <span className={`h-px w-10 ${inverse ? 'bg-tutesis-orange' : 'bg-tutesis-black/25'}`} aria-hidden="true" />
        <span>{children}</span>
    </div>
);

const LandingPage: React.FC = () => {
    const [etapa, setEtapa] = React.useState(ETAPAS[0]);
    const [nivel, setNivel] = React.useState(NIVELES[0]);
    const [hasScrolledQuarter, setHasScrolledQuarter] = React.useState(false);
    const [isFinalCtaVisible, setIsFinalCtaVisible] = React.useState(false);
    const finalCtaRef = React.useRef<HTMLElement>(null);
    const showFloatingWhatsApp = hasScrolledQuarter && !isFinalCtaVisible;

    React.useEffect(() => {
        const updateFloatingVisibility = () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
            setHasScrolledQuarter(progress >= 0.25);
        };

        updateFloatingVisibility();
        window.addEventListener('scroll', updateFloatingVisibility, { passive: true });
        return () => window.removeEventListener('scroll', updateFloatingVisibility);
    }, []);

    React.useEffect(() => {
        const finalCta = finalCtaRef.current;
        if (!finalCta || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsFinalCtaVisible(entry.isIntersecting);
        }, { threshold: 0.35 });
        observer.observe(finalCta);
        return () => observer.disconnect();
    }, []);

    const handleDiagnosticoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = [
            'Hola, quiero mi diagnóstico gratis.',
            `Etapa: ${etapa}`,
            `Nivel académico: ${nivel}`
        ].join('\n');

        // Open synchronously so browser pop-up protection does not interrupt
        // the conversion while the lead record is saved in the background.
        window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');

        saveHeroLead({ etapa, nivel }).then((stored) => {
            if (typeof window === 'undefined') return;

            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: 'form_submit',
                'dlv - service_type': 'Diagnostico Rapido',
                diagnostico_etapa: etapa,
                diagnostico_nivel: nivel,
                lead_stored: stored
            });
            (window as any).fbq?.('track', 'Lead', {
                content_name: 'Diagnostico Rapido',
                content_category: nivel
            }, { eventID: createEventId() });
        });
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': 'https://www.tutesisrd.online/#organization',
        name: 'TuTesisRD',
        alternateName: 'Tu Tesis RD',
        url: 'https://www.tutesisrd.online',
        logo: 'https://www.tutesisrd.online/logos/Logo-TuTesis-Color.png',
        description: 'Acompañamiento metodológico, revisión académica y orientación para proyectos de tesis en República Dominicana.',
        telephone: CONTACT.PHONE,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Higüey',
            addressRegion: 'La Altagracia',
            addressCountry: 'DO'
        },
        areaServed: {
            '@type': 'Country',
            name: 'República Dominicana'
        },
        sameAs: [CONTACT.INSTAGRAM, CONTACT.FACEBOOK],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: CONTACT.PHONE,
            contactType: 'Customer Service',
            areaServed: 'DO',
            availableLanguage: 'Spanish'
        }
    };

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Asesoría metodológica para tesis universitarias',
        provider: { '@id': 'https://www.tutesisrd.online/#organization' },
        areaServed: 'DO',
        description: 'Acompañamiento para anteproyectos, metodología, revisión por capítulos, formato académico y preparación de defensa.'
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    const directDiagnosticUrl = buildWhatsAppUrl('Hola, quiero iniciar un diagnóstico de mi tesis.');
    const generalContactUrl = buildWhatsAppUrl('Hola, quiero orientación sobre mi tesis.');

    return (
        <div className="min-h-screen overflow-x-clip bg-tutesis-white font-sans text-tutesis-black selection:bg-tutesis-orange/30">
            <SEO
                title="Asesoría metodológica para tesis en República Dominicana | TuTesisRD"
                description="Ordena tu tesis con un diagnóstico claro, revisión metodológica y acompañamiento por etapas. Atención en línea en República Dominicana y presencial en Higüey."
                keywords={[
                    'asesoría de tesis República Dominicana',
                    'metodología de investigación',
                    'revisión tesis APA 7',
                    'anteproyecto de tesis',
                    'preparación defensa de tesis'
                ]}
                schema={[organizationSchema, serviceSchema, faqSchema]}
                ogImage="https://www.tutesisrd.online/og-image.png"
            />
            <Navbar />
            <PageScrollProgress />

            <main>
                <section id="inicio" className="research-grid relative border-b border-tutesis-black/20 pt-28 md:pt-36 lg:pt-40">
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 pb-20 sm:px-8 md:pb-28 lg:grid-cols-12 lg:gap-10 lg:px-10">
                        <HeroEntrance className="flex flex-col justify-center lg:col-span-7 lg:pr-8">
                            <SectionLabel index="01">Diagnóstico inicial gratuito · República Dominicana</SectionLabel>

                            <h1 className="max-w-[14ch] font-display text-[clamp(2.55rem,6.2vw,6.2rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-tutesis-black">
                                Asesoría para tesis y monográficos.
                                <span className="mt-2 block underline decoration-tutesis-orange decoration-[0.12em] underline-offset-[0.08em]">Del caos a una ruta clara.</span>
                            </h1>

                            <p className="mt-8 max-w-2xl text-lg leading-8 text-tutesis-black/70 md:text-xl md:leading-9">
                                Cuéntanos en qué etapa estás y recibe una orientación inicial para saber qué corregir primero, cómo organizarte y cuál debe ser tu siguiente paso.
                            </p>

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <a
                                    href={directDiagnosticUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-tutesis-black px-6 py-3.5 text-sm font-bold text-tutesis-white transition-colors duration-200 hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 focus-visible:ring-offset-tutesis-white"
                                >
                                    Inicia tu diagnóstico gratis
                                    <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
                                </a>
                                <a
                                    href="#servicios"
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3.5 text-sm font-bold text-tutesis-black underline decoration-tutesis-gold underline-offset-8 transition-colors hover:bg-tutesis-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4"
                                >
                                    Ver cómo podemos ayudarte
                                </a>
                            </div>

                            <ul className="mt-10 grid max-w-2xl gap-x-8 gap-y-3 border-t border-tutesis-black/20 pt-6 text-sm text-tutesis-black/70 sm:grid-cols-2">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Orientación personalizada</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Apoyo metodológico</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Revisión académica y APA</li>
                                <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Atención en línea en todo RD</li>
                            </ul>
                        </HeroEntrance>

                        <HeroEntrance className="relative lg:col-span-5 lg:pt-5" delay={0.12}>
                            <div id="diagnostico" className="scroll-mt-28" />
                            <div className="absolute -right-5 -top-6 hidden font-display text-[8rem] font-black leading-none text-brand-orange/10 lg:block" aria-hidden="true">01</div>
                            <PaperStack3D>
                            <div className="relative border border-tutesis-black/20 bg-tutesis-white p-5 shadow-[0_24px_70px_rgba(14,14,15,0.12)] sm:p-8">
                                <div className="mb-8 flex items-start justify-between gap-6 border-b border-tutesis-black/15 pb-6">
                                    <div>
                                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-tutesis-black">Empieza aquí</span>
                                        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.035em] text-tutesis-black">Recibe tu diagnóstico inicial</h2>
                                    </div>
                                    <span className="font-display text-xl font-extrabold text-tutesis-black/70" aria-hidden="true">01</span>
                                </div>

                                <p className="mb-7 max-w-md text-sm leading-6 text-tutesis-black/65">
                                    Selecciona dos respuestas. Abriremos WhatsApp con tu contexto listo para darte una orientación más útil desde el primer mensaje.
                                </p>

                                <form className="space-y-5" onSubmit={handleDiagnosticoSubmit}>
                                    <div>
                                        <label htmlFor="hero-etapa" className="mb-2 block text-sm font-bold text-tutesis-black">¿En qué etapa estás?</label>
                                        <select
                                            id="hero-etapa"
                                            name="etapa"
                                            value={etapa}
                                            onChange={(event) => setEtapa(event.target.value)}
                                            className="min-h-12 w-full appearance-none rounded-md border border-tutesis-black/25 bg-tutesis-white px-4 py-3 text-base text-tutesis-black outline-none transition-colors focus:border-tutesis-orange focus:ring-2 focus:ring-tutesis-orange/25"
                                        >
                                            {ETAPAS.map((option) => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="hero-nivel" className="mb-2 block text-sm font-bold text-tutesis-black">Nivel académico</label>
                                        <select
                                            id="hero-nivel"
                                            name="nivel"
                                            value={nivel}
                                            onChange={(event) => setNivel(event.target.value)}
                                            className="min-h-12 w-full appearance-none rounded-md border border-tutesis-black/25 bg-tutesis-white px-4 py-3 text-base text-tutesis-black outline-none transition-colors focus:border-tutesis-orange focus:ring-2 focus:ring-tutesis-orange/25"
                                        >
                                            {NIVELES.map((option) => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                    </div>

                                    <LiveDiagnosticSummary etapa={etapa} nivel={nivel} />

                                    <button
                                        type="submit"
                                        className="group flex min-h-12 w-full items-center justify-between rounded-md bg-tutesis-orange px-5 py-4 text-left text-sm font-extrabold text-tutesis-black transition-colors hover:bg-tutesis-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-black focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Recibir mi diagnóstico gratis
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                </form>

                                <p className="mt-5 text-xs leading-5 text-tutesis-black/65">
                                    Sin compromiso. La conversación se abrirá en WhatsApp con tus respuestas incluidas.
                                </p>
                            </div>
                            </PaperStack3D>
                        </HeroEntrance>
                    </div>

                    <div className="border-t border-tutesis-black/20 bg-tutesis-gold/15">
                        <div className="mx-auto grid max-w-[1280px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4 lg:px-10">
                            {[
                                ['Diagnóstico', 'Inicial y gratuito'],
                                ['Contacto', 'Directo por WhatsApp'],
                                ['Cobertura', 'En línea en todo RD'],
                                ['Presencial', 'Higüey, La Altagracia']
                            ].map(([label, value]) => (
                                <div key={label} className="border-b border-tutesis-black/15 py-5 pr-4 odd:border-r odd:pr-5 even:pl-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                                    <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-tutesis-black/55">{label}</span>
                                    <strong className="mt-1 block text-sm text-tutesis-black">{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-tutesis-black/20 bg-tutesis-white py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <EditorialReveal className="lg:col-span-4">
                            <SectionLabel index="02">¿Qué está frenando tu tesis?</SectionLabel>
                            <p className="max-w-sm text-sm leading-7 text-tutesis-black/65">
                                Si tienes observaciones, capítulos desordenados o dudas metodológicas, no necesitas empezar de cero: necesitas priorizar.
                            </p>
                        </EditorialReveal>
                        <EditorialReveal className="lg:col-span-8" delay={0.08}>
                            <h2 className="max-w-[18ch] font-display text-[clamp(2.5rem,4.8vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-tutesis-black">
                                Convierte tus dudas en un <span className="underline decoration-tutesis-gold decoration-[0.1em] underline-offset-[0.08em]">próximo paso concreto.</span>
                            </h2>
                            <p className="mt-8 max-w-2xl text-lg leading-8 text-tutesis-black/70">
                                Revisamos tu situación real y te ayudamos a separar lo urgente de lo importante. Así puedes avanzar con decisiones que entiendes y puedes defender ante tu asesor.
                            </p>
                            <a
                                href={generalContactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-md bg-tutesis-black px-5 py-3 text-sm font-bold text-tutesis-white transition-colors hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4"
                            >
                                Quiero saber qué debo corregir primero
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </a>
                        </EditorialReveal>
                        <EditorialReveal className="lg:col-span-12" delay={0.12}>
                            <div className="mt-8 grid gap-px border border-tutesis-black/20 bg-tutesis-black/20 md:grid-cols-2 lg:grid-cols-3">
                                {PROBLEM_SITUATIONS.map((problem, index) => (
                                    <details key={problem.title} className="group relative bg-tutesis-white p-6 open:bg-tutesis-gold/15 md:min-h-48">
                                        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-tutesis-orange transition-transform duration-300 group-hover:scale-x-100 group-open:scale-x-100" aria-hidden="true" />
                                        <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-display text-xl font-extrabold leading-tight tracking-[-0.025em] text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange [&::-webkit-details-marker]:hidden">
                                            <span><span className="mb-5 block font-sans text-xs font-extrabold tracking-[0.16em] text-tutesis-black/45">0{index + 1}</span>{problem.title}</span>
                                            <span className="mt-7 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-tutesis-black/25 text-sm transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                                        </summary>
                                        <p className="mt-5 border-t border-tutesis-black/15 pt-4 text-sm leading-6 text-tutesis-black/70">{problem.response}</p>
                                    </details>
                                ))}
                            </div>
                            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-tutesis-black/50">Abre una situación para ver cómo la convertimos en un próximo paso.</p>
                        </EditorialReveal>
                    </div>
                </section>

                <section id="metodo" className="border-b border-tutesis-black/20 bg-tutesis-gold/10 py-20 md:py-32">
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <EditorialReveal className="lg:col-span-4">
                            <div className="lg:sticky lg:top-32">
                                <SectionLabel index="03">Así te ayudamos</SectionLabel>
                                <h2 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.045em] text-tutesis-black md:text-5xl">
                                    Un plan claro desde la primera conversación.
                                </h2>
                                <p className="mt-6 max-w-sm text-base leading-7 text-tutesis-black/65">
                                    Seis pasos concretos para que sepas qué sigue y mantengas el control de tu investigación.
                                </p>
                            </div>
                        </EditorialReveal>

                        <EditorialReveal className="lg:col-span-8" delay={0.08}>
                        <ol>
                            {METHOD_STEPS.map((step) => (
                                <li key={step.number} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-tutesis-black/20 py-8 transition-[border-color,transform] duration-300 first:border-t-0 first:pt-0 hover:border-tutesis-orange sm:grid-cols-[5rem_1fr] md:gap-8 md:py-10 md:hover:translate-x-2">
                                    <span className="font-display text-3xl font-black text-tutesis-black md:text-4xl">{step.number}</span>
                                    <div>
                                        <h3 className="font-display text-2xl font-extrabold tracking-[-0.035em] text-tutesis-black md:text-3xl">{step.title}</h3>
                                        <p className="mt-4 max-w-2xl text-base leading-7 text-tutesis-black/65 md:text-lg md:leading-8">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        </EditorialReveal>
                    </div>
                </section>

                <section className="border-b border-tutesis-black/20 bg-tutesis-white py-20 md:py-28">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                        <EditorialReveal>
                            <SectionLabel index="04">Lo que cambia cuando tienes una ruta</SectionLabel>
                            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                                <h2 className="max-w-[16ch] font-display text-[clamp(2.6rem,4.8vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-tutesis-black lg:col-span-7">
                                    Avanzar solo no siempre significa avanzar más rápido.
                                </h2>
                                <p className="max-w-xl text-lg leading-8 text-tutesis-black/70 lg:col-span-5">
                                    El acompañamiento no elimina tu trabajo: elimina fricción, ordena decisiones y te ayuda a aprovechar mejor cada revisión.
                                </p>
                            </div>
                        </EditorialReveal>

                        <div className="mt-14 grid gap-4 md:grid-cols-2">
                            {ROUTE_COMPARISON.map(([title, items], columnIndex) => (
                                <EditorialReveal key={title} delay={columnIndex * 0.08}>
                                    <div className={`h-full border p-6 sm:p-8 ${columnIndex === 0 ? 'border-tutesis-black/20 bg-tutesis-black/[0.03]' : 'border-tutesis-orange bg-tutesis-gold/15'}`}>
                                        <div className="flex items-center justify-between border-b border-tutesis-black/15 pb-5">
                                            <h3 className="font-display text-2xl font-extrabold tracking-[-0.035em] text-tutesis-black">{title}</h3>
                                            <span className={`h-3 w-3 rounded-full ${columnIndex === 0 ? 'bg-tutesis-black/30' : 'bg-tutesis-orange'}`} aria-hidden="true" />
                                        </div>
                                        <ul className="mt-4 divide-y divide-tutesis-black/15">
                                            {items.map((item) => (
                                                <li key={item} className="flex items-center gap-3 py-4 text-base font-semibold text-tutesis-black/75">
                                                    <Check className={`h-4 w-4 shrink-0 ${columnIndex === 0 ? 'text-tutesis-black/30' : 'text-tutesis-orange'}`} aria-hidden="true" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </EditorialReveal>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="servicios" className="border-b border-tutesis-white/20 bg-tutesis-black py-20 text-tutesis-white md:py-32">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                        <div className="grid gap-10 lg:grid-cols-12">
                            <EditorialReveal className="lg:col-span-4">
                                <SectionLabel index="05" inverse>Soluciones para avanzar</SectionLabel>
                            </EditorialReveal>
                            <EditorialReveal className="lg:col-span-8" delay={0.08}>
                                <h2 className="max-w-[15ch] font-display text-[clamp(2.7rem,5.2vw,5.2rem)] font-extrabold leading-[0.97] tracking-[-0.05em] text-tutesis-white">
                                    El apoyo que necesitas, en la etapa exacta.
                                </h2>
                                <p className="mt-7 max-w-2xl text-lg leading-8 text-tutesis-white/70">
                                    El diagnóstico permite recomendarte un alcance concreto, sin obligarte a contratar un proceso completo si solo necesitas resolver una etapa.
                                </p>
                            </EditorialReveal>
                        </div>

                        <div className="mt-16 grid border-t border-tutesis-white/25 md:grid-cols-2">
                            {SERVICES.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <InteractiveArticle
                                        key={service.number}
                                        direction={index % 2 === 0 ? 1 : -1}
                                        className={`group border-b border-tutesis-white/25 py-8 transition-colors hover:bg-tutesis-white/5 md:p-9 ${index % 2 === 0 ? 'md:border-r' : ''}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="font-display text-2xl font-black text-brand-orange">{service.number}</span>
                                            <Icon className="h-5 w-5 text-tutesis-white/55" strokeWidth={1.5} aria-hidden="true" />
                                        </div>
                                        <h3 className="mt-8 max-w-[18ch] font-display text-2xl font-extrabold tracking-[-0.035em] text-tutesis-white md:text-3xl">{service.title}</h3>
                                        <p className="mt-4 max-w-xl text-base leading-7 text-tutesis-white/70">{service.description}</p>
                                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-tutesis-white/50">{service.note}</p>
                                    </InteractiveArticle>
                                );
                            })}
                        </div>

                        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-tutesis-white/25 pt-8 lg:flex-row lg:items-center">
                            <p className="max-w-lg text-sm leading-6 text-tutesis-white/70">Si no sabes qué servicio corresponde, empieza por el diagnóstico. Esa es precisamente su función.</p>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <a href={generalContactUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-tutesis-orange px-5 py-3 text-sm font-extrabold text-tutesis-black transition-colors hover:bg-tutesis-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 focus-visible:ring-offset-tutesis-black">
                                    Solicitar diagnóstico gratuito
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </a>
                                <Link to="/servicios" className="inline-flex min-h-12 items-center justify-center rounded-md border border-tutesis-white/40 px-5 py-3 text-sm font-bold text-tutesis-white transition-colors hover:border-tutesis-white hover:bg-tutesis-white hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange">
                                    Ver todos los servicios
                                </Link>
                                <Link to="/universidades" className="inline-flex min-h-12 items-center justify-center rounded-md border border-tutesis-white/40 px-5 py-3 text-sm font-bold text-tutesis-white transition-colors hover:border-tutesis-white hover:bg-tutesis-white hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange">
                                    Ver guías por universidad
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-tutesis-black/20 bg-tutesis-white py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <EditorialReveal className="lg:col-span-5">
                            <SectionLabel index="06">Un servicio que protege tu autoría</SectionLabel>
                            <h2 className="max-w-[14ch] font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-tutesis-black md:text-6xl">
                                Recibes criterio, no respuestas prefabricadas.
                            </h2>
                        </EditorialReveal>
                        <EditorialReveal className="lg:col-span-7 lg:pt-14" delay={0.08}>
                            <p className="max-w-2xl text-xl leading-9 text-tutesis-black/70">
                                Nuestro papel es ayudarte a comprender, estructurar y responder mejor. Las decisiones académicas se documentan, se explican y se alinean con las indicaciones de tu <Link to="/universidades" className="text-tutesis-black dark:text-tutesis-white underline decoration-tutesis-orange decoration-2 hover:decoration-4 font-semibold">universidad</Link>.
                            </p>
                            <div className="mt-10 grid gap-px border border-tutesis-black/20 bg-tutesis-black/20 sm:grid-cols-3">
                                {[
                                    ['Criterio', 'Explicamos el porqué de cada ajuste.'],
                                    ['Trazabilidad', 'Trabajamos desde observaciones y lineamientos.'],
                                    ['Autonomía', 'Te preparas para defender tus decisiones.']
                                ].map(([title, description]) => (
                                    <div key={title} className="bg-tutesis-white p-6">
                                        <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-tutesis-black">{title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-tutesis-black/65">{description}</p>
                                    </div>
                                ))}
                            </div>
                        </EditorialReveal>
                    </div>
                </section>

                <section className="border-b border-tutesis-black/20 bg-tutesis-gold/15 py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <PortraitDepth className="min-h-[28rem] lg:col-span-5 lg:min-h-[36rem]">
                            <img
                                src="/miguel-cordero.webp"
                                alt="Miguel Ángel Cordero Trinidad, educador y asesor académico"
                                loading="lazy"
                                width="600"
                                height="800"
                                className="absolute inset-0 h-full w-full object-cover object-top grayscale-[15%]"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-tutesis-black/90 p-5 text-tutesis-white sm:p-7">
                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">Tu contacto directo</span>
                                <p className="mt-2 font-display text-2xl font-extrabold">Miguel Ángel Cordero Trinidad</p>
                            </div>
                        </PortraitDepth>

                        <EditorialReveal className="flex flex-col justify-center lg:col-span-7 lg:pl-10" delay={0.08}>
                            <SectionLabel index="07">Quién te acompaña</SectionLabel>
                            <h2 className="max-w-[15ch] font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-tutesis-black md:text-6xl">
                                Hablas directamente con quien revisa tu caso.
                            </h2>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-tutesis-black/70">
                                Miguel es educador y asesor académico. Revisa tu situación, conversa contigo y traduce observaciones complejas en decisiones concretas, sin intermediarios ni respuestas genéricas.
                            </p>

                            <div className="mt-9 flex flex-col gap-4 border-t border-tutesis-black/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
                                <span className="flex items-center gap-2 text-sm font-semibold text-tutesis-black/70"><MapPin className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Higüey, La Altagracia</span>
                                <a
                                    href={buildWhatsAppUrl('Hola Miguel, quiero orientación sobre mi tesis.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-tutesis-black px-5 py-3 text-sm font-bold text-tutesis-white transition-colors hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 focus-visible:ring-offset-tutesis-white"
                                >
                                    Solicitar diagnóstico con Miguel
                                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                </a>
                            </div>
                        </EditorialReveal>
                    </div>
                </section>

                <section id="defensa" className="border-b border-tutesis-black/20 bg-tutesis-white py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <EditorialReveal className="lg:col-span-5">
                            <SectionLabel index="08">Preparación para defensa</SectionLabel>
                            <h2 className="max-w-[14ch] font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-tutesis-black md:text-6xl">
                                No basta con entregar. Tienes que poder explicar.
                            </h2>
                        </EditorialReveal>
                        <EditorialReveal className="lg:col-span-7 lg:pt-12" delay={0.08}>
                            <p className="max-w-2xl text-xl leading-9 text-tutesis-black/70">
                                Convertimos tu documento en una historia académica que puedas presentar: problema, decisiones metodológicas, hallazgos y conclusiones conectadas.
                            </p>
                            <div className="mt-9 grid gap-px border border-tutesis-black/20 bg-tutesis-black/20 sm:grid-cols-2">
                                {[
                                    ['Síntesis', 'Identifica las ideas que el jurado necesita recordar.'],
                                    ['Presentación', 'Organiza diapositivas que apoyen tu explicación.'],
                                    ['Preguntas', 'Practica respuestas sobre las decisiones de tu estudio.'],
                                    ['Seguridad', 'Habla desde la comprensión, no desde la memorización.']
                                ].map(([title, description]) => (
                                    <div key={title} className="bg-tutesis-white p-6 transition-colors hover:bg-tutesis-gold/15">
                                        <h3 className="font-display text-xl font-extrabold tracking-[-0.025em] text-tutesis-black">{title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-tutesis-black/65">{description}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                href={buildWhatsAppUrl('Hola, quiero prepararme para la defensa de mi tesis.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-md bg-tutesis-black px-5 py-3 text-sm font-bold text-tutesis-white transition-colors hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4"
                            >
                                Quiero prepararme para mi defensa
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </a>
                        </EditorialReveal>
                    </div>
                </section>

                <section id="preguntas" className="border-b border-tutesis-black/20 bg-tutesis-white py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <EditorialReveal className="lg:col-span-5">
                            <SectionLabel index="09">Preguntas frecuentes</SectionLabel>
                            <h2 className="max-w-[13ch] font-display text-4xl font-extrabold leading-tight tracking-[-0.045em] text-tutesis-black md:text-5xl">Resuelve tus dudas antes de empezar.</h2>
                        </EditorialReveal>
                        <EditorialReveal className="lg:col-span-7" delay={0.08}>
                            {FAQS.map((faq, index) => (
                                <details key={faq.question} className="group border-t border-tutesis-black/20 py-1 last:border-b">
                                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left font-display text-xl font-bold text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
                                        <span><span className="mr-3 text-sm font-sans font-bold text-tutesis-black">0{index + 1}</span>{faq.question}</span>
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-tutesis-black/25 text-tutesis-black/65 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                                    </summary>
                                    <div className="pb-6 pl-0 pr-12 text-base leading-7 text-tutesis-black/65 sm:pl-10">
                                        <p>{faq.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </EditorialReveal>
                    </div>
                </section>

                <section ref={finalCtaRef} className="bg-brand-orange py-16 md:py-24">
                    <div className="mx-auto grid max-w-[1280px] items-end gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
                        <div className="lg:col-span-8">
                            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-tutesis-black">El siguiente paso</span>
                            <h2 className="mt-5 max-w-[16ch] font-display text-[clamp(2.8rem,5.4vw,5.5rem)] font-extrabold leading-[0.97] tracking-[-0.055em] text-tutesis-black">
                                Empieza aunque todavía no lo tengas todo claro.
                            </h2>
                        </div>
                        <div className="lg:col-span-4 lg:pb-2">
                            <p className="mb-6 text-base leading-7 text-tutesis-black">Cuéntanos dónde estás. Recibirás una orientación inicial para identificar qué conviene resolver primero.</p>
                            <a
                                href={generalContactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Hablar por WhatsApp"
                                className="group inline-flex min-h-12 w-full items-center justify-between rounded-md bg-tutesis-black px-5 py-4 text-sm font-extrabold text-tutesis-white transition-colors hover:bg-tutesis-white hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-black focus-visible:ring-offset-4 focus-visible:ring-offset-tutesis-orange sm:w-auto sm:min-w-64"
                            >
                                Solicitar diagnóstico gratis
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </section>

                <section className="border-b border-tutesis-black/20 bg-tutesis-white py-14 md:py-20">
                    <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center lg:px-10">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-tutesis-black/70"><Monitor className="h-4 w-4 text-tutesis-orange" aria-hidden="true" /> Plataforma estudiantil</div>
                            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-tutesis-black">¿Ya trabajas con nosotros?</h2>
                            <p className="mt-3 text-sm leading-6 text-tutesis-black/65">Registra tu proyecto o consulta su seguimiento desde la plataforma.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link to="/registro" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tutesis-black bg-tutesis-black px-5 py-3 text-sm font-bold text-tutesis-white hover:border-tutesis-orange hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4">
                                Registrar proyecto <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <Link to="/monitoreo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tutesis-black/30 px-5 py-3 text-sm font-bold text-tutesis-black hover:border-tutesis-orange hover:bg-tutesis-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4">
                                <Search className="h-4 w-4" aria-hidden="true" /> Monitorear
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <a
                href={generalContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2 rounded-md bg-tutesis-black px-4 text-sm font-extrabold text-tutesis-white shadow-[0_12px_34px_rgba(14,14,15,0.28)] transition-[opacity,transform,background-color,color] duration-300 hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 sm:bottom-6 sm:right-6 ${showFloatingWhatsApp ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
                aria-label="Hablar por WhatsApp"
                aria-hidden={!showFloatingWhatsApp}
                tabIndex={showFloatingWhatsApp ? undefined : -1}
            >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp</span>
            </a>
        </div>
    );
};

export default LandingPage;
