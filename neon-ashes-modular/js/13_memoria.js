// ============================================================
// BLOQUE JS-16 — MEMORIA DEL JUGADOR (qué eventos recuerda)
// Pequeña libreta que registra decisiones clave (si aceptó el
//   encargo, si vio CERO, etc.). Influye en noticias y diálogos.
// ============================================================

// Se llama desde los puntos clave del juego.
function recordar(evento, valor){
  if(!Estado.memoria) return;
  const valorAnterior = Estado.memoria[evento];
  Estado.memoria[evento] = valor;
  // Si el cambio dispara una noticia reactiva nueva, marcamos el badge.
  // Solo si el valor REALMENTE cambió, para no marcar en falso.
  if(EVENTOS_QUE_GENERAN_NOTICIA.includes(evento) && valorAnterior !== valor){
    marcarNoticiasActualizadas();
  }
}

// Lista de eventos de memoria que pueden disparar una noticia reactiva.
// Si recordamos uno de estos, el botón NOTICIAS muestra un badge.
const EVENTOS_QUE_GENERAN_NOTICIA = ['aceptoEncargo', 'vioFragmentoCero'];

// Función para sumar a un contador o ajustar confianza.
function ajustarMemoria(campo, delta){
  if(!Estado.memoria) return;
  if(typeof Estado.memoria[campo] === 'number'){
    Estado.memoria[campo] += delta;
  }
}


// ============================================================