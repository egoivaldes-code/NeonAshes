// ============================================================
// BLOQUE JS-46 — MOMENTOS DE IA EN VIVO (1 sola escena)
// ------------------------------------------------------------
// Camino C: la IA genera momentos de UNA escena conclusa como
// relleno vivo durante la exploración. NUNCA cadenas (las cadenas
// y los momentos importantes se escriben a mano en 45_escenas_datos).
//
// La IA aprende la estructura con un prompt que le enseña el formato,
// pero el motor BLINDA el resultado:
//   · fuerza escena conclusa (sin 'lleva', sin escenas internas)
//   · limita los efectos a rangos seguros (no puede quitar 9999 créditos)
//   · si la IA falla o devuelve basura, no pasa nada: la deriva sigue.
// ============================================================

// Límites de seguridad para los efectos que la IA puede aplicar.
const _IA_EF_LIMITES = {
  creditos:    [-60, 60],
  fatiga:      [-10, 20],
  aislamiento: [-10, 15],
  hambre:      [-15, 15],
  disociacion: [0, 12]
};
const _IA_COND_PERMITIDAS = ['mareado','herida_brazo_d_leve','conmocion'];
const _IA_ITEMS_PERMITIDOS = ['chip_datos_corrupto','creditos_sucios','estimulante_barato','foto_quemada'];
const _IA_FACCIONES = ['sindicatos','eco','ia','archivistas'];

// Recorta un bloque de efectos generado por la IA a lo seguro.
function _iaSanearEfectos(ef){
  const out = {};
  if(!ef || typeof ef !== 'object') return out;
  for(const k of ['creditos','fatiga','aislamiento','hambre','disociacion']){
    if(typeof ef[k] === 'number'){
      const [min,max] = _IA_EF_LIMITES[k];
      out[k] = Math.max(min, Math.min(max, Math.round(ef[k])));
    }
  }
  if(ef.condicion && _IA_COND_PERMITIDAS.indexOf(ef.condicion) !== -1) out.condicion = ef.condicion;
  if(ef.item && _IA_ITEMS_PERMITIDOS.indexOf(ef.item) !== -1) out.item = ef.item;
  if(ef.faccion && _IA_FACCIONES.indexOf(ef.faccion) !== -1 && typeof ef.rep === 'number'){
    out.faccion = ef.faccion; out.rep = Math.max(-6, Math.min(6, Math.round(ef.rep)));
  }
  return out;
}

// Construye el prompt que ENSEÑA a la IA la estructura de una escena.
function _iaPromptEscena(){
  return [
    'Eres el guionista de NEON ASHES, un cyberpunk noir melancólico e íntimo.',
    'Escribe UN momento de exploración en las Pilas (ciudad baja, lluvia ácida, HELIX lo controla todo).',
    'Es UNA sola escena conclusa: NO encadena con otras, NO continúa después.',
    'Tono: contenido, sensorial, sin épica, sin humor de superhéroe, sin exposición larga.',
    'Devuelve SOLO un JSON con esta forma EXACTA, sin texto alrededor:',
    '{',
    '  "texto": "2-4 frases en segunda persona (tú). Atmósfera de las Pilas.",',
    '  "opciones": [',
    '    {"texto":"opción breve (máx ~10 palabras)", "efectos":{"aislamiento":3}, "resultado":"1-2 frases de lo que ocurre"},',
    '    {"texto":"otra opción", "efectos":{"creditos":-20}, "resultado":"..."},',
    '    {"texto":"otra opción", "efectos":{"fatiga":8}, "resultado":"..."}',
    '  ]',
    '}',
    'Reglas de "efectos" (todas opcionales, números pequeños):',
    '  creditos (-60..60), fatiga (-10..20), aislamiento (-10..15), hambre (-15..15), disociacion (0..12).',
    '  condicion: solo "mareado", "herida_brazo_d_leve" o "conmocion".',
    '  item: solo "chip_datos_corrupto", "creditos_sucios", "estimulante_barato" o "foto_quemada".',
    '  faccion: "sindicatos"|"eco"|"ia"|"archivistas" con "rep" (-6..6).',
    'Exactamente 3 opciones. Cada una con su "resultado". NUNCA uses "lleva" ni continúes la historia.'
  ].join('\n');
}

// Pide a la IA un momento de 1 escena. Devuelve un objeto-escena válido
// para el motor (44), o null si no se pudo.
async function generarMomentoIA(){
  if(window.LAUNCHER && LAUNCHER.IA_ACTIVA === false) return null;
  if(typeof IA === 'undefined' || typeof IA.llamar !== 'function') return null;
  try{
    const r = await IA.llamar(_iaPromptEscena(), 'Genera el momento ahora.');
    const d = (r && r.datos) ? r.datos : r;
    if(!d || !d.texto || !Array.isArray(d.opciones) || d.opciones.length < 1) return null;
    const opciones = d.opciones.slice(0, 3).map(o => ({
      texto: (o.texto || 'Seguir.').toString().slice(0, 80),
      efectos: _iaSanearEfectos(o.efectos),
      resultado: o.resultado ? o.resultado.toString().slice(0, 240) : ''
      // deliberadamente SIN 'lleva': la IA nunca encadena
    }));
    while(opciones.length < 1) opciones.push({ texto:'Seguir caminando.', resultado:'' });
    return {
      entrada: false,                       // no va al catálogo; es de un solo uso
      img: (typeof _EXP_IMGS_GENERICAS !== 'undefined')
            ? _EXP_IMGS_GENERICAS[Math.floor(Math.random()*_EXP_IMGS_GENERICAS.length)]
            : 'PASILLO',
      texto: d.texto.toString().slice(0, 600),
      opciones: opciones
    };
  }catch(e){ return null; }
}

// Reproduce un momento de IA (objeto-escena suelto) reutilizando el
// mismo renderizador del motor a mano. onCerrar continúa la deriva.
function reproducirMomentoIASuelto(escena, onCerrar){
  if(!escena){ if(typeof onCerrar==='function') onCerrar(); return; }
  // registramos la escena temporal en el catálogo con un id efímero
  const idTmp = '__ia_tmp_' + Date.now();
  if(typeof ESCENAS_GUION !== 'undefined'){
    ESCENAS_GUION[idTmp] = escena;
    reproducirEscenaGuion(idTmp, ()=>{
      delete ESCENAS_GUION[idTmp];          // limpiar: no se persiste ni reaparece
      if(typeof onCerrar==='function') onCerrar();
    });
  } else if(typeof onCerrar==='function') onCerrar();
}

window.generarMomentoIA = generarMomentoIA;
window.reproducirMomentoIASuelto = reproducirMomentoIASuelto;
