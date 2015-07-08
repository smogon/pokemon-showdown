var assert = require('assert');
var battle;

describe('Quash', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause the target to move last if it has not moved yet', function () {
		battle = BattleEngine.Battle.construct('battle-quash-1', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Sableye", ability: 'prankster', moves: ['quash']},
			{species: "Aggron", ability: 'sturdy', moves: ['earthquake']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Arceus", ability: 'multitype', moves: ['voltswitch']},
			{species: "Aerodactyl", ability: 'unnerve', moves: ['swift']},
			{species: "Rotom", ability: 'levitate', moves: ['thunderbolt']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 2, move 1');
		battle.choose('p2', 'move 1 2, move 1');
		battle.choose('p2', 'switch 3, pass'); // Volt Switch
		assert.strictEqual(battle.log[battle.lastMoveLine].split('|')[3], 'Swift');
	});

	it('should not cause the target to move again if it has already moved', function () {
		battle = BattleEngine.Battle.construct('battle-quash-2', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Sableye", ability: 'prankster', moves: ['quash']},
			{species: "Aggron", ability: 'sturdy', moves: ['earthquake']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Arceus", ability: 'multitype', moves: ['voltswitch']},
			{species: "Aerodactyl", ability: 'unnerve', moves: ['extremespeed']},
			{species: "Rotom", ability: 'levitate', moves: ['thunderbolt']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1 2, move 1');
		battle.choose('p2', 'move 1 2, move 1 1');
		battle.choose('p2', 'switch 3, pass'); // Volt Switch
		assert.notStrictEqual(battle.log[battle.lastMoveLine].split('|')[3], 'Extremespeed');
	});
});
