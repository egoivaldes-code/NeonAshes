// ============================================================
// BLOQUE JS-83 — CAPÍTULO "LOS ARCHIVOS QUE NADIE ABRE" (EL GIRO)
// ------------------------------------------------------------
// El capítulo más delicado del juego. Continúa "La archivista" (js/82):
// el hilo apunta a los archivos viejos de HELIX, "los que nadie abre".
// Aquí las pistas dejan de parecer un chanchullo corporativo y el
// jugador SIENTE que hay algo mucho más viejo debajo. Lleva la trama
// al nivel 3.
//
// REGLAS DE TONO (aprobadas, innegociables):
//   · EL GIRO SÍ CUAJA: los recuerdos imposibles no se están ALTERANDO;
//     se están RECUPERANDO. Se da DE REFILÓN, nunca en un discurso.
//   · CENTAURI SE CONECTA por fin: la lista de Coll ata nombres a la
//     vieja Expedición Centauri.
//   · CERO SIGUE SIENDO PURA SOMBRA: se siente como un eco / un error /
//     una presencia que recuerda en voz alta SIN dirigirse a ti. NUNCA
//     habla contigo, NUNCA se explica, NUNCA hay conversación con él.
//   · La "presencia" que puede despertar es una DEFENSA AUTOMÁTICA vieja
//     del archivo, NO CERO. El combate es POSIBLE pero EVITABLE (dos
//     oportunidades de evitarlo).
//   · La pista personal de MARA se planta aquí, MÍNIMA y SOLO por lo que
//     calla (un nombre de la lista en el que se para en seco, un silencio
//     de más). Nunca en claro, nunca melodrama.
//   · Se tiende el horizonte (esto, algún día, lleva fuera de la Tierra)
//     SIN ir aún. Fase Espacio es alcance de más adelante.
//
// ENGANCHE: se desbloquea al COMPLETAR "La archivista" (visto
// 'cap_arch_hecho', lo marcan todos sus finales). Trama a nivel 3 al
// ganar el recuerdo 'eco_otro_cielo'. Marca 'cg_hecho' al terminar.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const CAP = {

  // ============================================================
  // MOVIMIENTO 1 — ENTRAR AL ARCHIVO MUERTO
  // ============================================================
  'cg_p1': {
    entrada: true,
    repetible: true, // si se interrumpe a medias, vuelve a ofrecerse
    cond: { visto: 'cap_arch_hecho', noVisto: 'cg_hecho' },
    img: 'APT',
    texto: 'La caja de Coll no te deja dormir. Sus nombres, sus fechas imposibles, esa palabra tachada mil veces. Y la frase de Mara dándote '
         + 'vueltas: <i>esto empieza mucho más atrás, en los archivos viejos de HELIX, los que nadie abre.</i><br><br>'
         + 'No es un sitio. Es un cementerio. Un archivo muerto de hace generaciones, sellado cuando HELIX migró sus sistemas y dejó atrás '
         + 'lo que ya no le servía: formatos que nadie sabe leer, servidores que siguen encendidos por inercia, datos pudriéndose despacio '
         + 'en la oscuridad. Nadie baja ahí. Por eso Coll escondía cosas ahí.<br><br>'
         + 'Entrar es el problema.',
    opciones: [
      { texto: 'Buscar a un Archivista que sepa caminar por esas ruinas.',
        efectos: { creditos:-90 },
        resultado: 'Los Archivistas viven de esto: de recordar por dinero. El que encuentras es un viejo de dedos manchados que no pregunta '
                 + 'para qué lo quieres —«nunca preguntamos», dice— y por noventa créditos te dibuja un camino por los formatos muertos hasta '
                 + 'la parte donde bajó Coll sus cosas. «Ten cuidado ahí abajo. Algunos de esos sistemas todavía sueñan.»',
        lleva:'cg_dentro' },
      { texto: 'Entrar por tu cuenta, por oficio.',
        req: { profesion:{ id:'hacker' } }, pista:'haría falta oficio de hacker',
        resultado: 'No necesitas guía. Le hablas al archivo muerto en su idioma antiguo, con paciencia, dejando que cada capa muerta te '
                 + 'cuente por dónde sigue la siguiente. Entras solo, en silencio, como quien profana una tumba sabiendo que lo es.',
        lleva:'cg_dentro' },
      { texto: 'Pedirle a Mara que te abra una puerta.',
        efectos: { marcaVisto:'cg_deuda_mara' },
        resultado: 'Mara tarda en contestar. Cuando lo hace, te pasa un acceso sin explicar de dónde lo saca. «No preguntes qué me cuesta esto. '
                 + 'Y no me hagas arrepentirme. Algún día te pediré algo a cambio, y ese día no vas a poder decirme que no.» La puerta se abre. '
                 + 'Ella no dice una palabra más en un buen rato. Ahora le debes una, y las suyas se cobran caras.',
        lleva:'cg_dentro' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 2 — EL CRUCE (Centauri se conecta)
  // ============================================================
  'cg_dentro': {
    img: 'APT',
    texto: 'Dentro, el archivo huele a polvo eléctrico y a tiempo detenido. Cruzas la lista de Coll con lo que aún se deja leer, y poco a poco '
         + 'el patrón se levanta solo, como una figura en la niebla.<br><br>'
         + 'Los nombres de la lista no son de ahora. Son viejos. Y todos, todos, cuelgan de una misma cosa enterrada en los registros: la '
         + '<b>Expedición Centauri</b>. Esa palabra que solo sale en placas oxidadas y en canciones que ya nadie termina. La primera gran '
         + 'misión a otra estrella. La que salió hace décadas y de la que no volvió nadie.<br><br>'
         + 'Pero hay algo peor, y no lo entiendes todavía. Atados a esos nombres hay recuerdos guardados como pruebas: un <b>mar</b> en un mundo '
         + 'que nunca tuvo mar. <b>Nieve</b> descrita por gente que jamás la pisó. Descripciones idénticas hechas por personas que no se '
         + 'conocieron ni coincidieron jamás.',
    opciones: [
      { texto: 'Seguir tirando del hilo, hasta el fondo.',
        efectos: { fragmento:'eco_mar' },
        lleva:'cg_giro' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 3 — EL GIRO (de refilón) + la presencia
  // ============================================================
  'cg_giro': {
    img: 'APT',
    texto: 'Y entonces lo ves, sin que nadie te lo diga, de golpe, como se ven las cosas que ya no se pueden dejar de ver:<br><br>'
         + 'Esos recuerdos imposibles no se los están <i>metiendo</i> a la gente. No se los están inventando ni alterando. Es al revés. '
         + 'La gente los está <b>recordando</b>. Recuerdan algo que fue anterior a ellos. Algo de mucho antes.<br><br>'
         + 'No sabes qué significa. No quieres saberlo. Pero encaja con una precisión que da miedo: la lista, las fechas imposibles, Centauri, '
         + 'los sueños repetidos de desconocidos. Todo apunta hacia atrás, hacia algo que ya estaba aquí antes que tú, antes que todos.<br><br>'
         + 'Y en ese momento, en lo más hondo del archivo muerto, algo <b>responde</b>. No a ti. No te habla. Es un eco viejo que se remueve '
         + 'solo, un fragmento de algo que recuerda en voz alta sin saber que hay alguien escuchando. Se te eriza la piel. La palabra tachada '
         + 'de la lista de Coll parpadea una vez en una pantalla muerta, y se apaga.',
    opciones: [
      { texto: 'Apagarlo todo y salir. Ya has visto suficiente.',
        efectos: { fragmento:'eco_otro_cielo', disociacion:+6 },
        resultado: 'Cortas la corriente de esa sección con las manos temblando y sales de espaldas, sin darle la espalda del todo, como se sale '
                 + 'de un velatorio. Te llevas lo que has entendido. Ojalá no lo hubieras entendido.',
        lleva:'cg_cierre' },
      { texto: 'Quedarte. Escuchar el eco hasta el final.',
        efectos: { fragmento:'eco_otro_cielo' },
        resultado: 'No puedes irte. Te quedas, y escuchas, y dejas que ese eco viejo pase por ti como una corriente de aire frío. No entiendes '
                 + 'las palabras —no son palabras— pero entiendes el peso. Y mientras escuchas, algo más profundo en el archivo se despierta.',
        lleva:'cg_presencia' }
    ]
  },

  // La "presencia": defensa automática vieja del archivo (NO es CERO).
  'cg_presencia': {
    img: 'APT',
    texto: 'No es el eco. El eco no tiene manos. Esto sí: un sistema de custodia antiguo, dormido desde hace generaciones, registra que hay '
         + 'alguien despierto donde no debería haber nadie, y empieza a moverse. Luces rojas que llevaban siglos apagadas. Un zumbido bajo, '
         + 'de metal que recuerda cómo se camina. No es una inteligencia. Es un perro guardián muerto al que alguien acaba de tirarle de la cola.',
    opciones: [
      { texto: 'Salir por patas antes de que despierte del todo.',
        efectos: { disociacion:+8, fatiga:+6 },
        resultado: 'Eliges no averiguar qué hace ese guardián cuando termina de despertar. Corres por los formatos muertos con el zumbido '
                 + 'pisándote los talones, y sales al mundo de los vivos con el corazón desbocado y menos ganas de dormir que nunca. Pero sales entero.',
        lleva:'cg_cierre' },
      { texto: 'Aguantar y llevarte todo lo que puedas antes de irte.',
        resultado: 'No has llegado hasta el fondo para irte con las manos a medio llenar. Te quedas un minuto más de la cuenta. El guardián '
                 + 'termina de despertar justo cuando ibas a marcharte.',
        pelea: {
          letal: true, // misión principal: caer aquí puede matar de verdad
          texto: 'No son personas. Son unidades de custodia viejas, lentas y pesadas, pero blindadas por dentro con siglos de olvido. No sienten, '
               + 'no dudan, y no paran hasta que la sección vuelve a estar en silencio.',
          integridad: 13,
          enemigos: [
            { nombre:'Custodio del archivo', desc:'Metal viejo que recuerda cómo golpear', tipo:'bruto', integridad:5, fuerza:4, umbral:5 },
            { nombre:'Dron de sellado', desc:'Zumba, corrige, insiste', tipo:'normal', integridad:3, fuerza:3, umbral:4 }
          ],
          refuerzoTurno: 3,
          refuerzoTurnoGrupo: [
            { nombre:'Custodio del archivo', desc:'Otro que despierta al ruido', tipo:'bruto', integridad:5, fuerza:4, umbral:5 }
          ],
          gana: 'cg_cierre',
          pierde: 'cg_malherido'
        } }
    ]
  },

  // Perdiste contra la custodia: sales malherido pero sales.
  'cg_malherido': {
    img: 'APT',
    texto: 'El metal viejo pega más fuerte de lo que un metal tan viejo debería. Hay un momento en que el suelo del archivo está muy cerca y '
         + 'todo suena a hierro y a estática. Pero estas cosas no están hechas para perseguir: solo para expulsar. Cuando te arrastras fuera '
         + 'de su sección, dejan de seguirte, como si nunca hubieras estado.',
    opciones: [
      { texto: 'Arrastrarte fuera del archivo.',
        efectos: { condicion:'conmocion', fatiga:+16, disociacion:+10 },
        resultado: 'Sales del cementerio de datos molido y mareado, con un pitido en los oídos que va a tardar en irse. Pero sales, y sales '
                 + 'con lo que fuiste a buscar clavado en la cabeza. Ojalá se te olvidara.',
        lleva:'cg_cierre' }
    ]
  },

  // ============================================================
  // MOVIMIENTO 4 — CIERRE (Mara, por lo que calla · el horizonte)
  // ============================================================
  'cg_cierre': {
    img: 'APT',
    texto: 'Le cuentas a Mara lo que encontraste. Que los recuerdos no se alteran: se recuperan. Que la lista de Coll cuelga entera de la '
         + 'Expedición Centauri. Que algo, ahí abajo, todavía recuerda en voz alta.<br><br>'
         + 'Mara escucha en silencio. Le pides que mire la lista de nombres una vez más, por si le suena alguno. La lee despacio. Y en uno de '
         + 'ellos —solo en uno— se para.<br><br>'
         + 'No mucho. Un segundo. Dos. Lo justo para que lo notes.<br><br>'
         + '<span style="color:var(--magenta)">«…No. No me suena de nada.»</span><br><br>'
         + 'Y cambia de tema antes de que puedas preguntar, con esa manera suya de cerrar una puerta sin que oigas el golpe. No vuelves a '
         + 'mencionarlo. Ella tampoco. Pero los dos sabéis que se ha parado.',
    opciones: [
      { texto: 'Dejar que cambie de tema.',
        efectos: { marcaVisto:'cg_hecho' },
        resultado: 'Antes de cortar, Mara dice una última cosa, mirando a ningún sitio:<br><br>'
                 + '<span style="color:var(--magenta)">«Esto no termina en un archivo. Ni siquiera termina en la Tierra. Pero hoy no. Hoy '
                 + 'ya hemos removido bastante.»</span><br><br>'
                 + 'Y tiene razón. Esa noche, cuando por fin te tumbas, cierras los ojos y ves un cielo con demasiadas estrellas, mal puestas, '
                 + 'como si alguien las recordara de memoria. Ya no sabes si el recuerdo es tuyo. Ya no estás seguro de que importe.'
                 + '<br><br><span class="eg-pista">— Has entendido lo que nadie debía entender —</span>' }
    ]
  }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(CAP).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = CAP[id];
  });

})();
