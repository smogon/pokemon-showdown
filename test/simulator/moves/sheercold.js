'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sheer Cold', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not affect Ice-type Pokémon', function () {
		battle = common.createBattle([
			[{species: "Deoxys-Speed", ability: 'noguard', moves: ['sheercold']}],
			[{species: "Arceus-Ice", item: 'icicleplate', ability: 'multitype', moves: ['calmmind']}],
		]);
		battle.commitDecisions();
		assert.false.fainted(battle.p2.active[0]);
	});
});

describe('Sheer Cold [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should affect Ice-type Pokémon', function () {
		battle = common.gen(6).createBattle([
			[{species: "Deoxys-Speed", ability: 'noguard', moves: ['sheercold']}],
			[{species: "Arceus-Ice", item: 'icicleplate', ability: 'multitype', moves: ['calmmind']}],
		]);
		battle.commitDecisions();
		assert.fainted(battle.p2.active[0]);
	});
});
