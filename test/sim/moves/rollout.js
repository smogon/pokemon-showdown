'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const moves = ['Ice Ball', 'Rollout'];

for (const move of moves) {
	describe(move, function () {
		const id = move.toLowerCase().replace(/\W+/g, '');

		afterEach(function () {
			battle.destroy();
		});

		it('should double its Base Power every turn for five turns, then resets to 30 BP', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id]}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let ebp = 30;
			let count = 0;
			battle.onEvent('BasePower', battle.format, function (basePower) {
				count++;
				assert.equal(basePower, ebp);
				if (count % 5 === 0) {
					ebp = 30;
				} else {
					ebp *= 2;
				}
			});

			for (let i = 0; i < 8; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.equal(count, 8);
		});

		it('should reset its Base Power if the move misses', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id]}],
				[{species: 'Steelix', ability: 'furcoat', moves: ['recover']}],
			]);

			let ebp = 30;
			let count = 0;
			battle.onEvent('Accuracy', battle.format, function (accuracy, target, pokemon, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate a miss
				} else {
					return true;
				}
			});
			battle.onEvent('BasePower', battle.format, function (basePower) {
				assert.equal(basePower, ebp);
				ebp *= 2;
			});

			for (let i = 0; i < 5; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.equal(count, 5);
		});

		it('should reset its Base Power if the Pokemon is immobilized', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id]}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let ebp = 30;
			let count = 0;
			battle.onEvent('BeforeMove', battle.format, function (attacker, defender, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate immobilization from Paralysis, etc.
				}
			});
			battle.onEvent('BasePower', battle.format, function (basePower) {
				assert.equal(basePower, ebp);
				ebp *= 2;
			});

			for (let i = 0; i < 5; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.equal(count, 5);
		});

		it('should have double Base Power if the Pokemon used Defense Curl earlier', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id, 'defensecurl']}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let runCount = 0;
			battle.onEvent('BasePower', battle.format, function (basePower) {
				assert.equal(basePower, 60);
				runCount++;
			});

			battle.makeChoices('move defensecurl', 'move recover');
			battle.makeChoices('move ' + id, 'move recover');
			assert.equal(runCount, 1);
		});

		it('should not be affected by Parental Bond', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'parentalbond', moves: [id]}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let hitCount = 0;
			battle.onEvent('BasePower', battle.format, function (basePower) {
				assert.equal(basePower, 30);
				hitCount++;
			});

			battle.makeChoices('move ' + id, 'move recover');
			assert.equal(hitCount, 1);
		});
	});
}
