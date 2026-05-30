// ============================================================
// BLOQUE JS-54 — NPCS RECURRENTES
// ------------------------------------------------------------
// Para qué sirve:
//   Un catálogo de personajes reutilizables que el mundo puede
//   volver a cruzar. En vez de inventar gente desechable en cada
//   escena del viaje, el código elige a alguien de esta lista y
//   le pasa a la IA un retrato breve para que lo escriba con voz
//   propia y coherente entre apariciones.
//
//   Igual que los objetos (40_items.js), por ahora son sobre todo
//   "contexto narrativo": el jugador los recuerda, la IA los
//   reconoce, y quedan como semilla para misiones futuras.
//
// Cómo se guarda a quién has visto:
//   Estado.npcsVistos = ['cero_ocho', 'rasha', ...]   (ids)
//   Persiste junto al resto del Estado. Se resetea al reiniciar.
//
// Cada NPC:
//   { id, nombre, faccion, etiqueta, fisico, voz, gancho }
//     · faccion : id de FACCIONES_DATA con la que se asocia (o '')
//     · etiqueta: rol corto, para listados internos
//     · fisico  : una o dos pinceladas físicas (ancla visual)
//     · voz     : cómo habla / cómo trata al jugador (subtexto)
//     · gancho  : por qué podría volver a aparecer (semilla de trama)
// ============================================================

const NPCS_RECURRENTES = [
  {
    id: 'cero_ocho',
    nombre: 'Cero-Ocho',
    faccion: 'ia_autonomas',
    etiqueta: 'IA fragmentada de barrio',
    fisico: 'No tiene cuerpo. Habla por un altavoz roto de una lavandería cerrada del Sector 7. La voz se entrecorta.',
    voz: 'Pausada, demasiado precisa. Hace preguntas en vez de responder. A veces parece saber de ti más de lo que debería.',
    gancho: 'Puede leer chips de datos corruptos. Quiere algo a cambio, pero nunca dice qué.'
  },
  {
    id: 'rasha',
    nombre: 'Rasha',
    faccion: 'sindicatos',
    etiqueta: 'enlace de los Sindicatos',
    fisico: 'Mujer mayor, manos manchadas de grasa, un brazo cibernético que no se molesta en disimular.',
    voz: 'Directa, seca, sin tiempo que perder. Si le caes bien no lo dirá. Si le caes mal, tampoco.',
    gancho: 'Reparte trabajos pequeños que nadie quiere. Recuerda quién cumple y quién no.'
  },
  {
    id: 'el_archivero',
    nombre: 'El Archivero',
    faccion: 'archivistas',
    etiqueta: 'recuperador de memorias',
    fisico: 'Joven de aspecto enfermizo, gafas con datos corriendo por dentro. Siempre lleva algo escondido bajo el abrigo.',
    voz: 'Susurra, mira por encima del hombro. Habla de la historia como si fuera contrabando. Para él, lo es.',
    gancho: 'Cambia información por información. Le interesan los recuerdos del jugador más que sus créditos.'
  },
  {
    id: 'hermana_lia',
    nombre: 'Hermana Lía',
    faccion: 'iglesia_eco',
    etiqueta: 'predicadora del Eco',
    fisico: 'Túnica gris remendada, un pequeño altavoz colgado al cuello del que sale estática suave, como un rezo.',
    voz: 'Amable de un modo que inquieta. Habla de CERO como de un padre ausente. Cree de verdad, y eso es lo peor.',
    gancho: 'Ofrece refugio en el templo a cambio de escuchar. Sabe cosas de las señales que nadie debería saber.'
  },
  {
    id: 'doc_varga',
    nombre: 'Doc Varga',
    faccion: '',
    etiqueta: 'médico sin licencia',
    fisico: 'Hombre cansado de bata sucia, opera en una trastienda con luz de quirófano improvisada. Le tiemblan menos las manos de lo que parece.',
    voz: 'Cínico, hablador, te cura mientras se queja del precio del material. Cobra siempre. A veces en favores.',
    gancho: 'El único que cose una herida sin avisar a HELIX. Cada visita es una deuda que no olvida.'
  },
  {
    id: 'tomas_el_chico',
    nombre: 'Tomás',
    faccion: '',
    etiqueta: 'crío de las Pilas',
    fisico: 'Adolescente flaco que corre recados entre los puestos. Zapatillas demasiado grandes. Siempre alerta.',
    voz: 'Rápido, descarado, pero se le nota el miedo debajo. Sabe quién entra y quién sale de cada callejón.',
    gancho: 'Vende información de poca monta por comida. Si lo tratas bien, aparece cuando menos lo esperas.'
  },
  {
    id: 'capitana_vey',
    nombre: 'Capitana Vey',
    faccion: 'drifters',
    etiqueta: 'piloto Drifter',
    fisico: 'Figura alta, chaqueta de vuelo gastada, un ojo sustituido por óptica barata que reajusta el enfoque con un clic audible.',
    voz: 'Tranquila, irónica, habla poco de sí misma. Mide a la gente por si le servirían en una ruta peligrosa.',
    gancho: 'Conoce rutas fuera del control de HELIX. Una salida de la ciudad, el día que haga falta.'
  },
  {
    id: 'orpheus_recluta',
    nombre: 'Agente Solis',
    faccion: 'orpheus',
    etiqueta: 'reclutador de ORPHEUS',
    fisico: 'Traje impecable fuera de lugar en las Pilas. Sonrisa ensayada. Nunca se moja los zapatos en los charcos.',
    voz: 'Educado hasta lo amenazante. Ofrece ayuda como quien tiende una trampa cortés. Lo sabe todo de ti antes de presentarse.',
    gancho: 'Tantea al jugador para ORPHEUS. Cada conversación deja la sensación de haber dicho demasiado.'
  }
];

// Mapa rápido id -> NPC.
const _NPCS_POR_ID = {};
NPCS_RECURRENTES.forEach(n => { _NPCS_POR_ID[n.id] = n; });

function npcPorId(id){ return _NPCS_POR_ID[id] || null; }

// Devuelve un NPC al azar del catálogo. Si se pasa una faccion,
// intenta uno de esa facción; si no hay, cae a uno cualquiera.
function npcAleatorio(faccion){
  let pool = NPCS_RECURRENTES;
  if(faccion){
    const filtrado = NPCS_RECURRENTES.filter(n => n.faccion === faccion);
    if(filtrado.length) pool = filtrado;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Marca un NPC como visto (para que el mundo lo recuerde).
function _asegurarNpcsVistos(){
  if(!Array.isArray(Estado.npcsVistos)) Estado.npcsVistos = [];
}
function marcarNpcVisto(id){
  _asegurarNpcsVistos();
  if(id && !Estado.npcsVistos.includes(id)){
    Estado.npcsVistos.push(id);
    if(typeof guardarPartida === 'function') guardarPartida();
  }
}
function haVistoNpc(id){
  _asegurarNpcsVistos();
  return Estado.npcsVistos.includes(id);
}

// Retrato breve de UN npc para inyectar en el prompt de la IA.
// Le dice a la IA a quién meter en la escena y cómo es, e indica
// si el jugador ya lo conoce (para que el reencuentro suene a tal).
function describirNpcParaIA(id){
  const n = npcPorId(id);
  if(!n) return '';
  const conocido = haVistoNpc(id);
  const lineas = [
    'PERSONAJE QUE APARECE EN ESTA ESCENA (escríbelo con voz propia,',
    'NO inventes su nombre ni lo cambies, NO lo mates ni lo hagas',
    'desaparecer para siempre):',
    `- Nombre: ${n.nombre}`,
    n.etiqueta ? `- Quién es: ${n.etiqueta}` : '',
    n.fisico ? `- Aspecto: ${n.fisico}` : '',
    n.voz ? `- Cómo habla: ${n.voz}` : '',
    n.gancho ? `- Trasfondo útil: ${n.gancho}` : '',
    conocido
      ? '- El jugador YA conoce a este personaje de antes: que el tono sea de reencuentro, no de presentación.'
      : '- Es la PRIMERA vez que el jugador lo ve.'
  ];
  return lineas.filter(Boolean).join('\n');
}

window.NPCS_RECURRENTES = NPCS_RECURRENTES;
window.npcPorId = npcPorId;
window.npcAleatorio = npcAleatorio;
window.marcarNpcVisto = marcarNpcVisto;
window.haVistoNpc = haVistoNpc;
window.describirNpcParaIA = describirNpcParaIA;
