'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trace', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should copy the opponent's Ability`, () => {
		battle = common.createBattle([[
			{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", ability: 'shadowtag', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		const ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'shadowtag');
	});

	it(`should delay copying the opponent's Ability if the initial Abilities could not be copied by Trace`, () => {
		battle = common.createBattle([[
			{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
		], [
			{ species: "Arceus", ability: 'multitype', moves: ['sleeptalk'] },
			{ species: "Aegislash", ability: 'stancechange', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'shadowtag', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		const ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 2');
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3');
		assert.equal(ralts.ability, 'shadowtag');
	});

	for (const gen of [5, 9]) {
		it(`[Gen ${gen}] should activate waiting Trace before replacement Pokemon's switch-in Abilities`, () => {
			battle = common.gen(gen).createBattle({ gameType: 'doubles' }, [[
				{ species: "Ralts", ability: 'trace', moves: ['protect'] },
				{ species: "Metagross", ability: 'clearbody', moves: ['explosion'] },
				{ species: "Groudon", ability: 'drought', nature: 'Brave', ivs: { spe: 0 }, moves: ['splash'] },
			], [
				{ species: "Castform", ability: 'forecast', moves: ['splash'] },
				{ species: "Arceus-Ghost", ability: 'multitype', item: 'spookyplate', moves: ['splash'] },
				{ species: "Kyogre", ability: 'drizzle', nature: 'Timid', evs: { spe: 252 }, moves: ['splash'] },
			]]);

			// Neither opposing Ability can be copied, so Trace waits for a new target.
			const ralts = battle.p1.active[0];
			assert.equal(ralts.ability, 'trace');
			battle.p2.active[0].hp = 1;
			battle.makeChoices('move protect, move explosion', 'move splash, move splash');
			assert.equal(ralts.ability, 'trace');

			battle.makeChoices('pass, switch 3', 'switch 3, pass');
			assert.equal(ralts.ability, 'drizzle');
			// Ralts copies Drizzle before the entrants' Abilities run; slower Groudon sets sun last.
			assert.equal(battle.field.weather, 'sunnyday');
		});
	}

	// see research: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/post-7790209
	it(`should interact properly with Ability index 0 'No Ability'`, () => {
		// Trace stops working if it initially finds 'No Ability'
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
			{ species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", ability: 'noability', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'unburden', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'triage', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		let ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		assert.equal(ralts.ability, 'trace');

		// Trace will continue if it checks later on if it can take 'No Ability'
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
			{ species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", ability: 'stancechange', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'stancechange', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'noability', moves: ['sleeptalk'] },
			{ species: "Wynaut", ability: 'unburden', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 4, move sleeptalk');
		assert.equal(ralts.ability, 'unburden');
	});

	// This was an existing bug https://www.smogon.com/forums/threads/trace-triggers-new-ability-twice.3772080/
	it(`should not activate twice`, () => {
		battle = common.createBattle([[
			{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
			{ species: "Bouffalant", moves: ['sleeptalk'] },
		], [
			{ species: "Iron Jugulis", ability: 'quarkdrive', moves: ['sleeptalk'] },
			{ species: "Incineroar", ability: 'intimidate', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	describe('[Gen 4]', () => {
		it.skip(`should delay the copied Ability activation until its standard switch-in priority`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
				{ species: "Arcanine", ability: 'intimidate', moves: ['sleeptalk'] },
			], [
				{ species: "Suicune", ability: 'pressure', moves: ['sleeptalk'] },
				{ species: "Raikou", ability: 'pressure', moves: ['sleeptalk'] },
			]]);
			const debugLog = battle.getDebugLog();
			const raltsTrace = debugLog.indexOf('|-ability|p1a: Ralts|Pressure');
			const arcanineTrace = debugLog.indexOf('|-ability|p1b: Arcanine|Intimidate');
			assert(arcanineTrace > 0);
			assert(arcanineTrace < raltsTrace, `Expected Arcanine's Intimidate to activate before Ralts's copied Pressure.`);
		});
	});

	describe('[Gen 3]', () => {
		it(`should not activate the opponent's Ability`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "Ralts", ability: 'trace', moves: ['sleeptalk'] },
			], [
				{ species: "Arcanine", ability: 'intimidate', moves: ['sleeptalk'] },
			]]);
			assert.equal(battle.p1.active[0].ability, 'intimidate');
			assert.equal(battle.p1.active[0].boosts.atk, -1);
			assert.equal(battle.p2.active[0].boosts.atk, 0);
		});
	});
});
