// ============================================================
// BLOQUE JS-26 — MINI-BARRAS DE ESTADO EN EL BOTÓN PERMANENTE
// v0.69: Dibuja 4 mini-barras (Fatiga, Aislamiento, Hambre,
//   Disociación) encima del texto ESTADO, en el mismo orden
//   vertical y con los mismos colores que el panel completo.
//   Permite leer la condición del personaje de un vistazo, sin
//   abrir la ventana.
// ============================================================

// Mismo criterio de color que renderEstado() en 25_panel_estado.js
function _pmbColor(val){
  const lv = (typeof nivel === 'function') ? nivel(val) : 'minimo';
  if(lv === 'minimo') return '#78ffa0';
  if(lv === 'bajo')   return '#a8ff78';
  if(lv === 'medio')  return '#ffdc78';
  if(lv === 'alto')   return '#ffa078';
  return '#ff647c';
}

// Actualiza las 4 mini-barras con el estado humano actual.
function actualizarMiniBarrasEstado(){
  if(typeof Estado === 'undefined' || !Estado.humano) return;
  const h = Estado.humano;
  const mapa = {
    'pmb-fatiga':      h.fatiga      || 0,
    'pmb-aislamiento': h.aislamiento || 0,
    'pmb-hambre':      h.hambre      || 0,
    'pmb-disociacion': h.disociacion || 0
  };
  for(const id in mapa){
    const el = document.getElementById(id);
    if(!el) continue;
    const val = Math.min(100, mapa[id]);
    el.style.width = val + '%';
    el.style.background = _pmbColor(val);
  }
}

// Envolver actualizarHUD para que las mini-barras se refresquen
// cada vez que cambia el estado, sin tocar el archivo del HUD.
(function(){
  if(typeof window === 'undefined') return;
  const _orig = window.actualizarHUD;
  window.actualizarHUD = function(){
    if(typeof _orig === 'function') _orig.apply(this, arguments);
    try { actualizarMiniBarrasEstado(); } catch(e){ /* sin ruido */ }
  };
  // Primera pintura al cargar
  document.addEventListener('DOMContentLoaded', actualizarMiniBarrasEstado);
})();

// ============================================================
