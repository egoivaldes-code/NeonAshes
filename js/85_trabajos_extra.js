// ============================================================
// BLOQUE JS-85 — TRABAJOS DE PROFESIÓN AÑADIDOS (v0.150)
// ------------------------------------------------------------
// Más vida profesional para la Fase Tierra (sandbox, NO trama principal).
// Cada oficio es una puerta distinta al mismo mundo. Mismo patrón que
// js/72: entrada con cond.profesion, resto por 'lleva', se juega una vez.
// Esta tanda permite gore un punto más explícito cuando la escena lo
// justifica, y deja recompensa o desventaja casi siempre.
//
// Solo imágenes, items y condiciones que ya existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ============================================================
  // CAZARRECOMPENSAS — "El que no quería volver"
  // Un encargo sencillo que se pudre en cuanto tocas la puerta.
  // ============================================================
  'prof_caza_b1': {
    entrada: true,
    cond: { profesion: 'cazarrecompensas' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El contrato es de los fáciles: un tal Böhm, moroso de poca monta, escondido en un cubículo del nivel bajo. '
         + 'Traerlo vivo. Pero cuando llegas, la puerta está entornada y de dentro sale un olor dulzón que conoces demasiado bien. '
         + 'Böhm está en el suelo, con la garganta abierta de lado a lado y una sonrisa roja de más. Lleva muerto medio día. '
         + 'Alguien llegó antes que tú.',
    opciones: [
      { texto: 'Registrar el cubículo antes de que aparezca nadie.', efectos:{ disociacion:+3 },
        resultado: 'Trabajas rápido, respirando por la boca. Bajo el colchón manchado encuentras la razón por la que a Böhm lo callaron: '
                 + 'un fajo de créditos y un chip que no es suyo. Y entonces oyes pasos en el pasillo.', lleva:'prof_caza_b2' },
      { texto: 'No tocar nada y avisar al que puso el contrato.', efectos:{ creditos:+30, aislamiento:+2 },
        resultado: 'Le mandas la prueba de que Böhm ya está saldado, a su manera. Te paga la mitad «por las molestias» y te dice que '
                 + 'olvides la dirección. Cobras poco, pero sales limpio, y en tu oficio salir limpio de una habitación así ya es ganar.' }
    ]
  },
  'prof_caza_b2': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'En la puerta hay dos hombres. Uno mira el cadáver, luego el chip en tu mano, y sonríe sin ninguna gana. «Eso es nuestro, '
         + 'colega. Y tú no estabas aquí.» El otro ya tiene la mano en el cinturón. El pasillo es estrecho. No hay ventana. Solo ellos y la puerta.',
    opciones: [
      { texto: 'Devolver el chip y salir con vida.', efectos:{ creditos:+30 },
        resultado: 'Sueltas el chip en la mano abierta del que sonríe. Te dejan quedarte el fajo «por ser listo» y te marcas la cara de los dos '
                 + 'para otro día. Cobras algo, vives, y aprendes de quién es el barrio esta semana.' },
      { texto: 'Quedártelo. Que vengan a por él.',
        resultado: 'Aprietas el chip en el puño. El que sonríe deja de sonreír. El estrecho del pasillo, que era su ventaja, va a ser la tuya.',
        pelea: {
          texto: 'Dos contra uno en tres metros de pasillo. Sin sitio para correr, sin sitio para que ellos se coordinen. Aquí gana quien '
               + 'aguante más y piense más rápido, no quien pegue más fuerte.',
          integridad: 12,
          enemigos: [
            { nombre:'El que sonríe', desc:'Cuchillo largo, mano firme', tipo:'rapido', integridad:4, fuerza:4, umbral:4 },
            { nombre:'El del cinturón', desc:'Más lento, más grande', tipo:'bruto', integridad:5, fuerza:4, umbral:5 }
          ],
          gana: 'prof_caza_b3',
          pierde: 'prof_caza_malherido'
        } }
    ]
  },
  'prof_caza_b3': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Cuando termina, el pasillo está peor de lo que estaba, y ya estaba mal. Respiras. El chip sigue en tu puño, pegajoso. '
         + 'Sea lo que sea, alguien ha matado dos veces por él en un día.',
    opciones: [
      { texto: 'Vender el chip a quien no haga preguntas.', efectos:{ creditos:+180, disociacion:+4 },
        resultado: 'Un intermediario del mercado gris te lo compra caro y sin mirarte. No sabes qué había dentro y prefieres no saberlo. '
                 + 'Cobras bien. Duermes mal. En tu oficio, casi siempre es ese el cambio.' }
    ]
  },
  'prof_caza_malherido': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Eran dos, y el pasillo era estrecho también para ti. Sales de allí a rastras, dejando tu propia sangre mezclada con la de Böhm. '
         + 'El chip se queda atrás, en la mano de alguien que ya no sonríe pero tampoco lo suelta.',
    opciones: [
      { texto: 'Arrastrarte a que te curen.', efectos:{ condicion:'hemorragia', fatiga:+14, disociacion:+6 },
        resultado: 'Un médico clandestino te cose por lo que no llevas encima, apuntándotelo como deuda. Vives. Sin chip, sin cobro y con una '
                 + 'cuenta pendiente. Hay contratos que solo pagan en cicatrices.' }
    ]
  },

  // ============================================================
  // HACKER — "La cámara que grabó de más"
  // Un trabajito de borrar imágenes se convierte en algo que preferirías
  // no haber visto.
  // ============================================================
  'prof_hack_b1': {
    entrada: true,
    cond: { profesion: 'hacker' },
    img: 'SECTOR7_STREETS',
    texto: 'Un tendero te paga una miseria por borrar diez minutos de la cámara de su callejón: dice que salió meando y no quiere multa. '
         + 'Tontería. Entras en el archivo de la cámara desde tu terminal y encuentras los diez minutos. No hay ningún tendero meando. '
         + 'Hay una furgoneta sin placas, y dos personas metiendo en ella un bulto del tamaño de un cuerpo que no termina de estar quieto.',
    opciones: [
      { texto: 'Borrar lo que te pidió y nada más. No es tu asunto.', efectos:{ creditos:+25, disociacion:+3 },
        resultado: 'Borras los diez minutos, cobras tu miseria y cierras la sesión. Esa noche el bulto que no estaba quieto se te repite '
                 + 'detrás de los párpados. Cumpliste el encargo. Eso tendrá que bastarte.' },
      { texto: 'Copiar el metraje antes de borrarlo.', efectos:{ disociacion:+2 },
        resultado: 'Sacas una copia limpia antes de borrar el original, sin saber muy bien para qué. Cuando lo repasas, la matrícula de la '
                 + 'furgoneta está tapada… pero el reflejo en un charco no lo está.', lleva:'prof_hack_b2' }
    ]
  },
  'prof_hack_b2': {
    img: 'SECTOR7_STREETS',
    texto: 'El reflejo te da media matrícula y un logotipo parcial: una subcontrata médica que trabaja para HELIX. Recogida de "material '
         + 'biológico no reclamado". Así lo llaman. Tienes una copia que no deberías tener de algo que nadie quiere que exista.',
    opciones: [
      { texto: 'Vendérsela a un periodista filtrador.', efectos:{ creditos:+120, reputacion:+2 },
        resultado: 'Una filtradora te la compra con los ojos brillándole de miedo y de codicia. «Esto o me hace o me entierra», dice. '
                 + 'Cobras bien y te ganas un contacto en la prensa gris. También te ganas figurar, en algún sitio, como el origen de la copia.' },
      { texto: 'Guardarla y borrar tu rastro. Un seguro para el futuro.', efectos:{ item:'Copia cifrada: furgoneta', disociacion:+3 },
        resultado: 'Cifras la copia, la escondes bien y limpias por dónde has pasado. No es dinero. Es otra cosa: una carta guardada bajo la '
                 + 'manga para el día, seguro que llega, en que necesites que alguien poderoso te deba silencio.' }
    ]
  },

  // ============================================================
  // SCAVENGER — "Lo que guardaba el colchón"
  // El ojo del chatarrero encuentra oro donde otros solo ven un muerto.
  // ============================================================
  'prof_scav_b1': {
    entrada: true,
    cond: { profesion: 'scavenger' },
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Un cubículo vaciado por impago, listo para el siguiente inquilino. Los demás ya lo han repasado y no han visto nada. Tú sí: '
         + 'el colchón pesa raro. Lo abres de un tajo y, entre la espuma, hay un hombre pequeño y muy muerto, momificado por el aire seco '
         + 'de los conductos, abrazado a una bolsa. Llevaba aquí meses, escondido de algo, hasta que se le acabó el esconderse.',
    opciones: [
      { texto: 'Sacarle la bolsa de entre los brazos.', efectos:{ disociacion:+4 },
        resultado: 'Tienes que separarle los dedos secos uno a uno; crujen como ramas. Dentro de la bolsa hay algo que sí vale, y algo que '
                 + 'no vale nada pero pesa más.', lleva:'prof_scav_b2' },
      { texto: 'Dejarlo en paz y quedarte solo la chatarra del cubículo.', efectos:{ item:'chatarra', creditos:+20, aislamiento:+2 },
        resultado: 'Vuelves a taparlo con la espuma, como si eso arreglara algo, y te llevas solo los cables y la placa de la pared. '
                 + 'Menos dinero, pero hay cosas que un chatarrero decente no le quita a un muerto abrazado a ellas.' }
    ]
  },
  'prof_scav_b2': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'En la bolsa: un módulo de datos de gama alta, de los que no se ven por aquí, y una carta de papel —papel de verdad— doblada '
         + 'mil veces, dirigida a un nombre de mujer, sin dirección, sin sello, imposible de enviar. La escribió y la guardó, sabiendo '
         + 'que nunca saldría de este colchón.',
    opciones: [
      { texto: 'Vender el módulo. La carta no vale nada.', efectos:{ creditos:+150, disociacion:+3 },
        resultado: 'El módulo te da para respirar dos semanas. La carta la dejas caer entre la espuma, con él. No es asunto tuyo. '
                 + 'Te lo repites todo el camino de vuelta, y sigue sin serlo, y sigue pesándote.' },
      { texto: 'Vender el módulo e intentar hacer llegar la carta.', efectos:{ creditos:+150, reputacion:+3, humano:{ aislamiento:-2 } },
        resultado: 'Vendes el módulo igual, pero te guardas la carta y, con el nombre y algo de paciencia, das con la mujer en otro nivel. '
                 + 'No preguntas quién era él. Le entregas el papel y te vas antes de verla abrirlo. No cobras por eso. Se cobra solo.' }
    ]
  },

  // ============================================================
  // CONTRABANDISTA — "Carga que no se declara"
  // Un tubo sellado, una ruta, y la mala idea de mirar dentro.
  // ============================================================
  'prof_contra_b1': {
    entrada: true,
    cond: { profesion: 'contrabandista' },
    img: 'EXP_CANAL_PILAS',
    texto: 'Un intermediario te pasa un tubo sellado del tamaño de un antebrazo y una ruta: del canal al nivel medio, esquivando el control '
         + 'de HELIX del ascensor. «No preguntes, no lo abras, no llegues tarde. La mitad ahora, la mitad al entregar.» Pesa poco. Los paquetes '
         + 'que pesan poco son los que dan miedo.',
    opciones: [
      { texto: 'Llevarlo por la ruta acordada, sin abrirlo.', efectos:{ creditos:+80, humano:{ fatiga:+5 } },
        resultado: 'Cruzas los tres controles con la cara de aburrimiento del que hace esto cada día. Entregas el tubo cerrado, cobras la otra '
                 + 'mitad y te vas sin saber qué has movido. En tu oficio, no saber es parte del precio, y a veces lo que te salva.' },
      { texto: 'Buscar una esquina oscura y abrirlo un dedo, solo para saber.', efectos:{ humano:{ disociacion:+3 } },
        resultado: 'La curiosidad es mal negocio en esto, y aun así rajas el sello con cuidado de poder recerrarlo. Dentro, en frío seco, hay '
                 + 'algo que no querías ver.', lleva:'prof_contra_b2' }
    ]
  },
  'prof_contra_b2': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Frío seco, envoltorio médico y una etiqueta con un código de HELIX y una sola palabra: «compatible». No es droga. No es un arma. '
         + 'Es un trozo de alguien, empaquetado para meterse en otro alguien que pueda pagarlo. Vuelves a sellar el tubo con las manos algo torpes.',
    opciones: [
      { texto: 'Entregarlo igual. Un trato es un trato.', efectos:{ creditos:+80, humano:{ disociacion:+4 } },
        resultado: 'Cumples, cobras, y no duermes bien. Ahora sabes en qué cadena eres un eslabón. Podrías dejarlo. Los dos sabéis que no lo '
                 + 'harás: comer también es un trato.' },
      { texto: 'Quedártelo y colocarlo tú a quien lo necesite de verdad.', efectos:{ creditos:+220, reputacion:-2, humano:{ disociacion:+5 } },
        resultado: 'Rompes el trato y vendes la pieza por tu cuenta, al triple, a la familia desesperada de un enfermo. Ganas mucho más y un '
                 + 'enemigo: el intermediario no perdona, y tu nombre queda marcado en según qué puertas. Comer sale caro de todas formas.' }
    ]
  },

  // ============================================================
  // SEGURIDAD — "El turno de noche"
  // Vigilar un almacén de HELIX y encontrarte cara a cara con lo que el
  // sistema llama "pérdida" y tú sabes que es un padre sin salida.
  // ============================================================
  'prof_segu_b1': {
    entrada: true,
    cond: { profesion: 'seguridad' },
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Turno de noche vigilando un almacén de repuestos médicos de una subcontrata de HELIX. Ocho horas, buen dinero, aburrimiento '
         + 'garantizado. A las tres, un ruido. En la cámara: alguien ha forzado una rejilla y llena una mochila con cajas de analgésicos y '
         + 'antibióticos. No es un profesional. Se mueve como quien roba por primera vez, con las manos temblando.',
    opciones: [
      { texto: 'Reducirlo, como te pagan por hacer.', lleva:'prof_segu_reduce' },
      { texto: 'Encender la linterna y hablar antes de actuar.', efectos:{ humano:{ disociacion:+2 } },
        resultado: 'Le das el alto sin gritar. Se queda helado, y no saca un arma: saca una foto de un crío enfermo. «Es para mi hija. No llego. '
                 + 'Sabes que no llego.» No miente. Lo sabes porque tú tampoco llegas.', lleva:'prof_segu_decide' }
    ]
  },
  'prof_segu_reduce': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Vas directo. Pero el miedo de un padre pega fuerte, y lo que iba a ser un trámite se tuerce: forcejeáis entre las estanterías, '
         + 'caen cajas, y el tipo pelea como quien no tiene nada que perder.',
    opciones: [
      { texto: 'Terminar el trabajo.',
        pelea: {
          texto: 'No es un luchador. Es un desesperado, y eso a veces es peor: no busca ganarte, busca escapar, y se lleva por delante lo que haga falta.',
          integridad: 10,
          enemigos: [ { nombre:'El ladrón', desc:'Un padre sin nada que perder', tipo:'normal', integridad:4, fuerza:3, umbral:4 } ],
          gana:'prof_segu_gana', pierde:'prof_segu_pierde'
        } }
    ]
  },
  'prof_segu_gana': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Lo inmovilizas contra el suelo, jadeando los dos. La subcontrata te felicitará y a él le hará pagar con años que no le quedan lo '
         + 'que no tiene. Tienes su muñeca en tu mano y su vida en tu decisión.',
    opciones: [
      { texto: 'Entregarlo. Es tu trabajo.', efectos:{ creditos:+120, reputacion:-1, humano:{ disociacion:+5 } },
        resultado: 'Cobras el turno completo y una prima por «evitar pérdidas». Al hombre se lo lleva HELIX. No vuelves a saber de él, y esa es '
                 + 'la parte que se te queda: que no volver a saber de alguien, aquí, casi nunca es buena señal.' },
      { texto: 'Dejarlo ir con la mochila y borrar la grabación.', efectos:{ creditos:+60, reputacion:+3, humano:{ aislamiento:-2 } },
        resultado: 'Le dices que no vuelva por aquí y limpias los diez minutos de cámara. Cobras solo el turno, sin prima, y anotas un «falso '
                 + 'positivo del sensor». Arriesgas tu puesto por un desconocido. En las Pilas, eso también es un tipo de sueldo.' }
    ]
  },
  'prof_segu_pierde': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El desesperado te estrella contra una estantería con un empujón de los que solo da quien no tiene salida, y sale por la rejilla con '
         + 'su mochila. Cuando te levantas, dolorido, ya no está. Solo quedan cajas por el suelo y un turno que explicar.',
    opciones: [
      { texto: 'Recomponerte y cerrar el parte.', efectos:{ condicion:'costillas', fatiga:+10, creditos:+40 },
        resultado: 'Cobras el turno a medias y pones en el parte que fueron dos, encapuchados, profesionales. Nadie va a buscar a un padre con '
                 + 'antibióticos. Te duele el costado al respirar. Podría dolerte más la conciencia; decides que no.' }
    ]
  },
  'prof_segu_decide': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El hombre no se mueve. Espera tu decisión con la foto todavía en alto, como un escudo que sabe que no protege de nada.',
    opciones: [
      { texto: 'Dejarle llenar la mochila y desaparecer.', efectos:{ creditos:+60, reputacion:+3, humano:{ aislamiento:-2 } },
        resultado: 'Apagas la linterna. «No te he visto. No vuelvas.» Coge lo justo, no más —eso también dice quién es— y se va por la rejilla. '
                 + 'Cobras el turno limpio, sin prima, y anotas un fallo del sensor. Nadie se muere porque a HELIX le falten unos antibióticos.' },
      { texto: 'Entregarlo igual. Necesitas este trabajo.', efectos:{ creditos:+120, reputacion:-2, humano:{ disociacion:+6 } },
        resultado: 'Pulsas el aviso. Vienen a por él en cuatro minutos. No se resiste; casi parece aliviado de que se acabe. Cobras el turno y la '
                 + 'prima. La foto del crío se queda en el suelo del almacén, y tú te la llevas puesta detrás de los ojos, gratis.' }
    ]
  }

  };

  Object.keys(L).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = L[id]; });

})();
