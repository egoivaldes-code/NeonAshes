// ============================================================
// BLOQUE JS-03 — AUDIO — alternancia de pistas
// Al entrar suena Main Theme entero. Al terminar, Ashes of Helix
//   entero. Al terminar, vuelve a Main Theme, en bucle.
//   EXCEPCION: en el apartamento, una vez que Main Theme ha sonado
//   al menos una vez, suena el loop ambiental (ASSETS.AUDIO). Esa
//   logica vive en 16_musica_misiones.js.
//
// IMPORTANTE: toda reproduccion pasa por reproducirPista() (definida
//   en 15_audio_control.js), que respeta window.AUDIO_ON. Asi, si el
//   jugador ha apagado el sonido, la alternancia NO lo reactiva sola.
// ============================================================

const audioEl = document.getElementById('tema-principal');
if(audioEl){
  audioEl.addEventListener('error', (e) => {
    console.error('Audio error:', audioEl.error && audioEl.error.code);
  });
}

// Estado global de la musica (que pista toca ahora).
window.MUSICA = {
  mainThemeYaSono: false,   // ha sonado el Main Theme al menos una vez?
  pistaActual: 'main',      // 'main' | 'ashes' | 'loop_apt'
  enApartamento: false
};

// Precargar Main Theme como pista inicial (sin sonar todavia).
if(audioEl){
  audioEl.src = ASSETS.MAIN_THEME;
  audioEl.loop = false;
  audioEl.load();

  // Cuando una pista termina, decide la siguiente.
  audioEl.addEventListener('ended', function(){
    // Si el jugador apago el sonido, no encadenamos nada.
    if(typeof window.AUDIO_ON !== 'undefined' && !window.AUDIO_ON) return;
    // En el apartamento con Main Theme ya sonado, manda 16_musica_misiones.
    if(window.MUSICA.enApartamento && window.MUSICA.mainThemeYaSono) return;

    if(window.MUSICA.pistaActual === 'main'){
      window.MUSICA.mainThemeYaSono = true;
      window.MUSICA.pistaActual = 'ashes';
      if(typeof reproducirPista === 'function') reproducirPista('ASHES_OF_HELIX', false);
    } else {
      window.MUSICA.pistaActual = 'main';
      if(typeof reproducirPista === 'function') reproducirPista('MAIN_THEME', false);
    }
  });
}

// ============================================================
