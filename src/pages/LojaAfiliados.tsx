
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Tag, Filter, Star, ExternalLink } from 'lucide-react';
import { PRODUCTS, type Product } from '../data/products';

export default function LojaAfiliados() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

    // Extract unique categories
    const categories = ['Todos', ...new Set(PRODUCTS.map(p => p.category))];

    // Filter products
    const filteredProducts = selectedCategory === 'Todos'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            {/* Hero Section */}
            <div className="bg-primary text-white py-16 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                            <ShoppingBag className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Loja do Viajante
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
                            Produtos essenciais selecionados por especialistas para tornar sua viagem mais confortável e segura.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                                px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                flex items-center gap-2
                                ${selectedCategory === category
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }
                            `}
                        >
                            {category === 'Todos' ? <Filter size={16} /> : <Tag size={16} />}
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        Nenhum produto encontrado nesta categoria.
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-6">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Produto';
                    }}
                />

                {product.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Recomendado
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    {product.category}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">A partir de</span>
                        <span className="text-2xl font-bold text-gray-900">
                            {product.currency === 'BRL' ? 'R$' : '$'}
                            {product.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    <a
                        href={product.affiliate_link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium text-sm
                            hover:bg-primary transition-colors flex items-center gap-2
                            group-hover:shadow-lg group-hover:shadow-primary/20
                        "
                    >
                        Comprar
                        <ExternalLink size={16} />
                    </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
