'use strict';

const assert = require('assert').strict;
const { Dex } = require('../../dist/sim/dex');
const { TLfor, TLadd } = require('../../dist/sim/dex-text');

describe('Shared TL', () => {
	afterEach(() => TLadd('en-afd', [{
		Open: null, Closed: null, 'From {FIRST} to {SECOND}': null,
		'{FIRST} or {SECOND}': null, ', {NEXT}': null, ', or {LAST}': null,
	}]));

	it('merges catalogs registered after a translator was created and allows explicit resets', () => {
		const translate = TLfor('en-afd');
		assert.equal(translate('Open', 'verb'), 'Open');
		TLadd('en-afd', [{ Open: { verb: 'Start', adjective: 'Available' } }]);
		assert.equal(translate('Open', 'verb'), 'Start');
		assert.equal(translate('Open', 'adjective'), 'Available');
		assert.equal(translate('Open'), 'Open');
		TLadd('en-afd', [{ Closed: 'Finished' }]);
		TLadd('en-afd', []);
		assert.equal(translate('Open', 'verb'), 'Start');
		assert.equal(translate('Closed'), 'Finished');
		TLadd('en-afd', [{ Open: { verb: null } }]);
		assert.equal(translate('Open', 'verb'), 'Open');
		assert.equal(translate('Open', 'adjective'), 'Available');
		TLadd('en-afd', [{ Open: null }]);
		assert.equal(translate('Open', 'adjective'), 'Open');
		assert.equal(translate('Closed'), 'Finished');
		assert.equal(TLfor('en-afd'), translate);
	});

	it('preserves falsy substitutions and supports reordered and repeated values', () => {
		const translate = TLfor('en-afd');
		TLadd('en-afd', [{
			'From {FIRST} to {SECOND}': '{SECOND}/{FIRST}/{SECOND}',
		}]);
		assert.equal(translate`From ${0} to ${''}`, '/0/');
		assert.equal(translate`Missing ${false}`, 'Missing false');
		assert.equal(translate('[OK]'), '[OK]');
	});

	it('binds domain objects and tables to the requested language', () => {
		const japanese = TLfor('ja');
		assert.equal(japanese(Dex.items.get('Leftovers')), Dex.text.get(Dex.items.get('Leftovers'), 'ja').name);
		const oldDex = Dex.mod('gen3');
		assert.equal(japanese(oldDex.moves.get('Tackle')), japanese(Dex.moves.get('Tackle')));
		const move = { ...oldDex.moves.get('Tackle'), shortDesc: 'A mod-specific description.' };
		assert.equal(japanese(move), japanese(Dex.moves.get('Tackle')));
		assert.equal(oldDex.text.get(move, 'ja').shortDesc, move.shortDesc);
		assert.equal(TLfor('en')`English ${0}`, 'English 0');
	});

	it('resolves named placeholders in context maps across catalogs', () => {
		TLadd('en-afd', [{
			'From {FIRST} to {SECOND}': { '': '{SECOND} after {FIRST}', brief: null },
		}, {
			'From {START} to {END}': { brief: '{END}/{START}' },
		}]);
		assert.equal(TLfor('en-afd')`From ${'A'} to ${'B'}`, 'B after A');
		assert.equal(TLfor('en-afd')('From {0} to {1}', 'brief'), '{1}/{0}');
	});

	it('uses the bound language inside list helpers', () => {
		const translate = TLfor('en-afd');
		TLadd('en-afd', [{
			'{FIRST} or {SECOND}': '{FIRST} / {SECOND}', ', {NEXT}': ' + {NEXT}', ', or {LAST}': ' / {LAST}',
		}]);
		assert.equal(translate.orList(['A', 'B']), 'A / B');
		assert.equal(translate.orList(['A', 'B', 'C']), 'A + B / C');
	});
});
