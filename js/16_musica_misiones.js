// ============================================================
// BLOQUE JS-16 — MÚSICA DEL APARTAMENTO
// v0.69: Controla la excepción del apartamento. Cuando el
//   jugador está en el apartamento Y el Main Theme ya ha sonado
//   al menos una vez, suena el loop ambiental original
//   (ASSETS.AUDIO, la música que el juego tenía desde el inicio).
//   Al salir del apartamento, la alternancia global Main Theme /
//   Ashes of Helix (definida en 03_audio_referencia.js) retoma
//   el control de forma natural en la siguiente pista.
// ============================================================

(function(){
  const audioEl = document.getElementById('tema-principal');
  if(!audioEl) return;

  function aptActivo(){
    const el = document.getElementById('apartamento');
    return el && el.classList.contains('activa');
  }

  function checkApartamento(){
    if(typeof window.MUSICA === 'undefined') return;
    const dentro = aptActivo();
    if(dentro === window.MUSICA.enApartamento) return; // sin cambios
    window.MUSICA.enApartamento = dentro;

    if(dentro && window.MUSICA.mainThemeYaSono){
      // Entrar al apartamento (con Main Theme ya escuchado):
      // poner el loop ambiental original.
      if(window.MUSICA.pistaActual !== 'loop_apt'){
        window.MUSICA.pistaActual = 'loop_apt';
        audioEl.src = ASSETS.AUDIO;
        audioEl.loop = true;
        audioEl.load();
        audioEl.play().catch(()=>{});
      }
    } else if(!dentro && window.MUSICA.pistaActual === 'loop_apt'){
      // Salir del apartamento: cortar el loop y volver a la
      // alternancia global empezando por Main Theme.
      window.MUSICA.pistaActual = 'main';
      audioEl.src = ASSETS.MAIN_THEME;
      audioEl.loop = false;
      audioEl.load();
      audioEl.play().catch(()=>{});
    }
  }

  // Observar cambios de clase con debounce para no dispararse en
  // mitad de las transiciones de escena.
  let _t = null;
  const obs = new MutationObserver(()=>{
    clearTimeout(_t);
    _t = setTimeout(checkApartamento, 150);
  });
  obs.observe(document.body, { subtree:true, attributeFilter:['class'] });
})();

// ============================================================
