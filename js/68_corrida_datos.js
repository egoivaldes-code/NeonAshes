// ============================================================
//  NEON ASHES — DATOS DE CORRIDAS (v0.110)
//  Contenido hand-authored para el motor de js/67_corridas.js.
//  Corridas más largas (6-9 nodos) y variadas, con confrontaciones
//  de VARIOS enemigos (elegir objetivo) y REFUERZOS.
//
//  Estructura de una corrida:
//    id, titulo, cliente, faccion, peligro(1-5), pagaBase, progreso,
//    rangoMin, integridad, alertaInicial, resumen,
//    cierreOk, cierreFallo, nodos:[ ... ]
//
//  Tipos de nodo (todos llevan 'texto'):
//   { tipo:'narrativo', texto }
//
//   { tipo:'confrontacion', texto,
//       // — modo 1 enemigo (compat) —
//       fuerza, umbral, ruidoExtra,
//       // — modo grupo (nuevo) —
//       enemigos:[ { nombre, desc, integridad, fuerza, umbral } ... ],
//       // refuerzos guionizados: en el turno N entran estos enemigos
//       refuerzoTurno: N, refuerzoTurnoGrupo:[ {…} ],
//       // refuerzos dinámicos: si la alerta llega a X, entran estos
//       refuerzoSiRuido: X, refuerzoGrupo:[ {…} ]
//     }
//     · integridad = cuántos golpes sólidos aguanta el enemigo.
//     · fuerza = daño que te hace al responder (se reparte suave).
//     · umbral = fuerza tuya para hacerle un golpe sólido (disparar=6,
//       acuchillar=4, puños=2). Por debajo, le rascas (1 de daño).
//
//   { tipo:'obstaculo', texto, coste, txt/sub/msg Pagar y Forzar,
//       ruidoForzar, heridaForzar }
//   { tipo:'encuentro', texto, txt/sub/msg Aceptar y Rechazar,
//       creditos, itemRecompensa, alertaAceptar, heridaAceptar }
//   { tipo:'bifurcacion', texto, txt/sub/msg Rapida y Limpia,
//       alertaRapida, creditosRapida }
//
//  El motor ordena por rangoMin → peligro → paga.
// ============================================================

const CORRIDAS_DATOS = {

  // ══════════════════════════════════════════════════════════
  //  BANDO CONTRABANDO — "LA RUTA"
  // ══════════════════════════════════════════════════════════
  contrabando: [

    // ── RANGO 0 ──────────────────────────────────────────────
    {
      id:'cont_medicinas',
      titulo:'LO QUE EL HOSPITAL NO DA',
      cliente:'Un viejo del Arrabal, sin facción',
      faccion:null,
      peligro:1, pagaBase:160, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Un paquete de supresores que el Hospital HELIX raciona como oro, de un trastero del mercado a una madre que no puede pagar la versión legal. Tres pasillos. Nunca son solo tres pasillos.',
      cierreOk:'La mujer abre antes de que llames, como si llevara horas pegada a la mirilla. No dice gracias. Te mete el sobre con los créditos en la mano y cierra. A veces eso es todo lo que hay, y es suficiente.',
      cierreFallo:'El paquete queda en el suelo de un pasillo cualquiera, bajo una bota que no es la tuya. La madre seguirá esperando. Tú tienes problemas más inmediatos.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges el paquete en el trastero. Pesa menos de lo que debería pesar algo por lo que la gente mata. Lo escondes bajo la chaqueta y sales al pasillo del mercado, donde el vapor de las freidoras lo emborrona todo.',
          ir:'crio' },
        crio:{ tipo:'confrontacion',
          texto:'Un crío del Loto, doce años a lo sumo, te corta el paso. No va armado, pero detrás hay un matón que sí. "Peaje", dice, con una voz que aún no le ha cambiado.',
          enemigos:[
            { nombre:'El crío', desc:'Asustado, hablando de más', tipo:'cobarde', integridad:1, fuerza:1, umbral:2 },
            { nombre:'Matón con barra', desc:'El que importa', tipo:'bruto', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Dos formas de bajar al bloque de la mujer, y son caminos de verdad distintos.',
          ramas:[
            { txt:'EL HUECO DEL ASCENSOR', sub:'Atajo sucio y silencioso', ir:'hueco' },
            { txt:'LA ESCALERA PRINCIPAL', sub:'Más gente, más tranquilo', ir:'escalera' }
          ] },
        hueco:{ tipo:'hallazgo',
          texto:'Bajas por el hueco del ascensor averiado, agarrándote a los cables. A medio camino, encajado en una viga, hay un macuto olvidado por algún chatarrero.',
          txtAbrir:'Registrar el macuto', subAbrir:'Podría haber algo. O estar podrido',
          txtDejar:'Seguir bajando', subDejar:'No perder tiempo aquí colgado',
          riesgo:0.25, trampaHerida:2,
          recompensaCreditos:40,
          msgAbrir:'Dentro: unos créditos sueltos y una linterna que aún funciona. Te lo guardas y sigues bajando.',
          msgTrampa:'Al tirar del macuto pierdes el agarre y caes el último tramo. Te levantas dolorido, maldiciendo tu curiosidad.',
          msgDejar:'Lo dejas donde está. No es momento de hacer inventario colgado de un cable.',
          ir:'puerta' },
        escalera:{ tipo:'encuentro',
          texto:'Bajas por la escalera, entre vecinos que cargan bolsas. Una mujer mayor te ve el bulto bajo la chaqueta y entrecierra los ojos. "Sé lo que llevas. Yo no he visto nada... por algo a cambio."',
          txtAceptar:'Darle unos créditos por su silencio', subAceptar:'20 CR · se asegura su discreción',
          txtRechazar:'Seguir como si nada', subRechazar:'Arriesgarte a que hable',
          creditos:-20, alertaAceptar:-5, alertaRechazar:10,
          msgAceptar:'Le pones unos créditos en la palma. "Buena memoria la mía para olvidar", murmura, y sigue bajando.',
          msgRechazar:'Pasas de largo. Ella chasquea la lengua. No sabes si llamará a alguien, pero el cosquilleo en la nuca te acompaña.',
          irAceptar:'puerta', irRechazar:'puerta' },
        puerta:{ tipo:'obstaculo',
          texto:'Una reja a media altura cierra el último rellano. Candado barato pero terco.',
          coste:25,
          txtPagar:'Pagar al chatarrero por la copia de la llave', subPagar:'Rápido y sin marcas',
          msgPagar:'El chatarrero hace girar una llave que no debería tener y mira a otro lado mientras pasas.',
          txtForzar:'Romper el candado', subForzar:'Ruidoso',
          msgForzar:'El candado cede al tercer golpe con un chasquido que sube por toda la escalera.', ruidoForzar:15,
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La puerta correcta es la única del rellano con una flor de plástico clavada en el marco, descolorida por años de lluvia que nunca la toca. Llamas.',
          fin:true }
      }}
    },

    {
      id:'cont_chip',
      titulo:'UN CHIP QUE QUEMA',
      cliente:'El Ferro · contacto de Don Vasek',
      faccion:'sindicatos',
      peligro:2, pagaBase:260, progreso:95, rangoMin:0,
      integridad:14, alertaInicial:10,
      resumen:'El Ferro necesita mover un chip de datos antes del amanecer. No preguntas qué tiene dentro. Solo que HELIX lo busca, y que si te lo encuentran encima no habrá juicio, solo una desaparición administrativa.',
      cierreOk:'El contacto del Ferro coge el chip sin mirarlo, como quien recoge un encargo de pan. "Don Vasek recuerda a los que cumplen", dice. En esta ciudad, que alguien te recuerde puede salvarte la vida. O acabártela.',
      cierreFallo:'El chip ya no está en tus manos, y tus manos es lo de menos de lo que podrías perder esta noche.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges el chip en la trastienda de una casa de empeños. Del tamaño de una uña, y caliente, como si algo dentro siguiera funcionando. Lo metes en el forro del cuello y sales a la lluvia.',
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Dos maneras de cruzar al sector norte. Una rápida y a la vista; otra larga y ciega. Cada una con su precio.',
          ramas:[
            { txt:'LA PASARELA ELEVADA', sub:'Rápida, pero con cámaras de HELIX', ir:'pasarela', alerta:20 },
            { txt:'LAS GALERÍAS DE SERVICIO', sub:'Largas y oscuras, pero sin ojos', ir:'galerias' }
          ] },
        pasarela:{ tipo:'narrativo',
          texto:'Cruzas la pasarela a paso vivo, la cabeza gacha. Las cámaras te barren una a una. Quizá no era nada. Quizá ya hay un informe con tu cara montándose en algún servidor de HELIX. No miras atrás.',
          ir:'loto' },
        galerias:{ tipo:'hallazgo',
          texto:'Bajas a las galerías de servicio. Huele a agua estancada y a cobre. Entre tuberías, alguien dejó un escondrijo: una caja de herramientas con el candado reventado hace tiempo.',
          txtAbrir:'Mirar dentro de la caja', subAbrir:'Puede que quede algo de valor',
          txtDejar:'No entretenerse', subDejar:'Aquí abajo el tiempo también corre',
          riesgo:0.2, trampaHerida:2, trampaAlerta:5,
          recompensaCreditos:50, recompensaItem:'cargador',
          msgAbrir:'Dentro hay un cargador olvidado y unos créditos en una lata. Botín de otro que no volvió. Te lo quedas.',
          msgTrampa:'Al abrir la caja, un alambre tensado libera un resorte que te abre la mano. Una trampa de chatarrero. Sangras, pero aprendes.',
          msgDejar:'La dejas cerrada. Lo que esconde un chatarrero suele morder.',
          ir:'loto' },
        loto:{ tipo:'confrontacion',
          texto:'A la salida del cruce, dos del Loto te esperaban. Alguien ha hablado. "El Ferro paga poco por ese chip", dice el de delante, abriendo una navaja. "Nosotros pagamos en seguir vivos."',
          enemigos:[
            { nombre:'Loto de la navaja', desc:'Habla, gana tiempo', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Loto callado', desc:'Se mueve para flanquearte', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'patrulla' },
        patrulla:{ tipo:'confrontacion',
          texto:'Casi en el punto de entrega, una patrulla de HELIX peina la calle con linternas que cortan la lluvia. Uno te ve dudar. "Identificación. Y enséñame las manos."',
          fuerza:5, umbral:4, ruidoExtra:15,
          refuerzoSiRuido:60, refuerzoGrupo:[{nombre:'Refuerzo HELIX', desc:'Llamado por radio', integridad:2, fuerza:4, umbral:4}],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El portal del Ferro es una puerta sin número en una calle sin nombre. Está abierta una rendija. Te esperaban.',
          fin:true }
      }}
    },

    // ── RANGO 1 ──────────────────────────────────────────────
    {
      id:'cont_persona',
      titulo:'CARGA QUE RESPIRA',
      cliente:'Una red de los Fantasmas de Marte',
      faccion:'loto',
      peligro:3, pagaBase:400, progreso:115, rangoMin:1,
      integridad:16, alertaInicial:5,
      resumen:'Esta vez la mercancía respira: una refugiada marciana sin papeles que HELIX quiere repatriar a una colonia que ya no existe. Sacarla de Las Pilas hasta un enlace que la subirá a Selene. Si la carga habla, la carga complica.',
      cierreOk:'En el punto de enlace, la mujer se gira antes de subir. "En Marte construíamos cosas", dice, sin que venga a cuento. "Aquí solo aprendéis a esconderos." Luego desaparece hacia una nave que no verás. Te miró a los ojos, y eso ya es mucho.',
      cierreFallo:'Los de HELIX se la llevan sin esposas, casi con suavidad, como quien recoge un paquete extraviado. Ella no grita. Ya lo había vivido. Tú aprendes qué se siente al fallar a alguien que respira.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'La recoges en un sótano que huele a humedad y a miedo viejo. Mayor de lo que esperabas, con las manos llenas de cicatrices de fundición. No te pregunta tu nombre y tú no le preguntas el suyo.',
          ir:'pasador' },
        pasador:{ tipo:'encuentro',
          texto:'Un pasador conocido aparece en una esquina. "Os cuelo por el conducto de carga, ahorráis media ciudad. Pero me debéis una, y yo cobro cuando menos os conviene."',
          txtAceptar:'Aceptar el atajo', subAceptar:'Ahorra camino, contraes una deuda',
          txtRechazar:'Seguir por tu cuenta', subRechazar:'Más camino, sin ataduras',
          alertaAceptar:-8,
          msgAceptar:'Os cuela por el conducto. La mujer aguanta la respiración entre el polvo. Sales antes. Pero ahora le debes algo a alguien, y eso pesa más que cualquier mercancía.',
          msgRechazar:'Rechazas. "Como quieras. Pero recuerda que te lo ofrecí, el día que te arrepientas." Y se traga la oscuridad.',
          irAceptar:'banda', irRechazar:'banda' },
        banda:{ tipo:'confrontacion',
          texto:'En un cruce, una banda reconoce a la mujer: hay recompensa de HELIX por marcianos sin papeles. Tres siluetas salen de la lluvia. Ella se pone a tu espalda sin que se lo pidas.',
          enemigos:[
            { nombre:'Cazarrecompensas', desc:'El que dirige', tipo:'lider', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Secuaz con tubo', desc:'Fuerza bruta', tipo:'bruto', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vigía nervioso', desc:'Vigila la calle', tipo:'cobarde', integridad:1, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[{nombre:'Más cazarrecompensas', desc:'El ruido los atrae', integridad:2, fuerza:3, umbral:2}],
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'La mujer está agotada. Dos formas de afrontar el último tramo, y son mundos distintos: arriba, por los tejados; o cruzar la avenida de frente.',
          ramas:[
            { txt:'SUBIR A LOS TEJADOS', sub:'Lento, le das un respiro', ir:'tejados' },
            { txt:'CRUZAR LA AVENIDA', sub:'Rápido y a la vista de todos', ir:'avenida', alerta:15 }
          ] },
        tejados:{ tipo:'hallazgo',
          texto:'Subís a los tejados. Ella recupera el aliento entre antenas oxidadas. En un palomar abandonado encontráis un zurrón que alguien escondió hace tiempo, cubierto de polvo y excrementos.',
          txtAbrir:'Registrar el zurrón', subAbrir:'Podría servir de algo',
          txtDejar:'Dejarlo y descansar un momento', subDejar:'No es asunto vuestro',
          riesgo:0.15, trampaHerida:1,
          recompensaCreditos:60, recompensaItem:'kit_trauma',
          msgAbrir:'Dentro: un viejo kit de trauma aún sellado y unos créditos. El cielo de Las Pilas no tiene estrellas, pero a veces tiene regalos.',
          msgTrampa:'Al abrir el zurrón, una rata enorme salta y te muerde la mano antes de huir. Más susto que herida, pero sangras.',
          msgDejar:'Lo dejas. La mujer te mira con algo parecido a la aprobación: no todo el que pasa hambre roba.',
          ir:'control' },
        avenida:{ tipo:'confrontacion',
          texto:'Cruzáis la avenida a la vista de todos. A mitad de camino, un dúo de matones que cobran recompensas os ve y corta el paso. La mujer tropieza; la sostienes con una mano mientras con la otra te preparas.',
          enemigos:[
            { nombre:'Matón de avenida', desc:'Os vio cruzar', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Compinche', desc:'Rodea a la mujer', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'control' },
        control:{ tipo:'obstaculo',
          texto:'Un control de HELIX bloquea la salida al muelle. Escáneres de retina. La mujer no pasaría ni un segundo.',
          coste:80,
          txtPagar:'Sobornar al guardia de turno', subPagar:'Caro, pero mira a otro lado',
          msgPagar:'El guardia cuenta los créditos dos veces, luego apaga el escáner "por mantenimiento" justo el tiempo que necesitáis.',
          txtForzar:'Crear una distracción y cruzar', subForzar:'Mucho ruido, mucho riesgo',
          msgForzar:'Provocas un cortocircuito en un panel y cruzáis mientras miran las chispas. Funciona. Pero vuestras caras están ya en cada pantalla del muelle.', ruidoForzar:30, heridaForzar:2,
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El enlace os espera junto a un montacargas oxidado, la cara medio tapada. Asiente una sola vez. Habéis llegado.',
          fin:true }
      }}
    },

    {
      id:'cont_armas',
      titulo:'HIERRO PARA EL ARRABAL',
      cliente:'Mano Roja · célula del Loto',
      faccion:'loto',
      peligro:3, pagaBase:440, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:15,
      resumen:'Un cargamento de armas de raíl desde un taller clandestino hasta un escondite del Loto, cruzando una zona donde el Ferro cobra por respirar. Dos mafias que se odian, y tú en medio cargando con lo que ambas quieren.',
      cierreOk:'Mano Roja en persona inspecciona el cargamento, pasando los dedos por los cañones fríos. "Bien", dice, y es casi un elogio. El Loto no olvida un favor. Tampoco una traición. Procura quedar siempre del primer lado.',
      cierreFallo:'El hierro acaba en manos que no eran las acordadas, y en el Arrabal corre la voz de que no se puede confiar en ti. En Las Pilas, la reputación es lo único que de verdad se posee. Y la acabas de perder.',
      mapa:{ inicio:'cargar', nodos:{
        cargar:{ tipo:'narrativo',
          texto:'El taller huele a ozono y metal recalentado. Cargas las armas en un carro de reparto trucado, bajo cajas de fruta sintética. Pesa lo suyo. Cada bache del camino será una plegaria.',
          ir:'ferro' },
        ferro:{ tipo:'confrontacion',
          texto:'Dos del Ferro montan un peaje improvisado en la única salida. "Todo lo que cruza paga al Ferro", dice uno, dándose golpecitos con una palanca en la palma. Reconocen las cajas. Saben que mientes.',
          enemigos:[
            { nombre:'Ferro de la palanca', desc:'Grande, lento', tipo:'bruto', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Ferro con pistola', desc:'Apunta al carro', integridad:2, fuerza:5, umbral:6 }
          ],
          ir:'chaval' },
        chaval:{ tipo:'encuentro',
          texto:'Un chaval del Loto aparece pedaleando. "Mano Roja dice que cambies de ruta, hay redada en la principal. Sígueme." Podría ser verdad. Podría ser una encerrona del Ferro con un crío comprado.',
          txtAceptar:'Seguir al chaval', subAceptar:'Si dice la verdad, evitas la redada',
          txtRechazar:'No fiarte y seguir tu ruta', subRechazar:'Por si es una trampa',
          alertaAceptar:-10, alertaRechazar:10,
          msgAceptar:'Sigues al chaval por callejones que solo conoce quien creció en ellos. Tenía razón: oyes la redada a tu espalda, lejos. Buen crío.',
          msgRechazar:'No te fías. El chaval se encoge de hombros y desaparece. Más adelante ves luces de HELIX en la principal: tenía razón. Te toca improvisar.',
          irAceptar:'entrega', irRechazar:'redada' },
        redada:{ tipo:'confrontacion',
          texto:'La redada de HELIX te alcanza en un cruce, justo como avisó el chaval. Tres agentes con el equipo reglamentado. No te conocen, pero el carro huele a ozono a un metro. "Pare el vehículo. Inspección."',
          enemigos:[
            { nombre:'Agente al mando', desc:'Da las órdenes', tipo:'lider', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente de flanco', desc:'Rodea el carro', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoTurno:3, refuerzoTurnoGrupo:[{nombre:'Furgón de apoyo', desc:'Llega tarde pero llega', integridad:3, fuerza:4, umbral:4}],
          ir:'entrega' },
        entrega:{ tipo:'bifurcacion',
          texto:'Llegas al escondite. Dos formas de meter el cargamento, y el Arrabal juzga cómo lo haces.',
          ramas:[
            { txt:'METER EL CARRO POR LA RAMPA', sub:'Acabas ya, con estruendo', ir:'final', alerta:18 },
            { txt:'DESCARGAR A MANO POR EL CALLEJÓN', sub:'Lento y silencioso', ir:'final' }
          ] },
        final:{ tipo:'narrativo',
          texto:'El escondite es un sótano tras una lavandería que nunca lava nada. Mano Roja te espera con los brazos cruzados y los ojos que no parpadean. El hierro ha llegado.',
          fin:true }
      }}
    },

    // ── RANGO 2 ──────────────────────────────────────────────
    {
      id:'cont_nucleo',
      titulo:'EL NÚCLEO QUE SUSURRA',
      cliente:'Intermediario anónimo · paga en metálico',
      faccion:'ia',
      peligro:4, pagaBase:580, progreso:150, rangoMin:2,
      integridad:18, alertaInicial:15,
      resumen:'Un núcleo de memoria recuperado de un pozo profundo. Quien te paga no da nombre, solo coordenadas y una advertencia: "No lo conectes. No lo escuches. Solo entrégalo." El núcleo, en su caja de plomo, a veces emite un sonido. Como una voz muy lejana que repite algo que casi entiendes.',
      cierreOk:'Entregas la caja sin haberla abierto. El intermediario la pesa con las dos manos, casi con reverencia. "Hiciste bien en no escucharlo." No le preguntas por qué. El zumbido de la caja te acompaña en sueños durante semanas.',
      cierreFallo:'Pierdes el núcleo. Y durante mucho tiempo, en los momentos de silencio, te parece oír todavía aquel susurro, como si algo de lo que había dentro se hubiera quedado contigo.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges la caja de plomo bajo un puente de carga. Pesa como si guardara algo vivo. Contra el pecho, notas una vibración leve, rítmica, casi un latido. Te dijeron que no la escucharas. Empiezas a entender por qué.',
          ir:'colectivo' },
        colectivo:{ tipo:'confrontacion',
          texto:'El Colectivo Sin Nombre quiere el núcleo: para ellos, lo que susurra dentro es sagrado. Tres figuras encapuchadas te cierran el paso sin agresividad, casi con tristeza. "No es mercancía. Es un fragmento. Devuélvelo al silencio del que vino."',
          enemigos:[
            { nombre:'El que habla', desc:'Sereno, casi te convence', integridad:2, fuerza:3, umbral:2 },
            { nombre:'El que reza', desc:'Murmura sin parar', integridad:2, fuerza:3, umbral:2 },
            { nombre:'El que no habla', desc:'El peligroso', tipo:'bruto', integridad:3, fuerza:5, umbral:6 }
          ],
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'La caja zumba más fuerte cerca del reactor. Dos caminos, y el susurro te empuja por uno de ellos de un modo que no sabrías explicar.',
          ramas:[
            { txt:'CRUZAR JUNTO AL REACTOR', sub:'El zumbido marea, pero confunde rastreadores', ir:'reactor', botin:60 },
            { txt:'RODEAR POR LA ZONA MUERTA', sub:'Tranquilo, pero más expuesto a patrullas', ir:'zonamuerta' }
          ] },
        reactor:{ tipo:'narrativo',
          texto:'Cruzas junto al reactor. El zumbido de la caja se vuelve casi una palabra, y por un instante crees entenderla. Aprietas los dientes y sigues. Los rastreadores de HELIX, confundidos por la radiación, te pierden el rastro. Pequeña victoria.',
          ir:'anomalias' },
        zonamuerta:{ tipo:'hallazgo',
          texto:'Rodeas por la zona muerta. El silencio aquí es peor: ahora oyes el susurro con claridad, y crees distinguir tu propio nombre. En un nicho de la pared, alguien dejó una ofrenda: velas apagadas y una bolsa.',
          txtAbrir:'Coger la bolsa de la ofrenda', subAbrir:'Puede tener algo. O ser intocable',
          txtDejar:'No profanar la ofrenda', subDejar:'Hay cosas que no se tocan aquí abajo',
          riesgo:0.3, trampaHerida:2, trampaAlerta:8,
          recompensaCreditos:80,
          msgAbrir:'Dentro hay créditos y un amuleto de chatarra. El susurro parece... aprobar. O eso te imaginas. Te lo guardas y aceleras.',
          msgTrampa:'Al tocar la bolsa, algo se mueve en la oscuridad. Un guardián del Colectivo que velaba la ofrenda. Te marcas y huyes, con el corazón desbocado.',
          msgDejar:'Dejas la ofrenda intacta. En la zona muerta, el respeto es la única moneda que vale.',
          ir:'anomalias' },
        anomalias:{ tipo:'confrontacion',
          texto:'Una unidad de HELIX especializada —trajes negros, sin números de placa— rastrea la firma del núcleo. No gritan alto. Aparecen, y uno extiende la mano. "Eso pertenece a la División de Anomalías. Entrégalo y olvídalo."',
          enemigos:[
            { nombre:'Agente de Anomalías', desc:'Frío, metódico', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Agente de Anomalías', desc:'Te corta la huida', integridad:3, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Dron de rastreo', desc:'Atraído por el ruido', integridad:2, fuerza:3, umbral:4}],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El punto de entrega es una sala vacía con una sola luz. El intermediario espera de espaldas. La caja, ahora, está en silencio. Como si supiera que ha llegado.',
          fin:true }
      }}
    },

    // ── RANGO 3 (alto) ───────────────────────────────────────
    {
      id:'cont_testigo',
      titulo:'EL TESTIGO DE SILENCIO ESCARLATA',
      cliente:'Los Fantasmas de Marte',
      faccion:'loto',
      peligro:5, pagaBase:760, progreso:190, rangoMin:3,
      integridad:20, alertaInicial:20,
      resumen:'Un hombre que vio lo que HELIX hizo en Marte durante la Operación Silencio Escarlata, y que guardó pruebas. HELIX lleva décadas buscándolo. Los Fantasmas quieren sacarlo de Las Pilas vivo, con lo que sabe intacto. Será la noche más larga de tu vida, si la cuentas.',
      cierreOk:'El viejo sube al transporte con una caja de datos abrazada al pecho, igual que la madre abrazaba la medicina, igual que el ejecutivo el maletín. Todos abrazan algo en esta ciudad. "Marte sabrá la verdad", murmura. Tú no verás si es cierto. Pero esta noche, por una vez, ayudaste a que algo no se perdiera.',
      cierreFallo:'El testigo cae, y con él cuarenta años de verdad sobre lo que pasó en Marte. HELIX archivará el incidente con un número y ninguna palabra. La historia la escriben los que quedan, y esta noche no quedó él.',
      mapa:{ inicio:'buhardilla', nodos:{
        buhardilla:{ tipo:'narrativo',
          texto:'El viejo te espera en una buhardilla atestada de papel y cintas magnéticas, reliquias de una época en que la información se tocaba. "Llevo cuarenta años esperando esta noche", dice. "O me sacas, o me entierran con esto." Tose. "Las dos cosas me valen, si te soy sincero."',
          ir:'sicarios' },
        sicarios:{ tipo:'confrontacion',
          texto:'En cuanto pisáis la calle, sicarios del Ferro vendidos a HELIX surgen de tres portales. Don Vasek cobra bien por entregar fantasmas. "El viejo viene con nosotros", dice el líder. "Tú decides en qué estado."',
          enemigos:[
            { nombre:'Sicario líder', desc:'Pistola y galones', tipo:'lider', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Sicario veloz', desc:'Va a por el viejo', tipo:'rapido', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Sicario pesado', desc:'Bloquea la salida', tipo:'bruto', integridad:4, fuerza:4, umbral:4 }
          ],
          refuerzoTurno:4, refuerzoTurnoGrupo:[
            { nombre:'Coche del Ferro', desc:'Frena en seco, baja uno', integridad:2, fuerza:4, umbral:4 }
          ],
          ir:'copia' },
        copia:{ tipo:'encuentro',
          texto:'El viejo se para, sin aliento, y te tiende una copia de los datos. "Por si no llego. Tú no sabes lo que vale esto, y mejor así. Pero si caigo, que al menos cruce contigo." Te mira. "¿La llevas?"',
          txtAceptar:'Llevar la copia', subAceptar:'Un seguro, pero te marca como objetivo',
          txtRechazar:'Decirle que llegará él mismo', subRechazar:'Sin peso extra, todo a una carta',
          alertaAceptar:5,
          msgAceptar:'Te guardas la copia en el forro. Ahora hay dos razones para que HELIX te quiera muerto. Pero si el viejo cae, la verdad sigue de pie.',
          msgRechazar:'"Vas a llegar tú y se la das tú." El viejo sonríe, sin creerte del todo, y guarda la copia. "Optimista. Hace mucho que no conocía a uno."',
          irAceptar:'respiro', irRechazar:'respiro' },
        respiro:{ tipo:'hallazgo',
          texto:'Os agazapáis en un portal a recobrar el aliento. El viejo rebusca en su abrigo y te tiende, sin una palabra, un kit de trauma viejo pero sellado. "Cuarenta años escondiéndome enseñan a llevar siempre con qué remendarse", murmura.',
          txtAbrir:'Aceptar el kit', subAbrir:'Un respiro antes de lo que viene',
          txtDejar:'Decirle que lo guarde él', subDejar:'Él lo necesitará más',
          riesgo:0,
          recompensaItem:'kit_trauma',
          msgAbrir:'Te guardas el kit. El viejo asiente. "Para cuando aprieten." Y aprietan siempre.',
          msgDejar:'Le cierras la mano sobre el kit. "Guárdalo tú." Él te mira un instante, y por una vez no discute.',
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          ramas:[
            { txt:'FORZAR LA RUTA DIRECTA', sub:'Corta, pero erizada de HELIX', ir:'directa', alerta:25 },
            { txt:'BAJAR A LOS CANALES', sub:'Larga y dura para el viejo', ir:'canales' }
          ] },
        directa:{ tipo:'confrontacion',
          texto:'Tiráis por la directa. Cada esquina es un susto. En una de ellas, una patrulla de HELIX os ve y da el alto: el viejo aguanta a base de testarudez marciana mientras tú decides por los dos en un parpadeo.',
          enemigos:[
            { nombre:'Patrulla HELIX', desc:'Da el alto', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Patrulla HELIX', desc:'Cubre el flanco', integridad:3, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Refuerzo motorizado', desc:'El ruido los trae', integridad:2, fuerza:4, umbral:4}],
          ir:'unidadnegra' },
        canales:{ tipo:'hallazgo',
          texto:'Bajáis a los canales. El agua os llega a las rodillas y huele a lo que la ciudad esconde. El viejo tirita pero aguanta; aquí abajo HELIX no baja. Atascado en una reja, flota un petate impermeable de algún contrabandista que no volvió.',
          txtAbrir:'Abrir el petate', subAbrir:'Material de superviviencia, quizá',
          txtDejar:'Dejarlo flotar y seguir', subDejar:'El viejo no puede pararse',
          riesgo:0.15, trampaHerida:2,
          recompensaCreditos:90, recompensaItem:'kit_trauma',
          msgAbrir:'Dentro, sellado y seco: un kit de trauma y un fajo de créditos. Quien lo perdió ya no lo necesita. Vosotros sí.',
          msgTrampa:'Al tirar del petate resbalas en el limo y caes al agua helada. El viejo te ayuda a levantarte con una fuerza que no esperabas. Sales calado y dolorido.',
          msgDejar:'Lo dejas flotar. El viejo no puede permitirse que os paréis, y tú tampoco.',
          ir:'unidadnegra' },
        unidadnegra:{ tipo:'confrontacion',
          texto:'En el último tramo, una unidad negra de HELIX —los mismos trajes sin placa de siempre— os corta el paso. Saben quién es el viejo. Llevan décadas con esta orden. "Cuarenta años", dice uno, casi con respeto. "Casi lo consigue."',
          enemigos:[
            { nombre:'Comandante sin placa', desc:'No tiene prisa', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Operativo negro', desc:'Eficiente, callado', integridad:3, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:65, refuerzoGrupo:[{nombre:'Dron de combate', desc:'El ruido lo llamó', integridad:2, fuerza:4, umbral:4}],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El transporte de los Fantasmas espera con los motores en marcha, una sombra entre la lluvia. El piloto, marciano por el acento, solo dice: "Subid. Ya." No hace falta que lo repita.',
          fin:true }
      }}
    },

    // ── RANGO 0 (nuevas) ─────────────────────────────────────
    {
      id:'cont_semillas',
      titulo:'SEMILLAS QUE NO FIGURAN',
      cliente:'Un horticultor de azotea, sin facción',
      faccion:null,
      peligro:1, pagaBase:150, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Un saquito de semillas no modificadas, de las que HELIX prohibió porque no pagan licencia cada cosecha. De un invernadero clandestino a una azotea del otro lado del bloque. Verde contra el cemento. Pequeño delito, gran significado.',
      cierreOk:'El horticultor abre el saco y hunde las manos en las semillas como quien toca agua limpia. "Esto germina sin permiso de nadie", dice, casi para sí. Te paga con créditos y con un tomate de verdad, de los que ya casi no existen. Sabe a tierra y a algo perdido.',
      cierreFallo:'Las semillas acaban esparcidas por un suelo que nunca las hará crecer. Pisoteadas. HELIX se asegura de que ni lo verde sea libre.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'El invernadero clandestino es un armario de luces moradas detrás de una caldera. El cultivador te entrega el saco con cuidado de partera. "No las aplastes. No las mojes. Y por lo que más quieras, que no las huela un dron de licencias."',
          ir:'inspector' },
        inspector:{ tipo:'confrontacion',
          texto:'Un inspector de licencias agrarias de HELIX, de los de a pie, te para en el descansillo. Va solo, aburrido, con ganas de cubrir cuota. "Ese saco. Ábrelo." Huele a problema más que a autoridad.',
          enemigos:[
            { nombre:'Inspector de licencias', desc:'Solo y con cuota que cubrir', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'subida' },
        subida:{ tipo:'bifurcacion',
          texto:'Dos formas de subir a la azotea con el saco a cuestas.',
          ramas:[
            { txt:'EL MONTACARGAS DE LA VECINA', sub:'Rápido, si le das un puñado', ir:'montacargas' },
            { txt:'SUBIR POR LA ESCALERA', sub:'Gratis, pero cargando a pulso', ir:'puerta' }
          ] },
        montacargas:{ tipo:'encuentro',
          texto:'Una vecina que cultiva en su ventana te reconoce el saco de un vistazo. "¿Llevas de las buenas? Te abro el montacargas si me guardas un puñado." Negocio justo entre quien no tiene nada.',
          txtAceptar:'Darle un puñado por el montacargas', subAceptar:'Pierdes unas semillas, ganas el atajo',
          txtRechazar:'Subir a pie de todos modos', subRechazar:'Lo entregas todo, pero cargando',
          alertaAceptar:-5,
          msgAceptar:'Le dejas un puñado en el delantal. Ella sonríe con la boca cerrada y te abre el montacargas. Subes tres plantas en diez segundos.',
          msgRechazar:'"Otra vez será." No insiste. Subes a pie, saco al hombro, contando descansillos.',
          irAceptar:'final', irRechazar:'puerta' },
        puerta:{ tipo:'obstaculo',
          texto:'La puerta de la azotea está cerrada con una barra antiincendios oxidada que no cede.',
          coste:25,
          txtPagar:'Pagar al conserje que tiene la llave', subPagar:'Rápido y discreto',
          msgPagar:'El conserje aparece, abre sin mirarte y desaparece. La llave vuelve a su bolsillo como si nunca hubiera salido.',
          txtForzar:'Forzar la barra a la fuerza', subForzar:'Ruidoso, pero abre',
          msgForzar:'Empujas la barra con el hombro hasta que el óxido cede con un chirrido que despierta a media planta.', ruidoForzar:15,
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La azotea es un jardín imposible entre antenas y tanques de agua. El horticultor te espera con las manos ya manchadas de tierra. Has traído algo vivo a un sitio que se moría.',
          fin:true }
      }}
    },

    {
      id:'cont_recuerdo',
      titulo:'UN RECUERDO EN UNA CAJA',
      cliente:'Una viuda del sector textil',
      faccion:null,
      peligro:2, pagaBase:210, progreso:90, rangoMin:0,
      integridad:14, alertaInicial:5,
      resumen:'Una caja de memoria personal incautada por HELIX cuando murió su marido: recuerdos familiares que ahora son "propiedad en disputa". Un funcionario corrupto la sacó del depósito. Tú la llevas de vuelta a la viuda antes de que la echen en falta.',
      cierreOk:'La viuda conecta la caja a un visor viejo y por un instante la habitación se llena de la cara de un hombre riéndose en una playa que ya no existe. Se le quiebra algo en el gesto. "Gracias por traerme a casa lo único mío." No te mira a ti: mira la luz.',
      cierreFallo:'La caja se pierde, y con ella la última cara, la última voz, el último día de sol de un hombre al que ya nadie podrá recordar bien. Hay pérdidas que no se pagan en créditos.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges la caja de manos del funcionario, que no para de mirar por encima del hombro. "Si preguntan, esto nunca salió del depósito. Y yo no te conozco." La caja es liviana, pero pesa como pesan las cosas de los muertos.',
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Dos rutas hasta el bloque de la viuda, y son caminos distintos de verdad.',
          ramas:[
            { txt:'EL MERCADO NOCTURNO', sub:'Te camuflas entre la multitud', ir:'mercado' },
            { txt:'EL PASO ELEVADO', sub:'Solitario pero expuesto', ir:'elevado' }
          ] },
        mercado:{ tipo:'encuentro',
          texto:'Te metes en el río de gente del mercado. Un crío del barrio te ofrece, por unos créditos, "despistar a quien sea con un par de petardos". Tiene una sonrisa de pillo y un cartucho de pirotecnia casera.',
          txtAceptar:'Pagarle la distracción', subAceptar:'20 CR para bajar el calor',
          txtRechazar:'Seguir sin trucos', subRechazar:'Gratis, pero sin red',
          creditos:-20, alertaAceptar:-15,
          msgAceptar:'Le pagas. Dos estallidos secos al fondo del callejón y todas las cabezas giran hacia allí menos la tuya. Aprovechas.',
          msgRechazar:'"No me hace falta, chaval." Él se encoge de hombros y se guarda los petardos para otro incauto.',
          irAceptar:'final', irRechazar:'final' },
        elevado:{ tipo:'confrontacion',
          texto:'Cruzas el paso elevado bajo la lluvia. Estás solo, lo cual es bueno, hasta que dejas de estarlo: dos chatarreros de datos te siguieron desde el depósito. "Suéltala y nadie sale herido", dice uno, aunque sus ojos dicen otra cosa.',
          enemigos:[
            { nombre:'Chatarrero de datos', desc:'El que habla', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Chatarrero callado', desc:'Tantea por un lado', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El bloque de la viuda huele a tela vieja y a comida de una sola persona. Llamas con los nudillos. Tarda en abrir, como si ya no esperara buenas noticias de nadie.',
          fin:true }
      }}
    },

    // ── RANGO 1 (nueva) ──────────────────────────────────────
    {
      id:'cont_desertor',
      titulo:'EL QUE SE BAJA DEL ANILLO',
      cliente:'Una red de fuga, pago a plazos',
      faccion:'sindicatos',
      peligro:4, pagaBase:600, progreso:160, rangoMin:3,
      integridad:18, alertaInicial:10,
      resumen:'Un técnico de HELIX harto de firmar lo que firma quiere desaparecer del Anillo Blanco y bajar a la ciudad, donde no exista para sus jefes. Sacarlo de su torre y meterlo en el anonimato de Las Pilas antes del cambio de turno.',
      cierreOk:'El técnico mira las luces sucias de Las Pilas como quien ve el mar por primera vez. "Allá arriba todo brillaba y nada era mío", dice. "Aquí abajo, al menos, la mugre es honesta." Se pierde entre la gente. Por fin, nadie.',
      cierreFallo:'Lo devuelven al Anillo entre dos agentes, y a la torre que creía dejar atrás. Quien intenta bajarse de HELIX aprende que la puerta solo gira hacia dentro.',
      mapa:{ inicio:'garaje', nodos:{
        garaje:{ tipo:'narrativo',
          texto:'El técnico te espera en un garaje del Anillo con una sola bolsa y la cara de quien lleva semanas sin dormir. "Tengo doce minutos antes de que el sistema note que no estoy en mi puesto. Después de eso, soy un fugitivo. Hazlos contar."',
          ir:'guardias' },
        guardias:{ tipo:'confrontacion',
          texto:'Seguridad privada del Anillo os intercepta en el aparcamiento. No saben aún que deserta; creen que es un robo de activo. Dos guardias con porras de descarga y trajes impecables. "Identifíquese y aléjese del empleado."',
          enemigos:[
            { nombre:'Guardia del Anillo', desc:'Pulcro, entrenado', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Guardia del Anillo', desc:'Pide refuerzos por radio', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Patrulla del Anillo', desc:'La radio funcionó', integridad:2, fuerza:4, umbral:4}],
          ir:'bajada' },
        bajada:{ tipo:'bifurcacion',
          texto:'El ascensor de servicio que baja del Anillo a la ciudad exige credencial, y la del técnico ya está marcada. Dos formas de bajar, dos riesgos distintos.',
          ramas:[
            { txt:'EL MONTACARGAS DE CARGA', sub:'Os baja con la chatarra · 70 CR', ir:'montacargas', coste:70 },
            { txt:'PUENTEAR EL LECTOR Y BAJAR', sub:'Gratis, pero deja rastro en el sistema', ir:'puenteo', alerta:25 }
          ] },
        montacargas:{ tipo:'narrativo',
          texto:'El operario os esconde entre palés de residuos y baja el montacargas sin registrar el viaje. Oléis a basura del Anillo, que es la basura mejor perfumada del mundo. Bajáis sin dejar rastro, traqueteando en la oscuridad.',
          ir:'recuperacion' },
        puenteo:{ tipo:'hallazgo',
          texto:'El técnico puentea el lector con dedos temblorosos. El ascensor baja, pero deja una alarma silenciosa que tardará poco en sonar. En un cajón de herramientas del ascensor, abandonado, ves material que podría servir.',
          txtAbrir:'Coger el material del cajón', subAbrir:'Aprovechar mientras baja',
          txtDejar:'Concentrarte en la bajada', subDejar:'No distraerse con la alarma corriendo',
          riesgo:0.2, trampaAlerta:10,
          recompensaCreditos:50, recompensaItem:'cargador',
          msgAbrir:'Un cargador y unos créditos de mantenimiento. El técnico te mira sin entender cómo puedes pensar en eso ahora. Tú piensas en sobrevivir después.',
          msgTrampa:'Al abrir el cajón, disparas un sensor de inventario. Otra alarma más sumándose a la que ya corre. El técnico palidece.',
          msgDejar:'Lo dejas. Con una alarma silenciosa ya en marcha, cada segundo cuenta más que cualquier chatarra.',
          ir:'recuperacion' },
        recuperacion:{ tipo:'confrontacion',
          texto:'Ya en la ciudad, una unidad de recuperación de HELIX os espera: el sistema notó la ausencia. Tres agentes, y uno lleva el expediente del técnico en la mano. "Volver es más fácil para todos. Sobre todo para usted." El técnico tiembla a tu lado.',
          enemigos:[
            { nombre:'Agente de recuperación', desc:'Habla con calma de oficina', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente de recuperación', desc:'Corta la salida', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente novato', desc:'Más nervioso que tú', tipo:'cobarde', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El punto de fuga es una pensión sin nombre que alquila por horas y no pregunta. El técnico se gira antes de entrar, buscando palabras que no encuentra. Solo asiente. Es suficiente.',
          fin:true }
      }}
    },

    // ── RANGO 2 (nueva) ──────────────────────────────────────
    {
      id:'cont_organos',
      titulo:'CARGA REFRIGERADA',
      cliente:'Una clínica que no aparece en ningún registro',
      faccion:'eco',
      peligro:4, pagaBase:580, progreso:150, rangoMin:2,
      integridad:18, alertaInicial:15,
      resumen:'Una nevera portátil con un riñón dentro, etiquetado con un código de barras de HELIX y destinado a alguien que no puede pagar la lista oficial. El Culto de la Carne Perfecta también quiere órganos, por otras razones. Llevas vida humana en una caja fría, y todos en esta ruta la quieren.',
      cierreOk:'En la clínica clandestina, el cirujano abre la nevera y asiente. "Llega a tiempo. Alguien va a despertar mañana sin saber a quién se lo debe." El riñón, en su bolsa, con su código de barras de HELIX, parece lo más solitario del mundo. Cobras y procuras no pensar de dónde salió.',
      cierreFallo:'La nevera cambia de manos equivocadas. En algún quirófano sin licencia, o en algún altar del Culto, esa víscera tendrá un destino que prefieres no imaginar. Y alguien, en una lista de espera, no despertará mañana.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges la nevera en un muelle de carga. Pesa poco y zumba bajo, manteniendo el frío. En la tapa, una etiqueta impecable: código de barras, lote, fecha de caducidad. La burocracia de HELIX aplicada a un trozo de persona. Te revuelve más que cualquier sangre.',
          ir:'culto' },
        culto:{ tipo:'confrontacion',
          texto:'Fanáticos del Culto de la Carne Perfecta han olfateado la carga. Para ellos, un órgano sano es una reliquia. Tres figuras con túnicas manchadas te cierran el paso, serenas, sonrientes. "Esa carne merece un destino más alto que un mercado."',
          enemigos:[
            { nombre:'Devoto del Culto', desc:'Sonríe demasiado', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Devoto del Culto', desc:'Acaricia un bisturí', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Acólito joven', desc:'Aún no sabe lo que cree', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Fiel rezagado', desc:'El alboroto lo trae', integridad:2, fuerza:3, umbral:2}],
          ir:'control' },
        control:{ tipo:'bifurcacion',
          texto:'Un puesto de control sanitario de HELIX escanea toda carga refrigerada que cruza el sector. Un riñón sin papeles es una alarma garantizada. Cómo lo cruces marca el resto del camino.',
          ramas:[
            { txt:'SOBORNAR AL TÉCNICO DEL ESCÁNER', sub:'90 CR · la nevera pasa "vacía"', ir:'limpio', coste:90 },
            { txt:'DESVIAR POR EL CONDUCTO DE RESIDUOS', sub:'Sucio, arriesgas la cadena de frío', ir:'conducto', alerta:18 }
          ] },
        limpio:{ tipo:'narrativo',
          texto:'El técnico teclea que la nevera contiene "muestras de laboratorio sin valor" y os hace señas de que paséis. Los créditos compran adjetivos. Cruzas el control caminando despacio, como quien no tiene nada que esconder.',
          ir:'sanitaria' },
        conducto:{ tipo:'hallazgo',
          texto:'Metes la nevera por el conducto de residuos y la sigues a gatas. La recoges al otro lado rezando por que el frío haya aguantado: la luz de la tapa sigue verde, por los pelos. Entre la basura compactada, brilla algo metálico.',
          txtAbrir:'Rebuscar entre los residuos', subAbrir:'Algo de valor cayó aquí',
          txtDejar:'Salir de la mugre cuanto antes', subDejar:'La nevera es lo único que importa',
          riesgo:0.2, trampaHerida:2,
          recompensaCreditos:50, recompensaItem:'cargador',
          msgAbrir:'Un cargador y unos créditos que algún incauto tiró con la basura corporativa. La mugre de HELIX a veces paga. Te lo guardas.',
          msgTrampa:'Al rebuscar, te cortas con un filo oxidado escondido entre los desechos. Sangras y maldices. Lección aprendida.',
          msgDejar:'Lo dejas. La nevera y su frío son lo único que no puede esperar.',
          ir:'sanitaria' },
        sanitaria:{ tipo:'confrontacion',
          texto:'En el último tramo, una patrulla de la División de Anomalías de HELIX —que rastrea tráfico de tejidos no autorizado— os intercepta. No gritan. Uno mira la nevera y luego a ti. "Ese material es propiedad de HELIX hasta que se demuestre lo contrario. Entréguelo."',
          enemigos:[
            { nombre:'Agente sanitario', desc:'Frío como su carga', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente sanitario', desc:'Te corta la huida', integridad:3, fuerza:5, umbral:6 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La clínica clandestina es un sótano más limpio que cualquier calle de Las Pilas. El cirujano espera con los guantes ya puestos y los ojos cansados de quien salva vidas que el sistema descartó. Le tiendes la nevera.',
          fin:true }
      }}
    },

    {
      id:'cont_agua',
      titulo:'AGUA QUE NO PASA EL FILTRO',
      cliente:'Un fontanero del Bloque 12, sin facción',
      faccion:null,
      peligro:1, pagaBase:155, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Bidones de agua sin tratar por HELIX, más barata y casi igual de limpia, de una cisterna clandestina a un bloque al que llevan semanas cortándole el suministro. Pesa, gotea y huele a desafío.',
      cierreOk:'En el rellano del Bloque 12, una hilera de vecinos se pasa los bidones de mano en mano antes incluso de que cobres. Una cría bebe directamente del primero, con esa sed que no entiende de permisos. El fontanero te paga en monedas pequeñas y muchas. "Vuelve cuando quieras", dice. Sabes que volverás.',
      cierreFallo:'Los bidones acaban requisados, vertidos en una alcantarilla bajo la mirada de un inspector que ni se molesta en mirarte. El Bloque 12 seguirá una semana más midiendo el agua en vasos. Y tú, sin cobrar.',
      mapa:{ inicio:'cargar', nodos:{
        cargar:{ tipo:'narrativo',
          texto:'Cargas los bidones en una carretilla que chirría como un condenado. El agua se mueve dentro con un chapoteo que en el silencio de los corredores suena como una sirena. Cubres todo con una lona y rezas por que nadie tenga sed de preguntas.',
          ir:'inspector' },
        inspector:{ tipo:'encuentro',
          texto:'Un inspector de aguas de HELIX, solo y con cara de pocos turnos libres, te ve la carretilla. "¿Eso lleva sello sanitario?" No lo lleva, y los dos lo sabéis. Su mano se demora cerca del bolsillo, no del comunicador.',
          txtAceptar:'Untarle unos créditos', subAceptar:'30 CR · mira a otro lado',
          txtRechazar:'Jurarle que es agua de lluvia', subRechazar:'Arriesgarte al farol',
          creditos:-30, alertaAceptar:-5, alertaRechazar:15,
          msgAceptar:'Los créditos cambian de mano con la naturalidad de quien lo ha hecho mil veces. "Agua de lluvia, claro", dice, y se va silbando. La corrupción, a veces, es la única tubería que funciona.',
          msgRechazar:'"Agua de lluvia, en un bloque sin tejado al cielo." No te cree, pero le da pereza el papeleo. "Como te vea otra vez...", masculla, y te apunta la cara. Eso es lo que cuesta el farol: que te recuerden.',
          irAceptar:'ruta', irRechazar:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Dos formas de subir el agua hasta el Bloque 12, y con este peso la elección importa.',
          ramas:[
            { txt:'EL MONTACARGAS DE CARGA', sub:'Rápido · 30 CR al operario', ir:'final', coste:30, pista:'limpio' },
            { txt:'SUBIR POR LA RAMPA A PULSO', sub:'Gratis, pero lento y a la vista', ir:'matones', alerta:10, pista:'gente' }
          ] },
        matones:{ tipo:'confrontacion',
          texto:'A mitad de la rampa, dos correos de un aguador rival te cierran el paso. No les gusta que alguien venda agua más barata en su zona. "Esto no se sube hoy", dice uno, dándole una patada a un bidón.',
          enemigos:[
            { nombre:'Correo del aguador', desc:'Protege un monopolio', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Compinche', desc:'Va a por los bidones', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El Bloque 12 huele a ropa tendida y a gente apretada. En cuanto asomas la carretilla por el rellano, una puerta se abre, y luego otra, y otra. La voz ha corrido más rápido que tú.',
          fin:true }
      }}
    },

    {
      id:'cont_gato',
      titulo:'EL ÚLTIMO ENVÍO DE UNA VIDA',
      cliente:'Una anciana que se muda al fondo del nivel',
      faccion:null,
      peligro:1, pagaBase:140, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Una caja con las pertenencias de toda una vida —fotos, una vajilla desportillada, un gato vivo dentro de un transportín— de un piso embargado a un cuartucho al fondo del nivel. Frágil, ruidoso, y más pesado por dentro que por fuera.',
      cierreOk:'La anciana abre el transportín y el gato sale como si nada, indignado y vivo. Ella lo abraza y por un momento se olvida de la caja, del embargo, de ti. "Es lo único que me dejaron llevarme con corazón", dice del gato. Te paga lo que puede, que es poco, y te da las gracias dos veces por la misma cosa.',
      cierreFallo:'La caja se pierde en el trasiego, o se rompe, o el transportín queda abierto en algún corredor oscuro. La anciana llegará a su cuartucho sin lo único que le quedaba. Hay encargos que, al fallarlos, fallas a algo más que a un cliente.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges la caja en el piso medio vacío, con las marcas de los muebles aún en el polvo de las paredes. El gato protesta dentro del transportín con un maullido largo que rebota por el hueco de la escalera. La anciana te mira partir desde la puerta que ya no es suya.',
          ir:'cria' },
        cria:{ tipo:'encuentro',
          texto:'Una cría del corredor oye al gato y se planta delante, fascinada. "¿Me lo enseñas? Solo un segundo." Detrás de ella, su madre vigila con desconfianza. Pararte es perder tiempo y exponerte; pero la cría no se mueve.',
          txtAceptar:'Enseñarle el gato un momento', subAceptar:'Pierdes tiempo, ganas una sonrisa',
          txtRechazar:'Seguir sin pararte', subRechazar:'No es momento de ternuras',
          alertaRechazar:5,
          msgAceptar:'Bajas el transportín a su altura. La cría mete un dedo entre los barrotes y el gato, contra todo pronóstico, ronronea. La madre afloja el gesto. "Gracias", dice, y de pronto el corredor entero parece menos hostil contigo.',
          msgRechazar:'"Tengo prisa, pequeña." La apartas con suavidad y sigues. A tu espalda, la oyes preguntarle a su madre por qué la gente siempre tiene prisa. No tienes respuesta.',
          irAceptar:'ruta', irRechazar:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'El gato no para de maullar, y el ruido atrae miradas. Dos caminos al fondo del nivel.',
          ramas:[
            { txt:'EL CORREDOR PRINCIPAL', sub:'Corto, pero lleno de gente y oídos', ir:'perro', alerta:10, pista:'gente' },
            { txt:'EL PASILLO DE MANTENIMIENTO', sub:'Largo y solitario, sin testigos', ir:'hallazgo_caja', pista:'tranquilo' }
          ] },
        perro:{ tipo:'confrontacion',
          texto:'En el corredor principal, un perro callejero enorme huele al gato y se lanza, ladrando como un demonio. Su dueño, un tipo curtido, no hace nada por frenarlo: le divierte. Tienes que proteger la caja y el transportín del animal.',
          enemigos:[
            { nombre:'Perro furioso', desc:'Va a por el transportín', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        hallazgo_caja:{ tipo:'hallazgo',
          texto:'El pasillo de mantenimiento está en silencio, salvo por el gato. En una esquina, alguien dejó un petate de operario con herramientas y, asomando, lo que parece un fajo de créditos.',
          txtAbrir:'Mirar el petate', subAbrir:'Nadie lo reclama aquí',
          txtDejar:'Dejarlo y seguir', subDejar:'No cargar con más de lo que llevas',
          riesgo:0.2, trampaHerida:1,
          recompensaCreditos:45,
          msgAbrir:'Unos créditos y una linterna. El operario que los dejó no va a volver a buscarlos en una temporada. Te los guardas y sigues, con el gato de banda sonora.',
          msgTrampa:'Al tirar del petate, un tubo metálico mal apoyado se te viene encima y te golpea el hombro. Más ruido que daño, pero el gato se vuelve loco un buen rato.',
          msgDejar:'Lo dejas. Ya cargas con la vida entera de alguien; no necesitas la de otro encima.',
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El cuartucho del fondo del nivel es pequeño y oscuro, pero limpio. La anciana ya está allí, sentada en la única silla, esperando con las manos en el regazo. Al oír el maullido, se levanta de golpe, veinte años más joven de repente.',
          fin:true }
      }}
    },

    {
      id:'cont_meds_loto',
      titulo:'LA FARMACIA DEL ARRABAL',
      cliente:'Mano Roja · célula del Loto',
      faccion:'loto',
      peligro:3, pagaBase:380, progreso:115, rangoMin:1,
      integridad:16, alertaInicial:10,
      resumen:'Un lote de fármacos desviados del Hospital HELIX para la clínica clandestina que el Loto sostiene en el Arrabal Carmesí. Antibióticos, analgésicos, supresores. Lo que HELIX raciona, el Loto reparte. Cruzar el lote sin que la División de Anomalías lo huela.',
      cierreOk:'En la clínica del Arrabal, una enfermera del Loto abre las cajas y empieza a ordenar frascos antes de que termines de descargar. "Esto son tres vidas, por lo menos", dice sin levantar la vista. Mano Roja, desde la puerta, te dedica un cabeceo. El Loto cuida a los suyos, y ahora tú eres un poco de los suyos.',
      cierreFallo:'El lote se pierde, y con él los fármacos que la clínica del Arrabal esperaba. Alguien que iba a curarse esta semana no lo hará. El Loto no te culpa en voz alta, pero el Arrabal tiene memoria, y la memoria del Arrabal es una deuda.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges el lote en un muelle de carga del Hospital, de manos de un celador comprado que no te mira a los ojos. Las cajas llevan el sello de la hélice y un olor aséptico que delata lo que valen. Las metes en una mochila de reparto y te fundes con la noche.',
          ir:'control' },
        control:{ tipo:'bifurcacion',
          texto:'Entre el Hospital y el Arrabal hay un puesto de control de la División de Anomalías que escanea cargas médicas. Dos formas de sortearlo.',
          ramas:[
            { txt:'RODEAR POR LOS TEJADOS', sub:'Largo y agotador, pero sin escáner', ir:'tejados', pista:'tranquilo' },
            { txt:'CRUZAR CON LA MULTITUD DEL MERCADO', sub:'Rápido, pero entre ojos', ir:'mercado', alerta:15, pista:'gente' }
          ] },
        tejados:{ tipo:'hallazgo',
          texto:'Subes a los tejados y avanzas entre antenas y depósitos de agua. El Arrabal se extiende abajo, rojo de farolillos. En un palomar reconvertido en escondrijo, encuentras un alijo que alguien del Loto dejó y no recogió.',
          txtAbrir:'Registrar el escondrijo', subAbrir:'Material del Loto, quizá aprovechable',
          txtDejar:'Respetar el alijo ajeno', subDejar:'En el Arrabal, robar al Loto se paga',
          riesgo:0.2, trampaAlerta:10,
          recompensaCreditos:60, recompensaItem:'kit_trauma',
          msgAbrir:'Un kit de trauma y unos créditos. Material de la célula, abandonado en una huida. Lo tomas prestado: total, todo va al mismo Arrabal.',
          msgTrampa:'Al abrir el escondrijo, una marca de tiza en la pared te dice que era un alijo vigilado. Aceleras antes de que aparezca su dueño, con el corazón en la boca.',
          msgDejar:'Lo dejas intacto. En el Arrabal, el respeto entre los del Loto es lo único que aún se cotiza más que los créditos.',
          ir:'sicarios' },
        mercado:{ tipo:'confrontacion',
          texto:'Cruzas el mercado nocturno entre el gentío. A mitad de camino, un buscavidas que trabaja de informante para HELIX reconoce el olor del lote médico. "Eso vale una recompensa", dice, cerrándote el paso con una sonrisa torcida.',
          enemigos:[
            { nombre:'Informante de HELIX', desc:'Huele la recompensa', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'sicarios' },
        sicarios:{ tipo:'confrontacion',
          texto:'Casi en el Arrabal, una agente de la División de Anomalías peina la zona buscando precisamente fármacos desviados. No grita: aparece. "Material sanitario no autorizado", dice, leyendo el aire como si oliera las cajas. "Entréguelo."',
          enemigos:[
            { nombre:'Agente de Anomalías', desc:'Fría, metódica', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La clínica del Arrabal es un sótano más blanco y más limpio que cualquier cosa en kilómetros. Huele a alcohol y a esperanza administrada con cuentagotas. La enfermera del Loto te abre la puerta antes de que llames: te esperaba.',
          fin:true }
      }}
    },

    {
      id:'cont_pieza_ferro',
      titulo:'LA PIEZA QUE FALTA',
      cliente:'Don Vasek · Sindicato Ferro',
      faccion:'sindicatos',
      peligro:3, pagaBase:420, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:10,
      resumen:'Una pieza de maquinaria pesada —un regulador de presión del tamaño de un torso— que el Ferro necesita para que su taller del Distrito Ferro no se pare. Sin ella, una cadena entera de trabajo se detiene. Es legal a medias y pesa como un pecado.',
      cierreOk:'En el taller del Ferro, un capataz coge el regulador con las dos manos y lo encaja en la máquina muerta. Algo zumba, tose, y vuelve a la vida con un rugido grave. Los obreros levantan la vista. Don Vasek, desde una pasarela, te observa sin sonreír, que es como el Ferro da las gracias. "El orden vuelve a su sitio."',
      cierreFallo:'La pieza no llega, y el taller del Ferro pasa la noche en silencio, parado, sangrando créditos por cada hora muerta. Don Vasek no olvida lo que cuesta una cadena detenida. Ni quién la dejó detenida.',
      mapa:{ inicio:'cargar', nodos:{
        cargar:{ tipo:'narrativo',
          texto:'Cargas el regulador en una carretilla reforzada. Pesa lo que pesan las cosas que mueven otras cosas. Grasa negra te mancha las manos al primer contacto. Lo tapas con sacos y empujas hacia el Distrito Ferro, sintiendo cada junta del suelo en los riñones.',
          ir:'peaje' },
        peaje:{ tipo:'obstaculo',
          texto:'Una verja de seguridad cierra el paso al sector industrial. Un guardia privado, ni de HELIX ni del Ferro, cobra por abrir.',
          coste:50,
          txtPagar:'Pagar el peaje', subPagar:'Rápido y sin preguntas',
          msgPagar:'El guardia cuenta los créditos, abre la verja y vuelve a su garita sin una palabra. Hay puertas que solo entienden un idioma.',
          txtForzar:'Forzar la verja', subForzar:'Ruidoso, pero gratis',
          msgForzar:'Empujas la verja con la carretilla como ariete hasta que el pestillo cede con un chasquido metálico que retumba por todo el sector.', ruidoForzar:20,
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'El Distrito Ferro está a un tramo. Pero la zona la disputan el Ferro y bandas sueltas. Dos rutas.',
          ramas:[
            { txt:'LA AVENIDA DEL FERRO', sub:'Territorio sindicato, más seguro', ir:'final', pista:'tranquilo' },
            { txt:'EL ATAJO POR LOS DESGUACES', sub:'Corta camino, zona de nadie', ir:'chatarreros', alerta:12, pista:'combate' }
          ] },
        chatarreros:{ tipo:'confrontacion',
          texto:'En los desguaces, una banda de chatarreros ve el regulador asomando bajo los sacos y se le iluminan los ojos: una pieza así vale meses de rebusca. Tres salen de entre los hierros oxidados, palancas en mano. "Suéltala y vete andando."',
          enemigos:[
            { nombre:'Chatarrero jefe', desc:'Tasa la pieza con la mirada', tipo:'lider', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Chatarrero con palanca', desc:'Impaciente', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Chatarrero joven', desc:'Más hambre que oficio', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Chatarrero rezagado', desc:'Acude al ruido', integridad:2, fuerza:3, umbral:2}],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El taller del Ferro late con el ruido de cien máquinas, salvo una, parada y muda en mitad de la nave, esperando su corazón. El capataz te ve llegar con la carretilla y grita algo por encima del estruendo. Los obreros se apartan para dejarte pasar.',
          fin:true }
      }}
    }
  ],

  // ══════════════════════════════════════════════════════════
  //  BANDO SEGURIDAD — "EL OPERATIVO" (HELIX)
  //  Requiere credencial_helix para ejercer.
  // ══════════════════════════════════════════════════════════
  seguridad: [

    // ── RANGO 0 ──────────────────────────────────────────────
    {
      id:'seg_decomiso',
      titulo:'DECOMISO DE RUTINA',
      cliente:'HELIX · Seguridad de Distrito',
      faccion:'helix',
      peligro:1, pagaBase:170, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Orden de decomiso sobre un puesto del mercado que vende implantes sin licencia. La orden dice "incautar y advertir". No dice que la mujer del puesto lleva veinte años ahí y no tiene a dónde ir.',
      cierreOk:'Cierras el acta. HELIX lo archivará como un éxito. Tú archivas otra cosa: la cara de alguien que mañana no tendrá puesto. El sueldo entra igual.',
      cierreFallo:'El decomiso se tuerce y tu informe llega vacío. En HELIX, un acta sin cerrar es una mancha en tu expediente. Y las manchas se acumulan.',
      mapa:{ inicio:'llegada', nodos:{
        llegada:{ tipo:'narrativo',
          texto:'Llegas al puesto con la orden en la tablilla. Cápsulas de implantes baratos colgando de hilos, una báscula trucada, una mujer mayor que te ve la credencial y no se inmuta. Ya ha visto muchas como la tuya.',
          ir:'trato' },
        trato:{ tipo:'encuentro',
          texto:'La mujer te ofrece la mitad del género "para que el acta diga que ya no quedaba". Sus ojos no suplican; negocian. Es lo que hace para sobrevivir, y lo sabe hacer bien.',
          txtAceptar:'Aceptar el arreglo', subAceptar:'Te llevas algo, el acta queda "limpia"',
          txtRechazar:'Rechazar y proceder', subRechazar:'Por el libro, sin atajos',
          creditos:50, alertaAceptar:0, alertaRechazar:10,
          msgAceptar:'Coges la mitad del género y escribes que el resto "no se halló". Ella asiente. Los dos sabéis lo que acaba de pasar, y los dos vais a fingir que no.',
          msgRechazar:'Niegas. Ella aparta la mano despacio. "Por el libro, entonces", murmura. "Qué novedad." Y avisa a alguien con la mirada.',
          irAceptar:'cierre', irRechazar:'hijo' },
        hijo:{ tipo:'confrontacion',
          texto:'Un hijo de la mujer aparece por detrás del puesto, joven y furioso, con una llave inglesa. "Déjala en paz." No quiere pelear de verdad. Quiere que pares. Pero el miedo le tiembla en el brazo.',
          enemigos:[
            { nombre:'El hijo', desc:'Furioso, asustado', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'cierre' },
        cierre:{ tipo:'narrativo',
          texto:'El polvo se asienta sobre el puesto. Recoges lo que la orden manda recoger. El acta espera tu firma, parpadeando en la tablilla con esa luz indiferente de HELIX.',
          fin:true }
      }}
    },

    {
      id:'seg_redada',
      titulo:'REDADA EN EL ARRABAL',
      cliente:'HELIX · Operaciones Especiales',
      faccion:'helix',
      peligro:2, pagaBase:280, progreso:95, rangoMin:0,
      integridad:14, alertaInicial:10,
      resumen:'Información sobre un taller del Loto que monta armas de raíl en serie. Entrar, asegurar las pruebas y detener al encargado. El Arrabal Carmesí no recibe bien a los uniformes de HELIX, y aquí cada balcón es un par de ojos.',
      cierreOk:'Sales del taller con el encargado esposado y las pruebas en bolsas selladas. El Arrabal te mira pasar en un silencio que pesa. Has hecho tu trabajo. También te has ganado enemigos que no olvidan caras.',
      cierreFallo:'La redada se va al traste. El encargado escapa por un hueco que no figuraba en los planos, y sales del Arrabal con las manos vacías y la sensación de que todo el barrio se ríe a tu espalda.',
      mapa:{ inicio:'entrada', nodos:{
        entrada:{ tipo:'narrativo',
          texto:'Entras en el Arrabal cuando aún es de noche. Los farolillos rojos del Loto tiñen la lluvia. El taller está al fondo de un callejón, marcado con una mano roja descolorida. Hueles el ozono de las armas antes de verlas.',
          ir:'puerta' },
        puerta:{ tipo:'bifurcacion',
          texto:'La puerta del taller es de acero, con un cerrojo del Loto. Dentro se oye actividad. Cómo entres marca el resto de la noche.',
          ramas:[
            { txt:'DESCODIFICAR EL CERROJO', sub:'Limpio y silencioso · 60 CR', ir:'sigilo', coste:60 },
            { txt:'ECHAR LA PUERTA ABAJO', sub:'Brutal y ruidoso, pero gratis', ir:'ruidosa', alerta:25 }
          ] },
        sigilo:{ tipo:'narrativo',
          texto:'El descodificador muerde el cerrojo en silencio. La puerta cede sin un chasquido. Entras antes de que sepan que estás, y eso lo cambia todo: pillas a los operarios de espaldas.',
          ir:'operarios' },
        ruidosa:{ tipo:'narrativo',
          texto:'Revientas la puerta de una patada reglamentaria. El estruendo alerta a todo el taller. Cuando entras, ya te esperan de cara, herramientas en mano. Va a ser una carrera.',
          ir:'operarios' },
        operarios:{ tipo:'confrontacion',
          texto:'Dos operarios del Loto se interponen entre tú y el encargado, que ya corre hacia la trastienda. No son soldados, son currantes asustados con herramientas. Pero una llave de tubo abre la cabeza igual que cualquier otra cosa.',
          enemigos:[
            { nombre:'Operario con tubo', desc:'Defiende su pan', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Operario con soplete', desc:'Peligroso de cerca', integridad:2, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Refuerzo del Loto', desc:'El ruido los trae', integridad:2, fuerza:3, umbral:2}],
          ir:'encargado' },
        encargado:{ tipo:'confrontacion',
          texto:'Alcanzas al encargado en la trastienda. Es más viejo de lo que esperabas, y no corre más porque las piernas no le dan. Se gira con una pistola de raíl a medio montar, las manos temblándole. "No tengo otra cosa que esto", dice. "¿Tú sí?"',
          enemigos:[
            { nombre:'El encargado', desc:'Acorralado, armado a medias', integridad:2, fuerza:4, umbral:4 }
          ],
          ir:'salida' },
        salida:{ tipo:'narrativo',
          texto:'El encargado deja caer el arma sin terminar. Le pones las bridas mientras el taller cruje a tu alrededor. Las pruebas están aquí, frías y metálicas. Solo queda salir del Arrabal de una pieza.',
          fin:true }
      }}
    },

    // ── RANGO 1 ──────────────────────────────────────────────
    {
      id:'seg_escolta',
      titulo:'ESCOLTA DE UN HOMBRE QUE MIENTE',
      cliente:'HELIX · Protección de Activos',
      faccion:'helix',
      peligro:3, pagaBase:400, progreso:115, rangoMin:1,
      integridad:16, alertaInicial:5,
      resumen:'Escoltar a un ejecutivo de HELIX desde el Anillo a una reunión en territorio neutral. El hombre suda, miente sobre por qué, y media ciudad parece querer verlo muerto. Tu trabajo no es saber por qué. Tu trabajo es que llegue.',
      cierreOk:'Lo entregas en la sala de reunión, pálido pero entero. Antes de cruzar la puerta se gira: "No sabes lo que acabas de proteger." Tiene razón. No lo sabes. Y por cómo lo dice, prefieres seguir sin saberlo. Cobras y te vas.',
      cierreFallo:'El ejecutivo no llega. Lo que llega a HELIX es tu nombre, asociado a la palabra "fracaso" en un informe que leerá gente que nunca conocerás y que ya ha decidido que no vales.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Recoges al ejecutivo en un garaje del Anillo Blanco. Traje caro, manos que no han trabajado nunca, y un maletín que abraza como si fuera un hijo. "Rápido y discreto. Y no preguntes." No piensas preguntar.',
          ir:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Dos rutas hacia el punto neutral. El ejecutivo te mira esperando que elijas bien por los dos.',
          ramas:[
            { txt:'LOS BAJOS DEL MERCADO', sub:'Atajo, pero territorio hostil', ir:'bajos', alerta:18 },
            { txt:'LA AVENIDA PRINCIPAL', sub:'Expuesto pero con cámaras de HELIX', ir:'avenida' }
          ] },
        bajos:{ tipo:'confrontacion',
          texto:'Cortáis por los bajos del mercado. El ejecutivo se encoge dentro del abrigo, pero las miradas se clavan en él como agujas. Alguien sacó un comunicador, y ahora dos sombras os cierran el paso por el maletín.',
          enemigos:[
            { nombre:'Ladrón del mercado', desc:'Va a por el maletín', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Compinche', desc:'Te entretiene', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'oferta' },
        avenida:{ tipo:'hallazgo',
          texto:'Vais por la avenida, a la vista de todos. Las cámaras de HELIX son una jaula que también os protege. En un banco, alguien ha olvidado un maletín de seguridad pequeño, idéntico a los de mensajería corporativa.',
          txtAbrir:'Echar un vistazo al maletín', subAbrir:'Podría tener algo de valor',
          txtDejar:'No tocarlo, bajo las cámaras', subDejar:'Lo último que necesitas es una grabación',
          riesgo:0.3, trampaAlerta:20,
          recompensaCreditos:70,
          msgAbrir:'Dentro hay unos créditos sueltos y tarjetas caducadas. Te quedas lo aprovechable y sigues, fingiendo naturalidad ante las cámaras.',
          msgTrampa:'En cuanto lo tocas, una alarma silenciosa parpadea: era un cebo de seguridad. Las cámaras te han fichado hurgando. Mala idea.',
          msgDejar:'Lo dejas donde está. Bajo tantas cámaras, hasta respirar raro deja constancia.',
          ir:'oferta' },
        oferta:{ tipo:'encuentro',
          texto:'A mitad de camino, el ejecutivo te ofrece el doble de tu paga "si olvidas que el maletín existe y miras a otro lado un minuto". El sudor le corre por la sien. Lo que sea que lleva dentro, lo aterra a él también.',
          txtAceptar:'Aceptar el silencio', subAceptar:'Más créditos, menos preguntas',
          txtRechazar:'Rechazar y hacer el trabajo', subRechazar:'Solo lo que firmaste',
          creditos:120, alertaAceptar:0,
          msgAceptar:'Coges los créditos extra. No miras el maletín. No miras nada. Has aprendido que en HELIX la ceguera selectiva es la habilidad mejor pagada.',
          msgRechazar:'Niegas. "Te llevo a la reunión. Eso es lo que firmé." Él aprieta el maletín y no vuelve a hablar.',
          irAceptar:'emboscada', irRechazar:'emboscada' },
        emboscada:{ tipo:'confrontacion',
          texto:'En la puerta del punto neutral, un grupo del Loto ha montado una emboscada. No vienen por el maletín: vienen por el uniforme de HELIX. Por todo lo que les ha hecho HELIX. Tú eres la cara que tienen delante.',
          enemigos:[
            { nombre:'Loto enfurecido', desc:'Odio puro', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Loto con barra', desc:'Apunta al ejecutivo', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Loto joven', desc:'Más miedo que rabia', tipo:'cobarde', integridad:1, fuerza:2, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La sala de reunión es una caja de cristal ahumado con guardias propios. El ejecutivo cruza el umbral y, por primera vez en toda la noche, deja de abrazar el maletín. Tu parte termina aquí.',
          fin:true }
      }}
    },

    {
      id:'seg_motin',
      titulo:'MOTÍN EN EL BLOQUE 9',
      cliente:'HELIX · Contención de Disturbios',
      faccion:'helix',
      peligro:3, pagaBase:460, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:25,
      resumen:'Los vecinos del Bloque 9 llevan tres días sin agua limpia y han tomado el patio de mantenimiento. HELIX lo llama "disturbio". La orden es "restablecer el acceso al sistema". Lo que veas allí decidirá qué clase de mano de HELIX quieres ser.',
      cierreOk:'Restableces el acceso. El acta dirá "disturbio contenido". No dirá que la gente solo quería agua, ni lo que costó. HELIX paga por resultados, no por matices. Te guardas los matices para los días en que no puedas dormir.',
      cierreFallo:'El bloque te expulsa, y el informe te señala por no contener un patio lleno de gente con sed. HELIX no perdona la blandura ni la torpeza. No sabes cuál de las dos te achacarán.',
      mapa:{ inicio:'llegada', nodos:{
        llegada:{ tipo:'narrativo',
          texto:'El Bloque 9 huele a basura sin recoger y a rabia contenida. En el patio de mantenimiento, decenas de vecinos rodean la válvula maestra. Pancartas hechas con sábanas. Niños subidos a hombros. No es un ejército. Es gente con sed.',
          ir:'portavoz' },
        portavoz:{ tipo:'encuentro',
          texto:'Una mujer se adelanta, portavoz improvisada. "No queremos pelea. Queremos agua. Abre el sistema y nos vamos a casa." Tiene razón y los dos lo sabéis. Pero tu orden dice otra cosa.',
          txtAceptar:'Abrir tú mismo el agua', subAceptar:'Resuelve la causa, desobedece la orden',
          txtRechazar:'Ceñirte a la orden', subRechazar:'Restablecer acceso, despejar el patio',
          alertaAceptar:-25, alertaRechazar:15,
          msgAceptar:'Vas tú mismo a la válvula maestra, apartando miradas atónitas. El agua empieza a correr y el patio entero exhala. La gente se dispersa sin un golpe. Tu acta tendrá que mentir sobre cómo lo "contuviste".',
          msgRechazar:'Niegas. "Tengo una orden." Ella te mira como se mira a alguien que ha elegido el lado equivocado, y vuelve con los suyos. El aire se tensa como una cuerda.',
          irAceptar:'cierre', irRechazar:'choque' },
        choque:{ tipo:'confrontacion',
          texto:'Un grupo de vecinos jóvenes te cierra el paso a la válvula. No son matones, son hijos y hermanos con tubos y piedras. La desesperación pega más fuerte que el entrenamiento.',
          enemigos:[
            { nombre:'Vecino con tubo', desc:'Defiende la válvula', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vecina con piedra', desc:'Rápida, escurridiza', tipo:'rapido', integridad:1, fuerza:2, umbral:2 },
            { nombre:'Anciano terco', desc:'No se aparta', integridad:2, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[
            { nombre:'Más vecinos', desc:'El alboroto los suma', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Más vecinos', desc:'El patio entero despierta', integridad:1, fuerza:2, umbral:2 }
          ],
          ir:'valvula' },
        valvula:{ tipo:'obstaculo',
          texto:'Llegas a la válvula maestra, pero está bloqueada con una cadena y un candado de obra. Alguien sabía lo que hacía.',
          coste:0,
          txtForzar:'Romper la cadena a la fuerza', subForzar:'Lo único que puedes hacer',
          msgForzar:'No hay a quién pagar aquí. Revientas la cadena con la porra reglamentaria, eslabón a eslabón, mientras el patio te observa en un silencio tenso.', ruidoForzar:15,
          ir:'cierre' },
        cierre:{ tipo:'narrativo',
          texto:'La válvula gira por fin. Se oye el agua moverse por las tuberías muertas del bloque. Sea como sea que hayas llegado hasta aquí, el sistema vuelve a fluir. El acta espera. Decidirás qué cuentas en ella.',
          fin:true }
      }}
    },

    // ── RANGO 2 ──────────────────────────────────────────────
    {
      id:'seg_anomalia',
      titulo:'LO QUE NO FIGURA EN LA ORDEN',
      cliente:'HELIX · División de Anomalías',
      faccion:'helix',
      peligro:4, pagaBase:580, progreso:150, rangoMin:2,
      integridad:18, alertaInicial:15,
      resumen:'Una división de HELIX de la que nadie habla te asigna una recuperación: un contrabandista lleva un núcleo de memoria que "no debe existir". Recuperar el núcleo y al portador. La orden no explica por qué el portador, en la foto, tiene la mirada de alguien que ya no está del todo presente.',
      cierreOk:'Entregas el núcleo y al portador a la mujer sin nombre de la División. Lo recibe sin gracias, como quien recupera una herramienta. El portador, antes de que se lo lleven, te mira: "Tú también lo oirás, algún día. Todos lo oiremos." No duermes bien esa noche. Ni la siguiente.',
      cierreFallo:'El portador y el núcleo se te escapan. La División de Anomalías no llama, no reprende, no amenaza. Simplemente, a partir de esa noche, sientes que alguien te observa. Y nunca puedes demostrarlo.',
      mapa:{ inicio:'localizar', nodos:{
        localizar:{ tipo:'narrativo',
          texto:'Localizas al portador en una pensión de Las Pilas —por un momento confundes el lugar, como si la firma del núcleo te desordenara los recuerdos. El hombre está sentado en el borde de un catre, susurrándole a una caja de plomo.',
          ir:'colectivo' },
        colectivo:{ tipo:'confrontacion',
          texto:'El Colectivo Sin Nombre protege al portador: para ellos es un profeta, no un fugitivo. Tres encapuchados te bloquean la escalera. "Lo que oye no es una avería. Es lo más cerca que ha estado nadie de la verdad. Y vienes a apagarlo."',
          enemigos:[
            { nombre:'Encapuchado sereno', desc:'Intenta razonar', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Encapuchado fervoroso', desc:'No teme morir', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Encapuchado silencioso', desc:'El que de verdad pelea', tipo:'bruto', integridad:3, fuerza:5, umbral:6 }
          ],
          ir:'puerta' },
        puerta:{ tipo:'bifurcacion',
          texto:'El portador se encierra en la habitación. A través de la puerta lo oyes hablar con la caja en una lengua que no reconoces, una que parece más antigua que cualquier idioma humano. Tienes que entrar. La cuestión es cómo.',
          ramas:[
            { txt:'USAR EL INHIBIDOR DE LA DIVISIÓN', sub:'90 CR · lo neutraliza sin daño', ir:'inhibidor', coste:90 },
            { txt:'DERRIBAR LA PUERTA', sub:'Directo, pero él reacciona', ir:'derribar', alerta:10 }
          ] },
        inhibidor:{ tipo:'narrativo',
          texto:'Activas el inhibidor. El susurro tras la puerta se corta en seco. Oyes el cuerpo del portador desplomarse, inconsciente pero vivo. Entras. La caja, en su regazo, ha enmudecido también. Casi da más miedo el silencio.',
          ir:'fieles' },
        derribar:{ tipo:'narrativo',
          texto:'Derribas la puerta de una patada. El portador se gira con la caja abierta, y por una fracción de segundo ves dentro algo que tu mente se niega a recordar después. Te sangra la nariz. Sigues en pie, pero algo ha cambiado en ti.',
          ir:'fieles' },
        fieles:{ tipo:'confrontacion',
          texto:'El portador no se resiste con fuerza, sino con palabras, mientras dos fieles del Colectivo que quedaban en pie se interponen. "Si me entregas, lo desmontarán para entenderlo, y al hacerlo lo despertarán del todo. ¿De verdad crees que trabajas para los buenos?"',
          enemigos:[
            { nombre:'Fiel del Colectivo', desc:'Escudo humano', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Fiel del Colectivo', desc:'Protege al portador', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Vecino alarmado', desc:'El ruido lo despierta', integridad:1, fuerza:2, umbral:2}],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El punto de entrega es una furgoneta blanca sin distintivos, en un callejón que no aparece en ningún mapa de HELIX. La mujer sin nombre baja la ventanilla. No dice nada. Solo extiende la mano hacia la caja.',
          fin:true }
      }}
    },

    // ── RANGO 3 (alto) ───────────────────────────────────────
    {
      id:'seg_purga',
      titulo:'LA LIMPIEZA QUE NADIE FIRMA',
      cliente:'HELIX · Dirección (verbal, sin acta)',
      faccion:'helix',
      peligro:5, pagaBase:800, progreso:190, rangoMin:3,
      integridad:20, alertaInicial:20,
      resumen:'Una orden que llega de viva voz, sin papel, sin número: un agente de HELIX se ha vuelto, ha copiado archivos sobre la Operación Silencio Escarlata y va a entregarlos a los Fantasmas de Marte. Hay que pararlo antes de que cruce. Que lo hagas tú dice algo sobre dónde has llegado. Que aceptes dice algo sobre en qué te has convertido.',
      cierreOk:'Recuperas los archivos. El agente —el traidor, según HELIX; el único honesto, según él— ya no hablará. Nadie firmará lo de esta noche. No habrá medalla, ni acta, ni recuerdo oficial. Solo tú, sabiendo lo que hiciste, y una paga que de pronto pesa más de lo que vale.',
      cierreFallo:'Los archivos cruzan. En algún lugar de Marte, dentro de unas semanas, alguien sabrá la verdad. HELIX lo negará todo, y a ti te borrará del organigrama como si nunca hubieras llevado la placa. Quizá, en el fondo, preferías este final.',
      mapa:{ inicio:'orden', nodos:{
        orden:{ tipo:'narrativo',
          texto:'Te dan la foto del agente en un coche sin matrícula, y nada más: ni acta, ni respaldo, ni testigos. "Si sale bien, no ha pasado. Si sale mal, no te conocemos." El que te lo dice no te mira a los ojos. Tú tampoco a él.',
          ir:'fantasmas' },
        fantasmas:{ tipo:'confrontacion',
          texto:'El agente no viene solo: los Fantasmas de Marte lo escoltan. Veteranos de una guerra que HELIX dio por ganada. Salen de la oscuridad sin prisa, con la calma de quien ya ha sobrevivido a lo peor. "Otro perro de HELIX", dice uno. "¿Cuántos más vais a mandar?"',
          enemigos:[
            { nombre:'Fantasma veterano', desc:'Curtido, sin miedo', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Fantasma joven', desc:'Tiene algo que demostrar', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Fantasma francotirador', desc:'Cubre desde atrás', tipo:'rapido', integridad:2, fuerza:4, umbral:6 }
          ],
          refuerzoSiRuido:70, refuerzoGrupo:[
            { nombre:'Coche de los Fantasmas', desc:'El tiroteo los llama', integridad:3, fuerza:4, umbral:4 }
          ],
          ir:'oferta' },
        oferta:{ tipo:'encuentro',
          texto:'En un alto, el agente te habla a través de la lluvia, sin levantar el arma. "Leí los archivos. Por eso huyo. Tú no los has leído: por eso me persigues. ¿Y si los lees antes de decidir?" Te tiende una copia. La oferta es un abismo.',
          txtAceptar:'Leer los archivos', subAceptar:'Sabrás la verdad. No podrás des-saberla',
          txtRechazar:'No leerlos', subRechazar:'Lo que no sabes no te quita el sueño',
          alertaAceptar:5,
          msgAceptar:'Lees. Solo unas líneas, a la luz de un rótulo. Es suficiente. Lo que HELIX hizo en Marte no cabe en ningún acta. Cierras el archivo con las manos temblando. Sigas con la misión o no, esta noche ya no eres el mismo.',
          msgRechazar:'Apartas la copia sin mirarla. "No me pagan por leer." El agente asiente, casi con lástima. "Claro. Es más fácil así. Yo también lo creía."',
          irAceptar:'respiro', irRechazar:'respiro' },
        respiro:{ tipo:'hallazgo',
          texto:'El agente se retira unos pasos, sin darte la espalda del todo. En el suelo, junto a un contenedor, hay un botiquín de campaña que alguien dejó caer en la huida. Los dos lo veis a la vez. Él no se mueve a por él.',
          txtAbrir:'Coger el botiquín', subAbrir:'Lo vas a necesitar para lo que viene',
          txtDejar:'Dejarlo, no bajar la guardia', subDejar:'No fiarte ni un segundo',
          riesgo:0,
          recompensaItem:'kit_trauma',
          msgAbrir:'Recoges el botiquín sin perderlo de vista. "Quédatelo", dice el agente. "Yo ya no voy a necesitarlo." No sabes si es resignación o amenaza.',
          msgDejar:'Lo dejas donde está. Entre vosotros dos, agacharte es un lujo que no te permites.',
          ir:'persecucion' },
        persecucion:{ tipo:'bifurcacion',
          texto:'El agente corre hacia el puerto. Dos formas de cortarle, y cada una dice algo distinto sobre quién eres.',
          ramas:[
            { txt:'CORTAR POR LA PASARELA', sub:'Rápido, grabado por las cámaras de HELIX', ir:'pasarela', alerta:20 },
            { txt:'EMBOSCARLO EN EL SUBSUELO', sub:'Sin testigos de ninguna clase', ir:'subsuelo' }
          ] },
        pasarela:{ tipo:'narrativo',
          texto:'Lo cortas en la pasarela, bajo el ojo de las cámaras. Lo que pase aquí quedará grabado: HELIX lo verá. A veces los testigos protegen. A veces condenan. El agente se detiene, acorralado a la vista de todos.',
          ir:'acorralado' },
        subsuelo:{ tipo:'hallazgo',
          texto:'Bajas al subsuelo y le cierras la única salida. Aquí no hay cámaras, ni Fantasmas, ni nadie. Solo vosotros dos y lo que decidas hacer. En un recoveco, entre tuberías, alguien dejó escondido un zurrón sellado.',
          txtAbrir:'Registrar el zurrón', subAbrir:'Aquí abajo nadie reclama nada',
          txtDejar:'Ignorarlo, ir a por el agente', subDejar:'No es el momento',
          riesgo:0.15, trampaHerida:2,
          recompensaCreditos:80, recompensaItem:'kit_trauma',
          msgAbrir:'Un kit de trauma y créditos de algún fugitivo anterior. El subsuelo guarda los secretos de todos los que bajaron a no ser vistos. Te lo quedas.',
          msgTrampa:'Al abrir el zurrón, un cepo oxidado te muerde la mano. Alguien protegía su escondite. Sangras en la oscuridad, a solas con tu objetivo.',
          msgDejar:'Lo dejas. El agente está a unos metros y eso es lo único que importa ahora.',
          ir:'acorralado' },
        acorralado:{ tipo:'confrontacion',
          texto:'Acorralas al agente en el último tramo. Está herido, sin escolta, abrazando la caja de archivos igual que todos en esta ciudad abrazan lo único que les queda. No levanta el arma. "Hazlo, entonces", dice, cansado. "Pero que sepas que lo sabes."',
          enemigos:[
            { nombre:'El agente', desc:'Herido, sin rendirse', integridad:3, fuerza:4, umbral:4 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'Lo que queda de la noche lo harás en silencio. Recoges la caja —o lo que decidas recoger— y desandas el camino hacia un HELIX que nunca admitirá haberte enviado. La lluvia, al menos, no hace preguntas.',
          fin:true }
      }}
    },

    // ── RANGO 0 (nuevas) ─────────────────────────────────────
    {
      id:'seg_multa',
      titulo:'NOTIFICACIÓN EN MANO',
      cliente:'HELIX · Recaudación de Distrito',
      faccion:'helix',
      peligro:1, pagaBase:150, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Entregar en mano una notificación de multa por "consumo de agua no declarado" a un inquilino del Bloque 7. Papeleo. La clase de tarea que HELIX da a los nuevos para ver si tienen estómago para mirar a la cara a quien arruinan.',
      cierreOk:'El hombre firma la notificación con una mano que no tiembla, porque ya no le queda con qué temblar. "Dile a HELIX que el agua que no declaré era la lluvia que entraba por el techo roto." Cierras el acta. La frase se te queda dentro más de lo que debería.',
      cierreFallo:'La notificación no llega a firmarse y vuelves con el acta abierta. En Recaudación, un papel sin cerrar es un día sin cobrar, y eso lo notan enseguida.',
      mapa:{ inicio:'pasillo', nodos:{
        pasillo:{ tipo:'narrativo',
          texto:'El Bloque 7 tiene los pasillos a oscuras para ahorrar en luz. Buscas la puerta del moroso entre números medio borrados. Detrás de cada mirilla notas ojos que te calculan el uniforme.',
          ir:'vecina' },
        vecina:{ tipo:'encuentro',
          texto:'Una vecina te corta el paso, fingiendo barrer. "El del 314 es buena gente. Se le murió la mujer. ¿No puedes perder ese papel y ya?" Te mira como quien tantea cuánta humanidad le queda al de turno.',
          txtAceptar:'"Hoy no he encontrado a nadie en casa"', subAceptar:'Aplazas la multa, mientes en el acta',
          txtRechazar:'"Tengo que entregarla igual"', subRechazar:'Cumples la orden',
          alertaAceptar:0,
          msgAceptar:'Asientes despacio. "Hoy no había nadie." Ella afloja los hombros. El del 314 tendrá una semana más antes de que manden a otro menos blando que tú.',
          msgRechazar:'"Lo siento. Es mi trabajo." Ella vuelve a barrer un suelo ya limpio, y no te mira más.',
          irAceptar:'cierre', irRechazar:'hijo' },
        hijo:{ tipo:'confrontacion',
          texto:'El hijo del moroso te encuentra en el pasillo y se planta delante de la puerta de su padre con una tubería en la mano. "Por encima de mí no pasas." No es un matón. Es un crío defendiendo lo poco que le queda.',
          enemigos:[
            { nombre:'El hijo', desc:'Más miedo que furia', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'cierre' },
        cierre:{ tipo:'narrativo',
          texto:'El padre aparta al hijo con una mano en el pecho, cansado. "Déjalo, que solo cumple. Dame el papel." Le tiendes la notificación. El acta espera tu firma, fría como siempre.',
          fin:true }
      }}
    },

    {
      id:'seg_contrabandista',
      titulo:'EL PEZ PEQUEÑO',
      cliente:'HELIX · Aduana Interior',
      faccion:'helix',
      peligro:2, pagaBase:250, progreso:92, rangoMin:0,
      integridad:14, alertaInicial:10,
      resumen:'Atrapar a un contrabandista de poca monta que mueve mercancía sin licencia por los túneles del mercado. La orden dice "detener e incautar". Lo que no dice es que el pez pequeño solo trafica para pagar el implante cardíaco de su hija. Vas a pescarlo igualmente.',
      cierreOk:'Esposas el contrabandista contra un puesto cerrado. No forcejea. "El siguiente que mandéis encontrará a otro como yo al día siguiente", dice sin rencor. "Siempre habrá un pez pequeño. Vosotros os encargáis de eso." Cierras la incautación. Tiene razón y los dos lo sabéis.',
      cierreFallo:'El contrabandista se te escurre entre los puestos y se traga los túneles. La incautación queda en nada, y Aduana apunta tu nombre en la columna de los que no rematan.',
      mapa:{ inicio:'tuneles', nodos:{
        tuneles:{ tipo:'narrativo',
          texto:'Los túneles bajo el mercado huelen a fritanga y a humedad. El contrabandista mueve cajas en un recodo, dándote la espalda, silbando bajito. No espera a nadie. Sobre todo, no te espera a ti.',
          ir:'aproximacion' },
        aproximacion:{ tipo:'bifurcacion',
          texto:'Puedes acercarte de frente o cortarle la salida. Cómo lo abordes decide si corre o cae.',
          ramas:[
            { txt:'DE FRENTE, CON LA PLACA', sub:'Rápido, pero puede correr', ir:'persecucion', alerta:20 },
            { txt:'RODEAR Y CORTARLE LA SALIDA', sub:'Lento, pero lo acorralas', ir:'acorralar' }
          ] },
        persecucion:{ tipo:'narrativo',
          texto:'Avanzas de frente. Él te ve, suelta la caja y arranca a correr por los túneles. Lo persigues entre puestos cerrados y vapor de freidoras hasta que un callejón sin salida lo detiene. Jadea, acorralado al fin.',
          ir:'forcejeo' },
        acorralar:{ tipo:'narrativo',
          texto:'Rodeas en silencio por el túnel paralelo. Cuando él se gira para huir, te encuentra bloqueándole el único camino. No hay a dónde correr, y lo sabe antes que tú.',
          ir:'forcejeo' },
        forcejeo:{ tipo:'confrontacion',
          texto:'Acorralado, el contrabandista no se rinde: empuja las cajas hacia ti y se defiende con un gancho de carga. "Tengo que llegar a casa esta noche", jadea. "No lo entiendes." Quizá sí lo entiendes. Da igual.',
          enemigos:[
            { nombre:'El contrabandista', desc:'Desesperado, no profesional', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:60, refuerzoGrupo:[{nombre:'Compinche del túnel', desc:'Acude al jaleo', integridad:2, fuerza:3, umbral:2}],
          ir:'receta' },
        receta:{ tipo:'encuentro',
          texto:'Reducido el hombre, encuentras en su caja la mercancía... y una receta médica a nombre de una niña. Puedes incautarlo todo, o quedarte solo con la mercancía y "no ver" lo demás.',
          txtAceptar:'Incautar solo la mercancía', subAceptar:'Cumples lo justo, le dejas la receta',
          txtRechazar:'Incautarlo todo, según el reglamento', subRechazar:'Por el libro, sin excepciones',
          creditos:0,
          msgAceptar:'Sellas la mercancía en la bolsa de pruebas y dejas caer la receta al suelo, como si no la hubieras visto. Él la recoge sin decir nada. Hay silencios que valen más que palabras.',
          msgRechazar:'Lo metes todo en la bolsa, receta incluida. El reglamento no distingue. Tú decidiste no distinguir tampoco.',
          irAceptar:'cierre', irRechazar:'cierre' },
        cierre:{ tipo:'narrativo',
          texto:'Sacas al contrabandista a la superficie con las bridas puestas. La incautación está cerrada. Aduana tendrá su pez pequeño de hoy. Mañana habrá otro, y ambos lo sabéis.',
          fin:true }
      }}
    },

    // ── RANGO 1 (nueva) ──────────────────────────────────────
    {
      id:'seg_desahucio',
      titulo:'ORDEN DE DESALOJO',
      cliente:'HELIX · Gestión Inmobiliaria',
      faccion:'helix',
      peligro:4, pagaBase:600, progreso:160, rangoMin:3,
      integridad:18, alertaInicial:20,
      resumen:'Ejecutar el desalojo de una planta entera del Bloque 4: HELIX la quiere vacía para reconvertirla en almacenes. Los inquilinos llevan generaciones ahí. La orden es firme. Lo que hagas con la gente que no tiene a dónde ir lo decides tú, pero la planta tiene que quedar vacía.',
      cierreOk:'La planta queda despejada. El acta lo llamará "recuperación de activo inmobiliario". No mencionará a la anciana que se llevó una maceta como único equipaje, ni al hombre que se sentó en el rellano a mirar la puerta que ya no era suya. HELIX paga por metros cuadrados, no por historias.',
      cierreFallo:'El desalojo se atasca, la planta sigue habitada y tu informe llega incompleto. Gestión Inmobiliaria no entiende de compasión ni de torpeza: solo ve una orden sin cumplir con tu firma debajo.',
      mapa:{ inicio:'llegada', nodos:{
        llegada:{ tipo:'narrativo',
          texto:'La planta del Bloque 4 huele a comida de muchas casas y a años de la misma gente. Pegas la orden de desalojo en la pared central. Las puertas empiezan a abrirse, una a una, con caras que ya conocen este momento de oídas.',
          ir:'portavoz' },
        portavoz:{ tipo:'encuentro',
          texto:'Un portavoz vecinal se te acerca con las manos abiertas. "Danos hasta el amanecer para sacar lo nuestro sin destrozarlo. A cambio, salimos sin pelea. Nadie quiere sangre por unos trastos." La oferta es razonable. Tu orden dice "inmediato".',
          txtAceptar:'Darles hasta el amanecer', subAceptar:'Evitas el conflicto, desobedeces el "inmediato"',
          txtRechazar:'Ejecutar de inmediato', subRechazar:'Cumples la orden al pie de la letra',
          alertaAceptar:-25, alertaRechazar:15,
          msgAceptar:'Aceptas. "Hasta que salga el sol. Ni un minuto más." El portavoz asiente y la planta entera exhala. Recogerán sus vidas con dignidad. Tu acta tendrá que maquillar el retraso, pero hoy nadie sangra.',
          msgRechazar:'"La orden dice ahora." El portavoz baja las manos. "Entonces que conste que lo intentamos por las buenas." Da media vuelta. El aire se tensa como una cuerda a punto de partirse.',
          irAceptar:'ultima', irRechazar:'atrinchera' },
        atrinchera:{ tipo:'confrontacion',
          texto:'Un grupo de vecinos se atrinchera en el rellano, brazos enlazados, decididos a no moverse. Detrás, otros apilan muebles contra una puerta. No son violentos hasta que los empujas. Y tú vas a tener que empujar.',
          enemigos:[
            { nombre:'Vecino atrincherado', desc:'No piensa moverse', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Madre con sus cosas', desc:'Protege la puerta', integridad:2, fuerza:2, umbral:2 },
            { nombre:'Joven furioso', desc:'Busca pelea', integridad:2, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[
            { nombre:'Más vecinos', desc:'El grito los convoca', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vecino mayor', desc:'Se suma con un bastón', integridad:1, fuerza:2, umbral:2 }
          ],
          ir:'ultima' },
        ultima:{ tipo:'obstaculo',
          texto:'La última puerta está atrancada por dentro. Se oye dentro a alguien que se niega a abrir, y un llanto de niño que se cuela por la rendija.',
          coste:50,
          txtPagar:'Llamar a un mediador social de HELIX', subPagar:'Cuesta, pero abre sin violencia',
          msgPagar:'Pagas para que suba un mediador. Tras veinte minutos de voz suave, la puerta se abre y sale una familia con los ojos rojos pero entera. A veces el dinero compra dignidad.',
          txtForzar:'Echar la puerta abajo', subForzar:'Rápido y brutal',
          msgForzar:'Revientas la puerta de una patada. El llanto del niño sube de tono. Apartas la vista mientras la familia sale a empujones. Esto pesará luego, en la cama, a oscuras.', ruidoForzar:20, heridaForzar:1,
          ir:'cierre' },
        cierre:{ tipo:'narrativo',
          texto:'La planta queda en silencio, las puertas abiertas a habitaciones vacías que aún huelen a vida. Sea como hayas llegado hasta aquí, HELIX tendrá sus metros cuadrados. El acta espera. Y tú también, aunque no sepas a qué.',
          fin:true }
      }}
    },

    // ── RANGO 2 (nueva) ──────────────────────────────────────
    {
      id:'seg_chivato',
      titulo:'EL INFORMANTE QUEMADO',
      cliente:'HELIX · Inteligencia de Distrito',
      faccion:'helix',
      peligro:4, pagaBase:570, progreso:150, rangoMin:2,
      integridad:18, alertaInicial:15,
      resumen:'Un informante de HELIX dentro del Loto ha sido descubierto y tiene horas de vida. Inteligencia quiere extraerlo —no por humanidad, sino porque sabe demasiado. Sacarlo del Arrabal antes de que el Loto lo encuentre. Salvas a un traidor para proteger a la empresa. El heroísmo, aquí, tiene letra pequeña.',
      cierreOk:'Entregas al informante, temblando pero vivo, al coche sin distintivos de Inteligencia. "Gracias", balbucea. No sabes si a ti o a su suerte. Lo que sabe seguirá siendo de HELIX, no del Loto. Eso es lo que has salvado: información. Que el hombre respire es un efecto secundario.',
      cierreFallo:'El Loto encuentra al informante antes que tú. Lo que el hombre sabía morirá con él, de una forma que el Arrabal contará en susurros durante meses. Inteligencia anota la fuga como "activo perdido", dos palabras para una vida.',
      mapa:{ inicio:'encontrar', nodos:{
        encontrar:{ tipo:'narrativo',
          texto:'Encuentras al informante escondido en el altillo de una tienda de empeños del Arrabal, blanco como el papel. "Saben que soy yo. Lo saben." Te agarra del brazo. "El Loto no perdona a los chivatos. Sácame de aquí o soy hombre muerto antes del alba."',
          ir:'cazadores' },
        cazadores:{ tipo:'confrontacion',
          texto:'Cazadores del Loto peinan el Arrabal buscándolo. Dos dan con vosotros en un callejón, y un tercero vigila desde la esquina. No traen prisa: el barrio es suyo y lo saben. "Entréganos al soplón y a lo mejor te dejamos salir entero, uniforme."',
          enemigos:[
            { nombre:'Cazador del Loto', desc:'El que decide', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Cazador del Loto', desc:'El otro, más lento', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vigía del barrio', desc:'Avisa a los demás', integridad:1, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:65, refuerzoGrupo:[{nombre:'Refuerzo del Loto', desc:'El vigía cumplió', integridad:2, fuerza:3, umbral:2}],
          ir:'ruta' },
        ruta:{ tipo:'encuentro',
          texto:'El informante, aterrado, te ofrece un nombre: "Conozco un pasadizo del Loto, uno que ni ellos vigilan, porque casi nadie sabe que existe. Te lo digo si me juras que llego vivo." La información puede salvaros... o ser su última mentira.',
          txtAceptar:'Confiar en el pasadizo', subAceptar:'Si dice verdad, evitáis lo peor',
          txtRechazar:'No fiarte de un chivato', subRechazar:'Sigues tu propio criterio, de frente',
          alertaAceptar:-15,
          msgAceptar:'Sigues su indicación hacia una grieta entre dos muros que parece un callejón sin salida. No lo es. Os tragáis la oscuridad y dejáis atrás a los cazadores. El soplón, por una vez, no mintió.',
          msgRechazar:'"Un hombre que traiciona a los suyos no me sirve de guía." Él traga saliva. Seguís de frente, a tu manera, directos hacia donde más aprietan.',
          irAceptar:'lugarteniente_solo', irRechazar:'lugarteniente' },
        lugarteniente_solo:{ tipo:'confrontacion',
          texto:'El pasadizo os escupe casi en la salida del Arrabal. Pero el lugarteniente del Loto conocía la grieta mejor que el informante: os espera, solo, sin escolta, con una pistola y una calma que hiela. "Cuánto daño en una boca tan pequeña", dice, casi con pena. "Esto es asunto de familia."',
          enemigos:[
            { nombre:'Lugarteniente del Loto', desc:'Solo, pero letal', tipo:'lider', integridad:3, fuerza:5, umbral:6 }
          ],
          ir:'final' },
        lugarteniente:{ tipo:'confrontacion',
          texto:'Casi en la salida del Arrabal, el lugarteniente del Loto en persona os cierra el paso con dos hombres. Conoce al informante por su nombre. "Cuánto daño en una boca tan pequeña", dice, casi con pena. "Apártate, uniforme. Esto es asunto de familia."',
          enemigos:[
            { nombre:'Lugarteniente del Loto', desc:'Tranquilo, letal', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Soldado del Loto', desc:'Fiel hasta el final', integridad:3, fuerza:4, umbral:4 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El coche de Inteligencia espera con el motor en marcha al borde del Arrabal, donde el farolillo rojo da paso a la luz blanca de HELIX. El informante corre hacia él sin mirar atrás. Tu parte, la sucia, termina aquí.',
          fin:true }
      }}
    },

    {
      id:'seg_ronda',
      titulo:'RONDA NOCTURNA',
      cliente:'HELIX · Seguridad de Distrito',
      faccion:'helix',
      peligro:1, pagaBase:160, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Una ronda rutinaria por los corredores del Sector 7: comprobar tres puntos marcados, "disuadir actividad irregular" y cerrar el parte. La clase de turno aburrido en el que nunca pasa nada. Hasta que pasa.',
      cierreOk:'Cierras el parte en la última baliza. "Ronda sin incidencias", escribes, aunque la noche haya tenido más de lo que cabe en esas tres palabras. HELIX paga igual por una ronda tranquila que por una movida, mientras el parte diga lo correcto. Aprendes qué es lo correcto.',
      cierreFallo:'La ronda se tuerce y el parte queda sin cerrar. En Seguridad de Distrito, una baliza sin marcar es un turno sin cobrar y una pregunta en tu expediente. Las preguntas, en HELIX, se acumulan.',
      mapa:{ inicio:'inicio', nodos:{
        inicio:{ tipo:'narrativo',
          texto:'Las balizas de control parpadean en rojo, esperando tu credencial. El Sector 7 a estas horas es un pasillo de luces muertas y goteras. Tu propia respiración suena demasiado fuerte. Empiezas la ronda.',
          ir:'borracho' },
        borracho:{ tipo:'encuentro',
          texto:'En la primera baliza, un hombre borracho duerme la mona tirado justo sobre el lector. No es peligroso, solo está roto. La orden dice "disuadir actividad irregular". Él es, técnicamente, actividad irregular.',
          txtAceptar:'Despertarlo con buenas y apartarlo', subAceptar:'Pierdes un minuto, ganas tu alma',
          txtRechazar:'Echarlo a la fuerza, como manda el manual', subRechazar:'Rápido y reglamentario',
          alertaAceptar:-5, alertaRechazar:10,
          msgAceptar:'Lo zarandeas con suavidad y lo guías hasta un rincón seco. "Gracias, jefe", balbucea, sin saber a quién. Marcas la baliza. Nadie se ha enterado de tu pequeña desobediencia humana.',
          msgRechazar:'Lo levantas de un tirón y lo empujas fuera del corredor. Cae, maldice, se arrastra. Marcas la baliza con eficiencia. El manual estaría orgulloso. Tú, menos.',
          irAceptar:'ruido', irRechazar:'ruido' },
        ruido:{ tipo:'bifurcacion',
          texto:'Camino a la segunda baliza, oyes un ruido en un callejón lateral: metal, voces bajas. Tu ronda no pasa por ahí. Pero el ruido existe.',
          ramas:[
            { txt:'INVESTIGAR EL RUIDO', sub:'No es tu ruta, pero podría ser algo', ir:'ladrones', alerta:10, pista:'combate' },
            { txt:'SEGUIR LA RUTA MARCADA', sub:'Lo que no ves, no consta', ir:'baliza2', pista:'tranquilo' }
          ] },
        ladrones:{ tipo:'confrontacion',
          texto:'En el callejón, dos tipos fuerzan la persiana de un almacén. Te ven el uniforme y, en vez de huir, deciden que es más fácil quitarte las ganas a golpes. "Mira, el héroe de la ronda."',
          enemigos:[
            { nombre:'Ladrón con barra', desc:'No esperaba compañía', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Ladrón nervioso', desc:'Quiere acabar y huir', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'baliza2' },
        baliza2:{ tipo:'narrativo',
          texto:'Llegas a la segunda baliza y pasas la credencial. Luz verde. El zumbido del lector es lo más parecido a la compañía que tendrás esta noche. Queda una.',
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La tercera baliza está al fondo de un corredor que la humedad ha vuelto resbaladizo. El parte espera en tu tablilla, con su campo de "incidencias" parpadeando, esperando que decidas qué fue real esta noche y qué no.',
          fin:true }
      }}
    },

    {
      id:'seg_extravio',
      titulo:'UN MENOR EXTRAVIADO',
      cliente:'HELIX · Servicios al Ciudadano',
      faccion:'helix',
      peligro:1, pagaBase:165, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Una niña de seis años se ha perdido entre los niveles del Sector 7 y los padres han pagado el servicio de localización de HELIX. Encontrarla y devolverla antes de que el frío, o algo peor, la encuentre primero. Reloj en contra y un nivel entero por delante.',
      cierreOk:'Encuentras a la cría dormida sobre unos cartones, abrazada a un peluche sin un ojo, más tranquila de lo que tú has estado en toda la noche. Cuando la devuelves, la madre se derrumba de alivio y el padre te estrecha la mano sin soltarla. HELIX cobra su tarifa; tú te quedas con la cara de la niña al despertar y reconocer a su madre.',
      cierreFallo:'La búsqueda se alarga, se tuerce, se enfría. Cuando cierras el servicio sin resultado, sabes que en algún rincón de este nivel hay una niña y unos padres que esta noche no se reencontrarán. HELIX lo registra como "localización no concluida". Dos palabras para un agujero.',
      mapa:{ inicio:'inicio', nodos:{
        inicio:{ tipo:'narrativo',
          texto:'Los padres te enseñan una foto borrosa en un terminal: pelo oscuro, un peluche de un solo ojo, una sonrisa con un diente menos. "Salió a jugar al corredor y no volvió." El nivel es enorme y la noche, larga. Empiezas por donde la vieron por última vez.',
          ir:'testigo' },
        testigo:{ tipo:'encuentro',
          texto:'Una vendedora ambulante recuerda haber visto a la cría. "Iba hacia los niveles bajos, siguiendo un gato. Pero por ahí abajo hay gente rara, agente. Te puedo decir por dónde, si me compensas el rato." El reloj corre.',
          txtAceptar:'Pagarle por la información', subAceptar:'20 CR · te ahorra dar vueltas',
          txtRechazar:'Buscar tú mismo, sin pagar', subRechazar:'Gratis, pero a ciegas',
          creditos:-20, alertaAceptar:-10,
          msgAceptar:'Le pagas y te describe la ruta exacta de la cría, gato incluido. Ganas un tiempo precioso. En una búsqueda contrarreloj, una buena pista vale más que cualquier placa.',
          msgRechazar:'"Como quieras, agente." Sigues por instinto, perdiendo minutos en cada cruce equivocado. El nivel es un laberinto y la niña, pequeña.',
          irAceptar:'ruta', irRechazar:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Los niveles bajos se ramifican. Dos zonas donde una cría podría haberse refugiado, y son muy distintas.',
          ramas:[
            { txt:'LOS CONDUCTOS DE VENTILACIÓN', sub:'Un crío cabe donde un adulto no', ir:'conductos', pista:'tranquilo' },
            { txt:'EL MERCADO CERRADO', sub:'Caliente y con gente, pero turbia', ir:'mercado', alerta:10, pista:'gente' }
          ] },
        conductos:{ tipo:'hallazgo',
          texto:'Te metes a gatas por los conductos de ventilación, llamándola por su nombre. El eco te devuelve tu propia voz. En un recodo, encuentras su peluche de un solo ojo, tirado. Cerca, algo más: una mochila escolar abandonada hace tiempo, de otro niño.',
          txtAbrir:'Registrar la mochila', subAbrir:'Podría tener pistas, o algo útil',
          txtDejar:'Coger solo el peluche y seguir', subDejar:'La niña es lo único que importa',
          riesgo:0.15, trampaHerida:1,
          recompensaCreditos:40,
          msgAbrir:'En la mochila, créditos viejos y un mapa infantil del nivel garabateado. El mapa te ayuda a orientarte. El peluche te dice que ella pasó por aquí. Vas bien.',
          msgTrampa:'Al abrir la mochila, te golpeas la cabeza contra el techo del conducto en la postura imposible en la que estás. Ves estrellas un momento, pero recuperas el peluche.',
          msgDejar:'Coges el peluche y dejas lo demás. Es su rastro, y es lo único que necesitas seguir.',
          ir:'final' },
        mercado:{ tipo:'confrontacion',
          texto:'En el mercado cerrado, un grupo de gente turbia ha rodeado a la cría, no se sabe aún con qué intención. Cuando te ven llegar con el uniforme, uno se interpone, demasiado rápido, demasiado nervioso. "Aquí no hay ninguna niña, agente." La hay. La ves detrás de él.',
          enemigos:[
            { nombre:'Tipo nervioso', desc:'Esconde algo, o a alguien', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Compinche', desc:'No quiere problemas con HELIX', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La encuentras hecha un ovillo, medio dormida, con el rastro de lágrimas secas en la cara sucia. Al verte —al ver el peluche que le tiendes— sus ojos se abren enormes. "¿Me llevas con mamá?" Asientes. Es la parte fácil. La difícil ya pasó.',
          fin:true }
      }}
    },

    {
      id:'seg_testigo_protegido',
      titulo:'EL TESTIGO QUE TIEMBLA',
      cliente:'HELIX · Asuntos Internos',
      faccion:'helix',
      peligro:3, pagaBase:390, progreso:115, rangoMin:1,
      integridad:16, alertaInicial:5,
      resumen:'Un empleado de HELIX va a declarar contra su propio supervisor por desvío de fondos, y alguien quiere que no llegue a la sala. Escoltarlo desde su cubículo hasta Asuntos Internos, vivo y dispuesto a hablar. El edificio entero parece tener oídos en las paredes.',
      cierreOk:'Lo dejas en la puerta de Asuntos Internos, pálido pero entero, con su declaración apretada en una carpeta. "No sé si soy valiente o idiota", te dice antes de entrar. "Las dos cosas", respondes, y por primera vez en toda la noche, sonríe. HELIX cobra; un supervisor corrupto cae; el testigo desaparece en el programa. Tú vuelves a casa preguntándote a quién protegiste de verdad.',
      cierreFallo:'El testigo no llega a declarar. Lo que sabía se queda sin decir, el supervisor sigue en su puesto, y en Asuntos Internos tachan tu nombre de la lista de gente fiable. En HELIX, caer de esa lista es caer muy hondo.',
      mapa:{ inicio:'recoger', nodos:{
        recoger:{ tipo:'narrativo',
          texto:'Lo recoges en su cubículo, a oscuras, donde lleva una hora sin encender la luz para que no sepan que sigue allí. Tiembla, pero la carpeta la sujeta firme. "Saben que voy a hablar. Sácame de aquí." Las plantas de oficinas vacías de HELIX de noche tienen algo de tumba.',
          ir:'ascensor' },
        ascensor:{ tipo:'bifurcacion',
          texto:'Bajar las treinta plantas hasta Asuntos Internos. El ascensor principal está vigilado; las escaleras de servicio, no. Dos descensos posibles.',
          ramas:[
            { txt:'EL ASCENSOR PRINCIPAL', sub:'Rápido, pero con cámaras y compañía', ir:'matones', alerta:15, pista:'combate' },
            { txt:'LAS ESCALERAS DE SERVICIO', sub:'Lentas y agotadoras, pero a ciegas', ir:'escaleras', pista:'tranquilo' }
          ] },
        matones:{ tipo:'confrontacion',
          texto:'El ascensor se detiene en una planta intermedia que tú no has pulsado. Las puertas se abren y entran dos hombres de seguridad privada con la sonrisa equivocada. "Nos llevamos al señor a otra reunión." El testigo se encoge contra el rincón del ascensor.',
          enemigos:[
            { nombre:'Seguridad privada', desc:'Trajeado y entrenado', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Seguridad privada', desc:'Bloquea las puertas', integridad:2, fuerza:4, umbral:4 }
          ],
          ir:'pasillo' },
        escaleras:{ tipo:'hallazgo',
          texto:'Bajáis las escaleras de servicio, planta tras planta, el testigo resoplando detrás de ti. En un rellano, una taquilla de mantenimiento entreabierta deja ver material de seguridad olvidado.',
          txtAbrir:'Revisar la taquilla', subAbrir:'Equipo útil para lo que viene',
          txtDejar:'No perder tiempo', subDejar:'Cada planta cuenta',
          riesgo:0.1,
          recompensaItem:'chaqueta_kevlar',
          msgAbrir:'Dentro, una chaqueta de kevlar de la vieja dotación de seguridad. Te la pones sobre el uniforme. Si esto se tuerce más abajo, agradecerás cada capa.',
          msgDejar:'Cierras la taquilla. El testigo te mira sin entender por qué dudas siquiera; para él, cada segundo parado es un segundo más cerca de los que lo buscan.',
          ir:'pasillo' },
        pasillo:{ tipo:'confrontacion',
          texto:'En la planta de Asuntos Internos, el supervisor en persona os espera en el pasillo con un último hombre. No grita: razona, que es peor. "Piénsalo. Lo que cobras por escoltarlo es calderilla. Yo pago de verdad. Solo tienes que mirar a otro lado treinta segundos."',
          enemigos:[
            { nombre:'El supervisor', desc:'Compra antes de pegar', tipo:'lider', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Último guardaespaldas', desc:'Fiel al mejor postor', integridad:3, fuerza:4, umbral:4 }
          ],
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'La puerta de Asuntos Internos es de cristal esmerilado, con luz al otro lado. El testigo se planta delante de ella y respira hondo, como quien va a tirarse al agua fría. Te mira una última vez. Tu trabajo termina cuando esa puerta se abra.',
          fin:true }
      }}
    },

    {
      id:'seg_evacuacion',
      titulo:'DESALOJO POR FUGA',
      cliente:'HELIX · Gestión de Crisis',
      faccion:'helix',
      peligro:3, pagaBase:410, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:15,
      resumen:'Una fuga química en un nivel residencial: un reactor de barrio reventado escupe gases por los conductos. HELIX manda evacuar el sector antes de que el aire mate, pero la gente no quiere dejar sus casas y el reloj corre. Sacar a todos los que puedas, a tiempo.',
      cierreOk:'Cuando el último rezagado cruza el cordón, los selladores automáticos cierran el nivel con un golpe sordo. Detrás del cristal, las casas que esa gente no quería dejar se llenan de niebla tóxica. Pero la gente está fuera, tosiendo, viva, contando cabezas. HELIX lo registra como "evacuación nominal". Tú lo registras como una noche en que, por una vez, salvaste más de lo que rompiste.',
      cierreFallo:'La evacuación se desborda, el reloj gana, y los selladores se cierran con gente aún dentro, o contigo demasiado cerca del aire malo. HELIX archiva las pérdidas con un número frío. Tú archivas algo que no se va con una ducha.',
      mapa:{ inicio:'inicio', nodos:{
        inicio:{ tipo:'narrativo',
          texto:'El nivel huele a almendras amargas y a plástico quemado: el olor del gas que mata sin avisar. Las alarmas aúllan. Tienes que vaciar tres bloques antes de que los selladores cierren el sector. La gente, en las puertas, te mira sin moverse: para ellos, esto es su casa, no una zona de crisis.',
          ir:'anciano' },
        anciano:{ tipo:'encuentro',
          texto:'Un anciano se niega a salir de su piso. "Llevo aquí cuarenta años. No me voy por un poco de humo." Tose mientras lo dice. El gas no entiende de testarudez, y el reloj no para por nadie.',
          txtAceptar:'Convencerlo con paciencia', subAceptar:'Cuesta minutos preciosos, pero sale por su pie',
          txtRechazar:'Sacarlo a la fuerza', subRechazar:'Rápido, pero indigno',
          alertaAceptar:-10, alertaRechazar:10,
          msgAceptar:'Te sientas un segundo a su altura y le hablas de su mujer, de la foto en la pared, de quién lo va a llorar si se queda. Algo cede. Se levanta, coge la foto, y sale contigo apoyado en tu brazo. Tardas, pero lo sacas entero, por dentro y por fuera.',
          msgRechazar:'Lo cargas al hombro pese a sus protestas y sus golpes débiles. Lo pones a salvo, sí, pero llorando de rabia y vergüenza. A veces salvar un cuerpo cuesta romper algo que no se ve.',
          irAceptar:'ruta', irRechazar:'ruta' },
        ruta:{ tipo:'bifurcacion',
          texto:'Quedan dos bloques y poco tiempo. No puedes con los dos a la vez. ¿Por dónde empiezas?',
          ramas:[
            { txt:'EL BLOQUE MÁS CERCANO AL ESCAPE', sub:'Más gente, pero más segura de sacar', ir:'estampida', pista:'gente' },
            { txt:'EL BLOQUE PEGADO AL REACTOR', sub:'Pocos, pero los que peor respiran', ir:'reactor', alerta:10, pista:'tranquilo' }
          ] },
        estampida:{ tipo:'confrontacion',
          texto:'En el bloque cercano, el pánico ha cundido y la gente se agolpa en una salida estrecha, pisándose. Una estampida en ciernes. Si no impones orden, se matarán entre ellos antes de que el gas llegue. Dos hombres fuera de sí empujan a los demás para pasar.',
          enemigos:[
            { nombre:'Hombre presa del pánico', desc:'Pisa a quien sea', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Otro aterrado', desc:'Empuja a ciegas', integridad:2, fuerza:3, umbral:2 }
          ],
          ir:'final' },
        reactor:{ tipo:'hallazgo',
          texto:'El bloque pegado al reactor está ya lleno de neblina. Avanzas conteniendo la respiración, sacando a tos limpia a los que quedan. En un piso vacío, sobre una mesa, ves una máscara de filtro industrial, de las buenas, olvidada por algún técnico que huyó.',
          txtAbrir:'Coger la máscara de filtro', subAbrir:'Aquí dentro vale más que el oro',
          txtDejar:'Seguir sin perder un segundo', subDejar:'Hay gente que sacar ya',
          riesgo:0,
          recompensaItem:'mascara_filtro',
          msgAbrir:'Te calas la máscara de filtro y el mundo deja de oler a almendras amargas. Ahora puedes respirar donde otros se ahogan. La usarás para sacar a los que sin ella no podrías.',
          msgDejar:'La dejas: cada segundo es un pulmón. Sales con los tuyos medio asfixiado, pero sales.',
          ir:'final' },
        final:{ tipo:'narrativo',
          texto:'El cordón de evacuación está a la vista, con sus luces giratorias y sus mantas térmicas. Detrás de ti, los selladores empiezan a zumbar, avisando de que el nivel se va a cerrar. Empujas al último grupo hacia la luz. Ya casi está.',
          fin:true }
      }}
    }
  ]
};

window.CORRIDAS_DATOS = CORRIDAS_DATOS;

// ============================================================
//  EVENTOS ALEATORIOS — se intercalan entre paradas del esqueleto.
//  El motor (67) elige uno no usado con cierta probabilidad. Tipos:
//   narrativo (efecto inmediato), hallazgo, encuentro, confrontacion.
//  No llevan 'ir': el motor los devuelve al destino que tenía pendiente.
// ============================================================
const EVENTOS_CORRIDA = {

  contrabando: [
    { id:'ev_c_patrulla', tipo:'narrativo',
      texto:'Una patrulla de HELIX pasa cerca, barriendo la calle con focos. Te pegas a un portal y contienes la respiración hasta que el zumbido de sus botas se aleja. No te han visto. Pero el corazón tarda en volver a su sitio.',
      alerta:8 },
    { id:'ev_c_alijo', tipo:'hallazgo',
      texto:'Entre unos contenedores ves un paquete olvidado, o escondido. Cinta de embalar, sin marcas. Podría ser un golpe de suerte. Podría ser de alguien que vuelve a por él.',
      txtAbrir:'Abrir el paquete', subAbrir:'Puede haber algo útil',
      txtDejar:'Dejarlo donde está', subDejar:'No es tuyo',
      riesgo:0.3, trampaHerida:2, trampaAlerta:5,
      recompensaCreditos:60,
      msgAbrir:'Dentro hay un fajo pequeño de créditos y un cargador. Te lo guardas sin pensarlo dos veces.',
      msgTrampa:'Apenas tocas el paquete, una mano cae sobre tu hombro. Su dueño no viene solo, y la conversación es a empujones. Sales, pero magullado.',
      recompensaItem:'cargador',
      msgDejar:'Lo dejas. En estas calles, lo que brilla suele tener anzuelo.' },
    { id:'ev_c_mendigo', tipo:'encuentro',
      texto:'Un viejo sin hogar te llama desde un soportal. "Sé por dónde no hay ojos esta noche. Te lo cuento por lo que te sobre." Tiene la mirada lúcida de quien lo ve todo desde abajo.',
      txtAceptar:'Darle algo por la información', subAceptar:'20 CR · baja la presión',
      txtRechazar:'Seguir sin escucharle', subRechazar:'No te fías',
      creditos:-20, alertaAceptar:-12,
      msgAceptar:'Le dejas unos créditos. "Por la calleja de las tuberías, hoy no miran." Tenía razón: avanzas un tramo sin un alma.',
      msgRechazar:'Sigues de largo. El viejo murmura algo que no llegas a oír, y quizá era importante.' },
    { id:'ev_c_rival', tipo:'confrontacion',
      texto:'Un correo de una banda rival te ha estado siguiendo y te corta el paso. No quiere tu mercancía: quiere que no llegues, para que el encargo caiga en los suyos.',
      enemigos:[ { nombre:'Correo rival', desc:'Rápido y con prisa', tipo:'rapido', integridad:2, fuerza:3, umbral:2 } ] },
    { id:'ev_c_gotera', tipo:'narrativo',
      texto:'Un tramo del túnel está inundado por una tubería rota. Vadeas el agua helada hasta la cintura, con la mercancía sobre la cabeza. Sales calado y temblando, pero al otro lado.',
      herida:1 },
    { id:'ev_c_suerte', tipo:'narrativo',
      texto:'Te cruzas con un conocido de los muelles que te debía un favor. Sin que se lo pidas, te señala un atajo y te mete un par de billetes en el bolsillo. "Estamos en paz." A veces la calle también da.',
      botin:40, alerta:-5 },
    { id:'ev_c_caja_medica', tipo:'hallazgo',
      texto:'Un furgón sanitario de HELIX ha tenido un accidente y nadie ha venido aún a recoger lo que se desparramó. Entre el cristal roto, una caja con el logo de la hélice, intacta.',
      txtAbrir:'Saquear la caja médica', subAbrir:'Material de HELIX, del bueno',
      txtDejar:'No tentar a la suerte', subDejar:'Un furgón así no se queda solo mucho rato',
      riesgo:0.3, trampaHerida:2, trampaAlerta:10,
      recompensaItem:'inhibidor_dolor',
      msgAbrir:'Dentro, ampollas de inhibidor de dolor de uso hospitalario. Vale una fortuna en la calle. Te guardas una y desapareces.',
      msgTrampa:'Al abrir la caja, una alarma de inventario de HELIX chilla. Echas a correr antes de ver quién acude, pero algo te alcanza por el camino.',
      msgDejar:'Lo dejas. El material de HELIX siempre viene con rastreador, y tú no necesitas otra correa.' },
    { id:'ev_c_trapero', tipo:'hallazgo',
      texto:'Un trapero muerto de frío, hace ya días, sigue sentado contra una pared con su abrigo pesado puesto. Nadie se lo ha llevado. En las Pilas, hasta a los muertos les cuesta encontrar quien los desnude.',
      txtAbrir:'Quedarte el abrigo', subAbrir:'Él ya no lo necesita',
      txtDejar:'Dejarlo descansar', subDejar:'Hay cosas que no se hacen',
      riesgo:0,
      recompensaItem:'abrigo_trapero',
      msgAbrir:'Te pones el abrigo de trapero, pesado de lona y forros robados. Aún conserva el calor de la calle. Abriga, y esconde. Murmuras una disculpa que nadie oye.',
      msgDejar:'Lo dejas con su dueño. No todo en las Pilas está en venta, ni siquiera cuando nadie mira.' }
  ],

  seguridad: [
    { id:'ev_s_civil', tipo:'encuentro',
      texto:'Una mujer te frena, reconoce el uniforme. "Agente, mi hijo lleva dos días sin volver. Nadie en HELIX me escucha." Te tiende una foto arrugada. No es tu operación. Pero es alguien.',
      txtAceptar:'Anotar el nombre y prometer mirarlo', subAceptar:'Cuesta un momento · te tranquiliza la conciencia',
      txtRechazar:'"No es mi departamento"', subRechazar:'Sigues con lo tuyo',
      alertaAceptar:-10,
      msgAceptar:'Apuntas el nombre del chico en tu tablilla. Quizá no hagas nada. Quizá sí. Ella respira un poco mejor, y tú también, aunque no lo admitas.',
      msgRechazar:'"No es mi departamento, señora." Te alejas antes de ver cómo se le apaga la cara. El uniforme pesa un poco más.' },
    { id:'ev_s_soborno', tipo:'hallazgo',
      texto:'Un tendero al que reconoces de otra redada te hace señas. Sobre el mostrador, discretamente, deja un sobre. "Para que la próxima vez mires hacia otro lado." Nadie os ve.',
      txtAbrir:'Coger el sobre', subAbrir:'Créditos fáciles · pero te compras un dueño',
      txtDejar:'No tocarlo', subDejar:'Limpio, por una vez',
      riesgo:0.2, trampaAlerta:15,
      recompensaCreditos:70,
      msgAbrir:'Te guardas el sobre con un gesto practicado. Está bien pesado. Ahora le debes un silencio a alguien, y esas deudas no caducan.',
      msgTrampa:'Cuando tu mano toca el sobre, notas el brillo de una lente al fondo del puesto. Te están grabando. Sea quien sea, ahora tiene algo tuyo.',
      msgDejar:'Empujas el sobre de vuelta. "Guárdatelo." El tendero asiente, sorprendido. Tú también lo estás, un poco.' },
    { id:'ev_s_disturbio', tipo:'narrativo',
      texto:'Doblas una esquina y caes en mitad de una trifulca: vecinos contra un cobrador de HELIX. Vuelan insultos y algún objeto. Te abres paso a empujones, ni con ellos ni contra ellos. Una piedra perdida te alcanza el hombro.',
      herida:1, alerta:10 },
    { id:'ev_s_radio', tipo:'narrativo',
      texto:'Tu radio crepita: otra unidad pide refuerzos a dos calles. Podrías desviarte y ayudar, pero perderías el rastro. Sigues a lo tuyo, y el ruido de la radio te acompaña como una mala conciencia portátil.',
      alerta:5 },
    { id:'ev_s_emboscada', tipo:'confrontacion',
      texto:'Te esperaban. Alguien avisó de que un uniforme andaba por aquí, y dos del barrio salen de un portal con ganas de cobrarse algo viejo contra HELIX. No es contra ti. Es contra lo que llevas puesto.',
      enemigos:[
        { nombre:'Vecino resentido', desc:'Más rabia que técnica', integridad:2, fuerza:3, umbral:2 },
        { nombre:'Compinche', desc:'Cubre por detrás', integridad:2, fuerza:3, umbral:2 }
      ] },
    { id:'ev_s_informe', tipo:'narrativo',
      texto:'Encuentras, tirada, una tablilla de otro agente con un informe a medias. La recoges: información del barrio que te ahorra rodeos. Pequeñas ventajas de llevar la placa correcta.',
      alerta:-8, botin:30 },
    { id:'ev_s_pertrechos', tipo:'hallazgo',
      texto:'Una taquilla de pertrechos de HELIX abierta y a medio vaciar, en un puesto de control abandonado. Tu credencial te da derecho... o eso te dices mientras rebuscas.',
      txtAbrir:'Coger lo que sirva', subAbrir:'Material reglamentario, para ti',
      txtDejar:'Dejar la taquilla', subDejar:'Hay cámaras hasta en los sitios vacíos',
      riesgo:0.2, trampaAlerta:12,
      recompensaItem:'placa_helix',
      msgAbrir:'Dentro, un inserto balístico de cerámica HELIX, de segunda mano pero entero. Te lo metes bajo la chaqueta. Esto para un disparo que de otro modo te tumbaría.',
      msgTrampa:'Al abrir la taquilla, un registro de acceso parpadea: tu credencial ha quedado anotada hurgando donde no debías. Mala señal.',
      msgDejar:'Cierras la taquilla. El material de HELIX siempre lleva número de serie, y los números de serie hablan.' },
    { id:'ev_s_estimulantes', tipo:'hallazgo',
      texto:'En el botiquín de una garita encuentras un blíster de autoinyectores de combate, de los que HELIX da a sus operativos antes de una redada dura. Caducan pronto. Nadie los echará en falta.',
      txtAbrir:'Guardarte un estimulante', subAbrir:'Para cuando aprieten',
      txtDejar:'No tocar el botiquín', subDejar:'Cada cosa en su sitio',
      riesgo:0.1,
      recompensaItem:'estimulante',
      msgAbrir:'Te guardas un autoinyector de estimulante de combate. Para el día en que pegar más fuerte sea la diferencia entre volver o no.',
      msgDejar:'Lo dejas donde está. No te fías de lo que HELIX mete en esas ampollas, y haces bien.' }
  ]
};

window.EVENTOS_CORRIDA = EVENTOS_CORRIDA;
