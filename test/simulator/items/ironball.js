'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Iron Ball', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce halve the holder\'s speed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', item: 'ironball', moves: ['bestow']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aerodactyl", ability: 'pressure', moves: ['stealthrock']}]);
		const target = battle.p2.active[0];
		assert.sets(() => target.getStat('spe'), battle.modify(target.getStat('spe'), 0.5), () => battle.commitDecisions());
	});

	it('should negate Ground immunities and deal neutral type effectiveness to Flying-type Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Aerodactyl", ability: 'pressure', item: 'ironball', moves: ['stealthrock']},
			{species: "Tropius", ability: 'harvest', item: 'ironball', moves: ['leechseed']},
		]);
		battle.commitDecisions();
		// Earthquake neutral on Aerodactyl
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		// Earthquake neutral on Tropius
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not deal neutral type effectiveness to Flying-type Pokemon in Gravity', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['earthquake', 'gravity']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Aerodactyl", ability: 'shellarmor', item: 'ironball', moves: ['stealthrock']},
			{species: "Tropius", ability: 'shellarmor', item: 'ironball', moves: ['leechseed']},
		]);
		// Set up Gravity
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 1');

		battle.commitDecisions();
		// Earthquake supereffective on Aerodactyl
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.p2.chooseSwitch(2).foe.chooseDefault();
		// Earthquake not very effective on Tropius
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should negate artificial Ground immunities and deal normal type effectiveness', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Rotom", ability: 'levitate', item: 'ironball', moves: ['rest']},
			{species: "Parasect", ability: 'levitate', item: 'ironball', moves: ['rest']},
		]);
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.p2.chooseSwitch(2).foe.chooseDefault();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ground Pokemon that are airborne', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Thundurus", ability: 'prankster', item: 'ironball', moves: ['electricterrain']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});
});
