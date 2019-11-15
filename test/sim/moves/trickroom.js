'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trick Room', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause slower Pokemon to move before faster Pokemon in a priority bracket', function () {
		battle = common.createBattle([
			[{species: 'Bronzong', ability: 'heatproof', moves: ['spore', 'trickroom']}],
			[{species: 'Ninjask', ability: 'speedboost', moves: ['poisonjab', 'spore']}],
		]);
		battle.makeChoices('move trickroom', 'move poisonjab');
		battle.makeChoices('move spore', 'move spore');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should not allow Pokemon using a lower priority move to act before other Pokemon', function () {
		battle = common.createBattle([
			[{species: 'Bronzong', ability: 'heatproof', moves: ['spore', 'trickroom']}],
			[{species: 'Ninjask', ability: 'speedboost', moves: ['poisonjab', 'protect']}],
		]);
		battle.makeChoices('move trickroom', 'move poisonjab');
		battle.makeChoices('move spore', 'move protect');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should also affect the activation order for abilities and other non-move actions', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Bronzong', ability: 'heatproof', moves: ['trickroom', 'explosion']},
			{species: 'Hippowdon', ability: 'sandstream', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ninjask', ability: 'speedboost', moves: ['shellsmash']},
			{species: 'Ninetales', ability: 'drought', moves: ['protect']},
		]});
		battle.makeChoices('move trickroom', 'move shellsmash');
		battle.makeChoices('move explosion', 'move shellsmash');
		battle.makeChoices('switch hippowdon', 'switch ninetales');
		assert.strictEqual(battle.p1.active[0].speciesid, 'hippowdon');
		assert.strictEqual(battle.p2.active[0].speciesid, 'ninetales');
		assert.strictEqual(battle.field.effectiveWeather(), 'sunnyday');
	});

	// The following two tests involve the Trick Room glitch, where turn order changes when a Pokemon goes to 1809 speed.

	it('should roll over and cause Pokemon with 1809 or more speed to outspeed Pokemon with 1808 or less', function () {
		battle = common.createBattle([
			[{species: 'Ninjask', ability: 'swarm', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 184}, moves: ['protect', 'spore']}],
			[{species: 'Deoxys-Speed', ability: 'pressure', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 224}, moves: ['spore', 'trickroom']}],
		]);
		battle.makeChoices('move protect', 'move trickroom'); // Trick Room is now up.

		// This sets Ninjask to exactly 1809 Speed
		battle.p1.active[0].boostBy({spe: 4});
		battle.p1.active[0].setItem('choicescarf');
		// This sets Deoxys to exactly 1808 Speed
		battle.p2.active[0].boostBy({spe: 6});

		battle.makeChoices('move spore', 'move spore');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
		battle.p2.active[0].setStatus('');
		battle.p2.active[0].setItem('choicescarf'); // Deoxys is now much faster speed-wise than Ninjask, but should still be slower in Trick Room.
		battle.makeChoices('move spore', 'move spore');
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should not affect damage dealt by moves whose power is reliant on speed', function () {
		battle = common.createBattle([
			[{species: 'Ninjask', ability: 'swarm', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 184}, item: 'choicescarf', moves: ['earthquake']}],
			[{species: 'Deoxys-Speed', ability: 'levitate', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 224}, moves: ['gyroball', 'trickroom']}],
		]);
		battle.makeChoices('move earthquake', 'move trickroom');

		battle.p1.active[0].boostBy({spe: 4}); // 1809 Speed
		battle.p2.active[0].boostBy({spe: 6}); // 1808 Speed

		battle.onEvent('BasePower', battle.format, function (bp, pokemon, target, move) {
			if (move.id !== 'gyroball') return;
			assert.strictEqual(bp, 25); // BP should theoretically be this based on speed values
		});

		battle.makeChoices('move earthquake', 'move gyroball');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
