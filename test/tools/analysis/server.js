/**
 * Tests for the analysis API's HTTP layer (tools/analysis-server.ts; docs/hosting/overview.md).
 * Fork-owned: the analysis tool isn't part of upstream.
 *
 * This is the suite the hardening work wanted and there was none of: every other analysis test calls the
 * tools directly, so nothing covered CORS, the body cap, the rate limit or the routing — the parts that
 * decide whether the API is safe to expose at all.
 *
 * The limits are read from the environment when the module loads, so they are set to small values here
 * **before** it is required. That is also why this file requires the server itself rather than letting
 * mocha's spec list pull it in with everyone else's defaults.
 */
'use strict';

const assert = require('assert').strict;

process.env.ANALYSIS_RATE_LIMIT = '8';
process.env.ANALYSIS_RATE_WINDOW_MS = '60000';
process.env.ANALYSIS_MAX_BODY_BYTES = '1024';
process.env.ANALYSIS_ALLOWED_ORIGINS = 'https://analysis.example.net';

const { server } = require('../../../dist/tools/analysis-server');

const LOCAL = 'http://127.0.0.1';
let base = '';

/** One request, returning the status, the parsed body where there is one, and the headers. */
async function call(path, { method = 'POST', body = '{}', origin, headers = {} } = {}) {
	const response = await fetch(`${base}${path}`, {
		method,
		headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}), ...headers },
		...(method === 'OPTIONS' || method === 'GET' ? {} : { body }),
	});
	let data = null;
	try {
		data = await response.json();
	} catch {}
	return { status: response.status, data, headers: response.headers };
}

describe('analysis API HTTP layer', () => {
	before(done => {
		// port 0: the OS picks a free one, so the suite never collides with a running dev server
		server.listen(0, '127.0.0.1', () => {
			base = `${LOCAL}:${server.address().port}`;
			done();
		});
	});
	after(done => server.close(done));

	describe('CORS', () => {
		it('should allow a configured origin, and say so per-origin', async () => {
			const { status, headers } = await call('/analysis/version', { origin: 'https://analysis.example.net' });
			assert.equal(status, 200);
			assert.equal(headers.get('access-control-allow-origin'), 'https://analysis.example.net');
			// the answer depends on the request now, so a cache in front must not reuse it across origins
			assert.equal(headers.get('vary'), 'Origin');
		});

		it('should refuse an origin that is not configured, without CORS headers', async () => {
			const { status, headers } = await call('/analysis/version', { origin: 'https://evil.example.com' });
			assert.equal(status, 403);
			assert.equal(headers.get('access-control-allow-origin'), null);
		});

		it('should allow a request with no Origin, as a non-browser caller sends none', async () => {
			const { status, data, headers } = await call('/analysis/version');
			assert.equal(status, 200);
			assert.equal(typeof data.serverCommit, 'string');
			assert.equal(headers.get('access-control-allow-origin'), null);
		});

		// The regression that broke the first deployment: every route is POST, and the Fetch spec sends
		// `Origin` on every non-GET/HEAD request, so the hosted page's own calls carry it and were 403ing.
		it('should allow the page its own origin without it being configured', async () => {
			const { status, data } = await call('/analysis/version', { headers: { Origin: `${LOCAL}:${server.address().port}` } });
			assert.equal(status, 200);
			assert.equal(typeof data.serverCommit, 'string');
		});

		it('should take the scheme from X-Forwarded-Proto, but only from a trusted proxy', async () => {
			// nginx terminates TLS, so the page's origin is https while the request arrives here as http
			const proxied = await call('/analysis/version', {
				headers: { Origin: `https://127.0.0.1:${server.address().port}`, 'X-Forwarded-Proto': 'https' },
			});
			assert.equal(proxied.status, 200);
			// the suite connects over loopback, which is trusted, so prove the header is what did it
			const unproxied = await call('/analysis/version', {
				headers: { Origin: `https://127.0.0.1:${server.address().port}` },
			});
			assert.equal(unproxied.status, 403);
		});

		it('should not confuse a different host for the page\'s own', async () => {
			const { status } = await call('/analysis/version', {
				headers: { Origin: 'http://evil.example.com', 'X-Forwarded-Proto': 'http' },
			});
			assert.equal(status, 403);
		});

		it('should answer a preflight from an allowed origin and refuse one from anywhere else', async () => {
			const allowed = await call('/analysis/start', { method: 'OPTIONS', origin: 'https://analysis.example.net' });
			assert.equal(allowed.status, 204);
			assert.equal(allowed.headers.get('access-control-allow-headers'), 'Content-Type');
			const refused = await call('/analysis/start', { method: 'OPTIONS', origin: 'https://evil.example.com' });
			assert.equal(refused.status, 403);
		});
	});

	describe('routing', () => {
		it('should 404 an unknown path and a non-POST method', async () => {
			assert.equal((await call('/analysis/nope')).status, 404);
			assert.equal((await call('/')).status, 404);
			assert.equal((await call('/analysis/version', { method: 'GET' })).status, 404);
		});

		it('should refuse a start request with no teams rather than throwing', async () => {
			const { status, data } = await call('/analysis/start', { body: '{"format":"gen9ou"}' });
			assert.equal(status, 400);
			assert.match(data.error, /required/);
		});
	});

	describe('request size cap', () => {
		it('should refuse a body over the cap with 413', async () => {
			const { status, data } = await call('/analysis/start', { body: JSON.stringify({ pad: 'x'.repeat(4000) }) });
			assert.equal(status, 413);
			assert.match(data.error, /too large/);
		});

		it('should still accept a body under the cap', async () => {
			const { status } = await call('/analysis/start', { body: JSON.stringify({ pad: 'x'.repeat(100) }) });
			// 400 for the missing teams, which is the point: it got as far as being parsed
			assert.equal(status, 400);
		});
	});

	describe('rate limiting', () => {
		it('should 429 once a caller passes the limit, and say when to retry', async () => {
			/*
			 * A fresh path is not a fresh budget — the limit is per caller, not per route — so this runs
			 * last and simply spends what is left. Every request in this file that gets past the origin and
			 * routing checks counts towards it (a 403 or 404 returns before the counter), which is why the
			 * limit tracks the number of those and this loop is generous. Adding a test that gets a 2xx or
			 * a 4xx from a real route means raising `ANALYSIS_RATE_LIMIT` above.
			 */
			let limited = null;
			for (let i = 0; i < 20 && !limited; i++) {
				const response = await call('/analysis/version');
				if (response.status === 429) limited = response;
			}
			assert.ok(limited, 'expected the rate limit to refuse a request eventually');
			assert.match(limited.data.error, /Too many requests/);
			assert.equal(limited.headers.get('retry-after'), '60');
		});
	});
});
