'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Atermath', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should hurt attackers by 1/4 their max HP when this Pokemon is KOed by a contact move", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Voltorb', level: 1, item: 'rockyhelmet', ability: 'aftermath', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Nidoqueen', ability: 'sheerforce', moves: ['doublekick']},
		]});
		battle.makeChoices('auto', 'move doublekick');
		const queen = battle.p2.active[0];
		assert.strictEqual(queen.hp, queen.maxhp - Math.floor(queen.maxhp / 4) - Math.floor(queen.maxhp / 6));
	});
});
