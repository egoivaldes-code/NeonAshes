// ============================================================
// BLOQUE JS-32 — TERMINAL — mensajes pendientes (Helix, Mara)
// Pinta los mensajes que el jugador encuentra al abrir el terminal
//   en su apartamento.
// ============================================================

function irATerminal(){
  // ESTADO HUMANO: encender el terminal a las 3am, leer mensajes urgentes... cansa.
  ajustarHumano('fatiga', 4);
  saltoDeEscena(); // +50 a +70 minutos al cambiar de escena
  cambiarEscena('apartamento','terminal-escena');setTimeout(escribirTerminal,700);
}

async function escribirTerminal(){
  const body=document.getElementById('terminal-body');body.innerHTML='';
  const n=Estado.jugador.nombre,a=Estado.jugador.apellido1;
  // ANTI-BUCLE: si la misión ya está hecha o completada, NO mostramos el
  // mensaje inicial de Mara ni el botón "SALIR DEL APARTAMENTO". Solo
  // los recibos de HELIX y un terminal vacío. La trama no debe rebobinar.
  const yaHecha = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';

  // ANTI-BUCLE 2: si el jugador ya vio el mensaje de Mara y volvió al
  // apartamento sin aceptar, NO repetimos toda la animación de descifrado.
  // Mostramos un resumen breve y el mensaje cifrado tal cual, listo
  // para que pueda decidir si sale al bar o no.
  Estado.memoria = Estado.memoria || {};
  const yaVioMensajeMara = Estado.memoria.vioMensajeMaraEnTerminal === true;

  // === RAMA RÁPIDA: ya vio el mensaje de Mara, no ha hecho la misión ===
  // Sin esperas largas, sin "descifrando…", sin re-boot ceremonioso.
  if(yaVioMensajeMara && !yaHecha){
    // Cabecera mínima
    const d1=document.createElement('div');d1.className='linea-terminal sistema';
    d1.textContent=`> sesión restaurada · ${n.toUpperCase()} ${a.toUpperCase()}`;
    body.appendChild(d1);
    // Si hay mensajes nuevos de HELIX (cobros), los anunciamos y pintamos.
    const numPendientes = (Estado.terminalPendientes || []).length;
    if(numPendientes > 0){
      const d2=document.createElement('div');d2.className='linea-terminal sistema';
      d2.textContent=`> ${numPendientes} notificacion(es) HELIX BANK`;
      body.appendChild(d2);
      await esperar(400);
      pintarMensajesHelixPendientes(body);
      await esperar(600);
    }
    // El mensaje de Mara sigue ahí: lo reproducimos tal cual, sin descifrado.
    const dM=document.createElement('div');dM.className='linea-terminal cifrado';
    dM.textContent=`> mensaje pendiente: [REDACTADO]`;
    body.appendChild(dM);
    const msg=document.createElement('div');
    msg.className='mensaje-mara-box';
    msg.style.cssText='opacity:1;transform:translateY(0);transition:all 0.6s ease';
    msg.innerHTML=`<div class="remitente">DE: [REDACTADO]</div><div class="cuerpo-mensaje">Bar Noir.<br>Una hora.<br><br>No respondas.</div>`;
    body.appendChild(msg);
    body.scrollTop=body.scrollHeight;
    // Activamos el botón SALIR inmediatamente: ya conoces la dirección.
    document.getElementById('btn-terminal').style.display='block';
    return;
  }

  const lineas=[{txt:`> boot 4.1.7`,cls:'linea-terminal sistema',d:0},{txt:`> usuario: ${n.toUpperCase()} ${a.toUpperCase()}`,cls:'linea-terminal sistema',d:400}];
  // Si hay mensajes pendientes de HELIX, los anunciamos antes del de Mara.
  const numPendientes = (Estado.terminalPendientes || []).length;
  if(numPendientes > 0){
    lineas.push({txt:`> ${numPendientes} notificacion(es) HELIX BANK`,cls:'linea-terminal sistema',d:700});
  }
  if(yaHecha){
    // Mensaje sobrio: bandeja sin nada nuevo.
    lineas.push({txt:`> bandeja entrante — sin mensajes nuevos`,cls:'linea-terminal sistema',d:900});
  } else {
    lineas.push({txt:`> 1 mensaje entrante — PRIORIDAD ALTA`,cls:'linea-terminal alerta',d:900});
    lineas.push({txt:`> descifrando…`,cls:'linea-terminal cifrado',d:1300});
    lineas.push({txt:`> completado.`,cls:'linea-terminal sistema',d:2000});
  }
  for(const l of lineas){await esperar(l.d);const d=document.createElement('div');d.className=l.cls;d.textContent=l.txt;body.appendChild(d);body.scrollTop=body.scrollHeight;}
  // Pintamos los mensajes pendientes de HELIX (cobros, amenaza).
  if(numPendientes > 0){
    await esperar(800);
    pintarMensajesHelixPendientes(body);
  }
  if(yaHecha){
    // Tras la misión: solo un botón discreto para volver al apartamento.
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
  // Marcar que el mensaje de Mara ya se ha visto. Si el jugador vuelve
  // al apartamento sin aceptar y reentra al terminal, no le repetiremos
  // toda la animación de descifrado (ver "RAMA RÁPIDA" al inicio de
  // esta función).
  Estado.memoria = Estado.memoria || {};
  Estado.memoria.vioMensajeMaraEnTerminal = true;
  if(typeof guardarPartida === 'function') guardarPartida();
}

// Pinta en el terminal los mensajes pendientes de HELIX Bank. Cada
// cobro se ve como una "factura" sobria. La amenaza tiene su propio
// formato más agresivo (sin perder el tono burocrático).
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
      // Mensaje cifrado con las coordenadas del paquete.
      // La combinación 0-2-7-1-9 es tu fecha de nacimiento "oficial"
      // según HELIX. Lo notarás cuando abras el paquete.
      //
      // CAPA 2: el texto varía según si pediste info y la confianza
      // con Mara. Cuatro versiones posibles (combinaciones de 2x2,
      // con neutra/baja unidas en uno mismo).
      const box = document.createElement('div');
      box.className = 'mensaje-mara-box mensaje-mision';
      box.style.cssText = 'opacity:0;transform:translateY(10px);transition:all 0.6s ease;margin-top:0.8rem;border-left:3px solid var(--magenta);';
      // Selección del texto según el estado.
      const conf = nivelConfianzaMara();
      const info = pidioInfoMara();
      let cuerpoTxt = '';
      if(!info && conf !== 'alta'){
        // Estándar (sin info, neutra/baja)
        cuerpoTxt = `Casillero 218.<br>Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>No te demores. No respondas.`;
      } else if(!info && conf === 'alta'){
        // Sin info + confianza alta
        cuerpoTxt = `218. Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>Si algo va mal, no me llames. Sal por el ascensor sur.<br>Estaré ahí cuando llegues.`;
      } else if(info && conf !== 'alta'){
        // Con info + neutra/baja
        cuerpoTxt = `Casillero 218 como te dije.<br>Corredor oeste. Nivel 4.<br><br>Combinación: <span style="letter-spacing:0.3em;color:var(--cyan)">0 - 2 - 7 - 1 - 9</span><br><br>Sabes lo que vienes a buscar. No te entretengas.`;
      } else {
        // Con info + confianza alta
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
  // Tras mostrarlos, los limpiamos. Quedan en Estado.recibos por si
  // el jugador quiere consultarlos en el inventario.
  Estado.terminalPendientes = [];
}
function esperar(ms){return new Promise(r=>setTimeout(r,ms));}


// ============================================================