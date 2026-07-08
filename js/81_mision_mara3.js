// ============================================================
// BLOQUE JS-81 — TERCER ESLABÓN DE MARA ("EL MÓDULO")
// ------------------------------------------------------------
// Continuación DIRECTA de "El maletín" (js/80). El maletín llevaba
// dentro un módulo cerrado; Mara no quiere que lo toque gente de
// fuera y te pide a ti que lo abras. Es el eslabón HACKER de la
// columna principal, pero abierto a cualquiera.
//
// CÓMO LLEGA:
//   · Se desbloquea al COMPLETAR "El maletín" (visto 'mara2_hecha',
//     lo marcan sus dos desenlaces en js/80). La próxima vez que el
//     jugador SALGA a explorar, puede aparecer la entrada 'mara3_p1'.
//   · Mara contacta dentro de la propia escena (cifrado en la lente,
//     igual patrón que el maletín), así se siente dirigido sin tocar
//     el módulo de terminal.
//
// DISEÑO (aprobado):
//   · Abierto a TODOS con una escena sencilla (nada de minijuego
//     nuevo). Si el jugador tiene oficio de hacker, la limpieza sale
//     más fina y rescata una esquirla extra. NUNCA se cierra tras la
//     profesión: la trama tiene que poder seguir siempre.
//   · El patrón queda EN SOMBRA: sello viejo de HELIX + coordenadas y
//     fecha que no cuadran + una línea humana fuera de lugar. NADA de
//     "Centauri" ni "CERO" en claro todavía; ese clic es el giro de
//     más adelante (nivel 3). Aquí el jugador sale con "¿qué es esto?".
//   · Deja la trama en nivel 2 y entrega A MANO el primer Fragmento de
//     Memoria dado por una misión ('eco_nieve'), vía efectos.fragmento.
//   · Mara reacciona conteniéndose y suelta, como de pasada, el hilo
//     del siguiente eslabón (una archivista en Midbelt).
//
// TONO: incómodo, no triunfal. Una persona sola abriendo algo que no
// debería tener.
// ============================================================

(function(){
  if(typeof ESCENAS_GUION === 'undefined') return;

  const MISION = {

    // ---- ENTRADA: Mara te pasa el módulo del maletín ----
    'mara3_p1': {
      entrada: true,
      repetible: true, // si se interrumpe a medias, vuelve a ofrecerse
      cond: { visto: 'mara2_hecha', noVisto: 'mara3_hecha' },
      img: 'APT',
      texto: 'Un parpadeo cifrado te cruza la lente cuando ya volvías a casa. Es ella. Sin saludo, como siempre.<br><br>'
           + '<span style="color:var(--magenta)">«El maletín llevaba algo dentro. Un módulo. Cerrado con basura vieja, de la que ya nadie usa. '
           + 'No quiero que lo toque gente de fuera. Si te manejas, ábrelo tú. Si no, dímelo y lo entierro.»</span><br><br>'
           + 'El paquete te llega esa misma noche, sin remite, en un tubo de reparto que no debería seguir funcionando. '
           + 'Dentro, el módulo: un ladrillo de metal mate del tamaño de tu palma, sin marcas, con un conector que no habías visto nunca.<br><br>'
           + 'En tu unidad, conectas el módulo a la terminal vieja. La pantalla parpadea, duda, y por fin engancha. '
           + 'Lo que hay dentro está podrido de puro antiguo: capas de cifrado muerto, ruido, silencio. Habrá que sacarlo a mano.',
      opciones: [
        { texto: 'Forzar la carcasa y leer lo que caiga.',
          resultado: 'Vas a lo bruto: saltas la primera capa por donde cede y dejas que la terminal escupa lo que pueda entre el ruido. '
                   + 'No es elegante. No hace falta que lo sea.',
          lleva: 'mara3_ruido' },
        { texto: 'Trabajarlo con calma, capa por capa.',
          req: { profesion: { id: 'hacker' } }, pista: 'haría falta oficio de hacker',
          resultado: 'Le dedicas la noche entera. Vas pelando el cifrado muerto capa por capa, sin romper nada, dejando que el módulo '
                   + 'crea que sigue cerrado mientras lo lees por dentro. Sale más limpio, y sale más.',
          efectos: { fatiga:+4, marcaVisto:'mara3_fino' },
          lleva: 'mara3_ruido_fino' }
      ]
    },

    // ---- REVELA (base): lo justo, en sombra ----
    'mara3_ruido': {
      img: 'APT',
      texto: 'Casi todo sale corrupto: cadenas rotas, huecos, basura. Pero entre el ruido quedan tres cosas legibles.<br><br>'
           + 'Un <b>sello de HELIX</b> medio borrado, de un formato tan viejo que la propia terminal tarda en reconocerlo. Esto pasó por HELIX. Hace mucho.<br><br>'
           + 'Unas <b>coordenadas rotas</b> y una <b>fecha que no cuadra</b>: apunta a atrás, a mucho más atrás de lo que debería existir un archivo así.<br><br>'
           + 'Y una línea que no es técnica. No encaja con nada del resto. Se siente <i>humana</i>, y fuera de lugar:<br>'
           + '<span style="opacity:.85;font-style:italic">«[…] no era nuestro cielo […] pero nadie más parecía notarlo […]»</span><br><br>'
           + 'Lo miras un buen rato. No entiendes nada. Solo sabes que preferirías no haberlo abierto.',
      opciones: [
        { texto: 'Guardar lo que has sacado y avisar a Mara.', lleva: 'mara3_cierre' }
      ]
    },

    // ---- REVELA (hacker): lo mismo + una esquirla más ----
    'mara3_ruido_fino': {
      img: 'APT',
      texto: 'La paciencia paga. Sale lo mismo que sacaría cualquiera —un <b>sello de HELIX</b> medio borrado, de un formato muerto; '
           + 'unas <b>coordenadas rotas</b> y una <b>fecha que no cuadra</b>, apuntando demasiado atrás— pero tú llegas un paso más adentro.<br><br>'
           + 'Rescatas dos líneas donde otros solo verían ruido. La primera no es técnica. Se siente <i>humana</i>, y fuera de lugar:<br>'
           + '<span style="opacity:.85;font-style:italic">«[…] no era nuestro cielo […] pero nadie más parecía notarlo […]»</span><br><br>'
           + 'Y debajo, más rota todavía, casi borrada, una segunda:<br>'
           + '<span style="opacity:.85;font-style:italic">«[…] dijeron que sería poco […]»</span><br><br>'
           + 'No entiendes nada. Pero se te queda dentro, como una piedra en el zapato que no encuentras.',
      opciones: [
        { texto: 'Guardar lo que has sacado y avisar a Mara.', lleva: 'mara3_cierre' }
      ]
    },

    // ---- CIERRE: Mara reacciona y deja caer el siguiente hilo ----
    'mara3_cierre': {
      img: 'APT',
      texto: 'Le pasas a Mara lo que has sacado. Tarda en responder más de lo normal. Cuando lo hace, no comenta ni el sello ni la fecha, '
           + 'como si ya los conociera y prefiriera no confirmarlo.<br><br>'
           + '<span style="color:var(--magenta)">«Esa clase de basura la catalogaba alguien que conocí. Formatos viejos, cosas que HELIX prefería perder. '
           + 'Arriba, en Midbelt. Si sigue viva.»</span><br><br>'
           + 'Y corta, antes de que se te ocurra preguntar quién, o por qué habla en pasado.',
      opciones: [
        { texto: 'Dejarlo estar por esta noche.',
          efectos: { creditos:+140, fatiga:+3, marcaVisto:'mara3_hecha', fragmento:'eco_nieve' },
          resultado: 'Desconectas el módulo. La terminal vuelve a su ruido de siempre, y la unidad al silencio de siempre. '
                   + 'Te guardas los créditos de Mara y las tres cosas que no entiendes. Intentas dormir.'
                   + '<br><br><span class="eg-pista">— Has abierto el módulo para Mara —</span>' }
      ]
    }

  };

  // Inyectar en el catálogo global sin pisar nada existente.
  Object.keys(MISION).forEach(id=>{
    if(!ESCENAS_GUION[id]) ESCENAS_GUION[id] = MISION[id];
  });

})();
