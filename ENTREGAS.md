# Guía de entrega de versiones — Cripta

Este documento reúne todas las normas de entrega que hemos ido fijando a lo
largo del proyecto. Es un complemento de `AGENTS.md` (que cubre arquitectura
y convenciones de código): este archivo se centra solo en **cómo se empaqueta
y se entrega cada versión**.

## 0. Antes de empezar a tocar nada

- Si se retoma el proyecto tras una pausa larga, o se arranca una versión
  nueva, **preguntar primero si la base actual sigue siendo la última
  subida de verdad al repo**. El usuario trabaja el mismo proyecto en varios
  chats en paralelo; ya ha pasado que dos chats avancen versiones distintas
  desde el mismo punto sin que ninguno supiera del otro.
- Si el usuario sube un zip diciendo "vamos por la X.X", tratarlo como la
  fuente de verdad: comparar (`diff -rq`) con la copia local y fusionar
  explícitamente lo que solo exista en la copia de Claude hacia esa base
  nueva. No asumir que la copia propia estaba al día.
- Punto de partida seguro al abrir un chat nuevo: leer `AGENTS.md` entero y
  el `CHANGELOG.md` reciente.
- Nunca construir la siguiente versión sobre una base que no esté
  confirmada como publicada/probada en producción.

## 1. Numeración de versión

- Parche grande (funcionalidad nueva, cambios de sistema) → **`V0.XX`**
  (ej. `V0.69`).
- Parche pequeño o fix → **`V0.XX.X`** (ej. `V0.69.3`).
- Subir el número **siempre** con `tools/bump_version.py` (actualiza
  `VERSION`, `js/config.js` y todos los `?v=` del proyecto de una sola vez),
  nunca a mano.
- Numeración secuencial, sin huecos.

## 2. Antes de empaquetar

- **Preguntar siempre** si se quiere meter algo más en esa versión antes de
  crear el zip final, sin excepción.
- Comprobar que `index.html` conserva las meta-etiquetas anticaché
  (`Cache-Control` / `Pragma` / `Expires`).
- Actualizar a mano `CHANGELOG.md` (técnico, para Claude/desarrollo) y
  `data/changelog.json` (in-game, es/en) con lo nuevo de esa versión.

## 3. Verificación de calidad

- Sintaxis de todos los `.js` tocados (`node --check`).
- Validez de todos los `.json` tocados (niveles, eventos, i18n, changelog).
- Correr la batería de pruebas headless (sin DOM) completa.
- Añadir una prueba nueva cada vez que se arregla un fallo real, para que no
  vuelva a colarse sin que salte una alarma.
- Si un fallo parece intermitente, reproducirlo varias veces antes de darlo
  por bueno o por malo — puede ser una prueba mal planteada (que no
  contempla un resultado válido, como una esquiva) y no un fallo de verdad.
- **Ajuste por consumo:** para cambios pequeños y aislados (p. ej. solo CSS,
  o un archivo suelto), no hace falta repetir la verificación completa del
  proyecto entero — basta con comprobar lo que ha cambiado. Guardar la
  verificación completa para cambios grandes o que tocan varios sistemas.

## 4. Empaquetado

- El zip incluye el **proyecto completo** (no parches parciales), salvo que
  se acuerde explícitamente lo contrario.
- Nombre: `CriptaV0.XX.zip` (o `CriptaV0.XX.X.zip` para fixes pequeños).

## 5. Despliegue — dos vías

El usuario alterna entre dos caminos según le convenga en cada momento:

**Replit** (vía principal): se sube el zip a un Repl ya conectado al repo de
GitHub, y Replit Agent hace el resto. El prompt de Replit debe incluir
**siempre**:
1. Instrucción explícita de descomprimir el zip **sustituyendo** los
   archivos existentes.
2. El mensaje de commit de esa versión, al final del prompt.

**Jules** (vía de repuesto, para cuando se agota Replit): el usuario sube el
zip a mano a la rama `main` del repo, y se usa un prompt de Jules aparte,
con su propia limpieza de rama.

**Cada entrega debe incluir los dos prompts** (Replit y Jules), cada uno en
su propio bloque copiable de forma individual y autocontenida.

## 6. El editor de niveles

- Es un **artifact aparte**, no vive en el repo ni en el zip del juego.
- Protecciones aprendidas: `prompt()`/`confirm()` nativos **no funcionan**
  dentro de artifacts — hay que montar modales propios.
- Distinguir un toque de un arrastre por **umbral de movimiento**, no por el
  primer contacto (`pointerdown` inmediato).

## 7. Técnicas de arte y animación ya aprendidas

- Si un personaje "tiembla" en un bucle (típicamente el idle), casi siempre
  es que los fotogramas de esa hoja no están recentrados igual entre sí.
  Recentrar por la **cabeza**, no por el cuerpo entero — un arma que se
  balancea puede compensar el promedio del cuerpo y esconder el problema.
- Cada clip de animación (idle, ataque, muerte...) tiene su **propia escala
  interna** (referencia = su propio fotograma más alto). Nunca asumir una
  escala compartida entre clips distintos del mismo personaje: ha causado
  bugs reales varias veces (ataques dibujados más pequeños que el resto de
  sus propias animaciones).
- Para extraer fotogramas solapados o pegados: usar **componentes
  conectadas**, nunca corte por columnas fijas.
- Cada tipo de sprite puede mirar a un lado distinto de serie — usar una
  tabla `NATIVE_FACING` por tipo, no asumir que todos miran a la derecha.
- La duración del paneo de cámara debe ser **proporcional a la distancia
  recorrida** por el personaje, para no desincronizar con su animación de
  movimiento (si no, da sensación de "teletransporte").
- Turnos de enemigo asíncronos con pausa entre acciones — pero la pausa
  solo se aplica si el enemigo es **visible** para el jugador en ese
  momento; si está fuera de pantalla o en niebla, sin retraso.
- Antes de dar por bueno un arte nuevo: numerar los fotogramas y enseñarlos,
  corregir con precisión quirúrgica solo la zona señalada, y regenerar desde
  los datos crudos si hace falta deshacer un cambio.

## 8. Principios de robustez del motor

- Un objeto sin evento conectado en `events.json` (p. ej. algo recién
  colocado en el editor sin enlazar aún) **nunca debe romper el juego** —
  debe fallar con un mensaje neutro y seguir funcionando.

## 9. Qué NO hacer sin comentarlo antes

- No añadir un bundler o build step (rompe el "sin build step" y complica
  Replit).
- No reestructurar `js/` en subcarpetas mientras el proyecto sea de este
  tamaño (una decena de módulos de una sola responsabilidad cada uno ya
  está razonablemente organizado).
- No asumir rutas absolutas ni nada específico de GitHub Pages (de cara a un
  posible empaquetado futuro con Capacitor/Electron).

## 10. Estilo de trabajo

- Sin jerga técnica; explicar llano. El usuario no programa, escribe desde
  el móvil y puede haber typos.
- Ante mecánicas ambiguas o complejas, preguntar con opciones concretas
  antes de programar — no asumir.
- Agrupar ajustes pequeños en una sola tanda cuando se pueda, para cuidar el
  consumo de uso (turnos y herramientas por turno), en vez de ir de uno en
  uno en cambios triviales.
