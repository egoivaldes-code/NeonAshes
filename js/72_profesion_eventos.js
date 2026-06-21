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

  };
  Object.assign(ESCENAS_GUION, L);
})();
