import React, { useState } from 'react';
import { Home, FileText, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from './components/ui/Card';
import { SearchBar } from './components/ui/SearchBar';

export default function AppModern() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const featuredSections = [
        {
            id: 1,
            title: 'Derechos y Garantías',
            description: 'Artículos 1 al 35',
            icon: <FileText className="w-6 h-6" />
        },
        {
            id: 2,
            title: 'Autoridades Nacionales',
            description: 'Artículos 44 al 129',
            icon: <FileText className="w-6 h-6" />
        },
        {
            id: 3,
            title: 'Preámbulo Histórico',
            description: 'Texto Original',
            icon: <FileText className="w-6 h-6" />
        },
        {
            id: 4,
            title: 'Nuevos Derechos',
            description: 'Reforma de 1994',
            icon: <FileText className="w-6 h-6" />
        }
    ];

    const recentArticles = [
        { title: 'Art. 14 bis', subtitle: 'Derechos del trabajador y seguridad social' },
        { title: 'Art. 75, Inciso 22', subtitle: 'Jerarquía de Tratados Internacionales' },
        { title: 'Art. 41', subtitle: 'Derecho a un ambiente sano' }
    ];

    return (
        <div className="min-h-screen bg-legal-gray font-sans">
            {/* Header con gradiente Azul Noche */}
            <header className="bg-gradient-to-br from-legal-blue via-legal-blue-light to-legal-blue-dark text-white relative overflow-hidden">
                {/* Gradiente sutil para profundidad */}
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
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                                </svg>
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
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar artículos, derechos, garantías..."
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 -mt-6 pb-12">
                {/* Secciones Destacadas */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-legal-gray-text mb-6">
                        Secciones Destacadas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featuredSections.map((section) => (
                            <motion.div
                                key={section.id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card className="cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full bg-legal-gold/10 text-legal-gold group-hover:bg-legal-gold group-hover:text-white transition-all">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="group-hover:text-legal-gold transition-colors">
                                                {section.title}
                                            </CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
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
                        Actividad Reciente
                    </h2>
                    <Card>
                        <div className="space-y-4">
                            {recentArticles.map((article, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="pb-4 last:pb-0 border-b last:border-b-0 border-legal-gray hover:bg-legal-gray/30 -mx-6 px-6 py-3 transition-colors cursor-pointer"
                                >
                                    <h4 className="font-semibold text-legal-gray-text mb-1">
                                        {article.title}
                                    </h4>
                                    <p className="text-sm text-legal-gray-muted">
                                        {article.subtitle}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </section>
            </main>

            {/* Bottom Navigation - Flotante */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-legal-blue rounded-[30px] shadow-2xl px-6 py-3 flex items-center gap-6 border border-legal-gold/20">
                    <button className="flex flex-col items-center gap-1 text-legal-gold">
                        <Home size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Inicio</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <FileText size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Artículos</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <Heart size={20} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Favoritos</span>
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
                            <h3 className="text-2xl font-bold text-legal-gray-text mb-6">Menú</h3>
                            {/* Contenido del menú */}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
