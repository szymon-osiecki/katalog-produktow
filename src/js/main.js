// Punkt wejścia / kontroler aplikacji.
import { fetchProducts } from './api.js';
import { clear } from './dom.js';
import { renderLoading, renderError } from './views.js';

const app = document.querySelector('#app');

let products = [];

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

/** Renderuje główną treść aplikacji. */
function render() {
  clear(app);
  // Tymczasowe potwierdzenie pobrania danych — właściwa prezentacja w kolejnym kroku.
  const info = document.createElement('p');
  info.textContent = `Pobrano ${products.length} produktów.`;
  app.append(info);
}

load();
