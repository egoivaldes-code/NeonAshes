# NEON ASHES — HOJA DE RUTA DE MODULARIZACIÓN

*Integración entre la hoja de ChatGPT y las correcciones críticas. Operativa, no filosófica.*

---

## DECISIONES DE PARTIDA (no negociables)

1. **HTML ejecutable sin servidor**. Doble clic y funciona.
2. **Scripts clásicos** (`<script src="...">`), no módulos ES.
3. **Variables globales** (como hoy). No hay `import/export`.
4. **LAUNCHER único** para todos los parámetros configurables.
5. **Audio embebido sale fuera** (asumimos la limitación: el jugador no tendrá música si abre desde `file://`, o tendrá que servirlo por su cuenta).
6. **Migración por BLOQUES numerados existentes**, no por sistemas conceptuales.
7. **Cada paso = un commit en Git**. Sin excepciones.
8. **Probar el juego después de cada bloque migrado**. Si rompe, revert.

---

## ESTRUCTURA OBJETIVO

```
NeonAshes/
├── index.html              ← HTML real, sin <style>, sin <script> inline
├── 00_LAUNCHER.js          ← Configuración (la única que se toca al cambiar valores)
├── css/
│   ├── 01_reset.css
│   ├── 02_intro.css
│   ├── 03_carga.css
│   └── ...                 ← Un archivo CSS por bloque o agrupación lógica
├── js/
│   ├── 01_recursos.js
│   ├── 02_utilidades.js
│   ├── 03_estado.js
│   └── ...                 ← Un archivo JS por bloque o agrupación lógica
├── assets/
│   ├── images/
│   ├── audio/              ← Si se sirve por servidor; ignorado en modo file://
│   └── fonts/
├── docs/
│   ├── 00_contexto.md      ← El que se pega SIEMPRE primero a cualquier IA
│   ├── vision.md
│   ├── tone.md
│   ├── worldbuilding.md
│   ├── architecture.md
│   ├── narrative_rules.md
│   ├── characters/
│   │   ├── mara_vex.md
│   │   └── cero.md
│   ├── systems/
│   │   ├── time_system.md
│   │   ├── economy.md
│   │   ├── npcs.md
│   │   └── ia_narrative.md ← El documento de sesión 03 va aquí
│   └── sesiones/           ← Historial de sesiones de diseño con IA
└── README.md               ← Para GitHub
```

---

## REGLAS OPERATIVAS

### Regla 1 — Tamaño máximo por archivo
**Ningún archivo supera 500 líneas.** Si un bloque actual tiene más, se parte en dos o tres archivos. Razón: archivo pegable a IA sin saturar contexto.

### Regla 2 — Orden de carga
`index.html` carga los scripts en este orden:

```html
<script src="00_LAUNCHER.js"></script>
<script src="js/01_recursos.js"></script>
<script src="js/02_utilidades.js"></script>
...
```

**El orden importa**. Archivos de bajo nivel (utilidades, configuración) ANTES que archivos de alto nivel (escenas, narrativa). LAUNCHER siempre primero.

### Regla 3 — LAUNCHER como única fuente de configuración
Cualquier valor configurable (API keys, créditos iniciales, alquiler, fechas de inicio, modelo IA, palabras prohibidas, etc.) vive en `00_LAUNCHER.js`. Ningún otro archivo tiene valores hardcoded. Esto se valida regularmente.

### Regla 4 — Dependencias unidireccionales
**Utilidades NO dependen de sistemas. Sistemas NO dependen de escenas. Escenas pueden depender de sistemas.** Si te das cuenta de que un archivo "de abajo" llama a algo "de arriba", refactoriza.

### Regla 5 — Un commit por bloque migrado
Cada vez que muevas un bloque a su propio archivo, después de probar que funciona:
```
git add .
git commit -m "Migrar BLOQUE JS-XX (NOMBRE) a js/XX_nombre.js"
git push
```

### Regla 6 — Después de cada migración, abrir el juego y probar
**Mínimo 5 minutos de prueba real** del flujo afectado. Si algo no funciona, `git revert` y a investigar.

---

## FASES DE MIGRACIÓN

### FASE 0 — Preparación (1-2 días, sin tocar código)

**Objetivo**: tener el entorno listo y el monolito a salvo antes de cualquier cambio.

**Pasos**:
1. Crear repositorio privado en GitHub (`neon-ashes` o el nombre que prefieras)
2. Clonar el repositorio al ordenador
3. Copiar el HTML monolítico actual a la carpeta del repo como `legacy.html` (este archivo se queda intacto durante toda la migración, como referencia y seguridad)
4. Hacer commit inicial: "Estado inicial del vertical slice antes de modularizar"
5. Crear estructura de carpetas vacías (`css/`, `js/`, `assets/`, `docs/`)
6. Crear `README.md` mínimo
7. Hacer commit: "Estructura de carpetas inicial"

**Resultado de la fase**: tienes Git funcionando, el monolito a salvo como `legacy.html`, y carpetas vacías esperando contenido.

---

### FASE 1 — Documentación (3-7 días, sin tocar código)

**Objetivo**: practicar Git y Markdown sin riesgo. Crear la memoria del proyecto.

**Pasos**:
1. Crear `docs/00_contexto.md` — el archivo más importante. Resume el proyecto en ~500 palabras, las leyes (LEY #1 austeridad de tokens), las restricciones (lenguaje neutro, no nacionalidades, calendario 2247, tono Nivel A), la filosofía. Es lo que se pega siempre primero a cualquier IA.
2. Migrar el documento de sesión 03 actual a `docs/systems/ia_narrative.md`
3. Crear `docs/vision.md`, `docs/tone.md`, `docs/worldbuilding.md` con el contenido de los archivos actuales del proyecto (00_CORE, 01_WORLD_LORE, etc.)
4. Crear `docs/characters/mara_vex.md` y `docs/characters/cero.md` con la información existente
5. Crear `docs/systems/factions.md` extrayendo la información de facciones del código actual
6. Hacer commit por cada documento creado

**Resultado de la fase**: tienes Git fluido (10+ commits), Markdown dominado, y la memoria del proyecto centralizada y accesible para cualquier IA.

**Importante**: aún no has tocado el código. Si tu confianza con Git no es buena al final de esta fase, **no avances a Fase 2**. Practica más con docs.

---

### FASE 2 — Extracción de assets (1-2 días)

**Objetivo**: sacar las imágenes y otros recursos del HTML.

**Pasos**:
1. Identificar los assets embebidos en base64 dentro de `BLOQUE JS-01 — RECURSOS`
2. Por cada imagen embebida:
   a. Decodificar el base64 a archivo real (`.png`, `.jpg`, lo que sea)
   b. Guardar en `assets/images/` con nombre descriptivo
   c. Reemplazar en el código la referencia base64 por la ruta relativa (`'assets/images/intro.png'`)
   d. Probar que el juego sigue cargando esa imagen
   e. Commit individual: "Extraer asset X de base64 a archivo"
3. **El audio embebido principal (~750 KB tema musical) se BORRA en esta fase**. Aceptamos la limitación: sin servidor no hay música. Si en el futuro se sirve, se vuelve a meter como archivo externo en `assets/audio/`.
4. Hacer commit final: "Fase 2 completada: assets extraídos"

**Resultado de la fase**: el archivo HTML monolítico ha adelgazado mucho. Las imágenes ahora viven en `assets/` y se referencian normalmente. Si abres `legacy.html` ahora, la mayoría de cosas siguen funcionando excepto el audio.

**Importante**: en esta fase **legacy.html todavía es el archivo principal**, no `index.html`. Aún no hemos partido el JS.

---

### FASE 3 — Migración JS por bloques (la fase larga, 2-4 semanas)

**Objetivo**: partir el JS monolítico en archivos por bloque.

**Pasos generales** (se repiten por bloque):
1. Identificar el siguiente bloque a migrar (orden recomendado abajo)
2. Crear archivo `js/XX_nombre.js`
3. **Copiar (no cortar)** el bloque completo del HTML al archivo nuevo
4. En el HTML, añadir `<script src="js/XX_nombre.js"></script>` en el orden correcto
5. **Borrar el bloque del HTML** (ahora se carga desde fuera)
6. Probar que el juego funciona igual que antes
7. Si funciona: commit "Migrar BLOQUE JS-XX a js/XX_nombre.js"
8. Si no funciona: `git revert` y diagnosticar

**Orden de migración recomendado** (de bajo nivel a alto nivel):

```
Tanda 1 — Fundamentos:
  - JS-00 LAUNCHER → 00_LAUNCHER.js (no en js/, en raíz)
  - JS-01 Recursos → js/01_recursos.js
  - JS-02 Utilidades fondo → js/02_utilidades.js
  - JS-03 Audio principal → js/03_audio.js
  - JS-04 Estado global → js/04_estado.js
  - JS-05 Stats humanas → js/05_stats.js
  - JS-06 Cola flechitas → js/06_feedback.js

Tanda 2 — Tiempo y persistencia:
  - JS-07 Tiempo utilidades → js/07_tiempo.js
  - JS-08 Guardado y carga → js/08_persistencia.js
  - JS-09 Archivo mundo → js/09_archivo_mundo.js
  - JS-10 Herencia partidas → js/10_herencia.js
  - JS-11 Fecha y hora → js/11_calendario.js
  - JS-12 Decaimiento → js/12_decaimiento.js
  - JS-13 Cobros diarios → js/13_economia.js
  - JS-14 Sistema muerte → js/14_muerte.js
  - JS-15 Panel depuración → js/15_depuracion.js
  - JS-16 Memoria jugador → js/16_memoria.js

Tanda 3 — Mundo y UI:
  - JS-17 Lluvia animada → js/17_ambiente_visual.js
  - JS-18 Audio gestión → js/18_audio_control.js
  - JS-19 HUD → js/19_hud.js
  - JS-20 Eventos aleatorios → js/20_eventos.js

Tanda 4 — Escenas (orden cronológico del juego):
  - JS-21 Intro → js/21_escena_intro.js
  - JS-22 Carga → js/22_escena_carga.js
  - JS-23 Identidad → js/23_escena_identidad.js
  - JS-24 Apartamento → js/24_escena_apartamento.js
  - JS-25 Textos apartamento → js/25_textos_apartamento.js
  - JS-26 Eco → js/26_escena_eco.js

Tanda 5 — Sistemas profundos:
  - JS-27 Panel HUB → js/27_panel_hub.js
  - JS-28 Noticias → js/28_noticias.js
  - JS-29 Panel estado → js/29_panel_estado.js
  - JS-30 Facciones → js/30_facciones.js
  - JS-31 Panel trabajos → js/31_panel_trabajos.js
  - JS-32 Terminal → js/32_terminal.js

Tanda 6 — Misiones existentes:
  - JS-33 a JS-38 → js/33_a_38_misiones_actuales.js (o partidos)

Tanda 7 — Diálogo y narrativa:
  - JS-39 Burbujas → js/39_dialogo.js
  - JS-40 Descripción jugador → js/40_descripcion_jugador.js
  - JS-41 Cero → js/41_cero.js
  - JS-42 Final capítulo → js/42_final.js
  - JS-43 Audio sintetizado → js/43_audio_sint.js
  - JS-44 Eco terminal → js/44_eco_terminal.js
  - JS-45 Reiniciar → js/45_reinicio.js
  - JS-46 Desbloqueo audio → js/46_audio_unlock.js
  - JS-47 Mapa mundo → js/47_mapa.js
  - JS-48 Acciones zonas → js/48_acciones_zonas.js
  - JS-49 Ambiente sonoro → js/49_ambiente_sonoro.js
```

**Importante**:
- **Cada tanda se completa entera antes de empezar la siguiente**. Si hay problemas, no acumulas deuda.
- Después de cada tanda, abrir el juego y **jugar de principio a fin** una partida corta para verificar que nada se ha roto.
- Si un bloque pasa de 500 líneas, partirlo en sub-archivos con sufijos (`30a_facciones_datos.js`, `30b_facciones_render.js`, etc.).

**Resultado de la fase**: el JS del juego está completamente modularizado. `legacy.html` se renombra a `index.html` y queda casi vacío de JS — solo HTML real más una lista larga de `<script src="...">`.

---

### FASE 4 — Migración CSS (1 semana)

**Objetivo**: partir el CSS monolítico igual que el JS.

**Pasos**: idénticos a Fase 3 pero con CSS. Un archivo CSS por bloque numerado o agrupación lógica. Cargados con `<link rel="stylesheet" href="css/...">` en el orden correcto.

**Resultado**: el `<style>` del HTML desaparece. CSS modular.

---

### FASE 5 — Limpieza final y release (2-3 días)

**Objetivo**: dejar el proyecto en estado "production-ready" para empezar a meter el sistema IA narrativo.

**Pasos**:
1. Renombrar `legacy.html` a `index.html` (si no se hizo ya)
2. Borrar archivos basura, comentarios obsoletos, código muerto
3. Revisar que `00_LAUNCHER.js` es la única fuente de configuración (auditar valores hardcoded en otros archivos)
4. Validar todas las dependencias: ¿está el orden de `<script>` bien? ¿hay dependencias circulares?
5. Jugar una partida completa con todo el flujo (intro, identidad, apartamento, mensaje de Mara, mercado, final)
6. Si todo va bien, commit "Modularización completada. Listo para sistema IA narrativo (JS-50+)"
7. Tag de versión en Git: `v0.1-modular`

**Resultado**: proyecto modular, versionado, listo para crecer.

---

## FLUJO DE TRABAJO CON IA TRAS LA MODULARIZACIÓN

Cuando pidas ayuda a una IA sobre algo concreto:

1. Abres la conversación con la IA
2. **Pegas siempre `docs/00_contexto.md`** primero (resumen del proyecto y reglas)
3. Pegas el archivo o archivos relevantes para la tarea
4. Explicas qué quieres hacer
5. La IA te responde con cambios concretos
6. Aplicas los cambios en local
7. Pruebas
8. Commit + push si funciona

Esto reduce drásticamente el coste de contexto comparado con pegar el monolito entero. Y permite a la IA centrarse en lo que importa.

---

## RIESGOS Y MITIGACIONES

| Riesgo | Mitigación |
|---|---|
| Romper algo y no saber qué | Commit por bloque + test después de cada bloque |
| Variables globales colisionando entre archivos | Auditoría al final de cada tanda |
| Olvidar el orden de carga en `index.html` | Lista numérica de scripts (01, 02, 03...) que se sigue al pie de la letra |
| Cansancio durante las semanas de migración | Mantener Fase 3 a un ritmo de 1-2 tandas por semana, no más |
| Diferencias entre el comportamiento de `legacy.html` y `index.html` | Mantener `legacy.html` accesible hasta el final de la Fase 5 como comparador |

---

## DURACIÓN ESTIMADA TOTAL

- Fase 0: 1-2 días
- Fase 1: 3-7 días
- Fase 2: 1-2 días
- Fase 3: 2-4 semanas (la fase larga, depende del ritmo)
- Fase 4: 1 semana
- Fase 5: 2-3 días

**Total: 5-8 semanas trabajando a ritmo razonable.**

Es **mucho tiempo sin que el juego avance en contenido**. Eso es lo que cuesta. A cambio, después puedes meter el sistema IA narrativo (JS-50 a JS-59) con la mitad de fricción.

---

## REGLA FINAL — CUÁNDO DETENERSE

Si en algún momento sientes que:
- Llevas días sin avanzar y nada funciona
- Has perdido el hilo de qué ha cambiado
- El juego está roto y no sabes desde cuándo

**Stop**. Vuelves al último commit que funcionaba (`git revert`). Te haces un café. Mañana retomas con cabeza fresca. **La modularización no es una carrera. Es un proceso de transformación lenta. Cada paso atrás que das voluntariamente vale más que un paso adelante en pánico.**

---

*Hoja de ruta integrada a partir de la guía de ChatGPT + correcciones específicas para el caso de NEON ASHES. Lista para empezar.*
