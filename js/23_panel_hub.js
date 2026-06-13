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
  // Sonido de apertura de panel (v0.89). Noticias y mensajes con su tono.
  if(typeof reproducirFX === 'function'){
    if(seccion === 'noticias') reproducirFX('noticia_nueva', 0.7);
    else if(seccion === 'mensajes' || seccion === 'contactos') reproducirFX('mensaje_nuevo', 0.7);
    else reproducirFX('panel_abrir', 0.6);
  }
  // Marcar body para que el reloj diegético se oculte y no se solape.
  document.body.classList.add('panel-abierto');

  if(seccion === 'estado'){
    titulo.textContent = 'ESTADO';
    cuerpo.innerHTML = renderEstadoConPestanas('estado');
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
  } else if(seccion === 'mercado'){
    titulo.textContent = 'MERCADO';
    cuerpo.innerHTML = (typeof renderMercado === 'function') ? renderMercado('vender') : '';
  }

  panel.classList.add('activo');
}

// ------------------------------------------------------------
// ESTADO con pestañas: ESTADO · CONTACTOS · TRABAJOS.
// Permite consultar relaciones, reputación y trabajos también
// fuera del apartamento (solo lectura: las acciones que cambian
// el mundo —aceptar/salir a un objetivo— quedan bloqueadas fuera
// del apartamento; ver iniciarMisionDesdeTrabajos).
// ------------------------------------------------------------
function renderEstadoConPestanas(activa){
  const tab = (activa === 'contactos' || activa === 'trabajos') ? activa : 'estado';
  let cuerpoTab;
  if(tab === 'contactos'){
    cuerpoTab = (typeof renderContactos === 'function') ? renderContactos() : '';
  } else if(tab === 'trabajos'){
    cuerpoTab = (typeof renderTrabajos === 'function') ? renderTrabajos() : '';
  } else {
    cuerpoTab = (typeof renderEstado === 'function') ? renderEstado() : '';
  }
  const cls = (t) => tab === t ? 'cp-tab activa' : 'cp-tab';
  const _m = Estado.memoria || {};
  const _bTrab = (_m.profesionesVistas === false) ? ' <span class="cp-tab-badge">!</span>' : '';
  return ''
    + '<div class="cp-tabs">'
    +   '<button class="'+cls('estado')+'" onclick="cambiarTabEstado(\'estado\')">ESTADO</button>'
    +   '<button class="'+cls('contactos')+'" onclick="cambiarTabEstado(\'contactos\')">CONTACTOS</button>'
    +   '<button class="'+cls('trabajos')+'" onclick="cambiarTabEstado(\'trabajos\')">TRABAJOS'+_bTrab+'</button>'
    + '</div>'
    + '<div id="hub-panel-cuerpo-tab">' + cuerpoTab + '</div>';
}

function cambiarTabEstado(tab){
  // Al ver Trabajos, marcamos como visto para quitar su badge.
  if(tab === 'trabajos'){
    if(Estado.memoria) Estado.memoria.trabajosVistos = true;
    // Navegar a Trabajos por pestaña empieza en la LISTA de oficios,
    // no atrapado en un submenú anterior. (v0.101)
    if(typeof fijarOficioAbierto === 'function') fijarOficioAbierto(null);
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  }
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderEstadoConPestanas(tab);
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
  const _mc = Estado.memoria || {};
  const _bT = (_mc.profesionesVistas === false) ? ' <span class="cp-tab-badge">!</span>' : '';
  return ''
    + '<div class="cp-tabs">'
    +   '<button class="'+clsC+'" onclick="cambiarTabContactos(\'contactos\')">CONTACTOS</button>'
    +   '<button class="'+clsT+'" onclick="cambiarTabContactos(\'trabajos\')">TRABAJOS'+_bT+'</button>'
    + '</div>'
    + '<div id="cp-cuerpo-tab">' + cuerpoTab + '</div>';
}

function cambiarTabContactos(tab){
  // Al ver la pestaña de Trabajos, se marca como visto y se quita su badge.
  if(tab === 'trabajos'){
    if(Estado.memoria) Estado.memoria.trabajosVistos = true;
    // Navegar a Trabajos por pestaña empieza en la LISTA de oficios. (v0.101)
    if(typeof fijarOficioAbierto === 'function') fijarOficioAbierto(null);
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  }
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderContactosConPestanas(tab);
}

// ============================================================
// NOTICIAS — pools de titulares

// ============================================================