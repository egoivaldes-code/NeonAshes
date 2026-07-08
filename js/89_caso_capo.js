// ============================================================
// BLOQUE JS-89 — CASO-CAPÍTULO: "EL AGUADOR" (v0.153)
// ------------------------------------------------------------
// Caso autoconclusivo LARGO (tipo capítulo), con antagonista de cara.
// NO es la misión principal: no toca Centauri, ni CERO, ni sube la
// bandera de trama.
//
// ANTAGONISTA (humano, comprensible, NO caricatura): Kessler, "el
// Aguador". Un hombre mayor y cansado que se apoderó de un nodo de
// distribución de HELIX cuando la corporación dejó morir de sed a varios
// bloques por "mantenimiento no rentable". Ahora él decide quién bebe y
// quién recibe medicinas. Media zona lo odia; la otra media estaría muerta
// sin él. El jugador debe dudar de si es un villano o solo alguien que
// sobrevive haciendo daño.
//
// ESTRUCTURA: gancho pequeño y personal -> descubres que todo cuelga de
// él -> acceso por varias vías (labia / sigilo / oficio / fuerza) ->
// encuentro y decisión. Combate DURO pero EVITABLE. Tres finales con
// consecuencias que se plantan como semillas para recoger más adelante:
//   cap_agua_pacto     pactaste con él (eres su mano)
//   cap_agua_forzado   le obligaste a abrir el agua (enemigo poderoso)
//   cap_agua_muerto    lo mataste (agua libre y luego el caos)
//
// Solo imágenes/condiciones/heridas que ya existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const A = {

  // ============================================================
  // MOVIMIENTO 1 — EL GANCHO (pequeño y personal)
  // ============================================================
  'ag_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'ag_hecho' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Un crío de no más de diez años te tira de la manga. Se llama Tobi. «Dicen que tú arreglas cosas.» Le tiembla la voz de aguantar '
         + 'el llanto como un adulto. «A mi abuela le cortaron el agua y la medicina. No pudimos pagar este mes. Y tose sangre.» Señala hacia '
         + 'su bloque, donde una fila de gente espera con garrafas vacías ante un grifo comunal seco. «Dicen que hay que hablar con el Aguador. '
         + 'Pero al Aguador no le habla cualquiera.»',
    opciones: [
      { texto: 'Ayudar al crío. Averiguar quién cortó ese grifo.',
        resultado: 'Le dices a Tobi que vas a ver qué se puede hacer. Se agarra a esa frase como a un salvavidas, y tú ya sabes que acabas de '
                 + 'meterte en algo más grande de lo que parece. Empiezas por el grifo seco.', lleva:'ag_indaga' },
      { texto: 'Darle agua y unos créditos, y seguir tu camino.',
        efectos:{ creditos:-30, marcaVisto:'ag_hecho', humano:{ aislamiento:+2 } },
        resultado: 'Le das tu cantimplora y lo que llevas suelto. Es algo, para hoy. Mañana el grifo seguirá seco y la abuela seguirá tosiendo, '
                 + 'y tú lo sabes mientras te alejas. No puedes con todo. Te lo repites hasta que casi funciona.' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 2 — TODO CUELGA DE ÉL (hub de investigación)
  // ============================================================
  'ag_indaga': {
    img: 'EXP_CANAL_PILAS',
    texto: 'El grifo comunal está intervenido: una tubería de HELIX desviada a mano, con una marca pintada —una gota dentro de un círculo— y un '
         + 'candado que no es de HELIX. Preguntando, la historia se repite en cada esquina: hace años HELIX cerró el mantenimiento de estos '
         + 'bloques por "no rentables", y el agua dejó de llegar. Entonces apareció el Aguador, arregló el nodo, y volvió a correr… con su precio. '
         + 'Ahora decide él quién bebe. Puedes ir directo a su base, o entender antes en qué te metes.',
    opciones: [
      { texto: 'Escuchar a los que lo odian.',
        cond:{ noVisto:'ag_v' }, lleva:'ag_victimas' },
      { texto: 'Escuchar a los que dependen de él.',
        cond:{ noVisto:'ag_d' }, lleva:'ag_dependientes' },
      { texto: 'Ir a su base a verle la cara.',
        lleva:'ag_base' }
    ]
  },

  'ag_victimas': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Los que lo odian no tienen que buscar palabras. Una mujer te enseña la foto de un niño que no llegó a los seis años: fiebre, '
         + 'y los antibióticos que el Aguador guardaba para quien pudiera pagarlos. «No es que no los tuviera. Es que mi dinero no le llegaba.» '
         + 'Otro te enseña las manos peladas de acarrear agua sucia del canal porque la limpia se le puso a precio de sangre. Para ellos, el '
         + 'Aguador no es un salvador. Es un hombre que ha puesto precio a la sed.',
    opciones: [
      { texto: 'Guardarte sus historias y volver.',
        efectos:{ marcaVisto:'ag_v', humano:{ disociacion:+2 } }, lleva:'ag_indaga' }
    ]
  },

  'ag_dependientes': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Los que dependen de él tampoco buscan palabras, pero dicen lo contrario. Un anciano te agarra del brazo: «Tú no estabas cuando HELIX '
         + 'nos dejó seis meses sin una gota. Se murió gente de beber del canal. A los niños les salían llagas. Entonces vino Kessler, y hubo agua. '
         + 'Cara, sí. Pero agua.» Una enfermera de clínica pobre lo dice más frío: «Nos quedan medicinas porque él las consigue. Si mañana lo matan, '
         + 'pasado empezamos a enterrar gente otra vez. Piénsalo antes de hacerte el héroe.»',
    opciones: [
      { texto: 'Guardarte sus historias y volver.',
        efectos:{ marcaVisto:'ag_d', humano:{ disociacion:+1 } }, lleva:'ag_indaga' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 3 — EL ACCESO (varias vías)
  // ============================================================
  'ag_base': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'La base del Aguador es una vieja estación de filtrado que HELIX abandonó y él resucitó: tuberías reparadas mil veces, depósitos '
         + 'enormes goteando, y hombres armados que no parecen matones de alquiler, sino vecinos a los que Kessler dio de comer. Se entra por '
         + 'varios sitios. Ninguno gratis.',
    opciones: [
      { texto: 'Entrar como suplicante, a pagar o pedir por la abuela de Tobi.',
        efectos:{ humano:{ disociacion:+1 } },
        resultado: 'Te pones en la fila de los que vienen a rogar. Cuando llega tu turno, dices que vienes a arreglar una deuda de agua. Te miran, '
                 + 'te cachean, y te dejan pasar hasta él. Así de fácil: el Aguador recibe a quien viene a pagar.', lleva:'ag_dentro' },
      { texto: 'Colarte por los conductos de desagüe.',
        azar:{ prob:0.5,
          exito:{ resultado:'Te metes por un aliviadero seco y reptas entre tuberías hasta salir dentro del perímetro, a espaldas de los guardias. '
                          + 'Nadie te ha visto. Estás dentro y tienes ventaja.', lleva:'ag_dentro' },
          fallo:{ resultado:'A mitad del conducto, una reja cede con un estruendo de latón que despierta a medio recinto. Cuando sales al otro lado, '
                          + 'ya hay linternas buscándote.', lleva:'ag_pillado' } } },
      { texto: 'Sabotear el nodo para tenerlo cogido por el cuello.',
        req:{ profesion:{ id:'hacker' } }, pista:'haría falta oficio de hacker',
        efectos:{ marcaVisto:'ag_baza' },
        resultado: 'No entras a pelear: entras a los sistemas. Te haces con el control del nodo de distribución sin que se den cuenta, de forma '
                 + 'que con un gesto puedes cortarle el agua a él, a todos, en cualquier momento. Ahora tienes algo con lo que negociar que vale '
                 + 'más que cualquier arma. Entras a verle de frente, tranquilo.', lleva:'ag_dentro' },
      { texto: 'Entrar haciéndote pasar por seguridad de otro sector.',
        req:{ profesion:{ id:'seguridad' } }, pista:'haría falta oficio de seguridad',
        resultado: 'Conoces los gestos, el argot y la forma de plantarse de los que cobran por vigilar. Te acercas a los guardias del Aguador con '
                 + 'el aire de quien pertenece a un turno de otro sector, sueltas dos tecnicismos y una queja sobre el sueldo, y te dejan pasar '
                 + 'entre gruñidos de compañeros. De paso les has visto la cara de cerca, y confirmas lo que sospechabas: no son soldados, son '
                 + 'vecinos con miedo. Entras sabiendo con qué clase de gente tratas.', lleva:'ag_dentro' },
      { texto: 'Entrar a la fuerza.',
        resultado: 'Nada de rodeos. Vas hacia la puerta principal, y sus hombres —vecinos con miedo y un arma— se ponen en medio.', lleva:'ag_combate' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 4 — EL ENCUENTRO Y LA DECISIÓN
  // ============================================================
  'ag_dentro': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Kessler, el Aguador, no es lo que esperabas. Un hombre mayor, flaco, con las manos manchadas de cal y óxido de arreglar bombas él '
         + 'mismo. No hay trono, no hay lujo: hay un catre junto a un depósito y una lista de racionamiento pegada a la pared, con nombres tachados.<br><br>'
         + '«Vienes por la vieja del bloque siete. Tose sangre, ¿no?» No espera respuesta. «Puedo darle el agua y la medicina hoy mismo. Pero '
         + 'si se la doy gratis a ella, mañana vienen otros mil, y el nodo no da para mil gratis. Alguien tiene que decidir quién bebe. HELIX '
         + 'decidió dejaros morir a todos. Yo decido caso por caso. Dime tú cuál de los dos es peor.» Te sostiene la mirada, cansado. No miente. '
         + 'Ese es el problema.',
    opciones: [
      { texto: 'Aceptar su oferta: trabajar para él.',
        resultado: 'Kessler sonríe apenas. «Sabía que eras práctico.» Te explica el trato: le arreglas problemas —cobros, disputas, algún vecino '
                 + 'que se pasa de listo— y a cambio la abuela de Tobi bebe, y tú también, y cobras.', lleva:'ag_fin_pacto' },
      { texto: 'Apretarle: tienes su nodo cogido. Abre el agua a los que no pagan.',
        cond:{ visto:'ag_baza' },
        resultado: 'Le enseñas, desde tu propia lente, que su nodo responde a tus órdenes. La cara se le queda quieta. Un hombre que ha vivido de '
                 + 'controlar el grifo entiende enseguida lo que significa que ahora lo controles tú.', lleva:'ag_fin_forzado' },
      { texto: 'Ir a por él aquí y ahora.',
        resultado: 'No hay más que hablar. Kessler ni se inmuta; solo levanta una mano, y sus hombres entran por detrás de ti.', lleva:'ag_combate' },
      { texto: 'No es tu guerra. Marcharte.',
        efectos:{ marcaVisto:'ag_hecho', humano:{ aislamiento:+3, disociacion:+2 } },
        resultado: 'Le das la espalda y sales de la estación. Kessler no te detiene; ya ha visto marcharse a mucha gente. Vuelves donde Tobi sin '
                 + 'nada que darle salvo la verdad: que no supiste, o no quisiste, decidir por él. A veces marcharse también es una decisión, y '
                 + 'de las que más pesan.', lleva:null }
    ]
  },

  'ag_pillado': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Los guardias te rodean entre los depósitos, linternas en la cara. No disparan: esperan orden. Kessler aparece, sin prisa, secándose '
         + 'las manos en un trapo. «Por los conductos. Como las ratas.» No parece enfadado. Parece decepcionado, que es peor.',
    opciones: [
      { texto: 'Abrirte paso a la fuerza.', lleva:'ag_combate' },
      { texto: 'Rendirte y escuchar lo que tenga que decir.', lleva:'ag_dentro' }
    ]
  },

  'ag_combate': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'No son mercenarios. Son padres, hijos, vecinos a los que Kessler dio agua cuando nadie más lo hacía, y ahora se la devuelven '
         + 'poniéndose entre él y tú. Pelean torpe, pero pelean con lo que da el miedo a volver a tener sed. Que no sean profesionales no '
         + 'significa que no puedan matarte.',
    opciones: [
      { texto: 'Abrirte paso hasta Kessler.',
        pelea: {
          texto: 'Un enjambre desordenado en un recinto lleno de tuberías y charcos. Resbalas, te agarran, caen llaves de tubo. No hay honor '
               + 'aquí, solo gente desesperada por los dos bandos.',
          integridad: 14,
          enemigos: [
            { nombre:'Guardia del Aguador', desc:'Un vecino con una llave de tubo', tipo:'bruto', integridad:5, fuerza:4, umbral:5 },
            { nombre:'Guardia del Aguador', desc:'Joven, asustado, rápido', tipo:'rapido', integridad:4, fuerza:4, umbral:4 }
          ],
          refuerzoTurno: 2,
          refuerzoTurnoGrupo: [
            { nombre:'Guardia del Aguador', desc:'Otro más que no quiere volver a la sed', tipo:'normal', integridad:4, fuerza:4, umbral:4 }
          ],
          gana: 'ag_tras',
          pierde: 'ag_malherido'
        } }
    ]
  },

  'ag_tras': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Cuando cae el último, el recinto queda en silencio salvo por el goteo de los depósitos y algún gemido. Kessler no ha huido. Está de '
         + 'pie junto a su lista de racionamiento, viejo y sin miedo, esperándote. «Ya está. ¿Y ahora qué? Me matas, y el agua corre gratis una '
         + 'semana, hasta que el nodo se rompa o venga otro peor que yo a cogerlo. Tú decides. Como decidía yo.»',
    opciones: [
      { texto: 'Matarlo. Se acabó el que pone precio a la sed.',
        resultado: 'No dice nada más. Se lo debes a la mujer de la foto, o eso te dices mientras lo haces.', lleva:'ag_fin_muerto' },
      { texto: 'Perdonarle la vida a cambio de que abra el agua a quien no puede pagar.',
        resultado: 'Le pones la condición. Kessler te mira largo rato y al final asiente, despacio, como quien firma una rendición. «Tú sabrás lo '
                 + 'que provocas», dice. Pero lo hará.', lleva:'ag_fin_forzado' }
    ]
  },

  'ag_malherido': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Son demasiados y pelean por algo que para ellos es la vida. Acabas en el suelo, entre charcos, y unas manos te arrastran fuera del '
         + 'recinto y te dejan en la calle. No te rematan: Kessler no mata a quien ya no es problema. Lo último que oyes dentro es el goteo de '
         + 'los depósitos, intacto.',
    opciones: [
      { texto: 'Arrastrarte de vuelta con Tobi.',
        efectos:{ condicion:'hemorragia', fatiga:+15, disociacion:+8, marcaVisto:'ag_hecho' },
        resultado: 'Vuelves al bloque siete molido y con las manos vacías. El grifo sigue seco. La abuela de Tobi sigue tosiendo. El crío no te '
                 + 'reprocha nada, y eso es lo peor. Aprendes, a golpes, que querer ayudar no basta, y que en las Pilas los que ponen precio a la '
                 + 'sed no caen a la primera.' }
    ]
  },

  // ---- FINALES (cada uno planta su semilla) ----
  'ag_fin_pacto': {
    img: 'EXP_CANAL_PILAS',
    texto: 'La abuela de Tobi bebe agua limpia esa misma tarde, y le llega la medicina. El crío te mira como se mira a un héroe. Tú ya no te '
         + 'sientes uno.<br><br>'
         + 'Porque ahora eres la mano de Kessler. Te paga, te da agua, te da un sitio en el engranaje. Y el próximo mes, cuando otra familia no '
         + 'llegue a pagar, puede que seas tú el que llame a su puerta a cortarles el grifo. El agua de Tobi tiene un precio, y lo vas a ir '
         + 'pagando tú, a plazos, en la moneda que menos querías gastar.',
    opciones: [
      { texto: 'Aceptar en lo que te has convertido.',
        efectos:{ creditos:+180, reputacion:+2, marcas:['cap_agua_pacto','ag_hecho'], humano:{ disociacion:+6 } },
        resultado: 'Cobras bien y bebes seguro. Media zona te respeta ahora, porque respeta al Aguador, y tú eres suyo. La otra media te mira como '
                 + 'miraba la mujer de la foto. Has salvado a una abuela y te has vendido a la máquina que la tenía sedienta. Así se sobrevive aquí, '
                 + 'te dices. Así se sobrevive.'
                 + '<br><br><span class="eg-pista">— Trabajas para el Aguador —</span>' }
    ]
  },

  'ag_fin_forzado': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Al día siguiente, los grifos comunales de los bloques amanecen abiertos también para los que no pueden pagar. No es un paraíso —el '
         + 'nodo no da para tanto y hay colas, y broncas, y racionamiento— pero por primera vez en años nadie se muere de sed por no tener '
         + 'créditos. Tobi y su abuela beben. Muchos beben.<br><br>'
         + 'Kessler cumple, pero no olvida. Sigue vivo, sigue controlando lo que no le arrancaste, y ahora te tiene fichado como el que le puso '
         + 'la rodilla en el cuello. Le has hecho un bien a la zona y te has ganado un enemigo que reparte el agua. En las Pilas, eso es un '
         + 'enemigo peligroso.',
    opciones: [
      { texto: 'Dejarlo ahí, por ahora.',
        efectos:{ reputacion:+5, marcas:['cap_agua_forzado','ag_hecho'], humano:{ aislamiento:-2 } },
        resultado: 'El barrio no sabe tu nombre, pero sabe que alguien obligó al Aguador a abrir la mano, y eso corre como el agua. Te has ganado '
                 + 'el respeto callado de mucha gente y la ojeriza fría de un hombre que decide quién bebe. Habrá que vigilarle la espalda. Pero '
                 + 'hoy, en el bloque siete, un crío ha visto salir agua de un grifo que llevaba seco toda su vida.'
                 + '<br><br><span class="eg-pista">— Obligaste al Aguador a abrir el agua —</span>' }
    ]
  },

  'ag_fin_muerto': {
    img: 'EXP_CANAL_PILAS',
    texto: 'El Aguador cae, y con él el candado del grifo. Durante unos días es una fiesta amarga: la gente llena garrafas hasta arriba, los '
         + 'críos juegan bajo el agua, el bloque siete brinda por ti sin saber tu nombre.<br><br>'
         + 'Y luego pasa lo que Kessler dijo que pasaría. Sin nadie que lo mantenga ni lo racione, el nodo se fuerza, una bomba revienta, y el '
         + 'agua empieza a fallar otra vez. Corre la voz de que un sindicato del canal quiere quedarse la estación, y no van a repartir gratis. '
         + 'Mataste al que ponía precio a la sed. No mataste la sed. Esa sigue ahí, esperando al siguiente que quiera cobrarla.',
    opciones: [
      { texto: 'Cargar con lo que has hecho, bueno y malo.',
        efectos:{ reputacion:+3, marcas:['cap_agua_muerto','ag_hecho'], humano:{ disociacion:+9 } },
        resultado: 'La abuela de Tobi alcanzó a beber limpia sus últimos días; eso te lo llevas. Y te llevas también la duda de si liberaste a la '
                 + 'zona o solo la dejaste a merced del siguiente. Los que odiaban a Kessler te deben una. Los que dependían de él te miran como se '
                 + 'mira a quien apagó la única luz que había, por mala que fuera. Nunca sabrás del todo cuál de los dos tenía razón.'
                 + '<br><br><span class="eg-pista">— Mataste al Aguador —</span>' }
    ]
  },

  // ============================================================
  // SEMILLA: Tobi reaparece, según lo que hiciste con el Aguador.
  // Cada uno solo aparece a quien tomó ese final, y una sola vez.
  // ============================================================
  'ag_tobi_forzado': {
    entrada: true,
    cond: { visto:'cap_agua_forzado', noVisto:'ag_tobi_forzado' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Semanas después, Tobi te encuentra en la calle y se te cuelga del brazo sin vergüenza ninguna. Tiene mejor color, ha crecido un dedo. '
         + '«¡La abuela ya casi no tose! Y el grifo del bloque da agua a todos, hasta a los Márquez, que nunca tienen para pagar.» Rebusca en el '
         + 'bolsillo y te planta en la mano una chapa de refresco vieja, brillante de tanto frotarla. «Es lo que tengo. Es de las buenas.»',
    opciones: [
      { texto: 'Aceptar la chapa como si fuera oro.',
        efectos:{ item:'Chapa de la suerte de Tobi', humano:{ aislamiento:-4 } },
        resultado: 'Te guardas la chapa en el bolsillo bueno. No vale nada y vale muchísimo. Ves a Tobi irse corriendo a jugar, y por un momento '
                 + 'las Pilas parecen un sitio donde un crío puede permitirse jugar. No dura, pero por un momento.' }
    ]
  },
  'ag_tobi_pacto': {
    entrada: true,
    cond: { visto:'cap_agua_pacto', noVisto:'ag_tobi_pacto' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Te cruzas con Tobi cuando vas a hacer una ronda de cobros para Kessler. El crío te ve, y su cara hace algo que no le habías visto: '
         + 'duda. «La abuela está mejor», dice, más bajo que antes. «Gracias.» Pero mira la lista de deudas que llevas en la mano, y luego a ti, '
         + 'y entiende, con esa rapidez cruel de los críos, en qué te has convertido para que su abuela beba. Ya no te mira como a un héroe. Te '
         + 'mira como se mira al Aguador.',
    opciones: [
      { texto: 'Sostenerle la mirada y seguir con tu ronda.',
        efectos:{ humano:{ disociacion:+5, aislamiento:+2 } },
        resultado: 'Le revuelves el pelo como hacen los adultos cuando no saben qué decir, y sigues puerta por puerta cobrando el agua. La chapa '
                 + 'de refresco que iba a darte se la vuelve a guardar en el bolsillo. Salvaste a su abuela. Perdiste su forma de mirarte. En este '
                 + 'oficio, casi todo se paga con algo que no es dinero.' }
    ]
  },
  'ag_tobi_muerto': {
    entrada: true,
    cond: { visto:'cap_agua_muerto', noVisto:'ag_tobi_muerto' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Encuentras a Tobi acarreando una garrafa turbia del canal, con los brazos que le tiemblan del peso. El agua libre duró lo que dijo '
         + 'Kessler: poco. «La abuela alcanzó a beber limpia», te dice, sin llorar, porque ya no le quedan. «Se fue tranquila. Sin toser.» Deja la '
         + 'garrafa un momento para descansar. «Dicen que unos del canal van a quedarse la estación. Que otra vez habrá que pagar.» Te mira sin '
         + 'reproche, que es lo que peor sienta. «¿Hiciste bien?»',
    opciones: [
      { texto: 'Decirle la verdad: que no lo sabes.',
        efectos:{ humano:{ disociacion:+6, aislamiento:+2 } },
        resultado: '«No lo sé, Tobi. De verdad que no lo sé.» El crío asiente, como si esa fuera la respuesta más honesta que le ha dado un adulto '
                 + 'en su vida, y vuelve a cargar la garrafa. Le ayudas a llevarla hasta su bloque sin decir nada más. Le diste a su abuela unos días '
                 + 'de agua limpia y una muerte sin sed. Le quitaste al que la tenía sedienta y al que la mantenía viva, a la vez. Cargas la garrafa, '
                 + 'y la duda, todo el camino.' }
    ]
  }

  };

  Object.keys(A).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = A[id]; });

})();
