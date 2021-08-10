'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sky Drop', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent its target from moving when it is caught by the effect`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Lairon', moves: ['tackle']},
		]]);

		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		assert.fullHP(aerodactyl);
		battle.makeChoices();
		assert.false.fullHP(aerodactyl);
	});

	it(`should prevent its target from switching out when it is caught by the effect`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Lairon', moves: ['tackle']},
			{species: 'Aggron', moves: ['tackle']},
		]]);

		battle.makeChoices();
		assert.trapped(() => battle.makeChoices('auto', 'switch aggron'));
	});

	it(`should prevent both the user and the target from being forced out when caught by the effect`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Machamp', ability: 'noguard', moves: ['circlethrow']},
			{species: 'Kabutops', moves: ['sleeptalk']},
		], [
			{species: 'Armaldo', moves: ['sleeptalk']},
			{species: 'Aggron', ability: 'noguard', moves: ['dragontail']},
			{species: 'Omastar', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move skydrop 1, move circlethrow 1', 'move sleeptalk, move dragontail 1');
		assert.species(battle.p1.active[0], 'Aerodactyl');
		assert.species(battle.p2.active[0], 'Armaldo');
	});

	it(`should prevent both the user and the target from being forced out by Eject Button`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', item: 'ejectbutton', moves: ['skydrop']},
			{species: 'Machamp', ability: 'noguard', moves: ['tackle']},
			{species: 'Kabutops', moves: ['sleeptalk']},
		], [
			{species: 'Armaldo', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Aggron', ability: 'noguard', moves: ['watergun']},
			{species: 'Omastar', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move skydrop 1, move tackle 1', 'move sleeptalk, move watergun 1');
		assert.holdsItem(battle.p1.active[0]);
		assert.holdsItem(battle.p2.active[0]);
	});

	it(`should prevent its target from using Mega Evolution when it is caught by the effect`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Manectric', item: 'manectite', moves: ['charge']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move charge mega');
		assert.false.species(battle.p2.active[0], 'Manectric-Mega');
	});

	it(`should prevent its target from activating Stance Change when it is caught by the effect`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Aegislash', ability: 'stancechange', moves: ['tackle', 'kingsshield']},
		]]);

		const aegi = battle.p2.active[0];
		battle.makeChoices();
		assert.species(aegi, 'Aegislash');
		battle.makeChoices();
		assert.species(aegi, 'Aegislash-Blade');
		battle.makeChoices();
		battle.makeChoices('auto', 'move kingsshield');
		assert.species(aegi, 'Aegislash-Blade');
	});

	it(`should free its target and allow it to move if the user faints`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Kyogre', ability: 'noguard', moves: ['sheercold']},
		], [
			{species: 'Lairon', moves: ['swordsdance']},
			{species: 'Aggron', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move skydrop 1, move sheercold -1', 'auto');
		const lairon = battle.p2.active[0];
		assert.statStage(lairon, 'atk', 2);
	});

	it(`should pick up Flying-type Pokemon but do no damage`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Salamence', moves: ['tackle']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices('move skydrop', 'move tackle');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should pick up non-Flying weak Wonder Guard Pokemon but do no damage`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Shuckle', ability: 'wonderguard', moves: ['tackle']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
		battle.makeChoices('auto', 'switch 2');
		const shedinja = battle.p2.active[0];
		assert.hurts(shedinja, () => battle.makeChoices());
	});

	it(`should only make contact on the way down`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Aegislash', moves: ['kingsshield']},
			{species: 'Ferrothorn', ability: 'ironbarbs', moves: ['sleeptalk']},
		]]);
		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		assert.statStage(aerodactyl, 'atk', 0);
		battle.makeChoices('auto', 'switch 2');
		assert.fullHP(aerodactyl);
		battle.makeChoices();
		assert.false.fullHP(aerodactyl);
	});

	it(`should fail if the target has a Substitute`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['sleeptalk', 'skydrop']},
		], [
			{species: 'Lairon', moves: ['substitute', 'tackle']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move skydrop', 'move tackle');
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`should fail if the target is heavier than 200kg`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Aggron', moves: ['tackle']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`should fail if used against an ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Smeargle', moves: ['spore']},
		], [
			{species: 'Lairon', moves: ['sleeptalk']},
			{species: 'Aggron', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move skydrop -2, move spore 1', 'auto');
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it(`should hit its picked-up target even if its position changed with Ally Switch`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Smeargle', moves: ['sleeptalk']},
		], [
			{species: 'Lairon', moves: ['sleeptalk']},
			{species: 'Aggron', moves: ['sleeptalk', 'allyswitch']},
		]]);
		battle.makeChoices('move skydrop 1, move sleeptalk', 'auto');
		battle.makeChoices('move skydrop 1, move sleeptalk', 'move sleeptalk, move allyswitch');
		const lairon = battle.p2.active[1];
		assert.species(lairon, 'Lairon');
		assert.false.fullHP(lairon);
	});

	it(`should hit its target even if Follow Me would have otherwise redirected it`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Smeargle', moves: ['sleeptalk']},
		], [
			{species: 'Lairon', moves: ['sleeptalk']},
			{species: 'Clamperl', moves: ['followme']},
		]]);

		battle.makeChoices('move skydrop 1, move sleeptalk', 'auto');
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[1]);
	});

	it(`should cause most moves aimed at the user or target to miss`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Kabutops', moves: ['sleeptalk', 'aquajet']},
		], [
			{species: 'Charizard', moves: ['sleeptalk']},
			{species: 'Azumarill', moves: ['sleeptalk', 'aquajet']},
		]]);

		battle.makeChoices('move skydrop 1, move sleeptalk', 'auto');
		battle.makeChoices('move skydrop 1, move aquajet 1', 'move sleeptalk, move aquajet 1');
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should be canceled by Gravity and allow the target to use its move`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Aerodactyl', moves: ['skydrop']},
			{species: 'Jirachi', moves: ['gravity']},
		], [
			{species: 'Lairon', moves: ['swordsdance']},
			{species: 'Clamperl', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'atk', 2);
	});

	it(`should not suppress Speed Boost`, function () {
		battle = common.createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Mew', ability: 'speedboost', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'spe', 1);
	});

	it(`should not claim to have dropped a Pokemon if it is already fainted`, function () {
		battle = common.createBattle([[
			{species: 'Shedinja', item: 'stickybarb', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Aerodactyl', moves: ['skydrop']},
		]]);

		battle.makeChoices();
		battle.makeChoices('switch 2');
		battle.makeChoices();
		assert(battle.log.indexOf('|-end|p1a: Wynaut|Sky Drop|[interrupt]') < 0, `Sky Drop should only announce that it failed, not that any Pokemon was freed.`);
	});
});

describe('Sky Drop [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not fail even if the target is heavier than 200kg`, function () {
		battle = common.gen(5).createBattle([[
			{species: 'Aerodactyl', moves: ['skydrop']},
		], [
			{species: 'Aggron', moves: ['tackle']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	describe.skip(`Sky Drop Glitch`, function () {
		beforeEach(function () {
			battle = common.gen(5).createBattle({gameType: 'doubles'}, [[
				{species: 'Aerodactyl', moves: ['rockpolish', 'skydrop', 'dig']},
				{species: 'Alakazam', moves: ['recover', 'gravity']},
				{species: 'Aggron', moves: ['rest']},
			], [
				{species: 'Magikarp', moves: ['sleeptalk', 'tackle']},
				{species: 'Deoxys-Attack', ability: 'sturdy', moves: ['nastyplot', 'thunderbolt', 'roar']},
				{species: 'Azurill', ability: 'thickfat', moves: ['watersport']},
			]]);
			console.log('-------------------------------');
			battle.makeChoices('move skydrop 1, move gravity', 'move sleeptalk, move nastyplot');
			// Magikarp should now be stuck because of the Sky Drop glitch.
		});

		it(`should prevent the target from moving or switching`, function () {
			const alakazam = battle.p1.active[1];
			const magikarp = battle.p2.active[0];
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move nastyplot');
			assert.fullHP(alakazam);
			battle.makeChoices('move rockpolish, move recover', 'switch azurill, move nastyplot');
			assert.species(magikarp, 'Magikarp');
		});

		it(`should prevent the user from being forced out`, function () {
			const aerodactyl = battle.p1.active[0];
			battle.makeChoices('move rockpolish, move recover', 'move sleeptalk, move roar 1');
			assert.species(aerodactyl, 'Aerodactyl');
		});

		it(`should end when the user switches out`, function () {
			const alakazam = battle.p1.active[1];
			battle.makeChoices('switch 3, move recover', 'move tackle 2, move nastyplot');
			assert.false.fullHP(alakazam);
		});

		it(`should end when the user faints`, function () {
			const alakazam = battle.p1.active[1];
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move thunderbolt 1');
			assert.false.fullHP(alakazam);
		});

		it(`should end when the user completes another two-turn move`, function () {
			const alakazam = battle.p1.active[1];
			battle.makeChoices('move dig 2, move recover', 'move sleeptalk, move nastyplot');
			battle.makeChoices('move dig 2, move recover', 'move sleeptalk, move nastyplot');
			battle.makeChoices('move rockpolish, move recover', 'move tackle 2, move nastyplot');
			assert.false.fullHP(alakazam);
		});
	});
});
