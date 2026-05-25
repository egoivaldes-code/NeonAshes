// ============================================================
// BLOQUE JS-24 — APARTAMENTO — opciones y textos según hora/franja
// Inicializa la escena del apartamento. Las opciones (ventana,
//   terminal, dormir, salir) cambian según la hora del juego.
// ============================================================

function iniciarApartamento(){
  // Cada visita al apartamento, "mirar por la ventana" vuelve a estar
  // disponible. Solo puedes mirarla una vez por visita: tras hacerlo,
  // el botón se atenúa y no se puede pulsar de nuevo hasta volver a
  // salir y entrar al apartamento.
  Estado.ventanaMirada = false;

  const r=document.getElementById('reloj-apt');
  // El reloj del apartamento ahora lee la hora del juego real. Se
  // actualiza cada segundo. Con la velocidad x600 verás cómo van
  // pasando minutos enteros entre tic y tic.
  if(_intervaloRelojApt){ clearInterval(_intervaloRelojApt); }
  const refrescarRelojApt = () => {
    const f = obtenerFechaJuego();
    const h = String(f.getHours()).padStart(2,'0');
    const m = String(f.getMinutes()).padStart(2,'0');
    r.textContent = `${h}:${m}`;
  };
  refrescarRelojApt();
  _intervaloRelojApt = setInterval(refrescarRelojApt, 1000);

  // ============================================================
  // RECONOCIMIENTO NARRATIVO: el apartamento te recuerda
  // ============================================================
  // Si el jugador ha vuelto tras una partida previa, los textos
  // del apartamento cambian. El mundo no es el mismo cuando ya
  // ha pasado algo. La fuente de verdad: Estado.partidasCompletadas
  // y Estado.memoria (cargada de la partida anterior).
  ajustarTextosApartamentoSegunMemoria();

  // FASE D: si este personaje acaba de heredar de un muerto,
  // sobrescribimos el texto inicial del apartamento con la frase
  // atmosférica de herencia. Tiene prioridad sobre la narrativa de
  // "noche normal" o de partidas previas: estás aquí por primera vez,
  // pero alguien ya no.
  if(Estado.herenciaRecibida){
    const textoHerencia = textoEntradaConHerencia(Estado.herenciaRecibida);
    if(textoHerencia){
      const narr = document.getElementById('narr-apt');
      if(narr){
        narr.innerHTML = textoHerencia;
      }
    }
    // Lo dejamos disponible solo en esta entrada. Si el jugador
    // sale y vuelve (eco), el apartamento ya es "suyo".
    Estado.herenciaRecibida = null;
  }

  // Si hay noticias reactivas pendientes (partida cargada con
  // estado avanzado o decisiones ya tomadas), mostramos el badge.
  if(Estado.memoria && Estado.memoria.noticiasVistas === false){
    marcarNoticiasActualizadas();
  }
}

// Decide el texto narrativo y las opciones iniciales del apartamento
// según lo que el jugador hizo en partidas previas.
// Helper: devuelve el HTML del botón "Mirar por la ventana" con el
// estado correcto según si el jugador ya miró por la ventana en esta
// visita (atenuado y no clicable) o si todavía no (activo normal).
// Se usa en TODOS los sitios donde se genera el menú del apartamento
// para garantizar que la regla se aplique en todas partes igual.
function botonVentana(texto){
  const ya = Estado.ventanaMirada === true;
  if(ya){
    return `<button class="opcion-btn deshabilitado" disabled>${texto} ✓</button>`;
  }
  return `<button class="opcion-btn" onclick="opcionApt(0)">${texto}</button>`;
}

function ajustarTextosApartamentoSegunMemoria(){
  const narr = document.getElementById('narr-apt');
  const opc = document.getElementById('opciones-apt');
  const fechaApt = document.querySelector('.fecha-apt');
  if(!narr || !opc) return;

  const m = Estado.memoria || {};
  const h = Estado.humano || {};
  const completadas = Estado.partidasCompletadas || 0;

  // Caso base: primera vez jugando. Sin cambios.
  if(completadas === 0 && m.aceptoEncargo === null && !m.guardoSilencio){
    // Texto original — lo dejamos como estaba.
    narr.innerHTML = 'La lluvia ácida golpea el cristal.<br>Son las tres de la mañana.<br>No recuerdas cuándo te dormiste.';
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Seguir durmiendo</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal</button>`;
    return;
  }

  // === EL JUGADOR HA VUELTO. Componer texto narrativo según contexto. ===
  const lineas = [];

  // Línea 1 — la lluvia siempre está. Es lo único constante.
  lineas.push('La lluvia ácida sigue ahí. Igual que ayer.');

  // Línea 2 — varía según la decisión principal anterior
  if(m.vioFragmentoCero){
    // Disociación: la realidad va fuera de fase
    lineas.push('El reloj marca las tres. No estás seguro de que sea verdad.');
  } else if(m.aceptoEncargo === true){
    lineas.push('Hay un sabor metálico en la boca. El paquete sigue esperando.');
  } else if(m.aceptoEncargo === false){
    lineas.push('La deuda con HELIX no se ha ido durmiendo. Te despierta antes que la alarma.');
  } else if(m.guardoSilencio){
    lineas.push('Llevas horas mirando al techo sin decidir nada. Otra vez.');
  } else {
    lineas.push('Tres de la mañana otra vez. Como ayer. Como mañana.');
  }

  // Línea 3 — eco del estado humano residual
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    lineas.push('Nadie te ha llamado en todo el ciclo.');
  } else if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    lineas.push('Los párpados pesan. Anoche fue largo.');
  } else if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    lineas.push('A ratos sientes que ya has vivido esta noche.');
  } else if(completadas >= 2){
    lineas.push('Empiezas a perder la cuenta de cuántas noches llevas así.');
  }

  narr.innerHTML = lineas.join('<br>');

  // === Etiqueta de la unidad: cambia si hay disociación alta ===
  if(fechaApt){
    if(nivel(h.disociacion) === 'extremo'){
      fechaApt.innerHTML = 'UNIDAD <span style="color:rgba(255,180,200,0.5)">2█3-19A</span> · LOWER STACKS';
    } else if(nivel(h.disociacion) === 'alto'){
      fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS <span style="opacity:0.4;font-size:0.7em">// ¿es aquí?</span>';
    } else {
      fechaApt.innerHTML = 'UNIDAD 273-19A · LOWER STACKS';
    }
  }

  // === OPCIONES: varían según contexto ===
  // Si rechazó antes, el terminal probablemente trae más mala noticia
  // de HELIX. Si aceptó, hay continuidad con el encargo.
  if(m.aceptoEncargo === true){
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Intentar dormir un poco más</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Comprobar el terminal otra vez</button>`;
  } else if(m.aceptoEncargo === false){
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Quedarte en la cama</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal (HELIX)</button>`;
  } else if(m.vioFragmentoCero){
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Cerrar los ojos un momento</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>`;
  } else {
    // Vuelta sin haber completado nada concreto
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana otra vez")}
      <button class="opcion-btn" onclick="opcionApt(2)">Quedarte tumbado</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal</button>`;
  }
}
function opcionApt(idx){
  const opc=document.getElementById('opciones-apt'),narr=document.getElementById('narr-apt');
  const m = Estado.memoria || {};
  const h = Estado.humano || {};

  // Detectamos si el jugador ya volvió de la misión Mara.
  // En ese caso "Dormir" tiene un sentido distinto: cierra el día.
  const misionCerrada = Estado.mision === 'volvioApartamento';

  // Contexto para las variantes: franja horaria + día de la semana.
  const franja = franjaHoraria();
  const dia = tipoDia();

  // Respuesta narrativa. Se construye como array de candidatos y luego
  // se elige uno al azar. Esto evita "siempre el mismo texto" en visitas
  // repetidas a la ventana, el terminal o la cama.
  let candidatos = [];
  let resp;

  // === OPCIÓN 0: MIRAR POR LA VENTANA ===
  if(idx === 0){
    // Marcar que ya se miró: la siguiente regeneración de opciones
    // mostrará el botón atenuado hasta que se vuelva al apartamento.
    Estado.ventanaMirada = true;
    candidatos = textosVentana(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 1: ENCENDER TERMINAL ===
  else if(idx === 1){
    candidatos = textosTerminal(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 2: DORMIR ===
  else if(idx === 2){
    candidatos = textosDormir(misionCerrada, m, h, franja, dia);
  }

  // === OPCIÓN 3: SALIR DEL APARTAMENTO → MAPA ===
  else if(idx === 3){
    abrirMapa();
    return;
  }

  resp = elegirAlAzar(candidatos) || 'La habitación se queda en silencio.';

  narr.style.animation='none';
  narr.style.opacity='0';
  narr.innerHTML=resp;
  setTimeout(()=>{narr.style.animation='aparecer 0.6s ease forwards';},50);

  // ============================================================
  // ESTADO HUMANO: cada acción del apartamento te afecta un poco.
  // ============================================================
  // Mirar la lluvia: calma un toque, te aísla.
  // Encender el terminal: cansa la vista y deja un poso si HELIX te roza la identidad.
  // Intentar dormir: alivia fatiga ligera, sube algo el aislamiento.
  // Salir: no hace nada por ahora (es placeholder).
  // Los efectos son pequeños y acumulativos. La ciudad va cobrando.
  if(idx === 0){
    ajustarHumano('aislamiento', 2);    // miras la calle, no a nadie
    ajustarHumano('fatiga', -1);        // un respiro
    if(m.vioFragmentoCero){
      ajustarHumano('disociacion', 3);  // viste lluvia hacia arriba; eso te marca
    }
  } else if(idx === 1){
    ajustarHumano('fatiga', 2);         // mirar la pantalla cansa
    ajustarHumano('disociacion', 1);    // HELIX y anuncios dejan un poso
  } else if(idx === 2 && !misionCerrada){
    ajustarHumano('fatiga', -2);        // descanso breve y mal
    ajustarHumano('aislamiento', 3);    // dormir solo es estar solo
  }
  // idx === 3 (salir, placeholder) no toca el estado humano.

  // Botones siguientes — depende del idx y del contexto.
  if(idx === 1){
    // Terminal: si misión cerrada, no hay nada que abrir; volver al menú base.
    if(misionCerrada){
      setTimeout(()=>{ regenerarOpcionesAptCierre(); }, 600);
    } else {
      // Terminal — lleva al mensaje cifrado / HELIX según contexto.
      opc.innerHTML = `<button class="opcion-btn" onclick="irATerminal()">Abrir el mensaje cifrado</button>`;
    }
  } else if(idx === 0){
    // Ventana — devolverse al menú base con las 4 opciones.
    setTimeout(()=>{ regenerarOpcionesAptCierre(); }, 600);
  } else if(idx === 2){
    if(misionCerrada){
      // Dormir tras volver de la misión: cierra el día.
      setTimeout(()=>{
        opc.innerHTML = `<button class="opcion-btn" onclick="dormirYCerrarDia()">Dejar que el sueño te lleve →</button>`;
      }, 600);
    } else {
      // Dormir antes de la misión: el jugador tiene libertad total.
      // Puede cerrar el día y descansar, abrir el terminal para ver
      // el mensaje de Mara, o volver al menú y explorar fuera.
      setTimeout(()=>{
        opc.innerHTML =
          `<button class="opcion-btn" onclick="dormirYCerrarDia()">Dejar que el sueño te lleve →</button>` +
          `<button class="opcion-btn" onclick="opcionApt(1)">Encender el terminal</button>` +
          `<button class="opcion-btn" onclick="regenerarOpcionesAptCierre()">Quedarte despierto</button>`;
      }, 500);
    }
  }
}


// ============================================================

// ============================================================
// BLOQUE JS-25 — TEXTOS DEL APARTAMENTO — variantes por hora y memoria
// Cuatro funciones grandes que devuelven el texto correcto para
//   cada opción según hayas o no aceptado el encargo, qué hora es, etc.
// ============================================================

// ============================================================
// TEXTOS DEL APARTAMENTO — variantes por estado, hora y día
// ============================================================
// Cada función devuelve un array de frases candidatas. Las que
// son siempre válidas para un contexto se acumulan; al final se
// escoge una al azar. Cuantas más frases haya en el pool, menos
// sensación de "siempre el mismo texto".
//
// Variables disponibles:
//   misionCerrada — el jugador ya volvió de la misión Mara
//   m             — Estado.memoria (aceptoEncargo, vioFragmentoCero, etc.)
//   h             — Estado.humano (fatiga, aislamiento, hambre, disociacion)
//   franja        — 'madrugada' | 'amanecer' | 'manana' | 'tarde' | 'anochecer' | 'noche'
//   dia           — 'finde' | 'semana'
// ============================================================

function textosVentana(misionCerrada, m, h, franja, dia){
  const arr = [];

  // === Variantes específicas por contexto fuerte (siempre añaden mucho color) ===
  if(misionCerrada){
    arr.push('Neón líquido sobre el cristal.<br>El paquete ya cambió de manos.<br>La ciudad sigue, indiferente.');
    arr.push('La lluvia ya no pica como antes.<br>O eres tú, que ya no la sientes igual.<br>El paquete está donde tiene que estar.');
    arr.push('Mil ventanas iguales a la tuya.<br>En ninguna sabe nadie lo que hiciste esta noche.');
    if(m.vioFragmentoCero){
      arr.push('Una sombra pasa por delante del neón rojo.<br>Pero ningún cuerpo se ha movido en la calle.<br>Apartas la vista.');
    }
  } else if(m.aceptoEncargo === true){
    arr.push('Neón líquido sobre el cristal.<br>El Nivel 4 brilla a lo lejos. Allí te esperan.<br>Ya nada se puede deshacer.');
    arr.push('Cuentas las luces del Nivel 4 hasta perder el hilo.<br>Una de ellas marca el casillero 218.<br>No sabes cuál.');
    arr.push('La lluvia pinta el cristal de naranja y azul.<br>Mara no es de fiar. Tampoco es de las que mienten.');
  } else if(m.aceptoEncargo === false){
    arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Ninguna de ellas te va a pagar la deuda.');
    arr.push('Anuncios de HELIX rebotan en los charcos.<br>«Refinancie su confianza.»<br>Cierras la persiana mental.');
    arr.push('Una ambulancia cruza Nivel 9 sin sirenas.<br>Allá abajo siempre hay alguien que ha perdido más.');
  } else if(m.vioFragmentoCero){
    arr.push('Neón líquido sobre el cristal.<br>Por un segundo, parece que la lluvia cae hacia arriba.<br>Apartas la vista.');
    arr.push('El cristal te devuelve un reflejo con un parpadeo de más.<br>Cierras los ojos. Cuando los abres, vuelves a ser uno.');
    arr.push('La fecha del anuncio luminoso de enfrente cambia.<br>Dos cifras nuevas. Las viejas. No estás seguro de cuáles.');
  }

  // === Variantes por franja horaria (se acumulan siempre que apliquen) ===
  if(franja === 'madrugada'){
    arr.push('Es la hora muerta. Hasta los anuncios parecen cansados.<br>Solo las grúas del Nivel 12 siguen moviéndose, despacio.');
    arr.push('Tres de la mañana. La lluvia es lo único que sigue trabajando.');
    if(dia === 'finde'){
      arr.push('Madrugada de fin de semana. Risas borrachas a tres calles.<br>Una botella rueda hasta caer en un sumidero.');
    }
  } else if(franja === 'amanecer'){
    arr.push('Una franja gris se cuela entre los rascacielos.<br>Aquí abajo eso es lo más parecido a un amanecer.');
    arr.push('Las farolas del Nivel 9 se apagan una por una.<br>La ciudad cambia de turno sin avisar.');
  } else if(franja === 'manana'){
    arr.push('Reparto de cápsulas térmicas en la acera de enfrente.<br>Una cola de cinco personas. Todos con el mismo abrigo.');
    arr.push('La lluvia se ha vuelto fina.<br>Por un momento se ve hasta el Nivel 4. Solo por un momento.');
    if(dia === 'semana'){
      arr.push('Trenes verticales abarrotados hacia los niveles altos.<br>Vidas con destino. La tuya, otra cosa.');
    }
  } else if(franja === 'tarde'){
    arr.push('Sombras largas entre los pilares de hormigón.<br>El neón rojo de enfrente ya se enciende, aunque hay luz.');
    arr.push('Un dron de reparto se estrella contra una antena y sigue volando.<br>Nadie levanta la vista.');
    if(dia === 'finde'){
      arr.push('Tarde de fin de semana. Música de los bares de Nivel 9 sube por el conducto.<br>Tres ritmos distintos peleando entre sí.');
    }
  } else if(franja === 'anochecer'){
    arr.push('Hora dorada de neón. Todo lo gris se vuelve violeta por un rato.<br>Es la única vez que la ciudad parece tener intenciones.');
    arr.push('Las luces de las unidades de enfrente se van encendiendo.<br>Cada ventana, una vida en pausa.');
  } else if(franja === 'noche'){
    arr.push('Noche cerrada. Las grúas tiñen los nubarrones de naranja sucio.<br>En el cristal, solo te ves a ti.');
    arr.push('Los anuncios de HELIX brillan más fuerte al caer el sol.<br>Como si ahora tuvieran público.');
    if(dia === 'finde'){
      arr.push('Sábado por la noche en Lower Stacks.<br>Risas, vidrio roto, una sirena que viene y se va.<br>El ruido de fondo de los que no son tú.');
    }
  }

  // === Variantes por estado humano ===
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Ni una sola que te conozca.');
    arr.push('Cuentas las ventanas iluminadas hasta perder el hilo.<br>Ninguna te devuelve la mirada.');
  }
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('La frente apoyada en el cristal. Frío.<br>La ciudad se vuelve borrosa antes de que tus ojos lo decidan.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    arr.push('El olor a sopa barata sube por la rejilla del balcón.<br>Te giras antes de empezar a calcular lo que cuesta.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Por un segundo no estás seguro de estar mirando desde dentro.<br>Te tocas el cristal para confirmarlo.');
  }

  // === Fallback genérico ===
  arr.push('Neón líquido sobre el cristal.<br>Mil vidas que no son la tuya.<br>Siempre vendiendo. Siempre vigilando.');
  arr.push('La lluvia ácida deja regueros que parecen palabras.<br>Si las hubiera, no querrías leerlas.');
  arr.push('Un pájaro mecánico choca contra una valla luminosa.<br>Se levanta. Sigue. Algo en eso te resulta familiar.');

  return arr;
}

function textosTerminal(misionCerrada, m, h, franja, dia){
  const arr = [];

  if(misionCerrada){
    arr.push('La pantalla parpadea.<br>Nada nuevo. La bandeja está vacía.<br>Por ahora.');
    arr.push('Un cursor verde marca el ritmo del silencio.<br>Lo dejas hacer.');
    arr.push('La pantalla pregunta si quieres comprobar actualizaciones.<br>Le dices que no con la mano. No te mira.');
  } else if(m.aceptoEncargo === true){
    arr.push('La pantalla parpadea.<br>Las coordenadas siguen ahí.<br>Sigue siendo real.');
    arr.push('Relees el mensaje cifrado.<br>Cada vez parece más corto. Como si lo supieras ya.');
    arr.push('El timestamp del mensaje no cuadra con el reloj.<br>Adelantado. Como si lo hubieras leído antes.');
  } else if(m.aceptoEncargo === false){
    arr.push('La pantalla parpadea.<br>HELIX. Otra vez HELIX.<br>El número de la deuda ha subido.');
    arr.push('Tres recordatorios de pago en cola.<br>Los marcas como leídos sin abrirlos.');
    arr.push('Un anuncio en bucle: «Refinancie su confianza.»<br>Cortas la conexión. El anuncio sigue dos segundos más.');
  } else if(m.vioFragmentoCero){
    arr.push('La pantalla parpadea.<br>Una notificación cifrada.<br><span style="opacity:0.6">El timestamp dice una hora que aún no ha llegado.</span>');
    arr.push('Por un segundo el cursor se mueve sin que tú lo hayas tocado.<br>Una sola vez. Solo una.');
  } else {
    arr.push('La pantalla parpadea.<br>Una notificación cifrada.<br>Alguien sabe dónde estás.');
    arr.push('El terminal pita una vez. Sin razón aparente.<br>Cuando miras, no hay nada nuevo.');
  }

  // Variantes por hora (más sutiles, se acumulan)
  if(franja === 'madrugada'){
    arr.push('A esta hora solo escriben los bots y los acreedores.<br>La pantalla lo sabe; baja el brillo sola.');
  } else if(franja === 'amanecer'){
    arr.push('El terminal se sincroniza con los servidores del distrito.<br>Tarda más de lo que debería. Como tú.');
  } else if(franja === 'tarde' || franja === 'anochecer'){
    arr.push('El sol entra de lado y borra parte del texto en pantalla.<br>Te mueves para leerlo. La luz se mueve también.');
  } else if(franja === 'noche'){
    arr.push('La pantalla es la única luz de la habitación.<br>Tu cara se refleja en ella. Más cansada que antes.');
  }

  // Estado humano residual
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('Las líneas de texto bailan un poco al leerlas.<br>Cierras un ojo. Sigue bailando.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Por un instante el cursor parece ir hacia atrás.<br>Como si la pantalla rebobinara. Solo un instante.');
  }

  return arr;
}

function textosDormir(misionCerrada, m, h, franja, dia){
  const arr = [];

  if(misionCerrada){
    arr.push('Te tumbas. Esta vez el cuerpo cede.<br>La ciudad sigue ahí afuera. Tú no, por unas horas.');
    arr.push('Los músculos te tiemblan al relajarse.<br>No sabías que estaban tensos hasta que dejan de estarlo.');
    arr.push('Cierras los ojos. La oscuridad detrás de los párpados es la primera oscuridad real en horas.');
  } else if(m.aceptoEncargo === true){
    arr.push('No vas a poder dormir.<br>El encargo te espera al amanecer.<br>Y tú lo sabes.');
    arr.push('Cuentas hasta cien. Cuentas hasta doscientos.<br>El número del casillero te interrumpe cada vez.');
    arr.push('Cierras los ojos. Detrás de ellos, una luz fluorescente parpadea. No es real. No del todo.');
  } else if(m.aceptoEncargo === false){
    arr.push('La ciudad nunca duerme.<br>Tú tampoco.<br>La deuda tampoco.');
    arr.push('El número de la deuda se te queda flotando en la oscuridad.<br>Lo intentas borrar. Vuelve.');
  } else if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    arr.push('La ciudad nunca duerme.<br>Y tú casi tampoco.<br>Pero los párpados ya no responden.');
    arr.push('El cansancio gana sin avisar. Te despiertas sin recordar haberte dormido.');
  } else {
    arr.push('La ciudad nunca duerme.<br>Tú tampoco.');
    arr.push('Te tumbas. El techo tiene una grieta nueva. O quizás siempre estuvo ahí.');
  }

  // Variantes por hora
  if(franja === 'madrugada'){
    arr.push('Es la hora correcta para dormir, pero ya no te acuerdas de cómo.');
  } else if(franja === 'amanecer'){
    arr.push('Se cuela una franja de luz gris.<br>Dormir ahora es renunciar al día. Lo haces sin pensarlo.');
  } else if(franja === 'manana' || franja === 'tarde'){
    arr.push('A esta hora dormir es esconderse.<br>Lo prefieres. No te juzgues.');
  } else if(franja === 'anochecer' || franja === 'noche'){
    arr.push('Los neones de fuera pintan el techo de violeta y rojo.<br>Dormir aquí es como dormir dentro de un anuncio.');
  }

  // Día
  if(dia === 'finde' && (franja === 'madrugada' || franja === 'noche')){
    arr.push('Música amortiguada de un bar a tres calles.<br>Alguien grita por ganar algo. O por perderlo.');
  }

  // Estado humano
  if(nivel(h.aislamiento) === 'alto' || nivel(h.aislamiento) === 'extremo'){
    arr.push('La cama está fría en los dos lados.<br>Solo usas uno. Eso no debería sorprenderte ya.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    arr.push('El estómago hace ruido. Le pides que se calle.<br>Te ignora.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    arr.push('Te ves dormir desde fuera.<br>Decides no decírtelo cuando despiertes.');
  }

  return arr;
}

function textosSalir(misionCerrada, m, h, franja, dia){
  const arr = [];

  // Salir sigue siendo placeholder, pero la atmósfera puede cambiar.
  arr.push('Aún no hay otros sitios a los que ir desde aquí.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  arr.push('Pones la mano sobre el cerrojo. No lo abres.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  arr.push('Aún no es momento de salir.<br>Aún no sabes adónde irías.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');

  if(franja === 'madrugada'){
    arr.push('A esta hora, salir es buscar problemas que aún no te buscan.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  } else if(franja === 'amanecer'){
    arr.push('El distrito empieza a despertarse.<br>Hoy no te toca a ti.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  } else if(franja === 'noche' && dia === 'finde'){
    arr.push('Noche de fin de semana. Las calles llenas.<br>Mejor mañana. O nunca.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  }

  if(misionCerrada){
    arr.push('Ya has salido bastante por esta noche.<br><span style="opacity:0.6">// PRÓXIMAMENTE</span>');
  }

  return arr;
}

// Regenera el menú del apartamento con las 4 opciones. Se usa
// tras leer un texto narrativo (mirar ventana, intento de salir,
// terminal sin mensajes, etc.) para volver al estado "decidiendo".
function regenerarOpcionesAptCierre(){
  const opc = document.getElementById('opciones-apt');
  if(!opc) return;
  const misionCerrada = Estado.mision === 'volvioApartamento';
  if(misionCerrada){
    // Versión post-misión: textos más cansados.
    opc.innerHTML = `
      ${botonVentana("Mirar por la ventana")}
      <button class="opcion-btn" onclick="opcionApt(2)">Dormir</button>
      <button class="opcion-btn" onclick="abrirMapa()">Salir del apartamento</button>
      <button class="opcion-btn" onclick="opcionApt(1)">Revisar el terminal</button>`;
  } else {
    // Estado normal: dejamos que el ajustador escoja los textos.
    if(typeof ajustarTextosApartamentoSegunMemoria === 'function'){
      ajustarTextosApartamentoSegunMemoria();
    }
  }
}

// Llamado cuando el jugador pulsa "dormir" después de volver de la misión.
// Lleva al "eco" del apartamento que cierra el día sin forzar el final.
function dormirYCerrarDia(){
  // === DORMIR ES SIEMPRE UN DESCANSO, NUNCA UN FINAL ===
  // El juego no termina por dormir. Se avanza tiempo, se recupera fatiga,
  // y se vuelve al apartamento con todas las opciones. Esto permite jugar
  // múltiples días, ver más recibos, más eventos, etc.
  //
  // Solo la PRIMERA VEZ que se duerme después de completar la misión Mara
  // se muestra el "eco" como pieza narrativa breve de cierre de arco. Tras
  // leerlo, el jugador vuelve al apartamento y la vida sigue.
  const yaVioEco = Estado.memoria && Estado.memoria.ecoVisto;
  const misionRecienHecha = Estado.mision === 'volvioApartamento' && !yaVioEco;

  if(misionRecienHecha){
    // Primera (y única) vez: pieza narrativa del eco. Luego vuelve al apt.
    saltoDeEscena();
    ajustarHumano('fatiga', -10);
    // Marcamos el arco principal como cerrado pero la PARTIDA SIGUE VIVA.
    Estado.mision = 'completada';
    if(Estado.memoria) Estado.memoria.ecoVisto = true;
    Estado.partidasCompletadas = (Estado.partidasCompletadas || 0) + 1;
    if(typeof guardarPartida === 'function') guardarPartida();
    cambiarEscena('apartamento', 'eco-escena');
    if(typeof mostrarEcoMensaje === 'function') mostrarEcoMensaje();
    return;
  }

  // Cualquier otro caso (antes de misión, o ya viste el eco): solo descansas.
  saltoDeEscena();
  ajustarHumano('fatiga', -8);
  ajustarHumano('aislamiento', 2);
  // Avanzar el tiempo del juego unas 6-8 horas.
  if(typeof avanzarTiempoJuego === 'function'){
    avanzarTiempoJuego(60 * (6 + Math.floor(Math.random() * 3)));
  }
  // Guardar y mostrar un texto breve al despertar, manteniendo
  // al jugador en el apartamento con sus 4 opciones.
  if(typeof guardarPartida === 'function') guardarPartida();
  const narr = document.getElementById('narr-apt');
  if(narr){
    narr.style.animation = 'none';
    narr.style.opacity = '0';
    const textosDespertar = [
      'Te despiertas sin saber cuánto has dormido.<br>La lluvia sigue golpeando el cristal.',
      'Abres los ojos. La habitación está igual.<br>Tú también.',
      'Sueñas con una luz fluorescente. Te despiertas.<br>Era el techo.',
      'Has dormido. Lo notas porque tienes hambre.<br>No mucho más.'
    ];
    narr.innerHTML = textosDespertar[Math.floor(Math.random() * textosDespertar.length)];
    setTimeout(()=>{ narr.style.animation = 'aparecer 0.6s ease forwards'; }, 50);
  }
  // Regenerar las opciones del apartamento.
  if(typeof regenerarOpcionesAptCierre === 'function') regenerarOpcionesAptCierre();
}


// ============================================================