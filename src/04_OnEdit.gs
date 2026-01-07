/**
 * 04_OnEdit.gs
 * Trigger automático al editar celdas
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Función trigger principal que se ejecuta al editar cualquier celda
 */
function onEdit(e) {
  var hoja = e.range.getSheet();
  var nombreHoja = hoja.getName();
  var rango = e.range;
  var valor = e.value;
  var fila = rango.getRow();
  var columna = rango.getColumn();

  // Enrutar según la hoja editada
  if (nombreHoja === CONFIG.SHEETS.CARPETA_DIGITAL) {
    onEditCarpetaDigital(hoja, rango, valor, fila, columna);
  } else if (nombreHoja === CONFIG.SHEETS.SEGUIMIENTO) {
    onEditSeguimiento(hoja, rango, valor, fila, columna);
  } else if (nombreHoja === CONFIG.SHEETS.RECIBO_OFICIAL) {
    onEditReciboOficial(hoja, rango, valor, fila, columna);
  }
}

/**
 * Ediciones en Carpeta DIGITAL
 */
function onEditCarpetaDigital(hoja, rango, valor, fila, columna) {
  // D1: Si es 6 dígitos => diálogo Plan Reinicia
  if (rango.getA1Notation() === 'D1' && valor && valor.toString().length === 6) {
    mostrarDialogoPlanReinicia();
  }

  // K7: Si tiene valor => poner "CERT HONDA" en J16
  if (fila === 7 && columna === 11) {
    if (valor) hoja.getRange('J16').setValue('CERT HONDA');
    else hoja.getRange('J16').clearContent();
  }

  // Cambiar formato y fondo
  aplicarFormatoYCambiarFondo(rango, hoja);

  // B26: Mostrar diálogo de seguros
  if (fila === 26 && columna === 2 && valor) {
    mostrarDialogo();
  }
  // B22: Matrícula con 0 o 150 => diálogo promoción
  else if (fila === 22 && columna === 2) {
    var numericValue = parseCurrency(valor);
    if (numericValue === 0 || numericValue === 150) {
      mostrarDialogoPromocion();
    }
  }
  // B4: Modelo => PromoVerano2024
  else if (fila === 4 && columna === 2 && valor) {
    PromoVerano2024(valor);
  }

  // B5 o C5: Verificar cambio de potencia
  if (fila === 5 && (columna === 2 || columna === 3)) {
    verificarCambioPotencia(hoja, rango);
  }

  // D21 o G4: Asegurar valores negativos
  if ((rango.getA1Notation() === 'D21' || rango.getA1Notation() === 'G4') && valor) {
    asegurarValorNegativo(rango, valor);
  }
}

/**
 * Ediciones en SEGUIMIENTO
 */
function onEditSeguimiento(hoja, rango, valor, fila, columna) {
  // Columna R con "LISTA" => notificar comercial
  if (columna === 18 && valor && valor.toString().toUpperCase() === 'LISTA') {
    notificarComercialMotoLista(fila, hoja);
  }
}

/**
 * Ediciones en Recibo Oficial
 */
function onEditReciboOficial(hoja, rango, valor, fila, columna) {
  // D16: Archivar recibo (obsoleto - solo alerta)
  if (rango.getA1Notation() === 'D16' && valor) {
    var ui = SpreadsheetApp.getUi();
    ui.alert('Archivar Recibo', 'Esta función está en desarrollo.', ui.ButtonSet.OK);
  }
  // D12: Verificar opciones
  else if (rango.getA1Notation() === 'D12') {
    verificarOpciones();
  }
}

/**
 * Aplica formato y cambia fondo según la celda editada
 */
function aplicarFormatoYCambiarFondo(rango, hoja) {
  var fila = rango.getRow();
  var columna = rango.getColumn();

  // G4: amarillo si hay valor, gris claro si vacío
  if (fila === 4 && columna === 7) {
    var valorG4 = rango.getValue();
    rango.setBackground(valorG4 ? 'yellow' : '#F0F0F0');
  }

  // K8:N9: amarillo si hay valor, blanco si vacío
  if (fila >= 8 && fila <= 9 && columna >= 11 && columna <= 14) {
    var v = rango.getValue();
    rango.setBackground(v ? 'yellow' : 'white');
  }
}

/**
 * Verifica si aplica cambio de potencia
 */
function verificarCambioPotencia(hoja, rango) {
  var chasisValue = rango.getValue();
  var isValidChasis = validarChasis(chasisValue);

  if (isValidChasis) {
    var valorReferencia = hoja.getRange('B4').getValue();
    var hojaModelos = getSheet(CONFIG.SHEETS.MODELOS);
    var coincidencia = buscarCoincidenciaEnModelos(hojaModelos, valorReferencia);

    if (coincidencia) {
      mostrarDialogoCambioDePotencia();
    }
  }
}

/**
 * Asegura que un valor sea negativo
 */
function asegurarValorNegativo(rango, valor) {
  var valorNumerico = parseFloat(valor.toString().replace(',', '.'));
  if (!isNaN(valorNumerico)) {
    if (valorNumerico > 0) {
      rango.setValue(-Math.abs(valorNumerico));
    } else if (valorNumerico < 0) {
      rango.setValue(valorNumerico);
    }
  }
  rango.setNumberFormat("#,##0.00;[Red]-#,##0.00");
}

/**
 * Verifica opciones en Recibo Oficial y muestra mensaje
 */
function verificarOpciones() {
  var hoja = getSheet(CONFIG.SHEETS.RECIBO_OFICIAL);
  if (!hoja) {
    Logger.log("No se encontró la pestaña 'Recibo Oficial'");
    return;
  }

  var valorD12 = hoja.getRange("D12").getValue();
  var celdaObjetivo = hoja.getRange("B16");

  var mensaje = "";
  var aplicarFormato = false;
  var formatoPalabra = "";

  switch (valorD12) {
    case "Reserva":
      mensaje = "* Recuerda que la fecha de entrega de la moto es a partir de los 7 días posteriores a la matriculacion.";
      aplicarFormato = true;
      formatoPalabra = "matriculado";
      break;
    case "IVTM":
      mensaje = "* Por favor, recuerda que el pago del IVTM se debe realizar antes de la entrega del vehículo.";
      break;
    case "Entrada":
      mensaje = "* Recuerda que para el pedido de los accesorios la moto debe ser abonada en su totalidad.";
      break;
    case "Seguro":
      mensaje = "* Asegurate que el seguro se haya activado correctamente antes retirar tu vehiculo.";
      break;
    default:
      mensaje = "";
      break;
  }

  celdaObjetivo.setValue(mensaje);

  // Aplicar formato a palabra específica
  if (aplicarFormato && mensaje.includes(formatoPalabra)) {
    var posInicio = mensaje.indexOf(formatoPalabra);
    var posFin = posInicio + formatoPalabra.length;

    var richText = SpreadsheetApp.newRichTextValue()
      .setText(mensaje)
      .setTextStyle(posInicio, posFin,
        SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
      .build();

    celdaObjetivo.setRichTextValue(richText);
  }
}
