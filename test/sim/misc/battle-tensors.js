'use strict';

const crypto = require('crypto');

const assert = require('./../../assert');
const common = require('./../../common');
const Sim = require('./../../../dist/sim');
const randomSets = require('./../../../data/random-battles/gen9/sets.json');

const {
	decodeGen9RandomBattleAction,
	encodeBattleState,
	encodeOmniscientBattleState,
	GEN9_RANDOM_BATTLE_ACTION_LABELS,
	GEN9_RANDOM_BATTLE_TENSOR_MANIFEST,
} = Sim;

const TEAMS = [[
	{
		species: 'Blissey', ability: 'Natural Cure', item: 'Heavy-Duty Boots', teraType: 'Fairy',
		moves: ['softboiled', 'seismictoss', 'protect', 'toxic'],
	},
	{
		species: 'Chansey', ability: 'Natural Cure', item: 'Eviolite', teraType: 'Normal',
		moves: ['softboiled', 'seismictoss', 'stealthrock', 'thunderwave'],
	},
], [
	{
		species: 'Snorlax', ability: 'Thick Fat', item: 'Leftovers', teraType: 'Normal',
		moves: ['rest', 'sleeptalk', 'bodyslam', 'earthquake'],
	},
	{
		species: 'Mew', ability: 'Synchronize', item: 'Leftovers', teraType: 'Psychic',
		moves: ['psychic', 'protect', 'uturn', 'willowisp'],
	},
]];

function publicHpBucket(hp, maxhp) {
	let percentage = Math.ceil(100 * hp / maxhp);
	if (percentage === 100 && hp < maxhp) percentage = 99;
	return percentage;
}

function findSharedPublicHpPair(maxhp) {
	for (let hp = maxhp - 1; hp > 1; hp--) {
		if (publicHpBucket(hp, maxhp) === publicHpBucket(hp - 1, maxhp)) return [hp - 1, hp];
	}
	throw new Error(`No matching public HP pair found for max HP ${maxhp}`);
}

function indexOf(tensor, label) {
	const index = tensor.labels.indexOf(label);
	assert.notEqual(index, -1, `Missing tensor field ${label}`);
	return index;
}

describe('Gen 9 Random Battle tensors', () => {
	let battle;
	beforeEach(() => {
		battle = common.createBattle({ formatid: 'gen9randombattle' }, TEAMS);
	});
	afterEach(() => {
		battle.destroy();
		battle = null;
	});

	it('should expose an immutable manifest with a valid schema hash', () => {
		const { schemaHash, ...core } = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST;
		const actualHash = crypto.createHash('sha256').update(JSON.stringify(core)).digest('hex');
		assert.equal(actualHash, schemaHash);
		assert.equal(GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.reservedTokens.none, 0);
		assert.equal(GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.reservedTokens.unknown, 1);
		assert(Object.isFrozen(GEN9_RANDOM_BATTLE_TENSOR_MANIFEST));
		assert(Object.isFrozen(GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.vocabularies.species));
	});

	it('should cover every species, move, and ability in the Random Battle set data', () => {
		const vocabularies = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST.vocabularies;
		const species = new Set(vocabularies.species);
		const moves = new Set(vocabularies.moves);
		const abilities = new Set(vocabularies.abilities);
		for (const [speciesId, speciesData] of Object.entries(randomSets)) {
			assert(species.has(Sim.toID(speciesId)), `Missing species token for ${speciesId}`);
			for (const set of speciesData.sets) {
				for (const move of set.movepool) {
					assert(moves.has(Sim.toID(move)), `Missing move token for ${move}`);
				}
				for (const ability of set.abilities) {
					assert(abilities.has(Sim.toID(ability)), `Missing ability token for ${ability}`);
				}
			}
		}
	});

	it('should emit tensors matching the checked-in field contract', () => {
		const encoded = encodeBattleState(battle, 'p1');
		const manifest = GEN9_RANDOM_BATTLE_TENSOR_MANIFEST;

		assert.equal(encoded.schemaVersion, manifest.schemaVersion);
		assert.equal(encoded.schemaHash, manifest.schemaHash);
		assert.deepEqual(encoded.continuous.shape, [186]);
		assert.deepEqual(encoded.categorical.shape, [147]);
		assert.deepEqual(encoded.binary.shape, [301]);
		assert.deepEqual(encoded.actionMask.shape, [14]);
		assert.deepEqual(encoded.continuous.labels, manifest.fields.continuous);
		assert.deepEqual(encoded.categorical.labels, manifest.fields.categorical);
		assert.deepEqual(encoded.binary.labels, manifest.fields.binary);
		assert.deepEqual(encoded.actionMask.labels, manifest.actions);
		assert(encoded.continuous.data instanceof Float32Array);
		assert(encoded.categorical.data instanceof Int32Array);
		assert(encoded.binary.data instanceof Uint8Array);
		assert(encoded.actionMask.data instanceof Uint8Array);
	});

	it('should distinguish known, unknown, and absent categorical values', () => {
		const encoded = encodeBattleState(battle, 'p1');
		const ownItem = indexOf(encoded.categorical, 'you.slot1.item');
		const foeItem = indexOf(encoded.categorical, 'foe.slot1.item');
		const foeItemKnown = indexOf(encoded.binary, 'foe.slot1.itemKnown');
		const absentSpecies = indexOf(encoded.categorical, 'you.slot3.species');

		assert(encoded.categorical.data[ownItem] > 1);
		assert.equal(encoded.categorical.data[foeItem], 1);
		assert.equal(encoded.binary.data[foeItemKnown], 0);
		assert.equal(encoded.categorical.data[absentSpecies], 0);
	});

	it('should hide exact opponent HP while retaining exact own HP', () => {
		const playerLabels = encodeBattleState(battle, 'p1').continuous.labels;
		const ownHpIndex = playerLabels.indexOf('you.slot1.hp');
		const foeHpIndex = playerLabels.indexOf('foe.slot1.hp');
		const [ownLowHp, ownHighHp] = findSharedPublicHpPair(battle.p1.active[0].maxhp);
		const [foeLowHp, foeHighHp] = findSharedPublicHpPair(battle.p2.active[0].maxhp);

		battle.p1.active[0].sethp(ownLowHp);
		battle.p2.active[0].sethp(foeLowHp);
		const playerLow = encodeBattleState(battle, 'p1');
		const fullLow = encodeOmniscientBattleState(battle, 'p1');

		battle.p1.active[0].sethp(ownHighHp);
		battle.p2.active[0].sethp(foeHighHp);
		const playerHigh = encodeBattleState(battle, 'p1');
		const fullHigh = encodeOmniscientBattleState(battle, 'p1');

		assert.notEqual(playerLow.continuous.data[ownHpIndex], playerHigh.continuous.data[ownHpIndex]);
		assert.equal(playerLow.continuous.data[foeHpIndex], playerHigh.continuous.data[foeHpIndex]);
		assert.notEqual(fullLow.continuous.data[foeHpIndex], fullHigh.continuous.data[foeHpIndex]);
	});

	it('should encode and decode ordinary move, Tera, and switch actions', () => {
		const encoded = encodeBattleState(battle, 'p1');
		assert.deepEqual(encoded.actionMask.labels, GEN9_RANDOM_BATTLE_ACTION_LABELS);
		assert.deepEqual([...encoded.actionMask.data], [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0]);
		assert.equal(decodeGen9RandomBattleAction(battle, 'p1', 0), 'move softboiled');
		assert.equal(decodeGen9RandomBattleAction(battle, 'p1', 4), 'move softboiled terastallize');
		assert.equal(decodeGen9RandomBattleAction(battle, 'p1', 9), 'switch 2');
		assert.throws(() => decodeGen9RandomBattleAction(battle, 'p1', 8));
	});

	it('should map synthetic Struggle and Recharge requests to move slot one', () => {
		for (const moveSlot of battle.p1.active[0].moveSlots) moveSlot.pp = 0;
		battle.makeRequest('move');
		let encoded = encodeBattleState(battle, 'p1');
		assert.equal(encoded.actionMask.data[0], 1);
		assert.equal(decodeGen9RandomBattleAction(battle, 'p1', 0), 'move struggle');

		battle.p1.activeRequest.active[0].moves = [{ move: 'Recharge', id: 'recharge' }];
		encoded = encodeBattleState(battle, 'p1');
		assert.equal(encoded.actionMask.data[0], 1);
		assert.equal(decodeGen9RandomBattleAction(battle, 'p1', 0), 'move recharge');
	});

	it('should reject formats outside the manifest contract', () => {
		const unsupported = common.createBattle({ preview: false }, TEAMS);
		assert.throws(() => encodeBattleState(unsupported, 'p1'), /does not support format/);
		unsupported.destroy();
	});
});
