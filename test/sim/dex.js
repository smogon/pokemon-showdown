'use strict';

const assert = require('./../assert');

describe('Mod loader', () => {
	it('should always provide accurate gen information', () => {
		{
			const Dex = require('./../../dist/sim/dex').Dex;
			assert.equal(Dex.mod('gen2').gen, 2);
			assert.equal(Dex.forFormat('gen1randombattle').gen, 1);
		}
	});

	it('should work fine in any order', () => {
		{
			const Dex = require('./../../dist/sim/dex').Dex;
			assert.equal(Dex.mod('gen2').species.getLearnsetData('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').moves.get('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			const Dex = require('./../../dist/sim/dex').Dex;
			Dex.mod('gen2').species.getLearnsetData('nidoking');
			Dex.mod('gen4').moves.get('crunch');
			assert.equal(Dex.mod('gen2').species.getLearnsetData('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.equal(Dex.mod('gen2').moves.get('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});

describe('Dex#getEffect', () => {
	it('returns the same object for the same id', () => {
		assert.equal(Dex.conditions.get('Stealth Rock'), Dex.conditions.get('stealthrock'));
		assert.notEqual(Dex.conditions.get('move: Stealth Rock'), Dex.conditions.get('stealthrock'));
	});

	it('does not return elements from the Object prototype', () => {
		assert.false(Dex.conditions.get('constructor').exists);
	});
});

describe('Dex#getSpecies', () => {
	it('should handle cosmetic Flabébé formes', () => {
		assert.equal(Dex.species.get('Flabébé-yellow').name, 'Flabébé-Yellow');
	});

	it('should handle Minior-Meteor formes', () => {
		assert(!Dex.species.get('Minior-Meteor').isNonstandard);
		assert(Dex.forGen(8).species.get('Minior-Meteor').isNonstandard);
		assert(!Dex.forGen(7).species.get('Minior-Meteor').isNonstandard);
	});

	it('should handle Rockruff-Dusk', () => {
		assert.equal(Dex.species.get('rockruffdusk').name, 'Rockruff-Dusk');
	});

	it('should handle Pikachu forme numbering', () => {
		assert.deepEqual(
			Dex.forGen(6).species.get('Pikachu').formeOrder.slice(0, 7),
			["Pikachu", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Cosplay"]
		);
		assert.deepEqual(
			Dex.forGen(7).species.get('Pikachu').formeOrder.slice(0, 9),
			["Pikachu", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter"]
		);
	});
});

describe('Dex#getItem', () => {
	it(`should correctly mark Gem legality`, () => {
		assert.false(Dex.forGen(5).items.get('Normal Gem').isNonstandard);
		assert.false(Dex.forGen(5).items.get('Rock Gem').isNonstandard);

		assert.false(Dex.forGen(6).items.get('Normal Gem').isNonstandard);
		assert.equal(Dex.forGen(6).items.get('Rock Gem').isNonstandard, "Unobtainable");

		assert.false(Dex.forGen(7).items.get('Normal Gem').isNonstandard);
		assert.equal(Dex.forGen(7).items.get('Rock Gem').isNonstandard, "Unobtainable");

		assert.false(Dex.forGen(8).items.get('Normal Gem').isNonstandard);
		assert.equal(Dex.forGen(8).items.get('Rock Gem').isNonstandard, "Past");
	});
});

describe('Dex#getMove', () => {
	it(`should correctly handle G-Max moves`, () => {
		assert.equal(Dex.forGen(8).moves.get('G-Max Befuddle').name, "G-Max Befuddle");
		assert.equal(Dex.forGen(8).moves.get('G-Max Befuddle').gen, 8);
		assert.equal(Dex.forGen(8).moves.get('G-Max Befuddle').isNonstandard, "Gigantamax");
	});
});
