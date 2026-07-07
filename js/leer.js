// leer.js — visor de documentos

import { state, getLibroById, getNota, setNota } from './store.js';
import { goToTab } from './tabs.js';
import { buildViewerUrl, tagColorClass, showToast, togglePanel } from './utils.js';

export function abrirEnVisor(libroId, esSala) {
  const l = getLibroById(libroId);
  if (!l || !l.pdf_url) return;
  state.currentLeerLibroId = libroId;

  const url = buildViewerUrl(l.pdf_url);

  if (esSala) {
    goToTab('sala');
    state.salaLibroId = libroId;
    document.getElementById('sala-visor-titulo').textContent = l.titulo;
    renderSalaInfo(l);
    const container = document.getElementById('sala-visor-inner');
    container.innerHTML = buildIframeHtml(url);
    return;
  }

  goToTab('leer');
  document.getElementById('visor-titulo').textContent = l.titulo;
  document.getElementById('btn-visor-abrir-url').style.display = '';
  document.getElementById('btn-visor-abrir-url').onclick = () => window.open(l.pdf_url, '_blank');

  renderVisorContent(url);
  renderSidebarInfo(l);
  document.getElementById('notas-area').value = getNota(libroId);
}

function renderVisorContent(url) {
  const vc = document.getElementById('visor-container');
  vc.innerHTML = buildIframeHtml(url);
}

function buildIframeHtml(url) {
  return '<iframe src="' + url + '" class="visor-iframe" allow="fullscreen"></iframe>';
}

function renderSidebarInfo(l) {
  document.getElementById('info-libro-content').innerHTML =
    '<div style="display:flex;flex-direction:column;gap:4px">' +
    '<div><strong>' + l.titulo + '</strong></div>' +
    '<div style="color:var(--muted)">' + l.autor + ' · ' + l.anio + '</div>' +
    (l.editorial ? '<div style="color:var(--muted)">' + l.editorial + '</div>' : '') +
    '<div style="margin-top:6px">' +
    (l.tags || []).map(t => '<span class="tag-inline ' + tagColorClass(t) + '">' + t + '</span>').join('') +
    '</div></div>';
}

function renderSalaInfo(l) {
  document.getElementById('sala-libro-info').innerHTML =
    '<strong>' + l.titulo + '</strong><br>' + l.autor +
    (l.anio ? ' · ' + l.anio : '');
}

// ── Sala init ────────────────────────────────────────────────────────────────
export function initSala() {
  // restaurar fondo guardado
  const savedBg  = localStorage.getItem('bib-sala-bg')  || '';
  const savedLum = localStorage.getItem('bib-sala-lum') || '40';

  if (savedBg) {
    document.getElementById('sala-bg').style.backgroundImage = 'url(' + savedBg + ')';
    document.getElementById('sala-bg-url').value = savedBg;
  }
  document.getElementById('sala-luminosidad').value = savedLum;
  applySalaOverlay(savedLum);

  // aplicar fondo
  document.getElementById('btn-sala-aplicar-bg').addEventListener('click', () => {
    const url = document.getElementById('sala-bg-url').value.trim();
    document.getElementById('sala-bg').style.backgroundImage = url ? 'url(' + url + ')' : '';
    if (url) localStorage.setItem('bib-sala-bg', url);
    else localStorage.removeItem('bib-sala-bg');
  });

  // quitar fondo
  document.getElementById('btn-sala-quitar-bg').addEventListener('click', () => {
    document.getElementById('sala-bg').style.backgroundImage = '';
    document.getElementById('sala-bg-url').value = '';
    localStorage.removeItem('bib-sala-bg');
  });

  // luminosidad
  document.getElementById('sala-luminosidad').addEventListener('input', e => {
    applySalaOverlay(e.target.value);
    localStorage.setItem('bib-sala-lum', e.target.value);
  });

  // ir a leer desde sala
  document.getElementById('btn-sala-abrir-leer').addEventListener('click', () => {
    if (state.salaLibroId) abrirEnVisor(state.salaLibroId, false);
    else goToTab('leer');
  });
}

function applySalaOverlay(value) {
  // overlay oscuro: 0 = completamente oscuro, 100 = sin overlay
  const darkness = 1 - value / 100;
  document.getElementById('sala-overlay').style.background =
    'rgba(0,0,0,' + (darkness * 0.72) + ')';
}

// ── Leer init ────────────────────────────────────────────────────────────────
export function initLeer() {
  // modo oscuro visor
  document.getElementById('btn-visor-dark').addEventListener('click', () => {
    state.visorDark = !state.visorDark;
    document.getElementById('visor-wrap').classList.toggle('visor-dark', state.visorDark);
    document.getElementById('btn-visor-dark').textContent = state.visorDark ? '○' : '◑';
  });

  // tamaño grande
  document.getElementById('btn-visor-grande').addEventListener('click', () => {
    state.visorGrande = !state.visorGrande;
    const leerLayout = document.querySelector('.leer-layout');
    if (state.visorGrande) {
      leerLayout.style.gridTemplateColumns = '1fr 0';
      document.querySelector('.leer-sidebar').style.display = 'none';
      document.getElementById('btn-visor-grande').textContent = '⊠';
    } else {
      leerLayout.style.gridTemplateColumns = '';
      document.querySelector('.leer-sidebar').style.display = '';
      document.getElementById('btn-visor-grande').textContent = '⊞';
    }
  });

  // ir a sala
  document.getElementById('btn-visor-sala').addEventListener('click', () => {
    if (state.currentLeerLibroId) abrirEnVisor(state.currentLeerLibroId, true);
    else goToTab('sala');
  });

  // guardar notas
  document.getElementById('btn-guardar-notas').addEventListener('click', () => {
    if (!state.currentLeerLibroId) return;
    setNota(state.currentLeerLibroId, document.getElementById('notas-area').value);
    showToast('notas guardadas ✦');
  });

  // panel toggles
  ['panel-notas', 'panel-info-libro'].forEach(id => {
    document.querySelector('#' + id + ' .sidebar-panel-title')
      .addEventListener('click', () => togglePanel(id));
  });

  // modo oscuro cuerpo desde pestaña leer
  document.getElementById('btn-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    document.getElementById('btn-dark-mode').textContent = isDark ? '☀' : '☾';
    localStorage.setItem('bib-dark', isDark ? '1' : '');
  });
}
