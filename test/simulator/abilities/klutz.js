var assert = require('assert');
var battle;

describe('Klutz', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate residual healing events', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'leftovers', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Giratina", ability: 'pressure', moves: ['shadowsneak']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.ceil(battle.p1.active[0].maxhp / 2));
	});

	it('should prevent items from being consumed', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", level: 1, ability: 'klutz', item: 'sitrusberry', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['psychic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 1);
		assert.strictEqual(battle.p1.active[0].item, 'sitrusberry');
	});

	it('should ignore the effects of items that disable moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'assaultvest', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['psychic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'protect');
	});

	it('should not ignore item effects that prevent item removal', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Genesect", ability: 'klutz', item: 'dousedrive', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['trick']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'dousedrive');
	});

	it('should cause Fling to fail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'seaincense', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'seaincense');
	});

	it('should not prevent Pokemon from Mega Evolving', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lopunny", ability: 'klutz', item: 'lopunnite', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Deoxys", ability: 'noguard', moves: ['calmmind']}]);
		battle.choose('p1', 'move 1 mega');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'lopunnymega');
	});
});
