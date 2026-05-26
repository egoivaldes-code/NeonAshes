// ============================================================
// BLOQUE JS-28 — NOTICIAS ROTATIVAS Y REACTIVAS
// Las noticias del juego: unas fijas que rotan, otras generadas
//   en función de lo que el jugador ha hecho.
// ============================================================

// ============================================================
// Rotativas: pool fijo, se muestran en orden aleatorio cada vez.
// Reactivas: condicionales, se disparan según el estado del jugador.
// El tono es deliberadamente "corporativo amable": HELIX nunca
// reconoce abiertamente que hace daño. Hay que leer entre líneas.

const NOTICIAS_ROTATIVAS = [
  // Corporativo HELIX
  { cat: 'HELIX', txt: 'HELIX celebra su 47º aniversario con cifras récord. "Cada ciudadano es esencial", declara la dirección.' },
  { cat: 'HELIX', txt: 'Nuevos cursos de "Bienestar Productivo" disponibles en todos los niveles. Asistencia recomendada.' },
  { cat: 'HELIX', txt: 'El programa de Reasignación Voluntaria amplía sus plazas. Beneficios fiscales para los primeros 10.000 inscritos.' },
  // Sucesos en las Pilas
  { cat: 'PILAS', txt: 'Avería en el suministro de agua, Sector 7. Restablecimiento previsto antes del amanecer.' },
  { cat: 'PILAS', txt: 'Tres residentes de las Pilas Inferiores hospitalizados por exposición prolongada a lluvia ácida. Cifra dentro de los márgenes habituales.' },
  { cat: 'PILAS', txt: 'Aumento del 14% en peticiones de medicación nocturna. Especialistas lo atribuyen a "estacionalidad".' },
  // Clima
  { cat: 'CLIMA', txt: 'Lluvia ácida moderada hasta las 06:00. Se recomienda evitar exposición prolongada.' },
  { cat: 'CLIMA', txt: 'Nubes densas sobre los niveles superiores. Visibilidad reducida para drones de reparto.' },
  // Cultura / vida diaria
  { cat: 'VIDA', txt: 'La cadena de cafeterías "Lumen" introduce su nuevo sabor de temporada: "Memoria de Naranja".' },
  { cat: 'VIDA', txt: 'Bar Noir reabre tras inspección rutinaria. La gerencia agradece la paciencia.' },
  // Fragmentos extraños (semillas CERO)
  { cat: 'INFO', txt: 'Interferencias breves en frecuencias de servicio público durante la noche. HELIX recomienda no compartir relatos no verificados.' },
  { cat: 'INFO', txt: 'Operarios del Nivel 4 reportan "ruidos persistentes" en conductos de ventilación. Una unidad técnica investiga.' }
];

// Devuelve un array de titulares reactivas que correspondan al estado actual del jugador.
function generarNoticiasReactivas(){
  const m = Estado.memoria || {};
  const h = Estado.humano || {};
  const reactivas = [];

  if((h.hambre || 0) > 40){
    reactivas.push({ cat: 'PILAS', txt: 'Cupones de comida básica HELIX agotados en el Sector 7 por tercera semana consecutiva. Reposición incierta.' });
  }
  if(m.vioFragmentoCero){
    reactivas.push({ cat: 'INFO', txt: 'Cinco testigos describen "voces breves" en terminales personales. HELIX descarta cualquier anomalía.' });
  }
  if(m.aceptoEncargo === true){
    reactivas.push({ cat: 'PILAS', txt: 'Movimiento inusual en casilleros del Nivel 4. Vigilancia reforzada hasta el amanecer.' });
  }
  if(m.aceptoEncargo === false){
    reactivas.push({ cat: 'VIDA', txt: 'El Bar Noir busca personal discreto. Contactar con la gerencia.' });
  }
  if((h.fatiga || 0) > 70){
    reactivas.push({ cat: 'HELIX', txt: '"El sueño es productividad". Campaña HELIX recuerda que dormir bien es un deber ciudadano.' });
  }
  if((h.aislamiento || 0) > 60){
    reactivas.push({ cat: 'HELIX', txt: 'Línea de Compañía HELIX disponible las 24h. "Nadie tiene que estar solo".' });
  }
  if((m.confianzaMara || 0) >= 3){
    reactivas.push({ cat: 'VIDA', txt: 'La gerencia del Bar Noir confirma normalidad operativa. Sin novedades.' });
  }

  // ============================================================
  // FASE C: noticia del último muerto
  // ============================================================
  // Si en una partida anterior murió alguien, la noticia aparece
  // aquí. Tono frío, burocrático: HELIX informa, no se conmueve.
  // Solo en las primeras 2 partidas tras la muerte. Luego cae al
  // olvido como casi todo en las Pilas.
  if(muerteAunRecordada()){
    const m_ant = ultimoMuerto();
    if(m_ant){
      const nombreCompleto = `${m_ant.nombre} ${m_ant.apellido}`.trim();
      // El texto de la noticia varía según cómo murió. Siempre frío,
      // siempre sin culpa. La ciudad documenta, no se duele.
      let texto;
      switch(m_ant.causa){
        case 'fatiga':
          texto = `Hallado fallecido en el pasillo del Nivel 4. Identificado como ${nombreCompleto}, residente de Lower Stacks. Causa: agotamiento prolongado. Sin signos de violencia.`;
          break;
        case 'aislamiento':
          texto = `Vecinos del bloque 19 alertan tras varios días de silencio en una unidad. Hallado el cuerpo de ${nombreCompleto}. Sin familiares localizados. Sin nota.`;
          break;
        case 'hambre':
          texto = `Hallado fallecido en su unidad por desnutrición severa. Identificado como ${nombreCompleto}. HELIX recuerda los canales de "Asistencia Nutricional Subvencionada".`;
          break;
        case 'disociacion':
          texto = `Localizado fallecido en su domicilio sin causa médica determinada. Identificado como ${nombreCompleto}. Las autoridades atribuyen el caso a "factores no clínicos".`;
          break;
        default:
          texto = `Comunicado de defunción: ${nombreCompleto}, residente de Lower Stacks. La unidad queda disponible para reasignación.`;
      }
      reactivas.push({ cat: 'PILAS', txt: texto });
    }
  }

  return reactivas;
}

// Genera un "hace cuánto" aleatorio pero ordenable (en minutos desde ahora).
function tiempoAleatorio(minMin, maxMin){
  return Math.floor(Math.random() * (maxMin - minMin) + minMin);
}

// Formatea un número de minutos como "hace X min" o "hace X h".
function formatearTiempo(min){
  if(min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  return h === 1 ? 'hace 1 h' : `hace ${h} h`;
}

// ----- RENDER: NOTICIAS -----
// Selecciona reactivas que apliquen + algunas rotativas al azar.
// Asigna a cada una un "hace cuánto" coherente y las ordena de
// más reciente a más antigua. Las reactivas tienden a estar arriba.
function renderNoticias(){
  // 1) Reactivas: las que aplican al estado actual
  const reactivas = generarNoticiasReactivas();

  // 2) Rotativas: barajamos el pool y cogemos 3-4 al azar
  //    (menos si hay muchas reactivas, para no saturar)
  const numRotativas = Math.max(2, 5 - reactivas.length);
  const pool = [...NOTICIAS_ROTATIVAS];
  pool.sort(() => Math.random() - 0.5);
  const rotativasElegidas = pool.slice(0, numRotativas);

  // 3) Asignamos tiempos. Las reactivas tienden a ser recientes
  //    (más impactantes), las rotativas se reparten en el día.
  const todas = [];
  reactivas.forEach(n => {
    todas.push({ ...n, minutos: tiempoAleatorio(5, 90), reactiva: true });
  });
  rotativasElegidas.forEach(n => {
    todas.push({ ...n, minutos: tiempoAleatorio(30, 480), reactiva: false });
  });

  // 4) Ordenamos: más recientes arriba
  todas.sort((a, b) => a.minutos - b.minutos);

  // 5) Construimos el HTML
  let items = '';
  todas.forEach(n => {
    items += `
      <div class="noticia-item${n.reactiva ? ' reactiva' : ''}">
        <div class="noticia-meta">
          <span class="noticia-cat">${n.cat}</span>
          <span class="noticia-tiempo">${formatearTiempo(n.minutos)}</span>
        </div>
        <div class="noticia-texto">${n.txt}</div>
      </div>`;
  });

  return `
    <div class="noticias-header">
      <div class="noticias-titulo-red">░░░ HELIX NEWS ░░░</div>
      <div class="noticias-subtitulo">RED PÚBLICA · NIVEL 3 — CIUDADANO</div>
    </div>
    <div class="noticias-lista">
      ${items}
    </div>
    <div class="noticias-pie">
      Sólo se muestran fuentes verificadas por HELIX.
    </div>
  `;
}


// ============================================================