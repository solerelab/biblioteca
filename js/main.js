// main.js — punto de entrada principal

import { setLibros, setColecciones, loadNotas, state } from './store.js';
import { cargarLibros, cargarColecciones } from './data.js';
import { renderTagsCloud, renderMenuResults } from './ui.js';
import { initSearch } from './search.js';
import { initTabs } from './tabs.js';
import { initLeer, initSala } from './leer.js';
import { initColecciones } from './colecciones.js';
import { openLibroModal } from './modal-libro.js';

async function init() {
  // preferencias guardadas
  if (localStorage.getItem('bib-dark') === '1') {
    document.body.classList.add('dark');
    const btn = document.getElementById('btn-dark-mode');
    if (btn) btn.textContent = '☀';
  }
  document.body.classList.add('bg-aura');

  loadNotas();

  // cargar datos desde JSON
  const [libros, colecciones] = await Promise.all([
    cargarLibros(),
    cargarColecciones(),
  ]);

  setLibros(libros);
  setColecciones(colecciones);

  // inicializar módulos
  initTabs();
  initSearch(() => { renderTagsCloud(); renderMenuResults(); });
  initLeer();
  initSala();
  initColecciones();

  // render inicial
  renderTagsCloud();
  renderMenuResults();

  // libro aleatorio
  document.getElementById('btn-libro-aleatorio').addEventListener('click', () => {
    if (!state.libros.length) return;
    const l = state.libros[Math.floor(Math.random() * state.libros.length)];
    openLibroModal(l.id);
  });
}

document.addEventListener('DOMContentLoaded', init);
