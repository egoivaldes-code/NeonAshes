// ============================================================
// BLOQUE JS-23 — PANTALLA DE IDENTIDAD (nombre del jugador)
// Inputs de nombre y apellido, contador de antiguos residentes,
//   y botones de "continuar partida" o "empezar de nuevo".
// ============================================================

function prepararPantallaIdentidad(){
  // Lo primero: refrescamos el contador silencioso de anteriores.
  // Funciona aunque no haya partida previa.
  actualizarContadorAnteriores();
  const datos = cargarPartida();
  const banner = document.getElementById('retorno-banner');
  const pregunta = document.getElementById('nombre-pregunta-txt');
  const sub = document.getElementById('nombre-sub-txt');
  const inputNombre = document.getElementById('input-nombre');
  const inputApellido = document.getElementById('input-apellido1');

  if(!datos || !datos.jugador || !datos.jugador.nombre){
    // No hay partida previa: estado limpio.
    banner.style.display = 'none';
    pregunta.textContent = '¿Quién eres?';
    sub.textContent = 'IDENTIFÍCATE';
    if(inputNombre) inputNombre.value = '';
    if(inputApellido) inputApellido.value = '';
    return;
  }

  // Hay partida previa. Cambiamos el tono de la pantalla.
  const nombre = datos.jugador.nombre;
  const apellido = datos.jugador.apellido1 || '';
  const completadas = datos.partidasCompletadas || 0;

  // Construir mensaje del banner según cuántas veces ha vuelto.
  let textoBanner;
  if(completadas === 0){
    textoBanner = `Te reconocemos.<br><span class="nombre-prev">${nombre.toUpperCase()} ${apellido.toUpperCase()}</span><br>No llegaste al final la última vez.`;
  } else if(completadas === 1){
    textoBanner = `Otra noche.<br><span class="nombre-prev">${nombre.toUpperCase()} ${apellido.toUpperCase()}</span><br>El mundo aún recuerda lo que hiciste.`;
  } else {
    textoBanner = `Has vuelto otra vez.<br><span class="nombre-prev">${nombre.toUpperCase()} ${apellido.toUpperCase()}</span><br>Las Pilas siguen donde las dejaste.`;
  }

  document.getElementById('retorno-texto').innerHTML = textoBanner;
  banner.style.display = '';

  // La pregunta principal se atenúa: ya sabemos quién es.
  pregunta.textContent = 'Bienvenido otra vez.';
  sub.textContent = 'O EMPIEZA DE NUEVO';

  // Pre-rellenamos los inputs por si elige no continuar pero sí mantener nombre.
  if(inputNombre) inputNombre.value = nombre;
  if(inputApellido) inputApellido.value = apellido;
}

// Refresca el contador silencioso de "personas anteriores en esta
// unidad" en la pantalla de identidad. Solo se llena si hay muertos
// en el archivo del mundo. Es un detalle pequeño, no un titular.
function actualizarContadorAnteriores(){
  const el = document.getElementById('contador-anteriores');
  if(!el) return;
  const archivo = cargarArchivoMundo();
  const n = archivo.muertos.length;
  if(n === 0){
    el.textContent = '';
    return;
  }
  if(n === 1){
    el.textContent = 'Personas anteriores en esta unidad: 1';
  } else {
    el.textContent = `Personas anteriores en esta unidad: ${n}`;
  }
}

// Continuar partida previa: carga los datos y entra directo al apartamento.
function continuarPartida(){
  const datos = cargarPartida();
  if(!datos){ return; }
  aplicarPartidaCargada(datos);
  // Si la misión estaba en una fase intermedia, mostramos
  // un aviso al jugador para que sepa dónde retomar.
  // Por simplicidad: lo dejamos en el apartamento y el mensaje
  // pendiente (si lo hay) le esperará en el terminal.
  inicializarTiempoJuego();
  cambiarEscena('nombre-escena','apartamento');
  setTimeout(()=>{
    iniciarApartamento();
    mostrarHUD(true);
    actualizarHUD();
    iniciarRelojDiegético();
    iniciarDecaimientoPasivo();
    iniciarCobrosPeriódicos();
    // Si había un mensaje pendiente de la misión, marcamos el botón
    // del terminal como destacado para que el jugador lo note al volver.
    if(Estado.terminalPendientes && Estado.terminalPendientes.length > 0){
      marcarNoticiasActualizadas(); // reutilizamos el badge visual del hub
    }
  }, 800);
}

// Empezar de nuevo: borra todo y limpia la pantalla.
function empezarDeNuevo(){
  borrarPartida();
  // Limpiar el estado en memoria también
  Estado.jugador = { nombre:'', apellido1:'' };
  Estado.memoria = {
    aceptoEncargo: null, pidioMasInfo: false, guardoSilencio: false,
    vecesPidioInfo: 0, vioFragmentoCero: false, confianzaMara: 0, tonoJugador: null,
    noticiasVistas: true
  };
  Estado.humano = { fatiga: 8, aislamiento: 12, hambre: 5, disociacion: 0 };
  Estado.partidasCompletadas = 0;
  Estado.tiempoJuego = null;
  // Recibos también se borran al empezar de nuevo.
  Estado.recibos = [];
  Estado.ultimoDiaCobrado = null;
  Estado.terminalPendientes = [];
  Estado.helixAmenazaEnviada = false;
  Estado.mision = null;
  // Refrescar la pantalla
  prepararPantallaIdentidad();
}
function confirmarNombre(){
  const n=document.getElementById('input-nombre').value.trim(),a1=document.getElementById('input-apellido1').value.trim();
  if(!n){document.getElementById('input-nombre').focus();return;}
  Estado.jugador.nombre=n;Estado.jugador.apellido1=a1||'Sin Nombre';
  // FASE C: cada vez que un personaje nuevo confirma identidad,
  // avanza el contador del mundo. Las noticias sobre los muertos
  // se apagan tras 2 partidas. La ciudad olvida rápido.
  avanzarContadorMundo();
  // FASE D: si hay herencia pendiente del personaje anterior, se
  // aplica AHORA (créditos y presión). Guardamos la información
  // para que iniciarApartamento muestre el texto atmosférico.
  // aplicarHerencia devuelve null si no hay nada pendiente.
  Estado.herenciaRecibida = aplicarHerencia();
  // Inicializar el tiempo del universo del juego. Si era una partida cargada,
  // continúa desde donde estaba; si es nueva, empieza el 25 DIC 2247 03:14.
  inicializarTiempoJuego();
  guardarPartida();
  cambiarEscena('nombre-escena','apartamento');
  setTimeout(()=>{ iniciarApartamento(); mostrarHUD(true); actualizarHUD(); iniciarRelojDiegético(); iniciarDecaimientoPasivo(); iniciarCobrosPeriódicos(); },800);
}

// ============================================================