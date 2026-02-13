import React, { useState, useMemo, useEffect } from 'react';
import { Home, FileText, Heart, Menu, X, Star, Search as SearchIcon, BookText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from './components/ui/Card';
import { SearchBar } from './components/ui/SearchBar';
import { CONSTITUTION_DATA, CATEGORIES } from './data';
import FullTextViewer from './FullTextViewer';
import constitutionText from './assets/constitution.md?raw';

export default function AppModern() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'articles', 'favorites', 'fulltext'
    const [selectedCategory, setSelectedCategory] = useState('Todos');
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

    // Guardar favoritos en localStorage
    useEffect(() => {
        localStorage.setItem('savedConstitucion', JSON.stringify(savedIds));
    }, [savedIds]);

    const toggleSave = (e, id) => {
        e.stopPropagation();
        setSavedIds(prev =>
            prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
        );
    };

    // Filtrar artículos
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
            } else if (selectedCategory !== 'Todos') {
                matchesCategory = item.category === selectedCategory;
            }

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, savedIds, activeTab]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Artículos recientes (últimos 3)
    const recentArticles = CONSTITUTION_DATA.slice(0, 3);

    return (
        <div className="min-h-screen bg-legal-gray font-sans">
            {/* Header con gradiente Azul Noche */}
            <header className="bg-gradient-to-br from-legal-blue via-legal-blue-light to-legal-blue-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent"></div>

                <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-legal-gold flex items-center justify-center">
                                <span className="text-white text-xl">⚖️</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                            Constitución Nacional
                        </h1>
                        <p className="text-white/80 text-lg">
                            Sistema de Consulta Legal Profesional
                        </p>
                    </div>

                    {/* SearchBar con Glassmorphism */}
                    {activeTab !== 'home' && (
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar artículos, derechos, garantías..."
                        />
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 -mt-6 pb-24">
                {activeTab === 'home' && (
                    <>
                        {/* Secciones Destacadas */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-legal-gray-text mb-6">
                                Secciones Destacadas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CATEGORIES.slice(1, 5).map((category, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setActiveTab('articles');
                                        }}
                                    >
                                        <Card className="cursor-pointer group">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-legal-gold/10 text-legal-gold group-hover:bg-legal-gold group-hover:text-white transition-all">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="group-hover:text-legal-gold transition-colors">
                                                        {category}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {CONSTITUTION_DATA.filter(a => a.category === category).length} artículos
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Actividad Reciente */}
                        <section>
                            <h2 className="text-2xl font-bold text-legal-gray-text mb-6">
                                Artículos Destacados
                            </h2>
                            <Card>
                                <div className="space-y-4">
                                    {recentArticles.map((article, index) => (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => {
                                                setExpandedId(article.id);
                                                setActiveTab('articles');
                                            }}
                                            className="pb-4 last:pb-0 border-b last:border-b-0 border-legal-gray hover:bg-legal-gray/30 -mx-6 px-6 py-3 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-legal-gray-text mb-1">
                                                        {article.article}
                                                    </h4>
                                                    <p className="text-sm text-legal-gray-muted">
                                                        {article.explanation}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, article.id)}
                                                    className="ml-2"
                                                >
                                                    <Star
                                                        className={`w-5 h-5 transition-colors ${savedIds.includes(article.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    </>
                )}

                {activeTab === 'articles' && (
                    <>
                        {/* Filtros de Categoría */}
                        <Card className="mb-6">
                            <h3 className="font-semibold text-legal-gray-text mb-3 flex items-center gap-2">
                                <SearchIcon size={16} />
                                Filtrar por categoría
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat
                                            ? 'bg-legal-gold text-white'
                                            : 'bg-legal-gray text-legal-gray-text hover:bg-legal-gold/20'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Lista de Artículos */}
                        <div className="space-y-4">
                            {filteredArticles.length === 0 ? (
                                <Card>
                                    <p className="text-center text-legal-gray-muted py-8">
                                        No se encontraron artículos
                                    </p>
                                </Card>
                            ) : (
                                filteredArticles.map((item) => (
                                    <Card key={item.id} className="cursor-pointer" hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-bold text-legal-gold">{item.article}</span>
                                                        <span className="text-xs bg-legal-gray px-2 py-0.5 rounded-full">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-legal-gray-text">
                                                        {item.explanation}
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, item.id)}
                                                    className="ml-2"
                                                >
                                                    <Star
                                                        className={`w-5 h-5 transition-colors ${savedIds.includes(item.id) ? 'fill-legal-gold text-legal-gold' : 'text-legal-gray-muted'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {expandedId === item.id && (
                                                <div className="mt-4 pt-4 border-t border-legal-gray">
                                                    <div className="bg-legal-gray/50 rounded-lg p-4 mb-3">
                                                        <h4 className="text-xs font-bold uppercase text-legal-gray-muted mb-2">
                                                            💡 En la vida diaria
                                                        </h4>
                                                        <p className="text-sm text-legal-gray-text">
                                                            {item.application}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-legal-gray-muted italic">
                                                        "{item.text}"
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'favorites' && (
                    <>
                        <Card className="mb-6">
                            <h2 className="text-2xl font-bold text-legal-gray-text flex items-center gap-2">
                                <Heart className="text-legal-gold" />
                                Mis Favoritos ({savedIds.length})
                            </h2>
                        </Card>

                        {filteredArticles.length === 0 ? (
                            <Card>
                                <div className="text-center py-12">
                                    <Star className="w-16 h-16 mx-auto mb-4 text-legal-gray-muted" />
                                    <p className="text-legal-gray-text font-semibold mb-2">
                                        No tienes artículos guardados
                                    </p>
                                    <p className="text-legal-gray-muted text-sm">
                                        Toca la estrella en los artículos para guardarlos
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredArticles.map((item) => (
                                    <Card key={item.id} className="cursor-pointer" hover={false}>
                                        <div onClick={() => toggleExpand(item.id)}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-bold text-legal-gold">{item.article}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-legal-gray-text">
                                                        {item.explanation}
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleSave(e, item.id)}
                                                    className="ml-2"
                                                >
                                                    <Star className="w-5 h-5 fill-legal-gold text-legal-gold" />
                                                </button>
                                            </div>

                                            {expandedId === item.id && (
                                                <div className="mt-4 pt-4 border-t border-legal-gray">
                                                    <div className="bg-legal-gray/50 rounded-lg p-4 mb-3">
                                                        <h4 className="text-xs font-bold uppercase text-legal-gray-muted mb-2">
                                                            💡 En la vida diaria
                                                        </h4>
                                                        <p className="text-sm text-legal-gray-text">
                                                            {item.application}
                                                        </p>
                                                    </div>
                                                </div>
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

            {/* Bottom Navigation - Flotante */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-legal-blue rounded-[30px] shadow-2xl px-6 py-3 flex items-center gap-6 border border-legal-gold/20">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-legal-gold' : 'text-white/60 hover:text-white'
                            }`}
                    >
                        <Home size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Inicio</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'articles' ? 'text-legal-gold' : 'text-white/60 hover:text-white'
                            }`}
                    >
                        <FileText size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Artículos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'favorites' ? 'text-legal-gold' : 'text-white/60 hover:text-white'
                            }`}
                    >
                        <Heart size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Favoritos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('fulltext')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'fulltext' ? 'text-legal-gold' : 'text-white/60 hover:text-white'
                            }`}
                    >
                        <BookText size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Texto</span>
                    </button>
                </div>
            </nav>

            {/* Menú Lateral */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-legal-gray-text">Menú</h3>
                                <button onClick={() => setMenuOpen(false)}>
                                    <X className="text-legal-gray-muted" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setActiveTab('home');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-legal-gray transition-colors text-legal-gray-text"
                                >
                                    🏠 Inicio
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('articles');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-legal-gray transition-colors text-legal-gray-text"
                                >
                                    📜 Todos los Artículos
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('favorites');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-legal-gray transition-colors text-legal-gray-text"
                                >
                                    ⭐ Favoritos
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('fulltext');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-legal-gray transition-colors text-legal-gray-text"
                                >
                                    📖 Texto Completo
                                </button>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-legal-gray rounded-lg p-4 text-center">
                                    <p className="text-xs text-legal-gray-muted">
                                        Constitución Nacional Argentina
                                    </p>
                                    <p className="text-xs text-legal-gold font-semibold mt-1">
                                        v1.0.0
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
