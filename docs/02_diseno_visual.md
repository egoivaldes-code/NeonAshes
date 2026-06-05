# NEON ASHES — Sistema de diseño visual (UI canónica)

> Fuente única de verdad para la interfaz del juego. El lenguaje visual
> CANÓNICO es el de las **escenas de transición y los eventos de viaje**
> (`07_transito.css`, `17_eventos_transito.js`). Toda pantalla debe hablar
> ese idioma. Cuando una pantalla se desvía, se corrige hacia este doc, no
> al revés.
> Estado: tokens definidos · alineación pendiente (explorar, mapa, profesión).

---

## 1. Por qué este documento

Hoy conviven dos lenguajes de interfaz: el canónico (tránsito/viaje), cuidado y
coherente, y el de "explorar ciudad", que se fue por su lado (otra fuente, otra
maquetación, acento cyan en vez de magenta). El resultado es que cambiar de
pantalla "se nota" como un juego distinto. Este doc fija los tokens del canon
para que explorar, mapa y eventos de profesión —y todo lo nuevo, incluido el
loop de expedición— nazcan ya alineados.

---

## 2. Tokens (valores exactos, ya en `:root` de `01_base.css`)

### Colores
| Token | Valor | Uso |
|---|---|---|
| `--negro` | `#030508` | Fondo base, velos. |
| `--magenta` | `#ff006e` | **Acento principal de UI.** Títulos, bordes, botones de acción. |
| `--magenta-dim` | `#7a0035` | Variante apagada del acento. |
| `--cyan` | `#00e5ff` | Acento **secundario/sistema** (HUD, terminal, diegético). NO es el acento de las escenas narrativas. |
| `--cyan-dim` | `#007a8a` | Variante apagada del cyan. |
| `--verde-terminal` | `#00ff88` | Terminal, estados "ok". |
| `--blanco-suave` | `#c8d8e0` | Texto de lectura. |
| `--gris` | `#3a4a55` | Separadores, texto tenue. |

> Regla de acento: las **escenas narrativas** (tránsito, viaje, explorar,
> eventos de profesión) usan **magenta** como acento. El cyan queda reservado a
> la capa de sistema (HUD, reloj diegético, terminal). Esto es lo que hoy hace
> mal "explorar ciudad", que usa cyan como si fuera una pantalla de sistema.

### Tipografías (importadas en `01_base.css`)
| Fuente | Uso canónico |
|---|---|
| **Rajdhani** (300–700) | Nombres de ubicación, títulos narrativos, texto destacado. `font-weight: 600`, `letter-spacing: 0.2em`, MAYÚSCULAS. |
| **Share Tech Mono** | Cuerpo de lectura y **botones**. Es la fuente base de `body`. |
| **Orbitron** (400/700/900) | Cabeceras de panel/sección (mercado, paneles del hub). `letter-spacing: 0.5em`. |

> "Explorar ciudad" usa hoy `font-family: inherit` en narración y opciones, lo
> que deja la fuente base sin la intención tipográfica del canon. Hay que
> declarar Rajdhani/Share Tech Mono explícitamente.

---

## 3. Patrones de componente (del canon `07_transito.css`)

### 3.1 Velo de escena (overlay)
Gradiente vertical que oscurece de arriba abajo para asentar el texto sobre la
imagen de fondo. Patrón canónico:
```css
background: linear-gradient(180deg,
  rgba(3,5,8,0.5) 0%,
  rgba(3,5,8,0.45) 45%,
  rgba(3,5,8,0.97) 73%,
  rgba(3,5,8,1) 100%);
```

### 3.2 Maquetación: contenido anclado ABAJO
El contenedor de escena ancla su contenido al pie y deja la imagen respirar
arriba:
```css
display:flex; flex-direction:column; justify-content:flex-end;
padding: 2rem 1.5rem 7rem 1.5rem;   /* el 7rem inferior libra la barra */
```

### 3.3 Tarjeta de contenido (`.tarjeta-loc`)
```css
border-left: 2px solid var(--magenta);
padding: 1rem 1.2rem;
background: rgba(0,0,0,0.82);
/* entrada: opacity 0→1, translateX(-20px)→0, transition 0.5s ease */
```

### 3.4 Título / nombre (`.loc-nombre`)
```css
font-family: 'Rajdhani', sans-serif;
font-size: clamp(0.8rem, 3vw, 1rem);
font-weight: 600; letter-spacing: 0.2em;
color: var(--magenta); text-transform: uppercase;
```

### 3.5 Cuerpo de texto (`.loc-desc`)
```css
font-size: clamp(0.65rem, 2.2vw, 0.75rem);
color: rgba(200,216,224,0.75);
line-height: 1.6;
```

### 3.6 Botón de acción (`.btn-avanzar-loc`)
```css
background: rgba(255,0,110,0.08);
border: 1px solid rgba(255,0,110,0.3);
color: var(--magenta);
font-family: 'Share Tech Mono', monospace;
font-size: 0.65rem; letter-spacing: 0.3em;
padding: 0.8rem; width: 100%; text-align: center;
/* hover: fondo 0.16, borde sólido, box-shadow magenta */
```

### 3.7 Cabecera de sección (`.mercado-header` / `.mercado-titulo`)
Para pantallas con cabecera (no por evento):
```css
/* header */ text-align:center; padding:1rem 0;
border-bottom: 1px solid rgba(255,0,110,0.2); margin-bottom:1.5rem;
/* titulo */ font-family:'Orbitron'; letter-spacing:0.5em;
color: var(--magenta); text-shadow: 0 0 20px rgba(255,0,110,0.5);
```

---

## 4. Plan de alineación por pantalla

### 4.1 Explorar ciudad (`25_explorar.css`) — la más desviada
Cambios para igualar al canon:
- **Acento cyan → magenta** en título, progreso, borde de narración.
- **Narración** (`.exp-narracion`): declarar cuerpo en Share Tech Mono, borde
  `border-left: 2px solid var(--magenta)`, fondo `rgba(0,0,0,0.82)`. Quitar el
  `backdrop-filter: blur` (no es del canon).
- **Título de escena**: Rajdhani 600, mayúsculas, magenta.
- **Opciones** (`.exp-opcion`): adoptar el botón canónico (fondo magenta
  translúcido, Share Tech Mono, `letter-spacing: 0.3em`). 
- **Acentos por tono moral** (`data-tono`): SE CONSERVAN tal cual (ver §5). Son
  información de juego. El re-skin respeta el borde de color por tono; el magenta
  es solo el acento por defecto para opciones sin tono.
- Maquetación ya es "anclada abajo" en móvil (v0.85): se conserva.

### 4.2 Eventos de profesión (`27_panel_trabajos.js` + estilos) — APLAZADO
**No se re-skinea ahora.** Hoy la profesión es un clic en un menú (sin
expediciones ni pantallas propias todavía). Re-skinear esta lista ahora
significaría rehacerla cuando llegue el loop de expedición (ver
`01_diseno_expedicion.md`). En su lugar, las **pantallas nuevas de expedición**
(preparar equipo, zona, evento, extracción) nacerán ya con el canon aplicado.
Cuando eso exista, este punto se cierra de forma natural.

Pendiente para entonces (referencia):
- Tarjetas → patrón `.tarjeta-loc` (borde magenta, fondo 0.82).
- Botones → patrón `.btn-avanzar-loc` en vez de `.btn-terminal`.
- Títulos de oficio/lugar → Rajdhani 600 magenta.
- Texto de sabor/resultado → Share Tech Mono, color de lectura del canon.

### 4.3 Mapa (`12_mapa.css`)
Ya es una escena cuidada; solo unificar detalles:
- Cabecera (`.mapa-titulo`/`.mapa-subtitulo`) ya usa Orbitron/Share Tech Mono: OK.
- Etiquetas de zona (`.zm-label`): ya magenta. Revisar que tipos y spacing
  coincidan con el canon (Rajdhani donde sea nombre).
- No se rehace la maqueta del mapa; solo se cuida que colores/fuentes/bordes
  sean los del doc.

---

## 5. Acentos por tono moral en explorar — DECISIÓN: se conservan

`.exp-opcion[data-tono=...]` colorea el borde de cada opción según su tono
(VIOLENTO magenta, EMPÁTICO verde, FRÍO gris, etc.). **Se mantiene tal cual.**
El color de tono es **información de juego** —le indica al jugador qué clase de
elección está tomando—, no decoración, así que es una excepción justificada a la
regla del acento único magenta. Diluirlo o quitarlo empobrecería la lectura de
las opciones.

Implicación para el re-skin de explorar: las opciones adoptan la tipografía y el
formato del botón canónico (Share Tech Mono, spacing, mayúsculas), pero el
**borde-acento por tono se respeta**. El magenta sigue siendo el acento por
defecto (opciones sin tono o de tono neutro).

---

## 6. Orden de trabajo sugerido

1. Definir/ajustar tokens (ya están; solo confirmar la regla magenta=narrativo).
2. Re-skin de **explorar ciudad** (la más desviada, mayor impacto visual).
3. Repaso fino del **mapa**.
4. Aplicar el mismo lenguaje a las pantallas NUEVAS del loop de expedición
   (esto absorbe el re-skin de profesión, hoy aplazado — ver §4.2).

Cada paso es un commit independiente y no toca mecánicas, solo estilos/markup.
