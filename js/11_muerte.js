// ============================================================
// BLOQUE JS-14 — SISTEMA DE MUERTE (game over con causas)
// Cuando una stat humana llega a 100, se dispara la muerte.
//   Texto, pantalla negra y registro en el archivo del mundo.
// ============================================================

// ============================================================
// SISTEMA DE MUERTE — Fase B
// ============================================================
// Cuando una stat llega a 100, el personaje muere. La muerte es:
//   - sobria (sin "Game Over", sin épica)
//   - permanente (no hay "reintentar")
//   - silenciosa (corte, negro, palabras, pausa, botón único)
//
// Cada stat tiene su propia narrativa de muerte. No hay sangre
// gráfica ni dramatismo: el personaje cae, el mundo sigue.
//
// Fases C y D (herencia, mundo persistente) vendrán después.
// ============================================================

const TEXTOS_MUERTE = {
  fatiga:
    'El cuerpo se rinde antes que la voluntad.<br>' +
    'Caes en el pasillo del Nivel 4.<br>' +
    'Nadie te ve hasta el amanecer.<br>' +
    'Para entonces ya da igual.',
  aislamiento:
    'Pasan tres días antes de que alguien note el silencio.<br>' +
    'No fue la soledad lo que te mató.<br>' +
    'Fue dejar de pelear contra ella.<br>' +
    'El apartamento sigue ahí. Vacío.',
  hambre:
    'No hay nada en la nevera. No hay nada en la calle.<br>' +
    'Te tumbas. El estómago ya ni se queja.<br>' +
    'Por la mañana, los vecinos no preguntan.<br>' +
    'Hace tiempo que nadie pregunta nada en las Pilas.',
  disociacion:
    'Hay una frecuencia que no es para humanos.<br>' +
    'La oíste demasiado tiempo.<br>' +
    'Lo que cae al suelo del apartamento ya no eres tú.<br>' +
    'Si alguna vez lo fuiste.'
};

// dispararMuerte(stat): el personaje muere. La función se invoca
// una sola vez por partida. Después, Estado.muerto = true bloquea
// nuevos ajustes (ver ajustarHumano).
function dispararMuerte(stat){
  if(Estado.muerto) return; // ya estamos muriendo o muertos
  Estado.muerto = true;

  // Detener cualquier proceso vivo: decaimiento, reloj, audio.
  detenerDecaimientoPasivo();
  detenerCobrosPeriódicos();
  ocultarRelojDiegético();

  // Cerrar paneles del hub si están abiertos.
  const panel = document.getElementById('hub-panel');
  if(panel) panel.classList.remove('activo');
  document.body.classList.remove('panel-abierto');

  // Cerrar también el panel de depuración si estaba abierto.
  const debugPanel = document.getElementById('debug-panel');
  if(debugPanel && debugPanel.classList.contains('visible')){
    toggleDebug();
  }

  // Bajar la música suavemente para que la pantalla negra sea
  // de verdad silencio. Si ya estaba silenciada, no pasa nada.
  const a = document.getElementById('tema-principal');
  if(a && !temaMuted){
    let v = a.volume;
    const iv = setInterval(()=>{
      v = Math.max(v - 0.04, 0);
      a.volume = v;
      if(v <= 0){
        clearInterval(iv);
        a.pause();
        a.volume = 0.55; // restauramos para la siguiente partida
      }
    }, 50);
  }

  // Ocultar la barra permanente: no debe verse créditos ni nada
  // durante la pantalla de muerte. Hace falta sensación de corte.
  mostrarHUD(false);

  // Pintamos el texto correspondiente al stat que ha llegado a 100.
  const textoEl = document.getElementById('muerte-texto');
  if(textoEl){
    textoEl.innerHTML = TEXTOS_MUERTE[stat] || TEXTOS_MUERTE.fatiga;
  }

  // Transición a la escena de muerte. Forzamos: ocultamos todas
  // las escenas activas y mostramos la de muerte. Sin animaciones
  // bonitas: corte directo, como un fundido a negro brusco.
  document.querySelectorAll('.escena.activa').forEach(esc => {
    esc.classList.remove('activa');
  });
  const muerteEscena = document.getElementById('muerte-escena');
  if(muerteEscena){
    muerteEscena.classList.add('activa');
  }

  // La partida queda registrada como "muerto" para que la
  // persistencia no la cargue tal cual. Borramos el guardado:
  // no se puede continuar una partida muerta.
  // FASE C: pero antes de borrar, registramos al muerto en el
  // archivo del mundo. El mundo recuerda aunque la partida acabe.
  registrarMuerto(stat);
  borrarPartida();
}

// reiniciarTrasMuerte(): el botón "EMPEZAR DE NUEVO" lleva
// al jugador de vuelta al menú de identidad. La memoria del
// mundo (partidas completadas, etc.) NO se toca: en Fase C
// ese histórico servirá para que el mundo recuerde.
function reiniciarTrasMuerte(){
  // Limpiamos el flag de muerto y resetamos el estado humano.
  Estado.muerto = false;
  Estado.jugador = { nombre:'', apellido1:'' };
  Estado.memoria = {
    aceptoEncargo: null, pidioMasInfo: false, guardoSilencio: false,
    vecesPidioInfo: 0, vioFragmentoCero: false, confianzaMara: 0,
    tonoJugador: null, noticiasVistas: true
  };
  Estado.humano = { fatiga: 8, aislamiento: 12, hambre: 5, disociacion: 0 };
  Estado.tiempoJuego = null;
  // Los recibos del muerto se quedan con él. El nuevo personaje
  // empieza con la lista limpia.
  Estado.recibos = [];
  Estado.ultimoDiaCobrado = null;
  Estado.terminalPendientes = [];
  Estado.helixAmenazaEnviada = false;
  Estado.mision = null;

  // Limpiar campos del formulario de identidad.
  const inputs = ['input-nombre','input-apellido1'];
  inputs.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });

  // Ocultar la escena de muerte y mostrar la de identidad.
  const muerteEscena = document.getElementById('muerte-escena');
  if(muerteEscena) muerteEscena.classList.remove('activa');
  const identidad = document.getElementById('nombre-escena');
  if(identidad) identidad.classList.add('activa');

  // Refrescar la pantalla de identidad: el contador de anteriores
  // ahora debe incluir al recién muerto. El banner de continuar
  // debe estar oculto (no hay partida que continuar).
  prepararPantallaIdentidad();

  // Restaurar el audio para la nueva partida (sin reproducir, solo prepara).
  const a = document.getElementById('tema-principal');
  if(a){ a.currentTime = 0; }
}
function ocultarRelojDiegético(){
  const el = document.getElementById('reloj-diegetico');
  if(el) el.classList.remove('visible');
  if(_intervaloReloj){ clearInterval(_intervaloReloj); _intervaloReloj = null; }
  // El reloj de la pared del apartamento también se detiene.
  if(_intervaloRelojApt){ clearInterval(_intervaloRelojApt); _intervaloRelojApt = null; }
}

// Persistir el tiempo actual antes de que se cierre la pestaña.
function guardarTiempoAntesDeSalir(){
  if(Estado.tiempoJuego){
    Estado.tiempoJuego.timestampJuego = obtenerFechaJuego().getTime();
    Estado.tiempoJuego.timestampReal = Date.now();
    guardarPartida();
  }
}
window.addEventListener('beforeunload', guardarTiempoAntesDeSalir);
window.addEventListener('pagehide', guardarTiempoAntesDeSalir);


// ============================================================