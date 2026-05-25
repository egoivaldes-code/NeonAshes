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

// Cargar audio: probar Blob URL primero, con fallback a data URI directo
(function loadAudio(){
  const dataUri = ASSETS.AUDIO;
  let blobUrlIntentado = null;

  // Si el Blob URL falla (entorno restringido), volver al data URI
  audioEl.addEventListener('error', function fallback(e){
    if(audioEl.src.startsWith('blob:') || audioEl.src.startsWith('blob-')){
      console.warn('Blob URL rechazado, usando data URI directo como fallback');
      audioEl.removeEventListener('error', fallback);
      audioEl.src = dataUri;
      audioEl.load();
    }
  }, {once: true});

  try {
    if(dataUri.startsWith('data:')){
      const [meta, b64] = dataUri.split(',');
      const mime = meta.match(/data:([^;]+)/)[1];
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for(let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], {type: mime});
      const blobUrl = URL.createObjectURL(blob);
      audioEl.src = blobUrl;
      blobUrlIntentado = blobUrl;
      console.log('Intentando Blob URL:', blobUrl, '(', bytes.length, 'bytes)');
    } else {
      audioEl.src = dataUri;
    }
    audioEl.load();
  } catch(err){
    console.error('Error preparando Blob, usando data URI:', err);
    audioEl.src = dataUri;
    audioEl.load();
  }
})();

// Estado

// ============================================================