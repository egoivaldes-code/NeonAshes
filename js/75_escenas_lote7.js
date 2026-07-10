// ============================================================
// BLOQUE JS-75 — ESCENAS DE GUION · LOTE 7 (v0.140)
// ------------------------------------------------------------
// Contenido nuevo para que la exploración del mapa y la deriva no
// se sequen tan pronto. Tres capas:
//
//   1. CADENAS de descubrimiento (un solo uso, con ramas y decisión):
//        · cadena 'inquilino'  — "El de arriba" (3 escenas)
//        · cadena 'boticario'  — "La deuda del boticario" (4 escenas)
//
//   2. ESCENAS sueltas con ramas (un solo uso): pequeños momentos
//      con una decisión y consecuencia.
//
//   3. VIÑETAS de ambiente REPETIBLES (no se agotan): el sitio respira
//      aunque ya hayas vivido todo lo demás. Sin botín, sin facción,
//      solo tono. Son las que evitan el vacío a largo plazo.
//
// Mismo formato y mismas reglas que 45_escenas_datos.js. Se fusiona
// en ESCENAS_GUION. Se carga DESPUÉS de los lotes previos.
//
// NO siembra hilo Centauri: eso es su propia pista de construcción
// (bandera de progreso + Fragmentos de Memoria) y no se toca aquí.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ════════════════════════════════════════════════════════
  //  CADENA 'inquilino' — "EL DE ARRIBA"
  //  Un vecino que ya no baja. Horror burocrático, contenido.
  // ════════════════════════════════════════════════════════
  'inq_1': {
    entrada: true, cadena:'inquilino',
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Hay un sobre de HELIX clavado en la puerta del 7º con una grapa industrial, de las que no se quitan sin arrancar madera. '
         + '"AVISO DE DESOCUPACIÓN. Plazo vencido." Lleva semanas ahí: el papel se ha hinchado con la humedad. '
         + 'Por debajo de la puerta sale un olor dulzón que nadie en el rellano nombra.',
    opciones: [
      { texto: 'Empujar la puerta.', efectos:{ disociacion:+4 }, lleva:'inq_2a' },
      { texto: 'Leer el aviso entero antes de tocar nada.', lleva:'inq_2b' },
      { texto: 'Bajar y no haber visto nada.', efectos:{ aislamiento:+5 },
        resultado:'Bajas los escalones de dos en dos. El olor te sigue un par de pisos, o eso te parece. En las Pilas, lo que no miras no existe; es la única regla que funciona.' }
    ]
  },
  'inq_2a': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'La puerta cede sin resistencia. Dentro, un cuarto idéntico al tuyo: el mismo radiador, la misma mancha de moho en el techo. '
         + 'El hombre lleva días en el sillón, frente a una pantalla que aún emite, repitiendo en bucle un anuncio de seguros de vida. '
         + 'No hay drama. Solo un cuerpo que se cansó de esperar a que alguien preguntara.',
    opciones: [
      { texto: 'Apagar la pantalla.', efectos:{ disociacion:+6 },
        resultado:'Le quitas la voz al anuncio. El silencio que queda es peor. Cierras la puerta con cuidado, como si aún pudieras despertarle.', lleva:'inq_3' },
      { texto: 'Buscar algo que diga quién era.', lleva:'inq_3' }
    ]
  },
  'inq_2b': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El aviso es un formulario perfecto. Nombre tachado por privacidad, número de residente, una deuda de mantenimiento de 340 créditos y la frase final: '
         + '"Ante la ausencia de respuesta, HELIX procederá a la recuperación de la unidad." Con fecha de hace tres semanas. La recuperación nunca llegó. '
         + 'A nadie le corría prisa una unidad de las Pilas.',
    opciones: [
      { texto: 'Entrar de todos modos.', efectos:{ disociacion:+5 }, lleva:'inq_3' },
      { texto: 'Arrancar el aviso y tirarlo al hueco de la basura.', efectos:{ aislamiento:+3 },
        resultado:'Arrancas el papel hinchado. Sin el aviso, la puerta vuelve a ser solo una puerta. Te dices que es un favor. No sabes a quién.' }
    ]
  },
  'inq_3': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Sobre la mesa, junto a un cenicero lleno, hay una foto quemada por una esquina y una caja de analgésicos de HELIX, vacía, '
         + 'con la receta grapada: "máximo 6 unidades / mes, según cobertura". Debajo, una libreta con una sola cuenta hecha y rehecha: '
         + 'lo que cobraba menos lo que costaba seguir vivo. El número final siempre salía rojo.',
    opciones: [
      { texto: 'Llevarte la foto. Que algo suyo salga de aquí.', efectos:{ item:'foto_quemada', aislamiento:+4 },
        resultado:'Te guardas la foto quemada. No conoces a la gente que sale en ella. Pero alguien tiene que sacarla de este cuarto, y hoy te toca a ti.' },
      { texto: 'Dejarlo todo como estaba y avisar abajo.', efectos:{ aislamiento:+2 },
        resultado:'Bajas y se lo dices al portero, que asiente sin levantar la vista. "Ya. El del 7º." Lo sabían. Todos lo sabían. Esperaban a que lo dijera alguien que no fuera ellos.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  CADENA 'boticario' — "LA DEUDA DEL BOTICARIO"
  //  Un farmacéutico de trastienda, una deuda y una elección.
  // ════════════════════════════════════════════════════════
  'bot_1': {
    entrada: true, cadena:'boticario',
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Tras una cortina de tiras de plástico, un hombre mayor con bata limpia y manos temblorosas despacha lo que el Hospital HELIX raciona: '
         + 'antibióticos, supresores, parches de sueño. No regatea. Cuando entras, te mira como quien lleva toda la noche esperando a la persona equivocada. '
         + '"¿Te manda Vane?", pregunta, ya con la mano bajo el mostrador.',
    opciones: [
      { texto: '"No me manda nadie. Solo paso."', lleva:'bot_2a' },
      { texto: 'Seguirle la corriente: "Sí, me manda Vane."', efectos:{ disociacion:+3 }, lleva:'bot_2b' },
      { texto: 'Salir antes de que la mano salga de debajo del mostrador.', efectos:{ fatiga:+3 },
        resultado:'Retrocedes por la cortina de plástico. A tu espalda, oyes que vuelve a guardar lo que fuera que tenía ahí abajo. No quieres saber si era para defenderse o para rendirse.' }
    ]
  },
  'bot_2a': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El hombre se relaja un grado, lo justo. Saca la mano vacía. "Perdona. Espero a unos que vienen a cobrar y no traen recibo." '
         + 'Señala con la barbilla las estanterías medio vacías. "Les debo. Les debo desde que HELIX me cerró la licencia por dispensar de más a quien no podía pagar. '
         + 'Ahora dispenso igual, pero el que me protege se queda con casi todo."',
    opciones: [
      { texto: 'Preguntar cuánto debe.', lleva:'bot_3' },
      { texto: '"No es asunto mío", y comprar algo para irte.', req:{ creditosMin:35 }, pista:'35 créditos',
        efectos:{ creditos:-35, item:'analgesico_helix' },
        resultado:'Le compras una caja de analgésicos buenos, de los de receta. Te la mete en la mano con cuidado, como si te diera algo más que un fármaco. "Cuídate. Aquí nadie lo hace por ti." Sales. La deuda del viejo se queda con el viejo.' }
    ]
  },
  'bot_2b': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'En cuanto dices el nombre, el hombre cambia. La mano sale de debajo del mostrador con un sobre ya preparado. "Dile a Vane que es lo último que tengo este mes. '
         + 'Que no apriete más." Te tiende el sobre. Pesa. No es dinero: es producto, listo para revender. Acabas de heredar una entrega que no era tuya.',
    opciones: [
      { texto: 'Coger el sobre y aclararle que no eres de Vane.', efectos:{ disociacion:+3 }, lleva:'bot_3' },
      { texto: 'Coger el sobre y marcharte sin decir nada.', efectos:{ item:'creditos_sucios', aislamiento:+6, disociacion:+5 },
        resultado:'Te llevas el sobre. El viejo respira aliviado, creyendo que ha pagado. No has pagado nada por ello salvo la cara que pondrá cuando los de Vane vengan de verdad. Eso lo cargas tú, en otro sitio donde no se ve.' }
    ]
  },
  'bot_3': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El número que dice el viejo no es grande para HELIX. Para él es una vida. "Doscientos. Y subiendo, porque el interés también respira." '
         + 'Mira las estanterías como quien mira una casa que ya no es suya. "Lo raro no es deber. Lo raro es que todavía me deje el mostrador. '
         + 'Lo que quieren no es el dinero. Es que el barrio sepa lo que pasa cuando alguien reparte de más."',
    opciones: [
      { texto: 'Pagarle la deuda. (200 créditos)', req:{ creditosMin:200 }, pista:'200 créditos',
        efectos:{ creditos:-200, item:'analgesico_helix', aislamiento:-6 },
        resultado:'Le pones los créditos sobre el mostrador. El viejo no los toca enseguida; los mira como si fueran a desaparecer. Luego te mete en la mano la mejor caja que le queda, sin cobrártela, porque es lo único que sabe hacer con la gratitud. No arreglas el sistema. Arreglas una noche. A veces es lo que hay.' },
      { texto: 'Ofrecerte a "hablar" con los de Vane cuando vengan.', efectos:{ fatiga:+4, faccion:'sindicatos', rep:+3 },
        resultado:'Te quedas. Cuando llegan los dos cobradores, no haces nada heroico: solo estás ahí, de pie, mirándoles a la cara mientras el viejo paga lo que puede. A veces un testigo encarece la paliza lo justo para que no llegue. Se van mascullando. El viejo no dice gracias; te sirve un té que sabe a medicina y te lo bebes entero.' },
      { texto: '"Lo siento. No puedo con esto."', efectos:{ aislamiento:+4 },
        resultado:'El viejo asiente, sin reproche. "Nadie puede. Por eso funciona." Vuelve a colocar cajas en una estantería que se vacía más rápido de lo que la llena. Sales a la lluvia. La cortina de plástico tintinea a tu espalda como un cierre que no cierra nada.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  SUELTAS con ramas (un solo uso)
  // ════════════════════════════════════════════════════════
  'sol_lavanderia': {
    entrada: true,
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Una lavandería automática abierta a las tantas, vacía salvo por una mujer que mira girar la ropa de otro. '
         + '"No es mía", dice sin que preguntes. "Pero gira bonito. Y aquí dentro hace calor." En las Pilas, el calor también es un lujo que se roba donde se puede.',
    opciones: [
      { texto: 'Sentarte a su lado un rato.', efectos:{ aislamiento:-6, fatiga:-3 },
        resultado:'Te sientas. No habláis. La secadora da vueltas y vueltas, y por un momento las Pilas son solo el ronroneo de un motor y el calor de una máquina ajena. Te levantas mejor de lo que entraste, y no sabrías explicar por qué.' },
      { texto: 'Meter tus cosas a lavar mientras puedas.', efectos:{ creditos:-8, fatiga:-2 },
        resultado:'Echas unas monedas y tu ropa se une al baile. Sale caliente y sin el olor a metal mojado que lo impregna todo. Pequeñas victorias. Duran lo que tardan en enfriarse.' },
      { texto: 'Dejarla en paz.', resultado:'Asientes y sigues. Al salir, la ves todavía ahí, hipnotizada por la ropa de un desconocido. Esperas que el dueño tarde en volver.' }
    ]
  },
  'sol_nino_dron': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Un crío de no más de ocho años persigue un dron publicitario averiado que vuela en círculos bajos, escupiendo medio jingle una y otra vez. '
         + 'Salta para tocarlo, riéndose, ajeno a que el aparato vale más que el bloque entero donde vive.',
    opciones: [
      { texto: 'Bajarle el dron de un buen salto.', efectos:{ fatiga:+5 },
        resultado:'Saltas y le das un manotazo al dron, que cae y se queda zumbando en un charco. El crío lo agarra como un trofeo y sale corriendo antes de que nadie reclame. No sabes si le has hecho un favor o le has puesto encima un problema con número de serie. Te dices lo primero.' },
      { texto: 'Mirar y seguir.', efectos:{ aislamiento:+2 },
        resultado:'Le miras saltar un rato. Hubo una versión de ti que también perseguía cosas que volaban. Sigues caminando antes de empezar a echarla de menos.' }
    ]
  },
  'sol_predicador': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Sobre un cajón, una mujer del Eco predica sin micrófono a tres personas y a la lluvia. No grita. Habla bajo, como si el mensaje fuera un secreto que cada uno tiene que merecer. '
         + '"Todo lo que sentís —dice— ya lo sintió algo antes que vosotros. No estáis empezando nada. Estáis recordando."',
    opciones: [
      { texto: 'Escuchar un poco más.', efectos:{ disociacion:+4, aislamiento:-3 },
        resultado:'Te quedas en el borde del corrillo. No entiendes la mitad y la otra mitad no quieres entenderla. Pero la voz baja y segura te deja algo dentro, como un eco de un cuarto vacío. Te vas antes de que te mire a los ojos.' },
      { texto: 'Dejarle unas monedas en el cajón.', efectos:{ creditos:-5, faccion:'eco', rep:+2 },
        resultado:'Echas unas monedas. Ella ni se interrumpe, solo inclina la cabeza un grado. En el Eco no se da las gracias por la fe; se da por sentado que volverás.' },
      { texto: 'Seguir. Bastante tienes con tu propia cabeza.', resultado:'Pasas de largo. La voz se diluye en la lluvia a tu espalda, y aun así una frase se te queda pegada un par de calles. Las sacudes como se sacude el agua del abrigo.' }
    ]
  },
  'sol_cabina': {
    entrada: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'Una cabina de comunicaciones pública, de las viejas, sigue funcionando contra todo pronóstico. Alguien ha dejado el auricular descolgado, colgando del cable. '
         + 'Al acercarte, oyes una voz minúscula que repite, paciente: "Su saldo es insuficiente para completar la llamada. Su saldo es insuficiente para—"',
    opciones: [
      { texto: 'Colgar el auricular por quien lo dejó.', efectos:{ aislamiento:+3 },
        resultado:'Cuelgas. La voz se calla. Te quedas mirando la cabina, preguntándote a quién intentaba llamar el que se quedó sin saldo, y si llegó a decirlo todo antes de que la máquina le cortara. Sigues. No es tu llamada.' },
      { texto: 'Pagar el saldo y dejar la línea abierta.', efectos:{ creditos:-12, disociacion:+3 },
        resultado:'Metes unas monedas. La línea se abre con un tono limpio que nadie va a usar. Lo dejas sonando en la cabina vacía, una llamada pagada que espera a un dueño que no va a volver. Es un gesto inútil y lo sabes. Lo haces igual.' }
    ]
  },
  'sol_gato': {
    entrada: true,
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Un gato flaco, con un implante de identificación oxidado en la oreja, te sigue tres portales sin maullar. Cuando te paras, él se para. '
         + 'El número del implante está medio borrado: fue de alguien, en algún registro, hace mucho. Ahora es de la calle, como casi todo.',
    opciones: [
      { texto: 'Compartir tu ración con él.', req:{ item:'racion_deshidratada' }, pista:'necesitas una ración',
        efectos:{ quitaItem:'racion_deshidratada', aislamiento:-7 },
        resultado:'Abres la ración y le das la mitad. Come rápido, vigilando. Cuando termina, no se va: se sienta a una distancia exacta, ni cerca ni lejos, la distancia de quien ya aprendió a no fiarse del todo. Os quedáis así un rato, dos supervivientes haciéndose compañía sin prometerse nada.' },
      { texto: 'Acariciarlo y seguir.', efectos:{ aislamiento:-3 },
        resultado:'Le pasas la mano por el lomo huesudo. Ronronea, sorprendido, como si hiciera tiempo que nadie lo tocaba sin querer algo. Cuando sigues, no te sigue. Sabe que no tienes nada que darle. Es más listo que mucha gente.' },
      { texto: 'Espantarlo. No puedes cuidar ni de ti.', efectos:{ aislamiento:+4 },
        resultado:'Le das una patada al aire y el gato se esfuma bajo un coche oxidado. Tienes razón: no puedes cuidar de nada. Pero el eco de tu propia voz espantándolo te acompaña más calles de las que querrías.' }
    ]
  },
  'sol_taller_radio': {
    entrada: true,
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'Un taller minúsculo con la persiana a medio bajar. Dentro, un técnico repara radios analógicas —cacharros que nadie usa— rodeado de cientos de ellas. '
         + '"La gente las trae para que las arregle —dice sin levantar la vista—. No para escucharlas. Para que vuelvan a estar enteras. Eso ya es bastante."',
    opciones: [
      { texto: 'Preguntarle si arregla algo más que radios.', lleva:'sol_taller_radio_2' },
      { texto: 'Comprarle una radio que funcione.', req:{ creditosMin:40 }, pista:'40 créditos',
        efectos:{ creditos:-40, item:'chatarra', aislamiento:-4 },
        resultado:'Le compras una radio que ronronea estática y, de vez en cuando, suelta una emisora muerta que repite la misma canción de hace décadas. En tu cuarto, esa estática es mejor compañía que el silencio. Te llevas también un puñado de piezas sueltas que te regala "para que la mantengas viva".' },
      { texto: 'Dejarle con sus cacharros.', resultado:'Asientes y sigues. Al alejarte, oyes cómo una de las radios cobra vida un segundo —una voz, una nota— antes de que él la apague, satisfecho. Arreglada. Entera. Ya es bastante.' }
    ]
  },
  'sol_taller_radio_2': {
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'El técnico deja el destornillador. "Arreglo lo que se puede arreglar. Una radio se puede. Un brazo, a veces. —Se toca la sien—. Lo de aquí dentro, no. '
         + 'Eso lo trae la gente igual, esperando que yo tenga una pieza. No la tengo. Nadie la tiene." Vuelve a su radio. "Pero les dejo sentarse mientras finjo buscarla."',
    opciones: [
      { texto: 'Sentarte a fingir con él un rato.', efectos:{ aislamiento:-6, fatiga:-2 },
        resultado:'Te sientas entre las radios muertas mientras él hurga en una que no tiene arreglo. No buscáis nada. Es el mejor rato que has pasado en días. Cuando te vas, te das cuenta de que tampoco tú tenías una pieza que pedirle: solo querías sentarte. Como todos.' },
      { texto: 'Dejarle trabajar.', resultado:'Te despides. Sigues con el zumbido de cien radios a medio arreglar metido en los oídos, y con la idea, incómoda, de cuántos cuartos de las Pilas esperan una pieza que nadie tiene.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  VIÑETAS DE AMBIENTE — REPETIBLES (no se agotan)
  //  Sin botín relevante, sin facción. Solo tono. Son las que
  //  mantienen el mundo vivo cuando ya viste todo lo demás.
  //  Efectos mínimos para que tengan algo de peso sin desbalancear.
  // ════════════════════════════════════════════════════════
  'amb_anuncio': {
    entrada: true, repetible: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Una pantalla gigante sobre la plaza proyecta a una familia perfecta en una cocina que huele a sol, vendiendo un crédito al consumo "sin letra pequeña". '
         + 'Debajo, la gente real cruza encorvada bajo la lluvia, sin levantar la vista. Nadie compra nada. La pantalla insiste igual, día y noche, a un público que ya no la ve.',
    opciones: [
      { texto: 'Seguir caminando.', resultado:'Pasas por debajo de la familia perfecta sin mirarla. Aprendiste hace tiempo que mirar mucho esas pantallas te deja un hambre que no es de comida.' }
    ]
  },
  'amb_charco': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'Un charco enorme refleja, del revés, todas las luces de neón que de pie no te molestas en mirar. Por un segundo el callejón sucio parece otra cosa: '
         + 'una ciudad bonita, boca abajo, temblando con cada gota. Luego pasa alguien, lo pisa, y la ciudad bonita se rompe en mil pedazos de color.',
    opciones: [
      { texto: 'Rodearlo y seguir.', efectos:{ aislamiento:-2 },
        resultado:'Rodeas el charco con cuidado, como para no romper tú también la ciudad de abajo. Es una tontería. Te la permites. Hay que permitirse alguna.' }
    ]
  },
  'amb_brasero': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Alrededor de un bidón con fuego, cuatro o cinco siluetas se calientan las manos en silencio. No hablan, no se conocen, no se conocerán. '
         + 'Solo comparten el calor el tiempo que dure la chatarra que arde dentro. Te hacen un hueco sin mirarte, como se hace con cualquiera que tiene frío.',
    opciones: [
      { texto: 'Calentarte un momento con ellos.', efectos:{ aislamiento:-4, fatiga:-2 },
        resultado:'Acercas las manos al bidón. El calor sube por los brazos y, durante unos minutos, perteneces a algo: a este círculo de desconocidos que solo se piden no apagar el fuego. Cuando te vas, alguien ocupa tu hueco. Así funciona. Así se sobrevive.' },
      { texto: 'Pasar de largo.', resultado:'Sigues con las manos en los bolsillos. El resplandor del bidón te alarga la sombra un buen trecho antes de soltarte a la oscuridad otra vez.' }
    ]
  },
  'amb_megafonia': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'La megafonía del distrito cobra vida con un chasquido y recita, sin emoción, el parte del día: niveles de toxicidad del aire, horarios de corte de agua, '
         + 'un recordatorio de que "el impago de tasas conlleva la suspensión de servicios esenciales". Luego, una musiquilla. Luego, silencio. Mañana, igual.',
    opciones: [
      { texto: 'Apretar el paso.', efectos:{ fatiga:+2 },
        resultado:'Bajas la cabeza y aprietas, como todos. La voz no te amenazaba a ti en concreto. Amenaza a todos por igual, que es la forma más eficiente de no amenazar a nadie y aun así tenerlo claro.' }
    ]
  },
  'amb_ventana': {
    entrada: true, repetible: true,
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'En lo alto de un bloque, una sola ventana iluminada entre cientos a oscuras. Una silueta fuma asomada, mirando lo mismo que tú: la lluvia, las luces, la nada. '
         + 'Durante un instante os miráis, dos puntos en la inmensidad apagada de las Pilas. Luego la silueta apaga la luz, y vuelves a estar solo.',
    opciones: [
      { texto: 'Levantar la mano, por si acaso.', efectos:{ aislamiento:-3 },
        resultado:'Levantas la mano hacia la ventana, sin saber si te ven. La luz tarda un segundo de más en apagarse. Quieres creer que fue una respuesta. Te lo quedas. Es gratis y abriga.' },
      { texto: 'Seguir, antes de ponerte sentimental.', efectos:{ aislamiento:+2 },
        resultado:'Sigues sin levantar la vista otra vez. Mirar ventanas ajenas de noche es un deporte que en las Pilas se cobra caro en horas de sueño.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  AMPLIACIÓN 2 (v0.140) — más eventos.
  // ════════════════════════════════════════════════════════

  // ── CADENA 'clinica' — "LA CLÍNICA DE LA TRASTIENDA" ──────
  'cli_1': {
    entrada: true, cadena:'clinica',
    img: 'EXP_TALLER_NEURAL',
    texto: 'Una luz verde de quirófano se cuela por la rendija de una puerta sin rótulo. Dentro, una mujer con bata manchada cose el brazo de un hombre que aprieta los dientes y no grita. '
         + 'Te ve en el umbral. "Si vienes sangrando, pasa. Si vienes a mirar, ya has mirado bastante." No hay sitio para más de uno en esa frase.',
    opciones: [
      { texto: 'Preguntar si necesita unas manos.', lleva:'cli_2' },
      { texto: 'Ofrecerle material que llevas.', req:{ item:'vendaje' }, pista:'necesitas un vendaje',
        efectos:{ quitaItem:'vendaje', faccion:'eco', rep:+2, aislamiento:-3 },
        resultado:'Le tiendes el vendaje sin que te lo pida. Ella lo coge, lo usa en el acto y no da las gracias, pero te mira distinto: como a alguien que entiende que aquí lo que sobra a uno le falta a otro. "Vuelve si te rompen algo. Te lo arreglo barato."' },
      { texto: 'Disculparte y cerrar la puerta.', efectos:{ aislamiento:+2 },
        resultado:'Cierras la puerta con cuidado, devolviéndole su luz verde y su intimidad de carnicería piadosa. Hay puertas que se abren solo para los que sangran, y tú hoy, por suerte o por desgracia, no sangras.' }
    ]
  },
  'cli_2': {
    img: 'EXP_TALLER_NEURAL',
    texto: 'La médica te señala con la barbilla una palangana de instrumental sucio. "Hierve eso mientras termino. No tengo enfermera desde que a la última se la llevó una redada por curar a quien no debía." '
         + 'El hombre de la camilla te mira con la cara gris de quien lleva mucho aguantando. "No es mala —murmura—. Es la única."',
    opciones: [
      { texto: 'Ayudar hasta que el hombre esté estable.', efectos:{ fatiga:+8, aislamiento:-6, faccion:'eco', rep:+3, marcaVisto:'__clinica_abierta__' },
        resultado:'Pasas un buen rato hirviendo metal, sujetando, limpiando. Cuando el hombre por fin respira hondo sin temblar, la médica se quita los guantes y te mira de arriba abajo. "Tienes pulso firme y no preguntas tonterías. Eso aquí vale más que un título." No te paga. Te ofrece algo mejor: una puerta que ahora se te abrirá cuando la necesites.', lleva:'cli_3' },
      { texto: 'Quedarte solo hasta que termine y marcharte.', efectos:{ fatiga:+3 },
        resultado:'Hierves el instrumental y te quedas en un rincón hasta que la cosa se calma. Cuando la médica termina, ya no estás: te has ido sin ruido, como se va de los sitios donde uno no acaba de pertenecer. Te llevas, eso sí, el olor a desinfectante metido en la ropa un par de días.' }
    ]
  },
  'cli_3': {
    img: 'EXP_TALLER_NEURAL',
    repetible: true,
    cond:{ visto:'__clinica_abierta__' },
    texto: 'La clínica de la trastienda sigue ahí, con su luz verde y su olor a metal hervido. La médica levanta la vista de lo que esté cosiendo. "Mira quién vuelve. ¿Sangras o ayudas?" '
         + 'En su mundo solo hay esas dos formas de cruzar la puerta, y las dos están bien.',
    opciones: [
      { texto: 'Echar una mano un rato.', efectos:{ fatiga:+6, aislamiento:-5 },
        resultado:'Te arremangas sin que te lo pida dos veces. Un par de horas de manos firmes y silencios cómodos. Cuando sales, llevas menos peso dentro del que traías, que es la única paga que da este sitio y la que más falta te hace.' },
      { texto: 'Solo pasabas a saludar.', efectos:{ aislamiento:-3 },
        resultado:'"Pasabas a saludar", repite ella, como si la frase fuera de otro idioma. Pero afloja un grado y te sirve un café que sabe a quemado. En las Pilas, que alguien pase solo a saludar es casi un milagro administrativo. Os lo bebéis sin hablar.' }
    ]
  },

  // ── SUELTAS con ramas (un solo uso) ──────────────────────
  'sol_ascensor': {
    entrada: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Te metes en un ascensor de carga que se cierra y, entre dos plantas, se para con un quejido metálico. La luz parpadea. Hay alguien más dentro: '
         + 'una mujer con un mono de limpieza que ni se inmuta. "Tranquilo —dice—. Tarda. Siempre tarda. Aquí dentro al menos no llueve."',
    opciones: [
      { texto: 'Esperar y darle conversación.', efectos:{ aislamiento:-5, fatiga:+2 },
        resultado:'Esperáis juntos un rato largo. Ella te cuenta, sin que preguntes, que lleva veinte años limpiando plantas que nunca pisa nadie importante. Cuando el ascensor por fin arranca, los dos casi lo lamentáis. Os despedís en pisos distintos como dos que han compartido algo que no tiene nombre.' },
      { texto: 'Forzar las puertas y salir por el hueco.', efectos:{ fatiga:+7, condicion:'costillas', condicionProb:0.3 },
        resultado:'Metes los dedos entre las puertas y tiras hasta que ceden. Te encaramas al rellano de abajo raspándote el costado contra el filo de metal. Sales. La mujer, dentro, niega con la cabeza sin maldad. "Tanta prisa para llegar antes a ningún sitio."' }
    ]
  },
  'sol_dientes': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Un puesto minúsculo con un cartel impecable, casi oficial: "COMPRA DE PIEZAS DENTALES. Tarifa según estado. Pago en el acto." Detrás, un hombre con guantes de látex pesa molares en una balanza de joyero, '
         + 'anotando cada uno en un registro con casillas. La frialdad del trámite es peor que cualquier sangre.',
    opciones: [
      { texto: 'Preguntar para qué los quiere.', efectos:{ disociacion:+5 },
        resultado:'"Calcio, marfil sintético, reposición. HELIX paga bien la materia prima y no pregunta de dónde sale." Lo dice como quien recita una normativa. Detrás de él, un bote con docenas de piezas espera su casilla en el registro. Te marchas con la boca, sin querer, bien cerrada.' },
      { texto: 'Largarte sin mirar el bote.', efectos:{ disociacion:+3, fatiga:+2 },
        resultado:'Te vas rápido, sin mirar el bote que ya has visto. Hay negocios en las Pilas que no necesitan ser violentos para helarte: les basta con tener un formulario y una balanza. Aprietas el paso.' }
    ]
  },
  'sol_ajedrez': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Bajo un alero, un anciano juega al ajedrez contra sí mismo en un tablero de piezas desparejadas: media docena son tuercas y tapones que hacen de lo que falta. '
         + 'Mueve para los dos bandos con la misma calma. "El blanco soy yo de joven —dice—. El negro, yo de ahora. Gana el negro casi siempre. Sabe lo que va a pasar."',
    opciones: [
      { texto: 'Pedirle jugar una partida.', efectos:{ aislamiento:-6, fatiga:+2 },
        resultado:'Te sientas. Te gana en doce movimientos sin alardear, recolocando un tapón de refresco que hace de alfil. "No juegas mal. Juegas con prisa, como todos los de fuera." Cuando te levantas, vuelve a partirse en blanco y negro, a seguir perdiendo contra el que ya sabe el final. Te vas pensando en eso más de lo que querrías.' },
      { texto: 'Mirar la partida en silencio.', efectos:{ aislamiento:-3, disociacion:+2 },
        resultado:'Te quedas mirando cómo se gana y se pierde a sí mismo. Hay una paz rara en el sitio, la paz del que ya no espera nada de nadie porque se basta para hacerse compañía y derrota. Sigues antes de aprenderle el truco.' }
    ]
  },
  'sol_pintora': {
    entrada: true,
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'Una chica pinta un mural enorme en un muro ciego: una ventana abierta a un campo que no existe, con un cielo limpio que en las Pilas nadie ha visto. Trabaja rápido, mirando de reojo, '
         + 'porque pintar sin permiso es "deterioro de propiedad de HELIX" y se paga. "Lo van a tapar mañana —dice sin parar—. Por eso lo pinto hoy."',
    opciones: [
      { texto: 'Hacer de vigía mientras termina.', efectos:{ fatiga:+4, aislamiento:-5, faccion:'eco', rep:+1 },
        resultado:'Te quedas en la esquina, ojo a la calle, mientras ella remata el campo imposible. Cuando una patrulla asoma, le silbas y los dos desaparecéis por sitios distintos. No verás si lo tapan. Quieres creer que alguien, antes, se paró a mirar por esa ventana pintada y respiró un campo que no existe. A veces eso basta.' },
      { texto: 'Darle algo para el próximo mural.', efectos:{ creditos:-10, aislamiento:-3 },
        resultado:'Le dejas unos créditos "para más pintura". Ella sonríe sin dejar de pintar. "Mañana lo tapan. Pasado lo vuelvo a hacer en otro muro. Tapar es más caro que pintar, y eso me hace ganar a la larga." Te vas con la idea de una victoria que se mide en muros.' },
      { texto: 'Avisarla de que viene gente y seguir.', efectos:{ aislamiento:+1 },
        resultado:'"Cuidado, que igual no estás sola mucho rato", le dices, y sigues. Es lo poco que puedes dar sin pararte. A tu espalda, oyes el roce rápido de la brocha acelerando contra el muro, una carrera contra HELIX que se libra a brochazos.' }
    ]
  },

  // ── VIÑETAS REPETIBLES (no se agotan) ─────────────────────
  'amb_palomas': {
    entrada: true, repetible: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Una bandada de palomas alza el vuelo de golpe, y al girar a contraluz ves que a varias les falla el movimiento: aletean con un tic mecánico, demasiado regular. '
         + 'Drones de vigilancia viejos, camuflados de pájaro, mezclados con los de verdad. Ya nadie distingue cuáles miran. Quizá ese es el truco.',
    opciones: [
      { texto: 'Bajar la vista y seguir.', resultado:'Bajas la vista, por si acaso. En las Pilas aprendes a no mirar al cielo demasiado tiempo: nunca sabes cuál de los pájaros te está mirando a ti.' }
    ]
  },
  'amb_reparto': {
    entrada: true, repetible: true,
    img: 'EXP_PUERTO_CARGA',
    texto: 'Un dron de reparto de HELIX baja a una azotea con un paquete, lo deja y vuelve a subir, eficiente y mudo. Abajo, una cola de gente espera el reparto de comida del Eco, que llega tarde, a pie, cargado por voluntarios empapados. '
         + 'Dos formas de hacer llegar las cosas. Solo una pregunta si tienes hambre.',
    opciones: [
      { texto: 'Ponerte en la cola del Eco.', efectos:{ fatiga:-3, aislamiento:-3 },
        resultado:'Esperas tu turno bajo la lluvia. Cuando llega, una mujer del Eco te pone en la mano algo caliente envuelto en papel y te mira a los ojos un segundo, que es la parte que el dron nunca trae. Comes andando. Sienta bien por dos motivos a la vez.' },
      { texto: 'Seguir tu camino.', resultado:'Pasas de largo las dos colas. El dron sube, los voluntarios reparten, y la ciudad sigue alimentándose por sus dos tubos: el frío y el humano. Hoy no te toca ninguno.' }
    ]
  },
  'amb_sirena': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'Una sirena cruza el cielo de las Pilas, lejana, y todo el mundo en la calle hace lo mismo sin pensarlo: se detiene medio segundo, calcula si se acerca, decide que no, y sigue. '
         + 'Un reflejo colectivo de gente que aprendió a medir el peligro por el volumen. La sirena se aleja. La calle exhala a la vez.',
    opciones: [
      { texto: 'Seguir, como todos.', resultado:'Sigues con el resto. La sirena se diluye hacia otro barrio, hacia el problema de otra persona. Sientes el alivio mezquino y universal de que esta vez no era para ti, y te avergüenzas de él justo lo poco que uno se avergüenza ya de nada.' }
    ]
  },
  'amb_fila_agua': {
    entrada: true, repetible: true,
    img: 'EXP_PLANTA_AGUA',
    texto: 'Una fuente comunitaria de agua filtrada gotea a un ritmo de tacaño. La cola de bidones es larga y paciente. Cuando le toca a cada uno, la máquina pide el número de residente, '
         + 'descuenta la cuota del mes y suelta justo la ración asignada, ni una gota más. El agua, aquí, también lleva tu nombre y tu deuda.',
    opciones: [
      { texto: 'Esperar y llenar lo que puedas.', efectos:{ fatiga:-2, creditos:-4 },
        resultado:'Esperas tu turno, pones el número, pagas la cuota y la máquina te suelta tu ración medida al mililitro. Bebes ahí mismo un trago largo, porque lo que entra en el cuerpo ya no se lo puede cobrar nadie. Lo demás te lo llevas.' },
      { texto: 'No tienes bidón. Seguir.', resultado:'Miras la cola y sigues. Sin bidón no hay ración, y la máquina no fía. Te tragas la sed un rato más, que es algo que en las Pilas se aprende pronto: a aplazar hasta la propia garganta.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  AMPLIACIÓN 3 (v0.140) — más eventos.
  // ════════════════════════════════════════════════════════

  // ── CADENA 'subasta' — "LO QUE DEJÓ EL 412" ──────────────
  'sub_1': {
    entrada: true, cadena:'subasta',
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Un funcionario de HELIX subasta, sobre una mesa plegable, las pertenencias de una unidad "recuperada por impago": ropa doblada, una vajilla incompleta, una radio, fotos todavía en sus marcos. '
         + 'Lee cada lote con voz de inventario. "Lote siete: efectos personales del residente 412. Salida, cinco créditos." Nadie del corro mira las fotos. Tú sí.',
    opciones: [
      { texto: 'Quedarte a ver cómo se reparte una vida.', efectos:{ disociacion:+4 }, lleva:'sub_2' },
      { texto: 'Pujar por el lote de las fotos.', req:{ creditosMin:5 }, pista:'5 créditos',
        efectos:{ creditos:-5, item:'foto_quemada', aislamiento:+3 }, lleva:'sub_3' },
      { texto: 'No poder con la escena y seguir.', efectos:{ aislamiento:+4 },
        resultado:'Te alejas antes de que el funcionario llegue al lote de las fotos. A tu espalda, su voz sigue poniéndole precio a los restos del 412, lote a lote, con la misma entonación con que se leen los partes del tiempo. En las Pilas, hasta el duelo tiene tarifa de salida.' }
    ]
  },
  'sub_2': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Los lotes caen rápido. Un hombre compra la vajilla para revenderla por piezas. Una mujer regatea la ropa de abrigo, calculando tallas. El funcionario no juzga a nadie: solo cobra, anota, '
         + 'y pasa al siguiente. Cuando llega al lote de las fotos —caras de gente que sonríe en sitios que ya no existen—, nadie puja. "¿Nadie? Se destruyen, entonces." Y levanta la mano.',
    opciones: [
      { texto: 'Pujar para que no las destruyan.', req:{ creditosMin:5 }, pista:'5 créditos',
        efectos:{ creditos:-5, item:'foto_quemada', aislamiento:+2 }, lleva:'sub_3' },
      { texto: 'Dejar que la mano baje.', efectos:{ disociacion:+5 },
        resultado:'La mano baja. El funcionario mete las fotos del 412 en una bolsa de reciclaje con la misma calma con que metió todo lo demás. Nadie ha hecho nada malo. Nadie ha hecho nada. Y aun así sales de la plaza con la sensación de haber presenciado un pequeño borrado limpio y legal de una persona entera.' }
    ]
  },
  'sub_3': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Te llevas las fotos del 412 sin saber qué vas a hacer con ellas. Caras desconocidas en una playa que no es de aquí, un cumpleaños, un perro. El funcionario te tiende un recibo: '
         + '"Adquisición de efectos. Conserve el justificante." Como si hubiera que justificar haberle comprado a un muerto lo único que le quedaba.',
    opciones: [
      { texto: 'Guardarlas. Alguien tiene que.', efectos:{ aislamiento:-2, disociacion:+2 },
        resultado:'Te metes las fotos en el bolsillo, junto al recibo absurdo. No conociste al 412. No sabrás nunca su nombre, solo su número. Pero esta noche, en alguna parte, hay alguien sonriendo en una playa imposible porque tú pagaste cinco créditos por que no lo borraran del todo. Es poco. Es algo.' }
    ]
  },

  // ── SUELTAS con ramas (un solo uso) ──────────────────────
  'sol_cantante': {
    entrada: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'Una mujer canta a capela en un pasaje con buena acústica, sin sombrero para monedas, sin altavoz, sin pedir nada. Canta porque sí, o porque es lo único que la lluvia no le puede quitar. '
         + 'La voz rebota en el hormigón mojado y, por un momento, el pasaje sucio es una catedral.',
    opciones: [
      { texto: 'Quedarte hasta que termine.', efectos:{ aislamiento:-6, fatiga:-3 },
        resultado:'Te quedas. Cuando la última nota se apaga contra el hormigón, ella abre los ojos, te ve, y parece sorprendida de tener público. No aplaudes; sería romperlo. Solo inclinas la cabeza. Ella te la devuelve. Sigues con la canción metida en el pecho como un calor pequeño.' },
      { texto: 'Dejarle unas monedas igualmente.', efectos:{ creditos:-6, aislamiento:-3 },
        resultado:'Le dejas unas monedas en el suelo, a sus pies, aunque no las pedía. Ella frunce el ceño un segundo, casi ofendida, y luego lo deja pasar. No cantaba por eso. Pero las monedas también comen. Las dos cosas son verdad a la vez.' }
    ]
  },
  'sol_adivina': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Una máquina adivina de feria, de las antiguas, sobrevive enchufada a un alargador en una esquina. Tras el cristal, un autómata con turbante descolorido espera una moneda para escupir tu futuro en un cartón. '
         + 'Alguien ha pegado debajo un papel: "NO SE HACE RESPONSABLE HELIX DE PREDICCIONES NO HOMOLOGADAS".',
    opciones: [
      { texto: 'Echar una moneda y leer el futuro.', efectos:{ creditos:-3, disociacion:+3 },
        resultado:'La máquina zumba, el autómata mueve el brazo a tirones y suelta un cartoncito gastado. Lo lees: "LO QUE BUSCAS YA LO TUVISTE." Una frase de molde, igual para todos, calculada para parecer hecha a medida. Y aun así se te queda dentro como una piedra en el zapato. La doblas y te la guardas. Por si acaso.' },
      { texto: 'Sonreír y seguir.', resultado:'Le sonríes al autómata polvoriento como a un viejo conocido y sigues. El futuro en las Pilas no lo decide una máquina de feria. Lo decide HELIX, y ese no necesita moneda para decírtelo.' }
    ]
  },
  'sol_metro': {
    entrada: true,
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'La boca de una estación de metro clausurada, inundada hasta media escalera por agua negra y quieta. Una verja oxidada la cierra, pero alguien ha cortado los barrotes. Del fondo sube un aire frío que huele a años. '
         + 'Hay quien dice que abajo vive gente que no sube nunca. Hay quien dice muchas cosas.',
    opciones: [
      { texto: 'Bajar unos peldaños a mirar.', efectos:{ fatiga:+4, disociacion:+4 },
        resultado:'Bajas hasta el borde del agua negra. El reflejo de tu linterna no llega al fondo. En la pared, marcas de tiza recientes: alguien cuenta algo ahí abajo, días, raciones, no sabes. Decides no averiguarlo. Subes despacio, de espaldas, sin darle nunca la espalda del todo al agua.' },
      { texto: 'No tentar a la suerte.', efectos:{ aislamiento:+2 },
        resultado:'Dejas la boca del metro como está. Hay sitios en las Pilas que se guardan sus inquilinos, y meterse ahí por curiosidad es una forma tonta de pasar a formar parte de las historias que cuenta la gente. Sigues por la calle, con el frío de abajo pegado a la nuca un rato.' }
    ]
  },
  'sol_slot': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Un hombre joven, bien afeitado, ofrece en voz baja algo extraño: su plaza en el registro de residentes. "Me voy del planeta. Hueco limpio, sin deudas, historial intacto. '
         + 'Para alguien sin papeles vale una fortuna." Lo dice con la sonrisa nerviosa de quien vende lo único que le queda: el derecho a existir oficialmente aquí.',
    opciones: [
      { texto: 'Preguntar adónde se va con tanta prisa.', efectos:{ disociacion:+3 },
        resultado:'"A los Muelles. A Selene, si junto el pasaje. A cualquier sitio que no sea este." Le brillan los ojos al decirlo, con esa fe de quien cree que la salvación es siempre el siguiente sitio. No le compras nada. Le deseas suerte, y lo dices en serio. Él ya está mirando por encima de tu hombro, buscando al siguiente comprador de su nombre.' },
      { texto: 'Declinar. Esos papeles arrastran al dueño.', efectos:{ aislamiento:+2 },
        resultado:'Niegas. Un registro ajeno arrastra la sombra del que lo dejó: sus deudas viejas, sus enemigos, sus huellas. Prefieres tu propia nada antes que el algo de otro. Él asiente, lo entiende, y sigue ofreciendo su existencia al siguiente que pase con cara de no tener una.' }
    ]
  },

  // ── VIÑETAS REPETIBLES (no se agotan) ─────────────────────
  'amb_humo_filosofo': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Un viejo sentado sobre una rejilla de vapor, envuelto en el calor que sube de las máquinas, te suelta sin venir a cuento: "¿Sabes por qué llueve siempre? Porque arriba alguien decidió que era más barato que lo limpiásemos nosotros." '
         + 'Se ríe solo de su propio chiste, que no es un chiste, y vuelve a mirar el vapor.',
    opciones: [
      { texto: 'Darle la razón y seguir.', efectos:{ aislamiento:-2 },
        resultado:'"Tiene usted razón", le dices, porque la tiene. El viejo asiente, satisfecho de que alguien le escuche por una vez. Sigues, y la frase te acompaña: casi todo en las Pilas es algo que arriba decidieron que saliera más barato que lo pagaran ellos.' }
    ]
  },
  'amb_tienda_24h': {
    entrada: true, repetible: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Un colmado abierto las 24 horas, iluminado con una luz blanca que no deja sombra. El dependiente, detrás de un cristal blindado, ve la tele sin sonido. Los estantes están medio vacíos, los precios pegados con cinta, subidos a mano. '
         + 'Es feo, es caro, y a las cuatro de la mañana es lo único que sigue encendido para ti.',
    opciones: [
      { texto: 'Comprar algo de comer.', efectos:{ creditos:-9, fatiga:-3, hambre:-10 },
        resultado:'Compras lo que puedes pagar a través del cristal. El dependiente te pasa el cambio por una ranura sin apartar los ojos de la tele muda. No hay conversación, no hay calor, pero hay comida y hay luz. A ciertas horas, en las Pilas, eso ya es compañía.' },
      { texto: 'Solo entrar a quitarte la lluvia un minuto.', efectos:{ fatiga:-2 },
        resultado:'Entras, finges mirar un estante, te quitas el agua del pelo. El dependiente no dice nada: él también sabe lo que es necesitar un techo un minuto. Cuando sales, la lluvia te recibe igual, pero el minuto seco te lo llevas puesto.' }
    ]
  },
  'amb_andamio': {
    entrada: true, repetible: true,
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'Operarios con exoesqueletos baratos descargan vigas toda la noche, en turnos que no acaban, levantando algo que nunca verán terminado y que no será para ellos. Una grúa chirría arriba. '
         + 'Uno de ellos te mira pasar con la envidia mansa del que trabaja hacia el de la calle que, al menos, anda libre.',
    opciones: [
      { texto: 'Seguir tu camino.', resultado:'Sigues. A tu espalda, el chirrido de la grúa y el zumbido de los exoesqueletos marcan un ritmo de trabajo sin final. Te preguntas cuál de los dos está más atrapado, si el que carga vigas o el que vaga sin rumbo. No te respondes.' }
    ]
  },
  'amb_lona': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'La lluvia repiquetea sobre una lona tensada entre dos balcones, y debajo, en el trozo seco que regala, se ha juntado media docena de personas sin hablar: un refugio improvisado que durará lo que dure la tormenta. '
         + 'Por una vez, el agua trabaja a favor de alguien: junta a los que de otro modo seguirían cada uno por su lado.',
    opciones: [
      { texto: 'Resguardarte con ellos.', efectos:{ fatiga:-3, aislamiento:-4 },
        resultado:'Te metes bajo la lona. Nadie te pide explicaciones; el sitio es de quien tiene frío. Escucháis llover juntos, hombro con hombro con desconocidos, y hay en eso una paz vieja, casi animal. Cuando escampa, os dispersáis sin despediros, otra vez cada uno lo suyo. Pero por un rato fuisteis algo.' },
      { texto: 'Seguir bajo la lluvia.', efectos:{ fatiga:+2 },
        resultado:'Pasas de largo el refugio de la lona. Hay días en que meterse bajo un techo ajeno, aunque sea de tela, cuesta más que mojarse. Sigues, calado, contándote que lo prefieres así. Casi te lo crees.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  AMPLIACIÓN 4 (v0.140) — más eventos.
  // ════════════════════════════════════════════════════════

  // ── CADENA 'protesico' — "EL QUE PONE BRAZOS A PLAZOS" ────
  'pro_1': {
    entrada: true, cadena:'protesico',
    img: 'EXP_TALLER_PROTESIS_1',
    texto: 'Un taller estrecho lleno de prótesis usadas colgando del techo como reses: brazos, manos, una pierna con la pintura saltada. El dueño, manco él mismo de una, ajusta un gancho a un cliente que paga "a plazos". '
         + '"Aquí nadie se queda sin mano por no tener crédito —dice—. Otra cosa es de quién era la mano antes." Lo dice sin dramatismo, como quien explica el horario.',
    opciones: [
      { texto: 'Preguntar de dónde salen las prótesis.', efectos:{ disociacion:+4 }, lleva:'pro_2' },
      { texto: 'Solo mirar el catálogo colgado.', lleva:'pro_2' },
      { texto: 'No es sitio para ti ahora mismo.', efectos:{ aislamiento:+2 },
        resultado:'Sales antes de que te ofrezca financiación para un repuesto que aún no necesitas. Las prótesis colgadas se balancean un poco con la corriente de la puerta, despidiéndote con manos que ya no saludan a nadie.' }
    ]
  },
  'pro_2': {
    img: 'EXP_TALLER_PROTESIS_1',
    texto: '"De los que no terminan de pagar —responde, sin que le tiemble el pulso—. HELIX recupera el implante como recupera el piso. Yo se lo compro al desguace, lo limpio, lo vuelvo a poner. '
         + 'Una mano hace tres o cuatro dueños antes de jubilarse." Señala un brazo del techo. "Ese lo he montado yo cuatro veces. Buen brazo. Mala suerte sus dueños."',
    opciones: [
      { texto: 'Ofrecerle chatarra para sus arreglos.', req:{ item:'chatarra' }, pista:'necesitas chatarra',
        efectos:{ quitaItem:'chatarra', creditos:+25, faccion:'sindicatos', rep:+1 },
        resultado:'Le vendes la chatarra que llevas. Él la sopesa con su única mano, asiente y te paga un precio justo, raro en las Pilas. "Tráeme más de esto. Servos, articulaciones, lo que sea. Aquí todo se reusa. Hasta nosotros." Te guardas los créditos y la frase, que pesa más.' },
      { texto: 'Preguntar cuánto costaría un repuesto, por saber.', efectos:{ disociacion:+2 },
        resultado:'Te suelta una cifra y un plan de pagos con una naturalidad escalofriante, como quien vende un electrodoméstico. "El primer plazo no se cobra: confío en que volverás. Siempre se vuelve." Sales con la cifra rondándote y la certeza incómoda de que, tarde o temprano, en las Pilas, todo el mundo vuelve a un sitio como este.' },
      { texto: 'Has oído bastante. Marcharte.', efectos:{ aislamiento:+3, disociacion:+2 },
        resultado:'Te vas con el inventario de manos de segunda, tercera y cuarta mano dándote vueltas. No es crueldad lo que hay en ese taller. Es eficiencia. Y eso, en las Pilas, casi siempre es peor.' }
    ]
  },

  // ── SUELTAS con ramas (un solo uso) ──────────────────────
  'sol_lector': {
    entrada: true,
    img: 'EXP_CALLEJON_SUENOS',
    texto: 'Un hombre mayor, sentado en un cajón, deletrea en voz baja los carteles de la calle, uno por uno, con el dedo bajo cada palabra. Aprende a leer ahora, viejo, a base de anuncios y avisos de desahucio. '
         + '"De joven no hizo falta —dice al notar que lo miras—. Ahora todo viene escrito, y el que no lee, firma lo que le pongan delante."',
    opciones: [
      { texto: 'Sentarte a leer un rato con él.', efectos:{ aislamiento:-6, fatiga:+2 },
        resultado:'Te sientas y leéis juntos los carteles de la esquina, tú corrigiéndole bajito, él repitiendo terco hasta clavarlo. Cuando descifra solo una palabra larga, sonríe como un crío. Te vas con la idea de cuántas firmas habrá puesto este hombre sin saber a qué, y de cuánta gente firma igual, ahora mismo, en toda la ciudad.' },
      { texto: 'Animarle y seguir.', efectos:{ aislamiento:-2 },
        resultado:'"Va usted bien", le dices, y lo dices en serio. Él asiente, vuelve al cartel, y su dedo sigue avanzando palabra a palabra, ganándole terreno, letra a letra, a un mundo diseñado para que no entienda lo que firma.' }
    ]
  },
  'sol_guarderia': {
    entrada: true,
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'En un local sin letrero, una mujer cuida de una docena de críos mientras sus padres trabajan turnos que no permiten otra cosa. No tiene licencia —las licencias cuestan lo que nadie tiene— '
         + 'así que lo hace a la vista de todos y de nadie, fiándose de que el barrio la cubra. Los niños pintan en las paredes. Hay, contra todo pronóstico, risas.',
    opciones: [
      { texto: 'Dejarle algo para la merienda de los críos.', efectos:{ creditos:-12, aislamiento:-5, faccion:'eco', rep:+1 },
        resultado:'Le pones unos créditos en la mano "para la merienda". Ella los acepta sin teatro, los necesita y lo sabéis los dos. Un crío te enseña su dibujo: un sol enorme, amarillo, sobre una casa con jardín. Aquí nadie ha visto un sol así. Lo pintan igual. Eso es lo que ella protege en este local sin nombre.' },
      { texto: 'Mirar las risas un momento y seguir.', efectos:{ aislamiento:-3 },
        resultado:'Te quedas un momento en la puerta oyendo reír a los críos, un sonido que en las Pilas escasea más que el agua limpia. Luego sigues, antes de que la nostalgia de algo que quizá no tuviste te alcance del todo.' }
    ]
  },
  'sol_maquina_glitch': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Una máquina expendedora de HELIX se ha vuelto loca: parpadea, pita y suelta producto sin cobrar, una lata cada pocos segundos, vaciándose sola. Un corrillo se ha formado alrededor, dudando. '
         + 'Coger comida gratis de una máquina averiada de HELIX es, técnicamente, hurto a la corporación. Técnicamente, todo lo es.',
    opciones: [
      { texto: 'Coger un par de latas y repartir el resto.', efectos:{ fatiga:-2, hambre:-8, aislamiento:-4, alerta:3 },
        resultado:'Coges dos latas y empujas las demás hacia el corrillo: "Rápido, antes de que la arreglen." En segundos la máquina queda vacía y la gente se dispersa con su botín de hojalata, cómplices de un hurto de tres créditos contra una corporación que vale mundos. Una pequeña justicia tonta. Sabe mejor por eso.' },
      { texto: 'Llenarte tú todo lo que puedas.', efectos:{ hambre:-12, alerta:6, aislamiento:+3 },
        resultado:'Te lanzas y acaparas todas las latas que te caben encima, ante las miradas del corrillo. Comerás bien unos días. Pero al alejarte cargado, notas el peso de algo más que las latas: en las Pilas, el que se lo lleva todo cuando hay para repartir se queda más solo de lo que estaba. La máquina, a tu espalda, se calla por fin.' },
      { texto: 'No tocar nada de HELIX. Seguir.', efectos:{ aislamiento:+2 },
        resultado:'Pasas de largo. Las máquinas de HELIX averiadas a veces no están averiadas: a veces miran quién coge. No sabes si es paranoia o sentido común, y en las Pilas la diferencia te puede costar cara. Sigues con hambre y con la conciencia tranquila, que tampoco llena, pero no delata.' }
    ]
  },

  // ── VIÑETAS REPETIBLES (no se agotan) ─────────────────────
  'amb_goteras': {
    entrada: true, repetible: true,
    img: 'EXP_PLANTA_AGUA',
    texto: 'Bajo una tubería que gotea sin parar, alguien ha colocado un cubo y, al lado, un pequeño altar: velas, una figura del Eco, flores de plástico. Han convertido una avería en un santuario, '
         + 'porque cuando nadie va a arreglar la gotera, lo único que queda es darle un sentido. La gota cae con un ritmo casi litúrgico.',
    opciones: [
      { texto: 'Detenerte un segundo ante el altar.', efectos:{ aislamiento:-2, disociacion:+2 },
        resultado:'Te paras ante el cubo y las velas. No rezas —no sabrías a qué—, pero el goteo rítmico te calma un instante, como un latido prestado. En las Pilas, hasta una avería puede ser sagrada si alguien decide tratarla así. Sigues, un poco menos solo sin saber por qué.' }
    ]
  },
  'amb_cola_empleo': {
    entrada: true, repetible: true,
    img: 'EXP_PUERTO_CARGA',
    texto: 'Una cola enorme ante una oficina de empleo de HELIX que lleva el cartel "SIN VACANTES" encendido. La gente espera igual, por si acaso, por costumbre, porque hacer cola al menos parece hacer algo. '
         + 'Cada cierto rato, un altavoz repite que "las oportunidades se publican en la red", una red a la que la mitad de la cola no tiene acceso.',
    opciones: [
      { texto: 'Seguir, sin ponerte en la cola.', efectos:{ aislamiento:+2 },
        resultado:'Pasas de largo la cola del "sin vacantes". Sabes cómo acaba: con todos volviendo a casa igual que vinieron, habiendo gastado el día en la esperanza, que es lo único que HELIX reparte gratis y en cantidad.' }
    ]
  },
  'amb_ninos_lluvia': {
    entrada: true, repetible: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Un grupo de críos juega bajo la lluvia ácida fina, chapoteando en los charcos de neón, riendo, ajenos a que el agua no es buena y a casi todo lo demás. Una madre les grita desde un portal que suban, '
         + 'sin demasiada convicción, porque sabe que estos ratos —el agua, la risa, el ser niños un momento— tampoco abundan.',
    opciones: [
      { texto: 'Sonreír y seguir.', efectos:{ aislamiento:-3 },
        resultado:'Sonríes sin querer y sigues. La risa de los críos te acompaña media calle, un sonido absurdo y precioso en un sitio así. Esperas que tarden mucho en entender dónde han nacido. Algunos no lo entienden nunca, y quizá sea una suerte.' }
    ]
  },
  'amb_pantalla_averiada': {
    entrada: true, repetible: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una pantalla publicitaria averiada se ha quedado congelada en una sola imagen: una cara sonriente de modelo, ampliada hasta el grano, con un ojo a medio renderizar que la vuelve monstruosa. '
         + 'Lleva días así, presidiendo la calle con su mueca rota. Nadie la mira. Todos la han visto.',
    opciones: [
      { texto: 'Pasar por debajo sin mirarla.', efectos:{ disociacion:+2 },
        resultado:'Pasas por debajo de la sonrisa rota sin levantar la vista. Esas caras perfectas dan más miedo cuando se estropean: enseñan, por un fallo, la mentira que son siempre. Sigues, y juras que el ojo a medio renderizar te sigue un trecho. Es la pantalla. Tiene que ser la pantalla.' }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  AMPLIACIÓN 5 · LORE DEL SISTEMA SOLAR (v0.140)
  //  El universo a través de la gente que lo trajo a Las Pilas.
  //  Subtexto, nada de viajes, nada de Centauri.
  // ════════════════════════════════════════════════════════

  // ── CADENA 'veterano' — "EL QUE VINO DE MARTE" ───────────
  'vet_1': {
    entrada: true, cadena:'veterano',
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'En un rincón de la cantina bebe un hombre solo, ancho de hombros, con la piel curtida de quien vivió bajo tormentas de polvo rojo. En el dorso de la mano, descolorido, el tatuaje de un casco partido por la mitad. '
         + 'En la pantalla de la pared, un parte de HELIX habla de "estabilidad en los territorios marcianos". El hombre no levanta la vista del vaso, pero su mandíbula se tensa lo justo para que lo notes.',
    opciones: [
      { texto: 'Sentarte cerca sin decir nada.', lleva:'vet_2' },
      { texto: 'Invitarle a otra ronda.', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10 }, lleva:'vet_2' },
      { texto: 'Dejarle con lo suyo.', efectos:{ aislamiento:+2 },
        resultado:'Le dejas con su vaso y su parte de noticias mentiroso. Hay silencios que es mejor no interrumpir; el de un hombre que oye llamar "estabilidad" a lo que le quitó todo es uno de ellos. Sigues. El casco partido del tatuaje se te queda en la cabeza un rato.' }
    ]
  },
  'vet_2': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'El hombre tarda en hablar. Cuando lo hace, no mira a la pantalla ni a ti, sino al fondo del vaso. "Allá lo llamábamos de otra manera. La operación esa." No dice cuál. No hace falta. "Yo construía vigas. Buenas vigas. '
         + 'Un día decidieron que construir era resistir, y vinieron a apagarnos. Oficialmente ganaron. Oficialmente todo terminó." Levanta el vaso un par de dedos, sin brindar. "Oficialmente."',
    opciones: [
      { texto: '"¿Y por qué viniste aquí?"', lleva:'vet_3' },
      { texto: 'No preguntar. Solo escuchar.', efectos:{ aislamiento:-3 }, lleva:'vet_3' }
    ]
  },
  'vet_3': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Se encoge de hombros, un gesto que le cuesta más de lo que parece. "Aquí nadie me conoce. Allá todos sabían quién había sido, y eso, con ellos vigilando, es una condena. —Da un trago largo—. '
         + 'Quedamos pocos. Nos buscamos por marcas en las paredes, por un símbolo. No para volver a luchar. Para saber que el otro sigue respirando." Te mira por primera vez. "Tú no eres de los míos. Pero has escuchado sin sacar el móvil. Eso, hoy, ya es algo."',
    opciones: [
      { texto: 'Decirle que su historia no se borra contigo.', efectos:{ aislamiento:-5, faccion:'sindicatos', rep:+2 },
        resultado:'"No se borra conmigo", le dices, y le sostienes la mirada. Él asiente despacio, como quien archiva una promesa pequeña en un sitio donde caben pocas. No se dan la mano —no es de los que la dan—, pero cuando te levantas, golpea dos veces la mesa con los nudillos. Un saludo de los suyos. Sales de la cantina llevando, sin pedirlo, un pedazo de una guerra que perdió otro.' },
      { texto: 'Terminar la bebida en silencio y marcharte.', efectos:{ aislamiento:-2, disociacion:+2 },
        resultado:'Termináis los vasos sin más palabras. A veces el respeto es eso: no obligar al otro a decir más de lo que el cuerpo le deja. Al salir, lo dejas como lo encontraste, solo en su rincón, con su casco partido y su "oficialmente" colgando en el aire. Pero ahora dos personas, no una, saben que sigue respirando.' }
    ]
  },

  // ── SUELTAS de lore (un solo uso) ─────────────────────────
  'sol_minera': {
    entrada: true,
    img: 'EXP_TALLER_NEURAL',
    texto: 'En la cola de una clínica espera una mujer menuda con manos enormes de trabajar el vacío y una tos que le sube del fondo del pecho. "Diez años en el Cinturón —dice cuando nota que la miras, sin que preguntes—. '
         + 'Picando roca para que Marte la funda y la Tierra la gaste. El polvo se te mete y no sale. Me jubilaron cuando empecé a escupir gris." Se ríe, y la risa se le vuelve tos.',
    opciones: [
      { texto: 'Cederle tu turno en la cola.', efectos:{ aislamiento:-5, fatiga:+2 },
        resultado:'Le dices que pase delante. Te lo discute por orgullo y luego acepta por necesidad, que es como se aceptan casi todas las cosas en las Pilas. "Buen chico —dice, o buena chica, según te vea—. En el Cinturón aprendías rápido quién te cubría la espalda. Aquí abajo se ha perdido eso." Tose, y entra. Esperas, y no te importa esperar.' },
      { texto: 'Preguntarle cómo era allá arriba.', efectos:{ disociacion:+3, aislamiento:-3 },
        resultado:'"¿Allá? Negro. Negro y silencioso y enorme. —Mira a un punto que no está en esta calle—. Daba miedo y daba paz a la vez. Abajo no hay ni una cosa ni la otra. Solo ruido y gente y lluvia que quema." Calla. "No lo echo de menos. Pero sueño con el silencio." La cola avanza. Ella tose y sigue soñando despierta con el vacío.' }
    ]
  },
  'sol_puerto': {
    entrada: true,
    img: 'EXP_PUERTO_ORBITAL_1',
    texto: 'Desde una pasarela ves el puerto de carga: grúas automatizadas apilando contenedores en lanzaderas que subirán a los muelles orbitales y de ahí a quién sabe dónde. Un estibador viejo, apoyado en la barandilla a tu lado, '
         + 'mira lo mismo. "Cuarenta años cargando cajas que van a sitios que no veré —dice—. Mi nombre estará en el manifiesto de medio Sistema Solar y yo no he salido nunca de este barrio."',
    opciones: [
      { texto: '"¿Te gustaría haber ido?"', efectos:{ aislamiento:-3, disociacion:+2 },
        resultado:'Se lo piensa de verdad. "De joven me moría por subir a Selene, por ver Kilómetro Cero, por perderme entre los millones que pasan por allí. —Escupe al vacío bajo la pasarela—. Ahora sé que allá arriba está igual de solo que aquí, solo que con mejores vistas. La gente de paso no pertenece a ningún sitio. Yo, al menos, pertenezco a este." Lo dice sin pena. Casi con orgullo.' },
      { texto: 'Mirar partir las lanzaderas con él, en silencio.', efectos:{ aislamiento:-4 },
        resultado:'Os quedáis los dos viendo subir las lanzaderas, una tras otra, llevándose la riqueza de la humanidad hacia arriba mientras vosotros os quedáis abajo, anclados. No hay envidia en ese silencio compartido. Hay algo más raro y más calmo: la paz de saber exactamente de qué trozo pequeño del universo eres, aunque sea este.' }
    ]
  },
  'sol_correo_orbital': {
    entrada: true,
    img: 'EXP_PUERTO_ORBITAL_1',
    texto: 'Una mujer espera frente a la ventanilla de correo orbital con la paciencia de quien lleva esperando mucho. "Mi hijo se enroló en una estación del Cinturón —te cuenta, porque necesita contárselo a alguien—. '
         + 'Manda una cápsula cada pocos meses. Tarda tanto en llegar que, cuando la escucho, ya no sé si la voz que oigo sigue ahí arriba. Hablo con un hijo que igual es de hace medio año. O de más." Aprieta la cápsula vacía de la última.',
    opciones: [
      { texto: 'Decirle que mientras llegan, sigue ahí.', efectos:{ aislamiento:-4 },
        resultado:'"Mientras lleguen, sigue ahí", le dices. Ella se agarra a la frase como a una cuerda. "Eso me digo. Que el silencio largo es la distancia, no... lo otro." No termina la frase. En el espacio, las malas noticias también viajan a la velocidad de las cosas pesadas: cuando llegan, ya son viejas. Ella vuelve a mirar la ventanilla, esperando una voz con meses de retraso.' },
      { texto: 'Quedarte acompañándola hasta que abran.', efectos:{ aislamiento:-5, fatiga:+2 },
        resultado:'Te quedas con ella el rato que falta. No hablan apenas. Cuando por fin abren y le entregan una cápsula nueva, le tiemblan las manos al cogerla. No la abre delante de ti; eso es suyo. Pero te mira con un agradecimiento que no cabe en palabras, el de quien no ha tenido que esperar solo esta vez. Sigues, y tardas en quitarte de encima el peso dulce de esa espera ajena.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
