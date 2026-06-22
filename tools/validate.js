#!/usr/bin/env node
/* ============================================================
 * NEON ASHES — VALIDADOR DEL PROYECTO (v0.130)
 * ------------------------------------------------------------
 * Una sola red de seguridad. Ejecuta:
 *   node tools/validate.js
 * desde la raíz del repo. Sale con código 1 si algo falla, 0 si todo ok.
 *
 * Comprueba, sin necesidad de navegador:
 *   1. Sintaxis (node --check) de todos los js/*.js
 *   2. Cache-busts (?v=) uniformes en index.html
 *   3. Caracteres raros / mojibake en js y css
 *   4. Integridad de datos de combate (corridas, deriva)
 *   5. Integridad de las cadenas con pelea (motor de escenas)
 *
 * No depende de paquetes externos. Pensado para que lo corra
 * tanto el desarrollo como el agente de despliegue.
 * ============================================================ */

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
let errores = 0;
let avisos = 0;
function err(msg){ console.log('  ✗ ' + msg); errores++; }
function ok(msg){ console.log('  ✓ ' + msg); }
function aviso(msg){ console.log('  · ' + msg); avisos++; }
function seccion(t){ console.log('\n[' + t + ']'); }

function listarJs(dir){
  const out = [];
  for(const f of fs.readdirSync(dir)){
    if(f.endsWith('.js')) out.push(path.join(dir, f));
  }
  return out.sort();
}

// ── 1) SINTAXIS ─────────────────────────────────────────────
seccion('1. Sintaxis (node --check)');
const jsFiles = listarJs(path.join(ROOT, 'js'));
let sintaxisOk = 0;
for(const f of jsFiles){
  try { execSync('node --check "' + f + '"', { stdio: 'pipe' }); sintaxisOk++; }
  catch(e){ err('sintaxis: ' + path.basename(f) + ' → ' + String(e.stderr || e).split('\n')[0]); }
}
if(sintaxisOk === jsFiles.length) ok(jsFiles.length + ' archivos js sin errores de sintaxis');

// ── 2) CACHE-BUSTS UNIFORMES ────────────────────────────────
seccion('2. Cache-busts (?v=) en index.html');
try {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const vs = (idx.match(/\?v=[0-9]+/g) || []);
  const unicos = [...new Set(vs)];
  if(vs.length === 0){ aviso('no se encontraron cache-busts ?v= (¿formato cambiado?)'); }
  else if(unicos.length === 1){ ok(vs.length + ' cache-busts, todos en ' + unicos[0]); }
  else { err('cache-busts NO uniformes: ' + unicos.join(', ') + ' (deben ser todos iguales)'); }
} catch(e){ err('no se pudo leer index.html: ' + e.message); }

// ── 3) MOJIBAKE / CORRUPCIÓN DE TEXTO ───────────────────────
// No vetamos glifos decorativos (flechas, iconos, ⚔, emojis): el proyecto
// los usa a propósito. Cazamos solo corrupción real: el carácter de
// reemplazo U+FFFD y las firmas típicas de UTF-8 mal decodificado.
seccion('3. Mojibake / corrupción de texto');
const MOJIBAKE = ['Ã¡','Ã©','Ã­','Ã³','Ãº','Ã±','Ã‘','Ã“','Ãš','Ã�','Ã€',
  'Â¡','Â¿','Â°','Âª','Âº','â€œ','â€\u009d','â€™','â€˜','â€“','â€”','â€¢','ï¿½'];
let charProblemas = 0;
function chequearChars(file){
  const t = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  if(t.indexOf('\uFFFD') !== -1){ err('carácter de reemplazo (U+FFFD) en ' + rel + ' — texto corrupto'); charProblemas++; return; }
  for(const m of MOJIBAKE){
    if(t.indexOf(m) !== -1){ err('mojibake "' + m + '" en ' + rel + ' — guardar en UTF-8'); charProblemas++; return; }
  }
}
const cssDir = path.join(ROOT, 'css');
const cssFiles = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter(f=>f.endsWith('.css')).map(f=>path.join(cssDir,f)) : [];
[...jsFiles, ...cssFiles].forEach(f=>{ if(fs.existsSync(f)) chequearChars(f); });
if(charProblemas === 0) ok('sin mojibake ni caracteres de reemplazo (' + (jsFiles.length + cssFiles.length) + ' archivos)');

// ── Carga en sandbox de los datos (para 4 y 5) ──────────────
function cargarDatos(){
  const Estado = { inventario: [] };
  const ctx = { Estado, console: { log(){}, warn(){}, error(){} }, Math, Date,
    window: { ESCENAS_GUION: {} } };
  ctx.ESCENAS_GUION = ctx.window.ESCENAS_GUION;
  vm.createContext(ctx);
  function correr(rel){
    const p = path.join(ROOT, rel);
    if(!fs.existsSync(p)) return false;
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx); return true; }
    catch(e){ aviso('no se pudo cargar ' + rel + ' para validar datos: ' + e.message); return false; }
  }
  correr('js/40_items.js');
  correr('js/68_corrida_datos.js');
  correr('js/70_deriva_datos.js');
  correr('js/72_profesion_eventos.js');
  return ctx;
}
const ctx = cargarDatos();
const TIPOS = new Set(['normal', 'bruto', 'rapido', 'lider', 'cobarde', undefined]);
const FACC = new Set(['sindicatos', 'loto', 'eco', 'ia', 'helix']);
const PROFS = new Set(['scavenger', 'investigador', 'cazarrecompensas', 'hacker', 'contrabandista', 'seguridad']);
const itemList = [
  ...(ctx.window.ITEMS_EXPLORAR || []),
  ...(ctx.window.ITEMS_EXPEDICION || [])
].map(i => i.id);
const itemIds = new Set(itemList);
// IDs duplicados en el catálogo: dos items distintos con el mismo id se
// pisan en silencio (el bug de papel_helix). Lo cazamos aquí.
const vistosItem = {};
const dupItem = [];
itemList.forEach(id => { vistosItem[id] = (vistosItem[id] || 0) + 1; if(vistosItem[id] === 2) dupItem.push(id); });
if(dupItem.length) dupItem.forEach(id => err('id de item DUPLICADO en el catálogo: "' + id + '" (dos definiciones se pisan)'));
function chkItem(id, w){ if(id && !itemIds.has(id)) err('item inexistente "' + id + '" en ' + w); }
function chkFac(f, w){ if(f && !FACC.has(f)) err('facción inválida "' + f + '" en ' + w); }
function chkTipos(arr, w){ (arr || []).forEach(e => { if(!TIPOS.has(e.tipo)) err('tipo de enemigo inválido "' + e.tipo + '" en ' + w); }); }

// ── 4) DATOS DE COMBATE (corridas + deriva) ─────────────────
seccion('4. Datos de combate (corridas + deriva)');
const C = ctx.window.CORRIDAS_DATOS;
if(!C){ aviso('CORRIDAS_DATOS no disponible (se omite chequeo de rutas)'); }
else {
  let rutas = 0, enemigos = 0;
  ['contrabando', 'seguridad'].forEach(bando => {
    (C[bando] || []).forEach(r => {
      rutas++;
      const nodos = r.mapa && r.mapa.nodos;
      if(!nodos){ err('ruta sin mapa.nodos: ' + r.id); return; }
      const keys = new Set(Object.keys(nodos));
      if(!keys.has(r.mapa.inicio)) err('inicio inexistente en ' + r.id + ' → ' + r.mapa.inicio);
      Object.entries(nodos).forEach(([k, n]) => {
        const dests = [];
        if(n.ir) dests.push(n.ir);
        if(n.irAceptar) dests.push(n.irAceptar);
        if(n.irRechazar) dests.push(n.irRechazar);
        (n.ramas || []).forEach(rr => { if(rr.ir) dests.push(rr.ir); });
        dests.forEach(d => { if(d && !keys.has(d)) err('enlace roto en ' + r.id + ' · nodo ' + k + ' → ' + d); });
        chkTipos(n.enemigos, r.id + '/' + k); enemigos += (n.enemigos || []).length;
        chkTipos(n.refuerzoGrupo, r.id + '/' + k + '(ref)');
        chkTipos(n.refuerzoTurnoGrupo, r.id + '/' + k + '(refT)');
        chkItem(n.recompensaItem, r.id + '/' + k);
        chkItem(n.itemRecompensa, r.id + '/' + k);
        chkItem(n.item, r.id + '/' + k);
      });
    });
  });
  const D = ctx.window.EVENTOS_DERIVA || [];
  D.forEach(ev => {
    if(ev.tipo === 'confrontacion'){ chkTipos(ev.enemigos, 'deriva/' + ev.id); chkTipos(ev.refuerzoGrupo, 'deriva/' + ev.id + '(ref)'); }
    chkItem(ev.item, 'deriva/' + ev.id);
    chkItem(ev.recompensaItem, 'deriva/' + ev.id);
  });
  if(errores === 0 || true) ok(rutas + ' rutas · ' + enemigos + ' enemigos · ' + D.length + ' eventos de deriva revisados');
}

// ── 5) CADENAS CON PELEA (motor de escenas) ─────────────────
seccion('5. Cadenas con pelea (ESCENAS_GUION cargadas)');
const EG = ctx.ESCENAS_GUION || {};
const keysEG = new Set(Object.keys(EG));
function chkEf(ef, w){
  if(!ef) return;
  chkItem(ef.item, w); chkFac(ef.faccion, w);
  if(Array.isArray(ef.facciones)) ef.facciones.forEach(fr => chkFac(fr && fr.faccion, w));
}
let escenas = 0, peleas = 0;
Object.entries(EG).forEach(([id, e]) => {
  escenas++;
  if(e.cond && e.cond.profesion && !PROFS.has(e.cond.profesion)) err('profesión inválida "' + e.cond.profesion + '" en ' + id);
  (e.opciones || []).forEach((op, i) => {
    const w = id + '/op' + i;
    chkEf(op.efectos, w);
    if(op.azar){ chkEf(op.azar.exito && op.azar.exito.efectos, w + '(exito)'); chkEf(op.azar.fallo && op.azar.fallo.efectos, w + '(fallo)'); }
    const llevas = [op.lleva, op.azar && op.azar.exito && op.azar.exito.lleva, op.azar && op.azar.fallo && op.azar.fallo.lleva];
    llevas.forEach(d => { if(d && !keysEG.has(d)) err('lleva roto "' + d + '" en ' + w); });
    const pelea = op.pelea || (op.azar && op.azar.exito && op.azar.exito.pelea);
    if(pelea){
      peleas++;
      if(!pelea.enemigos || !pelea.enemigos.length) err('pelea sin enemigos en ' + w);
      chkTipos(pelea.enemigos, w); chkTipos(pelea.refuerzoGrupo, w + '(ref)');
      [pelea.gana, pelea.pierde].forEach(d => { if(d && !keysEG.has(d)) err('pelea→escena rota "' + d + '" en ' + w); });
    }
  });
});
ok(escenas + ' escenas cargadas · ' + peleas + ' con pelea revisadas');

// ── RESUMEN ─────────────────────────────────────────────────
console.log('\n' + '='.repeat(50));
if(errores === 0){
  console.log('VALIDACIÓN OK — 0 errores' + (avisos ? (' · ' + avisos + ' avisos') : ''));
  process.exit(0);
} else {
  console.log('VALIDACIÓN FALLIDA — ' + errores + ' error(es)' + (avisos ? (' · ' + avisos + ' avisos') : ''));
  process.exit(1);
}
