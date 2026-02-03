import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/5534998168772?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20pacotes%20de%20viagem%20💚"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse group"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                1
            </span>
        </a>
    );
}
