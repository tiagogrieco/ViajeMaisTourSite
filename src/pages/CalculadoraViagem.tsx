import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Plane, Hotel, Utensils, Camera, Users, Calendar, MapPin, MessageCircle } from 'lucide-react';

interface DestinationData {
    name: string;
    flightBase: number;
    hotelEconomico: number;
    hotelConforto: number;
    hotelLuxo: number;
    dailyFood: number;
    dailyTours: number;
    image: string;
}

const destinations: Record<string, DestinationData> = {
    'porto-galinhas': {
        name: 'Porto de Galinhas, PE',
        flightBase: 800,
        hotelEconomico: 150,
        hotelConforto: 350,
        hotelLuxo: 700,
        dailyFood: 120,
        dailyTours: 150,
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600',
    },
    'gramado': {
        name: 'Gramado, RS',
        flightBase: 600,
        hotelEconomico: 200,
        hotelConforto: 400,
        hotelLuxo: 800,
        dailyFood: 150,
        dailyTours: 100,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    },
    'rio': {
        name: 'Rio de Janeiro, RJ',
        flightBase: 500,
        hotelEconomico: 180,
        hotelConforto: 380,
        hotelLuxo: 750,
        dailyFood: 130,
        dailyTours: 120,
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    },
    'cancun': {
        name: 'Cancún, México',
        flightBase: 3500,
        hotelEconomico: 400,
        hotelConforto: 800,
        hotelLuxo: 1500,
        dailyFood: 200,
        dailyTours: 300,
        image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600',
    },
    'buenos-aires': {
        name: 'Buenos Aires, Argentina',
        flightBase: 1800,
        hotelEconomico: 200,
        hotelConforto: 400,
        hotelLuxo: 700,
        dailyFood: 150,
        dailyTours: 100,
        image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=600',
    },
    'orlando': {
        name: 'Orlando, EUA',
        flightBase: 4500,
        hotelEconomico: 350,
        hotelConforto: 600,
        hotelLuxo: 1200,
        dailyFood: 250,
        dailyTours: 400,
        image: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=600',
    },
};

export default function CalculadoraViagem() {
    const [destination, setDestination] = useState('porto-galinhas');
    const [people, setPeople] = useState(2);
    const [days, setDays] = useState(5);
    const [hotelType, setHotelType] = useState<'economico' | 'conforto' | 'luxo'>('conforto');
    const [showResult, setShowResult] = useState(false);

    const dest = destinations[destination];

    const hotelPrice = hotelType === 'economico' ? dest.hotelEconomico :
        hotelType === 'conforto' ? dest.hotelConforto : dest.hotelLuxo;

    const flightTotal = dest.flightBase * people;
    const hotelTotal = hotelPrice * days * Math.ceil(people / 2);
    const foodTotal = dest.dailyFood * days * people;
    const toursTotal = dest.dailyTours * days * people;
    const total = flightTotal + hotelTotal + foodTotal + toursTotal;

    const whatsappMessage = encodeURIComponent(
        `Olá! Fiz uma simulação no site:\n\n` +
        `Destino: ${dest.name}\n` +
        `Pessoas: ${people}\n` +
        `Dias: ${days}\n` +
        `Hospedagem: ${hotelType}\n` +
        `Valor estimado: R$ ${total.toLocaleString()}\n\n` +
        `Gostaria de um orçamento personalizado!`
    );

    return (
        <div className="min-h-screen pt-32 pb-12" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)' }}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                        <Calculator className="text-amber-400" size={24} />
                        <span className="text-white font-medium">Calculadora de Viagem</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Quanto custa sua viagem dos sonhos?
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Simule agora e descubra o valor estimado da sua próxima aventura!
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            {/* Formulário */}
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <MapPin className="text-amber-500" size={24} />
                                    Configure sua Viagem
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                                        <select
                                            value={destination}
                                            onChange={(e) => { setDestination(e.target.value); setShowResult(false); }}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors"
                                        >
                                            {Object.entries(destinations).map(([key, d]) => (
                                                <option key={key} value={key}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Users size={16} className="inline mr-1" /> Pessoas
                                            </label>
                                            <select
                                                value={people}
                                                onChange={(e) => { setPeople(Number(e.target.value)); setShowResult(false); }}
                                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                                            >
                                                {[1, 2, 3, 4, 5, 6].map(n => (
                                                    <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar size={16} className="inline mr-1" /> Dias
                                            </label>
                                            <select
                                                value={days}
                                                onChange={(e) => { setDays(Number(e.target.value)); setShowResult(false); }}
                                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                                            >
                                                {[3, 4, 5, 6, 7, 10, 14].map(n => (
                                                    <option key={n} value={n}>{n} dias</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Hospedagem</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['economico', 'conforto', 'luxo'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => { setHotelType(type); setShowResult(false); }}
                                                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${hotelType === type
                                                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                                                        : 'border-gray-200 hover:border-amber-300'
                                                        }`}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => setShowResult(true)}
                                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Calculator size={20} />
                                        Calcular Agora!
                                    </motion.button>
                                </div>
                            </div>

                            {/* Resultado */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
                                {showResult ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="relative rounded-xl overflow-hidden mb-4">
                                            <img src={dest.image} alt={dest.name} className="w-full h-32 object-cover" />
                                        </div>

                                        <h3 className="font-bold text-gray-800 mb-4">{dest.name}</h3>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1"><Plane size={14} /> Passagens</span>
                                                <span className="font-medium">R$ {flightTotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1"><Hotel size={14} /> Hospedagem</span>
                                                <span className="font-medium">R$ {hotelTotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1"><Utensils size={14} /> Alimentação</span>
                                                <span className="font-medium">R$ {foodTotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1"><Camera size={14} /> Passeios</span>
                                                <span className="font-medium">R$ {toursTotal.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 mb-4">
                                            <div className="flex justify-between text-2xl font-bold text-primary">
                                                <span>Total Estimado</span>
                                                <span>R$ {total.toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">*Valores estimados, sujeitos a alteração</p>
                                        </div>

                                        <a
                                            href={`https://wa.me/5534998168772?text=${whatsappMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <MessageCircle size={20} />
                                            Solicitar Orçamento
                                        </a>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <Calculator size={64} className="mb-4 opacity-50" />
                                        <p className="text-center">
                                            Preencha os dados e clique em<br /><strong>Calcular</strong> para ver sua estimativa
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
