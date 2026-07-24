/**
 * Tests for [Gen 3] Megas CAP Random Battle.
 */
'use strict';

const assert = require('../assert');
const { Teams } = require('../../dist/sim/teams');
const { TeamValidator } = require('../../dist/sim/team-validator');

describe('[Gen 3] Megas CAP Random Battle', () => {
	const format = Dex.formats.get('gen3megascaprandombattle');
	const dex = Dex.forFormat(format);
	const vanillaSets = require('../../data/random-battles/gen3/sets.json');
	const megaSets = require('../../data/random-battles/gen3megascap/sets.json');

	// Source of truth for the CAP roster, independent of the random-battle sets.json:
	// every Mega forme the gen3megascap mod re-legalizes into Gen 3.
	const DEFINED_MEGA_FORMES = dex.species.all()
		.filter(species => species.isMega && species.gen === 3)
		.map(species => species.id)
		.sort();

	function isMegaEnabler(itemName) {
		const item = dex.items.get(itemName);
		// gen3megascap stones expose megaStone as a {base: "Base-Mega"} map.
		return !!item.megaStone;
	}

	it('should expose the intended rules and complete explicit set pool', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const expectedPool = [...Object.keys(vanillaSets), ...Object.keys(megaSets)].sort();

		assert(Dex.formats.getRuleTable(format).has('freezeclausemod'));
		assert.deepEqual(Object.keys(generator.randomSets).sort(), expectedPool);
		assert.deepEqual(Object.keys(megaSets).sort(), DEFINED_MEGA_FORMES);
		assert.deepEqual([...generator.megaFormes].sort(), DEFINED_MEGA_FORMES);
		assert.equal(DEFINED_MEGA_FORMES.length, 23);

		for (const [formeid, data] of Object.entries(megaSets)) {
			assert(Number.isInteger(data.level), `${formeid} needs an explicit integer level`);
			assert(data.level >= 60 && data.level <= 92, `${formeid} has an out-of-range level`);
			assert.equal(data.sets.length, 1, `${formeid} should have one first-pass set`);
			const movepool = data.sets[0].movepool;
			// Every transformation carries a full four-move set, except Mega Ditto, whose
			// only legal action is Transform (Imposter copies the foe on the Mega turn).
			const expectedMoveCount = formeid === 'dittomega' ? 1 : 4;
			assert.equal(movepool.length, expectedMoveCount, `${formeid} has ${movepool.length} moves`);
			assert.equal(new Set(movepool).size, movepool.length, `${formeid} has a duplicate move`);
		}
	});

	it('should generate every transformation as its legal base forme with final-form-aware data', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const validator = new TeamValidator('gen3megascap');

		for (const [i, formeid] of generator.megaFormes.entries()) {
			generator.setSeed([i + 1, i + 2, i + 3, i + 4]);
			const set = generator.randomSet(formeid);
			const data = megaSets[formeid];
			const forme = dex.species.get(formeid);
			const base = dex.species.get(forme.baseSpecies);

			assert.equal(dex.species.get(set.species).id, base.id, `${forme.name} must start in its base forme`);
			assert.equal(set.speciesId, forme.id);
			assert(forme.requiredItems.includes(set.item), `${forme.name} is missing its required stone`);
			assert.equal(set.ability, data.sets[0].abilities[0], `${forme.name} has the wrong base ability`);
			assert.equal(set.level, data.level, `${forme.name} has the wrong level`);
			assert.equal(set.role, data.sets[0].role, `${forme.name} has the wrong role`);
			assert.deepEqual([...set.moves].sort(), [...data.sets[0].movepool].sort());
			assert.equal(set.moves.length, data.sets[0].movepool.length, `${forme.name} move count drifted from its set`);

			// Mega Dragonize (Mantine-Mega) intentionally runs a Normal attack: Dragonize retypes
			// it to Dragon, and the Gen 3 by-type category rule reclassifies it to Special before the
			// hit, so the "no Normal move under Dragonize" rule from other formats does not apply here.

			for (const move of set.moves) {
				assert(!validator.checkCanLearn(move, base), `${base.name} cannot learn ${move} in ADV`);
			}
			const problems = validator.validateTeam([{ ...set, level: 100 }]);
			assert(!problems, `${forme.name} has an incompatible set: ${problems}`);
		}
	});

	it('should invest Attack when a transformed set keeps a physical move', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		// Mega Mightyena-X leans special (Sp. Atk 119 > Atk 110) but keeps physical Body Slam,
		// so the generator must not minimize its Attack the way an all-special set would.
		const mightyena = generator.randomSet('mightyenamegax');
		assert(mightyena.moves.includes('bodyslam'));
		assert(mightyena.evs.atk > 0, 'Mega Mightyena-X must not minimize Attack EVs while running Body Slam');
		assert(mightyena.ivs.atk > 0, 'Mega Mightyena-X must not minimize its Attack IV while running Body Slam');

		// Control: an all-special transformation still minimizes Attack.
		const luvdisc = generator.randomSet('luvdiscmega');
		assert(!luvdisc.moves.some(move => dex.moves.get(move).category === 'Physical'));
		assert.equal(luvdisc.evs.atk, 0, 'Mega Luvdisc has no physical move and should minimize Attack EVs');
	});

	it('should repeatedly preserve final-team composition limits with exactly one transformation', () => {
		const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
		const transformedSlots = new Set();
		for (let i = 0; i < 200; i++) {
			generator.setSeed([i + 1, i + 2, i + 3, i + 4]);
			const team = generator.getTeam();
			const teamSpecies = team.map(set => dex.species.get(set.speciesId || set.species));
			transformedSlots.add(teamSpecies.findIndex(species => species.isMega));

			assert.equal(team.length, 6);
			assert.equal(team.filter(set => isMegaEnabler(set.item)).length, 1);
			assert.equal(teamSpecies.filter(species => species.isMega).length, 1);
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
			const sizedFormat = Dex.formats.get(`gen3megascaprandombattle@@@Max Team Size = ${size}`);
			const firstTeam = Teams.getGenerator(sizedFormat, [10, 20, 30, 40]).getTeam();
			const repeatedTeam = Teams.getGenerator(sizedFormat, [10, 20, 30, 40]).getTeam();

			assert.deepEqual(firstTeam, repeatedTeam, `Team size ${size} should remain deterministic`);
			assert.equal(firstTeam.length, size);
			assert.equal(firstTeam.filter(set => isMegaEnabler(set.item)).length, 1);
		}
	});

	it('should support Adjust Level for both vanilla and transformed sets', () => {
		const adjustedFormat = Dex.formats.get('gen3megascaprandombattle@@@Adjust Level = 77');
		const generator = Teams.getGenerator(adjustedFormat, [1, 2, 3, 4]);
		assert(generator.getTeam().every(set => set.level === 77));
		assert.equal(generator.randomSet('quagsiremega').level, 77);
	});
});
