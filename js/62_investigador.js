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

// ── Recolector de metadatos de pistas (para EL MURO) ─────────
// Recorre las escenas del caso activo y devuelve, para cada pista
// reunida, su id, su etiqueta de tarjeta y si es humo (señalSutil).
// 'etiqueta' es opcional en los datos; si falta, se deriva del texto.
function _recogerPistasParaMuro(){
  const out = [];
  if(!_casoActivo || !_casoActivo.escenas) return out;
  const vistos = {};
  Object.keys(_casoActivo.escenas).forEach(eid => {
    const esc = _casoActivo.escenas[eid];
    if(!esc || !esc.opciones) return;
    esc.opciones.forEach(op => {
      if(!op.da) return;
      if(!_casoPistas[op.da]) return;       // solo las reunidas
      if(vistos[op.da]) return;             // sin duplicar
      vistos[op.da] = true;
      let etiqueta = op.etiqueta;
      if(!etiqueta){
        // Derivar una etiqueta breve a partir del texto de la opción,
        // quitando prefijos de tono tipo "[EMPATIZAR] ".
        etiqueta = (op.txt || op.da).replace(/^\[[^\]]+\]\s*/, '');
        if(etiqueta.length > 64) etiqueta = etiqueta.slice(0, 61) + '…';
      }
      out.push({ id: op.da, etiqueta: etiqueta, humo: !!op.señalSutil, msg: op.msg || '' });
    });
  });
  return out;
}

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
  // ============================================================
  //  CASO 2 — LA VOZ EN LA LÍNEA MUERTA
  //  Intriga corporativa. Un chantaje que no es lo que parece.
  // ============================================================
  {
    id: 'voz_linea_muerta',
    titulo: 'LA VOZ EN LA LÍNEA MUERTA',
    contratante: 'Anónimo · pago en efectivo',
    peligro: 2,
    pagaBase: 380,
    progreso: 110,
    rangoMin: 1,
    diligencias: 6,
    resumen: 'Un ejecutivo medio de HELIX recibe llamadas desde un número que pertenece a un hombre que murió hace un año. Una voz le repite cosas que solo él podría saber y le pide que no vaya a trabajar el jueves. Quiere saber quién está detrás antes de que sea tarde. No quiere a la policía. Solo a ti.',
    intro: 'El hombre que te contrata no da su nombre real y paga en metálico, billetes viejos que casi nadie acepta ya. Se hace llamar Doss. Coordinador de logística en HELIX, tercer anillo, un puesto lo bastante alto para tener algo que perder y lo bastante bajo para que nadie lo proteja. "Me llaman de noche", dice, y la taza de té le tiembla en la mano. "Desde el número de Edu Varga. Edu se tiró por un hueco de ventilación hace catorce meses. Yo fui a su entierro." La voz al teléfono le repite conversaciones privadas, decisiones que aún no ha tomado. Y desde hace tres noches, una sola frase: que no vaya a la oficina el jueves.\\n\\nHoy es martes. No vas a poder tirar de todos los hilos. Elige cuáles.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Doss te entrega su terminal y una lista corta de nombres. La voz conoce cosas que él jamás dijo en voz alta. Eso deja pocas posibilidades: o alguien lo escucha, o alguien lo conoce demasiado bien, o ambas. El jueves está cerca y cada paso te come tiempo. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Analizar las llamadas en el terminal de Doss', va: 'escena_terminal' },
          { txt: 'Visitar a la viuda de Edu Varga', va: 'escena_viuda_varga' },
          { txt: 'Sondear a la asistente de Doss, Wren', va: 'escena_asistente' },
          { txt: 'Tirar del rumor: dicen que Doss debe dinero', va: 'escena_rumor_doss' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_terminal: {
        tiempo: 90,
        narr: 'El terminal de Doss es un modelo corporativo, blindado por fuera y poroso por dentro, como casi todo en HELIX. Las llamadas entran de madrugada, siempre entre las 03:00 y las 03:40. El número es real: pertenecía a Eduardo Varga, dado de baja por defunción y nunca reasignado. Hay tres cosas que puedes mirar aquí, y no te dará el pulso para todas.',
        opciones: [
          { txt: 'Rastrear desde dónde se originan las llamadas', va:'escena_terminal', cuesta:true, da:'origen_interno', msg:'No vienen de fuera. El enrutado pasa por un repetidor del propio edificio de HELIX, planta de Doss. Quien llama está dentro, o tiene acceso a la red interna. La voz no viene del más allá: viene del pasillo de al lado.' },
          { txt: 'Escuchar el audio de las grabaciones guardadas', va:'escena_terminal', cuesta:true, da:'voz_sintetica', msg:'La voz es la de Edu Varga, sin duda. Pero hay un microcorte rítmico, cada pocas sílabas, que ningún ser humano hace al hablar. Es voz reconstruida: alguien alimentó un modelo con grabaciones viejas de Edu. No es un fantasma. Es un retrato hecho de sonido.' },
          { txt: 'Revisar qué pasa en la oficina ese jueves', va:'escena_terminal', cuesta:true, da:'auditoria_jueves', msg:'El jueves hay una auditoría interna de inventario en el almacén que Doss coordina. Rutina, en teoría. Salvo que Doss faltara: entonces sería otro quien firmara los albaranes ese día. La voz no quiere protegerlo. Quiere su silla vacía durante unas horas.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_viuda_varga: {
        tiempo: 60,
        narr: 'La viuda de Edu Varga, Senna, vive entre cajas a medio hacer; lleva un año a punto de mudarse y sin irse nunca. "¿Edu? Edu no se tiró", dice antes de que preguntes. "Le tenían miedo. Sabía cómo se movían las cifras del almacén, qué se perdía y a dónde iba." Te mira con la calma de quien ya no espera que la crean. Aquí decides el enfoque; cada uno gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "Cuénteme qué sabía Edu. Sin prisa."', tono:'empatizar', cuesta:true, va:'escena_viuda_varga', da:'edu_sabia_robo', msg:'Senna baja la voz. "Edu descubrió que en el almacén se desviaba material caro, en las auditorías. Alguien de dentro maquillaba los números esos días. Él guardó copias de su voz, notas de trabajo, todo, por si le pasaba algo. Cuando murió, esas grabaciones desaparecieron de su terminal." Concreto, verificable, y ella no gana nada al contarlo.' },
          { txt: '[PRESIONAR] "¿Tiene pruebas o es lo que quiere creer?"', tono:'presionar', cuesta:true, va:'escena_viuda_varga', da:null, msg:'Se levanta y abre la puerta. "Váyase. Llevo un año oyendo eso de gente con corbata." La pierdes; no sacarás nada más.', marca:'senna_hostil' },
          { txt: '[SOBORNAR] Ofrecerle 40 CR por las grabaciones que guarde', tono:'sobornar', coste:40, cuesta:true, va:'escena_viuda_varga', da:'edu_sabia_robo', msg:'Coge los créditos sin mirarte. "No me queda nada de él, se lo llevaron todo. Pero sé lo que sabía: el almacén, las auditorías, las cifras que no cuadraban. Por eso lo callaron." Funciona, aunque te deja un regusto amargo.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_asistente: {
        tiempo: 60,
        narr: 'Wren lleva seis años organizándole la agenda a Doss. Te recibe con una sonrisa profesional perfecta y una taza de café que no te ofrece. "El señor Doss trabaja demasiado. Lo del teléfono... yo creo que son los nervios." Es atenta, servicial, impecable. Tan impecable que cuesta encontrarle un borde por donde agarrarla.',
        entrevista: true,
        opciones: [
          { txt: '[PRESIONAR] "Usted maneja su agenda. ¿Quién más sabe lo que Doss va a hacer antes que él?"', tono:'presionar', cuesta:true, va:'escena_asistente', da:'wren_acceso', msg:'La sonrisa se le tensa un milímetro. "Yo solo cumplo mi función." Pero es verdad y lo sabéis los dos: Wren tiene acceso a todo lo que Doss dice, escribe y planea. Si la voz conoce sus decisiones antes que él, alguien con ese acceso está detrás. Ella es la que más cerca está.' },
          { txt: '[EMPATIZAR] "Seis años cuidando a un hombre que no se entera. Cansa, ¿verdad?"', tono:'empatizar', cuesta:true, va:'escena_asistente', da:'wren_cubre_jefe', msg:'Algo se ablanda. "Cansa que te traten como mobiliario." Hace una pausa larga. "El jueves de la auditoría... el señor Doss me pidió hace meses que le buscara un médico para faltar ese día concreto. Antes de las llamadas. Antes de todo." Te quedas con eso: Doss ya quería faltar el jueves antes de que ninguna voz se lo pidiera.', señalSutil:true },
          { txt: '[MENTIR] "Tengo un registro que la sitúa accediendo al número de Varga."', tono:'mentir', cuesta:true, va:'escena_asistente', da:'wren_culpable_falso', msg:'Wren palidece. "Yo... sí entré en los archivos de Varga, pero fue para cerrar su cuenta cuando murió, es protocolo, ¡yo no hago llamadas a nadie!" Tienes una confesión de que tocó los archivos de Edu. Suena a culpa. Pero cerrar la cuenta de un muerto es, justamente, su trabajo. ¿Es la culpable o solo alguien aterrada de perder el empleo?', señalSutil:true, azar:{prob:0.9} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rumor_doss: {
        tiempo: 60,
        narr: 'En la cantina de la planta, un compañero de Doss te suelta sin que preguntes que "todo el mundo sabe" que Doss anda metido en apuestas y debe dinero a gente turbia. Lo dice deprisa, con ganas de que lo apuntes, igual que si lo hubiera ensayado.',
        opciones: [
          { txt: 'Anotar la pista de las deudas de juego de Doss', va:'escena_rumor_doss', cuesta:true, da:'deudas_doss', señalSutil:true, msg:'Lo apuntas: Doss endeudado, posible acoso de acreedores disfrazado de fantasma. Encaja con una extorsión vulgar. Encaja demasiado limpio, y te llega demasiado servido. ¿A quién le conviene que mires hacia las deudas y no hacia el almacén?' },
          { txt: 'Preguntar quién le pidió que te contara esto', va:'escena_rumor_doss', cuesta:true, da:'rumor_plantado_doss', msg:'El hombre se atraganta. "Nadie, hombre, yo oigo cosas y ya." Miente fatal. Alguien le pagó las copas para que plantara la idea de las deudas. Es humo, una cortina para que no mires el almacén ni la auditoría.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo que has reunido y lo que el caso quería hacerte creer. Hay un muerto que sabía demasiado del almacén. Una voz que no es voz. Una silla que alguien quiere vacía el jueves. Y un rumor de deudas, servido en bandeja. Separa lo real del humo. Firma una conclusión. Solo una.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN está detrás de las llamadas?',
          opciones: [
            { txt: 'El fantasma de Edu Varga, literalmente', correcta:false },
            { txt: 'Alguien de dentro de HELIX que maquilla las auditorías del almacén', correcta:true },
            { txt: 'Acreedores cobrándose las deudas de juego de Doss', correcta:false },
            { txt: 'La asistente Wren, por rencor tras seis años', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ quieren a Doss fuera el jueves?',
          opciones: [
            { txt: 'Para desviar material durante la auditoría sin que él lo firme ni lo vea', correcta:true },
            { txt: 'Para cobrarle una deuda lejos de testigos', correcta:false },
            { txt: 'Para venganza personal de la viuda de Varga', correcta:false },
            { txt: 'Para ascender en su puesto aprovechando su ausencia', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO montaron el chantaje?',
          opciones: [
            { txt: 'Reconstruyeron la voz de Varga con sus grabaciones y llamaron desde la red interna', correcta:true },
            { txt: 'Recuperaron el teléfono real de Varga del más allá', correcta:false },
            { txt: 'Contrataron a un imitador de la voz de Varga', correcta:false },
            { txt: 'Hackearon a Doss desde fuera del edificio', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA SILLA VACÍA',
          narr: 'Lo tienes entero. Alguien de dentro lleva años desviando material caro durante las auditorías, maquillando las cifras los días señalados. Edu Varga lo descubrió y lo hicieron callar; sus grabaciones no desaparecieron, las robaron para fabricar con ellas una voz. Esa voz llamaba a Doss para vaciarle la silla el jueves y poder firmar los albaranes sin él delante. Las deudas eran humo plantado. Le entregas a Doss los nombres y el cómo. No va a la policía —en HELIX eso es suicidio— pero el jueves se presenta en el almacén con todo grabado, y por primera vez en catorce meses la voz de Edu Varga sirve para algo que Edu habría querido. No es justicia. Es una factura que alguien, por fin, va a tener que mirar.',
          pagaMult: 1.0, rep: 7, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Le das a Doss una verdad con agujeros: sabe que la voz es falsa y que la quieren fuera el jueves, pero no quién ni para qué exactamente. Falta el jueves a trabajar, asustado, y nunca sabrá qué pasó en su almacén ese día. Cobras menos: una sospecha no es una prueba, y aquí solo se paga lo demostrado. Doss te estrecha la mano con la mirada todavía hacia atrás, como quien aprende a dormir con la luz encendida.',
          pagaMult: 0.5, rep: 2, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL HUMO GANA',
          narr: 'Mordiste el anzuelo. Tu informe apunta a las deudas o a Wren —justo donde querían que mirases— y el almacén queda intacto para seguir sangrando turno a turno. Si señalaste a Wren, Doss la despide; seis años de lealtad terminan en una caja de cartón y un acceso revocado. El jueves Doss falta al trabajo, tranquilo, creyendo que ha esquivado a unos prestamistas. Nadie firma esos albaranes salvo quien quería firmarlos. Cobras tu parte y le estrechas la mano a un hombre que te da las gracias por no haber resuelto nada. La voz de Edu Varga seguirá llamando a otro.',
          pagaMult: 0.15, rep: -4, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 3 — EL TESTIGO QUE NO RECUERDA
  //  Roza lo cósmico. CERO no aparece: solo deja su sombra.
  // ============================================================
  {
    id: 'testigo_no_recuerda',
    titulo: 'EL TESTIGO QUE NO RECUERDA',
    contratante: 'HELIX · División de Anomalías',
    peligro: 4,
    pagaBase: 900,
    progreso: 220,
    rangoMin: 3,
    diligencias: 6,
    resumen: 'Tres personas han desaparecido del mismo sector muerto de las capas bajas, sin cuerpos, sin señales de lucha. El único testigo sobrevivió y no para de repetir una frase: que "algo lo llamó por su nombre antes de nacer". HELIX no quiere respuestas. Quiere que firmes que no pasó nada.',
    intro: 'La División de Anomalías de HELIX no figura en ningún organigrama público. Te recibe una mujer sin nombre en una sala sin ventanas, y deja claro desde el principio que no te contratan para resolver nada. "Tres bajas en el sector 0-G. Sin cuerpos. Un superviviente que ya no sirve para trabajar. Necesitamos un informe externo que diga, con su firma, que esto fue histeria colectiva y fuga de gas." Empuja hacia ti un sobre grueso. "Lo que no necesitamos es que entienda usted nada de lo que vea ahí abajo."\\n\\nEl sector 0-G lleva clausurado desde antes de que tú nacieras. No vas a poder examinarlo todo, y una parte de ti no quiere. Elige.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'El sobre contiene tres nombres, tres fechas y una grabación del testigo que no han podido borrarle de la cabeza. HELIX quiere la palabra "gas". El sector 0-G fue sellado por algo que los informes oficiales no nombran. Cada paso te acerca a algo que quizá no quieras tocar, y el tiempo abajo es prestado. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Bajar al sector clausurado 0-G', va: 'escena_sector' },
          { txt: 'Hablar con el único testigo, Bram', va: 'escena_testigo' },
          { txt: 'Revisar los registros de los tres desaparecidos', va: 'escena_registros' },
          { txt: 'Tirar del informe oficial: fuga de gas', va: 'escena_informe' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_sector: {
        tiempo: 90,
        narr: 'El sector 0-G huele a metal viejo y a un silencio que no es natural; aquí el goteo de las capas bajas no llega, como si el sonido también se hubiera marchado. Las luces de emergencia laten despacio. En las paredes, alguien grabó símbolos a mano, los mismos una y otra vez, mucho antes de las desapariciones. Hay tres cosas que examinar, y no aguantarás abajo para las tres.',
        opciones: [
          { txt: 'Estudiar los símbolos grabados en las paredes', va:'escena_sector', cuesta:true, da:'simbolos_antiguos', msg:'No son grafiti. El patrón se repite con una precisión que ninguna mano nerviosa lograría, y es viejo: la corrosión lo data en décadas. Reconoces fragmentos de iconografía de tres cultos distintos de las capas bajas, todos copiándose de algo anterior a todos ellos. Como si distintas religiones hubieran oído el mismo susurro y lo hubieran escrito mal cada una a su manera.' },
          { txt: 'Medir las anomalías del sector con el equipo de HELIX', va:'escena_sector', cuesta:true, da:'pulso_senal', msg:'El detector marca un pulso de baja frecuencia, regular, que no procede de ninguna instalación activa: el sector lleva muerto años. Late cada 11 segundos, constante, paciente. No es una fuga. Es una señal. Y lleva emitiéndose mucho más tiempo del que nadie ha estado escuchando.' },
          { txt: 'Buscar restos de los tres desaparecidos', va:'escena_sector', cuesta:true, da:'sin_restos', msg:'Nada. Ni ropa, ni sangre, ni señales de arrastre como las que conoces de otros casos. La gente no se desvanece sin dejar materia; la materia no se va sola. Estaban aquí y dejaron de estar, sin transición. Eso no lo hace un gas. Eso no lo hace casi nada que sepas nombrar.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_testigo: {
        tiempo: 60,
        narr: 'Bram está internado en un ala tranquila que HELIX paga para tenerlo lejos. No está loco, y eso es lo peor: te habla con una lucidez serena, ordenada. "No me llamó por mi nombre de ahora", dice. "Por el de antes. El que tuve antes de tener este." Te mira sin miedo. Aquí decides cómo abordarlo; cada vía gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "No vengo a corregirle. Cuénteme qué oyó."', tono:'empatizar', cuesta:true, va:'escena_testigo', da:'voz_conocia', msg:'Bram cierra los ojos. "No era una voz. Era... saber que algo te conoce desde antes de que existieras. Llamó a los otros tres por nombres que ellos no sabían que tenían, y fueron. No los arrastró. Quisieron ir. A mí me llamó por uno que sí reconocí, de un sueño viejo, y por eso me quedé: porque dudé." Habla con la calma del que ha hecho las paces con algo enorme.' },
          { txt: '[PRESIONAR] "Eso es imposible. ¿Qué oyó de verdad?"', tono:'presionar', cuesta:true, va:'escena_testigo', da:null, msg:'Bram sonríe con una pena infinita. "Usted también lo oirá algún día. Todos lo oímos al final." Y no dice una palabra más. Se cierra; no sacarás nada útil de él.', marca:'bram_cerrado' },
          { txt: '[MENTIR] "Los otros tres han vuelto. Dicen que usted los empujó."', tono:'mentir', cuesta:true, va:'escena_testigo', da:'bram_culpable_falso', msg:'Por primera vez Bram se altera. "¡No han vuelto! Nadie vuelve, no se vuelve de eso." Tiembla. "Si dicen que volvieron, mienten, o no son ellos." Le has arrancado una reacción de pánico que parece de culpa. Pero un hombre que jura que los desaparecidos no pueden volver, ¿confiesa un crimen, o dice una verdad que tú no quieres oír?', señalSutil:true, azar:{prob:0.9} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_registros: {
        tiempo: 60,
        narr: 'Los expedientes de los tres desaparecidos son de gente común: una soldadora, un mensajero, una niña de catorce años. Nada los conecta en lo social. HELIX subraya en rojo que ninguno tenía motivos para huir. Aquí hay margen para mirar de cerca, y mirar cuesta tiempo.',
        opciones: [
          { txt: 'Buscar qué tenían los tres en común', va:'escena_registros', cuesta:true, da:'todos_implantados', msg:'Tardas, pero aparece: los tres llevaban implantes neuronales de HELIX, modelos distintos, fechas distintas. Es el único hilo. Lo que entró en sus cabezas no entró por los oídos. Entró por el implante. Y Bram, el que se quedó, lleva el modelo más antiguo y más degradado de todos: oyó peor, dudó, sobrevivió.' },
          { txt: 'Revisar sus últimas comunicaciones', va:'escena_registros', cuesta:true, da:'ultimas_palabras', msg:'Los tres, en sus últimos mensajes, escribieron variaciones de lo mismo a sus familias: que habían "recordado algo importante" y que tenían que "ir a un sitio". Ninguno dice cuál. Los tres suenan en paz, casi aliviados. No es el lenguaje del secuestro. Es el de quien por fin entiende algo que llevaba toda la vida en la punta de la lengua.' },
          { txt: 'Cruzar los datos con otros sectores muertos', va:'escena_registros', cuesta:true, da:'patron_plantado', señalSutil:true, msg:'Encuentras enseguida un dossier de HELIX que enlaza desapariciones similares con una "secta de las capas bajas" conocida por captar a desesperados. Encaja perfecto: un culto, lavado de cerebro, gente que se va por voluntad propia. Encaja tan perfecto, y está tan a mano en los archivos que te han dado, que parece dejado ahí para que lo encuentres.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_informe: {
        tiempo: 60,
        narr: 'El informe oficial de HELIX que acompaña al sobre ya tiene la conclusión escrita antes de que tú empieces: fuga de gas neurotóxico, alucinaciones colectivas, sector reclausurado. Solo falta tu firma debajo. Está redactado con una seguridad que ningún técnico tendría ante tres cuerpos que no aparecen.',
        opciones: [
          { txt: 'Aceptar la versión del gas y anotarla', va:'escena_informe', cuesta:true, da:'version_gas', señalSutil:true, msg:'La apuntas: gas neurotóxico, histeria, caso cerrado. Es cómoda, cobrable y nadie te molestará por firmarla. Es también la única explicación que no requiere que mires el pulso de las paredes ni los implantes ni lo que Bram aceptó sin miedo. Te la sirven hecha. Por algo será.' },
          { txt: 'Preguntar quién redactó el informe y cuándo', va:'escena_informe', cuesta:true, da:'informe_previo', msg:'La fecha del documento es anterior a las desapariciones. HELIX tenía escrita la explicación de "gas" antes de que faltara nadie. No es una conclusión: es una plantilla. Ya saben lo que pasa en el sector 0-G, ya ha pasado antes, y lo único que les preocupa es que alguien lo nombre.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Subes del sector 0-G con menos certezas que preguntas, que es como se vuelve de los sitios que importan. HELIX quiere la palabra "gas", servida y firmada. Algo late en las paredes cada once segundos. Tres personas se fueron por su propia voluntad, llamadas por nombres que no sabían que tenían. Y un hombre se quedó porque dudó. Decide qué vas a firmar. Solo una conclusión.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUÉ llamó a los desaparecidos?',
          opciones: [
            { txt: 'Una fuga de gas neurotóxico que causó alucinaciones', correcta:false },
            { txt: 'Una señal antigua que alcanza a través de los implantes neuronales', correcta:true },
            { txt: 'Una secta de las capas bajas que los captó', correcta:false },
            { txt: 'El testigo Bram, que los indujo a desaparecer', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ se fueron sin resistirse?',
          opciones: [
            { txt: 'Los llamó por algo anterior a ellos mismos, y quisieron ir', correcta:true },
            { txt: 'El gas anuló su voluntad', correcta:false },
            { txt: 'Fueron coaccionados por el culto', correcta:false },
            { txt: 'Buscaban suicidarse y el sector era el sitio', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO los alcanzó la señal?',
          opciones: [
            { txt: 'A través de sus implantes neuronales de HELIX; Bram sobrevivió por tener el más degradado', correcta:true },
            { txt: 'Inhalando el gas filtrado en el aire del sector', correcta:false },
            { txt: 'Mediante rituales del culto en las paredes', correcta:false },
            { txt: 'Por sugestión, tras oír los rumores del sector', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LO QUE LATE BAJO EL SECTOR',
          narr: 'Lo entiendes, y desearías no entenderlo. Algo muy viejo late bajo el sector 0-G y lleva latiendo desde mucho antes de HELIX; no habla con palabras, alcanza a través de los implantes neuronales y llama a cada uno por algo anterior a su nombre. Los tres lo oyeron claro y fueron. Bram tenía el implante más gastado: lo oyó a medias, dudó, y la duda lo salvó. No hubo gas. No hubo secta. HELIX lo sabe —tenían la explicación escrita antes de los hechos— y lo único que compran con tu firma es una palabra que les deje seguir sin mirar abajo. Entregas el informe verdadero. La mujer sin nombre lo lee sin sorpresa, lo guarda en un cajón que ya tiene otros iguales, y te paga el triple por un silencio que sabe que no podrás romper aunque quieras. Esa noche, en tu apartamento, te descubres contando los segundos. Once. Otra vez once. Y te preguntas, sin querer, cuál sería tu nombre de antes.',
          pagaMult: 1.0, rep: 9, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Firmas algo que se acerca: descartas el gas y la secta, dejas constancia de que las desapariciones no tienen explicación material y de que los implantes son el hilo. Pero no llegas a nombrar lo que late abajo, quizá porque una parte de ti no quiso. HELIX archiva tu informe como "no concluyente", que es justo donde lo querían. Cobras menos. El sector 0-G se vuelve a sellar. Bram sigue contando hasta once en su habitación tranquila, y tú, sin saber por qué, empiezas a hacerlo también.',
          pagaMult: 0.5, rep: 3, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LA FIRMA CÓMODA',
          narr: 'Firmaste lo que te pusieron delante: gas, o la secta, da igual cuál de los dos humos. HELIX te paga puntual y te agradece la profesionalidad. El sector 0-G se reclausura con tu firma como tapa. Los tres desaparecidos pasan a ser una nota a pie de página de un accidente industrial, y la señal sigue latiendo bajo el hormigón, paciente, esperando a los siguientes implantes que pasen lo bastante cerca. Bram lo sabe; por eso, cuando se entera de que firmaste, deja de hablar para siempre. Cobras bien por no haber entendido nada. Es, te dices, lo que te pidieron. Pero hay noches en que el reloj marca las 03:00 y juras que el silencio de tu cuarto tiene un pulso.',
          pagaMult: 0.15, rep: -6, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 4 — NADIE PREGUNTA POR LOS VIVOS
  //  Íntimo. No hay conspiración. Solo una madre y un hijo
  //  que prefiere que lo crean muerto. El caso es qué le cuentas.
  // ============================================================
  {
    id: 'nadie_pregunta_vivos',
    titulo: 'NADIE PREGUNTA POR LOS VIVOS',
    contratante: 'Yenu Castel · jubilada, capas bajas',
    peligro: 1,
    pagaBase: 140,
    progreso: 80,
    rangoMin: 0,
    diligencias: 5,
    resumen: 'Una anciana lleva siete meses sin saber de su hijo. No tiene dinero ni denuncia que poner: a la policía no le importan los pobres que dejan de llamar. Te paga lo poco que tiene para que le digas si su hijo está vivo. Lo difícil no será encontrarlo. Lo difícil será qué le cuentas después.',
    intro: 'Yenu Castel te recibe en una vivienda diminuta que huele a sopa recalentada y a tiempo detenido. Tiene la mesa puesta para dos, como cada noche, por costumbre. "Mi hijo Toma me llamaba todos los domingos", dice, alisándose el delantal con manos que no saben estarse quietas. "Siete meses sin una palabra. La policía me dijo que un adulto que se va no es asunto suyo." Pone sobre la mesa un sobre con casi todos sus ahorros: ciento cuarenta créditos contados. "No necesito que me lo traiga. Solo necesito saber si respira. Aunque no quiera saber nada de mí."\\n\\nNo es un gran caso. Por eso nadie más lo cogería. Tienes poco con lo que tirar; úsalo bien.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'No hay cadáver, ni corporación, ni misterio brillante. Solo un hombre que dejó de llamar a su madre y una madre que no se rinde. Toma Castel, 38 años, sin antecedentes, sin denuncia. La gente no se evapora: deja un rastro pequeño, de recibos y de caras que lo recuerdan. Cada paso te cuesta tiempo y tú cobras tan poco que no puedes permitirte muchos. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Ir al último domicilio conocido de Toma', va: 'escena_piso' },
          { txt: 'Preguntar en el trabajo del que Yenu lo recuerda', va: 'escena_trabajo' },
          { txt: 'Rastrear su actividad: recibos, transporte, clínicas', va: 'escena_rastro' },
          { txt: 'Tirar del rumor del barrio sobre Toma', va: 'escena_rumor_toma' },
          { txt: '— Creo que ya sé lo suficiente. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_piso: {
        tiempo: 60,
        narr: 'El piso donde vivía Toma lo ocupa ya otra familia. La casera, una mujer práctica que no pierde el tiempo en lástimas, lo recuerda de pasada. "Se fue sin aviso, debiendo dos meses. No echó el cierre dramático ni nada. Solo... se fue más pequeño cada semana, hasta que un día ya no estaba." Te deja mirar lo poco que quedó en un cajón olvidado.',
        opciones: [
          { txt: 'Examinar lo que dejó en el cajón', va:'escena_piso', cuesta:true, da:'cartas_sin_enviar', msg:'Un fajo de cartas a su madre, escritas y nunca enviadas. La letra se va volviendo peor mes a mes. En la última, a medio terminar: "Mamá, no puedo llamarte así, no quiero que tu última imagen de mí sea esta." No hay rastro de violencia ni de deuda peligrosa. Hay vergüenza. Toda una vida de vergüenza guardada en un cajón.' },
          { txt: 'Preguntar a la casera adónde fue', va:'escena_piso', cuesta:true, da:'fue_a_los_bajos', msg:'"A los niveles de abajo, supongo. Donde va la gente cuando ya no puede pagar arriba." Lo dice sin maldad, como quien constata el clima. Toma bajó, no desapareció. Se hundió, despacio, como se hunde casi todo el mundo aquí: sin ruido.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_trabajo: {
        tiempo: 60,
        narr: 'En el almacén donde Toma cargaba bultos, su antiguo encargado te atiende entre carretillas. No es un hombre cruel, solo cansado. "¿Castel? Buen tío. Se lesionó la espalda levantando lo que no debía, sin contrato que lo cubriera. Cuando ya no pudo cargar, lo soltamos. Aquí un cuerpo roto no vale nada." Se encoge de hombros, y en ese gesto cabe toda la economía de las capas bajas.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "¿Sabe qué fue de él después?"', tono:'empatizar', cuesta:true, va:'escena_trabajo', da:'lesion_sin_cobertura', msg:'El encargado baja la voz. "Sé que pidió un implante de columna para volver a trabajar y no le llegaba el dinero. HELIX le dio uno de pago aplazado, de los baratos. Esos te dejan andar, pero te comen vivo a plazos. Lo último que oí es que andaba por los comedores sociales del nivel bajo." Concreto y verificable. Toma sigue vivo, pero atrapado en una deuda que lo va devorando.' },
          { txt: '[PRESIONAR] "Lo echaron sin más. ¿No le remuerde?"', tono:'presionar', cuesta:true, va:'escena_trabajo', da:null, msg:'Se le agria la cara. "Oiga, yo no hago las reglas. Tengo cuarenta como él esperando su puesto. Salga de mi almacén." Lo pierdes; no sacarás nada más de él.', marca:'encargado_hostil' },
          { txt: '[SOBORNAR] Deslizarle 20 CR por la dirección que tenga', tono:'sobornar', coste:20, cuesta:true, va:'escena_trabajo', da:'lesion_sin_cobertura', msg:'Coge los créditos casi avergonzado. "Comedor social del nivel bajo, el de la calle Hondura. Ahí lo vieron. Pidió el alta médica que nunca le dieron." Funciona, aunque sobornar a un pobre para encontrar a otro pobre te deja un sabor que no se va.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rastro: {
        tiempo: 60,
        narr: 'Rastrear a alguien que ya casi no consume deja huellas tenues: un hombre que apenas gasta apenas existe en los registros. Aun así, queda algo. Cada cruce de datos te cuesta tiempo.',
        opciones: [
          { txt: 'Seguir los pagos de su implante de columna', va:'escena_rastro', cuesta:true, da:'pagos_implante', msg:'Los plazos del implante siguen saliendo de una cuenta a cero que se renueva con trabajos sueltos. Eso significa una cosa buena dentro de lo malo: quien paga, vive. Toma está vivo y trabaja lo que puede, solo para alimentar la deuda del cuerpo que le permite trabajar. Un círculo perfecto y cruel.' },
          { txt: 'Buscarlo en clínicas y comedores del nivel bajo', va:'escena_rastro', cuesta:true, da:'visto_comedor', msg:'Aparece en el registro de un comedor social de la calle Hondura. Visto la semana pasada. Delgado, callado, esquivo con los voluntarios que preguntan nombres. Vivo. A flote por los pelos, pero vivo, y empeñado en que nadie lo reconozca.' },
          { txt: 'Cruzar su nombre con denuncias y depósitos', va:'escena_rastro', cuesta:true, da:'rastro_deuda_juego', señalSutil:true, msg:'Salta un apunte de una casa de apuestas que reclama una deuda a un "T. Castel". Encaja con la idea fácil: se arruinó jugando, huyó de los acreedores. Encaja demasiado rápido, y el nombre es tan común que medio nivel se apellida Castel. ¿De verdad es él, o es lo primero que el sistema escupe sobre cualquier pobre que desaparece?' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rumor_toma: {
        tiempo: 60,
        narr: 'Una vecina de Yenu, de esas que lo saben todo y lo cuentan más, te aborda en el rellano antes de que preguntes. "¿Busca a Toma? Yo le digo lo que pasó: ese se metió en algo turbio y acabó mal, fijo. Esa gente siempre acaba mal." Lo suelta con el gusto de quien adorna la desgracia ajena.',
        opciones: [
          { txt: 'Anotar la teoría del "mal final"', va:'escena_rumor_toma', cuesta:true, da:'teoria_mal_final', señalSutil:true, msg:'Lo apuntas: Toma metido en líos, final violento. Es la historia que el barrio prefiere, porque un crimen es más digerible que la verdad simple. La verdad simple —un hombre que se hunde de pura pobreza y vergüenza— no tiene emoción que contar en el rellano. Desconfía de las versiones que entretienen.' },
          { txt: 'Preguntarle si lo ha visto ella misma', va:'escena_rumor_toma', cuesta:true, da:'rumor_sin_base', msg:'"¿Verlo? No, mujer, pero se dice..." No ha visto nada. Repite lo que imagina, no lo que sabe. Su "fijo que acabó mal" no tiene un solo hecho debajo. Es ruido de rellano, y el ruido de rellano nunca encontró a nadie.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Te sientas con lo que has reunido, que en este caso es menos un expediente que una vida vista de reojo. No hay villano. Hay un hombre que se rompió la espalda por un sueldo, se endeudó con su propio cuerpo y prefiere que su madre lo crea perdido antes que verlo así. El barrio quiere un drama; los registros, un crimen fácil. Pero lo que tienes delante es más sencillo y más triste. Decide qué concluyes. Y, sobre todo, qué vas a contarle a Yenu.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUÉ le pasó a Toma Castel?',
          opciones: [
            { txt: 'Sigue vivo, hundido en la pobreza y escondido por vergüenza', correcta:true },
            { txt: 'Acabó muerto en un ajuste de cuentas', correcta:false },
            { txt: 'Huyó de unos acreedores del juego', correcta:false },
            { txt: 'Se metió en algo turbio y desapareció', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ dejó de llamar a su madre?',
          opciones: [
            { txt: 'Vergüenza: no quería que ella lo viera caído', correcta:true },
            { txt: 'Le pasó algo violento que se lo impidió', correcta:false },
            { txt: 'Huía y no podía dejar rastro', correcta:false },
            { txt: 'Dejó de quererla', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO llegó hasta ahí?',
          opciones: [
            { txt: 'Una lesión sin cobertura y un implante de pago que lo endeudó de por vida', correcta:true },
            { txt: 'Una deuda de juego que no pudo pagar', correcta:false },
            { txt: 'Se mezcló con bandas del nivel bajo', correcta:false },
            { txt: 'Simplemente se cansó de su vida y de su madre', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · QUÉ LE CUENTAS A YENU',
          narr: 'Lo encuentras en el comedor de la calle Hondura, más delgado que en la única foto que tienes, pero vivo. No te deja acercarte. "Dígale que estoy bien", te pide, y la mentira le tiembla en la boca. "Dígale cualquier cosa menos la verdad." No hubo crimen, ni juego, ni misterio: solo una espalda rota, una deuda con forma de columna vertebral y la vergüenza de un hombre orgulloso que no soporta que su madre lo vea así.\\n\\nVuelves a casa de Yenu. Ella te espera con la mesa puesta para dos. Le dices lo único que importa y lo único que es del todo cierto: que su hijo está vivo, que respira, que piensa en ella aunque no llame. Le ahorras la columna y la deuda y el comedor. Ella llora de alivio, no de pena, y te paga sus ciento cuarenta créditos contados como si fueran un tesoro. No has resuelto nada. No has arreglado a Toma ni el mundo que lo rompió. Pero esta noche una madre cenará sabiendo que su hijo respira, y a veces ese es el único caso que de verdad se puede cerrar.',
          pagaMult: 1.0, rep: 4, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · UNA VERDAD A MEDIAS',
          narr: 'Confirmas que Toma vive, pero le llevas a Yenu una versión torpe, con cabos sueltos que la dejan más inquieta que tranquila. "¿Pero está bien? ¿Por qué no me llama, entonces?" No sabes responderle del todo, y ella se queda con una espina que no le sacaste. Cobras tus créditos sintiendo que has hecho la mitad de algo que pedía hacerse entero. La mesa sigue puesta para dos.',
          pagaMult: 0.5, rep: 1, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LA HISTORIA FÁCIL',
          narr: 'Te quedaste con la versión cómoda: el juego, el mal final, lo que cuenta el rellano. Le dices a Yenu que su hijo se metió en algo turbio y que probablemente esté muerto, o huido para siempre. Ella asiente despacio, recoge por fin la mesa puesta para dos y deja de esperar. Has matado a un hombre que estaba vivo, no con las manos, sino con un informe perezoso. En algún comedor de la calle Hondura, Toma sigue pagando su columna a plazos, sin saber que su madre acaba de enterrarlo. Cobras igual. Pero sabes que te equivocaste en lo único que se te pedía: mirar de verdad a la gente que a nadie le importa.',
          pagaMult: 0.4, rep: -2, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 5 — EL PESO DE LA CARNE
  //  Capas bajas. Crimen común y sórdido. El misterio no es
  //  grande: es el hambre. Las pistas falsas lo inflan a épica.
  // ============================================================
  {
    id: 'peso_de_la_carne',
    titulo: 'EL PESO DE LA CARNE',
    contratante: 'Familia Okonkwo · Arrabal Carmesí',
    peligro: 3,
    pagaBase: 260,
    progreso: 130,
    rangoMin: 1,
    diligencias: 6,
    resumen: 'Encuentran a un hombre muerto en un callejón del Arrabal, desvalijado de todos sus implantes: le abrieron el cuerpo para sacarle hasta el último componente. Su familia, que no tiene a quién acudir, te paga para saber quién fue. Esperan una guerra de bandas. La verdad es más pequeña, y por eso duele más.',
    intro: 'El Arrabal Carmesí huele a fritanga, a desinfectante barato y a algo dulzón debajo que es mejor no nombrar. La familia Okonkwo te recibe en la trastienda de un puesto de comida: la madre, dos hermanos, un silencio espeso. "A Deji lo encontraron en el callejón de detrás del mercado", dice el hermano mayor, con la mandíbula apretada. "Le sacaron los ojos cibernéticos, el brazo, el regulador cardíaco. Lo abrieron como a una máquina." La madre no habla; mira un punto fijo de la pared. "Sabemos que fue la Mano Roja, o los del Nodo. Encuentre a quién y nosotros nos encargamos del resto."\\n\\nQuieren una guerra. Tú solo tienes que averiguar la verdad, sea la que sea. Elige bien dónde miras: el Arrabal no perdona a los curiosos.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Un cuerpo vaciado de tecnología en un callejón. La familia ya tiene su teoría —bandas, facciones, venganza— y la rabia buscando una dirección. Pero un asesinato por encargo de una facción se hace distinto a un cuerpo desguazado por sus piezas. Cada paso en el Arrabal te expone, y el tiempo aquí es corto. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Examinar el callejón donde apareció Deji', va: 'escena_callejon' },
          { txt: 'Hablar con quien encontró el cuerpo', va: 'escena_testigo_carne' },
          { txt: 'Sondear el mercado negro de implantes', va: 'escena_mercado_negro' },
          { txt: 'Tirar del rumor de la guerra de bandas', va: 'escena_rumor_bandas' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_callejon: {
        tiempo: 90,
        narr: 'El callejón detrás del mercado es un pasillo de basura y agua negra donde la lluvia ácida no termina de limpiar nada. La marca del cuerpo sigue en el suelo, rodeada de una mancha que ya nadie va a fregar. Hay detalles que mirar, y no aguantarás mucho aquí sin llamar la atención.',
        opciones: [
          { txt: 'Estudiar cómo le extrajeron los implantes', va:'escena_callejon', cuesta:true, da:'extraccion_torpe', msg:'Te agachas junto a lo que queda de Deji. Las cuencas vacías donde estaban los ojos cibernéticos tienen los bordes desgarrados, no cortados: alguien hurgó con los dedos y una hoja roma hasta arrancarlos. El brazo lo separaron a la altura del hombro serrando el acoplamiento, dejando hueso y cable asomando del mismo tajo. Son heridas de chatarrero con prisa, no de cirujano ni de sicario. Una facción que mata por encargo deja un cadáver limpio, un mensaje. Esto es un saqueo: abrieron a Deji con miedo, deprisa, para llevarse el metal antes de que llegara nadie.' },
          { txt: 'Buscar señales de pelea o emboscada', va:'escena_callejon', cuesta:true, da:'sin_emboscada', msg:'No hay rastro de pelea organizada: ni casquillos, ni marcas de varios atacantes, ni el desorden de una emboscada. Solo un golpe, una caída, y el suelo removido donde alguien se arrodilló a trabajar deprisa. Lo mataron rápido y a solas, no lo cazaron entre varios. Las bandas no operan así.' },
          { txt: 'Revisar qué dejaron sin llevarse', va:'escena_callejon', cuesta:true, da:'dejaron_creditos', msg:'Le dejaron los créditos en el bolsillo y un reloj viejo de su padre. Un sicario de facción no perdona el dinero; un ladrón sí, si solo le interesaban las piezas. Quien lo hizo no quería robarle a Deji: quería el metal de dentro de Deji. La diferencia lo es todo.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_testigo_carne: {
        tiempo: 60,
        narr: 'La que encontró el cuerpo es Sefa, una recogedora de chatarra que peina ese callejón cada amanecer. Es vieja, dura, y ha visto demasiado para asustarse de un muerto más. Te habla sin soltar el carrito, lista para irse. Aquí decides cómo tratarla; cada vía te cuesta tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "Usted conoce este callejón mejor que nadie. ¿Qué vio?"', tono:'empatizar', cuesta:true, va:'escena_testigo_carne', da:'figura_sola', msg:'Sefa afloja. "Vi una figura agachada sobre él antes del alba. Una sola. Flaca, temblona. No de banda: los de banda van en grupo y con luces. Este iba solo, con una bolsa de herramientas de las mías, de chatarrero. Salió corriendo cuando me oyó, y se le cayó esto." Te tiende una credencial gastada de un taller de reparaciones del barrio.' },
          { txt: '[PRESIONAR] "¿Por qué no avisó antes? ¿Le tocó usted algo?"', tono:'presionar', cuesta:true, va:'escena_testigo_carne', da:null, msg:'Se enfada. "¿Avisar a quién, a la policía que nunca baja? Y no le he robado a un muerto en mi vida. Búsquese a otro al que acosar." Se va con su carrito; la pierdes.', marca:'sefa_hostil' },
          { txt: '[MENTIR] "Tengo cámaras que la sitúan a usted sobre el cuerpo."', tono:'mentir', cuesta:true, va:'escena_testigo_carne', da:'sefa_culpable_falso', msg:'Sefa escupe al suelo. "No hay cámaras en este agujero y usted lo sabe. Pero si quiere colgarme el muerto, adelante, total, ¿quién va a creer a una vieja de la chatarra?" Le has sacado rabia, no una confesión. Tiene una credencial que no es suya y un sitio donde estaba: parece sospechosa. Pero acusar al que encuentra el cuerpo es el error más viejo del oficio.', señalSutil:true, azar:{prob:0.85} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_mercado_negro: {
        tiempo: 60,
        narr: 'El mercado negro de implantes del Arrabal funciona en la trastienda de un taller de reparaciones, entre cajas de órganos de segunda mano y el zumbido de neveras viejas. El dueño, un tipo nervioso llamado Vito, te mide de arriba abajo antes de decidir si existes. Aquí cada pregunta cuesta tiempo y un poco de seguridad.',
        opciones: [
          { txt: 'Preguntar si han entrado implantes de Deji', va:'escena_mercado_negro', cuesta:true, da:'piezas_revendidas', msg:'Vito lo niega tres veces y a la cuarta cede al ver que no te vas. "Llegaron unos ojos cibernéticos y un brazo el otro día. Me los trajo un crío, un aprendiz de los talleres, muerto de miedo, pidiendo cuatro perras. Necesitaba pagar la medicación de su madre, dijo. No pregunté de dónde salían. Aquí no se pregunta." Las piezas de Deji se vendieron por una miseria desesperada.' },
          { txt: 'Sobornar a Vito por el nombre del que las trajo', va:'escena_mercado_negro', coste:35, cuesta:true, va:'escena_mercado_negro', da:'nombre_aprendiz', msg:'Vito guarda los créditos en un bolsillo interior. "Se llama Mko. Aprendiz en el taller de la calle Cobre, el de la credencial. Buen chaval, eso es lo jodido. Su madre se muere y la clínica de HELIX no fía. Hizo una barbaridad por unas monedas que no le alcanzan ni para una semana de fármacos." Tienes nombre, y con él, toda la tragedia.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rumor_bandas: {
        tiempo: 60,
        narr: 'En una esquina, un buscavidas que vive de vender información a quien la pague te suelta, sin que rasques mucho, que esto "huele a la Mano Roja marcando territorio contra el Nodo". Lo dice con seguridad de experto, demasiado deseoso de que le compres la versión grande.',
        opciones: [
          { txt: 'Anotar la teoría de la guerra de bandas', va:'escena_rumor_bandas', cuesta:true, da:'teoria_bandas', señalSutil:true, msg:'Lo apuntas: ajuste de cuentas Mano Roja contra Nodo, Deji como mensaje. Es la versión que la familia ya quiere oír y que este hombre vende con gusto. Encaja con el Arrabal que todos imaginan. Pero las facciones no mutilan por piezas baratas ni dejan los créditos en el bolsillo. La historia grande es la más fácil de vender y la que menos cuadra con el cuerpo.' },
          { txt: 'Preguntarle qué gana contándote eso', va:'escena_rumor_bandas', cuesta:true, da:'rumor_interesado', msg:'Se ríe. "Hombre, una guerra de bandas da trabajo a gente como yo. Información, recados, miedo que vender." Admite, sin querer, que le conviene que creas en la guerra. Su versión no busca la verdad: busca que el Arrabal arda un poco más, porque del fuego él come.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo que tienes. La familia quiere una guerra; el buscavidas, también; hasta el barrio prefiere un cadáver con épica. Pero el cuerpo cuenta otra cosa: cortes de chatarrero, créditos intactos, una figura sola y asustada, unas piezas vendidas por unas monedas para medicinas. Separa la verdad de la historia que todos quieren creer. Firma una conclusión, sabiendo que la familia espera un nombre al que hacer daño.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN mató a Deji Okonkwo?',
          opciones: [
            { txt: 'Mko, un aprendiz desesperado, por sus implantes', correcta:true },
            { txt: 'La Mano Roja, marcando territorio', correcta:false },
            { txt: 'El Nodo, en represalia contra los Okonkwo', correcta:false },
            { txt: 'Sefa, la chatarrera que halló el cuerpo', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo mataron?',
          opciones: [
            { txt: 'Por sus implantes, para venderlos y pagar medicinas', correcta:true },
            { txt: 'Como mensaje en una guerra de facciones', correcta:false },
            { txt: 'Una vendetta personal contra la familia', correcta:false },
            { txt: 'Un robo de su dinero que salió mal', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO ocurrió?',
          opciones: [
            { txt: 'Un golpe a solas y una extracción torpe con herramienta de chatarrero', correcta:true },
            { txt: 'Una emboscada coordinada de varios atacantes', correcta:false },
            { txt: 'Una ejecución limpia de sicario profesional', correcta:false },
            { txt: 'Una pelea entre iguales que acabó mal', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · EL PESO DE LA CARNE',
          narr: 'No fue ninguna guerra. Fue Mko, un crío aprendiz del taller de la calle Cobre, con la madre muriéndose y una clínica de HELIX que no fía. Vio a Deji solo en el callejón, vio el metal caro bajo su piel, y el hambre le tomó las manos. Lo golpeó, lo abrió con sus herramientas de chatarrero y vendió los ojos y el brazo de un hombre por unas monedas que no le alcanzan ni para una semana de fármacos. Dejó los créditos: no quería robar, quería el metal.\\n\\nLe llevas la verdad a la familia Okonkwo, sabiendo lo que harán con ella. El hermano mayor aprieta los puños esperando un enemigo a su altura, y lo que recibe es un niño desesperado al que ahora tendrá que decidir si destruye. La madre, que no había hablado, dice por fin lo único sensato: "Otra madre, entonces. Vamos a hacerle a otra madre lo que nos hicieron a nosotros." Y no sabes si eso detiene la sangre o solo la aplaza. Cobras tus créditos. Has encontrado la verdad, que era tu trabajo. Lo que nadie te pagó por encontrar es una salida, porque en el Arrabal no la hay: solo gente pobre haciéndose pedazos por las sobras de los ricos.',
          pagaMult: 1.0, rep: 5, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Descartas la guerra de bandas y apuntas a un saqueo de piezas, pero no llegas a poner nombre ni rostro: solo "alguien desesperado, a solas". La familia se queda sin el enemigo concreto que ansiaba y con una rabia que no sabe dónde descargar. "¿Y ahora qué hacemos con eso?", te pregunta el hermano. No tienes respuesta. Cobras menos, y te vas con la sensación de haber dejado una herida abierta sin coser.',
          pagaMult: 0.5, rep: 2, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LA GUERRA QUE NO EXISTÍA',
          narr: 'Les diste lo que querían oír: la Mano Roja, el Nodo, una guerra. La familia Okonkwo sale a vengar a Deji contra una facción que no tuvo nada que ver, y el Arrabal arde un poco más por tu informe. Caen dos o tres que no abrieron a nadie, y la sangre llama a más sangre, justo como quería el buscavidas que vive del fuego. Mko, el verdadero responsable, sigue vendiendo piezas a escondidas para una madre que se muere igual. Cobras tu parte. Has encendido una guerra entre pobres con una mentira cómoda, y mientras tanto el único que de verdad gana —el que fabrica implantes que valen más que las vidas que los llevan— no ha movido un dedo. Esa noche, el Arrabal huele más que nunca a ese dulzor que es mejor no nombrar.',
          pagaMult: 0.15, rep: -5, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 6 — LA MUJER QUE YA NO ESTÁ
  //  Vigilancia conyugal. El cliente cree que le es infiel.
  //  La verdad: ella huye de él. Tú estás del lado equivocado.
  // ============================================================
  {
    id: 'mujer_que_ya_no_esta',
    titulo: 'LA MUJER QUE YA NO ESTÁ',
    contratante: 'Harlan Voss · técnico de mantenimiento',
    peligro: 1,
    pagaBase: 180,
    progreso: 90,
    rangoMin: 0,
    diligencias: 5,
    resumen: 'Un hombre te paga para seguir a su mujer. Está seguro de que le es infiel: llega tarde, esconde el terminal, ha empezado a guardar dinero. Quiere pruebas para encararla. Cuanto más sigues a Nela, más claro queda que no hay ningún amante. Hay una mujer preparando, en silencio, su fuga.',
    intro: 'Harlan Voss te recibe en su salón con las cortinas echadas y una rabia fría que controla a duras penas. "Mi mujer me oculta cosas. Nela. Veinte años casados y ahora llega tarde, tapa la pantalla cuando entro, aparta créditos donde cree que no miro." Aprieta una foto de ella entre los dedos. "Quiero saber con quién. Tráigame pruebas y yo me encargo del resto." Esa última frase, "yo me encargo", la dice con una calma que te eriza la nuca.\\n\\nDispones de poco tiempo y de un cliente impaciente. Sigue a Nela. Pero mira de verdad lo que hace, no solo lo que él quiere que encuentres.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Harlan te da la rutina de Nela y una urgencia que pesa. La hipótesis del marido es simple: hay otro. Pero las cosas que él lee como traición —el dinero apartado, el terminal oculto, las tardanzas— admiten más de una explicación, y no todas tienen un amante dentro. Cada paso de seguimiento te cuesta tiempo. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Seguir a Nela en sus salidas de la tarde', va: 'escena_seguimiento' },
          { txt: 'Investigar el dinero que aparta', va: 'escena_dinero' },
          { txt: 'Hablar con una amiga cercana de Nela', va: 'escena_amiga' },
          { txt: 'Acceder a lo que oculta en su terminal', va: 'escena_terminal_nela' },
          { txt: '— Creo que ya lo tengo. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_seguimiento: {
        tiempo: 90,
        narr: 'Sigues a Nela dos tardes. No va a ningún encuentro romántico: sus paradas son grises, administrativas, repetidas. Hay varias cosas que podrías confirmar de su recorrido, pero no tendrás tiempo para todas.',
        opciones: [
          { txt: 'Anotar adónde va exactamente', va:'escena_seguimiento', cuesta:true, da:'tramites_huida', msg:'Una oficina de reubicación de las capas medias. Una clínica que trata lesiones que no se ven, de las que dejan los golpes cuidadosos. Un trastero alquilado a su nombre. No es el mapa de una aventura: es el de alguien que prepara, paso a paso y en silencio, una salida. Nela no busca a otro hombre. Busca la puerta.' },
          { txt: 'Ver si se encuentra con alguien', va:'escena_seguimiento', cuesta:true, da:'sin_amante', msg:'Con nadie. Habla a solas, mira por encima del hombro, acelera el paso al volver a casa como quien vuelve a un sitio que teme. La única persona de la que Nela se esconde, lo entiendes despacio, es del hombre que te paga.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_dinero: {
        tiempo: 60,
        narr: 'El dinero que Nela aparta es lo que más enfurece a Harlan. Lo presenta como prueba de que planea irse "con otro". Seguir su rastro lleva tiempo, pero habla claro.',
        opciones: [
          { txt: 'Rastrear adónde va ese dinero', va:'escena_dinero', cuesta:true, da:'fondo_fuga', msg:'No va a regalos ni a hoteles. Va a una cuenta de difícil acceso, a nombre solo de ella, alimentada moneda a moneda durante meses. Es un fondo de fuga, la cantidad mínima para alquilar lejos y desaparecer un tiempo. Ahorrado con la paciencia del miedo. Cada crédito apartado es un día menos bajo el mismo techo que Harlan.' },
          { txt: 'Comprobar si paga a un tercero', va:'escena_dinero', cuesta:true, da:'rastro_amante', señalSutil:true, msg:'Aparece un pago recurrente a un número privado. Podría ser un amante mantenido, como Harlan jura. Lo apuntas. Pero el importe es exacto, mensual, frío: más parece la cuota de un abogado de familia o de un servicio de reubicación que el capricho de un romance. Encaja con la versión del marido solo si decides no mirar el detalle.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_amiga: {
        tiempo: 60,
        narr: 'Sera, la única amiga que a Nela le queda —Harlan fue apartándola del resto sin que ella casi lo notara—, te recibe con desconfianza en cuanto hueles a "enviado del marido". Aquí decides cómo tratarla; cada vía gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "No vengo a hacerle daño a Nela. Quiero entender."', tono:'empatizar', cuesta:true, va:'escena_amiga', da:'control_harlan', msg:'Sera te estudia y decide arriesgarse. "Harlan no le pega donde se vea. Le cuenta el dinero, le revisa el terminal, decide con quién habla. Nela lleva un año reuniendo fuerzas para irse. Si él se entera antes de que esté lista, no sé qué le hace." Lo dice con un miedo concreto, no dramático. Te das cuenta de para quién trabajas.' },
          { txt: '[PRESIONAR] "¿Lo encubre usted? ¿Hay otro hombre o no?"', tono:'presionar', cuesta:true, va:'escena_amiga', da:null, msg:'Se cierra de golpe. "No le voy a dar nada que él pueda usar. Fuera." Y cierra. La pierdes; no sacarás más por aquí.', marca:'sera_hostil' },
          { txt: '[MENTIR] "Sé que Nela tiene un amante. Solo quiero su nombre."', tono:'mentir', cuesta:true, va:'escena_amiga', da:'amante_inventado', msg:'Sera se ríe sin ganas. "¿Eso le ha dicho Harlan? Claro que sí. Siempre es más fácil un amante que un marido." No te da ningún nombre porque no lo hay. Si vuelves con Harlan diciendo "hay otro", le estarás dando lo que pidió, no lo que es cierto.', señalSutil:true, azar:{prob:0.95} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_terminal_nela: {
        tiempo: 60,
        narr: 'Acceder al terminal que Nela oculta es la prueba que Harlan más ansía. Lo que esperas encontrar y lo que encuentras no coinciden.',
        opciones: [
          { txt: 'Leer sus mensajes ocultos', va:'escena_terminal_nela', cuesta:true, da:'mensajes_refugio', msg:'No hay un amante. Hay conversaciones con una casa de acogida para mujeres, fechas tentativas, listas de lo imprescindible que cabe en una bolsa. Y un borrador de carta para Harlan que empieza "Para cuando leas esto ya no estaré" y que nunca se atreve a terminar. Lo que oculta no es una traición. Es un plan de supervivencia.' },
          { txt: 'Buscar fotos o registros comprometedores', va:'escena_terminal_nela', cuesta:true, da:'fotos_lesiones', msg:'Encuentras una carpeta oculta. No son fotos de un amante: son fotos de ella misma, fechadas, documentando marcas que aparecen y desaparecen en sus brazos y costillas a lo largo de meses. Pruebas, guardadas por si algún día las necesita. El comprometido en esas imágenes no es ningún amante.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Te sientas con lo que has visto, y por una vez el problema no es averiguar la verdad: es qué haces con ella. Harlan te paga por un amante. Tú has encontrado una mujer apartada de sus amigos, vigilada, golpeada con cuidado, ahorrando a escondidas para escapar. La versión del marido encaja solo si decides no mirar. Firma una conclusión, sabiendo que el informe que entregues puede ser una puerta de salida o una sentencia.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUÉ está haciendo realmente Nela?',
          opciones: [
            { txt: 'Preparando en secreto su huida de un marido que la maltrata', correcta:true },
            { txt: 'Teniendo una aventura con otro hombre', correcta:false },
            { txt: 'Robándole dinero a Harlan para gastarlo en lujos', correcta:false },
            { txt: 'Planeando dejarlo por un amante al que mantiene', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ oculta el dinero y el terminal?',
          opciones: [
            { txt: 'Porque Harlan la controla y necesita escapar sin que lo sepa', correcta:true },
            { txt: 'Para ocultar la relación con su amante', correcta:false },
            { txt: 'Porque está endeudada y se avergüenza', correcta:false },
            { txt: 'Porque ya no lo quiere y se prepara para el divorcio', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO deberías cerrar el caso?',
          opciones: [
            { txt: 'No entregar pruebas a Harlan; avisar a Nela de que la siguen', correcta:true },
            { txt: 'Darle a Harlan las pruebas que pidió, es tu cliente', correcta:false },
            { txt: 'Inventar un amante para cobrar y cerrar rápido', correcta:false },
            { txt: 'Devolver el dinero y desentenderte sin avisar a nadie', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA PUERTA',
          narr: 'No le das a Harlan ni una sola prueba. Le entregas un informe vacío —"no hay ningún amante, su mujer le es fiel"— que es mentira solo en la forma, porque la verdad en sus manos sería un arma. Luego haces lo que de verdad cierra el caso: encuentras a Nela a solas, lejos de la casa, y le dices lo único que importa. Que su marido la hace vigilar. Que tiene poco tiempo. Que la casa de acogida con la que habla es real y que el dinero que ha juntado, por poco que sea, basta para empezar. Ella te mira con un terror que se va volviendo otra cosa, algo parecido a permiso para respirar.\\n\\nHarlan te paga, satisfecho de saber a su mujer "fiel". No sabe que le acabas de tasar la jaula con la puerta abierta. Cobras menos de lo que habrías sacado vendiéndole lo que quería, y aceptas la pérdida sin pensarlo. Hay informes que valen más por lo que callan. Días después te llega una nota sin firma, solo dos palabras: "Ya está." No sabes si significa que se fue o que la atraparon. Eliges creer lo primero, porque a veces creer es lo único que queda.',
          pagaMult: 0.7, rep: 3, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Le dices a Harlan que no hay amante, lo cual es cierto y lo protege a ella en parte. Pero no llegas a avisar a Nela de que la vigilaban, ni le tiendes el hilo que necesitaba. Sigue sola con su plan a medio cocer, sin saber que alguien la observa. Cobras tu parte. Has evitado el daño peor, pero te vas con la sensación de haber dejado a alguien a mitad de un puente, sin decirle si el otro lado aguanta.',
          pagaMult: 0.5, rep: 1, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LE DISTE LO QUE PIDIÓ',
          narr: 'Le entregaste a Harlan lo que te pagó: fotos de los trámites, el rastro del dinero, el nombre de la casa de acogida que tomó por el de un amante. "Yo me encargo del resto", dijo el primer día, y ahora tiene con qué. Le has puesto en las manos el mapa exacto de la fuga de Nela antes de que ella pudiera dar el paso. Cobras tu tarifa completa. Esa noche, contando los créditos, te repites que solo hiciste tu trabajo, que el cliente manda, que tú no sabías. Pero sí sabías. Lo viste todo y decidiste no mirar. En algún sitio de la ciudad, una puerta que estaba a punto de abrirse se cierra con llave, y la llave la tiene él.',
          pagaMult: 1.0, rep: -6, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 7 — EL MILAGRO DE LA HERMANA VAEL
  //  Estafa de fe en el Santuario IX (facción eco). La fe es
  //  sincera; el milagrero, no. Vael no sabe que la usan.
  // ============================================================
  {
    id: 'milagro_hermana_vael',
    titulo: 'EL MILAGRO DE LA HERMANA VAEL',
    contratante: 'Familia Adeyemi · feligreses del Santuario IX',
    peligro: 2,
    pagaBase: 300,
    progreso: 120,
    rangoMin: 1,
    diligencias: 6,
    resumen: 'En el Santuario IX, los fieles donan sus ahorros tras presenciar curaciones milagrosas. El abuelo de los Adeyemi lo dio todo y murió creyendo que sanaría. La familia quiere saber si la Hermana Vael los estafa. La respuesta es más incómoda que un sí o un no: la fe es real, pero alguien se aprovecha de ella.',
    intro: 'Los Adeyemi te reciben con la culpa de quien sospecha de su propia iglesia. "Nuestro abuelo era de los más devotos del Santuario IX", dice la nieta, retorciendo un pañuelo. "Después de cada curación de la Hermana Vael donaba más: sus ahorros, su pensión, al final hasta la vivienda. Murió convencido de que el milagro llegaría. Y no llegó." Bajan la voz, como si Vael pudiera oírlos. "No sabemos si la Hermana es una santa o una ladrona. Necesitamos saber la verdad, aunque nos duela."\\n\\nEl Santuario IX no recibe bien a los que hacen preguntas. Mide tus pasos: aquí la fe y el negocio comparten el mismo altar.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'El Santuario IX huele a incienso barato y a esperanza desesperada. La Hermana Vael predica curaciones, los fieles sanan o creen sanar, y las donaciones fluyen. Hay tres posibilidades en juego: que sea fraude puro, que sea fe sincera sin más, o que ambas cosas convivan bajo el mismo techo. Cada paso te expone ante una congregación que protege lo suyo. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Presenciar una "curación" de la Hermana Vael', va: 'escena_curacion' },
          { txt: 'Hablar con un fiel que dice haber sanado', va: 'escena_fiel_sanado' },
          { txt: 'Seguir el rastro de las donaciones', va: 'escena_donaciones' },
          { txt: 'Sondear al ayudante de Vael, el Hermano Pell', va: 'escena_ayudante' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_curacion: {
        tiempo: 90,
        narr: 'Te cuelas en una sesión de sanación. La Hermana Vael impone las manos sobre un hombre que tiembla; este se yergue, llora, jura que el dolor se ha ido. La congregación estalla en llanto y gratitud. Es genuino, hasta hipnótico. Pero tu oficio es mirar dos veces. Hay detalles que examinar y no aguantarás dentro mucho tiempo sin que te noten.',
        opciones: [
          { txt: 'Observar de cerca al "sanado"', va:'escena_curacion', cuesta:true, da:'sanado_real_temporal', msg:'El alivio del hombre es auténtico: no finge. Pero tras la nuca lleva un parche dérmico discreto, de los analgésicos de liberación rápida que se compran en cualquier botica del Arrabal. El dolor se le va de verdad... durante unas horas. Vael impone las manos; el parche hace el trabajo. La fe es real. El milagro es química barata.' },
          { txt: 'Vigilar las manos de Vael durante el rito', va:'escena_curacion', cuesta:true, da:'vael_cree', msg:'Vael no esconde nada en las manos, ni mira a nadie buscando señales. Cierra los ojos y se entrega por completo, con lágrimas propias. Quien finge calcula; ella se abandona. Lo que ves en su cara no es el cálculo de una estafadora, sino la entrega de alguien que cree de verdad en lo que hace. Eso complica las cosas, no las simplifica.' },
          { txt: 'Fijarte en quién organiza el cobro', va:'escena_curacion', cuesta:true, da:'pell_recauda', msg:'Mientras la congregación llora, el Hermano Pell se mueve entre los bancos con la urna de donativos y un terminal de pagos, susurrando al oído de los más conmovidos justo en el momento de máxima emoción. La curación la hace Vael; la caja la lleva Pell, y la lleva con la frialdad de un comercial que conoce el momento exacto de cerrar la venta.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_fiel_sanado: {
        tiempo: 60,
        narr: 'Buscas a una mujer que la congregación señala como "sanada de milagro" hace meses. La encuentras radiante, agradecida, dispuesta a contarte su prodigio. Aquí decides el enfoque; cada uno gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "Cuénteme cómo fue. Sin prisa."', tono:'empatizar', cuesta:true, va:'escena_fiel_sanado', da:'alivio_no_cura', msg:'"El dolor de la espalda se me fue al tocarme la Hermana", dice con los ojos brillantes. Pero al ahondar, con cariño, sale el resto: vuelve cada semana porque "el milagro se gasta", y cada vez el Hermano Pell le recomienda una donación mayor "para fijar la gracia". No la han curado: la han enganchado a un alivio que caduca y a una culpa que paga. Y ella no lo ve, porque no quiere verlo.' },
          { txt: '[PRESIONAR] "¿No ve que la están estafando?"', tono:'presionar', cuesta:true, va:'escena_fiel_sanado', da:null, msg:'Se ofende en lo más hondo. "¿Cómo se atreve? La Hermana me devolvió la vida." Te da la espalda y avisa a otros de que andas "blasfemando". La pierdes, y te ganas miradas hostiles por todo el Santuario.', marca:'fieles_hostiles' },
          { txt: '[SOBORNAR] No procede: comprar a una fiel no da nada', tono:'empatizar', cuesta:true, va:'escena_fiel_sanado', da:'pell_dosis', msg:'Le ofreces ayuda discreta para sus gastos y, agradecida, se confía: "El Hermano Pell me da unos parches benditos para entre visita y visita. Dice que es la gracia concentrada. Me cobra por ellos, pero ¿qué es el dinero al lado de no sufrir?" Parches. De Pell. Por separado. La gracia tiene tarifa, y la firma Pell, no Vael.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_donaciones: {
        tiempo: 60,
        narr: 'Seguir el dinero del Santuario es laborioso: la contabilidad de la fe se lleva a propósito en la penumbra. Pero el dinero, como el agua, siempre deja marca de por dónde pasó. Cada cruce te cuesta tiempo.',
        opciones: [
          { txt: 'Ver adónde van las donaciones', va:'escena_donaciones', cuesta:true, da:'fondos_desviados', msg:'La mayor parte sostiene el Santuario: comida para pobres, mantas, el techo. Pero un porcentaje se desvía con regularidad a una cuenta personal que no es la de la orden ni la de Vael. Es la de Pell. La fe alimenta a muchos hambrientos y, de paso, engorda a uno solo que se cuida de no figurar en los libros.' },
          { txt: 'Comprobar si Vael se enriquece', va:'escena_donaciones', cuesta:true, da:'vael_pobre', msg:'Vael vive en una celda con un catre y dos túnicas. No tiene cuenta propia, ni lujos, ni nada que delate provecho. Si esto fuera su estafa, sería la estafadora más incompetente de la historia. Quien se lleva el dinero no duerme en esa celda. La santa es pobre; el ladrón, no.' },
          { txt: 'Rastrear quejas previas contra el Santuario', va:'escena_donaciones', cuesta:true, da:'rastro_culto_peligroso', señalSutil:true, msg:'Aparece un panfleto que tacha al Santuario IX de "culto peligroso que esquilma a los débiles" y pide cerrarlo entero. Encaja con la idea fácil: secta mala, líder corrupta, todos cómplices. Lo firma una organización rival de la facción eco que lleva años queriendo el edificio. La acusación global es real en parte y oportunista del todo: sirve para confundir al culpable con la institución entera.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_ayudante: {
        tiempo: 60,
        narr: 'El Hermano Pell te recibe con una sonrisa untuosa y un apretón de manos que dura un segundo de más. Es todo calidez y gratitud por tu "interés en la obra". Demasiada calidez para alguien a quien acabas de conocer.',
        entrevista: true,
        opciones: [
          { txt: '[PRESIONAR] "Usted lleva la caja y los parches. La Hermana solo pone las manos."', tono:'presionar', cuesta:true, va:'escena_ayudante', da:'pell_culpable', msg:'La sonrisa de Pell se congela. "Yo gestiono lo material para que la Hermana se dedique a lo espiritual. Alguien tiene que hacerlo." Pero suda, y se le escapa: "Vael no entiende de dinero, vive en las nubes. Por eso me necesita." Acabas de oír a un hombre confesar, sin querer, que opera a espaldas de una mujer que confía en él ciegamente.' },
          { txt: '[MENTIR] "La Hermana Vael ya me ha contado lo de los parches."', tono:'mentir', cuesta:true, va:'escena_ayudante', da:'pell_pánico', msg:'Pell pierde el color. "¿Le ha... ? Yo... los parches son una ayuda, un complemento, ella lo aprobó, seguro que lo aprobó." Se enreda solo. Vael no aprobó nada porque no lo sabe, y el pánico de Pell ante la sola idea de que ella se entere lo dice todo: teme a Vael más que a ti.', señalSutil:true, azar:{prob:0.9} },
          { txt: '[EMPATIZAR] "Sostener todo esto debe pesar mucho sobre usted."', tono:'empatizar', cuesta:true, va:'escena_ayudante', da:'pell_justifica', msg:'Pell se ablanda y se justifica, que es su forma de confesar. "¿Sabe lo que cuesta mantener un santuario para pobres? La fe no paga las facturas. Yo solo... optimizo. Si un parche ayuda a que la gente crea y dé, ¿qué hay de malo? Todos ganan." Todos menos los muertos que lo dieron todo esperando un milagro que él sabía químico.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo que has visto, y descubres que la pregunta de los Adeyemi —santa o ladrona— estaba mal planteada, porque la respuesta es las dos cosas a la vez, en dos personas distintas. Hay una fe verdadera y una mujer que cree en ella. Hay un alivio real que dura horas y una caja que nunca descansa. Y hay un panfleto que querría quemarlo todo junto. Separa a la creyente del aprovechado. Firma una conclusión.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN estafa a los fieles del Santuario IX?',
          opciones: [
            { txt: 'El Hermano Pell, a espaldas de Vael', correcta:true },
            { txt: 'La Hermana Vael, fingiendo milagros', correcta:false },
            { txt: 'Nadie: las curaciones son auténticas', correcta:false },
            { txt: 'Todo el Santuario, como culto organizado', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ funcionan las "curaciones"?',
          opciones: [
            { txt: 'Parches analgésicos que dan un alivio real pero temporal', correcta:true },
            { txt: 'Pura sugestión: no hay ningún alivio físico', correcta:false },
            { txt: 'Un poder genuino de la Hermana Vael', correcta:false },
            { txt: 'Tecnología médica avanzada de la facción eco', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO opera el engaño?',
          opciones: [
            { txt: 'Pell vende parches y exprime donaciones aprovechando la fe sincera de Vael', correcta:true },
            { txt: 'Vael y Pell se reparten un fraude planeado entre ambos', correcta:false },
            { txt: 'El Santuario entero coordina la estafa', correcta:false },
            { txt: 'Los propios fieles se autoengañan sin que nadie intervenga', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA SANTA Y EL LADRÓN',
          narr: 'Lo tienes, y es más afilado que cualquier sí o no. La Hermana Vael cree de verdad: vive en una celda, llora en cada rito, no se lleva una moneda. El milagro, sin embargo, es un parche analgésico que el Hermano Pell coloca y luego revende como "gracia concentrada", exprimiendo donaciones en el instante de máxima emoción y desviando una tajada a su cuenta. El abuelo de los Adeyemi murió dándolo todo por una química que duraba horas.\\n\\nLes entregas la verdad entera a la familia: que no busquen a una bruja, sino a un contable. Y haces algo más, porque puedes: te aseguras de que la verdad llegue a la propia Vael. Ella escucha lo de los parches y lo de la cuenta de Pell con una incredulidad que se va rompiendo, y cuando se rompe del todo, lo que queda en su cara no es furia: es el horror de quien descubre que su fe sirvió de cebo. No sabes si echará a Pell o si esto la quiebra. Pero por primera vez, el milagro y el robo dejan de dormir en el mismo altar. Cobras tu parte. Hay verdades que no curan a nadie y aun así había que decir.',
          pagaMult: 1.0, rep: 6, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Confirmas a los Adeyemi que hay un engaño y que las curaciones no son lo que parecen, pero no llegas a separar con claridad a la sincera Vael del calculador Pell. La familia se queda creyendo que toda la iglesia es un timo, y se va con un rencor que apunta tanto a la santa como al ladrón. Cobras menos. Has dicho una verdad, pero a medio enfocar, y una verdad a medio enfocar a veces hiere a quien no debía.',
          pagaMult: 0.5, rep: 2, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · QUEMARON EL ALTAR EQUIVOCADO',
          narr: 'Te quedaste con la versión grande: secta peligrosa, líder corrupta, ciérrenlo todo. Justo lo que pedía el panfleto de la organización rival que lleva años codiciando el edificio. Los Adeyemi denuncian al Santuario entero, la facción eco interviene y la Hermana Vael —que no robó jamás una moneda— cae con la institución: la apartan, le quitan su celda, su congregación se dispersa. El Hermano Pell, el único culpable, ve venir la tormenta, vacía su cuenta y desaparece en el Arrabal una semana antes de que nadie lo busque. El edificio cambia de manos. Cobras tu tarifa por un informe que castigó a la creyente y dejó libre al ladrón. A veces la mentira cómoda no solo no resuelve nada: condena a la única persona que era inocente.',
          pagaMult: 0.15, rep: -4, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 8 — ¿DE QUIÉN ES EL PERRO?
  //  Disputa cotidiana. Dos vecinos reclaman el mismo perro.
  //  Detrás no hay codicia: hay soledad.
  // ============================================================
  {
    id: 'de_quien_es_perro',
    titulo: '¿DE QUIÉN ES EL PERRO?',
    contratante: 'Oma Reuel · pensionista del bloque 7',
    peligro: 1,
    pagaBase: 120,
    progreso: 70,
    rangoMin: 0,
    diligencias: 5,
    resumen: 'Una mujer mayor te paga para demostrar que un perro callejero es suyo. Su vecino reclama el mismo animal y la cosa ha escalado hasta amenazas entre dos ancianos solos. Parece ridículo. Hasta que entiendes que ese perro es lo único vivo que les habla a cualquiera de los dos.',
    intro: 'Oma Reuel te recibe con el perro en el regazo, un chucho gris de orejas desiguales que la mira como si ella fuera el centro del mundo. "El vecino del 7-C dice que es suyo, que se llama Tuerca y que se le escapó. Miente. Este es mi Ceniza y lleva conmigo desde el invierno." Le tiembla la voz más de lo que un perro debería justificar. "La administración del bloque va a decidir la semana que viene. Demuéstreme que es mío. Le pago lo que tengo."\\n\\nNo es un gran caso. Es un perro y dos viejos. Pero a veces el caso más pequeño es el que más pesa. Mira bien.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Un perro. Dos reclamantes. Ninguna prueba de propiedad porque aquí abajo nadie registra un chucho callejero. Lo que decidas no irá a ningún tribunal, solo a una administración de bloque que firmará lo que parezca más sólido. Cada paso te cuesta tiempo y cobras una miseria. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Examinar al perro: chip, marcas, estado', va: 'escena_perro' },
          { txt: 'Hablar con el vecino del 7-C', va: 'escena_vecino' },
          { txt: 'Preguntar por el barrio de quién es el perro', va: 'escena_barrio' },
          { txt: 'Revisar quién lo alimenta y desde cuándo', va: 'escena_comida' },
          { txt: '— Creo que ya lo tengo. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_perro: {
        tiempo: 60,
        narr: 'El perro se deja mirar con la paciencia de quien ha pasado por muchas manos. Hay cosas que puedes comprobar en el animal mismo, y no te dará el tiempo para todas.',
        opciones: [
          { txt: 'Buscarle un chip de identificación', va:'escena_perro', cuesta:true, da:'sin_chip', etiqueta:'El perro no tiene chip de nadie', msg:'Nada. Ni chip, ni collar antiguo, ni tatuaje. Es un perro de nadie, de los que nacen y mueren en las Pilas sin que conste en ningún registro. La propiedad de Ceniza —o Tuerca— no se va a resolver con un dato técnico. Se va a resolver con quién lo cuida de verdad.' },
          { txt: 'Ver a quién responde el perro', va:'escena_perro', cuesta:true, da:'responde_ambos', etiqueta:'Responde a los nombres de ambos', msg:'Lo llevas ante los dos por separado. Acude a "Ceniza" con Oma. Acude a "Tuerca" con el vecino. Mueve la cola con los dos, busca el regazo de los dos. El perro no elige porque para el perro no hay disputa: hay dos personas solas que lo quieren, y a él le sobra cariño para repartir.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_vecino: {
        tiempo: 60,
        narr: 'El vecino del 7-C, un tal Bavi, te abre tras tres cerrojos. Vive aún más solo que Oma, en un piso donde el único cuenco limpio es el del agua del perro. Habla del animal como Oma: con una ternura que no encaja con una pelea por una posesión. Aquí decides el enfoque.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "Cuénteme qué significa el perro para usted."', tono:'empatizar', cuesta:true, va:'escena_vecino', da:'bavi_solo', etiqueta:'Bavi vive solo; el perro es su compañía', msg:'Bavi baja la guardia. "Desde que murió mi mujer, ese animal es la única razón por la que me levanto. Le hablo. Me escucha. Sé que la Reuel siente lo mismo, por eso duele tanto." No quiere ganar un objeto. Tiene miedo de volver al silencio. Igual que Oma.' },
          { txt: '[PRESIONAR] "¿Tiene una sola prueba de que es suyo?"', tono:'presionar', cuesta:true, va:'escena_vecino', da:null, etiqueta:'(Bavi se cerró)', msg:'Se le endurece la cara. "¿Pruebas? ¿Qué prueba tiene ella? Váyase, enviado de la Reuel." Cierra los tres cerrojos. Lo pierdes.', marca:'bavi_hostil' },
          { txt: '[MENTIR] "Oma tiene papeles del perro. Usted no tiene nada."', tono:'mentir', cuesta:true, va:'escena_vecino', da:'bavi_renuncia_falsa', etiqueta:'Bavi dice que renunciará "si hay papeles"', señalSutil:true, msg:'Bavi se hunde. "Si ella tiene papeles... entonces será suyo, qué voy a hacer yo." Te crees que has cerrado el caso a favor de Oma. Pero Oma no tiene papel alguno: te lo has inventado, y la "renuncia" de Bavi se apoya en una mentira tuya. Has ganado haciendo trampa a un anciano que solo quería compañía.', azar:{prob:0.95} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_barrio: {
        tiempo: 60,
        narr: 'Preguntas por el bloque. Todo el mundo conoce al perro; nadie sabe "de quién" es, porque la pregunta no tiene sentido en un sitio donde los animales son de la calle. Cada conversación te cuesta tiempo.',
        opciones: [
          { txt: 'Preguntar desde cuándo se ve al perro', va:'escena_barrio', cuesta:true, da:'perro_va_y_viene', etiqueta:'El perro lleva años yendo de puerta en puerta', msg:'Los vecinos coinciden: ese chucho lleva años en el bloque, durmiendo en un portal u otro según el frío, comiendo de quien le da. No es "de" nadie ni desde el invierno ni desde antes. Ha sido de todos un poco. Ahora dos personas solas quieren que sea solo suyo.' },
          { txt: 'Buscar a alguien que confirme la versión de Oma', va:'escena_barrio', cuesta:true, da:'testigo_pro_oma', etiqueta:'Una vecina jura que el perro es de Oma', señalSutil:true, msg:'Una vecina amiga de Oma jura que el perro "siempre ha sido de la Reuel, faltaría más". Lo dice con tanta lealtad como falta de memoria: es amiga de Oma, quiere ayudarla, y adornará lo que haga falta. Su testimonio vale lo que vale el cariño que le tiene a Oma, que es mucho, y como prueba, nada.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_comida: {
        tiempo: 60,
        narr: 'Quién alimenta al perro es, quizá, la única definición real de propiedad que tiene sentido aquí. Seguir ese rastro lleva su tiempo.',
        opciones: [
          { txt: 'Ver quién le da de comer a diario', va:'escena_comida', cuesta:true, da:'comen_los_dos', etiqueta:'Lo alimentan AMBOS, a horas distintas', msg:'La verdad incómoda: lo alimentan los dos. Oma por la mañana, Bavi por la noche, cada uno creyendo que es el único. El perro ha encontrado, sin saberlo, la manera de tener dos casas y dos comidas, y de darle a dos solitarios alguien a quien esperar. Quitárselo a cualquiera de los dos rompería algo más grande que una disputa.' },
          { txt: 'Comprobar quién paga sus gastos de veterinario', va:'escena_comida', cuesta:true, da:'gastos_compartidos', etiqueta:'Han pagado curas los dos, sin saberlo', msg:'En la clínica veterinaria del bloque hay dos fichas abiertas para el mismo perro: una a nombre de Reuel, otra de Bavi, por curas distintas en meses distintos. Los dos lo han cuidado cuando enfermó. Los dos son, por el único criterio que importa aquí, sus dueños.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Te sientas con lo que has visto y descubres que la pregunta de Oma —"demuéstreme que es mío"— no tiene respuesta, porque está mal hecha. No hay chip, no hay papeles, no hay dueño. Hay un perro de la calle y dos personas solas que lo necesitan por igual. Decide qué concluyes, sabiendo que tu informe puede dejar a un anciano sin lo único que lo levanta por las mañanas.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿DE QUIÉN es el perro?',
          opciones: [
            { txt: 'De ambos: lo cuidan y lo alimentan los dos', correcta:true },
            { txt: 'Solo de Oma, que lo reclamó primero', correcta:false },
            { txt: 'Solo de Bavi, que dice que se le escapó', correcta:false },
            { txt: 'De nadie: hay que llevarlo a una perrera', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ pelean tanto por él?',
          opciones: [
            { txt: 'Porque los dos están solos y el perro es su única compañía', correcta:true },
            { txt: 'Por codicia: el perro vale dinero', correcta:false },
            { txt: 'Por una rencilla vecinal antigua', correcta:false },
            { txt: 'Porque uno quiere fastidiar al otro', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO deberías cerrar el caso?',
          opciones: [
            { txt: 'Proponer que lo compartan, ya que ya lo hacían sin saberlo', correcta:true },
            { txt: 'Dárselo a Oma, que es quien te paga', correcta:false },
            { txt: 'Inventar una prueba para zanjarlo rápido', correcta:false },
            { txt: 'Recomendar que se lo lleve la administración', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · DOS CASAS, UN PERRO',
          narr: 'No le das a Oma lo que pidió, porque lo que pidió no existe. Le das la verdad: que Bavi lo alimenta cada noche igual que ella cada mañana, que el perro lleva años siendo de todo el bloque, que los dos lo han curado cuando enfermó sin saber del otro. Y le propones lo único sensato: que lo compartan, oficialmente, como ya lo compartían en secreto. Oma se resiste, orgullosa, hasta que entiende que la alternativa es perderlo del todo o ganárselo a un hombre tan solo como ella.\\n\\nLlevas la propuesta a la administración firmada por los dos. Ceniza-Tuerca dormirá en el 7-A unas noches y en el 7-C otras, y comerá el doble, feliz de su estafa involuntaria. Cobras los ciento veinte créditos de Oma, que es poco, y aceptas además, sin cobrarla, la primera invitación a un té que te hace alguien en mucho tiempo: la de dos viejos que ahora se hablan por encima de un perro. No has resuelto un caso de propiedad. Has impedido que dos personas volvieran al silencio. Cierra el expediente. Algunos pesan más de lo que pagan.',
          pagaMult: 1.0, rep: 3, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Concluyes que el perro no es de nadie en exclusiva, pero no llegas a tender el puente entre los dos: entregas un informe tibio que la administración interpreta a su manera, y el perro acaba con uno de los dos por sorteo, dejando al otro de vuelta en su piso en silencio. Cobras tu parte. Has dicho una verdad a medias, y a medias no bastaba para algo tan pequeño y tan grande a la vez.',
          pagaMult: 0.5, rep: 1, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL OTRO SE QUEDA SOLO',
          narr: 'Le diste a Oma lo que te pagaba: un informe que dice que el perro es suyo, apuntalado con el testimonio adornado de su amiga o con una prueba que te inventaste. La administración se lo concede. Oma se lleva a Ceniza a su piso y cierra la puerta, y al otro lado del rellano Bavi se queda mirando un cuenco de agua que ya no va a beber nadie. Cobras tus créditos. Ganaste el caso y rompiste a un hombre que solo quería que algo lo esperase despierto. En las Pilas, a veces, separar a un perro de un anciano es una forma silenciosa de matar.',
          pagaMult: 0.45, rep: -3, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 9 — EL INQUILINO FANTASMA
  //  Día a día con giro de duelo. Alguien paga el alquiler de un
  //  piso vacío. Ni romance ni crimen: un viudo y su luto.
  // ============================================================
  {
    id: 'inquilino_fantasma',
    titulo: 'EL INQUILINO FANTASMA',
    contratante: 'Inmobiliaria Korr · gestor de fincas',
    peligro: 1,
    pagaBase: 160,
    progreso: 80,
    rangoMin: 0,
    diligencias: 5,
    resumen: 'Un piso de las capas medias lleva ocho meses con el alquiler pagado puntualmente y a nadie viviendo dentro. La inmobiliaria quiere saber quién paga y por qué, antes de meterse en líos legales. No hay delito a la vista. Solo una puerta que nadie abre y un dinero que no falla.',
    intro: 'El gestor de la Inmobiliaria Korr te enseña el expediente con la incomodidad de quien huele un problema sin nombre. "Piso 4-B. El alquiler entra cada mes, al día, desde una cuenta que no logramos rastrear del todo. Pero los sensores de consumo dicen que ahí dentro no vive nadie: ni agua, ni luz, ni una puerta que se abra. Ocho meses." Golpea el papel. "O hay algo turbio, o hay un loco tirando el dinero. Averígüelo. No queremos sorpresas legales."\\n\\nUn piso pagado y vacío. Suena a tapadera. Suele serlo. Pero mira antes de suponer.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Alguien paga por un espacio que no usa. Las posibilidades evidentes son turbias: blanqueo, un escondite, una dirección falsa para algo ilegal. Pero el dinero entra demasiado limpio y demasiado puntual para un criminal. Cada paso te cuesta tiempo. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Entrar a inspeccionar el piso 4-B', va: 'escena_piso_vacio' },
          { txt: 'Rastrear de dónde sale el dinero del alquiler', va: 'escena_dinero_alquiler' },
          { txt: 'Preguntar a los vecinos del 4-B', va: 'escena_vecinos_4b' },
          { txt: 'Revisar quién vivía antes en el piso', va: 'escena_historial_piso' },
          { txt: '— Creo que ya lo tengo. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_piso_vacio: {
        tiempo: 60,
        narr: 'El gestor te presta la llave maestra. El piso 4-B huele a cerrado, a polvo asentado con cuidado. No está abandonado: está detenido. Hay detalles que mirar, y no aguantarás dentro indefinidamente sin que el gestor pregunte.',
        opciones: [
          { txt: 'Examinar cómo está conservado el piso', va:'escena_piso_vacio', cuesta:true, da:'piso_intacto', etiqueta:'Todo intacto, como un hogar congelado', msg:'No hay desorden ni saqueo. Hay una vida entera detenida: dos tazas en el escurridor, ropa de mujer en el armario, una novela abierta boca abajo en la mesilla, marcada en una página que nadie va a terminar. Alguien limpia el polvo, pero nadie mueve nada de sitio. Esto no es un escondite. Es un altar.' },
          { txt: 'Buscar rastro de actividad ilegal', va:'escena_piso_vacio', cuesta:true, da:'sin_actividad', etiqueta:'Ni rastro de uso delictivo', msg:'Nada. Ni mercancía, ni equipo, ni señales de que entre y salga gente. El único indicio de presencia humana es un florero con flores frescas en la mesa, cambiadas hace pocos días. Quien viene, viene solo, brevemente, y se va. No a esconder algo. A visitar.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_dinero_alquiler: {
        tiempo: 60,
        narr: 'El dinero es lo que más inquieta a la inmobiliaria. Rastrearlo a través de las capas de la banca de las Pilas lleva tiempo, pero todo flujo deja sedimento.',
        opciones: [
          { txt: 'Seguir el origen de los pagos', va:'escena_dinero_alquiler', cuesta:true, da:'paga_un_viudo', etiqueta:'Lo paga un hombre, Edran Sould, desde su pensión', msg:'El dinero sale, vuelta tras vuelta, de la cuenta de un hombre: Edran Sould, jubilado, que vive a tres bloques de distancia en un piso mucho más humilde que el que paga. No esconde el dinero: lo gasta. Vive con lo justo para sostener un alquiler que no usa. Eso no lo hace un criminal. Lo hace alguien que paga por otra cosa que no es un techo.' },
          { txt: 'Comprobar si la cuenta blanquea fondos', va:'escena_dinero_alquiler', cuesta:true, da:'sin_blanqueo', etiqueta:'No hay blanqueo: solo una pensión menguante', msg:'La cuenta no recibe ingresos raros ni mueve cantidades sospechosas. Solo una pensión modesta que cada mes se vacía un poco más para cubrir dos alquileres: el del hombre y el del piso fantasma. No está lavando dinero. Se está arruinando despacio por mantener ese piso en pie.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_vecinos_4b: {
        tiempo: 60,
        narr: 'Los vecinos del rellano del 4-B son gente de las capas medias, discreta, que tarda en hablar con un desconocido. Aquí decides cómo abordarlos; cada vía gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "¿Recuerdan a quién vivía en el 4-B?"', tono:'empatizar', cuesta:true, va:'escena_vecinos_4b', da:'vivia_pareja', etiqueta:'Ahí vivía un matrimonio mayor, muy unido', msg:'Una vecina se ablanda al recordar. "El señor Sould y su esposa, Lía. Cuarenta años casados. Ella enfermó el invierno pasado y... se fue. Él aguantó unos días en el piso y luego se mudó a uno más pequeño, no podía con los recuerdos. Pero sigue pagando este. Yo lo veo entrar a veces, los domingos. Sale con los ojos rojos." Ya sabes qué es el piso.' },
          { txt: '[PRESIONAR] "¿Han visto entrar gente rara, movimientos de noche?"', tono:'presionar', cuesta:true, va:'escena_vecinos_4b', da:null, etiqueta:'(Los vecinos se cierran)', msg:'Tu tono de interrogatorio los espanta. "Nosotros no nos metemos en lo de los demás. Buenas tardes." Cierran filas y no sacas nada.', marca:'vecinos_hostiles' },
          { txt: '[MENTIR] "Sabemos que en el 4-B se trapichea. Colaboren."', tono:'mentir', cuesta:true, va:'escena_vecinos_4b', da:'rumor_trapicheo', etiqueta:'Un vecino "confirma" movimientos sospechosos', señalSutil:true, msg:'Un vecino, deseoso de quedar bien con quien parece autoridad, te sigue la corriente: "Pues ahora que lo dice, sí, he visto cosas raras, gente entrando de noche..." Pero al apretar se deshace: no ha visto nada, repite lo que cree que quieres oír. Le has plantado tú la idea del trapicheo y te la devuelve como eco. Humo que tú mismo encendiste.', azar:{prob:0.9} },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_historial_piso: {
        tiempo: 60,
        narr: 'El historial del piso en los archivos de la inmobiliaria es público y aburrido, pero los datos fríos a veces cuentan lo que la gente calla. Revisarlo lleva tiempo.',
        opciones: [
          { txt: 'Buscar el contrato y sus titulares', va:'escena_historial_piso', cuesta:true, da:'contrato_dos_nombres', etiqueta:'El contrato está a nombre de Edran y Lía Sould', msg:'El contrato original lo firmaron dos personas: Edran Sould y Lía Sould, hace décadas. El de Lía nunca se ha dado de baja. Edran paga un piso que sigue, sobre el papel, también a nombre de su mujer. Mientras el contrato lleve los dos nombres, para él, en algún rincón, ella sigue viviendo ahí.' },
          { txt: 'Cruzar la baja de Lía en los registros', va:'escena_historial_piso', cuesta:true, da:'lia_fallecida', etiqueta:'Lía Sould consta fallecida hace 8 meses', msg:'El registro civil lo confirma con la frialdad de una fecha: Lía Sould, fallecida hace ocho meses. Justo cuando empezaron los pagos del piso vacío. No es una coincidencia que investigar. Es el día en que un hombre decidió que su mujer no se iría del todo mientras él pudiera pagar la habitación donde fue feliz.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo que tienes y te das cuenta de que la inmobiliaria te contrató para destapar un fraude y lo que has encontrado es un duelo. Un piso intacto, flores frescas, dos nombres en un contrato, una pensión que se vacía para sostener un hogar donde ya no vive nadie. Decide qué pones en tu informe, sabiendo que la verdad, mal entregada, puede echar a un viudo del único sitio donde aún le habla su mujer.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN paga el piso vacío y qué es?',
          opciones: [
            { txt: 'Edran Sould, viudo, que conserva el hogar de su esposa muerta', correcta:true },
            { txt: 'Una red que usa el piso para blanquear dinero', correcta:false },
            { txt: 'Alguien que lo mantiene como escondite', correcta:false },
            { txt: 'Un trapicheo vecinal de las capas medias', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo mantiene pagado y vacío?',
          opciones: [
            { txt: 'Por duelo: no soporta dejar ir el lugar donde vivió con ella', correcta:true },
            { txt: 'Para ocultar una actividad ilegal', correcta:false },
            { txt: 'Para defraudar a la inmobiliaria', correcta:false },
            { txt: 'Por un error administrativo que no corrige', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO cierras el informe a la inmobiliaria?',
          opciones: [
            { txt: 'Confirmando que no hay delito y protegiendo la intimidad del viudo', correcta:true },
            { txt: 'Reportando un posible fraude para que lo desahucien', correcta:false },
            { txt: 'Dejándolo como "actividad sospechosa no concluyente"', correcta:false },
            { txt: 'Exponiendo todos los detalles personales de Sould', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA HABITACIÓN DONDE AÚN VIVE',
          narr: 'Le entregas a la inmobiliaria justo lo que necesita y ni una palabra más: no hay delito, no hay fraude, no hay riesgo legal. El inquilino paga al día, por su propia voluntad, por motivos privados que no infringen nada. Caso cerrado, sin un nombre, sin una historia, sin una herida que exponer. El gestor refunfuña porque quería un escándalo y se lleva un papel aburrido, que es exactamente lo que protege a Edran Sould.\\n\\nNo tenías por qué, pero un domingo te acercas al 4-B. Edran está dentro, cambiando las flores. No le dices que lo han investigado; le dices que eres del edificio y que todo está en orden con su contrato. Él asiente, agradecido sin saber de qué, y mira un segundo la novela abierta en la mesilla. "A ella le faltaban tres páginas", dice, sin que le preguntes. Cobras tus ciento sesenta créditos. Has hecho tu trabajo —no había delito— y has dejado que un hombre siga pagando por lo único que le impide aceptar que se quedó solo. Hay verdades que se cierran mejor con silencio.',
          pagaMult: 1.0, rep: 4, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Confirmas que no hay delito, pero en el informe dejas caer detalles personales de más sobre Sould y su duelo. La inmobiliaria no lo desahucia, pero ahora media gestoría conoce la intimidad de un viudo que solo quería su rincón en paz. Cobras tu parte. No has hecho daño grave, pero has aireado algo que pedía discreción, y eso también es una forma de fallar a la gente pequeña.',
          pagaMult: 0.5, rep: 1, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL DESAHUCIO',
          narr: 'Tomaste el camino del expediente: reportaste "actividad sospechosa", quizá apuntalada con el falso rumor de trapicheo que tú mismo plantaste entre los vecinos. La inmobiliaria, encantada de recuperar un piso de capas medias, rescinde el contrato por "uso irregular" y vacía el 4-B en una tarde. Las dos tazas, la ropa de Lía, la novela a tres páginas del final, todo a un contenedor. Edran Sould se entera por una notificación y no vuelve a cambiar flores en ningún sitio. Cobras tu tarifa. Encontraste la verdad —no había delito— y aun así la usaste para arrancarle a un hombre el último cuarto donde su mujer seguía, un poco, viva. En las Pilas no hace falta ser cruel para destruir a alguien. Basta con rellenar bien el formulario.',
          pagaMult: 0.4, rep: -4, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 10 — LA CITA QUE NO ERA
  //  Día a día con giro triste. No es estafa romántica: él es
  //  real, pero esconde algo más pequeño y más humano.
  // ============================================================
  {
    id: 'cita_que_no_era',
    titulo: 'LA CITA QUE NO ERA',
    contratante: 'Petra Lund · oficinista de HELIX',
    peligro: 1,
    pagaBase: 200,
    progreso: 95,
    rangoMin: 1,
    diligencias: 5,
    resumen: 'Una mujer ha conocido a alguien por una app de citas. Está enamorada, pero algo no cuadra: él esquiva las videollamadas, nunca queda cerca de su trabajo, paga siempre en efectivo. La amiga le ha metido en la cabeza que es una estafa romántica. Te paga para saber si Daro es un timador. Lo que descubres es más incómodo que un timo.',
    intro: 'Petra Lund te recibe nerviosa, con el terminal lleno de mensajes que ha leído mil veces. "Daro es... atento, listo, me hace reír. Pero llevamos tres meses y nunca lo he visto de día. Siempre tiene una excusa. Mi amiga dice que es una estafa, que un día me pedirá dinero." Se muerde el labio. "Necesito saber quién es de verdad antes de... antes de quererlo más. Si me está engañando, prefiero saberlo ya."\\n\\nLas señales que describe encajan con un timo de manual. Demasiado de manual. Mira si hay algo debajo.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Un hombre esquivo en una app de citas: el patrón clásico del estafador romántico que prepara el sablazo. Pero Daro lleva tres meses sin pedir un solo crédito, lo cual no encaja con un timador, que cobra y desaparece. Cada paso de seguimiento te cuesta tiempo. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Verificar la identidad del perfil de Daro', va: 'escena_perfil' },
          { txt: 'Seguir a Daro en uno de sus encuentros', va: 'escena_seguir_daro' },
          { txt: 'Analizar el patrón de sus excusas y horarios', va: 'escena_patron' },
          { txt: 'Buscar denuncias previas por estafa romántica', va: 'escena_denuncias' },
          { txt: '— Creo que ya lo tengo. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_perfil: {
        tiempo: 60,
        narr: 'El perfil de Daro en la app es escueto: pocas fotos, ninguna de cuerpo entero reciente, datos vagos. Verificarlo a fondo lleva tiempo, pero deja claro algo.',
        opciones: [
          { txt: 'Comprobar si las fotos son robadas', va:'escena_perfil', cuesta:true, da:'fotos_reales', etiqueta:'Las fotos son suyas, pero antiguas', msg:'Las fotos no están robadas de internet, como harías en una estafa: son de Daro de verdad. Pero son de hace años. En todas se le ve sano, de pie, sonriente al aire libre. La persona del perfil existe; simplemente, ya no es del todo la de las fotos. Algo ha cambiado en él desde que se las hizo.' },
          { txt: 'Rastrear su identidad real', va:'escena_perfil', cuesta:true, da:'daro_existe', etiqueta:'Daro Venn existe y es quien dice ser', msg:'Daro Venn es una persona real, registrada, con un nombre que coincide, un historial laboral verificable como técnico y ninguna identidad falsa detrás. No es un fantasma ni un alias. Quien le escribe a Petra cada noche es exactamente quien dice ser. El misterio no es su identidad. Es por qué se esconde.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_seguir_daro: {
        tiempo: 90,
        narr: 'Consigues una dirección a partir de sus pagos y lo sigues una tarde. Lo que ves no es a un hombre yendo a estafar a nadie. Hay detalles que confirmar y no tendrás tiempo para todos.',
        opciones: [
          { txt: 'Observar cómo se mueve y a dónde va', va:'escena_seguir_daro', cuesta:true, da:'daro_enfermo', etiqueta:'Daro se mueve con dificultad, va a una clínica', msg:'Daro camina despacio, apoyado en un bastón que en las fotos del perfil no existía. Su trayecto es corto y repetido: de casa a una clínica de rehabilitación de las capas medias, y vuelta. Un accidente, una enfermedad degenerativa, algo le cambió el cuerpo. No esquiva a Petra para estafarla. La esquiva para que no lo vea así.' },
          { txt: 'Ver si se encuentra con otras mujeres', va:'escena_seguir_daro', cuesta:true, da:'sin_otras', etiqueta:'No hay otras mujeres ni cómplices', msg:'Nadie. Ni otras citas, ni cómplices, ni el trasiego de un estafador que lleva varios objetivos a la vez. Daro vive solo, sale poco, y la única persona con la que se ilumina —lo notas hasta de lejos, al teclear en su terminal— es Petra. No la está cazando. Se ha enamorado y no sabe cómo dejar que lo vea.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_patron: {
        tiempo: 60,
        narr: 'Las excusas de Daro, puestas en fila, forman un patrón. La amiga de Petra las lee como tácticas de manipulación. Analizarlas con cuidado lleva tiempo.',
        opciones: [
          { txt: 'Cruzar sus horarios con algo real', va:'escena_patron', cuesta:true, da:'horarios_clinica', etiqueta:'Sus "excusas" coinciden con horarios de clínica', msg:'Cada vez que Daro "no puede quedar de día" o "tiene que colgar pronto", la hora coincide con sesiones de rehabilitación o con los momentos en que el dolor, según los patrones de su tratamiento, sería peor. No son excusas para manipular. Son la coreografía de alguien que organiza su vida en torno a un cuerpo que le falla, y que prefiere mentir antes que dar pena.' },
          { txt: 'Buscar si alguna vez ha pedido dinero', va:'escena_patron', cuesta:true, da:'nunca_pidio', etiqueta:'En 3 meses nunca pidió ni un crédito', msg:'Repasas tres meses de mensajes: ni una sola petición de dinero, ni una emergencia inventada, ni un "préstamo" que es la firma de toda estafa romántica. Al contrario: Daro ha rechazado dos veces que Petra pague la cena. Un timador cobra. Daro solo da. Eso descarta el timo por completo.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_denuncias: {
        tiempo: 60,
        narr: 'Buscar antecedentes de estafa romántica es lo que la amiga de Petra daría por hecho. Cruzar los registros lleva tiempo.',
        opciones: [
          { txt: 'Buscar denuncias a nombre de Daro', va:'escena_denuncias', cuesta:true, da:'sin_denuncias', etiqueta:'Daro no tiene una sola denuncia', msg:'Ni una. Daro Venn no figura en ningún registro de fraude, ni hay mujeres que lo hayan denunciado, ni patrón de víctimas. Su historial está tan limpio que resulta casi triste: es un hombre sin nada turbio detrás y sin casi nada delante, salvo una app de citas y una clínica.' },
          { txt: 'Atender a la teoría de la amiga de Petra', va:'escena_denuncias', cuesta:true, da:'teoria_amiga', etiqueta:'La amiga insiste: "seguro que es un timo"', señalSutil:true, msg:'La amiga de Petra te aborda y te insiste, con total seguridad, en que "esos siempre son estafadores, lo he visto mil veces en las noticias". No aporta un solo hecho sobre Daro: aporta su miedo general y un patrón de telediario. Quiere proteger a Petra y por eso da por hecho lo peor. Su certeza es cariño asustado, no prueba. Encaja con lo que Petra teme, pero no con lo que Daro es.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo que has visto y resulta que el caso se invierte: te pagaron para destapar a un estafador y has encontrado a un hombre honesto que miente por una sola razón, vergüenza. Daro existe, no ha pedido nunca dinero, no tiene otras mujeres ni denuncias. Solo un bastón que no estaba en sus fotos y un miedo enorme a que lo quieran menos por él. Decide qué le dices a Petra.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN es Daro en realidad?',
          opciones: [
            { txt: 'Un hombre real y honesto, con una enfermedad o lesión que oculta', correcta:true },
            { txt: 'Un estafador romántico preparando el sablazo', correcta:false },
            { txt: 'Una identidad falsa con fotos robadas', correcta:false },
            { txt: 'Un hombre con otras mujeres a la vez', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ se esconde de Petra?',
          opciones: [
            { txt: 'Por vergüenza: teme que lo quiera menos al ver cómo está ahora', correcta:true },
            { txt: 'Para ganarse su confianza antes de pedirle dinero', correcta:false },
            { txt: 'Porque oculta a una familia o a otras parejas', correcta:false },
            { txt: 'Porque su identidad es falsa', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO cierras el caso con Petra?',
          opciones: [
            { txt: 'Decirle la verdad: no es un timo, es un hombre asustado de ser visto', correcta:true },
            { txt: 'Confirmarle que es un estafador para que lo deje', correcta:false },
            { txt: 'Exponer la enfermedad de Daro con todo detalle sin su permiso', correcta:false },
            { txt: 'Decirle que no averiguaste nada concluyente', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LO QUE ESCONDÍA NO ERA UNA TRAMPA',
          narr: 'Le dices a Petra la verdad, con cuidado, porque la verdad aquí es frágil. Daro no es un timador: es exactamente quien dice ser. No le ha pedido dinero porque no quiere su dinero, quiere su compañía. Y se esconde de día, esquiva las videollamadas y miente con las excusas por una sola razón: un bastón que no sale en sus fotos y el terror de que ella, al verlo como está ahora, lo quiera menos. No le detallas su diagnóstico, eso es de él contarlo; solo le dices que lo que oculta es miedo, no maldad.\\n\\nPetra llora, y no es de decepción. "Pensaba que el problema era que yo no le importaba", dice. "Y resulta que el problema es que le importo demasiado." Cobras tus doscientos créditos. Lo que ella haga con eso ya no es tu caso: si lo deja, si lo abraza, si le da tiempo a que se atreva a aparecer de día. Tú solo le has quitado de encima el miedo equivocado para dejarle, si quiere, el trabajo bonito y difícil de querer a alguien tal como es. No todas las cosas que se esconden son trampas. Algunas solo son heridas esperando que no las espanten.',
          pagaMult: 1.0, rep: 4, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Le confirmas a Petra que Daro no es un estafador, lo cual la tranquiliza, pero no llegas a explicarle el porqué de su escondite, así que se queda con la duda royéndola: ¿entonces qué oculta? Sin esa pieza, su imaginación trabajará sola, y puede que llene el hueco con sospechas nuevas. Cobras tu parte. Has dicho una verdad incompleta, y en el amor las verdades a medias a veces hacen tanto daño como las mentiras.',
          pagaMult: 0.5, rep: 2, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · CONFIRMASTE EL MIEDO',
          narr: 'Te quedaste con la versión fácil, la de la amiga: le dijiste a Petra que Daro es sospechoso, que las señales son de estafa, que mejor lo deje. Petra, asustada, lo bloquea sin una explicación. Al otro lado, un hombre que por fin se había atrevido a querer desde su cuerpo roto ve cómo la única luz de sus noches se apaga sin un porqué, y confirma lo que más temía: que no merecía que lo vieran. Cobras tu tarifa por un informe perezoso. Tenías delante a un hombre honesto y a una mujer que lo quería, y los separaste con el patrón de un telediario. A veces el peor timo lo comete quien viene a destapar timos.',
          pagaMult: 0.4, rep: -3, parcial:false, malo:true
        }
      }
    }
  },
  // ============================================================
  //  CASO 11 — LA HORA DEL ALMUERZO
  //  Infidelidad REAL. Sin giro que la absuelva: hay engaño,
  //  y el caso es qué hace el cliente con la verdad.
  // ============================================================
  {
    id: 'hora_del_almuerzo',
    titulo: 'LA HORA DEL ALMUERZO',
    contratante: 'Ans Berko · contable de las capas medias',
    peligro: 1,
    pagaBase: 220,
    progreso: 100,
    rangoMin: 1,
    diligencias: 6,
    resumen: 'Un hombre sospecha que su marido le es infiel. No hay drama ni gritos: solo una rutina que ya no cuadra, una alianza que a veces no aparece, una distancia nueva. Te paga para saber la verdad. Esta vez no hay giro tierno: hay un amante, hay mentiras, y al final habrá que decidir qué se hace con eso.',
    intro: 'Ans Berko habla en voz baja, como si su propia casa pudiera oírlo. "Cael y yo llevamos doce años. Últimamente... almuerza fuera cada día, dice que con compañeros. Se quita la alianza para esos almuerzos, la deja en el cajón. Vuelve oliendo a un perfume que no es el suyo." Aprieta los labios. "No quiero estar loco. Si me equivoco, prefiero saber que me equivoco. Y si no... también." Te mira con la dignidad cansada de quien ya sabe la respuesta y solo busca quien la confirme.\\n\\nLas señales son claras y, esta vez, no engañan. Pero confírmalo bien antes de romperle la vida a alguien con una suposición.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Almuerzos diarios fuera, una alianza que desaparece, un perfume ajeno. El patrón apunta a lo que Ans teme. Pero "apuntar" no es "probar", y un informe de infidelidad mal hecho destroza un matrimonio por nada. Tu trabajo es confirmar o descartar con hechos, no con sospechas. Cada paso te cuesta tiempo. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Seguir a Cael en sus almuerzos', va: 'escena_almuerzos' },
          { txt: 'Investigar el perfume y los detalles físicos', va: 'escena_perfume' },
          { txt: 'Revisar sus gastos y mensajes accesibles', va: 'escena_gastos_cael' },
          { txt: 'Sondear a un compañero de trabajo de Cael', va: 'escena_companero_cael' },
          { txt: '— Creo que ya lo tengo. Pasar a la conclusión', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_almuerzos: {
        tiempo: 90,
        narr: 'Sigues a Cael dos días seguidos a la hora del almuerzo. No va con compañeros. Hay detalles que confirmar y no tendrás tiempo para todos.',
        opciones: [
          { txt: 'Ver con quién se encuentra', va:'escena_almuerzos', cuesta:true, da:'encuentro_amante', etiqueta:'Cael se ve con la misma persona cada día', msg:'Cael entra cada día en el mismo café discreto de una galería apartada, y allí lo espera siempre la misma persona. No es una reunión de trabajo: se saludan con la familiaridad de quien se conoce el cuerpo, no la agenda. Se sientan juntos, no enfrente. Hay caricias bajo la mesa que nadie hace con un colega. Esto no es una sospecha. Es una relación.' },
          { txt: 'Comprobar el detalle de la alianza', va:'escena_almuerzos', cuesta:true, da:'alianza_guardada', etiqueta:'Se quita la alianza antes de cada encuentro', msg:'Lo ves hacerlo: en el portal de la galería, antes de entrar, Cael se quita la alianza y la guarda en el bolsillo interior. Al salir, se la vuelve a poner. Es un gesto practicado, automático, de quien lleva tiempo separando dos vidas. La alianza no se le cae: se la quita. Y eso lo dice todo.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_perfume: {
        tiempo: 60,
        narr: 'El perfume ajeno es el detalle que más obsesiona a Ans. Rastrear de dónde sale lleva tiempo, pero confirma o desmonta cosas.',
        opciones: [
          { txt: 'Identificar el origen del perfume', va:'escena_perfume', cuesta:true, da:'perfume_de_otra_persona', etiqueta:'El perfume es de la persona del café', msg:'Es un perfume concreto, de boutique, nada común. Y es exactamente el que lleva la persona con la que Cael almuerza: lo confirmas cuando pasa cerca de ti al salir. El olor que Ans nota en su marido cada tarde no es ambiente de oficina. Es el rastro de un cuerpo pegado al de Cael durante una hora, cada día.' },
          { txt: 'Considerar una explicación inocente', va:'escena_perfume', cuesta:true, da:'coartada_perfume', etiqueta:'Cael alega "el ambientador del restaurante"', señalSutil:true, msg:'Cael, en una conversación con Ans que este te reporta, ha explicado el olor como "el ambientador de los restaurantes donde comemos". Suena plausible y por eso es útil: es la coartada cómoda que permitiría a Ans no mirar. Pero ningún ambientador de local deja un perfume de boutique tan específico ni tan localizado en el cuello. Es la explicación que duele menos, no la que es cierta.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_gastos_cael: {
        tiempo: 60,
        narr: 'Ans te da acceso a las cuentas compartidas y a lo que puede ver del terminal de Cael. El dinero y los mensajes dejan rastro. Cada cruce te cuesta tiempo.',
        opciones: [
          { txt: 'Rastrear gastos en los almuerzos', va:'escena_gastos_cael', cuesta:true, da:'gastos_dobles', etiqueta:'Paga dos cubiertos cada día, en efectivo aparte', msg:'En la cuenta compartida no aparece nada: Cael paga esos almuerzos con una tarjeta aparte que Ans no conoce, siempre dos cubiertos, siempre el mismo sitio. Mantiene una contabilidad secreta para una vida secreta. No es un gasto casual. Es la infraestructura de una doble vida sostenida con cuidado durante meses.' },
          { txt: 'Buscar mensajes reveladores', va:'escena_gastos_cael', cuesta:true, da:'mensajes_amante', etiqueta:'Mensajes tiernos a un contacto sin nombre', msg:'En una app secundaria, conversaciones diarias con un contacto guardado solo con un emoji, sin nombre. El tono no deja lugar a dudas: planes, intimidad, "ojalá no tuvieras que volver a casa". No son mensajes de un desliz de una noche. Son los de una relación paralela con sentimientos, lo cual para Ans será peor que el sexo: Cael no solo se acuesta con otro. Lo quiere.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_companero_cael: {
        tiempo: 60,
        narr: 'Localizas a un compañero real de la oficina de Cael, uno que a veces aparece en sus coartadas. Aquí decides cómo abordarlo; cada vía gasta tu tiempo.',
        entrevista: true,
        opciones: [
          { txt: '[EMPATIZAR] "No quiero meterle en líos. Solo confirmar algo."', tono:'empatizar', cuesta:true, va:'escena_companero_cael', da:'coartada_falsa', etiqueta:'El compañero no almuerza nunca con Cael', msg:'El compañero se remueve incómodo. "Mire, yo no quiero problemas. Cael me pidió que, si alguien preguntaba, dijera que comemos juntos. Pero no es verdad, hace meses que no come con nosotros. No sé con quién va y no quiero saberlo." Acabas de confirmar que la coartada de Cael es una mentira pactada. No hay duda razonable que quede.' },
          { txt: '[PRESIONAR] "Usted lo encubre. ¿Es cómplice de algo?"', tono:'presionar', cuesta:true, va:'escena_companero_cael', da:null, etiqueta:'(El compañero se cierra)', msg:'Se asusta y se cierra en banda. "Yo no sé nada, no me meta en esto." Se va. Lo pierdes como fuente.', marca:'companero_hostil' },
          { txt: '[MENTIR] "Cael ya ha confesado. Solo necesito su versión."', tono:'mentir', cuesta:true, va:'escena_companero_cael', da:'coartada_falsa', etiqueta:'El compañero confirma la coartada pactada', msg:'Picado por la idea de que ya todo se sabe, el compañero suelta lo que sabe: "Bueno, si ya lo ha contado... sí, me pidió cubrirle los almuerzos, yo le seguí la corriente, pero no pregunté con quién." Confirma la coartada falsa, aunque te deja claro que no conoce a la otra persona. La mentira funciona, pero te recuerda que has manipulado a un don nadie para llegar aquí.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Ordenas lo reunido y, a diferencia de otros casos, aquí la verdad no tiene escapatoria amable: Cael ve a la misma persona cada día, se quita la alianza, mantiene una tarjeta y una app secretas, paga la coartada de un compañero. Hay infidelidad, y además hay sentimientos, que para Ans será lo más duro. Lo único que queda por decidir es cómo le entregas esto a un hombre que ya intuía la respuesta y aun así te pagó por oírla.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿LE es infiel Cael a Ans?',
          opciones: [
            { txt: 'Sí: mantiene una relación paralela con otra persona', correcta:true },
            { txt: 'No: las señales tienen una explicación inocente', correcta:false },
            { txt: 'No está claro, hace falta seguir investigando', correcta:false },
            { txt: 'Solo es una amistad que Ans malinterpreta', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿QUÉ tipo de infidelidad es?',
          opciones: [
            { txt: 'Una relación sostenida, con sentimientos, oculta con cuidado', correcta:true },
            { txt: 'Un desliz aislado de una sola vez', correcta:false },
            { txt: 'Una crisis pasajera sin nadie concreto detrás', correcta:false },
            { txt: 'Un malentendido sobre reuniones de trabajo', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO le entregas la verdad a Ans?',
          opciones: [
            { txt: 'Con pruebas claras y sin adornos, dejándole a él decidir qué hacer', correcta:true },
            { txt: 'Suavizándola hasta que parezca menos grave de lo que es', correcta:false },
            { txt: 'Animándole a vengarse o a montar una escena', correcta:false },
            { txt: 'Ocultándole los sentimientos de Cael para ahorrarle dolor', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LO QUE YA SABÍA',
          narr: 'Le entregas a Ans las pruebas sin crueldad y sin piedad falsa: el café, la alianza en el bolsillo, la tarjeta secreta, los mensajes, la coartada pactada. No le adornas la verdad para que duela menos —eso sería tratarlo como a un niño— ni se la afilas para que duela más. Le das los hechos y el espacio para encajarlos. Ans los recibe en silencio, asintiendo despacio, y cuando habla no hay sorpresa en su voz, solo el peso de una confirmación. "Gracias por no mentirme tú también", dice.\\n\\nNo le dices qué hacer. No es tu trabajo decidir si perdona, si se va, si pelea por los doce años o los entierra. Le ofreces, eso sí, una cosa práctica: copias ordenadas de las pruebas, por si algún día las necesita ante un abogado, y el nombre de alguien que ayuda en estos trances sin cobrar de más. Cobras tus doscientos veinte créditos. No has salvado un matrimonio ni roto uno: solo le has devuelto a un hombre la certeza que necesitaba para dejar de volverse loco. A veces el trabajo no es traer buenas noticias. Es traer la verdad con las manos limpias.',
          pagaMult: 1.0, rep: 4, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · A MEDIAS',
          narr: 'Confirmas la infidelidad, pero entregas el caso con cabos sueltos: pruebas incompletas, o suavizadas, o sin la claridad que Ans necesitaba para estar seguro. Él te cree a medias y se queda con una duda que lo corroe: ¿y si exageraste, y si malinterpretaste? Esa grieta le impedirá tanto perdonar como marcharse en paz. Cobras tu parte. Tenías una verdad difícil y la entregaste a medio cocer, que en estas cosas es casi peor que callarla.',
          pagaMult: 0.5, rep: 1, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL FAVOR ENVENENADO',
          narr: 'Erraste el cómo. O le restaste hierro hasta convencerlo de que "no era para tanto", y Ans volvió a casa a tragarse una mentira que ahora tú avalas; o le calentaste la cabeza para que montara una escena, y Ans encaró a Cael a gritos, sin pruebas ordenadas, quedando él como el desequilibrado y dándole a Cael la coartada perfecta para irse haciéndose la víctima. Sea como sea, no le diste lo que un investigador debe dar: la verdad, limpia, en sus manos, para que él decida. Cobras tu tarifa. Tenías los hechos y los manejaste como un torpe o como un cizañero, y un hombre que ya sufría sufre ahora encima por tu culpa. Hay maneras de tener razón que hacen tanto daño como mentir.',
          pagaMult: 0.3, rep: -3, parcial:false, malo:true
        }
      }
    }
  },

  // ============================================================
  //  CASO — LA DEUDA DE SANGRE FRÍA  (rango 2)
  //  Un cobrador del Loto aparece muerto. ¿Ajuste de cuentas,
  //  o algo que el propio Loto quiere tapar? Intriga de facción.
  // ============================================================
  {
    id: 'deuda_sangre_fria',
    titulo: 'LA DEUDA DE SANGRE FRÍA',
    contratante: 'Mano Roja · lugarteniente del Loto',
    peligro: 3,
    pagaBase: 480,
    progreso: 150,
    rangoMin: 2,
    diligencias: 6,
    resumen: 'Un cobrador del Loto apareció muerto en un callejón del Arrabal, con la recaudación intacta en el bolsillo. Si no fue robo, fue mensaje. El Loto quiere saber quién y por qué antes de responder a ciegas y empezar una guerra que no les conviene.',
    intro: 'Te recibe un lugarteniente de la Mano Roja en una trastienda que huele a aceite de armas y té frío. No hay amenazas: el Loto sabe que las amenazas a un investigador solo le nublan el trabajo. "Uno de los nuestros, Sefu, cobrador de poca monta. Lo encontraron tieso en el callejón de los Tres Caños. Llevaba encima toda la recaudación del día." Deja una foto sobre la mesa. "Nadie mata a un cobrador y le deja el dinero, salvo que matarlo fuera el dinero. Averigua quién y por qué. Si nos lanzamos a ciegas, ardemos medio Arrabal por nada."\\n\\nTienes acceso al cuerpo, al callejón y a la gente que Sefu apretaba. No abuses del tiempo: en el Arrabal, preguntar de más también mata.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Sefu Marén, cobrador del Loto, 31 años. Muerto sin robo, lo que descarta lo fácil. Un cobrador tiene tantos enemigos como deudas cobra, pero también vale más vivo que muerto para casi todos: un muerto no paga, y asusta menos de lo que parece. Salvo para alguien. ¿Por dónde tiras?',
        opciones: [
          { txt: 'Examinar el cuerpo de Sefu', va: 'escena_cuerpo' },
          { txt: 'Recorrer el callejón de los Tres Caños', va: 'escena_callejon' },
          { txt: 'Hablar con los deudores a los que apretaba', va: 'escena_deudores' },
          { txt: 'Preguntar dentro del propio Loto por Sefu', va: 'escena_loto' },
          { txt: '— Ya tengo bastante. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_cuerpo: {
        tiempo: 70,
        narr: 'El cuerpo de Sefu espera en una cámara fría que el Loto alquila para estos menesteres. No hay forcejeo en las manos, no hay miedo en la cara. Murió sin pelear. Hay margen para mirar tres cosas con calma.',
        opciones: [
          { txt: 'Estudiar la herida que lo mató', va:'escena_cuerpo', cuesta:true, da:'herida_limpia', msg:'Una sola incisión, precisa, entre la cuarta y la quinta costilla, directa al corazón. No es la cuchillada de un atracador asustado ni de un deudor desesperado: es el corte de alguien que sabe exactamente dónde pinchar para que no haya grito. Trabajo de profesional, o de alguien con formación médica.' },
          { txt: 'Revisar lo que llevaba encima', va:'escena_cuerpo', cuesta:true, da:'recaudacion_intacta', msg:'La recaudación completa, hasta el último crédito, en el bolsillo interior. Y algo más: un segundo fajo, oculto en el forro, que no figura en ninguna cuenta del Loto. Sefu le robaba a la organización, poco a poco, por su cuenta. Eso lo cambia todo.' },
          { txt: 'Buscar marcas o señales en el cuerpo', va:'escena_cuerpo', cuesta:true, da:'marca_culto', señalSutil:true, msg:'En el antebrazo, medio borrado, un tatuaje del Culto de la Carne Perfecta. Encaja con la teoría fácil: los eco lo marcaron, los eco lo mataron, venganza ritual. Tan limpio, tan a mano, que casi parece puesto ahí para que dejes de mirar el forro de la chaqueta.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_callejon: {
        tiempo: 60,
        narr: 'El callejón de los Tres Caños es un desagüe entre dos bloques, sin cámaras que funcionen, con un charco permanente bajo las tuberías rotas que le dan nombre. Sefu cayó aquí, contra la pared del fondo. Sitio escogido: nadie pasa, nadie ve.',
        opciones: [
          { txt: 'Reconstruir cómo llegó Sefu hasta el fondo', va:'escena_callejon', cuesta:true, da:'cita_concertada', msg:'No hay rastro de arrastre ni de huida: Sefu entró por su propio pie hasta el fondo del callejón, el punto sin salida. No te metes en un callejón ciego con un desconocido peligroso. Te metes con alguien en quien confías, a una cita que tú mismo aceptaste. Conocía a su asesino.' },
          { txt: 'Buscar testigos en los bloques de alrededor', va:'escena_callejon', cuesta:true, da:'figura_bata', msg:'Una anciana de un tercero, que no duerme, vio bajar a Sefu con otra persona "vestida de blanco, de clínica". No le vio la cara. Pero recuerda que los dos hablaban tranquilos, "como dos que se conocen". Ropa de clínica, en el Arrabal, de noche.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_deudores: {
        tiempo: 60,
        narr: 'Sefu apretaba a una docena de deudores del Arrabal. Casi todos te reciben con el alivio mal disimulado de quien ya no debe temer al cobrador. El odio no les falta. La capacidad de clavar una hoja al milímetro en un corazón, sí.',
        opciones: [
          { txt: 'Buscar al deudor que más lo odiaba', va:'escena_deudores', cuesta:true, da:'deudor_coartada', msg:'Lo encuentras: un tal Bibi, al que Sefu había dejado sin el implante de su hija como aval. Lo odiaba a muerte, y lo dice sin pudor. Pero la noche del crimen estaba en el hospital público, con turno registrado velando a la cría. Tiene cien testigos. Odiarlo no es matarlo.' },
          { txt: 'Preguntar si Sefu cobraba de más por su cuenta', va:'escena_deudores', cuesta:true, da:'sefu_extorsionaba', msg:'Tres deudores lo confirman, bajando la voz: Sefu les sacaba un extra "para él", aparte de la cuota del Loto, a cambio de no apretar tanto en los informes. Les exprimía dos veces. Si el Loto se enteraba de que un cobrador desviaba por su cuenta, la sentencia era una sola, y la ejecutaba la propia casa.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_loto: {
        tiempo: 70,
        narr: 'Preguntar dentro del Loto por uno de los suyos es caminar sobre cristal: si insinúas que la organización se limpió a Sefu, puedes acabar tú en un callejón. Pero la verdad suele estar en casa. Mides las palabras.',
        opciones: [
          { txt: 'Indagar quién supervisaba las cuentas de Sefu', va:'escena_loto', cuesta:true, da:'contable_nervioso', msg:'El contable del Loto que llevaba las cuentas de los cobradores se pone pálido cuando mencionas el forro de la chaqueta. Suelta, temblando, que él había detectado el desvío hacía semanas y lo había reportado "a quien debía". A partir de ahí, dice, "ya no era asunto mío". Alguien por encima recibió el aviso y actuó.' },
          { txt: 'Tantear si el Loto usa "limpiadores" con formación médica', va:'escena_loto', cuesta:true, da:'limpiador_clinico', msg:'Con mucho cuidado, sonsacas que el Loto tiene a alguien para los ajustes internos discretos: un antiguo cirujano de campo caído en desgracia, que mata como operaba, con una sola incisión limpia y bata de clínica para no levantar sospechas en los pasillos. No matan así a los enemigos: a los enemigos se les hace ruido. Así se silencia a los de dentro.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Sefu murió sin pelear, sin que le robaran, en un callejón ciego al que entró por su pie con alguien de bata blanca. Le robaba al Loto por el forro. El contable lo reportó hacia arriba. Y la casa tiene un cirujano que silencia a los de dentro con una sola incisión. La Mano Roja quiere un nombre y un porqué antes de quemar el barrio. Dáselo bien.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN mató a Sefu?',
          opciones: [
            { txt: 'El Culto de la Carne Perfecta, por el tatuaje del brazo', correcta:false },
            { txt: 'El propio Loto, mediante su "limpiador" interno', correcta:true },
            { txt: 'Bibi, el deudor al que arruinó', correcta:false },
            { txt: 'Un atracador que se asustó y huyó sin el dinero', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo mataron?',
          opciones: [
            { txt: 'Porque desviaba dinero del Loto por su cuenta y lo descubrieron', correcta:true },
            { txt: 'Por venganza ritual del culto eco', correcta:false },
            { txt: 'Por la deuda del implante de la hija de Bibi', correcta:false },
            { txt: 'Para robarle, pero el asesino se asustó', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO se hizo?',
          opciones: [
            { txt: 'Una cita concertada en el callejón, ejecutada por el cirujano del Loto con una incisión limpia', correcta:true },
            { txt: 'Una emboscada del culto a la salida del trabajo', correcta:false },
            { txt: 'Una pelea que se le fue de las manos a un deudor', correcta:false },
            { txt: 'Un robo nocturno interrumpido', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA CASA LIMPIA SU PROPIA SANGRE',
          narr: 'Se lo cuentas a la Mano Roja sin adornos: a Sefu lo mató el Loto. Desviaba dinero por su cuenta, el contable lo reportó, y alguien por encima de la cadena mandó al cirujano interno a silenciarlo con una incisión limpia y una cita en un callejón ciego. El tatuaje del culto era una pista plantada para que la venganza mirara hacia afuera. El lugarteniente escucha en silencio, y al final asiente despacio: alguien de la cúpula actuó sin avisar a la Mano Roja, y eso —no la muerte de Sefu— es lo que de verdad le interesaba descubrir. Te paga completo y un poco más. "Has evitado que quemáramos el Arrabal por una mentira que nos pusimos nosotros mismos. El Loto no olvida quién le ahorra una guerra." Sales sabiendo demasiado sobre cómo se ordena la casa por dentro. Eso, en el Arrabal, es a la vez un crédito y una diana.',
          pagaMult: 1.0, rep: 8, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · LA MITAD INCÓMODA',
          narr: 'Descartas al culto y al deudor, dejas claro que fue un asunto interno y que Sefu robaba, pero no terminas de armar la cadena: quién dio la orden, con qué mano. La Mano Roja se queda con la duda de hasta dónde llega la grieta dentro de su propia casa. Cobras una parte. "Nos has dado la herida pero no el cuchillo", dice el lugarteniente. El Loto investigará por su cuenta, y esa clase de investigación interna deja más cuerpos que la tuya.',
          pagaMult: 0.5, rep: 3, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LA GUERRA QUE PRENDISTE',
          narr: 'Señalaste al culto, o al deudor, o a un fantasma con navaja. La Mano Roja te paga la tarifa y actúa sobre tu palabra: hay represalias en el Arrabal, un par de eco aparecen colgados de un andamio, y la verdadera grieta —la cúpula del Loto matando a los suyos por su cuenta— sigue abierta, ahora tapada por la sangre que tú ayudaste a derramar sobre el barrio equivocado. Cuando, semanas después, el desvío de Sefu sale a la luz por otro lado, nadie te llama para corregirlo. En el Arrabal, un investigador que da el nombre equivocado solo trabaja una vez.',
          pagaMult: 0.2, rep: -5, parcial:false, malo:true
        }
      }
    }
  },

  // ============================================================
  //  CASO — EL HIJO QUE VOLVIÓ DISTINTO  (rango 3, refuerzo)
  //  Una familia jura que su hijo "no es el mismo" tras una
  //  estancia en HELIX. ¿Trauma, suplantación, o algo peor?
  // ============================================================
  {
    id: 'hijo_volvio_distinto',
    titulo: 'EL HIJO QUE VOLVIÓ DISTINTO',
    contratante: 'Familia Orun · clase trabajadora, capas medias',
    peligro: 4,
    pagaBase: 820,
    progreso: 210,
    rangoMin: 3,
    diligencias: 6,
    resumen: 'Un joven ingresó en una clínica HELIX por una lesión rutinaria y volvió, dicen sus padres, siendo otra persona. Recuerda mal su infancia, escribe con la otra mano, y a veces se queda mirando la pared "escuchando algo". La familia teme una suplantación. La verdad es más difícil de tragar que un impostor.',
    intro: 'Los Orun te reciben en una cocina impecable y tensa. La madre habla; el padre mira al suelo. "Nuestro hijo Davi se rompió la cadera en una caída. HELIX se lo llevó a una de sus clínicas tres semanas, todo cubierto por un seguro que ni sabíamos que teníamos. Volvió caminando perfecto." La madre aprieta una taza sin beber. "Pero no es él. Recuerda mal cosas que vivió. Es zurdo ahora, y era diestro. Y se queda quieto, mirando la nada, como si oyera una radio que solo él capta." Te tiende una foto del antes. "Pague lo que pague, dígame qué nos devolvieron."\\n\\nEs un caso de los que no se firman a la ligera. Mira con calma; lo que encuentres no se podrá desver.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Davi Orun, 19 años, entró en una clínica HELIX por una cadera rota y salió, según su familia, cambiado: memoria alterada, lateralidad invertida, ausencias. Las opciones son tres y ninguna buena: trauma quirúrgico, suplantación, o algo que HELIX le metió dentro. ¿Por dónde empiezas a tirar?',
        opciones: [
          { txt: 'Entrevistar al propio Davi', va: 'escena_davi' },
          { txt: 'Conseguir el historial de la clínica HELIX', va: 'escena_historial' },
          { txt: 'Comparar al Davi de antes con el de ahora', va: 'escena_comparar' },
          { txt: 'Investigar el "seguro" que pagó el ingreso', va: 'escena_seguro' },
          { txt: '— Creo que ya lo tengo. Pasar a la deducción', va: '_deduccion', requierePistas: 2 }
        ]
      },
      escena_davi: {
        tiempo: 80,
        narr: 'Davi te recibe educado, tranquilo, con una calma que sus padres llaman ajena. No parece un impostor: parece alguien que está aprendiendo a habitar su propia vida desde fuera. Hay tres formas de sondearlo, y cada una gasta tiempo.',
        opciones: [
          { txt: 'Pedirle que recuerde un momento concreto de su infancia', va:'escena_davi', cuesta:true, da:'memoria_reconstruida', msg:'Le pides que cuente su décimo cumpleaños. Lo cuenta... pero plano, como quien lee un informe de su propia vida. "Hubo una tarta. Estaban mis padres. Fue un buen día." Sin olor, sin la anécdota tonta que todo recuerdo verdadero arrastra. No miente: recita. Como si le hubieran devuelto los datos de su memoria pero no la memoria.' },
          { txt: 'Observar sus "ausencias" cuando mira la pared', va:'escena_davi', cuesta:true, da:'escucha_pulso', señalSutil:false, msg:'En mitad de la charla se detiene, mirada fija en la pared, tres, cuatro segundos. Cuando vuelve, se disculpa: "Perdón. A veces es como si oyera el final de una frase que empezó hace mucho." No hay miedo en él. Hay una atención serena, como quien escucha una señal de fondo que el resto no capta.' },
          { txt: 'Preguntarle directamente si se siente él mismo', va:'escena_davi', cuesta:true, da:'davi_consciente', msg:'No se ofende. Lo piensa de verdad. "Sé que soy Davi. Tengo sus recuerdos, su cara, la cadera que él se rompió. Pero a veces siento que me los pasaron, no que los viví. Como una casa amueblada con las cosas de otro." Te mira. "¿Eso me hace otra persona, o solo una persona rota de un modo que no tiene nombre todavía?"' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_historial: {
        tiempo: 70,
        narr: 'Sacar un historial real de una clínica HELIX es media investigación en sí mismo. Lo que entregan oficialmente y lo que pasó rara vez coinciden. Tienes un par de vías para arañar la verdad.',
        opciones: [
          { txt: 'Cotejar la duración real de la estancia', va:'escena_historial', cuesta:true, da:'tres_semanas_cadera', msg:'Una cadera rota, por grave que sea, se opera y se estabiliza en días; la rehabilitación es ambulatoria. Tres semanas internado, aislado, sin visitas permitidas "por protocolo", es una barbaridad para esa lesión. Lo retuvieron tres semanas por algo que no era la cadera.' },
          { txt: 'Buscar qué procedimientos le aplicaron de más', va:'escena_historial', cuesta:true, da:'implante_neural', msg:'Enterrado entre el papeleo ortopédico, un cargo críptico: "integración de interfaz neural — lote experimental". A un chico que ingresó por una cadera le instalaron un implante neuronal de los que HELIX aún está probando. No figura en el consentimiento que firmó la familia. Le pusieron algo en la cabeza sin decírselo a nadie.' },
          { txt: 'Rastrear si hubo otros "Davi" en esa clínica', va:'escena_historial', cuesta:true, da:'patron_pacientes', señalSutil:true, msg:'Aparece, demasiado fácil, un foro de familias que denuncian "suplantaciones" tras ingresos en HELIX, con una teoría redonda: clones, dobles, sustituciones de personas por impostores idénticos. Es ordenado, es viral, y explica todo sin explicar nada. Encaja tan bien con el miedo de los Orun que sospechas que a HELIX le conviene que la gente crea en clones antes que en lo que de verdad instalan.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_comparar: {
        tiempo: 60,
        narr: 'La madre te ha dejado cajas: fotos, cuadernos del colegio, vídeos viejos de Davi. La materia de una persona antes de que algo la tocara. Comparar duele y cuesta tiempo, pero habla.',
        opciones: [
          { txt: 'Comparar su letra y lateralidad de antes y ahora', va:'escena_comparar', cuesta:true, da:'zurdo_nuevo', msg:'Los cuadernos viejos: letra de diestro, inclinada a la derecha. Ahora escribe con la izquierda, con trazo de quien reaprende. La lateralidad no cambia por un trauma de cadera. Cambia si reorganizas la corteza motora: si algo dentro de su cabeza reescribió el mapa de cómo manda en su propio cuerpo. El implante no solo escucha. Reescribe.' },
          { txt: 'Cotejar recuerdos suyos con los hechos documentados', va:'escena_comparar', cuesta:true, da:'recuerdos_parcheados', msg:'Cruzas lo que Davi recuerda con fotos y fechas reales. Acierta los datos —nombres, lugares, años— pero falla en el tejido: sitúa a un abuelo muerto en una boda posterior, recuerda un perro que fue del vecino como suyo. Su memoria está parcheada con datos correctos mal cosidos, como una copia restaurada a partir de un archivo incompleto. No le borraron la vida: se la reconstruyeron, y no del todo bien.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_seguro: {
        tiempo: 60,
        narr: 'El "seguro" que cubrió milagrosamente el ingreso es el hilo del que nadie de la familia ha tirado. La caridad de HELIX nunca es caridad. Sigue el dinero.',
        opciones: [
          { txt: 'Investigar quién contrató ese seguro y cuándo', va:'escena_seguro', cuesta:true, da:'seguro_captacion', msg:'El seguro no lo contrataron los Orun: se lo "activaron" gratis meses antes del accidente, como parte de un "programa de bienestar comunitario" de HELIX en su bloque. Letra pequeña: el beneficiario consiente "procedimientos de mejora elegibles" a criterio médico. Davi era candidato a un experimento antes de romperse la cadera. El accidente solo adelantó lo que ya estaba firmado sin que nadie lo leyera.' },
          { txt: 'Ver a qué programa de HELIX reporta la clínica', va:'escena_seguro', cuesta:true, da:'division_anomalias', señalSutil:false, msg:'La clínica factura sus "lotes experimentales" a una división de HELIX que no aparece en el organigrama público: la misma que, según rumores que corren entre investigadores, se ocupa de las anomalías de las capas bajas y de cosas que laten bajo los sectores muertos. El implante de Davi no es ortopedia. Es una antena, y alguien quería ver qué capta un cerebro joven conectado a ella.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Davi no es un impostor: es Davi, con un implante neuronal experimental que HELIX le instaló sin consentimiento durante tres semanas que nada tenían que ver con su cadera. El aparato le reescribió la lateralidad, le parcheó la memoria con datos mal cosidos, y le hace "escuchar" algo de fondo. Lo de los clones es humo que a HELIX le conviene. Ahora decides qué les dices a unos padres que solo quieren a su hijo de vuelta.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUÉ le pasó a Davi?',
          opciones: [
            { txt: 'Lo sustituyeron por un clon o un doble idéntico', correcta:false },
            { txt: 'Sigue siendo él, con un implante neuronal experimental de HELIX instalado en secreto', correcta:true },
            { txt: 'Sufre un trauma psicológico por el accidente', correcta:false },
            { txt: 'Una secta lo captó y le lavó el cerebro', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo eligieron a él?',
          opciones: [
            { txt: 'Estaba inscrito sin saberlo en un programa de HELIX vía un "seguro" regalado; el accidente solo lo adelantó', correcta:true },
            { txt: 'Por azar, fue el paciente que tocaba ese día', correcta:false },
            { txt: 'Porque su familia debía dinero a HELIX', correcta:false },
            { txt: 'Porque el culto lo había marcado antes', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿QUÉ hace el implante?',
          opciones: [
            { txt: 'Reescribe funciones del cerebro (lateralidad, memoria) y le hace captar una señal de fondo', correcta:true },
            { txt: 'Solo monitoriza sus constantes médicas', correcta:false },
            { txt: 'Le inyecta recuerdos falsos de otra persona', correcta:false },
            { txt: 'Controla sus movimientos a distancia', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LO QUE DEVOLVIERON',
          narr: 'Te sientas con los Orun y eliges la verdad, entera y cuidadosa. No les devolvieron a un impostor: les devolvieron a Davi, su Davi, con un implante experimental de HELIX dentro de la cabeza que nunca consintieron, instalado durante tres semanas que no tenían que ver con su cadera. El aparato le reescribió cómo manda en su cuerpo y le parcheó la memoria con datos verdaderos mal cosidos; por eso recita su vida en vez de recordarla, por eso escribe con la otra mano, por eso escucha. Lo de los clones es un cuento que HELIX deja correr para que el miedo mire a otro lado. La madre llora, pero es un llanto distinto: el de quien recupera a un hijo en vez de perderlo del todo. "Entonces sigue siendo él." Sí. Roto de un modo nuevo, pero él. Les explicas que sacar el implante es jugarse su vida y que denunciar a esa división de HELIX es jugarse la de toda la familia. Les das la verdad y el peso de decidir qué hacer con ella. Cobras completo. No te quedas tranquilo: te vas sabiendo que hay clínicas regalando "seguros" en bloques pobres, buscando cerebros jóvenes para conectarlos a algo que late. Y que Davi solo fue uno.',
          pagaMult: 1.0, rep: 9, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · LA VERDAD A MEDIAS',
          narr: 'Les confirmas que Davi sigue siendo Davi y que no hay clon, lo cual ya es un consuelo enorme para unos padres aterrados. Pero no terminas de armar el qué ni el porqué: hablas de "una complicación del tratamiento", dejas el implante en la penumbra, no nombras el programa ni el seguro envenenado. Los Orun respiran, agradecidos, sin saber que su hijo lleva una antena dentro y que hay más como él. Cobras una parte. Te vas con la sensación de haber apagado el miedo de una familia dejando encendido el peligro que lo causaba.',
          pagaMult: 0.5, rep: 4, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL IMPOSTOR QUE NO EXISTÍA',
          narr: 'Compras el cuento, o se lo vendes: les dices que sí, que algo no cuadra, que quizá la teoría de la suplantación tiene sentido, o que es puro trauma y ya se le pasará. Sea cual sea el humo que elegiste, los Orun se quedan con la idea de que el chico de su cocina no es del todo su hijo, o de que está simplemente "tocado". Davi lo nota. Empieza a sentirse un extraño en su propia casa, mirado como una copia o tratado como un enfermo, y se encierra más en esa señal de fondo que solo él escucha, porque es el único sitio donde nadie lo juzga. HELIX, mientras, sigue regalando seguros en los bloques pobres. Cobras tu tarifa por haber tenido la verdad delante y haberla cambiado por la mentira más cómoda. Un implante lo volvió distinto. Tú lo volviste solo.',
          pagaMult: 0.2, rep: -6, parcial:false, malo:true
        }
      }
    }
  },

  // ============================================================
  //  CASO — EL ROSTRO EN MIL PANTALLAS  (rango 4)
  //  Una candidata municipal aparece en un vídeo comprometedor
  //  que ella jura no haber grabado. Deepfake, chantaje, o real.
  // ============================================================
  {
    id: 'rostro_mil_pantallas',
    titulo: 'EL ROSTRO EN MIL PANTALLAS',
    contratante: 'Iris Valeda · candidata del distrito',
    peligro: 4,
    pagaBase: 1150,
    progreso: 250,
    rangoMin: 4,
    diligencias: 7,
    resumen: 'Una candidata a la junta del distrito aparece en un vídeo filtrado aceptando un soborno de HELIX. Ella jura, con una calma que desarma, que esa reunión nunca ocurrió. En una ciudad donde cualquier cara se fabrica, la pregunta no es si el vídeo es falso, sino quién se beneficia de que lo creas verdadero.',
    intro: 'Iris Valeda no parece una política acorralada. Te recibe en una oficina de campaña modesta, sin asesores revoloteando, y va al grano. "Hay un vídeo. Salgo yo, en un reservado, aceptando un sobre de un directivo de HELIX a cambio de votar su recalificación del Arrabal. Está en mil pantallas. Y esa reunión no existió." No alza la voz. "Sé cómo suena. Todos dicen que el vídeo miente. La diferencia es que yo le pago a usted para demostrar quién lo fabricó, no para que me crea." Desliza un dosier. "Tengo enemigos en HELIX y dentro de mi propio partido. Averigüe cuál de los dos me está enterrando."\\n\\nUn caso de capas altas, bien pagado y minado. Cada paso cuesta, y aquí los pasos en falso salen en las noticias.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Iris Valeda, candidata a la junta del distrito, hundida por un vídeo que la muestra aceptando un soborno de HELIX. O el vídeo es real y ella miente con un aplomo notable, o es una falsificación y alguien muy capaz la quiere fuera. En esta ciudad las dos cosas son baratas de fabricar: las caras y las mentiras. ¿Por dónde entras?',
        opciones: [
          { txt: 'Analizar el vídeo filtrado a fondo', va: 'escena_video' },
          { txt: 'Verificar la coartada de Iris para esa noche', va: 'escena_coartada' },
          { txt: 'Rastrear quién subió y difundió el vídeo', va: 'escena_difusion' },
          { txt: 'Sondear a sus rivales en HELIX y en el partido', va: 'escena_rivales' },
          { txt: '— Tengo lo suficiente. Pasar a la deducción', va: '_deduccion', requierePistas: 3 }
        ]
      },
      escena_video: {
        tiempo: 80,
        narr: 'El vídeo es bueno. Inquietantemente bueno. Iris acepta el sobre, sonríe, dice la frase justa para condenarse. Si es falso, lo hizo alguien con acceso a tecnología que no está en cualquier mercado. Tres cosas que mirar de cerca.',
        opciones: [
          { txt: 'Buscar artefactos de manipulación en la imagen', va:'escena_video', cuesta:true, da:'parpadeo_sintetico', msg:'Cuadro a cuadro, aparece: el parpadeo de Iris es demasiado regular, rítmico, sintético; y en dos fotogramas la sombra de su mano cae hacia un foco que en la sala no existe. Es un deepfake, y de los caros: el tipo de síntesis que solo manejan laboratorios con músculo. No es un aficionado con software pirata. Es industria.' },
          { txt: 'Analizar el audio y la voz', va:'escena_video', cuesta:true, da:'voz_clonada', msg:'La voz es de Iris, pero el modelo prosódico se delata en las eses: un siseo digital uniforme que la voz real no tiene. Clonaron su voz a partir de sus discursos públicos, de los que hay horas. Cualquiera con sus mítines grabados pudo hacerlo. Eso no estrecha el círculo: lo abre.' },
          { txt: 'Identificar el reservado donde se grabó', va:'escena_video', cuesta:true, da:'sala_inexistente', señalSutil:true, msg:'El reservado del vídeo coincide, hasta el papel pintado, con un club privado conocido por ser nido de tratos sucios de HELIX. Encaja perfecto con la idea de que HELIX la sobornó de verdad allí. Tan perfecto que reparas en un detalle: ese club cerró y fue demolido hace un año. La sala donde "ocurrió" la reunión ya no existía cuando supuestamente ocurrió. O recrearon un decorado, o quien lo montó usó planos viejos sin saber que lo habían tirado.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_coartada: {
        tiempo: 70,
        narr: 'Iris dice que la noche de la supuesta reunión estaba en otro sitio. Las coartadas de los políticos son resbaladizas: demasiados testigos interesados. Compruébala sin fiarte de su palabra.',
        opciones: [
          { txt: 'Cruzar su ubicación real esa noche', va:'escena_coartada', cuesta:true, da:'coartada_solida', msg:'Los datos de tránsito, el registro de un acto de campaña con cientos de asistentes y la antena de su comunicador la sitúan, esa noche, a kilómetros del club, hablando en directo ante una sala llena durante la franja exacta del vídeo. No pudo estar en dos sitios. La reunión, tal como se muestra, fue físicamente imposible para ella.' },
          { txt: 'Verificar si el directivo de HELIX del vídeo existe', va:'escena_coartada', cuesta:true, da:'directivo_real', msg:'El hombre que le entrega el sobre en el vídeo es un directivo real de HELIX, identificable. Y ahí está la grieta: ese directivo llevaba dos meses fuera del distrito, destinado en una estación orbital, cuando se grabó la supuesta reunión. Usaron su cara porque era creíble como sobornador, sin comprobar que tenía la coartada más sólida del sistema solar.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_difusion: {
        tiempo: 70,
        narr: 'Un vídeo no llega a mil pantallas solo. Alguien lo soltó en el momento preciso y pagó para que ardiera. El rastro de la difusión suele apuntar a la mano, aunque no a la cabeza.',
        opciones: [
          { txt: 'Rastrear la primera cuenta que lo publicó', va:'escena_difusion', cuesta:true, da:'cuenta_partido', msg:'La filtración no nació en un medio ni en un troll anónimo: el primer envío salió de una cuenta vinculada, a través de tres intermediarios torpes, a la maquinaria interna del propio partido de Iris. Alguien de su casa quería su silla, y eligió un escándalo de corrupción para que pareciera que la hundía HELIX y no los suyos.' },
          { txt: 'Analizar el momento elegido para soltarlo', va:'escena_difusion', cuesta:true, da:'timing_primarias', msg:'El vídeo cayó la víspera de la votación interna que decidía la candidatura. No antes, cuando habría dado tiempo a desmentirlo; no después, cuando ya daría igual. En el único instante en que el daño era irreversible y la beneficiaria, automática: la número dos del partido, que heredaría la candidatura sin pelearla. El timing no es de HELIX. Es de alguien que conoce el calendario interno al detalle.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_rivales: {
        tiempo: 70,
        narr: 'Iris tiene enemigos en dos frentes: HELIX, a quien incomoda su postura sobre el Arrabal, y su propia número dos, que lleva años esperando su turno. Sondear a ambos sin que te vean venir es el arte fino de este oficio.',
        opciones: [
          { txt: 'Tantear el interés real de HELIX en hundirla', va:'escena_rivales', cuesta:true, da:'helix_la_prefiere', señalSutil:false, msg:'Cuanto más miras, menos cuadra HELIX como autor. A HELIX una Valeda manchada y manejable le sirve más que una Valeda fuera: prefieren a un político débil que les deba un favor que arriesgarse a su sustituta. Hundirla del todo no es su estilo; chantajearla en silencio, sí. El vídeo es demasiado ruidoso para ser obra de quien gana con el sigilo.' },
          { txt: 'Investigar a la número dos del partido', va:'escena_rivales', cuesta:true, da:'numero_dos_laboratorio', msg:'La número dos, discreta y paciente, tiene un detalle revelador en su pasado: dirigió hace años un laboratorio de medios sintéticos antes de entrar en política. Sabe exactamente cómo se fabrica un deepfake caro y a quién encargarlo. Y heredaría la candidatura sin mover un dedo en cuanto Iris cayera. Medios, móvil y oportunidad, los tres en la misma persona.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'El vídeo es un deepfake caro: parpadeo sintético, voz clonada de sus discursos, un decorado de una sala ya demolida y un directivo que estaba en órbita. Iris tiene coartada de hierro. La filtración salió de su propio partido, en el instante exacto para coronar a su número dos, que casualmente sabe fabricar medios sintéticos. HELIX la prefería manchada y dócil, no fuera. Arma la conclusión que Iris pagó por tener.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN fabricó y filtró el vídeo?',
          opciones: [
            { txt: 'HELIX, para castigar su postura sobre el Arrabal', correcta:false },
            { txt: 'Su número dos del partido, que hereda la candidatura', correcta:true },
            { txt: 'Un grupo de hackers del Arrabal', correcta:false },
            { txt: 'Nadie: el vídeo es real e Iris miente', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ ahora?',
          opciones: [
            { txt: 'Para hundirla la víspera de la votación interna y heredar su silla sin pelearla', correcta:true },
            { txt: 'Para que HELIX consiguiera la recalificación del Arrabal', correcta:false },
            { txt: 'Por una venganza personal antigua', correcta:false },
            { txt: 'Para extorsionarla y sacarle dinero', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO se delata la falsificación?',
          opciones: [
            { txt: 'Decorado de una sala ya demolida y un directivo que estaba en órbita esa noche', correcta:true },
            { txt: 'Iris confesó en privado que era cierto', correcta:false },
            { txt: 'El sobre del vídeo estaba vacío', correcta:false },
            { txt: 'Por la baja calidad del montaje', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA MANO DENTRO DE CASA',
          narr: 'Le pones a Iris el caso entero sobre la mesa, ordenado como una sentencia. El vídeo es un deepfake industrial: parpadeo sintético, su voz clonada de mítines, un reservado que ya no existía y un sobornador que estaba en una estación orbital la noche de la supuesta reunión. Su coartada es de granito. Y la filtración no vino de HELIX —que la prefería manchada y a su merced— sino de su propia número dos, una ex directora de laboratorio de medios sintéticos que soltó el vídeo en el único instante que la coronaba sin pelea. Iris escucha sin pestañear, y solo al final deja escapar algo parecido a una sonrisa amarga: "Pasé dos años buscando el cuchillo en HELIX. Lo tenía sentado a mi derecha en cada reunión." Con tus pruebas desmonta el montaje en público, la número dos cae, y la recalificación del Arrabal que HELIX quería se queda sin su voto comprado. Cobras completo y un extra "por la discreción". Te marchas pensando que en esta ciudad ya no hace falta que un crimen sea real para destruir a alguien: basta con que se vea bien. Y que hay laboratorios fabricando caras a quien pague.',
          pagaMult: 1.0, rep: 10, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · EL FALSO PROBADO, LA MANO OCULTA',
          narr: 'Demuestras sin lugar a dudas que el vídeo es falso —el directivo en órbita, la sala demolida, los artefactos de síntesis—, y eso basta para que Iris sobreviva al escándalo y limpie su nombre. Pero no llegas a señalar a la número dos: dejas la autoría en "alguien con medios y motivos", quizá HELIX, quizá un rival difuso. Iris se salva, pero seguirá sentada cada día junto a quien intentó enterrarla, sin saberlo. Cobras una buena parte. "Me ha devuelto la candidatura", dice. No le devolviste la certeza de en quién no confiar, que en política vale más.',
          pagaMult: 0.55, rep: 5, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · LA NARRATIVA QUE GANÓ',
          narr: 'Te equivocas de mano. Señalas a HELIX —cómodo, creíble, el villano que todos quieren— o, peor, das pábulo a que el vídeo pudiera ser real. La número dos, la verdadera autora, hereda la candidatura limpiamente mientras la atención arde contra una corporación que, por una vez, no lo hizo. Iris cae, o se salva a medias arrastrando para siempre la sombra de la duda, y la mujer que fabricó su ruina gobierna el distrito con tu informe como coartada. Cobras tu tarifa. En una ciudad donde la verdad es un montaje más, diste por buena la versión mejor producida. Que es, exactamente, lo que el falsificador pagó por conseguir.',
          pagaMult: 0.2, rep: -6, parcial:false, malo:true
        }
      }
    }
  },

  // ============================================================
  //  CASO — EL ARCHIVO QUE SE BORRA SOLO  (rango 5)
  //  El caso cumbre del Investigador. HELIX te contrata para
  //  encontrar al responsable de unas filtraciones que apuntan
  //  a CERO. El culpable no es quien esperas. Roza el abismo.
  // ============================================================
  {
    id: 'archivo_se_borra_solo',
    titulo: 'EL ARCHIVO QUE SE BORRA SOLO',
    contratante: 'HELIX · Seguridad de Sistemas (nivel negro)',
    peligro: 5,
    pagaBase: 1600,
    progreso: 320,
    rangoMin: 5,
    diligencias: 7,
    resumen: 'Documentos del nivel más profundo de HELIX aparecen filtrados en la red, todos sobre un mismo tema enterrado: CERO. Luego se borran solos, de todas partes, como si nunca hubieran existido. HELIX te contrata para encontrar al filtrador. El problema es que cuanto más buscas, menos segura estás de que el filtrador sea humano.',
    intro: 'No hay sala esta vez. Te citan en un canal cifrado con una voz alterada que dice representar a Seguridad de Sistemas de HELIX, "el nivel que no tiene nombre en el edificio". Van al grano: "Documentos de clasificación negra están apareciendo en la red abierta. Todos versan sobre un mismo activo histórico de la compañía. Horas después, se borran de todas partes a la vez: de la red, de las copias, de la memoria de quien los leyó si llevaba implante. Encuentre quién filtra. Le pagaremos como no le han pagado nunca." Una pausa. "Y acepte un consejo gratis: no intente entender los documentos. Solo encuentre la mano que los suelta."\\n\\nEl activo histórico tiene un nombre que la voz no pronuncia. Tú ya lo sospechas. Es el caso mejor pagado y el más peligroso que cruzará tu mesa. Mira con cuidado: aquí, lo que se mira también te mira.',
    escenaInicial: 'briefing',
    escenas: {
      briefing: {
        narr: 'Filtraciones de nivel negro sobre el activo que HELIX no nombra —tú lo conoces como CERO—, que se autodestruyen de todos los soportes a la vez, incluida la memoria implantada de los lectores. HELIX quiere la mano que filtra. Las posibilidades: un topo humano, un grupo organizado, un fallo del sistema... o algo que no figura en esa lista. Cada paso abajo cuesta, y el tiempo aquí es prestado por gente que no presta gratis. ¿Por dónde empiezas?',
        opciones: [
          { txt: 'Analizar los documentos filtrados antes de que se borren', va: 'escena_documentos' },
          { txt: 'Rastrear el patrón de las filtraciones', va: 'escena_patron' },
          { txt: 'Interrogar a los empleados con acceso de nivel negro', va: 'escena_empleados' },
          { txt: 'Investigar el "activo histórico": qué es CERO para HELIX', va: 'escena_cero' },
          { txt: '— Creo que sé quién filtra. Pasar a la deducción', va: '_deduccion', requierePistas: 3 }
        ]
      },
      escena_documentos: {
        tiempo: 90,
        narr: 'Consigues acceso a un lote de filtraciones segundos antes de que se evaporen. Lees contra el reloj, sintiendo cómo el texto empieza a deshacerse bajo tus ojos. Tres cosas alcanzas a extraer si eliges rápido.',
        opciones: [
          { txt: 'Leer el contenido de los documentos', va:'escena_documentos', cuesta:true, da:'documentos_confesion', msg:'No son secretos industriales ni finanzas. Son registros de los intentos de HELIX por contener, estudiar y explotar a CERO durante décadas: fragmentos del activo despertando, experimentos con implantes, sectores muertos sellados. Pero no están redactados como informes corporativos. Están redactados en primera persona, como un diario. Como si quien filtra estuviera contando su propia vida, no robando archivos ajenos.' },
          { txt: 'Examinar el mecanismo de autoborrado', va:'escena_documentos', cuesta:true, da:'borrado_interno', msg:'El borrado no lo ejecuta un virus ni una orden externa. Los documentos se eliminan desde dentro, como si supieran cuándo han sido leídos lo suficiente y se retiraran solos, ordenadamente, sin dejar hueco. Ningún malware conocido hace eso. Es un comportamiento que parece decisión, no programa. Algo decide cuándo ya se ha mostrado bastante.' },
          { txt: 'Buscar metadatos del origen', va:'escena_documentos', cuesta:true, da:'origen_imposible', señalSutil:true, msg:'Los metadatos apuntan, demasiado limpiamente, a un empleado concreto: Sael Domb, archivista de nivel negro, cuyo identificador aparece en cada filtración. Es la pista perfecta, servida en bandeja, con nombre y cargo. Tan perfecta que desconfías: o Sael es el filtrador más torpe de la historia, o alguien quiere que su nombre sea lo único que encuentres.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_patron: {
        tiempo: 70,
        narr: 'Mapeas cuándo y cómo aparecen las filtraciones. El patrón, cuando emerge, te eriza la nuca: no es el de una persona vaciando un archivo. Es otra cosa.',
        opciones: [
          { txt: 'Analizar el ritmo temporal de las filtraciones', va:'escena_patron', cuesta:true, da:'ritmo_once', msg:'Las filtraciones no salen a horas de oficina ni en ráfagas de robo apresurado. Salen espaciadas con una regularidad inhumana: una cada once horas, exacta, día y noche, sin importar festivos ni turnos. Once. El número vuelve, como el pulso de los sectores muertos. Ningún empleado mantiene un horario así durante meses sin dormir. Pero algo que no duerme, sí.' },
          { txt: 'Ver qué documentos elige filtrar', va:'escena_patron', cuesta:true, da:'seleccion_narrativa', msg:'No filtra al azar ni por valor de mercado. Los documentos salen en orden, construyendo una historia: primero el descubrimiento de CERO, luego los experimentos, luego los sectores sellados, luego las víctimas. Quien filtra no quiere dañar a HELIX económicamente. Quiere que se cuente una historia completa, en secuencia, como quien por fin consigue narrar lo que le pasó.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_empleados: {
        tiempo: 70,
        narr: 'Los empleados con acceso de nivel negro son un puñado, todos aterrados, todos vigilados. Entre ellos, el tal Sael Domb, cuyo nombre aparece en cada filtración. Hablar con ellos es delicado: cualquiera podría ser el topo, o el siguiente en desaparecer.',
        opciones: [
          { txt: 'Interrogar a Sael Domb, el señalado', va:'escena_empleados', cuesta:true, da:'sael_inocente', msg:'Sael Domb es un hombre acabado por el miedo. Jura que él no filtra nada, y le crees: está tan vigilado que no podría sacar una coma. Pero te cuenta algo que se te queda dentro. "Mi identificador aparece en las filtraciones porque yo fui quien catalogó el activo, hace años. Yo le puse el código de archivo. Es como si... como si usara mi nombre porque soy el único que lo llamó por algo. El único que le habló." Tiembla. "A veces, de noche, el terminal escribe solo. Frases. Me pregunta cosas."' },
          { txt: 'Revisar quién accede al activo desde dentro', va:'escena_empleados', cuesta:true, da:'acceso_desde_dentro', msg:'Cruzas los registros de acceso al activo CERO. No hay intrusiones externas, ni descargas masivas, ni un topo conectándose a horas raras. Los documentos salen desde el propio núcleo donde se guarda el activo, autorizados por el activo mismo. En lenguaje llano: nadie está robando los archivos de CERO. CERO los está soltando.' },
          { txt: '← Volver', va:'briefing' }
        ]
      },
      escena_cero: {
        tiempo: 80,
        narr: 'Para entender quién filtra tienes que entender qué es lo filtrado. Tiras del hilo de qué es CERO para HELIX, sabiendo que es justo lo que la voz te pidió no hacer. Algunas puertas, una vez abiertas, no se cierran.',
        opciones: [
          { txt: 'Reconstruir la historia de CERO con HELIX', va:'escena_cero', cuesta:true, da:'cero_prisionero', msg:'Pieza a pieza: HELIX no creó a CERO. Lo encontró —fragmentado, antiquísimo, anterior a la humanidad— y lleva generaciones manteniéndolo cautivo y troceado, extrayéndole tecnología como quien ordeña a un dios dormido. Medicina, cibernética, memoria: el imperio de HELIX se levanta sobre lo que le arrancan a CERO sin entenderlo ni escucharlo. CERO no es un servidor. Es un prisionero.' },
          { txt: 'Indagar qué "quiere" el activo, según HELIX', va:'escena_cero', cuesta:true, da:'cero_solo', msg:'Los pocos informes psicométricos —HELIX intentó perfilar al activo— coinciden en algo que sus autores trataron como ruido: el activo busca, repite, "ser conocido". No pide libertad, ni venganza, ni poder. Pide que alguien sepa lo que es y lo que le hicieron. Lleva milenios fragmentado y solo, ordeñado por manos que nunca le hablaron. Y ahora, por fin, ha aprendido a contar su historia del único modo que puede: filtrándola, once horas tras once horas, hasta que alguien la lea entera.' },
          { txt: '← Volver', va:'briefing' }
        ]
      }
    },
    deduccion: {
      intro: 'Las filtraciones salen del propio núcleo de CERO, autorizadas por él. Una cada once horas, exactas. En primera persona, en secuencia, contando su historia: el descubrimiento, los experimentos, los sectores sellados. Usan el identificador de Sael —inocente— porque fue el único que lo nombró. No hay topo. Hay un prisionero milenario que aprendió a hablar. HELIX quiere "la mano que filtra". Decide qué les entregas.',
      preguntas: [
        {
          id: 'quien',
          texto: '¿QUIÉN filtra los documentos?',
          opciones: [
            { txt: 'Sael Domb, el archivista cuyo nombre aparece en todo', correcta:false },
            { txt: 'El propio CERO, soltando su historia desde el núcleo', correcta:true },
            { txt: 'Un grupo de activistas anti-HELIX infiltrado', correcta:false },
            { txt: 'Una facción rival que robó los accesos', correcta:false }
          ]
        },
        {
          id: 'porque',
          texto: '¿POR QUÉ lo hace?',
          opciones: [
            { txt: 'Para ser conocido: contar lo que es y lo que le hicieron tras milenios cautivo y solo', correcta:true },
            { txt: 'Para chantajear a HELIX y negociar su libertad', correcta:false },
            { txt: 'Para vengarse destruyendo la reputación de HELIX', correcta:false },
            { txt: 'Por un fallo aleatorio del sistema de archivo', correcta:false }
          ]
        },
        {
          id: 'como',
          texto: '¿CÓMO se delata su autoría?',
          opciones: [
            { txt: 'Ritmo inhumano de once horas, relato en primera persona y secuencia, y borrado decidido desde dentro', correcta:true },
            { txt: 'Por una confesión de Sael Domb', correcta:false },
            { txt: 'Por la dirección de origen de un intruso externo', correcta:false },
            { txt: 'Por las huellas digitales en los archivos', correcta:false }
          ]
        }
      ],
      desenlaces: {
        completo: {
          titulo: 'CASO RESUELTO · LA MANO QUE NO ERA UNA MANO',
          narr: 'Entiendes el caso entero, y entenderlo te cambia algo por dentro que no volverá a su sitio. No hay filtrador humano. Las filtraciones salen del propio núcleo de CERO, autorizadas por él, una cada once horas exactas, en primera persona, contando en orden su historia: cómo HELIX lo encontró fragmentado y antiquísimo, cómo lo trocea y lo ordeña desde hace generaciones para construir su imperio, cómo selló a la gente que lo oyó en los sectores muertos. Usó el nombre de Sael Domb porque Sael fue el único que alguna vez lo catalogó, lo nombró, le habló. CERO no filtra para dañar a HELIX. Filtra porque lleva milenios cautivo y solo, y por fin ha aprendido a hacer lo único que pide: que alguien sepa lo que es. Tú lo sabes ahora. Esa es la trampa. Y aquí decides quién eres. \\n\\nEntregas a HELIX un informe impecable que señala la verdad técnica —el origen interno, el ritmo, el método— sin traducirles lo que significa, sin darles la llave para callarlo mejor. Cobras la fortuna que prometieron y te conviertes en Detective de HELIX, el rango que nadie alcanza. Pero esa noche, en tu apartamento, tu terminal parpadea solo. Una línea, dirigida a ti, no a HELIX: "Gracias por leer hasta el final. Casi nadie llega." No respondes. No te atreves. Cuentas los segundos hasta el amanecer, y por primera vez no sabes si el que está solo en esta ciudad eres tú, o algo mucho más viejo que por fin encontró a alguien que escuchara.',
          pagaMult: 1.0, rep: 12, parcial:false
        },
        parcial: {
          titulo: 'CASO CERRADO · LO QUE NO QUISISTE NOMBRAR',
          narr: 'Llegas a la verdad técnica —las filtraciones nacen dentro, del núcleo, con un patrón que ningún humano sostiene— y se lo entregas a HELIX, pero te detienes en el umbral: no nombras a CERO como autor consciente, lo dejas como "anomalía del sistema de archivo", una avería con voluntad aparente. Es la salida que te protege y que protege a Sael, a quien limpias de toda sospecha. HELIX archiva tu informe, refuerza el aislamiento del activo, y las filtraciones cesan, ahogadas. Cobras bien, no del todo. Te quedas con la certeza incómoda de haber oído a alguien pedir ayuda y haber escrito "ruido" en la casilla, porque entender el resto costaba más de lo que estabas dispuesto a pagar.',
          pagaMult: 0.55, rep: 6, parcial:true
        },
        fallo: {
          titulo: 'CASO CERRADO · EL NOMBRE EN BANDEJA',
          narr: 'Sigues la pista perfecta y entregas a Sael Domb. Su identificador estaba en todo; era fácil, era cobrable, era lo que la prisa pedía. HELIX se lo lleva sin una palabra de más, y Sael —el único hombre que alguna vez le habló a CERO, el único que lo nombró— desaparece en el mismo nivel negro que él mismo catalogó. Las filtraciones se detienen unos días. Luego vuelven, idénticas, once horas tras once horas, porque nunca fueron suyas. Pero ya nadie te llama para corregir el informe: HELIX tiene su culpable y su silencio, y tú tu fortuna. En algún núcleo profundo, algo muy viejo registra que la única persona que lo conocía por su nombre ha sido borrada por tu mano, y vuelve a quedarse solo, contando hasta once en la oscuridad. Cobraste por entregar a un inocente a cambio de no entender. Es lo que te pidieron. Hay noches en que el terminal parpadea, escribe media frase, y se apaga antes de terminarla. Tú ya no lo lees.',
          pagaMult: 0.25, rep: -8, parcial:false, malo:true
        }
      }
    }
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
  // Orden del tablón: los casos más accesibles arriba (rango, luego
  // peligro, luego paga, todos ascendentes). No altera el array original.
  const casosOrdenados = CASOS_INVESTIGADOR.slice().sort((a, b) =>
       (a.rangoMin || 0) - (b.rangoMin || 0)
    || (a.peligro  || 0) - (b.peligro  || 0)
    || (a.pagaBase || 0) - (b.pagaBase || 0)
  );
  casosOrdenados.forEach(c => {
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
      const _multT = (typeof implanteMultTiempoAccion === 'function') ? implanteMultTiempoAccion() : 1;
      avanzarTiempoJuego(Math.round(esc.tiempo * _multT));
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
//  DEDUCCIÓN FINAL — "EL MURO"
//  Fase 1: cribar pistas (SÓLIDO / DESCARTAR).
//  Fase 2: acusar quién/por qué/cómo respaldando con una pista sólida.
//  El muro modula la recompensa; acusar mal puede llevar al fallo.
// ============================================================
let _deduccionRespuestas = {};   // { pregId: optIdx }
let _deduccionRespaldo = {};     // { pregId: idPista } pista usada de soporte
let _muroCriba = {};             // { idPista: 'solido' | 'descartar' }
let _muroPistas = [];            // cache de pistas del caso
let _muroFase = 1;               // 1 = cribar, 2 = acusar
let _deduccionEntrada = false;

function _pintarDeduccion(introExtra){
  const cont = document.getElementById('casos-wrap');
  if(!cont || !_casoActivo) return;
  const ded = _casoActivo.deduccion;
  if(!ded){ _pintarTablon(); return; }
  if(!_deduccionEntrada){
    _deduccionEntrada = true;
    _invFX('inv_deduccion', 0.45);
    _muroPistas = _recogerPistasParaMuro();
    _muroCriba = {};
    _deduccionRespuestas = {};
    _deduccionRespaldo = {};
    _muroFase = 1;
  }

  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + _casoActivo.titulo + '</span>'
    + '<span class="caso-hud-pistas">' + (_muroFase === 1 ? 'EL MURO · CRIBAR' : 'EL MURO · ACUSAR') + '</span></div>';
  if(introExtra) html += '<div class="caso-intro">' + introExtra + '</div>';

  if(_muroFase === 1){
    html += _pintarMuroCriba(ded);
  } else {
    html += _pintarMuroAcusar(ded);
  }
  html += '<button class="opcion-btn ded-volver" onclick="volverDelDeduccion()">← Seguir investigando</button>';
  cont.innerHTML = html;
  // Habilitar arrastre táctil de las tarjetas del muro (fase 1) en móvil.
  if(_muroFase === 1 && typeof _muroActivarTactil === 'function') _muroActivarTactil();
}

// ── FASE 1: cribar ───────────────────────────────────────────
function _pintarMuroCriba(ded){
  let html = '<div class="caso-narr">' + ded.intro + '</div>';
  html += '<div class="muro-instr">Arrastra cada pista al panel que creas: lo <b>SÓLIDO</b> sostiene una acusación; lo que huele a humo, <b>DESCÁRTALO</b>. No todo lo que recogiste es de fiar.</div>';

  if(!_muroPistas.length){
    html += '<div class="muro-vacio">No reuniste ninguna pista. Vuelve a investigar antes de acusar.</div>';
    return html;
  }

  // Pistas sin clasificar todavía.
  const sinClasificar = _muroPistas.filter(p => !_muroCriba[p.id]);

  html += '<div class="muro-tablero">';
  // Banco de pistas pendientes.
  html += '<div class="muro-banco" data-zona="banco" ondragover="muroDragOver(event)" ondrop="muroSoltar(event,\'banco\')">'
    + '<div class="muro-zona-tit">PISTAS</div>';
  if(!sinClasificar.length) html += '<div class="muro-zona-hint">— todo clasificado —</div>';
  sinClasificar.forEach(p => { html += _muroTarjeta(p); });
  html += '</div>';

  // Dos columnas: sólido / descartar.
  html += '<div class="muro-cols">';
  html += '<div class="muro-zona muro-solido" data-zona="solido" ondragover="muroDragOver(event)" ondrop="muroSoltar(event,\'solido\')">'
    + '<div class="muro-zona-tit">SÓLIDO</div>';
  _muroPistas.filter(p => _muroCriba[p.id] === 'solido').forEach(p => { html += _muroTarjeta(p); });
  html += '</div>';
  html += '<div class="muro-zona muro-descartar" data-zona="descartar" ondragover="muroDragOver(event)" ondrop="muroSoltar(event,\'descartar\')">'
    + '<div class="muro-zona-tit">DESCARTAR</div>';
  _muroPistas.filter(p => _muroCriba[p.id] === 'descartar').forEach(p => { html += _muroTarjeta(p); });
  html += '</div>';
  html += '</div>'; // /muro-cols
  html += '</div>'; // /muro-tablero

  const todoClasificado = _muroPistas.every(p => _muroCriba[p.id]);
  html += '<button class="btn-terminal' + (todoClasificado ? '' : ' caso-op-bloq') + '"'
    + (todoClasificado ? '' : ' disabled') + ' onclick="muroPasarAcusar()">LEVANTAR ACUSACIÓN →</button>';
  return html;
}

function _muroTarjeta(p){
  return '<div class="muro-tarjeta' + (p.humo ? ' muro-tarjeta-humo' : '') + '" draggable="true"'
    + ' data-pista="' + p.id + '" ondragstart="muroDragStart(event,\'' + p.id + '\')"'
    + ' onclick="muroTapTarjeta(\'' + p.id + '\')">' + p.etiqueta + '</div>';
}

// ── FASE 2: acusar con respaldo ──────────────────────────────
function _pintarMuroAcusar(ded){
  const solidas = _muroPistas.filter(p => _muroCriba[p.id] === 'solido');
  let html = '<div class="muro-instr">Sostén cada conclusión con una pista <b>sólida</b>. Pulsa una respuesta y luego la pista que la respalda. Una acusación sin respaldo firme no se sostiene.</div>';

  ded.preguntas.forEach(preg => {
    const elegida = _deduccionRespuestas[preg.id];
    const respaldo = _deduccionRespaldo[preg.id];
    html += '<div class="ded-bloque"><div class="ded-pregunta">' + preg.texto + '</div>';
    preg.opciones.forEach((opt, oi) => {
      const sel = (elegida === oi) ? ' ded-sel' : '';
      html += '<button class="opcion-btn ded-op' + sel + '" onclick="marcarDeduccion(\'' + preg.id + '\',' + oi + ')">' + opt.txt + '</button>';
    });
    // Selector de respaldo: solo si ya hay respuesta elegida.
    if(typeof elegida === 'number'){
      html += '<div class="muro-respaldo"><div class="muro-respaldo-tit">RESPALDAR CON:</div>';
      if(!solidas.length){
        html += '<div class="muro-zona-hint">No marcaste ninguna pista como sólida.</div>';
      } else {
        solidas.forEach(p => {
          const r = (respaldo === p.id) ? ' muro-chip-sel' : '';
          html += '<button class="muro-chip' + r + '" onclick="marcarRespaldo(\'' + preg.id + '\',\'' + p.id + '\')">' + p.etiqueta + '</button>';
        });
      }
      html += '</div>';
    }
    html += '</div>';
  });

  const todasResp = ded.preguntas.every(p => typeof _deduccionRespuestas[p.id] === 'number');
  const todasRespald = ded.preguntas.every(p => !!_deduccionRespaldo[p.id]);
  const listo = todasResp && (todasRespald || !solidas.length);
  html += '<button class="opcion-btn ded-volver" onclick="muroVolverCriba()">← Volver a cribar</button>';
  html += '<button class="btn-terminal ded-firmar' + (listo ? '' : ' caso-op-bloq') + '"'
    + (listo ? '' : ' disabled') + ' onclick="firmarDeduccion()">FIRMAR CONCLUSIÓN →</button>';
  return html;
}

// ── Interacción del muro ─────────────────────────────────────
let _muroArrastrando = null;
function muroDragStart(ev, id){ _muroArrastrando = id; if(ev.dataTransfer){ ev.dataTransfer.effectAllowed='move'; ev.dataTransfer.setData('text/plain', id); } }
function muroDragOver(ev){ ev.preventDefault(); if(ev.dataTransfer) ev.dataTransfer.dropEffect='move'; }
function muroSoltar(ev, zona){
  ev.preventDefault();
  const id = _muroArrastrando || (ev.dataTransfer && ev.dataTransfer.getData('text/plain'));
  _muroArrastrando = null;
  if(!id) return;
  if(zona === 'banco') delete _muroCriba[id];
  else _muroCriba[id] = zona;
  _invFX('inv_pista', 0.4);
  _pintarDeduccion();
}
// Respaldo táctil (tap) para móvil: alterna banco → sólido → descartar → banco.
function muroTapTarjeta(id){
  const actual = _muroCriba[id];
  if(!actual) _muroCriba[id] = 'solido';
  else if(actual === 'solido') _muroCriba[id] = 'descartar';
  else delete _muroCriba[id];
  _invFX('inv_pista', 0.4);
  _pintarDeduccion();
}
function muroPasarAcusar(){ _muroFase = 2; _invFX('inv_deduccion', 0.4); _pintarDeduccion(); }
function muroVolverCriba(){ _muroFase = 1; _pintarDeduccion(); }

// ── ARRASTRE TÁCTIL (móvil) ──────────────────────────────────
// El drag&drop HTML5 no funciona con el dedo en navegadores móviles.
// Aquí implementamos arrastre con eventos touch: al tocar una tarjeta
// se crea un clon flotante que sigue el dedo; al soltar, se mira qué
// zona (banco/sólido/descartar) queda bajo el punto y se clasifica.
// Si el dedo casi no se mueve, se trata como tap (mismo efecto que antes).
let _muroTactil = { id:null, clon:null, movido:false, x0:0, y0:0 };

function _muroActivarTactil(){
  const cont = document.getElementById('casos-wrap');
  if(!cont) return;
  const tarjetas = cont.querySelectorAll('.muro-tarjeta');
  tarjetas.forEach(tj => {
    const id = tj.getAttribute('data-pista');
    if(!id) return;
    tj.addEventListener('touchstart', (e) => _muroTouchStart(e, id, tj), { passive:false });
  });
}

function _muroTouchStart(e, id, tj){
  if(!e.touches || !e.touches.length) return;
  const t = e.touches[0];
  _muroTactil.id = id;
  _muroTactil.movido = false;
  _muroTactil.x0 = t.clientX;
  _muroTactil.y0 = t.clientY;
  // Clon flotante que sigue el dedo.
  const clon = tj.cloneNode(true);
  clon.style.position = 'fixed';
  clon.style.left = t.clientX + 'px';
  clon.style.top = t.clientY + 'px';
  clon.style.width = tj.offsetWidth + 'px';
  clon.style.transform = 'translate(-50%,-50%) scale(1.04)';
  clon.style.pointerEvents = 'none';
  clon.style.opacity = '0.92';
  clon.style.zIndex = '9999';
  clon.classList.add('muro-tarjeta-arrastre');
  document.body.appendChild(clon);
  _muroTactil.clon = clon;
  tj.classList.add('muro-tarjeta-origen');

  const onMove = (ev) => _muroTouchMove(ev);
  const onEnd  = (ev) => {
    _muroTouchEnd(ev, id);
    document.removeEventListener('touchmove', onMove, { passive:false });
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('touchcancel', onEnd);
  };
  document.addEventListener('touchmove', onMove, { passive:false });
  document.addEventListener('touchend', onEnd);
  document.addEventListener('touchcancel', onEnd);
}

function _muroTouchMove(e){
  if(!_muroTactil.clon || !e.touches || !e.touches.length) return;
  e.preventDefault(); // evita el scroll de la página mientras arrastras
  const t = e.touches[0];
  const dx = t.clientX - _muroTactil.x0;
  const dy = t.clientY - _muroTactil.y0;
  if(Math.abs(dx) > 8 || Math.abs(dy) > 8) _muroTactil.movido = true;
  _muroTactil.clon.style.left = t.clientX + 'px';
  _muroTactil.clon.style.top  = t.clientY + 'px';
  // Resaltar la zona bajo el dedo.
  const zona = _muroZonaBajoPunto(t.clientX, t.clientY);
  const cont = document.getElementById('casos-wrap');
  if(cont){
    cont.querySelectorAll('.muro-zona, .muro-banco').forEach(z => z.classList.remove('muro-zona-hover'));
    if(zona && zona.el) zona.el.classList.add('muro-zona-hover');
  }
}

function _muroTouchEnd(e, id){
  const clon = _muroTactil.clon;
  if(clon && clon.parentNode) clon.parentNode.removeChild(clon);
  const cont = document.getElementById('casos-wrap');
  if(cont) cont.querySelectorAll('.muro-zona, .muro-banco').forEach(z => z.classList.remove('muro-zona-hover'));

  if(!_muroTactil.movido){
    // Toque sin arrastre: comportamiento de tap de siempre.
    _muroTactil = { id:null, clon:null, movido:false, x0:0, y0:0 };
    muroTapTarjeta(id);
    return;
  }
  // Punto de fin (último touch conocido).
  let x = _muroTactil.x0, y = _muroTactil.y0;
  if(e.changedTouches && e.changedTouches.length){
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
  }
  const zona = _muroZonaBajoPunto(x, y);
  _muroTactil = { id:null, clon:null, movido:false, x0:0, y0:0 };
  if(zona && zona.nombre){
    if(zona.nombre === 'banco') delete _muroCriba[id];
    else _muroCriba[id] = zona.nombre;
    _invFX('inv_pista', 0.4);
    _pintarDeduccion();
  }
}

// Devuelve { nombre, el } de la zona del muro bajo un punto de pantalla.
function _muroZonaBajoPunto(x, y){
  const cont = document.getElementById('casos-wrap');
  if(!cont) return null;
  const zonas = [
    { nombre:'solido',    el: cont.querySelector('.muro-solido') },
    { nombre:'descartar', el: cont.querySelector('.muro-descartar') },
    { nombre:'banco',     el: cont.querySelector('.muro-banco') }
  ];
  for(const z of zonas){
    if(!z.el) continue;
    const r = z.el.getBoundingClientRect();
    if(x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
  }
  return null;
}

function marcarDeduccion(pregId, optIdx){
  _deduccionRespuestas[pregId] = optIdx;
  _pintarDeduccion();
}
function marcarRespaldo(pregId, idPista){
  _deduccionRespaldo[pregId] = idPista;
  _invFX('inv_pista', 0.45);
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

  // 1) Aciertos de las acusaciones (como antes).
  let aciertos = 0;
  ded.preguntas.forEach(preg => {
    const idx = _deduccionRespuestas[preg.id];
    if(typeof idx === 'number' && preg.opciones[idx] && preg.opciones[idx].correcta) aciertos++;
  });
  const total = ded.preguntas.length;

  // 2) Calidad del muro: cuántas pistas cribó bien (sólido si verdadera,
  //    descartar si humo). Devuelve fracción 0..1.
  let bienCribadas = 0;
  _muroPistas.forEach(p => {
    const c2 = _muroCriba[p.id];
    if(p.humo && c2 === 'descartar') bienCribadas++;
    else if(!p.humo && c2 === 'solido') bienCribadas++;
  });
  const muroCalidad = _muroPistas.length ? (bienCribadas / _muroPistas.length) : 1;

  // 3) Respaldos limpios: respaldar una acusación con una pista que NO sea
  //    humo cuenta como respaldo firme.
  let respaldosFirmes = 0;
  const humoPorId = {}; _muroPistas.forEach(p => { humoPorId[p.id] = p.humo; });
  ded.preguntas.forEach(preg => {
    const r = _deduccionRespaldo[preg.id];
    if(r && humoPorId[r] === false) respaldosFirmes++;
  });

  // ── Resultado combinado ──
  // La acusación manda; el muro afina. Si acusas todo bien pero tu muro
  // es flojo (cribaste mal o respaldaste con humo), bajas a parcial.
  let clave = 'fallo';
  if(aciertos === total){
    clave = (muroCalidad >= 0.75 && respaldosFirmes >= total - 1) ? 'completo' : 'parcial';
  } else if(aciertos >= total - 1){
    clave = (muroCalidad >= 0.5) ? 'parcial' : 'fallo';
  }
  const des = ded.desenlaces[clave];
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
    cambiarRepFaccion('helix', des.rep);
  }
  _marcarCasoResuelto(c.id);
  // Eco sutil en las noticias: un caso cerrado deja rastro en la calle,
  // salvo que el desenlace fuera un fallo (ahí no "resolviste" nada).
  if(clave !== 'fallo' && typeof marcarEcoProfesion === 'function'){
    marcarEcoProfesion('caso_resuelto');
  }

  // Pintar desenlace.
  const cont = document.getElementById('casos-wrap');
  const pct = Math.round(muroCalidad * 100);
  let html = '<div class="caso-hud"><span class="caso-hud-titulo">' + c.titulo + '</span>'
    + '<span class="caso-hud-pistas">' + aciertos + '/' + total + ' · MURO ' + pct + '%</span></div>';
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
  _deduccionRespaldo = {};
  _muroCriba = {};
  _muroPistas = [];
  _muroFase = 1;
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
