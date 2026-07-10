// ============================================================
// BLOQUE JS-87 — CASO SUELTO: "LA QUE SE FUE SIN AVISAR" (v0.151)
// ------------------------------------------------------------
// Caso autoconclusivo de INTRIGA FRÍA, ambientado en Midbelt (la jaula
// limpia). NO es la misión principal: no toca Centauri, ni CERO, ni sube
// la bandera de trama. Aquí no hay gore: hay gente educada que miente
// muy bien, y una desaparición que a nadie de arriba le conviene resolver.
//
// Contraste buscado con "El carnicero": allí, sangre y desesperación
// abajo; aquí, sonrisas, papeleo y frío social arriba. Investigación
// cruzada (los oficios ayudan pero nunca bloquean), un combate EVITABLE,
// y varios desenlaces con recompensa o consecuencia.
//
// Disponible a cualquiera. Se juega una vez. Solo imágenes y condiciones
// que ya existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const C = {

  // ---- ENTRADA: Renna te contrata ----
  'cd_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'cd_hecho' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una mujer bien vestida para este nivel te busca a ti, que no lo estás. Se llama Renna. Su hermana, Sar Nevin, vivía en una torre '
         + 'de Midbelt y hace tres semanas dejó de responder. «La administración dice que pidió un traslado voluntario. Sar no se iría sin '
         + 'decírmelo. No ella.» Habla bajo, como si arriba hasta el aire escuchara. «Yo no puedo subir a preguntar; no tengo permiso de nivel. '
         + 'Tú te mueves distinto. Encuéntrala. O encuentra qué le pasó.»',
    opciones: [
      { texto: 'Aceptar el caso.',
        resultado: 'Renna te da el número de la unidad de Sar y el nombre de su prometido, un tal Aldous, «encantador, y por eso no me fío». '
                 + 'Te consigue un pase de visitante de un día. El reloj corre desde ya.', lleva:'cd_hub' },
      { texto: 'Aceptar, pero que adelante algo.',
        efectos:{ creditos:+40 },
        resultado: 'Te paga sin regatear, con billetes que le han costado. «Es todo lo que tengo líquido sin que Aldous lo vea.» Ese detalle ya '
                 + 'te dice por dónde puede ir esto. Te da el pase de visitante y la dirección.', lleva:'cd_hub' },
      { texto: 'No es tu clase de trabajo. Declinar.',
        efectos:{ marcaVisto:'cd_hecho', humano:{ aislamiento:+2 } },
        resultado: 'Le dices que no subes bien a Midbelt y que hay quien lo hace mejor. No insiste. Se aleja con la espalda muy recta, de las '
                 + 'que aguantan cosas peores que un no. Te queda la sensación de haber cerrado una puerta que igual no debías.' }
    ]
  },

  // ---- HUB de investigación en la torre de Midbelt ----
  'cd_hub': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'La torre de Sar es Midbelt puro: suelos que brillan, luz cálida falsa, silencio de dinero prestado. Nadie te echa. Simplemente cada '
         + 'persona con la que hablas tarda un segundo de más en decidir que no sabe nada. Aquí no se miente gritando. Se miente con una sonrisa '
         + 'y un «no sabría decirle».',
    opciones: [
      { texto: 'Hablar con el conserje del edificio.',
        cond:{ noVisto:'cd_c' }, lleva:'cd_conserje' },
      { texto: 'Hablar con la vecina de rellano de Sar.',
        cond:{ noVisto:'cd_v' }, lleva:'cd_vecina' },
      { texto: 'Hablar con Aldous, el prometido.',
        cond:{ noVisto:'cd_pro' }, lleva:'cd_prometido' },
      { texto: 'Entrar en la unidad de Sar.',
        cond:{ visto:'cd_v', noVisto:'cd_piso' }, lleva:'cd_piso' }
    ]
  },

  // ---- Conserje: la mentira administrativa ----
  'cd_conserje': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'El conserje es un hombre pulcro con una sonrisa entrenada. «La señorita Nevin solicitó un traslado voluntario. Todo en regla, '
         + 'firmado y sellado.» Cuando le pides ver la fecha de la solicitud, la sonrisa no se mueve pero sus dedos sí: teclea, borra, teclea. '
         + '«El sistema va lento hoy.»',
    opciones: [
      { texto: 'Presionar amablemente, insistir en la fecha.',
        efectos:{ marcaVisto:'cd_c' },
        resultado: 'Acabas sonsacándole que la «solicitud» la tramitó un tercero con poder notarial: Aldous. Sar no firmó nada de su puño. '
                 + '«Es muy común entre parejas», te dice, y la palabra "común" le sale ensayada.', lleva:'cd_hub' },
      { texto: 'Leerle el papeleo tú mismo, con ojo de oficio.',
        req:{ profesion:{ id:'investigador' } }, pista:'haría falta oficio de investigador',
        efectos:{ marcaVisto:'cd_c' },
        resultado: 'No te fías de lo que dice; lees lo que teclea. La solicitud de traslado está fechada DOS días antes de la última vez que '
                 + 'Sar usó su propio acceso en el edificio. Nadie pide un traslado y luego sigue entrando en su casa. Alguien lo firmó por ella, '
                 + 'y con prisa.', lleva:'cd_hub' }
    ]
  },

  // ---- Vecina: el miedo educado (da la entrada al piso) ----
  'cd_vecina': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'La vecina te recibe con la cadena echada y una taza de té que no te ofrece. Habla en voz muy baja. «Sar era encantadora. Discreta. '
         + 'Últimamente… discutían. Él y ella. Nunca gritos, eso aquí no se hace. Pero se oye igual. Se oye más, incluso, cuando no gritan.» '
         + 'Mira el pasillo antes de seguir.',
    opciones: [
      { texto: 'Ganarte su confianza, escuchar sin presionar.',
        efectos:{ marcaVisto:'cd_v', humano:{ disociacion:+1 } },
        resultado: 'Le dedicas tiempo. Al final te cuenta que la última noche oyó a Sar hacer maletas de madrugada, y que por la mañana ya no '
                 + 'estaba, pero las maletas seguían en el rellano de servicio, sin recoger. «Yo no he dicho nada.» Y te desliza, sin mirarte, '
                 + 'el código de servicio de la puerta de Sar. «Por si acaso.»', lleva:'cd_hub' },
      { texto: 'Pedirle directamente que te deje entrar en el piso.',
        efectos:{ marcaVisto:'cd_v', humano:{ aislamiento:+1 } },
        resultado: 'Se pone nerviosa, pero te da el código de servicio de la puerta con tal de que te vayas de su rellano. «No le diga a nadie '
                 + 'que salió de mí. Aquí una palabra de más y te cambian de nivel.» Cierra antes de que le des las gracias.', lleva:'cd_hub' }
    ]
  },

  // ---- Prometido: el encanto frío (empujarlo demasiado tiene precio) ----
  'cd_prometido': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'Aldous te recibe como si te esperara: traje bueno, whisky de verdad, una calma que cuesta dinero. «Sar necesitaba aire. Se fue a '
         + 'una residencia de descanso. Frágil, ¿sabe? Siempre lo fue.» Lo dice con cariño de escaparate. En la repisa, una foto de los dos; '
         + 'la sonrisa de ella no llega a los ojos.',
    opciones: [
      { texto: 'Seguirle el juego, sonsacar sin que lo note.',
        efectos:{ marcaVisto:'cd_pro' },
        resultado: 'Le das cuerda y él, seguro de sí, se explaya. Se contradice una vez —dice que Sar «se fue» y luego que «la llevaron»— y lo '
                 + 'corrige tan rápido que confirma que hay algo que corregir. No sabes aún el qué. Sabes que él sí.', lleva:'cd_hub' },
      { texto: 'Acusarle de frente. Perder los modales.',
        efectos:{ marcaVisto:'cd_pro' },
        resultado: 'Le dices lo que piensas, sin adornos. Aldous ni se inmuta: deja el vaso, aprieta un botón bajo la mesa y sonríe. «Aquí las '
                 + 'cosas no se hacen así. Te lo voy a enseñar.» Dos hombres de seguridad privada entran por la puerta que tienes detrás.',
        lleva:'cd_combate' }
    ]
  },

  // ---- Combate evitable (solo si acusas a Aldous de frente) ----
  'cd_combate': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'Seguridad privada de Midbelt: limpios, correctos, entrenados para «acompañar a la salida» a quien sobra sin dejar marcas que den '
         + 'papeleo. No quieren matarte. Solo borrarte del edificio y de la investigación.',
    opciones: [
      { texto: 'Abrirte paso hacia la salida.',
        pelea: {
          texto: 'No hay saña, hay procedimiento. Dos hombres que hacen esto a menudo y con método. Te sacan si les dejas; solo cediendo terreno '
               + 'y aguantando llegas a la escalera de servicio.',
          integridad: 12,
          enemigos: [
            { nombre:'Seguridad de Midbelt', desc:'Correcto, metódico, fuerte', tipo:'bruto', integridad:5, fuerza:4, umbral:5 },
            { nombre:'Seguridad de Midbelt', desc:'Cubre la puerta sin prisa', tipo:'normal', integridad:4, fuerza:4, umbral:4 }
          ],
          gana: 'cd_tras_pelea',
          pierde: 'cd_malherido'
        } }
    ]
  },
  'cd_tras_pelea': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Sales a la escalera de servicio con los nudillos abiertos y la certeza de que Aldous acaba de decirte, sin querer, todo lo que '
         + 'necesitabas: nadie mueve a dos hombres para tapar un simple «traslado voluntario». Aún puedes seguir el rastro por tu cuenta.',
    opciones: [
      { texto: 'Ir a la unidad de Sar con lo que sabes.',
        cond:{ visto:'cd_v' },
        resultado: 'Con el código que te dio la vecina, puedes entrar sin pasar por recepción.', lleva:'cd_piso' },
      { texto: 'No tienes forma de entrar en el piso. Cerrar el caso con lo que hay.',
        cond:{ noVisto:'cd_v' }, lleva:'cd_fin_incompleto' }
    ]
  },
  'cd_malherido': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Te sacan como sacan la basura de Midbelt: sin ruido, con eficiencia, y con un par de golpes de más «para que no vuelvas». Despiertas '
         + 'en un callejón dos niveles más abajo, dolorido, con el pase de visitante cancelado y la puerta de la torre cerrada para ti.',
    opciones: [
      { texto: 'Arrastrarte de vuelta y afrontar a Renna.',
        efectos:{ condicion:'conmocion', fatiga:+14, disociacion:+6 },
        resultado: 'No has encontrado a Sar. Solo has confirmado, con el cuerpo, que alguien poderoso no quiere que se encuentre. Tendrás que '
                 + 'mirar a Renna y decidir cuánto de esto le cuentas.', lleva:'cd_fin_incompleto' }
    ]
  },

  // ---- El piso de Sar: la verdad (está viva, huyó) ----
  'cd_piso': {
    img: 'EXP_ALMACEN_ZONA7',
    texto: 'La unidad de Sar está demasiado ordenada, como una foto de catálogo. Pero las cosas hablan si sabes mirarlas. Falta el cepillo de '
         + 'dientes y sobra la ropa cara: quien se fue eligió lo práctico, no lo valioso. En un cajón, bajo un forro, un cuaderno de papel con '
         + 'fechas, cifras y una frase repetida como quien se convence: «Puedo hacerlo sola.» Y una dirección tachada, pero no del todo, en un '
         + 'nivel bajo. Sar no desapareció. Sar se escapó. Y alguien montó el «traslado» para que nadie la buscara donde de verdad está.',
    opciones: [
      { texto: 'Seguir la dirección medio tachada.', lleva:'cd_hallada' }
    ]
  },

  // ---- La encuentras viva: la encrucijada final ----
  'cd_hallada': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'La dirección lleva a un cuartucho de nivel bajo, de esos que se alquilan sin nombre. Sar abre la puerta con un cuchillo de cocina en '
         + 'la mano y el miedo de quien lleva semanas sin dormir. Cuando entiende que Renna te envía, y no Aldous, se derrumba un poco.<br><br>'
         + '«No estoy loca. No soy frágil. Descubrí adónde iba nuestro dinero, y con quién, y qué le pasa a la gente de arriba que hace preguntas. '
         + 'Firmar mi propio traslado y desaparecer fue lo único que se me ocurrió para seguir viva.» Te mira. «Si le dices a mi hermana dónde estoy, '
         + 'la pones en el mapa a ella también. Aldous la vigila. Por favor.»',
    opciones: [
      { texto: 'Contarle a Renna toda la verdad y dónde está su hermana.',
        efectos:{ creditos:+120, reputacion:+2, marcaVisto:'cd_hecho', humano:{ disociacion:+3 } },
        resultado: 'Se lo cuentas todo a Renna. Las hermanas se reencuentran, y por un momento es lo más parecido a un final feliz que ofrece '
                 + 'este sitio. Renna te paga agradecida. Pero al irte piensas en lo que dijo Sar sobre quién vigila a quién, y no las tienes todas '
                 + 'contigo. Has dado la verdad. Rezas por que la verdad no cueste cara.', lleva:null },
      { texto: 'Decirle a Renna que Sar se fue de verdad, y proteger su escondite.',
        efectos:{ creditos:+120, reputacion:+1, marcaVisto:'cd_hecho', humano:{ aislamiento:+3, disociacion:+4 } },
        resultado: 'Le dices a Renna que su hermana pidió un traslado real y que no quiere ser encontrada. Es mentira, y le rompe algo por dentro '
                 + 'que no vas a poder recomponer. Cobras igual. Sar queda a salvo, escondida, sola. Cargas con el luto de Renna sabiendo que es '
                 + 'falso. Salvar a alguien a veces se paga con la pena de otro.', lleva:null },
      { texto: 'Volver a Aldous y venderle dónde está Sar.',
        efectos:{ creditos:+400, reputacion:-8, marcas:['cd_vendio_sar','cd_hecho'], humano:{ disociacion:+9 } },
        resultado: 'Aldous paga muy bien por la dirección medio tachada, con esa sonrisa que ahora entiendes del todo. Cobras más de lo que has '
                 + 'visto junto en tu vida. No preguntas qué le pasará a Sar; ya lo sabes. Ni Renna ni el barrio vuelven a confiar en ti cuando '
                 + 'corre la voz, y corre. Hay dinero que compra semanas y cuesta años.', lleva:null }
    ]
  },

  // ---- Final incompleto (perdiste el acceso / no llegaste al piso) ----
  'cd_fin_incompleto': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Vuelves con Renna sin su hermana y con más preguntas que respuestas. Le cuentas lo que sí sabes: que el traslado lo firmó Aldous, '
         + 'que nadie de arriba quiere hablar, y que alguien pagó para que dejaras de mirar.',
    opciones: [
      { texto: 'Darle lo que tienes y ser honesto sobre lo que no.',
        efectos:{ creditos:+50, reputacion:+2, marcaVisto:'cd_hecho' },
        resultado: 'Renna te paga lo prometido pese a que no cerraste el caso. «Al menos sé que no me lo inventé», dice. Te vas con la mitad de '
                 + 'una verdad y la sensación fea de que Midbelt gana casi siempre por cansancio. Casi.' }
    ]
  }

  };

  Object.keys(C).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = C[id]; });

})();
