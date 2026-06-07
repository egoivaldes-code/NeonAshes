// ============================================================
// NEON ASHES — MERCADO (compraventa)  ·  v0.86.9
// ------------------------------------------------------------
// Tienda diegética accesible desde el terminal del apartamento
// (icono MERCADO). Cierra el círculo económico del loop de expedición:
// vendes lo que sacas (botín, materiales) y compras equipo para la
// siguiente incursión.
//
// Reglas de precio (el documento pide mercado caro, venta por debajo):
//   - compra: lo que cuesta llevarte el item a casa (caro).
//   - venta : lo que te dan por soltarlo (~40-50% de la compra). Nunca
//     igual ni mayor que la compra: si no, sería dinero infinito.
//   Un item con compra 0 (o sin compra) NO se puede comprar (solo botín
//   que se vende). Un item con venta 0 NO se puede vender.
//
// Precios PROVISIONALES y fáciles de ajustar: todo vive en MERCADO_PRECIOS.
// ============================================================

const MERCADO_PRECIOS = {
  // EQUIPO (se compra y se vende) ── compra cara, venta ~45%.
  kit_trauma:        { compra: 220, venta: 90 },
  medkit:            { compra: 90,  venta: 38 },
  cargador:          { compra: 60,  venta: 24 },
  racion_deshidratada:{ compra: 18, venta: 6 },
  licor:             { compra: 35,  venta: 14 },
  bateria_2v:        { compra: 20,  venta: 8 },
  bateria_4v:        { compra: 40,  venta: 16 },
  bateria_8v:        { compra: 80,  venta: 34 },
  palanca_termica:   { compra: 110, venta: 45 },
  senuelo:           { compra: 70,  venta: 28 },
  arma_blanca:       { compra: 150, venta: 65 },
  arma_fuego:        { compra: 320, venta: 130 },
  analizador:        { compra: 260, venta: 110 },
  carga_analizador:  { compra: 45,  venta: 18 },
  ganzua:            { compra: 55,  venta: 22 },
  mascara_filtro:    { compra: 130, venta: 55 },

  // MATERIALES Y BOTÍN (solo se venden; compra 0).
  chatarra:          { compra: 0, venta: 12 },
  chatarra_cruda:    { compra: 0, venta: 9 },
  chatarra_refinada: { compra: 0, venta: 28 },
  nucleo_optico:     { compra: 0, venta: 120 },
  servidor_hundido:  { compra: 0, venta: 180 }
};

// Catálogo de lo COMPRABLE: items con precio de compra > 0, en el orden
// en que se quieren mostrar en la tienda.
const _MERCADO_COMPRABLE = [
  'medkit','kit_trauma','cargador','ganzua','carga_analizador',
  'senuelo','racion_deshidratada','licor',
  'bateria_2v','bateria_4v','bateria_8v',
  'palanca_termica','mascara_filtro','arma_blanca','arma_fuego','analizador'
];

function _mercItem(id){
  const cat = (typeof ITEMS_EXPEDICION !== 'undefined') ? ITEMS_EXPEDICION : [];
  let it = cat.find(x => x.id === id);
  if(it) return it;
  const cat2 = (typeof ITEMS_EXPLORAR !== 'undefined') ? ITEMS_EXPLORAR : [];
  return cat2.find(x => x.id === id) || null;
}
function _mercNombre(id){ const it = _mercItem(id); return it ? it.nombre : id; }
function _mercDesc(id){ const it = _mercItem(id); return it ? (it.desc || '') : ''; }

function _mercCreditos(){ return (Estado && typeof Estado.creditos === 'number') ? Estado.creditos : 0; }

// ============================================================
// RENDER
// ============================================================
let _mercTab = 'vender';

function renderMercado(tab){
  _mercTab = (tab === 'comprar') ? 'comprar' : 'vender';
  const cls = (t) => _mercTab === t ? 'cp-tab activa' : 'cp-tab';
  let html = ''
    + '<div class="merc-saldo">Saldo: <span class="merc-saldo-cifra">'+_mercCreditos()+' CR</span></div>'
    + '<div class="cp-tabs">'
    +   '<button class="'+cls('vender')+'" onclick="cambiarTabMercado(\'vender\')">VENDER</button>'
    +   '<button class="'+cls('comprar')+'" onclick="cambiarTabMercado(\'comprar\')">COMPRAR</button>'
    + '</div>'
    + '<div id="merc-cuerpo">' + (_mercTab === 'comprar' ? _renderComprar() : _renderVender()) + '</div>';
  return html;
}

function cambiarTabMercado(tab){
  _mercTab = (tab === 'comprar') ? 'comprar' : 'vender';
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderMercado(_mercTab);
}

// Repinta solo el cuerpo (tras una operación), conservando la pestaña.
function _mercRefrescar(){
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderMercado(_mercTab);
}

// ── VENDER: recorre el inventario, muestra lo que tiene precio de venta ──
function _renderVender(){
  const inv = (Estado.inventario || []).filter(it => {
    const p = MERCADO_PRECIOS[it.id];
    return p && p.venta > 0;
  });
  if(inv.length === 0){
    return '<div class="merc-vacio">No tienes nada que el perista quiera comprarte. Vuelve cuando hayas rebuscado algo.</div>';
  }
  let html = '<div class="merc-intro">El perista apenas levanta la vista. Paga poco, pero paga.</div>';
  inv.forEach(it => {
    const p = MERCADO_PRECIOS[it.id];
    const cant = it.cantidad || 1;
    html += '<div class="merc-fila">'
      + '<div class="merc-fila-info"><span class="merc-fila-nombre">'+it.nombre+'</span>'
      + '<span class="merc-fila-meta">tienes '+cant+' · te dan '+p.venta+' CR c/u</span></div>'
      + '<button class="merc-btn merc-btn-vender" onclick="venderItemMercado(\''+it.id+'\')">Vender →</button>'
      + '</div>';
  });
  return html;
}

// ── COMPRAR: catálogo de equipo con precio de compra ──
function _renderComprar(){
  let html = '<div class="merc-intro">Material de segunda mano, precios de primera. Aquí abajo nada sale barato.</div>';
  const saldo = _mercCreditos();
  _MERCADO_COMPRABLE.forEach(id => {
    const p = MERCADO_PRECIOS[id];
    if(!p || p.compra <= 0) return;
    const puede = saldo >= p.compra;
    html += '<div class="merc-fila">'
      + '<div class="merc-fila-info"><span class="merc-fila-nombre">'+_mercNombre(id)+'</span>'
      + '<span class="merc-fila-meta">'+p.compra+' CR</span></div>';
    if(puede){
      html += '<button class="merc-btn merc-btn-comprar" onclick="comprarItemMercado(\''+id+'\')">Comprar ←</button>';
    } else {
      html += '<button class="merc-btn merc-btn-no" disabled>Sin saldo</button>';
    }
    html += '</div>';
  });
  return html;
}

// ============================================================
// OPERACIONES
// ============================================================
function venderItemMercado(id){
  const p = MERCADO_PRECIOS[id];
  if(!p || p.venta <= 0) return;
  const it = (Estado.inventario || []).find(i => i.id === id);
  if(!it) return;
  // Vender de una en una (en móvil, control fino sin teclear cantidades).
  if(typeof quitarItem === 'function') quitarItem(id, 1);
  if(typeof ajustarCreditos === 'function') ajustarCreditos(p.venta);
  else Estado.creditos = (Estado.creditos || 0) + p.venta;
  if(typeof notificarCambio === 'function') notificarCambio('+'+p.venta+' CR', 'creditos');
  _mercRefrescar();
}

function comprarItemMercado(id){
  const p = MERCADO_PRECIOS[id];
  if(!p || p.compra <= 0) return;
  if(_mercCreditos() < p.compra) return;
  if(typeof ajustarCreditos === 'function') ajustarCreditos(-p.compra);
  else Estado.creditos = (Estado.creditos || 0) - p.compra;
  if(typeof darItemPorId === 'function') darItemPorId(id);
  if(typeof notificarCambio === 'function') notificarCambio('OBJETO · '+_mercNombre(id), 'creditos');
  _mercRefrescar();
}

window.MERCADO_PRECIOS = MERCADO_PRECIOS;
window.renderMercado = renderMercado;
window.cambiarTabMercado = cambiarTabMercado;
window.venderItemMercado = venderItemMercado;
window.comprarItemMercado = comprarItemMercado;
