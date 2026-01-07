/**
 * 01_Config.gs
 * Configuración central y constantes del proyecto
 * v2.0 - Optimizado 2026-01-07
 */

// ====================================================================
// CONSTANTES DE HOJAS
// ====================================================================
var CONFIG = {
  SHEETS: {
    CARPETA_DIGITAL: 'Carpeta DIGITAL',
    SEGUIMIENTO: 'SEGUIMIENTO',
    RECIBO_OFICIAL: 'Recibo Oficial',
    PEM: 'Hoja PeM',
    FACTURA_ESPECIAL: 'Factura Especial',
    INSTRUCCIONES_FACT: 'Instrucciones Fact',
    MODELOS: 'MODELOS',
    BONIFICACIONES: 'Bonificaciones',
    PEDIDO_ACCESORIOS: 'Pedido Accesorios',
    ACC_SHEET_NAME: 'Pedidos Accesorios 2025'
  },

  // ====================================================================
  // CARPETA DIGITAL - CELDAS
  // ====================================================================
  CELDAS: {
    ASESOR: 'B1',
    MODELO: 'B4',
    CHASIS: 'B5',
    NUM_CLIENTE: 'B12',
    NOM_CLIENTE: 'B14',
    TIPO_OPERACION: 'D1',
    SEGURO: 'B26',
    TIPO_SEGURO: 'D26',
    MATRICULA: 'B22',
    MAPIT: 'D27',
    SALDO: 'D30',
    FACTURA_ESPECIAL: 'D25',
    IVTM: 'D22',
    MANO_OBRA: 'O30',

    // Financiación
    FIN_ENTIDAD: 'G5',
    FIN_IMPORTE: 'G6',
    FIN_CUOTAS: 'G7',
    FIN_IMPORTE_CUOTA: 'G8',
    FIN_CUOTA_FINAL: 'G9',
    FIN_NUM_OPERACION: 'G10',

    // Accesorios y montaje
    TIPO_MONTAJE: 'K10',
    UBICACION: 'K12',
    MONTADOR: 'M10:N10',
    DECIS_CLIENTE: 'M12:N12',
    CAMPO_INICIAL: 'K3:N3',
    CAMBIO_POTENCIA: 'K7:N7',
    PLAN_REINICIA: 'K6:N6',

    // Promociones
    PROMO_K4: 'K4',
    PROMO_K5: 'K5',
    PROMO_CONCEPTO: 'K5:N5'
  },

  // ====================================================================
  // RANGOS
  // ====================================================================
  RANGOS: {
    ACC_TABLE: 'I16:O29',
    ACC_REFS: 'J16:J29',
    ACC_DESCRIP: 'K16:K29',
    LIMPIEZA_DIGITAL: [
      'B1', 'D1', 'B5', 'B4', 'B6', 'D6', 'B8', 'B9', 'B10', 'D9',
      'D10', 'B12', 'B13', 'B14', 'B15', 'B16', 'D17',
      'B17', 'B18', 'B22', 'B26', 'B27', 'B28', 'D25', 'D21', 'D22', 'D26', 'D27',
      'G1', 'G3:G10', 'G13:G14', 'G16:G17', 'G20:G22',
      'K4','K3:N3', 'K5', 'K6', 'K7', 'K8:N9','K10','K12', 'M10:N10','M12:N12','J16:J29', 'M16:M29'
    ],
    LIMPIEZA_RECIBO: [
      'D4', 'D6', 'D8:F8', 'D12', 'D10:F10', 'E12:F12',
      'B16:F21', 'D14', 'F14', 'B16'
    ]
  },

  // ====================================================================
  // IDS DE DRIVE
  // ====================================================================
  DRIVE: {
    CARPETA_CARATULAS: '1kKgqDhKIVSaIDOuKvzvf32LP3c49YnnV',
    CARPETA_PEM: '1W-6qBsVpkBzF4Wq6zbedh7e-af_purmd',
    ACC_SPREADSHEET_ID: '1yaK7xez9nrw_BcQ9O18jEcZFG853UjZdRtulIIVzUpo',
    PEM_HONDA_ID: '1yxDnpttwsB7TVNSLGOQ70cJWmqCFxpd1b22J7DFY7u4'
  },

  // ====================================================================
  // EMAILS
  // ====================================================================
  EMAILS: {
    'Adrián': { to: 'recambioshonda1@maquinamotors.es', cc: 'ventashonda@maquinamotors.es' },
    'Antonia': { to: 'recambioshonda1@maquinamotors.es', cc: 'administracion@maquinamotors.es' },
    'Mikel': { to: 'recambioshonda1@maquinamotors.es', cc: 'ventashonda1@maquinamotors.es' },
    'Hernán': { to: 'recambioshonda1@maquinamotors.es', cc: 'gestionhonda@maquinamotors.es' },
    'Carmen': { to: 'recambioshonda1@maquinamotors.es', cc: 'infohonda@maquinamotors.es' },
    'Jorge': { to: 'recambioshonda1@maquinamotors.es', cc: 'ventashonda2@maquinamotors.es' }
  },

  // ====================================================================
  // OPCIONES
  // ====================================================================
  OPCIONES: {
    SEGUROS: ['TERCEROS', 'AMPLIADO', 'T. RIESGO'],
    MATRICULA_VALIDOS: ['AGENTE', 'CLIENTE', 'CESION', 'COMPRA']
  }
};

/**
 * Cache de hojas para evitar llamadas repetidas
 */
var SHEET_CACHE = {};

/**
 * Obtiene una hoja con caché
 */
function getSheet(sheetName) {
  if (!SHEET_CACHE[sheetName]) {
    SHEET_CACHE[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  }
  return SHEET_CACHE[sheetName];
}

/**
 * Limpia el caché de hojas
 */
function clearSheetCache() {
  SHEET_CACHE = {};
}
