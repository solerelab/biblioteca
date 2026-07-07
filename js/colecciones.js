// colecciones.js — lógica de colecciones

import { state } from './store.js';
import { buildLibroCard } from './ui.js';
import { openLibroModal } from './modal-libro.js';

export function openColeccionDetail(colId) {
  const col = state.colecciones.find(c => c.id === colId);
  if (!col) return;

  const librosCol = state.libros.filter(l =>
    (l.coleccion || '').toLowerCase() === col.nombre.toLowerCase()
  );

  document.getElementById('colecciones-grid').style.display = 'none';
  const wrap = document.getElementById('coleccion-detail-wrap');
  wrap.style.display = 'block';

  const content = document.getElementById('coleccion-detail-content');
  content.innerHTML = '';

  // header colección
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:flex-start;gap:16px;margin-bottom:20px';

  if (col.img) {
    const img = document.createElement('img');
    img.src = col.img;
    img.style.cssText = 'width:80px;border-radius:10px;object-fit:cover;flex-shrink:0';
    header.appendChild(img);
  }

  const info = document.createElement('div');
  info.innerHTML =
    '<div class="section-title">' + col.nombre + '</div>' +
    (col.curador ? '<div class="text-muted" style="margin:4px 0">por ' + col.curador + '</div>' : '') +
    (col.desc    ? '<div style="font-size:0.8rem;color:var(--muted);margin-top:6px">' + col.desc + '</div>' : '');
  header.appendChild(info);
  content.appendChild(header);

  // libros de la colección
  if (!librosCol.length) {
    const empty = document.createElement('div');
    empty.className = 'text-muted';
    empty.style.padding = '20px 0';
    empty.textContent = 'Ningún libro en esta colección todavía.';
    content.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px';
  librosCol.forEach(l => grid.appendChild(buildLibroCard(l)));
  content.appendChild(grid);
}

export function initColecciones() {
  document.getElementById('btn-volver-colecciones').addEventListener('click', () => {
    document.getElementById('coleccion-detail-wrap').style.display = 'none';
    document.getElementById('colecciones-grid').style.display = '';
  });
}
