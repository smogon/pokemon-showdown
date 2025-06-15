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
			case '/noresponse':
				break;
			case '/redirectnoloc':
				res.writeHead(301);
				res.end();
				break;
			case '/redirectbadloc':
				res.writeHead(301, { Location: 'http://' });
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
		await assert.rejects(
			Net(`${baseURL}/redirectloop`).get({ maxRedirects: 3 }),
			err => err instanceof HttpError && err.message.startsWith('Too many redirects'),
			'Expected HttpError for too many redirects'
		);
	});

	it('throws on request timeout', async () => {
		await assert.rejects(
			Net(`${baseURL}/noresponse`).get({ timeout: 100 }),
			err => {
				assert.equal(err.message, 'Request timeout');
				return true;
			},
			'Expected timeout error'
		);
	});

	it('throws on redirect with missing Location header', async () => {
		await assert.rejects(
			Net(`${baseURL}/redirectnoloc`).get({ maxRedirects: 1 }),
			err => err instanceof HttpError && err.message.startsWith('Redirect with no location header'),
			'Expected HttpError for redirect without location header'
		);
	});

	it('throws on redirect with invalid Location header', async () => {
		await assert.rejects(
			Net(`${baseURL}/redirectbadloc`).get({ maxRedirects: 1 }),
			err => err instanceof HttpError && err.message.startsWith('Invalid redirect location'),
			'Expected HttpError for redirect with invalid location header'
		);
	});

	it('allows request when host is whitelisted', async () => {
		const configObj = global.Config || (global.Config = {});
		const prev = configObj.netHostWhitelist;
		configObj.netHostWhitelist = ['127.0.0.1'];
		const body = await Net(`${baseURL}/ok`).get();
		assert.equal(body, 'OK');
		if (prev !== undefined) {
			configObj.netHostWhitelist = prev;
		} else {
			delete configObj.netHostWhitelist;
		}
	});

	it('blocks request when host is not whitelisted', async () => {
		const configObj2 = global.Config || (global.Config = {});
		const prev2 = configObj2.netHostWhitelist;
		configObj2.netHostWhitelist = ['example.com'];
		await assert.rejects(
			Net(`${baseURL}/ok`).get(),
			err => err instanceof HttpError && err.message.startsWith('Request to disallowed host'),
			'Expected disallowed host error'
		);
		if (prev2 !== undefined) {
			configObj2.netHostWhitelist = prev2;
		} else {
			delete configObj2.netHostWhitelist;
		}
	});
});
