// ============================================================
// BLOQUE JS-45 — ESCENAS DE GUION (datos escritos a mano)
// ------------------------------------------------------------
// Catálogo de momentos escritos a mano para la exploración.
// El MOTOR que los lee está en 44_escenas_guion.js.
//
// CÓMO ESCRIBIR UNA ESCENA:
//   'id_unico': {
//      entrada: true,            // true = puede iniciar un momento al explorar
//                                //        (las escenas internas de la cadena
//                                //         NO llevan 'entrada')
//      cond: { ... },            // (opcional) condición para que aparezca
//      img: 'CLAVE_ASSET',       // (opcional) imagen de fondo
//      texto: 'Prosa de la escena…',   // o una función que devuelva texto
//      opciones: [
//        {
//          texto: 'Lo que dice/hace el jugador',
//          cond:  { ... },       // (opcional) si no se cumple, la opción NO se muestra
//          req:   { ... },       // (opcional) si no se cumple, se muestra BLOQUEADA
//          pista: '50 créditos', // (opcional) etiqueta de por qué está bloqueada
//          efectos: { ... },     // (opcional) cambios de estado al elegirla
//          resultado: 'Texto…',  // (opcional) lo que ocurre tras elegir
//          lleva: 'otro_id'      // (opcional) salta a otra escena. Sin esto, CIERRA el momento.
//          azar: {               // (opcional) resultado con suerte
//            prob: 0.6,
//            exito: { resultado:'…', efectos:{...}, lleva:'id_exito' },
//            fallo: { resultado:'…', efectos:{...}, lleva:'id_fallo' }
//          }
//        }
//      ]
//   }
//
// CLAVES DE CONDICIÓN/REQUISITO (todas opcionales, todas deben cumplirse):
//   item, noItem, creditosMin, creditosMax,
//   faccion + (repMin | repMax),
//   fatigaMin, fatigaMax, aislamientoMin, disociacionMin,
//   visto, noVisto
//
// CLAVES DE EFECTO (todas opcionales):
//   creditos, fatiga, aislamiento, hambre, disociacion,
//   item, quitaItem, condicion, quitaCondicion, faccion + rep
//
// FACCIONES: 'sindicatos', 'eco', 'ia', 'archivistas'
// ============================================================

const ESCENAS_GUION = {

  // ====== MOMENTO DE EJEMPLO: "La mujer del callejón" ======
  // Cadena de 3 escenas que demuestra TODO el sistema:
  // condición de aparición, opción bloqueada por fuerza/objeto,
  // efectos de estado, azar, y ramificación.

  'callejon_voz': {
    entrada: true,
    // solo aparece si aún no llevas el papel y tu disociación no es alta
    cond: { noItem: 'papel_helix', disociacionMin: 0 },
    img: 'EXP_CALLEJON_NIVELES',
    texto: 'Una mujer empapada te corta el paso entre dos andamios. No pide créditos. '
         + 'Solo mira el implante de tu muñeca, el viejo, el que ya nadie repara. '
         + '"Ese modelo lo retiraron hace años", dice en voz baja. "¿Sabes lo que llevas dentro?"',
    opciones: [
      {
        texto: 'No me toques.',
        // cierra el momento; un poco más de aislamiento por cortar el contacto
        efectos: { aislamiento: +3 },
        resultado: 'Pasas de largo. Ella no te sigue. La lluvia borra sus pasos antes que los tuyos.'
      },
      {
        texto: '¿Qué quieres decir?',
        lleva: 'callejon_voz_2'
      },
      {
        texto: 'Apartarla de un empujón.',
        // requiere algo de "empuje": bloqueada si vas muy agotado
        req: { fatigaMax: 70 },
        pista: 'demasiado agotado',
        azar: {
          prob: 0.6,
          exito: {
            resultado: 'La apartas y sigues. Te grita algo que el ruido se traga. No miras atrás.',
            efectos: { fatiga: +6, faccion: 'eco', rep: -3 }
          },
          fallo: {
            resultado: 'Resbala, se agarra a ti y caéis los dos sobre el metal mojado. '
                     + 'Te levantas con el codo abierto y su mirada clavada en la nuca.',
            efectos: { fatiga: +10, condicion: 'herida_brazo_d_leve', faccion: 'eco', rep: -5 }
          }
        }
      }
    ]
  },

  'callejon_voz_2': {
    // escena interna: NO lleva 'entrada' (no sale sola al explorar)
    img: 'EXP_CALLEJON_NIVELES',
    texto: '"Lo que llevas en la muñeca no es tuyo", dice. "Es de HELIX. Memoria que creían perdida. '
         + 'Y la quieren de vuelta." Te mete un papel mojado en la mano y se aleja sin esperar respuesta.',
    opciones: [
      {
        texto: 'Guardar el papel.',
        efectos: { item: 'papel_helix' },
        resultado: 'Te lo metes en el bolsillo interior. Pesa más de lo que debería un papel.',
        lleva: 'callejon_voz_3'
      },
      {
        texto: 'Tirarlo al canal.',
        efectos: { aislamiento: +5 },
        resultado: 'El papel se hunde en el agua negra. Te dices que no era nada. Casi te lo crees.'
        // sin lleva -> cierra el momento
      }
    ]
  },

  'callejon_voz_3': {
    img: 'EXP_CIBERCAFE',
    texto: 'Bajo una luz de neón que parpadea, despliegas el papel. No hay texto: solo un código '
         + 'y un símbolo que reconocerías en cualquier parte. La hélice de HELIX, tachada.',
    opciones: [
      {
        texto: 'Memorizar el código.',
        efectos: { disociacion: +4 },
        resultado: 'Cierras los ojos y lo repites hasta que es tuyo. Algo, muy abajo, parece escuchar.'
      },
      {
        texto: 'Llevárselo a tu contacto en las Autónomas.',
        cond: { faccion: 'ia', repMin: 5 },
        efectos: { faccion: 'ia', rep: +4 },
        resultado: 'Sabes a quién enseñárselo. Por primera vez en semanas, tienes algo que alguien quiere.'
      }
    ]
  },

  // ====== MOMENTO 2: "El niño del comedor" (conclusa, 1 escena) ======
  // Demuestra: opción bloqueada por créditos, efectos de estado y facción.
  'nino_comedor': {
    entrada: true,
    img: 'EXP_COMEDOR_SECTORB',
    texto: 'En el comedor del Sector B, un crío de no más de ocho años te tira de la manga. '
         + 'No habla. Señala la cola de la cocina común, y luego su propia boca. '
         + 'Detrás de él, nadie reclama al niño.',
    opciones: [
      {
        texto: 'Pagarle un plato caliente.',
        req: { creditosMin: 15 },
        pista: '15 créditos',
        efectos: { creditos: -15, aislamiento: -6 },
        resultado: 'Come deprisa, sin mirarte. Cuando levanta la vista, ya te has dado la vuelta. '
                 + 'Algo en el pecho te pesa un poco menos.'
      },
      {
        texto: 'Darle tu ración de la mochila.',
        efectos: { hambre: +12, aislamiento: -8, faccion: 'eco', rep: +4 },
        resultado: 'Le pones tu ración en las manos. Una mujer de la cocina te ve hacerlo y asiente, '
                 + 'despacio. En las Pilas, esas cosas se recuerdan.'
      },
      {
        texto: 'No es tu problema.',
        efectos: { aislamiento: +5 },
        resultado: 'Sigues la cola sin mirarle. Cuando te giras, el niño ya no está. Mejor así, te dices.'
      }
    ]
  },

  // ====== MOMENTO 3: "Mercado de chatarra neural" (con azar) ======
  // Demuestra: opción con requisito + resultado por suerte (éxito/fallo).
  'chatarra_neural': {
    entrada: true,
    img: 'EXP_TALLER_PROTESIS_1',
    texto: 'Un buhonero te enseña un implante de memoria de segunda mano, todavía con restos de '
         + 'sangre seca en el conector. "Funciona", dice. "Casi siempre." Lo vende barato. '
         + 'Demasiado barato.',
    opciones: [
      {
        texto: 'Comprarlo e instalártelo.',
        req: { creditosMin: 40 },
        pista: '40 créditos',
        efectos: { creditos: -40 },
        azar: {
          prob: 0.55,
          exito: {
            resultado: 'Encaja con un chasquido húmedo. Por un instante ves recuerdos que no son tuyos… '
                     + 'y luego se calla. Funciona. Esta vez funciona.',
            efectos: { item: 'chip_datos_corrupto', disociacion: +6 }
          },
          fallo: {
            resultado: 'El implante chisporrotea al conectarlo. El mundo se inclina y vomitas contra la '
                     + 'pared. El buhonero ya ha desaparecido con tus créditos.',
            efectos: { condicion: 'conmocion', disociacion: +10 }
          }
        }
      },
      {
        texto: 'Regatear el precio.',
        azar: {
          prob: 0.5,
          exito: { resultado: 'Le sostienes la mirada hasta que cede. Baja el precio a la mitad. '
                            + 'No es confianza: es prisa por quitárselo de encima.',
                   efectos: { faccion: 'sindicatos', rep: +2 } },
          fallo: { resultado: 'Escupe al suelo y recoge la mercancía. "Si no compras, circula." '
                            + 'Notas las miradas del taller clavándose en tu espalda.',
                   efectos: { aislamiento: +4 } }
        }
      },
      {
        texto: 'Seguir caminando.',
        resultado: 'Le das la espalda. Oyes cómo se lo ofrece a otro, con las mismas palabras exactas.'
      }
    ]
  },

  // ====== MOMENTO 4: "La hélice tachada" (cadena de 2, requiere objeto) ======
  // Demuestra: condición de aparición por OBJETO + encadenado + ramas con facción.
  'helice_tachada': {
    entrada: true,
    cond: { item: 'papel_helix' },     // solo aparece si llevas el papel del callejón
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: 'Un hombre alto con sobretodo gris te corta el paso en la plaza. No mira tu cara: '
         + 'mira el bolsillo donde guardas el papel. "Tú eres quien lo lleva ahora", dice, '
         + 'sin levantar la voz. Sabe demasiado.',
    opciones: [
      {
        texto: '"¿Quién eres?"',
        lleva: 'helice_tachada_2'
      },
      {
        texto: 'Echar a correr.',
        efectos: { fatiga: +14, aislamiento: +4 },
        resultado: 'Corres hasta que el aire te quema. Cuando te giras, no hay nadie. '
                 + 'Pero sabes que volverá. Esa clase de gente siempre vuelve.'
      }
    ]
  },

  'helice_tachada_2': {
    img: 'EXP_PLAZA_OLVIDADOS',
    texto: '"Un archivista", responde, como si eso lo explicara todo. "Guardamos lo que HELIX borra. '
         + 'Ese código es una puerta. Puedo quitártelo de encima… o puedo enseñarte a usarla."',
    opciones: [
      {
        texto: 'Vendérselo y olvidarlo. (+120 créditos)',
        efectos: { creditos: +120, quitaItem: 'papel_helix', aislamiento: +3 },
        resultado: 'Coge el papel con dos dedos, como quien recoge algo muerto. Te paga sin mirarte. '
                 + 'Te quedas más rico y más solo de lo que entraste.'
      },
      {
        texto: 'Quiero aprender a usarla.',
        efectos: { faccion: 'archivistas', rep: +6, disociacion: +5 },
        resultado: '"Entonces ya eres uno de los nuestros, aunque aún no lo sepas." Te da una dirección '
                 + 'y se disuelve entre la gente. El papel pesa distinto ahora.'
      }
    ]
  }

};

window.ESCENAS_GUION = ESCENAS_GUION;
