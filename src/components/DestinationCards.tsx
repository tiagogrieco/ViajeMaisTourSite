import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Destination {
    name: string;
    location: string;
    image: string;
    priceFrom: string;
    duration: string;
    highlight: string;
    badge?: string;
}

const destinations: Destination[] = [
    {
        name: "Maceió",
        location: "Alagoas",
        image: "/assets/destinations/maceio.png",
        priceFrom: "R$ 1.890",
        duration: "5 dias / 4 noites",
        highlight: "Praias de águas cristalinas",
        badge: "MAIS VENDIDO"
    },
    {
        name: "Porto Seguro",
        location: "Bahia",
        image: "/assets/destinations/porto-seguro.png",
        priceFrom: "R$ 2.190",
        duration: "7 dias / 6 noites",
        highlight: "Litoral baiano completo"
    },
    {
        name: "Gramado",
        location: "Rio Grande do Sul",
        image: "/assets/destinations/gramado.png",
        priceFrom: "R$ 2.490",
        duration: "4 dias / 3 noites",
        highlight: "Cidade encantadora",
        badge: "PROMOÇÃO"
    },
    {
        name: "Chapada dos Veadeiros",
        location: "Goiás",
        image: "/assets/destinations/chapada.png",
        priceFrom: "R$ 1.590",
        duration: "4 dias / 3 noites",
        highlight: "Natureza exuberante"
    }
];

export default function DestinationCards() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4"
                    >
                        Destinos em Destaque
                    </motion.h2>
                    <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Pacotes especiais com os melhores preços e roteiros incríveis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((destination, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                        >
                            {/* Badge */}
                            {destination.badge && (
                                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wider shadow-lg">
                                    {destination.badge}
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Location */}
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-2xl font-serif font-bold">{destination.name}</h3>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin size={14} />
                                        <span>{destination.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                                    <Calendar size={16} className="text-accent" />
                                    {destination.duration}
                                </p>

                                <p className="text-gray-700 mb-4">{destination.highlight}</p>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <DollarSign size={18} className="text-accent" />
                                    <span className="text-sm text-gray-500">A partir de</span>
                                    <span className="text-2xl font-bold text-primary">{destination.priceFrom}</span>
                                </div>

                                {/* CTA */}
                                <a
                                    href={`https://wa.me/5534998168772?text=${encodeURIComponent(`Olá! Vi o pacote de *${destination.name}* (${destination.duration}) a partir de ${destination.priceFrom} no site e gostaria de saber mais detalhes!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group-hover:bg-accent"
                                >
                                    Ver Pacote <ArrowRight size={18} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-12">
                    <Link
                        to="/loja"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-wide"
                    >
                        Ver Todos os Destinos <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
