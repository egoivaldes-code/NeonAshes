// ============================================================
// BLOQUE JS-05 — STATS HUMANAS (fatiga, hambre, disociación, aislamiento)
// Las 4 stats que pueden matar al jugador si llegan a 100.
//   ajustarHumano() las sube o baja y dispara la muerte si toca.
// ============================================================

// ============================================================
// RECIBOS DOMICILIADOS — HELIX BANK
// ============================================================
// Lista de cargos que HELIX te aplica periódicamente. Cada
// recibo lleva fecha del juego, concepto, importe, y si quedó
// pagado o impagado. La lista crece con el tiempo.
//
// Cuando un recibo no puede pagarse (saldo insuficiente):
//   - queda como IMPAGADO
//   - sube presión +5
//   - si acumulas 3 impagados, salta mensaje amenazante de HELIX
//
// Se diseña como lista general — más adelante podrán aparecer
// otros recibos (luz, aire purificado, tasas...).
// ============================================================
Estado.recibos = []; // {fecha, concepto, importe, pagado, saldoTras}
Estado.ultimoDiaCobrado = null; // YYYY-MM-DD del último día en el que ya cobramos el alquiler
Estado.terminalPendientes = []; // mensajes que esperan a que abras el terminal

// ============================================================
// MISIÓN DE MARA — capa 1: recogida del paquete
// ============================================================
// Estado.mision lleva el progreso de la misión. Posibles fases:
//   - null            : sin misión (no ha aceptado o ya terminó)
//   - 'mensajeRecibido': aceptó. Espera ir al terminal a leer coords.
//   - 'enRuta'        : leyó coords. En camino al Nivel 4.
//   - 'enCasillero'   : llegó al casillero, decide qué hacer.
//   - 'paqueteAbierto': abrió el paquete (vio el contenido).
//   - 'paqueteCerrado': cogió el paquete sin abrir.
//   - 'paqueteRobado' : se quedó con el paquete sin volver al bar.
//   - 'completada'    : entregó y cerró con Mara.
//
// La fase concreta dicta qué escena/diálogo se muestra al jugador.
Estado.mision = null;

// Ajusta una dimensión del estado humano, manteniéndola entre 0 y 100.
function ajustarHumano(dimension, delta){
  if(!Estado.humano) return;
  if(typeof Estado.humano[dimension] !== 'number') return;
  // Si ya estás muerto, ninguna ajuste tiene sentido. Bloqueamos.
  if(Estado.muerto) return;
  const antes = Estado.humano[dimension];
  Estado.humano[dimension] = Math.max(0, Math.min(100, antes + delta));
  const despues = Estado.humano[dimension];
  // Cambio real aplicado (puede ser distinto del delta solicitado por el clamp 0..100)
  const cambioReal = despues - antes;
  // FEEDBACK VISUAL: si la stat realmente cambió, encolamos una flechita.
  // Con esto el jugador SE ENTERA de cómo le afecta cada acción del viaje
  // (eventos, mirar ventana, dormir, encuentros...). Sin abrir el panel.
  if(cambioReal !== 0){
    encolarFlechaStat(dimension, cambioReal);
  }
  // Si cruzamos un umbral que genera noticia reactiva nueva, marcamos.
  // (Solo subiendo, no bajando, para no spamear)
  if(despues > antes){
    if((dimension === 'hambre' && antes <= 40 && despues > 40) ||
       (dimension === 'fatiga' && antes <= 70 && despues > 70) ||
       (dimension === 'aislamiento' && antes <= 60 && despues > 60)){
      marcarNoticiasActualizadas();
    }
  }
  // ============================================================
  // DETECCIÓN DE MUERTE
  // ============================================================
  // Si una stat acaba de tocar 100, el personaje muere.
  // No por daño físico directo: por colapso (psicológico,
  // social, sistémico, perceptivo). La muerte se dispara una
  // sola vez: pasamos la marca Estado.muerto a true.
  if(despues >= 100 && antes < 100){
    dispararMuerte(dimension);
  }
}


// ============================================================

// ============================================================
// BLOQUE JS-06 — COLA DE FLECHITAS DE CAMBIOS DE STAT
// Cuando una stat cambia, aparece una flechita ↑ o ↓ en pantalla.
//   Si hay varios cambios a la vez, se encolan para no superponerse.
// ============================================================

// ============================================================
// FEEDBACK VISUAL DE CAMBIOS DE STAT — flechitas en pantalla
// ============================================================
// Filosofía: cada vez que una stat sube o baja, el jugador debe
// notarlo sin abrir el panel ESTADO. Mostramos una pequeña tarjeta
// con el nombre de la stat y una flecha codificada por magnitud:
//
//   sube poco (1-5)  → ↑  verde
//   sube mucho (6+)  → ↑↑ azul cyan
//   baja poco (1-5)  → ↓  amarillo
//   baja mucho (6+)  → ↓↓ rojo magenta
//
// Las flechas se encolan: si en un mismo turno cambian dos stats,
// la segunda aparece después de la primera, sin solaparse.
const _colaFlechasStat = [];
let _procesandoFlechasStat = false;
// Bandera global: cuando es true, los cambios de stat NO disparan
// flechita visual. Se usa durante el decaimiento pasivo y otros
// momentos automáticos donde el feedback sería ruido.
let _suprimirFlechasStat = false;

const NOMBRES_STAT = {
  fatiga: 'FATIGA',
  aislamiento: 'AISLAMIENTO',
  hambre: 'HAMBRE',
  disociacion: 'DISOCIACIÓN'
};

function encolarFlechaStat(dimension, delta){
  // Solo notificamos las cuatro stats humanas conocidas.
  if(!NOMBRES_STAT[dimension]) return;
  // Si estamos en un bloque automático (decaimiento pasivo, carga
  // de partida con atenuación, etc.), no encolar nada.
  if(_suprimirFlechasStat) return;
  _colaFlechasStat.push({ dimension, delta });
  if(!_procesandoFlechasStat){
    procesarSiguienteFlechaStat();
  }
}

function procesarSiguienteFlechaStat(){
  if(_colaFlechasStat.length === 0){
    _procesandoFlechasStat = false;
    return;
  }
  _procesandoFlechasStat = true;
  const { dimension, delta } = _colaFlechasStat.shift();
  mostrarFlechaStat(dimension, delta);
  // Próxima flecha en 900ms para que se lean encadenadas sin pisarse.
  setTimeout(procesarSiguienteFlechaStat, 900);
}

function mostrarFlechaStat(dimension, delta){
  const cont = document.getElementById('stat-feedback');
  if(!cont) return;
  const abs = Math.abs(delta);
  // Magnitud + dirección → símbolo + clase de color.
  let flecha, clase;
  if(delta > 0){
    if(abs <= 5){ flecha = '↑';  clase = 'sf-up-poco';   }
    else        { flecha = '↑↑'; clase = 'sf-up-mucho';  }
  } else {
    if(abs <= 5){ flecha = '↓';  clase = 'sf-down-poco'; }
    else        { flecha = '↓↓'; clase = 'sf-down-mucho';}
  }
  const tarjeta = document.createElement('div');
  tarjeta.className = 'stat-flecha ' + clase;
  tarjeta.innerHTML = `<span class="sf-nombre">${NOMBRES_STAT[dimension]}</span><span class="sf-flecha">${flecha}</span>`;
  cont.appendChild(tarjeta);
  // Animación: entra, espera, sale. Tras salir, se borra del DOM.
  requestAnimationFrame(()=>{ tarjeta.classList.add('visible'); });
  setTimeout(()=>{ tarjeta.classList.remove('visible'); }, 1800);
  setTimeout(()=>{ if(tarjeta.parentNode) tarjeta.remove(); }, 2400);
}

// Atajos para clasificar un valor en bandas. Así los textos pueden
// preguntar "¿estoy muy fatigado?" sin chequear números exactos.
// 5 bandas: mínimo / bajo / medio / alto / extremo.
function nivel(valor){
  if(valor <= 15) return 'minimo';
  if(valor <= 35) return 'bajo';
  if(valor <= 60) return 'medio';
  if(valor <= 82) return 'alto';
  return 'extremo';
}


// ============================================================