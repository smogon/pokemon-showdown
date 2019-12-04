'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disguise', function () {
	afterEach(() => battle.destroy());

	it('should block damage from one move', function () {
		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['psystrike']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should only block damage from the first hit of a move', function () {
		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Beedrill', ability: 'swarm', moves: ['twineedle']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should block a hit from confusion', function () {
		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Sableye', ability: 'prankster', moves: ['confuseray']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.ok(battle.p1.active[0].abilityData.busted);
	});

	it('should not block damage from weather effects', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Tyranitar', ability: 'sandstream', moves: ['rest']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should not block damage from entry hazards', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Zangoose', ability: 'toxicboost', item: 'laggingtail', moves: ['return']},
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [{species: 'forretress', ability: 'sturdy', item: 'redcard', moves: ['spikes']}]});
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it('should not block status moves or damage from status', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Ariados', ability: 'swarm', moves: ['toxicthread']}]});
		let pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'psn', () => battle.makeChoices());
		assert.statStage(pokemon, 'spe', -1);
		assert.false.fullHP(pokemon);
	});

	it('should not block secondary effects from damaging moves', function () {
		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Pikachu', ability: 'lightningrod', moves: ['nuzzle']}]});
		let pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'par', () => battle.makeChoices());
		assert.fullHP(pokemon);
	});

	it('should cause Counter to deal 1 damage if it blocks a move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [{species: 'Weavile', ability: 'pressure', moves: ['feintattack']}]});
		assert.hurtsBy(battle.p2.active[0], 1, () => battle.makeChoices());
	});

	it.skip('should not trigger critical hits while active', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mimikyu', ability: 'disguise', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [{species: 'Cryogonal', ability: 'noguard', moves: ['frostbreath']}]});
		let successfulEvent = false;
		battle.onEvent('Damage', battle.format, function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(!defender.getMoveHitData(move).crit);
			}
		});
		battle.makeChoices();
		assert.ok(successfulEvent);
	});
});
