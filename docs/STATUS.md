# NEON ASHES — ESTADO ACTUAL DEL PROYECTO

> Este archivo describe en qué punto está el proyecto AHORA.
> Sirve para que cualquier IA (Claude, ChatGPT, etc.) entienda
> rápidamente dónde estamos sin tener que adivinarlo.
>
> ACTUALIZAR cada vez que se complete o cambie algo importante.
> Para el historial completo de versiones, ver `CHANGELOG.md`.

---

## Fase actual

**Vertical Slice — singleplayer, mobile-first, navegador.**

NO es MMO. NO es multijugador. NO es un juego final.
Es una rebanada vertical pequeña que demuestra el tono, la atmósfera y los sistemas básicos del juego completo.

---

## Stack técnico

- HTML / CSS / JavaScript puro (vanilla)
- Sin frameworks (sin React, sin Vue, sin nada)
- Un único archivo HTML autocontenido
- Assets (imágenes, audio, fuentes) embebidos en base64
- Tamaño aproximado: ~4.4 MB (con audio ambiental)
- Optimizado para móvil

Fuentes: Orbitron, Rajdhani, Share Tech Mono.

Paleta:
- `#030508` negro
- `#00e5ff` cyan
- `#ff006e` magenta
- `#ff6b00` naranja

---

## Versión actual

**`NeonAshes-56v3.html`** = `index.html` en GitHub Pages.

Enlace jugable: https://egoivaldes-code.github.io/NeonAshes/

- Próximo cambio pequeño = `56v4`
- Próximo cambio gordo = `57`

---

## Lo que YA funciona

### Flujo de juego completo (vertical slice)

1. Intro cinematográfica (5 frames, avance por tap, carga automática)
2. Pantalla de carga
3. Introducción del nombre del jugador
4. Apartamento (4 opciones: ventana, dormir, salir, terminal)
5. Terminal con mensaje cifrado de Mara
6. Mapa de Strata I con 4 zonas accesibles (Arrabal, Ferro, Nodo Fantasma, Santuario IX)
7. Tránsito libre entre zonas con eventos aleatorios
8. Zonas con acciones propias (hablar con contactos, comprar, observar, etc.)
9. Bar Noir con Mara Vex (árbol de diálogo de 14 nodos + nodo IA viva)
10. Aparición de CERO
11. Pantalla final del Fragmento I

### Sistemas implementados

- **HUD permanente** abajo: créditos (1200 al inicio), estado, inventario, audio. Visible en todas las escenas.
- **Stats humanas**: fatiga, hambre, disociación, aislamiento. Decaimiento pasivo cada hora de juego.
- **Tiempo diegético**: el reloj avanza durante viajes (150–210 min primera vez, 105–141 min posteriores).
- **Sistema de muerte** por agotamiento de stats, con causas narrativas.
- **Herencia entre partidas**: el muerto deja fatiga, créditos heredados y un albarán de herencia con botón "ASUMIR".
- **Cobros diarios** de alquiler (100 cr/día). Penalización de fatiga si no pagas.
- **8 facciones** con reputación, aliados y rivales que se afectan en cascada.
- **Reputación por zona** que evoluciona según tus acciones.
- **Eventos aleatorios** durante tránsito (probabilidad 1/4, sin repetición reciente).
- **Audio ambiental por escena**: 3 pistas (Storm, Industrial, Crowd) que se mezclan según la escena.
- **Lenguaje por clase social**: Lower Stacks soez, Midbelt técnico, místico-técnico.
- **Memoria del jugador**: registra decisiones clave que influyen en noticias y diálogos.
- **Guardado y carga** en localStorage.

### Concept art integrado (base64)

`img_apartamento`, `img_pasillo`, `img_mercado`, `img_bar_mara`, `img_mara_portrait`, `img_cero`, `img_tren`, `img_bootseq`, `img_espacio`, mapa de Strata I, y zonas: `MERCADO`, `MARA_ALLEY_CLEAN`, `DOCK_ACCESS_TUNNEL`, `SURGICAL_SUITE`.

---

## Arquitectura del archivo (organización interna)

El archivo está organizado por bloques numerados con cabeceras grandes. Para encontrar algo, abre Ctrl+F y busca "BLOQUE XX-NN":

- **CSS-01..45** — estilos visuales
- **HTML-01..26** — escenas y elementos
- **JS-00 LAUNCHER** — configuración principal (créditos, alquiler, modelo de IA, fecha de inicio, etc.). **Toca aquí para cambiar valores.**
- **JS-01..48** — código del juego, agrupado por sistemas

---

## Historial reciente

Para el historial completo, ver `CHANGELOG.md`. Aquí solo las últimas:

- **56v3** *(actual)* — Botón "─ ASUMIR" en herencia
- **56v2** — Fixes de zonas en negro (claves de imagen)
- **56** — Mapa nuevo de Strata I, 4 zonas ancladas sobre Lower Stacks
- **55v1** — HUD permanente visible en mapa, tránsito y zonas
- **54** — Botón "← Volver al apartamento" en el terminal

---

## Lo que NO funciona / pendiente conocido

- **Audio en el previsualizador interno de Claude**: falla con error "URL safety check". Funciona correctamente en Chrome cuando se descarga el `.html` y se abre directamente. No es bug del juego.
- **Compilación a `.apk` (Android) o `.exe` (escritorio)**: pendiente. Requiere Capacitor o Electron. El usuario aún no lo ha pedido.

---

## Decisiones creativas firmes

- **NUNCA proponer la PDA (P-27A HELIX)** como funcionalidad futura. Está descartada por el usuario.
- **NO rehacer el proyecto desde cero**. La estrategia es refactor incremental, no rewrite.
- **NO añadir frameworks** (React, Vue, etc.) ni arquitecturas complejas (ECS, MMO) prematuramente.
- **Mara Vex no se reescribe**: su voz ya está pulida (directa, parca, midbelt con autoridad).

---

## Contexto sobre el desarrollador

- Trabaja principalmente desde el móvil.
- NO tiene conocimientos de programación ni de jerga técnica.
- Depende de IAs (Claude, ChatGPT) para implementar.
- Las explicaciones deben evitar tecnicismos cuando sea posible y, si son necesarios, deben explicarse.
- Flujo de trabajo: Claude escribe TODO el código. Copilot SOLO se usa para tareas mecánicas en GitHub (renombrar archivos, mover carpetas, commits sencillos). Copilot NUNCA toca código.

---

## Repositorio

- Repo público: **`egoivaldes-code/NeonAshes`**
- Archivo principal: `index.html`
- Convención de versionado:
  - Cambios pequeños → añadir `vX` (ej. `56v4`, `56v5`)
  - Cambios gordos → subir número principal (ej. `57`, `58`)
