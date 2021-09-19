'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Ice Face', function () {
	afterEach(() => battle.destroy());

	it(`should block damage from one physical move per Hail`, function () {
		battle = common.createBattle([[
			{species: 'Eiscue', ability: 'iceface', moves: ['splash']},
		], [
			{species: 'Mewtwo', ability: 'pressure', moves: ['tackle', 'watergun', 'hail']},
		]]);
		const eiscue = battle.p1.active[0];

		assert.hurts(eiscue, () => battle.makeChoices('auto', 'move watergun'));
		assert.false.hurts(eiscue, () => battle.makeChoices());
		assert.hurts(eiscue, () => battle.makeChoices());
		assert.false.hurts(eiscue, () => battle.makeChoices('auto', 'move hail'));
		assert.false.hurts(eiscue, () => battle.makeChoices());
		assert.hurts(eiscue, () => battle.makeChoices());
	});

	it(`should not trigger if the Pokemon was KOed`, function () {
		battle = common.createBattle([[
			{species: 'Eiscue', level: 1, ability: 'iceface', moves: ['sleeptalk']},
		], [
			{species: 'Weavile', moves: ['icepunch']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move icepunch dynamax');
		const activate = '|-activate';
		const battleLog = battle.log.join('\n');
		const firstIndex = battleLog.indexOf(activate);
		const hasMultipleActivates = (firstIndex !== -1) && (firstIndex !== battleLog.lastIndexOf(activate));
		assert.false(hasMultipleActivates, "Ice Face should not trigger when being KOed. Only one |-activate| should exist in this test.");
	});

	it.skip(`should reform Ice Face on switchin after all entrance Abilities occur`, function () {
		battle = common.createBattle([[
			{species: 'Eiscue', ability: 'iceface', moves: ['sleeptalk']},
			{species: 'Abomasnow', ability: 'snowwarning', moves: ['sleeptalk']},
		], [
			{species: 'Guzzlord', moves: ['tackle', 'finalgambit']},
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
		]]);
		const eiscue = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices('switch 2', 'move finalgambit'); // hail activates
		battle.makeChoices('switch 2', 'switch 2'); // sun should activate first, even though Torkoal is slower, so Ice Face misses the timing
		assert.species(eiscue, 'Eiscue-Noice');
	});
});
