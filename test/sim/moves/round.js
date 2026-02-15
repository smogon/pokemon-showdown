'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Round', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should pierce through substitutes', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'round'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }] });
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move round', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('is boosted if it was used prior in the turn and called by Instruct or Encore', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Aurorus", ability: 'refrigerate', moves: ['sleeptalk', 'round'], evs: { spe: 252 } },
			{ species: "Aurorus", ability: 'refrigerate', moves: ['sleeptalk', 'round'] },
		], [
			{ species: "Carnivine", moves: ['sleeptalk', 'encore'], evs: { spe: 252 } },
			{ species: "Carnivine", moves: ['sleeptalk'] },
			{ species: "Carnivine", moves: ['instruct'] },
			{ species: "Carnivine", moves: ['sleeptalk'], level: 1 },
		]]);
		battle.makeChoices('move sleeptalk, move round 2', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move round 2, move sleeptalk', 'move encore 2, move sleeptalk');
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
		battle.makeChoices();
		battle.makeChoices('move sleeptalk, move round 2', 'move instruct 2, move sleeptalk');
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});

	it('should not take priority over abilities', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Charizard", moves: ['round'] },
			{ species: "Venusaur", moves: ['round'] },
		], [
			{ species: "Blissey", item: 'ejectbutton', moves: ['sleeptalk'] },
			{ species: "Blastoise", moves: ['sleeptalk'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move round 1, move round 1', 'auto');
		battle.makeChoices();
		const log = battle.getDebugLog();
		const intimidateIndex = log.lastIndexOf('|-ability|p2a: Incineroar|Intimidate|boost');
		const roundIndex = log.lastIndexOf('|move|p1b: Venusaur|Round|p2a: Incineroar|[from] move: Round');
		assert(intimidateIndex < roundIndex, 'Intimidate should activate before the rest of the Round attacks');
	});
});

describe('Round [Gen 5]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not pierce through substitutes', () => {
		battle = common.gen(5).createBattle([
			[{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'round'] }],
			[{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }],
		]);

		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move round', 'move rest');
		assert.equal(battle.p2.active[0].item, 'focussash');
	});
});
