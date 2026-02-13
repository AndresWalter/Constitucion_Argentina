# **🏛️ Constitución Ciudadana**

**Constitución Ciudadana** es una aplicación web interactiva diseñada para reducir la brecha entre el texto legal de la Constitución Nacional Argentina y la vida cotidiana de las personas.

La aplicación permite a los usuarios buscar problemas diarios (como "despido", "alquiler", "policía") y obtener los artículos constitucionales correspondientes, "traducidos" a un lenguaje claro y con ejemplos prácticos de aplicación.

## **✨ Características Principales**

* **🔍 Búsqueda Inteligente:** Filtra artículos por palabras clave, situaciones cotidianas o número de artículo.  
* **🗣️ Traducción a la Vida Real:** Cada artículo incluye una explicación simple y un apartado de "Aplicación Práctica".  
* **📖 Glosario Interactivo:** Los términos jurídicos complejos (ej. *Hábeas Corpus*, *Expropiación*) están subrayados y muestran una definición simple al pasar el cursor (tooltip).  
* **⭐ Favoritos (Persistencia de Datos):** Los usuarios pueden guardar artículos de interés. Los datos se almacenan localmente en el navegador (localStorage).  
* **📲 Compartir en Social Media:** Integración directa con WhatsApp para compartir resúmenes de derechos con un solo clic.  
* **🎨 UI/UX Moderna:** Diseño limpio, responsivo y accesible utilizando Tailwind CSS y Lucide Icons.

## **🛠️ Tecnologías Utilizadas**

* [**React**](https://reactjs.org/)**:** Librería principal para la construcción de la interfaz de usuario.  
* [**Tailwind CSS**](https://tailwindcss.com/)**:** Framework de utilidades para el estilizado rápido y responsivo.  
* [**Lucide React**](https://lucide.dev/)**:** Set de iconos ligero y consistente.  
* **JavaScript (ES6+):** Lógica de filtrado, manejo de estado y almacenamiento local.

## **🚀 Instalación y Uso**

Sigue estos pasos para correr el proyecto en tu entorno local:

### **Prerrequisitos**

* Node.js (v14 o superior)  
* npm o yarn

### **Pasos**

1. **Clonar el repositorio** (o descargar los archivos):  
   git clone \[https://github.com/tu-usuario/constitucion-ciudadana.git\](https://github.com/tu-usuario/constitucion-ciudadana.git)  
   cd constitucion-ciudadana

2. **Instalar dependencias:**  
   npm install  
   \# o si usas yarn  
   yarn install

   *Asegúrate de instalar las dependencias clave:* npm install lucide-react  
3. **Iniciar el servidor de desarrollo:**  
   npm start

4. **Abrir en el navegador:**  
   Visita http://localhost:3000 para ver la aplicación.

## **📂 Estructura del Proyecto**

Actualmente, el proyecto sigue una arquitectura simplificada (Single File Component) para facilitar la prototipación rápida, pero se recomienda la siguiente estructura para escalabilidad:

src/  
├── components/  
│   ├── ui/             \# Componentes reutilizables (Botones, Cards)  
│   └── glossary/       \# Lógica del glosario (TextWithGlossary)  
├── data/  
│   ├── constitution.js \# JSON con los artículos y explicaciones  
│   └── glossary.js     \# Diccionario de términos jurídicos  
├── App.jsx             \# Componente principal y lógica de estado  
└── index.css           \# Importaciones de Tailwind

## **🧠 Decisiones de Diseño (UX)**

1. **Reducción de Fricción Cognitiva:** Se evitó el lenguaje "abogado-a-abogado". El foco está en el usuario que tiene un problema urgente.  
2. **Accesibilidad:** Uso de colores de alto contraste y tooltips para explicar terminología sin obligar al usuario a salir de la app.  
3. **Viralidad:** La función de compartir en WhatsApp incluye un texto pre-formateado con emojis para facilitar la difusión de derechos.

## **🤝 Contribución**

¡Las contribuciones son bienvenidas\! Si deseas agregar más artículos o mejorar las explicaciones:

1. Haz un Fork del proyecto.  
2. Crea una rama para tu funcionalidad (git checkout \-b feature/NuevoArticulo).  
3. Haz tus cambios y commitea (git commit \-m 'Agrega Art 43').  
4. Push a la rama (git push origin feature/NuevoArticulo).  
5. Abre un Pull Request.

## **⚠️ Aviso Legal**

Esta aplicación es una **herramienta educativa y de divulgación**. La información aquí contenida no reemplaza el asesoramiento legal profesional. Ante un conflicto legal real, siempre se debe consultar a un abogado matriculado.

## **📄 Licencia**

Este proyecto está bajo la Licencia MIT \- ver el archivo [LICENSE.md](http://docs.google.com/LICENSE.md) para más detalles.

Hecho con ❤️ en Argentina.