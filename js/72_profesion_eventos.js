// ============================================================
// BLOQUE JS-72 — EVENTOS EXCLUSIVOS DE PROFESIÓN (v0.124)
// ------------------------------------------------------------
// Una cadena corta por oficio que SOLO aparece en la deriva si el jugador
// ejerce esa profesión (cond.profesion). Cada oficio es una puerta distinta
// al mismo mundo: ve cosas que los demás no ven, y actúa como solo él puede.
//
// Contenido standalone de vida profesional (no es la misión principal).
// Tono Character Bible: melancólico, contenido, sin héroes ni espectáculo.
// El primer nodo de cada cadena es 'entrada' con cond.profesion; los
// siguientes se alcanzan por 'lleva'. Se juegan una vez (no repetible).
//
// Solo imágenes, items y condiciones que ya existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ============================================================
  // SCAVENGER — "El contenedor que nadie reclama"
  // El ojo del chatarrero lee lo que otros pisan: un contenedor HELIX
  // medio hundido, con su código de manifiesto aún legible.
  // ============================================================
  'prof_scav_1': {
    entrada: true,
    cond: { profesion: 'scavenger' },
    img: 'EXP_CANAL_PILAS',
    texto: 'La gente pasa por encima del pantalán sin mirar. Tú no: tu ojo de chatarrero se queda clavado en un '
         + 'contenedor HELIX medio hundido en el agua negra, ladeado entre los pilotes. El código de manifiesto '
         + 'sigue legible bajo la mugre. Carga registrada, nunca recogida. Eso, en las Pilas, es comida.',
    opciones: [
      { texto: 'Vadear hasta él y forzar el cierre.', efectos:{ fatiga:+8 },
        resultado:'El agua helada te llega al pecho. El cierre está corroído; cede tras pelearte un rato con él. Dentro, envuelto en gomaespuma podrida, hay material de verdad.', lleva:'prof_scav_2' },
      { texto: 'Observar primero quién más lo ha visto.', efectos:{ disociacion:+1 },
        resultado:'Te quedas en la sombra un par de minutos. Nadie ronda, nadie vigila. O el contenedor lleva aquí tanto que ya no le importa a nadie, o es una trampa. Decides que el hambre puede más que el miedo.', lleva:'prof_scav_2' },
      { texto: 'Demasiado expuesto. Dejarlo.', efectos:{ aislamiento:+2 },
        resultado:'Le das la espalda. Un buen chatarrero también sabe cuándo un hallazgo huele a cebo. Sigues camino con las manos vacías y el instinto intacto.' }
    ]
  },
  'prof_scav_2': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Vacías el contenedor en el suelo del pantalán. Componentes industriales, cobre limpio, una placa de '
         + 'control casi intacta. Y al fondo, fuera de inventario, una caja personal: la de algún estibador que '
         + 'metió aquí lo que le importaba y nunca volvió a por ella.',
    opciones: [
      { texto: 'Coger todo el material aprovechable.', efectos:{ item:'chatarra', creditos:+40 },
        resultado:'Cargas con lo que puedes vender y dejas el resto al agua. Una buena jornada sin haber fichado en ningún sitio. El manifiesto de HELIX nunca sabrá que existió.' },
      { texto: 'Abrir la caja personal.', azar:{ prob:0.5,
          exito:{ efectos:{ item:'nucleo_optico', creditos:+15 },
            resultado:'Dentro, un núcleo óptico apagado y unas monedas. Nada que cambie tu vida. Lo guardas igual: hay objetos que se quedan contigo no por lo que valen, sino por la mano que los metió ahí.' },
          fallo:{ efectos:{ item:'chatarra', aislamiento:+3 },
            resultado:'Dentro solo hay ropa de trabajo enmohecida y una foto que el agua ha borrado del todo. Cierras la caja despacio. Te llevas la chatarra del resto y la sensación de haber abierto una tumba pequeña.' } } }
    ]
  },

  // ============================================================
  // INVESTIGADOR — "El detalle que no encaja"
  // El ojo entrenado ve la mentira en una escena cotidiana.
  // ============================================================
  'prof_inv_1': {
    entrada: true,
    cond: { profesion: 'investigador' },
    img: 'SECTOR7_STREETS',
    texto: 'Es una calle como cualquier otra, pero algo te raspa por dentro. Una mujer espera en un portal '
         + 'mirando el reloj cada pocos segundos. Lleva abrigo de invierno y no hace frío. Y el hombre del puesto '
         + 'de fideos de enfrente la observa fingiendo que limpia la misma taza desde hace cinco minutos.',
    opciones: [
      { texto: 'Sentarte en el puesto y leer la escena.', efectos:{ disociacion:+2 },
        resultado:'Pides fideos que no piensas comer. Desde la barra lo ves claro: ella no espera a nadie, vigila la puerta de al lado. Él no limpia, monta guardia. Dos profesionales que no saben que hay un tercero mirándolos: tú.', lleva:'prof_inv_2' },
      { texto: 'Acercarte directamente a la mujer.', efectos:{ aislamiento:+1 },
        resultado:'Te acercas con una excusa tonta. Ella te corta con una mirada de hielo y un "circula" entre dientes. Profesional. Pero el roce te confirma lo que sospechabas: aquí hay una operación en marcha.', lleva:'prof_inv_2' },
      { texto: 'No es tu caso. Seguir.', efectos:{ disociacion:+1 },
        resultado:'Apartas la vista y sigues. No todo lo que no encaja es asunto tuyo, y en las Pilas la curiosidad se cobra cara. Aun así, la imagen del abrigo de invierno te acompaña media calle más.' }
    ]
  },
  'prof_inv_2': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Decides quedarte hasta entender la película. A los diez minutos, un coche sin matrícula se detiene, '
         + 'un hombre baja una caja al portal vigilado y se va. La mujer y el de los fideos relajan los hombros a '
         + 'la vez. Lo que sea que esperaban, ha llegado. Tú eres el único que ha visto las tres piezas.',
    opciones: [
      { texto: 'Anotarlo todo y guardártelo.', efectos:{ creditos:+30, disociacion:+2 },
        resultado:'Memorizas caras, hora, modelo del coche. Información así siempre encuentra comprador en esta ciudad: un periodista, una facción, alguien a quien le sirva. La vendes con discreción. No necesitas saber qué había en la caja para cobrar por saber que llegó.' },
      { texto: 'Dejar que la calle siga su curso.', efectos:{ aislamiento:-3 },
        resultado:'Pagas los fideos y te vas. Lo has entendido, que era lo que te picaba; no hace falta convertirlo en dinero ni en problema. Hay una paz rara en resolver un caso solo para ti y dejar que el mundo no se entere.' }
    ]
  },

  // ============================================================
  // CAZARRECOMPENSAS — "Una cara del tablón"
  // Reconoces a alguien de un contrato viejo. No es una caza: es una
  // decisión contenida sobre alguien que solo intenta seguir vivo.
  // ============================================================
  'prof_caza_1': {
    entrada: true,
    cond: { profesion: 'cazarrecompensas' },
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'Entre la gente del mercado, una cara te detiene en seco. La conoces: estuvo en el tablón hace meses, '
         + 'recompensa media, contrato caducado sin que nadie lo cerrara. Ahora vende baratijas en un tenderete, '
         + 'más delgado, más viejo, con un crío pequeño agarrado a su pierna. Nadie más lo reconocería. Tú sí.',
    opciones: [
      { texto: 'Acercarte despacio, sin enseñar las cartas.', efectos:{ disociacion:+2 },
        resultado:'Te paras en su puesto fingiendo interés por un reloj roto. Él levanta la vista y, por una fracción de segundo, te reconoce a ti —o reconoce lo que eres—. La mano le tiembla. El crío sigue jugando, ajeno.', lleva:'prof_caza_2' },
      { texto: 'Confirmar la cara desde lejos antes de nada.', efectos:{ disociacion:+1 },
        resultado:'Das un rodeo y lo observas sin que te vea. No hay duda: es él. Pero el contrato está muerto y nadie pagaría ya por cerrarlo. Lo que decidas ahora no es trabajo. Es otra cosa.', lleva:'prof_caza_2' }
    ]
  },
  'prof_caza_2': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'Os miráis un segundo de más. Él no corre —con el crío no puede— y tú lo sabes. Sabe que lo sabes. '
         + 'Toda la distancia entre quien fuiste contratado para ser y quien eres ahora mismo cabe en ese silencio.',
    opciones: [
      { texto: 'Comprarle el reloj roto y marcharte.', efectos:{ creditos:-10, aislamiento:-4, faccion:'loto', rep:+2 },
        resultado:'Le pones unas monedas en la mano por una chatarra que no quieres. "Buen producto", dices, y te vas sin mirar atrás. Es tu manera de decirle que el tablón lo ha olvidado, y tú también. El crío te dice adiós con la mano. Eso pesa más que cualquier recompensa.' },
      { texto: 'Recordarle, bajito, que se cambie de barrio.', efectos:{ disociacion:+2, aislamiento:-2 },
        resultado:'"Hay quien todavía tiene buena memoria", murmuras al dejar el puesto. "Yo que tú, no echaría raíces aquí." No es una amenaza; es el único aviso que sabes dar. Él asiente, pálido. Quizá le hayas dado semanas. Quizá nada. Lo dejas a su suerte, que es lo máximo que puedes ofrecer.' },
      { texto: 'Cobrar la pieza tú mismo, contrato o no.', efectos:{ creditos:+90, aislamiento:+8, disociacion:+5 },
        resultado:'Hay redes que pagan por entregas sin tablón, y tú sabes a quién llamar. Cobras. Es más de lo que has visto en semanas. Pero el llanto del crío cuando se lo llevan se te queda enganchado, y esa noche el dinero no abriga nada. Algunos cobros se pagan dos veces.' }
    ]
  },

  // ============================================================
  // HACKER — "Ruido en la red"
  // Tu implante capta una señal que nadie más percibe: algo viejo que
  // sigue transmitiendo en una frecuencia muerta. (Melancólico, no Centauri.)
  // ============================================================
  'prof_hack_1': {
    entrada: true,
    cond: { profesion: 'hacker' },
    img: 'EXP_CIBERCAFE',
    texto: 'Caminas y, de pronto, tu implante te pica detrás del ojo: un susurro en una frecuencia que debería '
         + 'estar muerta. La gente a tu alrededor no oye nada —no tienen con qué—. Para ti es nítido: un patrón '
         + 'repetido, una baliza automática llamando a una central que seguramente lleva años sin existir.',
    opciones: [
      { texto: 'Triangular la fuente y seguirla.', efectos:{ fatiga:+5, disociacion:+3 },
        resultado:'Dejas que el implante te guíe entre callejones, siguiendo la intensidad de la señal como quien sigue un olor. Te lleva a un cuarto de telecomunicaciones olvidado tras una reja oxidada.', lleva:'prof_hack_2' },
      { texto: 'Filtrar el patrón aquí mismo.', efectos:{ disociacion:+4 },
        resultado:'Te apoyas en una pared y trabajas la señal en el sitio. Bajo el ruido hay una estructura: no es una alarma, es un saludo. Un sistema preguntando, una y otra vez, si hay alguien al otro lado. Se te eriza la piel. Decides ir a verlo.', lleva:'prof_hack_2' }
    ]
  },
  'prof_hack_2': {
    img: 'EXP_TALLER_NEURAL',
    texto: 'Tras la reja, un viejo nodo de red sigue encendido a base de una batería que se niega a morir. Llevará '
         + 'décadas repitiendo su llamada en el vacío, sin que nadie respondiera jamás. En la pantalla agrietada '
         + 'parpadea una sola línea, en un protocolo que ya nadie usa: "¿SIGUES AHÍ?"',
    opciones: [
      { texto: 'Vaciar lo que quede de valor y desconectarlo.', efectos:{ creditos:+45, item:'chatarra' },
        resultado:'Extraes los módulos que aún se venden y, casi sin pensarlo, le respondes "no" antes de cortar la batería. El nodo se apaga por fin. Te llevas el cobre y una pregunta que no sabías que cargabas: cuántas cosas siguen llamando en esta ciudad sin que nadie conteste.' },
      { texto: 'Copiar su registro antes de dejarlo seguir.', efectos:{ item:'chip_datos_corrupto', disociacion:+3 },
        resultado:'Vuelcas su memoria a un chip: décadas de la misma pregunta lanzada al silencio. No tiene valor de mercado. Lo guardas igual. Dejas el nodo encendido, llamando. Que siga. Apagarlo te habría parecido, no sabes bien por qué, una crueldad.' }
    ]
  },

  // ============================================================
  // CONTRABANDISTA — "Un favor fuera de ruta"
  // Alguien te reconoce como correo y te pide mover algo sin contrato.
  // Lo que llevas encima decide cómo sales del mal paso.
  // ============================================================
  'prof_contra_1': {
    entrada: true,
    cond: { profesion: 'contrabandista' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una anciana te corta el paso en un soportal. Te ha reconocido —corre la voz de quién mueve cosas—. '
         + '"Tú llevas paquetes", dice, sin preguntar. Te tiende un envoltorio pequeño, del tamaño de una mano. '
         + '"Mi nieto está al otro lado del control del sector. Son sus medicinas. Yo ya no paso, me tiemblan '
         + 'demasiado las manos para que no sospechen. A ti no te mirarán igual."',
    opciones: [
      { texto: 'Aceptar el paquete. Sin cobrar.', efectos:{ aislamiento:-3 },
        resultado:'Te lo guardas en el forro del abrigo. "Que sea verdad lo de las medicinas", piensas, aunque sabes que en este oficio es mejor no abrir lo que cargas. La anciana te aprieta la muñeca con una fuerza que no aparenta. Toca pasar el control.', lleva:'prof_contra_2' },
      { texto: 'Aceptar, pero pidiendo algo a cambio.', efectos:{ creditos:+20, aislamiento:+1 },
        resultado:'"Nadie mueve nada gratis", dices, y ella, sin discutir, saca unas monedas arrugadas que seguramente le hacían falta. Te las guardas con un regusto raro. Negocio es negocio. Toca pasar el control.', lleva:'prof_contra_2' },
      { texto: 'Declinar. No conoces a esta gente.', efectos:{ aislamiento:+3 },
        resultado:'"No paso nada que no haya pactado antes", le dices, y es la verdad: los favores ciegos es como acaban los correos en una zanja. Ella asiente, derrotada, y guarda el envoltorio. Sigues camino intentando no pensar en el nieto.' }
    ]
  },
  'prof_contra_2': {
    img: 'EXP_PUERTO_CARGA',
    texto: 'El control del sector: dos agentes de HELIX y un escáner de mano. La cola avanza despacio. El paquete '
         + 'te pesa en el forro como si latiera. Un agente te hace señas de que te acerques.',
    opciones: [
      { texto: 'Pasar de frente, con la cara aburrida de quien lo hace cada día.', azar:{ prob:0.6,
          exito:{ efectos:{ aislamiento:-2 },
            resultado:'Le sostienes la mirada con el hastío exacto de un currante más. El agente te escanea por encima, sin ganas, y te hace un gesto de que circules. Al otro lado, un crío espera en una esquina. Le das el paquete y desapareces antes de ver cómo lo abre. Algunos trabajos se pagan en no mirar atrás.' },
          fallo:{ efectos:{ condicion:'costillas', disociacion:+5 },
            resultado:'El escáner pita. "Abre el abrigo." Lo que sigue es un cacheo, un par de golpes "preventivos" y la confiscación del envoltorio ante tus narices. Te sueltan con una advertencia y las costillas doloridas. El nieto se queda sin medicinas y tú con la lección de siempre: ningún favor es gratis.' } } },
      { texto: 'Reventar un bote de humo y cruzar en la confusión.', req:{ item:'granada_humo' }, pista:'necesitas un bote de humo',
        efectos:{ quitaItem:'granada_humo', fatiga:+5, aislamiento:-2 },
        resultado:'Dejas caer el bote junto a la cola. El humo lo llena todo, los agentes gritan, la gente se dispersa. Cruzas el control a paso vivo entre la nube y entregas el paquete al otro lado. Caro en material, pero limpio. La anciana tenía razón: a ti no te miraron igual. No te miraron en absoluto.' }
    ]
  },

  // ============================================================
  // SEGURIDAD HELIX — "Lo que la placa te deja hacer"
  // La placa crea la situación: una pequeña injusticia de calle y la
  // discreción de decidir qué clase de agente eres.
  // ============================================================
  'prof_seg_1': {
    entrada: true,
    cond: { profesion: 'seguridad' },
    img: 'SECTOR7_STREETS',
    texto: 'Con la placa de HELIX al cinto, la calle se abre a tu paso y se cierra a tu espalda. En una esquina, '
         + 'un tendero gordo zarandea a un crío flaco que le ha robado fruta. "¡Agente! ¡Agente, llévatelo, que '
         + 'es la tercera vez!" El crío te mira con el terror de quien sabe lo que la placa puede hacerle. La '
         + 'fruta robada, dos piezas, rueda por el suelo mojado.',
    opciones: [
      { texto: 'Aplicar el procedimiento: identificar y fichar al crío.', efectos:{ faccion:'helix', rep:+3, aislamiento:+5 },
        resultado:'Registras al chaval en el sistema, como manda el manual. HELIX premia el orden: tu expediente sube un punto. El tendero asiente, satisfecho. El crío, ya fichado de por vida por dos piezas de fruta, te escupe a los pies antes de que se lo lleven. El procedimiento estaba de tu parte. Nada más lo estaba.', lleva:'prof_seg_2' },
      { texto: 'Pagar la fruta de tu bolsillo y soltar al crío.', efectos:{ creditos:-15, aislamiento:-5, faccion:'loto', rep:+2 },
        resultado:'Le pones al tendero el precio de la fruta en la mano y le dices al crío que se largue antes de que cambies de idea. El tendero refunfuña pero calla ante la placa. El crío desaparece sin dar las gracias —aquí nadie se fía de un uniforme que ayuda—, pero algo en su mirada cambia. La placa también sirve para esto, si te dejan.', lleva:'prof_seg_2' },
      { texto: 'Quedarte la fruta como "decomiso" y echarlos a los dos.', efectos:{ creditos:+5, aislamiento:+6, disociacion:+3 },
        resultado:'"Esto queda decomisado." Te guardas las dos piezas y mandas a callar a los dos. Es lo que muchos con placa harían: usar la autoridad para la nimiedad de tu propio estómago. Muerdes la fruta calle abajo. Está buena. Te sabe mal igual.' }
    ]
  },
  'prof_seg_2': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Calle abajo, un compañero de patrulla te ha visto. Se acerca, mascando algo, con la sonrisa fácil del '
         + 'que lleva mucho tiempo con la placa. "Te he visto con el crío", dice. "Aquí los novatos aprenden '
         + 'rápido: la placa da, si sabes pedirle. ¿Te enseño cómo se saca tajada de un mercado como este?"',
    opciones: [
      { texto: '"Hoy no. Tengo ronda."', efectos:{ aislamiento:-2, faccion:'helix', rep:+1 },
        resultado:'Declinas sin hacer aspavientos; señalar a un corrupto a la cara es buena forma de aparecer flotando en un canal. Él se encoge de hombros, "tú te lo pierdes", y se va. Sigues tu ronda limpio un día más, que en HELIX es casi un acto de rebeldía silenciosa.' },
      { texto: 'Dejar que te enseñe el método.', efectos:{ creditos:+60, aislamiento:+7, disociacion:+4 },
        resultado:'Le sigues. En una hora aprendes a qué puestos apretar, qué mirar y qué no, cómo convertir la placa en una caja registradora. Sales con los bolsillos llenos y la certeza incómoda de en qué te estás convirtiendo. Era esto lo que el crío vio en ti antes que tú mismo.' }
    ]
  }
  ,

  // ============================================================
  // CADENAS QUE DESEMBOCAN EN PELEA (v0.129)
  // Una por oficio. Una opción lanza un combate real (sistema nuevo:
  // estados, tipos de enemigo) con vida local; ganar o perder ramifica
  // la historia. Las consecuencias de cuerpo y reputación van aquí.
  // ============================================================

  // SCAVENGER — disputa por un pecio. Bruto + cobarde: prioriza objetivo.
  'prof_scav_p1': {
    entrada: true,
    cond: { profesion: 'scavenger' },
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El generador volcado es una mina: cobre, células, medio motor recuperable. Pero no eres el único ojo que lo ha visto. '
         + 'Dos chatarreros de otra cuadrilla aparecen por el otro lado, y por la forma de plantarse no vienen a repartir. El grande coge una llave de tubo. El flaco se queda medio paso atrás, calculando la huida.',
    opciones: [
      { texto: 'Es tuyo. Plantarte y disputarlo.',
        pelea: { texto: 'El grande va de frente, lento pero demoledor; el flaco ronda buscando el momento, pero no le sobra estómago para esto.',
          integridad: 11,
          enemigos: [
            { nombre: 'Chatarrero grande', desc: 'Llave de tubo, sin prisa', tipo: 'bruto', integridad: 4, fuerza: 5, umbral: 6 },
            { nombre: 'Chatarrero flaco', desc: 'Calcula la huida', tipo: 'cobarde', integridad: 2, fuerza: 2, umbral: 2 }
          ],
          progresoOficio:{ id:'scavenger', n:80 },
          gana: 'prof_scav_p_win', pierde: 'prof_scav_p_lose' } },
      { texto: 'No vale una costilla rota. Cederlo.', efectos:{ aislamiento:+2 },
        resultado: 'Levantas las manos y retrocedes. El grande asiente, casi con respeto, y se queda con el pecio. Te vas con las manos vacías y esa vieja lección de la chatarra: a veces el mejor hallazgo es seguir entero.' }
    ]
  },
  'prof_scav_p_win': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El grande se retira cojeando y el flaco ya hace rato que no está. El pecio es tuyo. Lo desguazas con calma, '
         + 'con el pulso aún alto, y cargas con lo que vale. Una victoria pequeña y sucia, de las que no se cuentan a nadie.',
    opciones: [
      { texto: 'Cargar el botín y largarte.', efectos:{ item:'chatarra', creditos:+70, fatiga:+10 },
        resultado: 'Te llevas cobre, una célula buena y los créditos que sacarás de todo ello. Las costillas te recordarán el precio un par de días.' },
      { texto: 'Rebuscar también entre lo que soltaron ellos.', azar:{ prob:0.55,
          exito:{ efectos:{ item:'municion', fatiga:+12 }, resultado:'Entre el barro encuentras un puñado de pernos de munición que se les cayeron en la pelea. En las Pilas, las balas también son moneda.' },
          fallo:{ efectos:{ fatiga:+12 }, resultado:'Rebuscas un rato, pero solo encuentras basura mojada. No siempre hay premio extra; bastante es haber ganado.' } } }
    ]
  },
  'prof_scav_p_lose': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'La llave de tubo te alcanza el costado y el suelo sube a recibirte. Cuando te incorporas, el pecio ya no está '
         + 'y ellos tampoco. Te queda el barro, el dolor y una caja vacía donde iba a estar la cena.',
    opciones: [
      { texto: 'Arrastrarte hasta levantarte.', efectos:{ fatiga:+22, aislamiento:+3 },
        resultado: 'Te levantas a trozos. Nada roto, todo magullado. En las Pilas perder no es morir; es solo otro día con menos.' }
    ]
  },

  // INVESTIGADOR — te acercaste demasiado. Cuchillo a sueldo: te hace sangrar.
  'prof_inv_p1': {
    entrada: true,
    cond: { profesion: 'investigador' },
    img: 'SECTOR7_STREETS',
    texto: 'Llevas días tirando del hilo equivocado para alguien, y alguien se ha cansado. Lo notas tarde: el callejón se '
         + 'estrecha y un tipo sale de un quicio con una navaja corta y la mirada tranquila del que ya ha hecho esto antes. No habla. No hace falta.',
    opciones: [
      { texto: 'No hay sitio para correr. Encararlo.',
        pelea: { texto: 'Se mueve rápido y busca el corte, no la muerte: quiere dejarte marcado y sangrando para que aprendas a no preguntar.',
          integridad: 10,
          enemigos: [
            { nombre: 'Cuchillo a sueldo', desc: 'Corta y se aparta · te hace sangrar', tipo: 'rapido', integridad: 3, fuerza: 4, umbral: 2 }
          ],
          progresoOficio:{ id:'investigador', n:80 },
          gana: 'prof_inv_p_win', pierde: 'prof_inv_p_lose' } },
      { texto: 'Tirar la cartera y salir corriendo.', efectos:{ creditos:-50, disociacion:+3 },
        resultado: 'Le lanzas la cartera a los pies y echas a correr antes de que decida. No te sigue: ha cobrado el aviso. Llegas a casa entero, más pobre y con la certeza de que tu pregunta tocaba hueso.' }
    ]
  },
  'prof_inv_p_win': {
    img: 'SECTOR7_STREETS',
    texto: 'El sicario reconoce que no le pagan lo bastante para esto y se retira, apretándose un brazo. Te quedas en el '
         + 'callejón recuperando el aire. No le has sacado un nombre, pero ahora sabes una cosa: el hilo que tirabas le importa a alguien con dinero.',
    opciones: [
      { texto: 'Guardar lo que te ha dejado caer.', efectos:{ item:'arma_blanca', faccion:'loto', rep:+1, fatiga:+8 },
        resultado: 'En la huida ha soltado su navaja. La recoges: buena hoja, mejor que la tuya. Y en el Arrabal, que se sepa que sigues en pie cuenta como respeto.' },
      { texto: 'Curarte el rasguño antes de seguir.', azar:{ prob:0.6,
          exito:{ efectos:{ item:'vendaje', faccion:'loto', rep:+1, fatiga:+8 }, resultado:'En su zurrón caído hay un vendaje compresor sin estrenar. Te lo guardas: el oficio de preguntar deja cicatrices, y conviene ir preparado.' },
          fallo:{ efectos:{ faccion:'loto', rep:+1, fatiga:+8 }, resultado:'No lleva nada que te sirva. Te aprietas la manga sobre el corte y sigues. La hoja que recogiste tendrá que bastar.' } } }
    ]
  },
  'prof_inv_p_lose': {
    img: 'SECTOR7_STREETS',
    texto: 'El corte te cruza el antebrazo y la sangre te nubla la decisión. Cuando consigues taparte, él ya se ha ido, '
         + 'su trabajo hecho. El mensaje ha quedado claro, escrito en tu piel: deja de preguntar.',
    opciones: [
      { texto: 'Apretar la herida y volver a casa.', efectos:{ fatiga:+20, aislamiento:+4 },
        resultado: 'Te vendas como puedes y caminas pegado a las paredes. La herida cerrará. La pregunta, en cambio, te va a costar más soltarla.' }
    ]
  },

  // CAZARRECOMPENSAS — el objetivo se esconde tras un guardaespaldas bruto.
  'prof_caza_p1': {
    entrada: true,
    cond: { profesion: 'cazarrecompensas' },
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'Lo tienes acorralado en un puesto del mercado sumergido: un moroso de poca monta con una orden de captura barata. '
         + 'El problema es el armario con patas que ha contratado de niñera, plantado entre tú y él. El moroso ya tiembla; el grandullón ni pestañea.',
    opciones: [
      { texto: 'Pasar por encima del guardaespaldas.',
        pelea: { texto: 'El armario aguanta como un muro y golpea como una grúa; cada porrazo suyo te puede dejar viendo estrellas. El moroso, detrás, busca por dónde escurrirse.',
          integridad: 12,
          enemigos: [
            { nombre: 'Guardaespaldas', desc: 'Un muro que aturde', tipo: 'bruto', integridad: 5, fuerza: 6, umbral: 6 },
            { nombre: 'El moroso', desc: 'Huirá en cuanto pueda', tipo: 'cobarde', integridad: 2, fuerza: 2, umbral: 2 }
          ],
          progresoOficio:{ id:'cazarrecompensas', n:80 },
          gana: 'prof_caza_p_win', pierde: 'prof_caza_p_lose' } },
      { texto: 'Esperar a que se separen.', efectos:{ fatiga:+6, disociacion:+1 },
        resultado: 'Te tragas las ganas y esperas en la sombra. Tarde o temprano el moroso irá a mear solo. Lo cazas sin ruido, sin gloria y sin un rasguño. El trabajo limpio rara vez es el espectacular.' }
    ]
  },
  'prof_caza_p_win': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'El armario cae de rodillas, resoplando, y decide que su sueldo no cubre esto. El moroso, sin su muro, se '
         + 'desinfla solo. Lo esposas mientras balbucea excusas que no escuchas. Otro nombre tachado de la lista.',
    opciones: [
      { texto: 'Cobrar la captura.', efectos:{ creditos:+140, faccion:'helix', rep:+1, fatiga:+12 },
        resultado: 'Entregas al moroso y cobras la recompensa. No es una fortuna, pero llena la nevera y mantiene tu nombre en circulación. El guardaespaldas, por cierto, no te guarda rencor: es solo trabajo, para todos.' },
      { texto: 'Cachear al guardaespaldas antes de irte.', azar:{ prob:0.5,
          exito:{ efectos:{ item:'municion', creditos:+30, fatiga:+12 }, resultado:'El armario lleva munición de sobra y unos billetes sueltos. No protesta cuando se los quitas: ya ha tenido bastante por hoy.' },
          fallo:{ efectos:{ fatiga:+12 }, resultado:'Solo lleva encima dolor y orgullo herido. Lo dejas en paz; un profesional reconoce a otro.' } } }
    ]
  },
  'prof_caza_p_lose': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'Un golpe del armario te dobla y el suelo del mercado te recibe entre charcos. Para cuando levantas la cabeza, '
         + 'el moroso y su niñera ya son dos sombras al fondo del pasillo. La recompensa se va con ellos.',
    opciones: [
      { texto: 'Recoger tu orgullo del suelo.', efectos:{ fatiga:+24, aislamiento:+3 },
        resultado: 'Te incorporas dolorido y sin presa. La orden seguirá abierta, y tú con una lección cara: a algunos no se les entra de frente.' }
    ]
  },

  // HACKER — tu intrusión deja rastro y baja un equipo de seguridad físico.
  'prof_hack_p1': {
    entrada: true,
    cond: { profesion: 'hacker' },
    img: 'EXP_TALLER_NEURAL',
    texto: 'El trabajo era limpio: entrar, copiar, salir. Pero el sistema te ha mordido al salir y ha cantado tu posición. '
         + 'Oyes botas en la escalera del taller: un equipo de recuperación, con uno dando las órdenes. Si esto se llena de ruido, bajarán más.',
    opciones: [
      { texto: 'Plantar cara en el taller estrecho.',
        pelea: { texto: 'El que manda los coordina desde atrás: mientras él dirija, los demás aprietan. Y cada disparo que sueltes va a traer compañía por esas escaleras. Calla al jefe o juega callado.',
          integridad: 11,
          enemigos: [
            { nombre: 'Jefe de recuperación', desc: 'Coordina al equipo', tipo: 'lider', integridad: 3, fuerza: 4, umbral: 4 },
            { nombre: 'Operario de seguridad', desc: 'Cumple órdenes', integridad: 2, fuerza: 3, umbral: 2 }
          ],
          refuerzoSiRuido: 55,
          refuerzoGrupo: [ { nombre: 'Refuerzo de HELIX', desc: 'El ruido lo trajo', tipo:'rapido', integridad: 2, fuerza: 3, umbral: 2 } ],
          progresoOficio:{ id:'hacker', n:80 },
          gana: 'prof_hack_p_win', pierde: 'prof_hack_p_lose' } },
      { texto: 'Borrar el rastro y huir por el conducto.', efectos:{ fatiga:+10, creditos:-30 },
        resultado: 'Tiras los datos a un servidor muerto, fríes tu firma y te escurres por un conducto de ventilación angosto. Sales sin el botín y con la espalda hecha polvo, pero sin cara que puedan archivar. A veces ganar es no estar.' }
    ]
  },
  'prof_hack_p_win': {
    img: 'EXP_TALLER_NEURAL',
    texto: 'Sin su jefe dando órdenes, el equipo se desordena y se repliega escaleras arriba. El taller queda en silencio, '
         + 'solo el zumbido de las máquinas y tu respiración. Los datos siguen en tu bolsillo, calientes.',
    opciones: [
      { texto: 'Salir con lo que viniste a buscar.', efectos:{ creditos:+120, faccion:'ia', rep:+1, fatiga:+10 },
        resultado: 'Vendes los datos a quien sabes y el Nodo toma nota de que sabes moverte. No te hace rico, pero te hace fiable, que en estos círculos vale más.' },
      { texto: 'Registrar el equipo de seguridad caído.', azar:{ prob:0.5,
          exito:{ efectos:{ item:'municion', fatiga:+10 }, resultado:'Uno de los operarios soltó su cargador en la refriega. Recoges la munición suelta: nunca sabes cuándo el siguiente trabajo se tuerce a tiros.' },
          fallo:{ efectos:{ fatiga:+10 }, resultado:'Equipo estándar, todo rastreado, nada que merezca llevarse. Lo dejas y desapareces antes de que vuelvan.' } } }
    ]
  },
  'prof_hack_p_lose': {
    img: 'EXP_TALLER_NEURAL',
    texto: 'Te superan en número antes de que puedas pensar. Te quitan el terminal de las manos, te sacan a empujones y te '
         + 'dejan tirado en el callejón con una advertencia y un par de costillas resentidas. Los datos se quedan ellos.',
    opciones: [
      { texto: 'Levantarte antes de que cambien de idea.', efectos:{ fatiga:+22, disociacion:+4 },
        resultado: 'Te incorporas y desapareces antes de que decidan rematar el aviso. El trabajo está perdido y tu firma, fichada. Tocará estar bajo tierra una temporada.' }
    ]
  },

  // CONTRABANDISTA — emboscada de una banda rival en el puerto de carga.
  'prof_contra_p1': {
    entrada: true,
    cond: { profesion: 'contrabandista' },
    img: 'EXP_PUERTO_CARGA',
    texto: 'La entrega iba bien hasta que tres siluetas salen de detrás de los contenedores. Una banda rival que lleva tiempo '
         + 'queriendo tu ruta, y el que va delante sonríe como quien ya ha ganado. Detrás, el puerto está lleno de oídos: si esto truena, vendrán a mirar.',
    opciones: [
      { texto: 'No te quitan la ruta sin pelear.',
        pelea: { texto: 'El cabecilla envalentona a los suyos con solo estar ahí. Y el puerto es una caja de resonancia: cada tiro va a llamar a más curiosos con ganas. Cállalo, o hazlo en silencio.',
          integridad: 11,
          enemigos: [
            { nombre: 'Cabecilla rival', desc: 'Mátalo y el resto duda', tipo: 'lider', integridad: 3, fuerza: 4, umbral: 4 },
            { nombre: 'Matón del puerto', desc: 'Grande y terco', tipo: 'bruto', integridad: 4, fuerza: 5, umbral: 6 },
            { nombre: 'Recadero', desc: 'Más miedo que ganas', tipo: 'cobarde', integridad: 2, fuerza: 2, umbral: 2 }
          ],
          refuerzoSiRuido: 60,
          refuerzoGrupo: [ { nombre: 'Curioso armado', desc: 'El alboroto lo trajo', integridad: 2, fuerza: 3, umbral: 2 } ],
          progresoOficio:{ id:'contrabandista', n:80 },
          gana: 'prof_contra_p_win', pierde: 'prof_contra_p_lose' } },
      { texto: 'Soltar la carga y desaparecer.', efectos:{ creditos:-80, aislamiento:+3 },
        resultado: 'Dejas el paquete en el suelo y te fundes entre los contenedores. Pierdes la entrega y la cara ante el cliente, pero conservas la piel y, lo que importa, la ruta sigue siendo un secreto que ellos no controlan del todo.' }
    ]
  },
  'prof_contra_p_win': {
    img: 'EXP_PUERTO_CARGA',
    texto: 'En cuanto el cabecilla cae, el recadero pone pies en polvorosa y el matón decide que la ruta no vale tanto. El '
         + 'puerto vuelve a su rumor de grúas y agua. Recoges tu carga del suelo, intacta, y respiras.',
    opciones: [
      { texto: 'Cerrar la entrega como si nada.', efectos:{ creditos:+130, faccion:'loto', rep:+2, fatiga:+12 },
        resultado: 'Entregas con la mercancía entera y la mano firme. El cliente paga sin saber lo cerca que estuvo de no ver su paquete, y en el Arrabal corre la voz de que tu ruta tiene dientes.' },
      { texto: 'Recoger lo que dejó la banda rival.', azar:{ prob:0.55,
          exito:{ efectos:{ item:'municion', creditos:+20, fatiga:+12 }, resultado:'Entre los contenedores quedan pernos de munición y unos créditos sueltos del que dirigía. Botín de guerra: en el puerto, quien gana, recoge.' },
          fallo:{ efectos:{ fatiga:+12 }, resultado:'Se lo llevaron todo en la huida. Te conformas con haber conservado la ruta, que vale más que cualquier chatarra.' } } }
    ]
  },
  'prof_contra_p_lose': {
    img: 'EXP_PUERTO_CARGA',
    texto: 'Te superan entre los tres y, cuando el ruido trae a un cuarto, ya no hay nada que hacer. Te dejan en el suelo, '
         + 'sin carga y sin la ruta, escuchando cómo se alejan riéndose con lo que era tuyo.',
    opciones: [
      { texto: 'Levantarte con lo que queda de orgullo.', efectos:{ fatiga:+24, aislamiento:+4, faccion:'loto', rep:-1 },
        resultado: 'Te incorporas entre los contenedores, magullado y sin entrega. La ruta ahora es de ellos, y reconstruir tu nombre en el Arrabal va a costar más que cualquier paliza.' }
    ]
  },

  // SEGURIDAD — un grupo acorralado se revuelve: enjambre que sangra.
  'prof_seg_p1': {
    entrada: true,
    cond: { profesion: 'seguridad' },
    img: 'SECTOR7_STREETS',
    texto: 'La orden era dispersar un corrillo en una esquina. Pero al acercarte, lo que era un grupo de críos hartos se '
         + 'convierte en una jauría: navajas que salen de los bolsillos, manos rápidas, ojos sin miedo porque ya no tienen nada que perder. Y te tienen rodeado.',
    opciones: [
      { texto: 'Imponerte. Abrirte paso a la fuerza.',
        pelea: { texto: 'Son veloces y van a por los cortes: ninguno aguanta un buen golpe, pero entre todos te pueden dejar goteando antes de que reacciones. Cúbrete, córtales el goteo y no dejes que el número te ahogue.',
          integridad: 12,
          enemigos: [
            { nombre: 'Crío con navaja', desc: 'Corta y se aparta', tipo: 'rapido', integridad: 2, fuerza: 3, umbral: 2 },
            { nombre: 'Cría veloz', desc: 'Va a por las piernas', tipo: 'rapido', integridad: 2, fuerza: 3, umbral: 2 },
            { nombre: 'El más furioso', desc: 'No siente los golpes', tipo: 'rapido', integridad: 2, fuerza: 3, umbral: 2 }
          ],
          progresoOficio:{ id:'seguridad', n:80 },
          gana: 'prof_seg_p_win', pierde: 'prof_seg_p_lose' } },
      { texto: 'Bajar la voz y dejarles una salida.', efectos:{ aislamiento:-2, facciones:[ { faccion:'loto', rep:+1 }, { faccion:'helix', rep:-1 } ] },
        resultado: 'Guardas la porra y hablas bajo, ofreciéndoles irse en lugar de tragar. Funciona: se dispersan entre dientes, sin sangre. HELIX lo llamará blandura; tú sabes que has evitado un funeral, puede que el tuyo.' }
    ]
  },
  'prof_seg_p_win': {
    img: 'SECTOR7_STREETS',
    texto: 'Uno a uno se quedan en el suelo o salen corriendo, y la esquina queda vacía salvo por las navajas tiradas y '
         + 'algún quejido. Has cumplido la orden. No te sientes ganador de nada; solo el adulto que pegó más fuerte.',
    opciones: [
      { texto: 'Cerrar el parte y seguir la ronda.', efectos:{ creditos:+90, fatiga:+14, disociacion:+3, facciones:[ { faccion:'helix', rep:+2 }, { faccion:'loto', rep:-2 } ] },
        resultado: 'HELIX marca la incidencia como resuelta y te abona la jornada con prima. En el barrio, en cambio, unos cuantos críos te han aprendido la cara. Cada bando paga distinto por lo mismo.' },
      { texto: 'Recoger las navajas tiradas y curarte.', azar:{ prob:0.6,
          exito:{ efectos:{ item:'vendaje', fatiga:+14, disociacion:+3 }, resultado:'Entre las navajas tiradas hay un botiquín de bolsillo de alguno de los críos. Sacas un vendaje. Te lo guardas mirando hacia otro lado.' },
          fallo:{ efectos:{ fatiga:+14, disociacion:+3 }, resultado:'Solo hojas baratas y manchas en el suelo. Recoges las navajas para el parte y te vas de la esquina sin mirar atrás.' } } }
    ]
  },
  'prof_seg_p_lose': {
    img: 'SECTOR7_STREETS',
    texto: 'Son demasiados y demasiado rápidos. Para cuando reaccionas, te sangran por tres sitios y la esquina te escupe '
         + 'de vuelta a la calle. Se dispersan solos, sin tu ayuda, dejándote apoyado en una pared y goteando.',
    opciones: [
      { texto: 'Apretar las heridas y reportar el fracaso.', efectos:{ fatiga:+24, aislamiento:+3, faccion:'helix', rep:-1 },
        resultado: 'Te vendas como puedes y mandas un parte que admite lo que no quieres admitir. HELIX no perdona los fracasos, y el cuerpo tardará en olvidar esta esquina.' }
    ]
  }

  ,

  // ============================================================
  // CADENAS GENERALES CON PELEA (v0.129) — abiertas a TODOS
  // No piden oficio: aparecen en cualquier deriva. Usan el puente
  // escena→combate. Tono: la calle te busca, decidas tú o no.
  // ============================================================

  // Un cobrador te reclama una deuda que no es tuya (o sí).
  'der_p_deuda_1': {
    entrada: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Un hombre ancho como una puerta te corta el paso y dice un nombre que no es el tuyo, pero da igual: '
         + '"Tú le debes a quien yo cobro." No discute, no escucha. Para él ya eres una cuenta pendiente, y las cuentas se saldan de una de dos formas.',
    opciones: [
      { texto: 'Pagar lo que pide y acabar rápido.', efectos:{ creditos:-70, aislamiento:+2 },
        resultado: 'Le sueltas los créditos sin rechistar. Los cuenta, gruñe y se aparta. Te has comprado la paz de esta noche con dinero que no te sobraba. Mañana, quién sabe.' },
      { texto: 'No le debes nada. Plantarte.',
        pelea: { texto: 'No le gusta que le digan que no. Es grande y pega como un mazo, pero es lento: si encajas y respondes con cabeza, se cansa antes que tú.',
          integridad: 11,
          enemigos: [ { nombre: 'Cobrador', desc: 'Un mazo con paciencia', tipo: 'bruto', integridad: 4, fuerza: 5, umbral: 6 } ],
          gana: 'der_p_deuda_win', pierde: 'der_p_deuda_lose' } }
    ]
  },
  'der_p_deuda_win': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El cobrador acaba sentado contra una pared, resoplando, mirándote con algo nuevo en la cara: respeto, o miedo, '
         + 'que en las Pilas son casi lo mismo. "Me he equivocado de hombre", admite. Tú ya lo sabías.',
    opciones: [
      { texto: 'Dejarlo ahí y seguir.', efectos:{ fatiga:+12 },
        resultado: 'Te alejas sin rematar. No le debías nada y ahora él lo sabe. A veces ganar es solo que te dejen en paz.' }
    ]
  },
  'der_p_deuda_lose': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El mazo te alcanza y el callejón da una vuelta de campana. Cuando te incorporas, te faltan los créditos del '
         + 'bolsillo: se ha cobrado igual, con intereses de dolor.',
    opciones: [
      { texto: 'Recoger lo que queda de ti.', efectos:{ fatiga:+22, creditos:-40, aislamiento:+3 },
        resultado: 'Te ha vaciado los bolsillos y la dignidad. Te levantas despacio. La deuda, fuera tuya o no, queda saldada a su manera.' }
    ]
  },

  // Presencias un atraco: intervenir o pasar de largo.
  'der_p_atraco_1': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'En un soportal, dos figuras acorralan a una mujer mayor contra la pared. Una le tira del bolso, la otra vigila. '
         + 'Nadie en la calle mira; aquí todos han aprendido a no ver. La mujer te encuentra los ojos un segundo, sin pedir nada, porque ya no espera nada.',
    opciones: [
      { texto: 'No es asunto tuyo. Seguir.', efectos:{ aislamiento:+4, disociacion:+2 },
        resultado: 'Bajas la mirada y pasas de largo, como todos. A tu espalda oyes un forcejeo y un golpe seco. No te giras. En las Pilas, mirar a otro lado es un músculo que se entrena, y el tuyo está fuerte.' },
      { texto: 'Meterte. No así, no hoy.',
        pelea: { texto: 'Se vuelven contra ti, sorprendidos de que alguien se moleste. Son rápidos y van con filo: te pueden dejar sangrando si te confías. Pero no esperaban resistencia, y eso ya es algo.',
          integridad: 10,
          enemigos: [
            { nombre: 'Atracador', desc: 'Navaja nerviosa · te hace sangrar', tipo: 'rapido', integridad: 2, fuerza: 3, umbral: 2 },
            { nombre: 'El vigía', desc: 'Se raja si la cosa se tuerce', tipo: 'cobarde', integridad: 2, fuerza: 2, umbral: 2 }
          ],
          gana: 'der_p_atraco_win', pierde: 'der_p_atraco_lose' } }
    ]
  },
  'der_p_atraco_win': {
    img: 'SECTOR7_STREETS',
    texto: 'Salen corriendo y el soportal queda en silencio. La mujer recoge su bolso del suelo con manos que tiemblan. '
         + 'No te da las gracias con palabras; te mira largo, asiente una vez, y se va. A veces es todo lo que cabe.',
    opciones: [
      { texto: 'Asegurarte de que llega a casa.', efectos:{ aislamiento:-3, fatiga:+10, faccion:'loto', rep:+1 },
        resultado: 'La acompañas un par de portales, sin hablar, hasta que entra. El barrio lo ha visto. No esperes una medalla, pero esta noche alguien dormirá un poco más tranquilo, y tú también.' }
    ]
  },
  'der_p_atraco_lose': {
    img: 'SECTOR7_STREETS',
    texto: 'Te cortan, te empujan y para cuando recuperas el equilibrio ya se han ido con el bolso y con la mujer en el suelo. '
         + 'La ayudas a levantarse con las pocas fuerzas que te quedan. "No tenías por qué", murmura. Quizá no. Pero alguien tenía.',
    opciones: [
      { texto: 'Levantaros los dos como podáis.', efectos:{ fatiga:+22, aislamiento:+2 },
        resultado: 'Os quedáis un momento apoyados en la pared, dos derrotados cualquiera. Perdiste la pelea, pero hay maneras de perder que pesan menos que algunas formas de ganar.' }
    ]
  },

  // Te metes sin querer en territorio de una banda.
  'der_p_territorio_1': {
    entrada: true,
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una marca pintada en la pared te avisa tarde: has entrado en territorio de alguien. Tres siluetas se despegan '
         + 'de las sombras y una de ellas, la que manda, te mira de arriba abajo. "Esta calle tiene dueño. Y no eres tú."',
    opciones: [
      { texto: 'Disculparte y retroceder despacio.', efectos:{ aislamiento:+1 },
        resultado: 'Levantas las manos, murmuras que te has equivocado de calle y retrocedes sin darles la espalda. El que manda escupe al suelo pero te deja ir. Tragar orgullo es gratis; la otra opción, no.' },
      { texto: 'No piensas dar media vuelta corriendo.',
        pelea: { texto: 'El cabecilla sonríe: justo lo que buscaba. Mientras él dé órdenes, los suyos aprietan; y el callejón resuena, así que cada tiro va a traer a más de su gente. Cállalo pronto o hazlo en silencio.',
          integridad: 11,
          enemigos: [
            { nombre: 'El dueño de la calle', desc: 'Mátalo y el resto afloja', tipo: 'lider', integridad: 3, fuerza: 4, umbral: 4 },
            { nombre: 'Perro de la banda', desc: 'Fiel mientras gane', integridad: 2, fuerza: 3, umbral: 2 }
          ],
          refuerzoSiRuido: 60,
          refuerzoGrupo: [ { nombre: 'Refuerzo de la banda', desc: 'El ruido lo trajo', tipo:'rapido', integridad: 2, fuerza: 3, umbral: 2 } ],
          gana: 'der_p_territorio_win', pierde: 'der_p_territorio_lose' } }
    ]
  },
  'der_p_territorio_win': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Con su cabecilla en el suelo, los demás retroceden hacia las sombras de las que salieron. La calle, por esta '
         + 'noche, no tiene dueño. Te sacudes el polvo y sigues, sabiendo que mañana volverá a tenerlo.',
    opciones: [
      { texto: 'Salir de su territorio antes de que se rehagan.', efectos:{ fatiga:+12, faccion:'loto', rep:-1 },
        resultado: 'Cruzas la frontera invisible de vuelta a tierra de nadie. Te has hecho un nombre y un enemigo a la vez; en el Arrabal eso suele venir en el mismo paquete.' }
    ]
  },
  'der_p_territorio_lose': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Son demasiados y el ruido trajo más. Te sacan a empujones de su calle, magullado, con la lección bien aprendida '
         + 'a base de golpes: hay fronteras en las Pilas que no se ven, pero se pagan.',
    opciones: [
      { texto: 'Arrastrarte hasta tierra de nadie.', efectos:{ fatiga:+22, aislamiento:+3 },
        resultado: 'Cruzas de vuelta a trompicones. Nadie te persigue: ya han dejado claro lo que querían. La próxima vez mirarás las paredes antes de meterte donde no te llaman.' }
    ]
  }


  };
  Object.assign(ESCENAS_GUION, L);
})();
