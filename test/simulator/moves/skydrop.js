var assert = require('assert');
var battle;

describe('Sky Drop', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent its target from moving when it is caught by the effect', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lairon", ability: 'sturdy', moves: ['tackle']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should prevent its target from switching out when it is caught by the effect', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup']}
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'lairon');
	});

	it('should prevent both the user and the target from being forced out when caught by the effect', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-forceswitch', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Machamp", ability: 'noguard', moves: ['circlethrow']},
			{species: "Kabutops", ability: 'swiftswim', moves: ['shellsmash']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Armaldo", ability: 'battlearmor', moves: ['bulkup']},
			{species: "Aggron", ability: 'noguard', moves: ['dragontail']},
			{species: "Omastar", ability: 'swiftswim', moves: ['shellsmash']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1 1');
		battle.choose('p2', 'move 1 1, move 1 1');
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'aerodactyl');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'armaldo');
	});

	it('should prevent its target from using Mega Evolution when it is caught by the effect', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Manectric", ability: 'intimidate', item: 'manectite', moves: ['charge']}]);
		battle.commitDecisions();
		battle.choose('p2', 'move 1 mega');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'manectric');
	});

	it('should prevent its target from activating Stance Change when it is caught by the effect', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aegislash", ability: 'stancechange', moves: ['tackle', 'kingsshield']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislash');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislashblade');
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislashblade');
	});

	it('should free its target and allow it to move if the user faints', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-faint', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Kyogre", ability: 'noguard', moves: ['scald']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1 -1');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'skydrop');
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['def'], 1);
	});

	it('should pick up Flying-type Pokemon but do no damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Salamence", ability: 'intimidate', moves: ['tackle']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should fail if the target has a Substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['honeclaws', 'skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lairon", ability: 'sturdy', moves: ['substitute', 'tackle']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail if the target is heavier than 200kg', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aggron", ability: 'sturdy', moves: ['tackle']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail if used against an ally', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-ally', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Smeargle", ability: 'owntempo', moves: ['spore']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 -2, move 1 1');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should hit its target even if its position changed with Ally Switch', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-allyswitch', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Smeargle", ability: 'owntempo', moves: ['splash']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup', 'allyswitch']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 1, move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[1].template.speciesid, 'lairon');
		assert.notStrictEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should hit its target even if Follow Me is used that turn', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-followme', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Smeargle", ability: 'owntempo', moves: ['splash']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup', 'followme']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 1, move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		assert.strictEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should cause most moves aimed at the user or target to miss', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-miss', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Kabutops", ability: 'swiftswim', moves: ['aquajet']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Azumarill", ability: 'thickfat', moves: ['aquajet']}
		]);
		battle.on('Damage', battle.getFormat(), function (damage, target, source, effect) {
			// mod Sky Drop to deal no damage
			if (effect.id === 'skydrop') return 0;
		});
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1 2');
		battle.choose('p2', 'move 1, move 1 2');
		// Aerodactyl and Lairon are now airborne from Sky Drop
		battle.choose('p1', 'move 1 1, move 1 1');
		battle.choose('p2', 'move 1, move 1 1');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should be cancelled by Gravity and allow the target to use its move', function () {
		battle = BattleEngine.Battle.construct('battle-skydrop-gravity', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Jirachi", ability: 'serenegrace', moves: ['gravity']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 1, move 1');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['def'], 1);
	});
});

describe('Sky Drop [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not fail even if the target is heavier than 200kg', function () {
		battle = BattleEngine.Battle.construct('battle-bw-skydrop-heavy', 'gen5customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aggron", ability: 'sturdy', moves: ['tackle']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	describe.skip('Sky Drop Glitch', function () {
		beforeEach(function () {
			battle = BattleEngine.Battle.construct('battle-bw-skydrop-gravity', 'gen5doublescustomgame');
			battle.join('p1', 'Guest 1', 1, [
				{species: "Aerodactyl", ability: 'unnerve', moves: ['rockpolish', 'skydrop', 'dig']},
				{species: "Arceus", ability: 'multitype', moves: ['recover', 'gravity']},
				{species: "Aggron", ability: 'sturdy', moves: ['rest']}
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Magikarp", ability: 'owntempo', moves: ['sleeptalk', 'tackle']},
				{species: "Deoxys-Attack", ability: 'sturdy', moves: ['nastyplot', 'thunderbolt', 'roar']},
				{species: "Azurill", ability: 'thickfat', moves: ['watersport']}
			]);
			battle.commitDecisions(); // Team Preview
			battle.choose('p1', 'move 2 1, move 2');
			battle.commitDecisions();
			// Magikarp should now be stuck because of the Sky Drop glitch.
		});

		it('should prevent the target from moving or switching', function () {
			battle.choose('p2', 'move 2 2, move 1');
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
			battle.choose('p2', 'switch 3, move 1');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'magikarp');
		});

		it('should prevent the user from being forced out', function () {
			battle.choose('p2', 'move 1, move 3 1');
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].template.speciesid, 'aerodactyl');
		});

		it('should end when the user switches out', function () {
			battle.choose('p1', 'switch 3, move 1');
			battle.choose('p2', 'move 2 2, move 1');
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});

		it('should end when the user faints', function () {
			battle.choose('p2', 'move 2 2, move 2 1');
			battle.commitDecisions();
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});

		it('should end when the user completes another two-turn move', function () {
			battle.choose('p1', 'move 3 2, move 1');
			battle.commitDecisions();
			battle.choose('p2', 'move 2 2, move 1');
			battle.commitDecisions();
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});
	});
});
