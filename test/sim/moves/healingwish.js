'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Healing Wish', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal a switch-in for full before hazards at end of turn', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish', 'protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});

		battle.makeChoices('move stringshot', 'move endeavor'); // set Caterpie to 1hp
		battle.makeChoices('switch jirachi', 'switch tyranitar'); // set up Sand
		battle.makeChoices('move protect', 'move stealthrock');
		battle.makeChoices('move healingwish', 'move seismictoss');
		assert.equal(battle.requestState, 'switch');
		// sand happens after Jirachi faints and before any switch-in
		battle.makeChoices('switch Caterpie', ''); // Caterpie heals before taking SR damage
		assert.equal(battle.p1.active[0].hp, 174);
		assert.equal(battle.p1.active[0].moveSlots[0].pp, 63);
	});

	it('should not be consumed if a switch-in is fully healed already', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish', 'protect']},
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});
		battle.makeChoices('move protect', 'move stealthrock'); // set up Sand and Stealth Rock
		battle.makeChoices('move healingwish', 'move seismictoss');
		assert.equal(battle.requestState, 'switch');
		// sand happens after Jirachi faints and before any switch-in
		battle.makeChoices('switch Caterpie', ''); // Caterpie does not consume Healing Wish
		assert(battle.p1.slotConditions[0]['healingwish']);
	});

	it('should heal an ally fully after Ally Switch', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Rotom', ability: 'levitate', moves: ['allyswitch']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Garchomp', ability: 'sandveil', moves: ['sleeptalk']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor', 'protect']},
		]});
		// set up Healing Wish, Caterpie is at 1 HP
		battle.makeChoices('move healingwish, move stringshot', 'move sleeptalk, move endeavor 2');
		assert.equal(battle.requestState, 'switch');
		// Rotom does not consume Healing Wish
		battle.makeChoices('switch rotom', '');
		assert(battle.p1.slotConditions[0]['healingwish']);
		// Caterpie gets healed by Healing Wish triggered by Ally Switch
		battle.makeChoices('move allyswitch, move stringshot', 'move sleeptalk, move protect');
		assert.equal(battle.p1.active[0].hp, 231); // Caterpie start in slot 1 -> Ally Switch-ed to slot 0
		assert.false(battle.p1.slotConditions[0]['healingwish']);
	});

	it(`should fail to switch the user out if no Pokemon can be switched in`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['healingwish']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));
		assert.false.fainted(battle.p1.active[0]);

		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['healingwish']},
			{species: 'pichu', moves: ['swordsdance']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));
		assert.false.fainted(battle.p1.active[0]);
	});

	it(`should not set up the slot condition when it fails`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wobbuffet', moves: ['healingwish', 'swordsdance']},
			{species: 'wynaut', moves: ['swordsdance', 'allyswitch']},
		], [
			{species: 'dratini', moves: ['breakingswipe', 'swordsdance']},
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		const wynaut = battle.p1.active[1];
		battle.makeChoices();
		battle.makeChoices('move swordsdance, move allyswitch', 'move swordsdance, move swordsdance');
		assert(battle.log.some(line => line.startsWith('|-fail')));
		assert.false.fullHP(wynaut);
	});

	it('[Gen 4] should heal a switch-in for full after hazards mid-turn', function () {
		battle = common.gen(4).createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Raichu', ability: 'lightningrod', moves: ['growl']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});

		battle.makeChoices('move String Shot', 'move Endeavor'); // set Caterpie to 1hp

		battle.makeChoices('switch Raichu', 'switch Tyranitar'); // set up Sand

		battle.makeChoices('move Growl', 'move Stealth Rock');

		battle.makeChoices('switch Jirachi', 'move Seismic Toss');

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		battle.makeChoices('switch Caterpie', ''); // Caterpie faints from hazards
		assert.equal(battle.p1.active[0].hp, 0);

		battle.makeChoices('switch Raichu', ''); // Raichu fully heals and takes stoss + Sandstorm damage
		assert.equal(battle.turn, 6);
		assert.equal(battle.p1.active[0].hp, 145); // after stoss + Sandstorm
		assert.equal(battle.p1.active[0].moveSlots[0].pp, 63);
	});
});
