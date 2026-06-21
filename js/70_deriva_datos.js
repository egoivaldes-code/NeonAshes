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
//   narrativo:    { id, tipo:'narrativo', texto, alerta?, herida?, botin?, item? }
//                 · herida → sube tu FATIGA real (te la llevas a casa).
//                 · botin  → créditos, se te pagan en el acto.
//                 · item   → objeto que se te da al inventario.
//                 · alerta → presión del distrito (empeora el ambiente).
//   confrontacion:{ id, tipo:'confrontacion', texto,
//                   enemigos:[ { nombre, desc, integridad, fuerza, umbral } ] }
//                 · se resuelve con el equipo que lleves encima.
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
    refuerzoGrupo:[ { nombre:'Curioso con ganas', desc:'El ruido lo trajo', tipo:'rapido', integridad:2, fuerza:3, umbral:2 } ] }

];

window.EVENTOS_DERIVA = EVENTOS_DERIVA;
