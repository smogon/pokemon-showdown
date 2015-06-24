var battle;
var assert = require('assert');

describe('Miracle Eye', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate Psychic immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['miracleeye', 'psychic']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Darkrai", ability: 'baddreams', moves: ['nastyplot']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore the effect of positive evasion stat stages', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['avalanche', 'miracleeye']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Forretress", ability: 'sturdy', moves: ['synthesis']}]);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.boost({evasion: 6}, battle.p2.active[0]);
		for (var i = 0; i < 16; i++) {
			battle.commitDecisions();
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});

	it('should not ignore the effect of negative evasion stat stages', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['zapcannon', 'dynamicpunch', 'miracleeye']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Zapdos", ability: 'owntempo', moves: ['roost']}]);
		battle.choose('p1', 'move 3');
		battle.commitDecisions();
		battle.boost({spe: 6, evasion: -6}, battle.p2.active[0]);
		for (var i = 0; i < 16; i++) {
			battle.commitDecisions();
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});
});
