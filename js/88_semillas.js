// ============================================================
// BLOQUE JS-88 — EL MUNDO RECUERDA (recogida de semillas, v0.152)
// ------------------------------------------------------------
// Sucesos que reconocen decisiones pasadas del jugador y le tratan
// distinto. Cada uno SOLO aparece a quien tomó esa decisión concreta
// (cond visto de la bandera-semilla) y se juega una vez (noVisto propio).
// El peso es sobre todo SOCIAL: que alguien te mire distinto, te fíe o
// no, te suelte un rumor, te cierre o abra una puerta. Alguna pizca de
// créditos u objeto solo cuando encaja.
//
// Semillas que recoge:
//   caso_carnicero_muerto  -> mataste tú al carnicero
//   caso_carnicero_dvora   -> dejaste que Dvora decidiera
//   cd_vendio_sar          -> vendiste a Sar a Aldous
//   fac_confianza_mara     -> devolviste la caja de Mara sin mirar
//   fac_miro               -> husmeaste en la caja de Mara
//
// NO toca la trama principal. Solo imágenes/condiciones existentes.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const S = {

  // ---- CARNICERO: lo mataste tú (fama sombría) ----
  'sem_carn_muerto': {
    entrada: true,
    cond: { visto:'caso_carnicero_muerto', noVisto:'sem_carn_muerto' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'En el mercado, un hombre que no conoces te sostiene la mirada más de lo normal y se acerca. «Tú eres el que se cargó al carnicero, '
         + '¿verdad? Lo sé porque mi cuñado sigue teniendo sus dos riñones gracias a eso.» Te desliza algo en la mano, discreto. Un poco más '
         + 'allá, una madre tira de su crío para cambiar de acera cuando te ve. En las Pilas, la misma historia te hace santo para unos y '
         + 'cuchillo para otros.',
    opciones: [
      { texto: 'Aceptar el gesto sin decir mucho.',
        efectos:{ item:'Ficha de favor del mercado', reputacion:+2, humano:{ disociacion:+3 } },
        resultado: 'Te guardas la ficha —un favor pendiente de alguien del mercado— y sigues. La mirada de la madre te dura más que el favor. '
                 + 'Así es como se paga hacer justicia con las manos: te la agradecen y te temen a la vez, y las dos cosas pesan.' },
      { texto: 'Dejar claro que no lo hiciste por nadie.',
        efectos:{ humano:{ aislamiento:+2 } },
        resultado: '«No lo hice por tu cuñado», le dices, y es verdad, y no sabes bien por qué lo hiciste. El hombre asiente, algo decepcionado, '
                 + 'y se lleva su gratitud a otra parte. Prefieres que no te deban nada a que te recen. Cargar solo con lo que hiciste es más '
                 + 'limpio, aunque más frío.' }
    ]
  },

  // ---- CARNICERO: se lo dejaste a Dvora (gratitud oscura) ----
  'sem_carn_dvora': {
    entrada: true,
    cond: { visto:'caso_carnicero_dvora', noVisto:'sem_carn_dvora' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Dvora te encuentra ella a ti. Tiene mejor cara que la última vez, aunque nunca del todo buena. «Mi hermano ya come solo. Camina '
         + 'poco, pero camina.» No menciona lo que pasó en aquella cámara cuando la dejaste a solas, y tú tampoco. Te pone en las manos un '
         + 'táper caliente. «En el bloque saben lo que hiciste por nosotros. Aquí ya tienes casa, si alguna vez la necesitas.»',
    opciones: [
      { texto: 'Aceptar la comida y el ofrecimiento.',
        efectos:{ item:'Llave del refugio de Dvora', creditos:+40, reputacion:+4, humano:{ aislamiento:-3 } },
        resultado: 'Comes algo hecho por alguien que te está agradecido de verdad; hacía tiempo. Te dan una llave de un cuartucho seguro del '
                 + 'bloque «para cuando lo necesites», y entre varios vecinos te apañan unos créditos que no les sobran. Te ganas un techo y la '
                 + 'lealtad callada de su gente. Lo que hizo Dvora aquella noche sigue sin nombrarse. Algunas deudas se pagan mejor con silencio.' },
      { texto: 'Preguntar solo por su hermano y seguir.',
        efectos:{ reputacion:+2, humano:{ aislamiento:-1 } },
        resultado: 'Te interesas por el chico, rechazas el táper con suavidad y sigues tu camino. Dvora te mira irte como se mira a alguien de '
                 + 'quien te fías. En las Pilas, eso vale más que el táper, y dura más.' }
    ]
  },

  // ---- SAR: la vendiste a Aldous (mala fama que muerde) ----
  'sem_sar': {
    entrada: true,
    cond: { visto:'cd_vendio_sar', noVisto:'sem_sar' },
    img: 'SECTOR7_STREETS',
    texto: 'Vas a cerrar un trato con un contacto del mercado gris que llevas tiempo cultivando. En cuanto te ve, cambia la cara. «He oído lo '
         + 'de la chica de Midbelt. La que vendiste al novio.» No levanta la voz —aquí nadie la levanta—, pero recoge su mercancía. «El que '
         + 'vende a una hermana vende a cualquiera. No es nada personal. Es que ya no me fío de ti, y en esto la confianza es todo.»',
    opciones: [
      { texto: 'Intentar justificarte.',
        efectos:{ creditos:-40, reputacion:-4, humano:{ aislamiento:+2 } },
        resultado: 'Le explicas que necesitabas el dinero, que era complicado, que cualquiera… Te deja hablar hasta que te cansas, y luego se '
                 + 'va igual, y con él se cae el trato que tenías medio cerrado: pierdes lo que ya habías adelantado. Justificarte solo le '
                 + 'confirma que sabes lo que hiciste. La palabra corre más rápido que tú por las Pilas.' },
      { texto: 'Callarte y aceptar que esa puerta se cerró.',
        efectos:{ reputacion:-3, humano:{ disociacion:+3 } },
        resultado: 'No dices nada, porque no hay nada que decir. Recoges lo tuyo y te vas. Ese contacto ya no existe para ti, y no será el '
                 + 'último: en un oficio donde la confianza es la única moneda que no se falsifica, has empezado a quedarte sin ella. '
                 + 'Cuatrocientos créditos te parecieron muchos aquella noche. El precio real se paga a plazos, y acaba de empezar a pasarte factura.' }
    ]
  },

  // ---- MARA: le devolviste la caja sin mirar (se abre un poco) ----
  'sem_mara_conf': {
    entrada: true,
    cond: { visto:'fac_confianza_mara', noVisto:'sem_mara_conf' },
    img: 'APT',
    texto: 'Un aviso de Mara, de madrugada. No es un encargo; es raro que te escriba sin un motivo.<br><br>'
         + '<span style="color:var(--magenta)">«¿Estás despierto? Da igual. No quiero nada. Solo… no me apetecía estar callada esta noche.»</span><br><br>'
         + 'Habláis un rato de nada —del ruido de la lluvia, de un sitio de fideos que cerró— y en algún momento, sin darle importancia, suelta '
         + 'una cosa suya: que de pequeña coleccionaba billetes de transporte de sitios a los que no había ido, y que todavía guarda alguno. '
         + 'Lo dice y cambia de tema enseguida, como quien enseña una foto y la esconde. Pero te lo ha contado. A ti.',
    opciones: [
      { texto: 'Escuchar sin preguntar de más.',
        efectos:{ reputacion:+1, humano:{ aislamiento:-4 } },
        resultado: 'No hurgas. La dejas hablar y callar a su ritmo. Cuando corta, ninguno de los dos ha dicho nada importante y a la vez ha '
                 + 'pasado algo importante: Mara, que no se abre con nadie, ha decidido abrirse un dedo contigo. Aquello de no mirar en su caja '
                 + 'está dando sus frutos, despacio, como todo lo que merece la pena en las Pilas.' }
    ]
  },

  // ---- MARA: husmeaste en su caja (más distante) ----
  'sem_mara_frio': {
    entrada: true,
    cond: { visto:'fac_miro', noVisto:'sem_mara_frio' },
    img: 'APT',
    texto: 'Mara te pasa un encargo por el terminal: una dirección, una hora, nada más. Ni un «qué tal», ni una de sus frases de medio filo. '
         + 'Desde lo de la caja, todo lo que te dice es exacto y vacío, como un formulario bien rellenado.<br><br>'
         + '<span style="color:var(--magenta)">«Recoges, entregas, cobras. No hace falta que hablemos.»</span><br><br>'
         + 'Y no hace falta, no. Pero antes sí hablabais, aunque fuera para no decir nada, y esa diferencia la notas tú y la nota ella.',
    opciones: [
      { texto: 'Aceptar la distancia y hacer el trabajo.',
        efectos:{ creditos:+50, humano:{ aislamiento:+3 } },
        resultado: 'Haces el recado, limpio, y cobras sin más palabra que la justa. Todo correcto. Todo pagado. Miraste en su caja porque '
                 + 'necesitabas saber, y ahora sabes, y el precio de saber es este silencio educado que se ha metido entre los dos. Con Mara, '
                 + 'entender de más cuesta caro.' }
    ]
  },

  // ---- MARA: le debes un favor pero aún no te lo ha cobrado ----
  // Solo a quien contrajo la deuda en el giro y todavía NO ha empezado
  // "La factura" (noVisto fac_p1). Prepara ese capítulo haciendo que la
  // deuda pese antes de que Mara la cobre.
  'sem_deuda_mara': {
    entrada: true,
    cond: { visto:'cg_deuda_mara', noVisto:'fac_p1' },
    img: 'APT',
    texto: 'Un mensaje corto de Mara, de los que no esperan respuesta. Sin encargo, sin saludo.<br><br>'
         + '<span style="color:var(--magenta)">«No me he olvidado de lo del archivo. De la puerta que te abrí. Yo estas cosas las apunto.»</span><br><br>'
         + 'Y nada más. Ni cuándo, ni qué. Solo el recordatorio de que le debes una, y de que las suyas se cobran cuando ella decide, no cuando '
         + 'a ti te viene bien. Guardas el mensaje con la misma sensación con que se guarda una factura que sabes que va a llegar.',
    opciones: [
      { texto: 'Contestar que ahí estarás.',
        efectos:{ humano:{ aislamiento:+1 } },
        resultado: 'Le dices que cuando toque, allí estarás. Ella no responde; no le hace falta. La deuda sigue ahí, quieta, esperando su momento. '
                 + 'Con Mara, deber un favor es llevar una piedra pequeña en el bolsillo: no pesa mucho, pero la notas cada vez que te mueves.' },
      { texto: 'No contestar. Ya llegará.',
        efectos:{ humano:{ disociacion:+2 } },
        resultado: 'No contestas. Tampoco cambia nada: el favor no caduca, y Mara tampoco. Sigues con lo tuyo sabiendo que un día, sin avisar, '
                 + 'ese mensaje se convertirá en un encargo que no vas a poder rechazar.' }
    ]
  }

  };

  Object.keys(S).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = S[id]; });

})();
