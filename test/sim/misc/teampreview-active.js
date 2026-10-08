'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Team preview request data', () => {
	afterEach(() => {
		battle.destroy();
	});

	// regression test for issue #11869
	it('should not mark any pokemon as active=true during team preview', () => {
		battle = common.gen(9).createBattle({ formatid: 'gen9vgc2026regf' }, [[
			{ species: 'gyarados', ability: 'intimidate', moves: ['waterfall'], teraType: 'Water', level: 50 },
			{ species: 'pikachu', ability: 'static', moves: ['thunderbolt'], teraType: 'Electric', level: 50 },
			{ species: 'charizard', ability: 'blaze', moves: ['flamethrower'], teraType: 'Fire', level: 50 },
			{ species: 'venusaur', ability: 'overgrow', moves: ['gigadrain'], teraType: 'Grass', level: 50 },
		], [
			{ species: 'snorlax', ability: 'thickfat', moves: ['bodyslam'], teraType: 'Normal', level: 50 },
			{ species: 'gengar', ability: 'levitate', moves: ['shadowball'], teraType: 'Ghost', level: 50 },
			{ species: 'alakazam', ability: 'synchronize', moves: ['psychic'], teraType: 'Psychic', level: 50 },
			{ species: 'machamp', ability: 'guts', moves: ['closecombat'], teraType: 'Fighting', level: 50 },
		]]);

		assert.equal(battle.requestState, 'teampreview');
		for (const side of battle.sides) {
			const data = side.getRequestData();
			for (const mon of data.pokemon) {
				assert.equal(mon.active, false, `${mon.ident} should not be active during team preview`);
			}
		}
	});
});
