import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppButton from './WhatsAppButton';
import CookieBanner from './CookieBanner';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Sobre', path: '/sobre' },
        { name: 'Pacotes', path: '/pacotes' },
        { name: 'Loja 🛍️', path: '/loja-afiliados' },
        { name: 'Blog', path: '/blog' },
        { name: 'Quiz', path: '/quiz-destino' },
        { name: 'Calculadora', path: '/calculadora' },
        { name: 'Consultora IA', path: '/consultoria-ia' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-secondary">
            {/* Navigation */}
            <nav
                className={`fixed w-full z-50 transition-all duration-500 border-b border-transparent
                    ${scrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-xl border-gray-100 shadow-sm py-2' : 'bg-transparent py-6'}
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center transition-all duration-300">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/assets/logo-hires.png" alt="Viaje Mais Logo" className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'}`} />
                            <div className="flex flex-col">
                                <span className={`font-serif font-bold text-primary leading-none transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                    Viaje Mais
                                </span>
                                <span className="text-[10px] tracking-[0.15em] text-secondary uppercase font-medium">
                                    Tour e Experiências
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium tracking-wide transition-all hover:text-primary relative py-2
                                        ${isActive(link.path) ? 'text-primary font-bold' : scrolled ? 'text-secondary' : 'text-secondary'}
                                    `}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                            <a
                                href="https://wa.me/5534998168772"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-6 bg-accent text-white rounded-full font-bold hover:bg-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20 active:scale-95 flex items-center gap-2 ${scrolled ? 'py-2.5 text-sm' : 'py-3'}`}
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4 brightness-0 invert" alt="" />
                                Falar no WhatsApp
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl"
                        >
                            <div className="px-4 py-8 space-y-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-6 py-4 rounded-xl text-lg font-medium transition-all border group
                                            ${isActive(link.path)
                                                ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                                                : 'text-secondary border-transparent hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            {link.name}
                                            {isActive(link.path) && <div className="w-2 h-2 rounded-full bg-accent" />}
                                        </div>
                                    </Link>
                                ))}
                                <a
                                    href="https://wa.me/5534998168772"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-6 py-4 text-center bg-accent text-white rounded-xl font-bold hover:bg-green-500 shadow-xl shadow-green-500/10 active:scale-95 transition-transform"
                                >
                                    Falar no WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-grow pt-0">
                {children}
            </main>

            {/* WhatsApp Button */}
            <WhatsAppButton />

            {/* Cookie Banner */}
            <CookieBanner />

            {/* Footer */}
            <footer className="bg-primary text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <img src="/assets/logo-hires.png" alt="Viaje Mais Logo" className="h-10 w-auto brightness-0 invert" />
                                <span className="text-2xl font-serif font-bold text-white">Viaje Mais</span>
                            </div>
                            <p className="text-white/80 max-w-sm leading-relaxed font-light text-lg">
                                Descubra destinos exclusivos e viva experiências inesquecíveis.
                                Pacotes personalizados para realizar o seu sonho de viajar.
                            </p>

                            {/* Cadastur Section */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                                    <img src="/assets/cadastur.png" alt="Cadastur Certificado" className="w-24 h-auto" />
                                </div>
                                <div className="text-xs text-white/70">
                                    <p className="font-bold text-white mb-1 uppercase tracking-wider">Agência Certificada</p>
                                    <p>Cadastur: 59.688.475/0001-65</p>
                                    <p>CNPJ: 59.726.312/0001-20</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Column */}
                        <div>
                            <h4 className="font-serif text-lg text-white font-bold mb-6">Menu</h4>
                            <ul className="space-y-4">
                                <li><Link to="/sobre" className="text-white/70 hover:text-white transition-colors hover:pl-2 duration-300 block">Quem Somos</Link></li>
                                <li><Link to="/blog" className="text-white/70 hover:text-white transition-colors hover:pl-2 duration-300 block">Blog de Viagens</Link></li>
                                <li><Link to="/pacotes" className="text-white/70 hover:text-white transition-colors hover:pl-2 duration-300 block">Pacotes e Promoções</Link></li>

                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="font-serif text-lg text-white font-bold mb-6">Contato VIP</h4>
                            <ul className="space-y-4 text-white/80">
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                    <span className="flex-1">
                                        <a href="mailto:aline@viajemaistour.com" className="hover:text-white transition-colors">aline@viajemaistour.com</a>
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                    <span className="flex-1">
                                        <a href="https://wa.me/5534998168772" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">(34) 99816-8772</a>
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                                    <span className="flex-1">
                                        Uberlândia - MG<br />
                                        <span className="text-xs uppercase tracking-wider text-white/60">Atendimento Personalizado</span>
                                    </span>
                                </li>
                                <li className="flex gap-4 mt-8">
                                    <a href="https://wa.me/5534998168772" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 border border-white/20 rounded-full hover:bg-accent hover:border-accent hover:text-white transition-all">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.google.com/maps/place/GlowFast/@-18.9347812,-48.2882355,17z/data=!4m15!1m8!3m7!1s0x94a444e57166750b:0x4706bd992f4f722e!2sR.+da+Carioca,+541+-+Patrim%C3%B4nio,+Uberl%C3%A2ndia+-+MG,+38411-046!3b1!8m2!3d-18.9347812!4d-48.2882355!16s%2Fg%2F11y5hk3wc3!3m5!1s0x94a445c40d8b97ab:0x25650cfd950cdeb2!8m2!3d-18.9350865!4d-48.288247!16s%2Fg%2F11xyn156d7" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 border border-white/20 rounded-full hover:bg-accent hover:border-accent hover:text-white transition-all">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com/viajemais_tour/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 border border-white/20 rounded-full hover:bg-accent hover:border-accent hover:text-white transition-all">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-16 pt-8 text-center text-white/50 text-xs tracking-wider uppercase">
                        © {new Date().getFullYear()} Viaje Mais Tour. Todos os direitos reservados.
                        <span className="hidden md:inline"> • </span>
                        <br className="md:hidden" />
                        CNPJ: 59.726.312/0001-20
                    </div>
                </div>
            </footer>
        </div>
    );
}
