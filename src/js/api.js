// Warstwa komunikacji z API produktów.
const API_URL = 'https://s5.cosibella.pl/api/test/products';
const TIMEOUT_MS = 10000;

/**
 * Pobiera listę produktów z API.
 * Rzuca błędem z czytelnym komunikatem, gdy żądanie się nie powiedzie.
 * @returns {Promise<Array>}
 */
export async function fetchProducts() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Serwer odpowiedział kodem ${response.status}.`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Otrzymano nieprawidłowy format danych.');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Przekroczono czas oczekiwania na odpowiedź serwera. Spróbuj ponownie.');
    }
    if (error instanceof TypeError) {
      throw new Error('Brak połączenia z serwerem. Sprawdź połączenie i spróbuj ponownie.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
