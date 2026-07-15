'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Recoil', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should deal damage to the user after an attack depending on the damage dealt', () => {
		battle = common.createBattle([[
			{ species: "Kartana", ability: 'compoundeyes', moves: ['headcharge', 'doubleedge', 'headsmash'] },
		], [
			{ species: "Happiny", level: 50, ability: 'sturdy', moves: ['strengthsap'] },
		]]);
		const recoilFactors = [0.25, 0.33, 0.5];
		for (let i = 0; i < 3; i++) {
			assert.hurtsBy(battle.p1.active[0], Math.round((battle.p2.active[0].maxhp - 1) * recoilFactors[i]), () => battle.makeChoices(`move ${i + 1}`, `move strengthsap`));
		}
	});

	it('[Gen 1] should deal recoil damage based on the damage dealt', () => {
		battle = common.gen(1).createBattle({ forceRandomChance: false }, [[
			{ species: "Snorlax", moves: ['doubleedge'] },
		], [
			{ species: "Chansey", moves: ['softboiled'] },
		]]);
		const snorlax = battle.p1.active[0];
		const chansey = battle.p2.active[0];
		const hp = snorlax.hp;

		battle.makeChoices();

		const damage = chansey.maxhp - chansey.hp;
		assert.equal(hp - snorlax.hp, Math.floor(damage * 33 / 100));
	});
});
