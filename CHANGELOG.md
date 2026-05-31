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

## [0.73] - 2026-05-31
### Added
- Rumores: lo que se cuenta por las Pilas. Aparecen en el terminal de noticias y los personajes que ya conoces pueden soltarlos durante la deriva. Cambian según a quién has visto y según tu reputación con cada facción.

## [0.72.3] - 2026-05-31
### Fixed
- La deriva reparte bien los objetos, golpes y lesiones (antes a veces salían menos de los previstos).
### Changed
- El dinero del juego ahora pasa por un único sitio, más fiable y fácil de mantener.

## [0.72.2] - 2026-05-30
### Added
- El panel de depuración ahora muestra la versión del juego y tiene un botón para abrir el panel de IA (útil en móvil, sin teclado).
### Changed
- El acceso por tap al panel de depuración se mueve a la esquina superior izquierda.

## [0.72.1] - 2026-05-30
### Fixed
- Las escenas del viaje "Explorar" ahora enlazan con la elección anterior, en vez de saltar a situaciones inconexas.
- Morir durante el viaje ya cierra la partida correctamente, sin dejar continuar tras la muerte.

## [0.72] - 2026-05-30
### Added
- 20 fondos nuevos para el viaje "Explorar la ciudad" (almacenes, talleres, mercados, puertos y callejones), para dar más variedad visual a la deriva.

## [0.71.1] - 2026-05-30
### Added
- Los encuentros con NPCs durante el viaje ahora afectan a la reputación con su facción y generan noticias acordes en la red HELIX.

## [0.71] - 2026-05-30
### Added
- NPCs recurrentes: personajes fijos del mundo (Cero-Ocho, Rasha, el Archivero y otros) que pueden aparecer en el viaje por la ciudad y a los que el juego recuerda entre encuentros.

## [0.70.2] - 2026-05-30
### Fixed
- Si morías durante el viaje, el juego seguía dándote objetos y dinero a un personaje ya muerto; ahora se corta al instante
- Al empezar de nuevo tras morir, el personaje nuevo ya no hereda las lesiones ni los objetos del anterior
- El viaje aguanta mejor las respuestas raras de la IA (ya no aparecen opciones vacías) y los toques dobles, sin quedarse sin opciones ni repetir acciones

## [0.70.1] - 2026-05-30
### Changed
- "Explorar la ciudad": las escenas ya no repiten lluvia ácida, neón ni hologramas a cada paso, y son más cortas entre medias (la primera, la quinta y la última pueden respirar más)
- El viaje ahora mueve créditos en los dos sentidos: ganas y pierdes dinero por el camino
- Cada escena muestra de fondo una imagen de la ciudad para dar ambiente, con un destello más fuerte al entrar que cubre la carga
- En móvil el texto va sobre un panel oscuro con borde para que se lea sobre la imagen; en PC la pantalla se ve más amplia, con la imagen más presente y el texto más grande
- En el apartamento, "mirar por la ventana" y "dormir" ahora desaparecen tras usarse (dormir, una vez por visita), en vez de quedarse en gris
### Fixed
- El inventario mostraba "[object Object]": ahora los objetos salen con su nombre y descripción en la pestaña INVENTARIO
- Los objetos aparecían en el panel ESTADO en lugar de en INVENTARIO; movidos a su sitio (las lesiones siguen en ESTADO)

## [0.70] - 2026-05-30
### Added
- Nuevo punto en el mapa: "Explorar la ciudad". Un viaje a la deriva de 10 escenas generadas por la IA, donde puede pasar de todo: encuentros, peligro, objetos y lesiones. Hay que sobrevivir; si tu estado se desploma, mueres
- Sistema de objetos: lo que recoges queda guardado y se ve en el panel ESTADO. La IA conoce lo que llevas encima
- Condiciones médicas (brazo herido, mareo, envenenamiento, hemorragia y más): aparecen en el panel ESTADO y van desgastando tu estado poco a poco mientras las arrastras

## [0.69.5] - 2026-05-30
### Fixed
- Botón de audio: arreglado el comportamiento errático (encendía/apagaba sin coherencia, mostraba estados contradictorios). Ahora una pulsación es un solo cambio y todos los botones de sonido muestran lo mismo
- Si apagas el sonido, ya no se vuelve a encender solo al cambiar de música o al entrar/salir del apartamento
- El volumen ya no salta solo: cada pista respeta el nivel del slider
- Arreglada la alternancia Main Theme / Ashes of Helix, que no llegaba a cambiar de canción por un ajuste interno del reproductor

## [0.69.4] - 2026-05-30
### Fixed
- Con el encargo de Mara aceptado, dormir ya no te deja atascado: ahora descansas y amaneces a la hora de la cita, con un botón claro para salir al casillero
- Dormir recupera el cansancio de verdad (antes la barra se quedaba casi igual por mucho que durmieras)
- El botón para salir al objetivo del encargo ya no desaparece: sigue disponible mientras el trabajo esté aceptado y aún no lo hayas hecho

## [0.69.3] - 2026-05-30
### Changed
- El mensaje del apartamento ahora se reabre automáticamente cuando una acción genera texto nuevo (mirar por la ventana, terminal, dormir), y vuelve a cerrarse al tocarlo o tras 8 segundos

## [0.69.2] - 2026-05-29
### Changed
- La línea separadora sobre los botones del apartamento queda más pegada a ellos
### Added
- El mensaje narrativo del apartamento se puede cerrar tocándolo, y se cierra solo tras 8 segundos, para disfrutar de la imagen

## [0.69.1] - 2026-05-29
### Fixed
- Botón de estado: las mini-barras estiraban la barra inferior; ahora mantiene la altura correcta
- Fondo del apartamento en móvil: se recorta la franja de leyenda que asomaba abajo

## [0.69] - 2026-05-29
### Added
- Sistema de música: al entrar suena Main Theme entero, luego Ashes of Helix entero, y vuelta a empezar en bucle
- En el apartamento, una vez sonado el Main Theme, suena el loop ambiental original del juego
- Descripciones de zona aleatorias: 4 variantes por zona ajustadas al lore y a la imagen de fondo
- Mini-barras de estado (Fatiga, Aislamiento, Hambre, Disociación) encima del botón ESTADO
### Fixed
- Bug que impedía volver al apartamento
- Fondo del apartamento en móvil: tenía demasiado zoom, ahora se ve más alejado

## [0.68] - 2026-05-29
### Added
- Imágenes propias para las 4 zonas del mapa: 3 pantallas de tránsito + fondo de zona para Distrito Ferro, Arrabal Carmesí, Santuario IX y Nodo Fantasma
- Textos de tránsito aleatorios: 6 variantes de corredor, 6 de tren y 5 por zona (20 textos específicos de lore)
- Main Theme: suena íntegro al entrar, luego cambia al loop ambiental
- Ashes of Helix: música en bucle durante misiones narrativas (Mara, casillero)
- Mapa horizontal para PC (mapa_strata.webp)
### Fixed
- Retrato de Mara Vex que aparecía vacío en la escena del bar

## [0.67.2] - 2026-05-29
### Fixed
- La IA ahora llama de verdad al portero de Cloudflare (antes iba a Gemini directo y fallaba). El panel de debug ya no pide una key de OpenRouter innecesaria.

## [0.67.1] - 2026-05-29
### Changed
- El sistema de IA ahora llama al portero alojado en Cloudflare Workers en lugar de Netlify, que se pausaba al alcanzar los límites del plan gratuito.

## [0.67] - 2026-05-26
### Added
- Sistema IA narrativa (primera iteración): módulo `37_ia_cliente.js` con soporte para OpenRouter (principal), Gemini y Groq. Despachador con fallback configurable, telemetría local (llamadas y tokens) y parseo robusto de JSON.
- Panel de depuración IA (`Ctrl+I`): permite pegar API key, ver telemetría, lanzar una llamada de prueba con el system prompt v1 y revisar la última respuesta (parseada / cruda / petición).
- Campos IA en el LAUNCHER: `API_PROVEEDOR_PRINCIPAL`, `API_MODELO_OPENROUTER`, `API_TEMPERATURA`, etc.
### Fixed
- Errores de llamada del fix original (Mikel): LAUNCHER no tenía los campos IA requeridos. Añadidos todos. OpenRouter añadido como proveedor (el fix original solo tenía Gemini y Groq).

## [0.66] - 2026-05-26
### Fixed
- Estructura del repo: los fixes de v0.64 y v0.65 estaban dentro de la subcarpeta neon-ashes-modular/, mientras que GitHub Pages servía la versión vieja monolítica desde la raíz. Ahora la versión modular es la única, en la raíz.
### Removed
- index.html monolítico viejo de la raíz del repo.
- Carpetas y archivos basura del entorno de Replit: artifacts/, attached_assets/, lib/, scripts/, package.json, pnpm-lock.yaml, pnpm-workspace.yaml, tsconfig.json, tsconfig.base.json, .npmrc, replit.md.

## [0.65] - 2026-05-26
### Fixed
- Bucle del terminal tras completar la misión de Mara: al encender el terminal solo aparecía "Abrir el mensaje cifrado" y no había forma de salir sin entrar en el terminal otra vez. Ahora el apartamento reconoce correctamente que la misión está completada.
### Added
- Botón "← Cerrar terminal" junto a "Abrir el mensaje cifrado", como red de seguridad para evitar quedarse atrapado en cualquier flujo futuro.

## [0.64] - 2026-05-26
### Fixed
- Navegación de zonas: al terminar una acción dentro de una zona (ej. hablar con un contacto), el botón "Volver" llevaba al mapa de ciudad en vez de a la plaza/centro de la zona.
### Changed
- El botón al terminar una acción ahora dice "← Volver a {NOMBRE_ZONA}" y lleva a la plaza de la zona.
- En la plaza de cada zona, el botón de salida ahora dice "← Volver al centro de la ciudad" (antes decía "Volver al centro de {NOMBRE_ZONA}", que era contradictorio porque ya estabas en el centro).

## [0.63] - 2026-05-26
### Fixed
- Ambiente sonoro no arrancaba cuando el autoplay estaba bloqueado y el usuario activaba el audio pulsando el botón de mute (en vez de hacer clic en la página).
- Hook `toggleMute` ahora también inicializa y arranca el ambiente si todavía no se había iniciado.
- Guard `if(_amb.arrancado) return` en `_primerGestoAmbiente` para evitar doble inicialización.
- Listener `touchstart` del primer gesto ahora usa `passive:true` (mejor rendimiento en móviles).

## [0.62] - 2026-05-26
### Added
- Pistas de audio ambiental externas: storm.mp3, industrial.mp3 y crowd.mp3 añadidas en assets/audio/.
- El sistema de ambiente sonoro (js/36_ambiente_sonoro.js) ya estaba configurado con los perfiles por escena; ahora las pistas suenan correctamente.

## [0.61] - 2026-05-26
### Changed
- Assets externalizados: las 33 imágenes y el audio principal ya no van embebidos como base64 dentro de js/01_recursos.js. Ahora se cargan como archivos físicos desde assets/images/ y assets/audio/.
- js/01_recursos.js reducido de 3.082 KB a 2 KB; ahora es legible y editable.
- js/03_audio_referencia.js simplificado: eliminada la lógica de Blob URL que ya no es necesaria.

## [0.60] - 2026-05-26
### Fixed
- Botón SALTAR de la intro: ya no queda pegado en la barra inferior tras terminar la secuencia de intro.

---

## v56v7 — Consolidación del vertical slice + limpieza estructural *(versión actual)*

- Revisión general de estabilidad del vertical slice.
- Ajustes menores de flujo y consistencia narrativa entre escenas.
- Limpieza incremental del archivo principal para mejorar mantenibilidad sin rehacer arquitectura.
- Refinados varios textos y transiciones para reforzar el tono noir/melancólico.
- Mejorada coherencia visual entre HUD, tránsito y zonas.
- Consolidación de sistemas persistentes ya existentes:
  - reputación
  - herencia
  - memoria
  - tiempo diegético
  - eventos aleatorios
- Preparación interna para futuras expansiones narrativas de Strata I.
- Continúa la estrategia de refactor incremental sin frameworks ni rewrite completo.

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

## v55v1 — Nueva convención de versionado

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
- **8 facciones implementadas** con efectos cascada entre aliados y rivales: HELIX, Sindicatos del Lower Stack, Archivistas, División ORPHEUS, Drifters, Iglesia del Eco, Restos Militares, Células Autónomas.

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

- Flujo completo: intro cinematográfica (5 frames) → carga → pantalla de nombre → apartamento → terminal con mensaje cifrado → tránsito al bar → diálogo con Mara Vex → aparición de Cero-Ocho.
- HUD con créditos (1200 iniciales), reputación, inventario.
- Eventos aleatorios durante el tránsito (probabilidad 1/4).
- Árbol de diálogo con Mara: 14 nodos + nodo de IA viva conectado a la API de Claude.
- Concept art embebido en base64: apartamento, pasillo, mercado, bar, Mara, CERO, tren, espacio, boot sequence.
- Audio: bucle de 47 s con fade. Blob URL con fallback a data URI.
- Stats humanas: fatiga, **presión** (sustituida por hambre en v35), disociación, aislamiento.
- 3 botones iniciales en el apartamento: ventana / terminal / dormir.
- Fuentes: Orbitron, Rajdhani, Share Tech Mono.
- Paleta: #030508 negro, #00e5ff cyan, #ff006e magenta, #ff6b00 naranja.

Si en algún momento aparecen notas o recuerdos de las versiones v1–v30, se completarán aquí.
