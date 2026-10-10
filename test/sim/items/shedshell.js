'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shed Shell', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should allow Pokemon to escape trapping abilities', () => {
		battle = common.createBattle([[
			{ species: "Gothitelle", ability: 'shadowtag', moves: ['calmmind'] },
		], [
			{ species: "Starmie", ability: 'naturalcure', item: 'shedshell', moves: ['recover'] },
			{ species: "Heatran", ability: 'flashfire', moves: ['rest'] },
		]]);
		battle.makeChoices('move calmmind', 'switch 2');
		assert.species(battle.p2.active[0], 'Heatran');
	});

	it('should allow Pokemon to escape from most moves that would trap them', () => {
		battle = common.createBattle([[
			{ species: "Gengar", ability: 'levitate', moves: ['meanlook'] },
		], [
			{ species: "Venusaur", ability: 'overgrow', item: 'shedshell', moves: ['ingrain'] },
			{ species: "Heatran", ability: 'flashfire', moves: ['rest'] },
		]]);
		battle.makeChoices('move meanlook', 'move ingrain');
		battle.makeChoices('move meanlook', 'switch 2');
		assert.species(battle.p2.active[0], 'Heatran');
	});

	it('should not allow Pokemon to escape from Sky Drop', () => {
		battle = common.createBattle([[
			{ species: "Dragonite", ability: 'multiscale', moves: ['skydrop'] },
		], [
			{ species: "Magnezone", ability: 'sturdy', item: 'shedshell', moves: ['sleeptalk'] },
			{ species: "Heatran", ability: 'flashfire', moves: ['rest'] },
		]]);
		battle.makeChoices('move skydrop', 'move sleeptalk');
		assert.trapped(() => battle.makeChoices('move skydrop', 'switch 2'));
		assert.species(battle.p2.active[0], 'Magnezone');
	});
});
