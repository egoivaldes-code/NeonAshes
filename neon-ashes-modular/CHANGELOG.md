# Changelog

## [0.61] - 2026-05-26
### Changed
- Assets externalizados: las 33 imágenes y el audio principal ya no van embebidos como base64 dentro de js/01_recursos.js. Ahora se cargan como archivos físicos desde assets/images/ y assets/audio/.
- js/01_recursos.js reducido de 3.082 KB a 2 KB; ahora es legible y editable.
- js/03_audio_referencia.js simplificado: eliminada la lógica de Blob URL que ya no es necesaria.

## [0.60] - 2026-05-26
### Fixed
- Botón SALTAR de la intro: ya no queda pegado en la barra inferior tras terminar la secuencia de intro.
