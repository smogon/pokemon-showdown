'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lagging Tail', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('[Gen 4]', () => {
		for (const trickRoom of [false, true]) {
			it(`should move after a Pokemon with Stall${trickRoom ? ' under Trick Room' : ''}`, () => {
				battle = common.gen(4).createBattle([[
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'laggingtail', moves: ['falseswipe', 'tackle', 'trickroom'], evs: { spe: 252 } },
				], [
					{ species: 'Deoxys-Attack', ability: 'stall', moves: ['splash', 'growl'] },
				]]);
				const laggingTail = battle.p1.active[0];
				const stall = battle.p2.active[0];
				if (trickRoom) battle.makeChoices('move trickroom', 'move splash');

				battle.makeChoices();
				assert.equal(stall.hp, 1);
				battle.makeChoices('move tackle', 'move growl');
				assert.statStage(laggingTail, 'atk', -1);
				assert.fainted(stall);
			});

			it(`should let the slower of two holders move first${trickRoom ? ' under Trick Room' : ''}`, () => {
				battle = common.gen(4).createBattle([[
					{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'laggingtail', moves: ['falseswipe', 'tackle', 'trickroom'], evs: { spe: 252 } },
				], [
					{ species: 'Deoxys-Attack', item: 'laggingtail', moves: ['splash', 'growl'] },
				]]);
				const faster = battle.p1.active[0];
				const slower = battle.p2.active[0];
				if (trickRoom) battle.makeChoices('move trickroom', 'move splash');

				battle.makeChoices();
				assert.equal(slower.hp, 1);
				battle.makeChoices('move tackle', 'move growl');
				assert.statStage(faster, 'atk', -1);
				assert.fainted(slower);
			});
		}
	});
});
