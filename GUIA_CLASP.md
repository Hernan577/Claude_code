# 🚀 Guía Completa: Sincronizar con Apps Script usando clasp

Esta guía te enseña cómo **actualizar tu código en Apps Script automáticamente** desde tu computadora, sin copiar y pegar manualmente.

---

## 📋 Requisitos Previos

- Tener instalado **Node.js** (viene con npm)
- Tener acceso a tu proyecto de Apps Script
- Una terminal/consola (CMD, PowerShell, Terminal, Git Bash, etc.)

---

## 🔧 Instalación (Solo una vez)

### **Paso 1: Instalar Node.js**

Si no tienes Node.js instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (Long Term Support)
3. Instala normalmente (siguiente, siguiente, finalizar)
4. Verifica la instalación abriendo una terminal y ejecutando:
   ```bash
   node --version
   npm --version
   ```
   Deberías ver los números de versión (ej: `v20.11.0` y `10.2.4`)

### **Paso 2: Instalar clasp**

En tu terminal, ejecuta:

```bash
npm install -g @google/clasp
```

Espera a que termine (puede tardar 1-2 minutos).

Verifica la instalación:
```bash
clasp --version
```

Deberías ver algo como: `2.4.2` (el número puede variar)

### **Paso 3: Iniciar sesión con Google**

Ejecuta:
```bash
clasp login
```

**¿Qué pasa?**
- Se abre tu navegador automáticamente
- Te pide iniciar sesión con Google
- Acepta los permisos que pide
- Verás un mensaje "Successful log in"
- Cierra el navegador

✅ **¡Ya estás autenticado!** Solo necesitas hacer esto una vez.

---

## ⚙️ Configuración del Proyecto (Solo una vez)

### **Paso 4: Obtener el Script ID**

1. Abre tu proyecto "Funciones Carpeta Digital" en Apps Script
2. Haz clic en el **ícono de engranaje** ⚙️ (Configuración del proyecto)
3. Copia el **"ID del proyecto de secuencia de comandos"**
   - Es una cadena larga como: `1ABC...XYZ` (36 caracteres aprox)

### **Paso 5: Configurar el archivo .clasp.json**

1. **Copia el template**: Renombra `.clasp.json.template` a `.clasp.json`
   ```bash
   # En Mac/Linux
   cp .clasp.json.template .clasp.json

   # En Windows (CMD)
   copy .clasp.json.template .clasp.json
   ```

2. Abre el archivo `.clasp.json` con tu editor de texto
3. Reemplaza `TU_SCRIPT_ID_AQUI` con el ID que copiaste en el Paso 4:

```json
{
  "scriptId": "1ABC_TU_ID_REAL_AQUI_XYZ",
  "rootDir": "./",
  ...
}
```

4. **Guarda el archivo**

**Nota:** `.clasp.json` está en `.gitignore` para que no compartas accidentalmente tu Script ID.

---

## 🚀 Uso Diario: Subir Código a Apps Script

Cada vez que quieras actualizar tu código en Apps Script:

### **Opción A: Usar el script automatizado** (Recomendado)

**En Windows:**
```bash
push-to-appscript.bat
```
Haz doble clic en el archivo o ejecútalo desde CMD/PowerShell.

**En Mac/Linux:**
```bash
./push-to-appscript.sh
```

El script te muestra qué archivos subirá y te pide confirmación.

### **Opción B: Comando manual**

Si prefieres hacerlo manualmente:

```bash
clasp push
```

Eso es todo. Los archivos se suben automáticamente.

---

## 📥 Descargar Código desde Apps Script

Si hiciste cambios directamente en Apps Script y quieres traerlos a tu computadora:

```bash
clasp pull
```

**⚠️ Cuidado:** Esto sobrescribirá tus archivos locales con lo que está en Apps Script.

---

## 🔍 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `clasp push` | Sube todos los archivos a Apps Script |
| `clasp pull` | Descarga todos los archivos de Apps Script |
| `clasp open` | Abre tu proyecto en el navegador |
| `clasp logs` | Muestra los logs de ejecución |
| `clasp status` | Muestra el estado de sincronización |
| `clasp logout` | Cierra sesión |
| `clasp login` | Inicia sesión con Google |

---

## 🛠️ Solución de Problemas

### **Error: "clasp: command not found"**

**Solución:**
```bash
npm install -g @google/clasp
```

Si aún no funciona, cierra y vuelve a abrir la terminal.

### **Error: "User has not enabled the Apps Script API"**

**Solución:**
1. Ve a https://script.google.com/home/usersettings
2. Activa **"Google Apps Script API"**
3. Vuelve a intentar `clasp push`

### **Error: "Could not read API credentials"**

**Solución:**
```bash
clasp login
```

### **Error: "Permission denied" en Mac/Linux**

**Solución:**
```bash
chmod +x push-to-appscript.sh
```

### **No se suben los archivos correctos**

Verifica que `.claspignore` esté configurado correctamente. Solo debe subir:
- `src/*.gs`
- `html/*.html`
- `appsscript.json`

---

## 📂 Estructura de Archivos

Después de configurar clasp, tu proyecto se verá así:

```
Claude_code/
├── .clasp.json          ← Configuración de clasp (con tu Script ID)
├── .claspignore         ← Archivos a ignorar
├── push-to-appscript.sh ← Script para subir (Mac/Linux)
├── push-to-appscript.bat← Script para subir (Windows)
├── appsscript.json      ← Configuración de Apps Script
├── src/                 ← Archivos .gs
│   ├── 01_Config.gs
│   ├── 02_Utils.gs
│   ├── ... (10 archivos)
│   └── 10_Menu.gs
└── html/                ← Archivos HTML
    ├── DialogoDescargarPDFs.html
    ├── DialogoSeguros.html
    ├── ... (6 archivos)
    └── PromoVerano2024.html
```

---

## 🎯 Flujo de Trabajo Recomendado

### **1. Hacer cambios localmente**

Edita los archivos en tu editor favorito (VS Code, Sublime, etc.):
- Archivos `.gs` en `src/`
- Archivos `.html` en `html/`

### **2. Subir a Apps Script**

```bash
clasp push
```

O usa el script:
```bash
./push-to-appscript.sh    # Mac/Linux
push-to-appscript.bat      # Windows
```

### **3. Verificar en el navegador**

```bash
clasp open
```

Esto abre tu proyecto en Apps Script para verificar que todo se subió correctamente.

### **4. Probar la funcionalidad**

Abre tu hoja de Google Sheets y prueba las funciones.

---

## 🔄 Integración con Git

Puedes combinar clasp con Git para tener control de versiones:

### **Workflow típico:**

```bash
# 1. Hacer cambios en el código
# 2. Guardar en Git
git add .
git commit -m "Descripción de los cambios"
git push origin main

# 3. Subir a Apps Script
clasp push

# 4. Verificar
clasp open
```

---

## 📝 Notas Importantes

1. **`.clasp.json` tiene tu Script ID**: NO lo compartas públicamente (añádelo a `.gitignore`)

2. **Archivos ignorados**: Los archivos `.md` (documentación) NO se suben a Apps Script, solo se quedan localmente

3. **Orden de archivos**: El orden en `filePushOrder` importa - los archivos se cargan en ese orden

4. **Sincronización bidireccional**:
   - `clasp push`: Local → Apps Script
   - `clasp pull`: Apps Script → Local

5. **Conflictos**: Si alguien más editó en Apps Script mientras tú editabas localmente, haz `clasp pull` primero para obtener los cambios

---

## ✅ Ventajas de usar clasp

| Antes (Manual) | Ahora (clasp) |
|----------------|---------------|
| ❌ Copiar/pegar cada archivo | ✅ Un solo comando |
| ❌ Seleccionar todo el código | ✅ Sincronización automática |
| ❌ 16 archivos a copiar uno por uno | ✅ Todos a la vez |
| ❌ 15-20 minutos | ✅ 5 segundos |
| ❌ Propenso a errores | ✅ Confiable |
| ❌ Tedioso | ✅ Rápido y fácil |

---

## 🆘 Soporte

Si tienes problemas:

1. **Verifica tu versión de clasp**: `clasp --version`
2. **Verifica tu login**: `clasp login --status`
3. **Verifica el Script ID**: Abre `.clasp.json` y confirma que el ID es correcto
4. **Consulta logs**: `clasp logs` para ver errores de ejecución

---

## 🎓 Recursos Adicionales

- Documentación oficial de clasp: https://github.com/google/clasp
- Apps Script API: https://script.google.com/home/usersettings
- Guía de Google: https://developers.google.com/apps-script/guides/clasp

---

**¡Listo! Ahora puedes actualizar tu código con un solo comando.** 🎉
