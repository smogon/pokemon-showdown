'use strict';

const http = require('http');
const https = require('https');
const net = require('net');

const LISTEN_PORT = Number.parseInt(process.env.LAUNCHER_PORT || '3000', 10);
const SHOWDOWN_PORT = Number.parseInt(process.env.SHOWDOWN_PORT || '8000', 10);
const BOT_USERNAME = process.env.BOT_USERNAME || 'FoulPlayBot';
const BOT_FORMAT = process.env.BOT_FORMAT || 'gen9randombattle';
const OFFICIAL_CLIENT_HOST = 'play.pokemonshowdown.com';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function send(res, statusCode, contentType, body) {
  const payload = Buffer.from(body);
  res.writeHead(statusCode, {
    'content-type': contentType,
    'content-length': payload.length,
    'cache-control': 'no-store',
  });
  res.end(payload);
}

function launcherHtml() {
  const username = escapeHtml(BOT_USERNAME);
  const format = escapeHtml(BOT_FORMAT);
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pokemon Showdown AI</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px; line-height: 1.65; }
    .card { border: 1px solid #d0d7de; border-radius: 14px; padding: 22px; }
    .button { display: inline-block; padding: 12px 18px; border-radius: 10px; background: #0969da; color: white; text-decoration: none; font-weight: 700; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 6px; word-break: break-all; }
    .note { color: #57606a; }
  </style>
</head>
<body>
  <h1>Pokemon Showdown AI</h1>
  <div class="card">
    <p>Showdownサーバーとfoul-play Botは起動済みです。</p>
    <p><strong>Bot名:</strong> <code>${username}</code><br>
       <strong>対戦形式:</strong> <code>${format}</code></p>
    <p><a class="button" href="/client.html">Showdownを開く</a></p>
    <ol>
      <li>Showdownで自分の名前を設定します。</li>
      <li><code>${username}</code> を検索して、<code>${format}</code> で対戦を申し込みます。</li>
      <li>Botが自動で受諾します。</li>
    </ol>
    <p class="note">ブラウザ通信はこの3000番ポート内で中継されます。Showdown本体の8000番ポートを公開する必要はありません。</p>
  </div>
</body>
</html>`;
}

function clientConfigInjection() {
  return `<script>
// Codespaces: use the authenticated 3000-port origin for both the client and WebSocket proxy.
Config.defaultserver = {
  id: 'codespace',
  protocol: 'https',
  host: location.hostname,
  port: 443,
  httpport: 443,
  altport: 443,
  prefix: '/showdown',
  registered: false
};
Config.server = Config.defaultserver;
</script>`;
}

function servePatchedClient(res) {
  const request = https.get({
    hostname: OFFICIAL_CLIENT_HOST,
    path: '/testclient-new.html',
    headers: {
      accept: 'text/html',
      'user-agent': 'Pokemon-Showdown-Codespaces-Proxy',
    },
  }, upstream => {
    const chunks = [];
    upstream.on('data', chunk => chunks.push(chunk));
    upstream.on('end', () => {
      if (upstream.statusCode !== 200) {
        send(res, 502, 'text/plain; charset=utf-8', `Official client returned HTTP ${upstream.statusCode || 'unknown'}.`);
        return;
      }

      const html = Buffer.concat(chunks).toString('utf8');
      const marker = '<script nomodule src="/js/lib/ps-polyfill.js"></script>';
      if (!html.includes(marker)) {
        send(res, 502, 'text/plain; charset=utf-8', 'Could not patch the current Pokemon Showdown test client.');
        return;
      }

      const patched = html.replace(marker, `${clientConfigInjection()}\n\t${marker}`);
      send(res, 200, 'text/html; charset=utf-8', patched);
    });
  });

  request.on('error', error => {
    send(res, 502, 'text/plain; charset=utf-8', `Could not load the official Pokemon Showdown client: ${error.message}`);
  });
  request.setTimeout(30000, () => request.destroy(new Error('request timed out')));
}

function proxyRequest(req, res, target) {
  const isShowdown = target === 'showdown';
  const transport = isShowdown ? http : https;
  const headers = { ...req.headers };
  delete headers.cookie;
  delete headers.authorization;
  delete headers['proxy-authorization'];
  headers.host = isShowdown ? `127.0.0.1:${SHOWDOWN_PORT}` : OFFICIAL_CLIENT_HOST;

  const upstream = transport.request({
    hostname: isShowdown ? '127.0.0.1' : OFFICIAL_CLIENT_HOST,
    port: isShowdown ? SHOWDOWN_PORT : 443,
    method: req.method,
    path: req.url,
    headers,
  }, upstreamResponse => {
    const responseHeaders = { ...upstreamResponse.headers };
    if (responseHeaders.location && !isShowdown) {
      responseHeaders.location = responseHeaders.location.replace(
        `https://${OFFICIAL_CLIENT_HOST}`,
        ''
      );
    }
    res.writeHead(upstreamResponse.statusCode || 502, responseHeaders);
    upstreamResponse.pipe(res);
  });

  upstream.on('error', error => {
    if (!res.headersSent) {
      send(res, 502, 'text/plain; charset=utf-8', `Proxy error: ${error.message}`);
    } else {
      res.destroy(error);
    }
  });
  upstream.setTimeout(60000, () => upstream.destroy(new Error('proxy request timed out')));
  req.pipe(upstream);
}

function serializeHeaders(headers) {
  const lines = [];
  for (const [name, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) lines.push(`${name}: ${item}`);
    } else if (value !== undefined) {
      lines.push(`${name}: ${value}`);
    }
  }
  return lines;
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (pathname === '/') {
    send(res, 200, 'text/html; charset=utf-8', launcherHtml());
    return;
  }
  if (pathname === '/client.html') {
    servePatchedClient(res);
    return;
  }
  if (pathname === '/health') {
    send(res, 200, 'application/json; charset=utf-8', JSON.stringify({ ok: true }));
    return;
  }
  if (pathname === '/favicon.ico') {
    res.writeHead(302, { location: '/favicon-256.png' });
    res.end();
    return;
  }
  if (pathname.startsWith('/showdown')) {
    proxyRequest(req, res, 'showdown');
    return;
  }

  proxyRequest(req, res, 'official-client');
});

server.on('upgrade', (req, clientSocket, head) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith('/showdown')) {
    clientSocket.destroy();
    return;
  }

  const upstreamSocket = net.connect(SHOWDOWN_PORT, '127.0.0.1');
  upstreamSocket.setNoDelay(true);
  clientSocket.setNoDelay(true);

  upstreamSocket.on('connect', () => {
    const headers = { ...req.headers, host: `127.0.0.1:${SHOWDOWN_PORT}` };
    const requestHead = [
      `${req.method} ${req.url} HTTP/${req.httpVersion}`,
      ...serializeHeaders(headers),
      '',
      '',
    ].join('\r\n');
    upstreamSocket.write(requestHead);
    if (head.length) upstreamSocket.write(head);
    clientSocket.pipe(upstreamSocket).pipe(clientSocket);
  });

  const closeBoth = error => {
    if (error) console.error('WebSocket proxy error:', error.message);
    clientSocket.destroy();
    upstreamSocket.destroy();
  };
  upstreamSocket.on('error', closeBoth);
  clientSocket.on('error', closeBoth);
});

server.on('clientError', (_error, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  console.log(`Launcher and Showdown client proxy listening on port ${LISTEN_PORT}.`);
});
