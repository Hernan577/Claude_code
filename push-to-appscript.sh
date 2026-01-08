#!/bin/bash

# Script para subir código a Google Apps Script usando clasp
# Uso: ./push-to-appscript.sh

echo "📤 Subiendo código a Google Apps Script..."
echo ""

# Verificar que clasp esté instalado
if ! command -v clasp &> /dev/null
then
    echo "❌ Error: clasp no está instalado"
    echo "Instálalo con: npm install -g @google/clasp"
    exit 1
fi

# Verificar que .clasp.json existe
if [ ! -f ".clasp.json" ]; then
    echo "❌ Error: No se encontró el archivo .clasp.json"
    echo "Por favor configura tu Script ID primero"
    exit 1
fi

# Verificar que el Script ID no sea el placeholder
SCRIPT_ID=$(grep "scriptId" .clasp.json | cut -d'"' -f4)
if [ "$SCRIPT_ID" = "TU_SCRIPT_ID_AQUI" ]; then
    echo "❌ Error: Debes reemplazar TU_SCRIPT_ID_AQUI en .clasp.json"
    echo ""
    echo "Pasos:"
    echo "1. Abre tu proyecto en Apps Script"
    echo "2. Ve a Configuración del proyecto (⚙️)"
    echo "3. Copia el 'ID del proyecto de secuencia de comandos'"
    echo "4. Edita .clasp.json y reemplaza TU_SCRIPT_ID_AQUI con ese ID"
    exit 1
fi

echo "Script ID: $SCRIPT_ID"
echo ""

# Mostrar archivos que se subirán
echo "📁 Archivos que se subirán:"
echo "  - appsscript.json"
echo "  - 10 archivos .gs (src/*.gs)"
echo "  - 6 archivos HTML (html/*.html)"
echo ""

# Confirmar
read -p "¿Continuar? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]
then
    echo "❌ Cancelado"
    exit 1
fi

# Subir archivos
echo ""
echo "⏳ Subiendo archivos..."
clasp push

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Código subido exitosamente a Apps Script!"
    echo ""
    echo "🌐 Abre tu proyecto: https://script.google.com/d/$SCRIPT_ID/edit"
else
    echo ""
    echo "❌ Error al subir archivos"
    echo "Verifica que hayas hecho 'clasp login' antes"
fi
