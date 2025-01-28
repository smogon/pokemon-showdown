'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Hospitality', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate after hazards', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'snom', level: 1, ability: 'noguard', moves: ['sleeptalk']},
			{species: 'snom', level: 1, ability: 'noguard', moves: ['sleeptalk']},
			{species: 'deerling', moves: ['sleeptalk']},
			{species: 'sinistcha', ability: 'hospitality', moves: ['sleeptalk']},
		], [
			{species: 'kleavor', moves: ['stoneaxe']},
			{species: 'kleavor', moves: ['stoneaxe']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 3, switch 4');
		assert.fullHP(battle.p1.pokemon[0].status);
	});
});
