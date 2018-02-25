'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sky Drop', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent its target from moving when it is caught by the effect', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lairon", ability: 'sturdy', moves: ['tackle']}]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should prevent its target from switching out when it is caught by the effect', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lairon", ability: 'sturdy', moves: ['bulkup']},
			{species: "Aggron", ability: 'sturdy', moves: ['bulkup']},
		]);
		battle.makeChoices('move skydrop', 'move bulkup');
		battle.makeChoices('move skydrop', 'switch aggron');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'lairon');
	});

	it('should prevent both the user and the target from being forced out when caught by the effect', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']},
			{species: "Machamp", ability: 'noguard', moves: ['circlethrow']},
			{species: "Kabutops", ability: 'swiftswim', moves: ['shellsmash']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Armaldo", ability: 'battlearmor', moves: ['bulkup']},
			{species: "Aggron", ability: 'noguard', moves: ['dragontail']},
			{species: "Omastar", ability: 'swiftswim', moves: ['shellsmash']},
		]);
		battle.makeChoices('move skydrop 1, move circlethrow 1', 'move bulkup, move dragontail 1');
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'aerodactyl');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'armaldo');
	});

	it('should prevent its target from using Mega Evolution when it is caught by the effect', function () {
		battle = common.createBattle([
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}],
			[{species: "Manectric", ability: 'intimidate', item: 'manectite', moves: ['charge']}],
		]);
		battle.makeChoices('move skydrop', 'move charge');
		battle.makeChoices('move skydrop', 'move charge mega');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'manectric');
	});

	it('should prevent its target from activating Stance Change when it is caught by the effect', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aegislash", ability: 'stancechange', moves: ['tackle', 'kingsshield']}]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislash');
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislashblade');
		battle.makeChoices('move skydrop', 'move tackle');
		battle.makeChoices('move skydrop', 'move kingsshield');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'aegislashblade');
	});

	it('should free its target and allow it to move if the user faints', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Kyogre", ability: 'noguard', moves: ['scald']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Aggron", ability: 'sturdy', moves: ['bulkup']}],
		]);
		battle.makeChoices('move skydrop 1, move scald -1', 'move bulkup, move bulkup');
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['def'], 1);
	});

	it('should pick up Flying-type Pokemon but do no damage', function () {
		battle = common.createBattle([
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}],
			[{species: "Salamence", ability: 'intimidate', moves: ['tackle']}],
		]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should only make contact on the way down', function () {
		battle = common.createBattle([[
			{species: "Aerodactyl", moves: ['skydrop']},
		], [
			{species: "Aegislash", moves: ['kingsshield']},
			{species: "Ferrothorn", ability: 'ironbarbs', moves: ['harden']},
		]]);
		battle.makeChoices('move Sky Drop', 'move Kings Shield');
		assert.strictEqual(battle.p1.active[0].boosts.atk, 0);
		battle.makeChoices('move Sky Drop', 'switch Ferrothorn');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.makeChoices('move Sky Drop', 'move Harden');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail if the target has a Substitute', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['honeclaws', 'skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lairon", ability: 'sturdy', moves: ['substitute', 'tackle']}]);
		battle.makeChoices('move honeclaws', 'move substitute');
		battle.makeChoices('move skydrop', 'move tackle');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail if the target is heavier than 200kg', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aggron", ability: 'sturdy', moves: ['tackle']}]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should fail if used against an ally', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Smeargle", ability: 'owntempo', moves: ['spore']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Aggron", ability: 'sturdy', moves: ['bulkup']}],
		]);
		battle.makeChoices('move skydrop -2, move spore 1', 'move bulkup, move bulkup');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should hit its target even if its position changed with Ally Switch', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Smeargle", ability: 'owntempo', moves: ['splash']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Aggron", ability: 'sturdy', moves: ['bulkup', 'allyswitch']}],
		]);
		battle.makeChoices('move skydrop 1, move splash', 'move bulkup, move bulkup');
		battle.makeChoices('move skydrop, move splash', 'move bulkup, move allyswitch');
		assert.strictEqual(battle.p2.active[1].template.speciesid, 'lairon');
		assert.notStrictEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should hit its target even if Follow Me is used that turn', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Smeargle", ability: 'owntempo', moves: ['splash']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Aggron", ability: 'sturdy', moves: ['bulkup', 'followme']}],
		]);
		battle.makeChoices('move skydrop 1, move splash', 'move bulkup move bulkup');
		battle.makeChoices('move skydrop, move splash', 'move bulkup, move followme');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		assert.strictEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
	});

	it('should cause most moves aimed at the user or target to miss', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Kabutops", ability: 'swiftswim', moves: ['aquajet']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Azumarill", ability: 'thickfat', moves: ['aquajet']}],
		]);
		battle.onEvent('Damage', battle.getFormat(), function (damage, target, source, effect) {
			// mod Sky Drop to deal no damage
			if (effect.id === 'skydrop') return 0;
		});
		battle.makeChoices('move skydrop 1, move aquajet 2', 'move bulkup, move aquajet 2');
		// Aerodactyl and Lairon are now airborne from Sky Drop
		battle.makeChoices('move skydrop 1, move aquajet 1', 'move bulkup, move aquajet 1');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should be cancelled by Gravity and allow the target to use its move', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}, {species: "Jirachi", ability: 'serenegrace', moves: ['gravity']}],
			[{species: "Lairon", ability: 'sturdy', moves: ['bulkup']}, {species: "Aggron", ability: 'sturdy', moves: ['bulkup']}],
		]);
		battle.makeChoices('move skydrop 1, move gravity', 'move bulkup, move bulkup');
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['def'], 1);
	});
});

describe('Sky Drop [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not fail even if the target is heavier than 200kg', function () {
		battle = common.gen(5).createBattle([
			[{species: "Aerodactyl", ability: 'unnerve', moves: ['skydrop']}],
			[{species: "Aggron", ability: 'sturdy', moves: ['tackle']}],
		]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	describe.skip('Sky Drop Glitch', function () {
		beforeEach(function () {
			battle = common.gen(5).createBattle({gameType: 'doubles'});
			battle.join('p1', 'Guest 1', 1, [
				{species: "Aerodactyl", ability: 'unnerve', moves: ['rockpolish', 'skydrop', 'dig']},
				{species: "Arceus", ability: 'multitype', moves: ['recover', 'gravity']},
				{species: "Aggron", ability: 'sturdy', moves: ['rest']},
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Magikarp", ability: 'owntempo', moves: ['sleeptalk', 'tackle']},
				{species: "Deoxys-Attack", ability: 'sturdy', moves: ['nastyplot', 'thunderbolt', 'roar']},
				{species: "Azurill", ability: 'thickfat', moves: ['watersport']},
			]);
			console.log('-------------------------------');
			battle.makeChoices('move skydrop 1, move gravity', 'move sleeptalk, move nastyplot');
			// Magikarp should now be stuck because of the Sky Drop glitch.
		});

		it('should prevent the target from moving or switching', function () {
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move nastyplot');
			assert.strictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
			battle.makeChoices('move rockpolish, move recover', 'switch azurill, move nastyplot');
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'magikarp');
		});

		it('should prevent the user from being forced out', function () {
			battle.makeChoices('move rockpolish, move recover', 'move sleeptalk, move roar 1');
			assert.strictEqual(battle.p1.active[0].template.speciesid, 'aerodactyl');
		});

		it('should end when the user switches out', function () {
			battle.makeChoices('switch 3, move rockpolish', 'move tackle 2, move nastyplot');
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});

		it('should end when the user faints', function () {
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move thunderbolt 1');
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});

		it('should end when the user completes another two-turn move', function () {
			battle.makeChoices('move dig 2, move recover', 'move sleeptalk, move nastyplot');
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move nastyplot');
			assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
		});
	});
});
