// ============================================================
// BLOQUE JS-77 — CONVERSACIONES CON NPCS (v0.141)
// ------------------------------------------------------------
// Generaliza el chat de burbujas de Mara (30_mara.js + 31_dialogo.js)
// para reutilizarlo con cualquier NPC importante. Reaprovecha las
// mismas clases CSS (burbuja-dialogo, opcion-dialogo, pensando…), así
// que se ve idéntico, pero se monta sobre un PERFIL de NPC y se pinta
// en el contenedor que se le pase (el de la escena de explorar/deriva).
//
// Una escena de guion lanza una conversación con la opción:
//     { texto:'Acercarte.', conversa:'lena_fiesta', ... , resultado, lleva }
// El motor de escenas (44) aplica los efectos de la opción, abre la
// charla y, al cerrarse, muestra el 'resultado' y sigue por 'lleva'.
//
// PERFIL:
//   Conversacion.registrar('id', {
//     nombre:'LENA',
//     inicio:0,                       // índice de nodo inicial (def. 0)
//     sysIA:'...' | function,         // (opcional) prompt para el nodo IA
//     arbol:[ nodo, nodo, ... ]
//   });
//
// NODO:
//   { npc:'texto'|fn, opciones:[ {txt, ir, efectos?, s?} ], efectos?, fin? }
//   { esIA:true, fallback:'...', tras:[ {txt, ir, ...} ] }   // nodo IA opcional
//
// El nodo IA usa IA.llamar() de 37_ia_cliente.js de forma defensiva:
// si no hay clave/conexión o falla, usa 'fallback'. Nunca rompe la charla.
// ============================================================

window.Conversacion = (function(){
  const _perfiles = {};
  let _cont = null, _onFin = null, _perfil = null, _hist = [];

  function registrar(id, perfil){ _perfiles[id] = perfil; }

  function _scroll(){
    const s = document.getElementById('conv-scroll');
    if(s) s.scrollTop = s.scrollHeight;
  }

  function _nombreJugador(){
    try { return ((Estado.jugador.nombre||'') + ' ' + (Estado.jugador.apellido1||'')).trim().toUpperCase() || 'TÚ'; }
    catch(e){ return 'TÚ'; }
  }

  function _burbuja(quien, texto, esJ){
    return new Promise(res=>{
      const s = document.getElementById('conv-scroll');
      if(!s){ res(); return; }
      const b = document.createElement('div');
      b.className = 'burbuja-dialogo' + (esJ ? ' burbuja-jugador' : '');
      b.style.cssText = 'opacity:0;transform:translateY(8px);transition:all .4s ease';
      b.innerHTML = '<div class="burbuja-nombre">' + quien + '</div><div class="burbuja-texto">' + texto + '</div>';
      s.appendChild(b);
      setTimeout(()=>{ b.style.opacity='1'; b.style.transform='translateY(0)'; _scroll(); }, 40);
      setTimeout(res, 420);
    });
  }

  function _pintarOpciones(ops){
    const o = document.getElementById('conv-opc');
    if(!o) return;
    o.innerHTML = '';
    if(!ops || !ops.length){
      // sin opciones = fin de la charla
      const div = document.createElement('div'); div.className = 'opciones-dialogo';
      const btn = document.createElement('button');
      btn.className = 'opcion-dialogo';
      btn.setAttribute('data-num','01');
      btn.textContent = 'Despedirte.';
      btn.addEventListener('click', _terminar, { once:true });
      div.appendChild(btn); o.appendChild(div); _scroll();
      return;
    }
    const div = document.createElement('div'); div.className = 'opciones-dialogo';
    ops.forEach((op, i)=>{
      const btn = document.createElement('button');
      btn.className = 'opcion-dialogo' + (op.s ? ' silencio' : '');
      btn.setAttribute('data-num', '0' + (i+1));
      btn.textContent = op.txt;
      btn.addEventListener('click', ()=>_elegir(op), { once:true });
      div.appendChild(btn);
    });
    o.appendChild(div); _scroll();
  }

  async function _elegir(op){
    const o = document.getElementById('conv-opc'); if(o) o.innerHTML = '';
    if(op.txt) await _burbuja(_nombreJugador(), op.txt, true);
    _hist.push({ rol:'jugador', texto: op.txt || '' });
    if(op.efectos && typeof _egAplicarEfectos === 'function') _egAplicarEfectos(op.efectos);
    if(typeof op.ir === 'number'){ _nodo(op.ir); return; }
    _terminar();
  }

  async function _nodo(i){
    const n = _perfil.arbol[i];
    if(!n){ _terminar(); return; }
    const o = document.getElementById('conv-opc'); if(o) o.innerHTML = '';
    if(n.esIA){ await _nodoIA(n); return; }
    const t = (typeof n.npc === 'function') ? n.npc() : n.npc;
    if(t){ _hist.push({ rol:'npc', texto:t }); await _burbuja((_perfil.nombre||'').toUpperCase(), t, false); }
    if(n.efectos && typeof _egAplicarEfectos === 'function') _egAplicarEfectos(n.efectos);
    if(n.fin){ _terminar(); return; }
    setTimeout(()=>_pintarOpciones(n.opciones || []), 160);
  }

  async function _nodoIA(n){
    const s = document.getElementById('conv-scroll');
    let p = null;
    if(s){
      p = document.createElement('div'); p.className = 'pensando';
      p.innerHTML = '<span style="color:var(--magenta-dim)">' + (_perfil.nombre||'').toUpperCase()
        + '</span><span class="dots-pensando"><span>·</span><span>·</span><span>·</span></span>';
      s.appendChild(p); _scroll();
    }
    let linea = null;
    try{
      if(window.IA && typeof IA.llamar === 'function' && !(window.LAUNCHER && LAUNCHER.IA_ACTIVA === false)){
        const base = (typeof _perfil.sysIA === 'function') ? _perfil.sysIA() : (_perfil.sysIA || '');
        const sys = base + '\nResponde SOLO con un objeto JSON {"linea":"..."} de 1 a 2 frases cortas, '
          + 'en español, en personaje, con subtexto noir y sin exposición. Nada fuera del JSON.';
        const ctx = _hist.slice(-6).map(h => (h.rol==='jugador' ? 'Jugador: ' : (_perfil.nombre+': ')) + h.texto).join('\n');
        const r = await IA.llamar(sys, ctx || 'Di algo breve, en personaje.');
        if(r && r.ok){ linea = r.linea || r.texto || (r.datos && r.datos.linea) || null; }
      }
    }catch(e){ linea = null; }
    if(s && p && p.parentNode) s.removeChild(p);
    if(!linea || typeof linea !== 'string') linea = n.fallback || '…';
    _hist.push({ rol:'npc', texto:linea });
    await _burbuja((_perfil.nombre||'').toUpperCase(), linea, false);
    setTimeout(()=>_pintarOpciones(n.tras || []), 160);
  }

  function _terminar(){
    const f = _onFin; _onFin = null; _perfil = null;
    if(typeof f === 'function') f();
  }

  // Lanza una conversación dentro de 'contId'. onFin se llama al cerrarse.
  function abrir(id, contId, onFin){
    _perfil = _perfiles[id];
    _cont = document.getElementById(contId || 'explorar-cuerpo');
    if(!_perfil || !_cont){ if(typeof onFin === 'function') onFin(); return; }
    _onFin = onFin; _hist = [];
    _cont.innerHTML = '<div id="conv-scroll" style="max-height:62vh;overflow-y:auto;padding:0.4rem 0;"></div>'
      + '<div id="conv-opc" style="margin-top:0.6rem;"></div>';
    _nodo(typeof _perfil.inicio === 'number' ? _perfil.inicio : 0);
  }

  return { registrar, abrir, _perfiles };
})();
