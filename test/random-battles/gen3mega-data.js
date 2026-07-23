/**
 * Tests for generated [Gen 3] Mega Random Battle tooltip data.
 */
'use strict';

const fs = require('fs');

const assert = require('../assert');
const { Teams } = require('../../dist/sim/teams');
const {
	DEFAULT_SAMPLE_COUNT,
	EXPECTED_TRANSFORMATION_COUNT,
	buildArtifacts,
	checkArtifacts,
	getArtifactPaths,
	serializeArtifact,
} = require('../../tools/generate-gen3mega-randbats');

const FORMAT_ID = 'gen3megarandombattle';
const ALLOWED_STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

function sorted(values) {
	return [...values].sort();
}

function assertStatTable(table, kind, context) {
	if (table === undefined) return;
	assert.equal(typeof table, 'object', `${context} ${kind} must be an object`);
	for (const [stat, value] of Object.entries(table)) {
		assert(ALLOWED_STATS.includes(stat), `${context} has an unknown ${kind} stat: ${stat}`);
		assert(Number.isInteger(value), `${context} ${kind}.${stat} must be an integer`);
		assert.bounded(value, [0, kind === 'evs' ? 255 : 31]);
	}
}

function assertProbabilityTable(table, context) {
	assert.equal(typeof table, 'object', `${context} must be an object`);
	for (const [name, probability] of Object.entries(table)) {
		assert(name, `${context} has an empty option`);
		assert.equal(typeof probability, 'number', `${context}.${name} must be a number`);
		assert.bounded(probability, [0, 1], `${context}.${name} must be a probability`);
	}
}

describe('[Gen 3] Mega Random Battle generated randbats data', () => {
	const format = Dex.formats.get(FORMAT_ID);
	const dex = Dex.forFormat(format);
	const generator = Teams.getGenerator(format, [1, 2, 3, 4]);
	const files = getArtifactPaths();
	const options = JSON.parse(fs.readFileSync(files.options, 'utf8'));
	const stats = JSON.parse(fs.readFileSync(files.stats, 'utf8'));
	const sourceByName = new Map(Object.entries(generator.randomSets).map(([speciesId, data]) => [
		dex.species.get(speciesId).name, { speciesId, data },
	]));

	it('should use the pkmn/randbats options and stats schemas for the complete merged pool', () => {
		const expectedNames = sorted(sourceByName.keys());
		assert.deepEqual(Object.keys(options), expectedNames);
		assert.deepEqual(Object.keys(stats), expectedNames);
		assert.equal(expectedNames.length, Object.keys(generator.randomSets).length);

		let rolesWithEVs = 0;
		let rolesWithIVs = 0;
		for (const name of expectedNames) {
			const source = sourceByName.get(name);
			const speciesOptions = options[name];
			const speciesStats = stats[name];
			assert.equal(speciesOptions.level, source.data.level, `${name} options have a stale level`);
			assert.equal(speciesStats.level, source.data.level, `${name} stats have a stale level`);
			assert.deepEqual(
				sorted(Object.keys(speciesOptions.roles)),
				sorted(new Set(source.data.sets.map(set => set.role))),
				`${name} roles do not match merged randomSets`
			);
			assert.deepEqual(
				sorted(Object.keys(speciesStats.roles)),
				sorted(Object.keys(speciesOptions.roles)),
				`${name} role schemas differ`
			);

			assert.deepEqual(
				sorted(Object.keys(speciesStats.abilities)),
				sorted(speciesOptions.abilities),
				`${name} abilities differ between options and stats`
			);
			assert.deepEqual(
				sorted(Object.keys(speciesStats.items)),
				sorted(speciesOptions.items),
				`${name} items differ between options and stats`
			);
			assertProbabilityTable(speciesStats.abilities, `${name}.abilities`);
			assertProbabilityTable(speciesStats.items, `${name}.items`);
			for (const ability of speciesOptions.abilities) {
				assert(dex.abilities.get(ability).exists, `${name} has an unknown ability: ${ability}`);
			}
			for (const item of speciesOptions.items) {
				assert(dex.items.get(item).exists, `${name} has an unknown item: ${item}`);
			}

			let totalWeight = 0;
			for (const [roleName, roleOptions] of Object.entries(speciesOptions.roles)) {
				const roleStats = speciesStats.roles[roleName];
				const expectedMoves = new Set();
				for (const sourceSet of source.data.sets) {
					if (sourceSet.role !== roleName) continue;
					for (const move of sourceSet.movepool) {
						expectedMoves.add(dex.moves.get(move).name);
					}
				}
				assert.deepEqual(
					sorted(roleOptions.moves), sorted(expectedMoves),
					`${name}'s ${roleName} moves do not match merged randomSets`
				);
				assert.deepEqual(
					sorted(Object.keys(roleStats.moves)), sorted(roleOptions.moves),
					`${name}'s ${roleName} moves differ between options and stats`
				);
				assertProbabilityTable(roleStats.moves, `${name}.${roleName}.moves`);
				assertProbabilityTable(roleStats.abilities, `${name}.${roleName}.abilities`);
				assertProbabilityTable(roleStats.items, `${name}.${roleName}.items`);
				assert.deepEqual(
					sorted(Object.keys(roleStats.abilities)), sorted(roleOptions.abilities),
					`${name}'s ${roleName} abilities differ`
				);
				assert.deepEqual(
					sorted(Object.keys(roleStats.items)), sorted(roleOptions.items),
					`${name}'s ${roleName} items differ`
				);
				assert.bounded(roleStats.weight, [0, 1], `${name}'s ${roleName} weight is invalid`);
				totalWeight += roleStats.weight;

				assertStatTable(roleOptions.evs, 'evs', `${name}.${roleName}`);
				assertStatTable(roleOptions.ivs, 'ivs', `${name}.${roleName}`);
				assert.deepEqual(roleStats.evs, roleOptions.evs);
				assert.deepEqual(roleStats.ivs, roleOptions.ivs);
				if (roleOptions.evs) rolesWithEVs++;
				if (roleOptions.ivs) rolesWithIVs++;
			}
			assert(Math.abs(totalWeight - 1) <= 0.001, `${name}'s role weights sum to ${totalWeight}`);

			assertStatTable(speciesOptions.evs, 'evs', name);
			assertStatTable(speciesOptions.ivs, 'ivs', name);
			assert.deepEqual(speciesStats.evs, speciesOptions.evs);
			assert.deepEqual(speciesStats.ivs, speciesOptions.ivs);
		}
		assert(rolesWithEVs > 0, `No role-specific EV overrides were emitted`);
		assert(rolesWithIVs > 0, `No role-specific IV overrides were emitted`);
	});

	it('should cover every one of the format transformations', () => {
		assert.equal(generator.megaFormes.length, EXPECTED_TRANSFORMATION_COUNT);
		const transformationNames = generator.megaFormes.map(
			speciesId => dex.species.get(speciesId).name
		);
		assert.equal(transformationNames.length, 52);
		for (const name of transformationNames) {
			assert(options[name], `Options are missing ${name}`);
			assert(stats[name], `Stats are missing ${name}`);
		}
	});

	it('should produce deterministic data from sampled generated teams', function () {
		this.timeout(10_000);
		const settings = {
			sampleCount: 256,
			requireSpeciesCoverage: false,
			requireTransformationCoverage: false,
		};
		const first = buildArtifacts(settings);
		const second = buildArtifacts(settings);
		assert.equal(serializeArtifact(first.options), serializeArtifact(second.options));
		assert.equal(serializeArtifact(first.stats), serializeArtifact(second.stats));
	});
});

describe('[Gen 3] Mega Random Battle generated randbats data freshness (slow)', () => {
	it(`should match a fresh ${DEFAULT_SAMPLE_COUNT}-team generator run`, function () {
		this.timeout(0);
		checkArtifacts(buildArtifacts());
	});
});
