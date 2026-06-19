// Logika filtrowania produktów (czyste funkcje, bez efektów ubocznych).

/** Zwraca posortowaną listę unikalnych kategorii. */
export function getCategories(products) {
  return [...new Set(products.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b, 'pl')
  );
}

/**
 * Filtruje produkty wg stanu (na razie: kategoria).
 * @param {Array} products
 * @param {{category?: string}} state
 */
export function applyFilters(products, { category = '' } = {}) {
  return products.filter((product) => !category || product.category === category);
}
