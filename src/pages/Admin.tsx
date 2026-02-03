import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle, AlertCircle, FileText, Lock, KeyRound, Instagram, Send, RefreshCw, UploadCloud, Trash2, Users, MessageCircle, Copy, Database, Wand2, Calendar, BarChart3, Eye, Edit2, X } from 'lucide-react';
import { generatePost, publishPost, deletePost, generateInstaPost, regenerateInstaImage, generateStyleImage, getVisitors, generateZapAds, updateBlogImages, uploadImage, API_URL } from '../services/api';
import { BLOG_POSTS } from '../data/blogData';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');

    // Stats
    const [visitors, setVisitors] = useState({ total: 0, today: 0 });

    // ...



    // Blog State
    const [loading, setLoading] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [blogData, setBlogData] = useState<any>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [postList, setPostList] = useState(BLOG_POSTS);
    const [blogTopic, setBlogTopic] = useState("");

    // Insta State
    const [instaLoading, setInstaLoading] = useState(false);
    const [instaData, setInstaData] = useState<{ image: string, caption: string, topic: string } | null>(null);
    const [instaError, setInstaError] = useState<string | null>(null);

    // Zap State
    const [zapTopic, setZapTopic] = useState("");
    const [zapLoading, setZapLoading] = useState(false);
    const [zapAds, setZapAds] = useState<string[]>([]);

    // Blog Content Manager State
    const [blogStats, setBlogStats] = useState({ scraped: 0, rewritten: 0, scheduled: 0 });
    const [scrapingActive, setScrapingActive] = useState(false);
    const [scrapingProgress, setScrapingProgress] = useState({ current: 0, total: 0 });
    const [rewritingActive, setRewritingActive] = useState(false);
    const [rewritingProgress, setRewritingProgress] = useState({ current: 0, total: 0 });
    const [scrapedPosts, setScrapedPosts] = useState<any[]>([]);
    const [rewrittenPosts, setRewrittenPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [editingPost, setEditingPost] = useState<any | null>(null);

    // Image Manager State
    const [imgManagerSelectedPostId, setImgManagerSelectedPostId] = useState<string | number>("");
    const [imgManagerCover, setImgManagerCover] = useState("");
    const [imgManagerContentImages, setImgManagerContentImages] = useState<{ original: string, current: string }[]>([]);
    const [imgManagerLoading, setImgManagerLoading] = useState(false);

    const imageManagerRef = useRef<HTMLDivElement>(null);

    const handleDirectEdit = (postId: string | number) => {
        handleSelectPostForImageEdit(String(postId));
        setTimeout(() => {
            imageManagerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    useEffect(() => {
        if (isAuthenticated) {
            getVisitors().then(setVisitors);
        }
    }, [isAuthenticated]);

    // Blog Handlers
    const handleGeneratePost = async () => {
        setLoading(true);
        setSuccess(null);
        setError(null);
        setBlogData(null);
        try {
            const data = await generatePost(blogTopic);
            if (data.id) {
                setBlogData(data);
            } else {
                setError("Dados inválidos recebidos.");
            }
        } catch (err: any) {
            console.error(err);
            setError("Erro ao gerar post. Verifique se o backend está rodando.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateBlogImage = async () => {
        if (!blogData) return;
        setIsRegenerating(true);
        try {
            const prompt = `editorial travel photography of ${blogData.title}, ${blogData.category}, tourism context, cinematic landscape, realistic, 8k, national geographic style`;
            const data = await generateStyleImage(prompt);

            if (data.image) {
                setBlogData({ ...blogData, image: data.image });
            }
        } catch (err) {
            console.error(err);
            if (blogData.image.includes('pollinations.ai')) {
                const newSeed = Math.floor(Math.random() * 999999);
                const newUrl = blogData.image.replace(/seed=\d+/, `seed=${newSeed}`);
                setBlogData({ ...blogData, image: newUrl });
            } else {
                alert("Não foi possível gerar uma nova imagem agora.");
            }
        } finally {
            setIsRegenerating(false);
        }
    };

    const handlePublishBlog = async () => {
        if (!blogData) return;
        setLoading(true);
        try {
            await publishPost(blogData);
            setSuccess("Post publicado com sucesso!");
            setBlogData(null);
        } catch (err: any) {
            console.error(err);
            setError("Erro ao publicar post.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;

        try {
            await deletePost(id);
            setPostList(prev => prev.filter(p => p.id !== id));
            setSuccess("Post excluído com sucesso!");
        } catch (err) {
            console.error(err);
            setError("Erro ao excluir post.");
        }
    };

    // Insta Handlers
    const handleGenerateInsta = async () => {
        setInstaLoading(true);
        setInstaError(null);
        setInstaData(null);
        try {
            const data = await generateInstaPost();
            setInstaData(data);
        } catch (err: any) {
            console.error(err);
            setInstaError("Erro ao gerar preview. Tente novamente.");
        } finally {
            setInstaLoading(false);
        }
    };

    const handleRegenerateImage = async () => {
        if (!instaData) return;
        setInstaLoading(true);
        try {
            const newData = await regenerateInstaImage(instaData.topic);
            if (newData.image) {
                setInstaData(prev => prev ? { ...prev, image: newData.image } : null);
            }
        } catch (err: any) {
            console.error(err);
            setInstaError("Erro ao regenerar imagem.");
        } finally {
            setInstaLoading(false);
        }
    };

    const handlePublishInsta = () => {
        alert("Simulação: Post enviado para agendamento! (Integração real necessária)");
        setInstaData(null);
    }

    // Zap Handlers
    const handleGenerateZap = async () => {
        if (!zapTopic) return;
        setZapLoading(true);
        setZapAds([]);
        try {
            const ads = await generateZapAds(zapTopic);
            setZapAds(ads);
        } catch (err) {
            console.error(err);
            alert("Erro ao gerar anúncios.");
        } finally {
            setZapLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado!");
    }

    // Blog Content Manager Handlers
    const loadBlogStats = async () => {
        try {
            const res = await fetch(`${API_URL}/stats`);
            const data = await res.json();
            setBlogStats(data);
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const handleStartScraping = async () => {
        setScrapingActive(true);
        try {
            await fetch(`${API_URL}/scraper/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sites: ['melhores', 'passagens'], count: 10 })
            });

            // Poll for progress
            const interval = setInterval(async () => {
                const res = await fetch(`${API_URL}/scraper/status`);
                const data = await res.json();

                if (data.status === 'completed' || data.status === 'error') {
                    clearInterval(interval);
                    setScrapingActive(false);
                    loadBlogStats();
                    loadScrapedPosts();
                }

                setScrapingProgress({ current: data.current || 0, total: data.total || 0 });
            }, 2000);
        } catch (err) {
            console.error(err);
            alert(`Erro ao iniciar scraping: ${err}`);
            setScrapingActive(false);
        }
    };

    const loadScrapedPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/scraper/posts`);
            const data = await res.json();
            setScrapedPosts(data.posts || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartRewriting = async () => {
        if (scrapedPosts.length === 0) {
            alert('Primeiro faça o scraping de posts!');
            return;
        }

        setRewritingActive(true);
        try {
            const indices = scrapedPosts.map((_, idx) => idx);
            await fetch(`${API_URL}/rewriter/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_indices: indices, style: 'informativo_engajador' })
            });

            // Poll for progress
            const interval = setInterval(async () => {
                const res = await fetch(`${API_URL}/rewriter/status`);
                const data = await res.json();

                if (data.status === 'completed' || data.status === 'error') {
                    clearInterval(interval);
                    setRewritingActive(false);
                    loadBlogStats();
                    loadRewrittenPosts();
                }

                setRewritingProgress({ current: data.current || 0, total: data.total || 0 });
            }, 3000);
        } catch (err) {
            console.error(err);
            setRewritingActive(false);
        }
    };

    const loadRewrittenPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/rewriter/posts`);
            const data = await res.json();
            setRewrittenPosts(data.posts || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCalendar = async () => {
        try {
            const res = await fetch(`${API_URL}/calendar/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posts_per_week: 3 })
            });
            const data = await res.json();
            if (data.success) {
                alert('Calendário criado com sucesso! Confira o arquivo generated_blog_posts.ts');
                loadBlogStats();
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao criar calendário');
        }
    };

    const handleEditPost = (post: any, index: number) => {
        setEditingPost({ ...post, index });
    };

    const handleSavePost = async () => {
        if (!editingPost) return;

        try {
            const res = await fetch(`${API_URL}/rewriter/post/${editingPost.index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPost)
            });
            const data = await res.json();

            if (data.success) {
                loadRewrittenPosts();
                setEditingPost(null);
                alert('Post atualizado com sucesso!');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar post');
        }
    };

    const [publishingPostIndex, setPublishingPostIndex] = useState<number | null>(null);

    const handlePublishSinglePost = async (postIndex: number) => {
        if (!confirm('Deseja publicar este post? A IA irá gerar imagens profissionais antes de publicar. Isso pode levar 30-60 segundos.')) return;

        setPublishingPostIndex(postIndex);

        try {
            const res = await fetch(`${API_URL}/rewriter/post/${postIndex}/publish`, {
                method: 'POST'
            });
            const data = await res.json();

            if (data.success) {
                alert(`✅ Post publicado com sucesso!\n\n🖼️ ${data.content_images_count || 0} imagens geradas pela IA\n📷 Capa: ${data.cover_image || 'placeholder'}`);
                // Reload the library list to remove the published post
                loadRewrittenPosts();
            } else {
                alert(`Erro: ${data.error || 'Falha ao publicar'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao publicar post');
        } finally {
            setPublishingPostIndex(null);
        }
    };

    // Image Manager Handlers
    const handleSelectPostForImageEdit = (postId: string) => {
        setImgManagerSelectedPostId(postId);
        const post = postList.find(p => String(p.id) === String(postId)); // Use postList which is up to date

        if (post) {
            setImgManagerCover(post.image || "");

            // Extract content images
            const images: { original: string, current: string }[] = [];
            const regex = /<img\s+[^>]*src="([^"]+)"/g;
            let match;
            while ((match = regex.exec(post.content || "")) !== null) {
                const src = match[1];
                if (src) {
                    images.push({ original: src, current: src });
                }
            }
            setImgManagerContentImages(images);
        } else {
            setImgManagerCover("");
            setImgManagerContentImages([]);
        }
    };

    // Helper to convert data URI to File
    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleSaveImageUpdates = async () => {
        if (!imgManagerSelectedPostId) return;
        setImgManagerLoading(true);

        try {
            // 1. Upload Cover if changed (base64 check)
            let finalCover = imgManagerCover;
            if (imgManagerCover && imgManagerCover.startsWith('data:')) {
                const file = dataURLtoFile(imgManagerCover, 'cover.jpg');
                const uploadRes = await uploadImage(file);
                finalCover = uploadRes.url;
            }

            // 2. Upload Content Images if changed
            const contentUpdates: Record<string, string> = {};

            for (const img of imgManagerContentImages) {
                if (img.current !== img.original) {
                    let newUrl = img.current;
                    if (img.current.startsWith('data:')) {
                        const file = dataURLtoFile(img.current, 'content.jpg');
                        const uploadRes = await uploadImage(file);
                        newUrl = uploadRes.url;
                    }
                    contentUpdates[img.original] = newUrl;
                }
            }

            const payload = {
                postId: imgManagerSelectedPostId,
                coverImage: finalCover,
                contentImages: Object.keys(contentUpdates).length > 0 ? contentUpdates : undefined
            };

            await updateBlogImages(payload);

            // Optimistic update of local state
            const updatedPosts = postList.map(p => {
                if (String(p.id) === String(imgManagerSelectedPostId)) {
                    let newContent = p.content || "";

                    // Apply content replacements locally
                    Object.entries(contentUpdates).forEach(([oldSrc, newSrc]) => {
                        newContent = newContent.replace(oldSrc, newSrc);
                    });

                    return {
                        ...p,
                        image: finalCover || p.image,
                        content: newContent
                    };
                }
                return p;
            });

            setPostList(updatedPosts);

            // Image manager state is already updated via setImgManagerCover and the list refresh

            // Also update the global list reference
            const globalIndex = BLOG_POSTS.findIndex(p => String(p.id) === String(imgManagerSelectedPostId));
            if (globalIndex !== -1) {
                BLOG_POSTS[globalIndex] = updatedPosts.find(p => String(p.id) === String(imgManagerSelectedPostId))!;
            }

            alert("Imagens atualizadas com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar imagens: " + err);
        } finally {
            setImgManagerLoading(false);
        }
    };

    // Load stats on auth
    useEffect(() => {
        if (isAuthenticated) {
            loadBlogStats();
            loadScrapedPosts();
            loadRewrittenPosts();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '1234') {
            setIsAuthenticated(true);
        } else {
            alert('PIN Incorreto');
            setPin('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
                >
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-500 mb-6">Digite o PIN de segurança para acessar o painel administrativo.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="PIN de 4 dígitos"
                                maxLength={4}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-center font-bold tracking-widest text-lg"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 transition-colors"
                        >
                            Destrancar Painel
                        </button>
                    </form>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-4">Painel Administrativo</h1>
                    <p className="text-gray-600">Ferramentas de automação e gestão do GlowFast.</p>
                </div>

                {/* Visitor Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Visitas Hoje</p>
                            <p className="text-3xl font-bold text-gray-900">{visitors.today}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                        <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total de Acessos</p>
                            <p className="text-3xl font-bold text-gray-900">{visitors.total}</p>
                        </div>
                    </div>
                </div>

                {/* MARKETING ZAP SECTION (NEW) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-emerald-950">Marketing Zap</h2>
                            <p className="text-sm text-gray-500">Crie copies virais para seus grupos</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Ex: Promoção de Escova, Unhas de Gel, Dia da Noiva..."
                            value={zapTopic}
                            onChange={(e) => setZapTopic(e.target.value)}
                            className="flex-grow p-3 border border-gray-200 rounded-xl focus:border-green-500 outline-none"
                        />
                        <button
                            onClick={handleGenerateZap}
                            disabled={zapLoading || !zapTopic}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {zapLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                            Gerar
                        </button>
                    </div>

                    {zapAds.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {zapAds.map((ad, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col">
                                    <div className="mb-2 text-xs font-bold text-gray-400 uppercase">Opção {idx + 1}</div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 flex-grow">{ad}</p>
                                    <button
                                        onClick={() => copyToClipboard(ad)}
                                        className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                    >
                                        <Copy size={14} /> Copiar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Auto Blog Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950">Auto Blog AI</h2>
                                <p className="text-sm text-gray-500">Crie conteúdo SEO automaticamente</p>
                            </div>
                        </div>

                        {!blogData ? (
                            <>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    A IA (SEO Expert) irá criar um artigo completo, otimizado para o Google, e gerar uma imagem realista.
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Sobre o que você quer escrever hoje? (Ex: Roteiro Paris)"
                                        value={blogTopic}
                                        onChange={(e) => setBlogTopic(e.target.value)}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <button
                                    onClick={handleGeneratePost}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all
                                        ${loading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
                                        }
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Gerando Conteúdo... (Aprox. 30s)
                                        </>
                                    ) : (
                                        <>
                                            <FileText /> Gerar Novo Rascunho
                                        </>
                                    )}
                                </button>

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 text-sm font-medium border border-green-100"
                                    >
                                        <CheckCircle size={18} />
                                        {success}
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100"
                                    >
                                        <AlertCircle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Preview do Rascunho</h3>

                                <div className="rounded-xl overflow-hidden border border-gray-200 relative group">
                                    {/* Upload & Regenerate Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                        <label
                                            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                                            title="Fazer upload de imagem personalizada"
                                        >
                                            <UploadCloud size={18} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            if (ev.target?.result) {
                                                                setBlogData({ ...blogData, image: ev.target.result as string });
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button
                                            onClick={handleRegenerateBlogImage}
                                            disabled={isRegenerating}
                                            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                            title="Regenerar Foto (AI)"
                                        >
                                            <RefreshCw size={18} className={isRegenerating ? "animate-spin text-purple-600" : ""} />
                                        </button>
                                    </div>
                                    <img src={blogData.image} alt="Preview" className="w-full h-48 object-cover" />
                                </div>

                                <div>
                                    <p className="font-serif font-bold text-lg text-emerald-950 mb-1">{blogData.title}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">{blogData.excerpt}</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setBlogData(null)}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={handlePublishBlog}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <UploadCloud size={18} />} Publicar no Blog
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Instagram Auto-Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                                <Instagram size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950">Instagram Auto-Feed</h2>
                                <p className="text-sm text-gray-500">Preview & Postagem</p>
                            </div>
                        </div>

                        {!instaData ? (
                            <>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Gere posts com legendas engajadoras e imagens criadas por IA para o seu feed do Instagram.
                                </p>
                                <button
                                    onClick={handleGenerateInsta}
                                    disabled={instaLoading}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all
                                        ${instaLoading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/20 active:scale-95'
                                        }`}
                                >
                                    {instaLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                                    {instaLoading ? "Criando Preview..." : "Gerar Rascunho"}
                                </button>
                                {instaError && (
                                    <p className="mt-4 text-sm text-red-500 flex items-center gap-2"><AlertCircle size={16} /> {instaError}</p>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden border border-gray-200 relative group">
                                    <img src={instaData.image} alt="Preview" className="w-full h-64 object-cover" />

                                    {/* Overlay Action */}
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={handleRegenerateImage}
                                            disabled={instaLoading}
                                            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                                            title="Regenerar Foto (Manter Legenda)"
                                        >
                                            <RefreshCw size={18} className={instaLoading ? "animate-spin text-purple-600" : ""} />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-gray-50">
                                        <p className="text-xs font-bold text-gray-400 mb-2">LEGENDA GERADA</p>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{instaData.caption}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setInstaData(null)}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={handlePublishInsta}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        <Send size={18} /> Publicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* BLOG CONTENT MANAGER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-emerald-950">Blog Content Manager</h2>
                            <p className="text-sm text-gray-500">Sistema completo de automação de conteúdo</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">Posts Extraídos</p>
                                    <p className="text-2xl font-bold text-blue-900">{blogStats.scraped}</p>
                                </div>
                                <Database className="text-blue-400" size={28} />
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-purple-600 uppercase mb-1">Reescritos (IA)</p>
                                    <p className="text-2xl font-bold text-purple-900">{blogStats.rewritten}</p>
                                </div>
                                <Wand2 className="text-purple-400" size={28} />
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-green-600 uppercase mb-1">Agendados</p>
                                    <p className="text-2xl font-bold text-green-900">{blogStats.scheduled}</p>
                                </div>
                                <Calendar className="text-green-400" size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        {/* Step 1: Scraping */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">1. Extrair Posts</h3>
                                    <p className="text-sm text-gray-500">Coleta posts dos concorrentes</p>
                                </div>
                                <button
                                    onClick={handleStartScraping}
                                    disabled={scrapingActive}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {scrapingActive ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
                                    {scrapingActive ? 'Extraindo...' : 'Iniciar'}
                                </button>
                            </div>
                            {scrapingActive && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Progresso</span>
                                        <span className="font-bold text-blue-600">{scrapingProgress.current} / {scrapingProgress.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${(scrapingProgress.current / scrapingProgress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Rewriting */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">2. Reescrever com IA</h3>
                                    <p className="text-sm text-gray-500">Gemini cria conteúdo único e otimizado</p>
                                </div>
                                <button
                                    onClick={handleStartRewriting}
                                    disabled={rewritingActive || scrapedPosts.length === 0}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {rewritingActive ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                    {rewritingActive ? 'Reescrevendo...' : 'Reescrever'}
                                </button>
                            </div>
                            {rewritingActive && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Progresso</span>
                                        <span className="font-bold text-purple-600">{rewritingProgress.current} / {rewritingProgress.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{ width: `${(rewritingProgress.current / rewritingProgress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Calendar */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">3. Criar Calendário</h3>
                                    <p className="text-sm text-gray-500">Agenda publicações automaticamente (3x/semana)</p>
                                </div>
                                <button
                                    onClick={handleCreateCalendar}
                                    disabled={rewrittenPosts.length === 0}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Calendar size={16} />
                                    Gerar
                                </button>
                            </div>
                        </div>

                        {/* Info/Instructions */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                                <div className="text-sm text-amber-800">
                                    <p className="font-bold mb-1">🚀 Como funciona:</p>
                                    <ol className="list-decimal ml-4 space-y-1">
                                        <li>Extrai posts dos blogs Melhores Destinos e Passagens Imperdíveis</li>
                                        <li>IA Gemini reescreve tudo criando conteúdo 100% único</li>
                                        <li>Gera calendário editorial e arquivo pronto para importar</li>
                                    </ol>
                                    <p className="mt-2 text-xs">
                                        <strong>Importante:</strong> Certifique-se que o backend está rodando em <code className="bg-amber-100 px-1 rounded">localhost:5001</code>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Stats */}
                        {rewrittenPosts.length > 0 && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <BarChart3 className="text-indigo-600" size={20} />
                                    <h4 className="font-bold text-gray-900">Posts Prontos</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Total de posts:</p>
                                        <p className="text-xl font-bold text-indigo-900">{rewrittenPosts.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Arquivo gerado:</p>
                                        <p className="text-xs font-mono bg-white px-2 py-1 rounded border mt-1">generated_blog_posts.ts</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>



                {/* IMAGE MANAGER SECTION (NEW) */}
                <motion.div
                    ref={imageManagerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Edit2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-emerald-950">Gestor de Imagens</h2>
                            <p className="text-sm text-gray-500">Ajuste manual de capas e imagens do conteúdo</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Post Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selecione o Post</label>
                            <select
                                value={imgManagerSelectedPostId}
                                onChange={(e) => handleSelectPostForImageEdit(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                            >
                                <option value="">-- Selecione um post --</option>
                                {BLOG_POSTS.map(post => (
                                    <option key={post.id} value={post.id}>
                                        {post.id} - {post.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {imgManagerSelectedPostId && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                {/* Cover Image Editor */}
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Instagram size={18} /> Capa do Post
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/3">
                                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 border border-gray-300 relative group">
                                                {imgManagerCover ? (
                                                    <img src={imgManagerCover} alt="Cover Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">Sem Imagem</div>
                                                )}

                                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold gap-2">
                                                    <UploadCloud size={24} /> Upload
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (ev) => {
                                                                    if (ev.target?.result) setImgManagerCover(ev.target.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL da Imagem</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={imgManagerCover}
                                                    onChange={(e) => setImgManagerCover(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none mb-2"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">Cole o link ou faça upload na imagem ao lado.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Images Editor */}
                                {imgManagerContentImages.length > 0 && (
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText size={18} /> Imagens do Conteúdo ({imgManagerContentImages.length})
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            {imgManagerContentImages.map((img, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 pb-4 last:border-0">
                                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative group">
                                                        <img src={img.current} alt={`Content ${idx}`} className="w-full h-full object-cover" />
                                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                                                            <UploadCloud size={16} />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (ev) => {
                                                                            if (ev.target?.result) {
                                                                                const newImages = [...imgManagerContentImages];
                                                                                newImages[idx].current = ev.target.result as string;
                                                                                setImgManagerContentImages(newImages);
                                                                            }
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="flex-grow w-full">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagem #{idx + 1}</label>
                                                        <input
                                                            type="text"
                                                            value={img.current}
                                                            onChange={(e) => {
                                                                const newImages = [...imgManagerContentImages];
                                                                newImages[idx].current = e.target.value;
                                                                setImgManagerContentImages(newImages);
                                                            }}
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Save Actions */}
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSaveImageUpdates}
                                        disabled={imgManagerLoading}
                                        className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20"
                                    >
                                        {imgManagerLoading ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                                        salvar Alterações
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* POSTS LIBRARY SECTION (NEW) */}
                {
                    rewrittenPosts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-emerald-950">Biblioteca de Posts</h2>
                                        <p className="text-sm text-gray-500">{rewrittenPosts.length} posts prontos para publicar</p>
                                    </div>
                                </div>
                            </div>

                            {/* Posts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rewrittenPosts.map((post, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        {post.images && post.images[0] && (
                                            <div className="h-40 bg-gray-100 relative group">
                                                <img
                                                    src={post.images[0]}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedPost(post)}
                                                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                                                        title="Preview"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditPost(post, idx)}
                                                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.meta_description}</p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedPost(post)}
                                                    className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
                                                >
                                                    <Eye size={14} /> Ver
                                                </button>
                                                <button
                                                    onClick={() => handleEditPost(post, idx)}
                                                    className="flex-1 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 flex items-center justify-center gap-1"
                                                >
                                                    <Edit2 size={14} /> Editar
                                                </button>
                                                <button
                                                    onClick={() => handlePublishSinglePost(idx)}
                                                    disabled={publishingPostIndex !== null}
                                                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 ${publishingPostIndex === idx
                                                        ? 'bg-amber-500 text-white cursor-wait'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                        } disabled:opacity-50`}
                                                >
                                                    {publishingPostIndex === idx ? (
                                                        <><Loader2 size={14} className="animate-spin" /> Gerando...</>
                                                    ) : (
                                                        <><UploadCloud size={14} /> Publicar</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )
                }

                {/* Preview Modal */}
                {
                    selectedPost && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Preview do Post</h3>
                                    <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {selectedPost.images && selectedPost.images[0] && (
                                        <img src={selectedPost.images[0]} alt="" className="w-full h-64 object-cover rounded-xl mb-6" />
                                    )}

                                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                                    <p className="text-gray-600 mb-6 italic">{selectedPost.meta_description}</p>

                                    <div className="prose max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700">{selectedPost.content}</div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                                        <button
                                            onClick={() => {
                                                handleEditPost(selectedPost, rewrittenPosts.indexOf(selectedPost));
                                                setSelectedPost(null);
                                            }}
                                            className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={18} /> Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                handlePublishSinglePost(rewrittenPosts.indexOf(selectedPost));
                                                setSelectedPost(null);
                                            }}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                                        >
                                            <UploadCloud size={18} /> Publicar Agora
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }

                {/* Edit Modal */}
                {
                    editingPost && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingPost(null)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Editar Post</h3>
                                    <button onClick={() => setEditingPost(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagem Destaque</label>
                                        {editingPost.images && editingPost.images[0] && (
                                            <div className="relative mb-2">
                                                <img src={editingPost.images[0]} alt="" className="w-full h-48 object-cover rounded-xl" />
                                                <label className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg cursor-pointer hover:bg-white">
                                                    <RefreshCw size={18} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (ev) => {
                                                                    if (ev.target?.result) {
                                                                        setEditingPost({
                                                                            ...editingPost,
                                                                            images: [ev.target.result as string, ...editingPost.images.slice(1)]
                                                                        });
                                                                    }
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="URL da imagem"
                                            value={editingPost.images?.[0] || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, images: [e.target.value] })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                                        />
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                                        <input
                                            type="text"
                                            value={editingPost.title || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                                        />
                                    </div>

                                    {/* Meta Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                                        <textarea
                                            value={editingPost.meta_description || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                                            rows={2}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Conteúdo</label>
                                        <textarea
                                            value={editingPost.content || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                            rows={12}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none font-mono text-sm"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setEditingPost(null)}
                                            className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSavePost}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                                        >
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }

                {/* Manage Posts Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                        <FileText className="text-emerald-600" />
                        Gerenciar Posts Existentes
                    </h2>

                    <div className="space-y-4">
                        {postList.map(post => (
                            <div key={post.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{post.title}</h3>
                                        <p className="text-sm text-gray-500">{post.date} • {post.category}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDirectEdit(post.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 border border-blue-200"
                                        title="Editar Imagens"
                                    >
                                        <Edit2 size={16} /> <span className="text-sm font-bold">Imagens</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                        title="Excluir Post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {postList.length === 0 && (
                            <p className="text-center text-gray-500 py-8">Nenhum post encontrado.</p>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}
