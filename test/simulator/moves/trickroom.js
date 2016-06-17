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
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should not allow Pokemon using a lower priority move to act before other Pokemon', function () {
		battle = common.createBattle([
			[{species: 'Bronzong', ability: 'heatproof', moves: ['spore', 'trickroom']}],
			[{species: 'Ninjask', ability: 'speedboost', moves: ['poisonjab', 'protect']}],
		]);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should also affect the activation order for abilities and other non-move actions', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Bronzong', ability: 'heatproof', moves: ['trickroom', 'explosion']},
			{species: 'Hippowdon', ability: 'sandstream', moves: ['protect']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ninjask', ability: 'speedboost', moves: ['shellsmash']},
			{species: 'Ninetales', ability: 'drought', moves: ['protect']},
		]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].speciesid, 'hippowdon');
		assert.strictEqual(battle.p2.active[0].speciesid, 'ninetales');
		assert.strictEqual(battle.effectiveWeather(), 'sunnyday');
	});

	// The following two tests involve the Trick Room glitch, where turn order changes when a Pokemon goes to 1809 speed.

	it('should roll over and cause Pokemon with 1809 or more speed to outspeed Pokemon with 1808 or less', function () {
		battle = common.createBattle([
			[{species: 'Ninjask', ability: 'swarm', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 184}, moves: ['protect', 'spore']}],
			[{species: 'Deoxys-Speed', ability: 'pressure', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 224}, moves: ['spore', 'trickroom']}],
		]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions(); // Trick Room is now up.

		// This sets Ninjask to exactly 1809 Speed
		battle.p1.active[0].boostBy({spe: 4});
		battle.p1.active[0].setItem('choicescarf');
		// This sets Deoxys to exactly 1808 Speed
		battle.p2.active[0].boostBy({spe: 6});

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
		battle.p2.active[0].setStatus('');
		battle.p2.active[0].setItem('choicescarf'); // Deoxys is now much faster speed-wise than Ninjask, but should still be slower in Trick Room.
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should not affect damage dealt by moves whose power is reliant on speed', function () {
		battle = common.createBattle([
			[{species: 'Ninjask', ability: 'swarm', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 184}, item: 'choicescarf', moves: ['earthquake']}],
			[{species: 'Deoxys-Speed', ability: 'levitate', evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 224}, moves: ['gyroball', 'trickroom']}],
		]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();

		battle.p1.active[0].boostBy({spe: 4}); // 1809 Speed
		battle.p2.active[0].boostBy({spe: 6}); // 1808 Speed

		battle.on('BasePower', battle.getFormat(), function (bp, pokemon, target, move) {
			if (move.id !== 'gyroball') return;
			assert.strictEqual(bp, 25); // BP should theoretically be this based on speed values
		});

		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
