import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    BookText,
    Type,
    Columns,
    ArrowRight,
    Menu,
    X,
    Bookmark,
    Minus,
    Plus,
    Maximize2,
    Minimize2
} from 'lucide-react';

export default function FullTextViewer({ constitutionText, darkMode }) {
    // ESTADOS
    const [fontSize, setFontSize] = useState(16);
    const [isTwoColumns, setIsTwoColumns] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isFocusMode, setIsFocusMode] = useState(false);

    // PARSER MEJORADO
    const parsedSections = useMemo(() => {
        if (!constitutionText) return [];

        // Limpieza de caracteres y prefijos de markdown crudo
        const cleanLines = constitutionText
            .split('\n')
            .map(line => line.replace(/^>\s?/, '').trim());

        const sections = [];
        let currentSection = { id: 'intro', title: 'Inicio', content: [] };

        cleanLines.forEach((line) => {
            // Saltos de línea vacíos (preservar estructura de párrafos)
            if (!line) {
                if (currentSection.content.length > 0 && currentSection.content[currentSection.content.length - 1] !== '') {
                    currentSection.content.push('');
                }
                return;
            }

            // Detectar Títulos principales (<u>...)
            if (line.startsWith('<u>') || line.includes('**<u>')) {
                const title = line.replace(/[*_<u>/]/g, '').trim();
                if (currentSection.content.length > 0 || currentSection.id !== 'intro') {
                    sections.push(currentSection);
                }
                currentSection = {
                    id: `section-${sections.length}`,
                    title,
                    type: 'header',
                    content: []
                };
            }
            // Detectar Artículos
            else if (line.match(/^ARTÍCULO\s\d+/)) {
                if (currentSection.content.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = {
                    id: `art-${line.match(/\d+/)[0]}`,
                    title: line.split('.')[0],
                    type: 'article',
                    content: [line]
                };
            }
            else {
                currentSection.content.push(line);
            }
        });

        if (currentSection.content.length > 0) {
            sections.push(currentSection);
        }

        return sections;
    }, [constitutionText]);

    // SCROLL SPY & PROGRESS
    useEffect(() => {
        const handleScroll = () => {
            // Calcular progreso
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setReadingProgress(scrolled);

            // Scroll Spy
            const sectionElements = parsedSections.map(s => document.getElementById(s.id));
            const current = sectionElements.find(el => {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.top <= 200;
            });
            if (current) setActiveSectionId(current.id);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [parsedSections]);

    // CONTROLES
    const adjustFontSize = (delta) => {
        setFontSize(prev => Math.min(Math.max(prev + delta, 12), 24));
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsSidebarOpen(false);
    };

    return (
        <div className={`relative min-h-screen transition-all duration-300 ${isFocusMode ? (darkMode ? 'bg-slate-900' : 'bg-slate-50') : ''}`}>
            {/* BARRA DE PROGRESO */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-100 dark:bg-slate-800">
                <div
                    className="h-full bg-sky-500 transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* CONTROLES FLOTANTES SUPERIORES */}
            <div className={`sticky top-0 z-[55] w-full px-4 py-3 transition-all duration-300 ${readingProgress > 2 ? (darkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200') + ' backdrop-blur-md shadow-sm border-b' : 'bg-transparent'}`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className={`hidden md:inline text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            {activeSectionId.startsWith('art') ? 'Artículo Seleccionado' : 'Sección Actual'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Font Size */}
                        <div className={`flex items-center border rounded-lg overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                            <button onClick={() => adjustFontSize(-2)} className={`p-2 transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-50 text-slate-500'}`}><Minus className="w-4 h-4" /></button>
                            <div className={`px-3 py-1 flex items-center gap-1 border-x ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                <Type className="w-4 h-4 text-slate-400" />
                                <span className={`text-xs font-bold w-4 text-center ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{fontSize}</span>
                            </div>
                            <button onClick={() => adjustFontSize(2)} className={`p-2 transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-50 text-slate-500'}`}><Plus className="w-4 h-4" /></button>
                        </div>

                        {/* Columns Toggle (Desktop only) */}
                        <button
                            onClick={() => setIsTwoColumns(!isTwoColumns)}
                            className={`hidden md:flex p-2 rounded-lg transition-colors items-center gap-2 ${isTwoColumns ? 'bg-sky-600/20 text-sky-400' : (darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                            title="Modo Lectura (Columnas)"
                        >
                            <Columns className="w-5 h-5" />
                        </button>

                        {/* Focus Mode */}
                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`p-2 rounded-lg transition-colors ${isFocusMode ? 'bg-amber-600/20 text-amber-400' : (darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                            title="Modo Enfoque"
                        >
                            {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row relative">
                {/* SIDEBAR (TOC) */}
                <aside className={`
                    fixed lg:sticky top-[60px] lg:top-[120px] left-0 h-[calc(100vh-60px)] lg:h-[calc(100vh-140px)]
                    w-72 z-50 transition-transform duration-300 border-r lg:border-none
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white lg:bg-transparent'}
                    overflow-y-auto p-6 scrollbar-hide
                `}>
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <h3 className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Índice</h3>
                        <button onClick={() => setIsSidebarOpen(false)} className={darkMode ? 'text-slate-400' : 'text-slate-600'}><X className="w-6 h-6" /></button>
                    </div>

                    <div className="space-y-1">
                        {parsedSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                                    ${activeSectionId === section.id
                                        ? 'bg-sky-600 text-white shadow-md font-medium'
                                        : (darkMode ? 'text-slate-500 hover:bg-slate-800 hover:text-sky-400' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700')}
                                    ${section.type === 'header' ? 'font-bold mt-4' : 'pl-6'}
                                `}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className={`flex-1 p-4 md:p-10 transition-all duration-500 ${isFocusMode ? 'max-w-3xl mx-auto' : ''}`}>
                    <div className={`
                        prose ${darkMode ? 'prose-invert' : ''} prose-slate max-w-none font-serif leading-relaxed
                        ${isTwoColumns && !isFocusMode ? 'md:columns-2 md:gap-12' : ''}
                        ${darkMode ? 'text-slate-300' : 'text-slate-700'}
                    `} style={{ fontSize: `${fontSize}px` }}>

                        {parsedSections.map((section, idx) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className={`
                                    mb-12 p-6 rounded-2xl transition-all duration-500
                                    ${activeSectionId === section.id && isFocusMode ? (darkMode ? 'bg-slate-800 shadow-2xl ring-1 ring-slate-700' : 'bg-white shadow-xl ring-1 ring-slate-100') + ' scale-[1.02] z-10' : 'opacity-80 grayscale-[0.5]'}
                                    ${activeSectionId === section.id && !isFocusMode ? 'opacity-100 grayscale-0' : ''}
                                `}
                            >
                                {section.type === 'header' ? (
                                    <div className={`mb-6 pb-2 border-b-2 ${darkMode ? 'border-sky-900' : 'border-sky-200'}`}>
                                        <h2 className="text-sky-600 dark:text-sky-400 font-sans font-black mb-0 uppercase tracking-tight" style={{ fontSize: `${fontSize * 1.5}px` }}>
                                            {section.title}
                                        </h2>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 items-start mb-6">
                                        <div className={`p-2.5 rounded-xl mt-1 shadow-sm ${darkMode ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>
                                            <Bookmark className={`w-5 h-5 ${darkMode ? 'fill-sky-400/20' : 'fill-sky-700/10'}`} />
                                        </div>
                                        <h3 className={`font-sans font-bold m-0 tracking-tight leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontSize: `${fontSize * 1.3}px` }}>
                                            {section.title}
                                        </h3>
                                    </div>
                                )}

                                <div className={`space-y-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {section.content.map((text, tidx) => text ? (
                                        <p key={tidx} className={`
                                            ${text.match(/^ARTÍCULO/) ? (darkMode ? 'font-bold text-slate-100 text-lg border-l-4 border-sky-500 pl-4 py-1 my-6' : 'font-bold text-slate-900 text-lg border-l-4 border-sky-600 pl-4 py-1 my-6') : ''} 
                                            leading-relaxed text-justify hyphens-auto
                                        `}>
                                            {text.replace(/^ARTÍCULO\s\d+\.-/, '').trim()}
                                        </p>
                                    ) : <div key={tidx} className="h-4" />)}
                                </div>

                                {/* NAVEGACION MINI */}
                                {idx < parsedSections.length - 1 && (
                                    <div className={`flex justify-end mt-8 pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <button
                                            onClick={() => scrollToSection(parsedSections[idx + 1].id)}
                                            className="flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-400 transition-colors uppercase tracking-widest"
                                        >
                                            Siguiente: {parsedSections[idx + 1].title.substring(0, 20)}... <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </main>
            </div>

            {/* BOTON FLOTANTE TOC (Móvil) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed bottom-6 left-6 lg:hidden z-[70] bg-sky-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
                <BookText className="w-6 h-6" />
            </button>
        </div>
    );
}
