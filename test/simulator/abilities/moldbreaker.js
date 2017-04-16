var assert = require('assert');
var battle;

describe('Mold Breaker', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate ability-based immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Basculin", ability: 'moldbreaker', moves: ['aquajet']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Vaporeon", ability: 'waterabsorb', moves: ['splash']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should negate abilities that affect damage', function () {
		battle = BattleEngine.Battle.construct();
		var hploss;
		battle.join('p1', 'Guest 1', 1, [{species: "Haxorus", ability: 'moldbreaker', moves: ['flamecharge']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Snorlax", ability: 'thickfat', moves: ['sleeptalk']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['sleeptalk']}
		]);
		battle.seed = [0, 0, 0, 1];
		battle.commitDecisions();
		hploss = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert(hploss >= 72 && hploss <= 85);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		hploss = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert(hploss >= 72 && hploss <= 85);
	});

	it('should negate abilities that prevent effects', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Breloom", ability: 'moldbreaker', item: 'laggingtail', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Ninetales", ability: 'leafguard', moves: ['sunnyday']},
			{species: "Forretress", ability: 'overcoat', moves: ['roost']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'slp');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should negate partner abilities that prevent effects', function () {
		battle = BattleEngine.Battle.construct('battle-moldbreaker', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Breloom", ability: 'moldbreaker', moves: ['spore']},
			{species: "Magikarp", ability: 'rattled', moves: ['splash']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Togekiss", ability: 'hustle', moves: ['followme']},
			{species: "Slurpuff", ability: 'sweetveil', moves: ['protect']}
		]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});

	it('should not affect item-based immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Druddigon", ability: 'moldbreaker', moves: ['bulldoze']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Parasect", ability: 'dryskin', item: 'airballoon', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
