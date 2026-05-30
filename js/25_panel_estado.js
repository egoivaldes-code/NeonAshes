// ============================================================
// BLOQUE JS-29 — PANEL ESTADO — renderizado de stats humanas
// Dibuja las 4 barras de fatiga, hambre, disociación y aislamiento
//   con sus descripciones diegéticas.
// ============================================================

// ============================================================
// DESCRIPCIONES DIEGÉTICAS DE ESTADO
// ============================================================
// Por cada stat y nivel (5 niveles) hay una descripción atmosférica
// de 2 líneas. No usa números ni jerga de RPG. Habla como una voz
// interior, en segunda persona, con tono noir melancólico.
// Estos textos son la cara visible del estado humano del personaje.
// ============================================================

const DESCRIPCIONES_STAT = {
  fatiga: {
    minimo: 'Estás descansado. El cuerpo responde,\nla mente también, casi.',
    bajo:   'Notas un ligero peso al moverte.\nNada que un café no aguante.',
    medio:  'El cansancio empieza a doler.\nCuesta sostener pensamientos largos.',
    alto:   'Llevas demasiado sin dormir bien.\nLa cabeza zumba con un sonido sordo.',
    extremo:'El cuerpo te está fallando.\nCada parpadeo dura un segundo de más.'
  },
  aislamiento: {
    minimo: 'Nadie te ha mirado a los ojos hoy.\nTodavía no lo notas.',
    bajo:   'Alguien podría llamarte y no llegará.\nVas acostumbrándote a ese silencio.',
    medio:  'Empiezas a hablar contigo en voz alta.\nLas paredes responden mejor que la gente.',
    alto:   'La voz se te oxida en la garganta.\nNo recuerdas el sonido de tu propia risa.',
    extremo:'Estás solo de un modo profundo.\nEl mundo sigue afuera. Sin ti.'
  },
  hambre: {
    minimo: 'El estómago calla.\nDe momento.',
    bajo:   'Un vacío suave por dentro.\nNada urgente.',
    medio:  'El estómago se queja.\nYa no recuerdas qué fue lo último que comiste.',
    alto:   'Las manos te tiemblan ligero.\nMiras la comida de otros en la calle más tiempo del que deberías.',
    extremo:'El hambre te muerde por dentro.\nCualquier cosa que se coma vale ya. Cualquier cosa.'
  },
  disociacion: {
    minimo: 'Estás aquí. Estás entero.\nLas cosas son lo que parecen.',
    bajo:   'A veces se te escapa un segundo.\nNada importante. Todavía.',
    medio:  'El tiempo se mueve raro a ratos.\nMiras un reloj y no entiendes la hora.',
    alto:   'Hay decisiones que no recuerdas tomar.\nY sin embargo están tomadas.',
    extremo:'No estás seguro de qué es real.\nA veces te oyes pensar desde fuera.'
  }
};

// Devuelve la descripción correspondiente a un stat según su valor.
function descripcionStat(statName, valor){
  const niveles = DESCRIPCIONES_STAT[statName];
  if(!niveles) return '';
  return niveles[nivel(valor)] || '';
}

// ----- RENDER: ESTADO -----
// 4 dimensiones humanas. Cada una con su valor (oculto al jugador),
// su barra de color por nivel, y debajo dos líneas atmosféricas
// que describen cómo se siente eso desde dentro.
function renderEstado(){
  const h = Estado.humano || {};
  const n = (Estado.jugador && Estado.jugador.nombre) || '—';
  const ap = (Estado.jugador && Estado.jugador.apellido1) || '';

  // Color de la barra según el nivel (5 bandas, 5 colores).
  const colorNivel = (val) => {
    const lv = nivel(val);
    if(lv === 'minimo') return '#78ffa0';  // verde claro
    if(lv === 'bajo')   return '#a8ff78';  // verde lima
    if(lv === 'medio')  return '#ffdc78';  // amarillo
    if(lv === 'alto')   return '#ffa078';  // naranja
    return '#ff647c';                       // rojo
  };

  // Cada fila: nombre del stat, barra de color, y dos líneas
  // diegéticas debajo. No se muestra el número (lo ocultamos al
  // jugador deliberadamente — la sensación importa más que la cifra).
  const fila = (statKey, etiqueta) => {
    const valor = h[statKey] || 0;
    const lv = nivel(valor);
    const descr = descripcionStat(statKey, valor).replace(/\n/g, '<br>');
    return `
      <div class="estado-stat">
        <div class="estado-stat-cabecera">
          <span class="estado-stat-nombre">${etiqueta}</span>
          <span class="estado-stat-barra" style="--w:${Math.min(100,valor)}%;--c:${colorNivel(valor)}"></span>
        </div>
        <div class="estado-stat-descripcion ${lv}">${descr}</div>
      </div>`;
  };

  return `
    <div class="estado-bloque">
      <div class="estado-seccion-titulo">IDENTIDAD</div>
      <div style="font-size:0.7rem;color:rgba(0,229,255,0.85);letter-spacing:0.2em;text-transform:uppercase;">${n} ${ap}</div>
      <div style="font-size:0.5rem;color:rgba(200,216,224,0.4);letter-spacing:0.25em;margin-top:0.3rem;">UNIDAD 273-19A · LOWER STACKS</div>
    </div>

    <div class="estado-bloque">
      <div class="estado-seccion-titulo">CONDICIÓN</div>
      ${fila('fatiga',      'FATIGA')}
      ${fila('aislamiento', 'AISLAMIENTO')}
      ${fila('hambre',      'HAMBRE')}
      ${fila('disociacion', 'DISOCIACIÓN')}
    </div>

    <div class="estado-bloque">
      <div class="estado-seccion-titulo">LESIONES</div>
      ${(typeof renderCondiciones === 'function') ? renderCondiciones() : ''}
    </div>
  `;
}

// ----- RENDER: CONTACTOS -----
// Mara aparece como contacto solo si el jugador la ha conocido.
// La relación cambia según la memoria (confianza, decisiones).

// ============================================================