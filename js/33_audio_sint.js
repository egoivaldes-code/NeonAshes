// ============================================================
// BLOQUE JS-43 — AUDIO SINTETIZADO (mensajes, teclas)
// Sonidos generados al vuelo (Web Audio API) para el efecto de
//   mensaje entrante y el "click click" de las teclas tipeadas.
// ============================================================

// ============================================================
// ECO — APARTAMENTO TRAS EL FINAL
// ============================================================
// El jugador vuelve a casa. El mundo le devuelve un eco de lo que hizo.
// El mensaje que recibe en el terminal depende de la libreta de memoria.

// Decide qué mensaje compone, según las anotaciones de la libreta.
// Devuelve un objeto con: prologo, from, body, firma, claseQuien, claseBody.
// ============================================================
// AUDIO DEL TERMINAL — pitidos sintéticos según remitente
// ============================================================
// Usa la Web Audio API para generar los sonidos en el navegador,
// sin necesidad de archivos externos. Cada remitente tiene su firma sonora.
//
// Filosofía: silencios > sonidos. Volúmenes muy bajos. Nada estridente.
// Si algún día reemplazamos esto por archivos de audio reales, las
// funciones de aquí abajo conservan los mismos nombres.

let _audioCtx = null;
function obtenerAudioCtx(){
  if(_audioCtx) return _audioCtx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    _audioCtx = new AC();
    return _audioCtx;
  } catch(e){
    return null;
  }
}

// Reproduce un tono sinusoidal con envolvente suave (attack/release).
// freq = frecuencia en Hz, dur = duración en segundos, vol = 0..1.
function tonoSimple(freq, dur, vol, tipo){
  const ctx = obtenerAudioCtx();
  if(!ctx) return;
  if(ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gan = ctx.createGain();
  osc.type = tipo || 'sine';
  osc.frequency.value = freq;
  // Envolvente: ataque rápido, decaimiento natural, sin clicks.
  const t = ctx.currentTime;
  gan.gain.setValueAtTime(0, t);
  gan.gain.linearRampToValueAtTime(vol, t + 0.01);
  gan.gain.linearRampToValueAtTime(vol * 0.7, t + dur * 0.5);
  gan.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(gan);
  gan.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Ruido blanco con duración y volumen. Útil para estática.
function ruidoBlanco(dur, vol){
  const ctx = obtenerAudioCtx();
  if(!ctx) return;
  if(ctx.state === 'suspended') ctx.resume();
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i = 0; i < bufferSize; i++){
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gan = ctx.createGain();
  const t = ctx.currentTime;
  gan.gain.setValueAtTime(0, t);
  gan.gain.linearRampToValueAtTime(vol, t + 0.05);
  gan.gain.linearRampToValueAtTime(0, t + dur);
  // Filtro pasa-bajos para que el ruido suene más como estática lejana.
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 2200;
  src.connect(filtro);
  filtro.connect(gan);
  gan.connect(ctx.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// Firma sonora del mensaje según el remitente.
// Se llama una sola vez, cuando llega la notificación.
function sonidoMensajeLlegada(remitente){
  switch(remitente){
    case 'mara':
      // Bip-bip: dos tonos cortos, frecuencia media. Discreto, profesional.
      tonoSimple(880, 0.08, 0.12, 'square');
      setTimeout(()=>tonoSimple(1100, 0.09, 0.12, 'square'), 110);
      break;
    case 'helix':
      // Un tono grave, largo, monótono. Burocrático, frío.
      tonoSimple(220, 0.55, 0.10, 'sine');
      // Una segunda capa armónica muy baja para darle peso.
      tonoSimple(110, 0.55, 0.05, 'sine');
      break;
    case 'vecino':
      // Un solo blip corto, suave. Casi tímido.
      tonoSimple(660, 0.07, 0.08, 'sine');
      break;
    case 'cero':
      // Estática suave + tono profundo subiendo. Inquietante, sin agresividad.
      ruidoBlanco(1.4, 0.04);
      tonoSimple(80, 1.2, 0.06, 'sine');
      setTimeout(()=>tonoSimple(160, 0.8, 0.04, 'sine'), 400);
      break;
  }
}

// Click muy bajo de "tecla". Se llama por cada carácter que se tipea.
// El volumen es tan bajo que es casi subliminal. Eso es a propósito.
function sonidoTeclaTipear(){
  // Variación aleatoria de tono para que no suene mecánico.
  const freq = 1500 + Math.random() * 600;
  tonoSimple(freq, 0.012, 0.018, 'square');
}


// ============================================================