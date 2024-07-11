'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Psychic Noise', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent the target from healing, like Heal Block`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', ability: 'battlearmor', moves: ['softboiled', 'sleeptalk']},
		], [
			{species: 'Regieleki', moves: ['psychicnoise']},
		]]);
		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		assert.false.fullHP(wynaut);
		assert.cantMove(() => battle.choose('p1', 'move softboiled'));
	});

	it.skip(`should prevent the target's ally from healing it with Life Dew`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', ability: 'battlearmor', moves: ['sleeptalk']},
			{species: 'Blissey', ability: 'battlearmor', moves: ['lifedew']},
		], [
			{species: 'Regieleki', moves: ['psychicnoise']},
			{species: 'Mew', moves: ['watergun']},
		]]);
		const wynaut = battle.p1.active[0];
		const blissey = battle.p1.active[1];
		battle.makeChoices('auto', 'move psychicnoise 1, move watergun 2');
		assert.false.fullHP(wynaut, `Wynaut should not be healed, because it is affected by Psychic Noise`);
		assert.fullHP(blissey, `Blissey should be healed, because it is not affected by Psychic Noise`);
	});
});
