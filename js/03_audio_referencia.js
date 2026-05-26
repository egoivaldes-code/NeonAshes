// ============================================================
// BLOQUE JS-03 — AUDIO — referencia al elemento del tema principal
// Solo declara la variable. Toda la lógica de audio está más
//   abajo, en su propio bloque.
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

// Cargar audio desde el archivo en assets/
audioEl.src = ASSETS.AUDIO;
audioEl.load();

// Estado

// ============================================================