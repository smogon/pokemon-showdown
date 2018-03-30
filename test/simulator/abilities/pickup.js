'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pickup', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pick up a consumed item', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['flamethrower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Paras', ability: 'dryskin', item: 'sitrusberry', moves: ['endure']}]);
		battle.makeChoices('move flamethrower', 'move endure');
		assert.holdsItem(battle.p1.active[0], "Pick Up should retrieve consumed Sitrus Berry");
	});

	it('should pick up flung items', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Clefairy', ability: 'unaware', item: 'airballoon', moves: ['fling']}]);
		battle.makeChoices('move endure', 'move fling');
		assert.holdsItem(battle.p1.active[0], "Pick Up should retrieve flung Air Balloon");
	});

	it('should not pick up an item that was knocked off', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', item: 'choicescarf', moves: ['bulkup']}]);
		battle.makeChoices('move knockoff', 'move bulkup');
		assert.false.holdsItem(battle.p1.active[0], "Pick Up should not retrieve knocked off Choice Scarf");
	});

	it('should not pick up a popped Air Balloon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['fakeout']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scizor', ability: 'swarm', item: 'airballoon', moves: ['roost']}]);
		battle.makeChoices('move fakeout', 'move roost');
		assert.false.holdsItem(battle.p1.active[0], "Pick Up should not retrieve popped Air Balloon");
	});

	it('should not pick up items from Pokemon that have switched out and back in', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Gourgeist', ability: 'pickup', moves: ['shadowsneak']},
			{species: 'Aggron', ability: 'sturdy', moves: ['rest']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ambipom', ability: 'swarm', moves: ['uturn']},
			{species: 'Clefable', ability: 'unaware', item: 'ejectbutton', moves: ['followme']},
			{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
		]);
		battle.makeChoices('move shadowsneak, move rest', 'move uturn, move followme');
		battle.makeChoices('move shadowsneak, move rest', 'switch 3'); // Eject Button activated
		battle.makeChoices('move shadowsneak, move rest', 'switch 3');
		assert.false.holdsItem(battle.p1.active[0], "Pick Up should not retrieve Eject Button of returned Clefable");
	});

	it('should not pick up items from Pokemon that have switched out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gourgeist', ability: 'pickup', moves: ['shadowsneak', 'synthesis']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Ambipom', ability: 'swarm', item: 'buggem', moves: ['uturn']},
			{species: 'Dusknoir', ability: 'pressure', item: 'ejectbutton', moves: ['painsplit']},
		]);
		battle.makeChoices('move synthesis', 'move uturn');
		battle.makeChoices('move shadowsneak', 'switch 2');
		assert.false.holdsItem(battle.p1.active[0]);
		battle.makeChoices('move shadowsneak', 'move painsplit');
		battle.makeChoices('move shadowsneak', 'switch 2');
		assert.false.holdsItem(battle.p1.active[0]);
	});

	it('should not pick up items that were already retrieved', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ambipom', ability: 'pickup', moves: ['return']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aron', level: 1, ability: 'sturdy', item: 'berryjuice', moves: ['recycle']}]);
		battle.makeChoices('move return', 'move recycle');
		assert.false.holdsItem(battle.p1.active[0]);
	});

	it('should pick up items from adjacent allies', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Ambipom', ability: 'pickup', moves: ['protect']}, {species: 'Aron', level: 1, ability: 'sturdy', item: 'berryjuice', moves: ['followme']}],
			[{species: 'Ambipom', ability: 'technician', moves: ['return']}, {species: 'Arcanine', ability: 'flashfire', moves: ['protect']}],
		]);
		battle.makeChoices('move protect, move followme', 'move return, move protect');
		assert.holdsItem(battle.p1.active[0]);
	});

	it('should not pick up items from non-adjacent allies and enemies', function () {
		battle = common.createBattle({gameType: 'triples'});
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Ambipom', ability: 'pickup', moves: ['protect']},
			{species: 'Regirock', ability: 'sturdy', moves: ['curse']},
			{species: 'Arcanine', ability: 'flashfire', item: 'normalgem', moves: ['extremespeed']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Arcanine', ability: 'flashfire', item: 'firegem', moves: ['flamecharge']},
			{species: 'Aggron', ability: 'sturdy', moves: ['rest']},
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
		]);
		battle.makeChoices('move protect, move curse, move extremespeed', 'move flamecharge, move rest, move splash');
		assert.false.holdsItem(battle.p1.active[0]);
	});
});
