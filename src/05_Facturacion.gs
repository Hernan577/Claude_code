/**
 * 05_Facturacion.gs
 * Sistema de facturación optimizado
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Función principal de facturación
 * Valida, exporta, envía emails y limpia
 */
function facturar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
  var hojaSeguimiento = getSheet(CONFIG.SHEETS.SEGUIMIENTO);

  try {
    if (!hoja) throw new Error('Falta "' + CONFIG.SHEETS.CARPETA_DIGITAL + '".');
    if (!hojaSeguimiento) throw new Error('Falta "' + CONFIG.SHEETS.SEGUIMIENTO + '".');

    // Validar datos
    var errores = [];
    validarDatos(hoja, errores);
    if (errores.length) {
      SpreadsheetApp.getUi().alert(errores.join('\n'));
      return;
    }

    // Leer datos necesarios de una vez (OPTIMIZADO)
    var datos = leerDatosFacturacion(hoja);

    // Crear y enviar PDF de carátula
    var urlCaratula = crearEnviarYGuardarPDF(hoja, ss, datos.valoresBasicos);
    if (!urlCaratula) throw new Error('No se pudo crear la carátula.');

    // Agregar fila a SEGUIMIENTO
    agregarFilaSeguimiento(hojaSeguimiento, datos, urlCaratula);

    // Enviar accesorios si no es CESION
    var urlPdfPeM = null;
    if (datos.tipoOperacion !== 'CESION') {
      urlPdfPeM = enviarAccesorios();
    }

    // Exportar a PeM Honda
    exportarPeMHonda(hoja, urlPdfPeM);

    // Exportar accesorios si hay
    exportarAccesoriosSiHay(hoja);

  } catch (e) {
    Logger.log(e);
    SpreadsheetApp.getUi().alert('Error en facturar:\n' + e.message);
  } finally {
    realizarLimpieza();
  }
}

/**
 * Lee todos los datos necesarios para facturación (OPTIMIZADO)
 */
function leerDatosFacturacion(hoja) {
  // Leer celdas individuales
  var celdas = ['B1', 'D1', 'B12', 'B14', 'B17', 'B4', 'B5', 'G1', 'D27',
                'O30', 'K4', 'K5', 'K6', 'K7'];

  var datos = leerCeldasBatch(hoja, celdas);
  var fechaHora = formatearFechaHora(new Date());

  return {
    valoresBasicos: [
      datos['B1'], datos['D1'], datos['B12'], datos['B14'],
      datos['B17'], datos['B4'], datos['B5'], datos['G1'], datos['D27']
    ],
    asesor: datos['B1'],
    tipoOperacion: String(datos['D1']).trim().toUpperCase(),
    numCliente: datos['B12'],
    nomCliente: datos['B14'],
    chasis: datos['B5'],
    modelo: datos['B4'],
    fechaHora: fechaHora,
    o30: datos['O30'],
    k4: datos['K4'],
    k5: datos['K5'],
    k6: datos['K6'],
    k7: datos['K7']
  };
}

/**
 * Agrega fila a SEGUIMIENTO con formato
 */
function agregarFilaSeguimiento(hojaSeguimiento, datos, urlCaratula) {
  var fila = obtenerDatosParaSeguimiento(datos);

  hojaSeguimiento.insertRowBefore(3);
  hojaSeguimiento.getRange('A3:AA3').setValues([fila]);
  hojaSeguimiento.getRange('H3').setRichTextValue(
    SpreadsheetApp.newRichTextValue()
      .setText(fila[7])
      .setLinkUrl(urlCaratula)
      .build()
  );

  alinearTextoSeguimiento(hojaSeguimiento);
  aplicarColoresAlternos(hojaSeguimiento, 3, hojaSeguimiento.getLastRow() - 2,
                         hojaSeguimiento.getLastColumn());
}

/**
 * Obtiene datos formateados para SEGUIMIENTO
 */
function obtenerDatosParaSeguimiento(datos) {
  var d = new Array(27).fill('');
  d[0] = datos.fechaHora;
  d[1] = datos.valoresBasicos[0]; // B1
  d[2] = datos.valoresBasicos[1]; // D1
  d[3] = datos.valoresBasicos[2]; // B12
  d[4] = datos.valoresBasicos[3]; // B14
  d[5] = datos.valoresBasicos[4]; // B17
  d[6] = datos.valoresBasicos[5]; // B4
  d[7] = datos.valoresBasicos[6]; // B5
  d[9] = datos.valoresBasicos[7]; // G1
  d[18] = datos.valoresBasicos[8]; // D27
  d[21] = datos.o30;
  d[23] = datos.k4;
  d[24] = datos.k5;
  d[25] = datos.k6;
  d[26] = datos.k7;
  return d;
}

/**
 * Alinea texto en SEGUIMIENTO
 */
function alinearTextoSeguimiento(hojaSeg) {
  hojaSeg.getRangeList(['B3','C3','D3','F3','J3','R3','W3'])
    .setHorizontalAlignment('center');
  hojaSeg.getRangeList(['A3','E3','G3','X3','Y3','Z3','AA3'])
    .setHorizontalAlignment('left');
  hojaSeg.getRange('H3').setHorizontalAlignment('right');
}

/**
 * Exporta datos a PeM Honda (siempre "POR PREPARAR" en col C)
 */
function exportarPeMHonda(hojaOrigen, urlPdfPeM) {
  var ID = CONFIG.DRIVE.PEM_HONDA_ID;
  var TAB = 'PeM Honda';
  var DEST = 3;
  var COLS = 23;

  try {
    DriveApp.getFileById(ID).addEditor('ventashonda2@maquinamotors.es');
  } catch (e) {
    Logger.log('addEditor: ' + e.message);
  }

  // Leer datos necesarios (OPTIMIZADO)
  var celdas = ['K10', 'K12', 'B4', 'B5', 'B1', 'B12', 'B14'];
  var rangos = ['M10:N10', 'M12:N12', 'K7:N7'];

  var datos = leerCeldasBatch(hojaOrigen, celdas);

  var montador = hojaOrigen.getRange('M10:N10').getDisplayValues()[0]
    .filter(String).join(' ').trim();
  var decisCliente = hojaOrigen.getRange('M12:N12').getDisplayValues()[0]
    .filter(String).join(' ').trim();
  var cambioPotencia = hojaOrigen.getRange('K7:N7').getValues()[0][0];

  var fila = Array(COLS).fill('');
  fila[1] = montador;
  fila[2] = 'POR PREPARAR'; // Valor fijo
  fila[3] = datos['K12'];   // ubicacion
  fila[4] = datos['K10'];   // tipoMontaje
  fila[5] = cambioPotencia;
  fila[6] = decisCliente;
  fila[11] = datos['B4'];   // modelo
  fila[12] = datos['B5'];   // bastidor
  fila[17] = datos['B1'];   // asesor
  fila[18] = datos['B12'];  // codCliente
  fila[19] = datos['B14'];  // nombreCliente

  var libro = SpreadsheetApp.openById(ID);
  var sheet = libro.getSheetByName(TAB);

  sheet.insertRowBefore(DEST);
  sheet.getRange(DEST + 1, 1, 1, COLS).copyFormatToRange(sheet, 1, COLS, DEST, DEST);
  sheet.getRange(DEST, 1, 1, COLS).setValues([fila]);

  aplicarColoresAlternos(sheet, 3, 902, 23);
  aplicarBordes(sheet.getRange(DEST, 1, 1, COLS));

  if (urlPdfPeM) {
    sheet.getRange(DEST, 13).setRichTextValue(
      SpreadsheetApp.newRichTextValue()
        .setText(fila[12])
        .setLinkUrl(urlPdfPeM)
        .build()
    );
  }
}

/**
 * Exporta accesorios si hay datos en la tabla
 */
function exportarAccesoriosSiHay(hoja) {
  var valores = hoja.getRange(CONFIG.RANGOS.ACC_TABLE).getValues();
  var hayDatos = valores.some(function(row) {
    return row.some(function(c) {
      return String(c).trim() !== '';
    });
  });

  if (hayDatos) {
    exportarAccesoriosANuevaHoja();
  }
}
