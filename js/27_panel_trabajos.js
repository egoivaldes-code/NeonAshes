// ============================================================
// BLOQUE JS-31 — PANEL TRABAJOS — render y aceptar misión
// Lista de misiones disponibles y la lógica para aceptar una.
//
// La pestaña TRABAJOS se divide en dos subpestañas:
//   - ENCARGOS: trabajos puntuales que ofrece un contacto (Mara, etc.)
//   - PROFESIONES: oficios recurrentes que el jugador ejerce (motor en
//     js/51_profesiones.js). Aquí solo se renderiza la interfaz.
// renderTrabajos() monta las subpestañas; cada una tiene su render.
// ============================================================

// Subpestaña activa dentro de TRABAJOS. Se recuerda mientras el panel
// está abierto para que al alternar no se pierda dónde estabas.
let _subtabTrabajos = 'encargos';

// Resultado de la última acción de profesión ejercida. Se muestra una
// vez (como aviso de paga/ascenso) y se consume en el siguiente render.
let _ultimoResultadoProfesion = null;

// Acción de campo cuyo selector de lugares está abierto ahora mismo.
// {prof, accion} o null. Al elegir lugar o trabajar, se cierra.
let _lugarAbierto = null;

function renderTrabajos(){
  const sub = (_subtabTrabajos === 'oficio') ? 'oficio' : 'encargos';
  const cuerpo = (sub === 'oficio') ? renderTrabajosOficio() : renderEncargos();
  const clsE = sub === 'encargos' ? 'cp-tab activa' : 'cp-tab';
  const clsO = sub === 'oficio'   ? 'cp-tab activa' : 'cp-tab';
  // Badge "!" en PROFESIONES mientras el jugador no haya entrado nunca
  // a verlas (Estado.memoria.profesionesVistas === false). Guía la
  // navegación hasta el sistema de oficios al empezar la partida.
  const m = Estado.memoria || {};
  const badgeProf = (m.profesionesVistas === false)
    ? ' <span class="cp-tab-badge">!</span>'
    : '';
  return ''
    + '<div class="cp-tabs" style="margin-bottom:0.8rem;">'
    +   '<button class="'+clsE+'" onclick="cambiarSubtabTrabajos(\'encargos\')">ENCARGOS</button>'
    +   '<button class="'+clsO+'" onclick="cambiarSubtabTrabajos(\'oficio\')">PROFESIONES'+badgeProf+'</button>'
    + '</div>'
    + '<div id="trabajos-subcuerpo">' + cuerpo + '</div>';
}

// Alterna entre las dos subpestañas reinyectando solo el cuerpo de
// la pestaña TRABAJOS, sin volver a dibujar todo el panel.
function cambiarSubtabTrabajos(sub){
  _subtabTrabajos = (sub === 'oficio') ? 'oficio' : 'encargos';
  // Al entrar en PROFESIONES, marcamos como vistas para apagar su badge
  // en toda la cadena de navegación.
  if(_subtabTrabajos === 'oficio'){
    if(Estado.memoria) Estado.memoria.profesionesVistas = true;
    if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  }
  const cont = document.getElementById('cp-cuerpo-tab')
            || document.getElementById('hub-panel-cuerpo-tab');
  if(cont) cont.innerHTML = renderTrabajos();
}

// Subpestaña PROFESIONES. Dos caras:
//  - Si el jugador NO ejerce ninguna: lista de oficios disponibles para
//    escoger.
//  - Si ejerce una o más: muestra cada una con su rango, progreso y el
//    botón TRABAJAR que despliega las acciones del oficio.
// El motor (datos, paga, progreso, ascensos) vive en js/51_profesiones.js.
function renderTrabajosOficio(){
  if(typeof PROFESIONES === 'undefined'){
    return `
      <div class="lista-vacia">
        <div class="icono">◇</div>
        <div>NO EJERCES NINGÚN OFICIO</div>
      </div>`;
  }

  // ¿Ejerce alguna?
  const activas = PROFESIONES.filter(p => typeof tieneProfesion === 'function' && tieneProfesion(p.id));

  // Resultado de la última acción ejercida, para mostrarlo arriba.
  let aviso = '';
  if(_ultimoResultadoProfesion){
    const r = _ultimoResultadoProfesion;
    const asc = r.ascendio ? `<div style="color:var(--cyan);margin-top:0.4rem;">ASCENSO · ahora eres ${r.rangoNuevo}</div>` : '';
    // Línea de paga (solo si cobró algo).
    const pagaLinea = (r.paga > 0)
      ? `<span class="creditos">+${r.paga} CR</span>`
      : `<span style="opacity:0.5;">SIN BOTÍN</span>`;
    // Costes: herida, multa, fatiga. En magenta para que pesen.
    let costes = '';
    if(r.herida) costes += `<div style="color:var(--magenta);margin-top:0.3rem;font-size:0.55rem;">LESIÓN · ${r.herida}</div>`;
    if(r.multa > 0) costes += `<div style="color:var(--magenta);margin-top:0.3rem;font-size:0.55rem;">SANCIÓN HELIX · −${r.multa} CR domiciliados</div>`;
    if(r.fatiga >= 12) costes += `<div style="color:rgba(255,160,120,0.8);margin-top:0.3rem;font-size:0.55rem;">El cuerpo acusa el esfuerzo.</div>`;
    aviso = `
      <div class="trabajo-tarjeta" style="border-color:rgba(0,229,255,0.25);">
        <div class="trabajo-descripcion" style="opacity:0.85;">${r.nota}</div>
        <div class="trabajo-meta"><span></span>${pagaLinea}</div>
        ${costes}
        ${asc}
      </div>`;
    _ultimoResultadoProfesion = null;
  }

  // CASO 1: no ejerce nada → lista de oficios para escoger (solo en casa).
  if(!activas.length){
    const apt0 = document.getElementById('apartamento');
    const enApt0 = apt0 && apt0.classList.contains('activa');
    if(!enApt0){
      return `
        ${aviso}
        <div class="lista-vacia">
          <div class="icono">◇</div>
          <div>NO EJERCES NINGÚN OFICIO</div>
          <div style="margin-top:1rem;font-size:0.55rem;letter-spacing:0.2em;opacity:0.5">
            Podrás escoger un oficio desde tu apartamento.
          </div>
        </div>`;
    }
    let cards = '';
    PROFESIONES.forEach(p => {
      cards += `
        <div class="trabajo-tarjeta">
          <div class="trabajo-header">
            <span class="trabajo-titulo">${p.nombre.toUpperCase()}</span>
          </div>
          <div class="trabajo-descripcion">${p.desc}</div>
          <div style="margin-top:0.8rem;text-align:center;">
            <button class="btn-terminal" onclick="elegirProfesionDesdePanel('${p.id}')">EMPEZAR EN ESTE OFICIO →</button>
          </div>
        </div>`;
    });
    return `
      ${aviso}
      <div style="font-size:0.55rem;letter-spacing:0.2em;opacity:0.55;margin-bottom:0.8rem;text-align:center;">
        NO EJERCES NINGÚN OFICIO · ESCOGE UNO PARA EMPEZAR
      </div>
      ${cards}`;
  }

  // CASO 2: ejerce una o más → tarjeta por profesión con rango y acciones.
  // Las ACCIONES (trabajar, elegir lugar) solo se ofrecen dentro del
  // apartamento. Fuera, o consultando desde estado en la calle, la
  // pestaña es de solo lectura: oficio, rango y progreso.
  const apt = document.getElementById('apartamento');
  const enApartamento = apt && apt.classList.contains('activa');

  let cards = '';
  activas.forEach(p => {
    const est = estadoProfesion(p.id);
    const rango = p.rangos[est.rango || 0];
    const umbral = rango.umbral;
    const prog = est.progreso || 0;
    const barra = umbral > 0
      ? `<div style="margin-top:0.5rem;font-size:0.5rem;letter-spacing:0.15em;opacity:0.6;">PROGRESO: ${prog} / ${umbral}</div>`
      : `<div style="margin-top:0.5rem;font-size:0.5rem;letter-spacing:0.15em;opacity:0.6;">RANGO MÁXIMO ALCANZADO</div>`;

    // Bloque de acciones: solo dentro del apartamento.
    let bloqueAcciones = '';
    if(enApartamento){
      const cd = (typeof cooldownProfesion === 'function') ? cooldownProfesion(p.id) : { puede:true };
      if(!cd.puede){
        // En cooldown: no se puede trabajar todavía.
        const h = Math.floor(cd.minutosRestantes / 60);
        const m = cd.minutosRestantes % 60;
        const tiempo = h > 0 ? `${h} h ${m} min` : `${m} min`;
        bloqueAcciones = `
          <div style="margin-top:0.8rem;font-size:0.55rem;letter-spacing:0.15em;opacity:0.6;text-align:center;border:1px solid rgba(255,160,120,0.2);padding:0.6rem;">
            DESCANSANDO · podrás volver a trabajar<br>en ${tiempo} de juego
          </div>`;
      } else {
        let botonesAccion = '';
        (p.acciones || []).forEach(a => {
          if(a.conLugares && _lugarAbierto && _lugarAbierto.prof === p.id && _lugarAbierto.accion === a.id){
            botonesAccion += _renderSelectorLugares(p, a);
          } else if(a.conLugares){
            botonesAccion += `
              <button class="btn-terminal" style="display:block;width:100%;margin-top:0.5rem;"
                onclick="abrirLugaresDesdePanel('${p.id}','${a.id}')">${a.nombre}</button>`;
          } else {
            botonesAccion += `
              <button class="btn-terminal" style="display:block;width:100%;margin-top:0.5rem;"
                onclick="ejercerProfesionDesdePanel('${p.id}','${a.id}')">${a.nombre}</button>`;
          }
        });
        bloqueAcciones = `
          <div style="margin-top:0.8rem;">
            <div style="font-size:0.5rem;letter-spacing:0.2em;opacity:0.5;margin-bottom:0.2rem;">TRABAJAR:</div>
            ${botonesAccion}
          </div>`;
      }
    } else {
      // Fuera del apartamento: solo lectura.
      bloqueAcciones = `
        <div style="margin-top:0.8rem;font-size:0.5rem;letter-spacing:0.15em;opacity:0.45;text-align:center;">
          Solo puedes trabajar desde tu apartamento.
        </div>`;
    }

    cards += `
      <div class="trabajo-tarjeta">
        <div class="trabajo-header">
          <span class="trabajo-titulo">${p.nombre.toUpperCase()}</span>
          <span class="trabajo-estado aceptado">${rango.nombre}</span>
        </div>
        ${barra}
        ${bloqueAcciones}
      </div>`;
  });
  return `${aviso}${cards}`;
}

// El jugador escoge un oficio desde la lista. Lo activa y re-renderiza.
function elegirProfesionDesdePanel(id){
  if(typeof elegirProfesion === 'function') elegirProfesion(id);
  // Si el jugador está en el apartamento, refrescamos sus opciones para
  // que aparezca "Ir a trabajar" de inmediato (sin tener que salir y
  // volver a entrar).
  if(typeof ajustarTextosApartamentoSegunMemoria === 'function'){
    ajustarTextosApartamentoSegunMemoria(true);
  }
  _refrescarSubcuerpoTrabajos();
}

// Render del selector de lugares: una lista de sitios donde rebuscar,
// cada uno con su sabor y un botón. Más un botón para cancelar.
function _renderSelectorLugares(prof, accion){
  let sitios = '';
  (prof.lugares || []).forEach(l => {
    sitios += `
      <div style="margin-top:0.5rem;padding:0.5rem;border:1px solid rgba(0,229,255,0.12);">
        <div style="font-size:0.6rem;letter-spacing:0.15em;color:var(--cyan);">${l.nombre.toUpperCase()}</div>
        <div style="font-size:0.55rem;opacity:0.65;margin:0.3rem 0;">${l.sabor}</div>
        <button class="btn-terminal" style="display:block;width:100%;"
          onclick="ejercerLugarDesdePanel('${prof.id}','${accion.id}','${l.id}')">REBUSCAR AQUÍ →</button>
      </div>`;
  });
  return `
    <div style="margin-top:0.5rem;border:1px solid rgba(0,229,255,0.2);padding:0.5rem;">
      <div style="font-size:0.5rem;letter-spacing:0.2em;opacity:0.6;margin-bottom:0.2rem;">¿DÓNDE REBUSCAS?</div>
      ${sitios}
      <button class="btn-terminal" style="display:block;width:100%;margin-top:0.6rem;opacity:0.6;"
        onclick="cerrarLugaresDesdePanel()">VOLVER</button>
    </div>`;
}

// Abre el selector de lugares para una acción de campo.
function abrirLugaresDesdePanel(idProf, idAccion){
  _lugarAbierto = { prof: idProf, accion: idAccion };
  _refrescarSubcuerpoTrabajos();
}

// Cierra el selector sin trabajar.
function cerrarLugaresDesdePanel(){
  _lugarAbierto = null;
  _refrescarSubcuerpoTrabajos();
}

// El jugador elige un lugar concreto y trabaja allí.
function ejercerLugarDesdePanel(idProf, idAccion, idLugar){
  _lugarAbierto = null;
  if(typeof ejercerProfesion === 'function'){
    const r = ejercerProfesion(idProf, idAccion, idLugar);
    if(r && !r.bloqueado) _ultimoResultadoProfesion = r;
  }
  _refrescarSubcuerpoTrabajos();
}

// El jugador pulsa una acción de TRABAJAR. Ejerce, guarda el resultado
// y re-renderiza para mostrar paga, progreso y posible ascenso.
function ejercerProfesionDesdePanel(idProf, idAccion){
  if(typeof ejercerProfesion === 'function'){
    const r = ejercerProfesion(idProf, idAccion);
    if(r && !r.bloqueado) _ultimoResultadoProfesion = r;
  }
  _refrescarSubcuerpoTrabajos();
}

// Re-renderiza solo el cuerpo de la subpestaña activa.
function _refrescarSubcuerpoTrabajos(){
  const cont = document.getElementById('cp-cuerpo-tab')
            || document.getElementById('hub-panel-cuerpo-tab');
  if(cont) cont.innerHTML = renderTrabajos();
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