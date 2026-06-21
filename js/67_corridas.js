// ============================================================
//  NEON ASHES — CORRIDAS (v0.108)
//  Motor COMPARTIDO de dos profesiones espejo:
//    · contrabandista  (bando 'contrabando')  — mover mercancía
//    · seguridad        (bando 'seguridad')    — operativo de HELIX
//
//  Inspirado en el loop de "Path of Adventure": un CAMINO de nodos
//  que se recorre uno a uno gestionando recursos escasos. No hay
//  arcade: cada nodo es una decisión, y el "combate" es ELEGIR LA
//  HERRAMIENTA con la que respondes a una amenaza.
//
//  FLUJO DE UNA CORRIDA:
//   1) El jugador acepta una corrida del tablón (datos en 68).
//   2) Recorre 'nodos' en orden pulsando AVANZAR. Tipos de nodo:
//        confrontacion — una amenaza declara intención; eliges con
//                        QUÉ respondes. Las opciones se construyen al
//                        vuelo según el EQUIPO que llevas encima
//                        (inventario general, js/40_items.js).
//        obstaculo     — un control/puerta/atasco. Vía cara (créditos)
//                        o vía dura (forzar, +alerta).
//        encuentro     — un NPC ofrece un trato (aceptar o seguir).
//        bifurcacion   — ruta rápida (riesgo/+botín) vs limpia.
//        desenlace     — entregar/cerrar. Paga + progreso de profesión.
//   3) La ALERTA del distrito sube con cada acción ruidosa; alerta
//      alta empeora las intenciones de los nodos siguientes.
//   4) Si tu INTEGRIDAD llega a 0 → te detienen/hieren: corrida
//      fallida, sin paga, y baja de progreso. (No es muerte real.)
//
//  CONFRONTACIÓN — tres vías FÍSICAS según equipo:
//    DISPARAR   requiere un arma de fuego + munición suelta en el
//               inventario. Cada pistola tiene su daño y su gasto de
//               munición por disparo (casera 1, reglamentaria 2, cañón 3).
//               Muy ruidoso. Sin munición suficiente: la opción se cae
//               (queda AMENAZAR, un farol que puede fallar).
//    ACUCHILLAR requiere arma_blanca. Fuerza media, silencioso, pero
//               cuerpo a cuerpo (más fácil que te hieran).
//    PUÑOS      siempre disponible. Fuerza baja, sin gasto, silencioso.
//    + opciones no físicas según item: justificarte (credencial/papel),
//      sobornar (créditos), distraer (señuelo).
//
//  La MUNICIÓN es un item suelto del inventario ('municion'): se compra de
//  una en una y disparar la consume directamente. No hay cargador ni paso
//  de recarga. Las armas mejores pegan más pero gastan más balas por tiro.
//
//  El contenido (corridas, nodos, textos) vive en js/68_corrida_datos.js
//  y es hand-authored y propio de cada bando (no espejo mecánico).
// ============================================================

(function(){
  'use strict';

  // ── helpers defensivos ──────────────────────────────────
  function _fx(clave, vol){ if(typeof reproducirFX === 'function') reproducirFX(clave, vol); }
  function _lleva(id){ return (typeof tieneItem === 'function') ? tieneItem(id) : false; }

  // Nombre legible de un item (para mensajes). Cae al id si no se halla.
  function _nombreItem(id){
    if(typeof ITEMS_EXPEDICION !== 'undefined' && Array.isArray(ITEMS_EXPEDICION)){
      const it = ITEMS_EXPEDICION.find(x => x.id === id);
      if(it && it.nombre) return it.nombre.toLowerCase();
    }
    return id.replace(/_/g, ' ');
  }

  // Descuenta un turno a cada estado temporal activo; elimina los agotados.
  function _ticEstados(){
    Object.keys(_estados).forEach(k => {
      _estados[k]--;
      if(_estados[k] <= 0) delete _estados[k];
    });
  }
  function _guardar(){ if(typeof guardarPartida === 'function') guardarPartida(); }
  function _creditos(){ return (typeof Estado === 'object' && typeof Estado.creditos === 'number') ? Estado.creditos : 0; }
  function _cobrar(n){ if(typeof Estado === 'object' && typeof Estado.creditos === 'number'){ Estado.creditos = Math.max(0, Estado.creditos - n); } }
  function _rango(profId){ return (typeof rangoActualProfesion === 'function') ? rangoActualProfesion(profId) : 0; }

  // ── DESGASTE DE ARMAS ───────────────────────────────────
  // Las armas físicas se gastan con el uso y acaban rompiéndose. El
  // desgaste se guarda como nº de usos en Estado.memoria.armaDesgaste,
  // así no tocamos la estructura del inventario. Al alcanzar 'rompe',
  // el arma se quita del inventario (desaparece).
  //   tramos: usos hasta cada estado. < gastada = operativa.
  const ARMA_DESGASTE = {
    arma_blanca: { gastada: 3, comprometida: 6, rompe: 8,
      nombreCorto: 'el cuchillo' },
    arma_fuego:  { gastada: 5, comprometida: 9, rompe: 12,
      nombreCorto: 'la pistola' },
    // La reglamentaria es material HELIX: más robusta. El cañón del Ferro
    // pega como una mula pero es una chapuza: se castiga rápido.
    arma_fuego_regl:  { gastada: 6, comprometida: 11, rompe: 14,
      nombreCorto: 'la reglamentaria' },
    arma_fuego_canon: { gastada: 4, comprometida: 7, rompe: 9,
      nombreCorto: 'el cañón de mano' }
  };

  // ── ARMAS DE FUEGO ──────────────────────────────────────
  // Cada pistola tiene su pegada (fuerza, para superar el umbral del
  // enemigo), su daño por impacto sólido, su gasto de munición POR DISPARO
  // (la munición es item suelto del inventario) y su ruido. Las mejores
  // pegan más pero se comen más balas de golpe.
  const ARMAS_FUEGO = {
    arma_fuego:       { fuerza: 6,  dano: 2, gastoBala: 1, ruido: 35, nombreCorto: 'la pistola' },
    arma_fuego_regl:  { fuerza: 8,  dano: 3, gastoBala: 2, ruido: 45, nombreCorto: 'la reglamentaria' },
    arma_fuego_canon: { fuerza: 11, dano: 4, gastoBala: 3, ruido: 60, nombreCorto: 'el cañón de mano' }
  };
  // Mejor pistola que lleva ahora mismo (la de más daño), o null.
  function _armaFuegoEquipada(){
    const orden = ['arma_fuego_canon', 'arma_fuego_regl', 'arma_fuego'];
    for(let i = 0; i < orden.length; i++){ if(_lleva(orden[i])) return orden[i]; }
    return null;
  }
  // Munición suelta que llevas en el inventario.
  function _municion(){ return (typeof contarItem === 'function') ? contarItem('municion') : 0; }

  function _desgasteMapa(){
    Estado.memoria = Estado.memoria || {};
    Estado.memoria.armaDesgaste = Estado.memoria.armaDesgaste || {};
    return Estado.memoria.armaDesgaste;
  }
  function _usosArma(id){ return _desgasteMapa()[id] || 0; }
  function _estadoArma(id){
    const cfg = ARMA_DESGASTE[id];
    if(!cfg) return null;
    const u = _usosArma(id);
    if(u >= cfg.comprometida) return 'comprometida';
    if(u >= cfg.gastada) return 'gastada';
    return 'operativa';
  }
  function _etiquetaEstadoArma(id){
    const e = _estadoArma(id);
    if(e === 'comprometida') return ' · comprometida';
    if(e === 'gastada') return ' · gastada';
    return '';
  }
  // Suma un uso al arma. Devuelve un texto si el arma se ha roto o ha
  // cambiado de estado, para avisar al jugador; si no, ''.
  function _gastarArma(id){
    const cfg = ARMA_DESGASTE[id];
    if(!cfg) return '';
    const mapa = _desgasteMapa();
    const antes = _estadoArma(id);
    mapa[id] = (mapa[id] || 0) + 1;
    // ¿Se rompe?
    if(mapa[id] >= cfg.rompe){
      if(typeof quitarItem === 'function') quitarItem(id, 1);
      delete mapa[id]; // si vuelve a conseguir una, empieza de cero
      _fx('impacto', 0.5);
      return (cfg.nombreCorto.charAt(0).toUpperCase() + cfg.nombreCorto.slice(1))
        + ' se rompe en las manos. Inservible. La sueltas.';
    }
    const despues = _estadoArma(id);
    if(despues !== antes){
      if(despues === 'comprometida') return cfg.nombreCorto.charAt(0).toUpperCase() + cfg.nombreCorto.slice(1) + ' está comprometida: aguantará poco más.';
      if(despues === 'gastada') return 'Notas ' + cfg.nombreCorto + ' más gastada que antes.';
    }
    return '';
  }

  // ── estado de la corrida en curso ───────────────────────
  let _corrida = null;     // objeto de la corrida activa (de 68)
  let _bando = null;       // 'contrabando' | 'seguridad'
  let _profId = null;      // id de la profesión asociada al bando
  let _nodoIdx = 0;        // (compat) índice en corridas de formato lineal
  let _nodoActual = null;  // id del nodo actual en el grafo
  let _grafo = null;       // { inicio, nodos:{id:{...}} } construido al aceptar
  let _eventosUsados = [];  // ids de eventos aleatorios ya gastados en esta corrida
  let _pasosDados = 0;      // nº de transiciones, para ritmo de eventos
  let _run = null;          // mochila de recursos de la corrida (botín, carga…)
  let _integridad = 0;     // vida de la corrida
  let _integridadMax = 0;
  let _alerta = 0;         // 0..100, presión creciente del distrito
  let _botin = 0;          // créditos acumulados durante la corrida (bonus)
  let _armadura = null;    // { id, reduccion, aguante, golpes } o null
  let _estados = {};       // estados temporales: { nombre: turnosRestantes }
  let _volverA = 'apartamento';
  let _enConfrontacion = null;  // datos de la amenaza actual, o null
  let _modoLibre = false;       // true = deriva libre (explorar), no corrida

  // Catálogo de armaduras conocido por el motor (espejo de 40_items.js).
  // El motor no depende de que el item exista, pero usa estos valores.
  const ARMADURAS = {
    chaqueta_kevlar: { reduccion: 1, aguante: 10 },
    placa_helix:     { reduccion: 2, aguante: 14 },
    abrigo_trapero:  { reduccion: 1, aguante: 12, sigilo: true }
  };

  // ── parámetros de bando ─────────────────────────────────
  // Cada bando nombra sus cosas distinto, pero la mecánica es idéntica.
  const BANDOS = {
    contrabando: {
      profId: 'contrabandista',
      tablonTitulo: 'RUTAS DISPONIBLES',
      tablonSub: 'Mercancía que mover y nadie que pregunte. Si llegas, cobras. Si te cogen, no.',
      etiquetaIntegridad: 'INTEGRIDAD',
      etiquetaAlerta: 'PRESIÓN',
      desenlaceOk: 'ENTREGA LIMPIA',
      desenlaceFallo: 'TE COGIERON',
      itemSocial: 'papel_helix',     // documentación falsa para justificarte
      requiereItem: null              // cualquiera puede contrabandear
    },
    seguridad: {
      profId: 'seguridad',
      tablonTitulo: 'OPERACIONES ABIERTAS',
      tablonSub: 'HELIX firma la orden. Tú la ejecutas. Lo que pase en el camino no figura en el informe.',
      etiquetaIntegridad: 'INTEGRIDAD',
      etiquetaAlerta: 'RUIDO',
      desenlaceOk: 'OPERACIÓN CERRADA',
      desenlaceFallo: 'OPERACIÓN FALLIDA',
      itemSocial: 'credencial_helix', // la placa: justificarte = autoridad
      requiereItem: 'credencial_helix'
    },
    // DERIVA LIBRE (explorar la ciudad). No es una profesión: no tiene
    // tablón, ni paga, ni progreso. Solo reusa el motor para deambular.
    deriva: {
      profId: null,
      tablonTitulo: 'LAS PILAS',
      tablonSub: 'Sin destino. Sin nadie esperándote. Solo la calle y lo que traiga.',
      etiquetaIntegridad: 'CUERPO',
      etiquetaAlerta: 'TENSIÓN',
      desenlaceOk: 'VUELVES',
      desenlaceFallo: 'NO VUELVES',
      itemSocial: 'papel_helix',
      requiereItem: null
    }
  };

  // ============================================================
  //  ENTRADA: abrir el tablón de la profesión
  // ============================================================
  function abrirCorrida(volverA, bando){
    _bando = (bando === 'seguridad') ? 'seguridad' : 'contrabando';
    _profId = BANDOS[_bando].profId;
    _volverA = volverA || 'apartamento';
    if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
    if(typeof saltoDeEscena === 'function') saltoDeEscena();
    const desde = document.querySelector('.escena.activa');
    const idDesde = desde ? desde.id : _volverA;
    if(typeof cambiarEscena === 'function'){
      cambiarEscena(idDesde, 'corrida-escena');
    } else {
      if(desde) desde.classList.remove('activa');
      const e = document.getElementById('corrida-escena');
      if(e) e.classList.add('activa');
    }
    if(_corrida) _pintarNodo();
    else { _fx('panel_abrir', 0.5); _pintarTablon(); }
    return true;
  }

  // ── helpers de "ya hecha" (persistencia por id) ──────────
  function _hecha(id){
    return !!(Estado.memoria && Estado.memoria.corridasHechas && Estado.memoria.corridasHechas[id]);
  }
  function _marcarHecha(id){
    Estado.memoria = Estado.memoria || {};
    Estado.memoria.corridasHechas = Estado.memoria.corridasHechas || {};
    Estado.memoria.corridasHechas[id] = true;
  }

  // ── catálogo del bando actual ───────────────────────────
  function _catalogo(){
    if(typeof CORRIDAS_DATOS === 'undefined') return [];
    return (CORRIDAS_DATOS[_bando] || []).slice();
  }

  // ============================================================
  //  TABLÓN
  // ============================================================
  function _pintarTablon(){
    const cont = document.getElementById('corrida-wrap');
    if(!cont) return;
    const cfg = BANDOS[_bando];
    const rango = _rango(_profId);
    const ctx = 'corrida_' + _bando;
    let html = (typeof barraFiltrosTablon === 'function')
      ? barraFiltrosTablon(ctx, '← DEJARLO POR HOY', 'cerrarCorrida()', 'repintarTablonCorrida')
      : '';
    html += '<div class="casos-cab"><div class="casos-titulo">' + cfg.tablonTitulo + '</div>'
      + '<div class="casos-sub">' + cfg.tablonSub + '</div></div>';
    html += '<div class="casos-lista">';
    const ordenadas = _catalogo().sort((a, b) =>
         (a.rangoMin || 0) - (b.rangoMin || 0)
      || (a.peligro  || 0) - (b.peligro  || 0)
      || (a.pagaBase || 0) - (b.pagaBase || 0)
    );
    let mostradas = 0;
    ordenadas.forEach(c => {
      const bloqueadoRango = (c.rangoMin || 0) > rango;
      const yaHecha = _hecha(c.id);
      if(typeof pasaFiltrosTablon === 'function'
         && !pasaFiltrosTablon(ctx, { bloqueadoRango: bloqueadoRango, yaHecha: yaHecha })){
        return;
      }
      mostradas++;
      const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
      let estado = yaHecha ? '<span class="casos-hecho">CERRADA</span>' : '';
      html += '<div class="caso-card' + (bloqueadoRango ? ' caso-bloq' : '') + '">'
        + '<div class="caso-card-top"><span class="caso-titulo">' + c.titulo + '</span>' + estado + '</div>'
        + '<div class="caso-contratante">' + (c.cliente || '') + '</div>'
        + '<div class="caso-resumen">' + c.resumen + '</div>'
        + '<div class="caso-meta"><span class="caso-peligro">PELIGRO ' + peligro + '</span>'
        + '<span class="caso-paga">≈ ' + (c.pagaBase || 0) + ' CR</span></div>';
      if(bloqueadoRango){
        html += '<div class="caso-nota">Necesitas más reputación para esto.</div>';
      } else if(yaHecha){
        html += '<div class="caso-nota">Ya la hiciste una vez.</div>';
      } else {
        html += '<button class="btn-terminal caso-aceptar" onclick="aceptarCorrida(\'' + c.id + '\')">EMPRENDER →</button>';
      }
      html += '</div>';
    });
    if(mostradas === 0 && typeof avisoTablonVacio === 'function'){
      html += avisoTablonVacio(ctx);
    }
    html += '</div>';
    cont.innerHTML = html;
  }

  // ============================================================
  //  ACEPTAR Y RECORRER
  // ============================================================
  function aceptarCorrida(id){
    const c = _catalogo().find(x => x.id === id);
    if(!c) return;
    _modoLibre = false;   // una corrida normal nunca es deriva libre
    _fx('inv_papel', 0.55);
    _corrida = c;
    _nodoIdx = 0;
    _integridadMax = c.integridad || 12;
    _integridad = _integridadMax;
    _alerta = c.alertaInicial || 0;
    _botin = 0;
    _enConfrontacion = null;
    // Armadura: equipas la mejor que lleves (mayor reducción). Se desgasta.
    _armadura = null;
    Object.keys(ARMADURAS).forEach(aid => {
      if(_lleva(aid)){
        const a = ARMADURAS[aid];
        if(!_armadura || a.reduccion > _armadura.reduccion){
          _armadura = { id: aid, reduccion: a.reduccion, aguante: a.aguante, golpes: 0, sigilo: !!a.sigilo };
        }
      }
    });
    // Estados temporales (adrenalina, herido, etc.): vacíos al empezar.
    _estados = {};
    // Grafo + mochila de recursos de la corrida.
    _grafo = _construirGrafo(c);
    _nodoActual = _grafo.inicio;
    _eventosUsados = [];
    _pasosDados = 0;
    _run = {
      botin: [],              // hallazgos recogidos (se cobran al llegar)
      carga: 0,               // bultos pesados acumulados
      destinoPendiente: null, // a dónde ir tras un evento
      eventoActual: null
    };
    // Munición: balas sueltas en el inventario (item 'municion'). No hay
    // cargador ni recarga: disparar consume munición directamente.
    Estado.memoria = Estado.memoria || {};
    _guardar();
    _pintarNodo();
  }

  // ── barra de estado de la corrida (HUD superior) ─────────
  function _hud(){
    const cfg = BANDOS[_bando];
    const corazones = '♦'.repeat(Math.max(0, _integridad)) + '·'.repeat(Math.max(0, _integridadMax - _integridad));
    const nivelAlerta = _alerta >= 70 ? 'alerta-alta' : (_alerta >= 35 ? 'alerta-media' : 'alerta-baja');
    let balasTxt = '';
    if(_armaFuegoEquipada()){
      balasTxt = '<span class="corrida-hud-balas">MUNICIÓN ' + _municion() + '</span>';
    }
    // Armadura equipada (con su desgaste) y estados temporales activos.
    let armaduraTxt = '';
    if(_armadura){
      const restante = Math.max(0, _armadura.aguante - _armadura.golpes);
      armaduraTxt = '<span class="corrida-hud-armadura" title="Armadura: reduce daño">'
        + 'BLINDAJE ' + restante + '</span>';
    }
    const nombresEstado = { estimulado:'ESTIMULADO', tembloroso:'TEMBLOROSO', inhibido:'SIN DOLOR' };
    let estadosTxt = '';
    Object.keys(_estados).forEach(k => {
      if(_estados[k] > 0 && nombresEstado[k]){
        estadosTxt += '<span class="corrida-hud-estado">' + nombresEstado[k] + '·' + _estados[k] + '</span>';
      }
    });
    return '<div class="corrida-hud">'
      + '<span class="corrida-hud-vida" title="' + cfg.etiquetaIntegridad + '">' + cfg.etiquetaIntegridad + ' ' + corazones + '</span>'
      + balasTxt
      + armaduraTxt
      + '<span class="corrida-hud-alerta ' + nivelAlerta + '">' + cfg.etiquetaAlerta + ' ' + _alerta + '%</span>'
      + estadosTxt
      + '</div>';
  }

  // ── GRAFO DE NODOS ──────────────────────────────────────
  // Construye el grafo de la corrida. Soporta dos formatos:
  //  · NUEVO: c.mapa = { inicio:'id', nodos:{ id:{...} } } con enlaces 'ir'.
  //  · VIEJO: c.nodos = [n0,n1,...] → se lineariza (n0→n1→…→fin).
  // Cada nodo del grafo final lleva un id y sus enlaces resueltos.
  function _construirGrafo(c){
    if(c.mapa && c.mapa.nodos){
      // Clonado superficial para no mutar el catálogo original.
      const nodos = {};
      Object.keys(c.mapa.nodos).forEach(id => {
        nodos[id] = Object.assign({}, c.mapa.nodos[id], { _id: id });
      });
      return { inicio: c.mapa.inicio, nodos: nodos };
    }
    // Linealizar el formato viejo.
    const lista = c.nodos || [];
    const nodos = {};
    lista.forEach((n, i) => {
      const id = 'n' + i;
      const copia = Object.assign({}, n, { _id: id });
      if(i < lista.length - 1){ copia.ir = 'n' + (i + 1); }
      else { copia.fin = true; }
      nodos[id] = copia;
    });
    return { inicio: lista.length ? 'n0' : null, nodos: nodos };
  }

  function _nodoPorId(id){
    return (_grafo && _grafo.nodos && id) ? _grafo.nodos[id] : null;
  }

  // ── EVENTOS ALEATORIOS INTERCALADOS ─────────────────────
  // Entre nodo y nodo, con cierta probabilidad, se cuela un evento de la
  // reserva EVENTOS_CORRIDA[bando] (definida en 68). No se repiten en la
  // misma corrida. Devuelve un nodo-evento o null.
  function _quizaEvento(){
    const reserva = (typeof EVENTOS_CORRIDA === 'object' && EVENTOS_CORRIDA && EVENTOS_CORRIDA[_bando])
      ? EVENTOS_CORRIDA[_bando] : null;
    if(!reserva || !reserva.length) return null;
    // Probabilidad base 35%, sube con la alerta (hasta ~60%). No en el 1er paso.
    if(_pasosDados < 1) return null;
    const prob = 0.35 + Math.min(0.25, _alerta / 400);
    if(Math.random() > prob) return null;
    // Elegir uno no usado.
    const libres = reserva.filter(e => _eventosUsados.indexOf(e.id) < 0);
    if(!libres.length) return null;
    const ev = libres[Math.floor(Math.random() * libres.length)];
    _eventosUsados.push(ev.id);
    return ev;
  }

  // Navega a un nodo del grafo. Si 'idDestino' es null/indefinido → desenlace.
  // Antes de entrar al destino, puede intercalar un evento aleatorio: en ese
  // caso se entra al evento y el evento, al resolverse, continúa al destino
  // real guardado en _run.destinoPendiente.
  function _irANodo(idDestino, saltarEvento){
    _enConfrontacion = null;
    if(!idDestino){ _resolverDesenlace(true); return; }
    _pasosDados++;
    if(!saltarEvento){
      const ev = _quizaEvento();
      if(ev){
        // Guardamos a dónde íbamos; el evento nos devolverá aquí.
        _run.destinoPendiente = idDestino;
        _nodoActual = '__evento__';
        _run.eventoActual = ev;
        _guardar();
        _pintarEvento(ev);
        return;
      }
    }
    _nodoActual = idDestino;
    _guardar();
    _pintarNodo();
  }

  // ── avanzar / pintar el nodo actual ─────────────────────
  function _pintarNodo(){
    const cont = document.getElementById('corrida-wrap');
    if(!cont || !_corrida) return;

    // ¿Caíste?
    if(_integridad <= 0){
      _resolverDesenlace(false);
      return;
    }

    const nodo = _nodoPorId(_nodoActual);
    // Sin nodo válido o nodo final → desenlace de éxito.
    if(!nodo || nodo.fin){
      _resolverDesenlace(true);
      return;
    }

    // Si el nodo es una confrontación y aún no la hemos montado, montarla.
    const confronYaActiva = nodo.tipo === 'confrontacion' && _enConfrontacion;
    if(nodo.tipo === 'confrontacion' && !_enConfrontacion){
      _montarConfrontacion(nodo);
    }

    let html = _hud();
    // El texto de intro del nodo solo en el primer pintado (no en cada turno
    // de una confrontación ya en curso).
    if(!confronYaActiva){
      html += '<div class="corrida-narr">' + (nodo.texto || '') + '</div>';
    }

    if(nodo.tipo === 'confrontacion'){
      html += _pintarOpcionesConfrontacion();
    } else if(nodo.tipo === 'obstaculo'){
      html += _pintarObstaculo(nodo);
    } else if(nodo.tipo === 'encuentro'){
      html += _pintarEncuentro(nodo);
    } else if(nodo.tipo === 'bifurcacion'){
      html += _pintarBifurcacion(nodo);
    } else if(nodo.tipo === 'hallazgo'){
      html += _pintarHallazgo(nodo);
    } else {
      // nodo narrativo simple
      html += '<button class="btn-terminal" onclick="avanzarCorrida()">AVANZAR →</button>';
    }

    // Curarse con un kit de trauma: disponible fuera de combate si llevas
    // uno y no estás a tope de integridad. Es el "respiro" entre peleas.
    if(nodo.tipo !== 'confrontacion' && _lleva('kit_trauma') && _integridad < _integridadMax){
      html += '<button class="btn-terminal corrida-curar" '
        + 'onclick="curarseEnCorrida()">USAR KIT DE TRAUMA (recuperar integridad)</button>';
    }

    // Opción de RETIRARSE: disponible en nodos que no sean confrontación
    // (no es un escape de un mal turno) y tras haber dado al menos un paso.
    if(nodo.tipo !== 'confrontacion' && _pasosDados > 0){
      html += '<button class="btn-terminal corrida-retirarse" '
        + 'onclick="retirarseCorrida()">ABORTAR Y RETIRARTE</button>';
    }

    cont.innerHTML = html;
  }

  // ── avanzar al siguiente nodo (sigue el enlace 'ir') ────
  function avanzarCorrida(){
    if(_modoLibre){
      if(_muertoDeVerdad()) return;
      _pintarInterludioDeriva();
      return;
    }
    if(!_corrida) return;
    // Si veníamos de un evento (p.ej. confrontación imprevista), continuar
    // al destino que teníamos pendiente, sin encadenar otro evento.
    if(_nodoActual === '__evento__'){
      _irANodo(_run ? _run.destinoPendiente : null, true);
      return;
    }
    const nodo = _nodoPorId(_nodoActual);
    _irANodo(nodo ? nodo.ir : null);
  }

  // ============================================================
  //  CONFRONTACIÓN TÁCTICA — varios enemigos, elegir objetivo,
  //  refuerzos (guionizados y dinámicos por ruido). Compatible con
  //  el formato antiguo de 1 enemigo (campos fuerza/umbral/etc.).
  // ============================================================

  // Monta la confrontación. Si el nodo trae 'enemigos:[...]', modo grupo.
  // Si no, fabrica un grupo de 1 desde los campos antiguos (compat).
  function _montarConfrontacion(nodo){
    let enemigos;
    if(Array.isArray(nodo.enemigos) && nodo.enemigos.length){
      enemigos = nodo.enemigos.map((e, i) => _crearEnemigo(e, i));
    } else {
      enemigos = [ _crearEnemigo({
        nombre: nodo.nombreEnemigo || 'Amenaza',
        integridad: 1,                // el modelo viejo se resolvía en 1 golpe
        fuerza: nodo.fuerza || 3,
        umbral: nodo.umbral || 3,
        ruidoExtra: nodo.ruidoExtra || 0
      }, 0) ];
    }
    _enConfrontacion = {
      enemigos: enemigos,
      turno: 0,
      escapado: false,
      // refuerzos dinámicos: si la alerta llega a 'refuerzoSiRuido' y aún
      // no han venido, entran 'refuerzoGrupo' enemigos nuevos.
      refuerzoSiRuido: nodo.refuerzoSiRuido || 0,
      refuerzoGrupo: nodo.refuerzoGrupo || null,
      refuerzosLlegaron: false,
      // refuerzos guionizados: en el turno N entran 'refuerzoTurnoGrupo'.
      refuerzoTurno: nodo.refuerzoTurno || 0,
      refuerzoTurnoGrupo: nodo.refuerzoTurnoGrupo || null,
      refuerzoTurnoHecho: false,
      ultimoMsg: ''
    };
    if(_alerta >= 70){ // alerta alta: todos pegan un poco más fuerte
      _enConfrontacion.enemigos.forEach(e => { e.fuerza += 1; });
    }
  }

  function _crearEnemigo(def, idx){
    const integridad = def.integridad || 1;
    // Mordida por rango: las corridas de rango alto pegan más fuerte, para
    // que de verdad asusten. Rango 0-1 sin cambios; r2 +1 fuerza; r3 +2.
    const rango = (_corrida && typeof _corrida.rangoMin === 'number') ? _corrida.rangoMin : 0;
    const bonusFuerza = rango >= 3 ? 1 : 0;
    return {
      uid: 'e' + idx + '_' + Math.floor(Math.random() * 100000),
      nombre: def.nombre || 'Enemigo',
      desc: def.desc || '',
      integridad: integridad,
      integridadMax: integridad,
      fuerza: (def.fuerza || 3) + bonusFuerza,  // daño que te hace al responder
      umbral: def.umbral || 3,     // fuerza tuya para dañarle de forma notable
      vivo: true
    };
  }

  function _enemigosVivos(){
    if(!_enConfrontacion) return [];
    return _enConfrontacion.enemigos.filter(e => e.vivo);
  }

  // Construye opciones DISPONIBLES leyendo el inventario, y si hay más de
  // un enemigo vivo, primero pide ELEGIR OBJETIVO.
  function _pintarOpcionesConfrontacion(){
    const cf = _enConfrontacion;
    const vivos = _enemigosVivos();

    let html = '';

    // Estado del grupo enemigo.
    html += '<div class="corrida-enemigos">';
    vivos.forEach(e => {
      const barra = '▮'.repeat(Math.max(0, e.integridad)) + '▯'.repeat(Math.max(0, e.integridadMax - e.integridad));
      html += '<div class="corrida-enemigo' + (cf._objetivo === e.uid ? ' corrida-enemigo-sel' : '') + '">'
        + '<span class="corrida-enemigo-nom">' + e.nombre + '</span>'
        + '<span class="corrida-enemigo-vida">' + barra + '</span></div>';
    });
    html += '</div>';

    // Si hay más de un enemigo y no hay objetivo elegido, elegir objetivo.
    if(vivos.length > 1 && !cf._objetivo){
      html += '<div class="corrida-narr corrida-narr-sub">¿A quién vas?</div>';
      html += '<div class="corrida-ops">';
      vivos.forEach(e => {
        html += '<button class="btn-terminal corrida-op corrida-op-objetivo" '
          + 'onclick="elegirObjetivoCorrida(\'' + e.uid + '\')">'
          + '<span class="corrida-op-txt">' + e.nombre.toUpperCase() + '</span>'
          + (e.desc ? '<span class="corrida-op-sub">' + e.desc + '</span>' : '')
          + '</button>';
      });
      html += '</div>';
      return html;
    }

    // Objetivo fijado (o solo queda uno): mostrar las vías.
    const objetivo = vivos.length === 1 ? vivos[0] : vivos.find(e => e.uid === cf._objetivo);
    const nomObj = objetivo ? objetivo.nombre : 'el enemigo';
    if(vivos.length > 1){
      html += '<div class="corrida-narr corrida-narr-sub">Atacas a <b>' + nomObj + '</b>. '
        + '<a class="corrida-cambiar-obj" onclick="elegirObjetivoCorrida(\'\')">(cambiar)</a></div>';
    }

    html += '<div class="corrida-ops">';

    // ── VÍA DISPAROS ──
    const _idArmaF = _armaFuegoEquipada();
    if(_idArmaF){
      const _af = ARMAS_FUEGO[_idArmaF];
      const _muni = _municion();
      if(_muni >= _af.gastoBala){
        const _gastoTxt = _af.gastoBala === 1 ? 'gasta 1 munición' : ('gasta ' + _af.gastoBala + ' munición');
        html += _op('disparar', 'DISPARAR',
          'Daño ' + _af.dano + ' · ' + _gastoTxt + ' · mucho ruido' + _etiquetaEstadoArma(_idArmaF),
          'corrida-op-fuego');
      } else {
        html += _op('amenazar', 'AMENAZAR CON EL ARMA',
          (_muni > 0 ? 'No te llega la munición para un disparo. ' : 'Sin munición. ')
            + 'Un farol: puede que recule, puede que no',
          'corrida-op-farol');
      }
    }

    // ── VÍA ARMA BLANCA ──
    if(_lleva('arma_blanca')){
      html += _op('acuchillar', 'ACUCHILLAR',
        'Fuerza media · silencioso · de cerca (arriesgas piel)' + _etiquetaEstadoArma('arma_blanca'),
        'corrida-op-blanca');
    }

    // ── VÍA PUÑOS (siempre) ──
    html += _op('punos', 'A PUÑOS',
      'Fuerza baja · sin gasto · silencioso · lento',
      'corrida-op-punos');

    // ── VÍA CURARSE (si llevas kit y estás herido) ──
    // No atacas este turno, pero ganas integridad. Los enemigos responden.
    if(_lleva('kit_trauma') && _integridad < _integridadMax){
      html += _op('curar', 'USAR KIT DE TRAUMA',
        'Recuperas integridad · no atacas (te responden)',
        'corrida-op-util');
    }
    if(_lleva('estimulante')){
      html += _op('estimulante', 'ESTIMULANTE DE COMBATE',
        '+fuerza unos turnos · no atacas este turno', 'corrida-op-util');
    }
    if(_lleva('adrenalina')){
      html += _op('adrenalina', 'PARCHE DE ADRENALINA',
        'Curación rápida pequeña · luego pulso tembloroso', 'corrida-op-util');
    }
    if(_lleva('inhibidor_dolor')){
      html += _op('inhibidor', 'INHIBIDOR DE DOLOR',
        'Ignoras el próximo golpe · no atacas este turno', 'corrida-op-util');
    }
    if(_lleva('granada_humo')){
      html += _op('humo', 'BOTE DE HUMO',
        'Escapas del combate sin herir a nadie', 'corrida-op-util');
    }

    // ── OPCIONES NO FÍSICAS según item (afectan a TODO el grupo) ──
    const cfg = BANDOS[_bando];
    if(_lleva(cfg.itemSocial)){
      const etiqueta = (_bando === 'seguridad') ? 'IMPONER AUTORIDAD' : 'JUSTIFICARTE';
      const sub = (_bando === 'seguridad')
        ? 'Enseñar la placa. Si cuela, se dispersan todos'
        : 'Enseñar la documentación. Si cuela, te dejan pasar';
      html += _op('justificar', etiqueta, sub, 'corrida-op-social');
    }
    if(_creditos() >= 40){
      html += _op('sobornar', 'SOBORNAR (40 CR)',
        'El dinero abre lo que el miedo cierra', 'corrida-op-social');
    }
    if(_lleva('senuelo')){
      html += _op('distraer', 'LANZAR SEÑUELO',
        'Ruido y firma falsa para escabullirte de todos · gasta el señuelo',
        'corrida-op-util');
    }

    html += '</div>';
    return html;
  }

  // Opción de CONFRONTACIÓN (resuelve eligiendo herramienta).
  function _op(id, txt, sub, cls){
    return '<button class="btn-terminal corrida-op ' + (cls || '') + '" '
      + 'onclick="resolverConfrontacion(\'' + id + '\')">'
      + '<span class="corrida-op-txt">' + txt + '</span>'
      + '<span class="corrida-op-sub">' + sub + '</span></button>';
  }

  // Opción de NODO (obstáculo / encuentro / bifurcación) → corridaAccionNodo.
  function _opNodo(id, txt, sub, cls){
    return '<button class="btn-terminal corrida-op ' + (cls || '') + '" '
      + 'onclick="corridaAccionNodo(\'' + id + '\')">'
      + '<span class="corrida-op-txt">' + txt + '</span>'
      + '<span class="corrida-op-sub">' + sub + '</span></button>';
  }

  // Elegir (o cambiar) el objetivo del próximo ataque.
  function elegirObjetivoCorrida(uid){
    if(!_enConfrontacion) return;
    _enConfrontacion._objetivo = uid || null;
    _pintarNodo();
  }

  // Resuelve la vía elegida sobre el objetivo actual. Tras el ataque del
  // jugador, los enemigos vivos responden. Puede entrar refuerzo.
  function resolverConfrontacion(via){
    if(!_corrida) return;
    const cf = _enConfrontacion;
    if(!cf) return;
    const vivos = _enemigosVivos();
    if(!vivos.length){ _terminarConfrontacion(true, ''); return; }

    // Objetivo: el único vivo, o el seleccionado.
    let objetivo = vivos.length === 1 ? vivos[0] : vivos.find(e => e.uid === cf._objetivo);
    // Vías que afectan al grupo entero no necesitan objetivo.
    const viaGrupal = (via === 'justificar' || via === 'sobornar' || via === 'distraer' || via === 'amenazar' || via === 'curar' || via === 'estimulante' || via === 'adrenalina' || via === 'inhibidor' || via === 'humo');
    if(!objetivo && !viaGrupal){
      // Falta elegir objetivo; repintar para que elija.
      _pintarNodo();
      return;
    }

    let mensaje = '';
    let fuerzaJugador = 0;
    let danoSolido = 2;        // daño de un impacto sólido (melee = 2; las armas de fuego lo suben)
    let ruido = 0;
    let evitaTodo = false;     // dispersa a TODO el grupo (social)
    let escapaTodo = false;    // huida (señuelo)
    let avisoArma = '';
    let saltarRespuesta = false; // (reservado: acción sin atacar pero te responden)

    if(via === 'disparar'){
      const idArma = _armaFuegoEquipada();
      const af = idArma ? ARMAS_FUEGO[idArma] : null;
      if(!af || _municion() < af.gastoBala){ return; }
      if(typeof quitarItem === 'function') quitarItem('municion', af.gastoBala);
      fuerzaJugador = af.fuerza;
      danoSolido = af.dano;
      ruido = af.ruido;
      const balaTxt = af.gastoBala === 1 ? 'El perno rebota en todo el pasillo'
        : 'La ráfaga de ' + af.gastoBala + ' pernos truena en el pasillo';
      mensaje = 'Disparas a ' + objetivo.nombre + '. ' + balaTxt + ': '
        + 'resuelve, pero medio distrito te ha oído.';
      _fx('impacto', 0.6);
      avisoArma = _gastarArma(idArma);
    } else if(via === 'amenazar'){
      ruido = 8;
      if(Math.random() < 0.5){
        evitaTodo = true;
        mensaje = 'Levantas el arma vacía y barres con ella al grupo. Dudan, '
          + 'retroceden. El farol aguanta… esta vez.';
      } else {
        mensaje = 'El arma vacía no engaña a tantos ojos. Se envalentonan.';
      }
      _fx('inv_fallo', 0.5);
    } else if(via === 'curar'){
      if(_lleva('kit_trauma') && typeof quitarItem === 'function'){
        quitarItem('kit_trauma', 1);
        _integridad = Math.min(_integridadMax, _integridad + 8);
      }
      mensaje = 'Te aplicas el kit de trauma a toda prisa, sin dejar de mirarlos. '
        + 'Recuperas el aliento, pero bajar la guardia se paga.';
      saltarRespuesta = false; // te responden mientras te curas
    } else if(via === 'estimulante'){
      if(_lleva('estimulante') && typeof quitarItem === 'function') quitarItem('estimulante', 1);
      _estados.estimulado = 3; // +fuerza durante 3 turnos
      mensaje = 'Te clavas el estimulante en el muslo. El mundo se afila y el '
        + 'miedo se apaga: durante unos segundos eres más rápido y pegas más fuerte.';
      saltarRespuesta = false;
      _fx('energia', 0.6);
    } else if(via === 'adrenalina'){
      if(_lleva('adrenalina') && typeof quitarItem === 'function') quitarItem('adrenalina', 1);
      _integridad = Math.min(_integridadMax, _integridad + 4);
      _estados.tembloroso = 2; // -fuerza un par de turnos (resaca)
      mensaje = 'El parche descarga en tu cuello. Cierras la herida a medias y te '
        + 'pones recto de golpe, pero el pulso te baila: cuesta apuntar.';
      saltarRespuesta = false;
      _fx('inv_acierto', 0.5);
    } else if(via === 'inhibidor'){
      if(_lleva('inhibidor_dolor') && typeof quitarItem === 'function') quitarItem('inhibidor_dolor', 1);
      _estados.inhibido = 1; // ignora el próximo golpe (este turno)
      mensaje = 'La ampolla de HELIX entra fría. El dolor desaparece de tu mapa: '
        + 'el próximo golpe ni lo vas a notar.';
      saltarRespuesta = false;
      _fx('energia', 0.5);
    } else if(via === 'humo'){
      if(_lleva('granada_humo') && typeof quitarItem === 'function') quitarItem('granada_humo', 1);
      escapaTodo = true;
      ruido = 5;
      mensaje = 'Tiras del bote y el callejón se traga en humo gris. Aprovechas la '
        + 'ceguera de todos para desaparecer. No has ganado la pelea: la has dejado atrás.';
      _fx('inv_papel', 0.5);
    } else if(via === 'acuchillar'){
      fuerzaJugador = 4;
      ruido = 6;
      mensaje = 'Te echas sobre ' + objetivo.nombre + ' y resuelves de cerca, en silencio.';
      _fx('click_metal', 0.5);
      avisoArma = _gastarArma('arma_blanca');
    } else if(via === 'punos'){
      fuerzaJugador = 2;
      ruido = 3;
      mensaje = 'Te lías a puñetazos con ' + objetivo.nombre + '. Funciona a medias, '
        + 'y duele en ambos lados.';
      _fx('impacto', 0.45);
    } else if(via === 'justificar'){
      evitaTodo = true;
      ruido = 0;
      mensaje = (_bando === 'seguridad')
        ? 'Enseñas la placa. La autoridad de HELIX pesa: el grupo se deshace, uno a uno.'
        : 'Enseñas los papeles. El sello basta. Os abren paso de mala gana.';
      _fx('inv_acierto', 0.5);
    } else if(via === 'sobornar'){
      if(_creditos() < 40) return;
      _cobrar(40);
      evitaTodo = true;
      ruido = 0;
      mensaje = 'Unos créditos cambian de mano. De pronto nadie tiene prisa por pelear.';
      _fx('energia', 0.5);
    } else if(via === 'distraer'){
      if(typeof quitarItem === 'function') quitarItem('senuelo', 1);
      escapaTodo = true;
      ruido = 12;
      mensaje = 'El señuelo escupe ruido lejos. Las cabezas giran y tú ya no estás.';
      _fx('inv_acierto', 0.5);
    }

    if(ruido) _alerta = Math.min(100, _alerta + ruido);

    // ── Resolución social / huida: terminan la confrontación entera ──
    if(evitaTodo){ _terminarConfrontacion(true, mensaje, avisoArma); return; }
    if(escapaTodo){ cf.escapado = true; _terminarConfrontacion(true, mensaje, avisoArma); return; }

    // ── Daño al objetivo ──
    if(objetivo && fuerzaJugador > 0){
      // Modificadores de estado: estimulado pega más, tembloroso peor.
      let fuerzaEfectiva = fuerzaJugador;
      if(_estados.estimulado && _estados.estimulado > 0) fuerzaEfectiva += 2;
      if(_estados.tembloroso && _estados.tembloroso > 0) fuerzaEfectiva -= 1;
      // Daño = 1 base, +1 si superas el umbral del enemigo (golpe sólido).
      // Daño: un impacto sólido (superas el umbral) hace el daño del arma;
      // un roce hace uno menos (mínimo 1). Las armas de fuego mejores tienen
      // más daño sólido, así que pegan de verdad más fuerte.
      let dano = (fuerzaEfectiva >= objetivo.umbral) ? danoSolido : Math.max(1, danoSolido - 1);
      objetivo.integridad = Math.max(0, objetivo.integridad - dano);
      if(objetivo.integridad <= 0){
        objetivo.vivo = false;
        mensaje += ' ' + objetivo.nombre + ' cae.';
        if(cf._objetivo === objetivo.uid) cf._objetivo = null;
      }
    }

    cf.turno++;

    // ── Refuerzos guionizados: en el turno N entran nuevos ──
    let avisoRefuerzo = '';
    if(cf.refuerzoTurno > 0 && !cf.refuerzoTurnoHecho && cf.turno >= cf.refuerzoTurno && cf.refuerzoTurnoGrupo){
      cf.refuerzoTurnoHecho = true;
      const base = cf.enemigos.length;
      cf.refuerzoTurnoGrupo.forEach((e, i) => cf.enemigos.push(_crearEnemigo(e, base + i)));
      avisoRefuerzo = 'Llegan refuerzos.';
    }
    // ── Refuerzos dinámicos por ruido ──
    if(cf.refuerzoSiRuido > 0 && !cf.refuerzosLlegaron && _alerta >= cf.refuerzoSiRuido && cf.refuerzoGrupo){
      cf.refuerzosLlegaron = true;
      const base = cf.enemigos.length;
      cf.refuerzoGrupo.forEach((e, i) => cf.enemigos.push(_crearEnemigo(e, base + i)));
      avisoRefuerzo = (avisoRefuerzo ? avisoRefuerzo + ' ' : '')
        + 'El ruido ha traído más. Un coche frena en seco y bajan varios.';
    }

    // ── ¿Quedan enemigos? Si no, victoria ──
    const quedan = _enemigosVivos();
    if(!quedan.length){
      _terminarConfrontacion(true, mensaje, avisoArma);
      return;
    }

    // ── Respuesta enemiga: cada vivo te hace daño según su fuerza ──
    // (escala suave: no la suma bruta, para que un grupo no te funda de golpe)
    // Daño enemigo del turno. Modelo: el enemigo "principal" (el primero
    // vivo) te alcanza de lleno; el resto, que te rodea, pega a media
    // potencia (te estás cubriendo de ellos). Además, tope por turno para
    // que un grupo numeroso no te funda de un solo intercambio.
    let heridaTotal = 0;
    quedan.forEach((e, i) => {
      const golpe = Math.max(1, Math.round(e.fuerza / 2));
      heridaTotal += (i === 0) ? golpe : Math.max(1, Math.round(golpe / 2));
    });
    // Tope: nunca más de ~40% de la integridad máxima en un solo turno.
    const topeTurno = Math.max(3, Math.round(_integridadMax * 0.4));
    if(heridaTotal > topeTurno) heridaTotal = topeTurno;

    // Inhibidor de dolor: ignoras por completo el golpe de este turno.
    let avisoEstado = '';
    if(_estados.inhibido && _estados.inhibido > 0 && heridaTotal > 0){
      avisoEstado += ' El inhibidor hace su trabajo: no sientes nada, no te frenan.';
      heridaTotal = 0;
    }
    // Armadura: reduce el daño recibido (mínimo 1 si te alcanzan algo) y
    // se desgasta con cada golpe que para.
    if(heridaTotal > 0 && _armadura){
      const antes = heridaTotal;
      heridaTotal = Math.max(1, heridaTotal - _armadura.reduccion);
      if(heridaTotal < antes){
        _armadura.golpes++;
        if(_armadura.golpes >= _armadura.aguante){
          avisoEstado += ' Tu ' + _nombreItem(_armadura.id) + ' cede por fin: queda inservible.';
          if(typeof quitarItem === 'function') quitarItem(_armadura.id, 1);
          _armadura = null;
        }
      }
    }
    _aplicarHerida(heridaTotal);

    // Los estados temporales duran turnos: descuenta uno al cerrar el turno.
    _ticEstados();

    // ── Pintar el turno ──
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + mensaje + (avisoEstado || '') + '</div>';
    if(avisoRefuerzo){
      html += '<div class="corrida-aviso corrida-aviso-refuerzo">' + avisoRefuerzo + '</div>';
    }
    if(avisoArma){
      html += '<div class="corrida-aviso corrida-aviso-arma">' + avisoArma + '</div>';
    }
    if(heridaTotal > 0){
      html += '<div class="corrida-aviso">Te alcanzan. −' + heridaTotal + ' integridad.</div>';
    }
    if(_integridad <= 0){
      html += '<button class="btn-terminal" onclick="_continuarConfrontacion()">…</button>';
    } else {
      html += '<button class="btn-terminal" onclick="_continuarConfrontacion()">SEGUIR EN ELLO →</button>';
    }
    cont.innerHTML = html;
    _guardar();
  }

  // Tras pintar el resultado de un turno: si caíste, desenlace; si quedan
  // enemigos, otra ronda; si no, victoria.
  function _continuarConfrontacion(){
    if(_modoLibre){
      if(_muertoDeVerdad()) return;                  // muerte real: pantalla tomada
      if(!_enemigosVivos().length){ _terminarConfrontacion(true, ''); return; }
      _repintarConfrontacionDeriva();                // siguiente turno, sin grafo
      return;
    }
    if(_integridad <= 0){ _pintarNodo(); return; } // _pintarNodo detecta caída
    if(!_enemigosVivos().length){ _terminarConfrontacion(true, ''); return; }
    _pintarNodo(); // repinta opciones para el siguiente turno
  }

  // Cierra la confrontación y avanza al siguiente nodo.
  function _terminarConfrontacion(resuelta, mensaje, avisoArma){
    // Botín de MUNICIÓN: si has DERRIBADO a los enemigos (no huida, no
    // dispersión social ni soborno), hay una posibilidad de rebuscar balas
    // sueltas en los caídos. Aplica tanto en corrida como en deriva libre.
    let avisoBotin = '';
    if(_enConfrontacion && !_enConfrontacion.escapado && !_enConfrontacion._botinHecho){
      const enemigos = _enConfrontacion.enemigos || [];
      const caidos = enemigos.filter(e => !e.vivo).length;
      const todosMuertos = enemigos.length > 0 && caidos === enemigos.length;
      if(todosMuertos && Math.random() < 0.45){
        let balas = 0;
        for(let i = 0; i < caidos; i++){ balas += 1 + (Math.random() < 0.5 ? 1 : 0); }
        balas = Math.min(balas, 6);
        if(balas > 0 && typeof darItemPorId === 'function'){
          for(let i = 0; i < balas; i++) darItemPorId('municion');
          _enConfrontacion._botinHecho = true;
          avisoBotin = 'Rebuscas en los caídos: un puñado de pernos sueltos. +' + balas + ' munición.';
        }
      }
    }
    const cont = document.getElementById('corrida-wrap');
    if(cont){
      let html = _hud();
      if(mensaje) html += '<div class="corrida-narr">' + mensaje + '</div>';
      if(avisoArma) html += '<div class="corrida-aviso corrida-aviso-arma">' + avisoArma + '</div>';
      if(avisoBotin) html += '<div class="corrida-aviso corrida-aviso-botin">' + avisoBotin + '</div>';
      html += '<button class="btn-terminal" onclick="avanzarCorrida()">SEGUIR ADELANTE →</button>';
      cont.innerHTML = html;
    }
    _guardar();
  }

  // ============================================================
  //  OBSTÁCULO — vía cara vs vía dura
  // ============================================================
  function _pintarObstaculo(nodo){
    let html = '<div class="corrida-ops">';
    const coste = nodo.coste || 50;
    if(_creditos() >= coste){
      html += _opNodo('obst_pagar', (nodo.txtPagar || 'PAGAR EL PASO') + ' (' + coste + ' CR)',
        nodo.subPagar || 'Limpio y sin ruido', 'corrida-op-social');
    } else {
      html += '<div class="caso-nota">Pagar el paso costaría ' + coste + ' CR. No los tienes.</div>';
    }
    html += _opNodo('obst_forzar', nodo.txtForzar || 'FORZARLO',
      nodo.subForzar || 'Gratis, pero hace ruido (+alerta)', 'corrida-op-fuego');
    // Ítem de avance: credencial clonada → cruzas sin pagar ni hacer ruido.
    if(_lleva('credencial_falsa')){
      html += _opNodo('obst_credencial', 'USAR CREDENCIAL CLONADA',
        'Pasas sin pagar ni ruido · gasta un uso', 'corrida-op-util');
    }
    html += '</div>';
    return html;
  }

  function _resolverObstaculo(via){
    const nodo = _nodoPorId(_nodoActual);
    if(!nodo) return;
    let msg = '';
    if(via === 'obst_pagar'){
      const coste = nodo.coste || 50;
      _cobrar(coste);
      msg = nodo.msgPagar || 'Pagas y la puerta se abre como si nunca hubiera estado cerrada.';
      _fx('energia', 0.5);
    } else if(via === 'obst_credencial'){
      if(typeof quitarItem === 'function') quitarItem('credencial_falsa', 1);
      msg = 'Acercas la credencial clonada al lector. Un parpadeo, un pitido dudoso… '
        + 'y abre. Cruzas sin pagar y sin un ruido. La placa, eso sí, está más cerca de su última mentira.';
      _fx('energia', 0.5);
    } else {
      _alerta = Math.min(100, _alerta + (nodo.ruidoForzar || 20));
      msg = nodo.msgForzar || 'Lo fuerzas. Cede con estruendo. Alguien lo ha oído, seguro.';
      if(nodo.heridaForzar){ _integridad = Math.max(0, _integridad - nodo.heridaForzar); }
      _fx('impacto', 0.45);
    }
    _pintarTransicion(msg, nodo.ir);
  }

  // ============================================================
  //  ENCUENTRO — un trato (puede ramificar: irAceptar / irRechazar)
  // ============================================================
  function _pintarEncuentro(nodo){
    let html = '<div class="corrida-ops">';
    html += _opNodo('enc_aceptar', nodo.txtAceptar || 'ACEPTAR EL TRATO',
      nodo.subAceptar || '', 'corrida-op-social');
    html += _opNodo('enc_rechazar', nodo.txtRechazar || 'SEGUIR SIN MÁS',
      nodo.subRechazar || '', 'corrida-op-util');
    html += '</div>';
    return html;
  }

  function _resolverEncuentro(via){
    const nodo = _nodoPorId(_nodoActual);
    if(!nodo) return;
    let msg = '';
    let destino;
    if(via === 'enc_aceptar'){
      msg = nodo.msgAceptar || 'Aceptas.';
      if(typeof nodo.creditos === 'number'){ _botin += nodo.creditos; }
      if(nodo.itemRecompensa && typeof darItemPorId === 'function'){ darItemPorId(nodo.itemRecompensa); }
      if(typeof nodo.alertaAceptar === 'number'){ _alerta = Math.min(100, _alerta + nodo.alertaAceptar); }
      if(typeof nodo.heridaAceptar === 'number'){ _integridad = Math.max(0, _integridad - nodo.heridaAceptar); }
      _fx('inv_acierto', 0.5);
      destino = nodo.irAceptar || nodo.ir;
    } else {
      msg = nodo.msgRechazar || 'Sigues tu camino. No todo trato merece la pena.';
      if(typeof nodo.alertaRechazar === 'number'){ _alerta = Math.min(100, _alerta + nodo.alertaRechazar); }
      _fx('inv_papel', 0.4);
      destino = nodo.irRechazar || nodo.ir;
    }
    _pintarTransicion(msg, destino);
  }

  // ============================================================
  //  BIFURCACIÓN — ramas reales: cada una lleva a un nodo distinto
  //  nodo.ramas = [ { txt, sub, ir, coste?, req?, alerta?, botin?, msg? } ]
  //  Compat: si no hay 'ramas', usa el formato viejo rápida/limpia.
  // ============================================================
  function _pintarBifurcacion(nodo){
    let html = '<div class="corrida-ops">';
    const tieneMapa = _lleva('mapa_sector');
    if(tieneMapa){
      html += '<div class="caso-nota corrida-mapa-activo">Consultas el mapa del sector: '
        + 'sabes lo que te espera en cada desvío.</div>';
    }
    const ramas = _ramasDe(nodo);
    ramas.forEach((r, i) => {
      // ¿Rama bloqueada por falta de item requerido?
      if(r.req && !_lleva(r.req)){
        html += '<div class="caso-nota">' + (r.txt || 'Ruta') + ' — necesitas algo que no llevas.</div>';
        return;
      }
      // ¿Rama de pago que no puedes permitirte?
      if(r.coste && _creditos() < r.coste){
        html += '<div class="caso-nota">' + (r.txt || 'Ruta') + ' (' + r.coste + ' CR) — no te alcanza.</div>';
        return;
      }
      let sub = (r.sub || '') + (r.coste ? ' · ' + r.coste + ' CR' : '');
      // Mapa del sector: revela la pista de lo que aguarda en la rama.
      if(tieneMapa && r.pista){ sub += ' · [' + r.pista + ']'; }
      const cls = i === 0 ? 'corrida-op-fuego' : 'corrida-op-util';
      html += _opNodo('bif_' + i, r.txt || ('RUTA ' + (i + 1)), sub, cls);
    });
    html += '</div>';
    return html;
  }

  // Devuelve el array de ramas, convirtiendo el formato viejo si hace falta.
  function _ramasDe(nodo){
    if(Array.isArray(nodo.ramas) && nodo.ramas.length) return nodo.ramas;
    // Compat viejo: rápida (riesgo) + limpia.
    return [
      { txt: nodo.txtRapida || 'RUTA RÁPIDA', sub: nodo.subRapida || 'Antes, pero peligrosa',
        ir: nodo.ir, alerta: (typeof nodo.alertaRapida === 'number' ? nodo.alertaRapida : 15),
        botin: nodo.creditosRapida || 0, msg: nodo.msgRapida },
      { txt: nodo.txtLimpia || 'RUTA LIMPIA', sub: nodo.subLimpia || 'Más larga, más segura',
        ir: nodo.ir, alerta: 0, botin: 0, msg: nodo.msgLimpia }
    ];
  }

  function _resolverBifurcacion(via){
    const nodo = _nodoPorId(_nodoActual);
    if(!nodo) return;
    const idx = parseInt(via.replace('bif_', ''), 10);
    const ramas = _ramasDe(nodo);
    const r = ramas[idx];
    if(!r) return;
    if(r.coste){ _cobrar(r.coste); }
    if(typeof r.alerta === 'number'){ _alerta = Math.min(100, _alerta + r.alerta); }
    if(typeof r.botin === 'number' && r.botin){ _botin += r.botin; }
    _fx('click_metal', 0.4);
    _pintarTransicion(r.msg || 'Tomas tu decisión y sigues adelante.', r.ir);
  }

  // ============================================================
  //  HALLAZGO — un alijo/cofre con riesgo (¿abrir? ¿trampa?)
  //  nodo = { texto, riesgo(0..1), trampaHerida, recompensaCreditos,
  //           recompensaItem, msgAbrir, msgTrampa, msgDejar, ir }
  // ============================================================
  function _pintarHallazgo(nodo){
    let html = '<div class="corrida-ops">';
    html += _opNodo('hall_abrir', nodo.txtAbrir || 'ABRIR / REGISTRAR',
      nodo.subAbrir || 'Puede haber algo. O puede estar trampeado', 'corrida-op-social');
    html += _opNodo('hall_dejar', nodo.txtDejar || 'DEJARLO Y SEGUIR',
      nodo.subDejar || 'No tocar lo que no conoces', 'corrida-op-util');
    html += '</div>';
    return html;
  }

  function _resolverHallazgo(via){
    const nodo = _nodoPorId(_nodoActual);
    if(!nodo) return;
    let msg = '';
    if(via === 'hall_abrir'){
      const riesgo = (typeof nodo.riesgo === 'number') ? nodo.riesgo : 0;
      if(riesgo > 0 && Math.random() < riesgo){
        // Trampa.
        const herida = nodo.trampaHerida || 2;
        _integridad = Math.max(0, _integridad - herida);
        if(nodo.trampaAlerta){ _alerta = Math.min(100, _alerta + nodo.trampaAlerta); }
        msg = nodo.msgTrampa || 'Estaba trampeado. Algo salta y te alcanza antes de que puedas retirar la mano.';
        _fx('impacto', 0.55);
      } else {
        // Recompensa.
        if(typeof nodo.recompensaCreditos === 'number'){ _botin += nodo.recompensaCreditos; }
        if(nodo.recompensaItem && typeof darItemPorId === 'function'){ darItemPorId(nodo.recompensaItem); }
        msg = nodo.msgAbrir || 'Hay algo aprovechable. Lo coges antes de que cambie de opinión el mundo.';
        _fx('inv_acierto', 0.5);
      }
    } else {
      msg = nodo.msgDejar || 'Lo dejas donde está. La curiosidad mató a más de uno en estas calles.';
      _fx('inv_papel', 0.4);
    }
    _pintarTransicion(msg, nodo.ir);
  }

  // Pinta el resultado de una acción de nodo y ofrece SEGUIR → al destino.
  // Guarda el destino en _run para que el botón sepa a dónde ir (incluido
  // el posible evento aleatorio intercalado).
  function _pintarTransicion(msg, destino){
    _run.destinoTransicion = destino;
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + msg + '</div>';
    if(_integridad <= 0){
      html += '<button class="btn-terminal" onclick="_seguirTransicion()">…</button>';
    } else {
      html += '<button class="btn-terminal" onclick="_seguirTransicion()">SEGUIR →</button>';
    }
    cont.innerHTML = html;
    _guardar();
  }

  function _seguirTransicion(){
    if(_integridad <= 0){ _resolverDesenlace(false); return; }
    _irANodo(_run ? _run.destinoTransicion : null);
  }

  // ============================================================
  //  EVENTO ALEATORIO — mini-nodo que se intercala entre paradas.
  //  Al resolverse, continúa hacia _run.destinoPendiente.
  //  Formatos de evento soportados:
  //   { id, tipo:'narrativo', texto, alerta?, herida?, botin?, item? }
  //   { id, tipo:'hallazgo', ...campos de hallazgo... }
  //   { id, tipo:'encuentro', ...campos de encuentro... }
  //   { id, tipo:'confrontacion', ...enemigos... }
  // ============================================================
  function _pintarEvento(ev){
    const cont = document.getElementById('corrida-wrap');
    if(!cont) return;
    // La confrontación de evento se monta y delega en el sistema táctico.
    if(ev.tipo === 'confrontacion'){
      _montarConfrontacion(ev);
      let html = _hud();
      html += '<div class="corrida-narr corrida-evento-tag">IMPREVISTO</div>';
      html += '<div class="corrida-narr">' + (ev.texto || '') + '</div>';
      html += _pintarOpcionesConfrontacion();
      cont.innerHTML = html;
      return;
    }
    let html = _hud();
    html += '<div class="corrida-narr corrida-evento-tag">IMPREVISTO</div>';
    html += '<div class="corrida-narr">' + (ev.texto || '') + '</div>';
    if(ev.tipo === 'hallazgo'){
      html += _pintarHallazgo(ev);
    } else if(ev.tipo === 'encuentro'){
      html += _pintarEncuentro(ev);
    } else {
      // narrativo: aplica efectos inmediatos y ofrece seguir
      if(typeof ev.alerta === 'number'){ _alerta = Math.min(100, _alerta + ev.alerta); }
      if(typeof ev.herida === 'number'){ _aplicarHerida(ev.herida); }
      if(typeof ev.botin === 'number'){ _ganarBotin(ev.botin); }
      if(ev.item && typeof darItemPorId === 'function'){ darItemPorId(ev.item); }
      // En deriva, si el daño te ha matado, la muerte global ya tomó la
      // pantalla: no pintamos botón de seguir.
      if(_modoLibre && _muertoDeVerdad()){ return; }
      if(_integridad <= 0){
        html += '<button class="btn-terminal" onclick="_finEvento()">…</button>';
      } else {
        html += '<button class="btn-terminal" onclick="_finEvento()">SEGUIR →</button>';
      }
    }
    cont.innerHTML = html;
    _guardar();
  }

  // Resuelve la acción de un evento que ramifica (hallazgo/encuentro) y
  // luego continúa al destino pendiente.
  function _resolverEventoAccion(via){
    const ev = _run ? _run.eventoActual : null;
    if(!ev) return;
    // Reutilizamos la lógica de hallazgo/encuentro pero sobre el evento.
    // Truco: colocamos el evento como "nodo actual" temporal.
    const guardaNodo = _nodoActual;
    _grafo.nodos['__evento_tmp__'] = ev;
    _nodoActual = '__evento_tmp__';
    if(via.indexOf('hall_') === 0){ _resolverHallazgo(via); }
    else if(via.indexOf('enc_') === 0){ _resolverEncuentro(via); }
    // _resolverHallazgo/_Encuentro llaman a _pintarTransicion con ev.ir
    // (normalmente undefined) → corregimos el destino al pendiente real.
    _run.destinoTransicion = _run.destinoPendiente;
    _nodoActual = guardaNodo;
    delete _grafo.nodos['__evento_tmp__'];
  }

  function _finEvento(){
    if(_modoLibre){
      if(_muertoDeVerdad()) return;       // la muerte global manda
      _pintarInterludioDeriva();           // volver al respiro entre eventos
      return;
    }
    if(_integridad <= 0){ _resolverDesenlace(false); return; }
    _irANodo(_run ? _run.destinoPendiente : null, true); // saltarEvento: no encadenar dos
  }

  // ============================================================
  //  DESENLACE — paga + progreso, o fracaso
  // ============================================================
  function _resolverDesenlace(exito){
    const cfg = BANDOS[_bando];
    const c = _corrida;
    let paga = 0, progreso = 0, ascenso = null;
    Estado.memoria = Estado.memoria || {};
    Estado.memoria._ultimoDesenlaceCorrida = exito ? 'ok' : 'fallo';

    if(exito){
      // La paga baja si terminaste con mucha alerta (chapucero).
      const factorAlerta = _alerta >= 70 ? 0.7 : (_alerta >= 35 ? 0.85 : 1.0);
      paga = Math.round(((c.pagaBase || 0) + _botin) * factorAlerta);
      progreso = c.progreso || 80;
      _fx('inv_acierto', 0.6);
    } else {
      // Fracaso: nada de paga, algo de progreso por la experiencia, y pierdes
      // parte del botín acumulado (te lo confiscan).
      paga = 0;
      progreso = Math.round((c.progreso || 80) * 0.2);
      _fx('inv_fallo', 0.6);
    }

    if(paga > 0 || progreso > 0){
      if(typeof otorgarRecompensaProfesion === 'function'){
        const r = otorgarRecompensaProfesion(_profId, paga, progreso);
        if(r && r.ascendio) ascenso = r.rangoNuevo;
      }
    }
    if(exito) _marcarHecha(c.id);

    // Eco en las noticias: el mundo reacciona a lo que acabas de mover, sin
    // nombrarte. Según el bando y la facción cliente de la corrida.
    if(exito && typeof marcarEcoProfesion === 'function'){
      if(_bando === 'seguridad'){
        marcarEcoProfesion('corrida_seguridad');
      } else {
        // Contrabando: matiz por facción cliente si la hay.
        if(c.faccion === 'loto'){ marcarEcoProfesion('corrida_contrabando_loto'); }
        else if(c.faccion === 'sindicatos'){ marcarEcoProfesion('corrida_contrabando_ferro'); }
        else { marcarEcoProfesion('corrida_contrabando'); }
      }
    }

    const cont = document.getElementById('corrida-wrap');
    let html = '<div class="corrida-hud"><span class="corrida-hud-vida">'
      + (exito ? cfg.desenlaceOk : cfg.desenlaceFallo) + '</span></div>';
    const cierre = exito
      ? (c.cierreOk || 'Llegas. Entregas. Cobras. Otra más que sobrevives.')
      : (c.cierreFallo || 'No llegaste. En las Pilas, no llegar tiene un precio, y lo pagas tú.');
    html += '<div class="corrida-narr">' + cierre + '</div>';
    html += '<div class="caso-recompensa"><div>PAGA: ' + paga + ' CR</div>';
    if(ascenso) html += '<div class="caso-ascenso">ASCENSO · ' + ascenso + '</div>';
    html += '</div>';
    html += '<button class="btn-terminal" onclick="cerrarCorridaResuelta()">VOLVER AL TABLÓN →</button>';
    cont.innerHTML = html;

    _corrida = null;
    _nodoIdx = 0;
    _nodoActual = null;
    _grafo = null;
    _run = null;
    _armadura = null;
    _estados = {};
    _enConfrontacion = null;
    _guardar();
  }

  function cerrarCorridaResuelta(){
    _corrida = null;
    _enConfrontacion = null;
    _pintarTablon();
  }

  function abandonarCorrida(){
    _corrida = null;
    _enConfrontacion = null;
    _pintarTablon();
  }

  // ── RETIRARSE de una corrida a medias ───────────────────
  // Pide confirmación (un paso). Al confirmar: sin paga, progreso mínimo
  // por la experiencia, conservas la integridad y NO baja el rango.
  function retirarseCorrida(){
    if(!_corrida) return;
    const cont = document.getElementById('corrida-wrap');
    if(!cont) return;
    let html = _hud();
    html += '<div class="corrida-narr">Te paras en seco. Lo que llevabas encima, '
      + 'el camino que faltaba, lo que fuera a pagarte esto… se queda atrás. '
      + 'Retirarte ahora significa volver con las manos vacías, pero volver. '
      + 'A veces eso es ganar.</div>';
    html += '<div class="corrida-ops">';
    html += '<button class="btn-terminal corrida-op corrida-op-fuego" '
      + 'onclick="confirmarRetirada()"><span class="corrida-op-txt">SÍ, RETIRARME</span>'
      + '<span class="corrida-op-sub">Pierdes el botín de esta corrida · conservas la piel</span></button>';
    html += '<button class="btn-terminal corrida-op corrida-op-util" '
      + 'onclick="_volverAlNodo()"><span class="corrida-op-txt">NO, SEGUIR</span>'
      + '<span class="corrida-op-sub">Aún puedes llegar</span></button>';
    html += '</div>';
    cont.innerHTML = html;
  }

  function confirmarRetirada(){
    if(!_corrida) return;
    const c = _corrida;
    // Progreso mínimo por la experiencia; nada de paga; sin marcar hecha.
    const progreso = Math.round((c.progreso || 80) * 0.1);
    if(progreso > 0 && typeof otorgarRecompensaProfesion === 'function'){
      otorgarRecompensaProfesion(_profId, 0, progreso);
    }
    _fx('inv_papel', 0.5);
    const cont = document.getElementById('corrida-wrap');
    let html = '<div class="corrida-hud"><span class="corrida-hud-vida">TE RETIRAS</span></div>';
    html += '<div class="corrida-narr">Das media vuelta y desandas el camino. '
      + 'Nadie cobra hoy. Pero sigues entero, y mañana hay otra ruta.</div>';
    html += '<button class="btn-terminal" onclick="cerrarCorridaResuelta()">VOLVER AL TABLÓN →</button>';
    cont.innerHTML = html;
    _corrida = null;
    _nodoIdx = 0;
    _nodoActual = null;
    _grafo = null;
    _run = null;
    _armadura = null;
    _estados = {};
    _enConfrontacion = null;
    _guardar();
  }

  // Volver a pintar el nodo actual (cancelar la retirada).
  function _volverAlNodo(){
    _pintarNodo();
  }

  // Usar un kit de trauma para recuperar integridad durante la corrida.
  function curarseEnCorrida(){
    if(!_corrida || !_lleva('kit_trauma')) return;
    if(_integridad >= _integridadMax) return;
    if(typeof quitarItem === 'function') quitarItem('kit_trauma', 1);
    // En deriva el kit baja tu fatiga REAL; en corrida sube la vida local.
    const cura = _modoLibre ? 22 : 8;
    _curarJugador(cura);
    _fx('inv_acierto', 0.5);
    const cont = document.getElementById('corrida-wrap');
    if(cont){
      let html = _hud();
      html += '<div class="corrida-narr">Te tomas un respiro a cubierto. El kit '
        + 'de trauma sella lo que sangra y silencia lo que duele, al menos un rato. '
        + 'Recuperas el aliento.</div>';
      const seguir = _modoLibre ? 'seguirInterludioDeriva()' : '_volverAlNodo()';
      html += '<button class="btn-terminal" onclick="' + seguir + '">SEGUIR →</button>';
      cont.innerHTML = html;
    }
    _guardar();
  }

  // ── salir del tablón, volver a la escena previa ─────────
  function cerrarCorrida(){
    const idActual = 'corrida-escena';
    if(typeof cambiarEscena === 'function'){
      cambiarEscena(idActual, _volverA || 'apartamento');
    } else {
      const e = document.getElementById('corrida-escena');
      if(e) e.classList.remove('activa');
      const v = document.getElementById(_volverA || 'apartamento');
      if(v) v.classList.add('activa');
    }
  }

  // Despachador de obstáculo/encuentro/bifurcación desde el HTML.
  function corridaAccionNodo(via){
    // Si estamos resolviendo un evento ramificable, enrutar al manejador
    // de eventos (que continúa al destino pendiente).
    if(_nodoActual === '__evento__' && _run && _run.eventoActual
       && (via.indexOf('hall_') === 0 || via.indexOf('enc_') === 0)){
      return _resolverEventoAccion(via);
    }
    if(via.indexOf('obst_') === 0) return _resolverObstaculo(via);
    if(via.indexOf('enc_') === 0) return _resolverEncuentro(via);
    if(via.indexOf('bif_') === 0) return _resolverBifurcacion(via);
    if(via.indexOf('hall_') === 0) return _resolverHallazgo(via);
  }

  // ============================================================
  //  DERIVA LIBRE — "Explorar la ciudad" sobre el motor de corridas
  // ------------------------------------------------------------
  //  Sin camino fijo, sin desenlace, sin paga. El motor saca eventos
  //  del saco EVENTOS_DERIVA (70_deriva_datos.js) uno tras otro. La
  //  INTEGRIDAD en pantalla es el reflejo de tu FATIGA real: los golpes
  //  suben fatiga de verdad (te la llevas a casa) y, si llega a 100,
  //  salta el motor de muerte global del juego. Solo terminas de dos
  //  maneras: volviendo al apartamento, o muriendo.
  // ============================================================

  // Fatiga (0..100) → corazones de integridad (0.._integridadMax).
  function _vidaDeriva(){
    const fat = (Estado.humano && typeof Estado.humano.fatiga === 'number') ? Estado.humano.fatiga : 0;
    return Math.max(0, Math.ceil(_integridadMax * (100 - fat) / 100));
  }

  // Aplica daño al jugador. En deriva va a la FATIGA real (puede matar
  // de verdad). En corrida, a la vida local de la corrida.
  function _aplicarHerida(n){
    if(n <= 0) return;
    if(_modoLibre){
      if(typeof ajustarHumano === 'function') ajustarHumano('fatiga', n);
      _integridad = _vidaDeriva();
    } else {
      _integridad = Math.max(0, _integridad - n);
    }
  }

  // Cura al jugador. En deriva BAJA la fatiga real (te curas de verdad).
  function _curarJugador(n){
    if(n <= 0) return;
    if(_modoLibre){
      if(typeof ajustarHumano === 'function') ajustarHumano('fatiga', -n);
      _integridad = _vidaDeriva();
    } else {
      _integridad = Math.min(_integridadMax, _integridad + n);
    }
  }

  // Botín. En deriva no hay desenlace que pague: se cobra en el acto.
  function _ganarBotin(n){
    if(!n) return;
    if(_modoLibre){
      if(typeof ajustarCreditos === 'function') ajustarCreditos(n);
      else if(typeof Estado === 'object'){ Estado.creditos = Math.max(0, (Estado.creditos || 0) + n); }
    } else {
      _botin += n;
    }
  }

  // ¿El jugador ha muerto de verdad? (en deriva, la muerte global manda)
  function _muertoDeVerdad(){
    return !!(typeof Estado === 'object' && Estado.muerto);
  }

  // Arranca la deriva libre. Lo llama el botón "Explorar la ciudad".
  function iniciarDerivaLibre(volverA){
    _modoLibre = true;
    _bando = 'deriva';
    _profId = null;
    _volverA = volverA || 'apartamento';
    // Nueva run: las cadenas de lore vuelven a poder avanzar y los ecos de
    // calle de la salida anterior se limpian (igual que el explorar viejo).
    if(typeof reiniciarCadenasDeRun === 'function') reiniciarCadenasDeRun();
    if(typeof reiniciarEcosCalle === 'function') reiniciarEcosCalle();
    _corrida = { id: '__deriva__', libre: true };  // sintético: pasa los guards
    _integridadMax = 10;
    _integridad = _vidaDeriva();
    _alerta = 0;
    _botin = 0;
    _enConfrontacion = null;
    // Armadura: equipas la mejor que lleves (igual que en una corrida).
    _armadura = null;
    Object.keys(ARMADURAS).forEach(aid => {
      if(_lleva(aid)){
        const a = ARMADURAS[aid];
        if(!_armadura || a.reduccion > _armadura.reduccion){
          _armadura = { id: aid, reduccion: a.reduccion, aguante: a.aguante, golpes: 0, sigilo: !!a.sigilo };
        }
      }
    });
    _estados = {};
    _grafo = { inicio: null, nodos: {} };  // sin camino fijo
    _nodoActual = null;
    _eventosUsados = [];
    _pasosDados = 0;
    _run = { botin: [], carga: 0, destinoPendiente: null, eventoActual: null };
    // Munición: balas sueltas en el inventario (item 'municion').
    Estado.memoria = Estado.memoria || {};

    // Montar el panel (mismo cambio de escena que abrirCorrida).
    if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
    if(typeof saltoDeEscena === 'function') saltoDeEscena();
    const desde = document.querySelector('.escena.activa');
    const idDesde = desde ? desde.id : _volverA;
    if(typeof cambiarEscena === 'function'){
      cambiarEscena(idDesde, 'corrida-escena');
    } else {
      if(desde) desde.classList.remove('activa');
      const e = document.getElementById('corrida-escena');
      if(e) e.classList.add('activa');
    }
    _fx('panel_abrir', 0.5);
    _guardar();
    _pintarInterludioDeriva(true);
  }

  // Elige un evento no visto del saco. Si se agotan, se reinicia el
  // ciclo (la deriva no se acaba: quedarse sin novedades no te detiene).
  function _elegirEventoDeriva(){
    const saco = (typeof EVENTOS_DERIVA !== 'undefined' && Array.isArray(EVENTOS_DERIVA)) ? EVENTOS_DERIVA : null;
    if(!saco || !saco.length) return null;
    let libres = saco.filter(e => _eventosUsados.indexOf(e.id) < 0);
    if(!libres.length){ _eventosUsados = []; libres = saco.slice(); }
    return libres[Math.floor(Math.random() * libres.length)];
  }

  // Siguiente paso de la deriva: saca un evento y lo reproduce.
  function _avanzarDeriva(){
    if(!_modoLibre) return;
    if(_muertoDeVerdad()) return;            // la muerte global manda
    _pasosDados++;
    _integridad = _vidaDeriva();             // sincroniza con el cuerpo real
    // PUENTE (v0.120): con prioridad, una escena CON RAMAS del banco a mano
    // (las ~160 del explorar viejo). Si no hay disponible, un evento suelto
    // del saco de deriva. Mezcla de ambos contenidos sobre el mismo bucle.
    if(typeof hayEscenaGuionDisponible === 'function' && hayEscenaGuionDisponible()
       && typeof reproducirEscenaGuion === 'function' && Math.random() < 0.7){
      const idEsc = (typeof elegirEscenaGuion === 'function') ? elegirEscenaGuion() : null;
      if(idEsc){
        _nodoActual = '__guion__';
        if(typeof egFijarContenedor === 'function') egFijarContenedor('corrida-wrap');
        _guardar();
        reproducirEscenaGuion(idEsc, _finGuionDeriva);
        return;
      }
    }
    const ev = _elegirEventoDeriva();
    if(!ev){ _pintarInterludioDeriva(); return; }
    _eventosUsados.push(ev.id);
    _run.eventoActual = ev;
    _run.destinoPendiente = null;            // en deriva no hay destino
    _nodoActual = '__evento__';
    _guardar();
    _pintarEvento(ev);                        // reutiliza el render de eventos
  }

  // Al terminar una escena de guion: restaura el contenedor del explorar
  // viejo y vuelve al respiro (que hace la sincronización de muerte real).
  function _finGuionDeriva(){
    if(typeof egFijarContenedor === 'function') egFijarContenedor('explorar-cuerpo');
    _pintarInterludioDeriva();
  }

  // El "respiro" entre eventos: aquí decides seguir caminando o volver.
  const _AMBIENTE_DERIVA = [
    'Caminas sin rumbo. Las luces de los anuncios se reflejan en el agua sucia y nadie te mira a los ojos.',
    'Doblas otra esquina idéntica a la anterior. Las Pilas no se acaban; solo cambian de cara.',
    'Te paras un segundo bajo un alero. El zumbido de la ciudad nunca calla del todo.',
    'Sigues. En un sitio como este, moverse es lo único que se parece a tener un plan.'
  ];
  function _pintarInterludioDeriva(primera){
    // Las escenas de guion suben la fatiga directamente, sin pasar por el
    // motor de muerte. Si una te ha dejado al límite, cerramos aquí la
    // promesa de muerte real antes de seguir.
    if(!_muertoDeVerdad() && Estado.humano && Estado.humano.fatiga >= 100
       && typeof dispararMuerte === 'function'){ dispararMuerte('fatiga'); return; }
    if(_muertoDeVerdad()) return;
    _integridad = _vidaDeriva();
    const cont = document.getElementById('corrida-wrap');
    if(!cont) return;
    let html = _hud();
    const txt = primera
      ? 'Sales del bloque sin destino fijo. La lluvia te recibe como recibe a todos: sin preguntar quién eres.'
      : _AMBIENTE_DERIVA[Math.floor(Math.random() * _AMBIENTE_DERIVA.length)];
    html += '<div class="corrida-narr">' + txt + '</div>';
    html += '<button class="btn-terminal" onclick="seguirDeriva()">SEGUIR CAMINANDO →</button>';
    if(_lleva('kit_trauma') && _integridad < _integridadMax){
      html += '<button class="btn-terminal corrida-curar" '
        + 'onclick="curarseEnCorrida()">USAR KIT DE TRAUMA (recuperar fuerzas)</button>';
    }
    html += '<button class="btn-terminal corrida-retirarse" '
      + 'onclick="retirarDeriva()">VOLVER AL APARTAMENTO</button>';
    cont.innerHTML = html;
    _guardar();
  }

  // Botón "SEGUIR CAMINANDO": pide el siguiente evento.
  function seguirDeriva(){ _avanzarDeriva(); }

  // Tras curarte: vuelves al respiro (no a un evento nuevo).
  function seguirInterludioDeriva(){ _pintarInterludioDeriva(); }

  // Repinta las opciones de la confrontación actual sin pasar por el
  // grafo (que en deriva no existe).
  function _repintarConfrontacionDeriva(){
    const cont = document.getElementById('corrida-wrap');
    if(!cont) return;
    cont.innerHTML = _hud() + _pintarOpcionesConfrontacion();
  }

  // Volver al apartamento. Conservas todo lo que encontraste (ya aplicado).
  function retirarDeriva(){
    _modoLibre = false;
    _corrida = null;
    _enConfrontacion = null;
    _run = null;
    _grafo = null;
    _armadura = null;
    _estados = {};
    _nodoActual = null;
    _guardar();
    cerrarCorrida();
  }


  // ── exponer al ámbito global (como hacen 62/63/64) ──────
  window.abrirCorrida = abrirCorrida;
  window.repintarTablonCorrida = function(){ _pintarTablon(); };
  window.aceptarCorrida = aceptarCorrida;
  window.avanzarCorrida = avanzarCorrida;
  window.resolverConfrontacion = resolverConfrontacion;
  window.elegirObjetivoCorrida = elegirObjetivoCorrida;
  window._continuarConfrontacion = _continuarConfrontacion;
  window.corridaAccionNodo = corridaAccionNodo;
  window._seguirTransicion = _seguirTransicion;
  window._finEvento = _finEvento;
  window.cerrarCorridaResuelta = cerrarCorridaResuelta;
  window.abandonarCorrida = abandonarCorrida;
  window.retirarseCorrida = retirarseCorrida;
  window.confirmarRetirada = confirmarRetirada;
  window._volverAlNodo = _volverAlNodo;
  window.curarseEnCorrida = curarseEnCorrida;
  window.cerrarCorrida = cerrarCorrida;
  // Para que el inventario del panel ESTADO pueda mostrar la condición
  // del arma. Devuelve 'operativa' | 'gastada' | 'comprometida' | null.
  window.estadoDesgasteArma = function(id){ return _estadoArma(id); };

  // ── deriva libre (explorar la ciudad) ──
  window.iniciarDerivaLibre = iniciarDerivaLibre;
  window.seguirDeriva = seguirDeriva;
  window.seguirInterludioDeriva = seguirInterludioDeriva;
  window.retirarDeriva = retirarDeriva;

})();
