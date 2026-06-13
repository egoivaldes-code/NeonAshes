// ============================================================
//  NEON ASHES — CAZARRECOMPENSAS (v0.101)
//  Profesión narrativa. Trabaja por CONTRATOS de captura.
//
//  Flujo de un contrato:
//   1) ABORDAJE  — opciones según el EQUIPO que llevas. Las que
//      piden un item que no tienes salen BLOQUEADAS, indicando qué
//      lo abriría. Cada vía tiene prob. de éxito y posible coste.
//   2) PERSECUCIÓN (solo si el abordaje falla) — 2-3 decisiones de
//      ruta; tu fatiga y equipo inclinan el resultado. Perderla =
//      el objetivo escapa (contrato fallido, sin paga).
//   3) EL PULSO — cara a cara. Lees 2-3 frases del objetivo eligiendo
//      cómo interpretarlo. Acertar revela su contexto real y DESBLOQUEA
//      la mejor opción de la decisión.
//   4) DECISIÓN MORAL — entregar vivo / pactar / soltar. El contratante
//      quiere una cosa; tú ves a la persona.
//
//  Contenido hand-authored. Más contratos => añadir a CONTRATOS_CAZA.
// ============================================================

const CAZA_PROF_ID = 'cazarrecompensas';

// Nombres legibles de items, para los mensajes de "opción bloqueada".
const CAZA_ITEM_NOMBRES = {
  arma_fuego: 'un arma de fuego',
  arma_blanca: 'un arma blanca',
  navaja_ceramica: 'una navaja',
  ganzua: 'un set de ganzúas',
  senuelo: 'un señuelo',
  licor: 'una botella de licor',
  analizador: 'un analizador',
  placa_sindicato: 'la placa del Ferro',
  llave_loto: 'la llave del Loto',
  papel_helix: 'una credencial de HELIX'
};
function _cazaNombreItem(id){ return CAZA_ITEM_NOMBRES[id] || 'cierto equipo'; }
function _cazaLleva(id){ return (typeof tieneItem === 'function') ? tieneItem(id) : false; }

// ── Estado del contrato en curso ────────────────────────────
let _contratoActivo = null;
let _contratoFase = 'abordaje';   // abordaje | persecucion | pulso | decision
let _contratoAbordajeOk = null;
let _persecPaso = 0;
let _persecFallos = 0;
let _pulsoPaso = 0;
let _pulsoAciertos = 0;
let _contratoVolverA = 'apartamento';

function _cazaFX(clave, vol){
  if(typeof reproducirFX === 'function') reproducirFX(clave, vol);
}

// ============================================================
//  POOL DE CONTRATOS
//  Estructura de cada contrato:
//   id, titulo, contratante, faccion, peligro, pagaBase, progreso,
//   rangoMin, resumen, objetivo{ nombre, contexto },
//   abordaje{ intro, opciones[] }      ← cada opción puede pedir requiereItem
//   persecucion{ intro, pasos[] }      ← pasos[].opciones con bueno:true
//   pulso{ intro, frases[] }           ← cada frase: lecturas[] con correcta:true
//   decision{ intro, opciones[] }      ← una opción puede pedir requierePulso:true
//
//  Opción de ABORDAJE: txt, via, prob, requiereItem?, exito{msg}, fallo{msg,
//    fatiga?, herida?, disociacion?, huye?:true}  (huye => dispara persecución)
//  Paso de PERSECUCIÓN: txt(narr), opciones[] con { txt, bueno:true|false, msg }
//  Frase de PULSO: { txt, lecturas:[ {txt, correcta:true|false} ] }
//  Opción de DECISIÓN: txt, tipo, pagaMult, rep, repAlt?, coste?, item?,
//    disociacion?, narr, malo?, requierePulso?:true (oculta hasta leer bien)
// ============================================================
const CONTRATOS_CAZA = [
  // ── CONTRATO 1 — LOTO (cobro de deuda) ────────────────────
  {
    id: 'deuda_heredada',
    titulo: 'LA DEUDA QUE NO PIDIÓ',
    contratante: 'El Loto Carmesí · Mano Roja',
    faccion: 'loto',
    peligro: 1,
    pagaBase: 180,
    progreso: 90,
    rangoMin: 0,
    resumen: 'Una tal Sefi debe al Loto una deuda que no contrajo: la heredó de su madre muerta. El Loto la quiere viva, para "renegociar" en sus términos. Localízala y tráela. O no.',
    objetivo: {
      nombre: 'Sefi Adra, 19 años',
      contexto: 'Friega suelos de noche en tres sitios para pagar intereses que crecen más rápido que su sueldo. No huye del Loto: huye hacia adelante, intentando saldar algo imposible.'
    },
    abordaje: {
      intro: 'Localizas a Sefi en el descanso entre dos turnos, comiendo de pie en un callejón, medio dormida. Es pequeña, ojerosa, no parece peligrosa. ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Acercarte con calma y hablar', via:'labia', prob:0.9,
          exito:{ msg:'Se asusta, pero no corre. Cuando le dices que vienes del Loto, baja los hombros como quien esperaba esto desde hace meses. "Lo sabía. ¿Me lleva ya?"' },
          fallo:{ msg:'Algo en tu cara la alarma. Suelta el pan y echa a correr callejón abajo.', huye:true } },
        { txt:'[SEÑUELO] Tenderle una oferta de trabajo falsa', via:'trampa', prob:0.95, requiereItem:'senuelo',
          exito:{ msg:'Le deslizas un señuelo: un falso aviso de empleo mejor pagado en un sitio tranquilo. Va sin sospechar. Cuando entiende que era una trampa, ya está sentada frente a ti, demasiado cansada para enfadarse.', disociacion:3 },
          fallo:{ msg:'El cebo no cuela; huele la mentira y retrocede.', huye:true } },
        { txt:'[FUERZA] Acorralarla sin más', via:'fuerza', prob:0.95,
          exito:{ msg:'La arrinconas contra los contenedores. Ni lo intenta. Levanta las manos. "No hace falta que me toque. Voy." La fuerza sobraba, y los dos lo sabéis.', disociacion:3 },
          fallo:{ msg:'Forcejea por puro pánico, se te escurre y sale corriendo.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Sefi corre con la desesperación del que no tiene a dónde ir pero corre igual. Conoce estos callejones mejor que tú. Tienes que decidir rápido.',
      pasos: [
        { narr:'Se mete por un pasaje entre dos bloques. Puedes seguirla de frente o cortarle por el lateral.',
          opciones:[
            { txt:'Cortarle por el lateral', bueno:true, msg:'Calculas bien y le sales de frente al otro lado. Se frena en seco.' },
            { txt:'Seguirla de frente, a fondo', bueno:false, msg:'Te saca ventaja; conoce cada recoveco. La pierdes de vista un momento.' }
          ] },
        { narr:'Trepa por una escalera de incendios hacia las azoteas. Pesada decisión: arriba o rodear.',
          opciones:[
            { txt:'Subir tras ella', bueno:true, msg:'La alcanzas en la azotea, sin salida, jadeando los dos.' },
            { txt:'Rodear por abajo a esperarla', bueno:false, msg:'Calculas mal por dónde bajará y la pierdes otro tramo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'La tienes delante, sin aliento. Antes de decidir qué haces con ella, la miras de verdad. Lee quién es.',
      frases: [
        { txt:'"Yo no debo nada. Era de mi madre. Ella ya pagó con la vida, ¿no les basta?"',
          lecturas:[
            { txt:'Miente para ablandarte', correcta:false },
            { txt:'Dice la verdad y está agotada de cargarla', correcta:true },
            { txt:'Te amenaza encubiertamente', correcta:false }
          ] },
        { txt:'"Haga lo que tenga que hacer. Solo... que sea rápido. Mañana libro por primera vez en un mes."',
          lecturas:[
            { txt:'Es sumisión calculada, busca que la sueltes', correcta:false },
            { txt:'Es cansancio real, ya no le queda lucha', correcta:true },
            { txt:'Prepara una huida', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Sefi espera tu decisión con la dignidad rota de quien lleva toda la vida pagando lo de otros. En el bolsillo tienes el contrato del Loto: la pagan viva. ¿Qué haces?',
      opciones: [
        { txt:'Entregarla al Loto (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:8, disociacion:8,
          narr:'La entregas en una sala de terciopelo donde la Mano Roja la recibe con sonrisa de propietaria. Cobras completo, en billetes que huelen a incienso. Sefi no te mira al salir; ya calcula cuántos turnos más es ahora su vida. El Loto te tendrá en cuenta. Esa noche te cuesta apagar la luz.' },
        { txt:'Pactar: pagar tú parte de su deuda (-60 CR)', tipo:'pacto', pagaMult:0.3, rep:2, coste:60, disociacion:-2,
          narr:'La llevas, pero pones de tu bolsillo para rebajarle el plazo a algo humano. La Mano Roja arquea una ceja: "Generoso. O tonto." Cobras una miseria y encima pagas. Sefi sale debiendo menos y respirando un poco. Un parche comprado con tus créditos. Pero el que tú elegiste poner.' },
        { txt:'Dejarla escapar (sabes que es justo)', tipo:'soltar', pagaMult:0.0, rep:-6, disociacion:-4, requierePulso:true,
          narr:'Le dices que corra, que se vaya de Las Pilas si puede, que no la has visto. Echa a andar deprisa sin dar las gracias, porque quien aprendió a no esperar nada tampoco sabe agradecer. No cobras, y el Loto sabrá que fallaste un encargo fácil. Pero por una vez duermes del tirón. Entendiste a quién tenías delante, y por eso pudiste hacerlo.' }
      ]
    }
  },
  // ── CONTRATO 2 — FERRO (fugitivo) ─────────────────────────
  {
    id: 'el_que_dijo_no',
    titulo: 'EL QUE DIJO QUE NO',
    contratante: 'Sindicato Ferro · Don Vasek',
    faccion: 'sindicatos',
    peligro: 2,
    pagaBase: 280,
    progreso: 120,
    rangoMin: 1,
    resumen: 'Un cobrador del Ferro, Brann, dejó de cumplir y huyó con una caja que no era suya. Vasek lo quiere de vuelta. No dice si vivo.',
    objetivo: {
      nombre: 'Brann Oste, exhombre de Vasek',
      contexto: 'Dejó el Ferro el día que le mandaron romperle las manos a un panadero por un retraso. Cogió una caja de la recaudación como seguro. Dentro no hay dinero: hay pruebas de lo que el Ferro hace, su única póliza de vida.'
    },
    abordaje: {
      intro: 'Encuentras a Brann en un sótano húmedo, un hombre grande encorvado sobre una pistola que monta y desmonta sin parar. No tiene cara de criminal: tiene cara de no dormir. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Hablarle de hombre a hombre', via:'labia', prob:0.8,
          exito:{ msg:'Baja el arma despacio cuando ve que no sacas la tuya. "¿Te manda el viejo? Claro." Suspira. "Siéntate. Si vas a llevarme, escucha por qué me fui."' },
          fallo:{ msg:'Se sobresalta, vuelca la mesa y escapa por el respiradero del sótano.', huye:true } },
        { txt:'[ARMA] Encañonarlo antes de que reaccione', via:'fuerza', prob:0.9, requiereItem:'arma_fuego',
          exito:{ msg:'Sacas el arma primero. Brann se queda muy quieto, las manos lejos de la suya. "Vaya. Uno listo." Se sienta despacio. La pistola hace innecesaria la pelea, y eso te quita un peso y te pone otro.', disociacion:5 },
          fallo:{ msg:'Dudas medio segundo de más y se tira por el respiradero antes de que apuntes.', huye:true } },
        { txt:'[SIGILO] Desarmarlo por sorpresa', via:'sigilo', prob:0.6,
          exito:{ msg:'Esperas a que deje el arma para frotarse los ojos. Un movimiento y la apartas. Se queda mirándote las manos vacías, casi aliviado de no tener ya la opción de usarla.' },
          fallo:{ msg:'El suelo cruje bajo tu bota. Reacciona, vuelca todo y huye en la confusión.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Brann es grande pero la desesperación le da alas. Se lanza por los conductos de servicio del Ferro, terreno que conoce de sus años de cobrador.',
      pasos: [
        { narr:'Se mete en una red de tuberías a oscuras. Puedes seguir el ruido o cortar la luz del sector para igualar las condiciones.',
          opciones:[
            { txt:'Cortar la luz del sector', bueno:true, msg:'A oscuras los dos, su ventaja de conocer el sitio se reduce. Lo oyes tropezar.' },
            { txt:'Seguir el ruido a ciegas', bueno:false, msg:'Conoce cada codo de esas tuberías. Te despista en una bifurcación.' }
          ] },
        { narr:'Sale a un patio de carga lleno de contenedores apilados. Puede esconderse en cualquiera.',
          opciones:[
            { txt:'Esperar quieto y escuchar su respiración', bueno:true, msg:'Te quedas inmóvil. Su jadeo lo delata tras un contenedor. Lo tienes.' },
            { txt:'Registrar contenedor por contenedor', bueno:false, msg:'Pierdes tiempo abriendo cajas vacías mientras él gana distancia.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Brann está reducido. Antes de decidir, lo miras bien y escuchas lo que dice. Lee al hombre.',
      frases: [
        { txt:'"Esa caja tiene tres asesinatos del Ferro tapados como accidentes. Por eso me fui. Por eso me quiere muerto el viejo."',
          lecturas:[
            { txt:'Exagera para que no lo entregues', correcta:false },
            { txt:'Dice la verdad y le aterra que arda con él', correcta:true },
            { txt:'Quiere usarte para vengarse de Vasek', correcta:false }
          ] },
        { txt:'"No te pido que me salves. Pido que esa caja no se queme. Lo que haya dentro le pertenece a sus muertos, no al viejo."',
          lecturas:[
            { txt:'Es un farol sentimental', correcta:false },
            { txt:'Ha hecho las paces con su suerte, solo le importan las pruebas', correcta:true },
            { txt:'Negocia su libertad disfrazándolo de causa', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Brann te ha enseñado la caja: pruebas de tres asesinatos del Ferro. "Si me entregas, el viejo me mata y esto desaparece. Tú decides de qué lado estás, aunque digas que de ninguno." ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Brann al Ferro (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:10, disociacion:10,
          narr:'Lo entregas, con caja y todo. Vasek paga sin contar y te pone una mano en el hombro: "Sabía que eras de los prácticos." No vuelves a ver a Brann. Las pruebas arden esa noche en un horno. Cobras bien, el Ferro te abre puertas, y tres familias seguirán creyendo que sus muertos fueron un accidente.' },
        { txt:'Entregar a Brann pero quedarte la caja', tipo:'pacto', pagaMult:0.6, rep:4, disociacion:5, item:'baliza_orbita_muerta',
          narr:'Entregas al hombre y te guardas la caja sin que Vasek lo sepa. Cobras algo menos, pero sales con algo que un día puede valer mucho, o costarte la vida. Brann te mira al irse: "Listo. Cuídate de no ser tan listo que el viejo se entere." Las pruebas siguen existiendo. En tus manos.' },
        { txt:'Dejar ir a Brann con la caja', tipo:'soltar', pagaMult:0.0, rep:-8, disociacion:-5, requierePulso:true,
          narr:'Le dices que se largue y esconda bien esa caja. No cobras, y Vasek sabrá que lo traicionaste por un don nadie con escrúpulos: un enemigo con cuarenta años de paciencia. Pero Brann desaparece llevándose la única prueba de tres crímenes, y la posibilidad, remota, de que algún día se sepan. Elegiste un bando. El de los muertos.' }
      ]
    }
  },
  // ── CONTRATO 3 — HELIX (recuperación) ─────────────────────
  {
    id: 'activo_fugado',
    titulo: 'ACTIVO NO AUTORIZADO',
    contratante: 'HELIX · Recuperación de Activos',
    faccion: 'helix',
    peligro: 3,
    pagaBase: 420,
    progreso: 160,
    rangoMin: 2,
    resumen: 'HELIX cataloga como "activo fugado" a una mujer con un implante experimental carísimo que se negó a devolver. Lo quieren de vuelta. El implante, sobre todo. Ella es secundaria.',
    objetivo: {
      nombre: 'Dra. Ileen Sarma · "el activo"',
      contexto: 'Era la investigadora jefe del ensayo. Se implantó su propio prototipo y descubrió que HELIX planeaba venderlo sabiendo que degrada el cerebro a los cinco años. Huyó para impedirlo. El implante que lleva dentro es la única prueba.'
    },
    abordaje: {
      intro: 'Localizas a Ileen en una clínica clandestina, intentando que le extraigan el implante sin matarla. Pálida, le tiemblan las manos: el prototipo ya empieza a fallarle. ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Decirle que sabes lo que sabe', via:'labia', prob:0.85,
          exito:{ msg:'Se queda muy quieta. "¿HELIX te manda a por mí o a por esto?", se toca la sien. "No es lo mismo. Y tú no pareces saber la diferencia todavía." Te invita a sentarte.' },
          fallo:{ msg:'Cree que vienes a rematarla, tira una bandeja de instrumental y sale corriendo por la trastienda.', huye:true } },
        { txt:'[CREDENCIAL] Entrar como inspector de HELIX', via:'trampa', prob:0.9, requiereItem:'papel_helix',
          exito:{ msg:'Enseñas la credencial al médico clandestino, que se evapora de puro miedo. Ileen, atrapada sin su cirujano, se sienta despacio. "Claro. Mandan a uno de los suyos con un papel. Qué predecibles." No hay huida posible.', disociacion:4 },
          fallo:{ msg:'El médico mira la credencial dos veces, no se la cree, y da la alarma. Ileen escapa en el alboroto.', huye:true } },
        { txt:'[ANALIZADOR] Bloquearle el implante a distancia', via:'sigilo', prob:0.85, requiereItem:'analizador',
          exito:{ msg:'Apuntas el analizador a su nuca y fuerzas un reinicio del implante: se le nubla la vista unos segundos, los justos para acercarte sin que reaccione. Cuando recupera el foco, ya estás sentado frente a ella. "Tecnología contra tecnología", murmura. "Al menos eres competente."', disociacion:3 },
          fallo:{ msg:'El implante detecta la intrusión y la alerta antes de que actúe. Sale huyendo con la vista aún borrosa.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Ileen huye tambaleándose, el implante fallándole a ratos. Está enferma, pero el miedo tira de ella. Las capas bajas son un laberinto de tuberías y vapor.',
      pasos: [
        { narr:'Se mete en un mercado nocturno abarrotado. Puedes abrirte paso a empujones o seguirla por encima de los puestos.',
          opciones:[
            { txt:'Bordear el gentío por los tejados de los puestos', bueno:true, msg:'Saltas de toldo en toldo y le ganas la salida del mercado. Se topa contigo de frente.' },
            { txt:'Empujar entre la multitud', bueno:false, msg:'La gente te frena, gritan, y ella se cuela entre los cuerpos. La pierdes un tramo.' }
          ] },
        { narr:'Un acceso de su enfermedad la hace trastabillar junto a un canal de aguas tóxicas. Vacila al borde.',
          opciones:[
            { txt:'Acercarte despacio, sin asustarla', bueno:true, msg:'Levantas las manos, hablas bajo. Se queda quieta al borde, temblando, y te deja llegar.' },
            { txt:'Lanzarte a agarrarla antes de que caiga', bueno:false, msg:'Tu carrera la asusta más; se aparta, resbala y casi cae al canal. Recuperarla os cuesta a los dos un susto y tiempo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Ileen está delante de ti, agotada y lúcida a la vez. Antes de decidir, escúchala de verdad. Lee a la doctora.',
      frases: [
        { txt:'"El implante que llevo me está matando a mí para que ellos no tengan que admitir que mata. Es la única copia de esa verdad."',
          lecturas:[
            { txt:'Dramatiza para que la dejes ir', correcta:false },
            { txt:'Dice la verdad: es prueba y víctima a la vez', correcta:true },
            { txt:'Quiere que destruyas tú el implante por ella', correcta:false }
          ] },
        { txt:'"No me importa morir. Me importa que no lo vendan a diez mil más. Si entregas esto, los entierras a todos conmigo."',
          lecturas:[
            { txt:'Es fanatismo, ha perdido el juicio', correcta:false },
            { txt:'Es una científica calculando un daño real y enorme', correcta:true },
            { txt:'Manipula tu culpa para escapar', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Ileen te ha enseñado los informes: prueban que HELIX vendería un implante que mata despacio. Le quedan, dice, meses de lucidez. "Tú sabrás." ¿Qué haces?',
      opciones: [
        { txt:'Entregarla a HELIX (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:12, disociacion:14,
          narr:'La entregas en un punto de recogida limpio donde dos técnicos la reciben como a un paquete frágil: les importa el implante, no la mujer. Cobras una fortuna. HELIX te marca como fiable, y eso aquí vale más que el dinero. Antes de subir al transporte, Ileen te dice: "Espero que te dure el sueño más que a mí la cabeza." No te dura.' },
        { txt:'Entregar el implante, pero filtrar a la prensa', tipo:'pacto', pagaMult:0.7, rep:3, repAlt:{faccion:'archivistas',val:10}, disociacion:6,
          narr:'Entregas a Ileen, porque no hacerlo es suicida, pero antes filtras copia de los informes a los Archivistas, que viven de lo que HELIX entierra. Cobras casi todo. HELIX cree haber ganado. Pero en algún nodo una verdad empieza a circular, y puede que dentro de un año ese implante no llegue a venderse. Ileen no lo sabrá. Tú sí. Tendrá que bastarte.' },
        { txt:'Dejarla escapar con su prueba', tipo:'soltar', pagaMult:0.0, rep:-12, disociacion:-6, requierePulso:true,
          narr:'La ayudas a desaparecer antes de que HELIX cierre el cerco. No cobras, y desafiar a HELIX en una recuperación de activos es lo que te pone a ti en el siguiente cartel. Ileen se va con su bomba de relojería en la cabeza y la única prueba que puede pararla. "Gracias", dice, la primera persona en mucho tiempo que te lo dice de verdad. Quizá la última. Duermes en paz, mirando la puerta.' }
      ]
    }
  }
];

const CONTRATOS_POR_ID = {};
CONTRATOS_CAZA.forEach(c => { CONTRATOS_POR_ID[c.id] = c; });

// ============================================================
//  ABRIR / PINTAR EL TABLÓN
// ============================================================
function abrirContratos(volverA){
  _contratoVolverA = volverA || 'apartamento';
  if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _contratoVolverA;
  if(typeof cambiarEscena === 'function'){
    cambiarEscena(idDesde, 'caza-escena');
  } else {
    if(desde) desde.classList.remove('activa');
    const e = document.getElementById('caza-escena');
    if(e) e.classList.add('activa');
  }
  if(_contratoActivo) _pintarFaseContrato();
  else { _cazaFX('panel_abrir', 0.5); _pintarTablonCaza(); }
  return true;
}

function _pintarTablonCaza(){
  const cont = document.getElementById('caza-wrap');
  if(!cont) return;
  const rango = (typeof rangoActualProfesion === 'function') ? rangoActualProfesion(CAZA_PROF_ID) : 0;
  let html = '<div class="casos-cab"><div class="casos-titulo">TABLÓN DE ENCARGOS</div>'
    + '<div class="casos-sub">Alguien pone precio a una cabeza. Tú decides si la cobras.</div></div>';
  html += '<div class="casos-lista">';
  const ordenados = CONTRATOS_CAZA.slice().sort((a, b) =>
       (a.rangoMin || 0) - (b.rangoMin || 0)
    || (a.peligro  || 0) - (b.peligro  || 0)
    || (a.pagaBase || 0) - (b.pagaBase || 0)
  );
  ordenados.forEach(c => {
    const bloqueadoRango = (c.rangoMin || 0) > rango;
    const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
    const yaHecho = _contratoHecho(c.id);
    let estado = yaHecho ? '<span class="casos-hecho">CERRADO</span>' : '';
    html += '<div class="caso-card' + (bloqueadoRango ? ' caso-bloq' : '') + '">'
      + '<div class="caso-card-top"><span class="caso-titulo">' + c.titulo + '</span>' + estado + '</div>'
      + '<div class="caso-contratante">' + c.contratante + '</div>'
      + '<div class="caso-resumen">' + c.resumen + '</div>'
      + '<div class="caso-meta"><span class="caso-peligro">PELIGRO ' + peligro + '</span>'
      + '<span class="caso-paga">≈ ' + (c.pagaBase || 0) + ' CR</span></div>';
    if(bloqueadoRango){
      html += '<div class="caso-nota">Requiere más reputación como cazarrecompensas.</div>';
    } else if(yaHecho){
      html += '<div class="caso-nota">Ya cerraste este contrato.</div>';
    } else {
      html += '<button class="btn-terminal caso-aceptar" onclick="aceptarContrato(\'' + c.id + '\')">ACEPTAR ENCARGO →</button>';
    }
    html += '</div>';
  });
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="cerrarContratos()">← SALIR DEL TABLÓN</button>';
  cont.innerHTML = html;
}

function _contratoHecho(id){
  return !!(Estado.memoria && Estado.memoria.contratosHechos && Estado.memoria.contratosHechos[id]);
}
function _marcarContratoHecho(id){
  Estado.memoria = Estado.memoria || {};
  Estado.memoria.contratosHechos = Estado.memoria.contratosHechos || {};
  Estado.memoria.contratosHechos[id] = true;
}

// ============================================================
//  ACEPTAR Y RECORRER
// ============================================================
function aceptarContrato(id){
  const c = CONTRATOS_POR_ID[id];
  if(!c) return;
  _cazaFX('inv_papel', 0.55);
  _contratoActivo = c;
  _contratoFase = 'abordaje';
  _contratoAbordajeOk = null;
  _persecPaso = 0; _persecFallos = 0;
  _pulsoPaso = 0; _pulsoAciertos = 0;
  _pintarFaseContrato();
}

function _pintarFaseContrato(){
  if(_contratoFase === 'abordaje') _pintarAbordaje();
  else if(_contratoFase === 'persecucion') _pintarPersecucion();
  else if(_contratoFase === 'pulso') _pintarPulso();
  else _pintarDecision();
}

// ── FASE 1: ABORDAJE (opciones según equipo) ─────────────────
function _pintarAbordaje(){
  const cont = document.getElementById('caza-wrap');
  if(!cont || !_contratoActivo) return;
  const c = _contratoActivo;
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">ABORDAJE</span></div>';
  html += '<div class="caza-objetivo"><div class="caza-objetivo-tit">OBJETIVO</div>'
    + '<div class="caza-objetivo-nombre">' + c.objetivo.nombre + '</div>'
    + '<div class="caza-objetivo-ctx">' + c.objetivo.contexto + '</div></div>';
  html += '<div class="caso-narr">' + c.abordaje.intro + '</div>';
  c.abordaje.opciones.forEach((op, i) => {
    const requiere = op.requiereItem;
    const bloqueada = requiere && !_cazaLleva(requiere);
    if(bloqueada){
      html += '<button class="opcion-btn ded-op caza-bloq" disabled>' + op.txt
        + '<span class="caza-lock"> · necesitas ' + _cazaNombreItem(requiere) + '</span></button>';
    } else {
      html += '<button class="opcion-btn ded-op" onclick="resolverAbordaje(' + i + ')">' + op.txt
        + ' <span class="caza-prob">· ' + Math.round((op.prob||0.5) * 100) + '%</span></button>';
    }
  });
  html += '<button class="opcion-btn ded-volver" onclick="abandonarContrato()">← Dejar el encargo</button>';
  cont.innerHTML = html;
}

function resolverAbordaje(idx){
  const c = _contratoActivo;
  const op = c.abordaje.opciones[idx];
  if(!op) return;
  if(op.requiereItem && !_cazaLleva(op.requiereItem)) return; // guardia
  const exito = Math.random() < (op.prob || 0.5);
  _contratoAbordajeOk = exito;
  const res = exito ? op.exito : op.fallo;
  _cazaAplicarCostes(res);
  _cazaFX(exito ? 'inv_acierto' : 'inv_fallo', 0.5);

  const cont = document.getElementById('caza-wrap');
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">' + (exito ? 'ABORDAJE LIMPIO' : 'SE TE ESCAPA') + '</span></div>';
  html += '<div class="caso-narr">' + res.msg + '</div>';
  if(!exito && res.huye && c.persecucion){
    html += '<button class="btn-terminal" onclick="iniciarPersecucion()">PERSEGUIRLO →</button>';
  } else {
    html += '<button class="btn-terminal" onclick="iniciarPulso()">TENERLO DELANTE →</button>';
  }
  cont.innerHTML = html;
  if(typeof guardarPartida === 'function') guardarPartida();
}

function _cazaAplicarCostes(res){
  if(!res) return;
  Estado.humano = Estado.humano || {};
  if(typeof res.fatiga === 'number') Estado.humano.fatiga = Math.min(100, (Estado.humano.fatiga || 0) + res.fatiga);
  if(typeof res.disociacion === 'number') Estado.humano.disociacion = Math.min(100, Math.max(0, (Estado.humano.disociacion || 0) + res.disociacion));
  if(res.herida && typeof aplicarCondicion === 'function'){ try { aplicarCondicion(res.herida); } catch(e){} }
  if(typeof actualizarHUD === 'function') actualizarHUD();
}

// ── FASE 2: PERSECUCIÓN ──────────────────────────────────────
function iniciarPersecucion(){
  _contratoFase = 'persecucion';
  _persecPaso = 0; _persecFallos = 0;
  _cazaFX('inv_deduccion', 0.4);
  _pintarPersecucion();
}

function _pintarPersecucion(){
  const cont = document.getElementById('caza-wrap');
  if(!cont || !_contratoActivo) return;
  const c = _contratoActivo;
  const pasos = c.persecucion.pasos;
  if(_persecPaso >= pasos.length){ _finPersecucion(); return; }
  const paso = pasos[_persecPaso];
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">PERSECUCIÓN ' + (_persecPaso+1) + '/' + pasos.length + '</span></div>';
  if(_persecPaso === 0) html += '<div class="caso-narr">' + c.persecucion.intro + '</div>';
  html += '<div class="caso-narr">' + paso.narr + '</div>';
  paso.opciones.forEach((op, i) => {
    html += '<button class="opcion-btn ded-op" onclick="resolverPersecucion(' + i + ')">' + op.txt + '</button>';
  });
  cont.innerHTML = html;
}

function resolverPersecucion(idx){
  const c = _contratoActivo;
  const paso = c.persecucion.pasos[_persecPaso];
  const op = paso.opciones[idx];
  if(!op) return;
  // La fatiga alta penaliza: si vas muy cansado, una buena decisión puede
  // fallar igual (el cuerpo no responde).
  const fatiga = (Estado.humano && Estado.humano.fatiga) || 0;
  let bien = !!op.bueno;
  if(bien && fatiga >= 70 && Math.random() < 0.35) bien = false; // agotado
  if(!bien) _persecFallos++;
  _cazaFX(bien ? 'inv_acierto' : 'inv_fallo', 0.4);

  const cont = document.getElementById('caza-wrap');
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">PERSECUCIÓN</span></div>';
  html += '<div class="caso-narr">' + op.msg + (bien ? '' : (fatiga>=70 ? ' El agotamiento te pasa factura.' : '')) + '</div>';
  _persecPaso++;
  html += '<button class="btn-terminal" onclick="_pintarPersecucionPaso()">SEGUIR →</button>';
  cont.innerHTML = html;
  if(typeof guardarPartida === 'function') guardarPartida();
}
function _pintarPersecucionPaso(){ _pintarPersecucion(); }

function _finPersecucion(){
  const c = _contratoActivo;
  const cont = document.getElementById('caza-wrap');
  // Si fallaste los dos pasos, escapa. Con uno o cero, lo atrapas.
  const escapa = _persecFallos >= 2;
  if(escapa){
    _marcarContratoHecho(c.id); // el contrato se cierra como fallido
    let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
      + '<span class="caso-hud-pistas">ESCAPÓ</span></div>';
    html += '<div class="caso-desenlace"><div class="caso-narr">Lo pierdes entre la lluvia y el metal. '
      + 'Cuando recuperas el aliento, ya no hay rastro. El contrato se enfría: nadie paga por un objetivo que se escapó. '
      + 'Vuelves con las manos vacías y el orgullo magullado. En este oficio, a veces, el que corre más asustado corre más rápido.</div>';
    html += '<div class="caso-recompensa"><div>PAGA: 0 CR</div></div></div>';
    html += '<button class="btn-terminal" onclick="cerrarContratoResuelto()">CERRAR ENCARGO →</button>';
    cont.innerHTML = html;
    _cazaFX('inv_fallo', 0.55);
    if(typeof guardarPartida === 'function') guardarPartida();
  } else {
    // Lo atrapas tras la persecución (cuenta como abordaje "sucio").
    _contratoAbordajeOk = false;
    let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
      + '<span class="caso-hud-pistas">ALCANZADO</span></div>';
    html += '<div class="caso-narr">Lo acorralas por fin, los dos sin aliento. No hay más a dónde correr. '
      + 'Lo tienes delante, jadeando, a tu merced.</div>';
    html += '<button class="btn-terminal" onclick="iniciarPulso()">TENERLO DELANTE →</button>';
    cont.innerHTML = html;
    _cazaFX('inv_acierto', 0.5);
  }
}

// ── FASE 3: EL PULSO (leer al objetivo) ──────────────────────
function iniciarPulso(){
  _contratoFase = 'pulso';
  _pulsoPaso = 0; _pulsoAciertos = 0;
  _cazaFX('inv_deduccion', 0.45);
  _pintarPulso();
}

function _pintarPulso(){
  const cont = document.getElementById('caza-wrap');
  if(!cont || !_contratoActivo) return;
  const c = _contratoActivo;
  if(!c.pulso){ pasarADecision(); return; }
  const frases = c.pulso.frases;
  if(_pulsoPaso >= frases.length){ pasarADecision(); return; }
  const fr = frases[_pulsoPaso];
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">EL PULSO ' + (_pulsoPaso+1) + '/' + frases.length + '</span></div>';
  if(_pulsoPaso === 0) html += '<div class="caso-narr">' + c.pulso.intro + '</div>';
  html += '<div class="caza-frase">' + fr.txt + '</div>';
  html += '<div class="muro-instr">¿Cómo lo lees?</div>';
  fr.lecturas.forEach((lec, i) => {
    html += '<button class="opcion-btn ded-op" onclick="resolverPulso(' + i + ')">' + lec.txt + '</button>';
  });
  cont.innerHTML = html;
}

function resolverPulso(idx){
  const c = _contratoActivo;
  const fr = c.pulso.frases[_pulsoPaso];
  const lec = fr.lecturas[idx];
  if(!lec) return;
  if(lec.correcta) _pulsoAciertos++;
  _cazaFX(lec.correcta ? 'inv_acierto' : 'inv_fallo', 0.4);
  _pulsoPaso++;
  _pintarPulso();
}

// ── FASE 4: DECISIÓN ─────────────────────────────────────────
function pasarADecision(){
  _contratoFase = 'decision';
  _pintarDecision();
}

function _leisteBien(){
  // "Leíste bien" si acertaste al menos la mayoría de las frases del pulso.
  if(!_contratoActivo || !_contratoActivo.pulso) return true;
  const total = _contratoActivo.pulso.frases.length;
  return _pulsoAciertos >= Math.ceil(total / 2);
}

function _pintarDecision(){
  const cont = document.getElementById('caza-wrap');
  if(!cont || !_contratoActivo) return;
  const c = _contratoActivo;
  const leiBien = _leisteBien();
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">DECISIÓN' + (c.pulso ? (' · PULSO ' + _pulsoAciertos + '/' + c.pulso.frases.length) : '') + '</span></div>';
  html += '<div class="caso-narr">' + c.decision.intro + '</div>';
  if(!leiBien){
    html += '<div class="muro-instr">No has acabado de leer a esta persona. Algunas salidas solo se ven cuando de verdad entiendes a quién tienes delante.</div>';
  }
  c.decision.opciones.forEach((op, i) => {
    // Opción que requiere haber leído bien el pulso: oculta si no.
    if(op.requierePulso && !leiBien) return;
    let etiqueta = '';
    if(op.tipo === 'soltar') etiqueta = '<span class="caza-tag-soltar">SOLTAR</span>';
    else if(op.tipo === 'muerto') etiqueta = '<span class="caza-tag-muerto">ENTREGAR MUERTO</span>';
    else if(op.tipo === 'pacto') etiqueta = '<span class="caza-tag-pacto">PACTAR</span>';
    else etiqueta = '<span class="caza-tag-vivo">ENTREGAR VIVO</span>';
    let nota = (typeof op.coste === 'number') ? ' <span class="caza-prob">(-' + op.coste + ' CR)</span>' : '';
    html += '<button class="opcion-btn ded-op caza-decision" onclick="resolverContrato(' + i + ')">'
      + etiqueta + ' ' + op.txt + nota + '</button>';
  });
  html += '<button class="opcion-btn ded-volver" onclick="abandonarContrato()">← Dejar el encargo</button>';
  cont.innerHTML = html;
}

function resolverContrato(idx){
  const c = _contratoActivo;
  const op = c.decision.opciones[idx];
  if(!op) return;
  if(op.requierePulso && !_leisteBien()) return; // guardia

  if(typeof op.coste === 'number' && typeof Estado.creditos === 'number'){
    Estado.creditos = Math.max(0, Estado.creditos - op.coste);
  }
  const factorAbordaje = (_contratoAbordajeOk === false) ? 0.85 : 1.0;
  const paga = Math.round((c.pagaBase || 0) * (op.pagaMult || 0) * factorAbordaje);
  const progreso = (op.pagaMult >= 1.0) ? (c.progreso || 0)
                 : (op.pagaMult > 0) ? Math.round((c.progreso || 0) * 0.6)
                 : Math.round((c.progreso || 0) * 0.25);

  _cazaAplicarCostes({ disociacion: op.disociacion });

  let ascenso = null;
  if(typeof otorgarRecompensaProfesion === 'function'){
    const r = otorgarRecompensaProfesion(CAZA_PROF_ID, paga, progreso);
    if(r && r.ascendio) ascenso = r.rangoNuevo;
  }
  if(typeof op.rep === 'number' && c.faccion && typeof cambiarRepFaccion === 'function'){
    cambiarRepFaccion(c.faccion, op.rep);
  }
  if(op.repAlt && typeof cambiarRepFaccion === 'function'){
    cambiarRepFaccion(op.repAlt.faccion, op.repAlt.val);
  }
  if(op.item && typeof darItemPorId === 'function'){ try { darItemPorId(op.item); } catch(e){} }
  _marcarContratoHecho(c.id);

  // Eco en las noticias (sutil casi siempre; soltar/HELIX más directo).
  // Persistente: dura hasta que lo leas en el terminal.
  if(typeof marcarEcoProfesion === 'function'){
    if(op.tipo === 'soltar'){ marcarEcoProfesion('caza_soltado'); }
    else if(c.faccion === 'loto'){ marcarEcoProfesion('caza_loto'); }
    else if(c.faccion === 'sindicatos'){ marcarEcoProfesion('caza_ferro'); }
    else if(c.faccion === 'helix'){ marcarEcoProfesion('caza_helix'); }
  }

  _cazaFX(op.tipo === 'soltar' ? 'inv_acierto' : 'inv_fallo', 0.5);

  const cont = document.getElementById('caza-wrap');
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">CERRADO</span></div>';
  html += '<div class="caso-desenlace' + (op.malo ? ' caso-desenlace-malo' : '') + '">'
    + '<div class="caso-narr">' + op.narr + '</div>';
  html += '<div class="caso-recompensa"><div>PAGA: ' + paga + ' CR</div>';
  if(ascenso) html += '<div class="caso-ascenso">ASCENSO · ' + ascenso + '</div>';
  html += '</div></div>';
  html += '<button class="btn-terminal" onclick="cerrarContratoResuelto()">CERRAR ENCARGO →</button>';
  cont.innerHTML = html;
  if(typeof guardarPartida === 'function') guardarPartida();
}

function abandonarContrato(){
  _contratoActivo = null; _contratoFase = 'abordaje';
  _pintarTablonCaza();
}
function cerrarContratoResuelto(){
  _contratoActivo = null; _contratoFase = 'abordaje';
  _pintarTablonCaza();
}

// ============================================================
//  SALIR
// ============================================================
function cerrarContratos(){
  _cazaFX('terminal_cerrar', 0.45);
  const destino = _contratoVolverA || 'apartamento';
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('caza-escena', destino);
  } else {
    const e = document.getElementById('caza-escena');
    if(e) e.classList.remove('activa');
    const d = document.getElementById(destino);
    if(d) d.classList.add('activa');
  }
}

// Exports
if(typeof window !== 'undefined'){
  window.abrirContratos = abrirContratos;
  window.aceptarContrato = aceptarContrato;
  window.resolverAbordaje = resolverAbordaje;
  window.iniciarPersecucion = iniciarPersecucion;
  window.resolverPersecucion = resolverPersecucion;
  window._pintarPersecucionPaso = _pintarPersecucionPaso;
  window.iniciarPulso = iniciarPulso;
  window.resolverPulso = resolverPulso;
  window.pasarADecision = pasarADecision;
  window.resolverContrato = resolverContrato;
  window.abandonarContrato = abandonarContrato;
  window.cerrarContratoResuelto = cerrarContratoResuelto;
  window.cerrarContratos = cerrarContratos;
}
