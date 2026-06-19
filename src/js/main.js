// Punkt wejścia / kontroler aplikacji.
import { fetchProducts } from './api.js';
import { h, clear } from './dom.js';
import { getCategories, applyFilters } from './filters.js';
import { paginate } from './pagination.js';
import {
  renderLoading,
  renderError,
  renderGrid,
  renderFilters,
  renderPagination,
  renderResultsCount,
} from './views.js';

const app = document.querySelector('#app');
const PAGE_SIZE = 6;

let products = [];
const state = {
  category: '',
  priceMin: null,
  priceMax: null,
  page: 1,
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
      state.page = 1; // zmiana filtra wraca na pierwszą stronę
      renderResults();
    },
  });

  app.append(toolbar, h('div', { class: 'results' }));
  renderResults();
}

/** Renderuje obszar wyników: licznik, siatkę bieżącej strony i paginację. */
function renderResults() {
  const results = app.querySelector('.results');
  clear(results);

  const filtered = applyFilters(products, state);
  const { pageItems, totalPages, page } = paginate(filtered, state.page, PAGE_SIZE);
  state.page = page; // synchronizacja po ewentualnym przycięciu zakresu

  results.append(renderResultsCount(filtered.length), renderGrid(pageItems));

  const pager = renderPagination({
    page,
    totalPages,
    onPage: (next) => {
      state.page = next;
      renderResults();
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });
  if (pager) results.append(pager);
}

load();
