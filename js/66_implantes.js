// ============================================================
//  NEON ASHES — IMPLANTES (v0.107)
//  Sistema estilo EVE: tipos fijos de implante, cada uno en
//  grados 1-5. El grado determina la potencia (grado × 5%).
//
//  SLOTS: 4 normales + 1 especial.
//   - Solo un implante por TIPO instalado a la vez.
//   - Subir de grado del mismo tipo destruye el anterior (HELIX no
//     reutiliza biotech ya implantada).
//   - El especial potencia los efectos de los normales instalados.
//
//  Comprar + instalar cuesta mucho. Por ahora solo en el Hospital
//  HELIX. Más adelante, clandestinamente.
//
//  EFECTOS (consultados desde otros sistemas vía implanteBonus):
//   - hepatico    → HAMBRE sube más lento (mult decaimiento)
//   - sueno       → FATIGA sube más lento
//   - sensorial   → AISLAMIENTO sube más lento
//   - reflejos    → +% éxito en abordajes de Cazarrecompensas
//   - prediccion  → +% éxito en eventos de expedición (Scavenger)
//   - sincro      → acciones de profesión cuestan menos tiempo
//  Especial:
//   - nucleo      → +grado×10% a la potencia de TODOS los normales
// ============================================================

const IMPLANTES_MAX_NORMALES = 4;

// Catálogo de tipos. 'efecto' es la clave que consultan otros sistemas.
const IMPLANTES_CATALOGO = [
  { id:'hepatico',  nombre:'Filtro Hepático',     efecto:'hepatico',   slot:'normal',
    desc:'Una malla que filtra y recicla lo que el cuerpo malgasta. El hambre tarda más en morder.' },
  { id:'sueno',     nombre:'Regulador de Sueño',  efecto:'sueno',      slot:'normal',
    desc:'Modula los ciclos de descanso desde el tronco encefálico. La fatiga se acumula más despacio.' },
  { id:'sensorial', nombre:'Inhibidor Sensorial', efecto:'sensorial',  slot:'normal',
    desc:'Amortigua la necesidad de contacto y la punzada de la soledad. El aislamiento pesa menos.' },
  { id:'reflejos',  nombre:'Córtex de Reflejos',  efecto:'reflejos',   slot:'normal',
    desc:'Acelera la respuesta motora en el momento justo. Mejora tus probabilidades al abordar un objetivo.' },
  { id:'prediccion',nombre:'Predictor de Riesgo', efecto:'prediccion', slot:'normal',
    desc:'Calcula peligros una fracción de segundo antes que tú. Mejora tus probabilidades en expediciones de chatarra.' },
  { id:'sincro',    nombre:'Sincronizador Neural',efecto:'sincro',     slot:'normal',
    desc:'Comprime el tiempo subjetivo de trabajo: haces lo mismo gastando menos horas del día.' },
  { id:'nucleo',    nombre:'Núcleo Sináptico HELIX', efecto:'nucleo',  slot:'especial',
    desc:'Tecnología de nivel restringido. No hace nada por sí solo: amplifica todos tus demás implantes. Cuanto mejor el núcleo, más rinden los otros.' }
];
const IMPLANTE_POR_ID = {};
IMPLANTES_CATALOGO.forEach(i => { IMPLANTE_POR_ID[i.id] = i; });

// ── Precios ─────────────────────────────────────────────────
// Normal grado N:  5000·N (compra) + 5000·N (instalación)  → 10k..50k
// Especial grado N: 40000·N (compra) + 40000·N (instalación) → 80k..400k
function implantePrecioCompra(tipoId, grado){
  const def = IMPLANTE_POR_ID[tipoId];
  if(!def) return 0;
  const base = (def.slot === 'especial') ? 40000 : 5000;
  return base * grado;
}
function implantePrecioInstalacion(tipoId, grado){
  return implantePrecioCompra(tipoId, grado); // mismo importe que la compra
}
function implantePrecioTotal(tipoId, grado){
  return implantePrecioCompra(tipoId, grado) + implantePrecioInstalacion(tipoId, grado);
}

// ── Estado ──────────────────────────────────────────────────
// Estado.implantes = { instalados: { tipoId: grado, ... }, especial: { id, grado }|null }
function _asegurarImplantes(){
  if(!Estado.implantes || typeof Estado.implantes !== 'object'){
    Estado.implantes = { instalados: {}, especial: null };
  }
  if(!Estado.implantes.instalados) Estado.implantes.instalados = {};
  if(typeof Estado.implantes.especial === 'undefined') Estado.implantes.especial = null;
  return Estado.implantes;
}

function implantesInstalados(){
  const e = _asegurarImplantes();
  // Devuelve lista [{id, nombre, efecto, grado, slot}]
  const lista = [];
  Object.keys(e.instalados).forEach(id => {
    const def = IMPLANTE_POR_ID[id];
    if(def) lista.push(Object.assign({}, def, { grado: e.instalados[id] }));
  });
  if(e.especial && e.especial.id){
    const def = IMPLANTE_POR_ID[e.especial.id];
    if(def) lista.push(Object.assign({}, def, { grado: e.especial.grado }));
  }
  return lista;
}

function nNormalesInstalados(){
  const e = _asegurarImplantes();
  return Object.keys(e.instalados).length;
}
function gradoEspecial(){
  const e = _asegurarImplantes();
  return (e.especial && e.especial.id) ? (e.especial.grado || 0) : 0;
}

// ── BONOS (el corazón del sistema) ──────────────────────────
// Devuelve la potencia efectiva (0..1+) de un EFECTO concreto, ya
// con el multiplicador del especial aplicado. 0 si no tienes ese
// implante. Base por grado = grado × 0.05 (5% por grado).
// El especial añade grado×10% RELATIVO sobre cada efecto normal.
function implanteBonus(efecto){
  const e = _asegurarImplantes();
  // localizar el tipo normal con ese efecto y su grado instalado
  let grado = 0;
  Object.keys(e.instalados).forEach(id => {
    const def = IMPLANTE_POR_ID[id];
    if(def && def.efecto === efecto) grado = e.instalados[id];
  });
  if(grado <= 0) return 0;
  let base = grado * 0.05;
  // amplificación del núcleo especial
  const ge = gradoEspecial();
  if(ge > 0) base *= (1 + ge * 0.10);
  return base;
}

// Multiplicador de decaimiento para una stat humana (1 = normal).
// hambre→hepatico, fatiga→sueno, aislamiento→sensorial.
function implanteMultDecaimiento(statHumana){
  let efecto = null;
  if(statHumana === 'hambre')       efecto = 'hepatico';
  else if(statHumana === 'fatiga')  efecto = 'sueno';
  else if(statHumana === 'aislamiento') efecto = 'sensorial';
  if(!efecto) return 1;
  const b = implanteBonus(efecto);          // p.ej. 0.20 = 20% más lento
  return Math.max(0.1, 1 - b);              // nunca por debajo de 0.1
}

// Bonus aditivo de probabilidad (0..~0.3) para abordajes de caza.
function implanteBonusProbCaza(){ return implanteBonus('reflejos'); }
// Bonus aditivo de probabilidad para eventos de expedición.
function implanteBonusProbExpedicion(){ return implanteBonus('prediccion'); }
// Multiplicador del tiempo que gastan las acciones de profesión (1 = normal).
function implanteMultTiempoAccion(){
  const b = implanteBonus('sincro');
  return Math.max(0.3, 1 - b);
}

if(typeof window !== 'undefined'){
  window.IMPLANTES_CATALOGO = IMPLANTES_CATALOGO;
  window.IMPLANTE_POR_ID = IMPLANTE_POR_ID;
  window.implantePrecioCompra = implantePrecioCompra;
  window.implantePrecioInstalacion = implantePrecioInstalacion;
  window.implantePrecioTotal = implantePrecioTotal;
  window.implantesInstalados = implantesInstalados;
  window.nNormalesInstalados = nNormalesInstalados;
  window.gradoEspecial = gradoEspecial;
  window.implanteBonus = implanteBonus;
  window.implanteMultDecaimiento = implanteMultDecaimiento;
  window.implanteBonusProbCaza = implanteBonusProbCaza;
  window.implanteBonusProbExpedicion = implanteBonusProbExpedicion;
  window.implanteMultTiempoAccion = implanteMultTiempoAccion;
}

// ============================================================
//  INSTALAR / DESINSTALAR
// ============================================================
// Resultado: { ok:true } | { ok:false, motivo:'...' }
function instalarImplante(tipoId, grado){
  const def = IMPLANTE_POR_ID[tipoId];
  if(!def) return { ok:false, motivo:'Implante desconocido.' };
  if(grado < 1 || grado > 5) return { ok:false, motivo:'Grado inválido.' };
  const e = _asegurarImplantes();
  const precio = implantePrecioTotal(tipoId, grado);
  const saldo = (typeof Estado.creditos === 'number') ? Estado.creditos : 0;
  if(saldo < precio) return { ok:false, motivo:'Saldo insuficiente.', precio };

  if(def.slot === 'especial'){
    // ocupa el slot especial; si ya hay uno, se destruye al sustituir
    e.especial = { id: tipoId, grado: grado };
  } else {
    const yaInstalado = typeof e.instalados[tipoId] === 'number';
    // si es un tipo NUEVO y ya tienes 4 normales, no cabe
    if(!yaInstalado && nNormalesInstalados() >= IMPLANTES_MAX_NORMALES){
      return { ok:false, motivo:'No tienes ranuras libres. Desinstala uno primero.' };
    }
    // instalar / mejorar (sobrescribe el grado anterior, que se "destruye")
    e.instalados[tipoId] = grado;
  }
  if(typeof ajustarCreditos === 'function') ajustarCreditos(-precio);
  else if(typeof Estado.creditos === 'number') Estado.creditos -= precio;
  if(typeof guardarPartida === 'function') guardarPartida();
  return { ok:true, precio };
}

// Desinstalar destruye el implante (no vuelve al inventario).
function desinstalarImplante(tipoId){
  const e = _asegurarImplantes();
  const def = IMPLANTE_POR_ID[tipoId];
  if(!def) return { ok:false };
  if(def.slot === 'especial'){
    if(!e.especial || e.especial.id !== tipoId) return { ok:false };
    e.especial = null;
  } else {
    if(typeof e.instalados[tipoId] !== 'number') return { ok:false };
    delete e.instalados[tipoId];
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  return { ok:true };
}
if(typeof window !== 'undefined'){
  window.instalarImplante = instalarImplante;
  window.desinstalarImplante = desinstalarImplante;
}

// ============================================================
//  RENDER · TIENDA DE IMPLANTES (Hospital HELIX)
//  Reutiliza las clases .caso-* del CSS de profesiones.
//  Se monta dentro del panel de zona del Hospital (opcEl/narr).
// ============================================================
let _implanteTipoSel = null; // tipo en el que el jugador está mirando grados

function renderTiendaImplantes(){
  const e = _asegurarImplantes();
  const saldo = (typeof Estado.creditos === 'number') ? Estado.creditos : 0;
  let html = '<div class="impl-shop">';
  html += '<div class="impl-saldo">SALDO: ' + saldo + ' CR</div>';
  html += '<div class="impl-slots">RANURAS: ' + nNormalesInstalados() + '/' + IMPLANTES_MAX_NORMALES
        + ' normales · ' + (gradoEspecial() > 0 ? 'especial G' + gradoEspecial() : 'especial libre') + '</div>';

  // sección: instalados actuales
  const inst = implantesInstalados();
  if(inst.length){
    html += '<div class="impl-sec-tit">IMPLANTADO</div>';
    inst.forEach(im => {
      html += '<div class="impl-card impl-card-on">'
        + '<div class="impl-card-top"><span class="impl-nom">' + im.nombre + '</span>'
        + '<span class="impl-grado">GRADO ' + im.grado + '</span></div>'
        + '<div class="impl-desc">' + im.desc + '</div>'
        + '<div class="impl-efecto">' + _implanteTextoEfecto(im.efecto, im.grado) + '</div>'
        + '<button class="btn-terminal impl-quitar" onclick="implanteUIDesinstalar(\'' + im.id + '\')">EXTRAER (se destruye)</button>'
        + '</div>';
    });
  }

  // sección: catálogo comprable
  html += '<div class="impl-sec-tit">CATÁLOGO HELIX</div>';
  IMPLANTES_CATALOGO.forEach(def => {
    const gradoInst = (def.slot === 'especial')
      ? (e.especial && e.especial.id === def.id ? e.especial.grado : 0)
      : (e.instalados[def.id] || 0);
    html += '<div class="impl-card">'
      + '<div class="impl-card-top"><span class="impl-nom">' + def.nombre + '</span>'
      + '<span class="impl-tipo">' + (def.slot === 'especial' ? 'ESPECIAL' : 'NORMAL') + '</span></div>'
      + '<div class="impl-desc">' + def.desc + '</div>';
    if(gradoInst > 0){
      html += '<div class="impl-efecto-mini">Instalado: grado ' + gradoInst + '. Comprar un grado superior reemplaza el actual.</div>';
    }
    // botones por grado 1..5
    html += '<div class="impl-grados">';
    for(let g = 1; g <= 5; g++){
      const precio = implantePrecioTotal(def.id, g);
      const asequible = saldo >= precio;
      const esMejora = g > gradoInst;
      let cls = 'impl-gbtn';
      if(!asequible) cls += ' impl-gbtn-caro';
      if(g === gradoInst) cls += ' impl-gbtn-actual';
      const label = (g === gradoInst) ? ('G' + g + ' ·\u00A0actual')
                  : ('G' + g + ' ·\u00A0' + precio + 'CR');
      const onclick = (asequible && esMejora)
        ? 'onclick="implanteUIComprar(\'' + def.id + '\',' + g + ')"'
        : '';
      const disabled = (!asequible || !esMejora) ? ' impl-gbtn-off' : '';
      html += '<button class="' + cls + disabled + '" ' + onclick + '>' + label + '</button>';
    }
    html += '</div></div>';
  });

  html += '</div>';
  return html;
}

function _implanteTextoEfecto(efecto, grado){
  const b = implanteBonus(efecto); // ya con núcleo aplicado
  const pct = Math.round(b * 100);
  switch(efecto){
    case 'hepatico':   return 'El hambre sube un ' + pct + '% más lento.';
    case 'sueno':      return 'La fatiga sube un ' + pct + '% más lento.';
    case 'sensorial':  return 'El aislamiento sube un ' + pct + '% más lento.';
    case 'reflejos':   return '+' + pct + '% de éxito al abordar objetivos.';
    case 'prediccion': return '+' + pct + '% de éxito en expediciones.';
    case 'sincro':     return 'Las acciones de profesión cuestan un ' + pct + '% menos de tiempo.';
    case 'nucleo':     return 'Amplifica un ' + (grado * 10) + '% el efecto de tus demás implantes.';
    default: return '';
  }
}

// Handlers UI: tras actuar, repintan dentro del panel del hospital.
function implanteUIComprar(tipoId, grado){
  const r = instalarImplante(tipoId, grado);
  if(r.ok){
    if(typeof notificarCambio === 'function') notificarCambio('-' + r.precio + ' CR', 'creditos');
    if(typeof reproducirFX === 'function') reproducirFX('inv_acierto', 0.5);
  } else {
    if(typeof reproducirFX === 'function') reproducirFX('inv_fallo', 0.4);
  }
  _implanteRepintar(r.ok ? null : (r.motivo || ''));
}
function implanteUIDesinstalar(tipoId){
  const r = desinstalarImplante(tipoId);
  if(r.ok && typeof reproducirFX === 'function') reproducirFX('inv_papel', 0.4);
  _implanteRepintar();
}
function _implanteRepintar(aviso){
  const cont = document.getElementById('impl-shop-host');
  if(cont){
    cont.innerHTML = (aviso ? '<div class="impl-aviso">' + aviso + '</div>' : '') + renderTiendaImplantes();
  }
}
if(typeof window !== 'undefined'){
  window.renderTiendaImplantes = renderTiendaImplantes;
  window.implanteUIComprar = implanteUIComprar;
  window.implanteUIDesinstalar = implanteUIDesinstalar;
}
