/**
 * 02_Utils.gs
 * Utilidades comunes y funciones helpers
 * v2.0 - Optimizado 2026-01-07
 */

// ====================================================================
// FORMATEO Y PARSEO
// ====================================================================

/**
 * Formatea fecha y hora en formato DD/MM/YY HH:MM
 */
function formatearFechaHora(fecha) {
  var dia = ('0' + fecha.getDate()).slice(-2);
  var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  var ano = fecha.getFullYear().toString().slice(-2);
  var horas = ('0' + fecha.getHours()).slice(-2);
  var minutos = ('0' + fecha.getMinutes()).slice(-2);
  return dia + '/' + mes + '/' + ano + ' ' + horas + ':' + minutos;
}

/**
 * Parsea valor monetario eliminando símbolos y convirtiendo a número
 */
function parseCurrency(value) {
  if (!value) return 0;
  var numericValue = value.toString().replace(/[€\s]/g, '').replace(',', '.');
  return parseFloat(numericValue) || 0;
}

/**
 * Normaliza texto para comparaciones
 */
function _norm(v) {
  return String(v || '').trim().toUpperCase();
}

// ====================================================================
// VALIDACIONES
// ====================================================================

/**
 * Valida formato de chasis (17 caracteres alfanuméricos)
 */
function validarChasis(chasis) {
  if (!chasis) return false;
  var regex = /^[A-Z0-9]{17}$/;
  return regex.test(chasis.toString().replace(/\s+/g, ''));
}

/**
 * Valida número de presupuesto (6 dígitos) o "CESION"
 */
function validarPresupuesto(valor) {
  var numeroDePresupuesto = /^\d{6}$/;
  var esCesion = /^CESION$/i;
  return numeroDePresupuesto.test(valor) || esCesion.test(valor);
}

// ====================================================================
// EMAILS
// ====================================================================

/**
 * Obtiene el email del comercial según su nombre
 */
function getEmailComercial(asesor) {
  var config = CONFIG.EMAILS[asesor];
  return config ? config.to : null;
}

/**
 * Obtiene email con CC del comercial
 */
function getEmailsComercial(asesor) {
  return CONFIG.EMAILS[asesor] || {
    to: Session.getEffectiveUser().getEmail(),
    cc: ''
  };
}

// ====================================================================
// LECTURA DE DATOS OPTIMIZADA
// ====================================================================

/**
 * Lee múltiples celdas de una vez (optimizado con batch)
 * @param {Sheet} hoja - Hoja de donde leer
 * @param {Array} celdas - Array de notaciones A1 ['B1', 'D1', etc]
 * @return {Object} Objeto con valores {B1: valor, D1: valor, ...}
 */
function leerCeldasBatch(hoja, celdas) {
  var rangeList = hoja.getRangeList(celdas);
  var ranges = rangeList.getRanges();
  var resultado = {};

  for (var i = 0; i < celdas.length; i++) {
    resultado[celdas[i]] = ranges[i].getValue();
  }

  return resultado;
}

/**
 * Lee datos de cliente de forma optimizada
 */
function leerDatosCliente(hoja) {
  var datos = leerCeldasBatch(hoja, [
    CONFIG.CELDAS.ASESOR,
    CONFIG.CELDAS.TIPO_OPERACION,
    CONFIG.CELDAS.NUM_CLIENTE,
    CONFIG.CELDAS.NOM_CLIENTE,
    CONFIG.CELDAS.CHASIS,
    CONFIG.CELDAS.MODELO
  ]);

  return {
    asesor: datos[CONFIG.CELDAS.ASESOR],
    tipoOperacion: datos[CONFIG.CELDAS.TIPO_OPERACION],
    numCliente: datos[CONFIG.CELDAS.NUM_CLIENTE],
    nomCliente: datos[CONFIG.CELDAS.NOM_CLIENTE],
    chasis: datos[CONFIG.CELDAS.CHASIS],
    modelo: datos[CONFIG.CELDAS.MODELO]
  };
}

// ====================================================================
// HOJAS DE CÁLCULO - HELPERS
// ====================================================================

/**
 * Crea mapa de encabezados (fila 1) para búsqueda por título
 */
function _headerMap(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    map[_norm(headers[i])] = i + 1; // 1-based
  }
  return map;
}

/**
 * Obtiene número de columna por título del encabezado
 */
function _colByTitle(sheet, title) {
  var col = _headerMap(sheet)[_norm(title)];
  if (!col) throw new Error('No se encontró la columna con título: ' + title);
  return col;
}

/**
 * Busca coincidencia en hoja MODELOS por modelo y cambio potencia
 */
function buscarCoincidenciaEnModelos(hojaModelos, valorReferencia) {
  var colModelo = _colByTitle(hojaModelos, 'MODELO');
  var colCambio = _colByTitle(hojaModelos, 'CAMBIO POTENCIA');

  var lastRow = hojaModelos.getLastRow();
  if (lastRow < 2) return false;

  // Leer solo las dos columnas implicadas (optimizado)
  var modelos = hojaModelos.getRange(2, colModelo, lastRow - 1, 1).getValues();
  var cambios = hojaModelos.getRange(2, colCambio, lastRow - 1, 1).getValues();

  var ref = _norm(valorReferencia);
  for (var i = 0; i < modelos.length; i++) {
    if (_norm(modelos[i][0]) === ref && _norm(cambios[i][0]) === 'X') {
      return true;
    }
  }
  return false;
}

// ====================================================================
// FORMATO Y COLORES
// ====================================================================

/**
 * Aplica colores alternos a una hoja
 */
function aplicarColoresAlternos(sheet, filaInicio, numFilas, numColumnas) {
  // Remover bandas existentes
  sheet.getBandings().forEach(function(b) { b.remove(); });

  // Aplicar bandas
  if (numFilas > 0) {
    sheet.getRange(filaInicio, 1, numFilas, numColumnas)
         .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }
}

/**
 * Aplica bordes a un rango
 */
function aplicarBordes(range, color) {
  color = color || '#FFFFFF';
  range.setBorder(true, true, true, true, true, true, color, SpreadsheetApp.BorderStyle.SOLID);
}

// ====================================================================
// NOTIFICACIONES
// ====================================================================

/**
 * Notifica al comercial cuando una moto está lista
 */
function notificarComercialMotoLista(fila, hoja) {
  var nombreComercial = hoja.getRange(fila, 2).getValue();  // B
  var nombreCliente = hoja.getRange(fila, 5).getValue();    // E
  var modeloMoto = hoja.getRange(fila, 7).getValue();       // G

  var email = getEmailComercial(nombreComercial);
  if (!email) {
    Logger.log('Email no encontrado para comercial: ' + nombreComercial);
    return;
  }

  var asunto = 'Moto lista para entregar: ' + nombreCliente + ' - ' + modeloMoto;
  var cuerpo = 'Hola ' + nombreComercial + ',\n\n' +
    'Ya puedes notificar al cliente ' + nombreCliente + ' que su moto ' + modeloMoto + ' está lista.\n\n' +
    'Un saludo,\nHonda Maquina Valencia';

  MailApp.sendEmail(email, asunto, cuerpo);
}

// ====================================================================
// PERMISOS
// ====================================================================

/**
 * Solicita todos los permisos necesarios de OAuth
 */
function solicitarPermisos() {
  SpreadsheetApp.getActiveSpreadsheet();   // Hojas
  DriveApp.getRootFolder();                // Drive
  MailApp.getRemainingDailyQuota();        // Gmail
  DocumentApp.create('TMP_TEST');          // Docs
  UrlFetchApp.fetch('https://www.google.com/robots.txt'); // UrlFetch
}
