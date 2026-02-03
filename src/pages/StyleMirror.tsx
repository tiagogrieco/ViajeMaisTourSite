import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Sparkles, AlertCircle, UploadCloud, X, Download } from 'lucide-react';
import { generateStyleImage } from '../services/api';

export default function StyleMirror() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Photo Upload State
    const [userImage, setUserImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        try {
            // Send prompt AND userImage (if exists)
            const data = await generateStyleImage(prompt, userImage || undefined);
            if (data.image) {
                setImage(data.image);
            } else {
                setError("Imagem não retornada. Tente novamente.");
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao gerar imagem. Verifique a conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 via-emerald-900/10 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-gold-300 mb-6"
                    >
                        <Sparkles size={14} /> Viaje Mais AI 2.0
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        Visualizador de Destinos
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Descreva sua viagem dos sonhos e deixe nossa IA materializar esse momento para você.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Controls Section */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-sm shadow-2xl">

                        {/* 1. Photo Upload */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gold-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <UploadCloud size={16} /> 1. Sua Foto (Opcional)
                            </label>

                            {!userImage ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/20 rounded-xl p-8 hover:bg-white/5 hover:border-gold-500/50 transition-all cursor-pointer text-center group"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="text-white/50 group-hover:text-gold-400" size={24} />
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium group-hover:text-white">Clique para carregar uma foto de referência</p>
                                    <p className="text-xs text-gray-600 mt-2">Recomendado: Paisagens, hotéis ou lugares que te inspiram</p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-white/20 group">
                                    <img src={userImage} alt="User Upload" className="w-full h-64 object-cover" />
                                    <button
                                        onClick={() => setUserImage(null)}
                                        className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 rounded-full text-xs text-gold-300 font-medium backdrop-blur-sm">
                                        Foto Carregada
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gold-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Wand2 size={16} /> 2. O Destino dos Sonhos
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ex: Uma praia paradisíaca nas Maldivas, com bangalôs sobre a água, pôr do sol dourado e mar cristalino..."
                                className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all resize-none text-sm leading-relaxed"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    {userImage ? "Analisando Rosto..." : "Criando Visual..."}
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    {image ? 'Gerar Outra Opção' : 'Visualizar Viagem'}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="relative aspect-square lg:h-auto rounded-3xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center group h-full min-h-[500px]">
                        {image ? (
                            <>
                                <img src={image} alt="Generated Hair Style" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="text-white/80 text-sm font-medium">
                                        ✨ Sugestão Viaje Mais
                                    </div>
                                    <a
                                        href={image}
                                        download="minha-viagem-dos-sonhos.png"
                                        className="p-4 bg-white text-black rounded-full hover:bg-gold-400 hover:scale-110 transiiton-all shadow-xl"
                                        title="Baixar Imagem"
                                    >
                                        <Download size={24} />
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8 max-w-sm">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-white/10 rounded-full animate-spin border-t-gold-500" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles size={24} className="text-gold-500 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-white font-medium text-lg">Processando...</p>
                                            <p className="text-gray-500 text-sm">
                                                {userImage
                                                    ? "A IA está analisando sua referência..."
                                                    : "A magia da viagem está acontecendo..."}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 text-white/30">
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                            <Wand2 size={40} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-medium text-white/50">Área de Visualização</p>
                                            <p className="text-sm">O resultado aparecerá aqui em alta definição.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-x-4 top-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-red-200">
                                    <p className="font-bold mb-1">Ops! Algo deu errado.</p>
                                    <p>{error}</p>
                                </div>
                                <button onClick={() => setError(null)} className="ml-auto text-white/50 hover:text-white">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
