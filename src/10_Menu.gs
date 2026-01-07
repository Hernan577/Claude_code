/**
 * 10_Menu.gs
 * Menú personalizado y autorización de permisos
 * v2.0 - Optimizado 2026-01-07
 */

/**
 * Crea el menú personalizado al abrir el documento
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  var menuCarpeta = ui.createMenu('✅ Carpeta DIGITAL')
    .addItem('✔️ Comprobar/Facturar', 'validarHoja')
    .addItem('📄 Limpiar Carpeta', 'realizarLimpieza');

  var menuMatriculas = ui.createMenu('🪪 Matriculas')
    .addItem('Importar matrículas', 'importarMatriculasDesdeGmail');

  ui.createMenu('Operaciones')
    .addSubMenu(menuCarpeta)
    .addSubMenu(menuMatriculas)
    .addSeparator()
    .addItem('🔐 Autorizar permisos', 'autorizarPermisos')
    .addToUi();
}

/**
 * Autoriza y verifica todos los permisos necesarios
 */
function autorizarPermisos() {
  var ui = SpreadsheetApp.getUi();
  var r = [];

  // Sheets
  try {
    SpreadsheetApp.getActiveSpreadsheet().getId();
    r.push('Sheets ✓');
  } catch (e) {
    r.push('Sheets ✗ ' + e.message);
  }

  // Drive
  try {
    var f = DriveApp.createFile('TMP_AUTH.txt', 'ok');
    DriveApp.getFileById(f.getId()).setTrashed(true);
    r.push('Drive ✓');
  } catch (e) {
    r.push('Drive ✗ ' + e.message);
  }

  // Docs
  try {
    var d = DocumentApp.create('TMP_AUTH_DOC');
    DriveApp.getFileById(d.getId()).setTrashed(true);
    r.push('Docs ✓');
  } catch (e) {
    r.push('Docs ✗ ' + e.message);
  }

  // UrlFetch
  try {
    UrlFetchApp.fetch('https://www.google.com/robots.txt');
    r.push('UrlFetch ✓');
  } catch (e) {
    r.push('UrlFetch ✗ ' + e.message);
  }

  // Envío de correo
  try {
    MailApp.getRemainingDailyQuota();
    r.push('send_mail ✓');
  } catch (e) {
    r.push('send_mail ✗ ' + e.message);
  }

  // userinfo.email
  try {
    r.push('userinfo.email ✓ ' + (Session.getEffectiveUser().getEmail() || ''));
  } catch (e) {
    r.push('userinfo.email ✗ ' + e.message);
  }

  // Gmail (opcional)
  try {
    GmailApp.getInboxUnreadCount();
    var lbl = GmailApp.getUserLabelByName('TMP_AUTH_TMP') || GmailApp.createLabel('TMP_AUTH_TMP');
    lbl.deleteLabel();
    r.push('Gmail ✓');
  } catch (e) {
    r.push('Gmail omitido: ' + e.message);
  }

  ui.alert('Resultado autorización:\n' + r.join('\n'));
}

/**
 * PLACEHOLDER: Importar matrículas desde Gmail
 * Esta función aún no está implementada
 */
function importarMatriculasDesdeGmail() {
  SpreadsheetApp.getUi().alert('Esta función está en desarrollo.');
}
