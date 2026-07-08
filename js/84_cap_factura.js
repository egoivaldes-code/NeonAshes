// ============================================================
// BLOQUE JS-84 — CAPÍTULO "LA FACTURA" (cobra la deuda de Mara)
// ------------------------------------------------------------
// Capítulo de PERSONAJE, no de misterio. Cobra la deuda que quedó
// apuntada en el giro (js/83): si el jugador pidió a Mara que le
// abriera la puerta del archivo, le quedó debiendo un favor. Ahora
// Mara lo cobra.
//
// ENGANCHE: solo aparece a quien DEBE el favor (visto 'cg_deuda_mara').
// Quien entró al archivo de otra forma nunca ve este capítulo.
//
// REGLAS DE TONO (aprobadas):
//   · Íntimo, tenso, SIN épica. El peso está en lo moral, no en la acción.
//   · Mara NUNCA explica sus sentimientos. Su hilo personal se deduce solo
//     por lo que calla y evita. CERO melodrama.
//   · El favor se ata al NOMBRE que Mara calló en el giro. Nunca se nombra
//     ni se explica. El jugador cumple sin entender del todo qué toca.
//   · La decisión jugosa: ENTREGAR sin mirar (confianza, deuda limpia) o
//     MIRAR lo que llevas (entiendes un pedazo del pasado de Mara, y algo
//     se enfría). Las dos saldan la deuda; cambian la relación.
//   · Combate PEQUEÑO y EVITABLE (se puede resolver con maña, sin pelear).
//   · NO sube la trama principal (sigue en nivel 3), NO revela CERO, NO
//     toca Centauri de frente. Es carácter colgado del hilo.
//
// BANDERAS: fac_miro (husmeaste) · fac_hecho (capítulo completado).
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CAP = {

  // ---- ENTRADA: Mara cobra la deuda ----
  'fac_p1': {
    entrada: true,
    repetible: true, // si se interrumpe a medias, vuelve a ofrecerse
    cond: { visto: 'cg_deuda_mara', noVisto: 'fac_hecho' },
    img: 'APT',
    texto: 'El mensaje de Mara llega de noche, sin preámbulo. No pregunta si puedes. Da por hecho que vas.<br><br>'
         + '<span style="color:var(--magenta)">«El favor que me debes. Toca. Hay una caja pequeña, sellada, en un guardamuebles del sector viejo. '
         + 'La tiene un tipo que se llama Remy. Págale lo que pida, o convéncelo, o lo que sea. Tráemela. Cerrada.»</span><br><br>'
         + 'Le preguntas de qué va. Tarda en contestar, y cuando lo hace no contesta:<br><br>'
         + '<span style="color:var(--magenta)">«Va de que me debes una. Con eso te vale.»</span><br><br>'
         + 'Pero hay algo en cómo lo escribe —demasiado corto, demasiado seco, hasta para ella— que te dice que esto no es un recado cualquiera. '
         + 'Es de esas cosas que a Mara le cuesta hasta pedir.',
    opciones: [
      { texto: 'Ir a por la caja.', lleva:'fac_recoger' }
    ]
  },

  // ---- RECOGER: Remy y la caja (combate pequeño y evitable) ----
  'fac_recoger': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El guardamuebles es un pasillo de taquillas oxidadas al fondo de un sector que huele a agua estancada. Remy resulta ser un tipo '
         + 'nervioso, flaco, con demasiada cafeína encima. Tiene la caja —una cosa metálica del tamaño de dos puños, sellada de fábrica— pero '
         + 'no quiere soltarla fácil. «Me dijeron que esto no salía de aquí. Me pagaron por eso.»',
    opciones: [
      { texto: 'Convencerlo: pagar más, prometer, mentir. Lo que haga falta.',
        efectos: { creditos:-70 },
        resultado: 'Le pones setenta créditos delante y una historia creíble detrás. Remy mira el dinero, mira la puerta, y decide que la '
                 + 'lealtad se le acaba justo donde empieza el miedo a lo que le pase si se queda con la caja. Te la da con las manos temblando. '
                 + '«Yo no te he visto», dice. Ojalá fuera verdad para los dos.',
        lleva:'fac_tienes' },
      { texto: 'Quitársela por las malas.',
        resultado: 'Se acabó la charla. Remy ve tu cara, entiende que no vas a irte sin ella, y comete la tontería de intentar impedirlo. '
                 + 'No está solo: un colega suyo sale de detrás de las taquillas con un tubo en la mano.',
        pelea: {
          texto: 'No son profesionales. Son dos don nadie asustados defendiendo un encargo que les queda grande. Pero el miedo también pega, '
               + 'y en un pasillo estrecho un tubo hace el mismo daño lo lleve quien lo lleve.',
          integridad: 10,
          enemigos: [
            { nombre:'Remy', desc:'Flaco, nervioso, acorralado', tipo:'cobarde', integridad:3, fuerza:3, umbral:3 },
            { nombre:'El del tubo', desc:'Más músculo que idea', tipo:'normal', integridad:4, fuerza:3, umbral:4 }
          ],
          gana: 'fac_tienes',
          pierde: 'fac_malherido'
        } }
    ]
  },

  // Perdiste la pelea pero te llevas la caja igual.
  'fac_malherido': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Te llevas más golpes de los que esperabas de dos aficionados. Pero el miedo les dura menos que a ti las ganas, y cuando Remy ve '
         + 'que no paras, sueltan la caja y salen corriendo. Te quedas en el pasillo, dolorido, con la caja bajo el brazo y la sensación '
         + 'ridícula de haber ganado perdiendo.',
    opciones: [
      { texto: 'Coger la caja y salir cojeando.',
        efectos: { condicion:'herida_brazo_d_leve', fatiga:+10 },
        resultado: 'La caja pesa poco para lo que va a pesarte a ti mañana el brazo. Emprendes la vuelta.',
        lleva:'fac_tienes' }
    ]
  },

  // ---- LA TENTACIÓN: mirar o no ----
  'fac_tienes': {
    img: 'APT',
    texto: 'De vuelta a casa, la caja encima de la mesa. Sellada de fábrica, sí, pero tú sabes abrir cosas selladas de fábrica sin que se note. '
         + 'Y Mara la quería <i>cerrada</i>. Eso, en alguien como ella, no es un detalle: es una advertencia.<br><br>'
         + 'La miras un rato largo. Pesa poco. Suena a nada cuando la mueves, como si dentro hubiera papel, o tela, o recuerdos. '
         + 'Nadie sabría nunca que la abriste. Nadie, salvo tú.',
    opciones: [
      { texto: 'Entregársela sin mirar. Un favor es un favor.',
        efectos: { marcaVisto:'fac_confianza_mara' },
        lleva:'fac_cierre_confianza' },
      { texto: 'Abrirla. Necesitas saber qué estás cargando.',
        efectos: { marcaVisto:'fac_miro' },
        resultado: 'Le hablas al sello con paciencia hasta que cede sin romperse. Puedes volver a cerrarlo luego y ella no lo notará. '
                 + 'Eso te dices.',
        lleva:'fac_mira' }
    ]
  },

  // ---- LO QUE HAY DENTRO (oblicuo; el pasado de Mara por lo que calla) ----
  'fac_mira': {
    img: 'APT',
    texto: 'Dentro no hay dinero, ni datos, ni nada que valga en el mercado. Hay una vida pequeña, guardada.<br><br>'
         + 'Una placa de identidad vieja, de un formato que ya no se usa, con un nombre medio raspado —el mismo nombre que hizo callar a Mara '
         + 'frente a la lista de Coll—. Una foto gastada de dos personas riendo en un sitio que no reconoces, con demasiada luz. Una de las dos '
         + 'caras está borrada a conciencia, con saña, por alguien que no soportaba verla. La otra, más joven, más entera, con menos noches '
         + 'encima, es Mara.<br><br>'
         + 'Y en el reverso, escrito a mano, apretado, una fecha anterior a la partida de la Expedición y tres palabras que no vas a repetirle '
         + 'a nadie nunca:<br>'
         + '<span style="opacity:.85;font-style:italic">«Vuelve. Te espero.»</span><br><br>'
         + 'No entiendes toda la historia. No hace falta. Entiendes lo suficiente para saber que acabas de mirar algo que no era para ti, '
         + 'y que Mara lleva años cargando una caja que no se atreve ni a abrir ni a tirar.',
    opciones: [
      { texto: 'Volver a sellarla y llevársela igual.',
        resultado: 'Cierras el sello con el mismo cuidado con que lo abriste. Queda perfecto. Pero tú ya no eres el mismo que llegó a casa '
                 + 'con la caja, y eso no hay sello que lo cierre.',
        lleva:'fac_cierre_frio' }
    ]
  },

  // ---- CIERRE A: entregaste sin mirar (confianza) ----
  'fac_cierre_confianza': {
    img: 'APT',
    texto: 'Le llevas la caja a Mara tal cual salió del guardamuebles. Sellada. La coge con las dos manos, con un cuidado que no le habías '
         + 'visto nunca, y la aparta enseguida de tu vista, como quien esconde una herida.<br><br>'
         + 'Comprueba el sello. Ve que está intacto. Y algo en su cara —un segundo, no más— se afloja.<br><br>'
         + '<span style="color:var(--magenta)">«No la abriste.»</span> No es una pregunta. <span style="color:var(--magenta)">«Bien.»</span><br><br>'
         + 'No te da las gracias con esa palabra. Te las da quedándose un momento más de la cuenta antes de cortar, como si por una vez no '
         + 'tuviera prisa por que te fueras.',
    opciones: [
      { texto: 'Dejarla con lo suyo.',
        efectos: { marcaVisto:'fac_hecho', creditos:+60 },
        resultado: 'Te desliza sesenta créditos «por las molestias con Remy», que los dos sabéis que no cubren nada. La deuda queda saldada, '
                 + 'y algo más queda abierto: te has ganado, sin buscarlo, un pedazo de confianza de alguien que no la reparte. Puede que, algún '
                 + 'día, sea ella quien decida contarte lo que hay en esa caja.'
                 + '<br><br><span class="eg-pista">— Has saldado tu deuda con Mara —</span>' }
    ]
  },

  // ---- CIERRE B: miraste (algo se enfría) ----
  'fac_cierre_frio': {
    img: 'APT',
    texto: 'Le llevas la caja a Mara con el sello perfecto, imposible de distinguir del original. La coge con las dos manos, con un cuidado '
         + 'que no le habías visto nunca. Comprueba el sello. Está intacto.<br><br>'
         + 'Y aun así, cuando levanta la vista, te mira un segundo de más. No dice nada. No te acusa de nada. Pero Mara se gana la vida leyendo '
         + 'a la gente, y algo en cómo estás de pie, en cómo no le sostienes del todo la mirada, se lo cuenta todo.<br><br>'
         + '<span style="color:var(--magenta)">«Gracias.»</span> La palabra sale correcta y vacía, como una puerta que se cierra con educación. '
         + '<span style="color:var(--magenta)">«Ya está. No me debes nada.»</span><br><br>'
         + 'Y es verdad. Ya no le debes nada. Ese es justo el problema: entre vosotros, a partir de ahora, todo estará pagado. Nada prestado. '
         + 'Nada compartido.',
    opciones: [
      { texto: 'Marcharte.',
        efectos: { marcaVisto:'fac_hecho', creditos:+60 },
        resultado: 'Te desliza sesenta créditos sin mirarte y vuelve a lo suyo. La deuda queda saldada al céntimo. Sabes algo de ella que no '
                 + 'deberías saber, y ella sabe que lo sabes, y ninguno de los dos lo va a decir jamás. A veces entender a alguien es la forma '
                 + 'más rápida de perderlo un poco.'
                 + '<br><br><span class="eg-pista">— Has saldado tu deuda con Mara —</span>' }
    ]
  }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(CAP).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CAP[id];
  });

})();
