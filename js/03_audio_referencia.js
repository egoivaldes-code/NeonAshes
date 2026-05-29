// ============================================================
// BLOQUE JS-03 — AUDIO — referencia y carga del tema principal
// v0.68: Main Theme suena íntegro al entrar. Al terminar,
//   cambia automáticamente al loop ambiental (ASSETS.AUDIO).
// ============================================================

const audioEl = document.getElementById('tema-principal');
audioEl.addEventListener('error', (e) => {
  console.error('Audio error:', audioEl.error && audioEl.error.code, audioEl.error && audioEl.error.message);
});
audioEl.addEventListener('canplaythrough', () => {
  console.log('Audio listo:', audioEl.duration, 's');
});
audioEl.addEventListener('loadeddata', () => {
  console.log('Audio cargado');
});

// Cargar Main Theme al inicio (sin loop)
audioEl.src = ASSETS.MAIN_THEME;
audioEl.loop = false;
audioEl.load();

// Al terminar el Main Theme, pasar al loop ambiental
audioEl.addEventListener('ended', function _onMainThemeEnd() {
  audioEl.removeEventListener('ended', _onMainThemeEnd);
  audioEl.src = ASSETS.AUDIO;
  audioEl.loop = true;
  audioEl.load();
  audioEl.play().catch(() => {});
  console.log('Main Theme terminado — entrando en loop ambiental');
});

// ============================================================
