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
		assert.sets(() => target.getStat('spe'), battle.modify(target.getStat('spe'), 0.5), () => battle.makeChoices('move bestow', 'move stealthrock'));
	});

	it('should negate Ground immunities and deal neutral type effectiveness to Flying-type Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', item: 'laggingtail', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Aerodactyl", ability: 'pressure', item: 'ironball', moves: ['stealthrock']},
			{species: "Tropius", ability: 'harvest', item: 'ironball', moves: ['leechseed']},
		]);
		battle.makeChoices('move earthquake', 'move stealthrock');
		// Earthquake neutral on Aerodactyl
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'switch leechseed');
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
		battle.makeChoices('move gravity', 'move stealthrock');

		battle.makeChoices('move earthquake', 'move stealthrock');
		// Earthquake supereffective on Aerodactyl
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'switch 2');
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
		battle.makeChoices('move earthquake', 'move rest');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'switch 2');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ground Pokemon that are airborne', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Thundurus", ability: 'prankster', item: 'ironball', moves: ['electricterrain']}]);
		battle.makeChoices('move spore', 'move electricterrain');
		assert.strictEqual(battle.p2.active[0].status, '');
	});
});
