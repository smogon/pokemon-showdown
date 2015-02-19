var assert = require('assert');
var battle;

describe('Roost', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should fail if the user is at max HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Clefable", item: 'leftovers', ability: 'unaware', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", item: 'laggingtail', ability: 'multiscale', moves: ['roost']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.log[battle.lastMoveLine + 1], '|-fail|' + battle.p2.active[0]);
	});

	it('should heal the user', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Clefable", ability: 'unaware', moves: ['calmmind', 'hiddenpowergrass']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['roost', 'dragondance']}]);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should suppress user\'s current Flying type if succesful', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aggron", item: 'leftovers', ability: 'sturdy', moves: ['mudslap', 'hiddenpowergrass']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aerodactyl", item: 'focussash', ability: 'wonderguard', moves: ['roost', 'doubleedge']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Immune to Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.choose('p2', 'move 2');
		battle.commitDecisions();

		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.choose('p2', 'move 2');
		battle.commitDecisions();

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by HP Grass
	});

	it('should suppress Flying type yet to be acquired this turn', function () {
		battle = BattleEngine.Battle.construct('battle-roost-latency', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Pidgeot", item: 'laggingtail', ability: 'victorystar', moves: ['aircutter']},
			{species: "Gligar", item: 'laggingtail', ability: 'immunity', moves: ['earthquake']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kecleon", ability: 'colorchange', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['earthquake']}
		]);
		battle.commitDecisions();

		var hitCount = 0;
		battle.p2.active[0].damage = function () {
			hitCount++;
			return BattleEngine.BattlePokemon.prototype.damage.apply(this, arguments);
		};

		battle.commitDecisions();
		assert.strictEqual(hitCount, 3);
	});

	it('should treat a pure Flying pokémon as Normal type', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Tornadus", item: 'focussash', ability: 'prankster', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gastly", item: 'laggingtail', ability: 'levitate', moves: ['astonish']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Immune to Astonish
	});
});

describe('Roost - DPP', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should treat a pure Flying pokémon as `???` type', function () {
		battle = BattleEngine.Battle.construct('battle-roost-dpp', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Arceus-Flying", item: 'skyplate', ability: 'multitype', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gastly", item: 'laggingtail', ability: 'levitate', moves: ['astonish', 'earthpower']}]);

		battle.commitDecisions();
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Astonish

		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Earth Power
	});
});
