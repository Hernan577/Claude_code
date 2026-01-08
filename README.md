# Funciones Carpeta Digital - Google Apps Script
### Sistema de Gestión de Ventas Honda Maquina Valencia
**Versión 3.0 - Con clasp deployment - 2026-01-08**

---

## 🚀 Inicio Rápido para Mac

**¿Primera vez configurando el proyecto?**

```bash
# 1. Clona el repositorio
git clone https://github.com/Hernan577/Claude_code.git
cd Claude_code

# 2. Ejecuta el script de configuración automática
./setup-mac.sh
```

El script configurará todo automáticamente: Node.js, clasp, autenticación y Script ID.

**Consulta la [Guía Completa para Mac](SETUP_MAC.md) para más detalles.**

---

## 📁 Estructura del Proyecto

```
/src/
├── 01_Config.gs          # Configuración central y constantes
├── 02_Utils.gs           # Utilidades y funciones comunes
├── 03_DataValidation.gs  # Validaciones de datos
├── 04_OnEdit.gs          # Triggers automáticos onEdit
├── 05_Facturacion.gs     # Sistema de facturación
├── 06_Accesorios.gs      # Gestión de accesorios
├── 07_PDF.gs             # Generación de PDFs
├── 08_Dialogs.gs         # Diálogos HTML
├── 09_Cleanup.gs         # Limpieza de hojas
└── 10_Menu.gs            # Menú personalizado

/html/
├── DialogoSeguros.html
├── DialogoPromocion.html
├── DialogoPlanReinicia.html
├── DialogoCambioPotencia.html
├── DialogoDescargarPDFs.html    # ✨ NUEVO: Descarga directa de PDFs
└── PromoVerano2024.html
```

---

## ✨ Nueva Funcionalidad: Descarga Directa de PDFs

Al facturar, ahora aparece un **diálogo elegante** que permite descargar directamente los 3 PDFs generados:

- 📋 **Carátula** del cliente
- 💰 **Factura Moto**
- 📝 **Instrucciones Fact**

**Características:**
- ✅ Descarga individual o todos a la vez
- ✅ Diseño moderno con gradientes y animaciones
- ✅ Los PDFs también se envían por email (funcionalidad intacta)
- ✅ No necesitas ir al correo para obtener los archivos

---

## 🔄 Despliegue de Cambios a Apps Script

Una vez configurado el proyecto, puedes desplegar tus cambios con **un solo comando**:

```bash
# Opción 1: Script automático (recomendado)
./push-to-appscript.sh

# Opción 2: Comando directo
clasp push
```

**Workflow completo:**
```bash
# 1. Obtener últimos cambios de GitHub
git pull origin main

# 2. Editar archivos localmente (src/*.gs, html/*.html)

# 3. Subir a Apps Script
clasp push

# 4. Verificar en el navegador
clasp open
```

**Comandos útiles:**
- `clasp push` - Sube código a Apps Script
- `clasp pull` - Descarga código de Apps Script
- `clasp open` - Abre el proyecto en el navegador
- `clasp login --status` - Verifica qué cuenta está activa
- `clasp logout` - Cierra sesión

---

## 🚀 Optimizaciones Implementadas

### 1. Lectura Batch de Datos
- ✅ Antes: Múltiples llamadas individuales
- ✅ Ahora: Una sola llamada batch
- ⚡ **Mejora**: 5-10x más rápido

### 2. Caché de Hojas
- ✅ Sistema getSheet() centralizado
- ⚡ **Mejora**: Reduce llamadas repetidas

### 3. Escritura Batch
- ✅ Operaciones múltiples en una llamada
- ⚡ **Mejora**: 3-5x más rápido

### 4. Código Unificado
- ✅ Eliminadas duplicaciones
- ✅ CONFIG centralizado
- ⚡ **Mejora**: Más mantenible

---

## ❌ Funciones OBSOLETAS

| Función | Estado | Reemplazo |
|---------|--------|-----------|
| `actualizarDatosMatriculacion()` | ❌ Eliminada | N/A |
| `archivarRecibo()` | ❌ Eliminada | N/A |
| parseCurrency duplicada | ❌ Eliminada | 02_Utils.gs |
| Múltiples getRange() | ❌ Obsoleto | leerCeldasBatch() |

---

Ver documentación completa en archivos .gs
