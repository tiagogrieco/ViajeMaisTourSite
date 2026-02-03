import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

// Verificar localStorage fora do componente (só roda uma vez)
const getInitialConsent = () => {
    try {
        return localStorage.getItem('vmt-cookie-consent') !== null;
    } catch {
        return true; // Se localStorage não disponível, não mostrar
    }
};

export default function CookieBanner() {
    // Se já tem consentimento, começa oculto
    const [showBanner, setShowBanner] = useState(!getInitialConsent());

    const acceptCookies = () => {
        localStorage.setItem('vmt-cookie-consent', 'accepted');
        setShowBanner(false);

        // Ativar Google Analytics após consentimento
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const declineCookies = () => {
        localStorage.setItem('vmt-cookie-consent', 'declined');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:flex md:items-center md:gap-6">
                        <div className="flex items-start gap-4 flex-1 mb-4 md:mb-0">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Cookie className="text-amber-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">🍪 Utilizamos cookies</h3>
                                <p className="text-sm text-gray-600">
                                    Usamos cookies para melhorar sua experiência e analisar o tráfego do site.
                                    Ao continuar navegando, você concorda com nossa{' '}
                                    <a href="#" className="text-primary underline hover:text-accent">
                                        Política de Privacidade
                                    </a>.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={declineCookies}
                                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                Recusar
                            </button>
                            <button
                                onClick={acceptCookies}
                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                            >
                                Aceitar
                            </button>
                        </div>

                        <button
                            onClick={declineCookies}
                            className="absolute top-3 right-3 md:hidden p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
