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
  // Reacción al último encuentro con una facción durante el paseo.
  if(m.ultimaFaccionTocada){
    const _noticiasFaccion = {
      sindicatos: {
        pos: { cat:'PILAS', txt:'Los talleres del Distrito Ferro reportan "ambiente cordial" tras una semana tensa. Nadie aclara con quién.' },
        neg: { cat:'PILAS', txt:'Altercado menor en los muelles del Sector 7. Los Sindicatos cierran filas y no admiten preguntas.' }
      },
      archivistas: {
        pos: { cat:'INFO', txt:'Circula un archivo no autorizado entre terminales privados. HELIX recuerda que poseer memoria no verificada es delito leve.' },
        neg: { cat:'INFO', txt:'Una célula de preservación de datos suspende contactos tras "una brecha de confianza". Sin más detalles.' }
      },
      iglesia_eco: {
        pos: { cat:'VIDA', txt:'La Iglesia del Eco abre sus templos una noche más por "alta demanda de escucha". Asistencia en aumento.' },
        neg: { cat:'VIDA', txt:'Fieles del Eco denuncian acoso a un visitante reciente. La congregación pide "recogimiento".' }
      },
      drifters: {
        pos: { cat:'INFO', txt:'Rutas de transporte no registradas operan "con normalidad", según fuentes que piden no ser citadas.' },
        neg: { cat:'INFO', txt:'Un piloto independiente cancela trayectos sin previo aviso. Los pasajeros varados no reciben explicación.' }
      },
      orpheus: {
        pos: { cat:'HELIX', txt:'División ORPHEUS amplía su "programa de colaboración ciudadana". Las invitaciones son personales e intransferibles.' },
        neg: { cat:'HELIX', txt:'ORPHEUS recuerda que toda interacción con su personal queda registrada "por seguridad del propio ciudadano".' }
      },
      ia_autonomas: {
        pos: { cat:'INFO', txt:'Interferencias breves y "casi corteses" en altavoces públicos del Sector 7. HELIX investiga el origen.' },
        neg: { cat:'INFO', txt:'Una unidad de voz no autorizada deja de emitir tras "un desencuentro". El silencio dura ya varias horas.' }
      },
      helix: {
        pos: { cat:'HELIX', txt:'HELIX agradece a los ciudadanos que "colaboran activamente con el orden". El gesto, dicen, se recuerda.' },
        neg: { cat:'HELIX', txt:'Refuerzo de vigilancia rutinaria en varios accesos del Nivel 4. "Procedimiento estándar", según la corporación.' }
      },
      restos_militares: {
        pos: { cat:'PILAS', txt:'Veteranos sin destino ofrecen "protección informal" en zonas hostiles. El boca a boca corre rápido.' },
        neg: { cat:'PILAS', txt:'Tensión en un punto de control improvisado. Exsoldados "recomiendan no insistir".' }
      }
    };
    const _set = _noticiasFaccion[m.ultimaFaccionTocada];
    if(_set){
      const _signo = (m.ultimaFaccionSigno === 'neg') ? 'neg' : 'pos';
      if(_set[_signo]) reactivas.push(_set[_signo]);
    }
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

  // 1b) Rumores: boca a boca de las Pilas, filtrado por a quién has
  //     visto y por tu reputación (lo monta 43_rumores.js). Hasta 2,
  //     para que se mezclen sin convertir el terminal en cotilleo.
  const rumores = (typeof rumoresParaNoticias === 'function') ? rumoresParaNoticias(2) : [];

  // 2) Rotativas: barajamos el pool y cogemos 3-4 al azar
  //    (menos si hay muchas reactivas/rumores, para no saturar)
  const numRotativas = Math.max(2, 5 - reactivas.length - rumores.length);
  const pool = [...NOTICIAS_ROTATIVAS];
  pool.sort(() => Math.random() - 0.5);
  const rotativasElegidas = pool.slice(0, numRotativas);

  // 3) Asignamos tiempos. Reactivas y rumores tienden a ser recientes
  //    (más impactantes), las rotativas se reparten en el día.
  const todas = [];
  reactivas.forEach(n => {
    todas.push({ ...n, minutos: tiempoAleatorio(5, 90), reactiva: true });
  });
  rumores.forEach(n => {
    todas.push({ ...n, minutos: tiempoAleatorio(5, 120), rumor: true });
  });
  rotativasElegidas.forEach(n => {
    todas.push({ ...n, minutos: tiempoAleatorio(30, 480), reactiva: false });
  });

  // 4) Ordenamos: más recientes arriba
  todas.sort((a, b) => a.minutos - b.minutos);

  // 5) Construimos el HTML
  let items = '';
  todas.forEach(n => {
    const clase = n.rumor ? ' rumor' : (n.reactiva ? ' reactiva' : '');
    items += `
      <div class="noticia-item${clase}">
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