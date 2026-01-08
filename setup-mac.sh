#!/bin/bash

# Script de configuración para Mac
# Configura clasp y prepara el proyecto para desarrollo

echo "🚀 Configuración de Funciones Carpeta Digital"
echo "=============================================="
echo ""

# Verificar que estamos en la carpeta correcta
if [ ! -f "SETUP_MAC.md" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta Claude_code"
    exit 1
fi

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo ""
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    echo "Descarga la versión LTS y vuelve a ejecutar este script"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js instalado: $NODE_VERSION"
echo ""

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm instalado: $NPM_VERSION"
echo ""

# Instalar clasp si no está instalado
echo "📦 Verificando clasp..."
if ! command -v clasp &> /dev/null; then
    echo "⏳ Instalando clasp..."
    npm install -g @google/clasp

    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar clasp"
        echo "Intenta manualmente: npm install -g @google/clasp"
        exit 1
    fi
else
    CLASP_VERSION=$(clasp --version)
    echo "✅ clasp instalado: $CLASP_VERSION"
fi
echo ""

# Logout y login para asegurar cuenta correcta
echo "🔐 Configurando autenticación..."
echo ""
echo "IMPORTANTE: Vamos a configurar tu cuenta de Google"
echo ""

read -p "¿Quieres cerrar sesión anterior y volver a autenticarte? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    clasp logout 2>/dev/null
    echo ""
    echo "Abriendo navegador para autenticación..."
    echo "Por favor:"
    echo "  1. Cierra todas las sesiones de Google en el navegador"
    echo "  2. Inicia sesión con la cuenta CORRECTA"
    echo "  3. Acepta los permisos"
    echo ""

    clasp login

    if [ $? -ne 0 ]; then
        echo "❌ Error al autenticar"
        exit 1
    fi

    echo ""
    echo "✅ Autenticación exitosa"
fi
echo ""

# Verificar cuenta activa
echo "📧 Verificando cuenta activa..."
clasp login --status
echo ""

# Configurar .clasp.json
echo "⚙️  Configurando Script ID..."
if [ ! -f ".clasp.json" ]; then
    if [ -f ".clasp.json.template" ]; then
        cp .clasp.json.template .clasp.json
        echo "✅ Archivo .clasp.json creado desde template"
        echo ""

        SCRIPT_ID="1qfnyzcAW8hv_NcctYXtDRAAd2l0UlKONIbD85NPutkNS_aN9oNygIfpv"

        # Reemplazar en Mac (compatible con sed de Mac)
        sed -i '' "s/TU_SCRIPT_ID_AQUI/$SCRIPT_ID/g" .clasp.json

        echo "✅ Script ID configurado: $SCRIPT_ID"
    else
        echo "❌ No se encontró .clasp.json.template"
        exit 1
    fi
else
    echo "✅ .clasp.json ya existe"
fi
echo ""

# Habilitar Apps Script API
echo "🔧 IMPORTANTE: Apps Script API"
echo ""
echo "Antes de continuar, asegúrate de que la Apps Script API esté habilitada:"
echo ""
echo "  👉 Abre: https://script.google.com/home/usersettings"
echo "  👉 Activa: 'Google Apps Script API'"
echo ""
read -p "¿Ya está activada la API? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "Por favor activa la API y vuelve a ejecutar este script"
    exit 0
fi
echo ""

# Hacer un push de prueba
echo "🚀 Probando conexión con Apps Script..."
echo ""
read -p "¿Quieres hacer un push de prueba ahora? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo ""
    echo "⏳ Subiendo archivos a Apps Script..."
    clasp push

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Push exitoso! El código está en Apps Script"
        echo ""
        echo "🌐 Abre tu proyecto: https://script.google.com/d/$SCRIPT_ID/edit"
    else
        echo ""
        echo "❌ Error al hacer push"
        echo "Verifica que:"
        echo "  1. La Apps Script API esté habilitada"
        echo "  2. Hayas iniciado sesión con la cuenta correcta"
        echo "  3. El Script ID sea correcto"
    fi
fi

echo ""
echo "=============================================="
echo "✅ Configuración completada"
echo ""
echo "Comandos útiles:"
echo "  clasp push          - Subir código a Apps Script"
echo "  clasp pull          - Descargar código de Apps Script"
echo "  clasp open          - Abrir proyecto en navegador"
echo "  clasp login --status - Ver cuenta activa"
echo ""
echo "Para subir código:"
echo "  ./push-to-appscript.sh"
echo ""
