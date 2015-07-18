var assert = require('assert');
var battle;

describe('Wonder Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make the user immune to damaging attacks that are not super effective', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'wonderguard', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['knockoff', 'flamethrower', 'thousandarrows', 'moonblast']}]);
		for (var i = 1; i <= 4; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		}
	});

	it('should not make the user immune to status moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Abra", ability: 'wonderguard', moves: ['teleport']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'noguard', moves: ['poisongas', 'screech', 'healpulse', 'gastroacid']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'psn');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['def'], -2);
		battle.choose('p2', 'move 3');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp / 8));
		battle.choose('p2', 'move 4');
		battle.commitDecisions();
		assert.ok(battle.p1.active[0].volatiles['gastroacid']);
		assert.ok(!battle.p1.active[0].hasAbility('wonderguard'));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zekrom", ability: 'wonderguard', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Reshiram", ability: 'turboblaze', moves: ['fusionflare']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
