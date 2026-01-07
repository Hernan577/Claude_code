/**
 * 06_Accesorios.gs
 * Gestión de accesorios y pedidos
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Envía la hoja PeM como PDF por correo
 * @return {string} URL del archivo PDF guardado en Drive
 */
function enviarAccesorios() {
  var SELF_MAIL = Session.getEffectiveUser().getEmail();

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hojaPem = getSheet(CONFIG.SHEETS.PEM);
    var hojaDigital = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);

    if (!hojaPem) throw new Error('No se encontró la pestaña "' + CONFIG.SHEETS.PEM + '".');
    if (!hojaDigital) throw new Error('No se encontró la pestaña "' + CONFIG.SHEETS.CARPETA_DIGITAL + '".');

    // Leer datos necesarios (OPTIMIZADO)
    var datos = leerCeldasBatch(hojaDigital, [
      CONFIG.CELDAS.ASESOR,
      CONFIG.CELDAS.MODELO,
      CONFIG.CELDAS.NUM_CLIENTE,
      CONFIG.CELDAS.NOM_CLIENTE,
      CONFIG.CELDAS.CHASIS
    ]);

    var asesor = String(datos[CONFIG.CELDAS.ASESOR]).trim() || 'SIN ASESOR';
    var modelo = String(datos[CONFIG.CELDAS.MODELO]).trim();
    var numCliente = String(datos[CONFIG.CELDAS.NUM_CLIENTE]).trim();
    var nomCliente = String(datos[CONFIG.CELDAS.NOM_CLIENTE]).trim();
    var chasis = String(datos[CONFIG.CELDAS.CHASIS]).trim();

    // Obtener emails
    var dir = getEmailsComercial(asesor);
    var to = dir.to || SELF_MAIL;

    // Construir CC sin duplicados
    var ccSet = {};
    if (dir.cc) {
      var dirCcArr = dir.cc.split(',');
      for (var c = 0; c < dirCcArr.length; c++) {
        ccSet[dirCcArr[c].trim()] = true;
      }
    }
    if (SELF_MAIL !== to) ccSet[SELF_MAIL] = true;

    var ccArr = [];
    for (var key in ccSet) {
      if (ccSet.hasOwnProperty(key)) ccArr.push(key);
    }
    var cc = ccArr.join(',');

    // Generar PDF
    var pdfUrl = ss.getUrl().replace(/edit$/, '') +
      'export?exportFormat=pdf&format=pdf' +
      '&gid=' + hojaPem.getSheetId() +
      '&size=A4&portrait=true&fitw=true' +
      '&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false&fzr=false';

    var resp = UrlFetchApp.fetch(pdfUrl, {
      muteHttpExceptions: true,
      headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() }
    });

    if (resp.getResponseCode() !== 200) {
      throw new Error('Error ' + resp.getResponseCode() + ' al crear el PDF.');
    }

    var nombreBase = 'PeM - ' + modelo + ' - ' + nomCliente + ' / ' + chasis;
    var blob = resp.getBlob().setName(nombreBase + '.pdf');

    // Guardar en Drive
    var archivoPDF = DriveApp.getFolderById(CONFIG.DRIVE.CARPETA_PEM).createFile(blob);

    // Enviar email
    MailApp.sendEmail({
      to: to,
      cc: cc,
      subject: nombreBase,
      body:
        'Adjunto la Hoja de Puesta en Marcha.\n\n' +
        'Modelo:  ' + modelo + '\n' +
        'Cliente: ' + numCliente + ' – ' + nomCliente + '\n' +
        'Chasis:  ' + chasis + '\n' +
        'Asesor:  ' + asesor,
      attachments: [archivoPDF.getBlob()]
    });

    return archivoPDF.getUrl();

  } catch (e) {
    Logger.log(e);
    SpreadsheetApp.getUi().alert('Error al enviar Hoja PeM:\n' + e.message);
    return null;
  }
}

/**
 * Exporta accesorios al libro externo de pedidos
 */
function exportarAccesoriosANuevaHoja() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
    if (!hoja) throw new Error('No se encontró la hoja "' + CONFIG.SHEETS.CARPETA_DIGITAL + '".');

    // Leer datos del cliente
    var datosCliente = hoja.getRange('L14').getValue();
    var codigoCliente = hoja.getRange('K14').getValue();
    var nombreComercial = hoja.getRange('J30').getValue();

    // Leer accesorios
    var referencias = hoja.getRange(CONFIG.RANGOS.ACC_REFS).getValues();
    var descripciones = hoja.getRange(CONFIG.RANGOS.ACC_DESCRIP).getValues();

    var libroDestino = SpreadsheetApp.openById(CONFIG.DRIVE.ACC_SPREADSHEET_ID);
    var hojaDestino = libroDestino.getSheetByName(CONFIG.SHEETS.ACC_SHEET_NAME);
    if (!hojaDestino) throw new Error('No existe la pestaña "' + CONFIG.SHEETS.ACC_SHEET_NAME + '".');

    var fechaPedido = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');

    // Construir filas
    var filas = [];
    for (var i = 0; i < referencias.length; i++) {
      var referencia = String(referencias[i][0]).trim();
      var descripcion = String(descripciones[i][0]).trim();
      if (!referencia && !descripcion) continue;

      filas.push([
        '', fechaPedido, datosCliente, codigoCliente, '', referencia, descripcion,
        '', '0. POR PEDIR', '', nombreComercial, ''
      ]);
    }

    if (filas.length === 0) {
      SpreadsheetApp.getUi().alert(
        'Accesorios detectados en I‑O, pero columnas J‑K están vacías.\n' +
        'Rellena referencia o descripción para exportar.'
      );
      return;
    }

    // Insertar filas
    var start = 2;
    hojaDestino.insertRows(start, filas.length);
    hojaDestino.getRange(start, 1, filas.length, 12).setValues(filas);

    aplicarFormatoAccesorios(hojaDestino);

  } catch (e) {
    Logger.log(e);
    SpreadsheetApp.getUi().alert('Error al exportar accesorios:\n' + e.message);
  }
}

/**
 * Aplica formato a la hoja de accesorios (bordes y alternancia)
 */
function aplicarFormatoAccesorios(hojaDestino) {
  var inicioFila = 2;
  var finFila = 2002;
  var numFilas = finFila - inicioFila + 1;
  var numColumnas = 12;

  // Asegurar filas suficientes
  var filasActuales = hojaDestino.getMaxRows();
  if (filasActuales < finFila) {
    hojaDestino.insertRowsAfter(filasActuales, finFila - filasActuales);
  }

  var rango = hojaDestino.getRange(inicioFila, 1, numFilas, numColumnas);

  // Bordes blancos
  aplicarBordes(rango, '#ffffff');

  // Fondos alternos
  var backgrounds = [];
  for (var i = 0; i < numFilas; i++) {
    var color = (i % 2 === 0) ? '#ffffff' : '#f2f2f2';
    var filaBg = [];
    for (var j = 0; j < numColumnas; j++) filaBg.push(color);
    backgrounds.push(filaBg);
  }
  rango.setBackgrounds(backgrounds);
}

/**
 * Envía pedido de accesorios por email
 */
function pedirAccesorios() {
  var ui = SpreadsheetApp.getUi();
  try {
    var FILE_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
    var SHEET_NAME = CONFIG.SHEETS.PEDIDO_ACCESORIOS;

    // Generar PDF
    var pdfBlob = exportSheetAsPdf(FILE_ID, SHEET_NAME, 'Pedido_Accesorios.pdf');

    // Obtener asesor
    var hojaCD = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
    if (!hojaCD) throw new Error('No se encontró la hoja "' + CONFIG.SHEETS.CARPETA_DIGITAL + '".');

    var asesor = String(hojaCD.getRange('B1').getValue()).trim();
    var emailComercial = getEmailComercial(asesor);

    // Destinatarios
    var to = ['recambioshonda@maquinamotors.es', 'recambioshonda1@maquinamotors.es', emailComercial]
      .filter(Boolean)
      .map(function(e) { return e.split(','); }).flat()
      .map(function(e) { return e.trim(); })
      .filter(function(v, i, a) { return v && a.indexOf(v) === i; })
      .join(',');

    // Enviar correo
    MailApp.sendEmail({
      to: to,
      subject: 'Pedido de Accesorios - ' + Utilities.formatDate(new Date(), 'Europe/Madrid', 'dd/MM/yyyy HH:mm'),
      body: 'Adjunto la hoja Pedido Accesorios (formato A4 vertical) para el pedido de accesorios.\n\nSaludos.',
      attachments: [pdfBlob]
    });

    ui.alert('Hoja Pedido Accesorios enviada correctamente a:\n' + to);
  } catch (e) {
    ui.alert('Error al enviar la hoja Pedido Accesorios:\n' + e.message);
    Logger.log(e);
  }
}

/**
 * Exporta hoja como PDF
 */
function exportSheetAsPdf(fileId, sheetName, fileName) {
  var token = ScriptApp.getOAuthToken();
  var ss = SpreadsheetApp.openById(fileId);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('No se encontró la hoja "' + sheetName + '".');

  var gid = sheet.getSheetId();
  var url = 'https://docs.google.com/spreadsheets/d/' + fileId +
    '/export?format=pdf' +
    '&portrait=true' +
    '&size=A4' +
    '&scale=4' +
    '&sheetnames=false' +
    '&printtitle=false' +
    '&pagenumbers=false' +
    '&gridlines=false' +
    '&fzr=false' +
    '&gid=' + gid;

  var response = UrlFetchApp.fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('Error al exportar PDF: código ' + response.getResponseCode());
  }

  return response.getBlob().setName(fileName);
}
