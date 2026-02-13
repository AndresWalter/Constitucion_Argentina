# Constitución Ciudadana App

Aplicación web moderna para consultar la Constitución Nacional Argentina, con asistente IA integrado.

## Características
- **Búsqueda Inteligente**: Encuentra artículos por palabras clave o situaciones de la vida real.
- **Asistente Constitucional**: Chatbot potenciado por Groq (Llama 3) que responde dudas basándose exclusivamente en el texto constitucional.
- **Monetización Ética**: Opciones para "Cafecito" y descargas premium.
- **Favoritos**: Guarda artículos para leer después.

## Instalación
1. Clonar o descargar este repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración
- La API Key de Groq está configurada en `src/ChatWidget.jsx`.
- El texto completo de la constitución está en `src/assets/constitution.md`.

## Tecnologías
- React + Vite
- Tailwind CSS
- Groq SDK
- Lucide React (Iconos)
