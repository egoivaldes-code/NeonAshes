// ============================================================
// BLOQUE JS-94 — CASOS SUELTOS (segunda tanda, v0.159)
// ------------------------------------------------------------
// Tres casos autoconclusivos de Fase Tierra. NO tocan la trama
// (ni CERO, ni Centauri, ni tramaNivel). Sandbox: los combates
// son EVITABLES y NO letales (contexto KO). Cada caso se juega
// una vez (repetible + bandera _hecho, patrón de v0.154.1) y
// PLANTA una semilla nueva para cosechar más adelante.
//
//   "El inquilino de arriba" (ia_)  -> deuda / HELIX. Semilla: ia_saqueaste
//   "La niña que memoriza"   (nm_)  -> memoria / vigilancia. Semilla: nm_expusiste / nm_protegiste
//   "El que devuelve cosas"  (dc_)  -> misterio / Ecos. Semilla: dc_robaste / dc_amigo
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const C = {

  // ========================================================
  //  CASO 1 — "EL INQUILINO DE ARRIBA" (deuda / HELIX)
  // ========================================================
  'ia_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'ia_hecho' },
    img: 'APT',
    texto: 'El vecino de arriba, Fenn, lleva días sin bajar. Fenn siempre baja: a por agua, a quejarse, a pedir. Ahora, del rellano de su puerta '
         + 'baja otra cosa: un olor dulzón que la ventilación no termina de tragar. La administración del bloque ha pegado un aviso impreso, '
         + 'limpio, sin una arruga: «Unidad en proceso de regularización. No acceder.»',
    opciones: [
      { texto: 'Subir a mirar. Al diablo el aviso.',
        lleva: 'ia_puerta' },
      { texto: 'No es asunto tuyo. Bajar la persiana y callar.',
        efectos:{ marcaVisto:'ia_hecho', humano:{ aislamiento:+3, disociacion:+2 } },
        resultado: 'Bajas la persiana y subes el volumen del terminal hasta tapar el silencio de arriba. En las Pilas, la puerta que no abres es '
                 + 'una forma de seguir vivo. Días después, unos operarios sin logotipo se llevan la unidad de Fenn en cajas y montan a otro '
                 + 'inquilino, como quien cambia una bombilla. Nadie pregunta. Tú tampoco.' }
    ]
  },
  'ia_puerta': {
    img: 'APT',
    texto: 'La puerta de Fenn cede: el cierre está reventado desde dentro, no forzado desde fuera. Fenn está en su sillón, quieto, con esa palidez '
         + 'que no se confunde con dormir. No hay sangre, no hay pelea. Sobre la mesa, un fajo de papeles con el sello de una financiera y, en '
         + 'todos, la misma firma temblorosa de Fenn cediendo algo llamado «disponibilidad vital anticipada» a cambio de saldar una deuda.',
    opciones: [
      { texto: 'Leer los papeles con calma.',
        efectos:{ marcaVisto:'ia_leido' },
        resultado: 'Lo entiendes despacio, y desearías no entenderlo. Fenn debía más de lo que iba a ganar viviendo. Así que empeñó lo único que '
                 + 'le quedaba: sus años, su cuerpo, su «disponibilidad». Una cláusula permite «ejecución anticipada del activo» si el deudor deja '
                 + 'de ser rentable. Vinieron a cobrar en carne. Todo firmado. Todo en regla. Nadie ha hecho nada ilegal.', lleva:'ia_decision' },
      { texto: 'No tocar nada y decidir ya qué haces.',
        lleva: 'ia_decision' }
    ]
  },
  'ia_decision': {
    img: 'APT',
    texto: 'Fenn ya no necesita nada. Tú sí. Y el pasillo entero duerme sin saber que la misma letra pequeña que se llevó a Fenn está en los '
         + 'contratos de medio bloque.',
    opciones: [
      { texto: 'Llevarte lo que valga algo. Fenn no va a echarlo de menos.',
        efectos:{ creditos:+90, item:'Chip de crédito de Fenn', marcaVisto:'ia_saqueaste', humano:{ disociacion:+6, aislamiento:+2 } },
        resultado: 'Coges lo aprovechable —créditos, un chip, poco más— y sales antes de que llegue nadie. Sobrevives un poco mejor esta semana. '
                 + 'Pero le has quitado a un muerto lo que un muerto ya no defiende, y eso deja un poso. En las Pilas se aprende a mirar hacia otro '
                 + 'lado; lo que cuesta es no reconocerse en la persona que lo hace.', lleva:'ia_fin' },
      { texto: 'Avisar al bloque de la letra pequeña que mató a Fenn.',
        efectos:{ reputacion:+4, humano:{ aislamiento:-2 } },
        resultado: 'Vas puerta por puerta contando lo que viste, enseñando la cláusula. Algunos te cierran en las narices; otros palidecen y '
                 + 'sacan sus propios contratos a leerlos por primera vez. No salvas a Fenn, pero puede que salves a dos o tres que aún estaban a '
                 + 'tiempo de no firmar la siguiente. En el bloque, a partir de hoy, alguien te debe algo que no son créditos.', lleva:'ia_fin' },
      { texto: 'Reportarlo a la administración, como toca.',
        efectos:{ creditos:+30, humano:{ disociacion:+4 } },
        resultado: 'Avisas por el canal oficial. Llegan rápido, educados, con guantes. Te agradecen «su colaboración ciudadana», te abonan una '
                 + 'pequeña compensación por las molestias y sellan la puerta. Al día siguiente el aviso impreso ha cambiado: «Unidad '
                 + 'regularizada.» Ni una palabra de Fenn. El sistema no tapó un crimen: es que, para el sistema, no lo hubo.', lleva:'ia_fin' }
    ]
  },
  'ia_fin': {
    img: 'APT',
    texto: 'Esa noche el rellano de arriba vuelve a estar en silencio, pero es otro silencio. Fenn debía dinero, y en Las Pilas deber dinero es '
         + 'una enfermedad terminal que nadie llama por su nombre.',
    opciones: [
      { texto: 'Cerrar la puerta y seguir.',
        efectos:{ marcaVisto:'ia_hecho' },
        resultado: 'Cierras. Mañana hay que pagar tu propio alquiler, y esa idea, hoy, da un poco más de miedo que ayer.' }
    ]
  },

  // ========================================================
  //  CASO 2 — "LA NIÑA QUE MEMORIZA" (memoria / vigilancia)
  // ========================================================
  'nm_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'nm_hecho' },
    img: 'MERCADO',
    texto: 'En una esquina del mercado, una cría de no más de diez años recita, por una moneda, mensajes que se ha aprendido de memoria: recados '
         + 'de gente que no puede permitirse dejar rastro en la red. La llaman Wren. Hoy no canturrea como siempre. Está pálida, mira demasiado a '
         + 'los lados, y cuando pasas cerca te agarra la manga sin soltarla. «Señor. Llevo un recado que no debí aprenderme. Y creo que alguien '
         + 'quiere que se me olvide para siempre.»',
    opciones: [
      { texto: 'Agacharte y escucharla.',
        lleva: 'nm_escucha' },
      { texto: 'Darle una moneda y seguir. Tú no estás para líos.',
        efectos:{ marcaVisto:'nm_hecho', creditos:-5, humano:{ disociacion:+3 } },
        resultado: 'Le dejas una moneda en la mano y te vas. A tu espalda, la oyes empezar a recitar el recado a otro, con la voz temblando. Días '
                 + 'después el rincón de Wren está vacío, y nadie en el mercado quiere hablar de por qué. Preguntar demasiado tampoco es gratis, así '
                 + 'que no preguntas. Pero el hueco donde ella se sentaba se te queda en el ojo cada vez que pasas.' }
    ]
  },
  'nm_escucha': {
    img: 'MERCADO',
    texto: 'Wren baja la voz hasta casi nada. «Un hombre me pagó por aprender un mensaje y llevárselo a alguien de arriba. Pero el que tenía que '
         + 'recibirlo apareció flotando en un canal. Y ahora el hombre que me pagó me busca, porque yo soy la única copia que queda del recado. '
         + 'Yo no lo entiendo, señor. Solo lo tengo aquí.» Se toca la sien. Al fondo del mercado, un tipo grande de abrigo largo pregunta a los '
         + 'puestos, señalando hacia esta esquina.',
    opciones: [
      { texto: 'Sacarla de aquí ya, antes de que el del abrigo llegue.',
        lleva: 'nm_huida' },
      { texto: 'Que te recite el recado primero. Quieres saber en qué te metes.',
        efectos:{ marcaVisto:'nm_oiste' },
        resultado: 'Wren cierra los ojos y recita, monótona, algo que no debería estar en la cabeza de una niña: nombres, un número de expediente, '
                 + 'una frase sobre «un traslado que no figura» y «la mercancía del nivel siete». No entiendes el todo, pero entiendes lo bastante '
                 + 'para saber que el recado es una condena para quien lo tenga. Y ella lo tiene entero. El del abrigo ya está a tres puestos.', lleva:'nm_huida' }
    ]
  },
  'nm_huida': {
    img: 'MERCADO',
    texto: 'El del abrigo os ha visto. No corre —no le hace falta—, pero acorta camino entre los puestos con la calma del que ha hecho esto muchas '
         + 'veces. Wren te aprieta la mano. Tienes segundos para decidir de qué lado estás.',
    opciones: [
      { texto: 'Ponerte en medio y sacarla por la trastienda.',
        pelea: {
          texto: 'El del abrigo no quiere escándalo en el mercado: quiere a la niña, callada, y a ti fuera de en medio. Trabaja rápido y sin '
               + 'aspavientos. Si aguantas lo justo para meter a Wren por la trastienda y trabar la puerta, habrás ganado.',
          integridad: 14,
          enemigos: [
            { nombre:'El del abrigo', desc:'Limpiador. Rápido, frío, eficiente', tipo:'rapido', integridad:6, fuerza:5, umbral:5 }
          ],
          gana: 'nm_salvada',
          pierde: 'nm_perdida'
        } },
      { texto: 'Apartarte. Que el hombre coja lo suyo.',
        efectos:{ creditos:+80, marcaVisto:'nm_expusiste', humano:{ disociacion:+8, aislamiento:+3 } },
        resultado: 'Das un paso atrás y sueltas la mano de Wren. El del abrigo te desliza unos créditos al pasar, sin mirarte, como quien paga un '
                 + 'peaje. Se lleva a la niña sin ruido; ella no grita, solo te busca con los ojos hasta que la multitud la traga. Cobras por no '
                 + 'haber hecho nada. Es el dinero más limpio y más sucio que has tocado. Te dura poco en el bolsillo y mucho en otra parte.', lleva:'nm_fin' }
    ]
  },
  'nm_salvada': {
    img: 'MERCADO',
    texto: 'Metes a Wren por la trastienda y trabas la puerta con una barra mientras el del abrigo golpea una vez, dos, y luego —porque un '
         + 'profesional sabe cuándo un trabajo se ha torcido— deja de golpear. Silencio. Wren respira como un fuelle roto, pero respira.',
    opciones: [
      { texto: 'Llevarla con alguien que la esconda de verdad.',
        efectos:{ reputacion:+5, marcaVisto:'nm_protegiste', humano:{ fatiga:+8, aislamiento:-2 } },
        resultado: 'La llevas por rutas de servicio hasta una vieja de la Iglesia del Eco que acoge a los que el sistema prefiere olvidar. Wren te '
                 + 'suelta la mano al llegar, y por primera vez en el día no mira a los lados. «Me aprenderé tu cara —dice—. Yo no olvido las caras '
                 + 'buenas.» En una ciudad que vive de borrar gente, alguien acaba de decidir recordarte. Eso, aquí, vale más que los créditos.', lleva:'nm_fin' }
    ]
  },
  'nm_perdida': {
    img: 'MERCADO',
    texto: 'No aguantas. El del abrigo te quita de en medio con dos golpes secos y sin rencor, como se aparta una silla. Cuando te incorporas, '
         + 'mareado, el rincón está vacío. Wren ya no está.',
    opciones: [
      { texto: 'Levantarte y tragar lo que acaba de pasar.',
        efectos:{ condicion:'conmocion', marcaVisto:'nm_expusiste', humano:{ fatiga:+10, disociacion:+7 } },
        resultado: 'Lo intentaste. No bastó. En las Pilas, intentarlo y no bastar es casi la regla, pero eso no lo hace más ligero. Te queda el '
                 + 'peso de una manita apretando la tuya y soltándola sin querer. Ojalá el recado que llevaba se pierda con ella; ojalá no.', lleva:'nm_fin' }
    ]
  },
  'nm_fin': {
    img: 'MERCADO',
    texto: 'El mercado sigue igual que siempre, ruidoso e indiferente, tragándose lo que pasa como se traga la lluvia. Solo tú sabes que en una '
         + 'esquina, hoy, se ha decidido algo pequeño y enorme a la vez.',
    opciones: [
      { texto: 'Seguir con lo tuyo.',
        efectos:{ marcaVisto:'nm_hecho' },
        resultado: 'Sigues. Pero durante un tiempo, cada vez que oigas a un crío recitar algo de memoria, se te va a encoger algo por dentro.' }
    ]
  },

  // ========================================================
  //  CASO 3 — "EL QUE DEVUELVE COSAS" (misterio / Ecos)
  // ========================================================
  'dc_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'dc_hecho' },
    img: 'SECTOR7_STREETS',
    texto: 'Un hombre menudo y tranquilo te para en la calle. Lo has visto antes: por el barrio lo llaman Ottol, «el que devuelve cosas». Recupera '
         + 'objetos perdidos o robados y los devuelve a sus dueños, gratis, sin explicar cómo los encuentra. Hoy te tiende algo a ti: una baratija '
         + 'que perdiste hace meses y de la que no le has hablado a nadie. «Se te cayó cerca del canal —dice con suavidad—. Se te da mal cuidar lo '
         + 'que te importa. No pasa nada. Para eso estoy.»',
    opciones: [
      { texto: 'Cogerla y preguntarle cómo demonios sabía que era tuya.',
        lleva: 'dc_taller' },
      { texto: 'Seguirlo de lejos cuando se vaya. Algo no cuadra.',
        efectos:{ marcaVisto:'dc_seguiste' },
        resultado: 'Lo sigues dos niveles a través de callejones que se estrechan. No mira atrás ni una vez, pero en un cruce se detiene, sin '
                 + 'volverse, y dice a la nada —o a ti—: «Ya casi hemos llegado. No hace falta que te escondas.» Se te eriza la nuca. Cuando '
                 + 'dobla la esquina y lo alcanzas, hay una puerta abierta esperándote.', lleva:'dc_taller' },
      { texto: 'No querer nada raro. Devolverle la baratija y marcharte.',
        efectos:{ marcaVisto:'dc_hecho', humano:{ disociacion:+2 } },
        resultado: 'Le devuelves la cosa y te vas rápido. «Como quieras —dice, sin ofenderse—. Volverá a ti de todos modos. Las cosas que '
                 + 'importan siempre vuelven.» No miras atrás. Días después te encuentras la baratija en tu propio bolsillo, y juras que no la '
                 + 'pusiste ahí. Decides no pensar en ello. Es lo más sano que puedes hacer.' }
    ]
  },
  'dc_taller': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'El taller de Ottol es un santuario del objeto perdido: estanterías hasta el techo, cada cosa con una etiqueta escrita a mano —un '
         + 'nombre, un lugar, una fecha—. Un anillo. Unas gafas. Un juguete quemado. «Todo tiene dueño —dice—. La gente cree que pierde cosas. '
         + 'No las pierde: las cosas se apartan un tiempo y esperan.» Te mira demasiado rato. «Tú perdiste algo más que una baratija junto a ese '
         + 'canal. Eso también lo sé. Pero eso no te lo puedo devolver yo.»',
    opciones: [
      { texto: 'Preguntarle qué es, exactamente, lo que sabe de la gente.',
        efectos:{ marcaVisto:'dc_hablaste' },
        resultado: 'Ottol se encoge de hombros. «Escucho. La ciudad guarda todo lo que pasa; solo hay que ponerse quieto y dejar que lo cuente. '
                 + 'A veces oigo cosas que aún no han pasado. Esas no las digo.» Se ríe bajito, sin malicia, como quien lleva mucho tiempo solo con '
                 + 'una verdad demasiado grande para compartirla. No sabes si es un iluminado, un estafador con buena memoria, o algo que sería '
                 + 'mejor no nombrar. Ninguna de las tres opciones te deja tranquilo.', lleva:'dc_decision' },
      { texto: 'Fijarte, con ojo de oficio, en cómo consigue todo esto.',
        req:{ profesion:{ id:'investigador' } }, pista:'haría falta oficio de investigador',
        efectos:{ marcaVisto:'dc_hablaste' },
        resultado: 'Lees el taller como se lee una escena. Las etiquetas están fechadas… algunas en el futuro. Los objetos «perdidos» encajan con '
                 + 'una lista de desapariciones y robos que ningún registro público conecta. Ottol no roba ni adivina: sabe. De algún modo, esta '
                 + 'ciudad le habla, o él oye lo que otros llaman ruido. Es la primera vez que rozas algo así, y no será la última.', lleva:'dc_decision' }
    ]
  },
  'dc_decision': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'Ottol vuelve a lo suyo, etiquetando, como si tú fueras un objeto más que tarde o temprano encontrará su sitio. En estas estanterías '
         + 'hay cosas que valen dinero de verdad. Y hay, también, un hombre solo que sabe demasiado y no se lo cuenta a nadie.',
    opciones: [
      { texto: 'Dejarlo en paz. Incluso volver, algún día, a escucharle.',
        efectos:{ reputacion:+2, marcaVisto:'dc_amigo', humano:{ aislamiento:-3 } },
        resultado: 'Le das las gracias de verdad y te vas sin llevarte nada que no sea tuyo. En la puerta, Ottol dice: «Vuelve cuando pierdas algo '
                 + 'importante. O cuando lo pierda yo.» En una ciudad de desconocidos, acabas de hacer la cosa más rara de todas: un amigo raro y '
                 + 'callado que, sospechas, sabrá encontrarte cuando lo necesites. Sales con una calma que hacía mucho que no sentías.', lleva:'dc_fin' },
      { texto: 'Cuando se distraiga, llevarte lo que puedas.',
        efectos:{ creditos:+150, item:'Anillo sin dueño (dicen)', marcaVisto:'dc_robaste', humano:{ disociacion:+7, aislamiento:+3 } },
        resultado: 'Te embolsas lo que brilla y sales rápido. Ottol no te detiene; ni siquiera levanta la vista. Solo dice, mientras cierras: '
                 + '«Volverá a mí. Y tú también, a devolverlo. Todavía no lo sabes.» El anillo te quema en el bolsillo el resto del día. Has robado '
                 + 'al único de este barrio que parecía guardar las cosas por cariño, y algo te dice que eso se paga de una forma que no entiendes.', lleva:'dc_fin' },
      { texto: 'Destaparlo: contar por el barrio lo que hay aquí dentro.',
        efectos:{ reputacion:-3, marcaVisto:'dc_destapaste', humano:{ disociacion:+4 } },
        resultado: 'Corres la voz de que Ottol tiene un almacén lleno de objetos «encontrados». Algunos van a reclamar lo suyo; otros, a llevarse '
                 + 'lo que pillen. Para cuando la cosa se calma, el taller está vacío y Ottol ha desaparecido, como si nunca hubiera estado. En el '
                 + 'sitio donde estaba su puerta, un vecino jura que ahí siempre hubo pared. Tú sabes que no. ¿Verdad que lo sabes?', lleva:'dc_fin' }
    ]
  },
  'dc_fin': {
    img: 'SECTOR7_STREETS',
    texto: 'Sales a la calle y el barrio sigue igual: lluvia fina, luces cansadas, gente que ha perdido cosas y no lo sabe todavía. Pero algo en '
         + 'cómo miras las esquinas ha cambiado un poco.',
    opciones: [
      { texto: 'Seguir andando.',
        efectos:{ marcaVisto:'dc_hecho' },
        resultado: 'Sigues. Y durante días revisas dos veces los bolsillos, no sabes bien buscando qué: algo que perdiste, o algo que temes '
                 + 'encontrar de vuelta.' }
    ]
  }

  };

  Object.keys(C).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = C[id]; });

})();
