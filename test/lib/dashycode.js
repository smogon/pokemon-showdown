'use strict';

const assert = require('assert').strict;
const Dashycode = require('./../../dist/lib/dashycode');

describe('Dashycode', function () {
	const ascii = Array.from({length: 0x80}, (v, i) => i);
	const iso88591 = Array.from({length: 0x80}, (v, i) => i + 0x80);
	const utf16 = Array.from({length: 0xFF00}, (v, i) => i + 0x100);

	const latinL = Array.from({length: 26}, (v, i) => i + 0x60);
	const latinU = Array.from({length: 26}, (v, i) => i + 0x41);

	const encoded = new Map();

	const encode = (codepoint) => {
		const character = String.fromCodePoint(codepoint);
		const dashycode = Dashycode.encode(character);
		assert.equal(encoded.has(dashycode), false);
		encoded.set(dashycode, character);
	};

	const decode = (dashycode) => {
		const character = Dashycode.decode(dashycode);
		assert.equal(encoded.get(dashycode), character);
	};

	const transcode = (plaintext) => function () {
		const ciphertext = Dashycode.encode(plaintext);
		assert.equal(Dashycode.decode(ciphertext), plaintext);
	};

	const transcodeWithSets = (set1, set2) => function () {
		for (let bitmask = 0; bitmask <= 0xFFFF; bitmask++) {
			let plaintext = '';
			for (let i = 0; i < 16; i++) {
				plaintext += (bitmask & 1 << i) ? set1[i] : set2[i];
			}

			const ciphertext = Dashycode.encode(plaintext);
			assert.equal(Dashycode.decode(ciphertext), plaintext);
		}
	};

	it('should encode all codepoints uniquely', function () {
		for (const codepoint of [...ascii, ...iso88591, ...utf16]) {
			encode(codepoint);
		}
	});

	it('should decode all codepoints accurately', function () {
		for (const dashycode of encoded.keys()) {
			decode(dashycode);
		}
	});

	it('should transcode multiple spaces in a row', transcode('ayy  lmao'));
	it('should transcode strings beginning with a space', transcode(' ayy lmao'));
	it('should transcode strings ending with a space', transcode('ayy lmao '));
	it('should transcode UTF-16 surrogate pairs', transcode('\uDC00\uD800'));

	it('should transcode mixtures of uppercase and lowercase characters', transcodeWithSets(latinL, latinU));
	it('should transcode mixtures of alphanumeric and ASCII codepoints', transcodeWithSets(latinL, ascii));
	it('should transcode mixtures of alphanumeric and ISO-8859-1 codepoints', transcodeWithSets(latinL, iso88591));
	it('should transcode mixtures of alphanumeric and UTF-16 codepoints', transcodeWithSets(latinL, utf16));
	it('should transcode mixtures of ASCII and ISO-8859-1 codepoints', transcodeWithSets(ascii, iso88591));
	it('should transcode mixtures of ASCII and UTF-16 codepoints', transcodeWithSets(ascii, utf16));
	it('should transcode mixtures of ISO-8859-1 and UTF-16 codepoints', transcodeWithSets(iso88591, utf16));

	after(function () {
		encoded.clear();
	});
});
