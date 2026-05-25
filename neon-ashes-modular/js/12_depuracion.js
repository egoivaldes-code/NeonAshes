// ============================================================
// BLOQUE JS-15 — PANEL DE DEPURACIÓN (Ctrl+D)
// Solo para desarrollo. Permite forzar muertes y ver el estado
//   interno. Se abre con Ctrl+D o 4 taps en esquina superior derecha.
// ============================================================

// ============================================================
// PANEL DE DEPURACIÓN — solo desarrollo, oculto por defecto
// ============================================================
// Activación: Ctrl + D, o 4 taps rápidos en la esquina superior derecha
// (para móvil). NUNCA aparece por sí solo.

let _debugVisible = false;
let _debugIntervalo = null;

function toggleDebug(){
  _debugVisible = !_debugVisible;
  const panel = document.getElementById('debug-panel');
  if(_debugVisible){
    panel.classList.add('visible');
    document.body.classList.add('debug-abierto');
    actualizarDebug();
    _debugIntervalo = setInterval(actualizarDebug, 500);
  } else {
    panel.classList.remove('visible');
    document.body.classList.remove('debug-abierto');
    if(_debugIntervalo){ clearInterval(_debugIntervalo); _debugIntervalo = null; }
  }
}

// Renderiza una fila de la pantalla. Si tiene barra, muestra mini-barra.
function debugFila(clave, valor, opciones){
  opciones = opciones || {};
  let claseValor = '';
  let textoValor = String(valor);
  let barra = '';

  if(valor === null || valor === undefined){
    claseValor = 'null';
    textoValor = 'null';
  } else if(valor === true){
    claseValor = 'true';
    textoValor = '✓ true';
  } else if(valor === false){
    claseValor = 'false';
    textoValor = '✗ false';
  } else if(typeof valor === 'number' && opciones.banda){
    claseValor = nivel(valor);
    const colores = { bajo: '#78ffa0', medio: '#ffdc78', alto: '#ffa078', extremo: '#ff647c' };
    barra = `<span class="debug-barra-mini" style="--w:${Math.min(100,valor)}%;--c:${colores[claseValor]}"></span>`;
  }

  return `<div class="debug-fila"><span class="clave">${clave}</span><span class="valor ${claseValor}">${textoValor}${barra}</span></div>`;
}

function actualizarDebug(){
  const el = document.getElementById('debug-contenido');
  if(!el) return;

  const j = Estado.jugador || {};
  const m = Estado.memoria || {};
  const h = Estado.humano || {};
  const completadas = Estado.partidasCompletadas || 0;

  let html = '';

  // === ESTADO HUMANO ===
  html += `<div class="debug-seccion">`;
  html += `<div class="debug-seccion-label">★ ESTADO HUMANO</div>`;
  html += debugFila('Fatiga', Math.round(h.fatiga || 0), {banda: true});
  html += debugFila('Aislamiento', Math.round(h.aislamiento || 0), {banda: true});
  html += debugFila('Hambre', Math.round(h.hambre || 0), {banda: true});
  html += debugFila('Disociación', Math.round(h.disociacion || 0), {banda: true});
  html += `</div>`;

  // === MEMORIA / DECISIONES ===
  html += `<div class="debug-seccion">`;
  html += `<div class="debug-seccion-label">⚙ MEMORIA</div>`;
  html += debugFila('aceptóEncargo', m.aceptoEncargo);
  html += debugFila('pidióMásInfo', m.pidioMasInfo);
  html += debugFila('guardóSilencio', m.guardoSilencio);
  html += debugFila('vioCERO', m.vioFragmentoCero);
  html += debugFila('vecesPidióInfo', m.vecesPidioInfo || 0);
  html += debugFila('confianzaMara', m.confianzaMara || 0);
  html += debugFila('tonoJugador', m.tonoJugador);
  html += `</div>`;

  // === SESIÓN ===
  html += `<div class="debug-seccion">`;
  html += `<div class="debug-seccion-label">⌚ SESIÓN</div>`;
  html += debugFila('Jugador', `${j.nombre || '?'} ${j.apellido1 || ''}`.trim() || '—');
  html += debugFila('Partidas completadas', completadas);
  if(Estado.tiempoJuego){
    const fechaJuego = obtenerFechaJuego();
    html += debugFila('Hora juego', formatearFechaJuego(fechaJuego).split(' // ')[1] || '—');
    html += debugFila('Día juego', formatearFechaJuego(fechaJuego).split(' // ')[0] || '—');
  }
  html += `</div>`;

  el.innerHTML = html;
}

// Acciones rápidas de testing
function debugAccion(accion){
  switch(accion){
    case 'fatigaMax':
      Estado.humano.fatiga = 95;
      break;
    case 'aislaMax':
      Estado.humano.aislamiento = 95;
      break;
    case 'hambreMax':
      Estado.humano.hambre = 95;
      break;
    case 'disociaMax':
      Estado.humano.disociacion = 95;
      Estado.memoria.vioFragmentoCero = true;
      break;
    case 'reset':
      Estado.humano = { fatiga: 8, aislamiento: 12, hambre: 5, disociacion: 0 };
      break;
    case 'borrarPartida':
      if(confirm('¿Borrar la partida guardada? Esto NO puede deshacerse.')){
        borrarPartida();
        alert('Partida borrada. Recarga la página para empezar limpio.');
      }
      break;
    // Disparadores directos de muerte. Útiles para probar el sistema
    // sin tener que esperar a que el decaimiento natural llegue a 100.
    case 'matarFatiga':
      ajustarHumano('fatiga', 100);
      break;
    case 'matarAislamiento':
      ajustarHumano('aislamiento', 100);
      break;
    case 'matarHambre':
      ajustarHumano('hambre', 100);
      break;
    case 'matarDisocia':
      ajustarHumano('disociacion', 100);
      break;
    case 'borrarMundo':
      if(confirm('¿Borrar el archivo del mundo? Olvidamos a todos los muertos.')){
        try { localStorage.removeItem(CLAVE_MUNDO); } catch(e){}
        alert('Archivo del mundo borrado.');
      }
      break;
    case 'verMundo':
      const archivo = cargarArchivoMundo();
      const msg = archivo.muertos.length === 0
        ? 'El mundo está limpio. Nadie ha muerto todavía.'
        : `${archivo.muertos.length} muertos registrados\nPartidas desde la última: ${archivo.partidasDesdeUltimaMuerte || 0}\nRecordados: ${muerteAunRecordada() ? 'sí' : 'no'}\n\n` +
          archivo.muertos.map((m,i) =>
            `${i+1}. ${m.nombre} ${m.apellido} — ${m.causa}`
          ).join('\n');
      alert(msg);
      break;
    // Teletransporte instantáneo al apartamento.
    // Útil para saltar misiones o tránsitos durante el desarrollo.
    // Busca la escena que esté activa ahora mismo y la apaga, sin
    // depender de saber desde dónde se llama.
    case 'aptmnt':
      try {
        // Apagar TODAS las escenas activas (por si hay más de una marcada)
        document.querySelectorAll('.escena.activa').forEach(el => {
          if(el.id !== 'apartamento') el.classList.remove('activa');
        });
        // Encender el apartamento
        const apt = document.getElementById('apartamento');
        if(apt) apt.classList.add('activa');
        // Cerrar paneles del HUB si están abiertos
        const panel = document.getElementById('panel-hub');
        if(panel) panel.classList.remove('activo');
        // Re-inicializar la escena y todos los sistemas dependientes
        if(typeof iniciarApartamento === 'function') iniciarApartamento();
        if(typeof mostrarHUD === 'function') mostrarHUD(true);
        if(typeof actualizarHUD === 'function') actualizarHUD();
        if(typeof iniciarRelojDiegético === 'function') iniciarRelojDiegético();
        // Cerrar el panel debug para que veamos el apartamento
        if(typeof toggleDebug === 'function') toggleDebug();
      } catch(e) {
        console.error('Error en teletransporte APTMNT:', e);
        alert('No se pudo teletransportar: ' + e.message);
      }
      break;
  }
  actualizarDebug();
}

// Activación con Ctrl+D
window.addEventListener('keydown', function(e){
  if(e.ctrlKey && (e.key === 'd' || e.key === 'D')){
    e.preventDefault();
    toggleDebug();
  }
});

// Activación con 4 taps rápidos en esquina superior derecha (para móvil)
(function(){
  const corner = document.getElementById('debug-corner-tap');
  if(!corner) return;
  let taps = 0;
  let resetTimer = null;
  corner.addEventListener('click', ()=>{
    taps++;
    if(resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(()=>{ taps = 0; }, 1500);
    if(taps >= 4){
      taps = 0;
      toggleDebug();
    }
  });
})();

// Función para anotar un evento en la memoria.

// ============================================================