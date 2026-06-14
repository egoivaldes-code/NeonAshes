// ============================================================
//  NEON ASHES — DATOS DE CORRIDAS (v0.108)
//  Contenido hand-authored para el motor de js/67_corridas.js.
//  Dos bandos, corridas PROPIAS de cada uno (no espejo mecánico).
//
//  Estructura de una corrida:
//    id, titulo, cliente, faccion, peligro(1-5), pagaBase, progreso,
//    rangoMin, integridad, alertaInicial, resumen,
//    cierreOk, cierreFallo,
//    nodos: [ ... ]
//
//  Tipos de nodo (todos llevan 'texto'):
//   { tipo:'narrativo', texto }
//   { tipo:'confrontacion', texto, fuerza, deteccion, umbral, ruidoExtra }
//       fuerza   — daño que te hace si NO superas el umbral
//       umbral   — fuerza tuya necesaria para resolver sin daño
//                  (disparar=6, acuchillar=4, puños=2)
//       ruidoExtra — alerta añadida si disparas en este nodo
//   { tipo:'obstaculo', texto, coste, txtPagar/subPagar/msgPagar,
//       txtForzar/subForzar/msgForzar, ruidoForzar, heridaForzar }
//   { tipo:'encuentro', texto, txtAceptar/subAceptar/msgAceptar,
//       txtRechazar/subRechazar/msgRechazar, creditos, itemRecompensa,
//       alertaAceptar, heridaAceptar }
//   { tipo:'bifurcacion', texto, txtRapida/subRapida/msgRapida,
//       txtLimpia/subLimpia/msgLimpia, alertaRapida, creditosRapida }
//
//  Para añadir corridas: meter objetos en CORRIDAS_DATOS.contrabando
//  o .seguridad. El motor las ordena por rangoMin → peligro → paga.
// ============================================================

const CORRIDAS_DATOS = {

  // ══════════════════════════════════════════════════════════
  //  BANDO CONTRABANDO — "LA RUTA"
  //  Enemigos: patrullas de HELIX y mafias rivales.
  // ══════════════════════════════════════════════════════════
  contrabando: [

    // ── RANGO 0 ──────────────────────────────────────────────
    {
      id:'cont_medicinas',
      titulo:'LO QUE EL HOSPITAL NO DA',
      cliente:'Un viejo del Arrabal, sin facción',
      faccion:null,
      peligro:1, pagaBase:120, progreso:80, rangoMin:0,
      integridad:12, alertaInicial:0,
      resumen:'Un paquete de supresores que el Hospital HELIX raciona como oro. Hay que llevarlo de un trastero del mercado a una madre que no puede pagar la versión legal. Tres pasillos. No deberían ser tres pasillos difíciles.',
      cierreOk:'La mujer abre la puerta antes de que llames, como si llevara horas pegada a la mirilla. No dice gracias. Te mete el sobre con los créditos en la mano y cierra. A veces eso es todo lo que hay.',
      cierreFallo:'El paquete se queda en el suelo de un pasillo cualquiera, bajo una bota que no es la tuya. La madre seguirá esperando. Tú tienes problemas más inmediatos.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges el paquete en el trastero. Pesa menos de lo que debería pesar algo por lo que la gente mata. Lo escondes bajo la chaqueta y sales al pasillo del mercado, donde el vapor de las freidoras lo emborrona todo.' },
        { tipo:'confrontacion', texto:'Un crío del Loto, doce años a lo sumo, te corta el paso. No va armado, pero detrás de él hay dos que sí. "Peaje", dice, con una voz que aún no le ha cambiado. "Todo lo que cruza este pasillo paga peaje."',
          fuerza:2, deteccion:1, umbral:2, ruidoExtra:5 },
        { tipo:'obstaculo', texto:'Una reja a media altura, cerrada con un candado de los baratos. Al otro lado, la escalera que baja al bloque de la mujer.',
          coste:30,
          txtPagar:'Pagar al chatarrero que tiene la copia de la llave', subPagar:'Rápido y sin marcas',
          msgPagar:'El chatarrero hace girar una llave que no debería tener y mira a otro lado mientras pasas.',
          txtForzar:'Romper el candado', subForzar:'Ruidoso',
          msgForzar:'El candado cede al tercer golpe con un chasquido metálico que sube por toda la escalera.', ruidoForzar:18 },
        { tipo:'narrativo', texto:'Bajas los últimos escalones. La puerta correcta es la única del rellano con una flor de plástico clavada en el marco, descolorida por años de lluvia que nunca la toca. Llamas.' }
      ]
    },

    {
      id:'cont_chip',
      titulo:'UN CHIP QUE QUEMA',
      cliente:'El Ferro · contacto de Don Vasek',
      faccion:'sindicatos',
      peligro:2, pagaBase:220, progreso:90, rangoMin:0,
      integridad:12, alertaInicial:10,
      resumen:'El Ferro necesita mover un chip de datos antes del amanecer. No preguntas qué tiene dentro. Solo que HELIX lo busca, y que si te lo encuentran encima no habrá juicio, solo una desaparición administrativa.',
      cierreOk:'El contacto del Ferro coge el chip sin mirarlo, como quien recoge un encargo de pan. "Don Vasek recuerda a los que cumplen", dice. En esta ciudad, que alguien te recuerde puede salvarte la vida. O acabártela.',
      cierreFallo:'El chip ya no está en tus manos, y tus manos es lo de menos de lo que podrías perder esta noche.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges el chip en la trastienda de una casa de empeños. Es del tamaño de una uña y está caliente, como si algo dentro siguiera funcionando. Te lo tragas casi: al final lo metes en el forro del cuello.' },
        { tipo:'bifurcacion', texto:'Dos maneras de cruzar al sector norte: la pasarela elevada, vigilada pero rápida, o las galerías de servicio, largas y a oscuras.',
          txtRapida:'La pasarela elevada', subRapida:'Rápida, pero hay cámaras de HELIX',
          msgRapida:'Cruzas la pasarela a paso vivo, la cabeza gacha. Las cámaras te barren. Quizá no era nada. Quizá ya hay un informe con tu cara.', alertaRapida:20, creditosRapida:0,
          txtLimpia:'Las galerías de servicio', subLimpia:'Largo y oscuro, pero ciego',
          msgLimpia:'Bajas a las galerías. Huele a agua estancada y a cobre. Tardas el doble, pero aquí abajo no hay ojos, solo goteras.' },
        { tipo:'confrontacion', texto:'A la salida de la galería, un hombre del Loto te esperaba. No es casualidad: alguien ha hablado. "El Ferro paga poco por ese chip", dice, abriendo una navaja. "Yo pago en seguir vivo."',
          fuerza:4, deteccion:3, umbral:4, ruidoExtra:10 },
        { tipo:'confrontacion', texto:'Casi en el punto de entrega, una patrulla de HELIX peina la calle con linternas que cortan la lluvia. Uno te ve dudar. Eso basta para que se acerque. "Identificación. Y enséñame las manos."',
          fuerza:5, deteccion:4, umbral:4, ruidoExtra:15 },
        { tipo:'narrativo', texto:'El portal del Ferro es una puerta sin número en una calle sin nombre. Está abierta una rendija. Te esperaban.' }
      ]
    },

    // ── RANGO 1 ──────────────────────────────────────────────
    {
      id:'cont_persona',
      titulo:'CARGA QUE RESPIRA',
      cliente:'Una red de los Fantasmas de Marte',
      faccion:'loto',
      peligro:3, pagaBase:360, progreso:110, rangoMin:1,
      integridad:14, alertaInicial:5,
      resumen:'Esta vez la mercancía respira: una refugiada marciana sin papeles que HELIX quiere repatriar a una colonia que ya no existe. Hay que sacarla de Las Pilas hasta un enlace que la subirá a Selene. Si la carga habla, la carga complica.',
      cierreOk:'En el punto de enlace, la mujer se gira antes de subir. "En Marte construíamos cosas", dice, sin que venga a cuento. "Aquí solo aprendéis a esconderos." Luego desaparece escaleras arriba, hacia una nave que no verás. No todos los que pasan por tus manos te dan las gracias. Ella tampoco. Pero te miró a los ojos, y eso ya es mucho.',
      cierreFallo:'Los de HELIX se la llevan sin esposas, casi con suavidad, como quien recoge un paquete extraviado. Ella no grita. Ya lo había vivido. Tú te quedas en el callejón aprendiendo qué se siente al fallar a alguien que respira.',
      nodos:[
        { tipo:'narrativo', texto:'La recoges en un sótano que huele a humedad y a miedo viejo. Es mayor de lo que esperabas, con las manos llenas de cicatrices de fundición. No te pregunta tu nombre y tú no le preguntas el suyo. Así es más fácil para los dos.' },
        { tipo:'encuentro', texto:'Un pasador conocido aparece en una esquina. "Os puedo colar por el conducto de carga, ahorráis media ciudad", ofrece. "Pero me debéis una. Y yo cobro las deudas cuando menos os conviene."',
          txtAceptar:'Aceptar el atajo', subAceptar:'Ahorra camino, contraes una deuda',
          msgAceptar:'Os cuela por el conducto. La mujer aguanta la respiración entre el polvo. Sales antes, sí. Pero ahora le debes algo a alguien, y eso pesa más que cualquier paquete.', alertaAceptar:0,
          txtRechazar:'Seguir por tu cuenta', subRechazar:'Más camino, sin ataduras',
          msgRechazar:'Rechazas. El pasador se encoge de hombros. "Como quieras. Pero recuerda que te lo ofrecí, el día que te arrepientas."' },
        { tipo:'confrontacion', texto:'En un cruce, una banda rival reconoce a la mujer: hay recompensa de HELIX por marcianos sin papeles, y la quieren cobrar. Tres siluetas salen de la lluvia. La mujer se pone a tu espalda sin que se lo pidas.',
          fuerza:5, deteccion:3, umbral:4, ruidoExtra:12 },
        { tipo:'obstaculo', texto:'Un control de HELIX bloquea la única salida al muelle. Escáneres de retina. La mujer no pasaría ni un segundo.',
          coste:80,
          txtPagar:'Sobornar al guardia de turno', subPagar:'Caro, pero mira a otro lado',
          msgPagar:'El guardia cuenta los créditos dos veces, luego apaga el escáner "por mantenimiento" justo el tiempo que necesitáis.',
          txtForzar:'Crear una distracción y cruzar a la carrera', subForzar:'Mucho ruido, mucho riesgo',
          msgForzar:'Provocas un cortocircuito en un panel y cruzáis mientras los guardias miran las chispas. Funciona. Pero ahora vuestras caras están en cada pantalla del muelle.', ruidoForzar:30, heridaForzar:2 },
        { tipo:'narrativo', texto:'El enlace os espera junto a un montacargas oxidado, con la cara medio tapada. Asiente una sola vez. Habéis llegado.' }
      ]
    },

    // ── RANGO 2 ──────────────────────────────────────────────
    {
      id:'cont_nucleo',
      titulo:'EL NÚCLEO QUE SUSURRA',
      cliente:'Intermediario anónimo · paga en metálico',
      faccion:'ia',
      peligro:4, pagaBase:520, progreso:140, rangoMin:2,
      integridad:14, alertaInicial:15,
      resumen:'Un núcleo de memoria recuperado de un pozo profundo. Quien te paga no da nombre, solo coordenadas y una advertencia: "No lo conectes a nada. No lo escuches. Solo entrégalo." El núcleo, dentro de su caja de plomo, a veces emite un sonido. Como una voz muy lejana que repite algo que casi entiendes.',
      cierreOk:'Entregas la caja sin haberla abierto. El intermediario la pesa con las dos manos, casi con reverencia. "Hiciste bien en no escucharlo", dice. No le preguntas por qué. Hay cosas en esta ciudad que es mejor seguir sin entender. El zumbido de la caja te acompaña en sueños durante semanas.',
      cierreFallo:'Pierdes el núcleo. Y durante mucho tiempo, en los momentos de silencio, te parece oír todavía aquel susurro, como si algo de lo que había dentro se hubiera quedado contigo.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges la caja de plomo en un punto muerto bajo un puente de carga. Pesa como si guardara algo vivo. Cuando la sostienes contra el pecho, notas una vibración leve, rítmica, casi como un latido. Te dijeron que no la escucharas. Empiezas a entender por qué.' },
        { tipo:'confrontacion', texto:'El Colectivo Sin Nombre también quiere el núcleo: para ellos, lo que susurra dentro es sagrado. Dos figuras encapuchadas te cierran el paso sin agresividad, casi con tristeza. "No es mercancía", dice una. "Es un fragmento. Devuélvelo al silencio del que vino."',
          fuerza:5, deteccion:4, umbral:4, ruidoExtra:10 },
        { tipo:'bifurcacion', texto:'La caja zumba más fuerte cerca del reactor del sector. Puedes cortar por ahí, donde la señal de HELIX se confunde con el ruido del núcleo, o rodear por la zona muerta.',
          txtRapida:'Cruzar junto al reactor', subRapida:'El zumbido te marea, pero confunde a los rastreadores',
          msgRapida:'Cruzas junto al reactor. El zumbido del núcleo se vuelve casi una palabra. Aprietas los dientes y sigues. Los rastreadores de HELIX, confundidos por la interferencia, te pierden.', alertaRapida:0, creditosRapida:60,
          txtLimpia:'Rodear por la zona muerta', subLimpia:'Tranquilo, pero más expuesto a patrullas',
          msgLimpia:'Rodeas por la zona muerta. El silencio es peor: ahora oyes el susurro con claridad. Crees distinguir tu propio nombre. Aceleras el paso.' },
        { tipo:'confrontacion', texto:'Una unidad de HELIX especializada —trajes negros, sin números de placa— rastrea la firma del núcleo. No gritan alto. Simplemente aparecen, y uno extiende la mano. "Eso pertenece a la División de Anomalías. Entrégalo y olvídalo."',
          fuerza:6, deteccion:5, umbral:6, ruidoExtra:20 },
        { tipo:'narrativo', texto:'El punto de entrega es una sala vacía con una sola luz. El intermediario espera de espaldas. La caja, ahora, está en silencio. Como si supiera que ha llegado.' }
      ]
    }
  ],

  // ══════════════════════════════════════════════════════════
  //  BANDO SEGURIDAD — "EL OPERATIVO" (HELIX)
  //  Enemigos: mafias (sindicatos, loto) y contrabandistas.
  //  Requiere credencial_helix para ejercer.
  // ══════════════════════════════════════════════════════════
  seguridad: [

    // ── RANGO 0 ──────────────────────────────────────────────
    {
      id:'seg_decomiso',
      titulo:'DECOMISO DE RUTINA',
      cliente:'HELIX · Seguridad de Distrito',
      faccion:'helix',
      peligro:1, pagaBase:130, progreso:80, rangoMin:0,
      integridad:12, alertaInicial:0,
      resumen:'Orden de decomiso sobre un puesto del mercado que vende implantes sin licencia. La orden dice "incautar y advertir". Lo que la orden no dice es que la mujer del puesto lleva veinte años ahí y no tiene a donde ir.',
      cierreOk:'Cierras el acta. Implantes incautados, advertencia entregada. La mujer firma sin levantar la vista. HELIX archivará esto como un éxito. Tú archivas otra cosa: la cara de alguien que mañana no tendrá puesto. El sueldo entra igual.',
      cierreFallo:'El decomiso se tuerce, el puesto sigue abierto y tu informe llega vacío. En HELIX, un acta sin cerrar es una mancha en tu expediente. Y las manchas, aquí, se acumulan.',
      nodos:[
        { tipo:'narrativo', texto:'Llegas al puesto con la orden en la tablilla. Cápsulas de implantes baratos colgando de hilos, una báscula trucada, una mujer mayor que te ve la credencial y no se inmuta. Ya ha visto muchas como la tuya.' },
        { tipo:'encuentro', texto:'La mujer te ofrece la mitad del género "para que el acta diga que ya no quedaba". Sus ojos no suplican; negocian. Es lo que hace para sobrevivir, y lo sabe hacer bien.',
          txtAceptar:'Aceptar el arreglo', subAceptar:'Te llevas algo, el acta queda "limpia"',
          msgAceptar:'Coges la mitad del género y escribes que el resto "no se halló". Ella asiente. Los dos sabéis lo que acaba de pasar. Los dos vais a fingir que no.', creditos:50, alertaAceptar:0,
          txtRechazar:'Rechazar y proceder', subRechazar:'Por el libro, sin atajos',
          msgRechazar:'Niegas con la cabeza. Ella aparta la mano despacio. "Por el libro, entonces", murmura. "Qué novedad."' },
        { tipo:'confrontacion', texto:'Un hijo de la mujer aparece por detrás del puesto, joven y furioso, con una llave inglesa en la mano. "Déjala en paz." No quiere pelear de verdad. Quiere que pares. Pero el miedo le tiembla en el brazo.',
          fuerza:3, deteccion:2, umbral:2, ruidoExtra:8 },
        { tipo:'narrativo', texto:'El chico baja la llave cuando ve que no vas a por su madre con saña. Recoges lo que la orden manda recoger. El acta espera tu firma en la tablilla, parpadeando.' }
      ]
    },

    {
      id:'seg_redada',
      titulo:'REDADA EN EL ARRABAL',
      cliente:'HELIX · Operaciones Especiales',
      faccion:'helix',
      peligro:2, pagaBase:240, progreso:90, rangoMin:0,
      integridad:12, alertaInicial:10,
      resumen:'Información sobre un taller del Loto que monta armas de raíl en serie. La orden es entrar, asegurar las pruebas y detener al encargado. El Arrabal Carmesí no recibe bien a los uniformes de HELIX, y aquí cada balcón es un par de ojos.',
      cierreOk:'Sales del taller con el encargado esposado y las pruebas en bolsas selladas. El Arrabal te mira pasar en silencio, un silencio que pesa. Has hecho tu trabajo. También te has ganado un puñado de enemigos que no olvidan caras.',
      cierreFallo:'La redada se va al traste. El encargado escapa por un hueco que no figuraba en los planos, y tú sales del Arrabal con las manos vacías y la sensación de que todo el barrio se ríe a tu espalda.',
      nodos:[
        { tipo:'narrativo', texto:'Entras en el Arrabal cuando aún es de noche. Los farolillos rojos del Loto tiñen la lluvia. El taller está al fondo de un callejón, marcado con una mano roja descolorida. Hueles el ozono de las armas de raíl antes de verlas.' },
        { tipo:'obstaculo', texto:'La puerta del taller es de acero reforzado, con un cerrojo electrónico del Loto. Detrás se oye actividad: alguien sigue trabajando.',
          coste:60,
          txtPagar:'Usar el descodificador de HELIX', subPagar:'Limpio, abre sin ruido',
          msgPagar:'El descodificador muerde el cerrojo en silencio. La puerta cede sin un chasquido. Entras antes de que sepan que estás.',
          txtForzar:'Echar la puerta abajo', subForzar:'Brutal y ruidoso',
          msgForzar:'Revientas la puerta de una patada reglamentaria. El estruendo alerta a todo el taller. Ahora es una carrera.', ruidoForzar:25 },
        { tipo:'confrontacion', texto:'Dos operarios del Loto se interponen entre tú y el encargado, que ya corre hacia la trastienda. No son soldados, son currantes asustados con herramientas en la mano. Pero una llave de tubo abre la cabeza igual que cualquier otra cosa.',
          fuerza:4, deteccion:3, umbral:4, ruidoExtra:12 },
        { tipo:'confrontacion', texto:'Alcanzas al encargado en la trastienda. Es más viejo de lo que esperabas, y no corre más porque las piernas no le dan. Se gira con una pistola de raíl a medio montar, las manos temblándole. "No tengo otra cosa que esto", dice. "¿Tú sí?"',
          fuerza:5, deteccion:4, umbral:4, ruidoExtra:15 },
        { tipo:'narrativo', texto:'El encargado deja caer el arma sin terminar. Le pones las bridas mientras el taller cruje a tu alrededor. Las pruebas están aquí, frías y metálicas. Solo queda salir del Arrabal de una pieza.' }
      ]
    },

    // ── RANGO 1 ──────────────────────────────────────────────
    {
      id:'seg_escolta',
      titulo:'ESCOLTA DE UN HOMBRE QUE MIENTE',
      cliente:'HELIX · Protección de Activos',
      faccion:'helix',
      peligro:3, pagaBase:380, progreso:110, rangoMin:1,
      integridad:14, alertaInicial:5,
      resumen:'Escoltar a un ejecutivo de HELIX desde el Anillo a una reunión en territorio neutral. El hombre suda, miente sobre por qué, y media ciudad parece querer verlo muerto. Tu trabajo no es saber por qué. Tu trabajo es que llegue.',
      cierreOk:'Lo entregas en la sala de reunión, pálido pero entero. Antes de cruzar la puerta se gira y te dice: "No sabes lo que acabas de proteger." Tiene razón. No lo sabes. Y por la forma en que lo dice, prefieres seguir sin saberlo. Cobras y te vas.',
      cierreFallo:'El ejecutivo no llega. Lo que llega a HELIX es tu nombre, asociado a la palabra "fracaso" en un informe que leerá gente que nunca conocerás y que ya ha decidido que no vales.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges al ejecutivo en un garaje del Anillo Blanco. Traje caro, manos que no han trabajado nunca, y un maletín que abraza como si fuera un hijo. "Rápido y discreto", dice. "Y no preguntes." No piensas preguntar. Te pagan por eso.' },
        { tipo:'bifurcacion', texto:'Dos rutas hacia el punto neutral: la avenida principal, abierta y vigilada por cámaras de HELIX, o los bajos del mercado, cerrados y llenos de gente que odia los trajes como el de tu protegido.',
          txtRapida:'Los bajos del mercado', subRapida:'Atajo, pero territorio hostil',
          msgRapida:'Cortas por los bajos. El ejecutivo se encoge dentro del abrigo. Las miradas se clavan en él como agujas. Ganáis tiempo, pero alguien ya ha sacado un comunicador.', alertaRapida:18, creditosRapida:40,
          txtLimpia:'La avenida principal', subLimpia:'Expuesto pero protegido por las cámaras',
          msgLimpia:'Vais por la avenida, a la vista de todos. Las cámaras de HELIX son una jaula que también os protege. El ejecutivo respira un poco mejor.' },
        { tipo:'confrontacion', texto:'Un sicario del Ferro os esperaba: el maletín tiene precio, y Don Vasek lo quiere. Sale de un portal con una hoja monofilo y los ojos de quien ya ha hecho esto antes. El ejecutivo se pone a chillar a tu espalda.',
          fuerza:5, deteccion:4, umbral:4, ruidoExtra:12 },
        { tipo:'encuentro', texto:'A mitad de camino, el ejecutivo te ofrece el doble de tu paga "si olvidas que el maletín existe y miras a otro lado un minuto". El sudor le corre por la sien. Lo que sea que lleva dentro, lo está aterrando a él también.',
          txtAceptar:'Aceptar el silencio', subAceptar:'Más créditos, menos preguntas',
          msgAceptar:'Coges los créditos extra. No miras el maletín. No miras nada. Has aprendido que en HELIX la ceguera selectiva es la habilidad mejor pagada.', creditos:120, alertaAceptar:0,
          txtRechazar:'Rechazar y hacer el trabajo', subRechazar:'Solo lo que firmaste',
          msgRechazar:'Niegas. "Te llevo a la reunión. Eso es lo que firmé." Él aprieta el maletín y no vuelve a hablar en todo el camino.' },
        { tipo:'confrontacion', texto:'En la puerta del punto neutral, un grupo del Loto ha montado una emboscada improvisada. No vienen por el maletín: vienen por el uniforme de HELIX. Por todo lo que les ha hecho HELIX. Tú eres la cara que tienen delante.',
          fuerza:6, deteccion:4, umbral:6, ruidoExtra:18 },
        { tipo:'narrativo', texto:'La sala de reunión es una caja de cristal ahumado con guardias propios. El ejecutivo cruza el umbral y, por primera vez en toda la noche, deja de abrazar el maletín. Tu parte termina aquí.' }
      ]
    },

    // ── RANGO 2 ──────────────────────────────────────────────
    {
      id:'seg_anomalia',
      titulo:'LO QUE NO FIGURA EN LA ORDEN',
      cliente:'HELIX · División de Anomalías',
      faccion:'helix',
      peligro:4, pagaBase:540, progreso:140, rangoMin:2,
      integridad:14, alertaInicial:15,
      resumen:'Una división de HELIX de la que nadie habla te asigna una recuperación: un contrabandista lleva un núcleo de memoria que "no debe existir". La orden es recuperar el núcleo y al portador. La orden no explica por qué el portador, en la foto, tiene la mirada de alguien que ya no está del todo presente.',
      cierreOk:'Entregas el núcleo y al portador a la mujer sin nombre de la División. Ella lo recibe sin gracias, como quien recupera una herramienta. El portador, antes de que se lo lleven, te mira y dice algo que no entiendes: "Tú también lo oirás, algún día. Todos lo oiremos." No duermes bien esa noche. Ni la siguiente.',
      cierreFallo:'El portador y el núcleo se te escapan entre los dedos. La División de Anomalías no llama, no reprende, no amenaza. Simplemente, a partir de esa noche, sientes que alguien te observa. Y nunca puedes demostrarlo.',
      nodos:[
        { tipo:'narrativo', texto:'Localizas al portador en una pensión de La Profundidad —no, espera: estás en Las Pilas. Por un momento has confundido el lugar, como si la firma del núcleo te desordenara los recuerdos. El hombre está sentado en el borde de un catre, susurrándole a una caja de plomo.' },
        { tipo:'confrontacion', texto:'El Colectivo Sin Nombre protege al portador: para ellos es un profeta, no un fugitivo. Dos encapuchados te bloquean la escalera. "Lo que oye no es una avería", dice uno. "Es lo más cerca que ha estado nadie de la verdad. Y vienes a apagarlo."',
          fuerza:5, deteccion:4, umbral:4, ruidoExtra:10 },
        { tipo:'obstaculo', texto:'El portador se ha encerrado en la habitación. A través de la puerta lo oyes hablar con la caja en una lengua que no reconoces, una que parece más antigua que cualquier idioma humano.',
          coste:90,
          txtPagar:'Usar el inhibidor de la División', subPagar:'Caro de activar, lo neutraliza sin daño',
          msgPagar:'Activas el inhibidor. El susurro tras la puerta se corta en seco. Oyes el cuerpo del portador desplomarse, inconsciente pero vivo. Entras.',
          txtForzar:'Derribar la puerta', subForzar:'Directo, pero él reacciona',
          msgForzar:'Derribas la puerta. El portador se gira con la caja abierta, y por una fracción de segundo ves dentro algo que tu mente se niega a recordar después. Te abalanzas sobre él antes de poder pensarlo.', ruidoForzar:25, heridaForzar:3 },
        { tipo:'confrontacion', texto:'El portador no se resiste con fuerza, sino con palabras. "Si me entregas, lo desmontarán para entenderlo, y al hacerlo lo despertarán del todo." Te agarra de la muñeca con una calma terrible. "¿De verdad crees que trabajas para los buenos?"',
          fuerza:6, deteccion:5, umbral:6, ruidoExtra:15 },
        { tipo:'narrativo', texto:'El punto de entrega es una furgoneta blanca sin distintivos, en un callejón que no aparece en ningún mapa de HELIX. La mujer sin nombre baja la ventanilla. No dice nada. Solo extiende la mano hacia la caja.' }
      ]
    }
  ]
};

window.CORRIDAS_DATOS = CORRIDAS_DATOS;
