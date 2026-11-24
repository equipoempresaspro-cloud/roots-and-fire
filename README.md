# Roots & Fire — nuevo sitio (restaurante + catering)

Prototipo local del rediseño de rootsandfirenyc.com: cocina peruana de fin de semana en Bushwick (solo delivery y para llevar) + catering y eventos, manteniendo el dominio.

## Cómo verlo

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Abrir http://localhost:5173. Para verlo en español: http://localhost:5173/?lang=es (o el botón **EN / ES** del encabezado). El idioma elegido se mantiene al pasar de una página a otra.

## Dirección de diseño

- **Hero** inspirado en Five Acres: tres fotografías a pantalla completa, sin texto, botones de pedido ni contadores sobre las imágenes; indicadores inferiores y control de pausa. Encuadres independientes para escritorio y móvil. Fotos del Drive: `IMG_0422.JPG` (alitas), `IMG_8202.HEIC` (hamburguesa) y `IMG_0317.HEIC` (tequeños), optimizadas como `hero-*.webp`.
- **Secciones** inspiradas en Firedoor (páginas Events y About de firedoor.com.au): títulos serif finos, textos cortos en mayúsculas monoespaciadas, paneles crema, bloques foto/texto alternados, formulario de eventos en un bloque de color y el nombre gigante en el pie.
- **Colores**: la paleta de rootsandfirenyc.com (`#DCA54A` dorado, `#D09A40`, `#FAF5E5` crema, `#0E0D06`, `#141006`, `#1B1B1B`, `#2E2D2A`, blanco).
- **Tipografías**: Instrument Serif (títulos), DM Mono (etiquetas y textos cortos), Plus Jakarta Sans (la del sitio actual, para textos largos y formularios).

## Páginas

Todas comparten la barra de aviso dorada, el encabezado (menú, logo centrado, EN/ES, botón **Order now** con Uber Eats / DoorDash), el pie con el nombre gigante y, en móvil, la barra fija de pedidos. Las páginas interiores abren con una portada al estilo de Firedoor (foto completa, título grande a la izquierda y "accesos rápidos" a la derecha).

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `index.html` | Hero con 3 fotografías sin texto superpuesto, frase de presentación y un avance de cada sección que lleva a su página: selección vertical de 4 fotos → Menú, historia → Nuestra historia, 3 servicios → Catering, Instagram, horario → Contacto. |
| Menú | `menu.html` | Los 11 platos en una columna, con fotos grandes y solo el nombre, por categoría (Del wok, Burgers y street food, Para compartir, Dulces) y una franja dorada para pedir. Sin precios: viven en las apps. |
| Nuestra historia | `about.html` | La historia, los chefs Cesar y Lady (#chefs), la tabla "Where we've cooked", las citas (#words) y un llamado a catering. |
| Catering y eventos | `catering.html` | Los 4 servicios (#services), "How it works" (#how) y el formulario de consultas (#enquire), que abre WhatsApp con el mensaje armado. |
| Visítanos y contacto | `contact.html` | Mapa, dirección, horario, contacto y dos llamados: pedir por las apps o consultar por un evento. |

El encabezado y el pie están repetidos en cada archivo HTML: si se cambia un enlace del menú o del pie, hay que cambiarlo en las 5 páginas.

No se usa Toast ni pedidos propios: todo pedido individual va a Uber Eats / DoorDash, y los pedidos especiales, fiestas y eventos van a WhatsApp.

## Archivos

- `index.html`, `menu.html`, `about.html`, `catering.html`, `contact.html`: el contenido en inglés.
- `assets/js/i18n.js`: **la versión en español** de todas las páginas. Cada texto con `data-i18n="clave"` se reemplaza por `es.clave`. Para cambiar un texto en español, editarlo ahí. Los títulos de pestaña de cada página están en `ui.en.pages` / `ui.es.pages`.
- `assets/css/styles.css`: estilos (los colores están como variables al inicio).
- `assets/js/main.js`: comportamiento. **Todos los enlaces externos están en el objeto `SITE` al inicio**; si se cambian ahí, se actualizan todos los botones.
- `assets/img/`: fotos optimizadas para web.

## Pendiente de confirmar

Mientras falte un dato, el botón muestra un aviso de "pendiente" en vez de llevar a un enlace roto.

| Dato | Dónde cambiarlo | Fuente |
|---|---|---|
| Link directo de Uber Eats | `SITE.uberEats` en main.js | Menú PDF de Lady |
| Link directo de DoorDash | `SITE.doorDash` en main.js | Menú PDF de Lady |
| Número de WhatsApp (también lo usa el formulario de eventos) | `SITE.whatsapp` (solo dígitos, con código de país) | Lady / Yenizza |
| Teléfono | `SITE.phone` | Lady / Yenizza |
| Menú en PDF | subir a `assets/` y poner la ruta en `SITE.menuPdf` | Lady |
| **Horarios** | tabla `.hours` en index.html y contact.html (los actuales son de ejemplo) | Lady |
| Contador "200+ invitados" y "hasta 200 invitados" | hero de index.html (`data-count="200"`), catering.html y textos de i18n.js | Confirmar capacidad máxima real |
| Nombres y descripciones de platos | menu.html, selección de index.html y i18n.js | Lady debe validar |
| Frases de cada categoría del menú ("Flash-seared over a roaring flame…") | menu.html e i18n.js | Escritas para la demo; Lady puede cambiarlas |
| Foto de cocina con fuego real (live fire) | tarjeta "Live-Fire Stations" de catering.html (hoy usa la foto de la freidora) | Material nuevo |

## Antes de publicar

1. Completar los datos de la tabla anterior.
2. Revisar `og:image`, los `hreflang` y el JSON-LD con la URL final del dominio.
3. Quitar `<meta name="robots" content="noindex, nofollow">` de las 5 páginas. Solo sirve para que la demo en GitHub Pages no aparezca en Google.
