// tabs.js — navegación entre pestañas

import { renderEstanterias, renderColeccionesGrid } from './ui.js';

const tabActions = {
  estanterias: renderEstanterias,
  colecciones: renderColeccionesGrid,
};

export function goToTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tabName)
  );
  document.querySelectorAll('.section').forEach(s =>
    s.classList.remove('active')
  );
  const sec = document.getElementById('tab-' + tabName);
  if (sec) sec.classList.add('active');
  if (tabActions[tabName]) tabActions[tabName]();
}

export function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => goToTab(btn.dataset.tab));
  });
}
