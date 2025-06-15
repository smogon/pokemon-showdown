'use strict';

const assert = require('assert').strict;
const http = require('http');
const { Net, HttpError } = require('./../../dist/lib/net');

describe('NetRequest (lib/net)', () => {
	let server;
	let baseURL;

	before(done => {
		server = http.createServer((req, res) => {
			switch (req.url) {
			case '/ok':
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('OK');
				break;
			case '/redirect':
				res.writeHead(301, { Location: '/ok' });
				res.end();
				break;
			case '/redirectloop':
				res.writeHead(301, { Location: '/redirectloop' });
				res.end();
				break;
			default:
				res.writeHead(404);
				res.end();
			}
		});
		server.listen(0, () => {
			const { port } = server.address();
			baseURL = `http://127.0.0.1:${port}`;
			done();
		});
	});

	after(done => {
		server.close(done);
	});

	it('returns body for 200 OK', async () => {
		const body = await Net(`${baseURL}/ok`).get();
		assert.equal(body, 'OK');
	});

	it('follows single redirect', async () => {
		const body = await Net(`${baseURL}/redirect`).get();
		assert.equal(body, 'OK');
	});

	it('throws after exceeding maxRedirects', async () => {
		let threw = false;
		try {
			await Net(`${baseURL}/redirectloop`).get({ maxRedirects: 3 });
		} catch (e) {
			threw = true;
			assert(e instanceof HttpError, 'Error should be instance of HttpError');
			assert.equal(e.message, 'Too many redirects');
		}
		if (!threw) assert.fail('Expected HttpError for too many redirects');
	});
});
