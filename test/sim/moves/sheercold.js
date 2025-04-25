'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sheer Cold', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not affect Ice-type Pokémon', () => {
		battle = common.createBattle([
			[{ species: "Deoxys-Speed", ability: 'noguard', moves: ['sheercold'] }],
			[{ species: "Arceus-Ice", item: 'icicleplate', ability: 'multitype', moves: ['calmmind'] }],
		]);
		battle.makeChoices('move sheercold', 'move calmmind');
		assert.false.fainted(battle.p2.active[0]);
	});
});

describe('Sheer Cold [Gen 6]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should affect Ice-type Pokémon', () => {
		battle = common.gen(6).createBattle([
			[{ species: "Deoxys-Speed", ability: 'noguard', moves: ['sheercold'] }],
			[{ species: "Arceus-Ice", item: 'icicleplate', ability: 'multitype', moves: ['calmmind'] }],
		]);
		battle.makeChoices('move sheercold', 'move calmmind');
		assert.fainted(battle.p2.active[0]);
	});
});
