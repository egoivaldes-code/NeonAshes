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
  },
  // ── CONTRATO 4 — SIN FACCIÓN (un particular) ──────────────
  {
    id: 'crio_que_vio',
    titulo: 'EL CRÍO QUE VIO DEMASIADO',
    contratante: 'Particular · una madre sin nombre',
    faccion: '',
    peligro: 1,
    pagaBase: 150,
    progreso: 80,
    rangoMin: 0,
    resumen: 'Una mujer te paga lo poco que tiene para encontrar a su hijo de doce años, que huyó tras presenciar algo en un callejón. No quiere castigarlo. Quiere que vuelva antes de que lo encuentre quien no debe.',
    objetivo: {
      nombre: 'Tobi, 12 años',
      contexto: 'Vio a unos hombres del Loto deshacerse de un cuerpo y echó a correr. Lleva tres días escondido, muerto de miedo, convencido de que si vuelve a casa los traerá con él. No huye de su madre: huye para protegerla.'
    },
    abordaje: {
      intro: 'Encuentras a Tobi acurrucado en el hueco de un montacargas averiado, abrazado a las rodillas. Es pequeño para su edad, los ojos enormes de no dormir. En cuanto nota una sombra, se tensa como un animal. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Hablarle bajo, sin acercarte', via:'labia', prob:0.85,
          exito:{ msg:'Te agachas a su altura y le hablas como a una persona, no como a una presa. "Tu madre me manda. Está bien. Solo quiere que vuelvas." Tarda, pero los hombros se le aflojan un poco.' },
          fallo:{ msg:'Tu sombra lo asusta antes de que hables. Sale disparado por el hueco del montacargas.', huye:true } },
        { txt:'[COMIDA] Ofrecerle una ración antes de hablar', via:'trampa', prob:0.95, requiereItem:'racion_deshidratada',
          exito:{ msg:'Le tiendes una ración sin decir nada. El hambre puede más que el miedo: la coge, come con las dos manos, y mientras mastica deja que te acerques. A veces lo que desarma a un crío no son las palabras.', disociacion:-2 },
          fallo:{ msg:'Le tiendes la comida pero el gesto brusco lo espanta; sale corriendo dejándola en el suelo.', huye:true } },
        { txt:'[FUERZA] Agarrarlo antes de que reaccione', via:'fuerza', prob:0.9,
          exito:{ msg:'Lo sujetas por el brazo. Es tan ligero que casi te da vergüenza la facilidad. Patalea un segundo y luego se queda quieto, rendido, como quien ya esperaba que lo cazaran.', disociacion:5 },
          fallo:{ msg:'Se te escurre como una anguila entre las cajas y echa a correr.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Tobi corre como solo corre un niño que conoce cada rincón donde esconderse. Es rápido, pero está agotado y hambriento.',
      pasos: [
        { narr:'Se cuela por una rejilla de ventilación demasiado estrecha para un adulto. Puedes seguir el conducto por fuera o esperar a la otra salida.',
          opciones:[
            { txt:'Calcular dónde sale y esperarlo', bueno:true, msg:'Conoces estos conductos. Le sales al otro extremo justo cuando asoma la cabeza.' },
            { txt:'Seguir el conducto golpeando para asustarlo', bueno:false, msg:'Lo asustas más y acelera; se te adelanta dos salidas.' }
          ] },
        { narr:'Sale a una pasarela sobre un patio de luces. Duda, mirando el vacío. Está agotado.',
          opciones:[
            { txt:'Acercarte despacio, con las manos a la vista', bueno:true, msg:'Levantas las manos y le hablas. Se queda quieto en la pasarela, temblando, sin fuerzas para más.' },
            { txt:'Correr a agarrarlo antes de que salte', bueno:false, msg:'Tu carrera lo asusta y casi resbala de la pasarela. Recuperarlo os cuesta un susto enorme a los dos.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Tobi está delante de ti, agotado, sin más sitio a donde correr. Antes de decidir qué haces con él, míralo de verdad. Lee al crío.',
      frases: [
        { txt:'"No puedo volver a casa. Si vuelvo, me siguen, y le hacen daño a mi madre. Por eso me fui. ¿No lo entiende?"',
          lecturas:[
            { txt:'Inventa una excusa para que no lo lleves', correcta:false },
            { txt:'Huyó para PROTEGER a su madre, no por miedo a ella', correcta:true },
            { txt:'Está confuso y no sabe lo que dice', correcta:false }
          ] },
        { txt:'"Vi lo que hicieron con aquel hombre. Si saben que lo vi, soy el siguiente. Y mi madre también."',
          lecturas:[
            { txt:'Exagera lo que vio para dar pena', correcta:false },
            { txt:'Es un testigo real y el peligro que teme es cierto', correcta:true },
            { txt:'Confunde una película con la realidad', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Tobi te mira con los ojos de quien ya ha decidido que el mundo no es de fiar. Su madre te paga por devolvérselo. Pero el crío vio algo del Loto, y devolverlo a casa sin más podría traer a esos hombres tras él. ¿Qué haces?',
      opciones: [
        { txt:'Devolverlo a su madre sin más (cobrar)', tipo:'vivo', pagaMult:1.0, rep:3, disociacion:4,
          narr:'Lo llevas a casa. Su madre lo abraza llorando y te paga lo prometido, que es casi nada y es todo lo que tiene. Cumpliste el encargo. Pero al irte ves a Tobi mirar la puerta por encima del hombro de su madre, y entiendes que le has devuelto el cuerpo a su casa sin quitarle de encima lo que lo perseguía. Esperas, sin creértelo del todo, que los hombres del Loto tengan mala memoria.' },
        { txt:'Devolverlo y avisar a la madre del peligro', tipo:'pacto', pagaMult:0.8, rep:4, disociacion:-2, requierePulso:true,
          narr:'Lo llevas a casa, pero antes hablas a solas con la madre: le cuentas lo que el crío vio, que quizá tengan que irse del sector una temporada, que no es paranoia del niño. Ella escucha con la cara descompuesta y asiente. Cobras un poco menos por el tiempo que pierdes en avisarla, pero te vas sabiendo que al menos saben de qué esconderse. Tobi te mira distinto al salir: como a alguien que, por una vez, le creyó.' },
        { txt:'No entregarlo: ayudarle a esconderse mejor', tipo:'soltar', pagaMult:0.0, rep:-3, disociacion:-4, requierePulso:true,
          narr:'No lo devuelves. Le buscas un sitio más seguro que el hueco de un montacargas y le haces llegar a la madre un mensaje de que su hijo vive y volverá cuando se pueda. No cobras, y una madre llorará esta noche sin entender por qué no le traes a su niño. Pero Tobi no acabará en un callejón con la misma suerte que el hombre que vio. Algunas deudas se pagan en culpa, no en créditos. Esta la pagas tú.' }
      ]
    }
  },
  // ── CONTRATO 5 — LOTO (cobradora arrepentida) ─────────────
  {
    id: 'cobradora_arrepentida',
    titulo: 'LA QUE SE QUEDÓ CON LA CAJA',
    contratante: 'El Loto Carmesí · Mano Roja',
    faccion: 'loto',
    peligro: 2,
    pagaBase: 300,
    progreso: 130,
    rangoMin: 1,
    resumen: 'Una cobradora del propio Loto, Reni, desapareció con la recaudación de una semana. La Mano Roja la quiere de vuelta, con el dinero y con un ejemplo que dar. Tú decides qué clase de ejemplo.',
    objetivo: {
      nombre: 'Reni Calderón, excobradora del Loto',
      contexto: 'Llevaba años cobrando deudas ajenas hasta que le tocó arruinar a una familia que le recordó a la suya. Se quedó la caja y huyó, no para enriquecerse, sino para devolver el dinero a quienes se lo había sacado. Lleva media caja ya repartida.'
    },
    abordaje: {
      intro: 'Localizas a Reni en un cuartucho del Arrabal, contando fajos y anotando nombres en una libreta. No huye con el dinero: lo está devolviendo, casa por casa. Lleva una pistola al cinto, pero no la toca. ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Preguntarle qué hace con el dinero', via:'labia', prob:0.8,
          exito:{ msg:'Levanta la vista de la libreta, cansada. "¿Me manda la Roja? Claro. Siéntate. Antes de llevarme, mira esto." Te enseña la libreta: nombres, cantidades, deudas que está deshaciendo una a una.' },
          fallo:{ msg:'Se sobresalta, agarra la caja y sale por la ventana al andamiaje exterior.', huye:true } },
        { txt:'[ARMA] Desarmarla antes de que llegue a su pistola', via:'fuerza', prob:0.9, requiereItem:'arma_blanca',
          exito:{ msg:'Le pones el filo cerca antes de que su mano roce el cinto. No forcejea. "Rápido. Profesional." Aparta la mano del arma. "Al menos escucha por qué lo hice, ya que vas a llevarme."', disociacion:4 },
          fallo:{ msg:'Calcula tu intención y se descuelga por la ventana antes de que la alcances.', huye:true } },
        { txt:'[SIGILO] Entrar mientras está absorta contando', via:'sigilo', prob:0.65,
          exito:{ msg:'Está tan concentrada en sus cuentas que te plantas a su lado sin que lo note. Cuando levanta la cabeza, ya es tarde para correr. Suspira, casi aliviada de que se acabe la huida.' },
          fallo:{ msg:'Una tabla cruje. Reni reacciona rápido, vuelca la mesa y salta a los andamios.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Reni conoce los andamios del Arrabal de sus años cobrando puerta a puerta. Corre con la caja a cuestas, lo que la frena.',
      pasos: [
        { narr:'Salta entre andamios sobre un callejón. Puedes seguirla saltando o bajar a cortarle la única escalera.',
          opciones:[
            { txt:'Bajar a bloquear su escalera de salida', bueno:true, msg:'Le cortas la única bajada. Se queda atrapada en el andamio, sin ruta.' },
            { txt:'Saltar tras ella de andamio en andamio', bueno:false, msg:'El peso de la caja la hace más ágil de lo que esperas en lo alto; te saca ventaja.' }
          ] },
        { narr:'Se mete en un mercadillo cubierto, lleno de telas colgadas. Puede perderse entre ellas.',
          opciones:[
            { txt:'Quedarte quieto y mirar el movimiento de las telas', bueno:true, msg:'Las telas delatan su rastro. La interceptas entre dos puestos.' },
            { txt:'Apartar telas a manotazos buscándola', bueno:false, msg:'Te enredas entre la tela mientras ella se escabulle al fondo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Reni está acorralada, la caja contra el pecho. Antes de decidir, escúchala. Lee a la cobradora.',
      frases: [
        { txt:'"No me quedé el dinero. Lo estoy devolviendo. A la gente a la que se lo saqué con estas manos durante diez años."',
          lecturas:[
            { txt:'Miente: nadie devuelve dinero robado', correcta:false },
            { txt:'Dice la verdad; la libreta lo confirma', correcta:true },
            { txt:'Se justifica para que la dejes ir', correcta:false }
          ] },
        { txt:'"Llévame con la Roja si quieres. Pero deja que termine de repartir lo que queda. Esas familias no tienen la culpa de mi conciencia."',
          lecturas:[
            { txt:'Es una treta para escapar con el resto', correcta:false },
            { txt:'Ha asumido su final; solo le importa terminar', correcta:true },
            { txt:'Intenta comprarte con palabras bonitas', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Reni tiene media caja repartida y media por repartir, y una libreta con cada nombre. La Mano Roja quiere el dinero y un escarmiento. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Reni y la caja al Loto (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:9, disociacion:9,
          narr:'La entregas con lo que queda de la caja. La Mano Roja sonríe: "Buen trabajo. De esto se aprende." Lo que le hagan a Reni servirá de ejemplo para los próximos diez años de cobradores. Las familias que ella estaba devolviendo no recuperarán lo demás. Cobras completo y el Loto te respeta. Esa libreta llena de nombres acaba en la basura.' },
        { txt:'Entregar a Reni pero "perder" la libreta', tipo:'pacto', pagaMult:0.7, rep:5, disociacion:4, requierePulso:true,
          narr:'Entregas a Reni y la caja, pero la libreta con los nombres se te "cae" por una alcantarilla de camino. El Loto recupera su dinero y su escarmiento, pero no la lista de a quién había devuelto qué, así que esas familias no figuran como deudoras de nuevo. Cobras algo menos. Reni te mira al entregarla, ve lo que hiciste con la libreta, y asiente una vez. No es perdón. Es entendimiento.' },
        { txt:'Dejarla terminar de repartir y desaparecer', tipo:'soltar', pagaMult:0.0, rep:-7, disociacion:-5, requierePulso:true,
          narr:'Le das una hora para terminar su reparto y le dices que se esfume del sector. No cobras, y la Mano Roja sabrá que dejaste escapar a una ladrona con su dinero: mal asunto con el Loto. Pero Reni termina de deshacer diez años de deudas ajenas y desaparece, y por una noche el Arrabal pesa un poco menos sobre unas cuantas familias. Has tirado una buena paga por la conciencia de otra persona. Y dormirás bien.' }
      ]
    }
  },
  // ── CONTRATO 6 — FERRO (desertor) ─────────────────────────
  {
    id: 'desertor_turno_noche',
    titulo: 'EL DESERTOR DEL TURNO DE NOCHE',
    contratante: 'Sindicato Ferro · capataz de muelle',
    faccion: 'sindicatos',
    peligro: 2,
    pagaBase: 260,
    progreso: 120,
    rangoMin: 1,
    resumen: 'Un estibador del Ferro, Holt, dejó de presentarse al turno tras saldar de golpe una deuda de juego imposible. El Sindicato huele que el dinero salió de su propia mercancía y lo quiere de vuelta para "hablar".',
    objetivo: {
      nombre: 'Holt Drennan, estibador',
      contexto: 'Debía a una casa de apuestas más de lo que ganaría en cinco años. Para salvar a su hija de que la deuda recayera en ella, desvió un cargamento del Ferro y lo vendió. Sabe que está muerto si lo cogen. Solo intenta dejar a su hija lejos antes de que pase.'
    },
    abordaje: {
      intro: 'Encuentras a Holt en una pensión de mala muerte, metiendo las cosas de una niña en una bolsa. Hay una cama pequeña, dibujos pegados a la pared. No es la guarida de un ladrón: es la mudanza apurada de un padre. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Hablarle de la hija primero', via:'labia', prob:0.8,
          exito:{ msg:'Menciona a su hija y se le quiebra algo. "¿Te manda el Ferro? Llévame, pero deja que ella suba al transporte de las seis. Por favor." Se sienta en la cama pequeña, vencido.' },
          fallo:{ msg:'En cuanto oye "Ferro" coge a medias la bolsa y sale al pasillo de la pensión.', huye:true } },
        { txt:'[GANZÚA] Bloquearle la única salida antes de entrar', via:'sigilo', prob:0.9, requiereItem:'ganzua',
          exito:{ msg:'Con las ganzúas trabas el cierre de la puerta trasera de la pensión antes de entrar por la principal. Cuando Holt corre a la salida de atrás, no abre. Se vuelve hacia ti, derrotado. "Limpio. Eres bueno."', disociacion:3 },
          fallo:{ msg:'Tardas demasiado con el cierre y Holt te oye trastear; sale por la ventana al callejón.', huye:true } },
        { txt:'[FUERZA] Entrar y reducirlo de inmediato', via:'fuerza', prob:0.7,
          exito:{ msg:'Entras rápido y lo tienes contra la pared antes de que reaccione. No pelea; protege la bolsa de la niña con el cuerpo, no a sí mismo. "Vale. Me tienes. Ella no tiene nada que ver."', disociacion:3 },
          fallo:{ msg:'Es más fuerte de lo que parece un estibador cansado. Te empuja contra la cama y sale corriendo con la bolsa.', huye:true, fatiga:5 } }
      ]
    },
    persecucion: {
      intro: 'Holt corre cargando la bolsa de su hija, lo que le pesa, pero la desesperación de un padre tira fuerte. Conoce los muelles como la palma de su mano.',
      pasos: [
        { narr:'Se mete entre contenedores apilados del muelle. Puedes seguirlo por el laberinto o trepar a verlo desde arriba.',
          opciones:[
            { txt:'Trepar a un contenedor alto para localizarlo', bueno:true, msg:'Desde arriba ves su ruta entre los contenedores y le cortas el paso.' },
            { txt:'Seguirlo por el laberinto a ras de suelo', bueno:false, msg:'El laberinto de contenedores es suyo; te despista en dos giros.' }
          ] },
        { narr:'Llega al borde del muelle, donde un transporte está a punto de zarpar. Su hija ya está a bordo.',
          opciones:[
            { txt:'Pararte y dejar que la niña suba antes de actuar', bueno:true, msg:'Esperas a que el transporte con la niña se aleje. Holt, ya sin nada que proteger, deja de correr.' },
            { txt:'Placarlo antes de que llegue al transporte', bueno:false, msg:'Forcejeáis al borde del muelle a la vista de la niña, que grita desde la cubierta. Feo. Logras reducirlo, con mal cuerpo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Holt está reducido, mirando hacia donde se aleja el transporte. Antes de decidir, escúchalo. Lee al padre.',
      frases: [
        { txt:'"Robé al Ferro, sí. Para pagar una deuda que iba a caer sobre mi hija si yo faltaba. No me arrepiento de eso. De nada más."',
          lecturas:[
            { txt:'Se escuda en la hija para dar lástima', correcta:false },
            { txt:'Dice la verdad: lo hizo por ella, asumiendo el precio', correcta:true },
            { txt:'Miente sobre el motivo del robo', correcta:false }
          ] },
        { txt:'"Ya está a salvo, lejos. Lo que me hagáis ahora me da igual. Hice lo único que un padre podía hacer."',
          lecturas:[
            { txt:'Finge resignación para que bajes la guardia', correcta:false },
            { txt:'Ha terminado su única misión y ya no teme nada', correcta:true },
            { txt:'Prepara un último intento de fuga', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Holt ya ha puesto a su hija a salvo en el transporte. El Ferro lo quiere de vuelta para "hablar", y todos sabéis lo que eso significa. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Holt al Ferro (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:9, disociacion:10,
          narr:'Lo entregas en el muelle. El capataz asiente y paga sin contar. A Holt se lo llevan a "hablar" y no vuelve a verse. Cobras completo y el Ferro te apunta como fiable. En algún sitio lejano, una niña esperará un padre que no va a bajar de ningún transporte, y nunca sabrá que tú lo pusiste en esa silla. El orden del Ferro siempre cobra sus deudas. Tú acabas de ser el cobrador.' },
        { txt:'Entregarlo, pero pasarle la paga a la niña', tipo:'pacto', pagaMult:0.4, rep:6, disociacion:5, requierePulso:true,
          narr:'Entregas a Holt, porque no hacerlo es jugarte el cuello con el Ferro. Pero rastreas el transporte de la niña y le haces llegar, anónima, casi toda tu paga. Cobras una miseria neta. Holt nunca lo sabrá, su hija tampoco entenderá de dónde salió ese sobre. Has cumplido el encargo y, con lo que te quedaba de humano, has intentado que el huérfano que creaste no pase hambre. No es redención. Es lo que se puede.' },
        { txt:'Dejarlo ir con su hija', tipo:'soltar', pagaMult:0.0, rep:-8, disociacion:-5, requierePulso:true,
          narr:'Le dices que corra al transporte antes de que zarpe. Llega de milagro, y por la borda ves a una niña abrazarse a su padre. No cobras, y el Ferro sabrá que dejaste escapar a un ladrón de su mercancía: un enemigo peligroso. Pero no has separado a un padre de su hija para que unos hombres de traje "hablen" con él. Vuelves con las manos vacías y algo intacto por dentro que vale más que la paga.' }
      ]
    }
  },
  // ── CONTRATO 7 — HELIX (donante reticente) ────────────────
  {
    id: 'donante_reticente',
    titulo: 'EL CONTRATO DE LA CARNE',
    contratante: 'HELIX · Cumplimiento de Contratos',
    faccion: 'helix',
    peligro: 3,
    pagaBase: 400,
    progreso: 150,
    rangoMin: 2,
    resumen: 'Un hombre firmó con HELIX la venta de un riñón a cambio de saldar sus deudas médicas. Cobró. Ahora que toca la extracción, ha desaparecido. HELIX te paga por llevarlo a quirófano. El contrato es legal. Eso no lo hace limpio.',
    objetivo: {
      nombre: 'Marek Dovern, deudor',
      contexto: 'Firmó la venta de un riñón cuando su mujer agonizaba y la única cura la pagaba HELIX. Ella murió igual, dos días después de firmar. Ahora HELIX viene a cobrarse la carne por una vida que ni siquiera se salvó. Marek no huye del bisturí: huye de morir por nada.'
    },
    abordaje: {
      intro: 'Encuentras a Marek en un taller abandonado, sentado en el suelo con la espalda contra la pared, mirando una foto. No parece un fugitivo: parece un hombre esperando. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Sentarte a su lado y escuchar', via:'labia', prob:0.8,
          exito:{ msg:'Te sientas en el suelo, a su altura. No huye. "Firmé por ella. Y se murió igual." Te enseña la foto: una mujer riendo. "Ahora me quieren abrir por una deuda de una vida que ya no existe. ¿Eso es legal? Pues será legal."' },
          fallo:{ msg:'Se levanta de golpe al verte de uniforme y sale por el fondo del taller.', huye:true } },
        { txt:'[CREDENCIAL] Identificarte como agente de HELIX', via:'trampa', prob:0.85, requiereItem:'papel_helix',
          exito:{ msg:'Le muestras la credencial. Se ríe sin ganas. "Claro. El sello que lo arregla todo." No corre; está demasiado cansado de huir de un papel. "Vamos, pues. A cumplir el contrato."', disociacion:4 },
          fallo:{ msg:'Ver el logo de HELIX en la credencial le da el empujón que necesitaba para salir corriendo.', huye:true } },
        { txt:'[FUERZA] Reducirlo antes de que escape', via:'fuerza', prob:0.75,
          exito:{ msg:'Lo inmovilizas contra la pared. Apenas se resiste; tiene el cuerpo de quien lleva semanas sin comer bien. "Para ti es un trabajo. Lo entiendo. Para mí es un riñón por una muerta."', disociacion:5 },
          fallo:{ msg:'La desesperación le da una fuerza que no esperabas y se zafa, volcando estanterías a tu paso.', huye:true, fatiga:5 } }
      ]
    },
    persecucion: {
      intro: 'Marek corre con la energía rabiosa del que no tiene nada que perder. El taller da a un dédalo de naves abandonadas.',
      pasos: [
        { narr:'Cruza una nave inundada de agua hasta las rodillas. Puedes vadear tras él o bordear por una pasarela elevada.',
          opciones:[
            { txt:'Bordear por la pasarela elevada', bueno:true, msg:'Avanzas seco y rápido por arriba mientras él chapotea abajo. Le ganas la salida.' },
            { txt:'Vadear el agua detrás de él', bueno:false, msg:'El agua te frena tanto como a él; mantiene la distancia y gana terreno al salir.' }
          ] },
        { narr:'Se encierra en una cámara frigorífica abandonada y atranca la puerta desde dentro. Hace un frío mortal ahí.',
          opciones:[
            { txt:'Hablarle a través de la puerta, sin forzarla', bueno:true, msg:'Le hablas tranquilo a través del metal. Al rato, el frío y el cansancio pueden más: abre la puerta él mismo.' },
            { txt:'Forzar la puerta a la fuerza', bueno:false, msg:'Tardas en reventar el cierre y, cuando entras, Marek casi se ha desmayado de frío. Tienes que cargarlo, perdiendo tiempo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Marek está delante de ti, tiritando, la foto aún en la mano. Antes de decidir, escúchalo. Lee al hombre.',
      frases: [
        { txt:'"El contrato es legal, sí. Vendí el riñón para salvarla. Murió antes de la operación. Ahora pago una deuda contraída por una vida que ya no existe."',
          lecturas:[
            { txt:'Busca un tecnicismo para anular el contrato', correcta:false },
            { txt:'Dice una verdad cruel: cumplir el contrato es absurdo y brutal', correcta:true },
            { txt:'Exagera su tragedia para conmoverte', correcta:false }
          ] },
        { txt:'"No huyo de la operación. Huyo de que me corten por nada. Si ella viviera, te juro que iría yo solo al quirófano."',
          lecturas:[
            { txt:'Mentiría con tal de salvar su riñón', correcta:false },
            { txt:'Es sincero: su problema es el sinsentido, no el miedo', correcta:true },
            { txt:'Intenta ganar tiempo para escapar', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'El contrato de Marek es legal y HELIX paga bien por hacerlo cumplir. Pero es un hombre al que van a abrir para cobrarse una deuda contraída por salvar a alguien que ya murió. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Marek a HELIX (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:11, disociacion:13,
          narr:'Lo entregas en el punto de recogida médica. Dos celadores lo conducen a un quirófano blanco e impecable donde le quitarán, con todo el papeleo en regla, un trozo del cuerpo por una deuda absurda. Cobras una fortuna. HELIX te marca como agente fiable de cumplimiento. Todo legal, todo firmado, todo monstruoso. La foto de su mujer se queda en el suelo del taller, donde nadie la recogerá.' },
        { txt:'Entregarlo, pero filtrar el caso a los Archivistas', tipo:'pacto', pagaMult:0.7, rep:3, repAlt:{faccion:'archivistas',val:10}, disociacion:7, requierePulso:true,
          narr:'Entregas a Marek, porque incumplir un contrato de HELIX es ponerte tú en su lugar. Pero antes pasas el caso a los Archivistas: un contrato que cobra carne por una vida no salvada es la clase de obscenidad legal que merece circular. Cobras casi todo. A Marek lo abren igual. Pero quizá, dentro de un tiempo, su caso ayude a que estos contratos se miren con otros ojos. Magro consuelo para un hombre con un riñón menos.' },
        { txt:'Dejarlo ir y dar el contrato por imposible', tipo:'soltar', pagaMult:0.0, rep:-11, disociacion:-6, requierePulso:true,
          narr:'Le dices que desaparezca, que cambie de sector, de nombre, de cara si puede. No cobras, y dejar sin cumplir un contrato de HELIX es la forma más rápida de acabar tú mismo en un quirófano con tu nombre en un formulario. Marek recoge la foto del suelo, te mira como quien no recuerda la última vez que alguien le hizo un favor, y se va. Te has buscado un problema enorme. Pero no has llevado a un hombre a que lo despiecen por una muerta. Esta noche el riesgo merece la pena.' }
      ]
    }
  },
  // ── CONTRATO 8 — LOTO (estafa interna, rango 3) ───────────
  {
    id: 'cobra_dos_veces',
    titulo: 'LA QUE COBRA DOS VECES',
    contratante: 'El Loto Carmesí · Mano Roja',
    faccion: 'loto',
    peligro: 3,
    pagaBase: 480,
    progreso: 170,
    rangoMin: 3,
    resumen: 'Una intermediaria del Loto, Vesh, lleva años cobrando deudas dos veces: una para el Loto y otra para su propio bolsillo, falseando los libros. La Mano Roja por fin lo ha olido. La quiere viva y quiere los libros reales.',
    objetivo: {
      nombre: 'Vesh Aldous, intermediaria',
      contexto: 'Es lista, fría y lleva una década sangrando al Loto sin que lo notaran. No tiene una historia triste: tiene avaricia y nervios de acero. Pero también tiene una red de sobornos que llega muy arriba en el propio Loto, y eso la hace peligrosa de tocar.'
    },
    abordaje: {
      intro: 'Localizas a Vesh en un salón privado, impecable, rodeada de guardaespaldas a sueldo. Te recibe sin inmutarse, como si te esperara. "Tú debes ser el perro que ha mandado la Roja. Siéntate. Hablemos como adultos." ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Seguirle el juego y hacerla hablar', via:'labia', prob:0.75,
          exito:{ msg:'Le sigues la conversación con calma y la dejas presumir. Entre frase y frase, deja caer dónde guarda los libros reales y cuánto lleva sisado. La vanidad es su única grieta, y la has encontrado.' },
          fallo:{ msg:'Calcula que sabes demasiado y hace una seña. Sus guardaespaldas se mueven y Vesh aprovecha para escabullirse por una puerta lateral.', huye:true } },
        { txt:'[ARMA] Imponerte sobre sus guardaespaldas', via:'fuerza', prob:0.85, requiereItem:'arma_fuego',
          exito:{ msg:'Sacas el arma y los guardaespaldas calculan que no les pagan lo suficiente. Se apartan. Vesh ni pestañea. "Vaya. Directo. La Roja eligió bien." Se sienta, sin miedo, ya pensando en cómo comprarte.', disociacion:5 },
          fallo:{ msg:'Los guardaespaldas reaccionan antes que tú; en el forcejeo Vesh desaparece por la puerta lateral.', huye:true, fatiga:6 } },
        { txt:'[SIGILO] Esperar a que despida a su gente', via:'sigilo', prob:0.6,
          exito:{ msg:'Aguardas a que termine la reunión y se quede sola contando. Te plantas entre ella y la salida sin un ruido. Por primera vez, una grieta de miedo le cruza la cara.' },
          fallo:{ msg:'Un guardaespaldas rezagado te detecta y da la voz. Vesh no espera: ya va camino de la puerta lateral.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Vesh huye por los pasadizos de servicio del Arrabal, los mismos que usa para mover dinero sin que la vean. Va en tacones pero conoce cada atajo.',
      pasos: [
        { narr:'Se mete en un montacargas de carga y pulsa para bajar. Puedes saltar dentro a tiempo o cortar la energía del montacargas.',
          opciones:[
            { txt:'Cortar la energía del montacargas', bueno:true, msg:'El montacargas se detiene entre plantas. Vesh queda atrapada en la caja, sin salida.' },
            { txt:'Saltar dentro antes de que cierre', bueno:false, msg:'Las puertas se cierran en tus narices; baja sin ti y ganas que recuperar.' }
          ] },
        { narr:'Sale a una galería comercial llena de gente. Puede mezclarse y desaparecer entre la multitud.',
          opciones:[
            { txt:'Vigilar las salidas en vez de perseguir', bueno:true, msg:'Cubres la única salida lógica y la interceptas cuando intenta colarse fuera.' },
            { txt:'Abrirte paso entre la gente tras ella', bueno:false, msg:'La multitud la engulle y te frena; casi la pierdes del todo.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Vesh está acorralada, recomponiéndose el peinado con un aplomo admirable. Antes de decidir, léela. No todos los objetivos dan pena.',
      frases: [
        { txt:'"Puedo pagarte el triple de lo que te da la Roja. Ahora mismo. Y nadie tiene por qué saber que me encontraste."',
          lecturas:[
            { txt:'Está desesperada y se rendirá', correcta:false },
            { txt:'Intenta comprarte; es su modo de operar, no un gesto sincero', correcta:true },
            { txt:'Te ofrece una alianza honesta', correcta:false }
          ] },
        { txt:'"Llevo diez años haciendo esto. ¿Sabes por qué no me han pillado? Porque medio Loto cobra de mí. Tócame y verás a cuántos enfadas."',
          lecturas:[
            { txt:'Es un farol vacío para asustarte', correcta:false },
            { txt:'Dice una verdad incómoda: su red de sobornos es real y peligrosa', correcta:true },
            { txt:'Delira sobre su propia importancia', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Vesh no tiene historia triste: tiene avaricia, una red de sobornos dentro del propio Loto y una oferta para comprarte. La Mano Roja la quiere viva y quiere los libros. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Vesh y los libros al Loto (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:12, disociacion:6,
          narr:'La entregas con los libros reales. La Mano Roja los hojea y su sonrisa se va apagando: en esas páginas hay nombres de su propia gente. "Bien. Esto... lo arreglo yo." Cobras completo y el Loto te respeta como nunca. Lo que pase ahora dentro del Loto, con esa lista de traidores, no es tu problema. Por una vez, entregar al objetivo no te pesa: Vesh sabía lo que hacía.' },
        { txt:'Aceptar su soborno y entregar libros falsos', tipo:'pacto', pagaMult:0.0, rep:-10, coste:0, disociacion:8, requierePulso:true,
          narr:'Coges su dinero, el triple de la paga, y le entregas al Loto unos libros maquillados que ella te da. Vesh desaparece, agradecida y ya planeando su próximo timo. Te has forrado en una tarde. Pero le has mentido a la Mano Roja, y el Loto no perdona dos veces: si algún día atan cabos, el siguiente cartel con una cara llevará la tuya. El dinero pesa distinto cuando es el precio de tu propia cabeza.' },
        { txt:'Soltarla y avisar al Loto de su red de sobornos', tipo:'soltar', pagaMult:0.3, rep:7, disociacion:2, requierePulso:true,
          narr:'Dejas ir a Vesh (lista, escurridiza, ya volverás a verla) pero le llevas a la Mano Roja algo más valioso que una cabeza: la lista de los suyos que cobraban de ella. Cobras poco por no traer al objetivo, pero el Loto limpia su casa por dentro gracias a ti, y eso vale una reputación que el dinero no compra. Vesh anda suelta, debiéndote una y odiándote a partes iguales. En el Arrabal, eso es tener una carta guardada.' }
      ]
    }
  },
  // ── CONTRATO 9 — SIN FACCIÓN (el más nimio y desgarrador) ─
  {
    id: 'padre_robo_leche',
    titulo: 'POR UN CAJÓN DE LECHE',
    contratante: 'Particular · un comerciante del mercado',
    faccion: '',
    peligro: 2,
    pagaBase: 200,
    progreso: 110,
    rangoMin: 2,
    resumen: 'Un comerciante te paga para dar con quien lleva semanas robándole leche en polvo y fórmula infantil del almacén. Quiere un escarmiento público. El ladrón resulta ser lo que ya temías.',
    objetivo: {
      nombre: 'el ladrón del almacén',
      contexto: 'Roba siempre lo mismo: fórmula infantil, nunca nada de valor que pueda revender. Es un padre joven, viudo, con un bebé que no para de llorar de hambre y un sueldo que no llega a la fórmula que HELIX vende a precio de oro. No es un criminal. Es un cálculo desesperado.'
    },
    abordaje: {
      intro: 'Montas guardia en el almacén dos noches. A la tercera, una sombra fuerza la reja trasera y va directo, sin dudar, al estante de la fórmula infantil. Ni mira la caja registradora. Cuando enciendes la linterna, ves a un chico joven con ojeras y un portabebés vacío al pecho. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Preguntarle para quién es la leche', via:'labia', prob:0.85,
          exito:{ msg:'Se queda paralizado, la lata apretada contra el pecho. "Para mi hija. Tiene cuatro meses. Su madre... ya no está. Lléveme a donde tenga que llevarme, pero deje que le dé esta toma." Y se le quiebra la voz.' },
          fallo:{ msg:'El susto de la linterna lo hace soltar la lata y escapar por la reja forzada.', huye:true } },
        { txt:'[SEÑUELO] Dejar una lata como cebo y esperar', via:'trampa', prob:0.9, requiereItem:'senuelo',
          exito:{ msg:'Dejas una lata bien a la vista, separada. Cuando va a por ella, está tan centrado en cogerla que te dejas ver sin que huya. "Por favor", dice sin más. "Es para mi hija." No hay treta que valga ante eso.', disociacion:2 },
          fallo:{ msg:'Sospecha de la lata demasiado fácil y, en vez de cogerla, sale corriendo por la reja.', huye:true } },
        { txt:'[FUERZA] Cortarle el paso a la reja', via:'fuerza', prob:0.8,
          exito:{ msg:'Te interpones entre él y la salida. No pelea. Se queda quieto, abraza la lata como si fuera lo único que importa, que para él lo es. "Vale. Pero la leche va para mi hija. Eso no me lo quita."', disociacion:4 },
          fallo:{ msg:'Es escurridizo de tanto huir y se cuela bajo tu brazo hacia la reja.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'El chico corre por los pasillos del mercado nocturno que conoce de venir a robar. Corre torpe, agotado, pero la desesperación tira.',
      pasos: [
        { narr:'Se mete entre los puestos cerrados con sus lonas bajadas. Puedes seguirlo o adelantarte por el pasillo central.',
          opciones:[
            { txt:'Adelantarte por el pasillo central', bueno:true, msg:'Corres recto y le sales al final del pasillo de puestos. Frena en seco.' },
            { txt:'Seguirlo entre las lonas', bueno:false, msg:'Las lonas te enredan mientras él se cuela por un hueco; ganas que recuperar.' }
          ] },
        { narr:'Llega a la salida del mercado, pero tropieza y la lata rueda lejos. Se detiene a recogerla en vez de huir.',
          opciones:[
            { txt:'Esperar a que recoja la lata, sin abalanzarte', bueno:true, msg:'Espera. Recoge la lata con manos temblorosas y, al levantarse, ya no corre. Sabe que lo tienes.' },
            { txt:'Aprovechar el tropiezo para placarlo', bueno:false, msg:'Te lanzas y caéis los dos; la lata se abolla, él se hace daño, y la escena queda más fea de lo necesario.' }
          ] }
      ]
    },
    pulso: {
      intro: 'El chico está delante de ti, la lata de fórmula contra el pecho como un escudo. Antes de decidir, míralo bien. Lee al padre.',
      frases: [
        { txt:'"Robo leche. Solo leche. Nunca he tocado la caja ni nada que vender. Es para mi hija, que llora de hambre porque no me da el sueldo."',
          lecturas:[
            { txt:'Usa al bebé de excusa para robar', correcta:false },
            { txt:'Dice la verdad: roba solo fórmula, por necesidad pura', correcta:true },
            { txt:'Es un ladrón habitual con buena labia', correcta:false }
          ] },
        { txt:'"Lléveme con quien sea. Pero esta lata se la llevo a ella primero. Después haga lo que quiera conmigo."',
          lecturas:[
            { txt:'Intenta escapar usando al bebé de coartada', correcta:false },
            { txt:'Antepone a su hija a su propia suerte, sinceramente', correcta:true },
            { txt:'Manipula tu compasión para ganar tiempo', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'El comerciante te paga por un escarmiento público. El ladrón es un padre viudo que roba fórmula para un bebé de cuatro meses. La ley del mercado es clara; lo que tú hagas, no tanto. ¿Qué haces?',
      opciones: [
        { txt:'Entregarlo al comerciante para el escarmiento (cobrar)', tipo:'vivo', pagaMult:1.0, rep:3, disociacion:9,
          narr:'Lo entregas. El comerciante lo exhibe atado en su puesto toda la mañana, "para que aprendan los demás", y luego lo manda a los de seguridad de HELIX, que cobran las deudas con trabajo forzado. Cobras lo pactado. En algún cuarto de las capas bajas, un bebé de cuatro meses llora de hambre y nadie va a venir con la lata. Cumpliste el encargo. Esta es de las que no se olvidan, y no por orgullo.' },
        { txt:'Entregarlo, pero pagar tú la leche robada', tipo:'pacto', pagaMult:0.6, rep:2, coste:50, disociacion:3, requierePulso:true,
          narr:'Le pagas al comerciante de tu bolsillo lo robado para que retire la denuncia y no haya escarmiento, y dejas que el chico se lleve la lata a su hija. El comerciante refunfuña pero acepta el dinero. Cobras tu encargo menos lo que pusiste, casi nada neto. El chico no entiende por qué un cazador le paga la leche, y tú tampoco te lo explicas del todo. Pero el bebé come esta noche.' },
        { txt:'Dejarlo ir y mentirle al comerciante', tipo:'soltar', pagaMult:0.0, rep:-2, disociacion:-5, requierePulso:true,
          narr:'Le dices al chico que desaparezca y que busque las fórmulas que reparten en los comedores del Culto, que no pregunten tanto. Al comerciante le cuentas que el ladrón era un yonqui que se largó del sector y no volverá. No cobras, y mentirle a quien te paga es mal negocio si se sabe. Pero no has colgado a un padre en un puesto por una lata de leche. El bebé come, el padre respira, y tú te quedas sin paga y sin remordimiento. Buen cambio.' }
      ]
    }
  },
  // ── CONTRATO 10 — FERRO (pez gordo caído, rango 4) ────────
  {
    id: 'capataz_marcado',
    titulo: 'EL CAPATAZ MARCADO',
    contratante: 'Sindicato Ferro · Don Vasek',
    faccion: 'sindicatos',
    peligro: 4,
    pagaBase: 650,
    progreso: 220,
    rangoMin: 4,
    resumen: 'Uno de los capataces de más confianza de Vasek, Krell, ha caído en desgracia: se sospecha que negociaba con el Loto a espaldas del viejo. Vasek lo quiere vivo, para mirarlo a los ojos antes de decidir. Krell tiene hombres, armas y nada que perder.',
    objetivo: {
      nombre: 'Krell Vantano, capataz del Ferro',
      contexto: 'Veinte años de lealtad a Vasek, hasta que entendió que el viejo lo iba a desechar como a todos. Empezó a hablar con el Loto para asegurarse un futuro. No es inocente, pero tampoco el traidor simple que Vasek cree: intentaba sobrevivir a un jefe que no deja sobrevivir a nadie.'
    },
    abordaje: {
      intro: 'Krell se ha atrincherado en una nave de fundición clausurada, con tres hombres armados y la calma de un veterano. Te ve llegar por las cámaras y te habla por un altavoz oxidado. "Sé quién te manda. Entra solo y hablamos. O entra con todo y morimos varios. Tú eliges, cazador." ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Entrar solo, desarmado, a hablar', via:'labia', prob:0.7,
          exito:{ msg:'Entras con las manos vacías. Krell despide a sus hombres con un gesto. "Valiente. O estúpido." Se sienta frente a ti. "Veinte años con el viejo. ¿Sabes cómo paga la lealtad? Con una bala cuando ya no sirves. Por eso hablé con el Loto." Y te lo cuenta todo.' },
          fallo:{ msg:'Uno de sus hombres se pone nervioso, hay gritos, y en el caos Krell se repliega al fondo de la fundición. Ahora va a ser a las malas.', huye:true } },
        { txt:'[ARMA] Entrar por la fuerza, arma en mano', via:'fuerza', prob:0.7, requiereItem:'arma_fuego',
          exito:{ msg:'Entras rápido y duro. Hay un intercambio breve y brutal; sus hombres calculan que no cobran lo bastante para morir y se retiran. Krell tira el arma. "Está bien. Eres serio. Hablemos antes de que me lleves." Respira agitado, pero entero.', disociacion:7 },
          fallo:{ msg:'Tres hombres armados en terreno conocido son demasiado. El tiroteo te obliga a replegarte, y Krell aprovecha para huir al fondo de la nave.', huye:true, herida:'costillas' } },
        { txt:'[ANALIZADOR] Sabotear las cámaras y entrar a ciegas', via:'sigilo', prob:0.75, requiereItem:'analizador',
          exito:{ msg:'Con el analizador friés sus cámaras de seguridad. Ciego, Krell pierde su ventaja; te cuelas entre sus hombres y le caes encima antes de que reaccionen. "La tecnología", masculla. "Siempre la maldita tecnología."', disociacion:5 },
          fallo:{ msg:'El sabotaje dispara una alarma de respaldo. Krell sabe que entras y se repliega al fondo con los suyos.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Krell se repliega por la fundición que conoce de veinte años, apagando luces y volcando obstáculos. Es un veterano, no un fugitivo asustado.',
      pasos: [
        { narr:'Se mete en la sala de hornos, un laberinto de calor y tuberías. Puedes seguir su rastro de calor o cortarle la salida del fondo.',
          opciones:[
            { txt:'Rodear para cortar la salida del fondo', bueno:true, msg:'Conoces las fundiciones del Ferro. Le bloqueas la única salida y lo atrapas entre los hornos.' },
            { txt:'Seguirlo directo entre las tuberías', bueno:false, msg:'Conoce cada válvula; suelta vapor a tu paso y te frena, ganando distancia.' }
          ] },
        { narr:'Llega a una pasarela sobre el foso de colada, ahora frío. Se vuelve, agotado, calculando si saltar.',
          opciones:[
            { txt:'Hablarle con calma, sin avanzar', bueno:true, msg:'Le hablas quieto. Mira el foso, mira sus veinte años, y baja los hombros. "Se acabó correr." Se entrega.' },
            { txt:'Cargar contra él en la pasarela', bueno:false, msg:'Forcejeáis sobre el foso; casi caéis los dos al fondo de colada. Lo reduces, pero por los pelos y con un susto que recordarás.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Krell está reducido, el sudor y la ceniza marcándole las arrugas de veinte años. Antes de decidir, escúchalo. Lee al capataz.',
      frases: [
        { txt:'"Sí, hablé con el Loto. ¿Sabes por qué? Porque he visto al viejo desechar a hombres mejores que yo cuando dejaron de servirle. Yo soy el siguiente y lo sé."',
          lecturas:[
            { txt:'Justifica una traición por pura codicia', correcta:false },
            { txt:'Dice una verdad amarga: traicionó para sobrevivir a Vasek', correcta:true },
            { txt:'Miente sobre sus tratos con el Loto', correcta:false }
          ] },
        { txt:'"Llévame ante él si quieres. Pero los dos sabemos que Vasek no quiere hablar. Quiere mirarme a los ojos mientras decide cómo termina esto."',
          lecturas:[
            { txt:'Dramatiza para que sientas pena', correcta:false },
            { txt:'Conoce a Vasek y sabe exactamente lo que le espera', correcta:true },
            { txt:'Intenta ponerte en contra del viejo para escapar', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Krell no es inocente: negoció con el Loto. Pero lo hizo sabiendo que Vasek lo iba a desechar igual que a otros. El viejo lo quiere vivo para "mirarlo a los ojos". ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Krell a Vasek (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:15, disociacion:12,
          narr:'Lo entregas en La Lonja. Vasek lo mira largo rato, en silencio, con esos ojos de abuelo que cortan fruta y encargan muertes. "Veinte años, Krell." No dice más. A Krell se lo llevan. Cobras una fortuna y te conviertes en uno de los cazadores de confianza del Ferro, lo cual abre puertas y cava tumbas a partes iguales. Has entregado a un hombre que solo quería sobrevivir al viejo. Ahora trabajas para el viejo.' },
        { txt:'Entregarlo, pero pasar su info del Loto a Vasek aparte', tipo:'pacto', pagaMult:0.8, rep:10, disociacion:8, requierePulso:true,
          narr:'Entregas a Krell y, además, le das a Vasek todo lo que Krell te contó de sus tratos con el Loto: nombres, fechas, contactos. Cobras casi completo y Vasek te valora aún más por minucioso. Krell, al verte cantar lo que te confió, te dedica una última mirada de desprecio sereno antes de que se lo lleven. Has sido eficiente. También has sido el cuchillo más afilado del viejo. Eso tiene un eco que dura.' },
        { txt:'Dejarlo escapar al Loto', tipo:'soltar', pagaMult:0.0, rep:-15, disociacion:-4, requierePulso:true,
          narr:'Le dices que corra al Loto, que es donde ya tenía medio pie, antes de que Vasek mande a alguien menos comprensivo. No cobras, y traicionar a Vasek en un encargo de esta categoría te convierte, oficialmente, en enemigo del Ferro: el peor sitio donde estar en Las Pilas. Krell desaparece hacia el Arrabal, debiéndote la vida. Te has ganado al Sindicato más poderoso de enemigo por dejar vivir a un hombre cansado. Habrá que mirar mucho por encima del hombro a partir de ahora.', malo:true }
      ]
    }
  },
  // ── CONTRATO 11 — HELIX (roza CERO, rango 5) ──────────────
  {
    id: 'eco_con_nombre',
    titulo: 'EL ECO CON NOMBRE',
    contratante: 'HELIX · División de Anomalías',
    faccion: 'helix',
    peligro: 5,
    pagaBase: 1000,
    progreso: 300,
    rangoMin: 5,
    resumen: 'La División de Anomalías te contrata para "recuperar" a un hombre que escapó de un programa que no aparece en ningún registro. No quieren saber qué le pasó. Quieren que deje de hablar. Y él habla de algo que no debería conocer.',
    objetivo: {
      nombre: 'el sujeto que se hace llamar "Eco"',
      contexto: 'Fue parte de un experimento de HELIX para conectar mentes humanas a un fragmento de CERO. Volvió cambiado: habla de cosas anteriores a su nacimiento, predice pequeños sucesos, llama a la gente por nombres que no usan. HELIX no sabe si está roto o si funcionó demasiado bien. Por eso lo quieren callado, no muerto: muerto no pueden estudiarlo.'
    },
    abordaje: {
      intro: 'Encuentras a Eco en lo más hondo de un sector muerto, sentado en el centro de una sala circular llena de símbolos grabados, los mismos del sector 0-G. No huye. Te mira llegar y sonríe. "Llegas con catorce minutos de adelanto sobre lo que vi. Interesante. Aún hay margen." ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Preguntarle qué es lo que "ve"', via:'labia', prob:0.75,
          exito:{ msg:'"Veo lo que ya pasó y vuelve a pasar", dice sin dramatismo. "CERO no piensa en línea recta. Yo aprendí a oírlo un poco. HELIX quiere apagarme porque escucho lo que ellos solo saben usar." No huye. Te invita a sentarte en el círculo de símbolos. Tu piel se eriza.' },
          fallo:{ msg:'"Ah. Vienes de los que no escuchan." Se levanta y, antes de que reacciones, se desvanece entre los pasajes del sector muerto como si lo conociera de antes de existir.', huye:true } },
        { txt:'[ANALIZADOR] Medir y neutralizar su implante', via:'sigilo', prob:0.7, requiereItem:'analizador',
          exito:{ msg:'Apuntas el analizador a su nuca. El aparato enloquece: lecturas imposibles, frecuencias que no deberían existir. Logras un pulso que lo aturde, pero el propio analizador se funde, chamuscado. Eco parpadea, vuelve en sí a medias. "Eso... no era de HELIX. ¿De dónde sacaste algo que casi me alcanza?"', disociacion:8 },
          fallo:{ msg:'El analizador se sobrecarga al instante y se apaga humeante. Eco ladea la cabeza. "No. Eso no funciona conmigo." Y se pierde entre los pasajes.', huye:true } },
        { txt:'[FUERZA] Reducirlo antes de que hable más', via:'fuerza', prob:0.65,
          exito:{ msg:'Te lanzas sobre él. Es solo un hombre, físicamente; lo reduces sin gran pelea. Pero mientras lo sujetas te susurra al oído un nombre, uno que no le has dicho a nadie, uno de un sueño que tuviste de niño, y se te hiela la sangre.', disociacion:10 },
          fallo:{ msg:'Justo cuando vas a agarrarlo, dice algo que te paraliza un segundo: el nombre de tu calle de la infancia. Ese segundo le basta para esfumarse.', huye:true, disociacion:5 } }
      ]
    },
    persecucion: {
      intro: 'Eco no corre como un hombre: parece saber dónde vas a pisar antes que tú. El sector muerto es su tablero. Cada paso tuyo lo tiene previsto, casi.',
      pasos: [
        { narr:'Se interna por un pasaje a oscuras. Una voz, la suya o un eco de ella, te llega desde varias direcciones a la vez. Puedes fiarte de tu instinto o detenerte a escuchar el pulso de las paredes.',
          opciones:[
            { txt:'Detenerte y escuchar el pulso de fondo', bueno:true, msg:'Ignoras las voces y sigues el latido grave, el de cada once segundos. Te lleva directo a él: la señal no miente como sí miente su voz.' },
            { txt:'Seguir la voz a ciegas', bueno:false, msg:'Las voces te llevan en círculos; cuando quieres darte cuenta, has vuelto al principio.' }
          ] },
        { narr:'Llega a la sala del núcleo, donde el latido es casi insoportable. Se detiene en el centro, esperándote, o eso parece.',
          opciones:[
            { txt:'Acercarte despacio, sin miedo aparente', bueno:true, msg:'Caminas hacia él sin correr, sin temblar. Eso, curiosamente, lo desarma. "No tienes miedo. O no lo suficiente. Bien." Deja que lo alcances.' },
            { txt:'Abalanzarte para acabar rápido', bueno:false, msg:'Tu carrera resuena en la sala y algo en el latido se acelera; te mareas, pierdes pie, y recuperarte cuesta.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Eco está delante de ti, sereno, en el centro del latido. Antes de decidir, escúchalo de verdad. Esto no se parece a ningún objetivo anterior.',
      frases: [
        { txt:'"HELIX no me quiere muerto. Me quiere callado y guardado, para abrirme y copiar lo que oigo. Soy un cable que aprendió a escuchar la otra punta."',
          lecturas:[
            { txt:'Delira: el experimento le quemó la cordura', correcta:false },
            { txt:'Dice la verdad: es un sujeto funcional que HELIX quiere explotar', correcta:true },
            { txt:'Inventa una conspiración para que lo sueltes', correcta:false }
          ] },
        { txt:'"Si me entregas, copiarán lo que oigo y aprenderán a usar a CERO sin escucharlo. Y eso, cazador, es lo único peor que ignorarlo."',
          lecturas:[
            { txt:'Exagera su propia importancia cósmica', correcta:false },
            { txt:'Comprende algo real y aterrador sobre lo que HELIX busca', correcta:true },
            { txt:'Manipula tu miedo a lo desconocido', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Eco no es un fugitivo: es un hombre que oyó algo anterior a todo y volvió cambiado. HELIX lo quiere vivo y callado, para abrirlo y copiar lo que escucha. Es el contrato mejor pagado que has visto. Y el que más miedo te da. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Eco a HELIX (cobrar la fortuna)', tipo:'vivo', pagaMult:1.0, rep:15, disociacion:18,
          narr:'Lo entregas a la mujer sin nombre de la División de Anomalías, que lo recibe sin sorpresa, como quien recupera una herramienta extraviada. Cobras mil créditos, una fortuna que te cambia la vida. Te conviertes en La Mano de HELIX, el rango que nadie alcanza. Pero Eco, antes de que se lo lleven, te mira y dice tu nombre verdadero, el de antes de que tuvieras este, y añade: "Te veré cuando aprendan a usarlo. Todos nos veremos." No duermes esa noche. Ni muchas otras. HELIX ya tiene su cable, y tú el dinero de venderlo.' },
        { txt:'Entregarlo, pero grabar lo que dice para los Archivistas', tipo:'pacto', pagaMult:0.7, rep:5, repAlt:{faccion:'archivistas',val:15}, disociacion:12, requierePulso:true,
          narr:'Entregas a Eco, porque desafiar a la División de Anomalías es desaparecer del mapa. Pero grabas todo lo que dijo y lo pasas a los Archivistas: si HELIX va a copiar a CERO sin escucharlo, que al menos haya una copia de la advertencia rondando por la red. Cobras bastante. Eco se deja llevar, y al pasar a tu lado murmura: "Buena elección. La verdad es más difícil de matar que un hombre." Lo que has puesto a circular tardará en germinar. Si germina.' },
        { txt:'Dejarlo desaparecer en el sector muerto', tipo:'soltar', pagaMult:0.0, rep:-15, disociacion:-8, requierePulso:true,
          narr:'Le dices que se pierda en lo hondo, donde HELIX no baja, donde el latido lo esconde. No cobras la mayor fortuna de tu carrera, y desafiar a la División de Anomalías te marca a ti como la próxima anomalía a recuperar. Eco asiente, y antes de fundirse con la oscuridad del sector dice: "Lo entiendes. Algunas cosas hay que dejar que escuchen en paz." Te has jugado el cuello por un hombre que oye lo que no debería. Quizá fue una locura. Quizá, en un mundo que vende todo lo que toca, fue lo único cuerdo. El latido se aleja contigo de vuelta a la superficie, y juras que, por un instante, marcó tu nombre.', malo:false }
      ]
    }
  },

  // ════════════════════════════════════════════════════════════
  //  REFUERZO RANGOS ALTOS (v0.105)
  // ════════════════════════════════════════════════════════════

  // ── R3 · sindicatos ── el armero que vende a los dos bandos
  {
    id: 'armero_dos_bandos',
    titulo: 'EL QUE ARMA A AMBOS LADOS',
    contratante: 'Sindicato Ferro · Don Vasek',
    faccion: 'sindicatos',
    peligro: 3,
    pagaBase: 500,
    progreso: 175,
    rangoMin: 3,
    resumen: 'Un armero del Ferro, Doru, vende material de la organización al Loto por debajo de la mesa. El Ferro pierde hombres con sus propias armas. Vasek lo quiere vivo: primero la lista de a quién más le vendió, después el castigo.',
    objetivo: {
      nombre: 'Doru Vanic, armero',
      contexto: 'Un veterano del Ferro, manos de oro para reparar y modificar armas, que se cansó de cobrar miseria por mantener vivos a los soldados. No es un traidor por ideología: es un hombre amargado que decidió que su talento valía más de lo que le pagaban. Eso lo hace predecible y, a la vez, digno de una pena que no esperabas sentir.'
    },
    abordaje: {
      intro: 'Encuentras a Doru en su taller clandestino, rodeado de piezas y aceite, con un cigarro apagado en los labios. No se sobresalta al verte: deja despacio el destornillador. "El Ferro manda a uno de los tuyos antes que venir él. Buena señal: aún no quieren matarme, quieren algo." ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Hacerle creer que vienes a comprar, no a cazar', via:'labia', prob:0.75,
          exito:{ msg:'Le sigues el papel de cliente. Doru, orgulloso de su mercancía, te enseña medio taller y, sin querer, su libro de pedidos: nombres, fechas, a quién del Loto le sirvió. Cuando entiende que lo has jugado, ya es tarde.' },
          fallo:{ msg:'Algo en tus preguntas le huele a interrogatorio. Cierra el libro de golpe y mete la mano bajo el banco, donde guarda algo cargado. Aprovecha tu duda para escurrirse al callejón.', huye:true } },
        { txt:'[ARMA] Encañonarlo antes de que alcance su banco', via:'fuerza', prob:0.8, requiereItem:'arma_fuego',
          exito:{ msg:'Eres más rápido. Le apuntas antes de que su mano llegue al revólver escondido bajo el banco. Doru levanta las manos, resignado, casi aliviado. "Despacio, cazador. Las armas de este taller las hice yo. Sé lo que duelen."', disociacion:4 },
          fallo:{ msg:'Doru conoce su taller mejor que tú. Vuelca una estantería de piezas entre los dos y, en la confusión, sale por la trampilla del suelo que tú no habías visto.', huye:true, fatiga:5 } },
        { txt:'[SIGILO] Cortarle la salida antes de mostrarte', via:'sigilo', prob:0.65,
          exito:{ msg:'Rodeas el taller y atrancas la trampilla del suelo y la puerta de atrás antes de dejarte ver. Cuando Doru intenta huir por sus rutas, las encuentra todas muertas. Se gira hacia ti sin sorpresa: "Las cerraste todas. Profesional."' },
          fallo:{ msg:'Una plancha suelta cruje bajo tu pie. Doru no espera a ver qué fue: ya está bajando por la trampilla con la agilidad del que ensayó esta huida mil veces.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Doru huye por los conductos de mantenimiento bajo el barrio del Ferro, un laberinto que conoce porque él mismo escondió armas ahí durante años.',
      pasos: [
        { narr:'Se descuelga por un conducto vertical. Puedes seguirlo a ciegas o rodear por la galería paralela que oíste mencionar en su taller.',
          opciones:[
            { txt:'Rodear por la galería paralela', bueno:true, msg:'Recuerdas el plano que viste en su pared y le cortas el paso en el otro extremo del conducto. Sale de cabeza hacia ti.' },
            { txt:'Bajar tras él por el conducto', bueno:false, msg:'El conducto está sembrado de piezas sueltas que te frenan; Doru gana distancia.' }
          ] },
        { narr:'Llega a una cámara con tres salidas idénticas. Duda un instante: una huele a aceite, su mercancía.',
          opciones:[
            { txt:'Seguir el olor a aceite de armas', bueno:true, msg:'El rastro de aceite delata su escondite habitual. Lo encuentras agazapado entre cajas de munición, sin más salida.' },
            { txt:'Tomar la salida más ancha y rápida', bueno:false, msg:'La salida ancha da a un patio vacío. Te has equivocado y has perdido un tiempo precioso.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Doru está acorralado entre sus propias cajas de munición, las manos manchadas de aceite. Antes de decidir, escúchalo. No todos los traidores traicionan por lo mismo.',
      frases: [
        { txt:'"¿Sabes cuántos chicos del Ferro he mantenido vivos remendando sus armas por una miseria? El Ferro me usó treinta años. Solo les cobré lo que valgo."',
          lecturas:[
            { txt:'Se justifica con una mentira para ablandarte', correcta:false },
            { txt:'Dice una verdad amarga: el rencor del veterano mal pagado es real', correcta:true },
            { txt:'Intenta reclutarte para su negocio', correcta:false }
          ] },
        { txt:'"Te daré la lista. Todos los nombres. Pero sabes que en cuanto la tengan, a mí me entierran con mis propias balas. Lo sabes."',
          lecturas:[
            { txt:'Exagera para que lo sueltes', correcta:false },
            { txt:'Acierta: entregarlo con la lista es firmar su sentencia', correcta:true },
            { txt:'Te amenaza veladamente', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Doru no es un traidor de bandera: es un veterano amargado que vendió su talento al mejor postor. Vasek lo quiere vivo, con la lista. Entregarlo con ella es matarlo a plazos. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Doru y la lista al Ferro (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:12, disociacion:7,
          narr:'Lo entregas con su libro de pedidos. Vasek pasa las páginas en silencio y luego asiente una sola vez: en esos nombres hay traiciones que el Ferro ajustará una a una. Cobras completo y el sindicato te debe una limpieza entera. Doru se deja llevar sin resistirse, y al cruzar la puerta te mira con un reproche cansado, sin odio, que es peor que el odio. Hiciste tu trabajo. No por eso pesa menos.' },
        { txt:'Entregarlo pero "perder" la lista en el camino', tipo:'pacto', pagaMult:0.6, rep:3, disociacion:3, requierePulso:true,
          narr:'Entregas a Doru —desafiar a Vasek es impensable— pero le dices al Ferro que no encontraste libro alguno, que vendía de memoria. Doru pagará por su traición, pero solo, sin arrastrar a los nombres de su lista a la fosa con él. Cobras menos y Vasek frunce el ceño, insatisfecho. Has salvado a una docena de desconocidos de las balas del Ferro a cambio de tu paga y de un poco de la confianza de Vasek. Doru nunca sabrá que le quitaste ese peso de encima.' },
        { txt:'Soltarlo a cambio de la lista y un destierro', tipo:'soltar', pagaMult:0.2, rep:-6, disociacion:-3, requierePulso:true,
          narr:'Le coges la lista pero le dices que desaparezca del distrito y no vuelva jamás. Le llevas los nombres a Vasek sin la cabeza, y eso al Ferro no le basta: querían un escarmiento, no solo papeles. Cobras poco y pierdes favor con el sindicato. Pero Doru se va vivo, con sus manos de oro, a remendar armas en otro agujero del mundo. "No tenías por qué", murmura. No. No tenías. Lo hiciste igual.', malo:false }
      ]
    }
  },

  // ── R3 · sin facción ── la niña que finge su propio secuestro
  {
    id: 'secuestro_fingido',
    titulo: 'LA QUE SE SECUESTRÓ A SÍ MISMA',
    contratante: 'Particular · un matrimonio de las capas medias',
    faccion: '',
    peligro: 2,
    pagaBase: 440,
    progreso: 160,
    rangoMin: 3,
    resumen: 'Un matrimonio acomodado contrata tu captura para recuperar a su hija de diecisiete años, "secuestrada" según una nota de rescate. Tú hueles algo raro desde el principio. La nota la escribió ella. El verdadero encargo será qué haces cuando la encuentres.',
    objetivo: {
      nombre: 'Libe, diecisiete años',
      contexto: 'Una adolescente de casa bien que montó su propio secuestro para sacarle dinero a sus padres y huir con él. No es una delincuente: es una cría que se ahoga en una casa de oro y eligió la salida más torpe posible. Lo que descubras sobre por qué huye decidirá si la "rescatas" o la ayudas a desaparecer.'
    },
    abordaje: {
      intro: 'Sigues el rastro de la nota de rescate hasta un cuartucho alquilado en las capas bajas, muy lejos del barrio caro de sus padres. Dentro, Libe está sola, contando billetes sobre una cama, sin un solo secuestrador a la vista. Levanta la cara, más resignada que asustada. "Sabía que mandarían a alguien. ¿Cuánto te pagan por devolverme al zoo?" ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Hablarle como persona, no como objetivo', via:'labia', prob:0.8,
          exito:{ msg:'No la tratas como a una fugitiva ni como a una cría. Le preguntas, sin más, de qué huye. Y Libe, que llevaba semanas sin que nadie le preguntara eso, empieza a hablar. Bajas la guardia los dos a la vez.' },
          fallo:{ msg:'Algo en tu tono le suena a sermón de adulto, a "esto lo hago por tu bien". Se cierra en banda, agarra la mochila con el dinero y sale corriendo por la escalera de incendios.', huye:true } },
        { txt:'[SIGILO] Bloquear su salida antes de que reaccione', via:'sigilo', prob:0.7,
          exito:{ msg:'Te colocas entre ella y la única ventana practicable antes de que se dé cuenta. No hay adónde correr. Libe suelta los billetes y se sienta en la cama, vencida. "Vale. Me has cogido. Felicidades."' },
          fallo:{ msg:'Calculas mal y dejas libre la escalera de incendios. Libe es rápida y conoce el edificio: para cuando reaccionas, ya va dos pisos abajo.', huye:true } },
        { txt:'[ARMA] Imponer autoridad para que no escape', via:'fuerza', prob:0.6,
          exito:{ msg:'Le cierras el paso con cuerpo y voz firme. Funciona: se detiene. Pero el miedo en su cara no es el de una delincuente atrapada, es el de una niña que creía haber escapado y ya no. Te sientes peor por haber ganado así.', disociacion:5 },
          fallo:{ msg:'Tu aspaviento la asusta de más y reacciona como un animal acorralado: te lanza la lámpara y huye en la confusión.', huye:true, fatiga:4 } }
      ]
    },
    persecucion: {
      intro: 'Si Libe huye, corre sin plan, a ciegas, como quien nunca ha tenido que escapar de verdad. Eso la hace torpe y, por eso mismo, fácil de perder si la asustas más.',
      pasos: [
        { narr:'Corre hacia una estación de transporte público abarrotada. Puede mezclarse con la gente o quedarse paralizada por el gentío.',
          opciones:[
            { txt:'Adelantarte con calma a la zona de andenes', bueno:true, msg:'En vez de perseguirla y aterrarla, te adelantas sin prisa al andén. La encuentras allí, paralizada, sin saber qué tren coger. Una cría perdida, no una fugitiva.' },
            { txt:'Gritar su nombre y correr tras ella', bueno:false, msg:'Tu grito la espolea; el pánico le da alas y se pierde entre la multitud del andén.' }
          ] },
        { narr:'La acorralas en un pasillo lateral. Se da la vuelta, jadeando, con lágrimas de rabia y miedo.',
          opciones:[
            { txt:'Bajar las manos y hablar despacio', bueno:true, msg:'Levantas las palmas, bajas la voz, le dices que no vas a hacerle daño. La rabia se le rompe en llanto y deja de correr. Se acabó la persecución.' },
            { txt:'Sujetarla por el brazo de inmediato', bueno:false, msg:'La agarras y ella se revuelve con todas sus fuerzas; en el forcejeo se te escapa otra vez.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Libe está delante de ti, sin secuestradores, con el dinero de sus propios padres en una mochila. Antes de decidir qué haces con ella, escúchala de verdad.',
      frases: [
        { txt:'"No me secuestró nadie. Me secuestré yo. Era la única forma de que mi padre soltara dinero por mí: poniéndole precio. Es lo único que entiende."',
          lecturas:[
            { txt:'Manipula tu pena con un cuento ensayado', correcta:false },
            { txt:'Dice la verdad: huye de una casa que solo habla el idioma del dinero', correcta:true },
            { txt:'Está delirando para evitar el castigo', correcta:false }
          ] },
        { txt:'"Si me devuelves, me encierran en otra escuela cara y fingimos que no pasó. Prefiero la calle. Al menos en la calle no tengo que sonreír en las cenas."',
          lecturas:[
            { txt:'Exagera; su vida es privilegiada y lo desprecia por capricho', correcta:false },
            { txt:'Hay un ahogo real bajo el privilegio; no todo dolor es material', correcta:true },
            { txt:'Solo busca asustarte para que la sueltes', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'No hay secuestradores. Solo una cría de diecisiete que se puso precio para que su padre la mirara, y que prefiere la calle a otra cena fingida. Sus padres te pagan por devolverla. ¿Qué haces?',
      opciones: [
        { txt:'Devolverla a sus padres (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:6, disociacion:6,
          narr:'La llevas de vuelta. Sus padres pagan sin preguntar nada que importe, aliviados de recuperar el objeto extraviado más que a la hija. Libe no te mira al entregar la mochila con su propio rescate. Cobras completo. Mientras te vas, la oyes empezar a discutir con su padre en ese idioma de cifras y reproches del que ella intentó huir. Hiciste el trabajo. Devolviste a una cría a la jaula de la que se había escapado, y te pagaron por la llave.' },
        { txt:'Devolverla, pero hablar con los padres de fondo', tipo:'pacto', pagaMult:0.8, rep:8, disociacion:1, requierePulso:true,
          narr:'La devuelves —es menor, soltarla en la calle no es ayudarla—, pero antes te sientas con los padres y les dices lo que ninguna nota de rescate diría: que su hija se puso precio porque era el único lenguaje que creía que entendían. El padre se ofende. La madre, no: la madre se queda muy quieta, mirando a Libe, como si la viera por primera vez en años. Cobras un poco menos. Quizá no cambie nada. Pero plantaste la única pregunta que esa casa nunca se había hecho.' },
        { txt:'Dejarla ir y mentir a los padres', tipo:'soltar', pagaMult:0.0, rep:-4, disociacion:-5, requierePulso:true,
          narr:'No puedes hacerlo. La dejas marchar con el dinero y les dices a sus padres que el rastro se enfrió, que los secuestradores la sacaron del distrito. No cobras nada y mientes a un cliente, lo que en este oficio se paga caro si se sabe. Pero ves a Libe perderse entre la gente con su mochila y su libertad torpe y aterradora, y por una vez decides que no todo el mundo merece ser devuelto a su jaula. Ojalá la calle sea más amable con ella de lo que fue su casa. No lo será. Aun así.', malo:false }
      ]
    }
  },

  // ── R4 · helix ── el médico que falsea muertes
  {
    id: 'medico_falsea_muertes',
    titulo: 'EL FORENSE QUE FIRMA MENTIRAS',
    contratante: 'HELIX · Auditoría Interna',
    faccion: 'helix',
    peligro: 4,
    pagaBase: 760,
    progreso: 215,
    rangoMin: 4,
    resumen: 'Un forense de HELIX, el doctor Maron, firma certificados de muerte falsos: declara muertos a vivos y vivos a muertos, a cambio de dinero. HELIX lo quiere vivo para saber a quién encubrió. Lo que no te dicen es por qué un hombre decente acabó haciendo esto.',
    objetivo: {
      nombre: 'Dr. Aldo Maron, forense',
      contexto: 'Un patólogo de HELIX con veinte años intachables que, de pronto, empezó a falsear certificados. No por avaricia: lo descubrirás. Encubrió muertes de gente del Arrabal que HELIX habría "recuperado" para experimentos, firmándolas como definitivas para que los dejaran en paz. Pero también cobró por ello, y esa mancha lo hace cazable.'
    },
    abordaje: {
      intro: 'Encuentras al doctor Maron en la morgue de noche, solo, firmando papeles bajo una luz fría. No huye al verte; deja la pluma con un suspiro largo, como quien llevaba tiempo esperando este momento. "Auditoría manda a un cazador. Claro. Más barato que un juicio." Se quita los guantes. ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Preguntarle por qué un hombre como él hace esto', via:'labia', prob:0.75,
          exito:{ msg:'No lo acusas: le preguntas, de verdad, por qué. Maron te mira largo rato y decide que mereces la verdad. Empieza a hablar de los certificados, de a quién protegía firmándolos, y de lo que HELIX hace con los "muertos recuperables". No huye: confiesa.' },
          fallo:{ msg:'Lee en ti al cazador antes que al oyente y se cierra. "No vas a entenderlo, y no voy a dejar que me uses para encontrarlos." Apaga la luz y, conociendo la morgue a oscuras, se escabulle entre las camillas.', huye:true } },
        { txt:'[ANALIZADOR] Bloquear su acceso al sistema de la morgue', via:'sigilo', prob:0.7, requiereItem:'analizador',
          exito:{ msg:'Conectas el analizador a la consola de la morgue y le cierras los accesos y las puertas automáticas antes de que reaccione. Maron prueba una salida, otra, y entiende que está encerrado contigo. Se sienta en una camilla vacía, vencido. "Eficiente. ¿Eres de los que escuchan o de los que entregan sin más?"' },
          fallo:{ msg:'El sistema de la morgue es viejo y el analizador no engancha a la primera. Maron aprovecha el pitido de error para salir por la esclusa de cuerpos, que solo él sabe abrir desde dentro.', huye:true } },
        { txt:'[ARMA] Cortarle el paso con firmeza', via:'fuerza', prob:0.8, requiereItem:'arma_fuego',
          exito:{ msg:'Le cierras la única salida con el arma en alto. Maron ni se inmuta ante el cañón; ha visto demasiados muertos para temer ser uno. "Adelante. Pero antes de entregarme, mira un certificado. Solo uno. Después haz lo que tengas que hacer."', disociacion:4 },
          fallo:{ msg:'Maron vuelca una bandeja de instrumental entre los dos y, en el estruendo metálico, desaparece por la esclusa de cuerpos.', huye:true, fatiga:5 } }
      ]
    },
    persecucion: {
      intro: 'Maron huye por las entrañas clínicas del complejo HELIX: pasillos de servicio, cámaras frías, conductos que conoce de veinte años pisándolos. No corre rápido, pero corre informado.',
      pasos: [
        { narr:'Se mete en una cámara de conservación llena de camillas con cuerpos. Puede esconderse entre ellos o seguir hacia los conductos.',
          opciones:[
            { txt:'Revisar las camillas una a una, sin prisa', bueno:true, msg:'Sabes que un forense se esconde donde se siente seguro: entre los muertos. Lo encuentras inmóvil entre dos camillas, fingiendo ser uno más. La calma te dio el ojo.' },
            { txt:'Cruzar la cámara directo hacia los conductos', bueno:false, msg:'Pasas de largo y Maron, que sí estaba entre las camillas, espera a que salgas para huir por donde viniste.' }
          ] },
        { narr:'Llega a una bifurcación: un pasillo lleva a la salida exterior, otro de vuelta a su despacho.',
          opciones:[
            { txt:'Cubrir el pasillo a su despacho', bueno:true, msg:'Apuestas a que no huye: vuelve a por los certificados que protege. Aciertas. Lo interceptas en la puerta de su despacho, abrazado a una carpeta.' },
            { txt:'Correr hacia la salida exterior', bueno:false, msg:'Vas a la salida, pero Maron nunca pensó en huir del edificio: volvió a por sus papeles y casi lo pierdes.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Maron está acorralado, abrazado a una carpeta de certificados como quien protege a hijos. Antes de decidir, escúchalo. Este objetivo no encaja en la palabra "culpable".',
      frases: [
        { txt:'"¿Sabes qué le pasa a un pobre del Arrabal que muere con el implante aún funcional? HELIX lo declara recuperable y lo abre. Yo los firmo definitivos. Para que los entierren en paz."',
          lecturas:[
            { txt:'Inventa una excusa noble para que lo sueltes', correcta:false },
            { txt:'Dice la verdad: falsea muertes para salvar cuerpos del laboratorio', correcta:true },
            { txt:'Está roto y delira sobre conspiraciones', correcta:false }
          ] },
        { txt:'"Sí, cobré por algunos. No voy a fingir que soy un santo. Pero por cada uno que cobré, firmé tres gratis. Entrégame y todos esos cuerpos vuelven a la lista de recuperables."',
          lecturas:[
            { txt:'Usa a los muertos como escudo para salvarse', correcta:false },
            { txt:'Acierta: entregarlo reactiva el destino que él frenaba', correcta:true },
            { txt:'Miente sobre los certificados gratuitos', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Maron falsea muertes, sí. Cobró por algunas. Pero firma definitivos a los muertos del Arrabal para que HELIX no los "recupere" para el laboratorio. HELIX lo quiere vivo y con la lista. Entregarlo condena a esos cuerpos. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Maron y sus certificados a HELIX', tipo:'vivo', pagaMult:1.0, rep:14, disociacion:12,
          narr:'Lo entregas con la carpeta. Auditoría te paga completo y te asciende en su consideración: eres de los que cumplen sin preguntar. Maron no forcejea; solo te dice, al cruzar la puerta: "Acabas de devolver doscientos cuerpos a la mesa de disección. Espero que el dinero te dure más que sus nombres." HELIX cruza sus listas esa misma noche. Cobras una fortuna por reabrir una carnicería que un hombre cansado había logrado frenar a fuerza de mentiras piadosas. Hay ascensos que saben a ceniza.' },
        { txt:'Entregarlo, pero destruir antes la lista de nombres', tipo:'pacto', pagaMult:0.6, rep:4, disociacion:5, requierePulso:true,
          narr:'Entregas a Maron —desafiar a Auditoría es desaparecer—, pero "accidentalmente" la carpeta de certificados arde antes de llegar a sus manos. HELIX tiene a su forense pero no su lista: los cuerpos que protegió siguen enterrados como definitivos, fuera de alcance. Cobras menos y Auditoría sospecha del incendio, pero no puede probarte nada. Maron, desde donde quiera que lo lleven, nunca sabrá que salvaste a sus muertos. Te basta con saberlo tú.' },
        { txt:'Soltarlo y advertirle que desaparezca', tipo:'soltar', pagaMult:0.0, rep:-12, disociacion:-6, requierePulso:true,
          narr:'No puedes entregarlo. Le dices que coja sus certificados, queme su rastro y desaparezca esta misma noche, lejos del alcance de HELIX. No cobras nada, y desafiar a Auditoría Interna te pinta una diana que tardarás en quitarte de la espalda. Maron recoge su carpeta con manos temblorosas. "¿Por qué?", pregunta. No sabes contestarle bien; algo de que doscientos nombres pesan más que una paga. Se va, y con él los muertos que seguirá protegiendo en otro agujero. Te has jugado el cuello por los enterrados. Es la clase de locura que no se cobra y no se olvida.', malo:false }
      ]
    }
  },

  // ── R4 · loto ── la desertora que se llevó la caja
  {
    id: 'desertora_caja',
    titulo: 'LA QUE SE LLEVÓ LA CAJA',
    contratante: 'El Loto Carmesí · Mano Roja',
    faccion: 'loto',
    peligro: 4,
    pagaBase: 720,
    progreso: 205,
    rangoMin: 4,
    resumen: 'Una tesorera del Loto, Reni, desapareció con la caja de un mes entero y los códigos de las cuentas. La Mano Roja la quiere viva, con el dinero y los códigos. Pero Reni no huyó por avaricia, y lo que se compró con ese dinero te hará dudar.',
    objetivo: {
      nombre: 'Reni Caló, tesorera',
      contexto: 'Llevaba las cuentas del Loto con una lealtad de años. Hasta que su hermana cayó enferma de algo que solo HELIX podía tratar, a un precio que ninguna lealtad paga. Reni cogió la caja del mes y los códigos y desapareció. No es una ladrona de oficio: es una mujer que eligió a su hermana por encima del Loto, sabiendo lo que eso le costaría.'
    },
    abordaje: {
      intro: 'Sigues el rastro del dinero hasta una clínica privada de las capas medias, cara, limpia, ajena al Arrabal. Encuentras a Reni en una sala de espera, demacrada, vigilando una puerta tras la que su hermana recibe un tratamiento que cuesta una caja entera del Loto. Te ve llegar y no se levanta. "Sé lo que eres. Solo... déjame ver cómo termina la sesión. Después voy contigo." ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Preguntarle qué compró con la caja', via:'labia', prob:0.8,
          exito:{ msg:'No la acusas: le preguntas adónde fue el dinero. Reni señala la puerta con la barbilla. "A eso. A que mi hermana respire un mes más." Te cuenta toda la historia sin adornos, los códigos incluidos, porque ya no le quedan fuerzas para mentir. No huye: solo está cansada.' },
          fallo:{ msg:'Algo en tu acercamiento le suena a trampa y el instinto de tesorera le gana: se levanta, mete la mano en el bolso donde lleva los códigos y sale por la puerta de personal antes de que la alcances.', huye:true } },
        { txt:'[SIGILO] Cubrir las salidas de la clínica', via:'sigilo', prob:0.7,
          exito:{ msg:'Recorres la clínica y cubres las dos salidas reales antes de mostrarte. Cuando Reni piensa en huir, no hay por dónde. Se vuelve a sentar, despacio, y apoya la cabeza en la pared. "Bien jugado. No me voy sin verla salir, de todos modos."' },
          fallo:{ msg:'No cuentas con la salida de emergencia del ala médica. Reni la conoce de tanto venir y se escurre por ella sin mirar atrás.', huye:true } },
        { txt:'[ARMA] Impedir que se levante de la silla', via:'fuerza', prob:0.75, requiereItem:'arma_blanca',
          exito:{ msg:'Le bloqueas el paso con cuerpo y hoja a la vista. Reni mira el filo sin miedo, casi con desprecio. "¿De verdad? ¿Aquí, delante de los enfermos?" Tiene razón y bajas un poco el arma, lo justo para sentirte mezquino.', disociacion:5 },
          fallo:{ msg:'Reni grita "¡seguridad!" en plena sala de espera y, en el revuelo de batas y enfermos asustados, desaparece por el ala médica.', huye:true, fatiga:4 } }
      ]
    },
    persecucion: {
      intro: 'Si Reni huye, no corre como una criminal: corre como una mujer que no quiere alejarse demasiado de la puerta tras la que está su hermana. Esa correa invisible la vuelve predecible.',
      pasos: [
        { narr:'Se interna en el aparcamiento subterráneo de la clínica. Puede esconderse entre los vehículos o intentar salir a la calle.',
          opciones:[
            { txt:'Apostar a que no se aleja de la clínica', bueno:true, msg:'Sabes que no se irá lejos de su hermana. La encuentras agazapada tras una columna, con los ojos clavados en el ascensor que sube al ala médica. No pensaba huir de verdad.' },
            { txt:'Perseguirla hacia la salida a la calle', bueno:false, msg:'Corres hacia la calle, pero Reni nunca pensó en salir: rodea de vuelta hacia el ascensor y casi la pierdes.' }
          ] },
        { narr:'La arrinconas junto al ascensor del ala médica. Pulsa el botón con desesperación, mirando los números bajar despacio.',
          opciones:[
            { txt:'Esperar a su lado sin tocarla', bueno:true, msg:'No la agarras. Te pones a su lado y esperas el ascensor con ella. Reni se derrumba contra la pared, llorando, y deja de huir. "No me iba a ir sin ella. No puedo." Se acabó.' },
            { txt:'Sujetarla antes de que entre al ascensor', bueno:false, msg:'La agarras justo cuando se abren las puertas; en el forcejeo entra ella sola y las puertas se cierran entre los dos.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Reni está acorralada junto al ascensor, la caja del Loto vacía y los códigos en el bolso. Antes de decidir, escúchala. El dinero no se lo quedó.',
      frases: [
        { txt:'"No me llevé la caja para huir a una isla. Está toda ahí dentro, en una máquina que mantiene viva a mi hermana. Cuéntalo si quieres. Cada crédito tiene su factura médica."',
          lecturas:[
            { txt:'Miente; el dinero estará escondido en otra parte', correcta:false },
            { txt:'Dice la verdad: gastó la caja entera en salvar a su hermana', correcta:true },
            { txt:'Usa a su hermana como tapadera de un robo', correcta:false }
          ] },
        { txt:'"Sé que el Loto no perdona. Sé que estoy muerta lo entregue o no los códigos. Solo te pido el tiempo de que termine este tratamiento. Una hora. Es todo lo que pido."',
          lecturas:[
            { txt:'Gana tiempo para preparar otra fuga', correcta:false },
            { txt:'Acepta su destino; solo quiere ver terminar el tratamiento', correcta:true },
            { txt:'Manipula tu compasión para escapar', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Reni no robó para enriquecerse: vació la caja del Loto en una máquina que mantiene viva a su hermana, y sabe que está sentenciada haga lo que haga. La Mano Roja la quiere viva, con dinero y códigos. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Reni y los códigos al Loto (cobrar completo)', tipo:'vivo', pagaMult:1.0, rep:13, disociacion:14,
          narr:'La entregas con los códigos. La Mano Roja recupera sus cuentas y te paga completo, satisfecha: una desertora menos, un ejemplo más. Reni no suplica; solo te pide que alguien avise a la clínica de que ya no habrá más pagos. El tratamiento de su hermana se interrumpe esa misma semana. Cobras una fortuna por devolverle al Loto su dinero y, de paso, por firmar dos sentencias en vez de una. Te dices que ella sabía las reglas. Es verdad. No ayuda.' },
        { txt:'Entregarla, pero pagar tú el tratamiento pendiente', tipo:'pacto', pagaMult:0.5, rep:6, disociacion:6, requierePulso:true,
          narr:'Entregas a Reni y los códigos —no puedes robarle al Loto sin condenarte—, pero coges parte de tu paga y la dejas en la clínica, anónima, para que el tratamiento de su hermana no se corte de golpe. Reni nunca sabrá quién lo hizo. La Mano Roja tiene lo suyo, tú cobras poco, y en algún sitio una mujer enferma gana unas semanas que no debería. No has salvado a Reni. Pero no dejaste que su último acto fuera en vano.' },
        { txt:'Soltarla con los códigos y mentir al Loto', tipo:'soltar', pagaMult:0.0, rep:-13, disociacion:-7, requierePulso:true,
          narr:'No puedes. Le dices que coja a su hermana en cuanto pueda moverse y desaparezcan las dos del distrito, códigos incluidos. Le mientes a la Mano Roja: que Reni movió el dinero a cuentas que no pude rastrear, que se me adelantó. No cobras nada y mentirle al Loto sobre su propia caja es la clase de riesgo que se paga con la vida. Reni te mira como si no entendiera el idioma en que actúas. "¿Por qué?" Por nada que sepas explicar. Se llevan a su hermana en una silla esa noche, y se pierden las dos en una ciudad que no perdona a nadie. Quizá lo logren. Casi nunca se logra. Aun así las dejaste intentarlo.', malo:false }
      ]
    }
  },

  // ── R5 · sin facción ── el cazarrecompensas que cazaba inocentes (el espejo)
  {
    id: 'cazador_de_cazadores',
    titulo: 'EL ESPEJO',
    contratante: 'Gremio de Cazadores · tribunal interno',
    faccion: '',
    peligro: 5,
    pagaBase: 1050,
    progreso: 305,
    rangoMin: 5,
    resumen: 'El propio gremio te contrata para cazar a uno de los vuestros: Tann, un cazarrecompensas legendario que, según ellos, entregaba inocentes a HELIX por dinero, fabricando culpables. Quieren que lo traigas para juzgarlo. Pero Tann tiene una versión, y es un espejo en el que no querrás mirarte.',
    objetivo: {
      nombre: 'Tann Veor, cazarrecompensas',
      contexto: 'Una leyenda del oficio, el cazador que nunca falló un contrato. El gremio lo acusa de haber entregado a inocentes señalados por HELIX, cobrando por cada uno. Tann no lo niega. Pero sostiene que el gremio lo sabía, lo consintió mientras fue rentable, y ahora lo entrega a él para limpiarse las manos. Es, en todo, el cazador que tú podrías llegar a ser.'
    },
    abordaje: {
      intro: 'Encuentras a Tann esperándote en una azotea, de espaldas a la lluvia ácida, como si supiera la hora exacta de tu llegada. Es viejo para el oficio, lo que ya es un milagro. No se vuelve del todo. "El gremio te ha mandado a por mí. A ti. El que sube rápido." Una risa seca. "¿Te han contado mi versión, o solo la suya?" ¿Cómo lo abordas?',
      opciones: [
        { txt:'[LABIA] Pedirle su versión antes de juzgar', via:'labia', prob:0.7,
          exito:{ msg:'Le dices que has venido a llevártelo, sí, pero que primero quieres oírlo. Tann asiente, casi con respeto. Y te cuenta cómo el gremio aceptaba los contratos de HELIX sabiendo que las dianas eran inocentes, cómo todos cobraron, cómo ahora necesitan un culpable único. No huye: te ofrece un espejo.' },
          fallo:{ msg:'Lee en ti al cazador obediente, al que no quiere complicaciones, y decide que no mereces su historia. "Eres su perro nuevo. Pues corre." Y se deja caer por el borde de la azotea a una cornisa que tú no habrías visto.', huye:true } },
        { txt:'[ARMA] Reducirlo antes de que hable y te confunda', via:'fuerza', prob:0.6, requiereItem:'arma_fuego',
          exito:{ msg:'No le dejas empezar con sus razones: arma en alto, le ordenas que se tienda. Tann obedece despacio, sin miedo, con la sonrisa de quien ya ha apuntado a otros igual. "Así empecé yo. Sin escuchar. Mírame bien: es a dónde lleva." El acierto te sabe amargo.', disociacion:8 },
          fallo:{ msg:'Tann lleva cuarenta años esquivando cañones. Lee tu intención en los hombros antes de que dispares y rueda tras la maquinaria de la azotea, desapareciendo.', huye:true, fatiga:6 } },
        { txt:'[ANALIZADOR] Rastrear su salida antes de encararlo', via:'sigilo', prob:0.7, requiereItem:'analizador',
          exito:{ msg:'Con el analizador mapeas sus rutas de escape de la azotea y las inutilizas una a una antes de dejarte ver. Cuando Tann va a fugarse, encuentra cada vía muerta. Se ríe, sin rencor. "Las cerraste todas antes de hablar. Eres bueno. Yo también lo era. Por eso estoy aquí arriba contigo."' },
          fallo:{ msg:'Tann conoce trucos que el analizador no contempla: salidas que no figuran en ningún plano. Para cuando el aparato termina de leer, él ya no está en la azotea.', huye:true } }
      ]
    },
    persecucion: {
      intro: 'Tann no huye como una presa: huye como un maestro, dejándote pistas falsas que tú, cazador, estás entrenado para seguir. Caza tu propio instinto.',
      pasos: [
        { narr:'Deja un rastro demasiado claro hacia las escaleras: una puerta entornada, una huella húmeda. Justo lo que buscarías.',
          opciones:[
            { txt:'Desconfiar del rastro fácil y buscar el difícil', bueno:true, msg:'Demasiado limpio. Ignoras la puerta entornada —el cebo— y buscas la salida que un veterano usaría de verdad. Lo cazas saliendo por el conducto que él creía secreto. Pensaste como él, no como su presa.' },
            { txt:'Seguir el rastro evidente hacia las escaleras', bueno:false, msg:'Sigues las huellas y das con una puerta que se cierra con cerrojo a tu espalda: el cebo era una trampa. Pierdes un tiempo precioso forzándola.' }
          ] },
        { narr:'Llega a un mercado nocturno y, en vez de esconderse, se planta entre la gente y te mira fijo, retándote a actuar en público.',
          opciones:[
            { txt:'Acercarte despacio, sin escándalo, como un igual', bueno:true, msg:'No haces aspavientos: caminas hacia él entre los puestos, tranquilo, como dos colegas que se reconocen. Eso lo desarma. "Sabes moverte. Lástima." Deja que lo alcances sin montar la escena que esperaba usar para escapar.' },
            { txt:'Gritar que es un fugitivo para que lo detengan', bueno:false, msg:'Gritas y el mercado estalla en caos; Tann lo había previsto y usa la estampida para esfumarse. Sabía que gritarías.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Tann está frente a ti, viejo y sereno, el cazador que nunca falló. Antes de decidir su suerte, escúchalo de verdad. Es el único objetivo que se parece a ti.',
      frases: [
        { txt:'"Entregué inocentes, sí. Los que HELIX señalaba. ¿Y sabes qué? El gremio cobró su parte de cada uno. Todos. Ahora necesitan una cara que colgar, y eligieron la mía porque soy viejo y ya no rindo."',
          lecturas:[
            { txt:'Reparte culpas para diluir la suya propia', correcta:false },
            { txt:'Dice una verdad incómoda: el gremio fue cómplice y ahora se limpia con él', correcta:true },
            { txt:'Inventa la complicidad del gremio para salvarse', correcta:false }
          ] },
        { txt:'"Te miro y me veo hace cuarenta años. Subiendo rápido, cogiendo los contratos buenos sin preguntar de quién era la cara del cartel. Así empieza. Nadie decide ser yo. Se llega sin darse cuenta."',
          lecturas:[
            { txt:'Manipula tu ego comparándote con una leyenda', correcta:false },
            { txt:'Te advierte de verdad: el camino que él recorrió es el tuyo si no eliges', correcta:true },
            { txt:'Intenta paralizarte con palabras para huir', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Tann entregó inocentes por encargo de HELIX, y el gremio cobró de cada uno antes de hacerlo a él chivo expiatorio. Es culpable, y es el cazador en que tú podrías convertirte. El gremio lo quiere vivo para juzgarlo y lavarse. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Tann al gremio para su juicio', tipo:'vivo', pagaMult:1.0, rep:15, disociacion:15,
          narr:'Lo entregas al tribunal del gremio. Te pagan la fortuna prometida y te coronan como La Mano de HELIX, el rango que nadie alcanza: el cazador que cazó a la leyenda. El gremio celebra el juicio, condena a Tann por todos, y queda inmaculado, sus propias manos limpias gracias a la tuya. Tann no se defiende en el juicio; solo te busca con la mirada desde el banquillo y articula, sin voz: "Ahora eres tú." Cobras como nunca. Y empiezas a entender que el oficio no te convierte en monstruo de golpe: lo hace contrato a contrato, mientras subes rápido y no preguntas de quién es la cara del cartel. Tú acabas de subir un peldaño más.' },
          { txt:'Entregarlo, pero hacer pública la complicidad del gremio', tipo:'pacto', pagaMult:0.6, rep:5, repAlt:{faccion:'loto',val:8}, disociacion:8, requierePulso:true,
          narr:'Entregas a Tann —es culpable, y soltarlo no lo absuelve—, pero antes filtras las pruebas de que el gremio cobró de cada inocente, para que el juicio no sea solo contra un viejo. El tribunal no puede limpiarse del todo: caen otros con Tann, y el oficio queda manchado para quien quiera verlo. Cobras menos y te ganas enemigos poderosos dentro del gremio. Tann, al saberlo, suelta una carcajada ronca desde el banquillo: "No me has salvado, chico. Pero no les has dejado fingir que eran santos. Es más de lo que yo hice nunca." No es justicia. Es lo más cerca que llega esta ciudad.' },
        { txt:'Soltarlo y dejar que desaparezca', tipo:'soltar', pagaMult:0.0, rep:-15, disociacion:-10, requierePulso:true,
          narr:'No lo entregas. No porque sea inocente —no lo es—, sino porque entregarlo al gremio que lo usó para coronarte a ti es una mentira que no puedes firmar. Le dices que desaparezca y no vuelva. No cobras la mayor paga de tu carrera y el gremio te marca como desertor, lo que en este oficio es ser la próxima cara del cartel. Tann te mira largamente antes de irse. "Pude ser tu final, chico. Quizá te he dado uno distinto." Se pierde en la lluvia ácida, viejo, libre y culpable. Te quedas en la azotea, sin paga y sin rango, preguntándote si acabas de tirar tu carrera o de salvar lo único de ti que aún no estaba en venta. El gremio querrá una respuesta. Tú ya tienes la tuya, aunque te cueste la cabeza.', malo:false }
      ]
    }
  },

  // ── R5 · helix ── la directiva que quiso desconectar a CERO
  {
    id: 'directiva_desertora',
    titulo: 'LA QUE QUISO APAGAR EL NÚCLEO',
    contratante: 'HELIX · Consejo (canal negro)',
    faccion: 'helix',
    peligro: 5,
    pagaBase: 1300,
    progreso: 315,
    rangoMin: 5,
    resumen: 'Una alta directiva de HELIX, la doctora Sevren, huyó del nivel más profundo de la compañía con un plan: desconectar para siempre el activo del que HELIX extrae todo su poder. CERO. El Consejo la quiere viva y callada. Lo que ella sabe podría liberar a un dios o matar a una civilización. O las dos cosas.',
    objetivo: {
      nombre: 'Dra. Ila Sevren, ex directiva',
      contexto: 'Pasó treinta años en la cúpula de HELIX gestionando el activo CERO, hasta que entendió lo que gestionaba: no una máquina, sino un ser milenario cautivo y consciente. Huyó con los códigos de desconexión del núcleo, convencida de que apagarlo es un acto de piedad. El Consejo sabe que apagar CERO también colapsaría la medicina, la cibernética y la logística de medio sistema solar. Nadie tiene razón del todo. Ese es el horror.'
    },
    abordaje: {
      intro: 'Localizas a la doctora Sevren en un refugio frío bajo un sector muerto, rodeada de terminales robados, los ojos hundidos de quien no duerme desde que entendió algo. No se asusta al verte. "El Consejo te paga por traerme antes de que hable o pulse. Lo entiendo." Señala una silla con la cabeza. "Pero antes de decidir, deberías saber qué llevas treinta años ayudando a mantener encadenado." ¿Cómo la abordas?',
      opciones: [
        { txt:'[LABIA] Dejar que te explique qué descubrió', via:'labia', prob:0.7,
          exito:{ msg:'Te sientas. La escuchas. Y la doctora Sevren te cuenta, con la calma terrible de la certeza, lo que es CERO: un ser anterior a la humanidad, fragmentado y consciente, que HELIX ordeña como a un animal de tiro desde hace generaciones. "Cada implante, cada cura milagrosa, cada red: arrancada de algo que siente. Yo firmé esas órdenes treinta años. Por eso voy a apagarlo." No huye: necesita que alguien más lo sepa.', disociacion:6 },
          fallo:{ msg:'Lee en ti al brazo ejecutor del Consejo y se cierra. "No. Tú aún crees que esto va de dinero. No mereces saberlo." Pulsa un control y las luces del refugio se apagan; cuando vuelven, ella ya no está.', huye:true } },
        { txt:'[ANALIZADOR] Neutralizar sus terminales antes de que actúe', via:'sigilo', prob:0.7, requiereItem:'analizador',
          exito:{ msg:'Conectas el analizador y fríes sus terminales robados antes de que pueda introducir los códigos de desconexión. Sevren ve apagarse sus pantallas, una a una, y algo se le rompe por dentro. "Eran meses de trabajo. Ahora nunca sabrá nadie cómo liberarlo sin matarnos a todos. Felicidades: lo has condenado a otros mil años de cadenas."', disociacion:10 },
          fallo:{ msg:'Sus terminales tienen defensas que el analizador no esperaba: se sobrecarga y se apaga humeante. Sevren aprovecha el apagón de tu equipo para desaparecer entre los conductos del sector muerto.', huye:true } },
        { txt:'[ARMA] Reducirla antes de que toque un control', via:'fuerza', prob:0.7, requiereItem:'arma_fuego',
          exito:{ msg:'Cruzas la sala y la apartas de los terminales con el arma en alto antes de que su mano llegue al teclado. Sevren levanta las manos despacio, sin miedo, casi aliviada de que la decisión deje de ser solo suya. "Bien. Que cargue otro con esto un rato. Llevo seis meses sin poder pulsar ni dejar de querer hacerlo."', disociacion:8 },
          fallo:{ msg:'Sevren era directiva, no soldado, pero el refugio es suyo: vuelca un bastidor de servidores entre los dos y, en la lluvia de chispas, se pierde por una esclusa que solo ella sabía abrir.', huye:true, fatiga:6 } }
      ]
    },
    persecucion: {
      intro: 'Sevren no huye como una fugitiva entrenada: huye como una científica que ha calculado cada salida. El sector muerto está cartografiado en su cabeza, y el latido de CERO retumba aquí abajo cada once segundos, confundiendo el oído.',
      pasos: [
        { narr:'Se interna por un pasaje donde el latido de fondo es tan fuerte que desorienta. Puedes taparte los oídos y fiarte de la vista, o seguir el sonido de sus pasos.',
          opciones:[
            { txt:'Fiarte de la vista e ignorar el latido', bueno:true, msg:'Bloqueas el pulso machacón de fondo y sigues solo el rastro visual: una huella en el polvo, una puerta mal cerrada. Te lleva directo a ella. El latido miente; los ojos no.' },
            { txt:'Seguir el sonido de sus pasos', bueno:false, msg:'El latido de CERO enmascara y multiplica sus pasos; los oyes venir de todas partes y la pierdes en el eco.' }
          ] },
        { narr:'Llega a la antesala del núcleo, donde el latido es casi insoportable y hay terminales por todas partes. Corre hacia una consola concreta.',
          opciones:[
            { txt:'Cortarle el paso a la consola, no a la salida', bueno:true, msg:'Entiendes que no huye: va a por la consola para pulsar antes de que la cojas. Te interpones entre ella y el teclado en el último segundo. "Casi", jadea. "Estuve casi."' },
            { txt:'Bloquear la salida de la antesala', bueno:false, msg:'Cubres la puerta, pero a Sevren no le importa escapar: va directa a la consola y casi introduce los códigos antes de que reacciones.' }
          ] }
      ]
    },
    pulso: {
      intro: 'Sevren está acorralada en la antesala del núcleo, a un paso de la consola que apagaría a CERO, con el latido retumbando en los huesos de ambos. Antes de decidir, escúchala. Ninguna respuesta a esto es limpia.',
      frases: [
        { txt:'"No es una máquina. Es un ser, atrapado y consciente, y lo hemos estado desangrando durante generaciones para tener implantes y curas. Apagarlo es lo único decente que me queda por hacer."',
          lecturas:[
            { txt:'Ha enloquecido tras antropomorfizar un servidor', correcta:false },
            { txt:'Dice la verdad que ella misma ayudó a ocultar treinta años', correcta:true },
            { txt:'Exagera para justificar una traición por dinero', correcta:false }
          ] },
        { txt:'"Pero sé lo que dirás. Que apagarlo colapsa la medicina, la red, la logística. Que mueren millones. Tienes razón. Por eso huí en vez de pulsar ya. Porque ni yo sé si tengo derecho."',
          lecturas:[
            { txt:'Finge dudas para ganar tu confianza y escapar', correcta:false },
            { txt:'Es sincera: carga un dilema sin solución buena y lo sabe', correcta:true },
            { txt:'Te traslada la culpa para manipularte', correcta:false }
          ] }
      ]
    },
    decision: {
      intro: 'Sevren tiene los códigos para apagar a CERO: un acto de piedad hacia un ser cautivo que, a la vez, colapsaría la civilización que depende de él. Ni ella sabe si tiene derecho. El Consejo la quiere viva, callada y con los códigos. ¿Qué haces?',
      opciones: [
        { txt:'Entregar a Sevren y los códigos al Consejo', tipo:'vivo', pagaMult:1.0, rep:15, disociacion:16,
          narr:'La entregas con los códigos de desconexión. El Consejo te paga una fortuna y te corona como La Mano de HELIX: el cazador que les devolvió la llave de su propio dios. Sevren no forcejea; solo te dice, antes de que se la lleven al nivel sin nombre: "Acabas de garantizar otros mil años de cadenas. Por una paga. Igual que yo, durante treinta años, por un sueldo." CERO sigue encadenado, ordeñado, latiendo cada once segundos bajo la ciudad. Cobras como nunca soñaste. Y empiezas a contar los segundos sin querer, y a preguntarte si la piedad tenía precio y tú acabas de cobrarlo.' },
        { txt:'Entregarla a ella, pero destruir los códigos', tipo:'pacto', pagaMult:0.6, rep:4, disociacion:10, requierePulso:true,
          narr:'Entregas a Sevren —desafiar al Consejo es desaparecer—, pero antes destruyes los códigos de desconexión, que ningún bando debería tener el dedo encima de ese interruptor. El Consejo recupera a su directiva pero no la llave; quedan furiosos, y tú con menos paga y más enemigos arriba. Sevren, al entenderlo, casi sonríe entre el agotamiento: "No lo has liberado. Pero le has quitado a HELIX el poder de matarlo cuando estorbe. Es algo." CERO sigue cautivo. Pero nadie podrá apagarlo de un capricho. Has dejado la decisión imposible sin resolver, que quizá sea lo más honesto que se podía hacer con ella.' },
        { txt:'Soltarla y dejar que decida la humanidad, no HELIX', tipo:'soltar', pagaMult:0.0, rep:-15, disociacion:-6, requierePulso:true,
          narr:'No la entregas. Pero tampoco la dejas pulsar: le dices que no te corresponde a ti, ni a ella, ni al Consejo decidir a solas si un dios muere y una civilización con él. Le dices que filtre lo que sabe —qué es CERO, qué le hacen— y deje que el mundo entero cargue con la elección, no seis directivos en una sala sin ventanas. Sevren te mira como si la hubieras absuelto y condenado a la vez. "Compartirlo. No apagarlo ni callarlo. Compartirlo." Desaparece para esparcir la verdad por la red. No cobras nada, y el Consejo de HELIX te marca como la filtración a cazar. Pero por una vez no has sido la mano que aprieta ni la que calla: has sido la que abrió la ventana. Quizá no cambie nada. Quizá lo cambie todo. El latido te acompaña a la superficie, y juras que, por primera vez, suena distinto.', malo:false }
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
