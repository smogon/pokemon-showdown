'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Miracle Eye', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should negate Psychic immunities`, () => {
		battle = common.createBattle([[
			{ species: 'Smeargle', moves: ['miracleeye', 'psychic'] },
		], [
			{ species: 'Darkrai', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move miracle eye', 'auto');
		battle.makeChoices('move psychic', 'auto');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should ignore the effect of positive evasion stat stages`, () => {
		battle = common.createBattle([[
			{ species: 'Smeargle', moves: ['tackle', 'miracleeye'] },
		], [
			{ species: 'Forretress', moves: ['sleeptalk'] },
		]]);

		const forretress = battle.p2.active[0];
		battle.makeChoices('move miracle eye', 'auto');
		battle.boost({ evasion: 6 }, forretress);
		battle.makeChoices('move tackle', 'auto');
		assert.false.fullHP(forretress);
	});

	it(`should not ignore the effect of negative evasion stat stages`, () => {
		battle = common.createBattle([[
			{ species: 'Smeargle', moves: ['zapcannon', 'miracleeye'] },
		], [
			{ species: 'Zapdos', moves: ['sleeptalk'] },
		]]);

		const zapdos = battle.p2.active[0];
		battle.makeChoices('move miracle eye', 'auto');
		battle.boost({ evasion: -6 }, battle.p2.active[0]);
		battle.makeChoices('move zap cannon', 'auto');
		assert.false.fullHP(zapdos);
	});
});
