'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Miracle Eye', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should negate Psychic immunities`, function () {
		battle = common.createBattle([[
			{species: 'Smeargle', moves: ['miracleeye', 'psychic']},
		], [
			{species: 'Darkrai', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move miracle eye', 'auto');
		battle.makeChoices('move psychic', 'auto');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should ignore the effect of positive evasion stat stages`, function () {
		battle = common.createBattle([[
			{species: 'Smeargle', moves: ['tackle', 'miracleeye']},
		], [
			{species: 'Forretress', moves: ['sleeptalk']},
		]]);

		battle.onEvent('Accuracy', battle.format, function (accuracy, target, source, move) {
			if (move.id === 'tackle') {
				assert.equal(accuracy, 100, `Miracle Eye should ignore positive evasion boosts`);
			}
		});

		const forretress = battle.p2.active[0];
		battle.makeChoices('move miracle eye', 'auto');
		battle.boost({evasion: 6}, forretress);
		battle.makeChoices('move tackle', 'auto');
		assert.false.fullHP(forretress);
	});

	it(`should not ignore the effect of negative evasion stat stages`, function () {
		battle = common.createBattle([[
			{species: 'Smeargle', moves: ['zapcannon', 'miracleeye']},
		], [
			{species: 'Zapdos', moves: ['sleeptalk']},
		]]);

		battle.onEvent('Accuracy', battle.format, function (accuracy, target, source, move) {
			if (move.id === 'zapcannon') {
				assert(accuracy >= 100, `Miracle Eye should not ignore negative evasion drops`);
			}
		});

		const zapdos = battle.p2.active[0];
		battle.makeChoices('move miracle eye', 'auto');
		battle.boost({evasion: -6}, battle.p2.active[0]);
		battle.makeChoices('move zap cannon', 'auto');
		assert.false.fullHP(zapdos);
	});
});
