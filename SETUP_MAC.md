# 🚀 Configuración Rápida - Tu Mac

## 📥 Paso 1: Clonar el Repositorio en tu Mac

Abre **Terminal** en tu Mac y ejecuta:

```bash
# Navega a donde quieras guardar el proyecto
cd ~/Documents  # o ~/Desktop si prefieres

# Clona el repositorio
git clone https://github.com/Hernan577/Claude_code.git

# Entra a la carpeta
cd Claude_code
```

Ahora tienes todos los archivos en: `~/Documents/Claude_code/`

---

## 🔧 Paso 2: Instalar Node.js y clasp

### **2.1 Instalar Node.js**

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (Long Term Support)
3. Instala normalmente
4. Verifica en Terminal:
   ```bash
   node --version
   npm --version
   ```

### **2.2 Instalar clasp**

```bash
npm install -g @google/clasp
```

Verifica:
```bash
clasp --version
```

---

## 🔐 Paso 3: Login con la cuenta correcta

**IMPORTANTE**: Para asegurarte de usar la cuenta correcta:

### **3.1 Cerrar sesión anterior (si existe)**

```bash
clasp logout
```

### **3.2 Iniciar sesión con tu cuenta**

```bash
clasp login
```

**Se abrirá Chrome/Safari:**
1. **Cierra todas las sesiones de Google** en el navegador primero
2. **Inicia sesión con la cuenta correcta** (la que tiene acceso a "Funciones Carpeta Digital")
3. Acepta los permisos
4. Verás "Successful log in"

### **3.3 Verificar qué cuenta está activa**

```bash
clasp login --status
```

Esto te muestra el email de la cuenta activa. **Verifica que sea la correcta.**

---

## ⚙️ Paso 4: Configurar tu Script ID

Tu Script ID es: `1qfnyzcAW8hv_NcctYXtDRAAd2l0UlKONIbD85NPutkNS_aN9oNygIfpv`

```bash
# Copiar el template
cp .clasp.json.template .clasp.json

# Editar el archivo (puedes usar cualquier editor)
nano .clasp.json
# o
open -a TextEdit .clasp.json
```

Reemplaza `TU_SCRIPT_ID_AQUI` con:
```
1qfnyzcAW8hv_NcctYXtDRAAd2l0UlKONIbD85NPutkNS_aN9oNygIfpv
```

**Guarda el archivo** (en nano: Ctrl+O, Enter, Ctrl+X)

---

## 🚀 Paso 5: Subir el Código a Apps Script

```bash
# Opción A: Usar el script automático
./push-to-appscript.sh

# Opción B: Comando directo
clasp push
```

**Listo!** El código se sube automáticamente a tu Apps Script.

---

## 🔄 Flujo de Trabajo Diario

De ahora en adelante, cuando hagas cambios:

### **En tu Mac:**

1. **Haz pull** de los últimos cambios de GitHub:
   ```bash
   cd ~/Documents/Claude_code
   git pull origin main
   ```

2. **Edita archivos** localmente con tu editor favorito

3. **Sube a Apps Script**:
   ```bash
   ./push-to-appscript.sh
   ```

4. **Opcional - Guarda en Git** (si quieres versionar tus cambios):
   ```bash
   git add src/ html/
   git commit -m "Descripción de cambios"
   git push origin main
   ```

---

## 📍 Ubicación de los Archivos

Después de clonar, tus archivos estarán en:

```
~/Documents/Claude_code/
├── src/                 ← Archivos .gs
├── html/                ← Archivos HTML
├── .clasp.json          ← Tu configuración (NO compartir)
└── push-to-appscript.sh ← Script para subir
```

**Puedes editar estos archivos con**:
- Visual Studio Code
- Sublime Text
- TextEdit
- Cualquier editor de texto

---

## ✅ Ventajas de este Flujo

✅ **GitHub = Repositorio central** (código siempre guardado)
✅ **Tu Mac = Editor local** (edita con tu IDE favorito)
✅ **Apps Script = Producción** (un comando y está actualizado)
✅ **No copiar/pegar** nunca más
✅ **Control de versiones** con Git

---

## ❓ Preguntas Frecuentes

### **¿Tengo que tener los archivos en mi Mac?**

**Sí**, necesitas una copia local para:
- Editar con tu editor favorito (VS Code, etc.)
- Usar `clasp push` para subir a Apps Script
- Git necesita los archivos localmente

**Pero** los archivos son muy ligeros (~100KB total), no ocupan casi nada.

### **¿Puedo editar directamente desde GitHub y que se suba a Apps Script?**

Sí, pero requiere configurar **GitHub Actions** (más complejo). Te lo puedo configurar si quieres, pero para empezar es más fácil trabajar localmente.

### **¿Qué pasa si edito en Apps Script directamente?**

Puedes hacer `clasp pull` para traer los cambios a tu Mac:
```bash
clasp pull
```

### **¿Y si borro la carpeta de mi Mac?**

No pasa nada, simplemente vuelves a clonar de GitHub:
```bash
git clone https://github.com/Hernan577/Claude_code.git
```

---

## 🎯 Resumen - 3 Comandos Clave

```bash
# 1. Traer cambios de GitHub
git pull origin main

# 2. Subir a Apps Script
clasp push

# 3. Ver tu proyecto en el navegador
clasp open
```

¡Eso es todo! 🎉
