// ============================================================
// BLOQUE JS-49 — CADENA DE LORE: "LO QUE QUEDÓ ARRIBA"
// ------------------------------------------------------------
// QUÉ ES:
//   Una "missionchain" (cadena) de 5 partes sobre la vida fuera
//   de la Tierra: estaciones orbitales, los cilindros de O'Neill,
//   la hidroponía que alimentaba las colonias, el Cinturón minero
//   y la megaciudad de Marte. Una historia que se va revelando
//   poco a poco, sin épica, a través de gente cansada que estuvo
//   allí arriba.
//
// CÓMO FUNCIONA (lo gestiona el motor 44_escenas_guion.js):
//   · Cada PARTE es una escena de entrada (entrada:true) que, al
//     tocarte explorando, encadena 3 escenas seguidas y termina.
//   · Cada parte lleva  cadena:'arriba'  -> el motor permite avanzar
//     SOLO UNA parte de la cadena por run de exploración.
//   · La parte N+1 solo aparece cuando ya viste la parte N
//     (cond: { visto:'arriba_pN' }). Así la historia avanza entre
//     sesiones, no de golpe.
//   · Recompensas crecientes durante la cadena; super-recompensa
//     al cerrar la parte 5.
//
//   Las escenas se inyectan en el catálogo global ESCENAS_GUION,
//   que ya existe (45_escenas_datos.js). Este archivo carga DESPUÉS,
//   así que solo añade claves nuevas sin tocar las existentes.
//
// ITEMS de recompensa (definidos en 40_items.js):
//   manifiesto_io, semilla_hidroponia, ficha_minera,
//   dossier_marte, baliza_orbita_muerta
// FACCIÓN afín: 'archivistas' (los que guardan la memoria del mundo)
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CADENA_ARRIBA = {

    // ========================================================
    // PARTE 1 — EL ESTIBADOR DE ÍO
    // ========================================================
    'arriba_p1': {
      entrada: true,
      cadena: 'arriba',
      // Aparece pronto; no requiere haber visto nada antes.
      cond: { noVisto: 'arriba_p1' },
      img: 'EXP_PUERTO_CARGA',
      texto: 'En el puerto de carga, un viejo descarga contenedores que pesan más que él. '
           + 'Lo hace despacio, como quien ya no tiene prisa por llegar a ningún sitio. '
           + 'Se fija en cómo miras las grúas. "No eres de aquí abajo del todo, ¿verdad?", '
           + 'dice sin dejar de trabajar. "Tienes los ojos de los que miran hacia arriba."',
      opciones: [
        {
          texto: '¿Tú miraste hacia arriba alguna vez?',
          lleva: 'arriba_p1_b'
        },
        {
          texto: 'No mucho. Solo de paso.',
          efectos: { aislamiento: +2 },
          resultado: 'El viejo sonríe sin ganas. "Todos decimos eso." Deja la grúa un momento. '
                   + '"Quédate un segundo. No te voy a robar nada que no tengas ya."',
          lleva: 'arriba_p1_b'
        }
      ]
    },

    'arriba_p1_b': {
      img: 'EXP_PUERTO_CARGA',
      texto: '"Trabajé doce años en la Refinería Siete, en la órbita de Ío", dice. '
           + '"Procesábamos el azufre que sacaban del satélite. Aquello no era una estación: '
           + 'era una ciudad colgada del vacío. Treinta mil personas. Turnos que no acababan nunca, '
           + 'pero el café era de verdad y por la ventana veías Júpiter llenar el cielo entero." '
           + 'Se queda callado. "Luego HELIX centralizó la logística. Cerraron la Siete en un mes. '
           + 'A los de arriba nos bajaron aquí. Como carga."',
      opciones: [
        {
          texto: '¿Qué pasó con la gente?',
          lleva: 'arriba_p1_c'
        },
        {
          texto: '¿Por qué la cerraron?',
          lleva: 'arriba_p1_c'
        }
      ]
    },

    'arriba_p1_c': {
      img: 'EXP_PUERTO_CARGA',
      texto: '"Se dispersó. Como el polvo cuando abres una esclusa." Rebusca en el bolsillo '
           + 'del mono y saca un papel doblado mil veces, blando de tanto manosearlo. '
           + '"Es el último manifiesto de carga que firmé. Están todos los nombres de mi turno. '
           + 'Yo ya no me acuerdo de las caras, pero los nombres siguen aquí." Te lo tiende. '
           + '"Tú miras hacia arriba. Guárdalo tú, que yo ya no subo."',
      opciones: [
        {
          texto: 'Lo guardaré.',
          efectos: { item: 'manifiesto_io', creditos: +40, faccion: 'archivistas', rep: +4, aislamiento: -4 },
          resultado: 'Coges el papel. Pesa lo que pesan las cosas que importan: nada y todo. '
                   + 'El viejo vuelve a su grúa. "Si alguna vez encuentras a alguno de esos nombres", '
                   + 'dice, "diles que Ferral preguntó por ellos." No vuelve a hablar. '
                   + '(Has empezado una historia. Quizá vuelva a cruzarse en tu camino.)'
        },
        {
          texto: 'No es asunto mío. (rechazar)',
          efectos: { aislamiento: +6, faccion: 'archivistas', rep: -2 },
          resultado: 'El viejo guarda el papel despacio, sin reproche. Eso es lo peor. '
                   + 'Te vas con la sensación de haber cerrado una puerta que no era tuya.'
        }
      ]
    },

    // ========================================================
    // PARTE 2 — HIDROPONÍA
    // ========================================================
    'arriba_p2': {
      entrada: true,
      cadena: 'arriba',
      cond: { visto: 'arriba_p1', noVisto: 'arriba_p2' },
      img: 'EXP_ALMACEN_OKUPA',
      texto: 'Un olor imposible te detiene: tierra mojada, verde, vivo. En un almacén okupado, '
           + 'bajo una maraña de tubos de luz UV, una mujer riega cuatro tomateras enclenques '
           + 'con el cuidado de quien reza. El manifiesto de Ío pesa en tu bolsillo. '
           + 'Ella sigue tu mirada hasta él. "Ese sello", murmura. "Hacía años que no veía uno."',
      opciones: [
        {
          texto: 'Enséñale el manifiesto.',
          req: { item: 'manifiesto_io' },
          pista: 'necesitas el manifiesto de Ío',
          lleva: 'arriba_p2_b'
        },
        {
          texto: '¿Qué cultivas aquí?',
          lleva: 'arriba_p2_b'
        }
      ]
    },

    'arriba_p2_b': {
      img: 'EXP_ALMACEN_OKUPA',
      texto: '"Yo daba de comer a cuarenta mil personas", dice, y no hay orgullo en su voz, '
           + 'solo cansancio. "En el cilindro Amalthea. Un O\'Neill entero girando para hacer '
           + 'gravedad falsa. Campos curvados sobre tu cabeza, ¿entiendes? Mirabas arriba y veías '
           + 'trigo creciendo del revés, y un río, y al fondo más gente como tú. Toda esa comida '
           + 'salía de mis manos." Mira sus cuatro tomateras. "Ahora cultivo esto. Para no olvidar cómo."',
      opciones: [
        {
          texto: '¿Por qué bajaste?',
          lleva: 'arriba_p2_c'
        },
        {
          texto: 'Sigue siendo dar de comer a alguien.',
          efectos: { aislamiento: -3 },
          lleva: 'arriba_p2_c'
        }
      ]
    },

    'arriba_p2_c': {
      img: 'EXP_ALMACEN_OKUPA',
      texto: '"HELIX patentó las semillas. Todas. De un día para otro, cultivar sin su licencia '
           + 'era robar." Aprieta los labios. "Amalthea no pudo pagar. El cilindro sigue girando '
           + 'allá arriba, vacío, lleno de campos muertos. A veces sueño que aún gira." '
           + 'Te tiende un sobre arrugado. "Semillas viejas. De las de antes, las que no piden permiso. '
           + 'Que alguien las tenga, por si un día vuelve a haber tierra donde plantarlas."',
      opciones: [
        {
          texto: 'Las cuidaré.',
          efectos: { item: 'semilla_hidroponia', creditos: +70, faccion: 'archivistas', rep: +5, aislamiento: -5 },
          resultado: 'Guardas el sobre junto al manifiesto. Dos piezas de un mundo que ya no está. '
                   + 'Empiezas a notar que no son fragmentos sueltos: son la misma historia, '
                   + 'contada por bocas distintas.'
        },
        {
          texto: 'No sabría qué hacer con ellas.',
          efectos: { creditos: +25, faccion: 'archivistas', rep: +1 },
          resultado: 'Ella asiente y las guarda. "Tienes el manifiesto. Con eso basta, de momento." '
                   + 'Te vas con menos de lo que podrías haberte llevado, pero con la sensación '
                   + 'de que la historia sigue abierta.'
        }
      ]
    },

    // ========================================================
    // PARTE 3 — EL CINTURÓN
    // ========================================================
    'arriba_p3': {
      entrada: true,
      cadena: 'arriba',
      cond: { visto: 'arriba_p2', noVisto: 'arriba_p3' },
      img: 'EXP_TALLER_REUTILIZA',
      texto: 'En un taller de chatarra, un hombre tose como si arrastrara grava por dentro. '
           + 'Tiene la piel gris, picada, de los que respiraron polvo de roca toda la vida. '
           + 'Repara una válvula con dedos que ya no obedecen del todo. "¿Buscas algo", '
           + 'pregunta sin levantar la vista, "o solo te has perdido como todos los de aquí?"',
      opciones: [
        {
          texto: 'Trabajaste en el Cinturón, ¿verdad?',
          lleva: 'arriba_p3_b'
        },
        {
          texto: 'Esa tos no es de aquí abajo.',
          lleva: 'arriba_p3_b'
        }
      ]
    },

    'arriba_p3_b': {
      img: 'EXP_TALLER_REUTILIZA',
      texto: '"Once años en una roca minera, sí. Cazábamos asteroides, los abríamos, '
           + 'les sacábamos el metal. El regolito se te mete en los pulmones y ya no sale." '
           + 'Tose. "HELIX ponía las cuotas. Cada año más altas. Si no llegabas, te descontaban '
           + 'el aire que respirabas, literalmente: el oxígeno también lo facturaban ellos." '
           + 'Te mira por primera vez. "Hubo un año que no llegamos. Y la roca decidió que ya basta."',
      opciones: [
        {
          texto: '¿Qué hicisteis?',
          lleva: 'arriba_p3_c'
        },
        {
          texto: 'Os amotinasteis.',
          lleva: 'arriba_p3_c'
        }
      ]
    },

    'arriba_p3_c': {
      img: 'EXP_TALLER_REUTILIZA',
      texto: '"Cerramos las esclusas. Dejamos de minar. Solo queríamos hablar, que bajaran las cuotas." '
           + 'Silencio. "HELIX no negocia con rocas. Cortaron el suministro y esperaron. '
           + 'Cuarenta días. Los que aguantaron, bajaron a la Tierra firmando que nunca había pasado nada." '
           + 'Saca una ficha metálica, gastada. "Mi identificación de la roca. La guardé por los que no firmaron. '
           + 'Nadie cuenta esto. Tú llevas cosas de arriba: añade esta."',
      opciones: [
        {
          texto: 'Lo contaré. (quedarte la ficha)',
          efectos: { item: 'ficha_minera', creditos: +90, faccion: 'archivistas', rep: +6 },
          resultado: 'Coges la ficha. "Que se sepa", dice. "No por venganza. Por que existieron." '
                   + 'Tres piezas ya. El manifiesto, las semillas, la ficha. Arriba no fue un sueño: '
                   + 'fue un sitio donde vivió gente, y alguien decidió apagarlo despacio.'
        },
        {
          texto: 'Denunciar a HELIX es peligroso para ti.',
          efectos: { creditos: +40, faccion: 'sindicatos', rep: +3 },
          resultado: 'El hombre guarda la ficha, sin rencor. "Listo eres, al menos." '
                   + 'Te da unos créditos de un alijo escondido. "Por escuchar. Ya es más de lo que hace nadie." '
                   + 'Te llevas el dinero, pero la ficha se queda. La historia, también, a medias.'
        }
      ]
    },

    // ========================================================
    // PARTE 4 — MARTE
    // ========================================================
    'arriba_p4': {
      entrada: true,
      cadena: 'arriba',
      cond: { visto: 'arriba_p3', noVisto: 'arriba_p4' },
      img: 'EXP_CIBERCAFE',
      texto: 'Una archivista te encuentra a ti, para variar. Te localiza en un cibercafé muerto, '
           + 'se sienta sin pedir permiso. "Dicen que llevas cosas de arriba", dice en voz baja. '
           + '"El manifiesto. Las semillas. La ficha del Cinturón. Llevas medio mapa de algo, '
           + 'y no lo sabes." Desliza un lector de datos sobre la mesa. "¿Quieres ver la otra mitad?"',
      opciones: [
        {
          texto: 'Enséñame qué tienes.',
          req: { item: 'manifiesto_io' },
          pista: 'necesitas el manifiesto de Ío',
          lleva: 'arriba_p4_b'
        },
        {
          texto: '¿Quién eres tú?',
          lleva: 'arriba_p4_b'
        }
      ]
    },

    'arriba_p4_b': {
      img: 'EXP_CIBERCAFE',
      texto: '"Soy de los que guardan lo que HELIX borra. Llámanos archivistas, si quieres un nombre." '
           + 'En el lector, imágenes de Marte: una megaciudad bajo cúpulas, kilómetros de luz '
           + 'roja y acero. "Esto era Tarsis. La promesa. El sitio al que iba la gente cuando '
           + 'la Tierra se hizo invivible." Pasa imágenes. La mitad están censuradas, en negro. '
           + '"Hasta que, hace doce años, la gente dejó de volver de Marte. No murieron. Dejaron de volver."',
      opciones: [
        {
          texto: '¿Qué les pasó?',
          lleva: 'arriba_p4_c'
        },
        {
          texto: '¿Por qué está esto censurado?',
          lleva: 'arriba_p4_c'
        }
      ]
    },

    'arriba_p4_c': {
      img: 'EXP_CIBERCAFE',
      texto: '"No lo sabemos. Esa es la verdad y por eso da miedo." Cierra el lector. '
           + '"Los últimos mensajes de Tarsis no hablan de una catástrofe. Hablan de que algo '
           + '\u2014una señal, una presencia, no está claro\u2014 les hizo no querer volver. '
           + 'HELIX lo selló todo y reescribió la historia: dijeron que Marte se evacuó por una fuga." '
           + 'Te tiende el dossier. "Tú tienes las voces de la gente. Esto es lo que HELIX no quiere '
           + 'que esas voces se junten. Júntalas."',
      opciones: [
        {
          texto: 'Quiero saber la verdad.',
          efectos: { item: 'dossier_marte', creditos: +120, faccion: 'archivistas', rep: +8 },
          resultado: 'Guardas el dossier. Cuatro piezas. Una corriente fría te recorre: '
                   + 'el viejo de Ío, la mujer de Amalthea, el minero del Cinturón... ninguno habló '
                   + 'de Marte. Pero todos, sin saberlo, miraban hacia el mismo sitio cuando se callaban.'
        },
        {
          texto: 'Esto es demasiado grande para mí.',
          efectos: { aislamiento: +5, faccion: 'archivistas', rep: +2 },
          resultado: 'La archivista asiente. "Lo es para todos. Pero ya no puedes no saberlo." '
                   + 'Te deja una copia del dossier de todos modos, "por si cambias de idea". '
                   + 'No cambias de idea. Solo aún no lo sabes.'
        }
      ]
    },

    // ========================================================
    // PARTE 5 — LA ÓRBITA MUERTA  (cierre + super-recompensa)
    // ========================================================
    'arriba_p5': {
      entrada: true,
      cadena: 'arriba',
      cond: { visto: 'arriba_p4', noVisto: 'arriba_p5' },
      img: 'EXP_PUERTO_ORBITAL_1',
      texto: 'La archivista te ha conseguido un pase de carga a una lanzadera de mantenimiento. '
           + 'No preguntas cómo. Por primera vez en años subes: la Tierra se encoge bajo tus pies '
           + 'hasta caber en una ventana. Te llevan a una estación en una órbita olvidada, '
           + 'sin luces, sin nombre en los mapas de HELIX. "Aquí terminó todo", dice ella por el comunicador. '
           + '"Y aquí guardaron la última grabación. Ve tú. Yo no puedo entrar otra vez."',
      opciones: [
        {
          texto: 'Entrar en la estación.',
          lleva: 'arriba_p5_b'
        },
        {
          texto: 'Mirar la Tierra una última vez antes.',
          efectos: { aislamiento: -8 },
          resultado: 'Desde aquí no se ven las Pilas, ni la lluvia, ni HELIX. Solo una canica azul '
                   + 'girando en silencio, indiferente a todo lo que le hacemos encima. '
                   + 'Respiras. Luego entras.',
          lleva: 'arriba_p5_b'
        }
      ]
    },

    'arriba_p5_b': {
      img: 'EXP_PUERTO_ORBITAL_2',
      texto: 'Dentro flota el silencio de los sitios que llevan años conteniendo la respiración. '
           + 'Restos de una vida interrumpida: una taza pegada a una mesa, una foto, un juguete. '
           + 'En el centro, una baliza de emergencia, apagada, con una sola grabación guardada. '
           + 'El indicador parpadea débil, esperándote desde hace doce años. '
           + 'Sabes que en cuanto la reproduzcas, ya no podrás dejar de saber lo que diga.',
      opciones: [
        {
          texto: 'Reproducir la grabación.',
          lleva: 'arriba_p5_c'
        },
        {
          texto: 'Coger la baliza sin escucharla aún.',
          resultado: 'La descuelgas con cuidado, como quien recoge algo dormido. La escucharás '
                   + 'cuando estés abajo, cuando la lluvia tape lo que sea que diga. O eso te dices.',
          lleva: 'arriba_p5_c'
        }
      ]
    },

    'arriba_p5_c': {
      img: 'ESPACIO',
      texto: 'La voz es de una mujer, tranquila, demasiado tranquila. "Si alguien oye esto: '
           + 'no vinieron a por nosotros. No fue una guerra. Fue... una invitación. Algo ahí fuera '
           + 'lleva muchísimo tiempo solo, y aprendió a hablar usando nuestros propios recuerdos. '
           + 'No da miedo. Eso es lo que da miedo. La mayoría quiso ir. Yo me quedé a grabar esto '
           + 'por los que un día miren hacia arriba y se pregunten." Un silencio. '
           + '"No estáis solos. Nunca lo estuvimos. Ojalá eso fuera un consuelo." La grabación termina.',
      opciones: [
        {
          texto: 'Bajar. Guardar todo lo que has reunido.',
          efectos: { item: 'baliza_orbita_muerta', creditos: +400, faccion: 'archivistas', rep: +15, aislamiento: -10, disociacion: +6 },
          resultado: 'Bajas con la baliza, el dossier, la ficha, las semillas y el manifiesto. '
                   + 'Cinco voces que HELIX quiso apagar, ahora en tus manos. Los archivistas te reconocen '
                   + 'como uno de los suyos: ya no eres nadie que mira hacia arriba. Eres alguien que '
                   + 'bajó algo de allí. La lluvia de las Pilas te recibe igual que siempre, '
                   + 'pero tú ya no la miras igual. Algo ahí fuera está despierto. Y, por una vez, '
                   + 'no eres el único que lo sabe.'
                   + '<br><br><span class="eg-pista">— Has completado: "Lo que quedó arriba" —</span>'
        }
      ]
    }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(CADENA_ARRIBA).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CADENA_ARRIBA[id];
  });

})();
