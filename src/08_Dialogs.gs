/**
 * 08_Dialogs.gs
 * Gestión de diálogos HTML
 * v2.0 - Optimizado 2026-01-07
 */

// ====================================================================
// FUNCIONES DE DIÁLOGOS
// ====================================================================

/**
 * Muestra diálogo de promoción
 */
function mostrarDialogoPromocion() {
  var titulo = '¿Corresponde a una promoción de Honda?';
  var textoAdicional =
    '<div style="background-color: yellow; padding: 5px;">' +
    '<strong style="color: red;">' +
    'El cliente debe contratar Honda Plus para obtener matrícula gratis' +
    '</strong></div>';
  mostrarDialogoGenerico('DialogoPromocion', 400, 130, titulo, textoAdicional);
}

/**
 * Muestra diálogo de seguros
 */
function mostrarDialogo() {
  mostrarDialogoGenerico('DialogoSeguros', 410, 100, '¿Qué seguro deseas contratar?');
}

/**
 * Muestra diálogo de Plan Reinicia
 */
function mostrarDialogoPlanReinicia() {
  var titulo = '¿Cliente adhiere al Plan Reinicia Auto+?';
  mostrarDialogoGenerico('DialogoPlanReinicia', 300, 150, titulo, '');
}

/**
 * Muestra diálogo genérico desde archivo HTML
 */
function mostrarDialogoGenerico(nombreArchivo, ancho, alto, titulo, textoAdicional) {
  var html = HtmlService.createHtmlOutputFromFile(nombreArchivo)
    .setWidth(ancho)
    .setHeight(alto);
  if (textoAdicional) html.append(textoAdicional);
  SpreadsheetApp.getUi().showModalDialog(html, titulo);
}

/**
 * Muestra diálogo de cambio de potencia
 */
function mostrarDialogoCambioDePotencia() {
  var hojaBonificaciones = getSheet(CONFIG.SHEETS.BONIFICACIONES);
  var opciones = hojaBonificaciones.getRange('F2:F').getValues()
    .flat()
    .filter(String);

  var template = HtmlService.createTemplateFromFile('DialogoCambioPotencia');
  template.opciones = opciones;

  var htmlOutput = template.evaluate().setWidth(400).setHeight(170);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Seleccione la opción de cambio de potencia');
}

/**
 * Muestra diálogo PromoVerano2024
 */
function PromoVerano2024(modelo) {
  var hojaModelos = getSheet(CONFIG.SHEETS.MODELOS);
  var rangoModelos = hojaModelos.getRange('B3:B102').getValues();
  var mostrarDlg = false;

  for (var i = 0; i < rangoModelos.length; i++) {
    if (rangoModelos[i][0] == modelo && hojaModelos.getRange('A' + (i + 3)).getValue() == 'X') {
      mostrarDlg = true;
      break;
    }
  }

  if (mostrarDlg) {
    var opciones = getOpcionesBonificaciones();
    var template = HtmlService.createTemplateFromFile('PromoVerano2024');
    template.opciones = opciones;
    var htmlOutput = template.evaluate().setWidth(400).setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Selecciona la promoción si corresponde');
  }
}

/**
 * Obtiene opciones de bonificaciones
 */
function getOpcionesBonificaciones() {
  var hoja = getSheet(CONFIG.SHEETS.BONIFICACIONES);
  return hoja.getRange('B2:B20').getValues().flat().filter(String);
}

// ====================================================================
// CALLBACKS DE DIÁLOGOS (llamados desde HTML)
// ====================================================================

/**
 * Procesa opción de cambio de potencia
 */
function procesarOpcionCambioPotencia(seleccion) {
  var sh = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
  sh.getRange('K7:N7').setValues([[seleccion, seleccion, seleccion, seleccion]]);
  if (seleccion) sh.getRange('J16').setValue('CERT HONDA');
  else sh.getRange('J16').clearContent();
}

/**
 * Compatibilidad: guardarSeleccion
 */
function guardarSeleccion(seleccion) {
  procesarOpcionCambioPotencia(seleccion);
}

/**
 * Limpia selección de cambio de potencia
 */
function limpiarSeleccion() {
  var sh = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
  sh.getRange('K7:N7').clearContent();
  sh.getRange('J16').clearContent();
}

/**
 * Establece valor en celda (seguros)
 */
function setValorCelda(valor) {
  setValorEnHoja(CONFIG.SHEETS.CARPETA_DIGITAL, 'D26', valor);
}

/**
 * Establece valor de promoción K4
 */
function setValorCeldaPromo(valor) {
  setValorEnHoja(CONFIG.SHEETS.CARPETA_DIGITAL, 'K4', valor);
}

/**
 * Establece valor de promoción K5
 */
function setValorCeldaModeloPromo(valor) {
  setValorEnHoja(CONFIG.SHEETS.CARPETA_DIGITAL, 'K5', valor);
}

/**
 * Establece valor en hoja y celda específica
 */
function setValorEnHoja(nombreHoja, celda, valor) {
  var hoja = getSheet(nombreHoja);
  hoja.getRange(celda).setValue(valor);
}

/**
 * Respuesta a Plan Reinicia
 */
function respuestaReiniciaPlan(adhesion) {
  var hoja = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
  if (adhesion === true) {
    hoja.getRange('K6').setValue('Descuento Plan REINICIA AUTO +');
  }
}
