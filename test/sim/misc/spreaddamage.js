'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Spread Damage`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should hit both targets for 75% of the original damage`, () => {
		battle = common.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
			{ species: 'abomasnow', ability: 'snowwarning', moves: ['blizzard'] },
			{ species: 'azumarill', moves: ['sleeptalk'] },
		], [
			{ species: 'carnivine', moves: ['sleeptalk'] },
			{ species: 'carnivine', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		for (const pokemon of battle.p2.active) {
			assert.bounded(pokemon.maxhp - pokemon.hp, [216, 254]);
		}
	});

	describe('[Gen 4]', () => {
		it(`should hit both targets for 75% of the original damage`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
				{ species: 'abomasnow', ability: 'snowwarning', moves: ['blizzard'] },
				{ species: 'azumarill', moves: ['sleeptalk'] },
			], [
				{ species: 'carnivine', ability: 'magicguard', moves: ['sleeptalk'] },
				{ species: 'carnivine', ability: 'magicguard', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			for (const pokemon of battle.p2.active) {
				assert.bounded(pokemon.maxhp - pokemon.hp, [236, 282]);
			}
		});

		it(`should hit the second target for 100% of the original damage if the first target fainted`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
				{ species: 'abomasnow', ability: 'snowwarning', moves: ['blizzard'] },
				{ species: 'azumarill', moves: ['sleeptalk'] },
			], [
				{ species: 'carnivine', ability: 'magicguard', moves: ['sleeptalk'] },
				{ species: 'shedinja', ability: 'magicguard', moves: ['sleeptalk'], evs: { spe: 252 } },
			]]);
			battle.makeChoices();
			for (const pokemon of battle.p2.active) {
				assert.fainted(pokemon);
			}
		});

		it(`should hit the last two targets of Explosion for 100% of the original damage if the first target fainted`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'abomasnow', moves: ['explosion'] },
				{ species: 'palkia', ability: 'battlearmor', moves: ['sleeptalk'] },
			], [
				{ species: 'deoxys-speed', ability: 'battlearmor', moves: ['sleeptalk'] },
				{ species: 'palkia', ability: 'battlearmor', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			for (const pokemon of battle.p1.active) {
				assert.fainted(pokemon);
			}
			for (const pokemon of battle.p2.active) {
				assert.fainted(pokemon);
			}
		});

		it(`should hit the last two targets of Earthquake for 100% of the original damage if the user faints mid turn`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'donphan', item: 'focussash', moves: ['earthquake'], ivs: { atk: 0 } },
				{ species: 'geodude', ability: 'battlearmor', moves: ['sleeptalk'] },
			], [
				{ species: 'deoxys-speed', ability: 'battlearmor', item: 'jabocaberry', moves: ['sleeptalk'] },
				{ species: 'geodude', ability: 'battlearmor', moves: ['sleeptalk'] },
			]]);
			battle.p1.active[0].hp = 1;
			battle.p2.active[0].hp = 1;
			battle.makeChoices();
			for (const pokemon of battle.p1.active) {
				assert.fainted(pokemon);
			}
			for (const pokemon of battle.p2.active) {
				assert.fainted(pokemon);
			}
		});

		it(`should do Rain-boosted damage after the Air Lock target faints`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: 'kyogre', ability: 'drizzle', moves: ['waterspout'] },
				{ species: 'mamoswine', moves: ['iceshard'] },
			], [
				{ species: 'rayquaza', ability: 'airlock', moves: ['sleeptalk'], evs: { spe: 252 } },
				{ species: 'mew', ability: 'battlearmor', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			for (const pokemon of battle.p2.active) {
				assert.fainted(pokemon);
			}
		});
	});
});
