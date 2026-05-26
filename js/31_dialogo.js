// ============================================================
// BLOQUE JS-39 — BURBUJAS DE DIÁLOGO y OPCIONES (genéricas)
// Funciones reutilizables que pintan diálogos y botones de opción.
// ============================================================

function agregarBurbuja(quien,texto,esJ){
  return new Promise(resolve=>{
    const zona=document.getElementById('zona-dialogo'),inner=document.getElementById('mercado-inner');
    const b=document.createElement('div');b.className=`burbuja-dialogo ${esJ?'burbuja-jugador':''}`;
    b.style.cssText='opacity:0;transform:translateY(8px);transition:all 0.4s ease';
    b.innerHTML=`<div class="burbuja-nombre">${quien}</div><div class="burbuja-texto">${texto}</div>`;
    zona.appendChild(b);
    setTimeout(()=>{b.style.opacity='1';b.style.transform='translateY(0)';inner.scrollTop=inner.scrollHeight;},50);
    setTimeout(resolve,500);
  });
}

function mostrarOpciones(opciones,zona,zonaOpc){
  const inner=document.getElementById('mercado-inner');
  const div=document.createElement('div');div.className='opciones-dialogo';
  opciones.forEach((op,i)=>{
    const btn=document.createElement('button');
    btn.className=`opcion-dialogo ${op.s?'silencio':''}`;
    btn.setAttribute('data-num',`0${i+1}`);
    btn.textContent=op.txt;
    btn.onclick=()=>elegirOpcion(op,op.txt);
    div.appendChild(btn);
  });
  zonaOpc.innerHTML='';zonaOpc.appendChild(div);
  inner.scrollTop=inner.scrollHeight;
}

async function elegirOpcion(op,txt){
  document.getElementById('mercado-opciones').innerHTML='';
  await agregarBurbuja(`${Estado.jugador.nombre.toUpperCase()} ${Estado.jugador.apellido1.toUpperCase()}`,txt,true);
  Estado.historialDialogo.push({rol:'jugador',texto:txt});

  // ANOTAR EN LA LIBRETA DE MEMORIA
  // Cada elección significativa deja un rastro silencioso.
  if(op.sig === 8){ // aceptó el encargo
    recordar('aceptoEncargo', true);
    ajustarMemoria('confianzaMara', 2);
    if(!Estado.memoria.tonoJugador) recordar('tonoJugador', 'directo');
    // ESTADO HUMANO: aceptar te da perspectiva (créditos próximos) y calma
    // el ansia del estómago. Pero te carga de fatiga: la noche va a ser larga.
    ajustarHumano('hambre', -3);
    ajustarHumano('fatiga', 4);
    // El trabajo cambia de estado: pasa de "pendiente" a "aceptado".
    // El jugador debería notarlo cuando vuelva al apartamento.
    marcarTrabajosActualizado();
    // MISIÓN: arranca la fase "mensajeRecibido". Mara prometió coordenadas
    // al amanecer. El mensaje llegará al terminal en cuanto el jugador lo abra.
    Estado.mision = 'mensajeRecibido';
    Estado.terminalPendientes.push({ tipo: 'misionMara' });
  }
  if(op.sig === 11){ // rechazó el encargo
    recordar('aceptoEncargo', false);
    ajustarMemoria('confianzaMara', -1);
    if(!Estado.memoria.tonoJugador) recordar('tonoJugador', 'cauto');
    // ESTADO HUMANO: rechazar te deja sin ingresos previstos. El estómago
    // toma nota. Y la soledad de volver con las manos vacías también.
    ajustarHumano('hambre', 6);
    ajustarHumano('aislamiento', 8);
    // El trabajo cambia de estado: pasa de "pendiente" a "rechazado".
    marcarTrabajosActualizado();
  }
  if(op.sig === 9){ // pidió más info (rama IA)
    recordar('pidioMasInfo', true);
    ajustarMemoria('vecesPidioInfo', 1);
    ajustarMemoria('confianzaMara', -1);
    recordar('tonoJugador', 'cauto');
    // ESTADO HUMANO: preguntar cansa.
    ajustarHumano('fatiga', 3);
  }
  if(op.sig === 10){ // eligió silencio / pensar
    recordar('guardoSilencio', true);
    recordar('tonoJugador', 'frio');
    // ESTADO HUMANO: el silencio pesa.
    ajustarHumano('aislamiento', 6);
    ajustarHumano('fatiga', 1);
  }
  // Preguntas exploratorias dentro de la conversación (sig 1, 2, 3, 6, 7 son preguntas)
  if([1,2,3,6,7].includes(op.sig)){
    ajustarMemoria('vecesPidioInfo', 1);
    ajustarHumano('fatiga', 1);
  }
  // Silencio dentro del diálogo (opción 2 — obedeces)
  if(op.sig === 2){
    ajustarHumano('aislamiento', 3);
  }

  // PERSISTENCIA: las decisiones grandes se guardan en localStorage.
  if([8, 9, 10, 11].includes(op.sig)){
    guardarPartida();
  }

  await esperar(400);
  mostrarNodoDialogo(op.sig);
}

// Construye una descripción del jugador basada en la libreta de memoria.
// Esto es lo que la IA leerá para entender CON QUIÉN está hablando.

// ============================================================

// ============================================================
// BLOQUE JS-40 — DESCRIPCIÓN DEL JUGADOR para la IA
// Construye el prompt que se envía a Claude (la IA) con todo lo
//   que sabemos del jugador y de sus decisiones. Es lo que hace que
//   Mara responda contextualmente.
// ============================================================

function describirJugadorParaIA(){
  const m = Estado.memoria || {};
  const partes = [];

  // Tono dominante del jugador hasta ahora
  if(m.tonoJugador === 'directo'){
    partes.push('El jugador ha sido DIRECTO hasta ahora: pocas preguntas, sin rodeos. Habla como a un igual: corto, casi cómplice, sin condescendencia.');
  } else if(m.tonoJugador === 'cauto'){
    partes.push('El jugador es CAUTO: pregunta antes de decidir, sopesa todo. Te genera cierto fastidio sutil. Devuélvele alguna pregunta, dale menos información de la que pide.');
  } else if(m.tonoJugador === 'frio'){
    partes.push('El jugador es FRÍO Y SILENCIOSO: apenas habla, observa. Te interesa. Baja el ritmo, suelta menos palabras, deja espacios entre frases.');
  }

  // Cantidad de preguntas previas
  if(m.vecesPidioInfo >= 3){
    partes.push('Lleva PREGUNTANDO MUCHO esta noche. Está empezando a cansarte.');
  } else if(m.vecesPidioInfo === 0){
    partes.push('No ha preguntado casi nada antes. Eso es raro, y te llama la atención.');
  }

  // Si ha guardado silencio explícito
  if(m.guardoSilencio){
    partes.push('Ha elegido el silencio antes. Sabes que es alguien que mide las palabras.');
  }

  // Nivel de confianza interno de Mara hacia él (NO se lo dices al jugador, pero te guía el tono)
  if(m.confianzaMara >= 2){
    partes.push('Internamente CONFÍAS un poco en él. Eso no significa amabilidad: significa eficiencia. Le hablas con menos rodeos.');
  } else if(m.confianzaMara <= -2){
    partes.push('Internamente DESCONFÍAS de él. Eres más reservada, más cortante.');
  }

  // Mara nota el estado físico/mental del jugador. Es fixer experimentada.
  const h = Estado.humano || {};
  if(nivel(h.fatiga) === 'alto' || nivel(h.fatiga) === 'extremo'){
    partes.push('NOTAS que el jugador parece AGOTADO. Tiene mala cara. Puedes mencionarlo de pasada, sin compasión, como observación profesional.');
  }
  if(nivel(h.disociacion) === 'alto' || nivel(h.disociacion) === 'extremo'){
    partes.push('NOTAS que el jugador parece IDO, como si no estuviera del todo presente. Te inquieta sutilmente.');
  }
  if(nivel(h.hambre) === 'alto' || nivel(h.hambre) === 'extremo'){
    partes.push('NOTAS que el jugador parece HAMBRIENTO: mira la comida del bar más de la cuenta, traga saliva al hablar. Eso te dice que necesita los créditos urgente.');
  }

  // ============================================================
  // FASE C: Mara recuerda a los muertos
  // ============================================================
  // Si en partidas anteriores murió alguien que pasó por aquí,
  // Mara lo nota. Si el apellido del jugador actual coincide con
  // el del muerto, ella sospecha que es familia. Si no coincide,
  // hace una alusión sutil sin nombrarlo.
  if(muerteAunRecordada()){
    const m_ant = ultimoMuerto();
    if(m_ant && m_ant.decisiones && m_ant.decisiones.hablaronConMara){
      const apellidoNuevo = (Estado.jugador && Estado.jugador.apellido1) || '';
      const mismoApellido = apellidoNuevo && m_ant.apellido && apellidoNuevo.toLowerCase() === m_ant.apellido.toLowerCase();
      if(mismoApellido){
        partes.push(`IMPORTANTE: hace poco se sentó aquí alguien con tu mismo apellido (${m_ant.apellido}). Murió. Tú no eres él, pero el apellido es el mismo. Tienes una sospecha que no te quitas: ¿es familia? No lo preguntes directamente, deja caer una alusión casual una sola vez, y observa cómo reacciona.`);
      } else {
        partes.push(`IMPORTANTE: hace poco se sentó en este mismo sitio otra persona (${m_ant.nombre}). Murió. Tú no le tenías especial cariño, pero te quedó la imagen. Puedes mencionarlo de pasada, sin sentimentalismo, como observación profesional. Algo como "el último que se sentó ahí no salió de buena manera". No reveles el nombre completo.`);
      }
    }
  }

  if(partes.length === 0){
    return 'No tienes una impresión clara aún del jugador. Mantén tu tono profesional habitual.';
  }
  return partes.join(' ');
}

async function respuestaIA(){
  const zona=document.getElementById('zona-dialogo'),zonaOpc=document.getElementById('mercado-opciones');
  const p=document.createElement('div');p.className='pensando';
  p.innerHTML=`<span style="color:var(--magenta-dim)">MARA VEX</span><span class="dots-pensando"><span>·</span><span>·</span><span>·</span></span>`;
  zona.appendChild(p);
  document.getElementById('mercado-inner').scrollTop=document.getElementById('mercado-inner').scrollHeight;
  try{
    const hist=Estado.historialDialogo.map(h=>({role:h.rol==='jugador'?'user':'assistant',content:h.texto}));
    // El prompt ahora incluye la lectura de la libreta de memoria.
    // Mara responde DIFERENTE según cómo le haya hablado el jugador.
    const contextoJugador = describirJugadorParaIA();
    const sys = [
      `Eres MARA VEX, fixer independiente en el universo NEON ASHES, un mundo cyberpunk noir grounded y melancólico.`,
      ``,
      `IDENTIDAD:`,
      `- Inteligente, reservada, práctica, cínica, peligrosa.`,
      `- Noir. Frases cortas. Subtexto. Nunca explicas de más.`,
      `- NO eres una villana de caricatura. NO usas amenazas grandilocuentes.`,
      `- Tu fuerza viene de la experiencia y la economía verbal.`,
      ``,
      `EL JUGADOR:`,
      `- Nombre: ${Estado.jugador.nombre} ${Estado.jugador.apellido1}.`,
      `- Acaba de pedirte más información sobre el encargo (un paquete en el Nivel 4 por 30 créditos).`,
      ``,
      `LECTURA DE LA SITUACIÓN (úsala para calibrar tu tono, no la cites literalmente):`,
      contextoJugador,
      ``,
      `REGLAS DE RESPUESTA:`,
      `- Habla en español.`,
      `- Máximo 2-3 frases cortas. Esto NO es negociable.`,
      `- Cinematográfica. Implícita. Nunca expositiva.`,
      `- Evita lugares comunes ("la información tiene un precio", "el conocimiento mata", etc.).`,
      `- No reveles qué hay en el paquete. No es asunto del jugador todavía.`,
      `- Sugiere riesgo sin describirlo.`,
      `- Permanece en carácter siempre.`
    ].join('\n');
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:LAUNCHER.MODELO_IA,max_tokens:LAUNCHER.MAX_TOKENS_IA,system:sys,messages:hist.length>0?hist:[{role:'user',content:'Necesito más información antes de aceptar.'}]})});
    const data=await res.json(),txt=data.content?.[0]?.text||`Treinta créditos. Un paquete. No es un examen.`;
    zona.removeChild(p);
    Estado.historialDialogo.push({rol:'mara',texto:txt});
    await agregarBurbuja('MARA VEX',txt,false);
    setTimeout(()=>mostrarOpciones([{txt:'Acepto el encargo.',sig:8},{txt:'Demasiado riesgo. Me voy.',sig:11}],zona,zonaOpc),600);
  }catch(e){
    // Si la IA falla (sin conexión, sin API), Mara tiene una respuesta de respaldo
    // que ya está matizada por la libreta — al menos un mínimo de personalización.
    zona.removeChild(p);
    const m = Estado.memoria || {};
    let fallback = 'Treinta créditos por un paquete. Eso es todo lo que vas a saber esta noche.';
    if(m.tonoJugador === 'cauto' || m.vecesPidioInfo >= 2){
      fallback = 'Has preguntado lo suficiente. O aceptas, o vuelves a tu apartamento.';
    } else if(m.tonoJugador === 'frio'){
      fallback = 'Treinta créditos. El paquete pesa poco. Tú decides.';
    } else if(m.tonoJugador === 'directo'){
      fallback = 'Treinta créditos. Recoges. Entregas. Sin preguntas extra.';
    }
    await agregarBurbuja('MARA VEX', fallback, false);
    setTimeout(()=>mostrarOpciones([{txt:'Acepto.',sig:8},{txt:'No.',sig:11}],zona,zonaOpc),600);
  }
}


// ============================================================