var battle;
var assert = require('assert');

describe('Inverse Battle', function () {
	var battleCounter = 0;

	beforeEach(function () {
		battle = BattleEngine.Battle.construct('battle-inverse-' + battleCounter++, 'inversebattle');
	});

	afterEach(function () {
		battle.destroy();
	});

	it('should change natural resistances into weaknesses', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scyther", ability: 'swarm', moves: ['roost']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should change natural weaknesses into resistances', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Absol", ability: 'pressure', moves: ['leer']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
	});

	it('should negate natural immunities and make them weaknesses', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dusknoir", ability: 'frisk', moves: ['rest']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect ability-based immunities', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'guts', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mismagius", ability: 'levitate', moves: ['shadowsneak']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect the type effectiveness of Freeze Dry on Water-type Pokemon', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Lapras", ability: 'waterabsorb', moves: ['freezedry']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Floatzel", ability: 'waterveil', moves: ['aquajet']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should not affect the "ungrounded" state of Flying-type Pokemon', function () {
		battle.join('p1', 'Guest 1', 1, [{species: "Parasect", ability: 'dryskin', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Talonflame", ability: 'galewings', moves: ['mistyterrain']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'slp');
	});
});
