// ============================================================
// BLOQUE JS-09 — ARCHIVO DEL MUNDO — muertos recordados y herencia
// El mundo recuerda a los jugadores muertos. Hasta 5 muertes
//   se guardan para influir en partidas futuras (Fase C).
// ============================================================

// ============================================================
// ARCHIVO DEL MUNDO — el mundo recuerda a los muertos
// ============================================================
// Fase C del sistema de muertes. Esta memoria SOBREVIVE a los
// personajes. Cuando un personaje muere, queda registrado aquí.
// Los nuevos personajes encuentran rastros: noticias, comentarios
// de NPCs, contadores silenciosos. La ciudad sigue, indiferente.
//
// Solo guardamos los últimos 5 muertos. Suficiente para profundidad,
// sin que la memoria del navegador crezca sin límite.
//
// IMPORTANTE: este storage NUNCA se borra al morir. Solo si el
// jugador lo decide expresamente (botón de depuración).
// ============================================================

const CLAVE_MUNDO = LAUNCHER.CLAVE_MUNDO;
const MAX_MUERTOS_RECORDADOS = LAUNCHER.MAX_MUERTOS_RECORDADOS;

// Carga el archivo del mundo. Si no existe, devuelve estructura vacía.
function cargarArchivoMundo(){
  try {
    const raw = localStorage.getItem(CLAVE_MUNDO);
    if(!raw) return { muertos: [] };
    const datos = JSON.parse(raw);
    if(!datos || !Array.isArray(datos.muertos)) return { muertos: [] };
    return datos;
  } catch(e){
    return { muertos: [] };
  }
}

// Guarda el archivo del mundo en localStorage.
function guardarArchivoMundo(archivo){
  try {
    localStorage.setItem(CLAVE_MUNDO, JSON.stringify(archivo));
  } catch(e){
    console.warn('No se pudo guardar el archivo del mundo:', e);
  }
}

// Añade un personaje muerto al archivo. Si superamos el límite,
// los más antiguos caen. Esto reproduce el olvido de la ciudad.
function registrarMuerto(causa){
  const archivo = cargarArchivoMundo();
  const m = Estado.memoria || {};
  const h = Estado.humano || {};
  // Solo guardamos lo mínimo (decisión del usuario): nombre, fecha,
  // causa, y un puñado de decisiones clave que pueden afectar a NPCs.
  // FASE D: también guardamos créditos y presión al morir, para que
  // el nuevo personaje los herede parcialmente.
  const muerto = {
    nombre: (Estado.jugador && Estado.jugador.nombre) || 'Anónimo',
    apellido: (Estado.jugador && Estado.jugador.apellido1) || '',
    fechaTimestamp: Date.now(),
    causa: causa, // 'fatiga' | 'aislamiento' | 'hambre' | 'disociacion'
    creditosAlMorir: Estado.creditos || 0,
    hambreAlMorir: Math.round(h.hambre || 0),
    decisiones: {
      aceptoEncargo: m.aceptoEncargo,
      vioFragmentoCero: m.vioFragmentoCero || false,
      hablaronConMara: (m.aceptoEncargo !== null) || (m.pidioMasInfo) || (m.guardoSilencio)
    }
  };
  archivo.muertos.unshift(muerto); // el más reciente, primero
  if(archivo.muertos.length > MAX_MUERTOS_RECORDADOS){
    archivo.muertos = archivo.muertos.slice(0, MAX_MUERTOS_RECORDADOS);
  }
  // partidasDesdeUltimaMuerte se usa para que la noticia caduque
  // tras 2 partidas. Cada vez que un personaje nuevo nace, lo subimos.
  archivo.partidasDesdeUltimaMuerte = 0;
  // FASE D: la herencia queda pendiente de cobrar por el próximo
  // personaje. Se aplica UNA SOLA VEZ. Persiste aunque pasen muchas
  // partidas — pero solo se aplica al siguiente que confirme identidad.
  archivo.herenciaPendiente = true;
  guardarArchivoMundo(archivo);
}

// Cuando un personaje nuevo confirma identidad y entra al juego,
// incrementamos el contador de "partidas desde la última muerte".
// Eso hace que las noticias del muerto se vayan apagando.
function avanzarContadorMundo(){
  const archivo = cargarArchivoMundo();
  if(archivo.muertos.length === 0) return;
  archivo.partidasDesdeUltimaMuerte = (archivo.partidasDesdeUltimaMuerte || 0) + 1;
  guardarArchivoMundo(archivo);
}

// Devuelve el último muerto (el más reciente) o null si no hay.
function ultimoMuerto(){
  const archivo = cargarArchivoMundo();
  return archivo.muertos[0] || null;
}

// ¿Aún se acuerdan de la última muerte? Las noticias y comentarios
// reactivos solo aparecen en las 2 primeras partidas posteriores.
function muerteAunRecordada(){
  const archivo = cargarArchivoMundo();
  if(archivo.muertos.length === 0) return false;
  const partidasPasadas = archivo.partidasDesdeUltimaMuerte || 0;
  return partidasPasadas < 2;
}


// ============================================================

// ============================================================
// BLOQUE JS-10 — HERENCIA ENTRE PARTIDAS
// Lo que un jugador hereda al empezar una partida nueva si hay
//   un muerto reciente (créditos extra, sensación de "no eres el primero").
// ============================================================

// ============================================================
// FASE D: HERENCIA
// ============================================================
// Cuando un personaje nuevo nace tras una muerte, hereda parte
// del anterior. La herencia se aplica UNA SOLA VEZ por muerte.
// Devuelve un objeto con lo aplicado, o null si no había nada.
//
// Stats: limpias (sus valores iniciales normales). No se castiga
// al cuerpo nuevo por algo que no hizo.
// Créditos: 50% de los del muerto, entre 300 y 800.
// Presión: 30% de la del muerto + 10 fijos (gastos HELIX).
// ============================================================
function aplicarHerencia(){
  const archivo = cargarArchivoMundo();
  if(!archivo.herenciaPendiente) return null;
  if(archivo.muertos.length === 0) return null;

  const ultimo = archivo.muertos[0];

  // Créditos: 50% del muerto, mínimo 300, máximo 800.
  const credBase = Math.floor((ultimo.creditosAlMorir || 0) * 0.5);
  const creditosHeredados = Math.max(300, Math.min(800, credBase));
  Estado.creditos = (Estado.creditos || 0) + creditosHeredados;

  // El hambre no se hereda: cada estómago empieza vacío o lleno por su cuenta.
  // Lo que sí se hereda es el agotamiento de cargar con el muerto: papeleo,
  // funerales mínimos, noches sin dormir. Lo añadimos a fatiga.
  const fatigaHeredada = Math.round((ultimo.hambreAlMorir || 0) * 0.2) + 5;
  if(Estado.humano){
    Estado.humano.fatiga = Math.min(100, (Estado.humano.fatiga || 0) + fatigaHeredada);
  }

  // Marcamos la herencia como cobrada. La bandera no se vuelve a poner
  // a true hasta que muera otro personaje.
  archivo.herenciaPendiente = false;
  guardarArchivoMundo(archivo);

  // Saber si el apellido coincide define el texto narrativo de entrada.
  const apellidoNuevo = (Estado.jugador && Estado.jugador.apellido1) || '';
  const mismoApellido = !!apellidoNuevo && !!ultimo.apellido &&
                        apellidoNuevo.toLowerCase() === ultimo.apellido.toLowerCase();

  return {
    nombreAnterior: ultimo.nombre,
    apellidoAnterior: ultimo.apellido,
    creditosHeredados: creditosHeredados,
    fatigaHeredada: fatigaHeredada,
    mismoApellido: mismoApellido,
    causaMuerte: ultimo.causa
  };
}

// Texto atmosférico que se muestra al nuevo personaje en su primer
// apartamento. Enumera lo que se hereda: créditos, peso del anterior
// inquilino (fatiga), y el contexto narrativo de la herencia.
// Mantiene tono noir — los números aparecen casi como "papeleo".
function textoEntradaConHerencia(info){
  if(!info) return null;

  // Construcción del mensaje. Tres bloques:
  //   1. La cabecera narrativa (cambia según apellido coincida o no)
  //   2. El "papeleo" — qué se hereda en concreto
  //   3. Una línea de cierre atmosférico

  let cabecera;
  let cierre;
  if(info.mismoApellido){
    // Apellido coincide → familia directa.
    cabecera = 'El bloque es tuyo ahora.<br>' +
               'La unidad 273-19A queda a tu nombre, como pidió la familia.';
    cierre = info.nombreAnterior
      ? `Lo que dejó <span style="color:var(--cyan)">${info.nombreAnterior}</span> pasa a ti. No es mucho, pero es algo.`
      : 'Lo que dejaron pasa a ti. No es mucho, pero es algo.';
  } else {
    // Apellido no coincide → realquilo / reasignación burocrática.
    cabecera = 'Reasignación de unidad 273-19A.<br>' +
               'La burocracia de HELIX no pregunta por qué.';
    cierre = info.nombreAnterior
      ? `Lo que quedó de <span style="color:var(--cyan)">${info.nombreAnterior}</span> pasa a ti.`
      : 'Lo que quedó del anterior inquilino pasa a ti.';
  }

  // Bloque del papeleo. Construido como un pequeño "albarán" diegético.
  // Cada línea es una herencia concreta.
  const papeleo = [];
  if(info.creditosHeredados && info.creditosHeredados > 0){
    papeleo.push(`<span style="color:var(--cyan)">+${info.creditosHeredados} CR</span> · saldo transferido`);
  }
  if(info.fatigaHeredada && info.fatigaHeredada > 0){
    papeleo.push(`<span style="color:rgba(255,200,200,0.7)">+${info.fatigaHeredada} fatiga</span> · papeleo, funerales, noches sin dormir`);
  }
  if(info.causaMuerte){
    papeleo.push(`<span style="color:rgba(200,216,224,0.5);font-style:italic">causa registrada: ${info.causaMuerte}</span>`);
  }

  // Composición final. El papeleo va en un bloque visualmente
  // diferenciado para que se lea como un recibo, no como narración.
  let html = cabecera + '<br><br>';
  if(papeleo.length > 0){
    html += '<div style="border-left:1px solid rgba(0,229,255,0.3);' +
            'padding-left:0.8rem;margin:0.4rem 0;font-size:0.85em;' +
            'line-height:1.7;">' +
            papeleo.join('<br>') +
            '</div><br>';
  }
  html += cierre;

  // Botón discreto para "asumir" (cerrar) el bloque de herencia.
  // Estética de albarán burocrático: línea separadora arriba, texto
  // pequeño alineado a la derecha, sin border ni fondo. Al pulsar
  // se cierra el bloque y se sustituye por la narrativa estándar.
  html += '<div class="herencia-cierre">' +
          '<button class="btn-herencia-asumir" onclick="cerrarHerencia()">' +
          '─ ASUMIR' +
          '</button>' +
          '</div>';

  return html;
}

// Cierra el bloque de herencia del apartamento. Hace fade-out suave
// del contenido actual y lo sustituye por la narrativa estándar de
// noche normal (lluvia ácida, tres de la mañana, no recuerdas cuándo
// te dormiste). El jugador "asume" la herencia y el apartamento pasa
// a ser suyo. No vuelve a aparecer en esta partida.
function cerrarHerencia(){
  const narr = document.getElementById('narr-apt');
  if(!narr) return;
  // Fade-out suave
  narr.style.transition = 'opacity 0.5s ease';
  narr.style.opacity = '0';
  setTimeout(function(){
    // Sustituir por la narrativa estándar
    narr.innerHTML = 'La lluvia ácida golpea el cristal.<br>' +
                     'Son las tres de la mañana.<br>' +
                     'No recuerdas cuándo te dormiste.';
    // Fade-in
    narr.style.opacity = '1';
  }, 500);
}

// Aplica una partida cargada al Estado actual. NO sobrescribe la
// posición narrativa (eso siempre arranca de cero) — solo lo que
// el mundo "recuerda" del jugador.
function aplicarPartidaCargada(datos){
  if(!datos) return;
  // Si por lo que sea hay una partida guardada de un personaje muerto
  // (no debería, porque borramos al morir), nos aseguramos de limpiar.
  Estado.muerto = false;
  if(datos.jugador) Estado.jugador = { ...Estado.jugador, ...datos.jugador };
  if(datos.memoria) Estado.memoria = { ...Estado.memoria, ...datos.memoria };
  if(datos.humano){
    // El estado humano persiste pero se ATENÚA: dormir alivia algo.
    // La disociación es la única que decae más despacio: una vez algo
    // te ha tocado, no te suelta del todo.
    const hambreGuardada = (typeof datos.humano.hambre === 'number')
      ? datos.humano.hambre
      : 5;
    Estado.humano = {
      fatiga: Math.max(8, Math.floor(datos.humano.fatiga * 0.4)),
      aislamiento: Math.max(12, Math.floor(datos.humano.aislamiento * 0.6)),
      hambre: hambreGuardada,   // el hambre no se atenúa con el sueño; solo se sacia comiendo
      disociacion: Math.floor(datos.humano.disociacion * 0.85)
    };
  }
  Estado.partidasCompletadas = datos.partidasCompletadas || 0;
  Estado.tiempoJuego = datos.tiempoJuego || null;
  // v2: restaurar campos de misión y cobros si están guardados.
  Estado.mision = datos.mision || null;
  Estado.recibos = datos.recibos || [];
  Estado.ultimoDiaCobrado = datos.ultimoDiaCobrado || null;
  Estado.terminalPendientes = datos.terminalPendientes || [];
  Estado.helixAmenazaEnviada = datos.helixAmenazaEnviada || false;
  if(typeof datos.creditos === 'number') Estado.creditos = datos.creditos;
  if(typeof datos.reputacion === 'number') Estado.reputacion = datos.reputacion;
  if(Array.isArray(datos.inventario)) Estado.inventario = datos.inventario;
}


// ============================================================