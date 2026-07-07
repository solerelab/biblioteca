// modal-libro.js — modal de detalle de libro

import { state, getLibroById } from './store.js';
import { tagColorClass, generatePortadaCanvas, openModal, closeModal, showToast } from './utils.js';
import { abrirEnVisor } from './leer.js';

export function openLibroModal(id) {
  const l = getLibroById(id);
  if (!l) return;
  state.currentLibroId = id;

  document.getElementById('modal-libro-titulo').textContent = l.titulo;
  renderLibroDetail(l);

  const btnLeer = document.getElementById('btn-modal-leer');
  btnLeer.style.display = l.pdf_url ? '' : 'none';

  openModal('modal-libro');
}

function renderLibroDetail(l) {
  const layout = document.getElementById('libro-detail-layout');
  layout.innerHTML = '';

  // portada
  const portadaCol = document.createElement('div');
  if (l.portada_url) {
    const img = document.createElement('img');
    img.className = 'libro-detail-portada';
    img.src = l.portada_url; img.alt = l.titulo;
    img.addEventListener('error', () => {
      const canvas = generatePortadaCanvas(l, 160, 240);
      canvas.className = 'libro-detail-portada-canvas';
      img.replaceWith(canvas);
    });
    portadaCol.appendChild(img);
  } else {
    const canvas = generatePortadaCanvas(l, 160, 240);
    canvas.className = 'libro-detail-portada-canvas';
    portadaCol.appendChild(canvas);
  }
  layout.appendChild(portadaCol);

  // info
  const infoCol = document.createElement('div');
  infoCol.innerHTML =
    '<div class="libro-detail-titulo">' + l.titulo + '</div>' +
    '<div class="libro-detail-autor">' + l.autor + '</div>' +
    '<div class="libro-detail-meta">' +
      metaRow('año', l.anio) +
      metaRow('idioma', l.idioma) +
      (l.editorial  ? metaRow('editorial',  l.editorial)  : '') +
      (l.coleccion  ? metaRow('colección',  l.coleccion)  : '') +
      metaRow('estantería', l.estanteria) +
    '</div>' +
    (l.resumen ? '<div class="libro-detail-resumen">' + l.resumen + '</div>' : '') +
    '<div class="libro-card-tags">' +
      (l.tags || []).map(t => '<span class="tag-inline ' + tagColorClass(t) + '">' + t + '</span>').join('') +
    '</div>' +
    (l.palabras_clave ? '<div class="text-muted" style="margin-top:8px;font-size:0.72rem">palabras clave: ' + l.palabras_clave + '</div>' : '');
  layout.appendChild(infoCol);
}

function metaRow(label, value) {
  return '<div class="libro-detail-meta-row"><strong>' + label + ':</strong> ' + value + '</div>';
}

// ── Event listeners ──────────────────────────────────────────────────────────
document.getElementById('btn-modal-cerrar').addEventListener('click', () => closeModal('modal-libro'));

document.getElementById('btn-modal-leer').addEventListener('click', () => {
  const l = getLibroById(state.currentLibroId);
  closeModal('modal-libro');
  if (l && l.pdf_url) abrirEnVisor(l.id, false);
});

// cerrar overlay
document.getElementById('modal-libro').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal('modal-libro');
});
