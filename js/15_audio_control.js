// ============================================================
// BLOQUE JS-18 — AUDIO — control central (estado único)
// Un solo estado manda: window.AUDIO_ON (¿el jugador quiere sonido?)
// y window.AUDIO_VOL (volumen 0..1). TODA reproducción pasa por
// reproducirPista(), que respeta ese estado. La alternancia
// (03_audio_referencia.js) y el apartamento (16_musica_misiones.js)
// llaman aquí en vez de tocar el <audio> a pelo. Asi el boton y la
// musica nunca se contradicen.
// ============================================================

// Estado global de la verdad. Si AUDIO_ON es false, NADA suena,
// pase lo que pase con la alternancia o las escenas.
window.AUDIO_ON  = true;     // el jugador quiere musica
window.AUDIO_VOL = 0.55;     // volumen objetivo 0..1
let audioStarted = false;    // ya arranco alguna vez con exito?

// Compatibilidad con codigo viejo que aun mira estas variables.
let temaMuted = false;       // = !AUDIO_ON
let audioUnlocked = false;

// ------------------------------------------------------------
// REPRODUCCION CENTRAL
// Pone una pista (por clave de ASSETS) respetando el estado.
// Si el audio esta apagado, prepara la pista pero NO suena.
// ------------------------------------------------------------
function reproducirPista(clave, conLoop){
  const a = document.getElementById('tema-principal');
  if(!a || !ASSETS[clave]) return;
  // Cambiar de fuente solo si hace falta (evita cortes y recargas).
  const nuevaSrc = ASSETS[clave];
  if(!a.src.endsWith(nuevaSrc)){
    a.src = nuevaSrc;
    a.load();
  }
  a.loop = !!conLoop;
  a.volume = window.AUDIO_VOL;
  a.muted = false;
  if(window.AUDIO_ON){
    const p = a.play();
    if(p !== undefined){
      p.then(()=>{ audioStarted = true; }).catch(()=>{});
    } else {
      audioStarted = true;
    }
  } else {
    // El jugador lo tiene apagado: dejamos la pista lista pero en pausa.
    try{ a.pause(); }catch(e){}
  }
}

// ------------------------------------------------------------
// ARRANQUE INICIAL (desde la intro)
// ------------------------------------------------------------
function iniciarTema(){
  const a = document.getElementById('tema-principal');
  if(!a) return;
  a.volume = window.AUDIO_VOL;
  a.muted = false;
  const promise = a.play();
  if(promise !== undefined){
    promise.then(()=>{
      audioStarted = true;
      window.AUDIO_ON = true; temaMuted = false;
      sincronizarBotonesAudio();
      mostrarBarraControles(4500);
    }).catch(()=>{
      // Autoplay bloqueado: NO marcamos apagado por gusto del jugador,
      // solo "aun no ha sonado". Queda pendiente del primer toque.
      audioStarted = false;
      mostrarBarraControles(500);
    });
  } else {
    audioStarted = true;
    mostrarBarraControles(4500);
  }
}

function mostrarBarraControles(delay){
  setTimeout(()=>{
    const b = document.getElementById('barra-controles');
    if(b) b.classList.add('visible');
  }, delay);
}

// ------------------------------------------------------------
// BOTON MUTE — una sola pulsacion = un solo cambio de estado
// ------------------------------------------------------------
function toggleMute(){
  const a = document.getElementById('tema-principal');
  if(!a) return;
  // Invertimos el deseo del jugador.
  window.AUDIO_ON = !window.AUDIO_ON;
  temaMuted = !window.AUDIO_ON;

  if(window.AUDIO_ON){
    // Quiere sonido: aseguramos volumen y reanudamos lo que haya cargado.
    a.volume = window.AUDIO_VOL;
    a.muted = false;
    const p = a.play();
    if(p !== undefined) p.then(()=>{ audioStarted = true; }).catch(()=>{});
    else audioStarted = true;
  } else {
    // No quiere sonido: pausamos y punto. Nadie debe reanudar solo.
    try{ a.pause(); }catch(e){}
  }
  sincronizarBotonesAudio();
}

// Pone el texto de TODOS los botones de mute segun el estado real.
function sincronizarBotonesAudio(){
  const txt = window.AUDIO_ON ? '\u266a ON' : '\u266a OFF';
  ['btn-mute','perm-btn-mute','audio-mini-btn-mute'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = txt;
  });
}

// ------------------------------------------------------------
// VOLUMEN — actualiza estado y todos los sliders
// ------------------------------------------------------------
function cambiarVolumen(val){
  const a = document.getElementById('tema-principal');
  window.AUDIO_VOL = parseFloat(val)/100;
  if(a && window.AUDIO_ON) a.volume = window.AUDIO_VOL;
  const gradient = `linear-gradient(90deg,rgba(0,229,255,0.6) ${val}%,rgba(255,255,255,0.1) ${val}%)`;
  ['slider-vol','perm-slider-vol','audio-mini-slider'].forEach(id=>{
    const sl = document.getElementById(id);
    if(sl){
      sl.style.background = gradient;
      if(sl.value != val) sl.value = val;
    }
  });
}

// Fade suave en cambios de escena (solo si el audio esta sonando).
function fadeTemaCambioEscena(){
  const a = document.getElementById('tema-principal');
  if(!a || !window.AUDIO_ON || !audioStarted) return;
  const va = window.AUDIO_VOL, vb = Math.min(0.14, va);
  let v = va;
  const dn = setInterval(()=>{ v = Math.max(v-0.04, vb); a.volume = v; if(v<=vb) clearInterval(dn); }, 30);
  setTimeout(()=>{
    let v2 = a.volume;
    const up = setInterval(()=>{ v2 = Math.min(v2+0.018, va); a.volume = v2; if(v2>=va) clearInterval(up); }, 40);
  }, 1200);
}


// ============================================================
// DESBLOQUEO DE AUDIO (primer toque)
// Los navegadores moviles bloquean el audio hasta el primer gesto.
// En el primer toque, si el jugador quiere sonido y aun no ha
// arrancado, lo arrancamos por el canal central.
// ============================================================
function unlockAudio(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  const a = document.getElementById('tema-principal');
  if(!a) return;
  if(window.AUDIO_ON && !audioStarted){
    a.volume = window.AUDIO_VOL;
    a.muted = false;
    const p = a.play();
    if(p !== undefined){
      p.then(()=>{ audioStarted = true; sincronizarBotonesAudio(); }).catch(()=>{});
    }
  }
}
document.addEventListener('touchstart', unlockAudio, {passive: true});
document.addEventListener('click', unlockAudio);

document.body.addEventListener('touchmove', e=>{
  if(!e.target.closest('.terminal-body') && !e.target.closest('.mercado-inner') && !e.target.closest('.hub-panel-cuerpo') && !e.target.closest('.zona-detalle')) e.preventDefault();
}, {passive:false});


// ============================================================
