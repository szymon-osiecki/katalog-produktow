// Logika paginacji (czysta funkcja).

/**
 * Dzieli elementy na strony i zwraca bieżącą stronę.
 * Numer strony jest przycinany do dozwolonego zakresu [1, totalPages].
 * @param {Array} items
 * @param {number} page
 * @param {number} pageSize
 * @returns {{ pageItems: Array, totalPages: number, page: number }}
 */
export function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page || 1), totalPages);
  const start = (current - 1) * pageSize;

  return {
    pageItems: items.slice(start, start + pageSize),
    totalPages,
    page: current,
  };
}
