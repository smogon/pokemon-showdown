'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Prankster', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should increase the priority of Status moves', function () {
		battle = common.createBattle([
			[{species: "Murkrow", ability: 'prankster', moves: ['taunt']}],
			[{species: "Deoxys-Speed", ability: 'pressure', moves: ['calmmind']}],
		]);
		battle.commitDecisions();
		assert.statStage(battle.p2.active[0], 'spa', 0);
	});

	it('should cause Status moves to fail against Dark Pokémon', function () {
		battle = common.createBattle([
			[{species: "Sableye", ability: 'prankster', moves: ['willowisp']}],
			[{species: "Sableye", ability: 'keeneye', moves: ['willowisp']}],
		]);
		assert.constant(() => battle.p2.active[0].status, () => battle.commitDecisions());
	});

	it('should cause bounced Status moves to fail against Dark Pokémon', function () {
		battle = common.createBattle([
			[{species: "Klefki", ability: 'prankster', moves: ['magiccoat']}],
			[{species: "Spiritomb", ability: 'pressure', moves: ['willowisp']}],
		]);
		assert.constant(() => battle.p2.active[0].status, () => battle.commitDecisions());
	});
});

describe('Prankster [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not cause Status moves to fail against Dark Pokémon', function () {
		battle = common.gen(6).createBattle([
			[{species: "Sableye", ability: 'prankster', moves: ['willowisp']}],
			[{species: "Sableye", ability: 'keeneye', moves: ['willowisp']}],
		]);
		assert.sets(() => battle.p2.active[0].status, 'brn', () => battle.commitDecisions());
	});
});
