# NEON ASHES — CONTEXTO DEL PROYECTO

*Documento maestro. Pegar SIEMPRE primero en cualquier conversación nueva con una IA antes de pedirle algo.*

---

## QUÉ ES NEON ASHES

Vertical slice de juego cyberpunk noir en HTML monolítico modularizado.
Singleplayer, mobile-first, ejecutable abriendo el index.html directamente (sin servidor).

**El jugador NO es:** un elegido, un héroe, alguien importante.
**El jugador SÍ es:** una persona ordinaria sobreviviendo en los Lower Stacks de una civilización corporativa decadente.

## TONO

Noir adulto Nivel A: sugerido, omnipresente, jugable, sin gráfico.
Melancólico, íntimo, atmosférico, existencial, humano.

**Evitar a toda costa:** humor Marvel, cyberpunk caricaturesco, anime exagerado, exposición narrativa, UI arcade, RGB gamer, MMO prematuro, loot RPG.

**Priorizar:** silencio, subtexto, implicación, ambigüedad emocional, sensorial, atmosférico.

## RESTRICCIONES NO NEGOCIABLES

- **Lenguaje neutro estricto** en castellano. Cero marcas de género gramatical para el jugador ("la jugadora" / "el jugador" prohibido).
- **Sin nacionalidades reales** mencionadas explícitamente (ucraniano, japonés, etc.).
- **Sin marcas reales** ni referencias a empresas/productos actuales.
- **Sin décadas reales** (no "los 80", "los 2000s").
- **Sin idiomas reales nombrados** (no "mandarín", "inglés"). El idioma del juego es "el común".
- **Calendario 2247+** (terrestre antiguo). Fecha de inicio del juego: 25 dic 2247 03:14.
- **Cero menores** en cualquier contexto narrativo o de cualquier tipo. NO NEGOCIABLE.

## LEY #1 — AUSTERIDAD DE TOKENS

Cualquier decisión técnica que reduzca tokens consumidos por llamadas a la IA es prioritaria, salvo que comprometa la viabilidad del sistema.

**Corolario:** no optimizar a priori sin medir. Empezar con la solución simple, medir, optimizar con datos reales.

## ARQUITECTURA TÉCNICA

- **HTML monolítico modularizado**: index.html + scripts clásicos cargados con `<script src="...">`.
- **Sin módulos ES, sin bundler, sin servidor**: el juego se abre con doble clic.
- **LAUNCHER único** (`00_LAUNCHER.js`) como única fuente de configuración (API keys, parámetros).
- **Variables globales** (limitación aceptada por la decisión de no usar módulos ES).
- **CSS y JS separados en archivos modulares** por bloque o agrupación lógica.

## SISTEMA NARRATIVO IA (en diseño, futuro JS-50 a JS-59)

Casos de investigación de **3 escenas + epílogo**, **3 llamadas IA por caso**:

1. **Mensaje en TERMINAL** del apartamento (plantilla pre-escrita, gratis).
2. **Escena 1 — Encargo** en sitio público (1 IA). Opciones: Aceptar/Rechazar + 2 generadas.
3. **Escena 2 — Investigación** en sitio semi-clandestino (1 IA + interacciones locales). 4 elementos interactivos fijos. El código registra qué examinó el jugador.
4. **Escena 3 — Resolución** en zona especial (1 IA). 4-5 opciones definitivas. Consecuencias en DOS FASES: inmediatas + retardadas al día siguiente.
5. **Epílogo en apartamento** (plantilla pre-escrita por tono, gratis).

**7 tonos** que el código mapea a tabla de consecuencias: VIOLENTO, EMPÁTICO, FRÍO, MANIPULADOR, EVASIVO, VENAL, HONESTO. **La IA NUNCA calcula consecuencias numéricas — solo etiqueta.**

**Memoria modo híbrido**: estado actual + 3-5 recuerdos clave escritos por código.
**System prompt minimalista**: ~300-400 tokens.
**Output máximo**: 300 palabras por llamada IA.
**Validación local MEDIA**: lista de palabras prohibidas + formato JSON. Reintento automático si falla.

## MOTOR IA

Cadena de fallback gratuita:
- **Principal**: Gemini 2.0 Flash (1.500 req/día gratis)
- **Fallback**: Llama 3.3 vía Groq (14.400 req/día gratis)

**Fase 1**: API key del dev en el LAUNCHER.
**Fase 2**: cada usuario pone su propia API key (localStorage).
**Fase 3**: por decidir.

## NPCs CANÓNICOS Y SUS ZONAS

| NPC | Facción | Zona estable | Zona especial (solo en casos) |
|---|---|---|---|
| MANO ROJA | Los Óxidos | Arrabal Carmesí | EL ASTILLERO |
| HERMANA VAEL | Culto de la Carne Perfecta | Santuario IX | EL TALLER DE CARNE |
| CERO-OCHO | Colectivo Sin Nombre | Nodo Fantasma | LOS HORNOS |
| DON VASEK | Sindicato Ferro | Distrito Ferro | LA LONJA |

## TRABAJANDO CON IA EN ESTE PROYECTO

1. Pegar SIEMPRE este documento (00_contexto.md) primero.
2. Pegar después solo los archivos relevantes para la tarea (no el repo entero).
3. Si la IA va a generar código, pedir bloques pegables, no archivos enteros si no es necesario.
4. Si la IA propone algo que viola las restricciones de arriba (lenguaje, tono, nacionalidades, etc.), corregir inmediatamente.
5. Si la IA "olvida" la LEY #1, recordársela.

---

*Última actualización: cierre de la sesión 03 del sistema narrativo IA, post-modularización inicial.*
