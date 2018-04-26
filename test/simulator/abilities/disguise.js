'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disguise', function () {
	afterEach(() => battle.destroy());

	it('should block damage from one move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['psystrike']}]);
		assert.false.hurts(battle.p1.active[0], () => battle.commitDecisions());
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should only block damage from the first hit of a move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Beedrill', ability: 'swarm', moves: ['twineedle']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should block a hit from confusion', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['confuseray']}]);
		assert.false.hurts(battle.p1.active[0], () => battle.commitDecisions());
		assert.ok(battle.p1.active[0].abilityData.busted);
	});

	it('should not block damage from weather effects', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Tyranitar', ability: 'sandstream', moves: ['rest']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should not block damage from entry hazards', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Zangoose', ability: 'toxicboost', item: 'laggingtail', moves: ['return']},
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'forretress', ability: 'sturdy', item: 'redcard', moves: ['spikes']}]);
		battle.commitDecisions();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it('should not block status moves or damage from status', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Ariados', ability: 'swarm', moves: ['toxicthread']}]);
		let pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'psn', () => battle.commitDecisions());
		assert.statStage(pokemon, 'spe', -1);
		assert.false.fullHP(pokemon);
	});

	it('should not block secondary effects from damaging moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Pikachu', ability: 'lightningrod', moves: ['nuzzle']}]);
		let pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'par', () => battle.commitDecisions());
		assert.fullHP(pokemon);
	});

	it('should cause Counter to deal 1 damage if it blocks a move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Weavile', ability: 'pressure', moves: ['feintattack']}]);
		assert.hurtsBy(battle.p2.active[0], 1, () => battle.commitDecisions());
	});

	it.skip('should not trigger critical hits while active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'noguard', moves: ['frostbreath']}]);
		let successfulEvent = false;
		battle.onEvent('Damage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(!move.crit);
			}
		});
		battle.commitDecisions();
		assert.ok(successfulEvent);
	});
});
