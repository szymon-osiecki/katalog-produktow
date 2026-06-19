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
