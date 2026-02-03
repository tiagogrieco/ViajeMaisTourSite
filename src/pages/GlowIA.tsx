import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { consultGlowIA } from '../services/api';

export default function GlowIA() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ message: string, products: string[] } | null>(null);

    const [formData, setFormData] = useState({
        destinationType: '',
        companion: '',
        budget: ''
    });

    const handleNext = async () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Submit
            setLoading(true);
            try {
                const data = await consultGlowIA(formData);
                setResult(data);
            } catch (error) {
                console.error(error);
                alert("Erro ao conectar com a Consultora Viaje Mais. Verifique se o servidor está rodando.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRestart = () => {
        setStep(0);
        setResult(null);
        setFormData({ destinationType: '', companion: '', budget: '' });
    }

    const questions = [
        {
            key: 'destinationType',
            title: "Que tipo de viagem você procura?",
            options: ["Praia e Sol", "Montanha e Frio", "Cidade e Cultura", "Aventura e Natureza", "Resort All-Inclusive"]
        },
        {
            key: 'companion',
            title: "Com quem você vai viajar?",
            options: ["Sozinho(a)", "Casal", "Família com Crianças", "Grupo de Amigos", "Melhor Idade"]
        },
        {
            key: 'budget',
            title: "Qual seu orçamento ideal?",
            options: ["Econômico", "Conforto", "Luxo Acessível", "Alto Luxo", "Sem Limites"]
        }
    ];

    if (result) {
        return (
            <div className="min-h-screen bg-emerald-950 pt-32 pb-20 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={100} className="text-gold-500" />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center border-4 border-emerald-50 shrink-0">
                            <Sparkles className="text-emerald-950" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-emerald-950">Consultora Viaje Mais</h2>
                            <p className="text-sm text-gray-400">Roteiro Personalizado via IA</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-4">
                            {result.message}
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 mb-4">Pacote Sugerido:</h3>
                        <div className="space-y-3">
                            {result.products.map((prod, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="font-bold text-emerald-900">{prod}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={`https://wa.me/5534998168772?text=${encodeURIComponent(`Olá! Fiz a consultoria de viagem e ela me indicou: ${result.products.join(', ')}. Gostaria de orçar!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                        >
                            <MessageCircle size={20} />
                            Orçar Pacote no Whats
                        </a>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-4 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Nova Consulta
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4">
            <div className="absolute inset-0 bg-[url('/assets/background-site.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
            <div className="max-w-xl mx-auto relative z-10">
                <div className="text-center mb-10 text-secondary">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        Beta
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Consultora IA</h1>
                    <p className="text-secondary/70 text-lg">
                        Sua agente de viagens virtual. Responda 3 perguntas e descubra o destino ideal.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-primary/10 border border-gray-100">
                    <div className="p-8">
                        {/* Progress */}
                        <div className="flex gap-2 mb-8">
                            {[0, 1, 2].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
                            ))}
                        </div>

                        {/* Question */}
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-secondary mb-6">
                                {questions[step].title}
                            </h2>

                            <div className="space-y-3">
                                {questions[step].options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            const key = questions[step].key as keyof typeof formData;
                                            setFormData(prev => ({ ...prev, [key]: option }));
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group
                                            ${formData[questions[step].key as keyof typeof formData] === option
                                                ? 'border-primary bg-primary/5 text-secondary'
                                                : 'border-gray-100 hover:border-primary/50 hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <span className="font-medium">{option}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                            ${formData[questions[step].key as keyof typeof formData] === option ? 'border-primary' : 'border-gray-300 group-hover:border-primary/50'}`}>
                                            {formData[questions[step].key as keyof typeof formData] === option && (
                                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                            <button
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0}
                                className={`px-6 py-3 font-bold text-gray-400 rounded-xl transition-colors ${step === 0 ? 'opacity-0' : 'hover:bg-gray-50 hover:text-gray-600'}`}
                            >
                                Voltar
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!formData[questions[step].key as keyof typeof formData] || loading}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        {step === 2 ? 'Analisar' : 'Próximo'}
                                        {step < 2 && <ArrowRight size={18} />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
