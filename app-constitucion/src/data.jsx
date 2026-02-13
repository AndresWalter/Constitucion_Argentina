import React from 'react';
import { BookOpen, Briefcase, Scale, Home, Shield, Sun, Leaf, ShoppingCart, AlertCircle, Users, FileText, Heart } from 'lucide-react';

export const GLOSSARY = {
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

export const CONSTITUTION_DATA = [
    {
        id: '14',
        article: 'Artículo 14',
        category: 'Derechos Civiles',
        icon: <BookOpen className="w-5 h-5" />,
        text: 'Todos los habitantes de la Nación gozan de los siguientes derechos conforme a las leyes que reglamenten su ejercicio; a saber: de trabajar y ejercer toda industria lícita; de navegar y comerciar; de peticionar a las autoridades; de entrar, permanecer, transitar y salir del territorio argentino; de publicar sus ideas por la prensa sin censura previa; de usar y disponer de su propiedad; de asociarse con fines útiles; de profesar libremente su culto; de enseñar y aprender.',
        explanation: 'Este es el "menú principal" de tus libertades básicas. Establece que sos libre de moverte, trabajar, expresarte y aprender, siempre que respetes las leyes.',
        application: 'Si querés abrir un negocio, viajar a otra provincia, escribir una opinión en un blog o practicar tu religión, este artículo es tu respaldo legal. Nadie puede impedírtelo arbitrariamente.',
        keywords: ['libertad', 'prensa', 'transitar', 'culto', 'aprender', 'enseñar', 'comercio', 'viajar', 'moverse', 'religión', 'expresión', 'opinión'],
        lifeSituation: ['Educación', 'Trabajo']
    },
    {
        id: '14bis',
        article: 'Artículo 14 bis',
        category: 'Trabajo y Seguridad Social',
        icon: <Briefcase className="w-5 h-5" />,
        text: 'El trabajo en sus diversas formas gozará de la protección de las leyes, las que asegurarán al trabajador: condiciones dignas y equitativas de labor; jornada limitada; descanso y vacaciones pagados; retribución justa; salario mínimo vital móvil; igual remuneración por igual tarea... protección contra el despido arbitrario; estabilidad del empleado público; organización sindical libre y democrática...',
        explanation: 'Es la columna vertebral de los derechos del trabajador. Protege al empleado frente al empleador y garantiza condiciones humanas.',
        application: 'Si te despiden sin causa (despido arbitrario), tenés derecho a una indemnización. Si tu jefe te hace trabajar 14 horas seguidas sin pagarte extras, está violando la "jornada limitada". También garantiza tus vacaciones pagas y tu derecho a unirte a un sindicato.',
        keywords: ['trabajo', 'sueldo', 'vacaciones', 'despido', 'sindicato', 'huelga', 'jubilación', 'salario', 'echar', 'despedir', 'cesantía', 'indemnización', 'empleado', 'patrón', 'jefe'],
        lifeSituation: ['Trabajo']
    },
    {
        id: '16',
        article: 'Artículo 16',
        category: 'Igualdad',
        icon: <Scale className="w-5 h-5" />,
        text: 'La Nación Argentina no admite prerrogativas de sangre, ni de nacimiento: no hay en ella fueros personales ni títulos de nobleza. Todos sus habitantes son iguales ante la ley, y admisibles en los empleos sin otra condición que la idoneidad. La igualdad es la base del impuesto y de las cargas públicas.',
        explanation: 'En Argentina no hay nobles ni reyes. Todos valemos lo mismo ante un juez o el Estado. Para conseguir un empleo público, lo único que importa es tu capacidad (idoneidad).',
        application: 'Si te discriminan en una búsqueda laboral por tu apellido, género o color de piel, se viola este artículo. También implica que los impuestos deben ser justos y proporcionales.',
        keywords: ['igualdad', 'discriminación', 'empleo', 'impuestos', 'nobleza', 'idoneidad', 'racismo', 'sexismo', 'género', 'raza'],
        lifeSituation: ['Trabajo', 'Justicia']
    },
    {
        id: '17',
        article: 'Artículo 17',
        category: 'Propiedad',
        icon: <Home className="w-5 h-5" />,
        text: 'La propiedad es inviolable, y ningún habitante de la Nación puede ser privado de ella, sino en virtud de sentencia fundada en ley. La expropiación por causa de utilidad pública, debe ser calificada por ley y previamente indemnizada... Todo autor o inventor es propietario exclusivo de su obra, invento o descubrimiento...',
        explanation: 'Tus cosas son tuyas. El Estado no puede quitártelas porque sí. Si necesita tu terreno para una obra pública (expropiación), tiene que haber una ley y deben pagarte antes.',
        application: 'Si el Estado quiere demoler tu casa para hacer una autopista, debe pagarte el valor real antes de tocarla. También protege tus derechos de autor si escribís un libro o creás un software.',
        keywords: ['propiedad', 'casa', 'expropiación', 'autor', 'invento', 'dueño', 'vivienda', 'hogar', 'terreno', 'tierra', 'desalojar'],
        lifeSituation: ['Vivienda']
    },
    {
        id: '18',
        article: 'Artículo 18',
        category: 'Justicia y Privacidad',
        icon: <Shield className="w-5 h-5" />,
        text: 'Ningún habitante de la Nación puede ser penado sin juicio previo... El domicilio es inviolable, como también la correspondencia epistolar y los papeles privados... Quedan abolidos para siempre la pena de muerte por causas políticas, toda especie de tormento y los azotes.',
        explanation: 'Garantiza el "debido proceso". Nadie va preso sin un juicio justo. Tu casa y tus cartas (o emails) son privados y la policía no puede entrar sin una orden de un juez.',
        application: 'Si la policía quiere entrar a tu casa a revisar, podés exigir ver la orden de allanamiento firmada por un juez. Si te acusan de algo, tenés derecho a un abogado y a defenderte antes de recibir cualquier castigo.',
        keywords: ['juicio', 'cárcel', 'policía', 'allanamiento', 'privacidad', 'cartas', 'defensa', 'detención', 'arrestar', 'abogado', 'orden judicial', 'preso'],
        lifeSituation: ['Justicia']
    },
    {
        id: '18',
        article: 'Artículo 18',
        category: 'Garantías Judiciales',
        icon: <Shield className="w-5 h-5" />,
        text: 'Ningún habitante de la Nación puede ser penado sin juicio previo fundado en ley anterior al hecho del proceso, ni juzgado por comisiones especiales... Es inviolable la defensa en juicio de la persona y de los derechos. El domicilio es inviolable...',
        explanation: 'Nadie puede ir preso sin un juicio justo. Tenés derecho a un abogado y a que nadie entre a tu casa sin una orden de un juez.',
        application: 'Si la policía quiere entrar a tu casa, debe mostrarte una orden de allanamiento firmada por un juez. Si te acusan de algo, el Estado debe darte un abogado gratis si no podés pagarlo.',
        keywords: ['juicio', 'abogado', 'preso', 'cárcel', 'allanamiento', 'casa', 'policía', 'defensa'],
        lifeSituation: ['Justicia', 'Emergencias']
    },
    {
        id: '19',
        article: 'Artículo 19',
        category: 'Libertad Personal',
        icon: <Sun className="w-5 h-5" />,
        text: 'Las acciones privadas de los hombres que de ningún modo ofendan al orden y a la moral pública, ni perjudiquen a un tercero, están sólo reservadas a Dios, y exentas de la autoridad de los magistrados. Ningún habitante de la Nación será obligado a hacer lo que no manda la ley, ni privado de lo que ella no prohíbe.',
        explanation: 'Conocido como el "Principio de Reserva". Lo que hacés en tu intimidad, si no daña a nadie más, no es asunto del Estado ni de los jueces. Y lo más importante: Todo lo que no está prohibido, está permitido.',
        application: 'El Estado no puede decirte cómo vestirte dentro de tu casa o qué pensar. Si no hay una ley que prohíba explícitamente una actividad, sos libre de realizarla.',
        keywords: ['privacidad', 'intimidad', 'prohibido', 'ley', 'moral', 'permitido', 'legal', 'ilegal'],
        lifeSituation: ['Justicia']
    },
    {
        id: '20',
        article: 'Artículo 20',
        category: 'Derechos Civiles',
        icon: <BookOpen className="w-5 h-5" />,
        text: 'Los extranjeros gozan en el territorio de la Nación de todos los derechos civiles del ciudadano; pueden ejercer su industria, comercio y profesión; poseer bienes raíces, comprarlos y enajenarlos; navegar los ríos y costas; ejercer libremente su culto; testar y casarse conforme a las leyes.',
        explanation: 'En Argentina, los extranjeros tienen los mismos derechos civiles que los argentinos. No hace falta ser ciudadano para trabajar, comprar una casa o casarse.',
        application: 'Si sos extranjero, podés abrir una cuenta bancaria, alquilar un departamento o trabajar legalmente. No te pueden cobrar impuestos extra solo por no ser argentino.',
        keywords: ['extranjero', 'turista', 'migrante', 'derechos', 'trabajar', 'casarse', 'comprar', 'propiedad'],
        lifeSituation: ['Justicia', 'Trabajo']
    },
    {
        id: '28',
        article: 'Artículo 28',
        category: 'Garantías',
        icon: <Scale className="w-5 h-5" />,
        text: 'Los principios, garantías y derechos reconocidos en los anteriores artículos, no podrán ser alterados por las leyes que reglamenten su ejercicio.',
        explanation: 'Las leyes pueden regular cómo se ejercen tus derechos, pero no pueden "anularlos" o cambiarlos tanto que dejen de existir.',
        application: 'Si una ley dice que tenés derecho a protestar pero pone tantas condiciones que en la práctica es imposible hacerlo, esa ley es inconstitucional porque altera el derecho base.',
        keywords: ['ley', 'derechos', 'límite', 'regulación', 'inconstitucional'],
        lifeSituation: ['Justicia']
    },
    {
        id: '37',
        article: 'Artículo 37',
        category: 'Derechos Políticos',
        icon: <Shield className="w-5 h-5" />,
        text: 'Esta Constitución garantiza el pleno ejercicio de los derechos políticos... El sufragio es universal, igual, secreto y obligatorio. La igualdad real de oportunidades entre varones y mujeres para el acceso a cargos electivos y partidarios se garantizará...',
        explanation: 'Garantiza el derecho a votar y a ser votado. Asegura que hombres y mujeres tengan las mismas chances de ocupar cargos políticos.',
        application: 'Nadie puede obligarte a decir por quién votaste (voto secreto). Si querés postularte para un cargo público, la ley debe asegurar que haya cupos o paridad de género para que la competencia sea justa.',
        keywords: ['voto', 'elecciones', 'mujer', 'política', 'partido', 'sufragio', 'votar'],
        lifeSituation: ['Justicia', 'Participación']
    },
    {
        id: '38',
        article: 'Artículo 38',
        category: 'Derechos Políticos',
        icon: <Users className="w-5 h-5" />,
        text: 'Los partidos políticos son instituciones fundamentales del sistema democrático... El Estado contribuye al sostenimiento económico de sus actividades... deberán dar publicidad del origen y destino de sus fondos...',
        explanation: 'Los partidos políticos son necesarios para la democracia. El Estado los ayuda con plata, pero ellos tienen que contar de dónde sacan el resto del dinero.',
        application: 'Cualquier ciudadano puede saber quién financió la campaña de un político. Los partidos deben ser transparentes con sus gastos.',
        keywords: ['partido', 'política', 'plata', 'fondos', 'democracia', 'campaña'],
        lifeSituation: ['Participación']
    },
    {
        id: '39',
        article: 'Artículo 39',
        category: 'Derechos Políticos',
        icon: <FileText className="w-5 h-5" />,
        text: 'Los ciudadanos tienen el derecho de iniciativa para presentar proyectos de ley en la Cámara de Diputados. El Congreso deberá darles expreso tratamiento dentro del término de doce meses.',
        explanation: 'No hace falta ser diputado para proponer una ley. Si juntas suficientes firmas, el Congreso está obligado a tratar tu propuesta.',
        application: 'Si vos y tus vecinos tienen una idea para mejorar el país, pueden redactar un proyecto de ley y, si consiguen el apoyo necesario del padrón, el Congreso no puede ignorarlo.',
        keywords: ['ley', 'proyecto', 'firmas', 'ciudadano', 'proponer', 'iniciativa'],
        lifeSituation: ['Participación']
    },
    {
        id: '41',
        article: 'Artículo 41',
        category: 'Ambiente',
        icon: <Leaf className="w-5 h-5" />,
        text: 'Todos los habitantes gozan del derecho a un ambiente sano, equilibrado, apto para el desarrollo humano... y tienen el deber de preservarlo. El daño ambiental generará prioritariamente la obligación de recomponer...',
        explanation: 'Tenés derecho a vivir en un lugar no contaminado. Pero también tenés la obligación de cuidarlo. Si alguien contamina, tiene que arreglar el daño.',
        application: 'Si una fábrica está tirando desechos tóxicos al río de tu barrio, podés denunciarlo basándote en este artículo. Las autoridades están obligadas a intervenir.',
        keywords: ['ambiente', 'ecología', 'contaminación', 'residuos', 'sano', 'basura', 'polución', 'naturaleza', 'verde'],
        lifeSituation: ['Ambiente']
    },
    {
        id: '42',
        article: 'Artículo 42',
        category: 'Consumidores',
        icon: <ShoppingCart className="w-5 h-5" />,
        text: 'Los consumidores y usuarios de bienes y servicios tienen derecho, en la relación de consumo, a la protección de su salud, seguridad e intereses económicos; a una información adecuada y veraz; a la libertad de elección y a condiciones de trato equitativo y digno...',
        explanation: 'Protege a quienes compran productos o contratan servicios. Exige que no te mientan sobre lo que comprás y que te traten con respeto.',
        application: 'Si comprás un electrodoméstico fallado y no te reconoceren la garantía, o si una empresa de teléfono te cobra cosas que no pediste, este artículo te ampara. También obliga a que las etiquetas de los alimentos digan la verdad.',
        keywords: ['consumidor', 'compra', 'garantía', 'información', 'servicios', 'estafa', 'producto', 'defectuoso', 'engaño', 'publicidad falsa'],
        lifeSituation: ['Consumo']
    },
    {
        id: '43',
        article: 'Artículo 43',
        category: 'Garantías Urgentes',
        icon: <AlertCircle className="w-5 h-5" />,
        text: 'Toda persona puede interponer acción expedita y rápida de amparo... contra todo acto u omisión de autoridades públicas o de particulares, que en forma actual o inminente lesione, restrinja, altere o amenace... derechos y garantías... Hábeas corpus...',
        explanation: 'Crea herramientas rápidas (Amparo y Hábeas Corpus) para cuando no hay tiempo para un juicio largo. El amparo es para derechos generales y el hábeas corpus para la libertad física.',
        application: 'Si una obra social se niega a cubrirte un medicamento urgente, presentás un "Amparo". Si detienen a un familiar ilegalmente y no sabés dónde está, presentás un "Hábeas Corpus" para que un juez averigüe inmediatamente su paradero.',
        keywords: ['amparo', 'habeas corpus', 'urgencia', 'salud', 'detención', 'medicamento', 'obra social', 'hospital', 'emergencia'],
        lifeSituation: ['Salud', 'Justicia', 'Emergencias']
    },
    {
        id: '75-17',
        article: 'Artículo 75, inciso 17',
        category: 'Igualdad',
        icon: <Scale className="w-5 h-5" />,
        text: 'Reconocer la preexistencia étnica y cultural de los pueblos indígenas argentinos. Garantizar el respeto a su identidad y el derecho a una educación bilingüe e intercultural; reconocer la personería jurídica de sus comunidades, y la posesión y propiedad comunitarias de las tierras que tradicionalmente ocupan...',
        explanation: 'Reconoce oficialmente que los pueblos indígenas estaban acá antes que el Estado y protege sus tierras y su cultura.',
        application: 'Las comunidades indígenas tienen derecho a que se les devuelvan sus tierras ancestrales y a que sus hijos estudien en su propia lengua además del castellano.',
        keywords: ['indígena', 'comunidad', 'tierras', 'cultura', ' bilingüe', 'identidad', 'pueblos'],
        lifeSituation: ['Educación', 'Justicia']
    },
    {
        id: '75-23',
        article: 'Artículo 75, inciso 23',
        category: 'Igualdad',
        icon: <Heart className="w-5 h-5" />,
        text: 'Legislar y promover medidas de acción positiva que garanticen la igualdad real de oportunidades... en particular respecto de los niños, las mujeres, los ancianos y las personas con discapacidad.',
        explanation: 'Obliga al Congreso a hacer leyes especiales para proteger a los grupos que suelen estar en desventaja.',
        application: 'Este artículo apoya las leyes de jubilación, los subsidios por discapacidad, la protección contra la violencia de género y los planes de salud para la infancia.',
        keywords: ['niños', 'mujeres', 'ancianos', 'discapacidad', 'igualdad', 'protección', 'vulnerables'],
        lifeSituation: ['Familia', 'Salud']
    }
];

export const CATEGORIES = ['Todos', 'Derechos Civiles', 'Trabajo y Seguridad Social', 'Justicia y Privacidad', 'Propiedad', 'Igualdad', 'Ambiente', 'Consumidores'];

export const LIFE_SITUATIONS = ['Todas', '💼 Trabajo', '🏠 Vivienda', '👨‍👩‍👧 Familia', '🎓 Educación', '🏥 Salud', '⚖️ Justicia', '🌍 Ambiente', '🛒 Consumo', '🚨 Emergencias', '🗳️ Participación'];

export const SUGGESTED_QUESTIONS = [
    { category: "Justicia", question: "¿Qué necesito para que la policía no entre a mi casa?", emoji: "⚖️" },
    { category: "Participación", question: "¿Cómo puedo proponer una ley al Congreso?", emoji: "🗳️" },
    { category: "Emergencias", question: "¿Qué es un Hábeas Corpus y cuándo se usa?", emoji: "�" },
    { category: "Igualdad", question: "¿Qué derechos tienen los pueblos indígenas?", emoji: "🤝" },
    { category: "Trabajo", question: "¿Qué hacer si me despiden sin justa causa?", emoji: "💼" },
    { category: "Vivienda", question: "¿Puede el dueño entrar a mi alquiler sin avisar?", emoji: "🏠" },
    { category: "Consumo", question: "¿Qué hago si una empresa me miente en la publicidad?", emoji: "🛒" },
    { category: "Ambiente", question: "¿Cómo denuncio contaminación en mi barrio?", emoji: "🌍" }
];
