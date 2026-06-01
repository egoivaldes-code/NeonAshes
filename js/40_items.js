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
    return `
      <div class="estado-inv-fila">
        <div class="estado-inv-nombre">${i.nombre}${cant}</div>
        ${i.desc ? `<div class="estado-inv-desc">${i.desc}</div>` : ''}
      </div>`;
  }).join('');
}

// Catálogo de objetos que el viaje "Explorar la ciudad" puede soltar.
// Son objetos de sabor + contexto para misiones futuras.
const ITEMS_EXPLORAR = [
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
  { id:'papel_helix', nombre:'Papel mojado con un código', tipo:'dato',
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

// Da un item del catálogo de explorar por su id (para escenas de guion).
function darItemPorId(id){
  const it = ITEMS_EXPLORAR.find(x => x.id === id);
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

window.darItem = darItem;
window.quitarItem = quitarItem;
window.tieneItem = tieneItem;
window.describirInventarioParaIA = describirInventarioParaIA;
window.renderInventario = renderInventario;
window.itemExplorarAleatorio = itemExplorarAleatorio;
window.ITEMS_EXPLORAR = ITEMS_EXPLORAR;
