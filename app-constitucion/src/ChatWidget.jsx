import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Lightbulb, Bot, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { SUGGESTED_QUESTIONS } from './data';
const isProduction = import.meta.env.PROD;

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || "dummy",
    dangerouslyAllowBrowser: true
});

export default function ChatWidget({ constitutionText, darkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy tu asistente constitucional inteligente. ¿En qué puedo ayudarte a entender tus derechos hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let content = "";
            const truncated = constitutionText ? constitutionText.substring(0, 25000) : "";

            if (isProduction) {
                const systemMessage = {
                    role: "system",
                    content: `Eres un asistente experto en la Constitución Nacional Argentina. 
            Responde brevemente basándote en:
            ${truncated}...`
                };

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [systemMessage, ...messages, userMessage] })
                });
                if (!response.ok) throw new Error('Error en la API');
                const data = await response.json();
                content = data.content;
            } else {
                console.log("Enviando a Groq (llama-3.3-70b-versatile)...");
                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `Eres un asistente experto en la Constitución Nacional Argentina. 
            Responde de manera educativa, clara y concisa basándote en:
            ${truncated}...`
                        },
                        ...messages,
                        userMessage
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    max_tokens: 1024,
                });
                content = completion.choices[0]?.message?.content;
            }

            const assistantMessage = { role: 'assistant', content: content || "Lo siento, no pude generar una respuesta." };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Error groq:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, ocurrió un error (posible límite de API). Intenta más tarde." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendSuggestedQuestion = (question) => {
        setInput(question);
        const fakeEvent = { preventDefault: () => { } };
        setTimeout(() => {
            handleSubmit(fakeEvent);
        }, 100);
    };

    return (
        <div className="fixed bottom-36 right-5 z-[200] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`${darkMode ? 'bg-legal-blue border-white/10' : 'bg-white border-legal-gray'} rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-2 w-80 md:w-[400px] h-[600px] flex flex-col mb-6 overflow-hidden backdrop-blur-3xl ring-1 ring-black/5`}
                    >
                        {/* Header Premium */}
                        <div className="bg-gradient-to-br from-legal-blue via-legal-blue-light to-legal-blue-dark p-6 flex justify-between items-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-30" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="bg-legal-gold p-2 rounded-xl shadow-lg ring-2 ring-white/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest text-legal-gold">Asistente I.A.</h3>
                                    <p className="text-[10px] font-bold opacity-60">Consulta Constitucional Pro</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 p-2 rounded-xl transition-all active:scale-90 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${darkMode ? 'bg-legal-blue-dark/50' : 'bg-legal-gray/30'}`}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[90%] rounded-[24px] p-4 text-sm font-medium leading-relaxed ${msg.role === 'user'
                                            ? 'bg-legal-gold text-white rounded-br-none shadow-[0_10px_20px_rgba(197,157,113,0.3)]'
                                            : (darkMode ? 'bg-legal-blue text-slate-100 border border-white/10 shadow-xl' : 'bg-white text-legal-gray-text border border-legal-gray shadow-md') + ' rounded-bl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Preguntas Sugeridas */}
                            {messages.length === 1 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-4 space-y-3"
                                >
                                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-legal-gold/80' : 'text-legal-gray-muted'}`}>
                                        <Lightbulb className="w-4 h-4" />
                                        <span>Consultas frecuentes:</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {SUGGESTED_QUESTIONS.slice(0, 4).map((sq, idx) => (
                                            <motion.button
                                                whileHover={{ x: 8, backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(197,157,113,0.05)' }}
                                                whileTap={{ scale: 0.98 }}
                                                key={idx}
                                                onClick={() => sendSuggestedQuestion(sq.question)}
                                                className={`text-left border-2 rounded-2xl p-4 text-xs font-bold transition-all flex items-center gap-3 ${darkMode
                                                    ? 'bg-legal-blue border-white/5 text-slate-300 hover:border-legal-gold/30'
                                                    : 'bg-white border-legal-gray text-legal-gray-text hover:border-legal-gold/30'
                                                    }`}
                                            >
                                                <span className="text-xl bg-legal-gold/10 p-2 rounded-xl">{sq.emoji}</span>
                                                <span className="leading-tight">{sq.question}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className={`${darkMode ? 'bg-legal-blue text-slate-300' : 'bg-white text-legal-gray-muted'} p-4 rounded-[20px] rounded-bl-none shadow-lg flex items-center gap-3 text-xs font-black uppercase tracking-widest ring-1 ring-legal-gold/20`}>
                                        <Loader2 className="w-4 h-4 animate-spin text-legal-gold" />
                                        <span>Consultando leyes...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSubmit}
                            className={`p-6 border-t-2 flex gap-3 ${darkMode ? 'bg-legal-blue border-white/5' : 'bg-white border-legal-gray'}`}
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu consulta legal..."
                                className={`flex-1 border-2 rounded-[20px] px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-legal-gold/20 focus:border-legal-gold transition-all ${darkMode ? 'bg-legal-blue-dark border-white/10 text-white placeholder-slate-600' : 'bg-legal-gray border-legal-gray text-legal-gray-text placeholder-slate-400'
                                    }`}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-legal-gold hover:bg-legal-gold-dark text-white p-4 rounded-[20px] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_10px_20px_rgba(197,157,113,0.3)] active:scale-90"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button Lux */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 ring-4 ring-white/10 ${isOpen ? 'bg-legal-blue-dark' : 'bg-legal-gold hover:bg-legal-gold-dark'}`}
            >
                {isOpen ? <X className="w-8 h-8 text-white" /> : <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />}
                {!isOpen && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full border-4 border-white animate-bounce" />
                )}
            </motion.button>
        </div>
    );
}
