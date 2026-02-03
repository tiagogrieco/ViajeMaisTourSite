import { motion } from 'framer-motion';
import { Star, Globe, Compass, ShieldCheck } from 'lucide-react';

export default function About() {
    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/background-site.jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white" />

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6"
                    >
                        Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary italic">Jornada</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-secondary/70 max-w-2xl mx-auto font-light"
                    >
                        Conheça quem faz seus sonhos de viagem se tornarem realidade.
                    </motion.p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-primary/10 group max-w-md mx-auto">
                            {/* Travel Photo */}
                            <img
                                src="/assets/aline_profile.jpg"
                                alt="Aline Martins Gonçalves - Fundadora Viaje Mais Tour"
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                            />
                            {/* Overlay Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur p-6 rounded-2xl border border-primary/20 shadow-xl hidden md:block max-w-xs">
                            <div className="text-2xl font-serif font-bold text-primary mb-1">Aline Martins Gonçalves</div>
                            <div className="text-secondary/80 text-sm font-medium">Fundadora & CEO<br />Especialista em Viagens</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary tracking-[0.2em] uppercase text-sm font-bold mb-4 block">
                            Sobre Nós
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-secondary mb-8">
                            Mais que uma agência,<br />sua parceira de <span className="text-primary italic">Exploração</span>
                        </h2>

                        <div className="space-y-6 text-secondary/70 leading-relaxed text-lg font-light">
                            <p>
                                A <strong className="text-primary font-medium">Viaje Mais Tour</strong> é liderada por <strong>Aline Martins Gonçalves</strong>, uma apaixonada por conectar pessoas a destinos inesquecíveis.
                            </p>
                            <p>
                                Com experiência e dedicação, transformamos o planejamento da sua viagem em uma experiência tranquila e segura. Seja uma lua de mel, férias em família ou um roteiro de aventura, cuidamos de cada detalhe com excelência.
                            </p>
                            <p className="border-l-2 border-primary/50 pl-4 italic text-secondary/90">
                                "Meu compromisso é garantir que cada cliente volte para casa não apenas com fotos, mas com memórias que durarão para sempre."
                                <br /><span className="text-sm text-primary mt-2 block not-italic font-bold">— Aline Martins</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-12">
                            {[
                                { icon: Globe, label: "Destinos Globais", color: "text-blue-500" },
                                { icon: ShieldCheck, label: "Segurança Total", color: "text-green-500" },
                                { icon: Compass, label: "Roteiros Únicos", color: "text-primary" },
                                { icon: Star, label: "Atendimento VIP", color: "text-purple-500" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 group">
                                    <div className={`p-2 rounded-lg bg-gray-50 border border-gray-100 group-hover:border-primary/30 transition-colors ${item.color}`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-medium text-secondary">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
