import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Clock, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';

export default function BlogPost() {
    const { id } = useParams();
    const post = BLOG_POSTS.find(p => p.id === Number(id));
    const recentPosts = BLOG_POSTS.filter(p => p.id !== Number(id)).slice(0, 3);

    if (!post) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
                    <Link to="/blog" className="text-gold-400 hover:underline">Voltar para o Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Scroll Progress Bar (Top) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
                style={{ scaleX: 0 }} // Logic for real scroll progress could be added here
            />

            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full lg:h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex items-end pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-4xl"
                        >
                            <Link to="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors text-sm font-medium tracking-wider uppercase">
                                <ArrowLeft size={16} className="mr-2" /> Voltar ao Blog
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded">
                                    {post.category}
                                </span>
                                <span className="flex items-center text-white/90 text-sm">
                                    <Clock size={14} className="mr-2" /> 5 min de leitura
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-white/80 py-4 border-t border-white/20">
                                <span className="flex items-center gap-2">
                                    <img src="/assets/logo.png" className="w-8 h-8 rounded-full bg-white/20 p-1" alt="Avatar" />
                                    <span className="font-medium text-white">{post.author}</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {post.date}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Left (Social & Share) - Hidden on mobile, visible on LG */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32 flex flex-col gap-4 items-center">
                            <button className="p-3 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-gray-600 transition-all">
                                <Share2 size={20} />
                            </button>
                            <div className="h-20 w-px bg-gray-200 my-2" />
                            {/* Placeholders for social icons */}
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="
                                text-lg text-gray-700 leading-relaxed
                                [&>p]:mb-6 [&>p]:leading-8
                                [&>h3]:text-3xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-primary [&>h3]:mt-12 [&>h3]:mb-6
                                [&>ul]:list-none [&>ul]:space-y-3 [&>ul]:mb-6 [&>ul]:pl-4
                                [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:before:content-['✓'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-accent [&>ul>li]:before:font-bold
                                [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-primary [&>blockquote]:bg-light-blue
                                [&>strong]:text-primary [&>strong]:font-bold
                                [&>a]:text-accent [&>a]:underline [&>a]:decoration-accent/30 [&>a]:underline-offset-4 hover:[&>a]:decoration-accent hover:[&>a]:text-primary [&>a]:transition-all
                            "
                            dangerouslySetInnerHTML={{ __html: post.content || '' }}
                        />

                        {/* Tags & Interaction */}
                        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
                            <span className="px-4 py-2 bg-light-blue rounded-full text-sm text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                #{post.category}
                            </span>
                            <span className="px-4 py-2 bg-light-blue rounded-full text-sm text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                #ViajeMaisTour
                            </span>
                        </div>
                    </article>

                    {/* Sidebar Right (More Posts) */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* About Box */}
                        <div className="bg-light-blue p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-lg font-serif font-bold text-primary mb-3">Sobre a Viaje Mais Tour</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Somos especialistas em realçar sua beleza natural. Focados em cabelos, unhas e bem-estar, trazemos o que há de melhor para você.
                            </p>
                            <Link to="/sobre" className="text-sm font-bold text-primary uppercase tracking-wider hover:text-accent transition-colors flex items-center">
                                Conheça Nossa História <ChevronRight size={14} className="ml-1" />
                            </Link>
                        </div>

                        {/* Recent Posts */}
                        <div>
                            <h3 className="text-base font-bold text-secondary uppercase tracking-widest mb-6 border-l-4 border-accent pl-4">
                                Outros Artigos
                            </h3>
                            <div className="space-y-6">
                                {recentPosts.map(recent => (
                                    <Link to={`/blog/${recent.id}`} key={recent.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={recent.image} alt={recent.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow">
                                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                                                {recent.category}
                                            </span>
                                            <h4 className="font-serif font-bold text-secondary group-hover:text-primary transition-colors leading-tight line-clamp-2 text-sm">
                                                {recent.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter/CTA */}
                        <div className="bg-accent p-6 rounded-2xl text-center">
                            <h3 className="text-xl font-serif font-bold text-white mb-2">Quer dicas exclusivas?</h3>
                            <p className="text-white/90 text-sm mb-6">
                                Agende seu horário e receba uma consultoria personalizada.
                            </p>
                            <a
                                href="https://wa.me/5534998168772"
                                target="_blank"
                                className="block w-full py-3 bg-white text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Agendar Agora
                            </a>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
