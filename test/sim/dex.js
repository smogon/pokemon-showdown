'use strict';

const assert = require('./../assert');

describe('Mod loader', function () {
	it('should work fine in any order', function () {
		{
			const Dex = require('./../../.sim-dist/dex').Dex;
			assert.equal(Dex.mod('gen2').getLearnsetData('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			const Dex = require('./../../.sim-dist/dex').Dex;
			Dex.mod('gen2').getLearnsetData('nidoking');
			Dex.mod('gen4').getMove('crunch');
			assert.equal(Dex.mod('gen2').getLearnsetData('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});

describe('Dex#getEffect', function () {
	it('returns the same object for the same id', function () {
		assert.equal(Dex.getEffect('Stealth Rock'), Dex.getEffect('stealthrock'));
		assert.notEqual(Dex.getEffect('move: Stealth Rock'), Dex.getEffect('stealthrock'));
	});

	it('does not return elements from the Object prototype', function () {
		assert.false(Dex.getEffect('constructor').exists);
	});
});

describe('Dex#getSpecies', function () {
	it('should handle cosmetic Flabébé formes', function () {
		assert.equal(Dex.getSpecies('Flabébé-yellow').name, 'Flabébé-Yellow');
	});

	it('should handle Minior-Meteor formes', function () {
		assert(Dex.getSpecies('Minior-Meteor').isNonstandard);
		assert(!Dex.forGen(7).getSpecies('Minior-Meteor').isNonstandard);
	});

	it.skip('should handle Rockruff-Dusk', function () {
		assert.equal(Dex.getSpecies('rockruffdusk').name, 'Rockruff-Dusk');
	});

	it('should handle Pikachu forme numbering', function () {
		assert.deepEqual(
			Dex.forGen(6).getSpecies('Pikachu').formeOrder.slice(0, 7),
			["Pikachu", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Cosplay"]
		);
		assert.deepEqual(
			Dex.forGen(7).getSpecies('Pikachu').formeOrder.slice(0, 9),
			["Pikachu", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter"]
		);
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
