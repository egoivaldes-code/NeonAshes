// ============================================================
// BLOQUE JS-07 — TIEMPO DE JUEGO — utilidades de hora/franja/día
// Funciones que dicen si es "mañana", "tarde", "noche", o si
//   estamos en día laborable / fin de semana.
// ============================================================

// ============================================================
// HELPERS DE CONTEXTO — usados por los textos del apartamento
// y de las ubicaciones para que cambien con la hora, el día
// y el estado. Cuando hay varias frases válidas se elige una
// al azar; esto evita la sensación de "siempre el mismo texto".
// ============================================================

// Franja horaria del reloj del juego.
// 'madrugada' 00–05 · 'amanecer' 05–08 · 'manana' 08–12
// 'tarde' 12–18 · 'anochecer' 18–21 · 'noche' 21–24
function franjaHoraria(){
  let f;
  try { f = obtenerFechaJuego(); }
  catch(e){ return 'madrugada'; }
  if(!f) return 'madrugada';
  const h = f.getHours();
  if(h < 5) return 'madrugada';
  if(h < 8) return 'amanecer';
  if(h < 12) return 'manana';
  if(h < 18) return 'tarde';
  if(h < 21) return 'anochecer';
  return 'noche';
}

// Tipo de día: fin de semana (sábado/domingo) o entre semana.
// getDay(): 0 = domingo, 6 = sábado.
function tipoDia(){
  let f;
  try { f = obtenerFechaJuego(); }
  catch(e){ return 'semana'; }
  if(!f) return 'semana';
  const d = f.getDay();
  return (d === 0 || d === 6) ? 'finde' : 'semana';
}

// Elige un elemento al azar de un array. Si está vacío devuelve null.
function elegirAlAzar(arr){
  if(!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}


// ============================================================

// ============================================================
// BLOQUE JS-11 — FECHA Y HORA DEL UNIVERSO DEL JUEGO
// La fecha de inicio del juego (25 dic 2247, 03:14) y el factor
//   de tiempo (cuántos segundos de juego pasan por segundo real).
// ============================================================

// ============================================================
// TIEMPO DIEGÉTICO — fecha y hora del universo del juego
// ============================================================
// El tiempo arranca el 25 de diciembre de 2247 a las 03:14 AM,
// la hora exacta a la que el jugador despierta con el mensaje de Mara.
// Avanza al ritmo real (1 segundo real = 1 segundo en el juego).
// Se persiste entre sesiones: si el jugador vuelve, el tiempo
// continúa desde donde lo dejó.

const FECHA_INICIO_JUEGO = new Date(
  LAUNCHER.FECHA_INICIO_AÑO, LAUNCHER.FECHA_INICIO_MES, LAUNCHER.FECHA_INICIO_DIA,
  LAUNCHER.FECHA_INICIO_HORA, LAUNCHER.FECHA_INICIO_MIN, LAUNCHER.FECHA_INICIO_SEG
);

// Inicializa el tiempo del juego si no hay uno previo.
// ============================================================
// VELOCIDAD DEL TIEMPO Y PAUSA
// ============================================================
// 1 segundo real = 1 minuto de juego (60 segundos de juego).
// Un día entero del juego se vive en 24 minutos reales.
//
// El reloj se PAUSA al abrir cualquier panel del hub (estado,
// contactos, noticias, trabajos) para que mirar las cosas no
// te cueste minutos de juego. Se reanuda al cerrarlo.
//
// Las escenas (terminal, bar, tránsito) avanzan +50 a +70 minutos
// de golpe al entrar — son "saltos" narrativos.
// ============================================================

const FACTOR_TIEMPO = LAUNCHER.FACTOR_TIEMPO; // segundos de juego por cada segundo real
let _tiempoPausado = false;
let _timestampPausa = 0; // momento real en que empezó la pausa
let _intervaloRelojApt = null; // intervalo del reloj de la pared del apartamento

function inicializarTiempoJuego(){
  if(Estado.tiempoJuego && Estado.tiempoJuego.timestampJuego){
    // Recargamos desde una partida previa. Re-anclamos el reloj real.
    Estado.tiempoJuego.timestampReal = Date.now();
  } else {
    Estado.tiempoJuego = {
      timestampJuego: FECHA_INICIO_JUEGO.getTime(),
      timestampReal: Date.now()
    };
  }
  _tiempoPausado = false;
}

// Devuelve la fecha actual EN EL UNIVERSO DEL JUEGO.
// El tiempo de juego corre FACTOR_TIEMPO veces más rápido que el real.
function obtenerFechaJuego(){
  if(!Estado.tiempoJuego){
    return new Date(FECHA_INICIO_JUEGO);
  }
  // Si está pausado, devolvemos el momento en que se pausó.
  const ahora = _tiempoPausado ? _timestampPausa : Date.now();
  const transcurridoReal = ahora - Estado.tiempoJuego.timestampReal;
  return new Date(Estado.tiempoJuego.timestampJuego + transcurridoReal * FACTOR_TIEMPO);
}

// Avanza el reloj de juego en una cantidad concreta de minutos.
// Útil para los saltos de escena (+50 a +70 min).
function avanzarTiempoJuego(minutos){
  if(!Estado.tiempoJuego) return;
  // Anclamos primero el "ahora" para no perder el tiempo transcurrido,
  // y luego sumamos los minutos del salto.
  const fechaAhora = obtenerFechaJuego().getTime();
  Estado.tiempoJuego.timestampJuego = fechaAhora + (minutos * 60 * 1000);
  Estado.tiempoJuego.timestampReal = Date.now();
}

// Pausa el reloj del juego. Se llama al abrir un panel del hub.
function pausarTiempoJuego(){
  if(_tiempoPausado) return;
  _tiempoPausado = true;
  _timestampPausa = Date.now();
}

// Reanuda el reloj del juego, descontando el tiempo real pasado durante la pausa.
function reanudarTiempoJuego(){
  if(!_tiempoPausado) return;
  if(Estado.tiempoJuego){
    const tiempoPausado = Date.now() - _timestampPausa;
    Estado.tiempoJuego.timestampReal += tiempoPausado;
  }
  _tiempoPausado = false;
}

// Salto narrativo de escena: avanza el reloj entre 50 y 70 minutos
// de golpe. Llamar al ENTRAR a una nueva escena principal (terminal,
// tránsito, bar, etc.). No usar para transiciones puramente técnicas
// (intro, identidad, carga).
function saltoDeEscena(){
  const minutos = 50 + Math.floor(Math.random() * 21); // 50-70
  avanzarTiempoJuego(minutos);
}

// Formatea la fecha para el reloj de la esquina.
// Formato: "25 DIC 2247 // 03:14:42"
const MESES_CORTOS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
function formatearFechaJuego(fecha){
  const d = String(fecha.getDate()).padStart(2,'0');
  const mes = MESES_CORTOS[fecha.getMonth()];
  const a = fecha.getFullYear();
  const h = String(fecha.getHours()).padStart(2,'0');
  const m = String(fecha.getMinutes()).padStart(2,'0');
  // Sin segundos: con la velocidad x600 los segundos serían un parpadeo
  // ilegible. La cadencia de minutos es suficiente para sentir el paso.
  return `${d} ${mes} ${a} // ${h}:${m}`;
}

// Bucle de actualización del reloj de la esquina. Se activa al
// llegar al apartamento y sigue hasta el final.
let _intervaloReloj = null;
function iniciarRelojDiegético(){
  if(_intervaloReloj) return;
  const el = document.getElementById('reloj-diegetico');
  if(!el) return;
  el.classList.add('visible');
  const actualizar = () => {
    el.textContent = formatearFechaJuego(obtenerFechaJuego());
  };
  actualizar();
  _intervaloReloj = setInterval(actualizar, 1000);
}


// ============================================================