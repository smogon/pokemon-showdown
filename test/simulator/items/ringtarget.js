var battle;
var assert = require('assert');

describe('Ring Target', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate natural immunities and deal normal type effectiveness with the other type(s)', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['earthquake', 'vitalthrow', 'shadowball', 'psychic']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Thundurus", ability: 'prankster', item: 'ringtarget', moves: ['rest']},
			{species: "Drifblim", ability: 'unburden', item: 'ringtarget', moves: ['rest']},
			{species: "Girafarig", ability: 'innerfocus', item: 'ringtarget', moves: ['rest']},
			{species: "Absol", ability: 'superluck', item: 'ringtarget', moves: ['rest']}
		]);
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'switch 2');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move 3');
		battle.choose('p2', 'switch 3');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move 4');
		battle.choose('p2', 'switch 4');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect ability-based immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'guts', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mismagius", ability: 'levitate', item: 'ringtarget', moves: ['shadowsneak']}]);
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
