// ============================================================
// BLOQUE JS-93 — EL MUNDO RECUERDA (segunda tanda, v0.159)
// ------------------------------------------------------------
// Cosechas de decisiones que ya se sembraban pero que el mundo
// no recogía. Todo ADITIVO, contexto sandbox (no letal), sin
// tocar la trama. Mismo patrón que js/88.
//
//   sem_doggo    <- trab_doggo_enemigo   (humillaste a Doggo por el pozo)
//   sem_backdoor <- trab_hacker_backdoor (te dejaste llave en el pulmón)
//   sem_renke    <- trab_renke_vendido   (vendiste a Renke al del cartel)
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const S = {

  // ---- DOGGO no lo olvidó ----
  'sem_doggo': {
    entrada: true,
    cond: { visto:'trab_doggo_enemigo', noVisto:'sem_doggo' },
    img: 'EXP_CANAL_PILAS',
    texto: 'Vuelves a los canales a por chatarra y algo no encaja. Tus pozos de siempre están marcados con tiza: un círculo tachado. '
         + 'Un crío que hace de vigía te lo suelta sin mirarte: «Doggo dice que este tramo ya no es tuyo. Dice que todavía se acuerda del '
         + 'cobre.» No ves a nadie, pero notas los ojos. La rebusca es un mundo pequeño, y Doggo cojea pero no olvida.',
    opciones: [
      { texto: 'Dejarle un pico del próximo botín, como paz.',
        efectos:{ creditos:-120, reputacion:+3, humano:{ aislamiento:-2 } },
        resultado: 'Le haces llegar una parte: sin nota, sin disculpa, solo cobre. A los días la tiza desaparece de tus pozos. No sois amigos, '
                 + 'pero en los canales eso ya es algo: le has dicho, en el único idioma que entiende, que no querías humillarlo, solo comer. '
                 + 'Ciento veinte créditos por que un hombre deje de mirarte la espalda. Barato, si lo piensas.' },
      { texto: 'Ignorarlo. Ya se le pasará.',
        efectos:{ humano:{ aislamiento:+3, disociacion:+2 } },
        resultado: 'Sigues rebuscando como si nada. Y no pasa nada… todavía. Pero cambias de pozos más a menudo, miras dos veces cada pasillo y '
                 + 'duermes con un ojo abierto. Un enemigo que no da la cara no se va: solo espera. Te lo llevas puesto, como una piedra en el '
                 + 'bolsillo.' }
    ]
  },

  // ---- LA LLAVE QUE TE DEJASTE ----
  'sem_backdoor': {
    entrada: true,
    cond: { visto:'trab_hacker_backdoor', noVisto:'sem_backdoor' },
    img: 'APT',
    texto: 'Un mensaje entra en tu terminal a las tantas, sin remite y con un cifrado que huele a dinero. Alguien sabe lo que nadie debería '
         + 'saber: que dejaste una puerta trasera en el pulmón del bloque, esa por la que respiran cien familias.<br><br>'
         + '<span style="color:var(--magenta)">«Sabemos que tienes la llave. La compramos bien. El aire de esa gente vale más para nosotros que '
         + 'para ti. No preguntes para qué.»</span>',
    opciones: [
      { texto: 'Vender el acceso. El aire no es asunto tuyo.',
        efectos:{ creditos:+300, quitaItem:'Acceso oculto: pulmón del bloque', humano:{ disociacion:+8, aislamiento:+2 } },
        resultado: 'Mandas la llave y llega el pago, limpio y frío. Trescientos créditos por una puerta que no volverás a abrir. Unos días esperas '
                 + 'leer algo en las noticias del bloque —un fallo de filtros, una evacuación— y no llega nada. Quizá no la usen nunca. Quizá ya '
                 + 'la estén usando. Ese "quizá" se te queda a vivir dentro.' },
      { texto: 'Borrar la puerta. No quieres eso encima.',
        efectos:{ quitaItem:'Acceso oculto: pulmón del bloque', reputacion:+2, humano:{ aislamiento:-3 } },
        resultado: 'Te metes una última vez, cierras tu propia llave y la quemas por dentro. Nadie te paga por esto; nadie lo sabrá jamás. Cien '
                 + 'familias siguen respirando sin deberte nada, y tú te quitas de encima algo que pesaba más que cualquier crédito. Esa noche '
                 + 'duermes un poco mejor. A veces ese es todo el sueldo que hay.' }
    ]
  },

  // ---- EL QUE VENDE PERSONAS ----
  'sem_renke': {
    entrada: true,
    cond: { visto:'trab_renke_vendido', noVisto:'sem_renke' },
    img: 'MERCADO',
    texto: 'Estás cerrando un trato menor en el mercado —información, nada del otro mundo— cuando la mujer del puesto te mira distinto y baja '
         + 'la voz. «Ah. Tú eres el que entregó a Renke.» No lo dice con rabia; lo dice como quien comenta el tiempo. «Suplicaba que lo llevaran '
         + 'al puesto oficial. Tú cobraste y lo pusiste en las manos que más temía.» Recoge su género despacio. «Aquí la gente se acuerda de a '
         + 'quién se le puede pedir ayuda. Y de a quién no.»',
    opciones: [
      { texto: '«Seguí el contrato. Lo que pase después no es asunto mío.»',
        efectos:{ reputacion:-2, humano:{ disociacion:+4 } },
        resultado: 'Lo dices y casi te lo crees. Ella asiente, no discute, y te niega el trato con una educación que corta más que un insulto. El '
                 + 'mercado es una memoria con puestos: para cuando llegas a la esquina, dos personas más han apartado la mirada. Seguir el '
                 + 'contrato a la letra tiene un precio, y se paga en las puertas que dejan de abrirse.' },
      { texto: 'Aguantar el golpe en silencio y marcharte.',
        efectos:{ humano:{ aislamiento:+4 } },
        resultado: 'No te defiendes. ¿Con qué? Recoges lo tuyo y te vas sin el trato y sin excusas. Lo que hiciste con Renke no se arregla con '
                 + 'una frase ingeniosa, y lo sabes. Te queda el silencio y una lección barata que llega tarde: en las Pilas, vender a alguien '
                 + 'que te pide auxilio se paga durante mucho tiempo, en la moneda de que nadie quiera deberte nada.' }
    ]
  }

  };

  Object.keys(S).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = S[id]; });

})();
