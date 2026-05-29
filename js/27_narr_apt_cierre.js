// ============================================================
// BLOQUE JS-27 — CIERRE DEL MENSAJE NARRATIVO DEL APARTAMENTO
// v0.69c: El cuadro de texto del apartamento (narr-apt) se puede
//   cerrar tocándolo/clicándolo, para disfrutar de la imagen. Y
//   si no se toca, se cierra solo tras unos segundos.
//   Cerrarlo solo lo oculta visualmente; no afecta a las opciones
//   ni a la lógica del juego.
// ============================================================

(function(){
  const SEGUNDOS_AUTO = 8; // se cierra solo tras 8s en pantalla
  let _timerAuto = null;

  function cerrarNarr(){
    const narr = document.getElementById('narr-apt');
    if(!narr || narr.classList.contains('cerrada')) return;
    narr.classList.add('cerrada');
    if(_timerAuto){ clearTimeout(_timerAuto); _timerAuto = null; }
  }

  // Cada vez que el apartamento se vuelve visible, re-armar el cierre:
  // el mensaje vuelve a mostrarse al entrar, y se programa su cierre.
  function armar(){
    const narr = document.getElementById('narr-apt');
    if(!narr) return;
    // Asegurar que el mensaje está visible al entrar
    narr.classList.remove('cerrada');
    // Cierre por toque/click
    narr.onclick = cerrarNarr;
    // Cierre automático
    if(_timerAuto) clearTimeout(_timerAuto);
    _timerAuto = setTimeout(cerrarNarr, SEGUNDOS_AUTO * 1000);
  }

  // Detectar cuándo el apartamento pasa a estar activo
  let _ultimoActivo = false;
  function check(){
    const apt = document.getElementById('apartamento');
    const activo = apt && apt.classList.contains('activa');
    if(activo && !_ultimoActivo){
      // Pequeño retardo para dejar que aparezca con su animación
      setTimeout(armar, 900);
    }
    _ultimoActivo = activo;
  }

  let _t = null;
  const obs = new MutationObserver(()=>{
    clearTimeout(_t);
    _t = setTimeout(check, 150);
  });
  obs.observe(document.body, { subtree:true, attributeFilter:['class'] });

  // Primera comprobación al cargar
  document.addEventListener('DOMContentLoaded', check);
})();

// ============================================================
