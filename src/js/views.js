// Widoki stanów interfejsu (ładowanie, błąd).
import { h } from './dom.js';

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
