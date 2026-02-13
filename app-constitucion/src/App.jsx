import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Sun, Star, MessageCircle, Info, Heart, Coffee, FileText, Moon, BookText, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOSSARY, CONSTITUTION_DATA, CATEGORIES, LIFE_SITUATIONS } from './data';
import ChatWidget from './ChatWidget';
import FullTextViewer from './FullTextViewer';
import constitutionText from './assets/constitution.md?raw';

// Componente para resaltar términos del glosario con Tooltip
const TextWithGlossary = ({ text, darkMode }) => {
  if (!text) return null;

  // Ordenamos las claves del glosario por longitud (descendente) para matchear las frases más largas primero
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const termLower = part.toLowerCase();
        if (GLOSSARY[termLower]) {
          return (
            <span key={index} className="group relative inline-block cursor-help text-sky-600 font-semibold border-b border-dashed border-sky-400 dark:text-sky-400">
              {part}
              {/* Tooltip */}
              <span className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 ${darkMode ? 'bg-slate-700 text-slate-100 border border-slate-600' : 'bg-slate-800 text-white'} text-xs rounded-lg z-10 text-center shadow-lg pointer-events-none`}>
                {GLOSSARY[termLower]}
                <svg className={`absolute ${darkMode ? 'text-slate-700' : 'text-slate-800'} h-2 w-full left-0 top-full`} x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
              </span>
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedId, setExpandedId] = useState(null);

  // Nuevos estados
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState('articles'); // 'articles' o 'fulltext'
  const [filterType, setFilterType] = useState('category'); // 'category' o 'situation'

  // Estado para marcadores (Favoritos)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('savedConstitucion');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambian los favoritos
  useEffect(() => {
    localStorage.setItem('savedConstitucion', JSON.stringify(savedIds));
  }, [savedIds]);

  // Guardar modo oscuro y aplicar clase
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSave = (e, id) => {
    e.stopPropagation(); // Evita que se abra/cierre la tarjeta al hacer click en la estrella
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  const shareOnWhatsApp = (item) => {
    const message = `🏛️ *Constitución Ciudadana*\n\n📌 *${item.article}:* ${item.explanation}\n\n💡 *En la vida diaria:* ${item.application}\n\n👉 ¡Conocé tus derechos!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredArticles = useMemo(() => {
    return CONSTITUTION_DATA.filter((item) => {
      // Filtro de búsqueda
      const matchesSearch =
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.application.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoría o situación
      let matchesCategory = true;
      if (selectedCategory === 'Mis Guardados') {
        matchesCategory = savedIds.includes(item.id);
      } else if (filterType === 'category' && selectedCategory !== 'Todos') {
        matchesCategory = item.category === selectedCategory;
      } else if (filterType === 'situation' && selectedCategory !== 'Todas') {
        // Extraer el texto después del primer espacio (donde termina el emoji)
        const situationText = selectedCategory.includes(' ') ? selectedCategory.split(' ').slice(1).join(' ') : selectedCategory;
        matchesCategory = item.lifeSituation?.some(s => s === situationText);
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, savedIds, filterType]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'} font-sans ${darkMode ? 'text-slate-100' : 'text-slate-800'} pb-20 relative transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-500 to-blue-600 text-white pb-12 pt-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Top bar con modo oscuro */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <Sun className="w-10 h-10 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Constitución Ciudadana</h1>
            <p className="text-sky-100 text-lg">Tu guía práctica de derechos y garantías en la vida diaria.</p>

            {/* Sistema de Pestañas */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'articles'
                  ? 'bg-white text-sky-600 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                <Search className="w-4 h-4" />
                Artículos Clave
              </button>
              <button
                onClick={() => setActiveTab('fulltext')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'fulltext'
                  ? 'bg-white text-sky-600 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                <BookText className="w-4 h-4" />
                Texto Completo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container - overlaps header */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 pb-12">

        {activeTab === 'fulltext' ? (
          <FullTextViewer constitutionText={constitutionText} darkMode={darkMode} />
        ) : (
          <>

            {/* Search & Filter Card */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 border transition-colors`}>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-3 border ${darkMode ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-slate-300 bg-white placeholder-slate-400'} rounded-lg leading-5 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="¿Qué problema tenés hoy? (Ej: despido, alquiler, multa...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Toggle tipo de filtro */}
              <div className={`flex items-center gap-2 mb-4 pb-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <Filter className="w-4 h-4 text-slate-500" />
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Filtrar por:</span>
                <button
                  onClick={() => {
                    setFilterType('category');
                    setSelectedCategory('Todos');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === 'category'
                    ? 'bg-sky-100 text-sky-700 border border-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Categoría
                </button>
                <button
                  onClick={() => {
                    setFilterType('situation');
                    setSelectedCategory('Todas');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === 'situation'
                    ? 'bg-sky-100 text-sky-700 border border-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Situación de Vida
                </button>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {/* Botón especial para Mis Guardados */}
                <button
                  onClick={() => setSelectedCategory('Mis Guardados')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${selectedCategory === 'Mis Guardados'
                    ? (darkMode ? 'bg-amber-900/40 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-700 border border-amber-200')
                    : (darkMode ? 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50')
                    }`}
                >
                  <Star className={`w-3 h-3 ${selectedCategory === 'Mis Guardados' ? 'fill-amber-700' : ''}`} />
                  Mis Guardados ({savedIds.length})
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                {(filterType === 'category' ? CATEGORIES : LIFE_SITUATIONS).map((cat) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat
                      ? (darkMode ? 'bg-sky-900/40 text-sky-300 border border-sky-800' : 'bg-sky-100 text-sky-700 border border-sky-200')
                      : (darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-transparent' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent')
                      }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredArticles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key="no-results"
                    className="text-center py-12 text-slate-500"
                  >
                    {selectedCategory === 'Mis Guardados' ? (
                      <>
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
                        <p className="text-lg">Todavía no tenés artículos guardados.</p>
                        <p className="text-sm">Tocá la estrella en los artículos para leerlos después.</p>
                      </>
                    ) : (
                      <>
                        <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg">No encontramos artículos relacionados.</p>
                        <p className="text-sm">Intentá con palabras como "trabajo", "familia", "libertad".</p>
                      </>
                    )}
                  </motion.div>
                ) : (
                  filteredArticles.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${expandedId === item.id ? 'ring-2 ring-sky-500/50 shadow-md' : 'hover:shadow-md'}`}
                    >
                      {/* Card Header (Always visible) */}
                      <div
                        className="p-5 cursor-pointer flex items-start justify-between"
                        onClick={() => toggleExpand(item.id)}
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-3 rounded-lg mt-1 shrink-0 transition-colors ${expandedId === item.id ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'}`}
                          >
                            {item.icon}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-bold text-sky-700">{item.article}</span>
                              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                {item.category}
                              </span>
                            </div>
                            <h3 className={`text-lg font-semibold leading-tight mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                              {item.explanation}
                            </h3>
                            {!expandedId && (
                              <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <TextWithGlossary text={item.text} darkMode={darkMode} />
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 ml-2">
                          {/* Botón de Guardar */}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => toggleSave(e, item.id)}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                            title={savedIds.includes(item.id) ? "Quitar de guardados" : "Guardar para después"}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${savedIds.includes(item.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          </motion.button>
                          <motion.div
                            animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                            className={darkMode ? 'text-slate-500' : 'text-slate-400'}
                          >
                            <ChevronDown />
                          </motion.div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-6 pt-0">
                              <hr className={`${darkMode ? 'border-slate-700' : 'border-slate-100'} my-4`} />

                              {/* Sección: Aplicación Práctica */}
                              <div className={`${darkMode ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-100'} rounded-lg p-4 mb-4 border`}>
                                <h4 className={`text-sm font-bold uppercase tracking-wide mb-2 flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                                  <Info className="w-4 h-4" />
                                  En la vida diaria
                                </h4>
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
                                  {item.application}
                                </p>
                              </div>

                              {/* Sección: Texto Original con Glosario */}
                              <div className={`${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'} rounded-lg p-4 border mb-4`}>
                                <h4 className={`text-[10px] font-bold uppercase tracking-wide mb-2 flex justify-between items-center ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                  <span>Texto Constitucional</span>
                                  <span className={`text-[10px] font-normal normal-case px-2 py-0.5 rounded ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                                    Pasá el mouse sobre el texto azul
                                  </span>
                                </h4>
                                <p className={`text-sm font-serif italic leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  "<TextWithGlossary text={item.text} darkMode={darkMode} />"
                                </p>
                              </div>

                              {/* Botón de Compartir WhatsApp */}
                              <div className="flex justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => shareOnWhatsApp(item)}
                                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Compartir en WhatsApp
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Monetization / Support */}
            <footer className={`mt-16 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-8 pb-4`}>
              <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">

                {/* Monetization Section */}
                <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border w-full`}>
                  <h4 className={`${darkMode ? 'text-slate-100' : 'text-slate-900'} font-bold mb-2 flex items-center justify-center gap-2`}>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    Apoyá este proyecto
                  </h4>
                  <p className={`text-sm mb-6 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Esta aplicación es gratuita para todos los argentinos. Si te resulta útil, considerá invitarnos un café para mantener los servidores.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      whileHover={{ scale: 1.05, backgroundColor: darkMode ? '#1e293b' : '#1e293b' }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className={`flex items-center justify-center gap-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-900'} text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors`}
                    >
                      <Coffee className="w-4 h-4" />
                      Invitar un Cafecito
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className={`flex items-center justify-center gap-2 ${darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'} border px-6 py-2.5 rounded-full font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors`}
                    >
                      <FileText className="w-4 h-4" />
                      Descargar Resumen PDF (Premium)
                    </motion.a>
                  </div>
                </div>

                <div className="text-slate-400 text-xs">
                  <p>© 2024 Constitución Ciudadana. </p>
                  <p className="mt-2 text-[10px]">
                    Aviso: Esta aplicación es una herramienta educativa y de consulta rápida. No reemplaza el asesoramiento legal profesional de un abogado.
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Chat Widget */}
      <ChatWidget constitutionText={constitutionText} darkMode={darkMode} />
    </div>
  );
}
