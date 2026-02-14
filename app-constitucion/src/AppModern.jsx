import React, { useState, useMemo, useEffect } from 'react';
import { Home, FileText, Heart, Menu, X, Star, Search as SearchIcon, BookText, Filter, Sun, Moon, MessageCircle, Coffee, ShieldCheck, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from './components/ui/Card';
import { SearchBar } from './components/ui/SearchBar';
import { Button } from './components/ui/Button';
import { CONSTITUTION_DATA, CATEGORIES, LIFE_SITUATIONS, GLOSSARY } from './data';
import ChatWidget from './ChatWidget';
import FullTextViewer from './FullTextViewer';
import constitutionText from './assets/constitution.md?raw';

// Componente para resaltar términos del glosario con Tooltip Premium (touch + hover)
const GlossaryTerm = ({ term, definition, darkMode }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    const timeoutRef = React.useRef(null);

    const handleClick = (e) => {
        e.stopPropagation();
        setShowTooltip(prev => !prev);
        // Auto-cerrar después de 4s
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowTooltip(false), 4000);
    };

    React.useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    return (
        <span
            className="group relative inline-block cursor-help text-legal-gold font-bold border-b-2 border-dotted border-legal-gold/40 hover:border-legal-gold transition-colors"
            onClick={handleClick}
        >
            {term}
            {/* Tooltip Pro — funciona con hover Y con touch/click */}
            <span className={`${showTooltip ? 'visible opacity-100' : 'invisible opacity-0'} group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-legal-blue text-white text-xs rounded-2xl z-[100] shadow-2xl pointer-events-none border border-white/10 backdrop-blur-xl`}>
                <div className="font-black uppercase tracking-widest text-[10px] text-legal-gold mb-2 flex items-center gap-2">
                    <ShieldCheck size={12} /> Definición Legal
                </div>
                <div className="leading-relaxed font-medium">
                    {definition}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-legal-blue rotate-45 border-r border-b border-white/10" />
            </span>
        </span>
    );
};

const TextWithGlossary = ({ text, darkMode }) => {
    if (!text) return null;

    const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) => {
                const termLower = part.toLowerCase();
                if (GLOSSARY[termLower]) {
                    return <GlossaryTerm key={index} term={part} definition={GLOSSARY[termLower]} darkMode={darkMode} />;
                }
                return part;
            })}
        </span>
    );
};

export default function AppModern() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLifeSituation, setSelectedLifeSituation] = useState('Todas');
    const [expandedId, setExpandedId] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem('darkMode');
            return saved ? JSON.parse(saved) : false;
        } catch (e) {
            return false;
        }
    });

    // Sistema de favoritos
    const [savedIds, setSavedIds] = useState(() => {
        try {
            const saved = localStorage.getItem('savedConstitucion');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('savedConstitucion', JSON.stringify(savedIds));
    }, [savedIds]);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleSave = (e, id) => {
        e.stopPropagation();
        setSavedIds(prev =>
            prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
        );
    };

    const shareOnWhatsApp = (e, item) => {
        e.stopPropagation();
        const message = `🏛️ *Constitución Ciudadana*\n\n📌 *${item.article}:* ${item.explanation}\n\n💡 *En la vida diaria:* ${item.application}\n\n👉 ¡Conocé tus derechos!`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const toggleCategory = (cat) => {
        if (cat === 'Todos') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleTagClick = (e, cat) => {
        e.stopPropagation();
        setSelectedCategories([cat]);
        setSelectedLifeSituation('Todas');
        setActiveTab('articles');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filtrar artículos con lógica mejorada
    const filteredArticles = useMemo(() => {
        return CONSTITUTION_DATA.filter((item) => {
            const matchesSearch =
                item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.application.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesCategory = true;
            if (activeTab === 'favorites') {
                matchesCategory = savedIds.includes(item.id);
            } else {
                const matchesLegalCat = selectedCategories.length === 0 || selectedCategories.includes(item.category);
                const cleanLifeSit = selectedLifeSituation.includes(' ') ? selectedLifeSituation.split(' ')[1] : selectedLifeSituation;
                const matchesLifeSit = selectedLifeSituation === 'Todas' || (item.lifeSituation && item.lifeSituation.includes(cleanLifeSit));
                matchesCategory = matchesLegalCat && matchesLifeSit;
            }

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategories, selectedLifeSituation, savedIds, activeTab]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'bg-legal-blue-dark text-slate-100' : 'bg-legal-gray text-legal-gray-text'}`}>
            <header className="bg-gradient-to-br from-legal-blue via-legal-blue-light to-legal-blue-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent animate-[pulse_6s_ease-in-out_infinite] opacity-10"></div>

                <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all hover:rotate-12"
                            >
                                {darkMode ? <Sun size={24} className="text-legal-gold" /> : <Moon size={24} />}
                            </button>
                            <motion.div
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 10 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                                className="w-12 h-12 rounded-2xl bg-legal-gold flex items-center justify-center shadow-[0_0_30px_rgba(197,157,113,0.5)]"
                            >
                                <span className="text-white text-2xl">⚖️</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight italic">
                            Constitución <span className="text-legal-gold">Ciudadana</span>
                        </h1>
                        <p className="text-white/80 text-lg font-bold tracking-wide">
                            Tu respaldo legal en momentos cotidianos
                        </p>
                    </div>

                    {activeTab !== 'home' && (
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="¿Qué estás buscando? (ej: 'alquiler', 'despido', 'policía')"
                        />
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 -mt-8 pb-48">
                {activeTab === 'home' && (
                    <>
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-14"
                        >
                            <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                <span className="bg-legal-gold/20 p-2.5 rounded-2xl text-xl">🚀</span>
                                Momentos de Vida
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {LIFE_SITUATIONS.filter(s => s !== 'Todas').map((situation, index) => {
                                    const emoji = situation.split(' ')[0];
                                    const label = situation.split(' ').slice(1).join(' ');
                                    return (
                                        <motion.div
                                            key={index}
                                            whileHover={{ y: -8, scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedLifeSituation(situation);
                                                setActiveTab('articles');
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Card className={`p-8 h-full flex flex-col items-center text-center justify-center border-2 border-transparent hover:border-legal-gold/40 group transition-all duration-300 ${darkMode ? 'bg-legal-blue border-white/5 shadow-xl' : 'bg-white shadow-lg border-gray-100 hover:shadow-xl'}`}>
                                                <div className="text-6xl mb-5 group-hover:scale-125 transition-transform duration-500 drop-shadow-xl">
                                                    {emoji}
                                                </div>
                                                <span className={`font-black uppercase text-xs tracking-[0.2em] group-hover:text-legal-gold transition-colors ${darkMode ? 'text-slate-300' : 'text-legal-gray-text'}`}>
                                                    {label}
                                                </span>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>

                        <section className="mb-16">
                            <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                <span className="bg-legal-gold/20 p-2.5 rounded-2xl text-xl">✨</span>
                                Destacados para tí
                            </h2>
                            <Card className={`divide-y overflow-hidden shadow-2xl ${darkMode ? 'bg-legal-blue border-white/5 divide-white/5' : 'bg-white divide-legal-gray'}`}>
                                <div className="space-y-0">
                                    {CONSTITUTION_DATA.slice(0, 5).map((article, index) => (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => {
                                                setExpandedId(article.id === expandedId ? null : article.id);
                                            }}
                                            className={`px-8 py-8 transition-colors cursor-pointer group ${darkMode ? 'hover:bg-white/5' : 'hover:bg-legal-gray/30'}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-xs font-black text-legal-gold uppercase tracking-widest">{article.article}</span>
                                                        <span
                                                            onClick={(e) => handleTagClick(e, article.category)}
                                                            className={`text-[10px] border px-3 py-1 rounded-full transition-all font-black uppercase tracking-tighter ${darkMode ? 'border-white/10 text-slate-400 hover:bg-legal-gold hover:text-white' : 'border-legal-blue/10 text-legal-blue-light hover:bg-legal-gold hover:text-white'}`}
                                                        >
                                                            {article.category}
                                                        </span>
                                                    </div>
                                                    <h4 className={`font-bold text-2xl transition-colors leading-tight ${darkMode ? 'text-white' : 'text-legal-gray-text'} group-hover:text-legal-gold`}>
                                                        <TextWithGlossary text={article.explanation} darkMode={darkMode} />
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => shareOnWhatsApp(e, article)}
                                                        className="p-3 rounded-2xl hover:bg-legal-blue/10 transition-all active:scale-90"
                                                    >
                                                        <Share2 className={`w-6 h-6 ${darkMode ? 'text-slate-500' : 'text-legal-gray-muted'}`} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => toggleSave(e, article.id)}
                                                        className="p-3 rounded-2xl hover:bg-legal-gold/10 transition-all active:scale-90"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 transition-colors ${savedIds.includes(article.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted opacity-30 group-hover:opacity-100'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            {expandedId === article.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-6 pt-8 border-t border-legal-gray/20"
                                                >
                                                    <div className="bg-legal-blue text-white rounded-3xl p-8 mb-4 shadow-2xl relative overflow-hidden group/text">
                                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/text:scale-110 transition-transform">
                                                            <BookText size={100} />
                                                        </div>
                                                        <p className="text-lg italic opacity-90 leading-relaxed font-serif relative z-10 font-medium">"{article.text}"</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    </>
                )}

                {activeTab === 'articles' && (
                    <>
                        <div className="space-y-8 mb-10">
                            <Card className={`p-8 shadow-xl ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white'}`}>
                                <h3 className={`font-black mb-6 flex items-center gap-3 uppercase text-xs tracking-[0.3em] ${darkMode ? 'text-slate-400' : 'text-legal-gray-text'}`}>
                                    <span className="bg-legal-gold text-white p-1.5 rounded-lg shadow-lg">🏠</span>
                                    Filtro por Momento de Vida
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {LIFE_SITUATIONS.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedLifeSituation(cat)}
                                            className={`px-5 py-3 rounded-2xl text-sm font-black transition-all ${selectedLifeSituation === cat
                                                ? 'bg-legal-gold text-white shadow-[0_10px_20px_rgba(197,157,113,0.3)] scale-105'
                                                : (darkMode ? 'bg-legal-blue-dark border-2 border-white/5 text-slate-400 hover:border-legal-gold/50' : 'bg-white border-2 border-legal-gray text-legal-gray-text hover:border-legal-gold')
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            {/* Scroll con indicador de gradiente */}
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-legal-gray to-transparent z-10 pointer-events-none dark:from-legal-blue-dark" style={darkMode ? { background: 'linear-gradient(to right, #121422, transparent)' } : {}} />
                                <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-legal-gray to-transparent z-10 pointer-events-none" style={darkMode ? { background: 'linear-gradient(to left, #121422, transparent)' } : {}} />
                                <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-4 px-6">
                                    <button
                                        onClick={() => toggleCategory('Todos')}
                                        className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategories.length === 0
                                            ? 'bg-legal-blue text-white shadow-xl scale-105'
                                            : (darkMode ? 'bg-white/5 text-slate-500 border-2 border-white/5' : 'bg-white text-legal-gray-muted border-2 border-legal-gray')
                                            }`}
                                    >
                                        Todos los Temas
                                    </button>
                                    {CATEGORIES.filter(c => c !== 'Todos').map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategories.includes(cat)
                                                ? 'bg-legal-gold text-white shadow-xl scale-105'
                                                : (darkMode ? 'bg-white/5 text-slate-500 border-2 border-white/5 hover:border-legal-gold/30' : 'bg-white text-legal-gray-muted border-2 border-legal-gray hover:border-legal-gold')
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {filteredArticles.length === 0 ? (
                                <Card className={`text-center py-24 shadow-2xl ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white'}`}>
                                    <div className="text-8xl mb-8 filter drop-shadow-2xl">🕵️‍♂️</div>
                                    <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>Búsqueda sin resultados</h3>
                                    <p className="text-legal-gray-muted mb-10 text-lg">Prueba combinando momentos de vida o borra los filtros</p>
                                    <Button variant="outline" className="rounded-3xl px-12 py-8 font-black uppercase tracking-[0.3em] text-[10px] scale-110 active:scale-95 transition-all" onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedLifeSituation('Todas');
                                        setSearchTerm('');
                                    }}>
                                        Reiniciar Filtros
                                    </Button>
                                </Card>
                            ) : (
                                filteredArticles.map((item) => (
                                    <Card key={item.id} className={`cursor-pointer border-l-[12px] transition-all duration-500 shadow-xl group/card ${expandedId === item.id ? 'border-legal-gold' : 'border-transparent hover:border-legal-gold-light'} ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white'}`} hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="font-black text-legal-gold text-xs tracking-widest pb-1 uppercase">{item.article}</span>
                                                        <button
                                                            onClick={(e) => handleTagClick(e, item.category)}
                                                            className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${darkMode ? 'bg-white/5 text-slate-400 hover:text-legal-gold' : 'bg-legal-blue/5 text-legal-blue hover:text-legal-gold'}`}
                                                        >
                                                            {item.category}
                                                        </button>
                                                    </div>
                                                    <h3 className={`text-2xl font-black leading-tight transition-colors ${darkMode ? 'text-white' : 'text-legal-gray-text'} group-hover/card:text-legal-gold`}>
                                                        <TextWithGlossary text={item.explanation} darkMode={darkMode} />
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => shareOnWhatsApp(e, item)}
                                                        className={`p-3 rounded-2xl transition-all active:scale-90 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-legal-blue/5'}`}
                                                    >
                                                        <Share2 className={`w-6 h-6 ${darkMode ? 'text-slate-600' : 'text-legal-gray-muted'}`} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => toggleSave(e, item.id)}
                                                        className={`ml-2 p-3 rounded-2xl transition-all active:scale-90 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-legal-gold/10'}`}
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 transition-colors ${savedIds.includes(item.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted opacity-20 group-hover/card:opacity-100'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedId === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="mt-10 overflow-hidden"
                                                    >
                                                        <div className="border-t-2 border-legal-gray/20 pt-10 space-y-10">
                                                            <div className={`rounded-[40px] p-10 relative overflow-hidden group/life shadow-inner ${darkMode ? 'bg-legal-blue-dark/50' : 'bg-gradient-to-br from-legal-gold/10 to-transparent'}`}>
                                                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover/life:scale-125 transition-transform duration-700">
                                                                    <Sun size={80} />
                                                                </div>
                                                                <h4 className="text-[10px] font-black uppercase text-legal-gold mb-6 tracking-[0.4em] flex items-center gap-4">
                                                                    <span className="w-12 h-px bg-legal-gold"></span>
                                                                    Uso en la vida diaria
                                                                </h4>
                                                                <p className={`text-2xl font-bold leading-relaxed relative z-10 ${darkMode ? 'text-slate-200' : 'text-legal-gray-text'}`}>
                                                                    {item.application}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-start gap-8 px-6">
                                                                <div className="w-2 bg-legal-gold/30 self-stretch rounded-full" />
                                                                <div className={`text-lg italic leading-loose font-serif ${darkMode ? 'text-slate-400' : 'text-legal-gray-muted'}`}>
                                                                    "{item.text}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'favorites' && (
                    <>
                        <div className="mb-14 text-center py-12 pt-6">
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-28 h-28 bg-legal-gold/20 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl ring-4 ring-legal-gold/10"
                            >
                                <Heart className="text-legal-gold w-14 h-14 fill-legal-gold" />
                            </motion.div>
                            <h2 className={`text-5xl font-black tracking-tighter italic ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                Mis Favoritos
                            </h2>
                            <div className="mt-4 text-legal-gold font-black uppercase text-[10px] tracking-[0.4em] bg-legal-gold/10 inline-block px-6 py-2 rounded-full shadow-inner">
                                {savedIds.length} artículos protegidos
                            </div>
                        </div>

                        {filteredArticles.length === 0 ? (
                            <Card className={`text-center py-28 rounded-[50px] shadow-2xl ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white'}`}>
                                <div className="text-9xl mb-10 filter drop-shadow-2xl">🗂️</div>
                                <h3 className={`text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                    Colección Vacía
                                </h3>
                                <p className="text-legal-gray-muted text-lg mb-12 max-w-sm mx-auto font-medium">
                                    Toca el símbolo de estrella para guardar artículos importantes para tí
                                </p>
                                <Button className="rounded-3xl px-14 py-8 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl scale-110 active:scale-95 transition-all" onClick={() => setActiveTab('articles')}>
                                    Explorar la Constitución
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-8">
                                {filteredArticles.map((item) => (
                                    <Card key={item.id} className={`cursor-pointer border-l-[16px] border-legal-gold shadow-2xl hover:translate-x-3 transition-all duration-300 ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white'}`} hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="font-black text-legal-gold text-xs leading-none uppercase tracking-widest">{item.article}</span>
                                                    </div>
                                                    <h3 className={`text-3xl font-black leading-tight ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                                        <TextWithGlossary text={item.explanation} darkMode={darkMode} />
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => shareOnWhatsApp(e, item)}
                                                        className="p-3 rounded-2xl hover:bg-white/10 transition-all active:scale-90"
                                                    >
                                                        <Share2 className={`w-6 h-6 ${darkMode ? 'text-slate-500' : 'text-legal-gray-muted'}`} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => toggleSave(e, item.id)}
                                                        className="ml-2 p-4 bg-legal-gold/10 rounded-3xl active:scale-90 transition-transform shadow-lg"
                                                    >
                                                        <Star className="w-8 h-8 fill-legal-gold text-legal-gold" />
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedId === item.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-10 pt-10 border-t-2 border-legal-gray/20"
                                                >
                                                    <div className={`rounded-[40px] p-10 shadow-inner ${darkMode ? 'bg-legal-blue-dark/50' : 'bg-legal-gray/40'}`}>
                                                        <h4 className="text-[10px] font-black uppercase text-legal-gray-muted mb-6 tracking-[0.4em] flex items-center gap-4">
                                                            <ShieldCheck size={16} className="text-legal-gold" /> Resumen Legal Rápido
                                                        </h4>
                                                        <p className={`text-2xl font-extrabold leading-relaxed ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                                            {item.application}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'fulltext' && (
                    <FullTextViewer constitutionText={constitutionText} darkMode={darkMode} />
                )}

                {/* Footer Premium Reintegrado */}
                <footer className={`mt-32 pb-24 border-t-2 pt-20 ${darkMode ? 'border-white/5 text-slate-400' : 'border-legal-gray text-legal-gray-muted'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className={`p-10 rounded-[40px] shadow-2xl relative overflow-hidden group ${darkMode ? 'bg-legal-blue border border-white/5' : 'bg-white border-2 border-legal-gray'}`}>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-legal-gold rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-3xl" />
                            <h4 className={`text-xl font-black mb-4 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-legal-gray-text'}`}>
                                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                                Apoyá este Proyecto
                            </h4>
                            <p className="text-base mb-8 font-medium leading-relaxed">
                                Esta herramienta es libre y gratuita para todos los ciudadanos. Si te ayudó a conocer tus derechos, considerá apoyarnos.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-legal-gold text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(197,157,113,0.3)] hover:shadow-legal-gold/50 transition-all"
                                >
                                    <Coffee size={18} /> Invitar un Cafecito
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border-2 transition-all ${darkMode ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-legal-gray text-legal-gray-text hover:bg-legal-gray/20'}`}
                                >
                                    <FileText size={18} /> Exportar Resumen
                                </motion.button>
                            </div>
                        </div>

                        <div className="space-y-6 text-center md:text-left">
                            <div>
                                <h5 className={`font-black uppercase text-[10px] tracking-[0.5em] mb-4 ${darkMode ? 'text-legal-gold' : 'text-legal-gray-text'}`}>
                                    Poder Ciudadano
                                </h5>
                                <p className="text-sm font-medium leading-loose italic max-w-sm">
                                    "Todos los habitantes de la Nación gozan de los derechos conforme a las leyes que reglamenten su ejercicio..." — Art. 14 CN
                                </p>
                            </div>
                            <div className="pt-6 border-t-2 border-legal-gray/10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                                © 2026 Constitución Argentina Digital • Edición Pro • ANDRES WALTER
                            </div>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Bottom Navigation Lux - Estilo Premium Apple */}
            <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-10 pt-4 bg-gradient-to-t from-legal-blue-dark/50 via-legal-blue-dark/20 to-transparent pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className={`rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] px-4 py-4 flex items-center justify-between border-t border-white/20 backdrop-blur-3xl ring-1 ring-black/40 ${darkMode ? 'bg-legal-blue/90' : 'bg-legal-blue/95'}`}>
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-[30px] transition-all duration-500 ${activeTab === 'home'
                                ? 'bg-legal-gold text-white shadow-[0_15px_30px_rgba(197,157,113,0.4)] scale-110'
                                : 'text-white/50 hover:text-white/80 hover:scale-105'
                                }`}
                        >
                            <Home size={26} strokeWidth={activeTab === 'home' ? 3 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Inicio</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-[30px] transition-all duration-500 ${activeTab === 'articles'
                                ? 'bg-legal-gold text-white shadow-[0_15px_30px_rgba(197,157,113,0.4)] scale-110'
                                : 'text-white/50 hover:text-white/80 hover:scale-105'
                                }`}
                        >
                            <FileText size={26} strokeWidth={activeTab === 'articles' ? 3 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Leyes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-[30px] transition-all duration-500 ${activeTab === 'favorites'
                                ? 'bg-legal-gold text-white shadow-[0_15px_30px_rgba(197,157,113,0.4)] scale-110'
                                : 'text-white/50 hover:text-white/80 hover:scale-105'
                                }`}
                        >
                            <Star size={26} strokeWidth={activeTab === 'favorites' ? 3 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Favs</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('fulltext')}
                            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-[30px] transition-all duration-500 ${activeTab === 'fulltext'
                                ? 'bg-legal-gold text-white shadow-[0_15px_30px_rgba(197,157,113,0.4)] scale-110'
                                : 'text-white/50 hover:text-white/80 hover:scale-105'
                                }`}
                        >
                            <BookText size={26} strokeWidth={activeTab === 'fulltext' ? 3 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Libro</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Chat Widget Reintegrado */}
            <ChatWidget constitutionText={constitutionText} darkMode={darkMode} />

            {/* Menú Lateral Premium */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-legal-blue-dark/95 backdrop-blur-xl z-[150]"
                        />
                        <motion.div
                            initial={{ x: -500 }}
                            animate={{ x: 0 }}
                            exit={{ x: -500 }}
                            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[90%] max-w-sm bg-white shadow-2xl z-[160] p-12 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-16">
                                <div>
                                    <h3 className="text-5xl font-black text-legal-gray-text tracking-tighter italic">Constitución</h3>
                                    <div className="h-2 w-24 bg-legal-gold rounded-full mt-3 shadow-lg" />
                                </div>
                                <button onClick={() => setMenuOpen(false)} className="p-4 bg-legal-gray rounded-3xl hover:rotate-180 transition-all duration-500 active:scale-75 shadow-sm">
                                    <X className="text-legal-gray-muted" size={32} />
                                </button>
                            </div>

                            <div className="space-y-6 flex-1">
                                {[
                                    { id: 'home', icon: '🏠', label: 'Inicio', desc: 'Panel de control principal' },
                                    { id: 'articles', icon: '⚖️', label: 'Explorador', desc: 'Derechos por situaciones' },
                                    { id: 'favorites', icon: '⭐', label: 'Favoritos', desc: 'Tus leyes protegidas' },
                                    { id: 'fulltext', icon: '📖', label: 'El Libro', desc: 'Texto oficial completo' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-8 py-7 rounded-[32px] transition-all flex items-center gap-6 group shadow-sm ${activeTab === item.id
                                            ? 'bg-legal-gold text-white shadow-legal-gold/30'
                                            : 'text-legal-gray-text hover:bg-legal-gray hover:translate-x-2'
                                            }`}
                                    >
                                        <div className={`text-4xl filter group-hover:drop-shadow-lg transition-all ${item.id === activeTab ? '' : 'grayscale group-hover:grayscale-0'}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-black uppercase text-[10px] tracking-[0.3em]">{item.label}</div>
                                            <div className={`text-[10px] font-bold mt-1 ${activeTab === item.id ? 'text-white/60' : 'text-legal-gray-muted'}`}>{item.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-12 border-t border-legal-gray">
                                <div className="bg-gradient-to-br from-legal-blue to-legal-blue-dark rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group/card-footer">
                                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-legal-gold rounded-full opacity-10 blur-3xl group-hover/card-footer:opacity-20 transition-opacity" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-legal-gold mb-4">
                                        Nación Argentina
                                    </p>
                                    <h4 className="text-3xl font-black italic tracking-tighter">Legal App Pro</h4>
                                    <p className="text-xs font-bold opacity-30 mt-2 uppercase tracking-[0.3em]">State of the Art • 2026</p>

                                    <div className="mt-10 flex items-center justify-between">
                                        <div className="text-[10px] bg-white/10 px-4 py-2 rounded-full font-black ring-1 ring-white/20">v1.2.5 PRO</div>
                                        <span className="text-[10px] font-black text-legal-gold tracking-widest whitespace-nowrap">ANDRES WALTER</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
