// ============================================================
// BLOQUE JS-18 — AUDIO — tema principal, mute, volumen, fade
// Control del tema musical del juego: arrancar, silenciar,
//   ajustar volumen y bajar/subir en cambios de escena.
// ============================================================

// AUDIO
let temaMuted=false,audioStarted=false;
function iniciarTema(){
  const a=document.getElementById('tema-principal');
  if(!a) return;
  a.volume = 0;
  a.muted = false;
  const promise = a.play();
  if(promise !== undefined){
    promise.then(()=>{
      audioStarted = true;
      console.log('Audio autoplay OK');
      // Fade in a los 3 segundos
      setTimeout(()=>{
        let v = 0;
        const iv = setInterval(()=>{
          v = Math.min(v + 0.008, 0.55);
          a.volume = v;
          if(v >= 0.55) clearInterval(iv);
        }, 80);
      }, 3000);
      mostrarBarraControles(4500);
    }).catch(err=>{
      console.log('Autoplay bloqueado, esperando interacción:', err.message);
      document.getElementById('btn-mute').textContent = '♪ OFF';
      const btnPerm = document.getElementById('perm-btn-mute');
      if(btnPerm) btnPerm.textContent = '♪ OFF';
      temaMuted = true;
      // Mostrar controles rápido para que el usuario pueda activar
      mostrarBarraControles(500);
    });
  } else {
    // Sin promise, asumimos que funciona
    audioStarted = true;
    setTimeout(()=>{a.volume = 0.55;}, 3000);
    mostrarBarraControles(4500);
  }
}

function mostrarBarraControles(delay){
  setTimeout(()=>{
    document.getElementById('barra-controles').classList.add('visible');
  },delay);
}

function toggleMute(){
  const a=document.getElementById('tema-principal');
  const btn=document.getElementById('btn-mute');
  const sl=document.getElementById('slider-vol');
  const btnPerm=document.getElementById('perm-btn-mute');
  const btnMini=document.getElementById('audio-mini-btn-mute');
  if(!a) return;

  // Helper para actualizar TODOS los botones de mute (viejo + permanente + mini)
  const setMuteText = (txt) => {
    if(btn) btn.textContent = txt;
    if(btnPerm) btnPerm.textContent = txt;
    if(btnMini) btnMini.textContent = txt;
  };

  if(temaMuted || a.paused){
    // Intentar reproducir
    const targetVol = parseFloat(sl.value)/100;
    a.volume = targetVol;
    a.muted = false;
    const playPromise = a.play();
    if(playPromise !== undefined){
      playPromise.then(()=>{
        audioStarted=true;
        temaMuted=false;
        setMuteText('♪ ON');
        console.log('Audio reproducido OK, volumen:', a.volume);
      }).catch(err=>{
        console.error('No se pudo reproducir:', err);
        setMuteText('♪ ERR');
        setTimeout(()=>{setMuteText('♪ OFF');}, 2000);
      });
    } else {
      audioStarted=true; temaMuted=false; setMuteText('♪ ON');
    }
  } else {
    a.pause();
    setMuteText('♪ OFF');
    temaMuted=true;
  }
}

function cambiarVolumen(val){
  const a=document.getElementById('tema-principal');
  if(!a||temaMuted)return;
  a.volume=parseFloat(val)/100;
  // Sincronizar TODOS los sliders (viejo + permanente + mini)
  const sliderViejo = document.getElementById('slider-vol');
  const sliderNuevo = document.getElementById('perm-slider-vol');
  const sliderMini  = document.getElementById('audio-mini-slider');
  const gradient = `linear-gradient(90deg,rgba(0,229,255,0.6) ${val}%,rgba(255,255,255,0.1) ${val}%)`;
  if(sliderViejo){
    sliderViejo.style.background = gradient;
    if(sliderViejo.value != val) sliderViejo.value = val;
  }
  if(sliderNuevo){
    sliderNuevo.style.background = gradient;
    if(sliderNuevo.value != val) sliderNuevo.value = val;
  }
  if(sliderMini){
    sliderMini.style.background = gradient;
    if(sliderMini.value != val) sliderMini.value = val;
  }
}

function fadeTemaCambioEscena(){
  const a=document.getElementById('tema-principal');
  if(!a||temaMuted||!audioStarted)return;
  const va=a.volume,vb=0.14;let v=va;
  const dn=setInterval(()=>{v=Math.max(v-0.04,vb);a.volume=v;if(v<=vb)clearInterval(dn);},30);
  setTimeout(()=>{
    let v2=a.volume;
    const up=setInterval(()=>{v2=Math.min(v2+0.018,va);a.volume=v2;if(v2>=va)clearInterval(up);},40);
  },1200);
}



// ============================================================

// ============================================================
// BLOQUE JS-46 — DESBLOQUEO DE AUDIO (primer tap)
// Los navegadores móviles bloquean el audio hasta el primer toque.
//   Aquí lo desbloqueamos en el primer tap del usuario.
// ============================================================

let audioUnlocked = false;
function unlockAudio(){
  if(audioUnlocked) return;
  const a = document.getElementById('tema-principal');
  if(!a) return;
  // Truco: reproducir y pausar inmediatamente para 'desbloquear'
  a.volume = 0;
  const p = a.play();
  if(p !== undefined){
    p.then(()=>{
      a.pause();
      a.currentTime = 0;
      audioUnlocked = true;
      console.log('Audio desbloqueado por interacción');
      // Si el usuario quiere que suene, reanudar
      if(!temaMuted){
        a.volume = 0.55;
        a.play().catch(()=>{});
      }
    }).catch(()=>{});
  }
}
document.addEventListener('touchstart', unlockAudio, {once: true, passive: true});
document.addEventListener('click', unlockAudio, {once: true});

document.body.addEventListener('touchmove',e=>{
  if(!e.target.closest('.terminal-body')&&!e.target.closest('.mercado-inner')&&!e.target.closest('.hub-panel-cuerpo')&&!e.target.closest('.zona-detalle'))e.preventDefault();
},{passive:false});


// ============================================================