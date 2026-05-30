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
let _expEnCurso = false;

// ── PLANIFICADOR DE LA ESPINA DORSAL ────────────────────────
// Genera un plan de 10 escenas. Reparte ~3 objetos, ~3 momentos
// de daño y ~2 condiciones médicas a lo largo del viaje, sin que
// caigan todos juntos. La escena 1 siempre es de entrada (calma)
// y la 10 siempre es de salida.
function _planificarViaje(){
  const plan = [];
  for(let i = 0; i < EXPLORAR_TOTAL_ESCENAS; i++){
    plan.push({ tono:'tension', daño:0, item:null, condicion:null });
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
  _expEnCurso = true;

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

  // Indicador "pensando" mientras llega la IA.
  cont.innerHTML = `
    <div class="exp-progreso">DERIVA · ${num + 1} / ${EXPLORAR_TOTAL_ESCENAS}</div>
    <div class="exp-pensando">
      <span class="dots-pensando"><span>·</span><span>·</span><span>·</span></span>
    </div>`;

  // Pedimos la prosa a la IA (con respaldo si falla).
  const escena = await _generarEscenaIA(num, escenaPlan);

  // Pintamos narración + opciones.
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

  const sys = [
    'Eres el director narrativo de NEON ASHES, simulación cyberpunk noir grounded y melancólica.',
    'Generas UNA escena de un paseo a la deriva por los Lower Stacks (las Pilas).',
    '',
    'TONO: noir adulto, íntimo, atmosférico. Subtexto sobre exposición. Sensorial:',
    'lluvia ácida, hormigón mojado, neón roto, hologramas distantes. El silencio importa.',
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
    '  "narracion": "Texto en segunda persona, máximo 110 palabras.",',
    '  "opciones": [',
    '    { "texto": "...", "tono": "EMPATICO" },',
    '    { "texto": "...", "tono": "FRIO" },',
    '    { "texto": "...", "tono": "EVASIVO" }',
    '  ]',
    '}',
    'Exactamente 3 opciones. Tonos posibles: VIOLENTO, EMPATICO, FRIO, MANIPULADOR,',
    'EVASIVO, VENAL, HONESTO. Si dudas entre decir algo y sugerirlo, sugiérelo.'
  ].filter(Boolean).join('\n');

  const contexto = [
    `ESCENA ${num + 1} de ${EXPLORAR_TOTAL_ESCENAS} del paseo.`,
    _expHistorial.length ? ('LO QUE YA HA PASADO:\n' + _expHistorial.join('\n')) : 'Es el comienzo del paseo.',
    '',
    'INSTRUCCIONES PARA ESTA ESCENA:',
    pistas.join('\n'),
    '',
    'Genera la narración y las 3 opciones.'
  ].join('\n');

  try {
    const r = await IA.llamar(sys, contexto);
    if(r.ok && r.datos && r.datos.narracion && Array.isArray(r.datos.opciones) && r.datos.opciones.length >= 1){
      // Normalizar a 3 opciones por si la IA devuelve más o menos.
      const ops = r.datos.opciones.slice(0, 3).map(o => ({
        texto: String(o.texto || '…').trim(),
        tono: String(o.tono || '').trim()
      }));
      while(ops.length < 3) ops.push(respaldo.opciones[ops.length]);
      return { narracion: String(r.datos.narracion).trim(), opciones: ops };
    }
  } catch(e){ /* cae al respaldo */ }

  return respaldo;
}

// Texto de respaldo si la IA no responde. Sobrio, sirve para testear
// el loop completo aunque no haya conexión.
function _escenaRespaldo(num, escenaPlan){
  let narr;
  if(escenaPlan.tono === 'entrada'){
    narr = 'Sales sin rumbo. La lluvia ácida cae fina sobre el hormigón. Las Pilas respiran a tu alrededor, ajenas. Caminas porque quedarte quieto era peor.';
  } else if(escenaPlan.tono === 'salida'){
    narr = 'Las piernas pesan. La ciudad te ha dado lo que tenía esta noche. Empiezas a desandar el camino, más vacío y más lleno a la vez.';
  } else if(escenaPlan.daño > 0){
    narr = 'Algo se tuerce. Un encontronazo en un callejón sin salida, manos de más, un golpe que no ves venir. Cuando recuperas el aire, la calle sigue indiferente.';
  } else if(escenaPlan.item){
    narr = `Entre los escombros hay algo que no encaja. Te agachas. Es ${escenaPlan.item.nombre.toLowerCase()}. Lo coges antes de pensarlo.`;
  } else {
    narr = 'Una esquina cualquiera. Un holograma roto repite media palabra. Alguien te observa desde un portal y aparta la vista cuando le devuelves la mirada.';
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
  // Bloquear botones para evitar doble clic.
  const opcDiv = document.getElementById('exp-opciones');
  if(opcDiv) opcDiv.querySelectorAll('button').forEach(b => b.disabled = true);

  // 1) Daño físico → sube fatiga (puede disparar muerte si llega a 100).
  if(escenaPlan.daño > 0 && typeof ajustarHumano === 'function'){
    ajustarHumano('fatiga', escenaPlan.daño);
  }

  // 2) Condición médica nueva.
  if(escenaPlan.condicion && typeof aplicarCondicion === 'function'){
    aplicarCondicion(escenaPlan.condicion);
  }

  // 3) Objeto encontrado.
  if(escenaPlan.item && typeof darItem === 'function'){
    darItem(escenaPlan.item);
  }

  // 4) Goteo de las condiciones ya activas (el cuerpo roto sigue roto).
  if(typeof drenarCondiciones === 'function') drenarCondiciones();

  // 5) Anotar para el contexto de la IA en las siguientes escenas.
  const resumen = `Escena ${num + 1}: ${opcionElegida.texto}` +
    (escenaPlan.daño > 0 ? ' (saliste dañado)' : '') +
    (escenaPlan.item ? ` (conseguiste ${escenaPlan.item.nombre})` : '') +
    (escenaPlan.condicion && CATALOGO_CONDICIONES[escenaPlan.condicion] ? ` (lesión: ${CATALOGO_CONDICIONES[escenaPlan.condicion].nombre})` : '');
  _expHistorial.push(resumen);
  // Mantener el contexto acotado (últimas 6 anotaciones).
  if(_expHistorial.length > 6) _expHistorial = _expHistorial.slice(-6);

  if(typeof guardarPartida === 'function') guardarPartida();

  // Si el daño mató al jugador, el motor de muerte ya cambió de
  // escena: no avanzamos.
  if(Estado.muerto){ _expEnCurso = false; return; }

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
