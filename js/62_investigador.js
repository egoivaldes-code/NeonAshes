// ============================================================
//  NEON ASHES — INVESTIGADOR PRIVADO (v0.95)
//  Profesión narrativa. Trabaja por CASOS, no por tiradas.
//
//  Flujo: abrir tablón → elegir caso del POOL (según rango/peligro) →
//  recorrer ESCENAS encadenadas (con entrevistas: presionar / empatizar
//  / mentir / sobornar) que dejan PISTAS → DEDUCCIÓN final (quién / por
//  qué / cómo) → desenlace y recompensa.
//
//  Si aciertas del todo: paga completa + reputación + progreso de rango.
//  Acierto parcial: cobras menos. Fallo grave: final malo narrativo
//  (alguien inocente paga el pato) y poca o ninguna paga.
//
//  El contenido de los casos es hand-authored (escrito a mano). El motor
//  está listo para más casos: basta añadirlos a CASOS_INVESTIGADOR.
// ============================================================

// ── Estado del caso en curso ────────────────────────────────
let _casoActivo = null;     // copia del caso aceptado
let _casoEscena = null;     // id de la escena actual
let _casoPistas = {};       // { idPista: true } pistas reunidas
let _casoVisitadas = {};    // escenas ya visitadas (para no repetir cobros)
let _casoVolverA = 'apartamento';
let _casoDiligencias = 0;   // diligencias restantes antes de cierre forzado
let _casoDiligMax = 0;      // total de diligencias del caso

const INV_PROF_ID = 'investigador';

// Helper de sonido: respeta el sistema global de audio.
function _invFX(clave, vol){
  if(typeof reproducirFX === 'function') reproducirFX(clave, vol);
}

// ── Helpers de pistas ────────────────────────────────────────
function _casoTienePista(id){ return !!_casoPistas[id]; }
function _casoDarPista(id){
  if(!id) return;
  if(!_casoPistas[id]){
    _casoPistas[id] = true;
    _invFX('inv_pista', 0.5);   // chasquido de dato registrado
  }
}
function _casoNumPistas(){ return Object.keys(_casoPistas).length; }

// ============================================================
//  POOL DE CASOS
//  Cada caso: id, titulo, contratante, peligro (0-5), pagaBase,
//  rangoMin (índice de rango requerido), intro, escenas{}, deduccion{}.
//  En esta primera entrega hay un caso completo de ejemplo y un par de
//  entradas "en preparación" para que el tablón se vea poblado.
// ============================================================
const CASOS_INVESTIGADOR = [
  {
    id: 'expediente_gris',
    titulo: 'EXPEDIENTE EN GRIS',
    contratante: 'Aseguradora Demeter (subcontrata de HELIX)',
    peligro: 1,
    pagaBase: 220,
    progreso: 90,
    rangoMin: 0,
    diligencias: 6,   // acciones de investigación antes del cierre forzado
    resumen: 'Un técnico de mantenimiento aparece muerto en un conducto de las capas bajas. HELIX lo cerró como accidente en doce minutos. La aseguradora —que no quiere pagar la indemnización a la viuda— te paga para "confirmar que fue accidente". Averigua qué pasó de verdad.',
    intro: 'El despacho de la aseguradora Demeter huele a ambientador y a mentira corporativa. Una gestora con sonrisa de plástico desliza un expediente sobre la mesa. "Calix Ndour, 44 años, técnico de mantenimiento. Lo encontraron en el conducto V-9. HELIX dictaminó accidente. Solo necesitamos que usted lo confirme por escrito y cobra. Es una formalidad." La palabra "formalidad" se queda flotando, demasiado lisa. Si lo encontraran asesinado, la póliza obligaría a pagar el triple a la viuda. Por eso te pagan a ti, y no a un forense de verdad.\n\nNo tendrás tiempo para mirarlo todo. HELIX cierra los expedientes incómodos rápido. Elige bien dónde miras.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'El expediente es delgado. Una foto del conducto V-9, una nota de HELIX de doce líneas y un certificado de defunción firmado a las 03:14, apenas veinte minutos después de hallar el cuerpo. Nadie firma un certificado tan rápido salvo que ya supiera qué escribir. Cada paso que des consume tiempo, y el caso no esperará para siempre. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Ir al lugar: el conducto V-9', va: 'escena_conducto' },
          { txt: 'Hablar con la viuda, Ama Ndour', va: 'escena_viuda' },
          { txt: 'Buscar al capataz del turno, Renko', va: 'escena_capataz' },
          { txt: 'Tirar del rumor: dicen que Calix tenía deudas', va: 'escena_rumor' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_conducto: {
        tiempo: 90,
        narr: 'El conducto V-9 sigue precintado con cinta de HELIX, pero nadie vigila un sitio que ya han decidido olvidar. Bajas. El aire sabe a humedad y a ozono quemado, y el goteo constante marca un ritmo que no es el tuyo. En el suelo, la marca de tiza donde estuvo el cuerpo. A cuatro metros, un panel eléctrico con marcas de manipulación recientes. Y en el borde de la pasarela superior, un arañazo profundo. Hay varias cosas que mirar, pero no tendrás aliento para todas.',
        opciones: [
          { txt: 'Examinar el panel eléctrico forzado', va: 'escena_conducto', cuesta:true, msg: 'Los tornillos tienen marcas de un destornillador de impacto, no de la herramienta reglamentaria. Quien lo abrió tenía prisa. El panel controla la luz de todo el tramo: si saltaba, el conducto quedaba a oscuras el tiempo justo para que un hombre no viera venir el empujón.', da:'panel_forzado'},
          { txt: 'Seguir el arañazo del borde', va: 'escena_conducto', cuesta:true, msg: 'No es de una caída: es de un cuerpo arrastrado hasta el filo y soltado. Calix no se desplomó andando. Alguien lo llevó hasta ahí cuando ya no podía caminar solo.', da:'arrastre' },
          { txt: 'Revisar el termo y los efectos personales', va: 'escena_conducto', cuesta:true, msg: 'Su termo, intacto, huele a café frío, no a alcohol. Quien quiera vender lo del "borracho que resbaló" miente: Calix estaba sobrio esa noche.', da:'sobrio' },
          { txt: '← Volver', va: 'briefing' }
        ]
      },
      escena_viuda: {
        tiempo: 60,
        narr: 'Ama Ndour vive dos niveles más abajo, en un cubículo con olor a té y a ropa secándose. No llora; ya ha llorado bastante. "Calix no bebía en el turno. Llevaba veinte años en ese conducto, conocía cada tubo. ¿Que se cayó? No me hagan reír." Te mira con una dureza cansada. "La semana pasada volvió raro. Dijo que había visto algo en los registros que no cuadraba." Aquí decides cómo seguir; cada enfoque gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "Sé que nadie la está escuchando. Yo sí."', tono:'empatizar', cuesta:true, va:'escena_viuda', da:'sector_b7', msg:'Algo se afloja en su cara. "Anotó un sector antes de salir el último día: B-7. Lo escondió como si quemara." Te da el papel arrugado. Es concreto, verificable, y ella no gana nada inventándolo.' },
          { txt: '[PRESIONAR] "¿Tiene pruebas o solo rencor?"', tono:'presionar', cuesta:true, va:'escena_viuda', da:null, msg:'Se cierra como una puerta blindada. "Fuera de mi casa." Pierdes su confianza; no sacarás nada más de ella.', marca:'viuda_hostil' },
          { txt: '[SOBORNAR] Ofrecerle 30 CR por lo que sepa', tono:'sobornar', coste:30, cuesta:true, va:'escena_viuda', da:'sector_b7', msg:'Mira los créditos con desprecio, pero los coge. "Sector B-7. Lo escribió y lo escondió. Ahora váyase." Funciona, pero te sientes parte del problema.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_capataz: {
        tiempo: 60,
        narr: 'Renko, el capataz del turno, te recibe en una garita con tres pantallas y una petaca mal escondida. Suda aunque hace frío. "¿Otro que viene a remover el tema Ndour? Fue un accidente. Resbaló. Pasa." No te mira a los ojos, y sus dedos tamborilean sobre la mesa. Parece el culpable más obvio del mundo. Demasiado obvio, quizá.',
        entrevista: true,
        opciones: [
          { txt: '[PRESIONAR] "El certificado se firmó en 20 minutos. ¿Quién corrió tanto?"', tono:'presionar', cuesta:true, va:'escena_capataz', da:'firma_apresurada', msg:'Renko traga saliva. "Yo solo reporté lo que me dijeron que reportara. HELIX quería el conducto reabierto esa misma noche. Producción no espera a un muerto." Admite que hubo prisa de arriba por enterrarlo.' },
          { txt: '[EMPATIZAR] "Sé que tú también tienes miedo de alguien."', tono:'empatizar', cuesta:true, va:'escena_capataz', da:'renko_obedecio', msg:'Renko se derrumba. "Tengo familia. Me dijeron que cerrara el parte y no mirara el sector B-7. No pregunté de quién venía la orden. Aquí no se pregunta." No mató a nadie: obedeció y calló. El miedo no es culpa.' },
          { txt: '[MENTIR] "Tengo un testigo que te vio empujarlo, Renko."', tono:'mentir', cuesta:true, va:'escena_capataz', da:'renko_culpable_falso', msg:'Renko entra en pánico. "¡Vale, vale! Yo... yo discutí con él esa noche, ¿sí? Pero no lo toqué, lo juro." Tienes una confesión de que discutieron. Suena a culpa. Pero un hombre aterrado dice lo que sea para que pares: ¿confiesa un crimen o solo su miedo?', señalSutil:true, azar:{prob:0.9} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rumor: {
        tiempo: 60,
        narr: 'En el bar de la esquina del sector, un compañero de turno de Calix te suelta, entre trago y trago, que "todo el mundo sabía" que Calix debía dinero a gente fea. Lo dice rápido, sin que se lo preguntes, como si tuviera ganas de que alguien lo anotara. Demasiadas ganas.',
        opciones: [
          { txt: 'Anotar la pista de las deudas de juego', va:'escena_rumor', cuesta:true, da:'deudas_juego', señalSutil:true, msg:'Lo apuntas: deudas de juego, posible ajuste de cuentas. Encaja con un asesinato cualquiera de las capas bajas. Encaja demasiado bien, y llega demasiado servido. ¿Quién se beneficia de que mires hacia las apuestas y no hacia HELIX?' },
          { txt: 'Preguntar quién le mandó contarte esto', va:'escena_rumor', cuesta:true, da:'rumor_plantado', msg:'El hombre se pone nervioso. "Nadie, nadie, yo solo... oí cosas." Miente fatal. Alguien le pagó el turno de copas para que sembrara la idea de las deudas. El rumor está plantado: es humo para tapar otra cosa.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    // ── DEDUCCIÓN: quién / por qué / cómo ──
    deduccion: {
      intro: 'Te sientas con lo que has podido reunir —que no es todo— y con lo que el caso quería que creyeras. La aseguradora quiere la palabra "accidente". Alguien quiere que mires hacia las deudas. Renko parece culpable, pero el miedo no es lo mismo que la culpa. Separa el grano de la paja. Firma una conclusión. Solo una.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN mató a Calix Ndour?',
          opciones: [
            { txt: 'Nadie: fue un accidente real', correcta:false },
            { txt: 'Seguridad interna de HELIX, por orden de arriba', correcta:true },
            { txt: 'El capataz Renko, en una discusión', correcta:false },
            { txt: 'Acreedores por sus deudas de juego', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo mataron?',
          opciones: [
            { txt: 'Vio algo en los registros del sector B-7 que no debía', correcta:true },
            { txt: 'Una deuda de juego que no pudo pagar', correcta:false },
            { txt: 'Una discusión laboral que se fue de las manos', correcta:false },
            { txt: 'Por error, lo confundieron con otro', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO lo hicieron?',
          opciones: [
            { txt: 'Cortaron la luz, lo empujaron y simularon la caída', correcta:true },
            { txt: 'Una paliza que acabó mal', correcta:false },
            { txt: 'Un fallo eléctrico fortuito', correcta:false },
            { txt: 'Se desplomó por agotamiento', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA VERDAD',
          narr: 'Lo tienes. Calix vio en los registros del sector B-7 algo que HELIX necesitaba enterrado. Seguridad interna cortó la luz del conducto, lo empujó desde la pasarela y dejó que la gravedad firmara el parte. Las deudas eran humo plantado; Renko, solo un hombre asustado. La aseguradora te pidió la palabra "accidente"; les entregas la palabra "homicidio". No la van a usar —les cuesta el triple— pero tú sabes la verdad, y la viuda también la sabrá. A veces eso es lo único que un muerto pobre puede permitirse: que alguien lo sepa.',
          pagaMult: 1.0, rep: 6, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Entregas un informe que apunta en la dirección correcta, pero con cabos sueltos que un abogado de la aseguradora deshace en una tarde. Rebajan tu conclusión a "circunstancias no concluyentes" y archivan el resto. Cobras, pero menos: una verdad incompleta vale poco en este mercado. Ama Ndour recibe una indemnización parcial. "Gracias por intentarlo", dice, y la palabra "intentarlo" te acompaña hasta casa.',
          pagaMult: 0.5, rep: 2, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL PATO EQUIVOCADO',
          narr: 'Te tragaste el anzuelo. Tu informe apunta a las deudas o a Renko —justo donde alguien quería que mirases— y la verdadera causa queda enterrada con Calix, en un conducto que reabrieron esa misma noche para no perder un turno. Si señalaste a Renko, HELIX lo usa de chivo expiatorio: lo despiden, le quitan la vivienda y desaparece de las capas bajas en una semana. La aseguradora te paga una miseria por un caso "resuelto" y te estrecha la mano. Esa noche entiendes que has hecho el trabajo sucio de alguien con traje. Y que lo harás otra vez, porque hay que comer.',
          pagaMult: 0.15, rep: -5, parcial:false, malo:true
        }
      }
    }
  },
  // ── Entradas "en preparación" para poblar el tablón ──
  {
    id: '_wip_chantaje', titulo: 'LA VOZ EN LA LÍNEA MUERTA', contratante: 'Anónimo · pago en efectivo',
    peligro: 2, pagaBase: 380, rangoMin: 1, enPreparacion: true,
    resumen: 'Alguien chantajea a un ejecutivo medio de HELIX con grabaciones que no deberían existir. Quiere saber quién, antes de que sea tarde.'
  },
  {
    id: '_wip_cero', titulo: 'EL TESTIGO QUE NO RECUERDA', contratante: 'HELIX · División de Anomalías',
    peligro: 4, pagaBase: 900, rangoMin: 3, enPreparacion: true,
    resumen: 'Tres desapariciones en el mismo sector. El único testigo dice que "algo lo llamó por su nombre antes de nacer". HELIX quiere silencio, no respuestas.'
  }
];

const CASOS_POR_ID = {};
CASOS_INVESTIGADOR.forEach(c => { CASOS_POR_ID[c.id] = c; });

// ============================================================
//  ABRIR / PINTAR EL TABLÓN DE CASOS
// ============================================================
function abrirCasos(volverA){
  _casoVolverA = volverA || 'apartamento';
  // Cerrar el panel de Trabajos/hub para que la escena de casos no quede
  // detrás (mismo patrón que abrirRefinado).
  if(typeof cerrarPanelHub === 'function'){ try { cerrarPanelHub(); } catch(e){} }
  // Si hay un caso en curso, retomarlo; si no, mostrar el tablón.
  if(typeof saltoDeEscena === 'function') saltoDeEscena();
  const desde = document.querySelector('.escena.activa');
  const idDesde = desde ? desde.id : _casoVolverA;
  if(typeof cambiarEscena === 'function'){
    cambiarEscena(idDesde, 'casos-escena');
  } else {
    if(desde) desde.classList.remove('activa');
    const e = document.getElementById('casos-escena');
    if(e) e.classList.add('activa');
  }
  if(_casoActivo) _pintarEscenaCaso();
  else { _invFX('panel_abrir', 0.5); _pintarTablon(); }
  return true;
}

function _pintarTablon(){
  const cont = document.getElementById('casos-wrap');
  if(!cont) return;
  const rango = (typeof rangoActualProfesion === 'function') ? rangoActualProfesion(INV_PROF_ID) : 0;
  let html = '<div class="casos-cab"><div class="casos-titulo">TABLÓN DE CASOS</div>'
    + '<div class="casos-sub">Todo deja un rastro. Solo quien paga obtiene una respuesta.</div></div>';
  html += '<div class="casos-lista">';
  CASOS_INVESTIGADOR.forEach(c => {
    const bloqueadoRango = (c.rangoMin || 0) > rango;
    const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
    const yaResuelto = _casoEstaResuelto(c.id);
    let estado = '';
    if(c.enPreparacion) estado = '<span class="casos-wip">EXPEDIENTE SELLADO</span>';
    else if(yaResuelto) estado = '<span class="casos-hecho">CERRADO</span>';
    html += '<div class="caso-card' + (bloqueadoRango || c.enPreparacion ? ' caso-bloq' : '') + '">'
      + '<div class="caso-card-top"><span class="caso-titulo">' + c.titulo + '</span>' + estado + '</div>'
      + '<div class="caso-contratante">' + c.contratante + '</div>'
      + '<div class="caso-resumen">' + c.resumen + '</div>'
      + '<div class="caso-meta"><span class="caso-peligro">PELIGRO ' + peligro + '</span>'
      + '<span class="caso-paga">≈ ' + (c.pagaBase || 0) + ' CR</span></div>';
    if(c.enPreparacion){
      html += '<div class="caso-nota">Aún no puedes acceder a este expediente.</div>';
    } else if(bloqueadoRango){
      html += '<div class="caso-nota">Requiere más reputación como investigador.</div>';
    } else if(yaResuelto){
      html += '<div class="caso-nota">Ya cerraste este caso.</div>';
    } else {
      html += '<button class="btn-terminal caso-aceptar" onclick="aceptarCaso(\'' + c.id + '\')">ACEPTAR CASO →</button>';
    }
    html += '</div>';
  });
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="cerrarCasos()">← SALIR DEL TABLÓN</button>';
  cont.innerHTML = html;
}

// ¿El caso ya se cerró en esta partida? (se guarda en memoria)
function _casoEstaResuelto(id){
  return !!(Estado.memoria && Estado.memoria.casosResueltos && Estado.memoria.casosResueltos[id]);
}
function _marcarCasoResuelto(id){
  Estado.memoria = Estado.memoria || {};
  Estado.memoria.casosResueltos = Estado.memoria.casosResueltos || {};
  Estado.memoria.casosResueltos[id] = true;
}

// ============================================================
//  ACEPTAR Y RECORRER UN CASO
// ============================================================
function aceptarCaso(id){
  const c = CASOS_POR_ID[id];
  if(!c || c.enPreparacion) return;
  _invFX('inv_papel', 0.55);   // abres el expediente
  _casoActivo = c;
  _casoPistas = {};
  _casoVisitadas = {};
  _casoDiligMax = c.diligencias || 6;
  _casoDiligencias = _casoDiligMax;
  _casoEscena = c.escenaInicial || Object.keys(c.escenas)[0];
  _pintarEscenaCaso(c.intro);
}

function _pintarEscenaCaso(introExtra){
  const cont = document.getElementById('casos-wrap');
  if(!cont || !_casoActivo) return;
  const c = _casoActivo;

  // Escena especial: deducción.
  if(_casoEscena === '_deduccion'){ _pintarDeduccion(); return; }

  const esc = c.escenas[_casoEscena];
  if(!esc){ _pintarTablon(); return; }

  // Al entrar por primera vez en una escena: otorgar pistas automáticas
  // y consumir tiempo de juego.
  if(!_casoVisitadas[_casoEscena]){
    _casoVisitadas[_casoEscena] = true;
    (esc.pistasAlEntrar || []).forEach(p => _casoDarPista(p));
    if(esc.tiempo && typeof avanzarTiempoJuego === 'function'){
      avanzarTiempoJuego(esc.tiempo);
      if(typeof comprobarCobrosDiarios === 'function') comprobarCobrosDiarios();
    }
  }

  const pistasN = _casoNumPistas();
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">PISTAS ' + pistasN + ' · DILIGENCIAS ' + _casoDiligencias + '/' + _casoDiligMax + '</span></div>';

  if(introExtra){
    html += '<div class="caso-intro">' + introExtra + '</div>';
  }
  html += '<div class="caso-narr">' + esc.narr + '</div>';

  html += '<div class="caso-opciones">';
  (esc.opciones || []).forEach((op, i) => {
    // Opción que requiere un mínimo de pistas (p.ej. pasar a deducción).
    if(op.requierePistas && pistasN < op.requierePistas){
      html += '<button class="opcion-btn caso-op-bloq" disabled>' + op.txt
        + ' <span class="caso-op-nota">(necesitas ' + op.requierePistas + ' pistas)</span></button>';
      return;
    }
    // Opción de entrevista ya agotada por hostilidad.
    if(op.marca && _casoActivo._marcas && _casoActivo._marcas[op.marca]){
      return;
    }
    // Opción de investigación ya usada (no repetir pista ni gastar de nuevo).
    if(op.cuesta && _casoActivo._usadas && _casoActivo._usadas[_casoEscena + ':' + i]){
      return;
    }
    html += '<button class="opcion-btn" onclick="elegirOpcionCaso(' + i + ')">' + op.txt + '</button>';
  });
  html += '</div>';

  cont.innerHTML = html;
}

function elegirOpcionCaso(i){
  const c = _casoActivo;
  if(!c) return;
  const esc = c.escenas[_casoEscena];
  if(!esc) return;
  const op = (esc.opciones || [])[i];
  if(!op) return;

  // Coste de soborno.
  if(op.coste){
    const saldo = Estado.creditos || 0;
    if(saldo < op.coste){
      _toastCaso('No te llega para eso (' + op.coste + ' CR).');
      return;
    }
    if(typeof ajustarCreditos === 'function') ajustarCreditos(-op.coste);
  }

  // ── DILIGENCIAS (v0.96): las opciones de investigación (cuesta:true)
  //    consumen una diligencia. Las de navegación (Volver) no. ──
  let agotado = false;
  if(op.cuesta){
    // marcar esta opción como usada para no repetirla
    c._usadas = c._usadas || {};
    c._usadas[_casoEscena + ':' + i] = true;
    _casoDiligencias = Math.max(0, _casoDiligencias - 1);
    if(_casoDiligencias <= 0) agotado = true;
  }

  // Tirada de azar (p.ej. el farol al mentir).
  let exito = true;
  if(op.azar && typeof op.azar.prob === 'number'){
    exito = Math.random() < op.azar.prob;
  }

  // Dar pista (si la opción la concede y hubo éxito).
  if(exito && op.da) _casoDarPista(op.da);

  // Marca de estado (p.ej. viuda hostil: cierra la vía).
  if(op.marca){
    c._marcas = c._marcas || {};
    c._marcas[op.marca] = true;
  }

  // Mensaje de resultado.
  let msg = exito ? (op.msg || '') : (op.msgFallo || 'No cuela. Se cierra en banda y no sacas nada.');

  // Si se agotaron las diligencias, el caso se cierra y vas a la deducción.
  if(agotado){
    msg += '<br><br><span class="caso-aviso-cierre">El tiempo se ha agotado. HELIX cierra el expediente. Tendrás que concluir con lo que tienes.</span>';
    _invFX('inv_deduccion', 0.45);
    _casoEscena = '_deduccion';
    _pintarDeduccion(msg);
    return;
  }

  // Navegar.
  const destino = op.va || _casoEscena;
  if(destino === '_deduccion'){
    _casoEscena = '_deduccion';
    _pintarDeduccion(msg);
    return;
  }
  _casoEscena = destino;
  _pintarEscenaCaso(msg || null);
}

// ============================================================
//  DEDUCCIÓN FINAL
// ============================================================
let _deduccionRespuestas = {};
let _deduccionEntrada = false;
function _pintarDeduccion(introExtra){
  const cont = document.getElementById('casos-wrap');
  if(!cont || !_casoActivo) return;
  const ded = _casoActivo.deduccion;
  if(!ded){ _pintarTablon(); return; }
  if(!_deduccionEntrada){ _deduccionEntrada = true; _invFX('inv_deduccion', 0.45); }
  _deduccionRespuestas = _deduccionRespuestas || {};

  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + _casoActivo.titulo + '</span>'
    + '<span class="caso-hud-pistas">DEDUCCIÓN</span></div>';
  if(introExtra) html += '<div class="caso-intro">' + introExtra + '</div>';
  html += '<div class="caso-narr">' + ded.intro + '</div>';

  ded.preguntas.forEach(preg => {
    html += '<div class="ded-bloque"><div class="ded-pregunta">' + preg.texto + '</div>';
    preg.opciones.forEach((opt, oi) => {
      const sel = (_deduccionRespuestas[preg.id] === oi) ? ' ded-sel' : '';
      html += '<button class="opcion-btn ded-op' + sel + '" onclick="marcarDeduccion(\'' + preg.id + '\',' + oi + ')">' + opt.txt + '</button>';
    });
    html += '</div>';
  });

  const todas = ded.preguntas.every(p => typeof _deduccionRespuestas[p.id] === 'number');
  html += '<button class="btn-terminal ded-firmar' + (todas ? '' : ' caso-op-bloq') + '"'
    + (todas ? '' : ' disabled') + ' onclick="firmarDeduccion()">FIRMAR CONCLUSIÓN →</button>';
  html += '<button class="opcion-btn ded-volver" onclick="volverDelDeduccion()">← Seguir investigando</button>';
  cont.innerHTML = html;
}

function marcarDeduccion(pregId, optIdx){
  _deduccionRespuestas[pregId] = optIdx;
  _pintarDeduccion();
}

function volverDelDeduccion(){
  _deduccionEntrada = false;
  _casoEscena = _casoActivo.escenaInicial || Object.keys(_casoActivo.escenas)[0];
  _pintarEscenaCaso();
}

function firmarDeduccion(){
  const c = _casoActivo;
  const ded = c.deduccion;
  let aciertos = 0;
  ded.preguntas.forEach(preg => {
    const idx = _deduccionRespuestas[preg.id];
    if(typeof idx === 'number' && preg.opciones[idx] && preg.opciones[idx].correcta) aciertos++;
  });
  const total = ded.preguntas.length;

  let clave = 'fallo';
  if(aciertos === total) clave = 'completo';
  else if(aciertos >= total - 1) clave = 'parcial';
  const des = ded.desenlaces[clave];
  // Sonido del desenlace.
  _invFX(clave === 'fallo' ? 'inv_fallo' : 'inv_acierto', 0.55);

  // Recompensa.
  const paga = Math.round((c.pagaBase || 0) * (des.pagaMult || 0));
  const progreso = (clave === 'completo') ? (c.progreso || 0)
                 : (clave === 'parcial') ? Math.round((c.progreso || 0) * 0.5)
                 : Math.round((c.progreso || 0) * 0.15);

  let ascenso = null;
  if(typeof otorgarRecompensaProfesion === 'function'){
    const r = otorgarRecompensaProfesion(INV_PROF_ID, paga, progreso);
    if(r && r.ascendio) ascenso = r.rangoNuevo;
  }
  if(des.rep && typeof cambiarRepFaccion === 'function'){
    // El trabajo sucio para la aseguradora cuenta como favor/desfavor a HELIX.
    cambiarRepFaccion('helix', des.rep);
  }
  _marcarCasoResuelto(c.id);

  // Pintar desenlace.
  const cont = document.getElementById('casos-wrap');
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">' + (aciertos) + '/' + total + '</span></div>';
  html += '<div class="caso-desenlace' + (des.malo ? ' caso-desenlace-malo' : '') + '">'
    + '<div class="caso-desenlace-titulo">' + des.titulo + '</div>'
    + '<div class="caso-narr">' + des.narr + '</div>';
  html += '<div class="caso-recompensa">';
  html += '<div>PAGA: ' + paga + ' CR</div>';
  if(ascenso) html += '<div class="caso-ascenso">ASCENSO · ' + ascenso + '</div>';
  html += '</div></div>';
  html += '<button class="btn-terminal" onclick="cerrarCasoResuelto()">CERRAR EXPEDIENTE →</button>';
  cont.innerHTML = html;

  if(typeof guardarPartida === 'function') guardarPartida();
}

function cerrarCasoResuelto(){
  // Limpiar marcas/usadas del caso (el objeto vive en el pool y se reutiliza).
  if(_casoActivo){ delete _casoActivo._usadas; delete _casoActivo._marcas; }
  _casoActivo = null;
  _casoEscena = null;
  _casoPistas = {};
  _casoVisitadas = {};
  _casoDiligencias = 0;
  _casoDiligMax = 0;
  _deduccionRespuestas = {};
  _deduccionEntrada = false;
  _pintarTablon();
}

// ============================================================
//  SALIR
// ============================================================
function cerrarCasos(){
  _invFX('terminal_cerrar', 0.45);
  const destino = _casoVolverA || 'apartamento';
  if(typeof cambiarEscena === 'function'){
    cambiarEscena('casos-escena', destino);
  } else {
    const e = document.getElementById('casos-escena');
    if(e) e.classList.remove('activa');
    const d = document.getElementById(destino);
    if(d) d.classList.add('activa');
  }
}

function _toastCaso(txt){
  if(typeof aviso === 'function'){ aviso(txt); return; }
  if(typeof notificarCambio === 'function'){ notificarCambio(txt, 'info'); return; }
}

// Exports
if(typeof window !== 'undefined'){
  window.abrirCasos = abrirCasos;
  window.aceptarCaso = aceptarCaso;
  window.elegirOpcionCaso = elegirOpcionCaso;
  window.marcarDeduccion = marcarDeduccion;
  window.firmarDeduccion = firmarDeduccion;
  window.volverDelDeduccion = volverDelDeduccion;
  window.cerrarCasoResuelto = cerrarCasoResuelto;
  window.cerrarCasos = cerrarCasos;
}
