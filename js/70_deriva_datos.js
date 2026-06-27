// ============================================================
// BLOQUE JS-70 — DATOS DE LA DERIVA LIBRE (v0.119)
// ------------------------------------------------------------
// QUÉ ES:
//   El saco de eventos del modo "Explorar la ciudad" reconstruido
//   sobre el motor de corridas (67_corridas.js). A diferencia de
//   las corridas, la deriva NO tiene bando, ni camino fijo, ni
//   desenlace: el motor saca eventos de este saco uno tras otro
//   hasta que el jugador vuelve al apartamento o muere de verdad.
//
//   Esta es la entrega ESQUELETO: un saquito pequeño para validar
//   el bucle. El banco grande (las ~160 escenas del explorar viejo)
//   se reconecta con el "puente" en la versión siguiente.
//
// FORMATO (mismo que los eventos sueltos de corrida):
//   narrativo:    { id, tipo:'narrativo', texto, alerta?, herida?, botin?, item?,
//                   condicion?, condicionProb? }
//                 · herida → sube tu FATIGA real (te la llevas a casa).
//                 · botin  → créditos, se te pagan en el acto.
//                 · item   → objeto que se te da al inventario.
//                 · alerta → presión del distrito (empeora el ambiente).
//                 · condicion → id de condición médica (js/39) que se te aplica.
//                 · condicionProb → 0..1, prob. de que la condición prenda
//                   (si no se pone, siempre). Para accidentes (cajón, caída...).
//   confrontacion:{ id, tipo:'confrontacion', texto,
//                   enemigos:[ { nombre, desc, integridad, fuerza, umbral } ] }
//                 · se resuelve con el equipo que lleves encima.
//                 · puente:true → combate completo con VIDA LOCAL y ramas
//                   gana/pierde (perder NO te mata: dispara el desenlace
//                   escrito). gana/pierde llevan { texto?, alerta?, herida?,
//                   botin?, item?, condicion?, condicionProb? }.
//
// Cada evento se marca como visto y no se repite hasta agotar el saco.
// ============================================================

const EVENTOS_DERIVA = [

  // ── Ambiente puro (no pasa "nada", pero el sitio respira) ──
  { id:'der_lluvia', tipo:'narrativo',
    texto:'La lluvia ácida cae fina sobre las Pilas y deja un olor a metal mojado que se te mete en la garganta. '
        + 'Un anuncio holográfico parpadea sobre un charco, vendiendo una vida que nadie de aquí va a tener. '
        + 'Sigues caminando porque pararte tampoco arregla nada.',
    alerta:0 },

  { id:'der_megafonia', tipo:'narrativo',
    texto:'Una megafonía de HELIX recita, sin emoción, una lista de números de residente convocados a "revisión". '
        + 'La gente baja la cabeza y aprieta el paso. Tú también. Es lo que se hace cuando no quieres ser un número.',
    alerta:4 },

  // ── Pequeño botín de consuelo ──
  { id:'der_chatarra', tipo:'narrativo',
    texto:'Entre los restos de un puesto desmontado encuentras un puñado de chatarra que alguien dejó por inútil. '
        + 'Para ti no lo es. Te la guardas: en las Pilas, todo lo que pesa, vale.',
    item:'chatarra' },

  // Hallazgo raro: una ficha sin marcas, llave de los Niveles Bajos. Solo
  // entra en el saco si aún no tienes cómo bajar al clandestino. (v0.137)
  { id:'der_ficha_sin_marcas', tipo:'narrativo',
    texto:'En un callejón sin salida, junto a un cuerpo que lleva ahí el tiempo justo para que nadie pregunte, '
        + 'algo gris asoma del agua sucia. Una ficha sin marcas: sin números, sin logo, sin nada. La limpias con '
        + 'el pulgar y entiendes lo que tienes entre los dedos. Una llave para los Niveles Bajos. La guardas antes '
        + 'de que alguien te vea guardarla.',
    item:'pase_mercado',
    cond:function(){ return typeof _mercadoClandestinoDesbloqueado === 'function' && !_mercadoClandestinoDesbloqueado(); } },

  { id:'der_creditos', tipo:'narrativo',
    texto:'Un crío te para y te ofrece un dato: dónde hay una cola corta para el agua racionada. No te interesa, '
        + 'pero le sigues el juego, y al irse se le cae un fajo pequeño que él no echa en falta. Lo recoges sin ruido.',
    botin:25, alerta:3 },

  // ── Coste físico (sube fatiga real → te la llevas a casa) ──
  { id:'der_escalera', tipo:'narrativo',
    texto:'El ascensor del bloque lleva semanas muerto. Subes a pie catorce plantas por una escalera que huele a humedad '
        + 'y a gente. Llegas arriba con las piernas temblando y los pulmones ardiendo, pero llegas.',
    herida:7 },

  { id:'der_redada', tipo:'narrativo',
    texto:'Una redada de seguridad corta la calle de golpe. Te empujan contra una pared, te cachean sin mirarte a la cara '
        + 'y te sueltan cuando se aburren. Sales con un hombro dolorido y la sensación de no ser nadie.',
    herida:5, alerta:10 },

  // ── Confrontaciones (se resuelven con tu equipo) ──
  { id:'der_carterista', tipo:'confrontacion',
    texto:'Un chaval flaco te ha estado siguiendo media calle y por fin se decide: te corta el paso con una navaja que '
        + 'le tiembla en la mano. No quiere hacerte daño. Quiere lo que lleves encima, y tiene hambre de la de verdad.',
    enemigos:[ { nombre:'Carterista', desc:'Flaco, asustado, rápido', tipo:'cobarde', integridad:2, fuerza:2, umbral:2 } ] },

  { id:'der_maton', tipo:'confrontacion',
    texto:'Un matón de cobros te reconoce, o cree reconocerte. "Tú le debes a quien yo cobro", dice, y no parece de los '
        + 'que escuchan explicaciones. Cierra el callejón con su cuerpo y espera a ver qué haces.',
    enemigos:[ { nombre:'Matón de cobros', desc:'Grande y sin prisa', tipo:'bruto', integridad:3, fuerza:3, umbral:3 } ] },

  // ── Confrontaciones que estrenan los estados (v0.128) ──
  { id:'der_navajero', tipo:'confrontacion',
    texto:'Sale de un quicio sin avisar, navaja baja y pasos cortos. No habla, no amenaza: solo busca el hueco para '
        + 'rajarte y salir corriendo con lo que pueda. Si te descuidas, te deja sangrando en mitad de la calle.',
    enemigos:[ { nombre:'Navajero', desc:'Corta y se aparta · te hace sangrar', tipo:'rapido', integridad:2, fuerza:3, umbral:2 } ] },

  { id:'der_pareja_cobro', tipo:'confrontacion',
    texto:'Dos figuras te cierran la calle: uno enorme, plantado como un muro, y otro pequeño que se esconde detrás y '
        + 'habla mucho. El grande no tiene prisa. El pequeño, en cuanto la cosa se ponga fea, va a recordar que tiene piernas.',
    enemigos:[
      { nombre:'El grandullón', desc:'Aguanta y aturde', tipo:'bruto', integridad:3, fuerza:4, umbral:6 },
      { nombre:'El bocazas', desc:'Huye si se tuerce', tipo:'cobarde', integridad:2, fuerza:2, umbral:2 }
    ] },

  { id:'der_banda_esquina', tipo:'confrontacion',
    texto:'Una esquina mal iluminada, tres siluetas y uno que claramente manda. Mientras él aguante, los otros se crecen. '
        + 'Y si esto se llena de ruido, la calle tiene oídos: en nada baja alguien más a ver el espectáculo.',
    enemigos:[
      { nombre:'El que manda', desc:'Mátalo y los otros dudan', tipo:'lider', integridad:3, fuerza:4, umbral:4 },
      { nombre:'Secuaz', desc:'Fiel mientras gane', integridad:2, fuerza:3, umbral:2 }
    ],
    refuerzoSiRuido:60,
    refuerzoGrupo:[ { nombre:'Curioso con ganas', desc:'El ruido lo trajo', tipo:'rapido', integridad:2, fuerza:3, umbral:2 } ] },

  // ── Accidentes: la ciudad se cae a pedazos y a veces te lleva por delante.
  //    Siempre cuestan fatiga; la condición médica prende solo a veces.
  { id:'der_cajon', tipo:'narrativo',
    texto:'Un archivador metálico abandonado en un rellano. El cajón de abajo está hinchado por la humedad y promete '
        + 'algo dentro. Tiras con ganas, cede de golpe, y el filo oxidado te muerde el antebrazo antes de que apartes '
        + 'la mano. Dentro no había nada. Nunca hay nada.',
    herida:5, condicion:'herida_brazo_d_leve', condicionProb:0.7 },

  { id:'der_escalera_incendios', tipo:'narrativo',
    texto:'Bajas por una escalera de incendios para acortar. A media altura un peldaño cede con un crujido seco y caes '
        + 'el resto del tramo, rebotando en el metal. Te quedas un momento tirado en el descansillo, mirando el cielo '
        + 'naranja entre las rejas, hasta que el cuerpo te deja levantarte.',
    herida:9, condicion:'pierna_herida_grave', condicionProb:0.45, alerta:2 },

  { id:'der_puerta_auto', tipo:'narrativo',
    texto:'Una puerta automática de un acceso de servicio se traba a medio cerrar. Calculas que pasas, y casi. Te pilla '
        + 'el costado con la fuerza tonta de un motor barato que no sabe que estás ahí. Te sueltas a tirones, sin aire, '
        + 'y la puerta sigue intentando cerrarse sobre el vacío.',
    herida:6, condicion:'costillas', condicionProb:0.55 },

  { id:'der_cable', tipo:'narrativo',
    texto:'Te apoyas en una barandilla para no resbalar y notas tarde el cable pelado que serpentea por ella, brillante '
        + 'de lluvia ácida. El chispazo te sube por el brazo y te deja la mandíbula apretada y el mundo girando un par '
        + 'de segundos. Sueltas la barandilla como si quemara. Quemaba.',
    herida:6, condicion:'mareado', condicionProb:0.7 },

  { id:'der_fuga_sotano', tipo:'narrativo',
    texto:'Cruzas un sótano de mantenimiento buscando un atajo. El aire sabe dulce y raro, y para cuando tu cabeza '
        + 'entiende que eso es una fuga, ya llevas un rato respirándola. Sales tosiendo a la calle, con un dolor sordo '
        + 'detrás de los ojos y las manos que no terminan de obedecer.',
    herida:7, condicion:'envenenado', condicionProb:0.6 },

  { id:'der_chapa', tipo:'narrativo',
    texto:'Rebuscas entre los contenedores y una chapa oxidada cede bajo tu peso. El borde te abre la palma de un tajo '
        + 'limpio que tarda un segundo en empezar a sangrar y luego no para. Te aprietas la mano contra la ropa y sigues, '
        + 'dejando un reguero pequeño que la lluvia borra detrás de ti.',
    herida:4, condicion:'hemorragia', condicionProb:0.7 },

  { id:'der_apagon', tipo:'narrativo',
    texto:'Un apagón se traga el bloque entero de golpe. En la oscuridad total pisas un charco que no veías, el pie se '
        + 'va, y la nuca encuentra el suelo antes que las manos. Cuando vuelven las luces de emergencia, parpadeando en '
        + 'rojo, sigues sentado en el agua, esperando a que el techo deje de moverse.',
    herida:6, condicion:'conmocion', condicionProb:0.5, alerta:3 },

  // ── Confrontación CON PUENTE: una pelea que puedes perder sin morir.
  //    Vida local; perder dispara un desenlace escrito (te despiertas robado).
  { id:'der_emboscada_puente', tipo:'confrontacion', puente:true,
    texto:'Dos sombras salen de un portal a la vez, una por delante y otra por detrás. No dicen nada: ya lo han hecho '
        + 'otras veces y saben que las palabras solo dan tiempo a la víctima. Te ves la espalda contra una persiana '
        + 'metálica y entiendes que esto se decide en los próximos diez segundos.',
    integridad:9,
    enemigos:[
      { nombre:'El que entra de frente', desc:'Te ocupa, no te mata', tipo:'bruto', integridad:3, fuerza:3, umbral:4 },
      { nombre:'El de la espalda', desc:'Rápido, busca el descuido', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
    ],
    gana:{ texto:'Cuando el segundo entiende que no sales gratis, los dos se evaporan por donde vinieron. Te quedas '
        + 'jadeando contra la persiana, entero, con las manos temblando por la adrenalina más que por el miedo. En el '
        + 'suelo, lo que se les cayó en la prisa: unas monedas y poco más. Te lo guardas.',
      botin:35, herida:5 },
    pierde:{ texto:'Te despiertas tirado en el portal sin saber cuánto tiempo ha pasado. La cabeza te martillea y la '
        + 'ropa está revuelta: te han vaciado los bolsillos sueltos con la calma de quien lo hace a diario. No te han '
        + 'matado. Tampoco hacía falta. En las Pilas, a veces basta con recordarte que no eres nada.',
      herida:10, condicion:'conmocion', condicionProb:0.7, alerta:6 } }

];

window.EVENTOS_DERIVA = EVENTOS_DERIVA;
