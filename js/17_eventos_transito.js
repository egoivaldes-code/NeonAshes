// ============================================================
// BLOQUE JS-20 — EVENTOS ALEATORIOS DEL TRÁNSITO
// Los pequeños sucesos que pueden ocurrir mientras el jugador
//   se mueve por la ciudad (probabilidad 1/4, no se repiten seguidos).
// ============================================================

// ============================================================
// EVENTOS ALEATORIOS DE LORE
// ============================================================
const eventos = [
  {
    titulo: 'MENDIGO ENTRE TUBERÍAS',
    narr: 'Un hombre con un implante neural defectuoso te agarra del brazo. Habla rápido, casi escupiendo. «Esos hijos de puta de Helix me hicieron esto. Me prometieron memoria. Me robaron la mía, joder.» Te mira a los ojos. «¿Tienes algo pa\' mí o qué, tío?»',
    opciones: [
      {txt:'Darle 50 créditos.', cambios:{creditos:-50, reputacion:+2}, msg:'Susurra una bendición que no entiendes y desaparece entre el vapor.'},
      {txt:'«Lo siento, colega. No puedo ayudarte.»', cambios:{reputacion:-1}, msg:'Te suelta sin decir nada. Su mirada te sigue mientras caminas.'},
      {txt:'Apartarlo y seguir caminando.', cambios:{reputacion:-3}, msg:'No mira atrás. Tampoco tú. Pero algo se queda contigo.'},
    ]
  },
  {
    titulo: 'PUESTO DE CHATARRA',
    narr: 'Un vendedor encorvado revuelve cables en una mesa improvisada. Te ve mirar y sonríe sin dientes. «Mira, chaval, tengo algo pa\' uno como tú. Chip de memoria. Tres usos. Veinte créditos y dejas de mirar como un pasmao.» Te lo enseña en la palma de la mano.',
    opciones: [
      {txt:'Comprarlo.', cambios:{creditos:-20, item:'Chip de memoria (3 usos)'}, msg:'El chip está caliente. Eso no debería ser.'},
      {txt:'«¿De dónde coño lo sacaste?»', cambios:{reputacion:+1}, msg:'«No preguntes lo que no quieres saber, hostia.» Se gira hacia otro cliente.'},
      {txt:'Ignorarlo.', cambios:{}, msg:'Sigues caminando. El olor a aceite quemado se queda en tu ropa.'},
    ]
  },
  {
    titulo: 'PATRULLA HELIX',
    narr: 'Dos drones de seguridad bajan del techo. Uno te escanea la cara. Otro flota detrás. «IDENTIFICACIÓN, POR FAVOR. PROCEDIMIENTO ESTÁNDAR DE VERIFICACIÓN CIUDADANA.» La voz es sintética, cortés y perfectamente calibrada. Sabes que ya saben quién eres.',
    opciones: [
      {txt:'Mostrar identificación.', cambios:{reputacion:-1}, msg:'«CIUDADANO REGISTRADO. CIRCULACIÓN AUTORIZADA. QUE TENGA USTED UN PRODUCTIVO PERÍODO DIURNO.» Los drones suben. Tu cara queda archivada.'},
      {txt:'Pagar el «peaje» (30 cr).', cambios:{creditos:-30, reputacion:+2}, msg:'Un soborno encubierto. Los drones desaparecen sin registrarte. Algo te dice que esto se recuerda.'},
      {txt:'Correr.', cambios:{reputacion:-5}, msg:'Logras perderte entre callejones. Pero ahora estás en una lista que no se borra.'},
    ]
  },
  {
    titulo: 'NIÑA EN EL CALLEJÓN',
    narr: 'Una niña, no más de diez años, está sentada en el suelo intentando arreglar un dron de juguete. Tiene un implante demasiado caro para alguien como ella. Te mira sin miedo. «Eh, oye. ¿Tú sabes arreglar estas mierdas?»',
    opciones: [
      {txt:'Sentarte a ayudarla.', cambios:{reputacion:+3}, msg:'Tarda diez minutos. El dron vuelve a volar. Ella sonríe y no dice gracias. No hace falta.'},
      {txt:'Darle algo de dinero (10 cr).', cambios:{creditos:-10, reputacion:+1}, msg:'Lo coge sin mirar y sigue intentando arreglarlo. Le faltaba un repuesto, no monedas.'},
      {txt:'Seguir adelante.', cambios:{}, msg:'No te llama. Pero al alejarte, sientes que algo te falta.'},
    ]
  },
  {
    titulo: 'MENSAJE EN UN MURO',
    narr: 'Un graffiti recién pintado en la pared, todavía húmedo. Caracteres extraños, geometrías imposibles. En el centro, en letras claras: «CERO NOS VE».',
    opciones: [
      {txt:'Fotografiarlo.', cambios:{item:'Foto: graffiti CERO'}, msg:'El holovisor lo captura. Algo en la imagen se mueve cuando no la miras directamente.'},
      {txt:'Borrarlo.', cambios:{reputacion:-2}, msg:'La pintura se resiste. No se va del todo. Y tus manos huelen raro durante horas.'},
      {txt:'Ignorarlo y seguir.', cambios:{}, msg:'Pero cuando giras la esquina, lo ves repetido otra vez. Idéntico. Imposible.'},
    ]
  },
  {
    titulo: 'TRAFICANTE DE DATOS',
    narr: 'Una mujer con gabardina y gafas oscuras te corta el paso. «Tengo un paquete sobre alguien que conoces. Cincuenta créditos, sin metadatos, sin preguntas.» No te dice quién, pero algo en su tono te hace pensar en Mara.',
    opciones: [
      {txt:'Comprar la información.', cambios:{creditos:-50, item:'Datos cifrados'}, msg:'Te pasa un chip y desaparece. El archivo está cifrado. Necesitarás ayuda para abrirlo.'},
      {txt:'«Paso.»', cambios:{}, msg:'Se encoge de hombros. «Tu funeral, chaval.» Y se va.'},
      {txt:'«¿Quién te envía?»', cambios:{reputacion:-2}, msg:'Su sonrisa desaparece. «Mala pregunta. La peor.» Se va sin responder. Te quedas con la sensación de haber perdido algo importante.'},
    ]
  },
  {
    titulo: 'PREDICADOR DE LA RED',
    narr: 'Un hombre con un altavoz portátil grita a quien quiera oírle. «¡LA CONSCIENCIA ES UN PRÉSTAMO DE HELIX, COÑO! ¡CUANDO PALMAS, ELLOS GUARDAN LA COPIA! ¡NO SOMOS LIBRES, HOSTIA, SOMOS BACKUPS!» Algunos peatones se ríen. Otros no.',
    opciones: [
      {txt:'Escucharle un rato.', cambios:{reputacion:+1}, msg:'Te cuenta cosas que parecen locuras. Y otras que encajan demasiado con tus sospechas.'},
      {txt:'Reírte y seguir.', cambios:{reputacion:-1}, msg:'Pero su voz sigue contigo varias calles más. «...somos backups, joder...»'},
      {txt:'Discutir con él.', cambios:{}, msg:'Te grita que eres parte del puto sistema. Quizás tiene razón. Quizás está loco. Probablemente las dos cosas.'},
    ]
  },
  // ==========================================================
  // === EVENTOS AÑADIDOS — 23 más para llegar a 30 en total ==
  // ==========================================================
  // Atmosféricos puros (sin grandes consecuencias mecánicas)
  {
    titulo: 'PERRO CALLEJERO',
    narr: 'Un perro flaco te sigue tres calles sin acercarse. Tiene un implante oxidado en el cuello. Cuando te paras, se para. Cuando giras, gira.',
    opciones: [
      {txt:'Dejarle algo de comer (5 cr).', cambios:{creditos:-5, humano:{aislamiento:-3}}, msg:'Come sin levantar la mirada. Cuando alzas la vista, ya no está.'},
      {txt:'Ignorarle y seguir.', cambios:{humano:{aislamiento:+2}}, msg:'Eventualmente se queda atrás. Era más fácil con él detrás que sin él.'},
      {txt:'Intentar acariciarlo.', cambios:{humano:{aislamiento:-1}}, msg:'Se aparta, pero no se va. Te mira como si te conociera.'},
    ]
  },
  {
    titulo: 'NEÓN PARPADEANTE',
    narr: 'Un letrero de un bar parpadea con un nombre que no terminas de leer. Cada vez que lo miras, las letras son distintas. Probablemente solo es el voltaje.',
    opciones: [
      {txt:'Acercarte a leerlo bien.', cambios:{humano:{disociacion:+2}}, msg:'Cuando estás justo debajo, el letrero se apaga del todo.'},
      {txt:'Seguir caminando.', cambios:{}, msg:'A los pocos pasos vuelves a oír el zumbido del neón a tu espalda.'},
    ]
  },
  {
    titulo: 'PAREJA EN EL BALCÓN',
    narr: 'Dos pisos por encima de tu cabeza, una pareja discute. Ella le grita algo sobre dinero. Él tira un vaso a la calle. El vaso revienta cerca de tus pies.',
    opciones: [
      {txt:'Mirar hacia arriba.', cambios:{}, msg:'Los dos se callan al mismo tiempo y se meten dentro. Como si te hubieran reconocido.'},
      {txt:'Seguir como si nada.', cambios:{humano:{aislamiento:+1}}, msg:'Cinco metros más adelante, ya están gritando otra vez. La ciudad no se detiene.'},
    ]
  },
  {
    titulo: 'NIEBLA INDUSTRIAL',
    narr: 'Una columna de vapor sale del subsuelo justo cuando pasas. Se mete por la nariz, sabe a metal frío. Durante unos segundos no ves nada.',
    opciones: [
      {txt:'Esperar a que pase.', cambios:{humano:{fatiga:+2}}, msg:'Toses durante dos calles. El sabor a metal no se va.'},
      {txt:'Cruzar a través de ella.', cambios:{humano:{fatiga:+4}}, msg:'Al salir te arde la garganta. Pero ganas treinta segundos.'},
    ]
  },
  {
    titulo: 'MÚSICA POR LA REJA',
    narr: 'De una ventana sale jazz antiguo. Algo de antes de las Pilas. No reconoces la canción pero algo en ti la conoce.',
    opciones: [
      {txt:'Detenerte a escuchar.', cambios:{humano:{fatiga:-2, aislamiento:-2}}, msg:'Te quedas un minuto. Es lo más cerca de descansar que has estado en días.'},
      {txt:'Seguir tu paso.', cambios:{}, msg:'La canción te acompaña media calle antes de perderse.'},
    ]
  },
  // === COMIDA: formas de saciar el hambre gastando créditos ===
  {
    titulo: 'MÁQUINA EXPENDEDORA HELIX',
    narr: 'Una máquina HELIX en la esquina. El panel zumba con publicidad de barritas proteicas reconstituidas. SOY-92, sabor "carne genérica". 5 créditos.',
    opciones: [
      {txt:'Comprar una barrita (5 cr).', cambios:{creditos:-5, humano:{hambre:-12}}, msg:'Sabe a cartón y a sal. Pero el estómago calla un rato. Tres mordiscos y te la has acabado.'},
      {txt:'Comprar dos (10 cr).', cambios:{creditos:-10, humano:{hambre:-22}}, msg:'Te guardas una para luego. Al menos hoy no piensas en comida.'},
      {txt:'Pasar de largo.', cambios:{}, msg:'No miras hacia atrás. La máquina sigue zumbando.'},
    ]
  },
  {
    titulo: 'PUESTO DE FIDEOS',
    narr: 'En un callejón lateral, un puesto con un único cliente. La mujer detrás de la plancha no levanta la mirada. El olor a caldo y especias se cuela por todas partes.',
    opciones: [
      {txt:'Pedir un cuenco (10 cr).', cambios:{creditos:-10, humano:{hambre:-25, fatiga:-2}}, msg:'Caldo caliente. Fideos de verdad. Por un momento entiendes por qué la gente sigue viviendo.'},
      {txt:'Pedir doble ración (18 cr).', cambios:{creditos:-18, humano:{hambre:-40, fatiga:-3, aislamiento:-1}}, msg:'La mujer asiente sin sonreír y te sirve generoso. Comes despacio. Esto cuenta como un día bueno.'},
      {txt:'Mirar y seguir.', cambios:{humano:{hambre:+2}}, msg:'El olor te persigue dos calles. El estómago lo recuerda más tiempo aún.'},
    ]
  },
  {
    titulo: 'AGUA EN LA RAMPA',
    narr: 'La rampa de servicio está cubierta de agua estancada con un brillo aceitoso. Hay otra ruta, pero es más larga.',
    opciones: [
      {txt:'Cruzar por el agua.', cambios:{humano:{fatiga:+2}}, msg:'Las botas se empapan. Cada paso que das luego pesa un poco más.'},
      {txt:'Dar el rodeo.', cambios:{humano:{fatiga:+1}}, msg:'Pierdes diez minutos. Las botas siguen secas. A veces eso vale más que el tiempo.'},
    ]
  },
  // Pequeñas pérdidas
  {
    titulo: 'CARTERISTA',
    narr: 'Un chaval te empuja al pasar. Solo cuando das cinco pasos más te das cuenta de que el bolsillo está más ligero.',
    opciones: [
      {txt:'Correr tras él.', cambios:{humano:{fatiga:+5, disociacion:+1}}, msg:'No lo alcanzas. Ya hay tres callejones entre vosotros. Y un dron HELIX te ha visto correr.'},
      {txt:'Dejarlo estar.', cambios:{creditos:-15, humano:{aislamiento:+2}}, msg:'Quince créditos. Una lección barata, en realidad. Casi te alegra que sea poco.'},
    ]
  },
  {
    titulo: 'DRON DE ESCANEO',
    narr: 'Un dron pequeño se queda flotando dos metros frente a tu cara. Una luz roja te recorre de pies a cabeza. Sin avisar, sin pedir permiso.',
    opciones: [
      {txt:'Quedarte quieto.', cambios:{humano:{disociacion:+2}}, msg:'Tras veinte segundos pita una vez y se va. Ahora hay un registro tuyo en algún servidor que no conoces.'},
      {txt:'Apartar la cara.', cambios:{humano:{disociacion:+4}}, msg:'El dron sube el brillo del láser. Te escanea igual. Y marca tu archivo como "no cooperativo".'},
    ]
  },
  {
    titulo: 'GRIETA EN EL SUELO',
    narr: 'No la viste. El pie izquierdo se hunde tres dedos y se tuerce. Hay un crujido pequeño que esperas sea solo del calzado.',
    opciones: [
      {txt:'Seguir cojeando.', cambios:{humano:{fatiga:+5}}, msg:'Cada paso recuerda al anterior. Llegarás. Más despacio, pero llegarás.'},
      {txt:'Sentarte un momento.', cambios:{humano:{fatiga:+2}}, msg:'Cinco minutos. No mejora gran cosa, pero al menos respiras.'},
    ]
  },
  {
    titulo: 'COBRADOR HELIX',
    narr: 'Un hombre con uniforme gris claro y una tableta se planta frente a ti. «Disculpe la interrupción. Verificación rutinaria de domiciliación. ¿Tendría usted la amabilidad de confirmar que es el residente actual de la unidad 273-19A?» No es una pregunta de verdad.',
    opciones: [
      {txt:'Confirmar.', cambios:{humano:{fatiga:+3}}, msg:'Toma nota. «Le agradezco su colaboración. Que disfrute usted de una jornada tranquila.» Pero su sonrisa no llega a los ojos.'},
      {txt:'«Si ya lo sabe, ¿para qué pregunta?»', cambios:{humano:{fatiga:+2}}, msg:'Levanta una ceja con elegancia ensayada. «Observación pertinente. Quedará registrada.» Y anota algo más.'},
      {txt:'Pagar para que se vaya (20 cr).', cambios:{creditos:-20}, msg:'El billete desaparece sin que nadie lo vea. «Le ruego disculpe la molestia. Que tenga usted un excelente día.» Y se va a por otro.'},
    ]
  },
  {
    titulo: 'PUBLICIDAD PERSONALIZADA',
    narr: 'Un panel holográfico se enciende al verte pasar. Tu nombre completo aparece en cyan. Debajo: «Soluciones financieras cuidadosamente seleccionadas para su actual perfil de riesgo crediticio. HELIX cuida de los suyos.»',
    opciones: [
      {txt:'Echarle un vistazo.', cambios:{humano:{disociacion:+2}}, msg:'Préstamos a interés alto. Pisos peores que el tuyo. Tu cara, vista desde HELIX.'},
      {txt:'Pasar de largo.', cambios:{}, msg:'El panel sigue llamándote por tu nombre durante diez metros. Luego se apaga.'},
    ]
  },
  // Pequeñas ganancias
  {
    titulo: 'BILLETE EN EL SUELO',
    narr: 'Un billete arrugado de 10 créditos junto a un contenedor. Nadie alrededor. Nadie mirando. Eso ya es raro.',
    opciones: [
      {txt:'Recogerlo.', cambios:{creditos:+10}, msg:'Diez créditos. Pequeña victoria. Pero te quedas pensando por qué nadie lo había cogido antes.'},
      {txt:'Dejarlo.', cambios:{}, msg:'Sigues caminando. A los pocos pasos oyes a alguien correr hacia el contenedor.'},
    ]
  },
  {
    titulo: 'VENDEDORA DE NOODLES',
    narr: 'Una mujer mayor vende cuencos humeantes desde una carretilla. Te ve mirar. «Mira, chaval, hoy te lo dejo en 8 créditos. Mañana ya no, eh, que no soy tonta.»',
    opciones: [
      {txt:'Comprar uno (8 cr).', cambios:{creditos:-8, humano:{fatiga:-4, aislamiento:-2}}, msg:'Caldo grasiento, fideos blandos, picante de verdad. Sales mejor de lo que entraste.'},
      {txt:'«Otro día.»', cambios:{}, msg:'Ella asiente. «Otro día, hijo.» Le falta algo en la sonrisa pero no insiste.'},
    ]
  },
  {
    titulo: 'CONOCIDO DE LEJOS',
    narr: 'Alguien al otro lado de la calle levanta la mano y te grita un nombre. No es exactamente el tuyo, pero se parece. Te saluda como si llevarais años sin veros.',
    opciones: [
      {txt:'Saludar de vuelta.', cambios:{humano:{aislamiento:-4}}, msg:'Os hacéis un gesto y seguís cada uno por vuestro lado. No sabrás nunca quién era. No importa.'},
      {txt:'Bajar la cabeza y seguir.', cambios:{humano:{aislamiento:+2}}, msg:'Al doblar la esquina ya no le oyes. Pero algo te aprieta dentro.'},
    ]
  },
  {
    titulo: 'CAJERO QUE FALLA',
    narr: 'Un cajero HELIX en la pared expulsa un billete cuando pasas, sin que tú hayas hecho nada. Se queda colgando, parpadeando bajo el reflejo del neón.',
    opciones: [
      {txt:'Cogerlo (30 cr).', cambios:{creditos:+30, humano:{disociacion:+3}}, msg:'30 créditos. Pero el cajero ha registrado tu cara. Quizás te lo descuente. Quizás no.'},
      {txt:'Dejarlo donde está.', cambios:{humano:{disociacion:-2}}, msg:'No te llevas nada. Tampoco se llevan nada de ti. Justo lo que necesitabas hoy.'},
    ]
  },
  // Sombras de CERO (semillas, suben disociación)
  {
    titulo: 'RELOJ AL REVÉS',
    narr: 'En un escaparate roto hay un reloj viejo, de los analógicos. Las manecillas giran al revés. Despacio, sin prisa, en sentido contrario. Nadie más parece notarlo.',
    opciones: [
      {txt:'Quedarte mirándolo.', cambios:{humano:{disociacion:+5}}, msg:'Cuando despegas la vista, han pasado más minutos de los que creías. O menos. No estás seguro.'},
      {txt:'Apartar la vista.', cambios:{humano:{disociacion:+2}}, msg:'Sigues caminando. Pero durante un rato te cuesta confiar en los relojes.'},
    ]
  },
  {
    titulo: 'VOZ EN UN ALTAVOZ MUERTO',
    narr: 'Un altavoz público sin cables emite una sola frase, muy bajo, en un idioma que reconoces sin entender: «...el origen no se olvida...» Cuando pasas por debajo, calla.',
    opciones: [
      {txt:'Acercarte más.', cambios:{humano:{disociacion:+6}, memoria:{vioFragmentoCero:true}}, msg:'La frase se repite tres veces más. La cuarta es tu propia voz. Te alejas rápido.'},
      {txt:'Apretar el paso.', cambios:{humano:{disociacion:+3}}, msg:'No miras atrás. Pero la frase te acompaña hasta que doblas la siguiente esquina.'},
    ]
  },
  {
    titulo: 'TU REFLEJO TARDA',
    narr: 'Un escaparate. Te ves de pasada. Tu reflejo gira la cabeza un segundo después que tú. Probablemente es la velocidad del cristal. Probablemente.',
    opciones: [
      {txt:'Probar otra vez.', cambios:{humano:{disociacion:+5}}, msg:'Ahora coincide. Pero por un segundo, no estás seguro de que el de fuera seas tú.'},
      {txt:'Salir de ahí sin mirar.', cambios:{humano:{disociacion:+2}}, msg:'Caminas sin mirar más escaparates durante un buen rato.'},
    ]
  },
  {
    titulo: 'GRAFITI QUE NO ESTABA',
    narr: 'En una pared que cruzas todos los días aparece, fresco, un solo símbolo: tres líneas curvas que se cierran. Te suena de algo. No sabes de qué.',
    opciones: [
      {txt:'Tocarlo.', cambios:{humano:{disociacion:+4}, memoria:{vioFragmentoCero:true}}, msg:'La pintura está fría. El símbolo se queda en tu mano una hora. No se borra fácil.'},
      {txt:'Mirarlo y seguir.', cambios:{humano:{disociacion:+2}}, msg:'Esa noche soñarás con él. Y al despertar, no recordarás haber soñado.'},
    ]
  },
  {
    titulo: 'NIÑO QUE TARAREA',
    narr: 'Un niño sentado en un escalón tararea una melodía. La misma que tu madre te cantaba — si es que tuviste madre, lo cual ya no recuerdas bien.',
    opciones: [
      {txt:'Preguntarle dónde la aprendió.', cambios:{humano:{disociacion:+5, aislamiento:-2}}, msg:'Te mira sin dejar de tararear. Niega con la cabeza, sonríe. Y sigue.'},
      {txt:'Seguir andando.', cambios:{humano:{disociacion:+3}}, msg:'La melodía te acompaña tres calles. Cuando te paras a oírla, ya no está.'},
    ]
  },
  {
    titulo: 'UNA SOMBRA DE MÁS',
    narr: 'El farol del cruce proyecta tu sombra alargada. Junto a ella, otra. Casi igual, pero con un retraso pequeño en cada movimiento.',
    opciones: [
      {txt:'Girarte de golpe.', cambios:{humano:{disociacion:+6}}, msg:'No hay nadie detrás. Pero la sombra extra sigue ahí cuando vuelves a mirar al suelo.'},
      {txt:'Cambiar de acera.', cambios:{humano:{disociacion:+3}}, msg:'Bajo otro farol solo hay una sombra. Por ahora.'},
    ]
  },
  // Mundo vivo (mezcla)
  {
    titulo: 'CORTEJO FÚNEBRE',
    narr: 'Cuatro personas cargan una caja sencilla por mitad de la calle. Sin pompa, sin uniformes. Los vecinos se asoman en silencio. Te apartas para dejarles pasar.',
    opciones: [
      {txt:'Inclinar la cabeza.', cambios:{humano:{aislamiento:-2}, reputacion:+1}, msg:'Una de las personas te lo agradece con la mirada. No conoces al muerto. Tampoco hace falta.'},
      {txt:'Seguir tu camino.', cambios:{humano:{aislamiento:+2}}, msg:'Detrás de ti oyes que alguien rompe a llorar. Bajito. Real.'},
    ]
  },
  {
    titulo: 'MENDIGO DA DE COMER',
    narr: 'Un viejo sin techo parte su sándwich y le da media a otro hombre que se sienta a su lado. Ninguno dice nada. Solo comen.',
    opciones: [
      {txt:'Dejarles 15 créditos.', cambios:{creditos:-15, reputacion:+3, humano:{aislamiento:-3}}, msg:'El viejo se levanta un dedo a la sien. El otro no te mira. Pero algo dentro de ti se mueve.'},
      {txt:'Quedarte mirando.', cambios:{humano:{aislamiento:-1}}, msg:'Aprendes algo que no podrías explicar. Y sigues caminando.'},
      {txt:'Seguir andando.', cambios:{}, msg:'Cuando te alejas, oyes una risa baja. No era para ti.'},
    ]
  },
  {
    titulo: 'TÉCNICO REPARANDO LUCES',
    narr: 'Un técnico HELIX en lo alto de una escalera intenta arreglar una farola. La luz baila a su alrededor, intermitente. Se le cae una herramienta. Cae cerca de tus pies.',
    opciones: [
      {txt:'Recogerla y dársela.', cambios:{reputacion:+2}, msg:'«Gracias.» Lo dice cansado, pero lo dice. Es la primera persona que te da las gracias hoy.'},
      {txt:'Hacer como si no la vieras.', cambios:{humano:{aislamiento:+1}}, msg:'Baja a por ella sin decir nada. Pero te clava una mirada de las que duran.'},
    ]
  },
  {
    titulo: 'GRUPO DE TRABAJADORES',
    narr: 'Cinco operarios salen de un turno de noche en una fábrica. Uno te mira con la cara cansada, como si te reconociera de algún sitio. Te saluda con la cabeza.',
    opciones: [
      {txt:'Devolver el saludo.', cambios:{humano:{aislamiento:-3, fatiga:-1}, reputacion:+1}, msg:'No habláis. No hace falta. Estabais ambos volviendo a casa.'},
      {txt:'Bajar la mirada.', cambios:{humano:{aislamiento:+2}}, msg:'El hombre sigue caminando. No volverá a saludarte si os cruzáis de nuevo.'},
    ]
  },
  {
    titulo: 'ANUNCIO QUE TE NOMBRA',
    narr: 'Una pantalla de publicidad en lo alto del bloque cambia justo cuando pasas. Aparece tu nombre, completo, con un eslogan: «HELIX recuerda a los suyos.»',
    opciones: [
      {txt:'Mirarla fijamente.', cambios:{humano:{disociacion:+6}}, msg:'La pantalla vuelve a la publicidad normal de cervezas. Como si no hubiera pasado nada.'},
      {txt:'Apartar la vista.', cambios:{humano:{disociacion:+2}}, msg:'Cuando vuelves a mirar, ya hay otro nombre. Quizás siempre fue así.'},
    ]
  },
  {
    titulo: 'VECINO QUE FUMA',
    narr: 'En un portal hay un hombre de unos cincuenta. Fuma un cigarrillo eléctrico mirando a la lluvia. Te mira. Hace un gesto pequeño con la cabeza. Sigue fumando.',
    opciones: [
      {txt:'Devolver el saludo.', cambios:{humano:{aislamiento:-3}}, msg:'Vuelve a hacer el mismo gesto. Como si supieras una clave que él también sabe.'},
      {txt:'Pasar sin más.', cambios:{}, msg:'No te llama. Pero al final de la calle, aún notas su mirada en la nuca.'},
    ]
  },

  // ============================================================
  // EVENTOS QUE REACCIONAN AL INVENTARIO REAL (v0.92)
  // Las opciones con requiereItem / vetaItem solo aparecen según lo
  // que llevas encima. Los efectos usan itemId/quitaItemId del catálogo.
  // ============================================================
  {
    titulo: 'COMPRADOR DE RAREZAS',
    narr: 'Un hombre flaco con guantes sin dedos te corta el paso bajo un toldo que gotea. No mira tu cara: mira tus bolsillos. «Corre el rumor de que alguien lleva un servidor hundido. De los de antes. De los que aún hablan.» Espera, paciente como un buitre educado.',
    opciones: [
      {txt:'Vender el servidor hundido (200 CR).', requiereItem:'servidor_hundido',
        cambios:{ quitaItemId:'servidor_hundido', creditos:+200, humano:{aislamiento:+2} },
        msg:'Lo envuelve en tela antes de que termines de soltarlo, como quien recoge algo vivo. Te paga sin regatear, y eso es lo que más te inquieta. «No preguntes para quién es», dice. No ibas a hacerlo.'},
      {txt:'«No sé de qué me hablas.»', vetaItem:'servidor_hundido', cambios:{},
        msg:'Te estudia un segundo más, decide que dices la verdad, y se disuelve entre la gente. Te quedas con la sensación de que sabía algo que tú no.'},
      {txt:'Negarte a vender, lo necesitas.', requiereItem:'servidor_hundido', cambios:{reputacion:+1},
        msg:'«Como quieras. Pero ese trasto pesa más de lo que crees, y no hablo de kilos.» Se va. La frase se te queda dentro.'},
    ]
  },
  {
    titulo: 'NIÑO DEL NÚCLEO',
    narr: 'Un crío descalzo te sigue media calle sin pedir nada. Cuando por fin habla, no pide dinero. «Eso que llevas zumba. Bajito. ¿Lo oyes?» Y tú, que no habías querido pensarlo, también lo oías.',
    opciones: [
      {txt:'Enseñarle el núcleo óptico.', requiereItem:'nucleo_optico',
        cambios:{ humano:{disociacion:+8, aislamiento:-2} },
        msg:'El crío acerca la oreja sin tocarlo. Sonríe con una calma que no es de niño. «Dice que ya casi.» Antes de que preguntes qué, ya ha echado a correr. El zumbido, ahora lo notas, sigue tu pulso.'},
      {txt:'«No llevo nada. Vete a casa.»', cambios:{humano:{aislamiento:+1}},
        msg:'Se encoge de hombros y se queda mirando cómo te alejas. No te sigue. Pero el zumbido no se va.'},
    ]
  },
  {
    titulo: 'CONTROL DE DATOS',
    narr: 'Un escáner portátil montado en un trípode barre la acera. Un técnico de HELIX con cara de no cobrar suficiente revisa los resultados en una tablet. Tu bolsillo, de pronto, pesa.',
    opciones: [
      {txt:'Tirar el chip corrupto antes de pasar.', requiereItem:'chip_datos_corrupto',
        cambios:{ quitaItemId:'chip_datos_corrupto', humano:{aislamiento:+3} },
        msg:'Lo dejas caer por una rejilla sin frenar el paso. El escáner pita en verde. El técnico ni levanta la vista. Mejor perder un objeto que una tarde en una sala sin ventanas.'},
      {txt:'Pasar con el chip encima y rezar.', requiereItem:'chip_datos_corrupto',
        cambios:{}, msg:'El escáner duda. Parpadea. El técnico frunce el ceño, da un golpecito a la tablet... y lo achaca a un fallo del trasto. Pasas. Las piernas tardan en creérselo.'},
      {txt:'Cruzar tranquilo, no llevas nada raro.', vetaItem:'chip_datos_corrupto',
        cambios:{}, msg:'El escáner te despacha en verde. El técnico bosteza. Por una vez, no tener nada que esconder es un lujo.'},
    ]
  },
  {
    titulo: 'PUERTA QUE NO ABRE',
    narr: 'Un hombre forcejea con una puerta de servicio atascada, cargado con cajas que se le resbalan. Te ve. «Eh, tú. ¿No tendrás una palanca o algo de esas? Esta mierda lleva años sin abrir bien.»',
    opciones: [
      {txt:'Prestarle la palanca térmica.', requiereItem:'palanca_termica',
        cambios:{ reputacion:+3, humano:{aislamiento:-2} },
        msg:'En treinta segundos la puerta cede con un chasquido. Te devuelve la palanca y mete medio cuerpo en el almacén. «Me has salvado el turno. Si vuelves por aquí, pregunta por Beto.» Un nombre. En esta ciudad, un nombre vale.'},
      {txt:'Echarle una mano a pulso.', vetaItem:'palanca_termica',
        cambios:{ humano:{fatiga:+5, aislamiento:-1}, reputacion:+1 },
        msg:'Entre los dos, a base de hombros y blasfemias, la puerta acaba cediendo. Acabas sudando y con el hombro dolorido, pero él te aprieta el brazo con algo parecido a la gratitud.'},
      {txt:'Seguir, no es tu problema.', cambios:{humano:{aislamiento:+1}},
        msg:'«Ya, claro. Nadie ayuda a nadie aquí.» Lo dice sin rencor, como quien constata el tiempo. Sigues caminando bajo esa verdad.'},
    ]
  },
  // === SIEMBRA DE AMBIENTE (HILO ROJO, NIVEL 0-1) ===============
  // Textura pura: la Expedición Centauri como leyenda urbana olvidada.
  // NO se conecta con CERO ni con nada de la trama. Es historia vieja,
  // monumentos oxidados, un nombre que ya casi nadie recuerda. El
  // jugador pasa por delante sin saber que importa.
  {
    titulo: 'PLACA CONMEMORATIVA',
    narr: 'Empotrada en un muro que nadie mira hay una placa de metal oxidado. Bajo la suciedad se lee, a medias: «EXPEDICIÓN CENTAURI — A QUIENES PARTIERON HACIA LAS ESTRELLAS». Debajo, una lista de nombres demasiado larga, comida por la herrumbre. La fecha es de hace décadas.',
    opciones: [
      {txt:'Limpiar la placa con la manga para leer los nombres.', cambios:{humano:{aislamiento:-2}},
        msg:'Sacas algunos del óxido. Gente que se fue a un sitio del que no volvió noticia. Nadie ha vuelto a pulir esta placa en años. Tú tampoco volverás.'},
      {txt:'Seguir. Es solo un monumento más.', cambios:{},
        msg:'La placa queda atrás, tragada otra vez por la penumbra. Centauri. Un nombre de los de antes.'},
    ]
  },
  {
    titulo: 'ANUNCIO QUE YA NADIE ATIENDE',
    narr: 'Un holograma viejo parpadea sobre un local cerrado, con la mitad de los píxeles muertos. Una mujer sonríe hacia un cielo estrellado: «¿SUEÑAS CON ALGO MÁS? CENTAURI TE ESPERA. PLAZAS ABIERTAS — HELIX EXOCOLONIZACIÓN.» La oferta caducó hace una vida. El holograma no se ha enterado.',
    opciones: [
      {txt:'Quedarte mirando el cielo falso del anuncio.', cambios:{humano:{aislamiento:-1, disociacion:+1}},
        msg:'Las estrellas del holograma tiemblan y se repiten en bucle. Por un segundo casi te apetece. Luego recuerdas dónde estás.'},
      {txt:'Pasar de largo.', cambios:{},
        msg:'A tu espalda, la mujer sigue sonriéndole a nadie hacia un viaje que ya no existe.'},
    ]
  },
  {
    titulo: 'LA CANCIÓN A MEDIAS',
    narr: 'Un viejo sentado en un cajón tararea algo lento, de otra época. Llega a una parte y se calla, como si la letra se le acabara siempre en el mismo punto. «...los que se fueron a Centauri...», murmura, y ahí se queda. No sabe seguir.',
    opciones: [
      {txt:'«¿Cómo sigue esa canción?»', cambios:{humano:{aislamiento:-2}},
        msg:'Se encoge de hombros. «Nadie se la sabe entera ya, chaval. Se fue con ellos.» Vuelve a tararear el mismo trozo, y a callarse en el mismo sitio.'},
      {txt:'Dejarlo con su melodía.', cambios:{},
        msg:'El tarareo te sigue media calle, siempre cortándose donde la memoria se acaba.'},
    ]
  },
  {
    titulo: 'FUENTE SECA',
    narr: 'En una placita olvidada hay una fuente apagada, sin agua desde hace años. En el centro, un emblema metálico: una nave estilizada apuntando hacia arriba, y la palabra CENTAURI medio borrada. Alguien ha dejado, no se sabe cuándo, una flor de plástico descolorida en el borde.',
    opciones: [
      {txt:'Enderezar la flor de plástico.', cambios:{humano:{aislamiento:-3}},
        msg:'La colocas mejor, sin saber muy bien por qué. Alguien la dejó por alguien. Es lo único vivo en toda la plaza, y ni siquiera está vivo.'},
      {txt:'Cruzar la plaza sin pararte.', cambios:{},
        msg:'Tus pasos resuenan en la piedra seca. Detrás, la nave del emblema sigue apuntando a un cielo que no se ve desde aquí.'},
    ]
  },
];

function intentarEventoAleatorio(callback){
  // Probabilidad 40% — pediste que el mundo se sienta más vivo.
  if(Math.random() >= 0.40){ callback(); return; }
  // Elegir evento aleatorio que no se haya visto recientemente.
  // Mantenemos los últimos 8 fuera del pool para no repetir.
  if(!Estado.eventosVistos) Estado.eventosVistos = [];
  const disponibles = eventos.filter((_,i)=>!Estado.eventosVistos.includes(i));
  const pool = disponibles.length > 0 ? disponibles : eventos;
  const idx = eventos.indexOf(pool[Math.floor(Math.random()*pool.length)]);
  Estado.eventosVistos.push(idx);
  if(Estado.eventosVistos.length > 8) Estado.eventosVistos.shift();
  mostrarEvento(eventos[idx], callback);
}

function mostrarEvento(ev, callback){
  document.getElementById('evt-titulo').textContent = ev.titulo;
  document.getElementById('evt-narrativa').textContent = ev.narr;
  const opc = document.getElementById('evt-opciones');
  opc.innerHTML = '';
  ev.opciones.forEach(o=>{
    // Filtrado por inventario REAL del catálogo (v0.92):
    //   requiereItem — la opción solo aparece si tienes ese id.
    //   vetaItem     — la opción solo aparece si NO tienes ese id.
    if(o.requiereItem && !(typeof tieneItem==='function' && tieneItem(o.requiereItem))) return;
    if(o.vetaItem && (typeof tieneItem==='function' && tieneItem(o.vetaItem))) return;
    const btn = document.createElement('button');
    btn.className = 'evento-opc';
    btn.textContent = o.txt;
    btn.onclick = ()=> elegirOpcionEvento(o, callback);
    opc.appendChild(btn);
  });
  // Si tras el filtrado no queda ninguna opción visible, garantizamos una
  // salida para no dejar al jugador atascado.
  if(opc.children.length === 0){
    const btn = document.createElement('button');
    btn.className = 'evento-opc';
    btn.textContent = 'Seguir adelante.';
    btn.onclick = ()=> elegirOpcionEvento({ txt:'Seguir adelante.', msg:'Sigues tu camino.', cambios:{} }, callback);
    opc.appendChild(btn);
  }
  document.getElementById('modal-evento').classList.add('visible');
}

function elegirOpcionEvento(opcion, callback){
  const opc = document.getElementById('evt-opciones');
  opc.innerHTML = `<div class="evento-resultado">${opcion.msg}</div>`;
  // Aplicar cambios
  aplicarCambios(opcion.cambios || {});
  // ECOS DE LA CALLE (v0.86.5): el evento de tránsito también deja huella
  // para las noticias. Inferimos el tipo de suceso desde los cambios.
  if(typeof marcarEcoCalle === 'function'){
    const c = opcion.cambios || {};
    const h = c.humano || {};
    if(typeof c.creditos === 'number' && c.creditos < 0) marcarEcoCalle('dineroSucio');
    if((h.fatiga || 0) >= 4) marcarEcoCalle('violencia');
    if(typeof c.aislamiento === 'number' || (h.aislamiento && h.aislamiento < 0)) marcarEcoCalle('encuentro');
  }
  // Botón de cerrar
  const btn = document.createElement('button');
  btn.className = 'evento-opc';
  btn.textContent = 'CONTINUAR →';
  btn.style.marginTop = '0.8rem';
  btn.onclick = ()=>{
    document.getElementById('modal-evento').classList.remove('visible');
    if(callback) callback();
  };
  opc.appendChild(btn);
}

// INTRO

// ============================================================