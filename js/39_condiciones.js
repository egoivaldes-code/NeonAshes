// ============================================================
// BLOQUE JS-51 — CONDICIONES MÉDICAS
// ------------------------------------------------------------
// Para qué sirve:
//   El jugador puede acabar herido, mareado, envenenado, etc.
//   Cada condición es una etiqueta con una gravedad y un pequeño
//   goteo de daño que tiñe el estado humano poco a poco.
//
// Filosofía (igual que el estado humano):
//   - NO es un sistema de stats con números a la vista.
//   - Es atmósfera: el cuerpo del personaje se va rompiendo y
//     el jugador lo NOTA (drena barras, la IA lo menciona).
//   - El código reparte las condiciones; la IA solo las describe.
//
// Cómo se guarda:
//   Estado.condiciones = [
//     { id:'herida_brazo_d', nombre:'Antebrazo derecho herido',
//       gravedad:'grave', drena:{ fatiga:2 }, desc:'...' }
//   ]
//   Cada "tick" del viaje, drenarCondiciones() aplica el goteo.
// ============================================================

// Catálogo base de condiciones que el viaje puede infligir.
// gravedad: 'leve' | 'grave' | 'inutilizado' (o 'critico' para otras)
// drena: cuánto sube cada barra humana por cada tick de viaje.
// Recuerda: en estado humano, SUBIR una barra es malo (100 = muerte).
const CATALOGO_CONDICIONES = {
  herida_brazo_d_leve: {
    id:'herida_brazo_d_leve', nombre:'Antebrazo derecho — herida leve',
    gravedad:'leve', drena:{ fatiga:1 },
    desc:'Un corte en el antebrazo derecho. Escuece, pero la mano responde.'
  },
  herida_brazo_d_grave: {
    id:'herida_brazo_d_grave', nombre:'Antebrazo derecho — herida grave',
    gravedad:'grave', drena:{ fatiga:2 },
    desc:'El antebrazo derecho sangra de verdad. Cada movimiento tira de la herida.'
  },
  herida_brazo_d_inut: {
    id:'herida_brazo_d_inut', nombre:'Antebrazo derecho — inutilizado',
    gravedad:'inutilizado', drena:{ fatiga:3, disociacion:1 },
    desc:'El brazo derecho no responde. Cuelga muerto. El dolor llega en oleadas.'
  },
  pierna_herida_grave: {
    id:'pierna_herida_grave', nombre:'Pierna izquierda — herida grave',
    gravedad:'grave', drena:{ fatiga:2 },
    desc:'Cojeas. La pierna izquierda aguanta el peso a duras penas.'
  },
  mareado: {
    id:'mareado', nombre:'Mareado',
    gravedad:'leve', drena:{ disociacion:2 },
    desc:'El suelo no termina de quedarse quieto. El mundo llega con medio segundo de retraso.'
  },
  envenenado: {
    id:'envenenado', nombre:'Envenenado',
    gravedad:'grave', drena:{ fatiga:2, disociacion:1 },
    desc:'Algo te corre por las venas que no debería estar ahí. Sudas frío.'
  },
  hemorragia: {
    id:'hemorragia', nombre:'Hemorragia',
    gravedad:'grave', drena:{ fatiga:3 },
    desc:'Pierdes sangre más rápido de lo que el cuerpo puede reponer. El frío sube desde los dedos.'
  },
  conmocion: {
    id:'conmocion', nombre:'Conmoción',
    gravedad:'grave', drena:{ disociacion:2, fatiga:1 },
    desc:'Un zumbido sordo. Los sonidos llegan envueltos en algodón. No recuerdas el golpe.'
  },
  costillas: {
    id:'costillas', nombre:'Costillas fisuradas',
    gravedad:'grave', drena:{ fatiga:2 },
    desc:'Respirar hondo es una mala idea. El costado avisa a cada paso.'
  }
};

// Asegura que el array existe en el Estado.
function _asegurarCondiciones(){
  if(!Array.isArray(Estado.condiciones)) Estado.condiciones = [];
}

// Añade una condición por su id de catálogo (o un objeto suelto).
// Si ya tiene una herida del mismo "grupo" (mismo prefijo antes del
// último _), la peor reemplaza a la leve (no se acumulan dos heridas
// del mismo brazo).
function aplicarCondicion(idOObjeto){
  _asegurarCondiciones();
  const cond = (typeof idOObjeto === 'string')
    ? CATALOGO_CONDICIONES[idOObjeto]
    : idOObjeto;
  if(!cond || !cond.id) return false;

  // ¿ya la tiene exacta? no duplicar.
  if(Estado.condiciones.some(c => c.id === cond.id)) return false;

  // Heridas del mismo miembro: nos quedamos con la más grave.
  // Agrupamos por todo menos el último sufijo de gravedad.
  const grupo = cond.id.replace(/_(leve|grave|inut)$/,'');
  if(grupo !== cond.id){
    const orden = { leve:1, grave:2, inutilizado:3 };
    const previa = Estado.condiciones.find(c =>
      c.id.replace(/_(leve|grave|inut)$/,'') === grupo);
    if(previa){
      if((orden[cond.gravedad]||0) <= (orden[previa.gravedad]||0)) return false;
      quitarCondicion(previa.id); // sustituimos por la peor
    }
  }

  Estado.condiciones.push(Object.assign({}, cond));
  if(typeof notificarCambio === 'function'){
    notificarCambio('NUEVA CONDICIÓN · ' + cond.nombre, 'rep');
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  return true;
}

// Quita una condición por id (p.ej. al curarse en el mercado/clínica).
function quitarCondicion(id){
  _asegurarCondiciones();
  const antes = Estado.condiciones.length;
  Estado.condiciones = Estado.condiciones.filter(c => c.id !== id);
  if(Estado.condiciones.length !== antes && typeof guardarPartida === 'function'){
    guardarPartida();
  }
  return Estado.condiciones.length !== antes;
}

function tieneCondiciones(){
  _asegurarCondiciones();
  return Estado.condiciones.length > 0;
}

// Aplica el goteo de TODAS las condiciones activas una vez.
// Se llama una vez por escena del viaje (un "tick").
function drenarCondiciones(){
  _asegurarCondiciones();
  Estado.condiciones.forEach(c => {
    if(!c.drena) return;
    for(const k in c.drena){
      if(typeof ajustarHumano === 'function') ajustarHumano(k, c.drena[k]);
    }
  });
}

// Texto para que la IA "vea" las condiciones del jugador y las
// mencione con naturalidad (sin inventarse efectos numéricos).
function describirCondicionesParaIA(){
  _asegurarCondiciones();
  if(Estado.condiciones.length === 0) return '';
  const lineas = Estado.condiciones.map(c => `- ${c.nombre}: ${c.desc}`);
  return [
    'CONDICIONES FÍSICAS ACTUALES DEL JUGADOR (puedes aludir a ellas',
    'con naturalidad, NUNCA inventes curarlas ni empeorarlas tú):',
    lineas.join('\n')
  ].join('\n');
}

// Render para el panel ESTADO. Devuelve HTML (o '' si no hay nada).
function renderCondiciones(){
  _asegurarCondiciones();
  if(Estado.condiciones.length === 0){
    return `<div class="estado-cond-vacio">Sin lesiones. El cuerpo, al menos, está entero.</div>`;
  }
  const color = { leve:'#ffdc78', grave:'#ffa078', inutilizado:'#ff647c' };
  const filas = Estado.condiciones.map(c => `
    <div class="estado-cond-fila" style="--cc:${color[c.gravedad] || '#ffa078'}">
      <span class="estado-cond-punto"></span>
      <span class="estado-cond-nombre">${c.nombre}</span>
    </div>`).join('');
  return filas;
}

// Exponer en window para que otros módulos (viaje, mercado futuro)
// puedan usarlas sin depender del orden de carga.
window.aplicarCondicion = aplicarCondicion;
window.quitarCondicion = quitarCondicion;
window.tieneCondiciones = tieneCondiciones;
window.drenarCondiciones = drenarCondiciones;
window.describirCondicionesParaIA = describirCondicionesParaIA;
window.renderCondiciones = renderCondiciones;
window.CATALOGO_CONDICIONES = CATALOGO_CONDICIONES;
