'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Echoed Voice', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should pierce through substitutes', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'echoedvoice'] }] });
		battle.setPlayer('p2', { team: [{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }] });
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move echoedvoice', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should raise BP even if there is no target', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Aurorus', ability: 'refrigerate', moves: ['echoedvoice'], evs: { spa: 252 } },
			{ species: 'Whimsicott', ability: 'prankster', moves: ['memento'] },
		], [
			{ species: 'Carnivine', moves: ['sleeptalk'] },
			{ species: 'Carnivine', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move echoedvoice -2, move memento 1', 'auto');
		battle.makeChoices('move echoedvoice 1', 'auto');
		assert.fainted(battle.p2.active[0]);
	});

	describe('[Gen 5]', () => {
		it('should not pierce through substitutes', () => {
			battle = common.gen(5).createBattle([
				[{ species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'echoedvoice'] }],
				[{ species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest'] }],
			]);
			battle.makeChoices('move splash', 'move substitute');
			battle.makeChoices('move echoedvoice', 'move rest');
			assert.equal(battle.p2.active[0].item, 'focussash');
		});
	});
});
