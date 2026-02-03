import { motion } from 'framer-motion';
import { Plane, MessageCircle, MapPin } from 'lucide-react';
import { useState } from 'react';

const PACKAGES = [
    // --- NACIONAIS ---
    {
        id: 1,
        name: "Porto de Galinhas - All Inclusive (5 dias)",
        price: 2499.00,
        images: ["/assets/products/porto-galinhas.jpg"],
        description: "Aéreo + Resort All Inclusive. O paraíso de águas cristalinas espera por você com todo conforto.",
        tags: ["Nordeste", "Promoção"],
        category: "Nacionais"
    },
    {
        id: 2,
        name: "Gramado e Canela - Serra Gaúcha (4 dias)",
        price: 1899.00,
        images: ["/assets/products/gramado.jpg"],
        description: "Hospedagem charmosa + Tour Uva e Vinho + Passeio de Maria Fumaça.",
        tags: ["Romântico", "Inverno"],
        category: "Nacionais"
    },
    {
        id: 3,
        name: "Rio de Janeiro - Copacabana (3 dias)",
        price: 1299.00,
        images: ["/assets/products/rio.jpg"],
        description: "Aéreo + Hotel na orla de Copacabana. Curta o Rio com estilo e localização privilegiada.",
        tags: ["Cidade Maravilhosa", "Praia"],
        category: "Nacionais"
    },

    // --- INTERNACIONAIS ---
    {
        id: 4,
        name: "Orlando Mágico - Disney (10 dias)",
        price: 8990.00,
        images: ["/assets/products/disney.jpg"],
        description: "Pacote completo: Aéreo + Hotel + Ingressos para os 4 parques da Disney.",
        tags: ["Família", "Disney"],
        category: "Internacionais"
    },
    {
        id: 5,
        name: "Paris Romântica (7 dias)",
        price: 7590.00,
        images: ["/assets/products/paris.jpg"],
        description: "Voo direto + Hotel próximo à Torre Eiffel + Cruzeiro no Sena.",
        tags: ["Romântico", "Europa"],
        category: "Internacionais"
    },
    {
        id: 6,
        name: "Buenos Aires - Tango & Vinho (4 dias)",
        price: 2890.00,
        images: ["/assets/products/buenos-aires.jpg"],
        description: "Aéreo + Hotel central + Jantar com Show de Tango + Tour de Vinhos.",
        tags: ["Cultural", "Gastronomia"],
        category: "Internacionais"
    },

    // --- CRUZEIROS ---
    {
        id: 7,
        name: "Cruzeiro MSC - Costa Brasileira (4 noites)",
        price: 2200.00,
        images: ["/assets/products/cruzeiro-msc.jpg"],
        description: "Cabine com varanda, todas as refeições inclusas e entretenimento a bordo.",
        tags: ["Mar", "MSC"],
        category: "Cruzeiros"
    },
    {
        id: 8,
        name: "Caribe Royal Caribbean (7 noites)",
        price: 5500.00,
        images: ["/assets/products/royal-caribbean.jpg"],
        description: "Navegue pelo Caribe visitando Bahamas, Jamaica e México. Experiência de luxo.",
        tags: ["Luxo", "Caribe"],
        category: "Cruzeiros"
    },

    // --- RESORTS ---
    {
        id: 9,
        name: "Iberostar Bahia - Praia do Forte",
        price: 3500.00,
        images: ["/assets/products/iberostar.jpg"],
        description: "Experiência 5 estrelas All Inclusive na Bahia. Diversão para toda a família.",
        tags: ["All Inclusive", "Bahia"],
        category: "Resorts"
    },
    {
        id: 10,
        name: "Salinas Maragogi Resort",
        price: 4200.00,
        images: ["/assets/products/salinas.jpg"],
        description: "Premiado como um dos melhores resorts do mundo para famílias. Pé na areia.",
        tags: ["Luxo", "Família"],
        category: "Resorts"
    },
    {
        id: 11,
        name: "Maldivas - Bangalôs Sobre as Águas (7 dias)",
        price: 18900.00,
        images: ["/assets/products/maldivas.jpg"],
        description: "A viagem dos sonhos. Aéreo luxo + Resort All Inclusive em bangalô exclusivo.",
        tags: ["Lua de Mel", "Exclusivo"],
        category: "Internacionais"
    },
    {
        id: 12,
        name: "Cancún - Hard Rock Hotel (5 dias)",
        price: 6800.00,
        images: ["/assets/products/cancun.jpg"],
        description: "Festa, praia e rock'n roll. All Inclusive de alto padrão no Caribe Mexicano.",
        tags: ["Festa", "Caribe"],
        category: "Internacionais"
    }
];

const CATEGORIES = ["Todos", "Nacionais", "Internacionais", "Cruzeiros", "Resorts"];

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredProducts = selectedCategory === "Todos"
        ? PACKAGES
        : PACKAGES.filter(p => p.category === selectedCategory);

    const getWhatsappLink = (packageName: string) => {
        const text = `Olá! Vi o pacote *${packageName}* no site e gostaria de saber mais detalhes e datas disponíveis.`;
        return `https://wa.me/5534998168772?text=${encodeURIComponent(text)}`;
    };

    // Reusable Card Component
    const ProductCard = ({ product, index }: { product: any, index: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
        >
            {/* Image */}
            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-primary/20 transition-colors duration-500" />

                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Check if Best Seller or Luxo */}
                {(product.tags.includes("Promoção") || product.tags.includes("Luxo")) && (
                    <div className="absolute top-4 left-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg ${product.tags.includes("Promoção") ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                            {product.tags.includes("Promoção") ? "Promoção" : "Luxo"}
                        </span>
                    </div>
                )}

                {/* Hover Action */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6">
                    <a
                        href={getWhatsappLink(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white/90 backdrop-blur text-primary font-bold py-3 rounded-xl shadow-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 border border-white/20"
                    >
                        <MessageCircle size={18} />
                        Consultar Datas
                    </a>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow relative">
                <div className="mb-2 flex items-start justify-between gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
                        {product.tags[0]}
                    </span>
                </div>

                <h3 className="font-serif font-bold text-secondary text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed font-light">
                    {product.description}
                </p>
                {/* 
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Preço</span>
                        <span className="text-xl font-bold text-primary">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div> 
                */}
            </div>
        </motion.div>
    );

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/background-site.jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white" />

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-[0.15em] uppercase mb-6 backdrop-blur-sm">
                            <Plane size={14} /> Pacotes Viaje Mais
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6">
                            Roteiros <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">Exclusivos</span>
                        </h1>
                        <p className="text-xl text-secondary/70 max-w-2xl mx-auto font-light leading-relaxed">
                            Viagens selecionadas por quem entende do mundo para você viver momentos inesquecíveis.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border
                                ${selectedCategory === cat
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white text-secondary/60 border-gray-200 hover:border-primary/50 hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-secondary">Nenhum pacote encontrado</h3>
                        <p className="text-secondary/50">Tente selecionar outra categoria ou destino.</p>
                    </div>
                )}
            </section>

            {/* Newsletter / Contact Banner */}
            <section className="py-20 relative overflow-hidden text-center text-white px-4 bg-primary">
                <div className="absolute inset-0 bg-[url('/assets/background-site.jpg')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-white">Consultoria de Viagem</h2>
                    <p className="text-white/90 mb-10 text-lg font-light">
                        Não encontrou o destino dos sonhos? Nossos consultores montam um roteiro 100% personalizado para você.
                    </p>
                    <a
                        href="https://wa.me/5534984023603"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-bold hover:bg-gray-50 transition-colors shadow-xl shadow-black/10"
                    >
                        <MessageCircle size={20} />
                        Falar com Especialista
                    </a>
                </div>
            </section>
        </div>
    );
}
