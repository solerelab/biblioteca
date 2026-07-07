// search.js — lógica de búsqueda y filtrado

import { state } from './store.js';

export function filtrarLibros() {
  const q = document.getElementById('search-input').value.trim().toLowerCase();
  const scopes = [...document.querySelectorAll('.scope-btn.active')].map(b => b.dataset.scope);
  let libros = state.libros;

  if (q) {
    libros = libros.filter(l => {
      if (scopes.includes('titulo') && l.titulo.toLowerCase().includes(q)) return true;
      if (scopes.includes('autor')  && l.autor.toLowerCase().includes(q))  return true;
      if (scopes.includes('tags')   && (l.tags || []).some(t => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  if (state.selectedTags.size) {
    libros = libros.filter(l =>
      [...state.selectedTags].every(t => (l.tags || []).includes(t))
    );
  }

  return libros;
}

export function initSearch(onUpdate) {
  document.getElementById('search-input').addEventListener('input', onUpdate);
  document.getElementById('btn-clear-search').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    onUpdate();
  });
  document.querySelectorAll('.scope-btn').forEach(b => {
    b.addEventListener('click', () => { b.classList.toggle('active'); onUpdate(); });
  });
  document.getElementById('btn-clear-tags').addEventListener('click', () => {
    state.selectedTags.clear();
    onUpdate();
  });
}
