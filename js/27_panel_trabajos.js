// ============================================================
// BLOQUE JS-31 — PANEL TRABAJOS — render y aceptar misión
// Lista de misiones disponibles y la lógica para aceptar una.
//
// La pestaña TRABAJOS se divide en dos subpestañas:
//   - ENCARGOS: trabajos puntuales que ofrece un contacto (Mara, etc.)
//   - TRABAJOS: oficio recurrente ligado a una profesión (aún vacío)
// renderTrabajos() monta las subpestañas; cada una tiene su render.
// ============================================================

// Subpestaña activa dentro de TRABAJOS. Se recuerda mientras el panel
// está abierto para que al alternar no se pierda dónde estabas.
let _subtabTrabajos = 'encargos';

function renderTrabajos(){
  const sub = (_subtabTrabajos === 'oficio') ? 'oficio' : 'encargos';
  const cuerpo = (sub === 'oficio') ? renderTrabajosOficio() : renderEncargos();
  const clsE = sub === 'encargos' ? 'cp-tab activa' : 'cp-tab';
  const clsO = sub === 'oficio'   ? 'cp-tab activa' : 'cp-tab';
  return ''
    + '<div class="cp-tabs" style="margin-bottom:0.8rem;">'
    +   '<button class="'+clsE+'" onclick="cambiarSubtabTrabajos(\'encargos\')">ENCARGOS</button>'
    +   '<button class="'+clsO+'" onclick="cambiarSubtabTrabajos(\'oficio\')">TRABAJOS</button>'
    + '</div>'
    + '<div id="trabajos-subcuerpo">' + cuerpo + '</div>';
}

// Alterna entre las dos subpestañas reinyectando solo el cuerpo de
// la pestaña TRABAJOS, sin volver a dibujar todo el panel.
function cambiarSubtabTrabajos(sub){
  _subtabTrabajos = (sub === 'oficio') ? 'oficio' : 'encargos';
  // El contenedor donde vive el render de la pestaña TRABAJOS puede ser
  // 'cp-cuerpo-tab' (abierto desde CONTACTOS) o 'hub-panel-cuerpo-tab'
  // (abierto desde ESTADO). Reinyectamos en el que exista.
  const cont = document.getElementById('cp-cuerpo-tab')
            || document.getElementById('hub-panel-cuerpo-tab');
  if(cont) cont.innerHTML = renderTrabajos();
}

// Subpestaña TRABAJOS (oficio recurrente). De momento vacía: el sistema
// de profesiones aún no existe. Mensaje diegético en el mismo tono que
// la lista vacía de encargos.
function renderTrabajosOficio(){
  return `
    <div class="lista-vacia">
      <div class="icono">◇</div>
      <div>NO EJERCES NINGÚN OFICIO</div>
      <div style="margin-top:1rem;font-size:0.55rem;letter-spacing:0.2em;opacity:0.6">
        La ciudad no te ha ofrecido nada<br>
        que puedas llamar trabajo. Todavía.
      </div>
    </div>`;
}

// Subpestaña ENCARGOS — el encargo de Mara Vex. Misma lógica de siempre.
function renderEncargos(){
  const m = Estado.memoria || {};
  const yaConoceMara = m.aceptoEncargo !== null || m.pidioMasInfo || m.guardoSilencio || m.vecesPidioInfo > 0 || (Estado.partidasCompletadas || 0) > 0;

  if(!yaConoceMara){
    return `
      <div class="lista-vacia">
        <div class="icono">◈</div>
        <div>SIN TRABAJOS DISPONIBLES</div>
        <div style="margin-top:1rem;font-size:0.55rem;letter-spacing:0.2em;opacity:0.6">
          Nadie te ha ofrecido nada todavía.<br>
          Los créditos no caen del cielo.
        </div>
      </div>`;
  }

  // Estado del trabajo
  let estadoCls, estadoTxt, descripcion;
  // ANTI-BUCLE: si la misión ya está hecha (volvioApartamento o
  // completada), el trabajo aparece como COMPLETADO, no como aceptado.
  // Sin esto, el panel sugería que el trabajo seguía abierto y
  // podía reaparecer el botón SALIR AL OBJETIVO en flujos extraños.
  const misionHecha = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';
  if(misionHecha){
    estadoCls = 'aceptado';
    estadoTxt = 'completado';
    descripcion = 'Paquete entregado. El trato con Mara Vex está cerrado por esta noche. La ciudad ya tiene lo que quería de ti.';
  } else if(m.aceptoEncargo === true){
    estadoCls = 'aceptado';
    estadoTxt = 'aceptado';
    descripcion = 'Recoger un paquete del Nivel 4, corredor oeste, casillero 218. Entregar sin abrir, sin preguntar, sin testigos. La hora exacta llegará por mensaje cifrado.';
  } else if(m.aceptoEncargo === false){
    estadoCls = 'rechazado';
    estadoTxt = 'rechazado';
    descripcion = 'Recogida de un paquete. No te interesó. O no te atreviste. La diferencia, esta noche, no importa.';
  } else {
    estadoCls = 'pendiente';
    estadoTxt = 'pendiente';
    descripcion = 'Mara Vex te tantea con un encargo. Treinta créditos por recoger un paquete del Nivel 4. No te ha dicho qué hay dentro. No piensa decirlo.';
  }

  // ¿Mostramos botón "Salir al objetivo"?
  // Aparece si el encargo está ACEPTADO y la misión todavía no está hecha
  // ni en curso. Antes exigía el estado exacto 'mensajeRecibido' y, si el
  // jugador avanzaba el flujo de otra forma (dormir, cerrar terminal...),
  // el botón desaparecía y se quedaba SIN FORMA de salir al objetivo.
  // Ahora basta con que la misión no esté hecha ni ya arrancada.
  const misionEnCurso = Estado.mision === 'enRuta' || Estado.mision === 'enCasillero' ||
    Estado.mision === 'paqueteCerrado' || Estado.mision === 'paqueteAbierto' ||
    Estado.mision === 'paqueteRobado' || Estado.mision === 'volviendo';
  // Las acciones que cambian el mundo (salir a un objetivo) solo se
  // permiten desde el apartamento. Fuera, la lista de trabajos es de
  // solo lectura: ves el encargo, pero no puedes arrancarlo.
  const apt = document.getElementById('apartamento');
  const enApartamento = apt && apt.classList.contains('activa');
  const puedeSalir = !misionHecha && !misionEnCurso && (m.aceptoEncargo === true) && enApartamento;
  const botonSalir = puedeSalir
    ? `<div style="margin-top:1rem;text-align:center;">
         <button class="btn-terminal" style="border-color:rgba(255,0,110,0.4);color:var(--magenta);margin-top:0.5rem;" onclick="iniciarMisionDesdeTrabajos()">SALIR AL OBJETIVO →</button>
       </div>`
    : '';

  return `
    <div class="trabajo-tarjeta">
      <div class="trabajo-header">
        <span class="trabajo-titulo">RECOGIDA · NIVEL 4</span>
        <span class="trabajo-estado ${estadoCls}">${estadoTxt}</span>
      </div>
      <div class="trabajo-cliente">CLIENTE: MARA VEX</div>
      <div class="trabajo-descripcion">${descripcion}</div>
      <div class="trabajo-meta">
        <span>RIESGO: <span style="color:rgba(255,160,120,0.7)">DESCONOCIDO</span></span>
        <span class="creditos">PAGA: 30 CR</span>
      </div>
      ${botonSalir}
    </div>
  `;
}

// Llamado desde el botón "SALIR AL OBJETIVO" del panel Trabajos.
// Cierra el panel y arranca la misión, como antes hacía el terminal.
function iniciarMisionDesdeTrabajos(){
  // Salvaguarda: solo desde el apartamento. Fuera, no se arranca nada.
  const apt = document.getElementById('apartamento');
  if(!(apt && apt.classList.contains('activa'))) return;
  // ANTI-BUCLE: si la misión ya está hecha, no la arrancamos otra vez.
  // El botón no debería estar visible, pero esta guarda protege ante
  // estados raros de UI o pulsaciones dobles.
  if(Estado.mision === 'volvioApartamento' || Estado.mision === 'completada' ||
     Estado.mision === 'enRuta' || Estado.mision === 'enCasillero' ||
     Estado.mision === 'paqueteCerrado' || Estado.mision === 'paqueteAbierto' ||
     Estado.mision === 'paqueteRobado' || Estado.mision === 'volviendo'){
    if(typeof cerrarPanelHub === 'function') cerrarPanelHub();
    return;
  }
  // Cerrar el panel del hub si está abierto.
  if(typeof cerrarPanelHub === 'function') cerrarPanelHub();
  // Salir hacia Nivel 4 — exactamente la misma función de siempre,
  // pero ahora con escena de origen "apartamento" en vez de terminal.
  Estado.mision = 'enRuta';
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  if(typeof ajustarHumano === 'function') ajustarHumano('fatiga', 3);
  idxUbicMision = 0;
  // Limpiar mensaje pendiente del terminal por si quedaba.
  if(Estado.terminalPendientes){
    Estado.terminalPendientes = Estado.terminalPendientes.filter(p => p.tipo !== 'misionMara');
  }
  cambiarEscena('apartamento', 'mision-transito-escena');
  const bg = document.getElementById('bg-mision-transito');
  if(bg) bg.style.opacity = '1';
  setTimeout(mostrarSiguienteUbicMision, 800);
}

// Cuando se acepta o rechaza el encargo de Mara, ponemos un badge
// en el botón de Trabajos para que el jugador note que hay novedad.
function marcarTrabajosActualizado(){
  // Bandera persistente: así el escritorio HELIX puede mostrar el badge
  // en el icono CONTACTOS (que ahora contiene la pestaña Trabajos).
  if(Estado.memoria) Estado.memoria.trabajosVistos = false;
  // Refrescar badges del terminal si el escritorio está visible.
  if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  const btn = document.getElementById('hub-btn-trabajos');
  if(!btn) return;
  if(!btn.querySelector('.badge')){
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = '!';
    btn.appendChild(b);
  }
}

// Cuando aparecen noticias reactivas nuevas (por cambios en el estado
// del jugador), marcamos el botón NOTICIAS con un badge. Al abrir
// el panel se borra el badge automáticamente.
function marcarNoticiasActualizadas(){
  Estado.memoria.noticiasVistas = false;
  if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  const btn = document.getElementById('hub-btn-noticias');
  if(!btn) return;
  if(!btn.querySelector('.badge')){
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = '!';
    btn.appendChild(b);
  }
}

// Cerrar panel con ESC para mayor comodidad en escritorio
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    const p = document.getElementById('hub-panel');
    if(p && p.classList.contains('activo')) cerrarPanelHub();
  }
});


// ============================================================