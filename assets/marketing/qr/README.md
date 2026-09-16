# QR y pósters de marketing — enmalinalco

Material para promover **enmalinalco.com** con un código QR elegante en la paleta de la marca.

## Archivos listos para usar

| Archivo | Formato | Úsalo para |
|---|---|---|
| `qr-poster.jpg` | 1080×1440 (vertical) | Impresión, WhatsApp, compartir general |
| `qr-square.jpg` | 1080×1080 (cuadrado) | Feed de Instagram / Facebook |
| `qr-story.jpg` | 1080×1920 (story) | Historias de IG/FB, estado de WhatsApp |
| `qr-poster.html` | HTML | Abrir en navegador, editar o imprimir |
| `qr-code.png` | 1024×1024 | El QR solo, para pegar en cualquier diseño |
| `qr-code.svg` | vector | El QR solo, se imprime nítido a cualquier tamaño |

El QR apunta a `https://enmalinalco.com` y está verificado (decodifica incluso comprimido en JPG).
Módulos redondeados y ojos en tinta sólida para lectura garantizada.

## Cómo regenerarlo

Requiere Node y las dependencias `qrcode`, `sharp`, `jsqr`. Las fuentes (Cormorant
Garamond y Plus Jakarta Sans) deben estar instaladas vía fontconfig (`~/.fonts`).

```bash
npm install qrcode sharp jsqr
node qrmatrix.mjs > qr.json   # 1. matriz del QR desde la URL
node buildqr.mjs              # 2. QR estilizado -> qr-code.svg
node poster.mjs              # 3. póster vertical HTML -> qr-poster.html
node svgposter.mjs          # 4. póster vertical JPG  -> qr-poster.jpg
node multiposter.mjs        # 5. cuadrado + story     -> qr-square.jpg, qr-story.jpg
```

Para cambiar la **URL**, edita `qrmatrix.mjs`. Para cambiar **textos, colores o layout**,
edita `poster.mjs` (HTML) y `svgposter.mjs` / `multiposter.mjs` (imágenes).
