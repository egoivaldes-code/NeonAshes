// ============================================================
// BLOQUE JS-79 — TRAMA CENTAURI (HILO ROJO)
// ------------------------------------------------------------
// Primer cimiento de la misión principal. NO es "la misión": es
// la infraestructura silenciosa sobre la que se sembrará, poco a
// poco, el hilo rojo de Centauri / CERO.
//
// Contiene tres cosas y nada más (a propósito):
//   1. Una BANDERA DE PROGRESO de trama (nivel 0-6). Arranca en 0.
//   2. El catálogo de FRAGMENTOS DE MEMORIA (coleccionables escritos
//      a mano, cortos y sensoriales). De momento, solo el primero.
//   3. La lógica para que ese primer fragmento CAIGA SOLO, durante
//      el trabajo normal del sandbox, una única vez, sin avisar.
//
// El estado vive DENTRO de Estado.memoria (tramaNivel, fragmentos),
// así que viaja gratis en el guardado/carga existente. El módulo se
// "autocura": si una partida vieja no tiene esos campos, los crea al
// vuelo en nivel 0. No hay que tocar la persistencia.
//
// REGLAS (de 11_MISION_PRINCIPAL.txt, no negociables):
//   · El jugador NO persigue la trama: tropieza con ella.
//   · El primer fragmento llega por el flujo de trabajo, no por una
//     misión que da Mara. Mara no es quest giver.
//   · Nada se explica. Una imagen, una sensación, una frase. Se siente
//     antes de entenderse.
// ============================================================

window.Trama = (function(){

  // --- Acceso seguro a la libreta de memoria ---
  function _mem(){
    if(!window.Estado) return {};
    if(!Estado.memoria) Estado.memoria = {};
    return Estado.memoria;
  }
  // Garantiza que existan los campos de trama (autocura partidas viejas).
  function _asegurar(){
    const m = _mem();
    if(typeof m.tramaNivel !== 'number') m.tramaNivel = 0;
    if(!Array.isArray(m.fragmentos)) m.fragmentos = [];
    return m;
  }

  // --- Catálogo de Fragmentos de Memoria (hand-authored) ---
  // Cada fragmento: una escena breve que NO es del jugador. Imperfecta,
  // sin exposición. De momento solo el primero del Acto 1.
  const FRAGMENTOS = {
    eco_mar: {
      titulo: 'el mar',
      acto: 1,
      texto: 'Por un instante hay sal en el aire. Sal, donde nunca ha habido más '
           + 'que polvo y lluvia ácida.<br><br>'
           + 'Agua hasta donde alcanza la vista. Moviéndose. Respirando despacio, '
           + 'como algo vivo y enorme y tranquilo.<br><br>'
           + 'Y una voz que no reconoces, muy por debajo de todo lo demás:<br>'
           + '<span style="opacity:.85;font-style:italic">«¿Recuerdas el mar?»</span><br><br>'
           + 'Las Pilas nunca tuvo mar. Nadie en este mundo lo tuvo. '
           + 'El recuerdo se deshace antes de que puedas sujetarlo, '
           + 'y te quedas con la mano cerrada sobre nada.'
    },
    // Acto 2 — entregado a mano por el eslabón "El módulo" (js/81), no por
    // el azar del sandbox. Sube la trama a nivel 2 al ganarse.
    eco_nieve: {
      titulo: 'nieve',
      acto: 2,
      texto: 'Hay nieve. No la de las pantallas: nieve de verdad, que se cuela por '
           + 'el cuello del abrigo y en los guantes y duele un poco.<br><br>'
           + 'Alguien ríe cerca. No recuerdas su cara, pero sabes —con una certeza '
           + 'que no es tuya— que la querías.<br><br>'
           + 'Y una voz, tranquila, prometiendo algo:<br>'
           + '<span style="opacity:.85;font-style:italic">«Será poco tiempo.»</span><br><br>'
           + 'Nunca has visto la nieve. Nadie a quien conoces la ha visto. '
           + 'El resto del recuerdo llega roto, en trozos que no encajan, '
           + 'como si alguien lo hubiera intentado guardar y no lo hubiera conseguido del todo.'
    },
    // Acto 2 — cae en el capítulo "La archivista" (js/82), al alcanzar lo que
    // Coll guardaba en el depósito.
    eco_lista: {
      titulo: 'la lista',
      acto: 2,
      texto: 'Una sala fría, llena de gente que no se mira entre sí. Cada uno lleva '
           + 'un número prendido en el abrigo.<br><br>'
           + 'Una voz lee nombres. Despacio, sin prisa, como si tuviera todo el tiempo '
           + 'del mundo.<br><br>'
           + 'Y esperas el tuyo con un miedo raro, sin saber si es peor oírlo o no oírlo.<br>'
           + '<span style="opacity:.85;font-style:italic">«…y los que queden, que se preparen.»</span><br><br>'
           + 'Dejas algo atrás al salir. No recuerdas qué. Solo que pesaba, '
           + 'y que ya no está.<br>'
           + '<span style="opacity:.7;font-style:italic">[…el resto no está…]</span>'
    }
  };

  // --- Lectores ---
  function nivel(){ return _asegurar().tramaNivel; }
  function tiene(id){ return _asegurar().fragmentos.indexOf(id) !== -1; }
  function listaFragmentos(){ return _asegurar().fragmentos.slice(); }

  // Umbral del Acto 1: haber COMPLETADO el encargo del paquete de Mara.
  // (No basta con conocerla; hay que haber aceptado y entregado.)
  function actoArmado(){
    const m = Estado.memoria || {};
    if(m.aceptoEncargo !== true) return false;
    const finalizada = ['completada','volviendo','volvioApartamento'];
    return finalizada.indexOf(Estado.mision) !== -1;
  }

  // Otorga un fragmento (idempotente). Sube la bandera de trama si procede.
  function ganar(id){
    const f = FRAGMENTOS[id];
    if(!f) return false;
    const m = _asegurar();
    if(m.fragmentos.indexOf(id) !== -1) return false; // ya lo tiene
    m.fragmentos.push(id);
    // El primer fragmento empuja la trama del nivel 0 al 1 (Acto 1 vivo).
    if(m.tramaNivel < f.acto) m.tramaNivel = f.acto;
    _mostrarFragmento(f);
    if(typeof guardarPartida === 'function'){ try{ guardarPartida(); }catch(e){} }
    return true;
  }

  // ¿Puede caer el PRIMER fragmento ahora, desde el trabajo normal?
  // Se llama desde el resolvedor de escenas. Es de baja probabilidad,
  // de un solo uso, y solo si el jugador ya hizo el encargo de Mara.
  function intentarPrimerFragmento(prob){
    if(!actoArmado()) return false;       // aún no ha hecho el encargo
    if(nivel() >= 1) return false;         // la trama ya arrancó
    if(tiene('eco_mar')) return false;     // ya lo vio
    if(Math.random() > (typeof prob === 'number' ? prob : 0.15)) return false;
    return ganar('eco_mar');
  }

  // --- Presentación: overlay diegético, contenido y melancólico ---
  // Autónomo (se cuelga de <body>), no pelea con el DOM de la escena.
  function _mostrarFragmento(f){
    if(typeof document === 'undefined') return;
    // Pequeño retardo: deja que el momento de trabajo se asiente antes
    // de que el recuerdo "suba". No debe sentirse como un premio.
    setTimeout(function(){
      const ov = document.createElement('div');
      ov.className = 'frag-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:9000;display:flex;'
        + 'align-items:center;justify-content:center;padding:1.4rem;'
        + 'background:rgba(4,6,10,0.92);opacity:0;transition:opacity .9s ease;'
        + 'backdrop-filter:blur(2px);';
      const caja = document.createElement('div');
      caja.style.cssText = 'max-width:540px;width:100%;color:#cfd6df;'
        + 'font-size:0.98rem;line-height:1.62;text-align:left;'
        + 'border-left:2px solid var(--magenta-dim,#7a3b5d);padding:0 0 0 1.1rem;';
      caja.innerHTML =
        '<div style="font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;'
        + 'color:var(--magenta-dim,#7a3b5d);margin-bottom:1rem;opacity:.9">'
        + 'fragmento de memoria</div>'
        + '<div>' + f.texto + '</div>'
        + '<div style="margin-top:1.6rem;text-align:right">'
        + '<button class="frag-cerrar" style="background:none;border:1px solid '
        + 'var(--magenta-dim,#7a3b5d);color:#cfd6df;padding:.45rem 1.1rem;'
        + 'font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;'
        + 'cursor:pointer;border-radius:2px">dejarlo ir</button></div>';
      ov.appendChild(caja);
      document.body.appendChild(ov);
      requestAnimationFrame(()=>{ ov.style.opacity = '1'; });
      const cerrar = ()=>{
        ov.style.opacity = '0';
        setTimeout(()=>{ if(ov.parentNode) ov.parentNode.removeChild(ov); }, 900);
      };
      caja.querySelector('.frag-cerrar').onclick = cerrar;
      ov.onclick = (e)=>{ if(e.target === ov) cerrar(); };
    }, 700);
  }

  // --- Visor: HTML de los fragmentos reunidos (para la repisa) ---
  // Se muestran como ecos, no como objetos. No los trajiste de fuera:
  // surgieron en ti.
  function verFragmentosHTML(){
    const ids = listaFragmentos();
    if(ids.length === 0) return '';
    let html = '<br><br>Y algo más, que no trajiste de ninguna parte. '
             + 'Recuerdos que aparecieron solos, como huellas en un sitio '
             + 'donde nunca pisaste:';
    ids.forEach(id=>{
      const f = FRAGMENTOS[id];
      if(f) html += '<br>· Un eco: ' + f.titulo + '.';
    });
    return html;
  }

  return {
    nivel: nivel,
    tiene: tiene,
    listaFragmentos: listaFragmentos,
    actoArmado: actoArmado,
    ganar: ganar,
    intentarPrimerFragmento: intentarPrimerFragmento,
    verFragmentosHTML: verFragmentosHTML,
    FRAGMENTOS: FRAGMENTOS
  };

})();
