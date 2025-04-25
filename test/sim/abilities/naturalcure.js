'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Natural Cure', () => {
	it('should cure even when phased out by Roar', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', {
			team: [
				{ species: 'Celebi', ability: 'naturalcure', moves: ['leechseed'] },
				{ species: 'Swampert', ability: 'torrents', moves: ['surf'] },
			],
		});
		battle.setPlayer('p2', {
			team: [
				{ species: 'Zapdos', ability: 'pressure', moves: ['thunderwave', 'roar'] },
			],
		});
		battle.makeChoices('move leechseed', 'move thunderwave');
		battle.makeChoices('move leechseed', 'move roar');
		assert.notEqual(battle.p1.pokemon[1].status, 'par');
	});
});
