// Punkt wejścia / kontroler aplikacji.
import { fetchProducts } from './api.js';
import { h, clear } from './dom.js';
import { getCategories, applyFilters } from './filters.js';
import { renderLoading, renderError, renderGrid, renderFilters } from './views.js';

const app = document.querySelector('#app');

let products = [];
const state = {
  category: '',
  priceMin: null,
  priceMax: null,
};

/** Pobiera dane i przełącza widok między stanem ładowania, błędu i treści. */
async function load() {
  clear(app);
  app.append(renderLoading());

  try {
    products = await fetchProducts();
    render();
  } catch (error) {
    clear(app);
    app.append(renderError(error.message, load));
  }
}

/** Renderuje szkielet aplikacji (filtry + obszar wyników). */
function render() {
  clear(app);

  const toolbar = renderFilters({
    categories: getCategories(products),
    state,
    onChange: (patch) => {
      Object.assign(state, patch);
      renderResults();
    },
  });

  app.append(toolbar, h('div', { class: 'results' }));
  renderResults();
}

/** Renderuje wyłącznie obszar wyników (po zmianie filtrów). */
function renderResults() {
  const results = app.querySelector('.results');
  clear(results);
  const filtered = applyFilters(products, state);
  results.append(renderGrid(filtered));
}

load();
