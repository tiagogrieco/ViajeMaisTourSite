// Store Page Component - Updated
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import { useState } from 'react';
import { PRODUCTS, type Product } from '../data/products';

export default function Store() {
    const [products] = useState<Product[]>(PRODUCTS);

    const getWhatsappLink = (productName: string, price: number) => {
        const text = `Olá! Quero comprar na Loja Virtual:\n\n*${productName}*\nPreço: R$ ${price.toFixed(2)}\n\nComo faço para pagar e receber?`;
        return `https://wa.me/5534998168772?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white pt-32 pb-12 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-serif font-bold text-secondary mb-4"
                    >
                        Loja <span className="text-primary italic">Viaje Mais</span>
                    </motion.h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Acessórios e essenciais selecionados para tornar sua viagem mais confortável e segura.
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                        >
                            <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.featured && (
                                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        Destaque
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-lg font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                                <a
                                    href={product.affiliate_link || getWhatsappLink(product.name, product.price)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${product.affiliate_link ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white'}`}
                                >
                                    {product.affiliate_link ? <ShoppingBag size={14} /> : <Plus size={16} />}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
