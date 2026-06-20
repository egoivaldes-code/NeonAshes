// ============================================================
// BLOQUE JS-53 — ESCENAS DE GUION · LOTE 4 (eventos de 2-3 escenas)
// ------------------------------------------------------------
// 10 eventos de exploración con desarrollo: una escena de entrada y
// una o dos escenas internas encadenadas con 'lleva'. Más cuerpo que
// los momentos sueltos del lote 3, pero sin llegar a cadena de misión.
// Neutrales (sin carga fuerte de facción). Mismo formato que 45/47/48.
// Se carga DESPUÉS de 52_escenas_lote3.js y se fusiona en ESCENAS_GUION.
//
// Solo se usan imágenes, items y condiciones que YA existen.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ========== EVENTO 1 — "El reloj empeñado" (2 escenas) ==========
  'ev2_reloj_1': {
    entrada: true,
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'Un prestamista examina un reloj antiguo bajo la lupa. "Mecánico, ¿eh? De los que no necesitan red." '
         + 'Te mira por encima del cristal. "¿Compras, vendes, o solo miras como todos?"',
    opciones: [
      { texto: 'Preguntar por el reloj mecánico.', lleva:'ev2_reloj_2' },
      { texto: '"Solo miro." Y seguir.', efectos:{ aislamiento:+1 },
        resultado:'"Como todos", repite él, ya desinteresado. Sigues. Un reloj que no depende de HELIX: en las Pilas, casi una herejía.' }
    ]
  },
  'ev2_reloj_2': {
    img: 'EXP_MERCADO_OLVIDADOS',
    texto: 'El prestamista lo deja sobre el paño. "Cuarenta créditos. No da la hora de la red, da LA hora, la '
         + 'de verdad. La que no pueden cambiarte desde arriba." Hace tic-tac en el silencio, terco y vivo.',
    opciones: [
      { texto: 'Comprarlo. (40 créditos)', req:{ creditosMin:40 }, pista:'40 créditos',
        efectos:{ creditos:-40, item:'chatarra', aislamiento:-3 },
        resultado:'Pagas. Te lo guardas en el bolsillo y notas su latido contra la pierna. No vale para nada práctico. Por eso, quizá, lo querías. (Por dentro era pura chatarra fina; te quedas con ella.)' },
      { texto: '"Demasiado. La hora me la regala cualquier pantalla."', efectos:{ disociacion:+2 },
        resultado:'"La de las pantallas no es tuya", dice, guardándolo. "Es suya." Te vas con la frase clavada y la rara certeza de que tenía razón.' },
      { texto: 'Despedirte sin comprar.',
        resultado:'Sales. A tu espalda, el tic-tac sigue, paciente, esperando a alguien que entienda lo que vende.' }
    ]
  },

  // ========== EVENTO 2 — "La gotera del nivel superior" (2 escenas) ==========
  'ev2_gotera_1': {
    entrada: true,
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Un hilo de agua cae del techo del pasadizo y ha formado un charco que crece. Una mujer mayor intenta '
         + 'taparlo con trapos, sin éxito. "Llevo tres días avisando a mantenimiento. Tres días."',
    opciones: [
      { texto: 'Echar un vistazo a la junta del techo.', lleva:'ev2_gotera_2' },
      { texto: '"Mantenimiento no vendrá. Nunca viene."', efectos:{ aislamiento:+2 },
        resultado:'"Ya lo sé", contesta sin dejar de poner trapos. "Pero alguien tiene que seguir avisando, o esto deja de ser un sitio donde vive gente." Sigues, tocado por la dignidad terca de la frase.' }
    ]
  },
  'ev2_gotera_2': {
    img: 'MAINTENANCE_ACCESS12',
    texto: 'Subido a una caja, ves la junta reventada. Con un poco de maña y algo que haga de cuña, aguantaría '
         + 'semanas. La mujer te mira desde abajo, sin pedir nada, que es la forma más difícil de pedir.',
    opciones: [
      { texto: 'Arreglarla con lo que llevas encima.', efectos:{ fatiga:+5, aislamiento:-5 },
        resultado:'Improvisas una cuña y sellas la junta. El goteo se detiene. La mujer no da las gracias con palabras: te aprieta el brazo un segundo y asiente. Bajas de la caja sintiéndote, por una vez, útil.' },
      { texto: 'Darle el consejo de cómo hacerlo y seguir.', efectos:{ aislamiento:-1 },
        resultado:'Le explicas dónde poner la cuña. "Eso puedo hacerlo", murmura, ya calculando. La dejas trepando a la caja con una decisión nueva en la cara.' },
      { texto: 'No es tu problema. Bajar y marcharte.', efectos:{ aislamiento:+3 },
        resultado:'Bajas y sigues. A tu espalda, el goteo continúa marcando el tiempo sobre el charco. Te acompaña más de lo que esperabas.' }
    ]
  },

  // ========== EVENTO 3 — "El mensajero equivocado" (3 escenas) ==========
  'ev2_mensajero_1': {
    entrada: true,
    img: 'SECTOR7_STREETS',
    texto: 'Un chaval sin aliento te planta un paquete pequeño en las manos. "¡El del abrigo gris, eras tú! '
         + 'Toma, ya está pagado." Y sale corriendo antes de que puedas decir nada. El paquete pesa poco. Late.',
    opciones: [
      { texto: 'Abrirlo ahí mismo.', lleva:'ev2_mensajero_2' },
      { texto: 'Correr tras el chaval para devolverlo.', lleva:'ev2_mensajero_3' },
      { texto: 'Guardártelo y seguir, disimulando.', efectos:{ disociacion:+4 },
        resultado:'Te lo metes bajo el abrigo y caminas normal, el corazón a mil. Sea lo que sea, ahora es tuyo. Esa idea no te deja en paz el resto del día.' }
    ]
  },
  'ev2_mensajero_2': {
    img: 'SECTOR7_STREETS',
    texto: 'Dentro hay un chip de datos envuelto en espuma y una nota: "No lo enchufes a nada tuyo. Ellos miran '
         + 'por donde menos crees." El chip tiene un brillo aceitoso, como si supiera que lo observas.',
    opciones: [
      { texto: 'Quedártelo con cuidado.', efectos:{ item:'chip_datos_corrupto', disociacion:+3 },
        resultado:'Lo guardas siguiendo la advertencia, sin conectarlo. Un secreto ajeno en tu bolsillo. En las Pilas, la información es la única moneda que sube de valor con el miedo.' },
      { texto: 'Dejarlo en una papelera y alejarte.', efectos:{ aislamiento:+2 },
        resultado:'Lo sueltas y te vas rápido. Algunos paquetes es mejor que sigan perdidos. Miras atrás dos veces antes de doblar la esquina.' }
    ]
  },
  'ev2_mensajero_3': {
    img: 'SECTOR7_STREETS',
    texto: 'Alcanzas al chaval en un callejón. "¡No era para mí!", le dices. Él te mira con un miedo que no es '
         + 'de su edad. "Ya lo sé. Pero a mí me matan si lo llevo. A ti solo te confundirán." Y desaparece.',
    opciones: [
      { texto: 'Quedarte el paquete, resignado.', efectos:{ item:'chip_datos_corrupto', disociacion:+4 },
        resultado:'Te quedas solo en el callejón con el paquete que late. La frase del crío te pesa: a él lo matan, a ti solo te confunden. Así reparte el mundo sus condenas.' },
      { texto: 'Dejarlo caer al suelo y marcharte.', efectos:{ aislamiento:+3, disociacion:+2 },
        resultado:'Lo dejas en el suelo del callejón y te vas sin mirar. Pero la cara del chaval se te queda dentro, y sabes que volverá esta noche, cuando cierres los ojos.' }
    ]
  },

  // ========== EVENTO 4 — "Partida de cartas" (2 escenas) ==========
  'ev2_cartas_1': {
    entrada: true,
    img: 'EXP_CIBERCAFE',
    texto: 'Cuatro veteranos juegan a las cartas en una mesa del fondo, en silencio absoluto. Una silla vacía. '
         + 'Uno te mira y la empuja con el pie, una invitación sin palabras. No hay dinero a la vista. Aún.',
    opciones: [
      { texto: 'Sentarte a jugar una mano.', lleva:'ev2_cartas_2' },
      { texto: 'Declinar con un gesto y seguir.', efectos:{ aislamiento:+1 },
        resultado:'Niegas con la cabeza. El que te invitó se encoge de hombros y vuelve a sus cartas. La silla sigue vacía, esperando a otro que se atreva.' }
    ]
  },
  'ev2_cartas_2': {
    img: 'EXP_CIBERCAFE',
    texto: 'Te sientas. Reparten. El juego es viejo y las reglas no te las explican: aquí o las sabes o pierdes. '
         + 'Cuando llega tu turno, los cuatro te miran. La apuesta de entrada son diez créditos. Silencio.',
    opciones: [
      { texto: 'Apostar y jugar en serio. (10 créditos)', req:{ creditosMin:10 }, pista:'10 créditos',
        efectos:{ creditos:-10 }, azar:{ prob:0.45,
          exito:{ resultado:'Lees el juego sobre la marcha y ganas la mano. Los veteranos asienten con un respeto seco. Recoges el bote y, mejor aún, te has ganado un sitio en esa mesa para otro día.', efectos:{ creditos:+30, aislamiento:-5 } },
          fallo:{ resultado:'Pierdes, como casi todos los novatos. Pero juegas con calma hasta el final, y eso lo notan. "Vuelve cuando aprendas", dice uno. No es un insulto: es una invitación.', efectos:{ aislamiento:-3 } } } },
      { texto: 'Levantarte antes de apostar.', efectos:{ aislamiento:+2 },
        resultado:'Te echas atrás en el último momento. Recogen tu mano sin comentarios. Sales del cibercafé sabiendo que esa silla ya no será tuya.' }
    ]
  },

  // ========== EVENTO 5 — "El perro guardián" (2 escenas) ==========
  'ev2_perro_1': {
    entrada: true,
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'Un perro grande, mitad carne mitad prótesis oxidada, guarda la entrada de un almacén. No gruñe. Te '
         + 'estudia con un ojo real y otro de cristal rojo. Detrás de él se intuye material aprovechable.',
    opciones: [
      { texto: 'Acercarte despacio, hablándole bajo.', lleva:'ev2_perro_2' },
      { texto: 'Buscarte la vida en otro sitio.', efectos:{ aislamiento:+1 },
        resultado:'Decides no tentar a la suerte con un perro de ojo rojo. Das media vuelta. A veces la prudencia es la única forma de coraje que te puedes permitir.' }
    ]
  },
  'ev2_perro_2': {
    img: 'EXP_ALMACEN_OKUPA',
    texto: 'El perro ladea la cabeza con un zumbido de servos. No ataca, pero tampoco se aparta. Tiene hambre, '
         + 'se le nota en las costillas marcadas bajo el metal. Llevas algo de comer encima. Podría bastar.',
    opciones: [
      { texto: 'Darle de comer y ganarte su paso.', efectos:{ hambre:+3, aislamiento:-4 },
        resultado:'Le tiendes la comida. La coge con cuidado, casi con educación, y se hace a un lado. Entras y recoges lo que puedes mientras él vigila la calle. Por hoy, tenéis un trato.' },
      { texto: 'Intentar pasar de largo aprovechando su duda.', azar:{ prob:0.5,
          exito:{ resultado:'Te cuelas pegado a la pared mientras el perro calcula. Recoges material rápido y sales por el otro lado antes de que decida. Suerte, más que astucia.', efectos:{ item:'chatarra', fatiga:+3 } },
          fallo:{ resultado:'El perro decide rápido. Un mordisco de mandíbula reforzada te alcanza el brazo antes de que retrocedas. Sales sin botín y sangrando. El ojo rojo te sigue hasta la esquina.', efectos:{ condicion:'herida_brazo_d_leve', fatiga:+4 } } } },
      { texto: 'Retirarte con calma.', efectos:{ aislamiento:+1 },
        resultado:'Das marcha atrás sin gestos bruscos. El perro te observa irte, inmóvil, fiel a un dueño que quizá ya no existe.' }
    ]
  },

  // ========== EVENTO 6 — "La vidente de circuitos" (3 escenas) ==========
  'ev2_vidente_1': {
    entrada: true,
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Una mujer lee el futuro en placas de circuito quemadas, como otros leen posos de café. "Tú", dice '
         + 'sin levantar la vista. "Llevas una pregunta que no te atreves a hacer ni a ti mismo. Siéntate."',
    opciones: [
      { texto: 'Sentarte. ¿Qué puede saber ella?', lleva:'ev2_vidente_2' },
      { texto: '"Eso se lo dices a todo el mundo."', lleva:'ev2_vidente_3' },
      { texto: 'Seguir caminando sin contestar.', efectos:{ disociacion:+2 },
        resultado:'Sigues. "La pregunta no se irá por ignorarla", dice a tu espalda. Y aunque no quieras, pasas el resto del día buscando cuál era.' }
    ]
  },
  'ev2_vidente_2': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Pasa el dedo por las quemaduras de una placa. "Aquí veo una memoria que no es tuya, metida donde '
         + 'debería estar la tuya." Te mira fijo. "¿Nunca has sentido que recuerdas cosas que no viviste?"',
    opciones: [
      { texto: '"...Sí. A veces." Reconocerlo.', efectos:{ disociacion:+6, aislamiento:-2 },
        resultado:'Lo dices en voz alta por primera vez. Ella asiente despacio, sin triunfo, casi con pena. "Lo sé. A muchos de por aquí nos pasa. Cuídate de lo que recuerdas." Te vas con un escalofrío que no es de frío.' },
      { texto: '"No. Cállate." Y levantarte.', efectos:{ disociacion:+4, aislamiento:+2 },
        resultado:'Te levantas demasiado rápido, demasiado a la defensiva. Ella no insiste. Pero su pregunta ya está dentro de ti, royendo, y los dos lo sabéis.' }
    ]
  },
  'ev2_vidente_3': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: '"Se lo digo a todos porque a todos les pasa", responde sin ofenderse. "Las Pilas están llenas de '
         + 'gente con recuerdos prestados. Tú solo eres el que hoy se ha parado a oírlo." Recoge sus placas.',
    opciones: [
      { texto: 'Dejarle unos créditos por la molestia. (5 créditos)', req:{ creditosMin:5 }, pista:'5 créditos',
        efectos:{ creditos:-5, disociacion:+3 },
        resultado:'Le dejas algo. Ella lo acepta sin mirarlo. "No era una estafa, por si lo dudabas. Ojalá lo fuera." Te vas sin saber qué es peor: que mintiera o que no.' },
      { texto: 'Marcharte sin más.', efectos:{ disociacion:+2 },
        resultado:'Te vas. Pero esa idea —recuerdos prestados, una ciudad entera de memorias ajenas— se te queda dando vueltas mucho después de perderla de vista.' }
    ]
  },

  // ========== EVENTO 7 — "El ascensor de carga" (2 escenas) ==========
  'ev2_montacargas_1': {
    entrada: true,
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'Un montacargas oxidado conecta tu nivel con uno inferior, más profundo, más oscuro. Un cartel a mano '
         + 'dice "NO BAJAR". Abajo, entre la penumbra, se intuyen siluetas de maquinaria abandonada. Y algo más.',
    opciones: [
      { texto: 'Bajar a investigar. El cartel es solo papel.', lleva:'ev2_montacargas_2' },
      { texto: 'Respetar el aviso y seguir tu camino.', efectos:{ aislamiento:+1 },
        resultado:'Dejas el montacargas quieto. Algunos carteles los escribió alguien que aprendió por las malas. Hoy le haces caso.' }
    ]
  },
  'ev2_montacargas_2': {
    img: 'INDUSTRIAL_WALKWAY9',
    texto: 'El montacargas baja con un chirrido que despierta ecos. Abajo, el aire es más frío y huele a metal '
         + 'mojado. Hay material valioso entre las máquinas muertas, pero también un silencio que no es natural.',
    opciones: [
      { texto: 'Cargar rápido lo aprovechable y subir.', azar:{ prob:0.6,
          exito:{ resultado:'Llenas los bolsillos de piezas y vuelves al montacargas antes de averiguar qué hacía ese silencio. Subes con el corazón a mil y el botín a salvo. No miras atrás.', efectos:{ item:'chatarra', fatiga:+4, disociacion:+2 } },
          fallo:{ resultado:'A medio cargar, algo se mueve en la oscuridad: pasos, o el eco de los tuyos devuelto con retraso. El pánico te hace tropezar y golpearte al correr al montacargas. Subes sin nada, temblando.', efectos:{ condicion:'mareado', disociacion:+5, fatiga:+5 } } } },
      { texto: 'Esto da mala espina. Subir ya.', efectos:{ disociacion:+2 },
        resultado:'Vuelves al montacargas sin tocar nada. A veces el instinto grita más fuerte que la codicia. Subes y, arriba, respiras hondo, agradecido de la luz mugrienta de tu nivel.' },
      { texto: 'Acercarte a la silueta inmóvil del fondo.', azar:{ prob:0.55,
          exito:{ efectos:{ item:'chaqueta_kevlar', disociacion:+6 },
            resultado:'No es una máquina. Es alguien que bajó antes que tú y ya no subió, sentado contra un motor muerto. Lleva una chaqueta de kevlar que a él ya no le sirve. Se la quitas con un nudo en la garganta y subes rápido, sin mirarle la cara.' },
          fallo:{ efectos:{ condicion:'mareado', disociacion:+8, fatiga:+6 },
            resultado:'Te acercas y la silueta... no estaba. O nunca estuvo. El frío se te mete en los huesos y un zumbido te llena la cabeza. Subes a trompicones, sin nada, convencido de que algo te ha mirado desde dentro del silencio.' } } },
      { texto: 'Bajar con el arma lista y registrar a fondo.', req:{ item:'arma_fuego' }, pista:'necesitas un arma',
        efectos:{ fatiga:+5, item:'chatarra' },
        resultado:'Con el cañón apuntando a la oscuridad, registras sin prisa. El silencio sigue siendo silencio: nada se atreve a salir. Cargas todo el metal aprovechable y subes entero, por una vez sin pagar el botín con sangre.' }
    ]
  },

  // ========== EVENTO 8 — "El comedor a deshora" (2 escenas) ==========
  'ev2_comedor_1': {
    entrada: true,
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Un comedor comunitario casi vacío. Una sola cocinera limpia ollas. "La cena acabó", dice sin volverse. '
         + '"Pero si tienes hambre de verdad y no de la otra, queda algo en el fondo de la olla." Te estudia.',
    opciones: [
      { texto: 'Aceptar el plato del fondo de la olla.', lleva:'ev2_comedor_2' },
      { texto: '"¿Hambre de la otra?"', lleva:'ev2_comedor_2b' },
      { texto: 'Disculparte y marcharte.', efectos:{ hambre:+2 },
        resultado:'"Como quieras." Vuelve a sus ollas. Sales con el estómago igual de vacío pero sin deber nada a nadie. Hoy lo prefieres así.' }
    ]
  },
  'ev2_comedor_2': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'Te sirve un cuenco de algo espeso y caliente, sin nombre y sin preguntas. Te sientas a comer en el '
         + 'comedor vacío mientras ella friega. El silencio es de los buenos, de los que no piden conversación.',
    opciones: [
      { texto: 'Comer despacio, agradeciendo el calor.', efectos:{ hambre:-8, fatiga:-2, aislamiento:-4 },
        resultado:'Comes sin prisa. El calor te baja hasta los pies. Al terminar, dejas el cuenco fregado en su sitio. Ella asiente una vez. No hacen falta más palabras entre dos que entienden lo que es el hambre.' },
      { texto: 'Comer rápido y dejar algo en el cuenco.', efectos:{ hambre:-5 },
        resultado:'Engulles con la guardia alta, como quien teme que le quiten el plato. Dejas un resto sin querer. Ella lo mira pero no dice nada. Sales con el estómago más lleno y algo de vergüenza.' }
    ]
  },
  'ev2_comedor_2b': {
    img: 'EXP_COMEDOR_SECTORB',
    texto: '"La de compañía", dice, fregando. "Hay quien viene aquí a deshora no por la comida, sino por no cenar '
         + 'solo otra vez. A esos también les doy del fondo de la olla. No se nota la diferencia en el plato."',
    opciones: [
      { texto: 'Sentarte. Quizá tenías las dos hambres.', efectos:{ hambre:-6, aislamiento:-6 },
        resultado:'Te sientas y comes mientras ella trastea cerca, sin agobiar. Resulta que sí tenías las dos hambres, y las dos se calman un poco. Sales más entero de lo que entraste.' },
      { texto: '"Solo la del estómago." Comer y callar.', efectos:{ hambre:-7, aislamiento:-2 },
        resultado:'Comes en silencio, defendiendo la mentira. Ella te deja tenerla. Pero el calor del comedor te delata, y los dos fingís no notarlo. A veces eso también es amabilidad.' }
    ]
  },

  // ========== EVENTO 9 — "La radio pirata" (2 escenas) ==========
  'ev2_radio_1': {
    entrada: true,
    img: 'EXP_CANAL_PILAS',
    texto: 'Entre el rumor del canal, una radio escondida emite una voz baja: noticias que no salen en los '
         + 'boletines de HELIX. Nombres de desaparecidos, cifras de cortes, un recuento de los que no vuelven. '
         + 'Un hombre la escucha agazapado y te hace señas de que bajes la voz.',
    opciones: [
      { texto: 'Agacharte a escuchar con él.', lleva:'ev2_radio_2' },
      { texto: 'Alejarte: esa radio trae problemas.', efectos:{ aislamiento:+2 },
        resultado:'Te apartas. Oír lo que no se debe es media condena en las Pilas. La voz de la radio se pierde en el rumor del agua a tu espalda, contando muertos para quien quiera oírlos.' }
    ]
  },
  'ev2_radio_2': {
    img: 'EXP_CANAL_PILAS',
    texto: 'La voz recita una lista de unidades con "incidencias de memoria": gente que un día dejó de reconocer '
         + 'su propia casa. El hombre te mira. "¿Tu unidad está en la lista? La mía sí. Por eso escucho. Para '
         + 'saber cuándo me toca." Lo dice con una calma que da más miedo que el pánico.',
    opciones: [
      { texto: 'Escuchar hasta el final, por si oyes la tuya.', efectos:{ disociacion:+6, aislamiento:-2 },
        resultado:'Escucháis juntos, dos desconocidos unidos por el mismo miedo. No oyes tu unidad. Esta vez. El hombre te aprieta el hombro al irte: "Hoy nos hemos librado. Mañana, quién sabe."' },
      { texto: 'No quieres saberlo. Levantarte.', efectos:{ disociacion:+4, aislamiento:+2 },
        resultado:'Te vas antes de oír más. Hay listas en las que es mejor no buscarse. Pero ahora sabes que existen, y eso ya no se puede desoír. Caminas más rápido, sin rumbo.' }
    ]
  },

  // ========== EVENTO 10 — "El farol fundido" (2 escenas) ==========
  'ev2_farol_1': {
    entrada: true,
    img: 'HOUSING_BLOCK_B2',
    texto: 'El único farol que ilumina un cruce de pasarelas parpadea y muere. La oscuridad cae de golpe sobre un '
         + 'grupo de vecinos que pasaban. Murmullos nerviosos. En las Pilas, la oscuridad repentina nunca es solo eso.',
    opciones: [
      { texto: 'Intentar arreglar el farol con tu maña.', lleva:'ev2_farol_2' },
      { texto: 'Usar la confusión para seguir rápido.', efectos:{ disociacion:+2 },
        resultado:'Aprovechas la penumbra para cruzar sin que nadie te mire. A veces la oscuridad es un regalo. Sigues, una sombra más entre sombras.' }
    ]
  },
  'ev2_farol_2': {
    img: 'HOUSING_BLOCK_B2',
    texto: 'Trepas al poste a tientas. El contacto está suelto, nada grave para quien sepa mirar. Abajo, los '
         + 'vecinos esperan en silencio, como si tu pequeña reparación fuera lo único importante del mundo ahora.',
    opciones: [
      { texto: 'Recolocar el contacto y devolver la luz.', efectos:{ fatiga:+4, aislamiento:-5, creditos:+15 },
        resultado:'Aprietas el contacto y el farol revive, parpadea y se queda. Un murmullo de alivio sube desde abajo. Bajas y alguien te pone unos créditos en la mano sin decir nada. La luz, aquí, es un bien que se agradece con hechos.' },
      { texto: 'Bajar: es más peligroso de lo que pensabas.', efectos:{ fatiga:+2, disociacion:+2 },
        resultado:'A medio arreglo notas el cosquilleo de la corriente y decides no jugártela. Bajas con cuidado. "Lo has intentado", dice una voz en la oscuridad. En las Pilas, intentarlo ya cuenta.' }
    ]
  }

  };
  Object.assign(ESCENAS_GUION, L);
})();
