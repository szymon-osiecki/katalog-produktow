// Minimalny serwer statyczny (tylko wbudowane moduły Node) — moduły ES wymagają
// serwowania plików po HTTP, otwarcie index.html przez file:// nie zadziała.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Katalog projektu bez końcowego separatora (ułatwia kontrolę ścieżek).
const root = fileURLToPath(new URL('.', import.meta.url)).replace(/[/\\]$/, '');
const port = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    let rel = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
    if (rel === '' || rel === '.') rel = 'index.html';

    const filePath = join(root, rel);
    // Zabezpieczenie przed wyjściem poza katalog projektu (path traversal).
    if (filePath !== root && !filePath.startsWith(root + sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Serwer dev działa: http://localhost:${port}`);
});
