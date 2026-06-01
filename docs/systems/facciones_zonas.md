# NEON ASHES — FACCIONES DE ZONA, ENEMISTADES Y HOSTILIDAD

> **Documento canónico** (actualizado en v0.75). Sustituye a cualquier
> referencia anterior a "Los Óxidos" o a la facción del Arrabal Carmesí.
> Si otro documento contradice esto, manda este.

---

## 1. LAS 4 FACCIONES DE ZONA

El mapa de las Pilas tiene 4 zonas con jefe. Cada zona pertenece a una
facción "de zona". Estas 4 son las únicas que tienen reputación que
**sube y baja**, enemistades y niveles de hostilidad. El resto de
facciones del panel (HELIX, ORPHEUS, Drifters, Restos Militares,
Archivistas) quedan aparte: de momento su reputación **solo puede subir**
y no disparan hostilidad. (Archivistas se usa como afinidad de las
cadenas de lore, sin enemistades.)

| Zona | Facción | ID interno | Color | Tema visual |
|---|---|---|---|---|
| **DISTRITO FERRO** | Sindicato Ferro | `sindicatos` | `#ff6b00` | Fundición industrial, óxido, hierro. Obreros con casco abajo, mafia de traje arriba. |
| **ARRABAL CARMESÍ** | El Loto Carmesí | `loto` | `#ff006e` | Barrio del placer sino-cyberpunk. Faroles rojos, pagodas, teatros, casas de placer. Emblema: flor de loto. |
| **SANTUARIO IX** | Culto de la Carne Perfecta (Iglesia del Eco) | `eco` | `#c084fc` | Catedral-fábrica de implantes en violeta. Fusión cuerpo-máquina como trascendencia. |
| **NODO FANTASMA** | El Colectivo Sin Nombre (Células de IA) | `ia` | `#00ff88` | Catedral de hackers en verde-cian. Información libre, anti-HELIX. |

### Detalle por facción

**SINDICATO FERRO** (`sindicatos`) — Distrito Ferro
Una mafia que controla la zona industrial de las fundiciones. Dos caras
del mismo poder: en superficie, orden, deudas y trajes (Don Vasek);
abajo, obreros, óxido y hierro. La violencia es institucional y
silenciosa: Vasek te invita a cenar y al día siguiente apareces "ahogado".
NPC contacto: **Don Vasek** (zona especial: LA LONJA).

**EL LOTO CARMESÍ** (`loto`) — Arrabal Carmesí
La casa del placer que rige el barrio rojo. Controla casas de placer,
teatros, baños y, sobre todo, los secretos que circulan en la intimidad.
Su lema: "El placer no es lujo, es poder". Emblema: la flor de loto
carmesí. Poder blando, basado en deseo, deuda e información de alcoba.
(Sustituye a la antigua banda "Los Óxidos". El antiguo contacto
"Mano Roja" pasa a ser un contacto del Loto, no de una banda de chatarra.)

**CULTO DE LA CARNE PERFECTA / IGLESIA DEL ECO** (`eco`) — Santuario IX
Religión que venera la fusión del cuerpo con la máquina como camino a la
trascendencia. Pacíficos en apariencia, perturbadores de cerca. Clínica
de conversión voluntaria. NPC contacto: **Hermana Vael** (zona especial:
EL TALLER DE CARNE).

**EL COLECTIVO SIN NOMBRE / CÉLULAS DE IA** (`ia`) — Nodo Fantasma
Hackers y fragmentos de IA que sobreviven fuera del control corporativo.
Veneran la información libre y desconfían de todo dogma. Roban y filtran
datos a HELIX cada noche. "La verdad está en el código". NPC contacto:
**Cero-Ocho** (zona especial: LOS HORNOS).

---

## 2. ENEMISTADES (una contra una)

Las enemistades van por parejas. Cada facción tiene **un único enemigo**.
Subir reputación con una facción **baja** la de su enemiga. Las dos
parejas no se tocan entre sí (puedes ser amigo de Ferro y del Eco a la vez).

```
FERRO  ⚔  LOTO CARMESÍ      (los dos imperios del crimen: trabajo/deudas vs placer/secretos)
ECO    ⚔  IA / COLECTIVO    (las dos religiones: fundir la carne vs liberar el dato)
```

- Ganar rep con **Ferro** → pierde rep con **Loto**, y viceversa.
- Ganar rep con **Eco** → pierde rep con **IA**, y viceversa.

Intensidad sugerida: la enemiga baja un poco menos de lo que sube la
elegida (p. ej. +10 con una → −6/−7 con su enemiga), para que escalar sea
posible pero tenga coste real.

---

## 3. NIVELES DE HOSTILIDAD (al entrar en zona enemiga)

Cuando entras en la zona de una facción, tu reputación con ella decide
cómo te reciben. Tres niveles, graduales:

| Rep con la facción dueña | Nivel | Qué pasa |
|---|---|---|
| > −20 | Normal | Entras con normalidad. |
| ≤ −20 | **Mal recibido** | Te miran con desprecio. Texto hostil al llegar. Pequeño coste (fatiga / aislamiento). Entras igual. |
| ≤ −45 | **No te ayudan** | Los contactos de la zona te niegan el trato. Algunas opciones quedan bloqueadas. |
| ≤ −70 | **Te atacan** | Encontronazo violento al entrar: pierdes créditos y/o recibes una herida (sistema de condiciones). Puedes intentar retirarte. |

Los umbrales son acumulativos (a −70 también aplica lo de −45 y −20).

---

## 4. NPCs CONTACTO Y ZONAS ESPECIALES

| NPC | Facción | Zona estable | Zona especial |
|---|---|---|---|
| MANO ROJA | El Loto Carmesí | Arrabal Carmesí | EL ASTILLERO |
| HERMANA VAEL | Culto de la Carne / Eco | Santuario IX | EL TALLER DE CARNE |
| CERO-OCHO | El Colectivo / IA | Nodo Fantasma | LOS HORNOS |
| DON VASEK | Sindicato Ferro | Distrito Ferro | LA LONJA |

---

## 5. CADENAS DE LORE POR FACCIÓN

Cada una de las 4 facciones de zona tiene (o tendrá) una cadena de misiones
de 5 partes. Completarla da una recompensa de reputación **grande** con esa
facción (que arrastra la caída con su enemiga) más un objeto único.
Las cadenas avanzan una parte por run (ver `49_cadenas_lore.js` y el motor
`44_escenas_guion.js`).

Además existe la cadena de lore general "Lo que quedó arriba" (vida fuera
de la Tierra), de afinidad Archivistas, que no entra en el sistema de
enemistades.
