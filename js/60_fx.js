// ============================================================
// NEON ASHES — MOTOR DE SONIDO FX (efectos cortos)  ·  v0.89
// ------------------------------------------------------------
// Reproduce efectos de sonido puntuales o en bucle, respetando SIEMPRE
// el estado global de audio (window.AUDIO_ON / window.AUDIO_VOL): si el
// jugador tiene el sonido apagado, los FX no suenan.
//
// Los archivos viven en assets/audio/fx/ con nombres limpios. Aquí se
// mapean a CLAVES cortas de uso (evento del juego -> sonido), para poder
// cambiar el sonido de un evento sin tocar el resto del código.
//
// Uso:
//   reproducirFX('terminal_abrir')      -> suena una vez
//   reproducirFXLoop('amb_taller', id)  -> arranca un bucle con etiqueta
//   detenerFXLoop(id)                   -> para ese bucle
//
// Más adelante se añadirán más packs: basta con copiar los .mp3 a la
// carpeta y mapear nuevas claves aquí. Procedimiento estable.
// ============================================================

const FX_BASE = 'assets/audio/fx/';

// Mapa CLAVE_DE_USO -> archivo. Una clave por "para qué sirve", no por
// nombre de archivo. Así un evento del juego pide 'terminal_abrir' y aquí
// decidimos qué sonido es (y se puede cambiar sin tocar el evento).
const FX_MAP = {
  // Interfaz / terminal
  terminal_abrir:    'sci_puerta_hidraulica.mp3',
  terminal_cerrar:   'sci_whoosh.mp3',
  panel_abrir:       'sci_escaneo.mp3',
  mensaje_nuevo:     'sci_lectura_digital.mp3',
  noticia_nueva:     'sci_escaneo_premium.mp3',
  profesion:         'sci_powerup.mp3',
  // Escena / narración
  escena_entra:      'sci_continuo.mp3',
  escena_tension:    'dron_latido.mp3',
  // Ambientes en bucle (para escenas sin decisión / espera)
  amb_taller:        'amb_taller.mp3',
  amb_industrial:    'amb_industrial.mp3',
  amb_grave:         'dron_subterraneo.mp3',
  // Acciones varias (reservados para enganches futuros)
  impacto:           'sci_impacto_metal.mp3',
  click_metal:       'weap_click_metal.mp3',
  energia:           'sci_energia_corta.mp3'
};

// Pool de reproducción puntual: reutiliza objetos Audio por clave para no
// crear cientos. Cada clave tiene su Audio listo.
const _fxPool = {};
// Bucles activos, por etiqueta: { etiqueta: Audio }.
const _fxLoops = {};

function _fxVol(escala){
  const base = (typeof window.AUDIO_VOL === 'number') ? window.AUDIO_VOL : 0.55;
  return Math.max(0, Math.min(1, base * (escala || 1)));
}
function _fxActivo(){ return window.AUDIO_ON !== false; }

// Reproduce un FX puntual. 'escalaVol' (opcional) ajusta su volumen
// relativo al global (p.ej. 0.6 para un sonido que debe ir más bajo).
function reproducirFX(clave, escalaVol){
  if(!_fxActivo()) return;
  const archivo = FX_MAP[clave];
  if(!archivo) return;
  try {
    let a = _fxPool[clave];
    if(!a){
      a = new Audio(FX_BASE + archivo);
      a.preload = 'auto';
      _fxPool[clave] = a;
    }
    a.currentTime = 0;
    a.volume = _fxVol(escalaVol);
    const p = a.play();
    if(p && p.catch) p.catch(() => {}); // ignorar bloqueo de autoplay
  } catch(e){ /* sin sonido, sin drama */ }
}

// Arranca un FX en BUCLE con una etiqueta (para poder pararlo luego).
// Útil para ambientes mientras el jugador no decide en una escena.
function reproducirFXLoop(clave, etiqueta, escalaVol){
  if(!_fxActivo()) return;
  const archivo = FX_MAP[clave];
  if(!archivo) return;
  const tag = etiqueta || clave;
  detenerFXLoop(tag); // no duplicar
  try {
    const a = new Audio(FX_BASE + archivo);
    a.loop = true;
    a.volume = _fxVol(escalaVol != null ? escalaVol : 0.5);
    _fxLoops[tag] = a;
    const p = a.play();
    if(p && p.catch) p.catch(() => {});
  } catch(e){ /* nada */ }
}

function detenerFXLoop(etiqueta){
  const a = _fxLoops[etiqueta];
  if(a){
    try { a.pause(); a.currentTime = 0; } catch(e){}
    delete _fxLoops[etiqueta];
  }
}

// Detiene TODOS los bucles (p.ej. al cambiar de escena o silenciar).
function detenerTodosFXLoops(){
  Object.keys(_fxLoops).forEach(detenerFXLoop);
}

// Al silenciar el juego, callar también los bucles de FX al instante.
// (Los puntuales ya no arrancan porque _fxActivo() lo impide.)
function _fxSincronizarMute(){
  if(!_fxActivo()) detenerTodosFXLoops();
}

window.reproducirFX = reproducirFX;
window.reproducirFXLoop = reproducirFXLoop;
window.detenerFXLoop = detenerFXLoop;
window.detenerTodosFXLoops = detenerTodosFXLoops;
window._fxSincronizarMute = _fxSincronizarMute;
window.FX_MAP = FX_MAP;
