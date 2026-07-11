// ============================================================
// BLOQUE JS-95 — TANDA "DERIVA" (v0.161)
// ------------------------------------------------------------
// Enriquecimiento de Fase Tierra. Contenido sandbox: NO toca la
// trama (ni CERO, ni Centauri, ni tramaNivel). Combates evitables
// y NO letales (contexto KO). Cada pieza se juega una vez
// (repetible + bandera _hecho, patrón de v0.154.1) y varias
// PLANTAN semilla nueva para cosechar más adelante.
//
//   CASOS (formato capítulo, decisión moral, ambiguos):
//     "El censo"          (censo_) -> borrado burocrático de una planta.
//     "La viuda de nadie" (viuda_) -> duelo imposible de un indocumentado.
//     "El turno de noche" (turno_) -> planta de procesado; gore justificado.
//   EXPLORAR:
//     "Piso en reinicio"  (reinicio_) -> una vida a medio retirar.
//   PROFESIONES (una puerta por oficio):
//     hacker         (hkd_) -> borrar la deuda de un muerto.
//     contrabandista (cxa_) -> la caja sellada que zumba.
//     seguridad      (scl_) -> vigilar una cola durante una revisión.
//
// Solo imágenes, items y condiciones que YA existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const D = {

  // ========================================================
  //  CASO — "EL CENSO"  (borrado burocrático)
  // ========================================================
  'censo_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'censo_hecho' },
    img: 'APT',
    texto: 'Doña Sabina, la del final del pasillo, te para con las manos temblando. No es miedo: es rabia vieja y cansada. '
         + '«Han borrado la planta siete», dice. No a la gente: la gente sigue ahí, respirando, cociendo, discutiendo. Los papeles. '
         + 'De un día para otro, cuarenta vecinos han dejado de constar en el registro de residentes. Sin registro no hay ración de agua, '
         + 'ni turno de clínica, ni siquiera derecho a que te entierren. «Existes o no existes», dice ella. «Y nosotros ya no.» '
         + 'Te ofrece lo poco que le queda por mirar debajo de esto.',
    opciones: [
      { texto: 'Aceptar. Bajar al registro público a ver qué pasó.',
        lleva: 'censo_registro' },
      { texto: 'No meterte en los papeles de HELIX. Nadie gana con eso.',
        efectos:{ marcaVisto:'censo_hecho', humano:{ aislamiento:+2 } },
        resultado: 'Le dices que no puedes ayudarla y ella asiente, como quien ya lo esperaba. Con los días, la planta siete se va apagando '
                 + 'sin ruido: primero el agua, luego la luz, luego los nombres en los buzones. No los echan. Simplemente dejan de existir, '
                 + 'y existir sin permiso cuesta más que morirse. Sabina deja de bajar al pasillo. Tú dejas de mirar hacia su puerta.' }
    ]
  },
  'censo_registro': {
    img: 'EXP_CIBERCAFE',
    texto: 'El terminal de registro público está en un cubículo que huele a plástico caliente. Buscas «planta 7, bloque C». La ficha existe, '
         + 'pero encima lleva una etiqueta gris: «Reasignada — sin residentes». Un funcionario joven, con ojeras de tres turnos, te ve leer y '
         + 'baja la voz sin que se lo pidas. «No fue un error», murmura. «Había que cuadrar una cuota de ocupación del sector. Alguien decidió '
         + 'que sobraba una planta. Los pasaron a no-residentes. En el papel es limpísimo. En la calle es gente que ya no puede pedir agua.» '
         + 'Mira por encima del hombro. Está más asustado que tú.',
    opciones: [
      { texto: 'Presionarle para que te diga quién firmó la cuota.',
        efectos:{ humano:{ disociacion:+1 } },
        resultado: 'Traga saliva. «Nadie firma estas cosas con nombre. Es un ajuste automático que un directivo aprueba sin leer. Si lo '
                 + 'revierto yo, mañana soy yo el no-residente.» Te da lo único que puede: acceso de lectura al asiento, cinco minutos, '
                 + 'antes de que caduque su sesión. El resto lo tienes que decidir tú.', lleva:'censo_decision' },
      { texto: 'Copiar el asiento con el error a un chip. Prueba es prueba.',
        efectos:{ item:'chip_datos_corrupto' },
        resultado: 'Vuelcas el asiento al chip mientras el funcionario mira a otro lado, agradecido de no tener que mirar. Ahora llevas encima '
                 + 'la prueba de que cuarenta personas fueron borradas para que un número cuadrara. Pesa poco. Pesa muchísimo.', lleva:'censo_decision' }
    ]
  },
  'censo_decision': {
    img: 'APT',
    texto: 'Tienes el hueco abierto. Puedes volver a meter la planta siete en el registro, con tu rastro dentro del sistema para siempre. '
         + 'Puedes dejarlo estar y que se apaguen en paz que no es paz. O hay quien paga bien por saber cómo se manipula una cuota de sector. '
         + 'Cuarenta personas dependen de qué haces en el próximo minuto, y ninguna sabe que existes.',
    opciones: [
      { texto: 'Restaurarlos. Volver a escribir sus nombres.',
        efectos:{ marcaVisto:'censo_hecho', marcas:['censo_restaure'], humano:{ disociacion:+1 } },
        resultado: 'Reescribes el asiento y lo cierras antes de que caduque la sesión. No pasa nada épico: una barra de progreso, un pitido. '
                 + 'Una semana después el agua vuelve a la planta siete y nadie sabe por qué. Sabina vuelve a bajar al pasillo. No te da las '
                 + 'gracias porque no sabe a quién dárselas. En algún registro de incidencias de HELIX, en cambio, ahora hay una anomalía con '
                 + 'tu firma dentro, esperando a que alguien la lea.' },
      { texto: 'Dejarlo. No es tu guerra y perderías.',
        efectos:{ marcaVisto:'censo_hecho', marcas:['censo_abandone'], humano:{ aislamiento:+3 } },
        resultado: 'Cierras la sesión sin tocar nada. Los vecinos de la siete se van volviendo transparentes: siguen ahí, pero el mundo deja '
                 + 'de responderles. Te repites que no podías hacer nada, y casi te lo crees. Casi.' },
      { texto: 'Vender el método. Alguien pagará por saber cómo se borra una planta.',
        efectos:{ marcaVisto:'censo_hecho', marcas:['censo_vendi'], creditos:+180 },
        resultado: 'Envuelves el truco de la cuota y lo vendes a quien sabe usarlo. Comes caliente varios días. La planta siete sigue borrada, '
                 + 'y ahora hay quien sabe cómo borrar la siguiente. Duermes con la luz encendida sin admitir por qué.' }
    ]
  },

  // ========================================================
  //  CASO — "LA VIUDA DE NADIE"  (duelo imposible)
  // ========================================================
  'viuda_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'viuda_hecho' },
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Orin come sola en el comedor del sector B, removiendo una ración que no toca. Te habla sin mirarte. Su marido murió hace tres '
         + 'semanas, y HELIX no le da el certificado de defunción: para expedirlo hace falta que el difunto constara como vivo, y él nunca '
         + 'constó. Vivió cuarenta años esquivando el registro. «No puedo llorarlo», dice, y lo dice sin lágrimas, que es peor. «Sin papel '
         + 'no está muerto. Está en un limbo de oficina. Y los cobradores siguen llamando a un hombre que ya no puede coger el teléfono.» '
         + 'Te pide que confirmes que existió lo bastante para poder estar muerto.',
    opciones: [
      { texto: 'Aceptar. Buscar el rastro de un hombre que no quiso dejarlo.',
        lleva: 'viuda_rastro' },
      { texto: 'Decirle que eso no lo arregla nadie. Marcharte.',
        efectos:{ marcaVisto:'viuda_hecho', humano:{ aislamiento:+2 } },
        resultado: 'Le dices la verdad más fácil: que contra una oficina no se puede. Orin asiente y sigue removiendo la ración. Al salir la '
                 + 'oyes murmurar un nombre, el de él, como quien comprueba que todavía sabe pronunciarlo.' }
    ]
  },
  'viuda_rastro': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El rastro de un hombre que se escondió toda la vida son migas: un vale de trabajo a nombre falso, un escaneo de clínica con un '
         + 'apellido prestado, una firma en una lista de comedor. Poco a poco lo reconstruyes. No se escondía por delincuente: se escondía de '
         + 'una deuda que no era suya, heredada de un padre al que tampoco conoció. Vivir sin constar era la única forma de que la deuda no lo '
         + 'encontrara. Y funcionó, hasta que un andamio cedió y lo mató de la forma más tonta y anónima posible. Ahí está el problema: '
         + 'demostrar que vivió es demostrar que la deuda ahora tiene una viuda a la que cobrar.',
    opciones: [
      { texto: 'Llevarle la prueba de que vivió, y de que murió.',
        lleva: 'viuda_decision' },
      { texto: 'Decirle que no encontraste nada. Dejarle la duda.',
        efectos:{ marcaVisto:'viuda_hecho', marcas:['viuda_menti'], humano:{ disociacion:+2 } },
        resultado: 'Le dices que no hay rastro, que quizá se marchó sin más. Ves cómo algo en ella se agarra a ese «quizá». Le acabas de '
                 + 'regalar la posibilidad de que él vuelva, y le acabas de robar el derecho a enterrarlo. No sabes cuál de las dos pesa más, '
                 + 'y ella tampoco lo sabrá nunca.' }
    ]
  },
  'viuda_decision': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Tienes las dos verdades en la mano. Una: puedes darle a Orin la prueba de que su marido existió y murió, y con ella el certificado, '
         + 'el duelo, el entierro. Y, en el mismo sobre, la deuda heredada cayéndole encima al día siguiente. Dos: puedes fabricarle un papel '
         + 'que diga que ese hombre nunca existió. Se queda libre de la deuda, y sin ningún lugar oficial donde llorarlo.',
    opciones: [
      { texto: 'Darle la verdad. Que pueda enterrarlo.',
        efectos:{ marcaVisto:'viuda_hecho', marcas:['viuda_verdad'], humano:{ disociacion:+1 } },
        resultado: 'Orin lee el papel y por fin llora, callada, como si llevara semanas conteniendo el aire. Puede enterrarlo. A la mañana '
                 + 'siguiente los cobradores cambian el nombre al que llaman: ahora es el de ella. Le has devuelto a su muerto y le has puesto '
                 + 'la deuda en la puerta. Ella lo sabía. Aun así te dio las gracias.' },
      { texto: 'Fabricar que nunca existió. Que se quede libre.',
        efectos:{ marcaVisto:'viuda_hecho', marcas:['viuda_piedad'], humano:{ aislamiento:+2 } },
        resultado: 'Falsificas un vacío: un hombre que oficialmente no pasó por el mundo. La deuda se queda sin nadie a quien cobrar y se '
                 + 'apaga. Orin lo entiende: no habrá lápida, ni certificado, ni fecha. Solo ella, sabiendo en privado que existió, guardando '
                 + 'un duelo que ningún papel va a reconocer. «Mejor así», dice. No suena a mejor.' }
    ]
  },

  // ========================================================
  //  CASO — "EL TURNO DE NOCHE"  (planta de procesado)
  // ========================================================
  'turno_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'turno_hecho' },
    img: 'EXP_ALMACEN_HELIX',
    texto: 'Baco te espera fuera de la planta de «recuperación de materia orgánica» de HELIX, todavía con el mono de trabajo puesto. Lleva '
         + 'ocho años en la cinta nocturna, separando lo que fue gente en piezas que aún valen. Se ha acostumbrado a casi todo. Casi. Anoche '
         + 'reconoció una cara en la cinta: un crío de su antiguo bloque, uno al que vio crecer. «No puedo preguntar dentro», dice, y le tiembla '
         + 'la voz de una forma que no le tiembla a un hombre que separa cadáveres por rutina. «Si pregunto, pierdo el turno, y con el turno '
         + 'comen mis hijos. Pero necesito saber a dónde fue.»',
    opciones: [
      { texto: 'Aceptar. Colarte en el turno de noche.',
        lleva: 'turno_planta' },
      { texto: 'Decirle que algunas cosas es mejor no saberlas.',
        efectos:{ marcaVisto:'turno_hecho', humano:{ aislamiento:+2 } },
        resultado: 'Le dices que lo deje ir, que saberlo no le va a devolver al crío. Baco asiente despacio y vuelve a entrar a fichar. Sabes '
                 + 'que va a seguir mirando cada cara de la cinta buscando la que ya vio. Algunos turnos no terminan cuando suena la sirena.' }
    ]
  },
  'turno_planta': {
    img: 'EXP_PUERTO_CARGA',
    texto: 'Dentro, el horror no grita: cuenta. Todo es limpio, frío, numerado. Los cuerpos entran como lotes, salen como referencias de '
         + 'catálogo. Encuentras el del crío en el manifiesto sin esfuerzo, porque aquí todo está anotado: «LOTE 44-C. Destino: reclamación de '
         + 'garantía.» Lo lees dos veces. Sus piezas estaban vendidas antes de que muriera. Un préstamo que su familia firmó años atrás dejaba '
         + 'el cuerpo del crío como aval. Cuando dejó de ser rentable seguir vivo, HELIX ejecutó la garantía. Nada de esto es ilegal. Un dron '
         + 'supervisor registra tu presencia con un parpadeo azul, sin alarma. Aquí no hace falta.',
    opciones: [
      { texto: 'Llevarte el manifiesto. Que quede constancia.',
        efectos:{ item:'papel_helix' },
        resultado: 'Doblas la hoja y te la guardas contra el pecho. Un papel con el precio de un niño desglosado por partes. Sales antes de '
                 + 'que el dron decida que ya te ha mirado bastante.', lleva:'turno_decision' },
      { texto: 'No tocar nada. Memorizarlo y salir.',
        resultado: 'No te llevas nada. Sales con el número grabado detrás de los ojos, «44-C», y con la certeza de que vas a tardar en dormir '
                 + 'sin verlo.', lleva:'turno_decision' }
    ]
  },
  'turno_decision': {
    img: 'EXP_ALMACEN_HELIX',
    texto: 'Baco te espera con la pregunta entera en la cara. Puedes darle la verdad, toda, con su desglose y su firma legal. O puedes darle '
         + 'una versión que le deje seguir fichando: que al crío lo reasignaron a otro sector, que está bien. Una mentira que come, contra una '
         + 'verdad que no deja comer.',
    opciones: [
      { texto: 'Contarle la verdad. Toda.',
        efectos:{ marcaVisto:'turno_hecho', marcas:['turno_verdad'], humano:{ disociacion:+2 } },
        resultado: 'Baco escucha sin interrumpir. Cuando terminas, no dice nada durante mucho rato. Luego asiente, una vez, como se asiente a '
                 + 'una sentencia. A la semana siguiente su puesto en la cinta amanece vacío. Nadie sabe si lo dejó, si lo echaron o algo peor. '
                 + 'No sabes si contarle la verdad fue lo mejor que has hecho este mes o lo peor.' },
      { texto: 'Mentirle. Que pueda seguir viniendo a trabajar.',
        efectos:{ marcaVisto:'turno_hecho', marcas:['turno_menti'], humano:{ aislamiento:+3 } },
        resultado: 'Le dices que reasignaron al crío, que está en otro sector, que está bien. Baco cierra los ojos y respira por primera vez en '
                 + 'toda la noche. Te da las gracias y vuelve a fichar al día siguiente, y al otro. Tú te quedas con lo que sabes doblado en un '
                 + 'bolsillo que no vuelves a abrir.' }
    ]
  },

  // ========================================================
  //  EXPLORAR — "PISO EN REINICIO"
  // ========================================================
  'reinicio_1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'reinicio_hecho' },
    img: 'APT',
    texto: 'Una puerta abierta en un rellano que no es el tuyo. Dentro, una cuadrilla de «reinicio» ha dejado el trabajo a medias para bajar '
         + 'a fumar: vacían el piso para el siguiente inquilino. La vida anterior sigue aquí, a trozos. Marcas de lápiz en el marco de una puerta, '
         + 'midiendo a un niño año a año. Una olla todavía en el fogón, con algo dentro que ya se enfrió. Un aviso de HELIX, «unidad en '
         + 'regularización», pegado sobre una foto que alguien no quiso descolgar. En las Pilas, un piso vacío es una hora de ventaja sobre el '
         + 'que venga a llevárselo.',
    opciones: [
      { texto: 'Rebuscar rápido algo que valga. Los muertos no reclaman.',
        efectos:{ marcaVisto:'reinicio_hecho', item:'creditos_sucios' },
        resultado: 'Revuelves cajones con el oído puesto en la escalera. Encuentras un fajo pequeño escondido en una lata de té. Te lo guardas '
                 + 'y sales antes de que suban. Lo que no reclama nadie, en las Pilas, es tuyo. Te lo repites bajando las escaleras.' },
      { texto: 'Apagar el fogón que dejaron encendido y marcharte.',
        efectos:{ marcaVisto:'reinicio_hecho', humano:{ disociacion:+1 } },
        resultado: 'Giras la llave del fogón. La llama se apaga con un suspiro. Una decencia pequeña e inútil por alguien que ya no la va a '
                 + 'agradecer. Sales con las manos vacías y algo menos frío por dentro, o eso te dices.' },
      { texto: 'Coger la foto que dejaron y llevártela.',
        efectos:{ marcaVisto:'reinicio_hecho', marcas:['reinicio_foto'], item:'foto_quemada' },
        resultado: 'Despegas la foto de debajo del aviso de HELIX. Una cara que no conoces, sonriendo en un sitio que ya no existe. La doblas '
                 + 'y te la guardas. No sabes por qué. Quizá porque alguien debería quedarse con ella, y no va a ser la cuadrilla de reinicio.' }
    ]
  },

  // ========================================================
  //  PROFESIÓN · HACKER — "Borrar una deuda"
  // ========================================================
  'hkd_1': {
    entrada: true,
    repetible: true, cond: { profesion: 'hacker', noVisto: 'hkd_hecho' },
    img: 'EXP_CIBERCAFE',
    texto: 'Te llega el encargo de refilón, como llegan las cosas turbias: un vecino murió, y HELIX facturó a la familia la «recogida y '
         + 'procesamiento» del cuerpo. Ciento cincuenta créditos por venir a llevarse a su muerto. La viuda no puede pagarlo y no se atreve a '
         + 'pedirlo de frente, así que lo pregunta a través de tres bocas hasta llegar a la tuya: ¿se puede hacer que esa deuda, sin más, '
         + 'desaparezca? Tú, que lees el mundo por sus costuras, ves el nodo de facturación desde aquí. Está mal cerrado, como todo lo que '
         + 'HELIX considera demasiado pequeño para vigilar.',
    opciones: [
      { texto: 'Borrarla limpiamente. Entrar, borrar, salir.',
        efectos:{ marcaVisto:'hkd_hecho', marcas:['hkd_borre'], humano:{ disociacion:+1 } },
        resultado: 'Entras por la costura, encuentras la factura y la disuelves como quien borra una palabra a lápiz. La familia deja de recibir '
                 + 'avisos. Dentro de unos meses, un cuadre automático detectará un descuadre de ciento cincuenta créditos en un informe que no '
                 + 'lee nadie, y lo achacará a un error de sistema. Que es, más o menos, lo que fue.' },
      { texto: 'Borrarla y dejarte una puerta abierta en facturación.',
        efectos:{ marcaVisto:'hkd_hecho', marcas:['hkd_backdoor'], creditos:+40 },
        resultado: 'Borras la deuda y, ya que estás dentro, dejas una rendija abierta en el nodo de facturación de HELIX: una llave tuya para '
                 + 'un día de lluvia. La familia respira. Tú te quedas con algo más valioso que su agradecimiento: una forma de volver a entrar '
                 + 'cuando lo necesites. Las puertas que dejas abiertas también dejan pasar el aire frío.' },
      { texto: 'No arriesgarte. Decir que no se puede.',
        efectos:{ marcaVisto:'hkd_hecho', humano:{ aislamiento:+1 } },
        resultado: 'Mandas recado de que la deuda no se toca. No es verdad, pero es prudente: dejar rastro en HELIX por ciento cincuenta '
                 + 'créditos es cambiar tu pellejo por el suyo. La familia pagará la recogida de su muerto a plazos, durante años. Algunas '
                 + 'deudas se dejan estar porque el precio de borrarlas lo pagas tú.' }
    ]
  },

  // ========================================================
  //  PROFESIÓN · CONTRABANDISTA — "La caja que zumba"
  // ========================================================
  'cxa_1': {
    entrada: true,
    repetible: true, cond: { profesion: 'contrabandista', noVisto: 'cxa_hecho' },
    img: 'EXP_PUERTO_CARGA',
    texto: 'El encargo es sencillo sobre el papel: mover una caja sellada por tres controles hasta el puerto de carga. Sin manifiesto. Una '
         + 'sola regla, repetida dos veces para que no se te olvide: no la abras. La caja pesa poco y está templada, más de lo que debería. Y '
         + 'zumba: un zumbido fino, irregular, con pausas. Casi como algo que respira. Te pagan por no pensar en eso.',
    opciones: [
      { texto: 'Moverla sin mirar, como se pactó.',
        efectos:{ marcaVisto:'cxa_hecho', marcas:['cxa_calle'], creditos:+120 },
        resultado: 'Pasas los tres controles con la caja pegada al cuerpo y la cara de aburrimiento de quien lleva chatarra. En la entrega, el '
                 + 'zumbido se detiene en cuanto la caja cambia de manos. Decides que era una máquina, un compresor, un juguete caro. Lo decides '
                 + 'con fuerza, porque en tu oficio quien pregunta poco vive más, y esta noche prefieres vivir a saber.' },
      { texto: 'Abrir una rendija. Necesitas saber qué transportas.',
        lleva: 'cxa_abrir' }
    ]
  },
  'cxa_abrir': {
    img: 'EXP_PUERTO_CARGA',
    texto: 'Levantas una esquina del sellado, solo una. Dentro no hay droga, ni armas, ni órganos. Hay una incubadora médica de HELIX, de las '
         + 'de neonatos, funcionando con una batería que le queda medio dedo de carga. Y dentro de la incubadora, algo pequeño, dormido, sin una '
         + 'sola marca: un bebé sin código de barras, sin registro, sin existir. Alguien lo saca de la ciudad precisamente para que pueda no '
         + 'existir, que aquí es la única forma de ser libre. Ahora lo sabes. Y saberlo pesa.',
    opciones: [
      { texto: 'Volver a sellarla y entregar igual.',
        efectos:{ marcaVisto:'cxa_hecho', marcas:['cxa_supe'], creditos:+120 },
        resultado: 'Sellas la esquina, entregas la caja y cobras. No preguntas quién espera al otro lado ni por qué a un crío hay que meterlo en '
                 + 'una caja para dejarlo libre. La batería aguanta hasta la entrega. Te repites que has hecho tu trabajo. Es verdad. No ayuda.' },
      { texto: 'Cambiar el destino. Llevárselo a alguien de fiar.',
        efectos:{ marcaVisto:'cxa_hecho', marcas:['cxa_desvie'], humano:{ aislamiento:+2 } },
        resultado: 'Rompes el contrato, que en tu oficio es lo único que de verdad no se rompe. Desvías la caja a unas manos en las que confías, '
                 + 'o casi. La batería no habría llegado a la ruta original, eso lo sabes. Lo que también sabes es que los contrabandistas tienen '
                 + 'memoria larga para quien no entrega, y tú acabas de convertirte en ese quien.' }
    ]
  },

  // ========================================================
  //  PROFESIÓN · SEGURIDAD — "La cola"
  // ========================================================
  'scl_1': {
    entrada: true,
    repetible: true, cond: { profesion: 'seguridad', noVisto: 'scl_hecho' },
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'HELIX te paga por mantener el orden en la cola de una «revisión de residencia». La gente lleva desde el amanecer de pie bajo la '
         + 'llovizna. Tus órdenes son simples: que la fila avance y que saques a quien le salte la ficha en rojo. Le salta a una vieja que no '
         + 'entiende qué ha hecho mal. Solo quiere renovar su ración, como cada mes. Detrás de ella, doscientas personas que no quieren perder '
         + 'su turno miran para otro lado.',
    opciones: [
      { texto: 'Cumplir. Sacarla de la cola.',
        efectos:{ marcaVisto:'scl_hecho', marcas:['scl_cumpli'], creditos:+90, humano:{ disociacion:+2 } },
        resultado: 'La coges del brazo con suavidad y la acompañas fuera. No se resiste. No grita. Solo repite que ella siempre ha estado en '
                 + 'regla, con una vocecita que se te queda dentro. Eso es lo peor: que no pelee. Cobras puntual al final del turno. El dinero '
                 + 'está limpio. Tú, un poco menos.' },
      { texto: 'Mirar para otro lado y dejarla pasar.',
        efectos:{ marcaVisto:'scl_hecho', marcas:['scl_deje'], alerta:+3, humano:{ aislamiento:+1 } },
        resultado: 'Te giras a «revisar» la cola justo cuando ella cruza el control. Consigue su ración y desaparece sin saber que le has hecho '
                 + 'un favor. Un supervisor anota tu «inconsistencia» en algún parte. Una marca pequeña contra ti, de esas que se acumulan. '
                 + 'Ella nunca sabrá tu nombre, y así está bien.' },
      { texto: 'Sellarle tú mismo la ficha con papeleo falso.',
        efectos:{ marcaVisto:'scl_hecho', marcas:['scl_falsifique'], humano:{ disociacion:+1 } },
        resultado: 'Le pones tú el sello de conformidad, saltándote el rojo. Hoy funciona: la vieja pasa, agradecida sin entender por qué. Pero '
                 + 'la falsificación lleva el identificador de tu terminal grabado debajo, pequeñito. Si alguien alguna vez rebobina esa cola, tu '
                 + 'firma estará ahí, sujetando la mentira.' }
    ]
  }

  };

  Object.assign(ESCENAS_GUION, D);
})();
