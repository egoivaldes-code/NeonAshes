// ============================================================
// BLOQUE JS-02 — UTILIDADES DE FONDO (setBg, setBgPos)
// Funciones cortas para asignar imágenes de fondo a elementos
//   por su id.
// ============================================================

function setBg(elId, key){const el=document.getElementById(elId);if(el)el.style.backgroundImage=`url('${ASSETS[key]}')`;}
function setBgPos(elId, pos){const el=document.getElementById(elId);if(el)el.style.backgroundPosition=pos;}

// Intro frames
setBg('bg-1','ESPACIO'); setBgPos('bg-1','center 20%');
setBg('bg-2','BOOT'); setBgPos('bg-2','center 12%');
setBg('bg-3','PASILLO'); setBgPos('bg-3','center');
setBg('bg-4','MERCADO'); setBgPos('bg-4','center 25%');
setBg('bg-5','APT'); setBgPos('bg-5','center top');

// Game scenes
setBg('bg-carga','BOOT'); setBgPos('bg-carga','center top');
setBg('bg-nombre','PASILLO'); setBgPos('bg-nombre','center');
setBg('bg-apt','APT'); setBgPos('bg-apt','center top');
setBg('bg-terminal','APT'); setBgPos('bg-terminal','center');
setBg('bg-transito','TREN'); setBgPos('bg-transito','center');
setBg('bg-mercado','BAR'); setBgPos('bg-mercado','center top');
setBg('bg-final','CERO'); setBgPos('bg-final','center');

// Mara portrait
document.getElementById('mara-img').src = ASSETS.MARA;

// Audio - convertir data URI a Blob URL (Chrome funciona mejor así)

// ============================================================