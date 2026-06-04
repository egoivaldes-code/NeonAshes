// ============================================================
// BLOQUE JS-52 — ESCENAS DE GUION · LOTE 3 (eventos de 1 escena)
// ------------------------------------------------------------
// 20 momentos CORTOS de una sola escena para la deriva por las Pilas.
// Pensados como banco amplio para que la exploración no se agote y se
// pueda prescindir de la IA de relleno. Mismo formato que 45/47/48.
// Se carga DESPUÉS de 48_escenas_lote2.js y se fusiona en ESCENAS_GUION.
//
// Reparto: 16 con efecto (decisión + cambio de estado pequeño) y
// 4 de puro ambiente (se leen y se sigue, sin mecánica). Neutrales:
// la carga de facción se reserva para las cadenas de misión.
//
// Solo se usan imágenes, items y condiciones que YA existen en el
// proyecto, para no depender de assets nuevos.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ====================================================================
  // === 16 EVENTOS CON EFECTO ==========================================
  // ====================================================================

  // ---- 1 — El niño y la máquina expendedora ----
  'ev1e_expendedora': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'Un crío golpea una máquina expendedora que se ha tragado su crédito. No llora. Solo golpea, '
         + 'metódico, como quien ya sabe que el mundo no devuelve lo que se queda.',
    opciones: [
      { texto: 'Darle un golpe seco en el lateral, donde sabes.', efectos:{ aislamiento:-3 },
        resultado:'La máquina suelta una lata y, de propina, la del crédito atascado. El niño coge las dos y se va sin mirarte. Pero algo en tu pecho se afloja un poco.' },
      { texto: 'Pagarle otra cosa de tu bolsillo. (10 créditos)', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10, aislamiento:-4 },
        resultado:'Le compras una barrita. La coge con desconfianza, la inspecciona, asiente. En las Pilas, aceptar algo gratis es un acto de valor.' },
      { texto: 'Seguir tu camino.', efectos:{ aislamiento:+2 },
        resultado:'Pasas de largo. El sonido de los golpes te acompaña media calle más, hasta que la lluvia lo borra.' }
    ]
  },

  // ---- 2 — El vendedor de paraguas rotos ----
  'ev1e_paraguas': {
    entrada: true,
    img: 'SECTOR7_CENTRAL_PLAZA',
    texto: 'Un hombre vende paraguas bajo un alero. Todos están rotos en algún punto: una varilla, una tela '
         + 'rasgada. "Contra la lluvia ácida no hay paraguas entero que valga", dice. "Solo más o menos roto."',
    opciones: [
      { texto: 'Comprar el menos roto. (15 créditos)', req:{ creditosMin:15 }, pista:'15 créditos',
        efectos:{ creditos:-15, fatiga:-2 },
        resultado:'Eliges uno al que solo le falta una varilla. Te cubre lo justo. Caminas un rato sin sentir la lluvia mordiéndote el cuello. Es más de lo que esperabas del día.' },
      { texto: '"¿Y por qué no los arreglas?"', efectos:{ disociacion:+2 },
        resultado:'"¿Arreglar?" Se ríe sin ganas. "Aquí nada se arregla. Se aguanta hasta que se tira." Sigues camino con la frase pegada a la nuca.' },
      { texto: 'Negar con la cabeza y pasar.',
        resultado:'Sigues bajo la lluvia, a cuerpo descubierto. Como casi todos.' }
    ]
  },

  // ---- 3 — Chatarra en el desagüe ----
  'ev1e_desague': {
    entrada: true,
    img: 'SERVICE_CONDUIT_RAMP_E',
    texto: 'Una rejilla de desagüe ha atrapado un revoltijo de metal arrastrado por la lluvia. Cables, una '
         + 'carcasa, algo que pudo ser una herramienta. Meter la mano ahí dentro no es agradable.',
    opciones: [
      { texto: 'Rebuscar a fondo, aunque te ensucies.', efectos:{ item:'chatarra', fatiga:+3 },
        resultado:'Sacas un puñado de metal aprovechable. Las manos te quedan negras y con un olor que no se irá en días, pero la chatarra es chatarra.' },
      { texto: 'Coger solo lo de encima.', efectos:{ item:'chatarra' },
        resultado:'Recoges lo que asoma sin hundir la mano del todo. Menos botín, pero conservas la dignidad. Más o menos.' },
      { texto: 'Dejarlo. No es tu día de hurgar en desagües.', efectos:{ aislamiento:+1 },
        resultado:'Sigues camino. Detrás, la lluvia sigue empujando metal hacia la rejilla, paciente.' }
    ]
  },

  // ---- 4 — La apuesta de los dados ----
  'ev1e_dados': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Tres tipos juegan a los dados sobre una caja. Uno te mira. "¿Te atreves? Una tirada. Doblas o '
         + 'pierdes." Hueles el truco a distancia, pero el bote sobre la caja es real.',
    opciones: [
      { texto: 'Apostar. (20 créditos)', req:{ creditosMin:20 }, pista:'20 créditos',
        efectos:{ creditos:-20 }, azar:{ prob:0.4,
          exito:{ resultado:'Los dados caen a tu favor. El tipo aprieta la mandíbula y te paga sin decir nada. Recoges el doble y te vas antes de que cambie de idea.', efectos:{ creditos:+40 } },
          fallo:{ resultado:'Los dados ruedan mal. Sonríen los tres a la vez, ensayados. Te marchas más ligero de cartera y con una lección que ya conocías.', efectos:{ disociacion:+2 } } } },
      { texto: '"Buen intento." Y seguir.', efectos:{ aislamiento:+1 },
        resultado:'Te alejas. Oyes cómo buscan otro pardillo a tu espalda. Esta vez no fuiste tú.' }
    ]
  },

  // ---- 5 — El gato de tres patas ----
  'ev1e_gato': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'Un gato flaco de tres patas te observa desde una tubería. No huye. En las Pilas hasta los animales '
         + 'han aprendido que correr cansa más de lo que salva.',
    opciones: [
      { texto: 'Compartir algo de comer con él.', efectos:{ hambre:+4, aislamiento:-5 },
        resultado:'Le dejas un trozo de lo que llevas. Come sin prisa, vigilándote. Cuando termina, se queda. Por un rato no estás solo, y es un rato que vale.' },
      { texto: 'Mirarlo un momento y seguir.', efectos:{ aislamiento:-1 },
        resultado:'Os sostenéis la mirada. Luego cada uno a lo suyo. Dos supervivientes que se reconocen y no se deben nada.' },
      { texto: 'Espantarlo.', efectos:{ aislamiento:+2 },
        resultado:'Das un paso brusco. Cojea hasta la sombra sin alarma, como si ya lo esperara. Te quedas con un mal sabor que no sabes nombrar.' }
    ]
  },

  // ---- 6 — Pintada fresca ----
  'ev1e_pintada': {
    entrada: true,
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Alguien ha pintado en el muro, con letra temblorosa y pintura aún húmeda: "CERO NOS ESCUCHA". '
         + 'Debajo, más pequeño, otra mano ha tachado el "NOS" y escrito "ME".',
    opciones: [
      { texto: 'Tocar la pintura. Ver si mancha.', efectos:{ disociacion:+5 },
        resultado:'El dedo se te tiñe de rojo oscuro. Fresca. Quien la escribió sigue cerca. Te miras la yema manchada y, por un segundo, juras que el muro respira.' },
      { texto: 'Tomar nota mental y alejarte.', efectos:{ disociacion:+2 },
        resultado:'Te grabas la frase y sigues. Esa noche, antes de dormir, volverás a oírla en tu cabeza con voz que no es la tuya.' },
      { texto: 'Pasar sin leerla del todo.', efectos:{ aislamiento:+1 },
        resultado:'Apartas la vista a propósito. Hay cosas que es mejor no terminar de leer en las Pilas.' }
    ]
  },

  // ---- 7 — La cola sin motivo ----
  'ev1e_cola': {
    entrada: true,
    img: 'SECTOR7_CENTRAL_PLAZA',
    texto: 'Una cola larguísima se pega a una pared. Nadie sabe para qué es. "Reparten algo", dice una mujer. '
         + '"¿El qué?" "No sé. Pero si hay cola, algo darán." La lógica de los hambrientos.',
    opciones: [
      { texto: 'Ponerte en la cola y esperar.', efectos:{ fatiga:+6, hambre:-5 },
        resultado:'Esperas casi una hora. Al final reparten raciones de proteína sintética caducada pero comestible. Te llevas una. Las piernas te pesan, pero el estómago calla.' },
      { texto: 'Preguntar al de delante y decidir luego.', efectos:{ aislamiento:-2 },
        resultado:'Charláis un momento. No averiguas qué reparten, pero el intercambio de quejas sienta casi tan bien como la comida. Casi.' },
      { texto: 'No tienes tiempo para colas ciegas.', efectos:{ aislamiento:+1 },
        resultado:'Sigues. A tu espalda la cola crece sola, alimentándose de su propia existencia.' }
    ]
  },

  // ---- 8 — El terminal público que aún funciona ----
  'ev1e_terminal_pub': {
    entrada: true,
    img: 'FREE_TRANSIT_HUB',
    texto: 'Un terminal público parpadea, milagrosamente vivo entre una hilera de pantallas muertas. Ofrece '
         + 'consultar tu saldo, las noticias, o "un mensaje del archivo". Esa última opción no estaba ayer.',
    opciones: [
      { texto: 'Abrir "un mensaje del archivo".', efectos:{ disociacion:+6 },
        resultado:'La pantalla muestra una foto tuya que no recuerdas que te hicieran, y una fecha futura. Luego se apaga sola. Te quedas mirando tu reflejo en el cristal negro.' },
      { texto: 'Consultar tu saldo, nada más.',
        resultado:'El número de siempre, deprimente y exacto. Cierras. Algunas pantallas es mejor usarlas para lo aburrido.' },
      { texto: 'No fiarte y alejarte.', efectos:{ aislamiento:+1 },
        resultado:'Das un paso atrás. El terminal sigue parpadeando esa opción que no debería existir, esperando a otro.' }
    ]
  },

  // ---- 9 — Mercadillo de recuerdos ----
  'ev1e_recuerdos': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Una anciana vende objetos sobre una manta: relojes parados, fotos de desconocidos, juguetes de un '
         + 'plástico que ya no se fabrica. "Recuerdos de otros", dice. "Más baratos que los propios."',
    opciones: [
      { texto: 'Comprar una foto al azar. (8 créditos)', req:{ creditosMin:8 }, pista:'8 créditos',
        efectos:{ creditos:-8, item:'foto_quemada', disociacion:+3 },
        resultado:'Coges una foto medio quemada de gente que sonríe en un sitio con sol. La guardas. No sabes por qué. Quizá porque alguien debería seguir mirándola.' },
      { texto: '"¿De dónde saca todo esto?"', efectos:{ aislamiento:-2 },
        resultado:'"De los que ya no vuelven a por ello." Lo dice sin pena. Asientes despacio y te marchas con el peso de todos esos dueños ausentes.' },
      { texto: 'Mirar y seguir.', efectos:{ disociacion:+1 },
        resultado:'Pasas la vista por la manta. Tantas vidas reducidas a baratijas. Sigues antes de empezar a pensar en la tuya.' }
    ]
  },

  // ---- 10 — El charco eléctrico ----
  'ev1e_charco': {
    entrada: true,
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Un cable caído chisporrotea dentro de un charco que ocupa todo el pasillo. La única ruta de paso. '
         + 'Al fondo, lo que buscabas explorar. Cerca, una tabla podría servir de puente improvisado.',
    opciones: [
      { texto: 'Cruzar rápido por el borde seco.', azar:{ prob:0.65,
          exito:{ resultado:'Te pegas a la pared y pasas pisando los pocos centímetros secos. El cable chasquea a tu lado pero no te alcanza. Al otro lado, sueltas el aire que no sabías que aguantabas.', efectos:{ fatiga:+2 } },
          fallo:{ resultado:'Un pie resbala. El calambre te sube por la pierna como un latigazo blanco antes de que saltes hacia atrás. Te quedas temblando, lejos del charco. No vale la pena.', efectos:{ condicion:'mareado', fatiga:+8 } } } },
      { texto: 'Colocar la tabla y cruzar despacio.', efectos:{ fatiga:+4 },
        resultado:'Tardas, pero montas un puente seguro sobre el charco. Cruzas sin sustos. La paciencia, en las Pilas, también es una forma de coraje.' },
      { texto: 'Buscar otra ruta.', efectos:{ fatiga:+3, aislamiento:+1 },
        resultado:'Das media vuelta y rodeas por donde puedes. Más camino, menos riesgo. Llegas igual, solo que más cansado.' }
    ]
  },

  // ---- 11 — La predicadora muda ----
  'ev1e_predicadora': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Una mujer predica en una esquina, pero no le sale voz: solo mueve los labios con fervor absoluto, '
         + 'señalando al cielo de hormigón. Un cartel a sus pies pide créditos "para recuperar la palabra".',
    opciones: [
      { texto: 'Dejarle algo. (5 créditos)', req:{ creditosMin:5 }, pista:'5 créditos',
        efectos:{ creditos:-5, aislamiento:-3 },
        resultado:'Sueltas unas monedas. Ella te mira con una gratitud tan honda que casi resulta insoportable. Te vas rápido, pero el gesto te dura.' },
      { texto: 'Intentar entender qué dice.', efectos:{ disociacion:+4 },
        resultado:'Le lees los labios un rato. Crees descifrar la palabra "vuelve", repetida. Te alejas sin saber si te lo decía a ti. Esa duda no se va en todo el día.' },
      { texto: 'Pasar de largo.',
        resultado:'Sigues. Su sermón silencioso continúa a tu espalda, dirigido a nadie y a todos.' }
    ]
  },

  // ---- 12 — El estimulante tirado ----
  'ev1e_estimulante': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Bajo una mesa de un cibercafé medio vacío, un blíster de estimulante barato sin abrir. Alguien lo '
         + 'dejó caer con prisa. Nadie lo reclama. El tipo del mostrador no ha visto nada, deliberadamente.',
    opciones: [
      { texto: 'Cogerlo discretamente.', efectos:{ item:'estimulante_barato', disociacion:+2 },
        resultado:'Lo deslizas en el bolsillo sin que nadie reaccione. Un golpe de suerte pequeño. En las Pilas, eso ya es un buen día.' },
      { texto: 'Preguntar en voz alta de quién es.', efectos:{ aislamiento:-2 },
        resultado:'Nadie responde, pero un par de cabezas se giran con respeto raro, como si la honradez fuera una rareza digna de verse. Te vas con las manos vacías y algo intacto.' },
      { texto: 'Dejarlo donde está.',
        resultado:'No es tuyo y no lo quieres. Sales del cibercafé. A tu espalda, otra mano ya se acerca a la mesa.' }
    ]
  },

  // ---- 13 — El cobrador de deudas ajenas ----
  'ev1e_cobrador': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'Un hombre con chaqueta cara te corta el paso. "¿Eres el del 19-A?" No esperas a aclararlo: en las '
         + 'Pilas, que te confundan con un deudor puede salir caro. Tiene los nudillos llenos de anillos pesados.',
    opciones: [
      { texto: '"Te equivocas de persona." Firme.', azar:{ prob:0.6,
          exito:{ resultado:'Le sostienes la mirada sin parpadear. Te estudia, gruñe, se aparta. "...Vale. Perdona." Pasas con el corazón a mil pero entero.', efectos:{ fatiga:+3 } },
          fallo:{ resultado:'No le convences. Te empuja contra la pared "solo para asegurarse" y te cachea con prisa antes de soltarte, decepcionado. Sales magullado y humillado.', efectos:{ condicion:'costillas', disociacion:+3 } } } },
      { texto: 'Soltarle algo para que te deje. (25 créditos)', req:{ creditosMin:25 }, pista:'25 créditos',
        efectos:{ creditos:-25, aislamiento:+2 },
        resultado:'"Por las molestias", dices, y le pones unos créditos en la mano. Los mira, asiente, te deja ir. Comprar tranquilidad es caro, pero hoy te lo puedes permitir.' },
      { texto: 'Echar a correr.', efectos:{ fatiga:+10 },
        resultado:'Sales disparado por el callejón. No te sigue: no merecías tanto esfuerzo. Llegas lejos, sin aliento, con la lección de que correr siempre cuesta caro.' }
    ]
  },

  // ---- 14 — El músico del túnel ----
  'ev1e_musico': {
    entrada: true,
    img: 'DOCK_ACCESS_TUNNEL',
    texto: 'En la boca de un túnel, un viejo toca un instrumento que no reconoces, mitad cuerda mitad circuito. '
         + 'La melodía rebota en el hormigón y, por un momento, las Pilas suenan menos a máquina y más a algo vivo.',
    opciones: [
      { texto: 'Quedarte a escuchar un tema entero.', efectos:{ fatiga:-3, aislamiento:-4 },
        resultado:'Te apoyas en la pared y dejas que la música te lave el día. Cuando acaba, el viejo asiente sin abrir los ojos. No hace falta más. Sigues más ligero.' },
      { texto: 'Dejarle créditos por la música. (10 créditos)', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10, aislamiento:-5 },
        resultado:'Las monedas tintinean en su lata. Sin dejar de tocar, inclina la cabeza. Te vas con la melodía pegada, tarareándola sin darte cuenta media hora después.' },
      { texto: 'Pasar de largo, con prisa.', efectos:{ aislamiento:+1 },
        resultado:'Cruzas el túnel rápido. La música se apaga a tu espalda, nota a nota, hasta que solo queda el goteo del agua.' }
    ]
  },

  // ---- 15 — La puerta entreabierta ----
  'ev1e_puerta': {
    entrada: true,
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Una puerta de almacén ha quedado entreabierta, sin candado. Dentro, oscuridad y formas que podrían '
         + 'ser cajas. O no. En las Pilas, una puerta abierta es una invitación o una trampa. Nunca ambas claras.',
    opciones: [
      { texto: 'Entrar a echar un vistazo rápido.', azar:{ prob:0.55,
          exito:{ resultado:'Entre el polvo encuentras material abandonado y aprovechable. Cargas lo que puedes y sales antes de tentar a la suerte.', efectos:{ item:'chatarra', fatiga:+3 } },
          fallo:{ resultado:'Algo se mueve en la oscuridad: un okupa que dormía, o algo peor. No te quedas a averiguarlo. Sales tropezando, con un corte en la mano contra el marco.', efectos:{ condicion:'herida_brazo_d_leve', fatiga:+5 } } } },
      { texto: 'Asomarte sin entrar.', efectos:{ disociacion:+2 },
        resultado:'Metes solo la cabeza. La oscuridad no te devuelve nada salvo un olor a cerrado y a tiempo detenido. Cierras la puerta tú mismo y sigues.' },
      { texto: 'No tocar lo que no entiendes.', efectos:{ aislamiento:+1 },
        resultado:'Dejas la puerta como está y sigues camino. Algunas curiosidades cuestan demasiado en este sitio.' }
    ]
  },

  // ---- 16 — El analgésico del moribundo ----
  'ev1e_analgesico': {
    entrada: true,
    img: 'TREATMENT_WING',
    texto: 'Un hombre sentado contra la pared te tiende un frasco de analgésico HELIX, sellado. "Cógelo", '
         + 'jadea. "A mí ya no me sirve. Que le sirva a alguien." No pide nada a cambio. Eso, aquí, asusta.',
    opciones: [
      { texto: 'Aceptarlo y quedarte un momento con él.', efectos:{ item:'analgesico_helix', aislamiento:-4, disociacion:+3 },
        resultado:'Coges el frasco y te sientas a su lado un rato, sin hablar. Cuando te levantas, él tiene los ojos cerrados y la cara en paz. No miras atrás. Algunas deudas se pagan quedándose.' },
      { texto: 'Aceptarlo y seguir, agradecido.', efectos:{ item:'analgesico_helix', disociacion:+2 },
        resultado:'Coges el frasco, le aprietas el hombro y sigues. El gesto te pesa el resto del día, pero el analgésico puede salvarte la vida más adelante.' },
      { texto: 'Rechazarlo. No quieres deber nada a un muerto.', efectos:{ aislamiento:+3 },
        resultado:'Niegas con la cabeza y te vas. Su mano tendida se queda en el aire a tu espalda. Esa imagen volverá a ti, sin avisar, durante días.' }
    ]
  },

  // ====================================================================
  // === 4 EVENTOS DE PURO AMBIENTE (sin efecto, solo atmósfera) ========
  // ====================================================================

  // ---- A1 — La lluvia sobre el neón ----
  'ev1a_lluvia_neon': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'Te detienes bajo un letrero de neón medio fundido que tiñe la lluvia de rosa y azul. Las gotas '
         + 'caen a través de la luz como ceniza de colores. Por un instante, las Pilas casi parecen hermosas. '
         + 'Casi. Luego una rata cruza el charco y rompe el reflejo, y el momento se va con ella.',
    opciones: [
      { texto: 'Seguir caminando.',
        resultado:'Sigues. El neón queda atrás, parpadeando su rosa enfermo sobre nadie.' }
    ]
  },

  // ---- A2 — El anuncio que te conoce ----
  'ev1a_anuncio': {
    entrada: true,
    img: 'SECTOR7_CENTRAL_PLAZA',
    texto: 'Un panel publicitario de HELIX recita su eslogan a la plaza vacía: "Tu futuro, asegurado." La voz '
         + 'es cálida, materna, perfecta. Habla para nadie con la misma dedicación con que hablaría para '
         + 'millones. Te quedas un segundo escuchándola prometer un mañana que ninguno de los dos cree.',
    opciones: [
      { texto: 'Apartar la vista y continuar.',
        resultado:'Sigues. La voz repite el eslogan a tu espalda, incansable, para la plaza que sigue vacía.' }
    ]
  },

  // ---- A3 — La ventana iluminada ----
  'ev1a_ventana': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'En lo alto de un bloque, una sola ventana iluminada entre mil apagadas. Una silueta se mueve dentro, '
         + 'despacio, haciendo algo doméstico e invisible. Cenando, quizá. O esperando a alguien que no vendrá. '
         + 'Te descubres mirándola más de lo razonable, como si esa vida ajena pudiera prestarte calor.',
    opciones: [
      { texto: 'Bajar la mirada y seguir tu camino.',
        resultado:'Apartas los ojos. Cuando vuelves a mirar, la ventana ya está oscura. Sigues bajo la lluvia, un poco más solo que antes.' }
    ]
  },

  // ---- A4 — El silencio de las tres ----
  'ev1a_silencio': {
    entrada: true,
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'De pronto, durante unos segundos imposibles, todo calla a la vez: las grúas se detienen, los anuncios '
         + 'hacen una pausa, hasta la lluvia parece dudar. Las Pilas contienen el aliento sin motivo. Es la clase '
         + 'de silencio que da más miedo que el ruido, porque sugiere que algo, en alguna parte, está escuchando.',
    opciones: [
      { texto: 'Esperar a que el mundo vuelva a respirar.',
        resultado:'Tan súbito como llegó, el silencio se rompe: las grúas reanudan, los anuncios vuelven, la lluvia arrecia. Sigues, fingiendo que no lo has notado. Como todos.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
