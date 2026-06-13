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

// ============================================================
// ECOS DE LA CALLE (v0.86.5)
// ------------------------------------------------------------
// Lo que el jugador hace al explorar la ciudad o en los eventos de
// tránsito deja una HUELLA en Estado.memoria.ecosCalle. Las noticias
// la leen y sueltan titulares acordes, para que el mundo "se entere"
// de lo que pasó en la calle. Solo se guarda la ÚLTIMA salida: cada
// nueva deriva resetea estas banderas (lo hace explorar al empezar).
//
// Tipos de eco:
//   violencia   — hubo un golpe, una pelea, un encontronazo.
//   rebusca     — registró contenedores/huecos en busca de chatarra.
//   dineroSucio — se movió dinero turbio (peaje, robo, descuido ajeno).
//   encuentro   — se cruzó con alguien (NPC, mendigo, desconocido).
// ============================================================
function _asegurarEcosCalle(){
  if(!Estado.memoria) Estado.memoria = {};
  if(typeof Estado.memoria.ecosCalle !== 'object' || Estado.memoria.ecosCalle === null){
    Estado.memoria.ecosCalle = {};
  }
  return Estado.memoria.ecosCalle;
}
// Borra los ecos (nueva salida). La llaman explorar/tránsito al empezar.
function reiniciarEcosCalle(){
  if(!Estado.memoria) Estado.memoria = {};
  Estado.memoria.ecosCalle = {};
}
// Marca un eco como ocurrido en la salida actual.
function marcarEcoCalle(tipo){
  if(!tipo) return;
  const e = _asegurarEcosCalle();
  e[tipo] = true;
}
window.reiniciarEcosCalle = reiniciarEcosCalle;
window.marcarEcoCalle = marcarEcoCalle;

// ── Ecos de PROFESIÓN (v0.101) ──────────────────────────────
// A diferencia de los ecos de calle, NO se borran al salir a explorar:
// lo que haces ejerciendo una profesión deja huella hasta que la lees en
// el terminal de noticias. Se guardan como una cola (varios pendientes).
function _asegurarEcosProf(){
  if(!Estado.memoria) Estado.memoria = {};
  if(!Array.isArray(Estado.memoria.ecosProfesion)) Estado.memoria.ecosProfesion = [];
  return Estado.memoria.ecosProfesion;
}
function marcarEcoProfesion(tipo){
  if(!tipo) return;
  const cola = _asegurarEcosProf();
  // Evitar duplicar el mismo tipo si ya está pendiente.
  if(cola.indexOf(tipo) === -1) cola.push(tipo);
  // Tope de 3 pendientes para no acumular un muro de titulares.
  while(cola.length > 3) cola.shift();
}
window.marcarEcoProfesion = marcarEcoProfesion;

// Titulares por tipo de suceso. Varias variantes por tipo: se elige una
// al azar para que no se repita siempre el mismo. Tono HELIX/Pilas:
// nunca se nombra al jugador; el suceso aparece como rumor o parte frío.
const NOTICIAS_ECOS_CALLE = {
  violencia: [
    { cat:'PILAS', txt:'Reportan un altercado en un pasaje del Sector 7. Sin heridos "de consideración", según el parte. Nadie ha denunciado nada.' },
    { cat:'PILAS', txt:'Vecinos oyen forcejeos en los corredores bajos durante la noche. Para cuando llega una patrulla, solo queda sangre en el suelo y ningún nombre.' },
    { cat:'HELIX', txt:'HELIX recuerda que la violencia callejera "se contagia". Se aconseja a los ciudadanos no intervenir y reportar desde una distancia segura.' }
  ],
  rebusca: [
    { cat:'PILAS', txt:'Aumentan los registros de contenedores volcados en los niveles bajos. La gestión de residuos pide "respeto por el material reciclable".' },
    { cat:'PILAS', txt:'Recolectores informales se multiplican en el Sector 7. "Cada vez queda menos que rebuscar", se queja un veterano del oficio.' },
    { cat:'VIDA', txt:'El precio de la chatarra metálica sube por tercer día. Los talleres de reciclaje no dan abasto con tanta materia de origen incierto.' }
  ],
  dineroSucio: [
    { cat:'PILAS', txt:'Se reportan más "peajes informales" en los pasajes estrechos del Sector 7. La corporación niega tener constancia de ninguno.' },
    { cat:'PILAS', txt:'Una racha de carteristas recorre los corredores concurridos. HELIX recomienda llevar los créditos en cuenta verificada, "más segura".' },
    { cat:'VIDA', txt:'Circula dinero físico, manchado y sin rastrear, por los puestos del mercado bajo. Nadie pregunta de dónde sale. Nadie quiere saberlo.' }
  ],
  encuentro: [
    { cat:'VIDA', txt:'Crece el trasiego nocturno en los corredores de las Pilas. "Hay más gente despierta de la que debería", comenta un tendero.' },
    { cat:'INFO', txt:'Se detectan más contactos personales no registrados en zonas sin cobertura. HELIX recuerda que toda conversación "merece ser respaldada".' },
    { cat:'PILAS', txt:'Un rostro nuevo se deja ver por los pasajes del Sector 7. En las Pilas, eso siempre significa algo, aunque nadie sepa todavía el qué.' }
  ],

  // ── Ecos de PROFESIONES (v0.101). Sutiles casi siempre; los
  //    'directo' se reservan para decisiones gordas. Nunca nombran
  //    al jugador: el mundo reacciona, no lo señala. ──

  // Investigador: caso cerrado.
  caso_resuelto: [
    { cat:'PILAS', txt:'Un asunto que nadie quería remover ha quedado, dicen, "aclarado". Quien pagó por la respuesta calla. Quien salió señalado, también.' },
    { cat:'VIDA', txt:'Corre que cierto investigador de los niveles bajos cobra poco y entrega lo que promete. La clase de fama que abre puertas y cierra otras.' },
    { cat:'INFO', txt:'HELIX archiva un expediente como "resuelto por terceros". Sin detalles. En las Pilas, "resuelto" rara vez significa "justo".' }
  ],

  // Cazarrecompensas: entrega al Loto.
  caza_loto: [
    { cat:'PILAS', txt:'El Loto Carmesí salda una cuenta pendiente esta semana. Un farol granate arde a media luz en señal de cobro consumado.' },
    { cat:'VIDA', txt:'En el Arrabal se comenta que a los morosos del Loto les queda menos sitio donde esconderse. "Ahora mandan a gente eficiente", susurran.' }
  ],
  // Cazarrecompensas: entrega al Ferro.
  caza_ferro: [
    { cat:'PILAS', txt:'El Sindicato Ferro recupera "lo que se le había extraviado". El orden, dicen en el distrito, siempre vuelve a su sitio. Tarde o temprano.' },
    { cat:'VIDA', txt:'Un nombre deja de oírse en los muelles del Ferro. Nadie pregunta a dónde fue. En el Ferro, preguntar también es una deuda.' }
  ],
  // Cazarrecompensas: entrega a HELIX (decisión gorda → más directo).
  caza_helix: [
    { cat:'HELIX', txt:'HELIX confirma la "recuperación satisfactoria de un activo no autorizado". Agradece la colaboración ciudadana en la seguridad corporativa.' },
    { cat:'INFO', txt:'Recuperación de Activos HELIX cierra un caso abierto. El comunicado habla de "material"; en ningún momento de una persona.' }
  ],
  // Cazarrecompensas: dejaste escapar al objetivo (decisión gorda).
  caza_soltado: [
    { cat:'PILAS', txt:'Un contrato de captura se enfría sin cobrar. El que pagaba ha tomado nota de quién le falló. Esa clase de nota no se borra.' },
    { cat:'VIDA', txt:'Alguien a quien buscaban con ahínco simplemente... ya no aparece en los carteles. Se fue, o lo dejaron irse. Las dos cosas tienen precio.' }
  ],

  // Hacker: intrusión a favor del Loto.
  hack_loto: [
    { cat:'INFO', txt:'Un registro del distrito amanece con un hueco que ayer no estaba. Nadie reclama el error. En el Arrabal, ciertos huecos se celebran en voz baja.' },
    { cat:'PILAS', txt:'Corre que en los bajos hay quien abre puertas digitales por encargo. El Loto sonríe. HELIX, cuando se entera, no.' }
  ],
  // Hacker: intrusión a favor del Ferro.
  hack_ferro: [
    { cat:'PILAS', txt:'El Ferro parece saber cosas que no debería: horarios, rutas, nombres. Alguien les pasa lo que estaba cerrado bajo llave. Llave digital, claro.' },
    { cat:'INFO', txt:'Un terminal de los muelles registra un acceso que nadie reconoce haber hecho. El capataz revisa su contraseña. Tarde.' }
  ],
  // Hacker: intrusión que toca a HELIX (más directo).
  hack_helix: [
    { cat:'HELIX', txt:'HELIX informa de "una anomalía de acceso ya contenida" en una de sus redes internas. Insiste en que ningún dato sensible se vio comprometido. Insiste mucho.' },
    { cat:'INFO', txt:'Seguridad de Sistemas HELIX rastrea una sesión anónima en su capa clínica. El comunicado habla de "rutina"; el despliegue de auditores, de otra cosa.' }
  ]
};

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
      eco: {
        pos: { cat:'VIDA', txt:'La Iglesia del Eco abre sus templos una noche más por "alta demanda de escucha". Asistencia en aumento.' },
        neg: { cat:'VIDA', txt:'Fieles del Eco denuncian acoso a un visitante reciente. La congregación pide "recogimiento".' }
      },
      loto: {
        pos: { cat:'PILAS', txt:'Los teatros del Arrabal Carmesí celebran "una semana de buena fortuna". Las reservas se agotan sin explicación.' },
        neg: { cat:'PILAS', txt:'Una deuda impagada en el Carmesí termina en silencio. El Loto "lamenta los malentendidos" y no añade nada más.' }
      },
      drifters: {
        pos: { cat:'INFO', txt:'Rutas de transporte no registradas operan "con normalidad", según fuentes que piden no ser citadas.' },
        neg: { cat:'INFO', txt:'Un piloto independiente cancela trayectos sin previo aviso. Los pasajeros varados no reciben explicación.' }
      },
      orpheus: {
        pos: { cat:'HELIX', txt:'División ORPHEUS amplía su "programa de colaboración ciudadana". Las invitaciones son personales e intransferibles.' },
        neg: { cat:'HELIX', txt:'ORPHEUS recuerda que toda interacción con su personal queda registrada "por seguridad del propio ciudadano".' }
      },
      ia: {
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
    // VARIANTES EXTRA por facción (v0.86.5): se suman a la noticia base
    // de arriba para dar más variedad. Por cada facción y signo, juntamos
    // la original con estas y elegimos una al azar.
    const _noticiasFaccionExtra = {
      sindicatos: {
        pos: [{ cat:'PILAS', txt:'Una colecta vecinal del Distrito Ferro alcanza su objetivo "gracias a manos anónimas". Los Sindicatos no dan nombres, como siempre.' }],
        neg: [{ cat:'PILAS', txt:'Un capataz del Ferro aparece con la cara marcada. "Accidente de taller", zanjan los Sindicatos, y cierran la verja.' }]
      },
      archivistas: {
        pos: [{ cat:'INFO', txt:'Un fragmento de memoria recuperada circula de mano en mano entre los Archivistas. Lo llaman "una buena noche para no olvidar".' }],
        neg: [{ cat:'INFO', txt:'Los Archivistas blindan un nodo tras "una visita poco grata". Nadie confirma qué se llevó, ni quién.' }]
      },
      eco: {
        pos: [{ cat:'VIDA', txt:'La Iglesia del Eco reparte caldo caliente una noche más. "Quien escucha, recibe", repiten los fieles a quien quiera oírlo.' }],
        neg: [{ cat:'VIDA', txt:'Un predicador del Eco alza la voz contra "los que solo vienen a tomar". La congregación asiente en incómodo silencio.' }]
      },
      loto: {
        pos: [{ cat:'PILAS', txt:'En el Carmesí, una mesa queda reservada toda la noche para alguien que nunca llega del todo. El Loto sonríe y no explica.' }],
        neg: [{ cat:'PILAS', txt:'Una puerta del Carmesí amanece tapiada. El Loto habla de "renovaciones". Nadie del barrio se lo cree.' }]
      },
      drifters: {
        pos: [{ cat:'INFO', txt:'Un transporte fantasma deja mercancía donde hacía falta y desaparece sin cobrar de más. Cosas que pasan, dicen los Drifters.' }],
        neg: [{ cat:'INFO', txt:'Una ruta de los Drifters queda "quemada" tras un malentendido. Los habituales buscan otro piloto, y otro silencio.' }]
      },
      orpheus: {
        pos: [{ cat:'HELIX', txt:'ORPHEUS felicita "discretamente" a un colaborador del Sector 7. La felicitación, como todo en ORPHEUS, no figura en ningún registro público.' }],
        neg: [{ cat:'HELIX', txt:'ORPHEUS abre un expediente "rutinario" sobre actividad en los niveles bajos. Rutinario, insisten, tres veces.' }]
      },
      ia: {
        pos: [{ cat:'INFO', txt:'Una voz sin cuerpo agradece algo por los altavoces del Sector 7 antes de cortarse. HELIX lo atribuye a "ruido de línea".' }],
        neg: [{ cat:'INFO', txt:'Un panel público repite una frase entrecortada toda la noche, como un reproche. Por la mañana, ya está reseteado.' }]
      },
      helix: {
        pos: [{ cat:'HELIX', txt:'HELIX destaca "la colaboración ejemplar de un ciudadano modélico" sin dar nombre. El gesto, recuerdan, suma puntos de confianza.' }],
        neg: [{ cat:'HELIX', txt:'HELIX activa un protocolo de "observación preventiva" en varios accesos. Nada que temer, si uno no tiene nada que ocultar.' }]
      },
      restos_militares: {
        pos: [{ cat:'PILAS', txt:'Un grupo de exsoldados despeja un pasaje peligroso "por las buenas". El barrio respira; nadie pregunta qué cobran a cambio.' }],
        neg: [{ cat:'PILAS', txt:'Un control improvisado de veteranos termina a empujones. "Recomiendan" no volver a pasar por ahí en una temporada.' }]
      }
    };
    const _set = _noticiasFaccion[m.ultimaFaccionTocada];
    if(_set){
      const _signo = (m.ultimaFaccionSigno === 'neg') ? 'neg' : 'pos';
      // Juntar la noticia base con las variantes extra y elegir una.
      const _opciones = [];
      if(_set[_signo]) _opciones.push(_set[_signo]);
      const _extra = _noticiasFaccionExtra[m.ultimaFaccionTocada];
      if(_extra && Array.isArray(_extra[_signo])) _opciones.push(..._extra[_signo]);
      if(_opciones.length){
        reactivas.push(_opciones[Math.floor(Math.random() * _opciones.length)]);
      }
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

  // ============================================================
  // ECOS DE LA CALLE: lo que hiciste en la última salida a explorar
  // o en los eventos de tránsito deja titulares aquí (v0.86.5).
  // ============================================================
  const ecos = (m.ecosCalle && typeof m.ecosCalle === 'object') ? m.ecosCalle : {};
  Object.keys(NOTICIAS_ECOS_CALLE).forEach(tipo => {
    if(ecos[tipo]){
      const variantes = NOTICIAS_ECOS_CALLE[tipo];
      if(variantes && variantes.length){
        reactivas.push(variantes[Math.floor(Math.random() * variantes.length)]);
      }
    }
  });

  // ECOS DE PROFESIÓN (v0.101): cola persistente. Se muestran y se
  // CONSUMEN aquí (al leerlos en el terminal), no al salir a explorar.
  const colaProf = Array.isArray(m.ecosProfesion) ? m.ecosProfesion : [];
  if(colaProf.length){
    colaProf.forEach(tipo => {
      const variantes = NOTICIAS_ECOS_CALLE[tipo];
      if(variantes && variantes.length){
        reactivas.push(variantes[Math.floor(Math.random() * variantes.length)]);
      }
    });
    // Vaciar la cola: ya se han "publicado".
    m.ecosProfesion = [];
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