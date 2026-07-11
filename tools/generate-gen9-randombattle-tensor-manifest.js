'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { Dex, toID } = require('../dist/sim/dex');
const randomSets = require('../data/random-battles/gen9/sets.json');

const SCHEMA_VERSION = 'ps-gen9-randombattle-v1';
const MAX_TEAM_SIZE = 6;
const MAX_MOVE_SLOTS = 4;
const BOOST_IDS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
const PSEUDOWEATHER_IDS = ['trickroom', 'gravity', 'magicroom', 'wonderroom'];
const SIDE_CONDITION_IDS = [
	'stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
	'reflect', 'lightscreen', 'auroraveil', 'tailwind',
	'safeguard', 'mist', 'luckychant',
];

function vocabulary(values) {
	return ['__none__', '__unknown__', ...new Set(values.map(toID).filter(Boolean))].sort((a, b) => {
		if (a === '__none__') return -1;
		if (b === '__none__') return 1;
		if (a === '__unknown__') return -1;
		if (b === '__unknown__') return 1;
		return a.localeCompare(b);
	});
}

function pokemonLabels(prefix, continuous, categorical, binary) {
	continuous.push(`${prefix}.hp`, `${prefix}.level`);
	for (const boost of BOOST_IDS) continuous.push(`${prefix}.boost.${boost}`);

	categorical.push(
		`${prefix}.species`, `${prefix}.ability`, `${prefix}.item`, `${prefix}.teraType`,
		`${prefix}.terastallized`, `${prefix}.type1`, `${prefix}.type2`, `${prefix}.status`
	);

	for (const field of [
		'present', 'active', 'revealed', 'fainted', 'hpKnown', 'levelKnown', 'speciesKnown',
		'abilityKnown', 'itemKnown', 'teraTypeKnown', 'typeKnown', 'statusKnown',
	]) {
		binary.push(`${prefix}.${field}`);
	}

	for (let i = 1; i <= MAX_MOVE_SLOTS; i++) {
		continuous.push(`${prefix}.move${i}.pp`);
		categorical.push(`${prefix}.move${i}.id`);
		binary.push(`${prefix}.move${i}.present`, `${prefix}.move${i}.revealed`, `${prefix}.move${i}.disabled`);
	}
}

function tensorFields() {
	const continuous = [
		'battle.turn', 'battle.weatherDuration', 'battle.terrainDuration',
		'you.pokemonLeft', 'you.totalFainted',
		'foe.pokemonLeft', 'foe.totalFainted', 'foe.revealedCount',
	];
	const categorical = ['battle.weather', 'battle.terrain', 'battle.request'];
	const binary = [
		'battle.ended',
		...PSEUDOWEATHER_IDS.map(id => `battle.pseudoWeather.${id}`),
		'you.teraUsed', 'foe.teraUsed', 'you.canTerastallize', 'you.trapped',
		'you.maybeTrapped', 'you.maybeDisabled', 'you.maybeLocked', 'you.noCancel',
	];

	for (const side of ['you', 'foe']) {
		for (const condition of SIDE_CONDITION_IDS) {
			continuous.push(`${side}.sideCondition.${condition}`);
		}
		for (let i = 1; i <= MAX_TEAM_SIZE; i++) {
			pokemonLabels(`${side}.slot${i}`, continuous, categorical, binary);
		}
	}
	return { continuous, categorical, binary };
}

const dex = Dex.forFormat('gen9randombattle');
const randomSpecies = Object.keys(randomSets).map(id => dex.species.get(id));
const randomBaseSpecies = new Set(randomSpecies.map(species => species.baseSpecies));
const species = dex.species.all()
	.filter(entry => entry.exists && randomBaseSpecies.has(entry.baseSpecies))
	.map(entry => entry.id);
const moves = ['struggle', 'recharge'];
const abilities = [];
for (const speciesData of Object.values(randomSets)) {
	for (const set of speciesData.sets) {
		moves.push(...set.movepool);
		abilities.push(...set.abilities);
	}
}
const items = dex.items.all()
	.filter(item => item.exists && (item.isNonstandard === null || item.isNonstandard === 'Past'))
	.map(item => item.id);

const core = {
	schemaVersion: SCHEMA_VERSION,
	supportedFormatIds: ['gen9randombattle'],
	reservedTokens: { none: 0, unknown: 1 },
	normalization: {
		maxTurns: 200,
		maxDuration: 8,
		maxSideConditionLayers: 3,
		maxTeamSize: MAX_TEAM_SIZE,
		maxMoveSlots: MAX_MOVE_SLOTS,
	},
	vocabularies: {
		species: vocabulary(species),
		moves: vocabulary(moves),
		items: vocabulary(items),
		abilities: vocabulary(abilities),
		types: vocabulary(dex.types.all().map(type => type.name)),
		weather: vocabulary([
			'sunnyday', 'desolateland', 'raindance', 'primordialsea', 'sandstorm', 'snow', 'hail', 'deltastream',
		]),
		terrain: vocabulary(['electricterrain', 'grassyterrain', 'mistyterrain', 'psychicterrain']),
		statuses: vocabulary(['brn', 'frz', 'par', 'psn', 'slp', 'tox', 'fnt']),
		requestStates: vocabulary(['move', 'switch', 'wait']),
	},
	fields: tensorFields(),
	actions: [
		'move:slot1', 'move:slot2', 'move:slot3', 'move:slot4',
		'tera:slot1', 'tera:slot2', 'tera:slot3', 'tera:slot4',
		'switch:slot1', 'switch:slot2', 'switch:slot3',
		'switch:slot4', 'switch:slot5', 'switch:slot6',
	],
};
const schemaHash = crypto.createHash('sha256').update(JSON.stringify(core)).digest('hex');
const manifest = { ...core, schemaHash };
const output = path.resolve(__dirname, '../data/random-battles/gen9/tensor-manifest.json');
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 4)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), output)} (${schemaHash})`);
