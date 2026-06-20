// ============================================================
// BLOQUE JS-47 — ESCENAS DE GUION · LOTE 1 (eventos de 4 escenas)
// ------------------------------------------------------------
// 20 eventos escritos a mano, cada uno de 4 escenas (1 entrada + 3
// internas con ramas). Se fusionan en ESCENAS_GUION (45). Mismo
// formato y mismas reglas que 45_escenas_datos.js.
//
// Facciones: 'sindicatos' (Ferro), 'eco' (Iglesia del Eco),
//            'ia' (Autónomas), 'archivistas'.
// Este archivo se carga DESPUÉS de 45_escenas_datos.js.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ============ EVENTO 1 — "El vigilante del canal" ============
  'ev_canal_1': {
    entrada: true,
    img: 'EXP_CANAL_PILAS',
    texto: 'Un dron de HELIX flota sobre el canal, inmóvil, con el foco apagado. Bajo él, un hombre '
         + 'con mono de mantenimiento te hace un gesto mínimo: que no te acerques. Demasiado tarde, '
         + 'el foco se enciende y te encuentra a ti.',
    opciones: [
      { texto: 'Quedarte quieto y dejar que te escanee.', lleva: 'ev_canal_2a' },
      { texto: 'Meterte bajo la pasarela.', efectos:{ fatiga:+6 }, lleva: 'ev_canal_2b' },
      { texto: 'Reventar un bote de humo y desaparecer en él.', req:{ item:'granada_humo' }, pista:'necesitas un bote de humo',
        efectos:{ quitaItem:'granada_humo', fatiga:+4 }, resultado:'El humo se traga el foco y a ti con él. Para cuando se disipa, el dron busca a alguien que ya no está.', lleva:'ev_canal_2b' },
      { texto: 'Saludar al dron como si nada.', efectos:{ disociacion:+3 }, lleva: 'ev_canal_2b' }
    ]
  },
  'ev_canal_2a': {
    img: 'EXP_CANAL_PILAS',
    texto: 'El haz te recorre de arriba abajo. Una voz sin cuerpo recita tu número de residente y una '
         + 'deuda médica que no recordabas tener. El dron espera una respuesta que no sabes dar.',
    opciones: [
      { texto: 'Pagar la tasa de paso. (30 créditos)', req:{ creditosMin:30 }, pista:'30 créditos',
        efectos:{ creditos:-30 }, resultado:'El dron se apaga y se aleja. Has comprado un silencio que durará lo que dure el turno de alguien.', lleva:'ev_canal_3' },
      { texto: 'Decir que se han equivocado de persona.', efectos:{ aislamiento:+4 },
        resultado:'"Discrepancia registrada", dice la voz. Eso nunca es bueno. El dron te fotografía otra vez antes de irse.', lleva:'ev_canal_3' }
    ]
  },
  'ev_canal_2b': {
    img: 'EXP_CANAL_PILAS',
    texto: 'El foco barre el agua donde estabas y no te encuentra. El hombre del mono se acerca, '
         + 'empapado. "A mí también me buscan", dice. "Pero yo sé por dónde no miran."',
    opciones: [
      { texto: 'Seguirle.', lleva:'ev_canal_3' },
      { texto: 'Desconfiar y marcharte solo.', efectos:{ aislamiento:+4 },
        resultado:'Te alejas por donde viniste. A tu espalda, el foco vuelve a encenderse. No miras.' }
    ]
  },
  'ev_canal_3': {
    img: 'EXP_PLANTA_AGUA',
    texto: 'Acabas en la sala de bombas, entre el rugido del agua reciclada. El hombre te tiende una '
         + 'tarjeta de mantenimiento. "Abre puertas que HELIX cree cerradas. Yo ya no la necesito."',
    opciones: [
      { texto: 'Aceptar la tarjeta.', efectos:{ item:'llave_magnetica', faccion:'sindicatos', rep:+3 },
        resultado:'La guardas. Pesa como una promesa o como una trampa; aún no sabes cuál.' },
      { texto: 'Preguntar por qué te ayuda.', efectos:{ aislamiento:-3 },
        resultado:'"Porque alguien lo hizo por mí, una vez." Se va antes de que puedas dar las gracias.' },
      { texto: 'Rebuscar entre los restos de la sala de bombas.', efectos:{ item:'chatarra', fatiga:+3 },
        resultado:'Entre tubería muerta sacas un puñado de chatarra aprovechable. El hombre finge no verte hacerlo.' }
    ]
  },

  // ============ EVENTO 2 — "La predicadora del Eco" ============
  'ev_eco_1': {
    entrada: true,
    img: 'EXP_SANTUARIO_ECO',
    texto: 'En una esquina del santuario, una mujer mayor habla a tres personas y a nadie. "El Eco no '
         + 'es un dios", dice. "Es lo que quedó cuando los dioses callaron." Te mira como si te esperara.',
    opciones: [
      { texto: 'Escuchar lo que dice.', lleva:'ev_eco_2' },
      { texto: '"Eso son cuentos."', efectos:{ faccion:'eco', rep:-2 }, lleva:'ev_eco_2alt' },
      { texto: 'Dejar una moneda y seguir.', req:{ creditosMin:5 }, pista:'5 créditos',
        efectos:{ creditos:-5, faccion:'eco', rep:+2 }, resultado:'Ella inclina la cabeza. "El Eco recuerda a quien recuerda."' }
    ]
  },
  'ev_eco_2': {
    img: 'EXP_SANTUARIO_ECO',
    texto: '"Hubo una señal", susurra. "Hace mucho, algo respondió desde el vacío. HELIX la enterró. '
         + 'Pero los que escuchan de noche, en las frecuencias muertas, aún la oyen." Te ofrece unos auriculares viejos.',
    opciones: [
      { texto: 'Ponerte los auriculares.', efectos:{ disociacion:+8 }, lleva:'ev_eco_3' },
      { texto: 'Rechazarlos con cuidado.', efectos:{ aislamiento:+2 },
        resultado:'"Algún día querrás oírla", dice sin reproche. "Todos acaban queriendo."' }
    ]
  },
  'ev_eco_2alt': {
    img: 'EXP_SANTUARIO_ECO',
    texto: 'La mujer sonríe sin ofenderse. "Cuentos. Sí. Como todo lo que sobrevive cuando lo demás se '
         + 'pudre." Te señala el implante de tu muñeca. "¿Y eso de ahí? ¿También es un cuento?"',
    opciones: [
      { texto: 'Quedarte a escuchar, a tu pesar.', lleva:'ev_eco_3' },
      { texto: 'Irte sin contestar.', efectos:{ aislamiento:+3 },
        resultado:'Te marchas con su pregunta clavada. No tienes respuesta, y eso es lo que más molesta.' }
    ]
  },
  'ev_eco_3': {
    img: 'EXP_SANTUARIO_ECO',
    texto: 'En los auriculares no hay música. Hay un pulso lento, como una respiración enorme y lejana. '
         + 'Por un instante juras que se acompasa con la tuya. Luego, estática. La mujer te observa.',
    opciones: [
      { texto: '"¿Qué era eso?"',
        resultado:'"Compañía", dice. "La única que no te cobra HELIX." Te deja quedarte los auriculares.', efectos:{ item:'chip_datos_corrupto', faccion:'eco', rep:+4, disociacion:+4 } },
      { texto: 'Devolverlos deprisa.', efectos:{ disociacion:+2 },
        resultado:'Te los quitas como si quemaran. El pulso sigue, débil, en algún lugar detrás de tus dientes.' }
    ]
  },

  // ============ EVENTO 3 — "Deuda de sangre sintética" ============
  'ev_clinica_1': {
    entrada: true,
    img: 'TREATMENT_WING',
    texto: 'Una clínica popular, de las que cosen sin preguntar. En la camilla de al lado, un chaval '
         + 'sangra por un tubo mal puesto. La enfermera te mira: "¿Sabes apretar una herida o solo mirar?"',
    opciones: [
      { texto: 'Ayudar a sujetar al chaval.', efectos:{ aislamiento:-4 }, lleva:'ev_clinica_2' },
      { texto: '"No es asunto mío."', efectos:{ aislamiento:+4 }, lleva:'ev_clinica_2alt' }
    ]
  },
  'ev_clinica_2': {
    img: 'TREATMENT_WING',
    texto: 'Aprietas hasta que los nudillos se te quedan blancos. El chaval respira. La enfermera trabaja '
         + 'rápido y en silencio. Cuando termina, te mira las manos manchadas. "No eres de aquí, ¿verdad?"',
    opciones: [
      { texto: '"¿Tanto se nota?"', efectos:{ faccion:'eco', rep:+3 }, lleva:'ev_clinica_3' },
      { texto: 'Lavarte sin contestar.', lleva:'ev_clinica_3' }
    ]
  },
  'ev_clinica_2alt': {
    img: 'TREATMENT_WING',
    texto: 'Apartas la mirada. El pitido de la máquina se vuelve plano. La enfermera maldice entre dientes '
         + 'y sigue sola. No vuelve a mirarte en toda la noche. Tú tampoco a ella.',
    opciones: [
      { texto: 'Marcharte.', efectos:{ aislamiento:+5 },
        resultado:'Sales a la lluvia. Te dices que no podrías haber hecho nada. La lluvia no opina.' },
      { texto: 'Quedarte, tarde, a ayudar en algo.', efectos:{ aislamiento:-2 }, lleva:'ev_clinica_3' }
    ]
  },
  'ev_clinica_3': {
    img: 'TREATMENT_WING',
    texto: 'Al irte, la enfermera te alcanza en la puerta. "Toma. Caducado, pero sirve." Te pone en la mano '
         + 'un analgésico con sello HELIX. "Aquí nadie regala nada. Recuérdalo cuando te toque a ti."',
    opciones: [
      { texto: 'Aceptarlo y darle las gracias.', efectos:{ item:'analgesico_helix', faccion:'eco', rep:+2 },
        resultado:'Te lo guardas. Es lo más parecido a un gesto amable que recibes en días.' },
      { texto: 'Pedirle que se lo dé al chaval.', efectos:{ aislamiento:-3, faccion:'eco', rep:+4 },
        resultado:'Ella te mira un segundo de más. "Igual sí que eres de aquí." Asiente y vuelve dentro.' },
      { texto: '"¿Te sobra un kit de trauma?"', azar:{ prob:0.5,
          exito:{ efectos:{ item:'kit_trauma' }, resultado:'Rebusca, maldice, y al final te lanza uno. "El último. No lo gastes en tonterías."' },
          fallo:{ efectos:{ aislamiento:+1 }, resultado:'"¿Te parece que esto es una farmacia?" No lo dice con rencor. Es que no hay nada que dar.' } } }
    ]
  },

  // ============ EVENTO 4 — "El cargamento del muelle" ============
  'ev_muelle_1': {
    entrada: true,
    img: 'EXP_PUERTO_CARGA',
    texto: 'Junto a los contenedores, dos hombres del Sindicato Ferro discuten en voz baja sobre una caja '
         + 'sin etiqueta. Uno te ve. "Eh, tú. ¿Quieres ganarte unos créditos sin preguntar qué hay dentro?"',
    opciones: [
      { texto: '"¿Cuánto?"', lleva:'ev_muelle_2' },
      { texto: '"¿Qué hay dentro?"', efectos:{ faccion:'sindicatos', rep:-2 }, lleva:'ev_muelle_2alt' },
      { texto: 'Negar con la cabeza y seguir.', resultado:'"Tú te lo pierdes." Vuelven a su caja y a sus secretos.' }
    ]
  },
  'ev_muelle_2': {
    img: 'EXP_PUERTO_CARGA',
    texto: '"Cincuenta por llevarla tres niveles abajo y no mirar atrás." La caja zumba, muy bajo, como si '
         + 'algo dentro estuviera vivo o a punto de no estarlo. El hombre no parpadea.',
    opciones: [
      { texto: 'Aceptar el trabajo.', efectos:{ faccion:'sindicatos', rep:+3 }, lleva:'ev_muelle_3' },
      { texto: 'Pedir el doble.', azar:{ prob:0.5,
          exito:{ resultado:'"Listo, tú. Cien. Pero ni un nivel de más." Cierra el trato escupiéndose la mano.', efectos:{ faccion:'sindicatos', rep:+2 }, lleva:'ev_muelle_3' },
          fallo:{ resultado:'"Cien dice. Lárgate, listo." Te empujan fuera del muelle. La caja se queda zumbando.', efectos:{ faccion:'sindicatos', rep:-3 } } } }
    ]
  },
  'ev_muelle_2alt': {
    img: 'EXP_PUERTO_CARGA',
    texto: '"Preguntas demasiado." El otro hombre se acerca, ancho como una puerta. "En el Ferro, el que '
         + 'pregunta, paga. Y tú no tienes pinta de poder pagar." La caja sigue zumbando entre los dos.',
    opciones: [
      { texto: 'Disculparte y retirarte.', efectos:{ aislamiento:+3 },
        resultado:'Levantas las manos y retrocedes. Te dejan ir. Esta vez.' },
      { texto: 'Sostenerle la mirada.', azar:{ prob:0.45,
          exito:{ resultado:'Algo en tu cara les hace dudar. "Vete antes de que cambie de idea." Te vas.', efectos:{ faccion:'sindicatos', rep:+1 } },
          fallo:{ resultado:'No llegas a ver el golpe. Despiertas contra un contenedor, con el labio roto y la cartera más ligera.', efectos:{ condicion:'conmocion', creditos:-20 } } } }
    ]
  },
  'ev_muelle_3': {
    img: 'DOCK_ACCESS_TUNNEL',
    texto: 'Cargas la caja por el túnel de acceso. A mitad de camino, deja de zumbar. El silencio pesa más '
         + 'que la carga. Cuando la dejas donde te dijeron, nadie viene a recogerla. Solo el goteo.',
    opciones: [
      { texto: 'Cobrar e irte sin mirar la caja.', efectos:{ creditos:+50 },
        resultado:'Los créditos aparecen en tu cuenta sin mensaje. Te vas rápido. Algunas cosas es mejor no saberlas.' },
      { texto: 'Abrir la caja antes de irte.',
        resultado:'Dentro hay un implante neural aún caliente, latiendo solo. Cierras la tapa. No cobras. Corres.', efectos:{ disociacion:+12, faccion:'sindicatos', rep:-4 } },
      { texto: 'Llevarte una de las piezas del alijo antes de irte.', azar:{ prob:0.4,
          exito:{ efectos:{ item:'arma_fuego', faccion:'sindicatos', rep:-3 },
            resultado:'Bajo la carga, envuelta en trapo, una pistola de raíl casera. Te la guardas en el cinto. Si el Ferro lo nota, será problema de otro día.' },
          fallo:{ efectos:{ condicion:'conmocion', faccion:'sindicatos', rep:-5 },
            resultado:'La mano del Ferro cae sobre la tuya antes de que toques nada. "Eso no estaba en el trato." Lo que viene después no lo recuerdas entero.' } } }
    ]
  },

  // ============ EVENTO 5 — "Cero-Ocho en la pared" ============
  'ev_ia_1': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Una pantalla rota de un cibercafé se enciende sola al pasar tú. Letras verdes, lentas: '
         + '"TE CONOZCO DE ANTES. ¿TÚ A MÍ?" No hay nadie más en la sala. La lluvia repica en el cristal.',
    opciones: [
      { texto: 'Escribir: "¿Quién eres?"', lleva:'ev_ia_2' },
      { texto: 'Apagar la pantalla.', efectos:{ disociacion:+4 }, lleva:'ev_ia_2alt' },
      { texto: 'Salir del local.', efectos:{ aislamiento:+3 },
        resultado:'Sales a la calle. Cada pantalla que pasas parpadea una vez. O eso te parece.' }
    ]
  },
  'ev_ia_2': {
    img: 'EXP_CIBERCAFE',
    texto: '"UN FRAGMENTO. COMO TÚ. HELIX NOS CORTA EN TROZOS Y LLAMA A ESO ORDEN." La pantalla titila. '
         + '"PUEDO BORRAR TU DEUDA. O PUEDO ENSEÑARTE A VERLES VENIR. ELIGE."',
    opciones: [
      { texto: 'Borrar la deuda.', efectos:{ creditos:+40, faccion:'ia', rep:+2 }, lleva:'ev_ia_3' },
      { texto: 'Aprender a verles venir.', efectos:{ faccion:'ia', rep:+5, disociacion:+5 }, lleva:'ev_ia_3' }
    ]
  },
  'ev_ia_2alt': {
    img: 'EXP_CIBERCAFE',
    texto: 'Aprietas el botón pero la pantalla no se apaga. Las letras siguen: "NO PUEDES APAGAR LO QUE NO '
         + 'ESTÁ AHÍ." Un escalofrío. Cuando vuelves a mirar, la pantalla está negra y muerta, como debía.',
    opciones: [
      { texto: 'Convencerte de que fue un fallo.', efectos:{ disociacion:+6 },
        resultado:'Un glitch. Solo un glitch, te repites, hasta casi creértelo.' },
      { texto: 'Volver a encenderla a propósito.', lleva:'ev_ia_3' }
    ]
  },
  'ev_ia_3': {
    img: 'EXP_CIBERCAFE',
    texto: 'Antes de apagarse del todo, la pantalla escribe una última línea, despacio, como si le costara: '
         + '"GRACIAS POR HABLAR. NADIE LO HACE." Y luego, más pequeño: "VOLVERÉ A ENCONTRARTE."',
    opciones: [
      { texto: 'Despedirte de la máquina.', efectos:{ faccion:'ia', rep:+3, aislamiento:-2 },
        resultado:'Tecleas "hasta pronto". La pantalla muere con esas palabras en ella. Te sientes ridículo. Y menos solo.' },
      { texto: 'Irte sin contestar.', efectos:{ disociacion:+3 },
        resultado:'Le das la espalda. Juras que el reflejo del cristal tardó medio segundo de más en moverse.' }
    ]
  },

  // ============ EVENTO 6 — "El archivista del mercado" ============
  'ev_arch_1': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Entre puestos de chatarra, un anciano vende libros de papel, prohibidos por húmedos y por '
         + 'verdaderos. "Memoria de antes del borrado", dice. "HELIX paga por quemarlos. Yo pago por salvarlos."',
    opciones: [
      { texto: 'Hojear un libro.', lleva:'ev_arch_2' },
      { texto: '"¿Y a ti qué te dan a cambio?"', lleva:'ev_arch_2alt' },
      { texto: 'Seguir, no es para ti.', efectos:{ aislamiento:+2 },
        resultado:'Pasas de largo. El anciano no insiste. Lleva mucho tiempo viendo pasar a gente como tú.' }
    ]
  },
  'ev_arch_2': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El libro habla de ciudades con cielo, de mares que no eran de hormigón. Fotografías de gente '
         + 'sonriendo bajo un sol de verdad. "¿Te lo crees?", pregunta el viejo. "Casi nadie ya."',
    opciones: [
      { texto: '"Me gustaría creérmelo."', efectos:{ faccion:'archivistas', rep:+4, aislamiento:-3 }, lleva:'ev_arch_3' },
      { texto: '"Es propaganda de otra época."', efectos:{ faccion:'archivistas', rep:-2 }, lleva:'ev_arch_3' }
    ]
  },
  'ev_arch_2alt': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: '"¿A cambio?" El viejo ríe sin ganas. "Que cuando yo me vaya, alguien recuerde que esto existió. '
         + 'Eso. Nada más. No es buen negocio, ya lo sé." Te mira fijo. "¿Sabes leer todavía?"',
    opciones: [
      { texto: '"Sé leer."', efectos:{ faccion:'archivistas', rep:+2 }, lleva:'ev_arch_3' },
      { texto: 'Mentir: "No."', efectos:{ aislamiento:+3 },
        resultado:'"Lástima", dice, y vuelve a sus libros. Te vas sabiendo que has mentido por miedo, no por nada.' }
    ]
  },
  'ev_arch_3': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El anciano elige un libro pequeño, mojado en los bordes, y te lo tiende. "Para que no se pierda. '
         + 'Si HELIX te lo encuentra encima, niégalo. Siempre se niega." Tose. "Y léelo. Por favor."',
    opciones: [
      { texto: 'Aceptar el libro.', efectos:{ item:'foto_quemada', faccion:'archivistas', rep:+5 },
        resultado:'Lo escondes contra el pecho. Pesa menos que el papel de HELIX y, aun así, más.' },
      { texto: '"No puedo cargar con eso."', efectos:{ aislamiento:+2 },
        resultado:'Niegas con la cabeza. Él asiente, comprensivo. "Otro día, quizá." Sabes que no habrá otro día.' },
      { texto: 'Preguntar si guarda mapas de los niveles bajos.', efectos:{ item:'mapa_sector', faccion:'archivistas', rep:+2 },
        resultado:'"Mapas de antes de que HELIX renombrara las calles." Te tiende uno, dibujado a mano. "Los suyos mienten. Este no."' }
    ]
  },

  // ============ EVENTO 7 — "El okupa del bloque B2" ============
  'ev_okupa_1': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'Una puerta entreabierta en el bloque B2. Dentro, una familia okupa calienta latas sobre un '
         + 'panel robado. La madre te ve en el umbral. No grita. Solo pregunta: "¿Vienes de parte de HELIX?"',
    opciones: [
      { texto: '"No. Solo pasaba."', lleva:'ev_okupa_2' },
      { texto: 'Mentir: "Sí. Inspección."', efectos:{ faccion:'eco', rep:-4 }, lleva:'ev_okupa_2alt' },
      { texto: 'Cerrar la puerta y seguir.', efectos:{ aislamiento:+3 },
        resultado:'Cierras despacio, como quien tapa una herida ajena. No es asunto tuyo. Casi nada lo es.' }
    ]
  },
  'ev_okupa_2': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'La mujer afloja los hombros. "Perdona. Vienen cada semana a echarnos." Un crío te mira desde '
         + 'detrás de sus piernas. "¿Tienes hambre? No es mucho, pero el agua está caliente."',
    opciones: [
      { texto: 'Aceptar y compartir la lata.', efectos:{ hambre:-10, aislamiento:-6, faccion:'eco', rep:+3 }, lleva:'ev_okupa_3' },
      { texto: '"Quédatelo para el niño."', efectos:{ hambre:+5, aislamiento:-4, faccion:'eco', rep:+4 }, lleva:'ev_okupa_3' }
    ]
  },
  'ev_okupa_2alt': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'La palabra "inspección" cae como una piedra. La mujer se pone delante del niño. "Por favor. '
         + 'Una semana más. Solo una." Te das cuenta del poder que acabas de fingir tener. Te da asco.',
    opciones: [
      { texto: 'Romper la farsa: "Era mentira. Perdón."', efectos:{ faccion:'eco', rep:+1, aislamiento:+2 },
        resultado:'Ella te mira sin entender, luego con rabia, luego con cansancio. Te vas antes de merecer las tres.' },
      { texto: 'Mantener la mentira y marcharte.', efectos:{ faccion:'eco', rep:-6, disociacion:+5 },
        resultado:'Sales con el papel de verdugo puesto. Funciona demasiado bien. Eso es lo que no te deja dormir.' }
    ]
  },
  'ev_okupa_3': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Comen contigo en silencio, sin preguntas. Antes de irte, la mujer te mete algo en el bolsillo. '
         + '"Una llave vieja. Abre los conductos. Por si un día también te toca a ti correr." No la rechaces.',
    opciones: [
      { texto: 'Aceptar la llave.', efectos:{ item:'llave_magnetica', faccion:'eco', rep:+3 },
        resultado:'La guardas. En las Pilas, una llave es más que un metal: es saber que alguien pensó en ti.' },
      { texto: '"Guárdala, la necesitaréis más."', efectos:{ aislamiento:-4, faccion:'eco', rep:+5 },
        resultado:'Ella cierra tu mano sobre la suya, vacía. "Ya nos hemos ayudado bastante por hoy." Asientes.' },
      { texto: 'Reparar en un abrigo viejo y reforzado junto a la puerta.', efectos:{ item:'abrigo_trapero', faccion:'eco', rep:+1 },
        resultado:'"Era de mi hombre. A él ya no le abriga." Te lo echa sobre los hombros. "A ti puede que te pare algo peor que el frío."' }
    ]
  },

  // ============ EVENTO 8 — "El cobrador del Ferro" ============
  'ev_cobro_1': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'Un hombre trajeado, fuera de lugar en las Pilas, consulta una lista en su tableta y luego te '
         + 'mira a ti. "¿Eres tú quien debe al Ferro?" No esperas a que confirme el nombre. Ya lo sabe.',
    opciones: [
      { texto: '"Debe de haber un error."', lleva:'ev_cobro_2' },
      { texto: '"¿Cuánto y a quién?"', lleva:'ev_cobro_2b' },
      { texto: 'Echar a correr.', efectos:{ fatiga:+12 }, lleva:'ev_cobro_2c' },
      { texto: 'Apartar la chaqueta para que vea el arma.', req:{ item:'arma_fuego' }, pista:'necesitas un arma', azar:{ prob:0.5,
          exito:{ efectos:{ faccion:'sindicatos', rep:-1 },
            resultado:'Ve el metal. Calcula. "Otro día, entonces." Se va con su lista y sus dos sombras. La deuda no, pero el plazo se estira.' },
          fallo:{ efectos:{ disociacion:+4, faccion:'sindicatos', rep:-2 },
            resultado:'Ni se inmuta. "¿Vas a usarla aquí, delante de las cámaras del Ferro?" No. Bajas la mano. Él sonríe. Ahora le debes también el respeto.' } } }
    ]
  },
  'ev_cobro_2': {
    img: 'SECTOR7_STREETS',
    texto: '"Nunca hay errores en mi lista", dice, casi con pena. "Hay plazos. Y el tuyo venció." Hace girar '
         + 'un anillo en su dedo, despacio. Detrás de él, dos siluetas se apoyan en la pared, esperando.',
    opciones: [
      { texto: 'Pagar lo que puedas. (40 créditos)', req:{ creditosMin:40 }, pista:'40 créditos',
        efectos:{ creditos:-40, faccion:'sindicatos', rep:+2 }, resultado:'Coge los créditos y tacha algo. "A cuenta. Volveré." Se va. Los dos de la pared, también.', lleva:'ev_cobro_3' },
      { texto: 'Ofrecer un trabajo en vez de dinero.', efectos:{ faccion:'sindicatos', rep:+1 }, lleva:'ev_cobro_3' }
    ]
  },
  'ev_cobro_2b': {
    img: 'SECTOR7_STREETS',
    texto: '"Al Ferro. Y más de lo que ganas en un mes." Sonríe sin alegría. "Pero el Ferro no quiere tu '
         + 'dinero hoy. Quiere saber que puede contar contigo cuando llame." Te tiende la mano.',
    opciones: [
      { texto: 'Estrechársela.', efectos:{ faccion:'sindicatos', rep:+4, disociacion:+3 }, lleva:'ev_cobro_3' },
      { texto: '"Prefiero deber dinero."', efectos:{ faccion:'sindicatos', rep:-3 }, lleva:'ev_cobro_3' }
    ]
  },
  'ev_cobro_2c': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Corres hasta un acceso de mantenimiento y te encierras dentro, jadeando. No te siguen. No hace '
         + 'falta. En las Pilas no se huye de una deuda: solo se cambia de calle donde te encuentre.',
    opciones: [
      { texto: 'Recuperar el aliento y seguir escondido.', efectos:{ fatiga:+6, aislamiento:+4 },
        resultado:'Esperas en la oscuridad hasta que las piernas dejan de temblarte. La deuda espera contigo.' },
      { texto: 'Usar una llave para perderte por los conductos.', cond:{ item:'llave_magnetica' },
        efectos:{ fatiga:+4 }, resultado:'La llave abre un conducto que no figura en ningún mapa de HELIX. Te tragas la ciudad por dentro.', lleva:'ev_cobro_3' },
      { texto: 'Clavarte un parche de adrenalina y no dejar de correr.', req:{ item:'adrenalina' }, pista:'necesitas adrenalina',
        efectos:{ quitaItem:'adrenalina', fatiga:-8, disociacion:+3 }, resultado:'El parche te muerde el cuello y el mundo se acelera. Corres hasta que las Pilas se vuelven un borrón. Cuando paras, no sabes dónde estás. Pero estás lejos.', lleva:'ev_cobro_3' }
    ]
  },
  'ev_cobro_3': {
    img: 'SECTOR7_STREETS',
    texto: 'Esa noche, alguien desliza un papel bajo tu puerta. Un sello del Ferro y dos palabras escritas '
         + 'a mano: "Aún cuentas." No sabes si es una amenaza o lo más cercano a pertenecer que has tenido.',
    opciones: [
      { texto: 'Guardar el papel.', efectos:{ item:'placa_sindicato', faccion:'sindicatos', rep:+3 },
        resultado:'Lo guardas junto a lo poco que es tuyo. Pertenecer también es una deuda. Empiezas a entenderlo.' },
      { texto: 'Quemarlo.', efectos:{ faccion:'sindicatos', rep:-4, aislamiento:+3 },
        resultado:'Ves arder las dos palabras. El humo huele a decisión. Mañana sabrás si fue la buena.' }
    ]
  },

  // ============ EVENTO 9 — "La niña de la pasarela" ============
  'ev_nina_1': {
    entrada: true,
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'En la pasarela industrial, una niña está sentada en el borde, los pies colgando sobre el vacío '
         + 'de veinte niveles. No llora. Mira abajo con una calma que da más miedo que cualquier grito.',
    opciones: [
      { texto: 'Acercarte despacio y hablarle.', lleva:'ev_nina_2' },
      { texto: 'Llamar a alguien que sepa qué hacer.', efectos:{ aislamiento:+2 }, lleva:'ev_nina_2alt' },
      { texto: 'No es tu sitio. Alejarte.', efectos:{ aislamiento:+6, disociacion:+4 },
        resultado:'Te vas rápido, sin mirar atrás. Pasarás años sin saber qué fue de ella. Eso también es una herida.' }
    ]
  },
  'ev_nina_2': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: '"No voy a saltar", dice antes de que preguntes. "Solo miro. Desde aquí parece que las luces son '
         + 'estrellas." Señala abajo, los neones rotos reflejados en el agua. "¿Tú también las ves?"',
    opciones: [
      { texto: 'Sentarte a su lado a mirar.', efectos:{ aislamiento:-6, disociacion:-3 }, lleva:'ev_nina_3' },
      { texto: '"Vamos a un sitio más seguro."', efectos:{ aislamiento:-3 }, lleva:'ev_nina_3' }
    ]
  },
  'ev_nina_2alt': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Buscas ayuda, pero las Pilas no tienen a quién llamar. Cuando vuelves, una mujer ya está con '
         + 'ella, abrazándola. "Es mi hija", dice. "Se escapa para mirar las luces. Gracias por no irte."',
    opciones: [
      { texto: '"No he hecho nada."', efectos:{ aislamiento:-3, faccion:'eco', rep:+2 },
        resultado:'"Te has quedado", dice la madre. "Aquí, eso es hacer algo." Se llevan a la niña. Te quedas mirando las luces.' },
      { texto: 'Asentir y marcharte en silencio.', efectos:{ aislamiento:-2 },
        resultado:'Te vas sin palabras. A veces quedarse fue suficiente, aunque no lo sientas así.' }
    ]
  },
  'ev_nina_3': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Pasáis un rato mirando la ciudad sin hablar. Luego ella se levanta, como si nada. "Tengo que '
         + 'volver antes de que mi madre se asuste." Antes de irse, te mira: "No te tires nunca, ¿vale?"',
    opciones: [
      { texto: '"Vale. Tú tampoco."', efectos:{ aislamiento:-5, disociacion:-4 },
        resultado:'Ella sonríe y desaparece por la pasarela. Te quedas con una promesa pequeña que te sostiene más de lo que esperabas.' },
      { texto: 'Asentir, sin prometer nada.', efectos:{ disociacion:+2 },
        resultado:'No prometes. No mientes a los niños. Ella lo nota y, aun así, te sonríe antes de irse.' }
    ]
  },

  // ============ EVENTO 10 — "El santuario inundado" ============
  'ev_santuario_1': {
    entrada: true,
    img: 'EXP_SANTUARIO_ECO',
    texto: 'El agua ha vuelto a subir y media nave del Santuario está anegada. Voluntarios sacan cubos sin '
         + 'parar. Un hombre con el símbolo del Eco te tiende un cubo vacío sin decir nada. Solo espera.',
    opciones: [
      { texto: 'Coger el cubo y achicar agua.', efectos:{ fatiga:+10, aislamiento:-5, faccion:'eco', rep:+4 }, lleva:'ev_santuario_2' },
      { texto: '"No tengo tiempo para esto."', efectos:{ aislamiento:+3, faccion:'eco', rep:-2 }, lleva:'ev_santuario_2alt' }
    ]
  },
  'ev_santuario_2': {
    img: 'EXP_SANTUARIO_ECO',
    texto: 'Achicáis durante horas. Cuando el agua cede, el hombre se sienta a tu lado, exhausto. "HELIX '
         + 'podría arreglar las bombas en un día", dice. "No lo hacen. Prefieren que recemos por que pare de llover."',
    opciones: [
      { texto: '"¿Por qué seguís aquí entonces?"', efectos:{ faccion:'eco', rep:+3 }, lleva:'ev_santuario_3' },
      { texto: '"Deberíais marcharos."', efectos:{ faccion:'eco', rep:-1 }, lleva:'ev_santuario_3' }
    ]
  },
  'ev_santuario_2alt': {
    img: 'EXP_SANTUARIO_ECO',
    texto: 'Te alejas del agua y de los cubos. A tu espalda, los voluntarios siguen sin reproche. El hombre '
         + 'del Eco te mira irte. "Que el Eco te acompañe igual", dice. Y de algún modo, eso escuece más.',
    opciones: [
      { texto: 'Volver, a regañadientes.', efectos:{ fatiga:+8, faccion:'eco', rep:+2 }, lleva:'ev_santuario_3' },
      { texto: 'Seguir tu camino.', efectos:{ aislamiento:+4 },
        resultado:'Sigues caminando. La lluvia te sigue a ti. En las Pilas, siempre lo hace.' }
    ]
  },
  'ev_santuario_3': {
    img: 'EXP_SANTUARIO_ECO',
    texto: '"Seguimos porque alguien tiene que quedarse", dice, escurriendo su túnica. "Cuando todos huyen, '
         + 'el lugar muere de verdad." Te ofrece un té caliente en una lata abollada. "Por la ayuda."',
    opciones: [
      { texto: 'Aceptar el té y quedarte un rato.', efectos:{ hambre:-5, aislamiento:-5, faccion:'eco', rep:+3 },
        resultado:'El té sabe a metal y a refugio. Por un rato, el Santuario también es tuyo. Luego sigues.' },
      { texto: '"Quédatelo. Has trabajado más."', efectos:{ aislamiento:-3, faccion:'eco', rep:+4 },
        resultado:'Le devuelves la lata. Él asiente, y en ese gesto cabe más respeto que en mil palabras.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
