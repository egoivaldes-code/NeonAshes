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
        // Refinar consume materia prima: 5 unidades de chatarra por tanda.
        // El panel muestra el requisito y bloquea la acción si no se llega.
        costeChatarra: 5,
        nota: 'Desmontar, clasificar, separar lo que vale de lo que no. Requiere 5 de chatarra. Trabajo lento, pago seguro.'
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
    ultimoDiaISO: (typeof diaJuegoActual === 'function') ? diaJuegoActual() : null
  };
  if(typeof guardarPartida === 'function') guardarPartida();
  return true;
}

// Multiplicador de paga por rango. Suave: cada rango cobra un poco más.
// Rango 0 → x1.0, y sube +0.35 por peldaño. Arqueotécnico (rango 5) → x2.75.
function _multiplicadorRango(idxRango){
  return 1 + (idxRango * 0.35);
}

// Cooldown entre acciones de trabajar: 8 horas de juego.
const COOLDOWN_TRABAJO_MS = 8 * 60 * 60 * 1000;

// Hora de juego actual en milisegundos (o null si no hay reloj).
function _ahoraJuegoMs(){
  if(typeof obtenerFechaJuego === 'function'){
    try { return obtenerFechaJuego().getTime(); } catch(e){ return null; }
  }
  return null;
}

// ¿Puede el jugador trabajar ya en esta profesión, o sigue en cooldown?
// Devuelve { puede:bool, minutosRestantes:int }.
function cooldownProfesion(idProf){
  const est = estadoProfesion(idProf);
  if(!est || !est.ultimoTrabajoMs) return { puede: true, minutosRestantes: 0 };
  const ahora = _ahoraJuegoMs();
  if(ahora === null) return { puede: true, minutosRestantes: 0 };
  const transcurrido = ahora - est.ultimoTrabajoMs;
  if(transcurrido >= COOLDOWN_TRABAJO_MS) return { puede: true, minutosRestantes: 0 };
  const restanteMs = COOLDOWN_TRABAJO_MS - transcurrido;
  return { puede: false, minutosRestantes: Math.ceil(restanteMs / 60000) };
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

  // Cooldown: no se puede trabajar otra vez hasta que pasen 8h de juego.
  const cd = cooldownProfesion(idProf);
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
  if(typeof avanzarTiempoJuego === 'function') avanzarTiempoJuego(accion.minutos);
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
