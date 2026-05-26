# NEON ASHES — SISTEMA NARRATIVO IA
## Documento de diseño · Sesiones 01 + 02 + 03

*Sesión 03: estructura interna de un caso (B1.4). Decisiones: estructura común de escena, 7 tonos, mensaje del terminal, plantillas de cada NPC, conversación cara a cara, Escena 2 con 4 elementos interactivos.*

---

## 0. CÓMO USAR ESTE DOCUMENTO

Este documento captura la primera sesión de diseño del sistema narrativo IA de NEON ASHES. Está dividido en tres partes:

- **PARTE A** — Decisiones cerradas (lo que está clavado, no se replantea sin motivo)
- **PARTE B** — Preguntas abiertas (lo que hay que decidir antes de programar)
- **PARTE C** — Estado del archivo y contexto técnico para retomar

Para retomar otro día: leer Parte A en 5 minutos para refrescar, mirar Parte B para saber por dónde seguir.

---

# PARTE A — DECISIONES CERRADAS

## A0. LEY DEL PROYECTO #1 — AUSTERIDAD DE TOKENS

> **Cualquier decisión que reduzca el coste de tokens y llamadas a API es prioritaria sobre cualquier otra consideración** (riqueza narrativa, variedad de contenido, sofisticación de sistemas), salvo que comprometa la viabilidad mínima del producto.
>
> Antes de añadir cualquier sistema, función o variable que toque la IA, se evalúa su coste en tokens por uso típico y se justifica.
>
> Cuando hay duda entre dos diseños, gana el más barato.

**Corolario importante: optimización con datos, no a priori.** Decidir "fuera X porque cuesta tokens" sin medir el coste real es optimización prematura. Lo correcto: programar con el diseño elegido, hacer 10-20 ejecuciones reales, medir, y entonces decidir qué recortar si hace falta.

## A1. Filosofía del sistema

El sistema narrativo IA es **simulación narrativa sistémica**, no RPG tradicional con IA encima. El mundo genera situaciones según contexto (inventario, reputación, stats, ubicación, decisiones pasadas, etc.). La IA actúa como **director narrativo sistémico**, no como narrador omnisciente.

El jugador NO sigue contenido prefabricado constantemente. El jugador responde a situaciones que emergen.

## A2. Identidad del jugador

El jugador **NO es Mara**. El jugador es **una persona ordinaria de los Lower Stacks** que se busca la vida. Elige su nombre en la pantalla de identidad.

**Mara y Cero** son NPCs del **hilo principal**, una historia que se cruza en la vida del jugador en momentos concretos. **No están presentes en los casos generados por IA**, salvo guiños narrativos puntuales (1-2 menciones en todo el slice, no apariciones).

## A3. Estructura macro

El juego tiene **dos hilos paralelos**:

1. **Hilo principal** — historia de Mara/Cero/HELIX, escrita a mano por el dev, IA muy controlada o nula.
2. **Hilo de profesión** — la vida cotidiana del jugador, generada por IA dentro de marcos. Llena las horas entre escenas del hilo principal.

**Una profesión por partida.** Al morir el jugador, esa vida queda en el archivo del mundo y se hereda parcialmente al nuevo personaje (sistema ya implementado).

## A4. Profesión-piloto: DETECTIVE DE BARRIO

Decidida como primera profesión a implementar. **Investigadora privada / detective de barrio**, autodidacta, opera desde el apartamento (reutiliza espacio ya implementado).

Tipos de caso que resuelve (tres categorías):
- **Desapariciones** (alguien que no ha vuelto a casa)
- **Infidelidades / secretos personales**
- **Robos / identidades suplantadas**

**Mezcla por reputación**: el jugador empieza con casos pequeños mezclados, y según sus decisiones, el sistema le va dando más casos del tipo en el que destaca. **Especialización emergente**, no asignada.

## A5. Backgrounds (2 para validar)

Empezamos con dos backgrounds muy distintos para validar el sistema. Si funciona, se replica el patrón.

### Background 1: EX-AUXILIAR

> *"Trabajaste cinco años en el ala de cuidados paliativos de un hospital HELIX de segundo nivel. Viste morir gente todos los días. Aprendiste a leer dolor en cuerpos que ya no podían hablar, a detectar mentiras en familiares que decían 'no nos debe nada' mientras revisaban testamentos, a moverte por edificios HELIX sin que nadie te mirase. Un día firmaste algo que no debías firmar y te echaron sin papeles. Ahora cobras por encontrar gente porque es lo único que sabes hacer: leer a las personas cuando ya no quedan máscaras."*

**Stats ocultas iniciales:**
- DUREZA: 60
- INSTINTO CALLEJERO: 35
- FRIALDAD: 75
- REPUTACIÓN INFRA: -10
- REPUTACIÓN FORMAL: +20
- CONEXIÓN HUMANA: 55
- SOMBRA: 30

**Inventario inicial:** credencial HELIX caducada (a veces cuela), blíster de calmantes sin receta, libreta con anotaciones de pacientes que no debiste copiarte.

**Contactos iniciales:** enfermería del hospital que sigue trabajando ahí, un farmacéutico que vende lo que no debería vender.

**Créditos iniciales:** 1.400

### Background 2: DEL BARRIO

> *"Tu padre alquilaba apartamentos en los Stacks bajos durante treinta años. Cobraba a tiempo, no preguntaba mucho, y conocía a toda la gente del barrio porque eran sus inquilinos. Cuando murió hace dos años heredaste tres apartamentos cutres y una libreta llena de teléfonos. Vendiste dos para sobrevivir y empezaste a hacer favores a los vecinos: buscar a un hijo que no volvió, averiguar quién dejó preñada a alguien, encontrar el reloj que alguien dice que le robaron. Pagan poco pero pagan, y nadie en el barrio te ve venir porque siempre estuviste ahí."*

**Stats ocultas iniciales:**
- DUREZA: 30
- INSTINTO CALLEJERO: 70
- FRIALDAD: 35
- REPUTACIÓN INFRA: +40
- REPUTACIÓN FORMAL: -15
- CONEXIÓN HUMANA: 65
- SOMBRA: 10

**Inventario inicial:** llaves maestras de tres edificios de los Stacks, libreta de teléfonos de tu padre, navaja vieja de tu padre que no sabes usar pero llevas encima.

**Contactos iniciales:** dueño del bar de abajo (amigo de tu padre), una vecina anciana que sabe todo lo que pasa en tres manzanas, un chaval de 19 años que te debe favores.

**Créditos iniciales:** 800

## A6. Stats ocultas comunes (7)

Set único de stats ocultas que comparten todos los backgrounds. No hay stats específicas por background — sin coste de tokens innecesario. La diferencia entre backgrounds está en los **valores iniciales**.

| Stat | Rango | Mide |
|---|---|---|
| DUREZA | 0-100 | Capacidad de aguantar violencia física y dolor sin desmoronarse |
| INSTINTO CALLEJERO | 0-100 | Capacidad de leer peligro y leer gente en los Lower Stacks |
| FRIALDAD | 0-100 | Capacidad de separar emoción de decisión |
| REPUTACIÓN INFRA | -100 a +100 | Reputación en el bajofondo (yonquis, prostitutas, chivatos, contrabandistas) |
| REPUTACIÓN FORMAL | -100 a +100 | Reputación con estructuras de poder (HELIX, seguridad, médicos) |
| CONEXIÓN HUMANA | 0-100 | Capacidad de formar vínculos genuinos. Relación inversa con stat AISLAMIENTO visible |
| SOMBRA | 0-100 | Peso acumulado de mierda hecha (mentiras, traiciones, drogas, etc.) |

**Visibilidad:**
- El jugador **deduce las stats por contexto** (NPCs sueltan pistas, opciones aparecen/desaparecen, IA describe reacciones)
- El dev las ve en el **panel de depuración (Ctrl+D)**
- Nunca hay pantalla de stats visible para el jugador

## A7. Lenguaje y nomenclatura del mundo

### Nombres de personajes
**Mezcla cultural total**. Damián, Yuki, Adebayo, Volkov pueden convivir sin que nadie pestañee. **Las nacionalidades NO existen** como concepto — no decir "X es ucraniano/japonés/nigeriano". Las herencias culturales sobreviven solo como apellidos sin significado político.

### Idioma
- Existe **un idioma común** que todo el mundo habla. No tiene nombre en pantalla, nadie lo nombra.
- A nivel de **lore (no aparece en pantalla)**: es el resultado de la fusión histórica de castellano, inglés y mandarín.
- En **pantalla**: la prosa es **castellano** con palabras inglesas técnicas/comerciales salpicadas con naturalidad ("shift", "deal", "bay", "shipment"). **El mandarín NO aparece en pantalla nunca.**
- Las lenguas puras (inglés puro, mandarín puro) ya no existen como lenguas separadas reconocibles.

### Calendario
- Año actual: **2247**
- Fecha de inicio del juego: **25 de diciembre de 2247, 03:14**
- Sistema: calendario terrestre antiguo, los años siguen contando hacia delante sin ruptura.
- Lore implícito: la federación corporativa nunca se molestó en cambiar el calendario porque al sistema le da igual.

### Tono de contenido (Nivel A — Adulto sugerido)
- Estilo **True Detective / Blade Runner 2049 / Disco Elysium**
- Violencia con consecuencias pero **sin regodeo gráfico**
- Sexo **implícito o elíptico**
- Drogas como contexto, efectos sentidos no descritos químicamente
- Sexo, drogas, violencia **omnipresentes** en el día a día (no solo en casos turbios)
- **Jugable**: el jugador puede consumir, ejercer, participar — con consecuencias en stats
- **CERO menores en cualquier contexto** (víctimas, NPCs, ambiente). No negociable.

### Géneros gramaticales
**Lenguaje neutro estricto.** Cero "la jugadora", cero "ella". Segunda persona ("tú") o construcciones impersonales. Esto debe aplicarse también a los outputs de la IA — instrucción explícita en cada prompt.

## A8. Mapa del mundo

### Zonas estables (canon, ya en el código)
4 zonas visitables en el mapa principal:

| Zona | Facción local | Color | NPC contacto |
|---|---|---|---|
| ARRABAL CARMESÍ | LOS ÓXIDOS (banda criminal) | #ff006e | MANO ROJA (augmentaciones) |
| SANTUARIO IX | CULTO DE LA CARNE PERFECTA | #c084fc | HERMANA VAEL |
| NODO FANTASMA | COLECTIVO SIN NOMBRE (hackers) | #00ff88 | CERO-OCHO |
| DISTRITO FERRO | SINDICATO FERRO (mafia organizada) | #ff6b00 | DON VASEK |

### Zonas especiales (canon, definidas en sesión 02)
**4 zonas adicionales** que SOLO son accesibles dentro de misiones específicas. No están en el mapa principal. Cuando el caso acaba, vuelven a ser inaccesibles hasta el próximo caso que las requiera.

**Relación 1 a 1 con los NPCs**: cada NPC tiene SU zona especial fija. Identidad fuerte por zona.

| NPC | Zona estable (origen) | Zona especial |
|---|---|---|
| MANO ROJA | Arrabal Carmesí | EL ASTILLERO |
| HERMANA VAEL | Santuario IX | EL TALLER DE CARNE |
| DON VASEK | Distrito Ferro | LA LONJA |
| CERO-OCHO | Nodo Fantasma | LOS HORNOS |

#### EL ASTILLERO (Mano Roja)
- **Qué es**: antiguo taller industrial reconvertido en clínica clandestina de augmentaciones. Mesas de operación hechas con bancos de mecánico. Iluminación de quirófano improvisada.
- **Atmósfera**: silencioso de día, ruidoso a partir de medianoche. Olor a desinfectante, metal caliente y algo orgánico no identificable. Pacientes que entran enteros y salen con menos. Ex-paramédicos, técnicos robóticos, anestesistas sin licencia.
- **Movible**: el interior es siempre el mismo (descrito en system prompt). Lo que cambia es **cómo se llega** — el NPC da una entrada distinta cada vez (almacén 4B del muelle, nave abandonada, sótanos del hospital colapsado). Coste de tokens: 15-30 por caso. Despreciable.
- **Facciones globales con interés**: HELIX (tolera mientras no compita), ORPHEUS (vigila piezas robadas), CÉLULAS AUTÓNOMAS DE IA (interés en firmware sin firmar).
- **Tipos de caso**: alguien que entró y no salió, recuperar implante "robado", buscar doctor que se fugó con anticipo, identificar cuerpo con augmentaciones recientes, augmentaciones falsificadas mortales.

#### EL TALLER DE CARNE (Hermana Vael)
- **Qué es**: complejo operativo escondido en sótanos del edificio del Culto de la Carne Perfecta. En superficie: casa de retiro espiritual (cualquiera puede entrar al té con Hermana Vael). En sótano: salas operativas con altares en cada quirófano.
- **Doble economía del Culto**: feligreses internos no pagan dinero, pagan con trabajo y reciben la conversión como acto sagrado. Clientes externos pagan precio reducido. **El Culto se queda con algo de los externos** (datos, favores, ubicación).
- **Atmósfera**: silencio sepulcral arriba, música coral suave, incienso. Abajo desaparece el incienso y queda desinfectante con algo orgánico debajo. Luz blanca quirúrgica, paredes blanco hueso ligeramente irregular. Operaciones empiezan con oración del paciente.
- **Tipología social**: mezcla de creyentes genuinos (devoción real) y mandos cínicos (3-5) que llevan logística. Los cínicos se distinguen por detalles pequeños: no van a liturgias menores, sus augmentaciones son mejores, comen carne fuera. **El jugador no sabe a quién condenar.**
- **Facciones globales con interés**: HELIX (tolera con vigilancia), ORPHEUS (firmware no autorizado), ARCHIVISTAS (recuperar recuerdos antes de que se "purifiquen"), IGLESIA DEL ECO (rival teológico directo).
- **Tipos de caso**: sacar feligrés que la familia dice manipulado pero que no quiere salir, recuperar a alguien antes de su conversión (contrarreloj), investigar muerte en quirófano silenciada, pruebas para facción rival, mando intermedio desaparecido tras intentar destapar algo, recuperar augmentación instalada en alguien ya convertido.

#### LA LONJA (Don Vasek)
- **Qué es**: edificio industrial de procesamiento de pescado y mercancías refrigeradas. Funciona como empresa legal Y como cuartel general operativo del Sindicato Ferro. Cámaras frigoríficas, naves de despiece, oficinas. En trastiendas: contabilidad paralela, cuartos de "conversación", almacenes con mercancía que no es pescado.
- **Atmósfera**: frío permanente. Olor a hielo, salmuera, metal. Motores de refrigeración industrial de fondo. **El frío es lo que el jugador recuerda** — no es atmósfera, es real (sales temblando si no llevas abrigo). Don Vasek trabaja sin abrigo. Treinta años aquí, ya no lo nota.
- **Contraste con Mano Roja**: violencia institucional (mafia, silencio) vs violencia callejera (banda, ruido). Vasek invita a cenar, al día siguiente apareces "ahogado".
- **Acceso**: la barrera es **social, no física**. Todo el mundo sabe lo que es La Lonja. Nadie entra sin invitación. El jugador necesita pase real: caso encargado por Vasek, nombre que abra puertas, o permiso comprado caro.
- **Facciones globales con interés**: HELIX (cliente legal del procesamiento, da cobertura al Sindicato), RESTOS MILITARES (canal de reclutamiento de ex-militares como soldados), DRIFTERS (peaje por usar rutas refrigeradas para contrabando), SINDICATOS DEL LOWER STACK (rivalidad histórica fría por el uso del nombre).
- **Tipos de caso**: cobrar deudas (trabajo sucio que Vasek no quiere vinculado a él), investigar traición interna, recuperar envío perdido (no era pescado), encontrar a trabajador legal que vio algo, negociar con otra facción en nombre de Vasek, limpiar cadáver en sitio inconveniente.

#### LOS HORNOS (Cero-Ocho)
- **Qué es**: antiguo centro de datos de HELIX clausurado hace décadas, ocupado por el Colectivo Sin Nombre. Edificio enorme con racks de servidores apagados. Reactivaron una pequeña parte; 90% sigue como cementerio de hardware. Operan desde sala central iluminada en medio de máquinas muertas.
- **Decisión técnica**: zona FÍSICA (no digital). No hay mecánicas nuevas. La IA describe el espacio como las otras 3 zonas. Hacking que ocurra dentro se cuenta narrativamente, no se simula en interfaz propia. **Decisión por LEY #1**: añadir mecánica digital costaría tokens, complejidad de UI y prompts distintos. Si fase 3 lo justifica, se añade.
- **Atmósfera**: zumbido eléctrico constante. Calor en sala operativa, frío en el resto. Polvo iluminado por LEDs verdes/azules de racks vivos. Olor a plástico viejo, ozono, sudor. Hay subniveles a los que ni los propios hackers entran — servidores que nadie sabe a qué estaban conectados antes del cierre.
- **Tipología**: hackers del Colectivo (10-20 rotando), técnicos de hardware (3-5), vigilantes durmiendo en habitaciones improvisadas, ocasional periodista o activista con asilo.
- **Acceso**: edificio "clausurado" en mapas oficiales. Sin puerta visible. Acceso real por túnel de mantenimiento solo señalizado para quien sabe leerlo. El jugador solo lo encuentra si Cero-Ocho le da indicaciones.
- **Facciones globales con interés**: HELIX (oficialmente el edificio es suyo, "no saben" que está ocupado — tolerancia táctica mientras no toquen objetivos rojos), ORPHEUS (quiere desmantelarlos, mantiene vigilancia), CÉLULAS AUTÓNOMAS DE IA (enemigo común — HELIX — pero desconfianza mutua por infiltraciones), ARCHIVISTAS (clientes recurrentes, pagan por recuperar datos borrados).
- **Tipos de caso**: recuperar información borrada (memoria personal, registros HELIX, conversaciones), localizar a alguien viviendo bajo identidad falsa, investigar filtración interna del Colectivo, conseguir credenciales para acceder a sistema concreto, hacer desaparecer datos de alguien (limpiar identidad), identificar quién está vigilando a un cliente.

### Subzonas (la IA puede inventar)
Dentro de cada zona (estable o especial), la IA **puede generar libremente** subzonas concretas: bares, edificios, calles, azoteas, clínicas, callejones. Lo que NO puede es inventar una **novena zona** (5ª estable o 5ª especial).

## A9. Facciones canónicas

### Facciones globales (8, ya en el código en `FACCIONES_DATA`)
HELIX INDUSTRIES, SINDICATOS DEL LOWER STACK, ARCHIVISTAS, DIVISIÓN ORPHEUS, DRIFTERS, IGLESIA DEL ECO, RESTOS MILITARES, CÉLULAS AUTÓNOMAS DE IA.

Cada una con descripción, aliados, rivales, efectos positivos/negativos ya definidos en el código.

### Facciones locales (4, una por zona)
LOS ÓXIDOS, CULTO DE LA CARNE PERFECTA, COLECTIVO SIN NOMBRE, SINDICATO FERRO.

**Los casos pueden impactar reputación en ambas capas** (locales y globales).

## A10. PIVOTE — Los casos vienen de NPCs, no del panel TRABAJOS

**Decisión clave de la sesión.** Cambio de arquitectura:

- **Los casos NO se eligen desde un panel TRABAJOS abstracto.**
- **Los casos los encargan los 4 NPCs canónicos**, uno por zona.
- El jugador va a una zona, encuentra al NPC, el NPC le encarga algo.
- Cada NPC tiene su **setup ya definido en el código** (zona, facción, atmósfera, tipo de problemas que mueve).
- La IA genera el caso **dentro del marco** de ese NPC concreto.

### Tipo de caso por NPC (deducción, a confirmar)
- **MANO ROJA** → violencia callejera, augmentaciones ilegales, ajustes de cuentas
- **HERMANA VAEL** → fanatismo, desapariciones en el culto, transformaciones no consentidas
- **CERO-OCHO** → identidad digital, robo de datos, suplantaciones, vigilancia
- **DON VASEK** → cobros, deudas heredadas, secretos familiares, orden impuesto

### Implicación: el jugador no "es detective"
El jugador no elige profesión en un panel. **Va siendo lo que el barrio necesita que sea.** La identidad de "detective" emerge del uso, no de una selección. Es más NEON ASHES.

## A11. Stack económico de la IA

### Fase 1 (prototipo, validación)

**Decisión sesión 02**: cadena de fallback de DOS proveedores gratuitos.

**Proveedor PRINCIPAL: Gemini 2.0 Flash**
- Endpoint: Google AI Studio (aistudio.google.com)
- Cuota gratis: ~1.500 llamadas/día, ~15 por minuto
- Sin tarjeta requerida
- Calidad: alta para narrativa en castellano, predecible, sigue instrucciones bien
- Filtros: medios, permiten Nivel A sin pelea
- Velocidad: 1-2 segundos por respuesta corta
- Inconveniente: los prompts pueden usarse para entrenamiento del modelo (irrelevante para juego, no para datos personales)

**Proveedor FALLBACK: Llama 3.3 70B vía Groq**
- Endpoint: console.groq.com
- Cuota gratis: ~14.400 llamadas/día, ~30 por minuto
- Sin tarjeta requerida
- Calidad: media-alta, más literaria que Gemini pero más impredecible
- Filtros: bajos (permite hasta Nivel B sin esfuerzo)
- Velocidad: muy rápida (<1 segundo, hardware especializado)
- Inconveniente: a veces mete construcciones traducidas del inglés que cantan

**Por qué esta combinación**:
- Suman ~16.000 llamadas/día gratis, sobradísimo para 5-15 jugadores
- Gemini como principal por predecibilidad → mejor para tono consistente del producto
- Llama como fallback por velocidad y cuota → mejor red de seguridad
- DeepSeek descartado por latencia (5-10s) incompatible con mobile-first
- Los dos sirven JSON, dos adaptadores pequeños en el código

**Lógica de fallback**:
1. Intentar Gemini Flash
2. Si falla (cuota excedida / timeout / error de servicio), intentar Groq
3. Si ambos fallan, mensaje al usuario tipo "el servicio narrativo no está disponible ahora mismo, prueba en unos minutos"
4. **NO degradar a prosa local mala** — mejor cortar la experiencia que romper el tono

**Mantenimiento**: estos proveedores pueden cambiar términos sin aviso. Revisar mensualmente que las cuotas siguen activas. Tener identificado un tercer proveedor de backup (OpenRouter modelos `:free`) para añadir si uno cae.

### Fase 2 (post-validación, distribución pequeña)
- Cada jugador pone su propia API key (campo en ajustes, localStorage)
- Modelo recomendado: el mismo Gemini Flash con la key del usuario
- Coste para el dev: ~0€
- Coste para el jugador: pocos céntimos por sesión

### Fase 3 (futuro abierto)
- A decidir cuando llegue. Modelos locales en navegador, suscripciones unificadas, Patreon, etc.

### Arquitectura técnica
**Diseñar el sistema desde el día 1 con la API key como variable de configuración leída de un sitio configurable.** Migración Fase 1 → Fase 2 debe ser cambio mínimo (30 minutos), no reescritura. Cada proveedor tiene su adaptador independiente que normaliza la respuesta a un formato interno común.

## A12. Reglas duras para la IA

Estas son **instrucciones del system prompt** que la IA debe respetar siempre. Conviene tenerlas listadas en sitio único:

1. NUNCA mencionar nacionalidades, países, banderas, idiomas reales con sus nombres
2. NUNCA mencionar décadas terrestres del siglo XX o XXI ("años 70", "los 90")
3. NUNCA usar mandarín en pantalla
4. NUNCA romper género: lenguaje **neutro estricto** o segunda persona
5. NUNCA incluir menores en contextos sexuales, violentos o turbios
6. NUNCA inventar zonas estables nuevas (solo las 4 canon)
7. NUNCA romper personajes canónicos (Mara, Cero) — apenas usarlos
8. RESPETAR siempre las 8 facciones globales y las 4 locales
9. RESPETAR el calendario (año 2247+)
10. RESPETAR el tono Nivel A (sugerido, elíptico, omnipresente, jugable, NO gráfico)

## A13. Decisiones técnicas operativas (sesión 02)

Estas cuatro decisiones afectan a cómo se gestiona el coste de tokens en cada llamada a la IA. Tomadas tras lección "dónde está el dinero de verdad" (sesión 02).

### A13.1 — Gestión de memoria: MODO HÍBRIDO

La IA recibe en cada llamada:
- **Estado actual del personaje** (stats ocultas, créditos, inventario, ubicación, NPC actual) — barato y siempre actualizado
- **Pila de 3-5 "recuerdos clave"** escritos directamente por el código JavaScript del juego, sin llamadas extra a la IA. Frases cortas mecánicas: "encontraste el cuerpo de X", "Carrión te debe un favor", "debes 200 créditos a Mato"

Los recuerdos clave se generan automáticamente cuando pasan cosas importantes (cambios de stat fuertes, contactos nuevos, decisiones grandes). Cuando la pila excede 5 entradas, la más vieja se descarta o se condensa.

**Lo que NO hacemos**: pasar prosa pasada a la IA, hacer llamadas extra de IA para resumir, mantener memoria conversacional creciente.

**Coste estimado de memoria por llamada**: 150-250 tokens.

### A13.2 — System prompt minimalista

El system prompt fijo (el que se manda en cada llamada) contiene **SOLO**:
- Reglas duras del world bible (las 10 de A12)
- Lenguaje neutro estricto, segunda persona
- Formato de respuesta esperado (JSON con campos concretos)
- Tono y registro narrativo (Nivel A, elíptico, noir)

**Lo que NO va en el system prompt fijo**:
- Listas completas de facciones, NPCs, zonas
- Descripción detallada de mecánicas
- Halagos ni floritura ("eres un narrador experto...")

Esos elementos se inyectan **solo cuando son relevantes** para la llamada concreta, como contexto variable.

**Coste estimado del system prompt fijo**: 300-400 tokens. (Sin esta austeridad serían 1.500-2.000.)

### A13.3 — Límite de output: 300 palabras

Por respuesta de la IA. Suficiente para una escena cinematográfica corta + opciones del jugador. Iteramos al alza o a la baja según veamos en pruebas reales.

Implementación: `max_tokens` configurado en el LAUNCHER + instrucción explícita en el prompt ("máximo 300 palabras").

### A13.4 — Validación local MEDIA

Antes de mostrar la respuesta de la IA al jugador, el código JavaScript la valida:

- **Formato técnico**: respuesta es JSON parseable, tiene los campos esperados (prosa + opciones), número de opciones correcto
- **Lista de palabras prohibidas**: nacionalidades reales, marcas reales, décadas terrestres ("años 70", "años 80"), géneros gramaticales obvios ("la jugadora", "el jugador"), menores en cualquier forma, referencias inadecuadas a Mara/Cero fuera del hilo principal

Si falla la validación, **un reintento automático con la instrucción específica de qué corregir**. Si falla dos veces, mensaje de error al jugador y log del fallo para revisión del dev.

**Coste estimado**: ~5-15% de reintentos en pruebas iniciales, decreciendo a <5% conforme se afinen los prompts.

**Lista de prohibidas inicial** (a expandir con cada error detectado en testing):

```javascript
const PALABRAS_PROHIBIDAS = [
  // Nacionalidades / gentilicios reales
  'ucraniano', 'japonés', 'chino', 'cubano', 'ruso', 'americano',
  'español', 'francés', 'alemán', 'italiano', 'británico',
  // Marcas reales
  'Coca-Cola', 'McDonald', 'Mercedes', 'Apple', 'Google',
  // Décadas terrestres
  'años 70', 'años 80', 'años 90', 'años 2000',
  // Roturas de género
  'la jugadora', 'el jugador',
  // Países y ciudades reales (lista a ampliar)
  'Estados Unidos', 'Europa', 'América', 'Asia',
];
```

---

# PARTE B — PREGUNTAS ABIERTAS

Lo que hay que decidir antes de poder programar el sistema. Ordenado por prioridad.

## B1. PRIORIDAD ALTA

### B1.1 — ¿Qué hace el panel TRABAJOS si ya no es para la detective?
**APARCADO (sesión 02).** Decisión: dejar el panel como está en el código ahora mismo. No tocarlo. Volver a este tema cuando el sistema de NPCs/casos esté validado en pruebas reales. Razón: meter dos cambios grandes a la vez (sistema IA + reconvertir panel) multiplica el riesgo de romper algo sin saber qué.

### B1.2 — Si los casos vienen de NPCs, ¿qué significan los backgrounds?
**EVALUADO (sesión 02).** Los backgrounds se mantienen como están (EX-AUXILIAR y DEL BARRIO, ver A5). Coste estimado: ~200 tokens al contexto de cada caso, ~4-10% del coste total de una llamada. No es la pieza cara del sistema.

**Sigue abierto**: redefinir qué *son* exactamente los backgrounds en el modelo de "casos vienen de NPCs". Es decir: ¿siguen siendo "tipo de detective" o son simplemente "pasado del personaje al empezar la partida"? Probablemente lo segundo, pero hay que confirmar cuándo se eligen (al inicio del juego, en la pantalla de identidad que ya existe) y cómo se presentan.

**Reevaluación pendiente**: tras 10-20 casos reales con API, medir coste y decidir si recortar a 1 background o eliminar el selector. **No optimizar antes de tener datos.**

### B1.3 — Definir las 4 zonas especiales (a las que solo se accede desde misiones)
**RESUELTA (sesión 02).** Las 4 zonas especiales quedan definidas con simetría 1 a 1 con los NPCs: EL ASTILLERO (Mano Roja), EL TALLER DE CARNE (Hermana Vael), LA LONJA (Don Vasek), LOS HORNOS (Cero-Ocho). Ver A8 para detalle completo.

### B1.4 — Estructura técnica de un caso
**RESUELTA EN GRAN PARTE (sesión 03).** La estructura del caso queda definida así:

#### Estructura general

```
ESCENA 1: ENCARGO
  Parte A — Mensaje al terminal (plantilla fija del dev, 0 tokens IA)
  Parte B — Conversación cara a cara (1 llamada IA)
    ↓
ESCENA 2: INVESTIGACIÓN
  1 llamada IA + interacciones locales sin IA
  4 elementos interactivos en la escena
    ↓
ESCENA 3: RESOLUCIÓN
  (pendiente diseño detallado)
```

Total: **3 llamadas IA por caso completo.**

#### Estructura común de cualquier escena

Toda escena (1, 2 o 3) tiene esta anatomía:

1. **Prosa narrativa** (IA, ~150-200 palabras): ambiente, acción, diálogo
2. **Opciones jugables** (3-4): cada una con texto visible + "tono" interno (etiqueta para el código)
3. **Consecuencias** (código, no IA): cuando el jugador elige, el código aplica cambios a stats / inventario / reputación según el tono de la opción

#### Decisión A — Quién genera las opciones

La IA genera las opciones en cada escena. **Optimización emergente con datos**: si en testing se ve que ciertas opciones se repiten ("intimidar", "preguntar amable"), se convierten en plantillas reciclables. No diseñar el híbrido a priori.

#### Decisión B — Quién calcula las consecuencias

**El código, siempre.** La IA etiqueta cada opción con un "tono"; el código tiene una tabla que mapea tono → cambios de stat. Determinista, gratis en tokens, controlable, testeable. La IA NUNCA decide cuántos puntos sube/baja una stat.

Ejemplo de cómo funciona:

```javascript
// La IA devuelve:
{
  "opciones": [
    {"texto": "Sigues presionando. Es lo único que entiende.", "tono": "violento"},
    {"texto": "Le pasas un cigarro. Hablar es más fácil con humo en medio.", "tono": "empático"}
  ]
}

// El código consulta tabla:
const CONSECUENCIAS_POR_TONO = {
  violento:    { sombra: +3, conexion_humana: -2, dureza: +1 },
  empático:    { conexion_humana: +2, frialdad: -1 },
  // ...
};

// Cuando el jugador elige, el código aplica los cambios.
```

#### Set de 7 tonos

| Tono | Significado | Stats afectadas (sketch, a afinar) |
|---|---|---|
| **VIOLENTO** | Amenazar, presionar físicamente, usar fuerza | +SOMBRA, +DUREZA, -CONEXIÓN |
| **EMPÁTICO** | Conectar, escuchar, mostrar humanidad | +CONEXIÓN, -FRIALDAD, -SOMBRA |
| **FRÍO** | Profesional, distante, transaccional | +FRIALDAD, -CONEXIÓN |
| **MANIPULADOR** | Mentir, fingir, jugar a varias bandas | +SOMBRA, +INSTINTO, -CONEXIÓN |
| **EVASIVO** | Retirarse, no comprometerse, dejar pasar | +INSTINTO, -SOMBRA, leve -REPUTACIÓN INFRA |
| **VENAL** | Comprar, sobornar, vender favor | -CRÉDITOS, +/-REPUTACIONES según caso |
| **HONESTO** | Decir la verdad aunque duela | +CONEXIÓN, +REPUTACIÓN INFRA, -SOMBRA |

Tablas exactas de stats afectadas a afinar al programar y testear.

---

#### ESCENA 1 — EL ENCARGO

**Parte A — Mensaje del terminal** (sin IA):

- El NPC manda un mensaje al TERMINAL del apartamento (reutiliza BLOQUE JS-32 ya existente)
- Texto fijo escrito por el dev, mínimo, genérico (no revela el caso). Anticipación.
- Cada NPC tiene **2 plantillas** que alternan al azar (8 totales)

**Plantillas finales:**

**Don Vasek:**
1. "Pásate por la Lonja. Hoy. — V."
2. "Hay trabajo. Sabes dónde estoy. No tardes."

**Mano Roja:**
1. "Algo para ti. Algo bueno. Esta noche estamos en el sitio del agua negra. Pregunta por mí en la puerta."
2. "Tengo trabajo de los tuyos. Esta semana: tercer almacén del muelle viejo, entrada por atrás. A partir de las once."

**Hermana Vael:**
1. "Hay un alma que necesita compañía y no sabe pedirla. Pásate por la casa cuando puedas, alma. Habrá té caliente. — Vael"
2. "Necesitamos ayuda con una pequeña labor de caridad, alma. Ven al retiro hoy. Hay mucho que conversar y poco tiempo. Con paz, Vael."

**Cero-Ocho:**
1. "Trabajo. Tú sabes el sitio. Ven sin compañía. Hoy."
2. "Hay algo que solo tú puedes hacer. Esta noche, hora de siempre, sitio de siempre. Sin compañía. Borra este mensaje."

**Parte B — Conversación cara a cara** (1 llamada IA):

- **Punto de encuentro varía según NPC** (público o semi-público, NUNCA la zona especial todavía):

| NPC | Punto de encuentro Escena 1 |
|---|---|
| Don Vasek | LA TASCA (bar al lado de La Lonja, abierto al público) |
| Mano Roja | Su bar habitual en el Arrabal Carmesí |
| Hermana Vael | El retiro (parte alta, salones de luz, té) |
| Cero-Ocho | Un punto neutral cambiante |

- **1 sola llamada IA** que genera: prosa de llegada + diálogo con el NPC + propuesta del caso + opciones del jugador
- **Opciones del jugador al final de la escena 1**: ACEPTAR + RECHAZAR (fijas, escritas en código) + 2 opciones específicas del caso generadas por IA

**Detalle narrativo importante**: el paso de Escena 1 a Escena 2 es **siempre un cruce de umbral** — del sitio público al sitio clandestino. Esto es estructura noir emergente, no diseñada. Conservarlo.

---

#### ESCENA 2 — LA INVESTIGACIÓN

**Estructura técnica**: 1 llamada IA + N interacciones locales gratis.

La IA recibe la información del caso y devuelve un JSON con:

```json
{
  "prosa_llegada": "150-200 palabras describiendo dónde estás, qué ves al entrar...",
  "elementos": [
    {
      "id": "pizarra",
      "etiqueta_visible": "La pizarra de turnos en la pared",
      "descripcion": "Texto que aparece si el jugador toca el elemento",
      "es_relevante": true
    },
    // ... 4 elementos en total, siempre
  ],
  "opciones_cierre": [
    {"texto": "...", "tono": "frío"},
    {"texto": "...", "tono": "violento"},
    {"texto": "...", "tono": "manipulador"}
  ]
}
```

**Reglas fijas de Escena 2**:

- **Siempre 4 elementos interactivos** (número fijo, no variable)
- Cada elemento tiene un flag `es_relevante` que la IA decide según el caso
- El jugador toca/examina elementos en cualquier orden, las descripciones se muestran localmente sin nuevas llamadas IA
- El jugador decide cuándo cerrar la escena seleccionando una opción de cierre
- **El código registra qué elementos vio y cuáles no**
- Esa lista se inyecta como contexto a la IA en Escena 3 (~30-40 tokens extra, despreciable)

**Implicación narrativa**: el jugador puede precipitarse (cerrar tras ver 1 elemento) o agotar todos (4). La Escena 3 será distinta según qué pistas tenga. Las pistas que ignoró pueden morderle después. Eso es noir auténtico.

---

#### ESCENA 3 — LA RESOLUCIÓN

**Estructura técnica**: 1 llamada IA (clímax en zona especial) + epílogo pre-escrito en apartamento (0 tokens IA).

**Dónde ocurre**: en la **ZONA ESPECIAL** del NPC que encargó (EL ASTILLERO, LA LONJA, EL TALLER DE CARNE, LOS HORNOS). El clímax pasa donde se cuece todo. El paso de Escena 2 a Escena 3 es **el cruce de umbral más cargado del caso** — del sitio semi-clandestino al sitio prohibido. Estructura noir emergente.

**Llamada a la IA en Escena 3**:

La IA recibe contexto extra que no recibieron las anteriores:
- Estado actual del jugador (igual que siempre)
- 3-5 recuerdos clave del jugador (igual que siempre)
- **Lista de elementos vistos / no vistos en Escena 2** (~30-40 tokens extra, despreciable)
- **Tono elegido en Escena 1** (cómo aceptó el caso)
- Información del caso concreto (NPC encargante, qué pidió)

La IA devuelve un JSON con:

```json
{
  "prosa_climax": "200-300 palabras describiendo el clímax en la zona especial...",
  "opciones_finales": [
    {"texto": "...", "tono": "violento"},
    {"texto": "...", "tono": "empático"},
    {"texto": "...", "tono": "honesto"},
    {"texto": "...", "tono": "manipulador"}
    // 4-5 opciones, más que las otras escenas porque es la decisión definitiva
  ]
}
```

**Opciones en Escena 3**: **4-5 opciones generadas por IA** con tonos. Las otras escenas tenían 3-4 porque eran tránsito; la 3 es decisión definitiva y merece más matiz.

**Consecuencias en DOS FASES** (decisión narrativa importante):

1. **Fase inmediata** (al elegir la opción): el código aplica al instante:
   - Cambios en stats ocultas (DUREZA, SOMBRA, etc.)
   - Cambios en créditos
   - Cambios en inventario
   - Feedback visual: las flechitas de stat ya implementadas (BLOQUE JS-06)

2. **Fase retardada** (al día siguiente del juego): el código aplica al despertar:
   - Cambios en reputaciones (INFRA, FORMAL, facciones globales, facciones locales)
   - El barrio se entera de lo que hiciste
   - El sistema almacena "cambios pendientes para mañana" usando el sistema de fechas ya existente (BLOQUE JS-07, JS-11)

**Por qué dos fases**: ritmo noir. Día 1 sientes cambios mecánicos. Día 2 te levantas y el mundo ha cambiado. Las consecuencias sociales tardan en llegar — es realista y narrativamente potente.

**Epílogo en el apartamento** (tras la elección):

- **Texto pre-escrito por dev** (0 tokens IA)
- **7 plantillas, una por tono** (VIOLENTO, EMPÁTICO, FRÍO, MANIPULADOR, EVASIVO, VENAL, HONESTO)
- El código selecciona la plantilla según el tono de la opción final elegida
- ~80-120 palabras por plantilla, evocando el regreso, la soledad del apartamento, la asentamiento de lo ocurrido
- Pendiente: escribir las 7 plantillas (sesión de escritura aparte)

#### Casos abandonados

Si el jugador acepta el caso en Escena 1 pero NO lo termina:

- **Rechazar en Escena 1**: sin consecuencias. No es abandono, es no aceptar.
- **Abandonar después de Escena 2**: penalización. -REPUTACIÓN con el NPC encargante (-REPUTACIÓN INFRA o FORMAL según NPC). El barrio se entera.
- **Detalle implementación**: el sistema considera "abandonado" un caso aceptado en el que ha pasado un cierto tiempo de juego sin progreso, o si el jugador acepta otro caso del mismo NPC sin haber terminado el anterior (a definir umbrales en testing).

---

#### Resumen visual del arco completo de un caso

```
[TERMINAL en apartamento]
  → Mensaje del NPC (plantilla pre-escrita, gratis)
  → El jugador decide si acudir

[ESCENA 1 — sitio público o semi-público]
  → Conversación cara a cara con el NPC
  → 1 llamada IA
  → 4 opciones (Aceptar / Rechazar fijas + 2 generadas)
  → Si rechaza: caso muerto, sin penalización

[ESCENA 2 — sitio relacionado, semi-clandestino]
  → Investigación con 4 elementos interactivos
  → 1 llamada IA + interacciones locales gratis
  → Código registra qué vio el jugador
  → Opciones de cierre con tonos
  → Posibilidad de abandonar (con penalización)

[ESCENA 3 — ZONA ESPECIAL del NPC]
  → Clímax en el sitio prohibido
  → 1 llamada IA (con contexto de qué vio en Escena 2)
  → 4-5 opciones con tonos
  → Consecuencias inmediatas al elegir

[EPÍLOGO en apartamento]
  → Vuelta a casa, gratis
  → Plantilla pre-escrita según tono elegido (7 totales)

[DÍA SIGUIENTE]
  → Al despertar: aplicación de consecuencias retardadas
  → Cambios de reputación (el barrio se enteró)
```

**Total por caso**: 3 llamadas IA + 0 momentos gratis adicionales (terminal + epílogo + retardadas).

---

#### FEED DE NOTICIAS Y EVENTOS REACTIVOS

**Idea añadida en sesión 03**: el feed de noticias rotativas ya implementado (BLOQUE JS-28) y los eventos aleatorios del tránsito (BLOQUE JS-20) se conectan con el sistema de casos. El mundo recuerda lo que hizo el jugador.

**Por qué importa**:
- Las consecuencias retardadas tienen un canal visible donde manifestarse (el jugador lee la noticia y conecta los puntos)
- Refuerza la sensación de "mundo que recuerda" que pide el world bible
- Conecta hilo profesional con vida cotidiana del jugador sin contaminar el hilo principal de Mara/Cero
- Las noticias pueden ser anzuelos para nuevos casos (la vecina anciana lee y comenta)

**Implementación SIN coste de IA**:

Plantillas paramétricas por TONO del caso resuelto. El código tiene 3-5 plantillas por tono. Cuando termina un caso, el sistema escoge plantilla del tono usado y rellena huecos con datos reales del caso (zona, NPC, víctima si aplica). Cero tokens. Variedad amplia.

Ejemplo de plantillas (a desarrollar al programar):

```
VIOLENTO:
  - "Hallado [VICTIMA] en [SITIO_PROXIMO_A_ZONA]. Causa: violencia."
  - "Pelea con resultado mortal cerca de [ZONA]. Autoridades sin testigos."
  - "Cuerpo aparecido en [SECTOR]. Sin identificar de momento."

EMPÁTICO:
  - "Familia de [VICTIMA] retira denuncia. Asunto cerrado en silencio."
  - "Reaparece [VICTIMA] sano y salvo. Familia se niega a hacer declaraciones."

VENAL:
  - "Movimientos de dinero detectados en [SECTOR]. Investigación interna en curso."
  - "[FACCION] niega rumores de pagos no oficiales."

HONESTO:
  - "Testimonio anónimo destapa irregularidades en [FACCION]."
  - "Investigación reabierta tras nueva información."

FRÍO / MANIPULADOR / EVASIVO: similar, a definir.
```

**Cuándo aparecen las noticias** (sistema de doble fase):

1. **Noticia local rápida** (esa misma noche al cerrar el caso): comentario del barrio, rumor, observación de NPC ambiental. Aparece en el feed con etiqueta tipo "Rumores del barrio".
2. **Noticia formal al día siguiente** (junto con las consecuencias retardadas de reputación): aparece en el feed con etiqueta tipo "Informe HELIX" o "Boletín del sector".

Esto refuerza el ritmo noir: lo personal antes que lo oficial. El barrio sabe antes que las autoridades.

**Eventos aleatorios del tránsito referencian casos recientes**:

- Solo los **últimos 3-5 casos** del jugador
- El código mantiene una lista corta de "casos memorables recientes"
- Los eventos aleatorios pueden tirar de plantillas adicionales que referencian esa lista:
  - "Un yonki te suelta: 'Tú eres la que [VERBO_PASADO_DEL_CASO] en [ZONA]. El gordo todavía habla de eso.'"
  - "Una vecina pega un cartel. Reconoces la cara — es [VICTIMA_DE_CASO_PASADO]."
  - "El dueño del bar te sirve sin que pidas. 'Después de lo del otro día, esto va por la casa.'"
- Cero tokens IA — todo plantilla rellenable

**Pendiente para el programar**:
- Escribir el set de plantillas por tono (3-5 cada uno × 7 tonos = ~25-30 plantillas pequeñas)
- Escribir el set de plantillas de eventos reactivos (~10-15)
- Decidir cómo se decide si una noticia es "interesante" para mantener en el feed o se rota fuera
- Sincronizar con el sistema de fechas del juego (BLOQUE JS-11)

## B2. PRIORIDAD MEDIA

### B2.1 — Sistema de memoria del jugador
Cuando el jugador acumula 30, 50, 100 eventos, no se pueden inyectar todos en cada prompt. Hace falta una **capa de resumen y prioridad**: qué eventos se recuerdan, cómo se comprimen, qué nivel de detalle se mantiene.

### B2.2 — Sistema de validación de respuestas IA
La IA va a generar tonterías ocasionalmente (opciones que rompen tono, NPCs inventados, contradicciones). Hace falta decidir:
- ¿Hay reintentos automáticos si la respuesta no cumple criterios?
- ¿Hay filtros (palabras prohibidas, formato esperado)?
- ¿O es "rezamos y publicamos"?

### B2.3 — Cómo se presenta el caso al jugador
- ¿El NPC habla en una escena tipo conversación (como Mara en el mercado)?
- ¿Aparece como notificación en el panel?
- ¿Se integra con el panel TRABAJOS o es flujo aparte?

### B2.4 — Reincidencia y disponibilidad de NPCs
- ¿Cuánto tiempo entre un caso y el siguiente con el mismo NPC?
- ¿Hay límite de casos por NPC en una partida?
- ¿Los NPCs evolucionan según la reputación del jugador con ellos?

## B3. PRIORIDAD BAJA (decisión futura)

### B3.1 — Caso de ejemplo escrito a mano completo
Pendiente reescribir el caso "El chaval de la 4B" respetando todo el canon corregido (sin nacionalidades, con zonas canon, con NPC encargante real). Sirve de molde para la IA.

### B3.2 — Religión y espiritualidad en NEON ASHES
La IGLESIA DEL ECO existe en el canon de facciones. El Culto de la Carne Perfecta también. Pero no está definido si hay religiones residuales antiguas (cristianismo, budismo, etc.) o si solo existen estas. Probablemente solo estas, por coherencia con la deculturalización.

### B3.3 — Drogas concretas del mundo
Mencionado modafinilo en el caso de ejemplo (real, siglo XXI). Conviene decidir si las drogas mantienen nombres reales o si hay nomenclatura NEON ASHES propia. Lista mínima a definir.

### B3.4 — Implantes y tecnología
Hay menciones en zonas y facciones (mandíbula de titanio, brazos augmentados, ojos artificiales, paneles de titanio en cara). Conviene una pequeña biblia de qué implantes existen y qué hacen.

---

# PARTE C — CONTEXTO TÉCNICO

## C1. Estado del archivo HTML

- Archivo de trabajo: `NeonAshes-56v7-AUDIOSTRIPPED-indice-corregido.html` (~3.85 MB, 10.640 líneas)
- Estructura: monolítico, organizado en bloques numerados (CSS 1-45, HTML 1-26, JS 0-49)
- Índice maestro al inicio del archivo, actualizado y validado
- Decisión: **NO modularizar todavía**. El sistema IA se programa dentro del mismo archivo, en un rango de bloques propio reservado (sugerido: JS-50 a JS-59 para el sistema IA completo).

## C2. Lo que el código YA tiene implementado y que el sistema IA aprovecha

- **Reloj diegético** (BLOQUE JS-11) — fecha y hora del juego, 25 dic 2247 03:14
- **Sistema de muerte y herencia** (BLOQUE JS-13, JS-09, JS-10) — vidas que mueren, mundo que recuerda
- **Stats humanas visibles** (BLOQUE JS-05) — fatiga, hambre, disociación, aislamiento
- **Panel HUB** (BLOQUE HTML-08, CSS-33-37) — estado, contactos, trabajos, noticias
- **Sistema de facciones con reputación** (BLOQUE JS-30) — 8 facciones globales, persistencia en localStorage
- **Sistema de zonas con reputación y viaje libre** (BLOQUE JS-47, JS-48) — 4 zonas estables canon
- **4 NPCs contacto** por zona (Mano Roja, Hermana Vael, Cero-Ocho, Don Vasek) — definidos pero **sin lógica de diálogo conectada todavía**
- **Sistema de eventos aleatorios en zonas** (BLOQUE JS-20) — modelo a imitar para casos
- **Sistema de cobros diarios** (BLOQUE JS-12) — alquiler que presiona al jugador a trabajar
- **Inventario y créditos** (BLOQUE JS-04, JS-18)
- **Sistema de memoria del jugador básico** (BLOQUE JS-15) — para expandir

## C3. Bloques nuevos a crear para el sistema IA (estimación)

Reservar **JS-50 a JS-59** para el sistema IA completo. Estimación inicial:

- JS-50 — Cliente API (configuración, llamadas, manejo de errores)
- JS-51 — System prompt y reglas duras del mundo
- JS-52 — Construcción del contexto (stats, memoria, ubicación, NPC)
- JS-53 — Lógica de casos (estado de caso activo, transiciones de escena)
- JS-54 — Conexión casos → NPCs canónicos
- JS-55 — Aplicación de consecuencias (stats, reputación, inventario)
- JS-56 — Memoria persistente de casos resueltos
- JS-57 — UI de presentación de casos (escenas, opciones, prosa)
- JS-58 — Validación y reintentos
- JS-59 — Panel de depuración del sistema IA

(También HTML-27, CSS-46 reservados para UI del sistema si hace falta.)

## C4. LAUNCHER — variables a añadir cuando se programe

Cuando se empiece a programar, añadir al LAUNCHER (JS-00):

```javascript
// === SISTEMA IA NARRATIVO ===

// Cadena de fallback de proveedores (fase 1)
API_PROVEEDOR_PRINCIPAL: 'gemini',     // 'gemini' | 'groq' | 'openrouter'
API_PROVEEDOR_FALLBACK: 'groq',        // si el principal falla, se intenta este
API_PROVEEDORES_TERCIARIOS: [],         // futuro: lista de adicionales

// Claves de API por proveedor (fase 1: del dev; fase 2: del usuario en localStorage)
API_KEY_GEMINI: '',                     // de aistudio.google.com
API_KEY_GROQ: '',                       // de console.groq.com
API_KEY_FUENTE: 'launcher',             // 'launcher' | 'usuario_localstorage'

// Modelos concretos por proveedor
API_MODELO_GEMINI: 'gemini-2.0-flash',
API_MODELO_GROQ: 'llama-3.3-70b-versatile',

// Parámetros de generación
API_MAX_TOKENS_RESPUESTA: 800,
API_TEMPERATURA: 0.85,
API_TIMEOUT_MS: 8000,                   // tras este timeout, salta al fallback
API_REINTENTOS_POR_PROVEEDOR: 1,        // antes de saltar al siguiente

// Telemetría local (para evaluar coste/uso en pruebas)
API_LOG_LLAMADAS: true,                 // guarda contador en localStorage
API_LOG_TOKENS: true,                   // estima tokens consumidos por llamada
```

## C5. Decisiones que afectan al código existente

1. **JS-49 (AMBIENTE SONORO)** — las 3 pistas base64 fueron retiradas. Lógica de mezcla y fade viva. Hace falta cargar pistas externas si se quiere reactivar.
2. **AUDIO en JS-01** — sigue habiendo un audio embebido grande (~753 KB) que es el tema musical principal. Candidato a externalizar si vuelve a haber problemas de tamaño.

---

# RESUMEN EJECUTIVO (1 párrafo para retomar)

NEON ASHES tendrá un sistema narrativo IA que genera **casos de investigación de 3 escenas + epílogo**, con **3 llamadas IA por caso**. El flujo: el NPC manda un mensaje al TERMINAL del apartamento (plantilla pre-escrita gratis, 8 totales) → Escena 1 en sitio público (1 IA, conversación con el NPC, opciones aceptar/rechazar + 2 generadas) → Escena 2 en sitio semi-clandestino (1 IA, 4 elementos interactivos fijos, jugador decide qué examinar, código registra) → Escena 3 en zona especial (1 IA, 4-5 opciones definitivas con tonos, consecuencias en DOS FASES: inmediatas al elegir + retardadas al día siguiente cuando "el barrio se entera") → Epílogo en apartamento (texto pre-escrito gratis, 7 plantillas una por tono). Cada opción del jugador lleva uno de **7 tonos** (VIOLENTO, EMPÁTICO, FRÍO, MANIPULADOR, EVASIVO, VENAL, HONESTO) que el código mapea a tabla de consecuencias. La IA NUNCA decide consecuencias numéricas. Los casos los encargan **4 NPCs canónicos** (Mano Roja, Hermana Vael, Cero-Ocho, Don Vasek), cada uno con su zona especial 1 a 1 (Astillero, Taller de Carne, Hornos, Lonja) y su tono de mensaje propio. El jugador empieza la partida con uno de **dos backgrounds** (Ex-Auxiliar / Del Barrio) que inicializan **7 stats ocultas comunes**. Motor IA: **cadena de fallback Gemini Flash + Groq Llama 3.3** (ambos gratis), arquitectura siguiendo **LEY #1 — austeridad de tokens** (memoria modo híbrido, system prompt minimalista 300-400 tokens, output máx 300 palabras, validación local MEDIA). Tono **noir adulto Nivel A**, lenguaje neutro estricto, sin nacionalidades, calendario 2247+. Programar el sistema en bloques **JS-50 a JS-59** sin modularizar. **Pendiente único de B1.4**: formato técnico exacto del prompt que se manda a la IA en cada llamada (qué se inyecta como contexto, estructura del system prompt fijo, formato JSON de respuesta). Esa es la pieza que se traduce directamente a código y conviene tomar con cabeza fresca.

---

*Documento generado al cierre de la sesión 03. Próxima sesión: B1.4 final (formato técnico del prompt) y luego B1.2 residual (cuándo y cómo se elige el background al iniciar partida).*
