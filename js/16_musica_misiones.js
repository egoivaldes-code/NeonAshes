// ============================================================
// BLOQUE JS-16 — MÚSICA DE MISIONES
// v0.68: Ashes of Helix suena en bucle durante misiones
//   narrativas (tránsito bar, bar interior, misión casillero).
//   Al salir, retorna al loop ambiental principal.
// ============================================================

let _misionMusicActiva = false;

function iniciarMusicaMision() {
  if (_misionMusicActiva) return;
  const a = document.getElementById('tema-principal');
  if (!a) return;
  _misionMusicActiva = true;

  // Fade out del tema actual
  let v = a.volume;
  const fadeOut = setInterval(() => {
    v = Math.max(v - 0.05, 0);
    a.volume = v;
    if (v <= 0) {
      clearInterval(fadeOut);
      a.src = ASSETS.ASHES_OF_HELIX;
      a.loop = true;
      a.load();
      a.play().catch(() => {});
      // Fade in
      let v2 = 0;
      const fadeIn = setInterval(() => {
        v2 = Math.min(v2 + 0.02, 0.5);
        a.volume = v2;
        if (v2 >= 0.5) clearInterval(fadeIn);
      }, 60);
    }
  }, 40);
}

function terminarMusicaMision() {
  if (!_misionMusicActiva) return;
  const a = document.getElementById('tema-principal');
  if (!a) return;
  _misionMusicActiva = false;

  // Fade out de Ashes of Helix
  let v = a.volume;
  const fadeOut = setInterval(() => {
    v = Math.max(v - 0.05, 0);
    a.volume = v;
    if (v <= 0) {
      clearInterval(fadeOut);
      a.src = ASSETS.AUDIO;
      a.loop = true;
      a.load();
      a.play().catch(() => {});
      // Fade in
      let v2 = 0;
      const fadeIn = setInterval(() => {
        v2 = Math.min(v2 + 0.02, 0.55);
        a.volume = v2;
        if (v2 >= 0.55) clearInterval(fadeIn);
      }, 60);
    }
  }, 40);
}

// ============================================================
// Detección automática de escenas de misión
// Observa cambios de clase 'activa' en las escenas relevantes
// ============================================================

(function() {
  const escenasMision = ['transito-bar-escena', 'bar-escena', 'casillero-escena'];

  function checkEscenas() {
    const enMision = escenasMision.some(id => {
      const el = document.getElementById(id);
      return el && el.classList.contains('activa');
    });
    if (enMision && !_misionMusicActiva) iniciarMusicaMision();
    else if (!enMision && _misionMusicActiva) terminarMusicaMision();
  }

  // Observar cambios en el DOM para detectar cambios de escena
  const observer = new MutationObserver(checkEscenas);
  observer.observe(document.body, { subtree: true, attributeFilter: ['class'] });
})();

// ============================================================
