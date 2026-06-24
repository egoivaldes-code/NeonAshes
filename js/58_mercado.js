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
  municion:          { compra: 10,  venta: 4 },
  racion_deshidratada:{ compra: 18, venta: 6 },
  licor:             { compra: 35,  venta: 14 },
  bateria_2v:        { compra: 20,  venta: 8 },
  bateria_4v:        { compra: 40,  venta: 16 },
  bateria_8v:        { compra: 80,  venta: 34 },
  palanca_termica:   { compra: 110, venta: 45 },
  senuelo:           { compra: 70,  venta: 28 },
  arma_blanca:       { compra: 150, venta: 65 },
  arma_fuego:        { compra: 320, venta: 130 },
  arma_fuego_regl:   { compra: 560, venta: 230 },
  arma_fuego_canon:  { compra: 820, venta: 330 },
  analizador:        { compra: 260, venta: 110 },
  carga_analizador:  { compra: 45,  venta: 18 },
  ganzua:            { compra: 55,  venta: 22 },
  mascara_filtro:    { compra: 130, venta: 55 },

  // ── ARMADURAS (capa de corrida) ── compra cara, venta ~45%.
  // La placa HELIX es material corporativo: la más cara y deseable.
  chaqueta_kevlar:   { compra: 240, venta: 100 },
  abrigo_trapero:    { compra: 190, venta: 80 },
  placa_helix:       { compra: 520, venta: 210 },

  // ── CONSUMIBLES DE COMBATE ── de un uso, asequibles salvo lo HELIX.
  estimulante:       { compra: 95,  venta: 38 },
  adrenalina:        { compra: 70,  venta: 28 },
  vendaje:           { compra: 45,  venta: 18 },
  inhibidor_dolor:   { compra: 140, venta: 58 },
  granada_humo:      { compra: 85,  venta: 34 },

  // ── ÍTEMS DE AVANCE ── cambian cómo cruzas el camino.
  mapa_sector:       { compra: 120, venta: 48 },
  credencial_falsa:  { compra: 260, venta: 105 },

  // EQUIPO DE OFICIO ── la credencial desbloquea la profesión Seguridad
  // HELIX; cara a propósito (el oficio "oficial" cuesta entrar). La
  // documentación sellada es la vía social barata del contrabandista.
  credencial_helix:  { compra: 900, venta: 200 },
  papel_helix:       { compra: 75,  venta: 20 },

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
  'medkit','kit_trauma','municion','ganzua','carga_analizador',
  'senuelo','racion_deshidratada','licor',
  'estimulante','adrenalina','vendaje','granada_humo',
  'chaqueta_kevlar','abrigo_trapero',
  'mapa_sector',
  'bateria_2v','bateria_4v','bateria_8v',
  'palanca_termica','mascara_filtro','arma_blanca','arma_fuego','arma_fuego_regl','arma_fuego_canon','analizador',
  'papel_helix','credencial_helix'
];

// Catálogo CLANDESTINO (Niveles Bajos del Mercado): material restringido
// que ya no se vende en el mercado a la luz. Solo accesible si el contacto
// te abre los bajos. (v0.135)
const _MERCADO_CLANDESTINO = [
  'placa_helix','inhibidor_dolor','credencial_falsa'
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
let _mercConfirmando = null;   // fila pidiendo confirmación: { modo, id }
let _mercCantidades = {};      // cantidad elegida por fila, clave 'modo:id'
// ── Estado de sesión del mercado (v0.135) ───────────────────
// Permiten abrir el mercado fuera del hub (p. ej. en persona en la zona
// MERCADO) con descuento y/o en modo clandestino, y refrescar en el
// contenedor correcto. renderMercado() los fija al abrir; los repintados
// internos (cambiarTab / refrescar) los CONSERVAN.
let _mercDescuento = 0;                      // 0 o 0.15 (−15% al comprar)
let _mercModo = 'normal';                    // 'normal' | 'clandestino'
let _mercContenedorId = 'hub-panel-cuerpo';  // dónde se repinta

function _mercCatalogo(){
  return (_mercModo === 'clandestino') ? _MERCADO_CLANDESTINO : _MERCADO_COMPRABLE;
}
// Precio de compra REAL de un item, con descuento si toca. Suelo duro
// anti-exploit: nunca baja de venta+1, así jamás se puede comprar con
// descuento y revender con beneficio. El clandestino no lleva descuento.
function _precioCompra(id){
  const p = MERCADO_PRECIOS[id] || {};
  let pr = p.compra || 0;
  if(pr <= 0) return 0;
  if(_mercDescuento > 0 && _mercModo !== 'clandestino'){
    pr = Math.round(pr * (1 - _mercDescuento));
    const piso = (p.venta || 0) + 1;
    if(pr < piso) pr = piso;
  }
  return pr;
}

function renderMercado(tab, opts){
  opts = opts || {};
  // Fijar estado de sesión SOLO al abrir (no en repintados internos).
  _mercDescuento   = (typeof opts.descuento === 'number') ? opts.descuento : 0;
  _mercModo        = (opts.modo === 'clandestino') ? 'clandestino' : 'normal';
  _mercContenedorId = opts.contenedor || 'hub-panel-cuerpo';
  // En clandestino solo se compra material restringido.
  if(_mercModo === 'clandestino') tab = 'comprar';
  _mercTab = (tab === 'comprar') ? 'comprar' : 'vender';
  return _mercHtml();
}

// Construye el HTML del mercado a partir del estado actual (sin tocar
// los flags de sesión). Lo usan renderMercado y los repintados.
function _mercHtml(){
  const cls = (t) => _mercTab === t ? 'cp-tab activa' : 'cp-tab';
  let tabs = '';
  if(_mercModo !== 'clandestino'){
    tabs = '<div class="cp-tabs">'
      +   '<button class="'+cls('vender')+'" onclick="cambiarTabMercado(\'vender\')">VENDER</button>'
      +   '<button class="'+cls('comprar')+'" onclick="cambiarTabMercado(\'comprar\')">COMPRAR</button>'
      + '</div>';
  }
  return ''
    + '<div class="merc-saldo">Saldo: <span class="merc-saldo-cifra">'+_mercCreditos()+' CR</span></div>'
    + tabs
    + '<div id="merc-cuerpo">' + (_mercTab === 'comprar' ? _renderComprar() : _renderVender()) + '</div>';
}

function cambiarTabMercado(tab){
  _mercConfirmando = null;
  _mercCantidades = {};
  if(_mercModo === 'clandestino') tab = 'comprar';
  _mercTab = (tab === 'comprar') ? 'comprar' : 'vender';
  const cuerpo = document.getElementById(_mercContenedorId);
  if(cuerpo) cuerpo.innerHTML = _mercHtml();
}

// Repinta solo el cuerpo (tras una operación), conservando la pestaña.
function _mercRefrescar(){
  const cuerpo = document.getElementById(_mercContenedorId);
  if(cuerpo) cuerpo.innerHTML = _mercHtml();
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
    html += '<div class="merc-fila merc-fila-col">'
      + '<div class="merc-fila-info"><span class="merc-fila-nombre">'+it.nombre+'</span>'
      + '<span class="merc-fila-meta">tienes '+cant+' · te dan '+p.venta+' CR c/u</span></div>'
      + _mercControles('vender', it.id, _mercMax('vender', it.id))
      + '</div>';
  });
  return html;
}

// ── STOCK ROTATIVO ──────────────────────────────────────────
// Ciertos items caros no están SIEMPRE en el mostrador. Su presencia se
// fija por día de juego de forma determinista: reabrir la tienda el mismo
// día NO cambia el stock (nada de save-scum), pero al cambiar de día puede
// rotar. Las mejores pistolas entran aquí: caras Y poco comunes.
const _MERCADO_RARO = ['arma_fuego_regl', 'arma_fuego_canon'];
function _esRaro(id){ return _MERCADO_RARO.indexOf(id) !== -1; }
function _disponibleHoy(id){
  if(!_esRaro(id)) return true;
  if(typeof obtenerFechaJuego !== 'function') return true; // sin reloj, no bloqueamos
  const dia = Math.floor(obtenerFechaJuego().getTime() / 86400000);
  let h = 0; const s = id + ':' + dia;
  for(let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return (h % 3) === 0; // aparece ~1 día de cada 3, cada pistola por su lado
}

// ── COMPRAR: catálogo de equipo con precio de compra ──
function _renderComprar(){
  let intro;
  if(_mercModo === 'clandestino'){
    intro = '<div class="merc-intro" style="border-left:2px solid var(--magenta);padding-left:0.5rem;">Los Niveles Bajos. Aquí no hay carteles ni recibos. Material restringido, precio sin negociar, y ni una palabra cuando salgas.</div>';
  } else if(_mercDescuento > 0){
    const pct = Math.round(_mercDescuento * 100);
    intro = '<div class="merc-intro" style="color:var(--cyan);">Has venido en persona hasta el Mercado. Los puestos te hacen precio: −'+pct+'% en todo lo que compres aquí.</div>';
  } else {
    intro = '<div class="merc-intro">Material de segunda mano, precios de primera. Aquí abajo nada sale barato.</div>';
  }
  let html = intro;
  const saldo = _mercCreditos();
  _mercCatalogo().forEach(id => {
    const p = MERCADO_PRECIOS[id];
    if(!p || p.compra <= 0) return;
    if(_mercModo !== 'clandestino' && !_disponibleHoy(id)) return;   // stock rotativo (no en clandestino)
    const precio = _precioCompra(id);
    const rebaja = (precio < p.compra) ? ' <span style="opacity:0.45;text-decoration:line-through;">'+p.compra+'</span>' : '';
    const max = _mercMax('comprar', id);
    html += '<div class="merc-fila merc-fila-col">'
      + '<div class="merc-fila-info"><span class="merc-fila-nombre">'+_mercNombre(id)+'</span>'
      + '<span class="merc-fila-meta">'+precio+rebaja+' CR c/u'+(_esRaro(id) ? ' · poco común' : '')+'</span></div>';
    // Equipo único (no apilable) que ya posees: no tiene sentido recomprarlo.
    const itCat = _mercItem(id);
    const yaLoTienes = itCat && itCat.apilable === false
      && typeof tieneItem === 'function' && tieneItem(id);
    if(yaLoTienes){
      html += '<div class="merc-ctrl-fila"><button class="merc-btn merc-btn-no" disabled>Ya lo tienes</button></div>';
    } else if(max >= 1){
      html += _mercControles('comprar', id, max);
    } else {
      html += '<div class="merc-ctrl-fila"><button class="merc-btn merc-btn-no" disabled>Sin saldo</button></div>';
    }
    html += '</div>';
  });
  return html;
}

// Máximo que se puede comprar/vender ahora mismo de un item.
function _mercMax(modo, id){
  const p = MERCADO_PRECIOS[id] || {};
  if(modo === 'vender'){
    const it = (Estado.inventario || []).find(i => i.id === id);
    return it ? (it.cantidad || 0) : 0;
  }
  // comprar: lo que permita el saldo (al precio real, con descuento si toca)
  const precio = _precioCompra(id);
  if(!precio || precio <= 0) return 0;
  return Math.floor(_mercCreditos() / precio);
}

// Cantidad elegida ahora para una fila (entre 1 y su máximo).
function _mercCant(modo, id){
  const key = modo + ':' + id;
  const max = _mercMax(modo, id);
  let v = _mercCantidades[key];
  if(typeof v !== 'number' || v < 1) v = 1;
  if(v > max) v = max;
  return Math.max(1, v);
}

// Ajusta la cantidad de una fila (delta, o 'todo' para el máximo).
function ajustarCantMercado(modo, id, delta){
  const key = modo + ':' + id;
  const max = _mercMax(modo, id);
  let v;
  if(delta === 'todo'){ v = max; }
  else { v = _mercCant(modo, id) + delta; }
  if(v < 1) v = 1;
  if(v > max) v = max;
  _mercCantidades[key] = v;
  _mercRefrescar();
}

// Controles de una fila: selector −/cantidad/+, botón Todo y el botón de
// acción (que pide confirmación). Si está pidiendo confirmación, muestra
// "¿Seguro? Vender N · ±X CR  Sí / No".
function _mercControles(modo, id, max){
  const p = MERCADO_PRECIOS[id] || {};
  const cant = _mercCant(modo, id);
  const precioUnit = (modo === 'vender') ? p.venta : _precioCompra(id);
  const total = precioUnit * cant;
  const confirmando = _mercConfirmando && _mercConfirmando.modo === modo && _mercConfirmando.id === id;

  if(confirmando){
    const fn = (modo === 'vender') ? 'venderItemMercado' : 'comprarItemMercado';
    const signo = (modo === 'vender') ? '+' : '−';
    const verbo = (modo === 'vender') ? 'Vender' : 'Comprar';
    return '<div class="merc-confirm">'
      + '<span class="merc-confirm-txt">¿Seguro? '+verbo+' '+cant+' · '+signo+total+' CR</span>'
      + '<button class="merc-btn merc-confirm-si" onclick="'+fn+'(\''+id+'\')">Sí</button>'
      + '<button class="merc-btn merc-confirm-no" onclick="cancelarConfirmarMercado()">No</button>'
      + '</div>';
  }

  const btnAccion = (modo === 'vender')
    ? '<button class="merc-btn merc-btn-vender" onclick="pedirConfirmarMercado(\'vender\',\''+id+'\')">Vender '+cant+' →</button>'
    : '<button class="merc-btn merc-btn-comprar" onclick="pedirConfirmarMercado(\'comprar\',\''+id+'\')">Comprar '+cant+' ←</button>';

  return '<div class="merc-ctrl-fila">'
    + '<div class="merc-cant">'
    +   '<button class="merc-cant-btn" onclick="ajustarCantMercado(\''+modo+'\',\''+id+'\',-1)">−</button>'
    +   '<span class="merc-cant-num">'+cant+'</span>'
    +   '<button class="merc-cant-btn" onclick="ajustarCantMercado(\''+modo+'\',\''+id+'\',1)">+</button>'
    +   '<button class="merc-cant-todo" onclick="ajustarCantMercado(\''+modo+'\',\''+id+'\',\'todo\')">Todo</button>'
    + '</div>'
    + btnAccion
    + '</div>';
}

// ============================================================
// OPERACIONES (con confirmación en la propia fila, v0.86.10)
// ------------------------------------------------------------
// Para no comprar/vender sin querer, el botón pide confirmación: al
// pulsarlo, esa fila se repinta mostrando "¿Seguro? Sí / No". Solo el
// "Sí" ejecuta la operación. Guardamos qué fila está pidiendo confirmar
// en _mercConfirmando = { modo:'vender'|'comprar', id }.
// ============================================================
// (estado _mercConfirmando y _mercCantidades declarado arriba, junto a _mercTab)

// Pulsar el botón de una fila: pide confirmación (no opera todavía).
function pedirConfirmarMercado(modo, id){
  _mercConfirmando = { modo: modo, id: id };
  _mercRefrescar();
}
// Cancelar la confirmación: vuelve al botón normal.
function cancelarConfirmarMercado(){
  _mercConfirmando = null;
  _mercRefrescar();
}

function venderItemMercado(id){
  const p = MERCADO_PRECIOS[id];
  _mercConfirmando = null;
  if(!p || p.venta <= 0) return;
  const it = (Estado.inventario || []).find(i => i.id === id);
  if(!it) return;
  // Cantidad elegida, acotada a lo que realmente tienes.
  let n = _mercCant('vender', id);
  n = Math.min(n, it.cantidad || 1);
  if(n < 1) return;
  if(typeof quitarItem === 'function') quitarItem(id, n);
  const total = p.venta * n;
  if(typeof ajustarCreditos === 'function') ajustarCreditos(total);
  else Estado.creditos = (Estado.creditos || 0) + total;
  delete _mercCantidades['vender:' + id];
  if(typeof notificarCambio === 'function'){
    notificarCambio('VENDIDO · ' + _mercNombre(id) + (n>1?(' x'+n):'') + ' · +' + total + ' CR', 'pos');
  }
  _mercRefrescar();
}

function comprarItemMercado(id){
  const p = MERCADO_PRECIOS[id];
  _mercConfirmando = null;
  if(!p || p.compra <= 0) return;
  // Cantidad elegida, acotada a lo que puedes pagar.
  let n = _mercCant('comprar', id);
  n = Math.min(n, _mercMax('comprar', id));
  if(n < 1) return;
  const precio = _precioCompra(id);
  const total = precio * n;
  if(_mercCreditos() < total) return;
  if(typeof ajustarCreditos === 'function') ajustarCreditos(-total);
  else Estado.creditos = (Estado.creditos || 0) - total;
  if(typeof darItemPorId === 'function'){
    for(let i = 0; i < n; i++) darItemPorId(id);
  }
  delete _mercCantidades['comprar:' + id];
  if(typeof notificarCambio === 'function'){
    notificarCambio('ADQUIRIDO · ' + _mercNombre(id) + (n>1?(' x'+n):'') + ' · −' + total + ' CR', 'neg');
  }
  _mercRefrescar();
}

window.MERCADO_PRECIOS = MERCADO_PRECIOS;
window.renderMercado = renderMercado;
window.cambiarTabMercado = cambiarTabMercado;
window.pedirConfirmarMercado = pedirConfirmarMercado;
window.cancelarConfirmarMercado = cancelarConfirmarMercado;
window.ajustarCantMercado = ajustarCantMercado;
window.venderItemMercado = venderItemMercado;
window.comprarItemMercado = comprarItemMercado;
