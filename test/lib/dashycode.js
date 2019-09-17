'use strict';

const assert = require('assert');
const Dashycode = require('./../../.lib-dist/dashycode');

describe('Dashycode', function () {
	const ascii = Array.from({length: 0x80}, (v, k) => k);
	const iso88591 = Array.from({length: 0x80}, (v, k) => k + 0x80);
	const utf16 = Array.from({length: 0xFF00}, (v, k) => k + 0x100);

	const latinL = Array.from({length: 26}, (v, k) => k + 0x60);
	const latinU = Array.from({length: 26}, (v, k) => k + 0x41);

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

	const transcode = (plaintext) => function () {
		const ciphertext = Dashycode.encode(plaintext);
		assert.strictEqual(Dashycode.decode(ciphertext), plaintext);
	};

	const transcodeWithSets = (set1, set2) => function () {
		for (let bitmask = 0; bitmask <= 0xFFFF; bitmask++) {
			let plaintext = '';
			plaintext += (bitmask & 0x0001) ? set1[0] : set2[0];
			plaintext += (bitmask & 0x0002) ? set1[1] : set2[1];
			plaintext += (bitmask & 0x0004) ? set1[2] : set2[2];
			plaintext += (bitmask & 0x0008) ? set1[3] : set2[3];
			plaintext += (bitmask & 0x0010) ? set1[4] : set2[4];
			plaintext += (bitmask & 0x0020) ? set1[5] : set2[5];
			plaintext += (bitmask & 0x0040) ? set1[6] : set2[6];
			plaintext += (bitmask & 0x0080) ? set1[7] : set2[7];
			plaintext += (bitmask & 0x0100) ? set1[8] : set2[8];
			plaintext += (bitmask & 0x0200) ? set1[9] : set2[9];
			plaintext += (bitmask & 0x0400) ? set1[10] : set2[10];
			plaintext += (bitmask & 0x0800) ? set1[11] : set2[11];
			plaintext += (bitmask & 0x1000) ? set1[12] : set2[12];
			plaintext += (bitmask & 0x2000) ? set1[13] : set2[13];
			plaintext += (bitmask & 0x4000) ? set1[14] : set2[14];
			plaintext += (bitmask & 0x8000) ? set1[15] : set2[15];

			const ciphertext = Dashycode.encode(plaintext);
			assert.strictEqual(Dashycode.decode(ciphertext), plaintext);
		}
	};

	it('should encode all codepoints uniquely', function () {
		return [...ascii, ...iso88591, ...utf16].reduce((p, codepoint) => (
			p.then(v => encode(codepoint))
		), Promise.resolve());
	});

	it('should decode all codepoints accurately', function () {
		return [...encoded.keys()].reduce((p, dashycode) => (
			p.then(v => decode(dashycode))
		), Promise.resolve());
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
