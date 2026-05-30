// ============================================================
// BLOQUE JS-08 — GUARDADO Y CARGA DE PARTIDA (localStorage)
// Guarda y carga el Estado completo del jugador en el navegador.
//   La clave de guardado se cambia en el LAUNCHER (arriba del todo).
// ============================================================

// ============================================================
// PERSISTENCIA — el mundo recuerda al jugador entre sesiones
// ============================================================
// Guardamos en localStorage del navegador. Funciona sin internet,
// sin cuenta, sin servidor. Vive en el dispositivo del jugador.
//
// Filosofía: guardamos el "después" de la partida, no su mitad.
// El jugador no aparece en mitad del diálogo con Mara; vuelve al
// apartamento, otra noche, y el mundo le reconoce.

const CLAVE_PARTIDA = LAUNCHER.CLAVE_PARTIDA;

// Guarda el estado relevante. Se llama tras cada momento importante
// (aceptar, rechazar, ver CERO, terminar la partida).
function guardarPartida(){
  try {
    const datos = {
      version: 2,
      jugador: Estado.jugador,
      memoria: Estado.memoria,
      humano: Estado.humano,
      tiempoJuego: Estado.tiempoJuego,
      partidasCompletadas: Estado.partidasCompletadas || 0,
      // v2: añadidos los campos de misión y cobros para que sobrevivan
      // a recargas del navegador. Sin esto, cerrar y volver a abrir
      // en mitad de la misión perdería el progreso.
      mision: Estado.mision || null,
      recibos: Estado.recibos || [],
      ultimoDiaCobrado: Estado.ultimoDiaCobrado || null,
      terminalPendientes: Estado.terminalPendientes || [],
      helixAmenazaEnviada: Estado.helixAmenazaEnviada || false,
      creditos: Estado.creditos || 0,
      reputacion: Estado.reputacion || 0,
      inventario: Estado.inventario || [],
      condiciones: Estado.condiciones || [],
      guardadoEn: Date.now()
    };
    localStorage.setItem(CLAVE_PARTIDA, JSON.stringify(datos));
  } catch(e){
    // Si localStorage falla (modo incógnito, cuota llena, etc.),
    // el juego sigue funcionando — simplemente no recordará.
    console.warn('No se pudo guardar:', e);
  }
}

// Carga la partida previa, si existe. Devuelve los datos o null.
function cargarPartida(){
  try {
    const raw = localStorage.getItem(CLAVE_PARTIDA);
    if(!raw) return null;
    const datos = JSON.parse(raw);
    // Aceptamos v1 y v2 (compatibilidad hacia atrás).
    if(!datos || (datos.version !== 1 && datos.version !== 2)) return null;
    return datos;
  } catch(e){
    return null;
  }
}

// Borra la partida guardada. Para el botón de "empezar de nuevo".
function borrarPartida(){
  try { localStorage.removeItem(CLAVE_PARTIDA); } catch(e){}
}


// ============================================================