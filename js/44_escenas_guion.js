// ============================================================
// BLOQUE JS-44 — ESCENAS DE GUION (escritas a mano)
// ------------------------------------------------------------
// QUÉ ES:
//   Un sistema de escenas ESCRITAS A MANO para la exploración.
//   A diferencia de la deriva con IA (41_explorar.js), aquí cada
//   escena está fijada: su texto, su imagen y sus opciones no
//   cambian entre partidas. Las opciones pueden:
//     · cerrar el momento (volver a explorar), o
//     · llevar a OTRA escena por su id (cadenas / mini-misiones).
//
//   Cada escena y cada opción admiten:
//     · condiciones de aparición  (cond)
//     · requisitos para una opción (req) -> si no se cumplen, la
//       opción aparece BLOQUEADA (visible pero no pulsable)
//     · efectos sobre el estado     (efectos)
//     · resultado con azar          (azar)
//     · agotamiento: un momento visto no vuelve a salir.
//
//   El catálogo de escenas vive en 45_escenas_datos.js (los datos).
//   Este archivo es solo el MOTOR que las lee y ejecuta.
// ============================================================

// Momentos ya consumidos en esta partida (se agotan).
function _egAsegurarVistos(){
  if(!Estado.momentosVistos || !Array.isArray(Estado.momentosVistos)){
    Estado.momentosVistos = [];
  }
  return Estado.momentosVistos;
}

// ------------------------------------------------------------
// CADENAS (missionchains) — control de "una parte por run".
// Una escena de entrada puede declarar  cadena:'kepler'  (un id de
// cadena). Regla: en una misma run de exploración solo puede avanzar
// UNA parte de cada cadena. Al avanzar una parte, apuntamos su cadena
// aquí; mientras dure la run, no se ofrecen más entradas de esa cadena.
// Esto se reinicia al empezar cada nueva run (lo hace explorar).
// ------------------------------------------------------------
window._cadenasTocadasEnRun = window._cadenasTocadasEnRun || [];

// Contenedor donde el reproductor pinta. Por defecto, el del explorar
// viejo. La deriva libre (v0.120) lo cambia a 'corrida-wrap' para
// reproducir estas mismas escenas dentro de su panel.
let _egCont = 'explorar-cuerpo';
function egFijarContenedor(id){ _egCont = id || 'explorar-cuerpo'; }
window.egFijarContenedor = egFijarContenedor;

// Llamar al INICIO de cada run de exploración para resetear el límite.
function reiniciarCadenasDeRun(){
  window._cadenasTocadasEnRun = [];
}
window.reiniciarCadenasDeRun = reiniciarCadenasDeRun;

// ------------------------------------------------------------
// EVALUACIÓN DE CONDICIONES / REQUISITOS
// Una condición es un objeto con claves opcionales. TODAS deben
// cumplirse. Ejemplos:
//   { item:'papel_helix' }                 -> tiene ese objeto
//   { noItem:'llave' }                      -> NO tiene ese objeto
//   { creditosMin:50 }                      -> tiene >=50 créditos
//   { faccion:'eco', repMin:10 }            -> reputación Eco >=10
//   { faccion:'sindicatos', repMax:-5 }     -> reputación <=-5
//   { fatigaMax:80 }                        -> fatiga <=80
//   { visto:'callejon_voz' }                -> ya vivió ese momento
//   { noVisto:'callejon_voz' }              -> aún no lo vivió
// ------------------------------------------------------------
function _egCumple(cond){
  if(!cond) return true;
  try{
    if(cond.item && !(typeof tieneItem==='function' && tieneItem(cond.item))) return false;
    if(cond.noItem && (typeof tieneItem==='function' && tieneItem(cond.noItem))) return false;
    if(typeof cond.creditosMin === 'number' && (Estado.creditos||0) < cond.creditosMin) return false;
    if(typeof cond.creditosMax === 'number' && (Estado.creditos||0) > cond.creditosMax) return false;
    if(cond.faccion && typeof getRepFaccion === 'function'){
      const rep = getRepFaccion(cond.faccion);
      if(typeof cond.repMin === 'number' && rep < cond.repMin) return false;
      if(typeof cond.repMax === 'number' && rep > cond.repMax) return false;
    }
    const h = (Estado.humano||{});
    if(typeof cond.fatigaMin==='number' && (h.fatiga||0) < cond.fatigaMin) return false;
    if(typeof cond.fatigaMax==='number' && (h.fatiga||0) > cond.fatigaMax) return false;
    if(typeof cond.aislamientoMin==='number' && (h.aislamiento||0) < cond.aislamientoMin) return false;
    if(typeof cond.disociacionMin==='number' && (h.disociacion||0) < cond.disociacionMin) return false;
    const vistos = _egAsegurarVistos();
    if(cond.visto && vistos.indexOf(cond.visto) === -1) return false;
    if(cond.noVisto && vistos.indexOf(cond.noVisto) !== -1) return false;
    // Franja horaria (v0.141): cond.franja puede ser 'noche' o ['noche','anochecer'].
    if(cond.franja && typeof franjaHoraria === 'function'){
      const f = franjaHoraria();
      const lista = Array.isArray(cond.franja) ? cond.franja : [cond.franja];
      if(lista.indexOf(f) === -1) return false;
    }
    if(cond.noFranja && typeof franjaHoraria === 'function'){
      const f = franjaHoraria();
      const lista = Array.isArray(cond.noFranja) ? cond.noFranja : [cond.noFranja];
      if(lista.indexOf(f) !== -1) return false;
    }
    if(cond.npcConocido && !(typeof haVistoNpc==='function' && haVistoNpc(cond.npcConocido))) return false;
    if(cond.npcNoConocido && (typeof haVistoNpc==='function' && haVistoNpc(cond.npcNoConocido))) return false;
    if(cond.vinculoMin && typeof vinculoNpc==='function'){
      if(vinculoNpc(cond.vinculoMin.id) < (cond.vinculoMin.n || 1)) return false;
    }
    // Profesión: el evento solo existe para quien ejerce ese oficio.
    // cond.profesion puede ser un id ('scavenger') o {id, rangoMin}.
    if(cond.profesion){
      const _pr = (typeof cond.profesion === 'string') ? { id: cond.profesion } : cond.profesion;
      if(!(typeof tieneProfesion === 'function' && tieneProfesion(_pr.id))) return false;
      if(typeof _pr.rangoMin === 'number'){
        const _ep = (typeof estadoProfesion === 'function') ? estadoProfesion(_pr.id) : null;
        if(!_ep || (_ep.rango || 0) < _pr.rangoMin) return false;
      }
    }
  }catch(e){ return true; }
  return true;
}

// ------------------------------------------------------------
// APLICAR EFECTOS de una opción al estado del jugador.
// Un bloque de efectos admite (todas opcionales):
//   { creditos:-50 }                         -> ajusta créditos
//   { fatiga:+10, aislamiento:-5, hambre:+8, disociacion:+15 }
//   { item:'papel_helix' }                   -> da un objeto (por id del catálogo)
//   { quitaItem:'llave' }                    -> quita un objeto
//   { condicion:'herida_arma' }              -> aplica una condición médica
//   { quitaCondicion:'mareo' }               -> la cura
//   { faccion:'eco', rep:+5 }                -> cambia reputación
// ------------------------------------------------------------
function _egAplicarEfectos(ef){
  if(!ef) return;
  try{
    if(typeof ef.creditos === 'number' && typeof ajustarCreditos==='function') ajustarCreditos(ef.creditos);
    const h = Estado.humano || (Estado.humano = {});
    ['fatiga','aislamiento','hambre','disociacion'].forEach(k=>{
      if(typeof ef[k] === 'number'){ h[k] = Math.max(0, Math.min(100, (h[k]||0) + ef[k])); }
    });
    if(ef.item && typeof darItemPorId === 'function') darItemPorId(ef.item);
    else if(ef.item && typeof darItem === 'function' && typeof CATALOGO_ITEMS_EXPLORAR !== 'undefined'){
      const it = (CATALOGO_ITEMS_EXPLORAR||[]).find(x=>x.id===ef.item); if(it) darItem(it);
    }
    if(ef.quitaItem && typeof quitarItem === 'function') quitarItem(ef.quitaItem, 1);
    if(ef.condicion && typeof aplicarCondicion === 'function') aplicarCondicion(ef.condicion);
    if(ef.quitaCondicion && typeof quitarCondicion === 'function') quitarCondicion(ef.quitaCondicion);
    // quitaCondiciones: ['hemorragia','conmocion',...] — cura varias de golpe
    // (p.ej. una médica de confianza que te deja como nuevo).
    if(Array.isArray(ef.quitaCondiciones) && typeof quitarCondicion === 'function'){
      ef.quitaCondiciones.forEach(c => { if(c) quitarCondicion(c); });
    }
    if(ef.faccion && typeof ef.rep === 'number' && typeof cambiarRepFaccion === 'function'){
      cambiarRepFaccion(ef.faccion, ef.rep);
    }
    // Varias facciones a la vez: ef.facciones = [{faccion, rep}, ...]
    if(Array.isArray(ef.facciones) && typeof cambiarRepFaccion === 'function'){
      ef.facciones.forEach(fr => {
        if(fr && fr.faccion && typeof fr.rep === 'number') cambiarRepFaccion(fr.faccion, fr.rep);
      });
    }
    // marcaVisto: registra una bandera narrativa (p.ej. 'mano_roja_muerta')
    // para que otras escenas puedan condicionar con visto/noVisto.
    if(ef.marcaVisto){
      const v = _egAsegurarVistos();
      if(v.indexOf(ef.marcaVisto) === -1) v.push(ef.marcaVisto);
      if(typeof guardarEstado === 'function') guardarEstado();
      // v0.161: si la decisión genera titular, enciende el aviso de NOTICIAS.
      if(typeof marcaGeneraNoticia === 'function' && marcaGeneraNoticia(ef.marcaVisto)
         && typeof marcarNoticiasActualizadas === 'function') marcarNoticiasActualizadas();
    }
    // marcas: varias banderas de una vez (p.ej. una semilla + "capítulo hecho"),
    // porque un bloque de efectos solo lleva un marcaVisto.
    if(Array.isArray(ef.marcas)){
      const v = _egAsegurarVistos();
      let _hayNoticia = false;
      ef.marcas.forEach(m=>{
        if(m && v.indexOf(m) === -1) v.push(m);
        if(typeof marcaGeneraNoticia === 'function' && marcaGeneraNoticia(m)) _hayNoticia = true;
      });
      if(typeof guardarEstado === 'function') guardarEstado();
      // v0.161: si alguna de las marcas genera titular, enciende el aviso.
      if(_hayNoticia && typeof marcarNoticiasActualizadas === 'function') marcarNoticiasActualizadas();
    }
    // NPCs recurrentes: conocer a alguien y/o estrechar el vínculo.
    if(ef.conocer && typeof marcarNpcVisto === 'function') marcarNpcVisto(ef.conocer);
    if(ef.vinculo && typeof subirVinculo === 'function') subirVinculo(ef.vinculo.id, ef.vinculo.mas);
    // Progreso de oficio: recompensa por ganar peleas de cadena de profesión.
    // ef.progresoOficio = { id:'<oficio>', n:<progreso> }. Suma progreso (y
    // asciende si toca) sin pagar créditos. (v0.134)
    if(ef.progresoOficio && ef.progresoOficio.id && typeof otorgarRecompensaProfesion === 'function'){
      otorgarRecompensaProfesion(ef.progresoOficio.id, 0, ef.progresoOficio.n || 0);
    }
    // Fragmento de Memoria entregado por una escena/misión (hilo rojo Centauri).
    // ef.fragmento = '<id>'. Lo otorga vía Trama (idempotente): registra el
    // fragmento, sube la bandera de trama al acto del fragmento y muestra el
    // overlay diegético. Es la vía para los fragmentos DADOS por misión, frente
    // a los que caen solos por el sandbox (intentarPrimerFragmento).
    if(ef.fragmento && window.Trama && typeof Trama.ganar === 'function'){
      try{ Trama.ganar(ef.fragmento); }catch(e){}
    }
    if(typeof actualizarHUD === 'function') actualizarHUD();
  }catch(e){}
}

// ------------------------------------------------------------
// SELECCIÓN: devuelve los momentos de guion disponibles ahora
// (cumplen condición de aparición y no están agotados).
// Solo se consideran escenas marcadas como "entrada" (inicio de
// un momento). Las escenas internas de una cadena no salen solas.
// ------------------------------------------------------------
function escenasGuionDisponibles(){
  if(typeof ESCENAS_GUION === 'undefined') return [];
  const vistos = _egAsegurarVistos();
  const cadenasTocadas = window._cadenasTocadasEnRun || [];
  return Object.keys(ESCENAS_GUION).filter(id=>{
    const e = ESCENAS_GUION[id];
    if(!e || !e.entrada) return false;
    if(vistos.indexOf(id) !== -1) return false;   // agotado
    // Una parte de cadena por run: si su cadena ya avanzó en esta run, no.
    if(e.cadena && cadenasTocadas.indexOf(e.cadena) !== -1) return false;
    return _egCumple(e.cond);
  });
}

// ¿Hay algún momento a mano disponible? (lo usa la exploración para
// decidir si lanzar uno escrito en vez de una escena de IA.)
function hayEscenaGuionDisponible(){
  return escenasGuionDisponibles().length > 0;
}

// Elige un momento de entrada al azar entre los disponibles.
function elegirEscenaGuion(){
  const ids = escenasGuionDisponibles();
  if(ids.length === 0) return null;
  return ids[Math.floor(Math.random()*ids.length)];
}

// ------------------------------------------------------------
// REPRODUCIR una escena de guion por id. Pinta texto + opciones
// en el contenedor de exploración (#exp-cont). Llama a:
//   onCerrar()  -> cuando el momento termina (volver a explorar)
// ------------------------------------------------------------
function reproducirEscenaGuion(id, onCerrar){
  if(typeof ESCENAS_GUION === 'undefined' || !ESCENAS_GUION[id]){
    if(typeof onCerrar === 'function') onCerrar();
    return;
  }
  const e = ESCENAS_GUION[id];

  // marcar como visto el momento de ENTRADA (se agota una vez).
  // Excepción: las escenas 'repetible' (p.ej. reencuentros con un NPC de
  // vínculo alto) no se agotan, para que el personaje pueda volver a salir.
  if(e.entrada && !e.repetible){
    const vistos = _egAsegurarVistos();
    if(vistos.indexOf(id) === -1) vistos.push(id);
    // Si es parte de una cadena, bloquear más partes de esa cadena en esta run.
    if(e.cadena && (window._cadenasTocadasEnRun||[]).indexOf(e.cadena) === -1){
      window._cadenasTocadasEnRun.push(e.cadena);
    }
    if(typeof guardarEstado === 'function') guardarEstado();
  }

  // imagen de fondo de la escena (clave de ASSETS) con destello/transición
  const _imgFondo = (e.img && typeof fondoConVariante === 'function') ? fondoConVariante(e.img) : e.img;
  if(_imgFondo && typeof setBgEscenaExplorar === 'function'){
    setBgEscenaExplorar(_imgFondo);
  } else if(_imgFondo && typeof ASSETS !== 'undefined' && ASSETS[_imgFondo]){
    const capa = document.getElementById('explorar-fondo');
    if(capa) capa.style.backgroundImage = `url('${ASSETS[_imgFondo]}')`;
  }

  const cont = document.getElementById(_egCont);
  if(!cont){ if(typeof onCerrar==='function') onCerrar(); return; }

  // texto de la escena
  const texto = (typeof e.texto === 'function') ? e.texto() : e.texto;
  let html = `<div class="exp-narracion eg-texto">${texto}</div>`;
  html += `<div class="exp-opciones" id="eg-opciones"></div>`;
  cont.innerHTML = html;

  // pintar opciones
  const cajaOpc = document.getElementById('eg-opciones');
  (e.opciones || []).forEach((op, i)=>{
    // ¿se muestra esta opción? (cond de opción)
    if(op.cond && !_egCumple(op.cond)) return;
    const bloqueada = op.req && !_egCumple(op.req);
    const btn = document.createElement('button');
    btn.className = 'exp-opcion' + (bloqueada ? ' eg-bloqueada' : '');
    btn.innerHTML = op.texto + (bloqueada && op.pista ? ` <span class="eg-pista">(${op.pista})</span>` : '');
    if(bloqueada){
      btn.disabled = true;
    } else {
      btn.addEventListener('click', ()=>_egResolverOpcion(op, onCerrar), { once:true });
    }
    cajaOpc.appendChild(btn);
  });

  // si por condiciones no quedó ninguna opción, cerramos con un botón seguir
  if(cajaOpc.children.length === 0){
    const btn = document.createElement('button');
    btn.className = 'exp-opcion';
    btn.textContent = 'Seguir caminando.';
    btn.addEventListener('click', ()=>{ if(typeof onCerrar==='function') onCerrar(); }, { once:true });
    cajaOpc.appendChild(btn);
  }
}

// Resuelve una opción: aplica efectos, gestiona azar, y salta o cierra.
function _egResolverOpcion(op, onCerrar){
  // resultado con azar: { prob:0.6, exito:{...}, fallo:{...} }
  let rama = op;
  if(op.azar && typeof op.azar.prob === 'number'){
    const ok = Math.random() < op.azar.prob;
    rama = ok ? (op.azar.exito||{}) : (op.azar.fallo||{});
  }

  // efectos (de la opción y, si hubo azar, de la rama)
  _egAplicarEfectos(op.efectos);
  if(rama !== op) _egAplicarEfectos(rama.efectos);

  // HILO ROJO (Centauri): tras cualquier acción del sandbox, hay una
  // probabilidad baja de que "suba" el primer Fragmento de Memoria —
  // pero solo si el jugador ya completó el encargo de Mara y la trama
  // sigue dormida. Es de un solo uso; el módulo se encarga del resto.
  if(window.Trama && typeof Trama.intentarPrimerFragmento === 'function'){
    try{ Trama.intentarPrimerFragmento(0.10); }catch(e){}
  }

  // texto de resultado opcional (se muestra antes de continuar)
  const resultado = rama.resultado || op.resultado;
  const destino = rama.lleva || op.lleva;
  // pelea opcional: { texto, enemigos, integridad, refuerzo..., gana, pierde }
  const pelea = rama.pelea || op.pelea;

  const irAlDestino = ()=>{
    if(destino && typeof ESCENAS_GUION !== 'undefined' && ESCENAS_GUION[destino]){
      reproducirEscenaGuion(destino, onCerrar);
    } else {
      if(typeof onCerrar === 'function') onCerrar();   // cierra el momento
    }
  };

  // CONVERSACIÓN (v0.141): la opción puede abrir un chat de burbujas con un
  // NPC (sistema generalizado de Mara). Tras la charla, mostramos el
  // 'resultado' (si lo hay) y seguimos por 'lleva'/cierre como siempre.
  const conversa = rama.conversa || op.conversa;
  if(conversa && window.Conversacion && typeof Conversacion.abrir === 'function'){
    Conversacion.abrir(conversa, _egCont, ()=>{
      if(resultado){
        const cont = document.getElementById(_egCont);
        if(cont){
          cont.innerHTML = `<div class="exp-narracion eg-texto eg-resultado">${resultado}</div>`
            + `<div class="exp-opciones" id="eg-opciones"></div>`;
          const caja = document.getElementById('eg-opciones');
          const btn = document.createElement('button');
          btn.className = 'exp-opcion';
          btn.textContent = destino ? 'Continuar.' : 'Seguir caminando.';
          btn.addEventListener('click', irAlDestino, { once:true });
          caja.appendChild(btn);
          return;
        }
      }
      irAlDestino();
    });
    return;
  }

  // Si la opción desemboca en una PELEA, la lanzamos (con el equipo que
  // lleve el jugador) y la historia se reanuda por la rama de ganar/perder.
  const lanzarPelea = ()=>{
    if(pelea && typeof iniciarCombateDesdeEscena === 'function'){
      iniciarCombateDesdeEscena({
        letal: pelea.letal, // v0.158: la escena decide si su pelea puede matar
        texto: pelea.texto,
        enemigos: pelea.enemigos,
        integridad: pelea.integridad || 10,
        refuerzoSiRuido: pelea.refuerzoSiRuido,
        refuerzoGrupo: pelea.refuerzoGrupo,
        refuerzoTurno: pelea.refuerzoTurno,
        refuerzoTurnoGrupo: pelea.refuerzoTurnoGrupo,
        onGana: ()=>{
          // Recompensa de progreso por ganar la pelea (cadenas de oficio).
          if(pelea.progresoOficio) _egAplicarEfectos({ progresoOficio: pelea.progresoOficio });
          if(pelea.gana) reproducirEscenaGuion(pelea.gana, onCerrar); else irAlDestino();
        },
        onPierde: ()=>{ if(pelea.pierde) reproducirEscenaGuion(pelea.pierde, onCerrar); else irAlDestino(); }
      });
      return true;
    }
    return false;
  };

  if(pelea){
    // Mostramos el texto de resultado (si lo hay) con un botón que lanza la
    // pelea; si no hay texto, vamos directos al combate.
    const cont = document.getElementById(_egCont);
    if(resultado && cont){
      cont.innerHTML = `<div class="exp-narracion eg-texto eg-resultado">${resultado}</div>`
        + `<div class="exp-opciones" id="eg-opciones"></div>`;
      const caja = document.getElementById('eg-opciones');
      const btn = document.createElement('button');
      btn.className = 'exp-opcion';
      btn.textContent = 'Encararlo.';
      btn.addEventListener('click', ()=>{ if(!lanzarPelea()) irAlDestino(); }, { once:true });
      caja.appendChild(btn);
      return;
    }
    if(lanzarPelea()) return;
    // Si por lo que sea no se pudo lanzar, seguimos el flujo normal.
  }

  if(resultado){
    const cont = document.getElementById(_egCont);
    if(cont){
      cont.innerHTML = `<div class="exp-narracion eg-texto eg-resultado">${resultado}</div>`
        + `<div class="exp-opciones" id="eg-opciones"></div>`;
      const caja = document.getElementById('eg-opciones');
      const btn = document.createElement('button');
      btn.className = 'exp-opcion';
      btn.textContent = destino ? 'Continuar.' : 'Seguir caminando.';
      btn.addEventListener('click', irAlDestino, { once:true });
      caja.appendChild(btn);
      return;
    }
  }
  irAlDestino();
}

// Exponer al resto del juego
window.hayEscenaGuionDisponible = hayEscenaGuionDisponible;
window.elegirEscenaGuion = elegirEscenaGuion;
window.reproducirEscenaGuion = reproducirEscenaGuion;
