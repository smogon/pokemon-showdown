'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Focus Punch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause the user to lose focus if hit by an attacking move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf']}]});
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not cause the user to lose focus if hit by a status move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['toxic']}]});
		battle.makeChoices('move focuspunch', 'move toxic');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not cause the user to lose focus if hit while behind a substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['substitute', 'focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf']}]});
		battle.makeChoices('move substitute', 'move magicalleaf');
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should cause the user to lose focus if hit by a move called by Nature Power', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['naturepower']}]});
		battle.makeChoices('move focuspunch', 'move naturepower');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not cause the user to lose focus on later uses of Focus Punch if hit', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move focuspunch', 'move toxic');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should cause the user to lose focus if hit by an attacking move followed by a status move in one turn', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}, {species: 'Blissey', ability: 'naturalcure', moves: ['softboiled']}],
			[{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf']}, {species: 'Ivysaur', ability: 'overgrow', moves: ['toxic']}],
		]);
		battle.makeChoices('move focuspunch 1, move softboiled', 'move magicalleaf 1, move toxic 1');
		assert.equal(battle.p1.active[0].status, 'tox');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not deduct PP if the user lost focus', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});

		const move = battle.p1.active[0].getMoveData(Dex.getMove('focuspunch'));
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		assert.equal(move.pp, move.maxpp);
		battle.makeChoices('move focuspunch', 'move toxic');
		assert.equal(move.pp, move.maxpp - 1);
	});

	it('should deduct PP if the user lost focus before Gen 5', function () {
		battle = common.gen(4).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});

		const move = battle.p1.active[0].getMoveData(Dex.getMove('focuspunch'));
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		assert.equal(move.pp, move.maxpp - 1);
		battle.makeChoices('move focuspunch', 'move toxic');
		assert.equal(move.pp, move.maxpp - 2);
	});

	it('should not tighten the pokemon\'s focus when Dynamaxing', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});

		battle.makeChoices('move focuspunch dynamax', 'move magicalleaf');
		const tighteningFocusMessage = battle.log.filter(str => str === '|-singleturn|p1a: Chansey|move: Focus Punch');

		assert.equal(tighteningFocusMessage.length, 0);
	});

	it('should not tighten the pokemon\'s focus when already Dynamaxed', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});

		battle.makeChoices('move focuspunch dynamax', 'move magicalleaf');
		battle.makeChoices('move focuspunch', 'move magicalleaf');
		const tighteningFocusMessage = battle.log.filter(str => str === '|-singleturn|p1a: Chansey|move: Focus Punch');
		assert.equal(tighteningFocusMessage.length, 0);
	});

	it('should tighten the pokemon\'s focus when not Dynamaxed', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Chansey', ability: 'naturalcure', moves: ['focuspunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Venusaur', ability: 'overgrow', moves: ['magicalleaf', 'toxic']}]});

		battle.makeChoices('move focuspunch', 'move magicalleaf');
		const tighteningFocusMessage = battle.log.filter(str => str === '|-singleturn|p1a: Chansey|move: Focus Punch');
		assert.equal(tighteningFocusMessage.length, 1);
	});
});
