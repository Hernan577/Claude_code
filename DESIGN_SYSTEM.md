# 🎨 Sistema de Diseño - Diálogos Apple Style

## Versión 2.2.0 - 2026-01-07

---

## 📐 Principios de Diseño

### Minimalista
- Solo elementos esenciales
- Sin adornos innecesarios
- Contenido claro y directo

### Funcional
- Cada elemento tiene propósito
- Interacciones intuitivas
- Respuesta visual inmediata

### Sobrio pero Cool
- Colores sutiles
- Animaciones suaves
- Detalles elegantes

---

## 🎨 Paleta de Colores

### Colores Principales

| Uso | Color | Hex |
|-----|-------|-----|
| Fondo | Gris claro | `#f5f5f7` |
| Contenedor | Blanco | `#ffffff` |
| Texto principal | Negro suave | `#1d1d1f` |
| Texto secundario | Gris medio | `#86868b` |
| Azul principal | Apple Blue | `#0071e3` |
| Azul hover | Azul intenso | `#0077ed` |

### Colores Secundarios

| Uso | Color | Hex |
|-----|-------|-----|
| Fondo botón secundario | Gris claro | `#f5f5f7` |
| Fondo hover secundario | Gris medio | `#e8e8ed` |
| Borde | Gris claro | `#d2d2d7` |
| Notice amarillo | Fondo warning | `#fff9e6` |
| Notice borde | Amarillo | `#ffcc00` |
| Notice texto | Naranja | `#bf5000` |

---

## 🔤 Tipografía

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Tamaños

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título header | 17px | 600 |
| Mensaje principal | 15px | 400 |
| Texto secundario | 13px | 400 |
| Texto pequeño | 12px | 400 |
| Botones | 15px | 500 |

---

## 📏 Espaciado

### Padding

| Elemento | Desktop | Móvil |
|----------|---------|-------|
| Container principal | 32px 24px | 24px 16px |
| Header | 32px 24px 16px | 24px 16px 12px |
| Content | 24px | 16px |
| Botones | 14px | 12px |
| Select | 14px 40px 14px 16px | 12px 36px 12px 14px |

### Gaps
- Entre elementos: `12px`
- Entre listas: `10px-12px`
- Grid columns: `12px`

---

## 🔘 Componentes

### Botones

#### Botón Primario (Azul)
```css
background: #0071e3;
color: white;
padding: 14px;
border-radius: 12px;
font-size: 15px;
font-weight: 500;

/* Hover */
background: #0077ed;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
```

#### Botón Secundario (Gris)
```css
background: #f5f5f7;
color: #1d1d1f;
padding: 14px;
border-radius: 12px;
font-size: 15px;
font-weight: 500;

/* Hover */
background: #e8e8ed;
transform: translateY(-1px);
```

### Select (Desplegable)

```css
width: 100%;
padding: 14px 40px 14px 16px;
border: 1px solid #d2d2d7;
border-radius: 12px;
font-size: 15px;
background: white;
appearance: none; /* Quita estilo nativo */

/* Hover */
border-color: #0071e3;

/* Focus */
border-color: #0071e3;
box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
```

### Containers

```css
/* Container principal */
background: white;
border-radius: 18px;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Items de lista */
background: #f5f5f7;
border: 1px solid transparent;
border-radius: 12px;
padding: 16px;

/* Hover */
background: #e8e8ed;
border-color: #0071e3;
transform: translateY(-1px);
```

### Notificaciones

#### Notice (Amarillo)
```css
background: #fff9e6;
border-left: 3px solid #ffcc00;
padding: 12px 16px;
border-radius: 8px;
```

#### Info (Gris)
```css
background: #f5f5f7;
padding: 12px 16px;
border-radius: 8px;
```

---

## 📱 Responsive Design

### Breakpoints

| Tamaño | Ancho | Cambios |
|--------|-------|---------|
| Mobile | ≤ 400px | Grid 1 col, padding reducido, fuente menor |
| Small | ≤ 500px | Grid 1 col, padding ajustado |
| Desktop | > 500px | Grid 2 cols, padding completo |

### Media Query Móvil
```css
@media (max-width: 400px) {
  .content {
    padding: 24px 16px 16px;
  }

  .actions {
    grid-template-columns: 1fr;
  }

  .btn {
    padding: 12px;
    font-size: 14px;
  }

  select {
    padding: 12px 36px 12px 14px;
    font-size: 14px;
  }
}
```

---

## ⚡ Transiciones

### Duración
- Todo: `0.2s ease`

### Efectos
```css
/* Hover en botones */
transform: translateY(-1px);

/* Active (click) */
transform: translateY(0);

/* Focus en inputs */
box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
```

---

## 📋 Tamaños de Diálogos

| Diálogo | Ancho | Alto | Uso |
|---------|-------|------|-----|
| Seguros | 380px | 260px | 3 opciones |
| Promoción | 400px | 240px | Si/No + notice |
| Plan Reinicia | 380px | 240px | Si/No + info |
| Cambio Potencia | 420px | 260px | Select + botones |
| Promo Verano | 420px | 260px | Select + botones |
| Descargar PDFs | 480px | 460px | Lista + botones |

---

## ✨ Detalles Clave

### Sombras
```css
/* Sombra suave para containers */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Sombra hover en botones primarios */
box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
```

### Bordes Redondeados
- Containers: `18px`
- Botones/Items: `12px`
- Notificaciones: `8px`

### Text Overflow
```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

---

## 🎯 Checklist de Implementación

Al crear un nuevo diálogo, verificar:

- [ ] Font family: `-apple-system` stack
- [ ] Fondo: `#f5f5f7`
- [ ] Container: blanco con `border-radius: 18px`
- [ ] Botones: `border-radius: 12px`
- [ ] Azul principal: `#0071e3`
- [ ] Transiciones: `0.2s ease`
- [ ] Responsive: media query @400px
- [ ] Grid adaptativo: 2 cols → 1 col
- [ ] Hover effects en todos los clickeables
- [ ] Sin duplicación de títulos
- [ ] Viewport meta tag presente
- [ ] Box-sizing: border-box global

---

## 🚀 Uso

### HTML Base
```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
      background: #f5f5f7;
      padding: 20px;
      color: #1d1d1f;
    }
    .container {
      background: white;
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    /* ... resto de estilos ... */
  </style>
</head>
<body>
  <div class="container">
    <!-- Contenido aquí -->
  </div>
</body>
</html>
```

---

© 2026 Honda Maquina Valencia - Sistema de diseño v2.2.0
