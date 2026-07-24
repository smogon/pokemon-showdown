#!/usr/bin/env node
'use strict';

/**
 * Generate pkmn/randbats-compatible options and statistics for
 * [Gen 3] Megas CAP Random Battle.
 *
 * This is adapted from pkmn/randbats' `update` program:
 * https://github.com/pkmn/randbats
 *
 * Copyright (c) 2020-2024 pkmn contributors. Licensed under the MIT License;
 * see generate-gen3megascap-randbats.LICENSE in this directory.
 */

const fs = require('fs');
const path = require('path');

const { Dex, toID } = require('../dist/sim/dex');
const { Teams } = require('../dist/sim/teams');

const FORMAT_ID = 'gen3megascaprandombattle';
const DEFAULT_SAMPLE_COUNT = 100_000;
const DEFAULT_SEED = Object.freeze([1, 2, 3, 4]);
const EXPECTED_TRANSFORMATION_COUNT = 23;
const DEFAULT_OUTPUT_DIRECTORY = path.resolve(
	__dirname, '../data/random-battles/gen3megascap/generated'
);
const STAT_NAMES = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const DEFAULT_EVS = 85;
const DEFAULT_IVS = 31;

function compareText(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}

function compareCounts(a, b) {
	return b[1] - a[1] || compareText(a[0], b[0]);
}

function roundProbability(value) {
	return Math.round(value * 10_000) / 10_000;
}

function increment(map, key) {
	map.set(key, (map.get(key) || 0) + 1);
}

function createStatTracker() {
	return {
		count: 0,
		evs: {},
		ivs: {},
	};
}

function observeStats(tracker, set) {
	for (const stat of STAT_NAMES) {
		const ev = set.evs[stat];
		const iv = set.ivs[stat];
		if (!Number.isInteger(ev) || !Number.isInteger(iv)) {
			throw new Error(`Generated set for ${set.species} is missing ${stat} EVs or IVs`);
		}

		if (!tracker.count) {
			tracker.evs[stat] = ev;
			tracker.ivs[stat] = iv;
		} else {
			if (tracker.evs[stat] !== ev) tracker.evs[stat] = null;
			if (tracker.ivs[stat] !== iv) tracker.ivs[stat] = null;
		}
	}
	tracker.count++;
}

function createRoleCollector(role) {
	return {
		role,
		count: 0,
		abilities: new Map(),
		items: new Map(),
		moves: new Map(),
		stats: createStatTracker(),
	};
}

function createCollectors(generator, dex) {
	const collectors = new Map();
	for (const [speciesId, speciesData] of Object.entries(generator.randomSets)) {
		const species = dex.species.get(speciesId);
		if (!species.exists || species.id !== speciesId) {
			throw new Error(`Invalid species ${speciesId} in ${FORMAT_ID}'s merged randomSets`);
		}
		if (!Number.isInteger(speciesData.level) || !Array.isArray(speciesData.sets)) {
			throw new Error(`Invalid random set data for ${speciesId}`);
		}

		const roles = new Map();
		for (const sourceSet of speciesData.sets) {
			if (!sourceSet.role || !Array.isArray(sourceSet.movepool)) {
				throw new Error(`Invalid role data for ${speciesId}`);
			}
			let role = roles.get(sourceSet.role);
			if (!role) {
				role = createRoleCollector(sourceSet.role);
				roles.set(sourceSet.role, role);
			}
			for (const move of sourceSet.movepool) role.moves.set(toID(move), 0);
		}

		collectors.set(speciesId, {
			speciesId,
			name: species.name,
			level: speciesData.level,
			count: 0,
			abilities: new Map(),
			items: new Map(),
			roles,
			stats: createStatTracker(),
		});
	}
	return collectors;
}

function observeSet(collector, set) {
	if (set.level !== collector.level) {
		throw new Error(
			`${collector.name} generated at level ${set.level}; expected ${collector.level}`
		);
	}
	if (!set.role) throw new Error(`${collector.name} generated without a role`);

	let role = collector.roles.get(set.role);
	if (!role) {
		role = createRoleCollector(set.role);
		collector.roles.set(set.role, role);
	}

	collector.count++;
	role.count++;
	if (set.ability) {
		increment(collector.abilities, set.ability);
		increment(role.abilities, set.ability);
	}
	if (set.item) {
		increment(collector.items, set.item);
		increment(role.items, set.item);
	}
	for (const move of set.moves) increment(role.moves, toID(move));
	observeStats(collector.stats, set);
	observeStats(role.stats, set);
}

function collectGeneratedSets(options = {}) {
	const sampleCount = options.sampleCount ?? DEFAULT_SAMPLE_COUNT;
	const seed = options.seed ? [...options.seed] : [...DEFAULT_SEED];
	if (!Number.isSafeInteger(sampleCount) || sampleCount < 1) {
		throw new Error(`Sample count must be a positive safe integer`);
	}
	if (seed.length !== 4 || seed.some(value => !Number.isInteger(value))) {
		throw new Error(`Seed must contain four integers`);
	}

	Dex.includeModData();
	const format = Dex.formats.get(FORMAT_ID);
	if (!format.exists || format.id !== FORMAT_ID) {
		throw new Error(`Format ${FORMAT_ID} is not available`);
	}
	const dex = Dex.forFormat(format);
	const generator = Teams.getGenerator(format, seed);
	if (generator.megaFormes?.length !== EXPECTED_TRANSFORMATION_COUNT) {
		throw new Error(
			`${FORMAT_ID} must expose ${EXPECTED_TRANSFORMATION_COUNT} transformations; ` +
			`found ${generator.megaFormes?.length || 0}`
		);
	}

	const collectors = createCollectors(generator, dex);
	for (let i = 0; i < sampleCount; i++) {
		for (const set of generator.getTeam()) {
			const speciesId = toID(set.speciesId || set.species);
			const collector = collectors.get(speciesId);
			if (!collector) {
				throw new Error(`Generated ${speciesId}, which is absent from merged randomSets`);
			}
			observeSet(collector, set);
		}
	}

	if (options.requireSpeciesCoverage !== false) {
		const missing = [...collectors.values()]
			.filter(collector => !collector.count)
			.map(collector => collector.speciesId);
		if (missing.length) {
			throw new Error(`Sample missed generated species: ${missing.join(', ')}`);
		}
	}

	const missingTransformations = generator.megaFormes.filter(
		speciesId => !collectors.get(speciesId)?.count
	);
	if (options.requireTransformationCoverage !== false && missingTransformations.length) {
		throw new Error(`Sample missed transformations: ${missingTransformations.join(', ')}`);
	}

	return { collectors, dex };
}

function sortedNames(counts) {
	return [...counts.keys()].sort(compareText);
}

function probabilities(counts, total, transformName = name => name) {
	const entries = [...counts].map(([name, count]) => [transformName(name), count]);
	entries.sort(compareCounts);
	return Object.fromEntries(entries.map(([name, count]) => [
		name, total ? roundProbability(count / total) : 0,
	]));
}

function addStatFields(tracker, options, stats) {
	for (const [field, defaultValue] of [['evs', DEFAULT_EVS], ['ivs', DEFAULT_IVS]]) {
		const values = {};
		for (const stat of STAT_NAMES) {
			const value = tracker[field][stat];
			if (value !== null && value !== undefined && value !== defaultValue) {
				values[stat] = value;
			}
		}
		if (Object.keys(values).length) {
			options[field] = values;
			stats[field] = { ...values };
		}
	}
}

function displayCounts(collector, options, stats) {
	if (collector.abilities.size) {
		options.abilities = sortedNames(collector.abilities);
		stats.abilities = probabilities(collector.abilities, collector.count);
	}
	if (collector.items.size) {
		options.items = sortedNames(collector.items);
		stats.items = probabilities(collector.items, collector.count);
	}
}

function buildArtifacts(options = {}) {
	const { collectors, dex } = collectGeneratedSets(options);
	const generated = [...collectors.values()].sort((a, b) => compareText(a.name, b.name));
	const optionData = {};
	const statsData = {};

	for (const collector of generated) {
		const speciesOptions = { level: collector.level };
		const speciesStats = { level: collector.level };
		displayCounts(collector, speciesOptions, speciesStats);

		speciesOptions.roles = {};
		speciesStats.roles = {};
		const roles = [...collector.roles.values()].sort(
			(a, b) => b.count - a.count || compareText(a.role, b.role)
		);
		for (const role of roles) {
			const roleOptions = {};
			const roleStats = {
				weight: collector.count ? roundProbability(role.count / collector.count) : 0,
			};
			displayCounts(role, roleOptions, roleStats);

			const moveName = moveId => dex.moves.get(moveId).name;
			roleOptions.moves = [...role.moves.keys()].map(moveName).sort(compareText);
			roleStats.moves = probabilities(role.moves, role.count, moveName);
			addStatFields(role.stats, roleOptions, roleStats);

			speciesOptions.roles[role.role] = roleOptions;
			speciesStats.roles[role.role] = roleStats;
		}
		addStatFields(collector.stats, speciesOptions, speciesStats);

		optionData[collector.name] = speciesOptions;
		statsData[collector.name] = speciesStats;
	}

	return { options: optionData, stats: statsData };
}

function serializeArtifact(data) {
	return `${JSON.stringify(data, null, 2)}\n`;
}

function getArtifactPaths(outputDirectory = DEFAULT_OUTPUT_DIRECTORY) {
	return {
		options: path.join(outputDirectory, `${FORMAT_ID}.json`),
		stats: path.join(outputDirectory, 'stats', `${FORMAT_ID}.json`),
	};
}

function writeArtifacts(artifacts, outputDirectory = DEFAULT_OUTPUT_DIRECTORY) {
	const files = getArtifactPaths(outputDirectory);
	fs.mkdirSync(path.dirname(files.options), { recursive: true });
	fs.mkdirSync(path.dirname(files.stats), { recursive: true });
	fs.writeFileSync(files.options, serializeArtifact(artifacts.options));
	fs.writeFileSync(files.stats, serializeArtifact(artifacts.stats));
	return files;
}

function checkArtifacts(artifacts, outputDirectory = DEFAULT_OUTPUT_DIRECTORY) {
	const files = getArtifactPaths(outputDirectory);
	const stale = [];
	for (const [kind, file] of Object.entries(files)) {
		const expected = serializeArtifact(artifacts[kind]);
		const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
		if (actual !== expected) stale.push(file);
	}
	if (stale.length) {
		throw new Error(
			`Generated randbats data is stale:\n${stale.join('\n')}\n` +
			`Run npm run generate-gen3megascap-randbats`
		);
	}
	return files;
}

function parseSeed(value) {
	const seed = value.split(',').map(Number);
	if (seed.length !== 4 || seed.some(part => !Number.isInteger(part))) {
		throw new Error(`--seed must be four comma-separated integers`);
	}
	return seed;
}

function parseArgs(args) {
	const options = {
		check: false,
		help: false,
		outputDirectory: DEFAULT_OUTPUT_DIRECTORY,
		sampleCount: DEFAULT_SAMPLE_COUNT,
		seed: [...DEFAULT_SEED],
	};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === '--check') {
			options.check = true;
		} else if (arg === '--help' || arg === '-h') {
			options.help = true;
		} else if (arg === '--samples') {
			options.sampleCount = Number(args[++i]);
		} else if (arg.startsWith('--samples=')) {
			options.sampleCount = Number(arg.slice('--samples='.length));
		} else if (arg === '--seed') {
			options.seed = parseSeed(args[++i] || '');
		} else if (arg.startsWith('--seed=')) {
			options.seed = parseSeed(arg.slice('--seed='.length));
		} else if (arg === '--output') {
			options.outputDirectory = path.resolve(args[++i] || '');
		} else if (arg.startsWith('--output=')) {
			options.outputDirectory = path.resolve(arg.slice('--output='.length));
		} else {
			throw new Error(`Unknown argument: ${arg}`);
		}
	}
	return options;
}

function printHelp() {
	process.stdout.write(
		`Usage: node tools/generate-gen3megascap-randbats.js [options]\n\n` +
		`Options:\n` +
		`  --check               Verify committed artifacts without writing\n` +
		`  --samples <count>     Teams to sample (default: ${DEFAULT_SAMPLE_COUNT})\n` +
		`  --seed <a,b,c,d>      PRNG seed (default: ${DEFAULT_SEED.join(',')})\n` +
		`  --output <directory>  Output root (default: server gen3megascap/generated)\n`
	);
}

function main(args) {
	const options = parseArgs(args);
	if (options.help) {
		printHelp();
		return;
	}

	const artifacts = buildArtifacts(options);
	const files = options.check ?
		checkArtifacts(artifacts, options.outputDirectory) :
		writeArtifacts(artifacts, options.outputDirectory);
	const verb = options.check ? 'Verified' : 'Generated';
	process.stdout.write(
		`${verb} ${Object.keys(artifacts.options).length} species from ` +
		`${options.sampleCount} ${FORMAT_ID} teams (seed ${options.seed.join(',')}).\n` +
		`${files.options}\n${files.stats}\n`
	);
}

if (require.main === module) {
	try {
		main(process.argv.slice(2));
	} catch (error) {
		process.stderr.write(`${error.stack || error}\n`);
		process.exitCode = 1;
	}
}

module.exports = {
	DEFAULT_OUTPUT_DIRECTORY,
	DEFAULT_SAMPLE_COUNT,
	DEFAULT_SEED,
	EXPECTED_TRANSFORMATION_COUNT,
	FORMAT_ID,
	buildArtifacts,
	checkArtifacts,
	collectGeneratedSets,
	getArtifactPaths,
	main,
	parseArgs,
	serializeArtifact,
	writeArtifacts,
};
