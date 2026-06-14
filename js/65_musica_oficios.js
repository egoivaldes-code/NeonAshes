// ============================================================
// BLOQUE JS-65 — MÚSICA DE OFICIOS (v0.106)
// Cuando el jugador está en la escena de Investigador (casos-escena)
//   o de Cazarrecompensas (caza-escena), suena en bucle el tema de
//   jazz noir con lluvia (ASSETS.JAZZ_NOIR). Al salir, devuelve el
//   control a la alternancia global (03_audio_referencia.js).
//
// Mismo patrón que 16_musica_misiones.js (apartamento): toda
//   reproducción pasa por reproducirPista() para respetar
//   window.AUDIO_ON. Si el jugador apagó el sonido, entrar o salir
//   de un oficio NO lo vuelve a encender.
//
// Coordinación: usamos window.MUSICA.pistaActual = 'loop_oficio'
//   para que ni la alternancia global ni el módulo del apartamento
//   pisen esta pista mientras el oficio está activo.
// ============================================================

(function(){
  // Escenas que disparan el tema de jazz noir.
  const ESCENAS_OFICIO = ['casos-escena', 'caza-escena'];

  function oficioActivo(){
    return ESCENAS_OFICIO.some(id => {
      const el = document.getElementById(id);
      return el && el.classList.contains('activa');
    });
  }

  let _enOficio = false;

  function checkOficio(){
    if(typeof window.MUSICA === 'undefined') return;
    const dentro = oficioActivo();
    if(dentro === _enOficio) return; // sin cambios
    _enOficio = dentro;

    if(dentro){
      // Entrar a un oficio: jazz noir en bucle.
      if(window.MUSICA.pistaActual !== 'loop_oficio'){
        window.MUSICA.pistaActual = 'loop_oficio';
        if(typeof reproducirPista === 'function') reproducirPista('JAZZ_NOIR', true);
      }
    } else if(window.MUSICA.pistaActual === 'loop_oficio'){
      // Salir del oficio: devolver el control a la alternancia global.
      // Si estamos en el apartamento y el Main Theme ya sonó, el módulo
      // del apartamento retomará su loop al detectar la escena; aquí solo
      // soltamos el control volviendo a Main Theme como punto neutro.
      window.MUSICA.pistaActual = 'main';
      if(typeof reproducirPista === 'function') reproducirPista('MAIN_THEME', false);
    }
  }

  // Observar cambios de clase con debounce para no dispararse en
  // mitad de las transiciones de escena.
  let _t = null;
  const obs = new MutationObserver(()=>{
    clearTimeout(_t);
    _t = setTimeout(checkOficio, 150);
  });
  obs.observe(document.body, { subtree:true, attributeFilter:['class'] });
})();

// ============================================================
