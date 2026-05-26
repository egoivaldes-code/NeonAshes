// ============================================================
// BLOQUE JS-12 — DECAIMIENTO PASIVO DE STATS
// Las stats humanas suben solas con el paso del tiempo. Cada hora
//   de juego, fatiga, hambre, etc. crecen un poquito.
// ============================================================

// ============================================================
// DECAIMIENTO PASIVO DEL ESTADO HUMANO
// ============================================================
// Cada cierto tiempo (mientras juegas), la ciudad cobra su cuota.
// Lluvia ácida, soledad de la habitación, exigencia del sistema:
// todo va sumando sin que el jugador haga nada.
//
// El decaimiento se basa en HORAS DE JUEGO, no en segundos reales.
// Con la velocidad del tiempo a x600, 1 hora de juego ≈ 6 segundos
// reales. El intervalo lo comprueba cada segundo real y aplica el
// decaimiento si ha pasado al menos 1 hora de juego desde la última.
//
// Se aplica solo cuando el juego está "vivo" (tras pasar identidad)
// y NO cuando el tiempo está pausado (paneles abiertos).
// ============================================================
let _intervaloDecaimiento = null;
let _ultimaHoraDecaimiento = null; // hora del juego en la última aplicación

function iniciarDecaimientoPasivo(){
  if(_intervaloDecaimiento) return; // ya activo
  // Anclamos el "punto de partida" del decaimiento en la hora actual.
  _ultimaHoraDecaimiento = obtenerFechaJuego().getTime();
  _intervaloDecaimiento = setInterval(() => {
    if(!Estado.humano) return;
    if(_tiempoPausado) return; // si el tiempo está pausado, también el decaimiento
    const ahora = obtenerFechaJuego().getTime();
    const horasTranscurridas = Math.floor((ahora - _ultimaHoraDecaimiento) / (60 * 60 * 1000));
    if(horasTranscurridas < 1) return;
    // Aplicamos el decaimiento una vez por cada hora de juego pasada.
    // Durante el decaimiento NO mostramos flechitas de cambio de stat:
    // serían ruido constante de fondo (cada hora subiría 3 stats +1).
    // El jugador ya ve esos cambios al abrir el panel ESTADO.
    _suprimirFlechasStat = true;
    for(let i = 0; i < horasTranscurridas; i++){
      // Lluvia ácida del exterior se filtra siempre: fatiga lenta.
      ajustarHumano('fatiga', 1);
      // Soledad acumulada: el apartamento no tiene compañía.
      ajustarHumano('aislamiento', 1);
      // Hambre: el cuerpo no espera. Sube despacio pero sin pausa.
      ajustarHumano('hambre', 1);
      // Disociación: si está alta, tiende a estabilizarse lentamente.
      // Si está baja, no se mueve. Una vez te tocó, te suelta poco a poco.
      if(Estado.humano.disociacion > 60){
        ajustarHumano('disociacion', -1);
      }
    }
    _suprimirFlechasStat = false;
    // Avanzamos el ancla en el número exacto de horas aplicadas.
    _ultimaHoraDecaimiento += horasTranscurridas * 60 * 60 * 1000;
  }, 1000);
}

function detenerDecaimientoPasivo(){
  if(_intervaloDecaimiento){
    clearInterval(_intervaloDecaimiento);
    _intervaloDecaimiento = null;
  }
}


// ============================================================