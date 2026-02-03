import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Phone, CheckCircle2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import DestinationCards from '../components/DestinationCards';
import TestimonialSection from '../components/TestimonialSection';
import InstagramFeed from '../components/InstagramFeed';
import ContadorEconomia from '../components/ContadorEconomia';
import { BLOG_POSTS } from '../data/blogData';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-light-blue font-sans text-secondary">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/assets/hero-collage-new.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
                            PACOTES PERSONALIZADOS
                        </h1>
                        <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto font-medium drop-shadow-lg [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                            Viaje do seu jeito! Oferecemos pacotes personalizados para todos os estilos,
                            desde aventuras radicais até viagens relaxantes.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <a
                                href="https://wa.me/5534998168772"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(97,206,112,0.4)] hover:shadow-[0_0_30px_rgba(97,206,112,0.6)] hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Phone size={24} />
                                Falar com Consultor
                            </a>
                            <Link
                                to="/loja"
                                className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Globe size={24} />
                                Ver Destinos
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Por Que Escolher Nosso Serviço?</h2>
                        <div className="w-20 h-1 bg-accent mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Globe, title: "Destinos Exclusivos", desc: "Acesso a lugares únicos e pouco explorados." },
                            { icon: Calendar, title: "Roteiros Personalizados", desc: "Viagens planejadas sob medida para você." },
                            { icon: CheckCircle2, title: "Facilidade na Reserva", desc: "Processo rápido, seguro e sem complicações." },
                            { icon: Phone, title: "Suporte 24/7", desc: "Estamos com você em cada etapa da viagem." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-light-blue rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Destination Cards */}
            <DestinationCards />

            {/* Contador de Economia */}
            <ContadorEconomia />

            {/* Testimonials */}
            <TestimonialSection />

            {/* Instagram Feed */}
            <InstagramFeed />

            {/* Featured Blog Posts (From Official Site Data) */}
            <section className="py-20 bg-light-blue">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Inspiração para Sua Próxima Viagem</h2>
                        <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto">Dicas, roteiros e novidades do mundo do turismo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {BLOG_POSTS.slice(0, 3).map((post) => (
                            <Link to={`/blog/${post.id}`} key={post.id}>
                                <motion.article
                                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="h-48 overflow-hidden relative group">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <Calendar size={14} />
                                            <span>{post.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 hover:text-accent transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors mt-auto">
                                            Ler Mais <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-md font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-wide"
                        >
                            Ver Todos os Artigos
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
