import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sun, Mountain, Building2, Backpack, User, Heart, Users, Wallet, Plane, MapPin, MessageCircle, RotateCcw } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: {
        value: string;
        label: string;
        icon: React.ReactNode;
    }[];
}

interface Destination {
    name: string;
    image: string;
    description: string;
    highlights: string[];
    budget: string;
}

const questions: Question[] = [
    {
        id: 'type',
        question: 'Que tipo de viagem você sonha?',
        options: [
            { value: 'praia', label: 'Praia e Sol', icon: <Sun size={32} /> },
            { value: 'montanha', label: 'Montanhas e Natureza', icon: <Mountain size={32} /> },
            { value: 'cidade', label: 'Cidades e Cultura', icon: <Building2 size={32} /> },
            { value: 'aventura', label: 'Aventura e Esportes', icon: <Backpack size={32} /> },
        ],
    },
    {
        id: 'company',
        question: 'Com quem você vai viajar?',
        options: [
            { value: 'solo', label: 'Sozinho(a)', icon: <User size={32} /> },
            { value: 'casal', label: 'Em Casal', icon: <Heart size={32} /> },
            { value: 'familia', label: 'Com Família', icon: <Users size={32} /> },
            { value: 'amigos', label: 'Com Amigos', icon: <Users size={32} /> },
        ],
    },
    {
        id: 'budget',
        question: 'Qual seu orçamento?',
        options: [
            { value: 'economico', label: 'Econômico', icon: <Wallet size={32} /> },
            { value: 'moderado', label: 'Moderado', icon: <Wallet size={32} /> },
            { value: 'luxo', label: 'Luxo', icon: <Wallet size={32} /> },
        ],
    },
    {
        id: 'destination',
        question: 'Nacional ou Internacional?',
        options: [
            { value: 'nacional', label: 'Brasil', icon: <MapPin size={32} /> },
            { value: 'internacional', label: 'Exterior', icon: <Plane size={32} /> },
        ],
    },
];

const destinations: Record<string, Destination> = {
    'praia-casal-luxo-internacional': {
        name: 'Maldivas',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        description: 'Paraíso tropical com bangalôs sobre as águas cristalinas. Perfeito para lua de mel e momentos românticos.',
        highlights: ['Bangalôs sobre a água', 'Mergulho com vida marinha', 'Spa de luxo', 'Jantares privativos na praia'],
        budget: 'A partir de R$ 25.000/pessoa',
    },
    'praia-casal-moderado-internacional': {
        name: 'Cancún, México',
        image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800',
        description: 'Praias caribenhas, resorts all-inclusive e ruínas maias. O melhor custo-benefício do Caribe.',
        highlights: ['Resorts all-inclusive', 'Ruínas de Chichén Itzá', 'Cenotes naturais', 'Vida noturna'],
        budget: 'A partir de R$ 8.000/pessoa',
    },
    'praia-familia-moderado-nacional': {
        name: 'Porto de Galinhas, PE',
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
        description: 'Piscinas naturais, águas mornas e infraestrutura perfeita para família. O Nordeste brasileiro no seu melhor.',
        highlights: ['Piscinas naturais', 'Passeio de jangada', 'Praias tranquilas', 'Gastronomia regional'],
        budget: 'A partir de R$ 3.500/pessoa',
    },
    'praia-amigos-economico-nacional': {
        name: 'Maragogi, AL',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'O Caribe brasileiro! Águas cristalinas e piscinas naturais a preços acessíveis.',
        highlights: ['Galés de Maragogi', 'Praias desertas', 'Passeios de buggy', 'Pousadas econômicas'],
        budget: 'A partir de R$ 2.000/pessoa',
    },
    'montanha-casal-luxo-nacional': {
        name: 'Gramado e Canela, RS',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        description: 'Romance na Serra Gaúcha. Chocolates, vinhos e clima europeu no sul do Brasil.',
        highlights: ['Romântico no inverno', 'Tour de vinícolas', 'Fondue e chocolate', 'Cascata do Caracol'],
        budget: 'A partir de R$ 4.000/pessoa',
    },
    'montanha-familia-moderado-nacional': {
        name: 'Campos do Jordão, SP',
        image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800',
        description: 'A Suíça brasileira! Clima ameno, arquitetura europeia e diversão para toda família.',
        highlights: ['Teleférico', 'Horto Florestal', 'Feiras de artesanato', 'Fondues e churrascos'],
        budget: 'A partir de R$ 2.500/pessoa',
    },
    'cidade-casal-luxo-internacional': {
        name: 'Paris, França',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'A cidade do amor! Torre Eiffel, Louvre, gastronomia e romance em cada esquina.',
        highlights: ['Torre Eiffel', 'Museu do Louvre', 'Cruzeiro no Sena', 'Gastronomia francesa'],
        budget: 'A partir de R$ 15.000/pessoa',
    },
    'cidade-amigos-moderado-internacional': {
        name: 'Buenos Aires, Argentina',
        image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800',
        description: 'Tango, carnes, vinhos e uma vida noturna incrível. A Europa da América do Sul.',
        highlights: ['Shows de tango', 'Parrillas e vinhos', 'Caminito e La Boca', 'San Telmo'],
        budget: 'A partir de R$ 4.000/pessoa',
    },
    'aventura-solo-moderado-internacional': {
        name: 'Costa Rica',
        image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800',
        description: 'Pura vida! Florestas tropicais, vulcões, praias e muita adrenalina.',
        highlights: ['Tirolesa nas copas', 'Vulcão Arenal', 'Rafting', 'Praias para surf'],
        budget: 'A partir de R$ 7.000/pessoa',
    },
    'aventura-amigos-economico-nacional': {
        name: 'Chapada Diamantina, BA',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
        description: 'Trilhas, cachoeiras e grutas. O paraíso dos aventureiros no coração da Bahia.',
        highlights: ['Morro do Pai Inácio', 'Cachoeira da Fumaça', 'Poço Encantado', 'Trilhas incríveis'],
        budget: 'A partir de R$ 1.800/pessoa',
    },
};

function getDestination(answers: Record<string, string>): Destination {
    const key = `${answers.type}-${answers.company}-${answers.budget}-${answers.destination}`;

    // Tenta encontrar match exato
    if (destinations[key]) return destinations[key];

    // Fallback baseado em preferências principais
    const fallbacks: Record<string, string> = {
        'praia-nacional': 'praia-familia-moderado-nacional',
        'praia-internacional': 'praia-casal-moderado-internacional',
        'montanha-nacional': 'montanha-familia-moderado-nacional',
        'cidade-internacional': 'cidade-amigos-moderado-internacional',
        'aventura-nacional': 'aventura-amigos-economico-nacional',
        'aventura-internacional': 'aventura-solo-moderado-internacional',
    };

    const fallbackKey = `${answers.type}-${answers.destination}`;
    if (fallbacks[fallbackKey]) return destinations[fallbacks[fallbackKey]];

    // Default
    return destinations['praia-familia-moderado-nacional'];
}

export default function DestinoQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            setTimeout(() => setShowResult(true), 300);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
    };

    const destination = showResult ? getDestination(answers) : null;

    const whatsappMessage = destination
        ? encodeURIComponent(`Olá! Fiz o quiz no site e meu destino ideal é ${destination.name}. Gostaria de saber mais sobre pacotes para lá!`)
        : '';

    return (
        <div className="min-h-screen pt-32 pb-12" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)' }}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                        <Compass className="text-amber-400" size={24} />
                        <span className="text-white font-medium">Descubra seu Destino</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Qual é a viagem dos seus sonhos?
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Responda algumas perguntas e descubra o destino perfeito para você!
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                            >
                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                                        <span>Pergunta {currentStep + 1} de {questions.length}</span>
                                        <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                                    {questions[currentStep].question}
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    {questions[currentStep].options.map((option) => (
                                        <motion.button
                                            key={option.value}
                                            onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                                            className={`p-6 rounded-2xl border-2 transition-all ${answers[questions[currentStep].id] === option.value
                                                ? 'border-amber-400 bg-amber-50'
                                                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex flex-col items-center gap-3 text-gray-700">
                                                <div className="text-amber-500">{option.icon}</div>
                                                <span className="font-medium text-center">{option.label}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : destination && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                            >
                                <div className="relative h-64 md:h-80">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <p className="text-amber-400 font-medium mb-2">Seu destino ideal é...</p>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold">{destination.name}</h2>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <p className="text-gray-600 text-lg mb-6">{destination.description}</p>

                                    <div className="mb-6">
                                        <h3 className="font-bold text-gray-800 mb-3">Destaques:</h3>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {destination.highlights.map((highlight) => (
                                                <li key={highlight} className="flex items-center gap-2 text-gray-600">
                                                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-amber-50 rounded-xl p-4 mb-6">
                                        <p className="text-amber-800 font-bold text-lg">{destination.budget}</p>
                                        <p className="text-amber-700 text-sm">*Valores estimados, consulte para orçamento personalizado</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={`https://wa.me/5534998168772?text=${whatsappMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <MessageCircle size={20} />
                                            Quero um Orçamento!
                                        </a>
                                        <button
                                            onClick={resetQuiz}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RotateCcw size={20} />
                                            Refazer Quiz
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
