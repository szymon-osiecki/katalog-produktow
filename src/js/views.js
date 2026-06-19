// Widoki: stany interfejsu oraz prezentacja produktów.
import { h } from './dom.js';

const priceFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

/** Formatuje cenę w walucie PLN (np. „349,99 zł”). */
export function formatPrice(value) {
  return priceFormatter.format(value);
}

/** Wskaźnik ładowania danych. */
export function renderLoading() {
  return h('div', { class: 'state state--loading', role: 'status', 'aria-live': 'polite' }, [
    h('span', { class: 'spinner', 'aria-hidden': 'true' }),
    h('p', { class: 'state__text' }, 'Ładowanie produktów…'),
  ]);
}

/** Komunikat o błędzie z przyciskiem ponowienia. */
export function renderError(message, onRetry) {
  return h('div', { class: 'state state--error', role: 'alert' }, [
    h('p', { class: 'state__title' }, 'Wystąpił błąd'),
    h('p', { class: 'state__text' }, message),
    h('button', { class: 'btn', type: 'button', onClick: onRetry }, 'Spróbuj ponownie'),
  ]);
}

/** Zamienia tekst z pola liczbowego na liczbę lub null (puste pole). */
function parsePrice(value) {
  if (value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * Pasek narzędzi z filtrami: kategoria (select) oraz zakres ceny (od–do).
 * @param {{categories: string[], state: object, onChange: (patch: object) => void}} params
 */
export function renderFilters({ categories, state, onChange }) {
  const options = [h('option', { value: '' }, 'Wszystkie kategorie')];
  for (const category of categories) {
    options.push(h('option', { value: category, selected: category === state.category }, category));
  }

  const categorySelect = h(
    'select',
    {
      class: 'field__control',
      id: 'filter-category',
      onChange: (event) => onChange({ category: event.target.value }),
    },
    options
  );

  const priceMin = h('input', {
    type: 'number',
    min: '0',
    step: '1',
    inputmode: 'numeric',
    class: 'field__control field__control--price',
    id: 'filter-price-min',
    placeholder: 'od',
    'aria-label': 'Cena od',
    value: state.priceMin ?? '',
    onInput: (event) => onChange({ priceMin: parsePrice(event.target.value) }),
  });

  const priceMax = h('input', {
    type: 'number',
    min: '0',
    step: '1',
    inputmode: 'numeric',
    class: 'field__control field__control--price',
    id: 'filter-price-max',
    placeholder: 'do',
    'aria-label': 'Cena do',
    value: state.priceMax ?? '',
    onInput: (event) => onChange({ priceMax: parsePrice(event.target.value) }),
  });

  return h('div', { class: 'toolbar' }, [
    h('div', { class: 'field' }, [
      h('label', { class: 'field__label', for: 'filter-category' }, 'Kategoria'),
      categorySelect,
    ]),
    h('div', { class: 'field' }, [
      h('span', { class: 'field__label' }, 'Cena (zł)'),
      h('div', { class: 'price-range' }, [
        priceMin,
        h('span', { class: 'price-range__sep', 'aria-hidden': 'true' }, '–'),
        priceMax,
      ]),
    ]),
  ]);
}

/** Pojedyncza karta produktu (ID, nazwa, kategoria, cena, dostępność). */
export function renderProductCard(product) {
  return h('article', { class: 'card', dataset: { id: product.id } }, [
    h('div', { class: 'card__top' }, [
      h('span', { class: 'card__category' }, product.category),
      h('span', { class: 'card__id' }, `#${product.id}`),
    ]),
    h('h2', { class: 'card__name' }, product.name),
    h('div', { class: 'card__footer' }, [
      h('span', { class: 'card__price' }, formatPrice(product.price)),
      h(
        'span',
        { class: product.stock ? 'card__stock' : 'card__stock card__stock--out' },
        product.stock ? 'Dostępny' : 'Niedostępny'
      ),
    ]),
  ]);
}

/** Siatka kart produktów. */
export function renderGrid(products) {
  const grid = h('div', { class: 'grid' });
  for (const product of products) {
    grid.append(renderProductCard(product));
  }
  return grid;
}

/** Poprawna polska forma rzeczownika „produkt". */
function pluralProdukt(n) {
  if (n === 1) return 'produkt';
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'produkty';
  return 'produktów';
}

/** Licznik znalezionych produktów. */
export function renderResultsCount(total) {
  return h('p', { class: 'results-count', role: 'status', 'aria-live': 'polite' },
    `Znaleziono ${total} ${pluralProdukt(total)}`);
}

/** Nawigacja paginacji. Zwraca null, gdy jest tylko jedna strona. */
export function renderPagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const buttons = [];

  buttons.push(
    h('button', {
      class: 'pagination__btn',
      type: 'button',
      disabled: page === 1,
      'aria-label': 'Poprzednia strona',
      onClick: () => onPage(page - 1),
    }, '‹')
  );

  for (let p = 1; p <= totalPages; p += 1) {
    buttons.push(
      h('button', {
        class: p === page ? 'pagination__btn pagination__btn--active' : 'pagination__btn',
        type: 'button',
        'aria-current': p === page ? 'page' : false,
        onClick: () => onPage(p),
      }, String(p))
    );
  }

  buttons.push(
    h('button', {
      class: 'pagination__btn',
      type: 'button',
      disabled: page === totalPages,
      'aria-label': 'Następna strona',
      onClick: () => onPage(page + 1),
    }, '›')
  );

  return h('nav', { class: 'pagination', 'aria-label': 'Paginacja' }, buttons);
}
