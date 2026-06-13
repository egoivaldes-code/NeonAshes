// ============================================================
//  NEON ASHES — HACKER (v0.103)
//  Profesión 100% digital. SIN viajes, SIN exploración física.
//  Todo ocurre en el terminal: contratos de la red clandestina.
//
//  Flujo de un contrato:
//   1) CONTACTO   — chat narrativo. El cliente plantea el encargo.
//   2) INTRUSIÓN  — minijuego principal (según el contrato).
//   3) LIMPIEZA   — minijuego secundario opcional (más paga / menos rastro).
//   4) RESULTADO  — consecuencias + recompensa.
//
//  Minijuegos por rango (este archivo: Rango 1 y 2):
//   R1 SCRIPT KIDDIE: 'fuerza_bruta', 'descifrado'
//   R2 INTRUSO:       'inyeccion', 'rastros'
//
//  Contenido hand-authored. Más contratos => añadir a CONTRATOS_HACK.
// ============================================================

const HACK_PROF_ID = 'hacker';

function _hackFX(clave, vol){
  if(typeof reproducirFX === 'function') reproducirFX(clave, vol);
}

// ── Estado del contrato en curso ────────────────────────────
let _hackContrato = null;
let _hackFase = 'contacto';   // contacto | intrusion | limpieza | resultado
let _hackVolverA = 'apartamento';
let _hackMini = null;         // estado mutable del minijuego activo
let _hackIntrusionOk = null;  // bool tras el minijuego principal
let _hackLimpiezaOk = null;   // bool/null tras el secundario (null = no hecho)

function _hackHecho(id){
  return !!(Estado.memoria && Estado.memoria.contratosHackHechos && Estado.memoria.contratosHackHechos[id]);
}
function _marcarHackHecho(id){
  Estado.memoria = Estado.memoria || {};
  Estado.memoria.contratosHackHechos = Estado.memoria.contratosHackHechos || {};
  Estado.memoria.contratosHackHechos[id] = true;
}

// ============================================================
//  POOL DE CONTRATOS
//  Estructura:
//   id, titulo, cliente, faccion, peligro(1-5), pagaBase, progreso,
//   rangoMin, resumen,
//   contacto[]  ← líneas de chat { quien:'cliente'|'tu'|'sys', txt }
//   intrusion{ tipo, ...config del minijuego }
//   limpieza{ tipo, ...config }   (opcional; si falta, no hay fase 3)
//   exito{ narr }    ← desenlace al lograr la intrusión
//   fallo{ narr }    ← desenlace al fallar la intrusión
//   eco?: tipo de eco en noticias
// ============================================================
const CONTRATOS_HACK = [

  // ───────────────────────────────────────────────────────────
  //  RANGO 1 — SCRIPT KIDDIE
  // ───────────────────────────────────────────────────────────

  // C1 — máquina expendedora (tutorial blando de fuerza bruta)
  {
    id: 'hack_expendedora',
    titulo: 'LA MÁQUINA QUE NO PERDONA',
    cliente: 'Vecino del 4.º — "Tarro"',
    faccion: null,
    peligro: 1,
    pagaBase: 80,
    progreso: 90,
    rangoMin: 0,
    resumen: 'Una expendedora HELIX se tragó las últimas raciones de medio bloque y no devuelve ni el saldo. Tarro jura que el PIN de servicio "es una tontería". Sácalo.',
    contacto: [
      { quien:'cliente', txt:'Eh, tú. El del terminal. Dicen que abres cosas que no son tuyas.' },
      { quien:'tu', txt:'Depende de la cosa.' },
      { quien:'cliente', txt:'La expendedora del rellano. Se comió mis cupones y los de tres vecinos más. El menú de servicio pide un PIN. Cuatro dígitos. ¿Cuánto?' },
      { quien:'tu', txt:'Poco. Es una expendedora, no un banco.' },
      { quien:'sys', txt:'> CONECTANDO A PANEL DE SERVICIO — VENDOR HELIX-7\n> AUTENTICACIÓN REQUERIDA' }
    ],
    intrusion: {
      tipo: 'fuerza_bruta',
      longitud: 4,
      soloDigitos: true,
      objetivo: '7741',
      pistas: [
        'Cuatro dígitos.',
        'Termina en número primo de una cifra.',
        'El primero es mayor que el último.',
        'Hay un dígito repetido, seguido.'
      ],
      intentos: 6
    },
    exito: { narr: 'El panel parpadea verde. La expendedora escupe el saldo retenido y, de propina, dos raciones que se había guardado para sí. Tarro reparte. Por una vez, la máquina pierde.' },
    fallo: { narr: 'La expendedora bloquea el panel y enciende un piloto rojo de manipulación. No saltará ninguna alarma seria —es una expendedora—, pero Tarro se queda sin cupones y tú sin paga. Otra vez será.' }
  },

  // C2 — leer correos de un casero (descifrado César)
  {
    id: 'hack_casero',
    titulo: 'LO QUE EL CASERO ESCONDE',
    cliente: 'Inquilina del Sector 7 — anónima',
    faccion: null,
    peligro: 1,
    pagaBase: 110,
    progreso: 110,
    rangoMin: 0,
    resumen: 'El casero sube el alquiler "por orden de HELIX" y se niega a enseñar el papel. Una inquilina sospecha que miente. Sus correos van cifrados con algo de hace cien años. Léelos.',
    contacto: [
      { quien:'cliente', txt:'No quiero líos. Solo quiero saber si el casero miente cuando dice que la subida viene de arriba.' },
      { quien:'tu', txt:'¿Tienes acceso a algo suyo?' },
      { quien:'cliente', txt:'Saqué una copia de su bandeja cuando se dejó el terminal abierto. Pero está... raro. Las letras corridas. No entiendo nada.' },
      { quien:'tu', txt:'Cifrado de desplazamiento. De juguete. Dame un momento.' },
      { quien:'sys', txt:'> ARCHIVO: bandeja_casero.txt\n> CIFRADO: CÉSAR (desplazamiento desconocido)' }
    ],
    intrusion: {
      tipo: 'descifrado',
      modo: 'cesar',
      // texto claro objetivo; el motor cifra con un shift y el jugador lo recupera
      claro: 'LA SUBIDA ES MIA NO DE HELIX',
      shift: 3,
      ayuda: 'Cada letra está desplazada el mismo número de posiciones en el alfabeto. Prueba desplazamientos hasta que el texto tenga sentido.'
    },
    exito: { narr: 'El texto se ordena bajo tus dedos: la subida la inventó el casero, no HELIX. La inquilina lee el correo descifrado dos veces, en silencio. "Con esto le paro los pies", dice. No pregunta cómo lo hiciste.' },
    fallo: { narr: 'Te enredas con el desplazamiento y el archivo se corrompe al tercer intento torpe. La inquilina se queda con la duda y tú sin nada. El casero seguirá cobrando de más.' }
  },

  // C3 — credenciales de un capataz (fuerza bruta alfanumérica)
  {
    id: 'hack_capataz',
    titulo: 'LA CONTRASEÑA DEL CAPATAZ',
    cliente: 'Cuadrilla de descarga — el "Flaco"',
    faccion: 'sindicatos',
    peligro: 2,
    pagaBase: 150,
    progreso: 130,
    rangoMin: 0,
    resumen: 'El capataz del muelle apunta las horas en su terminal y, según la cuadrilla, las recorta a placer. El Flaco quiere las credenciales para ver los registros reales. Es Ferro: ándate con ojo.',
    contacto: [
      { quien:'cliente', txt:'No es para robar. Es para mirar. El capataz nos roba horas y dice que el sistema no miente. El sistema sí miente: lo edita él.' },
      { quien:'tu', txt:'Esto es del Ferro. Si se enteran de que husmeo en sus muelles...' },
      { quien:'cliente', txt:'No se enterarán. El capataz es un descuidado. Pega la clave en notas. Solo necesito que entres.' },
      { quien:'tu', txt:'Su clave entonces tendrá su cara de descuidado. Veamos.' },
      { quien:'sys', txt:'> TERMINAL DE CAPATAZ — TURNO MUELLE 9\n> USUARIO: m.korr   CLAVE: ········' }
    ],
    intrusion: {
      tipo: 'fuerza_bruta',
      longitud: 6,
      soloDigitos: false,
      objetivo: 'KORR99',
      pistas: [
        'Seis caracteres.',
        'Empieza con letras, termina con números.',
        'Las letras son su apellido (KORR).',
        'Acaba en un número repetido.'
      ],
      intentos: 7
    },
    exito: { narr: 'Dentro. Los registros reales aparecen al lado de los "oficiales": faltan horas en cada turno, redondeadas siempre a favor del capataz. El Flaco fotografía la pantalla. "Ahora sí." El Ferro no se entera. Por ahora.' },
    fallo: { narr: 'El terminal traba el acceso tras varios fallos y registra el intento. Nada grave aún, pero el capataz verá el aviso mañana. El Flaco se queda sin pruebas y tú con el regusto de haber tentado al Ferro para nada.' },
    eco: 'hack_ferro'
  },

  // ───────────────────────────────────────────────────────────
  //  RANGO 2 — INTRUSO
  // ───────────────────────────────────────────────────────────

  // C4 — modificar expediente médico (inyección + limpieza)
  {
    id: 'hack_expediente',
    titulo: 'UNA LÍNEA EN EL HISTORIAL',
    cliente: 'Madre de un paciente — desesperada',
    faccion: 'helix',
    peligro: 3,
    pagaBase: 240,
    progreso: 170,
    rangoMin: 1,
    resumen: 'HELIX marcó a un crío como "no viable para tratamiento" por una deuda de la familia. Una línea en el historial decide si vive. La madre quiere que esa línea diga otra cosa. Entrar en la red del Hospital no es entrar en una expendedora.',
    contacto: [
      { quien:'cliente', txt:'Dicen que no le tratan porque debemos. Que es "no viable". Mi hijo no es una factura.' },
      { quien:'tu', txt:'Entrar en el Hospital HELIX deja huella. Mucha huella. ¿Entiendes lo que pides?' },
      { quien:'cliente', txt:'Entiendo que sin esa línea cambiada se muere. Lo que te pase a ti o a mí después... ya veremos. Por favor.' },
      { quien:'tu', txt:'Una línea. Entro, la cambio, borro el rastro y desaparezco. No prometo más.' },
      { quien:'sys', txt:'> RED INTERNA HOSPITAL HELIX — CAPA CLÍNICA\n> EXPLOTANDO NODO DE ACCESO...' }
    ],
    intrusion: {
      tipo: 'inyeccion',
      // rejilla de nodos: hay que conectar ENTRADA→SERVIDOR rotando piezas
      filas: 3,
      cols: 4,
      pasos: 6,
      desc: 'Construye una ruta de datos desde el NODO DE ENTRADA hasta el SERVIDOR CLÍNICO conectando los segmentos. Tienes un número limitado de rotaciones.'
    },
    limpieza: {
      tipo: 'rastros',
      desc: 'El acceso ha dejado registros. Borra solo los que delatan tu intrusión. Si borras un log legítimo, salta una verificación; si dejas uno tuyo, te rastrean.',
      logs: [
        { txt:'08:23  LOGIN  enfermera.t  (turno)',        culpable:false },
        { txt:'08:24  EDIT   historial #4471  origen:EXT', culpable:true  },
        { txt:'08:24  SCAN   antivirus HELIX  rutina',     culpable:false },
        { txt:'08:25  AUTH   m.lira  consulta',            culpable:false },
        { txt:'08:25  TRACE  nodo_acceso  no_listado',     culpable:true  },
        { txt:'08:26  LOGOUT enfermera.t',                 culpable:false },
        { txt:'08:26  ACCESS root  sesion_anonima',        culpable:true  }
      ]
    },
    exito: { narr: 'La línea cambia. "No viable" se convierte en "tratamiento autorizado — prioridad media". Limpio lo que dejé, o casi. En las Pilas, casi siempre es suficiente. La madre no sabe lo que hiciste; solo que su hijo entra a quirófano. Te basta con eso.' },
    fallo: { narr: 'El nodo se cierra antes de tiempo y un escáner de HELIX muerde tu rastro. Sales sin cambiar la línea y con la sensación de que alguien, en algún servidor, acaba de anotar una sesión anónima que no debería existir. El crío sigue siendo "no viable".' },
    eco: 'hack_helix'
  },

  // C5 — antecedentes policiales (inyección, sin limpieza: el cliente asume riesgo)
  {
    id: 'hack_antecedentes',
    titulo: 'BORRAR UN NOMBRE',
    cliente: 'Ex-recluso del Arrabal — "Vento"',
    faccion: 'loto',
    peligro: 3,
    pagaBase: 210,
    progreso: 150,
    rangoMin: 1,
    resumen: 'Vento pagó su condena, pero la ficha lo persigue: ningún trabajo, ningún piso, ninguna puerta. El Loto le ofrece protección si "limpia" su antecedente. Quiere una intrusión en el registro penal del distrito.',
    contacto: [
      { quien:'cliente', txt:'Cumplí. Cada día. Y aquí fuera sigo siendo el número de una ficha. Quita la ficha y soy una persona otra vez.' },
      { quien:'tu', txt:'Borrar antecedentes es trabajo de Intruso, no de novato. Y si te pillan editado, es peor que tenerlo.' },
      { quien:'cliente', txt:'El Loto me cubre. Tú solo abre la puerta del registro. Lo demás es cosa mía.' },
      { quien:'tu', txt:'Abro la puerta. Lo que entres por ella, tuyo.' },
      { quien:'sys', txt:'> REGISTRO PENAL — DISTRITO LAS PILAS\n> RUTA DE ACCESO: NO ESTABLECIDA' }
    ],
    intrusion: {
      tipo: 'inyeccion',
      filas: 3,
      cols: 5,
      pasos: 7,
      desc: 'Traza la ruta de datos hasta el SERVIDOR DEL REGISTRO PENAL. Más nodos, menos rotaciones de margen. Calcula antes de tocar.'
    },
    exito: { narr: 'La ruta se cierra con un chasquido limpio. El registro se abre y Vento hace lo que vino a hacer; tú apartas la vista, como acordasteis. Cuando sales, su ficha tiene un hueco con forma de nombre. El Loto cobra su parte en lealtad. Tú, en créditos.' },
    fallo: { narr: 'Te falta una rotación para cerrar la ruta y el registro detecta el sondeo. No editas nada. Vento sigue siendo un número, y ahora un número que alguien intentó borrar: la peor de las fichas. El Loto toma nota de quién falló.' },
    eco: 'hack_loto'
  },

  // C6 — espiar empleados HELIX (descifrado por sustitución + limpieza)
  {
    id: 'hack_topo',
    titulo: 'EL MENSAJE DEL TOPO',
    cliente: 'Sindicato Ferro — intermediario',
    faccion: 'sindicatos',
    peligro: 4,
    pagaBase: 300,
    progreso: 190,
    rangoMin: 1,
    resumen: 'El Ferro sospecha que un empleado de HELIX filtra sus rutas de descarga a la competencia. Hay un mensaje interceptado, cifrado con sustitución. Descífralo y borra que pasaste por ahí. Esto ya no es de juguete.',
    contacto: [
      { quien:'cliente', txt:'Tenemos un topo. Cada ruta que planeamos, HELIX la conoce antes que nosotros. Interceptamos esto. No se lee.' },
      { quien:'tu', txt:'Sustitución, no César. Cada letra es otra fija. Lleva más trabajo, pero cae.' },
      { quien:'cliente', txt:'El Ferro paga bien por trabajo limpio. Y recuerda quién no lo es. Descífralo y no dejes que HELIX sepa que lo tienes.' },
      { quien:'tu', txt:'Limpio entonces. Dame el texto.' },
      { quien:'sys', txt:'> MENSAJE INTERCEPTADO — ORIGEN: NODO HELIX-LOG\n> CIFRADO: SUSTITUCIÓN MONOALFABÉTICA' }
    ],
    intrusion: {
      tipo: 'descifrado',
      modo: 'sustitucion',
      claro: 'RUTA NUEVE A LAS DOS',
      ayuda: 'Cada letra del mensaje corresponde siempre a la misma letra real. Empieza por las palabras cortas y las letras más frecuentes.'
    },
    limpieza: {
      tipo: 'rastros',
      desc: 'Interceptaste el mensaje desde un nodo de HELIX. Borra tu paso sin tocar el tráfico normal del topo —el Ferro lo quiere vivo y vigilado, no avisado.',
      logs: [
        { txt:'02:01  SYNC   nodo_helix_log  programado',   culpable:false },
        { txt:'02:02  PULL   mensaje #88-21  origen:EXT',    culpable:true  },
        { txt:'02:02  PING   ruta_topo  interna',            culpable:false },
        { txt:'02:03  COPY   buffer→sesion_anon',            culpable:true  },
        { txt:'02:03  HEARTBEAT nodo_helix_log',             culpable:false },
        { txt:'02:04  CLOSE  sesion_anon  sin_registro',     culpable:true  }
      ]
    },
    exito: { narr: 'El mensaje se rinde letra a letra: una ruta, una hora, un punto de entrega. El topo es real, y ahora el Ferro sabe cuándo cazarlo. Borras tu paso por el nodo de HELIX como quien borra pisadas en la nieve antes del amanecer. El intermediario no da las gracias. El Ferro no las da; las debe.' },
    fallo: { narr: 'El cifrado se te resiste y, peor, dejas un buffer abierto en el nodo de HELIX. El mensaje queda a medio leer y tu sesión, medio expuesta. El Ferro no tendrá su ruta y tú tendrás la incómoda certeza de haber dejado tu sombra en un servidor corporativo. Mal trabajo.' },
    eco: 'hack_ferro'
  }
];

const CONTRATOS_HACK_POR_ID = {};
CONTRATOS_HACK.forEach(c => { CONTRATOS_HACK_POR_ID[c.id] = c; });

// ============================================================
//  ABRIR / TABLÓN
// ============================================================
function abrirRedHacker(volverA){
  _hackVolverA = volverA || 'apartamento';
  if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _hackVolverA;
  if(typeof cambiarEscena === 'function'){
    cambiarEscena(idDesde, 'hack-escena');
  } else {
    if(desde) desde.classList.remove('activa');
    const e = document.getElementById('hack-escena');
    if(e) e.classList.add('activa');
  }
  if(_hackContrato) _pintarFaseHack();
  else { _hackFX('panel_abrir', 0.5); _pintarTablonHack(); }
  return true;
}

function _pintarTablonHack(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const rango = (typeof rangoActualProfesion === 'function') ? rangoActualProfesion(HACK_PROF_ID) : 0;
  let html = '<div class="casos-cab"><div class="casos-titulo">RED CLANDESTINA</div>'
    + '<div class="casos-sub">Contratos sin rostro. Alguien necesita una puerta abierta y no pregunta cómo.</div></div>';
  html += '<div class="casos-lista">';
  const ordenados = CONTRATOS_HACK.slice().sort((a, b) =>
       (a.rangoMin || 0) - (b.rangoMin || 0)
    || (a.peligro  || 0) - (b.peligro  || 0)
    || (a.pagaBase || 0) - (b.pagaBase || 0)
  );
  ordenados.forEach(c => {
    const bloqueadoRango = (c.rangoMin || 0) > rango;
    const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
    const yaHecho = _hackHecho(c.id);
    let estado = yaHecho ? '<span class="casos-hecho">CERRADO</span>' : '';
    html += '<div class="caso-card' + (bloqueadoRango ? ' caso-bloq' : '') + '">'
      + '<div class="caso-card-top"><span class="caso-titulo">' + c.titulo + '</span>' + estado + '</div>'
      + '<div class="caso-contratante">' + c.cliente + '</div>'
      + '<div class="caso-resumen">' + c.resumen + '</div>'
      + '<div class="caso-meta"><span class="caso-peligro">RIESGO ' + peligro + '</span>'
      + '<span class="caso-paga">≈ ' + (c.pagaBase || 0) + ' CR</span></div>';
    if(bloqueadoRango){
      html += '<div class="caso-nota">Requiere más reputación en la red.</div>';
    } else if(yaHecho){
      html += '<div class="caso-nota">Ya cerraste este contrato.</div>';
    } else {
      html += '<button class="btn-terminal caso-aceptar" onclick="aceptarHack(\'' + c.id + '\')">ACEPTAR CONTRATO →</button>';
    }
    html += '</div>';
  });
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="cerrarRedHacker()">← DESCONECTAR</button>';
  cont.innerHTML = html;
}

function aceptarHack(id){
  const c = CONTRATOS_HACK_POR_ID[id];
  if(!c) return;
  _hackFX('inv_papel', 0.5);
  _hackContrato = c;
  _hackFase = 'contacto';
  _hackMini = null;
  _hackIntrusionOk = null;
  _hackLimpiezaOk = null;
  _pintarFaseHack();
}

function _pintarFaseHack(){
  if(!_hackContrato) { _pintarTablonHack(); return; }
  if(_hackFase === 'contacto')  return _pintarContacto();
  if(_hackFase === 'intrusion') return _pintarIntrusion();
  if(_hackFase === 'limpieza')  return _pintarLimpieza();
  if(_hackFase === 'resultado') return _pintarResultado();
}

// ── Helpers de HUD ──────────────────────────────────────────
function _hackHud(sub){
  const c = _hackContrato;
  return '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">' + (sub || '') + '</span></div>';
}

// ============================================================
//  FASE 1 — CONTACTO (chat)
// ============================================================
function _pintarContacto(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const c = _hackContrato;
  let html = _hackHud('CONTACTO');
  html += '<div class="hack-chat">';
  (c.contacto || []).forEach(l => {
    const cls = l.quien === 'tu' ? 'hack-msg hack-msg-tu'
              : l.quien === 'sys' ? 'hack-msg hack-msg-sys'
              : 'hack-msg hack-msg-cli';
    const txt = (l.txt || '').replace(/\n/g, '<br>');
    html += '<div class="' + cls + '">' + txt + '</div>';
  });
  html += '</div>';
  html += '<button class="btn-terminal" onclick="hackEmpezarIntrusion()">EMPEZAR LA INTRUSIÓN →</button>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← RECHAZAR EL CONTRATO</button>';
  cont.innerHTML = html;
}

function hackEmpezarIntrusion(){
  _hackFase = 'intrusion';
  _hackMini = null;
  _pintarFaseHack();
}

// ============================================================
//  FASE 2 — INTRUSIÓN (minijuego principal, según tipo)
// ============================================================
function _pintarIntrusion(){
  const c = _hackContrato;
  const tipo = c.intrusion ? c.intrusion.tipo : null;
  if(tipo === 'fuerza_bruta') return _miniFuerzaBruta();
  if(tipo === 'descifrado')   return _miniDescifrado();
  if(tipo === 'inyeccion')    return _miniInyeccion();
  // sin minijuego conocido => éxito por defecto, a resultado
  _hackIntrusionOk = true;
  _irAFaseTrasIntrusion();
}

function _irAFaseTrasIntrusion(){
  if(_hackIntrusionOk && _hackContrato.limpieza){
    _hackFase = 'limpieza';
    _hackMini = null;
  } else {
    _hackFase = 'resultado';
  }
  _pintarFaseHack();
}

// ── MINIJUEGO 1: FUERZA BRUTA ───────────────────────────────
function _miniFuerzaBruta(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    _hackMini = { intentos: cfg.intentos || 6, fallos: 0, historial: [] };
  }
  const m = _hackMini;
  let html = _hackHud('FUERZA BRUTA · ' + (m.intentos - m.fallos) + ' intentos');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">Adivina la credencial a partir de las pistas. Cada intento fallido cuenta.</div>';
  html += '<div class="hack-pistas"><div class="hack-pistas-tit">PISTAS</div><ul>';
  (cfg.pistas || []).forEach(p => { html += '<li>' + p + '</li>'; });
  html += '</ul></div>';
  if(m.historial.length){
    html += '<div class="hack-historial"><div class="hack-pistas-tit">INTENTOS</div>';
    m.historial.forEach(h => {
      html += '<div class="hack-try"><span class="hack-try-val">' + h.val + '</span>'
        + '<span class="hack-try-fb">' + h.fb + '</span></div>';
    });
    html += '</div>';
  }
  const ph = cfg.soloDigitos ? (cfg.longitud + ' dígitos') : (cfg.longitud + ' caracteres');
  html += '<input id="hack-fb-input" class="hack-input" type="text" inputmode="' + (cfg.soloDigitos ? 'numeric' : 'text') + '" '
    + 'maxlength="' + cfg.longitud + '" placeholder="' + ph + '" autocomplete="off">';
  html += '<button class="btn-terminal" onclick="hackProbarFuerzaBruta()">PROBAR CREDENCIAL</button>';
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}

function hackProbarFuerzaBruta(){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const input = document.getElementById('hack-fb-input');
  if(!input) return;
  let val = (input.value || '').trim().toUpperCase();
  if(!val) return;
  if(val.length !== cfg.longitud){
    input.value = '';
    input.placeholder = 'Deben ser ' + cfg.longitud + ' caracteres';
    return;
  }
  const obj = (cfg.objetivo || '').toUpperCase();
  if(val === obj){
    _hackFX('inv_acierto', 0.55);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  // feedback estilo "posiciones correctas"
  let bien = 0;
  for(let i = 0; i < cfg.longitud; i++){ if(val[i] === obj[i]) bien++; }
  m.historial.push({ val: val, fb: bien + '/' + cfg.longitud + ' en su sitio' });
  m.fallos++;
  _hackFX('inv_fallo', 0.4);
  if(m.fallos >= m.intentos){
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  _miniFuerzaBruta();
}

// ── MINIJUEGO 2: DESCIFRADO ─────────────────────────────────
// Genera el texto cifrado a partir del claro. César = shift fijo.
// Sustitución = mapa aleatorio estable por contrato (semilla simple).
let _hackMapaSust = null;
function _construirCifrado(cfg){
  const claro = (cfg.claro || '').toUpperCase();
  if(cfg.modo === 'cesar'){
    const s = cfg.shift || 3;
    return claro.replace(/[A-Z]/g, ch =>
      String.fromCharCode((ch.charCodeAt(0) - 65 + s) % 26 + 65));
  }
  // sustitución: barajar alfabeto de forma estable
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const map = {};
  // baraja determinista para que el mismo contrato dé el mismo cifrado
  let seed = 0;
  for(let i = 0; i < claro.length; i++) seed += claro.charCodeAt(i);
  const arr = abc.slice();
  for(let i = arr.length - 1; i > 0; i--){
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  abc.forEach((c, i) => { map[c] = arr[i]; });
  _hackMapaSust = map;
  return claro.replace(/[A-Z]/g, ch => map[ch] || ch);
}

function _miniDescifrado(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    _hackMini = { cifrado: _construirCifrado(cfg), intentos: 4, fallos: 0 };
  }
  const m = _hackMini;
  let html = _hackHud('DESCIFRADO · ' + (m.intentos - m.fallos) + ' intentos');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.ayuda || 'Recupera el texto original.') + '</div>';
  html += '<div class="hack-cifrado"><div class="hack-pistas-tit">TEXTO CIFRADO</div>'
    + '<div class="hack-cifrado-txt">' + m.cifrado + '</div></div>';
  if(cfg.modo === 'cesar'){
    html += '<div class="hack-mini-desc" style="opacity:.7;">Indica cuántas posiciones hay que desplazar hacia atrás (1–25):</div>';
    html += '<input id="hack-shift-input" class="hack-input" type="number" inputmode="numeric" min="1" max="25" placeholder="desplazamiento" autocomplete="off">';
    html += '<div id="hack-preview" class="hack-cifrado-txt" style="opacity:.6;margin-top:.4rem;"></div>';
    html += '<button class="btn-terminal" onclick="hackProbarCesar()">DESCIFRAR</button>';
  } else {
    html += '<div class="hack-mini-desc" style="opacity:.7;">Escribe el texto descifrado completo:</div>';
    html += '<input id="hack-desc-input" class="hack-input" type="text" placeholder="texto descifrado" autocomplete="off">';
    html += '<button class="btn-terminal" onclick="hackProbarSustitucion()">CONFIRMAR LECTURA</button>';
  }
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
  // vista previa en vivo para César
  if(cfg.modo === 'cesar'){
    const inp = document.getElementById('hack-shift-input');
    if(inp){
      inp.addEventListener('input', () => {
        const s = parseInt(inp.value, 10);
        const pv = document.getElementById('hack-preview');
        if(!pv) return;
        if(isNaN(s) || s < 1 || s > 25){ pv.textContent = ''; return; }
        pv.textContent = m.cifrado.replace(/[A-Z]/g, ch =>
          String.fromCharCode((ch.charCodeAt(0) - 65 - s + 26) % 26 + 65));
      });
    }
  }
}

function _normalizar(t){
  return (t || '').toUpperCase().replace(/\s+/g, ' ').trim();
}

function hackProbarCesar(){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const inp = document.getElementById('hack-shift-input');
  if(!inp) return;
  const s = parseInt(inp.value, 10);
  if(isNaN(s) || s < 1 || s > 25) return;
  const descifrado = m.cifrado.replace(/[A-Z]/g, ch =>
    String.fromCharCode((ch.charCodeAt(0) - 65 - s + 26) % 26 + 65));
  if(_normalizar(descifrado) === _normalizar(cfg.claro)){
    _hackFX('inv_acierto', 0.55);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  m.fallos++;
  _hackFX('inv_fallo', 0.4);
  if(m.fallos >= m.intentos){
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  _miniDescifrado();
}

function hackProbarSustitucion(){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const inp = document.getElementById('hack-desc-input');
  if(!inp) return;
  const val = inp.value || '';
  if(!val.trim()) return;
  if(_normalizar(val) === _normalizar(cfg.claro)){
    _hackFX('inv_acierto', 0.55);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  m.fallos++;
  _hackFX('inv_fallo', 0.4);
  if(m.fallos >= m.intentos){
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  _miniDescifrado();
}

// ── MINIJUEGO 3: INYECCIÓN DE CÓDIGO ────────────────────────
// Rejilla de piezas de tubería. Cada celda tiene conexiones que
// rotan. Hay que formar un camino continuo de la columna 0 (entrada)
// a la última columna (servidor) en la fila central, con un límite
// de rotaciones. Modelo de bits: N=1 E=2 S=4 O=8.
const _HACK_PIEZAS = {
  // tipos base; el motor reparte y rota
  recto:  3,  // E-O? usamos pares; aquí E|O = 2|8 = 10
  curva:  6   // N|E etc.
};
function _hackConexiones(tipo, rot){
  // devuelve set de direcciones {N,E,S,O} según tipo y rotación (0-3)
  // recto: O-E (horizontal). rotación impar => N-S (vertical)
  // curva: N-E. rotaciones giran 90º
  let base;
  if(tipo === 'recto')  base = ['E','O'];
  else                  base = ['N','E'];
  const orden = ['N','E','S','O'];
  return base.map(d => {
    let i = orden.indexOf(d);
    i = (i + rot) % 4;
    return orden[i];
  });
}
function _hackOpuesto(d){ return { N:'S', S:'N', E:'O', O:'E' }[d]; }

function _miniInyeccion(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  const filas = cfg.filas || 3;
  const cols = cfg.cols || 4;
  if(!_hackMini){
    // generamos una solución por la fila central y la desbaratamos con rotaciones aleatorias
    const filaC = Math.floor(filas / 2);
    const grid = [];
    for(let f = 0; f < filas; f++){
      grid[f] = [];
      for(let c = 0; c < cols; c++){
        // por defecto rectos horizontales; piezas fuera de la fila central también rectas (distractores)
        grid[f][c] = { tipo:'recto', rot: 0 };
      }
    }
    // desbaratar rotaciones para que el jugador tenga que arreglarlo
    for(let f = 0; f < filas; f++){
      for(let c = 0; c < cols; c++){
        // tipo aleatorio suave: la fila central toda recta para que tenga solución girando a horizontal
        if(f === filaC){
          grid[f][c].tipo = 'recto';
          grid[f][c].rot = Math.floor(Math.random() * 2) === 0 ? 0 : 1; // 0 horiz / 1 vert
        } else {
          grid[f][c].tipo = Math.random() < 0.5 ? 'recto' : 'curva';
          grid[f][c].rot = Math.floor(Math.random() * 4);
        }
      }
    }
    _hackMini = { grid, filas, cols, filaC, rot: 0, maxRot: cfg.pasos || 6 };
  }
  const m = _hackMini;
  let html = _hackHud('INYECCIÓN · ' + (m.maxRot - m.rot) + ' rotaciones');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  html += '<div class="hack-grid" style="grid-template-columns:repeat(' + m.cols + ',1fr);">';
  for(let f = 0; f < m.filas; f++){
    for(let c = 0; c < m.cols; c++){
      const cell = m.grid[f][c];
      const conex = _hackConexiones(cell.tipo, cell.rot);
      const enRuta = _hackEnRutaActual(f, c);
      const cls = 'hack-cell' + (f === m.filaC ? ' hack-cell-fila' : '') + (enRuta ? ' hack-cell-on' : '');
      const glifo = _hackGlifo(conex);
      let etq = '';
      if(f === m.filaC && c === 0) etq = '<span class="hack-cell-etq">IN</span>';
      if(f === m.filaC && c === m.cols - 1) etq = '<span class="hack-cell-etq">SRV</span>';
      html += '<div class="' + cls + '" onclick="hackRotarCelda(' + f + ',' + c + ')">'
        + '<span class="hack-glifo">' + glifo + '</span>' + etq + '</div>';
    }
  }
  html += '</div>';
  const conectado = _hackRutaCompleta();
  if(conectado){
    html += '<button class="btn-terminal" onclick="hackConfirmarInyeccion()">EJECUTAR EXPLOIT →</button>';
  } else {
    html += '<div class="hack-mini-desc" style="opacity:.6;">Gira las piezas para unir IN con SRV por la fila central.</div>';
  }
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}

function _hackGlifo(conex){
  const s = conex.slice().sort().join('');
  const mapa = {
    'EO':'─', 'NS':'│',
    'EN':'└', 'NO':'┘', 'ES':'┌', 'OS':'┐'
  };
  return mapa[s] || '·';
}

// ¿están conectadas las celdas (f,c) y su vecina en dirección d?
function _hackConectaHacia(f, c, d){
  const m = _hackMini;
  const cell = m.grid[f][c];
  const conex = _hackConexiones(cell.tipo, cell.rot);
  return conex.indexOf(d) !== -1;
}

// recorre la fila central desde IN; devuelve hasta qué columna llega la ruta continua
function _hackAlcance(){
  const m = _hackMini;
  const f = m.filaC;
  let col = 0;
  // IN entra por el oeste de la celda 0; necesitamos que (f,0) tenga E para avanzar
  while(col < m.cols - 1){
    if(_hackConectaHacia(f, col, 'E') && _hackConectaHacia(f, col + 1, 'O')){
      col++;
    } else break;
  }
  return col; // índice de la última columna alcanzada de forma continua
}
function _hackRutaCompleta(){
  const m = _hackMini;
  return _hackAlcance() === m.cols - 1;
}
function _hackEnRutaActual(f, c){
  const m = _hackMini;
  if(f !== m.filaC) return false;
  return c <= _hackAlcance();
}

function hackRotarCelda(f, c){
  const m = _hackMini;
  if(m.rot >= m.maxRot){
    // sin rotaciones => fallo si no está completa
    if(!_hackRutaCompleta()){
      _hackIntrusionOk = false;
      _hackFase = 'resultado';
      _pintarFaseHack();
    }
    return;
  }
  m.grid[f][c].rot = (m.grid[f][c].rot + 1) % 4;
  m.rot++;
  _hackFX('inv_papel', 0.25);
  if(m.rot >= m.maxRot && !_hackRutaCompleta()){
    // gastó la última rotación sin cerrar
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  _miniInyeccion();
}

function hackConfirmarInyeccion(){
  if(_hackRutaCompleta()){
    _hackFX('inv_acierto', 0.55);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
  }
}

// ============================================================
//  FASE 3 — LIMPIEZA (minijuego secundario opcional)
//  Único tipo por ahora: 'rastros' (borrar logs culpables).
// ============================================================
function _pintarLimpieza(){
  const c = _hackContrato;
  const tipo = c.limpieza ? c.limpieza.tipo : null;
  if(tipo === 'rastros') return _miniRastros();
  _hackLimpiezaOk = true;
  _hackFase = 'resultado';
  _pintarFaseHack();
}

function _miniRastros(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.limpieza;
  if(!_hackMini || !_hackMini._rastros){
    _hackMini = { _rastros:true, marcados:{}, confirmado:false };
  }
  const m = _hackMini;
  let html = _hackHud('LIMPIEZA DE RASTROS');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  html += '<div class="hack-logs">';
  (cfg.logs || []).forEach((log, i) => {
    const sel = m.marcados[i] ? ' hack-log-sel' : '';
    html += '<div class="hack-log' + sel + '" onclick="hackMarcarLog(' + i + ')">'
      + '<span class="hack-log-box">' + (m.marcados[i] ? '✕' : '·') + '</span>'
      + '<span class="hack-log-txt">' + log.txt + '</span></div>';
  });
  html += '</div>';
  html += '<div class="hack-mini-desc" style="opacity:.7;">Marca los registros que delatan tu intrusión. Luego ejecuta el borrado.</div>';
  html += '<button class="btn-terminal" onclick="hackConfirmarRastros()">BORRAR MARCADOS →</button>';
  html += '</div>';
  cont.innerHTML = html;
}

function hackMarcarLog(i){
  const m = _hackMini;
  m.marcados[i] = !m.marcados[i];
  _hackFX('inv_papel', 0.25);
  _miniRastros();
}

function hackConfirmarRastros(){
  const cfg = _hackContrato.limpieza;
  const m = _hackMini;
  let perfecto = true;
  (cfg.logs || []).forEach((log, i) => {
    const marcado = !!m.marcados[i];
    if(log.culpable && !marcado) perfecto = false;   // dejó un rastro suyo
    if(!log.culpable && marcado) perfecto = false;   // borró tráfico legítimo
  });
  _hackLimpiezaOk = perfecto;
  _hackFX(perfecto ? 'inv_acierto' : 'inv_fallo', 0.5);
  _hackFase = 'resultado';
  _pintarFaseHack();
}

// ============================================================
//  FASE 4 — RESULTADO (recompensa + consecuencias)
// ============================================================
function _pintarResultado(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const c = _hackContrato;
  const ok = _hackIntrusionOk === true;

  // multiplicador de paga: éxito base 1.0; limpieza perfecta +0.25; limpieza fallida -0.2
  let mult = ok ? 1.0 : 0.0;
  let notaLimpieza = '';
  if(ok && c.limpieza){
    if(_hackLimpiezaOk === true){ mult += 0.25; notaLimpieza = 'Sin rastro. El cliente paga la prima por trabajo limpio.'; }
    else { mult -= 0.2; notaLimpieza = 'Dejaste cabos sueltos. Cobras, pero menos: alguien podría tirar del hilo.'; }
  }
  const paga = Math.max(0, Math.round((c.pagaBase || 0) * mult));
  const progreso = ok ? (c.progreso || 0) : Math.round((c.progreso || 0) * 0.2);

  let ascenso = null;
  if(typeof otorgarRecompensaProfesion === 'function'){
    const r = otorgarRecompensaProfesion(HACK_PROF_ID, paga, progreso);
    if(r && r.ascendio) ascenso = r.rangoNuevo;
  }

  // reputación de facción (solo si éxito y hay facción)
  if(ok && c.faccion && typeof cambiarRepFaccion === 'function'){
    const delta = (c.faccion === 'helix') ? -2 : 2; // ayudar contra HELIX la enfada un poco
    try { cambiarRepFaccion(c.faccion, delta); } catch(e){}
  }

  // eco en noticias (solo si éxito y el contrato lo define)
  if(ok && c.eco && typeof marcarEcoProfesion === 'function'){
    marcarEcoProfesion(c.eco);
  }

  if(ok) _marcarHackHecho(c.id);

  _hackFX(ok ? 'inv_acierto' : 'inv_fallo', 0.5);

  let html = _hackHud(ok ? 'CONTRATO CERRADO' : 'INTRUSIÓN FALLIDA');
  html += '<div class="caso-desenlace' + (ok ? '' : ' caso-desenlace-malo') + '">'
    + '<div class="caso-narr">' + (ok ? c.exito.narr : c.fallo.narr) + '</div>';
  if(notaLimpieza) html += '<div class="caso-narr" style="opacity:.75;margin-top:.5rem;">' + notaLimpieza + '</div>';
  html += '<div class="caso-recompensa"><div>PAGA: ' + paga + ' CR</div>';
  if(ascenso) html += '<div class="caso-ascenso">ASCENSO · ' + ascenso + '</div>';
  html += '</div></div>';
  html += '<button class="btn-terminal" onclick="hackCerrarResuelto()">VOLVER A LA RED →</button>';
  cont.innerHTML = html;
  if(typeof guardarPartida === 'function') guardarPartida();
}

// ============================================================
//  SALIDAS / NAVEGACIÓN
// ============================================================
function hackAbandonar(){
  _hackContrato = null; _hackFase = 'contacto'; _hackMini = null;
  _pintarTablonHack();
}
function hackCerrarResuelto(){
  _hackContrato = null; _hackFase = 'contacto'; _hackMini = null;
  _pintarTablonHack();
}
function cerrarRedHacker(){
  _hackFX('terminal_cerrar', 0.45);
  const destino = _hackVolverA || 'apartamento';
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('hack-escena', destino);
  } else {
    const e = document.getElementById('hack-escena');
    if(e) e.classList.remove('activa');
    const d = document.getElementById(destino);
    if(d) d.classList.add('activa');
  }
}

// Exports
if(typeof window !== 'undefined'){
  window.abrirRedHacker = abrirRedHacker;
  window.aceptarHack = aceptarHack;
  window.hackEmpezarIntrusion = hackEmpezarIntrusion;
  window.hackProbarFuerzaBruta = hackProbarFuerzaBruta;
  window.hackProbarCesar = hackProbarCesar;
  window.hackProbarSustitucion = hackProbarSustitucion;
  window.hackRotarCelda = hackRotarCelda;
  window.hackConfirmarInyeccion = hackConfirmarInyeccion;
  window.hackMarcarLog = hackMarcarLog;
  window.hackConfirmarRastros = hackConfirmarRastros;
  window.hackAbandonar = hackAbandonar;
  window.hackCerrarResuelto = hackCerrarResuelto;
  window.cerrarRedHacker = cerrarRedHacker;
}
