'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protean', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should change the user's type when using a move`, function () {
		battle = common.createBattle([[
			{species: "Cinderace", ability: 'protean', moves: ['highjumpkick']},
		], [
			{species: "Gengar", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Fighting'));
	});

	it.skip(`should activate on both turns of a charge move`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", ability: 'protean', moves: ['bounce']},
		], [
			{species: "Helioptile", ability: 'noguard', moves: ['soak']},
		]]);
		const wynaut = battle.p1.active[0];

		//Turn 1 of Bounce
		battle.makeChoices();
		assert(wynaut.hasType('Flying'));

		//Turn 2 of Bounce
		battle.makeChoices();
		assert(wynaut.hasType('Flying'));
	});

	it(`should not change the user's type when using moves that fail earlier than Protean will activate`, function () {
		battle = common.createBattle([[
			{species: "Kecleon", ability: 'protean', moves: ['fling', 'suckerpunch', 'steelroller', 'aurawheel']},
			{species: "Kecleon", ability: 'protean', moves: ['magnetrise', 'ingrain', 'burnup', 'auroraveil']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		let kecleon = battle.p1.active[0];

		// Fling with no item
		battle.makeChoices('move fling', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Fling changed the user's type when it should not have.");

		// Sucker Punch into status move
		battle.makeChoices('move suckerpunch', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Sucker Punch changed the user's type when it should not have.");

		// Steel Roller with no Terrain active
		battle.makeChoices('move steelroller', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Steel Roller changed the user's type when it should not have.");

		// Aura Wheel when user is not Morpeko
		battle.makeChoices('move aurawheel', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Aura Wheel changed the user's type when it should not have.");

		battle.makeChoices('switch 2', 'move sleeptalk');
		kecleon = battle.p1.active[0];

		// Burn Up when user is not Fire-type
		battle.makeChoices('move burnup', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Burn Up changed the user's type when it should not have.");

		// Aurora Veil when hail is not active
		battle.makeChoices('move auroraveil', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Aurora Veil changed the user's type when it should not have.");

		// Magnet Rise when user has Ingrain; note that Kecleon becomes Grass-type from Ingrain
		battle.makeChoices('move ingrain', 'move sleeptalk');
		battle.makeChoices('move magnetrise', 'move sleeptalk');
		assert(kecleon.hasType('Grass'), "Protean + Magnet Rise changed the user's type when it should not have.");

		// More examples: https://www.smogon.com/forums/threads/sword-shield-battle-mechanics-research.3655528/post-8548957
	});

	it(`should not change the user's type when abilities that activate earlier than Protean will cause the user's moves to fail`, function () {
		battle = common.createBattle([[
			{species: "Kecleon", ability: 'protean', moves: ['aquajet', 'mindblown']},
		], [
			{species: "Kyogre", ability: 'primordialsea', moves: ['sleeptalk']},
			{species: "Groudon", ability: 'desolateland', moves: ['powder']},
			{species: "Tsareena", ability: 'dazzling', moves: ['sleeptalk']},
			{species: "Golduck", ability: 'damp', moves: ['sleeptalk']},
		]]);

		const kecleon = battle.p1.active[0];

		// Primordial Sea
		battle.makeChoices('move mindblown', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), "Protean + Primordial Sea changed the user's type when it should not have.");

		// Desolate Land
		battle.makeChoices('move aquajet', 'switch 2');
		assert(kecleon.hasType('Normal'), "Protean + Desolate Land changed the user's type when it should not have.");

		// Powder
		battle.makeChoices('move mindblown', 'move powder');
		assert(kecleon.hasType('Normal'), "Protean + Powder changed the user's type when it should not have.");

		// Dazzling
		battle.makeChoices('move aquajet', 'switch 3');
		assert(kecleon.hasType('Normal'), "Protean + Dazzling changed the user's type when it should not have.");

		// Damp
		battle.makeChoices('move mindblown', 'switch 4');
		assert(kecleon.hasType('Normal'), "Protean + Damp changed the user's type when it should not have.");

		// More examples: https://www.smogon.com/forums/threads/sword-shield-battle-mechanics-research.3655528/post-8548957
	});
});
