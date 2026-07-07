// data.js — carga de datos desde archivos JSON locales

const SYNC_DOT = document.getElementById('syncDot');

function setSyncState(s) {
  SYNC_DOT.className = 'sync-dot' + (s ? ' ' + s : '');
}

export async function cargarLibros() {
  setSyncState('loading');
  try {
    const r = await fetch('./datos/libros.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    setSyncState('');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    setSyncState('error');
    console.error('Error cargando libros.json:', e);
    return [];
  }
}

export async function cargarColecciones() {
  try {
    const r = await fetch('./datos/colecciones.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Error cargando colecciones.json:', e);
    return [];
  }
}
