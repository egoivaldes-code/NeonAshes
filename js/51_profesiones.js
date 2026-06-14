// ============================================================
// BLOQUE JS-51 — PROFESIONES (OFICIOS RECURRENTES)
// ============================================================
// Una profesión es un oficio que el jugador EJERCE para ganarse la
// vida. A diferencia de los encargos (puntuales, de un contacto),
// las profesiones son recurrentes y tienen una escala de rangos.
//
// Modelo de cada profesión (catálogo, datos fijos):
//   id        identificador interno
//   nombre    nombre visible del oficio
//   desc      una línea de sabor, tono noir
//   rangos    escala ordenada de menor a mayor. Cada rango:
//               nombre   título visible (ayudante, peón, oficial...)
//               pagaMin  cobro mínimo base de una jornada en ese rango
//               umbral   progreso necesario para ASCENDER desde este
//                        rango al siguiente. El último rango no asciende.
//   acciones  lista de cosas que puedes hacer al pulsar TRABAJAR:
//               id        identificador interno
//               nombre    texto del botón
//               minutos   tiempo de juego que consume la acción
//               pagaBase  [min,max] créditos base (antes de rango)
//               progreso  cuánto progreso suma hacia el ascenso
//               nota      una línea de sabor al resolver la acción
//
// Estado del jugador en una profesión (vive en Estado.profesiones[id]):
//   activa        true si la ejerce
//   rango         índice del rango actual (0 = primero)
//   progreso      progreso acumulado hacia el siguiente ascenso
//   ultimoDiaISO  YYYY-MM-DD del último día que ejerció (para despidos,
//                 que llegan en una entrega posterior)
//
// La paga real de una acción = paga base aleatoria × multiplicador de
// rango. El multiplicador sube de forma suave con cada rango para que
// ascender se note en el bolsillo sin disparar la economía.
// ============================================================

const PROFESIONES = [
  {
    id: 'scavenger',
    nombre: 'Scavenger',
    desc: 'Vivir de lo que la ciudad tira. Rebuscar entre lo que otros abandonaron y encontrarle un precio.',
    rangos: [
      { nombre: 'Rastreador',       pagaMin: 0,  umbral: 300 },
      { nombre: 'Carroñero',        pagaMin: 0,  umbral: 480 },
      { nombre: 'Buzo de Chatarra', pagaMin: 0,  umbral: 720 },
      { nombre: 'Desguazador',      pagaMin: 0,  umbral: 1020 },
      { nombre: 'Recuperador',      pagaMin: 0,  umbral: 1380 },
      { nombre: 'Arqueotécnico',    pagaMin: 0,  umbral: 0   } // último: no asciende
    ],
    acciones: [
      {
        // Acción "de campo". En vez de resolverse directo, primero pide
        // ELEGIR UN LUGAR (ver 'lugares' abajo). Cada lugar tiene su tabla
        // de desenlaces con probabilidades, paga y posibles costes (fatiga,
        // herida, multa domiciliada).
        id: 'buscar',
        nombre: 'Salir a buscar chatarra',
        minutos: 120,
        progreso: 35,
        cooldownHoras: 2,
        conLugares: true
      },
      {
        // Acción "de taller". Estable y modesta, sin riesgo. El contrapeso
        // seguro frente a salir a la calle.
        id: 'procesar',
        nombre: 'Procesar chatarra',
        minutos: 60,
        pagaBase: [30, 45],
        progreso: 15,
        cooldownHoras: 4,
        // Refinar consume materia prima: 3 unidades de chatarra por tanda
        // (la normal y la "en bruto" de expedición cuentan juntas). Lanza
        // el minijuego de desmontaje; la paga depende de cómo se juegue.
        costeChatarra: 3,
        nota: 'Desmontar pieza a pieza en la mesa de trabajo. Requiere 3 de chatarra. Lo que saques depende de tu pulso.'
      }
    ],
    // Lugares donde rebuscar al elegir "Salir a buscar chatarra".
    // Cada lugar: id, nombre, una línea de sabor, y una tabla 'desenlaces'.
    // Cada desenlace lleva un PESO (probabilidad relativa) y sus efectos:
    //   texto    narración noir del resultado
    //   paga     [min,max] créditos (se multiplican por el rango)  · opcional
    //   progExtra progreso adicional al de la acción                · opcional
    //   fatiga   sube fatiga (malo, acerca a la muerte)             · opcional
    //   herida   id de condición del catálogo (js/39_condiciones)   · opcional
    //   multa    [min,max] cargo domiciliado HELIX, se paga luego   · opcional
    lugares: [
      {
        id: 'conducto',
        nombre: 'Conducto de servicio',
        sabor: 'Estrecho, húmedo, seguro. Poca cosa, pero nadie te molesta ahí abajo.',
        desenlaces: [
          { peso: 50, texto: 'Cable de cobre y un par de células medio vivas. Lo de siempre. Da para comer.', paga: [25, 45] },
          { peso: 25, texto: 'Solo óxido y agua negra. Sales con las manos vacías y el mono empapado.', paga: [0, 8] },
          { peso: 25, texto: 'Detrás de un panel suelto, un módulo de memoria intacto. Pequeño, pero alguien lo querrá.', paga: [55, 80], progExtra: 10 }
        ]
      },
      {
        id: 'contenedor',
        nombre: 'Contenedor HELIX',
        sabor: 'Restos corporativos. Buen material, pero HELIX no tira las cosas sin vigilarlas.',
        desenlaces: [
          { peso: 35, texto: 'Componentes de gama buena, apenas usados. HELIX desperdicia como solo los ricos saben.', paga: [70, 120] },
          { peso: 30, texto: 'Lo justo. Plástico, algún chip genérico. No es un mal día, tampoco bueno.', paga: [30, 55] },
          { peso: 15, texto: 'Llegas tarde. Alguien ya lo vació y dejó el sello roto en el suelo, como una burla.', paga: [0, 10] },
          { peso: 20, texto: 'Rompes un sello con marca y un dron de inventario te lee el chip antes de que puedas correr. La multa llegará domiciliada. Siempre llega.', paga: [40, 70], multa: [60, 110] }
        ]
      },
      {
        id: 'vehiculo',
        nombre: 'Vehículo abandonado',
        sabor: 'Lotería. La mayoría están secos. Uno entre muchos guarda algo que cambia la semana.',
        desenlaces: [
          { peso: 12, texto: 'Bajo el asiento, una caja sellada: óptica militar de contrabando. Hoy comes caliente una temporada.', paga: [140, 220], progExtra: 15 },
          { peso: 33, texto: 'Chatarra de carrocería y un reproductor muerto. Algo es algo.', paga: [20, 45] },
          { peso: 30, texto: 'Vacío. Hasta los asientos se los llevaron. Pierdes el rato.', paga: [0, 12] },
          { peso: 25, texto: 'Un borde de metal cede bajo tu peso y te abre el antebrazo. Sales con algo de cobre y un corte que escuece.', paga: [25, 50], herida: 'herida_brazo_d_leve', fatiga: 6 }
        ]
      },
      {
        id: 'pozo',
        nombre: 'Pozo de inundación',
        sabor: 'Lo peor de las capas bajas. El mejor botín y el peor final, según el día.',
        desenlaces: [
          { peso: 22, texto: 'Entre el agua tóxica, un servidor hundido lleno de placas intactas. Vale una fortuna y casi te cuesta los pulmones.', paga: [160, 260], progExtra: 25 },
          { peso: 33, texto: 'Barro, metal podrido y nada que valga el viaje. Vuelves apestando a químico.', paga: [0, 20], fatiga: 8 },
          { peso: 25, texto: 'Sacas un buen lote del fondo, pero el esfuerzo te deja molido. La espalda lo recordará mañana.', paga: [60, 100], fatiga: 14 },
          { peso: 20, texto: 'Una estructura cede y caes mal entre los hierros. Subes como puedes, cojeando, con las manos vacías.', paga: [0, 5], herida: 'pierna_herida_grave', fatiga: 18 }
        ]
      }
    ]
  },
  {
    // ── INVESTIGADOR PRIVADO (v0.95) ──────────────────────────
    // Profesión narrativa: trabaja por CASOS, no por tiradas. La acción
    // "Revisar casos" abre un panel propio (js/62_investigador.js) con un
    // pool de casos de distinta peligrosidad y contratante. Cada caso es
    // un flujo de escenas con entrevistas y una deducción final.
    id: 'investigador',
    nombre: 'Investigador Privado',
    desc: 'Todo deja un rastro. Mueren millones cada día, pero solo quien paga obtiene una respuesta. Tú eres esa respuesta.',
    rangos: [
      { nombre: 'Fisgón',        pagaMin: 0, umbral: 280 },
      { nombre: 'Sabueso',       pagaMin: 0, umbral: 460 },
      { nombre: 'Investigador',  pagaMin: 0, umbral: 700 },
      { nombre: 'Ojo Privado',   pagaMin: 0, umbral: 1000 },
      { nombre: 'Analista Forense', pagaMin: 0, umbral: 1360 },
      { nombre: 'Detective de HELIX', pagaMin: 0, umbral: 0 } // último: no asciende
    ],
    acciones: [
      {
        // Acción especial: no se resuelve con el motor estándar. Abre el
        // panel de casos (como 'procesar' abre el refinado).
        id: 'casos',
        nombre: 'Revisar casos disponibles',
        minutos: 0,           // el tiempo lo consume cada caso al trabajarlo
        progreso: 0,
        cooldownHoras: 0,
        conCasos: true,
        nota: 'Repasar el tablón de encargos. Aceptar un caso y empezar a tirar del hilo.'
      }
    ]
  },
  {
    // ── CAZARRECOMPENSAS (v0.101) ─────────────────────────────
    // Profesión narrativa ligera: trabaja por CONTRATOS de captura.
    // La acción "Revisar encargos" abre un panel propio
    // (js/63_cazarrecompensas.js) con un tablón de objetivos. Cada
    // contrato tiene dos fases: ABORDAJE (tirada según la vía elegida)
    // y DECISIÓN MORAL (entregar vivo / pactar / soltar).
    id: 'cazarrecompensas',
    nombre: 'Cazarrecompensas',
    desc: 'Alguien pone precio a una cabeza y tú decides si la cobras. Trabajas para quien paga: el Loto, el Ferro, HELIX. Lo difícil no es atrapar al objetivo. Es mirarlo a la cara y elegir qué haces con él.',
    rangos: [
      { nombre: 'Chivato',               pagaMin: 0, umbral: 300 },
      { nombre: 'Rastreador de Fianzas', pagaMin: 0, umbral: 500 },
      { nombre: 'Cazarrecompensas',      pagaMin: 0, umbral: 760 },
      { nombre: 'Cazador de Cabezas',    pagaMin: 0, umbral: 1080 },
      { nombre: 'Segador',               pagaMin: 0, umbral: 1460 },
      { nombre: 'La Mano de HELIX',      pagaMin: 0, umbral: 0 } // último: no asciende
    ],
    acciones: [
      {
        id: 'contratos',
        nombre: 'Revisar encargos del tablón',
        minutos: 0,
        progreso: 0,
        cooldownHoras: 0,
        conContratos: true,
        nota: 'Repasar el tablón de encargos de captura. Aceptar uno, localizar al objetivo y decidir su suerte.'
      }
    ]
  },
  {
    id: 'hacker',
    nombre: 'Hacker',
    desc: 'No sales de casa. Trabajas conectado a la red clandestina de las Pilas: contratos sin rostro, puertas que alguien necesita abiertas y no pregunta cómo. Forzar credenciales, descifrar mensajes, inyectar exploits y borrar tu propio rastro antes de que HELIX lo encuentre.',
    rangos: [
      { nombre: 'Script Kiddie',       pagaMin: 0, umbral: 300 },
      { nombre: 'Intruso',             pagaMin: 0, umbral: 520 },
      { nombre: 'Analista de Sistemas',pagaMin: 0, umbral: 800 },
      { nombre: 'Fantasma',            pagaMin: 0, umbral: 1120 },
      { nombre: 'Arquitecto de Red',   pagaMin: 0, umbral: 1500 },
      { nombre: 'Eco en la Red',       pagaMin: 0, umbral: 0 } // último: no asciende
    ],
    acciones: [
      {
        id: 'red',
        nombre: 'Conectar a la red clandestina',
        minutos: 0,
        progreso: 0,
        cooldownHoras: 0,
        conRedHacker: true,
        nota: 'Abrir el terminal y repasar los contratos digitales disponibles. Aceptar uno, ejecutar la intrusión y cobrar.'
      }
    ]
  }
];

// Mapa rápido id -> profesión del catálogo.
const _PROFESIONES_POR_ID = {};
PROFESIONES.forEach(p => { _PROFESIONES_POR_ID[p.id] = p; });

function profesionPorId(id){
  return _PROFESIONES_POR_ID[id] || null;
}

// Asegura que existe el contenedor de estado de profesiones.
function _asegurarProfesiones(){
  if(!Estado.profesiones || typeof Estado.profesiones !== 'object'){
    Estado.profesiones = {};
  }
  return Estado.profesiones;
}

// ¿El jugador ejerce esta profesión ahora mismo?
function tieneProfesion(id){
  _asegurarProfesiones();
  const e = Estado.profesiones[id];
  return !!(e && e.activa);
}

// Devuelve el estado del jugador en una profesión (o null si no la tiene).
function estadoProfesion(id){
  _asegurarProfesiones();
  return Estado.profesiones[id] || null;
}

// El jugador ESCOGE una profesión disponible. Queda activa en su rango
// más bajo. Si ya la tenía, no la reinicia (no pasa nada).
function elegirProfesion(id){
  const prof = profesionPorId(id);
  if(!prof) return false;
  const todas = _asegurarProfesiones();
  if(todas[id] && todas[id].activa) return true; // ya la ejerce
  todas[id] = {
    activa: true,
    rango: 0,
    progreso: 0,
    ultimoDiaISO: (typeof diaJuegoActual === 'function') ? diaJuegoActual() : null,
    ultimoTrabajoMs: (typeof obtenerFechaJuego === 'function') ? obtenerFechaJuego().getTime() : null
  };
  if(typeof guardarPartida === 'function') guardarPartida();
  if(typeof reproducirFX === 'function') reproducirFX('profesion', 0.7);
  return true;
}

// Multiplicador de paga por rango. Suave: cada rango cobra un poco más.
// Rango 0 → x1.0, y sube +0.35 por peldaño. Arqueotécnico (rango 5) → x2.75.
function _multiplicadorRango(idxRango){
  return 1 + (idxRango * 0.35);
}

// Cooldown por defecto entre acciones de trabajar, si una acción no
// declara el suyo: 8 horas de juego.
const COOLDOWN_TRABAJO_MS = 8 * 60 * 60 * 1000;

// Hora de juego actual en milisegundos (o null si no hay reloj).
function _ahoraJuegoMs(){
  if(typeof obtenerFechaJuego === 'function'){
    try { return obtenerFechaJuego().getTime(); } catch(e){ return null; }
  }
  return null;
}

// Duración del cooldown de una acción concreta, en ms. Si la acción
// declara cooldownHoras (p.ej. buscar 8, refinar 4) se usa eso; si no,
// el valor por defecto.
function _cooldownMsAccion(prof, idAccion){
  const acc = prof && (prof.acciones || []).find(a => a.id === idAccion);
  if(acc && typeof acc.cooldownHoras === 'number'){
    return acc.cooldownHoras * 60 * 60 * 1000;
  }
  return COOLDOWN_TRABAJO_MS;
}

// ¿Puede el jugador hacer YA esta acción de esta profesión, o sigue en
// cooldown? Ahora el cooldown es POR ACCIÓN: buscar y refinar tienen
// temporizadores independientes. Si no se pasa idAccion, devuelve el
// estado general (compatibilidad: true si ninguna acción está en espera
// según el sello antiguo).
// Devuelve { puede:bool, minutosRestantes:int }.
function cooldownProfesion(idProf, idAccion){
  const est = estadoProfesion(idProf);
  if(!est) return { puede: true, minutosRestantes: 0 };
  const prof = profesionPorId(idProf);
  const ahora = _ahoraJuegoMs();
  if(ahora === null) return { puede: true, minutosRestantes: 0 };

  // Sello por acción (nuevo). Compatibilidad: si una partida vieja solo
  // tiene est.ultimoTrabajoMs, se respeta como sello de cualquier acción
  // hasta que se vuelva a trabajar y se cree el registro por acción.
  const sellos = est.cooldownAcciones || {};

  // Si piden una acción concreta:
  if(idAccion){
    let sello = sellos[idAccion];
    if(sello == null && est.ultimoTrabajoMs) sello = est.ultimoTrabajoMs; // compat
    if(sello == null) return { puede: true, minutosRestantes: 0 };
    const dur = _cooldownMsAccion(prof, idAccion);
    const transcurrido = ahora - sello;
    if(transcurrido >= dur) return { puede: true, minutosRestantes: 0 };
    return { puede: false, minutosRestantes: Math.ceil((dur - transcurrido) / 60000) };
  }

  // Sin acción concreta: el bloque general se considera "puede" si AL MENOS
  // una acción está disponible. (El panel pregunta por acción de todos modos.)
  if(!prof || !Array.isArray(prof.acciones)) return { puede: true, minutosRestantes: 0 };
  let algunaDisponible = false;
  let minRestante = Infinity;
  prof.acciones.forEach(a => {
    let sello = sellos[a.id];
    if(sello == null && est.ultimoTrabajoMs) sello = est.ultimoTrabajoMs;
    if(sello == null){ algunaDisponible = true; return; }
    const dur = _cooldownMsAccion(prof, a.id);
    const transcurrido = ahora - sello;
    if(transcurrido >= dur){ algunaDisponible = true; }
    else { minRestante = Math.min(minRestante, Math.ceil((dur - transcurrido)/60000)); }
  });
  return algunaDisponible
    ? { puede: true, minutosRestantes: 0 }
    : { puede: false, minutosRestantes: (minRestante === Infinity ? 0 : minRestante) };
}

// Elige un desenlace de una tabla según los pesos relativos.
function _elegirDesenlace(desenlaces){
  const total = desenlaces.reduce((s, d) => s + (d.peso || 1), 0);
  let r = Math.random() * total;
  for(const d of desenlaces){
    r -= (d.peso || 1);
    if(r <= 0) return d;
  }
  return desenlaces[desenlaces.length - 1];
}

// Registra una multa domiciliada de HELIX. Si hay saldo, se cobra en el
// acto; si no, queda como recibo impagado y entra en el sistema de
// presión que ya gestiona el alquiler.
function _multaHelix(importe, concepto){
  if(!Array.isArray(Estado.recibos)) Estado.recibos = [];
  const ahora = (typeof obtenerFechaJuego === 'function') ? obtenerFechaJuego() : new Date();
  const saldo = Estado.creditos || 0;
  const puede = saldo >= importe;
  if(puede && typeof ajustarCreditos === 'function') ajustarCreditos(-importe);
  Estado.recibos.unshift({
    fecha: ahora.toISOString(),
    concepto: concepto || 'SANCIÓN HELIX',
    importe: importe,
    pagado: puede,
    saldoTras: Estado.creditos || 0
  });
}

// El jugador EJERCE una acción de una profesión. Función central:
// consume tiempo, resuelve resultado (directo o por lugar), paga,
// aplica costes (fatiga/herida/multa), suma progreso y asciende.
// Para acciones con lugares, idAccion es 'buscar' e idLugar el sitio.
// Devuelve un objeto con el resultado para que el panel lo muestre.
function ejercerProfesion(idProf, idAccion, idLugar){
  const prof = profesionPorId(idProf);
  if(!prof) return null;
  const est = estadoProfesion(idProf);
  if(!est || !est.activa) return null;
  const accion = (prof.acciones || []).find(a => a.id === idAccion);
  if(!accion) return null;
  if(Estado.muerto) return null;

  // Cooldown por acción: buscar y refinar tienen temporizadores propios.
  const cd = cooldownProfesion(idProf, idAccion);
  if(!cd.puede) return { bloqueado: true, minutosRestantes: cd.minutosRestantes };

  // Coste en materiales: si la acción exige chatarra (p.ej. refinar pide
  // 5), comprobar que el jugador tiene suficiente ANTES de gastar tiempo.
  // Si no llega, devolver un bloqueo informativo para que lo muestre el panel.
  if(accion.costeChatarra && accion.costeChatarra > 0){
    const tiene = (typeof contarChatarra === 'function') ? contarChatarra() : 0;
    if(tiene < accion.costeChatarra){
      return { bloqueadoChatarra: true, requiere: accion.costeChatarra, tiene: tiene };
    }
  }

  // 1) Tiempo de juego (puede cruzar medianoche y cobrar alquiler).
  //    El implante Sincronizador Neural reduce el tiempo gastado.
  const _multT1 = (typeof implanteMultTiempoAccion === 'function') ? implanteMultTiempoAccion() : 1;
  if(typeof avanzarTiempoJuego === 'function') avanzarTiempoJuego(Math.round(accion.minutos * _multT1));
  if(typeof comprobarCobrosDiarios === 'function') comprobarCobrosDiarios();

  // 1b) Consumir los materiales que exija la acción (refinar gasta 5 de
  //     chatarra). Ya se comprobó arriba que hay suficiente.
  if(accion.costeChatarra && accion.costeChatarra > 0 && typeof quitarItem === 'function'){
    quitarItem('chatarra', accion.costeChatarra);
  }

  // 2) Resolver el resultado de la acción.
  let pagaRango = [0, 0];   // [min,max] base de paga antes del rango
  let nota = accion.nota || '';
  let progBase = accion.progreso || 0;
  let progExtra = 0;
  let fatiga = 0;
  let herida = null;
  let multa = null;
  let lugarNombre = '';

  if(accion.conLugares){
    // Acción de campo: resolver el desenlace del lugar elegido.
    const lugar = (prof.lugares || []).find(l => l.id === idLugar);
    if(!lugar) return null;
    lugarNombre = lugar.nombre;
    const des = _elegirDesenlace(lugar.desenlaces || []);
    nota = des.texto || '';
    pagaRango = des.paga || [0, 0];
    progExtra = des.progExtra || 0;
    fatiga = des.fatiga || 0;
    herida = des.herida || null;
    multa = des.multa || null;
  } else {
    // Acción simple: paga directa por su rango.
    pagaRango = accion.pagaBase || [0, 0];
  }

  // 3) Paga: base aleatoria × multiplicador de rango.
  const [lo, hi] = pagaRango;
  const base = lo + Math.floor(Math.random() * Math.max(1, (hi - lo + 1)));
  const mult = _multiplicadorRango(est.rango || 0);
  const paga = Math.round(base * mult);
  if(paga > 0 && typeof ajustarCreditos === 'function') ajustarCreditos(paga);

  // 4) Costes en el cuerpo y en la cuenta.
  if(fatiga > 0 && typeof ajustarHumano === 'function') ajustarHumano('fatiga', fatiga);
  let heridaNombre = null;
  if(herida && typeof aplicarCondicion === 'function'){
    const aplicada = aplicarCondicion(herida);
    if(aplicada && typeof CATALOGO_CONDICIONES !== 'undefined' && CATALOGO_CONDICIONES[herida]){
      heridaNombre = CATALOGO_CONDICIONES[herida].nombre;
    }
  }
  let multaImporte = 0;
  if(multa){
    multaImporte = multa[0] + Math.floor(Math.random() * Math.max(1, (multa[1] - multa[0] + 1)));
    _multaHelix(multaImporte, 'SANCIÓN HELIX · ACCESO NO AUTORIZADO');
  }

  // 5) Progreso y ascenso.
  est.progreso = (est.progreso || 0) + progBase + progExtra;
  let ascendio = false;
  let rangoNuevo = null;
  const rangoActual = prof.rangos[est.rango || 0];
  if(rangoActual && rangoActual.umbral > 0 && est.progreso >= rangoActual.umbral){
    if((est.rango || 0) < prof.rangos.length - 1){
      est.rango = (est.rango || 0) + 1;
      est.progreso = est.progreso - rangoActual.umbral;
      ascendio = true;
      rangoNuevo = prof.rangos[est.rango].nombre;
    }
  }

  // 6) Marcar actividad (para el sistema de despidos futuro) y sello de
  //    cooldown (hora de juego en que se trabajó por última vez).
  est.ultimoDiaISO = (typeof diaJuegoActual === 'function') ? diaJuegoActual() : est.ultimoDiaISO;
  est.ultimoTrabajoMs = _ahoraJuegoMs();
  // Sello de cooldown POR ACCIÓN (buscar 8h / refinar 4h independientes).
  if(!est.cooldownAcciones || typeof est.cooldownAcciones !== 'object') est.cooldownAcciones = {};
  est.cooldownAcciones[idAccion] = _ahoraJuegoMs();
  if(typeof guardarPartida === 'function') guardarPartida();

  if(paga > 0 && typeof notificarCambio === 'function'){
    notificarCambio(`+${paga} CR · ${prof.nombre.toUpperCase()}`, 'creditos');
  }

  return {
    paga: paga,
    nota: nota,
    lugar: lugarNombre,
    fatiga: fatiga,
    herida: heridaNombre,
    multa: multaImporte,
    ascendio: ascendio,
    rangoNuevo: rangoNuevo
  };
}

// ── Refinado vía minijuego (enganche del botín) ─────────────────
// La acción "procesar" del Scavenger ya no resuelve sola: lanza el
// minijuego de refinado. Esta función aplica los COSTES y el PROGRESO de
// la profesión (tiempo de juego, cooldown 4h, avance de rango) PERO NO la
// paga: los créditos, la chatarra refinada y los hallazgos los entrega el
// propio minijuego al terminar, según cómo se haya jugado.
// Devuelve { ok:true } si se puede entrar, o un objeto de bloqueo.
function aplicarTrabajoRefinado(idProf, idAccion){
  const prof = PROFESIONES.find(p => p.id === idProf);
  if(!prof) return { bloqueado: true };
  const est = estadoProfesion(idProf);
  if(!est || !est.activa) return { bloqueado: true };
  const accion = (prof.acciones || []).find(a => a.id === idAccion);
  if(!accion) return { bloqueado: true };
  if(Estado.muerto) return { bloqueado: true };

  // Cooldown por acción.
  const cd = cooldownProfesion(idProf, idAccion);
  if(!cd.puede) return { bloqueado: true, minutosRestantes: cd.minutosRestantes };

  // Tiempo de juego (puede cruzar medianoche y cobrar alquiler).
  const _multT2 = (typeof implanteMultTiempoAccion === 'function') ? implanteMultTiempoAccion() : 1;
  if(typeof avanzarTiempoJuego === 'function') avanzarTiempoJuego(Math.round((accion.minutos || 60) * _multT2));
  if(typeof comprobarCobrosDiarios === 'function') comprobarCobrosDiarios();

  // Progreso y ascenso (igual que la acción vieja, sin paga).
  est.progreso = (est.progreso || 0) + (accion.progreso || 0);
  let ascendio = false, rangoNuevo = null;
  const rangoActual = prof.rangos[est.rango || 0];
  if(rangoActual && rangoActual.umbral > 0 && est.progreso >= rangoActual.umbral){
    if((est.rango || 0) < prof.rangos.length - 1){
      est.rango = (est.rango || 0) + 1;
      est.progreso = est.progreso - rangoActual.umbral;
      ascendio = true;
      rangoNuevo = prof.rangos[est.rango].nombre;
    }
  }

  // Actividad + sello de cooldown.
  est.ultimoDiaISO = (typeof diaJuegoActual === 'function') ? diaJuegoActual() : est.ultimoDiaISO;
  est.ultimoTrabajoMs = _ahoraJuegoMs();
  if(!est.cooldownAcciones || typeof est.cooldownAcciones !== 'object') est.cooldownAcciones = {};
  est.cooldownAcciones[idAccion] = _ahoraJuegoMs();
  if(typeof guardarPartida === 'function') guardarPartida();

  if(ascendio && typeof notificarCambio === 'function'){
    notificarCambio(`ASCENSO · ${rangoNuevo}`, 'rango');
  }
  return { ok: true, ascendio: ascendio, rangoNuevo: rangoNuevo };
}
window.aplicarTrabajoRefinado = aplicarTrabajoRefinado;

// ── Recompensa de profesión por CASO (Investigador, v0.95) ──────
// El módulo de casos llama aquí al cerrar un caso: suma progreso (y
// asciende si toca) y paga los créditos. Devuelve si ascendió.
function otorgarRecompensaProfesion(idProf, creditos, progreso){
  const prof = profesionPorId(idProf);
  const est = estadoProfesion(idProf);
  if(!prof || !est || !est.activa) return { ok: false };

  if(creditos && creditos !== 0){
    if(typeof ajustarCreditos === 'function') ajustarCreditos(creditos);
    if(typeof notificarCambio === 'function'){
      notificarCambio(`+${creditos} CR · ${prof.nombre.toUpperCase()}`, 'creditos');
    }
  }

  est.progreso = (est.progreso || 0) + (progreso || 0);
  let ascendio = false, rangoNuevo = null;
  const rangoActual = prof.rangos[est.rango || 0];
  if(rangoActual && rangoActual.umbral > 0 && est.progreso >= rangoActual.umbral){
    if((est.rango || 0) < prof.rangos.length - 1){
      est.rango = (est.rango || 0) + 1;
      est.progreso = est.progreso - rangoActual.umbral;
      ascendio = true;
      rangoNuevo = prof.rangos[est.rango].nombre;
    }
  }

  est.ultimoDiaISO = (typeof diaJuegoActual === 'function') ? diaJuegoActual() : est.ultimoDiaISO;
  est.ultimoTrabajoMs = _ahoraJuegoMs();
  if(typeof guardarPartida === 'function') guardarPartida();

  if(ascendio && typeof notificarCambio === 'function'){
    notificarCambio(`ASCENSO · ${rangoNuevo}`, 'rango');
  }
  return { ok: true, ascendio: ascendio, rangoNuevo: rangoNuevo };
}
window.otorgarRecompensaProfesion = otorgarRecompensaProfesion;
// Rango actual del investigador (para filtrar casos por peligrosidad).
function rangoActualProfesion(idProf){
  const est = estadoProfesion(idProf);
  return est ? (est.rango || 0) : 0;
}
window.rangoActualProfesion = rangoActualProfesion;

// ============================================================
//  DESPIDO POR INACTIVIDAD (v0.106)
//  Ejercer una profesión hace avanzar el tiempo de juego. Ese
//  tiempo corre contra TODAS las profesiones activas: si pasan
//  7 días de juego sin ejercer una que ya tenías, te despiden
//  de ella (rango y progreso a cero, queda inactiva).
//  Así el jugador debe repartirse y no vivir en un solo oficio.
// ============================================================
const DIAS_DESPIDO = 7;
const MS_DESPIDO = DIAS_DESPIDO * 24 * 60 * 60 * 1000; // en ms de JUEGO

// Sella el momento del último "trabajo" de una profesión. Se llama
// al elegirla (para arrancar el contador) y desde el motor al trabajar.
function _sellarActividad(est){
  if(!est) return;
  est.ultimoTrabajoMs = _ahoraJuegoMs();
}

// Recorre las profesiones activas y despide las que lleven >= 7 días
// de juego sin ejercerse. Devuelve un array con los nombres despedidos.
// Idempotente y barato: seguro llamarlo a menudo (al trabajar, al abrir
// el panel de oficios, al pasar tiempo).
function comprobarDespidosProfesion(){
  const todas = _asegurarProfesiones();
  const ahora = _ahoraJuegoMs();
  if(ahora == null) return [];
  const despedidas = [];
  Object.keys(todas).forEach(id => {
    const est = todas[id];
    if(!est || !est.activa) return;
    // Una profesión recién tomada sin sello aún: la sellamos ahora y
    // no la penalizamos (el contador empieza al tomarla).
    if(typeof est.ultimoTrabajoMs !== 'number'){
      est.ultimoTrabajoMs = ahora;
      return;
    }
    // El rango 0 sin progreso no se "pierde" de forma dolorosa, pero
    // igualmente se desactiva por coherencia: dejas de ejercer.
    if(ahora - est.ultimoTrabajoMs >= MS_DESPIDO){
      const prof = profesionPorId(id);
      est.activa = false;
      est.rango = 0;
      est.progreso = 0;
      est.despedida = true; // marca para avisar una sola vez
      despedidas.push(prof ? prof.nombre : id);
    }
  });
  if(despedidas.length){
    if(typeof guardarPartida === 'function') guardarPartida();
    if(typeof notificarCambio === 'function'){
      despedidas.forEach(nom => {
        notificarCambio(`DESPEDIDO · ${nom.toUpperCase()}`, 'rango');
      });
    }
  }
  return despedidas;
}
window.comprobarDespidosProfesion = comprobarDespidosProfesion;

// Días de juego que le quedan a una profesión antes del despido por
// inactividad (entero hacia arriba). null si no aplica. Útil para HUD.
function diasParaDespido(idProf){
  const est = estadoProfesion(idProf);
  if(!est || !est.activa || typeof est.ultimoTrabajoMs !== 'number') return null;
  const ahora = _ahoraJuegoMs();
  if(ahora == null) return null;
  const restanteMs = MS_DESPIDO - (ahora - est.ultimoTrabajoMs);
  if(restanteMs <= 0) return 0;
  return Math.ceil(restanteMs / (24 * 60 * 60 * 1000));
}
window.diasParaDespido = diasParaDespido;
