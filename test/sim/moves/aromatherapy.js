'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Aromatherapy', () => {
	afterEach(() => {
		battle.destroy();
	});

	for (let gen = Dex.gen; gen >= 3; gen--) {
		it(`should handle the interaction with Sap Sipper and Substitute correctly in Gen ${gen}`, () => {
			const existsSapSipper = gen >= 5;
			const ability = existsSapSipper ? 'sapsipper' : '';

			battle = common.gen(gen).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Meganium', ability, moves: ['sleeptalk'] },
				{ species: 'Typhlosion', ability, moves: ['sleeptalk', 'substitute', 'aromatherapy'] },
				{ species: 'Feraligatr', ability, moves: ['sleeptalk'] },
				{ species: 'Furret', moves: ['sleeptalk', 'substitute'] },
			], [
				{ species: 'Wynaut', moves: ['glare', 'sleeptalk'] },
				{ species: 'Wynaut', moves: ['glare', 'sleeptalk'] },
				{ species: 'Wynaut', moves: ['glare', 'sleeptalk'] },
			]]);
			if (existsSapSipper) {
				battle.forceRandomChance = true;
				battle.makeChoices('auto', 'move glare 1, move glare 2');
				battle.makeChoices('switch 3, move sleeptalk', 'move glare 1, move glare 2');
				battle.forceRandomChance = false;
				battle.makeChoices('move sleeptalk, move aromatherapy', 'move sleeptalk, move sleeptalk');
				const self = battle.p1.pokemon[1];
				const active = battle.p1.pokemon[0];
				const back = battle.p1.pokemon[2];
				assert.equal(self.status, '');
				assert.equal(active.status, gen <= 5 && existsSapSipper ? '' : 'par');
				assert.equal(back.status, '');
			}

			battle.forceRandomChance = true;
			battle.makeChoices('switch 4, move sleeptalk', 'move glare 1, move glare 2');
			battle.forceRandomChance = false;
			battle.makeChoices('move substitute, move substitute', 'move sleeptalk, move sleeptalk');
			battle.makeChoices('move sleeptalk, move aromatherapy', 'move sleeptalk, move sleeptalk');
			const self = battle.p1.pokemon[1];
			const substitute = battle.p1.pokemon[0];
			assert.equal(self.status, '');
			assert.equal(substitute.status, gen <= 5 ? '' : 'par');
		});
	}
});
