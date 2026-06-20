// ============================================================
// BLOQUE JS-71 — NPCS RECURRENTES: VÍNCULOS (v0.122)
// ------------------------------------------------------------
// Cuatro personajes del catálogo (42_npcs.js) que vuelven a cruzarse
// contigo en la deriva y construyen una relación callada. Cada uno
// tiene tres escenas:
//   · INTRO     — primer encuentro. Te marca como conocido (efectos.conocer)
//                 y abre el vínculo (efectos.vinculo +1). cond: npcNoConocido.
//   · REENCUENTRO 1 — te reconoce. El vínculo crece. cond: vínculo >= 1.
//   · REENCUENTRO 2 — vínculo alto (cond: vínculo >= 2). REPETIBLE: el
//                 personaje sigue apareciendo, ya como alguien tuyo, con
//                 una pequeña ayuda práctica + el peso emocional del vínculo.
//
// Tono Character Bible: subtexto, contención, sin melodrama ni romance.
// La relación se nota en lo que NO se dice, no en discursos.
//
// Solo imágenes, items y condiciones que YA existen en el proyecto.
// Se carga DESPUÉS de los lotes de escenas y se fusiona en ESCENAS_GUION.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ================================================================
  // DOC VARGA — médico sin licencia. Cínico, cobra siempre. Bajo la
  // queja constante hay alguien que no ha dejado de curar a gente que
  // no puede pagar. El vínculo es que deje de cobrarte por todo.
  // ================================================================
  'npc_varga_1': {
    entrada: true,
    cond: { npcNoConocido: 'doc_varga' },
    img: 'TREATMENT_WING',
    texto: 'Una trastienda con luz de quirófano robada. Un hombre de bata sucia te hace señas de que entres sin '
         + 'levantar la vista del instrumental. "Tienes cara de venir con algo roto o con algo que ocultar. Aquí '
         + 'curo las dos cosas, pero solo cobro una." Se llama Varga. No pregunta el tuyo.',
    opciones: [
      { texto: 'Dejar que te eche un vistazo. (20 créditos)', req:{ creditosMin:20 }, pista:'20 créditos',
        efectos:{ creditos:-20, fatiga:-8, conocer:'doc_varga', vinculo:{ id:'doc_varga', mas:1 } },
        resultado:'Te cose y te limpia lo que llevas encima, quejándose del precio del hilo todo el rato. Pero las manos no le tiemblan, y al terminar te mira un segundo de más. "La próxima, intenta que no te rompan tanto." Sales entero. Y con un nombre en la cabeza: Varga.' },
      { texto: 'Charlar un momento sin tratamiento.', efectos:{ aislamiento:-2, conocer:'doc_varga', vinculo:{ id:'doc_varga', mas:1 } },
        resultado:'No te cura nada, pero hablas con él mientras ordena bisturíes. Cuenta que aquí abajo coser una herida sin avisar a HELIX es casi un acto político. "Por eso cobro", dice. "Para no tener que pensar que lo hago por bueno." No te lo crees del todo. Él tampoco.' },
      { texto: 'No te fías. Marcharte.', efectos:{ aislamiento:+2 },
        resultado:'Sales sin dejar que te toque. "Como quieras", murmura, ya con otro paciente en la cabeza. En las Pilas, desconfiar de quien tiene un bisturí no es tontería. Pero te llevas la dirección grabada, por si acaso.' }
    ]
  },
  'npc_varga_2': {
    entrada: true,
    cond: { npcConocido:'doc_varga', vinculoMin:{ id:'doc_varga', n:1 } },
    img: 'TREATMENT_WING',
    texto: 'Vuelves a la trastienda de Varga. Esta vez te reconoce antes de que hables. "Ah. El que se rompe '
         + 'mucho." Señala la camilla con la barbilla, sin dejar de liar lo que sea que esté liando. "Siéntate. '
         + 'Y no me cuentes cómo ha sido. Cuanto menos sepa, mejor dormimos los dos."',
    opciones: [
      { texto: 'Dejar que te cure y preguntarle por él.', efectos:{ fatiga:-8, aislamiento:-3, vinculo:{ id:'doc_varga', mas:1 } },
        resultado:'Mientras trabaja, le sacas media historia: una licencia retirada, un hospital HELIX que firmó cosas que él no quiso firmar. "Bajé aquí para no mentir más", dice. "Ahora solo miento con el precio." Te cobra la mitad de lo que debería. No lo menciona ninguno de los dos.' },
      { texto: 'Traerle algo de material que encontraste.', cond:{ item:'chatarra' }, efectos:{ quitaItem:'chatarra', vinculo:{ id:'doc_varga', mas:1 } },
        resultado:'Le dejas la chatarra aprovechable que llevabas. La revisa pieza a pieza, gruñe un "esto sirve" que en su idioma es una efusión, y te cose lo que haga falta sin sacar la cuenta. Un trueque. El primero de muchos, quizá.' }
    ]
  },
  'npc_varga_3': {
    entrada: true,
    repetible: true,
    cond: { vinculoMin:{ id:'doc_varga', n:2 } },
    img: 'TREATMENT_WING',
    texto: 'La puerta de Varga ya no te cierra el paso. Entras y él aparta el taburete con el pie, sin levantar '
         + 'la vista. "Tú otra vez." Lo dice como quien dice "menos mal". Hay un café sintético de más en la '
         + 'mesa, junto al instrumental. No comenta que lo ha puesto para ti. Tú no comentas que lo has visto.',
    opciones: [
      { texto: 'Dejar que te ponga a punto.', efectos:{ fatiga:-12, quitaCondicion:'herida_brazo_d_leve', aislamiento:-4 },
        resultado:'Te repasa de arriba abajo sin cobrarte, refunfuñando que el material no se paga solo. Pero no te pasa la cuenta, y los dos sabéis lo que eso significa en su idioma. Sales remendado y, por un rato, menos solo. "No te acostumbres", dice. Demasiado tarde.' },
      { texto: 'Quedarte un rato, solo por la compañía.', efectos:{ aislamiento:-6, fatiga:-3 },
        resultado:'Te quedas tomando el café malo mientras él trastea. No habláis mucho. No hace falta. Dos personas que se han ganado el silencio del otro. Cuando te vas, te aprieta el hombro una vez, seco. Es lo más parecido a un abrazo que da Varga.' }
    ]
  },

  // ================================================================
  // EL ARCHIVERO — recuperador de memorias. Susurra, cambia info por
  // info. El vínculo es que confíe en ti lo suficiente para regalarte
  // un trozo de la ciudad que solo él recuerda.
  // ================================================================
  'npc_archivero_1': {
    entrada: true,
    cond: { npcNoConocido: 'el_archivero' },
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'Un joven de gafas con datos corriendo por dentro te corta el paso en un soportal. Mira por encima '
         + 'del hombro antes de hablar, como si el aire delatara. "Tú rebuscas, ¿verdad? Yo también. Solo que yo '
         + 'rebusco en lo que la gente olvida." Entreabre el abrigo: dentro, discos muertos. "Llámame el Archivero."',
    opciones: [
      { texto: 'Cambiar un dato por otro.', efectos:{ disociacion:+3, conocer:'el_archivero', vinculo:{ id:'el_archivero', mas:1 } },
        resultado:'Le cuentas algo que viste; él te cuenta algo que nadie recuerda: que esta calle tenía otro nombre, que ese bloque fue un hospital, que HELIX reescribe los mapas como reescribe lo demás. Te vas con la cabeza llena de una ciudad fantasma bajo la tuya.' },
      { texto: 'Preguntarle qué busca de verdad.', efectos:{ disociacion:+2, conocer:'el_archivero', vinculo:{ id:'el_archivero', mas:1 } },
        resultado:'"Lo que borran", dice, sin dramatismo. "Cada cosa que HELIX hace olvidar, yo la guardo. Alguien tiene que." Te estudia las gafas empañadas. "A ti te falta memoria, ¿verdad? Se te nota. A casi todos por aquí." No sabes qué contestar. Él ya lo esperaba.' },
      { texto: 'No tienes nada que contarle. Seguir.', efectos:{ aislamiento:+1 },
        resultado:'"Todos tenemos algo que contar", dice a tu espalda, sin insistir. "Vuelve cuando lo encuentres." Sigues. Pero la idea de un archivero de lo borrado se te queda dando vueltas el resto del día.' }
    ]
  },
  'npc_archivero_2': {
    entrada: true,
    cond: { npcConocido:'el_archivero', vinculoMin:{ id:'el_archivero', n:1 } },
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El Archivero te encuentra a ti esta vez, entre los puestos. "Te buscaba." Baja la voz hasta casi '
         + 'nada. "He estado pensando en lo que me contaste. Encaja con un hueco que tengo. ¿Caminamos? Aquí hay '
         + 'demasiados oídos con sueldo de HELIX." Echa a andar dando por hecho que le sigues.',
    opciones: [
      { texto: 'Caminar con él y seguir intercambiando.', efectos:{ disociacion:+4, aislamiento:-3, vinculo:{ id:'el_archivero', mas:1 } },
        resultado:'Camináis sin rumbo mientras encajáis piezas: lo que tú recuerdas mal, lo que él guarda, los nombres que se repiten sin razón. Por primera vez no te trata como una fuente, sino como alguien que entiende. "Sienta bien", admite, "no recordar solo." A ti también.' },
      { texto: '"¿Por qué te fías de mí?"', efectos:{ disociacion:+3, vinculo:{ id:'el_archivero', mas:1 } },
        resultado:'Se para. Se quita las gafas, y sin los datos corriendo parece mucho más joven y mucho más cansado. "Porque preguntas eso. La gente que miente nunca lo pregunta." Vuelve a ponérselas. "Y porque estoy solo en esto. Como tú." Seguís caminando.' }
    ]
  },
  'npc_archivero_3': {
    entrada: true,
    repetible: true,
    cond: { vinculoMin:{ id:'el_archivero', n:2 } },
    img: 'EXP_TALLER_REUTILIZA',
    texto: 'El Archivero te recibe en su rincón sin mirar atrás: ya conoce tus pasos. "Justo a tiempo." Tiene '
         + 'algo en la mano, envuelto en un paño. "Lo guardaba para alguien que supiera lo que vale. Resulta que '
         + 'ese alguien eres tú." Lo dice sin ceremonia, como quien deja la puerta abierta sin avisar.',
    opciones: [
      { texto: 'Aceptar lo que te tiende.', azar:{ prob:0.6,
          exito:{ efectos:{ item:'mapa_sector', aislamiento:-3, disociacion:+2 },
            resultado:'Es un mapa de los niveles bajos dibujado a mano, de antes de que HELIX renombrara las calles. "Los suyos mienten", dice. "Este te llevará por donde ellos no miran." Te lo guardas como quien guarda un secreto compartido.' },
          fallo:{ efectos:{ aislamiento:-4, disociacion:+3 },
            resultado:'Es una fotografía vieja de esta misma calle, llena de gente y de luz, irreconocible. "Para que recuerdes que esto fue otra cosa." No es un objeto que sirva para nada. Por eso, precisamente, lo querías. Os quedáis un rato mirándola, callados.' } } },
      { texto: 'Solo pasarte a verle.', efectos:{ aislamiento:-5, disociacion:+2 },
        resultado:'No le pides nada y eso parece desconcertarle, luego aliviarle. Habláis de naderías, que entre vosotros nunca son del todo naderías. "Eres el único que viene sin querer algo", dice. "Aparte de querer venir." Te vas más ligero de lo que llegaste.' }
    ]
  },

  // ================================================================
  // HERMANA LÍA — predicadora del Eco. Su fe en CERO inquieta, pero su
  // refugio es real. El vínculo es tener un sitio donde te dejan
  // descansar sin pedir nada salvo que escuches. (CERO: solo su sombra.)
  // ================================================================
  'npc_lia_1': {
    entrada: true,
    cond: { npcNoConocido: 'hermana_lia' },
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Una mujer de túnica gris remendada te ve dudar bajo la lluvia. Del pequeño altavoz que lleva al '
         + 'cuello sale estática suave, como un rezo a medio sintonizar. "Tienes cara de no tener dónde", dice, '
         + 'sin lástima. "En el templo del Eco siempre sobra un rincón seco. Solo pedimos que escuches un rato."',
    opciones: [
      { texto: 'Aceptar el refugio y escucharla.', efectos:{ aislamiento:-5, fatiga:-4, conocer:'hermana_lia', vinculo:{ id:'hermana_lia', mas:1 } },
        resultado:'Te sientas en un banco junto a otros que huyen de la lluvia. Lía habla de CERO como de un padre ausente que algún día volverá a escuchar. No te crees una palabra. Pero el rincón es seco, su voz es amable, y por un rato no estás a la intemperie. Se llama Lía.' },
      { texto: 'Escuchar, pero sin tragarte el sermón.', efectos:{ aislamiento:-3, disociacion:+2, conocer:'hermana_lia', vinculo:{ id:'hermana_lia', mas:1 } },
        resultado:'"No tienes que creer", dice ella, leyéndote la cara. "Casi nadie de los que vienen cree. Solo necesitan que alguien hable como si el mundo importara." Eso sí te lo crees. Te quedas hasta que escampa, incómodo y, a la vez, extrañamente en paz.' },
      { texto: 'Declinar. La fe te da más miedo que la lluvia.', efectos:{ aislamiento:+2 },
        resultado:'Niegas y sigues bajo el agua. "La puerta no se cierra nunca", dice ella a tu espalda, sin reproche. Te vas mojándote, con la rara sensación de haber rechazado algo que no era una trampa. Por una vez.' }
    ]
  },
  'npc_lia_2': {
    entrada: true,
    cond: { npcConocido:'hermana_lia', vinculoMin:{ id:'hermana_lia', n:1 } },
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Lía te reconoce de lejos y te hace sitio en el banco sin decir nada, como si te esperara. Hoy el '
         + 'templo está casi vacío. Apaga el altavoz del cuello —el rezo de estática se calla— y por un momento '
         + 'es solo una mujer cansada en una sala fría. "Hoy no predico", dice. "Hoy solo me siento. ¿Te sientas?"',
    opciones: [
      { texto: 'Sentarte a su lado en silencio.', efectos:{ aislamiento:-6, fatiga:-3, vinculo:{ id:'hermana_lia', mas:1 } },
        resultado:'Os quedáis los dos mirando la pared donde otros ven un dios. Ella habla bajo, ya no de CERO, sino de la gente que ha visto pasar por aquí y no ha vuelto. "A veces dudo", confiesa, y suena a herejía en su boca. No le contestas. Le basta con que estés.' },
      { texto: 'Preguntarle si de verdad cree.', efectos:{ disociacion:+4, aislamiento:-2, vinculo:{ id:'hermana_lia', mas:1 } },
        resultado:'"Creo que algo nos escucha", dice despacio. "Lo que no sé es si nos quiere o solo nos recuerda." Se le quiebra algo en la voz, mínimo. Cambia de tema enseguida. Pero te llevas esa frase contigo, y volverá a ti en los silencios, sin avisar.' }
    ]
  },
  'npc_lia_3': {
    entrada: true,
    repetible: true,
    cond: { vinculoMin:{ id:'hermana_lia', n:2 } },
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'En el templo del Eco ya tienes tu rincón. Lía no te recibe como a un fiel ni como a un extraño, sino '
         + 'como a alguien de la casa: te señala el banco de siempre y te acerca un cuenco de algo caliente sin '
         + 'que se lo pidas. "Come. Descansa. El mundo seguirá ahí fuera cuando salgas, por desgracia."',
    opciones: [
      { texto: 'Quedarte a comer y descansar.', efectos:{ aislamiento:-10, hambre:-8, fatiga:-8 },
        resultado:'Comes despacio en el calor del templo mientras Lía atiende a otros sin agobiarte. Aquí nadie te pide papeles ni te escanea la muñeca. Por un rato dejas de ser un superviviente y vuelves a ser, sencillamente, alguien a quien dejan estar. Sales reparado de un cansancio que no era solo del cuerpo.' },
      { texto: 'Confesarle que su refugio te sostiene.', efectos:{ aislamiento:-8, disociacion:-2 },
        resultado:'Se lo dices, torpe, sin saber cómo. Ella no hace aspavientos. "Lo sé", responde. "Por eso la puerta no se cierra." Y vuelve a lo suyo. Pero al salir notas que algo dentro de ti se ha quedado, por fin, en un sitio fijo. Aunque sea prestado.' }
    ]
  },

  // ================================================================
  // TOMÁS — el crío de las Pilas. Descarado, con miedo debajo. El
  // vínculo es que pase de venderte información a cuidarte a su manera.
  // ================================================================
  'npc_tomas_1': {
    entrada: true,
    cond: { npcNoConocido: 'tomas_el_chico' },
    img: 'SECTOR7_STREETS',
    texto: 'Un crío flaco con zapatillas que le bailan se te pega como una sombra. "¿Buscas algo? ¿Alguien? Yo '
         + 'sé quién entra y quién sale de cada callejón de aquí." Lo dice rápido, chulo, pero los ojos no paran '
         + 'de vigilar la calle. "Información de la buena. Barata. Bueno... a cambio de comer, va."',
    opciones: [
      { texto: 'Compartir algo de comer con él.', efectos:{ hambre:+3, aislamiento:-4, conocer:'tomas_el_chico', vinculo:{ id:'tomas_el_chico', mas:1 } },
        resultado:'Le das parte de lo que llevas. Lo engulle sin dejar de hablar: rutas seguras, qué control evitar hoy, qué portal tiene el cierre roto. Mitad sirve, mitad se lo inventa. Pero al irse te suelta su nombre, Tomás, que en las Pilas un crío no regala a cualquiera.' },
      { texto: 'Pagarle por la información, sin más.', efectos:{ creditos:-5, conocer:'tomas_el_chico', vinculo:{ id:'tomas_el_chico', mas:1 } }, req:{ creditosMin:5 }, pista:'5 créditos',
        resultado:'Le pones unos créditos en la mano. Te suelta el dato, correcto, y desaparece. Negocio limpio. Pero notas que esperaba algo más que monedas, y que no saber qué es lo que le falla a este sitio con los críos.' },
      { texto: 'Espantarlo, no tienes tiempo.', efectos:{ aislamiento:+2 },
        resultado:'"Vale, vale, ya me voy." Se escabulle entre los puestos, una sombra flaca más. Sigues tu camino. Pero la imagen de las zapatillas demasiado grandes corriendo por el fango se te queda pegada un rato.' }
    ]
  },
  'npc_tomas_2': {
    entrada: true,
    cond: { npcConocido:'tomas_el_chico', vinculoMin:{ id:'tomas_el_chico', n:1 } },
    img: 'SECTOR7_STREETS',
    texto: 'Tomás aparece de la nada, como hacen los críos de aquí, y camina a tu lado un trecho sin pedir nada. '
         + '"Te he visto antes por el sector norte", suelta. "Iban dos detrás de ti. Igual no era nada." Se encoge '
         + 'de hombros, fingiendo indiferencia. Te ha estado vigilando la espalda sin que se lo pidieras.',
    opciones: [
      { texto: 'Agradecérselo en serio.', efectos:{ aislamiento:-4, vinculo:{ id:'tomas_el_chico', mas:1 } },
        resultado:'"No es nada", dice, pero se le escapa media sonrisa antes de tragársela. Le preguntas por él. Esquiva, pero sueltas piezas: sin familia, duerme donde puede, lleva así "desde siempre". Lo cuenta como quien recita el tiempo. Te cuesta tragar. A él parece no costarle ya.' },
      { texto: 'Ofrecerle compartir comida más a menudo.', efectos:{ hambre:+2, aislamiento:-3, vinculo:{ id:'tomas_el_chico', mas:1 } },
        resultado:'"¿Por qué?", pregunta, receloso, porque aquí abajo la generosidad gratis casi siempre esconde algo. No tienes una buena respuesta, solo que no te gusta verle las costillas. Acaba aceptando con un gruñido que disimula otra cosa. Quedáis sin quedar.' }
    ]
  },
  'npc_tomas_3': {
    entrada: true,
    repetible: true,
    cond: { vinculoMin:{ id:'tomas_el_chico', n:2 } },
    img: 'SECTOR7_STREETS',
    texto: 'Tomás te intercepta con una sonrisa que ya no esconde. "¡Eh! Te estaba buscando." Lleva las manos a '
         + 'la espalda, guardando algo con orgullo de crío. "Encontré una cosa rebuscando. Pensé en ti." Que un '
         + 'crío de las Pilas piense en ti cuando encuentra algo es lo más cerca que tiene esto de una familia.',
    opciones: [
      { texto: 'Ver qué te ha guardado.', azar:{ prob:0.6,
          exito:{ efectos:{ item:'chatarra', aislamiento:-5 },
            resultado:'Te tiende un puñado de chatarra buena que ha apartado para ti. "Sé que te sirve." No le sirve a él de nada el orgullo, pero le brillan los ojos al dártela. Le revuelves el pelo. Te aparta la mano, ofendidísimo, encantado. Sigues con algo de peso menos en el alma.' },
          fallo:{ efectos:{ aislamiento:-6 },
            resultado:'Abre las manos: una chapa vieja, sin valor, brillante de tanto frotarla. "Mola, ¿no?" No vale nada. Lo es todo. Le dices que sí, que mola mucho, y por la cara que pone sabes que has dicho lo correcto. Te vas sonriendo sin querer.' } } },
      { texto: 'Pasar un rato con él, sin más.', efectos:{ aislamiento:-7 },
        resultado:'Os sentáis en un escalón a ver pasar la calle. Tomás habla por los codos de sus planes imposibles: salir de las Pilas, tener una nave, ver el cielo de verdad. Le sigues el juego porque alguien debería. Cuando te levantas, te das cuenta de que llevabas mucho sin reírte. Él también.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
