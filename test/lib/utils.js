'use strict';

const assert = require('assert').strict;
const Utils = require('./../../dist/lib/utils');

describe('Utils', () => {
	describe('getString', () => {
		it('should stringify strings and numbers', () => {
			assert.equal(Utils.getString('abc'), 'abc');
			assert.equal(Utils.getString(0), '0');
			assert.equal(Utils.getString(-1.5), '-1.5');
		});

		it('should return an empty string for anything else', () => {
			assert.equal(Utils.getString(null), '');
			assert.equal(Utils.getString(undefined), '');
			assert.equal(Utils.getString({ toString: 'not a function' }), '');
			assert.equal(Utils.getString([1, 2]), '');
			assert.equal(Utils.getString(true), '');
		});
	});

	describe('escapeHTML', () => {
		it('should escape HTML special characters', () => {
			assert.equal(Utils.escapeHTML('<b>&'), '&lt;b&gt;&amp;');
			assert.equal(Utils.escapeHTML(`"'`), '&quot;&apos;');
			assert.equal(Utils.escapeHTML('a/b'), 'a&#x2f;b');
		});

		it('should turn newlines into <br />', () => {
			assert.equal(Utils.escapeHTML('a\nb'), 'a<br />b');
		});

		it('should return an empty string for null/undefined', () => {
			assert.equal(Utils.escapeHTML(null), '');
			assert.equal(Utils.escapeHTML(undefined), '');
		});

		it('should stringify numbers', () => {
			assert.equal(Utils.escapeHTML(42), '42');
		});
	});

	describe('stripHTML', () => {
		it('should remove HTML tags', () => {
			assert.equal(Utils.stripHTML('<b>hi</b> there'), 'hi there');
			assert.equal(Utils.stripHTML('<a href="x">link</a>'), 'link');
		});

		it('should handle empty input', () => {
			assert.equal(Utils.stripHTML(''), '');
		});
	});

	describe('escapeRegex', () => {
		it('should escape regex metacharacters', () => {
			const re = new RegExp(Utils.escapeRegex('a.b+c'));
			assert.equal(re.test('a.b+c'), true);
			assert.equal(re.test('axbbc'), false);
		});
	});

	describe('formatOrder', () => {
		it('should use -st/-nd/-rd/-th for 1-9', () => {
			assert.equal(Utils.formatOrder(1), '1st');
			assert.equal(Utils.formatOrder(2), '2nd');
			assert.equal(Utils.formatOrder(3), '3rd');
			assert.equal(Utils.formatOrder(4), '4th');
		});

		it('should use -th for the teens', () => {
			assert.equal(Utils.formatOrder(11), '11th');
			assert.equal(Utils.formatOrder(12), '12th');
			assert.equal(Utils.formatOrder(13), '13th');
		});

		it('should follow the rule again past 20', () => {
			assert.equal(Utils.formatOrder(21), '21st');
			assert.equal(Utils.formatOrder(22), '22nd');
			assert.equal(Utils.formatOrder(23), '23rd');
			assert.equal(Utils.formatOrder(101), '101st');
			assert.equal(Utils.formatOrder(111), '111th');
			assert.equal(Utils.formatOrder(112), '112th');
		});
	});

	describe('parseExactInt', () => {
		it('should parse normalized ints', () => {
			assert.equal(Utils.parseExactInt('0'), 0);
			assert.equal(Utils.parseExactInt('42'), 42);
			assert.equal(Utils.parseExactInt('-7'), -7);
		});

		it('should return NaN for non-normalized input', () => {
			assert(Number.isNaN(Utils.parseExactInt('007')));
			assert(Number.isNaN(Utils.parseExactInt('1.5')));
			assert(Number.isNaN(Utils.parseExactInt(' 1')));
			assert(Number.isNaN(Utils.parseExactInt('1abc')));
			assert(Number.isNaN(Utils.parseExactInt('')));
		});
	});

	describe('clampIntRange', () => {
		it('should clamp into the given range', () => {
			assert.equal(Utils.clampIntRange(5, 0, 10), 5);
			assert.equal(Utils.clampIntRange(-1, 0, 10), 0);
			assert.equal(Utils.clampIntRange(99, 0, 10), 10);
		});

		it('should floor non-integer numbers', () => {
			assert.equal(Utils.clampIntRange(3.7, 0, 10), 3);
		});

		it('should coerce non-numbers to 0', () => {
			assert.equal(Utils.clampIntRange('hello', 1, 10), 1);
			assert.equal(Utils.clampIntRange(null, 1, 10), 1);
		});

		it('should coerce NaN and Infinity to 0', () => {
			assert.equal(Utils.clampIntRange(NaN, 1, 10), 1);
			assert.equal(Utils.clampIntRange(NaN, 0, 10), 0);
			assert.equal(Utils.clampIntRange(Infinity, 0, 10), 0);
			assert.equal(Utils.clampIntRange(-Infinity, 0, 10), 0);
			assert.equal(Utils.clampIntRange(Infinity), 0);
		});
	});

	describe('compare/sortBy', () => {
		it('should sort numbers low-to-high', () => {
			assert.deepEqual(Utils.sortBy([3, 1, 2]), [1, 2, 3]);
		});

		it('should sort strings A-Z', () => {
			assert.deepEqual(Utils.sortBy(['b', 'a', 'c']), ['a', 'b', 'c']);
		});

		it('should sort booleans true-first', () => {
			assert.deepEqual(Utils.sortBy([false, true, false, true]), [true, true, false, false]);
		});

		it('should support a callback', () => {
			const items = [{ n: 3 }, { n: 1 }, { n: 2 }];
			assert.deepEqual(Utils.sortBy(items, x => x.n), [{ n: 1 }, { n: 2 }, { n: 3 }]);
		});

		it('should support reverse sorting', () => {
			const items = ['c', 'a', 'b'];
			assert.deepEqual(Utils.sortBy(items, s => ({ reverse: s })), ['c', 'b', 'a']);
		});

		it('should sort lexically on arrays', () => {
			const items = [[1, 2], [1, 1], [0, 9]];
			assert.deepEqual(Utils.sortBy(items), [[0, 9], [1, 1], [1, 2]]);
		});
	});

	describe('splitFirst', () => {
		it('should split exactly once by default', () => {
			assert.deepEqual(Utils.splitFirst('1 2 3 4', ' '), ['1', '2 3 4']);
		});

		it('should respect the limit', () => {
			assert.deepEqual(Utils.splitFirst('1 2 3 4', ' ', 2), ['1', '2', '3 4']);
			assert.deepEqual(Utils.splitFirst('1 2 3 4', ' ', 3), ['1', '2', '3', '4']);
		});

		it('should pad with empty strings when delimiter is missing', () => {
			assert.deepEqual(Utils.splitFirst('abc', '|', 2), ['abc', '', '']);
		});

		it('should accept a regex delimiter', () => {
			assert.deepEqual(Utils.splitFirst('a1b2c3', /[0-9]/, 1), ['a', 'b2c3']);
		});
	});

	describe('forceWrap', () => {
		it('should leave short text alone', () => {
			assert.equal(Utils.forceWrap('hi there'), 'hi there');
		});

		it('should insert zero-width spaces in long words', () => {
			const wrapped = Utils.forceWrap('a'.repeat(40));
			assert(wrapped.includes('​'));
		});
	});

	describe('formatSQLArray', () => {
		it('should produce the right number of placeholders', () => {
			assert.equal(Utils.formatSQLArray([1, 2, 3]), '?, ?, ?');
			assert.equal(Utils.formatSQLArray([]), '');
		});

		it('should push elements into the args array when provided', () => {
			const args = [];
			Utils.formatSQLArray(['a', 'b'], args);
			assert.deepEqual(args, ['a', 'b']);
		});
	});

	describe('bufFromHex / bufReadHex / bufWriteHex', () => {
		it('should round-trip hex strings', () => {
			const hex = 'deadbeef';
			const buf = Utils.bufFromHex(hex);
			assert.equal(Utils.bufReadHex(buf), hex);
		});

		it('should pad odd-length hex input', () => {
			const buf = Utils.bufFromHex('abc');
			assert.equal(Utils.bufReadHex(buf), 'abc0');
		});
	});

	describe('Multiset', () => {
		it('should default to 0 for missing keys', () => {
			const m = new Utils.Multiset();
			assert.equal(m.get('x'), 0);
		});

		it('should add and remove counts', () => {
			const m = new Utils.Multiset();
			m.add('x');
			m.add('x');
			m.add('y');
			assert.equal(m.get('x'), 2);
			assert.equal(m.get('y'), 1);

			m.remove('x');
			assert.equal(m.get('x'), 1);

			m.remove('x');
			assert.equal(m.has('x'), false);
		});
	});

	describe('html template tag', () => {
		it('should escape interpolated values but not the static parts', () => {
			const name = '<script>';
			assert.equal(Utils.html`Hi, ${name}!`, 'Hi, &lt;script&gt;!');
		});
	});

	describe('levenshtein', () => {
		it('should report distance between strings', () => {
			assert.equal(Utils.levenshtein('kitten', 'sitting', 0), 3);
			assert.equal(Utils.levenshtein('abc', 'abc', 0), 0);
			assert.equal(Utils.levenshtein('', 'abc', 0), 3);
			assert.equal(Utils.levenshtein('abc', '', 0), 3);
		});
	});
});
