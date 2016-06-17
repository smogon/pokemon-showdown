'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Levitate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should give the user an immunity to Ground-type moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rotom', ability: 'levitate', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aggron', ability: 'sturdy', moves: ['earthquake']}]);
		assert.false.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should make the user airborne', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Unown', ability: 'levitate', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Espeon', ability: 'magicbounce', moves: ['electricterrain']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'slp', "Levitate Pokémon should not be awaken by Electric Terrain");
	});

	it('should have its Ground immunity suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['earthquake']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'spikes']}]);
		battle.p2.chooseMove('spikes').foe.chooseDefault();
		assert.hurts(battle.p1.pokemon[1], () => battle.commitDecisions());
	});

	it('should not have its airborne property suppressed by Mold Breaker if it switches out via Eject Button', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cresselia', ability: 'levitate', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['tackle', 'spikes']}]);
		battle.p2.chooseMove('spikes').foe.chooseDefault();
		battle.commitDecisions();
		assert.false.hurts(battle.p1.pokemon[1], () => battle.p1.chooseSwitch(2));
	});

	it('should not have its airborne property suppressed by Mold Breaker if that Pokemon is no longer active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Forretress', ability: 'levitate', item: 'redcard', moves: ['spikes']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Haxorus', ability: 'moldbreaker', item: 'laggingtail', moves: ['tackle']},
			{species: 'Rotom', ability: 'levitate', moves: ['rest']},
		]);
		assert.false.hurts(battle.p2.active[0], () => battle.commitDecisions());
	});
});

describe('Levitate [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = common.gen(4).createBattle([
			[{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}, {species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}],
			[{species: 'Rampardos', ability: 'moldbreaker', moves: ['roar', 'spikes']}],
		]);
		battle.p2.chooseMove('spikes').foe.chooseDefault();
		assert.false.hurts(battle.p1.pokemon[1], () => battle.commitDecisions());
	});
});
