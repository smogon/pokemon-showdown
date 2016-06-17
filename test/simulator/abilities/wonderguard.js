'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Wonder Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make the user immune to damaging attacks that are not super effective', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'wonderguard', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['knockoff', 'flamethrower', 'thousandarrows', 'moonblast']}]);
		for (let i = 1; i <= 4; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		}
		// Thousand Arrows shouldn't add the Smack Down volatile if blocked by Wonder Guard
		battle.p2.chooseMove('thousandarrows');
		assert.false.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should not make the user immune to status moves', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Abra", ability: 'wonderguard', moves: ['teleport']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'noguard', moves: ['poisongas', 'screech', 'healpulse', 'gastroacid']}]);
		const target = p1.active[0];
		battle.commitDecisions();
		assert.strictEqual(target.status, 'psn');
		p2.chooseMove(2).foe.chooseDefault();
		assert.statStage(target, 'def', -2);
		p2.chooseMove('healpulse');
		assert.hurtsBy(target, -Math.floor(target.maxhp / 8), () => battle.commitDecisions());
		p2.chooseMove('gastroacid').foe.chooseDefault();
		assert.ok(battle.p1.active[0].volatiles['gastroacid']);
		assert.false(battle.p1.active[0].hasAbility('wonderguard'));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zekrom", ability: 'wonderguard', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Reshiram", ability: 'turboblaze', moves: ['fusionflare']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});
});
