// ============================================================
// BLOQUE JS-33 — MISIÓN — TRÁNSITO al Nivel 4
// Camino hacia el casillero, ubicación por ubicación.
// ============================================================

// ============================================================
// MISIÓN MARA — CAPA 1: lógica de las escenas
// ============================================================
// Flujo:
//   salirHaciaNivel4()    → inicia el tránsito a Nivel 4
//   mision-transito       → 3 ubicaciones con eventos posibles
//   mision-casillero      → decisión: cerrado / abrir / robar
//   mision-contenido      → si abriste, ves el contenido
//   volverDelCasillero()  → vuelves al bar (o no, si robaste)
//   mision-entrega        → cierre con Mara según lo que hiciste
//   cerrarMision()        → final del Fragmento I
//
// Los textos están aquí para fácil edición narrativa.
// ============================================================

// 3 ubicaciones de bajada al Nivel 4. Mismas reglas que el tránsito
// del Bar Noir: nombre, descripción, imagen de fondo, color tema.
// ============================================================
// MISIÓN MARA — CAPA 2: helpers de variantes
// ============================================================
// Devuelven el "estado" de la misión según las decisiones previas
// del jugador. Se usan para elegir qué texto mostrar y cuánto pagar.
//
//   nivelConfianzaMara() → 'alta' | 'neutra' | 'baja'
//   pidioInfoMara()      → true | false
//
// Umbrales: alta ≥ 2, baja ≤ -2, neutra el resto.
// ============================================================
function nivelConfianzaMara(){
  const c = (Estado.memoria && Estado.memoria.confianzaMara) || 0;
  if(c >= 2) return 'alta';
  if(c <= -2) return 'baja';
  return 'neutra';
}
function pidioInfoMara(){
  return !!(Estado.memoria && Estado.memoria.pidioMasInfo);
}

const ubicacionesMision = [
  {
    nombre: 'CONDUCTO DE SERVICIO — RAMPA E',
    desc: 'Bajas por un tubo de mantenimiento. El aire se enrarece. Cada veinte metros, una luz de emergencia. Cada cien, una cámara muerta. Probablemente muerta.',
    descs: [
      'Bajas por un tubo de mantenimiento. El aire se enrarece. Cada veinte metros, una luz de emergencia. Cada cien, una cámara muerta. Probablemente muerta.',
      'La rampa baja en espiral. Cada vuelta el aire pesa más y el rumor de la ciudad se aleja.',
      'Los escalones metálicos están cubiertos de aceite seco. Pisas con cuidado. Pisar dos veces el mismo escalón da vértigo.',
      'Un cartel viejo: «NIVEL 4 — ACCESO RESTRINGIDO». Alguien ha tachado «restringido» y ha escrito «innecesario».',
      'A lo lejos suena un eco que parece pasos. Te paras. Los pasos se paran también.'
    ],
    extraAlta: 'Mara conoce esta ruta. Lo ves en cómo está despejada.',
    extraBaja: 'Una rata muerta en una esquina. Demasiado fresca. Como si te hubieran abierto camino sin querer hacerlo.',
    bg: 'CONDUCTO', color: '#ff6b00', img: 'SERVICE_CONDUIT_RAMP_E', pos: 'center 40%'
  },
  {
    nombre: 'PUESTO DE CONTROL — PASO 12B',
    desc: 'Un torno automatizado. Te pide identificación. No hay nadie detrás del cristal. La voz robótica dice tu nombre antes de que termines de teclear.',
    descs: [
      'Un torno automatizado. Te pide identificación. No hay nadie detrás del cristal. La voz robótica dice tu nombre antes de que termines de teclear.',
      'La garita lleva el cristal manchado de algo oscuro. Por dentro o por fuera, no sabes.',
      'El lector de iris hace tres intentos. Al cuarto, simplemente cede. Como si no quisiera saber.',
      'Cuatro torniquetes. Solo uno funciona. Es siempre el del medio. La gente lo sabe.',
      'Un cartel parpadea: «ZONA VIGILADA». Debajo, alguien ha pegado un sticker: «no lo está.»'
    ],
    extraAlta: 'El torno se abre antes de que pulses confirmar. Alguien lo ha aflojado.',
    extraBaja: 'Te escanea dos veces. Ningún ser humano lo decidió. Quizás.',
    bg: 'PASO 12B', color: '#ff006e', img: 'MAINTENANCE_ACCESS12', pos: 'center'
  },
  {
    nombre: 'NIVEL 4 — CORREDOR OESTE',
    desc: 'Más vacío de lo que esperabas. Solo gotea agua de algún tubo. Las puertas de los casilleros se extienden a tu izquierda. Cuentas: 214, 216, 218.',
    descs: [
      'Más vacío de lo que esperabas. Solo gotea agua de algún tubo. Las puertas de los casilleros se extienden a tu izquierda. Cuentas: 214, 216, 218.',
      'El corredor huele a metal frío. Tres bombillas funcionan. Las demás están reventadas a propósito.',
      'Casilleros oxidados. Algunos forzados. La mayoría intactos. La diferencia entre los unos y los otros no es obvia.',
      'Hay una marca de tiza en el suelo, frente al 218. Una flecha pequeña. Apunta a ti.',
      'El silencio es tan denso que oyes tu propia respiración. Te molesta.'
    ],
    extraAlta: '',
    extraBaja: 'Una sombra al fondo te mira un segundo. Después no está. Quizás nunca estuvo.',
    bg: 'NIVEL 4', color: '#00e5ff', img: 'WEST_CORRIDOR_LOCKER218', pos: 'center'
  }
];

let idxUbicMision = 0;

// Llamada desde el botón del mensaje cifrado en el terminal.
function salirHaciaNivel4(){
  // ANTI-BUCLE: si la misión ya está hecha o en curso, no rearrancar.
  if(Estado.mision === 'volvioApartamento' || Estado.mision === 'completada' ||
     Estado.mision === 'enRuta' || Estado.mision === 'enCasillero' ||
     Estado.mision === 'paqueteCerrado' || Estado.mision === 'paqueteAbierto' ||
     Estado.mision === 'paqueteRobado' || Estado.mision === 'volviendo'){
    cambiarEscena('terminal-escena','apartamento');
    return;
  }
  Estado.mision = 'enRuta';
  saltoDeEscena(); // +50 a +70 min
  ajustarHumano('fatiga', 3);
  idxUbicMision = 0;
  // Quitamos cualquier mensaje pendiente del terminal y limpiamos la cola.
  Estado.terminalPendientes = Estado.terminalPendientes.filter(p => p.tipo !== 'misionMara');
  cambiarEscena('terminal-escena','mision-transito-escena');
  const bg = document.getElementById('bg-mision-transito');
  bg.style.opacity = '1';
  setTimeout(mostrarSiguienteUbicMision, 800);
}

async function mostrarSiguienteUbicMision(){
  if(idxUbicMision >= ubicacionesMision.length){
    // Hemos pasado las 3 ubicaciones. Vamos al casillero.
    irACasillero();
    return;
  }
  const ub = ubicacionesMision[idxUbicMision];
  const cont = document.getElementById('tarjetas-loc-mision');
  const bg = document.getElementById('bg-mision-transito');
  const ambBg = document.getElementById('ambiente-bg-txt-mision');

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
    <div class="loc-nombre" style="color:${ub.color}" id="mloc-nombre-tw"></div>
    <div class="loc-desc" id="mloc-desc-tw"></div>
    <div id="mloc-btn-wrap" style="opacity:0;transition:opacity 0.5s ease;"></div>
  `;
  cont.appendChild(card);
  await typeWriter('mloc-nombre-tw', ub.nombre, 35);
  await esperar(300);
  // CAPA 2: si la confianza está en un extremo (alta o baja),
  // añadimos una línea extra al final de la descripción. Da el
  // tono de que el viaje no es el mismo según cómo viste a Mara.
  // La desc base se elige al azar entre las variantes si existen.
  let descCompleta = (ub.descs && ub.descs.length > 0) ? elegirAlAzar(ub.descs) : ub.desc;
  const conf = nivelConfianzaMara();
  if(conf === 'alta' && ub.extraAlta){
    descCompleta += ' ' + ub.extraAlta;
  } else if(conf === 'baja' && ub.extraBaja){
    descCompleta += ' ' + ub.extraBaja;
  }
  await typeWriter('mloc-desc-tw', descCompleta, 22);
  await esperar(500);
  const wrap = document.getElementById('mloc-btn-wrap');
  const esUltima = idxUbicMision >= ubicacionesMision.length - 1;
  wrap.innerHTML = esUltima
    ? `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicMision()">LLEGAR AL CASILLERO →</button>`
    : `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicMision()">CONTINUAR →</button>`;
  wrap.style.opacity = '1';
  idxUbicMision++;
}

// Igual que avanzarUbic, pero para la misión. Mantiene 40% de
// probabilidad de evento aleatorio entre ubicaciones.
function avanzarUbicMision(){
  intentarEventoAleatorio(()=>mostrarSiguienteUbicMision());
}

// Tras la última ubicación, va al casillero.

// ============================================================

// ============================================================
// BLOQUE JS-34 — MISIÓN — CASILLERO 218 (abrir, robar, entregar)
// Las opciones disponibles delante del casillero.
// ============================================================

function irACasillero(){
  Estado.mision = 'enCasillero';
  // CAPA 2: pintamos el texto según info + confianza.
  const conf = nivelConfianzaMara();
  const info = pidioInfoMara();
  let texto = '';
  if(!info && conf !== 'alta'){
    // Estándar
    texto = `El metal del casillero está rayado por años de manos como las tuyas.<br>
      Tecleas la combinación: <span style="color:var(--cyan);letter-spacing:0.3em">0-2-7-1-9</span>.<br>
      Un chasquido. Se abre.<br><br>
      Dentro hay un <strong style="color:var(--cyan)">sobre opaco</strong>.<br>
      Tiene <strong>tu nombre escrito a mano</strong>. Sin remitente.<br>
      Pesa poco.`;
  } else if(!info && conf === 'alta'){
    // Sin info + confianza alta
    texto = `El casillero está donde tenía que estar.<br>
      Tecleas <span style="color:var(--cyan);letter-spacing:0.3em">0-2-7-1-9</span>. La cerradura cede limpia.<br><br>
      Dentro, el sobre. Tu nombre escrito a mano, con cierto cuidado.<br>
      Pesa poco. Pero algo en él pesa más de lo que pesa.`;
  } else if(info && conf !== 'alta'){
    // Con info + neutra/baja
    texto = `Tal como dijo, el 218.<br>
      Tecleas <span style="color:var(--cyan);letter-spacing:0.3em">0-2-7-1-9</span> sin dudar. Se abre.<br><br>
      Sobre opaco. Tu nombre. Sin remitente.<br>
      Sigue sin gustarte, pero ya sabías que no te iba a gustar.`;
  } else {
    // Con info + confianza alta
    texto = `El casillero está como te dijo Mara.<br>
      Tecleas <span style="color:var(--cyan);letter-spacing:0.3em">0-2-7-1-9</span>. La cerradura cede al primer intento.<br><br>
      Dentro, el sobre con tu nombre.<br>
      Te pidió que no preguntaras qué hay. Tampoco te lo dijo, en realidad.<br>
      Solo te explicó lo bastante para que aceptaras.`;
  }
  const desc = document.getElementById('mision-casillero-desc');
  if(desc) desc.innerHTML = texto;
  cambiarEscena('mision-transito-escena', 'mision-casillero-escena');
}

// Decisión del jugador en el casillero: cerrado, abrir o robar.
function decisionCasillero(opcion){
  if(opcion === 'cerrado'){
    Estado.mision = 'paqueteCerrado';
    recordar('decisionPaquete', 'cerrado');
    // Vuelta directa al bar sin ver el contenido.
    volverDelCasillero();
  } else if(opcion === 'abrir'){
    Estado.mision = 'paqueteAbierto';
    recordar('decisionPaquete', 'abierto');
    // Aplicar las consecuencias mecánicas pedidas.
    ajustarHumano('disociacion', 15);
    recordar('vioFragmentoCero', true);
    recordar('vioPaqueteMara', 'abierto');
    mostrarContenidoPaquete();
  } else if(opcion === 'robar'){
    Estado.mision = 'paqueteRobado';
    recordar('decisionPaquete', 'robado');
    ajustarMemoria('confianzaMara', -3);
    // No vuelve al bar. Va directamente al cierre alternativo.
    saltoDeEscena();
    cambiarEscena('mision-casillero-escena', 'mision-entrega-escena');
    setTimeout(pintarEntregaRobo, 600);
  }
}

// Pinta el contenido del sobre con una pequeña animación
// de aparición por elementos. Tras eso, botón "VOLVER AL BAR".
async function mostrarContenidoPaquete(){
  cambiarEscena('mision-casillero-escena', 'mision-contenido-escena');
  const cuerpo = document.getElementById('mision-contenido-cuerpo');
  cuerpo.innerHTML = `
    <div class="item" id="paq-1">
      <div class="item-titulo">▸ FOTOGRAFÍA</div>
      <div class="item-cuerpo">Eres tú. Niño. No tendrás más de cinco años.<br>No la recuerdas, pero eres tú.<br>Detrás, una fecha escrita a lápiz:<br><em>14 / 03 / 2222</em>.<br>No encaja con la que tú creías.</div>
    </div>
    <div class="item" id="paq-2">
      <div class="item-titulo">▸ DOCUMENTO HELIX</div>
      <div class="item-cuerpo">Membrete oficial. Tinta corrida.<br>«Sujeto <em>273-19A</em> · Reasignación de unidad completada · Memoria parcial reseteada · Continuidad funcional: estable.»<br>Tu firma al pie. Tu firma. Que no recuerdas haber hecho.</div>
    </div>
    <div class="item" id="paq-3">
      <div class="item-titulo">▸ NOTA A MANO</div>
      <div class="item-cuerpo">Una sola línea, letra rápida:<br><em>«No eres el primero. Pero quizás puedas ser el último.»</em></div>
    </div>
  `;
  await esperar(900);
  document.getElementById('paq-1').classList.add('visible');
  await esperar(1400);
  document.getElementById('paq-2').classList.add('visible');
  await esperar(1400);
  document.getElementById('paq-3').classList.add('visible');
}

// Vuelve al bar tras la decisión (cerrado o abierto).
function volverDelCasillero(){
  saltoDeEscena(); // +50-70 min de vuelta
  ajustarHumano('fatiga', 5);
  // Origen depende de en qué escena estábamos.
  const origen = Estado.mision === 'paqueteAbierto' ? 'mision-contenido-escena' : 'mision-casillero-escena';
  cambiarEscena(origen, 'mision-entrega-escena');
  setTimeout(pintarEntrega, 600);
}

// Pinta la conversación de cierre con Mara según lo que hiciste.
function pintarEntrega(){
  const narr = document.getElementById('mision-entrega-narrativa');
  const btn = document.getElementById('btn-cerrar-mision');
  const decision = Estado.memoria.decisionPaquete;
  const conf = nivelConfianzaMara();
  let texto = '';
  let pago = 0;
  let nota = '+30 CR · MARA VEX';

  if(decision === 'cerrado'){
    // CAPA 2: 3 variantes según confianza.
    if(conf === 'alta'){
      texto = `<p>Mara levanta la vista cuando entras. Casi sonríe. Casi.</p>
        <p>Dejas el sobre. Lo guarda sin mirarlo. Te empuja los créditos por la mesa.</p>
        <p>—<em>Treinta y cinco. Por las molestias.</em></p>
        <p>—<em>Cuida la próxima semana. Algo se está moviendo. Si te necesito, sabrás.</em></p>`;
      pago = 35;
      nota = '+35 CR · MARA VEX';
      ajustarMemoria('confianzaMara', 1);
    } else if(conf === 'baja'){
      texto = `<p>Mara no te mira. Solo señala la mesa con la barbilla.</p>
        <p>Dejas el sobre. Cuenta los créditos sin levantar la vista.</p>
        <p>—<em>Veintiocho. He tenido que pagar dos peajes por tu culpa.</em></p>
        <p>—<em>Ahora vete. Y no vuelvas en una semana.</em></p>`;
      pago = 28;
      nota = '+28 CR · MARA VEX';
      // No subimos confianza si era baja: ya está en negativo.
    } else if(pidioInfoMara()){
      // Variante específica: con info + neutra
      texto = `<p>Mara coge el sobre. Lo sopesa un segundo, como confirmando algo.</p>
        <p>—<em>Hiciste lo que dije. Eso ya es más de lo que hace la mayoría.</em></p>
        <p>Treinta créditos. Sin sobornos, sin descuentos. Lo justo.</p>`;
      pago = 30;
      ajustarMemoria('confianzaMara', 1);
    } else {
      // Estándar (sin info, neutra)
      texto = `<p>Mara está donde estaba. Como si no se hubiera movido.</p>
        <p>Dejas el sobre sobre la mesa. Ella no lo abre.<br>Lo guarda donde no puedes verlo.</p>
        <p>—<em>Bien.</em> —dice—. <em>Sin más.</em></p>
        <p>Cuenta treinta créditos con dedos rápidos. Te los desliza por la mesa.</p>
        <p>—<em>Vete. Y olvida esta noche.</em></p>`;
      pago = 30;
      ajustarMemoria('confianzaMara', 1);
    }
  } else if(decision === 'abierto'){
    // CAPA 2: 3 variantes según confianza para entrega abierta.
    narr.classList.add('tensa');
    if(conf === 'alta'){
      texto = `<p>Mara coge el sobre. Pasa el dedo por el sello. Suspira.</p>
        <p>—<em>Sabía que lo abrirías. Por eso te lo di a ti.</em></p>
        <p>Te empuja dieciocho créditos.</p>
        <p>—<em>Lo que viste ahora pesa. No se lo digas a nadie. Ni siquiera a ti mismo cuando no estés solo.</em></p>`;
      pago = 18;
      nota = '+18 CR · MARA VEX';
      // No subimos confianza pero tampoco la bajamos.
    } else if(conf === 'baja'){
      texto = `<p>Mara coge el sobre. Lo abre del todo, sin discreción. Lee. Cierra los ojos un segundo.</p>
        <p>—<em>Te pedí UNA cosa.</em></p>
        <p>Saca doce créditos. No te los empuja. Los deja caer.</p>
        <p>—<em>Ahora desaparece. Por una temporada larga.</em></p>`;
      pago = 12;
      nota = '+12 CR · MARA VEX';
      ajustarMemoria('confianzaMara', -2);
    } else {
      // Estándar (neutra, con o sin info)
      texto = `<p>Mara coge el sobre antes de que lo dejes en la mesa.<br>Pasa el dedo por el sello alterado. Te mira.</p>
        <p>—<em>Curiosa, la gente.</em></p>
        <p>No grita. No hace falta. Saca quince créditos. Los pone sobre la mesa con cuidado.</p>
        <p>—<em>La curiosidad no es gratis. Pero tampoco es lo peor que puedes tener.</em><br>—<em>Ahora vete. Y piensa en lo que has visto. Mucho. Y solo.</em></p>
        <p style="opacity:0.7;font-style:italic">Sale antes de que tú lo hagas. Por la puerta de atrás.</p>`;
      pago = 15;
      ajustarMemoria('confianzaMara', -1);
    }
    recordar('maraSabeQueViste', true);
  }

  // Aplicar pago y mostrar
  Estado.creditos = (Estado.creditos || 0) + pago;
  notificarCambio(nota, 'pos');
  if(typeof actualizarHUD === 'function') actualizarHUD();
  narr.innerHTML = texto;
  setTimeout(()=>{ btn.style.display = 'inline-block'; }, 2500);
}

// Cierre alternativo si robaste el paquete y no volviste al bar.
function pintarEntregaRobo(){
  const narr = document.getElementById('mision-entrega-narrativa');
  const titulo = document.querySelector('.mision-entrega-titulo');
  const btn = document.getElementById('btn-cerrar-mision');
  titulo.textContent = 'UNIDAD 273-19A — DE VUELTA';
  narr.classList.add('robo');
  narr.innerHTML = `<p>No vas al bar. Coges otra ruta. La más larga.<br>El sobre en el bolsillo pesa más de lo que debería pesar.</p>
    <p>Cuando entras al apartamento, suena un aviso en el terminal. Un solo mensaje.</p>
    <p style="border-left:2px solid rgba(255,0,110,0.4);padding-left:0.7rem;font-style:italic">
      <em>«Sé dónde vives. No voy a ir.<br>Tú decides qué hacer con lo que llevas.»</em>
    </p>
    <p>No hay nombre. No hace falta.</p>`;
  recordar('maraSabeQueRobaste', true);
  setTimeout(()=>{ btn.style.display = 'inline-block'; }, 2500);
}

// Cierre final del Fragmento I (sea cual sea la rama).
// NOTA: ya NO se usa directamente desde el botón de entrega.
// Se mantiene por compatibilidad y por si se necesita un fin duro.
function cerrarMision(){
  Estado.mision = 'completada';
  // Marcamos la partida como completada y guardamos.
  Estado.partidasCompletadas = (Estado.partidasCompletadas || 0) + 1;
  guardarPartida();
  // Generamos el texto final dinámico (sigue funcionando con la
  // nueva memoria, porque añade matices según decisionPaquete).
  document.getElementById('final-texto-dinamico').innerHTML = componerTextoFinal();
  mostrarHUD(false);
  detenerDecaimientoPasivo();
  detenerCobrosPeriódicos();
  cambiarEscena('mision-entrega-escena', 'final-escena');
}


// ============================================================

// ============================================================
// BLOQUE JS-35 — MISIÓN — VUELTA al apartamento tras entrega
// El camino de vuelta a casa después de cerrar la misión.
// ============================================================

// ============================================================
// VUELTA AL APARTAMENTO TRAS LA MISIÓN
// ============================================================
// Cuando el jugador pulsa "VOLVER AL APARTAMENTO" después de la
// entrega con Mara (o tras la entrega-robo), arrancamos un viaje
// inverso de 3 paradas usando la misma escena de tránsito de la
// misión. Al llegar, entra al apartamento y "Dormir" cierra el día.
// ============================================================

// Las 3 paradas de la vuelta. Simétricas a la ida pero con texto
// adaptado (cansancio, paquete entregado o robado, lluvia).
const ubicacionesVuelta = [
  {
    nombre: 'CALLE EXTERIOR — RAIN DISTRICT',
    desc: 'La lluvia ácida está más fuerte que antes. El cuello del abrigo no aguanta. Caminas pegado a los pórticos.',
    descs: [
      'La lluvia ácida está más fuerte que antes. El cuello del abrigo no aguanta. Caminas pegado a los pórticos.',
      'Los charcos reflejan anuncios al revés. Uno de ellos parece moverse cuando lo pisas.',
      'Un quiosco ambulante recoge sus persianas. El vendedor te mira sin verte y sigue plegando lonas.',
      'Pasas junto a un cuerpo dormido bajo una visera. No te paras. Nadie se para nunca.',
      'Un perro mecánico te husmea las botas. Las suelta cuando confirma que no eres nadie.'
    ],
    extraAlta: 'Nadie te sigue. Lo notas en cómo cede el ruido al fondo.',
    extraBaja: 'Notas dos cabezas que se giran al verte pasar. Quizás coincidencia.',
    bg: 'CALLE', color: '#ff6b00', img: 'MERCADO', pos: 'center 20%'
  },
  {
    nombre: 'PASO 12B — VUELTA',
    desc: 'El torno está abierto. Esta vez no te pregunta nada. Cruzas sin teclear. El cristal de la garita sigue vacío.',
    descs: [
      'El torno está abierto. Esta vez no te pregunta nada. Cruzas sin teclear. El cristal de la garita sigue vacío.',
      'El lector de iris está apagado. Como si supiera que ya no merece la pena escanearte.',
      'En el cristal hay una huella nueva. No es la tuya. No vas a preguntarte de quién es.',
      'Pasa un guardia de seguridad. Está mirando su panel y no levanta la vista. Mejor.',
      'Un cartel parpadea: «BIENVENIDO». Cinco segundos. Luego apaga.'
    ],
    extraAlta: 'Como si te estuvieran dejando pasar a propósito. Otra vez.',
    extraBaja: 'Una luz roja parpadea al fondo. Aprietas el paso.',
    bg: 'PASO 12B', color: '#ff006e', img: 'MAINTENANCE_ACCESS12', pos: 'center'
  },
  {
    nombre: 'PILAS INFERIORES — CALLEJÓN DE LOS PARAGUAS ROTOS',
    desc: 'Estás ya casi en casa. La lluvia mezcla aceite y agua sobre el asfalto. Las luces del Stacks 19 parpadean a tres calles.',
    descs: [
      'Estás ya casi en casa. La lluvia mezcla aceite y agua sobre el asfalto. Las luces del Stacks 19 parpadean a tres calles.',
      'El callejón huele a comida quemada y plástico fundido. Olor a casa, en versión barata.',
      'Una bicicleta a medio desguazar contra una pared. Mañana ya no estará.',
      'Las luces de tu unidad se ven a lo lejos. Apagadas. Como las dejaste.',
      'Pisas un cable suelto. Da un chispazo. Sigues como si no.'
    ],
    extraAlta: 'Llevas el sobre menos pesado de lo que pensabas. O quizás solo estás cansado.',
    extraBaja: 'El sobre te pesa en el bolsillo como si recordara cosas que tú no.',
    bg: 'PILAS', color: '#00e5ff', img: 'PASILLO', pos: 'center'
  }
];

let idxUbicVuelta = 0;

// Arranca la vuelta. Se llama desde el botón de la escena de entrega
// (tanto la normal como la del robo).
function iniciarVueltaApartamento(){
  Estado.mision = 'volviendo';
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  if(typeof ajustarHumano === 'function') ajustarHumano('fatiga', 4);

  // Caso especial: si robó el paquete, ya cogió "la ruta larga".
  // Saltamos el viaje de vuelta y vamos directo al apartamento.
  const decision = (Estado.memoria && Estado.memoria.decisionPaquete) || null;
  if(decision === 'robado'){
    cambiarEscena('mision-entrega-escena', 'apartamento');
    setTimeout(llegarAlApartamentoTrasMision, 100);
    return;
  }

  idxUbicVuelta = 0;
  // Reutilizamos la escena de tránsito de la misión (mismo HTML).
  cambiarEscena('mision-entrega-escena', 'mision-transito-escena');
  const bg = document.getElementById('bg-mision-transito');
  if(bg) bg.style.opacity = '1';
  setTimeout(mostrarSiguienteUbicVuelta, 800);
}

async function mostrarSiguienteUbicVuelta(){
  if(idxUbicVuelta >= ubicacionesVuelta.length){
    // Hemos pasado las 3 ubicaciones. Entramos al apartamento.
    llegarAlApartamentoTrasMision();
    return;
  }
  const ub = ubicacionesVuelta[idxUbicVuelta];
  const cont = document.getElementById('tarjetas-loc-mision');
  const bg = document.getElementById('bg-mision-transito');
  const ambBg = document.getElementById('ambiente-bg-txt-mision');

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
    <div class="loc-nombre" style="color:${ub.color}" id="mloc-nombre-tw"></div>
    <div class="loc-desc" id="mloc-desc-tw"></div>
    <div id="mloc-btn-wrap" style="opacity:0;transition:opacity 0.5s ease;"></div>
  `;
  cont.appendChild(card);
  await typeWriter('mloc-nombre-tw', ub.nombre, 35);
  await esperar(300);

  // Igual que en la ida: variantes según confianza con Mara.
  // La desc base se elige al azar entre las variantes si existen.
  let descCompleta = (ub.descs && ub.descs.length > 0) ? elegirAlAzar(ub.descs) : ub.desc;
  const conf = (typeof nivelConfianzaMara === 'function') ? nivelConfianzaMara() : 'neutra';
  if(conf === 'alta' && ub.extraAlta){
    descCompleta += ' ' + ub.extraAlta;
  } else if(conf === 'baja' && ub.extraBaja){
    descCompleta += ' ' + ub.extraBaja;
  }
  await typeWriter('mloc-desc-tw', descCompleta, 22);
  await esperar(500);
  const wrap = document.getElementById('mloc-btn-wrap');
  const esUltima = idxUbicVuelta >= ubicacionesVuelta.length - 1;
  wrap.innerHTML = esUltima
    ? `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicVuelta()">ENTRAR EN CASA →</button>`
    : `<button class="btn-avanzar-loc" style="border-color:${ub.color}44;color:${ub.color}" onclick="avanzarUbicVuelta()">CONTINUAR →</button>`;
  wrap.style.opacity = '1';
  idxUbicVuelta++;
}

// Igual que en la ida: hay una probabilidad de evento aleatorio entre paradas.
function avanzarUbicVuelta(){
  if(typeof intentarEventoAleatorio === 'function'){
    intentarEventoAleatorio(()=>mostrarSiguienteUbicVuelta());
  } else {
    mostrarSiguienteUbicVuelta();
  }
}

// Tras la tercera parada, entra al apartamento y muestra texto de llegada.
function llegarAlApartamentoTrasMision(){
  Estado.mision = 'volvioApartamento';
  // Limpiamos cualquier rastro de la PRIMERA misión que podría reaparecer:
  //   - el mensaje cifrado de Mara en el terminal (misionMara)
  //   - el botón "SALIR DEL APARTAMENTO" del terminal viejo
  // Sin esto, al revisar el terminal después de la misión, el jugador
  // podría caer otra vez en el flujo de la primera misión (bucle).
  if(Estado.terminalPendientes){
    Estado.terminalPendientes = Estado.terminalPendientes.filter(p => p.tipo !== 'misionMara');
  }
  const btnT = document.getElementById('btn-terminal');
  if(btnT) btnT.style.display = 'none';
  // Guardamos por si el jugador cierra el navegador antes de dormir.
  if(typeof guardarPartida === 'function') guardarPartida();
  // Aseguramos que la escena visible sea el apartamento (cubre ambos
  // casos: viniendo del tránsito de vuelta o del salto directo por robo).
  const transitoEscena = document.getElementById('mision-transito-escena');
  if(transitoEscena && transitoEscena.classList.contains('activa')){
    cambiarEscena('mision-transito-escena', 'apartamento');
  }

  // Sobreescribimos el texto y los botones del apartamento para el
  // estado "post-misión": cansado, en casa, sin urgencia.
  const narr = document.getElementById('narr-apt');
  const opc = document.getElementById('opciones-apt');
  const fechaApt = document.querySelector('.fecha-apt');
  if(fechaApt) fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS';

  // Texto de llegada distinto según lo que pasó con el paquete.
  if(narr){
    const decision = (Estado.memoria && Estado.memoria.decisionPaquete) || null;
    let textoLlegada;
    if(decision === 'robado'){
      textoLlegada = 'Cierras la puerta despacio.<br>El sobre aún en el bolsillo.<br>Por primera vez en horas, no hay nadie mirando.';
    } else if(decision === 'abierto'){
      textoLlegada = 'Cierras la puerta.<br>Sigues viendo la fotografía cuando cierras los ojos.<br>La lluvia, al menos, no ha cambiado.';
    } else {
      // 'cerrado' o por defecto
      textoLlegada = 'Cierras la puerta.<br>Te quitas la chaqueta empapada.<br>Ya estás en casa. Lo que sea que eso signifique.';
    }
    narr.innerHTML = textoLlegada;
  }

  if(opc){
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Dormir</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>`;
  }
}

// Ubicaciones de IDA al bar. Cada una tiene una desc base + variantes
// adicionales en 'descs'. En tiempo de render se escoge una al azar para

// ============================================================