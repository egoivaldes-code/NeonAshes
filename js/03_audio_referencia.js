// ============================================================
// BLOQUE JS-03 — AUDIO — pista principal y alternancia
// v0.69: Al entrar suena Main Theme entero. Al terminar, suena
//   Ashes of Helix entero. Al terminar, vuelve a Main Theme, y
//   así en bucle (las dos canciones completas, alternándose).
//   EXCEPCIÓN: en el apartamento, una vez que Main Theme ha
//   sonado al menos una vez, suena el loop ambiental original
//   (ASSETS.AUDIO). La lógica del apartamento vive en
//   16_musica_misiones.js.
// ============================================================

const audioEl = document.getElementById('tema-principal');
audioEl.addEventListener('error', (e) => {
  console.error('Audio error:', audioEl.error && audioEl.error.code, audioEl.error && audioEl.error.message);
});

// Estado global de la música
window.MUSICA = {
  mainThemeYaSono: false,   // ¿ha sonado el Main Theme al menos una vez?
  pistaActual: 'main',      // 'main' | 'ashes' | 'loop_apt'
  enApartamento: false
};

// Reproduce una pista por su clave de ASSETS, con o sin loop.
function _ponerPista(clave, conLoop){
  audioEl.src = ASSETS[clave];
  audioEl.loop = !!conLoop;
  audioEl.load();
  const p = audioEl.play();
  if(p !== undefined) p.catch(()=>{});
}

// Arranca con Main Theme (sin loop: al acabar salta a Ashes)
audioEl.src = ASSETS.MAIN_THEME;
audioEl.loop = false;
audioEl.load();

// Alternancia global: cuando una pista termina, decide la siguiente.
audioEl.addEventListener('ended', function(){
  // Si estamos en el apartamento y Main Theme ya sonó, el control
  // lo lleva 16_musica_misiones.js (loop ambiental). No hacemos nada.
  if(window.MUSICA.enApartamento && window.MUSICA.mainThemeYaSono) return;

  if(window.MUSICA.pistaActual === 'main'){
    window.MUSICA.mainThemeYaSono = true;
    window.MUSICA.pistaActual = 'ashes';
    _ponerPista('ASHES_OF_HELIX', false);
  } else {
    // Tras Ashes (o loop), vuelve a Main Theme entero
    window.MUSICA.pistaActual = 'main';
    _ponerPista('MAIN_THEME', false);
  }
});

// ============================================================
