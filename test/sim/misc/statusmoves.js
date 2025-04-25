'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Most status moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should ignore natural type immunities', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Smeargle", ability: 'prankster', item: 'leftovers', moves: ['gastroacid', 'glare', 'confuseray', 'sandattack'] }] });
		battle.setPlayer('p2', { team: [
			{ species: "Klefki", ability: 'magician', happiness: 0, moves: ['return'] },
			{ species: "Dusknoir", ability: 'frisk', moves: ['shadowpunch'] },
			{ species: "Slaking", ability: 'truant', moves: ['shadowclaw'] },
			{ species: "Tornadus", ability: 'prankster', moves: ['tailwind'] },
			{ species: "Unown", ability: 'levitate', moves: ['hiddenpower'] },
		] });
		battle.makeChoices('move gastroacid', 'move return');
		assert.false.holdsItem(battle.p2.active[0]); // Klefki's Magician suppressed by Gastro Acid.
		battle.makeChoices('move glare', 'switch 2'); // Dusknoir
		assert.equal(battle.p2.active[0].status, 'par');
		battle.makeChoices('move confuseray', 'switch 3'); // Slaking
		assert(battle.p2.active[0].volatiles['confusion']);
		battle.makeChoices('move sandattack', 'switch 4'); // Tornadus
		assert.statStage(battle.p2.active[0], 'accuracy', -1);
		battle.makeChoices('move sandattack', 'switch 5'); // Unown (Levitate)
		assert.statStage(battle.p2.active[0], 'accuracy', -1);
	});

	it(`should fail when the opposing Pokemon is immune to the status effect it sets`, () => {
		battle = common.createBattle([[
			{ species: 'Smeargle', ability: 'noguard', item: 'laggingtail', moves: ['thunderwave', 'willowisp', 'poisongas', 'toxic'] },
		], [
			{ species: 'Zapdos', moves: ['charge'] },
			{ species: 'Emboar', moves: ['sleeptalk'] },
			{ species: 'Muk', moves: ['shadowsneak'] },
			{ species: 'Aron', moves: ['magnetrise'] },
		]]);

		battle.makeChoices('move thunderwave', 'move charge');
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));

		battle.makeChoices('move willowisp', 'switch 2'); // Emboar
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));

		battle.makeChoices('move poisongas', 'switch 3'); // Muk
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));

		battle.makeChoices('move toxic', 'move shadowsneak');
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));

		battle.makeChoices('move poisongas', 'switch 4'); // Aron
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));

		battle.makeChoices('move toxic', 'move magnetrise');
		assert.equal(battle.p2.active[0].status, '');
		assert(battle.log[battle.lastMoveLine + 3].startsWith('|-immune|'));
	});
});

describe('Poison-inflicting status moves [Gen 2]', () => {
	const POISON_STATUS_MOVES = ['poisonpowder', 'poisongas', 'toxic'];

	afterEach(() => {
		battle.destroy();
	});

	it('should not ignore type immunities', () => {
		battle = common.gen(2).createBattle([
			[{ species: "Smeargle", moves: POISON_STATUS_MOVES }],
			[{ species: "Magneton", moves: ['sleeptalk'] }],
		]);
		// Set all moves to perfect accuracy
		battle.onEvent('Accuracy', battle.format, true);

		const target = battle.p2.active[0];
		for (const move of POISON_STATUS_MOVES) {
			assert.constant(() => target.status, () => battle.makeChoices('move ' + move, 'move sleeptalk'));
		}
	});
});
