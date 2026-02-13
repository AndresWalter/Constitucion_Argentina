# Guía de Uso - Colores Personalizados en TailwindCSS v4

## ⚠️ Importante: Sintaxis TailwindCSS v4

En TailwindCSS v4, los colores personalizados se definen usando variables CSS en el bloque `@theme` dentro del archivo CSS, **no** en `tailwind.config.js`.

## Definición de Colores

Los colores están definidos en `src/index.css`:

```css
@theme {
  /* Colores Legal Blue */
  --color-legal-blue: #181B2E;
  --color-legal-blue-dark: #121422;
  --color-legal-blue-light: #232840;
  
  /* Colores Legal Gold */
  --color-legal-gold: #C59D71;
  --color-legal-gold-light: #D6B48D;
  --color-legal-gold-dark: #A8835D;
  
  /* Colores Legal Gray */
  --color-legal-gray: #F5F6F8;
  --color-legal-gray-text: #2D3436;
  --color-legal-gray-muted: #9DA5B4;
}
```

## Uso en Componentes

### Fondos
```jsx
<div className="bg-legal-blue">Fondo azul noche</div>
<div className="bg-legal-blue-light">Fondo azul claro</div>
<div className="bg-legal-gold">Fondo dorado</div>
<div className="bg-legal-gray">Fondo gris claro</div>
```

### Textos
```jsx
<p className="text-legal-gray-text">Texto principal</p>
<p className="text-legal-gray-muted">Texto secundario</p>
<p className="text-legal-gold">Texto dorado</p>
```

### Bordes
```jsx
<div className="border border-legal-gold">Con borde dorado</div>
<div className="border-legal-blue-light">Borde azul claro</div>
```

### Variantes
Puedes usar `/` para opacidad:
```jsx
<div className="bg-legal-gold/10">Fondo dorado 10%</div>
<div className="text-legal-blue/50">Texto azul 50%</div>
```

## Bordes Redondeados Personalizados

```jsx
<button className="rounded-pill">Botón píldora (50px)</button>
```

## Sombras Personalizadas

```jsx
<div className="shadow-card">Sombra de tarjeta</div>
```

## Paleta Completa

| Color | Variable CSS | Hex | Uso |
|-------|-------------|-----|-----|
| Legal Blue | `--color-legal-blue` | #181B2E | Headers, branding |
| Legal Blue Dark | `--color-legal-blue-dark` | #121422 | Degradados oscuros |
| Legal Blue Light | `--color-legal-blue-light` | #232840 | Tarjetas oscuras |
| Legal Gold | `--color-legal-gold` | #C59D71 | CTAs, acentos |
| Legal Gold Light | `--color-legal-gold-light` | #D6B48D | Iconos, highlights |
| Legal Gold Dark | `--color-legal-gold-dark` | #A8835D | Hover states |
| Legal Gray | `--color-legal-gray` | #F5F6F8 | Fondo app |
| Legal Gray Text | `--color-legal-gray-text` | #2D3436 | Títulos |
| Legal Gray Muted | `--color-legal-gray-muted` | #9DA5B4 | Subtítulos |
