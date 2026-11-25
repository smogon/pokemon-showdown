'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Quick Claw', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('[Gen 4]', () => {
		it(`should order the previous turn's residuals using the next turn's activation`, () => {
			battle = common.gen(4).createBattle({ seed: [1, 2, 3, 3] }, [[
				{ species: 'Snorlax', level: 1, item: 'quickclaw', moves: ['toxic', 'growl'] },
			], [
				{ species: 'Mew', ability: 'noguard', moves: ['toxic', 'tackle'] },
			]]);

			const snorlax = battle.p1.active[0];
			const mew = battle.p2.active[0];
			const damageOrder = [];
			battle.onEvent('Damage', battle.format, (damage, pokemon, source, effect) => {
				if (effect.id === 'tox') damageOrder.push(pokemon.species.name);
			});
			assert.false(snorlax.quickClawRoll);
			battle.makeChoices();
			assert.deepEqual(damageOrder, ['Mew', 'Snorlax']);

			assert.false(snorlax.quickClawRoll);
			battle.makeChoices();
			assert.deepEqual(damageOrder, ['Mew', 'Snorlax', 'Snorlax', 'Mew']);

			assert(snorlax.quickClawRoll);
			battle.makeChoices('move growl', 'move tackle');
			assert.statStage(mew, 'atk', -1);
			assert.fainted(snorlax);
		});
	});

	describe('[Gen 3]', () => {
		it(`causes Speed ties with every holder when activated`, () => {
			battle = common.gen(3).createBattle({ seed: [163, 106, 112, 542] }, [[
				{ species: 'snorlax', item: 'quickclaw', moves: ['spore'] },
			], [
				{ species: 'deoxys', item: 'quickclaw', moves: ['seismictoss'] },
			]]);

			const snorlax = battle.p1.active[0];
			const deoxys = battle.p2.active[0];
			battle.quickClawRoll = true;
			battle.makeChoices();
			assert.fullHP(snorlax); // Snorlax wins the tie
			assert.equal(snorlax.speed, deoxys.speed);
			battle.quickClawRoll = true;
			battle.makeChoices();
			assert.false.fullHP(snorlax); // Deoxys wakes up and wins the tie
			assert.equal(snorlax.speed, deoxys.speed);
		});
	});

	describe('[Gen 2]', () => {
		it(`shares its activation roll with every holder on any given turn`, () => {
			battle = common.gen(2).createBattle({ seed: [1, 2, 3, 45] }, [[
				{ species: 'snorlax', item: 'quickclaw', moves: ['sleeptalk'] },
			], [
				{ species: 'mewtwo', item: 'quickclaw', moves: ['sleeptalk'] },
			]]);

			const snorlax = battle.p1.active[0];
			const mewtwo = battle.p2.active[0];
			battle.makeChoices(); // Quick Claw activates
			assert.equal(snorlax.speed, mewtwo.speed);
			battle.makeChoices(); // Quick Claw activates
			assert.equal(snorlax.speed, mewtwo.speed);
			battle.makeChoices(); // Quick Claw does not activate
			assert.notEqual(snorlax.speed, mewtwo.speed);
		});
	});
});
