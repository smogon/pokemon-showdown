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
		testSet('weavile', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('knockoff'), `Weavile: got ${set.moves}`);
			}
		});

		testSet('mukalola', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('knockoff'), `Muk-Alola: got ${set.moves}`);
			}
		});

		testSet('honchkrow', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('suckerpunch'), `Honchkrow: got ${set.moves}`);
			}
		});

		testSet('tyranitar', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('crunch'), `Tyranitar: got ${set.moves}`);
			}
		});

		testSet('skuntank', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('crunch'), `Skuntank: got ${set.moves}`);
			}
		});

		testSet('spiritomb', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('darkpulse'), `Spiritomb: got ${set.moves}`);
			}
		});

		testSet('krookodile', options, set => {
			if (set.moves.includes('pursuit')) {
				assert(set.moves.includes('knockoff'), `Krookodile: got ${set.moves}`);
			}
		});
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
});
