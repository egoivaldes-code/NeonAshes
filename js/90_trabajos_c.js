// ============================================================
// BLOQUE JS-90 — TRABAJOS DE OFICIO, TERCERA TANDA (v0.154)
// ------------------------------------------------------------
// Un trabajo nuevo para CADA oficio, para que ninguno se sienta más
// vacío que otro. Vida de Lower Stacks: cada profesión mira el mundo a
// su manera. Decisiones con recompensa o desventaja casi siempre;
// combate evitable donde encaja; gore solo cuando la escena lo pide.
//
// Mismo patrón que js/72 y js/85: entrada con cond.profesion, resto por
// 'lleva', se juega una vez. Ids con sufijo _c para no chocar con los
// anteriores (_1/_2 en 72, _b en 85). Solo imágenes/condiciones que ya
// existen. NO toca la trama principal.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined'){ window.ESCENAS_GUION = {}; }
  const L = {

  // ============================================================
  // INVESTIGADOR — "El vecino que no era"
  // ============================================================
  'prof_inv_c1': {
    entrada: true,
    cond: { profesion:'investigador' },
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Una mujer, Nerza, te para con un miedo raro en la cara. «Mi vecino de toda la vida, el viejo Bel. Sigue ahí, con su cara, pero no '
         + 'es él. No recuerda cosas que vivimos. Anda distinto. Me sonríe distinto.» Baja la voz. «¿Y si le han hecho algo? ¿Y si le cambiaron '
         + 'por dentro?» Te paga lo poco que tiene por que averigües qué le pasa a Bel.',
    opciones: [
      { texto: 'Investigar de verdad: rutinas, registros, quién entra y sale.',
        efectos:{ humano:{ fatiga:+4 } },
        resultado: 'No hay conspiración. Hay algo más triste. Cruzando fechas y consumos, das con ello: el viejo Bel murió hace semanas, solo, '
                 + 'de puro viejo. Y alguien ocupa su casa usando su cara y su nombre para seguir cobrando su ración y no acabar en la calle.', lleva:'prof_inv_c2' },
      { texto: 'Decirle que son cosas de la edad, y cobrar sin mirar mucho.',
        efectos:{ creditos:+30, reputacion:-1, humano:{ aislamiento:+2 } },
        resultado: 'Le sueltas que la gente mayor cambia, que no se preocupe, y te llevas sus créditos. Nerza asiente sin quedarse tranquila, '
                 + 'porque sabe que no la has escuchado. Cobrar por no mirar es fácil. También es la forma más rápida de dejar de ser bueno en esto.' }
    ]
  },
  'prof_inv_c2': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Abres la puerta de Bel y dentro no hay ningún monstruo: hay un chaval de dieciséis años, escapado de algo peor, muerto de miedo, que '
         + 'aprendió los gestos del viejo viéndolo por la ventana antes de que muriera. «No le robé nada. Solo su nombre. Sin el nombre me echan, '
         + 'y sin sitio, a mí me pasa lo que le pasa a los de mi edad ahí fuera.» No miente. Tienes que decidir qué le cuentas a Nerza.',
    opciones: [
      { texto: 'Contarle la verdad a Nerza.',
        efectos:{ creditos:+60, reputacion:+2, humano:{ disociacion:+4 } },
        resultado: 'Nerza llora por Bel, al que nadie enterró, y denuncia al chaval, al que se llevan a saber dónde. Le has dado la verdad y el '
                 + 'duelo que le tocaba. También has dejado a un crío sin el único techo que encontró. La verdad, aquí, casi nunca viene sola.' },
      { texto: 'Decirle a Nerza que Bel se fue a una residencia, y dejar al chaval en paz.',
        efectos:{ creditos:+40, reputacion:+1, humano:{ aislamiento:-2 } },
        resultado: 'Le tejes a Nerza una mentira amable —Bel, tranquilo, en una residencia lejos— y al chaval le dices que como se pase de listo '
                 + 'vuelves. Cobras menos, porque no entregas "resultado". Pero un viejo descansa con su nombre haciendo un último favor, y un crío '
                 + 'sigue vivo. Hay verdades que no hace falta cobrar.' }
    ]
  },

  // ============================================================
  // SCAVENGER — "El pozo que se abrió"
  // ============================================================
  'prof_scav_c1': {
    entrada: true,
    cond: { profesion:'scavenger' },
    img: 'EXP_CANAL_PILAS',
    texto: 'Un derrumbe ha destapado un pozo de mantenimiento sellado desde antes de HELIX: dentro se adivina chatarra de la buena, de la que ya '
         + 'no se fabrica, cobre limpio y placas enteras. El problema es doble: la estructura cruje como si respirara, y Doggo, otro chatarrero '
         + 'con menos escrúpulos que tú, ya está mirando el pozo con la misma cara de hambre.',
    opciones: [
      { texto: 'Bajar rápido, antes que nadie, y agarrar lo que puedas.',
        azar:{ prob:0.55,
          exito:{ efectos:{ item:'Cobre de antes de HELIX', creditos:+160 },
                  resultado:'Bajas como una araña, llenas la bolsa de cobre y placas antes de que nada ceda, y subes con el corazón a mil y un '
                          + 'botín que no verás dos veces en tu vida. A veces la prisa paga.' },
          fallo:{ efectos:{ condicion:'pierna_herida_grave', fatiga:+12, item:'Chatarra', creditos:+40 },
                  resultado:'A media bajada, una viga cede. Sales a rastras con una pierna machacada y un puñado de chatarra de la mala, el pozo '
                          + 'sellado otra vez bajo los escombros con todo lo bueno dentro. La prisa, esta vez, la pagas tú.' } } },
      { texto: 'Proponerle a Doggo repartir y bajar juntos, con cuidado.',
        efectos:{ item:'Cobre de antes de HELIX', creditos:+80, reputacion:+2 },
        resultado: 'Doggo gruñe, pero acepta: dos bajan más seguro que uno en un pozo que cruje. Repartís el botín a medias —menos para cada uno, '
                 + 'pero enteros los dos— y os separáis con un respeto raro. En este oficio, un chatarrero del que te puedes fiar vale más que una '
                 + 'bolsa de cobre.' },
      { texto: 'Echar a Doggo del pozo por las malas.',
        resultado: 'Le dices que el pozo es tuyo. Doggo no es de los que se van hablando: saca una barra oxidada y decide que el pozo es suyo.',
        pelea: {
          texto: 'Dos chatarreros peleando al borde de un agujero que cruje. Un mal paso y caéis los dos. No es fuerza: es no resbalar.',
          integridad: 11,
          enemigos: [ { nombre:'Doggo', desc:'Chatarrero correoso, barra oxidada', tipo:'rapido', integridad:4, fuerza:4, umbral:4 } ],
          gana:'prof_scav_c_win', pierde:'prof_scav_c_lose'
        } }
    ]
  },
  'prof_scav_c_win': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Doggo acaba sentado en el suelo, sujetándose las costillas, escupiendo. «Quédate el maldito pozo.» Se larga cojeando. El botín es '
         + 'todo tuyo, si el pozo aguanta lo que tardes en sacarlo.',
    opciones: [
      { texto: 'Vaciar el pozo rápido y salir.',
        efectos:{ item:'Cobre de antes de HELIX', creditos:+180, marcaVisto:'trab_doggo_enemigo', humano:{ fatiga:+8, disociacion:+2 } },
        resultado: 'Sacas todo lo que puedes antes de que cruja demasiado. Cobras de lujo. Pero te llevas también la imagen de Doggo cojeando, '
                 + 'que no era un enemigo, solo otro con hambre. Ganaste el pozo. Perdiste a alguien con quien podrías haber contado.' }
    ]
  },
  'prof_scav_c_lose': {
    img: 'EXP_CANAL_PILAS',
    texto: 'Doggo pega más fuerte de lo que su percha promete, y tú resbalas justo cuando no debías. Acabas medio metido en el pozo, agarrado a '
         + 'una viga, mientras él te pisa los dedos hasta que sueltas y ríe. Sales como puedes; él baja a por el cobre.',
    opciones: [
      { texto: 'Subir con lo puesto y tragarte la rabia.',
        efectos:{ condicion:'herida_brazo_d_leve', fatiga:+10 },
        resultado: 'Te vas con las manos vacías, la mano magullada y el orgullo peor. Doggo se queda el pozo entero. En las Pilas, a veces, el que '
                 + 'llega segundo es el que se cae dentro. Habrá otros pozos. Este era de los buenos.' }
    ]
  },

  // ============================================================
  // CAZARRECOMPENSAS — "La recompensa equivocada"
  // ============================================================
  'prof_caza_c1': {
    entrada: true,
    cond: { profesion:'cazarrecompensas' },
    img: 'SECTOR7_STREETS',
    texto: 'Un contrato limpio y bien pagado: localizar y entregar a una mujer, Isa, acusada de estafa. La encuentras rápido, demasiado rápido, '
         + 'escondida en un cubículo con una bolsa hecha. No parece una estafadora. Parece una testigo. «Vi lo que un Sindicato le hizo a un tipo '
         + 'en el canal. Lo de la estafa lo inventaron ellos para que alguien como tú me sacara del agujero y me pusiera en bandeja.» Te mira las '
         + 'manos, a ver si la esposas.',
    opciones: [
      { texto: 'Un contrato es un contrato. Entregarla.',
        efectos:{ creditos:+200, reputacion:-3, humano:{ disociacion:+7 } },
        resultado: 'La entregas donde dice el contrato. Cobras bien, y sabes perfectamente qué le espera, porque no había ninguna autoridad al '
                 + 'otro lado, solo el Sindicato que la quería callada. Cobrar siempre tiene un coste. Este te lo vas a llevar puesto.' },
      { texto: 'Dejarla ir. Comerte el contrato.',
        efectos:{ reputacion:+3, humano:{ aislamiento:-2 } },
        resultado: 'Le dices que no la has encontrado. Isa desaparece por donde vino, con su bolsa y su testimonio, y tú te quedas sin cobrar y '
                 + 'con un Sindicato apuntándote como el cazador que falló. No es buen negocio. Pero hay noches en que dormir vale más que un contrato.' },
      { texto: 'Sacarla tú de la zona, por tu cuenta.',
        efectos:{ creditos:-30, reputacion:+4, humano:{ fatiga:+7 } },
        resultado: 'La mueves por rutas que solo conoce quien caza en ellas, gastándote lo tuyo en sobornos, hasta dejarla lejos del alcance del '
                 + 'Sindicato. No cobras; encima pagas. Pero te ganas una deuda de gratitud de alguien que ha visto cosas, y en tu oficio saber '
                 + 'quién te debe la vida es una moneda que no caduca.' }
    ]
  },

  // ============================================================
  // HACKER — "El pulmón del bloque"
  // ============================================================
  'prof_hack_c1': {
    entrada: true,
    cond: { profesion:'hacker' },
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El sistema de ventilación y filtrado de agua de un bloque pobre se está muriendo: el firmware es tan viejo que ya falla solo, y si '
         + 'para del todo, cien familias respiran veneno y beben barro. Un comité de vecinos junta lo que puede —una miseria— para que se lo '
         + 'arregles. Mientras trabajas, ves lo fácil que sería dejarte una puerta trasera en un sistema del que dependen cien casas.',
    opciones: [
      { texto: 'Arreglarlo limpio y cobrar la miseria.',
        efectos:{ creditos:+40, reputacion:+3, humano:{ aislamiento:-3 } },
        resultado: 'Reescribes lo justo para que el pulmón del bloque aguante otros años, cierras sin dejar rastro y cobras lo poco acordado. '
                 + 'Cien familias respiran limpio y no sabrán nunca tu nombre. Algunos trabajos pagan en algo que no son créditos, y este es de esos.' },
      { texto: 'Arreglarlo y dejarte una puerta trasera para el futuro.',
        efectos:{ creditos:+40, item:'Acceso oculto: pulmón del bloque', marcaVisto:'trab_hacker_backdoor', humano:{ disociacion:+5 } },
        resultado: 'Lo arreglas bien, sí, pero te dejas una llave escondida en el sistema. Cien familias respiran limpio… mientras a ti te '
                 + 'convenga. Te guardas un poder feo: el día que quieras, ese bloque hará lo que digas o se quedará sin aire. Ojalá no llegue ese '
                 + 'día. Pero lo guardas por si llega.' },
      { texto: 'Cobrar por mirarlo y decir que no tiene arreglo.',
        efectos:{ creditos:+40, reputacion:-4, humano:{ disociacion:+3 } },
        resultado: 'Te inventas un diagnóstico imposible, cobras la "revisión" y te vas. El bloque buscará a otro que no encontrarán a tiempo. '
                 + 'Cuando el sistema pare del todo, tú estarás lejos, y aun así lo sabrás. La palabra "el hacker que los dejó sin aire" viaja, '
                 + 'y no se te despega.' }
    ]
  },

  // ============================================================
  // CONTRABANDISTA — "Una dosis de más"
  // ============================================================
  'prof_contra_c1': {
    entrada: true,
    cond: { profesion:'contrabandista' },
    img: 'EXP_CANAL_PILAS',
    texto: 'Llevas una tanda de antibióticos del mercado negro para un cliente que paga bien y no espera. En la cola del control, delante de ti, '
         + 'una madre con un crío ardiendo de fiebre discute con el funcionario: no tiene receta autorizada, no hay medicina para ellos. El crío '
         + 'respira como un fuelle roto. Tú llevas veinte dosis pegadas al cuerpo.',
    opciones: [
      { texto: 'Pasar la carga entera, limpio. El negocio es el negocio.',
        efectos:{ creditos:+150, humano:{ disociacion:+5 } },
        resultado: 'Cruzas con las veinte dosis intactas y entregas a tiempo. Cobras completo. Detrás, la fiebre del crío sigue subiendo mientras '
                 + 'su madre suplica a un formulario. No miras atrás. Pero el sonido de ese fuelle roto se te queda, gratis, en el lote.' },
      { texto: 'Desviar una dosis para el crío antes de cruzar.',
        efectos:{ creditos:+110, reputacion:+3, humano:{ aislamiento:-3 } },
        resultado: 'En un descuido le metes una dosis en el bolsillo a la madre y le susurras cómo dársela. Entregas diecinueve y le dices al '
                 + 'cliente que una se estropeó; se lo traga a regañadientes y cobras un poco menos. El crío quizá viva. En este oficio, robarte a '
                 + 'ti mismo para salvar a un desconocido es el único lujo honrado que te puedes permitir.' }
    ]
  },

  // ============================================================
  // SEGURIDAD — "La puerta del Bar Noir"
  // ============================================================
  'prof_seg_c1': {
    entrada: true,
    cond: { profesion:'seguridad' },
    img: 'SECTOR7_STREETS',
    texto: 'Haces la puerta de un bar por una noche. Todo tranquilo hasta que un tipo grande, borracho y con un implante de combate barato '
         + 'zumbándole en el brazo, empieza a empujar a la gente y a romper vasos. Los clientes se apartan; el dueño te mira a ti. Es tu trabajo, '
         + 'y el implante de ese hombre puede partirle la cara a alguien de un manotazo.',
    opciones: [
      { texto: 'Calmarlo con palabras y sacarlo con dignidad.',
        azar:{ prob:0.6,
          exito:{ efectos:{ creditos:+70, reputacion:+3 },
                  resultado:'Le hablas bajo, sin retarle, le ofreces salir a tomar el aire como si fuera idea suya. El orgullo del borracho encuentra '
                          + 'una salida que no es un puñetazo, y se deja llevar afuera. El dueño te paga contento: ni un vaso más roto, ni sangre. '
                          + 'La mejor pelea es la que no pasa.' },
          fallo:{ resultado:'Lo intentas, pero el alcohol y el implante pueden más que tus buenas palabras: te suelta un manotazo que zumba al '
                          + 'cortar el aire. Se acabó hablar.', lleva:'prof_seg_c_pelea' } } },
      { texto: 'Sacarlo por la fuerza, sin más.', lleva:'prof_seg_c_pelea' },
      { texto: 'Mirar para otro lado y dejar que se le pase.',
        efectos:{ creditos:+20, reputacion:-3, humano:{ disociacion:+2 } },
        resultado: 'Te haces el distraído. El borracho rompe media barra y le abre la ceja a un parroquiano antes de irse solo. El dueño te paga '
                 + 'la noche a regañadientes y no te vuelve a llamar. Cobrar por vigilar y no vigilar se nota, y corre entre los que contratan.' }
    ]
  },
  'prof_seg_c_pelea': {
    img: 'SECTOR7_STREETS',
    texto: 'El implante le da fuerza pero no cabeza, y el alcohol le quita las dos. Aun así, un manotazo de eso abre carne. Hay que meterse por '
         + 'dentro de su alcance, donde el brazo grande estorba, y no dejar que te agarre.',
    opciones: [
      { texto: 'Reducirlo.',
        pelea: {
          texto: 'Grande, lento y borracho, pero con un brazo que zumba y pega como un martillo. Aguantar el primer manotazo y entrarle de cerca '
               + 'es toda la pelea.',
          integridad: 11,
          enemigos: [ { nombre:'Borracho con implante', desc:'Fuerza de máquina, equilibrio de nadie', tipo:'bruto', integridad:5, fuerza:5, umbral:5 } ],
          gana:'prof_seg_c_win', pierde:'prof_seg_c_lose'
        } }
    ]
  },
  'prof_seg_c_win': {
    img: 'SECTOR7_STREETS',
    texto: 'Le aguantas el manotazo, le entras por dentro y lo llevas al suelo hasta que el implante deja de zumbar y él deja de pelear. Lo sacas '
         + 'a la calle a que se le pase. El bar respira.',
    opciones: [
      { texto: 'Cobrar la noche.',
        efectos:{ creditos:+90, reputacion:+2, humano:{ fatiga:+6 } },
        resultado: 'El dueño te paga con una prima y una copa que no aceptas porque estás trabajando. Te has ganado la noche y que te vuelvan a '
                 + 'llamar. Un buen portero es el que resuelve sin que el bar entero acabe en el suelo.' }
    ]
  },
  'prof_seg_c_lose': {
    img: 'SECTOR7_STREETS',
    texto: 'Un implante de combate, por barato que sea, pega como un vehículo. Un manotazo te alcanza de lleno y el techo del bar cambia de sitio. '
         + 'Cuando te levantas, el borracho ya se ha ido solo, dejando destrozos, y tú, en el suelo, haciendo de decorado.',
    opciones: [
      { texto: 'Levantarte y asumir la noche.',
        efectos:{ condicion:'conmocion', fatiga:+12, creditos:+30 },
        resultado: 'El dueño te paga a medias, más por pena que por otra cosa, y no te guardará para la próxima. Te vas con la cabeza dándote '
                 + 'vueltas y la lección clara: a un implante de combate no se le gana a lo tonto, ni borracho que venga.' }
    ]
  },

  // ============================================================
  // CAZARRECOMPENSAS (doble ración) — "El que quiere que lo cacen"
  // ============================================================
  'prof_caza_c2': {
    entrada: true,
    cond: { profesion:'cazarrecompensas' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El cartel es normal: un tal Renke, recompensa media, "vivo". Lo acorralas en un tejadillo y pasa algo que no pasa nunca: no huye. '
         + 'Se te acerca. «Gracias a los cielos, un cazador. Entrégame ya, rápido, en el puesto oficial. Hay un limpiador de los Sindicatos '
         + 'pisándome. Una celda es el sitio más seguro en el que puedo estar esta noche.» Mira por encima del hombro. No actúa. Tiene el miedo '
         + 'auténtico del que sabe quién viene a por él.',
    opciones: [
      { texto: 'Llevarlo cuanto antes al puesto oficial, como pide.',
        resultado: 'Decides que un hombre que suplica que lo encierren no miente. Lo llevas rápido por callejones… pero el limpiador de los '
                 + 'Sindicatos os corta el paso antes de llegar, y no viene a hablar.', lleva:'prof_caza_c2_pelea' },
      { texto: 'Cobrar rápido: entregarlo a quien puso el cartel, sin preguntar.',
        efectos:{ creditos:+220, reputacion:-3, marcaVisto:'trab_renke_vendido', humano:{ disociacion:+7 } },
        resultado: 'Sigues el contrato a la letra y lo entregas en el punto que marca el cartel. Solo cuando ves quién lo recibe —los mismos de '
                 + 'los que huía— entiendes que el cartel lo pusieron ellos para que un cazador se lo trajera en bandeja. Cobras completo. Renke '
                 + 'no llega a mañana, y tú lo sabes. Hay contratos limpios que dejan las manos sucias.' },
      { texto: 'Soltarlo. Su drama no es tu contrato.',
        efectos:{ humano:{ aislamiento:+2 } },
        resultado: 'Le dices que no lo has visto y te vas. Renke se pierde en la noche a jugarse solo su suerte contra el limpiador. No cobras, '
                 + 'pero tampoco lo entregas a una tumba. En tu oficio, a veces no elegir también es elegir, y esta te la ahorras.' }
    ]
  },
  'prof_caza_c2_pelea': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El limpiador es lo contrario que Renke: tranquilo, seco, profesional. No amenaza. Solo saca la herramienta y va a por el trabajo, '
         + 'que ahora te incluye a ti por estar en medio. Renke se encoge detrás de ti. Si aguantas, llegáis al puesto. Si no, no llega ninguno.',
    opciones: [
      { texto: 'Cubrir a Renke y abriros paso.',
        pelea: {
          texto: 'Un profesional de los Sindicatos no falla por nervios. Pega para acabar rápido. Tienes que aguantar su primer empuje y no '
               + 'dejar que llegue a Renke, que no sabe pelear y estorba tanto como ayuda.',
          integridad: 13,
          enemigos: [ { nombre:'Limpiador del Sindicato', desc:'Frío, preciso, sin prisa', tipo:'lider', integridad:6, fuerza:5, umbral:6 } ],
          gana:'prof_caza_c2_win', pierde:'prof_caza_c2_lose'
        } }
    ]
  },
  'prof_caza_c2_win': {
    img: 'SECTOR7_STREETS',
    texto: 'El limpiador se retira cuando entiende que le va a costar más de lo que le pagan; esa gente hace cuentas hasta sangrando. Metes a '
         + 'Renke en el puesto oficial de una pieza. Detrás de la reja, por fin, respira.',
    opciones: [
      { texto: 'Cobrar la recompensa, limpia.',
        efectos:{ creditos:+150, reputacion:+4, humano:{ fatiga:+8 } },
        resultado: 'Cobras la recompensa del cartel entregándolo donde debía ir de verdad, no donde lo esperaba una cuchilla. Renke te debe la '
                 + 'vida, y esas deudas, en el bajo mundo, valen más que el pago. Te ganas fama de cazador que entrega a sus presas enteras. '
                 + 'Curiosamente, eso trae más contratos, no menos.' }
    ]
  },
  'prof_caza_c2_lose': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El limpiador es mejor que tú esta noche. Te deja en el suelo con eficiencia, sin ensañarse —no le pagan por ti— y pasa por encima '
         + 'para terminar su trabajo. Lo último que oyes es a Renke dejar de suplicar.',
    opciones: [
      { texto: 'Arrastrarte de allí.',
        efectos:{ condicion:'hemorragia', fatiga:+14, disociacion:+8 },
        resultado: 'Sobrevives porque no valías la molestia de rematarte. Renke no. Intentaste hacer lo correcto y perdiste, y a veces es solo '
                 + 'eso, sin lección ni premio. Los Sindicatos mandan a profesionales por algo. Hoy lo has aprendido en carne propia.' }
    ]
  }

  };

  Object.keys(L).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = L[id]; });

})();
