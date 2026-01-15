import React from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-dom-confetti';

const SuccessScreen: React.FC = () => {
    const [isExploding, setIsExploding] = React.useState(false);

    React.useEffect(() => {
        setIsExploding(true);
    }, []);

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
                <div className="bg-slate-50 dark:bg-[#151e29] p-8 text-left space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Próximos Pasos</h3>
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-sm">hourglass_top</span></div>
                            <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 my-1"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Revisión Automática</h4>
                            <p className="text-sm text-slate-500">Nuestro sistema de IA validará tus datos en 24h.</p>
                        </div>
                    </div>
                        <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-sm">mail</span></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Confirmación</h4>
                            <p className="text-sm text-slate-500">Recibirás un email oficial con tus credenciales.</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Link to="/student/portal" className="block w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all">Ir a mi Perfil</Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessScreen;