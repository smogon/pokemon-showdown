'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Innards Out', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should deal damage equal to the total damage of a multi-hit move', () => {
		battle = common.createBattle([[
			{ species: "Breloom", item: 'loadeddice', moves: ['bulletseed'] },
		], [
			{ species: "Azurill", ability: 'innardsout', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const breloom = battle.p1.active[0];
		const azurill = battle.p2.active[0];
		assert.equal(breloom.hp, breloom.maxhp - azurill.maxhp);
	});

	it('should not accumulate damage dealt to its allies by a spread move', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Miraidon", ability: 'hadronengine', moves: ['discharge'] },
			{ species: "Breloom", moves: ['sleeptalk'] },
		], [
			{ species: "Azurill", level: 5, moves: ['sleeptalk'] },
			{ species: "Azurill", level: 5, ability: 'innardsout', moves: ['sleeptalk'] },
			{ species: "Azurill", level: 5, ability: 'innardsout', moves: ['sleeptalk'] },
			{ species: "Azurill", level: 5, ability: 'innardsout', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const miraidon = battle.p1.active[0];
		const azurill = battle.p2.active[0];
		assert.equal(miraidon.hp, miraidon.maxhp - azurill.maxhp);

		battle.makeChoices();
		battle.makeChoices();
		assert.equal(miraidon.hp, miraidon.maxhp - 3 * azurill.maxhp);
	});
});
