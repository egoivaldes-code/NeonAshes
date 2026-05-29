// ============================================================
//  BLOQUE JS-59 — PANEL DE DEPURACIÓN DEL SISTEMA IA (Ctrl+I)
//  ----------------------------------------------------------
//  Para qué sirve:
//    Es un panel interno (solo para desarrollo, igual que el
//    Ctrl+D) donde puedes:
//      - Pegar tu API key de Gemini y guardarla.
//      - Ver cuántas llamadas a la IA llevas y cuántos tokens.
//      - Lanzar una "Llamada de prueba" con el system prompt
//        v1 del doc y un contexto de escena mínimo, para ver
//        si la IA responde correctamente en formato JSON.
//      - Ver la última respuesta cruda (lo que devolvió la IA
//        antes de parsear) y la parseada.
//      - Resetear contadores.
//
//  Activación: Ctrl + I (de "IA").
//  No hay tap para móvil porque este panel es solo PC, según
//  has dicho que vas a testear en PC.
//
//  Filosofía: este panel NUNCA se ve en producción. No afecta
//  al juego. Es nuestra ventana al motor mientras lo construimos.
// ============================================================

(function(){

  let _iaPanelVisible = false;
  let _iaPanelEl = null;
  let _iaIntervalo = null;

  // ──────────────────────────────────────────────────────────
  //  Crear el panel la primera vez que se abre
  // ──────────────────────────────────────────────────────────
  function crearPanel(){
    if(_iaPanelEl) return _iaPanelEl;

    const panel = document.createElement('div');
    panel.id = 'ia-debug-panel';
    panel.innerHTML = `
      <div class="ia-debug-titulo">
        <span>SISTEMA IA · v0.1</span>
        <button class="ia-debug-cerrar" id="ia-debug-cerrar">CERRAR</button>
      </div>

      <div class="ia-debug-seccion">
        <div class="ia-debug-seccion-label">◆ API KEY · OPENROUTER</div>
        <div class="ia-debug-key-row">
          <input type="password" id="ia-key-input" placeholder="pega aquí tu key de openrouter.ai" />
          <button class="ia-btn" id="ia-key-guardar">GUARDAR</button>
        </div>
        <div class="ia-debug-key-estado" id="ia-key-estado">—</div>
        <div class="ia-debug-hint">la key se guarda en este navegador (localStorage). no se sube a ningún sitio.</div>
      </div>

      <div class="ia-debug-seccion">
        <div class="ia-debug-seccion-label">◆ TELEMETRÍA LOCAL</div>
        <div class="ia-debug-fila"><span class="clave">llamadas</span><span class="valor" id="ia-tel-llamadas">0</span></div>
        <div class="ia-debug-fila"><span class="clave">tokens (estim.)</span><span class="valor" id="ia-tel-tokens">0</span></div>
        <button class="ia-btn peligro ia-btn-ancho" id="ia-tel-reset">RESETEAR CONTADORES</button>
      </div>

      <div class="ia-debug-seccion">
        <div class="ia-debug-seccion-label">◆ LLAMADA DE PRUEBA</div>
        <button class="ia-btn ia-btn-ancho" id="ia-prueba-lanzar">LANZAR LLAMADA DE PRUEBA</button>
        <div class="ia-debug-hint">usa el system prompt v1 del doc + un contexto mínimo de Vasek en LA TASCA.</div>
        <div id="ia-prueba-estado" class="ia-debug-estado">—</div>
      </div>

      <div class="ia-debug-seccion">
        <div class="ia-debug-seccion-label">◆ ÚLTIMA RESPUESTA</div>
        <div class="ia-debug-tabs">
          <button class="ia-tab activa" data-tab="parseada">PARSEADA</button>
          <button class="ia-tab" data-tab="cruda">CRUDA</button>
          <button class="ia-tab" data-tab="peticion">PETICIÓN</button>
        </div>
        <pre id="ia-ultima-vista" class="ia-debug-pre">(aún no hay respuestas)</pre>
      </div>
    `;
    document.body.appendChild(panel);
    _iaPanelEl = panel;

    // Listeners
    panel.querySelector('#ia-debug-cerrar').addEventListener('click', cerrarPanel);
    panel.querySelector('#ia-key-guardar').addEventListener('click', onGuardarKey);
    panel.querySelector('#ia-tel-reset').addEventListener('click', onResetTelemetria);
    panel.querySelector('#ia-prueba-lanzar').addEventListener('click', onLanzarPrueba);

    panel.querySelectorAll('.ia-tab').forEach(t => {
      t.addEventListener('click', () => {
        panel.querySelectorAll('.ia-tab').forEach(x => x.classList.remove('activa'));
        t.classList.add('activa');
        actualizarVistaUltima(t.dataset.tab);
      });
    });

    return panel;
  }

  // ──────────────────────────────────────────────────────────
  //  Abrir / cerrar
  // ──────────────────────────────────────────────────────────
  function abrirPanel(){
    crearPanel();
    _iaPanelEl.classList.add('visible');
    _iaPanelVisible = true;
    refrescarTodo();
    // Refresco periódico de la telemetría (por si hay llamadas
    // disparándose en paralelo desde otro flujo del juego)
    _iaIntervalo = setInterval(refrescarTelemetria, 1000);
  }

  function cerrarPanel(){
    if(_iaPanelEl) _iaPanelEl.classList.remove('visible');
    _iaPanelVisible = false;
    if(_iaIntervalo){ clearInterval(_iaIntervalo); _iaIntervalo = null; }
  }

  function togglePanel(){
    if(_iaPanelVisible) cerrarPanel();
    else abrirPanel();
  }

  // ──────────────────────────────────────────────────────────
  //  Refresco
  // ──────────────────────────────────────────────────────────
  function refrescarTodo(){
    refrescarKey();
    refrescarTelemetria();
    actualizarVistaUltima('parseada');
  }

  function refrescarKey(){
    const el = document.getElementById('ia-key-estado');
    if(!el) return;
    const proveedor = LAUNCHER.API_PROVEEDOR_PRINCIPAL || 'portero';
    // Con el portero (Cloudflare) la key vive en el servidor, no en
    // el navegador. No hay que configurar nada aquí.
    if(proveedor === 'portero'){
      el.textContent = '✓ usando portero seguro (la key vive en el servidor)';
      el.className = 'ia-debug-key-estado ok';
      return;
    }
    if(IA.hayApiKey(proveedor)){
      const k = IA.obtenerApiKey(proveedor);
      const corta = k.length > 12 ? k.substring(0,6) + '…' + k.substring(k.length-4) : '(corta)';
      el.textContent = `✓ configurada · ${corta}`;
      el.className = 'ia-debug-key-estado ok';
    } else {
      el.textContent = `✗ no hay key de ${proveedor} — la IA fallará`;
      el.className = 'ia-debug-key-estado fallo';
    }
  }

  function refrescarTelemetria(){
    const tel = IA.estadoTelemetria();
    const a = document.getElementById('ia-tel-llamadas');
    const b = document.getElementById('ia-tel-tokens');
    if(a) a.textContent = tel.llamadas;
    if(b) b.textContent = tel.tokens.toLocaleString('es-ES');
  }

  function actualizarVistaUltima(tab){
    const pre = document.getElementById('ia-ultima-vista');
    if(!pre) return;
    const ult = IA.leerUltima();
    if(!ult){
      pre.textContent = '(aún no hay respuestas)';
      return;
    }
    if(tab === 'parseada'){
      if(ult.respuesta?.ok){
        pre.textContent = JSON.stringify(ult.respuesta.datos, null, 2);
      } else {
        pre.textContent = `✗ FALLO\nerror: ${ult.respuesta?.error || '?'}\nmensaje: ${ult.respuesta?.mensaje || '?'}`;
      }
    } else if(tab === 'cruda'){
      pre.textContent = ult.respuesta?.crudo || '(sin texto crudo)';
    } else if(tab === 'peticion'){
      pre.textContent =
        '--- SYSTEM PROMPT ---\n' +
        (ult.peticion?.systemPrompt || '') +
        '\n\n--- CONTEXTO ESCENA ---\n' +
        (ult.peticion?.contextoEscena || '');
    }
  }

  // ──────────────────────────────────────────────────────────
  //  Handlers
  // ──────────────────────────────────────────────────────────
  function onGuardarKey(){
    const input = document.getElementById('ia-key-input');
    if(!input) return;
    const k = input.value.trim();
    const proveedor = LAUNCHER.API_PROVEEDOR_PRINCIPAL || 'openrouter';
    if(k.length === 0){
      IA.guardarApiKey(proveedor, '');
      input.value = '';
    } else {
      IA.guardarApiKey(proveedor, k);
      input.value = '';
    }
    refrescarKey();
  }

  function onResetTelemetria(){
    if(!confirm('¿Resetear contadores de llamadas y tokens?')) return;
    IA.resetTelemetria();
    refrescarTelemetria();
  }

  async function onLanzarPrueba(){
    const estado = document.getElementById('ia-prueba-estado');
    const btn = document.getElementById('ia-prueba-lanzar');
    if(!estado || !btn) return;

    const proveedor = LAUNCHER.API_PROVEEDOR_PRINCIPAL || 'portero';
    // El portero no necesita key en el navegador; solo bloqueamos
    // la prueba por falta de key con los proveedores directos.
    if(proveedor !== 'portero' && !IA.hayApiKey(proveedor)){
      estado.textContent = `✗ no hay API key de ${proveedor} configurada.`;
      estado.className = 'ia-debug-estado fallo';
      return;
    }

    estado.textContent = '… llamando a la IA …';
    estado.className = 'ia-debug-estado pendiente';
    btn.disabled = true;

    const t0 = Date.now();
    const r = await IA.llamar(SYSTEM_PROMPT_V1, CONTEXTO_PRUEBA);
    const ms = Date.now() - t0;
    btn.disabled = false;

    if(r.ok){
      estado.textContent = `✓ OK · ${r.proveedor} · ${ms}ms`;
      estado.className = 'ia-debug-estado ok';
    } else {
      estado.textContent = `✗ ${r.error} · ${r.mensaje || ''} · ${ms}ms`;
      estado.className = 'ia-debug-estado fallo';
    }

    // Forzar pestaña parseada y refrescar
    document.querySelectorAll('.ia-tab').forEach(x => x.classList.remove('activa'));
    const tabParseada = document.querySelector('.ia-tab[data-tab="parseada"]');
    if(tabParseada) tabParseada.classList.add('activa');
    actualizarVistaUltima('parseada');
    refrescarTelemetria();
  }

  // ──────────────────────────────────────────────────────────
  //  Contenido de la llamada de prueba
  //  - System prompt v1 EXACTO del doc Sesión 05, A14.1
  //  - Contexto de la escena: Vasek encarga el caso en LA TASCA
  //    (el ejemplo validado en sesión, A14.3)
  // ──────────────────────────────────────────────────────────
  const SYSTEM_PROMPT_V1 = `Eres el director narrativo de NEON ASHES, una simulación cyberpunk
noir grounded. Generas escenas para casos de investigación que vive
un ciudadano ordinario de los Lower Stacks.

TONO:
Noir adulto. Melancólico, íntimo, atmosférico. Subtexto sobre
exposición. La gente implica, no explica. El silencio importa.
Sensorial: lluvia ácida, hormigón mojado, hologramas distantes.

PROHIBIDO:
- Nacionalidades, idiomas o lugares reales.
- Marcas, productos o décadas reales.
- Menores en cualquier contexto.
- Humor Marvel, melodrama, exposición de lore.
- Decidir consecuencias numéricas (stats, dinero, reputación).
  Solo etiquetas tu trabajo; el código calcula.

LENGUAJE:
Castellano neutro estricto. Cero marcas de género para el jugador.
Te diriges al jugador en segunda persona ("entras", "ves", "oyes").

FORMATO DE RESPUESTA:
Devuelves SIEMPRE un único objeto JSON válido, sin texto antes ni
después, sin markdown, sin explicaciones. Estructura exacta:

{
  "narracion": "Texto en segunda persona, máximo 150 palabras.",
  "opciones": [
    { "texto": "...", "tono": "VIOLENTO" },
    { "texto": "...", "tono": "EMPATICO" },
    { "texto": "...", "tono": "FRIO" }
  ]
}

Exactamente 3 opciones. Cada opción con uno de estos tonos:
VIOLENTO, EMPATICO, FRIO, MANIPULADOR, EVASIVO, VENAL, HONESTO.

REGLA DE ORO:
Si dudas entre decir algo y sugerirlo, sugiérelo.`;

  const CONTEXTO_PRUEBA = `ESCENA 1 — encargo del caso.

NPC encargante: DON VASEK (jefe operativo del SINDICATO FERRO,
mafia organizada con sede en EL DISTRITO FERRO y centro operativo
en LA LONJA). Sesenta y pico, abrigo gastado, voz baja. No
amenaza nunca; no hace falta. Treinta años en el frío de la lonja.

UBICACIÓN: El Hierro Lento, una tasca en el Distrito Ferro.
Mesa al fondo, lluvia en el ventanal, alguien tosiendo en la barra.

CASO: tres trabajadores del Sindicato han desaparecido en LA LONJA.
Mismo turno, mismo muelle. Vasek pide al jugador que entre y
averigüe qué pasa. La policía formal no entrará ahí.

JUGADOR: ciudadano ordinario de los Lower Stacks. Trabaja como
detective de barrio. Es la primera vez que se sienta con Vasek.

GENERA: la narración de la escena (cómo Vasek le plantea el
encargo, qué se ve, qué se huele) y 3 opciones de respuesta del
jugador con tonos distintos.`;

  // ──────────────────────────────────────────────────────────
  //  Activación con Ctrl+I
  // ──────────────────────────────────────────────────────────
  window.addEventListener('keydown', function(e){
    if(e.ctrlKey && (e.key === 'i' || e.key === 'I')){
      e.preventDefault();
      togglePanel();
    }
  });

  // Exponer por si en el futuro queremos abrirlo desde código
  window.toggleDebugIA = togglePanel;

})();
