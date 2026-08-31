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
		assert.equal(Dex.forGen(8).moves.get('G-Max Befuddle').isMax, "Butterfree");
	});
});

describe('DexText#get', () => {
	it(`should translate species, items, abilities, and moves`, () => {
		assert.equal(Dex.text.get(Dex.species.get('Pikachu'), 'ja').name, 'ピカチュウ');
		assert.equal(Dex.text.get(Dex.items.get('Leftovers'), 'ja').name, 'たべのこし');
		assert.equal(Dex.text.get(Dex.abilities.get('Levitate'), 'ja').name, 'ふゆう');
		assert.equal(Dex.text.get(Dex.moves.get('Tackle'), 'ja').name, 'たいあたり');
	});

	it(`should return the entire text entry`, () => {
		assert.equal(
			Dex.text.get(Dex.moves.get('Absorb')).gen4.desc,
			'The user recovers 1/2 the HP lost by the target, rounded down. If Big Root is held by the user, ' +
			'the HP recovered is 1.3x normal, rounded down.'
		);
	});

	it(`should fall back to English text data`, () => {
		// TODO: Revise as text is translated
		const move = Dex.moves.get('Tackle');
		const text = Dex.text.get(move, 'ja');
		assert.equal(text.desc, 'No additional effect.');
		assert.equal(text.shortDesc, 'No additional effect.');
		assert.deepEqual(Dex.text.get(move), {
			name: 'Tackle',
			desc: 'No additional effect.',
			shortDesc: 'No additional effect.',
		});
		assert.equal(Dex.loadTextData('ja').Moves.tackle.shortDesc, 'No additional effect.');
	});

	it(`should allow localized text files to be omitted`, () => {
		const afd = Dex.loadTextData('en-afd');
		assert.equal(afd.Moves.tackle.name, 'Tackle');
		assert.equal(afd.Default.default.mega, "  [POKEMON]'s [ITEM] glows!");
	});

	it(`should keep long and short description fallbacks separate`, () => {
		const text = Dex.text.get(Dex.moves.get('Close Combat'), 'ja');
		assert.notEqual(text.desc, text.shortDesc);
	});

	it(`should not use a current-generation translation for an old-generation description`, () => {
		const dex = Dex.forGen(4);
		const move = dex.moves.get('Brick Break');
		const desc = 'If this attack does not miss and whether or not the target is immune, the effects of Reflect and ' +
			'Light Screen end for the target\'s side of the field before damage is calculated.';
		assert.equal(dex.loadTextData('ja').Moves.brickbreak.desc, desc);
		assert.equal(dex.text.get(move, 'ja').desc, desc);
	});

	it(`should use English-only descriptions defined by mods`, () => {
		const dex = Dex.mod('afd');
		const ability = dex.abilities.get('Chaos Saliva');
		const text = dex.text.get(ability, 'ja');
		assert.deepEqual(text, {
			name: 'Chaos Saliva',
			desc: "Contact moves have a 20% chance to paralyze and a 20% chance to confuse.",
			shortDesc: "Contact moves have a 20% chance to paralyze and a 20% chance to confuse.",
		});
	});
});

describe('Dex#isTagged', () => {
	it(`should check species, move, and generic tags`, () => {
		assert(Dex.isTagged(Dex.species.get('Mew'), 'Mythical'));
		assert(Dex.isTagged(Dex.species.get('Charizard-Gmax'), 'Gigantamax'));
		assert(Dex.isTagged(Dex.moves.get('Tackle'), 'Contact'));
		assert(Dex.isTagged(Dex.moves.get('Shadow Strike'), 'CAP'));
		assert(Dex.isTagged(Dex.moves.get('Light of Ruin'), 'Past Unobtainable'));
		assert(Dex.isTagged(Dex.items.get('Berserk Gene'), 'True Past'));

		assert.false(Dex.isTagged(Dex.species.get('Charizard'), 'Gigantamax'));
		assert.false(Dex.isTagged(Dex.moves.get('Confusion'), 'Contact'));
		assert.false(Dex.isTagged(Dex.abilities.get('Pressure'), 'Mythical'));
		assert.false(Dex.isTagged(Dex.species.get('Pikachu'), 'definitely not a real tag'));
	});
});

describe('DexTypes#isName', () => {
	it('should return true for valid type names', () => {
		assert.equal(Dex.types.isName('Fire'), true);
		assert.equal(Dex.types.isName('Water'), true);
		assert.equal(Dex.types.isName('Psychic'), true);
		assert.equal(Dex.types.isName('Fighting'), true);
		assert.equal(Dex.types.isName('Normal'), true);
	});

	it('should return false for invalid type names', () => {
		assert.equal(Dex.types.isName('fire'), false);
		assert.equal(Dex.types.isName('FIRE'), false);
		assert.equal(Dex.types.isName('Unknown'), false);
		assert.equal(Dex.types.isName(''), false);
	});

	it('should return false for null and undefined', () => {
		assert.equal(Dex.types.isName(undefined), false);
		assert.equal(Dex.types.isName(null), false);
	});
});
