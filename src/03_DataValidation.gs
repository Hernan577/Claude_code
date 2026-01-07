/**
 * 03_DataValidation.gs
 * Validaciones de datos antes de facturar
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Función principal de validación de hoja
 * Muestra diálogo de facturación si todo está correcto
 */
function validarHoja() {
  var hoja = getSheet(CONFIG.SHEETS.CARPETA_DIGITAL);
  var errores = [];

  validarDatos(hoja, errores);

  if (errores.length > 0) {
    SpreadsheetApp.getUi().alert(errores.join('\n'));
  } else {
    mostrarDialogoFacturar();
  }
}

/**
 * Valida todos los datos necesarios para facturar
 * @param {Sheet} hoja - Hoja "Carpeta DIGITAL"
 * @param {Array} errores - Array donde se acumulan mensajes de error
 */
function validarDatos(hoja, errores) {
  // Leer todos los valores necesarios de una vez (OPTIMIZADO)
  var valores = leerValoresParaValidacion(hoja);

  // Validaciones básicas obligatorias
  validarCamposBasicos(valores, errores);

  // Validar saldo = 0
  validarSaldo(valores.saldo, errores);

  // Validar factura especial
  if (!valores.facturaEspecial) {
    errores.push('* Introduce el valor de la Factura Especial.');
  }

  // Validar IVTM
  if (!valores.ivtm) {
    errores.push('* Introduce el importe del trimestre de IVTM.');
  }

  // Validar matrícula
  validarMatricula(valores.matricula, errores);

  // Validar presupuesto o CESION
  if (!validarPresupuesto(valores.tipoOperacion)) {
    errores.push('* Introduce un número de presupuesto válido (6 dígitos) o "CESION".');
  }

  // Validar MAPIT
  if (valores.mapit !== 'SI' && valores.mapit !== 'NO') {
    errores.push('* Indica si la moto lleva Mapit (debe ser "SI" o "NO").');
  }

  // Validar seguro y promoción
  validarSeguroYPromocion(valores, errores);

  // Validar bastidor
  if (!validarChasis(valores.chasis)) {
    errores.push('* El bastidor debe tener 17 caracteres alfanuméricos sin espacios.');
  }

  // Validar mano de obra
  if (valores.manoObra === 'ACTU.') {
    errores.push('* Alguno de los accesorios no tiene tiempo de mano de obra.');
  }

  // Validar financiación si existe
  validarFinanciacion(valores, errores);

  // Validar Plan Reinicia si aplica
  validarPlanReinicia(valores, errores);
}

/**
 * Lee todos los valores necesarios para validación en una sola operación
 * OPTIMIZACIÓN: Una sola llamada en lugar de múltiples getRange()
 */
function leerValoresParaValidacion(hoja) {
  var celdas = [
    'K10', 'K12', 'D30', 'D25', 'D22', 'B22', 'D1', 'D27', 'B26', 'D26',
    'B5', 'O30', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'B4'
  ];

  var datos = leerCeldasBatch(hoja, celdas);

  // Leer rangos
  var k3n3 = hoja.getRange('K3:N3').getValues().flat()
    .map(function(v) { return v != null ? String(v).trim() : ''; })
    .filter(function(s) { return s !== ''; });

  var montador = hoja.getRange('M10:N10').getValues().flat()
    .filter(function(v) { return v !== ''; });

  var decision = hoja.getRange('M12:N12').getValues().flat()
    .filter(function(v) { return v !== ''; });

  var promoK5N5 = hoja.getRange('K5:N5').getValues().flat()
    .map(function(v) { return v != null ? String(v).trim() : ''; })
    .filter(function(s) { return s !== ''; });

  var contieneReinicia = hoja.getRange('K6:N6').getValues().flat()
    .includes('Descuento Plan REINICIA AUTO +');

  var modeloStr = hoja.getRange('B4:D4').getValues().flat().join(' ').toString().toUpperCase();

  // Datos Plan Reinicia
  var g20 = null, g21 = null, g22 = null;
  if (contieneReinicia) {
    var datosReinicia = leerCeldasBatch(hoja, ['G20', 'G21', 'G22']);
    g20 = datosReinicia['G20'];
    g21 = datosReinicia['G21'];
    g22 = datosReinicia['G22'];
  }

  return {
    tipoMontaje: datos['K10'],
    ubicacion: datos['K12'],
    campoInicial: k3n3,
    montador: montador,
    decision: decision,
    saldo: datos['D30'],
    facturaEspecial: datos['D25'],
    ivtm: datos['D22'],
    matricula: datos['B22'],
    tipoOperacion: datos['D1'],
    mapit: datos['D27'],
    seguroB26: datos['B26'],
    seguroD26: datos['D26'],
    chasis: datos['B5'],
    manoObra: datos['O30'],
    finEntidad: datos['G5'],
    finImporte: datos['G6'],
    finCuotas: datos['G7'],
    finImporteCuota: datos['G8'],
    finCuotaFinal: datos['G9'],
    finNumOp: datos['G10'],
    modelo: datos['B4'],
    modeloStr: modeloStr,
    promoK5N5: promoK5N5,
    contieneReinicia: contieneReinicia,
    reiniciaG20: g20,
    reiniciaG21: g21,
    reiniciaG22: g22
  };
}

/**
 * Valida campos básicos obligatorios
 */
function validarCamposBasicos(valores, errores) {
  if (!valores.tipoMontaje) {
    errores.push('* Indica el TIPO MONTAJE (K10).');
  }

  if (!valores.ubicacion) {
    errores.push('* Indica la UBICACIÓN (K12).');
  }

  if (valores.campoInicial.length === 0) {
    errores.push('* Indica un valor en K3:N3 (puede ser "-").');
  }

  if (valores.montador.length === 0) {
    errores.push('* Indica el MONTADOR (M10:N10).');
  }

  if (valores.decision.length === 0) {
    errores.push('* Indica la DECISIÓN DEL CLIENTE (M12:N12).');
  }
}

/**
 * Valida que el saldo sea exactamente 0
 */
function validarSaldo(valorD30, errores) {
  var saldoString = valorD30.toString().trim().replace(',', '.').replace(/[^\d.-]/g, '');
  var saldo = parseFloat(saldoString);

  if (isNaN(saldo) || Math.abs(saldo) > 0.01) {
    errores.push('* El saldo de la operación debe ser exactamente 0,00 € para continuar.');
  }
}

/**
 * Valida matrícula
 */
function validarMatricula(valorB22, errores) {
  var valorStr = valorB22.toString().trim().toUpperCase();
  var importeNumerico = parseFloat(valorStr.replace(',', '.'));

  var esNumeroValido = !isNaN(importeNumerico);
  var esValorTexto = CONFIG.OPCIONES.MATRICULA_VALIDOS.indexOf(valorStr) !== -1;

  if (!(esNumeroValido || esValorTexto)) {
    errores.push('* Falta introducir el precio, AGENTE, CLIENTE, CESION o COMPRA en la celda de matrícula (B22).');
  }
}

/**
 * Valida seguro y promoción relacionada
 */
function validarSeguroYPromocion(valores, errores) {
  var rawB26 = valores.seguroB26;
  var hayValorB26 = !(rawB26 === '' || rawB26 === null);
  var esWW125 = valores.modeloStr.indexOf('WW125') !== -1;

  if (hayValorB26 && !valores.seguroD26) {
    errores.push('* Introduce el tipo de seguro (D26).');
  }

  if (hayValorB26 && esWW125 && valores.promoK5N5.length === 0) {
    errores.push('* Para modelos PCX 125 con importe en SEGURO (B26), indica la promoción en CONCEPTO 2.');
  }
}

/**
 * Valida datos de financiación
 */
function validarFinanciacion(valores, errores) {
  if (!valores.finEntidad) return; // No hay financiación

  var erroresFin = [];

  if (!valores.finImporte) erroresFin.push('* Importe a financiar (G6).');
  if (!valores.finCuotas) erroresFin.push('* Nº de cuotas (G7).');
  if (!valores.finImporteCuota) erroresFin.push('* Importe de las cuotas (G8).');
  if (!valores.finNumOp) erroresFin.push('* Nº de operación (G10).');

  if (valores.finCuotas === '36+1' && !valores.finCuotaFinal) {
    erroresFin.push('* Cuota final (G9) obligatoria con "36+1" cuotas.');
  }

  if (erroresFin.length) {
    errores.push('FALTAN DATOS EN LA SECCIÓN: FINANCIACIÓN\n' + erroresFin.join('\n'));
  }
}

/**
 * Valida Plan Reinicia Auto+
 */
function validarPlanReinicia(valores, errores) {
  if (!valores.contieneReinicia) return;

  var errReinicia = [];
  if (!valores.reiniciaG20) errReinicia.push('* Transfer. DANA 1');
  if (!valores.reiniciaG21) errReinicia.push('* Transfer. DANA 2');
  if (!valores.reiniciaG22) errReinicia.push('* PVP Medio Sep-24');

  if (errReinicia.length) {
    errores.push('FALTAN DATOS EN LA SECCIÓN: PLAN REINICIA AUTO +\n' + errReinicia.join('\n'));
  }
}

/**
 * Muestra diálogo de confirmación para facturar
 */
function mostrarDialogoFacturar() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('¡Felicidades, todos los datos están completos!',
               '¿Desea facturar?',
               ui.ButtonSet.YES_NO) === ui.Button.YES) {
    facturar();
  }
}
