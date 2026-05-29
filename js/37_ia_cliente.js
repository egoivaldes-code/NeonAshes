// ============================================================
//  BLOQUE JS-50 — CLIENTE IA
//  ----------------------------------------------------------
//  Para qué sirve:
//    Es el único sitio del juego que habla con la IA.
//    Todo el resto del código que necesite generar narrativa
//    llama aquí. Si mañana cambiamos de proveedor (Gemini →
//    Groq → OpenRouter), se cambia solo en este archivo.
//
//  Qué hace, paso a paso:
//    1. Recibe un "system prompt" (las reglas del director
//       narrativo) y un "contexto de escena" (lo que pasa
//       ahora: dónde está el jugador, qué NPC, qué stats…).
//    2. Coge la API key de localStorage (o del LAUNCHER si
//       no hay nada en localStorage). Si no hay ninguna, falla
//       limpiamente con un mensaje claro.
//    3. Llama al proveedor configurado en el LAUNCHER.
//    4. Espera la respuesta con un timeout (si tarda demasiado,
//       corta).
//    5. Intenta parsear la respuesta como JSON.
//    6. Si todo va bien: devuelve { ok:true, datos:{...} }.
//       Si algo falla: devuelve { ok:false, error:"...", crudo:"..." }.
//
//  Por qué no llama directo desde el navegador a Anthropic:
//    Porque Anthropic no permite llamadas desde navegador
//    (bloquea por CORS). Gemini sí lo permite. Groq también.
//    Por eso el doc eligió esos dos.
//
//  Telemetría:
//    Si LAUNCHER.API_LOG_LLAMADAS está activado, cuenta cada
//    llamada en localStorage. Si API_LOG_TOKENS está activado,
//    estima cuántos tokens consumió (aproximación tosca:
//    4 caracteres ≈ 1 token).
// ============================================================

window.IA = (function(){

  // ──────────────────────────────────────────────────────────
  //  CLAVES DE LOCALSTORAGE
  //  Donde guardamos la key del usuario y los contadores.
  // ──────────────────────────────────────────────────────────
  const LS_KEY_OPENROUTER = 'neon_ashes_api_key_openrouter';
  const LS_KEY_GEMINI     = 'neon_ashes_api_key_gemini';
  const LS_KEY_GROQ       = 'neon_ashes_api_key_groq';
  const LS_LOG_LLAMADAS   = 'neon_ashes_ia_contador_llamadas';
  const LS_LOG_TOKENS     = 'neon_ashes_ia_contador_tokens';
  const LS_ULTIMA         = 'neon_ashes_ia_ultima_respuesta';

  // ──────────────────────────────────────────────────────────
  //  GESTIÓN DE LA API KEY
  //  Orden de búsqueda: localStorage → LAUNCHER → vacío.
  // ──────────────────────────────────────────────────────────
  function obtenerApiKey(proveedor){
    if(proveedor === 'openrouter'){
      const ls = localStorage.getItem(LS_KEY_OPENROUTER);
      if(ls && ls.trim().length > 0) return ls.trim();
      if(LAUNCHER.API_KEY_OPENROUTER && LAUNCHER.API_KEY_OPENROUTER.length > 0){
        return LAUNCHER.API_KEY_OPENROUTER;
      }
      return null;
    }
    if(proveedor === 'gemini'){
      const ls = localStorage.getItem(LS_KEY_GEMINI);
      if(ls && ls.trim().length > 0) return ls.trim();
      if(LAUNCHER.API_KEY_GEMINI && LAUNCHER.API_KEY_GEMINI.length > 0){
        return LAUNCHER.API_KEY_GEMINI;
      }
      return null;
    }
    if(proveedor === 'groq'){
      const ls = localStorage.getItem(LS_KEY_GROQ);
      if(ls && ls.trim().length > 0) return ls.trim();
      if(LAUNCHER.API_KEY_GROQ && LAUNCHER.API_KEY_GROQ.length > 0){
        return LAUNCHER.API_KEY_GROQ;
      }
      return null;
    }
    return null;
  }

  function guardarApiKey(proveedor, key){
    const limpia = (key || '').trim();
    if(proveedor === 'openrouter'){
      if(limpia.length === 0) localStorage.removeItem(LS_KEY_OPENROUTER);
      else localStorage.setItem(LS_KEY_OPENROUTER, limpia);
    } else if(proveedor === 'gemini'){
      if(limpia.length === 0) localStorage.removeItem(LS_KEY_GEMINI);
      else localStorage.setItem(LS_KEY_GEMINI, limpia);
    } else if(proveedor === 'groq'){
      if(limpia.length === 0) localStorage.removeItem(LS_KEY_GROQ);
      else localStorage.setItem(LS_KEY_GROQ, limpia);
    }
  }

  function hayApiKey(proveedor){
    return obtenerApiKey(proveedor) !== null;
  }

  // ──────────────────────────────────────────────────────────
  //  TELEMETRÍA LOCAL
  // ──────────────────────────────────────────────────────────
  function leerContador(clave){
    const v = parseInt(localStorage.getItem(clave) || '0', 10);
    return isNaN(v) ? 0 : v;
  }

  function sumarContador(clave, cuanto){
    const actual = leerContador(clave);
    localStorage.setItem(clave, String(actual + cuanto));
  }

  function resetTelemetria(){
    localStorage.removeItem(LS_LOG_LLAMADAS);
    localStorage.removeItem(LS_LOG_TOKENS);
  }

  function estadoTelemetria(){
    return {
      llamadas: leerContador(LS_LOG_LLAMADAS),
      tokens:   leerContador(LS_LOG_TOKENS)
    };
  }

  // Estimación tosca: 1 token ≈ 4 caracteres en español.
  // Sirve para tener una idea de coste, no para facturación.
  function estimarTokens(texto){
    if(!texto) return 0;
    return Math.ceil(texto.length / 4);
  }

  // ──────────────────────────────────────────────────────────
  //  ÚLTIMA RESPUESTA (para el panel de depuración)
  // ──────────────────────────────────────────────────────────
  function guardarUltima(obj){
    try {
      localStorage.setItem(LS_ULTIMA, JSON.stringify(obj));
    } catch(e){ /* ignorar si localStorage está lleno */ }
  }

  function leerUltima(){
    try {
      const raw = localStorage.getItem(LS_ULTIMA);
      if(!raw) return null;
      return JSON.parse(raw);
    } catch(e){ return null; }
  }

  // ──────────────────────────────────────────────────────────
  //  PARSEO DE LA RESPUESTA
  //  La IA debería devolver SOLO un JSON. A veces lo envuelve
  //  en ```json ... ``` o le añade texto antes/después. Esta
  //  función intenta recuperarlo aunque venga sucio.
  // ──────────────────────────────────────────────────────────
  function extraerJSON(texto){
    if(!texto || typeof texto !== 'string') return null;

    // Quitar bloques de markdown ```json ... ```
    let limpio = texto.replace(/```json\s*/gi, '').replace(/```/g, '').trim();

    // Si arranca con { y acaba con }, intentar directo
    if(limpio.startsWith('{') && limpio.endsWith('}')){
      try { return JSON.parse(limpio); } catch(e){ /* sigue */ }
    }

    // Buscar el primer { y el último } y probar lo de en medio
    const primerLlave  = limpio.indexOf('{');
    const ultimaLlave  = limpio.lastIndexOf('}');
    if(primerLlave !== -1 && ultimaLlave > primerLlave){
      const candidato = limpio.substring(primerLlave, ultimaLlave + 1);
      try { return JSON.parse(candidato); } catch(e){ /* sigue */ }
    }

    return null;
  }

  // ──────────────────────────────────────────────────────────
  //  LLAMADA A OPENROUTER
  //  Documentación: https://openrouter.ai/docs
  //  Formato compatible con OpenAI (messages[]). Permite CORS
  //  desde el navegador, igual que Groq.
  // ──────────────────────────────────────────────────────────
  async function llamarOpenRouter(systemPrompt, contextoEscena){
    const apiKey = obtenerApiKey('openrouter');
    if(!apiKey){
      return { ok:false, error:'NO_API_KEY', mensaje:'No hay API key de OpenRouter configurada.' };
    }

    const modelo = LAUNCHER.API_MODELO_OPENROUTER || 'qwen/qwen3-8b:free';
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const cuerpo = {
      model: modelo,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: contextoEscena }
      ],
      temperature: LAUNCHER.API_TEMPERATURA ?? 0.85,
      max_tokens:  LAUNCHER.API_MAX_TOKENS_RESPUESTA ?? 800,
      response_format: { type: 'json_object' }
    };

    const ctrl = new AbortController();
    const timeoutMs = LAUNCHER.API_TIMEOUT_MS ?? 10000;
    const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'NEON ASHES'
        },
        body: JSON.stringify(cuerpo),
        signal: ctrl.signal
      });
      clearTimeout(timeoutId);

      if(!res.ok){
        const errorTxt = await res.text().catch(()=>'');
        return {
          ok:false,
          error:`HTTP_${res.status}`,
          mensaje:`OpenRouter respondió ${res.status}.`,
          crudo: errorTxt
        };
      }

      const data = await res.json();
      const textoCrudo = data?.choices?.[0]?.message?.content || '';

      if(!textoCrudo){
        return {
          ok:false,
          error:'RESPUESTA_VACIA',
          mensaje:'OpenRouter devolvió una respuesta vacía.',
          crudo: JSON.stringify(data)
        };
      }

      const parseado = extraerJSON(textoCrudo);
      if(!parseado){
        return {
          ok:false,
          error:'JSON_INVALIDO',
          mensaje:'La respuesta de OpenRouter no es JSON válido.',
          crudo: textoCrudo
        };
      }

      return { ok:true, datos: parseado, crudo: textoCrudo, proveedor: 'openrouter' };

    } catch(e){
      clearTimeout(timeoutId);
      if(e.name === 'AbortError'){
        return { ok:false, error:'TIMEOUT', mensaje:`OpenRouter tardó más de ${timeoutMs}ms.` };
      }
      return { ok:false, error:'EXCEPCION', mensaje: e.message || String(e) };
    }
  }

  // ──────────────────────────────────────────────────────────
  //  LLAMADA A GEMINI
  //  Documentación: https://ai.google.dev/api/generate-content
  // ──────────────────────────────────────────────────────────
  async function llamarGemini(systemPrompt, contextoEscena){
    const apiKey = obtenerApiKey('gemini');
    if(!apiKey){
      return { ok:false, error:'NO_API_KEY', mensaje:'No hay API key de Gemini configurada.' };
    }

    const modelo = LAUNCHER.API_MODELO_GEMINI || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

    const cuerpo = {
      // En Gemini, el system prompt va aparte:
      systemInstruction: { parts: [{ text: systemPrompt }] },
      // El contexto de la escena va como mensaje del usuario:
      contents: [{ role: 'user', parts: [{ text: contextoEscena }] }],
      generationConfig: {
        temperature: LAUNCHER.API_TEMPERATURA ?? 0.85,
        maxOutputTokens: LAUNCHER.API_MAX_TOKENS_RESPUESTA ?? 800,
        // Pedirle explícitamente respuesta en JSON:
        responseMimeType: 'application/json'
      }
    };

    // Control de timeout: si tarda más de X ms, abortamos.
    const ctrl = new AbortController();
    const timeoutMs = LAUNCHER.API_TIMEOUT_MS ?? 8000;
    const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
        signal: ctrl.signal
      });
      clearTimeout(timeoutId);

      if(!res.ok){
        const errorTxt = await res.text().catch(()=>'');
        return {
          ok:false,
          error:`HTTP_${res.status}`,
          mensaje:`Gemini respondió ${res.status}.`,
          crudo: errorTxt
        };
      }

      const data = await res.json();
      const textoCrudo = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if(!textoCrudo){
        return {
          ok:false,
          error:'RESPUESTA_VACIA',
          mensaje:'Gemini devolvió una respuesta vacía.',
          crudo: JSON.stringify(data)
        };
      }

      const parseado = extraerJSON(textoCrudo);
      if(!parseado){
        return {
          ok:false,
          error:'JSON_INVALIDO',
          mensaje:'La respuesta de Gemini no es JSON válido.',
          crudo: textoCrudo
        };
      }

      return { ok:true, datos: parseado, crudo: textoCrudo, proveedor: 'gemini' };

    } catch(e){
      clearTimeout(timeoutId);
      if(e.name === 'AbortError'){
        return { ok:false, error:'TIMEOUT', mensaje:`Gemini tardó más de ${timeoutMs}ms.` };
      }
      return { ok:false, error:'EXCEPCION', mensaje: e.message || String(e) };
    }
  }

  // ──────────────────────────────────────────────────────────
  //  LLAMADA A GROQ
  //  Documentación: https://console.groq.com/docs/api-reference
  //  (formato compatible con OpenAI: messages[])
  // ──────────────────────────────────────────────────────────
  async function llamarGroq(systemPrompt, contextoEscena){
    const apiKey = obtenerApiKey('groq');
    if(!apiKey){
      return { ok:false, error:'NO_API_KEY', mensaje:'No hay API key de Groq configurada.' };
    }

    const modelo = LAUNCHER.API_MODELO_GROQ || 'llama-3.3-70b-versatile';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const cuerpo = {
      model: modelo,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: contextoEscena }
      ],
      temperature: LAUNCHER.API_TEMPERATURA ?? 0.85,
      max_tokens:  LAUNCHER.API_MAX_TOKENS_RESPUESTA ?? 800,
      response_format: { type: 'json_object' }
    };

    const ctrl = new AbortController();
    const timeoutMs = LAUNCHER.API_TIMEOUT_MS ?? 8000;
    const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(cuerpo),
        signal: ctrl.signal
      });
      clearTimeout(timeoutId);

      if(!res.ok){
        const errorTxt = await res.text().catch(()=>'');
        return {
          ok:false,
          error:`HTTP_${res.status}`,
          mensaje:`Groq respondió ${res.status}.`,
          crudo: errorTxt
        };
      }

      const data = await res.json();
      const textoCrudo = data?.choices?.[0]?.message?.content || '';

      if(!textoCrudo){
        return {
          ok:false,
          error:'RESPUESTA_VACIA',
          mensaje:'Groq devolvió una respuesta vacía.',
          crudo: JSON.stringify(data)
        };
      }

      const parseado = extraerJSON(textoCrudo);
      if(!parseado){
        return {
          ok:false,
          error:'JSON_INVALIDO',
          mensaje:'La respuesta de Groq no es JSON válido.',
          crudo: textoCrudo
        };
      }

      return { ok:true, datos: parseado, crudo: textoCrudo, proveedor: 'groq' };

    } catch(e){
      clearTimeout(timeoutId);
      if(e.name === 'AbortError'){
        return { ok:false, error:'TIMEOUT', mensaje:`Groq tardó más de ${timeoutMs}ms.` };
      }
      return { ok:false, error:'EXCEPCION', mensaje: e.message || String(e) };
    }
  }

  // ──────────────────────────────────────────────────────────
  //  LLAMADA AL PORTERO (Cloudflare Worker)
  //  Esta es la forma SEGURA y por defecto. El navegador NO lleva
  //  ninguna API key: se la manda al Worker, que tiene la key de
  //  Groq guardada a salvo y hace la llamada real por nosotros.
  //  La URL del Worker está en LAUNCHER.API_URL_PORTERO.
  // ──────────────────────────────────────────────────────────
  async function llamarPortero(systemPrompt, contextoEscena){
    const url = LAUNCHER.API_URL_PORTERO;
    if(!url){
      return { ok:false, error:'NO_URL_PORTERO', mensaje:'No hay URL de portero configurada en el LAUNCHER.' };
    }

    const ctrl = new AbortController();
    const timeoutMs = LAUNCHER.API_TIMEOUT_MS ?? 12000;
    const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: systemPrompt,
          contextoEscena: contextoEscena,
          modelo: LAUNCHER.API_MODELO_GROQ || 'llama-3.1-8b-instant',
          temperatura: LAUNCHER.API_TEMPERATURA ?? 0.85,
          maxTokens: LAUNCHER.API_MAX_TOKENS_RESPUESTA ?? 800
        }),
        signal: ctrl.signal
      });
      clearTimeout(timeoutId);

      if(!res.ok){
        const errorTxt = await res.text().catch(()=>'');
        return {
          ok:false,
          error:`HTTP_${res.status}`,
          mensaje:`El portero respondió ${res.status}.`,
          crudo: errorTxt
        };
      }

      const data = await res.json();
      const textoCrudo = data?.choices?.[0]?.message?.content || '';

      if(!textoCrudo){
        return {
          ok:false,
          error:'RESPUESTA_VACIA',
          mensaje:'El portero devolvió una respuesta vacía.',
          crudo: JSON.stringify(data)
        };
      }

      const parseado = extraerJSON(textoCrudo);
      if(!parseado){
        return {
          ok:false,
          error:'JSON_INVALIDO',
          mensaje:'La respuesta del portero no es JSON válido.',
          crudo: textoCrudo
        };
      }

      return { ok:true, datos: parseado, crudo: textoCrudo, proveedor: 'portero' };

    } catch(e){
      clearTimeout(timeoutId);
      if(e.name === 'AbortError'){
        return { ok:false, error:'TIMEOUT', mensaje:`El portero tardó más de ${timeoutMs}ms.` };
      }
      return { ok:false, error:'EXCEPCION', mensaje: e.message || String(e) };
    }
  }

  // ──────────────────────────────────────────────────────────
  //  DESPACHADOR
  //  Mira el LAUNCHER y elige a quién llamar.
  // ──────────────────────────────────────────────────────────
  async function llamarProveedor(nombre, systemPrompt, contextoEscena){
    if(nombre === 'portero')    return llamarPortero(systemPrompt, contextoEscena);
    if(nombre === 'openrouter') return llamarOpenRouter(systemPrompt, contextoEscena);
    if(nombre === 'gemini')     return llamarGemini(systemPrompt, contextoEscena);
    if(nombre === 'groq')       return llamarGroq(systemPrompt, contextoEscena);
    return { ok:false, error:'PROVEEDOR_DESCONOCIDO', mensaje:`No conozco el proveedor "${nombre}".` };
  }

  // ──────────────────────────────────────────────────────────
  //  FUNCIÓN PRINCIPAL — la única que el resto del juego usa
  //
  //  Uso:
  //    const r = await IA.llamar(systemPrompt, contextoEscena);
  //    if(r.ok){
  //      console.log(r.datos);    // el JSON ya parseado
  //    } else {
  //      console.warn(r.error, r.mensaje);
  //    }
  // ──────────────────────────────────────────────────────────
  async function llamar(systemPrompt, contextoEscena){
    const principal  = LAUNCHER.API_PROVEEDOR_PRINCIPAL || 'portero';
    const fallback   = LAUNCHER.API_PROVEEDOR_FALLBACK  || null;
    const reintentos = LAUNCHER.API_REINTENTOS_POR_PROVEEDOR ?? 1;

    let ultimoFallo = null;

    // Telemetría: contar la llamada antes de hacerla
    if(LAUNCHER.API_LOG_LLAMADAS){
      sumarContador(LS_LOG_LLAMADAS, 1);
    }
    if(LAUNCHER.API_LOG_TOKENS){
      const tokensEntrada = estimarTokens(systemPrompt) + estimarTokens(contextoEscena);
      sumarContador(LS_LOG_TOKENS, tokensEntrada);
    }

    // Intento con el principal (más reintentos si está configurado)
    for(let i = 0; i <= reintentos; i++){
      const r = await llamarProveedor(principal, systemPrompt, contextoEscena);
      if(r.ok){
        if(LAUNCHER.API_LOG_TOKENS){
          sumarContador(LS_LOG_TOKENS, estimarTokens(r.crudo));
        }
        guardarUltima({ ts: Date.now(), peticion: { systemPrompt, contextoEscena }, respuesta: r });
        return r;
      }
      ultimoFallo = r;
      // Si el fallo es por falta de API key o por JSON inválido, no tiene sentido reintentar.
      if(r.error === 'NO_API_KEY' || r.error === 'JSON_INVALIDO') break;
    }

    // Fallback (si está configurado y es distinto al principal)
    if(fallback && fallback !== principal){
      for(let i = 0; i <= reintentos; i++){
        const r = await llamarProveedor(fallback, systemPrompt, contextoEscena);
        if(r.ok){
          if(LAUNCHER.API_LOG_TOKENS){
            sumarContador(LS_LOG_TOKENS, estimarTokens(r.crudo));
          }
          guardarUltima({ ts: Date.now(), peticion: { systemPrompt, contextoEscena }, respuesta: r });
          return r;
        }
        ultimoFallo = r;
        if(r.error === 'NO_API_KEY' || r.error === 'JSON_INVALIDO') break;
      }
    }

    // Todo falló
    guardarUltima({ ts: Date.now(), peticion: { systemPrompt, contextoEscena }, respuesta: ultimoFallo });
    return ultimoFallo || { ok:false, error:'DESCONOCIDO', mensaje:'Falló todo sin razón clara.' };
  }

  // ──────────────────────────────────────────────────────────
  //  API PÚBLICA del módulo
  // ──────────────────────────────────────────────────────────
  return {
    llamar,                  // función principal — la única que necesitas
    obtenerApiKey,           // lectura
    guardarApiKey,           // escritura desde el panel
    hayApiKey,               // ¿está configurada?
    estadoTelemetria,        // { llamadas, tokens }
    resetTelemetria,         // botón de reseteo
    leerUltima,              // última respuesta (panel)
    estimarTokens            // utilidad pública (para previsualizar coste)
  };

})();
