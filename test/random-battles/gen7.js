/**
 * Tests for Gen 7 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testNotBothMoves, testSet, testHiddenPower} = require('./tools');

describe('[Gen 7] Random Battle', () => {
	const options = {format: 'gen7randombattle'};

	it('should not generate Calm Mind + Yawn', () => {
		testNotBothMoves('chimecho', options, 'calmmind', 'yawn');
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
});
