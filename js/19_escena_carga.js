// ============================================================
// BLOQUE JS-22 — CARGA y transición a IDENTIDAD
// Mensajes "sincronizando memoria...", barra de progreso y paso
//   a la pantalla donde escribes tu nombre.
// ============================================================

const mensajesCarga=['Sincronizando memoria…','Reconstruyendo entorno…','Cargando identidad…','Conectando con las Pilas…','Sistema listo.'];
let idxCarga=0;const txtCarga=document.getElementById('texto-carga'),barraProg=document.getElementById('barra-prog');
function avanzarCarga(){
  if(idxCarga<mensajesCarga.length){
    txtCarga.textContent=mensajesCarga[idxCarga];
    barraProg.style.width=((idxCarga+1)/mensajesCarga.length*100)+'%';
    idxCarga++;
    if(idxCarga<mensajesCarga.length){
      setTimeout(avanzarCarga,Math.random()*420+280);
    } else {
      // Carga automática: cuando la barra termina, entramos solos en
      // el juego. Ya no hace falta pulsar "INICIAR PROTOCOLO".
      // Esperamos un instante para que el jugador vea el "Sistema listo."
      setTimeout(()=>{
        if(typeof iniciarJuego === 'function') iniciarJuego();
      }, 800);
    }
  }
}

function cambiarEscena(desde,hacia){
  fadeTemaCambioEscena();
  const ov=document.getElementById('transicion');
  ov.style.transition='opacity 0.6s ease';ov.classList.add('oscurecer');
  setTimeout(()=>{
    document.getElementById(desde).classList.remove('activa');
    document.getElementById(hacia).classList.add('activa');
    ov.classList.remove('oscurecer');
  },500);
}

function iniciarJuego(){
  // Antes de mostrar la pantalla de identidad, comprobar si hay partida previa.
  prepararPantallaIdentidad();
  cambiarEscena('carga','nombre-escena');
}

// Si el jugador ya jugó antes, lo reconocemos y le ofrecemos continuar.
// Si no, la pantalla de identidad sale tal cual (pidiendo nombre).

// ============================================================