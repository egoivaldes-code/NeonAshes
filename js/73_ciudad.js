// BLOQUE JS-73 — ESTADO DE CIUDAD REACTIVO (v0.136)
// =================================================
// Las Pilas no es un decorado fijo: tiene un "humor" que cambia con el
// tiempo y con lo que hace el jugador. Este módulo SOLO mantiene y expone
// ese estado (y la notoriedad que lo inclina). Los EFECTOS (peligro de
// deriva, precios, cierres, ingresos) se enchufan en versiones posteriores
// leyendo estadoCiudad().
//
// Modelo:
//   Estado.ciudad = { estado, dia (ISO), notoriedad (0..100) }
// El estado se re-tira al cambiar de día. La notoriedad ("tu calor") la
// suben tus actos ruidosos e inclina las tiradas hacia redada/toque; se
// enfría sola con los días.
(function(){
  'use strict';

  // Catálogo de estados. 'calma' es el de base. Color para el rótulo.
  const ESTADOS = {
    calma: {
      id:'calma', nombre:'CALMA TENSA', color:'#7a8aa0',
      linea:'Las Pilas respira con su ruido de siempre. Nada fuera de lo normal. Que ya es decir.'
    },
    toque_queda: {
      id:'toque_queda', nombre:'TOQUE DE QUEDA', color:'#d9a441',
      linea:'HELIX ha decretado toque de queda. Drones bajos, calles medio vacías, y todo el que camina es sospechoso de algo.'
    },
    redada: {
      id:'redada', nombre:'REDADA DE HELIX', color:'#ff5470',
      linea:'Operativo de HELIX en marcha. Controles, registros, gente contra la pared. Hoy no es buen día para llamar la atención.'
    },
    apagon: {
      id:'apagon', nombre:'APAGÓN', color:'#5a6b8c',
      linea:'Medio distrito a oscuras. Anuncios muertos, puestos a tientas, generadores roncando. En lo oscuro todo cuesta más y vale otra cosa.'
    },
    disturbios: {
      id:'disturbios', nombre:'DISTURBIOS', color:'#ff7a33',
      linea:'Disturbios antisistema. Barricadas, humo, consignas contra HELIX rebotando entre los bloques. La calle es un polvorín.'
    }
  };

  function _diaISO(){
    return (typeof diaJuegoActual === 'function') ? diaJuegoActual() : null;
  }
  function _diffDias(isoA, isoB){
    const a = Date.parse(isoA), b = Date.parse(isoB);
    if(isNaN(a) || isNaN(b)) return 0;
    return Math.round((a - b) / 86400000);
  }

  function _asegurar(){
    if(typeof Estado === 'undefined') return null;
    if(!Estado.ciudad || typeof Estado.ciudad !== 'object'){
      Estado.ciudad = { estado:'calma', dia:_diaISO(), notoriedad:0 };
    }
    return Estado.ciudad;
  }

  // Tira un estado para el día. Calma domina; la notoriedad resta calma y
  // empuja sobre todo a la redada (tu calor atrae a HELIX) y al toque.
  function _tirarEstado(notoriedad){
    const k = Math.max(0, Math.min(100, notoriedad || 0)) / 100; // 0..1
    const pesos = {
      calma:       60 - 30 * k,
      redada:       5 + 22 * k,
      toque_queda:  6 + 10 * k,
      apagon:       9,               // depende del mundo, no de ti
      disturbios:   9 +  4 * k
    };
    let total = 0; for(const id in pesos) total += pesos[id];
    let r = Math.random() * total;
    for(const id in pesos){ r -= pesos[id]; if(r <= 0) return id; }
    return 'calma';
  }

  // Recalcula si ha cambiado el día: re-tira el estado y enfría la
  // notoriedad (−8 por día transcurrido). Idempotente dentro del mismo día.
  function _actualizar(){
    const c = _asegurar();
    if(!c) return null;
    const hoy = _diaISO();
    if(c.dia == null){ c.dia = hoy; c.estado = c.estado || 'calma'; return c; }
    if(hoy && hoy !== c.dia){
      const dias = Math.max(1, _diffDias(hoy, c.dia));
      c.notoriedad = Math.max(0, (c.notoriedad || 0) - 8 * dias);
      c.estado = _tirarEstado(c.notoriedad);
      c.dia = hoy;
      if(typeof guardarPartida === 'function') guardarPartida();
    }
    return c;
  }

  // ── API pública ────────────────────────────────────────────
  function estadoCiudad(){ const c = _actualizar(); return c ? c.estado : 'calma'; }
  function infoEstadoCiudad(){ const c = _actualizar(); return ESTADOS[(c && c.estado) || 'calma'] || ESTADOS.calma; }
  function notoriedadCiudad(){ const c = _asegurar(); return c ? (c.notoriedad || 0) : 0; }
  function subirNotoriedad(n){
    const c = _asegurar();
    if(!c) return;
    c.notoriedad = Math.max(0, Math.min(100, (c.notoriedad || 0) + (n || 0)));
  }
  // Fuerza una re-tirada (uso futuro: un acto puede precipitar un estado).
  function forzarEstadoCiudad(id){
    const c = _asegurar();
    if(!c || !ESTADOS[id]) return;
    c.estado = id; c.dia = _diaISO();
    if(typeof guardarPartida === 'function') guardarPartida();
  }

  // ── Modificadores por estado ───────────────────────────────
  // Un único sitio del que leen TODOS los sistemas (deriva, mercado,
  // oficios). Valores conservadores: se notan, no frustran. (v0.136)
  //   peligroDeriva → multiplica la prob. de confrontación en deriva
  //   precioCompra/precioVenta → multiplican precios del mercado
  //   mercadoCerrado → el mercado en persona baja la persiana hoy
  //   clandestinoCerrado → los Niveles Bajos cierran hoy
  //   ingresoOficio → multiplica los créditos de trabajar
  function modificadoresCiudad(){
    const e = estadoCiudad();
    const m = {
      estado: e,
      peligroDeriva: 1.0,
      precioCompra: 1.0,
      precioVenta: 1.0,
      mercadoCerrado: false,
      clandestinoCerrado: false,
      ingresoOficio: 1.0
    };
    if(e === 'toque_queda'){
      m.peligroDeriva = 1.4;   // controles por todas partes
      m.ingresoOficio = 0.8;   // calles vacías, menos curro
      m.precioCompra = 1.1;    // escasez leve
    } else if(e === 'redada'){
      m.peligroDeriva = 1.6;   // HELIX peinando el distrito
      m.clandestinoCerrado = true; // el clandestino no abre con HELIX fuera
      m.ingresoOficio = 0.85;
    } else if(e === 'apagon'){
      m.peligroDeriva = 1.3;   // a oscuras todo es más peligroso
      m.precioCompra = 1.2;    // escasea, sube
      m.precioVenta = 1.1;     // pero pagan algo más por lo justo
    } else if(e === 'disturbios'){
      m.peligroDeriva = 1.7;   // la calle arde
      m.precioCompra = 1.15;
      m.ingresoOficio = 0.7;   // nadie trabaja en plena revuelta
      m.mercadoCerrado = true; // los puestos echan el cierre
    }
    return m;
  }

  if(typeof window !== 'undefined'){
    window.estadoCiudad = estadoCiudad;
    window.infoEstadoCiudad = infoEstadoCiudad;
    window.notoriedadCiudad = notoriedadCiudad;
    window.subirNotoriedad = subirNotoriedad;
    window.forzarEstadoCiudad = forzarEstadoCiudad;
    window.modificadoresCiudad = modificadoresCiudad;
    window.ESTADOS_CIUDAD = ESTADOS;
  }
})();
