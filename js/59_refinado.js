// ============================================================
// NEON ASHES — REFINADO / DESMONTAJE (match-3)  ·  CAPA 3
// ------------------------------------------------------------
// Minijuego de desguace tecnológico. El Scavenger desmonta objetos
// dañados recuperados en expedición conectando componentes iguales.
//
// CAPA 1 (v0.89): tablero jugable básico (swap, líneas 3+, gravedad,
//   relleno, combos en cadena, contador por tipo).
//
// CAPA 3 (v0.91):
//   - TEMPORIZADOR DE PRESIÓN: cuenta atrás de 90 s por partida. Empieza
//     a correr con la primera jugada (mirar el tablero no penaliza). Al
//     llegar a 0, cierra el desmontaje y cobra lo recuperado. Barra que
//     pasa a ámbar bajo 30 s y a magenta parpadeante bajo 10 s.
//   - PEDIDO (objetivo por partida): un encargo de 2 componentes en
//     cantidad. Cumplirlo da BONUS de calidad y créditos al terminar.
//     Nunca penaliza: si no se cumple, igual se cobra lo extraído.
//   - BARRA DE CHATARRA: la basura (✕) que se casa se acumula sin
//     procesar. Si se llena demasiado, recorta la calidad final (el
//     desguace se ensucia). Empuja a casar también la basura.
//   - PIEZA ESPECIAL NUEVA: BOMBA DE DESGUACE (casar 5+ en bloque/cuadro)
//     -> limpia un radio amplio (5x5) y suelta más hallazgos. Y las
//     reacciones entre dos especiales dan un plus de calidad.
//   - CONTROL POR ARRASTRE: ahora se arrastra una ficha hacia su vecina
//     (Pointer Events: ratón y táctil unificados). El tap-tap sigue como
//     respaldo. Sustituye al doble toque de selección.
//
// CAPA 2 (v0.89.2):
//   - PIEZAS ESPECIALES por casar 4, 5 o forma L/T:
//       4 en línea  -> CARGA LINEAL: limpia su fila o columna entera.
//       5 en línea  -> PULSO HELIX : limpia todas las fichas de ese tipo.
//       L / T (5)   -> DESCARGA CRUZ: limpia un área 3x3 alrededor.
//     Las especiales se activan al casarlas de nuevo (o al ser barridas
//     por otra especial: reacción en cadena).
//   - HALLAZGOS raros con gancho de lore (memoria intacta, chip HELIX
//     corrupto, núcleo CERO). Aparecen al resolver combos grandes /
//     cadenas largas. Se cuentan y disparan un flash narrativo. El
//     enganche al inventario real es de una capa futura.
//   - BARRA DE CALIDAD: sube con combos, especiales y hallazgos. De
//     momento es solo feedback visual (sin consecuencias mecánicas aún).
//   - Animaciones de aparición/carga/onda de las especiales y flash de
//     hallazgo. Sonidos del pool FX existente.
//
// NO en capa 2 (vienen después): metas/objetivos formales, barra de
// chatarra, temporizador, y enganche con el botín real de la expedición.
//
// El estado del tablero vive en _refTablero (matriz de CELDAS, no de
// claves: cada celda es { clave, especial }). Sigue siendo autónomo: no
// toca el inventario ni el Estado del juego todavía.
// ============================================================

// Tipos de componente (ficha). 'clave' es el id interno; 'icono' el
// glifo provisional; 'color' el acento. La chatarra es la "ficha basura".
const REF_COMPONENTES = [
  { clave: 'procesador', nombre: 'Procesadores', icono: '▣', color: '#00ff88' },
  { clave: 'bateria',    nombre: 'Baterías',     icono: '▮', color: '#ffb300' },
  { clave: 'sensor',     nombre: 'Sensores',     icono: '◉', color: '#00e5ff' },
  { clave: 'mecanico',   nombre: 'Mecánicos',    icono: '✦', color: '#9aa7b0' },
  { clave: 'chip_helix', nombre: 'Chips HELIX',  icono: '⬡', color: '#c850ff' },
  { clave: 'chatarra',   nombre: 'Chatarra',     icono: '✕', color: '#5a4a4a' }
];

// Tipos de PIEZA ESPECIAL. 'especial' es la marca que lleva una celda.
//   linea_h  -> carga lineal horizontal (limpia su fila)
//   linea_v  -> carga lineal vertical  (limpia su columna)
//   pulso    -> pulso HELIX (limpia todas las del mismo tipo)
//   cruz     -> descarga en cruz (limpia 3x3 alrededor)
const REF_ESPECIALES = {
  linea_h: { glifo: '⇆', halo: '#00e5ff' },
  linea_v: { glifo: '⇅', halo: '#00e5ff' },
  pulso:   { glifo: '✸', halo: '#c850ff' },
  cruz:    { glifo: '✷', halo: '#ff006e' },
  bomba:   { glifo: '✺', halo: '#ffb300' }   // bomba de desguace: barrido 5x5
};

// HALLAZGOS raros. 'prob' es la probabilidad de que un combo "grande"
// (>=4 fichas en una extracción, o cadena de combos) escupa el hallazgo.
const REF_HALLAZGOS = [
  { clave: 'memoria',    nombre: 'Memoria intacta', icono: '◈', color: '#00ff88', prob: 0.18,
    susurro: 'Un fragmento de alguien. Todavía late.' },
  { clave: 'chip_corr',  nombre: 'Chip HELIX corrupto', icono: '⬢', color: '#c850ff', prob: 0.12,
    susurro: 'Datos corporativos. La mayoría, ruido. Algo, no.' },
  { clave: 'nucleo_cero', nombre: 'Núcleo CERO', icono: '⊛', color: '#00e5ff', prob: 0.03,
    susurro: 'No deberías tener esto. Y aun así, te estaba esperando.' }
];

const REF_FILAS = 8;
const REF_COLS = 7;

// ── BALANCE DEL REFINADO (enganche con el botín real) ──────────
// Coste de entrada: cada partida consume materia prima (chatarra). La
// normal y la "en bruto" de expedición cuentan como una sola.
const REF_COSTE_CHATARRA = 3;
// Conversión a la salida: por cada N componentes extraídos se obtiene 1
// de chatarra refinada (vendible). La calidad final da un plus de créditos.
const REF_COMPONENTES_POR_REFINADA = 5;
const REF_CREDITOS_POR_CALIDAD = 0.8;   // créditos ≈ calidad(0..100) × esto
// Mapeo de los hallazgos del minijuego a items REALES del catálogo, para
// volcarlos al inventario al terminar.
const REF_HALLAZGO_ITEM = {
  memoria:     'servidor_hundido',
  chip_corr:   'chip_datos_corrupto',
  nucleo_cero: 'nucleo_optico'
};

let _refTablero = null;     // matriz [fila][col] = { clave, especial }
let _refSeleccion = null;   // {f,c} de la primera ficha tocada
let _refExtraidos = {};     // conteo por clave: { procesador: 5, ... }
let _refHallados = {};      // conteo de hallazgos: { memoria: 1, ... }
let _refCalidad = 0;        // 0..100, barra de calidad (solo feedback)
let _refAnimando = false;   // bloquea input mientras resuelve cascadas

// ── BALANCE CAPA 3 ─────────────────────────────────────────────
// Temporizador de presión (segundos). Empieza con la primera jugada.
const REF_TIEMPO_TOTAL = 90;
// Barra de chatarra basura: cuántas unidades casadas la llenan del todo.
const REF_CHATARRA_TOPE = 24;
// Penalización máxima de calidad si la barra de chatarra está al 100%.
const REF_PENAL_CHATARRA = 25;   // puntos de calidad restados como mucho
// Pedido: bonus al cumplirlo.
const REF_PEDIDO_BONUS_CALIDAD = 15;
const REF_PEDIDO_BONUS_CREDITOS = 40;
// Posibles cantidades que pide un encargo (por componente).
const REF_PEDIDO_CANTIDADES = [4, 5, 6];

let _refTiempo = REF_TIEMPO_TOTAL;  // segundos restantes
let _refReloj = null;               // handle del setInterval
let _refRelojActivo = false;        // ya arrancó (con la primera jugada)
let _refChatarra = 0;               // chatarra basura acumulada sin limpiar
let _refPedido = null;              // { items:[{clave,cantidad}], cumplido:false }
let _refCerrando = false;           // evita doble cierre (reloj + botón)

function _refCompPorClave(clave){ return REF_COMPONENTES.find(x => x.clave === clave) || null; }
function _refRandClave(){
  // La chatarra y los componentes normales pueblan el tablero por igual.
  return REF_COMPONENTES[Math.floor(Math.random() * REF_COMPONENTES.length)].clave;
}
function _refCelda(clave){ return { clave: clave, especial: null }; }
function _refFX(clave, vol){ if(typeof reproducirFX === 'function') reproducirFX(clave, vol); }

// ── Crear tablero inicial SIN matches de salida (para no auto-resolver) ──
function _refCrearTablero(){
  const t = [];
  for(let f = 0; f < REF_FILAS; f++){
    t.push([]);
    for(let c = 0; c < REF_COLS; c++){
      let clave, intentos = 0;
      do {
        clave = _refRandClave();
        intentos++;
      } while(intentos < 20 && _refCreariaMatch(t, f, c, clave));
      t[f][c] = _refCelda(clave);
    }
  }
  return t;
}

// ¿Colocar 'clave' en (f,c) crearía ya una línea de 3 con lo ya puesto?
function _refCreariaMatch(t, f, c, clave){
  if(c >= 2 && t[f][c-1] && t[f][c-1].clave === clave && t[f][c-2] && t[f][c-2].clave === clave) return true;
  if(f >= 2 && t[f-1][c] && t[f-1][c].clave === clave && t[f-2][c] && t[f-2][c].clave === clave) return true;
  return false;
}

function _refClaveEn(t, f, c){ return (t[f] && t[f][c]) ? t[f][c].clave : null; }

// ── Detectar líneas de 3+ y devolver INFO rica para crear especiales ──
// Devuelve { celdas:Set("f,c"), grupos:[ {claves:[..keys], orient, clave} ] }
// donde cada grupo es una corrida >=3 (sin fusionar cruces todavía).
function _refDetectarGrupos(t){
  const grupos = [];
  const celdas = new Set();
  // Horizontales
  for(let f = 0; f < REF_FILAS; f++){
    let run = 1;
    for(let c = 1; c <= REF_COLS; c++){
      const aqui = (c < REF_COLS) ? _refClaveEn(t, f, c) : null;
      const prev = _refClaveEn(t, f, c-1);
      const igual = (aqui !== null && aqui === prev);
      if(igual){ run++; }
      else {
        if(run >= 3){
          const keys = [];
          for(let k = 1; k <= run; k++){ keys.push(f + ',' + (c-k)); celdas.add(f + ',' + (c-k)); }
          grupos.push({ claves: keys, orient: 'h', clave: prev, len: run });
        }
        run = 1;
      }
    }
  }
  // Verticales
  for(let c = 0; c < REF_COLS; c++){
    let run = 1;
    for(let f = 1; f <= REF_FILAS; f++){
      const aqui = (f < REF_FILAS) ? _refClaveEn(t, f, c) : null;
      const prev = _refClaveEn(t, f-1, c);
      const igual = (aqui !== null && aqui === prev);
      if(igual){ run++; }
      else {
        if(run >= 3){
          const keys = [];
          for(let k = 1; k <= run; k++){ keys.push((f-k) + ',' + c); celdas.add((f-k) + ',' + c); }
          grupos.push({ claves: keys, orient: 'v', clave: prev, len: run });
        }
        run = 1;
      }
    }
  }
  return { celdas: celdas, grupos: grupos };
}

// A partir de los grupos detectados, decide qué especiales nacen y dónde.
// - 5+ en línea            -> pulso
// - cruce de 2 grupos (L/T)-> cruz (en la celda compartida)
// - 4 en línea             -> linea_h o linea_v según orientación
// Devuelve [ { f, c, especial } ] con la posición donde colocar la pieza.
function _refDecidirEspeciales(grupos){
  const nacer = [];
  // Index de qué celdas pertenecen a qué grupos (para detectar cruces).
  const porCelda = {};
  grupos.forEach((g, idx) => g.claves.forEach(k => {
    (porCelda[k] = porCelda[k] || []).push(idx);
  }));
  const usados = new Set();
  // 1) Cruces: una celda compartida por un grupo H y uno V.
  //    - Si los dos grupos cruzados son largos (>=4 total en algún brazo)
  //      o el cruce junta >=5 fichas, nace una BOMBA DE DESGUACE.
  //    - Si no, una cruz normal.
  Object.keys(porCelda).forEach(k => {
    if(porCelda[k].length >= 2 && !usados.has(k)){
      const [f, c] = k.split(',').map(Number);
      // Tamaño combinado de los grupos que comparten esta celda.
      const idxs = porCelda[k];
      let maxBrazo = 0, totalCeldas = new Set();
      idxs.forEach(i => {
        if(grupos[i].len > maxBrazo) maxBrazo = grupos[i].len;
        grupos[i].claves.forEach(kk => totalCeldas.add(kk));
      });
      const grande = (maxBrazo >= 4) || (totalCeldas.size >= 5);
      nacer.push({ f, c, especial: grande ? 'bomba' : 'cruz' });
      usados.add(k);
    }
  });
  // 2) Líneas largas: 5+ -> pulso; 4 -> carga lineal.
  grupos.forEach(g => {
    // Si el grupo ya aportó su celda de cruce, igual puede dar línea, pero
    // para no amontonar, solo generamos línea si ninguna de sus celdas fue
    // marcada como cruz.
    const tieneCruce = g.claves.some(k => usados.has(k));
    if(tieneCruce) return;
    let especial = null;
    if(g.len >= 5) especial = 'pulso';
    else if(g.len === 4) especial = (g.orient === 'h' ? 'linea_h' : 'linea_v');
    if(especial){
      // Colocar en la celda central del grupo.
      const mid = g.claves[Math.floor(g.claves.length / 2)];
      const [f, c] = mid.split(',').map(Number);
      nacer.push({ f, c, especial, clave: g.clave });
      usados.add(mid);
    }
  });
  return nacer;
}

// Expande el efecto de una pieza especial: devuelve un Set de celdas
// "f,c" que esa especial barre al activarse. Puede encadenar con otras
// especiales que caigan dentro de su radio (reacción en cadena).
function _refBarridoEspecial(t, f, c, especial, visitadas){
  const out = new Set();
  const add = (ff, cc) => {
    if(ff < 0 || ff >= REF_FILAS || cc < 0 || cc >= REF_COLS) return;
    out.add(ff + ',' + cc);
  };
  if(especial === 'linea_h'){ for(let cc = 0; cc < REF_COLS; cc++) add(f, cc); }
  else if(especial === 'linea_v'){ for(let ff = 0; ff < REF_FILAS; ff++) add(ff, c); }
  else if(especial === 'cruz'){
    for(let df = -1; df <= 1; df++) for(let dc = -1; dc <= 1; dc++) add(f+df, c+dc);
  }
  else if(especial === 'bomba'){
    // Barrido amplio 5x5 (radio 2): la bomba de desguace.
    for(let df = -2; df <= 2; df++) for(let dc = -2; dc <= 2; dc++) add(f+df, c+dc);
  }
  else if(especial === 'pulso'){
    const objetivo = (t[f][c] && t[f][c].clave) || null;
    for(let ff = 0; ff < REF_FILAS; ff++) for(let cc = 0; cc < REF_COLS; cc++){
      if(t[ff][cc] && t[ff][cc].clave === objetivo) add(ff, cc);
    }
  }
  return out;
}

// ── Aplicar gravedad: las celdas caen a los huecos (null) y se rellena ──
function _refAplicarGravedad(t){
  for(let c = 0; c < REF_COLS; c++){
    let escribir = REF_FILAS - 1;
    for(let f = REF_FILAS - 1; f >= 0; f--){
      if(t[f][c] !== null){
        t[escribir][c] = t[f][c];
        if(escribir !== f) t[f][c] = null;
        escribir--;
      }
    }
    for(let f = escribir; f >= 0; f--){
      t[f][c] = _refCelda(_refRandClave());
    }
  }
}

// Cuenta una celda como extraída (por tipo) si no es chatarra. La chatarra
// basura que se casa se acumula en la barra de chatarra (Capa 3).
function _refContar(t, f, c){
  const cel = t[f][c];
  if(!cel || !cel.clave) return;
  if(cel.clave === 'chatarra'){
    _refChatarra = Math.min(REF_CHATARRA_TOPE, _refChatarra + 1);
  } else {
    _refExtraidos[cel.clave] = (_refExtraidos[cel.clave] || 0) + 1;
  }
}

// ── ¿Son adyacentes dos casillas? (orto, no diagonal) ──
function _refAdyacentes(a, b){
  const df = Math.abs(a.f - b.f), dc = Math.abs(a.c - b.c);
  return (df + dc) === 1;
}

// Intercambia dos celdas en el tablero (sin validar).
function _refSwap(t, a, b){
  const tmp = t[a.f][a.c];
  t[a.f][a.c] = t[b.f][b.c];
  t[b.f][b.c] = tmp;
}

// ── Subir la barra de calidad (con tope 100). 'cuanto' por evento. ──
function _refSumarCalidad(cuanto){
  _refCalidad = Math.max(0, Math.min(100, _refCalidad + cuanto));
}

// ── Tirada de hallazgo: cuando un combo es "grande", puede aparecer un
// hallazgo raro. Devuelve la clave del hallazgo o null.
function _refTirarHallazgo(escala){
  const mult = escala || 1;
  for(let i = 0; i < REF_HALLAZGOS.length; i++){
    const h = REF_HALLAZGOS[i];
    if(Math.random() < h.prob * mult){
      _refHallados[h.clave] = (_refHallados[h.clave] || 0) + 1;
      return h.clave;
    }
  }
  return null;
}

// ============================================================
// CAPA 3 — PEDIDO, RELOJ, BARRA DE CHATARRA
// ============================================================

// ── Genera un pedido aleatorio: 2 componentes distintos (no chatarra),
//    cada uno con una cantidad de REF_PEDIDO_CANTIDADES.
function _refGenerarPedido(){
  const comps = REF_COMPONENTES.filter(c => c.clave !== 'chatarra');
  // Barajar y coger 2.
  const baraja = comps.slice();
  for(let i = baraja.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = baraja[i]; baraja[i] = baraja[j]; baraja[j] = tmp;
  }
  const elegidos = baraja.slice(0, 2);
  const items = elegidos.map(c => ({
    clave: c.clave,
    cantidad: REF_PEDIDO_CANTIDADES[Math.floor(Math.random() * REF_PEDIDO_CANTIDADES.length)]
  }));
  return { items: items, cumplido: false };
}

// ── ¿Está el pedido cumplido con lo extraído hasta ahora? ──
function _refPedidoCumplido(){
  if(!_refPedido) return false;
  return _refPedido.items.every(it => (_refExtraidos[it.clave] || 0) >= it.cantidad);
}

// ── Reloj: arranca con la primera jugada. Cuando llega a 0, cierra. ──
function _refArrancarReloj(){
  if(_refRelojActivo) return;
  _refRelojActivo = true;
  _refReloj = setInterval(() => {
    _refTiempo--;
    _refPintarReloj();
    if(_refTiempo <= 10 && _refTiempo > 0) _refFX('click_metal', 0.25);
    if(_refTiempo <= 0){
      _refPararReloj();
      // Cierre por tiempo: cobra lo recuperado.
      if(!_refCerrando && !_refAnimando) terminarRefinado(true);
    }
  }, 1000);
}
function _refPararReloj(){
  if(_refReloj){ clearInterval(_refReloj); _refReloj = null; }
  _refRelojActivo = false;
}

// ── Versión NO animada (para tests/lógica): resuelve todo de golpe. ──
function _refResolverCascadas(t){
  let combos = 0;
  while(true){
    const det = _refDetectarGrupos(t);
    if(det.celdas.size === 0) break;
    combos++;
    const nacer = _refDecidirEspeciales(det.grupos);
    const protegidas = new Set(nacer.map(n => n.f + ',' + n.c));
    det.celdas.forEach(key => {
      if(protegidas.has(key)) return;
      const [f, c] = key.split(',').map(Number);
      _refContar(t, f, c);
      t[f][c] = null;
    });
    nacer.forEach(n => { if(t[n.f][n.c]) t[n.f][n.c].especial = n.especial; });
    _refAplicarGravedad(t);
  }
  return combos;
}

// Intenta un movimiento sin animación (para tests). Devuelve true si vale.
function refIntentarMovimiento(a, b){
  if(_refAnimando) return false;
  if(!_refAdyacentes(a, b)) return false;
  const t = _refTablero;
  _refSwap(t, a, b);
  // ¿Alguno de los dos era especial? entonces el swap la dispara.
  const det = _refDetectarGrupos(t);
  if(det.celdas.size === 0){ _refSwap(t, a, b); return false; }
  _refResolverCascadas(t);
  return true;
}

// ── Inicializar una partida de refinado ──
function iniciarRefinado(){
  _refTablero = _refCrearTablero();
  _refSeleccion = null;
  _refExtraidos = {};
  _refHallados = {};
  _refCalidad = 0;
  _refAnimando = false;
  // Estado Capa 3
  _refTiempo = REF_TIEMPO_TOTAL;
  _refRelojActivo = false;
  _refCerrando = false;
  _refChatarra = 0;
  _refPedido = _refGenerarPedido();
  _refPararReloj();
  return _refTablero;
}

// ============================================================
// UI DEL TABLERO (capa 2)
// ============================================================

let _refVolverA = 'apartamento';

function abrirRefinado(volverA, opciones){
  opciones = opciones || {};
  const cobrar = opciones.cobrar !== false;   // por defecto cobra chatarra
  // Cerrar el panel hub (profesiones) si está abierto, para que no tape
  // el tablero del refinado.
  if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
  if(cobrar){
    // Coste de entrada: consume REF_COSTE_CHATARRA de materia prima (chatarra
    // normal + en bruto cuentan juntas). Si no llega, avisa y no entra.
    const total = (typeof contarChatarraTotal === 'function') ? contarChatarraTotal() : 0;
    if(total < REF_COSTE_CHATARRA){
      if(typeof notificarCambio === 'function'){
        notificarCambio(`Necesitas ${REF_COSTE_CHATARRA} de chatarra para desmontar (tienes ${total})`, 'aviso');
      }
      return false;
    }
    if(typeof consumirChatarraTotal === 'function') consumirChatarraTotal(REF_COSTE_CHATARRA);
    // Aplicar tiempo de juego, cooldown 4h y progreso de la profesión
    // (sin paga: la paga la da el propio minijuego al terminar).
    if(typeof aplicarTrabajoRefinado === 'function'){
      try { aplicarTrabajoRefinado('scavenger', 'procesar'); } catch(e){}
    }
  }

  _refVolverA = volverA || 'apartamento';
  iniciarRefinado();
  _refPintarObjetivos();
  _refPintarCalidad();
  _refPintarPedido();
  _refPintarReloj();
  _refPintarChatarra();
  _refPintarTablero();
  _refConectarInput();
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _refVolverA;
  const escRef = document.getElementById('refinado-escena');
  if(idDesde === 'refinado-escena'){ return true; }
  // Cambio de escena con respaldo: si cambiarEscena no existe o falla,
  // activamos la escena a mano para que SIEMPRE se abra.
  let ok = false;
  try {
    if(typeof cambiarEscena === 'function'){ cambiarEscena(idDesde, 'refinado-escena'); ok = true; }
  } catch(e){ ok = false; }
  if(!ok && escRef){
    if(desde) desde.classList.remove('activa');
    escRef.classList.add('activa');
  }
  // Garantía final: tras un instante, si la escena no quedó activa, forzarla.
  setTimeout(() => {
    const e = document.getElementById('refinado-escena');
    if(e && !e.classList.contains('activa')){
      const act = document.querySelector('.escena.activa');
      if(act && act.id !== 'refinado-escena') act.classList.remove('activa');
      e.classList.add('activa');
    }
  }, 700);
  _refFX('panel_abrir', 0.5);
  return true;
}

// Pinta el contador de componentes extraídos + hallazgos.
function _refPintarObjetivos(){
  const cont = document.getElementById('ref-objetivos');
  if(!cont) return;
  let html = '';
  REF_COMPONENTES.forEach(comp => {
    if(comp.clave === 'chatarra') return;
    const n = _refExtraidos[comp.clave] || 0;
    html += '<div class="ref-obj">'
      + '<span class="ref-obj-icono" style="color:'+comp.color+'">'+comp.icono+'</span>'
      + '<span class="ref-obj-nombre">'+comp.nombre+'</span>'
      + '<span class="ref-obj-num">'+n+'</span>'
      + '</div>';
  });
  // Hallazgos solo se muestran si hay alguno.
  REF_HALLAZGOS.forEach(h => {
    const n = _refHallados[h.clave] || 0;
    if(n <= 0) return;
    html += '<div class="ref-obj ref-obj-hallazgo">'
      + '<span class="ref-obj-icono" style="color:'+h.color+'">'+h.icono+'</span>'
      + '<span class="ref-obj-nombre">'+h.nombre+'</span>'
      + '<span class="ref-obj-num">'+n+'</span>'
      + '</div>';
  });
  cont.innerHTML = html;
}

// Pinta la barra de calidad (solo feedback visual de momento).
function _refPintarCalidad(){
  const fill = document.getElementById('ref-calidad-fill');
  const num = document.getElementById('ref-calidad-num');
  if(fill) fill.style.width = Math.round(_refCalidad) + '%';
  if(num) num.textContent = Math.round(_refCalidad) + '%';
}

// Pinta el reloj (cuenta atrás). Cambia de color al acercarse a 0.
function _refPintarReloj(){
  const fill = document.getElementById('ref-reloj-fill');
  const num = document.getElementById('ref-reloj-num');
  const barra = document.getElementById('ref-reloj');
  const pct = Math.max(0, Math.min(100, (_refTiempo / REF_TIEMPO_TOTAL) * 100));
  if(fill) fill.style.width = pct + '%';
  if(num){
    const s = Math.max(0, _refTiempo);
    num.textContent = (s < 10 ? '0' : '') + s + 's';
  }
  if(barra){
    barra.classList.toggle('ref-reloj-aviso', _refTiempo <= 30 && _refTiempo > 10);
    barra.classList.toggle('ref-reloj-critico', _refTiempo <= 10);
  }
}

// Pinta el pedido (objetivo de la partida) con progreso por componente.
function _refPintarPedido(){
  const cont = document.getElementById('ref-pedido');
  if(!cont || !_refPedido) return;
  const cumplido = _refPedidoCumplido();
  let html = '<span class="ref-pedido-label">ENCARGO</span>';
  _refPedido.items.forEach(it => {
    const comp = _refCompPorClave(it.clave);
    const tengo = _refExtraidos[it.clave] || 0;
    const ok = tengo >= it.cantidad;
    html += '<span class="ref-pedido-item' + (ok ? ' ref-pedido-ok' : '') + '">'
      + '<span class="ref-pedido-icono" style="color:' + (comp ? comp.color : '#fff') + '">'
        + (comp ? comp.icono : '◆') + '</span>'
      + '<span class="ref-pedido-prog">' + Math.min(tengo, it.cantidad) + '/' + it.cantidad + '</span>'
      + '</span>';
  });
  if(cumplido) html += '<span class="ref-pedido-sello">✓</span>';
  cont.innerHTML = html;
  cont.classList.toggle('ref-pedido-completo', cumplido);
}

// Pinta la barra de chatarra basura acumulada.
function _refPintarChatarra(){
  const fill = document.getElementById('ref-chatarra-fill');
  const barra = document.getElementById('ref-chatarra');
  const pct = Math.max(0, Math.min(100, (_refChatarra / REF_CHATARRA_TOPE) * 100));
  if(fill) fill.style.width = pct + '%';
  if(barra) barra.classList.toggle('ref-chatarra-alta', pct >= 70);
}

// Pinta el tablero entero.
function _refPintarTablero(){
  const cont = document.getElementById('ref-tablero');
  if(!cont || !_refTablero) return;
  cont.style.gridTemplateColumns = 'repeat(' + REF_COLS + ', 1fr)';
  cont.style.gridTemplateRows = 'repeat(' + REF_FILAS + ', 1fr)';
  let html = '';
  for(let f = 0; f < REF_FILAS; f++){
    for(let c = 0; c < REF_COLS; c++){
      const cel = _refTablero[f][c];
      const comp = cel ? _refCompPorClave(cel.clave) : null;
      const sel = (_refSeleccion && _refSeleccion.f === f && _refSeleccion.c === c) ? ' ref-ficha-sel' : '';
      const esp = (cel && cel.especial) ? ' ref-ficha-especial ref-esp-' + cel.especial : '';
      let icono = comp ? comp.icono : '';
      let color = comp ? comp.color : '#888';
      // La pieza especial dibuja su glifo encima en una capa.
      let capaEsp = '';
      if(cel && cel.especial && REF_ESPECIALES[cel.especial]){
        const e = REF_ESPECIALES[cel.especial];
        capaEsp = '<span class="ref-esp-glifo" style="color:'+e.halo+'">'+e.glifo+'</span>';
      }
      html += '<button class="ref-ficha'+sel+esp+'" data-f="'+f+'" data-c="'+c+'" '
        + 'style="color:'+color+'">'
        + '<span class="ref-ficha-glifo">'+icono+'</span>'+capaEsp
        + '</button>';
    }
  }
  cont.innerHTML = html;
}

// ── INPUT DEL TABLERO (Capa 3): arrastrar para mover ───────────
// Soporta dos formas, ambas con Pointer Events (ratón y táctil unificados):
//   · ARRASTRE: pulsas sobre una ficha y arrastras hacia una vecina. Al
//     cruzar el umbral hacia una casilla adyacente, se hace el swap.
//   · TAP-TAP (respaldo): un toque corto sin arrastre selecciona la ficha;
//     el siguiente toque sobre una vecina hace el swap (como antes).
let _refDrag = null;   // { f, c, x0, y0, lado, hecho } durante un arrastre

// Calcula la casilla (f,c) bajo unas coordenadas de pantalla, o null.
function _refCeldaEnPunto(x, y){
  const el = document.elementFromPoint(x, y);
  if(!el) return null;
  const ficha = el.closest ? el.closest('.ref-ficha') : null;
  if(!ficha) return null;
  const f = parseInt(ficha.getAttribute('data-f'), 10);
  const c = parseInt(ficha.getAttribute('data-c'), 10);
  if(isNaN(f) || isNaN(c)) return null;
  return { f: f, c: c };
}

function _refPointerDown(e){
  if(_refAnimando) return;
  const cel = _refCeldaEnPunto(e.clientX, e.clientY);
  if(!cel) return;
  // Lado aproximado de una ficha en píxeles (para el umbral de arrastre).
  const cont = document.getElementById('ref-tablero');
  let lado = 40;
  if(cont){
    const r = cont.getBoundingClientRect();
    lado = Math.min(r.width / REF_COLS, r.height / REF_FILAS);
  }
  _refDrag = { f: cel.f, c: cel.c, x0: e.clientX, y0: e.clientY, lado: lado, hecho: false };
  // Selección visual inmediata (sirve también para el tap-tap).
  _refSeleccion = { f: cel.f, c: cel.c };
  _refFX('click_metal', 0.4);
  _refPintarTablero();
}

function _refPointerMove(e){
  if(!_refDrag || _refDrag.hecho || _refAnimando) return;
  const dx = e.clientX - _refDrag.x0;
  const dy = e.clientY - _refDrag.y0;
  const umbral = Math.max(12, _refDrag.lado * 0.4);
  if(Math.abs(dx) < umbral && Math.abs(dy) < umbral) return;  // aún no es arrastre
  // Dirección dominante -> casilla vecina objetivo.
  let nf = _refDrag.f, nc = _refDrag.c;
  if(Math.abs(dx) > Math.abs(dy)) nc += (dx > 0 ? 1 : -1);
  else                            nf += (dy > 0 ? 1 : -1);
  if(nf < 0 || nf >= REF_FILAS || nc < 0 || nc >= REF_COLS){ return; }
  // Disparar el swap una sola vez por arrastre.
  _refDrag.hecho = true;
  const a = { f: _refDrag.f, c: _refDrag.c }, b = { f: nf, c: nc };
  _refSeleccion = null;
  _refMovimientoAnimado(a, b);
}

function _refPointerUp(e){
  if(!_refDrag){ return; }
  // Si no hubo arrastre (toque corto), funciona como tap-tap: la ficha
  // queda seleccionada; el siguiente toque sobre una vecina hace el swap.
  if(!_refDrag.hecho){
    const cel = _refCeldaEnPunto(e.clientX, e.clientY);
    // Mismo punto que el down (un tap): dejamos la selección puesta y
    // delegamos en refTocarFicha para el segundo toque.
    if(cel && (cel.f !== _refDrag.f || cel.c !== _refDrag.c)){
      // soltó sobre otra ficha sin cruzar umbral: trátalo como intento.
      const a = { f: _refDrag.f, c: _refDrag.c };
      if(_refAdyacentes(a, cel)){ _refSeleccion = null; _refMovimientoAnimado(a, cel); }
    }
  }
  _refDrag = null;
}

// Conecta los listeners de arrastre al contenedor del tablero (una vez).
let _refInputConectado = false;
function _refConectarInput(){
  if(_refInputConectado) return;
  const cont = document.getElementById('ref-tablero');
  if(!cont) return;
  cont.addEventListener('pointerdown', _refPointerDown);
  // move/up en window para no perder el gesto si el dedo sale del tablero.
  window.addEventListener('pointermove', _refPointerMove);
  window.addEventListener('pointerup', _refPointerUp);
  window.addEventListener('pointercancel', () => { _refDrag = null; });
  // Evita que el navegador interprete el arrastre como gesto/scroll/selección.
  cont.style.touchAction = 'none';
  _refInputConectado = true;
}

// Toca una ficha (tap-tap de respaldo): primera selección, o intento de
// movimiento con una vecina. Sigue disponible para accesibilidad/teclado.
function refTocarFicha(f, c){
  if(_refAnimando) return;
  if(!_refSeleccion){
    _refSeleccion = { f: f, c: c };
    _refFX('click_metal', 0.4);
    _refPintarTablero();
    return;
  }
  if(_refSeleccion.f === f && _refSeleccion.c === c){
    _refSeleccion = null;
    _refPintarTablero();
    return;
  }
  const a = _refSeleccion, b = { f: f, c: c };
  if(!_refAdyacentes(a, b)){
    _refSeleccion = b;
    _refFX('click_metal', 0.4);
    _refPintarTablero();
    return;
  }
  _refSeleccion = null;
  _refMovimientoAnimado(a, b);
}

// Movimiento con animación.
function _refMovimientoAnimado(a, b){
  const t = _refTablero;
  _refSwap(t, a, b);
  const det = _refDetectarGrupos(t);
  if(det.celdas.size === 0){
    _refPintarTablero();
    _refAnimando = true;
    _refFX('click_metal', 0.3);
    setTimeout(() => { _refSwap(t, a, b); _refPintarTablero(); _refAnimando = false; }, 180);
    return;
  }
  _refPintarTablero();
  _refAnimando = true;
  _refArrancarReloj();   // el reloj empieza con la primera jugada válida
  _refResolverCascadasAnimado(0);
}

// Resuelve cascadas una a una, con delays, repintando entre paso y paso.
// 'profundidad' es el nº de combo encadenado (para escalar calidad/hallazgo).
function _refResolverCascadasAnimado(profundidad){
  const t = _refTablero;
  const det = _refDetectarGrupos(t);
  if(det.celdas.size === 0){
    // Antes de cerrar: ¿hay especiales que se hayan formado y nadie activó?
    // (Las especiales solo se activan al casarse de nuevo; aquí no forzamos.)
    _refAnimando = false;
    _refPintarTablero();
    _refPintarObjetivos();
    _refPintarCalidad();
    _refPintarPedido();
    _refPintarChatarra();
    // Si el reloj llegó a 0 mientras resolvíamos la cascada, cerrar ahora.
    if(_refTiempo <= 0 && !_refCerrando){ terminarRefinado(true); }
    return;
  }
  const cont = document.getElementById('ref-tablero');
  const combo = (profundidad || 0) + 1;

  // Decidir especiales que nacen en esta resolución.
  const nacer = _refDecidirEspeciales(det.grupos);
  const protegidas = new Set(nacer.map(n => n.f + ',' + n.c));

  // ¿Alguna celda casada es ya una especial? entonces se ACTIVA: su barrido
  // se suma a las celdas que se van.
  let barrido = new Set();
  let huboBomba = false;
  det.celdas.forEach(key => {
    const [f, c] = key.split(',').map(Number);
    const cel = t[f][c];
    if(cel && cel.especial){
      if(cel.especial === 'bomba') huboBomba = true;
      const b = _refBarridoEspecial(t, f, c, cel.especial);
      b.forEach(k => barrido.add(k));
    }
  });
  const irse = new Set(det.celdas);
  barrido.forEach(k => irse.add(k));

  // 1) Marcar visualmente las fichas que se van (y resaltar las especiales).
  let huboEspecialActivada = barrido.size > 0;
  if(cont){
    irse.forEach(key => {
      if(protegidas.has(key)) return; // las que se transforman, no se van
      const [f, c] = key.split(',').map(Number);
      const btn = cont.querySelector('.ref-ficha[data-f="'+f+'"][data-c="'+c+'"]');
      if(btn) btn.classList.add('ref-ficha-extrae');
    });
    // Onda de las especiales que se activan.
    det.celdas.forEach(key => {
      const [f, c] = key.split(',').map(Number);
      const cel = t[f][c];
      if(cel && cel.especial){
        const btn = cont.querySelector('.ref-ficha[data-f="'+f+'"][data-c="'+c+'"]');
        if(btn) btn.classList.add('ref-onda-' + cel.especial);
      }
    });
    // Nacimiento de nuevas especiales: destello en su celda.
    nacer.forEach(n => {
      const btn = cont.querySelector('.ref-ficha[data-f="'+n.f+'"][data-c="'+n.c+'"]');
      if(btn) btn.classList.add('ref-nace');
    });
  }

  // Sonido según lo que pasa en este paso.
  if(huboEspecialActivada) _refFX('sci_plasma', 0.6);
  else if(nacer.length > 0) _refFX('energia', 0.55);
  else _refFX('sci_energia_corta', combo > 1 ? 0.6 : 0.45);

  // Calidad: cada combo suma; especiales y cadenas suman más.
  let ganaCalidad = 3 + (combo - 1) * 2;
  if(nacer.length) ganaCalidad += 5 * nacer.length;
  if(huboEspecialActivada) ganaCalidad += 6;
  _refSumarCalidad(ganaCalidad);

  // Hallazgo: solo en combos "grandes" (cadena >=2, especial activada, o
  // un grupo de 4+). Escala con la profundidad de la cadena. La bomba de
  // desguace y el nacimiento de una bomba refuerzan la suerte de hallazgo.
  const grupoGrande = det.grupos.some(g => g.len >= 4);
  const naceBomba = nacer.some(n => n.especial === 'bomba');
  let hallazgo = null;
  if(combo >= 2 || huboEspecialActivada || grupoGrande){
    let escala = 0.5 + combo * 0.25;
    if(huboBomba) escala += 0.6;
    if(naceBomba) escala += 0.3;
    hallazgo = _refTirarHallazgo(escala);
  }

  // Calidad extra si nace o se activa una bomba (la pieza más valiosa).
  if(naceBomba) _refSumarCalidad(8);
  if(huboBomba) _refSumarCalidad(6);

  // 2) Tras el destello: contar, vaciar (respetando las que se transforman),
  //    crear especiales, gravedad, repintar.
  setTimeout(() => {
    irse.forEach(key => {
      if(protegidas.has(key)) return;
      const [f, c] = key.split(',').map(Number);
      if(t[f][c]){ _refContar(t, f, c); t[f][c] = null; }
    });
    nacer.forEach(n => { if(t[n.f][n.c]) t[n.f][n.c].especial = n.especial; });
    _refAplicarGravedad(t);
    _refPintarTablero();
    _refPintarObjetivos();
    _refPintarCalidad();
    _refPintarPedido();
    _refPintarChatarra();

    if(hallazgo) _refMostrarHallazgo(hallazgo);

    // 3) Encadenar el siguiente combo, si lo hay.
    setTimeout(() => _refResolverCascadasAnimado(combo), huboEspecialActivada ? 240 : 160);
  }, huboEspecialActivada ? 300 : 220);
}

// Flash narrativo al encontrar un hallazgo raro.
function _refMostrarHallazgo(clave){
  const h = REF_HALLAZGOS.find(x => x.clave === clave);
  if(!h) return;
  // Sonido especial para el núcleo CERO; energía para el resto.
  if(clave === 'nucleo_cero') _refFX('sci_void_shift', 0.7);
  else if(clave === 'chip_corr') _refFX('sci_laser_cyber', 0.55);
  else _refFX('sci_powerup', 0.55);

  const cap = document.getElementById('ref-hallazgo');
  if(!cap) return;
  cap.className = 'ref-hallazgo ref-hallazgo-' + clave + ' activo';
  cap.innerHTML = '<span class="ref-hallazgo-icono" style="color:'+h.color+'">'+h.icono+'</span>'
    + '<div class="ref-hallazgo-txt">'
    + '<div class="ref-hallazgo-nombre" style="color:'+h.color+'">'+h.nombre+'</div>'
    + '<div class="ref-hallazgo-susurro">'+h.susurro+'</div>'
    + '</div>';
  clearTimeout(_refHallazgoTO);
  _refHallazgoTO = setTimeout(() => { cap.classList.remove('activo'); }, 2600);
}
let _refHallazgoTO = null;

// Calcula la recompensa de la partida a partir de lo extraído, la calidad
// y los hallazgos. Devuelve un objeto-resumen y aplica los efectos reales
// (chatarra refinada + créditos + hallazgos al inventario).
function _refResolverRecompensa(){
  // 1) Total de componentes extraídos (sin contar chatarra basura).
  let totalComp = 0;
  Object.keys(_refExtraidos).forEach(k => { totalComp += (_refExtraidos[k] || 0); });

  // 2) Calidad efectiva: la barra menos la penalización por chatarra basura
  //    acumulada (el desguace sucio recorta calidad), más el bonus de pedido.
  const fracChatarra = Math.min(1, _refChatarra / REF_CHATARRA_TOPE);
  const penalChatarra = Math.round(fracChatarra * REF_PENAL_CHATARRA);
  const pedidoOk = _refPedidoCumplido();
  const bonusPedido = pedidoOk ? REF_PEDIDO_BONUS_CALIDAD : 0;
  let calidadEfectiva = _refCalidad - penalChatarra + bonusPedido;
  calidadEfectiva = Math.max(0, Math.min(100, calidadEfectiva));

  // 3) Chatarra refinada: 1 por cada N componentes, con plus por calidad.
  const factorCalidad = 1 + (calidadEfectiva / 100) * 0.5;   // hasta +50%
  let refinada = Math.floor((totalComp / REF_COMPONENTES_POR_REFINADA) * factorCalidad);
  if(totalComp > 0 && refinada < 1) refinada = 1;            // algo siempre sale

  // 4) Créditos: por calidad efectiva + bonus fijo si se cumplió el pedido.
  let creditos = Math.round(calidadEfectiva * REF_CREDITOS_POR_CALIDAD);
  if(pedidoOk) creditos += REF_PEDIDO_BONUS_CREDITOS;

  // 5) Aplicar efectos.
  if(refinada > 0 && typeof darItem === 'function'){
    darItem({ id:'chatarra_refinada', nombre:'Chatarra refinada', tipo:'material',
      apilable:true,
      desc:'Material limpio y clasificado, listo para vender. Vale bastante más que la chatarra en bruto.',
      cantidad:refinada });
  }
  if(creditos > 0 && typeof ajustarCreditos === 'function') ajustarCreditos(creditos);

  // 6) Hallazgos: volcar al inventario como items reales del catálogo.
  const hallazgosDados = [];
  Object.keys(_refHallados).forEach(clave => {
    const n = _refHallados[clave] || 0;
    if(n <= 0) return;
    const itemId = REF_HALLAZGO_ITEM[clave];
    const h = REF_HALLAZGOS.find(x => x.clave === clave);
    if(itemId && typeof darItemPorId === 'function'){
      for(let i = 0; i < n; i++) darItemPorId(itemId);
    }
    hallazgosDados.push({ nombre: h ? h.nombre : clave, n: n,
      color: h ? h.color : '#fff', icono: h ? h.icono : '◆' });
  });

  if(typeof guardarPartida === 'function') guardarPartida();
  return {
    totalComp, refinada, creditos,
    calidad: Math.round(calidadEfectiva),
    penalChatarra, bonusPedido, pedidoOk,
    hallazgos: hallazgosDados
  };
}

// Pinta la pantalla de resumen sobre el tablero y espera a que el jugador
// la cierre para salir de verdad.
function _refMostrarResumen(r){
  const cap = document.getElementById('ref-resumen');
  if(!cap){ _refSalir(); return; }
  const titulo = (r._porTiempo ? 'TIEMPO AGOTADO' : 'DESMONTAJE COMPLETADO');
  let html = '<div class="ref-resumen-caja">'
    + '<div class="ref-resumen-titulo">'+titulo+'</div>'
    + '<div class="ref-resumen-linea"><span>Calidad final</span><span class="ref-resumen-val">'+r.calidad+'%</span></div>'
    + '<div class="ref-resumen-linea"><span>Componentes recuperados</span><span class="ref-resumen-val">'+r.totalComp+'</span></div>';
  if(r.pedidoOk){
    html += '<div class="ref-resumen-linea ref-resumen-bonus"><span>Encargo cumplido</span><span class="ref-resumen-val">+'+r.bonusPedido+' calidad · +'+REF_PEDIDO_BONUS_CREDITOS+' CR</span></div>';
  }
  if(r.penalChatarra > 0){
    html += '<div class="ref-resumen-linea ref-resumen-penal"><span>Desguace sucio</span><span class="ref-resumen-val">−'+r.penalChatarra+' calidad</span></div>';
  }
  html += '<div class="ref-resumen-linea ref-resumen-premio"><span>Chatarra refinada</span><span class="ref-resumen-val">+'+r.refinada+'</span></div>'
    + '<div class="ref-resumen-linea ref-resumen-premio"><span>Créditos</span><span class="ref-resumen-val">+'+r.creditos+' CR</span></div>';
  if(r.hallazgos.length){
    html += '<div class="ref-resumen-hallazgos-tit">Hallazgos</div>';
    r.hallazgos.forEach(h => {
      html += '<div class="ref-resumen-linea ref-resumen-hallazgo">'
        + '<span style="color:'+h.color+'">'+h.icono+' '+h.nombre+'</span>'
        + '<span class="ref-resumen-val">×'+h.n+'</span></div>';
    });
  }
  html += '<button class="ref-resumen-cerrar" onclick="_refSalir()">RECOGER Y SALIR</button>'
    + '</div>';
  cap.innerHTML = html;
  cap.classList.add('activo');
  _refFX('sci_powerup', 0.55);
}

// Salida real de la escena (tras recoger el resumen).
function _refSalir(){
  _refSeleccion = null;
  _refPararReloj();
  const cap = document.getElementById('ref-resumen');
  if(cap){ cap.classList.remove('activo'); cap.innerHTML = ''; }
  _refFX('terminal_cerrar', 0.5);
  if(typeof cambiarEscena === 'function') cambiarEscena('refinado-escena', _refVolverA);
  else { const e = document.getElementById('refinado-escena'); if(e) e.classList.remove('activa'); }
}

// Terminar: calcula y aplica la recompensa, luego muestra el resumen.
// 'porTiempo' = true cuando lo dispara el reloj al llegar a 0.
function terminarRefinado(porTiempo){
  if(_refAnimando && !porTiempo) return;   // no cerrar a mano en mitad de cascada
  if(_refCerrando) return;                 // evita doble cierre
  _refCerrando = true;
  _refPararReloj();
  const r = _refResolverRecompensa();
  r._porTiempo = !!porTiempo;
  _refMostrarResumen(r);
}

window.abrirRefinado = abrirRefinado;
window.refTocarFicha = refTocarFicha;
window.terminarRefinado = terminarRefinado;
window._refSalir = _refSalir;
window.iniciarRefinado = iniciarRefinado;
window.refIntentarMovimiento = refIntentarMovimiento;
window.REF_COMPONENTES = REF_COMPONENTES;
window.REF_ESPECIALES = REF_ESPECIALES;
window.REF_HALLAZGOS = REF_HALLAZGOS;
window.REF_FILAS = REF_FILAS;
window.REF_COLS = REF_COLS;
window._refGetTablero = function(){ return _refTablero; };
window._refGetExtraidos = function(){ return _refExtraidos; };
window._refGetHallados = function(){ return _refHallados; };
window._refGetCalidad = function(){ return _refCalidad; };
window._refGetPedido = function(){ return _refPedido; };
window._refGetTiempo = function(){ return _refTiempo; };
window._refGetChatarra = function(){ return _refChatarra; };
