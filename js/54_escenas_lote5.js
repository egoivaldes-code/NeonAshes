// ============================================================
// BLOQUE JS-54 — ESCENAS DE GUION · LOTE 5 (eventos de 4-6 escenas)
// ------------------------------------------------------------
// 4 eventos de exploración LARGOS, con ramas que divergen y a veces
// reconvergen. Más cuerpo narrativo y decisiones con peso, pero NO son
// cadenas de misión persistentes (eso es el lote 6): empiezan y
// terminan dentro de una misma exploración. Mismo formato que los
// lotes anteriores. Se carga DESPUÉS de 53_escenas_lote4.js.
//
// Neutrales. Solo imágenes, items y condiciones que YA existen.
// Prefijo de id: ev3_
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ================================================================
  // EVENTO 1 — "EL ASCENSOR AVERIADO" (5 escenas)
  // Quedas atrapado en un montacargas con una desconocida. Es un
  // evento de encierro: la tensión es humana, no de acción.
  // ================================================================
  'ev3_ascensor_1': {
    entrada: true,
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Entras en un montacargas de carga junto a una mujer de mono de trabajo. Las puertas se cierran, el '
         + 'cubículo arranca con un quejido metálico y, entre dos niveles, se para en seco. La luz parpadea. '
         + 'Silencio. La mujer suspira como quien ya ha vivido esto. "Lo de siempre. Una hora, mínimo."',
    opciones: [
      { texto: 'Intentar forzar las puertas.', lleva:'ev3_ascensor_fuerza' },
      { texto: 'Resignarte y esperar con ella.', lleva:'ev3_ascensor_espera' },
      { texto: 'Buscar el panel de emergencia.', lleva:'ev3_ascensor_panel' }
    ]
  },
  'ev3_ascensor_fuerza': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Metes los dedos en la rendija y tiras. No ceden. "Vas a sacarte un hombro", dice ella sin moverse. '
         + '"Esas puertas aguantan más que tú." Tiene razón y lo sabes, pero la idea de estar encerrado te '
         + 'aprieta el pecho. Insistes una vez más, y el metal te muerde los dedos.',
    opciones: [
      { texto: 'Seguir forzando, te puede el agobio.', efectos:{ condicion:'herida_brazo_d_leve', fatiga:+6, disociacion:+3 },
        resultado:'Tiras hasta que algo en tu mano dice basta. Las puertas no ceden. Te dejas caer contra la pared, jadeando, con los dedos en carne viva. Ella te pasa un trapo sin decir "te lo dije". Lleva razón, pero te ahorra oírlo.', lleva:'ev3_ascensor_charla' },
      { texto: 'Rendirte y sentarte a esperar.', efectos:{ fatiga:+2 },
        resultado:'Sueltas las puertas y te deslizas hasta el suelo. "Bienvenido a la espera", dice ella, sentándose enfrente. La luz parpadea sobre vosotros dos.', lleva:'ev3_ascensor_charla' }
    ]
  },
  'ev3_ascensor_panel': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Encuentras el panel de emergencia. El botón de alarma está hundido y muerto: alguien ya lo pulsó mil '
         + 'veces sin respuesta. Hay un viejo interfono con un cable pelado. "Ese a veces funciona", dice ella. '
         + '"Si no te importa pegar la boca a algo que ha tocado media ciudad."',
    opciones: [
      { texto: 'Usar el interfono y pedir ayuda.', azar:{ prob:0.5,
          exito:{ resultado:'Hablas al interfono. Tras una eternidad de estática, una voz aburrida responde que "lo anotan". Sorprendentemente, diez minutos después el ascensor se mueve. Ella te mira con respeto. "Vaya. Hoy alguien hacía su trabajo."', efectos:{ aislamiento:-3 }, lleva:'ev3_ascensor_salida' },
          fallo:{ resultado:'Hablas a la estática. Nadie responde, o si lo hace, no se molesta. Sueltas el interfono con un regusto a metal y derrota. "Era mucho pedir", murmura ella. Os queda esperar.', efectos:{ disociacion:+2 }, lleva:'ev3_ascensor_charla' } } },
      { texto: 'Dejarlo: no servirá de nada.', efectos:{ aislamiento:+1 },
        resultado:'Apartas la mano del cable pelado. "Lista", dice ella. "Ese interfono solo da falsas esperanzas." Te sientas a esperar con ella.', lleva:'ev3_ascensor_charla' }
    ]
  },
  'ev3_ascensor_espera': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Te sientas en el suelo frente a ella. El montacargas cruje. Fuera, el zumbido lejano de la ciudad. '
         + 'Por un rato no habláis: dos extraños compartiendo una caja metálica suspendida en la nada. Luego '
         + 'ella saca media tableta de chocolate sintético y parte un trozo para ti, sin preguntar.',
    opciones: [
      { texto: 'Aceptar el chocolate y dar conversación.', lleva:'ev3_ascensor_charla' },
      { texto: 'Aceptarlo pero quedarte callado.', efectos:{ hambre:-2, aislamiento:-1 },
        resultado:'Coges el trozo y lo comes en silencio. Ella no insiste en hablar. Es un silencio cómodo, raro en las Pilas. Cuando el ascensor por fin se mueve, os despedís con un gesto. A veces basta con compartir el encierro.', lleva:'ev3_ascensor_salida' }
    ]
  },
  'ev3_ascensor_charla': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Habláis para matar el tiempo. Se llama —o dice llamarse— Rena. Lleva quince años reparando estos '
         + 'mismos ascensores que la dejan tirada. "Es un chiste, ¿no?", se ríe sin ganas. "Arreglo lo que me '
         + 'encierra." Te pregunta a qué te dedicas. Y por un momento, la caja metálica se siente menos fría.',
    opciones: [
      { texto: 'Contarle algo verdadero de ti.', efectos:{ aislamiento:-6, disociacion:-2 },
        resultado:'Le cuentas algo real, sin adornos. Ella escucha de verdad, que es lo más raro de todo. Cuando el ascensor revive, te tiende la mano. "Suerte ahí fuera." Sales con la sensación tibia de haber sido, por diez minutos, una persona y no un superviviente.', lleva:'ev3_ascensor_salida' },
      { texto: 'Inventarte una vida más bonita.', efectos:{ disociacion:+4, aislamiento:-1 },
        resultado:'Le pintas una versión de ti con más suerte y menos grietas. Ella sonríe y te sigue el juego, quizá sabiéndolo. Cuando sales, la mentira te deja un poso amargo: era más fácil que la verdad, y por eso duele.', lleva:'ev3_ascensor_salida' }
    ]
  },
  'ev3_ascensor_salida': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'El montacargas completa su viaje con la misma indiferencia con que se paró. Las puertas se abren a un '
         + 'pasillo idéntico a cualquier otro. Rena se va por su lado sin mirar atrás, tragada por la rutina. '
         + 'Te quedas un segundo en el umbral, recordando que detrás de cada mono de trabajo hay una vida entera.',
    opciones: [
      { texto: 'Seguir tu camino.', efectos:{ fatiga:+2 },
        resultado:'Sales. La ciudad te reclama. Pero por hoy llevas algo que no tenías al entrar en esa caja: la prueba de que aún se puede hablar con alguien y que algo, dentro, responda.' }
    ]
  },

  // ================================================================
  // EVENTO 2 — "LA DEUDA DEL VECINO" (6 escenas)
  // Un vecino te pide ayuda con unos prestamistas. Dilema moral
  // sin respuesta limpia.
  // ================================================================
  'ev3_deuda_1': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'Un hombre mayor te corta el paso en el rellano, temblando. "Tú vives cerca, ¿verdad? Por favor. '
         + 'Vienen a por mí esta noche. Debo dinero y no lo tengo. Solo necesito que... que estés ahí. Que vean '
         + 'que no estoy solo. A veces con eso basta para que no se pasen de la raya." Te agarra la manga.',
    opciones: [
      { texto: 'Preguntar cuánto debe y a quién.', lleva:'ev3_deuda_info' },
      { texto: 'Aceptar acompañarlo sin preguntar.', lleva:'ev3_deuda_noche' },
      { texto: '"No puedo meterme en esto." Zafarte.', lleva:'ev3_deuda_rechazo' }
    ]
  },
  'ev3_deuda_info': {
    img: 'HOUSING_BLOCK_B2',
    texto: '"Doscientos créditos. A los hombres de Vosk." Palidece al decir el nombre. "Sé que suena a poco, '
         + 'pero con los intereses... y no es por el dinero, ¿entiendes? Es que cuando huelen miedo, vuelven. '
         + 'Y vuelven. Si esta noche ven que hay alguien conmigo, a lo mejor buscan presa más fácil."',
    opciones: [
      { texto: 'Ofrecerte a pagar parte de la deuda. (50 créditos)', req:{ creditosMin:50 }, pista:'50 créditos',
        efectos:{ creditos:-50 },
        resultado:'Le pones cincuenta créditos en la mano temblorosa. "No es todo, pero ablanda la cifra", dices. Te mira como si le hubieras devuelto algo más que dinero. "¿Por qué...?" No sabes la respuesta. Quizá porque mañana podrías ser tú.', lleva:'ev3_deuda_noche' },
      { texto: 'Acompañarlo, pero sin poner dinero.', efectos:{ aislamiento:-2 },
        resultado:'"No tengo para pagar tus deudas", le dices, "pero esta noche estaré ahí." Asiente, agradecido hasta de eso. La presencia, a veces, es lo único que se puede ofrecer.', lleva:'ev3_deuda_noche' }
    ]
  },
  'ev3_deuda_rechazo': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Te sueltas la manga con suavidad. "Lo siento. No puedo." El hombre asiente despacio, sin reproche, '
         + 'como si ya esperara esa respuesta de todo el mundo. "Claro. Claro que no. Perdona que te haya '
         + 'parado." Se mete en su puerta, y el clic del cerrojo suena más solo que cualquier grito.',
    opciones: [
      { texto: 'Irte, pero el remordimiento te pesa.', efectos:{ aislamiento:+4, disociacion:+2 },
        resultado:'Te alejas por el rellano. Cada paso suena más fuerte que el anterior. No le debías nada. No era tu problema. Te repites las dos cosas todo el camino, y ninguna te sirve de mucho.' },
      { texto: 'Pararte... y cambiar de idea.', efectos:{ aislamiento:-3 },
        resultado:'Te detienes a mitad del rellano. Maldices entre dientes y vuelves. "Está bien. Esta noche estaré ahí." La cara que pone al abrir la puerta casi compensa el lío en que acabas de meterte.', lleva:'ev3_deuda_noche' }
    ]
  },
  'ev3_deuda_noche': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Esa noche esperas con él en su cuartucho. A la hora prevista, golpes secos en la puerta. Dos hombres '
         + 'de Vosk entran sin pedir permiso. Uno gordo, uno flaco. Te miran a ti, calculando. "¿Y este quién '
         + 'es?", dice el flaco. El viejo no puede ni hablar. Te toca a ti decidir cómo se juega esto.',
    opciones: [
      { texto: 'Plantarte sereno: "Un testigo. Nada más."', azar:{ prob:0.55,
          exito:{ resultado:'Lo dices con una calma que ni tú te creías. Los dos se miran. La presencia de un testigo cambia las cuentas: no quieren líos con nombres y caras. "Tiene hasta fin de semana", gruñe el gordo, y se van. El viejo se derrumba en una silla, vivo.', efectos:{ aislamiento:-5 }, lleva:'ev3_deuda_final' },
          fallo:{ resultado:'Tu calma no los impresiona. El flaco se te acerca. "Los testigos también sangran." Un empujón, un golpe corto en las costillas que te dobla. Pero el escándalo y tu cara vista los frena de ir a más. Se van prometiendo volver. Has encajado el golpe por otro.', efectos:{ condicion:'costillas', disociacion:+3 }, lleva:'ev3_deuda_final' } } },
      { texto: 'Negociarles un plazo con labia.', azar:{ prob:0.5,
          exito:{ resultado:'Hablas rápido y razonable: un muerto no paga, un plazo sí. El gordo escucha, sopesa, asiente. "Listo el amigo. Fin de semana, ni un día más." Se van. El viejo te mira como a un milagro. La labia, hoy, ha valido más que los puños.', efectos:{ aislamiento:-4 }, lleva:'ev3_deuda_final' },
          fallo:{ resultado:'Hablas demasiado. "Te crees listo", dice el flaco, y la cosa se tuerce. Un par de empujones, una advertencia con el dedo en tu pecho. Se van enfadados. No te han roto nada, pero al viejo le has complicado la cuenta. La labia, a veces, irrita.', efectos:{ disociacion:+3, aislamiento:+1 }, lleva:'ev3_deuda_final' } } },
      { texto: 'Quedarte callado en un rincón.', efectos:{ aislamiento:+2, disociacion:+2 },
        resultado:'Te quedas mudo, presente pero inútil. Los hombres se relajan al ver que no eres amenaza. Zarandean al viejo, le recuerdan la fecha y se van. No ha ido a más, quizá por tu sola presencia. Pero te vas con la sensación de no haber estado del todo ahí.', lleva:'ev3_deuda_final' }
    ]
  },
  'ev3_deuda_final': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Cuando se van, el silencio del cuartucho es enorme. El viejo te ofrece lo único que tiene: una taza '
         + 'de algo caliente y la mitad de una historia sobre cómo llegó a deber dinero a gente así. No hace '
         + 'falta que la termine. En las Pilas, todas esas historias empiezan igual y acaban peor.',
    opciones: [
      { texto: 'Quedarte un rato a acompañarlo.', efectos:{ aislamiento:-4, fatiga:+3 },
        resultado:'Te quedas hasta que deja de temblar. No arreglas nada de fondo: el sábado volverán. Pero esta noche no está solo, y eso, hoy, es toda la victoria disponible. Sales de madrugada, agotado y extrañamente en paz.' },
      { texto: 'Despedirte: ya has hecho bastante.', efectos:{ fatiga:+2 },
        resultado:'Apuras la taza y te despides. Él te lo agradece tantas veces que resulta incómodo. Sales al pasillo frío. Has hecho lo que podías. El resto de su historia tendrá que escribirla él.' }
    ]
  },

  // ================================================================
  // EVENTO 3 — "EL TALLER DEL RELOJERO CIEGO" (5 escenas)
  // Un artesano ciego te ofrece un trato extraño. Sobre memoria y oficio.
  // ================================================================
  'ev3_relojero_1': {
    entrada: true,
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'Un taller diminuto lleno de mecanismos. El dueño, un anciano ciego, monta piezas a tientas con una '
         + 'precisión imposible. "Pasa, pasa. Te oigo dudar desde la calle." Sonríe hacia un punto a tu '
         + 'izquierda. "Busco manos jóvenes para un trabajo fino. Las mías ya solo recuerdan, no ven."',
    opciones: [
      { texto: 'Preguntar qué clase de trabajo.', lleva:'ev3_relojero_oferta' },
      { texto: '"¿Cómo trabaja sin ver?"', lleva:'ev3_relojero_ceguera' },
      { texto: 'Disculparte: no es para ti.', efectos:{ aislamiento:+1 },
        resultado:'"Una pena. Pero gracias por entrar", dice, ya volviendo a sus piezas. Sales. Durante un rato, el recuerdo de esas manos ciegas montando lo invisible te sigue calle abajo.' }
    ]
  },
  'ev3_relojero_ceguera': {
    img: 'EXP_TALLER_REUTILIZA',
    texto: '"La vista estorba para esto", dice, sin dejar de montar. "Los ojos te engañan con lo bonito. Los '
         + 'dedos no mienten: notan dónde encaja cada cosa." Levanta una pieza diminuta. "Llevo sesenta años '
         + 'tocando mecanismos. Podría montar este reloj dormido. Lo que ya no puedo es enhebrar la última junta."',
    opciones: [
      { texto: 'Ofrecerte a enhebrar esa junta.', lleva:'ev3_relojero_trabajo' },
      { texto: 'Preguntar por el trato que ofrecía.', lleva:'ev3_relojero_oferta' }
    ]
  },
  'ev3_relojero_oferta': {
    img: 'EXP_TALLER_REUTILIZA',
    texto: '"Tengo un mecanismo que un cliente dejó hace años y nunca recogió. Un reproductor de memorias '
         + 'antiguo. Si me ayudas a terminarlo, es tuyo." Hace una pausa. "Te advierto: esas máquinas guardan '
         + 'los recuerdos de su dueño anterior. Lo que oigas dentro no será tuyo. Algunos no lo soportan."',
    opciones: [
      { texto: 'Aceptar y ayudar a montarlo.', lleva:'ev3_relojero_trabajo' },
      { texto: 'Es demasiado raro. Rechazar.', efectos:{ disociacion:+2 },
        resultado:'"Sabia decisión, quizá", dice el viejo. "Los recuerdos ajenos pesan." Te vas sin el aparato, pero su advertencia —máquinas llenas de memorias prestadas— se queda contigo, incómoda, todo el día.' }
    ]
  },
  'ev3_relojero_trabajo': {
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'Trabajáis codo con codo. Él te guía con la voz: "más a la izquierda... nota el muelle... ahí". Tus '
         + 'manos y su memoria, juntas, dan vida al mecanismo. Es un trabajo lento, casi sagrado. Cuando la '
         + 'última junta encaja con un clic perfecto, el viejo suelta el aire como quien termina una oración.',
    opciones: [
      { texto: 'Encender el reproductor para probarlo.', lleva:'ev3_relojero_memoria' },
      { texto: 'Dejarlo apagado y llevártelo sin más.', efectos:{ item:'chip_datos_corrupto', aislamiento:-3 },
        resultado:'Decides no abrir esa caja de memorias ajenas. El viejo asiente. "Mejor. Algunos cofres se llevan cerrados." Te lo guardas, apagado. Quizá algún día. Quizá nunca. Sales con el peso tibio del aparato y de un trabajo bien hecho.' }
    ]
  },
  'ev3_relojero_memoria': {
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'El reproductor zumba y proyecta, borrosa, la memoria de su dueño muerto: una cocina con sol, una voz '
         + 'que canturrea, manos que parten pan. Una vida cualquiera, feliz y perdida. El viejo escucha con la '
         + 'cara vuelta hacia el sonido. "Ese era mi cliente", susurra. "Nunca volvió. Ahora ya sé por qué."',
    opciones: [
      { texto: 'Quedarte el reproductor y la memoria.', efectos:{ item:'chip_datos_corrupto', disociacion:+6, aislamiento:-2 },
        resultado:'Te llevas el aparato con su recuerdo ajeno latiendo dentro. El viejo no te cobra nada. "Cuídalo. Es la única tumba que le quedó." Sales a la lluvia cargando la felicidad de un desconocido muerto. Pesa más de lo que imaginabas.' },
      { texto: 'Dejárselo al viejo: a él le pertenece más.', efectos:{ aislamiento:-6, disociacion:+3 },
        resultado:'Le pones el reproductor en las manos. "Quédeselo usted. Lo conoció." El ciego lo aprieta contra el pecho y, por primera vez, sus ojos muertos se humedecen. "Gracias", dice, con una voz que ya no es de comerciante. Sales sin nada en las manos y con todo en el pecho.' }
    ]
  },

  // ================================================================
  // EVENTO 4 — "LA REDADA EN EL MERCADO" (5 escenas)
  // Estás en un mercado cuando llega una redada de seguridad HELIX.
  // Caos, decisiones rápidas.
  // ================================================================
  'ev3_redada_1': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Rebuscas en un mercado de baratijas cuando un grito recorre los puestos: "¡REDADA!". Sirenas. Los '
         + 'vendedores recogen a toda prisa, la gente se dispersa como ratas. Agentes de seguridad HELIX entran '
         + 'por el lado norte, revisando identidades. Tienes segundos para decidir qué haces.',
    opciones: [
      { texto: 'Correr con la multitud hacia las salidas.', lleva:'ev3_redada_huida' },
      { texto: 'Quedarte quieto: no has hecho nada.', lleva:'ev3_redada_control' },
      { texto: 'Ayudar a una vendedora a recoger.', lleva:'ev3_redada_vendedora' }
    ]
  },
  'ev3_redada_huida': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Te dejas llevar por la estampida hacia un callejón lateral. Cuerpos, codos, pánico. Al fondo, dos '
         + 'salidas: una alcantarilla abierta por la que se cuela gente, y una pasarela elevada más despejada '
         + 'pero a la vista de los agentes. La multitud te empuja hacia delante. Hay que elegir ya.',
    opciones: [
      { texto: 'Bajar por la alcantarilla, oculto.', azar:{ prob:0.7,
          exito:{ resultado:'Te dejas caer por la alcantarilla. Oscuridad, peste, agua hasta los tobillos. Pero nadie te sigue. Avanzas a tientas hasta una salida lejana y emerges lejos del mercado, sucio pero libre. La huida limpia que necesitabas.', efectos:{ fatiga:+5, aislamiento:+1 }, lleva:'ev3_redada_final_libre' },
          fallo:{ resultado:'Bajas a la alcantarilla pero resbalas en el último peldaño y caes mal. El tobillo cruje. Avanzas cojeando por el túnel, conteniendo el dolor, hasta salir lejos. Libre, sí, pero el cuerpo te va a pasar factura.', efectos:{ condicion:'mareado', fatiga:+8 }, lleva:'ev3_redada_final_libre' } } },
      { texto: 'Cruzar la pasarela, más rápido pero visible.', azar:{ prob:0.45,
          exito:{ resultado:'Cruzas la pasarela a la carrera. Un agente te ve y grita, pero ya estás al otro lado y entre las sombras antes de que reaccione. Corazón a mil, pero limpio. A veces lo arriesgado sale bien.', efectos:{ fatiga:+6 }, lleva:'ev3_redada_final_libre' },
          fallo:{ resultado:'A media pasarela, un agente te corta el paso. "¡Alto! Identidad." No hay escapatoria digna. Te toca pasar el control por las malas, con ellos ya mosqueados por la persecución.', efectos:{ fatiga:+4, disociacion:+2 }, lleva:'ev3_redada_control' } } }
    ]
  },
  'ev3_redada_vendedora': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'En vez de huir, ayudas a una vendedora anciana a meter su mercancía en cajas. "¡Mis cosas, no me da '
         + 'tiempo!" Recogéis a cuatro manos mientras los agentes se acercan puesto a puesto. Es un riesgo '
         + 'absurdo por unas baratijas ajenas. Pero ella te mira con un pánico que no puedes ignorar.',
    opciones: [
      { texto: 'Terminar de recoger aunque lleguen los agentes.', efectos:{ aislamiento:-6 },
        resultado:'Acabáis justo cuando un agente llega. Ve a dos personas recogiendo un puesto, nada sospechoso, y pasa de largo. La vendedora te aprieta las manos, sin palabras. Te ganas una aliada en el mercado y algo más valioso: el recuerdo de no haber huido.', lleva:'ev3_redada_control' },
      { texto: 'Recoger lo justo y largarte antes de que lleguen.', efectos:{ aislamiento:-2, fatiga:+2 },
        resultado:'Salvas lo principal y te escabulles antes de que el agente os alcance. "¡Gracias, hijo!", oyes a tu espalda. No lo has dado todo, pero más que la mayoría. Te pierdes entre la gente.', lleva:'ev3_redada_final_libre' }
    ]
  },
  'ev3_redada_control': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Un agente HELIX se planta ante ti, visor opaco, escáner en mano. "Identidad." Le tiendes tus datos. '
         + 'El escáner pita mientras procesa, un segundo que se hace eterno. Detrás del visor, no sabes si te '
         + 'mira a ti o a tu ficha. El zumbido del aparato es lo único que existe en el mundo ahora mismo.',
    opciones: [
      { texto: 'Mantener la calma y responder lo justo.', azar:{ prob:0.8,
          exito:{ resultado:'El escáner pita en verde. "Circula." El agente ya mira al siguiente antes de terminar la palabra. Sueltas el aire despacio y te alejas sin correr, sintiendo cómo el corazón vuelve a su sitio paso a paso. Otra vez has sido invisible, y hoy eso es una bendición.', efectos:{ disociacion:+1 }, lleva:'ev3_redada_final_libre' },
          fallo:{ resultado:'El escáner pita en ámbar: "dato incompleto". El agente frunce algo tras el visor y te retiene para "verificación". Veinte minutos de preguntas secas en un rincón antes de soltarte sin disculpas. No eras nadie, solo un trámite. Sales agotado y humillado.', efectos:{ disociacion:+4, fatiga:+5 }, lleva:'ev3_redada_final_libre' } } },
      { texto: 'Soltar un comentario nervioso de más.', efectos:{ disociacion:+3, fatiga:+3 },
        resultado:'Hablas más de lo que debías por puro nervio. El agente te mira fijo, alarga el control solo porque puede, y te hace repetir tus datos tres veces. Al final te suelta, aburrido. Aprendes que ante un visor opaco, el silencio es la única respuesta segura.', lleva:'ev3_redada_final_libre' }
    ]
  },
  'ev3_redada_final_libre': {
    img: 'SECTOR7_STREETS',
    texto: 'Lejos del mercado, la calma vuelve poco a poco. A tu espalda, las sirenas siguen mordiendo la noche, '
         + 'pero ya no son para ti. La redada se traga a otros: siempre hay otros. Te apoyas en una pared a '
         + 'recuperar el aliento, y la ciudad, indiferente, sigue su curso como si nada hubiera pasado.',
    opciones: [
      { texto: 'Recomponerte y seguir.', efectos:{ fatiga:+1 },
        resultado:'Respiras hondo y retomas el paso. Una redada más en una vida hecha de esquivarlas. No es valor lo que te queda: es costumbre. Y en las Pilas, la costumbre de sobrevivir es lo más parecido que hay a una habilidad.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
