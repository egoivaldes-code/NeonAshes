// ============================================================
// BLOQUE JS-92 — KO POR COMBATE + MUERTE POR COMBATE (v0.157)
// ------------------------------------------------------------
// Dos capas de "caer" en un combate, según la letalidad del
// contexto (la marca el motor js/67 con _letalActual):
//
//   NO LETAL (trabajos/profesiones) -> KO:
//     fundido -> despiertas en el apartamento una semana después
//     -> FACTURA de HELIX (escala) -> a la 3ª recogida, FICHADO
//     (bandera ca_fichado, la misma que ya usa el permiso revocado
//     del 0.155). El KO alimenta al antagonista.
//
//   LETAL (exploración libre / misión principal) -> MUERTE real:
//     usa el sistema de muerte existente (dispararMuerte) con una
//     causa nueva 'combate'. Antes de morir, si había misión en
//     marcha, se guarda como HEREDABLE en el archivo del mundo.
//
// HERENCIA DE MISIÓN (blindada): al arrancar el nuevo personaje,
//   si —y solo si— el archivo del mundo tiene misión heredable,
//   se restaura el tramaNivel y Mara vuelve a contactar. Si no la
//   hay (partida nueva de verdad), el arranque queda EXACTAMENTE
//   como hoy: esta función no toca nada.
//
// Todo va envuelto en try/catch: pase lo que pase, nunca debe
// romper el juego.
// ============================================================

(function(){

  // Texto de muerte por combate (extiende el mapa existente de js/11).
  try{
    if(typeof TEXTOS_MUERTE !== 'undefined'){
      TEXTOS_MUERTE.combate =
        'No hubo un final heroico. Hubo un golpe de más, el suelo,<br>' +
        'y una calle que siguió moviéndose sin ti.<br>' +
        'En las Pilas nadie es imprescindible.<br>' +
        'Pero todo lo que tocaste deja rastro.';
    }
  }catch(e){}

  // ── Guardar la misión como heredable justo antes de morir ────
  function guardarMisionHeredable(){
    try{
      if(typeof cargarArchivoMundo !== 'function' || typeof guardarArchivoMundo !== 'function') return;
      const m = Estado.memoria || {};
      const trama = (typeof m.tramaNivel === 'number') ? m.tramaNivel : 0;
      const misionActiva = !!Estado.mision || trama > 0 ||
                           m.vioMensajeMaraEnTerminal === true || (m.confianzaMara || 0) > 0;
      if(!misionActiva) return; // no había nada que heredar
      const archivo = cargarArchivoMundo();
      archivo.misionHeredable = { tramaNivel: trama, mision: (Estado.mision || null) };
      guardarArchivoMundo(archivo);
    }catch(e){}
  }
  window.guardarMisionHeredable = guardarMisionHeredable;

  // ── Restaurar la misión en el heredero (BLINDADO) ────────────
  // Se llama al entrar al apartamento del personaje nuevo. Si no hay
  // misión heredable, no hace absolutamente nada (arranque intacto).
  function restaurarMisionHeredada(){
    try{
      if(typeof cargarArchivoMundo !== 'function') return;
      const archivo = cargarArchivoMundo();
      const h = archivo.misionHeredable;
      if(!h) return; // ← BLINDAJE: partida nueva normal, no tocamos nada

      Estado.memoria = Estado.memoria || {};
      // El mundo recuerda el avance de la trama (no lo personal del muerto).
      if(typeof h.tramaNivel === 'number' && h.tramaNivel > (Estado.memoria.tramaNivel || 0)){
        Estado.memoria.tramaNivel = h.tramaNivel;
      }
      if(h.mision) Estado.mision = h.mision;

      // Mara vuelve a contactar al nuevo inquilino: reengancha el hilo.
      Estado.memoria.vioMensajeMaraEnTerminal = false;
      Estado.memoria.maraRetoma = true; // por si se quiere variar el texto luego
      Estado.terminalPendientes = Estado.terminalPendientes || [];
      if(!Estado.terminalPendientes.some(p => p && p.tipo === 'misionMara')){
        Estado.terminalPendientes.push({ tipo: 'misionMara' });
      }

      // Quemar la herencia de misión (una sola vez).
      archivo.misionHeredable = null;
      if(typeof guardarArchivoMundo === 'function') guardarArchivoMundo(archivo);
      if(typeof guardarPartida === 'function') guardarPartida();
    }catch(e){}
  }
  window.restaurarMisionHeredada = restaurarMisionHeredada;

  // ── MUERTE por combate (contexto letal) ──────────────────────
  function muertePorCombate(){
    try{
      guardarMisionHeredable();
      if(typeof dispararMuerte === 'function'){ dispararMuerte('combate'); }
    }catch(e){}
  }
  window.muertePorCombate = muertePorCombate;

  // ── KO por combate (contexto no letal: trabajos) ─────────────
  const SEMANA_MIN = 7 * 24 * 60;

  function _marcarFlag(f){
    try{
      Estado.momentosVistos = Estado.momentosVistos || [];
      if(Estado.momentosVistos.indexOf(f) === -1) Estado.momentosVistos.push(f);
    }catch(e){}
  }

  function koPorCombate(){
    try{
      Estado.vecesKO = (Estado.vecesKO || 0) + 1;
      const n = Estado.vecesKO;
      const importe = 150 + 100 * (n - 1); // 150, 250, 350...

      // Pasa una semana.
      if(typeof avanzarTiempoJuego === 'function') avanzarTiempoJuego(SEMANA_MIN);

      // Factura: cobra lo que pueda; el resto queda impagado (deuda).
      const saldo = Estado.creditos || 0;
      const pagado = Math.min(saldo, importe);
      if(pagado > 0 && typeof ajustarCreditos === 'function') ajustarCreditos(-pagado);
      const deuda = importe - pagado;
      try{
        Estado.recibos = Estado.recibos || [];
        const fecha = (typeof obtenerFechaJuego === 'function') ? obtenerFechaJuego().getTime() : Date.now();
        Estado.recibos.unshift({
          fecha: fecha,
          concepto: 'HELIX · Estabilización y transporte de urgencia',
          importe: importe,
          pagado: deuda === 0,
          saldoTras: Estado.creditos || 0
        });
      }catch(e){}

      // Fichado a la 3ª recogida: alimenta al antagonista (permiso revocado 0.155).
      let fichadoAhora = false;
      if(n >= 3){
        const yaFichado = (Estado.momentosVistos || []).indexOf('ca_fichado') !== -1;
        if(!yaFichado) fichadoAhora = true;
        _marcarFlag('ca_fichado');
      }

      _pantallaKO(importe, deuda, fichadoAhora);
      if(typeof guardarPartida === 'function') guardarPartida();
    }catch(e){
      // Si algo fallara, no dejamos al jugador colgado: al apartamento.
      try{ despertarDelKO(); }catch(_){}
    }
  }
  window.koPorCombate = koPorCombate;

  function _pantallaKO(importe, deuda, fichadoAhora){
    try{
      // Parar procesos vivos, como en la muerte, para reengancharlos limpios al despertar.
      if(typeof detenerDecaimientoPasivo === 'function') detenerDecaimientoPasivo();
      if(typeof detenerCobrosPeriódicos === 'function') detenerCobrosPeriódicos();
      if(typeof ocultarRelojDiegético === 'function') ocultarRelojDiegético();
      const panel = document.getElementById('hub-panel');
      if(panel) panel.classList.remove('activo');
      document.body.classList.remove('panel-abierto');
      document.body.classList.remove('explorar-activo');
      document.body.classList.remove('terminal-escritorio-activo');
      if(typeof mostrarHUD === 'function') mostrarHUD(false);

      let txt =
        'Todo se apaga. No hay dolor, solo un apagón limpio, casi administrativo.<br><br>' +
        'Despiertas en tu apartamento. La luz que entra por la ventana es distinta: ha pasado una semana. ' +
        'En el terminal parpadea un único aviso, sin remite, con el sello de HELIX:<br><br>' +
        '<span style="color:var(--magenta)">«Sujeto estabilizado y devuelto a su domicilio. Sin nosotros no habría amanecido. Se adjunta la cuenta.»</span>' +
        '<br><br>FACTURA HELIX: ' + importe + ' CR';
      if(deuda > 0) txt += '<br>IMPAGADO: ' + deuda + ' CR (queda en tus recibos)';
      if(fichadoAhora){
        txt += '<br><br><span style="color:var(--magenta)">Tu expediente queda MARCADO. A partir de ahora, algunas puertas dejarán de reconocerte.</span>';
      }

      const textoEl = document.getElementById('ko-texto');
      if(textoEl) textoEl.innerHTML = txt;

      document.querySelectorAll('.escena.activa').forEach(esc => esc.classList.remove('activa'));
      const koEscena = document.getElementById('ko-escena');
      if(koEscena){ koEscena.classList.add('activa'); }
      else { despertarDelKO(); } // sin DOM de KO, al menos vuelve al apartamento
    }catch(e){ try{ despertarDelKO(); }catch(_){} }
  }

  // ── Despertar: volver al apartamento con los procesos limpios ─
  function despertarDelKO(){
    try{
      const koEscena = document.getElementById('ko-escena');
      if(koEscena) koEscena.classList.remove('activa');
      const apt = document.getElementById('apartamento');
      if(apt) apt.classList.add('activa');
      if(typeof iniciarApartamento === 'function') iniciarApartamento();
      if(typeof mostrarHUD === 'function') mostrarHUD(true);
      if(typeof actualizarHUD === 'function') actualizarHUD();
      if(typeof iniciarRelojDiegético === 'function') iniciarRelojDiegético();
      if(typeof iniciarDecaimientoPasivo === 'function') iniciarDecaimientoPasivo();
      if(typeof iniciarCobrosPeriódicos === 'function') iniciarCobrosPeriódicos();
    }catch(e){}
  }
  window.despertarDelKO = despertarDelKO;

})();
