// ============================================================
// BLOQUE JS-80 — SEGUNDA MISIÓN DE MARA ("EL MALETÍN")
// ------------------------------------------------------------
// Primer eslabón de la COLUMNA PRINCIPAL guionizada (campaña
// dirigida pero opcional). Mara te pasa un segundo encargo; su
// centro es una pelea, reusando el combate de escena ya cableado.
//
// CÓMO LLEGA:
//   · Se desbloquea al COMPLETAR la misión del paquete: al volver
//     al apartamento se marca el "visto" interno 'mara2_ofrecida'
//     (ver js/29_mision_casillero.js). A partir de ahí, la próxima
//     vez que el jugador SALGA a explorar, puede aparecer la entrada.
//   · Mara "da" el encargo dentro de la propia escena (su cifrado
//     abre la misión), así que se siente dirigido sin tocar el
//     terminal.
//
// TONO (protege la biblia aunque Mara ya dé misiones):
//   · Es un trabajo sucio normal, no "el gran misterio". El jugador
//     no es un héroe: es un currante al que han contratado.
//   · Solo deja caer UN hilo tenue (una etiqueta vieja en el
//     maletín). NADA de Centauri ni de CERO todavía.
//   · Mara reacciona con alivio contenido, nunca melodrama.
//
// Se registra en ESCENAS_GUION con el mismo patrón que las cadenas
// (55/76). No es de 'cadena', así que no compite con el límite de
// "una parte por run".
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const MISION = {

    // ---- ENTRADA: Mara te pasa el encargo, y se tuerce ----
    'mara2_p1': {
      entrada: true,
      repetible: true, // si se interrumpe a medias, vuelve a ofrecerse
      cond: { visto: 'mara2_ofrecida', noVisto: 'mara2_hecha' },
      img: 'EXP_CALLEJON_NIVELES',
      texto: 'Un parpadeo cifrado te cruza la lente a media calle. Es ella. Sin saludo, como siempre.<br><br>'
           + '<span style="color:var(--magenta)">«Otro encargo. Un maletín, en el corredor muerto del mercado bajo. '
           + 'Pregunta por Brida. Lo recoges y me lo traes. No lo abras. No te entretengas.»</span><br><br>'
           + 'El mercado bajo huele a agua estancada y fruta pasada. Brida resulta ser un hombre menudo que no para '
           + 'de mirar por encima de tu hombro. Te tiende el maletín con dedos que tiemblan un poco. '
           + '«Llévatelo ya, ¿quieres? Hace tres días que no duermo por esta cosa.»<br><br>'
           + 'No llegas a darle las gracias. Tres siluetas entran por el otro extremo del corredor, sin prisa, '
           + 'cerrándote la única salida cómoda. Uno de ellos señala el maletín con la barbilla. '
           + 'Brida ya no está: se ha esfumado entre los puestos. Quedáis el maletín, tú, y ellos.',
      opciones: [
        { texto: 'Agarrar el maletín y plantar cara.',
          resultado: 'No hay dónde correr que no sea hacia ellos. Te echas la correa del maletín al hombro, '
                   + 'liberas las manos y avanzas. Si quieren la cosa, van a tener que quitártela.',
          pelea: {
            letal: true, // misión principal: caer aquí puede matar de verdad
            texto: 'Son carroñeros, no soldados: rápidos, hambrientos, mal coordinados. Pero son tres, '
                 + 'y el corredor es estrecho. No tienes que matar a nadie. Tienes que salir con el maletín.',
            integridad: 11,
            enemigos: [
              { nombre:'Carroñero', desc:'Va directo a por la correa', tipo:'normal', integridad:3, fuerza:3, umbral:3 },
              { nombre:'Carroñero', desc:'Intenta flanquearte', tipo:'rapido', integridad:2, fuerza:3, umbral:2 }
            ],
            refuerzoTurno: 3,
            refuerzoTurnoGrupo: [
              { nombre:'El que manda', desc:'Llega tarde y con prisa por acabar', tipo:'lider', integridad:4, fuerza:4, umbral:5 }
            ],
            gana: 'mara2_win',
            pierde: 'mara2_lose'
          } },
        { texto: 'Cubrir la retirada con humo y salir limpio.',
          req: { item: 'granada_humo' }, pista: 'necesitarías un bote de humo',
          efectos: { quitaItem:'granada_humo', fatiga:+5, marcaVisto:'mara2_combate_evitado' },
          resultado: 'Revientas el bote contra el suelo y el corredor se vuelve una pared blanca. '
                   + 'Aprovechas los tres segundos de ceguera para colarte entre los puestos con el maletín pegado al cuerpo. '
                   + 'Para cuando el humo se disipa, ya eres otra sombra más del mercado. Sin un golpe.',
          lleva: 'mara2_win' }
      ]
    },

    // ---- DESENLACE: lo conseguiste ----
    'mara2_win': {
      texto: 'El maletín no pesa casi nada, y eso lo hace peor: lo que vale poco en kilos suele costar caro en otras cosas.<br><br>'
           + 'Mara aparece donde dijo que no estaría. Te mira de arriba abajo una vez, rápida, profesional. '
           + '«Estás entero.» No es una pregunta, y tampoco del todo una constatación: es lo más cerca del alivio '
           + 'que la vas a oír. Coge el maletín, comprueba el cierre sin abrirlo, y te pasa los créditos sin contarlos delante de ti.<br><br>'
           + 'Antes de que lo guarde, lo ves un segundo: una etiqueta vieja pegada en el canto, medio despegada, '
           + 'con un código en un formato que no reconoces. De los de antes. Mara sigue tu mirada, y su mano tapa la etiqueta '
           + 'como sin querer. «No has visto nada. Como siempre.» Y se va, antes de que se te ocurra preguntar qué es "antes".',
      opciones: [
        { texto: 'Coger los créditos y dejarlo estar.',
          efectos: { creditos:+220, aislamiento:-4, marcaVisto:'mara2_hecha' },
          resultado: 'Te guardas los créditos y la pregunta. Las dos cosas pesan parecido. '
                   + 'Hace tiempo que aprendiste que en las Pilas hay cosas que se cobran mejor sin entenderlas.'
                   + '<br><br><span class="eg-pista">— Has completado un encargo para Mara —</span>' }
      ]
    },

    // ---- DESENLACE: te dieron una paliza, pero saliste ----
    'mara2_lose': {
      texto: 'Sales del corredor más por testarudez que por maña, con el maletín y con la mitad de la cara hinchada. '
           + 'Dejaste algo de ti en el suelo del mercado: sangre, sobre todo, y las pocas ganas que te quedaban de noches así.<br><br>'
           + 'Mara te espera donde dijo que no. Te ve la cara y aprieta los labios. No te pregunta. Coge el maletín, '
           + 'comprueba el cierre, y te paga —menos de lo que esperabas, o eso te parece a través del ojo que se cierra.<br><br>'
           + '«La próxima, si te superan en número, sueltas la cosa y corres. El maletín se reemplaza. Tú, según el día.» '
           + 'Es lo más parecido a preocuparse que le has visto. Se va sin esperar respuesta.',
      opciones: [
        { texto: 'Arrastrarte a casa.',
          efectos: { creditos:+90, fatiga:+10, disociacion:+3, marcaVisto:'mara2_hecha' },
          resultado: 'Caminas pegado a las paredes hasta tu unidad. Cada paso te recuerda dónde te alcanzaron. '
                   + 'Pero estás vivo, tienes algo de dinero, y el maletín ya es problema de otra. '
                   + 'A veces eso es todo lo que se puede pedir a una noche.'
                   + '<br><br><span class="eg-pista">— Has completado un encargo para Mara —</span>' }
      ]
    }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(MISION).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = MISION[id];
  });

})();
