var assert = require('assert');
var battle;

describe('Ingrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal the user by 1/16 of its max HP at the end of each turn', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Cradily', ability: 'stormdrain', moves: ['ingrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Miltank', ability: 'thickfat', moves: ['seismictoss']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp * 17 / 16) - 100);
	});

	it('should prevent the user from being forced out or switching out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cradily', ability: 'stormdrain', moves: ['ingrain']},
			{species: 'Pikachu', ability: 'static', moves: ['thunder']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arcanine', ability: 'flashfire', moves: ['roar']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].speciesid, 'cradily');
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].speciesid, 'cradily');
	});

	it('should remove the users\' Ground immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tropius', ability: 'harvest', moves: ['earthquake', 'ingrain']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Carnivine', ability: 'levitate', moves: ['earthquake', 'ingrain']}]);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
