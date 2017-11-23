'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stomping Tantrum', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double its Base Power if the last move used on the previous turn failed', function () {
		battle = common.createBattle([
			[{species: 'Marowak', ability: 'rockhead', moves: ['attract', 'spore', 'stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['rest']}],
		]);

		battle.onEvent('ModifyBasePower', battle.getFormat(), function (basePower) {
			assert.strictEqual(basePower, 150);
		});

		battle.commitDecisions();
		battle.choose('p1', 'move 3');
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p1', 'move 3');
		battle.commitDecisions();
	});

	it('should not double its Base Power if the last move used on the previous turn hit protect', function () {
		battle = common.createBattle([
			[{species: 'Marowak', ability: 'rockhead', moves: ['stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['protect']}],
		]);

		battle.onEvent('ModifyBasePower', battle.getFormat(), function (basePower) {
			assert.strictEqual(basePower, 75);
		});

		battle.commitDecisions();
		battle.commitDecisions();
	});
});
