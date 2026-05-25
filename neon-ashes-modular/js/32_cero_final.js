// ============================================================
// BLOQUE JS-41 — CERO — aparición final
// La aparición visual de CERO al cierre del diálogo con Mara.
// ============================================================

function mostrarCero(){
  const zona=document.getElementById('zona-dialogo');
  const zonaOpc=document.getElementById('mercado-opciones');
  // ANOTAR: el jugador ha sido tocado por un fragmento de CERO.
  recordar('vioFragmentoCero', true);
  // ESTADO HUMANO: la disociación sube de golpe. La realidad acaba de doblarse.
  // Pero no la subimos si ya está muy alta (evita muerte súbita aquí).
  if(Estado.humano && Estado.humano.disociacion < 65){
    ajustarHumano('disociacion', 35);
  } else {
    // Si ya está alta, subimos solo un poco para no matarlo en este momento.
    ajustarHumano('disociacion', Math.max(0, 99 - Estado.humano.disociacion));
  }
  guardarPartida();
  const d=document.createElement('div');d.className='cero-aparicion';
  d.innerHTML=`<div class="cero-glyph">◈ C E R O ◈</div><div class="cero-texto">FRAGMENTO DETECTADO<br>ENTIDAD: ORIGEN DESCONOCIDO<br><span style="opacity:0.6;font-size:0.5rem">«Cada elección que tomas deja un rastro en el tejido. Soy más antiguo que este universo.»</span></div>`;
  zona.appendChild(d);
  document.getElementById('mercado-inner').scrollTop=document.getElementById('mercado-inner').scrollHeight;
  setTimeout(()=>d.classList.add('visible'),100);
  // Mostrar botón para avanzar manualmente al final
  setTimeout(()=>{
    const btn=document.createElement('button');
    btn.className='btn-avanzar-loc';
    btn.style.cssText='border-color:rgba(0,229,255,0.3);color:#00e5ff;margin-top:1.5rem;';
    btn.textContent='CONTINUAR →';
    btn.onclick=irAFinal;
    zonaOpc.appendChild(btn);
    document.getElementById('mercado-inner').scrollTop=document.getElementById('mercado-inner').scrollHeight;
  },1800);
}

// El final lee la libreta de memoria y compone un texto que refleje
// las elecciones del jugador. Sin alardes. Sin exposición. Solo ecos.

// ============================================================

// ============================================================
// BLOQUE JS-42 — TEXTO FINAL del capítulo
// Compone el texto de cierre del Vertical Slice según las
//   decisiones tomadas.
// ============================================================

function componerTextoFinal(){
  const n = Estado.jugador.nombre || 'Alguien';
  const m = Estado.memoria || {};
  const lineas = [];

  // Línea 1 — apertura, depende de si aceptó, rechazó o se quedó dudando
  if(m.aceptoEncargo === true){
    lineas.push(`${n} acaba de dar el primer paso.`);
  } else if(m.aceptoEncargo === false){
    lineas.push(`${n} ha vuelto a girarse antes de cruzar una puerta.`);
  } else {
    lineas.push(`${n} no ha dicho ni sí ni no. Y eso, en las Pilas, también pesa.`);
  }

  // Línea 2 — la ciudad, matizada por el tono
  if(m.tonoJugador === 'directo'){
    lineas.push('En las Pilas, los pasos cuestan. Los rápidos cuestan más.');
  } else if(m.tonoJugador === 'cauto'){
    lineas.push('En las Pilas, dudar también deja marca.');
  } else if(m.tonoJugador === 'frio'){
    lineas.push('En las Pilas, los silencios se oyen.');
  } else {
    lineas.push('En las Pilas, los pasos cuestan.');
  }

  // Línea 3 — Mara, según la confianza acumulada
  if(m.confianzaMara >= 2){
    lineas.push('Mara Vex no hace favores. Pero esta noche te ha mirado dos veces.');
  } else if(m.confianzaMara <= -2){
    lineas.push('Mara Vex no hace favores. Y tú no le has dado motivos para empezar.');
  } else if(m.pidioMasInfo || m.vecesPidioInfo >= 2){
    lineas.push('Mara Vex no hace favores. Aunque a veces responde preguntas, si las haces bien.');
  } else {
    lineas.push('Mara Vex no hace favores. Solo negocios.');
  }

  // Línea 4 — eco de CERO, si lo vio
  let cierre = 'Lo que viene a continuación depende de ti.';
  if(m.vioFragmentoCero){
    cierre = 'Algo te ha mirado desde el otro lado del aire.<br>Lo que viene a continuación quizá no dependa solo de ti.';
  }

  // Línea extra — eco del paquete que recogiste para Mara.
  // Solo aparece si la misión llegó a la decisión del casillero.
  if(m.decisionPaquete === 'cerrado'){
    lineas.push('No supiste qué llevabas en las manos. Quizás eso sea peor.');
  } else if(m.decisionPaquete === 'abierto'){
    lineas.push('Has visto una foto tuya que no recuerdas. La fecha no encajaba.');
  } else if(m.decisionPaquete === 'robado'){
    lineas.push('Te llevaste el sobre. Mara sabe dónde vives. El sobre, también.');
  }

  // Línea 5 — eco del ESTADO HUMANO. Sólo aparece si alguna dimensión es notable.
  // Esto NO sustituye a las otras líneas; las matiza desde el cuerpo.
  const h = Estado.humano || {};
  const ecosHumanos = [];
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    ecosHumanos.push('Te pesan los párpados.');
  }
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    ecosHumanos.push('Nadie sabe dónde estás.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    ecosHumanos.push('El estómago no te deja en paz.');
  }
  if(nivel(h.disociacion) === 'medio' || nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    ecosHumanos.push('No estás seguro de qué hora es realmente.');
  }
  let bloqueHumano = '';
  if(ecosHumanos.length > 0){
    bloqueHumano = '<br><br><span style="opacity:0.6;font-style:italic">' + ecosHumanos.join(' ') + '</span>';
  }

  return lineas.join('<br>') + '<br><br>' + cierre + bloqueHumano;
}

function irAFinal(){
  // Marcamos la partida como completada y la guardamos.
  Estado.partidasCompletadas = (Estado.partidasCompletadas || 0) + 1;
  guardarPartida();
  document.getElementById('final-texto-dinamico').innerHTML = componerTextoFinal();
  mostrarHUD(false);
  detenerDecaimientoPasivo();
  detenerCobrosPeriódicos();
  cambiarEscena('mercado-escena','final-escena');
}


// ============================================================