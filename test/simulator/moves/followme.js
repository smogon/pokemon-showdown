var assert = require('assert');
var battle;

describe('Follow Me', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should redirect single-target moves towards it if it is a valid target', function () {
		battle = BattleEngine.Battle.construct('battle-followme', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
			{species: 'Clefairy', ability: 'unaware', moves: ['calmmind']},
			{species: 'Cleffa', ability: 'unaware', moves: ['calmmind']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Abra', ability: 'synchronize', moves: ['lowkick']},
			{species: 'Kadabra', ability: 'synchronize', moves: ['lowkick']},
			{species: 'Alakazam', ability: 'synchronize', moves: ['lowkick']}
		]);
		battle.commitDecisions();
		var hitCount = 0;
		battle.p1.active[0].damage = function () {
			hitCount++;
			return BattleEngine.BattlePokemon.prototype.damage.apply(this, arguments);
		};
		battle.choose('p2', 'move 1 2, move 1 2, move 1 2');
		battle.commitDecisions();
		assert.strictEqual(hitCount, 2);
	});
});
