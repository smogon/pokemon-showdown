'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Synchronize', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should complete before Lum Berry can trigger`, () => {
		battle = common.createBattle([[
			{ species: 'alakazam', ability: 'synchronize', item: 'lumberry', moves: ['sleeptalk'] },
		], [
			{ species: 'ralts', ability: 'synchronize', item: 'lumberry', moves: ['glare'] },
		]]);
		battle.makeChoices();
		const alakazam = battle.p1.active[0];
		const ralts = battle.p2.active[0];
		assert.false.holdsItem(alakazam, `Alakazam should not be holding an item`);
		assert.false.holdsItem(ralts, `Ralts should not be holding an item`);
		assert.notEqual(alakazam.status, 'par', `Alakazam should not be paralyzed`);
		assert.notEqual(ralts.status, 'par', `Ralts should not be paralyzed`);
	});

	it(`should not be triggered by Toxic Spikes`, () => {
		battle = common.createBattle([[
			{ species: 'alakazam', moves: ['sleeptalk'] },
			{ species: 'ralts', ability: 'synchronize', moves: ['sleeptalk'] },
		], [
			{ species: 'charizard', moves: ['toxicspikes'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		assert.false(battle.p2.active[0].status);
	});

	describe('[Gen 4]', () => {
		it(`should not be triggered by Toxic Spikes`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'alakazam', moves: ['sleeptalk'] },
				{ species: 'ralts', ability: 'synchronize', moves: ['sleeptalk'] },
			], [
				{ species: 'charizard', moves: ['toxicspikes'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'auto');
			assert.false(battle.p2.active[0].status);
		});

		it(`should be triggered by Toxic Spikes if dragged in`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'alakazam', moves: ['sleeptalk'] },
				{ species: 'ralts', ability: 'synchronize', moves: ['sleeptalk'] },
			], [
				{ species: 'charizard', moves: ['toxicspikes'] },
				{ species: 'mewtwo', moves: ['roar'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('auto', 'switch 2');
			battle.makeChoices('auto', 'move roar');
			assert.equal(battle.p2.active[0].status, 'psn');
		});
	});
});
