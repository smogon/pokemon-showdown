'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Recoil', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should deal damage to the user after an attack depending on the damage dealt', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Kartana", ability: 'noguard', moves: ['headcharge', 'doubleedge', 'headsmash'] }] });
		battle.setPlayer('p2', { team: [{ species: "Happiny", level: 50, ability: 'sturdy', moves: ['strengthsap'] }] });
		const recoilFactors = [0.25, 0.33, 0.5];
		for (let i = 0; i < 3; i++) {
			assert.hurtsBy(battle.p1.active[0], Math.round((battle.p2.active[0].maxhp - 1) * recoilFactors[i]), () => battle.makeChoices(`move ${i + 1}`, `move strengthsap`));
		}
	});

	it(`should deal 25% recoil for Head Charge`, () => {
		battle = common.createBattle([[
			{ species: 'Bouffalant', ability: 'soundproof', moves: ['headcharge'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const bouffalant = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move headcharge', 'move sleeptalk');
		const dealt = blissey.maxhp - blissey.hp;
		assert.equal(bouffalant.maxhp - bouffalant.hp, Math.round(dealt / 4));
	});
});
