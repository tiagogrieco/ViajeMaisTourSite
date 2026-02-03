import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
    name: string;
    location: string;
    rating: number;
    text: string;
    avatar?: string;
    destination: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Maria Silva",
        location: "Uberlândia - MG",
        rating: 5,
        text: "Experiência incrível! A Aline organizou cada detalhe da nossa lua de mel em Maceió. Desde o atendimento até o roteiro, tudo foi perfeito!",
        destination: "Maceió - AL"
    },
    {
        name: "Carlos Roberto",
        location: "Araguari - MG",
        rating: 5,
        text: "Fizemos uma viagem com a família toda para Porto Seguro. O atendimento foi excelente e conseguimos um precinho muito bom!",
        destination: "Porto Seguro - BA"
    },
    {
        name: "Ana Paula",
        location: "Uberaba - MG",
        rating: 5,
        text: "Segunda viagem que faço com a Viaje Mais Tour e já estou planejando a terceira! Confiança e qualidade garantidas.",
        destination: "Gramado - RS"
    },
    {
        name: "Fernando Santos",
        location: "Uberlândia - MG",
        rating: 5,
        text: "Sonhávamos com a Disney há anos e a Viaje Mais Tour realizou esse sonho! Pacote completo, sem dor de cabeça. Nossos filhos amaram!",
        destination: "Orlando - EUA"
    },
    {
        name: "Luciana Oliveira",
        location: "Patos de Minas - MG",
        rating: 5,
        text: "O cruzeiro foi espetacular! A equipe cuidou de tudo, desde a documentação até o transfer. Super recomendo para quem quer viajar tranquilo.",
        destination: "Cruzeiro Costa Brasileira"
    },
    {
        name: "Ricardo Mendes",
        location: "Ituiutaba - MG",
        rating: 5,
        text: "Fizemos um pacote para Cancún e foi melhor do que imaginávamos! Resort incrível e atendimento nota 10. Voltaremos com certeza!",
        destination: "Cancún - México"
    }
];

export default function TestimonialSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-light-blue">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4"
                    >
                        O Que Nossos Clientes Dizem
                    </motion.h2>
                    <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Histórias reais de quem viajou com a gente e voltou com memórias inesquecíveis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 text-primary/10 text-6xl font-serif group-hover:text-primary/20 transition-colors">
                                "
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="font-bold text-primary">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                                <p className="text-xs text-accent mt-2">Viajou para {testimonial.destination}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
