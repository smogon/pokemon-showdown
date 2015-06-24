var assert = require('assert');
var battle;

describe('Rock Head', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should block recoil from most moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'clearbody', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not block recoil if the ability is disabled/removed mid-attack', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'mummy', moves: ['rest']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not block recoil from Struggle', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'rockhead', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not block crash damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rampardos', ability: 'rockhead', moves: ['jumpkick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
