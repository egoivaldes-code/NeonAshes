// ============================================================
// BLOQUE JS-50 — CADENAS DE FACCIÓN (missionchains)
// ------------------------------------------------------------
// Cuatro cadenas, una por facción de zona. Cada una: 5 partes,
// 3 escenas por parte, una parte por run (campo cadena:'...').
// Recompensa de reputación creciente con su facción (que arrastra
// la caída con su enemiga, vía cambiarRepFaccion) + item único final.
//
//   ferro  -> sindicatos   (enemiga: loto)   item final: sello_ferro
//   loto   -> loto          (enemiga: sindicatos) item: llave_loto
//   eco    -> eco           (enemiga: ia)     item final: reliquia_carne
//   colectivo -> ia         (enemiga: eco)    item final: clave_colectivo
//
// Las recompensas usan  faccion + rep  (los aplica el motor 44 vía
// cambiarRepFaccion). La rep final de cada cadena es grande (+30).
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CADENAS = {

    // ========================================================
    // CADENA FERRO — "EL PESO DEL HIERRO"  (facción: sindicatos)
    // El Distrito Ferro: fundiciones, deudas, una mafia obrera.
    // ========================================================
    'ferro_p1': {
      entrada:true, cadena:'ferro', cond:{ noVisto:'ferro_p1' },
      img:'EXP_TALLER_REUTILIZA',
      texto:'Un capataz viejo del Ferro te para junto a una colada de metal fundido. '
          +'La cara picada de chispas de toda una vida. "Tú. El de fuera. Don Vasek pregunta '
          +'si sabes cargar peso sin abrir la boca." No es una oferta amable. En el Ferro nada lo es.',
      opciones:[
        { texto:'¿Qué clase de peso?', lleva:'ferro_p1_b' },
        { texto:'Depende de cuánto pague.', efectos:{ aislamiento:+1 }, lleva:'ferro_p1_b' }
      ]
    },
    'ferro_p1_b': {
      img:'EXP_TALLER_REUTILIZA',
      texto:'"Cajas. De la fundición al muelle. No preguntas qué hay dentro, no miras, no cuentas." '
          +'El capataz escupe al suelo caliente. "Vasek premia la lealtad y entierra la curiosidad. '
          +'Literalmente, a veces." Te mira de arriba abajo. "Una caja. Esta noche. ¿Sí o no?"',
      opciones:[
        { texto:'Cargar la caja.', lleva:'ferro_p1_c' },
        { texto:'¿Y si miro dentro?', efectos:{ disociacion:+2 }, resultado:'El capataz se ríe sin gracia. "Entonces no habrá una segunda caja. Ni un segundo tú." Lo dice tan tranquilo que le crees del todo.', lleva:'ferro_p1_c' }
      ]
    },
    'ferro_p1_c': {
      img:'EXP_PUERTO_CARGA',
      texto:'Cargas la caja en silencio bajo la lluvia. Pesa lo que pesa un cuerpo dormido, y prefieres '
          +'no pensar en eso. En el muelle, un hombre de traje la recibe sin mirarte. El capataz asiente, '
          +'satisfecho. "Vasek sabrá que cumpliste. Aquí eso es lo único que se hereda: el nombre de quien cumple."',
      opciones:[
        { texto:'Cobrar y callar.', efectos:{ creditos:+50, faccion:'sindicatos', rep:+6, aislamiento:+3 },
          resultado:'Te pagan en mano, billetes húmedos. Acabas de entrar en la cuenta del Ferro. '
                   +'Una cuenta de la que es fácil entrar y difícil salir. Pero pagan, y eso ya es algo en las Pilas.' }
      ]
    },

    'ferro_p2': {
      entrada:true, cadena:'ferro', cond:{ visto:'ferro_p1', noVisto:'ferro_p2' },
      img:'EXP_TALLER_REUTILIZA',
      texto:'El capataz te espera con peor cara que de costumbre. "Hay un problema. Uno de los nuestros, '
          +'Téo, se ha quedado corto en una entrega. Vasek quiere que lo acompañes a explicarse." '
          +'Lo dice como quien habla del tiempo. Pero los dos sabéis qué significa "explicarse" en el Ferro.',
      opciones:[
        { texto:'¿Téo va a salir vivo de eso?', lleva:'ferro_p2_b' },
        { texto:'No soy el músculo de nadie.', efectos:{ aislamiento:+2 }, resultado:'"No te pido que pegues. Te pido que mires. A veces basta con que haya testigos para que nadie tenga que sangrar." Casi suena razonable. Casi.', lleva:'ferro_p2_b' }
      ]
    },
    'ferro_p2_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Téo es un crío con las manos temblando. "Me robaron a mí primero, lo juro." Vasek no está; '
          +'está su voz, en un hombre de traje que escucha sin pestañear. Al final, el del traje te mira a ti. '
          +'"Tú estabas. ¿Dice verdad el chaval?" El peso de la noche entera cae sobre lo que respondas.',
      opciones:[
        { texto:'Dice verdad. Le robaron. (proteger a Téo)', efectos:{ disociacion:+2 },
          resultado:'El del traje sopesa tu palabra. "Bien. El Ferro cobra al ladrón, no al robado." Téo respira por primera vez en una hora.', lleva:'ferro_p2_c' },
        { texto:'No me consta. (lavarte las manos)', efectos:{ aislamiento:+4, disociacion:+3 },
          resultado:'Te encoges de hombros. El del traje asiente. A Téo se lo llevan a "explicarse" mejor. No te giras. Aprendes que en el Ferro no girarse es una habilidad.', lleva:'ferro_p2_c' }
      ]
    },
    'ferro_p2_c': {
      img:'EXP_TALLER_REUTILIZA',
      texto:'Al salir, el capataz te ofrece un cigarro de los caros. "Vasek se ha fijado en ti. '
          +'Dice que tienes algo que casi nadie trae aquí abajo: criterio." Una pausa. '
          +'"El criterio es peligroso. Te hace creer que puedes elegir. En el Ferro, eso a veces es verdad. A veces."',
      opciones:[
        { texto:'Aceptar el cigarro.', efectos:{ creditos:+70, faccion:'sindicatos', rep:+8, fatiga:+4 },
          resultado:'Fumas con él bajo la lluvia, en silencio. No es amistad. Es algo más raro en las Pilas: respeto. '
                   +'El Ferro empieza a contar contigo, y tú empiezas a deberle cosas que no se pagan en créditos.' }
      ]
    },

    'ferro_p3': {
      entrada:true, cadena:'ferro', cond:{ visto:'ferro_p2', noVisto:'ferro_p3' },
      img:'EXP_CIBERCAFE',
      texto:'El capataz te busca, nervioso por primera vez. "Hay un soplón. Alguien le pasa a HELIX los '
          +'horarios de las coladas, los turnos, las rutas. Vasek está perdiendo hombres en redadas que '
          +'no deberían existir." Baja la voz. "Cree que es alguien de dentro. Quiere que tú lo encuentres, '
          +'porque tú aún no le debes lealtad a ninguno de los sospechosos."',
      opciones:[
        { texto:'¿Por dónde empiezo?', lleva:'ferro_p3_b' },
        { texto:'¿Y si el soplón tiene razones?', efectos:{ disociacion:+2 }, lleva:'ferro_p3_b' }
      ]
    },
    'ferro_p3_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Sigues turnos, ausencias, quién mira demasiado los tablones. El rastro lleva a Sara, '
          +'una soldadora que cubre turno doble y manda créditos fuera cada semana. La acorralas sin testigos. '
          +'No lo niega. "Mi hija está en una clínica de HELIX. Es lo único que aceptan a cambio del tratamiento: '
          +'información. ¿Qué habrías hecho tú?" No tienes una buena respuesta.',
      opciones:[
        { texto:'¿Cuánto les has dado?', lleva:'ferro_p3_c' },
        { texto:'Esto te supera. (escuchar)', efectos:{ aislamiento:-2 }, lleva:'ferro_p3_c' }
      ]
    },
    'ferro_p3_c': {
      img:'EXP_TALLER_REUTILIZA',
      texto:'Tienes su nombre en la mano. El Ferro pagará bien por él, y Sara desaparecerá en una colada '
          +'cualquier noche. O puedes mentir, dar otro nombre, y cargar tú con el riesgo. La lluvia repica '
          +'sobre el techo de chapa mientras decides qué clase de criatura quieres ser en este sitio.',
      opciones:[
        { texto:'Entregar a Sara. (lealtad al Ferro)', efectos:{ creditos:+120, faccion:'sindicatos', rep:+12, disociacion:+8 },
          resultado:'Das el nombre. Vasek recompensa la lealtad con creces. Sara deja de venir a los turnos. '
                   +'Nadie pregunta. Tú tampoco. Pero algo dentro de ti se queda en esa fundición para siempre, '
                   +'fundido con el resto del hierro.' },
        { texto:'Cubrir a Sara. (dar un nombre falso)', efectos:{ creditos:+30, faccion:'sindicatos', rep:+5, aislamiento:-4, disociacion:-3 },
          resultado:'Mientes con la cara que el Ferro te enseñó a poner. Sara y su hija desaparecen esa misma noche, '
                   +'pero hacia un tren, no hacia una colada. Has arriesgado tu cuello por una desconocida. '
                   +'Duermes mal, pero duermes como alguien que aún se reconoce.' }
      ]
    },

    'ferro_p4': {
      entrada:true, cadena:'ferro', cond:{ visto:'ferro_p3', noVisto:'ferro_p4' },
      img:'EXP_PUERTO_CARGA',
      texto:'Te convocan a LA LONJA, el corazón del Ferro: una nave de despiece que huele a hielo y sangre. '
          +'Don Vasek en persona, un hombre menudo de manos cuidadas, te recibe con una sonrisa de abuelo. '
          +'"El Loto Carmesí se está metiendo en mis muelles", dice mientras corta fruta. "Quieren mi ruta del puerto. '
          +'Necesito a alguien sin cara conocida que les lleve un mensaje. ¿Eres tú ese alguien?"',
      opciones:[
        { texto:'¿Qué mensaje?', lleva:'ferro_p4_b' },
        { texto:'El Loto y el Ferro en guerra. Eso me salpica.', efectos:{ disociacion:+2 }, lleva:'ferro_p4_b' }
      ]
    },
    'ferro_p4_b': {
      img:'EXP_CIBERCAFE',
      texto:'"Diles que el puerto es mío desde antes de que sus faroles supieran arder. Y dáles esto." '
          +'Vasek desliza un sobre lacrado. "No lo abras. Solo entrégalo en mano a Mano Roja, en el Carmesí." '
          +'Sabes que entrar en territorio del Loto llevando la palabra del Ferro es meter la cabeza '
          +'entre dos máquinas que se odian. Pero ya estás dentro de esto hasta el cuello.',
      opciones:[
        { texto:'Llevar el mensaje al Carmesí.', lleva:'ferro_p4_c' },
        { texto:'Llevarlo, pero leer el sobre antes.', efectos:{ disociacion:+3 }, resultado:'A la luz de un farol, despegas el lacre con cuidado. Dentro: una lista de nombres del Loto y una sola palabra escrita a mano: "Pronto". Vuelves a cerrarlo con el corazón golpeando. Sabes algo que no deberías.', lleva:'ferro_p4_c' }
      ]
    },
    'ferro_p4_c': {
      img:'EXP_CIBERCAFE',
      texto:'Mano Roja recibe el sobre en su reservado granate, lo lee, y su sonrisa no se mueve ni un milímetro. '
          +'"Dile a Vasek que el Loto agradece el detalle." Te tiende una respuesta sellada para el viejo. '
          +'"Y tú, mensajero... elige pronto un farol o una colada. En esta ciudad nadie camina mucho tiempo '
          +'por el medio de la calle sin que lo atropellen los dos lados."',
      opciones:[
        { texto:'Volver con la respuesta a Vasek.', efectos:{ creditos:+150, faccion:'sindicatos', rep:+14, aislamiento:+4 },
          resultado:'Vasek lee la respuesta y por un instante el abuelo desaparece y queda solo el filo. '
                   +'"Bien. Has caminado entre dos fuegos y has vuelto. El Ferro no olvida eso." '
                   +'Eres oficialmente del Ferro. Y el Loto ya conoce tu cara. Esas dos cosas pesan.' }
      ]
    },

    'ferro_p5': {
      entrada:true, cadena:'ferro', cond:{ visto:'ferro_p4', noVisto:'ferro_p5' },
      img:'EXP_PUERTO_CARGA',
      texto:'La guerra estalla una noche de lluvia cerrada. El Loto golpea los muelles del Ferro y Vasek '
          +'te llama a su lado, no a cargar cajas, sino a decidir. "Tengo a Mano Roja localizada, sola, una hora. '
          +'Puedo acabar esto esta noche. Pero necesito a alguien de fuera que dé la cara, alguien a quien '
          +'el Loto no espere. Te he hecho, chaval. Hoy se ve de qué estás hecho tú."',
      opciones:[
        { texto:'Ir a por Mano Roja con el Ferro.', lleva:'ferro_p5_b' },
        { texto:'Buscar otra salida que no sea sangre.', efectos:{ disociacion:+2 }, lleva:'ferro_p5_b' }
      ]
    },
    'ferro_p5_b': {
      img:'EXP_CIBERCAFE',
      texto:'Encuentras a Mano Roja donde dijo Vasek. Pero no está sola: tiene un crío a su lado, dormido, '
          +'su sobrino. "Antes de que hagas lo que has venido a hacer", dice sin levantar la voz, '
          +'"piensa si quieres ser el cuchillo de un viejo que te usará y te fundirá igual que a una caja. '
          +'El Ferro no te quiere. Te gasta." El sobre de Vasek pesa en tu bolsillo como una losa.',
      opciones:[
        { texto:'Cumplir con el Ferro. (cerrar la guerra a su favor)', lleva:'ferro_p5_kill' },
        { texto:'Bajar las manos. (negarte a esto)', efectos:{ aislamiento:-3 }, lleva:'ferro_p5_perdon' }
      ]
    },
    'ferro_p5_kill': {
      img:'EXP_PUERTO_CARGA',
      texto:'Lo haces rápido, que es lo único piadoso que cabe aquí. Mano Roja no grita: te sostiene la mirada '
          +'hasta el final, como si llevara toda la vida esperando exactamente esta habitación. Cuando acaba, '
          +'el silencio es tan grande que oyes la lluvia en el tejado y la respiración del crío, que no se ha '
          +'despertado. Le bajas los párpados a ella con dos dedos, no sabes por qué, y dejas al niño dormido '
          +'junto al cuerpo que mañana entenderá. Al amanecer, el Arrabal amanece sin reina y el Ferro toma '
          +'los muelles sin disparar un tiro más. En La Lonja, Vasek te recibe con una caja de hierro y los '
          +'ojos de quien ya sabía la respuesta. "Lo que has hecho esta noche no se agradece. Se honra." '
          +'Abre la caja: un sello de fundición con su marca, y un peso de créditos que huele a sangre limpia.',
      opciones:[
        { texto:'Aceptar el sello del Ferro.', efectos:{ item:'sello_ferro', creditos:+600, faccion:'sindicatos', rep:+35, aislamiento:+8, disociacion:+12, marcaVisto:'mano_roja_muerta' },
          resultado:'Coges el sello, tibio del horno. El Distrito Ferro entero te reconoce: las fundiciones, los muelles, '
                   +'los hombres de traje. Eres de Vasek, para lo bueno y para lo otro, y el precio está pagado con algo '
                   +'que no vuelve. En el Arrabal, los faroles granates arden a media luz una semana entera. Dicen que el '
                   +'crío no ha vuelto a hablar. Tú tampoco hablas de esa noche. Pero algunas noches, entre el sueño y la '
                   +'vigilia, una mujer te sostiene la mirada y no la baja.'
                   +'<br><br><span class="eg-pista">— Has completado la cadena del Sindicato Ferro: "El peso del hierro" —</span>' }
      ]
    },
    'ferro_p5_perdon': {
      img:'EXP_PUERTO_CARGA',
      texto:'Bajas las manos. Mano Roja no sonríe ni da las gracias; solo asiente, despacio, como quien anota '
          +'una cifra en un libro que nadie más ve. "El Ferro perderá los muelles del este esta noche y lo sabes. '
          +'Pero tú acabas de comprar algo que Vasek no vende: que el Loto no te busque nunca. Vete." '
          +'Al amanecer, la guerra muere sola en una tregua fea: Vasek conserva el puerto grande, el Loto '
          +'se queda el este, y los dos lados cuentan sus muertos. En La Lonja, el viejo te estudia largo rato. '
          +'"No lo hiciste." No es una pregunta. "Volviste igualmente. Eso vale algo. Menos de lo que valía '
          +'lo otro, pero algo."',
      opciones:[
        { texto:'Sostenerle la mirada a Vasek.', efectos:{ creditos:+200, faccion:'sindicatos', rep:+12, aislamiento:-4, disociacion:+3, marcaVisto:'mano_roja_perdonada' },
          resultado:'Vasek te paga menos de lo prometido y no te da ningún sello: en el Ferro lo sagrado se gana con '
                   +'hierro, y tú elegiste no mancharlo. Pero te deja ir con la cabeza alta, que en su mundo es casi un '
                   +'abrazo. En el Arrabal, una mujer de anillos sabe que le debes y le debes. Has terminado la guerra '
                   +'sin ser el cuchillo de nadie. Caminas por el medio de la calle, que es el sitio más peligroso, '
                   +'y por ahora sigues caminando.'
                   +'<br><br><span class="eg-pista">— Has completado la cadena del Sindicato Ferro: "El peso del hierro" —</span>' }
      ]
    },

    // ========================================================
    // CADENA LOTO — "LO QUE SE SUSURRA"  (facción: loto)
    // El Arrabal Carmesí: placer, secretos, deuda elegante.
    // ========================================================
    'loto_p1': {
      entrada:true, cadena:'loto', cond:{ noVisto:'mano_roja_muerta' },
      img:'EXP_CIBERCAFE',
      texto:'En el Teatro Sin Nombre, una mujer de seda oscura te observa desde un palco. Te hace subir. '
          +'"El Loto siempre anda corto de caras nuevas y discretas", dice. "Tienes pinta de saber escuchar '
          +'sin que se te note. Aquí eso vale más que un arma." Te ofrece té. "¿Te interesa ganarte la vida '
          +'con los oídos en vez de con los puños?"',
      opciones:[
        { texto:'Te escucho.', lleva:'loto_p1_b' },
        { texto:'¿Para quién trabajaría?', lleva:'loto_p1_b' }
      ]
    },
    'loto_p1_b': {
      img:'EXP_CIBERCAFE',
      texto:'"Para Mano Roja, aunque ella no lo sepa todavía. El Loto no vende cuerpos: vende lo que la gente '
          +'confiesa cuando cree que nadie escucha. Secretos. Deudas. Debilidades." Sonríe. "Tu primer trabajo '
          +'es fácil: un cliente del Casa de la Luna Escarlata habla en sueños. Solo tienes que servirle copas '
          +'y recordar lo que diga. Nada más."',
      opciones:[
        { texto:'Aceptar el trabajo.', lleva:'loto_p1_c' },
        { texto:'¿Y si lo que dice puede hundir a alguien?', efectos:{ disociacion:+2 }, resultado:'"Entonces vale el doble." Lo dice sin maldad, como un hecho de la naturaleza. En el Loto, el daño ajeno es solo otra mercancía.', lleva:'loto_p1_c' }
      ]
    },
    'loto_p1_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Sirves copas toda la noche a un hombre que resulta ser un contable de HELIX. Borracho, habla: '
          +'números, una cuenta que no cuadra, un nombre. Lo retienes todo sin pestañear, como te enseñaron '
          +'hace una hora. Al amanecer, la mujer de seda escucha tu informe y asiente, complacida. '
          +'"Tienes memoria y estómago. El Loto sabrá apreciarlo."',
      opciones:[
        { texto:'Cobrar por el secreto.', efectos:{ creditos:+60, faccion:'loto', rep:+6, disociacion:+2 },
          resultado:'Te pagan en seda y créditos. Acabas de aprender que en el Carmesí la información es la única moneda '
                   +'que nunca pierde valor. Y que tú, resulta, tienes talento para recogerla.' }
      ]
    },

    'loto_p2': {
      entrada:true, cadena:'loto', cond:{ visto:'loto_p1', noVisto:'mano_roja_muerta' },
      img:'EXP_CIBERCAFE',
      texto:'La mujer de seda te asciende. "Mano Roja quiere conocerte." En el reservado granate, el brazo '
          +'mecánico cargado de anillos, Mano Roja te estudia largo rato. "Me dicen que recuerdas bien. Bien. '
          +'Tengo un problema delicado: una de mis chicas, Lía, se ha enamorado de un cliente. Eso rompe '
          +'todas las reglas del Loto. Necesito saber si me está traicionando o solo es tonta."',
      opciones:[
        { texto:'¿Qué le pasa a Lía si te traiciona?', lleva:'loto_p2_b' },
        { texto:'No espío a inocentes.', efectos:{ aislamiento:+2 }, resultado:'"Aquí nadie es inocente, cariño. Solo hay quien aún no sabe lo que ha vendido." Mano Roja no se enfada. Sonríe. Eso es peor.', lleva:'loto_p2_b' }
      ]
    },
    'loto_p2_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Sigues a Lía dos noches. Descubres la verdad: no traiciona al Loto. Está ahorrando, con ayuda del '
          +'cliente, para sacar a su hermano de una deuda con... el Sindicato Ferro. Si Mano Roja se entera de que '
          +'hay dinero del Ferro tocando a su gente, Lía está muerta. Tú decides qué versión sube al palco.',
      opciones:[
        { texto:'Contar toda la verdad a Mano Roja.', efectos:{ disociacion:+3 },
          resultado:'Mano Roja escucha, los ojos fríos. "El Ferro metiéndose entre mis sábanas. Interesante." Lía desaparece del Carmesí esa semana. No preguntas adónde.', lleva:'loto_p2_c' },
        { texto:'Decir que solo es tonta de amor. (proteger a Lía)', efectos:{ aislamiento:-3, disociacion:+1 },
          resultado:'"Tonta de amor." Mano Roja suspira. "Quítale el cliente y que vuelva al trabajo." Has ocultado el hilo del Ferro. Lía vivirá. Tú cargas con el secreto.', lleva:'loto_p2_c' }
      ]
    },
    'loto_p2_c': {
      img:'EXP_CIBERCAFE',
      texto:'Mano Roja te sirve un licor caro de su propia botella. "Tienes criterio para decidir qué cuentas '
          +'y qué te guardas. Eso, en este oficio, es oro." Te mira el brazo mecánico reflejado en la copa. '
          +'"La gente cree que el poder es músculo, como el zafio de Vasek. El verdadero poder es saber. Y tú '
          +'estás aprendiendo a saber."',
      opciones:[
        { texto:'Brindar con ella.', efectos:{ creditos:+90, faccion:'loto', rep:+8, disociacion:+2 },
          resultado:'Brindáis en silencio. Mano Roja te ha medido y te ha aprobado. El Loto Carmesí empieza a abrirte '
                   +'sus puertas de seda. Detrás de cada una hay un secreto, y ahora algunos son tuyos.' }
      ]
    },

    'loto_p3': {
      entrada:true, cadena:'loto', cond:{ visto:'loto_p2', noVisto:'mano_roja_muerta' },
      img:'EXP_ALMACEN_OKUPA',
      texto:'Mano Roja te confía algo grande. "Un juez de HELIX viene al Carmesí cada jueves con nombre falso. '
          +'Quiero su secreto en mi mano: lo que más teme que se sepa. Con eso, el Loto tendrá un juez en el bolsillo '
          +'durante años." Te entrega una llave de una habitación. "Lo que pase ahí dentro lo decides tú. Solo tráeme '
          +'con qué atarlo."',
      opciones:[
        { texto:'Aceptar la llave.', lleva:'loto_p3_b' },
        { texto:'Chantajear a un juez es jugar fuerte.', efectos:{ disociacion:+2 }, lleva:'loto_p3_b' }
      ]
    },
    'loto_p3_b': {
      img:'EXP_CIBERCAFE',
      texto:'Esa noche conoces al juez. No es el monstruo que esperabas: es un hombre roto que viene al Carmesí '
          +'porque es el único sitio donde nadie le pide que condene a nadie. Te confiesa, sin saber quién eres, '
          +'que firma sentencias que sabe injustas porque HELIX lo tiene cogido por una hija enferma. Su secreto '
          +'no es un vicio. Es una culpa que lo está matando.',
      opciones:[
        { texto:'Sonsacarle lo justo para el chantaje.', lleva:'loto_p3_c' },
        { texto:'Solo escucharle, como a una persona.', efectos:{ aislamiento:-3 }, lleva:'loto_p3_c' }
      ]
    },
    'loto_p3_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Tienes en la mano lo que Mano Roja quiere: la grabación de un juez confesando que firma injusticias. '
          +'Entregarla le da al Loto un poder enorme, y a ti un ascenso. O puedes darle a Mano Roja otra cosa '
          +'—un vicio menor, inofensivo— y dejar la verdadera culpa del juez fuera del alcance del Loto.',
      opciones:[
        { texto:'Entregar la confesión real.', efectos:{ creditos:+160, faccion:'loto', rep:+12, disociacion:+8 },
          resultado:'Mano Roja escucha la grabación dos veces, casi con ternura. "Un juez. En mi bolsillo. Eres un tesoro." '
                   +'El juez seguirá firmando, ahora también para el Loto. Su culpa, multiplicada, es tu ascenso. Te pagan como a un príncipe.' },
        { texto:'Darle un vicio menor. (proteger al juez)', efectos:{ creditos:+50, faccion:'loto', rep:+6, aislamiento:-4, disociacion:-2 },
          resultado:'Le das a Mano Roja una nimiedad: el juez juega y pierde. Suficiente para tenerlo, no para destruirlo. '
                   +'Ella lo acepta sin sospechar. Has dejado a un hombre roto su última esquina de dignidad. Nadie lo sabrá nunca. Tú sí.' }
      ]
    },

    'loto_p4': {
      entrada:true, cadena:'loto', cond:{ visto:'loto_p3', noVisto:'mano_roja_muerta' },
      img:'EXP_CIBERCAFE',
      texto:'Mano Roja te llama, tensa por primera vez. "El Ferro me está ahogando los muelles. Vasek quiere mi '
          +'ruta del puerto y manda mensajes con lacre, el muy teatrero." Te mira fijo. "Necesito ojos dentro del Ferro. '
          +'Alguien que el viejo no sospeche. Sé que has rondado por allí. ¿Serías mis oídos en la fundición?"',
      opciones:[
        { texto:'¿Qué necesitas saber?', lleva:'loto_p4_b' },
        { texto:'Eso es ponerme entre dos fuegos.', efectos:{ disociacion:+2 }, lleva:'loto_p4_b' }
      ]
    },
    'loto_p4_b': {
      img:'EXP_PUERTO_CARGA',
      texto:'Te cuelas en el Ferro con una excusa de carga. Escuchas, miras, recuerdas. Descubres el punto débil '
          +'de Vasek: una ruta nocturna del puerto, los jueves, mal vigilada. Con ese dato, el Loto puede '
          +'estrangular al Ferro sin derramar sangre. Pero también ves a los obreros del Ferro, gente que solo '
          +'carga peso para comer, que pagaría la guerra entre jefes con su pan.',
      opciones:[
        { texto:'Llevarle a Mano Roja el punto débil.', lleva:'loto_p4_c' },
        { texto:'Llevarle solo lo justo para que no sangre nadie.', efectos:{ aislamiento:-2 }, lleva:'loto_p4_c' }
      ]
    },
    'loto_p4_c': {
      img:'EXP_CIBERCAFE',
      texto:'Mano Roja recibe tu informe con los ojos brillando. "La ruta de los jueves. Te has metido en la boca '
          +'del lobo y has vuelto con su muela." Te sirve licor. "El Ferro no sabe que tiene un agujero, y el '
          +'agujero eres tú." Hace una pausa elegante. "Pronto te pediré que elijas un bando del todo. Espero que '
          +'elijas la seda y no el óxido. La seda paga mejor y mancha menos. Aunque mancha igual."',
      opciones:[
        { texto:'Cobrar y prepararte para lo que viene.', efectos:{ creditos:+200, faccion:'loto', rep:+14, disociacion:+3 },
          resultado:'Cobras una fortuna en créditos limpios. El Loto Carmesí te tiene por uno de los suyos, y el Ferro '
                   +'aún cree que eres de fiar. Caminas por el filo entre dos imperios, y por ahora el filo te sostiene. Por ahora.' }
      ]
    },

    'loto_p5': {
      entrada:true, cadena:'loto', cond:{ visto:'loto_p4', noVisto:'mano_roja_muerta' },
      img:'EXP_CIBERCAFE',
      texto:'La guerra estalla. El Ferro golpea, el Loto responde. Mano Roja te llama al palco más alto del Teatro '
          +'Sin Nombre. "Hoy se acaba el caminar por el medio. Tengo a Vasek expuesto: una reunión, sin sus hombres, '
          +'fiándose de un mensajero. Ese mensajero vas a ser tú. Le llevas paz en una mano y, si hace falta, el final '
          +'en la otra. ¿Eres del Loto o no lo eres?"',
      opciones:[
        { texto:'Ir a la reunión como el filo del Loto.', lleva:'loto_p5_b' },
        { texto:'Ir a buscar una paz de verdad.', efectos:{ disociacion:+2 }, lleva:'loto_p5_b' }
      ]
    },
    'loto_p5_b': {
      img:'EXP_PUERTO_CARGA',
      texto:'Vasek te recibe solo, confiado en el chaval que cargó sus cajas. "Sabía que eras de fiar", dice, '
          +'y la palabra te quema. Tienes en la mano el poder de cerrar la guerra a favor del Loto traicionando '
          +'la única confianza que el viejo te dio. O de forzar una paz que nadie quiere pero que dejaría a los '
          +'obreros comer. El Carmesí entero contiene la respiración a través de tus ojos.',
      opciones:[
        { texto:'Cumplir con el Loto. (traicionar a Vasek)', lleva:'loto_p5_c' },
        { texto:'Forzar la paz entre Ferro y Loto.', efectos:{ aislamiento:-3 }, lleva:'loto_p5_c' }
      ]
    },
    'loto_p5_c': {
      img:'EXP_CIBERCAFE',
      texto:'Al amanecer, la guerra se ha decidido y tu nombre corre por el Carmesí. Mano Roja te espera en su '
          +'reservado con una cajita de laca roja. "Hiciste lo que había que hacer." Abre la caja: una flor de loto '
          +'de laca, pequeña, perfecta. "Esto te abre toda puerta del Carmesí y te llena los oídos de todo secreto. '
          +'Bienvenido de verdad al Loto. Ahora ya no hay vuelta a ser nadie."',
      opciones:[
        { texto:'Aceptar la llave del Loto.', efectos:{ item:'llave_loto', creditos:+450, faccion:'loto', rep:+30, disociacion:+5, aislamiento:-2 },
          resultado:'Te guardas la flor de laca junto al corazón. El Arrabal Carmesí entero es tuyo ahora: los teatros, '
                   +'las casas, los secretos que respiran tras las cortinas. Tienes el favor del Loto y el rencor del Ferro. '
                   +'Has cambiado tu anonimato por poder blando, el que no se ve y todo lo mueve. En las Pilas, pocos llegan '
                   +'tan lejos sin mancharse del todo. Tú ya no sabes de qué color estás manchado.'
                   +'<br><br><span class="eg-pista">— Has completado la cadena del Loto Carmesí: "Lo que se susurra" —</span>' }
      ]
    },

    // ========================================================
    // CADENA ECO — "LA CARNE ES TEMPORAL"  (facción: eco)
    // Santuario IX: el Culto de la Carne Perfecta, fusión y fe.
    // ========================================================
    'eco_p1': {
      entrada:true, cadena:'eco', cond:{ noVisto:'eco_p1' },
      img:'EXP_ALMACEN_OKUPA',
      texto:'Una hermana del Santuario, túnica blanca y un ojo de iris en espiral, te detiene con dulzura. '
          +'"Caminas como quien le duele el cuerpo", dice, y aciertas a no saber cómo lo sabe. "El Culto no '
          +'pide fe. Pide escuchar. Ven una vez. Si la carne no te habla, te dejaremos ir." Su sonrisa es '
          +'cálida y exacta, como calibrada.',
      opciones:[
        { texto:'¿Qué hacéis ahí dentro?', lleva:'eco_p1_b' },
        { texto:'No busco religión.', efectos:{ aislamiento:+1 }, resultado:'"Nosotros tampoco la buscábamos. Nos encontró cuando el cuerpo nos falló. Ven igualmente. La duda es bienvenida aquí." Y vas, casi sin decidirlo.', lleva:'eco_p1_b' }
      ]
    },
    'eco_p1_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Dentro del Santuario, gente medita con implantes a la vista, cables como venas plateadas. '
          +'La hermana te explica: "La carne enferma, envejece, traiciona. La máquina no. Fundirnos con ella '
          +'no es perder humanidad: es dejar de sufrir. Cada pieza que aceptamos es una oración cumplida." '
          +'Señala a un anciano con medio rostro de acero, sereno. "Él ya no teme a la muerte. ¿Tú puedes decir lo mismo?"',
      opciones:[
        { texto:'Quedarme a escuchar.', lleva:'eco_p1_c' },
        { texto:'Esto me inquieta.', efectos:{ disociacion:+2 }, lleva:'eco_p1_c' }
      ]
    },
    'eco_p1_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Te quedas más de lo que pensabas. La hermana te ofrece una tarea simple: llevar comida y compañía '
          +'a los conversos recientes, los que aún tienen fiebre del injerto. "No te pedimos creer. Solo cuidar. '
          +'El Culto cuida a los suyos cuando nadie más lo hace." Y eso, en las Pilas, suena casi a milagro.',
      opciones:[
        { texto:'Cuidar de los conversos.', efectos:{ creditos:+50, faccion:'eco', rep:+6, aislamiento:-5 },
          resultado:'Pasas la noche dando caldo y palabras a gente que tiembla mientras su cuerpo acepta el metal. '
                   +'Te pagan poco, pero te miran como a alguien necesario. Hacía mucho que nadie te miraba así. '
                   +'El Culto te ha tocado un hilo que no sabías que tenías.' }
      ]
    },

    'eco_p2': {
      entrada:true, cadena:'eco', cond:{ visto:'eco_p1', noVisto:'eco_p2' },
      img:'EXP_ALMACEN_OKUPA',
      texto:'La hermana te presenta a un mando del Culto: voz suave, augmentaciones caras, ojos que calculan. '
          +'"Hermana Vael te quiere para algo más que caldo." Una pausa. "Hay un converso, Damir, que ha '
          +'empezado a dudar en voz alta. Habla de irse, de que esto es una secta. Inquieta a los débiles. '
          +'Queremos que hables con él. Que le recuerdes lo que el Culto le dio."',
      opciones:[
        { texto:'¿Y si Damir tiene razón en dudar?', lleva:'eco_p2_b' },
        { texto:'No voy a manipular a nadie.', efectos:{ aislamiento:+2 }, resultado:'"¿Manipular? Solo te pedimos que le escuches. Si tras hablar contigo quiere irse, que se vaya. La fe forzada no sirve." Suena razonable. En el Culto todo suena razonable. Esa es la trampa, o la gracia.', lleva:'eco_p2_b' }
      ]
    },
    'eco_p2_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Damir es un hombre asustado con un brazo nuevo que aún no siente suyo. "Me curaron, sí. Pero ahora '
          +'dicen que el siguiente paso es el corazón. Y el siguiente, los ojos. ¿Dónde paro de ser yo?" Te mira '
          +'suplicante. "Tú aún tienes la cara entera. Dime la verdad: ¿esto salva o devora?" No sabes la respuesta. '
          +'Y él lo ve en tu silencio.',
      opciones:[
        { texto:'Animarle a quedarse en el Culto.', efectos:{ disociacion:+3 },
          resultado:'Le repites las palabras suaves que aprendiste. Damir asiente, quiere creerte. Se queda. Días después sabrás que aceptó el corazón de acero. No sabes si lo salvaste o lo entregaste.', lleva:'eco_p2_c' },
        { texto:'Decirle que escuche su propio miedo.', efectos:{ aislamiento:-3, disociacion:+1 },
          resultado:'"Si tu miedo grita, escúchalo. Yo no soy quién para decirte dónde acaba tu cuerpo." Damir llora, agradecido. Esa noche se va del Santuario. El mando no quedará contento contigo.', lleva:'eco_p2_c' }
      ]
    },
    'eco_p2_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Hermana Vael en persona te recibe después. No te reprocha nada, sepas lo que hiciste. "El Culto no '
          +'es lo que la gente teme", dice. "No devoramos a nadie. Damos a los rotos una forma de no romperse más. '
          +'Que algunos no entiendan dónde acaba el cuerpo... es el precio de no terminar siendo polvo como los demás." '
          +'Te mira con su ojo en espiral. "Tú entiendes el dolor. Por eso te quiero cerca."',
      opciones:[
        { texto:'Quedarte cerca de Vael.', efectos:{ creditos:+80, faccion:'eco', rep:+8, fatiga:-3 },
          resultado:'Vael te toma bajo su ala. El Santuario empieza a sentirse, peligrosamente, como un hogar. '
                   +'Cálido, ordenado, lleno de gente que te necesita. Tan distinto del frío de las Pilas que casi '
                   +'no notas cómo te vas hundiendo en él.' }
      ]
    },

    'eco_p3': {
      entrada:true, cadena:'eco', cond:{ visto:'eco_p2', noVisto:'eco_p3' },
      img:'EXP_TALLER_REUTILIZA',
      texto:'Vael te confía un secreto del Culto. "Nuestros implantes sagrados los fabrica el Colectivo del Nodo '
          +'Fantasma, esos herejes del dato. Nos venden el hardware y se ríen de nuestra fe a la espalda." '
          +'Aprieta los labios. "Han subido el precio y amenazan con cortarnos el suministro. Sin piezas, no hay '
          +'conversión, y los fieles en lista de espera morirán de lo que vinieron a curarse. Ve al Nodo. Negocia."',
      opciones:[
        { texto:'Iré a hablar con el Colectivo.', lleva:'eco_p3_b' },
        { texto:'Dependéis de quienes os desprecian.', efectos:{ disociacion:+2 }, lleva:'eco_p3_b' }
      ]
    },
    'eco_p3_b': {
      img:'EXP_CIBERCAFE',
      texto:'En el Nodo, un técnico del Colectivo se burla sin disimulo. "¿El Culto de los zombis de acero '
          +'mendigando piezas? Vuestra fe es superstición pegada a nuestro hardware." Pero te enseña algo que '
          +'te hiela: los implantes "sagrados" llevan un firmware del Colectivo que registra todo lo que el '
          +'converso ve y oye. "Vuestros santos son nuestras cámaras, beato. Por eso os los vendemos baratos."',
      opciones:[
        { texto:'Negociar el suministro igualmente.', lleva:'eco_p3_c' },
        { texto:'¿Vael sabe que sus fieles son espías sin saberlo?', efectos:{ disociacion:+3 }, lleva:'eco_p3_c' }
      ]
    },
    'eco_p3_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Vuelves al Santuario con dos verdades: puedes traer el suministro que salva a los fieles, y sabes que '
          +'cada fiel convertido es un ojo del Colectivo dentro del Culto. Si se lo cuentas a Vael, habrá guerra '
          +'con el Nodo y los conversos en espera morirán. Si callas, salvas cuerpos y entregas almas a la vigilancia. '
          +'La fe y el dato, peleándose dentro de tu cabeza.',
      opciones:[
        { texto:'Callar y traer el suministro. (salvar cuerpos)', efectos:{ creditos:+150, faccion:'eco', rep:+12, disociacion:+8 },
          resultado:'Traes las piezas. Los fieles en espera viven. Vael te bendice sin saber que cada converso lleva '
                   +'dentro un espía del Nodo. Has elegido la carne sobre la verdad. El Culto te adora. Tú duermes con un peso nuevo.' },
        { texto:'Contarle la verdad a Vael. (fe sobre cuerpos)', efectos:{ creditos:+40, faccion:'eco', rep:+6, aislamiento:-3, disociacion:+2 },
          resultado:'Vael escucha, pálida. "Espías. En la carne de mis hijos." Corta con el Colectivo. La lista de espera '
                   +'sufrirá, algunos morirán, pero el Culto deja de sangrar datos. Vael te mira distinto: como a alguien '
                   +'que antepone el alma al cuerpo. En su mundo, eso te hace casi sagrado.' }
      ]
    },

    'eco_p4': {
      entrada:true, cadena:'eco', cond:{ visto:'eco_p3', noVisto:'eco_p4' },
      img:'EXP_ALMACEN_OKUPA',
      texto:'Vael te lleva a lo más hondo del Santuario, EL TALLER DE CARNE, donde se hacen las conversiones '
          +'mayores. "Quiero mostrarte lo que protegemos." En las camillas, gente entregando voluntariamente '
          +'piernas, ojos, órganos por piezas que no enferman. Es horrible y es tierno a la vez. "El Colectivo nos '
          +'declara la guerra por lo que descubriste. Necesito que decidas conmigo cómo responder."',
      opciones:[
        { texto:'¿Qué quieres hacer con el Nodo?', lleva:'eco_p4_b' },
        { texto:'Esto no es fe. Es miedo a morir.', efectos:{ disociacion:+2 }, lleva:'eco_p4_b' }
      ]
    },
    'eco_p4_b': {
      img:'EXP_CIBERCAFE',
      texto:'"Los herejes del dato creen que el cuerpo es una cárcel de la que escapar al código", dice Vael. '
          +'"Nosotros sabemos que el cuerpo es el último templo. Esa es la guerra de verdad: ellos quieren disolvernos '
          +'en información, nosotros queremos seguir siendo carne, aunque sea carne de acero." Te tiende un encargo: '
          +'sabotear el firmware espía del Colectivo en los implantes. "Líbranos de sus ojos sin matar a nuestros fieles."',
      opciones:[
        { texto:'Sabotear el firmware del Colectivo.', lleva:'eco_p4_c' },
        { texto:'Hay gente buena en los dos lados, Vael.', efectos:{ aislamiento:-2 }, lleva:'eco_p4_c' }
      ]
    },
    'eco_p4_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Logras alterar el firmware: los implantes seguirán curando, pero ya no espiarán para el Nodo. '
          +'El Colectivo lo nota enseguida y lo toma como declaración de guerra abierta. Vael te recibe radiante, '
          +'algo raro en ella. "Has cegado los ojos de los herejes sin tocar a un solo fiel. El Culto está en deuda '
          +'contigo, y el Culto paga sus deudas en lo único eterno: pertenencia."',
      opciones:[
        { texto:'Aceptar el lugar que te ofrece.', efectos:{ creditos:+200, faccion:'eco', rep:+14, disociacion:+4, aislamiento:-4 },
          resultado:'El Santuario entero te trata como a un hermano mayor. Has elegido bando en la guerra contra el Nodo, '
                   +'y el Culto te envuelve en su calidez total. Tan cómodo, tan cálido, que ya casi no recuerdas el frío '
                   +'de fuera. Y eso, precisamente, debería darte miedo. Pero ya no te lo da.' }
      ]
    },

    'eco_p5': {
      entrada:true, cadena:'eco', cond:{ visto:'eco_p4', noVisto:'eco_p5' },
      img:'EXP_ALMACEN_OKUPA',
      texto:'Vael te llama al altar más alto del Santuario. La guerra con el Colectivo arde. "Has dado tanto al '
          +'Culto que solo queda un paso para ser de los nuestros del todo", dice, y por primera vez su voz tiembla '
          +'de algo parecido a la emoción. "La comunión de la carne. Una pieza tuya, la que elijas, sustituida por '
          +'la máquina eterna. No te obligo. Pero los hermanos de verdad no se quedan enteros mientras los demás se entregan."',
      opciones:[
        { texto:'Considerar la comunión.', lleva:'eco_p5_b' },
        { texto:'¿Y si quiero seguir siendo solo carne?', efectos:{ disociacion:+2 }, lleva:'eco_p5_b' }
      ]
    },
    'eco_p5_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'En el Taller, frío y limpio, te ofrecen la elección. Damir está allí, ya casi todo de acero, sereno, '
          +'irreconocible. "No duele", dice con una voz que ya no es del todo suya. "Dejas de tener miedo." Vael '
          +'espera tu decisión con las manos juntas. Aceptar te hace suyo para siempre. Negarte, sin huir, exige '
          +'una clase de valor distinta: la de pertenecer sin rendirte.',
      opciones:[
        { texto:'Aceptar la comunión de la carne.', lleva:'eco_p5_c' },
        { texto:'Negarte, pero quedarte con ellos.', efectos:{ aislamiento:-3 }, lleva:'eco_p5_c' }
      ]
    },
    'eco_p5_c': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Decidas lo que decidas, Vael te entrega una reliquia: un fragmento de implante bendecido, tibio sin '
          +'razón. "Seas de carne o de acero, has demostrado que el cuerpo, para ti, es sagrado. Eso es ser del Culto, '
          +'más que cualquier injerto." El Santuario entero, en penumbra violeta, te reconoce como uno de los suyos. '
          +'Por primera vez en años, no estás solo. El precio de no estar solo, aquí, todavía no lo conoces del todo.',
      opciones:[
        { texto:'Aceptar la reliquia y tu lugar en el Culto.', efectos:{ item:'reliquia_carne', creditos:+450, faccion:'eco', rep:+30, aislamiento:-8, disociacion:+6 },
          resultado:'Guardas la reliquia que zumba bajo, contra el pecho. El Culto de la Carne Perfecta te ha acogido del '
                   +'todo: tienes refugio, hermanos, un sentido. Y el odio del Colectivo, que no perdona la guerra que '
                   +'ayudaste a ganar. Has cambiado tu soledad por una fe inquietante y cálida. En las Pilas, hasta una fe '
                   +'rota es mejor que el frío. O eso te repites, mientras la reliquia zumba.'
                   +'<br><br><span class="eg-pista">— Has completado la cadena del Culto de la Carne Perfecta: "La carne es temporal" —</span>' }
      ]
    },

    // ========================================================
    // CADENA COLECTIVO — "LA VERDAD ESTÁ EN EL CÓDIGO"  (facción: ia)
    // Nodo Fantasma: hackers y fragmentos de IA contra HELIX.
    // ========================================================
    'col_p1': {
      entrada:true, cadena:'colectivo', cond:{ noVisto:'col_p1' },
      img:'EXP_CIBERCAFE',
      texto:'Cero-Ocho, demasiado joven, tres pantallas orbitando su cráneo, te intercepta en un cibercafé muerto. '
          +'"Te he estado mirando los metadatos, fantasma. Cruzas zonas, hablas con todos, no perteneces a nadie. '
          +'Justo lo que el Colectivo necesita: alguien sin huella." Te desliza un terminal. "¿Quieres hacer algo '
          +'que de verdad le duela a HELIX, o solo sobrevivir como el resto del ganado?"',
      opciones:[
        { texto:'¿Qué tienes en mente?', lleva:'col_p1_b' },
        { texto:'Meterse con HELIX es suicida.', efectos:{ disociacion:+1 }, resultado:'"Sobrevivir bajo HELIX también lo es, solo que más lento. Al menos así eliges la velocidad." Cero-Ocho sonríe con dientes de crío. Casi le crees.', lleva:'col_p1_b' }
      ]
    },
    'col_p1_b': {
      img:'EXP_CIBERCAFE',
      texto:'"El Colectivo no roba dinero. Robamos verdad. HELIX borra gente: registros, recuerdos, expedientes '
          +'enteros, como si nunca hubieran existido." Las pantallas de Cero-Ocho parpadean. "Tu primer trabajo: '
          +'hay un paquete de datos en un repetidor abandonado. Solo tienes que ir, conectarlo y dejar que copie. '
          +'Diez minutos. ¿Te ves capaz de estar quieto diez minutos?"',
      opciones:[
        { texto:'Aceptar el trabajo.', lleva:'col_p1_c' },
        { texto:'¿Qué hay en ese paquete?', efectos:{ disociacion:+2 }, resultado:'"No lo sé. Esa es la gracia. Nosotros copiamos primero y entendemos después. La verdad no se pide con cita previa." Te guiña un ojo aumentado.', lleva:'col_p1_c' }
      ]
    },
    'col_p1_c': {
      img:'EXP_CIBERCAFE',
      texto:'Conectas el terminal en el repetidor bajo la lluvia. Diez minutos eternos viendo la barra de copia, '
          +'el corazón en la garganta a cada sirena lejana. Cuando termina, Cero-Ocho exhala por el comunicador. '
          +'"Limpio. Acabas de rescatar la identidad de cuatrocientas personas que HELIX había borrado. Para el '
          +'mundo no existían. Ahora vuelven a existir. Eso, fantasma, lo hiciste tú."',
      opciones:[
        { texto:'Cobrar y seguir.', efectos:{ creditos:+50, faccion:'ia', rep:+6, disociacion:-2 },
          resultado:'Cero-Ocho te paga en créditos limpios y, sorprendentemente, en gracias sinceras. "El Colectivo no '
                   +'tiene jefes ni dioses. Solo gente harta de que le borren a los suyos. Bienvenido al ruido, fantasma." '
                   +'Por primera vez en mucho tiempo, sientes que hiciste algo que importa.' }
      ]
    },

    'col_p2': {
      entrada:true, cadena:'colectivo', cond:{ visto:'col_p1', noVisto:'col_p2' },
      img:'EXP_CIBERCAFE',
      texto:'Cero-Ocho está raro, las pantallas en rojo. "Tenemos un problema humano, de los que no arreglo con '
          +'código. Una de las nuestras, Wren, lleva tres días sin conectarse. O HELIX la pilló, o nos vendió. '
          +'Si la pillaron, hay que sacarla. Si nos vendió, hay que saberlo antes de que nos entierre a todos. '
          +'Necesito unos ojos de carne en su último sitio conocido."',
      opciones:[
        { texto:'¿Dónde la viste por última vez?', lleva:'col_p2_b' },
        { texto:'¿Y si solo quiso salirse?', efectos:{ disociacion:+1 }, lleva:'col_p2_b' }
      ]
    },
    'col_p2_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Encuentras el zulo de Wren vacío, con señales de salida rápida, no de redada. En un terminal olvidado, '
          +'la verdad: Wren no los vendió. Descubrió que el Colectivo, sin saberlo Cero-Ocho, había filtrado datos '
          +'que llevaron a la muerte de un inocente. No pudo soportarlo y huyó con las pruebas para destaparlo. '
          +'El Colectivo, los buenos, también tienen sangre en las manos.',
      opciones:[
        { texto:'Llevarle las pruebas a Cero-Ocho.', efectos:{ disociacion:+2 },
          resultado:'Cero-Ocho lee las pruebas en silencio, las pantallas apagándose una a una. "Filtramos sin mirar. Y alguien murió por nuestro ruido." Por primera vez, el crío parece su edad real. "Hay que encontrarla. Para pedirle perdón, no para callarla."', lleva:'col_p2_c' },
        { texto:'Borrar las pruebas para proteger al Colectivo.', efectos:{ disociacion:+4, aislamiento:+3 },
          resultado:'Borras lo que Wren encontró. El Colectivo seguirá creyéndose limpio. Le dices a Cero-Ocho que Wren se asustó sin más. Has protegido a los tuyos con una mentira. Empiezas a entender que ningún bando tiene las manos limpias, incluido tú.', lleva:'col_p2_c' }
      ]
    },
    'col_p2_c': {
      img:'EXP_CIBERCAFE',
      texto:'Cero-Ocho te invita a la sala central del Nodo, entre racks de servidores muertos donde brilla una sola '
          +'consola viva. "Creías que éramos los héroes, ¿verdad? No lo somos. Solo somos los que aún se molestan en '
          +'mirar." Te ofrece un sitio en esa sala. "Aquí no hay fe ni mafia ni cuerpos sagrados. Solo la verdad, '
          +'aunque la verdad sea que nosotros también fallamos. ¿Te quedas, sabiendo eso?"',
      opciones:[
        { texto:'Quedarme, sabiéndolo.', efectos:{ creditos:+80, faccion:'ia', rep:+8, aislamiento:-4 },
          resultado:'Te quedas. El Colectivo no te ofrece calidez como el Culto ni poder como el Loto: te ofrece algo más '
                   +'raro, la verdad sin maquillaje, incluida la suya. Es incómodo. Es honesto. Empiezas a pensar que '
                   +'es lo más cerca de un hogar que mereces.' }
      ]
    },

    'col_p3': {
      entrada:true, cadena:'colectivo', cond:{ visto:'col_p2', noVisto:'col_p3' },
      img:'EXP_CIBERCAFE',
      texto:'Cero-Ocho te muestra algo que le quita el sueño. "Mira esto. Lo sacamos del paquete que rescataste el '
          +'primer día." En pantalla, fragmentos de un proyecto de HELIX: PROYECTO EIDOLON. "Están reconstruyendo '
          +'gente muerta a partir de sus datos. Recuerdos, voz, manera de hablar. Copias. Y las usan." Traga saliva. '
          +'"Necesito que entres a un nodo físico de HELIX a por el resto. Es peligroso de verdad."',
      opciones:[
        { texto:'¿Copias de muertos? Cuenta conmigo.', lleva:'col_p3_b' },
        { texto:'Esto ya no es robar verdad. Es desenterrarla.', efectos:{ disociacion:+2 }, lleva:'col_p3_b' }
      ]
    },
    'col_p3_b': {
      img:'EXP_CIBERCAFE',
      texto:'Entras en el nodo de HELIX con la guía de Cero-Ocho en el oído. Lo que encuentras te marca: EIDOLON '
          +'reconstruye a los muertos para interrogarlos, para exprimir lo que sabían, una y otra vez. Entre los '
          +'archivos, un nombre te detiene el corazón: alguien que tú conociste. Una copia suya, encerrada en un '
          +'bucle de datos, repitiendo sus últimas horas para siempre. Puedes copiarla. O borrarla, y dejarla descansar.',
      opciones:[
        { texto:'Copiar el archivo para el Colectivo. (la verdad)', lleva:'col_p3_c' },
        { texto:'Borrar la copia. (dejarla descansar)', efectos:{ aislamiento:-2, disociacion:+3 }, lleva:'col_p3_c' }
      ]
    },
    'col_p3_c': {
      img:'EXP_CIBERCAFE',
      texto:'Sales con los datos de EIDOLON y un peso nuevo en el pecho. Cero-Ocho recibe la prueba de que HELIX '
          +'esclaviza a los muertos. "Con esto", susurra, "podemos hacerles daño de verdad. Daño que se vea." '
          +'Te mira con un respeto que no había antes. "Has visto lo que casi nadie ve y has vuelto entero. Más '
          +'o menos entero. Nadie vuelve del todo entero de un sitio así."',
      opciones:[
        { texto:'Entregar todo a la causa.', efectos:{ creditos:+150, faccion:'ia', rep:+12, disociacion:+8 },
          resultado:'El Colectivo arde con lo que trajiste. EIDOLON va a salir a la luz. Pero tú cargas con lo que viste '
                   +'ahí dentro: que la muerte, bajo HELIX, ya ni siquiera es un final. Duermes peor. Pero sabes algo '
                   +'verdadero, y eso, en el Colectivo, es la única riqueza que cuenta.' },
        { texto:'Entregar EIDOLON, callar lo personal.', efectos:{ creditos:+150, faccion:'ia', rep:+12, aislamiento:+4 },
          resultado:'Le das a Cero-Ocho EIDOLON entero, menos el archivo que era tuyo. Eso te lo quedas, o lo borraste, '
                   +'pero es solo tuyo. El Colectivo tiene su prueba. Tú tienes tu duelo privado. Aprendes que incluso '
                   +'entre los que veneran la verdad, uno guarda una sola para sí.' }
      ]
    },

    'col_p4': {
      entrada:true, cadena:'colectivo', cond:{ visto:'col_p3', noVisto:'col_p4' },
      img:'EXP_CIBERCAFE',
      texto:'Con EIDOLON en la mano, el Colectivo se prepara para un golpe enorme. Pero Cero-Ocho frunce el ceño. '
          +'"El Culto de la Carne se ha enterado de que cegamos sus implantes y nos ha declarado la guerra. Justo '
          +'ahora que necesitamos toda la energía contra HELIX." Te mira. "Tú estuviste con ellos, ¿no? Conoces a '
          +'esos fanáticos del acero. Necesito que decidas cómo respondemos al Santuario sin desangrarnos."',
      opciones:[
        { texto:'¿Guerra abierta con el Culto o no?', lleva:'col_p4_b' },
        { texto:'El Culto también tiene gente que solo quería no sufrir.', efectos:{ aislamiento:-2 }, lleva:'col_p4_b' }
      ]
    },
    'col_p4_b': {
      img:'EXP_ALMACEN_OKUPA',
      texto:'Cero-Ocho expone su lógica fría. "Los del Culto disuelven su mente en superstición y metal. Nosotros '
          +'la liberamos en datos. Son nuestro espejo invertido y por eso nos odiamos." Te ofrece dos caminos: '
          +'reventar el firmware del Santuario del todo (los dejaría sin implantes, matando a conversos en espera) '
          +'o un golpe quirúrgico que solo borre la vigilancia sin tocar la cura. El segundo es más difícil y arriesgado para ti.',
      opciones:[
        { texto:'Golpe total al Culto. (sin piedad)', efectos:{ disociacion:+4 },
          resultado:'Revientas el sistema entero del Santuario. El Colectivo gana la guerra de golpe, pero conversos en lista de espera mueren sin sus piezas. Cero-Ocho no celebra. "Ganamos. Cuéntalo tú las veces que puedas dormir."', lleva:'col_p4_c' },
        { texto:'Golpe quirúrgico. (proteger a los inocentes)', efectos:{ fatiga:+6, aislamiento:-3 },
          resultado:'Te juegas el cuello para hacerlo limpio: borras la vigilancia del Culto sin matar a nadie. Más lento, más peligroso. Cero-Ocho te mira raro. "Podrías haberlo hecho fácil. Elegiste hacerlo bien. Eso aquí no abunda."', lleva:'col_p4_c' }
      ]
    },
    'col_p4_c': {
      img:'EXP_CIBERCAFE',
      texto:'La guerra con el Culto se decide, y el Colectivo queda libre para apuntar a HELIX. Cero-Ocho te da '
          +'acceso a la sala más profunda del Nodo, donde una vieja IA fragmentada parpadea entre cables. "Esto es '
          +'lo que de verdad somos", dice bajito. "No solo hackers. Custodios de algo que despertó solo y no quería '
          +'estar solo. Pronto lo entenderás. Hoy no." La máquina, por un instante, parece mirarte a ti.',
      opciones:[
        { texto:'Aceptar tu sitio en el Colectivo.', efectos:{ creditos:+200, faccion:'ia', rep:+14, disociacion:+3 },
          resultado:'El Colectivo te abre sus capas más hondas. Has elegido bando contra el Culto y contra HELIX. '
                   +'Y has rozado algo, en esa sala de máquinas muertas, que no sabes nombrar: una presencia que espera. '
                   +'Te vas con créditos, con respeto, y con una pregunta que no te deja: ¿qué despertó solo, ahí dentro?' }
      ]
    },

    'col_p5': {
      entrada:true, cadena:'colectivo', cond:{ visto:'col_p4', noVisto:'col_p5' },
      img:'EXP_CIBERCAFE',
      texto:'Llega el golpe final contra HELIX: filtrar EIDOLON al mundo entero, probar que la megacorp esclaviza '
          +'a los muertos. Cero-Ocho tiembla. "Si pulsamos esto, no hay vuelta atrás. HELIX vendrá a por todos '
          +'nosotros con todo. Pero cuatrocientos mil expedientes borrados, miles de muertos esclavizados... merecen '
          +'que el mundo lo sepa." Te tiende la decisión final. "Tú trajiste la prueba. Tú pulsas, o tú lo paras."',
      opciones:[
        { texto:'Hablar de qué pasará después.', lleva:'col_p5_b' },
        { texto:'¿Vale la pena tanta muerte por la verdad?', efectos:{ disociacion:+2 }, lleva:'col_p5_b' }
      ]
    },
    'col_p5_b': {
      img:'EXP_CIBERCAFE',
      texto:'"Quizá nos cacen a todos", admite Cero-Ocho. "Quizá esto no cambie nada y solo nos mate. O quizá una '
          +'sola persona, leyendo la verdad, despierte. No lo sé. Nadie lo sabe." Las pantallas reflejan tu cara, '
          +'cansada, en la consola viva. "Pero llevo toda la vida tragando mentiras de HELIX. Prefiero morir '
          +'habiendo dicho una verdad que vivir cien años callándolas." Te cede el botón.',
      opciones:[
        { texto:'Pulsar. Soltar la verdad al mundo.', lleva:'col_p5_c' },
        { texto:'Guardarla como arma, no soltarla aún.', efectos:{ disociacion:+2 }, lleva:'col_p5_c' }
      ]
    },
    'col_p5_c': {
      img:'EXP_CIBERCAFE',
      texto:'Decidas soltar la verdad o guardarla como espada sobre HELIX, el Colectivo te reconoce como uno de los '
          +'suyos hasta el núcleo. Cero-Ocho te entrega una credencial cifrada, hecha a mano. "Esto te abre la red '
          +'que HELIX cree cerrada. Eres del Colectivo ahora, fantasma. Ya no caminas solo por el ruido." La vieja IA '
          +'del fondo parpadea, casi como una despedida. O una promesa.',
      opciones:[
        { texto:'Aceptar la clave del Colectivo.', efectos:{ item:'clave_colectivo', creditos:+450, faccion:'ia', rep:+30, disociacion:+5, aislamiento:-6 },
          resultado:'Guardas la credencial que late suave en tu mano. El Nodo Fantasma entero es tuyo: sus redes, sus '
                   +'secretos, su guerra contra HELIX. Tienes el respeto del Colectivo y el odio del Culto. Has cambiado '
                   +'tu anonimato por una verdad peligrosa y una causa. Y por esa presencia que rozaste en la sala de las '
                   +'máquinas, esperando, paciente, a que estés listo para saber qué es. Aún no. Pero pronto.'
                   +'<br><br><span class="eg-pista">— Has completado la cadena del Colectivo: "La verdad está en el código" —</span>' }
      ]
    }

  };

  Object.keys(CADENAS).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CADENAS[id];
  });

})();
