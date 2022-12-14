'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Recoil', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal damage to the user after an attack depending on the damage dealt', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Kartana", ability: 'compoundeyes', moves: ['headcharge', 'doubleedge', 'headsmash']}]});
		battle.setPlayer('p2', {team: [{species: "Happiny", level: 50, ability: 'sturdy', moves: ['strengthsap']}]});
		const recoilFactors = [0.25, 0.33, 0.5];
		for (let i = 0; i < 3; i++) {
			assert.hurtsBy(battle.p1.active[0], Math.round((battle.p2.active[0].maxhp - 1) * recoilFactors[i]), () => battle.makeChoices(`move ${i + 1}`, `move strengthsap`));
		}
	});
});
