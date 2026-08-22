'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Natural Cure', () => {
	it('should cure even when phased out by Roar', () => {
		battle = common.createBattle([[
			{ species: 'Celebi', ability: 'naturalcure', moves: ['leechseed'] },
			{ species: 'Swampert', ability: 'torrents', moves: ['surf'] },
		], [
			{ species: 'Zapdos', ability: 'pressure', moves: ['thunderwave', 'roar'] },
		]]);
		battle.makeChoices('move leechseed', 'move thunderwave');
		battle.makeChoices('move leechseed', 'move roar');
		assert.notEqual(battle.p1.pokemon[1].status, 'par');
	});

	it('should not cure if suppressed by Gastro Acid', () => {
		battle = common.createBattle([[
			{ species: 'Celebi', ability: 'naturalcure', moves: ['sleeptalk'] },
			{ species: 'Swampert', moves: ['sleeptalk'] },
		], [
			{ species: 'Zapdos', moves: ['gastroacid', 'thunderwave'] },
		]]);
		const celebi = battle.p1.pokemon[0];
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'move thunderwave');
		assert.equal(celebi.status, 'par');
		battle.makeChoices('switch 2', 'move thunderwave');
		assert.equal(celebi.status, 'par');
	});

	describe('[Gen 4]', () => {
		it('should cure even if suppressed by Gastro Acid', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Celebi', ability: 'naturalcure', moves: ['sleeptalk'] },
				{ species: 'Swampert', moves: ['sleeptalk'] },
			], [
				{ species: 'Zapdos', moves: ['gastroacid', 'thunderwave'] },
			]]);
			const celebi = battle.p1.pokemon[0];
			battle.makeChoices();
			battle.makeChoices('move sleeptalk', 'move thunderwave');
			assert.equal(celebi.status, 'par');
			battle.makeChoices('switch 2', 'move thunderwave');
			assert.equal(celebi.status, '');
		});
	});
});
