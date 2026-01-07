/**
 * 07_PDF.gs
 * Generación y envío de PDFs (Carátula, Factura, Instrucciones)
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Crea, envía y guarda PDFs de Carátula, Factura e Instrucciones
 * @param {Sheet} hoja - Hoja Carpeta DIGITAL
 * @param {Spreadsheet} hojaDeCalculo - Spreadsheet activo
 * @param {Array} datos - Array con datos [asesor, tipoOp, codCliente, nombre, ...]
 * @return {Object} Objeto con URLs de los PDFs: {caratula, factura, instrucciones, clienteInfo}
 */
function crearEnviarYGuardarPDF(hoja, hojaDeCalculo, datos) {
  var asesor = datos[0];
  var codigoCliente = datos[2];
  var nombreApellido = datos[3];
  var chasis = datos[6];

  var emailComercial = getEmailComercial(asesor) || Session.getEffectiveUser().getEmail();
  var asunto = codigoCliente + ' - ' + nombreApellido + ' / ' + chasis;

  var options = {
    headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };

  // 1. PDF CARÁTULA
  var urlCaratula = hojaDeCalculo.getUrl().replace(/edit$/, '') +
    'export?exportFormat=pdf&format=pdf' +
    '&gid=' + hoja.getSheetId() +
    '&size=A4' +
    '&portrait=false' +
    '&fitw=true' +
    '&top_margin=0.3&right_margin=0.3&bottom_margin=0.3&left_margin=0.3' +
    '&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false&fzr=false';

  var respCaratula = UrlFetchApp.fetch(urlCaratula, options);
  if (respCaratula.getResponseCode() !== 200) {
    throw new Error('Error al generar la Carátula: ' + respCaratula.getContentText());
  }

  var pdfBlobCaratula = respCaratula.getBlob()
    .setName(codigoCliente + ' - ' + nombreApellido + ' / ' + chasis + '.pdf');

  var folder = DriveApp.getFolderById(CONFIG.DRIVE.CARPETA_CARATULAS);
  var fileCaratula = folder.createFile(pdfBlobCaratula);
  var urlArchivoCaratula = fileCaratula.getUrl();

  // 2. PDF FACTURA ESPECIAL
  var hojaFactura = getSheet(CONFIG.SHEETS.FACTURA_ESPECIAL);
  if (!hojaFactura) throw new Error('La hoja "' + CONFIG.SHEETS.FACTURA_ESPECIAL + '" no existe.');

  var marginParams = '&top_margin=0.5&right_margin=0.5&bottom_margin=0.5&left_margin=0.5';

  var urlFactura = hojaDeCalculo.getUrl().replace(/edit$/, '') +
    'export?exportFormat=pdf&format=pdf' +
    '&gid=' + hojaFactura.getSheetId() +
    '&range=A1:G46' +
    '&size=A4' +
    '&portrait=true' +
    '&fitw=true' +
    '&scale=1' +
    marginParams +
    '&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false&fzr=false';

  var respFactura = UrlFetchApp.fetch(urlFactura, options);
  if (respFactura.getResponseCode() !== 200) {
    throw new Error('Error al generar la Factura Especial: ' + respFactura.getContentText());
  }

  var pdfBlobFactura = respFactura.getBlob().setName('Factura Moto ' + codigoCliente + '.pdf');

  // Guardar Factura en Drive
  var fileFactura = folder.createFile(pdfBlobFactura);
  var urlArchivoFactura = fileFactura.getUrl();

  // 3. PDF INSTRUCCIONES FACT
  var hojaInstrucciones = getSheet(CONFIG.SHEETS.INSTRUCCIONES_FACT);
  if (!hojaInstrucciones) throw new Error('La hoja "' + CONFIG.SHEETS.INSTRUCCIONES_FACT + '" no existe.');

  var urlInstrucciones = hojaDeCalculo.getUrl().replace(/edit$/, '') +
    'export?exportFormat=pdf&format=pdf' +
    '&gid=' + hojaInstrucciones.getSheetId() +
    '&range=A1:H40' +
    '&size=A4' +
    '&portrait=true' +
    '&fitw=true' +
    marginParams +
    '&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false&fzr=false';

  var respInstruc = UrlFetchApp.fetch(urlInstrucciones, options);
  if (respInstruc.getResponseCode() !== 200) {
    throw new Error('Error al generar Instrucciones Fact: ' + respInstruc.getContentText());
  }

  var pdfBlobInstruc = respInstruc.getBlob().setName('Instrucciones Fact ' + codigoCliente + '.pdf');

  // Guardar Instrucciones en Drive
  var fileInstrucciones = folder.createFile(pdfBlobInstruc);
  var urlArchivoInstrucciones = fileInstrucciones.getUrl();

  // 4. ENVIAR EMAIL
  MailApp.sendEmail({
    to: emailComercial,
    subject: asunto,
    htmlBody:
      '<p>Recuerda crear la carpeta del cliente (código: <b>' + codigoCliente + '</b>) dentro de <i>Para Facturar</i>.</p>' +
      '<ol>' +
      '  <li>Incluye en la carpeta:<br>' +
      '    &nbsp;&nbsp;• Carátula ' + codigoCliente + '<br>' +
      '    &nbsp;&nbsp;• DNI ' + codigoCliente + '<br>' +
      '    &nbsp;&nbsp;• Factura Moto ' + codigoCliente + '<br>' +
      '    &nbsp;&nbsp;• Instrucciones Fact ' + codigoCliente + '<br>' +
      '    &nbsp;&nbsp;• Mandato ' + codigoCliente + '<br>' +
      '    &nbsp;&nbsp;• Transferencia ' + codigoCliente + '</li>' +
      '  <li style="margin-top:12px;">Texto para el cliente:<br>' +
      '      "Hola, tu vehículo ya ha sido enviado a matricular. Cuando taller nos entregue la moto puesta en marcha ' +
      '      (10-13&nbsp;días aprox.), coordinaremos contigo fecha y hora de entrega. Gracias por tu puntualidad."' +
      '  </li>' +
      '  <li style="margin-top:12px;">Link preentrega:&nbsp;' +
      '      <a href="http://bit.ly/3XjoaZ4">http://bit.ly/3XjoaZ4</a></li>' +
      '</ol>',
    attachments: [pdfBlobCaratula, pdfBlobFactura, pdfBlobInstruc]
  });

  // 5. RETORNAR URLS DE TODOS LOS PDFs
  return {
    caratula: urlArchivoCaratula,
    factura: urlArchivoFactura,
    instrucciones: urlArchivoInstrucciones,
    clienteInfo: {
      codigo: codigoCliente,
      nombre: nombreApellido,
      chasis: chasis
    }
  };
}
