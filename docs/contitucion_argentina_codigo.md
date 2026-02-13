import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Shield, Home, Briefcase, Info, ChevronDown, ChevronUp, AlertCircle, Sun, Star, Share2, MessageCircle, Bookmark } from 'lucide-react';

// --- DATA & GLOSARIO ---

const GLOSSARY = {
  "hábeas corpus": "Acción judicial urgente para recuperar la libertad física si fuiste detenido ilegalmente.",
  "amparo": "Juicio muy rápido para proteger derechos urgentes (salud, discriminación) cuando no hay tiempo para un juicio normal.",
  "expropiación": "Cuando el Estado te compra tu propiedad obligatoriamente por una necesidad pública justificada.",
  "prerrogativas": "Privilegios o ventajas especiales (de sangre o nacimiento) que tenían los nobles. En Argentina están prohibidos.",
  "fueros": "Leyes especiales que antes beneficiaban a nobles o militares. Hoy todos somos iguales ante la misma ley.",
  "censura previa": "Que el gobierno revise y prohíba una noticia u opinión antes de que se publique. Está totalmente prohibido.",
  "arbitrario": "Injusto, que depende del capricho de alguien y no de la ley o la razón.",
  "industria lícita": "Cualquier trabajo, comercio o negocio que no esté prohibido por la ley.",
  "retribución justa": "Un sueldo digno que corresponda al esfuerzo y la importancia de la tarea realizada.",
  "jornada limitada": "Derecho a tener un horario máximo de trabajo y descansos obligatorios.",
  "estabilidad": "Protección para no ser despedido sin causa justificada (derecho fuerte en empleados públicos).",
  "con fines útiles": "Asociarse para actividades que sirvan a la sociedad y no sean delito.",
  "debido proceso": "Derecho a defenderte, tener abogado y un juicio justo antes de recibir cualquier castigo."
};

const CONSTITUTION_DATA = [
  {
    id: '14',
    article: 'Artículo 14',
    category: 'Derechos Civiles',
    icon: <BookOpen className="w-5 h-5" />,
    text: 'Todos los habitantes de la Nación gozan de los siguientes derechos conforme a las leyes que reglamenten su ejercicio; a saber: de trabajar y ejercer toda industria lícita; de navegar y comerciar; de peticionar a las autoridades; de entrar, permanecer, transitar y salir del territorio argentino; de publicar sus ideas por la prensa sin censura previa; de usar y disponer de su propiedad; de asociarse con fines útiles; de profesar libremente su culto; de enseñar y aprender.',
    explanation: 'Este es el "menú principal" de tus libertades básicas. Establece que sos libre de moverte, trabajar, expresarte y aprender, siempre que respetes las leyes.',
    application: 'Si querés abrir un negocio, viajar a otra provincia, escribir una opinión en un blog o practicar tu religión, este artículo es tu respaldo legal. Nadie puede impedírtelo arbitrariamente.',
    keywords: ['libertad', 'prensa', 'transitar', 'culto', 'aprender', 'enseñar', 'comercio', 'viajar']
  },
  {
    id: '14bis',
    article: 'Artículo 14 bis',
    category: 'Trabajo y Seguridad Social',
    icon: <Briefcase className="w-5 h-5" />,
    text: 'El trabajo en sus diversas formas gozará de la protección de las leyes, las que asegurarán al trabajador: condiciones dignas y equitativas de labor; jornada limitada; descanso y vacaciones pagados; retribución justa; salario mínimo vital móvil; igual remuneración por igual tarea... protección contra el despido arbitrario; estabilidad del empleado público; organización sindical libre y democrática...',
    explanation: 'Es la columna vertebral de los derechos del trabajador. Protege al empleado frente al empleador y garantiza condiciones humanas.',
    application: 'Si te despiden sin causa (despido arbitrario), tenés derecho a una indemnización. Si tu jefe te hace trabajar 14 horas seguidas sin pagarte extras, está violando la "jornada limitada". También garantiza tus vacaciones pagas y tu derecho a unirte a un sindicato.',
    keywords: ['trabajo', 'sueldo', 'vacaciones', 'despido', 'sindicato', 'huelga', 'jubilación', 'salario']
  },
  {
    id: '16',
    article: 'Artículo 16',
    category: 'Igualdad',
    icon: <ScaleIcon className="w-5 h-5" />,
    text: 'La Nación Argentina no admite prerrogativas de sangre, ni de nacimiento: no hay en ella fueros personales ni títulos de nobleza. Todos sus habitantes son iguales ante la ley, y admisibles en los empleos sin otra condición que la idoneidad. La igualdad es la base del impuesto y de las cargas públicas.',
    explanation: 'En Argentina no hay nobles ni reyes. Todos valemos lo mismo ante un juez o el Estado. Para conseguir un empleo público, lo único que importa es tu capacidad (idoneidad).',
    application: 'Si te discriminan en una búsqueda laboral por tu apellido, género o color de piel, se viola este artículo. También implica que los impuestos deben ser justos y proporcionales.',
    keywords: ['igualdad', 'discriminación', 'empleo', 'impuestos', 'nobleza', 'idoneidad']
  },
  {
    id: '17',
    article: 'Artículo 17',
    category: 'Propiedad',
    icon: <Home className="w-5 h-5" />,
    text: 'La propiedad es inviolable, y ningún habitante de la Nación puede ser privado de ella, sino en virtud de sentencia fundada en ley. La expropiación por causa de utilidad pública, debe ser calificada por ley y previamente indemnizada... Todo autor o inventor es propietario exclusivo de su obra, invento o descubrimiento...',
    explanation: 'Tus cosas son tuyas. El Estado no puede quitártelas porque sí. Si necesita tu terreno para una obra pública (expropiación), tiene que haber una ley y deben pagarte antes.',
    application: 'Si el Estado quiere demoler tu casa para hacer una autopista, debe pagarte el valor real antes de tocarla. También protege tus derechos de autor si escribís un libro o creás un software.',
    keywords: ['propiedad', 'casa', 'expropiación', 'autor', 'invento', 'dueño']
  },
  {
    id: '18',
    article: 'Artículo 18',
    category: 'Justicia y Privacidad',
    icon: <Shield className="w-5 h-5" />,
    text: 'Ningún habitante de la Nación puede ser penado sin juicio previo... El domicilio es inviolable, como también la correspondencia epistolar y los papeles privados... Quedan abolidos para siempre la pena de muerte por causas políticas, toda especie de tormento y los azotes.',
    explanation: 'Garantiza el "debido proceso". Nadie va preso sin un juicio justo. Tu casa y tus cartas (o emails) son privados y la policía no puede entrar sin una orden de un juez.',
    application: 'Si la policía quiere entrar a tu casa a revisar, podés exigir ver la orden de allanamiento firmada por un juez. Si te acusan de algo, tenés derecho a un abogado y a defenderte antes de recibir cualquier castigo.',
    keywords: ['juicio', 'cárcel', 'policía', 'allanamiento', 'privacidad', 'cartas', 'defensa']
  },
  {
    id: '19',
    article: 'Artículo 19',
    category: 'Libertad Personal',
    icon: <Sun className="w-5 h-5" />,
    text: 'Las acciones privadas de los hombres que de ningún modo ofendan al orden y a la moral pública, ni perjudiquen a un tercero, están sólo reservadas a Dios, y exentas de la autoridad de los magistrados. Ningún habitante de la Nación será obligado a hacer lo que no manda la ley, ni privado de lo que ella no prohíbe.',
    explanation: 'Conocido como el "Principio de Reserva". Lo que hacés en tu intimidad, si no daña a nadie más, no es asunto del Estado ni de los jueces. Y lo más importante: Todo lo que no está prohibido, está permitido.',
    application: 'El Estado no puede decirte cómo vestirte dentro de tu casa o qué pensar. Si no hay una ley que prohíba explícitamente una actividad, sos libre de realizarla.',
    keywords: ['privacidad', 'intimidad', 'prohibido', 'ley', 'moral']
  },
  {
    id: '41',
    article: 'Artículo 41',
    category: 'Ambiente',
    icon: <LeafIcon className="w-5 h-5" />,
    text: 'Todos los habitantes gozan del derecho a un ambiente sano, equilibrado, apto para el desarrollo humano... y tienen el deber de preservarlo. El daño ambiental generará prioritariamente la obligación de recomponer...',
    explanation: 'Tenés derecho a vivir en un lugar no contaminado. Pero también tenés la obligación de cuidarlo. Si alguien contamina, tiene que arreglar el daño.',
    application: 'Si una fábrica está tirando desechos tóxicos al río de tu barrio, podés denunciarlo basándote en este artículo. Las autoridades están obligadas a intervenir.',
    keywords: ['ambiente', 'ecología', 'contaminación', 'residuos', 'sano']
  },
  {
    id: '42',
    article: 'Artículo 42',
    category: 'Consumidores',
    icon: <ShoppingCartIcon className="w-5 h-5" />,
    text: 'Los consumidores y usuarios de bienes y servicios tienen derecho, en la relación de consumo, a la protección de su salud, seguridad e intereses económicos; a una información adecuada y veraz; a la libertad de elección y a condiciones de trato equitativo y digno...',
    explanation: 'Protege a quienes compran productos o contratan servicios. Exige que no te mientan sobre lo que comprás y que te traten con respeto.',
    application: 'Si comprás un electrodoméstico fallado y no te reconocen la garantía, o si una empresa de teléfono te cobra cosas que no pediste, este artículo te ampara. También obliga a que las etiquetas de los alimentos digan la verdad.',
    keywords: ['consumidor', 'compra', 'garantía', 'información', 'servicios', 'estafa']
  },
  {
    id: '43',
    article: 'Artículo 43',
    category: 'Garantías Urgentes',
    icon: <AlertCircle className="w-5 h-5" />,
    text: 'Toda persona puede interponer acción expedita y rápida de amparo... contra todo acto u omisión de autoridades públicas o de particulares, que en forma actual o inminente lesione, restrinja, altere o amenace... derechos y garantías... Hábeas corpus...',
    explanation: 'Crea herramientas rápidas (Amparo y Hábeas Corpus) para cuando no hay tiempo para un juicio largo. El amparo es para derechos generales y el hábeas corpus para la libertad física.',
    application: 'Si una obra social se niega a cubrirte un medicamento urgente, presentás un "Amparo". Si detienen a un familiar ilegalmente y no sabés dónde está, presentás un "Hábeas Corpus" para que un juez averigüe inmediatamente su paradero.',
    keywords: ['amparo', 'habeas corpus', 'urgencia', 'salud', 'detención', 'medicamento']
  }
];

// --- COMPONENTES AUXILIARES ---

function ScaleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
  );
}

function LeafIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  );
}

// Componente para resaltar términos del glosario con Tooltip
const TextWithGlossary = ({ text }) => {
  if (!text) return null;
  
  // Ordenamos las claves del glosario por longitud (descendente) para matchear las frases más largas primero
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const termLower = part.toLowerCase();
        if (GLOSSARY[termLower]) {
          return (
            <span key={index} className="group relative inline-block cursor-help text-sky-700 font-semibold border-b border-dashed border-sky-400">
              {part}
              {/* Tooltip */}
              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg z-10 text-center shadow-lg pointer-events-none">
                {GLOSSARY[termLower]}
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </span>
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

const CATEGORIES = ['Todos', 'Derechos Civiles', 'Trabajo y Seguridad Social', 'Justicia y Privacidad', 'Propiedad', 'Igualdad', 'Ambiente', 'Consumidores'];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedId, setExpandedId] = useState(null);
  
  // Estado para marcadores (Favoritos)
  // Intentamos leer de localStorage para persistencia básica
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('savedConstitucion');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambian los favoritos
  useEffect(() => {
    localStorage.setItem('savedConstitucion', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (e, id) => {
    e.stopPropagation(); // Evita que se abra/cierre la tarjeta al hacer click en la estrella
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  const shareOnWhatsApp = (item) => {
    const message = `🏛️ *Constitución Ciudadana*\n\n📌 *${item.article}:* ${item.explanation}\n\n💡 *En la vida diaria:* ${item.application}\n\n👉 ¡Conocé tus derechos!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredArticles = useMemo(() => {
    return CONSTITUTION_DATA.filter((item) => {
      // Filtro de búsqueda
      const matchesSearch = 
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.application.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de categoría
      let matchesCategory = true;
      if (selectedCategory === 'Mis Guardados') {
        matchesCategory = savedIds.includes(item.id);
      } else if (selectedCategory !== 'Todos') {
        matchesCategory = item.category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, savedIds]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-500 to-blue-600 text-white pb-12 pt-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Sun className="w-10 h-10 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Constitución Ciudadana</h1>
          <p className="text-sky-100 text-lg">Tu guía práctica de derechos y garantías en la vida diaria.</p>
        </div>
      </header>

      {/* Main Content Container - overlaps header */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 pb-12">
        
        {/* Search & Filter Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="¿Qué problema tenés hoy? (Ej: despido, alquiler, multa...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Botón especial para Mis Guardados */}
            <button
               onClick={() => setSelectedCategory('Mis Guardados')}
               className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                 selectedCategory === 'Mis Guardados'
                   ? 'bg-amber-100 text-amber-700 border border-amber-200'
                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
               }`}
            >
              <Star className={`w-3 h-3 ${selectedCategory === 'Mis Guardados' ? 'fill-amber-700' : ''}`} />
              Mis Guardados ({savedIds.length})
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-100 text-sky-700 border border-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {selectedCategory === 'Mis Guardados' ? (
                 <>
                   <Star className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
                   <p className="text-lg">Todavía no tenés artículos guardados.</p>
                   <p className="text-sm">Tocá la estrella en los artículos para leerlos después.</p>
                 </>
              ) : (
                <>
                  <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No encontramos artículos relacionados.</p>
                  <p className="text-sm">Intentá con palabras como "trabajo", "familia", "libertad".</p>
                </>
              )}
            </div>
          ) : (
            filteredArticles.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${expandedId === item.id ? 'ring-2 ring-sky-500/50' : 'hover:shadow-md'}`}
              >
                {/* Card Header (Always visible) */}
                <div 
                  className="p-5 cursor-pointer flex items-start justify-between"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg mt-1 shrink-0 ${expandedId === item.id ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sky-700">{item.article}</span>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 leading-tight mb-2">
                        {item.explanation}
                      </h3>
                      {!expandedId && (
                        <p className="text-sm text-slate-500 line-clamp-2">
                          <TextWithGlossary text={item.text} />
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 ml-2">
                    {/* Botón de Guardar */}
                    <button 
                      onClick={(e) => toggleSave(e, item.id)}
                      className="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                      title={savedIds.includes(item.id) ? "Quitar de guardados" : "Guardar para después"}
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${savedIds.includes(item.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                      />
                    </button>
                    <div className="text-slate-400">
                      {expandedId === item.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="px-5 pb-6 pt-0 animate-fadeIn">
                    <hr className="border-slate-100 my-4" />
                    
                    {/* Sección: Aplicación Práctica */}
                    <div className="bg-emerald-50 rounded-lg p-4 mb-4 border border-emerald-100">
                      <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        En la vida diaria
                      </h4>
                      <p className="text-emerald-900 text-sm leading-relaxed">
                        {item.application}
                      </p>
                    </div>

                    {/* Sección: Texto Original con Glosario */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex justify-between items-center">
                        <span>Texto Constitucional</span>
                        <span className="text-[10px] font-normal normal-case bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                          Pasá el mouse sobre el texto azul
                        </span>
                      </h4>
                      <p className="text-slate-600 text-sm font-serif italic leading-relaxed">
                        "<TextWithGlossary text={item.text} />"
                      </p>
                    </div>

                    {/* Botón de Compartir WhatsApp */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => shareOnWhatsApp(item)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Compartir en WhatsApp
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <footer className="mt-12 text-center text-slate-400 text-xs">
          <p>© 2024 Constitución Ciudadana. </p>
          <p className="mt-2 mx-auto max-w-lg">
            Aviso: Esta aplicación es una herramienta educativa y de consulta rápida. No reemplaza el asesoramiento legal profesional de un abogado.
          </p>
        </footer>
      </main>
    </div>
  );
}