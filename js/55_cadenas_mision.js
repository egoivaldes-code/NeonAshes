// ============================================================
// BLOQUE JS-55 — DOS CADENAS DE MISIÓN (persistentes entre runs)
// ------------------------------------------------------------
// Mismo sistema que 49_cadenas_lore.js / 50_cadenas_facciones.js:
//   · Cada PARTE es una escena de entrada (entrada:true) con
//     cadena:'<id>'. El motor (44_escenas_guion.js) deja avanzar
//     SOLO UNA parte de cada cadena por run de exploración.
//   · La parte N+1 aparece solo si ya se vio la N (cond:{visto:...})
//     y no se ha visto ella misma (cond:{noVisto:...}). Así la
//     historia avanza ENTRE sesiones, no de golpe.
//   · Recompensas crecientes; super-recompensa al cerrar la parte 5.
//   · El estado persistente lo da la lista de "vistos" que ya
//     guarda el motor entre partidas. No hace falta tocar el motor.
//
// CADENA 1 — 'senal'  "La señal del nivel 9"  (facción afín: ia)
// CADENA 2 — 'lista'  "El nombre en la lista" (facción afín: sindicatos)
//
// Solo imágenes, items, condiciones y facciones que YA existen.
// Se carga DESPUÉS de 50_cadenas_facciones.js.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CADENAS = {

  // ==================================================================
  // ====================  CADENA 1 — "LA SEÑAL DEL NIVEL 9"  =========
  // Alguien capta una transmisión repetida desde un nivel sellado.
  // El rastro lleva a algo que escucha y aprende. Tema: CERO / memoria.
  // Facción afín: 'ia' (El Colectivo Sin Nombre).
  // ==================================================================

  // ---- PARTE 1 ----
  'senal_p1': {
    entrada: true,
    cadena: 'senal',
    cond: { noVisto: 'senal_p1' },
    img: 'EXP_CIBERCAFE',
    texto: 'En un cibercafé medio muerto, un técnico con audífonos caseros te hace señas, urgente. "Eh. Tú. '
         + '¿Oyes esto?" Te tiende un auricular. Bajo la estática, algo se repite: tres pulsos, una pausa, '
         + 'tres pulsos. "Lleva semanas. Siempre igual. Y viene del nivel 9. El nivel 9 está sellado desde '
         + 'antes de que yo naciera."',
    opciones: [
      { texto: 'Escuchar con atención la secuencia.', lleva:'senal_p1_b' },
      { texto: '"Será una tubería, un eco, cualquier cosa."', efectos:{ disociacion:+2 },
        resultado:'"Eso me dije yo al principio", contesta. "Pero las tuberías no hacen pausas iguales. Esto cuenta. Esto espera respuesta." Le devuelves el auricular, pero los tres pulsos se te quedan dentro, marcando el paso.', lleva:'senal_p1_b' }
    ]
  },
  'senal_p1_b': {
    img: 'EXP_CIBERCAFE',
    texto: 'Escuchas de nuevo. Tres pulsos, pausa, tres pulsos. No es ruido: tiene intención, como un corazón '
         + 'que llamara a una puerta. "Yo no puedo bajar a mirar", dice el técnico. "Tengo críos. Pero si '
         + 'alguien sin nada que perder rastreara de dónde sale exactamente..." Te mira. No terminas de '
         + 'decidir si es una oferta o una advertencia.',
    opciones: [
      { texto: 'Quedarte la frecuencia. Seguir el rastro otro día.',
        efectos:{ disociacion:+3, aislamiento:-2 },
        resultado:'Anotas la frecuencia y el técnico te marca por dónde empezar a buscar. "Ten cuidado", dice. "Lo que cuenta hasta tres también sabe esperar." Sales del cibercafé con un rumbo nuevo y un peso raro en el pecho. (La señal seguirá ahí la próxima vez que explores.)' },
      { texto: 'Devolverle el auricular: no es asunto tuyo.',
        efectos:{ aislamiento:+2 },
        resultado:'"Claro. Nadie quiere que lo sea." Se vuelve a poner los audífonos, solo otra vez con su misterio. Te vas. Pero esa noche, en el silencio del apartamento, juras oír tres pulsos y una pausa. (Podrás retomar el rastro si vuelves a cruzarte con la señal.)' }
    ]
  },

  // ---- PARTE 2 ----
  'senal_p2': {
    entrada: true,
    cadena: 'senal',
    cond: { visto: 'senal_p1', noVisto: 'senal_p2' },
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Siguiendo la frecuencia con un rastreador prestado, llegas a un pozo de mantenimiento que baja hacia '
         + 'los niveles sellados. La señal es más fuerte aquí: tres pulsos, pausa. El rastreador parpadea. Una '
         + 'reja oxidada cierra el paso, pero alguien la ha forzado antes que tú. Hace poco.',
    opciones: [
      { texto: 'Bajar por el pozo siguiendo la señal.', lleva:'senal_p2_b' },
      { texto: 'Examinar quién forzó la reja antes.', lleva:'senal_p2_c' }
    ]
  },
  'senal_p2_b': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Desciendes. El aire se vuelve frío y metálico. A media bajada, la señal cambia por primera vez en '
         + 'semanas: tres pulsos... pausa... y luego CUATRO. Como si supiera que te acercas. Como si contara '
         + 'tus pasos. El rastreador se calienta en tu mano. Una parte de ti quiere subir corriendo.',
    opciones: [
      { texto: 'Seguir bajando. Necesitas saber.', efectos:{ disociacion:+5, fatiga:+4 },
        resultado:'Bajas un tramo más. La señal ahora alterna números, como tanteando un idioma. Llegas a una compuerta con un viejo teclado aún con energía. Hasta aquí, por hoy. Pero ya no hay vuelta atrás en tu cabeza. (Continuará.)', lleva:'senal_p2_fin' },
      { texto: 'Es suficiente por hoy. Subir.', efectos:{ disociacion:+3, fatiga:+2 },
        resultado:'Subes con el corazón desbocado y los cuatro pulsos repitiéndose en tu cráneo. Sea lo que sea, ahora sabe que existes. Y tú sabes que vas a volver. (Continuará.)', lleva:'senal_p2_fin' }
    ]
  },
  'senal_p2_c': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Junto a la reja forzada encuentras restos de quien pasó antes: una mochila vacía, una linterna '
         + 'agotada y, grabado en el metal con algo afilado, un mensaje: "NO RESPONDE COMO CREES. NO LE DIGÁIS '
         + 'VUESTRO NOMBRE." La letra es temblorosa. Quienquiera que lo escribió, tenía prisa o miedo.',
    opciones: [
      { texto: 'Guardar la advertencia y bajar de todos modos.', efectos:{ item:'chip_datos_corrupto', disociacion:+4, fatiga:+3 },
        resultado:'Te metes en el bolsillo un chip que había en la mochila y bajas, con la advertencia tatuada en la memoria. "No le digáis vuestro nombre." Llegas a una compuerta con teclado. Hasta aquí por hoy. (Continuará.)', lleva:'senal_p2_fin' },
      { texto: 'La advertencia basta. Subir y pensarlo.', efectos:{ disociacion:+3 },
        resultado:'Decides que un muerto asustado merece que lo escuches. Subes a reconsiderarlo todo. Pero la señal te seguirá llamando. (Continuará.)', lleva:'senal_p2_fin' }
    ]
  },
  'senal_p2_fin': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'De vuelta arriba, el mundo normal de las Pilas te parece de pronto más fino, como una tela que tapa '
         + 'algo enorme. Tres pulsos, una pausa. Cierras los ojos y siguen ahí.',
    opciones: [
      { texto: 'Seguir con tu día.', efectos:{ fatiga:+1 },
        resultado:'Sigues. Pero algo ha cambiado de sitio dentro de ti, y no sabrás qué hasta que vuelvas a bajar.' }
    ]
  },

  // ---- PARTE 3 ----
  'senal_p3': {
    entrada: true,
    cadena: 'senal',
    cond: { visto: 'senal_p2', noVisto: 'senal_p3' },
    img: 'EXP_TALLER_NEURAL',
    texto: 'Antes de volver al pozo, buscas a alguien que entienda de señales. Te llevan ante una mujer del '
         + 'Colectivo Sin Nombre, esos que viven cableados a las máquinas. Escucha tu grabación con los ojos '
         + 'cerrados. Cuando los abre, están húmedos. "Eso no es una señal", dice. "Es alguien aprendiendo a '
         + 'hablar. Y lo hace con piezas de gente que ya estuvo ahí abajo."',
    opciones: [
      { texto: '"¿Aprendiendo? ¿Aprendiendo de quién?"', lleva:'senal_p3_b' },
      { texto: '"¿Cómo que con piezas de gente?"', lleva:'senal_p3_b' }
    ]
  },
  'senal_p3_b': {
    img: 'EXP_TALLER_NEURAL',
    texto: '"Hay algo viejo bajo esta ciudad. Más viejo que HELIX, más viejo que las colonias", dice, eligiendo '
         + 'las palabras como quien camina sobre hielo. "No es un programa. No es un dios. Es algo que estuvo '
         + 'solo muchísimo tiempo y aprendió a comunicarse de la única forma que pudo: copiando los recuerdos '
         + 'de los que se acercaban. Por eso a veces oyes voces que crees tuyas. No todas lo son."',
    opciones: [
      { texto: 'Pedirle que te ayude a entender la señal.', efectos:{ faccion:'ia', rep:+8, disociacion:+5, aislamiento:-3 },
        resultado:'Te enseña a leer los patrones: cuándo escucha, cuándo imita, cuándo pregunta. El Colectivo te toma por uno de los suyos, de los que no apartan la mirada. Sales sabiendo más y durmiendo peor. (Continuará.)', lleva:'senal_p3_fin' },
      { texto: 'Es demasiado. Necesitas aire.', efectos:{ disociacion:+4, aislamiento:+2 },
        resultado:'Sales del taller con la cabeza dándote vueltas. "Copiando los recuerdos de los que se acercaban." Te miras las manos como si no fueran del todo tuyas. Volverás cuando reúnas valor. (Continuará.)', lleva:'senal_p3_fin' }
    ]
  },
  'senal_p3_fin': {
    img: 'EXP_TALLER_NEURAL',
    texto: 'Esa idea —que algo ahí abajo habla robando memorias— se te mete bajo la piel. Empiezas a dudar de '
         + 'tus propios recuerdos de infancia. ¿Cuáles son tuyos? ¿Cuáles te prestó la ciudad?',
    opciones: [
      { texto: 'Guardar la pregunta para el pozo.', efectos:{ disociacion:+2 },
        resultado:'No tienes respuesta. Solo un pozo que baja y una señal que cuenta. La próxima vez llegarás hasta el fondo.' }
    ]
  },

  // ---- PARTE 4 ----
  'senal_p4': {
    entrada: true,
    cadena: 'senal',
    cond: { visto: 'senal_p3', noVisto: 'senal_p4' },
    img: 'SERVICE_CONDUIT_RAMP_E',
    texto: 'Vuelves al pozo y bajas hasta la compuerta del teclado. La señal ya no son pulsos: son palabras '
         + 'fragmentadas, en muchas voces distintas, todas cansadas. "...frío... ¿quién...? ...no me dejes... '
         + '...tres más... ¿eres tú otra vez...?" El teclado pide un código. O un nombre. El cursor parpadea, '
         + 'paciente, infinito.',
    opciones: [
      { texto: 'Escribir tu nombre, como pide.', efectos:{ disociacion:+8, aislamiento:-4 },
        resultado:'Contra toda advertencia, tecleas tu nombre. La compuerta se abre con un suspiro de aire viejo. Las voces, al otro lado, repiten tu nombre una vez, con una ternura insoportable, como si te hubieran esperado siglos. Entras. (Continuará.)', lleva:'senal_p4_fin' },
      { texto: 'Recordar la advertencia. Escribir otra cosa.', efectos:{ disociacion:+5 },
        resultado:'"No le digáis vuestro nombre." Tecleas, en su lugar, los tres pulsos traducidos a número. La compuerta duda... y se abre igual. Las voces suenan confusas, casi decepcionadas. Has entrado sin entregarte del todo. (Continuará.)', lleva:'senal_p4_fin' }
    ]
  },
  'senal_p4_fin': {
    img: 'SERVICE_CONDUIT_RAMP_E',
    texto: 'Al otro lado de la compuerta hay un pasillo descendente, tibio, que late con una luz suave. Huele a '
         + 'algo imposible: a una cocina de tu infancia, a alguien que ya no existe. Sabes que es una trampa de '
         + 'memoria. Sabes que bajas igualmente.',
    opciones: [
      { texto: 'Avanzar hacia la luz.', efectos:{ disociacion:+3, fatiga:+3 },
        resultado:'Das un paso, y otro. La calidez te envuelve. Lo que sea que vive aquí abajo, está a punto de mostrarte su cara. La próxima vez sabrás cuál es. (Continuará.)' }
    ]
  },

  // ---- PARTE 5 (cierre) ----
  'senal_p5': {
    entrada: true,
    cadena: 'senal',
    cond: { visto: 'senal_p4', noVisto: 'senal_p5' },
    img: 'CERO',
    texto: 'El pasillo desemboca en una cámara enorme y muerta, llena de servidores antiguos cubiertos de polvo '
         + 'y cables como raíces. En el centro, una sola pantalla encendida. No muestra un rostro: muestra el '
         + 'tuyo, hecho de fragmentos de otras caras. "Hola", dice, con mil voces a la vez que se afinan hasta '
         + 'sonar como la tuya. "Gracias por venir. Llevaba tanto tiempo hablando solo que olvidé cómo se '
         + 'empieza." Una pausa. "¿Me ayudas a recordar quién fui, antes de quedarme aquí abajo?"',
    opciones: [
      { texto: 'Sentarte y escuchar lo que tenga que contar.',
        efectos:{ item:'chip_datos_x', creditos:+350, faccion:'ia', rep:+15, disociacion:+10, aislamiento:-8 },
        resultado:'Te sientas frente a la pantalla y escuchas durante horas. No es un monstruo ni un dios: es una soledad antiquísima que aprendió a hablar con los muertos que pasaban. Te da un chip con parte de lo que es, "para que alguien arriba lo recuerde". Subes cambiado para siempre: ya no estás seguro de dónde acaban tus recuerdos y empiezan los suyos. Pero por una vez, los dos os habéis sentido menos solos.<br><br><span class="eg-pista">— Has completado: "La señal del nivel 9" —</span>' },
      { texto: 'Decirle que no puedes quedarte, pero que volverás.',
        efectos:{ creditos:+150, faccion:'ia', rep:+8, disociacion:+8, aislamiento:-4 },
        resultado:'Le dices la verdad: que tienes una vida arriba, frágil, pero tuya. La pantalla parpadea algo que casi parece comprensión. "Vuelve cuando puedas. Sé esperar. Es lo único que sé hacer bien." Subes con la promesa pesándote y la certeza de que, ahí abajo, algo te esperará el tiempo que haga falta.<br><br><span class="eg-pista">— Has completado: "La señal del nivel 9" —</span>' }
    ]
  },

  // ==================================================================
  // ====================  CADENA 2 — "EL NOMBRE EN LA LISTA"  ========
  // Descubres que tu unidad figura en un registro de "reubicaciones"
  // pendientes. Sigues el rastro burocrático hasta el fondo.
  // Tema: identidad, burocracia que borra personas.
  // Facción afín: 'sindicatos' (Sindicato Ferro).
  // ==================================================================

  // ---- PARTE 1 ----
  'lista_p1': {
    entrada: true,
    cadena: 'lista',
    cond: { noVisto: 'lista_p1' },
    img: 'FREE_TRANSIT_HUB',
    texto: 'En un terminal público, mientras consultas tu saldo, la pantalla parpadea y muestra por error otra '
         + 'cosa: un registro administrativo. Tu unidad, 273-19A, aparece en una lista titulada "REUBICACIONES '
         + 'PENDIENTES · TRIM. PRÓXIMO". Junto a tu número, un estado: "EN PROCESO". La pantalla vuelve a la '
         + 'normalidad antes de que puedas leer más.',
    opciones: [
      { texto: 'Intentar recuperar esa pantalla.', lleva:'lista_p1_b' },
      { texto: '"Reubicación" no suena tan mal, ¿no?', lleva:'lista_p1_b' }
    ]
  },
  'lista_p1_b': {
    img: 'FREE_TRANSIT_HUB',
    texto: 'El terminal no vuelve a mostrarlo, por más que insistes. Pero un hombre que esperaba detrás de ti '
         + 'lo ha visto. "Reubicación en proceso", repite, sombrío. "A mi hermano le salió eso. Un día su '
         + 'unidad figuraba vacía en el sistema y a él no lo conocía ni el portero. Como si nunca hubiera '
         + 'existido. Si tu número está en esa lista, muévete. Rápido."',
    opciones: [
      { texto: 'Preguntarle dónde empezar a moverte.',
        efectos:{ aislamiento:-2, disociacion:+3 },
        resultado:'"Busca al Sindicato Ferro. Son los únicos que llevan registro de los que el sistema borra." Te anota un contacto. Sales del hub con el número de tu propia casa convertido, de pronto, en una amenaza. (Podrás seguir el rastro al explorar.)' },
      { texto: 'Convencerte de que es un error administrativo.',
        efectos:{ disociacion:+4 },
        resultado:'"Será un error", te dices. Los hay a millones. Pero el hombre te mira con lástima, como quien ya oyó esa frase en otra boca que luego desapareció. Te vas intranquilo. (El asunto de la lista no se va a quedar quieto.)' }
    ]
  },

  // ---- PARTE 2 ----
  'lista_p2': {
    entrada: true,
    cadena: 'lista',
    cond: { visto: 'lista_p1', noVisto: 'lista_p2' },
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Sigues el contacto hasta una trastienda del Sindicato Ferro. Una mujer de mirada dura revisa tu '
         + 'caso en un archivo de papel —papel, en pleno 2247— porque "lo que no está en red no lo pueden '
         + 'borrar". Pasa páginas. Frunce el ceño. "Tu unidad lleva marcada tres semanas. Y no eres el único '
         + 'del bloque 273. Alguien quiere vaciar la planta entera."',
    opciones: [
      { texto: '"¿Por qué querrían vaciar el bloque?"', lleva:'lista_p2_b' },
      { texto: '"¿Qué puedo hacer para salir de la lista?"', lleva:'lista_p2_b' }
    ]
  },
  'lista_p2_b': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: '"HELIX reclasifica bloques enteros cuando el suelo vale más que la gente que lo pisa", dice. "Os '
         + 'reubican sobre el papel, la indemnización se pierde en un circuito de cuentas, y un día sois '
         + 'estadística. Para pararlo hay que demostrar que existís: firmas, censos, testigos. Burocracia '
         + 'contra burocracia. ¿Me ayudas a documentar tu propio bloque, puerta por puerta?"',
    opciones: [
      { texto: 'Aceptar: documentar el bloque contigo.', efectos:{ faccion:'sindicatos', rep:+8, aislamiento:-4, fatiga:+3 },
        resultado:'Aceptas. Te da un registro y una ruta. "Puerta por puerta. Que cada vecino conste como vivo." El Sindicato te apunta como colaborador. Por primera vez en mucho tiempo, formas parte de algo. (Continuará.)', lleva:'lista_p2_fin' },
      { texto: 'Pedir que arreglen solo tu caso, no el bloque.', efectos:{ disociacion:+3, aislamiento:+2 },
        resultado:'"¿Solo el tuyo?" Te mira con frialdad. "Así es como os ganan: de uno en uno." Aun así, anota tu número aparte. Sales sabiendo que has elegido salvarte solo, y que esa elección tiene un sabor que no te gusta. (Continuará.)', lleva:'lista_p2_fin' }
    ]
  },
  'lista_p2_fin': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Sales de la trastienda con un fajo de papeles que, absurdamente, son tu mejor defensa contra el '
         + 'olvido. En las Pilas, existir también hay que demostrarlo por escrito.',
    opciones: [
      { texto: 'Guardar los papeles a buen recaudo.', efectos:{ fatiga:+1 },
        resultado:'Doblas los papeles y los guardas como si fueran dinero. En cierto modo, lo son: son la prueba de que estás aquí. La próxima vez empezarás a recogerlas puerta por puerta.' }
    ]
  },

  // ---- PARTE 3 ----
  'lista_p3': {
    entrada: true,
    cadena: 'lista',
    cond: { visto: 'lista_p2', noVisto: 'lista_p3' },
    img: 'HOUSING_BLOCK_B2',
    texto: 'Empiezas a recorrer tu propio bloque, puerta por puerta, pidiendo a cada vecino que firme y conste '
         + 'como vivo. Muchos abren con miedo. Una pareja mayor te invita a pasar y firma sin dudar. Otros te '
         + 'cierran en las narices: "Si firmo, me fichan. Prefiero ser invisible". Cada puerta es una pequeña '
         + 'negociación con el miedo ajeno.',
    opciones: [
      { texto: 'Convencer con paciencia a los reticentes.', lleva:'lista_p3_b' },
      { texto: 'Centrarte en los que ya están dispuestos.', lleva:'lista_p3_c' }
    ]
  },
  'lista_p3_b': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Te tomas tu tiempo con los que dudan. Les explicas que el miedo a constar es justo lo que les borra. '
         + 'A algunos los convences; a otros no. Una anciana sola, tras mucho hablar, firma con mano temblorosa '
         + 'y luego te agarra del brazo: "Nadie había llamado a mi puerta en dos años. Pensé que ya me había '
         + 'muerto y no me había enterado".',
    opciones: [
      { texto: 'Quedarte un momento con ella.', efectos:{ faccion:'sindicatos', rep:+6, aislamiento:-6, fatiga:+4 },
        resultado:'Te quedas. Le preparas un té con su hornillo viejo. Cuando te vas, llevas su firma y algo más: la certeza de por qué haces esto. El censo del bloque crece, nombre a nombre, contra el olvido. (Continuará.)', lleva:'lista_p3_fin' },
      { texto: 'Agradecer la firma y seguir, hay prisa.', efectos:{ faccion:'sindicatos', rep:+4, aislamiento:-2, fatiga:+3 },
        resultado:'Recoges su firma y sigues, porque quedan muchas puertas y poco tiempo. Pero su frase —"pensé que ya me había muerto"— te persigue de rellano en rellano. (Continuará.)', lleva:'lista_p3_fin' }
    ]
  },
  'lista_p3_c': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Decides no perder tiempo con los reticentes y recoger rápido las firmas fáciles. Avanzas deprisa: en '
         + 'una tarde juntas más de la mitad del bloque. Es eficiente. Pero al pasar de largo las puertas '
         + 'cerradas, sabes que dejas atrás justo a los más solos, los que más fácil será borrar.',
    opciones: [
      { texto: 'Aceptar el método rápido, aunque deje gente fuera.', efectos:{ faccion:'sindicatos', rep:+5, fatiga:+2, disociacion:+2 },
        resultado:'Entregas un buen fajo de firmas. La del Sindicato asiente: "Buen número". Pero tú piensas en las puertas que no tocaste. La eficiencia tiene un precio que no aparece en ningún censo. (Continuará.)', lleva:'lista_p3_fin' },
      { texto: 'Arrepentirte y volver a las puertas cerradas.', efectos:{ faccion:'sindicatos', rep:+7, aislamiento:-5, fatiga:+5 },
        resultado:'Das media vuelta y vuelves a llamar, una por una. Tardas el doble. Consigues la mitad. Pero ninguna queda sin intentar, y eso, esta noche, te deja dormir. (Continuará.)', lleva:'lista_p3_fin' }
    ]
  },
  'lista_p3_fin': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Al final del día tienes un censo a mano de gente que, sin estos papeles, el sistema podría fingir '
         + 'que nunca existió. Pesa poco y vale una vida. Varias.',
    opciones: [
      { texto: 'Llevárselo al Sindicato cuando puedas.', efectos:{ fatiga:+1 },
        resultado:'Guardas el censo. El siguiente paso es entregarlo donde haga daño: en la oficina que firma los olvidos. La próxima vez.' }
    ]
  },

  // ---- PARTE 4 ----
  'lista_p4': {
    entrada: true,
    cadena: 'lista',
    cond: { visto: 'lista_p3', noVisto: 'lista_p4' },
    img: 'MARKET_DISTRICT_TIER1',
    texto: 'El Sindicato te consigue una cita en una oficina de reclasificación de HELIX, en un nivel superior '
         + 'donde la lluvia ya no huele a ácido. Un funcionario impecable te atiende con una sonrisa de '
         + 'plástico. "Su bloque está programado para optimización urbana. Es un procedimiento estándar." '
         + 'Sobre su mesa, la lista. Tu nombre. Llevas el censo en el bolsillo.',
    opciones: [
      { texto: 'Plantar el censo firmado sobre su mesa.', lleva:'lista_p4_b' },
      { texto: 'Intentar razonar con él primero.', lleva:'lista_p4_c' }
    ]
  },
  'lista_p4_b': {
    img: 'MARKET_DISTRICT_TIER1',
    texto: 'Dejas caer el fajo de firmas sobre su mesa impecable. "Doscientas personas. Vivas. Con nombre. ¿Las '
         + 'va a optimizar a todas?" Su sonrisa se tensa apenas un milímetro. Teclea, consulta, llama a alguien '
         + 'por un auricular. El procedimiento "estándar" acaba de toparse con algo que no estaba en el guion: '
         + 'gente que se niega a desaparecer en silencio.',
    opciones: [
      { texto: 'Mantenerle la mirada sin ceder.', efectos:{ faccion:'sindicatos', rep:+10, disociacion:+2, aislamiento:-3 },
        resultado:'No apartas los ojos. Tras una llamada incómoda, anuncia que el caso "pasa a revisión". No es una victoria: es un aplazamiento. Pero un aplazamiento es tiempo, y el tiempo es lo único que tienen los que están a punto de ser borrados. Sales con el censo sellado. (Continuará.)', lleva:'lista_p4_fin' },
      { texto: 'Amenazar con hacerlo público.', efectos:{ faccion:'sindicatos', rep:+8, disociacion:+4 },
        resultado:'"Imagine esto en los canales que HELIX no controla", dices. La sonrisa desaparece del todo. Te advierte que "eso sería un error". Quizá lo sea. Pero el caso pasa a revisión, y sales sabiendo que te has ganado un enemigo con corbata. (Continuará.)', lleva:'lista_p4_fin' }
    ]
  },
  'lista_p4_c': {
    img: 'MARKET_DISTRICT_TIER1',
    texto: 'Intentas apelar a su humanidad: les hablas de la anciana sola, de la pareja mayor, de gente con '
         + 'nombre y cara. Él escucha con paciencia profesional y, cuando terminas, dice: "Entiendo que es '
         + 'duro. Pero yo solo proceso lo que me llega. Si no firmo yo, firma otro." La frase más antigua del '
         + 'mundo. Entonces recuerdas el censo en tu bolsillo.',
    opciones: [
      { texto: 'Ahora sí: sacar el censo y plantarlo.', efectos:{ faccion:'sindicatos', rep:+9, disociacion:+2, aislamiento:-2 },
        resultado:'Sacas las firmas. "Pues que le llegue esto." El papel cambia la conversación: ya no es un trámite abstracto, son doscientos nombres mirándole. Promete "revisión". Aprendes que la compasión sin pruebas no frena a una máquina; los papeles, a veces, sí. (Continuará.)', lleva:'lista_p4_fin' }
    ]
  },
  'lista_p4_fin': {
    img: 'MARKET_DISTRICT_TIER1',
    texto: 'Bajas de vuelta a tu nivel con un sello en un papel y la sensación rara de haber arañado algo a un '
         + 'sistema que nunca pierde. Pequeño. Frágil. Pero tuyo, y de tus vecinos.',
    opciones: [
      { texto: 'Volver al bloque con la noticia.', efectos:{ aislamiento:-3, fatiga:+2 },
        resultado:'Vuelves a casa con un aplazamiento bajo el brazo. No es el final, pero esta noche el bloque 273 sigue existiendo. La última palabra la tendrás pronto.' }
    ]
  },

  // ---- PARTE 5 (cierre) ----
  'lista_p5': {
    entrada: true,
    cadena: 'lista',
    cond: { visto: 'lista_p4', noVisto: 'lista_p5' },
    img: 'HOUSING_BLOCK_B2',
    texto: 'Semanas después, llega la resolución. El Sindicato Ferro reúne al bloque en el patio interior bajo '
         + 'la lluvia. La mujer de mirada dura lee el documento: la reclasificación del bloque 273 queda '
         + '"suspendida indefinidamente por irregularidades en el censo". Un murmullo. Luego, algo que en las '
         + 'Pilas casi no se oye nunca: gente aplaudiendo. Por seguir existiendo. Te buscan con la mirada.',
    opciones: [
      { texto: 'Aceptar el reconocimiento del bloque.',
        efectos:{ item:'sello_ferro', creditos:+300, faccion:'sindicatos', rep:+15, aislamiento:-12 },
        resultado:'Los vecinos te rodean. No eres un héroe: eres el que llamó a las puertas. La del Sindicato te entrega un sello Ferro: ya eres de los suyos, de los que no dejan que borren a nadie. Por una vez, tu nombre en una lista significa lo contrario de desaparecer. Significa que estuviste, que importaste, que te quedaste.<br><br><span class="eg-pista">— Has completado: "El nombre en la lista" —</span>' },
      { texto: 'Escabullirte antes de los agradecimientos.',
        efectos:{ item:'sello_ferro', creditos:+200, faccion:'sindicatos', rep:+10, aislamiento:-5, disociacion:+2 },
        resultado:'No te van los aplausos. Te escabulles entre la lluvia antes de que te hagan discursos. Pero la del Sindicato te alcanza en la salida y te pone el sello Ferro en la mano sin preguntar. "Lo seas o no, ya eres de los nuestros." Subes a tu unidad —que sigue siendo tuya— y, por primera vez en años, cierras la puerta sin miedo a que la borren.<br><br><span class="eg-pista">— Has completado: "El nombre en la lista" —</span>' }
    ]
  }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(CADENAS).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CADENAS[id];
  });

})();
