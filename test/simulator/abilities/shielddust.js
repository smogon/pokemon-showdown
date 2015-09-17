var assert = require('assert');
var battle;

describe('Shield Dust', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should block secondary effects against the user', function () {
		battle = BattleEngine.Battle.construct('battle-shielddust', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Latios', ability: 'noguard', moves: ['snarl']},
			{species: 'Latias', ability: 'levitate', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Xerneas', ability: 'shielddust', moves: ['roost']},
			{species: 'Yveltal', ability: 'pressure', moves: ['roost']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[1].boosts['spa'], -1);
	});

	it('should not block secondary effects that affect the user of the move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'ironfist', moves: ['poweruppunch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 1);
	});

	it('should block added effects from items', function () {
		battle = BattleEngine.Battle.construct('battle-kingsrock', 'customgame');
		battle.join('p1', 'Guest 1', 1, [{species: 'Talonflame', ability: 'flamebody', item: 'kingsrock', moves: ['flamecharge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Clefable', ability: 'shielddust', moves: ['cottonguard']}]);
		battle.on('ModifyMove', battle.getFormat(), function (move) {
			if (move.secondaries) {
				for (var i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance = 100;
				}
			}
		});
		battle.commitDecisions(); // Team Preview
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['spe'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['def'], 3); // Clefable did not flinch
	});

	it('should block added effects from Fling', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'ironfist', item: 'petayaberry', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 1);
	});

	it('should not block secondary effects on attacks used by the Pokemon with the ability', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'shielddust', moves: ['poweruppunch', 'strugglebug']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Clefable', ability: 'unaware', moves: ['softboiled']}]);
		battle.choose('p1', 'move 1');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 1);
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], -1);
	});

	it('should be negated by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pinsir', ability: 'moldbreaker', moves: ['strugglebug']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], -1);
	});
});
