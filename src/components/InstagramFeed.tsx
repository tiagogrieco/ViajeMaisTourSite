import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface InstagramPost {
    id: string;
    imageUrl: string;
    likes: number;
    comments: number;
    caption: string;
    permalink?: string;
}

// Fallback data in case JSON fetch fails
const FALLBACK_POSTS: InstagramPost[] = [
    {
        id: '1',
        imageUrl: '/assets/destinations/maceio.png',
        likes: 245,
        comments: 18,
        caption: 'Maceió te espera com águas cristalinas! 🏖️'
    },
    {
        id: '2',
        imageUrl: '/assets/destinations/gramado.png',
        likes: 312,
        comments: 24,
        caption: 'Gramado é sempre uma boa ideia! ✈️'
    },
    {
        id: '3',
        imageUrl: '/assets/destinations/porto-seguro.png',
        likes: 189,
        comments: 15,
        caption: 'Bahia encanta em qualquer estação 🌳'
    },
    {
        id: '4',
        imageUrl: '/assets/destinations/chapada.png', // Changed to existing
        likes: 267,
        comments: 21,
        caption: 'Natureza exuberante e cachoeiras 🌊'
    },
    {
        id: '5',
        imageUrl: '/assets/destinations/rio.jpg', // Changed to existing (if downloaded) or fallback
        likes: 421,
        comments: 35,
        caption: 'Cidade maravilhosa! 🗼'
    }
];

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await fetch('/assets/instagram/feed_data.json');
                if (!response.ok) throw new Error('Failed to load feed');

                const data = await response.json();

                if (data.posts && Array.isArray(data.posts)) {
                    // Map JSON data to component structure
                    const mappedPosts: InstagramPost[] = data.posts.slice(0, 6).map((item: any) => ({
                        id: String(item.id),
                        imageUrl: `/assets/instagram/${item.filename}`,
                        likes: Math.floor(Math.random() * 200) + 50, // Mock likes as they are not in JSON
                        comments: Math.floor(Math.random() * 20) + 5, // Mock comments
                        caption: item.caption || '',
                        permalink: item.url
                    }));

                    if (mappedPosts.length > 0) {
                        setPosts(mappedPosts);
                    }
                }
            } catch (error) {
                console.error("Error loading Instagram feed:", error);
                // Keep fallback posts
            }
        };

        fetchFeed();
    }, []);

    return (
        <section className="py-20 bg-gradient-to-b from-light-blue to-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 mb-4"
                    >
                        <Instagram size={32} className="text-pink-600" />
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                            Siga no Instagram
                        </h2>
                    </motion.div>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Acompanhe nossos destinos, dicas de viagem e experiências incríveis! 📸
                    </p>
                    <a
                        href="https://www.instagram.com/viajemais_tour/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all hover:-translate-y-1"
                    >
                        <Instagram size={20} />
                        @viajemais_tour
                    </a>
                </div>

                {/* Grid de Posts */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {posts.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={post.permalink || "https://www.instagram.com/viajemais_tour/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Imagem */}
                            <img
                                src={post.imageUrl}
                                alt={post.caption}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    (e.target as HTMLImageElement).src = '/assets/destinations/maceio.png';
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="w-full text-white">
                                    <p className="text-sm mb-2 line-clamp-2">{post.caption}</p>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Heart size={14} fill="currentColor" />
                                            {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={14} />
                                            {post.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Instagram Icon */}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Instagram size={16} className="text-pink-600" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* CTA Final */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        💡 Inspire-se com nossos destinos e comece a planejar sua próxima viagem!
                    </p>
                    <a
                        href="https://www.instagram.com/viajemais_tour/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700 transition-colors"
                    >
                        Ver mais no Instagram
                        <Instagram size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
}
