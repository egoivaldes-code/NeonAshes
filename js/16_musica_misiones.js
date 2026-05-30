// ============================================================
// BLOQUE JS-16 — MUSICA DEL APARTAMENTO
// Cuando el jugador esta en el apartamento Y el Main Theme ya ha
//   sonado al menos una vez, suena el loop ambiental (ASSETS.AUDIO).
//   Al salir, la alternancia global (03_audio_referencia.js) retoma
//   el control empezando por Main Theme.
//
// IMPORTANTE: toda reproduccion pasa por reproducirPista() para
//   respetar window.AUDIO_ON. Si el jugador apago el sonido, entrar
//   o salir del apartamento NO lo vuelve a encender.
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
      // Entrar al apartamento (con Main Theme ya escuchado): loop ambiental.
      if(window.MUSICA.pistaActual !== 'loop_apt'){
        window.MUSICA.pistaActual = 'loop_apt';
        if(typeof reproducirPista === 'function') reproducirPista('AUDIO', true);
      }
    } else if(!dentro && window.MUSICA.pistaActual === 'loop_apt'){
      // Salir del apartamento: volver a la alternancia global por Main Theme.
      window.MUSICA.pistaActual = 'main';
      if(typeof reproducirPista === 'function') reproducirPista('MAIN_THEME', false);
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
