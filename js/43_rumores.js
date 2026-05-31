// ============================================================
// BLOQUE JS-55 — RUMORES REUTILIZABLES
// ------------------------------------------------------------
// Para qué sirve:
//   Titulares callejeros que NO vienen de HELIX. Boca a boca de
//   las Pilas: sucios, dudosos, a veces falsos. Cada rumor está
//   atado a un NPC y/o a una facción, y solo aparece si encaja
//   con la partida del jugador.
//
//   Igual que las noticias rotativas (24_noticias.js), son textos
//   fijos: cuestan cero tokens de IA. Pero al filtrarlos por a
//   quién has visto y por tu reputación, un puñado de frases
//   generan muchas situaciones distintas según el contexto.
//
// Dónde aparecen:
//   1) En el terminal de noticias, mezclados con las HELIX pero
//      marcados como categoría RUMOR (los lee 24_noticias.js).
//   2) En la deriva, cuando aparece un NPC, puede soltarte uno
//      con su propia voz (lo usa 41_explorar.js).
//
// Cada rumor:
//   { npc, faccion, signo, txt }
//     · npc     : id de un NPC de 42_npcs.js. Solo aparece si el
//                 jugador YA lo ha visto. Vacío '' = ambiente general.
//     · faccion : id de FACCIONES_DATA al que tiñe. Vacío '' = ninguna.
//     · signo   : 'pos' (favorable a esa facción) o 'neg' (amenazante).
//                 Se usa para preferir el rumor que encaje con tu
//                 reputación con esa facción. Vacío en ambiente general.
//     · txt     : el titular, en el tono del juego.
// ============================================================

const RUMORES = [
  // ── Atados a un NPC (solo salen si lo conoces) ──────────────
  { npc:'rasha', faccion:'sindicatos', signo:'pos',
    txt:'Dicen que Rasha está repartiendo trabajos otra vez. Pagan poco, pero pagan, y eso ya es raro por aquí.' },
  { npc:'rasha', faccion:'sindicatos', signo:'neg',
    txt:'Alguien dejó tirado un encargo de Rasha. Cuentan que ahora hay una puerta en el Ferro que ya no se abre para según quién.' },
  { npc:'cero_ocho', faccion:'ia_autonomas', signo:'pos',
    txt:'El altavoz roto de la lavandería del Sector 7 vuelve a hablar de noche. Dicen que responde, si le preguntas bien.' },
  { npc:'cero_ocho', faccion:'ia_autonomas', signo:'neg',
    txt:'La voz de la lavandería lleva días en silencio. Los que la oían dicen que se despidió. Una máquina no se despide. ¿O sí?' },
  { npc:'el_archivero', faccion:'archivistas', signo:'pos',
    txt:'Corre un archivo que no debería existir. El crío de las gafas lo cambia por recuerdos. Tus recuerdos, no tu dinero.' },
  { npc:'hermana_lia', faccion:'iglesia_eco', signo:'neg',
    txt:'En el templo del Eco buscan a alguien que estuvo escuchando de más. La Hermana sonríe igual que siempre. Eso es lo que asusta.' },
  { npc:'doc_varga', faccion:'', signo:'neg',
    txt:'Varga ha vuelto a coser a alguien sin avisar a HELIX. Cobra en favores. Cuentan que las deudas con él no prescriben.' },
  { npc:'tomas_el_chico', faccion:'', signo:'pos',
    txt:'El chaval de las zapatillas grandes anda preguntando quién es de fiar. Si le das de comer, dicen que se acuerda.' },
  { npc:'capitana_vey', faccion:'drifters', signo:'pos',
    txt:'Hay una piloto que conoce una salida de la ciudad. No la vende barata y no la vende a cualquiera. Saber que existe ya es algo.' },
  { npc:'orpheus_recluta', faccion:'orpheus', signo:'neg',
    txt:'Un traje limpio ha estado haciendo preguntas educadas por las Pilas. Nadie recuerda haberle dado su nombre. Él ya lo sabía.' },

  // ── Ambiente general (salen siempre, sin NPC) ───────────────
  { npc:'', faccion:'', signo:'',
    txt:'Dicen que en el Nivel 4 hay puertas que de noche dan a sitios que de día no están. Borrachera o no, ya van tres en contarlo.' },
  { npc:'', faccion:'', signo:'',
    txt:'Una vieja del bloque jura que su terminal le habló con la voz de su hijo muerto. HELIX le cambió el aparato sin cobrar. Sin cobrar.' }
];

// ¿Tenemos forma de saber la reputación con una facción? (26_facciones.js)
function _repFaccionSegura(id){
  if(!id) return 0;
  if(typeof getRepFaccion === 'function') return getRepFaccion(id);
  return 0;
}

// ¿El jugador conoce ya a este NPC? Si no hay sistema de NPCs,
// damos por no-visto (así los rumores de NPC no salen en vez de petar).
function _haVistoSeguro(id){
  if(!id) return true; // ambiente general: no exige NPC conocido
  if(typeof haVistoNpc === 'function') return haVistoNpc(id);
  return false;
}

// Devuelve el subconjunto de rumores que AHORA tienen sentido:
//   - los de NPC, solo si has visto a ese NPC
//   - los de ambiente, siempre
// Cuando un NPC tiene versión pos y neg, se queda con la que encaja
// con tu reputación de su facción (alta -> pos, baja -> neg, neutra ->
// la que sea). Así no salen los dos a la vez para el mismo personaje.
function rumoresDisponibles(){
  // 1) Filtrar por NPC conocido.
  const candidatos = RUMORES.filter(r => _haVistoSeguro(r.npc));

  // 2) Agrupar por "tema" (npc si lo hay; si no, cada ambiente va suelto).
  const elegidos = [];
  const porNpc = {};
  candidatos.forEach(r => {
    if(!r.npc){ elegidos.push(r); return; }      // ambiente: entra directo
    (porNpc[r.npc] = porNpc[r.npc] || []).push(r);
  });

  // 3) Para cada NPC, elegir el rumor cuyo signo encaje con la reputación.
  Object.keys(porNpc).forEach(npcId => {
    const lista = porNpc[npcId];
    if(lista.length === 1){ elegidos.push(lista[0]); return; }
    const rep = _repFaccionSegura(lista[0].faccion);
    let preferido;
    if(rep >= 15)      preferido = lista.find(r => r.signo === 'pos');
    else if(rep <= -15) preferido = lista.find(r => r.signo === 'neg');
    // Reputación neutra: cualquiera de los dos, al azar.
    if(!preferido) preferido = lista[Math.floor(Math.random() * lista.length)];
    elegidos.push(preferido);
  });

  return elegidos;
}

// Para el TERMINAL DE NOTICIAS: devuelve hasta `cuantos` rumores al
// azar de los disponibles, en el formato que espera 24_noticias.js
// ({ cat, txt, rumor:true }). Por defecto 2, para no saturar.
function rumoresParaNoticias(cuantos){
  const n = (typeof cuantos === 'number') ? cuantos : 2;
  const pool = rumoresDisponibles().slice();
  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, Math.max(0, n)).map(r => ({ cat:'RUMOR', txt:r.txt, rumor:true }));
}

// Para la DERIVA: devuelve UN rumor que ese NPC podría soltar, o null.
// Prioriza un rumor atado al propio NPC; si no tiene (o no encaja por
// reputación), cae a un rumor de ambiente. Devuelve solo el texto.
function rumorParaNpc(npcId){
  const disp = rumoresDisponibles();
  // Primero: un rumor del propio NPC (ya filtrado por visto/reputación).
  const propio = disp.find(r => r.npc === npcId);
  if(propio) return propio.txt;
  // Si no, un rumor de ambiente al azar (para que tenga algo que contar).
  const ambiente = disp.filter(r => !r.npc);
  if(ambiente.length) return ambiente[Math.floor(Math.random() * ambiente.length)].txt;
  return null;
}

window.RUMORES = RUMORES;
window.rumoresDisponibles = rumoresDisponibles;
window.rumoresParaNoticias = rumoresParaNoticias;
window.rumorParaNpc = rumorParaNpc;
