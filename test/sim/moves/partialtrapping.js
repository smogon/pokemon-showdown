'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Partial trapping moves [Gen 1 Stadium]`, () => {
	afterEach(() => {
		battle.destroy();
	});

	// Wrap is 85% accurate, so these tests use a seed where the first Wrap hits
	// (checked by asserting that the trapping lock exists).
	const SEED = [1, 2, 3, 4];

	it(`should continue to hit the same target while it stays in`, () => {
		battle = common.mod('gen1stadium').createBattle({ seed: SEED }, [[
			{ species: 'Dragonite', moves: ['wrap', 'strength'] },
		], [
			{ species: 'Chansey', moves: ['softboiled'] },
			{ species: 'Snorlax', moves: ['bodyslam'] },
		]]);
		const dragonite = battle.p1.active[0];
		const chansey = battle.p2.active[0];
		battle.makeChoices('move wrap', 'move softboiled');
		assert(dragonite.volatiles['partialtrappinglock'], 'Wrap should have hit and locked Dragonite in');
		const hp = chansey.hp;
		battle.makeChoices('move wrap', 'move 1');
		assert(chansey.hp < hp, 'Wrap should keep hitting a target that stays in');
	});

	it(`should miss and end the lock when the target switches`, () => {
		battle = common.mod('gen1stadium').createBattle({ seed: SEED }, [[
			{ species: 'Dragonite', moves: ['wrap', 'strength'] },
		], [
			{ species: 'Chansey', moves: ['softboiled'] },
			{ species: 'Snorlax', moves: ['bodyslam'] },
		]]);
		const dragonite = battle.p1.active[0];
		battle.makeChoices('move wrap', 'move softboiled');
		assert(dragonite.volatiles['partialtrappinglock'], 'Wrap should have hit and locked Dragonite in');

		battle.makeChoices('move wrap', 'switch 2');
		const snorlax = battle.p2.active[0];
		assert.equal(snorlax.species.id, 'snorlax');
		assert.fullHP(snorlax, 'Wrap should not hit the Pokemon that switched in');
		assert.false(snorlax.volatiles['partiallytrapped'], 'The Pokemon that switched in should not be trapped');
		assert.false(dragonite.volatiles['partialtrappinglock'], 'Dragonite should no longer be locked into Wrap');
		assert(battle.log.includes('|-miss|p1a: Dragonite'), 'Wrap should miss');

		// The wrapper is free to choose any move on the next turn
		assert.equal(battle.p1.activeRequest.active[0].moves.length, 2);
		battle.makeChoices('move strength', 'move bodyslam');
		assert.false.fullHP(snorlax);
	});

	it(`should not use up PP when the target switches`, () => {
		battle = common.mod('gen1stadium').createBattle({ seed: SEED }, [[
			{ species: 'Dragonite', moves: ['wrap', 'strength'] },
		], [
			{ species: 'Chansey', moves: ['softboiled'] },
			{ species: 'Snorlax', moves: ['bodyslam'] },
		]]);
		const dragonite = battle.p1.active[0];
		battle.makeChoices('move wrap', 'move softboiled');
		const pp = dragonite.getMoveData('wrap').pp;
		battle.makeChoices('move wrap', 'switch 2');
		assert.equal(dragonite.getMoveData('wrap').pp, pp);
	});
});
