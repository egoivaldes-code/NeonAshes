// ============================================================
// BLOQUE JS-28 — TERMINAL — escritorio HELIX + menú principal
// Al abrir el terminal se muestra el escritorio corporativo de
// HELIX con 6 iconos. Mensajes, Mapa y Noticias están operativos.
// Mercado, Contactos y Banco muestran módulo no disponible.
// ============================================================

function irATerminal(){
  ajustarHumano('fatiga', 4);
  saltoDeEscena();
  cambiarEscena('apartamento', 'terminal-escena');
  setTimeout(mostrarEscritorioHelix, 300);
}

// ------------------------------------------------------------
// ESCRITORIO HELIX — pantalla principal del terminal
// ------------------------------------------------------------
function mostrarEscritorioHelix(){
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';

  // Marca en el body: mientras se ve el escritorio HELIX, ocultamos el
  // reloj diegético y la cabecera vieja del terminal para que no se
  // solapen con la cabecera propia del escritorio.
  document.body.classList.add('terminal-escritorio-activo');

  // Ocultamos los botones de acción del terminal mientras estamos
  // en el escritorio (solo se muestran dentro de Mensajes).
  const acciones = document.querySelector('.terminal-acciones');
  if(acciones) acciones.style.display = 'none';

  const escritorio = document.createElement('div');
  escritorio.id = 'helix-escritorio';
  escritorio.innerHTML = `
    <div class="helix-desktop-bg">
      <svg class="helix-bg-logo" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 8 C35 8 18 26 18 46 C18 66 35 76 60 76 C85 76 102 66 102 46 C102 26 85 8 60 8Z" stroke="#4a9ab8" stroke-width="2" fill="none"/>
        <path d="M60 44 C35 44 18 62 18 82 C18 102 35 112 60 112 C85 112 102 102 102 82 C102 62 85 44 60 44Z" stroke="#4a9ab8" stroke-width="2" fill="none"/>
        <line x1="60" y1="8" x2="60" y2="112" stroke="#4a9ab8" stroke-width="1" stroke-dasharray="3 4"/>
        <circle cx="60" cy="60" r="4" fill="#4a9ab8" opacity="0.6"/>
      </svg>
      <div class="helix-bg-nombre">HELIX</div>
      <div class="helix-bg-tagline">INDUSTRIES · SISTEMA CORPORATIVO CERTIFICADO</div>
    </div>
    <div class="helix-sys-top">
      SYS: NOMINAL<br>
      SESIÓN: ACTIVA<br>
      RED: HELIX-NET
    </div>
    <div class="helix-iconos-grid">
      <div class="helix-icono" onclick="abrirTerminalMensajes()">
        <div class="helix-icono-simbolo">✉</div>
        <div class="helix-icono-label">MENSAJES</div>
      </div>
      <div class="helix-icono" onclick="abrirTerminalMercado()">
        <div class="helix-icono-simbolo">⬡</div>
        <div class="helix-icono-label">MERCADO</div>
      </div>
      <div class="helix-icono" onclick="abrirTerminalMapa()">
        <div class="helix-icono-simbolo">◈</div>
        <div class="helix-icono-label">MAPA</div>
      </div>
      <div class="helix-icono" id="helix-icono-noticias" onclick="abrirTerminalNoticias()">
        <div class="helix-icono-simbolo">▤</div>
        <div class="helix-icono-label">NOTICIAS</div>
      </div>
      <div class="helix-icono" id="helix-icono-contactos" onclick="abrirTerminalContactos()">
        <div class="helix-icono-simbolo">◎</div>
        <div class="helix-icono-label">CONTACTOS</div>
      </div>
      <div class="helix-icono" onclick="abrirTerminalBanco()">
        <div class="helix-icono-simbolo">◇</div>
        <div class="helix-icono-label">BANCO</div>
      </div>
    </div>
    <div class="helix-sys-bottom">
      UNIDAD: 273-19A<br>
      v4.1.7<br>
      RED: HELIX-NET
    </div>
    <div class="helix-salir-fila">
      <button class="helix-salir-btn" onclick="cerrarTerminalHelix()">← CERRAR TERMINAL</button>
    </div>
  `;
  body.appendChild(escritorio);
  // Pintar badges de aviso (noticias / trabajos) sobre los iconos.
  actualizarBadgesTerminal();
}

// Coloca o quita los badges "!" en los iconos del escritorio HELIX
// según haya noticias o trabajos sin ver. Seguro de llamar aunque el
// escritorio no esté visible (no hace nada si no encuentra los iconos).
function actualizarBadgesTerminal(){
  const m = Estado.memoria || {};
  _ponerBadgeIcono('helix-icono-noticias', m.noticiasVistas === false);
  // El icono CONTACTOS (que contiene la pestaña Trabajos) avisa tanto de
  // encargos nuevos como de profesiones sin descubrir.
  _ponerBadgeIcono('helix-icono-contactos', m.trabajosVistos === false || m.profesionesVistas === false);
  // Badge en el botón ESTADO de la barra permanente: la pestaña Trabajos
  // (con Profesiones) vive dentro del panel ESTADO, así que la novedad
  // debe resaltarse también ahí, en el punto de entrada.
  const badgeEstado = document.getElementById('perm-badge-estado');
  if(badgeEstado){
    badgeEstado.style.display = (m.profesionesVistas === false) ? 'flex' : 'none';
  }
}

function _ponerBadgeIcono(idIcono, hayAviso){
  const icono = document.getElementById(idIcono);
  if(!icono) return;
  const previo = icono.querySelector('.helix-badge');
  if(hayAviso){
    if(!previo){
      const b = document.createElement('span');
      b.className = 'helix-badge';
      b.textContent = '!';
      icono.appendChild(b);
    }
  } else if(previo){
    previo.remove();
  }
}

// Cierra el terminal desde el escritorio HELIX: limpia la marca del
// body (para que el reloj y la cabecera vuelvan) y sale al apartamento.
function cerrarTerminalHelix(){
  document.body.classList.remove('terminal-escritorio-activo');
  cambiarEscena('terminal-escena','apartamento');
}

// ------------------------------------------------------------
// MÓDULO: MENSAJES — lógica original intacta
// ------------------------------------------------------------
function abrirTerminalMensajes(){
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';

  // Dentro de Mensajes sí queremos la cabecera del terminal y el reloj.
  document.body.classList.remove('terminal-escritorio-activo');

  // Restauramos los botones de acción
  const acciones = document.querySelector('.terminal-acciones');
  if(acciones) acciones.style.display = '';

  // Botón volver al escritorio (reemplaza el de volver al apartamento
  // solo visualmente dentro de mensajes — el original sigue en el HTML).
  const btnVolver = document.querySelector('.btn-terminal-volver');
  if(btnVolver){
    btnVolver._onclickOriginal = btnVolver.getAttribute('onclick');
    btnVolver.setAttribute('onclick', 'volverAEscritorioHelix()');
    btnVolver.textContent = '← ESCRITORIO';
  }

  // Paso previo: bandeja de entrada. El jugador ve la lista de mensajes
  // y elige cuál abrir, en vez de saltar directo al de Mara.
  mostrarBandejaMensajes();
}

// Bandeja de entrada del terminal: lista los mensajes disponibles.
function mostrarBandejaMensajes(){
  const body = document.getElementById('terminal-body');
  if(!body) return;
  body.innerHTML = '';
  document.body.classList.remove('terminal-escritorio-activo');
  const acciones = document.querySelector('.terminal-acciones');
  if(acciones) acciones.style.display = '';
  // Ocultar el botón SALIR (solo aplica dentro del mensaje de Mara).
  const btnSalir = document.getElementById('btn-terminal');
  if(btnSalir) btnSalir.style.display = 'none';
  // El botón volver, en la bandeja, regresa al escritorio HELIX.
  const btnVolverB = document.querySelector('.btn-terminal-volver');
  if(btnVolverB){
    btnVolverB.setAttribute('onclick', 'volverAEscritorioHelix()');
    btnVolverB.textContent = '← ESCRITORIO';
  }

  Estado.memoria = Estado.memoria || {};
  const misionHecha = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';

  const cab = document.createElement('div');
  cab.className = 'bandeja-cabecera';
  cab.textContent = '> BANDEJA DE ENTRADA';
  body.appendChild(cab);

  const lista = document.createElement('div');
  lista.className = 'bandeja-lista';

  // Mensaje de Mara: el único de momento. Si la misión ya está hecha,
  // se marca como leído; si no, va con prioridad alta y sin leer.
  const maraNoLeido = !misionHecha;
  const item = document.createElement('div');
  item.className = 'bandeja-item' + (maraNoLeido ? ' no-leido' : ' leido');
  item.setAttribute('onclick', 'abrirMensajeMara()');
  item.innerHTML =
      '<div class="bandeja-item-top">'
    +   '<span class="bandeja-de">DE: [REDACTADO]</span>'
    +   (maraNoLeido ? '<span class="bandeja-prio">PRIORIDAD ALTA</span>' : '<span class="bandeja-leido-tag">LEÍDO</span>')
    + '</div>'
    + '<div class="bandeja-asunto">Transmisión cifrada</div>'
    + '<div class="bandeja-preview">' + (misionHecha ? 'Mensaje ya descifrado.' : 'Sin descifrar · pulsa para abrir') + '</div>';
  lista.appendChild(item);

  body.appendChild(lista);

  // Notificaciones de HELIX BANK, si las hay, como avisos secundarios.
  const numPendientes = (Estado.terminalPendientes || []).length;
  if(numPendientes > 0){
    const aviso = document.createElement('div');
    aviso.className = 'bandeja-banco';
    aviso.textContent = '> ' + numPendientes + ' notificación(es) HELIX BANK';
    body.appendChild(aviso);
  }
}

// Abre el mensaje de Mara (contenido original intacto).
function abrirMensajeMara(){
  // El botón "volver" pasa a regresar a la bandeja, no al escritorio.
  const btnVolver = document.querySelector('.btn-terminal-volver');
  if(btnVolver){
    btnVolver.setAttribute('onclick', 'mostrarBandejaMensajes()');
    btnVolver.textContent = '← BANDEJA';
  }
  escribirTerminal();
}

function volverAEscritorioHelix(){
  // Restauramos el botón volver a su estado original
  const btnVolver = document.querySelector('.btn-terminal-volver');
  if(btnVolver && btnVolver._onclickOriginal){
    btnVolver.setAttribute('onclick', btnVolver._onclickOriginal);
    btnVolver.textContent = '← VOLVER AL APARTAMENTO';
  }
  // Ocultamos el botón SALIR por si estaba visible
  const btnSalir = document.getElementById('btn-terminal');
  if(btnSalir) btnSalir.style.display = 'none';

  mostrarEscritorioHelix();
}

// ------------------------------------------------------------
// MÓDULO: MAPA — usa abrirMapa() ya existente
// ------------------------------------------------------------
function abrirTerminalMapa(){
  // Volvemos al apartamento en background antes de abrir el mapa,
  // para que volverApartamentoDesMapa() funcione correctamente.
  document.body.classList.remove('terminal-escritorio-activo');
  // Recordamos que el mapa se abrió desde el terminal, para que al
  // pulsar "volver" en el mapa regrese al terminal y no al apartamento.
  window._mapaDesdeTerminal = true;
  cambiarEscena('terminal-escena', 'apartamento');
  setTimeout(abrirMapa, 100);
}

// ------------------------------------------------------------
// MÓDULO: NOTICIAS — usa abrirPanelHub() ya existente
// ------------------------------------------------------------
function abrirTerminalNoticias(){
  document.body.classList.remove('terminal-escritorio-activo');
  abrirPanelHub('noticias');
}

// ------------------------------------------------------------
// MÓDULOS NO DISPONIBLES (Mercado, Contactos, Banco)
// ------------------------------------------------------------
function abrirTerminalMercado(){
  mostrarModuloNoDisponible('MERCADO', 'Sistema de intercambio en mantenimiento programado.');
}
function abrirTerminalContactos(){
  document.body.classList.remove('terminal-escritorio-activo');
  abrirPanelHub('contactos');
}
// MÓDULO: BANCO — extracto detallado HELIX BANK.
// Misma fuente de datos que la pestaña RECIBOS del inventario
// (Estado.recibos), pero presentado como un extracto bancario
// diegético: titular, saldo, unidad, cargos pendientes y la lista
// completa de movimientos con más detalle por línea.
function abrirTerminalBanco(){
  const body = document.getElementById('terminal-body');
  if(!body) return;
  body.innerHTML = '';
  document.body.classList.remove('terminal-escritorio-activo');
  const acciones = document.querySelector('.terminal-acciones');
  if(acciones) acciones.style.display = '';

  const btnVolver = document.querySelector('.btn-terminal-volver');
  if(btnVolver){
    btnVolver._onclickOriginal = btnVolver.getAttribute('onclick');
    btnVolver.setAttribute('onclick', 'volverAEscritorioHelix()');
    btnVolver.textContent = '← ESCRITORIO';
  }

  const nombre = (Estado.jugador && Estado.jugador.nombre) || '';
  const apellido = (Estado.jugador && Estado.jugador.apellido1) || '';
  const titular = (nombre + ' ' + apellido).trim().toUpperCase() || 'USUARIO/A';
  const saldo = Estado.creditos || 0;
  const recibos = Estado.recibos || [];
  const pendientes = recibos.filter(r => !r.pagado).length;

  let movimientosHtml;
  if(recibos.length === 0){
    movimientosHtml = '<div class="banco-vacio">Sin movimientos registrados en este período.</div>';
  } else {
    movimientosHtml = recibos.map(r => {
      const fecha = new Date(r.fecha);
      const d = String(fecha.getDate()).padStart(2,'0');
      const mes = (typeof MESES_CORTOS !== 'undefined') ? MESES_CORTOS[fecha.getMonth()] : (fecha.getMonth()+1);
      const a = fecha.getFullYear();
      const fechaTxt = `${d} ${mes} ${a}`;
      const estado = r.pagado ? 'ejecutado' : 'impagado';
      const estadoTxt = r.pagado ? 'EJECUTADO' : 'IMPAGADO';
      const signo = r.pagado ? '−' : '!';
      const saldoLinea = r.pagado
        ? `Saldo resultante · ${r.saldoTras} CR`
        : 'Cargo pendiente de regularización';
      return `
        <div class="banco-mov ${estado}">
          <div class="banco-mov-top">
            <span class="banco-mov-fecha">${fechaTxt}</span>
            <span class="banco-mov-estado ${estado}">${estadoTxt}</span>
          </div>
          <div class="banco-mov-mid">
            <span class="banco-mov-concepto">${r.concepto}</span>
            <span class="banco-mov-importe ${estado}">${signo}${r.importe} CR</span>
          </div>
          <div class="banco-mov-bot">${saldoLinea}</div>
        </div>`;
    }).join('');
  }

  const avisoPend = pendientes > 0
    ? `<div class="banco-aviso-pend">⚠ ${pendientes} cargo(s) pendiente(s) de regularización</div>`
    : '';

  const panel = document.createElement('div');
  panel.className = 'banco-extracto';
  panel.innerHTML = `
    <div class="banco-cabecera">
      <div class="banco-marca">HELIX BANK</div>
      <div class="banco-sub">EXTRACTO DE CUENTA · DOMICILIACIONES</div>
    </div>
    <div class="banco-resumen">
      <div class="banco-resumen-fila">
        <span class="banco-lbl">TITULAR</span>
        <span class="banco-val">${titular}</span>
      </div>
      <div class="banco-resumen-fila">
        <span class="banco-lbl">UNIDAD</span>
        <span class="banco-val">273-19A · H-44 / NIVEL 273</span>
      </div>
      <div class="banco-resumen-fila banco-saldo">
        <span class="banco-lbl">SALDO DISPONIBLE</span>
        <span class="banco-val banco-saldo-cifra">${saldo} CR</span>
      </div>
    </div>
    ${avisoPend}
    <div class="banco-mov-titulo">MOVIMIENTOS</div>
    <div class="banco-movimientos">${movimientosHtml}</div>
    <div class="banco-pie">Documento generado automáticamente. HELIX BANK no atiende consultas presenciales.</div>
  `;
  body.appendChild(panel);
  body.scrollTop = 0;
}

function mostrarModuloNoDisponible(nombre, mensaje){
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';
  document.body.classList.remove('terminal-escritorio-activo');
  const acciones = document.querySelector('.terminal-acciones');
  if(acciones) acciones.style.display = '';

  const btnVolver = document.querySelector('.btn-terminal-volver');
  if(btnVolver){
    btnVolver._onclickOriginal = btnVolver.getAttribute('onclick');
    btnVolver.setAttribute('onclick', 'volverAEscritorioHelix()');
    btnVolver.textContent = '← ESCRITORIO';
  }

  const box = document.createElement('div');
  box.className = 'helix-modulo-error';
  box.innerHTML = `
    <div class="helix-modulo-error-titulo">> MÓDULO: ${nombre}</div>
    <div class="helix-modulo-error-msg">> ${mensaje}</div>
    <div class="helix-modulo-error-codigo">> CÓDIGO: 503 · SERVICIO NO DISPONIBLE</div>
  `;
  body.appendChild(box);
}

// ------------------------------------------------------------
// FUNCIÓN escribirTerminal — lógica original de mensajes
// (sin cambios respecto a la versión anterior)
// ------------------------------------------------------------
async function escribirTerminal(){
  const body=document.getElementById('terminal-body');body.innerHTML='';
  const n=Estado.jugador.nombre,a=Estado.jugador.apellido1;
  const yaHecha = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';
  Estado.memoria = Estado.memoria || {};
  const yaVioMensajeMara = Estado.memoria.vioMensajeMaraEnTerminal === true;

  if(yaVioMensajeMara && !yaHecha){
    const d1=document.createElement('div');d1.className='linea-terminal sistema';
    d1.textContent=`> sesión restaurada · ${n.toUpperCase()} ${a.toUpperCase()}`;
    body.appendChild(d1);
    const numPendientes = (Estado.terminalPendientes || []).length;
    if(numPendientes > 0){
      const d2=document.createElement('div');d2.className='linea-terminal sistema';
      d2.textContent=`> ${numPendientes} notificacion(es) HELIX BANK`;
      body.appendChild(d2);
      await esperar(400);
      pintarMensajesHelixPendientes(body);
      await esperar(600);
    }
    const dM=document.createElement('div');dM.className='linea-terminal cifrado';
    dM.textContent=`> mensaje pendiente: [REDACTADO]`;
    body.appendChild(dM);
    const msg=document.createElement('div');
    msg.className='mensaje-mara-box';
    msg.style.cssText='opacity:1;transform:translateY(0);transition:all 0.6s ease';
    msg.innerHTML=`<div class="remitente">DE: [REDACTADO]</div><div class="cuerpo-mensaje">Bar Noir.<br>Una hora.<br><br>No respondas.</div>`;
    body.appendChild(msg);
    body.scrollTop=body.scrollHeight;
    document.getElementById('btn-terminal').style.display='block';
    return;
  }

  const lineas=[{txt:`> boot 4.1.7`,cls:'linea-terminal sistema',d:0},{txt:`> usuario: ${n.toUpperCase()} ${a.toUpperCase()}`,cls:'linea-terminal sistema',d:400}];
  const numPendientes = (Estado.terminalPendientes || []).length;
  if(numPendientes > 0){
    lineas.push({txt:`> ${numPendientes} notificacion(es) HELIX BANK`,cls:'linea-terminal sistema',d:700});
  }
  if(yaHecha){
    lineas.push({txt:`> bandeja entrante — sin mensajes nuevos`,cls:'linea-terminal sistema',d:900});
  } else {
    lineas.push({txt:`> 1 mensaje entrante — PRIORIDAD ALTA`,cls:'linea-terminal alerta',d:900});
    lineas.push({txt:`> descifrando…`,cls:'linea-terminal cifrado',d:1300});
    lineas.push({txt:`> completado.`,cls:'linea-terminal sistema',d:2000});
  }
  for(const l of lineas){await esperar(l.d);const d=document.createElement('div');d.className=l.cls;d.textContent=l.txt;body.appendChild(d);body.scrollTop=body.scrollHeight;}
  if(numPendientes > 0){
    await esperar(800);
    pintarMensajesHelixPendientes(body);
  }
  if(yaHecha){
    await esperar(1000);
    const volverBox = document.createElement('div');
    volverBox.style.cssText = 'text-align:center;margin-top:1.5rem;';
    volverBox.innerHTML = `<button class="btn-terminal" onclick="cambiarEscena('terminal-escena','apartamento')" style="margin:0 auto;">VOLVER AL APARTAMENTO →</button>`;
    body.appendChild(volverBox);
    body.scrollTop=body.scrollHeight;
    return;
  }
  await esperar(1400);
  const msg=document.createElement('div');msg.className='mensaje-mara-box';msg.style.cssText='opacity:0;transform:translateY(10px);transition:all 0.6s ease';
  msg.innerHTML=`<div class="remitente">DE: [REDACTADO]</div><div class="cuerpo-mensaje">Bar Noir.<br>Una hora.<br><br>No respondas.</div>`;
  body.appendChild(msg);body.scrollTop=body.scrollHeight;
  setTimeout(()=>{msg.style.opacity='1';msg.style.transform='translateY(0)';},100);
  await esperar(3000);
  const d2=document.createElement('div');d2.className='linea-terminal alerta';d2.textContent=`> esto no parece casual.`;body.appendChild(d2);
  setTimeout(()=>{document.getElementById('btn-terminal').style.display='block';},1000);
  Estado.memoria = Estado.memoria || {};
  Estado.memoria.vioMensajeMaraEnTerminal = true;
  if(typeof guardarPartida === 'function') guardarPartida();
}

function pintarMensajesHelixPendientes(body){
  const pendientes = Estado.terminalPendientes || [];
  pendientes.forEach(p => {
    if(p.tipo === 'cobro'){
      const box = document.createElement('div');
      box.className = 'mensaje-mara-box mensaje-helix';
      box.style.cssText = 'opacity:0;transform:translateY(10px);transition:all 0.6s ease;margin-top:0.8rem;';
      const estado = p.pagado ? 'EJECUTADO' : 'IMPAGADO';
      const linea2 = p.pagado
        ? `Saldo tras operación: ${p.saldoTras} CR`
        : `Saldo insuficiente. Cargo pendiente.`;
      box.innerHTML = `
        <div class="remitente">DE: HELIX BANK · DOMICILIACIONES</div>
        <div class="cuerpo-mensaje" style="font-size:0.85em;line-height:1.7">
          Estimado/a usuario/a. Le comunicamos el resultado del cargo automático correspondiente al período en curso · ${estado}<br><br>
          Concepto: ALQUILER UNIDAD 273-19A<br>
          Importe: −${p.importe} CR<br>
          ${linea2}<br><br>
          <span style="opacity:0.6">Para una consulta detallada, le invitamos amablemente a revisar sus recibos domiciliados.</span>
        </div>`;
      body.appendChild(box);
      setTimeout(()=>{box.style.opacity='1';box.style.transform='translateY(0)';},100);
    } else if(p.tipo === 'amenaza'){
      const box = document.createElement('div');
      box.className = 'mensaje-mara-box mensaje-helix-amenaza';
      box.style.cssText = 'opacity:0;transform:translateY(10px);transition:all 0.6s ease;margin-top:0.8rem;border-left-color:rgba(255,100,124,0.7);';
      box.innerHTML = `
        <div class="remitente" style="color:rgba(255,100,124,0.85)">DE: HELIX BANK · RECUPERACIONES</div>
        <div class="cuerpo-mensaje" style="font-size:0.85em;line-height:1.7">
          Estimado/a usuario/a. Nos vemos en la obligación de comunicarle que su unidad presenta tres o más cargos pendientes de regularización.<br>
          Se ha iniciado, conforme a protocolo, un procedimiento de revisión contractual.<br><br>
          Le recomendamos encarecidamente proceder a la regularización de su situación a la mayor brevedad posible.<br><br>
          <span style="opacity:0.6">Nuestro equipo de Recuperaciones se pondrá en contacto con usted si la situación así lo requiriese.</span>
        </div>`;
      body.appendChild(box);
      setTimeout(()=>{box.style.opacity='1';box.style.transform='translateY(0)';},100);
    } else if(p.tipo === 'misionMara'){
      const box = document.createElement('div');
      box.className = 'mensaje-mara-box mensaje-mision';
      box.style.cssText = 'opacity:0;transform:translateY(10px);transition:all 0.6s ease;margin-top:0.8rem;border-left:3px solid var(--magenta);';
      const conf = nivelConfianzaMara();
      const info = pidioInfoMara();
      let cuerpoTxt = '';
      if(!info && conf !== 'alta'){
        cuerpoTxt = `Casillero 218.<br>Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>No te demores. No respondas.`;
      } else if(!info && conf === 'alta'){
        cuerpoTxt = `218. Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>Si algo va mal, no me llames. Sal por el ascensor sur.<br>Estaré ahí cuando llegues.`;
      } else if(info && conf !== 'alta'){
        cuerpoTxt = `Casillero 218 como te dije.<br>Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>Sabes lo que vienes a buscar. No te entretengas.`;
      } else {
        cuerpoTxt = `Tal como hablamos.<br>218, corredor oeste, Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>No es el primer sobre que recoges en tu vida. Aunque tú no lo sepas.<br>Confío en ti. No me hagas arrepentirme.`;
      }
      box.innerHTML = `
        <div class="remitente" style="color:var(--magenta)">DE: [REDACTADO] · CIFRADO</div>
        <div class="cuerpo-mensaje" style="font-size:0.85em;line-height:1.8">
          ${cuerpoTxt}
        </div>
        <div class="zona-btn-mision" style="margin-top:1rem;text-align:center;font-size:0.65em;opacity:0.75;letter-spacing:0.15em;color:rgba(200,216,224,0.7);">
          // CUANDO ESTÉS LISTO, ABRE <span style="color:var(--cyan)">TRABAJOS</span> EN EL APARTAMENTO PARA SALIR.
        </div>`;
      body.appendChild(box);
      setTimeout(()=>{box.style.opacity='1';box.style.transform='translateY(0)';},100);
    }
  });
  body.scrollTop = body.scrollHeight;
  Estado.terminalPendientes = [];
}

function esperar(ms){return new Promise(r=>setTimeout(r,ms));}

// ============================================================
