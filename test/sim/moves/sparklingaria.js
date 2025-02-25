'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sparkling Aria', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should cure the target's burn`, () => {
		battle = common.createBattle([[
			{ species: 'Wynaut', ability: 'compoundeyes', moves: ['will-o-wisp', 'sparklingaria'] },
		], [
			{ species: 'Chansey', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('move sparklingaria', 'auto');
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should not cure the target's burn if the user fainted`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Shedinja', moves: ['sparklingaria'] },
			{ species: 'Wynaut', level: 1, ability: 'innardsout', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Chansey', moves: ['sleeptalk'] },
			{ species: 'Gengar', ability: 'compoundeyes', moves: ['willowisp'] },
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move willowisp -1');
		assert.equal(battle.p2.active[0].status, 'brn');
	});
});
