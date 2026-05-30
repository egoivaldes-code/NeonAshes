// ============================================================
// BLOQUE JS-27 — CIERRE Y REAPERTURA DEL MENSAJE DEL APARTAMENTO
// v0.69.3:
//   - El cuadro de texto del apartamento (narr-apt) se cierra al
//     tocarlo/clicarlo, para disfrutar de la imagen.
//   - Si no se toca, se cierra solo tras unos segundos.
//   - Cuando una acción del apartamento genera un mensaje NUEVO
//     (mirar por la ventana, terminal, dormir, etc.), el cuadro se
//     reabre automáticamente y vuelve a contar sus segundos.
//   Cerrarlo solo lo oculta visualmente; no afecta a la lógica.
// ============================================================

(function(){
  const SEGUNDOS_AUTO = 8; // se cierra solo tras 8s en pantalla
  let _timerAuto = null;

  function narrEl(){ return document.getElementById('narr-apt'); }

  function cerrar(){
    const narr = narrEl();
    if(!narr || narr.classList.contains('cerrada')) return;
    // El juego puede haber dejado opacity:1 inline tras su animación.
    // Lo neutralizamos para que la transición de cierre se vea.
    narr.style.animation = 'none';
    narr.style.opacity = '';
    narr.classList.add('cerrada');
    if(_timerAuto){ clearTimeout(_timerAuto); _timerAuto = null; }
  }

  function abrirYProgramar(){
    const narr = narrEl();
    if(!narr) return;
    narr.classList.remove('cerrada');
    // El juego pone opacity:0 inline al regenerar el texto y luego
    // lo anima a 1. No tocamos esa animación; solo nos aseguramos de
    // que la clase 'cerrada' (max-height/overflow) no quede activa.
    narr.onclick = cerrar;
    if(_timerAuto) clearTimeout(_timerAuto);
    _timerAuto = setTimeout(cerrar, SEGUNDOS_AUTO * 1000);
  }

  // Observar el contenido de narr-apt: si cambia el texto (nueva
  // acción del jugador), reabrir el cuadro y reiniciar el contador.
  function vigilarContenido(){
    const narr = narrEl();
    if(!narr || narr._vigilado) return;
    narr._vigilado = true;
    const obsTexto = new MutationObserver(()=>{
      setTimeout(abrirYProgramar, 60);
    });
    obsTexto.observe(narr, { childList:true, subtree:true, characterData:true });
  }

  // Detectar cuándo el apartamento pasa a estar activo
  let _ultimoActivo = false;
  function check(){
    const apt = document.getElementById('apartamento');
    const activo = apt && apt.classList.contains('activa');
    if(activo && !_ultimoActivo){
      vigilarContenido();
      setTimeout(abrirYProgramar, 900); // tras la animación de entrada
    }
    _ultimoActivo = activo;
  }

  let _t = null;
  const obs = new MutationObserver(()=>{
    clearTimeout(_t);
    _t = setTimeout(check, 150);
  });
  obs.observe(document.body, { subtree:true, attributeFilter:['class'] });

  document.addEventListener('DOMContentLoaded', function(){
    vigilarContenido();
    check();
  });
})();

// ============================================================
