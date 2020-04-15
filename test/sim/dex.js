'use strict';

const assert = require('./../assert');

describe('Mod loader', function () {
	it.skip('should work fine in any order', function () {
		{
			Chat.uncacheTree('./.sim-dist/dex');
			let Dex = require('./../../../.sim-dist/dex').Dex;
			assert.equal(Dex.mod('gen2').getSpecies('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			Chat.uncacheTree('./.sim-dist/dex');
			let Dex = require('./../../../.sim-dist/dex').Dex;
			Dex.mod('gen2').getSpecies('nidoking');
			Dex.mod('gen4').getMove('crunch');
			assert.equal(Dex.mod('gen2').getSpecies('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});

describe('Dex#getEffect', function () {
	it('returns the same object for the same id', function () {
		assert.equal(Dex.getEffect('Stealth Rock'), Dex.getEffect('stealthrock'));
		assert.notStrictEqual(Dex.getEffect('move: Stealth Rock'), Dex.getEffect('stealthrock'));
	});

	it('does not return elements from the Object prototype', function () {
		assert.false(Dex.getEffect('constructor').exists);
	});
});

describe('Dex#getForme', function () {
	it('should handle Flabébé formes', function () {
		assert.equal(Dex.getForme('Flabébé-yellow'), 'Flabébé-Yellow');
	});
});

describe('Dex#getSpecies', function () {
	it('should handle Minior-Meteor formes', function () {
		assert(Dex.getSpecies('Minior-Meteor').isNonstandard);
		assert(!Dex.forGen(7).getSpecies('Minior-Meteor').isNonstandard);
	});

	it.skip('should handle Rockruff-Dusk', function () {
		assert.equal(Dex.getSpecies('Rockruff-Dusk').name, 'Rockruff-Dusk');
	});
});

describe('Dex#getItem', function () {
	it('should not mark Gems as as Nonstandard in Gens 5-7', function () {
		assert(!Dex.forGen(5).getItem('Rock Gem').isNonstandard);
		assert(!Dex.forGen(5).getItem('Normal Gem').isNonstandard);

		assert(Dex.forGen(6).getItem('Rock Gem').isNonstandard === 'Unobtainable');
		assert(!Dex.forGen(6).getItem('Normal Gem').isNonstandard);

		assert(Dex.forGen(8).getItem('Rock Gem').isNonstandard === 'Past');
	});
});
