'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('server/static/index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('server/static/index.html does not contain a script');

function getRedirect(hostname, port = '8000', protocol = 'http:', pathname = '/') {
	let redirect = null;
	const location = {
		hostname,
		port,
		protocol,
		pathname,
		replace(url) {
			redirect = url;
		},
	};
	vm.runInNewContext(script, { document: { location } });
	return redirect;
}

describe('Static server landing page', () => {
	it('should direct loopback hosts to the locally served test client', () => {
		const expected = 'http://localhost:8080/testclient-new.html?~~localhost:8000';

		assert.equal(getRedirect('localhost'), expected);
		assert.equal(getRedirect('127.0.0.1'), expected);
		assert.equal(getRedirect('[::1]'), expected);
	});

	it('should preserve the psim.us redirect for non-local servers', () => {
		assert.equal(
			getRedirect('example.com', '8000', 'http:', '/lobby'),
			'http://example-com.insecure.psim.us/lobby'
		);
	});
});
