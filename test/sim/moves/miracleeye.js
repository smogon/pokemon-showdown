'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Miracle Eye', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate Psychic immunities', function () {
		battle = common.createBattle({seed: [1, 2, 3, 4]}, [[
			{species: "Smeargle", moves: ['miracleeye', 'psychic']},
		], [
			{species: "Darkrai", moves: ['nastyplot']},
		]]);
		battle.makeChoices('move miracle eye', 'move nasty plot');
		battle.makeChoices('move psychic', 'move nasty plot');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore the effect of positive evasion stat stages', function () {
		battle = common.createBattle({seed: [1, 2, 3, 4]}, [[
			{species: "Smeargle", moves: ['avalanche', 'miracleeye']},
		], [
			{species: "Forretress", moves: ['synthesis']},
		]]);
		battle.makeChoices('move miracle eye', 'move synthesis');
		battle.boost({evasion: 6}, battle.p2.active[0]);
		for (let i = 0; i < 3; i++) {
			battle.makeChoices('move avalanche', 'move synthesis');
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});

	it('should not ignore the effect of negative evasion stat stages', function () {
		battle = common.createBattle({seed: [1, 2, 3, 4]}, [[
			{species: "Smeargle", moves: ['zapcannon', 'miracleeye']},
		], [
			{species: "Zapdos", moves: ['roost']},
		]]);
		battle.makeChoices('move miracle eye', 'move roost');
		battle.boost({spe: 6, evasion: -6}, battle.p2.active[0]);
		for (let i = 0; i < 3; i++) {
			battle.makeChoices('move zap cannon', 'move roost');
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});
});
