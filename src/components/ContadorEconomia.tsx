import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingDown, Users, Award, Sparkles } from 'lucide-react';

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    delay: number;
}

function StatItem({ icon, value, suffix, label, delay }: StatItemProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;

        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                current += stepValue;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(interval);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / steps);
        }, delay);

        return () => clearTimeout(timer);
    }, [isInView, value, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: delay / 1000, duration: 0.5 }}
            className="text-center"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                {icon}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {suffix === 'R$' && 'R$ '}
                {displayValue.toLocaleString()}
                {suffix !== 'R$' && suffix}
            </div>
            <div className="text-white/80 font-medium">{label}</div>
        </motion.div>
    );
}

export default function ContadorEconomia() {
    return (
        <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)' }}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block bg-amber-400/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        ✨ Por que escolher a Viaje Mais Tour?
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        Números que Falam por Si
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Clientes que já realizaram o sonho de conhecer novos destinos com economia e atendimento personalizado
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem
                        icon={<TrendingDown className="text-green-400" size={32} />}
                        value={85000}
                        suffix="R$"
                        label="Economizados pelos clientes"
                        delay={0}
                    />
                    <StatItem
                        icon={<Users className="text-blue-400" size={32} />}
                        value={120}
                        suffix="+"
                        label="Viajantes satisfeitos"
                        delay={200}
                    />
                    <StatItem
                        icon={<Award className="text-amber-400" size={32} />}
                        value={98}
                        suffix="%"
                        label="Taxa de satisfação"
                        delay={400}
                    />
                    <StatItem
                        icon={<Sparkles className="text-purple-400" size={32} />}
                        value={50}
                        suffix="+"
                        label="Destinos disponíveis"
                        delay={600}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <a
                        href="/quiz-destino"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                    >
                        <Sparkles size={20} />
                        Descubra seu Destino Ideal
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
