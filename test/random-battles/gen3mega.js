/**
 * Tests for [Gen 3] Mega Random Battle.
 */
'use strict';

const assert = require('../assert');
const { Teams } = require('../../dist/sim/teams');
const { TeamValidator } = require('../../dist/sim/team-validator');
const { Pokedex: gen3MegaPokedex } = require('../../dist/data/mods/gen3mega/pokedex');

const DEFINED_MEGA_FORMES = Object.entries(gen3MegaPokedex)
	.filter(([id, data]) => data.gen === 3 && (id.includes('mega') || id.endsWith('primal')))
	.map(([id]) => id)
	.sort();

describe('[Gen 3] Mega Random Battle', () => {
	const format = Dex.formats.get('gen3megarandombattle');
	const dex = Dex.forFormat(format);
	const vanillaSets = require('../../data/random-battles/gen3/sets.json');
	const megaSets = require('../../data/random-battles/gen3mega/sets.json');

	function isMegaEnabler(itemName) {
		const item = dex.items.get(itemName);
		return !!item.megaStone || item.id === 'blueorb' || item.id === 'redorb';
	}

	it('should expose the intended rules and complete explicit set pool', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const expectedPool = [...Object.keys(vanillaSets), ...Object.keys(megaSets)].sort();

		assert(Dex.formats.getRuleTable(format).has('freezeclausemod'));
		assert.deepEqual(Object.keys(generator.randomSets).sort(), expectedPool);
		assert.deepEqual(Object.keys(megaSets).sort(), DEFINED_MEGA_FORMES);
		assert.deepEqual([...generator.megaFormes].sort(), DEFINED_MEGA_FORMES);
		assert.equal(DEFINED_MEGA_FORMES.length, 52);

		for (const [formeid, data] of Object.entries(megaSets)) {
			assert(Number.isInteger(data.level), `${formeid} needs an explicit integer level`);
			assert(data.level >= 60 && data.level <= 88, `${formeid} has an out-of-range level`);
			assert.equal(data.sets.length, 1, `${formeid} should have one first-pass set`);
		}
	});

	it('should generate every transformation as its legal base forme with final-form-aware data', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const validator = new TeamValidator('gen3megasag');

		for (const [i, formeid] of generator.megaFormes.entries()) {
			generator.setSeed([i + 1, i + 2, i + 3, i + 4]);
			const set = generator.randomSet(formeid);
			const data = megaSets[formeid];
			const forme = dex.species.get(formeid);
			const base = dex.species.get(forme.baseSpecies);
			const transformedAbilities = Object.values(forme.abilities);

			assert.equal(dex.species.get(set.species).id, base.id, `${forme.name} must start in its base forme`);
			assert.equal(set.speciesId, forme.id);
			assert(forme.requiredItems.includes(set.item), `${forme.name} is missing its required stone/orb`);
			assert.equal(set.ability, data.sets[0].abilities[0], `${forme.name} has the wrong base ability`);
			assert.equal(set.level, data.level, `${forme.name} has the wrong level`);
			assert.equal(set.role, data.sets[0].role, `${forme.name} has the wrong role`);
			assert.deepEqual([...set.moves].sort(), [...data.sets[0].movepool].sort());
			assert.equal(set.moves.length, 4, `${forme.name} must have four moves`);

			if (transformedAbilities.includes('No Guard')) {
				assert(!set.moves.includes('dynamicpunch'), `${forme.name} may not combine No Guard with Dynamic Punch`);
			}
			if (transformedAbilities.includes('Parental Bond')) {
				for (const moveName of set.moves) {
					const damage = dex.moves.get(moveName).damage;
					assert(
						typeof damage !== 'number' && damage !== 'level',
						`${forme.name} may not combine Parental Bond with fixed damage`
					);
				}
			}
			if (transformedAbilities.includes('Dragonize')) {
				assert(
					!set.moves.some(moveName => {
						const move = dex.moves.get(moveName);
						return move.type === 'Normal' && move.category !== 'Status';
					}),
					`${forme.name} should not use a Normal attack whose ADV category changes after Dragonize`
				);
			}
			if (transformedAbilities.includes('Solar Power')) assert(set.moves.includes('sunnyday'));
			if (transformedAbilities.includes('Swift Swim')) assert(set.moves.includes('raindance'));

			for (const move of set.moves) {
				assert(!validator.checkCanLearn(move, base), `${base.name} cannot learn ${move} in ADV`);
			}
			const problems = validator.validateTeam([{ ...set, level: 100 }]);
			assert(!problems, `${forme.name} has an incompatible set: ${problems}`);
		}
	});

	it('should calculate investment from the final transformed-form set', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const starmie = generator.randomSet('starmiemega');

		assert(starmie.moves.includes('doubleedge'));
		assert(starmie.evs.atk > 0, 'Mega Starmie must not minimize Attack EVs before adding Double-Edge');
		assert(starmie.ivs.atk > 0, 'Mega Starmie must not minimize its Attack IV before adding Double-Edge');
	});

	it('should normalize transformed formes in Gen 3 compatibility checks', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const megaTyranitar = dex.species.get('tyranitarmega');
		const megaHeracross = dex.species.get('heracrossmega');

		assert.false(generator.getPokemonCompatibility(megaTyranitar, [{
			species: 'Shedinja', speciesId: 'shedinja',
		}]));
		assert.false(generator.getPokemonCompatibility(dex.species.get('tyranitar'), [{
			species: 'Heracross', speciesId: megaHeracross.id,
		}]));
	});

	it('should repeatedly preserve final-team composition limits with exactly one transformation', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const transformedSlots = new Set();
		for (let i = 0; i < 200; i++) {
			generator.setSeed([i + 1, i + 2, i + 3, i + 4]);
			const team = generator.getTeam();
			const teamSpecies = team.map(set => dex.species.get(set.speciesId || set.species));
			transformedSlots.add(teamSpecies.findIndex(species => species.isMega || species.isPrimal));

			assert.equal(team.length, 6);
			assert.equal(team.filter(set => isMegaEnabler(set.item)).length, 1);
			assert.equal(teamSpecies.filter(species => species.isMega || species.isPrimal).length, 1);
			assert.equal(new Set(teamSpecies.map(species => species.baseSpecies)).size, 6);

			const typeCounts = {};
			const weaknessCounts = {};
			const doubleWeaknessCounts = {};
			for (const species of teamSpecies) {
				for (const type of species.types) typeCounts[type] = (typeCounts[type] || 0) + 1;
				for (const type of dex.types.names()) {
					const effectiveness = dex.getEffectiveness(type, species);
					if (effectiveness > 0) weaknessCounts[type] = (weaknessCounts[type] || 0) + 1;
					if (effectiveness > 1) {
						doubleWeaknessCounts[type] = (doubleWeaknessCounts[type] || 0) + 1;
					}
				}
			}
			assert(Object.values(typeCounts).every(count => count <= 2), `Type cap exceeded: ${JSON.stringify(team)}`);
			assert(Object.values(weaknessCounts).every(count => count <= 3), `Weakness cap exceeded: ${JSON.stringify(team)}`);
			assert(
				Object.values(doubleWeaknessCounts).every(count => count <= 1),
				`Double-weakness cap exceeded: ${JSON.stringify(team)}`
			);
			for (const [index, species] of teamSpecies.entries()) {
				assert(generator.getPokemonCompatibility(
					species, team.filter((set, setIndex) => setIndex !== index)
				), `Incompatible team: ${JSON.stringify(team)}`);
			}
		}
		assert.equal(transformedSlots.size, 6, 'The required transformation should not be locked to the lead slot');
	});

	it('should preserve the one-transformation contract at supported team sizes', () => {
		for (const size of [1, 3, 6]) {
			const sizedFormat = Dex.formats.get(`gen3megarandombattle@@@Max Team Size = ${size}`);
			const firstTeam = Teams.getGenerator(sizedFormat, [10, 20, 30, 40]).getTeam();
			const repeatedTeam = Teams.getGenerator(sizedFormat, [10, 20, 30, 40]).getTeam();

			assert.deepEqual(firstTeam, repeatedTeam, `Team size ${size} should remain deterministic`);
			assert.equal(firstTeam.length, size);
			assert.equal(firstTeam.filter(set => isMegaEnabler(set.item)).length, 1);
		}
	});

	it('should support Adjust Level for both vanilla and transformed sets', () => {
		const adjustedFormat = Dex.formats.get('gen3megarandombattle@@@Adjust Level = 77');
		const generator = Teams.getGenerator(adjustedFormat, [1, 2, 3, 4]);
		assert(generator.getTeam().every(set => set.level === 77));
		assert.equal(generator.randomSet('kyogreprimal').level, 77);
	});
});
