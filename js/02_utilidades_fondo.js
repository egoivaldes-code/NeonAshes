// ============================================================
// BLOQUE JS-02 — UTILIDADES DE FONDO (setBg, setBgPos)
// Funciones cortas para asignar imágenes de fondo a elementos
//   por su id.
// ============================================================

function setBg(elId, key){const el=document.getElementById(elId);if(el)el.style.backgroundImage=`url('${ASSETS[key]}')`;}
function setBgPos(elId, pos){const el=document.getElementById(elId);if(el)el.style.backgroundPosition=pos;}

// Intro frames: ahora gestionados por 18_escena_intro.js (intro cinemática v0.73.2)

// Game scenes
setBg('bg-carga','BOOT'); setBgPos('bg-carga','center top');
setBg('bg-nombre','PASILLO'); setBgPos('bg-nombre','center');
// Apartamento: en MÓVIL usamos las imágenes verticales nuevas, que traen
// la habitación arriba y una banda negra abajo para apoyar las acciones.
// En PC/tablet seguimos con las apaisadas de siempre. El ciclo día/noche
// cruza las dos capas igual en ambos casos.
var _esMovilApt = (typeof window !== 'undefined' && window.matchMedia)
  ? window.matchMedia('(max-width: 768px)').matches
  : (typeof window !== 'undefined' && window.innerWidth <= 768);
setBg('bg-apt', _esMovilApt ? 'APT_MOVIL' : 'APT'); setBgPos('bg-apt','center top');
setBg('bg-apt-dia', _esMovilApt ? 'APT_DIA_MOVIL' : 'APT_DIA'); setBgPos('bg-apt-dia','center top');
setBg('bg-terminal','APT'); setBgPos('bg-terminal','center');
setBg('bg-transito','TREN'); setBgPos('bg-transito','center');
setBg('bg-mercado','BAR'); setBgPos('bg-mercado','center top');
setBg('bg-final','CERO'); setBgPos('bg-final','center');

// Mara portrait
document.getElementById('mara-img').src = ASSETS.MARA;

// Audio - convertir data URI a Blob URL (Chrome funciona mejor así)

// ============================================================