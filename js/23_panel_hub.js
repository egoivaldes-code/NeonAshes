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
    cuerpo.innerHTML = renderContactos();
  } else if(seccion === 'noticias'){
    titulo.textContent = 'NOTICIAS';
    cuerpo.innerHTML = renderNoticias();
    // Al abrir, marcamos las noticias como leídas para quitar el badge
    Estado.memoria.noticiasVistas = true;
    const btn = document.getElementById('hub-btn-noticias');
    if(btn){
      const badge = btn.querySelector('.badge');
      if(badge) badge.remove();
    }
  } else if(seccion === 'trabajos'){
    titulo.textContent = 'TRABAJOS';
    cuerpo.innerHTML = renderTrabajos();
    // Al abrir, quitamos el badge "!" si estaba puesto (igual que noticias).
    const btn = document.getElementById('hub-btn-trabajos');
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

// ============================================================
// NOTICIAS — pools de titulares

// ============================================================