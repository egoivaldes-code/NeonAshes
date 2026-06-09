// ============================================================
// BLOQUE JS-47 — MAPA DEL MUNDO — zonas, reputación, viaje libre
// Sistema de exploración libre: zonas, reputación con cada zona,
//   viajes y eventos durante el tránsito.
// ============================================================

// ============================================================
// SISTEMA DE MAPA LIBRE — ZONAS Y VIAJE
// ============================================================

const CLAVE_ZONAS = LAUNCHER.CLAVE_ZONAS;

function cargarEstadoZonas(){
  try {
    const r = localStorage.getItem(CLAVE_ZONAS);
    return r ? JSON.parse(r) : {};
  } catch(e){ return {}; }
}
function guardarEstadoZonas(data){
  try { localStorage.setItem(CLAVE_ZONAS, JSON.stringify(data)); } catch(e){}
}
function getRepZona(id){
  // La reputación de zona ahora es la de su facción dominante (un único
  // contador). Si la zona no tiene facción, caemos al valor antiguo.
  if(typeof faccionDeZona === 'function' && typeof getRepFaccion === 'function'){
    const fid = faccionDeZona(id);
    if(fid) return getRepFaccion(fid);
  }
  const d = cargarEstadoZonas();
  return (d[id] && typeof d[id].rep === 'number') ? d[id].rep : 0;
}
function cambiarRepZona(id, delta){
  // Redirigimos el cambio a la reputación de la facción dueña de la zona,
  // para no llevar dos contadores distintos del mismo sitio. Las visitas
  // se siguen guardando aparte (solo cuentan cuántas veces has estado).
  if(typeof faccionDeZona === 'function' && typeof cambiarRepFaccion === 'function'){
    const fid = faccionDeZona(id);
    if(fid){ cambiarRepFaccion(fid, delta); return; }
  }
  const d = cargarEstadoZonas();
  if(!d[id]) d[id] = { rep: 0, visitas: 0 };
  d[id].rep = Math.max(-100, Math.min(100, (d[id].rep || 0) + delta));
  guardarEstadoZonas(d);
  const zonaNombre = (ZONAS_MUNDO.find(z=>z.id===id) || {}).nombreCorto || id;
  if(typeof notificarCambio === 'function'){
    notificarCambio(delta >= 0 ? ('+'+delta+' REP · '+zonaNombre) : (delta+' REP · '+zonaNombre), 'rep');
  }
}
function registrarVisitaZona(id){
  const d = cargarEstadoZonas();
  if(!d[id]) d[id] = { rep: 0, visitas: 0 };
  d[id].visitas = (d[id].visitas || 0) + 1;
  guardarEstadoZonas(d);
}

const ZONAS_MUNDO = [
  {
    id: 'arrabal_carmesi',
    nombre: 'ARRABAL CARMESÍ',
    nombreCorto: 'CARMESÍ',
    faccion: 'EL LOTO CARMESÍ — CASA DEL PLACER',
    colorFaccion: '#ff006e',
    desc: 'Faroles rojos colgando sobre escaleras de piedra, pagodas apiladas, teatros que nunca cierran. El Loto Carmesí rige cada habitación de alquiler y cada secreto que se susurra en ella. Aquí el placer no es lujo: es poder, y todo deja deuda.',
    peligro: '⚠ ZONA CONTROLADA · DEUDAS DE PLACER · TODO SE PAGA, TARDE O TEMPRANO',
    posX: 80, posY: 160,
    imgBg: 'CARMESI_ZONA',
    eventos: [
      { titulo:'COBRADOR DEL LOTO', narr:'Una mujer impecable, vestida de seda oscura, te corta el paso sin tocarte. Dos siluetas esperan tras ella, quietas. "El Loto da la bienvenida a todo el que entra", dice sonriendo. "Y recuerda a todo el que se va sin saldar."',
        opciones:[
          { txt:'Dejar una propina al Loto (-30 CR)', cambios:{creditos:-30}, msg:'La mujer hace una reverencia mínima. "Bienvenido." Las siluetas se apartan como cortinas. Sabes que acabas de comprar una sonrisa, no seguridad.' },
          { txt:'Seguir el paso, sin mirarla', cambios:{humano:{fatiga:3,aislamiento:2}}, msg:'Te dejan pasar. "Volverás", dice a tu espalda. No es amenaza. Es estadística.' },
          { txt:'Mencionar a Mara Vex', cambios:{humano:{disociacion:2}}, msg:'Una pausa. La sonrisa no cambia, pero los ojos sí. "Ah. De esos." Te dejan pasar más rápido de lo que esperabas. Eso también incomoda.' }
        ]
      },
      { titulo:'LA CHICA DEL TEATRO SIN NOMBRE', narr:'Bajo el rótulo de neón rosa de un teatro, una joven con maquillaje corrido fuma en un descanso. No vende nada. Solo mira la lluvia caer sobre los faroles, como quien cuenta los días.',
        opciones:[
          { txt:'Seguir andando', cambios:{humano:{disociacion:4}}, msg:'Te preguntas cuántas caras como la suya has dejado atrás esta semana. No llevas la cuenta. Por eso duele.' },
          { txt:'Preguntarle si está bien', cambios:{humano:{fatiga:2,aislamiento:-4}}, msg:'"¿Bien?" Se ríe sin ganas. "Nadie pregunta eso aquí." Te mira distinto un segundo, antes de volver a la lluvia.' },
          { txt:'Dejarle unos créditos sin decir nada (-15 CR)', cambios:{creditos:-15,humano:{aislamiento:-5}}, msg:'Los mira. No dice gracias. Pero los guarda rápido, antes de que alguien del Loto lo vea.' }
        ]
      },
      { titulo:'SUSURRO ENTRE CORTINAS', narr:'Un hombre mayor, bien vestido, te agarra del brazo desde un reservado. "Tú no eres de aquí. Bien. Escucha: en este barrio las paredes oyen y el Loto vende lo que oyen. Cuida lo que dices en las camas que no pagas tú."',
        opciones:[
          { txt:'Agradecer el aviso', cambios:{humano:{aislamiento:-3}}, msg:'Asiente y se hunde de nuevo entre las cortinas. "Por nada. Aquí los favores también se cobran. Algún día."' },
          { txt:'Preguntar qué sabe él', cambios:{humano:{disociacion:2,fatiga:1}}, msg:'"¿Yo? Demasiado. Por eso bebo en la oscuridad." No dice más. Pero te deja con la sensación de haber rozado algo grande.' },
          { txt:'Soltarte y seguir', cambios:{humano:{aislamiento:3}}, msg:'Te suelta sin resistencia. "Como quieras. Pero recuerda quién te avisó." Tres pasos después, ya dudas de si pasó.' }
        ]
      }
    ],
    descripcionLlegada: 'El Arrabal Carmesí huele a incienso barato, lluvia y perfume rancio. Los faroles tiñen de rojo los charcos. Alguien te observa desde el primer segundo, calculando cuánto vales y cuánto puedes deber. El Loto Carmesí lleva este barrio desde antes de que nacieras.',
    opciones: [
      { txt:'Buscar a Mano Roja (tratos del Loto)', accion:'contacto_mano_roja' },
      { txt:'Explorar el mercado negro', accion:'mercado_negro' },
      { txt:'Esperar y observar', accion:'observar' },
      { txt:'← Volver al centro de la ciudad', accion:'volver_mapa_ciudad' }
    ]
  },
  {
    id: 'santuario_ix',
    nombre: 'SANTUARIO IX',
    nombreCorto: 'SANTUARIO',
    faccion: 'CULTO DE LA CARNE PERFECTA',
    colorFaccion: '#c084fc',
    desc: 'Una antigua fábrica de implantes reconvertida en templo. El Culto de la Carne Perfecta venera la fusión total con la máquina como camino a la trascendencia. Son pacíficos. Pero sus ojos no parpadean al ritmo correcto.',
    peligro: '⚠ ZONA CONTROLADA · DISCURSOS FRECUENTES · CONVERSIÓN VOLUNTARIA',
    posX: 280, posY: 170,
    imgBg: 'SANTUARIO_ZONA',
    eventos: [
      { titulo:'SERMÓN DESDE UN ALTAVOZ', narr:'Una voz mecánica repite sin parar: El dolor de la carne es la puerta. La máquina no miente. La máquina no muere. La gente pasa. Algunos se detienen.',
        opciones:[
          { txt:'Escuchar un momento', cambios:{humano:{disociacion:5}}, msg:'Sin darte cuenta llevas tres minutos parado. No recuerdas cuándo te detuviste.' },
          { txt:'Acelerar el paso', cambios:{humano:{fatiga:1}}, msg:'La voz sigue en tu cabeza un kilómetro después.' }
        ]
      },
      { titulo:'DEVOTA EN EL CAMINO', narr:'Una mujer con la mitad del rostro sustituida por paneles de titanio pulido te ofrece un folleto. Sonríe. Solo con la mitad que puede sonreír.',
        opciones:[
          { txt:'Rechazar el folleto educadamente', cambios:{humano:{aislamiento:1}}, msg:'Volverás, dice. Sin amenaza. Como una certeza.' },
          { txt:'Aceptar y leerlo', cambios:{humano:{disociacion:4}}, msg:'Tiene sentido de una forma que no debería tenerlo.' },
          { txt:'Preguntarle por el Santuario', cambios:{humano:{aislamiento:-3}}, msg:'Se ilumina. El panel de titanio capta el neón de otra forma. Te habla durante cinco minutos. No puedes interrumpirla.' }
        ]
      },
      { titulo:'NIÑO PERDIDO', narr:'Un niño de unos ocho años con un ojo artificial llora en la esquina. Lleva el emblema del Culto cosido al uniforme.',
        opciones:[
          { txt:'Ayudarle a encontrar a sus padres', cambios:{humano:{aislamiento:-6}}, msg:'Su madre aparece en dos minutos. Tiene ambos brazos mecánicos. Te da las gracias como si fuera la primera vez que alguien hace algo bueno.' },
          { txt:'Llamar a un seguidor del Culto cercano', cambios:{}, msg:'Un hombre de túnica blanca y cuatro dedos mecánicos se lleva al niño sin decirte nada.' },
          { txt:'Seguir tu camino', cambios:{humano:{disociacion:3,aislamiento:3}}, msg:'El llanto se apaga detrás de ti. O dejas de oírlo.' }
        ]
      }
    ],
    descripcionLlegada: 'El Santuario IX huele a aceite de máquina y algo dulzón que no tiene nombre. Las paredes están cubiertas de grabados: cuerpos humanos con partes mecánicas, todos con los ojos cerrados y las manos abiertas. Bienvenido.',
    opciones: [
      { txt:'Buscar a la Hermana Vael', accion:'contacto_vael' },
      { txt:'Explorar el templo interior', accion:'templo_interior' },
      { txt:'Escuchar el sermón principal', accion:'sermon' },
      { txt:'← Volver al centro de la ciudad', accion:'volver_mapa_ciudad' }
    ]
  },
  {
    id: 'nodo_cero',
    nombre: 'NODO FANTASMA',
    nombreCorto: 'NODO',
    faccion: 'COLECTIVO SIN NOMBRE — HACKERS ANTISISTEMA',
    colorFaccion: '#00ff88',
    desc: 'Un servidor muerto reconvertido en punto de encuentro. Sin nombre oficial. Sin dirección fija. El Colectivo no existe según HELIX. Y sin embargo aquí está, filtrando datos a las Pilas cada noche.',
    peligro: '⚠ ZONA INESTABLE · VIGILANCIA HELIX ALTA · ACCESO CAMBIA CADA 48H',
    posX: 180, posY: 280,
    imgBg: 'NODO_ZONA',
    eventos: [
      { titulo:'DRON DE VIGILANCIA HELIX', narr:'Un dron de reconocimiento HELIX pasa justo encima de ti. El ojo rojo te barre. No se detiene. Pero tarda un segundo más de lo normal.',
        opciones:[
          { txt:'Meterte en un portal hasta que pase', cambios:{humano:{fatiga:2}}, msg:'Huele a basura mojada. El dron sigue. Tú también.' },
          { txt:'Seguir andando normal', cambios:{humano:{disociacion:3}}, msg:'No pasa nada. Pero tienes la sensación de que ahora existe un archivo con tu cara.' }
        ]
      },
      { titulo:'GRAFFITI CIFRADO', narr:'Una pared entera cubierta de glifos que parecen decorativos. Pero algo en tu cabeza los está intentando leer.',
        opciones:[
          { txt:'Fotografiarlos mentalmente', cambios:{humano:{disociacion:4}}, msg:'Esa noche los soñarás. No recordarás qué significan, pero que hay algo ahí dentro lo sabes.' },
          { txt:'Ignorarlos', cambios:{}, msg:'Llevas diez pasos y te giras. Vuelves. Los miras. Son solo garabatos.' }
        ]
      },
      { titulo:'MENSAJERO DEL COLECTIVO', narr:'Un chico con la cara tapada te pasa un chip de datos sin decir nada. Luego desaparece entre la gente.',
        opciones:[
          { txt:'Guardar el chip', cambios:{humano:{disociacion:2}}, msg:'No tienes forma de leerlo ahora. Pesa nada. Pesa todo.' },
          { txt:'Tirarlo', cambios:{}, msg:'Lo tiras. Ves cómo lo recoge alguien del suelo a los dos segundos.' }
        ]
      }
    ],
    descripcionLlegada: 'El Nodo Fantasma está donde no debería estar. Paredes llenas de pantallas con streams de datos. Música sin melodía. Tres personas con las caras tapadas te miran al entrar. Nadie dice hola. Eso es normal aquí.',
    opciones: [
      { txt:'Buscar a Cero-Ocho', accion:'contacto_ceroocho' },
      { txt:'Consultar el tablón de filtraciones', accion:'tablon' },
      { txt:'Ofrecer información a cambio de créditos', accion:'vender_info' },
      { txt:'← Volver al centro de la ciudad', accion:'volver_mapa_ciudad' }
    ]
  },
  {
    id: 'distrito_ferro',
    nombre: 'DISTRITO FERRO',
    nombreCorto: 'FERRO',
    faccion: 'MAFIA ORGANIZADA — SINDICATO FERRO',
    colorFaccion: '#ff6b00',
    desc: 'El Sindicato Ferro controla este distrito desde hace cuarenta años. No hay violencia visible. No la necesitan. Todo aquí tiene un precio, un intermediario, y una deuda que te sigue si te vas.',
    peligro: '⚠ ZONA SEGURA SUPERFICIALMENTE · DEUDAS IMPAGADAS PELIGROSAS',
    posX: 80, posY: 320,
    imgBg: 'FERRO_ZONA',
    eventos: [
      { titulo:'COBRADOR DE DEUDAS', narr:'Un hombre trajeado con un implante ocular rojo se interpone en tu camino. No levanta la voz. Tienes algo para nosotros?',
        opciones:[
          { txt:'No os debo nada', cambios:{humano:{fatiga:2,disociacion:2}}, msg:'Sonríe. Todavía no. Se aparta. Te deja pasar. Eso es lo que más miedo da.' },
          { txt:'Darle algo (-50 CR)', cambios:{creditos:-50}, msg:'Acepta sin contar. Te pone una mano en el hombro un segundo. Bien.' }
        ]
      },
      { titulo:'RESTAURANTE FAMILIAR', narr:'Un olor a comida real. Un local pequeño, limpio, con personas mayores comiendo. Raro para este nivel. Muy raro.',
        opciones:[
          { txt:'Entrar y pedir algo (-40 CR)', cambios:{creditos:-40,humano:{fatiga:-5,hambre:-8,aislamiento:-4}}, msg:'La comida sabe a algo que no puedes nombrar porque hace demasiado que no lo comes. La anciana te llama cariño y no sabes cómo manejarlo.' },
          { txt:'Mirar desde fuera y seguir', cambios:{humano:{aislamiento:3}}, msg:'Hay una niña que te mira desde la ventana. Te sonríe. Sigues andando.' }
        ]
      },
      { titulo:'MÚSICO CALLEJERO', narr:'Un anciano toca un instrumento que no reconoces. La melodía es lenta y triste y hace que algo en el pecho apriete.',
        opciones:[
          { txt:'Dejarle algo (-15 CR)', cambios:{creditos:-15,humano:{aislamiento:-5,fatiga:-1}}, msg:'Asiente sin dejar de tocar. La melodía cambia ligeramente. Para ti.' },
          { txt:'Sentarte a escuchar un momento', cambios:{humano:{fatiga:-3,aislamiento:-4,disociacion:-2}}, msg:'Cinco minutos. Los primeros cinco minutos del día en que no piensas en nada.' },
          { txt:'Seguir', cambios:{humano:{aislamiento:2}}, msg:'La melodía se queda detrás de ti. Eso sí que no puedes dejarla.' }
        ]
      }
    ],
    descripcionLlegada: 'El Distrito Ferro es el único lugar de Las Pilas que parece tener orden. Edificios limpios. Farolas que funcionan. Gente que no corre. Todo eso tiene un precio, claro, y el Sindicato es quien lo cobra.',
    opciones: [
      { txt:'Buscar a Don Vasek', accion:'contacto_vasek' },
      { txt:'Comprar en el mercado legal', accion:'mercado_ferro' },
      { txt:'Pasear y observar el orden', accion:'observar_ferro' },
      { txt:'← Volver al centro de la ciudad', accion:'volver_mapa_ciudad' }
    ]
  },
  {
    id: 'hospital_helix',
    nombre: 'CENTRO MÉDICO PÚBLICO HELIX',
    nombreCorto: 'HOSPITAL',
    faccion: 'HELIX INDUSTRIES — RED MÉDICA',
    colorFaccion: '#00e5ff',
    desc: 'Una red de clínicas repartidas por la ciudad bajo el sello de HELIX. Aquí se curan lesiones, se instalan implantes básicos y se hacen revisiones. No por caridad: HELIX lo mantiene porque una población mínimamente sana sigue siendo productiva. La salud, como todo, es un cálculo.',
    peligro: '⚠ ACCESO PÚBLICO · LISTAS DE ESPERA · TODO QUEDA EN TU HISTORIAL',
    posX: 180, posY: 250,
    imgBg: 'HOSPITAL_ZONA',
    eventos: [
      { titulo:'COLA DE PACIENTES', narr:'La sala de espera está llena. Doscientas personas, quizá más, bajo luces que zumban. Un panel anuncia tiempos de espera que nadie se cree. Alguien tose sin parar tres asientos más allá.',
        opciones:[
          { txt:'Esperar tu turno con paciencia', cambios:{humano:{fatiga:4,aislamiento:-2}}, msg:'Dos horas después oyen tu número. Has visto a media ciudad pasar por delante. Algunos no llegaron a entrar.' },
          { txt:'Buscar un atajo entre el personal', cambios:{humano:{fatiga:1,disociacion:2}}, msg:'Un celador te mira de arriba abajo. "Aquí todos tienen prisa." Pero te deja pasar a una sala lateral. No preguntas por qué.' }
        ]
      },
      { titulo:'ERROR EN TU HISTORIAL', narr:'La pantalla del mostrador muestra tu ficha. Hay datos que no son tuyos: una operación que nunca te hicieron, una alergia que no tienes. El administrativo frunce el ceño. "¿Usted es quien dice ser?"',
        opciones:[
          { txt:'Insistir en que es un error', cambios:{humano:{fatiga:3,disociacion:3}}, msg:'Tardan cuarenta minutos en "corregirlo". No estás seguro de que lo hayan hecho. Tu nombre ahora convive con el de otro en algún servidor de HELIX.' },
          { txt:'Dejarlo pasar para no complicarte', cambios:{humano:{disociacion:5}}, msg:'Aceptas el historial ajeno como si fuera tuyo. Es más fácil. Pero algo en ti registra que acabas de ceder una parte de quién eres.' }
        ]
      },
      { titulo:'PACIENTE QUE NECESITA AYUDA', narr:'Un hombre mayor se ha caído junto a las máquinas expendedoras. Nadie se para. La gente lo rodea como agua a una piedra. Respira, pero no se levanta.',
        opciones:[
          { txt:'Ayudarle a incorporarse', cambios:{humano:{fatiga:2,aislamiento:-6}}, msg:'Pesa menos de lo que debería. "Gracias", murmura. Un celador llega tarde y se lo lleva. Te quedas con la sensación de haber hecho algo pequeño y necesario.' },
          { txt:'Avisar a un sanitario y seguir', cambios:{humano:{aislamiento:1}}, msg:'Avisas a alguien de bata. Asiente sin mirarte. Cuando te vas, el hombre sigue en el suelo.' }
        ]
      }
    ],
    descripcionLlegada: 'El Centro Médico Público HELIX huele a desinfectante barato y a demasiada gente junta. Bajo el logo iluminado de HELIX, ambulancias descargan camillas sin descanso. Carteles en cuatro idiomas prometen que tu salud es su prioridad. Las listas de espera dicen otra cosa.',
    opciones: [
      { txt:'Buscar a la Dra. Lira Malk', accion:'contacto_lira' },
      { txt:'Curar tus heridas', accion:'hospital_curar' },
      { txt:'Pedir una revisión médica', accion:'hospital_revision' },
      { txt:'Preguntar por implantes básicos', accion:'hospital_implantes' },
      { txt:'← Volver al centro de la ciudad', accion:'volver_mapa_ciudad' }
    ]
  }
];

let _zonaSeleccionada = null;
let _zonaActual = null;
let _eventosPendientesTL = [];
let _idxEventoTL = 0;
let _paradasViajeTL = [];
let _idxParadaTL = 0;
let _eventoActualTL = null;
let _tiempoPorParadaTL = 50;  // minutos de juego que cuesta cada parada (recalculado al iniciar viaje según visitas previas)

function renderizarMapa(){
  // En PC usamos la imagen horizontal del mapa, cuyas zonas están en
  // posiciones distintas a la vertical de móvil. Cada marcador lleva en
  // el HTML sus coordenadas de PC (data-pc-left / data-pc-top) además de
  // las de móvil (style original). Aquí elegimos cuáles aplicar.
  const esPC = window.matchMedia('(min-width: 900px)').matches;

  // Actualiza la etiqueta de reputación de cada marcador anclado
  // sobre el mapa Strata I. Los marcadores ya están en el HTML;
  // aquí solo refrescamos el texto de REP y la clase visual.
  ZONAS_MUNDO.forEach(zona => {
    const marker = document.querySelector('.zona-marker[data-zona="'+zona.id+'"]');
    if(!marker) return;

    // Reposicionar según dispositivo.
    if(esPC && marker.dataset.pcLeft && marker.dataset.pcTop){
      // Guardamos las coords de móvil la primera vez, por si volvemos.
      if(!marker.dataset.movLeft){
        marker.dataset.movLeft = marker.style.left;
        marker.dataset.movTop = marker.style.top;
      }
      marker.style.left = marker.dataset.pcLeft;
      marker.style.top = marker.dataset.pcTop;
    } else if(!esPC && marker.dataset.movLeft){
      marker.style.left = marker.dataset.movLeft;
      marker.style.top = marker.dataset.movTop;
    }

    const rep = getRepZona(zona.id);
    const repEl = document.getElementById('zm-rep-'+zona.id);

    // Limpiar clases previas de reputación
    marker.classList.remove('rep-pos','rep-neg','rep-neu');

    if(rep > 15){
      if(repEl) repEl.textContent = 'REP +'+rep;
      marker.classList.add('rep-pos');
    } else if(rep < -15){
      if(repEl) repEl.textContent = 'REP '+rep;
      marker.classList.add('rep-neg');
    } else {
      // Reputación neutra: no mostramos texto para no saturar el mapa
      if(repEl) repEl.textContent = '';
      marker.classList.add('rep-neu');
    }
  });
}

function seleccionarZona(id){
  const zona = ZONAS_MUNDO.find(function(z){ return z.id === id; });
  if(!zona) return;
  _zonaSeleccionada = zona;

  const rep = getRepZona(id);
  let repTexto, repClase;
  if(rep > 15){ repTexto = 'REPUTACIÓN POSITIVA (+'+rep+')'; repClase = 'positiva'; }
  else if(rep < -15){ repTexto = 'REPUTACIÓN NEGATIVA ('+rep+')'; repClase = 'negativa'; }
  else { repTexto = 'REPUTACIÓN NEUTRA'; repClase = 'neutra'; }

  document.getElementById('zd-faccion').textContent = zona.faccion;
  document.getElementById('zd-faccion').style.color = zona.colorFaccion;
  document.getElementById('zd-nombre').textContent = zona.nombre;
  document.getElementById('zd-nombre').style.color = zona.colorFaccion;
  document.getElementById('zd-desc').textContent = getDescZona(zona);
  document.getElementById('zd-peligro').textContent = zona.peligro;
  const repEl = document.getElementById('zd-rep');
  repEl.textContent = repTexto;
  repEl.className = 'zd-reputacion ' + repClase;

  const btnViajar = document.getElementById('btn-viajar-zona');
  btnViajar.style.borderColor = zona.colorFaccion + '66';
  btnViajar.style.color = zona.colorFaccion;

  document.getElementById('zona-detalle').classList.add('visible');
}

function cerrarDetalleZona(){
  document.getElementById('zona-detalle').classList.remove('visible');
  _zonaSeleccionada = null;
}

// Cerrar el panel de detalle de zona al tocar fuera (en el mapa).
// Si el clic NO ha sido sobre el panel ni sobre un marcador de zona,
// se cierra el panel automáticamente.
(function(){
  var escenaMapa = document.getElementById('mapa-escena');
  if(!escenaMapa) return;
  escenaMapa.addEventListener('click', function(e){
    var panel = document.getElementById('zona-detalle');
    if(!panel || !panel.classList.contains('visible')) return;
    // No cerrar si el clic es dentro del panel o sobre un marcador.
    if(e.target.closest('.zona-detalle')) return;
    if(e.target.closest('.zona-marker')) return;
    if(e.target.closest('.btn-volver-apt-mapa')) return;
    cerrarDetalleZona();
  });
})();

function abrirMapa(){
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('apartamento', 'mapa-escena');
  } else {
    document.getElementById('apartamento').classList.remove('activa');
    document.getElementById('mapa-escena').classList.add('activa');
  }
  // Fondo del mapa: en pantallas anchas (PC) usamos la versión
  // horizontal preparada; en móvil, la vertical. La imagen se pinta en
  // .mapa-img (dentro del marco con background:cover); #bg-mapa queda
  // en negro para que no se duplique la imagen detrás del marco.
  (function(){
    const img = document.getElementById('mapa-img');
    const bg = document.getElementById('bg-mapa');
    if(bg) bg.style.background = '#030508';
    if(!img || typeof ASSETS === 'undefined') return;
    const esPC = window.matchMedia('(min-width: 900px)').matches;
    const key = esPC ? 'MAPA_STRATA_PC' : 'MAPA_STRATA';
    if(ASSETS[key]) img.style.backgroundImage = `url('${ASSETS[key]}')`;
  })();
  renderizarMapa();
  const sub = document.getElementById('mapa-subtitulo');
  if(sub && Estado.jugador) sub.textContent = Estado.jugador.nombre + ' · ELIGE UN DESTINO';
}

function volverApartamentoDesMapa(){
  cerrarDetalleZona();
  // Si el mapa se abrió desde el terminal, volvemos al terminal.
  if(window._mapaDesdeTerminal){
    window._mapaDesdeTerminal = false;
    if(typeof cambiarEscena === 'function'){
      cambiarEscena('mapa-escena', 'terminal-escena');
    } else {
      document.getElementById('mapa-escena').classList.remove('activa');
      document.getElementById('terminal-escena').classList.add('activa');
    }
    if(typeof mostrarEscritorioHelix === 'function') mostrarEscritorioHelix();
    return;
  }
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('mapa-escena', 'apartamento');
  } else {
    document.getElementById('mapa-escena').classList.remove('activa');
    document.getElementById('apartamento').classList.add('activa');
  }
  if(typeof regenerarOpcionesAptCierre === 'function') regenerarOpcionesAptCierre();
}

function iniciarViajeAZona(){
  if(!_zonaSeleccionada) return;
  // Si veníamos del terminal, al viajar ya no volvemos a él.
  window._mapaDesdeTerminal = false;
  _zonaActual = _zonaSeleccionada;
  cerrarDetalleZona();
  if(typeof saltoDeEscena === 'function') saltoDeEscena();

  // === AVANCE DE TIEMPO DEL VIAJE ===
  // Cada parada del viaje cuesta tiempo de juego. Si el jugador ya
  // ha visitado esta zona antes, conoce el camino y tarda menos:
  // los 3 saltos del trayecto cuentan como ~2 (100-140 min en lugar
  // de 150-210 min). Es lógico: ya conoces el camino, ya sabes qué
  // tren coger, qué pasillo evitar, etc.
  const visitasPrevias = (function(){
    try {
      const d = cargarEstadoZonas();
      return (d[_zonaActual.id] && d[_zonaActual.id].visitas) || 0;
    } catch(e){ return 0; }
  })();
  // Si nunca has ido: 50 min × 3 saltos = 150 min total (+0..60 aleatorio)
  // Si ya conoces el sitio: 35 min × 3 saltos = 105 min total (+0..35 aleatorio)
  if(visitasPrevias > 0){
    _tiempoPorParadaTL = 35 + Math.floor(Math.random() * 12);  // 35-47 min por parada
  } else {
    _tiempoPorParadaTL = 50 + Math.floor(Math.random() * 20);  // 50-70 min por parada
  }

  const eventos = _zonaActual.eventos.slice();
  for(let i = eventos.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = eventos[i]; eventos[i] = eventos[j]; eventos[j] = tmp;
  }
  _eventosPendientesTL = eventos.slice(0, 2);
  _idxEventoTL = 0;

  _paradasViajeTL = generarParadasViaje(_zonaActual);
  _idxParadaTL = 0;

  document.getElementById('tl-zona-destino').textContent = '→ ' + _zonaActual.nombre;
  document.getElementById('tl-zona-destino').style.color = _zonaActual.colorFaccion;

  if(typeof cambiarEscena === 'function'){
    cambiarEscena('mapa-escena', 'transito-libre-escena');
  } else {
    document.getElementById('mapa-escena').classList.remove('activa');
    document.getElementById('transito-libre-escena').classList.add('activa');
  }
  setTimeout(mostrarSiguienteParadaTL, 400);
}

// ── POOLS DE TEXTO PARA EL TRÁNSITO ──────────────────────────
// Parada 1 y 2: variantes globales (cualquier destino).
// Parada 3: variantes por zona (aproximación específica).
// Se elige una al azar en cada viaje.

const _POOL_CORREDOR = [
  'El corredor del edificio. Dieciséis puertas cerradas. Ningún vecino visible. El ascensor tarda cuatro minutos en bajar.',
  'Alguien ha dejado una bolsa de basura en el rellano desde hace tres días. Nadie la ha movido. Nadie pregunta.',
  'La luz del pasillo parpadea en el tramo final. Lleva parpadeando desde que llegaste al edificio. Probablemente seguirá así.',
  'Dos pisos más arriba hay música amortiguada. No reconoces la canción. Dura exactamente hasta que entras al ascensor.',
  'El ascensor huele a desinfectante y a algo que el desinfectante no ha conseguido cubrir del todo.',
  'Una cámara HELIX en el techo gira medio grado cuando pasas. Siempre lo hace. Probablemente no significa nada.',
  'El panel del ascensor pide tu huella. La acepta a la tercera. «GRACIAS POR SU PACIENCIA, CIUDADANO», dice, sin paciencia ninguna.',
  'Una puerta entreabierta deja ver a un hombre dormido frente a tres pantallas encendidas. Ninguna emite sonido. Sigue durmiendo.',
  'El número de tu planta lleva apagado meses. Te orientas por la mancha de humedad de la pared, que tiene forma de algo que prefieres no mirar dos veces.',
  'Pegado al buzón comunitario, un aviso de HELIX: «REESTRUCTURACIÓN DE SERVICIOS EN CURSO». Lleva la misma fecha desde el invierno pasado.',
  'En el rellano, un altar improvisado: una vela LED, una foto descolorida, flores de plástico. Alguien de este bloque ya no baja.',
  'El zumbido del transformador del sótano sube por el hueco de la escalera. Es el latido del edificio. Hoy suena más cansado que ayer.'
];

const _POOL_TREN = [
  'El tren vertical huele a gente mojada y aceite. Una pantalla HELIX parpadea: RECUERDA. TU SEGURIDAD ES NUESTRA PRIORIDAD.',
  'El vagón va medio lleno. Nadie se mira. Todos llevan auriculares o miran el techo. La normalidad aquí tiene una textura muy concreta.',
  'Una mujer mayor lleva una caja de cartón cerrada con cinta adhesiva. La abraza como si dentro hubiera algo vivo. Puede que lo haya.',
  'HELIX NEWS en la pantalla del vagón: "Índice de bienestar ciudadano alcanza máximo histórico." Nadie levanta la vista.',
  'El tren se detiene entre estaciones durante cuarenta y dos segundos. Sin aviso. Luego arranca. Nadie dice nada.',
  'Un chico de unos diecisiete años lleva un implante óptico sin carcasa. El circuito está a la vista. Te mira como si supiera algo que tú no.',
  'El tren cruza un tramo sin paredes. Por la ventanilla, las Pilas se apilan hacia arriba hasta que la lluvia se las traga. No alcanzas a ver el cielo. Nunca lo alcanzas.',
  'Un anuncio de implantes de memoria HELIX se repite en bucle: «¿Y si pudieras elegir qué olvidar?». La pasajera de enfrente lo mira con una atención que da miedo.',
  'Alguien ha rascado en el plástico del asiento un solo símbolo: tres líneas curvas que se cierran. Apartas la mirada antes de entender por qué te resulta familiar.',
  'Dos operarios del Sindicato Ferro hablan bajo sobre una deuda que no es la suya. Callan en cuanto notan que existes. El resto del trayecto fingen no haberte visto.',
  'El vagón frena y todos se inclinan a la vez, como una sola criatura cansada. Nadie se sujeta. Hace tiempo que aprendieron a caer juntos.',
  'Por megafonía, una voz sintética agradece tu confianza en el transporte HELIX. La grabación tiene un siseo de fondo, como si llevara décadas repitiéndose.'
];

const _POOL_APROXIMACION = {
  distrito_ferro: [
    'El olor cambia antes de llegar. Aceite, metal caliente y algo dulzón que no deberías reconocer. Lo reconoces igual.',
    'Los carteles de FERROCORP aparecen cada cincuenta metros. No son publicidad. Son recordatorios.',
    'Un cobrador del Sindicato Ferro está apoyado en una esquina. No hace nada. Solo está ahí. Eso es suficiente.',
    'El suelo aquí tiene más relieves de barro que en las Pilas. Las máquinas no paran nunca. La gente tampoco.',
    'Tres trabajadores con cascos naranjas pasan sin mirarte. Llevan turnos de dieciséis horas. Se nota en cómo caminan.',
    'Las farolas funcionan todas. Las aceras están barridas. En Ferro el orden no es un regalo: es un aviso de quién manda y de lo que cuesta romperlo.',
    'En la puerta de un local, dos hombres de traje idéntico te ven llegar. No te paran. Solo memorizan tu cara para cuando haga falta.'
  ],
  arrabal_carmesi: [
    'El ruido llega antes que la luz. Voces, música sin melodía reconocible, el golpe sordo de algo que no quieres identificar.',
    'Linternas rojas en cada esquina. No es decoración. Es el código del Arrabal: rojo significa que alguien controla ese tramo.',
    'Un cartel pintado a mano: FUEGO LENTO — COMIDA REAL — PRECIO REAL. El humo que sale huele a que es verdad.',
    'Dos hombres discuten en voz baja junto a una entrada. Cuando te ven, paran. Cuando pasas, siguen. No ibas en la conversación.',
    'El Arrabal Carmesí no duerme porque no puede permitírselo. La energía aquí es la del que sabe que parar cuesta más que seguir.',
    'Una chica con los ojos pintados de plata te ofrece una sonrisa de catálogo y la retira en cuanto calcula que no vas a pagarla. Aquí hasta la amabilidad cotiza.',
    'El emblema del Loto —una flor abierta sobre fondo negro— cuelga sobre cada portal. No es marca de comercio. Es marca de propiedad.'
  ],
  santuario_ix: [
    'Los primeros carteles aparecen a tres manzanas. TU CARNE ES TEMPORAL. LA FUSIÓN ES ETERNA. Alguien los ha colocado a la altura de los ojos exacta.',
    'Un grupo de conversos camina en fila. No hablan. Llevan el símbolo del Santuario en el cuello, grabado, no impreso.',
    'Residuos biomédicos en contenedores sin tapas. Nadie los mira. Llevan aquí suficiente tiempo para que la gente haya aprendido a no verlos.',
    'Una clínica de implantes con la persiana medio bajada. Dentro, luz quirúrgica. Alguien está despierto a esta hora. Alguien siempre está despierto.',
    'El dron de Santuario IX sobrevuela la entrada. Lleva el símbolo de la Carne Perfecta pintado en el fuselaje. Bienvenido, hermano.',
    'Una voz serena recita por los altavoces que el dolor es solo carne pidiendo ser corregida. Lo dice tan despacio que casi le crees.',
    'En un muro, alguien ha escrito a mano «LA MÁQUINA NO MIENTE». Debajo, más pequeño y más reciente: «pero olvida». Nadie lo ha borrado todavía.'
  ],
  nodo_cero: [
    'La dirección del Nodo cambia cada cuarenta y ocho horas. Hoy toca aquí. Mañana nadie sabrá dónde.',
    'Alguien ha proyectado texto verde en la fachada de un edificio abandonado: LA INFORMACIÓN NO QUIERE SALVARTE. QUIERE LIBERARTE.',
    'Un dron HELIX patrulla la zona con más frecuencia de lo habitual. El Colectivo lo sabe. Tú también deberías saberlo.',
    'Tres personas con la cara cubierta pasan en dirección contraria. Uno de ellos te mira exactamente un segundo. Luego aparta la vista.',
    'Grafiti reciente en la acera: SOMOS EL ERROR QUE ELLOS NO PUDIERON ELIMINAR. La pintura todavía brilla.',
    'No hay carteles. No hay neón. Solo cables tendidos de ventana a ventana y el zumbido de demasiados servidores trabajando donde no debería haber ninguno.',
    'Una pintada a medio borrar repite tres veces la misma palabra: CERO. CERO. CERO. Como si quien la escribió necesitara convencerse de que existe.'
  ]
};

function _aleatorio(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

// ── POOL DE DESCRIPCIONES DE ZONA ────────────────────────────
// 4 variantes por zona, ajustadas al lore y a lo que se ve en el
// fondo. Se elige una al azar cada vez que se abre el panel.
const _POOL_DESC_ZONA = {
  distrito_ferro: [
    'El Sindicato Ferro controla este distrito desde hace cuarenta años. No hay violencia visible. No la necesitan. Todo aquí tiene un precio, un intermediario, y una deuda que te sigue si te vas.',
    'FERROCORP nunca apaga sus hornos. El distrito entero vibra con el ruido de la fundición H-07. La gente trabaja turnos que no terminan y nadie recuerda haber firmado por ellos.',
    'Aquí todo se compra, se vende o se debe. El mercado de repuestos usados no cierra nunca. Si buscas algo que no debería existir, alguien en Ferro lo tiene. Por un precio.',
    'Carga y descarga las veinticuatro horas. Mantén el nivel de ruido bajo, dice el cartel. Nadie lo cumple. El Sindicato lo permite mientras la mercancía siga moviéndose.',
    'Las calles más limpias de las Pilas. La gente saluda, los comercios pagan a tiempo, los niños juegan sin miedo. Don Vasek lo llama orden. Otros lo llaman de otra manera, pero no en voz alta.',
    'En Ferro el favor es una moneda más estable que el crédito. Aceptas uno y dejas de pertenecerte un poco. Aquí casi todo el mundo le debe algo a alguien, y todos fingen que no.'
  ],
  arrabal_carmesi: [
    'El barrio rojo de las Pilas. Linternas de papel, humo de comida real y deudas que se cobran de otras maneras. Aquí el placer es la moneda y todo el mundo paga.',
    'Bares, casas de apuestas y clubes privados apilados en vertical. El Nido Rojo nunca pregunta de dónde vienes. El Arrabal vive de noche porque de día prefiere no recordarse.',
    'Comida real, precio real, dice el neón. Es de las pocas cosas honestas del Arrabal. Todo lo demás aquí tiene una segunda lectura y una tercera factura.',
    'Zona vigilada, avisa el cartel a la entrada. No por la policía corporativa: por quien de verdad manda aquí. En el Arrabal, ser visto es lo normal. Que te recuerden es el problema.',
    'El Loto Carmesí no vende cuerpos: vende lo que la gente confiesa cuando se cree a salvo. Cada cortina granate esconde un trato, y cada trato deja un hilo del que tirar más tarde.',
    'Aquí la noche tiene reglas que nadie escribe pero todos conocen. Mira lo que quieras, toca lo que pagues, y no preguntes nunca quién llora detrás de qué puerta.'
  ],
  santuario_ix: [
    'Una antigua fábrica de implantes reconvertida en templo. El Culto de la Carne Perfecta venera la fusión total con la máquina como camino a la trascendencia. Son pacíficos. Pero sus ojos no parpadean al ritmo correcto.',
    'Tu carne es temporal. La fusión es eterna. El mensaje está en cada pared, en cada idioma. Las clínicas de transformación nunca cierran y la lista de conversos voluntarios siempre crece.',
    'Residuos biomédicos en los contenedores, luz quirúrgica en las clínicas, sermones a las 10:22. Santuario IX ofrece mejorar tu cuerpo. Lo que no dice es qué parte de ti pagas a cambio.',
    'Unidad, fusión, trascendencia. El culto recibe a todos como hermanos. Bienvenido, dice el cartel del ascensor. La amabilidad aquí es real. Eso es lo que la hace difícil de rechazar.',
    'La Hermana Vael predica que el alma es solo firmware mal escrito y que la carne es el error que el Culto vino a corregir. Lo dice con tanta dulzura que cuesta recordar que está hablando de cortar.',
    'Nadie obliga a nadie a quedarse en el Santuario. Por eso es tan inquietante: la gente entra por su pie y, al cabo de las semanas, parpadea distinto, habla más lento, sonríe con media cara.'
  ],
  nodo_cero: [
    'Un servidor muerto reconvertido en punto de encuentro. Sin nombre oficial. Sin dirección fija. El Colectivo no existe según HELIX. Y sin embargo aquí está, filtrando datos a las Pilas cada noche.',
    'La información es libertad, proclaman las pantallas verdes. El Nodo Fantasma vende acceso remoto, identidades limpias y verdades que HELIX preferiría enterrar. La verdad está en el código.',
    'Una red descentralizada fuera del alcance de HELIX. Hackers, fugitivos y gente que ya no tiene nada que perder. Somos el error que ellos no pudieron eliminar, dice el grafiti.',
    'El sistema no te protegerá. La verdad no se vende, se comparte. El Nodo cambia de ubicación cada pocos días para sobrevivir. Hoy está aquí. Conéctate mientras puedas.',
    'El Colectivo Sin Nombre rasca en los archivos de HELIX buscando lo que la corporación borró. A veces encuentran agujeros con forma de algo más grande. A veces encuentran la palabra CERO, y entonces nadie duerme.',
    'Aquí nadie usa su cara ni su nombre. Confías en la firma de un dato, no en la persona. Es un sitio frío y paranoico, y aun así es lo más parecido a la libertad que verás en las Pilas.'
  ]
};

function getDescZona(zona){
  const pool = _POOL_DESC_ZONA[zona.id];
  return pool ? _aleatorio(pool) : zona.desc;
}

function generarParadasViaje(zona){
  const rep = getRepZona(zona.id);
  let descLlegada;
  if(rep < -20) descLlegada = 'Llegas con deudas aquí. El ambiente lo percibe antes de que lo hagas tú.';
  else if(rep > 20) descLlegada = 'Te conocen aquí. O al menos, conocen tu reputación. Eso puede ser bueno.';
  else {
    const poolAprox = _POOL_APROXIMACION[zona.id];
    descLlegada = poolAprox ? _aleatorio(poolAprox) : 'El sector cambia de tono a medida que te acercas. Diferente tipo de ruido. Diferente tipo de mirada.';
  }

  const imgT1 = { distrito_ferro:'FERRO_TRANSITO_1', arrabal_carmesi:'CARMESI_TRANSITO_1', santuario_ix:'SANTUARIO_TRANSITO_1', nodo_cero:'NODO_TRANSITO_1', hospital_helix:'TRANSITO_HOSPITAL_1' }[zona.id] || 'PASILLO';
  const imgT2 = { distrito_ferro:'FERRO_TRANSITO_2', arrabal_carmesi:'CARMESI_TRANSITO_2', santuario_ix:'SANTUARIO_TRANSITO_2', nodo_cero:'NODO_TRANSITO_2', hospital_helix:'TRANSITO_HOSPITAL_2' }[zona.id] || 'TREN';
  const imgT3 = { distrito_ferro:'FERRO_TRANSITO_3', arrabal_carmesi:'CARMESI_TRANSITO_3', santuario_ix:'SANTUARIO_TRANSITO_3', nodo_cero:'NODO_TRANSITO_3', hospital_helix:'TRANSITO_HOSPITAL_3' }[zona.id] || zona.imgBg;

  return [
    { nombre:'SALIENDO DE UNIDAD 273-19A', desc:_aleatorio(_POOL_CORREDOR), color:'#00e5ff', img:imgT1 },
    { nombre:'TRÁNSITO NIVEL 9 — LÍNEA VERTICAL', desc:_aleatorio(_POOL_TREN), color:'rgba(200,216,224,0.5)', img:imgT2 },
    { nombre:'APROXIMACIÓN A ' + zona.nombreCorto, desc:descLlegada, color:zona.colorFaccion, img:imgT3 }
  ];
}

async function mostrarSiguienteParadaTL(){
  const cont = document.getElementById('tarjetas-loc-libre');
  const bg = document.getElementById('bg-transito-libre');

  if(_idxParadaTL < _paradasViajeTL.length){
    const p = _paradasViajeTL[_idxParadaTL];
    bg.style.opacity = '0.3';
    await esperar(250);
    if(typeof ASSETS !== 'undefined' && ASSETS[p.img]) bg.style.backgroundImage = 'url(' + ASSETS[p.img] + ')';
    bg.style.backgroundPosition = 'center';
    bg.style.opacity = '1';
    await esperar(50);
    cont.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'tarjeta-loc visible';
    card.innerHTML = '<div class="loc-nombre" style="color:'+p.color+'" id="tl-nombre-tw"></div>' +
                     '<div class="loc-desc" id="tl-desc-tw"></div>' +
                     '<div id="tl-btn-wrap" style="opacity:0;transition:opacity 0.5s"></div>';
    cont.appendChild(card);
    await typeWriter('tl-nombre-tw', p.nombre, 30);
    await esperar(200);
    await typeWriter('tl-desc-tw', p.desc, 18);
    await esperar(400);
    const wrap = document.getElementById('tl-btn-wrap');
    wrap.innerHTML = '<button class="opcion-btn" onclick="avanzarTransitoLibre()">CONTINUAR →</button>';
    wrap.style.opacity = '1';
    _idxParadaTL++;
    return;
  }

  if(_idxEventoTL < _eventosPendientesTL.length){
    const ev = _eventosPendientesTL[_idxEventoTL];
    _eventoActualTL = ev;
    cont.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'tarjeta-loc visible';
    let opcsHTML = '';
    for(let i = 0; i < ev.opciones.length; i++){
      opcsHTML += '<button class="opcion-btn" style="margin-top:0.3rem" onclick="resolverEventoTL('+i+')">'+ev.opciones[i].txt+'</button>';
    }
    card.innerHTML = '<div class="loc-nombre" style="color:'+_zonaActual.colorFaccion+';font-size:0.65rem;letter-spacing:0.25em" id="tl-ev-titulo"></div>' +
                     '<div class="loc-desc" id="tl-ev-narr" style="margin-bottom:0.8rem"></div>' +
                     '<div>' + opcsHTML + '</div>';
    cont.appendChild(card);
    await typeWriter('tl-ev-titulo', ev.titulo, 30);
    await esperar(200);
    await typeWriter('tl-ev-narr', ev.narr, 16);
    _idxEventoTL++;
    return;
  }

  await esperar(500);
  llegarAZona();
}

function avanzarTransitoLibre(){
  // Cada parada del viaje consume tiempo de juego. El total se aproxima
  // a 100-140 min si conoces el camino, 150-210 si no. Ver iniciarViajeAZona.
  if(typeof avanzarTiempoJuego === 'function'){
    avanzarTiempoJuego(_tiempoPorParadaTL || 50);
  }
  mostrarSiguienteParadaTL();
}

async function resolverEventoTL(opcionIdx){
  const ev = _eventoActualTL;
  if(!ev) return;
  const op = ev.opciones[opcionIdx];
  if(!op) return;

  const c = op.cambios || {};
  if(c.creditos && typeof ajustarCreditos === 'function') ajustarCreditos(c.creditos);
  else if(c.creditos){
    Estado.creditos = Math.max(0, (Estado.creditos || 0) + c.creditos);
    if(typeof actualizarHUD === 'function') actualizarHUD();
  }
  if(c.creditos && typeof notificarCambio === 'function'){
    notificarCambio((c.creditos >= 0 ? '+' : '') + c.creditos + ' CR', 'creditos');
  }
  if(c.humano){
    for(const k in c.humano){
      if(typeof ajustarHumano === 'function') ajustarHumano(k, c.humano[k]);
    }
  }
  // Antes los eventos de zona solo aplicaban créditos y estado humano:
  // si una opción prometía un objeto o reputación, se perdía. Ahora
  // también se aplican item, condición y reputación de facción.
  if(c.item){
    if(typeof darItemPorId === 'function') darItemPorId(c.item);
    else if(typeof darItem === 'function') darItem(c.item);
  }
  if(c.quitaItem && typeof quitarItem === 'function') quitarItem(c.quitaItem, 1);
  if(c.condicion && typeof aplicarCondicion === 'function') aplicarCondicion(c.condicion);
  if(c.faccion && typeof c.rep === 'number' && typeof cambiarRepFaccion === 'function'){
    cambiarRepFaccion(c.faccion, c.rep);
  }

  const cont = document.getElementById('tarjetas-loc-libre');
  cont.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'tarjeta-loc visible';
  card.innerHTML = '<div class="loc-desc" style="border-left:2px solid '+_zonaActual.colorFaccion+';padding-left:0.8rem;margin-bottom:1rem" id="tl-resultado"></div>' +
                   '<div id="tl-btn-siguiente" style="opacity:0;transition:opacity 0.5s"></div>';
  cont.appendChild(card);
  await typeWriter('tl-resultado', op.msg, 20);
  await esperar(300);
  const wrap = document.getElementById('tl-btn-siguiente');
  wrap.innerHTML = '<button class="opcion-btn" onclick="avanzarTransitoLibre()">CONTINUAR →</button>';
  wrap.style.opacity = '1';
}

function llegarAZona(){
  const zona = _zonaActual;
  if(!zona) return;

  registrarVisitaZona(zona.id);
  if(typeof saltoDeEscena === 'function') saltoDeEscena();

  const bg = document.getElementById('bg-zona');
  // Asignar imagen de fondo de la zona. Si la clave imgBg no existe
  // en ASSETS (typo, asset borrado, etc.), usar PASILLO como fallback
  // para no dejar nunca la pantalla con fondo negro.
  let claveBg = zona.imgBg;
  if(typeof ASSETS === 'undefined' || !ASSETS[claveBg]){
    console.warn('Zona "'+zona.id+'" usa imgBg "'+claveBg+'" que no existe en ASSETS. Usando PASILLO como fallback.');
    claveBg = 'PASILLO';
  }
  if(typeof ASSETS !== 'undefined' && ASSETS[claveBg]) bg.style.backgroundImage = 'url(' + ASSETS[claveBg] + ')';
  bg.style.backgroundPosition = 'center';

  const rep = getRepZona(zona.id);
  let repTexto;
  if(rep > 15) repTexto = '◈ REPUTACIÓN POSITIVA AQUÍ (+'+rep+')';
  else if(rep < -15) repTexto = '◈ REPUTACIÓN NEGATIVA AQUÍ ('+rep+') — CUIDADO';
  else repTexto = '◈ REPUTACIÓN NEUTRA — ERES UN DESCONOCIDO';

  document.getElementById('zona-llegada-nombre').textContent = zona.nombre;
  document.getElementById('zona-llegada-nombre').style.color = zona.colorFaccion;
  document.getElementById('zona-llegada-faccion').textContent = zona.faccion;
  document.getElementById('zona-llegada-desc').textContent = zona.descripcionLlegada;
  document.getElementById('zona-llegada-desc').style.borderColor = zona.colorFaccion + '55';
  document.getElementById('zona-rep-display').textContent = repTexto;
  document.getElementById('zona-rep-display').style.color = rep > 15 ? '#00e5ff' : rep < -15 ? '#ff006e' : 'rgba(200,216,224,0.45)';

  // --- HOSTILIDAD DE FACCIÓN AL ENTRAR EN SU ZONA ---
  // 3 niveles según tu reputación de facción con la dueña de la zona.
  let _zonaBloqueada = false;
  if(typeof nivelHostilidadZona === 'function'){
    const nivel = nivelHostilidadZona(zona.id);
    const descEl = document.getElementById('zona-llegada-desc');
    if(nivel === 'mal_recibido'){
      descEl.textContent = zona.descripcionLlegada + '  Aquí no eres bienvenido: miradas de desprecio, hombros que se giran. Nadie te toca, pero notas el peso de no ser querido.';
      if(typeof aplicarCambios === 'function') aplicarCambios({ humano:{ fatiga:3, aislamiento:4 } });
    } else if(nivel === 'no_ayudan'){
      descEl.textContent = zona.descripcionLlegada + '  En cuanto te reconocen, las puertas se cierran. Aquí ya no tienes amigos: nadie de esta facción moverá un dedo por ti.';
      if(typeof aplicarCambios === 'function') aplicarCambios({ humano:{ fatiga:4, aislamiento:6 } });
      _zonaBloqueada = true;
    } else if(nivel === 'atacan'){
      // Encontronazo violento al entrar.
      const perdida = 40;
      descEl.textContent = zona.descripcionLlegada + '  No llegas a dar diez pasos. Te esperaban. Se te echan encima entre los callejones: golpes, un filo, manos que rebuscan en tus bolsillos. Logras zafarte y salir, pero te llevas lo tuyo.';
      if(typeof ajustarCreditos === 'function') ajustarCreditos(-perdida);
      if(typeof aplicarCondicion === 'function') aplicarCondicion('conmocion');
      if(typeof aplicarCambios === 'function') aplicarCambios({ humano:{ fatiga:10, aislamiento:8 } });
      _zonaBloqueada = true;
    }
  }

  document.getElementById('zona-llegada-desc').style.borderColor = zona.colorFaccion + '55';
  const opcsEl = document.getElementById('zona-opciones');
  // Acciones con recompensa ya hechas hoy: se ocultan del menú (más limpio
  // y deja más sitio). Vuelven a aparecer al cambiar de día de juego.
  const hoy = _diaDeJuegoActual();
  const hechasHoy = (Estado.memoria && Estado.memoria.accionesZonaHoy) || {};
  let html = '';
  for(let i = 0; i < zona.opciones.length; i++){
    const op = zona.opciones[i];
    if(hechasHoy[zona.id + ':' + op.accion] === hoy) continue; // ya hecha hoy
    const txtZona = op.txt.replace(/\{NOMBRE_ZONA\}/g, zona.nombreCorto || zona.nombre);
    // Si la facción no te ayuda / te ataca, solo dejamos salir (observar y volver).
    const esSalida = op.accion === 'volver_mapa_ciudad' || op.accion === 'observar';
    if(_zonaBloqueada && !esSalida){
      html += '<button class="opcion-btn" disabled style="opacity:0.4;cursor:not-allowed;">'+txtZona+' · CERRADO</button>';
    } else {
      html += '<button class="opcion-btn" onclick="accionZona(\''+op.accion+'\')">'+txtZona+'</button>';
    }
  }
  opcsEl.innerHTML = html;

  if(typeof cambiarEscena === 'function'){
    cambiarEscena('transito-libre-escena', 'zona-escena');
  } else {
    document.getElementById('transito-libre-escena').classList.remove('activa');
    document.getElementById('zona-escena').classList.add('activa');
  }
}


// ============================================================

// ============================================================
// BLOQUE JS-48 — ACCIONES DENTRO DE CADA ZONA
// Las opciones disponibles cuando llegas a una zona (hablar con
//   un contacto, comprar, observar, asistir a un sermón, etc.).
// ============================================================

// Devuelve el "día de juego" actual como texto (año-mes-día), para
// limitar acciones a una vez al día. Usa el reloj diegético del juego.
function _diaDeJuegoActual(){
  try {
    if(typeof obtenerFechaJuego === 'function'){
      const f = obtenerFechaJuego();
      return f.getFullYear() + '-' + (f.getMonth()+1) + '-' + f.getDate();
    }
  } catch(e){}
  return 'dia-unico';
}

function accionZona(accion){
  const zona = _zonaActual;
  if(!zona) return;

  // Volver a la plaza/centro de la zona actual (desde una acción).
  // Reaprovecha llegarAZona() que es quien pinta la plaza con el menú
  // de opciones de la zona. NO consume tiempo de juego ni avanza nada.
  if(accion === 'volver_mapa'){
    llegarAZona();
    return;
  }

  // Salir de la zona y volver al mapa de ciudad (desde la plaza).
  if(accion === 'volver_mapa_ciudad'){
    if(typeof cambiarEscena === 'function'){
      cambiarEscena('zona-escena', 'mapa-escena');
    } else {
      document.getElementById('zona-escena').classList.remove('activa');
      document.getElementById('mapa-escena').classList.add('activa');
    }
    renderizarMapa();
    return;
  }

  const narr = document.getElementById('zona-llegada-desc');
  const opcEl = document.getElementById('zona-opciones');

  // ── HOSPITAL PÚBLICO HELIX (v0.94) ──────────────────────────
  // Acciones con lógica propia (curar según heridas reales, revisión
  // según stats reales). Se resuelven aquí antes del mapa estático.
  if(accion === 'hospital_curar' || accion === 'hospital_revision' || accion === 'hospital_implantes'){
    _accionHospital(accion, zona, narr, opcEl);
    return;
  }

  const RESPUESTAS = {
    contacto_mano_roja: {
      narr: 'A Mano Roja la encuentras en un reservado del Teatro Sin Nombre, tras una cortina granate. El brazo derecho, mecánico hasta el hombro, descansa sobre la mesa cargado de anillos. No trafica con piezas: trafica con lo que la gente confiesa entre las sábanas. "¿Qué me traes? ¿Créditos o secretos? Porque sin una de las dos, esta cortina se cierra y tú no has estado nunca aquí."',
      rep: 5,
      faccion: 'loto',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    mercado_negro: {
      narr: 'Entre los puestos del barrio compras raciones y algo caliente. Saben a plástico y a perfume del local de al lado. El hambre afloja un poco.',
      cambios: { creditos: -25, humano: { hambre: -20 } },
      rep: 2, faccion: 'loto',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    observar: {
      narr: 'Te quedas en una esquina, bajo un farol rojo, mirando. El Arrabal Carmesí nunca duerme: tratos en los reservados, gente que entra sola y sale acompañada, deudas que cambian de mano. Ves cómo funciona esto por dentro. Y algo en tu cabeza lo archiva sin pedirte permiso.',
      cambios: { humano: { disociacion: 4, aislamiento: -3 } },
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_vael: {
      narr: 'Hermana Vael lleva una túnica blanca y tiene un ojo artificial con iris en espiral. Te recibe con calma perturbadora. "Bienvenido al umbral. Algunos cruzan estas puertas buscando un firmware espiritual. Otros, solo una pieza de recambio para el alma. ¿Cuál es tu protocolo hoy: fe o necesidad?"',
      rep: 5, faccion: 'eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    templo_interior: {
      narr: 'El interior del templo es oscuro y tranquilo. Hay gente meditando con partes mecánicas expuestas, cables visibles. El silencio aquí es diferente al silencio de tu apartamento. Más denso. Más lleno.',
      cambios: { humano: { disociacion: 7, fatiga: -4 } },
      rep: 3, faccion: 'eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    sermon: {
      narr: 'El líder del Culto habla durante veinte minutos sobre el umbral de la carne. Su voz tiene una cadencia que hace que escuchar sea fácil. Demasiado fácil. Cuando termina, no estás seguro de cuánto has asentido.',
      cambios: { humano: { disociacion: 10, aislamiento: -8 } },
      rep: 5, faccion: 'eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_ceroocho: {
      narr: 'Cero-Ocho es joven. Demasiado. Lleva tres pantallas en órbita craneal como un HUD heredado. "¿Qué bit me traes que no esté ya en mi caché? Porque si es ruido sin firmar, esto te va a costar ancho de banda del caro."',
      rep: 5, faccion: 'ia',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    tablon: {
      narr: 'El tablón digital tiene 47 entradas activas. La mayoría son rumores. Pero tres de ellas mencionan CERO en el asunto. Y tu corazón hace algo raro al leerlo.',
      cambios: { humano: { disociacion: 3 } },
      rep: 2, faccion: 'archivistas',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    vender_info: {
      narr: 'Le cuentas lo poco que sabes. Cero-Ocho lo escucha con cara de aburrimiento. Luego te transfiere 40 créditos. Esto lo sabía. Pero el gesto vale algo.',
      cambios: { creditos: 40, humano: { disociacion: 4 } },
      rep: 5, faccion: 'ia',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_vasek: {
      narr: 'Don Vasek lleva un traje. De lana de verdad, no celulosa reciclada. Tiene setenta años y la mirada serena de quien hace mucho que no necesita levantar la voz. "Tome asiento, por favor. En esta sala nunca ocurre nada desagradable, le doy mi palabra. Las cosas desagradables, cuando son necesarias, las gestiono yo en otra parte."',
      rep: 5, faccion: 'sindicatos',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    mercado_ferro: {
      narr: 'El mercado del Ferro tiene comida real. Cara, pero real. Comes de pie, mirando pasar a la gente. Por veinte minutos, nada te necesita.',
      cambios: { creditos: -35, humano: { hambre: -25, fatiga: -5 } },
      rep: 2, faccion: 'sindicatos',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    observar_ferro: {
      narr: 'Paseas sin rumbo por las calles del Ferro. Ves a un cobrador saludar a una anciana con un beso en la mejilla. Ves a tres hombres con trajes idénticos compartir un café en silencio. Ves a una niña jugar sola en una plaza limpia, sin miedo. Todo aquí funciona. Y nadie te explica por qué.',
      cambios: { humano: { disociacion: 3, aislamiento: -2, fatiga: -2 } },
      rep: 1, faccion: 'sindicatos',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_lira: {
      narr: 'La Dra. Lira Malk te recibe entre dos urgencias, con bata manchada y ojeras de tres turnos seguidos. No sonríe; no le queda tiempo para eso. "¿Vienes roto o vienes a que te diga que estás roto? Aquí hacemos las dos cosas." Habla rápido, sin rodeos, como quien ha aprendido que la compasión también se raciona. Bajo el cansancio, sin embargo, queda algo que HELIX no ha conseguido apagarle del todo: le sigue importando la gente.',
      rep: 5, faccion: 'helix',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver al {NOMBRE_ZONA}</button>'
    }
  };

  const r = RESPUESTAS[accion];
  const _nz = zona.nombreCorto || zona.nombre;
  if(!r){
    narr.innerHTML = '[CONTENIDO EN DESARROLLO]';
    opcEl.innerHTML = '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a '+_nz+'</button>';
    return;
  }

  // === REGISTRO DE JEFES COMO CONTACTOS ===
  // Al hablar por primera vez con el jefe de una zona, queda guardado en
  // CONTACTOS PERSONALES (igual que Mara). El conocerlo es permanente: se
  // marca aunque ya hubieras hablado hoy o la acción no diera recompensa.
  const JEFE_DE_ACCION = {
    contacto_mano_roja: 'mano_roja',
    contacto_vael: 'vael',
    contacto_ceroocho: 'cero_ocho',
    contacto_vasek: 'vasek'
  };
  if(JEFE_DE_ACCION[accion]){
    Estado.memoria = Estado.memoria || {};
    Estado.memoria.jefesConocidos = Estado.memoria.jefesConocidos || {};
    if(!Estado.memoria.jefesConocidos[JEFE_DE_ACCION[accion]]){
      Estado.memoria.jefesConocidos[JEFE_DE_ACCION[accion]] = true;
      if(typeof notificarCambio === 'function') notificarCambio('NUEVO CONTACTO', 'rep');
      if(typeof guardarPartida === 'function') guardarPartida();
    }
  }

  narr.innerHTML = r.narr;

  // Acciones con recompensa (créditos, estado o reputación) solo se pueden
  // hacer una vez por día de juego, igual que "mirar por la ventana".
  // Las acciones puramente narrativas o de salir no se limitan.
  const tieneRecompensa = !!(r.cambios || r.rep);
  if(tieneRecompensa){
    const hoy = _diaDeJuegoActual();
    Estado.memoria = Estado.memoria || {};
    Estado.memoria.accionesZonaHoy = Estado.memoria.accionesZonaHoy || {};
    const clave = zona.id + ':' + accion;
    if(Estado.memoria.accionesZonaHoy[clave] === hoy){
      // Ya hecha hoy: mostramos aviso y no aplicamos efectos otra vez.
      narr.innerHTML = 'Ya te has ocupado de esto hoy. Será mejor volver mañana; insistir ahora solo llamaría la atención.';
      opcEl.innerHTML = r.botones.replace(/\{NOMBRE_ZONA\}/g, _nz);
      return;
    }
    Estado.memoria.accionesZonaHoy[clave] = hoy;
  }

  if(r.cambios){
    const c = r.cambios;
    if(c.creditos){
      if(typeof ajustarCreditos === 'function'){
        ajustarCreditos(c.creditos);
      } else {
        Estado.creditos = Math.max(0, (Estado.creditos || 0) + c.creditos);
        if(typeof actualizarHUD === 'function') actualizarHUD();
      }
      if(typeof notificarCambio === 'function') notificarCambio((c.creditos >= 0 ? '+' : '') + c.creditos + ' CR', 'creditos');
    }
    if(c.humano){
      for(const k in c.humano){
        if(typeof ajustarHumano === 'function') ajustarHumano(k, c.humano[k]);
      }
    }
  }
  if(r.rep) cambiarRepZona(zona.id, r.rep);
  if(r.faccion && r.rep) cambiarRepFaccion(r.faccion, r.rep);
  opcEl.innerHTML = r.botones.replace(/\{NOMBRE_ZONA\}/g, _nz);

  if(typeof guardarPartida === 'function') guardarPartida();
}

// ============================================================
//  HOSPITAL PÚBLICO HELIX — acciones dinámicas (v0.94)
//  Curar heridas reales, revisión narrativa de estado, e implantes.
//  Dra. Lira Malk es la voz del centro.
// ============================================================
const HOSPITAL_TARIFA_CURA = { leve: 40, grave: 90, inutilizado: 160 };

function _accionHospital(accion, zona, narr, opcEl){
  const _nz = zona.nombreCorto || zona.nombre;
  const volver = '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver al ' + _nz + '</button>';

  // ── CURAR HERIDAS ──
  if(accion === 'hospital_curar'){
    const conds = (typeof Estado !== 'undefined' && Array.isArray(Estado.condiciones)) ? Estado.condiciones.slice() : [];
    if(conds.length === 0){
      narr.innerHTML = 'La Dra. Malk pasa un escáner por encima de ti sin demasiada ceremonia. "No tienes nada que tratar. Felicidades, eso aquí es casi un milagro." Te señala la salida con la barbilla. "Guarda el turno para quien sangre."';
      opcEl.innerHTML = volver;
      return;
    }
    // Calcular coste total según gravedad.
    let coste = 0;
    conds.forEach(c => { coste += (HOSPITAL_TARIFA_CURA[c.gravedad] || 60); });
    const creditos = (typeof Estado !== 'undefined' ? (Estado.creditos || 0) : 0);
    const lista = conds.map(c => c.nombre || c.id).join(', ');
    if(creditos < coste){
      narr.innerHTML = 'La Dra. Malk repasa tu historial. "Tienes esto pendiente: ' + lista + '. El sistema no trata gratis, ni siquiera el público; HELIX factura hasta el aire. Son ' + coste + ' créditos y no los llevas. Vuelve cuando puedas pagar… o cuando ya no puedas caminar. Lo que pase antes."';
      opcEl.innerHTML = volver;
      return;
    }
    // Cobrar y curar todo.
    if(typeof ajustarCreditos === 'function') ajustarCreditos(-coste);
    if(typeof notificarCambio === 'function') notificarCambio('-' + coste + ' CR', 'creditos');
    conds.forEach(c => { if(typeof quitarCondicion === 'function') quitarCondicion(c.id); });
    if(typeof cambiarRepFaccion === 'function') cambiarRepFaccion('helix', 2);
    narr.innerHTML = 'La Dra. Malk trabaja rápido, con manos que han hecho esto diez mil veces. Suturas, un sellador de piel, un par de inyecciones que escuecen más de lo que deberían. "Listo. Te he arreglado: ' + lista + '. No es bonito, pero aguantará." Antes de que te vayas, sin levantar la vista: "Intenta no volver tan pronto. No por mí. Por ti."';
    opcEl.innerHTML = volver;
    if(typeof guardarPartida === 'function') guardarPartida();
    return;
  }

  // ── REVISIÓN MÉDICA (resumen narrativo de stats) ──
  if(accion === 'hospital_revision'){
    const h = (typeof Estado !== 'undefined' && Estado.humano) ? Estado.humano : { fatiga:0, aislamiento:0, hambre:0, disociacion:0 };
    const linea = (val, bajo, medio, alto) => (val >= 66 ? alto : (val >= 33 ? medio : bajo));
    const fat = linea(h.fatiga||0,
      'Tu cuerpo responde dentro de lo normal.',
      'Arrastras un cansancio que el escáner marca en ámbar. "Duermes poco", afirma, no pregunta.',
      'El cansancio acumulado le hace fruncir el ceño. "Estás funcionando con reservas que ya no tienes."');
    const ham = linea(h.hambre||0,
      'Nutrición aceptable.',
      'Niveles bajos. "Comes mal. Como todos, pero tú peor."',
      'El indicador de nutrición está en rojo. "Si sigues así, el cuerpo empezará a comerse a sí mismo."');
    const ais = linea(h.aislamiento||0,
      'Sin marcadores de estrés social agudo.',
      'Hay señales de aislamiento. "Hablas con poca gente, ¿verdad? Se nota en el pulso."',
      'El aislamiento te pesa en las constantes. "La soledad también deja huella clínica. La tuya ya es visible."');
    const dis = linea(h.disociacion||0,
      'Actividad neural estable.',
      'El escáner detecta ruido en tu patrón cognitivo. "¿Lagunas? ¿Momentos que no recuerdas? Vigílalo."',
      'Tu lectura neural la inquieta. Baja la voz: "Esto que veo aquí… no se lo enseñes a HELIX. Te marcarían. Cuídate."');
    narr.innerHTML = 'La Dra. Malk te conecta a un terminal de diagnóstico que ha visto mejores décadas. Lee la pantalla en silencio unos segundos.<br><br>'
      + '· ' + fat + '<br>'
      + '· ' + ham + '<br>'
      + '· ' + ais + '<br>'
      + '· ' + dis + '<br><br>'
      + '"Eso es todo lo que la máquina quiere contarme. El resto", dice mirándote por fin, "tendrás que contártelo tú."';
    opcEl.innerHTML = volver;
    if(typeof cambiarRepFaccion === 'function') cambiarRepFaccion('helix', 1);
    if(typeof guardarPartida === 'function') guardarPartida();
    return;
  }

  // ── IMPLANTES BÁSICOS ──
  if(accion === 'hospital_implantes'){
    narr.innerHTML = 'La Dra. Malk señala una vitrina con módulos sellados al vacío. "Implantes básicos homologados por HELIX. Filtros hepáticos, reguladores de sueño, mallas dérmicas. Nada de lujos: cosas que te mantienen funcionando un año más." Hace una pausa. "El catálogo completo aún no está abierto al público en esta clínica. Vuelve pronto; lo estarán cargando en el sistema." Lo dice como si no se lo creyera del todo ella misma.';
    opcEl.innerHTML = volver;
    return;
  }
}
if(typeof window !== 'undefined'){ window._accionHospital = _accionHospital; }



// ============================================================
