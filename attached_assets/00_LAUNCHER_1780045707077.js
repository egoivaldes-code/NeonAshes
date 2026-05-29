// ==================================================================
//   ╔══════════════════════════════════════════════════════════════╗
//   ║                                                              ║
//   ║   >>>  BLOQUE JS-00 — LAUNCHER / CONFIGURACIÓN PRINCIPAL <<<  ║
//   ║                                                              ║
//   ║   Aquí están los valores principales del juego.              ║
//   ║   Si quieres cambiar:                                        ║
//   ║       · cuántos créditos empiezas teniendo                   ║
//   ║       · cuánto cuesta el alquiler diario                     ║
//   ║       · el modelo de IA que se usa                           ║
//   ║       · la fecha en que empieza el juego                     ║
//   ║       · cuántas muertes "recuerda" el mundo                  ║
//   ║       · etc.                                                 ║
//   ║                                                              ║
//   ║   ...TOCA SOLO AQUÍ. No hace falta buscar nada más.          ║
//   ║                                                              ║
//   ║   Si más adelante quieres compilar el juego a APK (Android), ║
//   ║   EXE (Windows) o IPA (iPhone), también es este el sitio     ║
//   ║   donde se ajusta la URL del backend de IA, los nombres,     ║
//   ║   los iconos, etc.                                           ║
//   ║                                                              ║
//   ╚══════════════════════════════════════════════════════════════╝
// ==================================================================

const LAUNCHER = {

  // ─── ECONOMÍA ──────────────────────────────────────────────────
  CREDITOS_INICIALES: 1200,   // CR con los que arranca cada partida nueva
  ALQUILER_DIARIO:    100,    // CR/día que cuesta vivir en el apartamento
  FATIGA_POR_IMPAGADO: 5,     // penalización si no llegas al alquiler

  // ─── TIEMPO DEL UNIVERSO ───────────────────────────────────────
  // Fecha en la que arranca el juego. Formato: año, mes-1, día, hora, min, seg
  // (En JavaScript los meses van de 0 a 11, así que diciembre = 11)
  FECHA_INICIO_AÑO:   2247,
  FECHA_INICIO_MES:   11,     // 11 = diciembre
  FECHA_INICIO_DIA:   25,
  FECHA_INICIO_HORA:  3,
  FECHA_INICIO_MIN:   14,
  FECHA_INICIO_SEG:   0,

  // Cuántos segundos de juego pasan por cada segundo real.
  // 60 = el tiempo del juego corre 60 veces más rápido que el real.
  FACTOR_TIEMPO: 60,

  // ─── MUERTE Y MEMORIA DEL MUNDO ────────────────────────────────
  MAX_MUERTOS_RECORDADOS: 5,  // cuántos jugadores muertos recuerda el universo

  // ─── INTELIGENCIA ARTIFICIAL (Mara — legacy) ────────────────────
  // Modelo de Claude que se usa para que Mara responda en vivo.
  // NOTA: este es el sistema IA ANTIGUO de Mara (BLOQUE JS-37).
  // El sistema IA NUEVO (casos de detective) usa las variables
  // de la sección "SISTEMA IA NARRATIVO" más abajo.
  MODELO_IA:     'claude-sonnet-4-20250514',
  MAX_TOKENS_IA: 300,         // longitud máxima de cada respuesta de Mara

  // ─── AMBIENTE SONORO ───────────────────────────────────────────
  // Volumen general de las pistas de ambiente (tormenta + industrial
  // + crowd). 0 = silencio, 1 = máximo. Va independiente del tema
  // musical. Recomendado: 0.4–0.7.
  VOLUMEN_AMBIENTE: 0.55,

  // ─── CLAVES DE GUARDADO ────────────────────────────────────────
  // Son los nombres con los que el juego guarda los datos en el navegador.
  // Si los cambias, todas las partidas antiguas se considerarán "no existen".
  CLAVE_PARTIDA:   'neon_ashes_partida_v1',
  CLAVE_MUNDO:     'neon_ashes_mundo_v1',
  CLAVE_FACCIONES: 'neon_ashes_facciones_v1',
  CLAVE_ZONAS:     'neon_ashes_zonas_v1',

  // ─── SISTEMA IA NARRATIVO (casos de detective, BLOQUES JS-50+) ──
  //
  // Arquitectura v0.67: GROQ a través de un PORTERO (Netlify Function).
  //
  // El navegador NO puede llamar a Groq directamente (lo bloquea
  // por seguridad). Por eso el juego llama a una función nuestra
  // alojada en Netlify, y esa función llama a Groq.
  //
  // La clave de Groq NO va aquí ni en el código: vive como
  // "variable de entorno" en el panel de Netlify, con el nombre
  // GROQ_API_KEY. Así no se sube a GitHub y nadie puede robarla.
  // (Ver instrucciones de configuración en el mensaje de entrega.)
  //
  // Cambiar de modelo de Groq = editar API_MODELO_GROQ.

  // Dirección del portero. Ahora vive en un Cloudflare Worker
  // (Netlify se pausaba por límites del plan gratuito). Solo
  // cámbiala si mueves la función de sitio otra vez.
  API_URL_PORTERO: 'https://neon-ashes-ia.egoivaldes.workers.dev',

  // Modelo de Groq que usa el portero.
  //   'llama-3.1-8b-instant'   → rapidísimo, ideal diálogo (14.400/día)
  //   'llama-3.3-70b-versatile'→ mejor prosa, escenas (1.000/día)
  API_MODELO_GROQ: 'llama-3.1-8b-instant',

  // Parámetros de generación
  API_MAX_TOKENS_RESPUESTA: 800,
  API_TEMPERATURA: 0.85,
  API_TIMEOUT_MS:  12000,                 // 12s de margen (Groq suele tardar 1-3s)
  API_REINTENTOS:  1,                     // reintentos si la primera falla

  // Telemetría local (para evaluar coste/uso en pruebas)
  API_LOG_LLAMADAS: true,                 // guarda contador en localStorage
  API_LOG_TOKENS:   true,                 // estima tokens consumidos

  // ─── LEGACY DORMIDO ─────────────────────────────────────────────
  // Config de OpenRouter y Gemini directo. No se usan en v0.67 pero
  // el cliente sigue soportándolos por si hay que reactivar alguno.
  // Dejar como están.
  API_KEY_OPENROUTER: '',
  API_KEY_GEMINI:     '',
  API_KEY_GROQ:       '',                 // solo para Groq directo (dormido)
  API_MODELO_GEMINI:  'gemini-2.5-flash-lite',
  API_MODELOS_OPENROUTER: [
    'deepseek/deepseek-chat-v3.5:free',
    'meta-llama/llama-3.3-70b-instruct:free'
  ],

};

// ==================================================================
// FIN DEL LAUNCHER. A partir de aquí está el código del juego.
// No suele hacer falta tocar nada de lo de abajo para configurarlo.
// ==================================================================


// ==================================================================
// ÍNDICE DE BLOQUES JS
// ------------------------------------------------------------------
// Cada bloque empieza con una cabecera grande. Busca con Ctrl+F
// "BLOQUE JS-XX" para saltar al bloque que quieras.
//
//  JS-00  >>> LAUNCHER — CONFIGURACIÓN PRINCIPAL <<<  (arriba ↑)
//  JS-01  Recursos (imágenes y audio en base64)
//  JS-02  Utilidades de fondo (setBg, setBgPos)
//  JS-03  Audio — referencia al elemento del tema
//  JS-04  Estado global del jugador
//  JS-05  Stats humanas (fatiga, hambre, disociación, aislamiento)
//  JS-06  Cola de flechitas de cambios de stat
//  JS-07  Tiempo de juego — utilidades de hora/franja/día
//  JS-08  Guardado y carga de partida (localStorage)
//  JS-09  Archivo del mundo — muertos y herencia
//  JS-10  Herencia entre partidas
//  JS-11  Fecha y hora del universo del juego
//  JS-12  Decaimiento pasivo de stats
//  JS-13  Cobros diarios — alquiler
//  JS-14  Sistema de muerte (game over)
//  JS-15  Panel de depuración (Ctrl+D)
//  JS-16  Memoria del jugador (eventos que recuerda)
//  JS-17  Lluvia animada y streams binarios
//  JS-18  Audio — tema principal, mute, volumen, fade
//  JS-19  HUD — créditos, inventario, notificaciones
//  JS-20  Eventos aleatorios del tránsito
//  JS-21  Intro cinematográfica
//  JS-22  Carga y transición a identidad
//  JS-23  Pantalla de identidad (nombre)
//  JS-24  Apartamento — opciones y textos por hora
//  JS-25  Textos del apartamento — variantes
//  JS-26  Eco — regreso tras el final
//  JS-27  Panel HUB — abrir/cerrar paneles
//  JS-28  Noticias rotativas y reactivas
//  JS-29  Panel ESTADO — render de stats
//  JS-30  Facciones — datos, reputación, contactos
//  JS-31  Panel TRABAJOS — render y aceptar misión
//  JS-32  Terminal — mensajes pendientes
//  JS-33  Misión — tránsito al Nivel 4
//  JS-34  Misión — casillero 218
//  JS-35  Misión — vuelta al apartamento
//  JS-36  Tránsito al bar (intro de Mara)
//  JS-37  Mara — árbol de diálogo + nodo IA
//  JS-38  Vuelta tras aceptar el encargo
//  JS-39  Burbujas de diálogo y opciones
//  JS-40  Descripción del jugador para la IA
//  JS-41  Cero — aparición final
//  JS-42  Texto final del capítulo
//  JS-43  Audio sintetizado (mensajes, teclas)
//  JS-44  Eco — mensaje tipeado del terminal
//  JS-45  Reiniciar partida
//  JS-46  Desbloqueo de audio (primer tap)
//  JS-47  Mapa del mundo — zonas y viaje libre
//  JS-48  Acciones dentro de cada zona
//
//  --- SISTEMA IA NARRATIVO (casos de detective) ---
//  JS-50  Cliente IA (OpenRouter, cadena de modelos automática)
//  JS-59  Panel de depuración del sistema IA (Ctrl+I)
// ==================================================================
// ASSETS embedded

// ============================================================
