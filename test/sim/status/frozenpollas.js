'use strict';

const assert = require('../../assert');
const battlemaster = require('../../battle-engine');

describe('Añil Freeze (Frostbite)', function () {
	it('should allow the frozen Pokemon to attack and halve Special damage', function () {
		const battle = battlemaster.createSession({
			formatid: 'gen9customgame',
		});

		battle.setPlayer('p1', {
			team: [{ name: 'Alakazam', species: 'Alakazam', moves: ['psychic'], level: 100 }],
		});
		battle.setPlayer('p2', {
			team: [{ name: 'Blissey', species: 'Blissey', moves: ['splash'], level: 100 }],
		});

		// 1. Calculate normal damage
		battle.makeChoices('move psychic', 'move splash');
		const normalHpLost = 700 - battle.p2.active[0].hp;

		// Reset HP and freeze p1
		battle.p2.active[0].hp = 700;
		battle.p1.active[0].setStatus('frz');

		// 2. Attack while frozen
		battle.makeChoices('move psychic', 'move splash');
		const frozenHpLost = 700 - battle.p2.active[0].hp;

		// Verify damage is roughly half (accounting for random damage variance 0.85 - 1.0)
		assert(
			frozenHpLost < normalHpLost,
			`Expected damage (${frozenHpLost}) to be less than unfrozen damage (${normalHpLost})`
		);
		assert.atLeast(
			frozenHpLost / normalHpLost,
			0.4,
			'Damage should be reduced by approximately 50%'
		);
		assert.atMost(
			frozenHpLost / normalHpLost,
			0.6,
			'Damage should be reduced by approximately 50%'
		);
	});
});
