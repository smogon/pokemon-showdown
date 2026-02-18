'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Confusion', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not be affected by modifiers like Huge Power or Life Orb`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Deoxys-Attack', ability: 'hugepower', item: 'lifeorb', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray'] },
		]]);
		battle.makeChoices();
		const deoxys = battle.p1.active[0];
		const damage = deoxys.maxhp - deoxys.hp;
		assert.bounded(damage, [150, 177]);
	});
});

describe('Confusion [Gen 1 Stadium]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should broadcast the intended move before the self-hit occurs`, () => {
		// forceRandomChance: false forces confusion self-hit in gen1 (randomChance(128,256) returns false)
		// accuracy in gen1stadium uses random(), not randomChance(), so confuse ray still hits
		battle = common.mod('gen1stadium').createBattle({ forceRandomChance: false }, [[
			{ species: 'Jolteon', moves: ['confuseray'] },
		], [
			{ species: 'Vaporeon', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		const moveIdx = battle.log.findIndex(line => line.startsWith('|move|') && line.includes('Tackle'));
		const dmgIdx = battle.log.findIndex(line => line.includes('[from] confusion'));
		assert(moveIdx !== -1, 'tackle should be broadcast in the log');
		assert(dmgIdx !== -1, 'confusion self-hit damage should appear in the log');
		assert(moveIdx < dmgIdx, 'move broadcast must precede self-hit damage');
		assert(battle.log[moveIdx].includes('[still]'), 'move should be marked still since it does not execute');
	});
});
