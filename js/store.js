// store.js — estado global de la aplicación

const NOTAS_KEY = 'bib_notas';

export const state = {
  libros: [],
  colecciones: [],
  notas: {},          // { libro_id: "texto" }
  currentLibroId: null,
  currentLeerLibroId: null,
  selectedTags: new Set(),
  visorDark: false,
  visorGrande: false,
  salaLibroId: null,
};

export function setLibros(libros)           { state.libros = libros; }
export function setColecciones(colecciones) { state.colecciones = colecciones; }

export function getNota(libroId)           { return state.notas[libroId] || ''; }
export function setNota(libroId, texto)    {
  state.notas[libroId] = texto;
  saveNotas();
}

function saveNotas() {
  localStorage.setItem(NOTAS_KEY, JSON.stringify(state.notas));
}

export function loadNotas() {
  try {
    const raw = localStorage.getItem(NOTAS_KEY);
    if (raw) state.notas = JSON.parse(raw);
  } catch (e) {
    state.notas = {};
  }
}

export function getAllTags() {
  const set = new Set();
  state.libros.forEach(l => (l.tags || []).forEach(t => set.add(t)));
  return [...set].sort();
}

export function getEstanterias() {
  const set = new Set(state.libros.map(l => l.estanteria).filter(Boolean));
  return [...set].sort();
}

export function getLibroById(id) {
  return state.libros.find(l => l.id === id) || null;
}
