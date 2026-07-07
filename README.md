# biblioteca ✦

Biblioteca virtual personal. Diseñada para funcionar en **GitHub Pages** sin backend, sin bases de datos, sin configuración desde la interfaz.

---

## estructura del proyecto

```
/
├── index.html              — única página HTML
├── css/
│   ├── tokens.css          — variables de color y diseño
│   ├── reset.css           — reset y estilos de body
│   ├── components.css      — tarjetas, botones, inputs
│   ├── header.css          — barra de navegación
│   ├── tags.css            — nube de tags y chips
│   ├── modal.css           — modales y formularios
│   ├── menu.css            — pestaña menú y búsqueda
│   ├── estanterias.css     — lomos y estanterías
│   ├── colecciones.css     — grilla de colecciones
│   ├── leer.css            — visor de documentos
│   ├── sala.css            — sala de lectura inmersiva
│   └── libro-detail.css    — modal de detalle de libro
├── js/
│   ├── main.js             — punto de entrada
│   ├── store.js            — estado global
│   ├── data.js             — carga de JSON
│   ├── utils.js            — utilidades (canvas, URLs, toast)
│   ├── search.js           — filtrado y búsqueda
│   ├── tabs.js             — navegación entre pestañas
│   ├── ui.js               — render de tarjetas, estanterías, colecciones
│   ├── modal-libro.js      — modal de detalle de libro
│   ├── leer.js             — visor PDF y sala de lectura
│   └── colecciones.js      — lógica de colecciones
├── datos/
│   ├── libros.json         — ▸ EDITAR: catálogo de libros
│   └── colecciones.json    — ▸ EDITAR: colecciones
├── pdfs/                   — ▸ subí los PDFs acá
├── portadas/               — ▸ subí las imágenes de portada acá
└── fondos/                 — ▸ imágenes/GIFs para la sala de lectura
```

---

## cómo usar

### 1. agregar libros

Editá `datos/libros.json`. Cada libro sigue esta estructura:

```json
{
  "id": "lib_001",
  "titulo": "Título del libro",
  "autor": "Nombre Apellido",
  "anio": 2024,
  "idioma": "es",
  "editorial": "Editorial (opcional)",
  "tags": ["tag1", "tag2"],
  "coleccion": "nombre de colección (opcional)",
  "estanteria": "narrativa",
  "portada_url": "./portadas/mi-libro.jpg",
  "pdf_url": "./pdfs/mi-libro.pdf",
  "resumen": "Descripción breve (opcional).",
  "palabras_clave": "palabra1, palabra2 (opcional)"
}
```

**Campos obligatorios:** `id`, `titulo`, `autor`, `anio`, `idioma`, `estanteria`

**Para el PDF:** podés usar:
- ruta local: `./pdfs/archivo.pdf`
- Google Drive: `https://drive.google.com/file/d/ID/view` (se convierte automáticamente)
- Dropbox: URL pública (se convierte automáticamente)

**Si no hay portada:** se genera automáticamente con el título y autor.

---

### 2. agregar colecciones

Editá `datos/colecciones.json`:

```json
{
  "id": "col_001",
  "nombre": "nombre de la colección",
  "desc": "descripción opcional",
  "curador": "autor o curador opcional",
  "img": "./portadas/coleccion.jpg"
}
```

Los libros se asignan a una colección poniendo el nombre exacto en el campo `coleccion` del libro.

---

### 3. PDFs

Subí los archivos a la carpeta `pdfs/` y referenciá con:
```
"pdf_url": "./pdfs/nombre-archivo.pdf"
```

---

### 4. fondos para la sala de lectura

Subí imágenes o GIFs a `fondos/` y desde la sala pegá la URL relativa:
```
./fondos/mi-fondo.gif
```

Para agregar fondos rápidos (botones predefinidos), editá el bloque comentado en `index.html` dentro de la sección sala de lectura.

---

### 5. publicar en GitHub Pages

1. Subí todo el proyecto a un repositorio de GitHub
2. Ir a Settings → Pages → Source: `main` branch, carpeta `/` (root)
3. GitHub Pages servirá todo estáticamente

---

## notas del usuario

Las notas se guardan en **localStorage** del navegador. No se sincronizan entre dispositivos. Si el usuario limpia el navegador, se pierden.

No hay fichas bibliotecarias en esta versión.

---

## personalización

### cambiar el nombre de la biblioteca
En `index.html`, línea con clase `logo`:
```html
<div class="logo"><span class="logo-sym">✦</span> tu nombre acá</div>
```

### agregar fondos rápidos en la sala
En `index.html`, dentro de `<!-- FONDOS RÁPIDOS -->`, descomentá y editá:
```html
<button class="sala-btn sala-bg-preset" data-url="./fondos/bosque.jpg">bosque</button>
```

### cambiar colores
Editá las variables en `css/tokens.css`.

---

## tecnologías

- HTML5 + CSS3 + JavaScript ES6 (módulos nativos)
- Sin frameworks, sin bundler, sin dependencias
- Fuentes: Google Fonts (Playfair Display, Assistant, Space Mono, Cormorant Garamond)
- Visor PDF: Mozilla PDF.js (CDN) o Google Drive embed
