/**
 * Tests for Gen 8 randomized formats
 */
'use strict';

const {testSet, testNotBothMoves, testHasSTAB, testAlwaysHasMove} = require('./tools');
const assert = require('../assert');
const {Dex} = require('../../.sim-dist/dex');

describe('[Gen 8] Random Battle', () => {
	const options = {format: 'gen8randombattle'};

	it('should not generate Golisopod without Bug STAB', () => {
		testSet('golisopod', options, set => {
			assert(set.moves.some(m => {
				const move = Dex.moves.get(m);
				return move.type === 'Bug' && move.category !== 'Status';
			}), `Golisopod should get Bug STAB (got ${set.moves})`);
		});
	});

	it('should not generate Swords Dance + Fire Blast Garchomp', () => {
		testNotBothMoves('garchomp', options, 'swordsdance', 'fireblast');
	});

	it('should give Solid Rock + Shell Smash Carracosta a Weakness Policy', () => {
		testSet('carracosta', options, set => {
			if (set.moves.includes('shellsmash') && set.ability === 'Solid Rock') {
				assert.equal(set.item, "Weakness Policy");
			}
		});
	});

	it('should not generate 3-attack Alcremie-Gmax', () => {
		testSet('alcremiegmax', options, set => assert(
			!['psychic', 'dazzlinggleam', 'mysticalfire'].every(move => set.moves.includes(move)),
			`Alcremie-Gmax should not get three attacks (got ${set.moves})`
		));
	});

	it('should always give Doublade Swords Dance', () => {
		testAlwaysHasMove('doublade', options, 'swordsdance');
	});

	it('Dragonite and Salamence should always get Outrage', () => {
		for (const pkmn of ['dragonite', 'salamence']) {
			testAlwaysHasMove(pkmn, options, 'outrage');
		}
	});

	it('should give Sticky Web Pokémon Sticky Web unless they have setup', () => {
		for (const pkmn of ['shuckle', 'orbeetle', 'araquanid']) {
			testSet(pkmn, options, set => {
				if (set.moves.some(move => Dex.moves.get(move).boosts)) return; // Setup
				assert(
					set.moves.includes('stickyweb'),
					`${pkmn} should always generate Sticky Web (generated moveset: ${set.moves})`
				);
			});
		}
	});

	it('should give Throat Spray to Shift Gear Toxtricity sets', () => {
		testSet('toxtricity', options, set => {
			if (!set.moves.includes('shiftgear')) return;
			assert.equal(set.item, "Throat Spray", `got ${set.item} instead of Throat Spray`);
		});
	});

	it('Toxapex should always have Scald', () => testAlwaysHasMove('toxapex', options, 'scald'));

	it('Shiinotic should always have Moonblast', () => testAlwaysHasMove('shiinotic', options, 'moonblast'));

	it('should prevent Dragon Dance and Extreme Speed from appearing together', () => {
		testNotBothMoves('dragonite', options, 'dragondance', 'extremespeed');
	});

	it('Rapidash with Swords Dance should have at least two attacks', () => {
		const dex = Dex.forFormat(options.format);
		testSet('rapidash', options, set => {
			if (!set.moves.includes('swordsdance')) return;
			assert(set.moves.filter(m => dex.moves.get(m).category !== 'Status').length > 1, `got ${JSON.stringify(set.moves)}`);
		});
	});

	it('Celesteela should not get Leech Seed or Protect on Autotomize sets', () => {
		testNotBothMoves('celesteela', options, 'leechseed', 'autotomize');
		testNotBothMoves('celesteela', options, 'protect', 'autotomize');
	});

	it('Landorus-Therian should not get Fly and Stealth Rock on the same set', () => {
		testNotBothMoves('landorustherian', options, 'fly', 'stealthrock');
	});
});

describe('[Gen 8] Random Doubles Battle', () => {
	const options = {format: 'gen8randomdoublesbattle'};

	it('should never generate Melmetal without Body Press', () => {
		testSet('melmetal', options, set => {
			assert(set.moves.includes('bodypress'), `Melmetal should get Body Press (got ${set.moves})`);
		});
	});

	it('should enforce STAB on Pinsir, Pikachu, and Zygarde', () => {
		for (const pkmn of ['pinsir', 'pikachu', 'zygarde']) {
			testHasSTAB(pkmn, options);
		}
	});

	it('should give Galarian Darmanitan a Choice Item', () => {
		testSet('darmanitangalar', options, set => assert(set.item.startsWith('Choice ')));
	});
});

describe('[Gen 8] Random Battle (No Dmax)', () => {
	// No tests here yet!
	// This format is extremely new; this will be filled in later when I have to fix No Dmax bugs.

	// const options = {format: 'gen8randombattlenodmax', isDynamax: true};
});

describe('[Gen 8] Free-for-All Random Battle', () => {
	const options = {format: 'gen8freeforallrandombattle', isDoubles: true};

	it('should enforce STAB on Pinsir, Pikachu, and Zygarde', () => {
		for (const pkmn of ['pinsir', 'pikachu', 'zygarde']) {
			testHasSTAB(pkmn, options);
		}
	});
});
