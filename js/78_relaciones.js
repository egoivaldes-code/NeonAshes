// ============================================================
// BLOQUE JS-78 — RELACIONES / CONTACTOS ÍNTIMOS (v0.141)
// ------------------------------------------------------------
// Eventos de explorar/deriva que SOLO salen de noche (cond.franja):
// te cruzas con una fiesta, conoces a alguien, charláis con el chat de
// burbujas generalizado (77_conversaciones.js), y —si quieres— pasáis
// la noche juntos. A partir de ahí queda como CONTACTO (conocer +
// vínculo, 42_npcs.js) y vuelve a aparecer otras noches para quedar.
//
// Tono Character Bible / guía de escritura: íntimo, contenido,
// melancólico. Personajes ADULTOS. La intimidad se sugiere y se funde
// a negro; nunca explícita. Lo que importa es lo que NO se dice.
//
// Reutiliza: conocer / vinculo (efectos), cond.npcConocido / vinculoMin
// / franja, y op.conversa para abrir la charla. Cero UI nueva.
// ============================================================

// ---- PERFILES DE CONVERSACIÓN (chat de burbujas) -----------
(function(){
  if(!window.Conversacion || typeof Conversacion.registrar !== 'function') return;

  // ===== LENA — trabaja de noche, lengua afilada, sola por elección =====
  Conversacion.registrar('lena_fiesta', {
    nombre:'LENA',
    arbol:[
      /*0*/ { npc:'No bebas lo de la mesa de la izquierda. Lo cortan con algo que te deja viendo colores tres días. —Ni te mira; mira la pista—. Pareces nuevo en esto de fingir que te diviertes.',
        opciones:[
          { txt:'"¿Y tú no finges?"', ir:1 },
          { txt:'[Quedarte a su lado, en silencio.]', s:true, ir:2 },
          { txt:'"¿Vienes mucho por aquí?"', ir:3 }
        ]},
      /*1*/ { npc:'Yo ya no finjo nada. Vengo a mirar. La gente, cuando cree que nadie la observa, baja la cara que se pone para sobrevivir. Es lo más honesto que se ve en las Pilas.',
        opciones:[ { txt:'"¿Y qué ves en mí?"', ir:4 } ] },
      /*2*/ { npc:'—Tarda en hablar. Le gusta que no llenes el hueco—. Bien. La mayoría aquí habla para no oírse. Tú no. Eso o no tienes nada que decir, o tienes demasiado.',
        opciones:[ { txt:'"Lo segundo, casi siempre."', ir:4 } ] },
      /*3*/ { npc:'Cuando el turno me deja el cuerpo demasiado despierto para dormir y demasiado roto para nada útil. O sea, casi siempre. —Media sonrisa sin ganas—. Glamuroso, ¿eh?',
        opciones:[ { txt:'"Suena a soledad con música."', ir:4 } ] },
      /*4*/ { npc:'—Por fin te mira. Tiene los ojos de quien ha calculado el riesgo de todo, incluido este—. Vives cerca o lejos. Yo, a cuatro calles. Y la noche todavía es larga y fea ahí fuera.',
        opciones:[
          { txt:'"Cuatro calles no es nada."', ir:5 },
          { txt:'"Solo he venido a escapar un rato del ruido de mi cabeza."', ir:5 }
        ]},
      /*5*/ { npc:'—Apura el vaso, sin prisa—. Entonces ya nos hemos entendido, más o menos. El resto se decide en la puerta, no aquí dentro con esta música de mierda. Tú decides si me sigues.', fin:true }
    ]
  });

  Conversacion.registrar('lena_quedar', {
    nombre:'LENA',
    arbol:[
      /*0*/ { npc:'Mira quién aparece. —Te deja pasar sin preguntar—. He hecho café del de verdad. Robado del turno, pero de verdad. Siéntate antes de que me arrepienta de la hospitalidad.',
        opciones:[
          { txt:'"¿Día duro?"', ir:1 },
          { txt:'"No tenías que esperarme."', ir:2 },
          { txt:'[Sentarte, sin más.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'Como todos. Hoy una clienta lloró en mi turno por algo que no me contó y que entendí igual. —Se encoge de hombros—. A veces este sitio te gasta despacio. Por eso está bien tener a quién no contarle nada en concreto.',
        opciones:[ { txt:'"Para eso estoy."', ir:3 } ] },
      /*2*/ { npc:'No te esperaba. Dejé la puerta sin echar, que es distinto. —No te mira al decirlo—. No le des más vueltas de las que tiene.',
        opciones:[ { txt:'"No se las doy."', ir:3 } ] },
      /*3*/ { npc:'—El café humea entre los dos. Fuera llueve. Por una vez, ninguno de los dos tiene prisa por estar en otro sitio—. Quédate el rato que quieras. La noche, aquí dentro, dura menos.', fin:true }
    ]
  });

  // ===== REI — correo de noche, músico a ratos, cálido y de paso =====
  Conversacion.registrar('rei_fiesta', {
    nombre:'REI',
    arbol:[
      /*0*/ { npc:'—Afina una guitarra vieja sin enchufar, por el gusto del gesto—. ¿Pides algo? Toco lo que sea menos lo que está de moda. Lo de moda lo toca cualquiera; yo solo sé tocar lo que duele un poco.',
        opciones:[
          { txt:'"Toca algo que duela, entonces."', ir:1 },
          { txt:'"¿Vives de esto?"', ir:2 },
          { txt:'[Escucharle sin pedir nada.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'—Toca cuatro acordes lentos que llenan el rincón y callan a los de al lado—. Esta es de antes de las cúpulas, dicen. De cuando la gente le ponía nombre a las cosas que perdía. Ya nadie tiene tiempo de eso.',
        opciones:[ { txt:'"Tú sí."', ir:4 } ] },
      /*2*/ { npc:'¿Vivir? Reparto paquetes de noche para comer y toco para acordarme de por qué como. —Sonríe sin amargura—. No es un plan. Es un equilibrio. Distinto.',
        opciones:[ { txt:'"Suena mejor que la mayoría de planes."', ir:4 } ] },
      /*3*/ { npc:'—Te deja escuchar hasta el final, y al terminar te mira como sorprendido de que sigas ahí—. Poca gente se queda hasta el final de una canción triste. Casi todos se van en el segundo estribillo.',
        opciones:[ { txt:'"Los finales tristes son los honestos."', ir:4 } ] },
      /*4*/ { npc:'—Guarda la guitarra en su funda con cuidado, como se guarda algo vivo—. Acabo aquí en nada. No tengo casa que presumir, solo un cuarto con buena acústica y peor calefacción. Pero la compañía la pone quien viene. Tú dirás.', fin:true }
    ]
  });

  Conversacion.registrar('rei_quedar', {
    nombre:'REI',
    arbol:[
      /*0*/ { npc:'—Abre la puerta con la guitarra ya en la mano—. Justo iba a tocar para las paredes. Las paredes son buen público pero malas conversadoras. Pasa, anda.',
        opciones:[
          { txt:'"¿Una nueva?"', ir:1 },
          { txt:'"He pensado en ti."', ir:2 },
          { txt:'[Quitarte el abrigo mojado y sentarte.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'A medias. Las mías siempre están a medias; las termino cuando hay alguien para quien terminarlas. —Rasguea un comienzo—. Esta no tenía final hasta hace un momento.',
        opciones:[ { txt:'"Tócame ese final."', ir:3 } ] },
      /*2*/ { npc:'—Se queda quieto un segundo, la púa parada sobre las cuerdas—. Eso, en boca de alguien de paso como tú o como yo, vale más que un te quiero de los de quedarse. Lo sé porque yo tampoco los digo.',
        opciones:[ { txt:'"Entonces no lo digamos."', ir:3 } ] },
      /*3*/ { npc:'—Empieza a tocar, bajito, solo para ti. Fuera, las Pilas siguen siendo las Pilas. Aquí dentro, durante una canción entera, no—. Quédate. La calefacción es mala, pero yo no.', fin:true }
    ]
  });
})();

// ---- ESCENAS (eventos nocturnos + quedadas) ----------------
(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ===================== LENA ==============================
  'rel_lena_fiesta': {
    entrada:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcNoConocido:'lena' },
    img:'EXP_CALLEJON_SUENOS',
    texto:'En una azotea reconvertida en local, alguien da una fiesta: luces de colores robadas a un anuncio, música que retumba en el pecho, gente buscando olvidar el turno de mañana. '
        + 'Apoyada en la barandilla, lejos del barullo, una mujer mira la pista con un vaso que no se acaba. No parece estar esperando a nadie. Parece estar esperando, sin más.',
    opciones:[
      { texto:'Acercarte a hablar con ella.', conversa:'lena_fiesta', lleva:'rel_lena_tras' },
      { texto:'Quedarte en la barra, observando la fiesta.', efectos:{ aislamiento:-2, fatiga:+2 },
        resultado:'Te quedas al margen, bebiendo despacio, mirando bailar a gente que mañana madruga. Hay una melancolía cómoda en las fiestas ajenas. Cuando te vas, la mujer de la barandilla ya no está. Las Pilas están llenas de personas que casi conoces.' },
      { texto:'No es tu noche. Marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Bajas de la azotea antes de que la música se te meta en sitios que prefieres tener vacíos. La noche fuera está fría y honesta. A veces es lo que uno necesita más que compañía.' }
    ]
  },
  'rel_lena_tras': {
    img:'EXP_CALLEJON_SUENOS',
    texto:'La fiesta se deshincha como todas, de golpe y a destiempo. Lena apaga el cigarrillo contra la barandilla y te mira con esa calma suya que lo ha calculado todo. La puerta de la azotea, o cuatro calles hasta su casa. '
        + 'No hay promesas en su cara. Solo una noche que puede ser un poco menos sola para los dos.',
    opciones:[
      { texto:'Irte con ella.',
        efectos:{ conocer:'lena', vinculo:{ id:'lena', mas:1 }, aislamiento:-8, fatiga:+5, marcaVisto:'lena_intima' },
        resultado:'Su casa es pequeña y ordenada como la de alguien que no deja que el caos de fuera entre del todo. No hace falta hablar mucho. Os encontráis en esa franqueza cansada de dos adultos que ya no esperan que nadie los salve, solo que no los dejen solos esta noche concreta. Al amanecer, ella te sirve café sin preguntar si te quedas. No hace falta. Os habéis caído bien, que en las Pilas es casi un milagro. [Lena queda como contacto.]' },
      { texto:'Despedirte con un cigarro y nada más.',
        efectos:{ conocer:'lena', vinculo:{ id:'lena', mas:1 }, aislamiento:-3 },
        resultado:'Compartís un último cigarro en la barandilla, sin tocar el tema de la puerta. "Otra noche, quizá", dice ella, y no suena a cortesía. Te apunta dónde encontrarla. A veces conocer a alguien, de verdad, empieza por saber irse a tiempo. [Lena queda como contacto.]' }
    ]
  },
  'rel_lena_quedar': {
    entrada:true, repetible:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcConocido:'lena', vinculoMin:{ id:'lena', n:1 } },
    img:'EXP_ALMACEN_OKUPA',
    texto:'Pasas cerca de las cuatro calles que separan tu vida de la de Lena. Su ventana tiene luz: turno libre, o insomnio, da igual. En las Pilas, una ventana encendida que sabes de quién es ya es algo a lo que volver.',
    opciones:[
      { texto:'Subir a charlar un rato.', conversa:'lena_quedar', lleva:'rel_lena_quedar_fin' },
      { texto:'Pasar la noche con ella.',
        efectos:{ vinculo:{ id:'lena', mas:1 }, aislamiento:-7, fatiga:+4 },
        resultado:'No hay novedad y eso es justo lo bueno: el peso conocido de alguien al lado, la lluvia contra el cristal, el lujo enorme de no tener que explicarse. Al irte, ninguno dice cuándo será la próxima. Los dos sabéis que la habrá.' },
      { texto:'Solo querías ver la luz encendida. Seguir.', efectos:{ aislamiento:-3 },
        resultado:'No subes. A veces basta con saber que ahí dentro hay alguien que te abriría. Sigues caminando un poco menos solo, con la ventana de Lena calentándote la nuca un par de calles.' }
    ]
  },
  'rel_lena_quedar_fin': {
    img:'EXP_ALMACEN_OKUPA',
    texto:'El café se enfría mientras habláis de nada y de todo, que con Lena es lo mismo. No hay declaraciones. Hay dos sillas, una ventana con lluvia y la sensación rara de estar, por un rato, en un sitio que se parece a casa.',
    opciones:[
      { texto:'Quedarte hasta que escampe.', efectos:{ vinculo:{ id:'lena', mas:1 }, aislamiento:-6, fatiga:-2 },
        resultado:'Te quedas hasta que la lluvia afloja, que en las Pilas es casi nunca, así que te quedas mucho. Cuando sales, Lena no se despide en la puerta; se queda en la ventana, y tú no miras atrás, porque los dos sabéis que mirar atrás sería pedir algo que ninguno promete. Pero la próxima vez subirás antes.' }
    ]
  },

  // ===================== REI ===============================
  'rel_rei_fiesta': {
    entrada:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcNoConocido:'rei' },
    img:'EXP_COMEDOR_SECTORB',
    texto:'En una cantina con más humo que luz, alguien toca una guitarra acústica en un rincón, contra todo pronóstico y contra el ruido. La gente habla por encima, pero unos pocos escuchan. '
        + 'El músico no parece tocar para ellos ni para nadie: toca como quien reza bajito. Cuando termina una canción triste, levanta la vista y, por un segundo, parece buscar a quien se haya quedado hasta el final.',
    opciones:[
      { texto:'Acercarte al músico.', conversa:'rei_fiesta', lleva:'rel_rei_tras' },
      { texto:'Escuchar desde la barra y luego irte.', efectos:{ aislamiento:-3, fatiga:+1 },
        resultado:'Te quedas a un par de canciones, lo justo para que algo se te afloje en el pecho, y te vas antes de que se afloje del todo. En la calle, la melodía te sigue media manzana. Algunas noches, eso ya es suficiente compañía.' },
      { texto:'No estás para música esta noche. Marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Sales de la cantina. Hay noches en que la música honesta duele más que el silencio, y esta es una de ellas. Caminas hacia tu cuarto con tu propio ruido por toda banda sonora.' }
    ]
  },
  'rel_rei_tras': {
    img:'EXP_COMEDOR_SECTORB',
    texto:'Rei recoge la guitarra cuando la cantina empieza a vaciarse. No tiene prisa, o finge no tenerla, que en él parece lo mismo. "Mi cuarto está a dos calles y la noche es de las que no apetece pasar mirando el techo", dice, '
        + 'sin que suene a más de lo que es: una oferta de no estar solos un rato.',
    opciones:[
      { texto:'Irte con él.',
        efectos:{ conocer:'rei', vinculo:{ id:'rei', mas:1 }, aislamiento:-8, fatiga:+5, marcaVisto:'rei_intimo' },
        resultado:'Su cuarto es un colchón, una estufa que apenas tira y guitarras colgadas como cuadros. Toca un poco, luego no. La cercanía es fácil, sin el peso de prometerse nada: dos personas de paso que deciden coincidir una noche entera a propósito. Al amanecer te toca una melodía a medias y te dice que la termina para la próxima. Te marchas con una canción inacabada en la cabeza. [Rei queda como contacto.]' },
      { texto:'Despedirte con la canción todavía sonando dentro.',
        efectos:{ conocer:'rei', vinculo:{ id:'rei', mas:1 }, aislamiento:-3 },
        resultado:'"Otra noche te toco el final", dice, y te apunta dónde vive con un trozo de púa rota a modo de seña. No subes hoy. Algunas compañías saben mejor si se dejan madurar. Te vas con la guitarra de Rei sonándote en alguna parte. [Rei queda como contacto.]' }
    ]
  },
  'rel_rei_quedar': {
    entrada:true, repetible:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcConocido:'rei', vinculoMin:{ id:'rei', n:1 } },
    img:'EXP_CIBERCAFE',
    texto:'De una ventana a ras de calle sale música: una guitarra que ya reconoces sin querer. Rei está despierto, tocando para nadie. Sabes que, si llamas, dejará de tocar para las paredes y tocará un rato para ti.',
    opciones:[
      { texto:'Llamar y subir a charlar.', conversa:'rei_quedar', lleva:'rel_rei_quedar_fin' },
      { texto:'Pasar la noche con él.',
        efectos:{ vinculo:{ id:'rei', mas:1 }, aislamiento:-7, fatiga:+4 },
        resultado:'La estufa sigue tirando mal y a ninguno le importa. Hay una comodidad de paso en lo vuestro, sin futuro y sin reproche, que en las Pilas es casi sano. Te quedas dormido con el rasgueo de fondo y, por una vez, no sueñas con nada malo.' },
      { texto:'Escuchar un momento desde la calle y seguir.', efectos:{ aislamiento:-3 },
        resultado:'Te quedas bajo su ventana hasta que termina la canción, sin que él lo sepa, y luego sigues. Saber dónde encontrar esa música cuando la necesites ya es una forma de no estar del todo solo.' }
    ]
  },
  'rel_rei_quedar_fin': {
    img:'EXP_CIBERCAFE',
    texto:'Rei te toca lo que lleva a medias y te pide, medio en broma medio en serio, que le digas por dónde seguir. Le inventas un final cualquiera y él lo toca como si fuera bueno. Así, entre los dos, una canción rota se sostiene un rato.',
    opciones:[
      { texto:'Quedarte hasta que la termine.', efectos:{ vinculo:{ id:'rei', mas:1 }, aislamiento:-6, fatiga:-2 },
        resultado:'La termináis juntos, mal y bonita, como casi todo lo que merece la pena aquí. Cuando te vas, Rei ya está empezando otra, porque es de los que no saben estar quietos ni en la compañía. Pero te guarda la mirada hasta la puerta. En su idioma, eso es quedarse.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();

// ============================================================
//  AMPLIACIÓN v0.141 — MÁS CONTACTOS, CON BENEFICIOS DISTINTOS
//  Entradas en sitios variados (no solo fiestas). Cada contacto
//  ayuda de una forma: munición, curarte, suministros, stats.
//  Los beneficios viven en las escenas de "quedar" (gated por
//  vínculo + noche): son encuentros aleatorios, no a demanda, así
//  que ayudan sin romper la economía.
// ============================================================

// ---- PERFILES DE CONVERSACIÓN -----------------------------
(function(){
  if(!window.Conversacion || typeof Conversacion.registrar !== 'function') return;

  // ===== KESTREL — ex-seguridad de HELIX, desertora. Dura, leal. =====
  Conversacion.registrar('kestrel_fiesta', {
    nombre:'KESTREL',
    arbol:[
      /*0*/ { npc:'—Apoyada en la pared, cuenta las salidas del local sin darse cuenta de que lo hace—. No apuestes en la jaula de esta noche. El grande lleva un inhibidor de dolor hasta las cejas; el otro no sabe que pelea contra una pared. Tiro de experiencia, no de fe.',
        opciones:[
          { txt:'"Hablas como alguien que ha estado en la jaula."', ir:1 },
          { txt:'"¿Y tú de qué lado apuestas?"', ir:2 },
          { txt:'[Contar las salidas tú también.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'Estuve al otro lado de muchas puertas, con un uniforme que ya no llevo. HELIX te enseña a leer una habitación en dos segundos. Lo que no te enseña es a apagarlo cuando te vas. —Se toca la nuca—. Sigo contando salidas en mi propia cama.',
        opciones:[ { txt:'"¿Por qué lo dejaste?"', ir:4 } ] },
      /*2*/ { npc:'Yo ya no apuesto. Aposté una vez fuerte, por dejar el uniforme, y todavía estoy pagando la ficha. —Media sonrisa de lobo cansado—. Ahora solo miro y aviso a los novatos. Como tú.',
        opciones:[ { txt:'"No soy tan novato."', ir:4 } ] },
      /*3*/ { npc:'—Te mira de reojo, con algo parecido a la aprobación—. Tres salidas, una falsa. Bien. La mayoría aquí solo ve la jaula. La gente que mira las puertas vive más. Me caes mejor que el noventa por ciento de este antro.',
        opciones:[ { txt:'"Deformación profesional, supongo."', ir:4 } ] },
      /*4*/ { npc:'—Se separa de la pared—. Mira, no se me dan los discursos. Pero ando suelta y armada en una ciudad que muerde, y tú pareces de los que también andan solos. Sé dónde paro. Si alguna noche necesitas que alguien te cubra la espalda en vez de clavártela, ya sabes.', fin:true }
    ]
  });
  Conversacion.registrar('kestrel_quedar', {
    nombre:'KESTREL',
    arbol:[
      /*0*/ { npc:'—Te abre sin bajar del todo la guardia, que en ella es cariño—. Llegas con cara de calle dura. Siéntate. Tengo algo de material de sobra y una botella mediocre. Las dos cosas se comparten mejor que se guardan.',
        opciones:[
          { txt:'"¿Material?"', ir:1 },
          { txt:'"Solo necesitaba una cara conocida."', ir:2 },
          { txt:'[Dejarte caer en la silla, agotado.]', s:true, ir:2 }
        ]},
      /*1*/ { npc:'Cargadores, unas balas. Cuando desertas te llevas malas costumbres y buenos hábitos; abastecerse es de los buenos. —Empuja una caja hacia ti—. No es caridad. Es que duermo mejor sabiéndote menos fácil de matar.',
        opciones:[ { txt:'"Te debo una."', ir:3 } ] },
      /*2*/ { npc:'—No insiste en hablar. Limpia un arma despacio, y el silencio entre vosotros es de los cómodos, de los que no piden nada—. Quédate el rato que aguantes. Aquí, al menos, las salidas las controlo yo.',
        opciones:[ { txt:'"Por eso he venido."', ir:3 } ] },
      /*3*/ { npc:'—Asiente una vez, seca—. No me debes nada. La gente como nosotros no lleva esas cuentas: las paga cuando toca, sin avisar. Coge lo tuyo y vuelve entero. Es lo único que pido.', fin:true }
    ]
  });

  // ===== SORA — médica de campo. Coraza de cansancio, manos de oro. =====
  Conversacion.registrar('sora_quedar', {
    nombre:'SORA',
    arbol:[
      /*0*/ { npc:'—Levanta la vista del instrumental, te repasa de arriba abajo en un segundo, diagnóstico puro—. Vienes hecho un cromo. Siéntate ahí y no te hagas el duro: el duro lo hago yo, que para eso tengo el bisturí.',
        opciones:[
          { txt:'"No es para tanto."', ir:1 },
          { txt:'"Gracias por seguir abriendo de noche."', ir:2 },
          { txt:'[Sentarte y dejarte hacer.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'Eso lo decido yo, que veo lo que tú no te miras. —Ya te está limpiando una herida que ni sabías—. "No es para tanto" es lo que dicen todos justo antes de desangrarse en mi camilla con mucha dignidad.',
        opciones:[ { txt:'"Vale, doctora. Usted manda."', ir:3 } ] },
      /*2*/ { npc:'Alguien tiene que. De día, el barrio aguanta. De noche es cuando llega la gente rota de verdad, la que no quiere que conste. —Suspira—. Por eso me quedo. Y porque en casa no me espera nadie con menos heridas que vosotros.',
        opciones:[ { txt:'"Esta noche te espera alguien menos roto."', ir:3 } ] },
      /*3*/ { npc:'—Trabaja en silencio un rato, concentrada, casi tierna en la brusquedad—. Listo. Como nuevo, o lo más cerca que llega uno aquí abajo. No me lo agradezcas: vuelve menos roto la próxima y considéranos en paz.', fin:true }
    ]
  });

  // ===== TOV — estibador marciano, tripulante a ratos. Cálido, de paso. =====
  Conversacion.registrar('tov_fiesta', {
    nombre:'TOV',
    arbol:[
      /*0*/ { npc:'—Comparte un cigarrillo mirando subir las lanzaderas—. ¿Tú también vienes a ver despegar lo que nunca vas a coger? Es un vicio barato. Mejor que la mayoría de los caros que hay en este puerto.',
        opciones:[
          { txt:'"¿De dónde eres?"', ir:1 },
          { txt:'"¿Quieres irte arriba?"', ir:2 },
          { txt:'[Mirar las lanzaderas con él, en silencio.]', s:true, ir:3 }
        ]},
      /*1*/ { npc:'Del Arrabal, ahora. De Marte, antes, de muy crío. —Da una calada larga—. Cargo el acero que sale de allá para que la Tierra lo gaste. Hay una justicia rara en eso, o una broma. Según la noche.',
        opciones:[ { txt:'"¿Volverías a Marte?"', ir:4 } ] },
      /*2*/ { npc:'¿Irme? Llevo quince años a un pasaje de distancia y nunca lo compro. Creo que me gusta más querer irme que irme. Mirar el cielo cuesta menos que el billete, y no decepciona. —Sonríe—. Filosofía de muelle.',
        opciones:[ { txt:'"Suena a una forma de quedarse."', ir:4 } ] },
      /*3*/ { npc:'—Te pasa el cigarrillo sin preguntar—. Poca gente aguanta el silencio de un muelle de noche. Es un silencio grande, con naves dentro. A mí me ordena la cabeza. Veo que a ti también.',
        opciones:[ { txt:'"Ordena, sí. Y pesa."', ir:4 } ] },
      /*4*/ { npc:'—Recoge su mochila de carga, llena de cosas que el manifiesto no cuenta—. Mira, ando arriba y abajo de estos muelles con más provisiones de las que un hombre solo necesita. Si alguna noche andas corto de lo básico, ven a verme. Comer caliente, en las Pilas, es media batalla ganada.', fin:true }
    ]
  });
  Conversacion.registrar('tov_quedar', {
    nombre:'TOV',
    arbol:[
      /*0*/ { npc:'—Te ve llegar y ya está abriendo la mochila térmica—. El de las salidas perdidas. Llegas con hambre de la de verdad, se te ve. Siéntate en la caja, que de silla hace lo que puede.',
        opciones:[
          { txt:'"¿Tienes de sobra?"', ir:1 },
          { txt:'"Solo pasaba a saludar."', ir:2 },
          { txt:'[Sentarte en la caja, agradecido.]', s:true, ir:1 }
        ]},
      /*1*/ { npc:'En un muelle siempre sobra algo si sabes mirar. Raciones, una batería que cayó de un palé, lo que haga falta. —Reparte sin contar—. En Marte, dejar a alguien con hambre teniendo tú de sobra era de las pocas cosas que daban vergüenza de verdad. Me lo traje conmigo.',
        opciones:[ { txt:'"Gracias, Tov."', ir:3 } ] },
      /*2*/ { npc:'Nadie pasa "solo a saludar" a un muelle a estas horas. —Sonríe sin malicia—. Pero me gusta que mientas con educación. Come algo de todos modos, anda. La cortesía no llena el estómago.',
        opciones:[ { txt:'"No sé decirte que no."', ir:3 } ] },
      /*3*/ { npc:'—Mira el cielo, luego a ti—. La Tierra habla, Marte construye, y los de en medio nos cuidamos como podemos. Vuelve cuando quieras. Las lanzaderas seguirán despegando sin nosotros; al menos que nos pillen acompañados.', fin:true }
    ]
  });
})();

// ---- ESCENAS DE LOS NUEVOS CONTACTOS -----------------------
(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ===================== KESTREL (munición / aplomo) =======
  'rel_kestrel_intro': {
    entrada:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcNoConocido:'kestrel' },
    img:'EXP_ALMACEN_ZONA7',
    texto:'En un almacén reconvertido, una jaula de combate clandestino y un corro que apuesta y grita. El olor a sudor y sangre tapa el de la lluvia. Apartada de todo, una mujer con porte de soldado observa las salidas más que la pelea, '
        + 'como quien nunca termina de estar fuera de servicio. Te ve mirar las puertas igual que ella, y algo en su cara se afloja un grado.',
    opciones:[
      { texto:'Acercarte a la mujer de las salidas.', conversa:'kestrel_fiesta', lleva:'rel_kestrel_tras' },
      { texto:'Apostar en la jaula y largarte.', efectos:{ creditos:-10, fatiga:+3, disociacion:+3 },
        resultado:'Apuestas por instinto y pierdes por las mismas. La jaula se queda con tus créditos y con un poco de tus ganas. Sales antes de apostar lo que no tienes. La mujer de las salidas ya no está cuando miras atrás.' },
      { texto:'Este sitio no es para ti. Marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Sales del almacén con los gritos del corro a la espalda. Hay formas de sentirse vivo que se parecen demasiado a buscarse la muerte. Prefieres la lluvia.' }
    ]
  },
  'rel_kestrel_tras': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'Kestrel te acompaña fuera, donde el aire no apesta a jaula. Enciende un cigarrillo con la calma de quien ha visto cosas peores que esta noche. No hay coqueteo de manual; hay reconocimiento, que entre supervivientes pesa más. '
        + '"No prometo nada bonito —dice—. Pero sé estar al lado de alguien sin clavarle nada. En esta ciudad, eso ya es una oferta."',
    opciones:[
      { texto:'Aceptar su compañía esta noche.',
        efectos:{ conocer:'kestrel', vinculo:{ id:'kestrel', mas:1 }, aislamiento:-7, disociacion:-5, fatiga:+4, marcaVisto:'kestrel_intima' },
        resultado:'Su sitio es un búnker disfrazado de cuarto: una salida tapiada, otra despejada, todo a mano. Pero entre esas paredes, por una noche, los dos bajáis la guardia que nunca bajáis. Dormís por turnos sin decirlo, una costumbre vieja que se vuelve íntima. Al irte, te mete unas balas en el bolsillo "por si la ciudad muerde". [Kestrel queda como contacto.]' },
      { texto:'Estrechar la mano y dejarlo en respeto.',
        efectos:{ conocer:'kestrel', vinculo:{ id:'kestrel', mas:1 }, aislamiento:-3 },
        resultado:'Le estrechas la mano, firme, de igual a igual. "Mejor así, quizá", dice ella, sin pena. Te apunta dónde para. Algunas alianzas valen más empezadas despacio. [Kestrel queda como contacto.]' }
    ]
  },
  'rel_kestrel_quedar': {
    entrada:true, repetible:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcConocido:'kestrel', vinculoMin:{ id:'kestrel', n:1 } },
    img:'EXP_ALMACEN_ZONA7',
    texto:'El refugio de Kestrel tiene la luz de servicio encendida: señal, en su idioma, de que estás invitado. Te abre antes de que llames, porque te oyó tres pasillos atrás. Siempre te oye.',
    opciones:[
      { texto:'Dejar que te abastezca para la calle.',
        efectos:{ item:'municion', vinculo:{ id:'kestrel', mas:1 }, disociacion:-4, fatiga:-2 },
        resultado:'Te pasa munición y un cargador de su reserva, sin dramatismo, comprobando que sabes manejarlo. "Vuelve entero", gruñe. Sales mejor pertrechado y, lo que más cuenta, con la cabeza más firme: saber que alguien te cubre la espalda es el mejor blindaje que hay.' },
      { texto:'Solo charlar y compartir el silencio.', conversa:'kestrel_quedar', lleva:'rel_kestrel_charla_fin' },
      { texto:'Ver la luz encendida te basta. Seguir.', efectos:{ aislamiento:-3 },
        resultado:'No subes. Saber que esa luz de servicio se enciende para ti ya te endereza la espalda un par de calles. Kestrel no te lo reprochará: ella también necesita sus noches a solas con las salidas.' }
    ]
  },
  'rel_kestrel_charla_fin': {
    img:'EXP_ALMACEN_ZONA7',
    texto:'Limpiáis armas que no vais a usar esta noche, hablando poco, contando salidas por costumbre. Es una intimidad rara, de cuartel, pero es real. Con Kestrel, bajar la guardia es el regalo más caro que sabe hacer.',
    opciones:[
      { texto:'Quedarte hasta que afloje la noche.', efectos:{ vinculo:{ id:'kestrel', mas:1 }, aislamiento:-6, disociacion:-3 },
        resultado:'Te quedas hasta que la calle se calma. Cuando sales, Kestrel te despide con un gesto de barbilla, el mismo con el que cuenta una salida segura. De ella, eso es un abrazo. Te vas más entero de lo que llegaste.' }
    ]
  },

  // ===================== SORA (te cura de verdad) ==========
  'rel_sora_intro': {
    entrada:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcNoConocido:'sora' },
    img:'EXP_TALLER_NEURAL',
    texto:'Una clínica de trastienda con la luz aún encendida pasada la medianoche. Dentro, una médica termina de coser a alguien y, al verte en el umbral, ni pregunta: te señala la camilla libre con la barbilla. '
        + '"Si vienes andando es que aún hay arreglo —dice—. Pasa antes de que cambie de opinión sobre lo de cerrar." Tiene el cansancio de quien lleva años tapando los agujeros que deja la ciudad.',
    opciones:[
      { texto:'Sentarte y dejar que te revise.', conversa:'sora_quedar', lleva:'rel_sora_intro_fin' },
      { texto:'"Solo buscaba dónde resguardarme."', efectos:{ aislamiento:-2, fatiga:-2 },
        resultado:'"Resguárdate, entonces. Pero la próxima trae una herida o una excusa mejor." Lo dice sin acidez, casi con humor. Te quedas un rato al calor de la clínica antes de volver a la lluvia. Sabes dónde encontrarla.' },
      { texto:'No molestar. Marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Le haces un gesto de disculpa y sigues. Ella vuelve a su paciente sin más. Hay puertas que se quedan abiertas aunque las cruces otro día.' }
    ]
  },
  'rel_sora_intro_fin': {
    img:'EXP_TALLER_NEURAL',
    texto:'Sora te repasa con manos rápidas y ojo clínico, remendando lo que llevas encima mientras suelta su humor seco. Cuando termina, te mira un segundo de más, como quien se sorprende de querer que el paciente vuelva. '
        + '"Ya está. Como nuevo." Te apunta la dirección en un papel. "Por si la ciudad insiste en romperte. Que insistirá."',
    opciones:[
      { texto:'Agradecérselo de verdad.',
        efectos:{ conocer:'sora', vinculo:{ id:'sora', mas:1 }, quitaCondiciones:['hemorragia','conmocion','mareado','envenenado'], fatiga:-15, aislamiento:-4 },
        resultado:'Le sostienes la mirada y le das las gracias como se las da a quien te ha cosido sin preguntar. Sale entero de su consulta más que tu cuerpo: tu cabeza también. "Anda, vete antes de que te cobre el sentimentalismo", dice, pero sonríe. [Sora queda como contacto.]' }
    ]
  },
  'rel_sora_quedar': {
    entrada:true, repetible:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcConocido:'sora', vinculoMin:{ id:'sora', n:1 } },
    img:'EXP_TALLER_NEURAL',
    texto:'La luz de la clínica de Sora sigue encendida, fiel como un faro feo. Asomas la cabeza y ella, sin levantar la vista de lo que cose, dice tu nombre como si te esperara. Quizá te esperaba.',
    opciones:[
      { texto:'Dejar que te ponga a punto.',
        efectos:{ vinculo:{ id:'sora', mas:1 }, quitaCondiciones:['hemorragia','conmocion','mareado','envenenado','costillas','herida_brazo_d_leve'], fatiga:-18, item:'vendaje' },
        resultado:'Te tumba, te repasa entero y te deja como pocas veces andas por las Pilas: sin nada roto y sin nada doliendo. Te mete un vendaje en el bolsillo "para emergencias lejos de aquí". No te cobra. Hace tiempo que dejó de cobrarte. Ninguno de los dos lo menciona.' },
      { texto:'Solo charlar mientras ordena el instrumental.', conversa:'sora_quedar', lleva:'rel_sora_charla_fin' },
      { texto:'No estás herido; no robarle tiempo. Seguir.', efectos:{ aislamiento:-2 },
        resultado:'No entras. Que la clínica de Sora siga encendida ya es una de esas certezas que sostienen a uno en una ciudad sin certezas. Sigues, sabiendo dónde está el faro.' }
    ]
  },
  'rel_sora_charla_fin': {
    img:'EXP_TALLER_NEURAL',
    texto:'Le haces compañía mientras hierve instrumental y se queja del mundo con ese cariño áspero suyo. Cuenta, sin contarlo del todo, los pacientes que no pudo salvar. Tú escuchas. A veces curar a la que cura es el único pago justo.',
    opciones:[
      { texto:'Quedarte hasta que apague la luz.', efectos:{ vinculo:{ id:'sora', mas:1 }, aislamiento:-6, fatiga:-4 },
        resultado:'Os quedáis hasta que apaga el flexo. "Gracias por el rato —dice, sorprendida de decirlo—. La gente solo viene cuando sangra." Sales con la sensación rara y buena de haberle devuelto algo a quien siempre da. La próxima vez vendrás también sin estar roto.' }
    ]
  },

  // ===================== TOV (suministros / hambre) ========
  'rel_tov_intro': {
    entrada:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcNoConocido:'tov' },
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'En el filo del puerto orbital, lejos de las grúas, un estibador fuma sentado sobre una caja viendo despegar las lanzaderas. No espera ninguna; solo mira, con esa devoción callada de quien le reza a un cielo que no le va a contestar. '
        + 'Te hace sitio en la caja con un gesto, sin preguntar, como si llevara toda la noche guardándotelo.',
    opciones:[
      { texto:'Sentarte a ver despegar las naves con él.', conversa:'tov_fiesta', lleva:'rel_tov_tras' },
      { texto:'Mirar las lanzaderas un momento y seguir.', efectos:{ aislamiento:-2, disociacion:+2 },
        resultado:'Miras subir un par de lanzaderas hacia un cielo que no es para ti, y sigues antes de que se te meta la envidia o la pena. El estibador alza la mano al despedirte, sin rencor. El muelle se queda con su silencio grande.' }
    ]
  },
  'rel_tov_tras': {
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'Tov resulta ser fácil de estar al lado: cálido sin pesar, de paso sin frialdad. Comparte su cigarrillo, su silencio y, al final, su mochila de provisiones de muelle. No hay drama en lo que ofrece: '
        + '"Comer caliente y no estar solo. Es lo que tengo. En Marte nos enseñaron que eso ya es bastante para una noche."',
    opciones:[
      { texto:'Aceptar pasar la noche en su rincón del muelle.',
        efectos:{ conocer:'tov', vinculo:{ id:'tov', mas:1 }, hambre:-12, aislamiento:-7, fatiga:-3, marcaVisto:'tov_intimo' },
        resultado:'Su "casa" es un contenedor habilitado con vistas a las lanzaderas. Coméis algo caliente, habláis de Marte y de mares que ninguno ha visto, y la cercanía llega sin prisa, como todo lo suyo. Os dormís viendo despegar luces. Al amanecer te llena la mochila "para el camino". [Tov queda como contacto.]' },
      { texto:'Compartir el cigarro y despedirte.',
        efectos:{ conocer:'tov', vinculo:{ id:'tov', mas:1 }, aislamiento:-3, hambre:-6 },
        resultado:'Termináis el cigarro viendo el último despegue. Te mete una ración en la mano "para que no digas que los marcianos somos secos". Te apunta dónde para. Algunas amistades empiezan en una caja, mirando arriba. [Tov queda como contacto.]' }
    ]
  },
  'rel_tov_quedar': {
    entrada:true, repetible:true,
    cond:{ franja:['anochecer','noche','madrugada'], npcConocido:'tov', vinculoMin:{ id:'tov', n:1 } },
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'Encuentras a Tov en su caja de siempre, en el filo del muelle, con la mochila térmica ya medio abierta. Te ve llegar y sonríe como quien reconoce un buen presagio en una noche cualquiera.',
    opciones:[
      { texto:'Dejar que te abastezca y comer con él.',
        efectos:{ item:'racion_deshidratada', vinculo:{ id:'tov', mas:1 }, hambre:-14, fatiga:-4, aislamiento:-3 },
        resultado:'Coméis caliente sobre la caja mientras despegan las naves. Te llena la mochila con una ración y una batería que "cayó de un palé", sin dejarte rechazarlo. Te vas con el estómago lleno y el ánimo entero, que en las Pilas casi nunca van juntos. Comer caliente, ya lo dijo él, es media batalla ganada.' },
      { texto:'Solo charlar viendo el cielo.', conversa:'tov_quedar', lleva:'rel_tov_charla_fin' },
      { texto:'Verlo de lejos en su caja te reconforta. Seguir.', efectos:{ aislamiento:-3 },
        resultado:'No te acercas. Saber que Tov sigue ahí, rezándole a las lanzaderas, le da al muelle una calidez que no debería tener. Sigues, un poco menos a la intemperie.' }
    ]
  },
  'rel_tov_charla_fin': {
    img:'EXP_PUERTO_ORBITAL_1',
    texto:'Habláis de Marte, del Arrabal, de los mares de los anuncios y de los que nadie ha pisado. Tov cuenta su tierra sin nostalgia tonta, con el orgullo seco de los suyos. El cielo del muelle, por una vez, no parece tan lejos.',
    opciones:[
      { texto:'Quedarte hasta el último despegue de la madrugada.', efectos:{ vinculo:{ id:'tov', mas:1 }, aislamiento:-6, fatiga:-2 },
        resultado:'Os quedáis hasta que despega la última lanzadera de la madrugada. "La Tierra habla, Marte construye —dice Tov, medio dormido—, y los de en medio nos hacemos compañía." Te vas con esa frase y con la certeza de tener, en el filo del puerto, un sitio al que volver.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
