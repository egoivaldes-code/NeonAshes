// ============================================================
// BLOQUE JS-13 — COBROS DIARIOS — ALQUILER
// Cada día (a medianoche del juego) se cobra el alquiler.
//   Si no hay créditos, hay penalización de fatiga.
// ============================================================

// ============================================================
// COBROS HELIX BANK
// ============================================================
// Cada día a las 00:00 del juego, HELIX Bank ejecuta los cargos
// domiciliados. El primer día es gratis (vives un día "de cortesía"
// antes de la primera medianoche). De ahí en adelante, cobra
// cada vez que pasa medianoche del juego.
//
// Si no hay saldo: queda impagado, sube fatiga +5 (no duermes pensando
// en HELIX). Si acumulas 3 impagados, mensaje amenazante (texto, no mecánica).
// ============================================================

const ALQUILER_DIARIO = LAUNCHER.ALQUILER_DIARIO; // CR/día
const FATIGA_POR_IMPAGADO = LAUNCHER.FATIGA_POR_IMPAGADO;
let _intervaloCobros = null;

// Devuelve la fecha del juego en formato YYYY-MM-DD (sin hora).
function diaJuegoActual(){
  const f = obtenerFechaJuego();
  const y = f.getFullYear();
  const mo = String(f.getMonth() + 1).padStart(2, '0');
  const d = String(f.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

// Comprueba si ha pasado un día desde el último cobro. Si es así,
// ejecuta el cobro del alquiler. Se llama periódicamente y también
// al entrar al apartamento por si el jugador ha estado mucho fuera.
function comprobarCobrosDiarios(){
  if(!Estado.tiempoJuego) return;
  if(Estado.muerto) return;
  const hoy = diaJuegoActual();
  // Primera vez: anclamos el día sin cobrar (día de cortesía).
  if(Estado.ultimoDiaCobrado === null){
    Estado.ultimoDiaCobrado = hoy;
    return;
  }
  // Si hoy es el mismo día que el último cobro, nada que hacer.
  if(hoy === Estado.ultimoDiaCobrado) return;
  // Han pasado uno o más días. Cobramos uno por cada día pasado.
  // Para evitar bucles eternos: máximo 30 cobros de golpe.
  let diasPendientes = diferenciaEnDiasISO(Estado.ultimoDiaCobrado, hoy);
  if(diasPendientes > 30) diasPendientes = 30;
  for(let i = 0; i < diasPendientes; i++){
    cobrarAlquiler();
  }
  Estado.ultimoDiaCobrado = hoy;
}

// Diferencia en días entre dos fechas ISO (YYYY-MM-DD).
function diferenciaEnDiasISO(a, b){
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / (24 * 60 * 60 * 1000));
}

// Ejecuta un cobro del alquiler. Si hay saldo, descuenta y registra
// pagado. Si no, registra impagado y sube fatiga (HELIX te quita el sueño).
// Genera el mensaje para el terminal y la notificación rápida.
function cobrarAlquiler(){
  const ahora = obtenerFechaJuego();
  const fechaIso = ahora.toISOString();
  const saldoActual = Estado.creditos || 0;
  const puedePagar = saldoActual >= ALQUILER_DIARIO;
  let saldoTras, pagado;
  if(puedePagar){
    Estado.creditos = saldoActual - ALQUILER_DIARIO;
    saldoTras = Estado.creditos;
    pagado = true;
  } else {
    saldoTras = saldoActual; // saldo no cambia, queda impagado
    pagado = false;
    ajustarHumano('fatiga', FATIGA_POR_IMPAGADO);
  }
  // Registramos el recibo.
  const recibo = {
    fecha: fechaIso,
    concepto: 'ALQUILER UNIDAD 273-19A',
    importe: ALQUILER_DIARIO,
    pagado: pagado,
    saldoTras: saldoTras
  };
  Estado.recibos.unshift(recibo); // más reciente primero
  // Notificación rápida (cuadrito que ya existe para cambios).
  if(pagado){
    notificarCambio(`−${ALQUILER_DIARIO} CR · HELIX BANK`, 'creditos');
  } else {
    notificarCambio(`IMPAGADO · HELIX BANK`, 'rep');
  }
  // Refrescamos HUD para que los créditos se vean al instante.
  if(typeof actualizarHUD === 'function') actualizarHUD();
  // Mensaje al terminal: queda pendiente hasta que el jugador abra
  // el terminal o lo refresque.
  Estado.terminalPendientes.push({
    tipo: 'cobro',
    pagado: pagado,
    importe: ALQUILER_DIARIO,
    saldoTras: saldoTras,
    fecha: fechaIso
  });
  // Si hay 3 o más impagados acumulados, mensaje amenazante.
  const impagados = Estado.recibos.filter(r => !r.pagado).length;
  if(impagados >= 3 && !Estado.helixAmenazaEnviada){
    Estado.terminalPendientes.push({ tipo: 'amenaza' });
    Estado.helixAmenazaEnviada = true;
  }
  // v0.164 — REGULARIZACIÓN DE UNIDAD (espina "puedes perder la casa").
  // Si la deuda de alquiler se dispara, HELIX reasigna tu unidad. Golpe
  // humano fuerte, la deuda de alquiler queda "saldada" (se quedan la casa),
  // y te reasignan a algo peor. Una sola vez por vida (no es una espiral).
  if(impagados >= 7 && !Estado.regularizacionEjecutada){
    Estado.regularizacionEjecutada = true;
    Estado.recibos.forEach(r => {
      if(!r.pagado && /ALQUILER/.test(r.concepto || '')){ r.pagado = true; r.saldoTras = Estado.creditos || 0; }
    });
    if(Estado.humano){
      Estado.humano.aislamiento = Math.min(100, (Estado.humano.aislamiento || 0) + 15);
      Estado.humano.disociacion = Math.min(100, (Estado.humano.disociacion || 0) + 8);
    }
    Estado.helixAmenazaEnviada = false; // el ciclo puede reiniciarse en la nueva unidad
    if(typeof guardarPartida === 'function') guardarPartida();
    if(typeof actualizarHUD === 'function') actualizarHUD();
    if(typeof mostrarRegularizacion === 'function') mostrarRegularizacion();
  }
}

// v0.164 — Overlay a pantalla completa cuando HELIX regulariza tu unidad.
// Autocontenido y blindado: si algo falla, no rompe el cobro.
function mostrarRegularizacion(){
  try{
    if(document.getElementById('overlay-regularizacion')) return;
    const ov = document.createElement('div');
    ov.id = 'overlay-regularizacion';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#05070b;display:flex;align-items:center;justify-content:center;padding:2rem 1.6rem;opacity:0;transition:opacity 1s ease;';
    ov.innerHTML = `
      <div style="max-width:640px;color:#c3ccd6;font-size:1rem;line-height:1.7;">
        <p style="color:#6fd6d6;font-size:0.8rem;letter-spacing:0.1em;margin:0 0 1rem;">HELIX · AVISO DE REGULARIZACIÓN</p>
        <p style="margin:0 0 1rem;">Un aviso pegado en la puerta, sin firma: «Unidad 273-19A regularizada por impago reiterado.» No hay discusión, ni juicio, ni tiempo para recoger.</p>
        <p style="margin:0 0 1rem;">Te reasignan más abajo: una unidad más húmeda, más pequeña, de las que nadie quiere. Tus deudas de alquiler quedan «saldadas» —se han quedado con tu casa a cambio—. Lo que dejaste dentro ya no es tuyo.</p>
        <div style="text-align:center;margin-top:1.6rem;">
          <button id="btn-regularizacion" class="btn-confirmar" style="padding:0.7rem 1.8rem;">Recoger lo poco que queda</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(()=>{ ov.style.opacity = '1'; });
    ov.querySelector('#btn-regularizacion').addEventListener('click', ()=>{
      ov.style.opacity = '0';
      setTimeout(()=>{ if(ov.parentNode) ov.parentNode.removeChild(ov); }, 800);
    });
  }catch(e){}
}

// Suma o resta créditos al jugador de forma centralizada. Es la única
// puerta para mover dinero: nunca baja de 0 y refresca el HUD al instante.
// Varios sistemas (deriva, eventos del mapa, misiones) ya la buscaban con
// typeof; ahora existe de verdad y todos comparten la misma lógica.
function ajustarCreditos(delta){
  const d = Number(delta) || 0;
  Estado.creditos = Math.max(0, (Estado.creditos || 0) + d);
  if(typeof actualizarHUD === 'function') actualizarHUD();
  return Estado.creditos;
}
window.ajustarCreditos = ajustarCreditos;

function iniciarCobrosPeriódicos(){
  if(_intervaloCobros) return;
  comprobarCobrosDiarios(); // chequeo inmediato al entrar
  // Cada 5 segundos reales (= 5 minutos de juego) revisamos si
  // hemos cruzado medianoche. Es ligero y suficiente.
  _intervaloCobros = setInterval(comprobarCobrosDiarios, 5000);
}

function detenerCobrosPeriódicos(){
  if(_intervaloCobros){
    clearInterval(_intervaloCobros);
    _intervaloCobros = null;
  }
}


// ============================================================