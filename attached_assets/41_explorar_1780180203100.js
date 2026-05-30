// ============================================================
// BLOQUE JS-53 — EXPLORAR LA CIUDAD (viaje narrativo de 10 escenas)
// ------------------------------------------------------------
// QUÉ ES:
//   El 5º punto del mapa. Un viaje a la deriva por las Pilas de
//   EXACTAMENTE 10 escenas. El jugador no sabe qué va a pasar:
//   puede haber encuentros, peligro, daño, objetos, o nada.
//   Debe SOBREVIVIR: si una barra de estado llega a 100, muere.
//
// CÓMO SE GENERA (modelo híbrido):
//   - El CÓDIGO decide la "espina dorsal" de cada escena:
//       · si esta escena suelta un objeto
//       · si esta escena hace daño físico (sube fatiga)
//       · si esta escena inflige una condición médica
//       · el "tono" del momento (calma / tensión / peligro)
//   - La IA escribe la PROSA noir y las 3 opciones de respuesta.
//   - Si la IA falla, cada escena tiene un texto de respaldo y el
//     viaje continúa igual. Nunca se queda colgado.
//
//   Cada escena, además, drena un poco las condiciones activas
//   (un brazo herido sigue sangrando mientras caminas).
//
// AL FINAL:
//   - Si sobrevives las 10 escenas: vuelves al apartamento, agotado.
//   - Si una barra llega a 100 en mitad del viaje: el motor de
//     muerte que ya existe (05_stats_humanas → dispararMuerte) se
//     encarga. No duplicamos lógica de muerte.
// ============================================================

const EXPLORAR_TOTAL_ESCENAS = 10;

let _expEscenaActual = 0;
let _expPlan = [];        // la espina dorsal calculada al empezar
let _expHistorial = [];   // resumen breve de lo ocurrido (contexto IA)
let _expNarraciones = []; // aperturas recientes, para no repetir
let _expEnCurso = false;
let _expResolviendo = false; // blindaje contra doble-pulsación en una escena
let _expUltimaEleccion = null; // texto de la opción elegida en la escena anterior (continuidad)

// Imágenes GENÉRICAS de las Pilas (sin facción concreta) para el
// destello atmosférico de ~3s entre escenas. Nada de zonas de facción
// ni sus tránsitos: la deriva es por la ciudad común.
const _EXP_IMGS_GENERICAS = [
  'HOUSING_BLOCK_B2', 'INDUSTRIAL_WALKWAY9', 'LOWER_CANAL_SECTOR7B',
  'MAINTENANCE_ACCESS12', 'SOUTH_ELEVATOR_LEVEL4', 'SECTOR7_STREETS',
  'SECTOR7_CENTRAL_PLAZA', 'SERVICE_CONDUIT_RAMP_E', 'DOCK_ACCESS_TUNNEL',
  'FREE_TRANSIT_HUB', 'PASILLO', 'TREN'
];
// Imágenes con cierta carga temática, por si la escena encaja.
const _EXP_IMGS_POR_TEMA = {
  mercado: ['MARKET_DISTRICT_TIER1', 'SECTOR7_BLACK_MARKET'],
  medico:  ['HELIX_MEDICAL_CENTER', 'TREATMENT_WING'],
  muelle:  ['DOCK_ACCESS_TUNNEL', 'FREIGHT_HUB07', 'LOWER_CANAL_SECTOR7B']
};

// Elige una imagen para la escena: si el plan trae item/condición con
// tema reconocible, intenta una temática; si no, una genérica al azar.
function _imagenParaEscena(escenaPlan){
  let clave = null;
  const it = escenaPlan && escenaPlan.item;
  if(it){
    if(/placa|sindicato/i.test(it.id || '')) clave = _aleatorioArr(_EXP_IMGS_POR_TEMA.muelle);
    else if(/analges|estimul/i.test(it.id || '')) clave = _aleatorioArr(_EXP_IMGS_POR_TEMA.medico);
  }
  if(!clave) clave = _aleatorioArr(_EXP_IMGS_GENERICAS);
  return (typeof ASSETS !== 'undefined' && ASSETS[clave]) ? ASSETS[clave] : null;
}

function _aleatorioArr(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

// ── PLANIFICADOR DE LA ESPINA DORSAL ────────────────────────
// Genera un plan de 10 escenas. Reparte objetos, daño, condiciones
// médicas y movimientos de créditos (ganar y perder) a lo largo del
// viaje, sin que caigan todos juntos. La escena 1 es de entrada y la
// 10 de salida (esas dos pueden permitir texto más largo).
function _planificarViaje(){
  const plan = [];
  for(let i = 0; i < EXPLORAR_TOTAL_ESCENAS; i++){
    plan.push({ tono:'tension', daño:0, item:null, condicion:null, creditos:0, npc:null });
  }
  // Primera y última, ancladas.
  plan[0].tono = 'entrada';
  plan[EXPLORAR_TOTAL_ESCENAS - 1].tono = 'salida';

  // Repartir 3 objetos en escenas intermedias distintas (2..8).
  _repartir(plan, 3, 1, 8, (e) => { e.item = (typeof itemExplorarAleatorio === 'function') ? itemExplorarAleatorio() : null; });

  // Repartir 3 momentos de daño físico (sube fatiga 6..16).
  _repartir(plan, 3, 2, 8, (e) => { e.daño = 6 + Math.floor(Math.random() * 11); e.tono = 'peligro'; });

  // Repartir 2 condiciones médicas en escenas con daño preferentemente.
  const idsCond = Object.keys(CATALOGO_CONDICIONES || {});
  _repartir(plan, 2, 2, 8, (e) => {
    if(idsCond.length){
      e.condicion = idsCond[Math.floor(Math.random() * idsCond.length)];
      e.tono = 'peligro';
    }
  });

  // FLUJO DE CRÉDITOS: la deriva mueve dinero en los dos sentidos.
  // 2 ganancias (encuentras algo de valor, te pagan un favor, robas)
  // y 2 pérdidas (peaje, te roban, sobornas, comes algo en un puesto).
  _repartir(plan, 2, 1, 8, (e) => { if(!e.creditos) e.creditos = 12 + Math.floor(Math.random() * 39); });   // +12..+50
  _repartir(plan, 2, 1, 8, (e) => { if(!e.creditos) e.creditos = -(10 + Math.floor(Math.random() * 31)); }); // -10..-40

  // Repartir 2 encuentros con NPCs recurrentes en escenas intermedias.
  _repartir(plan, 2, 1, 8, (e) => {
    if(!e.npc && typeof npcAleatorio === 'function'){
      const n = npcAleatorio();
      if(n) e.npc = n.id;
    }
  });

  return plan;
}

// Coloca "cuantos" marcadores en escenas aleatorias del rango
// [min,max] que aún no tengan ese marcador, aplicando fn(escena).
function _repartir(plan, cuantos, min, max, fn){
  let intentos = 0;
  let puestos = 0;
  while(puestos < cuantos && intentos < 60){
    intentos++;
    const idx = min + Math.floor(Math.random() * (max - min + 1));
    fn(plan[idx]);
    puestos++;
  }
}

// ── ARRANQUE DEL VIAJE ──────────────────────────────────────
function iniciarExplorarCiudad(){
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  _expEscenaActual = 0;
  _expPlan = _planificarViaje();
  _expHistorial = [];
  _expNarraciones = [];
  _expUltimaEleccion = null;
  _expEnCurso = true;
  _expResolviendo = false;

  if(typeof cambiarEscena === 'function'){
    cambiarEscena('mapa-escena', 'explorar-escena');
  } else {
    document.getElementById('mapa-escena').classList.remove('activa');
    document.getElementById('explorar-escena').classList.add('activa');
  }
  setTimeout(mostrarSiguienteEscenaExplorar, 400);
}

// ── UNA ESCENA ──────────────────────────────────────────────
async function mostrarSiguienteEscenaExplorar(){
  // ¿Muerto a mitad de camino? El motor de muerte ya habrá
  // cambiado de escena; aquí solo cortamos.
  if(Estado.muerto){ _expEnCurso = false; return; }

  // ¿Terminado?
  if(_expEscenaActual >= EXPLORAR_TOTAL_ESCENAS){
    return finalizarExplorar();
  }

  const num = _expEscenaActual; // 0-indexed
  const escenaPlan = _expPlan[num];

  // Pintar cabecera de progreso.
  const cont = document.getElementById('explorar-cuerpo');
  if(!cont) return;

  // IMAGEN DE LA ESCENA: se queda de FONDO durante toda la escena
  // (ambientación, sobre todo en PC). Además hace un "destello" más
  // intenso los primeros segundos, que cubre la espera de la IA.
  const imgSrc = _imagenParaEscena(escenaPlan);
  const fondo = document.getElementById('explorar-fondo');
  const flash = document.getElementById('explorar-flash');
  if(imgSrc){
    if(fondo) fondo.style.backgroundImage = `url('${imgSrc}')`;
    if(flash){
      flash.style.backgroundImage = `url('${imgSrc}')`;
      flash.classList.add('visible');
    }
  }

  cont.innerHTML = `
    <div class="exp-progreso">DERIVA · ${num + 1} / ${EXPLORAR_TOTAL_ESCENAS}</div>`;

  // Lanzamos la IA y el temporizador del destello a la vez; esperamos
  // a que terminen los dos (el destello al menos 2.6s, la IA lo que tarde).
  const tFlash = new Promise(res => setTimeout(res, 2600));
  const pEscena = _generarEscenaIA(num, escenaPlan);
  const [escena] = await Promise.all([pEscena, tFlash]);

  // Quitamos solo el destello intenso; la imagen de fondo permanece.
  if(flash) flash.classList.remove('visible');
  if(Estado.muerto){ _expEnCurso = false; return; }

  // Pintamos narración + opciones.
  _expResolviendo = false; // la escena nueva acepta una pulsación
  cont.innerHTML = `
    <div class="exp-progreso">DERIVA · ${num + 1} / ${EXPLORAR_TOTAL_ESCENAS}</div>
    <div class="exp-narracion">${escena.narracion}</div>
    <div class="exp-opciones" id="exp-opciones"></div>`;

  const opcDiv = document.getElementById('exp-opciones');
  escena.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'exp-opcion';
    btn.setAttribute('data-tono', op.tono || '');
    btn.textContent = op.texto;
    btn.onclick = () => resolverEscenaExplorar(num, escenaPlan, op);
    opcDiv.appendChild(btn);
  });
}

// Llama a la IA pidiendo el JSON {narracion, opciones[3]} que el
// sistema ya sabe parsear. Si algo falla, devuelve un respaldo.
async function _generarEscenaIA(num, escenaPlan){
  const respaldo = _escenaRespaldo(num, escenaPlan);

  if(typeof IA === 'undefined' || typeof IA.llamar !== 'function'){
    return respaldo;
  }

  // Contexto físico/mental del jugador para que la IA module el tono.
  const ctxJugador = (typeof describirJugadorParaIA === 'function') ? describirJugadorParaIA() : '';
  const ctxCond = (typeof describirCondicionesParaIA === 'function') ? describirCondicionesParaIA() : '';
  const ctxInv  = (typeof describirInventarioParaIA === 'function') ? describirInventarioParaIA() : '';

  // Pistas de la espina dorsal (qué debe ocurrir en esta escena),
  // SIN que la IA decida números: solo describe lo que el código ya
  // ha decidido que pasa.
  const pistas = [];
  if(escenaPlan.tono === 'entrada') pistas.push('Es el primer momento del paseo: sales a la ciudad sin rumbo fijo. Tono de entrada, observador, algo de calma tensa.');
  else if(escenaPlan.tono === 'salida') pistas.push('Es el último momento del paseo: el viaje toca a su fin y vuelves sobre tus pasos. Tono de cierre, cansancio, una última imagen que se queda.');
  else if(escenaPlan.tono === 'peligro') pistas.push('Este momento es PELIGROSO: hay amenaza física real, tensión alta.');
  else pistas.push('Momento de tránsito: algo llama la atención, sin necesidad de violencia.');

  if(escenaPlan.daño > 0) pistas.push('En esta escena el jugador SALE FÍSICAMENTE DAÑADO pase lo que pase (golpe, caída, encontronazo). Descríbelo, pero NO inventes cifras.');
  if(escenaPlan.item) pistas.push(`En esta escena el jugador puede HACERSE CON un objeto: "${escenaPlan.item.nombre}" (${escenaPlan.item.desc}). Haz que aparezca de forma natural en la escena.`);
  if(escenaPlan.condicion && CATALOGO_CONDICIONES[escenaPlan.condicion]){
    pistas.push(`En esta escena el jugador sufre una lesión: ${CATALOGO_CONDICIONES[escenaPlan.condicion].desc}`);
  }
  if(escenaPlan.creditos > 0) pistas.push('En esta escena el jugador GANA algo de dinero (un favor pagado, un descuido ajeno, algo de valor que recoge). Insinúalo sin dar cifras.');
  else if(escenaPlan.creditos < 0) pistas.push('En esta escena el jugador PIERDE algo de dinero (un peaje, un soborno, un descuido, un pequeño robo). Insinúalo sin dar cifras.');

  if(escenaPlan.npc && typeof describirNpcParaIA === 'function'){
    const retrato = describirNpcParaIA(escenaPlan.npc);
    if(retrato) pistas.push(retrato);
  }

  // Longitud objetivo según la escena: 1, 5 y 10 pueden respirar más;
  // el resto van CORTAS para no cansar entre escena y escena.
  const esLarga = (num === 0 || num === 4 || num === EXPLORAR_TOTAL_ESCENAS - 1);
  const limitePalabras = esLarga ? 90 : 55;

  const sys = [
    'Eres el director narrativo de NEON ASHES, simulación cyberpunk noir grounded y melancólica.',
    'Generas UNA escena de un paseo a la deriva por los Lower Stacks (las Pilas).',
    '',
    'TONO: noir adulto, íntimo, atmosférico. Subtexto sobre exposición. El silencio importa.',
    '',
    'EVITA REPETIRTE (MUY IMPORTANTE): NO menciones lluvia ácida, neón roto ni',
    'hologramas en cada escena. Ya se han usado mucho. Varía el ancla sensorial:',
    'un olor concreto, una textura, un sonido, una temperatura, un detalle humano,',
    'un objeto fuera de lugar. Cada escena debe sentirse DISTINTA de la anterior.',
    'No abras dos escenas seguidas igual.',
    '',
    'PROHIBIDO: nacionalidades/idiomas/lugares reales, marcas reales, menores en',
    'cualquier contexto, humor Marvel, melodrama, exposición de lore. NO decidas',
    'consecuencias numéricas (stats, créditos): de eso se encarga el código.',
    '',
    'LENGUAJE: castellano neutro. Segunda persona ("ves", "oyes", "sientes").',
    'Cero marcas de género para el jugador.',
    '',
    ctxJugador ? ('LECTURA DEL JUGADOR (para calibrar tono, no la cites):\n' + ctxJugador) : '',
    ctxCond,
    ctxInv,
    '',
    'FORMATO DE SALIDA (OBLIGATORIO): un único objeto JSON válido, sin texto',
    'antes ni después, sin markdown. Estructura exacta:',
    '{',
    `  "narracion": "Texto en segunda persona, máximo ${limitePalabras} palabras. Conciso.",`,
    '  "opciones": [',
    '    { "texto": "...", "tono": "EMPATICO" },',
    '    { "texto": "...", "tono": "FRIO" },',
    '    { "texto": "...", "tono": "EVASIVO" }',
    '  ]',
    '}',
    'Las opciones deben ser BREVES (máximo ~10 palabras cada una).',
    'Exactamente 3 opciones. Tonos posibles: VIOLENTO, EMPATICO, FRIO, MANIPULADOR,',
    'EVASIVO, VENAL, HONESTO. Si dudas entre decir algo y sugerirlo, sugiérelo.'
  ].filter(Boolean).join('\n');

  const contexto = [
    `ESCENA ${num + 1} de ${EXPLORAR_TOTAL_ESCENAS} del paseo.`,
    _expHistorial.length ? ('LO QUE YA HA PASADO:\n' + _expHistorial.join('\n')) : 'Es el comienzo del paseo.',
    _expUltimaEleccion ? ('\nCONTINUIDAD OBLIGATORIA: en la escena anterior, el jugador eligió: "' + _expUltimaEleccion + '". ESTA escena es la CONSECUENCIA DIRECTA e inmediata de esa elección, en el mismo lugar o justo a continuación, sin saltos de tiempo ni de lugar bruscos. Si la elección era ir a algún sitio o hacer algo concreto, esta escena MUESTRA el resultado de eso. No empieces una situación nueva e inconexa.') : '',
    _expNarraciones.length ? ('\nNO REPITAS estas aperturas/imágenes ya usadas:\n- ' + _expNarraciones.slice(-3).join('\n- ')) : '',
    '',
    'INSTRUCCIONES PARA ESTA ESCENA:',
    pistas.join('\n'),
    '',
    'Genera la narración y las 3 opciones.'
  ].filter(Boolean).join('\n');

  try {
    const r = await IA.llamar(sys, contexto);
    if(r.ok && r.datos && r.datos.narracion && Array.isArray(r.datos.opciones) && r.datos.opciones.length >= 1){
      // Normalizar a 3 opciones por si la IA devuelve más o menos, o
      // si devuelve strings sueltos en vez de objetos {texto,tono}.
      const ops = r.datos.opciones.slice(0, 3).map((o, i) => {
        if(typeof o === 'string'){
          return { texto: o.trim() || respaldo.opciones[i].texto, tono: '' };
        }
        const t = (o && o.texto) ? String(o.texto).trim() : '';
        return {
          texto: t || respaldo.opciones[i].texto,
          tono: (o && o.tono) ? String(o.tono).trim() : ''
        };
      });
      while(ops.length < 3) ops.push(respaldo.opciones[ops.length]);
      const narracion = String(r.datos.narracion).trim() || respaldo.narracion;
      // Guardar las primeras palabras como "huella" para no repetir.
      _expNarraciones.push(narracion.split(/\s+/).slice(0, 8).join(' '));
      if(_expNarraciones.length > 4) _expNarraciones = _expNarraciones.slice(-4);
      return { narracion: narracion, opciones: ops };
    }
  } catch(e){ /* cae al respaldo */ }

  return respaldo;
}

// Texto de respaldo si la IA no responde. Sobrio, con variedad para no
// repetir siempre lo mismo. Sirve para testear el loop sin conexión.
function _escenaRespaldo(num, escenaPlan){
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let narr;
  if(escenaPlan.tono === 'entrada'){
    narr = pick([
      'Sales sin rumbo. El frío del corredor se pega a la ropa. Caminas porque quedarte quieto era peor.',
      'Empiezas a andar sin saber adónde. Las Pilas respiran a tu alrededor, ajenas a ti.',
      'La puerta se cierra a tu espalda. Hay menos gente de la que esperabas. Avanzas.'
    ]);
  } else if(escenaPlan.tono === 'salida'){
    narr = pick([
      'Las piernas pesan. La ciudad te ha dado lo que tenía. Empiezas a desandar el camino.',
      'Ya está. Reconoces las esquinas de vuelta. Vuelves más vacío y más lleno a la vez.',
      'El cansancio te alcanza de golpe. Es hora de volver, y lo sabes.'
    ]);
  } else if(escenaPlan.daño > 0){
    narr = pick([
      'Algo se tuerce. Un encontronazo en un hueco sin salida, un golpe que no ves venir.',
      'No lo ves llegar. Cuando recuperas el aire, el dolor ya está instalado.',
      'Un mal paso, una mano de más. El cuerpo se queja antes que la cabeza.'
    ]);
  } else if(escenaPlan.item){
    narr = pick([
      `Entre los escombros hay algo que no encaja. Te agachas. Es ${escenaPlan.item.nombre.toLowerCase()}.`,
      `Casi lo pisas sin verlo: ${escenaPlan.item.nombre.toLowerCase()}. Lo coges antes de pensarlo.`
    ]);
  } else if(escenaPlan.creditos > 0){
    narr = pick([
      'Un descuido ajeno, una moneda en el sitio justo. Hoy la suerte mira para otro lado, pero a tu favor.',
      'Alguien te debía un favor pequeño. Lo cobras sin hacer ruido.'
    ]);
  } else if(escenaPlan.creditos < 0){
    narr = pick([
      'Hay un peaje que no estaba escrito en ninguna parte. Pagas y sigues.',
      'Un roce en la multitud. Tardas un segundo de más en notar que algo falta.'
    ]);
  } else {
    narr = pick([
      'Una esquina cualquiera. Alguien te observa desde un portal y aparta la vista cuando le miras.',
      'El pasaje se estrecha. Un zumbido eléctrico, una puerta entreabierta, nadie dentro.',
      'Pasos que no son los tuyos a media distancia. Se detienen cuando tú te detienes.'
    ]);
  }
  return {
    narracion: narr,
    opciones: [
      { texto: 'Seguir adelante', tono: 'FRIO' },
      { texto: 'Detenerte un momento', tono: 'EMPATICO' },
      { texto: 'Cambiar de rumbo', tono: 'EVASIVO' }
    ]
  };
}

// ── RESOLUCIÓN DE UNA ESCENA ────────────────────────────────
// Aplica los efectos que el CÓDIGO había decidido (daño, item,
// condición) + el goteo de condiciones, anota el resumen para la
// IA, y pasa a la siguiente escena.
function resolverEscenaExplorar(num, escenaPlan, opcionElegida){
  // Blindaje contra doble-pulsación: si ya estamos resolviendo esta
  // escena (o no es la escena en curso), ignoramos el clic.
  if(_expResolviendo) return;
  if(num !== _expEscenaActual) return;
  _expResolviendo = true;

  // Bloquear botones para evitar doble clic.
  const opcDiv = document.getElementById('exp-opciones');
  if(opcDiv) opcDiv.querySelectorAll('button').forEach(b => b.disabled = true);

  // 1) Daño físico → sube fatiga (puede disparar muerte si llega a 100).
  if(escenaPlan.daño > 0 && typeof ajustarHumano === 'function'){
    ajustarHumano('fatiga', escenaPlan.daño);
  }
  // Si el daño ya mató al jugador, el motor de muerte cambió de escena:
  // no seguimos repartiendo objetos/créditos ni guardando estado raro.
  // Cerramos la deriva por completo para que no quede nada en marcha.
  if(Estado.muerto){
    _expEnCurso = false;
    _expResolviendo = false;
    _expUltimaEleccion = null;
    return;
  }

  // 2) Condición médica nueva.
  if(escenaPlan.condicion && typeof aplicarCondicion === 'function'){
    aplicarCondicion(escenaPlan.condicion);
  }

  // 3) Objeto encontrado.
  if(escenaPlan.item && typeof darItem === 'function'){
    darItem(escenaPlan.item);
  }

  // 3b) Movimiento de créditos (ganar o perder).
  if(escenaPlan.creditos){
    if(typeof ajustarCreditos === 'function'){
      ajustarCreditos(escenaPlan.creditos);
    } else {
      Estado.creditos = Math.max(0, (Estado.creditos || 0) + escenaPlan.creditos);
      if(typeof actualizarHUD === 'function') actualizarHUD();
    }
    if(typeof notificarCambio === 'function'){
      notificarCambio((escenaPlan.creditos >= 0 ? '+' : '') + escenaPlan.creditos + ' CR', 'creditos');
    }
  }

  // 4) Goteo de las condiciones ya activas (el cuerpo roto sigue roto).
  if(typeof drenarCondiciones === 'function') drenarCondiciones();

  // El drenaje de condiciones puede haber subido la fatiga a 100 y
  // disparado la muerte AQUÍ. Si es así, cerramos la deriva del todo
  // y no tocamos historial, facciones ni avanzamos de escena.
  if(Estado.muerto){
    _expEnCurso = false;
    _expResolviendo = false;
    _expUltimaEleccion = null;
    return;
  }

  // Recordar al NPC que ha aparecido, para futuros reencuentros.
  if(escenaPlan.npc && typeof marcarNpcVisto === 'function'){
    marcarNpcVisto(escenaPlan.npc);
  }

  // COSIDO CON FACCIONES Y NOTICIAS:
  // Si el NPC de la escena pertenece a una facción, el trato que le
  // hayas dado mueve un poco la reputación con esa facción, y deja
  // una huella para que las noticias reactivas la recojan.
  if(escenaPlan.npc && typeof npcPorId === 'function'){
    const _npc = npcPorId(escenaPlan.npc);
    if(_npc && _npc.faccion){
      const _tono = (opcionElegida && opcionElegida.tono) ? String(opcionElegida.tono).toUpperCase() : '';
      let _delta = 0;
      if(_tono === 'EMPATICO' || _tono === 'HONESTO') _delta = 4;
      else if(_tono === 'VIOLENTO' || _tono === 'MANIPULADOR') _delta = -4;
      else if(_tono === 'FRIO' || _tono === 'EVASIVO' || _tono === 'VENAL') _delta = 1;
      if(_delta !== 0 && typeof cambiarRepFaccion === 'function'){
        cambiarRepFaccion(_npc.faccion, _delta);
      }
      // Bandera para la noticia reactiva (la lee 24_noticias.js).
      if(!Estado.memoria) Estado.memoria = {};
      Estado.memoria.ultimaFaccionTocada = _npc.faccion;
      Estado.memoria.ultimaFaccionSigno = _delta >= 0 ? 'pos' : 'neg';
    }
  }

  // 5) Anotar para el contexto de la IA en las siguientes escenas.
  const resumen = `Escena ${num + 1}: ${opcionElegida.texto}` +
    (escenaPlan.daño > 0 ? ' (saliste dañado)' : '') +
    (escenaPlan.item ? ` (conseguiste ${escenaPlan.item.nombre})` : '') +
    (escenaPlan.creditos ? ` (créditos ${escenaPlan.creditos >= 0 ? '+' : ''}${escenaPlan.creditos})` : '') +
    (escenaPlan.condicion && CATALOGO_CONDICIONES[escenaPlan.condicion] ? ` (lesión: ${CATALOGO_CONDICIONES[escenaPlan.condicion].nombre})` : '');
  _expHistorial.push(resumen);
  // Recordar la elección literal para dar continuidad a la escena siguiente.
  _expUltimaEleccion = opcionElegida.texto;
  // Mantener el contexto acotado (últimas 6 anotaciones).
  if(_expHistorial.length > 6) _expHistorial = _expHistorial.slice(-6);

  if(typeof guardarPartida === 'function') guardarPartida();

  // Si el daño mató al jugador, el motor de muerte ya cambió de
  // escena: no avanzamos.
  if(Estado.muerto){
    _expEnCurso = false;
    _expResolviendo = false;
    _expUltimaEleccion = null;
    return;
  }

  _expEscenaActual++;
  setTimeout(mostrarSiguienteEscenaExplorar, 500);
}

// ── FIN DEL VIAJE ───────────────────────────────────────────
function finalizarExplorar(){
  _expEnCurso = false;
  const cont = document.getElementById('explorar-cuerpo');
  if(cont){
    cont.innerHTML = `
      <div class="exp-progreso">DERIVA COMPLETADA</div>
      <div class="exp-narracion">
        Vuelves sobre tus pasos. La ciudad sigue donde la dejaste, indiferente.
        Llevas encima lo que has recogido, y lo que te ha recogido a ti.
        Es hora de volver.
      </div>
      <div class="exp-opciones">
        <button class="exp-opcion" onclick="volverDeExplorar()">Volver al apartamento →</button>
      </div>`;
  }
  if(typeof guardarPartida === 'function') guardarPartida();
}

function volverDeExplorar(){
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  // Limpiar la imagen de fondo del viaje para no arrastrarla.
  const fondo = document.getElementById('explorar-fondo');
  if(fondo) fondo.style.backgroundImage = '';
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('explorar-escena', 'apartamento');
  } else {
    document.getElementById('explorar-escena').classList.remove('activa');
    document.getElementById('apartamento').classList.add('activa');
  }
  if(typeof iniciarApartamento === 'function') iniciarApartamento();
  if(typeof regenerarOpcionesAptCierre === 'function') regenerarOpcionesAptCierre();
}

window.iniciarExplorarCiudad = iniciarExplorarCiudad;
window.volverDeExplorar = volverDeExplorar;
window.resolverEscenaExplorar = resolverEscenaExplorar;
