# Funciones Carpeta Digital - Google Apps Script
### Sistema de Gestión de Ventas Honda Maquina Valencia
**Versión 2.0 - Optimizado 2026-01-07**

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
└── PromoVerano2024.html
```

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
