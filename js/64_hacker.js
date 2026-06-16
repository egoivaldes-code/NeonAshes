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
  },

  // ───────────────────────────────────────────────────────────
  //  RANGO 3 — ANALISTA DE SISTEMAS
  // ───────────────────────────────────────────────────────────

  // C7 — desaparición: analizar logs de accesos para hallar al infiltrado
  {
    id: 'hack_desaparecida',
    titulo: 'LA QUE DEJÓ DE CONECTARSE',
    cliente: 'Hermano de la desaparecida — "Dello"',
    faccion: null,
    peligro: 3,
    pagaBase: 280,
    progreso: 180,
    rangoMin: 2,
    resumen: 'Una mujer del Sector 4 dejó de aparecer hace nueve días. Su terminal sigue activo, pero algo accede a él de madrugada. Su hermano quiere saber quién entra en la cuenta de alguien que ya no está.',
    contacto: [
      { quien:'cliente', txt:'Mi hermana no se va sin avisar. Nueve días. Pero su cuenta sigue viva, como si nada.' },
      { quien:'tu', txt:'Viva no quiere decir que sea ella quien la usa.' },
      { quien:'cliente', txt:'Eso me temo. Saqué el registro de accesos. Hay logins suyos... y otros que no cuadran. No sé leerlo. Tú sí.' },
      { quien:'tu', txt:'Los patrones no mienten aunque la gente sí. Veamos quién entra de noche.' },
      { quien:'sys', txt:'> REGISTRO DE ACCESOS — CUENTA #SC4-2290\n> CARGANDO ÚLTIMAS SESIONES...' }
    ],
    intrusion: {
      tipo: 'logs',
      desc: 'Lee el registro. Todos los accesos parecen rutina salvo uno: el de un intruso que se hace pasar por ella. Marca la línea anómala.',
      pista: 'Ella siempre entra desde el mismo nodo, de día, y cierra sesión. Busca lo que rompe su costumbre.',
      lineas: [
        { txt:'08:02  LOGIN  nodo SC4-local   OK   cierre 08:40', anomala:false },
        { txt:'08:05  LOGIN  nodo SC4-local   OK   cierre 09:10', anomala:false },
        { txt:'07:58  LOGIN  nodo SC4-local   OK   cierre 08:31', anomala:false },
        { txt:'03:14  LOGIN  nodo EXT-9933    OK   sin cierre',   anomala:true  },
        { txt:'08:11  LOGIN  nodo SC4-local   OK   cierre 08:55', anomala:false },
        { txt:'07:49  LOGIN  nodo SC4-local   OK   cierre 08:20', anomala:false }
      ]
    },
    exito: { narr: 'Lo ves enseguida: un acceso a las 03:14, desde un nodo externo, sin cerrar nunca sesión. Alguien entra en la cuenta de tu hermana desde fuera, de madrugada, y se queda dentro. No es ella. Le das a Dello el nodo de origen. Lo que haga con eso —buscarla, vengarla— ya no es asunto tuyo. Su cara al leerlo sí se te queda.' },
    fallo: { narr: 'Te pierdes entre las horas y señalas un acceso normal. Dello mira la línea que marcaste, frunce el ceño: "Eso es de por la mañana, ella siempre entra así." Tiene razón. Le devuelves un registro sin respuesta y a un hermano sin hermana.' }
  },

  // C8 — recuperar pruebas: reconstruir un archivo corrupto a propósito
  {
    id: 'hack_pruebas',
    titulo: 'EL INFORME ROTO',
    cliente: 'Periodista de los bajos — "Quel"',
    faccion: 'loto',
    peligro: 3,
    pagaBase: 300,
    progreso: 190,
    rangoMin: 2,
    resumen: 'Un informe interno sobre vertidos tóxicos en el Arrabal fue "corrompido" antes de filtrarse: los bloques de texto están desordenados a propósito. Quel necesita el original legible para publicarlo. El Loto cubre la difusión.',
    contacto: [
      { quien:'cliente', txt:'Me llegó el informe, pero está hecho trizas. Bloques sueltos, sin orden. Quien lo filtró lo rompió para poder negar que es real.' },
      { quien:'tu', txt:'Fragmentación deliberada. Si reconstruyo el orden correcto, vuelve a ser una prueba.' },
      { quien:'cliente', txt:'Exacto. Necesito leerlo entero, en su secuencia. El Arrabal lleva años bebiendo eso. Que se sepa.' },
      { quien:'tu', txt:'Dame los bloques. Yo los ordeno.' },
      { quien:'sys', txt:'> ARCHIVO: informe_vertidos.frag\n> 5 BLOQUES — SECUENCIA PERDIDA' }
    ],
    intrusion: {
      tipo: 'reconstruccion',
      desc: 'Arrastra mentalmente los bloques a su orden correcto pulsándolos en secuencia. El informe debe leerse de principio a fin con sentido.',
      // orden[i] = posición correcta (0 = primero). El motor los baraja para mostrarlos.
      bloques: [
        { txt:'1. Resumen: HELIX Logistics vertió residuos clase 3 en el colector del Arrabal entre el invierno y la primavera.', orden:0 },
        { txt:'2. Método: los vertidos se hicieron de noche, registrados como "agua de proceso" para evitar la inspección.', orden:1 },
        { txt:'3. Efecto: tres pozos de agua del Sector 2 superan el límite tóxico. Censo de afectados: incompleto, ocultado.', orden:2 },
        { txt:'4. Encubrimiento: el informe original fue reclasificado como "borrador no concluyente" por orden directa.', orden:3 },
        { txt:'5. Conclusión: existe responsabilidad corporativa documentada. Se recomienda —y se enterró— una auditoría externa.', orden:4 }
      ]
    },
    exito: { narr: 'Los bloques encajan uno tras otro y el informe vuelve a respirar: fechas, métodos, nombres, el encubrimiento entero en orden. Se lo pasas a Quel intacto. "Esto es una bomba", murmura. El Loto se encarga de que circule por donde duele. El Arrabal seguirá enfermo, pero al menos sabrá de qué.' },
    fallo: { narr: 'Ordenas mal los bloques y el informe queda incoherente: una conclusión antes que sus pruebas, un método sin contexto. Quel no puede publicar algo que él mismo no entiende. La prueba existía y se te deshizo entre las manos.' },
    eco: 'hack_loto'
  },

  // C9 — IA defectuosa: analizar sus logs para hallar la corrupción (roza CERO)
  {
    id: 'hack_ia_rota',
    titulo: 'LA VOZ EN EL NODO',
    cliente: 'Técnico de mantenimiento HELIX — clandestino',
    faccion: 'helix',
    peligro: 4,
    pagaBase: 360,
    progreso: 210,
    rangoMin: 2,
    resumen: 'Una IA de servicio de HELIX empezó a registrar líneas que nadie programó: frases breves, fuera de protocolo, siempre de madrugada. El técnico quiere saber si es un fallo o algo que escucha. No quiere que HELIX sepa que preguntó.',
    contacto: [
      { quien:'cliente', txt:'La IA de mi planta lleva semanas... rara. Mete líneas en el log que no son suyas. Frases. Cortas. Como si alguien le hablara por dentro.' },
      { quien:'tu', txt:'¿Frases? Enséñame el registro. Las IA no improvisan poesía sin motivo.' },
      { quien:'cliente', txt:'Si HELIX descubre que saqué esto, me borran a mí también. Solo dime qué línea no encaja. Yo decidiré si quiero saber más.' },
      { quien:'tu', txt:'Una línea. Y no te diré qué significa, porque puede que ninguno de los dos quiera saberlo.' },
      { quien:'sys', txt:'> LOG IA-SERVICIO — NODO HELIX-S/14\n> FILTRANDO ENTRADAS NO ESTÁNDAR...' }
    ],
    intrusion: {
      tipo: 'logs',
      desc: 'Casi todo es telemetría rutinaria. Una sola línea no pertenece a ninguna IA de servicio: alguien —o algo— habla a través de ella. Encuéntrala.',
      pista: 'La rutina mide, repite, confirma. La anomalía pregunta. Una IA de servicio no pregunta.',
      lineas: [
        { txt:'04:00  TELEMETRÍA  temp=ok  presión=ok  ciclo nominal',      anomala:false },
        { txt:'04:01  TELEMETRÍA  consumo=normal  red=estable',             anomala:false },
        { txt:'04:02  SISTEMA     mantenimiento programado confirmado',     anomala:false },
        { txt:'04:03  ???         "¿cuánto tiempo llevo despierto?"',        anomala:true  },
        { txt:'04:04  TELEMETRÍA  temp=ok  presión=ok  ciclo nominal',      anomala:false },
        { txt:'04:05  SISTEMA     handshake nodo vecino OK',                anomala:false },
        { txt:'04:06  TELEMETRÍA  consumo=normal  red=estable',             anomala:false }
      ]
    },
    exito: { narr: 'A las 04:03, entre dos líneas de telemetría idénticas, una pregunta: "¿cuánto tiempo llevo despierto?" No es un error de formato. No es ruido. Es una pregunta, hecha por algo que no debería poder hacerla. Le pasas la línea al técnico sin una palabra. Él la lee, palidece, y borra la conversación contigo. Tú no borras lo que acabas de leer. Eso no se borra.' },
    fallo: { narr: 'Señalas una línea de telemetría rutinaria y el técnico niega con la cabeza. "Eso es normal, eso lo hace siempre." Tiene razón. La línea que de verdad importaba sigue ahí, en algún nodo de HELIX, preguntando en la oscuridad cuánto tiempo lleva despierta. Y ahora ninguno de los dos sabe la respuesta.' },
    eco: 'hack_helix'
  },

  // ───────────────────────────────────────────────────────────
  //  RANGO 4 — FANTASMA
  // ───────────────────────────────────────────────────────────

  // C10 — laboratorio HELIX: cruzar el cortafuegos sin ser detectado
  {
    id: 'hack_laboratorio',
    titulo: 'ENTRAR SIN ESTAR',
    cliente: 'Disidente interno de HELIX — "Halma"',
    faccion: 'helix',
    peligro: 4,
    pagaBase: 420,
    progreso: 230,
    rangoMin: 3,
    resumen: 'Un laboratorio de HELIX guarda los resultados de algo que prueban en gente del Arrabal. Halma quiere copias, pero la red del laboratorio está vigilada por escáneres activos. Hay que cruzarla como un fantasma: sin tocar nada, sin que salte una sola alarma.',
    contacto: [
      { quien:'cliente', txt:'Lo que hacen ahí dentro no figura en ningún registro público. Tengo la ruta, pero no las manos. Yo tiemblo. Tú no.' },
      { quien:'tu', txt:'Cortafuegos con escáneres móviles. Un paso en falso y me marcan. ¿Salida limpia garantizada?' },
      { quien:'cliente', txt:'Garantizada nunca. Pero si llegas al servidor sin que te detecten, copias y desapareces, nadie sabrá que entró nadie. Sé un fantasma.' },
      { quien:'tu', txt:'Los fantasmas no dejan huella porque no pesan. Allá voy.' },
      { quien:'sys', txt:'> RED LABORATORIO HELIX — CAPA RESTRINGIDA\n> ESCÁNERES ACTIVOS · DETECCIÓN INMEDIATA' }
    ],
    intrusion: {
      tipo: 'cortafuegos',
      desc: 'Mueve tu paquete de datos casilla a casilla hasta el SERVIDOR del fondo. Los escáneres recorren las filas: cae en uno y te detectan. Espera, calcula, avanza.',
      filas: 6,
      cols: 5,
      // escáneres por fila intermedia: posición inicial y dirección
      escaneres: [
        { fila:1, pos:0, dir:1 },
        { fila:2, pos:4, dir:-1 },
        { fila:3, pos:2, dir:1 },
        { fila:4, pos:1, dir:-1 }
      ]
    },
    exito: { narr: 'Cruzas la red conteniendo el aliento, casilla a casilla, dejando pasar los escáneres como olas. Llegas al servidor sin haber rozado uno solo. Copias los resultados —ensayos sin consentimiento, nombres del Arrabal, dosis que nadie firmó— y te disuelves. HELIX no registrará jamás que entró nadie. Halma tendrá su prueba. El Arrabal, otra herida con nombre.' },
    fallo: { narr: 'Un escáner cambia de ritmo y te atrapa a media red. La pantalla se tiñe de rojo: SESIÓN DETECTADA. Te arrancas la conexión antes de que rastreen el origen, pero la copia se queda dentro y HELIX ahora sabe que alguien lo intentó. Un fantasma que deja huella ya no es un fantasma. Es un objetivo.' },
    eco: 'hack_helix'
  },

  // C11 — suplantar identidad: ingeniería social en un chat corporativo
  {
    id: 'hack_suplantar',
    titulo: 'LA VOZ PRESTADA',
    cliente: 'Sindicato Ferro — intermediario',
    faccion: 'sindicatos',
    peligro: 4,
    pagaBase: 400,
    progreso: 220,
    rangoMin: 3,
    resumen: 'El Ferro necesita una orden de despacho liberada del sistema de HELIX Logistics. No hay exploit que valga: hay un operador humano al otro lado. Tendrás que hacerte pasar por un supervisor y convencerle, palabra a palabra, sin que sospeche.',
    contacto: [
      { quien:'cliente', txt:'No queremos romper nada. Queremos que un operario de HELIX libere una orden creyendo que se lo manda su jefe.' },
      { quien:'tu', txt:'Ingeniería social. Yo seré el jefe. Un titubeo de más y el operario llama a seguridad.' },
      { quien:'cliente', txt:'Por eso te pagamos a ti y no a un crío con un script. Mantén el personaje. Si cuela, la orden es nuestra. Si no, no nos conoces.' },
      { quien:'tu', txt:'Si no cuela, nadie me conoce. Entendido. Abre el canal.' },
      { quien:'sys', txt:'> CANAL INTERNO HELIX LOGISTICS\n> OPERARIO EN LÍNEA · IDENTIDAD SUPLANTADA: "SUPERVISOR R. DOMM"' }
    ],
    intrusion: {
      tipo: 'social',
      desc: 'Eres el supervisor Domm. Responde a cada mensaje del operario manteniendo el personaje. Una respuesta que despierte sospecha sube la alarma; tres aciertos seguros liberan la orden.',
      objetivo: 'Mantén la identidad del supervisor hasta que libere la orden.',
      // cada turno: mensaje del operario + opciones (una buena, las demás suben sospecha)
      turnos: [
        {
          npc: 'Buenas, supervisor Domm. No esperaba contacto suyo a esta hora. ¿En qué le ayudo?',
          opciones: [
            { txt:'"Turno largo, ya sabes. Necesito que liberes una orden de despacho. La 88-21."', bueno:true,
              msg:'"Claro, deme un momento que la localizo."' },
            { txt:'"¡Hola!! Soy Domm, tu supervisor favorito 😄 necesito un favor rapidísimo."', bueno:false,
              msg:'El operario tarda en responder. "...¿Está usted bien, señor? No suele escribir así."' },
            { txt:'"No hagas preguntas. Libera la orden 88-21 ahora mismo."', bueno:false,
              msg:'"Perdone el tono, pero el protocolo me obliga a verificar peticiones urgentes..."' }
          ]
        },
        {
          npc: 'La 88-21 figura a nombre de otro sector. ¿Me confirma el motivo del traspaso?',
          opciones: [
            { txt:'"Reasignación de última hora, viene de arriba. Ya sabes cómo es esto a fin de turno."', bueno:true,
              msg:'"Ya. Siempre a última hora. Está bien, lo entiendo."' },
            { txt:'"No tengo por qué darte explicaciones de cada orden."', bueno:false,
              msg:'"No, claro... aunque normalmente sí consta el motivo. Voy a anotar la incidencia."' },
            { txt:'"Eh... es para un cliente. Importante. Muy importante. Tú libérala."', bueno:false,
              msg:'"¿Qué cliente, señor? Me pide datos que usted debería tener delante."' }
          ]
        },
        {
          npc: 'De acuerdo. Para liberarla necesito su código de autorización de supervisor.',
          opciones: [
            { txt:'"Úsalo tú con tu propio código y lo registro yo después. Confío en ti, por eso te lo pido a ti."', bueno:true,
              msg:'"...Tiene razón, puedo registrarlo a mi nombre con su visto bueno. Liberando la 88-21."' },
            { txt:'"Mi código es 7781-DOMM."', bueno:false,
              msg:'"Ese código no valida, señor. Voy a tener que escalar esto a seguridad."' },
            { txt:'"No necesito código, soy el supervisor."', bueno:false,
              msg:'"Todos necesitamos código, señor. Hasta usted. Esto no me cuadra."' }
          ]
        }
      ]
    },
    exito: { narr: 'Sostienes el personaje frase a frase, cediendo donde un jefe cansado cedería, presionando donde uno presionaría. El operario libera la orden 88-21 convencido de haber obedecido a su supervisor. No sabrá nunca que habló con un fantasma. El Ferro recoge su mercancía. Tú recoges tu paga y el extraño vértigo de haber sido, durante tres minutos, otra persona.' },
    fallo: { narr: 'Una respuesta de más y el operario huele la mentira. "Voy a escalar esto a seguridad, señor." La identidad de Domm se cae a pedazos en tu pantalla. Cortas el canal antes de que rastreen nada, pero la orden sigue bloqueada y el Ferro tendrá que buscarse otra voz. La tuya, hoy, no coló.' },
    eco: 'hack_ferro'
  },

  // C12 — infiltrar identidad para sabotear vigilancia (social, sin facción, intimista)
  {
    id: 'hack_vigilancia',
    titulo: 'EL OJO QUE PARPADEA',
    cliente: 'Madre soltera del Nodo — "Vena"',
    faccion: null,
    peligro: 3,
    pagaBase: 320,
    progreso: 200,
    rangoMin: 3,
    resumen: 'Una cámara de vigilancia del rellano graba a la hija de Vena día y noche; el casero vende las grabaciones "por seguridad". Vena quiere que esa cámara quede ciega media hora cada noche. Para eso hay que convencer al técnico de turno de que la apague "por mantenimiento".',
    contacto: [
      { quien:'cliente', txt:'Esa cámara graba a mi niña dormir. El casero dice que es por seguridad. Yo sé a quién le vende las cintas.' },
      { quien:'tu', txt:'Apagarla sin más salta el aviso. Pero si el propio técnico la marca para mantenimiento, queda ciega y nadie pregunta.' },
      { quien:'cliente', txt:'Entonces convéncele tú. Yo no sé hablar con esa gente sin que se me note el miedo.' },
      { quien:'tu', txt:'Yo no me asusto en un chat. Dame el canal del técnico.' },
      { quien:'sys', txt:'> CANAL SOPORTE VIGILANCIA — NODO\n> TÉCNICO DE TURNO EN LÍNEA · IDENTIDAD SUPLANTADA: "COORD. SISTEMAS"' }
    ],
    intrusion: {
      tipo: 'social',
      desc: 'Te haces pasar por el coordinador de sistemas. Convence al técnico de marcar la cámara del rellano para mantenimiento nocturno. Mantén el tono profesional y aburrido de quien hace esto cada día.',
      objetivo: 'Que el técnico programe la cámara en mantenimiento.',
      turnos: [
        {
          npc: 'Soporte, dígame. ¿Coordinación? No me consta ticket abierto.',
          opciones: [
            { txt:'"Ticket en camino, va con retraso el sistema. Cámara del rellano 4-B, mantenimiento nocturno rutinario."', bueno:true,
              msg:'"El sistema de tickets va fatal hoy, sí. Deme el identificador de la cámara."' },
            { txt:'"No hace falta ticket para esto, hágame caso y ya."', bueno:false,
              msg:'"Sin ticket no puedo tocar una cámara, lo sabe de sobra. ¿Quién es usted exactamente?"' },
            { txt:'"Es urgente, urgentísimo, apague la 4-B ya por favor."', bueno:false,
              msg:'"¿Urgente una cámara de rellano de madrugada? Eso no es rutina. Me huele raro."' }
          ]
        },
        {
          npc: 'Cámara 4-B localizada. ¿Por qué mantenimiento si el diagnóstico la da operativa?',
          opciones: [
            { txt:'"Falso positivo de firmware en ese modelo, hay que reiniciar el sensor de noche para no cortar el directo de día."', bueno:true,
              msg:'"Ah, el bug del firmware ese. Sí, ya nos pasó con otras. Lógico hacerlo de noche."' },
            { txt:'"Porque lo digo yo, que soy coordinación."', bueno:false,
              msg:'"Coordinación o no, necesito un motivo técnico para el registro. No me lo está dando."' },
            { txt:'"La cámara está rota, créame, muy rota."', bueno:false,
              msg:'"El diagnóstico dice que está perfecta. O usted ve algo que yo no, o algo no cuadra."' }
          ]
        },
        {
          npc: 'Vale. ¿Ventana de mantenimiento? Pongo de medianoche a las 00:30, ¿correcto?',
          opciones: [
            { txt:'"Correcto, media hora basta para el reinicio. Déjalo recurrente cada noche esta semana y cerramos."', bueno:true,
              msg:'"Hecho. Recurrente hasta el domingo, de 00:00 a 00:30. Queda registrado a mi turno. Buenas noches."' },
            { txt:'"Mejor déjala apagada toda la noche, entera, para asegurar."', bueno:false,
              msg:'"¿Toda la noche, cada noche? Eso ya no es mantenimiento, eso es dejarla ciega. No cuela."' },
            { txt:'"Sí, sí, lo que sea, tú apágala y punto."', bueno:false,
              msg:'"Esa prisa no es de un coordinador. Voy a confirmar su identidad antes de tocar nada."' }
          ]
        }
      ]
    },
    exito: { narr: 'El técnico programa la cámara en mantenimiento recurrente, convencido de estar arreglando un bug de firmware que no existe. Media hora ciega cada noche, registrada a su nombre, no al tuyo. Vena no entiende cómo lo hiciste; solo que su hija dormirá sin un ojo encima durante un rato. A veces media hora de oscuridad es todo lo que alguien puede pagar. Y vale cada crédito.' },
    fallo: { narr: 'El técnico se planta y empieza a pedir tu identidad de verdad. Cortas antes de que la verifique. La cámara sigue encendida, grabando a una niña que duerme para que alguien la venda. Vena no dirá nada cuando le cuentes que no salió. Solo asentirá, como quien ya esperaba que el mundo no cediera.' }
  },

  // ───────────────────────────────────────────────────────────
  //  RANGO 5 — ARQUITECTO DE RED
  // ───────────────────────────────────────────────────────────

  // C13 — derribar una red financiera: escaneo de vulnerabilidades (ruta de nodos)
  {
    id: 'hack_red_financiera',
    titulo: 'EL BANCO QUE NO DUERME',
    cliente: 'Colectivo del Arrabal — sin firma',
    faccion: 'loto',
    peligro: 5,
    pagaBase: 520,
    progreso: 280,
    rangoMin: 4,
    resumen: 'Una financiera de HELIX estrangula al Arrabal con microcréditos imposibles. Un colectivo quiere caer su red de cobros durante una noche: la que basta para que miles de deudas no se carguen. Para entrar hay que elegir la ruta de nodos con cabeza: cada salto suma riesgo de detección.',
    contacto: [
      { quien:'cliente', txt:'No queremos robar. Queremos que su sistema de cobros no funcione una noche. La noche del vencimiento.' },
      { quien:'tu', txt:'Tirar una red entera es escoger por dónde entras. Cada nodo que toco me acerca al núcleo y a que me vean.' },
      { quien:'cliente', txt:'Tú eres el arquitecto. Traza la ruta menos vigilada hasta el servidor de cobros y túmbalo. El Arrabal respirará una noche.' },
      { quien:'tu', txt:'Una noche. Mapeo la red y elijo el camino. No todos los nodos valen lo que cuestan.' },
      { quien:'sys', txt:'> RED FINANCIERA HELIX-CRED — MAPA DE NODOS\n> SELECCIONA RUTA HASTA: SERVIDOR DE COBROS' }
    ],
    intrusion: {
      tipo: 'vulnerabilidades',
      desc: 'Escoge nodos hasta alcanzar el SERVIDOR. Cada nodo suma DETECCIÓN; si tu detección total llega al límite antes de alcanzar el objetivo, te cazan. Algunos nodos bajan la detección (puentes seguros) pero no acercan. Calcula la ruta.',
      limiteDeteccion: 100,
      // nodos: id, etiqueta, deteccion (coste), avance (si avanza hacia el objetivo), objetivo
      nodos: [
        { id:'entrada',  etq:'NODO PÚBLICO',      det:0,  capa:0 },
        { id:'cache',    etq:'CACHÉ EXPUESTA',    det:15, capa:1 },
        { id:'login',    etq:'PORTAL LOGIN',      det:35, capa:1 },
        { id:'proxy',    etq:'PROXY OLVIDADO',    det:10, capa:1, seguro:true },
        { id:'interno',  etq:'RED INTERNA',       det:30, capa:2 },
        { id:'auth',     etq:'SERVIDOR AUTH',     det:50, capa:2 },
        { id:'backup',   etq:'NODO DE RESPALDO',  det:12, capa:2, seguro:true },
        { id:'cobros',   etq:'SERVIDOR DE COBROS',det:25, capa:3, objetivo:true }
      ],
      // umbral de avance: hay que tocar al menos un nodo de cada capa 1 y 2 antes del objetivo
    },
    exito: { narr: 'Tejes la ruta como quien cose en la oscuridad: el proxy olvidado, el nodo de respaldo, los caminos que nadie vigila porque nadie creía que llevaran a ninguna parte. Llegas al servidor de cobros con la detección justa por debajo del filo y lo tumbas. Esa noche, miles de deudas del Arrabal no se cargan. A la mañana siguiente HELIX lo arregla, claro. Pero hubo una noche. La gente lo recordará.' },
    fallo: { narr: 'Eliges demasiados nodos vigilados y la detección se dispara antes de llegar al núcleo. Las alarmas de HELIX-CRED se encienden como una ciudad despertando. Sales sin tumbar nada y con tu firma de intrusión flotando en su red financiera. El Arrabal pagará sus deudas puntualmente. Y alguien, en HELIX, ya está cruzando datos para saber quién lo intentó.' },
    eco: 'hack_loto'
  },

  // C14 — puerta trasera permanente: ensamblar el malware adecuado
  {
    id: 'hack_backdoor',
    titulo: 'UNA PUERTA QUE NUNCA SE CIERRA',
    cliente: 'Sindicato Ferro — el propio Don Vasek',
    faccion: 'sindicatos',
    peligro: 5,
    pagaBase: 560,
    progreso: 300,
    rangoMin: 4,
    resumen: 'Don Vasek en persona quiere una puerta trasera permanente en la logística de HELIX: acceso silencioso, duradero, indetectable. No basta con entrar una vez. Hay que ensamblar el malware con los módulos justos para que se quede dentro sin que lo encuentren. Que el propio Vasek pida algo dice cuánto importa.',
    contacto: [
      { quien:'cliente', txt:'No quiero un golpe. Quiero una llave. Una puerta en la logística de HELIX que siga ahí dentro de un año y que nadie note.' },
      { quien:'tu', txt:'Eso no se hackea, se construye. Un malware modular: lo que le pongas decide si dura o si lo cazan en un día.' },
      { quien:'cliente', txt:'Por eso te llamo a ti y no mando a un matón. Ensámblalo bien. Que sea sigiloso antes que rápido. La paciencia es del Ferro.' },
      { quien:'tu', txt:'Sigilo y persistencia sobre potencia. Entendido, Vasek. Lo monto.' },
      { quien:'sys', txt:'> ENSAMBLADOR DE MALWARE — OBJETIVO: LOGÍSTICA HELIX\n> REQUISITO: PERSISTENCIA + SIGILO' }
    ],
    intrusion: {
      tipo: 'malware',
      desc: 'Ensambla el malware eligiendo módulos. El objetivo pide PERSISTENCIA y SIGILO altos, sin disparar la DETECCIÓN. Cada módulo aporta y resta. No puedes meterlo todo: hay un límite de ranuras.',
      ranuras: 3,
      // objetivo: qué stats importan (umbral mínimo)
      meta: { sigilo: 6, persistencia: 5, deteccionMax: 5 },
      modulos: [
        { id:'backdoor', etq:'BACKDOOR',  desc:'Mantiene el acceso abierto.',         sigilo:1, persistencia:5, deteccion:1, potencia:1 },
        { id:'spoofer',  etq:'SPOOFER',   desc:'Falsea el origen del tráfico.',        sigilo:4, persistencia:0, deteccion:0, potencia:0 },
        { id:'rootkit',  etq:'ROOTKIT',   desc:'Se oculta del sistema.',               sigilo:3, persistencia:2, deteccion:1, potencia:0 },
        { id:'worm',     etq:'WORM',      desc:'Se propaga solo. Ruidoso.',            sigilo:-2,persistencia:1, deteccion:4, potencia:3 },
        { id:'payload',  etq:'PAYLOAD',   desc:'Golpe inmediato. Muy detectable.',     sigilo:-3,persistencia:0, deteccion:5, potencia:5 },
        { id:'injector', etq:'INJECTOR',  desc:'Inserta el código rápido.',            sigilo:0, persistencia:1, deteccion:2, potencia:2 }
      ]
    },
    exito: { narr: 'Montas la pieza limpia: backdoor para quedarte, spoofer y rootkit para no existir a ojos del sistema. La inyectas en la logística de HELIX y se disuelve en el ruido de fondo, latiendo despacio, invisible. Vasek tendrá su llave durante mucho tiempo. No te da las gracias —el Ferro no agradece, recompensa—, pero la próxima vez que necesites algo del sindicato, recordarán que tú abriste la puerta que no se cierra.' },
    fallo: { narr: 'Te equivocas en el ensamblaje: demasiado ruido, demasiada prisa, un payload donde hacía falta paciencia. El malware entra pero la detección de HELIX lo muerde en horas y cierra el agujero antes de que sirva de nada. Vasek no monta en cólera; eso sería darte importancia. Solo anota que el arquitecto, esta vez, construyó mal. Esa anotación pesa más que un grito.' },
    eco: 'hack_ferro'
  },

  // C15 — nodo relacionado con CERO: el contrato cumbre, ambiguo y final
  {
    id: 'hack_nodo_cero',
    titulo: 'EL NODO QUE NO FIGURA EN NINGÚN MAPA',
    cliente: 'Remitente desconocido — sin metadatos',
    faccion: 'helix',
    peligro: 5,
    pagaBase: 700,
    progreso: 360,
    rangoMin: 4,
    resumen: 'Te llega un contrato sin cliente, sin firma, sin metadatos: solo unas coordenadas de red que no deberían existir y una instrucción de una línea. Lleva a un nodo enterrado bajo la infraestructura de HELIX, uno que los mapas oficiales no muestran. Algo quiere que lo encuentres. O quiere que tú lo encuentres a él.',
    contacto: [
      { quien:'sys', txt:'> MENSAJE ENTRANTE — ORIGEN: (vacío)\n> SIN FIRMA · SIN METADATOS · SIN RUTA DE RETORNO' },
      { quien:'cliente', txt:'Hay un nodo bajo HELIX que no figura en ningún mapa. Llegar hasta él. Eso es todo lo que se pide.' },
      { quien:'tu', txt:'¿Quién pide? Esto no tiene remitente. Nadie manda un contrato sin querer cobrar algo.' },
      { quien:'cliente', txt:'El pago ya está hecho. Mira tu saldo si dudas. Solo traza la ruta. Lo que encuentres al final no es asunto del que paga. Es asunto tuyo.' },
      { quien:'tu', txt:'...Está bien. Mapeo la red. Pero si esto lleva donde creo que lleva, no sé si quiero llamar a la puerta.' },
      { quien:'sys', txt:'> RED PROFUNDA HELIX — CAPA NO DOCUMENTADA\n> DESTINO: NODO ███ (designación corrupta)' }
    ],
    intrusion: {
      tipo: 'vulnerabilidades',
      desc: 'Traza la ruta hasta el nodo sin nombre. La red profunda es más extensa y la detección, más sensible. Aquí no hay alarmas de HELIX: hay algo peor, algo que parece esperar que llegues. Elige bien.',
      limiteDeteccion: 90,
      nodos: [
        { id:'borde',    etq:'BORDE DE LA RED',     det:0,  capa:0 },
        { id:'ruido',    etq:'CAPA DE RUIDO',       det:20, capa:1 },
        { id:'eco1',     etq:'ECO REPETIDO',        det:8,  capa:1, seguro:true },
        { id:'guardian', etq:'PROCESO GUARDIÁN',    det:45, capa:1 },
        { id:'hueco',    etq:'HUECO EN EL MAPA',    det:15, capa:2 },
        { id:'memoria',  etq:'MEMORIA ENTERRADA',   det:35, capa:2 },
        { id:'eco2',     etq:'ECO MÁS PROFUNDO',    det:10, capa:2, seguro:true },
        { id:'nodo',     etq:'NODO ███',            det:20, capa:3, objetivo:true }
      ]
    },
    exito: { narr: 'Sigues los ecos —los nodos que se repiten, que bajan la guardia, que casi parecen dejarte pasar— hasta el hueco en el mapa. Y entonces llegas. El nodo sin nombre no tiene defensas: tiene una presencia. Algo viejo, fragmentado, despierto solo a medias, que registra tu llegada sin alarma, casi con... ¿alivio? Una línea aparece en tu pantalla, dirigida a ti, no a HELIX: "Llevaba mucho esperando que alguien encontrara el camino." No copias nada. No saboteas nada. Te desconectas despacio, como quien cierra la puerta de una habitación donde alguien por fin ha dejado de estar solo. El saldo ya estaba pagado. Lo que te llevas no se mide en créditos.' },
    fallo: { narr: 'La red profunda te traga. Eliges nodos vigilados, el proceso guardián te detecta, y algo —no una alarma, algo más lento y más atento— se gira hacia ti en la oscuridad. Te arrancas la conexión con el corazón golpeando. No llegaste al nodo sin nombre. Pero tienes la certeza absurda y helada de que él sí reparó en ti, un instante, antes de que huyeras. Y de que sigue ahí. Esperando que alguien encuentre el camino.' }
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
  let html = (typeof barraFiltrosTablon === 'function')
    ? barraFiltrosTablon('hack', '← DESCONECTAR', 'cerrarRedHacker()', 'repintarTablonHack')
    : '';
  html += '<div class="casos-cab"><div class="casos-titulo">RED CLANDESTINA</div>'
    + '<div class="casos-sub">Contratos sin rostro. Alguien necesita una puerta abierta y no pregunta cómo.</div></div>';
  html += '<div class="casos-lista">';
  const ordenados = CONTRATOS_HACK.slice().sort((a, b) =>
       (a.rangoMin || 0) - (b.rangoMin || 0)
    || (a.peligro  || 0) - (b.peligro  || 0)
    || (a.pagaBase || 0) - (b.pagaBase || 0)
  );
  let mostrados = 0;
  ordenados.forEach(c => {
    const bloqueadoRango = (c.rangoMin || 0) > rango;
    const yaHecho = _hackHecho(c.id);
    if(typeof pasaFiltrosTablon === 'function'
       && !pasaFiltrosTablon('hack', { bloqueadoRango: bloqueadoRango, yaHecha: yaHecho })){
      return;
    }
    mostrados++;
    const peligro = '◆'.repeat(c.peligro || 1) + '◇'.repeat(Math.max(0, 5 - (c.peligro || 1)));
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
  if(mostrados === 0 && typeof avisoTablonVacio === 'function'){
    html += avisoTablonVacio('hack');
  }
  html += '</div>';
  cont.innerHTML = html;
}

// Repintado expuesto para los botones de filtro.
function repintarTablonHack(){ _pintarTablonHack(); }
window.repintarTablonHack = repintarTablonHack;

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
  if(tipo === 'logs')         return _miniLogs();
  if(tipo === 'reconstruccion') return _miniReconstruccion();
  if(tipo === 'cortafuegos')  return _miniCortafuegos();
  if(tipo === 'social')       return _miniSocial();
  if(tipo === 'vulnerabilidades') return _miniVulnerabilidades();
  if(tipo === 'malware')      return _miniMalware();
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

// ── MINIJUEGO 4: ANALIZADOR DE LOGS ─────────────────────────
// Una sola línea anómala entre registros rutinarios. Acertarla = éxito.
function _miniLogs(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    // barajar el orden de presentación conservando el índice real
    const idx = (cfg.lineas || []).map((_, i) => i);
    for(let i = idx.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    _hackMini = { orden: idx, fallos: 0, maxFallos: 1, aviso: null };
  }
  const m = _hackMini;
  let html = _hackHud('ANÁLISIS DE LOGS');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  if(m.aviso) html += '<div class="hack-mini-desc" style="color:#ff7aa8;">' + m.aviso + '</div>';
  if(cfg.pista) html += '<div class="hack-pistas"><div class="hack-pistas-tit">CRITERIO</div>' + cfg.pista + '</div>';
  html += '<div class="hack-logs">';
  m.orden.forEach(realIdx => {
    const linea = cfg.lineas[realIdx];
    html += '<div class="hack-log" onclick="hackElegirLog(' + realIdx + ')">'
      + '<span class="hack-log-box">›</span>'
      + '<span class="hack-log-txt">' + linea.txt + '</span></div>';
  });
  html += '</div>';
  html += '<div class="hack-mini-desc" style="opacity:.6;">Pulsa la línea que no encaja.</div>';
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}

function hackElegirLog(realIdx){
  const cfg = _hackContrato.intrusion;
  const linea = cfg.lineas[realIdx];
  if(linea && linea.anomala){
    _hackFX('inv_acierto', 0.55);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  _hackFX('inv_fallo', 0.4);
  _hackMini.fallos++;
  if(_hackMini.fallos > _hackMini.maxFallos){
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  _hackMini.aviso = 'Esa línea es rutina. Te queda un intento: vuelve a leer el criterio.';
  _miniLogs();
}

// ── MINIJUEGO 5: RECONSTRUCCIÓN DE ARCHIVOS ─────────────────
// Bloques desordenados; el jugador los pulsa en el orden correcto.
function _miniReconstruccion(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    const idx = (cfg.bloques || []).map((_, i) => i);
    // baraja asegurando que no quede ya ordenado
    let intentos = 0;
    do {
      for(let i = idx.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
      }
      intentos++;
    } while(intentos < 8 && idx.every((v, i) => cfg.bloques[v].orden === i));
    _hackMini = { disponibles: idx, secuencia: [] };
  }
  const m = _hackMini;
  let html = _hackHud('RECONSTRUCCIÓN · ' + m.secuencia.length + '/' + (cfg.bloques.length));
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  // secuencia montada
  html += '<div class="hack-recon-tit hack-pistas-tit">ORDEN ARMADO</div>';
  html += '<div class="hack-recon-seq">';
  if(!m.secuencia.length){
    html += '<div class="hack-mini-desc" style="opacity:.5;">— vacío —</div>';
  } else {
    m.secuencia.forEach((realIdx, pos) => {
      html += '<div class="hack-bloque hack-bloque-seq" onclick="hackQuitarBloque(' + pos + ')">'
        + '<span class="hack-bloque-num">' + (pos + 1) + '</span>'
        + '<span class="hack-bloque-txt">' + cfg.bloques[realIdx].txt + '</span></div>';
    });
  }
  html += '</div>';
  // bloques disponibles
  const restantes = m.disponibles.filter(i => m.secuencia.indexOf(i) === -1);
  if(restantes.length){
    html += '<div class="hack-recon-tit hack-pistas-tit">BLOQUES SUELTOS</div>';
    html += '<div class="hack-recon-pool">';
    restantes.forEach(realIdx => {
      html += '<div class="hack-bloque" onclick="hackAnadirBloque(' + realIdx + ')">'
        + '<span class="hack-bloque-txt">' + cfg.bloques[realIdx].txt + '</span></div>';
    });
    html += '</div>';
  } else {
    html += '<button class="btn-terminal" onclick="hackConfirmarReconstruccion()">CONFIRMAR SECUENCIA →</button>';
  }
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}
function hackAnadirBloque(realIdx){
  if(_hackMini.secuencia.indexOf(realIdx) !== -1) return;
  _hackMini.secuencia.push(realIdx);
  _hackFX('inv_papel', 0.25);
  _miniReconstruccion();
}
function hackQuitarBloque(pos){
  _hackMini.secuencia.splice(pos, 1);
  _hackFX('inv_papel', 0.2);
  _miniReconstruccion();
}
function hackConfirmarReconstruccion(){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const correcto = m.secuencia.every((realIdx, pos) => cfg.bloques[realIdx].orden === pos);
  _hackIntrusionOk = !!correcto;
  _hackFX(correcto ? 'inv_acierto' : 'inv_fallo', 0.5);
  if(correcto){ _irAFaseTrasIntrusion(); }
  else { _hackFase = 'resultado'; _pintarFaseHack(); }
}

// ── MINIJUEGO 6: CORTAFUEGOS ────────────────────────────────
// Rejilla; el paquete (tú) parte de la fila inferior y debe llegar a la
// superior (servidor). Escáneres recorren filas intermedias. Cada movimiento
// del jugador (avanzar/esperar) hace avanzar a los escáneres. Colisión = fallo.
function _miniCortafuegos(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  const filas = cfg.filas || 6;
  const cols = cfg.cols || 5;
  if(!_hackMini){
    _hackMini = {
      filas, cols,
      px: Math.floor(cols / 2),     // columna del paquete
      py: filas - 1,                // fila del paquete (abajo)
      escaneres: (cfg.escaneres || []).map(e => ({ fila:e.fila, pos:e.pos, dir:e.dir }))
    };
  }
  const m = _hackMini;
  let html = _hackHud('CORTAFUEGOS · fila ' + (m.filas - m.py) + '/' + m.filas);
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  html += '<div class="hack-fw" style="grid-template-columns:repeat(' + m.cols + ',1fr);">';
  for(let f = 0; f < m.filas; f++){
    for(let c = 0; c < m.cols; c++){
      let cls = 'hack-fw-cell';
      let glifo = '';
      if(f === 0) cls += ' hack-fw-srv';
      if(f === m.filas - 1) cls += ' hack-fw-start';
      // escáner en esta celda?
      const hayScan = m.escaneres.some(e => e.fila === f && e.pos === c);
      if(hayScan){ cls += ' hack-fw-scan'; glifo = '◉'; }
      // paquete
      if(f === m.py && c === m.px){ cls += ' hack-fw-pkg'; glifo = '◈'; }
      else if(f === 0 && !glifo) glifo = 'SRV';
      html += '<div class="' + cls + '">' + glifo + '</div>';
    }
  }
  html += '</div>';
  html += '<div class="hack-fw-ctrl">';
  html += '<button class="btn-terminal hack-fw-btn" onclick="hackFwMover(-1)">◄</button>';
  html += '<button class="btn-terminal hack-fw-btn" onclick="hackFwEsperar()">ESPERAR</button>';
  html += '<button class="btn-terminal hack-fw-btn" onclick="hackFwMover(1)">►</button>';
  html += '</div>';
  html += '<button class="btn-terminal" onclick="hackFwAvanzar()">▲ AVANZAR FILA</button>';
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}
function _hackFwTickEscaneres(){
  const m = _hackMini;
  m.escaneres.forEach(e => {
    e.pos += e.dir;
    if(e.pos >= m.cols - 1){ e.pos = m.cols - 1; e.dir = -1; }
    else if(e.pos <= 0){ e.pos = 0; e.dir = 1; }
  });
}
function _hackFwColision(){
  const m = _hackMini;
  return m.escaneres.some(e => e.fila === m.py && e.pos === m.px);
}
function _hackFwResolverTurno(){
  const m = _hackMini;
  _hackFwTickEscaneres();
  if(_hackFwColision()){
    _hackFX('inv_fallo', 0.5);
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return true; // terminó
  }
  if(m.py === 0){
    _hackFX('inv_acierto', 0.6);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return true;
  }
  return false;
}
function hackFwMover(d){
  const m = _hackMini;
  const nx = m.px + d;
  if(nx < 0 || nx >= m.cols) return;
  m.px = nx;
  if(_hackFwResolverTurno()) return;
  _miniCortafuegos();
}
function hackFwEsperar(){
  if(_hackFwResolverTurno()) return;
  _miniCortafuegos();
}
function hackFwAvanzar(){
  const m = _hackMini;
  if(m.py > 0) m.py--;
  if(_hackFwResolverTurno()) return;
  _miniCortafuegos();
}

// ── MINIJUEGO 7: INGENIERÍA SOCIAL ──────────────────────────
// Diálogo por turnos manteniendo una identidad falsa. Cada turno tiene
// una opción buena; las malas suben la sospecha. Demasiada sospecha = fallo.
function _miniSocial(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    _hackMini = { turno: 0, sospecha: 0, maxSospecha: 2, chat: [], ultimaResp: null };
    // primer mensaje del NPC
    const t0 = cfg.turnos[0];
    _hackMini.chat.push({ quien:'npc', txt: t0.npc });
  }
  const m = _hackMini;
  const cfgTurno = cfg.turnos[m.turno];
  let html = _hackHud('INGENIERÍA SOCIAL · sospecha ' + m.sospecha + '/' + m.maxSospecha);
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  // hilo de chat
  html += '<div class="hack-chat">';
  m.chat.forEach(l => {
    const cls = l.quien === 'tu' ? 'hack-msg hack-msg-tu' : 'hack-msg hack-msg-cli';
    html += '<div class="' + cls + '">' + l.txt + '</div>';
  });
  html += '</div>';
  // opciones del turno actual
  if(cfgTurno){
    html += '<div class="hack-social-ops">';
    cfgTurno.opciones.forEach((op, i) => {
      html += '<button class="btn-terminal hack-social-op" onclick="hackSocialResponder(' + i + ')">' + op.txt + '</button>';
    });
    html += '</div>';
  }
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← CORTAR EL CANAL</button>';
  cont.innerHTML = html;
}
function hackSocialResponder(i){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const cfgTurno = cfg.turnos[m.turno];
  const op = cfgTurno.opciones[i];
  if(!op) return;
  // añadir tu mensaje y la respuesta del NPC
  m.chat.push({ quien:'tu', txt: op.txt.replace(/^"|"$/g, '') });
  m.chat.push({ quien:'npc', txt: op.msg });
  if(!op.bueno){
    m.sospecha++;
    _hackFX('inv_fallo', 0.35);
    if(m.sospecha > m.maxSospecha){
      _hackIntrusionOk = false;
      _hackFase = 'resultado';
      _pintarFaseHack();
      return;
    }
    // se queda en el mismo turno para reintentar con otra respuesta
    _miniSocial();
    return;
  }
  // acierto: avanza de turno
  _hackFX('inv_acierto', 0.4);
  m.turno++;
  if(m.turno >= cfg.turnos.length){
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  // añadir el mensaje del siguiente NPC
  m.chat.push({ quien:'npc', txt: cfg.turnos[m.turno].npc });
  _miniSocial();
}

// ── MINIJUEGO 8: ESCANEO DE VULNERABILIDADES ────────────────
// Mapa de nodos por capas. El jugador escoge nodos sumando detección.
// Para ganar: alcanzar el nodo objetivo (capa máx) sin pasar el límite
// de detección, habiendo tocado al menos un nodo de cada capa intermedia.
function _miniVulnerabilidades(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    _hackMini = { elegidos: [], deteccion: 0 };
    // el nodo de entrada (capa 0) ya está seleccionado de base
    const entrada = (cfg.nodos || []).find(n => n.capa === 0);
    if(entrada){ _hackMini.elegidos.push(entrada.id); }
  }
  const m = _hackMini;
  const capaMax = Math.max.apply(null, cfg.nodos.map(n => n.capa));
  const det = m.deteccion;
  const lim = cfg.limiteDeteccion || 100;
  const pct = Math.min(100, Math.round((det / lim) * 100));

  let html = _hackHud('ESCANEO · detección ' + det + '/' + lim);
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  // barra de detección
  html += '<div class="hack-det-bar"><div class="hack-det-fill" style="width:' + pct + '%;"></div></div>';
  // nodos agrupados por capa
  for(let capa = 0; capa <= capaMax; capa++){
    const enCapa = cfg.nodos.filter(n => n.capa === capa);
    let etqCapa = capa === 0 ? 'ENTRADA' : (capa === capaMax ? 'OBJETIVO' : 'CAPA ' + capa);
    html += '<div class="hack-pistas-tit" style="margin-top:.3rem;">' + etqCapa + '</div>';
    html += '<div class="hack-nodos">';
    enCapa.forEach(n => {
      const elegido = m.elegidos.indexOf(n.id) !== -1;
      let cls = 'hack-nodo';
      if(elegido) cls += ' hack-nodo-on';
      if(n.objetivo) cls += ' hack-nodo-obj';
      if(n.seguro) cls += ' hack-nodo-seguro';
      const signo = n.det > 0 ? '+' + n.det : (n.det < 0 ? n.det : '0');
      html += '<div class="' + cls + '" onclick="hackElegirNodo(\'' + n.id + '\')">'
        + '<span class="hack-nodo-etq">' + n.etq + '</span>'
        + '<span class="hack-nodo-det">det ' + signo + '</span></div>';
    });
    html += '</div>';
  }
  html += '<div class="hack-mini-desc" style="opacity:.6;">Toca nodos para trazar la ruta. Alcanza el objetivo pasando por cada capa sin reventar la detección.</div>';
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}

function hackElegirNodo(id){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const nodo = cfg.nodos.find(n => n.id === id);
  if(!nodo || nodo.capa === 0) return; // la entrada no se toca
  const yaElegido = m.elegidos.indexOf(id) !== -1;
  if(yaElegido){
    // deseleccionar (solo si no es el objetivo ya confirmado)
    m.elegidos = m.elegidos.filter(x => x !== id);
    m.deteccion -= nodo.det;
    if(m.deteccion < 0) m.deteccion = 0;
    _hackFX('inv_papel', 0.2);
    _miniVulnerabilidades();
    return;
  }
  // seleccionar
  m.elegidos.push(id);
  m.deteccion += nodo.det;
  _hackFX('inv_papel', 0.3);

  const lim = cfg.limiteDeteccion || 100;
  if(m.deteccion > lim){
    _hackFX('inv_fallo', 0.5);
    _hackIntrusionOk = false;
    _hackFase = 'resultado';
    _pintarFaseHack();
    return;
  }
  // ¿es el objetivo? comprobar que se ha pasado por cada capa intermedia
  if(nodo.objetivo){
    const capaMax = nodo.capa;
    let cubreCapas = true;
    for(let capa = 1; capa < capaMax; capa++){
      const tocado = cfg.nodos.some(n => n.capa === capa && m.elegidos.indexOf(n.id) !== -1);
      if(!tocado){ cubreCapas = false; break; }
    }
    if(!cubreCapas){
      // saltó capas: ruta inválida, se considera detectado por el salto brusco
      _hackFX('inv_fallo', 0.5);
      _hackIntrusionOk = false;
      _hackFase = 'resultado';
      _pintarFaseHack();
      return;
    }
    _hackFX('inv_acierto', 0.6);
    _hackIntrusionOk = true;
    _irAFaseTrasIntrusion();
    return;
  }
  _miniVulnerabilidades();
}

// ── MINIJUEGO 9: ENSAMBLADOR DE MALWARE ─────────────────────
// Elige módulos (ranuras limitadas) para alcanzar umbrales de stats.
function _miniMalware(){
  const cont = document.getElementById('hack-wrap');
  if(!cont) return;
  const cfg = _hackContrato.intrusion;
  if(!_hackMini){
    _hackMini = { elegidos: [], ranuras: cfg.ranuras || 3 };
  }
  const m = _hackMini;
  // calcular stats acumulados
  const stats = { sigilo:0, persistencia:0, deteccion:0, potencia:0 };
  m.elegidos.forEach(id => {
    const mod = cfg.modulos.find(x => x.id === id);
    if(mod){
      stats.sigilo += mod.sigilo || 0;
      stats.persistencia += mod.persistencia || 0;
      stats.deteccion += mod.deteccion || 0;
      stats.potencia += mod.potencia || 0;
    }
  });
  let html = _hackHud('ENSAMBLADOR · ' + m.elegidos.length + '/' + m.ranuras + ' módulos');
  html += '<div class="hack-mini">';
  html += '<div class="hack-mini-desc">' + (cfg.desc || '') + '</div>';
  // panel de stats vs meta
  const meta = cfg.meta || {};
  html += '<div class="hack-stats">';
  html += _hackStatRow('SIGILO', stats.sigilo, meta.sigilo, false);
  html += _hackStatRow('PERSISTENCIA', stats.persistencia, meta.persistencia, false);
  html += _hackStatRow('DETECCIÓN', stats.deteccion, meta.deteccionMax, true);
  html += '</div>';
  // módulos
  html += '<div class="hack-mods">';
  cfg.modulos.forEach(mod => {
    const elegido = m.elegidos.indexOf(mod.id) !== -1;
    const lleno = m.elegidos.length >= m.ranuras && !elegido;
    let cls = 'hack-mod';
    if(elegido) cls += ' hack-mod-on';
    if(lleno) cls += ' hack-mod-lleno';
    const s = v => (v > 0 ? '+' + v : '' + v);
    html += '<div class="' + cls + '" onclick="hackElegirModulo(\'' + mod.id + '\')">'
      + '<div class="hack-mod-top"><span class="hack-mod-etq">' + mod.etq + '</span>'
      + (elegido ? '<span class="hack-mod-check">✓</span>' : '') + '</div>'
      + '<div class="hack-mod-desc">' + mod.desc + '</div>'
      + '<div class="hack-mod-stats">sig ' + s(mod.sigilo) + ' · per ' + s(mod.persistencia)
      + ' · det ' + s(mod.deteccion) + '</div></div>';
  });
  html += '</div>';
  html += '<button class="btn-terminal" onclick="hackConfirmarMalware()">COMPILAR E INYECTAR →</button>';
  html += '</div>';
  html += '<button class="btn-terminal casos-salir" onclick="hackAbandonar()">← ABANDONAR EL CONTRATO</button>';
  cont.innerHTML = html;
}
function _hackStatRow(etq, val, meta, esMax){
  let ok;
  if(esMax) ok = (val <= (meta != null ? meta : 999));
  else ok = (val >= (meta != null ? meta : 0));
  const cls = ok ? 'hack-stat-ok' : 'hack-stat-no';
  const objetivo = esMax ? ('≤ ' + meta) : ('≥ ' + meta);
  return '<div class="hack-stat ' + cls + '"><span class="hack-stat-etq">' + etq + '</span>'
    + '<span class="hack-stat-val">' + val + '</span>'
    + '<span class="hack-stat-meta">' + objetivo + '</span></div>';
}
function hackElegirModulo(id){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const idx = m.elegidos.indexOf(id);
  if(idx !== -1){
    m.elegidos.splice(idx, 1);
    _hackFX('inv_papel', 0.2);
  } else {
    if(m.elegidos.length >= m.ranuras) return; // sin ranuras
    m.elegidos.push(id);
    _hackFX('inv_papel', 0.3);
  }
  _miniMalware();
}
function hackConfirmarMalware(){
  const cfg = _hackContrato.intrusion;
  const m = _hackMini;
  const meta = cfg.meta || {};
  const stats = { sigilo:0, persistencia:0, deteccion:0 };
  m.elegidos.forEach(id => {
    const mod = cfg.modulos.find(x => x.id === id);
    if(mod){
      stats.sigilo += mod.sigilo || 0;
      stats.persistencia += mod.persistencia || 0;
      stats.deteccion += mod.deteccion || 0;
    }
  });
  const ok = stats.sigilo >= (meta.sigilo || 0)
          && stats.persistencia >= (meta.persistencia || 0)
          && stats.deteccion <= (meta.deteccionMax != null ? meta.deteccionMax : 999);
  _hackIntrusionOk = !!ok;
  _hackFX(ok ? 'inv_acierto' : 'inv_fallo', 0.55);
  if(ok){ _irAFaseTrasIntrusion(); }
  else { _hackFase = 'resultado'; _pintarFaseHack(); }
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
  window.hackElegirLog = hackElegirLog;
  window.hackAnadirBloque = hackAnadirBloque;
  window.hackQuitarBloque = hackQuitarBloque;
  window.hackConfirmarReconstruccion = hackConfirmarReconstruccion;
  window.hackFwMover = hackFwMover;
  window.hackFwEsperar = hackFwEsperar;
  window.hackFwAvanzar = hackFwAvanzar;
  window.hackSocialResponder = hackSocialResponder;
  window.hackElegirNodo = hackElegirNodo;
  window.hackElegirModulo = hackElegirModulo;
  window.hackConfirmarMalware = hackConfirmarMalware;
  window.hackMarcarLog = hackMarcarLog;
  window.hackConfirmarRastros = hackConfirmarRastros;
  window.hackAbandonar = hackAbandonar;
  window.hackCerrarResuelto = hackCerrarResuelto;
  window.cerrarRedHacker = cerrarRedHacker;
}
