// ============================================================
//  NEON ASHES — BARRA DE FILTROS DE TABLÓN (v0.117)
//  Barra común, fija arriba, para todos los tablones de misión
//  (casos del investigador, encargos del cazarrecompensas, corridas).
//  Ofrece: botón VOLVER + filtro por rango + filtro de ya hechas.
//
//  Los tres tablones comparten la misma estructura HTML (cabecera
//  casos-cab, lista casos-lista, tarjetas caso-card), así que una sola
//  barra y un solo CSS sirven para todos.
//
//  Estado de los filtros: por defecto AMBOS activados (rango y ocultar
//  hechas), como pidió el diseño. Persisten en memoria de la partida.
// ============================================================

// Estado de filtros por contexto (cada tablón recuerda el suyo).
// _FILTROS_TABLON[ctx] = { soloRango: true, ocultarHechas: true }
const _FILTROS_TABLON = {};

function _filtrosTablon(ctx){
  if(!_FILTROS_TABLON[ctx]){
    // Intentar recuperar de memoria; si no, valores por defecto (ambos ON).
    let guardado = null;
    try {
      if(Estado && Estado.memoria && Estado.memoria.filtrosTablon && Estado.memoria.filtrosTablon[ctx]){
        guardado = Estado.memoria.filtrosTablon[ctx];
      }
    } catch(e){ guardado = null; }
    _FILTROS_TABLON[ctx] = guardado || { soloRango: true, ocultarHechas: true };
  }
  return _FILTROS_TABLON[ctx];
}

function _guardarFiltrosTablon(ctx){
  try {
    Estado.memoria = Estado.memoria || {};
    Estado.memoria.filtrosTablon = Estado.memoria.filtrosTablon || {};
    Estado.memoria.filtrosTablon[ctx] = _FILTROS_TABLON[ctx];
    if(typeof guardarPartida === 'function') guardarPartida();
  } catch(e){ /* sin persistencia, no pasa nada grave */ }
}

// Construye el HTML de la barra de filtros fija. 'ctx' identifica el
// tablón ('casos' | 'caza' | 'corrida'); 'onVolver' es la llamada del
// botón volver; 'onToggle' es la función global que repinta el tablón.
function barraFiltrosTablon(ctx, txtVolver, onVolver, fnRepintar){
  const f = _filtrosTablon(ctx);
  const claseOn = 'filtro-btn filtro-on';
  const claseOff = 'filtro-btn';
  return ''
    + '<div class="tablon-barra-fija">'
    +   '<button class="btn-terminal tablon-volver" onclick="' + onVolver + '">' + txtVolver + '</button>'
    +   '<div class="tablon-filtros">'
    +     '<button class="' + (f.soloRango ? claseOn : claseOff) + '" '
    +       'onclick="toggleFiltroTablon(\'' + ctx + '\',\'soloRango\',\'' + fnRepintar + '\')">'
    +       'MI RANGO</button>'
    +     '<button class="' + (f.ocultarHechas ? claseOn : claseOff) + '" '
    +       'onclick="toggleFiltroTablon(\'' + ctx + '\',\'ocultarHechas\',\'' + fnRepintar + '\')">'
    +       'OCULTAR HECHAS</button>'
    +   '</div>'
    + '</div>';
}

// Cambia un filtro y repinta el tablón llamando a la función indicada.
function toggleFiltroTablon(ctx, clave, fnRepintar){
  const f = _filtrosTablon(ctx);
  f[clave] = !f[clave];
  _guardarFiltrosTablon(ctx);
  // Llama a la función de repintado del tablón correspondiente.
  try {
    if(typeof window[fnRepintar] === 'function') window[fnRepintar]();
  } catch(e){ /* nada */ }
}

// ¿Debe MOSTRARSE este ítem según los filtros activos?
//  - soloRango: oculta los de rango superior al del jugador.
//  - ocultarHechas: oculta los ya completados.
// Devuelve true si el ítem pasa los filtros (se muestra).
function pasaFiltrosTablon(ctx, opts){
  const f = _filtrosTablon(ctx);
  // opts = { bloqueadoRango: bool, yaHecha: bool }
  if(f.soloRango && opts.bloqueadoRango) return false;
  if(f.ocultarHechas && opts.yaHecha) return false;
  return true;
}

// Mensaje cuando los filtros dejan la lista vacía.
function avisoTablonVacio(ctx){
  const f = _filtrosTablon(ctx);
  let motivo = 'No hay nada que mostrar con los filtros activos.';
  if(f.soloRango && f.ocultarHechas){
    motivo = 'Nada disponible para tu rango que no hayas hecho ya. '
      + 'Desactiva un filtro para ver más.';
  } else if(f.soloRango){
    motivo = 'Nada para tu rango ahora mismo. Desactiva "MI RANGO" para ver lo que vendrá.';
  } else if(f.ocultarHechas){
    motivo = 'Ya lo has hecho todo. Desactiva "OCULTAR HECHAS" para repasar.';
  }
  return '<div class="caso-nota tablon-vacio">' + motivo + '</div>';
}

// Exponer al ámbito global.
window.barraFiltrosTablon = barraFiltrosTablon;
window.toggleFiltroTablon = toggleFiltroTablon;
window.pasaFiltrosTablon = pasaFiltrosTablon;
window.avisoTablonVacio = avisoTablonVacio;
