// ============================================================
// BLOQUE JS-45 — REINICIAR PARTIDA
// Devuelve al jugador a la pantalla inicial sin borrar el save
//   (para que pueda "empezar de nuevo" reconocido).
// ============================================================

function irAEco(){
  saltoDeEscena();
  cambiarEscena('final-escena','eco-escena');
  mostrarEcoMensaje();
}

function reiniciar(){
  // NOTA: reiniciar es "cerrar la partida y volver a la pantalla inicial".
  // NO borra la partida guardada — eso lo hace explícitamente "EMPEZAR DE NUEVO".
  // Así el jugador que acaba puede volver a empezar y será reconocido.
  Estado.jugador={nombre:'',apellido1:''};Estado.historialDialogo=[];
  Estado.creditos=LAUNCHER.CREDITOS_INICIALES;Estado.reputacion=0;Estado.inventario=[];Estado.eventosVistos=[];
  // Limpiar la libreta de memoria EN MEMORIA (la guardada se queda).
  Estado.memoria = {
    aceptoEncargo: null,
    pidioMasInfo: false,
    guardoSilencio: false,
    vecesPidioInfo: 0,
    vioFragmentoCero: false,
    confianzaMara: 0,
    tonoJugador: null,
    noticiasVistas: true
  };
  // Limpiar el estado humano EN MEMORIA.
  Estado.humano = {
    fatiga: 8,
    aislamiento: 12,
    hambre: 5,
    disociacion: 0
  };
  // Limpiar el tiempo del juego EN MEMORIA (se reactivará al confirmar identidad).
  Estado.tiempoJuego = null;
  // Ocultar reloj diegético hasta que se entre de nuevo al apartamento.
  ocultarRelojDiegético();
  detenerDecaimientoPasivo();
  detenerCobrosPeriódicos();
  mostrarHUD(false);
  actualizarHUD();
  ['input-nombre','input-apellido1'].forEach(id=>document.getElementById(id).value='');
  ['zona-dialogo','mercado-opciones','terminal-body','tarjetas-loc'].forEach(id=>document.getElementById(id).innerHTML='');
  document.getElementById('btn-terminal').style.display='none';
  const mc=document.getElementById('mara-card');mc.style.opacity='0';mc.style.transform='translateY(10px)';
  idxCarga=0;barraProg.style.width='0%';document.getElementById('btn-inicio').style.display='none';
  const audio=document.getElementById('tema-principal');
  if(audio&&!temaMuted){let v=audio.volume;const iv=setInterval(()=>{v=Math.max(v-0.04,0);audio.volume=v;if(v<=0){clearInterval(iv);audio.currentTime=0;}},30);}
  // Resetear el estado de la musica para que la nueva partida arranque
  // limpia en Main Theme (sin arrastrar 'ashes' o 'loop_apt').
  if(window.MUSICA){ window.MUSICA.pistaActual='main'; window.MUSICA.mainThemeYaSono=false; window.MUSICA.enApartamento=false; }
  introActivo=true;frameActual=0;
  ocultarBotonSkip();
  const ov=document.getElementById('transicion');
  ov.style.transition='opacity 0.6s ease';ov.classList.add('oscurecer');
  setTimeout(()=>{
    document.getElementById('final-escena').classList.remove('activa');
    document.getElementById('eco-escena').classList.remove('activa');
    document.getElementById('intro-escena').classList.add('activa');
    ov.classList.remove('oscurecer');
    setTimeout(iniciarIntro,300);
  },600);
}

['input-nombre','input-apellido1'].forEach((id,i,arr)=>{
  document.getElementById(id).addEventListener('keydown',e=>{
    if(e.key==='Enter'){i<arr.length-1?document.getElementById(arr[i+1]).focus():confirmarNombre();}
  });
});


// Desbloquear audio al primer toque (para iOS/Safari)

// ============================================================