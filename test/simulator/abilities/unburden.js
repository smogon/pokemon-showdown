'use strict';

const assert = require('assert');
let battle;

describe('Unburden', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should trigger when an item is consumed', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Hitmonlee', ability: 'unburden', item: 'whiteherb', moves: ['closecombat']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should trigger when an item is destroyed', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Drifblim', ability: 'unburden', item: 'airballoon', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', moves: ['stoneedge']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should trigger when Natural Gift consumes a berry', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'oranberry', moves: ['naturalgift']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should trigger when an item is flung', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should trigger when an item is forcefully removed', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', moves: ['knockoff']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'moldbreaker', moves: ['knockoff']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});

	it('should lose the boost when it gains a new item', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Hitmonlee', ability: 'unburden', item: 'fightinggem', moves: ['machpunch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Togekiss', ability: 'serenegrace', item: 'laggingtail', moves: ['bestow', 'followme']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.choose('p2', 'move followme');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].getStat('spe'), 2 * speed);
	});
});
