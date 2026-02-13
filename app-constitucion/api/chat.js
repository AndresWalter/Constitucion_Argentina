import Groq from 'groq-sdk';

export const config = {
    runtime: 'edge', // Opcional: Usar Edge Functions para menor latencia, pero requiere adaptación. Usaremos serverless estándar por compatibilidad.
};

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        // Parsear el cuerpo de la request (Vercel Edge/Serverless con Request estandar)
        const { messages } = await request.json();

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 1024,
        });

        const responseContent = completion.choices[0]?.message?.content || "No se pudo obtener una respuesta.";

        return new Response(JSON.stringify({ content: responseContent }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error en API Route:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
