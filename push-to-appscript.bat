@echo off
REM Script para subir código a Google Apps Script usando clasp
REM Uso: push-to-appscript.bat

echo.
echo Subiendo codigo a Google Apps Script...
echo.

REM Verificar que clasp este instalado
where clasp >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: clasp no esta instalado
    echo Instalalo con: npm install -g @google/clasp
    pause
    exit /b 1
)

REM Verificar que .clasp.json existe
if not exist ".clasp.json" (
    echo ERROR: No se encontro el archivo .clasp.json
    echo Por favor configura tu Script ID primero
    pause
    exit /b 1
)

REM Mostrar archivos que se subiran
echo Archivos que se subiran:
echo   - appsscript.json
echo   - 10 archivos .gs (src/*.gs)
echo   - 6 archivos HTML (html/*.html)
echo.

REM Confirmar
set /p confirm="Continuar? (s/n): "
if /i not "%confirm%"=="s" (
    echo Cancelado
    pause
    exit /b 0
)

echo.
echo Subiendo archivos...
clasp push

if %errorlevel% equ 0 (
    echo.
    echo Codigo subido exitosamente a Apps Script!
    echo.
) else (
    echo.
    echo ERROR al subir archivos
    echo Verifica que hayas hecho 'clasp login' antes
    echo.
)

pause
