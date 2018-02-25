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
			battle.makeChoices('move sleeptalk', 'move ' + i);
			assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		}
		// Thousand Arrows shouldn't add the Smack Down volatile if blocked by Wonder Guard
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move thousandarrows'));
	});

	it('should not make the user immune to status moves', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Abra", ability: 'wonderguard', moves: ['teleport']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'noguard', moves: ['poisongas', 'screech', 'healpulse', 'gastroacid']}]);
		const target = p1.active[0];
		battle.makeChoices('move teleport', 'move poisongas');
		assert.strictEqual(target.status, 'psn');
		battle.makeChoices('move teleport', 'move screech');
		assert.statStage(target, 'def', -2);
		assert.hurtsBy(target, -Math.floor(target.maxhp / 8), () => battle.makeChoices('move teleport', 'move healpulse'));
		battle.makeChoices('move teleport', 'move gastroacid');
		assert.ok(battle.p1.active[0].volatiles['gastroacid']);
		assert.false(battle.p1.active[0].hasAbility('wonderguard'));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zekrom", ability: 'wonderguard', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Reshiram", ability: 'turboblaze', moves: ['fusionflare']}]);
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move fusionflare'));
	});
});
