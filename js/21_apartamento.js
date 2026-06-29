// ============================================================
// BLOQUE JS-24 — APARTAMENTO — opciones y textos según hora/franja
// Inicializa la escena del apartamento. Las opciones (ventana,
//   terminal, dormir, salir) cambian según la hora del juego.
// ============================================================

// ============================================================
// CICLO DÍA/NOCHE DEL APARTAMENTO (v0.80)
// ------------------------------------------------------------
// Calcula cuánto se ve la imagen de DÍA (#bg-apt-dia) encima de la de
// NOCHE (#bg-apt) según la hora del juego, y lo aplica como opacidad.
// El CSS hace el fundido suave. Tiempos pedidos: es de NOCHE de 19:00
// a 08:00. Día pleno entre medias. Para que amanecer y anochecer no
// sean un salto, metemos una hora de transición en cada borde:
//   · 08:00–09:00  amanece: la capa de día sube de 0 a 1
//   · 09:00–18:00  día pleno: 1
//   · 18:00–19:00  anochece: la capa de día baja de 1 a 0
//   · 19:00–08:00  noche: 0 (solo se ve la imagen de noche)
// Devuelve la opacidad usada (0..1), por comodidad de pruebas.
function opacidadDiaApartamento(fecha){
  let f = fecha;
  if(!f){
    try { f = obtenerFechaJuego(); } catch(e){ return 0; }
  }
  if(!f) return 0;
  // v0.101: cambio BINARIO día/noche para evitar el deslizamiento visual
  // que producía el solape prolongado de dos imágenes no alineadas al 100%.
  // Día de 08:00 a 20:00 (opacidad 1), noche el resto (0). El fundido
  // suave (3 s) lo aplica el CSS vía transition sobre #bg-apt-dia, así
  // las dos capas solo coexisten unos segundos reales, no una hora de juego.
  const hora = f.getHours() + f.getMinutes()/60;
  return (hora >= 8 && hora < 20) ? 1 : 0;
}

function actualizarLuzApartamento(){
  const capaDia = document.getElementById('bg-apt-dia');
  if(!capaDia) return;
  const op = opacidadDiaApartamento();
  capaDia.style.opacity = String(op);
}

function iniciarApartamento(){

  // RED DE SEGURIDAD (v0.101): si se llega aquí desde un estado de
  // exploración/expedición interrumpido (p.ej. el debug panel salta
  // directo al apartamento sin pasar por la salida normal), la clase
  // 'explorar-activo' podría haber quedado puesta, ocultando el reloj
  // diegético. La quitamos siempre al entrar al apartamento.
  document.body.classList.remove('explorar-activo');

  // Dormir sigue siendo una sola vez por visita (su flujo cierra el día).
  Estado.durmioEstaVisita = false;

  // ACCIONES AMBIENTALES (v0.78.6): ya NO se reinician por visita. Su
  // disponibilidad la decide ahora un cooldown de juego persistente
  // (ver BLOQUE JS-24B). Salir y volver a entrar ya no las recarga.
  // Si la partida es vieja (sin estos campos) o no hay ranuras aún,
  // se inicializan aquí.
  if(typeof Estado.cooldownsApt !== 'object' || Estado.cooldownsApt === null){
    Estado.cooldownsApt = {};
  }
  if(!Array.isArray(Estado.ranurasApt) || Estado.ranurasApt.length === 0){
    if(typeof _elegirRanurasIniciales === 'function'){
      Estado.ranurasApt = _elegirRanurasIniciales();
    }
  }

  const r=document.getElementById('reloj-apt');
  // El reloj del apartamento ahora lee la hora del juego real. Se
  // actualiza cada segundo. Con la velocidad x600 verás cómo van
  // pasando minutos enteros entre tic y tic.
  if(_intervaloRelojApt){ clearInterval(_intervaloRelojApt); }
  const refrescarRelojApt = () => {
    const f = obtenerFechaJuego();
    const h = String(f.getHours()).padStart(2,'0');
    const m = String(f.getMinutes()).padStart(2,'0');
    r.textContent = `${h}:${m}`;
    // Actualiza también la luz (día/noche) en vivo: si dentro del
    // apartamento cruzas el amanecer o el anochecer, lo verás fundirse.
    actualizarLuzApartamento();
  };
  refrescarRelojApt();
  _intervaloRelojApt = setInterval(refrescarRelojApt, 1000);

  // ============================================================
  // RECONOCIMIENTO NARRATIVO: el apartamento te recuerda
  // ============================================================
  // Si el jugador ha vuelto tras una partida previa, los textos
  // del apartamento cambian. El mundo no es el mismo cuando ya
  // ha pasado algo. La fuente de verdad: Estado.partidasCompletadas
  // y Estado.memoria (cargada de la partida anterior).
  ajustarTextosApartamentoSegunMemoria();

  // (La herencia ya no se cuenta aquí: se ofrece y se resuelve en la
  // ventana de herencia al confirmar identidad, antes de entrar.)

  // Si hay noticias reactivas pendientes (partida cargada con
  // estado avanzado o decisiones ya tomadas), mostramos el badge.
  if(Estado.memoria && Estado.memoria.noticiasVistas === false){
    marcarNoticiasActualizadas();
  }
}

// Decide el texto narrativo y las opciones iniciales del apartamento
// según lo que el jugador hizo en partidas previas.
// Helper: devuelve el HTML del botón "Mirar por la ventana" con el
// estado correcto según si el jugador ya miró por la ventana en esta
// visita (atenuado y no clicable) o si todavía no (activo normal).
// Se usa en TODOS los sitios donde se genera el menú del apartamento
// para garantizar que la regla se aplique en todas partes igual.
// ============================================================
// BLOQUE JS-24B — ACCIONES AMBIENTALES DEL APARTAMENTO (v0.78.6)
// ------------------------------------------------------------
// Las acciones de ambiente (mirar la ventana, fumar, ducharse...)
// ya no son "una por visita". Ahora:
//   - Hay un POOL de acciones. En pantalla se ven 3 RANURAS.
//   - Al hacer una, aplica su efecto y deja sitio a OTRA distinta
//     del pool, que entra YA EN COOLDOWN (no se puede usar al
//     instante: evita el spam de encadenar acciones).
//   - El cooldown es de 4h de JUEGO por acción y es PERSISTENTE:
//     salir y volver a entrar al apartamento no lo resetea (antes
//     el sistema "por visita" sí se podía spamear así).
//   - Una acción en cooldown se muestra en gris con un tick (✓) y
//     el tiempo de juego que le queda.
// ============================================================

// Cooldown de las acciones ambientales: 24 horas de JUEGO (v0.86.4).
// Antes eran 4h. Subido a un día entero para que las acciones de
// ambiente no se puedan repetir el mismo día y la lista respire.
const COOLDOWN_AMBIENTAL_MS = 24 * 60 * 60 * 1000;

// Hora de juego actual en milisegundos (o null si aún no hay reloj).
function _ahoraJuegoMsApt(){
  if(typeof obtenerFechaJuego === 'function'){
    try { return obtenerFechaJuego().getTime(); } catch(e){ return null; }
  }
  return null;
}

// CATÁLOGO de acciones ambientales. Cada una:
//   id        — clave interna y de cooldown
//   etiqueta  — texto del botón
//   idx       — número que recibe opcionApt() al pulsarla
//   requiere  — (opcional) función que decide si la acción tiene
//               sentido ahora mismo (p.ej. comer solo con hambre).
const AMBIENTALES_APT = [
  { id:'ventana',  etiqueta:'Mirar por la ventana',   idx:0 },
  { id:'comer',    etiqueta:'Comer algo',             idx:4,
    requiere: () => {
      const h = Estado.humano || {};
      const n = (typeof nivel === 'function') ? nivel(h.hambre) : null;
      return n === 'medio' || n === 'alto' || n === 'extremo';
    } },
  { id:'despejar', etiqueta:'Despejar la cabeza',     idx:5 },
  { id:'silencio', etiqueta:'Romper el silencio',     idx:6 },
  { id:'fumar',    etiqueta:'Fumar un cigarrillo',    idx:7 },
  { id:'periodico',etiqueta:'Leer el periódico digital', idx:8 },
  { id:'ducha',    etiqueta:'Ducharte',               idx:9 },
  { id:'espejo',   etiqueta:'Mirarte al espejo',      idx:10 },
  { id:'limpiar',  etiqueta:'Limpiar el apartamento', idx:11 },
  { id:'repisa',     etiqueta:'Mirar la repisa',       idx:12 },
  { id:'calefactor', etiqueta:'Avivar el calefactor',  idx:13 }
];

function _ambientalPorId(id){ return AMBIENTALES_APT.find(a => a.id === id) || null; }
function _ambientalPorIdx(idx){ return AMBIENTALES_APT.find(a => a.idx === idx) || null; }

// ¿Está esta acción en cooldown? Devuelve { enCd:bool, minutos:int }.
function _cdAmbiental(id){
  const cds = Estado.cooldownsApt || {};
  const sello = cds[id];
  if(!sello) return { enCd:false, minutos:0 };
  const ahora = _ahoraJuegoMsApt();
  if(ahora === null) return { enCd:false, minutos:0 };
  const transcurrido = ahora - sello;
  if(transcurrido >= COOLDOWN_AMBIENTAL_MS) return { enCd:false, minutos:0 };
  return { enCd:true, minutos: Math.ceil((COOLDOWN_AMBIENTAL_MS - transcurrido) / 60000) };
}

// Marca una acción como recién usada (arranca su cooldown desde ahora).
function _marcarCdAmbiental(id){
  if(!Estado.cooldownsApt) Estado.cooldownsApt = {};
  const ahora = _ahoraJuegoMsApt();
  if(ahora !== null) Estado.cooldownsApt[id] = ahora;
}

// Formatea el tiempo restante de cooldown de forma legible y diegética.
function _formatoCdAmbiental(minutos){
  if(minutos >= 60){
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutos}min`;
}

// Devuelve las 3 ranuras ambientales actuales. Cada ranura es un OBJETO:
//   { id: 'fumar', libreEn: 0 }     -> ranura ocupada por una acción visible
//   { id: null,   libreEn: 1234 }   -> ranura EN ESPERA (hueco vacío) hasta
//                                       la hora de juego 'libreEn' (en ms)
//
// COMPORTAMIENTO (v0.86.4, corregido):
//   - Hay 3 ranuras fijas.
//   - Al usar una acción, SU ranura queda vacía y arranca una espera de
//     24h de juego. Durante esas 24h el hueco se queda vacío (ves menos
//     de 3 botones), NO se rellena al instante.
//   - Cuando la espera de una ranura se cumple (pasan 24h), esa ranura
//     rota a OTRA acción distinta del pool que esté libre. Si en ese
//     momento no hay ninguna disponible, sigue vacía hasta que la haya.
//   - La acción usada vuelve al pool y puede reaparecer más adelante en
//     cualquier ranura, una vez cumplido su propio descanso.
//
// Se normaliza desde el formato viejo (lista de ids o nulls) por si hay
// partidas guardadas con el modelo anterior.
function _normalizarRanuras(raw){
  let ranuras = Array.isArray(raw) ? raw.slice() : [];
  ranuras = ranuras.map(r => {
    if(r && typeof r === 'object') return { id: r.id || null, libreEn: r.libreEn || 0 };
    if(typeof r === 'string') return { id: r, libreEn: 0 };   // formato viejo: id suelto
    return { id: null, libreEn: 0 };                          // null/!=: hueco listo ya
  });
  while(ranuras.length < 2) ranuras.push({ id: null, libreEn: 0 });
  if(ranuras.length > 2) ranuras = ranuras.slice(0, 2);
  return ranuras;
}

function _ranurasAmbientales(){
  let ranuras = _normalizarRanuras(Estado.ranurasApt);

  // Si está todo a cero (partida nueva), sembrar las 3 ranuras iniciales.
  const todasVacias = ranuras.every(r => !r.id && !r.libreEn);
  if(todasVacias){
    ranuras = _elegirRanurasIniciales();
  }

  const ahora = _ahoraJuegoMsApt();

  // Para cada ranura, decidir su estado actual:
  for(let pos = 0; pos < ranuras.length; pos++){
    const r = ranuras[pos];

    // ¿La acción que ocupa la ranura está en cooldown? Si la usaste, sí:
    // la vaciamos y arrancamos su espera (por si el vaciado no se hizo).
    if(r.id && _cdAmbiental(r.id).enCd){
      r.id = null;
      // libreEn ya debería estar puesto por _rotarRanuraAmbiental; si no,
      // lo calculamos a partir del cooldown de esa acción.
      if(!r.libreEn && ahora !== null) r.libreEn = ahora + COOLDOWN_AMBIENTAL_MS;
    }

    // Si la ranura está EN ESPERA y aún no le toca, no se rellena.
    if(!r.id && r.libreEn && ahora !== null && ahora < r.libreEn){
      continue; // sigue vacía: el hueco permanece
    }

    // Si la ranura está libre (sin espera, o ya cumplida), rotar a una
    // acción distinta del pool que esté disponible.
    if(!r.id){
      const visibles = new Set(ranuras.map(x => x.id).filter(Boolean));
      const candidatas = AMBIENTALES_APT.filter(a => {
        if(visibles.has(a.id)) return false;
        if(_cdAmbiental(a.id).enCd) return false;
        if(typeof a.requiere === 'function' && !a.requiere()) return false;
        return true;
      });
      if(candidatas.length > 0){
        const nueva = candidatas[Math.floor(Math.random() * candidatas.length)];
        r.id = nueva.id;
        r.libreEn = 0;
      }
      // Si no hay candidata, la ranura sigue vacía (libreEn ya cumplido).
    }
  }

  Estado.ranurasApt = ranuras.map(r => ({ id: r.id, libreEn: r.libreEn }));
  return ranuras;
}

function _elegirRanurasIniciales(){
  const candidatas = AMBIENTALES_APT.filter(a => {
    if(typeof a.requiere === 'function' && !a.requiere()) return false;
    return !_cdAmbiental(a.id).enCd;
  });
  const baraja = candidatas.slice();
  for(let i = baraja.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
  }
  const elegidas = baraja.slice(0, 2).map(a => ({ id: a.id, libreEn: 0 }));
  while(elegidas.length < 2) elegidas.push({ id: null, libreEn: 0 });
  return elegidas;
}

// Tras hacer una acción (idx), su ranura queda VACÍA y arranca su espera
// de 24h de juego. El hueco NO se rellena hasta que esa espera se cumpla
// (lo gestiona _ranurasAmbientales al repintar el menú).
function _rotarRanuraAmbiental(idHecha){
  const ranuras = _normalizarRanuras(Estado.ranurasApt);
  const pos = ranuras.findIndex(r => r.id === idHecha);
  if(pos === -1) return;
  const ahora = _ahoraJuegoMsApt();
  ranuras[pos] = { id: null, libreEn: (ahora !== null ? ahora + COOLDOWN_AMBIENTAL_MS : 0) };
  Estado.ranurasApt = ranuras.map(r => ({ id: r.id, libreEn: r.libreEn }));
}

// Genera el HTML de los botones ambientales. Solo se pintan las ranuras
// OCUPADAS por una acción disponible. Las ranuras en espera (huecos) no
// muestran nada: desaparecen de la pantalla.
function botonesAmbientales(textoVentana){
  const ranuras = _ranurasAmbientales();
  let html = '';
  for(const r of ranuras){
    if(!r.id) continue; // hueco en espera: no se pinta nada
    const acc = _ambientalPorId(r.id);
    if(!acc) continue;
    if(_cdAmbiental(acc.id).enCd) continue; // por si acaso, no mostrar en cooldown
    let etiqueta = acc.etiqueta;
    if(acc.id === 'ventana' && textoVentana) etiqueta = textoVentana;
    if(acc.id === 'calefactor') etiqueta = _calefactorEtiqueta();
    html += `<button class="opcion-btn" onclick="opcionApt(${acc.idx})">${etiqueta}</button>`;
  }
  return html;
}

// ============================================================
// BLOQUE JS-21C — ANCLA EMOCIONAL DEL APARTAMENTO (v0.123)
// ------------------------------------------------------------
// Dos anclas, integradas en el POOL de acciones ambientales (NO añaden
// botones fijos): aparecen a veces en una ranura, como fumar o la música.
//   · La repisa: objetos con peso que traes de la deriva. Mirarla asienta.
//   · El calefactor viejo: lo unico que da calor en un piso sin sol. Se
//     enfria con el tiempo si no vuelves a avivarlo; avivarlo caldea el
//     piso y a ti (alivia aislamiento). No castiga si se enfria: solo es
//     un sitio calido al que volver, o no.
// El cooldown y la rotacion los gobierna el sistema ambiental (idx 12/13).
// ============================================================

const RECUERDOS_REPISA = {
  foto_quemada:        'Una fotografía a medio quemar. No reconoces las caras, pero alguien sonreía.',
  chip_datos_corrupto: 'Un chip de datos corrupto. Dentro hay recuerdos de un desconocido que ya no se dejan leer.',
  reliquia_carne:      'Una reliquia de la Carne Perfecta. Fría al tacto. No crees en ella; la guardas igual.',
  mapa_sector:         'Un mapa del sector dibujado a mano. Calles que HELIX ya renombró, vivas todavía en la tinta.',
  nucleo_optico:       'Un núcleo óptico apagado. A veces lo miras esperando que parpadee. Nunca lo hace.',
  servidor_hundido:    'Un servidor muerto que sacaste del agua. Pesa como pesan las cosas que un día sirvieron.',
  placa_sindicato:     'Una placa del Ferro. Un recordatorio de a quién le debes seguir vivo.',
  navaja_ceramica:     'Una navaja de cerámica. La guardas por la noche en que tuviste que sacarla, no por su filo.'
};
function _aptItemsRepisa(){
  return Object.keys(RECUERDOS_REPISA).filter(id => typeof tieneItem === 'function' && tieneItem(id));
}

// --- Calefactor viejo: calor 0-100 con decaimiento por tiempo de juego. ---
const CALEFACTOR_DECLIVE_DIA = 16;  // calor perdido por día de juego sin avivarlo
const CALEFACTOR_BOOST       = 40;  // calor recuperado al avivarlo

function _calefactorEstado(){
  const m = Estado.memoria || (Estado.memoria = {});
  const ahora = _ahoraJuegoMsApt();
  if(!m.calefactor || typeof m.calefactor !== 'object'){
    m.calefactor = { calorBase: 50, decaeDesde: ahora || 0 };
  }
  const c = m.calefactor;
  if(typeof c.calorBase !== 'number') c.calorBase = 50;
  if(typeof c.decaeDesde !== 'number') c.decaeDesde = ahora || 0;
  return c;
}
function _calefactorCalor(){
  const c = _calefactorEstado();
  const ahora = _ahoraJuegoMsApt();
  if(!ahora || !c.decaeDesde) return Math.max(0, Math.min(100, c.calorBase));
  const dias = Math.max(0, (ahora - c.decaeDesde) / (24 * 60 * 60 * 1000));
  return Math.max(0, Math.round(c.calorBase - dias * CALEFACTOR_DECLIVE_DIA));
}
function _calefactorEtiqueta(){
  const cal = _calefactorCalor();
  if(cal <= 0)  return 'Encender el calefactor';
  if(cal <= 30) return 'Avivar el calefactor (frío)';
  return 'Avivar el calefactor';
}

// Texto + efectos de mirar la repisa (accion ambiental idx 12).
function _aptMirarRepisa(narr){
  const ids = _aptItemsRepisa();
  const fragHtml = (window.Trama && typeof Trama.verFragmentosHTML === 'function')
    ? Trama.verFragmentosHTML() : '';
  let html;
  if(ids.length === 0 && !fragHtml){
    html = 'La repisa junto a la cama sigue vacía, salvo polvo y la marca de algo que estuvo ahí. '
         + 'Todavía no has traído nada de fuera que quieras conservar. Quizá sea mejor así. Quizá no.';
  } else if(ids.length === 0 && fragHtml){
    html = 'La repisa junto a la cama sigue vacía de cosas.' + fragHtml;
    if(typeof ajustarHumano === 'function') ajustarHumano('aislamiento', -2);
  } else {
    html = 'Te paras un momento ante la repisa. Lo que has ido trayendo de ahí fuera, lo que no vendiste:<br><br>';
    html += ids.map(id => '· ' + RECUERDOS_REPISA[id]).join('<br>');
    html += '<br><br>No valen nada. Por eso los guardas: elegirlos fue tuyo, no de HELIX.';
    html += fragHtml;
    if(typeof ajustarHumano === 'function') ajustarHumano('aislamiento', -4);
  }
  if(narr) narr.innerHTML = html;
}

// Texto + efectos de avivar el calefactor (accion ambiental idx 13).
function _aptCalefactor(narr){
  const c = _calefactorEstado();
  const ahora = _ahoraJuegoMsApt();
  const cal = _calefactorCalor();
  const frio = cal <= 0;
  let estado;
  if(frio)           estado = 'El calefactor lleva apagado quién sabe cuánto. El piso está helado, como las Pilas de fuera, sin esa frontera tibia que lo separaba del mundo.';
  else if(cal <= 30) estado = 'El calefactor agoniza, más rojo que naranja. El frío se cuela por las juntas y se te mete en los huesos.';
  else if(cal <= 65) estado = 'El calefactor ronronea bajo y sostiene un calor justo. Suficiente para no verte el aliento.';
  else               estado = 'El calefactor está al rojo, llenando el cuarto de un calor seco y anaranjado. Lo más cercano a un hogar que tienes.';
  c.calorBase = Math.min(100, (frio ? 0 : cal) + CALEFACTOR_BOOST);
  c.decaeDesde = ahora || c.decaeDesde;
  if(typeof ajustarHumano === 'function') ajustarHumano('aislamiento', -3);
  const accion = frio
    ? 'Golpeas el viejo trasto hasta que la resistencia prende, naranja y temblona. Vuelve el calor, y con él la sensación de tener un dentro y un fuera. Te quedas un rato delante, sin más.'
    : 'Le subes la resistencia y le limpias la rejilla. El cuarto se va caldeando. Acercas las manos y, por un momento, el frío de ahí fuera deja de ser asunto tuyo.';
  if(narr) narr.innerHTML = estado + '<br><br>' + accion;
}

// Cierra una accion ambiental especial (idx 12/13): cooldown + rotacion
// + guardado + regenerar menu, igual que el resto del pool.
function _cerrarAmbientalEspecial(idx){
  const acc = (typeof _ambientalPorIdx === 'function') ? _ambientalPorIdx(idx) : null;
  if(acc){
    if(typeof _marcarCdAmbiental === 'function') _marcarCdAmbiental(acc.id);
    if(typeof _rotarRanuraAmbiental === 'function') _rotarRanuraAmbiental(acc.id);
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  ajustarTextosApartamentoSegunMemoria(true);
}

function botonVentana(texto){
  // Helper conservado para momentos puntuales (p.ej. el amanecer del
  // encargo) donde solo queremos ofrecer "mirar por la ventana" como
  // toque atmosférico, sin desplegar las 3 ranuras ambientales. La
  // regla de "una por visita" se retiró: ahora la disponibilidad de
  // las ambientales la gobierna el cooldown de juego (BLOQUE JS-24B).
  return `<button class="opcion-btn" onclick="opcionApt(0)">${texto}</button>`;
}

// Botón de dormir: solo se puede dormir UNA vez por visita al
// apartamento. Tras dormir, el botón desaparece (igual que la ventana).
// Nota: cuando la misión está cerrada o el encargo aceptado, dormir
// tiene flujos propios (cerrar el día / amanecer), así que ahí no se
// restringe — esto aplica al dormitar "normal" del menú base.
function botonDormir(texto){
  if(Estado.durmioEstaVisita === true) return '';
  return `<button class="opcion-btn" onclick="opcionApt(2)">${texto}</button>`;
}

// Botón "Ir a trabajar": aparece solo si el jugador ejerce al menos una
// profesión. Atajo directo a la jornada sin pasar por menús: abre el
// panel de Profesiones ya en su sitio, listo para elegir acción/lugar.
function botonIrTrabajar(){
  if(typeof PROFESIONES === 'undefined') return '';
  const ejerceAlguna = PROFESIONES.some(p => typeof tieneProfesion === 'function' && tieneProfesion(p.id));
  if(!ejerceAlguna) return '';
  return `<button class="opcion-btn" onclick="irATrabajarDesdeApartamento()">Ir a trabajar</button>`;
}

// Lleva al jugador directo a trabajar desde el apartamento (opción B):
// abre el panel en la subpestaña Profesiones, donde están las acciones
// del oficio (y el aviso de cooldown si toca descansar).
function irATrabajarDesdeApartamento(){
  if(typeof _subtabTrabajos !== 'undefined') _subtabTrabajos = 'oficio';
  // Si el jugador solo ejerce UN oficio, entramos directos a su submenú
  // de acciones (no tiene sentido una lista de uno). Si ejerce varios,
  // lo dejamos en la lista para que elija. (v0.101)
  if(typeof PROFESIONES !== 'undefined' && typeof tieneProfesion === 'function'
     && typeof fijarOficioAbierto === 'function'){
    const activas = PROFESIONES.filter(p => tieneProfesion(p.id));
    fijarOficioAbierto(activas.length === 1 ? activas[0].id : null);
  }
  if(typeof abrirPanelHub === 'function'){
    abrirPanelHub('trabajos');
  }
}

// Botón "comer algo": solo aparece si tienes hambre apreciable y no has
// comido ya esta visita. Comer cuesta créditos (comida cara de reparto),
// salvo que en el futuro lleves raciones en el inventario (ver opcionApt).
function botonComer(){
  if(Estado.comioEstaVisita === true) return '';
  const h = Estado.humano || {};
  const n = (typeof nivel === 'function') ? nivel(h.hambre) : null;
  // Solo ofrecemos comer si el hambre es media o superior (evita spam).
  if(!(n === 'medio' || n === 'alto' || n === 'extremo')) return '';
  return `<button class="opcion-btn" onclick="opcionApt(4)">Comer algo</button>`;
}

// Botón "despejar la cabeza": agua fría en la cara. Baja fatiga y
// disociación un poco. Una vez por visita.
function botonDespejar(){
  if(Estado.despejoEstaVisita === true) return '';
  return `<button class="opcion-btn" onclick="opcionApt(5)">Despejar la cabeza</button>`;
}

// Botón "romper el silencio": poner algo de música, sentarte un rato.
// Baja aislamiento. Una vez por visita.
function botonSilencio(){
  if(Estado.silencioEstaVisita === true) return '';
  return `<button class="opcion-btn" onclick="opcionApt(6)">Romper el silencio</button>`;
}

// Devuelve UNA sola acción ambiental, la que mejor encaja con tu estado
// actual. Prioridad: hambre apreciable → comer; fatiga alta → despejar;
// aislamiento alto → romper el silencio; en cualquier otro caso, mirar
// por la ventana. Si la acción elegida ya se usó esta visita, no se
// ofrece nada (regla: una sola acción ambiental por visita, sin reemplazo).
function botonAmbientalUnico(textoVentana){
  const h = Estado.humano || {};
  const niv = (s) => (typeof nivel === 'function') ? nivel(s) : null;
  const esAlto = (s) => { const n = niv(s); return n === 'medio' || n === 'alto' || n === 'extremo'; };
  const esAltoFuerte = (s) => { const n = niv(s); return n === 'alto' || n === 'extremo'; };

  // Elegir por prioridad de necesidad.
  if(esAlto(h.hambre) && Estado.comioEstaVisita !== true){
    return botonComer();
  }
  if(esAltoFuerte(h.fatiga) && Estado.despejoEstaVisita !== true){
    return botonDespejar();
  }
  if(esAltoFuerte(h.aislamiento) && Estado.silencioEstaVisita !== true){
    return botonSilencio();
  }
  // Por defecto: mirar por la ventana.
  return botonVentana(textoVentana || 'Mirar por la ventana');
}

// Si soloOpciones === true, regenera ÚNICAMENTE los botones del menú
// sin reescribir el texto narrativo (se usa al cerrar una acción, para
// no pisar el texto de la acción que el jugador acaba de leer).
function ajustarTextosApartamentoSegunMemoria(soloOpciones){
  const narr = document.getElementById('narr-apt');
  const opc = document.getElementById('opciones-apt');
  const fechaApt = document.querySelector('.fecha-apt');
  if(!narr || !opc) return;

  const m = Estado.memoria || {};
  const h = Estado.humano || {};
  const completadas = Estado.partidasCompletadas || 0;

  // Caso base: primera vez jugando. Sin cambios.
  if(completadas === 0 && m.aceptoEncargo === null && !m.guardoSilencio){
    // Texto original — lo dejamos como estaba.
    if(!soloOpciones){
      narr.innerHTML = 'La lluvia ácida golpea el cristal.<br>Son las tres de la mañana.<br>No recuerdas cuándo te dormiste.';
    }
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana")}
      ${botonDormir("Dormir")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal</button>`;
    return;
  }

  // === EL JUGADOR HA VUELTO. Componer texto narrativo según contexto. ===
  const lineas = [];

  // Línea 1 — la lluvia siempre está. Es lo único constante.
  lineas.push('La lluvia ácida sigue ahí. Igual que ayer.');

  // Línea 2 — varía según la decisión principal anterior
  if(m.vioFragmentoCero){
    // Disociación: la realidad va fuera de fase
    lineas.push('El reloj marca las tres. No estás seguro de que sea verdad.');
  } else if(m.aceptoEncargo === true){
    lineas.push('Hay un sabor metálico en la boca. El paquete sigue esperando.');
  } else if(m.aceptoEncargo === false){
    lineas.push('La deuda con HELIX no se ha ido durmiendo. Te despierta antes que la alarma.');
  } else if(m.guardoSilencio){
    lineas.push('Llevas horas mirando al techo sin decidir nada. Otra vez.');
  } else {
    lineas.push('Tres de la mañana otra vez. Como ayer. Como mañana.');
  }

  // Línea 3 — eco del estado humano residual
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    lineas.push('Nadie te ha llamado en todo el ciclo.');
  } else if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    lineas.push('Los párpados pesan. Anoche fue largo.');
  } else if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    lineas.push('A ratos sientes que ya has vivido esta noche.');
  } else if(completadas >= 2){
    lineas.push('Empiezas a perder la cuenta de cuántas noches llevas así.');
  }

  if(!soloOpciones){
    narr.innerHTML = lineas.join('<br>');
  }

  // === Etiqueta de la unidad: cambia si hay disociación alta ===
  if(fechaApt){
    if(nivel(h.disociacion) === 'extremo'){
      fechaApt.innerHTML = 'UNIDAD <span style="color:rgba(255,180,200,0.5)">2█3-19A</span> · LOWER STACKS';
    } else if(nivel(h.disociacion) === 'alto'){
      fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS <span style="opacity:0.4;font-size:0.7em">// ¿es aquí?</span>';
    } else {
      fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS';
    }
  }

  // === OPCIONES: varían según contexto ===
  // Si rechazó antes, el terminal probablemente trae más mala noticia
  // de HELIX. Si aceptó, hay continuidad con el encargo.
  if(m.aceptoEncargo === true){
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana")}
      ${botonDormir("Intentar dormir un poco más")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Comprobar el terminal otra vez</button>`;
  } else if(m.aceptoEncargo === false){
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana")}
      ${botonDormir("Quedarte en la cama")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal (HELIX)</button>`;
  } else if(m.vioFragmentoCero){
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana")}
      ${botonDormir("Cerrar los ojos un momento")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>`;
  } else {
    // Vuelta sin haber completado nada concreto
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana otra vez")}
      ${botonDormir("Quedarte tumbado")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal</button>`;
  }
}
function opcionApt(idx){
  const opc=document.getElementById('opciones-apt'),narr=document.getElementById('narr-apt');
  const m = Estado.memoria || {};
  const h = Estado.humano || {};

  // Detectamos si el jugador ya volvió de la misión Mara.
  // En ese caso "Dormir" tiene un sentido distinto: cierra el día.
  const misionCerrada = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';

  // TERMINAL (v0.86): al pulsar "encender terminal" entramos DIRECTO al
  // escritorio HELIX, sin el breve texto de ambiente previo (no daba
  // tiempo a leerlo y solo añadía un parpadeo). Si la misión está cerrada
  // no hay terminal que abrir: se regenera el menú base.
  if(idx === 1){
    if(misionCerrada){
      regenerarOpcionesAptCierre();
    } else if(typeof irATerminal === 'function'){
      irATerminal();
    }
    return;
  }

  // === OPCIONES 12/13: ANCLAS (repisa, calefactor) ===
  // Acciones del pool ambiental con contenido dinámico; las resolvemos
  // aquí (texto + efectos) y cerramos con cooldown+rotación como el resto.
  if(idx === 12){ _aptMirarRepisa(narr); _cerrarAmbientalEspecial(12); return; }
  if(idx === 13){ _aptCalefactor(narr);  _cerrarAmbientalEspecial(13); return; }

  // Contexto para las variantes: franja horaria + día de la semana.
  const franja = franjaHoraria();
  const dia = tipoDia();

  // Respuesta narrativa. Se construye como array de candidatos y luego
  // se elige uno al azar. Esto evita "siempre el mismo texto" en visitas
  // repetidas a la ventana, el terminal o la cama.
  let candidatos = [];
  let resp;

  // === OPCIÓN 0: MIRAR POR LA VENTANA ===
  if(idx === 0){
    candidatos = textosVentana(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 1: ENCENDER TERMINAL ===
  else if(idx === 1){
    candidatos = textosTerminal(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 2: DORMIR ===
  else if(idx === 2){
    candidatos = textosDormir(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 3: SALIR DEL APARTAMENTO → MAPA ===
  else if(idx === 3){
    abrirMapa();
    return;
  }

  // === OPCIÓN 4: COMER ALGO ===
  // Si en el futuro llevas raciones en el inventario, se gastan gratis.
  // Mientras no haya comida en el inventario, pides reparto y se cobra:
  // la comida en las Pilas es cara. Marca el resultado para el texto.
  let _comioDeInventario = false;
  if(idx === 4){
    // ¿Tienes alguna ración de comida en el inventario? (preparado para
    // cuando se añadan items de comida; hoy normalmente no hay ninguna).
    const racion = (Array.isArray(Estado.inventario))
      ? Estado.inventario.find(i => i && (i.tipo === 'comida' || /raci[oó]n|comida|barrita|comestible/i.test(i.id || '') || /raci[oó]n|comida|barrita/i.test(i.nombre || '')))
      : null;
    if(racion){
      _comioDeInventario = true;
      if(typeof quitarItem === 'function') quitarItem(racion.id, 1);
    }
    candidatos = textosComer(_comioDeInventario, m, h, franja, dia);
  }

  // === OPCIÓN 5: DESPEJAR LA CABEZA ===
  else if(idx === 5){
    candidatos = textosDespejar(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 6: ROMPER EL SILENCIO ===
  else if(idx === 6){
    candidatos = textosSilencio(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 7: FUMAR UN CIGARRILLO ===
  else if(idx === 7){
    candidatos = textosFumar(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 8: LEER EL PERIÓDICO DIGITAL ===
  else if(idx === 8){
    candidatos = textosPeriodico(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 9: DUCHARTE ===
  else if(idx === 9){
    candidatos = textosDucha(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 10: MIRARTE AL ESPEJO ===
  else if(idx === 10){
    candidatos = textosEspejo(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 11: LIMPIAR EL APARTAMENTO ===
  else if(idx === 11){
    candidatos = textosLimpiar(misionCerrada, m, h, franja, dia);
  }

  // Tras elegir el texto, si la acción es AMBIENTAL (tiene entrada en el
  // catálogo) arrancamos su cooldown y rotamos su ranura por otra del
  // pool (que entra también en cooldown: anti-spam). El idx 2 (dormir),
  // 1 (terminal) y 3 (salir) NO son ambientales y se gestionan aparte.
  const _accAmb = (typeof _ambientalPorIdx === 'function') ? _ambientalPorIdx(idx) : null;
  if(_accAmb){
    if(typeof _marcarCdAmbiental === 'function') _marcarCdAmbiental(_accAmb.id);
    if(typeof _rotarRanuraAmbiental === 'function') _rotarRanuraAmbiental(_accAmb.id);
  }

  resp = elegirAlAzar(candidatos) || 'La habitación se queda en silencio.';

  narr.style.animation='none';
  narr.style.opacity='0';
  narr.innerHTML=resp;
  setTimeout(()=>{narr.style.animation='aparecer 0.6s ease forwards';},50);

  // ============================================================
  // ESTADO HUMANO: cada acción del apartamento te afecta un poco.
  // ============================================================
  // Mirar la lluvia: calma un toque, te aísla.
  // Encender el terminal: cansa la vista y deja un poso si HELIX te roza la identidad.
  // Intentar dormir: alivia fatiga ligera, sube algo el aislamiento.
  // Salir: no hace nada por ahora (es placeholder).
  // Los efectos son pequeños y acumulativos. La ciudad va cobrando.
  if(idx === 0){
    ajustarHumano('aislamiento', 2);    // miras la calle, no a nadie
    ajustarHumano('fatiga', -1);        // un respiro
    if(m.vioFragmentoCero){
      ajustarHumano('disociacion', 3);  // viste lluvia hacia arriba; eso te marca
    }
  } else if(idx === 1){
    ajustarHumano('fatiga', 2);         // mirar la pantalla cansa
    ajustarHumano('disociacion', 1);    // HELIX y anuncios dejan un poso
  } else if(idx === 2 && !misionCerrada){
    ajustarHumano('fatiga', -8);        // un respiro corto, no una noche entera
    ajustarHumano('aislamiento', 3);    // dormir solo es estar solo
    // FIX v0.86.4: NO marcamos aquí "durmió esta visita". Pulsar Dormir
    // solo abre un submenú (Dejar que el sueño te lleve / Quedarte
    // despierto). Antes se marcaba aquí, así que al elegir "Quedarte
    // despierto" el botón Dormir desaparecía sin haber dormido. Ahora la
    // marca se pone solo al CONFIRMAR el sueño, en dormirYCerrarDia().
  } else if(idx === 4){
    // Comer: baja el hambre. Si comiste del inventario es gratis; si no,
    // pides reparto y te cobran (comida cara en las Pilas).
    if(!_comioDeInventario){
      const COSTE_COMIDA = 35; // crédito por una comida de reparto/máquina
      if(typeof ajustarCreditos === 'function'){
        ajustarCreditos(-COSTE_COMIDA);
      } else {
        Estado.creditos = Math.max(0, (Estado.creditos || 0) - COSTE_COMIDA);
        if(typeof actualizarHUD === 'function') actualizarHUD();
      }
      if(typeof notificarCambio === 'function') notificarCambio('-'+COSTE_COMIDA+' CR', 'creditos');
    }
    ajustarHumano('hambre', -22);       // sacia bien, pero no del todo
    ajustarHumano('fatiga', -2);        // comer sienta bien
  } else if(idx === 5){
    // Despejar la cabeza: agua fría. Baja fatiga y disociación.
    ajustarHumano('fatiga', -4);
    ajustarHumano('disociacion', -4);
  } else if(idx === 6){
    // Romper el silencio: música, presencia. Baja aislamiento.
    ajustarHumano('aislamiento', -5);
    ajustarHumano('fatiga', -1);
  } else if(idx === 7){
    // Fumar: un vicio. Calma un poco la tensión y el aislamiento, pero
    // no resuelve nada. Cansa el cuerpo a la larga (fatiga leve +).
    ajustarHumano('aislamiento', -3);
    ajustarHumano('fatiga', 1);
  } else if(idx === 8){
    // Leer el periódico digital: textura del mundo. Distrae un poco del
    // encierro (aislamiento leve -), pero la pantalla cansa la vista.
    ajustarHumano('aislamiento', -2);
    ajustarHumano('fatiga', 1);
  } else if(idx === 9){
    // Ducharte: más lento y completo que despejarse. Baja fatiga y
    // algo de aislamiento (te reconcilias un poco con el cuerpo).
    ajustarHumano('fatiga', -6);
    ajustarHumano('aislamiento', -3);
    ajustarHumano('disociacion', -2);
  } else if(idx === 10){
    // Mirarte al espejo: identidad y disociación. Si vas disociado,
    // mirarte fijamente lo agrava; si no, te ancla un poco.
    if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
      ajustarHumano('disociacion', 3);
    } else {
      ajustarHumano('disociacion', -3);
    }
    ajustarHumano('aislamiento', 1);
  } else if(idx === 11){
    // Limpiar el apartamento: esfuerzo (sube fatiga) a cambio de una
    // sensación de orden y control que baja aislamiento y disociación.
    ajustarHumano('fatiga', 4);
    ajustarHumano('aislamiento', -4);
    ajustarHumano('disociacion', -3);
  }
  // idx === 3 (salir, placeholder) no toca el estado humano.

  // Botones siguientes — depende del idx y del contexto.
  if(idx === 1){
    // Terminal: si misión cerrada, no hay nada que abrir; volver al menú base.
    if(misionCerrada){
      setTimeout(()=>{ regenerarOpcionesAptCierre(); }, 600);
    } else {
      // Sin paso intermedio: tras el breve texto de ambiente, entramos
      // directamente al escritorio HELIX. El escritorio ya tiene su
      // propio botón "Cerrar terminal" para volver al apartamento.
      setTimeout(()=>{ irATerminal(); }, 700);
    }
  } else if(idx === 0){
    // Ventana — devolverse al menú base con las 4 opciones.
    setTimeout(()=>{ regenerarOpcionesAptCierre(); }, 600);
  } else if(idx === 4 || idx === 5 || idx === 6 || idx === 7 || idx === 8 || idx === 9 || idx === 10 || idx === 11){
    // Acciones ambientales: tras el texto, volver al menú (regenera los
    // botones, mostrando la ranura rotada y los cooldowns actualizados).
    setTimeout(()=>{ regenerarOpcionesAptCierre(); }, 600);
  } else if(idx === 2){
    if(misionCerrada){
      // Dormir tras volver de la misión: cierra el día.
      setTimeout(()=>{
        opc.innerHTML = `<button class="opcion-btn" onclick="dormirYCerrarDia()">Dejar que el sueño te lleve →</button>`;
      }, 600);
    } else if(m.aceptoEncargo === true){
      // ENCARGO ACEPTADO: la cita con Mara es a las 06:00. Dormir aquí
      // NO debe dejar al jugador atascado: tiene que poder pasar la noche
      // y plantarse en el amanecer, listo para salir al objetivo. Antes
      // este caso daba opciones que no avanzaban el tiempo y el jugador
      // se quedaba "trujado" sin forma de llegar a la hora del encargo.
      setTimeout(()=>{
        opc.innerHTML =
          `<button class="opcion-btn" onclick="dormirHastaElEncargo()">Dormir hasta el amanecer →</button>` +
          `<button class="opcion-btn" onclick="regenerarOpcionesAptCierre()">Quedarte despierto</button>`;
      }, 500);
    } else {
      // Dormir antes de la misión (sin encargo aceptado): libertad total.
      // Puede cerrar el día y descansar, abrir el terminal, o volver al menú.
      setTimeout(()=>{
        opc.innerHTML =
          `<button class="opcion-btn" onclick="dormirYCerrarDia()">Dejar que el sueño te lleve →</button>` +
          `<button class="opcion-btn" onclick="regenerarOpcionesAptCierre()">Quedarte despierto</button>`;
      }, 500);
    }
  }
}


// ============================================================

// ============================================================
// BLOQUE JS-25 — TEXTOS DEL APARTAMENTO — variantes por hora y memoria
// Cuatro funciones grandes que devuelven el texto correcto para
//   cada opción según hayas o no aceptado el encargo, qué hora es, etc.
// ============================================================

// ============================================================
// TEXTOS DEL APARTAMENTO — variantes por estado, hora y día
// ============================================================
// Cada función devuelve un array de frases candidatas. Las que
// son siempre válidas para un contexto se acumulan; al final se
// escoge una al azar. Cuantas más frases haya en el pool, menos
// sensación de "siempre el mismo texto".
//
// Variables disponibles:
//   misionCerrada — el jugador ya volvió de la misión Mara
//   m             — Estado.memoria (aceptoEncargo, vioFragmentoCero, etc.)
//   h             — Estado.humano (fatiga, aislamiento, hambre, disociacion)
//   franja        — 'madrugada' | 'amanecer' | 'manana' | 'tarde' | 'anochecer' | 'noche'
//   dia           — 'finde' | 'semana'
// ============================================================

function textosVentana(misionCerrada, m, h, franja, dia){
  const arr = [];

  // === Variantes específicas por contexto fuerte (siempre añaden mucho color) ===
  if(misionCerrada){
    arr.push('Neón líquido sobre el cristal.<br>El paquete ya cambió de manos.<br>La ciudad sigue, indiferente.');
    arr.push('La lluvia ya no pica como antes.<br>O eres tú, que ya no la sientes igual.<br>El paquete está donde tiene que estar.');
    arr.push('Mil ventanas iguales a la tuya.<br>En ninguna sabe nadie lo que hiciste esta noche.');
    if(m.vioFragmentoCero){
      arr.push('Una sombra pasa por delante del neón rojo.<br>Pero ningún cuerpo se ha movido en la calle.<br>Apartas la vista.');
    }
  } else if(m.aceptoEncargo === true){
    arr.push('Neón líquido sobre el cristal.<br>El Nivel 4 brilla a lo lejos. Allí te esperan.<br>Ya nada se puede deshacer.');
    arr.push('Cuentas las luces del Nivel 4 hasta perder el hilo.<br>Una de ellas marca el casillero 218.<br>No sabes cuál.');
    arr.push('La lluvia pinta el cristal de naranja y azul.<br>Mara no es de fiar. Tampoco es de las que mienten.');
  } else if(m.aceptoEncargo === false){
    arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Ninguna de ellas te va a pagar la deuda.');
    arr.push('Anuncios de HELIX rebotan en los charcos.<br>«Refinancie su confianza.»<br>Cierras la persiana mental.');
    arr.push('Una ambulancia cruza Nivel 9 sin sirenas.<br>Allá abajo siempre hay alguien que ha perdido más.');
  } else if(m.vioFragmentoCero){
    arr.push('Neón líquido sobre el cristal.<br>Por un segundo, parece que la lluvia cae hacia arriba.<br>Apartas la vista.');
    arr.push('El cristal te devuelve un reflejo con un parpadeo de más.<br>Cierras los ojos. Cuando los abres, vuelves a ser uno.');
    arr.push('La fecha del anuncio luminoso de enfrente cambia.<br>Dos cifras nuevas. Las viejas. No estás seguro de cuáles.');
  }

  // === Variantes por franja horaria (se acumulan siempre que apliquen) ===
  if(franja === 'madrugada'){
    arr.push('Es la hora muerta. Hasta los anuncios parecen cansados.<br>Solo las grúas del Nivel 12 siguen moviéndose, despacio.');
    arr.push('Tres de la mañana. La lluvia es lo único que sigue trabajando.');
    if(dia === 'finde'){
      arr.push('Madrugada de fin de semana. Risas borrachas a tres calles.<br>Una botella rueda hasta caer en un sumidero.');
    }
  } else if(franja === 'amanecer'){
    arr.push('Una franja gris se cuela entre los rascacielos.<br>Aquí abajo eso es lo más parecido a un amanecer.');
    arr.push('Las farolas del Nivel 9 se apagan una por una.<br>La ciudad cambia de turno sin avisar.');
  } else if(franja === 'manana'){
    arr.push('Reparto de cápsulas térmicas en la acera de enfrente.<br>Una cola de cinco personas. Todos con el mismo abrigo.');
    arr.push('La lluvia se ha vuelto fina.<br>Por un momento se ve hasta el Nivel 4. Solo por un momento.');
    if(dia === 'semana'){
      arr.push('Trenes verticales abarrotados hacia los niveles altos.<br>Vidas con destino. La tuya, otra cosa.');
    }
  } else if(franja === 'tarde'){
    arr.push('Sombras largas entre los pilares de hormigón.<br>El neón rojo de enfrente ya se enciende, aunque hay luz.');
    arr.push('Un dron de reparto se estrella contra una antena y sigue volando.<br>Nadie levanta la vista.');
    if(dia === 'finde'){
      arr.push('Tarde de fin de semana. Música de los bares de Nivel 9 sube por el conducto.<br>Tres ritmos distintos peleando entre sí.');
    }
  } else if(franja === 'anochecer'){
    arr.push('Hora dorada de neón. Todo lo gris se vuelve violeta por un rato.<br>Es la única vez que la ciudad parece tener intenciones.');
    arr.push('Las luces de las unidades de enfrente se van encendiendo.<br>Cada ventana, una vida en pausa.');
  } else if(franja === 'noche'){
    arr.push('Noche cerrada. Las grúas tiñen los nubarrones de naranja sucio.<br>En el cristal, solo te ves a ti.');
    arr.push('Los anuncios de HELIX brillan más fuerte al caer el sol.<br>Como si ahora tuvieran público.');
    if(dia === 'finde'){
      arr.push('Sábado por la noche en Lower Stacks.<br>Risas, vidrio roto, una sirena que viene y se va.<br>El ruido de fondo de los que no son tú.');
    }
  }

  // === Variantes por estado humano ===
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Ni una sola que te conozca.');
    arr.push('Cuentas las ventanas iluminadas hasta perder el hilo.<br>Ninguna te devuelve la mirada.');
  }
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('La frente apoyada en el cristal. Frío.<br>La ciudad se vuelve borrosa antes de que tus ojos lo decidan.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    arr.push('El olor a sopa barata sube por la rejilla del balcón.<br>Te giras antes de empezar a calcular lo que cuesta.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Por un segundo no estás seguro de estar mirando desde dentro.<br>Te tocas el cristal para confirmarlo.');
  }

  // === Fallback genérico ===
  arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Siempre vendiendo. Siempre vigilando.');
  arr.push('La lluvia ácida deja regueros que parecen palabras.<br>Si las hubiera, no querrías leerlas.');
  arr.push('Un pájaro mecánico choca contra una valla luminosa.<br>Se levanta. Sigue. Algo en eso te resulta familiar.');

  return arr;
}

// COMER — varía según si fue del inventario (gratis) o reparto (de pago),
// la hora y el nivel de hambre. Pool amplio para que no suene repetido.
function textosComer(deInventario, m, h, franja, dia){
  const arr = [];

  if(deInventario){
    arr.push('Sacas lo que te quedaba y comes de pie, junto a la encimera.<br>No es gran cosa. Pero es tuyo, y eso ya es raro aquí.');
    arr.push('Comes despacio lo que llevabas encima.<br>El estómago lo agradece antes que tú.');
    arr.push('Lo último de tus reservas.<br>Mañana tocará buscar más. Hoy, al menos, no pasas hambre.');
  } else {
    arr.push('Pides reparto. Tarda doce minutos y llega frío.<br>Caro, plástico, anónimo. Pero el estómago deja de protestar.');
    arr.push('La máquina del rellano escupe una ración tibia por un precio que duele.<br>Sabe a sal y a poco más. Suficiente para callar el hambre.');
    arr.push('Un cuenco de fideos sintéticos de la cocina automática de abajo.<br>Treinta y cinco créditos por algo que finge ser comida. Te lo comes igual.');
    arr.push('Comida de reparto HELIX: «Nutrición garantizada».<br>No garantiza sabor. Tampoco lo esperabas. El hambre afloja.');
  }

  if(franja === 'madrugada' || franja === 'noche'){
    arr.push('Comer a estas horas tiene algo de derrota.<br>Lo haces de espaldas a la ventana, sin encender la luz grande.');
  } else if(franja === 'amanecer' || franja === 'manana'){
    arr.push('Primera cosa que comes en lo que va de ciclo.<br>El cuerpo lo recibe como quien recibe a un viejo conocido del que ya no se fía.');
  }

  if(nivel(h.hambre) === 'extremo'){
    arr.push('Llevabas demasiado sin comer. Las primeras cucharadas casi duelen.<br>Te obligas a ir despacio. El cuerpo quiere más de lo que conviene.');
  }
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('Comes solo, como casi siempre.<br>En algún piso de enfrente, alguien cena acompañado. No piensas en ello. Lo intentas.');
  }

  arr.push('Comes sin pensar demasiado.<br>El hambre era ruido de fondo. Ahora hay un poco menos de ruido.');
  return arr;
}

// DESPEJAR LA CABEZA — agua fría, un momento de pausa. Baja fatiga y
// disociación. Variantes por estado y hora.
function textosDespejar(misionCerrada, m, h, franja, dia){
  const arr = [];

  arr.push('Agua fría en la cara. El grifo escupe con presión irregular.<br>Por un segundo, el mundo vuelve a estar a la distancia correcta.');
  arr.push('Te mojas la nuca y la frente.<br>El espejo te devuelve una cara que reconoces casi del todo.');
  arr.push('Dejas correr el agua y metes las manos debajo.<br>Frío. Real. Te anclas a eso un momento.');

  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('El agua fría te trae de vuelta de donde fuera que estabas.<br>Te miras las manos hasta convencerte de que son las tuyas.');
    arr.push('Te echas agua hasta que el reflejo deja de ir medio segundo por detrás de ti.<br>Funciona. Por ahora.');
  }
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('El frío te espabila lo justo para seguir un rato más.<br>No es descanso. Es aplazar el cansancio.');
  }
  if(franja === 'madrugada'){
    arr.push('A esta hora el agua sale casi helada de la tubería.<br>Te despeja de golpe. La madrugada se vuelve un poco más soportable.');
  }

  arr.push('Un momento frente al lavabo. Respiras.<br>No arregla nada. Pero la cabeza pesa un poco menos.');
  return arr;
}

// ROMPER EL SILENCIO — música, ruido de fondo, presencia. Baja aislamiento.
function textosSilencio(misionCerrada, m, h, franja, dia){
  const arr = [];

  arr.push('Pones algo de música baja en el terminal. Una emisora vieja del Nivel 9.<br>No la escuchas del todo. Pero el silencio deja de ocupar toda la habitación.');
  arr.push('Dejas la radio encendida en una frecuencia cualquiera.<br>Voces de desconocidos llenando el aire. Es casi como no estar solo.');
  arr.push('Te sientas y dejas que el ruido de la ciudad entre por la rejilla.<br>Lluvia, tráfico, alguien que ríe lejos. La vida de otros, prestada un rato.');

  if(nivel(h.aislamiento) === 'extremo'){
    arr.push('Llevabas demasiado tiempo en silencio. Cualquier voz vale.<br>Subes el volumen un poco. Lo justo para no oírte pensar.');
  }
  if(franja === 'noche' && dia === 'finde'){
    arr.push('Los bares de abajo laten a través del suelo.<br>Dejas que el bajo marque el ritmo de la habitación. Por un rato, formas parte de algo.');
  } else if(franja === 'madrugada'){
    arr.push('A estas horas solo hay emisoras automáticas y locutores grabados.<br>Aun así, una voz es una voz. La dejas puesta.');
  }

  arr.push('Algo de sonido para que las paredes no estén tan calladas.<br>No es compañía. Pero se le parece lo suficiente esta noche.');
  return arr;
}


// === TEXTOS DE LAS ACCIONES AMBIENTALES NUEVAS (v0.78.6) ===
// Mismo patrón que textosVentana/Comer/etc.: array de candidatos, se
// elige uno al azar. Tono noir melancólico, sin humor, con variantes
// por estado humano y franja horaria.

function textosFumar(misionCerrada, m, h, franja, dia){
  const arr = [];
  arr.push('Enciendes uno. La primera calada siempre sabe a tregua.<br>Las siguientes solo saben a costumbre.');
  arr.push('El humo sube recto hasta que el ventilador lo rompe.<br>Lo miras deshacerse. Es lo único que se mueve en la habitación.');
  arr.push('Fumas junto al cristal, viendo la brasa reflejada sobre la lluvia.<br>Dos luces pequeñas en mitad de la nada.');
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('Fumar te da algo que hacer con las manos.<br>Algo que no sea contar las horas que llevas sin hablar con nadie.');
  }
  if(franja === 'madrugada'){
    arr.push('A esta hora el cigarrillo es casi una conversación.<br>Tú preguntas, la brasa responde con un crujido. Os entendéis.');
  }
  arr.push('Lo apuras hasta el filtro. Sabes que no deberías.<br>Hay cosas que se hacen precisamente por eso.');
  return arr;
}

function textosPeriodico(misionCerrada, m, h, franja, dia){
  const arr = [];
  arr.push('Pasas titulares en el terminal sin pulsar ninguno.<br>"HELIX amplía cobertura médica en el Nivel 4." Abajo no llega nada de eso.');
  arr.push('El boletín de las Pilas: dos desaparecidos, un corte de agua, una promoción de créditos al consumo.<br>El orden de importancia lo decide alguien que no vive aquí.');
  arr.push('Anuncios entre noticia y noticia. Siempre la misma sonrisa corporativa.<br>"Tu futuro, asegurado." Cierras antes de que cargue el resto.');
  if(franja === 'madrugada'){
    arr.push('A estas horas el feed se repite en bucle.<br>Las mismas tres noticias reordenadas, como si el mundo también durmiera mal.');
  }
  if(m.aceptoEncargo === false){
    arr.push('Un recuadro de HELIX recuerda los plazos de morosidad domiciliada.<br>No sabes si es publicidad o una advertencia personal. Quizá las dos.');
  }
  arr.push('Lees sin leer. Los ojos resbalan por las palabras.<br>Te enteras de todo y no recuerdas nada. Como siempre.');
  return arr;
}

function textosDucha(misionCerrada, m, h, franja, dia){
  const arr = [];
  arr.push('El agua tarda en calentarse. Cuando lo hace, te quedas más de lo necesario.<br>Por una vez, el ruido de las tuberías tapa el de la ciudad.');
  arr.push('Te duchas a oscuras. El vapor empaña el poco neón que entra por la rejilla.<br>Sales sintiéndote, por un momento, una persona nueva. Dura poco.');
  arr.push('El agua arrastra el día por el desagüe. Mugre, sudor, lo demás no se va tan fácil.<br>Pero algo se lleva. Lo justo para seguir.');
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('Apoyas la frente en los azulejos fríos y dejas correr el agua.<br>No es descanso, pero se le acerca. El cuerpo deja de pesar tanto.');
  }
  if(franja === 'madrugada'){
    arr.push('A esta hora el agua sale casi helada al principio.<br>Te despeja de golpe. Luego el calor llega como una disculpa.');
  }
  arr.push('Cierras el grifo y te quedas quieto, goteando.<br>El silencio vuelve despacio, llenando otra vez cada esquina.');
  return arr;
}

function textosEspejo(misionCerrada, m, h, franja, dia){
  const arr = [];
  arr.push('Te miras en el espejo del baño. La cara de siempre, un poco más cansada.<br>Te sostienes la mirada hasta que resulta incómodo. Luego un poco más.');
  arr.push('El espejo tiene una grieta en una esquina. Te divide la cara en dos.<br>Ninguna de las dos mitades te termina de convencer.');
  arr.push('Te observas como si fueras otra persona. Casi lo consigues.<br>Hay noches en que reconocerte cuesta más que otras.');
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('El reflejo parpadea medio segundo después que tú.<br>Lo compruebas dos veces. La tercera ya no estás seguro de quién va primero.');
    arr.push('Por un instante la cara del espejo no parece la tuya.<br>Apartas la vista antes de averiguar de quién es.');
  } else {
    arr.push('Te lavas la cara y te miras gotear. Sigues siendo tú.<br>Es poco, pero algunos días es lo único confirmado.');
  }
  arr.push('Apagas la luz del baño con tu cara todavía flotando en el cristal.<br>Sigue ahí cuando ya no la ves. Eso es lo que más inquieta.');
  return arr;
}

function textosLimpiar(misionCerrada, m, h, franja, dia){
  const arr = [];
  arr.push('Recoges sin método: una taza, ropa del suelo, un cable que no va a ningún sitio.<br>El apartamento no queda limpio. Queda menos rendido. Por hoy basta.');
  arr.push('Ordenas la mesa, alineas lo poco que tienes.<br>Un orden frágil contra todo lo de fuera. Sabes que no aguanta, pero lo haces igual.');
  arr.push('Pasas un trapo por la repisa. El polvo vuelve antes de que termines.<br>Aun así sienta bien hacer algo con las manos que no sea esperar.');
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('Limpiar es una forma de fingir que esperas visita.<br>No esperas a nadie. Pero la habitación no tiene por qué saberlo.');
  }
  if(franja === 'madrugada'){
    arr.push('Limpiar a estas horas es admitir que no vas a dormir.<br>Al menos el ruido del trapo llena el hueco que dejaría el sueño.');
  }
  arr.push('Terminas y miras la habitación desde la puerta.<br>Un poco más tuya. Un poco menos celda. La diferencia es pequeña, pero existe.');
  return arr;
}


function textosTerminal(misionCerrada, m, h, franja, dia){
  const arr = [];

  if(misionCerrada){
    arr.push('La pantalla parpadea.<br>Nada nuevo. La bandeja está vacía.<br>Por ahora.');
    arr.push('Un cursor verde marca el ritmo del silencio.<br>Lo dejas hacer.');
    arr.push('La pantalla pregunta si quieres comprobar actualizaciones.<br>Le dices que no con la mano. No te mira.');
  } else if(m.aceptoEncargo === true){
    arr.push('La pantalla parpadea.<br>Las coordenadas siguen ahí.<br>Sigue siendo real.');
    arr.push('Relees el mensaje cifrado.<br>Cada vez parece más corto. Como si lo supieras ya.');
    arr.push('El timestamp del mensaje no cuadra con el reloj.<br>Adelantado. Como si lo hubieras leído antes.');
  } else if(m.aceptoEncargo === false){
    arr.push('La pantalla parpadea.<br>HELIX. Otra vez HELIX.<br>El número de la deuda ha subido.');
    arr.push('Tres recordatorios de pago en cola.<br>Los marcas como leídos sin abrirlos.');
    arr.push('Un anuncio en bucle: «Refinancie su confianza.»<br>Cortas la conexión. El anuncio sigue dos segundos más.');
  } else if(m.vioFragmentoCero){
    arr.push('La pantalla parpadea.<br>Una notificación cifrada.<br><span style="opacity:0.6">El timestamp dice una hora que aún no ha llegado.</span>');
    arr.push('Por un segundo el cursor se mueve sin que tú lo hayas tocado.<br>Una sola vez. Solo una.');
  } else {
    arr.push('La pantalla parpadea.<br>Una notificación cifrada.<br>Alguien sabe dónde estás.');
    arr.push('El terminal pita una vez. Sin razón aparente.<br>Cuando miras, no hay nada nuevo.');
  }

  // Variantes por hora (más sutiles, se acumulan)
  if(franja === 'madrugada'){
    arr.push('A esta hora solo escriben los bots y los acreedores.<br>La pantalla lo sabe; baja el brillo sola.');
  } else if(franja === 'amanecer'){
    arr.push('El terminal se sincroniza con los servidores del distrito.<br>Tarda más de lo que debería. Como tú.');
  } else if(franja === 'tarde' || franja === 'anochecer'){
    arr.push('El sol entra de lado y borra parte del texto en pantalla.<br>Te mueves para leerlo. La luz se mueve también.');
  } else if(franja === 'noche'){
    arr.push('La pantalla es la única luz de la habitación.<br>Tu cara se refleja en ella. Más cansada que antes.');
  }

  // Estado humano residual
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('Las líneas de texto bailan un poco al leerlas.<br>Cierras un ojo. Sigue bailando.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Por un instante el cursor parece ir hacia atrás.<br>Como si la pantalla rebobinara. Solo un instante.');
  }

  return arr;
}

function textosDormir(misionCerrada, m, h, franja, dia){
  const arr = [];

  if(misionCerrada){
    arr.push('Te tumbas. Esta vez el cuerpo cede.<br>La ciudad sigue ahí afuera. Tú no, por unas horas.');
    arr.push('Los músculos te tiemblan al relajarse.<br>No sabías que estaban tensos hasta que dejan de estarlo.');
    arr.push('Cierras los ojos. La oscuridad detrás de los párpados es la primera oscuridad real en horas.');
  } else if(m.aceptoEncargo === true){
    arr.push('Pones la alarma mental en el amanecer.<br>El encargo te espera al alba. Lo sabes. Duermes igual.');
    arr.push('Cierras los ojos. El número del casillero late detrás de los párpados.<br>Hasta que el cansancio gana.');
    arr.push('La cita es a las seis. Faltan horas.<br>Te dejas caer. Que el cuerpo descanse lo que pueda.');
  } else if(m.aceptoEncargo === false){
    arr.push('La ciudad nunca duerme.<br>Tú tampoco.<br>La deuda tampoco.');
    arr.push('El número de la deuda se te queda flotando en la oscuridad.<br>Lo intentas borrar. Vuelve.');
  } else if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('La ciudad nunca duerme.<br>Y tú casi tampoco.<br>Pero los párpados ya no responden.');
    arr.push('El cansancio gana sin avisar. Te despiertas sin recordar haberte dormido.');
  } else {
    arr.push('La ciudad nunca duerme.<br>Tú tampoco.');
    arr.push('Te tumbas. El techo tiene una grieta nueva. O quizás siempre estuvo ahí.');
  }

  // Variantes por hora
  if(franja === 'madrugada'){
    arr.push('Es la hora correcta para dormir, pero ya no te acuerdas de cómo.');
  } else if(franja === 'amanecer'){
    arr.push('Se cuela una franja de luz gris.<br>Dormir ahora es renunciar al día. Lo haces sin pensarlo.');
  } else if(franja === 'manana' || franja === 'tarde'){
    arr.push('A esta hora dormir es esconderse.<br>Lo prefieres. No te juzgues.');
  } else if(franja === 'anochecer' || franja === 'noche'){
    arr.push('Los neones de fuera pintan el techo de violeta y rojo.<br>Dormir aquí es como dormir dentro de un anuncio.');
  }

  // Día
  if(dia === 'finde' && (franja === 'madrugada' || franja === 'noche')){
    arr.push('Música amortiguada de un bar a tres calles.<br>Alguien grita por ganar algo. O por perderlo.');
  }

  // Estado humano
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('La cama está fría en los dos lados.<br>Solo usas uno. Eso no debería sorprenderte ya.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    arr.push('El estómago hace ruido. Le pides que se calle.<br>Te ignora.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Te ves dormir desde fuera.<br>Decides no decírtelo cuando despiertes.');
  }

  return arr;
}

function textosSalir(misionCerrada, m, h, franja, dia){
  const arr = [];

  // Salir sigue siendo placeholder, pero la atmósfera puede cambiar.
  arr.push('Aún no hay otros sitios a los que ir desde aquí.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  arr.push('Pones la mano sobre el cerrojo. No lo abres.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  arr.push('Aún no es momento de salir.<br>Aún no sabes adónde irías.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');

  if(franja === 'madrugada'){
    arr.push('A esta hora, salir es buscar problemas que aún no te buscan.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  } else if(franja === 'amanecer'){
    arr.push('El distrito empieza a despertarse.<br>Hoy no te toca a ti.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  } else if(franja === 'noche' && dia === 'finde'){
    arr.push('Noche de fin de semana. Las calles llenas.<br>Mejor mañana. O nunca.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  }

  if(misionCerrada){
    arr.push('Ya has salido bastante por esta noche.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  }

  return arr;
}

// Regenera el menú del apartamento con las 4 opciones. Se usa
// tras leer un texto narrativo (mirar ventana, intento de salir,
// terminal sin mensajes, etc.) para volver al estado "decidiendo".
function regenerarOpcionesAptCierre(){
  const opc = document.getElementById('opciones-apt');
  if(!opc) return;
  // GUARD (v0.86): este punto se alcanza también al VOLVER de la misión
  // de Mara (volverApartamentoDesMapa), que NO pasa por iniciarApartamento.
  // Sin esto, las ranuras/cooldowns de las acciones ambientales no están
  // inicializados y los botones de ambiente salen incompletos. Aseguramos
  // que existan antes de pintar.
  if(typeof Estado.cooldownsApt !== 'object' || Estado.cooldownsApt === null){
    Estado.cooldownsApt = {};
  }
  if(!Array.isArray(Estado.ranurasApt) || Estado.ranurasApt.length === 0){
    if(typeof _elegirRanurasIniciales === 'function'){
      Estado.ranurasApt = _elegirRanurasIniciales();
    }
  }
  const misionCerrada = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';
  if(misionCerrada){
    // Al volver de la misión, asegurar que el texto narrativo tiene
    // contenido real (si no, queda un nodo vacío que descuadra el layout
    // empujando los botones — el "texto invisible"). Solo lo rellenamos
    // si está vacío, para no pisar una narración recién mostrada.
    const narr = document.getElementById('narr-apt');
    if(narr && narr.textContent.trim() === ''){
      narr.innerHTML = 'Vuelves a tu unidad. La puerta se cierra con el mismo chasquido de siempre.<br>El silencio te recibe, igual que lo dejaste.';
    }
    // Versión post-misión: textos más cansados.
    opc.innerHTML = `
      ${botonesAmbientales("Mirar por la ventana")}
      ${botonDormir("Dormir")}
      ${botonIrTrabajar()}
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>`;
  } else {
    // Estado normal: regeneramos SOLO los botones, sin reescribir el
    // texto narrativo (que ahora muestra el resultado de la acción).
    if(typeof ajustarTextosApartamentoSegunMemoria === 'function'){
      ajustarTextosApartamentoSegunMemoria(true);
    }
  }
}

// Llamado cuando el jugador pulsa "dormir" después de volver de la misión.
// Lleva al "eco" del apartamento que cierra el día sin forzar el final.
function dormirYCerrarDia(){
  // === DORMIR ES SIEMPRE UN DESCANSO, NUNCA UN FINAL ===
  // El juego no termina por dormir. Se avanza tiempo, se recupera fatiga,
  // y se vuelve al apartamento con todas las opciones. Esto permite jugar
  // múltiples días, ver más recibos, más eventos, etc.
  //
  // Solo la PRIMERA VEZ que se duerme después de completar la misión Mara
  // se muestra el "eco" como pieza narrativa breve de cierre de arco. Tras
  // leerlo, el jugador vuelve al apartamento y la vida sigue.
  const yaVioEco = Estado.memoria && Estado.memoria.ecoVisto;
  const misionRecienHecha = Estado.mision === 'volvioApartamento' && !yaVioEco;

  if(misionRecienHecha){
    // Primera (y única) vez: pieza narrativa del eco. Luego vuelve al apt.
    saltoDeEscena();
    // Dormir una noche entera tras la misión recupera fatiga de verdad.
    // Antes era -10 sobre una escala 0-100: insuficiente, la barra se
    // quedaba alta y el jugador sentía que descansar no servía de nada.
    ajustarHumano('fatiga', -45);
    // Marcamos el arco principal como cerrado pero la PARTIDA SIGUE VIVA.
    Estado.mision = 'completada';
    if(Estado.memoria) Estado.memoria.ecoVisto = true;
    Estado.partidasCompletadas = (Estado.partidasCompletadas || 0) + 1;
    if(typeof guardarPartida === 'function') guardarPartida();
    cambiarEscena('apartamento', 'eco-escena');
    if(typeof mostrarEcoMensaje === 'function') mostrarEcoMensaje();
    return;
  }

  // Cualquier otro caso (antes de misión, o ya viste el eco): solo descansas.
  saltoDeEscena();
  // FIX v0.86.4: la marca de "ya durmió esta visita" se pone AQUÍ, al
  // confirmar el sueño de verdad (no al abrir el submenú). Así "Quedarte
  // despierto" ya no hace desaparecer el botón Dormir.
  const m = Estado.memoria || {};
  if(m.aceptoEncargo !== true) Estado.durmioEstaVisita = true;
  // Una noche completa de sueño descansa de verdad. -40 sobre 0-100
  // saca al jugador de las bandas alta/extrema casi siempre.
  ajustarHumano('fatiga', -40);
  ajustarHumano('aislamiento', 2);
  // Avanzar el tiempo del juego unas 6-8 horas.
  if(typeof avanzarTiempoJuego === 'function'){
    avanzarTiempoJuego(60 * (6 + Math.floor(Math.random() * 3)));
  }
  // Guardar y mostrar un texto breve al despertar, manteniendo
  // al jugador en el apartamento con sus 4 opciones.
  if(typeof guardarPartida === 'function') guardarPartida();
  const narr = document.getElementById('narr-apt');
  if(narr){
    narr.style.animation = 'none';
    narr.style.opacity = '0';
    const textosDespertar = [
      'Te despiertas sin saber cuánto has dormido.<br>La lluvia sigue golpeando el cristal.',
      'Abres los ojos. La habitación está igual.<br>Tú también.',
      'Sueñas con una luz fluorescente. Te despiertas.<br>Era el techo.',
      'Has dormido. Lo notas porque tienes hambre.<br>No mucho más.'
    ];
    narr.innerHTML = textosDespertar[Math.floor(Math.random() * textosDespertar.length)];
    setTimeout(()=>{ narr.style.animation = 'aparecer 0.6s ease forwards'; }, 50);
  }
  // Regenerar las opciones del apartamento.
  if(typeof regenerarOpcionesAptCierre === 'function') regenerarOpcionesAptCierre();
}

// Llamado cuando el jugador duerme TENIENDO el encargo de Mara aceptado.
// La cita es a las 06:00. Antes este caso dejaba al jugador atascado:
// las opciones de dormir no avanzaban el tiempo ni daban forma de llegar
// a la hora del encargo. Ahora dormir descansa de verdad, te lleva al
// amanecer, y te deja en el apartamento con una salida CLARA al objetivo.
function dormirHastaElEncargo(){
  saltoDeEscena();
  // Descanso real antes de la noche larga.
  ajustarHumano('fatiga', -40);
  ajustarHumano('aislamiento', 2);
  // Llevar el reloj cerca del amanecer / hora del encargo.
  if(typeof avanzarTiempoJuego === 'function'){
    avanzarTiempoJuego(60 * (5 + Math.floor(Math.random() * 2))); // 5-6 horas
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  const narr = document.getElementById('narr-apt');
  if(narr){
    narr.style.animation = 'none';
    narr.style.opacity = '0';
    narr.innerHTML = 'Te despiertas antes de que suene nada.<br>La ciudad está gris. Es casi la hora.<br>El casillero te espera.';
    setTimeout(()=>{ narr.style.animation = 'aparecer 0.6s ease forwards'; }, 50);
  }
  // Dejar opciones con SALIDA AL OBJETIVO bien visible. El jugador no
  // puede quedarse sin forma de arrancar la misión que ya aceptó.
  const opc = document.getElementById('opciones-apt');
  if(opc){
    setTimeout(()=>{
      opc.innerHTML =
        `<button class="opcion-btn" onclick="irAlObjetivoMara()" style="border-color:rgba(255,0,110,0.4);">Salir hacia el casillero →</button>` +
        `<button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>` +
        `${typeof botonVentana === 'function' ? botonVentana('Mirar por la ventana') : ''}`;
    }, 500);
  }
}

// Arranque de la misión Mara desde el apartamento (tras dormir hasta el
// encargo). Reutiliza el mismo flujo que el terminal/panel de trabajos,
// con las mismas guardas anti-bucle.
function irAlObjetivoMara(){
  if(typeof iniciarMisionDesdeTrabajos === 'function'){
    iniciarMisionDesdeTrabajos();
  } else if(typeof irATransito === 'function'){
    irATransito();
  }
}


// ============================================================