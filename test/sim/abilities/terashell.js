'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Tera Shell', function () {
	afterEach(() => battle.destroy());

	it(`should take not very effective damage when it is at full health`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['wickedblow']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [14, 16], `Tera Shell should yield not very effective damage roll, actual damage taken is ${damage}`);

		battle.makeChoices();
		assert.bounded(terapagos.maxhp - terapagos.hp - damage, [28, 33], `Tera Shell should not reduce damage, because Terapagos-Terastal was not at full HP`);
	});

	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893603
	it(`should not take precedence over immunities`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['shadowball']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		assert.fullHP(terapagos);
	});

	// kinda confirmed here: https://youtu.be/-nerhfXrmCM?si=hLzfrfzVDdfNFMbv&t=314
	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893781
	it('All hits of multi-hit move should be not very effective', function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['surgingstrikes']}],
		]);

		battle.makeChoices();
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [15, 18], `Tera Shell should yield not very effective damage for both all hits of multi-hit move, actual damage taken is ${damage}`);
	});

	// confirmed here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9893651
	it(`should be suppressed by Gastro Acid`, function () {
		battle = common.createBattle([
			[{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']}],
			[{species: 'Wynaut', moves: ['gastroacid', 'wickedblow']}],
		]);

		battle.makeChoices('move sleeptalk', 'move gastroacid');
		battle.makeChoices('move sleeptalk', 'move wickedblow');
		const terapagos = battle.p1.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [28, 33], `Tera Shell should not reduce damage, because Tera Shell should be suppressed`);
	});

	// TODO unconfirmed behavior, currently applies resistance to each type of a possibly multi-type pokemon
});
