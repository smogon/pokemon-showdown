'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flower Veil', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should block status conditions and stat drops on Grass-type Pokemon and its allies`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Breloom', moves: ['sleeptalk'] },
			{ species: 'Venusaur', ability: 'flowerveil', moves: ['sleeptalk'] },
		], [
			{ species: 'Persian', moves: ['sandattack'] },
			{ species: 'Raticate', moves: ['glare'] },
		]]);

		battle.makeChoices('auto', 'move sandattack 1, move glare 1');
		battle.makeChoices('auto', 'move sandattack 2, move glare 2');

		const breloom = battle.p1.active[0];
		const venusaur = battle.p1.active[1];

		assert.equal(breloom.status, '');
		assert.equal(venusaur.status, '');
		assert.statStage(breloom, 'accuracy', 0);
		assert.statStage(venusaur, 'accuracy', 0);
	});

	it(`should not stop an ally from falling asleep when Yawn was already affecting it`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Breloom', moves: ['sleeptalk'] },
			{ species: 'Heatran', moves: ['sleeptalk'] },
			{ species: 'Florges', ability: 'flowerveil', moves: ['sleeptalk'] },
		], [
			{ species: 'Persian', moves: ['sleeptalk', 'yawn'] },
			{ species: 'Raticate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move yawn 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, switch 3', 'move sleeptalk, move sleeptalk');
		const breloom = battle.p1.active[0];
		assert.equal(breloom.status, 'slp');
	});

	it(`should not block self-inflicted stat drops`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Sceptile', ability: 'flowerveil', moves: ['superpower'] },
			{ species: 'Lilligant', ability: 'weakarmor', moves: ['sleeptalk'] },
		], [
			{ species: 'Shuckle', moves: ['tackle'] },
			{ species: 'Raticate', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move superpower 2, move sleeptalk', 'move tackle 2, move sleeptalk');
		const sceptile = battle.p1.active[0];
		assert.statStage(sceptile, 'atk', -1);
		assert.statStage(sceptile, 'def', -1);
		const lilligant = battle.p1.active[1];
		assert.statStage(lilligant, 'def', -1);
		assert.statStage(lilligant, 'spe', 2);
	});
});
