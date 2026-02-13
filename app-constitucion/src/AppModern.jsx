import React, { useState, useMemo, useEffect } from 'react';
import { Home, FileText, Heart, Menu, X, Star, Search as SearchIcon, BookText, Filter, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from './components/ui/Card';
import { SearchBar } from './components/ui/SearchBar';
import { Button } from './components/ui/Button';
import { CONSTITUTION_DATA, CATEGORIES, LIFE_SITUATIONS } from './data';
import FullTextViewer from './FullTextViewer';
import constitutionText from './assets/constitution.md?raw';

export default function AppModern() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLifeSituation, setSelectedLifeSituation] = useState('Todas');
    const [expandedId, setExpandedId] = useState(null);

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

    const toggleSave = (e, id) => {
        e.stopPropagation();
        setSavedIds(prev =>
            prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
        );
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
                // Filtro por categorías jurídicas (Multiselección)
                const matchesLegalCat = selectedCategories.length === 0 || selectedCategories.includes(item.category);

                // Filtro por Momentos de Vida
                // Limpiamos el emoji para comparar con el array de strings en data.jsx
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
        <div className="min-h-screen bg-legal-gray font-sans">
            <header className="bg-gradient-to-br from-legal-blue via-legal-blue-light to-legal-blue-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent animate-pulse opacity-30"></div>

                <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <motion.div
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 10 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                                className="w-10 h-10 rounded-full bg-legal-gold flex items-center justify-center shadow-lg"
                            >
                                <span className="text-white text-xl">⚖️</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">
                            Constitución <span className="text-legal-gold">Ciudadana</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium">
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

            <main className="max-w-4xl mx-auto px-4 -mt-8 pb-32">
                {activeTab === 'home' && (
                    <>
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10"
                        >
                            <h2 className="text-2xl font-black text-legal-gray-text mb-6 flex items-center gap-2">
                                <span className="bg-legal-gold/20 p-2 rounded-lg text-lg">🚀</span>
                                Momentos de Vida
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {LIFE_SITUATIONS.filter(s => s !== 'Todas').map((situation, index) => {
                                    const emoji = situation.split(' ')[0];
                                    const label = situation.split(' ').slice(1).join(' ');
                                    return (
                                        <motion.div
                                            key={index}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedLifeSituation(situation);
                                                setActiveTab('articles');
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Card className="p-6 h-full flex flex-col items-center text-center justify-center border-2 border-transparent hover:border-legal-gold/30 group transition-all duration-300">
                                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    {emoji}
                                                </div>
                                                <span className="font-black text-legal-gray-text group-hover:text-legal-gold uppercase text-xs tracking-widest">
                                                    {label}
                                                </span>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>

                        <section>
                            <h2 className="text-2xl font-black text-legal-gray-text mb-6 flex items-center gap-2">
                                <span className="bg-legal-gold/20 p-2 rounded-lg text-lg">✨</span>
                                Destacados para tí
                            </h2>
                            <Card className="divide-y divide-legal-gray overflow-hidden">
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
                                            className="px-6 py-6 hover:bg-legal-gray/30 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-black text-legal-gold uppercase tracking-tighter">{article.article}</span>
                                                        <span
                                                            onClick={(e) => handleTagClick(e, article.category)}
                                                            className="text-[10px] border border-legal-blue/10 text-legal-blue-light px-2 py-0.5 rounded-full hover:bg-legal-gold hover:text-white hover:border-legal-gold transition-all font-black uppercase"
                                                        >
                                                            {article.category}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-xl text-legal-gray-text group-hover:text-legal-gold transition-colors leading-tight">
                                                        {article.explanation}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, article.id)}
                                                    className="ml-4 p-2 rounded-full hover:bg-legal-gold/10 transition-colors"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 transition-colors ${savedIds.includes(article.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                            {expandedId === article.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-4 pt-6 border-t border-legal-gray"
                                                >
                                                    <div className="bg-legal-blue text-white rounded-2xl p-6 mb-4 shadow-xl">
                                                        <p className="text-base italic opacity-90 leading-relaxed font-serif">"{article.text}"</p>
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
                        <div className="space-y-6 mb-8">
                            <Card className="p-6">
                                <h3 className="font-black text-legal-gray-text mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                                    <span className="bg-legal-gold text-white p-1 rounded">🏠</span>
                                    Momento de Vida
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {LIFE_SITUATIONS.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedLifeSituation(cat)}
                                            className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${selectedLifeSituation === cat
                                                ? 'bg-legal-blue text-white shadow-lg scale-105'
                                                : 'bg-white border-2 border-legal-gray text-legal-gray-text hover:border-legal-gold'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                                <button
                                    onClick={() => toggleCategory('Todos')}
                                    className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategories.length === 0
                                        ? 'bg-legal-gold text-white shadow-lg'
                                        : 'bg-white text-legal-gray-muted border-2 border-legal-gray'
                                        }`}
                                >
                                    Todos los Temas
                                </button>
                                {CATEGORIES.filter(c => c !== 'Todos').map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategories.includes(cat)
                                            ? 'bg-legal-blue text-white shadow-lg'
                                            : 'bg-white text-legal-gray-muted border-2 border-legal-gray hover:border-legal-gold'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredArticles.length === 0 ? (
                                <Card className="text-center py-20">
                                    <div className="text-7xl mb-6">🕵️‍♂️</div>
                                    <h3 className="text-2xl font-black text-legal-gray-text mb-3">Sin resultados</h3>
                                    <p className="text-legal-gray-muted mb-8">Prueba combinando momentos de vida o borra los filtros</p>
                                    <Button variant="outline" className="rounded-2xl px-8 py-6 font-black uppercase tracking-widest text-xs" onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedLifeSituation('Todas');
                                        setSearchTerm('');
                                    }}>
                                        Reiniciar Búsqueda
                                    </Button>
                                </Card>
                            ) : (
                                filteredArticles.map((item) => (
                                    <Card key={item.id} className="cursor-pointer border-l-8 border-transparent hover:border-legal-gold transition-all duration-300" hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="font-black text-legal-gold text-[10px] tracking-widest border-b-2 border-legal-gold/20 pb-1 uppercase">{item.article}</span>
                                                        <button
                                                            onClick={(e) => handleTagClick(e, item.category)}
                                                            className="text-[9px] bg-legal-blue/10 text-legal-blue px-3 py-1 rounded-full font-black uppercase tracking-tighter"
                                                        >
                                                            {item.category}
                                                        </button>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-legal-gray-text leading-tight group-hover:text-legal-gold transition-colors">
                                                        {item.explanation}
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, item.id)}
                                                    className="ml-4 p-2 rounded-full hover:bg-legal-gold/10 transition-colors"
                                                >
                                                    <Star
                                                        className={`w-7 h-7 transition-colors ${savedIds.includes(item.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {expandedId === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="mt-8 overflow-hidden"
                                                    >
                                                        <div className="border-t-2 border-legal-gray pt-8 space-y-8">
                                                            <div className="bg-gradient-to-br from-legal-gold/10 to-transparent rounded-[32px] p-8 relative overflow-hidden group">
                                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                                                    <Sun size={64} />
                                                                </div>
                                                                <h4 className="text-[10px] font-black uppercase text-legal-gold mb-4 tracking-[0.2em] flex items-center gap-3">
                                                                    <span className="w-8 h-px bg-legal-gold"></span>
                                                                    Aplicación en la vida diaria
                                                                </h4>
                                                                <p className="text-xl text-legal-gray-text font-bold leading-relaxed relative z-10">
                                                                    {item.application}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-start gap-6 px-4">
                                                                <div className="w-1.5 bg-legal-blue/10 self-stretch rounded-full" />
                                                                <div className="text-base text-legal-gray-muted italic leading-loose font-serif">
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
                        <div className="mb-12 text-center py-10 pt-4">
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-24 h-24 bg-legal-gold/20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl"
                            >
                                <Heart className="text-legal-gold w-12 h-12 fill-legal-gold" />
                            </motion.div>
                            <h2 className="text-4xl font-black text-legal-gray-text tracking-tighter">
                                Mis Favoritos
                            </h2>
                            <div className="mt-2 text-legal-gold font-bold uppercase text-[10px] tracking-widest">
                                {savedIds.length} artículos protegidos
                            </div>
                        </div>

                        {filteredArticles.length === 0 ? (
                            <Card className="text-center py-24 rounded-[40px]">
                                <div className="text-8xl mb-8">🗂️</div>
                                <h3 className="text-2xl font-black text-legal-gray-text mb-4">
                                    Colección Vacía
                                </h3>
                                <p className="text-legal-gray-muted text-sm mb-10 max-w-xs mx-auto">
                                    Toca el símbolo de estrella para guardar artículos importantes para tí
                                </p>
                                <Button className="rounded-2xl px-10 py-6 font-black uppercase tracking-widest text-xs" onClick={() => setActiveTab('articles')}>
                                    Explorar la Constitución
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {filteredArticles.map((item) => (
                                    <Card key={item.id} className="cursor-pointer border-l-[12px] border-legal-gold shadow-xl hover:translate-x-1" hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="font-black text-legal-gold text-xs leading-none">{item.article}</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-legal-gray-text leading-tight">
                                                        {item.explanation}
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, item.id)}
                                                    className="ml-6 p-2 bg-legal-gold/10 rounded-full"
                                                >
                                                    <Star className="w-7 h-7 fill-legal-gold text-legal-gold" />
                                                </button>
                                            </div>

                                            {expandedId === item.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-8 pt-8 border-t-2 border-legal-gray"
                                                >
                                                    <div className="bg-legal-gray/40 rounded-[30px] p-8">
                                                        <h4 className="text-[10px] font-black uppercase text-legal-gray-muted mb-4 tracking-widest flex items-center gap-2">
                                                            🔍 Resumen Rápido
                                                        </h4>
                                                        <p className="text-xl text-legal-gray-text font-bold leading-relaxed">
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
                    <FullTextViewer constitutionText={constitutionText} darkMode={false} />
                )}
            </main>

            {/* Bottom Navigation Lux - Estilo Premium Apple */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-4 bg-gradient-to-t from-legal-gray via-legal-gray/95 to-transparent pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="bg-legal-blue/95 backdrop-blur-2xl rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] px-4 py-4 flex items-center justify-between border border-white/10 ring-1 ring-black/20">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-[30px] transition-all duration-500 ${activeTab === 'home'
                                ? 'bg-legal-gold text-white shadow-[0_10px_20px_rgba(197,157,113,0.3)] scale-110'
                                : 'text-white/40 hover:text-white/70 hover:scale-105'
                                }`}
                        >
                            <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Inicio</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-[30px] transition-all duration-500 ${activeTab === 'articles'
                                ? 'bg-legal-gold text-white shadow-[0_10px_20px_rgba(197,157,113,0.3)] scale-110'
                                : 'text-white/40 hover:text-white/70 hover:scale-105'
                                }`}
                        >
                            <FileText size={24} strokeWidth={activeTab === 'articles' ? 3 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Leyes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-[30px] transition-all duration-500 ${activeTab === 'favorites'
                                ? 'bg-legal-gold text-white shadow-[0_10px_20px_rgba(197,157,113,0.3)] scale-110'
                                : 'text-white/40 hover:text-white/70 hover:scale-105'
                                }`}
                        >
                            <Star size={24} strokeWidth={activeTab === 'favorites' ? 3 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Favs</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('fulltext')}
                            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-[30px] transition-all duration-500 ${activeTab === 'fulltext'
                                ? 'bg-legal-gold text-white shadow-[0_10px_20px_rgba(197,157,113,0.3)] scale-110'
                                : 'text-white/40 hover:text-white/70 hover:scale-105'
                                }`}
                        >
                            <BookText size={24} strokeWidth={activeTab === 'fulltext' ? 3 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Libro</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menú Lateral Premium */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-legal-blue/90 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ x: -400 }}
                            animate={{ x: 0 }}
                            exit={{ x: -400 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[70] p-10 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-4xl font-black text-legal-gray-text tracking-tighter italic">App</h3>
                                    <div className="h-1.5 w-16 bg-legal-gold rounded-full mt-2" />
                                </div>
                                <button onClick={() => setMenuOpen(false)} className="p-3 bg-legal-gray rounded-full hover:rotate-90 transition-transform">
                                    <X className="text-legal-gray-muted" size={28} />
                                </button>
                            </div>

                            <div className="space-y-4 flex-1">
                                {[
                                    { id: 'home', icon: '🏠', label: 'Inicio', desc: 'Panel principal' },
                                    { id: 'articles', icon: '⚖️', label: 'Explorador', desc: 'Leyes por temas' },
                                    { id: 'favorites', icon: '⭐', label: 'Favoritos', desc: 'Tus leyes guardadas' },
                                    { id: 'fulltext', icon: '📖', label: 'Constitución', desc: 'Texto oficial completo' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-5 rounded-[24px] transition-all flex items-center gap-5 group ${activeTab === item.id
                                            ? 'bg-legal-gold/10 text-legal-gold ring-1 ring-legal-gold/20'
                                            : 'text-legal-gray-text hover:bg-legal-gray'
                                            }`}
                                    >
                                        <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-black uppercase text-xs tracking-widest">{item.label}</div>
                                            <div className="text-[10px] text-legal-gray-muted font-bold mt-0.5">{item.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-10 border-t border-legal-gray">
                                <div className="bg-gradient-to-br from-legal-blue to-legal-blue-dark rounded-[32px] p-8 text-white relative overflow-hidden">
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-legal-gold rounded-full opacity-10 blur-3xl" />
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-legal-gold mb-3">
                                        Nación Argentina
                                    </p>
                                    <h4 className="text-2xl font-black italic tracking-tighter">Legal App</h4>
                                    <p className="text-xs font-bold opacity-40 mt-1 uppercase tracking-widest">Digital Edition 2026</p>

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full font-black">v1.2.0 PRO</div>
                                        <span className="text-[10px] font-black text-legal-gold">© ADW</span>
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
