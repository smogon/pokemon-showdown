var assert = require('assert');
var battle;

describe('Pickup', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pick up a consumed item', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['flamethrower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Paras', ability: 'dryskin', item: 'sitrusberry', moves: ['endure']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'sitrusberry');
	});

	it('should pick up flung items', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Clefairy', ability: 'unaware', item: 'airballoon', moves: ['fling']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'airballoon');
	});

	it('should not pick up an item that was knocked off', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', item: 'choicescarf', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, '');
	});

	it('should not pick up a popped Air Balloon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['fakeout']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'airballoon', moves: ['roost']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, '');
	});

	it('should not pick up items from Pokemon that have switched out and back in', function () {
		battle = BattleEngine.Battle.construct('battle-pickup-switch', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Gourgeist', ability: 'pickup', moves: ['shadowsneak']},
			{species: 'Aggron', ability: 'sturdy', moves: ['rest']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ambipom', ability: 'swarm', moves: ['uturn']},
			{species: 'Clefable', ability: 'unaware', item: 'ejectbutton', moves: ['followme']},
			{species: 'Magikarp', ability: 'rattled', moves: ['splash']}
		]);
		battle.commitDecisions();
		battle.commitDecisions();
		battle.choose('p2', 'switch 3');
		battle.choose('p2', 'switch 3');
		assert.strictEqual(battle.p1.active[0].item, '');
	});

	it('should not pick up items from Pokemon that have switched out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['shadowsneak', 'synthesis']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ambipom', ability: 'swarm', item: 'buggem', moves: ['uturn']},
			{species: 'Dusknoir', ability: 'pressure', item: 'ejectbutton', moves: ['painsplit']}
		]);
		battle.choose('p1', 'move synthesis');
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p1.active[0].item, '');
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p1.active[0].item, '');
	});

	it('should not pick up items that were already retrieved', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['return']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aron', level: 1, ability: 'sturdy', item: 'berryjuice', moves: ['recycle']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].item, 'berryjuice');
	});

	it('should pick up items from adjacent allies', function () {
		battle = BattleEngine.Battle.construct('battle-pickup-ally', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Ambipom', ability: 'pickup', moves: ['protect']},
			{species: 'Aron', level: 1, ability: 'sturdy', item: 'berryjuice', moves: ['followme']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ambipom', ability: 'technician', moves: ['return']},
			{species: 'Arcanine', ability: 'flashfire', moves: ['protect']}
		]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'berryjuice');
	});

	it('should not pick up items from non-adjacent allies and enemies', function () {
		battle = BattleEngine.Battle.construct('battle-pickup-nonadjacent', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Ambipom', ability: 'pickup', moves: ['protect']},
			{species: 'Regirock', ability: 'sturdy', moves: ['curse']},
			{species: 'Arcanine', ability: 'flashfire', item: 'normalgem', moves: ['extremespeed']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Arcanine', ability: 'flashfire', item: 'firegem', moves: ['flamecharge']},
			{species: 'Aggron', ability: 'sturdy', moves: ['rest']},
			{species: 'Magikarp', ability: 'swiftswim',  moves: ['splash']}
		]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, '');
	});
});
