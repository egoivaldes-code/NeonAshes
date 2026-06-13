// ============================================================
// NEON ASHES — MOTOR DE EXPEDICIÓN (Scavenging)  ·  v0.86.6
// ------------------------------------------------------------
// Paso 2 del plan del documento docs/01_diseno_expedicion.md.
//
// Esto es el CEREBRO de la expedición, SIN pantallas y SIN engancharlo
// todavía a la profesión Scavenger (eso es el paso 3). Aquí viven:
//   - los datos de las ZONAS (riesgo, nº de eventos, botín, requisitos)
//   - las TABLAS DE EVENTOS de cada zona
//   - el motor de ESTADO DE RUN (alerta, recursos, botín bruto)
//   - las funciones de avanzar evento / retirarse / resolver opción
//
// Nada de esto cambia el juego visible aún: son funciones que existen y
// se pueden probar, listas para que la UI (paso 4) las llame. Todo es
// defensivo: si una dependencia no existe, no revienta.
//
// Convención de la run: vive en Estado.expedicion mientras está activa.
// El botín se acumula en "bruto" y SOLO se vuelca al inventario cuando
// el jugador EXTRAE vivo (retirarse). Si la run falla (captura/muerte),
// el bruto se pierde según las reglas del documento.
// ============================================================

// ── Utilidad de pesos (misma idea que _elegirDesenlace de profesiones) ──
function _expElegirPonderado(lista){
  if(!Array.isArray(lista) || lista.length === 0) return null;
  const total = lista.reduce((s, x) => s + (x.peso || 1), 0);
  let r = Math.random() * total;
  for(const x of lista){
    r -= (x.peso || 1);
    if(r <= 0) return x;
  }
  return lista[lista.length - 1];
}

// ============================================================
// DATOS DE ZONAS
// ------------------------------------------------------------
// Cada zona define: riesgo base (alerta inicial), cuánto sube la alerta
// por evento, rango de nº de eventos, su tabla de eventos y su tabla de
// botín. 'bloqueada' marca las que hay que desbloquear (paso 5).
// ============================================================
const ZONAS_EXPEDICION = {

  conducto: {
    id: 'conducto',
    nombre: 'Conducto de servicio',
    desc: 'Tubos estrechos y calientes entre los niveles. Poca gente baja aquí. Poco que encontrar, pero casi nadie con quien cruzarte.',
    riesgo: 'bajo',
    alertaInicial: 0,
    alertaPorEvento: 5,
    eventosMin: 3,
    eventosMax: 4,
    bloqueada: false,
    tablaBotin: [
      { peso: 5, creditos: [10, 30], items: [{ id:'chatarra_cruda', cant:[1,3] }] },
      { peso: 2, creditos: [0, 10], items: [{ id:'chatarra_cruda', cant:[2,4] }] },
      { peso: 1, creditos: [0, 0], items: [{ id:'cargador', cant:[1,1] }] }
    ]
  },

  contenedor: {
    id: 'contenedor',
    nombre: 'Contenedor HELIX',
    desc: 'Un módulo de carga corporativo, sellado y olvidado. Lo que hay dentro vale, pero romper un sello HELIX deja rastro.',
    riesgo: 'medio',
    alertaInicial: 10,
    alertaPorEvento: 9,
    eventosMin: 4,
    eventosMax: 6,
    bloqueada: false,
    tablaBotin: [
      { peso: 4, creditos: [30, 70], items: [{ id:'chatarra_cruda', cant:[2,5] }] },
      { peso: 2, creditos: [20, 50], items: [{ id:'nucleo_optico', cant:[1,1] }] },
      { peso: 1, creditos: [0, 20], items: [{ id:'carga_analizador', cant:[1,2] }] }
    ]
  },

  vehiculo: {
    id: 'vehiculo',
    nombre: 'Vehículo abandonado',
    desc: 'Un transporte varado, oxidándose. Lotería pura: o alguien lo dejó vacío, o se dejó algo que valía la pena.',
    riesgo: 'medio',
    alertaInicial: 5,
    alertaPorEvento: 8,
    eventosMin: 3,
    eventosMax: 5,
    bloqueada: false,
    tablaBotin: [
      { peso: 4, creditos: [0, 20], items: [{ id:'chatarra_cruda', cant:[1,2] }] },
      { peso: 2, creditos: [60, 120], items: [{ id:'chatarra_cruda', cant:[1,3] }] },
      { peso: 1, creditos: [0, 0], items: [{ id:'arma_blanca', cant:[1,1] }] }
    ]
  },

  pozo: {
    id: 'pozo',
    nombre: 'Pozo de inundación',
    desc: 'Bajo el nivel de la calle, agua negra y aire que pica. Lo mejor se hunde aquí... y casi nadie vuelve entero a buscarlo.',
    riesgo: 'alto',
    alertaInicial: 15,
    alertaPorEvento: 10,
    eventosMin: 6,
    eventosMax: 8,
    bloqueada: false,
    recomiendaEquipo: ['mascara_filtro'],
    tablaBotin: [
      { peso: 3, creditos: [40, 90], items: [{ id:'chatarra_cruda', cant:[3,6] }] },
      { peso: 2, creditos: [30, 70], items: [{ id:'servidor_hundido', cant:[1,1] }] },
      { peso: 2, creditos: [50, 110], items: [{ id:'nucleo_optico', cant:[1,1] }] }
    ]
  },

  // ── ZONAS BLOQUEADAS (desbloqueo = paso 5) ────────────────
  nivel9: {
    id: 'nivel9',
    nombre: 'Nivel 9 sellado',
    desc: 'Una planta entera clausurada por HELIX. Nadie dice qué hay dentro, y los que entraron no lo cuentan.',
    riesgo: 'extremo',
    alertaInicial: 25,
    alertaPorEvento: 12,
    eventosMin: 6,
    eventosMax: 8,
    bloqueada: true,
    requisito: { tipo: 'llave', id: 'llave_magnetica' },
    tablaBotin: [
      { peso: 3, creditos: [80, 160], items: [{ id:'servidor_hundido', cant:[1,1] }] },
      { peso: 2, creditos: [100, 200], items: [{ id:'nucleo_optico', cant:[1,2] }] }
    ]
  },

  deposito_orbital: {
    id: 'deposito_orbital',
    nombre: 'Depósito orbital',
    desc: 'Restos de un almacén de órbita baja caídos sobre las Pilas. Óptica militar, implantes sin estrenar. Y la muerte rondando cada rincón.',
    riesgo: 'extremo',
    alertaInicial: 20,
    alertaPorEvento: 11,
    eventosMin: 6,
    eventosMax: 8,
    bloqueada: true,
    requisito: { tipo: 'rango', rango: 'Buzo de Chatarra' },
    tablaBotin: [
      { peso: 3, creditos: [90, 180], items: [{ id:'nucleo_optico', cant:[1,2] }] },
      { peso: 2, creditos: [120, 240], items: [{ id:'servidor_hundido', cant:[1,1] }] }
    ]
  }
};

// ============================================================
// TABLAS DE EVENTOS
// ------------------------------------------------------------
// Eventos genéricos que pueden aparecer en cualquier zona, ponderados.
// Cada evento ofrece opciones; cada opción declara sus efectos sobre la
// run (alerta, botín, recursos, heridas). La UI (paso 4) los pintará;
// aquí solo se definen y se resuelven en estado.
//
// Campos de una opción:
//   texto       — lo que ve el jugador.
//   tono        — para facciones/voz (FRIO, EVASIVO, VIOLENTO, VENAL...).
//   requiere    — id de equipo necesario para que la opción aparezca.
//   alerta      — cuánto sube/baja la alerta (número, puede ser negativo).
//   botin       — true si esta opción concede el botín del evento.
//   gasta       — { id: cantidad } recursos que consume de la mochila.
//   herida      — id de condición que puede aplicar (probabilístico).
//   probExito   — 0..1 para opciones con riesgo (forzar, disparar...).
// ============================================================
const EVENTOS_EXPEDICION = [

  {
    id: 'cerradura',
    peso: 3,
    narracion: 'Una compuerta sellada corta el paso. Detrás se intuye algo que vale la pena.',
    opciones: [
      { texto: 'Forzarla con ganzúa', tono:'FRIO', requiere:'ganzua', gasta:{ ganzua:1 }, alerta:4, botin:true, probExito:0.8 },
      { texto: 'Reventar el sello a la fuerza', tono:'VIOLENTO', alerta:18, botin:true, multa:60, probExito:1 },
      { texto: 'Abrirla con el analizador', tono:'FRIO', requiere:'analizador', gasta:{ carga_analizador:1 }, alerta:2, botin:true, probExito:0.9 },
      { texto: 'Dejarlo y seguir', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'rebusca',
    peso: 4,
    narracion: 'Un montón de restos sin vigilar. Hay material aprovechable si te tomas el tiempo.',
    opciones: [
      { texto: 'Rebuscar a fondo', tono:'VENAL', alerta:6, botin:true },
      { texto: 'Coger lo justo y seguir', tono:'FRIO', alerta:2, botin:true, botinReducido:true },
      { texto: 'Ignorarlo', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'encuentro',
    peso: 2,
    narracion: 'Otro carroñero aparece entre las sombras. Te ha visto. Mide tus manos, no tu cara.',
    opciones: [
      { texto: 'Amenazarle con el arma', tono:'VIOLENTO', requiere:'arma_fuego', gasta:{ cargador:1 }, alerta:12, botin:true, probExito:0.85 },
      { texto: 'Acuchillarlo si se acerca', tono:'VIOLENTO', requiere:'arma_blanca', alerta:6, botin:true, probExito:0.7, herida:'herida_brazo_d_leve' },
      { texto: 'Negociar un trato', tono:'EMPATICO', alerta:2, botin:true, botinReducido:true },
      { texto: 'Retroceder despacio', tono:'EVASIVO', alerta:4, botin:false }
    ]
  },

  {
    id: 'toxico',
    peso: 2,
    narracion: 'El aire se vuelve denso, químico. Aquí abajo se respira veneno, pero el veneno suele guardar lo bueno.',
    opciones: [
      { texto: 'Entrar con la máscara', tono:'FRIO', requiere:'mascara_filtro', alerta:4, botin:true },
      { texto: 'Aguantar la respiración y entrar', tono:'VIOLENTO', alerta:6, botin:true, herida:'envenenado', probExito:0.6 },
      { texto: 'No arriesgarse', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'patrulla',
    peso: 2,
    narracion: 'Luces y pasos acompasados. Una patrulla barre la zona. Si te ven aquí, no habrá preguntas amables.',
    opciones: [
      { texto: 'Soltar un señuelo', tono:'FRIO', requiere:'senuelo', gasta:{ senuelo:1 }, alerta:-20, botin:false },
      { texto: 'Esconderte y esperar', tono:'EVASIVO', alerta:-6, botin:false },
      { texto: 'Seguir rebuscando con ellos cerca', tono:'VIOLENTO', alerta:20, botin:true }
    ]
  },

  {
    id: 'terminal',
    peso: 3,
    narracion: 'Un terminal a medio apagar parpadea en un rincón. Si todavía guarda algo dentro, alguien pagará por leerlo.',
    opciones: [
      { texto: 'Volcar los datos con el analizador', tono:'FRIO', requiere:'analizador', gasta:{ carga_analizador:1 }, alerta:3, botin:true },
      { texto: 'Arrancar la unidad entera y cargarla', tono:'VENAL', alerta:8, botin:true },
      { texto: 'Dejarlo, pesa demasiado', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'cuerpo',
    peso: 2,
    narracion: 'Hay un cuerpo entre los escombros. Lleva ahí lo suyo. Aún conserva el equipo encima, y a él ya no le sirve.',
    opciones: [
      { texto: 'Registrarlo sin pensarlo', tono:'VENAL', alerta:4, botin:true },
      { texto: 'Registrarlo, pero cerrarle los ojos antes', tono:'EMPATICO', alerta:4, botin:true, botinReducido:true },
      { texto: 'No tocar a un muerto', tono:'HONESTO', alerta:0, botin:false }
    ]
  },

  {
    id: 'derrumbe',
    peso: 2,
    narracion: 'El paso se ha venido abajo. Al otro lado se intuye una sala sin tocar, pero la estructura cruje a cada movimiento.',
    opciones: [
      { texto: 'Forzar el hueco con la palanca', tono:'FRIO', requiere:'palanca_termica', alerta:5, botin:true },
      { texto: 'Colarte por la grieta a pulso', tono:'VIOLENTO', alerta:6, botin:true, probExito:0.55, herida:'costillas' },
      { texto: 'Buscar otro camino', tono:'EVASIVO', alerta:2, botin:false }
    ]
  },

  {
    id: 'mendigo',
    peso: 2,
    narracion: 'Una figura encogida contra la pared te observa sin miedo. "Hay cosas buenas más adentro", murmura. "Pero hoy no he comido."',
    opciones: [
      { texto: 'Darle una ración a cambio del soplo', tono:'EMPATICO', requiere:'racion_deshidratada', gasta:{ racion_deshidratada:1 }, alerta:0, botin:true },
      { texto: 'Apartarlo y seguir', tono:'FRIO', alerta:3, botin:false },
      { texto: 'Amenazarle para que hable', tono:'VIOLENTO', alerta:8, botin:true, botinReducido:true }
    ]
  },

  {
    id: 'cableado',
    peso: 3,
    narracion: 'Un nudo de cableado vivo recorre la pared. Cobre del bueno, conectores intactos. Vale, pero muerde si lo tocas mal.',
    opciones: [
      { texto: 'Cortar la corriente con una batería puente', tono:'FRIO', requiere:'bateria_4v', gasta:{ bateria_4v:1 }, alerta:2, botin:true },
      { texto: 'Arrancarlo en caliente, rápido', tono:'VIOLENTO', alerta:5, botin:true, probExito:0.7, herida:'herida_brazo_d_leve' },
      { texto: 'No merece el riesgo', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'silencio',
    peso: 2,
    narracion: 'De pronto, nada. Ni goteo, ni zumbido. El tipo de silencio que en las Pilas siempre va antes de algo. Se te eriza la piel.',
    opciones: [
      { texto: 'Quedarte quieto y escuchar', tono:'EVASIVO', alerta:-8, botin:false },
      { texto: 'Aprovechar para rebuscar deprisa', tono:'VENAL', alerta:6, botin:true },
      { texto: 'Salir de ahí cuanto antes', tono:'FRIO', alerta:-2, botin:false }
    ]
  },

  {
    id: 'rival',
    peso: 2,
    narracion: 'Otro carroñero ya está vaciando el sitio. No te ha visto. Lleva un buen fardo a la espalda. Tú decides.',
    opciones: [
      { texto: 'Encañonarle y quedarte su fardo', tono:'VIOLENTO', requiere:'arma_fuego', gasta:{ cargador:1 }, alerta:14, botin:true, probExito:0.8 },
      { texto: 'Esperar a que se vaya y coger las sobras', tono:'EVASIVO', alerta:2, botin:true, botinReducido:true },
      { texto: 'Compartir la zona sin buscar bronca', tono:'EMPATICO', alerta:0, botin:true, botinReducido:true }
    ]
  },

  {
    id: 'humedad',
    peso: 2,
    narracion: 'El aire se vuelve irrespirable, espeso de esporas y óxido. Más adelante brilla algo que merece la pena, pero esto castiga los pulmones.',
    opciones: [
      { texto: 'Avanzar protegido con la máscara', tono:'FRIO', requiere:'mascara_filtro', alerta:3, botin:true },
      { texto: 'Un trago de licor y tirar para dentro', tono:'VIOLENTO', requiere:'licor', gasta:{ licor:1 }, alerta:5, botin:true, probExito:0.6, herida:'envenenado' },
      { texto: 'Retroceder, no vale la pena ahogarse', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  {
    id: 'generador',
    peso: 2,
    narracion: 'Un viejo generador sigue caliente, zumbando solo en la oscuridad. Dentro lleva celdas que en el mercado valen su peso en créditos.',
    opciones: [
      { texto: 'Extraer las celdas con cuidado', tono:'FRIO', alerta:4, botin:true },
      { texto: 'Reventarlo para sacarlo todo de golpe', tono:'VENAL', alerta:12, botin:true, probExito:0.65, herida:'herida_brazo_d_leve' },
      { texto: 'No fiarte de algo que aún respira', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },

  // ============================================================
  // EVENTOS QUE REACCIONAN AL INVENTARIO REAL (v0.92)
  // requiereItem/vetaItem filtran por inventario del catálogo; itemFijo
  // concede un id concreto (raros). Encajan con el botín del refinado.
  // ============================================================
  {
    id: 'nicho_servidor',
    peso: 2,
    narracion: 'Tras una placa suelta hay un nicho sellado, de los que HELIX usaba para enterrar memoria que no quería perder ni encontrar. Un servidor antiguo, intacto, late despacio en la penumbra.',
    opciones: [
      { texto: 'Extraerlo con el analizador', tono:'FRIO', requiere:'analizador', gasta:{ carga_analizador:1 }, alerta:5, botin:false, itemFijo:{ id:'servidor_hundido', cant:1 }, probExito:0.9 },
      { texto: 'Arrancarlo a lo bruto', tono:'VENAL', alerta:14, botin:false, itemFijo:{ id:'servidor_hundido', cant:1 }, probExito:0.55, herida:'herida_brazo_d_leve' },
      { texto: 'Dejarlo: algo así pesa de más', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'comprador_campo',
    peso: 2,
    narracion: 'Un perista con un carrito blindado ha montado tienda entre los escombros. No vende: compra. Ve cómo cargas y entrecierra los ojos. «Tú sabes dónde se encuentran las cosas buenas. Comparte y te indico un alijo que nadie ha tocado.»',
    opciones: [
      { texto: 'Enseñarle lo que has sacado', tono:'VENAL', requiereItem:'servidor_hundido', alerta:2, botin:true },
      { texto: 'Preguntar qué compra hoy', tono:'FRIO', alerta:1, botin:true, botinReducido:true },
      { texto: 'No te fías, sigues', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'puerta_imantada',
    peso: 2,
    narracion: 'Una puerta de seguridad con cerradura magnética corta un pasillo entero. Lo que sea que guardan ahí, lo guardan en serio.',
    opciones: [
      { texto: 'Abrir con la llave magnética', tono:'FRIO', requiereItem:'llave_magnetica', alerta:1, botin:true },
      { texto: 'Forzar el panel con ganzúa', tono:'FRIO', requiere:'ganzua', gasta:{ ganzua:1 }, alerta:6, botin:true, botinReducido:true, probExito:0.7 },
      { texto: 'Reventar la bisagra a la fuerza', tono:'VIOLENTO', alerta:18, botin:true, botinReducido:true, probExito:0.8, multa:50 },
      { texto: 'Buscar otra ruta', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'vena_optica',
    peso: 1,
    narracion: 'Un haz de fibra óptica recorre la pared como una vena, y en su nudo central algo brilla con una luz que no debería seguir encendida después de tantos años. Un núcleo. De los raros.',
    opciones: [
      { texto: 'Cortar la fibra con cuidado quirúrgico', tono:'FRIO', requiere:'palanca_termica', alerta:6, botin:false, itemFijo:{ id:'nucleo_optico', cant:1 }, probExito:0.85 },
      { texto: 'Arrancar el nudo de un tirón', tono:'VENAL', alerta:10, botin:false, itemFijo:{ id:'nucleo_optico', cant:1 }, probExito:0.5, herida:'herida_brazo_d_leve' },
      { texto: 'No tocarlo: esa luz no es natural', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'altar_chatarra',
    peso: 2,
    narracion: 'Alguien ha levantado aquí abajo un pequeño altar con desechos: una pantalla rota que aún parpadea, flores de plástico, fotos descoloridas de gente que ya nadie recuerda. Hay ofrendas, y algunas valen. Tomarlas sería robarle a los muertos su única compañía.',
    opciones: [
      { texto: 'Llevarte las ofrendas de valor', tono:'VENAL', alerta:3, botin:true },
      { texto: 'Coger solo lo que no sea ofrenda', tono:'HONESTO', alerta:1, botin:true, botinReducido:true },
      { texto: 'Dejar una de tus raciones y seguir', tono:'EMPATICO', requiere:'racion_deshidratada', gasta:{ racion_deshidratada:1 }, alerta:-4, botin:false },
      { texto: 'Pasar de largo sin tocar nada', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'nina_perdida',
    peso: 2,
    narracion: 'Una cría no tendrá ni diez años, te corta el paso sin miedo. «Sé dónde hay metal del bueno. Mi hermano lo guardaba antes de que se lo llevaran.» Señala una grieta demasiado estrecha para ti, justa para ella. Te mide con unos ojos que ya han aprendido a regatear.',
    opciones: [
      { texto: 'Pagarle por entrar a sacarlo', tono:'EMPATICO', alerta:1, botin:true, multa:25 },
      { texto: 'Mandarla a por ello sin pagar por adelantado', tono:'FRIO', alerta:4, botin:true, botinReducido:true, probExito:0.6 },
      { texto: 'Darle comida en vez de créditos', tono:'EMPATICO', requiere:'racion_deshidratada', gasta:{ racion_deshidratada:1 }, alerta:-2, botin:true, botinReducido:true },
      { texto: 'No mezclar a una cría en esto', tono:'HONESTO', alerta:0, botin:false }
    ]
  },
  {
    id: 'dron_caido',
    peso: 2,
    narracion: 'Un dron de vigilancia de HELIX yace boca abajo en un charco, con una luz aún latiéndole en el vientre. Está muerto, o casi. Lleva encima componentes que cuestan más que tu alquiler de un mes, pero esa luz dice que alguien podría seguir mirando por sus ojos.',
    opciones: [
      { texto: 'Desactivarlo limpio con el analizador', tono:'FRIO', requiere:'analizador', gasta:{ carga_analizador:1 }, alerta:3, botin:true },
      { texto: 'Destriparlo deprisa antes de que reviva', tono:'VENAL', alerta:14, botin:true, probExito:0.7 },
      { texto: 'Reventarle la óptica de un golpe y luego saquear', tono:'VIOLENTO', requiere:'arma_blanca', alerta:8, botin:true, botinReducido:true },
      { texto: 'No tocar nada de HELIX que aún respire', tono:'EVASIVO', alerta:0, botin:false }
    ]
  },
  {
    id: 'companero_herido',
    peso: 2,
    narracion: 'Otro carroñero está caído contra una tubería, con la pierna partida en un ángulo imposible y un hueso asomando, blanco, por la tela empapada del pantalón. Ha dejado de gritar hace rato; ahora solo respira a tragos. No te amenaza, ya no le quedan fuerzas. «Llévate mi saco», jadea entre dientes apretados. «Pesa, pero yo de aquí no salgo. Solo... dile a alguien que estuve.» El saco está lleno. Su cara, ya casi vacía.',
    opciones: [
      { texto: 'Coger el saco y dejarlo ahí', tono:'VENAL', alerta:2, botin:true },
      { texto: 'Compartir el saco y ayudarle a salir', tono:'EMPATICO', alerta:6, botin:true, botinReducido:true },
      { texto: 'Darle algo para el dolor antes de irte', tono:'EMPATICO', requiere:'licor', gasta:{ licor:1 }, alerta:0, botin:true, botinReducido:true },
      { texto: 'No puedes cargar con su muerte ni su saco', tono:'HONESTO', alerta:0, botin:false }
    ]
  }
];

// ============================================================
// MOTOR DE ESTADO DE RUN
// ============================================================

// ¿Está disponible una zona? (no bloqueada, o cumple requisito).
function zonaDisponible(idZona){
  const z = ZONAS_EXPEDICION[idZona];
  if(!z) return false;
  if(!z.bloqueada) return true;
  const req = z.requisito;
  if(!req) return false;
  if(req.tipo === 'llave'){
    return (typeof tieneItem === 'function') ? tieneItem(req.id) : false;
  }
  if(req.tipo === 'rango'){
    // Comparar por ÍNDICE de rango (est.rango es un número 0..5), no por
    // texto. Mapeamos el nombre de rango requerido a su índice en la
    // profesión y comprobamos que el jugador lo alcanza o supera.
    if(typeof estadoProfesion !== 'function') return false;
    const est = estadoProfesion('scavenger');
    if(!est || !est.activa) return false;
    const idxReq = _refIndiceRango(req.rango);
    if(idxReq < 0) return false;
    return (est.rango || 0) >= idxReq;
  }
  return false;
}

// Devuelve el índice del rango del scavenger cuyo nombre coincide (sin
// distinguir mayúsculas/acentos), o -1 si no se encuentra. Usa una tabla
// fija para no depender del orden de carga de PROFESIONES.
function _refIndiceRango(nombreRango){
  const norm = (s) => String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Orden oficial de rangos del scavenger (debe coincidir con 51_profesiones).
  const RANGOS_SCAVENGER = [
    'rastreador', 'carronero', 'buzo de chatarra',
    'desguazador', 'recuperador', 'arqueotecnico'
  ];
  // Si PROFESIONES está disponible, preferimos su lista real.
  let lista = RANGOS_SCAVENGER;
  try {
    if(typeof PROFESIONES !== 'undefined'){
      const prof = PROFESIONES.find(p => p.id === 'scavenger');
      if(prof && Array.isArray(prof.rangos)) lista = prof.rangos.map(r => norm(r.nombre));
    }
  } catch(e){}
  const objetivo = norm(nombreRango);
  return lista.findIndex(r => norm(r).includes(objetivo) || objetivo.includes(norm(r)));
}

// Inicia una run en la zona dada. Copia el equipo elegido a la run.
// 'equipoMochila' es un objeto { id: cantidad/true } con lo que se lleva.
// Devuelve el estado de la run o null si la zona no está disponible.
function iniciarExpedicion(idZona, equipoMochila){
  const z = ZONAS_EXPEDICION[idZona];
  if(!z) return null;
  if(!zonaDisponible(idZona)) return null;
  const nEventos = z.eventosMin + Math.floor(Math.random() * (z.eventosMax - z.eventosMin + 1));
  Estado.expedicion = {
    activa: true,
    zona: idZona,
    alerta: z.alertaInicial || 0,
    eventoActual: 0,
    eventosMax: nEventos,
    botinBruto: { creditos: 0, items: [] },
    equipoEnUso: Object.assign({}, equipoMochila || {}),
    condicionesPendientes: [],
    historial: []
  };
  return Estado.expedicion;
}

// v0.95.1: "Salir a buscar chatarra" ES la expedición. Al cerrar una run
// (de cualquier forma) marcamos el cooldown de la acción 'buscar' del
// Scavenger, para que no se puedan encadenar expediciones sin descanso.
function _expMarcarCooldownBuscar(){
  try {
    if(typeof estadoProfesion !== 'function') return;
    const est = estadoProfesion('scavenger');
    if(!est) return;
    const ahora = (typeof _ahoraJuegoMs === 'function') ? _ahoraJuegoMs()
                 : (typeof window._ahoraJuegoMs === 'function' ? window._ahoraJuegoMs() : Date.now());
    if(!est.cooldownAcciones || typeof est.cooldownAcciones !== 'object') est.cooldownAcciones = {};
    est.cooldownAcciones['buscar'] = ahora;
    if(typeof guardarPartida === 'function') guardarPartida();
  } catch(e){ /* sin bloquear el cierre de la expedición */ }
}

// ¿Hay una run activa?
function expedicionActiva(){
  return !!(Estado.expedicion && Estado.expedicion.activa);
}

// Genera el siguiente evento de la run, ponderando por alerta: a más
// alerta, más probabilidad de eventos peligrosos (patrulla, encuentro).
// Devuelve el evento (con sus opciones FILTRADAS por el equipo en uso)
// o null si la run ya agotó sus eventos.
function siguienteEventoExpedicion(){
  const run = Estado.expedicion;
  if(!run || !run.activa) return null;
  if(run.eventoActual >= run.eventosMax) return null;

  // Ponderar: la alerta alta empuja hacia patrulla/encuentro.
  const lista = EVENTOS_EXPEDICION.map(ev => {
    let peso = ev.peso || 1;
    if((ev.id === 'patrulla' || ev.id === 'encuentro')){
      peso += Math.floor((run.alerta || 0) / 20); // +1 por cada 20 de alerta
    }
    return Object.assign({}, ev, { peso });
  });
  const elegido = _expElegirPonderado(lista);
  if(!elegido) return null;

  // Filtrar opciones: si una 'requiere' equipo que no llevas, se cae.
  // (v0.92) Además, 'requiereItem'/'vetaItem' filtran por el inventario
  // REAL del jugador (catálogo), no por el equipo de la run.
  const opcionesDisponibles = (elegido.opciones || []).filter(op => {
    if(op.requiere && !_expTieneEquipo(op.requiere)) return false;
    if(op.requiereItem && !(typeof tieneItem==='function' && tieneItem(op.requiereItem))) return false;
    if(op.vetaItem && (typeof tieneItem==='function' && tieneItem(op.vetaItem))) return false;
    return true;
  });

  return Object.assign({}, elegido, { opciones: opcionesDisponibles });
}

// ¿La run lleva equipo utilizable de este id? (cantidad > 0 o true).
function _expTieneEquipo(id){
  const eq = (Estado.expedicion && Estado.expedicion.equipoEnUso) || {};
  const v = eq[id];
  if(v === true) return true;
  return (typeof v === 'number' && v > 0);
}

// Resuelve la opción elegida de un evento: ajusta alerta, concede botín,
// gasta recursos, aplica heridas y multas. Devuelve un resumen para que
// la UI lo muestre. NO avanza el evento por sí solo (lo hace el caller
// según el jugador decida continuar o retirarse), pero sí incrementa el
// contador de evento actual.
function resolverOpcionExpedicion(evento, opcion){
  const run = Estado.expedicion;
  if(!run || !run.activa || !opcion) return null;
  const z = ZONAS_EXPEDICION[run.zona];
  const resumen = { texto:'', botin:null, alerta:0, herida:null, multa:0, fallo:false };

  // 1) Tirada de éxito si la opción la tiene.
  let exito = true;
  if(typeof opcion.probExito === 'number'){
    exito = Math.random() < opcion.probExito;
  }
  resumen.fallo = !exito;

  // 2) Gasto de recursos (se gasta intente o no, salvo que falle por falta).
  if(opcion.gasta && typeof opcion.gasta === 'object'){
    for(const id in opcion.gasta){
      _expGastarEquipo(id, opcion.gasta[id]);
    }
  }

  // 3) Alerta. Si falla una opción ruidosa, sube un poco más.
  let dAlerta = opcion.alerta || 0;
  if(!exito && dAlerta > 0) dAlerta += 6;
  run.alerta = Math.max(0, Math.min(100, (run.alerta || 0) + dAlerta));
  resumen.alerta = dAlerta;

  // 4) Botín (solo si la opción lo concede y la tirada sale bien).
  if(opcion.botin && exito){
    const botin = _expTirarBotin(z, opcion.botinReducido);
    _expSumarBotinBruto(botin);
    resumen.botin = botin;
  }
  // 4b) Item FIJO concedido por la opción (v0.92): un id concreto del
  // catálogo (p.ej. un raro), independiente de la tabla de la zona. Se
  // suma al botín bruto para materializarse al extraer, como el resto.
  if(opcion.itemFijo && exito){
    const fijo = { creditos:0, items:[{ id: opcion.itemFijo.id, cantidad: opcion.itemFijo.cant || 1 }] };
    _expSumarBotinBruto(fijo);
    if(!resumen.botin) resumen.botin = { creditos:0, items:[] };
    resumen.botin.items = (resumen.botin.items || []).concat(fijo.items);
  }

  // 5) Herida probabilística (si falla y la opción puede herir).
  if(opcion.herida && !exito){
    run.condicionesPendientes.push(opcion.herida);
    resumen.herida = opcion.herida;
  }

  // 6) Multa HELIX pendiente (se materializa al extraer, no ahora).
  if(opcion.multa && exito){
    resumen.multa = opcion.multa;
    run.multaPendiente = (run.multaPendiente || 0) + opcion.multa;
  }

  // 7) Avanzar contador + sumar alerta de fondo por evento de zona.
  run.eventoActual += 1;
  if(z && z.alertaPorEvento){
    run.alerta = Math.max(0, Math.min(100, run.alerta + z.alertaPorEvento));
  }
  // COSTE DE TIEMPO (v0.86.8): cada tramo de expedición consume tiempo de
  // juego como una escena normal (50-70 min). Una run larga puede cruzar
  // medianoche y disparar el cobro del alquiler, que corre por su cuenta.
  // Así alargar la incursión no solo sube la alerta: también te come el día.
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  if(typeof comprobarCobrosDiarios === 'function') comprobarCobrosDiarios();
  run.historial.push({ evento: evento && evento.id, opcion: opcion.texto, exito });

  resumen.texto = exito ? 'Sale bien.' : 'Sale mal.';
  resumen.alertaActual = run.alerta;
  resumen.eventoActual = run.eventoActual;
  resumen.eventosMax = run.eventosMax;
  return resumen;
}

// Gasta 'cant' unidades de un recurso del equipo de la run.
function _expGastarEquipo(id, cant){
  const run = Estado.expedicion;
  if(!run || !run.equipoEnUso) return;
  const eq = run.equipoEnUso;
  if(typeof eq[id] === 'number'){
    eq[id] = Math.max(0, eq[id] - (cant || 1));
  }
  // Si era 'true' (equipo no consumible, p.ej. arma), no se descuenta.
}

// Tira el botín de la tabla de la zona. 'reducido' recorta cantidades.
function _expTirarBotin(zona, reducido){
  if(!zona || !Array.isArray(zona.tablaBotin)) return { creditos:0, items:[] };
  const fila = _expElegirPonderado(zona.tablaBotin);
  if(!fila) return { creditos:0, items:[] };
  const rng = (par) => {
    if(!Array.isArray(par)) return par || 0;
    const [a, b] = par;
    return a + Math.floor(Math.random() * (b - a + 1));
  };
  let creditos = rng(fila.creditos);
  const items = (fila.items || []).map(it => ({ id: it.id, cantidad: rng(it.cant) }));
  if(reducido){
    creditos = Math.floor(creditos * 0.5);
    items.forEach(it => { it.cantidad = Math.max(1, Math.floor(it.cantidad * 0.5)); });
  }
  return { creditos, items };
}

// Suma un botín al bruto acumulado de la run (no toca el inventario aún).
function _expSumarBotinBruto(botin){
  const run = Estado.expedicion;
  if(!run || !botin) return;
  run.botinBruto.creditos += (botin.creditos || 0);
  (botin.items || []).forEach(nuevo => {
    const ya = run.botinBruto.items.find(x => x.id === nuevo.id);
    if(ya) ya.cantidad += nuevo.cantidad;
    else run.botinBruto.items.push({ id: nuevo.id, cantidad: nuevo.cantidad });
  });
}

// ¿Lleva el jugador un item de rescate en la run? (kit_trauma).
function _expLlevaRescate(){
  const eq = (Estado.expedicion && Estado.expedicion.equipoEnUso) || {};
  const v = eq['kit_trauma'];
  return (v === true) || (typeof v === 'number' && v > 0);
}

// Consume un item de rescate de la run (al usarlo para sobrevivir).
function _expGastarRescate(){
  const run = Estado.expedicion;
  if(!run || !run.equipoEnUso) return;
  const eq = run.equipoEnUso;
  if(typeof eq['kit_trauma'] === 'number') eq['kit_trauma'] = Math.max(0, eq['kit_trauma'] - 1);
  else if(eq['kit_trauma'] === true) delete eq['kit_trauma'];
}

// RESCATE: el jugador iba a caer, pero el kit_trauma lo salva una vez.
// Consume el kit, marca la run para que el desenlace cuente que sobrevive
// MALHERIDO, y pierde el botín bruto. No materializa nada salvo la herida
// grave. Devuelve true si hubo rescate (había kit), false si no.
function rescatarExpedicion(){
  const run = Estado.expedicion;
  if(!run || !run.activa) return false;
  if(!_expLlevaRescate()) return false;
  _expGastarRescate();
  // Herida grave por el golpe que casi te mata.
  if(typeof aplicarCondicion === 'function') aplicarCondicion('pierna_herida_grave');
  // Se pierde el botín bruto entero (sobrevives, pero con las manos vacías).
  run.activa = false;
  Estado.expedicion = null;
  _expMarcarCooldownBuscar();
  return true;
}

// ¿Toca un evento de captura? Probabilidad creciente con la alerta.
// A 100 de alerta, casi seguro. Devuelve true si capturan al jugador.
function _expComprobarCaptura(){
  const run = Estado.expedicion;
  if(!run) return false;
  const a = run.alerta || 0;
  if(a < 60) return false;              // por debajo de 60, sin captura
  const prob = (a - 60) / 40;           // 60→0% ... 100→100%
  return Math.random() < prob;
}

// EXTRAER: el jugador se retira vivo. Vuelca el botín bruto al inventario
// real, materializa heridas y multas, y cierra la run. Devuelve el botín
// entregado para que la UI lo muestre.
function extraerExpedicion(){
  const run = Estado.expedicion;
  if(!run || !run.activa) return null;
  const entregado = { creditos: run.botinBruto.creditos || 0, items: [] };

  // Créditos.
  if(entregado.creditos > 0 && typeof ajustarCreditos === 'function'){
    ajustarCreditos(entregado.creditos);
  }
  // Items al inventario.
  (run.botinBruto.items || []).forEach(it => {
    if(typeof darItemPorId === 'function'){
      for(let i = 0; i < it.cantidad; i++) darItemPorId(it.id);
    }
    entregado.items.push({ id: it.id, cantidad: it.cantidad });
  });
  // Heridas sufridas en la run.
  (run.condicionesPendientes || []).forEach(cid => {
    if(typeof aplicarCondicion === 'function') aplicarCondicion(cid);
  });
  // Multas HELIX acumuladas (sellos rotos).
  if(run.multaPendiente && typeof _multaHelix === 'function'){
    _multaHelix(run.multaPendiente, 'SELLO HELIX FORZADO');
  }

  run.activa = false;
  Estado.expedicion = null;
  _expMarcarCooldownBuscar();
  return entregado;
}

// RUN FALLIDA (captura): se pierde un % del botín bruto y se cierra la
// run. No materializa nada salvo heridas. Devuelve lo perdido para la UI.
function fallarExpedicion(porcentajePerdida){
  const run = Estado.expedicion;
  if(!run || !run.activa) return null;
  const p = (typeof porcentajePerdida === 'number') ? porcentajePerdida : 0.6;
  // Aún entrega la parte NO perdida del bruto (estilo "te escapas con algo").
  const quedan = { creditos: Math.floor((run.botinBruto.creditos || 0) * (1 - p)), items: [] };
  if(quedan.creditos > 0 && typeof ajustarCreditos === 'function'){
    ajustarCreditos(quedan.creditos);
  }
  (run.botinBruto.items || []).forEach(it => {
    const c = Math.floor(it.cantidad * (1 - p));
    if(c > 0 && typeof darItemPorId === 'function'){
      for(let i = 0; i < c; i++) darItemPorId(it.id);
      quedan.items.push({ id: it.id, cantidad: c });
    }
  });
  (run.condicionesPendientes || []).forEach(cid => {
    if(typeof aplicarCondicion === 'function') aplicarCondicion(cid);
  });
  run.activa = false;
  Estado.expedicion = null;
  _expMarcarCooldownBuscar();
  return quedan;
}

// ── Exponer al resto del juego ──────────────────────────────
window.ZONAS_EXPEDICION = ZONAS_EXPEDICION;
window.EVENTOS_EXPEDICION = EVENTOS_EXPEDICION;
window.zonaDisponible = zonaDisponible;
window.iniciarExpedicion = iniciarExpedicion;
window.expedicionActiva = expedicionActiva;
window.siguienteEventoExpedicion = siguienteEventoExpedicion;
window.resolverOpcionExpedicion = resolverOpcionExpedicion;
window.extraerExpedicion = extraerExpedicion;
window.fallarExpedicion = fallarExpedicion;
window._expComprobarCaptura = _expComprobarCaptura;
window.rescatarExpedicion = rescatarExpedicion;
window._expLlevaRescate = _expLlevaRescate;
