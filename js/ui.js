// ui.js — renderizado de componentes de UI

import { state, getAllTags, getEstanterias } from './store.js';
import { tagColorClass, lomoColorClass, generatePortadaCanvas } from './utils.js';
import { filtrarLibros } from './search.js';
import { openLibroModal } from './modal-libro.js';
import { openColeccionDetail } from './colecciones.js';

// ── Tags cloud ──────────────────────────────────────────────────────────────
export function renderTagsCloud() {
  const cloud = document.getElementById('tags-cloud');
  const tags = getAllTags();
  cloud.innerHTML = '';

  if (!tags.length) {
    cloud.innerHTML = '<div class="text-muted" style="padding:16px">los tags aparecerán acá cuando carguen los libros</div>';
    return;
  }

  tags.forEach(tag => {
    const count = state.libros.filter(l => (l.tags || []).includes(tag)).length;
    const btn = document.createElement('button');
    btn.className = 'tag-bubble ' + tagColorClass(tag);
    btn.textContent = tag;

    const scale = Math.min(1 + count * 0.12, 1.6);
    btn.style.fontSize = (0.68 * scale) + 'rem';
    btn.style.padding = (5 + count) + 'px ' + (12 + count * 2) + 'px';

    // forma orgánica consistente por tag
    const seed = tag.charCodeAt(0) + tag.length;
    btn.style.borderRadius = [
      (30 + seed % 30) + '% ' + (60 + seed % 20) + '% ' + (55 + seed % 15) + '% ' + (45 + seed % 25) + '%',
      '/',
      (50 + seed % 20) + '% ' + (40 + seed % 15) + '% ' + (60 + seed % 20) + '% ' + (50 + seed % 15) + '%',
    ].join(' ');

    if (state.selectedTags.has(tag)) btn.classList.add('selected');

    btn.addEventListener('click', () => {
      if (state.selectedTags.has(tag)) state.selectedTags.delete(tag);
      else state.selectedTags.add(tag);
      renderTagsCloud();
      renderMenuResults();
    });

    cloud.appendChild(btn);
  });
}

// ── Menú resultados ─────────────────────────────────────────────────────────
export function renderMenuResults() {
  const wrap  = document.getElementById('menu-results');
  const libros = filtrarLibros();
  const total  = state.libros.length;

  document.getElementById('menu-count-label').textContent =
    libros.length === total
      ? 'todos los libros (' + total + ')'
      : libros.length + ' resultado' + (libros.length !== 1 ? 's' : '');

  if (!libros.length) {
    wrap.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-sym">✦</div><div class="empty-text">ningún libro coincide</div></div>';
    return;
  }

  wrap.innerHTML = '';
  libros.forEach(l => wrap.appendChild(buildLibroCard(l)));
}

// ── Libro card ───────────────────────────────────────────────────────────────
export function buildLibroCard(libro) {
  const card = document.createElement('div');
  card.className = 'libro-card';

  const portadaWrap = document.createElement('div');
  if (libro.portada_url) {
    const img = document.createElement('img');
    img.className = 'libro-portada';
    img.src = libro.portada_url;
    img.alt = libro.titulo;
    img.addEventListener('error', () => {
      img.replaceWith(generatePortadaCanvas(libro));
    });
    portadaWrap.appendChild(img);
  } else {
    const canvas = generatePortadaCanvas(libro);
    canvas.className = 'libro-portada-canvas';
    portadaWrap.appendChild(canvas);
  }
  card.appendChild(portadaWrap);

  const body = document.createElement('div');
  body.className = 'libro-card-body';
  body.innerHTML =
    '<div class="libro-card-titulo">' + libro.titulo + '</div>' +
    '<div class="libro-card-autor">'  + libro.autor  + ' · ' + libro.anio + '</div>' +
    '<div class="libro-card-tags">'   +
      (libro.tags || []).slice(0, 3).map(t =>
        '<span class="tag-inline ' + tagColorClass(t) + '">' + t + '</span>'
      ).join('') +
    '</div>';
  card.appendChild(body);

  card.addEventListener('click', () => openLibroModal(libro.id));
  return card;
}

// ── Estanterías ──────────────────────────────────────────────────────────────
export function renderEstanterias() {
  const wrap = document.getElementById('estanterias-wrap');
  const ests = getEstanterias();

  if (!ests.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-sym">✦</div><div class="empty-text">todavía no hay libros</div></div>';
    return;
  }

  wrap.innerHTML = '';
  ests.forEach(est => {
    const libros = state.libros.filter(l => l.estanteria === est);
    const sec    = document.createElement('div');
    sec.className = 'estanteria-section';

    const label = document.createElement('div');
    label.className = 'estanteria-label';
    label.innerHTML = '✦ ' + est + ' <span class="text-muted" style="font-style:normal;font-size:0.7rem">(' + libros.length + ')</span>';

    const shelf = document.createElement('div');
    shelf.className = 'estanteria-shelf';

    libros.forEach((l, idx) => {
      const lomo = document.createElement('div');
      lomo.className = 'lomo ' + lomoColorClass(idx);
      lomo.style.minHeight = (140 + (l.titulo.length % 6) * 10) + 'px';
      lomo.title = l.titulo + ' — ' + l.autor;
      lomo.innerHTML =
        '<div class="lomo-texto">' + l.titulo +
        '<div class="lomo-autor">' + l.autor + '</div></div>';
      lomo.addEventListener('click', () => openLibroModal(l.id));
      shelf.appendChild(lomo);
    });

    sec.appendChild(label);
    sec.appendChild(shelf);
    wrap.appendChild(sec);
  });
}

// ── Colecciones ──────────────────────────────────────────────────────────────
export function renderColeccionesGrid() {
  const grid = document.getElementById('colecciones-grid');
  document.getElementById('coleccion-detail-wrap').style.display = 'none';
  grid.style.display = '';

  if (!state.colecciones.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-sym">✦</div><div class="empty-text">no hay colecciones en colecciones.json</div></div>';
    return;
  }

  grid.innerHTML = '';
  state.colecciones.forEach(col => {
    const card = document.createElement('div');
    card.className = 'coleccion-card';

    if (col.img) {
      const img = document.createElement('img');
      img.className = 'coleccion-img';
      img.src = col.img; img.alt = col.nombre;
      img.addEventListener('error', () => img.replaceWith(buildColeccionPh()));
      card.appendChild(img);
    } else {
      card.appendChild(buildColeccionPh());
    }

    const body = document.createElement('div');
    body.className = 'coleccion-body';
    body.innerHTML =
      '<div class="coleccion-nombre">' + col.nombre + '</div>' +
      (col.curador ? '<div class="coleccion-desc" style="margin-bottom:4px">por ' + col.curador + '</div>' : '') +
      (col.desc    ? '<div class="coleccion-desc">' + col.desc + '</div>' : '');
    card.appendChild(body);

    card.addEventListener('click', () => openColeccionDetail(col.id));
    grid.appendChild(card);
  });
}

function buildColeccionPh() {
  const ph = document.createElement('div');
  ph.className = 'coleccion-img-ph';
  ph.textContent = '✦';
  return ph;
}
