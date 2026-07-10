// ============================================================
// BLOQUE JS-76 — CADENAS LARGAS DE MISIÓN (v0.140)
// ------------------------------------------------------------
// Tres arcos largos, opcionales, sembrados en el sandbox. Cada uno
// se vive por ACTOS y se dosifica solo: cada acto aparece como una
// escena de ENTRADA distinta, condicionada (cond.visto) a la bandera
// que dejó el acto anterior. Además llevan cadena:'arcoX', así que
// el motor solo deja avanzar UNA parte de cada arco por cada salida
// (deriva), para que la historia respire entre medias.
//
// Estructura de cada arco:
//   ACTO 1  — ~7 escenas enlazadas por 'lleva' (una sentada).
//             La última deja la bandera  X_act1.
//   ACTO 2  — ~5 escenas. Entrada gated  cond:{visto:'X_act1'}.
//             La última deja la bandera  X_act2.
//   COMBATE — escena con op.pelea (enemigos + refuerzos por turno).
//             Entrada gated cond:{visto:'X_act2'}. gana/pierde
//             desembocan en remates que dejan la bandera  X_cmb.
//             (Perder NO mata: la historia sigue, con coste.)
//   ACTO 3  — ~5 escenas. Entrada gated cond:{visto:'X_cmb'}.
//             La última deja la bandera  X_done (arco cerrado).
//
// NO toca el hilo Centauri (su propia pista de construcción).
// Tono: melancólico, contenido, el jugador NUNCA es el héroe.
//
// Se carga DESPUÉS de los lotes de escenas; se fusiona en ESCENAS_GUION.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ████████████████████████████████████████████████████████
  //  ARCO A — "EL YUNQUE NO SE APAGA"
  //  Una célula marciana del Arrabal intenta sacar de la ciudad
  //  a un hombre al que HELIX está borrando del registro.
  //  El jugador entra de lado, como correo y testigo.
  // ████████████████████████████████████████████████████████

  // ---- ACTO 1 ----------------------------------------------
  'A_a1_1': {
    entrada:true, cadena:'arcoA',
    img:'EXP_MERCADO_OLVIDADOS',
    texto:'En un puesto del Arrabal Carmesí, una mujer de manos fuertes y acento marciano pega en la pared una hoja con una cara y un número de residente. No pone "desaparecido": pone "BORRADO DEL REGISTRO". '
        + 'Te mira pegar la vista en el papel y, en lugar de apartarte, se acerca. "Tú no llevas ojos de HELIX. Se nota a quién mira con miedo y a quién con pena."',
    opciones:[
      { texto:'"¿Qué significa borrado del registro?"', lleva:'A_a1_2' },
      { texto:'Decir que no quieres líos y seguir.', efectos:{ aislamiento:+3 },
        resultado:'"Claro. Nadie quiere." Lo dice sin rencor, y vuelve a su engrudo y sus carteles. Te alejas. La cara del hombre borrado se queda mirándote desde la pared media calle, hasta que doblas la esquina y te la quitas de encima como quien se sacude la lluvia.' }
    ]
  },
  'A_a1_2': {
    img:'EXP_MERCADO_OLVIDADOS',
    texto:'"Significa que dejas de existir en papel —dice, bajando la voz—. Mi hermano Tomás trabajó las refinerías de allá arriba. Cuando vino, le resurgió un nombre en una lista vieja de Silencio Escarlata. '
        + 'HELIX no detiene a los de esas listas: los despublica. Le borran el registro, las deudas, la ficha... y a un hombre sin ficha se lo puede recoger una noche y que conste como que nunca estuvo."',
    opciones:[
      { texto:'"¿Y qué puede hacer alguien como yo?"', lleva:'A_a1_3' },
      { texto:'"Eso es asunto de los tuyos, no mío."', efectos:{ aislamiento:+2 },
        resultado:'Asiente, despacio, como quien ya contaba con esa respuesta. "Tienes razón. Es nuestro." Pero antes de que te vayas añade, casi para sí: "Solo que cada vez somos menos para cargarlo." Te marchas con esa frase pesándote más de lo que esperabas.' }
    ]
  },
  'A_a1_3': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'"Llevar una cosa de un sitio a otro. Sin preguntas. Hoy." Te tiende una lata sellada, del tamaño de un puño, sorprendentemente pesada. "A la trastienda del relojero, dos bloques al sur. '
        + 'Si te paran, es té. Si te abren la lata y no es té, los dos tenemos un problema, pero tú primero." Lo dice sin amenaza, solo con la honestidad de quien ya no adorna las cosas.',
    opciones:[
      { texto:'Coger la lata y llevarla.', efectos:{ aislamiento:-2 }, lleva:'A_a1_4' },
      { texto:'Preguntar qué hay dentro antes de tocarla.', lleva:'A_a1_4' }
    ]
  },
  'A_a1_4': {
    img:'EXP_TALLER_REUTILIZA',
    texto:'La trastienda del relojero huele a aceite y a metal viejo. Un hombre mayor, marciano también, de espalda ancha y una mano de prótesis que ajusta engranajes con una delicadeza imposible, abre la lata sin mirarte: '
        + 'dentro, no hay té, sino un disco de datos y un fajo de documentos en papel. "El Tornero", lo llaman. No te da la mano. Te estudia. "¿Sela te ha mandado a ti? Debe de estar más desesperada de lo que dice."',
    opciones:[
      { texto:'"¿Qué es todo esto?"', lleva:'A_a1_5' },
      { texto:'Quedarte callado y dejar que hable él.', efectos:{ aislamiento:-1 }, lleva:'A_a1_5' }
    ]
  },
  'A_a1_5': {
    img:'EXP_TALLER_REUTILIZA',
    texto:'"La prueba de que Tomás existe —dice el Tornero, separando los papeles con su mano buena—. Una vez lo despublican, lo único que demuestra que fue una persona es el papel que guardemos nosotros. Sin esto, '
        + 'es una unidad vacía y un expediente cerrado. Con esto, sigue siendo un hombre al que alguien echará de menos." Te mira. "Falta una pieza: su ficha de fundición, la que prueba que trabajó. Sigue en su piso, que HELIX precinta mañana."',
    opciones:[
      { texto:'Ofrecerte a entrar a por ella.', efectos:{ aislamiento:-3 }, lleva:'A_a1_6' },
      { texto:'"¿Por qué yo y no uno de los vuestros?"', lleva:'A_a1_6' }
    ]
  },
  'A_a1_6': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'El piso de Tomás está en un bloque ya medio vaciado, con avisos de precinto en las puertas. La suya tiene el sello rojo de "recuperación pendiente". Dentro, todo sigue como si fuera a volver: '
        + 'una taza a medio fregar, una manta echada. Sobre una estantería, enmarcada, la ficha de fundición con el yunque y tres estrellas. Un dron de inventario de HELIX zumba en el rellano, acercándose puerta a puerta.',
    opciones:[
      { texto:'Coger la ficha y salir por la ventana.', efectos:{ fatiga:+6, item:'ficha_minera' }, lleva:'A_a1_7' },
      { texto:'Esperar a que el dron pase y salir por la puerta.', efectos:{ fatiga:+3, item:'ficha_minera', aislamiento:+2 }, lleva:'A_a1_7' }
    ]
  },
  'A_a1_7': {
    img:'EXP_TALLER_REUTILIZA',
    texto:'Devuelves la ficha al Tornero, que la coloca junto al resto con un cuidado de relojero. Por primera vez te mira sin desconfianza. "Has entrado en un piso precintado por un hombre que no conoces. '
        + 'Eso o eres tonto o eres de fiar, y tontos ya tenemos." Sela, en el rincón, exhala como si llevara horas sin hacerlo. "Esto no ha terminado —dice—. Falta lo difícil: sacarlo de la ciudad. Pero esta noche, gracias a ti, Tomás todavía existe."',
    opciones:[
      { texto:'"Contad conmigo para lo que falte."', efectos:{ aislamiento:-5, faccion:'sindicatos', rep:+2, marcaVisto:'A_act1' },
        resultado:'El Tornero asiente una sola vez, que en él es un abrazo. Sela te aprieta el antebrazo a la manera del barrio. No te prometen pago: te prometen que te buscarán cuando llegue el momento. Sales del taller formando parte, sin firmar nada, de algo que HELIX llamaría delito y ellos llaman familia.' },
      { texto:'"He ayudado hoy. Mañana no prometo nada."', efectos:{ aislamiento:-2, marcaVisto:'A_act1' },
        resultado:'"Mañana nadie promete nada aquí", dice Sela, sin reproche. Guardan la prueba de Tomás bajo una tabla del suelo. Te vas sin compromiso, pero algo ha cambiado: ahora, cuando pases por el Arrabal, sabrás qué se cuece bajo la calma. Y ellos sabrán dónde encontrarte.' }
    ]
  },

  // ---- ACTO 2 ---- (gated: visto A_act1) -------------------
  'A_a2_1': {
    entrada:true, cadena:'arcoA', cond:{ visto:'A_act1' },
    img:'EXP_MERCADO_OLVIDADOS',
    texto:'Sela te encuentra en el Arrabal con la cara de quien lleva noches sin dormir. "La ventana se cierra. La orden de recuperación de Tomás tiene fecha: tres días. Hay que sacarlo de la ciudad antes, a él y a su cría." '
        + 'No pregunta si ayudas. Ya cuenta contigo, y esa confianza pesa más que cualquier petición.',
    opciones:[
      { texto:'"¿Cómo se saca a alguien que no existe?"', lleva:'A_a2_2' },
      { texto:'"¿Adónde irían?"', lleva:'A_a2_2' }
    ]
  },
  'A_a2_2': {
    img:'EXP_PUERTO_CARGA',
    texto:'"Arriba —dice—. A Selene, y de Kilómetro Cero a donde sea. Allá, entre millones de los que pasan, un hombre sin ficha es uno más; aquí es un agujero que HELIX quiere tapar." Te lleva a los muelles de carga, '
        + 'donde un estibador con cara de pocas pulgas mueve contenedores rumbo a las lanzaderas. "Él puede meter dos cuerpos en una bodega de carga. Por un precio, y si confía en quien se lo pide."',
    opciones:[
      { texto:'Hablar tú con el estibador.', efectos:{ aislamiento:-2 }, lleva:'A_a2_3' },
      { texto:'Dejar que hable Sela y cubrirle las espaldas.', lleva:'A_a2_3' }
    ]
  },
  'A_a2_3': {
    img:'EXP_PUERTO_CARGA',
    texto:'El estibador escucha sin dejar de masticar. "Bodega de carga rumbo a Selene, manifiesto en regla, sin censo de pasaje. Puedo. Pero necesito un documento de tránsito falso que aguante un escaneo de rutina, '
        + 'o me cuesta el puesto y la libertad. Conseguidme eso y hay trato." Mira a Sela, luego a ti. "Y que sea bueno. Los baratos cantan."',
    opciones:[
      { texto:'"Sé dónde conseguir uno bueno."', efectos:{ creditos:-40, item:'credencial_falsa', fatiga:+4 }, lleva:'A_a2_4' },
      { texto:'Prometer que lo conseguiréis y marcharos a por ello.', lleva:'A_a2_4' }
    ]
  },
  'A_a2_4': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'De vuelta al taller, el Tornero está pálido. "Alguien ha preguntado por Tomás en tres sitios donde solo sabíamos nosotros. Hay una boca suelta en la red, o algo peor." Mira el disco de datos como si pudiera traicionarle. '
        + '"O salimos esta noche, antes de que el soplo madure, o no salimos. Sela, prepara a tu hermano. Y tú —te señala— estate en el muelle al apagón de las dos."',
    opciones:[
      { texto:'"¿No es mejor esperar a estar seguros?"', lleva:'A_a2_5' },
      { texto:'"Allí estaré."', efectos:{ aislamiento:-2 }, lleva:'A_a2_5' }
    ]
  },
  'A_a2_5': {
    img:'EXP_PUERTO_CARGA',
    texto:'El plan queda cerrado en voz baja, a la luz de un flexo: a las dos, cuando HELIX corte la luz del sector para ahorrar, Tomás y su hija cruzan al muelle, suben a la bodega, y el estibador sella el contenedor. '
        + 'Tú vigilas la entrada. "Si ves uniformes —dice el Tornero—, no seas héroe. Silba. Para eso te queremos: por los ojos, no por los puños." Asientes. La noche se cierra sobre el Arrabal como una tapa.',
    opciones:[
      { texto:'Ir a tu puesto y esperar el apagón.', efectos:{ aislamiento:-3, marcaVisto:'A_act2' },
        resultado:'Te apostas en la boca del muelle, en la sombra, con el corazón en la garganta y los ojos abiertos a la calle vacía. El reloj del sector se acerca a las dos. En algún sitio, Sela arrastra a su hermano y a una niña dormida hacia la única salida que les queda: hacia arriba. Solo falta que la noche aguante.' }
    ]
  },

  // ---- COMBATE ÉPICO ---- (gated: visto A_act2) ------------
  'A_cmb': {
    entrada:true, cadena:'arcoA', cond:{ visto:'A_act2' },
    img:'EXP_PUERTO_CARGA',
    texto:'Las dos en punto. La luz del sector se apaga de golpe y, en la oscuridad, oyes lo que más temías: botas. No una patrulla de rutina: un equipo de recuperación de HELIX, coordinado, entrando en pinza hacia el muelle '
        + 'justo cuando Tomás cruza al descubierto con la niña en brazos. El soplo era real. Silbas la alarma, pero ya no hay tiempo de huir: si no los frenas aquí, no llegan a la bodega. Te plantas en el cuello de botella, entre ellos y la rampa.',
    opciones:[
      { texto:'Aguantar la entrada el tiempo que haga falta.',
        pelea:{
          texto:'Son disciplinados y van llegando por oleadas. No tienes que ganarles: tienes que costarles cada metro hasta que el contenedor se selle.',
          integridad:14,
          enemigos:[
            { nombre:'Operativo de recuperación', desc:'Frío, metódico', tipo:'normal', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Operativo de recuperación', desc:'Te flanquea', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoTurno:3,
          refuerzoTurnoGrupo:[
            { nombre:'Sargento de recuperación', desc:'Llega a cerrar la pinza', tipo:'lider', integridad:4, fuerza:5, umbral:6 },
            { nombre:'Operativo de recuperación', desc:'Cubre al sargento', tipo:'bruto', integridad:3, fuerza:4, umbral:4 }
          ],
          gana:'A_cmb_win', pierde:'A_cmb_lose'
        } },
      { texto:'Ganar tiempo con artimañas en vez de a golpes.', req:{ item:'granada_humo' }, pista:'necesitas un bote de humo',
        efectos:{ quitaItem:'granada_humo', fatiga:+6, marcaVisto:'A_cmb' },
        resultado:'Revientas el bote de humo en el cuello de botella y la noche se vuelve impenetrable. Los operativos avanzan a ciegas, gritándose posiciones, perdiendo los segundos exactos que necesitabas. Cuando el humo se disipa, el contenedor ya está sellado en la lanzadera y tú te has fundido con las sombras del muelle. Sin un golpe. A veces los ojos valen más que los puños, como decía el Tornero.', lleva:'A_cmb_win' }
    ]
  },
  'A_cmb_win': {
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'Cuando los últimos operativos te rebasan, ya es tarde para ellos: el contenedor con Tomás y su hija sube por el elevador de carga hacia la lanzadera, fuera de su alcance, rumbo a una bodega anónima con destino Selene. '
        + 'El sargento te mira desde abajo, sabiendo lo que has hecho y sabiendo que no puede probarlo. "Solo era carga", le dices, jadeando. Él anota algo en su tablilla. Para HELIX, todo acaba siendo una anotación.',
    opciones:[
      { texto:'Desaparecer en el muelle antes de que reaccione.', efectos:{ fatiga:+8, marcaVisto:'A_cmb' },
        resultado:'Te escurres entre los contenedores mientras el equipo se reagrupa para un objetivo que ya va camino del cielo. Te duele todo. Pero ahí arriba, en una bodega a oscuras, un hombre que oficialmente no existe abraza a su hija y respira por primera vez en semanas. Lo demás es papeleo de HELIX, y el papeleo, esta noche, ha perdido.' }
    ]
  },
  'A_cmb_lose': {
    img:'EXP_PUERTO_CARGA',
    texto:'Aguantas más de lo que tu cuerpo da. Cuando un culatazo te dobla y el suelo del muelle sube a recibirte, lo último que oyes no son botas: es el chasquido metálico de un contenedor sellándose y el zumbido de un elevador subiendo. '
        + 'Te despiertas horas después, dolorido, esposado a una tubería de la que alguien te suelta luego "por falta de cargos". No hay cargos porque, oficialmente, esta noche no pasó nada. Y la lanzadera de las dos despegó con su carga.',
    opciones:[
      { texto:'Levantarte y volver al Arrabal.', efectos:{ herida:12, condicion:'costillas', condicionProb:0.6, fatiga:+6, marcaVisto:'A_cmb' },
        resultado:'Te levantas a pedazos y caminas de vuelta con una mano en el costado. Perdiste la pelea. Pero los segundos que les costaste bastaron: el contenedor subió. Pagaste con el cuerpo lo que no pudiste pagar con maña, y en el Arrabal eso se sabe y se recuerda. Cojeas hacia casa con la cuenta saldada y rota a la vez.' }
    ]
  },

  // ---- ACTO 3 ---- (gated: visto A_cmb) --------------------
  'A_a3_1': {
    entrada:true, cadena:'arcoA', cond:{ visto:'A_cmb' },
    img:'EXP_MERCADO_OLVIDADOS',
    texto:'Días después, el Arrabal está más callado. Hay más patrullas, más drones, más silencio. Los carteles de "borrado del registro" han desaparecido de las paredes, raspados con prisa. Nadie habla de Tomás. '
        + 'Es como si toda una operación hubiera ocurrido y no hubiera dejado más huella que un barrio aguantando la respiración.',
    opciones:[
      { texto:'Buscar a Sela.', lleva:'A_a3_2' },
      { texto:'Pasar por el taller del Tornero.', lleva:'A_a3_2' }
    ]
  },
  'A_a3_2': {
    img:'EXP_TALLER_REUTILIZA',
    texto:'El taller del relojero tiene la persiana bajada. En la rendija, un sobre sin nombre, doblado, que parece esperarte. Dentro, la letra apretada del Tornero: "Si lees esto, es que vuelves a buscarnos, y eso dice de ti más que mil palabras. '
        + 'No estamos. No conviene estar un tiempo. Sela me dijo que te lo entregara: lo de dentro es tuyo. Te lo ganaste."',
    opciones:[
      { texto:'Abrir lo que el sobre guarda.', lleva:'A_a3_3' }
    ]
  },
  'A_a3_3': {
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'Dentro hay una sola cosa: una cápsula de mensaje, de las del correo orbital, ya escuchada, con una etiqueta de origen: SELENE TERMINAL · KILÓMETRO CERO. Y una nota de Sela: "Llegaron. La niña no para de hablar de las cúpulas. '
        + 'Tomás dice que arriba, entre tanto extraño, por fin nadie le mira como a un agujero. Gracias por los ojos que pusiste aquella noche. No volveremos. Es mejor así."',
    opciones:[
      { texto:'Escuchar la cápsula.', efectos:{ disociacion:+2 }, lleva:'A_a3_4' },
      { texto:'Guardarla sin escucharla. Es suya, no tuya.', efectos:{ aislamiento:+2 }, lleva:'A_a3_4' }
    ]
  },
  'A_a3_4': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'En la pared donde Sela pegó aquel primer cartel, alguien ha dejado, casi invisible, una marca pequeña a navaja: un yunque y tres estrellas. La firma de los que siguen. No es una llamada a las armas. '
        + 'Es un recordatorio de que existieron, de que existen, de que un hombre subió al cielo una noche en lugar de desaparecer en un sótano. En las Pilas, eso es casi una victoria. Casi.',
    opciones:[
      { texto:'Pasar la mano por la marca y seguir.', lleva:'A_a3_5' }
    ]
  },
  'A_a3_5': {
    img:'EXP_MERCADO_OLVIDADOS',
    texto:'No te quedó dinero de todo esto. No te quedó fama, ni placa, ni una facción que te deba un favor por escrito. Te quedó una cápsula que no es tuya, una marca en una pared y la certeza de que, por una vez, '
        + 'fuiste el grano de arena que atascó la máquina el tiempo justo. La máquina sigue girando. Pero esta noche, en alguna cúpula de Selene, una niña habla sin miedo. Y tú sabes por qué.',
    opciones:[
      { texto:'Guardarte la cápsula y volver a tu vida.', efectos:{ aislamiento:-6, faccion:'sindicatos', rep:+3, marcaVisto:'A_done' },
        resultado:'Te guardas la cápsula de Selene junto a las pocas cosas que cargas de un sitio a otro. No la escucharás a menudo. Pero saber que está ahí, que llegaron, que el Yunque no se apagó del todo... eso pesa en el bolsillo más que cualquier crédito. Vuelves a tu vida de siempre. Solo que ya no eres exactamente el mismo que pegaba la vista en un cartel sin atreverse a preguntar.' }
    ]
  },

  // ████████████████████████████████████████████████████████
  //  ARCO B — "LA DEUDA DE SANGRE"
  // ████████████████████████████████████████████████████████

  'B_b1_1': {
    entrada:true, cadena:'arcoB',
    img:'EXP_CIBERCAFE',
    texto:'Ante una ventanilla de "préstamos al instante", una mujer suplica en voz baja a un hombre impecable que ni la mira: teclea, consulta, niega. "El interés corrió mientras su marido agonizaba, señora. La normativa no contempla el luto." '
        + 'Lo dice un tal Vesco, al que llaman el Contable. Cuando la mujer se va rota, él levanta la vista hacia ti, que mirabas. "¿Necesita capital? Tasas competitivas." Su sonrisa es la cosa más fría de la calle.',
    opciones:[
      { texto:'Salir tras la mujer.', lleva:'B_b1_2' },
      { texto:'"No, gracias", y largarte.', efectos:{ aislamiento:+2 },
        resultado:'"Volverá —dice el Contable, sin perder la sonrisa—. Todos vuelven. La necesidad es mi mejor comercial." Te alejas de la ventanilla con un escalofrío que no es de la lluvia. Hay depredadores que no necesitan dientes: les basta un teclado y una normativa.' }
    ]
  },
  'B_b1_2': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'La alcanzas bajo un alero. Se llama Doria. La deuda era de su marido, muerto en un accidente de los muelles "no homologado", o sea, sin indemnización. "Pedí poco, para el entierro —dice—. Ahora debo el triple, y sube cada día. '
        + 'Y como aval... puse el contrato de trabajo de mi hijo." Le tiembla la voz. "Si no pago, el Contable se queda con los años de mi crío. Legalmente. Con sello."',
    opciones:[
      { texto:'"¿Puedo ayudar en algo?"', efectos:{ aislamiento:-2 }, lleva:'B_b1_3' },
      { texto:'"¿Y no hay forma de pelear ese contrato?"', lleva:'B_b1_3' }
    ]
  },
  'B_b1_3': {
    img:'EXP_CIBERCAFE',
    texto:'Doria te pide algo pequeño: llevar su pago semanal a la oficina del Contable, porque a ella "le tiembla todo cuando lo ve y se equivoca, y un error en el pago le cuesta una semana más de interés". '
        + 'La oficina es una trastienda de archivadores hasta el techo, cada uno una vida hipotecada. El Contable cuenta tu entrega dos veces, sonríe, y anota. Todo aquí se anota. El horror no grita: archiva.',
    opciones:[
      { texto:'Fijarte en cómo lleva las cuentas.', lleva:'B_b1_4' },
      { texto:'Entregar y salir rápido.', efectos:{ aislamiento:+1 }, lleva:'B_b1_4' }
    ]
  },
  'B_b1_4': {
    img:'EXP_CIBERCAFE',
    texto:'Al contar, el Contable suelta una frase sin querer, o queriendo: "Curioso. La señora Doria paga puntual y aun así su saldo sube. La matemática del interés compuesto es bella, ¿no cree? Cuanto más pagas, más debes, '
        + 'si el principal nunca se toca." Te enseña una pantalla con números danzando. Y entiendes la trampa: está diseñada para no terminar nunca. No es un préstamo. Es una correa con cuentagotas.',
    opciones:[
      { texto:'"Eso no puede ser legal."', lleva:'B_b1_5' },
      { texto:'Disimular y guardarte lo que has visto.', efectos:{ disociacion:+2 }, lleva:'B_b1_5' }
    ]
  },
  'B_b1_5': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'"Legal es lo que HELIX no persigue —dice él—. Y a mí no me persigue: le ahorro asistencia social." Pero al guardar la pantalla, algo te llama la atención: un recibo antiguo, traspapelado, '
        + 'de un pago grande que Doria hizo hace meses y que NO figura en el saldo. El Contable "perdió" ese abono. Si recuperaras ese recibo, probarías que la deuda está inflada con un pago borrado.',
    opciones:[
      { texto:'Distraerle y llevarte el recibo.', efectos:{ fatiga:+4, item:'papel_codigo', aislamiento:-2 }, lleva:'B_b1_6' },
      { texto:'Memorizar el número del recibo y salir limpio.', efectos:{ disociacion:+2 }, lleva:'B_b1_6' }
    ]
  },
  'B_b1_6': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'Al salir, un hombre grande te corta el paso con una sonrisa cansada. Un cobrador del Contable. "Te he visto mucho por aquí. Sería una pena que alguien le metiera ideas raras a la señora. '
        + 'Las ideas raras, en este barrio, salen caras." No te toca. No hace falta. La amenaza ya está hecha, archivada, con sello.',
    opciones:[
      { texto:'Sostenerle la mirada y seguir.', efectos:{ fatiga:+3, aislamiento:-1 }, lleva:'B_b1_7' },
      { texto:'Bajar la vista y pasar. Aún no es el momento.', efectos:{ aislamiento:+2 }, lleva:'B_b1_7' }
    ]
  },
  'B_b1_7': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'Le llevas a Doria lo que has averiguado: hay un pago borrado, hay una trampa demostrable. Por primera vez la ves enderezar la espalda. "Entonces no estoy loca. No es que yo no sepa contar. Es que él hace trampas." '
        + 'Aprieta el recibo como quien agarra un cabo en mitad del mar. "No sé qué se puede hacer con esto. Pero saber que existe ya me deja respirar."',
    opciones:[
      { texto:'"Vamos a usarlo. No estás sola en esto."', efectos:{ aislamiento:-5, marcaVisto:'B_act1' },
        resultado:'"No estás sola", le dices, y te das cuenta de que hace mucho que no le decías eso a nadie. Doria asiente, agarrada al recibo y a la frase. No tienes un plan todavía; tienes algo mejor para empezar: una prueba, y una persona que ha dejado de creer que el problema era ella.' },
      { texto:'"Guárdalo bien. Pensaré algo."', efectos:{ aislamiento:-2, marcaVisto:'B_act1' },
        resultado:'Le dejas el cabo en las manos y te marchas a pensar. Doria esconde la prueba entre las cosas de su hijo. Te vas con el peso de una promesa a medias y la certeza de que, una vez que tiras de un hilo así, ya no puedes soltarlo sin que se note.' }
    ]
  },

  'B_b2_1': {
    entrada:true, cadena:'arcoB', cond:{ visto:'B_act1' },
    img:'EXP_CIBERCAFE',
    texto:'Vuelves a cruzarte con Doria, blanca como el papel. "Ha adelantado la fecha. Dice que tiene una oferta mejor por el contrato de mi hijo: una empresa de los muelles que necesita manos jóvenes y baratas, sin preguntas. '
        + 'Si no saldo todo en cuatro días, ejecuta el aval." Cuatro días para deshacer una trampa diseñada para durar una vida.',
    opciones:[
      { texto:'"El recibo borrado es nuestra palanca. Usémoslo."', lleva:'B_b2_2' },
      { texto:'"¿Cuánto falta para saldarlo de golpe?"', lleva:'B_b2_2' }
    ]
  },
  'B_b2_2': {
    img:'EXP_CIBERCAFE',
    texto:'Saldarlo de golpe es imposible: la cifra es absurda, diseñada para serlo. Pero el recibo borrado abre otra vía. "Si alguien entra en su sistema de cuentas y restaura ese pago, junto con los intereses que cobró de más, '
        + 'la deuda se da la vuelta. Y si guardamos copia, no podrá volver a borrarlo." Necesitas a alguien que sepa tocar registros. En las Pilas, eso tiene nombre y precio.',
    opciones:[
      { texto:'Buscar a un manipulador de registros.', efectos:{ creditos:-50, fatiga:+4 }, lleva:'B_b2_3' },
      { texto:'Intentar que otro deudor testifique.', lleva:'B_b2_3' }
    ]
  },
  'B_b2_3': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'Consigues lo que buscabas: una copia limpia del libro real de cuentas del Contable, con el pago borrado de Doria y, de regalo, el mismo truco repetido en decenas de fichas más. No es solo la trampa de una mujer: '
        + 'es un patrón, un sistema, un fraude con cientos de nombres. Tienes en la mano algo que pesa mucho más que la deuda de Doria. Tienes la correa entera.',
    opciones:[
      { texto:'Centrarte solo en liberar a Doria.', efectos:{ aislamiento:-2 }, lleva:'B_b2_4' },
      { texto:'Pensar en todos los demás nombres de la lista.', efectos:{ disociacion:+2 }, lleva:'B_b2_4' }
    ]
  },
  'B_b2_4': {
    img:'EXP_CIBERCAFE',
    texto:'El Contable no es tonto. Te hace llamar, te sienta con un café que no pides, y va al grano sin perder la sonrisa: "Sé lo que tiene. Le propongo un negocio: me devuelve la copia, yo perdono la deuda de la señora Doria, '
        + 'y a usted le abro una línea de crédito generosa. Los demás nombres de esa lista... no son su problema. Nunca lo fueron."',
    opciones:[
      { texto:'Rechazar. "Doria y todos los demás, o nada."', efectos:{ aislamiento:-4, faccion:'helix', rep:-2 }, lleva:'B_b2_5' },
      { texto:'Fingir que aceptas para ganar tiempo.', efectos:{ disociacion:+4 }, lleva:'B_b2_5' }
    ]
  },
  'B_b2_5': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'Sales sabiendo dos cosas: que tienes con qué hundir al Contable, y que ya no te va a dejar caminar tranquilo. La copia hay que hacerla pública —colgarla donde el barrio entero la vea— antes de que sus cobradores te la quiten del cuerpo. '
        + 'Quedas con Doria en el viejo tablón de la plaza, al anochecer. Sabes que no vas a llegar solo hasta allí.',
    opciones:[
      { texto:'Ir hacia la plaza con la copia.', efectos:{ aislamiento:-2, marcaVisto:'B_act2' },
        resultado:'Te echas la copia al pecho y enfilas hacia la plaza por las calles más concurridas, donde es más difícil que te arrinconen sin testigos. Cada esquina pesa. En algún punto entre aquí y el tablón, el Contable va a intentar recuperar su correa. Aprietas el paso.' }
    ]
  },

  'B_cmb': {
    entrada:true, cadena:'arcoB', cond:{ visto:'B_act2' },
    img:'EXP_CALLEJON_NIVELES',
    texto:'A dos calles de la plaza, te lo encuentran. No uno: toda la cuadrilla de cobradores del Contable, cerrándote el callejón por los dos lados, tranquilos, profesionales. "El jefe quiere su copia. Y tú vas a entender que las deudas, '
        + 'en este barrio, siempre se cobran." No puedes correr con la copia encima. Solo puedes abrirte paso a la plaza, donde la gente —y los ojos— lo cambian todo.',
    opciones:[
      { texto:'Abrirte paso a golpes hasta la plaza.',
        pelea:{
          texto:'Son muchos y saben lo que hacen, pero tú solo necesitas cruzar, no vencer. Cada cobrador que cae es un metro más cerca del tablón y de los testigos.',
          integridad:14,
          enemigos:[
            { nombre:'Cobrador veterano', desc:'Pega para que duela y no marque', tipo:'bruto', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Cobrador joven', desc:'Rápido, con ganas de demostrar', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoTurno:3,
          refuerzoTurnoGrupo:[
            { nombre:'Capataz de cobros', desc:'El que dirige; mientras aguante, aprietan', tipo:'lider', integridad:4, fuerza:5, umbral:6 },
            { nombre:'Cobrador', desc:'Cierra la retirada', tipo:'normal', integridad:3, fuerza:3, umbral:4 }
          ],
          gana:'B_cmb_win', pierde:'B_cmb_lose'
        } },
      { texto:'Lanzarles el dinero sucio y colarte en la confusión.', req:{ item:'creditos_sucios' }, pista:'necesitas créditos sucios',
        efectos:{ quitaItem:'creditos_sucios', fatiga:+5, marcaVisto:'B_cmb' },
        resultado:'Revientas el fajo de créditos sucios por los aires y, por un instante, hasta los profesionales son personas con hambre: dudan, miran el dinero, pierden el medio segundo que necesitabas. Te cuelas entre ellos y llegas a la plaza con la copia intacta. A veces la codicia ajena es la mejor llave.', lleva:'B_cmb_win' }
    ]
  },
  'B_cmb_win': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'Irrumpes en la plaza magullado pero entero, y haces lo único que el Contable no puede deshacer: vuelcas la copia en el tablón público y en cada pantalla comunitaria que alcanzas. Cientos de nombres, el fraude entero, '
        + 'a la vista del barrio. Los cobradores frenan en el borde de la plaza: pegarte ahora, ante todos, ante los ojos de HELIX, ya no les conviene. La correa, una vez vista por todos, deja de apretar.',
    opciones:[
      { texto:'Buscar a Doria entre la gente.', efectos:{ aislamiento:-4, marcaVisto:'B_cmb' },
        resultado:'Encuentras a Doria entre los que se agolpan a leer. No llora; está más allá de eso. Solo te agarra del brazo magullado, fuerte, y mira el tablón donde por fin el número rojo de su vida tiene una explicación que no es culpa suya. "Lo has hecho público", susurra. Lo público, en las Pilas, es lo único que HELIX no puede archivar en silencio.' }
    ]
  },
  'B_cmb_lose': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'No llegas. Te derriban a media calle y, entre el dolor, sientes cómo unas manos te registran y te arrancan la copia del pecho. Cuando el mundo deja de dar vueltas, estás solo en el callejón, sin la prueba. '
        + 'Pero al palparte el forro roto encuentras lo que ellos no sabían: hiciste una segunda copia. Maltrecho, te arrastras hacia la plaza. La correa todavía se puede cortar. Solo que más cara.',
    opciones:[
      { texto:'Arrastrarte hasta el tablón con la copia oculta.', efectos:{ herida:12, condicion:'costillas', condicionProb:0.6, fatiga:+6, marcaVisto:'B_cmb' },
        resultado:'Llegas a la plaza a rastras y cuelgas la segunda copia con dedos que apenas responden. La gente se arremolina; alguien te ayuda a levantarte. Perdiste la pelea y casi la copia, pero no la guerra: el fraude está a la vista de todos, y eso ya no se borra. Doria llega corriendo, y por su cara sabes que valió la pena.' }
    ]
  },

  'B_b3_1': {
    entrada:true, cadena:'arcoB', cond:{ visto:'B_cmb' },
    img:'EXP_CIBERCAFE',
    texto:'La ventanilla de "préstamos al instante" amaneció cerrada con un precinto. No de HELIX: de la propia empresa del Contable, que lo ha "reasignado a otra delegación" antes de que el escándalo subiera más arriba. '
        + 'Los depredadores así no caen: se reubican. Pero su trastienda de archivadores está vacía, y eso, por un tiempo, es alivio para mucha gente.',
    opciones:[
      { texto:'Buscar a Doria.', lleva:'B_b3_2' },
      { texto:'Mirar la ventanilla precintada un momento.', efectos:{ disociacion:+2 }, lleva:'B_b3_2' }
    ]
  },
  'B_b3_2': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'Doria te recibe con su hijo al lado, un chaval flaco y serio que te mira sin saber del todo lo que le has evitado. "El contrato de aval quedó anulado con el fraude. Mi crío sigue siendo mío. Sigue siendo libre." '
        + 'Lo dice como si pronunciara una palabra extranjera. Libre. En las Pilas, esa palabra cuesta tanto que casi nadie la usa para los suyos.',
    opciones:[
      { texto:'Saludar al chico.', efectos:{ aislamiento:-3 }, lleva:'B_b3_3' },
      { texto:'Preguntar cómo van a salir adelante ahora.', lleva:'B_b3_3' }
    ]
  },
  'B_b3_3': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'No todo es victoria. Sin la deuda, pero también sin el "trabajo" que el aval garantizaba, Doria y su hijo siguen siendo pobres en un sitio que castiga la pobreza. "No nos has hecho ricos —dice ella, leyéndote la cara—. '
        + 'Nos has devuelto el derecho a serlo a nuestra manera, sin una correa al cuello. Es más de lo que nadie nos había dado." Te ofrece un té que sabe a poco y a mucho.',
    opciones:[
      { texto:'Aceptar el té y quedarte un rato.', efectos:{ aislamiento:-4, fatiga:-2 }, lleva:'B_b3_4' },
      { texto:'Aceptar y despedirte pronto.', efectos:{ aislamiento:-2 }, lleva:'B_b3_4' }
    ]
  },
  'B_b3_4': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'En el tablón de la plaza, sobre el hueco donde estuvo la copia que colgaste, alguien ha dejado pegada una nota anónima con muchas letras distintas, como firmada por varias manos: "Gracias. Éramos muchos en esa lista. '
        + 'Hoy dormimos sin el número subiendo." No la firma nadie y la firman todos. El Contable archivaba personas. Tú las desarchivaste, aunque sea por un tiempo.',
    opciones:[
      { texto:'Leerla dos veces y seguir.', lleva:'B_b3_5' }
    ]
  },
  'B_b3_5': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'Sabes que volverán las ventanillas, otros contables, otras correas con cuentagotas. El sistema que los cría sigue intacto. Pero también sabes que durante un tiempo, en este barrio, las cuentas de mucha gente '
        + 'dejaron de subir solas en la oscuridad. No arreglaste el mundo. Le metiste un palo en la rueda, y oíste cómo, por una vez, la máquina chirriaba a tu favor.',
    opciones:[
      { texto:'Volver a tu vida, con eso aprendido.', efectos:{ aislamiento:-5, marcaVisto:'B_done' },
        resultado:'Sigues con lo tuyo. No cobraste apenas; gastaste más de lo que sacaste. Pero ahora, cuando pases por delante de una ventanilla de "préstamos al instante" con su sonrisa fría, sabrás leer la trampa detrás de los números, y sabrás que se puede pelear. Es un saber incómodo. De los que no se devuelven.' }
    ]
  },

  // ████████████████████████████████████████████████████████
  //  ARCO C — "EL CENSO DE LOS QUE NO ESTÁN"
  //  Los desahuciados que "dejan de figurar" no se esfuman:
  //  entran en una tubería burocrática. El jugador tira del hilo.
  //  Horror administrativo, sin gore gratuito. Nada de Centauri.
  // ████████████████████████████████████████████████████████

  'C_c1_1': {
    entrada:true, cadena:'arcoC',
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'En una pared de la plaza, una lista crece a mano: nombres, fechas, "reasignados y no vueltos". Un hombre mayor añade uno nuevo con un rotulador que apenas pinta. "Mi vecina del 4º —dice sin que preguntes—. '
        + 'Le llegó una carta de reubicación laboral. Subió a un autobús de HELIX. Eso fue hace un mes. Nadie la ha vuelto a ver, y en el registro consta como ‘trasladada’. Trasladada ¿adónde?"',
    opciones:[
      { texto:'"¿Y nadie pregunta adónde van?"', lleva:'C_c1_2' },
      { texto:'"Eso pasa. La gente se muda."', efectos:{ aislamiento:+2 },
        resultado:'"La gente se muda y manda razón —dice el viejo, sin enfadarse—. Estos no mandan nada. Salen llenos los autobuses y vuelven vacíos." Vuelve a su lista de nombres que no vuelven. Te alejas, pero la frase de los autobuses se te queda enganchada como una astilla.' }
    ]
  },
  'C_c1_2': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'El viejo se llama Olm. Te enseña la carta que recibió su vecina antes de irse: papel oficial de HELIX, sello impecable. "REUBICACIÓN LABORAL ASISTIDA. Su perfil ha sido seleccionado para una oportunidad de empleo en un centro asociado. '
        + 'La no comparecencia conllevará la pérdida de prestaciones." No es una oferta. Es una citación con sonrisa. "Quiero saber dónde está —dice Olm—. Solo eso. Si está mal, al menos saberlo."',
    opciones:[
      { texto:'Coger la carta y mirar la dirección.', efectos:{ aislamiento:-2 }, lleva:'C_c1_3' },
      { texto:'"¿Por qué confías esto a un desconocido?"', lleva:'C_c1_3' }
    ]
  },
  'C_c1_3': {
    img:'EXP_ALMACEN_HELIX',
    texto:'La dirección de la carta es un "Centro de Reasignación" de HELIX: un edificio bajo, sin ventanas, con una cola de gente apática esperando bajo un toldo. Dentro, todo es mostrador, número y formulario. '
        + 'Huele a desinfectante y a papel. La gente entra con una citación y sale por otra puerta hacia un patio trasero, donde esperan autobuses sin distintivo. Nadie sale por donde entró.',
    opciones:[
      { texto:'Ponerte en la cola para ver el proceso.', efectos:{ fatiga:+3 }, lleva:'C_c1_4' },
      { texto:'Rodear hacia el patio de los autobuses.', efectos:{ aislamiento:+1 }, lleva:'C_c1_4' }
    ]
  },
  'C_c1_4': {
    img:'EXP_ALMACEN_HELIX',
    texto:'Observas el ciclo: llegan personas con citación, un funcionario las escanea, las clasifica en "apto" o "no apto" con un golpe de sello, y las encamina a autobuses distintos. Los "aptos" a uno. Los "no aptos"... a otro. '
        + 'Los autobuses salen llenos hacia el este y, horas después, los ves volver vacíos, lavados a presión. Un funcionario joven teclea manifiestos sin levantar la vista. Esos papeles saben adónde van todos.',
    opciones:[
      { texto:'Conseguir una copia de un manifiesto.', lleva:'C_c1_5' }
    ]
  },
  'C_c1_5': {
    img:'EXP_ALMACEN_HELIX',
    texto:'Aprovechas un cambio de turno y un descuido para hacerte con una hoja de manifiesto que el funcionario deja en la bandeja de salida. Dos destinos repetidos: "Complejo Agroindustrial Este" para los aptos, '
        + 'y "Centro de Recuperación de Materiales Biológicos" para los no aptos. El primero suena a trabajo forzado. El segundo no suena a nada bueno en absoluto. Te guardas el papel con el pulso acelerado.',
    opciones:[
      { texto:'Salir antes de que noten la falta.', efectos:{ item:'papel_helix', fatiga:+4, alerta:4 }, lleva:'C_c1_6' }
    ]
  },
  'C_c1_6': {
    img:'EXP_ALMACEN_HELIX',
    texto:'En la puerta, un hombre de uniforme gris y mirada de inventario te corta el paso. Un oficial de recuperación. "¿Citación?", pregunta, sabiendo que no la tienes. Te repasa de arriba abajo, evaluando si eres apto, no apto, '
        + 'o un problema. "Aquí no se viene a mirar. Aquí se viene cuando a uno lo llaman. ¿Le han llamado?" Su calma es la cosa más amenazante del edificio.',
    opciones:[
      { texto:'"Me equivoqué de puerta", y salir sin correr.', efectos:{ fatiga:+3, disociacion:+2 }, lleva:'C_c1_7' },
      { texto:'Mantener el tipo y soltar una excusa con aplomo.', efectos:{ aislamiento:-1 }, lleva:'C_c1_7' }
    ]
  },
  'C_c1_7': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'Le llevas a Olm el manifiesto. Cuando lee "Centro de Recuperación de Materiales Biológicos", la mano le empieza a temblar. "Mi vecina tenía las dos caderas hechas polvo. No era ‘apta’ para ningún campo." No termina la idea. '
        + 'No hace falta. Os quedáis los dos en silencio ante una lista de nombres que ahora tiene un destino, y el destino es peor que no saberlo.',
    opciones:[
      { texto:'"Voy a averiguar qué pasa en ese sitio."', efectos:{ aislamiento:-4, marcaVisto:'C_act1' },
        resultado:'Olm te mira como quien no se atreve a agradecer por miedo a gafarlo. "Ten cuidado —dice solo—. La gente que pregunta por ese sitio también acaba en una lista." Te guardas el manifiesto. Has dejado de mirar la lista de la pared como un transeúnte: ahora es un mapa, y tú estás dentro de él.' },
      { texto:'"Esto le supera a cualquiera. Pero lo intentaré."', efectos:{ aislamiento:-2, marcaVisto:'C_act1' },
        resultado:'"Cualquiera, sí —dice Olm—. Pero alguien tiene que." Dobla el manifiesto y se lo guarda en el pecho como una reliquia terrible. Te marchas con el nombre de un sitio metido en la cabeza y la sensación de haber abierto una puerta que no se cierra sola.' }
    ]
  },

  'C_c2_1': {
    entrada:true, cadena:'arcoC', cond:{ visto:'C_act1' },
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'Olm ha añadido dos nombres más a la pared esta semana. "Cada vez que cierran un bloque, la lista crece —dice—. Y la ciudad va por barrios: ahora les toca a los del sector siete." Te mira con una urgencia nueva. '
        + '"Si vas a mirar ese centro de recuperación, ve pronto. Antes de que el sector siete llene otro autobús."',
    opciones:[
      { texto:'"¿Sabes cómo llegar hasta allí?"', lleva:'C_c2_2' },
      { texto:'Asentir y ponerte en marcha.', lleva:'C_c2_2' }
    ]
  },
  'C_c2_2': {
    img:'EXP_PUERTO_CARGA',
    texto:'Sigues a uno de los autobuses vacíos en su ruta de vuelta y das con el sitio: un depósito de recuperación en el filo industrial del distrito, vallado, con incineradoras que humean a horas raras. '
        + 'Camiones frigoríficos entran y salen con el logo de una filial médica de HELIX. Lo que llega aquí en autobús, sale en camión refrigerado. Te cuesta respirar, y no es por el humo.',
    opciones:[
      { texto:'Colarte a ver qué hay dentro.', efectos:{ fatiga:+5, alerta:3 }, lleva:'C_c2_3' },
      { texto:'Vigilar el ciclo de camiones primero.', efectos:{ disociacion:+2 }, lleva:'C_c2_3' }
    ]
  },
  'C_c2_3': {
    img:'EXP_ALMACEN_HELIX',
    texto:'Dentro, todo es orden y frío. Una sala de cámaras refrigeradas, estanterías metálicas, recipientes etiquetados con códigos de barras y un campo de formulario: "origen", "tipo", "compatibilidad". No hay sangre, no hay gritos. '
        + 'Hay un inventario. Cada etiqueta lleva un número de residente que un día fue una persona a la que clasificaron como "no apta". El horror aquí no grita: viene rotulado, refrigerado y con albarán.',
    opciones:[
      { texto:'Documentar lo que ves para probarlo.', efectos:{ disociacion:+5 }, lleva:'C_c2_4' }
    ]
  },
  'C_c2_4': {
    img:'EXP_ALMACEN_HELIX',
    texto:'Mientras capturas las etiquetas y un albarán de salida, un operario con bata te ve. No da la alarma. Se queda quieto, con los ojos vacíos de quien lleva demasiado tiempo aquí. "Yo solo etiqueto —murmura, como una disculpa gastada—. '
        + 'Nos dijeron que eran donantes voluntarios." Ni él se lo cree. Mira hacia otro lado, a propósito, el tiempo justo para que cojas lo que necesitas y desaparezcas.',
    opciones:[
      { texto:'Coger la prueba y salir rápido.', efectos:{ item:'chip_datos_corrupto', fatiga:+4, alerta:5 }, lleva:'C_c2_5' },
      { texto:'Preguntarle al operario si esto se puede parar.', efectos:{ disociacion:+3 }, lleva:'C_c2_5' }
    ]
  },
  'C_c2_5': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'Sales con la prueba ardiéndote en el bolsillo: lo que HELIX hace con los que clasifica como prescindibles, documentado, con sus propios códigos. Esto no se puede tapar con una redada ni con una multa. '
        + 'Hay que sacarlo del distrito, ponerlo donde lo vean los que aún pueden hacer ruido: filtradores, el Eco, las redes del barrio. Pero un sitio así no deja salir caminando a quien le ha mirado las estanterías.',
    opciones:[
      { texto:'Salir del filo industrial con la prueba.', efectos:{ aislamiento:-2, marcaVisto:'C_act2' },
        resultado:'Enfilas de vuelta hacia las luces del distrito, hacia la gente, hacia los testigos. La prueba pesa como si cargaras a cada uno de los números de esas etiquetas. Detrás de ti, el depósito sigue humeando, ordenado, eficiente. Sabes que no vas a llegar sin que intenten recuperarte a ti también.' }
    ]
  },

  'C_cmb': {
    entrada:true, cadena:'arcoC', cond:{ visto:'C_act2' },
    img:'EXP_CALLEJON_NIVELES',
    texto:'Los faros te encuentran antes que tú a ellos: una furgoneta de recuperación cierra la calle, y de ella baja el oficial de la mirada de inventario con dos operativos. "Ha entrado donde no debía y se ha llevado lo que no es suyo —dice, '
        + 'tan tranquilo como si rellenara un parte—. Va a devolverlo. Y luego, me temo, su perfil también requiere reasignación." No es rabia. Es procedimiento. Y el procedimiento, esta noche, eres tú.',
    opciones:[
      { texto:'Defenderte y abrirte paso hacia el distrito.',
        pelea:{
          texto:'No son matones de barrio: son funcionarios con porra y método. No tienes que vencerlos a todos, solo llegar a donde haya gente y luces.',
          integridad:15,
          enemigos:[
            { nombre:'Operativo de recuperación', desc:'Eficiente, sin prisa', tipo:'normal', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Operativo de recuperación', desc:'Te quiere inmovilizar', tipo:'bruto', integridad:3, fuerza:4, umbral:5 }
          ],
          refuerzoTurno:3,
          refuerzoTurnoGrupo:[
            { nombre:'Oficial de inventario', desc:'Dirige la recuperación; mientras esté en pie, no cesan', tipo:'lider', integridad:5, fuerza:5, umbral:6 },
            { nombre:'Operativo de recuperación', desc:'Refuerzo de cierre', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
          ],
          gana:'C_cmb_win', pierde:'C_cmb_lose'
        } },
      { texto:'Soltar humo y desaparecer en el filo industrial.', req:{ item:'granada_humo' }, pista:'necesitas un bote de humo',
        efectos:{ quitaItem:'granada_humo', fatiga:+6, marcaVisto:'C_cmb' },
        resultado:'El bote de humo convierte la calle en una nube blanca. Los operativos, metódicos hasta para perseguir, se mueven por protocolo, y el protocolo es lento. Tú no: conoces ya estos callejones del filo industrial. Cuando el humo se aclara, eres una citación sin comparecer, y la prueba sigue contigo, camino del distrito.', lleva:'C_cmb_win' }
    ]
  },
  'C_cmb_win': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'Llegas a las luces del distrito magullado pero con la prueba intacta, y la sueltas donde no se puede recoger: en las redes del barrio, en los muros del Eco, en cada pantalla comunitaria. Las etiquetas, los códigos, los albaranes. '
        + 'El oficial de inventario se queda en el límite de la zona iluminada: aquí, ante tantos ojos, recuperarte ya no es procedimiento, es escándalo. Da media vuelta. Por una vez, la máquina parpadea.',
    opciones:[
      { texto:'Buscar a Olm.', efectos:{ aislamiento:-4, marcaVisto:'C_cmb' },
        resultado:'Encuentras a Olm ante la pared de los nombres, viendo cómo la gente se agolpa a leer lo que has destapado. No celebra. Mira la lista de su vecina y de tantos otros, ahora con un porqué espantoso al lado. "Lo sabíamos —murmura—. Pero saberlo a solas no es nada. Saberlo todos... eso ya pesa." Te aprieta el hombro, viejo y firme.' }
    ]
  },
  'C_cmb_lose': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'Te doblan a culatazos y, mientras el frío del suelo te sube por la espalda, oyes al oficial dictar tu número como quien cierra un albarán. Pero no contaban con una cosa: antes de salir del depósito mandaste la prueba en bruto '
        + 'a un contacto del Eco. Despiertas en una cuneta del filo industrial, sin la copia y molido, "liberado por no constar cargos". Y al llegar al distrito, lo ves en los muros: alguien ya lo ha colgado todo. Llegaste, aunque rota.',
    opciones:[
      { texto:'Arrastrarte de vuelta al distrito.', efectos:{ herida:13, condicion:'conmocion', condicionProb:0.6, fatiga:+6, marcaVisto:'C_cmb' },
        resultado:'Caminas de vuelta a pedazos, pero los muros del barrio ya hablan por ti: las etiquetas, los códigos, lo que HELIX hace con los que sobran. Perdiste el cuerpo a cambio de que la verdad llegara antes que tú. En las Pilas, a veces solo se gana así: pagándolo con los huesos y dejando que otros sostengan lo que tú ya no puedes.' }
    ]
  },

  'C_c3_1': {
    entrada:true, cadena:'arcoC', cond:{ visto:'C_cmb' },
    img:'EXP_ALMACEN_HELIX',
    texto:'Días después, el "Centro de Recuperación de Materiales Biológicos" amanece desmantelado: camiones vaciándolo, operarios arrancando rótulos. HELIX no admite nada; emite una nota sobre "reorganización rutinaria de servicios asistenciales". '
        + 'No hay culpables, no hay juicio, no hay disculpa. Solo una operación que se muda de barrio antes de que el ruido suba. Pero aquí, por ahora, los autobuses ya no salen llenos.',
    opciones:[
      { texto:'Ir a ver a Olm.', lleva:'C_c3_2' },
      { texto:'Mirar el depósito vaciándose un momento.', efectos:{ disociacion:+2 }, lleva:'C_c3_2' }
    ]
  },
  'C_c3_2': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'Olm sigue ante la pared de los nombres. Pero ha cambiado algo: ya no añade nombres con miedo, sino que, debajo de cada uno, alguien del barrio ha empezado a escribir lo que esa persona fue. "Tejía bufandas." "Reía fuerte." '
        + '"Me prestó dinero sin apuntarlo." La lista de los borrados se está convirtiendo, a mano, en lo contrario de un expediente.',
    opciones:[
      { texto:'Añadir algo de la vecina de Olm, si él te lo cuenta.', efectos:{ aislamiento:-4 }, lleva:'C_c3_3' },
      { texto:'Leer la pared en silencio.', efectos:{ disociacion:+2 }, lleva:'C_c3_3' }
    ]
  },
  'C_c3_3': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'"No los traje de vuelta", le dices a Olm, porque hay que decirlo. Él niega despacio. "Nadie podía. A esos ya no. —Señala la pared, los nombres con sus pequeñas vidas escritas debajo—. Pero a estos ya no los van a poder decir que nunca existieron. '
        + 'Eso se lo has quitado a HELIX. Es poco. Es lo único que quedaba por salvar de ellos: que conste que fueron."',
    opciones:[
      { texto:'Quedarte un rato ante la pared con él.', efectos:{ aislamiento:-3 }, lleva:'C_c3_4' }
    ]
  },
  'C_c3_4': {
    img:'EXP_CALLEJON_NIVELES',
    texto:'En el sector siete, donde iban a llenar el siguiente autobús, las citaciones de "reubicación" han parado de llegar. La gente no sabe por qué; tú sí. No es una victoria que salga en ninguna parte, ni que nadie pueda probarte. '
        + 'Es solo un barrio que esta semana no perdió a nadie en un autobús que no vuelve. A veces el bien también es invisible, como casi todo lo importante aquí.',
    opciones:[
      { texto:'Seguir, con eso dentro.', lleva:'C_c3_5' }
    ]
  },
  'C_c3_5': {
    img:'EXP_PLAZA_OLVIDADOS',
    texto:'La máquina se ha mudado, no ha caído. En otro distrito, otro depósito abrirá, otra lista crecerá en otra pared. Lo sabes y duele saberlo. Pero también sabes que durante un tiempo, aquí, los que sobran dejaron de desaparecer en silencio, '
        + 'y los que ya no están dejaron de ser solo un número "trasladado". Olm sigue escribiendo vidas debajo de los nombres. Tú le dejaste el bolígrafo a una verdad que ya no se puede archivar.',
    opciones:[
      { texto:'Volver a tu vida, más despierto y más cansado.', efectos:{ aislamiento:-5, faccion:'eco', rep:+2, marcaVisto:'C_done' },
        resultado:'Vuelves a lo tuyo cargando algo que no se ve: la certeza de adónde van los que "dejan de figurar", y de que se puede, con un cuerpo molido y un poco de suerte, atascar la tubería un tiempo. No cobraste. No te lo agradecerá HELIX ni saldrá en ningún parte. Pero cuando pases por la plaza y veas la pared de los nombres con sus vidas escritas debajo, sabrás que ese muro lo sostienes, en parte, tú.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
