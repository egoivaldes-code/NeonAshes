// ============================================================
// BLOQUE JS-18 — INTRO CINEMATOGRÁFICA (v0.73.3)
// Estructura sobre "intro_theme.mp3" (≈3:20):
//   - Gate "toca para comenzar": desbloquea el audio del navegador
//     y enciende el sonido (AUDIO_ON = true) en ese mismo gesto.
//   - 16 frames narrativos (≈5,25s cada uno) hasta el segundo 84.
//   - Logo en el segundo 84 (justo tras el fadeout de 1:22), 10 s fijo.
//   - Después: pase de imágenes de fondo ALEATORIAS del proyecto,
//     con Ken Burns y crossfade, hasta que termina la canción.
//   - Al acabar (o al saltar) va DIRECTO a crear personaje.
// ============================================================

const INTRO_LOGO_AT   = 84;   // segundo en que aparece el logo
const INTRO_LOGO_HOLD = 10;   // segundos que el logo permanece
const INTRO_RANDOM_DUR = 6;   // segundos por imagen en el pase aleatorio

// 16 frames narrativos repartidos hasta el segundo 84 (≈5,25s cada uno).
const INTRO_FRAMES = [
  { key:"INTRO_01", at:0,     kb:"kb-zoomin",   text:"Año 2247. La humanidad sobrevivió a sí misma." },
  { key:"INTRO_02", at:5.25,  kb:"kb-panright", text:"Colonizamos el Sistema Solar. Marte. Europa. Titán. Las órbitas se llenaron de acero… y deuda." },
  { key:"INTRO_03", at:10.5,  kb:"kb-zoomout",  text:"Las naciones desaparecieron. Las corporaciones ocuparon su lugar." },
  { key:"INTRO_04", at:15.75, kb:"kb-panup",    text:"Con el tiempo… HELIX se volvió indispensable. Medicina. Infraestructura. Seguridad." },
  { key:"INTRO_05", at:21,    kb:"kb-drift",    text:"Mientras algunos compraban comodidad… millones sobrevivían bajo luces rotas." },
  { key:"INTRO_06", at:26.25, kb:"kb-panleft",  text:"Las ciudades crecieron hacia arriba. Y los olvidados quedaron enterrados abajo." },
  { key:"INTRO_07", at:31.5,  kb:"kb-zoomin",   text:"Mafias. Carteles de datos. Mercenarios corporativos. Todos luchando por lo que quedaba." },
  { key:"INTRO_08", at:36.75, kb:"kb-panright", text:"Cuando el Sistema Solar dejó de ser suficiente… miramos hacia las estrellas." },
  { key:"INTRO_09", at:42,    kb:"kb-zoomout",  text:"Partieron las primeras expediciones interestelares. Colonos. Científicos. Soñadores." },
  { key:"INTRO_10", at:47.25, kb:"kb-drift",    text:"Durante décadas… atravesaron el vacío." },
  { key:"INTRO_11", at:52.5,  kb:"kb-zoomin",   text:"Y entonces… las comunicaciones se cortaron." },
  { key:"INTRO_12", at:57.75, kb:"kb-panup",    text:"Nunca se encontró una explicación." },
  { key:"INTRO_13", at:63,    kb:"kb-zoomout",  text:"Pero algunos aseguran… que algo respondió desde la oscuridad." },
  { key:"INTRO_14", at:68.25, kb:"kb-panleft",  text:"Y aun así… la humanidad siguió adelante." },
  { key:"INTRO_15", at:73.5,  kb:"kb-zoomin",   text:"Algunos nacen con poder. Otros lo roban. Otros mueren buscándolo." },
  { key:"INTRO_16", at:78.75, kb:"kb-drift",    text:"Y tú… Tú no eres nadie." }
];

// Fondos del proyecto para el pase aleatorio tras el logo (ambiente, sin
// retratos de personaje ni mapas). Claves de ASSETS.
const INTRO_RANDOM_POOL = [
  "ESPACIO","BOOT","PASILLO","MERCADO","APT","BAR","TREN",
  "APPROACH_SECTOR7","ARRIVAL_SECTOR7","CARMESI_TRANSITO_1","CARMESI_TRANSITO_2",
  "CARMESI_TRANSITO_3","CARMESI_ZONA","DOCK_ACCESS_TUNNEL","ENERGY_DISPATCH_CENTER",
  "EXP_ALMACEN_HELIX","EXP_ALMACEN_OKUPA","EXP_ALMACEN_ZONA7","EXP_CALLEJON_NIVELES",
  "EXP_CALLEJON_SUENOS","EXP_CANAL_PILAS","EXP_CIBERCAFE","EXP_COMEDOR_SECTORB",
  "EXP_GUARIDA_ECO","EXP_MERCADO_OLVIDADOS","EXP_MERCADO_SUMERGIDO","EXP_PLANTA_AGUA",
  "EXP_PLAZA_OLVIDADOS","EXP_PUERTO_CARGA","EXP_PUERTO_ORBITAL_1","EXP_PUERTO_ORBITAL_2",
  "EXP_SANTUARIO_ECO","EXP_TALLER_NEURAL","EXP_TALLER_PROTESIS_1","EXP_TALLER_REUTILIZA",
  "FERRO_TRANSITO_1","FERRO_TRANSITO_2","FERRO_TRANSITO_3","FERRO_ZONA",
  "FREE_TRANSIT_HUB","FREIGHT_HUB07","HELIX_MEDICAL_CENTER","HELIX_MEDICAL_WING",
  "HOUSING_BLOCK_B2","INDUSTRIAL_WALKWAY9","LOWER_CANAL_SECTOR7B","MAINTENANCE_ACCESS12",
  "MARA_ALLEY_CLEAN","MARKET_DISTRICT_TIER1","NODO_TRANSITO_1","NODO_TRANSITO_2",
  "NODO_TRANSITO_3","NODO_ZONA","PORT_AUTHORITY_SECTOR3A","SANTUARIO_TRANSITO_1",
  "SANTUARIO_TRANSITO_2","SANTUARIO_TRANSITO_3","SANTUARIO_ZONA","SECTOR7_BLACK_MARKET",
  "SECTOR7_CENTRAL_PLAZA","SECTOR7_STREETS","SERVICE_CONDUIT_RAMP_E","SOUTH_ELEVATOR_LEVEL4",
  "SURGERY_ROOMS_CORRIDOR","SURGICAL_SUITE","TREATMENT_WING","WEST_CORRIDOR_LOCKER218"
];
const INTRO_RANDOM_KB = ["kb-zoomin","kb-zoomout","kb-panleft","kb-panright","kb-panup","kb-drift"];

let introActivo = false;
let introCapaActiva = 0;
let introFrameMostrado = -1;
let introFase = "narrativa";   // narrativa | logo | aleatoria
let introRelojId = null;
let introT0 = 0;
let introFinalizada = false;
let introRandomTimer = null;
let introCaptionTimer = null;
let introRandomOrden = [];
let introRandomIdx = 0;

function _introEl(id){ return document.getElementById(id); }
function _introCapas(){ return [_introEl('cine-a'), _introEl('cine-b')]; }

// Gate al cargar; la intro NO arranca hasta que el jugador toca.
function prepararGateIntro(){
  const logo = _introEl('cine-logo');
  if(logo) logo.style.backgroundImage = `url('${ASSETS.INTRO_LOGO}')`;
  const gate = _introEl('cine-gate');
  if(gate){
    gate.classList.add('visible');
    gate.addEventListener('click', arrancarIntro, { once:true });
  }
}

// El toque desbloquea el audio del navegador y enciende el sonido.
function arrancarIntro(){
  if(introActivo) return;
  introActivo = true;
  introFase = "narrativa";

  const gate = _introEl('cine-gate');
  if(gate) gate.classList.remove('visible');

  _introEl('cine-top').classList.add('activa');
  _introEl('cine-bottom').classList.add('activa');

  const a = _introEl('btn-skip'); if(a) a.classList.add('activo');
  const b = _introEl('perm-btn-skip'); if(b) b.classList.add('activo');

  // ENCENDER audio en este gesto (resuelve el bloqueo del navegador):
  // el play() ocurre dentro del handler del clic, así el navegador lo permite.
  window.AUDIO_ON = true;
  const audio = _introEl('tema-principal');
  if(audio){
    try{
      audio.src = ASSETS.INTRO_THEME;
      audio.loop = false;
      audio.currentTime = 0;
      audio.volume = (window.AUDIO_VOL!==undefined ? window.AUDIO_VOL : 0.55);
      audio.muted = false;
      audio.play().catch(()=>{});
      if(typeof sincronizarBotonesAudio === 'function') sincronizarBotonesAudio();
      if(typeof mostrarBarraControles === 'function') mostrarBarraControles(4500);
      audio.addEventListener('ended', finalizarIntro);
    }catch(e){}
  }

  introFrameMostrado = 0;
  mostrarFrameIntro(0);
  introT0 = performance.now();
  introRelojId = setInterval(introTick, 100);
}

// Reloj de intro (independiente, por si el audio se bloquea: red de seguridad).
function introTick(){
  if(!introActivo || introFase!=="narrativa") return;
  const t = (performance.now() - introT0) / 1000;
  let target = 0;
  for(let i=0;i<INTRO_FRAMES.length;i++){ if(t >= INTRO_FRAMES[i].at) target = i; }
  if(target !== introFrameMostrado){
    introFrameMostrado = target;
    mostrarFrameIntro(target);
  }
  if(t >= INTRO_LOGO_AT){ mostrarLogoIntro(); }
}

function mostrarFrameIntro(idx){
  if(!introActivo || introFase!=="narrativa") return;
  const f = INTRO_FRAMES[idx];
  if(!f) return;
  _pintarCapa(ASSETS[f.key], f.kb, (INTRO_FRAMES[idx+1]?INTRO_FRAMES[idx+1].at:INTRO_LOGO_AT)-f.at+2);
  const cap = _introEl('cine-caption');
  if(cap){
    clearTimeout(introCaptionTimer);     // cancelar la aparición pendiente del frame anterior
    cap.classList.remove('visible');
    cap.textContent = f.text;
    introCaptionTimer = setTimeout(()=>{ if(introActivo && introFase==="narrativa") cap.classList.add('visible'); }, 650);
  }
}

// Pinta una imagen en la capa entrante con crossfade y Ken Burns.
function _pintarCapa(url, kb, dur){
  const capas = _introCapas();
  const entra = capas[introCapaActiva ^ 1];
  const sale  = capas[introCapaActiva];
  entra.style.animation = 'none';
  entra.style.backgroundImage = `url('${url}')`;
  void entra.offsetWidth;
  entra.style.animation = `${kb} ${Math.max(3,dur)}s ease-in-out forwards`;
  entra.classList.add('visible');
  sale.classList.remove('visible');
  introCapaActiva ^= 1;
}

function mostrarLogoIntro(){
  if(introFase!=="narrativa") return;
  introFase = "logo";
  clearInterval(introRelojId);
  _introCapas().forEach(c=>c.classList.remove('visible'));
  const cap = _introEl('cine-caption'); if(cap) cap.classList.remove('visible');
  const logo = _introEl('cine-logo'); if(logo) logo.classList.add('visible');
  // tras 10s, en vez de terminar, arranca el pase aleatorio de fondos
  setTimeout(iniciarPaseAleatorio, INTRO_LOGO_HOLD*1000);
}

// Pase de imágenes de fondo aleatorias hasta que termina la canción.
function iniciarPaseAleatorio(){
  if(!introActivo) return;
  introFase = "aleatoria";
  // ocultar logo, volver a las capas de imagen
  const logo = _introEl('cine-logo'); if(logo) logo.classList.remove('visible');
  // barajar el pool
  introRandomOrden = INTRO_RANDOM_POOL.filter(k=>ASSETS[k]).slice();
  for(let i=introRandomOrden.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [introRandomOrden[i],introRandomOrden[j]]=[introRandomOrden[j],introRandomOrden[i]];
  }
  introRandomIdx = 0;
  siguienteAleatoria();
}

function siguienteAleatoria(){
  if(!introActivo || introFase!=="aleatoria") return;
  if(introRandomOrden.length===0){ return; }
  const key = introRandomOrden[introRandomIdx % introRandomOrden.length];
  const kb = INTRO_RANDOM_KB[Math.floor(Math.random()*INTRO_RANDOM_KB.length)];
  _pintarCapa(ASSETS[key], kb, INTRO_RANDOM_DUR+2);
  introRandomIdx++;
  introRandomTimer = setTimeout(siguienteAleatoria, INTRO_RANDOM_DUR*1000);
}

// --- Saltar ---
function ocultarBotonSkip(){
  const a = _introEl('btn-skip'); if(a) a.classList.remove('activo');
  const b = _introEl('perm-btn-skip'); if(b) b.classList.remove('activo');
}
function saltarIntro(){
  if(!introActivo) return;
  introActivo = false;
  clearInterval(introRelojId);
  clearTimeout(introRandomTimer); clearTimeout(introCaptionTimer);
  ocultarBotonSkip();
  _introCapas().forEach(c=>c.classList.remove('visible'));
  const cap = _introEl('cine-caption'); if(cap) cap.classList.remove('visible');
  finalizarIntro();
}

// --- Finalizar: DIRECTO a crear personaje (sin pantalla de carga) ---
function finalizarIntro(){
  if(introFinalizada) return;
  introFinalizada = true;
  introActivo = false;
  clearInterval(introRelojId);
  clearTimeout(introRandomTimer); clearTimeout(introCaptionTimer);
  ocultarBotonSkip();
  _introEl('cine-top').classList.remove('activa');
  _introEl('cine-bottom').classList.remove('activa');
  const ov = _introEl('transicion');
  ov.style.transition = 'opacity 0.8s ease';
  ov.classList.add('oscurecer');
  // bajar la música al salir
  const audio = _introEl('tema-principal');
  if(audio){ try{ audio.pause(); }catch(e){} }
  setTimeout(()=>{
    _introEl('intro-escena').classList.remove('activa');
    if(typeof prepararPantallaIdentidad === 'function') prepararPantallaIdentidad();
    _introEl('nombre-escena').classList.add('activa');
    ov.classList.remove('oscurecer');
  }, 800);
}

window.addEventListener('load', ()=>setTimeout(prepararGateIntro, 200));

// Compatibilidad con el reinicio de partida (34_reiniciar.js).
function iniciarIntro(){
  introActivo = false; introFinalizada = false; introFase = "narrativa";
  introFrameMostrado = -1; introCapaActiva = 0;
  clearInterval(introRelojId); clearTimeout(introRandomTimer); clearTimeout(introCaptionTimer);
  _introCapas().forEach(c=>c.classList.remove('visible'));
  const cap = _introEl('cine-caption'); if(cap) cap.classList.remove('visible');
  const logo = _introEl('cine-logo'); if(logo) logo.classList.remove('visible');
  prepararGateIntro();
}
