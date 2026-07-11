// ============================================================
// BLOQUE JS-01 — RECURSOS (rutas a imágenes y audio)
// El objeto ASSETS mapea nombres lógicos a rutas físicas dentro
//   de la carpeta assets/. Para reemplazar una imagen o el audio,
//   sustituir el archivo correspondiente en assets/images o
//   assets/audio manteniendo el nombre.
// ============================================================

// Versión actual del juego. ACTUALIZAR EN CADA ENTREGA.
// Se muestra en el panel de depuración (Ctrl+D / tap arriba-izquierda).
const JUEGO_VERSION = "0.162";
window.JUEGO_VERSION = JUEGO_VERSION;

// ------------------------------------------------------------
// BLOQUEO DE ORIENTACIÓN (vertical).
// Intento "best effort": donde el navegador lo soporte, fijamos la
// orientación a vertical. Donde no (iOS Safari y la mayoría de navegadores
// móviles fuera de pantalla completa), no pasa nada: el overlay CSS
// (#rotacion-overlay) se encarga de pedir girar el dispositivo. Se
// envuelve en try/catch porque lock() rechaza con error si no se cumple
// la condición de pantalla completa, y no queremos que eso ensucie nada.
// ------------------------------------------------------------
(function intentarBloquearVertical(){
  try{
    // Solo tiene sentido en dispositivos táctiles (móvil/tablet). En PC
    // no se intenta siquiera: el ratón no rota la pantalla.
    var esTactil = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if(!esTactil) return;
    if(screen && screen.orientation && typeof screen.orientation.lock === 'function'){
      const p = screen.orientation.lock('portrait');
      if(p && typeof p.catch === 'function') p.catch(function(){ /* no soportado: lo cubre el overlay */ });
    }
  }catch(e){ /* silencioso: el overlay CSS es el plan de respaldo */ }
})();

const ASSETS = {
  // — fondos nuevos v0.162 (tandas A/B/C) —
  CIBERCAFE_02: "assets/images/cibercafe_02.webp",
  CIBERCAFE_03: "assets/images/cibercafe_03.webp",
  CALLEJON_NIVELES_02: "assets/images/callejon_niveles_02.webp",
  CALLEJON_NIVELES_03: "assets/images/callejon_niveles_03.webp",
  ALMACEN_OKUPA_02: "assets/images/almacen_okupa_02.webp",
  ALMACEN_OKUPA_03: "assets/images/almacen_okupa_03.webp",
  PLAZA_OLVIDADOS_02: "assets/images/plaza_olvidados_02.webp",
  PLAZA_OLVIDADOS_03: "assets/images/plaza_olvidados_03.webp",
  SECTOR7_CALLES_02: "assets/images/sector7_calles_02.webp",
  SECTOR7_CALLES_03: "assets/images/sector7_calles_03.webp",
  COMEDOR_SECTORB_02: "assets/images/comedor_sectorb_02.webp",
  COMEDOR_SECTORB_03: "assets/images/comedor_sectorb_03.webp",
  DERIVA_LLUVIA_INTENSA: "assets/images/deriva_lluvia_intensa.webp",
  DERIVA_MADRUGADA: "assets/images/deriva_madrugada.webp",
  DERIVA_APAGON: "assets/images/deriva_apagon.webp",
  DERIVA_CANAL_NOCHE: "assets/images/deriva_canal_noche.webp",
  DERIVA_PLAZA_VACIA_MEGAFONIA: "assets/images/deriva_plaza_vacia_megafonia.webp",
  DERIVA_MERCADO_CERRANDO: "assets/images/deriva_mercado_cerrando.webp",
  DERIVA_COLA_RACION: "assets/images/deriva_cola_racion.webp",
  DERIVA_PASARELA_INDUSTRIAL: "assets/images/deriva_pasarela_industrial.webp",
  DERIVA_CONTROL_HELIX: "assets/images/deriva_control_helix.webp",
  DERIVA_AZOTEA_TENDEDEROS: "assets/images/deriva_azotea_tendederos.webp",
  CARMESI_CALLE: "assets/images/carmesi_calle.webp",
  CARMESI_INTERIOR: "assets/images/carmesi_interior.webp",
  FERRO_ACERIA: "assets/images/ferro_aceria.webp",
  FERRO_TALLER: "assets/images/ferro_taller.webp",
  NODO_IA_SERVIDORES: "assets/images/nodo_ia_servidores.webp",
  SANTUARIO_INTERIOR: "assets/images/santuario_interior.webp",
  HELIX_REGULARIZACION: "assets/images/helix_regularizacion.webp",
  PLANTA_PROCESADO: "assets/images/planta_procesado.webp",
  APPROACH_SECTOR7: "assets/images/approach_sector7.webp",
  ARRIVAL_SECTOR7: "assets/images/arrival_sector7.webp",
  DOCK_ACCESS_TUNNEL: "assets/images/dock_access_tunnel.webp",
  ENERGY_DISPATCH_CENTER: "assets/images/energy_dispatch_center.webp",
  FREE_TRANSIT_HUB: "assets/images/free_transit_hub.webp",
  FREIGHT_HUB07: "assets/images/freight_hub07.webp",
  HELIX_MEDICAL_CENTER: "assets/images/helix_medical_center.webp",
  HELIX_MEDICAL_WING: "assets/images/helix_medical_wing.webp",
  HOUSING_BLOCK_B2: "assets/images/housing_block_b2.webp",
  INDUSTRIAL_WALKWAY9: "assets/images/industrial_walkway9.webp",
  LOWER_CANAL_SECTOR7B: "assets/images/lower_canal_sector7b.webp",
  MAPA_STRATA: "assets/images/mapa_strata.webp",
  MAPA_STRATA_PC: "assets/images/mapa_strata_pc.webp",
  MAINTENANCE_ACCESS12: "assets/images/maintenance_access12.webp",
  MARA_ALLEY_CLEAN: "assets/images/mara_alley_clean.webp",
  MARKET_DISTRICT_TIER1: "assets/images/market_district_tier1.webp",
  PORT_AUTHORITY_SECTOR3A: "assets/images/port_authority_sector3a.webp",
  SECTOR7_BLACK_MARKET: "assets/images/sector7_black_market.webp",
  SECTOR7_CENTRAL_PLAZA: "assets/images/sector7_central_plaza.webp",
  SECTOR7_STREETS: "assets/images/sector7_streets.webp",
  SERVICE_CONDUIT_RAMP_E: "assets/images/service_conduit_ramp_e.webp",
  SOUTH_ELEVATOR_LEVEL4: "assets/images/south_elevator_level4.webp",
  SURGERY_ROOMS_CORRIDOR: "assets/images/surgery_rooms_corridor.webp",
  SURGICAL_SUITE: "assets/images/surgical_suite.webp",
  TREATMENT_WING: "assets/images/treatment_wing.webp",
  WEST_CORRIDOR_LOCKER218: "assets/images/west_corridor_locker218.webp",
  APT: "assets/images/apt.webp",
  APT_DIA: "assets/images/apt_dia.webp",
  APT_MOVIL: "assets/images/apt_movil.webp",
  APT_DIA_MOVIL: "assets/images/apt_dia_movil.webp",
  PASILLO: "assets/images/pasillo.webp",
  MERCADO: "assets/images/mercado.webp",
  BAR: "assets/images/bar.webp",
  MARA: "assets/images/mara.webp",
  CERO: "assets/images/cero.webp",
  TREN: "assets/images/tren.webp",
  BOOT: "assets/images/boot.webp",
  ESPACIO: "assets/images/espacio.webp",
  AUDIO: "assets/audio/audio.mp3",
  MAIN_THEME: "assets/audio/main_theme.ogg",
  ASHES_OF_HELIX: "assets/audio/ashes_of_helix.ogg",
  INTRO_THEME: "assets/audio/intro_theme.mp3",
  JAZZ_NOIR: "assets/audio/jazz_noir.mp3",
  FERRO_TRANSITO_1: "assets/images/ferro_transito_1.webp",
  FERRO_TRANSITO_2: "assets/images/ferro_transito_2.webp",
  FERRO_TRANSITO_3: "assets/images/ferro_transito_3.webp",
  FERRO_ZONA: "assets/images/ferro_zona.webp",
  CARMESI_TRANSITO_1: "assets/images/carmesi_transito_1.webp",
  CARMESI_TRANSITO_2: "assets/images/carmesi_transito_2.webp",
  CARMESI_TRANSITO_3: "assets/images/carmesi_transito_3.webp",
  CARMESI_ZONA: "assets/images/carmesi_zona.webp",
  MERCADO_TRANSITO_1: "assets/images/mercado_transito_1.webp",
  MERCADO_TRANSITO_2: "assets/images/mercado_transito_2.webp",
  MERCADO_TRANSITO_3: "assets/images/mercado_transito_3.webp",
  MERCADO_ZONA: "assets/images/mercado_zona.webp",
  SANTUARIO_TRANSITO_1: "assets/images/santuario_transito_1.webp",
  SANTUARIO_TRANSITO_2: "assets/images/santuario_transito_2.webp",
  SANTUARIO_TRANSITO_3: "assets/images/santuario_transito_3.webp",
  SANTUARIO_ZONA: "assets/images/santuario_zona.webp",
  NODO_TRANSITO_1: "assets/images/nodo_transito_1.webp",
  NODO_TRANSITO_2: "assets/images/nodo_transito_2.webp",
  NODO_TRANSITO_3: "assets/images/nodo_transito_3.webp",
  NODO_ZONA: "assets/images/nodo_zona.webp",
  EXP_ALMACEN_HELIX: "assets/images/exp_almacen_helix.webp",
  EXP_PUERTO_ORBITAL_1: "assets/images/exp_puerto_orbital_1.webp",
  EXP_TALLER_PROTESIS_1: "assets/images/exp_taller_protesis_1.webp",
  EXP_MERCADO_OLVIDADOS: "assets/images/exp_mercado_olvidados.webp",
  EXP_GUARIDA_ECO: "assets/images/exp_guarida_eco.webp",
  EXP_PLANTA_AGUA: "assets/images/exp_planta_agua.webp",
  EXP_MERCADO_SUMERGIDO: "assets/images/exp_mercado_sumergido.webp",
  EXP_TALLER_REUTILIZA: "assets/images/exp_taller_reutiliza.webp",
  EXP_CALLEJON_NIVELES: "assets/images/exp_callejon_niveles.webp",
  EXP_CIBERCAFE: "assets/images/exp_cibercafe.webp",
  EXP_TALLER_NEURAL: "assets/images/exp_taller_neural.webp",
  EXP_ALMACEN_OKUPA: "assets/images/exp_almacen_okupa.webp",
  EXP_CANAL_PILAS: "assets/images/exp_canal_pilas.webp",
  EXP_COMEDOR_SECTORB: "assets/images/exp_comedor_sectorb.webp",
  EXP_SANTUARIO_ECO: "assets/images/exp_santuario_eco.webp",
  EXP_CALLEJON_SUENOS: "assets/images/exp_callejon_suenos.webp",
  EXP_PUERTO_ORBITAL_2: "assets/images/exp_puerto_orbital_2.webp",
  EXP_PUERTO_CARGA: "assets/images/exp_puerto_carga.webp",
  EXP_PLAZA_OLVIDADOS: "assets/images/exp_plaza_olvidados.webp",
  EXP_ALMACEN_ZONA7: "assets/images/exp_almacen_zona7.webp",
  // --- Intro cinemática (17 frames, v0.73.2) ---
  INTRO_01: "assets/images/intro_01.webp",
  INTRO_02: "assets/images/intro_02.webp",
  INTRO_03: "assets/images/intro_03.webp",
  INTRO_04: "assets/images/intro_04.webp",
  INTRO_05: "assets/images/intro_05.webp",
  INTRO_06: "assets/images/intro_06.webp",
  INTRO_07: "assets/images/intro_07.webp",
  INTRO_08: "assets/images/intro_08.webp",
  INTRO_09: "assets/images/intro_09.webp",
  INTRO_10: "assets/images/intro_10.webp",
  INTRO_11: "assets/images/intro_11.webp",
  INTRO_12: "assets/images/intro_12.webp",
  INTRO_13: "assets/images/intro_13.webp",
  INTRO_14: "assets/images/intro_14.webp",
  INTRO_15: "assets/images/intro_15.webp",
  INTRO_16: "assets/images/intro_16.webp",
  INTRO_LOGO: "assets/images/intro_17.webp",
  // --- Iconos del refinado / desmontaje (v0.93) ---
  REF_PROCESADOR: "assets/images/ref_procesador.webp",
  REF_BATERIA: "assets/images/ref_bateria.webp",
  REF_SENSOR: "assets/images/ref_sensor.webp",
  REF_MECANICO: "assets/images/ref_mecanico.webp",
  REF_CHIP_HELIX: "assets/images/ref_chip_helix.webp",
  REF_CHATARRA: "assets/images/ref_chatarra.webp",
  // --- Hospital Público HELIX (v0.94) ---
  HOSPITAL_ZONA: "assets/images/hospital_zona.webp",
  TRANSITO_HOSPITAL_1: "assets/images/transito_hospital_1.webp",
  TRANSITO_HOSPITAL_2: "assets/images/transito_hospital_2.webp",
  TRANSITO_HOSPITAL_3: "assets/images/transito_hospital_3.webp"
};

// v0.162 — Rotador de variantes de fondo: cuando una escena pide uno de estos
// fondos muy repetidos, el juego elige al azar entre el original y sus versiones.
const VARIANTES_FONDO = {
  'EXP_CIBERCAFE':        ['EXP_CIBERCAFE','CIBERCAFE_02','CIBERCAFE_03'],
  'EXP_CALLEJON_NIVELES': ['EXP_CALLEJON_NIVELES','CALLEJON_NIVELES_02','CALLEJON_NIVELES_03'],
  'EXP_ALMACEN_OKUPA':    ['EXP_ALMACEN_OKUPA','ALMACEN_OKUPA_02','ALMACEN_OKUPA_03'],
  'EXP_PLAZA_OLVIDADOS':  ['EXP_PLAZA_OLVIDADOS','PLAZA_OLVIDADOS_02','PLAZA_OLVIDADOS_03'],
  'SECTOR7_STREETS':      ['SECTOR7_STREETS','SECTOR7_CALLES_02','SECTOR7_CALLES_03'],
  'EXP_COMEDOR_SECTORB':  ['EXP_COMEDOR_SECTORB','COMEDOR_SECTORB_02','COMEDOR_SECTORB_03']
};
function fondoConVariante(k){
  const arr = VARIANTES_FONDO && VARIANTES_FONDO[k];
  if(arr && arr.length) return arr[Math.floor(Math.random()*arr.length)];
  return k;
}
if(typeof window !== 'undefined'){ window.VARIANTES_FONDO = VARIANTES_FONDO; window.fondoConVariante = fondoConVariante; }


// Apply backgrounds

// ============================================================