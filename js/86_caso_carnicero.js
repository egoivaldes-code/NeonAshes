// ============================================================
// BLOQUE JS-86 — CASO SUELTO: "EL CARNICERO" (v0.150)
// ------------------------------------------------------------
// Caso autoconclusivo de Lower Stacks. NO es la misión principal: no
// toca Centauri, ni CERO, ni sube la bandera de trama. Es vida (y muerte)
// del barrio: alguien cosecha implantes y órganos de los más desesperados,
// y HELIX no piensa mover un dedo por gente que no cotiza.
//
// Gore un punto más explícito, pero CON PROPÓSITO (horror de cuerpo y de
// desesperación, no adorno). Ramas reales, combate duro evitable y varios
// desenlaces, cada uno con recompensa o desventaja.
//
// Disponible a cualquiera (sin oficio requerido). Se juega una vez.
// Solo imágenes y condiciones que ya existen en el proyecto.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const C = {

  // ---- ENTRADA: Dvora te para en la calle ----
  'caso_p1': {
    entrada: true,
    repetible: true, cond: { noVisto: 'caso_carnicero_hecho' },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una mujer te corta el paso. Se llama Dvora, tiene las manos rojas de fregar y los ojos de no dormir. «Mi hermano fue a vender '
         + 'un implante a una clínica de las baratas, de las que pagan en el día. No volvió. Ni él ni otros tres del bloque.» Baja la voz. '
         + '«La gente le llama el carnicero. Los encuentran luego en los desagües, vaciados por dentro como pescado. La patrulla de HELIX '
         + 'dice que aquí abajo la gente se pierde sola.» Te agarra la muñeca. «Yo no tengo casi nada. Pero por encontrarlo te doy lo que sea.»',
    opciones: [
      { texto: 'Aceptar. Vas a encontrar a ese carnicero.',
        resultado: 'Dvora asiente como si le hubieras quitado un peso y otro más grande se lo hubieras puesto encima. Te da la última dirección '
                 + 'conocida de su hermano y un nombre de calle: la lavandería del nivel bajo. Por ahí se empieza.', lleva:'caso_rastro' },
      { texto: 'Aceptar, pero que suelte algo por adelantado.',
        efectos:{ creditos:+30 },
        resultado: 'Junta treinta créditos de un tarro escondido, arrugados, y te los pone en la mano sin regatear. Que pague por adelantado a '
                 + 'un desconocido dice todo lo desesperada que está. Te da la pista: la lavandería del nivel bajo.', lleva:'caso_rastro' },
      { texto: 'No es tu problema. Ya hay bastantes en las Pilas.',
        efectos:{ marcaVisto:'caso_carnicero_hecho', humano:{ aislamiento:+3 } },
        resultado: 'Le sueltas la muñeca con cuidado y sigues tu camino. Ella no insiste; ya contaba con el no. En las Pilas, pedir ayuda es, '
                 + 'casi siempre, aprender otra vez que no viene.' }
    ]
  },

  // ---- RASTRO: cómo llegas a la clínica ----
  'caso_rastro': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'El rastro es corto y feo. Todos los desaparecidos tenían dos cosas en común: un implante que vender y a nadie que los reclamara. '
         + 'La clase de gente que el sistema ya da por perdida antes de perderla.',
    opciones: [
      { texto: 'Seguir al captador que ronda ofreciendo "buen precio" a los desesperados.',
        efectos:{ humano:{ fatiga:+4 } },
        resultado: 'Un tipo amable de más va de cola de comedor en cola de comedor ofreciendo tarifas imposibles por implantes usados. Lo sigues '
                 + 'a distancia hasta una lavandería que echa vapor a la calle. Nadie mete tanta ropa a lavar como para ese vapor.', lleva:'caso_clinica' },
      { texto: 'Examinar tú mismo uno de los cuerpos del desagüe.',
        efectos:{ humano:{ disociacion:+5 } },
        resultado: 'Es peor de cerca. Los cortes son de manual de cirugía: limpios, por los planos correctos, sin una vacilación. No es un '
                 + 'carnicero de rabia. Es un profesional que un día tuvo licencia. Eso te dice qué clase de sitio buscas: no un antro, una consulta. '
                 + 'La lavandería del vapor encaja.', lleva:'caso_clinica' }
    ]
  },

  // ---- LA CLÍNICA: cómo entras ----
  'caso_clinica': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Detrás de las lavadoras hay una puerta con cerradura buena, demasiado buena. Por las juntas se escapa un frío de cámara y un olor '
         + 'a antiséptico barato que no tapa lo de debajo. Ahí dentro está. La cuestión es cómo entras.',
    opciones: [
      { texto: 'Entrar de farol: un cliente más que viene a vender un implante.',
        efectos:{ humano:{ disociacion:+2 } },
        resultado: 'Llamas, pones cara de necesidad —no te cuesta— y el captador te abre con una sonrisa de dentista. «Pasa, pasa, que aquí se '
                 + 'paga bien.» Te deja entrar tú solito en la boca del lobo. A veces es la única forma.', lleva:'caso_dentro' },
      { texto: 'Colarte por la trampilla de servicio de atrás.',
        azar:{ prob:0.55,
          exito:{ resultado:'Encuentras la trampilla de ventilación de la cámara y te dejas caer dentro sin un ruido, detrás de una estantería de '
                          + 'bandejas metálicas. Estás dentro, y nadie sabe que estás.', lleva:'caso_dentro' },
          fallo:{ resultado:'La trampilla chirría como un cerdo justo cuando pasas medio cuerpo. Oyes moverse dentro, deprisa. Te has metido en la '
                          + 'boca del sitio con la peor mano posible.', lleva:'caso_pillado' } } },
      { texto: 'A la mierda las sutilezas. Reventar la puerta.',
        resultado: 'Un par de patadas en el sitio justo y la cerradura buena cede. Entras de frente, a plena luz de quirófano. Que te vean. '
                 + 'Que sepan que se acabó.', lleva:'caso_combate' }
    ]
  },

  // ---- DENTRO: el horror y la encrucijada moral ----
  'caso_dentro': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'La cámara es un quirófano hecho con lo que se pudo robar: focos de obra, una mesa de acero con canales para que escurra, neveras '
         + 'de órganos zumbando en fila. En la mesa hay alguien. Vivo. Sedado a medias, con un brazo ya abierto y separado con pinzas, '
         + 'los dedos temblándole solos. Es joven. Podría ser el hermano de Dvora.<br><br>'
         + 'Sobre él, con bata y lupa quirúrgica, un hombre de manos tranquilas levanta la vista sin sobresaltarse. «Estoy ocupado», dice, '
         + 'como si le hubieras interrumpido el almuerzo. «Si esperas tu turno, cobras. Si no, molestas.» No es un monstruo de película. '
         + 'Es un señor cansado que hace un trabajo, y eso es lo que hiela.',
    opciones: [
      { texto: 'Ir directo a por el carnicero.',
        resultado: 'Dejas de mirar la mesa porque si sigues mirándola no vas a poder moverte. Vas a por él. El captador sale de detrás de una '
                 + 'nevera con un bisturí largo.', lleva:'caso_combate' },
      { texto: 'Cortar las correas y sacar al de la mesa YA.',
        efectos:{ humano:{ fatiga:+6, disociacion:+4 } },
        resultado: 'Eliges la vida que aún puedes salvar sobre la venganza que quizá no. Cortas las correas, le sujetas el brazo abierto como '
                 + 'puedes y cargas con él hacia la puerta mientras el carnicero, sin correr, ordena a su captador que "cierre". No te siguen '
                 + 'lejos: tienen mercancía que perder si se exponen. Escapas con el chico.', lleva:'caso_salvar' }
    ]
  },

  // ---- PILLADO al colarte ----
  'caso_pillado': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Sales de la trampilla directo a la luz del quirófano, con medio cuerpo aún enganchado. El captador ya te espera con un bisturí, '
         + 'y detrás, en la mesa, el carnicero ni levanta la vista de lo que está haciendo. «Termina con eso», dice, tranquilo. «Que gotee poco.»',
    opciones: [
      { texto: 'No te queda otra: pelear.', lleva:'caso_combate' },
      { texto: 'Retroceder y salir por donde entraste.',
        efectos:{ humano:{ fatiga:+8, disociacion:+5 } },
        resultado: 'Te zafas del primer bisturinazo y te metes de vuelta por la trampilla, arrastrándote hacia atrás mientras el captador te '
                 + 'busca las piernas. Sales a la calle con vida y con las manos vacías. El carnicero sigue ahí. El de la mesa, no por mucho. '
                 + 'Vas a cargar con eso.', lleva:'caso_huida' }
    ]
  },

  // ---- COMBATE ----
  'caso_combate': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El captador va por delante, rápido y sucio; el carnicero, detrás, deja las pinzas y coge una sierra de hueso con la misma calma '
         + 'con que cogería un bolígrafo. Ninguno grita. Pelear con gente que no se altera es lo peor: no puedes contar con que fallen por miedo.',
    opciones: [
      { texto: 'Acabar con esto.',
        pelea: {
          texto: 'El quirófano es estrecho y resbala. Bandejas al suelo, focos que ciegan, una sierra que suena distinto cuando encuentra algo. '
               + 'No es una pelea de honor: es sobrevivir en una habitación diseñada para abrir cuerpos.',
          integridad: 13,
          enemigos: [
            { nombre:'El captador', desc:'Rápido, bisturí largo, nervio', tipo:'rapido', integridad:4, fuerza:4, umbral:4 },
            { nombre:'El carnicero', desc:'Sierra de hueso, pulso de cirujano', tipo:'lider', integridad:6, fuerza:5, umbral:6 }
          ],
          refuerzoTurno: 3,
          refuerzoTurnoGrupo: [
            { nombre:'Camillero', desc:'Grande, lento, obediente', tipo:'bruto', integridad:5, fuerza:4, umbral:5 }
          ],
          gana: 'caso_tras',
          pierde: 'caso_malherido'
        } }
    ]
  },

  // ---- GANASTE: el destino del carnicero y de la víctima ----
  'caso_tras': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'Cuando se acaba, el suelo del quirófano tiene más de lo que ya tenía. El captador no se mueve. El carnicero sí, arrinconado contra '
         + 'sus neveras, sujetándose un brazo, mirándote sin una gota de miedo, solo con fastidio, como quien calcula pérdidas.<br><br>'
         + 'En la mesa, el chico respira. Le paras la hemorragia del brazo con lo que hay a mano; vivirá, con una cicatriz enorme y suerte. '
         + 'Queda decidir qué haces con el hombre de la bata.',
    opciones: [
      { texto: 'Entregárselo a los Fantasmas de Marte, que responda por los suyos.',
        efectos:{ creditos:+160, reputacion:+5, marcaVisto:'caso_carnicero_hecho' },
        resultado: 'Avisas a los Fantasmas. Vienen sin prisa, lo miran como se mira a una cucaracha grande y se lo llevan a un sitio del que no '
                 + 'vuelve. Te pagan por el aviso y por el material que liberas, y el barrio entero aprende tu nombre esta semana. Dvora recupera a '
                 + 'su hermano vivo. No todos los días de las Pilas terminan así.' },
      { texto: 'Matarlo tú. Aquí. Ahora.',
        efectos:{ item:'Maletín quirúrgico', creditos:+90, marcas:['caso_carnicero_muerto','caso_carnicero_hecho'], humano:{ disociacion:+8 } },
        resultado: 'No dice nada mientras lo haces, y eso es lo que no vas a poder olvidar. Te llevas su maletín quirúrgico, que vale una fortuna '
                 + 'en el mercado gris, y sacas al chico. Has hecho justicia, o algo con esa forma. Pero salir de esa cámara con las manos así '
                 + 'no se paga con créditos, y algo dentro de ti se queda en el suelo, con lo demás.' },
      { texto: 'Que decida Dvora qué se hace con él.',
        efectos:{ reputacion:+3, marcas:['caso_carnicero_dvora','caso_carnicero_hecho'], humano:{ disociacion:+5 } },
        resultado: 'Traes a Dvora. Ve a su hermano vivo, y luego ve al hombre de la bata. Te pide que la dejes a solas con él «solo un momento». '
                 + 'Le haces caso. Lo que pasa en ese momento no lo ves, pero lo oyes, y no dura poco. Cuando sale, tiene las manos como las tenía '
                 + 'de fregar, pero por otra cosa. No te da las gracias con palabras. Hay barrios enteros que ahora te las deben.' }
    ]
  },

  // ---- SALVASTE A LA VÍCTIMA (el carnicero huyó) ----
  'caso_salvar': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Sacas al chico a rastras hasta un médico clandestino que conoces y que, por una vez, no pregunta. Vivirá. Es el hermano de Dvora, '
         + 'y cuando ella llega y lo ve respirar, se rompe de una manera que no habías visto romperse a nadie: de alivio.',
    opciones: [
      { texto: 'Aceptar su agradecimiento y marcharte.',
        efectos:{ creditos:+60, reputacion:+4, marcaVisto:'caso_carnicero_hecho', humano:{ aislamiento:-2 } },
        resultado: 'Dvora te da lo poco que tiene y te promete lo que no tiene. Te ganas su lealtad y la del bloque entero. Pero al irte lo sabes, '
                 + 'y ella también: el carnicero sigue ahí, con su bata y su calma, y mañana habrá otra cola de desesperados y otra mesa de acero. '
                 + 'Salvaste a uno. No al siguiente.' }
    ]
  },

  // ---- PERDISTE EL COMBATE ----
  'caso_malherido': {
    img: 'EXP_ALMACEN_ZONA',
    texto: 'El pulso de cirujano no falla ni en una pelea. Acabas en el suelo del quirófano, entre las bandejas, viendo cómo la sierra se acerca '
         + 'y se aleja. No te rematan: no mereces la pena como pieza, dañado. El captador te arrastra por los pies y te tira a la calle como a '
         + 'una bolsa. Lo último que ves dentro es al carnicero volviendo, tranquilo, a la mesa donde el chico ya no se mueve.',
    opciones: [
      { texto: 'Arrastrarte a que te curen.',
        efectos:{ condicion:'hemorragia', fatiga:+16, disociacion:+10, marcaVisto:'caso_carnicero_hecho' },
        resultado: 'Un médico clandestino te recompone por lo que no llevas encima, deuda apuntada. Vives. El chico no. La clínica del vapor '
                 + 'sigue abierta, y tú vas a tener que mirar a Dvora a la cara y contarle que llegaste, y que no bastó.' }
    ]
  },

  // ---- HUIDA (te colaste, te pillaron, escapaste sin nada) ----
  'caso_huida': {
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Sales a la calle a cuatro patas, entero por poco. A tu espalda, la lavandería sigue echando vapor como si tal cosa, tapando lo que '
         + 'pasa detrás de las lavadoras.',
    opciones: [
      { texto: 'Recuperar el aliento y decidir qué le dices a Dvora.',
        efectos:{ marcaVisto:'caso_carnicero_hecho', humano:{ aislamiento:+3, disociacion:+4 } },
        resultado: 'No tienes al carnicero, no tienes a su hermano, no tienes nada salvo la certeza de dónde ocurre y de que no pudiste. '
                 + 'A veces, en las Pilas, encontrar el sitio es lo único que consigues, y no vale para nada.' }
    ]
  }

  };

  Object.keys(C).forEach(id=>{ if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = C[id]; });

})();
