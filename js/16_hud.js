// ============================================================
// BLOQUE JS-19 — HUD — créditos, inventario y notificaciones
// Actualización de los números de la barra (CR), apertura del
//   inventario, recibos domiciliados y avisos flotantes.
// ============================================================

// ============================================================
// SISTEMA DE JUGADOR: créditos, inventario, reputación
// ============================================================
Estado.creditos = LAUNCHER.CREDITOS_INICIALES;
Estado.reputacion = 0;
Estado.inventario = [];

function actualizarHUD(){
  const cr = document.getElementById('hud-cr');
  if(cr) cr.textContent = Estado.creditos;
  // Badge de novedad en el botón ESTADO de la barra permanente.
  if(typeof actualizarBadgesTerminal === 'function') actualizarBadgesTerminal();
  // Barra permanente nueva
  const permCr = document.getElementById('perm-cr');
  if(permCr) permCr.textContent = Estado.creditos;
  const invCr = document.getElementById('inv-cr');
  if(invCr) invCr.textContent = Estado.creditos + ' CR';
  // La reputación (ahora "Moralidad") se muestra en la ventana de
  // reputaciones/facciones, ya no en el inventario (v0.89).
  const lista = document.getElementById('inv-lista');
  if(lista){
    if(Estado.inventario.length === 0){
      lista.innerHTML = '<li class="inv-vacio">SIN OBJETOS</li>';
    } else {
      lista.innerHTML = Estado.inventario.map(it => {
        // Compatibilidad: items antiguos eran texto suelto; los nuevos
        // son objetos { nombre, desc, cantidad }. Mostramos ambos bien.
        if(typeof it === 'string'){
          return `<li class="inv-item">${it}</li>`;
        }
        const cant = (it.cantidad && it.cantidad > 1)
          ? `<span class="inv-item-cant">x${it.cantidad}</span>` : '';
        return `<li class="inv-item">
          <div class="inv-item-nombre">${it.nombre || 'Objeto'}${cant}</div>
          ${it.desc ? `<div class="inv-item-desc">${it.desc}</div>` : ''}
        </li>`;
      }).join('');
    }
  }
}

function mostrarHUD(visible){
  const hud = document.getElementById('hud-estado');
  if(visible) hud.classList.add('visible');
  else hud.classList.remove('visible');
  // Barra permanente nueva (siempre visible una vez activada)
  const perm = document.getElementById('barra-permanente');
  if(perm){
    if(visible) perm.classList.add('visible');
    else perm.classList.remove('visible');
  }
  // Marcar body para que el CSS oculte la barra-controles vieja
  // y el audio-mini cuando la barra permanente está activa.
  if(visible) document.body.classList.add('barra-permanente-activa');
  else document.body.classList.remove('barra-permanente-activa');
  // Audio mini: aparece cuando la barra permanente NO está,
  // y se oculta cuando sí está. Así siempre hay un control de
  // audio accesible.
  const audioMini = document.getElementById('audio-mini');
  if(audioMini){
    audioMini.style.display = visible ? 'none' : '';
  }
}

function abrirInventario(){
  actualizarHUD();
  renderRecibos(); // refrescar la lista cada vez que se abre
  // El enlace al extracto del banco solo tiene sentido en el apartamento,
  // que es donde está el terminal HELIX. Fuera, solo se ve el resumen.
  const pieBanco = document.getElementById('inv-recibos-pie');
  if(pieBanco){
    const apt = document.getElementById('apartamento');
    const enApartamento = apt && apt.classList.contains('activa');
    pieBanco.style.display = enApartamento ? '' : 'none';
  }
  document.getElementById('modal-inv').classList.add('visible');
  document.body.classList.add('panel-abierto');
  // Consultar el inventario también pausa el reloj del juego.
  pausarTiempoJuego();
}
function cerrarInventario(){
  document.getElementById('modal-inv').classList.remove('visible');
  document.body.classList.remove('panel-abierto');
  reanudarTiempoJuego();
}

// Puente desde la pestaña RECIBOS del inventario al extracto detallado
// del terminal (HELIX BANK). Cierra el inventario, entra al terminal y
// abre directamente el módulo banco, saltándose el escritorio.
function irAExtractoBanco(){
  // Salvaguarda: solo accesible desde el apartamento (donde está el terminal).
  const apt = document.getElementById('apartamento');
  if(!(apt && apt.classList.contains('activa'))) return;
  cerrarInventario();
  if(typeof irATerminal === 'function'){
    irATerminal();
    setTimeout(() => {
      if(typeof abrirTerminalBanco === 'function') abrirTerminalBanco();
    }, 350);
  }
}

// Alterna entre las pestañas OBJETOS y RECIBOS dentro del inventario.
function cambiarPestañaInv(tab){
  document.querySelectorAll('.inv-tab').forEach(b => {
    b.classList.toggle('activa', b.dataset.tab === tab);
  });
  document.querySelectorAll('.inv-tab-contenido').forEach(c => {
    c.classList.remove('activa');
  });
  const el = document.getElementById('inv-tab-' + tab);
  if(el) el.classList.add('activa');
}

// Construye la lista visible de recibos. El más reciente primero.
function renderRecibos(){
  const cont = document.getElementById('inv-recibos-lista');
  if(!cont) return;
  const recibos = Estado.recibos || [];
  if(recibos.length === 0){
    cont.innerHTML = '<div class="recibos-vacio">Sin cargos registrados.<br>Aún.</div>';
    return;
  }
  cont.innerHTML = recibos.map(r => {
    const fecha = new Date(r.fecha);
    const d = String(fecha.getDate()).padStart(2,'0');
    const mes = MESES_CORTOS[fecha.getMonth()];
    const a = String(fecha.getFullYear()).slice(-2);
    const fechaTxt = `${d} ${mes} ${a}`;
    const estado = r.pagado ? 'pagado' : 'impagado';
    const signo = r.pagado ? '-' : '!';
    return `
      <div class="recibo-item ${estado}">
        <div class="recibo-fila-top">
          <span class="recibo-concepto">${r.concepto}</span>
          <span class="recibo-importe ${estado}">${signo}${r.importe} CR</span>
        </div>
        <div class="recibo-fila-bot">
          <span class="recibo-fecha">${fechaTxt}</span>
          <span class="recibo-saldo">${r.pagado ? `SALDO: ${r.saldoTras} CR` : 'PENDIENTE'}</span>
        </div>
      </div>`;
  }).join('');
}

function notificarCambio(texto, tipo){
  const n = document.getElementById('hud-rep-cambio');
  n.textContent = texto;
  n.style.color = tipo === 'pos' ? 'var(--verde-terminal)' : (tipo === 'neg' ? 'var(--magenta)' : 'var(--naranja)');
  n.style.borderColor = tipo === 'pos' ? 'rgba(0,255,136,0.4)' : (tipo === 'neg' ? 'rgba(255,0,110,0.4)' : 'rgba(255,107,0,0.4)');
  n.classList.add('visible');
  setTimeout(()=>n.classList.remove('visible'), 3500);
}

function aplicarCambios(c){
  if(c.creditos){
    // Pasamos por ajustarCreditos para que la wallet respete el tope 0
    // y vaya siempre por el mismo camino (sumar suma, restar resta, pero
    // nunca por debajo de 0). Antes se sumaba a mano y podía quedar negativo.
    if(typeof ajustarCreditos === 'function'){
      ajustarCreditos(c.creditos);
    } else {
      Estado.creditos = Math.max(0, (Estado.creditos || 0) + c.creditos);
    }
    notificarCambio((c.creditos > 0 ? '+' : '') + c.creditos + ' CR', c.creditos > 0 ? 'pos' : 'neg');
  }
  if(c.reputacion){
    Estado.reputacion += c.reputacion;
    setTimeout(()=>{
      notificarCambio('REPUTACIÓN ' + (c.reputacion > 0 ? '+' : '') + c.reputacion, c.reputacion > 0 ? 'pos' : 'neg');
    }, c.creditos ? 1000 : 0);
  }
  if(c.item){
    Estado.inventario.push(c.item);
    setTimeout(()=>{
      notificarCambio('+ ' + c.item.toUpperCase(), 'pos');
    }, 2000);
  }
  // Items REALES del catálogo (v0.92). A diferencia de c.item (string de
  // adorno antiguo), estos entran al inventario real por su id y pueden
  // consultarse luego con tieneItem() para ramificar otros eventos.
  if(c.itemId && typeof darItemPorId === 'function'){
    darItemPorId(c.itemId);
    setTimeout(()=>{ notificarCambio('+ OBJETO', 'pos'); }, 2000);
  }
  if(c.quitaItemId && typeof quitarItem === 'function'){
    quitarItem(c.quitaItemId, c.quitaItemCant || 1);
  }
  // Cambios al estado humano (fatiga, aislamiento, hambre, disociacion).
  // No mostramos notificación: el panel ESTADO lo refleja con sus textos.
  if(c.humano){
    Object.keys(c.humano).forEach(k => {
      ajustarHumano(k, c.humano[k]);
    });
  }
  // Cambios a la libreta de memoria (banderas booleanas o contadores).
  // Por ejemplo, vioFragmentoCero pasa a true tras ciertos eventos.
  if(c.memoria){
    Object.keys(c.memoria).forEach(k => {
      recordar(k, c.memoria[k]);
    });
  }
  actualizarHUD();
}


// ============================================================