// Logika filtrowania produktów (czyste funkcje, bez efektów ubocznych).

/** Zwraca posortowaną listę unikalnych kategorii. */
export function getCategories(products) {
  return [...new Set(products.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b, 'pl')
  );
}

/**
 * Filtruje produkty wg stanu (kategoria + zakres ceny).
 * @param {Array} products
 * @param {{category?: string, priceMin?: number|null, priceMax?: number|null}} state
 */
export function applyFilters(products, { category = '', priceMin = null, priceMax = null } = {}) {
  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (priceMin != null && product.price < priceMin) return false;
    if (priceMax != null && product.price > priceMax) return false;
    return true;
  });
}
