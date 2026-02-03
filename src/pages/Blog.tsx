import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Search, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { useState } from 'react';

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState("");

    // Featured Post is the first one
    const featuredPost = BLOG_POSTS[0];

    // Rest of the posts
    const otherPosts = BLOG_POSTS.slice(1).filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category)));

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header */}
            <section className="relative pt-32 pb-12 overflow-hidden border-b border-gray-100 bg-white">
                <div className="absolute inset-0 bg-[url('/assets/background-site.jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/90" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-left"
                    >
                        <span className="inline-block py-1 px-4 border border-primary/20 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-sm">
                            Viaje Mais Journal
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-2">
                            Dicas & <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">Destinos</span>
                        </h1>
                        <p className="text-secondary/70 max-w-lg font-light text-lg">
                            O segredo da viagem perfeita revelado pelos nossos especialistas.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-auto relative"
                    >
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Buscar destino..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-secondary placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white w-full md:w-80 transition-all shadow-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={18} />
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Featured Post (Hero) */}
                        {!searchTerm && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link to={`/blog/${featuredPost.id}`} className="group block relative rounded-3xl overflow-hidden aspect-[16/9] border border-gray-100 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />

                                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-3/4">
                                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                                            Destaque da Semana
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-white/90 line-clamp-2 md:text-lg font-light mb-6">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                                            Ler Matéria Completa <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.section>
                        )}

                        {/* Recent Articles Grid */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-serif font-bold text-secondary">
                                    {searchTerm ? `Resultados para "${searchTerm}"` : "Recentes"}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {otherPosts.map((post, index) => (
                                    <Link to={`/blog/${post.id}`} key={post.id} className="block group h-full">
                                        <motion.article
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 flex flex-col group-hover:-translate-y-1"
                                        >
                                            <div className="aspect-[3/2] overflow-hidden relative">
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm uppercase tracking-wider border border-primary/20">
                                                        <Tag size={10} />
                                                        {post.category}
                                                    </span>
                                                </div>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} className="text-primary" />
                                                        {post.date}
                                                    </span>
                                                </div>

                                                <h2 className="text-xl font-serif font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                                                    {post.title}
                                                </h2>
                                                <p className="text-secondary/60 mb-6 line-clamp-3 text-sm flex-grow font-light leading-relaxed">
                                                    {post.excerpt}
                                                </p>

                                                <div className="text-primary font-medium text-xs flex items-center gap-1 uppercase tracking-widest hover:text-secondary transition-colors mt-auto">
                                                    Ler Artigo
                                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-12">

                        {/* Categories Widget */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50">
                            <h4 className="text-lg font-serif font-bold text-secondary mb-6 flex items-center gap-2">
                                <Search size={18} className="text-primary" /> Categorias
                            </h4>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchTerm(cat)}
                                        className="w-full text-left flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 text-secondary/70 hover:text-primary transition-colors group"
                                    >
                                        <span>{cat}</span>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trending / Social */}
                        <div className="bg-gradient-to-br from-primary to-blue-400 p-8 rounded-2xl text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

                            <TrendingUp size={32} className="mx-auto mb-4 text-white/90" />
                            <h4 className="text-xl font-serif font-bold mb-2">Participe da Conversa</h4>
                            <p className="text-white/90 text-sm mb-6 font-medium">
                                Siga a Viaje Mais Tour no Instagram para ofertas relâmpago e inspiração diária!
                            </p>
                            <a
                                href="https://instagram.com/viajemaistour"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block w-full py-3 bg-white text-primary font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                @viajemaistour
                            </a>
                        </div>

                        {/* Newsletter Mini */}
                        <div className="border border-primary/20 rounded-2xl p-6 text-center bg-primary/5">
                            <h4 className="text-secondary font-serif font-bold mb-2">Clube de Ofertas</h4>
                            <p className="text-secondary/60 text-xs mb-4">Receba os melhores pacotes primeiro.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Seu e-mail" className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-secondary focus:outline-none focus:border-primary/50" />
                                <button className="bg-primary text-white p-2 rounded-lg font-bold hover:bg-blue-500 transition-colors shadow-md">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
