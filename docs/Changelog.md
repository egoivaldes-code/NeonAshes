
# NEON ASHES — Historial de versiones

> Este archivo es solo para consulta. NO se pega en chats nuevos.
> Si necesitas saber en qué versión se cambió algo, búscalo aquí.
>
> Para el estado actual del proyecto, ver `STATUS.md`.
>
> Convención (a partir de v55):
> - Cambios pequeños → añadir `vX` (ej. 56v2, 56v3)
> - Cambios gordos → subir número principal (56 → 57)

---

## v56v3 — Botón "─ ASUMIR" en herencia *(versión actual en GitHub como `index.html`)*

- El albarán de herencia tiene un botón discreto abajo a la derecha.
- Al pulsarlo: fade-out al texto normal del apartamento.
- Verbo "ASUMIR" elegido por encajar con el tono burocrático del juego.

## v56v2 — Fixes de zonas en negro

- Arrabal Carmesí → ahora usa `MERCADO`
- Nodo Fantasma → ahora usa `MARA_ALLEY_CLEAN` (cartel "NO SURVEILLANCE")
- Distrito Ferro → ahora usa `DOCK_ACCESS_TUNNEL`
- Santuario IX se mantiene con `SURGICAL_SUITE`
- Fallback automático a `PASILLO` si una clave de imagen no existe

## v56 — Mapa nuevo de Strata I *(cambio gordo)*

- Sustituido el esquema SVG abstracto por la ilustración real de Strata I (~220 KB embebida en base64).
- 4 zonas como botones anclados sobre los GRIDs de Lower Stacks: Arrabal Carmesí (G9), Distrito Ferro (G10), Nodo Fantasma (G11), Santuario IX (G12).
- Los botones ya no se descolocan al pulsarlos ni al redimensionar.
- Highcrown y Midbelt visibles en el mapa pero sin acceso (lore futuro).

## 55v1 — Nueva convención de versionado

- HUD permanente (CR / estado / inventario) visible también en mapa, tránsito y zonas (z-index 25 → 35).
- Eliminado el hueco negro debajo de los eventos aleatorios del tránsito (padding 7rem → 4.5rem en `.tl-inner`).

## v54 — Botón "← Volver al apartamento" en el terminal

- Siempre visible dentro del terminal, en cyan tenue (acción secundaria).
- El botón "Salir" sigue en cyan fuerte (acción principal).
- Permite regresar al apartamento sin tener que salir a la calle.

## v53 — Fix: ID duplicado

- Dos elementos HTML con el mismo `id="zona-opciones"` (uno del bar de Mara, otro del mapa).
- El navegador siempre cogía el primero → en Nodo Fantasma y otras zonas no aparecían los botones.
- Renombrado el del bar a `mercado-opciones` + actualizadas las 5 referencias JS.

## v52 — Bloque 7: audio ambiental por escena

- 3 pistas integradas en base64: Storm (lluvia), Industrial (máquinas), Crowd (gente).
- Cada escena tiene su mezcla propia:
  - Apartamento: lluvia fuerte (0.55) + industrial bajo (0.15)
  - Bar Noir / Mara: mucha gente (0.5) + algo de industrial
  - Nodo Fantasma: puro industrial (0.55)
  - Santuario IX: casi silencio (templo)
  - Arrabal Carmesí: caótico (storm + industrial + crowd alto)
- Fade suave de ~750 ms al cambiar de escena.
- Respeta el botón ♪ ON/OFF global.
- Nueva variable `VOLUMEN_AMBIENTE: 0.55` en el LAUNCHER.

## v51 — Bloque 6: lenguaje por clase social

- **Lower Stacks** (soez y callejero):
  - Mano Roja, mendigos, niña del callejón, predicador, vendedora de noodles.
  - Ejemplo: *"Esos hijos de puta de Helix me hicieron esto..."*
- **Midbelt técnico**:
  - Cero-Ocho con jerga digital (bit, caché, ancho de banda, ruido sin firmar).
- **Midbelt místico-técnico**:
  - Hermana Vael: mezcla espiritual + técnica (firmware espiritual, protocolo de fe).
- **Mara Vex NO se tocó**: su voz ya estaba pulida (directa, parca, midbelt con autoridad).

## v50 — Bloque 5: responsive + Distrito Ferro arreglado

- Ferro pasa a tener 4 opciones como las demás zonas (antes tenía 3). Añadida: *"Pasear y observar el orden"*.
- Bloque CSS-45 con mejoras responsive para móvil.

## v49 — Bloque 4: mapa y navegación

- El tiempo de juego avanza durante los viajes:
  - Primera vez en una zona: 150–210 min (~2,5–3,5 h de juego)
  - Visitas posteriores: 105–141 min (más rápido porque "ya conoces el camino")
- Renombrados los 16 botones de vuelta a "Volver al centro de la ciudad".

## v48 — Bloque 3: apartamento y herencia

- "Mirar por la ventana" solo una vez por visita: tras mirarla, el botón se atenúa con un ✓ y no se puede repulsar hasta volver a entrar al apartamento.
- Centralizado en un helper único `botonVentana()` para que el comportamiento sea idéntico en los 8 estados del apartamento.
- Mensaje de bienvenida ampliado al heredar: ahora aparece el papeleo de herencia completo en vez de una frase corta.

## v47 — Bloque 2: intro y boot

- **Carga automática**: desaparece el botón "INICIAR PROTOCOLO". El juego pasa solo a la pantalla de nombre tras 0,8 s.
- Frases azules de la intro un 40% más grandes (de 1.1–1.9rem a 1.55–2.6rem), con glow neón sutil en las palabras destacadas en cyan.
- Imágenes de fondo más brillantes (filtro `brightness 1.35 + contrast 1.08 + saturate 1.05`). Sigue siendo noir pero más legible.

## v46 — Bloque 1: limpieza + botón APTMNT

- Eliminada compatibilidad antigua con stats "presión" y "deuda" (residuos viejos). El código usa solo "hambre".
- Botón **APTMNT** en debug: teletransporte instantáneo al apartamento.

## v45 — Reorganización completa del archivo + LAUNCHER *(cambio gordo)*

- Reorganizado el archivo entero por bloques temáticos numerados con cabeceras grandes (CSS-01..44, HTML-01..26, JS-01..48).
- 1119 líneas de comentarios añadidas, **0 líneas de comportamiento cambiadas**.
- Bloque **LAUNCHER** al principio: centralita única con todos los valores configurables (créditos iniciales, alquiler diario, fecha de inicio, modelo de IA de Mara, etc.).
- Pensado para facilitar futura compilación a APK / EXE: solo se toca el LAUNCHER.

## v44 — Fix del bug de Melón (resolución 3440 px)

- Las opciones del bar de Mara las tapaba la barra de créditos en monitores grandes → loop de acciones del día 1, sin poder avanzar al corredor.
- Padding inferior del bar de Mara subido de 5rem a 7rem en todas las resoluciones.
- Eliminado un override de tablet (768 px+) que machacaba el padding y dejaba solo 1.5rem abajo. Era el causante real del bucle.
- Revertido un bug introducido en v41: `left: 50% + transform` rompía el scroll en contenedores con `position: relative`. Cambiado a `margin: 0 auto`.

## v43 — Dormir nunca termina el juego

- El eco aparece **una sola vez** como cinemática tras la misión de Mara, y luego te devuelve al apartamento vivo, con créditos, recibos e inventario intactos.
- El botón del eco cambia: ahora dice "VOLVER AL APARTAMENTO" (antes "CERRAR Y DORMIR" reiniciaba la partida).
- Permite testear todo el ciclo: acumular impagados, amenaza de HELIX a los 3 impagos, subida de aislamiento, fatiga, incluso muerte por agotamiento de stats.

## v42 — Libertad desde el minuto uno

- "Seguir durmiendo" ya no fuerza al terminal de Mara.
- 3 caminos: dejar que el sueño te lleve (avanzan 6–8 h, +fatiga, +aislamiento), encender el terminal o volver al menú.
- Puedes ignorar la trama y dormir días enteros para ver qué pasa con los recibos impagados, el aislamiento, etc.

## v41 — Centrado en PC y monitores grandes

- A partir de 1200 px de ancho, barras y textos ya no se estiran de borde a borde.
- Quedan compactos y centrados como un panel en medio de la pantalla, con el fondo cyberpunk respirando alrededor.
- En móvil y tablet nada cambia.

## v40 — Fix de sintaxis crítica

- Comillas mal escapadas en el botón de facciones que causaban `Uncaught SyntaxError: Unexpected string`.
- Era lo que rompía la v39.

## v39 — Versión rota

- `Uncaught SyntaxError: Unexpected string`.

## v38 — Panel de contactos con header anclado + bugfix

- Header del panel hub anclado arriba: el botón de cerrar siempre visible al hacer scroll.
- Bugfix de función `toggleFaccion` duplicada que provocaba pantalla en negro.

## v35-1 / v36 / v37 — Sistema de mapa y zonas *(cambio gordo)*

- **Mapa SVG abstracto con 4 zonas** clicables:
  - **Arrabal Carmesí** (mafias / mercado negro): contacto Mano Roja, augmentaciones baratas, comprar raciones, observar.
  - **Santuario IX** (Iglesia del Eco): templo, sermones, ofrendas.
  - **Nodo Fantasma** (hackers): Cero-Ocho, tablón de filtraciones, vender info.
  - **Distrito Ferro** (Sindicato): cobrador de deudas, restaurante familiar, ofertas del sindicato.
- **Tránsito libre** entre zonas con eventos aleatorios propios.
- **Reputación por zona** que evoluciona según tus acciones.
- **Panel CONTACTOS reorganizado en 3 secciones**: contactos personales, reputación por zona, facciones expandibles.
- **8 facciones implementadas** con efectos cascada entre aliados y rivales: HELIX, Sindicatos del Lower Stack, Archivistas, División ORPHEUS, Drifters, Iglesia del Eco, Restos Militares, Células Autónomas de IA.

## v35 — PRESIÓN → HAMBRE *(cambio gordo)*

- Sustitución total de la estadística "presión" por **"hambre"**.
- Razonamiento: con créditos y cartera ya cubrimos la presión sistémica económica.
- **Hambre sube**: +1/h decaimiento pasivo, +6 al rechazar a Mara, +2 al pasar del puesto de fideos.
- **Hambre baja (comiendo)**:
  - Máquina expendedora HELIX: 5 cr → −12 hambre, o 10 cr → −22.
  - Puesto de fideos: 10 cr → −25, o 18 cr → −40 (también baja fatiga y aislamiento).
  - Aceptar a Mara: −3 (perspectiva de créditos).
- **Eventos antiguos redistribuidos**:
  - Vigilancia / identidad (dron, cajero, anuncio con tu nombre) → **disociación**.
  - Burocracia / HELIX administrativo (cobrador, recibos impagados, terminal) → **fatiga**.
- **Muerte por hambre**: nueva causa con texto narrativo de inanición silenciosa.
- **Herencia entre partidas**: ya no se hereda hambre. Ahora se hereda **fatiga** (papeleo + funeral del muerto).
- **Compatibilidad de saves antiguos**: las partidas con `presion` o `deuda` migran automáticamente a `hambre`.

## v34 — Recuperación del botón SALTAR INTRO + dormir según fatiga

- El botón SALTAR INTRO estaba "muerto" en el CSS. Reactivado en su sitio (abajo a la derecha, durante la intro).
- En la primera visita al apartamento, **se elimina el botón "Seguir durmiendo"** del menú (te obliga a abrir el terminal). Después de salir una vez ya sí deja dormir.
- **Dormir = horas según fatiga**: normal 6 h / media 8 h / alta 10 h / extrema 12 h.

## v33 — Layout del apartamento sin solapes

- La barra **CONTACTOS/NOTICIAS/TRABAJOS** se solapaba con el texto narrativo y había un hueco negro grande encima de la barra inferior.
- Anclada justo encima de la barra permanente, padding del bloque ajustado a 150 px.

## v32 — Bug del botón CONTINUAR colgado

- El velo oscuro (`.transito-overlay`) interceptaba los toques sobre el botón en la escena de tránsito de Mara.
- Arreglado con `pointer-events:none` en el velo y `z-index:5` al contenedor `#tarjetas-loc-mision`.

## v31 — Rediseño del flujo del apartamento

- 3 botones → **4 botones en orden fijo**: Mirar por la ventana / Dormir / Salir del apartamento (gris, "PRÓXIMAMENTE") / Encender el terminal.
- La misión Mara se movió del terminal al **panel TRABAJOS** del hub.
- **Viaje de vuelta nuevo**: tras la entrega con Mara, ya no hay "FIN DEL FRAGMENTO". 3 paradas simétricas a la ida con eventos aleatorios → llegas a casa → dormir cierra el día.
- Si robas el paquete, salta directo al apartamento (ya tomó la ruta larga).

---

## v1–v30 — Prehistoria del proyecto (no documentada)

No hay registro detallado de estas versiones en el historial accesible. Cuando empieza la documentación (mayo 2026), el proyecto ya estaba en v31 con un vertical slice funcional. Lo que ya existía:

- Flujo completo: intro cinematográfica (5 frames) → carga → pantalla de nombre → apartamento → terminal con mensaje cifrado → tránsito al bar → diálogo con Mara Vex → aparición de CERO → pantalla final.
- HUD con créditos (1200 iniciales), reputación, inventario.
- Eventos aleatorios durante el tránsito (probabilidad 1/4).
- Árbol de diálogo con Mara: 14 nodos + nodo de IA viva conectado a la API de Claude (`claude-sonnet-4-20250514`).
- Concept art embebido en base64: apartamento, pasillo, mercado, bar, Mara, CERO, tren, espacio, boot sequence.
- Audio: bucle de 47 s con fade. Blob URL con fallback a data URI.
- Stats humanas: fatiga, **presión** (sustituida por hambre en v35), disociación, aislamiento.
- 3 botones iniciales en el apartamento: ventana / terminal / dormir.
- Fuentes: Orbitron, Rajdhani, Share Tech Mono.
- Paleta: #030508 negro, #00e5ff cyan, #ff006e magenta, #ff6b00 naranja.

Si en algún momento aparecen notas o recuerdos de las versiones v1–v30, se completarán aquí.