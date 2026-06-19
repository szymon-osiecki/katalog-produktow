// Drobne pomocniki do pracy z DOM (bez zewnętrznych bibliotek).

/**
 * Tworzy element DOM z atrybutami i dziećmi.
 * @param {string} tag
 * @param {Object} [attrs] - atrybuty; obsługuje też `class`, `dataset`, `html` oraz `onX` (zdarzenia)
 * @param {Array|Node|string} [children]
 * @returns {HTMLElement}
 */
export function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;

    if (key === 'class') {
      node.className = value;
    } else if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key === 'html') {
      node.innerHTML = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }

  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }

  return node;
}

/** Usuwa całą zawartość węzła. */
export function clear(node) {
  node.replaceChildren();
}
