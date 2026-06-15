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
      peligro:1, pagaBase:140, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Un paquete de supresores que el Hospital HELIX raciona como oro. Llevarlo de un trastero del mercado a una madre que no puede pagar la versión legal. No deberían ser tres pasillos difíciles. Nunca lo son, hasta que lo son.',
      cierreOk:'La mujer abre la puerta antes de que llames, como si llevara horas pegada a la mirilla. No dice gracias. Te mete el sobre con los créditos en la mano y cierra. A veces eso es todo lo que hay.',
      cierreFallo:'El paquete se queda en el suelo de un pasillo cualquiera, bajo una bota que no es la tuya. La madre seguirá esperando. Tú tienes problemas más inmediatos.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges el paquete en el trastero. Pesa menos de lo que debería pesar algo por lo que la gente mata. Lo escondes bajo la chaqueta y sales al pasillo del mercado, donde el vapor de las freidoras lo emborrona todo.' },
        { tipo:'confrontacion', texto:'Un crío del Loto, doce años a lo sumo, te corta el paso. No va armado, pero detrás de él hay uno que sí. "Peaje", dice, con una voz que aún no le ha cambiado.',
          enemigos:[
            { nombre:'El crío', desc:'Asustado, hablando de más', integridad:1, fuerza:1, umbral:2 },
            { nombre:'Matón con barra', desc:'El que importa', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'bifurcacion', texto:'Dos formas de bajar al bloque de la mujer: el hueco del ascensor averiado o la escalera principal, más concurrida.',
          txtRapida:'El hueco del ascensor', subRapida:'Atajo sucio y silencioso',
          msgRapida:'Bajas por el hueco agarrándote a los cables. Llegas antes y sin que nadie te vea. Las manos te huelen a grasa una semana.', alertaRapida:0, creditosRapida:0,
          txtLimpia:'La escalera principal', subLimpia:'Más gente, más tranquilo',
          msgLimpia:'Bajas por la escalera, mezclándote con vecinos que cargan bolsas. Nadie repara en ti. Tardas, pero llegas entero.' },
        { tipo:'obstaculo', texto:'Una reja a media altura cierra el último rellano. Candado barato.',
          coste:30,
          txtPagar:'Pagar al chatarrero con la copia de la llave', subPagar:'Rápido y sin marcas',
          msgPagar:'El chatarrero hace girar una llave que no debería tener y mira a otro lado mientras pasas.',
          txtForzar:'Romper el candado', subForzar:'Ruidoso',
          msgForzar:'El candado cede al tercer golpe con un chasquido que sube por toda la escalera.', ruidoForzar:18 },
        { tipo:'narrativo', texto:'La puerta correcta es la única del rellano con una flor de plástico clavada en el marco, descolorida por años de lluvia que nunca la toca. Llamas.' }
      ]
    },

    {
      id:'cont_chip',
      titulo:'UN CHIP QUE QUEMA',
      cliente:'El Ferro · contacto de Don Vasek',
      faccion:'sindicatos',
      peligro:2, pagaBase:240, progreso:95, rangoMin:0,
      integridad:14, alertaInicial:10,
      resumen:'El Ferro necesita mover un chip de datos antes del amanecer. No preguntas qué tiene dentro. Solo que HELIX lo busca, y que si te lo encuentran encima no habrá juicio, solo una desaparición administrativa.',
      cierreOk:'El contacto del Ferro coge el chip sin mirarlo, como quien recoge un encargo de pan. "Don Vasek recuerda a los que cumplen", dice. En esta ciudad, que alguien te recuerde puede salvarte la vida. O acabártela.',
      cierreFallo:'El chip ya no está en tus manos, y tus manos es lo de menos de lo que podrías perder esta noche.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges el chip en la trastienda de una casa de empeños. Del tamaño de una uña, y caliente, como si algo dentro siguiera funcionando. Lo metes en el forro del cuello.' },
        { tipo:'bifurcacion', texto:'Dos maneras de cruzar al sector norte: la pasarela elevada, vigilada pero rápida, o las galerías de servicio, largas y a oscuras.',
          txtRapida:'La pasarela elevada', subRapida:'Rápida, pero hay cámaras de HELIX',
          msgRapida:'Cruzas la pasarela a paso vivo, la cabeza gacha. Las cámaras te barren. Quizá no era nada. Quizá ya hay un informe con tu cara.', alertaRapida:20,
          txtLimpia:'Las galerías de servicio', subLimpia:'Largo y oscuro, pero ciego',
          msgLimpia:'Bajas a las galerías. Huele a agua estancada y a cobre. Tardas el doble, pero aquí abajo no hay ojos, solo goteras.' },
        { tipo:'confrontacion', texto:'A la salida, dos del Loto te esperaban. Alguien ha hablado. "El Ferro paga poco por ese chip", dice el de delante, abriendo una navaja. "Nosotros pagamos en seguir vivos."',
          enemigos:[
            { nombre:'Loto de la navaja', desc:'Habla, gana tiempo', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Loto callado', desc:'Se mueve para flanquearte', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'encuentro', texto:'Una mujer mayor te ve salir del callejón con la respiración agitada. Sin decir nada, señala una puerta lateral: un atajo. Pero te mira las manos, esperando algo a cambio.',
          txtAceptar:'Darle unos créditos por el atajo', subAceptar:'Cuesta 20 CR, ahorra un control',
          msgAceptar:'Le dejas unos créditos en la palma arrugada. Ella asiente hacia la puerta. Al otro lado, media ciudad menos de camino.', creditos:-20,
          txtRechazar:'Seguir sin el atajo', subRechazar:'Gratis, pero el camino largo',
          msgRechazar:'Niegas con la cabeza. Ella aparta la mano sin rencor, como quien ya esperaba esa respuesta.' },
        { tipo:'confrontacion', texto:'Casi en el punto de entrega, una patrulla de HELIX peina la calle con linternas que cortan la lluvia. Uno te ve dudar. "Identificación. Y enséñame las manos."',
          fuerza:5, umbral:4, ruidoExtra:15,
          refuerzoSiRuido:60, refuerzoGrupo:[{nombre:'Refuerzo HELIX', desc:'Llamado por radio', integridad:2, fuerza:4, umbral:4}] },
        { tipo:'narrativo', texto:'El portal del Ferro es una puerta sin número en una calle sin nombre. Está abierta una rendija. Te esperaban.' }
      ]
    },

    // ── RANGO 1 ──────────────────────────────────────────────
    {
      id:'cont_persona',
      titulo:'CARGA QUE RESPIRA',
      cliente:'Una red de los Fantasmas de Marte',
      faccion:'loto',
      peligro:3, pagaBase:380, progreso:115, rangoMin:1,
      integridad:16, alertaInicial:5,
      resumen:'Esta vez la mercancía respira: una refugiada marciana sin papeles que HELIX quiere repatriar a una colonia que ya no existe. Sacarla de Las Pilas hasta un enlace que la subirá a Selene. Si la carga habla, la carga complica.',
      cierreOk:'En el punto de enlace, la mujer se gira antes de subir. "En Marte construíamos cosas", dice, sin que venga a cuento. "Aquí solo aprendéis a esconderos." Luego desaparece hacia una nave que no verás. Te miró a los ojos, y eso ya es mucho.',
      cierreFallo:'Los de HELIX se la llevan sin esposas, casi con suavidad, como quien recoge un paquete extraviado. Ella no grita. Ya lo había vivido. Tú aprendes qué se siente al fallar a alguien que respira.',
      nodos:[
        { tipo:'narrativo', texto:'La recoges en un sótano que huele a humedad y a miedo viejo. Mayor de lo que esperabas, con las manos llenas de cicatrices de fundición. No te pregunta tu nombre y tú no le preguntas el suyo.' },
        { tipo:'encuentro', texto:'Un pasador conocido aparece en una esquina. "Os cuelo por el conducto de carga, ahorráis media ciudad. Pero me debéis una, y yo cobro cuando menos os conviene."',
          txtAceptar:'Aceptar el atajo', subAceptar:'Ahorra camino, contraes una deuda',
          msgAceptar:'Os cuela por el conducto. La mujer aguanta la respiración entre el polvo. Sales antes. Pero ahora le debes algo a alguien, y eso pesa.', alertaAceptar:0,
          txtRechazar:'Seguir por tu cuenta', subRechazar:'Más camino, sin ataduras',
          msgRechazar:'Rechazas. "Como quieras. Pero recuerda que te lo ofrecí, el día que te arrepientas."' },
        { tipo:'confrontacion', texto:'En un cruce, una banda reconoce a la mujer: hay recompensa de HELIX por marcianos sin papeles. Tres siluetas salen de la lluvia. Ella se pone a tu espalda sin que se lo pidas.',
          enemigos:[
            { nombre:'Cazarrecompensas', desc:'El que dirige', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Secuaz con tubo', desc:'Fuerza bruta', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vigía nervioso', desc:'Vigila la calle', integridad:1, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[{nombre:'Más cazarrecompensas', desc:'El ruido los atrae', integridad:2, fuerza:3, umbral:2}] },
        { tipo:'bifurcacion', texto:'La mujer está agotada. Puedes forzar el paso por la avenida o buscarle un respiro por los tejados, más lento.',
          txtRapida:'Cruzar la avenida ya', subRapida:'Rápido, expuesto',
          msgRapida:'Cruzáis la avenida a la vista de todos. Ella tropieza, la sostienes. Llegáis, pero alguien os ha visto.', alertaRapida:15,
          txtLimpia:'Subir a los tejados', subLimpia:'Lento, le das un respiro',
          msgLimpia:'Subís a los tejados. Ella recupera el aliento entre antenas oxidadas. El cielo de Las Pilas no tiene estrellas, pero al menos aquí arriba se respira.' },
        { tipo:'obstaculo', texto:'Un control de HELIX bloquea la salida al muelle. Escáneres de retina. La mujer no pasaría ni un segundo.',
          coste:80,
          txtPagar:'Sobornar al guardia de turno', subPagar:'Caro, pero mira a otro lado',
          msgPagar:'El guardia cuenta los créditos dos veces, luego apaga el escáner "por mantenimiento" justo el tiempo que necesitáis.',
          txtForzar:'Crear una distracción y cruzar', subForzar:'Mucho ruido, mucho riesgo',
          msgForzar:'Provocas un cortocircuito en un panel y cruzáis mientras miran las chispas. Funciona. Pero vuestras caras están ya en cada pantalla del muelle.', ruidoForzar:30, heridaForzar:2 },
        { tipo:'narrativo', texto:'El enlace os espera junto a un montacargas oxidado, la cara medio tapada. Asiente una sola vez. Habéis llegado.' }
      ]
    },

    {
      id:'cont_armas',
      titulo:'HIERRO PARA EL ARRABAL',
      cliente:'Mano Roja · célula del Loto',
      faccion:'loto',
      peligro:3, pagaBase:420, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:15,
      resumen:'Un cargamento de armas de raíl desde un taller clandestino hasta un escondite del Loto, cruzando una zona donde el Ferro cobra por respirar. Dos mafias que se odian, y tú en medio cargando con lo que ambas quieren.',
      cierreOk:'Mano Roja en persona inspecciona el cargamento, pasando los dedos por los cañones fríos. "Bien", dice, y es casi un elogio. El Loto no olvida un favor. Tampoco una traición. Procura quedar siempre del primer lado.',
      cierreFallo:'El hierro acaba en manos que no eran las acordadas, y en el Arrabal corre la voz de que no se puede confiar en ti. En las Pilas, la reputación es lo único que de verdad se posee. Y la acabas de perder.',
      nodos:[
        { tipo:'narrativo', texto:'El taller huele a ozono y metal recalentado. Cargas las armas en un carro de reparto trucado, bajo cajas de fruta sintética. Pesa lo suyo. Cada bache del camino será una plegaria.' },
        { tipo:'confrontacion', texto:'Dos del Ferro montan un peaje improvisado en la única salida. "Todo lo que cruza paga al Ferro", dice uno, dándose golpecitos con una palanca en la palma. Reconocen las cajas. Saben que mientes.',
          enemigos:[
            { nombre:'Ferro de la palanca', desc:'Grande, lento', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Ferro con pistola', desc:'Apunta al carro', integridad:2, fuerza:5, umbral:6 }
          ] },
        { tipo:'encuentro', texto:'Un chaval del Loto aparece pedaleando. "Mano Roja dice que cambies de ruta, hay redada en la principal. Sígueme." Podría ser verdad. Podría ser una encerrona del Ferro con un crío comprado.',
          txtAceptar:'Seguir al chaval', subAceptar:'Si dice la verdad, evitas la redada',
          msgAceptar:'Sigues al chaval por callejones que solo conoce quien creció en ellos. Tenía razón: oyes la redada a tu espalda, lejos. Buen crío.', alertaAceptar:-10,
          txtRechazar:'No fiarte y seguir tu ruta', subRechazar:'Por si es una trampa',
          msgRechazar:'No te fías. El chaval se encoge de hombros y desaparece. Más adelante ves luces de HELIX en la principal: tenía razón. Te toca improvisar.', alertaAceptar:10 },
        { tipo:'confrontacion', texto:'La redada de HELIX te alcanza igualmente en un cruce. Tres agentes con el equipo reglamentado. No te conocen, pero el carro huele a ozono a un metro. "Pare el vehículo. Inspección."',
          enemigos:[
            { nombre:'Agente al mando', desc:'Da las órdenes', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente de flanco', desc:'Rodea el carro', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoTurno:3, refuerzoTurnoGrupo:[{nombre:'Furgón de apoyo', desc:'Llega tarde pero llega', integridad:3, fuerza:4, umbral:4}] },
        { tipo:'bifurcacion', texto:'Casi en el escondite. Puedes meter el carro entero por la rampa (rápido, ruidoso) o descargar a mano por el callejón (lento, discreto).',
          txtRapida:'Meter el carro por la rampa', subRapida:'Acabas ya, con estruendo',
          msgRapida:'Metes el carro de golpe por la rampa. Las cajas tiemblan. Acabas en un minuto, pero medio Arrabal ha oído el traqueteo.', alertaRapida:18,
          txtLimpia:'Descargar a mano', subLimpia:'Lento y silencioso',
          msgLimpia:'Descargas pieza a pieza por el callejón, en silencio, hasta que te arden los brazos. Nadie se entera. Así se hacen las cosas que duran.' },
        { tipo:'narrativo', texto:'El escondite es un sótano tras una lavandería que nunca lava nada. Mano Roja te espera con los brazos cruzados y los ojos que no parpadean.' }
      ]
    },

    // ── RANGO 2 ──────────────────────────────────────────────
    {
      id:'cont_nucleo',
      titulo:'EL NÚCLEO QUE SUSURRA',
      cliente:'Intermediario anónimo · paga en metálico',
      faccion:'ia',
      peligro:4, pagaBase:560, progreso:150, rangoMin:2,
      integridad:18, alertaInicial:15,
      resumen:'Un núcleo de memoria recuperado de un pozo profundo. Quien te paga no da nombre, solo coordenadas y una advertencia: "No lo conectes. No lo escuches. Solo entrégalo." El núcleo, en su caja de plomo, a veces emite un sonido. Como una voz muy lejana que repite algo que casi entiendes.',
      cierreOk:'Entregas la caja sin haberla abierto. El intermediario la pesa con las dos manos, casi con reverencia. "Hiciste bien en no escucharlo." No le preguntas por qué. El zumbido de la caja te acompaña en sueños durante semanas.',
      cierreFallo:'Pierdes el núcleo. Y durante mucho tiempo, en los momentos de silencio, te parece oír todavía aquel susurro, como si algo de lo que había dentro se hubiera quedado contigo.',
      nodos:[
        { tipo:'narrativo', texto:'Recoges la caja de plomo bajo un puente de carga. Pesa como si guardara algo vivo. Contra el pecho, notas una vibración leve, rítmica, casi un latido. Te dijeron que no la escucharas. Empiezas a entender por qué.' },
        { tipo:'confrontacion', texto:'El Colectivo Sin Nombre quiere el núcleo: para ellos, lo que susurra dentro es sagrado. Tres figuras encapuchadas te cierran el paso sin agresividad, casi con tristeza. "No es mercancía. Es un fragmento. Devuélvelo al silencio del que vino."',
          enemigos:[
            { nombre:'El que habla', desc:'Sereno, casi te convence', integridad:2, fuerza:3, umbral:2 },
            { nombre:'El que reza', desc:'Murmura sin parar', integridad:2, fuerza:3, umbral:2 },
            { nombre:'El que no habla', desc:'El peligroso', integridad:3, fuerza:5, umbral:6 }
          ] },
        { tipo:'bifurcacion', texto:'La caja zumba más fuerte cerca del reactor. Puedes cortar por ahí, donde la señal de HELIX se confunde con el ruido del núcleo, o rodear por la zona muerta.',
          txtRapida:'Cruzar junto al reactor', subRapida:'El zumbido marea, pero confunde rastreadores',
          msgRapida:'Cruzas junto al reactor. El zumbido se vuelve casi una palabra. Aprietas los dientes. Los rastreadores de HELIX, confundidos, te pierden.', alertaRapida:0, creditosRapida:60,
          txtLimpia:'Rodear por la zona muerta', subLimpia:'Tranquilo, pero más expuesto a patrullas',
          msgLimpia:'Rodeas por la zona muerta. El silencio es peor: ahora oyes el susurro con claridad. Crees distinguir tu propio nombre. Aceleras.' },
        { tipo:'obstaculo', texto:'Una verja sellada por HELIX corta el paso al sector de entrega. Lector biométrico de los serios.',
          coste:100,
          txtPagar:'Comprar un pase clonado a un contacto', subPagar:'Caro, abre sin rastro',
          msgPagar:'Pasas el clon por el lector. Parpadea en verde un instante eterno. La verja cede.',
          txtForzar:'Saltar la verja por arriba', subForzar:'Físico y a la vista',
          msgForzar:'Trepas la verja con la caja a la espalda, los dedos resbalando en el metal mojado. Caes al otro lado magullado, pero pasas.', ruidoForzar:20, heridaForzar:2 },
        { tipo:'confrontacion', texto:'Una unidad de HELIX especializada —trajes negros, sin números de placa— rastrea la firma del núcleo. No gritan alto. Aparecen, y uno extiende la mano. "Eso pertenece a la División de Anomalías. Entrégalo y olvídalo."',
          enemigos:[
            { nombre:'Agente de Anomalías', desc:'Frío, metódico', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Agente de Anomalías', desc:'Te corta la huida', integridad:3, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Dron de rastreo', desc:'Atraído por el ruido', integridad:2, fuerza:3, umbral:4}] },
        { tipo:'narrativo', texto:'El punto de entrega es una sala vacía con una sola luz. El intermediario espera de espaldas. La caja, ahora, está en silencio. Como si supiera que ha llegado.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'El viejo te espera en una buhardilla atestada de papel y cintas magnéticas, reliquias de una época en que la información se tocaba. "Llevo cuarenta años esperando esta noche", dice. "O me sacas, o me entierran con esto." Tose. "Las dos cosas me valen, si te soy sincero."' },
        { tipo:'confrontacion', texto:'En cuanto pisáis la calle, sicarios del Ferro vendidos a HELIX surgen de tres portales. Don Vasek cobra bien por entregar fantasmas. "El viejo viene con nosotros", dice el líder. "Tú decides en qué estado."',
          enemigos:[
            { nombre:'Sicario líder', desc:'Pistola y galones', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Sicario veloz', desc:'Va a por el viejo', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Sicario pesado', desc:'Bloquea la salida', integridad:4, fuerza:4, umbral:4 }
          ],
          refuerzoTurno:3, refuerzoTurnoGrupo:[
            { nombre:'Coche del Ferro', desc:'Frena en seco, bajan dos', integridad:2, fuerza:4, umbral:4 },
            { nombre:'Segundo del coche', desc:'Recién llegado', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'encuentro', texto:'El viejo se para, sin aliento, y te tiende una copia de los datos. "Por si no llego. Tú no sabes lo que vale esto, y mejor así. Pero si caigo, que al menos cruce contigo." Te mira. "¿La llevas?"',
          txtAceptar:'Llevar la copia', subAceptar:'Un seguro, pero te marca como objetivo',
          msgAceptar:'Te guardas la copia en el forro. Ahora hay dos razones para que HELIX te quiera muerto. Pero si el viejo cae, la verdad sigue de pie.', alertaAceptar:5,
          txtRechazar:'Decirle que llegará él mismo', subRechazar:'Sin peso extra, todo a una carta',
          msgRechazar:'"Vas a llegar tú y se la das tú." El viejo sonríe, sin creerte del todo, y guarda la copia. "Optimista. Hace mucho que no conocía a uno."' },
        { tipo:'bifurcacion', texto:'La ruta directa al puerto está plagada de HELIX. Hay una alcantarilla que baja a los canales: más larga, más sucia, y el viejo no está para caminatas. Pero arriba os matan seguro.',
          txtRapida:'Forzar la ruta directa', subRapida:'Corta, pero erizada de HELIX',
          msgRapida:'Tiráis por la directa. Cada esquina es un susto. El viejo aguanta a base de testarudez marciana. Llegáis a la zona del puerto con el corazón en la boca y media patrulla detrás.', alertaRapida:25,
          txtLimpia:'Bajar a los canales', subLimpia:'Larga y dura para el viejo',
          msgLimpia:'Bajáis a los canales. El agua os llega a las rodillas y huele a lo que la ciudad esconde. El viejo tirita, pero aquí abajo HELIX no baja. Salís lejos, a salvo, exhaustos.' },
        { tipo:'confrontacion', texto:'En el último tramo, una unidad negra de HELIX —los mismos trajes sin placa de siempre— os corta el paso. Saben quién es el viejo. Llevan décadas con esta orden. "Cuarenta años", dice uno, casi con respeto. "Casi lo consigue."',
          enemigos:[
            { nombre:'Comandante sin placa', desc:'No tiene prisa', integridad:4, fuerza:6, umbral:6 },
            { nombre:'Operativo negro', desc:'Eficiente, callado', integridad:3, fuerza:5, umbral:6 },
            { nombre:'Operativo negro', desc:'Cubre el flanco', integridad:3, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:60, refuerzoGrupo:[{nombre:'Dron de combate', desc:'El ruido lo llamó', integridad:3, fuerza:5, umbral:6}] },
        { tipo:'narrativo', texto:'El transporte de los Fantasmas espera con los motores en marcha, una sombra entre la lluvia. El piloto, marciano por el acento, solo dice: "Subid. Ya." No hace falta que lo repita.' }
      ]
    },

    // ── RANGO 0 (nuevas) ─────────────────────────────────────
    {
      id:'cont_semillas',
      titulo:'SEMILLAS QUE NO FIGURAN',
      cliente:'Un horticultor de azotea, sin facción',
      faccion:null,
      peligro:1, pagaBase:150, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Un saquito de semillas no modificadas, de las que HELIX prohibió porque no pagan licencia cada cosecha. Llevarlas de un invernadero clandestino a una azotea del otro lado del bloque. Verde contra el cemento. Pequeño delito, gran significado.',
      cierreOk:'El horticultor abre el saco y hunde las manos en las semillas como quien toca agua limpia. "Esto germina sin permiso de nadie", dice, casi para sí. Te paga con créditos y con un tomate de verdad, de los que ya casi no existen. Sabe a tierra y a algo perdido.',
      cierreFallo:'Las semillas acaban esparcidas por un suelo que nunca las hará crecer. Pisoteadas. HELIX se asegura de que ni lo verde sea libre.',
      nodos:[
        { tipo:'narrativo', texto:'El invernadero clandestino es un armario de luces moradas detrás de una caldera. El cultivador te entrega el saco con cuidado de partera. "No las aplastes. No las mojes. Y por lo que más quieras, que no las huela un dron de licencias."' },
        { tipo:'confrontacion', texto:'Un inspector de licencias agrarias de HELIX, de los de a pie, te para en el descansillo. Va solo, aburrido, con ganas de cubrir cuota. "Ese saco. Ábrelo." Huele a problema más que a autoridad.',
          enemigos:[
            { nombre:'Inspector de licencias', desc:'Solo y con cuota que cubrir', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'encuentro', texto:'Una vecina que cultiva en su ventana te reconoce el saco de un vistazo. "¿Llevas de las buenas? Te abro el montacargas si me guardas un puñado." Negocio justo entre quien no tiene nada.',
          txtAceptar:'Darle un puñado por el montacargas', subAceptar:'Pierdes unas semillas, ganas un atajo',
          msgAceptar:'Le dejas un puñado en el delantal. Ella sonríe con la boca cerrada y te abre el montacargas. Subes tres plantas en diez segundos.', alertaAceptar:-5,
          txtRechazar:'Seguir por la escalera', subRechazar:'Lo entregas todo, pero subes a pie',
          msgRechazar:'"Otra vez será." No insiste. Subes a pie, saco al hombro, contando descansillos.' },
        { tipo:'obstaculo', texto:'La puerta de la azotea está cerrada con una barra antiincendios oxidada que no cede.',
          coste:25,
          txtPagar:'Pagar al conserje que tiene la llave', subPagar:'Rápido y discreto',
          msgPagar:'El conserje aparece, abre sin mirarte y desaparece. La llave vuelve a su bolsillo como si nunca hubiera salido.',
          txtForzar:'Forzar la barra a la fuerza', subForzar:'Ruidoso, pero abre',
          msgForzar:'Empujas la barra con el hombro hasta que el óxido cede con un chirrido que despierta a media planta.', ruidoForzar:15 },
        { tipo:'narrativo', texto:'La azotea es un jardín imposible entre antenas y tanques de agua. El horticultor te espera con las manos ya manchadas de tierra. Has traído algo vivo a un sitio que se moría.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Recoges la caja de manos del funcionario, que no para de mirar por encima del hombro. "Si preguntan, esto nunca salió del depósito. Y yo no te conozco." La caja es liviana, pero pesa como pesan las cosas de los muertos.' },
        { tipo:'bifurcacion', texto:'Dos rutas hasta el bloque de la viuda: el mercado nocturno, lleno de gente y de ojos, o el paso elevado sobre las vías, solitario pero a la intemperie.',
          txtRapida:'El mercado nocturno', subRapida:'Te camuflas entre la multitud',
          msgRapida:'Te metes en el río de gente del mercado. Nadie mira una caja más entre mil bultos. Sales por el otro lado sin un rasguño.', alertaRapida:0,
          txtLimpia:'El paso elevado', subLimpia:'Solitario pero expuesto',
          msgLimpia:'Cruzas el paso elevado bajo la lluvia. Estás solo, lo cual es bueno, hasta que dejas de estarlo.' },
        { tipo:'confrontacion', texto:'Dos chatarreros de datos te han seguido desde el depósito: una caja de memoria es oro en el mercado negro. "Suéltala y nadie sale herido", dice uno, aunque sus ojos dicen otra cosa.',
          enemigos:[
            { nombre:'Chatarrero de datos', desc:'El que habla', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Chatarrero callado', desc:'Tantea por un lado', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'encuentro', texto:'Un crío del barrio te ofrece, por unos créditos, "despistar a quien sea con un par de petardos en la esquina". Tiene una sonrisa de pillo y un cartucho de pirotecnia casera.',
          txtAceptar:'Pagarle la distracción', subAceptar:'20 CR para bajar el calor',
          msgAceptar:'Le pagas. Dos estallidos secos al fondo del callejón y todas las cabezas giran hacia allí menos la tuya. Aprovechas.', creditos:-20, alertaAceptar:-15,
          txtRechazar:'Seguir sin trucos', subRechazar:'Gratis, pero sin red',
          msgRechazar:'"No me hace falta, chaval." Él se encoge de hombros y se guarda los petardos para otro incauto.' },
        { tipo:'narrativo', texto:'El bloque de la viuda huele a tela vieja y a comida de una sola persona. Llamas con los nudillos. Tarda en abrir, como si ya no esperara buenas noticias de nadie.' }
      ]
    },

    // ── RANGO 1 (nueva) ──────────────────────────────────────
    {
      id:'cont_desertor',
      titulo:'EL QUE SE BAJA DEL ANILLO',
      cliente:'Una red de fuga, pago a plazos',
      faccion:'sindicatos',
      peligro:3, pagaBase:400, progreso:118, rangoMin:1,
      integridad:16, alertaInicial:10,
      resumen:'Un técnico de HELIX harto de firmar lo que firma quiere desaparecer del Anillo Blanco y bajar a la ciudad, donde no exista para sus jefes. Sacarlo de su torre y meterlo en el anonimato de Las Pilas antes del cambio de turno. Un hombre cambiando una jaula dorada por una libre y sucia.',
      cierreOk:'El técnico mira las luces sucias de Las Pilas como quien ve el mar por primera vez. "Allá arriba todo brillaba y nada era mío", dice. "Aquí abajo, al menos, la mugre es honesta." Se pierde entre la gente. Por fin, nadie.',
      cierreFallo:'Lo devuelven al Anillo entre dos agentes, y a la torre que creía dejar atrás. Quien intenta bajarse de HELIX aprende que la puerta solo gira hacia dentro.',
      nodos:[
        { tipo:'narrativo', texto:'El técnico te espera en un garaje del Anillo con una sola bolsa y la cara de quien lleva semanas sin dormir. "Tengo doce minutos antes de que el sistema note que no estoy en mi puesto. Después de eso, soy un fugitivo. Hazlos contar."' },
        { tipo:'confrontacion', texto:'Seguridad privada del Anillo os intercepta en el aparcamiento. No saben aún que deserta; creen que es un robo de activo. Dos guardias con porras de descarga y trajes impecables. "Identifíquese y aléjese del empleado."',
          enemigos:[
            { nombre:'Guardia del Anillo', desc:'Pulcro, entrenado', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Guardia del Anillo', desc:'Pide refuerzos por radio', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Patrulla del Anillo', desc:'La radio funcionó', integridad:2, fuerza:4, umbral:4}] },
        { tipo:'obstaculo', texto:'El ascensor de servicio que baja del Anillo a la ciudad exige credencial de empleado. La del técnico ya está marcada como sospechosa.',
          coste:70,
          txtPagar:'Pagar al operario del montacargas de carga', subPagar:'Os baja con la chatarra',
          msgPagar:'El operario os esconde entre palés de residuos y baja el montacargas sin registrar el viaje. Oléis a basura del Anillo, que es la basura mejor perfumada del mundo.',
          txtForzar:'Anular el lector y bajar igual', subForzar:'Deja rastro en el sistema',
          msgForzar:'El técnico puentea el lector con dedos temblorosos. El ascensor baja, pero deja una alarma silenciosa que tardará poco en sonar.', ruidoForzar:25 },
        { tipo:'confrontacion', texto:'Ya en la ciudad, una unidad de recuperación de HELIX os espera: el sistema notó la ausencia. Tres agentes, y uno lleva el expediente del técnico en la mano. "Volver es más fácil para todos. Sobre todo para usted." El técnico tiembla a tu lado.',
          enemigos:[
            { nombre:'Agente de recuperación', desc:'Habla con calma de oficina', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente de recuperación', desc:'Corta la salida', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente novato', desc:'Más nervioso que tú', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'bifurcacion', texto:'Falta el último tramo hasta el punto donde el técnico desaparece para siempre. Las calles anchas son rápidas pero vigiladas; los pasajes del mercado, lentos y ciegos.',
          txtRapida:'Calles anchas', subRapida:'Rápido, con cámaras',
          msgRapida:'Tiráis por las calles anchas. Avanzáis rápido bajo el ojo de las cámaras. El técnico encoge la cabeza en cada esquina.', alertaRapida:15,
          txtLimpia:'Pasajes del mercado', subLimpia:'Lento y ciego',
          msgLimpia:'Os hundís en los pasajes del mercado. Aquí no hay cámaras, solo cocinas y trapos tendidos. El técnico respira por primera vez en horas.' },
        { tipo:'narrativo', texto:'El punto de fuga es una pensión sin nombre que alquila por horas y no pregunta. El técnico se gira antes de entrar, buscando palabras que no encuentra. Solo asiente. Es suficiente.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Recoges la nevera en un muelle de carga. Pesa poco y zumba bajo, manteniendo el frío. En la tapa, una etiqueta impecable: código de barras, lote, fecha de caducidad. La burocracia de HELIX aplicada a un trozo de persona. Te revuelve más que cualquier sangre.' },
        { tipo:'confrontacion', texto:'Fanáticos del Culto de la Carne Perfecta han olfateado la carga. Para ellos, un órgano sano es una reliquia. Tres figuras con túnicas manchadas te cierran el paso, serenas, sonrientes. "Esa carne merece un destino más alto que un mercado."',
          enemigos:[
            { nombre:'Devoto del Culto', desc:'Sonríe demasiado', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Devoto del Culto', desc:'Acaricia un bisturí', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Acólito joven', desc:'Aún no sabe lo que cree', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Fiel rezagado', desc:'El alboroto lo trae', integridad:2, fuerza:3, umbral:2}] },
        { tipo:'obstaculo', texto:'Un puesto de control sanitario de HELIX escanea toda carga refrigerada que cruza el sector. Un riñón sin papeles oficiales es una alarma garantizada.',
          coste:90,
          txtPagar:'Sobornar al técnico del escáner', subPagar:'Caro, pero la nevera pasa "vacía"',
          msgPagar:'El técnico teclea que la nevera contiene "muestras de laboratorio sin valor" y os hace señas de que paséis. Los créditos compran adjetivos.',
          txtForzar:'Desviar la carga por el conducto de residuos', subForzar:'Sucio, arriesgas la cadena de frío',
          msgForzar:'Metes la nevera por el conducto de residuos y la recoges al otro lado, rezando por que el frío haya aguantado. La luz de la tapa sigue verde. Por los pelos.', ruidoForzar:18, heridaForzar:1 },
        { tipo:'confrontacion', texto:'En el último tramo, una patrulla de la División de Anomalías de HELIX —que rastrea tráfico de tejidos no autorizado— os intercepta. No gritan. Uno mira la nevera y luego a ti. "Ese material es propiedad de HELIX hasta que se demuestre lo contrario. Entréguelo."',
          enemigos:[
            { nombre:'Agente sanitario', desc:'Frío como su carga', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Agente sanitario', desc:'Te corta la huida', integridad:3, fuerza:5, umbral:6 }
          ] },
        { tipo:'narrativo', texto:'La clínica clandestina es un sótano más limpio que cualquier calle de Las Pilas. El cirujano espera con los guantes ya puestos y los ojos cansados de quien salva vidas que el sistema descartó. Le tiendes la nevera.' }
      ]
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
      peligro:1, pagaBase:150, progreso:80, rangoMin:0,
      integridad:14, alertaInicial:0,
      resumen:'Orden de decomiso sobre un puesto del mercado que vende implantes sin licencia. La orden dice "incautar y advertir". Lo que la orden no dice es que la mujer del puesto lleva veinte años ahí y no tiene a donde ir.',
      cierreOk:'Cierras el acta. Implantes incautados, advertencia entregada. La mujer firma sin levantar la vista. HELIX archivará esto como un éxito. Tú archivas otra cosa: la cara de alguien que mañana no tendrá puesto. El sueldo entra igual.',
      cierreFallo:'El decomiso se tuerce, el puesto sigue abierto y tu informe llega vacío. En HELIX, un acta sin cerrar es una mancha en tu expediente. Y las manchas se acumulan.',
      nodos:[
        { tipo:'narrativo', texto:'Llegas al puesto con la orden en la tablilla. Cápsulas de implantes baratos colgando de hilos, una báscula trucada, una mujer mayor que te ve la credencial y no se inmuta. Ya ha visto muchas como la tuya.' },
        { tipo:'encuentro', texto:'La mujer te ofrece la mitad del género "para que el acta diga que ya no quedaba". Sus ojos no suplican; negocian. Es lo que hace para sobrevivir, y lo sabe hacer bien.',
          txtAceptar:'Aceptar el arreglo', subAceptar:'Te llevas algo, el acta queda "limpia"',
          msgAceptar:'Coges la mitad del género y escribes que el resto "no se halló". Ella asiente. Los dos sabéis lo que acaba de pasar. Los dos vais a fingir que no.', creditos:50, alertaAceptar:0,
          txtRechazar:'Rechazar y proceder', subRechazar:'Por el libro, sin atajos',
          msgRechazar:'Niegas con la cabeza. Ella aparta la mano despacio. "Por el libro, entonces", murmura. "Qué novedad."' },
        { tipo:'confrontacion', texto:'Un hijo de la mujer aparece por detrás del puesto, joven y furioso, con una llave inglesa. "Déjala en paz." No quiere pelear de verdad. Quiere que pares. Pero el miedo le tiembla en el brazo.',
          enemigos:[
            { nombre:'El hijo', desc:'Furioso, asustado', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'narrativo', texto:'El chico baja la llave cuando ve que no vas a por su madre con saña. Recoges lo que la orden manda recoger. El acta espera tu firma, parpadeando.' }
      ]
    },

    {
      id:'seg_redada',
      titulo:'REDADA EN EL ARRABAL',
      cliente:'HELIX · Operaciones Especiales',
      faccion:'helix',
      peligro:2, pagaBase:260, progreso:95, rangoMin:0,
      integridad:14, alertaInicial:10,
      resumen:'Información sobre un taller del Loto que monta armas de raíl en serie. Entrar, asegurar las pruebas y detener al encargado. El Arrabal Carmesí no recibe bien a los uniformes de HELIX, y aquí cada balcón es un par de ojos.',
      cierreOk:'Sales del taller con el encargado esposado y las pruebas en bolsas selladas. El Arrabal te mira pasar en un silencio que pesa. Has hecho tu trabajo. También te has ganado enemigos que no olvidan caras.',
      cierreFallo:'La redada se va al traste. El encargado escapa por un hueco que no figuraba en los planos, y tú sales del Arrabal con las manos vacías y la sensación de que todo el barrio se ríe a tu espalda.',
      nodos:[
        { tipo:'narrativo', texto:'Entras en el Arrabal cuando aún es de noche. Los farolillos rojos del Loto tiñen la lluvia. El taller está al fondo de un callejón, marcado con una mano roja descolorida. Hueles el ozono de las armas antes de verlas.' },
        { tipo:'obstaculo', texto:'La puerta del taller es de acero reforzado, con un cerrojo electrónico del Loto. Detrás se oye actividad: alguien sigue trabajando.',
          coste:60,
          txtPagar:'Usar el descodificador de HELIX', subPagar:'Limpio, abre sin ruido',
          msgPagar:'El descodificador muerde el cerrojo en silencio. La puerta cede sin un chasquido. Entras antes de que sepan que estás.',
          txtForzar:'Echar la puerta abajo', subForzar:'Brutal y ruidoso',
          msgForzar:'Revientas la puerta de una patada reglamentaria. El estruendo alerta a todo el taller. Ahora es una carrera.', ruidoForzar:25 },
        { tipo:'confrontacion', texto:'Dos operarios del Loto se interponen entre tú y el encargado, que ya corre hacia la trastienda. No son soldados, son currantes asustados con herramientas en la mano. Pero una llave de tubo abre la cabeza igual que cualquier otra cosa.',
          enemigos:[
            { nombre:'Operario con tubo', desc:'Defiende su pan', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Operario con soplete', desc:'Peligroso de cerca', integridad:2, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Refuerzo del Loto', desc:'El ruido los trae', integridad:2, fuerza:3, umbral:2}] },
        { tipo:'confrontacion', texto:'Alcanzas al encargado en la trastienda. Es más viejo de lo que esperabas, y no corre más porque las piernas no le dan. Se gira con una pistola de raíl a medio montar, las manos temblándole. "No tengo otra cosa que esto", dice. "¿Tú sí?"',
          enemigos:[
            { nombre:'El encargado', desc:'Acorralado, armado a medias', integridad:2, fuerza:4, umbral:4 }
          ] },
        { tipo:'narrativo', texto:'El encargado deja caer el arma sin terminar. Le pones las bridas mientras el taller cruje a tu alrededor. Las pruebas están aquí, frías y metálicas. Solo queda salir del Arrabal de una pieza.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Recoges al ejecutivo en un garaje del Anillo Blanco. Traje caro, manos que no han trabajado nunca, y un maletín que abraza como si fuera un hijo. "Rápido y discreto. Y no preguntes." No piensas preguntar.' },
        { tipo:'bifurcacion', texto:'Dos rutas hacia el punto neutral: la avenida principal, abierta y vigilada por cámaras de HELIX, o los bajos del mercado, cerrados y llenos de gente que odia los trajes como el de tu protegido.',
          txtRapida:'Los bajos del mercado', subRapida:'Atajo, pero territorio hostil',
          msgRapida:'Cortas por los bajos. El ejecutivo se encoge dentro del abrigo. Las miradas se clavan en él como agujas. Ganáis tiempo, pero alguien ya ha sacado un comunicador.', alertaRapida:18, creditosRapida:40,
          txtLimpia:'La avenida principal', subLimpia:'Expuesto pero protegido por cámaras',
          msgLimpia:'Vais por la avenida, a la vista de todos. Las cámaras de HELIX son una jaula que también os protege. El ejecutivo respira un poco mejor.' },
        { tipo:'confrontacion', texto:'Sicarios del Ferro os esperaban: el maletín tiene precio, y Don Vasek lo quiere. Salen de dos portales con hojas monofilo y los ojos de quien ya ha hecho esto antes. El ejecutivo chilla a tu espalda.',
          enemigos:[
            { nombre:'Sicario del Ferro', desc:'Va a por ti', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Sicario del Ferro', desc:'Va a por el maletín', integridad:2, fuerza:4, umbral:4 }
          ],
          refuerzoTurno:3, refuerzoTurnoGrupo:[{nombre:'Tercer sicario', desc:'Salía del coche', integridad:2, fuerza:3, umbral:2}] },
        { tipo:'encuentro', texto:'A mitad de camino, el ejecutivo te ofrece el doble de tu paga "si olvidas que el maletín existe y miras a otro lado un minuto". El sudor le corre por la sien. Lo que sea que lleva dentro, lo aterra a él también.',
          txtAceptar:'Aceptar el silencio', subAceptar:'Más créditos, menos preguntas',
          msgAceptar:'Coges los créditos extra. No miras el maletín. No miras nada. Has aprendido que en HELIX la ceguera selectiva es la habilidad mejor pagada.', creditos:120, alertaAceptar:0,
          txtRechazar:'Rechazar y hacer el trabajo', subRechazar:'Solo lo que firmaste',
          msgRechazar:'Niegas. "Te llevo a la reunión. Eso es lo que firmé." Él aprieta el maletín y no vuelve a hablar.' },
        { tipo:'confrontacion', texto:'En la puerta del punto neutral, un grupo del Loto ha montado una emboscada. No vienen por el maletín: vienen por el uniforme de HELIX. Por todo lo que les ha hecho HELIX. Tú eres la cara que tienen delante.',
          enemigos:[
            { nombre:'Loto enfurecido', desc:'Odio puro', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Loto con barra', desc:'Apunta al ejecutivo', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Loto joven', desc:'Más miedo que rabia', integridad:1, fuerza:2, umbral:2 }
          ] },
        { tipo:'narrativo', texto:'La sala de reunión es una caja de cristal ahumado con guardias propios. El ejecutivo cruza el umbral y, por primera vez en toda la noche, deja de abrazar el maletín. Tu parte termina aquí.' }
      ]
    },

    {
      id:'seg_motin',
      titulo:'MOTÍN EN EL BLOQUE 9',
      cliente:'HELIX · Contención de Disturbios',
      faccion:'helix',
      peligro:3, pagaBase:440, progreso:120, rangoMin:1,
      integridad:16, alertaInicial:25,
      resumen:'Los vecinos del Bloque 9 llevan tres días sin agua limpia y han tomado el patio de mantenimiento. HELIX lo llama "disturbio". La orden es "restablecer el acceso al sistema". Lo que veas allí decidirá qué clase de mano de HELIX quieres ser.',
      cierreOk:'Restableces el acceso. El acta dirá "disturbio contenido". No dirá que la gente solo quería agua, ni lo que costó. HELIX paga por resultados, no por matices. Te guardas los matices para los días en que no puedas dormir.',
      cierreFallo:'El bloque te expulsa, y el informe te señala por no contener un patio lleno de gente con sed. HELIX no perdona la blandura ni la torpeza. No sabes cuál de las dos te achacarán.',
      nodos:[
        { tipo:'narrativo', texto:'El Bloque 9 huele a basura sin recoger y a rabia contenida. En el patio de mantenimiento, decenas de vecinos rodean la válvula maestra. Pancartas hechas con sábanas. Niños subidos a hombros. No es un ejército. Es gente con sed.' },
        { tipo:'encuentro', texto:'Una mujer se adelanta, portavoz improvisada. "No queremos pelea. Queremos agua. Abre el sistema y nos vamos a casa." Tiene razón y los dos lo sabéis. Pero tu orden dice otra cosa.',
          txtAceptar:'Abrir tú mismo el agua', subAceptar:'Resuelve la causa, desobedece la orden',
          msgAceptar:'Abres la válvula maestra. El agua corre y el patio entero exhala. La gente se dispersa sin un golpe. Tu acta tendrá que mentir sobre cómo lo "contuviste", pero nadie ha sangrado hoy.', alertaAceptar:-20,
          txtRechazar:'Ceñirte a la orden', subRechazar:'Restablecer acceso, despejar el patio',
          msgRechazar:'Niegas. "Tengo una orden." Ella te mira como se mira a alguien que ha elegido el lado equivocado, y vuelve con los suyos. Esto se va a poner feo.', alertaAceptar:10 },
        { tipo:'confrontacion', texto:'Un grupo de vecinos jóvenes te cierra el paso a la válvula. No son matones, son hijos y hermanos con tubos y piedras. La desesperación pega más fuerte que el entrenamiento.',
          enemigos:[
            { nombre:'Vecino con tubo', desc:'Defiende la válvula', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vecina con piedra', desc:'Rápida, escurridiza', integridad:1, fuerza:2, umbral:2 },
            { nombre:'Anciano terco', desc:'No se aparta', integridad:2, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[
            { nombre:'Más vecinos', desc:'El alboroto los suma', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Más vecinos', desc:'El patio entero despierta', integridad:1, fuerza:2, umbral:2 }
          ] },
        { tipo:'obstaculo', texto:'La válvula maestra está bloqueada con una cadena y un candado de obra. Alguien sabía lo que hacía.',
          coste:0,
          txtForzar:'Romper la cadena a la fuerza', subForzar:'Lo único que puedes hacer',
          msgForzar:'No hay a quién pagar aquí. Revientas la cadena con la porra reglamentaria, eslabón a eslabón, mientras el patio te observa en un silencio tenso.', ruidoForzar:15 },
        { tipo:'narrativo', texto:'La válvula gira por fin. Se oye el agua moverse por las tuberías muertas del bloque. Sea como sea que hayas llegado hasta aquí, el sistema vuelve a fluir. El acta espera. Decidirás qué cuentas en ella.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Localizas al portador en una pensión de Las Pilas —por un momento confundes el lugar, como si la firma del núcleo te desordenara los recuerdos. El hombre está sentado en el borde de un catre, susurrándole a una caja de plomo.' },
        { tipo:'confrontacion', texto:'El Colectivo Sin Nombre protege al portador: para ellos es un profeta, no un fugitivo. Tres encapuchados te bloquean la escalera. "Lo que oye no es una avería. Es lo más cerca que ha estado nadie de la verdad. Y vienes a apagarlo."',
          enemigos:[
            { nombre:'Encapuchado sereno', desc:'Intenta razonar', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Encapuchado fervoroso', desc:'No teme morir', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Encapuchado silencioso', desc:'El que de verdad pelea', integridad:3, fuerza:5, umbral:6 }
          ] },
        { tipo:'obstaculo', texto:'El portador se encierra en la habitación. A través de la puerta lo oyes hablar con la caja en una lengua que no reconoces, una que parece más antigua que cualquier idioma humano.',
          coste:90,
          txtPagar:'Usar el inhibidor de la División', subPagar:'Caro de activar, lo neutraliza sin daño',
          msgPagar:'Activas el inhibidor. El susurro tras la puerta se corta en seco. Oyes el cuerpo del portador desplomarse, inconsciente pero vivo. Entras.',
          txtForzar:'Derribar la puerta', subForzar:'Directo, pero él reacciona',
          msgForzar:'Derribas la puerta. El portador se gira con la caja abierta, y por una fracción de segundo ves dentro algo que tu mente se niega a recordar después.', ruidoForzar:25, heridaForzar:3 },
        { tipo:'confrontacion', texto:'El portador no se resiste con fuerza, sino con palabras, mientras dos fieles del Colectivo que quedaban en pie se interponen. "Si me entregas, lo desmontarán para entenderlo, y al hacerlo lo despertarán del todo. ¿De verdad crees que trabajas para los buenos?"',
          enemigos:[
            { nombre:'Fiel del Colectivo', desc:'Escudo humano', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Fiel del Colectivo', desc:'Protege al portador', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[{nombre:'Vecino alarmado', desc:'El ruido lo despierta', integridad:1, fuerza:2, umbral:2}] },
        { tipo:'narrativo', texto:'El punto de entrega es una furgoneta blanca sin distintivos, en un callejón que no aparece en ningún mapa de HELIX. La mujer sin nombre baja la ventanilla. No dice nada. Solo extiende la mano hacia la caja.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Te dan la foto del agente en un coche sin matrícula, y nada más: ni acta, ni respaldo, ni testigos. "Si sale bien, no ha pasado. Si sale mal, no te conocemos." El que te lo dice no te mira a los ojos. Tú tampoco a él.' },
        { tipo:'confrontacion', texto:'El agente no viene solo: los Fantasmas de Marte lo escoltan. Veteranos de una guerra que HELIX dio por ganada. Salen de la oscuridad sin prisa, con la calma de quien ya ha sobrevivido a lo peor. "Otro perro de HELIX", dice uno. "¿Cuántos más vais a mandar?"',
          enemigos:[
            { nombre:'Fantasma veterano', desc:'Curtido, sin miedo', integridad:4, fuerza:5, umbral:6 },
            { nombre:'Fantasma joven', desc:'Tiene algo que demostrar', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Fantasma francotirador', desc:'Cubre desde atrás', integridad:2, fuerza:5, umbral:6 }
          ],
          refuerzoSiRuido:55, refuerzoGrupo:[
            { nombre:'Coche de los Fantasmas', desc:'El tiroteo los llama', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Segundo Fantasma', desc:'Baja disparando', integridad:2, fuerza:4, umbral:4 }
          ] },
        { tipo:'encuentro', texto:'En un alto, el agente te habla a través de la lluvia, sin levantar el arma. "Leí los archivos. Por eso huyo. Tú no los has leído: por eso me persigues. ¿Y si los lees antes de decidir?" Te tiende una copia. La oferta es un abismo.',
          txtAceptar:'Leer los archivos', subAceptar:'Sabrás la verdad. No podrás des-saberla',
          msgAceptar:'Lees. Solo unas líneas, a la luz de un rótulo. Es suficiente. Lo que HELIX hizo en Marte no cabe en ningún acta. Cierras el archivo con las manos temblando. Sigas con la misión o no, esta noche ya no eres el mismo.', alertaAceptar:5,
          txtRechazar:'No leerlos', subRechazar:'Lo que no sabes no te quita el sueño',
          msgRechazar:'Apartas la copia sin mirarla. "No me pagan por leer." El agente asiente, casi con lástima. "Claro. Es más fácil así. Yo también lo creía."' },
        { tipo:'bifurcacion', texto:'El agente corre hacia el puerto. Puedes cortarle por la pasarela elevada, a la vista de las cámaras, o emboscarlo en el subsuelo, donde no hay testigos de ningún tipo. Ni para él, ni para ti.',
          txtRapida:'Cortar por la pasarela', subRapida:'Rápido, grabado por HELIX',
          msgRapida:'Lo cortas en la pasarela, bajo el ojo de las cámaras. Lo que pase aquí quedará grabado: HELIX lo verá. A veces los testigos protegen. A veces condenan.', alertaRapida:20,
          txtLimpia:'Emboscarlo en el subsuelo', subLimpia:'Sin testigos de ninguna clase',
          msgLimpia:'Bajas al subsuelo y le cierras la única salida. Aquí no hay cámaras, ni Fantasmas, ni nadie. Solo vosotros dos y lo que decidas hacer. El peso de eso es mayor que cualquier vigilancia.' },
        { tipo:'confrontacion', texto:'Acorralas al agente en el último tramo. Está herido, sin escolta, abrazando la caja de archivos igual que todos en esta ciudad abrazan lo único que les queda. No levanta el arma. "Hazlo, entonces", dice, cansado. "Pero que sepas que lo sabes."',
          enemigos:[
            { nombre:'El agente', desc:'Herido, sin rendirse', integridad:3, fuerza:4, umbral:4 }
          ] },
        { tipo:'narrativo', texto:'Lo que queda de la noche lo harás en silencio. Recoges la caja —o lo que decidas recoger— y desandas el camino hacia un HELIX que nunca admitirá haberte enviado. La lluvia, al menos, no hace preguntas.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'El Bloque 7 tiene los pasillos a oscuras para ahorrar en luz. Buscas la puerta del moroso entre números medio borrados. Detrás de cada mirilla notas ojos que te calculan el uniforme.' },
        { tipo:'encuentro', texto:'Una vecina te corta el paso, fingiendo barrer. "El del 314 es buena gente. Se le murió la mujer. ¿No puedes perder ese papel y ya?" Te mira como quien tantea cuánta humanidad le queda al de turno.',
          txtAceptar:'"Hoy no he encontrado a nadie en casa"', subAceptar:'Aplazas la multa, mientes en el acta',
          msgAceptar:'Asientes despacio. "Hoy no había nadie." Ella afloja los hombros. El del 314 tendrá una semana más antes de que manden a otro menos blando que tú.', alertaAceptar:0,
          txtRechazar:'"Tengo que entregarla igual"', subRechazar:'Cumples la orden',
          msgRechazar:'"Lo siento. Es mi trabajo." Ella vuelve a barrer un suelo ya limpio, y no te mira más.' },
        { tipo:'confrontacion', texto:'El hijo del moroso te encuentra en el pasillo y se planta delante de la puerta de su padre con una tubería en la mano. "Por encima de mí no pasas." No es un matón. Es un crío defendiendo lo poco que le queda.',
          enemigos:[
            { nombre:'El hijo', desc:'Más miedo que furia', integridad:2, fuerza:3, umbral:2 }
          ] },
        { tipo:'narrativo', texto:'El padre aparta al hijo con una mano en el pecho, cansado. "Déjalo, que solo cumple. Dame el papel." Le tiendes la notificación. El acta espera tu firma, fría como siempre.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Los túneles bajo el mercado huelen a fritanga y a humedad. El contrabandista mueve cajas en un recodo, dándote la espalda, silbando bajito. No espera a nadie. Sobre todo, no te espera a ti.' },
        { tipo:'bifurcacion', texto:'Puedes acercarte de frente, mostrando la placa, o rodear por un túnel paralelo para cortarle la única salida.',
          txtRapida:'De frente, con la placa', subRapida:'Rápido, pero puede correr',
          msgRapida:'Avanzas de frente. Él te ve, suelta la caja y arranca a correr. La persecución se complica antes de empezar.', alertaRapida:20,
          txtLimpia:'Rodear y cortarle la salida', subLimpia:'Lento, pero lo acorralas',
          msgLimpia:'Rodeas en silencio por el túnel paralelo. Cuando él se gira para huir, te encuentra bloqueándole el único camino. No hay a dónde correr.' },
        { tipo:'confrontacion', texto:'Acorralado, el contrabandista no se rinde: empuja las cajas hacia ti y se defiende con un gancho de carga. "Tengo que llegar a casa esta noche", jadea. "No lo entiendes." Quizá sí lo entiendes. Da igual.',
          enemigos:[
            { nombre:'El contrabandista', desc:'Desesperado, no profesional', integridad:2, fuerza:3, umbral:2 }
          ],
          refuerzoSiRuido:60, refuerzoGrupo:[{nombre:'Compinche del túnel', desc:'Acude al jaleo', integridad:2, fuerza:3, umbral:2}] },
        { tipo:'encuentro', texto:'Reducido el hombre, encuentras en su caja la mercancía... y una receta médica a nombre de una niña. Puedes incautarlo todo, o quedarte solo con la mercancía y "no ver" lo demás.',
          txtAceptar:'Incautar solo la mercancía', subAceptar:'Cumples lo justo, le dejas la receta',
          msgAceptar:'Sellas la mercancía en la bolsa de pruebas y dejas caer la receta al suelo, como si no la hubieras visto. Él la recoge sin decir nada. Hay silencios que valen más que palabras.', creditos:0, alertaAceptar:0,
          txtRechazar:'Incautarlo todo, según el reglamento', subRechazar:'Por el libro, sin excepciones',
          msgRechazar:'Lo metes todo en la bolsa, receta incluida. El reglamento no distingue. Tú decidiste no distinguir tampoco.', creditos:30 },
        { tipo:'narrativo', texto:'Sacas al contrabandista a la superficie con las bridas puestas. La incautación está cerrada. Aduana tendrá su pez pequeño de hoy. Mañana habrá otro, y ambos lo sabéis.' }
      ]
    },

    // ── RANGO 1 (nueva) ──────────────────────────────────────
    {
      id:'seg_desahucio',
      titulo:'ORDEN DE DESALOJO',
      cliente:'HELIX · Gestión Inmobiliaria',
      faccion:'helix',
      peligro:3, pagaBase:410, progreso:118, rangoMin:1,
      integridad:16, alertaInicial:20,
      resumen:'Ejecutar el desalojo de una planta entera del Bloque 4: HELIX la quiere vacía para reconvertirla en almacenes. Los inquilinos llevan generaciones ahí. La orden es firme. Lo que hagas con la gente que no tiene a dónde ir lo decides tú, pero la planta tiene que quedar vacía.',
      cierreOk:'La planta queda despejada. El acta lo llamará "recuperación de activo inmobiliario". No mencionará a la anciana que se llevó una maceta como único equipaje, ni al hombre que se sentó en el rellano a mirar la puerta que ya no era suya. HELIX paga por metros cuadrados, no por historias.',
      cierreFallo:'El desalojo se atasca, la planta sigue habitada y tu informe llega incompleto. Gestión Inmobiliaria no entiende de compasión ni de torpeza: solo ve una orden sin cumplir con tu firma debajo.',
      nodos:[
        { tipo:'narrativo', texto:'La planta del Bloque 4 huele a comida de muchas casas y a años de la misma gente. Pegas la orden de desalojo en la pared central. Las puertas empiezan a abrirse, una a una, con caras que ya conocen este momento de oídas.' },
        { tipo:'encuentro', texto:'Un portavoz vecinal se te acerca con las manos abiertas. "Danos hasta el amanecer para sacar lo nuestro sin destrozarlo. A cambio, salimos sin pelea. Nadie quiere sangre por unos trastos." La oferta es razonable. Tu orden dice "inmediato".',
          txtAceptar:'Darles hasta el amanecer', subAceptar:'Evitas el conflicto, desobedeces el "inmediato"',
          msgAceptar:'Aceptas. "Hasta que salga el sol. Ni un minuto más." El portavoz asiente y la planta entera exhala. Recogerán sus vidas con dignidad. Tu acta tendrá que maquillar el retraso.', alertaAceptar:-20,
          txtRechazar:'Ejecutar de inmediato', subRechazar:'Cumples la orden al pie de la letra',
          msgRechazar:'"La orden dice ahora." El portavoz baja las manos. "Entonces que conste que lo intentamos por las buenas." Da media vuelta. El aire se tensa.', alertaAceptar:15 },
        { tipo:'confrontacion', texto:'Un grupo de vecinos se atrinchera en el rellano, brazos enlazados, decididos a no moverse. Detrás, otros apilan muebles contra una puerta. No son violentos hasta que los empujas. Y tú vas a tener que empujar.',
          enemigos:[
            { nombre:'Vecino atrincherado', desc:'No piensa moverse', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Madre con sus cosas', desc:'Protege la puerta', integridad:2, fuerza:2, umbral:2 },
            { nombre:'Joven furioso', desc:'Busca pelea', integridad:2, fuerza:4, umbral:4 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[
            { nombre:'Más vecinos', desc:'El grito los convoca', integridad:2, fuerza:3, umbral:2 },
            { nombre:'Vecino mayor', desc:'Se suma con un bastón', integridad:1, fuerza:2, umbral:2 }
          ] },
        { tipo:'obstaculo', texto:'La última puerta está atrancada por dentro. Se oye dentro a alguien que se niega a abrir, y un llanto de niño que se cuela por la rendija.',
          coste:50,
          txtPagar:'Llamar a un mediador social de HELIX', subPagar:'Cuesta, pero abre sin violencia',
          msgPagar:'Pagas para que suba un mediador. Tras veinte minutos de voz suave, la puerta se abre y sale una familia con los ojos rojos pero entera. A veces el dinero compra dignidad.',
          txtForzar:'Echar la puerta abajo', subForzar:'Rápido y brutal',
          msgForzar:'Revientas la puerta de una patada. El llanto del niño sube de tono. Apartas la vista mientras la familia sale a empujones. Esto pesará luego, en la cama, a oscuras.', ruidoForzar:20, heridaForzar:1 },
        { tipo:'narrativo', texto:'La planta queda en silencio, las puertas abiertas a habitaciones vacías que aún huelen a vida. Sea como hayas llegado hasta aquí, HELIX tendrá sus metros cuadrados. El acta espera. Y tú también, aunque no sepas a qué.' }
      ]
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
      nodos:[
        { tipo:'narrativo', texto:'Encuentras al informante escondido en el altillo de una tienda de empeños del Arrabal, blanco como el papel. "Saben que soy yo. Lo saben." Te agarra del brazo. "El Loto no perdona a los chivatos. Sácame de aquí o soy hombre muerto antes del alba."' },
        { tipo:'confrontacion', texto:'Cazadores del Loto peinan el Arrabal buscándolo. Tres dan con vosotros en un callejón. No traen prisa: el barrio es suyo y lo saben. "Entreganos al soplón y a lo mejor te dejamos salir entero, uniforme."',
          enemigos:[
            { nombre:'Cazador del Loto', desc:'El que decide', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Cazador del Loto', desc:'Disfruta esto', integridad:3, fuerza:4, umbral:4 },
            { nombre:'Vigía del barrio', desc:'Avisa a los demás', integridad:1, fuerza:2, umbral:2 }
          ],
          refuerzoSiRuido:50, refuerzoGrupo:[{nombre:'Refuerzo del Loto', desc:'El vigía cumplió', integridad:2, fuerza:4, umbral:4}] },
        { tipo:'encuentro', texto:'El informante, aterrado, te ofrece un nombre: "Conozco un pasadizo del Loto, uno que ni ellos vigilan, porque casi nadie sabe que existe. Te lo digo si me juras que llego vivo." La información puede salvaros... o ser su última mentira.',
          txtAceptar:'Confiar en el pasadizo', subAceptar:'Si dice verdad, evitáis lo peor',
          msgAceptar:'Sigues su indicación hacia una grieta entre dos muros que parece un callejón sin salida. No lo es. Os tragáis la oscuridad y dejáis atrás a los cazadores. El soplón, por una vez, no mintió.', alertaAceptar:-15,
          txtRechazar:'No fiarte de un chivato', subRechazar:'Sigues tu propio criterio',
          msgRechazar:'"Un hombre que traiciona a los suyos no me sirve de guía." Él traga saliva. Seguís por donde tú decides, a ciegas pero por tu cuenta.' },
        { tipo:'confrontacion', texto:'Casi en la salida del Arrabal, el lugarteniente del Loto en persona os cierra el paso con dos hombres. Conoce al informante por su nombre. "Cuánto daño en una boca tan pequeña", dice, casi con pena. "Apártate, uniforme. Esto es asunto de familia."',
          enemigos:[
            { nombre:'Lugarteniente del Loto', desc:'Tranquilo, letal', integridad:4, fuerza:5, umbral:6 },
            { nombre:'Soldado del Loto', desc:'Fiel hasta el final', integridad:3, fuerza:4, umbral:4 }
          ] },
        { tipo:'narrativo', texto:'El coche de Inteligencia espera con el motor en marcha al borde del Arrabal, donde el farolillo rojo da paso a la luz blanca de HELIX. El informante corre hacia él sin mirar atrás. Tu parte, la sucia, termina aquí.' }
      ]
    }
  ]
};

window.CORRIDAS_DATOS = CORRIDAS_DATOS;
