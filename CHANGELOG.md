# NEON ASHES — Historial de versiones

> Este archivo es solo para consulta. NO se pega en chats nuevos.

## [0.111] - 2026-06-15
### Added
- Ocho corridas nuevas (cuatro por bando), sobre todo de rango bajo: contrabando de semillas, recuerdos, un desertor del Anillo y carga refrigerada; y por el lado de HELIX, notificaciones, un contrabandista de poca monta, un desalojo y un informante quemado.
### Fixed
- El scroll ya funciona en la ventana de implantes y en cualquier vista de zona con mucho contenido.
- El reloj de arriba ya no se solapa con el título al entrar en una zona: se atenúa mientras estás dentro y reaparece al salir.

## [0.110] - 2026-06-15
### Added
- Combate táctico por turnos en las corridas: las confrontaciones pueden tener varios enemigos a la vez, cada uno con su propia resistencia. Eliges a quién atacar en cada turno y los enemigos responden hasta que los neutralizas, escapas o caes.
- Refuerzos enemigos: guionizados (llegan en un turno concreto de ciertas corridas) y dinámicos (si haces mucho ruido, un coche frena y bajan más).
- Corridas más largas y variadas (6-9 nodos) para ambos bandos, con nuevas situaciones de rango alto: el testigo de Silencio Escarlata (Contrabando) y la limpieza que nadie firma (Seguridad), además del motín del Bloque 9 y el hierro para el Arrabal.
### Changed
- Reescrito el motor de confrontación para soportar grupos de enemigos manteniendo compatibilidad con los encuentros de un solo enemigo.

## [0.109] - 2026-06-14
### Added
- Las armas se desgastan con el uso en las corridas y acaban rompiéndose: el cuchillo aguanta menos que la pistola. Su condición (gastada, comprometida) se ve tanto en la confrontación como en el inventario del panel ESTADO.
- Botón para retirarse de una corrida a medias: pierdes el botín de esa corrida pero conservas la integridad y no bajas de rango.
- Botón de depuración "+10000 créditos" en el panel de debug.
### Changed
- La munición cargada ahora se conserva entre corridas en lugar de gastar un cargador entero cada vez que empiezas una.

## [0.108] - 2026-06-14
### Added
- Dos profesiones nuevas con un loop de "corrida" por nodos: Contrabandista (mover mercancía) y Seguridad HELIX (operaciones oficiales). Enemigos invertidos entre ambas: para el contrabandista, las patrullas de HELIX y las mafias rivales; para Seguridad, las mafias y los contrabandistas.
- Confrontaciones cuyas opciones dependen del equipo que llevas encima: disparar (gasta munición, mucho ruido), acuchillar (silencioso) o a puños (siempre disponible), más justificarte/imponer autoridad, sobornar o lanzar un señuelo según lo que tengas.
- Credencial de HELIX a la venta en el mercado (900 CR): desbloquea la profesión de Seguridad. Documentación sellada (75 CR) como vía social del contrabandista.
- Ocho corridas escritas a mano (cuatro por bando) con facciones del mundo y guiños a CERO.
### Changed
- El mercado ya no deja recomprar equipo único que ya posees (muestra "Ya lo tienes").

## [0.107] - 2026-06-14
### Added
- Scavenger: seis zonas nuevas de expedición que desbloquean los rangos altos (Desguazador, Recuperador, Arqueotécnico), con eventos propios y botín escalado; las de rango máximo rozan a CERO.
- Sistema de implantes estilo EVE en el Hospital HELIX: seis tipos normales y un especial que amplifica al resto, grados 1-5 (potencia grado x5%), cuatro ranuras normales y una especial. Efectos sobre decaimiento de stats, probabilidades de éxito y tiempo de acción. Sección AUMENTOS en el panel ESTADO.
### Fixed
- El Muro (deducción de Investigador): las pistas ahora se pueden arrastrar con el dedo en móvil, no solo tocar.

## [0.106] - 2026-06-14
### Added
- Despido por inactividad: si pasan 7 días de juego sin ejercer una profesión que ya tenías, te despiden de ella (rango y progreso a cero). El panel de PROFESIONES avisa de los días restantes de cada oficio.
- Tema de jazz noir con lluvia que suena en bucle al trabajar de Investigador o Cazarrecompensas.

## [0.105] - 2026-06-13
### Added
- Investigador Privado: cuatro casos nuevos que cubren los rangos altos antes vacíos (intriga de facción, drama íntimo con implantes de HELIX, deepfake político y un caso cumbre que roza a CERO).
- Cazarrecompensas: seis contratos nuevos para los rangos altos (Cazador de Cabezas, Segador y La Mano de HELIX), con dilemas morales que incluyen a CERO.

## [0.104] - 2026-06-13
### Added
- Profesión Hacker completa hasta el rango máximo: rangos Analista de Sistemas, Fantasma y Arquitecto de Red. Seis minijuegos nuevos (análisis de logs, reconstrucción de archivos, cortafuegos, ingeniería social, escaneo de vulnerabilidades y ensamblador de malware) y nueve contratos nuevos, incluido uno que conduce a un nodo enterrado relacionado con CERO.

## [0.103] - 2026-06-13
### Added
- Nueva profesión Hacker: trabajo 100% digital desde el terminal, sin viajes. Rangos Script Kiddie e Intruso con cuatro minijuegos (fuerza bruta, descifrado, inyección de código y limpieza de rastros) y seis contratos de la red clandestina.
- Ecos de la profesión Hacker en las noticias del terminal.

## [0.102] - 2026-06-13
### Added
- Ocho contratos nuevos de Cazarrecompensas (hasta once en total), repartidos entre el Loto, el Ferro, HELIX y encargos sin facción, cubriendo desde rango 0 hasta rango 5. Incluye casos íntimos y desgarradores y uno que roza el misterio de CERO.
- Al pulsar "Explorar la ciudad" ahora aparece una confirmación (¿Estás seguro? Sí / No) para evitar salidas accidentales.
### Fixed
- El reloj diegético ya no desaparece al volver al apartamento desde un estado de exploración interrumpido.
- Subido el marcador del Hospital HELIX en el mapa móvil.

## [0.101] - 2026-06-13
### Added
- Nueva profesión Cazarrecompensas: contratos de captura del Loto, el Ferro y HELIX, con opciones de abordaje según el equipo que llevas, persecución si el objetivo huye, "el pulso" para leer al objetivo y una decisión moral final (entregar, pactar o soltar).
- Los actos de las tres profesiones dejan eco en las noticias (sutil casi siempre; más directo en las decisiones gordas), con titulares que persisten hasta leerlos en el terminal.
### Changed
- El panel de Profesiones ahora muestra siempre todos los oficios; se entra al submenú de uno para ver sus acciones, sin perder de vista los demás.
- La transición día/noche del apartamento (móvil) pasa a un fundido corto y limpio a las 08:00 y 20:00, evitando el desajuste de imágenes.
### Fixed
- Reubicados los marcadores de Arrabal y Explorar en el mapa móvil.

## [0.100] - 2026-06-13
### Added
- Cinco eventos nuevos en el Hospital HELIX (huelga, brote, médico corrupto, ala de extracción de órganos, confusión de identidad), hasta un total de ocho.
- Dieciséis eventos nuevos de zona (cuatro por cada barrio: Arrabal, Santuario, Nodo y Ferro).
- Doce rumores nuevos con ganchos al resto del mundo del juego.
- El clímax de la cadena del Sindicato Ferro ahora se ramifica: matar o perdonar a Mano Roja lleva a desenlaces distintos, y matarla cierra la cadena del Loto.
### Changed
- Marcadores de zona del mapa móvil recolocados sobre la nueva imagen.
- Afinada la crudeza de varios textos (callejón del Arrabal, carroñero herido) acorde al tono del juego.

## [0.99] - 2026-06-11
### Added
- Cuatro escenas nuevas de expedición de chatarra (altar de chatarra, niña perdida, dron caído, compañero herido).
- Cuatro casos nuevos para el Investigador Privado: "¿De quién es el perro?", "El inquilino fantasma", "La cita que no era" y "La hora del almuerzo".
### Changed
- Nueva imagen de fondo del mapa en móvil, sin marcadores ni texto.

## [0.98] - 2026-06-10
### Added
- "El Muro": nuevo minijuego de deducción para el Investigador Privado. El jugador criba las pistas reunidas (sólido/descartar) y luego respalda cada acusación con una pista sólida.
### Changed
- La deducción de los casos ya no es un test de respuestas: el resultado depende de acusar bien y de haber cribado y respaldado correctamente. Cribar mal baja la recompensa pero no hace fallar el caso.

## [0.97] - 2026-06-10
### Added
- Cuatro casos nuevos para el Investigador Privado: "La voz en la línea muerta", "El testigo que no recuerda", "Nadie pregunta por los vivos" y "El milagro de la Hermana Vael".
### Changed
- El tablón de casos ahora se ordena de menos a más exigente (rango, peligro y paga ascendentes).

## [0.96.1] - 2026-06-10
### Fixed
- Pantalla de identidad: en algunos navegadores móviles (Opera GX) el teclado se abría y se cerraba al instante al tocar los campos de nombre y apellido, impidiendo escribir. Ya se puede escribir con normalidad. El arreglo no afecta al resto de navegadores.

## [0.96] - 2026-06-10
### Changed
- Investigador: los casos ya no se resuelven agotando todas las pistas. Ahora tienes un número limitado de diligencias antes de que el caso se cierre solo, así que debes elegir dónde mirar. Hay pistas falsas y vías engañosas mezcladas con las verdaderas. "Expediente en gris" reescrito con esa tensión.

## [0.95.1] - 2026-06-09
### Fixed
- El Investigador ya se puede desplazar (scroll) en el tablón de casos, en las escenas y en la deducción; antes no se podía bajar para leer o elegir.
- Al abrir el tablón de casos desde Trabajos, ya no se queda detrás de la ventana: ahora se cierra Trabajos y se ve el panel directamente.
### Changed
- El Investigador usa efectos de sonido en sus momentos clave (abrir tablón, aceptar caso, descubrir pistas, entrar en la deducción y desenlace) para dar más inmersión.
- Más texto y atmósfera en el caso "Expediente en gris" (escena del conducto y desenlaces).
- Scavenger: el botón "Salir a buscar chatarra" ahora abre directamente la expedición (eran lo mismo); se elimina el botón redundante "Montar una expedición" y la antigua búsqueda rápida. Cooldown de la expedición ajustado a 2 horas.

## [0.95] - 2026-06-09
### Added
- Nueva profesión: Investigador Privado. Trabaja por casos en vez de tiradas. Desde el botón TRABAJAR se abre un tablón con un pool de casos de distinto contratante y peligrosidad (los más peligrosos piden más rango).
- Caso completo de ejemplo, "Expediente en gris": investigación con varias líneas (escena del crimen, viuda, capataz), entrevistas con distintos enfoques (presionar, empathizar, mentir, sobornar) que dan pistas, y una deducción final (quién, por qué y cómo) con tres desenlaces según los aciertos: verdad completa, resolución parcial o final equivocado.

## [0.94] - 2026-06-09
### Added
- Nueva zona en el mapa: Centro Médico Público HELIX, con la Dra. Lira Malk. Permite curar heridas (con coste), pedir una revisión médica (resumen del estado del personaje) y consultar implantes básicos. Incluye eventos propios (cola de pacientes, error en el historial, paciente que necesita ayuda).
- Imágenes propias de viaje hacia el hospital.
### Changed
- Rediseño del mapa del mundo en móvil y ordenador: imágenes nuevas, mejor encuadre (sin imagen duplicada ni espacio negro sobrante) y las seis zonas colocadas de forma clara y legible en ambos formatos.

## [0.93] - 2026-06-09
### Added
- Capa 4 del refinado: el encargo ahora tiene dos fases. Al cumplir el primero aparece un segundo encargo más exigente, con aviso en pantalla y mayor bonus de calidad y créditos. No penaliza si no se completa.
- Iconos ilustrados para las piezas del refinado (procesador, batería, sensor, mecánico, chip HELIX y chatarra).
### Changed
- Rediseño visual del refinado: fichas con relieve, tablero con aspecto de máquina, barras y encargo más cuidados. Las casillas ahora son cuadradas (7×8) y el tablero se adapta para verse bien tanto en móvil vertical como en pantalla de ordenador.

## [0.92] - 2026-06-08
### Added
- Nuevos eventos de exploración, de scavenger y de tránsito cuyas opciones y desenlaces cambian según los objetos que lleva el jugador.
### Changed
- Los eventos de tránsito ahora entregan objetos reales del inventario en vez de objetos de adorno.

## [0.91] - 2026-06-08
### Added
- Refinado capa 3: temporizador de 90 s, encargo con bonus, barra de chatarra que penaliza, y bomba de desguace (barrido 5x5).
- Control del tablero por arrastre (ratón y táctil), con el doble toque como respaldo.

## [0.90.8] - 2026-06-08
### Fixed
- El Depósito Orbital ya se puede desbloquear. La comprobación de rango estaba rota (comparaba texto con un número) y la zona era inalcanzable. Ahora se desbloquea al alcanzar el rango Buzo de Chatarra.
### Changed
- El Depósito Orbital pide ahora rango Buzo de Chatarra (antes Recuperador).
- El candado de las zonas por rango indica el rango concreto que hace falta.

## [0.90.7] - 2026-06-08
### Fixed
- Al abrir el refinado desde "Procesar chatarra", el panel de profesiones se cierra solo. Antes quedaba por encima y había que cerrarlo a mano para ver el tablero.

## [0.90.6] - 2026-06-08
### Fixed
- El botón "Procesar chatarra" ahora abre el minijuego de refinado de forma directa, igual que el botón de prueba. Cobra la chatarra y mantiene el tiempo de juego, el cooldown y la subida de rango.

## [0.90.4] - 2026-06-08
### Fixed
- El botón "Procesar chatarra" ya abre el minijuego de refinado. Se fuerza la recarga de los archivos del juego para evitar versiones antiguas guardadas en el navegador, y se retiran los avisos de diagnóstico.

## [0.90.3] - 2026-06-08
### Fixed
- Diagnóstico del botón "Procesar chatarra": añadido aviso al pulsarlo y reforzada la conexión con el minijuego de refinado.

## [0.90.2] - 2026-06-08
### Fixed
- Reforzada la apertura del minijuego de refinado para que siempre muestre la pantalla, con varios respaldos si el cambio de escena fallaba.
- Añadido un aviso temporal al abrir el desmontaje para diagnóstico.

## [0.90] - 2026-06-08
### Added
- El minijuego de refinado ya está conectado con el botín real. El botón "Procesar chatarra" del Scavenger lanza el desmontaje en vez de resolverse solo.
- El refinado cuesta 3 de chatarra (la normal y la "en bruto" de expediciones cuentan juntas) y mantiene el tiempo de juego, el cooldown de 4 h y la subida de rango de la acción anterior.
- Al terminar, una pantalla de resumen entrega chatarra refinada (vendible), créditos según la calidad alcanzada, y los hallazgos (memoria, chip HELIX, núcleo CERO) convertidos en objetos reales del inventario. Cuanto mejor se juega, más se obtiene.

## [0.89.6] - 2026-06-07
### Changed
- Refinado en móvil: el tablero ahora cabe entero en pantalla sin scroll. Las fichas se ajustan de tamaño para que las ocho filas siempre quepan entre la cabecera y el botón.
### Fixed
- El scroll con el dedo en la lista del inventario y en la exploración/expedición ya funciona (había un bloqueo de scroll táctil que solo lo permitía en algunas pantallas).
- Expedición en móvil: la pantalla de elegir zona ya no queda tan pegada al borde de arriba.

## [0.89.4] - 2026-06-07
### Fixed
- Refinado en móvil: rehecho el encaje de la pantalla. El tablero ahora cabe entero (se ajusta de tamaño y, si hiciera falta, hace scroll dentro de su marco) y el botón "Terminar desmontaje" vuelve a estar fijo abajo y siempre visible, en vez de quedar en mitad del tablero.
- Expedición en móvil: el título de la primera zona ya no choca con el reloj de arriba. Durante la expedición el reloj se oculta (como ya pasa al explorar) y vuelve a aparecer al salir.

## [0.89.3] - 2026-06-07
### Fixed
- Refinado en móvil: el botón "Terminar desmontaje" ya no queda tapado por la barra de abajo (créditos/estado/inventario); ahora se eleva por encima de ella y siempre es visible y tocable.
- Expedición en móvil: el título de la primera zona ("Conducto de servicio") ya no choca con el reloj de arriba; se ha dado más hueco superior para librarlo siempre.

## [0.89.2] - 2026-06-07
### Added
- Refinado (capa 2): piezas especiales al casar 4, 5 o formas en L/T. Cuatro en línea crea una carga que limpia su fila o columna; cinco en línea crea un pulso que barre todas las fichas de ese tipo; una L o T crea una descarga que limpia la zona de alrededor. Se activan al volver a casarlas y encadenan reacciones.
- Refinado: hallazgos raros con un susurro narrativo al aparecer — memoria intacta, chip HELIX corrupto y, muy de vez en cuando, un núcleo CERO. De momento se cuentan y avisan; el enganche al inventario llegará después.
- Refinado: barra de calidad que sube con combos, piezas especiales y hallazgos (por ahora solo indicador visual).
- Refinado: animaciones de aparición y activación de las piezas especiales, y un destello al encontrar un hallazgo. Sonidos del banco de efectos ya existente.

## [0.89.1] - 2026-06-05
### Fixed
- Arreglada la pantalla en negro que se quedaba al ser capturado en una expedición (al cerrar el desenlace volvía a una pantalla inexistente). Además, ahora si por lo que sea el destino no existe, siempre se vuelve al apartamento en vez de quedarse en negro.
- Refinado en móvil: el título ya no choca con el reloj de arriba, y el botón "Terminar desmontaje" queda fijo abajo, siempre visible.
- Expedición en móvil: la pantalla de elegir zona ya no choca con el reloj de arriba.
### Changed
- Expedición en móvil: las tarjetas de elegir zona son bastante más compactas (antes seguían ocupando demasiado).

## [0.89] - 2026-06-05
### Added
- Sonido de efectos (FX) en el juego: al abrir y cerrar el terminal, al abrir paneles (con un toque distinto para noticias y mensajes), al elegir profesión, y al entrar a cada tramo de una expedición (con un latido de tensión si la alerta va alta). Mientras decides en una escena de expedición suena un ambiente grave de fondo que se corta al elegir. Todo respeta el botón de sonido general: si lo apagas, los FX callan. Se incorporan 59 sonidos al juego; se irán enganchando más eventos en futuras actualizaciones.
- Primera versión jugable del minijuego de REFINADO/DESMONTAJE: un tablero tipo match-3 tematizado como mesa de desguace, donde conectas componentes iguales (procesadores, baterías, sensores, mecánicos, chips HELIX) para extraerlos. Intercambias fichas adyacentes; al formar líneas de 3 o más, se extraen, las de arriba caen y se rellena por arriba, encadenando combos. De momento es el tablero base jugable (sin metas ni combinaciones especiales todavía); accesible para pruebas desde el panel de desarrollo.
- Nueva sección "Moralidad" en la ventana de reputaciones: refleja cómo te ve la calle según tus decisiones (lo que antes era el dato de "reputación" del inventario, ahora con más sentido y mejor sitio).
### Fixed
- Inventario en móvil: la lista de objetos ahora hace scroll correctamente sin cortarse ni empujar el botón de cerrar.
- Expedición: el texto de cada escena ya no parpadea (salía, se desvanecía y volvía a salir); ahora la imagen de fondo entra con un destello y se atenúa sin tapar el texto.
### Changed
- Expedición en móvil: las tarjetas y cajas son más compactas, para que quepa más en pantalla.
- La "reputación" se quita de la ventana de inventario (pasa a llamarse Moralidad y vive en la ventana de reputaciones).

## [0.87] - 2026-06-05
### Added
- Las expediciones son más largas y variadas: más tramos por zona (el pozo ahora son 6-8, el conducto 3-4, etc.) y 9 tipos de escena nuevos (un terminal con datos, un cuerpo que registrar, un derrumbe, un mendigo que da un soplo a cambio de comida, cableado vivo, un silencio inquietante, otro carroñero rival, una zona de humedad tóxica y un generador caliente). De 5 a 14 situaciones distintas.
- Imágenes de fondo en las expediciones: al entrar a cada tramo, una imagen ambienta la escena con un destello fuerte los primeros segundos y luego se atenúa al fondo para leer, como en explorar. Cada tipo de escena tiene su propia imagen.
- En el mercado puedes elegir cuántas unidades comprar o vender con un selector −/+ y un botón "Todo". Ya no hay que ir de uno en uno.
- Aviso abajo a la izquierda al comprar o vender: "ADQUIRIDO · [objeto] xN" o "VENDIDO · [objeto] xN" con los créditos movidos.
### Changed
- La alerta de las expediciones sube un poco más despacio, para dar más margen sin perder la tensión.
- Comprar y vender en el mercado pide confirmación en la propia fila ("¿Seguro? Sí / No"), para no comprar ni vender de un toque accidental.

## [0.86.9] - 2026-06-05
### Added
- MERCADO funcional en el terminal del apartamento (icono MERCADO, que antes salía "en mantenimiento"). Dos pestañas: VENDER (liquidas tu botín y materiales —núcleos, servidores, chatarra— por créditos) y COMPRAR (equipo para tus expediciones: medkit, kit de trauma, ganzúas, baterías, armas, máscara, analizador...). Cierra el círculo del loop: rebuscas, vendes lo que sacas y compras mejor equipo. El mercado es caro al comprar y paga por debajo al vender, a propósito. Precios provisionales, fáciles de ajustar.

## [0.86.8] - 2026-06-05
### Added
- Las expediciones ahora cuestan tiempo: cada tramo de la incursión consume entre 50 y 70 minutos de juego, igual que cualquier escena. Una expedición larga puede llevarte varias horas, cruzar la medianoche y hacer que te caiga el cobro del alquiler. Alargar la incursión ya no solo sube la alerta: también te come el día.

## [0.86.7] - 2026-06-05
### Added
- Loop de expedición jugable de principio a fin: elegir zona (con su riesgo, tramos y zonas bloqueadas), preparar el equipo que te llevas de la mochila, vivir la incursión tramo a tramo con opciones según el equipo y un medidor de alerta que sube según lo que haces, decidir en cada tramo si seguir adentro o retirarte con lo conseguido, y un desenlace: salir con el botín o, si la alerta se dispara, que te pillen y pierdas parte de lo reunido. El botín (créditos y objetos) solo se recoge si sales con vida. Estilo alineado al lenguaje visual del juego.
- El kit de trauma cumple su función: si llevas uno en una expedición y las cosas acaban fatal, se consume y te salva una vez (sales malherido y sin el botín de esa incursión, pero vivo). Sin kit, el mal final es real.
- Nueva opción "Montar una expedición" en la profesión Scavenger, que convive con la búsqueda rápida de siempre: la búsqueda rápida sigue igual (un clic, un resultado) y la expedición es la incursión larga con riesgo y mejor botín. Tú eliges.
- Acceso de prueba a la expedición desde el panel de desarrollo (oculto para el jugador normal).

## [0.86.6] - 2026-06-05
### Added
- Catálogo de objetos de expedición completo: además de lo anterior, se añade el equipo (cuchillo de monofilo, pistola de raíl, analizador portátil y sus células, ganzúas, máscara de filtro) y los materiales de botín (chatarra en bruto, chatarra refinada) y los primeros hallazgos raros (núcleo óptico, servidor hundido). Siguen sin tener uso aún.
- Motor interno del loop de expedición/scavenging: zonas (conducto, contenedor HELIX, vehículo, pozo, y dos zonas bloqueadas), eventos con opciones según el equipo, medidor de alerta, botín que se acumula durante la incursión y se recoge solo al salir con vida, riesgo de captura y reparto de pérdidas. De momento es solo la maquinaria por dentro: todavía no hay pantallas ni se juega.

## [0.86.5] - 2026-06-05
### Added
- Las noticias del terminal ahora reaccionan a lo que haces en la calle: si hubo violencia, si rebuscaste chatarra, si se movió dinero turbio o si te cruzaste con alguien en tu última salida (explorar o eventos de tránsito), aparecen titulares acordes. Más variedad también de titulares por facción.
### Fixed
- Acciones del apartamento: al usar una, su hueco se rellenaba al instante con otra acción, y una vez vistas todas ya no salía ninguna. Ahora el hueco se queda vacío durante el descanso (24h de juego) y solo entonces rota a una acción distinta, como debía ser.

## [0.86.4] - 2026-06-05
### Added
- Nuevos objetos base del futuro loop de expedición (de momento solo definidos, todavía sin uso): kit de trauma, medkit, cargador, ración deshidratada, licor, baterías de 2V/4V/8V, palanca térmica y señuelo. Se prepara también la categoría de implantes (grados 1, 2, 3 y especial), sin objetos concretos aún.
### Changed
- Acciones del apartamento (mirar la ventana, ducharte, fumar...): al usar una, ahora desaparece de la lista mientras descansa, en lugar de quedarse en gris ocupando sitio. Su sitio queda libre y, cuando vuelve a estar lista, se rellena con otra acción distinta para que haya variedad. El descanso de cada acción sube de 4 a 24 horas de juego.
- Explorar la ciudad: las escenas de relleno (las que no son momentos escritos a mano) ahora traen respuestas que encajan con lo que pasa en la escena y tienen matiz, en vez de las tres opciones de siempre que no cambiaban nada. Se acabó el "no ocurre nada" en cadenas de escenas seguidas.
### Fixed
- Dormir en el apartamento: si pulsabas "Dormir" y luego "Quedarte despierto", el botón de dormir desaparecía sin haber dormido. Ahora solo desaparece cuando duermes de verdad.

## [0.86.3] - 2026-06-05
### Fixed
- Apartamento en móvil: el intento anterior de colocar las acciones en una franja fija fallaba cuando había mucho contenido (narración larga + varias opciones): las acciones se hundían tras la barra de estado y el scroll saltaba al chocar con la imagen. Replanteado para que el contenido se ancle abajo y haga scroll de forma natural, como en las escenas de tránsito, con la imagen de fondo completa detrás.

## [0.86.2] - 2026-06-05
### Changed
- La pantalla de explorar la ciudad ahora comparte el mismo lenguaje visual que las escenas de tránsito y los eventos de viaje: acento magenta, tipografía Rajdhani en el título y paneles de texto con el estilo común del juego, en lugar de su antiguo estilo propio en cyan. Los colores de las opciones según su tono (violento, empático, frío...) se mantienen, porque indican el tipo de elección.

## [0.86.1] - 2026-06-05
### Fixed
- En móvil, las imágenes de día y noche del apartamento se veían descuadradas entre sí y se solapaban ("doble") durante el cambio de hora. Ahora ambas comparten el mismo encuadre y el fundido día/noche es limpio.
- En móvil, las acciones del apartamento se hundían y quedaban tapadas por la barra de estado. Ahora se apoyan en una franja fija bajo la habitación, sin solaparse con la barra.

## [0.86] - 2026-06-05
### Fixed
- Al volver de la misión al apartamento ya aparecen las acciones de ambiente (antes solo salían las fijas).
- Corregido un texto vacío que descuadraba el menú del apartamento al volver de la misión.
- Al encender el terminal ya se entra directo al escritorio, sin un texto previo que no daba tiempo a leer.
- Al cerrar el terminal ya no queda un texto fantasma; el apartamento se repone correctamente.

## [0.85] - 2026-06-04
### Changed
- En móvil, el apartamento usa dos imágenes verticales nuevas (día y noche) con la habitación arriba y una banda negra abajo donde se apoyan las acciones, adaptándose a cualquier pantalla. En PC se mantienen las apaisadas.
- En móvil, el texto y las opciones de los eventos de exploración se anclan abajo (sobre la barra de estado) y crecen hacia arriba, dejando la imagen de la escena despejada. Si el texto es muy largo, hace scroll interno en vez de tapar la imagen.

## [0.84] - 2026-06-04
### Changed
- Las dos acciones de la profesión recolector tienen ahora enfriamiento independiente: buscar chatarra 8 horas, refinar 4 horas. Cada una se puede usar por separado sin esperar a la otra.
- La exploración de la ciudad ya no usa la IA de relleno: funciona solo con los eventos escritos a mano, que son más coherentes. La IA queda desactivada a la espera de más pruebas (se puede reactivar fácilmente).

## [0.83] - 2026-06-04
### Fixed
- La profesión activa, su rango y su progreso se perdían al cerrar y volver a abrir el juego. Ahora se guardan con la partida.
- Las imágenes de las escenas de exploración se mostraban con zoom en móvil. Ahora se ven enteras, sin recorte.
### Changed
- La acción de refinar (Procesar chatarra) ahora requiere y consume 5 unidades de chatarra. El botón indica el coste y se bloquea si no tienes suficiente.

## [0.82] - 2026-06-04
### Added
- Dos cadenas de misión de cinco partes que avanzan entre exploraciones: "La señal del nivel 9" (una transmisión desde un nivel sellado, afín al Colectivo Sin Nombre) y "El nombre en la lista" (tu unidad marcada para reubicación, afín al Sindicato Ferro). Cada parte se desbloquea al haber visto la anterior, con recompensa final al completarlas.
### Fixed
- La imagen de día del apartamento se mostraba con más zoom que la de noche. Ahora ambas usan el mismo encuadre y el fundido día/noche cuadra.

## [0.81] - 2026-06-04
### Added
- Cuatro eventos largos de exploración, de cuatro a seis escenas cada uno, con decisiones que abren caminos distintos: un ascensor averiado, la deuda de un vecino, el taller de un relojero ciego y una redada en el mercado. El banco de momentos escritos a mano sube a 54.

## [0.80] - 2026-06-04
### Added
- Ciclo día/noche en el apartamento: la imagen de la habitación cambia según la hora del juego con un fundido suave. Es de noche de 19:00 a 08:00, de día entre medias, con transición gradual al amanecer y al anochecer.
- Diez eventos nuevos de exploración de dos y tres escenas, con decisiones encadenadas. El banco de momentos escritos a mano sube a 50.

## [0.79] - 2026-06-04
### Added
- Veinte eventos nuevos de una escena para la exploración de la ciudad: dieciséis con decisiones y efectos, y cuatro de puro ambiente. El banco de momentos escritos a mano sube de 20 a 40.
### Fixed
- Apartamento: retirado el reloj grande del centro, que seguía cayendo sobre las acciones en algunas pantallas. La hora se sigue viendo arriba en la barra.

## [0.78.6] - 2026-06-03
### Fixed
- Apartamento: el reloj deja de moverse con el texto y deja de tapar las acciones (ahora se puede pulsar a través de él). Va más pequeño y anclado en la franja bajo la foto.
### Added
- Cinco nuevas acciones de apartamento: fumar, leer el periódico digital, ducharte, mirarte al espejo y limpiar el apartamento.
### Changed
- Las acciones de ambiente ahora se muestran de tres en tres y se rigen por un cooldown de juego de 4h por acción (en vez de "una por visita"). Al hacer una, entra otra distinta en su lugar, ya en cooldown, para evitar encadenarlas. Salir y volver a entrar al apartamento ya no las recarga.
- Acciones del apartamento subidas para aprovechar el hueco que sobraba bajo la foto.

## [0.78.5] - 2026-06-03
### Added
- Nuevo objeto apilable "Chatarra": se acumula en el inventario y será la materia prima para refinar en la profesión Scavenger.
- Al explorar la ciudad ahora aparece chatarra como pequeño botín de consuelo en registros que no dan nada de valor, con su propia narración.
### Changed
- Apartamento: el reloj y la fecha se anclan a una posición fija y dejan de moverse cuando cambia el texto de las acciones.

## [0.78.4] - 2026-06-03
### Fixed
- El badge de novedad de Profesiones ahora aparece correctamente en cualquier partida nueva (antes no salía según cómo se empezara).
### Changed
- En pantallas de PC el texto y la interfaz se ven más grandes: a partir de 1024px de ancho y un poco más a partir de 1600px.
- Apartamento: el reloj central vuelve a su posición estable y visible (se revierte el intento anterior que lo hacía desaparecer).

## [0.78.3] - 2026-06-03
### Fixed
- El botón "Ir a trabajar" ahora aparece en el apartamento justo al escoger un oficio, sin tener que salir y volver a entrar.
- La última opción del apartamento ya no queda pegada a la barra de estado.
### Changed
- Apartamento: la imagen de fondo deja una pequeña franja negra arriba y el reloj se ancla justo bajo el borde de la imagen.
### Added
- Badge de novedad en el botón Estado de la barra inferior, que resalta cuando hay profesiones sin descubrir (se apaga al verlas).

## [0.78.2] - 2026-06-03
### Added
- Nueva opción "Ir a trabajar" en el apartamento (solo si ejerces algún oficio): atajo directo a las acciones de la profesión sin pasar por menús.
- Badges de aviso que guían hasta la pestaña Profesiones al empezar una partida, y se apagan al verla.
- Ventana de herencia al confirmar identidad: muestra el desglose (créditos heredados y carga de fatiga) y deja al jugador decidir si acepta la herencia o empieza sin nada. Rechazarla la descarta para siempre.
### Changed
- La herencia ya no se aplica automáticamente ni se cuenta al entrar al apartamento; ahora es una decisión del jugador en la ventana de herencia.
- Apartamento: la imagen de fondo baja un poco y el reloj se ancla más cerca de ella.

## [0.78.1] - 2026-06-02
### Added
- La acción "Salir a buscar chatarra" del Scavenger ahora pide elegir entre cuatro lugares (conducto, contenedor HELIX, vehículo abandonado, pozo de inundación), cada uno con distintos desenlaces: mejor o peor botín, heridas, fatiga o multas domiciliadas de HELIX según el riesgo.
### Changed
- Las profesiones solo se pueden ejercer y escoger desde el apartamento; fuera, la pestaña es de solo lectura.
- Subir de rango en una profesión cuesta ahora mucho más trabajo.
- Cada acción de trabajar tiene un descanso obligatorio de 8 horas de juego antes de poder repetir.
- Apartamento: la imagen de fondo se extiende más abajo y el reloj se ancla justo debajo de ella.
- Las siglas y barras de estado (F/A/H/D) del botón Estado son más grandes y legibles.

## [0.78] - 2026-06-02
### Added
- Sistema de profesiones: la subpestaña Profesiones permite escoger un oficio (Scavenger) y trabajar en él con un botón Trabajar que despliega acciones, paga créditos, suma progreso y sube de rango.
### Changed
- El alquiler diario sube de 100 a 250 CR para crear presión económica.
- La subpestaña antes llamada "Trabajos" pasa a llamarse "Profesiones".

---
> Si necesitas saber en qué versión se cambió algo, búscalo aquí.
>
> Para el estado actual del proyecto, ver `STATUS.md`.
>
> Convención (a partir de v55):
> - Cambios pequeños → añadir `vX` (ej. 56v2, 56v3)
> - Cambios gordos → subir número principal (56 → 57)

---

## [0.77.4] - 2026-06-02
### Added
- La pestaña Trabajos ahora tiene dos subpestañas: Encargos (el trabajo de Mara) y Trabajos (oficio, aún vacío).

---

## [0.77.3] - 2026-06-02
### Changed
- Mejorado el encuadre de la imagen y el reloj del apartamento en móvil.
### Added
- El juego se fuerza a orientación vertical en móvil; en horizontal se muestra un aviso para girar el dispositivo. No afecta a PC.

## [0.77.2] - 2026-06-02
### Changed
- El fondo del apartamento en móvil ahora se ve completo (menos zoom).
- El apartamento muestra una sola acción ambiental al entrar, elegida según el estado del jugador.
### Added
- El panel ESTADO incluye pestañas CONTACTOS y TRABAJOS, consultables fuera del apartamento en solo lectura. Salir a un objetivo sigue restringido al apartamento.
### Fixed
- El texto de las acciones del apartamento ya no se sustituye al instante por el texto inicial de la lluvia ácida.

## [0.77.1] - 2026-06-02
### Changed
- Reemplazados los fondos de apartamento, tren, pasillo y mercado por versiones limpias sin franjas de información incrustada.
### Added
- El módulo BANCO del terminal ahora muestra el extracto detallado de HELIX BANK, enlazado con los recibos del inventario. El enlace desde el inventario solo aparece estando en el apartamento.

## [0.77] - 2026-06-02
### Added
- Nuevas acciones en el apartamento: "Comer algo" (aparece cuando tienes hambre; te cobra créditos por comida de reparto y reduce el hambre), "Despejar la cabeza" (baja fatiga y disociación) y "Romper el silencio" (baja aislamiento). Cada una se puede hacer una vez por visita y tiene varios textos para no repetirse.
- Al hablar con el jefe de cada zona (Mano Roja, Hermana Vael, Cero-Ocho, Don Vasek), ahora queda guardado en CONTACTOS junto a Mara, con su relación según tu reputación con su facción.
### Changed
- Comer en el apartamento está preparado para gastar comida del inventario (gratis) en cuanto se añada; mientras tanto, siempre pides reparto y se cobra.
- Mejorados y ampliados los textos de transición y de zona, con más carga de lore: más variantes de corredor, tren vertical, aproximación a cada zona y descripción de cada zona.

---
### Changed
- La reputación de cada zona y la de su facción son ahora el mismo valor; se quita el bloque duplicado "Reputación por zona".
- La barra de facción muestra el número con claridad (+/-) y una escala centrada.
- Mensajes abre primero una bandeja de entrada donde eliges qué mensaje leer.
### Fixed
- La pantalla de dormir ya no incluye "Encender el terminal".
- La cabecera del terminal ya no se solapa con el reloj.
- Corregidos los huecos del apartamento y de las zonas; las opciones ya no quedan pegadas a la barra inferior.
### Added
- Las acciones de zona con recompensa solo se pueden hacer una vez por día de juego y desaparecen del menú tras usarlas.

## [0.76.4] - 2026-06-01
### Changed
- La acción "Seguir durmiendo" ahora se llama "Dormir".
- En el apartamento se elimina la barra inferior duplicada (Contactos, Noticias, Trabajos); queda Estado e Inventario.
- El icono Contactos del terminal ahora funciona y reúne Contactos y Trabajos en dos pestañas.
### Added
- Avisos "!" de noticias y trabajos sobre los iconos del terminal HELIX.

## [0.76.3] - 2026-06-01
### Fixed
- El estado (fatiga, aislamiento, hambre, disociación) ahora se actualiza en pantalla justo al cambiar.
- Los créditos se aplican siempre de forma fiable y la wallet nunca queda en negativo; los eventos de zona del mapa ya entregan también objetos y reputación que antes podían perderse.
### Added
- Aviso visual flotante cuando sube o baja la reputación con una facción.

## [0.76.2] - 2026-06-01
### Changed
- Al encender el terminal ahora se entra directamente al escritorio HELIX, sin paso intermedio.
### Fixed
- El terminal recupera su fondo (imagen del apartamento con tinte azul).
- Si abres el mapa desde el terminal, al volver regresas al terminal y no al apartamento.
### Added
- El mapa usa una imagen horizontal propia en PC (la vertical se mantiene en móvil), con los marcadores de zona recolocados para PC.

## [0.76.1] - 2026-06-01
### Changed
- El botón del apartamento ahora dice "Abrir el terminal" y entra al escritorio HELIX en lugar de saltar directo al mensaje.
### Fixed
- El escritorio HELIX ya tiene un botón "Cerrar terminal" para salir, colocado por encima de la barra inferior en móvil.
- Quitados los solapamientos de la parte superior: el reloj y la cabecera vieja se ocultan en el escritorio HELIX, y el reloj también se oculta durante la deriva para no pisar el texto en móvil.
- La cabecera del escritorio respeta el área segura del notch en móviles.

## [0.76] - 2026-06-01
### Added
- El terminal del apartamento ahora abre un escritorio corporativo HELIX con seis iconos. Mensajes, Mapa y Noticias funcionan; Mercado, Contactos y Banco muestran un módulo no disponible.

## [0.75] - 2026-06-01
### Added
- Cadenas de misiones de lore que se descubren explorando, una parte por partida. Cadena general "Lo que quedó arriba" (vida fuera de la Tierra) y una cadena de 5 partes por cada facción de zona, con recompensas crecientes y super-recompensa final (reputación + objeto único).
- Sistema de enemistad entre facciones de zona: ganar reputación con una baja la de su enemiga (Ferro contra Loto, Eco contra IA).
- Niveles de hostilidad al entrar en una zona cuya facción te odia: mal recibido, no te ayudan (contactos cerrados) y te atacan (pierdes créditos y sufres una herida).
- Nueva facción El Loto Carmesí, que rige el Arrabal Carmesí como barrio del placer.
### Changed
- El Arrabal Carmesí deja de ser "Los Óxidos" y pasa a ser el barrio del placer del Loto Carmesí (textos, eventos y contacto reescritos). El óxido y el hierro pasan a ser propios del Distrito Ferro.
### Fixed
- La reputación con la Iglesia del Eco y las IA ya se muestra y funciona; antes se guardaba con un identificador distinto al del panel y quedaba invisible.

## [0.74.3] - 2026-05-31
### Fixed
- El texto de la intro ahora se desvanece de forma suave entre frase y frase, en vez de cortarse de golpe; la última frase también se atenúa antes de aparecer el logo.
- El sonido ambiente (lluvia, gente, industrial) ya suena durante el juego; antes intentaba arrancar una sola vez en una pantalla en silencio y se quedaba mudo para siempre.
- Al terminar o saltar la intro ahora arranca el Main Theme del juego; antes el audio quedaba en pausa.
### Changed
- El brillo neón del logo de la intro ahora es un resplandor que late detrás del logo (visible aunque el logo sea una imagen sin transparencia).

## [0.74.2] - 2026-05-31
### Added
- Sistema de escenas de exploración escritas a mano: momentos con texto e imagen fijos, opciones que cierren el momento o encadenan a otra escena, condiciones de aparición, opciones bloqueadas por estado (dinero/fuerza/objeto), efectos (créditos, fatiga, heridas, objetos, facción), resultados con azar y agotamiento (un momento visto no se repite).
- 24 momentos jugables anclados en el mundo (HELIX, las Pilas, las cuatro facciones, la señal): 20 de ellos de 4 escenas con ramas y consecuencias, más varios cortos de ejemplo.
- La IA puede generar momentos de UNA escena como relleno durante la exploración, aprendiendo la estructura; sus efectos están limitados a rangos seguros para que no descuadre la partida. Las cadenas y los momentos importantes siguen siendo a mano.

## [0.73.3.2] - 2026-05-31
### Fixed
- Corregido un parpadeo del texto de la intro: al cambiar de imagen, la frase aparecía, se desvanecía un instante y volvía a aparecer. Ahora aparece una sola vez por frame.
### Changed
- La primera pantalla de la intro ya no muestra el título "NEON ASHES" (solo "toca para comenzar"); el logo aparece más adelante.
- El logo del final de la intro ahora tiene un brillo neón pulsante en cian y magenta.

## [0.73.3.1] - 2026-05-31
### Changed
- Texto de la intro en verde neón con un fondo oscuro detrás para que se lea mejor sobre las imágenes.
- En móvil las imágenes de la intro tienen menos zoom (se recorta menos la composición).

## [0.73.3] - 2026-05-31
### Changed
- Intro reconstruida sobre el nuevo tema principal: 16 imágenes narradas (≈5s cada una), el logo aparece en el segundo 84 y permanece 10 segundos.
- La intro empieza con una pantalla "toca para comenzar" que enciende el sonido (necesario para que la música suene en navegador) y entra a la intro.
- Al terminar la intro se va directamente a crear personaje (se elimina la pantalla de carga intermedia).
### Added
- Tras el logo, pase de imágenes de fondo aleatorias del proyecto con movimiento lento, hasta que acaba la canción; si el jugador no la salta, cierra solo y pasa a crear personaje.

## [0.73.2] - 2026-05-31
### Changed
- Nueva intro cinemática: 17 imágenes a pantalla completa con movimiento lento (Ken Burns) y narración en texto, reemplazando los 5 frames anteriores que avanzaban tocando la pantalla.
### Added
- La intro ahora se reproduce sola, sincronizada con "Ashes of Helix", y el logo del juego aparece en el segundo 51 (el breakdown). Botón de saltar siempre visible.

## [0.73.1] - 2026-05-31
### Fixed
- La deriva mantiene mejor el hilo entre escenas: los detalles que aparecen (un vehículo, la lluvia, quién está presente) ya no se contradicen en la escena siguiente.
- En móvil las imágenes de escena se veían con demasiado zoom; ahora se aprecian mejor.
### Changed
- El inventario es más grande y la lista se puede deslizar cuando hay muchos objetos.

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
- El inventario mostraba "[object Object]": now the objects salen con su nombre y descripción en la pestaña INVENTARIO
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
- Arreglado with `pointer-events:none` en el velo and `z-index:5` al contenedor `#tarjetas-loc-mision`.

## v31 — Rediseño del flujo del apartamento

- 3 botones → **4 botones en orden fijo**: Mirar por la ventana / Dormir / Salir del apartamento (gris, "PRÓXIMAMENTE") / Encender el terminal.
- La misión Mara se movió del terminal al **panel TRABAJOS** del hub.
- **Viaje de vuelta nuevo**: tras la entrega con Mara, ya no hay "FIN DEL FRAGMENTO". 3 paradas simétricas a la ida con eventos aleatorios → llegas a casa → dormir cierra el día.
- Si robas el paquete, salta directo al apartamento (ya tomó la ruta larga).

---

## v1–v30 — Prehistoria del proyecto (no documentada)

No hay registro detallado de estas versiones en el historial accesible. Cuando empieza la documentation (mayo 2026), el proyecto ya estaba en v31 con un vertical slice funcional. Lo que ya existía:

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
