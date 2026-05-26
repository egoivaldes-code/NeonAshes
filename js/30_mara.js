// ============================================================
// BLOQUE JS-36 — TRÁNSITO al bar (intro de Mara)
// Las 4 ubicaciones por las que pasa el jugador antes de llegar
//   al Bar Noir donde está Mara.
// ============================================================

// que no sea siempre la misma descripción en partidas distintas.
const ubicaciones=[
  {
    nombre:'CORREDOR B-7 — PILAS INFERIORES',
    desc:'Tubos de ventilación gotean líquido oxidado. Las luces de emergencia parpadean cada veinte segundos.',
    descs:[
      'Tubos de ventilación gotean líquido oxidado. Las luces de emergencia parpadean cada veinte segundos.',
      'Pasos amortiguados sobre rejillas metálicas. Alguien ha pintado un símbolo en la pared y luego ha intentado borrarlo.',
      'Olor a aceite quemado y comida vieja. Las puertas de las unidades llevan letras pintadas a mano sobre la oficial.',
      'Una rata gris cruza el pasillo sin prisa. Lleva algo en la boca que no quieres identificar.',
      'Un cartel de evacuación lleva pegado tanto tiempo que se ha vuelto parte de la pared.'
    ],
    bg:'PILAS', color:'#ff006e', img:'PASILLO', pos:'center'
  },
  {
    nombre:'ASCENSOR DE CARGA — PLATAFORMA 4',
    desc:'Subes entre cables expuestos. El ascensor rechina. Una cámara te sigue sin ojos humanos detrás.',
    descs:[
      'Subes entre cables expuestos. El ascensor rechina. Una cámara te sigue sin ojos humanos detrás.',
      'El indicador de planta salta del 6 al 9 sin pasar por el 7 y el 8. Decides no preguntarte por qué.',
      'Comparte cabina con dos cajas grises sin etiqueta. No vibran. No deberían no vibrar.',
      'El espejo del fondo está rajado en diagonal. Tu reflejo se parte por la mitad cada vez que el ascensor frena.',
      'Una voz pregrabada anuncia plantas que ya no existen. La ignoras como todo el mundo.'
    ],
    bg:'ASCENSOR', color:'#00e5ff', img:'SOUTH_ELEVATOR_LEVEL4', pos:'center 35%'
  },
  {
    nombre:'CALLE EXTERIOR — NIVEL 9 RAIN DISTRICT',
    desc:'La lluvia ácida pica en la piel. El smog huele a combustible y polímero quemado.',
    descs:[
      'La lluvia ácida pica en la piel. El smog huele a combustible y polímero quemado.',
      'Charcos de colores imposibles bajo los anuncios. Hay quien jura que predicen cosas.',
      'Una sirena pasa lejos. Otra responde más cerca. Sigues andando.',
      'Vendedores ambulantes recogen sus puestos con la lluvia cada vez más fuerte. Nadie te mira.',
      'Pasas por debajo de un anuncio de HELIX en bucle: «Refinancie su confianza.» Apresuras el paso.'
    ],
    bg:'CALLE', color:'#ff6b00', img:'MERCADO', pos:'center 20%'
  },
  {
    nombre:'BAR NOIR — EL ÚLTIMO TRAGO',
    desc:'Lo escuchas antes de verlo. Jazz industrial distorsionado. Conversaciones en susurros.',
    descs:[
      'Lo escuchas antes de verlo. Jazz industrial distorsionado. Conversaciones en susurros.',
      'La puerta no tiene cartel. Solo un panel táctil que sabe si te ha visto antes o no.',
      'Humo barato y luz baja. Dos mesas vacías por cada mesa con alguien.',
      'Un tipo en la barra te mira un segundo de más. Aparta la vista cuando no aparta la tuya.',
      'Detrás del mostrador, un cartel viejo: «No hablamos del Nivel 4.» Lo leen todos. Nadie lo respeta.'
    ],
    bg:'BAR', color:'#00e5ff', img:'BAR', pos:'center 30%'
  },
];
let idxUbic=0;
function irATransito(){
  // ANTI-BUCLE: si la primera misión ya está hecha (volvioApartamento o
  // completada), no debemos arrancar el tránsito al bar otra vez. Es la
  // puerta vieja desde el terminal; tras la misión, deja de tener sentido.
  const yaHecha = Estado.mision === 'volvioApartamento' || Estado.mision === 'completada';
  if(yaHecha){
    const btnT = document.getElementById('btn-terminal');
    if(btnT) btnT.style.display = 'none';
    cambiarEscena('terminal-escena','apartamento');
    return;
  }
  saltoDeEscena(); // +50 a +70 minutos
  cambiarEscena('terminal-escena','transito-escena');
  idxUbic=0;
  // Resetear bg con la primera imagen para evitar parpadeo
  const bg=document.getElementById('bg-transito');
  bg.style.opacity='1';
  setTimeout(mostrarSiguienteUbic,800);
}
async function mostrarSiguienteUbic(){
  if(idxUbic>=ubicaciones.length){irAMercado();return;}
  const ub=ubicaciones[idxUbic];
  const cont=document.getElementById('tarjetas-loc');
  const bg=document.getElementById('bg-transito');
  const ambBg=document.getElementById('ambiente-bg-txt');

  // Fade out del bg actual antes de cambiar imagen
  bg.style.opacity='0.3';
  await esperar(300);
  // Cambiar imagen de fondo según ubicación
  bg.style.backgroundImage=`url('${ASSETS[ub.img]}')`;
  bg.style.backgroundPosition=ub.pos||'center';
  ambBg.textContent=ub.bg;
  await esperar(50);
  bg.style.opacity='1';

  // Limpiar tarjetas anteriores
  cont.innerHTML='';

  // Crear tarjeta con estructura para typewriter
  const card=document.createElement('div');
  card.className='tarjeta-loc visible';
  card.innerHTML=`
    <div class="loc-nombre" style="color:${ub.color}" id="loc-nombre-tw"></div>
    <div class="loc-desc" id="loc-desc-tw"></div>
    <div id="loc-btn-wrap" style="opacity:0;transition:opacity 0.5s ease;"></div>
  `;
  cont.appendChild(card);

  // Escribir el nombre tipo máquina de escribir
  await typeWriter('loc-nombre-tw', ub.nombre, 35);
  await esperar(300);
  // Escribir la descripción. Si la ubicación tiene variantes ('descs'),
  // elegimos una al azar; si no, fallback a la desc base.
  const descIda = (ub.descs && ub.descs.length > 0) ? elegirAlAzar(ub.descs) : ub.desc;
  await typeWriter('loc-desc-tw', descIda, 22);
  await esperar(500);
  // Mostrar botón
  const wrap=document.getElementById('loc-btn-wrap');
  const esUltima=idxUbic>=ubicaciones.length-1;
  wrap.innerHTML=esUltima
    ? `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="irAMercado()">ENTRAR →</button>`
    : `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbic()">CONTINUAR →</button>`;
  wrap.style.opacity='1';
  idxUbic++;
}

// Función typewriter genérica
function typeWriter(elId, texto, velocidad){
  return new Promise(resolve=>{
    const el=document.getElementById(elId);
    if(!el){resolve();return;}
    el.innerHTML='';
    const cursor=document.createElement('span');
    cursor.className='tw-cursor';
    cursor.innerHTML='&nbsp;';
    el.appendChild(cursor);
    let i=0;
    const iv=setInterval(()=>{
      if(i>=texto.length){
        clearInterval(iv);
        // Quitar cursor al terminar
        setTimeout(()=>{if(cursor.parentNode)cursor.remove();},300);
        resolve();
        return;
      }
      const ch=texto[i];
      const node=document.createTextNode(ch);
      el.insertBefore(node, cursor);
      i++;
    }, velocidad);
  });
}
function avanzarUbic(){ intentarEventoAleatorio(()=>mostrarSiguienteUbic()); }
function irAMercado(){saltoDeEscena();cambiarEscena('transito-escena','mercado-escena');setTimeout(iniciarMercado,800);}
function iniciarMercado(){
  const c=document.getElementById('mara-card');
  setTimeout(()=>{c.style.opacity='1';c.style.transform='translateY(0)';},300);
  setTimeout(iniciarDialogoMara,1200);
}

const arbolDialogo=[
  /* 0 */ {mara:`No levantes la vista. Mira el té.`,opciones:[{txt:'¿Quién eres tú?',sig:1},{txt:'[Silencio. Obedeces.]',sig:2,s:true},{txt:'¿Cómo supiste dónde encontrarme?',sig:3}]},
  /* 1 */ {mara:`La gente que hace esa pregunta suele morir joven. Me llaman Mara. Eso es suficiente.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4},{txt:'¿Y si no me fío?',sig:5}]},
  /* 2 */ {mara:`Bien. La mayoría habla demasiado. Guárdalo así.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4},{txt:'¿Por qué este sitio?',sig:6}]},
  /* 3 */ {mara:`Sé más de lo que te gustaría. Helix Industries tiene un expediente tuyo. No sé por qué. Eso me preocupa.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4},{txt:'¿Helix? ¿Por qué yo?',sig:7}]},
  /* 4 */ {mara:`Hay un paquete en el Nivel 4. No preguntes qué contiene. Recógelo. Tráemelo. Treinta créditos de stack.`,opciones:[{txt:'Acepto.',sig:8},{txt:'Necesito más información.',sig:9},{txt:'[Silencio. Piensas.]',sig:10,s:true}]},
  /* 5 */ {mara:`No pedí que te fiases. Pedí que escucharas.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4}]},
  /* 6 */ {mara:`El Bar lleva años aquí. La policía corporativa no entra porque alguien paga para que no entren.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4}]},
  /* 7 */ {mara:`Esa es la pregunta correcta. Y es exactamente lo que necesito que descubras.`,opciones:[{txt:'¿Qué quieres de mí?',sig:4}]},
  /* 8 — Acepto */ {mara:`Bien. Mañana al amanecer recibirás coordenadas. No me decepciones.`,opciones:[{txt:'No lo haré.',sig:12}]},
  /* 9 — Necesito más info (IA) */ {mara:null,esIA:true,opciones:[]},
  /* 10 — Silencio piensas */ {mara:`El silencio también es una respuesta. El paquete estará ahí hasta el amanecer.`,opciones:[{txt:'Acepto.',sig:8},{txt:'No.',sig:11}]},
  /* 11 — No, peligroso */ {mara:`Entonces vuelve a tu apartamento. Vive con tus dudas. Quizás eso también es una elección.`,opciones:[{txt:'Me voy.',sig:13}]},
  /* 12 — cierre tras aceptar */ {mara:`Entonces ya nos hemos entendido. Ahora vete. Y no me sigas con la mirada.`,esFinDialogo:true,opciones:[]},
  /* 13 — cierre tras rechazar */ {mara:`Suerte, entonces. La vas a necesitar.`,esFinDialogo:true,opciones:[]},
];


// ============================================================

// ============================================================
// BLOQUE JS-37 — MARA — árbol de diálogo + nodo IA
// El diálogo con Mara Vex. Tiene 14 nodos predefinidos y uno
//   especial donde Claude (la IA) responde en vivo.
// ============================================================

// ============================================================
// VARIANTES DE DIÁLOGO SEGÚN MEMORIA — "MARA TE PERCIBE"
// ============================================================
// Para algunos nodos del árbol de diálogo, definimos varias formas
// en que Mara puede decir lo mismo. La que se elija depende de cómo
// el jugador se ha comportado hasta ese momento (libreta de memoria).
//
// Cada variante tiene una función "cuando(m)" que devuelve true si
// la libreta encaja. Se evalúan en orden y se usa la PRIMERA que encaje.
// Si ninguna encaja, se usa la línea original del árbol — nada se rompe.
const variantesDialogo = {
  // Nodo 5 — "No pedí que te fiases."
  // Si el jugador viene del silencio, ella suaviza el reproche.
  // Si viene preguntando mucho, lo acentúa.
  5: [
    { cuando: m => m.guardoSilencio,
      texto: `No pedí que te fiases. Pedí que escucharas. Y eso lo haces bien.` },
    { cuando: m => m.vecesPidioInfo >= 2,
      texto: `No pedí que te fiases. Pedí que escucharas. Llevas un rato haciendo lo contrario.` }
  ],

  // Nodo 8 — "Bien. Mañana al amanecer recibirás coordenadas."
  // Tres tonos posibles al cerrar el trato.
  8: [
    { cuando: m => m.confianzaMara >= 2 && !m.pidioMasInfo,
      texto: `Bien. No has perdido tiempo. Mañana al amanecer recibirás coordenadas.` },
    { cuando: m => m.pidioMasInfo || m.vecesPidioInfo >= 2,
      texto: `Bien. Has preguntado mucho antes de decidir. Eso, a veces, es virtud. Mañana al amanecer recibirás coordenadas. No me decepciones.` },
    { cuando: m => m.guardoSilencio,
      texto: `Bien. Hablas poco. Eso me sirve. Mañana al amanecer recibirás coordenadas.` }
  ],

  // Nodo 10 — silencio antes de decidir
  10: [
    { cuando: m => m.vecesPidioInfo >= 2,
      texto: `Ya, ya. Has preguntado bastante. Ahora callas. El paquete estará ahí hasta el amanecer.` }
  ],

  // Nodo 11 — el jugador rechaza
  11: [
    { cuando: m => m.vecesPidioInfo >= 2,
      texto: `Al menos lo has pensado. Vuelve a tu apartamento. Vive con tus dudas. Quizás eso también es una elección.` },
    { cuando: m => m.guardoSilencio,
      texto: `Has callado y ahora niegas. Hay gente que tarda años en aprender eso. Vuelve a tu apartamento.` }
  ],

  // Nodo 12 — cierre tras aceptar
  12: [
    { cuando: m => m.confianzaMara >= 2,
      texto: `Entonces ya nos hemos entendido. Vete. Y no te gires.` },
    { cuando: m => m.vecesPidioInfo >= 2,
      texto: `Entonces ya nos hemos entendido. Casi. Vete. Y deja de preguntar por hoy.` }
  ],

  // Nodo 13 — cierre tras rechazar
  13: [
    { cuando: m => m.vecesPidioInfo >= 2,
      texto: `Suerte, entonces. Al menos te has tomado el tiempo de pensarlo.` },
    { cuando: m => m.guardoSilencio,
      texto: `Suerte. El silencio te va. No siempre te va a salvar.` }
  ]
};

// Devuelve la línea de Mara para un nodo, eligiendo variante si encaja.
function textoMaraParaNodo(idx, nodo){
  const variantes = variantesDialogo[idx];
  if(variantes && Estado.memoria){
    for(const v of variantes){
      if(v.cuando(Estado.memoria)) return v.texto;
    }
  }
  return nodo.mara; // línea original como fallback
}

function iniciarDialogoMara(){mostrarNodoDialogo(0);}
async function mostrarNodoDialogo(idx){
  const nodo=arbolDialogo[idx],zona=document.getElementById('zona-dialogo'),zonaOpc=document.getElementById('mercado-opciones');
  zonaOpc.innerHTML='';
  if(nodo.esIA){await respuestaIA();return;}
  // Elegimos la frase según la memoria. Si no hay variante, usa la original.
  const textoMara = textoMaraParaNodo(idx, nodo);
  if(textoMara) await agregarBurbuja('MARA VEX',textoMara,false);
  if(nodo.esFinDialogo){
    // Si el jugador aceptó el encargo, NO vamos al final aún.
    // Pasamos por una versión rápida del eco (apartamento) que
    // sirve de transición: ahí abrirá el terminal y verá el mensaje.
    if(Estado.memoria && Estado.memoria.aceptoEncargo === true){
      setTimeout(irAEcoTrasAceptar, 1200);
    } else {
      setTimeout(mostrarCero, 800);
    }
    return;
  }
  setTimeout(()=>mostrarOpciones(nodo.opciones,zona,zonaOpc),600);
}

// Tras aceptar el encargo: vamos al apartamento, pero ANTES atravesamos
// las 3 zonas en sentido inverso (calle exterior → ascensor → corredor B-7).
// Así el mundo se siente físico: hay que volver andando, igual que se vino.
// El antiguo "teleport directo" se llamaba irAEcoTrasAceptar; ahora esa

// ============================================================

// ============================================================
// BLOQUE JS-38 — VUELTA al apartamento tras ACEPTAR el encargo
// Las ubicaciones del camino de regreso si decides aceptar.
// ============================================================

// función simplemente arranca el viaje de vuelta tras aceptar.
const ubicacionesVueltaTrasAceptar = [
  {
    nombre: 'CALLEJÓN TRASERO — SALIDA DEL BAR NOIR',
    desc: 'Mara te acompaña hasta la puerta trasera. El aire frío y el olor a lluvia ácida te golpean. Ella se detiene bajo el neón de SERVICE ACCESS, enciende un cigarrillo que probablemente no debería estar fumando.',
    descs: [
      'Mara te acompaña hasta la puerta trasera. El aire frío y el olor a lluvia ácida te golpean. Ella se detiene bajo el neón de SERVICE ACCESS, enciende un cigarrillo que probablemente no debería estar fumando.',
      'El callejón está vacío salvo por vosotros dos. Mara mira hacia el otro extremo, donde brilla un anuncio en mandarín. «No me sigas en cinco minutos», dice sin mirarte.',
      'La puerta del bar se cierra y el ruido del jazz se corta de golpe. Solo queda la lluvia. Mara busca algo en el bolsillo, lo mira, vuelve a guardarlo.',
      'Mara se apoya contra la pared sucia. La luz violeta del cartel CONVENIENCE STORE le pinta media cara. La otra mitad queda en sombra. «Si lo logras, no me llames. Te llamaré yo. Si no lo logras, ya da igual.»',
      'Camináis hasta el callejón en silencio. Un cartel de NO SURVEILLANCE parpadea sobre vosotros. Ella sonríe con la mitad de la boca. «Mentira, claro. Pero ayuda dormir pensándolo.»'
    ],
    extraAlta: 'Antes de irte, te toca el brazo un segundo. No mucho. Lo justo. Ya es más de lo que esperabas.',
    extraBaja: 'No te mira al despedirse. Se da la vuelta y empieza a caminar. No te dice si volverás a verla.',
    bg: 'CALLEJÓN', color: '#ff006e', img: 'MARA_ALLEY_CLEAN', pos: 'center 45%'
  },
  {
    nombre: 'CALLE EXTERIOR — NIVEL 9 RAIN DISTRICT',
    desc: 'Sales del bar. El aire frío te golpea. La lluvia ácida sigue cayendo, más fina ahora. La calle está casi vacía.',
    descs: [
      'Sales del bar. El aire frío te golpea. La lluvia ácida sigue cayendo, más fina ahora. La calle está casi vacía.',
      'La música del Bar Noir se apaga en cuanto cierra la puerta a tu espalda. La calle es otro mundo.',
      'Faroles parpadeantes. Tu sombra se estira larga sobre el asfalto mojado.',
      'Un puesto de fideos sigue abierto a destiempo. El vapor se mezcla con la niebla.',
      'Pasos lejanos en el callejón paralelo. No miras. No quieres saber.'
    ],
    bg: 'CALLE', color: '#ff6b00', img: 'MERCADO', pos: 'center 20%'
  },
  {
    nombre: 'ASCENSOR DE CARGA — PLATAFORMA 4',
    desc: 'Bajas en silencio. El ascensor rechina más fuerte de noche. Piensas en lo que acabas de aceptar.',
    descs: [
      'Bajas en silencio. El ascensor rechina más fuerte de noche. Piensas en lo que acabas de aceptar.',
      'El espejo del fondo refleja una versión tuya con una expresión que no recuerdas haber puesto.',
      'Comparte cabina contigo un viejo con un saco. Ninguno habla. Es lo normal.',
      'El número de planta salta. Te bajas sin verificar dónde. Sabes el camino.',
      'Una luz de servicio parpadea naranja, como si supiera algo.'
    ],
    bg: 'ASCENSOR', color: '#00e5ff', img: 'SOUTH_ELEVATOR_LEVEL4', pos: 'center 35%'
  },
  {
    nombre: 'CORREDOR B-7 — PILAS INFERIORES',
    desc: 'Las luces de emergencia parpadean igual que cuando saliste. Tu puerta está al fondo. Has tardado más de lo que pensabas.',
    descs: [
      'Las luces de emergencia parpadean igual que cuando saliste. Tu puerta está al fondo. Has tardado más de lo que pensabas.',
      'El pasillo huele exactamente igual que cuando saliste. Eso debería tranquilizarte. No lo hace.',
      'Una puerta a tu izquierda se cierra justo antes de que llegues. No miras quién.',
      'Tu llave magnética tarda dos intentos en reconocerte. Como si dudara.',
      'Pasos detrás de ti. Te giras. No hay nadie. Sigues andando.'
    ],
    bg: 'PILAS', color: '#ff006e', img: 'PASILLO', pos: 'center'
  }
];

let idxUbicVueltaAceptar = 0;

function irAEcoTrasAceptar(){
  saltoDeEscena(); // duermes un poco, amanece, te despiertas
  ajustarHumano('fatiga', -5); // descanso breve antes de la misión
  // Arrancamos el viaje de vuelta. Reutilizamos la escena de tránsito
  // de la ida (transito-escena), que ya tiene el mismo HTML y estilos.
  idxUbicVueltaAceptar = 0;
  cambiarEscena('mercado-escena', 'transito-escena');
  const bg = document.getElementById('bg-transito');
  if(bg) bg.style.opacity = '1';
  setTimeout(mostrarSiguienteUbicVueltaAceptar, 800);
}

async function mostrarSiguienteUbicVueltaAceptar(){
  if(idxUbicVueltaAceptar >= ubicacionesVueltaTrasAceptar.length){
    // Llegamos al apartamento.
    cambiarEscena('transito-escena', 'apartamento');
    setTimeout(pintarApartamentoTrasAceptar, 700);
    return;
  }
  const ub = ubicacionesVueltaTrasAceptar[idxUbicVueltaAceptar];
  const cont = document.getElementById('tarjetas-loc');
  const bg = document.getElementById('bg-transito');
  const ambBg = document.getElementById('ambiente-bg-txt');

  bg.style.opacity = '0.3';
  await esperar(300);
  bg.style.backgroundImage = `url('${ASSETS[ub.img]}')`;
  bg.style.backgroundPosition = ub.pos || 'center';
  ambBg.textContent = ub.bg;
  await esperar(50);
  bg.style.opacity = '1';

  cont.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'tarjeta-loc visible';
  card.innerHTML = `
    <div class="loc-nombre" style="color:${ub.color}" id="loc-nombre-tw"></div>
    <div class="loc-desc" id="loc-desc-tw"></div>
    <div id="loc-btn-wrap" style="opacity:0;transition:opacity 0.5s ease;"></div>
  `;
  cont.appendChild(card);
  await typeWriter('loc-nombre-tw', ub.nombre, 35);
  await esperar(300);
  const descVueltaAceptar = (ub.descs && ub.descs.length > 0) ? elegirAlAzar(ub.descs) : ub.desc;
  await typeWriter('loc-desc-tw', descVueltaAceptar, 22);
  await esperar(500);
  const wrap = document.getElementById('loc-btn-wrap');
  const esUltima = idxUbicVueltaAceptar >= ubicacionesVueltaTrasAceptar.length - 1;
  wrap.innerHTML = esUltima
    ? `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicVueltaAceptar()">ENTRAR EN CASA →</button>`
    : `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicVueltaAceptar()">CONTINUAR →</button>`;
  wrap.style.opacity = '1';
  idxUbicVueltaAceptar++;
}

function avanzarUbicVueltaAceptar(){
  if(typeof intentarEventoAleatorio === 'function'){
    intentarEventoAleatorio(()=>mostrarSiguienteUbicVueltaAceptar());
  } else {
    mostrarSiguienteUbicVueltaAceptar();
  }
}

// Pinta el apartamento en estado "antes del amanecer, encargo aceptado":
// el jugador ha vuelto a casa, ha dormido poco, el encargo le espera.
// Desde aquí puede ir a TRABAJOS y pulsar "Salir al objetivo".
function pintarApartamentoTrasAceptar(){
  const narr = document.getElementById('narr-apt');
  const opc = document.getElementById('opciones-apt');
  const fechaApt = document.querySelector('.fecha-apt');
  const relojApt = document.getElementById('reloj-apt');
  if(fechaApt) fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS';
  if(relojApt) relojApt.textContent = '05:50';
  if(narr){
    narr.innerHTML = `Has vuelto al apartamento.<br>Has dormido poco. O nada.<br>El terminal parpadea. Algo te espera. Y el encargo de Mara, también.`;
  }
  if(opc){
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Intentar dormir un poco más</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Abrir el terminal</button>`;
  }
  // Marcar trabajos con badge para que el jugador note dónde ir.
  if(typeof marcarTrabajosActualizado === 'function'){
    marcarTrabajosActualizado();
  }
}

// (Legacy) Pinta el eco con un texto diferente al del final: aquí el jugador
// "duerme" y se despierta para la misión. Botón para ir al terminal.
// Mantenida por compatibilidad; ya no se llama desde el flujo normal.
function pintarEcoTrasAceptar(){
  const ambient = document.getElementById('eco-ambient-txt');
  const hora = document.getElementById('eco-hora-txt');
  const prologo = document.getElementById('eco-prologo-txt');
  const term = document.getElementById('eco-terminal');
  const acciones = document.getElementById('eco-acciones');
  if(ambient) ambient.textContent = 'APARTAMENTO 19-A // ANTES DEL AMANECER';
  if(hora) hora.textContent = '05:50 AM — LLUVIA ÁCIDA';
  if(prologo){
    prologo.innerHTML = `Has vuelto al apartamento.<br>Has dormido poco. O nada.<br>El terminal parpadea. Algo te espera.`;
    prologo.classList.add('visible');
  }
  // Ocultamos el terminal "de mensaje único" del eco y reemplazamos
  // las acciones por un solo botón para ir al terminal real.
  if(term) term.style.display = 'none';
  if(acciones){
    acciones.innerHTML = `<button class="eco-btn" onclick="irATerminalDesdeEco()">ABRIR TERMINAL →</button>`;
    setTimeout(()=>{ acciones.classList.add('visible'); }, 800);
  }
}

// El jugador pulsa "abrir terminal" desde el eco tras aceptar.
// Mantenemos los mensajes pendientes (entre ellos el misionMara).
function irATerminalDesdeEco(){
  cambiarEscena('eco-escena', 'terminal-escena');
  setTimeout(escribirTerminal, 700);
}


// ============================================================