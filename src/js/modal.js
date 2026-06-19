// Okno modalne ze szczegółami produktu (dostępne: ESC, focus trap, klik w tło).
import { h } from './dom.js';
import { renderProductDetails } from './views.js';

let overlay = null;
let lastFocused = null;

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Otwiera modal ze szczegółami produktu. */
export function openModal(product) {
  closeModal();
  lastFocused = document.activeElement;

  const closeButton = h(
    'button',
    { class: 'modal__close', type: 'button', 'aria-label': 'Zamknij', onClick: closeModal },
    '×'
  );

  const dialog = h(
    'div',
    { class: 'modal__dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' },
    [closeButton, renderProductDetails(product)]
  );

  overlay = h('div', { class: 'modal__overlay' }, [dialog]);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', onKeydown);
  document.body.append(overlay);
  document.body.classList.add('no-scroll');

  closeButton.focus();
}

/** Zamyka modal i przywraca fokus do elementu, który go otworzył. */
export function closeModal() {
  if (!overlay) return;

  document.removeEventListener('keydown', onKeydown);
  overlay.remove();
  overlay = null;
  document.body.classList.remove('no-scroll');

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
  lastFocused = null;
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'Tab') {
    trapFocus(event);
  }
}

/** Utrzymuje fokus wewnątrz modala podczas nawigacji klawiszem Tab. */
function trapFocus(event) {
  const focusable = overlay.querySelectorAll(FOCUSABLE);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
