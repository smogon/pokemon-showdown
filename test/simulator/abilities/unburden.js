'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Unburden', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should trigger when an item is consumed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Hitmonlee', ability: 'unburden', item: 'whiteherb', moves: ['closecombat']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move closecombat', 'move swordsdance'));
	});

	it('should trigger when an item is destroyed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Drifblim', ability: 'unburden', item: 'airballoon', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', moves: ['stoneedge']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move endure', 'move stoneedge'));
	});

	it('should trigger when Natural Gift consumes a berry', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'oranberry', moves: ['naturalgift']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move naturalgift', 'move swordsdance'));
	});

	it('should trigger when an item is flung', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'focussash', moves: ['swordsdance']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move fling', 'move swordsdance'));
	});

	it('should trigger when an item is forcefully removed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', moves: ['knockoff']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move leechseed', 'move knockoff'));
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sceptile', ability: 'unburden', item: 'whiteherb', moves: ['leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'moldbreaker', moves: ['knockoff']}]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('spe'), 2 * target.getStat('spe'), () => battle.makeChoices('move leechseed', 'move knockoff'));
	});

	it('should lose the boost when it gains a new item', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Hitmonlee', ability: 'unburden', item: 'fightinggem', moves: ['machpunch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Togekiss', ability: 'serenegrace', item: 'laggingtail', moves: ['bestow', 'followme']}]);
		const originalSpeed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move machpunch', 'move followme');
		assert.strictEqual(battle.p1.active[0].getStat('spe'), 2 * originalSpeed);
		battle.makeChoices('move machpunch', 'move bestow');
		assert.strictEqual(battle.p1.active[0].getStat('spe'), originalSpeed);
	});
});
