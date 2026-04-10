'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Critical hits', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not happen on self-hits`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Zubat', moves: ['confuseray'] },
		], [
			{ species: 'Chansey', item: 'luckypunch', ability: 'superluck', moves: ['softboiled'] },
		]]);

		battle.makeChoices('move confuseray', 'move softboiled');
		assert(battle.log.some(line => line.includes('[from] confusion')));
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});

	it(`should be guaranteed with Storm Throw`, () => {
		battle = common.createBattle([[
			{ species: 'Throh', ability: 'guts', moves: ['stormthrow'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move stormthrow', 'move sleeptalk');
		assert(battle.log.some(line => line.startsWith('|-crit|')));
	});

	it(`should deal roughly 1.5x damage compared to a non-crit`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Octillery', ability: 'pressure', item: 'razorclaw', moves: ['watergun'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move watergun', 'move sleeptalk');
		assert(battle.log.some(line => line.startsWith('|-crit|')));
		// Crit multiplier is 1.5x; exact damage with max roll and guaranteed crit = 64
		assert.equal(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 64);
	});

	it(`should apply Focus Energy's crit ratio boost`, () => {
		battle = common.createBattle([[
			{ species: 'Raticate', ability: 'guts', moves: ['focusenergy', 'tackle'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		const raticate = battle.p1.active[0];
		const blissey = battle.p2.active[0];
		const tackle = battle.dex.moves.get('tackle');

		assert.equal(battle.runEvent('ModifyCritRatio', raticate, blissey, tackle, 0), 0);

		battle.makeChoices('move focusenergy', 'move sleeptalk');
		assert(raticate.volatiles['focusenergy']);
		assert.equal(battle.runEvent('ModifyCritRatio', raticate, blissey, tackle, 0), 2);
	});
});
