// ============================================================
// NEON ASHES — REFINADO / DESMONTAJE (match-3)  ·  CAPA 1
// ------------------------------------------------------------
// Minijuego de desguace tecnológico. El Scavenger desmonta objetos
// dañados recuperados en expedición conectando componentes iguales.
//
// CAPA 1 (esta entrega): tablero jugable básico.
//   - Tablero de NxM con tipos de componente.
//   - Intercambiar dos fichas adyacentes (tocar una y luego la vecina).
//   - Detectar líneas de 3+ iguales (horizontal y vertical).
//   - Las fichas casadas se extraen, las de arriba CAEN (gravedad) y se
//     rellena por arriba con fichas nuevas.
//   - Combos en cadena: si al caer se forma otra línea, encadena solo.
//   - Contador de componentes extraídos por tipo.
//
// NO en capa 1 (vienen después): formas especiales 4/5/L/T/cruz, hallazgos
// (memoria, chip HELIX, núcleo CERO), barra de calidad, barra de chatarra,
// temporizador, y enganche con el botín real de la expedición.
//
// El estado del tablero vive en _refTablero. Es autónomo: no toca el
// inventario ni el Estado del juego todavía (eso es de una capa futura).
// ============================================================

// Tipos de componente (ficha). 'clave' es el id interno; 'icono' el
// glifo provisional (en capa visual real serán imágenes/SVG); 'color'
// el acento. La chatarra es la "ficha basura" que estorba.
const REF_COMPONENTES = [
  { clave: 'procesador', nombre: 'Procesadores', icono: '▣', color: '#00ff88' },
  { clave: 'bateria',    nombre: 'Baterías',     icono: '▮', color: '#ffb300' },
  { clave: 'sensor',     nombre: 'Sensores',     icono: '◉', color: '#00e5ff' },
  { clave: 'mecanico',   nombre: 'Mecánicos',    icono: '✦', color: '#9aa7b0' },
  { clave: 'chip_helix', nombre: 'Chips HELIX',  icono: '⬡', color: '#c850ff' },
  { clave: 'chatarra',   nombre: 'Chatarra',     icono: '✕', color: '#5a4a4a' }
];

const REF_FILAS = 8;
const REF_COLS = 7;

let _refTablero = null;   // matriz [fila][col] = clave de componente
let _refSeleccion = null; // {f,c} de la primera ficha tocada
let _refExtraidos = {};   // conteo por clave: { procesador: 5, ... }
let _refAnimando = false;  // bloquea input mientras resuelve cascadas

function _refCompPorClave(clave){ return REF_COMPONENTES.find(x => x.clave === clave) || null; }
function _refRandClave(){ return REF_COMPONENTES[Math.floor(Math.random() * REF_COMPONENTES.length)].clave; }

// ── Crear tablero inicial SIN matches de salida (para no auto-resolver) ──
function _refCrearTablero(){
  const t = [];
  for(let f = 0; f < REF_FILAS; f++){
    t.push([]);
    for(let c = 0; c < REF_COLS; c++){
      let clave;
      let intentos = 0;
      do {
        clave = _refRandClave();
        intentos++;
      } while(intentos < 20 && _refCreariaMatch(t, f, c, clave));
      t[f][c] = clave;
    }
  }
  return t;
}

// ¿Colocar 'clave' en (f,c) crearía ya una línea de 3 con lo ya puesto?
// Solo mira hacia arriba y hacia la izquierda (lo ya rellenado).
function _refCreariaMatch(t, f, c, clave){
  // horizontal: dos iguales a la izquierda
  if(c >= 2 && t[f][c-1] === clave && t[f][c-2] === clave) return true;
  // vertical: dos iguales arriba
  if(f >= 2 && t[f-1][c] === clave && t[f-2][c] === clave) return true;
  return false;
}

// ── Detectar todas las fichas que forman parte de una línea de 3+ ──
// Devuelve un Set de claves "f,c" a eliminar.
function _refBuscarMatches(t){
  const marcar = new Set();
  // Horizontales
  for(let f = 0; f < REF_FILAS; f++){
    let run = 1;
    for(let c = 1; c <= REF_COLS; c++){
      const igual = (c < REF_COLS && t[f][c] === t[f][c-1] && t[f][c] !== null);
      if(igual){ run++; }
      else {
        if(run >= 3){ for(let k = 1; k <= run; k++) marcar.add(f + ',' + (c-k)); }
        run = 1;
      }
    }
  }
  // Verticales
  for(let c = 0; c < REF_COLS; c++){
    let run = 1;
    for(let f = 1; f <= REF_FILAS; f++){
      const igual = (f < REF_FILAS && t[f][c] === t[f-1][c] && t[f][c] !== null);
      if(igual){ run++; }
      else {
        if(run >= 3){ for(let k = 1; k <= run; k++) marcar.add((f-k) + ',' + c); }
        run = 1;
      }
    }
  }
  return marcar;
}

// ── Aplicar gravedad: las fichas caen a los huecos (null) y se rellena ──
function _refAplicarGravedad(t){
  for(let c = 0; c < REF_COLS; c++){
    // Compactar hacia abajo.
    let escribir = REF_FILAS - 1;
    for(let f = REF_FILAS - 1; f >= 0; f--){
      if(t[f][c] !== null){
        t[escribir][c] = t[f][c];
        if(escribir !== f) t[f][c] = null;
        escribir--;
      }
    }
    // Rellenar lo que queda arriba con fichas nuevas.
    for(let f = escribir; f >= 0; f--){
      t[f][c] = _refRandClave();
    }
  }
}

// ── Resolver cascadas: elimina matches, cuenta, aplica gravedad, repite.
// Devuelve el nº de combos encadenados (0 si no había ningún match).
function _refResolverCascadas(t){
  let combos = 0;
  while(true){
    const matches = _refBuscarMatches(t);
    if(matches.size === 0) break;
    combos++;
    // Contar extraídos por tipo y vaciar.
    matches.forEach(key => {
      const [f, c] = key.split(',').map(Number);
      const clave = t[f][c];
      if(clave && clave !== 'chatarra'){
        _refExtraidos[clave] = (_refExtraidos[clave] || 0) + 1;
      }
      t[f][c] = null;
    });
    _refAplicarGravedad(t);
  }
  return combos;
}

// ── ¿Son adyacentes dos casillas? (orto, no diagonal) ──
function _refAdyacentes(a, b){
  const df = Math.abs(a.f - b.f), dc = Math.abs(a.c - b.c);
  return (df + dc) === 1;
}

// Intercambia dos fichas en el tablero (sin validar).
function _refSwap(t, a, b){
  const tmp = t[a.f][a.c];
  t[a.f][a.c] = t[b.f][b.c];
  t[b.f][b.c] = tmp;
}

// Intenta un movimiento: intercambia a<->b; si genera match, lo resuelve
// y devuelve true. Si no, deshace el swap y devuelve false (movimiento
// inválido, como en cualquier match-3).
function refIntentarMovimiento(a, b){
  if(_refAnimando) return false;
  if(!_refAdyacentes(a, b)) return false;
  const t = _refTablero;
  _refSwap(t, a, b);
  const matches = _refBuscarMatches(t);
  if(matches.size === 0){
    _refSwap(t, a, b); // deshacer
    return false;
  }
  _refResolverCascadas(t);
  return true;
}

// ── Inicializar una partida de refinado (capa 1: tablero suelto) ──
function iniciarRefinado(){
  _refTablero = _refCrearTablero();
  _refSeleccion = null;
  _refExtraidos = {};
  _refAnimando = false;
  return _refTablero;
}

// ============================================================
// UI DEL TABLERO (capa 1)
// ------------------------------------------------------------
// Pinta el tablero como una rejilla de botones-ficha. Al tocar una
// ficha se selecciona; al tocar una vecina se intenta el movimiento.
// La cascada se anima por pasos (marcar → vaciar → caer → rellenar)
// con pequeños delays para que se vea el desmontaje, no un salto seco.
// ============================================================

// Abre la pantalla de refinado y pinta el tablero.
function abrirRefinado(volverA){
  _refVolverA = volverA || 'apartamento';
  iniciarRefinado();
  _refPintarObjetivos();
  _refPintarTablero(true);
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _refVolverA;
  if(idDesde === 'refinado-escena') return;
  if(typeof cambiarEscena === 'function') cambiarEscena(idDesde, 'refinado-escena');
  else { const e = document.getElementById('refinado-escena'); if(e) e.classList.add('activa'); }
}
let _refVolverA = 'apartamento';

// Pinta el contador de componentes extraídos (capa 1: sin metas aún).
function _refPintarObjetivos(){
  const cont = document.getElementById('ref-objetivos');
  if(!cont) return;
  let html = '';
  REF_COMPONENTES.forEach(comp => {
    if(comp.clave === 'chatarra') return; // la chatarra no es objetivo
    const n = _refExtraidos[comp.clave] || 0;
    html += '<div class="ref-obj">'
      + '<span class="ref-obj-icono" style="color:'+comp.color+'">'+comp.icono+'</span>'
      + '<span class="ref-obj-nombre">'+comp.nombre+'</span>'
      + '<span class="ref-obj-num">'+n+'</span>'
      + '</div>';
  });
  cont.innerHTML = html;
}

// Pinta el tablero entero. Si 'inicial', sin animación.
function _refPintarTablero(){
  const cont = document.getElementById('ref-tablero');
  if(!cont || !_refTablero) return;
  cont.style.gridTemplateColumns = 'repeat(' + REF_COLS + ', 1fr)';
  let html = '';
  for(let f = 0; f < REF_FILAS; f++){
    for(let c = 0; c < REF_COLS; c++){
      const clave = _refTablero[f][c];
      const comp = _refCompPorClave(clave);
      const sel = (_refSeleccion && _refSeleccion.f === f && _refSeleccion.c === c) ? ' ref-ficha-sel' : '';
      const icono = comp ? comp.icono : '';
      const color = comp ? comp.color : '#888';
      html += '<button class="ref-ficha'+sel+'" data-f="'+f+'" data-c="'+c+'" '
        + 'style="color:'+color+'" onclick="refTocarFicha('+f+','+c+')">'+icono+'</button>';
    }
  }
  cont.innerHTML = html;
}

// Toca una ficha: primera selección, o intento de movimiento con la vecina.
function refTocarFicha(f, c){
  if(_refAnimando) return;
  if(!_refSeleccion){
    _refSeleccion = { f: f, c: c };
    _refPintarTablero();
    return;
  }
  // Tocar la misma: deseleccionar.
  if(_refSeleccion.f === f && _refSeleccion.c === c){
    _refSeleccion = null;
    _refPintarTablero();
    return;
  }
  const a = _refSeleccion, b = { f: f, c: c };
  // Si no son adyacentes, cambiar la selección a la nueva ficha.
  if(!_refAdyacentes(a, b)){
    _refSeleccion = b;
    _refPintarTablero();
    return;
  }
  // Adyacentes: intentar el movimiento con animación.
  _refSeleccion = null;
  _refMovimientoAnimado(a, b);
}

// Movimiento con animación: hace el swap visual, y si vale, resuelve las
// cascadas paso a paso; si no vale, lo deshace con un pequeño rebote.
function _refMovimientoAnimado(a, b){
  const t = _refTablero;
  _refSwap(t, a, b);
  const matches = _refBuscarMatches(t);
  if(matches.size === 0){
    // Movimiento inválido: repintar el swap y deshacer tras un instante.
    _refPintarTablero();
    _refAnimando = true;
    setTimeout(() => { _refSwap(t, a, b); _refPintarTablero(); _refAnimando = false; }, 180);
    return;
  }
  _refPintarTablero();
  _refAnimando = true;
  _refResolverCascadasAnimado();
}

// Resuelve cascadas una a una, con delays, repintando entre paso y paso.
function _refResolverCascadasAnimado(){
  const t = _refTablero;
  const matches = _refBuscarMatches(t);
  if(matches.size === 0){
    _refAnimando = false;
    _refPintarTablero();
    _refPintarObjetivos();
    return;
  }
  // 1) Marcar visualmente las fichas que se van.
  const cont = document.getElementById('ref-tablero');
  if(cont){
    matches.forEach(key => {
      const [f, c] = key.split(',').map(Number);
      const btn = cont.querySelector('.ref-ficha[data-f="'+f+'"][data-c="'+c+'"]');
      if(btn) btn.classList.add('ref-ficha-extrae');
    });
  }
  // 2) Tras el destello, contar, vaciar, aplicar gravedad y repintar.
  setTimeout(() => {
    matches.forEach(key => {
      const [f, c] = key.split(',').map(Number);
      const clave = t[f][c];
      if(clave && clave !== 'chatarra') _refExtraidos[clave] = (_refExtraidos[clave] || 0) + 1;
      t[f][c] = null;
    });
    _refAplicarGravedad(t);
    _refPintarTablero();
    _refPintarObjetivos();
    // 3) Encadenar el siguiente combo, si lo hay.
    setTimeout(_refResolverCascadasAnimado, 160);
  }, 220);
}

// Cierra el refinado (capa 1: solo vuelve; el enganche con botín es futuro).
function terminarRefinado(){
  _refSeleccion = null;
  if(typeof cambiarEscena === 'function') cambiarEscena('refinado-escena', _refVolverA);
  else { const e = document.getElementById('refinado-escena'); if(e) e.classList.remove('activa'); }
}

window.abrirRefinado = abrirRefinado;
window.refTocarFicha = refTocarFicha;
window.terminarRefinado = terminarRefinado;
window.iniciarRefinado = iniciarRefinado;
window.refIntentarMovimiento = refIntentarMovimiento;
window.REF_COMPONENTES = REF_COMPONENTES;
window.REF_FILAS = REF_FILAS;
window.REF_COLS = REF_COLS;
window._refGetTablero = function(){ return _refTablero; };
window._refGetExtraidos = function(){ return _refExtraidos; };
