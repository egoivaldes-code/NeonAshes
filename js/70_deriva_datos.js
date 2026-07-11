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
      herida:10, condicion:'conmocion', condicionProb:0.7, alerta:6 } },

  // ════════════════════════════════════════════════════════
  //  AMPLIACIÓN v0.140 — más saco para que la deriva no se seque.
  //  Reciclan al agotarse el saco, así que el ambiente vuelve a
  //  respirar a largo plazo. Sin siembra de hilo Centauri.
  // ════════════════════════════════════════════════════════

  // ── Ambiente puro (el grueso: el sitio respira) ──────────
  { id:'der_amb_vapor', tipo:'narrativo',
    texto:'Una rejilla del subsuelo escupe vapor caliente que huele a refrigerante y a comida que alguien cocina abajo, donde no llega la luz. '
        + 'Un perro sin dueño duerme encima, agradecido. Le envidias el sitio. Sigues.',
    alerta:0 },

  { id:'der_amb_neon_muerto', tipo:'narrativo',
    texto:'Un letrero de neón al que le faltan letras anuncia un local cerrado hace años: de "HOTEL PARAÍSO" solo queda "HOT   AÍS", parpadeando en rojo sobre nadie. '
        + 'Nadie lo arregla porque nadie lo mira, y aun así sigue encendido, gastando una luz que ya no llama a ninguna puerta.',
    alerta:0 },

  { id:'der_amb_cola', tipo:'narrativo',
    texto:'Una cola larga y callada espera frente a una ventanilla de servicios de HELIX que aún no ha abierto, y puede que no abra hoy. '
        + 'La gente lleva los papeles en bolsas de plástico para que la lluvia no se los borre. Aprendieron que aquí lo único que cuenta es el papel, y el papel se moja.',
    alerta:2 },

  { id:'der_amb_musica', tipo:'narrativo',
    texto:'De una ventana entreabierta sale música: una canción vieja, de antes de todo esto, cantada por una voz que ya no graba nadie. '
        + 'Te paras sin querer. La calle entera parece bajar el volumen un segundo, como si también ella la reconociera. Luego la ventana se cierra y vuelve el zumbido de siempre.',
    alerta:0 },

  { id:'der_amb_altar', tipo:'narrativo',
    texto:'En una esquina, un altar improvisado: velas eléctricas baratas, fotos plastificadas, un nombre escrito a mano sobre un cartón. '
        + 'Alguien murió aquí y alguien más se niega a dejar que el sitio lo olvide. En las Pilas, recordar a un muerto es casi el único lujo que no cobra HELIX.',
    alerta:0, disociacion:2 },

  { id:'der_amb_obra', tipo:'narrativo',
    texto:'Una obra parada a medias: andamios oxidados, una grúa quieta, un cartel que prometió "VIVIENDA DIGNA PARA EL SECTOR" con una fecha de entrega de hace seis años. '
        + 'Dentro del esqueleto de hormigón vive gente igual, sin esperar a que lo terminen. Lo terminaron a su manera.',
    alerta:1 },

  { id:'der_amb_lluvia_para', tipo:'narrativo',
    texto:'Por un momento raro, la lluvia ácida para. El silencio que deja es tan poco habitual que la gente sale a los portales, mira el cielo sucio y no dice nada. '
        + 'Dura tres minutos. Luego vuelve a caer, y todos vuelven dentro, como si el descanso hubiera sido un error administrativo que alguien corrigió.',
    alerta:0, fatiga:-2 },

  { id:'der_amb_tren', tipo:'narrativo',
    texto:'Un tren de carga automatizado cruza el viaducto sobre tu cabeza, kilométrico, sin un alma a bordo, llevando contenedores con el logo de HELIX hacia algún sitio que no es este. '
        + 'Toda esa riqueza pasando por encima y ni una caja que se caiga. Está calculado así. Todo lo está.',
    alerta:0 },

  // ── Pequeños hallazgos de consuelo ───────────────────────
  { id:'der_termo', tipo:'narrativo',
    texto:'En un banco, alguien ha olvidado —o dejado a propósito— un termo todavía tibio. Dentro, un caldo aguado que sabe a poco y a mucho a la vez. '
        + 'Te lo bebes despacio, vigilando, agradecido a un desconocido que quizá no quería compartir nada, solo se le hizo tarde.',
    fatiga:-4 },

  { id:'der_mantas', tipo:'narrativo',
    texto:'Un reparto clandestino de mantas térmicas, de esos que organiza gente del barrio cuando HELIX mira a otro lado. '
        + 'Te dan una sin preguntar, porque preguntar sería humillar. Pesa nada y abriga como una promesa cumplida.',
    fatiga:-3, alerta:-2 },

  { id:'der_chatarra_buena', tipo:'narrativo',
    texto:'Un electrodoméstico reventado en plena acera, todavía con piezas que valen. Nadie lo ha tocado: o lo acaban de tirar, o tiene mala fama. '
        + 'Le sacas lo aprovechable con dedos rápidos y sigues antes de averiguar cuál de las dos cosas era.',
    item:'chatarra', alerta:1 },

  { id:'der_licor', tipo:'narrativo',
    texto:'En la trastienda de un puesto cerrado, una botella de licor barato que el dueño no echará en falta esta noche. '
        + 'No es robar, te dices: es redistribuir lo que el frío te ha quitado. La excusa es mala. La botella, no.',
    item:'licor', alerta:2 },

  // ── Encontronazos que cuestan (sin pelea, accidentes/presión)
  { id:'der_control', tipo:'narrativo',
    texto:'Un control improvisado de HELIX corta la calle. Te cachean sin mirarte a la cara, te escanean la muñeca y te sueltan con un "circule" que no admite respuesta. '
        + 'No has hecho nada. Da igual. El miedo que te queda en el cuerpo es real aunque la causa no exista.',
    alerta:5, fatiga:+3 },

  { id:'der_resbalon', tipo:'narrativo',
    texto:'Un tramo de rejilla cubierto de un limo verdoso te traiciona. El golpe contra el suelo te saca el aire y un dolor sordo se te instala en el costado. '
        + 'Te levantas a la primera porque quedarse en el suelo, en las Pilas, es una invitación.',
    herida:4, condicion:'costillas', condicionProb:0.4 },

  { id:'der_gas', tipo:'narrativo',
    texto:'Una nube baja de gas de alcantarilla te envuelve antes de que puedas rodearla. Te arde la garganta, los ojos lloran, el mundo se vuelve borroso un par de calles. '
        + 'Toses hasta que algo dentro de ti decide que vas a vivir, y sigues, mareado, maldiciendo el aire que te toca respirar.',
    herida:3, condicion:'mareado', condicionProb:0.5, alerta:1 },

  // ── AMPLIACIÓN 2 (v0.140) ────────────────────────────────
  { id:'der_amb_titiritero', tipo:'narrativo',
    texto:'Un hombre maneja una marioneta hecha de chatarra y cable ante un puñado de críos sin abrigo. La figura baila a tirones, chirriando, y aun así los niños ríen como si fuera magia. '
        + 'Le echas una moneda al sombrero porque hacer reír aquí, con tan poco, merece pagarse.',
    creditos:-3, aislamiento:-3 },

  { id:'der_amb_ropa_tendida', tipo:'narrativo',
    texto:'Entre dos bloques, una maraña de cuerdas con ropa tendida que no se secará nunca con esta humedad. La gente la cuelga igual, por costumbre, por dignidad, por tener algo que parezca un hogar. '
        + 'Una sábana se agita como una bandera de un país que no existe.',
    alerta:0 },

  { id:'der_amb_predica_muerta', tipo:'narrativo',
    texto:'Un altavoz roto repite, deformado, el final de un sermón del Eco grabado quién sabe cuándo: "...y lo que fuisteis, lo seréis de nuevo..." y ahí se corta, y vuelve a empezar. '
        + 'Nadie lo escucha. Nadie lo apaga. Es parte del ruido de fondo, como el goteo y el zumbido.',
    disociacion:2 },

  { id:'der_amb_mercado_cierra', tipo:'narrativo',
    texto:'El mercado recoge. Los puestos bajan persianas, los vendedores cuentan lo poco del día a la luz de una linterna, y los últimos compradores regatean por lo que va a sobrar. '
        + 'A esta hora todo está más barato y más triste, que en las Pilas suelen ir juntas.',
    alerta:0 },

  { id:'der_amb_pareja', tipo:'narrativo',
    texto:'En un soportal, una pareja discute en voz baja, de las discusiones que duelen precisamente por no levantar la voz. Ella mira al suelo. Él mira a otro lado. '
        + 'Pasas de largo deprisa, con el pudor de quien pisa sin querer la intimidad de dos desconocidos.',
    aislamiento:2 },

  { id:'der_amb_ancianos', tipo:'narrativo',
    texto:'Tres ancianos sentados en sillas de plástico junto a un brasero ven pasar el mundo sin comentarlo. Han visto pasar tanto que ya no hace falta. '
        + 'Uno te sigue con la mirada hasta que doblas la esquina, evaluándote en un segundo con la frialdad serena de quien ha enterrado a mucha gente con prisa.',
    alerta:0 },

  { id:'der_busca_perro', tipo:'narrativo',
    texto:'Carteles pegados en cada farola: una foto borrosa de un perro y la palabra "PERDIDO" repetida calle tras calle, con un número de contacto tachado y reescrito varias veces. '
        + 'Quienquiera que lo busca lleva mucho buscándolo. Esperas, sin motivo, que lo encuentre.',
    aislamiento:1 },

  { id:'der_vendedora_calor', tipo:'narrativo',
    texto:'Una mujer vende boniatos asados de un bidón humeante. Te da uno antes de que pagues, "para que decidas con la mano caliente". Está bueno y abriga por dentro un buen rato. '
        + 'Pequeñas economías de la amabilidad, las que sostienen el barrio cuando todo lo demás falla.',
    creditos:-5, fatiga:-4 },

  { id:'der_caja_libros', tipo:'narrativo',
    texto:'Una caja de libros de papel reblandecidos por la lluvia, abandonada junto a un contenedor. Objetos inútiles, pesados, prohibidos de hecho por las tasas de "material no homologado". '
        + 'Rescatas uno al azar y te lo guardas. No vas a leerlo. Solo quieres que algo escrito sobreviva una noche más.',
    item:'chatarra', aislamiento:-2 },

  { id:'der_ladron_torpe', tipo:'narrativo',
    texto:'Un crío te tantea el bolsillo con manos que aún no saben hacerlo bien. Le agarras la muñeca sin apretar. Os miráis. Tiene hambre y miedo a partes iguales. Lo sueltas. '
        + 'Echa a correr sin mirar atrás. No le faltaba nada tuyo; te faltaba a ti la crueldad necesaria para esta ciudad.',
    aislamiento:1 },

  { id:'der_apagon', tipo:'narrativo',
    texto:'Sin aviso, un tramo entero de las Pilas se queda a oscuras: cortan la luz por sectores cuando el consumo sube. Durante unos minutos, la única iluminación son los anuncios, que nunca se apagan. '
        + 'La gente, a oscuras, vendida a la luz de la publicidad. Cuando vuelve la corriente, casi se agradece menos de lo que debería.',
    alerta:3, disociacion:3 },

  { id:'der_cable_caido', tipo:'narrativo',
    texto:'Un cable de alta tensión cuelga suelto, chisporroteando contra un charco, y alguien ha improvisado una barrera con cajas para que nadie pise. No hay nadie de mantenimiento. No lo habrá. '
        + 'Rodeas con cuidado el rincón electrificado, otra trampa más de una ciudad que se cae a pedazos sobre quien vive debajo.',
    herida:2, condicion:'conmocion', condicionProb:0.2, alerta:1 },

  // ── AMPLIACIÓN 3 (v0.140) ────────────────────────────────
  { id:'der_amb_barbero', tipo:'narrativo',
    texto:'Un barbero afeita a un cliente a navaja, a la puerta de su local, aprovechando una farola que aún funciona. Los dos charlan bajito de nada en particular. '
        + 'Es una escena tan corriente, tan de antes de todo, que te detienes un segundo solo por verla seguir existiendo.',
    aislamiento:-2 },

  { id:'der_amb_escuela', tipo:'narrativo',
    texto:'Por la ventana de un sótano oyes a un grupo de niños repetir a coro una lección: las normas de convivencia de HELIX, recitadas como una canción. "Declara. Coopera. Pertenece." '
        + 'Las voces son dulces. La letra, no. Aprietas el paso antes de aprenderte el estribillo.',
    disociacion:2 },

  { id:'der_amb_florista', tipo:'narrativo',
    texto:'Una mujer vende flores de plástico tan bien hechas que de lejos engañan. "Duran más que las de verdad —dice—, y aquí lo de verdad dura poco." Tiene razón en las dos cosas. '
        + 'En las Pilas, hasta la belleza ha aprendido a ser sintética para sobrevivir.',
    alerta:0 },

  { id:'der_amb_taxi', tipo:'narrativo',
    texto:'Un taxi automatizado espera en una parada a un cliente que no va a llegar, con el cartel de LIBRE encendido sobre una calle donde nadie puede pagarlo. '
        + 'Lleva ahí tanto que ya forma parte del paisaje. Espera con la paciencia infinita de las máquinas, que es la peor de las paciencias.',
    alerta:0 },

  { id:'der_amb_velatorio', tipo:'narrativo',
    texto:'Tras un cristal, una sala de "tránsito" de HELIX: ataúdes de cartón reciclado apilados con etiqueta de código de barras, listos para la incineradora común. '
        + 'Un cartel informa de las tarifas de despedida "según paquete contratado". La muerte, como todo, viene en planes con letra pequeña.',
    disociacion:4 },

  { id:'der_busker_robot', tipo:'narrativo',
    texto:'Un músico callejero toca un instrumento hecho de tubos y latas con una destreza que no encaja con su pinta. La melodía es triste y bonita y no la has oído nunca. '
        + 'Le dejas una moneda. Él inclina la cabeza sin dejar de tocar, y sigues con la canción persiguiéndote media calle.',
    creditos:-2, aislamiento:-3 },

  { id:'der_pan_caliente', tipo:'narrativo',
    texto:'Pasas por delante de un horno clandestino justo cuando sacan la hornada. El olor a pan caliente te golpea con una fuerza casi violenta, te llena la boca de saliva y la cabeza de cosas viejas. '
        + 'Compras una pieza con lo poco que llevas. Te la comes andando, despacio, como quien no quiere que se acabe.',
    creditos:-4, fatiga:-3, hambre:-12 },

  { id:'der_reloj_roto', tipo:'narrativo',
    texto:'Un reloj público enorme, de los que antes daban la hora a todo el barrio, lleva años parado a las 3:47. Nadie lo arregla; nadie sabe ya si era de día o de noche cuando se detuvo. '
        + 'La gente ha aprendido a vivir sin esa hora, igual que aprende a vivir sin casi todo.',
    disociacion:2 },

  { id:'der_bici_reparto', tipo:'narrativo',
    texto:'Un repartidor en bicicleta pasa pedaleando como alma que lleva el diablo, esquivando charcos, con la mochila térmica a la espalda y la app marcándole un tiempo imposible. '
        + 'Si llega tarde, no cobra. Si va rápido, se mata. Te apartas para dejarle sitio; es lo menos.',
    alerta:0 },

  { id:'der_okupa_amable', tipo:'narrativo',
    texto:'Desde un edificio okupado, alguien te invita con un gesto a un té caliente que reparten en la entrada, sin preguntar quién eres. "Hoy toca, mañana ya veremos", dice una mujer mientras llena vasos desparejados. '
        + 'Aceptas. El té sabe a hierbas raras y a una hospitalidad que no debería existir en un sitio así, y existe.',
    fatiga:-4, aislamiento:-4 },

  { id:'der_carterista', tipo:'narrativo',
    texto:'Notas el roce justo a tiempo y te giras: una mano se retira de tu bolsillo demasiado rápido y se pierde entre la gente. No te han sacado nada, pero el corazón se te dispara igual. '
        + 'Caminas el resto del tramo con la mano sobre el bolsillo, recordando que en las Pilas la confianza también se roba, gota a gota.',
    fatiga:+3, alerta:2 },

  { id:'der_inundacion', tipo:'narrativo',
    texto:'Una calle entera anegada por un desagüe reventado obliga a todos a vadear o a rodear. Eliges mal y acabas con el agua sucia por encima del tobillo, fría como una mala noticia. '
        + 'Sales al otro lado calado y maldiciendo, secándote como puedes, con la certeza de que mañana volverá a pasar.',
    herida:1, condicion:'envenenado', condicionProb:0.2, alerta:1 },

  // ── AMPLIACIÓN 4 (v0.140) ────────────────────────────────
  { id:'der_amb_zapatero', tipo:'narrativo',
    texto:'Un zapatero remienda botas a la luz de un flexo, rodeado de pares que esperan dueño o que nunca lo tuvieron. "La gente ya no compra, repara —dice sin levantar la vista—. Buena señal para mí. Mala para todos."',
    aislamiento:-2 },

  { id:'der_amb_funcionario', tipo:'narrativo',
    texto:'Un funcionario de HELIX, traje gris y paraguas que sí funciona, cruza el barrio mirando una tablilla, anotando cosas de los edificios sin mirar a la gente que vive en ellos. '
        + 'A su paso, las conversaciones bajan de volumen. Cuando se va, el barrio respira. Nadie sabe qué anotaba. Eso es lo que asusta.',
    alerta:4 },

  { id:'der_amb_pajaro_real', tipo:'narrativo',
    texto:'Un pájaro de verdad —de los pocos que quedan— se ha colado entre las pasarelas y no encuentra salida, golpeándose contra una claraboya sucia. La gente se para a mirarlo, embobada, como ante una reliquia. '
        + 'Alguien abre una ventana. El pájaro tarda en entenderlo. Cuando por fin sale, un pequeño suspiro colectivo recorre la calle.',
    aislamiento:-3 },

  { id:'der_amb_costurera', tipo:'narrativo',
    texto:'Una costurera convierte uniformes viejos de HELIX en ropa de calle, descosiendo logos, dándoles la vuelta, borrando de quién fueron. "Todo el mundo acaba vistiéndose con lo que sobró de otra cosa", dice con alfileres en la boca. '
        + 'Tiene razón. Tú mismo, probablemente, llevas encima el descosido de la vida de alguien.',
    alerta:0 },

  { id:'der_amb_perro_espera', tipo:'narrativo',
    texto:'Un perro espera sentado a la puerta de un local clausurado, mirando la persiana bajada con una paciencia que duele. Lleva días. La gente le deja restos. Él come y vuelve a sentarse a esperar a alguien que no va a salir. '
        + 'Sigues, con un nudo tonto en la garganta por un perro que no es tuyo.',
    aislamiento:1 },

  { id:'der_sopa', tipo:'narrativo',
    texto:'Un comedor del Eco reparte sopa caliente desde una olla enorme, sin preguntar nombres ni números. Te ponen un cazo en un vaso reutilizado y un trozo de pan duro para mojar. '
        + 'No es mucho. Es todo. Comes de pie, con otros que comen igual, y por un momento el frío de las Pilas pierde la primera batalla del día.',
    fatiga:-5, hambre:-12, aislamiento:-3 },

  { id:'der_trueque', tipo:'narrativo',
    texto:'Un puesto de trueque donde no se aceptan créditos, solo cambio: una cosa por otra. Cambias algo de chatarra que no recordabas llevar por una ración y un trozo de jabón. '
        + 'Sin números, sin registro, sin HELIX en medio. Una economía vieja, humana, que sobrevive en los rincones donde la otra no llega.',
    item:'racion_deshidratada', alerta:0 },

  { id:'der_navaja_suelo', tipo:'narrativo',
    texto:'Medio enterrada en el barro de un solar, una navaja cerámica todavía con filo. Alguien la perdió huyendo, o la tiró tras usarla; no quieres saber cuál. La limpias contra el pantalón y te la guardas. '
        + 'En las Pilas, un filo de más es un argumento de más, y nunca sobran.',
    item:'navaja_ceramica', alerta:1 },

  { id:'der_atasco_humano', tipo:'narrativo',
    texto:'Un cuello de botella humano: cientos de personas embudadas en un paso estrecho porque HELIX ha cerrado la salida principal "por mantenimiento". Avanzas a empujones, codo contra codo, '
        + 'respirando el aliento de extraños, hasta que el embudo te escupe al otro lado, mareado y con menos paciencia de la que entraste.',
    fatiga:+4, alerta:1 },

  { id:'der_techo_cede', tipo:'narrativo',
    texto:'Un trozo de cornisa se desprende del edificio y revienta contra la acera a un par de metros de ti, lanzando esquirlas de hormigón. Te cubres tarde. La ciudad se cae a cachos sobre quien pasa debajo, '
        + 'y nadie firma la responsabilidad: un edificio sin dueño claro es un edificio que mata gratis.',
    herida:5, condicion:'conmocion', condicionProb:0.35, alerta:1 },

  { id:'der_perro_jauria', tipo:'narrativo',
    texto:'Una jauría de perros asilvestrados cruza la calle a la carrera, flacos y nerviosos, y por un segundo dudas si vienen a por ti. Pasan de largo, persiguiendo algo o huyendo de algo peor. '
        + 'Te quedas con el pulso a mil, recordando que en las Pilas hasta los animales han aprendido a moverse en manada para no morir solos.',
    fatiga:+3, alerta:2 },

  { id:'der_buen_samaritano', tipo:'narrativo',
    texto:'Resbalas en un tramo helado y, antes de caer del todo, una mano desconocida te agarra del brazo y te endereza. "Cuidado, que esto está fatal." No esperas un gracias y la persona ya se aleja, '
        + 'sin más, como si sostener a un extraño fuera lo normal. A veces, sorprendentemente, lo es. Sigues, sostenido un rato por ese gesto.',
    aislamiento:-4 },

  // ── AMPLIACIÓN 5 · LORE DEL SISTEMA SOLAR (v0.140) ───────
  //  El universo asoma EN Las Pilas: carga, diáspora, paredes,
  //  gente de paso. Sin viajes. Sin hilo Centauri.

  { id:'der_lore_acero', tipo:'narrativo',
    texto:'Un convoy de lingotes cruza el viaducto rumbo a los muelles, cada uno con el sello de fundición marciano grabado a fuego: el yunque y tres estrellas. Acero orbital, del que sostiene media humanidad. '
        + 'Dicen que en Marte lo llaman "El Yunque del Sistema Solar", y que por cada lingote que sale de allí, alguien dejó un pulmón en la refinería.',
    alerta:0, disociacion:2 },

  { id:'der_lore_arrabal', tipo:'narrativo',
    texto:'Un rincón del Arrabal Carmesí huele distinto: especias que no son de aquí, música de cuerdas tristes, paredes pintadas de un rojo polvoriento que imita la tierra de un planeta que la mayoría de los que viven aquí no volverán a pisar. '
        + 'Sobre una puerta, escrito a mano: "La Tierra habla. Marte construye." Los refugiados marcianos guardan su mundo en una calle prestada.',
    aislamiento:-2, disociacion:2 },

  { id:'der_lore_recluta', tipo:'narrativo',
    texto:'Un holograma recluta para el Cinturón: una sonrisa, un casco reluciente, "CONTRATO DE CINCO AÑOS · ALOJAMIENTO Y AIRE INCLUIDOS · VUELVE RICO". En letra que parpadea demasiado rápido para leerla: las cláusulas de "desgaste pulmonar no cubierto". '
        + 'Debajo, alguien ha tachado "vuelve rico" y ha escrito "vuelve".',
    alerta:0 },

  { id:'der_lore_minero', tipo:'narrativo',
    texto:'Un hombre tose en un banco, una tos honda de polvo de roca que ya no se va. Lleva tatuado en el antebrazo el código de una estación minera de Fobos. Veinte años picando asteroides para las refinerías marcianas, '
        + 'y de vuelta en tierra con los pulmones grises y una pensión que no llega. "Allá arriba el silencio es distinto", murmura, a nadie. "Aquí hay demasiado ruido para pensar."',
    aislamiento:1, disociacion:2 },

  { id:'der_lore_selene', tipo:'narrativo',
    texto:'Un anuncio enorme vende pasajes desde los muelles hasta Selene Terminal: cúpulas blancas sobre el gris de la Luna, andenes infinitos, la promesa de un sitio mejor a un trasbordo de distancia. '
        + '"TODOS LOS CAMINOS ESPACIALES PASAN POR KILÓMETRO CERO", dice el lema. La gente lo mira como se mira el mar desde una celda: sabiendo que existe y que no es para ti.',
    disociacion:3 },

  { id:'der_lore_tripulante', tipo:'narrativo',
    texto:'Un tripulante duerme sentado en un portal, esperando enrolarse en la siguiente nave que salga. Huele a aire reciclado y a metal, ese olor que no se quita tras años respirando el mismo aire mil veces. '
        + 'Lleva en el cuello el tatuaje de una ruta: Tierra, Luna, Cinturón, y un tramo borrado a propósito. Gente que pertenece al trayecto, nunca al destino.',
    aislamiento:1 },

  { id:'der_lore_fantasmas', tipo:'narrativo',
    texto:'En un muro, fresco, un símbolo: un casco marciano partido por la mitad. La marca de los Fantasmas de Marte, los que sobrevivieron a la guerra que oficialmente terminó y que ellos nunca dieron por terminada. '
        + 'Antes de que lo termines de mirar, un operario de HELIX ya viene a taparlo con pintura gris. Mañana habrá otro en otra pared. Siempre lo hay.',
    alerta:4, disociacion:2 },

  { id:'der_lore_manifiesto', tipo:'narrativo',
    texto:'La megafonía del puerto recita manifiestos de carga con voz plana: "Titanio refinado, destino Deimos. Componentes estructurales, destino estación Ganímedes. Suministro médico, destino Cinturón Principal, retraso estimado: cuatro meses." '
        + 'Toda la riqueza de la humanidad pasando de largo, listada como quien lee la lista de la compra de un dios indiferente.',
    alerta:0, disociacion:2 },

  { id:'der_lore_escarlata', tipo:'narrativo',
    texto:'Una placa conmemorativa, medio arrancada de la pared, recuerda "a los caídos en el restablecimiento del orden, Operación Silencio Escarlata". La versión de HELIX. Debajo, a navaja, alguien ha grabado otros nombres, '
        + 'muchos más, los que la placa no nombra. La historia oficial y la historia real, una encima de la otra, en el mismo trozo de metal oxidado.',
    disociacion:3, alerta:2 },

  { id:'der_lore_correo_orbital', tipo:'narrativo',
    texto:'Una oficina de correo orbital reparte mensajes con meses de retraso: cápsulas de datos que viajaron desde estaciones lejanas a la velocidad de las cosas pesadas. Una mujer abre la suya en plena calle, '
        + 'la escucha con los ojos cerrados, y sonríe a una voz que la grabó hace medio año y que, a saber, quizá ya no esté para repetirla. La distancia, aquí, también se mide en tiempo.',
    aislamiento:1, disociacion:2 },

  { id:'der_lore_chatarra_orbital', tipo:'narrativo',
    texto:'Entre los desechos de un taller, una placa de blindaje con la curvatura inconfundible de un casco de nave y marcas de micrometeoritos. Chatarra caída del cielo, literalmente: restos de algo que orbitó y dejó de hacerlo. '
        + 'La recoges. Aquí abajo, hasta los pedazos del espacio acaban valiendo por su peso en metal.',
    item:'chatarra', disociacion:2 },

  // ══ Tanda "deriva" (v0.161): sucesos de ambiente nuevos ══
  { id:'der_raciones_duelo', tipo:'narrativo',
    texto:'Una expendedora de HELIX, empotrada junto a un tanatorio automático, reparte «raciones de duelo»: un pack gris con una barrita, un '
        + 'té y una tarjeta impresa que dice «HELIX lamenta su pérdida» sin firmar. Se activan solas cuando detectan a un recién enlutado por la '
        + 'cara. Un hombre acaba de coger la suya y, sin mirarte, te tiende la otra que ha caído de más. La aceptas. El duelo, aquí, también '
        + 'viene envasado y con código de lote.',
    item:'racion_deshidratada', disociacion:2 },

  { id:'der_clinica_cerrada', tipo:'narrativo',
    texto:'Frente a una clínica de barrio que cerró hace años, con las persianas soldadas por el óxido, hay una cola. Ocho, diez personas, en '
        + 'silencio, a la hora exacta en la que antes abría. Nadie les avisó de que ya no hay médico. Siguen viniendo porque venir es lo que se '
        + 'hacía, y dejar de hacerlo sería admitir que tampoco eso les queda. Te pones al final un momento, sin pensarlo, antes de acordarte de '
        + 'que tú sí tienes a dónde ir.',
    alerta:2, disociacion:2 },

  { id:'der_crio_recuerdos', tipo:'narrativo',
    texto:'Un crío vende «recuerdos» sobre una manta: chips baratos recuperados de los muertos, cada uno con un rato bueno de una vida que ya '
        + 'no la usa. «Este es una tarde de playa», dice, «y este una boda.» No sabe leer lo que vende; lo memorizó de oírlo. Le compras uno al '
        + 'azar por unas monedas. En las Pilas hasta la felicidad ajena se vende de segunda mano, y aun así te la llevas.',
    item:'chip_datos_corrupto', disociacion:2 },

  { id:'der_palomas_drones', tipo:'narrativo',
    texto:'Un viejo echa migas a las palomas en una plaza gris. Solo que no son palomas: son drones de censo de HELIX, chatarra voladora que '
        + 'cuenta cabezas y lee fichas al vuelo. Él lo sabe, se le nota. Les tira las migas igual, con cuidado, una a una. «Alguien tiene que '
        + 'darles de comer», dice al verte mirar, y se encoge de hombros. No sabrías decir si es locura o la cordura más tozuda que has visto hoy.',
    alerta:1, disociacion:1 },

  { id:'der_muro_fichas', tipo:'narrativo',
    texto:'Un muro entero cubierto de fichas de identidad: las de los desaparecidos, pegadas por quien los busca, con una fecha y a veces una '
        + 'palabra. Cada madrugada un dron de limpieza de HELIX las raspa, porque «afean el sector». Cada mañana alguien vuelve a pegarlas. '
        + 'Llevan años en esa guerra callada, el dron y las manos, y las manos no piensan rendirse aunque nunca ganen. Añades con la vista una '
        + 'cara a la lista de las que no vas a olvidar.',
    alerta:3, aislamiento:1 }

];

window.EVENTOS_DERIVA = EVENTOS_DERIVA;
