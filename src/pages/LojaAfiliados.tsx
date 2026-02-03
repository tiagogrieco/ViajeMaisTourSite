import { motion } from 'framer-motion';
import { Construction, Bell } from 'lucide-react';

export default function LojaAfiliados() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
            >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Construction size={48} className="text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                    Em Construção
                </h1>

                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Estamos preparando algo incrível para você!
                    A <strong>Loja do Viajante</strong> chegará em breve com produtos selecionados para sua próxima aventura.
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 justify-center text-white mb-3">
                        <Bell size={20} />
                        <span className="font-bold">Fique por dentro!</span>
                    </div>
                    <p className="text-white/80 text-sm">
                        Siga nosso Instagram <strong>@viajemais_tour</strong> para saber em primeira mão quando lançarmos!
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

