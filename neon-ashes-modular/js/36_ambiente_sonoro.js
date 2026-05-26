// ============================================================
// BLOQUE JS-49 — AMBIENTE SONORO (tormenta + industrial + crowd)
// ============================================================
// Sistema de audio ambiental por escena. Tres pistas en bucle:
//   - STORM:      lluvia / tormenta (exteriores, apartamento de noche)
//   - INDUSTRIAL: zumbido / máquinas (interiores, terminales)
//   - CROWD:      gente / multitud (mercados, bares, calles)
//
// Cada escena tiene un "perfil sonoro" que mezcla las 3 pistas a
// distintos volúmenes. Al cambiar de escena, los volúmenes se
// suavizan con fade para no cortar bruscamente.
//
// Respeta el mute global del juego: si el usuario está en silencio,
// el ambiente también lo está. El volumen base es independiente del
// tema musical y se configura en LAUNCHER.VOLUMEN_AMBIENTE.
// ============================================================

// Volumen base del ambiente. Se configura en el LAUNCHER si quieres
// cambiarlo. 0 = silencio, 1 = máximo.
const VOLUMEN_AMBIENTE_BASE = (typeof LAUNCHER !== 'undefined' && typeof LAUNCHER.VOLUMEN_AMBIENTE === 'number')
  ? LAUNCHER.VOLUMEN_AMBIENTE
  : 0.55;

// === Carga de las 3 pistas como elementos Audio en bucle ===
// Cada una tiene su <audio> propio para poder mezclarlas a la vez.
const _amb = {
  storm:      null,
  industrial: null,
  crowd:      null,
  // Estado actual: el volumen "objetivo" hacia el que se acerca con fade
  objetivo: { storm: 0, industrial: 0, crowd: 0 },
  // El volumen actual real (lo que está sonando ahora)
  actual:   { storm: 0, industrial: 0, crowd: 0 },
  // Si está globalmente activado (lo controla el mute del juego)
  activo: true,
  // Si ya intentamos arrancar las pistas (los navegadores requieren
  // primera interacción del usuario antes de permitir play)
  arrancado: false
};

function crearAudioAmbiente(src, etiqueta){
  if(!src) {
    console.info('[ambiente] pista no configurada:', etiqueta);
    return null;
  }
  const a = new Audio(src);
  a.loop = true;
  a.volume = 0;
  a.preload = 'auto';
  // Algunos navegadores tiran error si llamas play() antes del primer
  // gesto del usuario. Lo capturamos sin ruido.
  a.addEventListener('error', e => {
    console.warn('[ambiente] error cargando', etiqueta, e);
  });
  return a;
}

// Inicialización perezosa: las pistas no se construyen hasta que
// se llaman por primera vez, para no ralentizar la carga inicial.
function _inicializarAmbienteSiHaceFalta(){
  if(_amb.storm) return;  // ya inicializado
  _amb.storm      = crearAudioAmbiente(_AMBIENTE_STORM_DATA, 'storm');
  _amb.industrial = crearAudioAmbiente(_AMBIENTE_INDUSTRIAL_DATA, 'industrial');
  _amb.crowd      = crearAudioAmbiente(_AMBIENTE_CROWD_DATA, 'crowd');
}

// Llamar a esto para empezar a sonar las pistas. Solo funcionará tras
// el primer gesto del usuario (es un requisito de los navegadores).
function arrancarAmbiente(){
  _inicializarAmbienteSiHaceFalta();
  if(_amb.arrancado) return;
  _amb.arrancado = true;
  // Las arrancamos a las tres con volumen 0; el fade les dará vida.
  ['storm','industrial','crowd'].forEach(k => {
    const a = _amb[k];
    if(!a) return;
    a.volume = 0;
    const p = a.play();
    if(p && p.catch) p.catch(()=>{ /* primer-gesto bloqueado, reintenta tras tap */ });
  });
}

// === Perfiles de cada escena ===
// Para cada escena, defines qué cantidad de cada pista quieres
// (0 = silencio total de esa pista, 1 = máximo).
// Las claves coinciden con los IDs de las escenas en el HTML.
const _perfilesAmbiente = {
  // Pantallas dramáticas: silencio
  'intro-escena':       { storm: 0,    industrial: 0,    crowd: 0    },
  'carga':              { storm: 0,    industrial: 0,    crowd: 0    },
  'nombre-escena':      { storm: 0,    industrial: 0,    crowd: 0    },
  'muerte-escena':      { storm: 0,    industrial: 0,    crowd: 0    },
  'final-escena':       { storm: 0.15, industrial: 0,    crowd: 0    },
  'eco-escena':         { storm: 0.4,  industrial: 0.1,  crowd: 0    },

  // Apartamento: tormenta dominante (la lluvia ácida en el cristal),
  // un poquito de zumbido industrial de fondo (la ciudad sigue ahí).
  'apartamento':        { storm: 0.55, industrial: 0.15, crowd: 0    },

  // Terminal: interior cerrado, solo el zumbido de las máquinas.
  'terminal-escena':    { storm: 0,    industrial: 0.35, crowd: 0    },

  // Tránsito a Mara (las cuatro tarjetas): calles + lluvia + gente
  // dispersa, todo a la vez (caótico, en movimiento).
  'transito-escena':    { storm: 0.3,  industrial: 0.25, crowd: 0.4  },

  // Mercado/Bar Noir de Mara: interior con gente y zumbido,
  // lluvia atenuada (oyes el techo).
  'mercado-escena':     { storm: 0.1,  industrial: 0.25, crowd: 0.5  },

  // Misión secundaria — tránsito Nivel 4: industrial alto (corredores).
  'mision-transito-escena':  { storm: 0.15, industrial: 0.5,  crowd: 0.1  },
  'mision-casillero-escena': { storm: 0,    industrial: 0.4,  crowd: 0    },
  'mision-contenido-escena': { storm: 0,    industrial: 0.35, crowd: 0    },
  'mision-entrega-escena':   { storm: 0.1,  industrial: 0.2,  crowd: 0.45 },

  // Mapa abierto: vista panorámica de la ciudad bajo lluvia.
  'mapa-escena':        { storm: 0.45, industrial: 0.2,  crowd: 0.15 },

  // Tránsito libre entre zonas: por las calles, con todo.
  'transito-libre-escena': { storm: 0.4, industrial: 0.25, crowd: 0.3 },

  // Zona de llegada: el perfil por defecto. Se reasigna por zona
  // en aplicarAmbienteZona() según qué zona haya elegido.
  'zona-escena':        { storm: 0.3,  industrial: 0.25, crowd: 0.25 }
};

// Perfiles específicos por ID de zona. Sobreescriben el de 'zona-escena'.
const _perfilesZona = {
  arrabal_carmesi: { storm: 0.2,  industrial: 0.55, crowd: 0.6  },  // caótico, gente chillona, máquinas
  santuario_ix:    { storm: 0.05, industrial: 0.15, crowd: 0    },  // templo silencioso
  nodo_cero:       { storm: 0,    industrial: 0.55, crowd: 0.05 },  // servidores zumbando
  distrito_ferro:  { storm: 0.15, industrial: 0.15, crowd: 0.35 }   // ordenado, gente civil
};

// Aplica el perfil de una zona del mapa (sobreescribe el general).
function aplicarAmbienteZona(idZona){
  const perfil = _perfilesZona[idZona];
  if(perfil) aplicarPerfilAmbiente(perfil);
}

// === Fade suave entre perfiles ===
// Cuando cambias de perfil, los volúmenes se acercan al objetivo a un
// ritmo de ~0.02 por frame (60fps → ~1 segundo de fade completo).
let _intervaloFadeAmbiente = null;

function _stepFadeAmbiente(){
  if(!_amb.arrancado) return;
  let cambio = false;
  ['storm','industrial','crowd'].forEach(k => {
    const objetivo = _amb.activo ? (_amb.objetivo[k] * VOLUMEN_AMBIENTE_BASE) : 0;
    const actual = _amb.actual[k];
    if(Math.abs(actual - objetivo) < 0.005){
      _amb.actual[k] = objetivo;
      if(_amb[k]) _amb[k].volume = objetivo;
    } else {
      // Acercar 8% por step (60fps → ~750ms de fade)
      _amb.actual[k] = actual + (objetivo - actual) * 0.08;
      if(_amb[k]) _amb[k].volume = Math.max(0, Math.min(1, _amb.actual[k]));
      cambio = true;
    }
  });
  // Si todos ya están en su objetivo, paramos el bucle para no
  // gastar CPU sin necesidad.
  if(!cambio && _intervaloFadeAmbiente){
    clearInterval(_intervaloFadeAmbiente);
    _intervaloFadeAmbiente = null;
  }
}

function _asegurarFadeActivo(){
  if(!_intervaloFadeAmbiente){
    _intervaloFadeAmbiente = setInterval(_stepFadeAmbiente, 16);
  }
}

// Aplica un perfil concreto (objeto {storm, industrial, crowd}).
// El fade lo lleva al objetivo en ~1 segundo.
function aplicarPerfilAmbiente(perfil){
  if(!perfil) return;
  _amb.objetivo.storm      = perfil.storm      || 0;
  _amb.objetivo.industrial = perfil.industrial || 0;
  _amb.objetivo.crowd      = perfil.crowd      || 0;
  // Si no se ha arrancado todavía pero hay objetivo > 0, intentamos
  // arrancar (puede fallar si no hubo gesto aún).
  if(!_amb.arrancado && (perfil.storm||perfil.industrial||perfil.crowd) > 0){
    arrancarAmbiente();
  }
  _asegurarFadeActivo();
}

// Aplica el perfil de una escena por su ID.
function aplicarAmbienteEscena(idEscena){
  const p = _perfilesAmbiente[idEscena];
  if(p) aplicarPerfilAmbiente(p);
}

// Para llamar desde el mute global del juego.
function silenciarAmbiente(silencio){
  _amb.activo = !silencio;
  _asegurarFadeActivo();
}

// === Hook al cambio de escena ===
// Envolvemos la función cambiarEscena() para que también actualice
// el ambiente cuando se cambia de pantalla.
if(typeof cambiarEscena === 'function'){
  const _cambiarEscenaOriginal = cambiarEscena;
  cambiarEscena = function(desde, hacia){
    _cambiarEscenaOriginal(desde, hacia);
    // Tras 500ms (cuando termina el fade visual), aplicamos el ambiente.
    setTimeout(()=>{ aplicarAmbienteEscena(hacia); }, 500);
  };
}

// === Hook al mute global ===
// El botón de mute del juego controla tanto el tema como el ambiente.
// La variable global que indica el estado del mute es `temaMuted`
// (definida en el bloque de audio del tema principal).
if(typeof toggleMute === 'function'){
  const _toggleMuteOriginal = toggleMute;
  toggleMute = function(){
    _toggleMuteOriginal();
    // Aprovechamos el gesto del botón mute para arrancar el ambiente
    // si todavía no se ha iniciado (caso: autoplay bloqueado y el usuario
    // activa el audio pulsando el botón en vez de hacer clic en la página).
    if(!_amb.arrancado){
      arrancarAmbiente();
      const activa = document.querySelector('.escena.activa');
      if(activa && activa.id) aplicarAmbienteEscena(activa.id);
    }
    // Damos un instante a que toggleMute actualice temaMuted, y entonces
    // sincronizamos el ambiente con el nuevo estado.
    setTimeout(()=>{
      if(typeof temaMuted !== 'undefined'){
        silenciarAmbiente(temaMuted === true);
      }
    }, 50);
  };
}

// === Arranque al primer tap ===
// Los navegadores no dejan reproducir audio antes del primer gesto.
// Enganchamos listeners al document Y a los botones de interacción
// más habituales para no perdernos el primer gesto del usuario.
(function(){
  function _primerGestoAmbiente(){
    if(_amb.arrancado) return;
    arrancarAmbiente();
    // Aplicar el perfil de la escena activa ahora mismo
    const activa = document.querySelector('.escena.activa');
    if(activa && activa.id){
      aplicarAmbienteEscena(activa.id);
    }
  }
  // Listener genérico en el documento (captura cualquier clic)
  document.addEventListener('click', _primerGestoAmbiente, {once:true});
  document.addEventListener('touchstart', _primerGestoAmbiente, {once:true, passive:true});
  // Backup: si por algún motivo el listener del document no dispara,
  // intentamos arrancar en cada cambio de escena con perfil no nulo.
})();

// === Hook al sistema de zonas ===
// Cuando el jugador llega a una zona concreta, aplicamos su perfil.
if(typeof llegarAZona === 'function'){
  const _llegarAZonaOriginal = llegarAZona;
  llegarAZona = function(){
    _llegarAZonaOriginal();
    // _zonaActual lo establece la función original
    if(typeof _zonaActual !== 'undefined' && _zonaActual && _zonaActual.id){
      setTimeout(()=>{ aplicarAmbienteZona(_zonaActual.id); }, 600);
    }
  };
}

// === RUTAS DE AUDIO AMBIENTAL ===
// Pon aquí los archivos MP3/OGG de cada pista ambiental.
// Si una ruta está vacía (''), esa pista simplemente no suena
// y el juego continúa sin errores.
const _AMBIENTE_STORM_DATA      = 'assets/audio/storm.mp3';
const _AMBIENTE_INDUSTRIAL_DATA = 'assets/audio/industrial.mp3';
const _AMBIENTE_CROWD_DATA      = 'assets/audio/crowd.mp3';
