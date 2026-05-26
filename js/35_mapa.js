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
  const d = cargarEstadoZonas();
  return (d[id] && typeof d[id].rep === 'number') ? d[id].rep : 0;
}
function cambiarRepZona(id, delta){
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
    faccion: 'BANDA CRIMINAL — LOS ÓXIDOS',
    colorFaccion: '#ff006e',
    desc: 'Un laberinto de metal oxidado y neón roto. Los Óxidos controlan cada esquina. Huele a aceite quemado y algo peor. Nadie hace preguntas. Nadie quiere respuestas.',
    peligro: '⚠ PELIGRO EXTREMO · PATRULLAS ARMADAS · VIOLENCIA FRECUENTE',
    posX: 80, posY: 160,
    imgBg: 'MERCADO',
    eventos: [
      { titulo:'CONTROL DE LOS ÓXIDOS', narr:'Tres hombres con brazos augmentados bloquean el paso. El mayor lleva una mandíbula de titanio. Te miran como si ya supieran cuánto vales.',
        opciones:[
          { txt:'Pagar peaje (-30 CR)', cambios:{creditos:-30}, msg:'La mandíbula de titanio asiente. Te dejan pasar sin tocarte. Por ahora.' },
          { txt:'Mantener el paso, mirada al suelo', cambios:{humano:{fatiga:3,aislamiento:2}}, msg:'Te dejan pasar. Uno escupe cerca de tus pies. No te giras.' },
          { txt:'Sacar el nombre de Mara Vex', cambios:{humano:{disociacion:2}}, msg:'Una pausa. Se miran entre ellos. Te dejan pasar más rápido de lo esperado. Eso también da miedo.' }
        ]
      },
      { titulo:'CADÁVER EN EL CALLEJÓN', narr:'Un hombre tirado contra la pared. Joven. Augmentaciones baratas. Tiene un agujero quemado donde estaba el ojo derecho. Nadie se para.',
        opciones:[
          { txt:'Seguir andando', cambios:{humano:{disociacion:4}}, msg:'Te preguntas cuánto tiempo llevas siendo capaz de hacer esto. No tienes respuesta.' },
          { txt:'Revisar si aún respira', cambios:{humano:{fatiga:2,aislamiento:-4}}, msg:'No respira. Pero encuentras 12 créditos en el bolsillo roto. Y odias haberte dado cuenta.' },
          { txt:'Llamar a emergencias HELIX (anónimo)', cambios:{reputacion:-2,humano:{aislamiento:-2}}, msg:'La llamada dura tres segundos. Zona B. Patrulla en 40 minutos. Cuarenta minutos.' }
        ]
      },
      { titulo:'NIÑO VENDIENDO CHIPS DE DATOS', narr:'Diez años como mucho. Vende chips de datos sin carcasa desde una caja de cartón. Te mira con unos ojos que ya vieron demasiado.',
        opciones:[
          { txt:'Comprar un chip (-20 CR)', cambios:{creditos:-20,humano:{aislamiento:-3}}, msg:'El chip está vacío. Pero el niño te mira como si acabaras de hacer algo importante.' },
          { txt:'Darle créditos sin coger nada (-15 CR)', cambios:{creditos:-15,humano:{aislamiento:-5}}, msg:'Se queda mirando los créditos. No dice gracias. Pero los guarda rápido, antes de que alguien lo vea.' },
          { txt:'Seguir sin mirarle', cambios:{humano:{aislamiento:4,disociacion:2}}, msg:'Tres pasos después no puedes recordar su cara. Eso es lo peor.' }
        ]
      }
    ],
    descripcionLlegada: 'El Arrabal Carmesí huele a circuitos quemados y mugre húmeda. Las paredes sudan. Alguien te observa desde el primer segundo. Los Óxidos llevan este sector desde antes de que nacieras.',
    opciones: [
      { txt:'Buscar a Mano Roja (augmentaciones)', accion:'contacto_mano_roja' },
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
    imgBg: 'SURGICAL_SUITE',
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
    imgBg: 'MARA_ALLEY_CLEAN',
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
    imgBg: 'DOCK_ACCESS_TUNNEL',
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
  // Actualiza la etiqueta de reputación de cada marcador anclado
  // sobre el mapa Strata I. Los marcadores ya están en el HTML;
  // aquí solo refrescamos el texto de REP y la clase visual.
  ZONAS_MUNDO.forEach(zona => {
    const marker = document.querySelector('.zona-marker[data-zona="'+zona.id+'"]');
    if(!marker) return;
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
  document.getElementById('zd-desc').textContent = zona.desc;
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
  renderizarMapa();
  const sub = document.getElementById('mapa-subtitulo');
  if(sub && Estado.jugador) sub.textContent = Estado.jugador.nombre + ' · ELIGE UN DESTINO';
}

function volverApartamentoDesMapa(){
  cerrarDetalleZona();
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

function generarParadasViaje(zona){
  const rep = getRepZona(zona.id);
  let descLlegada;
  if(rep < -20) descLlegada = 'Llegas con deudas aquí. El ambiente lo percibe antes de que lo hagas tú.';
  else if(rep > 20) descLlegada = 'Te conocen aquí. O al menos, conocen tu reputación. Eso puede ser bueno.';
  else descLlegada = 'El sector cambia de tono a medida que te acercas. Diferente tipo de ruido. Diferente tipo de mirada.';

  return [
    { nombre:'SALIENDO DE UNIDAD 273-19A', desc:'El corredor del edificio. Dieciséis puertas cerradas. Ningún vecino visible. El ascensor tarda cuatro minutos en bajar.', color:'#00e5ff', img:'PASILLO' },
    { nombre:'TRÁNSITO NIVEL 9 — LÍNEA VERTICAL', desc:'El tren vertical huele a gente mojada y aceite. Una pantalla HELIX parpadea: RECUERDA. TU SEGURIDAD ES NUESTRA PRIORIDAD.', color:'rgba(200,216,224,0.5)', img:'TREN' },
    { nombre:'APROXIMACIÓN A ' + zona.nombreCorto, desc:descLlegada, color:zona.colorFaccion, img:zona.imgBg }
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
  if(c.humano){
    for(const k in c.humano){
      if(typeof ajustarHumano === 'function') ajustarHumano(k, c.humano[k]);
    }
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

  const opcsEl = document.getElementById('zona-opciones');
  let html = '';
  for(let i = 0; i < zona.opciones.length; i++){
    const op = zona.opciones[i];
    const txtZona = op.txt.replace(/\{NOMBRE_ZONA\}/g, zona.nombreCorto || zona.nombre);
    html += '<button class="opcion-btn" onclick="accionZona(\''+op.accion+'\')">'+txtZona+'</button>';
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

  const RESPUESTAS = {
    contacto_mano_roja: {
      narr: 'Mano Roja opera desde el fondo de una tienda de repuestos. Un tío con el brazo derecho completamente mecánico, hasta el puto hombro. Te mira sin sorpresa. "¿Qué traes, hostia? ¿Pasta o cotilleos? Porque sin una de las dos cosas, ya estás saliendo por donde has entrado."',
      rep: 5,
      faccion: 'sindicatos',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    mercado_negro: {
      narr: 'Compras raciones de fábrica. Saben a plástico y proteína sintética. El hambre afloja un poco.',
      cambios: { creditos: -25, humano: { hambre: -20 } },
      rep: 2, faccion: 'sindicatos',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    observar: {
      narr: 'Te quedas en una esquina, mirando. El Arrabal Carmesí nunca para. Peleas, negocios, fugas, reuniones. Ves cómo funciona esto por dentro. Y algo en tu cabeza lo archiva sin pedirte permiso.',
      cambios: { humano: { disociacion: 4, aislamiento: -3 } },
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_vael: {
      narr: 'Hermana Vael lleva una túnica blanca y tiene un ojo artificial con iris en espiral. Te recibe con calma perturbadora. "Bienvenido al umbral. Algunos cruzan estas puertas buscando un firmware espiritual. Otros, solo una pieza de recambio para el alma. ¿Cuál es tu protocolo hoy: fe o necesidad?"',
      rep: 5, faccion: 'iglesia_eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    templo_interior: {
      narr: 'El interior del templo es oscuro y tranquilo. Hay gente meditando con partes mecánicas expuestas, cables visibles. El silencio aquí es diferente al silencio de tu apartamento. Más denso. Más lleno.',
      cambios: { humano: { disociacion: 7, fatiga: -4 } },
      rep: 3, faccion: 'iglesia_eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    sermon: {
      narr: 'El líder del Culto habla durante veinte minutos sobre el umbral de la carne. Su voz tiene una cadencia que hace que escuchar sea fácil. Demasiado fácil. Cuando termina, no estás seguro de cuánto has asentido.',
      cambios: { humano: { disociacion: 10, aislamiento: -8 } },
      rep: 5, faccion: 'iglesia_eco',
      botones: '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a {NOMBRE_ZONA}</button>'
    },
    contacto_ceroocho: {
      narr: 'Cero-Ocho es joven. Demasiado. Lleva tres pantallas en órbita craneal como un HUD heredado. "¿Qué bit me traes que no esté ya en mi caché? Porque si es ruido sin firmar, esto te va a costar ancho de banda del caro."',
      rep: 5, faccion: 'ia_autonomas',
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
      rep: 5, faccion: 'ia_autonomas',
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
    }
  };

  const r = RESPUESTAS[accion];
  const _nz = zona.nombreCorto || zona.nombre;
  if(!r){
    narr.innerHTML = '[CONTENIDO EN DESARROLLO]';
    opcEl.innerHTML = '<button class="opcion-btn" onclick="accionZona(\'volver_mapa\')">← Volver a '+_nz+'</button>';
    return;
  }

  narr.innerHTML = r.narr;
  if(r.cambios){
    const c = r.cambios;
    if(c.creditos){
      Estado.creditos = Math.max(0, (Estado.creditos || 0) + c.creditos);
      if(typeof actualizarHUD === 'function') actualizarHUD();
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
