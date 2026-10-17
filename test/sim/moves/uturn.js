'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('U-turn', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should switch the user out after a successful hit against a Substitute', () => {
		battle = common.createBattle([[
			{ species: 'Beedrill', ability: 'swarm', moves: ['uturn'] },
			{ species: 'Kakuna', ability: 'shedskin', moves: ['harden'] },
		], [
			{ species: 'Alakazam', ability: 'magicguard', moves: ['substitute'] },
		]]);

		battle.makeChoices('move uturn', 'move substitute');
		assert.equal(battle.requestState, 'switch');
	});

	describe('[Gen 4]', () => {
		it(`should cancel its switch when Destiny Bond faints the user`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Scizor', moves: ['uturn'] },
				{ species: 'Tyranitar', moves: ['sleeptalk'] },
			], [
				{ species: 'Froslass', moves: ['destinybond'] },
				{ species: 'Groudon', moves: ['sleeptalk'] },
			]]);
			const scizor = battle.p1.active[0];
			battle.p2.active[0].hp = 1;
			battle.makeChoices();
			assert.fainted(scizor);
			assert.equal(battle.p1.active[0], scizor);
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			assert(battle.log.includes('|-activate|p2a: Froslass|move: Destiny Bond'));
			assert(!battle.getDebugLog().includes('|switch|p1a: Tyranitar'));
		});

		it(`should lose its PP to Grudge before switching out`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Scizor', moves: ['uturn'] },
				{ species: 'Tyranitar', moves: ['sleeptalk'] },
			], [
				{ species: 'Froslass', moves: ['grudge'] },
				{ species: 'Blissey', moves: ['sleeptalk'] },
			]]);
			const scizor = battle.p1.active[0];
			const froslass = battle.p2.active[0];
			froslass.hp = 1;
			battle.makeChoices();
			assert.equal(scizor.moveSlots[0].pp, 0);
			assert.false(froslass.fainted);
			battle.makeChoices('switch 2', '');
			assert.fainted(froslass);
			// check that Grudge was only activated once
			assert.equal(battle.log.filter(line => line === '|-activate|p1a: Scizor|move: Grudge|U-turn').length, 1);
		});
	});
});
