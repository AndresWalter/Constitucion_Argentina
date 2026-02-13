# Constitución Nacional Argentina - App Moderna

## 🎨 Diseño

Esta aplicación utiliza una identidad visual premium enfocada en el sector legal:

### Paleta de Colores
- **Azul Noche** (`#181B2E`): Color principal para headers y branding
- **Dorado Premium** (`#C59D71`): Acentos, botones CTA y elementos destacados
- **Gris Claro** (`#F5F6F8`): Fondo de contenido para lectura
- **Textos**: `#2D3436` (títulos), `#9DA5B4` (secundario)

### Tipografía
- **Sans-serif**: Inter & Poppins (UI, botones, navegación)
- **Serif**: Merriweather (contenido legal, artículos)

### Componentes Reutilizables
- **Button**: Botones con bordes redondeados tipo "píldora" (50px)
- **Card**: Tarjetas con sombras suaves y efectos hover
- **SearchBar**: Barra de búsqueda con efecto glassmorphism

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📦 Estructura del Proyecto

```
src/
├── components/
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── SearchBar.jsx
├── lib/
│   └── utils.js
├── App.jsx (Versión original)
├── AppModern.jsx (Nueva versión con diseño premium)
└── main.jsx
```

## 🎯 Características Planificadas

- [ ] Sistema de Favoritos (localStorage)
- [ ] Lectura por Voz (TTS - Web Speech API)
- [ ] Copiar Texto con feedback
- [ ] Disclaimer Legal al inicio
- [ ] Política de Privacidad
- [ ] Integración con Capacitor (Android)
- [ ] Publicidad (AdMob)

## 📱 Próximos Pasos

1. Configurar Capacitor para Android (API 36)
2. Implementar funcionalidades offline
3. Añadir sistema de favoritos
4. Integrar TTS para lectura de artículos
5. Crear disclaimers y políticas legales
