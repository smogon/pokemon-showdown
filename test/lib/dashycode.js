'use strict';

const assert = require('assert');
const Dashycode = require('./../../.lib-dist/dashycode');

describe('Dashycode', function () {
	// Technically we should be testing for values up to 0x10FFFF, but since
	// node.js uses UTF-16, codepoints higher than 0xFFFF would be represented
	// as surrogate pairs, making it pointless to test them since we've already
	// tested the surrogate codepoints.
	const codepoints = Array.from({length: 0x10000}, (v, k) => k);
	const encoded = new Map();

	const encode = (codepoint) => {
		const character = String.fromCodePoint(codepoint);
		const dashycode = Dashycode.encode(character);
		assert.strictEqual(encoded.has(dashycode), false);
		encoded.set(dashycode, character);
	};

	const decode = (dashycode) => {
		const character = Dashycode.decode(dashycode);
		assert.strictEqual(encoded.get(dashycode), character);
	};

	it('should encode all codepoints uniquely', function () {
		return codepoints.reduce((p, codepoint) => (
			p.then(v => encode(codepoint))
		), Promise.resolve());
	});

	it('should decode all codepoints accurately', function () {
		return [...encoded.keys()].reduce((p, dashycode) => (
			p.then(v => decode(dashycode))
		), Promise.resolve());
	});

	after(function () {
		encoded.clear();
	});
});
