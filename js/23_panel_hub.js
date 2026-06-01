// ============================================================
// BLOQUE JS-27 — PANEL HUB — abrir y cerrar paneles
// Lógica de abrir/cerrar las 4 pantallas del hub (Estado,
//   Contactos, Trabajos, Noticias).
// ============================================================

// ============================================================
// HUB DEL APARTAMENTO — Estado, Contactos, Noticias, Trabajos
// ============================================================
// Botones de la barra inferior del apartamento. Cada uno abre
// un panel modal con su contenido. El jugador puede consultarlos
// en cualquier momento sin salir del apartamento.

function abrirPanelHub(seccion){
  const panel = document.getElementById('hub-panel');
  const titulo = document.getElementById('hub-panel-titulo');
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(!panel || !titulo || !cuerpo) return;

  // Pausar el reloj del juego mientras el panel está abierto.
  // Consultar tus stats o noticias no debe costar minutos de juego.
  pausarTiempoJuego();
  // Marcar body para que el reloj diegético se oculte y no se solape.
  document.body.classList.add('panel-abierto');

  if(seccion === 'estado'){
    titulo.textContent = 'ESTADO';
    cuerpo.innerHTML = renderEstado();
  } else if(seccion === 'contactos'){
    titulo.textContent = 'CONTACTOS';
    cuerpo.innerHTML = renderContactosConPestanas('contactos');
  } else if(seccion === 'trabajos'){
    // Trabajos ahora vive como pestaña dentro de Contactos.
    titulo.textContent = 'CONTACTOS';
    if(Estado.memoria) Estado.memoria.trabajosVistos = true;
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
    cuerpo.innerHTML = renderContactosConPestanas('trabajos');
  } else if(seccion === 'noticias'){
    titulo.textContent = 'NOTICIAS';
    cuerpo.innerHTML = renderNoticias();
    // Al abrir, marcamos las noticias como leídas para quitar el badge
    Estado.memoria.noticiasVistas = true;
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
    const btn = document.getElementById('hub-btn-noticias');
    if(btn){
      const badge = btn.querySelector('.badge');
      if(badge) badge.remove();
    }
  }

  panel.classList.add('activo');
}

function cerrarPanelHub(){
  document.getElementById('hub-panel').classList.remove('activo');
  document.body.classList.remove('panel-abierto');
  // Reanudar el reloj del juego al cerrar.
  reanudarTiempoJuego();
}

// ------------------------------------------------------------
// CONTACTOS + TRABAJOS fusionados en un panel con dos pestañas.
// 'activa' indica qué pestaña se muestra ('contactos' o 'trabajos').
// ------------------------------------------------------------
function renderContactosConPestanas(activa){
  const tab = (activa === 'trabajos') ? 'trabajos' : 'contactos';
  const cuerpoTab = (tab === 'trabajos')
    ? (typeof renderTrabajos === 'function' ? renderTrabajos() : '')
    : (typeof renderContactos === 'function' ? renderContactos() : '');
  const clsC = tab === 'contactos' ? 'cp-tab activa' : 'cp-tab';
  const clsT = tab === 'trabajos' ? 'cp-tab activa' : 'cp-tab';
  return ''
    + '<div class="cp-tabs">'
    +   '<button class="'+clsC+'" onclick="cambiarTabContactos(\'contactos\')">CONTACTOS</button>'
    +   '<button class="'+clsT+'" onclick="cambiarTabContactos(\'trabajos\')">TRABAJOS</button>'
    + '</div>'
    + '<div id="cp-cuerpo-tab">' + cuerpoTab + '</div>';
}

function cambiarTabContactos(tab){
  // Al ver la pestaña de Trabajos, se marca como visto y se quita su badge.
  if(tab === 'trabajos'){
    if(Estado.memoria) Estado.memoria.trabajosVistos = true;
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  }
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderContactosConPestanas(tab);
}

// ============================================================
// NOTICIAS — pools de titulares

// ============================================================