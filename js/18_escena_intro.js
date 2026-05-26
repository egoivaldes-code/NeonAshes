// ============================================================
// BLOQUE JS-21 — INTRO CINEMATOGRÁFICA (5 frames)
// La introducción del juego: avanza con cada tap, glitches
//   visuales, y termina pasando a la pantalla de carga.
// ============================================================

let introActivo=true,frameActual=0,timerIntro=null,frameListo=false;
function iniciarIntro(){
  iniciarTema();
  document.getElementById('cine-top').classList.add('activa');
  document.getElementById('cine-bottom').classList.add('activa');
  mostrarFrame(0);
}
function mostrarFrame(idx){
  if(!introActivo)return;
  frameActual=idx;
  frameListo=false;
  // Ocultar todos los frames
  for(let i=0;i<=5;i++){
    const f=document.getElementById('frame-'+i);
    if(f){f.style.transition='opacity 0.9s ease';f.style.opacity='0';f.classList.remove('visible');}
    const h=document.getElementById('hint-'+i);
    if(h)h.classList.remove('visible');
  }
  const frame=document.getElementById('frame-'+idx);
  if(!frame){finalizarIntro();return;}
  setTimeout(()=>{
    if(!introActivo)return;
    frame.style.opacity='1';frame.classList.add('visible');
    if(idx>=1){
      document.getElementById('btn-skip').classList.add('activo');
      const permSkip = document.getElementById('perm-btn-skip');
      if(permSkip) permSkip.classList.add('activo');
    }

    if(idx===0){
      // Frame negro: avance automático tras 3s (música arranca)
      timerIntro=setTimeout(()=>{
        if(introActivo)avanzarFrameIntro();
      },3000);
    } else {
      // Frames con contenido: glitches + esperar tap del usuario
      setTimeout(()=>{if(introActivo)dispararGlitch(idx);},1500);
      setTimeout(()=>{if(introActivo)dispararGlitch(idx);},2800);
      // Mostrar hint 'toca para continuar' tras 1.5s
      timerIntro=setTimeout(()=>{
        if(!introActivo)return;
        frameListo=true;
        const hint=document.getElementById('hint-'+idx);
        if(hint)hint.classList.add('visible');
      },1500);
    }
  },60);
}
function avanzarFrameIntro(){
  if(!introActivo)return;
  const idx=frameActual;
  const frame=document.getElementById('frame-'+idx);
  if(!frame)return;
  // Si es frame 0 (negro), no requiere "listo"
  if(idx>0 && !frameListo)return;
  clearTimeout(timerIntro);
  frame.style.opacity='0';
  // Ocultar hint también
  const hint=document.getElementById('hint-'+idx);
  if(hint)hint.classList.remove('visible');
  setTimeout(()=>{
    if(introActivo){idx<5?mostrarFrame(idx+1):finalizarIntro();}
  },800);
}
// Listener para avanzar intro por click/tap
document.getElementById('intro-escena').addEventListener('click', (e)=>{
  // Ignorar clicks en cualquier botón de skip (viejo o nuevo)
  if(e.target.id==='btn-skip' || e.target.id==='perm-btn-skip' || e.target.closest('#perm-btn-skip'))return;
  avanzarFrameIntro();
});
function dispararGlitch(idx){const g=document.getElementById('glitch-'+idx);if(!g)return;g.classList.add('active');setTimeout(()=>g.classList.remove('active'),220);}
// Helper: ocultar/mostrar el botón SALTAR INTRO en AMBAS barras
function ocultarBotonSkip(){
  const a = document.getElementById('btn-skip');
  if(a) a.classList.remove('activo');
  const b = document.getElementById('perm-btn-skip');
  if(b) b.classList.remove('activo');
}
function saltarIntro(){
  introActivo=false;
  clearTimeout(timerIntro);
  ocultarBotonSkip();
  for(let i=0;i<=5;i++){const f=document.getElementById('frame-'+i);if(f){f.style.opacity='0';f.classList.remove('visible');}}
  finalizarIntro();
}
function finalizarIntro(){
  introActivo=false;
  ocultarBotonSkip();
  document.getElementById('cine-top').classList.remove('activa');
  document.getElementById('cine-bottom').classList.remove('activa');
  const ov=document.getElementById('transicion');
  ov.style.transition='opacity 0.8s ease';ov.classList.add('oscurecer');
  setTimeout(()=>{
    document.getElementById('intro-escena').classList.remove('activa');
    document.getElementById('carga').classList.add('activa');
    ov.classList.remove('oscurecer');
    setTimeout(avanzarCarga,500);
  },800);
}

window.addEventListener('load',()=>setTimeout(iniciarIntro,200));

// CARGA

// ============================================================