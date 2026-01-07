/**
 * 09_Cleanup.gs
 * Funciones de limpieza de hojas
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Limpia la hoja Carpeta DIGITAL
 */
function realizarLimpieza() {
  var hoja = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);

  if (!hoja) {
    Logger.log('La hoja "' + CONFIG.SHEETS.CARPETA_DIGITAL + '" no se encontró');
    SpreadsheetApp.getUi().alert('No se encontró la hoja "' + CONFIG.SHEETS.CARPETA_DIGITAL + '".');
    return;
  }

  try {
    // Limpiar contenido de rangos (OPTIMIZADO: una sola llamada)
    hoja.getRangeList(CONFIG.RANGOS.LIMPIEZA_DIGITAL).clearContent();

    // Restablecer fondos
    hoja.getRange('K8:N9').setBackground('white');
    hoja.getRange('G4').setBackground('#F0F0F0');

    Logger.log('Limpieza completada con éxito.');
  } catch (error) {
    Logger.log('Error en realizarLimpieza: ' + error.message);
    SpreadsheetApp.getUi().alert('Ocurrió un error al intentar limpiar los rangos: ' + error.message);
  }
}

/**
 * Limpia la hoja Recibo Oficial
 */
function limpiarrecibo() {
  try {
    var hoja = getSheet(CONFIG.SHEETS.RECIBO_OFICIAL);
    if (hoja) {
      // OPTIMIZADO: una sola llamada
      hoja.getRangeList(CONFIG.RANGOS.LIMPIEZA_RECIBO).clearContent();
    }
  } catch (e) {
    Logger.log('Error en la limpieza: ' + e.message);
    SpreadsheetApp.getUi().alert('No se pudo limpiar la hoja. Inténtalo de nuevo.');
  }
}
