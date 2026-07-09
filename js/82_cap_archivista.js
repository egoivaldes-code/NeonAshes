// ============================================================
// BLOQUE JS-82 — CAPÍTULO "LA ARCHIVISTA" (columna principal)
// ------------------------------------------------------------
// Primer CAPÍTULO profundo de la misión principal (frente a los
// eslabones cortos anteriores). Continúa "El módulo" (js/81): del
// módulo salió un nombre —Coll— y un lugar: Midbelt.
//
// FILOSOFÍA (aprobada con Nemesis):
//   · Profundidad, no islas de 5 min: cuatro movimientos, varias
//     entradas, un testigo con dos destinos, tres vías al depósito,
//     combate DURO y cuatro desenlaces que dejan marca.
//   · NUNCA obliga a jugar el sandbox para avanzar: el capítulo se
//     juega entero dentro de sí mismo.
//   · Ninguna vía es el atajo gratis. El combate carga el riesgo
//     FÍSICO (heridas, fatiga, disociación). Las vías alternativas
//     cargan el riesgo en INFORMACIÓN, FUTURO y DEUDAS (perder la
//     verdad, quedar "quemado" en Midbelt, deber un favor que muerde).
//   · La trama TIENE QUE PODER SEGUIR SIEMPRE: aunque la fastidies del
//     todo, el capítulo TERMINA —peor, con la verdad a medias y
//     cicatrices— pero no te deja atascado.
//   · Sigue EN SOMBRA: encuentras PARTE de lo que Coll cataloga
//     (formatos viejos con el sello del módulo), pero ni Centauri ni
//     CERO todavía. Clava el gancho del giro.
//
// BANDERAS INTERNAS DEL CAPÍTULO (marcaVisto):
//   ca_deuda          debes un favor (muerde en un capítulo futuro)
//   ca_fichado        te pillaron al entrar → pierdes las vías calladas
//   ca_f_testigo      foco del testigo resuelto (te da la localización)
//   ca_testigo_vivo   te lo ganaste: vive y reaparecerá
//   ca_testigo_muerto lo presionaste: habló y desapareció
//   ca_f_registros    foco de registros resuelto
//   ca_verdad_fecha   tienes la contradicción de fechas (pieza fuerte)
//   ca_f_admin        foco de administración resuelto
//   ca_cache          conseguiste lo que Coll guardaba
//   ca_sin_cache      saliste sin ello (verdad a medias)
//   ca_quemado        Midbelt se te cierra para más adelante
//   cap_arch_hecho    capítulo completado (desbloquea el giro)
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CAP = {

  // ============================================================
  // MOVIMIENTO 1 — SUBIR A MIDBELT (la frontera de clase)
  // ============================================================
  'cap_arch_p1': {
    entrada: true,
    repetible: true, // si se interrumpe a medias, vuelve a ofrecerse
    cond: { visto: 'mara3_hecha', noVisto: 'cap_arch_hecho' },
    img: 'APT',
    texto: 'Otro parpadeo cifrado en la lente. Mara, seca, como si continuara una conversación de hace días.<br><br>'
         + '<span style="color:var(--magenta)">«El nombre que salió del módulo. Coll. Catalogaba arriba, en Midbelt, lo que HELIX prefería perder. '
         + 'Sube a verla. Y escúchame: arriba no te echan a empujones. Te sonríen mientras te cierran las puertas. No montes un espectáculo.»</span><br><br>'
         + 'El ascensor hacia Midbelt te pide un permiso que no tienes. Te quedas mirando el lector como un idiota. Abajo, en las Pilas, '
         + 'entras donde quieras a base de saber por dónde. Aquí no. Aquí la primera puerta ya te recuerda que no eres de los suyos.',
    opciones: [
      { texto: 'Pagar un pase temporal de visitante.',
        efectos: { creditos:-60 },
        resultado: 'Sesenta créditos por unas horas de aire limpio y luz simulada. El lector te suelta un pase provisional que '
                 + 'te marca como lo que eres: alguien de paso, vigilado con educación. Subes limpio, al menos.',
        lleva: 'cap_arch_midbelt' },
      { texto: 'Pedirle el favor a un contacto que te debe una.',
        efectos: { marcaVisto:'ca_deuda' },
        resultado: 'Una llamada, un nombre, y de pronto el lector se pone verde sin que pagues nada. Cómodo. Demasiado. '
                 + 'Ahora eres tú quien debe, y esa clase de deuda arriba no se olvida sola. Ya vendrán a cobrártela.',
        lleva: 'cap_arch_midbelt' },
      { texto: 'Colarte por un acceso de servicio.',
        azar: { prob: 0.5,
          exito: { resultado: 'Encuentras un montacargas de mantenimiento con la lente ciega tres segundos cada minuto. '
                            + 'Cuentas, respiras, y subes por el hueco de todos los que no cuentan aquí. Nadie te ve. Perfecto.' },
          fallo: { efectos:{ marcaVisto:'ca_fichado', fatiga:+4 },
                   resultado: 'Casi lo tienes, pero una lente que creías muerta parpadea justo cuando pasas. No suena ninguna alarma —arriba '
                            + 'no hace falta— pero notas cómo un sistema, en algún sitio, te guarda la cara. Subes. Fichado. Y eso, aquí, lo pagas luego.' } },
        lleva: 'cap_arch_midbelt' }
    ]
  },

  // ============================================================
  // HUB DE INVESTIGACIÓN (Movimiento 2). Se vuelve aquí tras cada foco.
  // ============================================================
  'cap_arch_midbelt': {
    img: 'APT',
    texto: 'Midbelt es más limpio, más callado, mejor iluminado. Huele a nada. La gente no te mira mal: simplemente no te mira, '
         + 'como si mirarte fuera ensuciarse un poco.<br><br>'
         + 'La oficina de Coll tiene un cartel impecable pegado en la puerta: <i>«Unidad en reactualización de servicios.»</i> '
         + 'Lleva así, te dirán, "una temporada". Tienes que averiguar qué le pasó y, sobre todo, adónde fue a parar lo que guardaba.',
    opciones: [
      { texto: 'El testigo: un vecino que sabe algo y tiene miedo.',
        cond: { noVisto:'ca_f_testigo' }, lleva:'cap_arch_testigo' },
      { texto: 'Los registros: cruzar fechas de la reubicación.',
        cond: { noVisto:'ca_f_registros' }, lleva:'cap_arch_registros' },
      { texto: 'La administración: preguntar por los cauces oficiales.',
        cond: { noVisto:'ca_f_admin' }, lleva:'cap_arch_admin' },
      { texto: 'Ya sabes adónde ir. Bajar a por lo que Coll guardaba.',
        cond: { visto:'ca_f_testigo' }, lleva:'cap_arch_deposito' }
    ]
  },

  // ---- FOCO: el testigo (pieza central; dos destinos) ----
  'cap_arch_testigo': {
    img: 'APT',
    texto: 'El vecino es un hombre mayor que riega unas plantas que no necesitan agua solo por tener las manos ocupadas. '
         + 'Sabe quién eres antes de que abras la boca —la gente de abajo se huele— y ya está asustado.<br><br>'
         + '«Coll era buena persona. Preguntó lo que no debía, una vez. Una.» Traga saliva. «No sé si debería contarte nada.»',
    opciones: [
      { texto: 'Presionarlo. No tienes toda la noche.',
        efectos: { marcaVisto:'ca_f_testigo', disociacion:+5 },
        resultado: 'Le aprietas. Funciona: te suelta que a Coll se la llevaron "a reubicar" y adónde bajaron sus cajas —un depósito cerrado, '
                 + 'nivel técnico. Pero mientras te lo dice le tiemblan las manos, y tú ya sabes que has firmado algo.<br><br>'
                 + 'Dos días después, cuando vuelvas a pasar, su puerta tendrá el mismo cartel impecable que la de Coll. No preguntarás. '
                 + 'Ya sabes leerlos.',
        lleva:'cap_arch_midbelt' },
      { texto: 'Ganártelo. Sentarte, escuchar, prometer que no saldrá de ti.',
        efectos: { marcaVisto:'ca_f_testigo', fatiga:+6 },
        lleva:'cap_arch_testigo_vivo' }
    ]
  },
  // Pequeño paso para marcar dos banderas (el motor aplica un marcaVisto por
  // bloque de efectos); aquí sellamos "testigo vivo" y volvemos al hub.
  'cap_arch_testigo_vivo': {
    img: 'APT',
    texto: 'Le dedicas el tiempo que no tienes. Te sientas, bajas la voz, dejas que hable de Coll como se habla de alguien a quien se echa de menos. '
         + 'Al final confía: te da la localización del depósito y, además, un detalle que no le habrías sacado a la fuerza —Coll le dejó una llave de servicio '
         + '"por si algún día venía alguien de fuera preguntando lo correcto".<br><br>'
         + 'Le prometes que no saldrá de ti, y por una vez piensas cumplirlo. Sigue vivo. Quizá lo vuelvas a ver.',
    opciones: [
      { texto: 'Guardar la llave y volver a lo demás.',
        efectos: { marcaVisto:'ca_testigo_vivo' },
        resultado: 'Te guardas la llave de servicio de Coll. Puede que no sirva de nada. Puede que te salve el pellejo ahí abajo.',
        lleva:'cap_arch_midbelt' }
    ]
  },

  // ---- FOCO: los registros (la contradicción de fechas) ----
  'cap_arch_registros': {
    img: 'APT',
    texto: 'Los registros públicos de reubicación de Coll están ahí, a la vista, perfectos. Demasiado perfectos: ni una tachadura, ni un hueco, '
         + 'ni una firma torcida. La clase de expediente que solo queda así cuando alguien lo ha reescrito entero.',
    opciones: [
      { texto: 'Cruzar las fechas como es debido.',
        req: { profesion: { id:'investigador' } }, pista:'haría falta oficio de investigador',
        efectos: { marcaVisto:'ca_f_registros' },
        resultado: 'Tú no lees lo que pone; lees lo que no cuadra. Y no cuadra: la orden de reubicación de Coll está firmada ANTES que la '
                 + 'petición que supuestamente la motivó. Alguien rellenó el formulario antes de que existiera el motivo. La clase de error que '
                 + 'solo comete quien ya sabía cómo terminaba la historia antes de empezarla.',
        lleva:'cap_arch_registros_fecha' },
      { texto: 'Rebuscar a mano, sin oficio, a base de paciencia.',
        azar: { prob: 0.55,
          exito: { resultado: 'Horas de bostezos y letra pequeña, pero das con ello: la fecha de la orden es anterior a la de la petición. '
                            + 'Alguien tenía prisa por reubicar a Coll antes de tener una excusa.' },
          fallo: { efectos:{ fatiga:+5 },
                   resultado: 'Horas perdidas entre formularios que se muerden la cola. No sacas nada en claro salvo dolor de cabeza. '
                            + 'La verdad estaba ahí, seguramente, pero no la ves. Te vas con las manos vacías de esta.' } },
        lleva:'cap_arch_registros_cierre' },
      { texto: 'Sobornar a un administrativo para que te lo cante.',
        efectos: { creditos:-80, marcaVisto:'ca_f_registros' },
        resultado: 'Ochenta créditos deslizados con disimulo y un administrativo cansado te confirma lo que sospechabas: la orden de Coll '
                 + 'lleva fecha anterior a su propio motivo. «Aquí eso pasa más de lo que cree», murmura, y ya no te mira más.',
        lleva:'cap_arch_registros_fecha' }
    ]
  },
  // Sella la pieza fuerte (fecha) y vuelve al hub.
  'cap_arch_registros_fecha': {
    img: 'APT',
    texto: 'Te queda claro: lo de Coll no fue un traslado. Fue una decisión tomada de antemano, con calma, por alguien con la autoridad '
         + 'de reescribir el pasado en un formulario.',
    opciones: [
      { texto: 'Guardarlo y volver a lo demás.',
        efectos: { marcaVisto:'ca_verdad_fecha' },
        resultado: 'Una pieza fea, pero sólida. De las que pesan cuando llega el momento de contar la historia entera.',
        lleva:'cap_arch_midbelt' }
    ]
  },
  // Rama sin la fecha (falló el rebusque a mano): marca el foco hecho igual.
  'cap_arch_registros_cierre': {
    img: 'APT',
    texto: 'Sea como sea, ya has exprimido los registros lo que dan.',
    opciones: [
      { texto: 'Volver a lo demás.',
        efectos: { marcaVisto:'ca_f_registros' },
        lleva:'cap_arch_midbelt' }
    ]
  },

  // ---- FOCO: la administración (mentiras educadas; sube el calor) ----
  'cap_arch_admin': {
    img: 'APT',
    texto: 'La oficina de servicios ciudadanos es un mostrador limpio atendido por una mujer que sonríe con toda la boca y con nada más. '
         + 'Preguntas por Coll. «Reubicación estándar. Todo en orden.» Preguntas adónde. «No estoy autorizada a compartir esa información.» '
         + 'Preguntas por qué. La sonrisa no se mueve un milímetro.',
    opciones: [
      { texto: 'Insistir, empujar un poco más.',
        efectos: { marcaVisto:'ca_f_admin' },
        // insistir arriba tiene precio: te marca la cara (calor/fichado).
        azar: { prob: 0.5,
          exito: { resultado: 'Insistes con cuidado y ella se cansa antes de alarmarse. Suelta, molesta, que "esos expedientes bajan al archivo técnico". '
                            + 'No es mucho. Confirma que hay un dónde, y que ese dónde está abajo, cerrado.' },
          fallo: { efectos:{ marcaVisto:'ca_fichado' },
                   resultado: 'Insistes demasiado. La sonrisa sigue intacta, pero su mano se mueve un segundo bajo el mostrador. No pasa nada… '
                            + 'salvo que ahora hay un sistema que te ha mirado con atención. Aquí eso basta.' } },
        lleva:'cap_arch_midbelt' },
      { texto: 'Dejarlo. No merece la pena calentar el ambiente.',
        efectos: { marcaVisto:'ca_f_admin' },
        resultado: 'Le das las gracias con la misma sonrisa vacía y te retiras. Algunas puertas, arriba, es mejor no golpearlas.',
        lleva:'cap_arch_midbelt' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 3 — EL DEPÓSITO (suben las apuestas)
  // ============================================================
  'cap_arch_deposito': {
    img: 'APT',
    texto: 'El depósito es un nivel técnico cerrado, bajo Midbelt: pasillos de hormigón limpio, luz blanca, y seguridad privada de HELIX '
         + 'que no lleva el uniforme barato de las Pilas. Estos están entrenados, pagados y tranquilos. Lo peor que te puedes encontrar.<br><br>'
         + 'Ahí dentro está lo que Coll guardaba. La cuestión es cómo entrar.',
    opciones: [
      { texto: 'Colarte por lo callado.',
        cond: { noVisto:'ca_fichado' },
        azar: { prob: 0.55,
          exito: { resultado: 'Lees sus rondas, esperas, respiras, y te cuelas entre dos relevos como una sombra más del hormigón. Dentro.',
                   lleva:'cap_arch_dep_limpio' },
          fallo: { resultado: 'Calculas mal un relevo. Una linterna te barre el hombro y una voz tranquila dice: «Quieto ahí.» Se acabó el sigilo.',
                   lleva:'cap_arch_dep_pillado' } } },
      { texto: 'Pasar con labia, como si tuvieras que estar ahí.',
        cond: { noVisto:'ca_fichado' },
        azar: { prob: 0.5,
          exito: { resultado: 'Caminas como si el sitio fuera tuyo, sueltas un número de expediente inventado con aplomo, y el guardia, aburrido, '
                            + 'te deja pasar sin mirarte dos veces. La seguridad de arriba confía demasiado en que nadie de abajo se atreva.',
                   lleva:'cap_arch_dep_limpio' },
          fallo: { resultado: 'Tu número de expediente no existe, y el guardia lo comprueba mientras sonríes. La sonrisa se te congela antes que a él.',
                   lleva:'cap_arch_dep_pillado' } } },
      { texto: 'Forzar sus sistemas como sabes hacerlo.',
        req: { profesion: { id:'hacker' } }, pista:'haría falta oficio de hacker',
        resultado: 'Le hablas a la cerradura en su idioma. Le haces creer que una puerta que se abre lleva abierta todo el turno. '
                 + 'Entras sin que ningún sistema recuerde que entraste. Así se hace.',
        lleva:'cap_arch_dep_limpio' },
      { texto: 'Entrar a la fuerza. Si quieren pelea, la tendrán.',
        resultado: 'Nada de sutilezas. Vas de frente, con las manos libres y la mandíbula apretada. Ellos te ven venir. No les preocupa lo suficiente.',
        lleva:'cap_arch_dep_combate' }
    ]
  },

  'cap_arch_dep_limpio': {
    img: 'APT',
    texto: 'Dentro. El archivo técnico es una sala fría de estanterías metálicas, y las cajas de Coll siguen ahí, etiquetadas con esa '
         + 'letra cuidadosa de quien quería a las cosas.<br><br>'
         + 'No hay tiempo para leerlo todo. Pero lo que abres te hiela: formatos viejos, muertos, con el mismo <b>sello de HELIX</b> medio '
         + 'borrado que sacaste del módulo. Coll no guardaba basura. Guardaba una <b>lista</b>. Nombres, fechas imposibles, y una palabra '
         + 'repetida que no entiendes, tachada una y otra vez como si alguien hubiera intentado no pensarla.<br><br>'
         + 'No aparece "Centauri". No aparece nada que sepas leer del todo. Solo el peso de estar tocando algo que costó la vida —o el '
         + 'destino— a la mujer que lo ordenó.',
    opciones: [
      { texto: 'Coger lo que puedas cargar y salir.',
        efectos: { marcaVisto:'ca_cache', fragmento:'eco_lista' },
        resultado: 'Te llenas los bolsillos de lo que cabe: un puñado de soportes viejos, la caja más pequeña, lo que Coll habría querido '
                 + 'que alguien salvara. El resto se queda ahí, esperando otra reactualización que lo haga desaparecer.',
        lleva:'cap_arch_salida' }
    ]
  },

  'cap_arch_dep_pillado': {
    img: 'APT',
    texto: 'Te han visto. No hay alarma estridente —arriba son más elegantes— pero las voces se coordinan, las puertas empiezan a sellarse '
         + 'y notas cómo el nivel entero se cierra despacio a tu alrededor, sin prisa, seguro de que no vas a ninguna parte.',
    opciones: [
      { texto: 'Correr. Salir con vida aunque sea con las manos vacías.',
        efectos: { marcaVisto:'ca_quemado', fatiga:+8, disociacion:+4 },
        resultado: 'Eliges el pellejo antes que el botín. Corres, te cuelas por donde puedes, y sales al aire limpio de Midbelt con el corazón '
                 + 'en la garganta y las manos vacías. Lo que Coll guardaba se queda dentro. Y peor: tu cara ya está fichada arriba. '
                 + 'Midbelt se te acaba de cerrar para una buena temporada.',
        lleva:'cap_arch_salida_huida' },
      { texto: 'No irte sin ello. Abrirte paso.',
        resultado: 'Has llegado hasta aquí. No vas a salir con las manos vacías. Aprietas los dientes y vas hacia las voces.',
        lleva:'cap_arch_dep_combate' }
    ]
  },

  // ---- COMBATE DURO (elegido, forzado por pillado, o único si fichado) ----
  'cap_arch_dep_combate': {
    img: 'APT',
    texto: 'No son carroñeros del mercado. Son seguridad privada de HELIX: blindados, entrenados, y con toda la paciencia del mundo, porque '
         + 'saben que el nivel está sellado y que el tiempo juega a su favor. Esto va a doler.',
    opciones: [
      { texto: 'Ir a por ellos.',
        pelea: {
          letal: true, // misión principal: caer aquí puede matar de verdad
          texto: 'El pasillo es estrecho y ellos avanzan en orden, cubriéndose. No hay dónde esconderse. Solo hacia delante, y rápido, '
               + 'antes de que lleguen más.',
          integridad: 14,
          enemigos: [
            { nombre:'Guardia HELIX', desc:'Blindado, sin prisa', tipo:'bruto', integridad:5, fuerza:4, umbral:5 },
            { nombre:'Guardia HELIX', desc:'Cubre el flanco con disciplina', tipo:'normal', integridad:4, fuerza:4, umbral:4 }
          ],
          refuerzoTurno: 2,
          refuerzoTurnoGrupo: [
            { nombre:'Supervisor de seguridad', desc:'Llega a cerrar el asunto, sin nervios', tipo:'lider', integridad:5, fuerza:5, umbral:6 }
          ],
          gana: 'cap_arch_dep_tras_pelea',
          pierde: 'cap_arch_dep_malherido'
        } }
    ]
  },

  // Ganaste la pelea: llegas al archivo, pero lo pagas en el cuerpo.
  'cap_arch_dep_tras_pelea': {
    img: 'APT',
    texto: 'Quedan en el suelo, o quietos, o lo bastante lejos. Tú también dejaste algo aquí: respiras raro y algo en el costado te avisa '
         + 'de que esta noche te va a pasar factura. Pero el archivo técnico está delante, abierto, y las cajas de Coll siguen ahí.',
    opciones: [
      { texto: 'Coger lo que puedas y salir antes de que lleguen más.',
        efectos: { marcaVisto:'ca_cache', fragmento:'eco_lista', condicion:'costillas', fatiga:+12 },
        resultado: 'Te llevas lo que cabe: soportes viejos con el sello del módulo, una lista de nombres y fechas imposibles, una palabra '
                 + 'tachada mil veces que no sabes leer. Sales cojeando, sujetándote el costado, pero sales con ello. Coll no guardaba basura.',
        lleva:'cap_arch_salida' }
    ]
  },

  // Perdiste la pelea: escapas malherido y con lo justo.
  'cap_arch_dep_malherido': {
    img: 'APT',
    texto: 'Te superan. Hay un momento en que el suelo está más cerca de lo que debería y todo suena bajo el agua. Pero no te rematan: '
         + 'a la seguridad de arriba no le pagan por matar a un don nadie de las Pilas, solo por sacarlo. Te arrastran hasta un montacargas '
         + 'de servicio y te dejan caer fuera del nivel, como quien saca la basura.',
    opciones: [
      { texto: 'Arrastrarte fuera de Midbelt.',
        efectos: { marcaVisto:'ca_sin_cache', condicion:'hemorragia', fatiga:+18, disociacion:+10 },
        resultado: 'Sales de Midbelt roto y con las manos casi vacías: solo un soporte viejo que agarraste al caer, medio ilegible. '
                 + 'No es la lista de Coll. Es una esquirla de ella. Tendrá que bastar, porque no vas a volver ahí abajo en un buen tiempo.',
        lleva:'cap_arch_salida_huida' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 4 — SALIDA Y CIERRE
  // ============================================================
  'cap_arch_salida': {
    img: 'APT',
    texto: 'Sales de Midbelt con lo que Coll guardaba pegado al cuerpo. Nadie te detiene: si entraste limpio, ni saben que estuviste; '
         + 'si peleaste, ya has dejado atrás a quien podía pararte. El aire tratado de arriba da paso, ascensor abajo, al olor a lluvia '
         + 'y motor de siempre. Casa.',
    opciones: [
      { texto: 'Contárselo a Mara.', lleva:'cap_arch_cierre_ok' }
    ]
  },
  'cap_arch_salida_huida': {
    img: 'APT',
    texto: 'Sales de Midbelt como se sale de un sitio que ya no te va a dejar volver: rápido, mirando atrás, con menos de lo que fuiste a buscar. '
         + 'El ascensor te devuelve a la lluvia y al ruido, y por una vez el ruido te alivia. Aquí abajo, al menos, sabes moverte.',
    opciones: [
      { texto: 'Contárselo a Mara.', lleva:'cap_arch_cierre_amedias' }
    ]
  },

  // ---- CIERRE con la verdad (tienes la caja de Coll) ----
  'cap_arch_cierre_ok': {
    img: 'APT',
    texto: 'Le pasas a Mara lo que sacaste. Tarda en responder, y cuando lo hace no comenta ni el sello ni las fechas, como si ya los '
         + 'conociera y prefiriera no confirmarlo.<br><br>'
         + '<span style="color:var(--magenta)">«Una lista. Claro que era una lista.»</span><br><br>'
         + 'Se queda callada un momento largo. Luego, más para ella que para ti:<br><br>'
         + '<span style="color:var(--magenta)">«Coll no cataloga desde hace una temporada. Y tú acabas de sacar de ahí lo que la hizo desaparecer. '
         + 'Eso significa que ahora lo tienes tú. Si quieres entender qué es esta lista, olvídate de Midbelt. Esto empieza mucho más atrás, '
         + 'en los archivos viejos de HELIX, los que nadie abre.»</span><br><br>'
         + 'No suena a felicitación. Suena a aviso.',
    opciones: [
      { texto: 'Dejarlo por hoy.',
        cond: { visto:'ca_testigo_vivo' },
        efectos: { creditos:+220, fatiga:+3, marcaVisto:'cap_arch_hecho' },
        resultado: 'Te guardas los créditos de Mara y la caja de Coll, que pesa más de lo que debería para lo poco que abulta. '
                 + 'Alguien decidió esto hace tiempo, con calma. Y ahora tú llevas encima el motivo.'
                 + '<br><br><span class="eg-pista">— Has recuperado lo que Coll guardaba —</span>',
        lleva:'cap_arch_epilogo' },
      { texto: 'Dejarlo por hoy.',
        cond: { noVisto:'ca_testigo_vivo' },
        efectos: { creditos:+220, fatiga:+3, marcaVisto:'cap_arch_hecho' },
        resultado: 'Te guardas los créditos de Mara y la caja de Coll, que pesa más de lo que debería para lo poco que abulta. '
                 + 'Piensas un momento en el vecino, en su puerta con el cartel impecable, y apartas la idea antes de que te muerda. '
                 + 'Alguien decidió todo esto hace tiempo, con calma. Y ahora el motivo lo llevas tú.'
                 + '<br><br><span class="eg-pista">— Has recuperado lo que Coll guardaba —</span>' }
    ]
  },

  // Epílogo: el gancho hacia el siguiente capítulo. Si salvaste al testigo,
  // te lo deja él (cálido, concreto). Si no, lo suelta Mara (más frío). La
  // historia nunca queda coja: el hilo hacia "mirar muy atrás" queda tendido.
  'cap_arch_epilogo': {
    img: 'APT',
    cond: { visto:'ca_testigo_vivo' },
    texto: 'Esa misma semana, el vecino de Coll —el que sigue vivo porque no lo vendiste— te hace llegar un mensaje corto, escrito a mano, '
         + 'como si no se fiara de nada con pantalla:<br><br>'
         + '<i>«Coll decía una cosa cuando bebía de más. Que lo que ella catalogaba no empezaba aquí. Que había que mirar mucho más atrás, '
         + 'a los archivos viejos de HELIX, los que nadie abre. Si de verdad quieres entender esa lista, empieza por ahí. Y ten cuidado.»</i><br><br>'
         + 'Lo relees hasta que te lo sabes, y luego lo quemas, como habría querido él.',
    opciones: [
      { texto: 'Guardar el consejo.',
        resultado: 'Los archivos viejos de HELIX. Mucho más atrás. Ya sabes por dónde seguir tirando cuando estés listo.',
        efectos: { marcaVisto:'ca_gancho_giro' } }
    ]
  },

  // ---- CIERRE con la verdad a medias (saliste sin la caja) ----
  'cap_arch_cierre_amedias': {
    img: 'APT',
    texto: 'Le cuentas a Mara lo que pasó: que llegaste hasta el archivo de Coll y que saliste sin ello, o casi. No te reprocha nada. '
         + 'No dramatiza. Solo aprieta los labios.<br><br>'
         + '<span style="color:var(--magenta)">«Reubicada. Y su lista, sellada abajo. Claro.»</span><br><br>'
         + 'Se queda pensando. Luego:<br><br>'
         + '<span style="color:var(--magenta)">«No importa. Ya sabemos que hay una lista, y que vale una vida. Con eso basta para saber por dónde '
         + 'seguir tirando. Y no es aquí. Esto empieza mucho más atrás, en los archivos viejos de HELIX, los que nadie abre.»</span><br><br>'
         + 'Te queda el regusto de haber estado cerca y no haberlo cogido entero. Pero el hilo, al menos, no se ha roto.',
    opciones: [
      { texto: 'Dejarlo por hoy.',
        efectos: { creditos:+90, fatiga:+4, marcaVisto:'cap_arch_hecho' },
        resultado: 'Bajas con menos de lo que fuiste a buscar y con la sensación fea de que Midbelt te ha ganado esta mano. '
                 + 'Pero sabes que la lista existe, sabes lo que costó, y eso ya no te lo quita nadie.'
                 + '<br><br><span class="eg-pista">— Seguiste el rastro de Coll (a medias) —</span>' }
    ]
  }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(CAP).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CAP[id];
  });

})();
