# Katalog produktów

Aplikacja frontendowa wyświetlająca listę produktów pobieranych dynamicznie z API.
Napisana w **czystym JavaScripcie** (moduły ES), bez frameworków i bibliotek UI.
Style przygotowano w preprocesorze **Sass (SCSS)**. Kolorystyka czarno-biała.

Źródło danych: `https://s5.cosibella.pl/api/test/products`

## Funkcje

- **Prezentacja danych** — responsywna siatka kart z ID, nazwą, kategorią i ceną.
- **Filtrowanie** — po kategorii (`<select>` budowany z danych) oraz po cenie (zakres od–do).
- **Paginacja** — podział wyników na strony (6 produktów na stronę).
- **Zachowanie stanu w URL** — wybrane filtry i numer strony zapisują się w adresie,
  dzięki czemu stan przeżywa odświeżenie strony oraz skopiowanie i ponowne otwarcie linku.
- **Szczegóły produktu** — kliknięcie karty otwiera modal z pełnym zestawem danych
  (nazwa, kategoria, cena, dostępność, opis, tagi, ID). Modal obsługuje klawiaturę
  (Enter/Spacja, Esc), pułapkę fokusu i zamknięcie kliknięciem w tło.
- **Obsługa stanów UX**:
  - wskaźnik ładowania podczas pobierania danych,
  - czytelny komunikat o błędzie z możliwością ponowienia próby,
  - komunikat o braku wyników filtrowania z przyciskiem czyszczenia filtrów.

## Technologie

- Czysty JavaScript (moduły ES) — bez frameworków i bibliotek
- Sass (SCSS) — preprocesor CSS
- Node.js — lekki serwer deweloperski (tylko wbudowane moduły) oraz kompilacja stylów

## Wymagania

- [Node.js](https://nodejs.org/) w wersji 18 lub nowszej (zawiera `npm`)

## Uruchomienie

```bash
# 1. Instalacja zależności (pobiera kompilator Sass)
npm install

# 2. Kompilacja stylów i uruchomienie serwera
npm start
```

Następnie otwórz w przeglądarce: **http://localhost:3000**

> Aplikacja korzysta z modułów ES, które wymagają serwowania plików po HTTP —
> samo otwarcie `index.html` z dysku (`file://`) nie zadziała. Skrypt `npm start`
> uruchamia dołączony, lekki serwer deweloperski (`server.js`).

### Pozostałe skrypty

| Skrypt | Opis |
| --- | --- |
| `npm start` | Kompiluje style i uruchamia serwer (http://localhost:3000) |
| `npm run build` | Jednorazowa kompilacja SCSS → CSS |
| `npm run watch` | Kompilacja SCSS w trybie obserwowania zmian |
| `npm run serve` | Sam serwer, bez ponownej kompilacji stylów |

Aby zmienić port, ustaw zmienną środowiskową `PORT` (np. `PORT=8080`).

## Struktura projektu

```
.
├── index.html              # struktura strony
├── server.js               # lekki serwer deweloperski (Node, bez zależności)
├── package.json
├── src/
│   ├── js/                 # moduły ES (czysty JavaScript)
│   │   ├── api.js          # pobieranie danych z API (timeout, obsługa błędów)
│   │   ├── state.js        # synchronizacja stanu (filtry + strona) z adresem URL
│   │   ├── filters.js      # logika filtrowania (czyste funkcje)
│   │   ├── pagination.js   # logika paginacji (czysta funkcja)
│   │   ├── views.js        # renderowanie widoków i kart
│   │   ├── modal.js        # okno modalne ze szczegółami produktu
│   │   ├── dom.js          # drobne pomocniki DOM
│   │   └── main.js         # kontroler aplikacji
│   └── scss/               # style (preprocesor Sass)
└── css/                    # skompilowane style (generowane, poza repozytorium)
```

## Zachowanie stanu (parametry adresu)

Stan aplikacji jest kodowany w parametrach zapytania adresu URL:

| Parametr | Znaczenie | Przykład |
| --- | --- | --- |
| `kategoria` | wybrana kategoria | `?kategoria=Audio` |
| `cenaOd` | cena minimalna | `?cenaOd=200` |
| `cenaDo` | cena maksymalna | `?cenaDo=900` |
| `strona` | numer strony | `?strona=2` |

Przykład: `http://localhost:3000/?kategoria=Komponenty&cenaOd=500&strona=2`
