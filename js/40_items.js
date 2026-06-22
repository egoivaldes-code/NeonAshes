// ============================================================
// BLOQUE JS-52 — INVENTARIO / ITEMS
// ------------------------------------------------------------
// Para qué sirve:
//   Guardar los objetos que el jugador recoge (en el viaje, en
//   el mercado futuro, en misiones). Por ahora son "objetos de
//   contexto": no se usan mecánicamente todavía, pero quedan
//   guardados con nombre y descripción para misiones futuras y
//   para que la IA los "vea" y pueda aludir a ellos.
//
// Cómo se guarda:
//   Estado.inventario = [
//     { id:'chip_datos_x', nombre:'Chip de datos sin carcasa',
//       desc:'...', tipo:'dato', cantidad:1 }
//   ]
//
// Nota: Estado.inventario ya se inicializa y se persiste en otros
// módulos (16_hud, 07_persistencia, 34_reiniciar). Aquí solo
// añadimos la lógica para manipularlo y mostrarlo.
// ============================================================

function _asegurarInventario(){
  if(!Array.isArray(Estado.inventario)) Estado.inventario = [];
}

// Añade un item. Si ya existe uno con el mismo id, suma cantidad.
// item = { id, nombre, desc, tipo }  (cantidad opcional, por defecto 1)
function darItem(item){
  _asegurarInventario();
  if(!item || !item.id || !item.nombre) return false;
  const existente = Estado.inventario.find(i => i.id === item.id);
  if(existente){
    existente.cantidad = (existente.cantidad || 1) + (item.cantidad || 1);
  } else {
    Estado.inventario.push({
      id: item.id,
      nombre: item.nombre,
      desc: item.desc || '',
      tipo: item.tipo || 'objeto',
      cantidad: item.cantidad || 1
    });
  }
  if(typeof notificarCambio === 'function'){
    notificarCambio('OBJETO · ' + item.nombre, 'creditos');
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  return true;
}

// Quita una unidad (o el item entero si llega a 0).
function quitarItem(id, cantidad){
  _asegurarInventario();
  const it = Estado.inventario.find(i => i.id === id);
  if(!it) return false;
  it.cantidad = (it.cantidad || 1) - (cantidad || 1);
  if(it.cantidad <= 0){
    Estado.inventario = Estado.inventario.filter(i => i.id !== id);
  }
  if(typeof guardarPartida === 'function') guardarPartida();
  return true;
}

function tieneItem(id){
  _asegurarInventario();
  return Estado.inventario.some(i => i.id === id);
}

// Texto para que la IA conozca lo que el jugador lleva encima.
function describirInventarioParaIA(){
  _asegurarInventario();
  if(Estado.inventario.length === 0) return '';
  const lineas = Estado.inventario.map(i => {
    const cant = (i.cantidad && i.cantidad > 1) ? ` (x${i.cantidad})` : '';
    return `- ${i.nombre}${cant}: ${i.desc}`;
  });
  return [
    'OBJETOS QUE EL JUGADOR LLEVA ENCIMA (puedes aludir a ellos si',
    'encaja, NUNCA inventes que los pierde o los usa por su cuenta):',
    lineas.join('\n')
  ].join('\n');
}

// Render para el panel ESTADO.
function renderInventario(){
  _asegurarInventario();
  if(Estado.inventario.length === 0){
    return `<div class="estado-inv-vacio">Los bolsillos vacíos. Como casi siempre.</div>`;
  }
  return Estado.inventario.map(i => {
    const cant = (i.cantidad && i.cantidad > 1) ? `<span class="estado-inv-cant">x${i.cantidad}</span>` : '';
    // Condición de desgaste para armas (la calcula el motor de corridas).
    let cond = '';
    if(typeof estadoDesgasteArma === 'function'){
      const e = estadoDesgasteArma(i.id);
      if(e === 'gastada') cond = ` <span class="estado-inv-cond">· gastada</span>`;
      else if(e === 'comprometida') cond = ` <span class="estado-inv-cond estado-inv-cond-mal">· comprometida</span>`;
    }
    return `
      <div class="estado-inv-fila">
        <div class="estado-inv-nombre">${i.nombre}${cant}${cond}</div>
        ${i.desc ? `<div class="estado-inv-desc">${i.desc}</div>` : ''}
      </div>`;
  }).join('');
}

// Catálogo de objetos que el viaje "Explorar la ciudad" puede soltar.
// Son objetos de sabor + contexto para misiones futuras.
const ITEMS_EXPLORAR = [
  // CHATARRA — material apilable. A diferencia de los objetos de sabor,
  // la chatarra se acumula (x2, x3...) y es la materia prima que el
  // Scavenger refina al "Procesar chatarra". Se consigue explorando,
  // como pequeño consuelo cuando un registro no da nada de valor.
  { id:'chatarra', nombre:'Chatarra', tipo:'material',
    desc:'Metal retorcido, cable, plástico quemado. No vale nada tal cual, pero alguien con paciencia podría sacarle unos créditos.' },

  { id:'chip_datos_corrupto', nombre:'Chip de datos corrupto', tipo:'dato',
    desc:'Medio ilegible. Alguien lo tiró con prisas. Tal vez Cero-Ocho pueda leerlo.' },
  { id:'placa_sindicato', nombre:'Placa del Sindicato Ferro', tipo:'documento',
    desc:'Identificación de un trabajador. El nombre está raspado. Pesa más de lo que debería.' },
  { id:'estimulante_barato', nombre:'Estimulante de calle', tipo:'consumible',
    desc:'Un inyector de un solo uso. Mercado negro. Quita el cansancio. Por un rato.' },
  { id:'llave_magnetica', nombre:'Llave magnética sin marcar', tipo:'llave',
    desc:'No sabes qué abre. Pero alguien la escondió bien antes de morir.' },
  { id:'foto_quemada', nombre:'Fotografía a medio quemar', tipo:'recuerdo',
    desc:'Dos personas que no reconoces. Una de las caras es casi la tuya. Casi.' },
  { id:'creditos_sucios', nombre:'Fajo de créditos físicos', tipo:'dinero',
    desc:'Dinero en efectivo, algo que ya casi nadie usa. Manchado. No preguntas de qué.' },
  { id:'analgesico_helix', nombre:'Analgésico HELIX caducado', tipo:'consumible',
    desc:'Sello médico oficial. Caducado. Calma el dolor de una herida. Una vez.' },
  { id:'navaja_ceramica', nombre:'Navaja de cerámica', tipo:'arma',
    desc:'No la detectan los escáneres. Filo gastado pero suficiente. Pesa poco.' },
  { id:'papel_codigo', nombre:'Papel mojado con un código', tipo:'dato',
    desc:'Un código y la hélice de HELIX tachada. Alguien quería que lo tuvieras tú.' },

  // ── Cadena de lore "Lo que quedó arriba" (vida fuera de la Tierra) ──
  { id:'manifiesto_io', nombre:'Manifiesto de carga de Ío', tipo:'recuerdo',
    desc:'Una lista de cargamento de hace décadas. Refinería 7, órbita de Ío. Los nombres de la tripulación siguen ahí, escritos a mano.' },
  { id:'semilla_hidroponia', nombre:'Sobre de semillas viejas', tipo:'recuerdo',
    desc:'Trigo enano, modificado para crecer sin gravedad. En el sobre, una huerta de un cilindro que ya no existe. Aún huele a tierra.' },
  { id:'ficha_minera', nombre:'Ficha de un minero del Cinturón', tipo:'recuerdo',
    desc:'Identificación de una roca minera. Cuota cumplida: 11 años. Cuota pendiente: la que nunca dejaron de deber.' },
  { id:'dossier_marte', nombre:'Dossier sellado de Marte', tipo:'dato',
    desc:'Documentos de la megaciudad marciana. Mitad censurados. Lo que se lee no explica por qué la gente dejó de volver.' },
  { id:'baliza_orbita_muerta', nombre:'Baliza de la órbita muerta', tipo:'recuerdo',
    desc:'Un transmisor apagado de una estación abandonada. Guarda la última voz que se grabó allí arriba. No te atreves a borrarla.' },

  // ── Recompensas finales de las cadenas de facción ──
  { id:'sello_ferro', nombre:'Sello de hierro del Ferro', tipo:'recuerdo',
    desc:'Una ficha de fundición con la marca de Don Vasek. No se compra ni se roba: se gana. En el Distrito Ferro, esto es una puerta abierta y una deuda saldada.' },
  { id:'llave_loto', nombre:'Llave del Loto', tipo:'recuerdo',
    desc:'Una pequeña flor de loto de laca roja. Quien la lleva tiene reservado en cualquier casa del Carmesí, y oídos en todas ellas. El Loto te debe un secreto, para variar.' },
  { id:'reliquia_carne', nombre:'Reliquia de la Carne Perfecta', tipo:'recuerdo',
    desc:'Un fragmento de implante bendecido por el Culto, tibio al tacto sin razón. Para los fieles del Santuario, llevarla es ser de los suyos. Para ti, un peso que zumba bajo.' },
  { id:'clave_colectivo', nombre:'Clave del Colectivo', tipo:'dato',
    desc:'Una credencial cifrada del Nodo Fantasma. Te abre puertas en la red que HELIX cree cerradas. El Colectivo confía en ti; eso, hoy, vale más que créditos.' }
];

// ============================================================
// CATÁLOGO DE EXPEDICIÓN (v0.86.4 — capa 1 del loop Scavenger)
// ------------------------------------------------------------
// Estos objetos son la materia prima del futuro loop de expedición
// (preparar equipo → zona → expedición → refinar → vender). A día de
// hoy son CÁSCARAS: están definidos con su nombre, descripción y tipo,
// pero todavía NO tienen lógica de consumo (curar, disparar, bajar la
// alerta, etc.). Esa lógica se colgará en capas siguientes.
//
// IMPORTANTE: este catálogo va APARTE de ITEMS_EXPLORAR a propósito.
// No deben salir como loot aleatorio del paseo por la ciudad. Se
// conseguirán comprando, looteando en expedición o como recompensa.
//
// Campos:
//   id, nombre, tipo, desc  — igual que el resto de items.
//   apilable                — true si se acumulan (x2, x3...); las
//                             baterías y consumibles repetibles lo son.
//   usos                    — (informativo, sin lógica aún) cuántos
//                             usos tiene el objeto antes de gastarse.
// ============================================================
const ITEMS_EXPEDICION = [

  // ── RESCATE / SALUD ──────────────────────────────────────
  { id:'kit_trauma', nombre:'Kit de trauma', tipo:'rescate', usos:1, apilable:false,
    desc:'Un parche de campo de los caros: sellante, torniquete inteligente, un chute que no preguntas qué es. Cuando todo se va al infierno, esto te saca una vez. Solo una.' },
  { id:'medkit', nombre:'Medkit', tipo:'consumible', usos:1, apilable:false,
    desc:'Caja blanca con la hélice borrada. Cierra heridas y calma el dolor lo justo para seguir. Un solo uso: después es plástico vacío.' },

  // ── MUNICIÓN ─────────────────────────────────────────────
  { id:'cargador', nombre:'Cargador', tipo:'municion', usos:6, apilable:true,
    desc:'Seis disparos. En las Pilas, seis es mucho y es nada a la vez. Pesa poco hasta que lo necesitas.' },
  { id:'municion', nombre:'Munición', tipo:'municion', apilable:true,
    desc:'Un perno metálico con la base de latón reutilizada. Una bala, un disparo. Se cuentan de una en una y nunca sobran.' },

  // ── CONSUMIBLES ──────────────────────────────────────────
  { id:'racion_deshidratada', nombre:'Ración deshidratada', tipo:'comida', usos:1, apilable:true,
    desc:'Un sobre que infla en agua y finge ser comida. Sabe a cartón con sal. Pero llena, y aquí abajo eso ya es un lujo.' },
  { id:'licor', nombre:'Licor', tipo:'consumible', usos:1, apilable:true,
    desc:'Botella sin etiqueta. Nunca se sabe de qué es. Quema al bajar, calienta un rato, y a veces es lo único que hay entre tú y el frío.' },
  { id:'bateria_2v', nombre:'Batería 2V', tipo:'bateria', apilable:true,
    desc:'Celda pequeña, carga corta. Para chismes de poca monta: una linterna, un descodificador barato. Se agota antes de que te fíes de ella.' },
  { id:'bateria_4v', nombre:'Batería 4V', tipo:'bateria', apilable:true,
    desc:'Carga media. El estándar de la calle: la usa medio aparato de las Pilas. Ni buena ni mala, simplemente está.' },
  { id:'bateria_8v', nombre:'Batería 8V', tipo:'bateria', apilable:true,
    desc:'Celda gruesa, carga seria. Mueve cosas que importan: una herramienta pesada, un implante exigente. Cara, y se nota que lo es.' },
  { id:'palanca_termica', nombre:'Palanca térmica', tipo:'herramienta', apilable:false,
    desc:'Barra corta que calienta la punta hasta el rojo. Funde cerrojos, cede bisagras, abre lo que la ciudad quiere cerrado. Hace ruido y huele a metal quemado.' },
  { id:'senuelo', nombre:'Señuelo', tipo:'utilidad', usos:1, apilable:true,
    desc:'Un emisor del tamaño de un mechero. Lanza ruido y firma falsa a unos metros para que la atención mire a otro lado. Un solo uso, y reza por que cuele.' },

  // ── EQUIPO DE EXPEDICIÓN (del documento de diseño, capa 2) ────
  // Equipo que abre RUTAS en los eventos de la expedición. Ninguno es
  // obligatorio: cada uno compra opciones, no victorias. Sin lógica aún.
  { id:'arma_blanca', nombre:'Cuchillo de monofilo', tipo:'equipo', apilable:false,
    desc:'Hoja de un átomo de grosor, mango envuelto en cinta. Resuelve un mal encuentro de cerca y sin ruido. Lo que no perdona es la duda.' },
  { id:'arma_fuego', nombre:'Pistola de raíl casera', tipo:'equipo', apilable:false,
    desc:'Soldada en algún taller del Ferro. Escupe un perno metálico con un chasquido seco que se oye a tres pasillos. Cada disparo gasta munición y atrae miradas.' },
  { id:'arma_fuego_regl', nombre:'Pistola de raíl reglamentaria', tipo:'equipo', apilable:false,
    desc:'Material de seguridad corporativa con la hélice lijada. Mejor calibrada que cualquier chapuza de taller: pega más fuerte y traga dos pernos por disparo. La fiabilidad de HELIX, de segunda mano.' },
  { id:'arma_fuego_canon', nombre:'Cañón de mano del Ferro', tipo:'equipo', apilable:false,
    desc:'Un bloque de acero del Ferro que escupe tres pernos a la vez con un trueno que vacía el callejón. Lo que le falta en precisión le sobra en daño. Caro de alimentar, imposible de ignorar.' },
  { id:'analizador', nombre:'Analizador portátil', tipo:'equipo', apilable:false,
    desc:'Una caja con pantalla rota que aún lee lo que toca. Identifica hallazgos sobre la marcha y fuerza cerraduras de datos. Se come las cargas como si fueran agua.' },
  { id:'carga_analizador', nombre:'Célula del analizador', tipo:'consumible', usos:1, apilable:true,
    desc:'Pila plana para el analizador. Una carga, un puñado de segundos de vida útil. Sin ella, el aparato es un pisapapeles caro.' },
  { id:'ganzua', nombre:'Set de ganzúas', tipo:'consumible', apilable:true,
    desc:'Varillas finas en una funda de cuero gastado. Abren cerraduras físicas sin romper el sello, así que sin multa. A veces una se parte dentro y te deja con cara de tonto.' },
  { id:'mascara_filtro', nombre:'Máscara de filtro', tipo:'equipo', apilable:false,
    desc:'Goma vieja y dos cartuchos que silban al respirar. En los pozos y canales tóxicos es la diferencia entre rebuscar tranquilo y escupir sangre.' },

  // ── ARMADURAS (capa de corrida) ──────────────────────────────
  // Reducen el daño que recibes por golpe en combate. Se desgastan con
  // los impactos, como las armas. Lore: ropa funcional de Las Pilas,
  // nada de cota de malla. Solo una equipada a la vez (la mejor que lleves).
  { id:'chaqueta_kevlar', nombre:'Chaqueta de kevlar sintético', tipo:'armadura', apilable:false,
    reduccion:1, aguante:10,
    desc:'Tejido de aramida cosido a mano, con remiendos sobre remiendos. Para un golpe de navaja o amortigua un perno. No es mucho, pero entre algo y nada, va un cuerpo.' },
  { id:'placa_helix', nombre:'Placa balística HELIX', tipo:'armadura', apilable:false,
    reduccion:2, aguante:14,
    desc:'Inserto de cerámica con la hélice medio lijada, sacado de un chaleco de seguridad corporativo. Pesa y delata, pero para un disparo que te habría tumbado. Segunda mano, como todo aquí.' },
  { id:'abrigo_trapero', nombre:'Abrigo de trapero reforzado', tipo:'armadura', apilable:false,
    reduccion:1, aguante:12, sigilo:true,
    desc:'Capas de lona, cuero y forro robado, pesado como una culpa. Para algún golpe y, sobre todo, te hace uno más entre los miles de don nadies de las Pilas. Pasar desapercibido también es una coraza.' },

  // ── CONSUMIBLES DE COMBATE (capa de corrida) ─────────────────
  // De un solo uso, se gastan dentro de una corrida. Distintos del kit
  // de trauma (que solo cura): estos dan ventajas tácticas.
  { id:'estimulante', nombre:'Estimulante de combate', tipo:'consumible', usos:1, apilable:true,
    desc:'Autoinyector con un cóctel que el cuerpo agradece y luego cobra. Durante unos segundos pegas más fuerte y no sientes el miedo. Después, el bajón.' },
  { id:'adrenalina', nombre:'Parche de adrenalina', tipo:'consumible', usos:1, apilable:true,
    desc:'Se pega en el cuello y descarga de golpe. Cierra un poco la herida y te pone en pie al instante, te despeja el aturdimiento, pero deja el pulso temblón un rato. Remiendo de urgencia, no cura.' },
  { id:'vendaje', nombre:'Vendaje compresor', tipo:'consumible', usos:1, apilable:true,
    desc:'Tira elástica con coagulante en la cara interna. Aprietas, giras, y la hemorragia se para. No cierra la herida del todo, pero te deja de vaciar por dentro. Material de taller, fácil de improvisar.' },
  { id:'inhibidor_dolor', nombre:'Inhibidor de dolor HELIX', tipo:'consumible', usos:1, apilable:true,
    desc:'Ampolla de uso hospitalario desviada del Hospital Público. Apaga el dolor tan a fondo que el próximo golpe ni lo notas. Lo que viene después, sí.' },
  { id:'granada_humo', nombre:'Bote de humo', tipo:'consumible', usos:1, apilable:true,
    desc:'Lata de feria reconvertida. Tiras de la anilla y el callejón desaparece en humo gris. No hiere a nadie, pero te regala la espalda para desaparecer de una pelea.' },

  // ── ÍTEMS DE AVANCE (capa de corrida) ────────────────────────
  // No tocan el combate: cambian cómo resuelves nodos de ruta.
  { id:'mapa_sector', nombre:'Mapa del sector', tipo:'avance', apilable:false,
    desc:'Plano garabateado a mano, vendido por un crío que se lo sabe de memoria. Te dice qué te espera en cada desvío antes de tomarlo. Saber es media huida.' },
  { id:'credencial_falsa', nombre:'Credencial clonada', tipo:'avance', usos:2, apilable:false,
    desc:'Una placa con un número que casi cuadra. Pasa un control si nadie mira dos veces. Dura poco antes de que el sistema la escupa: un par de usos y a tirarla.' },

  // ── CREDENCIAL HELIX (desbloquea la profesión Seguridad) ──────
  // No tiene por qué ser legítima: una placa robada, clonada o heredada
  // sirve igual. Quien la lleve puede ejercer de Seguridad de HELIX.
  { id:'credencial_helix', nombre:'Credencial de HELIX', tipo:'equipo', apilable:false,
    desc:'Una placa con la hélice grabada y un chip que aún responde a los lectores. Da igual si es tuya de verdad: aquí abajo, quien la enseña manda. Con ella puedes patrullar como Seguridad de HELIX. Sin ella, solo eres alguien con prisa.' },

  // ── DOCUMENTACIÓN FALSA (vía social del contrabandista) ───────
  { id:'papel_helix', nombre:'Documentación sellada', tipo:'equipo', apilable:false,
    desc:'Un permiso de tránsito con un sello de HELIX que casi nadie se molesta en verificar. No aguanta un escáner serio, pero a un guardia cansado le basta para mirar a otro lado.' },

  // ── MATERIALES DE BOTÍN (refinado, del documento) ─────────────
  // chatarra_cruda = lo que sale en bruto de la expedición (sin valor
  // directo, hay que refinarla). chatarra_refinada = el producto vendible.
  // El refinado convierte una en otra (lógica en capas siguientes).
  { id:'chatarra_cruda', nombre:'Chatarra en bruto', tipo:'material', apilable:true,
    desc:'Metal retorcido, cable enmarañado, plástico fundido. Tal cual sale de las entrañas de la ciudad. No vale casi nada hasta que alguien la separa con paciencia.' },
  { id:'chatarra_refinada', nombre:'Chatarra refinada', tipo:'material', apilable:true,
    desc:'Lo aprovechable de la chatarra, ya separado y limpio: cobre, contactos, fibra. Esto sí se vende, y bien. El trabajo está en llegar hasta aquí.' },

  // ── HALLAZGOS RAROS (primeros de ejemplo, botín de expedición) ─
  // Objetos con identidad: se venden, se analizan (lore/datos) o se
  // guardan para misiones. Algunos serán llave de zona más adelante.
  { id:'nucleo_optico', nombre:'Núcleo óptico', tipo:'raro', apilable:false,
    desc:'Una esfera de cristal lechoso que guarda luz dentro mucho después de apagarse. Los compradores no preguntan de dónde sale. Pagan, y miran a otro lado.' },
  { id:'servidor_hundido', nombre:'Servidor hundido', tipo:'raro', apilable:false,
    desc:'Bloque de memoria rescatado del fango de un pozo. Pesa, gotea y huele a moho, pero si todavía arranca, lo que tiene dentro vale más que el peso en créditos.' },

  // ── IMPLANTES (estructura reservada, sin items aún) ───────
  // Los implantes serán botín raro de expedición: mejoran stats (fatiga
  // que sube más lenta, % de éxito en ciertas acciones, etc.). Vendrán
  // en cuatro grados: 1, 2, 3 y ESPECIAL. Todavía no se define ninguno
  // concreto: solo dejamos anotada la categoría para clonarlos luego.
  // Tipo previsto: 'implante'. Grado previsto en un campo 'grado'.

  // ── MODS DE ARMA (v0.132) ──────────────────────────────────
  // Mejoras que el Mecánico fabrica y monta en el arma de fuego. En combate,
  // al disparar, tienen una probabilidad de "saltar" que sube con el rango
  // de Mecánico. Solo uno puede estar montado a la vez (Estado.modArma).
  { id:'mod_fragmentada', nombre:'Munición fragmentada', tipo:'mod', apilable:false,
    desc:'Pernos que se abren al impactar. Al disparar, a veces dejan al objetivo sangrando.' },
  { id:'mod_culata', nombre:'Culata de impacto', tipo:'mod', apilable:false,
    desc:'Una culata pesada y reforzada. Al disparar de cerca, a veces deja al objetivo aturdido.' },
  { id:'mod_sobrecarga', nombre:'Sobrecarga de raíl', tipo:'mod', apilable:false,
    desc:'Fuerza el raíl por encima de lo seguro. Al disparar, a veces mete un golpe extra de daño.' }
];

// GRADOS DE IMPLANTE previstos (etiqueta, sin items asociados todavía).
// Sirve de referencia para cuando se creen los implantes concretos.
const GRADOS_IMPLANTE = ['grado_1', 'grado_2', 'grado_3', 'especial'];
window.ITEMS_EXPEDICION = ITEMS_EXPEDICION;
window.GRADOS_IMPLANTE = GRADOS_IMPLANTE;

// Da un item por su id. Busca PRIMERO en el catálogo de explorar y, si
// no está, en el de expedición. Así las escenas de guion y el futuro
// loop pueden entregar cualquier objeto definido por su id.
function darItemPorId(id){
  let it = ITEMS_EXPLORAR.find(x => x.id === id);
  if(!it) it = ITEMS_EXPEDICION.find(x => x.id === id);
  if(it && typeof darItem === 'function') return darItem(it);
  return false;
}
window.darItemPorId = darItemPorId;
window.ITEMS_EXPLORAR = ITEMS_EXPLORAR;
const CATALOGO_ITEMS_EXPLORAR = ITEMS_EXPLORAR;
window.CATALOGO_ITEMS_EXPLORAR = ITEMS_EXPLORAR;

function itemExplorarAleatorio(){
  return ITEMS_EXPLORAR[Math.floor(Math.random() * ITEMS_EXPLORAR.length)];
}

// Da una cantidad concreta de chatarra. Atajo cómodo para escenas de
// exploración y para el sistema de profesiones.
function darChatarra(cantidad){
  const n = Math.max(1, cantidad || 1);
  return darItem({ id:'chatarra', nombre:'Chatarra', tipo:'material',
    desc:'Metal retorcido, cable, plástico quemado. No vale nada tal cual, pero alguien con paciencia podría sacarle unos créditos.',
    cantidad:n });
}
function contarChatarra(){
  _asegurarInventario();
  const it = Estado.inventario.find(i => i.id === 'chatarra');
  return it ? (it.cantidad || 0) : 0;
}

// Cuenta cuántas unidades de un item tienes (0 si no lo llevas). Genérico,
// lo usa el motor de corridas para la munición suelta del inventario.
function contarItem(id){
  _asegurarInventario();
  const it = Estado.inventario.find(i => i.id === id);
  return it ? (it.cantidad || 0) : 0;
}
if(typeof window !== 'undefined') window.contarItem = contarItem;

// ── Chatarra combinada: para el refinado, la chatarra normal ('chatarra')
// y la "en bruto" de expediciones ('chatarra_cruda') cuentan como una sola
// materia prima. Estos helpers suman ambas y consumen del total, gastando
// primero la normal y luego la en bruto.
function contarChatarraTotal(){
  _asegurarInventario();
  let n = 0;
  Estado.inventario.forEach(i => {
    if(i.id === 'chatarra' || i.id === 'chatarra_cruda') n += (i.cantidad || 0);
  });
  return n;
}
function consumirChatarraTotal(cantidad){
  let restante = Math.max(0, cantidad || 0);
  if(restante <= 0) return true;
  if(contarChatarraTotal() < restante) return false;
  // Gastar primero la normal, luego la en bruto.
  ['chatarra', 'chatarra_cruda'].forEach(id => {
    if(restante <= 0) return;
    const it = Estado.inventario.find(i => i.id === id);
    if(!it) return;
    const usa = Math.min(it.cantidad || 0, restante);
    if(usa > 0){ quitarItem(id, usa); restante -= usa; }
  });
  return restante <= 0;
}
window.darChatarra = darChatarra;
window.contarChatarra = contarChatarra;
window.contarChatarraTotal = contarChatarraTotal;
window.consumirChatarraTotal = consumirChatarraTotal;

window.darItem = darItem;

// Nombre visible de un item por su id (busca en ambos catálogos). Devuelve
// el propio id si no lo encuentra, para no romper nunca la UI.
function nombreItem(id){
  const todos = [].concat(
    (typeof ITEMS_EXPLORAR !== 'undefined') ? ITEMS_EXPLORAR : [],
    (typeof ITEMS_EXPEDICION !== 'undefined') ? ITEMS_EXPEDICION : []
  );
  const it = todos.find(i => i && i.id === id);
  return (it && it.nombre) ? it.nombre : id;
}
window.nombreItem = nombreItem;
window.quitarItem = quitarItem;
window.tieneItem = tieneItem;
window.describirInventarioParaIA = describirInventarioParaIA;
window.renderInventario = renderInventario;
window.itemExplorarAleatorio = itemExplorarAleatorio;
window.ITEMS_EXPLORAR = ITEMS_EXPLORAR;
