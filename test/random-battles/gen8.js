/**
 * Tests for Gen 8 randomized formats
 */
'use strict';

const {testSet, testNotBothMoves, testHasSTAB, testAlwaysHasMove} = require('./tools');
const assert = require('../assert');

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
