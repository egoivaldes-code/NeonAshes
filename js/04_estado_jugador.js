// ============================================================
// BLOQUE JS-04 — ESTADO GLOBAL DEL JUGADOR
// El objeto Estado guarda todo: nombre, créditos, inventario,
//   memoria, decisiones, etc. Es el "alma" de la partida.
// ============================================================

const Estado={jugador:{nombre:'',apellido1:''},historialDialogo:[],muerto:false};

// ============================================================
// SISTEMA DE MEMORIA — "EL MUNDO TE RECUERDA"
// ============================================================
// Esta es la libreta invisible. Cada acción que importe se anota aquí.
// Más adelante, otras escenas y personajes pueden consultar esta libreta
// para reaccionar al jugador. No es un sistema de stats: son huellas.
Estado.memoria = {
  // Decisión principal con Mara
  aceptoEncargo: null,       // true = aceptó, false = rechazó, null = aún no decidió
  // Tono de la conversación con Mara
  pidioMasInfo: false,       // ¿pidió a Mara más información antes de decidir?
  guardoSilencio: false,     // ¿eligió la opción de silencio/pensar?
  vecesPidioInfo: 0,         // cuántas veces preguntó cosas sin comprometerse
  // CERO
  vioFragmentoCero: false,   // ¿llegó a aparecer CERO ante él?
  // Confianza percibida de Mara hacia el jugador (sutil, no se muestra)
  // Empieza neutra. Sube si el jugador es directo, baja si parece dubitativo o frío.
  confianzaMara: 0,
  // Tono emocional del jugador (interno, se usa para matizar textos)
  // 'directo' | 'cauto' | 'frio' | null
  tonoJugador: null,
  // ¿El jugador ha consultado las noticias desde la última actualización?
  // Si es false y hay reactivas, el botón NOTICIAS muestra badge.
  noticiasVistas: true
};

// ============================================================
// ESTADO HUMANO — capa interna que tiñe cómo se percibe el mundo
// ============================================================
// NO es un sistema de stats. NO hay barras de vida. NO hay "game over".
// Es literatura ambiental: pequeñas variaciones en los textos del juego
// según el estado interno del jugador. El jugador no debe verlo nunca
// como un número; debe sentirlo como una atmósfera distinta.
//
// Las cuatro dimensiones van de 0 a 100. Cada una influye en textos
// concretos del juego. Crecen lentamente con el tiempo y con decisiones.
Estado.humano = {
  fatiga: 8,        // 0-100. Cansancio físico y mental. Sube con el tiempo.
  aislamiento: 12,  // 0-100. Sensación de soledad. Sube con silencios y rechazos.
  hambre: 5,        // 0-100. Necesidad física de comer. Sube con el tiempo. Se sacia comiendo (cuesta créditos).
  disociacion: 0    // 0-100. Realidad menos fiable. Sube al ver CERO.
};

// ============================================================
// CONDICIONES MÉDICAS — lesiones físicas activas
// ============================================================
// Lista de condiciones (heridas, mareo, envenenamiento…) que el
// jugador arrastra. Cada una drena un poco las barras humanas por
// turno de viaje. El sistema vive en 39_condiciones.js.
Estado.condiciones = [];


// ============================================================