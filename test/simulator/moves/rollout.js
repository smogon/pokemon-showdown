'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

let moves = ['Ice Ball', 'Rollout'];

for (const move of moves) {
	describe(move, function () {
		let id = move.toLowerCase().replace(/\W+/g, '');

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
			battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
				count++;
				assert.strictEqual(basePower, ebp);
				if (count % 5 === 0) {
					ebp = 30;
				} else {
					ebp *= 2;
				}
			});

			for (let i = 0; i < 8; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.strictEqual(count, 8);
		});

		it('should reset its Base Power if the move misses', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id]}],
				[{species: 'Steelix', ability: 'furcoat', moves: ['recover']}],
			]);

			let ebp = 30;
			let count = 0;
			battle.onEvent('Accuracy', battle.getFormat(), function (accuracy, target, pokemon, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate a miss
				} else {
					return true;
				}
			});
			battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, ebp);
				ebp *= 2;
			});

			for (let i = 0; i < 5; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.strictEqual(count, 5);
		});

		it('should reset its Base Power if the Pokemon is immobilized', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id]}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let ebp = 30;
			let count = 0;
			battle.onEvent('BeforeMove', battle.getFormat(), function (attacker, defender, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate immobilization from Paralysis, etc.
				}
			});
			battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, ebp);
				ebp *= 2;
			});

			for (let i = 0; i < 5; i++) {
				battle.makeChoices('move ' + id, 'move recover');
			}
			assert.strictEqual(count, 5);
		});

		it('should have double Base Power if the Pokemon used Defense Curl earlier', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'gluttony', moves: [id, 'defensecurl']}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let runCount = 0;
			battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, 60);
				runCount++;
			});

			battle.makeChoices('move defensecurl', 'move recover');
			battle.makeChoices('move ' + id, 'move recover');
			assert.strictEqual(runCount, 1);
		});

		it('should not be affected by Parental Bond', function () {
			battle = common.createBattle([
				[{species: 'Shuckle', ability: 'parentalbond', moves: [id]}],
				[{species: 'Steelix', ability: 'noguard', moves: ['recover']}],
			]);

			let hitCount = 0;
			battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, 30);
				hitCount++;
			});

			battle.makeChoices('move ' + id, 'move recover');
			assert.strictEqual(hitCount, 1);
		});

		it('should store its damage multiplier beyond the usual 5 hits if damage calculation is skipped by Disguise', function () {
			battle = common.createBattle([
				[
					{species: 'Smeargle', ability: 'owntempo', moves: ['bellydrum', 'gravity', 'heartswap']},
					{species: 'Mimikyu', ability: 'disguise', moves: ['swordsdance']},
					{species: 'Gyarados', ability: 'moxie', moves: ['dragondance']},
				], [
					{species: 'Geodude-Alola', ability: 'galvanize', level: 1, evs: {atk: 252}, nature: 'adamant', item: 'Life Orb', moves: ['defensecurl', id, 'explosion']},
				],
			]);

			battle.onEvent('BasePower', battle.getFormat(), -1, function (basePower, pokemon, target, move) {
				if (move.id === 'explosion') {
					assert.strictEqual(basePower, 8000);
					return basePower;
				}
				let multiplier = [2, 4, 8, 8, 16][pokemon.volatiles[id].hitCount - 1];
				assert.strictEqual(multiplier, pokemon.volatiles[id].multiplier);
			});

			battle.makeChoices('move bellydrum', 'move defensecurl');
			battle.makeChoices('move gravity', 'move ' + id);
			battle.makeChoices('move heartswap', 'move ' + id);
			battle.makeChoices('switch 2', 'move ' + id);
			battle.makeChoices('move swordsdance', 'move ' + id);
			battle.makeChoices('move swordsdance', 'move ' + id);
			battle.makeChoices('switch 3', 'move explosion');
			assert.fainted(battle.p1.active[0]);
		});
	});
}
