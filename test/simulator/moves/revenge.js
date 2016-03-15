'use strict';

const assert = require('assert');
let battle;

let moves = ['Avalanche', 'Revenge'];

for (let i = 0; i < moves.length; i++) {
	describe(moves[i], function () {
		let id = moves[i].toLowerCase().replace(/\W+/g, '');

		afterEach(function () {
			battle.destroy();
		});

		it('should double its Base Power if hit by a damaging move from the target', function () {
			battle = BattleEngine.Battle.construct('battle-revenge', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Ninjask', ability: 'swarm', moves: ['swift']}]);
			battle.commitDecisions(); // Team Preview

			let eventRun = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower, target, source, move) {
				if (move.id !== id) return;
				assert.strictEqual(basePower, 120);
				eventRun++;
			});

			battle.commitDecisions();
			assert.strictEqual(eventRun, 1);
		});

		it('should not double its Base Power if hit by a non-damaging move from the target', function () {
			battle = BattleEngine.Battle.construct('battle-revenge-nohit', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'innerfocus', moves: ['toxic']}]);
			battle.commitDecisions(); // Team Preview

			let eventRun = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower, target, source, move) {
				if (move.id !== id) return;
				assert.strictEqual(basePower, 60);
				eventRun++;
			});

			battle.commitDecisions();
			assert.strictEqual(eventRun, 1);
		});

		it('should not double its Base Power if hit by a damaging move, but not any from the target', function () {
			battle = BattleEngine.Battle.construct('battle-doubles-revenge', 'doublescustomgame');
			battle.join('p1', 'Guest 1', 1, [
				{species: 'Shuckle', ability: 'gluttony', moves: [id]},
				{species: 'Shuckle', ability: 'gluttony', moves: ['recover']},
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: 'Crobat', ability: 'innerfocus', moves: ['roost']},
				{species: 'Crobat', ability: 'innerfocus', moves: ['swift']},
			]);
			battle.commitDecisions(); // Team Preview

			let eventRun = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower, target, source, move) {
				if (move.id !== id) return;
				assert.strictEqual(basePower, 60);
				eventRun++;
			});

			battle.choose('p1', 'move 1 1, move 1');
			battle.commitDecisions();
			assert.strictEqual(eventRun, 1);
		});
	});
}
