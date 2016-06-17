'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Most status moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ignore natural type immunities', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'prankster', item: 'leftovers', moves: ['gastroacid', 'glare', 'confuseray', 'sandattack']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Klefki", ability: 'magician', happiness: 0, moves: ['return']},
			{species: "Dusknoir", ability: 'frisk', moves: ['shadowpunch']},
			{species: "Slaking", ability: 'truant', moves: ['shadowclaw']},
			{species: "Tornadus", ability: 'prankster', moves: ['tailwind']},
			{species: "Unown", ability: 'levitate', moves: ['hiddenpower']},
		]);
		battle.commitDecisions();
		assert.false.holdsItem(battle.p2.active[0]); // Klefki's Magician suppressed by Gastro Acid.
		p1.chooseMove('glare').foe.chooseSwitch(2); // Dusknoir
		assert.strictEqual(battle.p2.active[0].status, 'par');
		p1.chooseMove('confuseray').foe.chooseSwitch(3); // Slaking
		assert.ok(battle.p2.active[0].volatiles['confusion']);
		p1.chooseMove('sandattack').foe.chooseSwitch(4); // Tornadus
		assert.statStage(battle.p2.active[0], 'accuracy', -1);
		p1.chooseMove('sandattack').foe.chooseSwitch(5); // Unown (Levitate)
		assert.statStage(battle.p2.active[0], 'accuracy', -1);
	});

	it('should fail when the opposing Pokemon is immune to the status effect it sets', function () {
		this.timeout(0);

		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'noguard', item: 'laggingtail', moves: ['thunderwave', 'willowisp', 'poisongas', 'toxic']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Zapdos", ability: 'pressure', moves: ['charge']},
			{species: "Emboar", ability: 'blaze', moves: ['sleeptalk']},
			{species: "Muk", ability: 'stench', moves: ['shadowsneak']},
			{species: "Aron", ability: 'sturdy', moves: ['magnetrise']},
		]);

		p1.chooseMove('thunderwave').foe.chooseDefault();
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));

		p1.chooseMove('willowisp').foe.chooseSwitch(2); // Emboar
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));

		p1.chooseMove('poisongas').foe.chooseSwitch(3); // Muk
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));

		p1.chooseMove('toxic').foe.chooseDefault();
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));

		p1.chooseMove('poisongas').foe.chooseSwitch(4); // Aron
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));

		p1.chooseMove('toxic').foe.chooseDefault();
		assert.strictEqual(battle.p2.active[0].status, '');
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
	});
});

describe('Poison-inflicting status moves [Gen 2]', function () {
	const POISON_STATUS_MOVES = ['poisonpowder', 'poisongas', 'toxic'];

	afterEach(function () {
		battle.destroy();
	});

	it('should not ignore type immunities', function () {
		battle = common.gen(2).createBattle([
			[{species: "Smeargle", moves: POISON_STATUS_MOVES}],
			[{species: "Magneton", moves: ['sleeptalk']}],
		]);
		// Set all moves to perfect accuracy
		battle.on('Accuracy', battle.getFormat(), true);

		const target = battle.p2.active[0];
		POISON_STATUS_MOVES.forEach(move => {
			battle.p1.chooseMove(move);
			assert.constant(() => target.status, () => battle.commitDecisions());
		});
	});
});
