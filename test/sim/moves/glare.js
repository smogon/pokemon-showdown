'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Glare', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should ignore natural type immunities', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Arbok", ability: 'noguard', moves: ['glare'] }] });
		battle.setPlayer('p2', { team: [{ species: "Gengar", ability: 'blaze', moves: ['bulkup'] }] });
		battle.makeChoices('move glare', 'move bulkup');
		assert.equal(battle.p2.active[0].status, 'par');
	});
});

describe('Glare [Gen 3]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not ignore natural type immunities', () => {
		battle = common.gen(3).createBattle([
			[{ species: "Arbok", ability: 'noguard', moves: ['glare'] }],
			[{ species: "Gengar", ability: 'blaze', moves: ['bulkup'] }],
		]);
		battle.makeChoices('move glare', 'move bulkup');
		assert.equal(battle.p2.active[0].status, '');
	});
});
