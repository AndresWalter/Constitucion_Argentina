import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Lightbulb } from 'lucide-react';
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
        { role: 'assistant', content: '¡Hola! Soy tu asistente constitucional. Preguntame cualquier duda sobre la Constitución Argentina.' }
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
            Responde brevemente basándote en:
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
        // Simular submit programático
        const fakeEvent = { preventDefault: () => { } };
        setTimeout(() => {
            handleSubmit(fakeEvent);
        }, 100);
    };

    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border w-80 md:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-sm">Asistente Constitucional</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-sky-600 text-white rounded-br-none'
                                        : (darkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-800 border border-slate-200') + ' rounded-bl-none'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Preguntas Sugeridas (solo si no hay conversación) */}
                        {messages.length === 1 && !isLoading && (
                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    <span>Preguntas frecuentes:</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {SUGGESTED_QUESTIONS.slice(0, 4).map((sq, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => sendSuggestedQuestion(sq.question)}
                                            className={`text-left border rounded-lg p-2.5 text-xs transition-colors flex items-center gap-2 ${darkMode
                                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-sky-800 hover:text-sky-300'
                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700'
                                                }`}
                                        >
                                            <span className="text-base">{sq.emoji}</span>
                                            <span>{sq.question}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-500'} p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-sm`}>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Consultando constitución...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className={`p-3 border-t flex gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            className={`flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                                }`}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-slate-700' : 'bg-sky-600 hover:bg-sky-700'} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}
