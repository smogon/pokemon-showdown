var assert = require('assert');
var battle;

var moves = ['Ice Ball', 'Rollout'];

for (var i = 0; i < moves.length; i++) {
	describe(moves[i], function () {
		var id = moves[i].toLowerCase().replace(/\W+/g, '');

		afterEach(function () {
			battle.destroy();
		});

		it('should double its Base Power every turn for five turns, then resets to 30 BP', function () {
			battle = BattleEngine.Battle.construct('battle-rollout', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Steelix', ability: 'noguard', moves: ['recover']}]);
			battle.commitDecisions(); // Team Preview

			var ebp = 30;
			var count = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower) {
				count++;
				assert.strictEqual(basePower, ebp);
				if (count % 5 === 0) {
					ebp = 30;
				} else {
					ebp *= 2;
				}
			});

			for (var j = 0; j < 8; j++) {
				battle.commitDecisions();
			}
			assert.strictEqual(count, 8);
		});

		it('should reset its Base Power if the move misses', function () {
			battle = BattleEngine.Battle.construct('battle-rollout-miss', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Steelix', ability: 'furcoat', moves: ['recover']}]);
			battle.commitDecisions(); // Team Preview

			var ebp = 30;
			var count = 0;
			battle.on('Accuracy', battle.getFormat(), function (accuracy, target, pokemon, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate a miss
				} else {
					return true;
				}
			});
			battle.on('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, ebp);
				ebp *= 2;
			});

			for (var j = 0; j < 5; j++) {
				battle.commitDecisions();
			}
			assert.strictEqual(count, 5);
		});

		it('should reset its Base Power if the Pokemon is immobilized', function () {
			battle = BattleEngine.Battle.construct('battle-rollout-para', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Steelix', ability: 'noguard', moves: ['recover']}]);
			battle.commitDecisions(); // Team Preview

			var ebp = 30;
			var count = 0;
			battle.on('BeforeMove', battle.getFormat(), function (attacker, defender, move) {
				if (move.id === 'recover') return;

				count++;
				if (count === 3) {
					ebp = 30;
					return false; // Imitate immobilization from Paralysis, etc.
				}
			});
			battle.on('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, ebp);
				ebp *= 2;
			});

			for (var j = 0; j < 5; j++) {
				battle.commitDecisions();
			}
			assert.strictEqual(count, 5);
		});

		it('should have double Base Power if the Pokemon used Defense Curl earlier', function () {
			battle = BattleEngine.Battle.construct('battle-defensecurl', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'gluttony', moves: [id, 'defensecurl']}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Steelix', ability: 'noguard', moves: ['recover']}]);
			battle.commitDecisions(); // Team Preview

			var runCount = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, 60);
				runCount++;
			});

			battle.choose('p1', 'move 2');
			battle.commitDecisions();
			battle.commitDecisions();
			assert.strictEqual(runCount, 1);
		});

		it('should not be affected by Parental Bond', function () {
			battle = BattleEngine.Battle.construct('battle-parentalbond', 'customgame');
			battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'parentalbond', moves: [id]}]);
			battle.join('p2', 'Guest 2', 1, [{species: 'Steelix', ability: 'noguard', moves: ['recover']}]);
			battle.commitDecisions(); // Team Preview

			var hitCount = 0;
			battle.on('BasePower', battle.getFormat(), function (basePower) {
				assert.strictEqual(basePower, 30);
				hitCount++;
			});

			battle.commitDecisions();
			assert.strictEqual(hitCount, 1);
		});
	});
}
