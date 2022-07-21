'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Dynamax", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('Max Move effects should not be suppressed by Sheer Force', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Braviary', ability: 'sheerforce', moves: ['heatwave', 'facade', 'superpower']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'sturdy', item: 'ringtarget', moves: ['splash']},
		]});
		battle.makeChoices('move heatwave dynamax', 'auto');
		assert.equal(battle.field.weather, 'sunnyday');
		battle.makeChoices('move facade', 'auto');
		assert.statStage(battle.p2.active[0], 'spe', -1);
		battle.makeChoices('move superpower', 'auto');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('Max Move versions of disabled moves should not be disabled, except by Assault Vest', function () {
		battle = common.createBattle([[
			{species: 'Mew', item: 'assaultvest', moves: ['watergun', 'protect']},
		], [
			{species: 'Mew', item: 'choiceband', moves: ['watergun', 'protect']},
		]]);
		battle.makeChoices('move 1 dynamax', 'move 1 dynamax');
		assert.throws(() => {
			battle.makeChoices('move 2', 'move 1');
		});
		battle.makeChoices('move 1', 'move 2');
	});

	it('Max Move weather activates even if foe faints', function () {
		battle = common.createBattle([[
			{species: 'Shedinja', moves: ['splash']},
		], [
			{species: 'Mew', moves: ['watergun']},
		]]);
		battle.makeChoices('move 1', 'move 1 dynamax');
		assert.equal(battle.field.weather, 'raindance');
	});

	it('Max Move weather activates before Sand Spit', function () {
		battle = common.createBattle([[
			{species: 'Shedinja', ability: 'sandspit', moves: ['splash']},
		], [
			{species: 'Mew', moves: ['watergun']},
		]]);
		battle.makeChoices('move 1', 'move 1 dynamax');
		assert.equal(battle.field.weather, 'sandstorm');
	});

	it('makes Liquid Voice stop working', function () {
		battle = common.createBattle([[
			{species: 'Primarina', ability: 'liquidvoice', moves: ['hypervoice']},
		], [
			{species: 'Rhyhorn', ability: 'wonderguard', moves: ['splash']},
		]]);
		battle.makeChoices('move 1 dynamax', 'move 1');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should execute in order of updated speed when 2 or more Pokemon are Dynamaxing', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'kingdra', ability: 'swiftswim', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'groudon', ability: 'drought', moves: ['sleeptalk']},
		], [
			{species: 'kyogre', ability: 'drizzle', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk dynamax, switch 3', 'move sleeptalk dynamax, auto');
		const log = battle.getDebugLog();
		const kingdraMaxIndex = log.indexOf('|-start|p1a: Kingdra|Dynamax');
		const kyogreMaxIndex = log.indexOf('|-start|p2a: Kyogre|Dynamax');
		assert(kyogreMaxIndex < kingdraMaxIndex, 'Kyogre should have Dynamaxed before Kingdra.');
	});

	it('should revert before the start of the 4th turn, not as an end-of-turn effect on the 3rd turn', function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'psychic']},
		], [
			{species: 'weedle', level: 1, moves: ['sleeptalk']},
			{species: 'weedle', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk dynamax', 'auto');
		battle.makeChoices();
		battle.makeChoices('move psychic', 'auto');
		const wynaut = battle.p1.active[0];
		assert(wynaut.volatiles['dynamax'], 'End of 3rd turn, Wynaut should still be Dynamaxed.');
		battle.makeChoices('', 'switch 2');
		assert.false(wynaut.volatiles['dynamax'], 'Start of 4th turn, Wynaut should not be Dynamaxed.');
	});

	it('should be impossible to Dynamax when all the base moves are disabled', function () {
		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash']},
		], [
			{species: "Wynaut", moves: ['taunt', 'splash']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move splash dynamax'));
		assert.cantMove(() => battle.choose('p1', 'move struggle dynamax'));

		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash']},
		], [
			{species: "Wynaut", moves: ['imprison', 'splash']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move 1', 'auto');
		assert.cantMove(() => battle.choose('p1', 'move splash dynamax'));
		assert.cantMove(() => battle.choose('p1', 'move struggle dynamax'));
	});

	it(`should not allow the user to select max moves with 0 base PP remaining`, function () {
		battle = common.createBattle([[
			{species: 'pichu', ability: 'prankster', level: 1, moves: ['grudge']},
			{species: 'noibat', ability: 'prankster', level: 1, moves: ['grudge']},
			{species: 'azurill', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['earthquake', 'icebeam']},
		]]);

		battle.makeChoices('auto', 'move earthquake dynamax');
		battle.makeChoices();
		assert.cantMove(() => battle.p2.chooseMove('earthquake'), 'wynaut', 'Max Quake');
		battle.makeChoices(); // Noibat uses Grudge and Wynaut uses Max Hailstorm
		assert.fainted(battle.p1.active[0]);
		battle.makeChoices();
		assert.cantMove(() => battle.p2.chooseMove('icebeam'), 'wynaut', 'icebeam');
		battle.makeChoices('auto', 'move struggle'); // will throw an error if Wynaut isn't forced to use Struggle
	});

	it(`should force the user to use Struggle if certain effects are disabling all of its base moves`, function () {
		battle = common.createBattle([[
			{species: "Skwovet", item: 'oranberry', moves: ['sleeptalk', 'belch', 'stuffcheeks']},
		], [
			{species: "Calyrex-Shadow", moves: ['disable', 'trick']},
		]]);
		battle.makeChoices();
		// Skwovet's Sleep Talk and Belch are disabled, but Stuff Cheeks isn't so Skwovet can still use Max Ooze
		battle.makeChoices('move belch dynamax', 'auto');
		assert.equal(battle.p1.active[0].boosts.spa, 1);
		battle.makeChoices('move belch', 'move trick');
		assert.equal(battle.p1.active[0].boosts.spa, 2);
		// Now Skwovet's berry is gone, so Stuff Cheeks is disabled too
		battle.makeChoices('move struggle', 'auto'); // will throw an error if Skwovet isn't forced to use Struggle

		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash']},
		], [
			{species: "Clefairy", moves: ['imprison', 'gravity', 'splash']},
		]]);
		battle.makeChoices('move splash dynamax', 'auto');
		battle.makeChoices('move splash', 'move gravity'); // will throw an error if Feebas is forced to use Struggle by Imprison
		battle.makeChoices('move splash', 'auto'); // will throw an error if Feebas is forced to use Struggle by Gravity
	});

	it.skip(`should not remove the variable to Dynamax on forced switches`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'ejectpack', moves: ['ironhead']},
			{species: 'audino', item: 'ejectpack', moves: ['sleeptalk']},
		], [
			{species: 'vikavolt', moves: ['stickyweb']},
			{species: 'incineroar', ability: 'intimidate', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move ironhead dynamax', 'switch 2');
		battle.makeChoices('switch 2'); // Eject Pack to Audino
		battle.makeChoices('switch 2'); // Eject Pack back to Wynaut, to Dynamax
		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'def', 0, 'Wynaut should not have used Max Steelspike this turn.');
		assert(wynaut.volatiles['dynamax'], 'Wynaut should be currently Dynamaxed.');
	});

	describe(`Hacked Max Moves`, function () {
		it(`should not activate Max Move side effects when used without Dynamaxing`, function () {
			battle = common.createBattle([[
				{species: 'wynaut', moves: ['maxflare', 'maxairstream']},
			], [
				{species: 'shuckle', moves: ['sleeptalk']},
			]]);
			battle.makeChoices('move maxflare', 'auto');
			assert.equal(battle.field.weather, '');

			battle.makeChoices('move maxairstream', 'auto');
			assert.statStage(battle.p1.active[0], 'spe', 0);
		});

		it(`should treat Max Moves as 0 BP when used without Dynamaxing`, function () {
			battle = common.createBattle([[
				{species: 'wynaut', moves: ['maxflare', 'maxairstream']},
			], [
				{species: 'shuckle', ability: 'shellarmor', moves: ['sleeptalk']},
			]]);
			battle.makeChoices('move maxflare', 'auto');
			battle.makeChoices('move maxairstream', 'auto');

			const shuckle = battle.p2.active[0];
			assert.bounded(shuckle.maxhp - shuckle.hp, [2, 4], `0 BP should cause the move's damage to only be 2 after base damage calculation, resulting in 1-2 final damage for each Max Move.`);
		});

		it(`should treat Max Moves as physical moves when used without Dynamaxing`, function () {
			battle = common.createBattle([[
				{species: 'wynaut', moves: ['maxflare']},
			], [
				{species: 'shuckle', item: 'keeberry', moves: ['sleeptalk']},
			]]);
			battle.makeChoices();
			assert.statStage(battle.p2.active[0], 'def', 1);
		});

		it(`should prevent effects that affect regular Max Moves, like Sleep Talk and Instruct`, function () {
			battle = common.createBattle([[
				{species: 'wynaut', moves: ['maxflare', 'sleeptalk']},
			], [
				{species: 'shuckle', moves: ['instruct', 'spore', 'roost']},
			]]);
			battle.makeChoices();
			const wynaut = battle.p1.active[0];
			const move = wynaut.getMoveData(Dex.moves.get('maxflare'));
			assert.equal(move.pp, move.maxpp - 1, `Max Flare should only have been used once.`);

			battle.makeChoices('auto', 'move roost');
			battle.makeChoices('move sleeptalk', 'move spore');
			battle.makeChoices('move sleeptalk', 'move spore');
			const shuckle = battle.p2.active[0];
			assert.fullHP(shuckle, `Sleep Talk should have failed in calling a move and so not dealt damage.`);
		});
	});
});
