// ============================================================
// BLOQUE JS-26 — ECO — REGRESO al apartamento tras el final
// Cuando vuelves a casa después de la decisión con Mara.
// ============================================================

// ============================================================
// VOLVER AL APARTAMENTO DESDE EL ECO
// ============================================================
// El eco es ahora una pieza narrativa de cierre, no un final.
// Tras leerlo, el jugador vuelve al apartamento con su personaje
// vivo, sus créditos, sus recibos, su inventario, todo. La vida
// sigue: puede dormir más días, ver cobros domiciliados acumulados,
// salir a explorar zonas, hacer otros encargos, o morir por agotamiento.
function volverApartamentoDesdeEco(){
  saltoDeEscena();
  // Avanzar el tiempo unas horas (acaba de dormir tras leer el eco).
  if(typeof avanzarTiempoJuego === 'function'){
    avanzarTiempoJuego(60 * (5 + Math.floor(Math.random() * 3)));
  }
  ajustarHumano('fatiga', -6);
  ajustarHumano('aislamiento', 1);
  if(typeof guardarPartida === 'function') guardarPartida();
  // Volver al apartamento. La función ajustarTextosApartamentoSegunMemoria
  // se encarga de mostrar textos coherentes con la decisión tomada.
  cambiarEscena('eco-escena', 'apartamento');
  setTimeout(()=>{
    if(typeof ajustarTextosApartamentoSegunMemoria === 'function'){
      ajustarTextosApartamentoSegunMemoria();
    }
    if(typeof mostrarHUD === 'function') mostrarHUD(true);
    if(typeof actualizarHUD === 'function') actualizarHUD();
    if(typeof iniciarRelojDiegético === 'function') iniciarRelojDiegético();
    if(typeof iniciarDecaimientoPasivo === 'function') iniciarDecaimientoPasivo();
    if(typeof iniciarCobrosPeriódicos === 'function') iniciarCobrosPeriódicos();
  }, 600);
}


// ============================================================

// ============================================================
// BLOQUE JS-44 — ECO — mensaje tipeado del terminal
// El mensaje final que aparece tipeándose solo en el terminal
//   cuando vuelves a casa.
// ============================================================

function componerEcoMensaje(){
  const m = Estado.memoria || {};
  const n = Estado.jugador.nombre || 'huésped';

  // PRIORIDAD 1: si vio a CERO, el eco más extraño prevalece.
  // Mensaje sin remitente. Una frase que no debería existir.
  if(m.vioFragmentoCero){
    return {
      remitente: 'cero',
      prologo: 'La puerta cierra detrás de ti. La lluvia sigue. El terminal pita una vez. No hay remitente.',
      from: 'DE: <span class="quien cero">◈ — — — ◈</span>',
      body: '«Te recuerdo desde antes de que existieras.<br>Vuelve a dormir, '+n.toLowerCase()+'.<br>Mañana seguirás aquí.»',
      firma: 'ORIGEN: NO REGISTRADO // TIMESTAMP: 19:48:12 — AYER',
      claseBody: 'glitch'
    };
  }

  // PRIORIDAD 2: aceptó el encargo. Mara cumple lo prometido.
  if(m.aceptoEncargo === true){
    // Sub-variante: si Mara confía y el jugador fue directo.
    if(m.confianzaMara >= 2){
      return {
        remitente: 'mara',
        prologo: 'La puerta cierra detrás de ti. Te quitas la chaqueta empapada. El terminal pita.',
        from: 'DE: <span class="quien">M.V.</span>',
        body: 'Coordenadas: N4 / corredor oeste / casillero 218.<br>Hora: 06:00.<br>No llegues tarde.<br>No vengas acompañado.',
        firma: 'CIFRADO LOCAL // AUTO-BORRADO 90 MIN'
      };
    }
    // Sub-variante: aceptó pero preguntó mucho. Mara está cauta.
    if(m.pidioMasInfo || m.vecesPidioInfo >= 2){
      return {
        remitente: 'mara',
        prologo: 'La puerta cierra detrás de ti. El apartamento huele a humedad. El terminal pita.',
        from: 'DE: <span class="quien">M.V.</span>',
        body: 'Has preguntado demasiado esta noche.<br>Cierra la boca hasta mañana.<br>Coordenadas a las 05:55. Ni un minuto antes.',
        firma: 'CIFRADO LOCAL // AUTO-BORRADO 60 MIN'
      };
    }
    // Sub-variante: aceptó en silencio. Mara seca, eficaz.
    return {
      remitente: 'mara',
      prologo: 'La puerta cierra detrás de ti. Te sientas en la cama. El terminal pita.',
      from: 'DE: <span class="quien">M.V.</span>',
      body: 'N4. Casillero 218. 06:00.<br>Eso es todo.',
      firma: 'CIFRADO LOCAL // AUTO-BORRADO 90 MIN'
    };
  }

  // PRIORIDAD 3: rechazó el encargo. Nada de Mara — solo la realidad.
  // HELIX no perdona. Una notificación administrativa, fría, devastadora.
  if(m.aceptoEncargo === false){
    return {
      remitente: 'helix',
      prologo: 'La puerta cierra detrás de ti. El silencio es casi peor que la lluvia. El terminal pita una vez.',
      from: 'DE: <span class="quien helix">HELIX // GESTIÓN DE DEUDA</span>',
      body: 'Aviso automatizado.<br>Cuota médica vencida: 847 CR.<br>Próximo cobro: 72h.<br>En caso de impago, suspensión parcial de implante respiratorio.<br><br>Gracias por confiar en HELIX.',
      firma: 'TICKET #HX-44781-K // NO RESPONDER'
    };
  }

  // PRIORIDAD 4: ni aceptó ni rechazó (se quedó callado y se fue).
  // Un mensaje del vecino, anónimo. Algo cotidiano, humano.
  return {
    remitente: 'vecino',
    prologo: 'La puerta cierra detrás de ti. Goteo en algún rincón del bloque. El terminal pita.',
    from: 'DE: <span class="quien">VECINO 19-B</span>',
    body: '¿Eres tú el de las 03? El ascensor lleva tres horas roto.<br>Si vas a bajar, avísame. Tengo que llevar al niño al turno de mañana.',
    firma: 'MENSAJE LOCAL // BLOQUE 19-A'
  };
}

// Anima la llegada del mensaje: prólogo → terminal aparece → tipeo → firma → acciones.
async function mostrarEcoMensaje(){
  const eco = componerEcoMensaje();
  // Reset visual
  document.getElementById('eco-terminal').classList.remove('visible');
  document.getElementById('eco-firma').classList.remove('visible');
  document.getElementById('eco-acciones').classList.remove('visible');

  // ESTADO HUMANO: el prólogo se tiñe según cómo llega el jugador a casa.
  // Una frase extra, sutil, en cursiva, debajo del prólogo principal.
  const h = Estado.humano || {};
  let prologoExtra = '';
  if(nivel(h.fatiga) === 'extremo'){
    prologoExtra = ' <span style="opacity:0.55;font-style:italic">Las piernas casi no responden.</span>';
  } else if(nivel(h.fatiga) === 'alto'){
    prologoExtra = ' <span style="opacity:0.55;font-style:italic">Te sientas antes de quitarte la chaqueta.</span>';
  }
  if(nivel(h.aislamiento) === 'extremo' || nivel(h.aislamiento) === 'alto'){
    prologoExtra += ' <span style="opacity:0.55;font-style:italic">La habitación está más vacía que de costumbre.</span>';
  }
  if(nivel(h.disociacion) === 'extremo'){
    prologoExtra += ' <span style="opacity:0.55;font-style:italic;color:rgba(255,180,200,0.5)">Por un segundo, no recuerdas haber abierto la puerta.</span>';
  } else if(nivel(h.disociacion) === 'alto'){
    prologoExtra += ' <span style="opacity:0.55;font-style:italic">El tiempo va ligeramente fuera de fase.</span>';
  }

  document.getElementById('eco-prologo-txt').innerHTML = eco.prologo + prologoExtra;
  document.getElementById('eco-msg-from').innerHTML = eco.from;
  document.getElementById('eco-msg-body').innerHTML = '<span class="eco-cursor"></span>';
  document.getElementById('eco-msg-body').className = 'eco-msg-body' + (eco.claseBody ? ' '+eco.claseBody : '');
  document.getElementById('eco-firma').textContent = eco.firma;

  // Velocidad de tipeo: si el jugador está disociado, el texto aparece con
  // pequeñas pausas irregulares. Si está fatigado, va un poco más lento.
  let velocidadTipeo = 22;
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo') velocidadTipeo += 6;
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo') velocidadTipeo += 4;

  // Espera narrativa antes de que aparezca el terminal
  await esperar(2400);
  // El terminal aparece visualmente Y suena al mismo tiempo.
  // Cada remitente tiene una firma sonora distinta.
  sonidoMensajeLlegada(eco.remitente);
  document.getElementById('eco-terminal').classList.add('visible');
  await esperar(900);

  // Efecto de tipeo del cuerpo del mensaje (con tic-tic sutil por carácter)
  await tipearEnElemento(document.getElementById('eco-msg-body'), eco.body, velocidadTipeo);

  await esperar(600);
  document.getElementById('eco-firma').classList.add('visible');
  await esperar(900);
  document.getElementById('eco-acciones').classList.add('visible');
}

// Tipea un texto HTML carácter a carácter dentro de un elemento.
// Respeta etiquetas <br> y <span> simples sin romperlas.
// Cada carácter real reproduce un click MUY sutil para reforzar la inmersión.
function tipearEnElemento(el, html, velocidad){
  return new Promise(resolve => {
    el.innerHTML = '';
    let i = 0;
    const cursor = '<span class="eco-cursor"></span>';
    function paso(){
      if(i >= html.length){
        el.innerHTML = html;
        resolve();
        return;
      }
      let avanzaCaracterReal = false;
      // Si encontramos una etiqueta, la añadimos entera de golpe (sin sonar).
      if(html[i] === '<'){
        const cierre = html.indexOf('>', i);
        if(cierre !== -1){
          i = cierre + 1;
        } else {
          i++;
        }
      } else {
        i++;
        avanzaCaracterReal = true;
      }
      // Sonido de tecla con probabilidad: no en cada letra, para que no sature.
      // Espacios y saltos no suenan. Aprox 1 de cada 2 caracteres.
      if(avanzaCaracterReal && html[i-1] !== ' ' && Math.random() < 0.55){
        sonidoTeclaTipear();
      }
      el.innerHTML = html.slice(0, i) + cursor;
      setTimeout(paso, velocidad);
    }
    paso();
  });
}


// ============================================================