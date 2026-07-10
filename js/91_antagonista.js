// ============================================================
// BLOQUE JS-91 — HELIX COMO ANTAGONISTA DE SISTEMA (v0.155)
// ------------------------------------------------------------
// Primera capa del antagonista según la Biblia: en Fase Tierra
// HELIX solo aparece como MARCA y como fricción administrativa,
// nunca como villano con cara. Nada de C-10, Vocales ni Mesa Negra
// todavía: eso se reserva para la fase media/espacial.
//
// Cuatro piezas, todas ADITIVAS (no tocan la trama ni la misión):
//   1) ant_voz_helix   -> ambiente: la voz de HELIX en un terminal.
//                         Regla de escritura: nunca "queremos mandar",
//                         siempre "sin nosotros, mañana no llega".
//   2) ant_permiso      -> método "permiso revocado". Solo a quien
//                         fue fichado en la archivista (visto ca_fichado).
//                         Un lector deja de reconocerte, sin orden, sin
//                         nadie a quien reclamar. Se paga lo de "arriba".
//   3) ant_memoria      -> método "memoria alterada". Solo a quien vio
//                         el registro de fecha imposible (ca_verdad_fecha).
//                         Ahora le toca a su propia ficha: un dato cambia
//                         solo, sin firma. Lo que vio hacer, se lo hacen.
//   4) ant_mara_patron  -> guiño de Mara (fase media). Solo a quien vio
//                         el registro de fecha imposible (ca_verdad_fecha).
//                         Reconoce el patrón sin nombrar el C-10: sombra,
//                         no revelación.
//
// Semillas que LEE (ya existentes en el capítulo de la archivista):
//   ca_fichado       -> te ficharon al entrar
//   ca_verdad_fecha  -> tienes la contradicción de fechas
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const S = {

  // ---- 1) LA VOZ DE HELIX (ambiente, una vez) ----
  'ant_voz_helix': {
    entrada: true,
    cond: { noVisto:'ant_voz_helix' },
    img: 'TREN',
    texto: 'En la pared del andén, entre dos anuncios muertos, una pantalla de HELIX se enciende sola al pasar tú. No vende nada. '
         + 'Solo informa, con esa voz plana que no pide permiso:<br><br>'
         + '<span style="color:var(--magenta)">«HELIX mantiene su bloque operativo. Agua, luz, tránsito y soporte médico, sin interrupción, '
         + 'un día más. Seguimos aquí para que mañana también lo esté.»</span><br><br>'
         + 'Debajo, en letra pequeña, un aviso de mantenimiento programado y un número de expediente. Nadie a tu alrededor levanta la vista. '
         + 'Han crecido oyendo esto. Es como la lluvia: está, y ya está.',
    opciones: [
      { texto: 'Seguir sin mirar, como todos.',
        resultado: 'Sigues andando. La pantalla se apaga a tu espalda en cuanto la dejas atrás, ahorrando lo que gasta. HELIX no te amenaza '
                 + 'ni te pide nada. Solo se asegura de que recuerdes, sin decirlo, que todo lo que usas para seguir vivo lleva su nombre por debajo.' },
      { texto: 'Leer el expediente pequeño.',
        efectos:{ humano:{ disociacion:+1 } },
        resultado: 'Lees el número, la fecha, el sello. No dice nada que puedas usar y a la vez lo dice todo: hay una oficina, en algún sitio, '
                 + 'que ha decidido que tu bloque siga respirando hoy. Y que podría decidir lo contrario sin que nadie firmara nada. Apartas la '
                 + 'vista, incómodo, y sigues.' }
    ]
  },

  // ---- 2) MÉTODO: PERMISO REVOCADO (solo si te ficharon) ----
  'ant_permiso': {
    entrada: true,
    cond: { visto:'ca_fichado', noVisto:'ant_permiso' },
    img: 'TREN',
    texto: 'Vas a subir por el tren vertical como cualquier otro día. Pasas la credencial por el lector y no ocurre nada. La pasas otra vez. '
         + 'El lector parpadea en ámbar y muestra un mensaje sin firma:<br><br>'
         + '<span style="color:var(--magenta)">«Acceso no reconocido. Consulte su situación administrativa. Expediente en revisión.»</span><br><br>'
         + 'No hay guardia, no hay orden, no hay nadie a quien reclamar. Solo una puerta que ayer se abría y hoy no. Recuerdas la clínica de '
         + 'arriba, la seguridad de HELIX, tu cara guardada en algún sistema cuando te ficharon. No te han detenido. Te han apagado un permiso, '
         + 'despacio, como quien baja un interruptor.',
    opciones: [
      { texto: 'Buscar otra ruta, más abajo y más sucia.',
        efectos:{ humano:{ fatiga:+3, aislamiento:+2 } },
        resultado: 'Das media vuelta y bajas a buscar un paso que no pida credencial: más escaleras, más lluvia, más tiempo. Llegas igual, solo '
                 + 'que cansado y por la puerta de atrás. Así muerde HELIX cuando decide que existes de más: no te pega, te vuelve el día un '
                 + 'poco más largo, cada día, hasta que aprendes a no llamar la atención.' },
      { texto: 'Probar en otro lector, a ver si es cosa de este.',
        efectos:{ humano:{ disociacion:+3 } },
        resultado: 'Pruebas en el siguiente andén, y en el otro. El mismo ámbar, el mismo mensaje educado. No es el lector: eres tú. En algún '
                 + 'expediente que no puedes leer, alguien —o nada, solo un protocolo— ha marcado tu nombre. Lo peor no es la puerta cerrada. '
                 + 'Es no tener a nadie a quien gritarle.' }
    ]
  },

  // ---- 3) MÉTODO: MEMORIA ALTERADA (solo si viste la fecha imposible) ----
  'ant_memoria': {
    entrada: true,
    cond: { visto:'ca_verdad_fecha', noVisto:'ant_memoria' },
    img: 'APT',
    texto: 'Revisas tu ficha en el terminal por una tontería —la fecha de un contrato, nada— y hay algo que no está como lo dejaste. Tu '
         + 'registro de residencia figura ahora en otra categoría: «ocupación temporal, pendiente de revisión». Antes ponía otra cosa. Estás '
         + 'seguro. Casi seguro.<br><br>'
         + '<span style="color:var(--magenta)">«Última modificación: sistema. Sin operador asignado.»</span><br><br>'
         + 'Ni orden, ni firma, ni nombre. Un dato tuyo que ha cambiado de sitio mientras dormías, igual que el registro de Coll que '
         + 'destapaste: demasiado limpio, imposible de discutir. Solo que esta vez el registro que han tocado eres tú, y con él la duda peor de '
         + 'todas: la de no saber ya qué recordabas bien y qué te están haciendo recordar mal.',
    opciones: [
      { texto: 'Pedir que corrijan la ficha a como la recuerdas.',
        efectos:{ creditos:-30, humano:{ fatiga:+2 } },
        resultado: 'Pides la corrección, pagas la tasa de trámite y rellenas formularios que se tragan tu tarde. A los tres días vuelve a estar '
                 + 'como estaba… o como ellos quieren. No hay forma de saberlo: tu única prueba de cómo era es tu memoria, y tu memoria contra un '
                 + 'registro de HELIX no vale nada. Así se borra a alguien: no de golpe, sino corrigiéndolo poco a poco hasta que deja de '
                 + 'reconocerse.' },
      { texto: 'Dejarlo. ¿Quién te va a creer?',
        efectos:{ humano:{ disociacion:+4, aislamiento:+2 } },
        resultado: 'Cierras el terminal. Discutir con un sistema que no tiene cara ni oreja es gastar saliva. Pero se te queda dentro una '
                 + 'astilla: si pueden cambiar dónde vives sin decírtelo, pueden cambiar cualquier cosa. Empiezas a dudar de tus propios '
                 + 'recuerdos, y esa es justo la clase de silencio en la que HELIX prefiere que vivas.' }
    ]
  },

  // ---- 4) GUIÑO DE MARA: reconoce el patrón (solo si viste la fecha) ----
  'ant_mara_patron': {
    entrada: true,
    cond: { visto:'ca_verdad_fecha', noVisto:'ant_mara_patron' },
    img: 'APT',
    texto: 'Un mensaje de Mara, tarde. No es un encargo. Es de los que te manda cuando algo le ronda y no se lo quita.<br><br>'
         + '<span style="color:var(--magenta)">«Esa fecha que no cuadraba, la del registro de Coll. Le he dado vueltas. Eso no lo toca la '
         + 'seguridad de aquí. Ni el barrio, ni Midbelt. Un registro no cambia de fecha él solo, y nadie de abajo tiene la mano para hacerlo '
         + 'sin que se note.»</span><br><br>'
         + 'Se queda un momento en silencio —lo notas hasta por el terminal— y luego escribe menos de lo que piensa, como siempre:<br><br>'
         + '<span style="color:var(--magenta)">«Hay cosas que se deciden mucho más arriba de donde tú y yo llegamos. No te digo que lo dejes. '
         + 'Te digo que a partir de aquí tengas cuidado con quién crees que te está cerrando las puertas.»</span>',
    opciones: [
      { texto: 'Preguntarle quién, entonces.',
        efectos:{ reputacion:+1 },
        resultado: 'Le preguntas quién mueve esos hilos. Tarda en contestar, y cuando lo hace no te da un nombre: «Si tuviera un nombre, sería '
                 + 'más fácil. No lo tiene. Es un sitio donde se firman cosas que luego pasan solas.» No insistes. Mara acaba de reconocer, en '
                 + 'voz baja, una puerta que llevaba años intentando no mirar. Y te ha dejado mirarla a ti también.' },
      { texto: 'Guardar el aviso y no remover más por ahora.',
        efectos:{ humano:{ disociacion:+2 } },
        resultado: 'No preguntas más. Guardas lo que ha dicho como se guarda una llave que todavía no sabes qué abre. Mara no suele avisar dos '
                 + 'veces. Que lo haya hecho significa que lo que rozaste en aquel registro es más grande de lo que parecía, y que ella lo sabe '
                 + 'desde antes que tú.' }
    ]
  }

  };

  Object.keys(S).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = S[id]; });

})();
