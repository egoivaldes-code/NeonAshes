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
//    DISPARAR   requiere arma_fuego + balas en el cargador. Mucha
//               fuerza, resuelve rápido, MUY ruidoso (+alerta alta) y
//               gasta 1 bala. Sin balas: la opción se cae (queda
//               AMENAZAR, un farol que puede fallar).
//    ACUCHILLAR requiere arma_blanca. Fuerza media, silencioso, pero
//               cuerpo a cuerpo (más fácil que te hieran).
//    PUÑOS      siempre disponible. Fuerza baja, sin gasto, silencioso.
//    + opciones no físicas según item: justificarte (credencial/papel),
//      sobornar (créditos), distraer (señuelo).
//
//  La MUNICIÓN se modela como balas en el estado de la corrida. Un
//  'cargador' del inventario (canon: 6 usos) recarga +6 balas.
//
//  El contenido (corridas, nodos, textos) vive en js/68_corrida_datos.js
//  y es hand-authored y propio de cada bando (no espejo mecánico).
// ============================================================

(function(){
  'use strict';

  // ── helpers defensivos ──────────────────────────────────
  function _fx(clave, vol){ if(typeof reproducirFX === 'function') reproducirFX(clave, vol); }
  function _lleva(id){ return (typeof tieneItem === 'function') ? tieneItem(id) : false; }
  function _guardar(){ if(typeof guardarPartida === 'function') guardarPartida(); }
  function _creditos(){ return (typeof Estado === 'object' && typeof Estado.creditos === 'number') ? Estado.creditos : 0; }
  function _cobrar(n){ if(typeof Estado === 'object' && typeof Estado.creditos === 'number'){ Estado.creditos = Math.max(0, Estado.creditos - n); } }
  function _rango(profId){ return (typeof rangoActualProfesion === 'function') ? rangoActualProfesion(profId) : 0; }

  // Munición del cargador (canon: cada cargador = 6 disparos).
  const BALAS_POR_CARGADOR = 6;

  // ── estado de la corrida en curso ───────────────────────
  let _corrida = null;     // objeto de la corrida activa (de 68)
  let _bando = null;       // 'contrabando' | 'seguridad'
  let _profId = null;      // id de la profesión asociada al bando
  let _nodoIdx = 0;        // índice del nodo actual
  let _integridad = 0;     // vida de la corrida
  let _integridadMax = 0;
  let _alerta = 0;         // 0..100, presión creciente del distrito
  let _balas = 0;          // munición cargada en el arma de fuego
  let _botin = 0;          // créditos acumulados durante la corrida (bonus)
  let _volverA = 'apartamento';
  let _enConfrontacion = null;  // datos de la amenaza actual, o null

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
    let html = '<div class="casos-cab"><div class="casos-titulo">' + cfg.tablonTitulo + '</div>'
      + '<div class="casos-sub">' + cfg.tablonSub + '</div></div>';
    html += '<div class="casos-lista">';
    const ordenadas = _catalogo().sort((a, b) =>
         (a.rangoMin || 0) - (b.rangoMin || 0)
      || (a.peligro  || 0) - (b.peligro  || 0)
      || (a.pagaBase || 0) - (b.pagaBase || 0)
    );
    ordenadas.forEach(c => {
      const bloqueadoRango = (c.rangoMin || 0) > rango;
      const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
      const yaHecha = _hecha(c.id);
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
    html += '</div>';
    html += '<button class="btn-terminal casos-salir" onclick="cerrarCorrida()">← DEJARLO POR HOY</button>';
    cont.innerHTML = html;
  }

  // ============================================================
  //  ACEPTAR Y RECORRER
  // ============================================================
  function aceptarCorrida(id){
    const c = _catalogo().find(x => x.id === id);
    if(!c) return;
    _fx('inv_papel', 0.55);
    _corrida = c;
    _nodoIdx = 0;
    _integridadMax = c.integridad || 12;
    _integridad = _integridadMax;
    _alerta = c.alertaInicial || 0;
    _botin = 0;
    _enConfrontacion = null;
    // Recarga inicial: si llevas arma de fuego y al menos un cargador,
    // arrancas con un cargador metido (lo consume del inventario).
    _balas = 0;
    if(_lleva('arma_fuego') && _lleva('cargador')){
      if(typeof quitarItem === 'function') quitarItem('cargador', 1);
      _balas = BALAS_POR_CARGADOR;
    }
    _guardar();
    _pintarNodo();
  }

  // ── barra de estado de la corrida (HUD superior) ─────────
  function _hud(){
    const cfg = BANDOS[_bando];
    const corazones = '♦'.repeat(Math.max(0, _integridad)) + '·'.repeat(Math.max(0, _integridadMax - _integridad));
    const nivelAlerta = _alerta >= 70 ? 'alerta-alta' : (_alerta >= 35 ? 'alerta-media' : 'alerta-baja');
    let balasTxt = '';
    if(_lleva('arma_fuego')){
      balasTxt = '<span class="corrida-hud-balas">BALAS ' + _balas + '</span>';
    }
    return '<div class="corrida-hud">'
      + '<span class="corrida-hud-vida" title="' + cfg.etiquetaIntegridad + '">' + cfg.etiquetaIntegridad + ' ' + corazones + '</span>'
      + balasTxt
      + '<span class="corrida-hud-alerta ' + nivelAlerta + '">' + cfg.etiquetaAlerta + ' ' + _alerta + '%</span>'
      + '</div>';
  }

  // ── avanzar / pintar el nodo actual ─────────────────────
  function _pintarNodo(){
    const cont = document.getElementById('corrida-wrap');
    if(!cont || !_corrida) return;

    // ¿Corrida terminada?
    if(_nodoIdx >= (_corrida.nodos || []).length){
      _resolverDesenlace(true);
      return;
    }
    // ¿Caíste?
    if(_integridad <= 0){
      _resolverDesenlace(false);
      return;
    }

    const nodo = _corrida.nodos[_nodoIdx];

    // Si el nodo es una confrontación y aún no la hemos montado, montarla.
    if(nodo.tipo === 'confrontacion' && !_enConfrontacion){
      _montarConfrontacion(nodo);
    }

    let html = _hud();
    html += '<div class="corrida-narr">' + (nodo.texto || '') + '</div>';

    if(nodo.tipo === 'confrontacion'){
      html += _pintarOpcionesConfrontacion();
    } else if(nodo.tipo === 'obstaculo'){
      html += _pintarObstaculo(nodo);
    } else if(nodo.tipo === 'encuentro'){
      html += _pintarEncuentro(nodo);
    } else if(nodo.tipo === 'bifurcacion'){
      html += _pintarBifurcacion(nodo);
    } else {
      // nodo narrativo simple
      html += '<button class="btn-terminal" onclick="avanzarCorrida()">AVANZAR →</button>';
    }
    cont.innerHTML = html;
  }

  // ── avanzar al siguiente nodo ───────────────────────────
  function avanzarCorrida(){
    if(!_corrida) return;
    _enConfrontacion = null;
    _nodoIdx++;
    _guardar();
    _pintarNodo();
  }

  // ============================================================
  //  CONFRONTACIÓN — el corazón del sistema
  // ============================================================
  function _montarConfrontacion(nodo){
    // La amenaza define su fuerza (cuánto te hace si no la superas), su
    // detección (para escapar) y un texto de intención.
    _enConfrontacion = {
      fuerza: nodo.fuerza || 3,
      deteccion: nodo.deteccion || 2,
      ruidoExtra: nodo.ruidoExtra || 0,
      // umbral: cuánta "fuerza" tuya hace falta para resolver sin daño.
      umbral: nodo.umbral || 3,
      resuelta: false
    };
    if(_alerta >= 70) _enConfrontacion.fuerza += 1;  // alerta alta = peor
  }

  // Construye las opciones DISPONIBLES leyendo el inventario real.
  function _pintarOpcionesConfrontacion(){
    const cf = _enConfrontacion;
    let html = '<div class="corrida-ops">';

    // ── VÍA DISPAROS ──
    if(_lleva('arma_fuego')){
      if(_balas > 0){
        html += _op('disparar', 'DISPARAR',
          'Fuerza alta · gasta 1 bala · mucho ruido',
          'corrida-op-fuego');
      } else {
        // Sin balas: queda el farol.
        html += _op('amenazar', 'AMENAZAR CON EL ARMA',
          'Sin balas. Un farol: puede que recule, puede que no',
          'corrida-op-farol');
        // Recargar, si llevas otro cargador.
        if(_lleva('cargador')){
          html += _op('recargar', 'RECARGAR',
            'Meter un cargador (+' + BALAS_POR_CARGADOR + ' balas)',
            'corrida-op-util');
        }
      }
    }

    // ── VÍA ARMA BLANCA ──
    if(_lleva('arma_blanca')){
      html += _op('acuchillar', 'ACUCHILLAR',
        'Fuerza media · silencioso · de cerca (arriesgas piel)',
        'corrida-op-blanca');
    }

    // ── VÍA PUÑOS (siempre) ──
    html += _op('punos', 'A PUÑOS',
      'Fuerza baja · sin gasto · silencioso · lento',
      'corrida-op-punos');

    // ── OPCIONES NO FÍSICAS según item ──
    const cfg = BANDOS[_bando];
    if(_lleva(cfg.itemSocial)){
      const etiqueta = (_bando === 'seguridad') ? 'IMPONER AUTORIDAD' : 'JUSTIFICARTE';
      const sub = (_bando === 'seguridad')
        ? 'Enseñar la placa de HELIX. Si cuela, no hay pelea'
        : 'Enseñar la documentación. Si cuela, te dejan pasar';
      html += _op('justificar', etiqueta, sub, 'corrida-op-social');
    }
    if(_creditos() >= 40){
      html += _op('sobornar', 'SOBORNAR (40 CR)',
        'El dinero abre lo que el miedo cierra', 'corrida-op-social');
    }
    if(_lleva('senuelo')){
      html += _op('distraer', 'LANZAR SEÑUELO',
        'Ruido y firma falsa para escabullirte · gasta el señuelo',
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

  // Resuelve la vía elegida. Cada vía: aporta "fuerza" contra el umbral,
  // hace ruido (alerta) y puede herir (integridad).
  function resolverConfrontacion(via){
    if(!_corrida) return;
    const cf = _enConfrontacion;
    if(!cf) return;
    let mensaje = '';
    let fuerzaJugador = 0;
    let ruido = 0;
    let permiteEscape = false;
    let evita = false;     // resuelve sin medir fuerza (social/distracción)

    if(via === 'disparar'){
      if(_balas <= 0){ return; }
      _balas--;
      fuerzaJugador = 6;
      ruido = 35 + cf.ruidoExtra;
      mensaje = 'El perno sale con un chasquido que rebota en todo el pasillo. '
        + 'Resuelve, sí. Pero ahora medio distrito sabe dónde estás.';
      _fx('impacto', 0.6);
    } else if(via === 'amenazar'){
      // Farol: 55% de que recule, sin gastar nada. Si falla, te embiste.
      ruido = 8;
      if(Math.random() < 0.55){
        evita = true;
        mensaje = 'Levantas el arma vacía y sostienes la mirada. Funciona: '
          + 'retrocede despacio, sin darte la espalda del todo.';
      } else {
        fuerzaJugador = 0;
        mensaje = 'El arma vacía no engaña a quien ha visto muchas. Se te echa encima.';
      }
      _fx('inv_fallo', 0.5);
    } else if(via === 'recargar'){
      if(_lleva('cargador') && typeof quitarItem === 'function'){
        quitarItem('cargador', 1);
        _balas += BALAS_POR_CARGADOR;
      }
      // Recargar consume el turno: la amenaza te golpea suave mientras tanto.
      _integridad = Math.max(0, _integridad - 1);
      _pintarNodo();
      return;
    } else if(via === 'acuchillar'){
      fuerzaJugador = 4;
      ruido = 6;
      mensaje = 'Te acercas y resuelves de cerca, en silencio. '
        + 'Pero de cerca también te alcanzan a ti.';
      _fx('click_metal', 0.5);
    } else if(via === 'punos'){
      fuerzaJugador = 2;
      ruido = 3;
      mensaje = 'Sin más herramienta que las manos. Funciona a medias, '
        + 'y duele en ambos lados.';
      _fx('impacto', 0.45);
    } else if(via === 'justificar'){
      evita = true;
      ruido = 0;
      mensaje = (_bando === 'seguridad')
        ? 'Enseñas la placa. La autoridad de HELIX todavía pesa aquí abajo: '
          + 'baja la vista y se aparta.'
        : 'Enseñas los papeles. No los lee del todo, pero el sello basta. '
          + 'Te deja pasar con un gesto cansado.';
      _fx('inv_acierto', 0.5);
    } else if(via === 'sobornar'){
      if(_creditos() < 40) return;
      _cobrar(40);
      evita = true;
      ruido = 0;
      mensaje = 'Unos créditos cambian de mano. Nadie ha visto nada. '
        + 'Nadie ve nunca nada, si pagas lo justo.';
      _fx('energia', 0.5);
    } else if(via === 'distraer'){
      if(typeof quitarItem === 'function') quitarItem('senuelo', 1);
      permiteEscape = true;
      ruido = 12;
      mensaje = 'El señuelo escupe ruido a unos metros. La atención se va hacia allí '
        + 'el tiempo justo para que tú no estés cuando vuelva.';
      _fx('inv_acierto', 0.5);
    }

    // Aplicar ruido a la alerta.
    if(ruido) _alerta = Math.min(100, _alerta + ruido);

    // Resolución.
    let herida = 0;
    let resuelta = false;
    if(evita){
      resuelta = true;
    } else if(permiteEscape){
      // Escape: comparas tu sigilo (señuelo) contra su detección.
      resuelta = true; // el señuelo siempre abre hueco; el coste es el ruido
    } else {
      // Vía física: tu fuerza contra el umbral de la amenaza.
      if(fuerzaJugador >= cf.umbral){
        resuelta = true;
        // Aun ganando, las vías de cerca rozan.
        if(via === 'acuchillar') herida = 1;
        if(via === 'punos') herida = 1;
      } else {
        // No superas el umbral: la amenaza te hace daño según su fuerza,
        // menos lo que hayas restado peleando.
        resuelta = (fuerzaJugador > 0); // peleas pero te cuesta
        herida = Math.max(1, cf.fuerza - Math.floor(fuerzaJugador / 2));
      }
    }

    if(herida > 0) _integridad = Math.max(0, _integridad - herida);

    cf.resuelta = resuelta;

    // Pintar resultado y dar paso a avanzar (o caer).
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + mensaje + '</div>';
    if(herida > 0){
      html += '<div class="corrida-aviso">Te alcanzan. −' + herida + ' integridad.</div>';
    }
    if(_integridad <= 0){
      html += '<button class="btn-terminal" onclick="avanzarCorrida()">…</button>';
    } else {
      html += '<button class="btn-terminal" onclick="avanzarCorrida()">SEGUIR ADELANTE →</button>';
    }
    cont.innerHTML = html;
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
    html += '</div>';
    return html;
  }

  function _resolverObstaculo(via){
    if(!_corrida || !_corrida.nodos[_nodoIdx]) return;
    const nodo = _corrida.nodos[_nodoIdx];
    let msg = '';
    if(via === 'obst_pagar'){
      const coste = nodo.coste || 50;
      _cobrar(coste);
      msg = nodo.msgPagar || 'Pagas y la puerta se abre como si nunca hubiera estado cerrada.';
      _fx('energia', 0.5);
    } else {
      _alerta = Math.min(100, _alerta + (nodo.ruidoForzar || 20));
      msg = nodo.msgForzar || 'Lo fuerzas. Cede con estruendo. Alguien lo ha oído, seguro.';
      if(nodo.heridaForzar){ _integridad = Math.max(0, _integridad - nodo.heridaForzar); }
      _fx('impacto', 0.45);
    }
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + msg + '</div>';
    html += '<button class="btn-terminal" onclick="avanzarCorrida()">SEGUIR →</button>';
    cont.innerHTML = html;
    _guardar();
  }

  // ============================================================
  //  ENCUENTRO — un trato
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
    if(!_corrida || !_corrida.nodos[_nodoIdx]) return;
    const nodo = _corrida.nodos[_nodoIdx];
    let msg = '';
    if(via === 'enc_aceptar'){
      msg = nodo.msgAceptar || 'Aceptas.';
      if(typeof nodo.creditos === 'number'){ _botin += nodo.creditos; }
      if(nodo.itemRecompensa && typeof darItemPorId === 'function'){ darItemPorId(nodo.itemRecompensa); }
      if(typeof nodo.alertaAceptar === 'number'){ _alerta = Math.min(100, _alerta + nodo.alertaAceptar); }
      if(typeof nodo.heridaAceptar === 'number'){ _integridad = Math.max(0, _integridad - nodo.heridaAceptar); }
      _fx('inv_acierto', 0.5);
    } else {
      msg = nodo.msgRechazar || 'Sigues tu camino. No todo trato merece la pena.';
      _fx('inv_papel', 0.4);
    }
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + msg + '</div>';
    html += '<button class="btn-terminal" onclick="avanzarCorrida()">SEGUIR →</button>';
    cont.innerHTML = html;
    _guardar();
  }

  // ============================================================
  //  BIFURCACIÓN — rápida (riesgo) vs limpia
  // ============================================================
  function _pintarBifurcacion(nodo){
    let html = '<div class="corrida-ops">';
    html += _opNodo('bif_rapida', nodo.txtRapida || 'RUTA RÁPIDA',
      nodo.subRapida || 'Antes, pero peligrosa', 'corrida-op-fuego');
    html += _opNodo('bif_limpia', nodo.txtLimpia || 'RUTA LIMPIA',
      nodo.subLimpia || 'Más larga, más segura', 'corrida-op-util');
    html += '</div>';
    return html;
  }

  function _resolverBifurcacion(via){
    if(!_corrida || !_corrida.nodos[_nodoIdx]) return;
    const nodo = _corrida.nodos[_nodoIdx];
    let msg = '';
    if(via === 'bif_rapida'){
      _alerta = Math.min(100, _alerta + (nodo.alertaRapida || 15));
      if(typeof nodo.creditosRapida === 'number'){ _botin += nodo.creditosRapida; }
      msg = nodo.msgRapida || 'Cortas por lo peligroso. Ganas tiempo y te juegas el cuello.';
    } else {
      msg = nodo.msgLimpia || 'Das el rodeo. Más pasos, menos sustos.';
    }
    const cont = document.getElementById('corrida-wrap');
    let html = _hud();
    html += '<div class="corrida-narr">' + msg + '</div>';
    html += '<button class="btn-terminal" onclick="avanzarCorrida()">SEGUIR →</button>';
    cont.innerHTML = html;
    _guardar();
  }

  // ============================================================
  //  DESENLACE — paga + progreso, o fracaso
  // ============================================================
  function _resolverDesenlace(exito){
    const cfg = BANDOS[_bando];
    const c = _corrida;
    let paga = 0, progreso = 0, ascenso = null;

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
    if(via.indexOf('obst_') === 0) return _resolverObstaculo(via);
    if(via.indexOf('enc_') === 0) return _resolverEncuentro(via);
    if(via.indexOf('bif_') === 0) return _resolverBifurcacion(via);
  }

  // ── exponer al ámbito global (como hacen 62/63/64) ──────
  window.abrirCorrida = abrirCorrida;
  window.aceptarCorrida = aceptarCorrida;
  window.avanzarCorrida = avanzarCorrida;
  window.resolverConfrontacion = resolverConfrontacion;
  window.corridaAccionNodo = corridaAccionNodo;
  window.cerrarCorridaResuelta = cerrarCorridaResuelta;
  window.abandonarCorrida = abandonarCorrida;
  window.cerrarCorrida = cerrarCorrida;

})();
