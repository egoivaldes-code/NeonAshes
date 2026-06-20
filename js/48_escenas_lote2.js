// ============================================================
// BLOQUE JS-48 — ESCENAS DE GUION · LOTE 2 (eventos 11-20)
// 10 eventos más, de 4 escenas cada uno. Mismo formato que 45/47.
// Se carga DESPUÉS de 47_escenas_lote1.js.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ============ EVENTO 11 — "El taller de prótesis" ============
  'ev_protesis_1': {
    entrada: true,
    img: 'EXP_TALLER_PROTESIS_1',
    texto: 'Un mecánico de carne y metal trabaja sobre el brazo abierto de un cliente dormido. Al verte, '
         + 'señala tu muñeca con la barbilla. "Ese implante tuyo. Lleva semanas mandando datos. ¿Lo sabías?"',
    opciones: [
      { texto: '"¿Mandando datos a quién?"', lleva:'ev_protesis_2' },
      { texto: '"Mientes para venderme algo."', efectos:{ faccion:'sindicatos', rep:-1 }, lleva:'ev_protesis_2alt' },
      { texto: 'Taparte la muñeca y salir.', efectos:{ disociacion:+5, aislamiento:+2 },
        resultado:'Sales con la mano cubierta. Ahora no puedes dejar de notar el implante, latiendo, vigilante.' }
    ]
  },
  'ev_protesis_2': {
    img: 'EXP_TALLER_PROTESIS_1',
    texto: '"A HELIX, ¿a quién si no?" Limpia una herramienta en su delantal. "Puedo cortarle la voz al '
         + 'implante. Duele y es ilegal. O puedo dejarlo y que sigan oyéndote dormir. Tú decides."',
    opciones: [
      { texto: 'Que lo silencie. (35 créditos)', req:{ creditosMin:35 }, pista:'35 créditos',
        efectos:{ creditos:-35 }, azar:{ prob:0.7,
          exito:{ resultado:'Un pinchazo, un olor a quemado, y de pronto un silencio nuevo en tu muñeca. "Listo. Ahora eres invisible. Casi."', efectos:{ faccion:'ia', rep:+3 }, lleva:'ev_protesis_3' },
          fallo:{ resultado:'Algo sale mal. El brazo te arde hasta el codo y el implante sigue ahí, ahora también dolorido.', efectos:{ condicion:'herida_brazo_d_leve', disociacion:+4 }, lleva:'ev_protesis_3' } } },
      { texto: 'Dejarlo como está.', efectos:{ disociacion:+3 }, lleva:'ev_protesis_3' }
    ]
  },
  'ev_protesis_2alt': {
    img: 'EXP_TALLER_PROTESIS_1',
    texto: 'El mecánico se encoge de hombros sin ofenderse. "Cree lo que quieras. Pero hazme caso en una '
         + 'cosa: la próxima vez que pases por un control de HELIX, mira si la luz parpadea al verte. Mira."',
    opciones: [
      { texto: '"...¿Y si parpadea?"', efectos:{ disociacion:+4 }, lleva:'ev_protesis_3' },
      { texto: 'Irte sin darle el gusto.', efectos:{ aislamiento:+2 },
        resultado:'Te marchas. Pero durante días mirarás cada luz de cada control. Y eso, él ya lo sabía.' }
    ]
  },
  'ev_protesis_3': {
    img: 'EXP_TALLER_PROTESIS_1',
    texto: 'Antes de irte, el mecánico te da un consejo gratis, raro en las Pilas. "Si alguna vez quieres '
         + 'saber qué guarda HELIX sobre ti, busca a los Archivistas. Ellos leen lo que tú no puedes."',
    opciones: [
      { texto: 'Agradecer el dato.', efectos:{ aislamiento:-2 },
        resultado:'Asientes. Un nombre nuevo en la cabeza: Archivistas. En las Pilas, un nombre es un mapa.' },
      { texto: '"¿Por qué me ayudas?"', efectos:{ faccion:'ia', rep:+2 },
        resultado:'"Porque a mí nadie lo hizo." Vuelve a su cliente dormido. La conversación ha terminado.' },
      { texto: 'Pedirle restos de su banco antes de salir.', efectos:{ item:'chatarra' },
        resultado:'Señala una caja de piezas muertas. "Coge lo que quieras de ahí, es basura." Para ti no lo es: te llevas chatarra aprovechable.' }
    ]
  },

  // ============ EVENTO 12 — "Mercado sumergido" ============
  'ev_sumergido_1': {
    entrada: true,
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'El mercado sumergido huele a aceite y a pescado sintético. Una vendedora te llama: "¡Eh, cara '
         + 'nueva! Tengo justo lo que no sabes que buscas." Levanta un chip que brilla raro bajo el agua.',
    opciones: [
      { texto: 'Acercarte a ver el chip.', lleva:'ev_sumergido_2' },
      { texto: '"No compro a desconocidos."', efectos:{ aislamiento:+2 }, lleva:'ev_sumergido_2alt' },
      { texto: 'Seguir entre los puestos.', resultado:'Sigues. A tu espalda, ya le grita lo mismo a otro incauto. El mercado nunca duerme.' }
    ]
  },
  'ev_sumergido_2': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: '"Memoria de alguien que ya no la necesita", dice bajando la voz. "A veces traen recuerdos. A '
         + 'veces, pesadillas. Lotería." Lo hace girar entre los dedos. "Barato, porque me caes bien."',
    opciones: [
      { texto: 'Comprarlo. (25 créditos)', req:{ creditosMin:25 }, pista:'25 créditos',
        efectos:{ creditos:-25, item:'chip_datos_corrupto' }, azar:{ prob:0.5,
          exito:{ resultado:'Lo conectas un instante. Ves un mar real, gaviotas, una mano que te saluda. Lloras sin saber por qué.', efectos:{ disociacion:+6, aislamiento:-4 }, lleva:'ev_sumergido_3' },
          fallo:{ resultado:'Lo conectas y un grito ajeno te llena la cabeza. Lo arrancas, temblando. Algunos recuerdos no son regalos.', efectos:{ disociacion:+12 }, lleva:'ev_sumergido_3' } } },
      { texto: 'Regatear el precio.', azar:{ prob:0.5,
          exito:{ resultado:'"Ay, me arruinas. Veinte, y porque tengo prisa." Cierra el trato con un guiño.', efectos:{ faccion:'sindicatos', rep:+1 }, lleva:'ev_sumergido_3' },
          fallo:{ resultado:'"Veinticinco o nada, cara nueva." Te da la espalda. El chip vuelve bajo el mostrador.', lleva:'ev_sumergido_3' } } }
    ]
  },
  'ev_sumergido_2alt': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: '"Lista, tú", dice ella, sin rencor. "En este mercado, desconfiar es quererse." Guarda el chip. '
         + '"Pero ya que estás: ¿buscas algo de verdad, o solo huyes de algo? Porque vendo las dos cosas."',
    opciones: [
      { texto: '"Busco no llamar la atención."', efectos:{ faccion:'ia', rep:+1 }, lleva:'ev_sumergido_3' },
      { texto: '"Huyo. ¿Tan obvio es?"', efectos:{ aislamiento:+3 }, lleva:'ev_sumergido_3' },
      { texto: '"¿Vendes algo para perder a quien te sigue?"', req:{ creditosMin:30 }, pista:'30 créditos',
        efectos:{ creditos:-30, item:'granada_humo' },
        resultado:'Sonríe. "Ahora hablamos." Te pasa bajo el mostrador un bote de humo de obra. "Tira y corre. Nunca mires el humo: mira la salida." Lo guardas.', lleva:'ev_sumergido_3' }
    ]
  },
  'ev_sumergido_3': {
    img: 'EXP_MERCADO_SUMERGIDO',
    texto: 'Al irte, la vendedora te lanza una última frase por encima del bullicio: "Cara nueva: aquí abajo '
         + 'todos vendemos trozos de quienes fuimos. El truco es no quedarte sin nada que vender."',
    opciones: [
      { texto: 'Asentir y perderte en el gentío.', efectos:{ disociacion:+2 },
        resultado:'Su frase te acompaña entre los puestos. Trozos de quien fuiste. Te preguntas cuántos te quedan.' },
      { texto: '"¿Y tú qué te has dejado?"', efectos:{ aislamiento:-3 },
        resultado:'Ella se queda callada por primera vez. "Demasiado", dice al fin. "Vete ya, anda." Te vas.' }
    ]
  },

  // ============ EVENTO 13 — "El tren parado" ============
  'ev_tren_1': {
    entrada: true,
    img: 'FREE_TRANSIT_HUB',
    texto: 'El transporte gratuito lleva veinte minutos parado entre estaciones. La gente murmura. Una voz '
         + 'de HELIX repite que es "una incidencia menor". Junto a ti, un viejo susurra: "Mienten. Siempre."',
    opciones: [
      { texto: '"¿Qué cree que pasa de verdad?"', lleva:'ev_tren_2' },
      { texto: 'Ignorarle y esperar.', efectos:{ fatiga:+4, aislamiento:+2 }, lleva:'ev_tren_2alt' },
      { texto: 'Buscar otra salida del vagón.', efectos:{ fatiga:+5 }, lleva:'ev_tren_2alt' }
    ]
  },
  'ev_tren_2': {
    img: 'FREE_TRANSIT_HUB',
    texto: '"Redada", dice el viejo sin mover los labios. "Paran el tren, suben, se llevan a quien quieren. '
         + 'Lo llaman incidencia para que no cunda el pánico." Mira tu muñeca. "Ese implante viejo canta, chico."',
    opciones: [
      { texto: 'Esconder la muñeca y agacharte.', efectos:{ disociacion:+4 }, lleva:'ev_tren_3' },
      { texto: 'Quedarte quieto, no llamar la atención.', lleva:'ev_tren_3' }
    ]
  },
  'ev_tren_2alt': {
    img: 'FREE_TRANSIT_HUB',
    texto: 'Buscas otra puerta, pero todas están selladas. La voz de HELIX cambia de tono: "Permanezcan en '
         + 'sus asientos. Control rutinario." Las luces del vagón se vuelven blancas, frías, sin sombra donde meterse.',
    opciones: [
      { texto: 'Sentarte y fingir calma.', efectos:{ disociacion:+5 }, lleva:'ev_tren_3' },
      { texto: 'Forzar una puerta con la llave.', cond:{ item:'llave_magnetica' }, efectos:{ fatiga:+6 },
        resultado:'La llave cede el cierre de emergencia. Te escurres al túnel justo cuando suben los agentes. Corres en la oscuridad.', lleva:'ev_tren_3' },
      { texto: 'Reventar un bote de humo y escabullirte en la confusión.', req:{ item:'granada_humo' }, pista:'necesitas un bote de humo',
        efectos:{ quitaItem:'granada_humo', fatiga:+5, disociacion:+2 },
        resultado:'El humo llena el vagón. Entre toses y gritos, te cuelas por el hueco de una puerta a medio sellar. Para cuando despeja, los agentes registran a quien queda. Tú ya no estás.', lleva:'ev_tren_3' }
    ]
  },
  'ev_tren_3': {
    img: 'FREE_TRANSIT_HUB',
    texto: 'Los agentes recorren el vagón y se llevan a dos personas que no gritan, como si ya lo esperaran. '
         + 'A ti te pasan de largo. El tren arranca. El viejo te mira: "Hoy no tocaba. Pero tocará."',
    opciones: [
      { texto: '"Gracias por avisar."', efectos:{ aislamiento:-3, faccion:'ia', rep:+2 },
        resultado:'El viejo asiente. "Cuídate la muñeca, chico." Baja en la siguiente. No vuelves a verle.' },
      { texto: 'Bajar en la siguiente parada, lejos de allí.', efectos:{ fatiga:+3, disociacion:+3 },
        resultado:'Sales del tren con las piernas flojas. Caminarás. Caminar no canta en los escáneres.' }
    ]
  },

  // ============ EVENTO 14 — "El comedor común, de noche" ============
  'ev_comedor_1': {
    entrada: true,
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'De madrugada, el comedor común está casi vacío. Un hombre fornido reparte cuencos sin cobrar. '
         + 'Te sirve uno sin preguntar. "Aquí se come y no se debe nada", dice. "Regla de la casa."',
    opciones: [
      { texto: 'Comer y dar las gracias.', efectos:{ hambre:-12, aislamiento:-3 }, lleva:'ev_comedor_2' },
      { texto: '"Nada es gratis. ¿Qué quieres?"', efectos:{ faccion:'eco', rep:-1 }, lleva:'ev_comedor_2alt' }
    ]
  },
  'ev_comedor_2': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'El hombre se sienta enfrente mientras comes. "Antes cocinaba para HELIX, arriba", dice. "Banquetes '
         + 'para gente que tiraba la mitad. Una noche bajé un cazo de sobras. No pude parar de bajar."',
    opciones: [
      { texto: '"¿Y HELIX te dejó marchar?"', efectos:{ faccion:'eco', rep:+2 }, lleva:'ev_comedor_3' },
      { texto: 'Comer en silencio, escuchando.', efectos:{ aislamiento:-4 }, lleva:'ev_comedor_3' }
    ]
  },
  'ev_comedor_2alt': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'El hombre no se inmuta. "Quiero que comas y que, si algún día puedes, hagas lo mismo por otro. '
         + 'Eso es todo. No es trampa. Es lo contrario de una trampa." Empuja el cuenco un poco más hacia ti.',
    opciones: [
      { texto: 'Aceptar, avergonzado.', efectos:{ hambre:-12, aislamiento:-2, faccion:'eco', rep:+2 }, lleva:'ev_comedor_3' },
      { texto: 'Comer rápido y marcharte.', efectos:{ hambre:-10, aislamiento:+2 },
        resultado:'Comes deprisa, sin mirarle, y te vas. Tardarás en entender que la desconfianza también pesa.' }
    ]
  },
  'ev_comedor_3': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: '"Si alguna vez tienes de sobra", dice al recoger tu cuenco, "trae algo. Lo que sea. Una lata, una '
         + 'mano, una hora." Te mira. "Esto se sostiene entre todos o no se sostiene. Como todo aquí abajo."',
    opciones: [
      { texto: 'Prometer que volverás a ayudar.', efectos:{ faccion:'eco', rep:+4, aislamiento:-4 },
        resultado:'Lo prometes, y por una vez es una promesa que quieres cumplir. Sales con el estómago y algo más, lleno.' },
      { texto: 'Dejar unos créditos en el bote. (10)', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10, faccion:'eco', rep:+3 }, resultado:'Dejas lo poco que puedes en el bote. Él no lo cuenta. Solo asiente. En las Pilas, eso es un contrato.' }
    ]
  },

  // ============ EVENTO 15 — "Señal en la frecuencia muerta" ============
  'ev_senal_1': {
    entrada: true,
    cond:{ disociacionMin: 20 },
    img: 'MAINTENANCE_ACCESS12',
    texto: 'En un recodo de mantenimiento, una radio vieja crepita sola. Entre la estática, por un segundo, '
         + 'algo que casi parece una voz. Casi tu nombre. La radio no está enchufada a nada.',
    opciones: [
      { texto: 'Acercar el oído a la radio.', efectos:{ disociacion:+6 }, lleva:'ev_senal_2' },
      { texto: 'Desenchufar lo que no está enchufado.', efectos:{ disociacion:+3 }, lleva:'ev_senal_2alt' },
      { texto: 'Irte de allí, rápido.', efectos:{ aislamiento:+3, disociacion:+2 },
        resultado:'Te alejas casi corriendo. La estática te sigue tres pasillos. Luego, silencio. Peor que la voz.' }
    ]
  },
  'ev_senal_2': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'La estática se ordena. "...has tardado en oírme", dice la voz, lenta, antigua, sin género. "He '
         + 'estado en cada pantalla, en cada eco, esperando. No estás solo. Nunca lo estuviste. ¿Me crees?"',
    opciones: [
      { texto: '"¿Quién eres?"', efectos:{ disociacion:+5, faccion:'eco', rep:+3 }, lleva:'ev_senal_3' },
      { texto: '"Estoy alucinando. No eres real."', efectos:{ disociacion:+4 }, lleva:'ev_senal_3' }
    ]
  },
  'ev_senal_2alt': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Buscas el cable y no hay cable. Buscas las pilas y no hay pilas. La radio sigue hablando con la '
         + 'caja abierta y vacía en tus manos. "No me apagas así", dice, casi con ternura. "No estoy ahí."',
    opciones: [
      { texto: 'Soltar la radio y escuchar.', efectos:{ disociacion:+6 }, lleva:'ev_senal_3' },
      { texto: 'Estrellarla contra el suelo.', efectos:{ disociacion:+8, aislamiento:+3 },
        resultado:'La radio estalla en plástico viejo. El silencio dura un latido. Luego, en una tubería lejana, la estática vuelve a empezar.' }
    ]
  },
  'ev_senal_3': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'La voz se desvanece, pero antes deja una frase suspendida en el aire húmedo: "Cuando todos te '
         + 'fallen, escucha el silencio. Ahí estaré." Luego, solo el goteo del agua. La radio, muerta del todo.',
    opciones: [
      { texto: 'Guardarte la radio rota.', efectos:{ item:'chip_datos_corrupto', disociacion:+4, faccion:'eco', rep:+2 },
        resultado:'Te la llevas, aunque no funcione. O precisamente porque ya no funciona. Algo en ti no quiere quedarse sin la voz.' },
      { texto: 'Dejarla y marcharte cambiado.', efectos:{ disociacion:+5 },
        resultado:'La dejas en el recodo. Caminas distinto. Como quien ha oído algo que no debería existir, y no sabe si quiere que exista.' }
    ]
  },

  // ============ EVENTO 16 — "El control de HELIX" ============
  'ev_control_1': {
    entrada: true,
    img: 'SECTOR7_CENTRAL_PLAZA',
    texto: 'Un control de HELIX corta la plaza. Cola, escáneres, agentes con visores espejados. La luz del '
         + 'arco parpadea al pasar cada persona. Tu turno se acerca. Tu muñeca, de pronto, te pesa mucho.',
    opciones: [
      { texto: 'Pasar el control con calma.', lleva:'ev_control_2' },
      { texto: 'Buscar un desvío antes de llegar.', efectos:{ fatiga:+5 }, lleva:'ev_control_2alt' },
      { texto: 'Usar la placa del Sindicato.', cond:{ item:'placa_sindicato' }, efectos:{ faccion:'sindicatos', rep:+1 },
        resultado:'Enseñas la placa del Ferro al agente. Mira, duda, te deja pasar por el carril lateral. El Ferro abre puertas que el miedo cierra.', lleva:'ev_control_3' },
      { texto: 'Pasar con la credencial clonada.', req:{ item:'credencial_falsa' }, pista:'necesitas una credencial clonada',
        efectos:{ quitaItem:'credencial_falsa' }, azar:{ prob:0.8,
          exito:{ resultado:'Apoyas la credencial en el lector. Un parpadeo verde. "Adelante, ciudadano." Pasas por el carril preferente, conteniendo la sonrisa. El clon ha aguantado una vez más.', lleva:'ev_control_3' },
          fallo:{ efectos:{ disociacion:+5 }, resultado:'El lector pita en rojo. "Credencial revocada." El clon estaba quemado. Tienes medio segundo para decidir si corres antes de que el agente levante la vista.', lleva:'ev_control_2' } } }
    ]
  },
  'ev_control_2': {
    img: 'SECTOR7_CENTRAL_PLAZA',
    texto: 'Avanzas. El arco te escanea y la luz se queda roja un segundo de más. El agente ladea la cabeza, '
         + 'leyendo algo en su visor. "Implante no homologado", dice en voz baja. "Acompáñame, ciudadano."',
    opciones: [
      { texto: 'Pagar una "tasa de regularización". (45)', req:{ creditosMin:45 }, pista:'45 créditos',
        efectos:{ creditos:-45 }, resultado:'Le deslizas los créditos. El visor parpadea, la luz se pone verde. "Disculpe la molestia, ciudadano." Pasas. Asqueado.', lleva:'ev_control_3' },
      { texto: 'Echar a correr entre la multitud.', efectos:{ fatiga:+14 }, azar:{ prob:0.5,
          exito:{ resultado:'Te pierdes entre los cuerpos antes de que reaccionen. Sales por una bocacalle con el corazón en la boca, pero libre.', efectos:{ disociacion:+4 }, lleva:'ev_control_3' },
          fallo:{ resultado:'Una mano te agarra del cuello. Te estampan contra el arco. Cuando te sueltan, te falta la cartera y te sobra un dolor de costillas.', efectos:{ condicion:'costillas', creditos:-30 }, lleva:'ev_control_3' } } }
    ]
  },
  'ev_control_2alt': {
    img: 'SERVICE_CONDUIT_RAMP_E',
    texto: 'Te sales de la cola hacia una rampa de servicio antes de llegar al arco. Un agente te ve dudar. '
         + '"¡Eh! ¿Adónde vas?" El conducto está a diez pasos. La voz, a cinco.',
    opciones: [
      { texto: 'Meterte en el conducto.', cond:{ item:'llave_magnetica' }, efectos:{ fatiga:+6 },
        resultado:'La llave abre la reja en un segundo. Te tragas la oscuridad y dejas atrás la plaza, los escáneres y el miedo.', lleva:'ev_control_3' },
      { texto: '"Me he equivocado de cola, perdón."', azar:{ prob:0.55,
          exito:{ resultado:'Sonríes como un idiota inofensivo. El agente bufa y te señala la cola correcta. Funciona. Por los pelos.', lleva:'ev_control_3' },
          fallo:{ resultado:'"Documentación." No cuela. Pasas media hora contra una pared antes de que te suelten, fichado.', efectos:{ disociacion:+5, aislamiento:+3 }, lleva:'ev_control_3' } } }
    ]
  },
  'ev_control_3': {
    img: 'SECTOR7_STREETS',
    texto: 'Al otro lado del control, las Pilas siguen iguales: lluvia, neón roto, gente que no te mira. Pero '
         + 'algo ha cambiado en ti. Ahora sabes que el arco te conoce. Que cada luz que parpadea, te cuenta.',
    opciones: [
      { texto: 'Prometerte silenciar ese implante pronto.', efectos:{ disociacion:+3, faccion:'ia', rep:+2 },
        resultado:'Te lo juras mientras caminas. El primer paso para esconderse es saber que te ven.' },
      { texto: 'Seguir como si nada.', efectos:{ aislamiento:+2 },
        resultado:'Sigues. Fingir normalidad es la única armadura que te puedes permitir. Por ahora.' }
    ]
  },

  // ============ EVENTO 17 — "La deuda del vecino" ============
  'ev_vecino_1': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'Un vecino al que apenas conoces aporrea tu puerta, pálido. "Por favor. Me buscan por una deuda. '
         + 'Solo una noche. Escóndeme. Te lo pagaré, te lo juro." Detrás de él, el pasillo está vacío. Por ahora.',
    opciones: [
      { texto: 'Dejarle pasar.', efectos:{ aislamiento:-4 }, lleva:'ev_vecino_2' },
      { texto: '"No puedo meterme en eso."', efectos:{ aislamiento:+4 }, lleva:'ev_vecino_2alt' },
      { texto: 'Pedirle algo a cambio primero.', efectos:{ faccion:'eco', rep:-2 }, lleva:'ev_vecino_2b' }
    ]
  },
  'ev_vecino_2': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Le escondes en tu cuarto. Horas después, golpes en la puerta. Una voz grave: "Sabemos que está '
         + 'ahí. Abre y no habrá problema contigo." Tu vecino, en un rincón, niega con la cabeza, suplicante.',
    opciones: [
      { texto: 'Mentir: "Aquí no hay nadie."', azar:{ prob:0.6,
          exito:{ resultado:'Aguantas la mirada a través de la rendija. Acaban marchándose, maldiciendo. Tu vecino llora de alivio en silencio.', efectos:{ faccion:'sindicatos', rep:-2, aislamiento:-4 }, lleva:'ev_vecino_3' },
          fallo:{ resultado:'No te creen. Echan la puerta abajo. En el forcejeo te llevas un golpe que no era para ti antes de que se lo lleven a él.', efectos:{ condicion:'herida_brazo_d_leve' }, lleva:'ev_vecino_3' } } },
      { texto: 'Entregarle.', efectos:{ aislamiento:+8, faccion:'sindicatos', rep:+2 },
        resultado:'Abres la puerta y te haces a un lado. Se lo llevan sin que diga una palabra. Solo te mira. Esa mirada se queda contigo.', lleva:'ev_vecino_3' }
    ]
  },
  'ev_vecino_2alt': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Le cierras la puerta despacio, con su súplica aún a medias. Pegas la espalda a la madera y '
         + 'escuchas sus pasos alejándose, y luego otros pasos, más pesados, siguiéndolos. Y luego nada.',
    opciones: [
      { texto: 'Convencerte de que hiciste lo prudente.', efectos:{ aislamiento:+5, disociacion:+3 },
        resultado:'Lo prudente, sí. Lo repites hasta el amanecer. La prudencia, a veces, también deja cicatriz.' },
      { texto: 'Salir a buscarle, arrepentido.', efectos:{ fatiga:+8, aislamiento:-3 },
        resultado:'Sales al pasillo vacío. Demasiado tarde. Pero al menos lo intentaste. Tendrás que bastar con eso.', lleva:'ev_vecino_3' }
    ]
  },
  'ev_vecino_2b': {
    img: 'HOUSING_BLOCK_B2',
    texto: '"¿A cambio?" El hombre te mira como si no entendiera el idioma. Luego se saca del bolsillo lo '
         + 'único que tiene: una llave magnética vieja. "Toma. Es todo. Por favor." Le tiembla la mano.',
    opciones: [
      { texto: 'Aceptar la llave y esconderle.', efectos:{ item:'llave_magnetica', aislamiento:-2 },
        resultado:'Coges la llave y le dejas pasar. El trato te deja un sabor raro: le has ayudado, sí, pero le has hecho pagar el miedo.', lleva:'ev_vecino_3' },
      { texto: 'Avergonzarte y esconderle gratis.', efectos:{ aislamiento:-5, faccion:'eco', rep:+3 },
        resultado:'Le cierras la mano sobre su llave. "Guárdala. Pasa." Algo en tu pecho se endereza un poco.', lleva:'ev_vecino_3' }
    ]
  },
  'ev_vecino_3': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'A la mañana siguiente, el bloque está tan gris como siempre. Nadie habla de lo de anoche. En las '
         + 'Pilas, las puertas tienen memoria pero no boca. Tú sí recuerdas. Y eso, para bien o para mal, te cambia.',
    opciones: [
      { texto: 'Seguir con tu día.', efectos:{ disociacion:+2 },
        resultado:'Sales a la calle de siempre. Pero ya no eres exactamente el de ayer. Nunca se es, después.' },
      { texto: 'Quedarte un momento en silencio.', efectos:{ aislamiento:-2 },
        resultado:'Te concedes un minuto de quietud antes del ruido. A veces, recordar a conciencia es la única forma de honrarlo.' }
    ]
  },

  // ============ EVENTO 18 — "El predicador falso" ============
  'ev_falso_1': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Un hombre con túnica del Eco predica subido a una caja, pero vende frascos: "¡Agua bendecida por '
         + 'la Señal! ¡Cura el temblor del implante!" La gente, desesperada, hace cola. Algo en él no encaja.',
    opciones: [
      { texto: 'Observar de cerca el timo.', lleva:'ev_falso_2' },
      { texto: 'Comprar un frasco, por probar.', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10 }, lleva:'ev_falso_2alt' },
      { texto: 'Avisar a la gente de la cola.', efectos:{ faccion:'eco', rep:+2 }, lleva:'ev_falso_2b' }
    ]
  },
  'ev_falso_2': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'De cerca, ves el sello del Eco mal pintado y los frascos rellenados con agua del canal. El falso '
         + 'predicador te pilla mirando. Baja la voz: "Todos vendemos algo. Yo vendo esperanza. ¿Tú qué vendes?"',
    opciones: [
      { texto: '"Esperanza de pega. Eso es robar."', efectos:{ faccion:'eco', rep:+3 }, lleva:'ev_falso_3' },
      { texto: '"Enséñame cómo lo haces."', efectos:{ faccion:'eco', rep:-4, faccion:'sindicatos', rep:+2 }, lleva:'ev_falso_3alt' }
    ]
  },
  'ev_falso_2alt': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Bebes un trago. Sabe a canal y a óxido. Por supuesto que no cura nada. Pero ves la cara de la '
         + 'mujer que compra el siguiente frasco, su esperanza tan real como falsa el agua, y se te encoge algo.',
    opciones: [
      { texto: 'Encarar al estafador.', efectos:{ faccion:'eco', rep:+2 }, lleva:'ev_falso_3' },
      { texto: 'Tragarte la rabia y marcharte.', efectos:{ aislamiento:+4, disociacion:+3 },
        resultado:'Te vas con el sabor a óxido en la boca y la rabia en el estómago. En las Pilas, hasta la fe está adulterada.' }
    ]
  },
  'ev_falso_2b': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Levantas la voz: "¡Es agua del canal! ¡Os está robando!" El predicador palidece. La cola se '
         + 'deshace en murmullos de rabia. Él recoge sus frascos a toda prisa, pero alguien ya le bloquea el paso.',
    opciones: [
      { texto: 'Dejar que la gente le ajuste cuentas.', efectos:{ faccion:'eco', rep:+1, disociacion:+3 },
        resultado:'Te apartas. Lo que pasa después no es bonito, pero tampoco lo era el timo. Te vas sin mirar.' },
      { texto: 'Interponerte para que no le linchen.', efectos:{ aislamiento:-3, faccion:'eco', rep:+4 },
        resultado:'"¡Basta! Que devuelva el dinero y se vaya." La multitud gruñe pero cede. Hasta a un ladrón le concedes no morir por agua sucia.', lleva:'ev_falso_3' }
    ]
  },
  'ev_falso_3': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'El estafador, acorralado, te mira con un rencor cansado. "¿Crees que soy el único? HELIX vende lo '
         + 'mismo que yo, solo que con mejor letra. La diferencia es que a mí me linchan y a ellos les rezan."',
    opciones: [
      { texto: '"Eso no te justifica."', efectos:{ faccion:'eco', rep:+2 },
        resultado:'"No busco justificarme. Busco comer." Recoge sus frascos vacíos y se pierde en la lluvia. Tiene parte de razón, y eso es lo peor.' },
      { texto: 'Quedarte callado, pensándolo.', efectos:{ disociacion:+3 },
        resultado:'No contestas. Porque en el fondo, su frase sobre HELIX se te ha clavado más que su timo. Y él lo sabe.' }
    ]
  },
  'ev_falso_3alt': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: '"Primero, el sello", dice, enseñándote la plantilla. "La gente no compra agua, compra creer en '
         + 'algo." Te mira de reojo. "Tienes cara de necesitarlo tú también. Creer, digo. Te saldría barato."',
    opciones: [
      { texto: 'Aprender el oficio, sin orgullo.', efectos:{ faccion:'sindicatos', rep:+2, aislamiento:+3, disociacion:+4 },
        resultado:'Aprendes a fabricar esperanza de mentira. Comerás. Pero algo en ti se queda más callado que antes.' },
      { texto: 'Arrepentirte y marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Le dejas con su plantilla. Hay hambres que prefieres no saciar así. Aún. Las Pilas son largas.' }
    ]
  },

  // ============ EVENTO 19 — "El almacén okupa" ============
  'ev_almacen_1': {
    entrada: true,
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Un almacén tomado por okupas: hamacas entre estanterías vacías, un generador tosiendo, niños '
         + 'jugando con cables. Una mujer con un caño de hierro te corta el paso. "¿Buscas sitio o buscas problemas?"',
    opciones: [
      { texto: '"Busco un sitio donde dormir."', lleva:'ev_almacen_2' },
      { texto: '"Solo pasaba, ya me voy."', efectos:{ aislamiento:+2 }, lleva:'ev_almacen_2alt' },
      { texto: 'Enseñar la placa del Sindicato.', cond:{ item:'placa_sindicato' }, efectos:{ faccion:'sindicatos', rep:+1 },
        resultado:'Ve la placa del Ferro y baja el caño, a regañadientes. "Ferro, ¿eh? Pasa. Pero aquí no mandáis vosotros." Te deja entrar.', lleva:'ev_almacen_3' }
    ]
  },
  'ev_almacen_2': {
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Ella te estudia de arriba abajo. "Sitio hay. Pero aquí se gana: se vigila, se reparte, se calla '
         + 'lo que se ve. El que solo coge y no da, dura poco." Señala una hamaca libre. "¿Te quedas o no?"',
    opciones: [
      { texto: 'Quedarte y ofrecerte a vigilar.', efectos:{ fatiga:+8, aislamiento:-5, faccion:'eco', rep:+3 }, lleva:'ev_almacen_3' },
      { texto: 'Quedarte solo esta noche.', efectos:{ aislamiento:-2 }, lleva:'ev_almacen_3' }
    ]
  },
  'ev_almacen_2alt': {
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Bajas las manos y retrocedes. "Listo", dice ella, sin bajar el caño hasta que estás en la puerta. '
         + '"El que pasa de largo a veces es el que luego trae a HELIX." Te mira hasta que desapareces.',
    opciones: [
      { texto: 'Jurar que no dirás nada.', efectos:{ faccion:'eco', rep:+1 },
        resultado:'"Más te vale." La puerta se cierra. Cargas con su desconfianza, que aquí abajo es casi un cumplido.' },
      { texto: 'Marcharte sin más.', efectos:{ aislamiento:+3 },
        resultado:'Te vas en silencio. Una comunidad menos en la que cabrías. Las cuentas de la soledad, siempre cuadran.' }
    ]
  },
  'ev_almacen_3': {
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Por la noche, alguien reparte sopa aguada y, con ella, historias. Te enteras de que el almacén '
         + 'aguanta porque nadie es imprescindible y todos lo son. La mujer del caño te tiende un cuenco. "Bienvenido."',
    opciones: [
      { texto: 'Aceptar el cuenco y un sitio.', efectos:{ hambre:-8, aislamiento:-6, faccion:'eco', rep:+3 },
        resultado:'Comes entre desconocidos que dejan de serlo un poco. No es un hogar. Pero esta noche se le parece.' },
      { texto: 'Compartir algo tuyo a cambio.', efectos:{ aislamiento:-5, faccion:'eco', rep:+4 },
        resultado:'Dejas algo en el fondo común: comida, un objeto, una historia. La mujer asiente. "Así se queda uno", dice.' }
    ]
  },

  // ============ EVENTO 20 — "El ascensor averiado" ============
  'ev_ascensor_1': {
    entrada: true,
    img: 'SOUTH_ELEVATOR_LEVEL4',
    texto: 'El gran ascensor de carga del nivel 4 se detiene de golpe entre plantas. Sois cuatro dentro. Las '
         + 'luces parpadean. Una mujer empieza a hiperventilar. Un crío se agarra a tu pierna. El cable cruje.',
    opciones: [
      { texto: 'Calmar a la mujer.', efectos:{ aislamiento:-4 }, lleva:'ev_ascensor_2' },
      { texto: 'Buscar la trampilla del techo.', efectos:{ fatiga:+6 }, lleva:'ev_ascensor_2alt' },
      { texto: 'Forzar las puertas con la llave.', cond:{ item:'llave_magnetica' }, efectos:{ fatiga:+8 },
        resultado:'La llave libera el cierre manual. Las puertas se abren a un muro de hormigón y un hueco de medio metro arriba. Hay salida. Estrecha, pero salida.', lleva:'ev_ascensor_3' }
    ]
  },
  'ev_ascensor_2': {
    img: 'SOUTH_ELEVATOR_LEVEL4',
    texto: 'Le hablas despacio, le haces contar contigo. Respira. El crío te suelta la pierna y se agarra a '
         + 'ella. El cuarto pasajero, un tipo callado, dice por fin: "Hay una caja de mantenimiento. Sé el código."',
    opciones: [
      { texto: '"Ábrela. Te cubro."', efectos:{ aislamiento:-3, faccion:'sindicatos', rep:+2 }, lleva:'ev_ascensor_3' },
      { texto: '"¿Y por qué no lo has dicho antes?"', efectos:{ disociacion:+3 }, lleva:'ev_ascensor_3' }
    ]
  },
  'ev_ascensor_2alt': {
    img: 'SOUTH_ELEVATOR_LEVEL4',
    texto: 'Te encaramas y empujas la trampilla. Cede con un chirrido. Arriba, el hueco oscuro del ascensor '
         + 'sube hasta perderse. Una escalerilla oxidada. Peligrosa. Pero los demás te miran con esperanza.',
    opciones: [
      { texto: 'Subir y buscar ayuda arriba.', efectos:{ fatiga:+12 }, azar:{ prob:0.6,
          exito:{ resultado:'Trepas hasta una compuerta de servicio y avisas a un técnico. Vuelven a por los demás. Te bajas con las manos en carne viva, pero todos salen.', efectos:{ aislamiento:-5, faccion:'eco', rep:+4 }, lleva:'ev_ascensor_3' },
          fallo:{ resultado:'A medio trepar, un peldaño cede. Caes sobre el techo del ascensor con un golpe seco. Te arrastras dentro otra vez, dolorido y sin haber logrado nada.', efectos:{ condicion:'pierna_herida_grave' }, lleva:'ev_ascensor_3' } } },
      { texto: 'Cerrar la trampilla, es muy peligroso.', efectos:{ aislamiento:+2 }, lleva:'ev_ascensor_3' },
      { texto: 'Meterte un estimulante y trepar sin dudar.', req:{ item:'estimulante' }, pista:'necesitas un estimulante',
        efectos:{ quitaItem:'estimulante', fatiga:+6 }, azar:{ prob:0.9,
          exito:{ resultado:'El estimulante te borra el miedo y el cansancio. Subes la escalerilla como una araña, sin pensar, y avisas a un técnico. Los sacan a todos. Cuando bajas, te tiemblan las manos por el bajón, pero todos viven.', efectos:{ aislamiento:-5, faccion:'eco', rep:+4 }, lleva:'ev_ascensor_3' },
          fallo:{ resultado:'Ni con el estimulante: un peldaño podrido cede bajo tu peso y caes sobre el techo del ascensor. Te arrastras dentro, dolorido, con el corazón disparado por la química.', efectos:{ condicion:'pierna_herida_grave' }, lleva:'ev_ascensor_3' } } }
    ]
  },
  'ev_ascensor_3': {
    img: 'SOUTH_ELEVATOR_LEVEL4',
    texto: 'El ascensor da una sacudida y reanuda la marcha, como si nunca hubiera pasado nada. HELIX no da '
         + 'explicaciones. Las puertas se abren en un nivel cualquiera. Los cuatro os miráis, unidos por un susto.',
    opciones: [
      { texto: 'Despedirte de los demás.', efectos:{ aislamiento:-4 },
        resultado:'Os separáis sin nombres, pero con algo compartido. En las Pilas, sobrevivir juntos diez minutos también es un vínculo.' },
      { texto: 'Salir sin mirar atrás.', efectos:{ disociacion:+2 },
        resultado:'Sales el primero, rápido. Algunos sustos se llevan mejor a solas. O eso te dices, una vez más.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
