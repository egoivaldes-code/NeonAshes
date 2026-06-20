// ============================================================
// BLOQUE JS-61 — ESCENAS DE GUION · LOTE 6 (reactivas al inventario)
// ------------------------------------------------------------
// Eventos de exploración cuya APARICIÓN y cuyas OPCIONES dependen de
// lo que el jugador lleva encima. Mismo motor y formato que los lotes
// 1-5 (44_escenas_guion.js): cada escena admite cond / req / efectos /
// azar / lleva / resultado. Se carga DESPUÉS de 54_escenas_lote5.js y
// se fusiona en ESCENAS_GUION.
//
// Idea de diseño: los items "raros" del refinado (servidor_hundido,
// nucleo_optico, chip_datos_corrupto) y el equipo común (palanca,
// llave magnética, navaja) abren ramas que de otro modo no existen.
// Tener el objeto cambia la escena y su desenlace, no solo el texto.
//
// Solo imágenes, items y condiciones que YA existen en el juego.
// Prefijo de id: ev4_
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ================================================================
  // EVENTO 1 — "EL ANTICUARIO DE MEMORIA"
  // Solo aparece si llevas un servidor hundido. Un viejo que restaura
  // memoria muerta quiere lo que llevas. Vender, regalar, o quedártelo.
  // ================================================================
  'ev4_anticuario_1': {
    entrada: true,
    cond: { item: 'servidor_hundido' },
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'Un taller estrecho, paredes forradas de discos muertos y carcasas abiertas como animales en una mesa de '
         + 'autopsias. El viejo que lo regenta no levanta la vista de su lupa. "Hueles a servidor antiguo", dice, '
         + 'sin preguntar. "De los que todavía guardan a alguien dentro. ¿Lo vendes o solo vienes a fardar?"',
    opciones: [
      { texto: 'Vendérselo (240 CR).', req:{ item:'servidor_hundido' },
        efectos:{ quitaItem:'servidor_hundido', creditos:+240, aislamiento:+3 },
        resultado:'Cuenta los créditos en billetes gastados, despacio, como si le doliera separarse de ellos tanto como a ti del servidor. "Lo trataré bien", dice. No sabes por qué, pero le crees. Sales con el bolsillo lleno y una sensación rara de haber abandonado a alguien.' },
      { texto: 'Preguntar qué hará con él.', req:{ item:'servidor_hundido' },
        efectos:{ disociacion:+4 },
        resultado:'"¿Que qué hago? Los escucho." Te mira por fin, y sus ojos están demasiado húmedos para un negocio. "Cada uno de estos guarda a un muerto que todavía habla. Yo solo me aseguro de que alguien lo oiga." No te lo compra a la fuerza. Te deja decidir.', lleva:'ev4_anticuario_1' },
      { texto: 'Quedártelo y marcharte.',
        efectos:{ aislamiento:+1 },
        resultado:'"Como debe ser", murmura, y vuelve a su lupa. "Hay cosas que uno tiene que escuchar él mismo antes de soltarlas." Sales con el servidor todavía pesándote en la mochila. Y ahora también en la cabeza.' }
    ]
  },

  // ================================================================
  // EVENTO 2 — "LA PUERTA DEL FONDO"
  // Un sótano cerrado. Si llevas palanca o navaja, puedes entrar.
  // Si no, te quedas fuera mirando.
  // ================================================================
  'ev4_sotano_1': {
    entrada: true,
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Al fondo de un pasillo inundado a medias hay una puerta de chapa hinchada por la humedad. Alguien escribió '
         + 'con spray: "AQUÍ NO". La pintura tiene años. Lo que hay detrás, también. La puerta no está cerrada con '
         + 'llave: está sellada por el óxido y el tiempo.',
    opciones: [
      { texto: 'Hacer palanca con la térmica.', req:{ item:'palanca_termica' },
        efectos:{ fatiga:+5 },
        resultado:'La palanca muerde el marco y el óxido cede con un gemido largo. Detrás: un cuarto seco, milagrosamente seco, con estanterías intactas. Nadie ha entrado en años.', lleva:'ev4_sotano_dentro' },
      { texto: 'Forzar la chapa con la navaja.', req:{ item:'navaja_ceramica' },
        azar:{ prob:0.6,
          exito:{ resultado:'Trabajas la rendija con la punta de cerámica, con paciencia de cirujano. El pestillo interno salta. La puerta se abre a un cuarto seco y olvidado.', lleva:'ev4_sotano_dentro' },
          fallo:{ resultado:'La hoja resbala y se astilla contra el metal. La puerta no cede y te has quedado con una navaja con menos filo. "AQUÍ NO", repites en voz baja. Quizás tenían razón.', efectos:{ fatiga:+3 } } } },
      { texto: 'Empujar con el hombro.',
        azar:{ prob:0.25,
          exito:{ resultado:'Contra todo pronóstico, el óxido cede a la tercera embestida. Entras frotándote el hombro, pero entras.', efectos:{ fatiga:+9, condicion:'costillas' }, lleva:'ev4_sotano_dentro' },
          fallo:{ resultado:'La puerta no se mueve un milímetro y tú te llevas todo el golpe. Te apartas cojeando del orgullo. Hace falta una herramienta, no fuerza bruta.', efectos:{ fatiga:+7 } } } },
      { texto: 'Respetar el aviso y seguir.',
        efectos:{ aislamiento:+1 },
        resultado:'"AQUÍ NO." Le haces caso. Hay avisos en esta ciudad que se escribieron con motivo. Sigues tu camino sin mirar atrás.' },
      { texto: 'Meterte un estimulante y reventar la puerta a embestidas.', req:{ item:'estimulante' }, pista:'necesitas un estimulante',
        efectos:{ quitaItem:'estimulante', fatiga:+7 }, azar:{ prob:0.75,
          exito:{ resultado:'Con la química rugiéndote en las venas, embistes sin sentir los golpes. Al tercer impacto el óxido cede de golpe y entras de cabeza en el cuarto seco. Cuando baja el subidón, te duele todo, pero estás dentro.', lleva:'ev4_sotano_dentro' },
          fallo:{ efectos:{ condicion:'costillas' },
            resultado:'Ni con el estimulante: la puerta aguanta más que tus costillas. Rebotas contra la chapa una y otra vez hasta que el dolor puede más que la química. Te apartas, derrotado y dolorido. Hace falta una herramienta, no furia.' } } }
    ]
  },
  'ev4_sotano_dentro': {
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'El cuarto huele a polvo y a papel viejo. En un estante, una caja metálica con cierre intacto. Dentro, algo '
         + 'envuelto en tela encerada. Quien lo guardó aquí quería que durase. Y duró.',
    opciones: [
      { texto: 'Abrir la caja.',
        azar:{ prob:0.5,
          exito:{ resultado:'Dentro hay un fajo de créditos físicos, de los de antes, todavía buenos. Alguien escondió aquí sus ahorros y no volvió a por ellos. Ahora son tuyos, con el peso que eso trae.', efectos:{ item:'creditos_sucios', disociacion:+3 } },
          fallo:{ resultado:'Dentro hay una fotografía a medio quemar y nada más. Una familia que ya no existe, guardada con más cuidado que cualquier tesoro. La coges. No sabrías decir por qué.', efectos:{ item:'foto_quemada', aislamiento:+3 } } } },
      { texto: 'Dejarla cerrada y salir.',
        efectos:{ aislamiento:+2 },
        resultado:'Vuelves a poner la caja donde estaba. Hay tumbas que es mejor no abrir, aunque no tengan cuerpo. Sales del cuarto y dejas que el óxido lo selle otra vez.' },
      { texto: 'Registrar las estanterías antes de salir.', efectos:{ item:'chatarra', fatiga:+2 },
        resultado:'Entre cajas reventadas y herramienta oxidada rescatas un puñado de chatarra que el agua nunca alcanzó. Poca cosa, pero seca y limpia, que en las Pilas ya es un lujo.' }
    ]
  },

  // ================================================================
  // EVENTO 3 — "EL CHIP QUE QUEMA"
  // Si llevas un chip de datos corrupto, una mujer de la red lo quiere.
  // Si no lo llevas, solo te ofrece un encargo vago.
  // ================================================================
  'ev4_chip_1': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Un cibercafé que es más cueva que local. Entre el humo, una mujer con media cara cubierta de implantes te '
         + 'hace un gesto. "Tú. El que rebusca." Da una calada larga. "Corre el run run de que circula un chip HELIX '
         + 'corrupto. De los que escuecen. Si lo tienes, hablamos. Si no, vete a soñar a otra parte."',
    opciones: [
      { texto: 'Entregarle el chip corrupto (160 CR).', req:{ item:'chip_datos_corrupto' },
        efectos:{ quitaItem:'chip_datos_corrupto', creditos:+160, faccion:'ia', rep:+4 },
        resultado:'Lo coge con dos dedos, como quien sostiene algo radiactivo. Lo enchufa, lee medio segundo, y algo en su cara cambia. "Esto vale más de lo que te pago. Pero te pago lo justo para que vuelvas." Sonríe sin enseñar los dientes. Acabas de hacer un contacto en el Nodo.' },
      { texto: 'Preguntar para qué lo quiere.', req:{ item:'chip_datos_corrupto' },
        efectos:{ disociacion:+3 },
        resultado:'"Para escuchar lo que HELIX no quiere que se oiga." Te sostiene la mirada. "Cada chip corrupto es una grieta en su muro. Yo colecciono grietas." No te obliga a dártelo. Las grietas, dice, hay que querer abrirlas.', lleva:'ev4_chip_1' },
      { texto: '"No llevo nada de eso."', cond:{ noItem:'chip_datos_corrupto' },
        efectos:{ aislamiento:+1 },
        resultado:'Te estudia, decide que dices la verdad, y pierde el interés tan rápido como lo encontró. "Pues cuando tengas uno, ya sabes dónde fumo." Vuelve a su pantalla. La conversación ha terminado.' }
    ]
  },

  // ================================================================
  // EVENTO 4 — "EL UMBRAL"
  // Aparece SOLO si llevas un núcleo óptico. Es el más cargado de lore:
  // el núcleo reacciona a un lugar. No vende nada. Solo decide cuánto
  // quiere mirar el jugador. (CERO no aparece: solo su sombra.)
  // ================================================================
  'ev4_umbral_1': {
    entrada: true,
    cond: { item: 'nucleo_optico' },
    img: 'EXP_CANAL_PILAS',
    texto: 'Caminas junto al canal y, sin aviso, el núcleo óptico que llevas en la mochila empieza a calentarse. No '
         + 'mucho. Lo justo para que lo notes. Frente a ti, una compuerta de mantenimiento vieja, con un lector de '
         + 'fibra muerto desde hace décadas. El núcleo zumba, bajo, como si reconociera la puerta. O como si la '
         + 'puerta lo reconociera a él.',
    opciones: [
      { texto: 'Acercar el núcleo al lector.', req:{ item:'nucleo_optico' },
        efectos:{ disociacion:+10, aislamiento:+2 },
        resultado:'El lector muerto parpadea una vez. Solo una. Y en ese parpadeo, por un instante imposible, el panel muestra una palabra que no escribiste tú: "TODAVÍA". Luego se apaga, definitivo. El núcleo se enfría en tu mano. Te quedas mirando una puerta cerrada, con la certeza incómoda de que algo, al otro lado, acaba de saber que existes.' },
      { texto: 'Guardar el núcleo y alejarte rápido.',
        efectos:{ disociacion:+4 },
        resultado:'Metes el núcleo en lo más hondo de la mochila y aprietas el paso. El calor tarda en irse. La sensación de ser observado, más. No miras atrás, pero el canal, a tu espalda, se queda demasiado callado.' },
      { texto: 'Quedarte quieto, escuchando el zumbido.',
        efectos:{ disociacion:+7, aislamiento:+3 },
        resultado:'Te quedas. Escuchas. El zumbido tiene un ritmo, y el ritmo se parece demasiado a tu propio pulso. Cuando por fin te mueves, no sabrías decir si han pasado dos minutos o veinte. La ciudad sigue donde estaba. Tú, no del todo.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
