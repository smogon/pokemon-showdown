'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("White Herb", () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should activate after Parting Shot drops both stats, but before the switch is resolved', () => {
		battle = common.createBattle([[
			{ species: 'torracat', moves: ['partingshot'] },
			{ species: 'litten', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', item: 'whiteherb', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
		assert.statStage(wynaut, 'spa', 0);
	});

	it('should activate after Costar', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'litten', moves: ['sleeptalk'] },
			{ species: 'blastoise', moves: ['shellsmash', 'sleeptalk'] },
			{ species: 'flamigo', item: 'whiteherb', ability: 'costar', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'torracat', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		const flamigo = battle.p1.active[0];
		assert.false.holdsItem(flamigo);
		assert.statStage(flamigo, 'atk', 2);
		assert.statStage(flamigo, 'spa', 2);
		assert.statStage(flamigo, 'spe', 2);
		assert.statStage(flamigo, 'def', 0);
		assert.statStage(flamigo, 'spd', 0);
	});

	it('should activate after Abilities that boost stats on KOs', () => {
		battle = common.createBattle([[
			{ species: 'litten', level: 1, ability: 'noguard', moves: ['sleeptalk'] },
			{ species: 'torracat', moves: ['partingshot'] },
		], [
			{ species: 'wynaut', item: 'whiteherb', ability: 'grimneigh', moves: ['dracometeor'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'spa', 0);
	});

	it('should activate after two Intimidate switch in at the same time', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'litten', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'torracat', ability: 'intimidate', moves: ['sleeptalk', 'finalgambit'] },
			{ species: 'litten', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'landorustherian', ability: 'intimidate', moves: ['sleeptalk'] },
		], [
			{ species: 'wynaut', item: 'whiteherb', moves: ['sleeptalk', 'recycle'] },
			{ species: 'fraxure', moves: ['sleeptalk'] },
		]]);

		// Leads
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);

		// After a double KO
		battle.makeChoices('move sleeptalk, move finalgambit -1', 'move recycle, move sleeptalk');
		battle.makeChoices('switch 3, switch 4');
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
	});

	it('should activate before Opportunist during switch-ins', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'axew', moves: ['sleeptalk'] },
			{ species: 'fraxure', moves: ['finalgambit'] },
			{ species: 'zacian', ability: 'intrepidsword', moves: ['sleeptalk'] },
			{ species: 'torracat', ability: 'intimidate', moves: ['sleeptalk'] },
		], [
			{ species: 'flittle', item: 'whiteherb', ability: 'opportunist', moves: ['sleeptalk'] },
			{ species: 'haxorus', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move sleeptalk, move finalgambit -1', 'auto');
		battle.makeChoices('switch 3, switch 4');
		const flittle = battle.p2.active[0];
		assert.false.holdsItem(flittle);
		assert.statStage(flittle, 'atk', 1);
	});
});
