'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gen 1 Stadium Confusion', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should announce the move name before confusion self-hit damage', () => {
		battle = common.gen(1).mod('gen1stadium').createBattle({ forceRandomChance: true }, [[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Jynx', moves: ['confuseray', 'splash'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('move psychic', 'move splash');

		const log = battle.log.join('\n');
		const lines = log.split('\n');

		const activateIdx = lines.findIndex(l => l.includes('-activate') && l.includes('Alakazam') && l.includes('confusion'));
		const moveIndices = lines.reduce((acc, l, idx) => {
			if (l.includes('|move|p1a: Alakazam|Psychic')) acc.push(idx);
			return acc;
		}, []);
		const moveIdx = moveIndices[1];
		const damageIdx = lines.findIndex(l => l.includes('|-damage|p1a: Alakazam') && l.includes('[from] confusion'));

		assert(activateIdx !== -1, 'Confusion should activate');
		assert(moveIdx !== undefined, 'Move name should be announced on second turn');
		assert(damageIdx !== -1, 'Confusion self-hit should happen');
		assert(activateIdx < moveIdx, 'Confusion activation should come before move announcement');
		assert(moveIdx < damageIdx, 'Move announcement should come before confusion damage');
	});

	it('should not change standard Gen 1 RBY confusion behavior', () => {
		battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Jynx', moves: ['confuseray', 'splash'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('move psychic', 'move splash');

		const log = battle.log.join('\n');
		const lines = log.split('\n');

		const activateIdx = lines.findIndex(l => l.includes('-activate') && l.includes('Alakazam') && l.includes('confusion'));
		const moveIdx = lines.findIndex(l => l.includes('|move|p1a: Alakazam|Psychic'));
		const damageIdx = lines.findIndex(l => l.includes('|-damage') && l.includes('[from] confusion'));

		assert(activateIdx !== -1, 'Confusion should activate');
		assert(moveIdx !== -1, 'Move executes when not hitting itself');
		assert(damageIdx === -1, 'Standard RBY confusion does not self-hit when randomChance is forced true');
	});
});
