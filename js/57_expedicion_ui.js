// ============================================================
// NEON ASHES — UI DE EXPEDICIÓN (Scavenging)  ·  v0.86.7
// ------------------------------------------------------------
// Paso 4 completo del documento docs/01_diseno_expedicion.md.
// Loop jugable de punta a punta en cuatro momentos:
//   1) ELEGIR ZONA   2) PREPARAR EQUIPO   3) EXPEDICIÓN   4) DESENLACE
// Apoya todo en el motor (js/56_expedicion.js). Estilo canónico
// tránsito/viaje (magenta, Rajdhani, Share Tech Mono). Reusa la escena
// #expedicion-escena de index.html y css/25_explorar.css.
// ============================================================

let _expVolverA = 'apartamento';
let _expEventoActual = null;
let _expEquipoMochila = {};
let _expZonaElegida = null;

const _EXP_TIPOS_LLEVABLES = ['rescate','consumible','municion','comida','bateria','herramienta','utilidad','equipo'];

const _EXP_RIESGO_LABEL = {
  bajo:    { txt: 'RIESGO BAJO',    clase: 'riesgo-bajo' },
  medio:   { txt: 'RIESGO MEDIO',   clase: 'riesgo-medio' },
  alto:    { txt: 'RIESGO ALTO',    clase: 'riesgo-alto' },
  extremo: { txt: 'RIESGO EXTREMO', clase: 'riesgo-extremo' }
};

// Imagen de fondo por TIPO de evento (clave de ASSETS). Al entrar a un
// tramo, la imagen aparece casi a pantalla ~2s (destello) y luego se
// atenúa al fondo para leer. Reusa imágenes del pool existente.
const _EXP_IMG_EVENTO = {
  cerradura: 'MAINTENANCE_ACCESS12',
  rebusca:   'EXP_TALLER_REUTILIZA',
  encuentro: 'EXP_CALLEJON_NIVELES',
  toxico:    'EXP_PLANTA_AGUA',
  patrulla:  'SECTOR7_BLACK_MARKET',
  terminal:  'EXP_ALMACEN_HELIX',
  cuerpo:    'EXP_ALMACEN_OKUPA',
  derrumbe:  'SERVICE_CONDUIT_RAMP_E',
  mendigo:   'EXP_CALLEJON_NIVELES',
  cableado:  'EXP_TALLER_REUTILIZA',
  silencio:  'DOCK_ACCESS_TUNNEL',
  rival:     'EXP_PUERTO_CARGA',
  humedad:   'EXP_CANAL_PILAS',
  generador: 'INDUSTRIAL_WALKWAY9'
};

// Imagen de respaldo si un evento no tiene asignada (no debería pasar).
const _EXP_IMG_FALLBACK = 'EXP_ALMACEN_ZONA7';

// Aplica la imagen del evento: destello fuerte ~2s y luego al fondo.
// Limpia la imagen de fondo/destello (al iniciar o salir del loop).
function _expLimpiarFondo(){
  const fondo = document.getElementById('expedicion-fondo');
  const flash = document.getElementById('expedicion-flash');
  if(fondo) fondo.style.backgroundImage = '';
  if(flash){ flash.style.backgroundImage = ''; flash.classList.remove('visible'); }
}

function _expAplicarImagen(ev){
  const clave = (_EXP_IMG_EVENTO[ev && ev.id]) || _EXP_IMG_FALLBACK;
  const src = (typeof ASSETS !== 'undefined' && ASSETS[clave]) ? ASSETS[clave] : null;
  if(!src) return;
  const fondo = document.getElementById('expedicion-fondo');
  if(!fondo) return;
  // En vez de un flash a pantalla completa (que tapaba el texto y causaba
  // el parpadeo "texto-fade-texto"), ponemos la imagen de fondo y la
  // intensificamos un instante, luego se atenúa al nivel de lectura. El
  // texto nunca queda cubierto: solo cambia la fuerza del fondo.
  fondo.style.backgroundImage = "url('"+src+"')";
  fondo.classList.add('exp-fondo-intro');
  setTimeout(() => { fondo.classList.remove('exp-fondo-intro'); }, 1400);
  // Sonido de entrada al tramo (v0.89). Si la alerta va alta, un latido
  // de tensión en vez del tono neutro.
  if(typeof reproducirFX === 'function'){
    const run = (typeof Estado !== 'undefined') ? Estado.expedicion : null;
    if(run && run.alerta >= 60) reproducirFX('escena_tension', 0.7);
    else reproducirFX('escena_entra', 0.5);
  }
}

function _expMotivoBloqueo(zona){
  const req = zona.requisito;
  if(!req) return 'Acceso restringido.';
  if(req.tipo === 'llave') return 'Necesitas una llave que aún no tienes.';
  if(req.tipo === 'rango') return 'Reservada a carroñeros de mayor rango.';
  return 'Acceso restringido.';
}

function _expCuerpo(){ return document.getElementById('expedicion-cuerpo'); }

function _expMostrarEscena(){
  // Ocultar el reloj diegético mientras estamos en expedición: está fijo
  // arriba y se solapaba con el título de la primera zona en móvil. Es el
  // mismo mecanismo que usa la exploración (body.explorar-activo).
  document.body.classList.add('explorar-activo');
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _expVolverA;
  if(idDesde === 'expedicion-escena') return;
  if(typeof cambiarEscena === 'function'){
    cambiarEscena(idDesde, 'expedicion-escena');
  } else {
    const esc = document.getElementById('expedicion-escena');
    if(esc) esc.classList.add('activa');
  }
}

// ============================================================
// 1) ELEGIR ZONA
// ============================================================
function abrirElegirZonaExpedicion(volverA){
  if(typeof ZONAS_EXPEDICION === 'undefined') return;
  _expVolverA = volverA || 'apartamento';
  _expEventoActual = null;
  _expEquipoMochila = {};
  _expZonaElegida = null;
  _expLimpiarFondo();

  const cont = _expCuerpo();
  if(!cont) return;

  let html = '<div class="exp-zonas-intro">Elige dónde rebuscar hoy. Cuanto más peligrosa la zona, mejor el botín... y peor el final si las cosas se tuercen.</div>';

  const orden = ['conducto', 'vehiculo', 'contenedor', 'pozo', 'nivel9', 'deposito_orbital'];
  orden.forEach(id => {
    const z = ZONAS_EXPEDICION[id];
    if(!z) return;
    const disponible = zonaDisponible(id);
    const r = _EXP_RIESGO_LABEL[z.riesgo] || _EXP_RIESGO_LABEL.medio;
    const eventos = (z.eventosMin === z.eventosMax) ? (''+z.eventosMin) : (z.eventosMin+'-'+z.eventosMax);

    if(disponible){
      html += '<button class="exp-zona-card '+r.clase+'" onclick="prepararEquipoExpedicion(\''+id+'\')">'
        + '<div class="exp-zona-cab"><span class="exp-zona-nombre">'+z.nombre+'</span>'
        + '<span class="exp-zona-riesgo '+r.clase+'">'+r.txt+'</span></div>'
        + '<div class="exp-zona-desc">'+z.desc+'</div>'
        + '<div class="exp-zona-meta">'+eventos+' tramos · alerta inicial '+(z.alertaInicial||0)+'%</div>'
        + '</button>';
    } else {
      html += '<div class="exp-zona-card exp-zona-bloqueada">'
        + '<div class="exp-zona-cab"><span class="exp-zona-nombre">'+z.nombre+'</span>'
        + '<span class="exp-zona-riesgo '+r.clase+'">'+r.txt+'</span></div>'
        + '<div class="exp-zona-desc">'+z.desc+'</div>'
        + '<div class="exp-zona-candado">🔒 '+_expMotivoBloqueo(z)+'</div>'
        + '</div>';
    }
  });

  html += '<button class="exp-zona-volver" onclick="cancelarExpedicion()">← Dejarlo para otro día</button>';
  cont.innerHTML = html;
  _expMostrarEscena();
}

// ============================================================
// 2) PREPARAR EQUIPO
// ============================================================
function prepararEquipoExpedicion(idZona){
  if(!zonaDisponible(idZona)) return;
  _expZonaElegida = idZona;
  _expEquipoMochila = {};
  _expPintarPreparar();
}

function _expPintarPreparar(){
  const cont = _expCuerpo();
  if(!cont) return;
  const z = ZONAS_EXPEDICION[_expZonaElegida];
  const inv = (Estado.inventario || []).filter(i => _EXP_TIPOS_LLEVABLES.includes(i.tipo));

  let html = '<div class="exp-prep-cab">'+z.nombre+'</div>';

  if(Array.isArray(z.recomiendaEquipo) && z.recomiendaEquipo.length){
    const faltan = z.recomiendaEquipo.filter(id => !(Estado.inventario || []).some(i => i.id === id));
    if(faltan.length){
      html += '<div class="exp-prep-aviso">⚠ Esta zona se recomienda con equipo especial que no llevas. Puedes entrar igual, bajo tu riesgo.</div>';
    }
  }

  if(inv.length === 0){
    html += '<div class="exp-prep-vacio">No tienes equipo que llevar. Puedes entrar con las manos vacías, pero tendrás menos salidas cuando las cosas se tuerzan.</div>';
  } else {
    html += '<div class="exp-prep-intro">Elige qué te llevas. Lo que no metas en la mochila se queda en casa.</div>';
    inv.forEach(it => {
      const enMochila = _expEquipoMochila[it.id] || 0;
      const max = it.cantidad || 1;
      html += '<div class="exp-prep-item">'
        + '<div class="exp-prep-item-info"><span class="exp-prep-item-nombre">'+it.nombre+'</span>'
        + '<span class="exp-prep-item-stock">llevas '+enMochila+' / '+max+'</span></div>'
        + '<div class="exp-prep-item-ctrl">'
        + '<button class="exp-prep-btn" onclick="ajustarEquipoMochila(\''+it.id+'\',-1)">−</button>'
        + '<button class="exp-prep-btn" onclick="ajustarEquipoMochila(\''+it.id+'\',1)">+</button>'
        + '</div></div>';
    });
  }

  html += '<button class="exp-prep-entrar" onclick="arrancarExpedicion()">Bajar a la zona →</button>';
  html += '<button class="exp-zona-volver" onclick="abrirElegirZonaExpedicion(\''+_expVolverA+'\')">← Elegir otra zona</button>';
  cont.innerHTML = html;
}

function ajustarEquipoMochila(id, delta){
  const it = (Estado.inventario || []).find(i => i.id === id);
  if(!it) return;
  const max = it.cantidad || 1;
  let v = (_expEquipoMochila[id] || 0) + delta;
  if(v < 0) v = 0;
  if(v > max) v = max;
  if(v === 0) delete _expEquipoMochila[id];
  else _expEquipoMochila[id] = v;
  _expPintarPreparar();
}

// ============================================================
// 3) EXPEDICIÓN
// ============================================================
function arrancarExpedicion(){
  if(typeof iniciarExpedicion !== 'function') return;
  const equipo = {};
  Object.keys(_expEquipoMochila).forEach(id => {
    const it = (Estado.inventario || []).find(i => i.id === id);
    const noConsumible = it && (it.tipo === 'equipo');
    equipo[id] = noConsumible ? true : _expEquipoMochila[id];
  });
  Object.keys(_expEquipoMochila).forEach(id => {
    if(typeof quitarItem === 'function') quitarItem(id, _expEquipoMochila[id]);
  });

  const run = iniciarExpedicion(_expZonaElegida, equipo);
  if(!run){ cancelarExpedicion(); return; }
  _expSiguienteTramo();
}

function _expSiguienteTramo(){
  if(typeof detenerFXLoop === 'function') detenerFXLoop('exp_ambiente');
  const ev = (typeof siguienteEventoExpedicion === 'function') ? siguienteEventoExpedicion() : null;
  if(!ev){ _expDesenlaceExtraccion(); return; }
  _expEventoActual = ev;
  _expPintarEvento(ev, null);
}

function _expPintarEvento(ev, resumen){
  const cont = _expCuerpo();
  if(!cont) return;
  // Imagen del tramo: solo al MOSTRAR el evento nuevo (resumen === null),
  // no al repintar con el resultado (que es la misma escena).
  if(!resumen) _expAplicarImagen(ev);
  const run = Estado.expedicion;
  const alerta = run ? run.alerta : 0;
  const tramo = run ? run.eventoActual + 1 : 1;
  const tramosMax = run ? run.eventosMax : 1;

  let html = _expBarraAlerta(alerta);
  html += '<div class="exp-tramo-num">TRAMO '+Math.min(tramo, tramosMax)+' / '+tramosMax+'</div>';
  html += '<div class="exp-evento-narr">'+ev.narracion+'</div>';

  if(resumen){
    html += _expResumenResultado(resumen);
    html += '<div class="exp-evento-opts">';
    html += '<button class="exp-opt-btn" onclick="_expSiguienteTramo()">Seguir adentro →</button>';
    html += '<button class="exp-opt-btn exp-opt-retirar" onclick="retirarseExpedicion()">Retirarse con el botín ←</button>';
    html += '</div>';
  } else {
    html += '<div class="exp-evento-opts">';
    (ev.opciones || []).forEach((op, i) => {
      const tono = op.tono ? (' data-tono="'+op.tono+'"') : '';
      html += '<button class="exp-opt-btn"'+tono+' onclick="elegirOpcionExpedicion('+i+')">'+op.texto+'</button>';
    });
    html += '<button class="exp-opt-btn exp-opt-retirar" onclick="retirarseExpedicion()">Retirarse ahora ←</button>';
    html += '</div>';
  }
  cont.innerHTML = html;
  // Ambiente en bucle mientras el jugador decide (solo cuando hay
  // opciones de verdad, no en la pantalla de resultado). Se corta en
  // cuanto elige o avanza. v0.89.
  if(!resumen && typeof reproducirFXLoop === 'function'){
    reproducirFXLoop('amb_grave', 'exp_ambiente', 0.28);
  }
}

function _expBarraAlerta(alerta){
  const a = Math.max(0, Math.min(100, alerta || 0));
  let clase = 'alerta-baja';
  if(a >= 80) clase = 'alerta-critica';
  else if(a >= 60) clase = 'alerta-alta';
  else if(a >= 35) clase = 'alerta-media';
  return '<div class="exp-alerta-wrap"><div class="exp-alerta-label">ALERTA '+a+'%</div>'
    + '<div class="exp-alerta-barra"><span class="exp-alerta-fill '+clase+'" style="width:'+a+'%"></span></div></div>';
}

function _expResumenResultado(res){
  let txt = res.fallo ? 'Sale mal.' : 'Sale bien.';
  let detalle = '';
  if(res.botin && (res.botin.creditos > 0 || (res.botin.items||[]).length)){
    const partes = [];
    if(res.botin.creditos > 0) partes.push('+'+res.botin.creditos+' cr');
    (res.botin.items || []).forEach(it => {
      partes.push(_expNombreItem(it.id) + (it.cantidad>1?(' x'+it.cantidad):''));
    });
    detalle += '<div class="exp-res-botin">Botín: '+partes.join(' · ')+'</div>';
  }
  if(res.herida) detalle += '<div class="exp-res-herida">Te has hecho daño.</div>';
  if(res.multa) detalle += '<div class="exp-res-multa">Has roto un sello HELIX. Habrá multa.</div>';
  return '<div class="exp-res '+(res.fallo?'exp-res-mal':'exp-res-bien')+'">'+txt+detalle+'</div>';
}

function _expNombreItem(id){
  const cat = (typeof ITEMS_EXPEDICION !== 'undefined') ? ITEMS_EXPEDICION : [];
  const it = cat.find(x => x.id === id);
  if(it) return it.nombre;
  const cat2 = (typeof ITEMS_EXPLORAR !== 'undefined') ? ITEMS_EXPLORAR : [];
  const it2 = cat2.find(x => x.id === id);
  return it2 ? it2.nombre : id;
}

function elegirOpcionExpedicion(idx){
  const ev = _expEventoActual;
  if(!ev) return;
  const op = (ev.opciones || [])[idx];
  if(!op || typeof resolverOpcionExpedicion !== 'function') return;
  if(typeof detenerFXLoop === 'function') detenerFXLoop('exp_ambiente');
  const res = resolverOpcionExpedicion(ev, op);

  if(typeof _expComprobarCaptura === 'function' && _expComprobarCaptura()){
    // ¿Lleva kit de trauma? Si sí, lo salva una vez (malherido, sin botín).
    if(typeof _expLlevaRescate === 'function' && _expLlevaRescate()){
      _expDesenlaceRescate();
    } else {
      _expDesenlaceCaptura();
    }
    return;
  }
  _expPintarEvento(ev, res);
}

function retirarseExpedicion(){ _expDesenlaceExtraccion(); }

// ============================================================
// 4) DESENLACE
// ============================================================
function _expDesenlaceExtraccion(){
  const entregado = (typeof extraerExpedicion === 'function') ? extraerExpedicion() : null;
  const cont = _expCuerpo();
  if(!cont) return;

  let html = '<div class="exp-fin-titulo exp-fin-ok">DE VUELTA</div>';
  html += '<div class="exp-fin-texto">Sales de la zona con lo puesto y lo que has podido cargar. Respiras. Otra vez has vuelto.</div>';

  if(entregado && (entregado.creditos > 0 || (entregado.items||[]).length)){
    html += '<div class="exp-fin-botin"><div class="exp-fin-botin-cab">Te llevas:</div>';
    if(entregado.creditos > 0) html += '<div class="exp-fin-linea">+'+entregado.creditos+' créditos</div>';
    (entregado.items || []).forEach(it => {
      html += '<div class="exp-fin-linea">'+_expNombreItem(it.id)+(it.cantidad>1?(' x'+it.cantidad):'')+'</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="exp-fin-botin"><div class="exp-fin-linea exp-fin-nada">Vuelves con las manos vacías. No siempre la ciudad paga.</div></div>';
  }

  html += '<button class="exp-prep-entrar" onclick="cerrarExpedicionFin()">Cerrar</button>';
  cont.innerHTML = html;
}

function _expDesenlaceCaptura(){
  const quedan = (typeof fallarExpedicion === 'function') ? fallarExpedicion(0.6) : null;
  const cont = _expCuerpo();
  if(!cont) return;

  let html = '<div class="exp-fin-titulo exp-fin-mal">TE HAN VISTO</div>';
  html += '<div class="exp-fin-texto">Una luz, una voz, pasos cerrándote la salida. Corres, sueltas peso, te escabulles por un conducto. Sales vivo, pero dejándote la mitad de lo que habías reunido por el camino.</div>';

  if(quedan && (quedan.creditos > 0 || (quedan.items||[]).length)){
    html += '<div class="exp-fin-botin"><div class="exp-fin-botin-cab">Salvas:</div>';
    if(quedan.creditos > 0) html += '<div class="exp-fin-linea">+'+quedan.creditos+' créditos</div>';
    (quedan.items || []).forEach(it => {
      html += '<div class="exp-fin-linea">'+_expNombreItem(it.id)+(it.cantidad>1?(' x'+it.cantidad):'')+'</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="exp-fin-botin"><div class="exp-fin-linea exp-fin-nada">Lo pierdes casi todo en la huida.</div></div>';
  }

  html += '<button class="exp-prep-entrar" onclick="cerrarExpedicionFin()">Cerrar</button>';
  cont.innerHTML = html;
}

function _expDesenlaceRescate(){
  const habia = (typeof rescatarExpedicion === 'function') ? rescatarExpedicion() : false;
  const cont = _expCuerpo();
  if(!cont) return;

  let html = '<div class="exp-fin-titulo exp-fin-mal">CASI</div>';
  html += '<div class="exp-fin-texto">El golpe llega y el mundo se apaga un segundo. Cuando vuelves, el kit de trauma ya se ha vaciado dentro de ti: sellante, un chute, el dolor a raya lo justo para arrastrarte fuera. Sobrevives. Malherido, sin nada de lo que habías reunido, pero vivo. El kit se ha consumido.</div>';
  html += '<div class="exp-fin-botin"><div class="exp-fin-linea exp-fin-nada">Pierdes todo el botín de esta incursión. Pero respiras.</div></div>';
  html += '<button class="exp-prep-entrar" onclick="cerrarExpedicionFin()">Cerrar</button>';
  cont.innerHTML = html;
}

function cerrarExpedicionFin(){
  _expEventoActual = null;
  if(typeof detenerFXLoop === 'function') detenerFXLoop('exp_ambiente');
  if(typeof Estado !== 'undefined') Estado.expedicion = null;
  if(typeof Estado !== 'undefined' && Estado.muerto) return;
  _expSalirAEscena();
}

function cancelarExpedicion(){
  if(typeof detenerFXLoop === 'function') detenerFXLoop('exp_ambiente');
  if(typeof Estado !== 'undefined') Estado.expedicion = null;
  _expSalirAEscena();
}

// Sale de la escena de expedición a la escena previa. Si el destino no
// existe (id equivocado), cae al apartamento para no dejar pantalla
// negra. Salvaguarda anti-bug (v0.89.1).
function _expSalirAEscena(){
  // Restaurar el reloj diegético al salir (lo ocultamos al entrar).
  document.body.classList.remove('explorar-activo');
  let destino = _expVolverA;
  if(!destino || !document.getElementById(destino)) destino = 'apartamento';
  if(!document.getElementById(destino)) destino = 'apartamento';
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('expedicion-escena', destino);
  } else {
    const esc = document.getElementById('expedicion-escena');
    if(esc) esc.classList.remove('activa');
    const dst = document.getElementById(destino);
    if(dst) dst.classList.add('activa');
  }
}

function abrirExpedicionDesdeTrabajo(){
  if(typeof tieneProfesion === 'function' && !tieneProfesion('scavenger')) return false;
  // Cerrar el panel de trabajos (vive dentro del hub) antes de abrir la
  // escena de expedición, para no dejarlo abierto debajo.
  if(typeof cerrarPanelHub === 'function') cerrarPanelHub();
  abrirElegirZonaExpedicion('apartamento');
  return true;
}

window.abrirElegirZonaExpedicion = abrirElegirZonaExpedicion;
window.prepararEquipoExpedicion = prepararEquipoExpedicion;
window.ajustarEquipoMochila = ajustarEquipoMochila;
window.arrancarExpedicion = arrancarExpedicion;
window.elegirOpcionExpedicion = elegirOpcionExpedicion;
window.retirarseExpedicion = retirarseExpedicion;
window.cerrarExpedicionFin = cerrarExpedicionFin;
window.cancelarExpedicion = cancelarExpedicion;
window.abrirExpedicionDesdeTrabajo = abrirExpedicionDesdeTrabajo;
window._expSiguienteTramo = _expSiguienteTramo;
