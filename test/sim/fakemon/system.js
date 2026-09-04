'use strict';

/**
 * End-to-end tests for the custom Fakemon system.
 *
 * These follow the acceptance checklist for the project: data separation, the
 * two Mega Evolution paths, custom abilities, items, new field effects, the
 * team validator, singles, doubles, and the bot.
 */

const assert = require('./../../assert');
const common = require('./../../common');
const { Dex, Teams, TeamValidator } = require('./../../../dist/sim');
const { FakemonBot } = require('./../../../dist/data/mods/fakemon/bot');
const FakemonIndex = require('./../../../dist/data/mods/fakemon/generated/index').FakemonIndex;

const fakemon = common.mod('fakemon');
const dex = Dex.mod('fakemon');

let battle;

describe('Fakemon: data separation', () => {
	before(() => dex.includeData());

	it('should not contain any original Pokemon', () => {
		for (const id of ['pikachu', 'charizard', 'garchomp', 'greattusk', 'venusaurmega']) {
			assert.false(dex.species.get(id).exists, `${id} should not exist`);
		}
	});

	it('should not contain any original moves, abilities or items', () => {
		for (const id of ['thunderbolt', 'earthquake', 'uturn']) {
			assert.false(dex.moves.get(id).exists, `move ${id} should not exist`);
		}
		for (const id of ['levitate', 'intimidate', 'protean']) {
			assert.false(dex.abilities.get(id).exists, `ability ${id} should not exist`);
		}
		for (const id of ['leftovers', 'lifeorb', 'choicescarf']) {
			assert.false(dex.items.get(id).exists, `item ${id} should not exist`);
		}
	});

	it('should keep the original moves it needs for mechanics unusable', () => {
		// Protect's condition is what every custom protecting move reuses.
		assert(dex.moves.get('protect').exists);
		assert.equal(dex.moves.get('protect').isNonstandard, 'Custom');
		for (const id of Object.keys(dex.data.Learnsets)) {
			assert.false(
				Object.keys(dex.data.Learnsets[id].learnset || {}).includes('protect'),
				`${id} should not learn Protect`
			);
		}
	});

	it('should not let an original alias reach an original entry', () => {
		// "adapt" is an alias for Adaptability upstream and a custom move here.
		assert.equal(dex.moves.get('adapt').name, 'Adapt');
		assert.false(dex.species.get('zard').exists);
	});

	it('should contain every entry from the source files', () => {
		assert.equal(Object.keys(dex.data.Pokedex).length, FakemonIndex.species.length);
		for (const name of FakemonIndex.species) {
			assert(dex.species.get(name).exists, `${name} is missing`);
		}
		for (const id of Object.keys(FakemonIndex.signatureMoves)) {
			assert(dex.moves.get(id).exists, `signature move ${id} is missing`);
		}
		for (const id of Object.keys(FakemonIndex.abilities)) {
			assert(dex.abilities.get(id).exists, `ability ${id} is missing`);
		}
		for (const id of Object.keys(FakemonIndex.megaAbilities)) {
			assert(dex.abilities.get(id).exists, `Mega ability ${id} is missing`);
		}
	});
});

describe('Fakemon: Pokemon data', () => {
	it('should give every Pokemon types, stats, abilities and moves', () => {
		for (const name of FakemonIndex.baseSpecies) {
			const species = dex.species.get(name);
			assert(species.types.length >= 1, `${name} has no types`);
			const bst = Object.values(species.baseStats).reduce((a, b) => a + b, 0);
			assert(bst >= 200 && bst <= 800, `${name} has an implausible BST of ${bst}`);
			assert(Object.values(species.abilities).filter(Boolean).length >= 1,
				`${name} has no abilities`);
			if (species.isMega) continue;
			const learnset = dex.species.getLearnsetData(species.id).learnset;
			assert(Object.keys(learnset || {}).length > 0, `${name} has no moves`);
		}
	});

	it('should only ever put Mega Abilities on Mega formes', () => {
		const megaAbilities = new Set(Object.values(FakemonIndex.megaAbilities));
		for (const name of FakemonIndex.species) {
			const species = dex.species.get(name);
			if (species.isMega) continue;
			for (const ability of Object.values(species.abilities)) {
				assert.false(megaAbilities.has(ability),
					`${name} must not have the Mega Ability ${ability}`);
			}
		}
	});
});

describe('Fakemon: Mega Evolution', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should give +20 to every base stat when Mega Evolving without a stone', () => {
		battle = fakemon.createBattle([[
			{ species: 'Pumpini', ability: 'grassstarter', moves: ['sugarcrush'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		const pokemon = battle.p1.active[0];
		const before = { ...pokemon.species.baseStats };
		const storedBefore = { ...pokemon.storedStats };
		const maxhpBefore = pokemon.maxhp;

		battle.makeChoices('move 1 mega', 'move 1');

		const after = pokemon.species.baseStats;
		for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe']) {
			assert.equal(after[stat], before[stat] + 20,
				`${stat} should be +20 (was ${before[stat]}, now ${after[stat]})`);
		}
		// +120 BST in total, and the change is real: stats and HP both moved.
		const gained = Object.values(after).reduce((a, b) => a + b, 0) -
			Object.values(before).reduce((a, b) => a + b, 0);
		assert.equal(gained, 120);
		assert(pokemon.maxhp > maxhpBefore, 'max HP should increase');
		assert(pokemon.storedStats.atk > storedBefore.atk, 'Attack should increase');
		// It stays the same Pokemon.
		assert.equal(pokemon.species.name, 'Pumpini');
	});

	it('should keep its normal ability when Mega Evolving without a stone', () => {
		battle = fakemon.createBattle([[
			{ species: 'Pumpini', ability: 'grassstarter', moves: ['sugarcrush'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		battle.makeChoices('move 1 mega', 'move 1');
		assert.equal(battle.p1.active[0].ability, 'grassstarter');
	});

	it('should give exactly +100 BST and the Mega Ability with the right stone', () => {
		battle = fakemon.createBattle([[
			{ species: 'Hallowisp', ability: 'grassstarter', item: 'hallowispite', moves: ['sugarcrush'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		const pokemon = battle.p1.active[0];
		const before = Object.values(pokemon.species.baseStats).reduce((a, b) => a + b, 0);

		battle.makeChoices('move 1 mega', 'move 1');

		assert.equal(pokemon.species.name, 'Hallowisp-Mega');
		const after = Object.values(pokemon.species.baseStats).reduce((a, b) => a + b, 0);
		assert.equal(after - before, 100, 'a Mega Stone must be worth exactly +100 BST');
		assert.equal(pokemon.ability, 'sugarpile', 'the Mega Ability should be active');
		assert.equal(pokemon.species.types.join('/'), 'Grass/Ghost/Fairy');
	});

	it('should not apply a Mega Stone that belongs to another Pokemon', () => {
		battle = fakemon.createBattle([[
			{ species: 'Pumpini', ability: 'grassstarter', item: 'hallowispite', moves: ['sugarcrush'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		const pokemon = battle.p1.active[0];
		const before = { ...pokemon.species.baseStats };
		battle.makeChoices('move 1 mega', 'move 1');
		// Falls back to the stoneless Mega Evolution.
		assert.equal(pokemon.species.name, 'Pumpini');
		assert.equal(pokemon.species.baseStats.atk, before.atk + 20);
	});

	it('should only allow one Mega Evolution per side', () => {
		battle = fakemon.createBattle([[
			{ species: 'Pumpini', ability: 'grassstarter', moves: ['sugarcrush'] },
			{ species: 'Candigrim', ability: 'grassstarter', moves: ['sugarcrush'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
			{ species: 'Spukasten', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		battle.makeChoices('move 1 mega', 'move 1');
		assert.false(!!battle.p1.pokemon[1].canMegaEvo, 'the rest of the team cannot Mega Evolve');
	});
});

describe('Fakemon: custom mechanics', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should run a signature move that sets a new weather (Full Moon)', () => {
		battle = fakemon.createBattle([[
			{ species: 'Hallowisp', ability: 'madness', moves: ['fullmoon'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.field.effectiveWeather(), 'fullmoon');
	});

	it('should run a signature move that sets a new room (Haunted Room)', () => {
		battle = fakemon.createBattle([[
			{ species: 'Spukasten', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		], [
			{ species: 'Eggbun', ability: 'kamikaze', moves: ['eggsplosion'] },
		]]);
		battle.makeChoices();
		assert(battle.field.getPseudoWeather('hauntedroom'), 'Haunted Room should be up');
		// Every non-Ghost is treated as part Ghost while it lasts.
		assert(battle.p2.active[0].hasType('Ghost'), 'the foe should count as Ghost-type');
	});

	it('should make a custom ability change damage (Grass-Starter)', () => {
		// Same move, same target, same seed - only the ability differs.
		const damageWith = ability => {
			const test = fakemon.createBattle({ seed: [1, 2, 3, 4] }, [[
				{ species: 'Pumpini', ability, moves: ['bramblewhip'] },
			], [
				{ species: 'Bouncunny', ability: 'eggshell', moves: ['tailcanon'] },
			]]);
			test.makeChoices('move 1', 'move 1');
			const target = test.p2.active[0];
			const damage = target.maxhp - target.hp;
			test.destroy();
			return damage;
		};
		const boosted = damageWith('grassstarter');
		const normal = damageWith('madness');
		assert(boosted > normal,
			`Grass-Starter should boost Grass moves (${boosted} vs ${normal})`);
		// The battle used by afterEach.
		battle = fakemon.createBattle([[
			{ species: 'Pumpini', ability: 'grassstarter', moves: ['bramblewhip'] },
		], [
			{ species: 'Bouncunny', ability: 'eggshell', moves: ['tailcanon'] },
		]]);
	});

	it('should trigger a custom ability on contact (Spin Counter)', () => {
		battle = fakemon.createBattle([[
			{ species: 'Rollusk', ability: 'spincounter', moves: ['shelltoss'] },
		], [
			{ species: 'Bouncunny', ability: 'eggshell', moves: ['tailcanon'] },
		]]);
		const attacker = battle.p2.active[0];
		battle.makeChoices();
		// Tailcanon is a contact move, so the attacker takes 25% of the damage back.
		assert(attacker.hp < attacker.maxhp, 'the contact attacker should take recoil');
	});

	it('should run a custom item (Sugar Berry heals at half HP)', () => {
		battle = fakemon.createBattle([[
			{ species: 'Eggbun', ability: 'eggshell', item: 'sugarberry', moves: ['eggsplosion'] },
		], [
			{ species: 'Sprank', ability: 'cabinetlock', moves: ['furniturehaunt'] },
		]]);
		const pokemon = battle.p1.active[0];
		pokemon.sethp(Math.floor(pokemon.maxhp / 2));
		battle.makeChoices();
		assert.equal(pokemon.item, '', 'the berry should have been eaten at half HP');
		// Eggsplosion also costs the user HP this turn, so check the heal itself.
		assert(battle.log.some(line => line.startsWith('|-heal|p1a: Eggbun')),
			'the berry should have healed the holder');
	});
});

describe('Fakemon: team validation', () => {
	const validator = TeamValidator.get('fakemonsingles');

	/** Build a legal-looking set; the caller breaks exactly one thing. */
	function set(overrides) {
		const base = {
			name: 'Hallowisp', species: 'Hallowisp', item: 'Sugar Berry',
			ability: dex.species.get('Hallowisp').abilities['0'],
			moves: Object.keys(dex.species.getLearnsetData('hallowisp').learnset).slice(0, 4),
			nature: 'Modest', gender: '', level: 100, shiny: false, happiness: 255,
			evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		};
		// validateTeam takes an array of sets, not a packed string.
		return [{ ...base, ...overrides }];
	}

	it('should accept a legal custom team', () => {
		assert.equal(validator.validateTeam(set({})), null);
	});

	it('should reject an original Pokemon', () => {
		const problems = validator.validateTeam(set({
			name: 'Pikachu', species: 'Pikachu', ability: 'Static',
			moves: ['Thunderbolt'], item: '',
		}));
		assert(problems && problems.length, 'an original Pokemon must be rejected');
	});

	it('should reject an original move on a custom Pokemon', () => {
		const problems = validator.validateTeam(set({ moves: ['Thunderbolt'] }));
		assert(problems && problems.length, 'an original move must be rejected');
	});

	it('should reject an original item', () => {
		const problems = validator.validateTeam(set({ item: 'Leftovers' }));
		assert(problems && problems.length, 'an original item must be rejected');
	});

	it('should reject a Mega Ability chosen directly', () => {
		const problems = validator.validateTeam(set({ ability: 'Sugar Pile' }));
		assert(problems && problems.length, 'a Mega Ability must not be selectable');
	});

	it('should reject a Mega forme on a team', () => {
		const problems = validator.validateTeam(set({
			name: 'Hallowisp-Mega', species: 'Hallowisp-Mega', ability: 'Sugar Pile', item: '',
		}));
		assert(problems && problems.length, 'a Mega forme must not be selectable');
	});

	it('should reject a Mega Stone held by the wrong Pokemon', () => {
		const problems = validator.validateTeam(set({
			name: 'Pumpini', species: 'Pumpini', item: 'Hallowispite',
			ability: dex.species.get('Pumpini').abilities['0'],
			moves: Object.keys(dex.species.getLearnsetData('pumpini').learnset).slice(0, 4),
		}));
		assert(problems && problems.length, 'the wrong Mega Stone must be rejected');
	});

	it('should accept the right Mega Stone', () => {
		assert.equal(validator.validateTeam(set({ item: 'Hallowispite' })), null);
	});
});

describe('Fakemon: random teams and the bot', () => {
	it('should build valid random teams for singles and doubles', () => {
		for (const formatid of ['fakemonrandombattle', 'fakemonrandomdoublesbattle']) {
			const team = Teams.generate(formatid);
			assert.equal(team.length, 6, `${formatid} should build a full team`);
			const seen = new Set();
			for (const set of team) {
				assert(dex.species.get(set.species).exists, `${set.species} should exist`);
				assert.false(seen.has(set.species), 'Species Clause');
				seen.add(set.species);
				assert(set.moves.length >= 1 && set.moves.length <= 4);
				const learnset = dex.species.getLearnsetData(dex.species.get(set.species).id).learnset;
				for (const move of set.moves) {
					assert(learnset[dex.toID(move)], `${set.species} should be able to learn ${move}`);
				}
				assert(dex.abilities.get(set.ability).exists);
				assert(Object.values(dex.species.get(set.species).abilities).includes(set.ability));
				if (set.item) assert.equal(dex.items.get(set.item).isNonstandard, 'Custom');
			}
			// At most one Mega Stone: only one Mega Evolution is allowed per battle.
			const stones = team.filter(set => dex.items.get(set.item).megaStone).length;
			assert(stones <= 1, 'a random team should not carry two Mega Stones');
		}
	});

	it('should let the bot play a full singles battle', async () => {
		const result = await runBotBattle('[Fakemon] Random Battle', 'hard');
		assert.equal(result.errors.length, 0, `bot made illegal choices: ${result.errors[0]}`);
		assert(result.turns > 1, 'the battle should last more than one turn');
		assert(result.ended, 'the battle should finish');
	});

	it('should let the bot play a full doubles battle', async () => {
		const result = await runBotBattle('[Fakemon] Random Doubles Battle', 'normal');
		assert.equal(result.errors.length, 0, `bot made illegal choices: ${result.errors[0]}`);
		assert(result.ended, 'the battle should finish');
	});
});

/** Runs a complete bot-vs-bot battle and reports what happened. */
async function runBotBattle(formatid, difficulty) {
	const { BattleStream } = require('./../../../dist/sim');
	const stream = new BattleStream();
	const bots = {
		p1: new FakemonBot({ name: 'AlphaBot', difficulty, seed: [1, 2, 3, 4] }),
		p2: new FakemonBot({ name: 'ShadowMaster', difficulty, seed: [5, 6, 7, 8] }),
	};
	bots.p1.setSide('p1');
	bots.p2.setSide('p2');

	const lines = [];
	const errors = [];
	void (async () => {
		for await (const chunk of stream) {
			for (const line of chunk.split('\n')) {
				lines.push(line);
				if (line.includes('|error|')) errors.push(line);
			}
		}
	})();

	// Fixed seeds keep this test deterministic.
	const teamP1 = Teams.pack(Teams.generate(formatid, { seed: [1, 2, 3, 4] }));
	const teamP2 = Teams.pack(Teams.generate(formatid, { seed: [5, 6, 7, 8] }));
	void stream.write(`>start {"formatid":"${formatid}","seed":[9,8,7,6]}`);
	void stream.write(`>player p1 {"name":"AlphaBot","team":"${teamP1}"}`);
	void stream.write(`>player p2 {"name":"ShadowMaster","team":"${teamP2}"}`);

	for (let guard = 0; guard < 400; guard++) {
		await new Promise(resolve => { setImmediate(resolve); });
		const sim = stream.battle;
		if (!sim || sim.ended) break;
		for (const line of lines.splice(0)) {
			bots.p1.observe(line);
			bots.p2.observe(line);
		}
		for (const side of sim.sides) {
			const request = side.activeRequest;
			if (!request || request.wait) continue;
			const choice = bots[side.id].decide(request);
			if (choice) void stream.write(`>${side.id} ${choice}`);
		}
	}
	const sim = stream.battle;
	return { turns: sim.turn, ended: sim.ended, winner: sim.winner, errors };
}
