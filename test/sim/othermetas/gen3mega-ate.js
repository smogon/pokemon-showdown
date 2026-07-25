'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Dex = require('./../../../dist/sim').Dex;

// The custom [Gen 3] Megas formats (mods 'gen3mega' and 'gen3megascap') re-legalize
// the later-gen "-ate" type-changing abilities for the ported Mega formes. Gen 3
// needs three things from them that no other generation does, and all three live in
// the mods' own abilities.ts — data/mods/gen3 is upstream-pristine and must stay
// that way, because 26 stock ADV formats declare it and every GSC format inherits it.
//
//  1. Dispatch: Gen 3's useMoveInner never fires ModifyType, so the retype is
//     written as onModifyMove.
//  2. Category: Gen 3 derives a damaging move's class from its TYPE, so a retype
//     has to re-derive it — Refrigerate's Ice Return is Special, Aerilate's Flying
//     Return stays Physical.
//  3. Power: the Gen 7+ 1.2x (4915/4096) boost, not Gen 6's 1.3x (5325/4096) that
//     the mod chain (gen3mega -> gen3 -> ... -> gen6) would otherwise supply.
const GEN7_ATE_MOD = [4915, 4096]; // 1.2x
const GEN6_ATE_MOD = [5325, 4096]; // 1.3x

// -ate abilities actually legal in the mega mods. Pixilate/Galvanize are deliberately
// NOT re-legalized (no Fairy type in Gen 3). Dragonize is a custom, base-only ability.
const ATES = ['aerilate', 'refrigerate', 'dragonize'];

// Retyped-to, and the Gen 3 class that type implies.
const ATE_RESULT = {
	aerilate: { type: 'Flying', category: 'Physical' },
	refrigerate: { type: 'Ice', category: 'Special' },
	dragonize: { type: 'Dragon', category: 'Special' },
};

// A Mega that carries each -ate, per mod, with the stone that triggers it.
const CARRIERS = {
	gen3megas: [
		{ ability: 'aerilate', species: 'Pinsir', base: 'hypercutter', item: 'pinsirite' },
		{ ability: 'refrigerate', species: 'Glalie', base: 'innerfocus', item: 'glalitite' },
		{ ability: 'dragonize', species: 'Feraligatr', base: 'torrent', item: 'feraligite' },
	],
	gen3megascap: [
		{ ability: 'dragonize', species: 'Mantine', base: 'swiftswim', item: 'mantite' },
	],
};

// Invoke the resolved ability's onBasePower with a minimal context that captures
// the chainModify argument, with the move flagged as type-changed by this ability.
function capturedBoost(ability) {
	let captured = null;
	const context = {
		effect: ability,
		chainModify(arg) { captured = arg; return arg; },
	};
	ability.onBasePower.call(context, 100, {}, {}, { typeChangerBoosted: ability });
	return captured;
}

// What the engine saw at damage time. Type and category are both decided before
// this point, so one hook pins the retype and the reclassification together.
function watchDamage(battle) {
	const seen = [];
	const orig = battle.actions.getDamage.bind(battle.actions);
	battle.actions.getDamage = function (source, target, move, ...rest) {
		if (move && move.id) seen.push({ id: move.id, type: move.type, category: move.category });
		return orig(source, target, move, ...rest);
	};
	return moveid => seen.find(s => s.id === moveid);
}

// One turn of `moveid` from a Mega'd carrier into a passive wall.
function attackWith(formatid, carrier, moveid, { mega = true } = {}) {
	const battle = common.createBattle({ formatid }, [[
		{
			species: carrier.species, ability: carrier.base, item: mega ? carrier.item : 'leftovers',
			moves: [moveid], evs: { atk: 252, spa: 252 }, level: 100, happiness: 255,
			// IVs for Hidden Power Fighting under the Gen 3 formula.
			ivs: { hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30 },
		},
	], [
		{ species: 'Snorlax', ability: 'immunity', moves: ['rest'], evs: { hp: 252, def: 252 }, level: 100 },
	]]);
	const seen = watchDamage(battle);
	battle.makeChoices(`move 1${mega ? ' mega' : ''}`, 'auto');
	return { battle, seen };
}

describe('[Gen 3] Megas -ate abilities', () => {
	for (const id of ATES) {
		it(`${id} applies the Gen 7+ 1.2x boost, not Gen 6's 1.3x`, () => {
			const ability = Dex.mod('gen3mega').abilities.get(id);
			assert(ability.exists, `${id} should exist in gen3mega`);
			assert.equal(ability.isNonstandard, null, `${id} should be legal in gen3mega`);
			assert.equal(typeof ability.onBasePower, 'function', `${id} should have an onBasePower handler`);

			const boost = capturedBoost(ability);
			assert.deepEqual(boost, GEN7_ATE_MOD, `${id} should boost by 1.2x (4915/4096)`);
			assert.notDeepEqual(boost, GEN6_ATE_MOD, `${id} must not use Gen 6's 1.3x (5325/4096)`);
		});

		// The retype has to be an onModifyMove handler specifically. Gen 3's
		// useMoveInner never fires ModifyType, so an inherited onModifyType would
		// leave the ability completely inert and every test below would still pass
		// on the power modifier alone.
		it(`${id} carries its own onModifyMove, because Gen 3 never fires ModifyType`, () => {
			for (const mod of ['gen3mega', 'gen3megascap']) {
				const ability = Dex.mod(mod).abilities.get(id);
				assert.equal(typeof ability.onModifyMove, 'function',
					`${mod}'s ${id} must express the retype as onModifyMove`);
			}
		});
	}

	it('sanity: base (modern) gen still uses 1.2x and gen6 still uses 1.3x', () => {
		assert.deepEqual(capturedBoost(Dex.abilities.get('aerilate')), GEN7_ATE_MOD);
		assert.deepEqual(capturedBoost(Dex.mod('gen6').abilities.get('aerilate')), GEN6_ATE_MOD);
	});

	for (const [formatid, carriers] of Object.entries(CARRIERS)) {
		for (const carrier of carriers) {
			const { type, category } = ATE_RESULT[carrier.ability];

			it(`${formatid}: ${carrier.species}-Mega's ${carrier.ability} turns Return ${type}/${category}`, () => {
				const { seen } = attackWith(formatid, carrier, 'return');
				const hit = seen('return');
				assert(hit, 'Return should have dealt damage');
				assert.equal(hit.type, type, `${carrier.ability} should retype Return to ${type}`);
				// Gen 3 has no physical/special split: the class follows the new type.
				assert.equal(hit.category, category,
					`${type} is ${category} in Gen 3, so the retyped Return must be ${category}`);
			});

			it(`${formatid}: ${carrier.species} without its stone leaves Return alone`, () => {
				const { seen } = attackWith(formatid, carrier, 'return', { mega: false });
				const hit = seen('return');
				assert(hit, 'Return should have dealt damage');
				assert.equal(hit.type, 'Normal', 'an unevolved carrier has no -ate ability');
				assert.equal(hit.category, 'Physical');
			});
		}
	}

	// Moves the retype must not touch. Each fails differently: Weather Ball is on
	// base's noModifyType list, Hidden Power has already left Normal via its own
	// onModifyMove by the time the ability is consulted, and Beat Up retypes itself
	// to ??? — the case that broke when this logic lived in the shared gen3 mod.
	describe('moves the retype must leave alone', () => {
		const carrier = CARRIERS.gen3megas[1]; // Glalie/Refrigerate: the one that also flips category

		it('Weather Ball stays Normal (it is on the noModifyType list)', () => {
			const { seen } = attackWith('gen3megas', carrier, 'weatherball');
			const hit = seen('weatherball');
			assert(hit, 'Weather Ball should have dealt damage');
			assert.equal(hit.type, 'Normal', 'Weather Ball is exempt from -ate');
			assert.equal(hit.category, 'Physical');
		});

		it('Hidden Power keeps its hpType', () => {
			const { seen } = attackWith('gen3megas', carrier, 'hiddenpowerfighting');
			const hit = seen('hiddenpower');
			assert(hit, 'Hidden Power should have dealt damage');
			assert.equal(hit.type, 'Fighting', 'Hidden Power resolves to its hpType, not Ice');
			assert.equal(hit.category, 'Physical', 'Fighting is a physical type in Gen 3');
		});

		it('Beat Up stays ??? / Special (the Gen 3 base-stat substitution)', () => {
			const { seen } = attackWith('gen3megas', carrier, 'beatup');
			const hit = seen('beatup');
			assert(hit, 'Beat Up should have dealt damage');
			assert.equal(hit.type, '???', 'Beat Up retypes itself to ??? and is not -ate bait');
			assert.equal(hit.category, 'Special',
				'Beat Up forces Special so its base-stat substitution runs through SpA/SpD');
		});
	});

	// The point of keeping all of the above inside the mega mods: data/mods/gen3 is
	// shared with 26 stock ADV formats and, through gen2, every GSC format. An
	// earlier revision put the retype and the category recompute in gen3's
	// useMoveInner, and it broke Beat Up in official [Gen 3] OU.
	describe('the shared [Gen 3] mod is untouched by this feature', () => {
		it('no -ate ability is legal in the stock gen3 mod', () => {
			for (const id of ATES) {
				assert.notEqual(Dex.mod('gen3').abilities.get(id).isNonstandard, null,
					`${id} must stay illegal outside the mega mods`);
			}
		});

		it('gen3 useMoveInner does not fire ModifyType', () => {
			const battle = common.createBattle({ formatid: 'gen3ou' }, [
				[{ species: 'Snorlax', ability: 'immunity', moves: ['return'], evs: { atk: 252 }, happiness: 255 }],
				[{ species: 'Skarmory', ability: 'keeneye', moves: ['spikes'], evs: { hp: 252, def: 252 } }],
			]);
			const fired = [];
			const orig = battle.singleEvent.bind(battle);
			battle.singleEvent = function (eventid, ...rest) {
				fired.push(eventid);
				return orig(eventid, ...rest);
			};
			battle.makeChoices('move return', 'move spikes');
			assert(!fired.includes('ModifyType'),
				'the fork must not add a ModifyType dispatch to the shared gen3 mod');
		});

		it('Beat Up still substitutes base stats in [Gen 3] OU', () => {
			const battle = common.createBattle({ formatid: 'gen3ou' }, [[
				{ species: 'Houndoom', ability: 'flashfire', moves: ['beatup'], evs: { atk: 252 }, level: 100 },
				{ species: 'Snorlax', ability: 'immunity', moves: ['rest'], level: 100 },
			], [
				{ species: 'Skarmory', ability: 'keeneye', moves: ['spikes'], evs: { hp: 252, def: 252 }, level: 100 },
			]]);
			const seen = watchDamage(battle);
			battle.makeChoices('move beatup', 'move spikes');
			const hit = seen('beatup');
			assert(hit, 'Beat Up should have dealt damage');
			assert.equal(hit.type, '???');
			assert.equal(hit.category, 'Special');
			// One hit per healthy party member, each borrowing that ally's base
			// Attack through the onModifySpA/onFoeModifySpD pipeline that the
			// Special class is what enables.
			assert(battle.log.includes('|-hitcount|p2a: Skarmory|2'),
				`Beat Up should hit once per healthy ally, got: ${battle.log.filter(l => l.startsWith('|-hitcount|'))}`);
		});
	});
});
