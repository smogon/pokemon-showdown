/**
 * Tests for Gen 7 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testNotBothMoves, testSet, testHiddenPower, testAlwaysHasMove} = require('./tools');

describe('[Gen 7] Random Battle', () => {
	const options = {format: 'gen7randombattle'};
	const dataJSON = require(`../../dist/data/mods/gen7/random-data.json`);
	const dex = Dex.forFormat(options.format);
	const generator = Teams.getGenerator(options.format);

	it('All moves on all sets should be obtainable (slow)', () => {
		const rounds = 500;
		for (const pokemon of Object.keys(dataJSON)) {
			const species = dex.species.get(pokemon);
			const data = dataJSON[pokemon];
			if (!data.moves || species.isNonstandard) continue;
			const remainingMoves = new Set(data.moves);
			for (let i = 0; i < rounds; i++) {
				// Test lead 1/6 of the time
				const set = generator.randomSet(species, {}, i % 6 === 0);
				for (const move of set.moves) remainingMoves.delete(move);
				if (!remainingMoves.size) break;
			}
			assert.false(remainingMoves.size,
				`The following moves on ${species.name} are unused: ${[...remainingMoves].join(', ')}`);
		}
	});

	it('should not generate Calm Mind + Yawn', () => {
		testNotBothMoves('chimecho', options, 'calmmind', 'yawn');
	});

	it('should give Azumarill Aqua Jet', () => {
		testSet('azumarill', options, set => {
			assert(set.moves.includes('aquajet'), `Azumarill: got ${set.moves}`);
		});
	});

	it('should give Typhlosion Eruption', () => {
		testSet('typhlosion', options, set => {
			assert(set.moves.includes('eruption'), `Typhlosion: got ${set.moves}`);
		});
	});

	it('should not generate Pursuit as the only Dark STAB move', () => {
		const darkTypesWithPursuit = Object.keys(dataJSON)
			.filter(pkmn => dex.species.get(pkmn).types.includes('Dark') && dataJSON[pkmn].moves?.includes('pursuit'));
		for (const pokemon of darkTypesWithPursuit) {
			testSet(pokemon, options, set => {
				if (!set.moves.includes('pursuit')) return;
				const darkStab = set.moves.filter(m => {
					const move = dex.moves.get(m);
					if (move.type !== 'Dark') return false;
					return move.category !== 'Status';
				});
				assert(darkStab.length > 1, `${pokemon}: got ${set.moves}`);
			});
		}
	});

	it('should not generate Roar + Protect', () => {
		testNotBothMoves('heatran', options, 'roar', 'protect');
		testNotBothMoves('vaporeon', options, 'roar', 'protect');
		testNotBothMoves('walrein', options, 'roar', 'protect');
		testNotBothMoves('bastiodon', options, 'roar', 'protect');
	});

	it('should not generate Dragon Tail as the only STAB move', () => {
		// Mono-Dragon Pokémon chosen as test dummies for simplicity
		testSet('druddigon', options, set => {
			if (set.moves.includes('dragontail')) {
				assert(set.moves.includes('outrage'), `Druddigon: got ${set.moves}`);
			}
		});

		testSet('goodra', options, set => {
			if (set.moves.includes('dragontail')) {
				assert(set.moves.includes('dracometeor') || set.moves.includes('dragonpulse'), `Goodra: got ${set.moves}`);
			}
		});
	});

	it('should not generate Swords Dance + Ice Beam', () => {
		testNotBothMoves('arceusground', options, 'swordsdance', 'icebeam');
	});

	it('should prevent double Hidden Power', () => testHiddenPower('thundurustherian', options));

	it('should give Meganium STAB', () => {
		testSet('meganium', options, set => {
			assert(set.moves.includes('gigadrain'), `Meganium: got ${set.moves}`);
		});
	});

	it('should never give Xerneas Assault Vest', () => {
		testSet('xerneas', options, set => assert.notEqual(set.item, 'Assault Vest'));
	});

	it('should always give Gastrodon Recover', () => {
		testAlwaysHasMove('gastrodon', options, 'recover');
	});

	it('should never give Poliwrath both Rain Dance and Rest', () => {
		testNotBothMoves('poliwrath', options, 'raindance', 'rest');
	});

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});

	it('should always give Mega Glalie Return', () => testAlwaysHasMove('glaliemega', options, 'return'));

	it('should not give Zebstrika Thunderbolt and Wild Charge', () => {
		testNotBothMoves('zebstrika', options, 'thunderbolt', 'wildcharge');
	});

	it('should always give Mega Diancie Moonblast if it has Calm Mind', () => {
		testSet('dianciemega', options, set => {
			if (!set.moves.includes('calmmind')) return;
			assert(set.moves.includes('moonblast'), `Diancie: got ${set.moves}`);
		});
	});
});

describe('[Gen 7] Random Doubles Battle', () => {
	const options = {format: 'gen7randomdoublesbattle'};

	it("shouldn't give Manectric Intimidate before Mega Evolving", () => {
		testSet('manectricmega', options, set => {
			assert.notEqual(set.ability, 'Intimidate');
		});
	});

	it("should give Mawile Intimidate before Mega Evolving", () => {
		testSet('mawilemega', options, set => {
			assert.equal(set.ability, 'Intimidate');
		});
	});
});
