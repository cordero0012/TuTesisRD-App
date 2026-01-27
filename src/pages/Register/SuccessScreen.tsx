import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Confetti from 'react-dom-confetti';

const SuccessScreen: React.FC = () => {
    const location = useLocation();
    const [isExploding, setIsExploding] = React.useState(false);
    const trackingCode = location.state?.trackingCode || "TRX-PENDING";

    React.useEffect(() => {
        setIsExploding(true);
    }, []);

    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const config = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-[#101922] flex items-center justify-center p-4 font-display transition-colors duration-200">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Confetti active={isExploding} config={config} />
            </div>
            <div className="bg-white dark:bg-[#1a2230] max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden text-center animate-slide-up border border-slate-100 dark:border-slate-800">
                <div className="pt-10 pb-6 px-8 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-primary"></div>
                    <div className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 shadow-xl shadow-green-200 dark:shadow-none animate-[bounce_1s_infinite]">
                        <span className="material-symbols-outlined text-6xl">check_circle</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¡Registro Completado!</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tu cuenta ha sido creada y tu proyecto registrado exitosamente en la plataforma.</p>
                </div>
                <div className="px-8 pb-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                        <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Tu Código de Rastreo</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-mono font-black text-brand-orange tracking-widest">{trackingCode}</span>
                            <button
                                onClick={handleCopy}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors relative"
                                title="Copiar"
                            >
                                <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg">Copiado!</span>}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Guarda este código para monitorear el estado de tu proyecto.</p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#151e29] p-8 text-left space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Próximos Pasos</h3>
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-sm">hourglass_top</span></div>
                            <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 my-1"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Asignación de Asesor</h4>
                            <p className="text-sm text-slate-500">Un experto validará tu tema en 24h.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-sm">rocket_launch</span></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Inicio del Proyecto</h4>
                            <p className="text-sm text-slate-500">Comenzaremos a trabajar según lo acordado.</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Link to="/monitoreo" className="block w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                        <span className="material-icons">travel_explore</span> Monitorear mi Proyecto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessScreen;