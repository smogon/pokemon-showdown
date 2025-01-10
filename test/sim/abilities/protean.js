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
			{species: 'Cinderace', ability: 'protean', moves: ['highjumpkick']},
		], [
			{species: 'Gengar', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Fighting'));
	});

	it(`should change the user's type for submoves to the type of that submove, not the move calling it`, function () {
		battle = common.gen(6).createBattle([[
			{species: 'Wynaut', ability: 'protean', moves: ['sleeptalk', 'flamethrower']},
		], [
			{species: 'Regieleki', moves: ['spore']},
		]]);

		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		assert(battle.log.every(line => !line.includes('|Normal|')), `It should not temporarily become Normal-type`);
		assert(wynaut.hasType('Fire'));
	});

	it(`should not change the user's type when using moves that fail earlier than Protean will activate`, function () {
		battle = common.createBattle([[
			{species: 'Kecleon', ability: 'protean', moves: ['fling', 'suckerpunch', 'steelroller', 'aurawheel']},
			{species: 'Kecleon', ability: 'protean', moves: ['counter', 'metalburst']},
			{species: 'Kecleon', ability: 'protean', moves: ['magnetrise', 'ingrain', 'burnup', 'auroraveil']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		let kecleon = battle.p1.active[0];

		battle.makeChoices('move fling', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Fling was used with no item.`);

		battle.makeChoices('move suckerpunch', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Sucker Punch was used into a status move.`);

		battle.makeChoices('move steelroller', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Steel Roller was used with no Terrain active.`);

		battle.makeChoices('move aurawheel', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Aura Wheel was used by non-Morpeko.`);

		battle.makeChoices('switch 2', 'auto');
		kecleon = battle.p1.active[0];

		battle.makeChoices('move counter', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Counter failed to return damage.`);

		battle.makeChoices('move metalburst', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Metal Burst failed to return damage.`);

		battle.makeChoices('switch 3', 'auto');
		kecleon = battle.p1.active[0];

		battle.makeChoices('move burnup', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a non-Fire type used Burn Up.`);

		battle.makeChoices('move auroraveil', 'auto');
		assert(kecleon.hasType('Normal'), `Protean changed typing when Aurora Veil used out of Hail.`);

		battle.makeChoices('move ingrain', 'auto');
		battle.makeChoices('move magnetrise', 'auto');
		assert(kecleon.hasType('Grass'), `Protean changed typing when Magnet Rise was used while the effect of Ingrain was active.`);

		// More examples: https://www.smogon.com/forums/threads/sword-shield-battle-mechanics-research.3655528/post-8548957
	});

	it(`should not change the user's type when abilities that activate earlier than Protean will cause the user's moves to fail`, function () {
		battle = common.createBattle([[
			{species: 'Kecleon', ability: 'protean', moves: ['aquajet', 'mindblown']},
		], [
			{species: 'Kyogre', ability: 'primordialsea', moves: ['sleeptalk']},
			{species: 'Groudon', ability: 'desolateland', moves: ['powder']},
			{species: 'Tsareena', ability: 'dazzling', moves: ['sleeptalk']},
			{species: 'Golduck', ability: 'damp', moves: ['sleeptalk']},
		]]);

		const kecleon = battle.p1.active[0];

		battle.makeChoices('move mindblown', 'move sleeptalk');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a Fire-type attack was used in Primordial Sea.`);

		battle.makeChoices('move aquajet', 'switch 2');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a Water-type attack was used in Desolate Land.`);

		battle.makeChoices('move mindblown', 'move powder');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a Fire-type attack was used while the user was affected by Powder.`);

		battle.makeChoices('move aquajet', 'switch 3');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a priority move was blocked by Dazzling.`);

		battle.makeChoices('move mindblown', 'switch 4');
		assert(kecleon.hasType('Normal'), `Protean changed typing when a exploding move was blocked by Damp.`);

		// More examples: https://www.smogon.com/forums/threads/sword-shield-battle-mechanics-research.3655528/post-8548957
	});

	it(`should not allow the user to change its typing twice`, function () {
		battle = common.createBattle([[
			{species: 'Cinderace', ability: 'protean', moves: ['tackle', 'watergun']},
		], [
			{species: 'Gengar', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Normal'));

		battle.makeChoices('move watergun', 'auto');
		assert.false(cinder.hasType('Water'));
	});

	it(`should not allow the user to change its typing twice if the Ability was suppressed`, function () {
		battle = common.createBattle([[
			{species: 'Cinderace', ability: 'protean', moves: ['tackle', 'watergun']},
		], [
			{species: 'Gengar', moves: ['sleeptalk']},
			{species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move tackle', 'auto');
		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Normal'));

		battle.makeChoices('move watergun', 'switch 2');
		battle.makeChoices('move watergun', 'switch 2');

		assert.false(cinder.hasType('Water'));
	});

	it(`should allow the user to change its typing twice if it lost and regained the Ability`, function () {
		battle = common.createBattle([[
			{species: 'Cinderace', ability: 'protean', moves: ['tackle', 'watergun']},
		], [
			{species: 'Gengar', ability: 'protean', moves: ['sleeptalk', 'skillswap']},
		]]);

		battle.makeChoices('move tackle', 'move skillswap');
		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Normal'));

		battle.makeChoices('move watergun', 'auto');
		assert(cinder.hasType('Water'));
	});

	it(`should not be prevented from resetting its effectState by Ability suppression`, function () {
		battle = common.createBattle([[
			{species: 'Cinderace', ability: 'protean', moves: ['tackle']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Gengar', ability: 'protean', moves: ['sleeptalk']},
			{species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move tackle', 'auto');
		battle.makeChoices('move tackle', 'switch 2'); // Weezing comes in
		battle.makeChoices('switch 2', 'auto'); // Cinderace switches out and back in
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('move tackle', 'switch 2'); // Weezing switches out

		const cinder = battle.p1.active[0];
		assert(cinder.hasType('Normal'));
	});

	describe('Gen 6-8', function () {
		it(`should activate on both turns of a charge move`, function () {
			battle = common.gen(8).createBattle([[
				{species: 'Wynaut', ability: 'protean', moves: ['bounce']},
			], [
				{species: 'Helioptile', ability: 'noguard', moves: ['soak']},
			]]);
			const wynaut = battle.p1.active[0];

			//Turn 1 of Bounce
			battle.makeChoices();
			assert(wynaut.hasType('Flying'));

			//Turn 2 of Bounce
			battle.makeChoices();
			assert(wynaut.hasType('Flying'));
		});
	});
});
