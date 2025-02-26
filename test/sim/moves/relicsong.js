'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Relic Song', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should transform Meloetta into its Pirouette forme', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Meloetta", ability: 'serenegrace', moves: ['relicsong'] }] });
		battle.setPlayer('p2', { team: [{ species: "Registeel", ability: 'clearbody', moves: ['rest'] }] });
		battle.makeChoices('move relicsong', 'move rest');
		assert.equal(battle.p1.active[0].species.id, 'meloettapirouette');
	});

	it('should transform Meloetta-Pirouette into its Aria forme', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Meloetta-Pirouette", ability: 'serenegrace', moves: ['relicsong'] }] });
		battle.setPlayer('p2', { team: [{ species: "Registeel", ability: 'clearbody', moves: ['rest'] }] });
		battle.makeChoices('move relicsong', 'move rest');
		assert.equal(battle.p1.active[0].species.id, 'meloetta');
	});

	it('should pierce through substitutes', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'relicsong'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }] });
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move relicsong', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});
});

describe('Relic Song [Gen 5]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not pierce through substitutes', () => {
		battle = common.gen(5).createBattle([
			[{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'relicsong'] }],
			[{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }],
		]);
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move relicsong', 'move rest');
		assert.equal(battle.p2.active[0].item, 'focussash');
	});

	it('should transform Meloetta into its Pirouette forme even if it hits a substitute', () => {
		battle = common.createBattle([
			[{ species: "Meloetta", ability: 'serenegrace', moves: ['relicsong'] }],
			[{ species: "Registeel", ability: 'prankster', moves: ['substitute'] }],
		]);
		battle.makeChoices('move relicsong', 'move substitute');
		assert.equal(battle.p1.active[0].species.id, 'meloettapirouette');
	});
});
