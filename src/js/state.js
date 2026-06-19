// Synchronizacja stanu aplikacji (filtry + strona) z adresem URL.
// Dzięki temu stan przeżywa odświeżenie strony i skopiowanie linku.

const PARAMS = {
  category: 'kategoria',
  priceMin: 'cenaOd',
  priceMax: 'cenaDo',
  page: 'strona',
};

function toNumberOrNull(value) {
  if (value == null || value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** Odczytuje stan z parametrów adresu URL. */
export function readState() {
  const params = new URLSearchParams(window.location.search);
  const page = toNumberOrNull(params.get(PARAMS.page));

  return {
    category: params.get(PARAMS.category) || '',
    priceMin: toNumberOrNull(params.get(PARAMS.priceMin)),
    priceMax: toNumberOrNull(params.get(PARAMS.priceMax)),
    page: page && page >= 1 ? Math.floor(page) : 1,
  };
}

/** Zapisuje stan do adresu URL bez przeładowania strony (replaceState). */
export function writeState(state) {
  const params = new URLSearchParams();
  if (state.category) params.set(PARAMS.category, state.category);
  if (state.priceMin != null) params.set(PARAMS.priceMin, String(state.priceMin));
  if (state.priceMax != null) params.set(PARAMS.priceMax, String(state.priceMax));
  if (state.page > 1) params.set(PARAMS.page, String(state.page));

  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}
