import React from 'react';

export default function AppTest() {
    return (
        <div className="min-h-screen bg-legal-gray flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-legal-gray-text mb-4">
                    Constitución Nacional Argentina
                </h1>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-legal-gold flex items-center justify-center">
                    <span className="text-white text-2xl">⚖️</span>
                </div>
                <p className="text-legal-gray-muted">
                    Sistema de Consulta Legal
                </p>
                <button className="mt-6 px-6 py-3 bg-legal-gold text-white rounded-pill hover:bg-legal-gold-dark transition-colors">
                    Comenzar
                </button>
            </div>
        </div>
    );
}
