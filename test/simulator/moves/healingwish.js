'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Healing Wish', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal a switch-in for full', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Pikachu', ability: 'static', moves: ['growl']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Miltank', ability: 'thickfat', moves: ['seismictoss']},
		]);

		battle.commitDecisions(); // Pikachu takes damage

		battle.choose('p1', 'switch 2');
		battle.commitDecisions(); // Jirachi switches in

		battle.commitDecisions(); // Jirachi uses Healing Wish

		battle.commitDecisions(); // Pikachu switches in and fully heals

		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p1.active[0].moveset[0].pp, 63);
	});

	it('[Gen 4] should heal a switch-in for full', function () {
		battle = common.gen(4).createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Pikachu', ability: 'static', moves: ['growl']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Miltank', ability: 'thickfat', moves: ['seismictoss']},
		]);

		battle.commitDecisions(); // Pikachu takes damage

		battle.choose('p1', 'switch 2');
		battle.commitDecisions(); // Jirachi switches in

		battle.commitDecisions(); // Jirachi uses Healing Wish
		battle.commitDecisions(); // Pikachu switches in and fully heals

		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p1.active[0].moveset[0].pp, 63);
	});
});
