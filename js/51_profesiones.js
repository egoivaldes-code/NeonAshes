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
      { nombre: 'Rastreador',       pagaMin: 0,  umbral: 100 },
      { nombre: 'Carroñero',        pagaMin: 0,  umbral: 160 },
      { nombre: 'Buzo de Chatarra', pagaMin: 0,  umbral: 240 },
      { nombre: 'Desguazador',      pagaMin: 0,  umbral: 340 },
      { nombre: 'Recuperador',      pagaMin: 0,  umbral: 460 },
      { nombre: 'Arqueotécnico',    pagaMin: 0,  umbral: 0   } // último: no asciende
    ],
    acciones: [
      {
        id: 'buscar',
        nombre: 'Salir a buscar chatarra',
        minutos: 120,
        pagaBase: [40, 110],
        progreso: 35,
        nota: 'Horas entre escombros mojados. Vuelves con las manos negras y los bolsillos algo menos vacíos.'
      },
      {
        id: 'procesar',
        nombre: 'Procesar chatarra',
        minutos: 60,
        pagaBase: [30, 45],
        progreso: 15,
        nota: 'Desmontar, clasificar, separar lo que vale de lo que no. Trabajo lento, pago seguro.'
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

// El jugador EJERCE una acción de una profesión. Esta es la función
// central: consume tiempo de juego, paga créditos según rango, suma
// progreso y, si llega al umbral, asciende de rango.
// Devuelve un objeto con el resultado para que el panel lo muestre.
function ejercerProfesion(idProf, idAccion){
  const prof = profesionPorId(idProf);
  if(!prof) return null;
  const est = estadoProfesion(idProf);
  if(!est || !est.activa) return null;
  const accion = (prof.acciones || []).find(a => a.id === idAccion);
  if(!accion) return null;

  // Si el jugador está muerto, no se trabaja.
  if(Estado.muerto) return null;

  // 1) Tiempo de juego. Esto puede cruzar la medianoche y disparar el
  //    cobro de alquiler, igual que cualquier salto de escena.
  if(typeof avanzarTiempoJuego === 'function') avanzarTiempoJuego(accion.minutos);
  if(typeof comprobarCobrosDiarios === 'function') comprobarCobrosDiarios();

  // 2) Paga: base aleatoria dentro del rango de la acción × multiplicador
  //    de rango. Redondeada a entero.
  const [lo, hi] = accion.pagaBase;
  const base = lo + Math.floor(Math.random() * (hi - lo + 1));
  const mult = _multiplicadorRango(est.rango || 0);
  const paga = Math.round(base * mult);
  if(typeof ajustarCreditos === 'function') ajustarCreditos(paga);

  // 3) Progreso hacia el ascenso.
  est.progreso = (est.progreso || 0) + (accion.progreso || 0);

  // 4) ¿Asciende? El último rango no tiene ascenso (umbral 0).
  let ascendio = false;
  let rangoNuevo = null;
  const rangoActual = prof.rangos[est.rango || 0];
  if(rangoActual && rangoActual.umbral > 0 && est.progreso >= rangoActual.umbral){
    if((est.rango || 0) < prof.rangos.length - 1){
      est.rango = (est.rango || 0) + 1;
      est.progreso = est.progreso - rangoActual.umbral; // arrastra el sobrante
      ascendio = true;
      rangoNuevo = prof.rangos[est.rango].nombre;
    }
  }

  // 5) Marcar actividad (día de hoy) para el sistema de despidos futuro.
  est.ultimoDiaISO = (typeof diaJuegoActual === 'function') ? diaJuegoActual() : est.ultimoDiaISO;

  if(typeof guardarPartida === 'function') guardarPartida();

  // Aviso en el HUD de lo cobrado.
  if(typeof notificarCambio === 'function') notificarCambio(`+${paga} CR · ${prof.nombre.toUpperCase()}`, 'creditos');

  return {
    paga: paga,
    nota: accion.nota || '',
    ascendio: ascendio,
    rangoNuevo: rangoNuevo
  };
}
