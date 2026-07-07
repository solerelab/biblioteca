// utils.js — funciones de utilidad general

export function uid(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}

export function tagColorClass(tag) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % 8;
  return 'tag-c' + h;
}

export function lomoColorClass(idx) {
  return 'lomo-c' + (idx % 8);
}

export function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

export function openModal(id)  { document.getElementById(id).classList.add('open'); }
export function closeModal(id) { document.getElementById(id).classList.remove('open'); }

export function togglePanel(id) {
  document.getElementById(id).classList.toggle('collapsed');
}

/** Convierte cualquier URL de PDF a una URL embebible */
export function buildViewerUrl(pdfUrl) {
  // Google Drive /file/d/ID/
  const driveMatch = pdfUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return 'https://drive.google.com/file/d/' + driveMatch[1] + '/preview';

  // Google Drive ?id=
  const driveId = pdfUrl.match(/drive\.google\.com.*[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveId) return 'https://drive.google.com/file/d/' + driveId[1] + '/preview';

  // Dropbox
  if (pdfUrl.includes('dropbox.com'))
    return pdfUrl.replace(/[?&]dl=[01]/, '').replace(/\?$/, '') + '?raw=1';

  // PDF.js local
  return './pdfjs/web/viewer.html?file=' + encodeURIComponent('../' + pdfUrl);
}

/** Genera una portada con Canvas cuando no hay imagen */
export function generatePortadaCanvas(libro, width = 200, height = 300) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // paleta basada en hash del título
  const palettes = [
    ['#6b403b', '#f0cdd5'], ['#3b4d6b', '#d4dce8'],
    ['#3b6b3b', '#e0de9e'], ['#4d3449', '#ddd8e4'],
    ['#6b5a3b', '#e8e2b8'], ['#6b3b50', '#f7ddd5'],
    ['#3b6b62', '#b8dde0'], ['#5a5a3b', '#f4efe4'],
  ];
  let h = 0;
  for (let i = 0; i < libro.titulo.length; i++) h = (h * 31 + libro.titulo.charCodeAt(i)) % 8;
  const [bg, accent] = palettes[h];

  // fondo
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // franja decorativa
  ctx.fillStyle = accent;
  ctx.fillRect(0, height * 0.62, width, height * 0.38);

  // símbolo decorativo
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `${width * 0.45}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('✦', width / 2, height * 0.42);

  // título
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.textAlign = 'center';
  const fontSize = Math.max(10, Math.min(16, width / (libro.titulo.length * 0.55)));
  ctx.font = `italic ${fontSize}px 'Playfair Display', serif`;
  wrapText(ctx, libro.titulo, width / 2, height * 0.68, width - 20, fontSize * 1.4);

  // autor
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `${Math.max(9, fontSize - 3)}px 'Assistant', sans-serif`;
  ctx.fillText(libro.autor, width / 2, height * 0.92);

  return canvas;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line + (line ? ' ' : '') + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}
