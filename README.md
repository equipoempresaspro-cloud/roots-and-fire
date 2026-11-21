# Roots & Fire — nuevo sitio (restaurante + catering)

Prototipo local del rediseño de rootsandfirenyc.com según la reunión: enfoque de restaurante (dark kitchen de fin de semana) + catering, manteniendo el dominio.

## Cómo verlo

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Abrir http://localhost:5173

## Estructura (orden acordado)

1. **Hero**: “Peruvian flavors with a NYC twist” + botones separados **Uber Eats** y **DoorDash**.
2. **Menú de fin de semana** (#menu): 11 platos con fotos reales del Drive, con filtros por categoría. Sin precios: los precios viven en las apps.
3. **Nuestra historia** (#story): los chefs Cesar y Lady y su trayectoria.
4. **Catering y eventos** (#catering): cóctel de recepción, comida para fiestas (party trays), estaciones live-fire, bodas/corporativo/cenas privadas. CTA → **WhatsApp**.
5. **Horarios y ubicación** (#visit): 234 Starr St, Brooklyn, NY 11237 + mapa + contacto.

No se usa Toast ni pedidos propios: todo pedido individual va a Uber Eats / DoorDash, y los pedidos especiales, fiestas y eventos van a WhatsApp.

## Archivos

- `index.html`: todo el contenido.
- `assets/css/styles.css`: estilos (paleta de la marca: negro, dorado y crema, más un acento “ember”).
- `assets/js/main.js`: **todos los enlaces externos están en el objeto `SITE` al inicio**. Si se cambian ahí, se actualizan todos los botones.
- `assets/img/`: fotos optimizadas para web (convertidas de los HEIC del Drive).

## Pendiente de confirmar (marcado con un punto amarillo en la vista previa)

| Dato | Dónde cambiarlo | Fuente |
|---|---|---|
| Link directo de Uber Eats | `SITE.uberEats` en main.js | Menú PDF de Lady |
| Link directo de DoorDash | `SITE.doorDash` en main.js | Menú PDF de Lady |
| Número de WhatsApp | `SITE.whatsapp` (solo dígitos, con código de país) | Lady / Yenizza |
| Teléfono | `SITE.phone` | Lady / Yenizza |
| Menú en PDF | subir a `assets/` y poner la ruta en `SITE.menuPdf` | Lady |
| **Horarios** | tabla `.hours` en index.html (los actuales son de ejemplo) | Lady |
| Nombres y descripciones de platos | sección #menu en index.html (se escribieron a partir de las fotos) | Lady debe validar |
| Foto de cocina con fuego real (live fire) | tarjeta “Live-fire stations” (hoy usa la foto de la freidora) | Material nuevo |

## Antes de publicar

1. Completar los datos de la tabla anterior.
2. En `main.js`, poner `SHOW_PENDING_MARKERS = false`.
3. En `index.html`, borrar el bloque `.preview-bar` y la clase `is-preview` del `<body>`.
4. Revisar `og:image` y el JSON-LD con la URL final del dominio.
5. Quitar `<meta name="robots" content="noindex, nofollow">`. Solo sirve para que la demo en GitHub Pages no aparezca en Google.
