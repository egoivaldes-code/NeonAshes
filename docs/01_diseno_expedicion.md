# NEON ASHES — Diseño del loop de Expedición (Scavenging)

> Documento de trabajo. Define el rediseño de la profesión Scavenger:
> de un clic → resultado, a un loop de extracción con preparación,
> riesgo creciente y botín refinable.
> Estado: DISEÑO Y BALANCE CERRADOS — listo para implementar.
> Decisiones del autor: botín MIXTO (créditos + chatarra + objetos raros) ·
> riesgo por MEDIDOR DE ALERTA + GASTO DE RECURSOS · construir tras este doc.

---

## 1. El loop, de un vistazo

```
[1] PREPARAR EQUIPO    elegir qué metes en la mochila (consume nada hasta usarlo)
        ↓
[2] ELEGIR ZONA        4+ zonas con perfil de riesgo/recompensa y requisitos
        ↓
[3] EXPEDICIÓN         secuencia de eventos encadenados (no un único tirón)
        ↓
[4] EVENTOS/MINIJUEGOS escenas de scavenging: registrar, forzar, huir, curarte
        ↓
[5] RETIRARSE o SEGUIR decisión de presión tras cada evento
        ↓
[6] EXTRAER (refinar)  el botín en bruto se convierte en material/objetos útiles
        ↓
[7] VENDER/ANALIZAR/GUARDAR   liquidar, leer datos o conservar para misiones
        ↓
[8] DESBLOQUEAR ZONAS  el progreso y ciertos objetos abren zonas nuevas
```

Diferencia clave con el sistema actual: hoy `buscar` resuelve **un** desenlace
y paga créditos al instante, sin decisiones. El nuevo loop es una **run** con
estado propio que vive mientras dura la expedición. La run **sí** suelta
créditos (botín líquido), pero ahora son una parte del botín, no todo: junto a
los créditos caen chatarra y objetos raros, y el refinado/venta posteriores
exprimen aún más valor de lo recogido.

---

## 2. Decisiones de diseño tomadas

### 2.1 El botín es MIXTO
La expedición suelta **tres** cosas a la mochila:

- **Créditos** (botín líquido) — dinero contante que sale en el momento, igual
  que ahora, pero como una parte del botín y no como su totalidad.
- **Chatarra cruda** (`chatarra_cruda`, material apilable) — la materia prima
  abundante. Sin valor directo: hay que refinarla.
- **Objetos especiales raros** — hallazgos con identidad: un núcleo óptico, un
  servidor hundido, un implante sin estrenar. Pueden venderse, analizarse
  (datos/lore) o guardarse para misiones. Algunos son **llaves de zona**.

Esto respeta el inventario actual (`darItem`/`quitarItem`/`tieneItem`) y el
concepto que ya tienes de `chatarra` como material apilable. Renombramos el
material de campo a `chatarra_cruda` para distinguir lo que sale en bruto de la
expedición de lo refinado (ver §6).

### 2.2 El riesgo escala por DOS vías (combinadas)
1. **Medidor de ALERTA** (0–100). Cada evento lo sube. Cuanto más alta la
   alerta, peores los desenlaces posibles: heridas más graves, multas HELIX más
   caras, probabilidad de "run fallida" (te echan y pierdes parte del botín en
   bruto). La alerta es la tensión narrativa del *push your luck*.
2. **GASTO DE RECURSOS**. Cada evento puede consumir munición, medkits o cargas
   del analizador. Te puedes quedar **sin equipo a mitad de run**, lo que cierra
   opciones (no puedes forzar una cerradura sin ganzúa, no puedes curarte sin
   medkit) y empuja a retirarte.

Las dos se refuerzan: alerta alta + sin recursos = momento de pánico real.

---

## 3. [1] Preparar equipo

Antes de salir, una pantalla de **carga de mochila**. El equipo se compra en el
mercado (futuro) o se encuentra. Meterlo en la mochila no lo gasta; usarlo en la
run sí. Si lo pierdes en una run fallida, lo pierdes de verdad.

### Catálogo de equipo (items nuevos, tipo `equipo`/`consumible`)

| id | nombre | tipo | qué hace en la run |
|---|---|---|---|
| `medkit` | Botiquín de campo | consumible | Cura una herida leve o frena una hemorragia. **1 uso**. |
| `arma_blanca` | Cuchillo de monofilo | equipo | Resuelve encuentros cuerpo a cuerpo sin gastar nada. No hace ruido (no sube alerta extra). |
| `arma_fuego` | Pistola de raíl casera | equipo | Resuelve encuentros peligrosos, pero **gasta 1 munición/disparo** y **sube alerta** (ruido). |
| `municion` | Cargador improvisado | consumible | **6 disparos** por cargador. Apilable. Sin munición, el arma no dispara. |
| `analizador` | Analizador portátil | equipo | Permite **identificar** objetos raros in situ y abrir cerraduras de datos. Gasta **cargas**. |
| `carga_analizador` | Célula del analizador | consumible | Recarga del analizador. Apilable. |
| `ganzua` | Set de ganzúas | consumible | Abre cerraduras físicas sin romper sellos (evita multa HELIX). Puede romperse (consumo probabilístico). |
| `mascara_filtro` | Máscara de filtro | equipo | Reduce fatiga/veneno en zonas tóxicas (pozo, canal). |
| `kit_trauma` | Baliza de rescate | consumible RARO | **Salvavidas de 1 uso.** Si fueras a morir, se consume: sobrevives malherido y pierdes el botín bruto en vez de la partida. El objeto más codiciado del juego. |

> Regla de oro: **ningún equipo es obligatorio**, pero cada uno abre una RUTA en
> los eventos. Sin arma puedes huir (subes alerta, pierdes botín). Sin medkit
> aguantas la herida (penalización persistente al volver a casa). El equipo
> compra *opciones*, no victorias garantizadas.

---

## 4. [2] Elegir zona

Las cuatro zonas actuales (conducto, contenedor, vehículo, pozo) se reconvierten
en **zonas de expedición** con perfil propio. Añadimos desbloqueables.

| zona | riesgo base | nº eventos | botín típico | requisito |
|---|---|---|---|---|
| Conducto de servicio | bajo | 2–3 | chatarra, raro común | ninguno |
| Contenedor HELIX | medio | 3–4 | chatarra+, raros corporativos, riesgo multa | ninguno |
| Vehículo abandonado | medio | 2–3 | lotería: raros valiosos o nada | ninguno |
| Pozo de inundación | alto | 4–5 | mejores raros, heridas graves | recomienda máscara |
| **Nivel 9 sellado** 🔒 | extremo | 5–6 | raros únicos, lore | requiere `llave_magnetica` o progreso de cadena |
| **Depósito orbital** 🔒 | extremo | 4–6 | óptica militar, implantes | requiere rango Recuperador+ |

El perfil de zona define: alerta inicial, cuánto sube por evento, tabla de
eventos posibles y tabla de botín. Reutiliza la estructura de pesos que ya
tienes en `_elegirDesenlace`.

---

## 5. [3]–[5] El motor de expedición (corazón del sistema)

### Estado de una run en curso (`Estado.expedicion`)
```
Estado.expedicion = {
  activa: true,
  zona: 'pozo',
  alerta: 12,            // 0–100
  eventoActual: 2,       // índice dentro de la run
  eventosMax: 5,
  botinBruto: {          // se materializa al inventario solo si EXTRAES vivo
    creditos: 140,
    items: [
      { id:'chatarra_cruda', cantidad: 8 },
      { id:'nucleo_optico', cantidad: 1 }
    ]
  },
  equipoEnUso: {         // copia de lo metido en mochila, se descuenta aquí
    medkit: 2, municion: 6, carga_analizador: 1, arma_fuego: true, ...
  },
  condicionesPendientes: []  // heridas sufridas en la run
}
```

### Bucle por evento
1. Se elige un **evento** de la tabla de la zona (ponderado por alerta: a más
   alerta, más probabilidad de eventos peligrosos).
2. El evento ofrece **2–4 opciones**, filtradas por el equipo disponible.
   Ejemplo (cerradura corporativa):
   - *Forzar con ganzúa* → gasta ganzúa (puede romperse), sin multa.
   - *Romper el sello* → rápido, **+alerta**, riesgo de multa HELIX.
   - *Hackear con analizador* → gasta carga, abre botín de datos.
   - *Dejarlo* → sin coste, sin botín.
3. Se resuelve: suma botín bruto, ajusta alerta, gasta recursos, aplica heridas.
4. **Decisión RETIRARSE / CONTINUAR**:
   - *Retirarse* → vas a [6] Extraer con lo que llevas. Seguro.
   - *Continuar* → siguiente evento. La alerta ya está más alta.
5. **Corte por riesgo**: si la alerta cruza umbrales (p.ej. 70, 90), aumenta la
   probabilidad de un **evento de captura**: te echan y pierdes un % del botín
   bruto (estilo Tarkov, aplicado solo al bruto, no a lo ya refinado en casa).
   A 100 de alerta, captura casi segura.

### "Minijuegos" (ligeros, sin romper el tono)
No arcade. Micro-decisiones con textura:
- **Forzar cerradura**: elige entre 3 "tensiones" descritas; acierto = botín,
  fallo = ruido (+alerta) o ganzúa rota.
- **Aguantar la respiración** (zona tóxica): cuántos "turnos" sigues registrando
  antes de salir; cada turno extra = más botín pero +fatiga/veneno.
- **Regateo con otro carroñero** (NPC): aceptas su trato, lo amenazas (arma) o lo
  ignoras. Engancha con el sistema de NPCs (`42_npcs`) y rumores (`43_rumores`).

---

## 6. [6] Extraer botín mediante refinado

Al **retirarse vivo**, el `botinBruto` se vuelca al inventario: los créditos
entran a la cuenta y los objetos a la mochila. La chatarra cruda ya tiene un
valor de venta bajo, pero el refinado le saca bastante más. El refinado (la
acción `procesar` actual, ampliada) la convierte:

```
chatarra_cruda  ──refinar──►  chatarra_refinada (vendible)  +  posibilidad de
                                                                componente raro
```

### Refinado como ÚLTIMO punto de tensión (tu decisión: riesgo también aquí)
Para que el refinado no sea un peaje aburrido, cada tanda tiene un **resultado
variable**:
- **Éxito** (mayoría): X cruda → Y refinada + chance de componente.
- **Merma**: parte de la cruda se pierde (refinado chapucero).
- **Hallazgo**: aparece un componente raro escondido en la chatarra.

Esto mantiene una micro-emoción en el paso final sin convertirlo en otra
expedición. El rango Scavenger mejora el ratio (menos merma, más hallazgos).

---

## 7. [7] Vender / Analizar / Guardar

Cada objeto raro de la mochila ofrece acciones según su naturaleza:
- **Vender** → más créditos sobre los que ya soltó la run. La chatarra refinada
  y los objetos raros se liquidan aquí. Precio según
  mercado/contacto (engancha con `10_economia` y mercado).
- **Analizar** (requiere analizador o llevarlo a Cero-Ocho `22_eco`/`30_mara`)
  → revela lore, desbloquea diálogo, a veces pistas de zona nueva.
- **Guardar** → se queda en inventario para misiones (`55_cadenas_mision`) y
  para que la IA lo "vea" (`describirInventarioParaIA` ya existe).

---

## 8. [8] Desbloquear nuevas zonas

Las zonas 🔒 se abren por tres vías:
1. **Rango**: alcanzar Recuperador abre el Depósito orbital.
2. **Objeto llave**: `llave_magnetica` (ya en el catálogo) abre el Nivel 9.
3. **Lore/cadena**: completar "La señal del nivel 9" (cadena ya existente, v0.82)
   marca el Nivel 9 como accesible. Sinergia directa con contenido que ya tienes.

---

## 9. Encaje con sistemas existentes (qué se reutiliza)

| Sistema existente | Cómo se usa |
|---|---|
| `40_items.js` | Items nuevos de equipo + botín. `darItem`/`quitarItem`/`tieneItem` ya valen. |
| `39_condiciones.js` | Heridas de la run: `herida_brazo_d_leve/grave`, `pierna_herida_grave`, `hemorragia`, `costillas`, `envenenado`. Ya existen. |
| `51_profesiones.js` | El motor sustituye la acción `buscar`. `procesar` se amplía a refinado con merma. Rangos y multiplicador se mantienen. |
| Multas HELIX (`_multaHelix`) | Mismo sistema de recibos para sellos rotos en Contenedor/Nivel 9. |
| Cooldowns por acción | Una expedición sigue teniendo cooldown (8h). Refinar mantiene el suyo (4h). |
| `_elegirDesenlace` | Reaprovechable para elegir eventos y desenlaces por peso. |
| `42_npcs` / `43_rumores` | NPCs en eventos de regateo; rumores como pistas de zona. |
| `55_cadenas_mision` | Desbloqueo del Nivel 9 vía cadena existente. |

---

## 10. Plan de implementación (capas, para commit manual archivo por archivo)

Construir en este orden para no romper el juego de golpe:

1. **`40_items.js`** — añadir catálogo de equipo + materiales de botín
   (`chatarra_cruda`, `chatarra_refinada`, raros). Sin tocar lógica de run.
2. **`56_expedicion.js`** (NUEVO) — datos de zonas + tablas de eventos + motor de
   estado de run (alerta, recursos, botín bruto, retirarse/continuar). Sin UI.
3. **`51_profesiones.js`** — desviar `buscar` al motor nuevo; ampliar `procesar`
   a refinado con merma/hallazgo.
4. **UI** — pantalla de preparar equipo, pantalla de zona, vista de evento con
   opciones y barra de alerta, pantalla de extracción. CSS nuevo (`26_expedicion.css`).
5. **Desbloqueo de zonas** + enganche con cadenas/rango.
6. **(Opcional) reactivar IA** para sabor de eventos, ahora que el esqueleto es
   escrito a mano y coherente.

Cada paso es un commit independiente y deja el juego jugable.

---

## 11. Balance (decisiones cerradas)

### 11.1 Consumibles — escasos y tensos
- **Medkit:** 1 uso. Cura una herida leve o frena una hemorragia, y se acabó.
- **Cargador (`municion`):** 6 disparos. Cada disparo del arma de fuego gasta 1.
- **Analizador / ganzúas:** consumo por uso, con posibilidad de rotura en ganzúas.

La escasez es deliberada: te obliga a elegir cuándo gastar y empuja a retirarte
cuando te quedas seco.

### 11.2 Tiempo de juego — la run cuesta horas
Cada evento/escena consume **50–70 minutos de juego** (mismo orden que las
transiciones actuales). Una run de 5 eventos ≈ 4–6 h de juego: puede cruzar
medianoche y disparar el cobro del alquiler (`comprobarCobrosDiarios`). El tiempo
es, por tanto, otra forma de presión: alargar la expedición no solo sube la
alerta, también te come el día.

### 11.3 Muerte — real, pero con red de seguridad comprable
La muerte en expedición usa el sistema real (`11_muerte`) y **puede ocurrir en
cualquier zona** (las extremas, las que más). PERO antes de matar, el motor
comprueba si el jugador lleva un **item de rescate**:

- `baliza_rescate` / `kit_trauma` (provisional) — objeto raro de un solo uso.
- Si lo llevas: se **consume**, sobrevives **malherido**, y pierdes el **botín
  bruto** de la run en vez de la partida.
- Si no lo llevas: muerte real.

Esto convierte el item de rescate en uno de los objetos más codiciados del juego
y da una razón fortísima para cargar con peso "por si acaso".

### 11.4 Economía del equipo — todo se compra, vende y lootea
Casi todo el equipo y el botín circula por las tres vías: **comprar** (mercado),
**vender** (liquidar lo que sobra) y **lootear** (encontrarlo en expedición). La
tensión está en el **precio**: el mercado es caro, así que el jugador siempre
calcula si compra seguro o arriesga una run para conseguirlo. Lo verdaderamente
raro (item de rescate, óptica militar) se encuentra mucho más que se compra, o se
compra a precio de oro.

---

## 12. Preguntas abiertas para la siguiente sesión

- Números finos de precio de mercado por item (cuando montemos la tienda).
- Tabla exacta de peso del botín bruto perdido al usar la baliza de rescate.
