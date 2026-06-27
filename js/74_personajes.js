// ============================================================
// BLOQUE JS-74 — PERSONAJES / HUECOS DE GUARDADO (v0.138)
// ============================================================
// Hasta ahora el juego guardaba UN solo personaje, repartido en 4 claves
// de localStorage (partida, mundo, facciones, zonas). Este módulo convierte
// eso en hasta 3 "huecos" independientes, cada uno con su propio juego de
// claves sufijadas (..._v1__p1, ..._v1__p2, ..._v1__p3).
//
// Pieza clave: la MIGRACIÓN. La primera vez que corre, si encuentra una
// partida vieja en las claves SIN sufijo (el personaje de siempre), la
// copia al hueco 1 para que NADIE pierda su progreso. Las claves viejas se
// dejan intactas como copia de seguridad.
//
// La migración es PEREZOSA: se asegura sola la primera vez que se pide una
// clave de hueco, así no depende del orden de carga de los scripts.

var MAX_PERSONAJES = 3;
var CLAVE_PERSONAJES = 'neon_ashes_personajes_v1'; // registro de huecos
var _slotsMigrado = false;
var _slotsRegistroCache = null;

// Las claves que pertenecen a CADA personaje. El archivo del MUNDO
// (muertos, herencia, "anteriores en esta unidad") NO va aquí: es global,
// compartido entre todos los personajes.
function _clavesBasePersonaje(){
  var L = (typeof LAUNCHER !== 'undefined') ? LAUNCHER : {};
  return [L.CLAVE_PARTIDA, L.CLAVE_FACCIONES, L.CLAVE_ZONAS]
    .filter(function(k){ return !!k; });
}

function _lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function _lsSet(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
function _lsDel(k){ try { localStorage.removeItem(k); } catch(e){} }

function _leerRegistro(){
  if(_slotsRegistroCache) return _slotsRegistroCache;
  var raw = _lsGet(CLAVE_PERSONAJES);
  var reg = null;
  try { reg = raw ? JSON.parse(raw) : null; } catch(e){ reg = null; }
  if(!reg || typeof reg !== 'object') reg = { activo:'p1', lista:{} };
  if(!reg.lista || typeof reg.lista !== 'object') reg.lista = {};
  if(!reg.activo) reg.activo = 'p1';
  _slotsRegistroCache = reg;
  return reg;
}
function _guardarRegistro(reg){
  _slotsRegistroCache = reg;
  _lsSet(CLAVE_PERSONAJES, JSON.stringify(reg));
}

// Construye el resumen (lo que se ve en la lista) desde un blob de partida.
function _resumenDesdeBlob(blobStr){
  var d = null;
  try { d = (typeof blobStr === 'string') ? JSON.parse(blobStr) : blobStr; } catch(e){ d = null; }
  d = d || {};
  var j = d.jugador || {};
  return {
    nombre: j.nombre || 'Sin nombre',
    apellido1: j.apellido1 || '',
    creditos: (typeof d.creditos === 'number') ? d.creditos : 0,
    humano: d.humano || null,
    dia: d._diaResumen || null,
    guardadoEn: d.guardadoEn || Date.now()
  };
}

// ── MIGRACIÓN (perezosa, una sola vez) ──────────────────────
function _asegurarMigracion(){
  if(_slotsMigrado) return;
  _slotsMigrado = true;
  var reg = _leerRegistro();
  // Si ya hay huecos registrados, no hay nada que migrar.
  if(reg.lista && Object.keys(reg.lista).length > 0) return;

  var L = (typeof LAUNCHER !== 'undefined') ? LAUNCHER : {};
  var legacy = L.CLAVE_PARTIDA ? _lsGet(L.CLAVE_PARTIDA) : null;
  if(!legacy){
    // Jugador nuevo: registro vacío, hueco activo 'p1' por defecto.
    _guardarRegistro({ activo:'p1', lista:{} });
    return;
  }
  // Copiar las 4 claves viejas al hueco 1 (dejando las viejas como backup).
  _clavesBasePersonaje().forEach(function(base){
    var val = _lsGet(base);
    if(val != null) _lsSet(base + '__p1', val);
  });
  _guardarRegistro({ activo:'p1', lista:{ p1:{ id:'p1', resumen:_resumenDesdeBlob(legacy) } } });
}

// ── API de huecos ───────────────────────────────────────────
function slotActivo(){
  _asegurarMigracion();
  return _leerRegistro().activo || 'p1';
}
// Clave real para el hueco activo: base + '__pN'.
function claveSlot(base){
  _asegurarMigracion();
  return base + '__' + slotActivo();
}
function fijarSlotActivo(id){
  if(!id) return;
  var reg = _leerRegistro();
  reg.activo = id;
  _guardarRegistro(reg);
}

// Lista de personajes para la pantalla de selección.
function listaPersonajes(){
  _asegurarMigracion();
  var reg = _leerRegistro();
  return Object.keys(reg.lista).map(function(id){
    return { id:id, resumen:reg.lista[id].resumen || {}, activo:(id === reg.activo) };
  });
}
function numPersonajes(){ return listaPersonajes().length; }
function hayHuecoLibre(){ return numPersonajes() < MAX_PERSONAJES; }

// Refresca el resumen del hueco activo (se llama al guardar). Lee del Estado
// vivo, así la lista siempre muestra lo último del personaje en juego.
function registrarResumenPersonaje(){
  _asegurarMigracion();
  if(typeof Estado === 'undefined') return;
  var reg = _leerRegistro();
  var id = reg.activo || 'p1';
  var j = Estado.jugador || {};
  // Sin nombre todavía (creación a medias): no registramos aún.
  if(!j.nombre) return;
  var dia = null;
  try { dia = (typeof diaJuegoActual === 'function') ? diaJuegoActual() : null; } catch(e){ dia = null; }
  reg.lista[id] = reg.lista[id] || { id:id };
  reg.lista[id].resumen = {
    nombre: j.nombre || 'Sin nombre',
    apellido1: j.apellido1 || '',
    creditos: Estado.creditos || 0,
    humano: Estado.humano || null,
    dia: dia,
    guardadoEn: Date.now()
  };
  _guardarRegistro(reg);
}

// Reserva un hueco nuevo y lo deja activo. Devuelve el id, o null si lleno.
function crearPersonajeSlot(){
  _asegurarMigracion();
  if(!hayHuecoLibre()) return null;
  var reg = _leerRegistro();
  var id = null;
  for(var i = 1; i <= MAX_PERSONAJES; i++){
    if(!reg.lista['p' + i]){ id = 'p' + i; break; }
  }
  if(!id) return null;
  reg.activo = id; // las claves del hueco aún no existen: la creación las llena
  _guardarRegistro(reg);
  return id;
}

// Cambia de personaje activo (para "jugar este").
function cambiarPersonajeSlot(id){
  _asegurarMigracion();
  var reg = _leerRegistro();
  if(!reg.lista[id]) return false;
  reg.activo = id;
  _guardarRegistro(reg);
  return true;
}

// Borra un personaje: sus 4 claves de hueco + su entrada en el registro.
function borrarPersonajeSlot(id){
  _asegurarMigracion();
  var reg = _leerRegistro();
  if(!reg.lista[id]) return false;
  _clavesBasePersonaje().forEach(function(base){ _lsDel(base + '__' + id); });
  delete reg.lista[id];
  // Si borramos el activo, dejamos activo otro que quede (o 'p1' por defecto).
  if(reg.activo === id){
    var quedan = Object.keys(reg.lista);
    reg.activo = quedan.length ? quedan[0] : 'p1';
  }
  _guardarRegistro(reg);
  return true;
}

if(typeof window !== 'undefined'){
  window.slotActivo = slotActivo;
  window.claveSlot = claveSlot;
  window.fijarSlotActivo = fijarSlotActivo;
  window.listaPersonajes = listaPersonajes;
  window.numPersonajes = numPersonajes;
  window.hayHuecoLibre = hayHuecoLibre;
  window.registrarResumenPersonaje = registrarResumenPersonaje;
  window.crearPersonajeSlot = crearPersonajeSlot;
  window.cambiarPersonajeSlot = cambiarPersonajeSlot;
  window.borrarPersonajeSlot = borrarPersonajeSlot;
  window.MAX_PERSONAJES = MAX_PERSONAJES;
}
