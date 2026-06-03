'use strict';

const assert = require('../../../assert');

const { evaluateMatchup, chooseBestSwitch } =
	require('../../../../dist/sim/tools/strategic-ai/mechanics/SwitchEvaluator');
const { BattleStateTracker } =
	require('../../../../dist/sim/tools/strategic-ai/state/BattleStateTracker');
const { Dex } = require('../../../../dist/sim');

/**
 * Build a TrackedPokemon-shaped record from species + overrides. We
 * skip `applyRequest` because we don't actually need the request
 * machinery here; we just need the same fields the evaluator reads.
 */
function mkTracked(speciesName, opts = {}) {
	const species = Dex.species.get(speciesName);
	if (!species.exists) throw new Error(`Unknown species: ${speciesName}`);
	const types = opts.types ?? [...species.types];
	return {
		id: `mon:${species.id}`,
		name: species.name,
		species: species.id,
		level: opts.level ?? 100,
		condition: '100/100',
		hpFraction: opts.hpFraction ?? 1,
		status: opts.status ?? '',
		boosts: opts.boosts ?? {},
		types,
		teraType: opts.teraType,
		terastallized: opts.terastallized ?? false,
		ability: opts.ability ?? '',
		baseAbility: opts.ability ?? '',
		item: opts.item ?? '',
		revealedMoves: new Set(opts.revealedMoves || []),
		lastMove: opts.lastMove,
		lastMoveFailed: !!opts.lastMoveFailed,
		sameMoveStreak: opts.sameMoveStreak ?? 0,
		choiceLocked: opts.choiceLocked ?? false,
		stats: opts.stats,
		volatiles: new Set(opts.volatiles || []),
		fainted: !!opts.fainted,
		active: !!opts.active,
		position: opts.position ?? -1,
	};
}

function freshTracker() {
	return new BattleStateTracker({ mySide: 'p1' });
}

describe('Strategic-AI SwitchEvaluator', () => {
	describe('regression: type-matchup math', () => {
		// The legacy `calculateTypeEffectiveness` multiplied attacker
		// types AGAINST defender types, which is wrong: a Water/Flying
		// attacker would look "weak" vs Rock even though it can pick the
		// move it actually attacks with. The current evaluator scores
		// matchups by *move* type, so a dual-STAB attacker should
		// correctly preferred against a defender that resists only one
		// of its STABs.
		it('Charizard (Fire/Flying) into Stealth Rock takes 50% (4x Rock weakness)', () => {
			const tracker = freshTracker();
			tracker.sides.p1.stealthRock = true;

			const charizard = mkTracked('Charizard', {
				ability: 'blaze',
				revealedMoves: ['flamethrower', 'airslash'],
			});
			const tyranitar = mkTracked('Tyranitar', {
				ability: 'sandstream',
				revealedMoves: ['stoneedge', 'crunch'],
			});

			const score = evaluateMatchup(charizard, tyranitar, tracker);
			assert(score.hazardFraction > 0.4,
				`Charizard into SR should take ~50% (got ${score.hazardFraction.toFixed(2)})`);
			assert(score.score < 0,
				`Charizard should score negatively into TTar with SR up (got ${score.score.toFixed(2)})`);
		});

		it('Garchomp into Heatran is a clean offensive matchup (EQ STAB)', () => {
			const tracker = freshTracker();
			const garchomp = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['earthquake', 'dragonclaw'],
			});
			const heatran = mkTracked('Heatran', {
				ability: 'flashfire',
				revealedMoves: ['magmastorm', 'earthpower'],
			});
			const score = evaluateMatchup(garchomp, heatran, tracker);
			assert(score.weDealFraction > 0.5,
				`Earthquake should hit Heatran for >50% (got ${score.weDealFraction.toFixed(2)})`);
			assert(score.score > 0,
				`Garchomp vs Heatran should score positively (got ${score.score.toFixed(2)})`);
		});

		it('chooseBestSwitch prefers the candidate with the better matchup', () => {
			const tracker = freshTracker();
			const heatran = mkTracked('Heatran', {
				ability: 'flashfire',
				revealedMoves: ['magmastorm', 'earthpower'],
			});
			const garchomp = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['earthquake', 'dragonclaw'],
			});
			const skarmory = mkTracked('Skarmory', {
				ability: 'sturdy',
				revealedMoves: ['bravebird', 'roost'],
			});

			const result = chooseBestSwitch([garchomp, skarmory], heatran, tracker);
			assert(result, 'should return a chosen mon');
			assert.equal(result.mon.species, 'garchomp',
				`should pick Garchomp over Skarmory vs Heatran (picked ${result.mon.species})`);
		});

		it('hazard damage shifts the matchup score', () => {
			const trackerNoHazards = freshTracker();
			const trackerHazards = freshTracker();
			trackerHazards.sides.p1.stealthRock = true;
			trackerHazards.sides.p1.spikes = 3;

			const garchomp = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['earthquake'],
			});
			const heatran = mkTracked('Heatran', {
				revealedMoves: ['magmastorm'],
			});
			const clean = evaluateMatchup(garchomp, heatran, trackerNoHazards);
			const dirty = evaluateMatchup(garchomp, heatran, trackerHazards);
			assert(dirty.score < clean.score,
				`Hazards should reduce switch-in value (clean=${clean.score.toFixed(2)} dirty=${dirty.score.toFixed(2)})`);
		});

		it('Heavy-Duty Boots negates hazard tax', () => {
			const tracker = freshTracker();
			tracker.sides.p1.stealthRock = true;
			tracker.sides.p1.spikes = 3;

			const tornNoBoots = mkTracked('Tornadus-Therian', {
				ability: 'regenerator',
				revealedMoves: ['hurricane'],
			});
			const tornBoots = mkTracked('Tornadus-Therian', {
				ability: 'regenerator',
				item: 'heavydutyboots',
				revealedMoves: ['hurricane'],
			});
			const ttar = mkTracked('Tyranitar', {
				revealedMoves: ['crunch'],
			});

			const dirty = evaluateMatchup(tornNoBoots, ttar, tracker);
			const clean = evaluateMatchup(tornBoots, ttar, tracker);
			assert(clean.hazardFraction < dirty.hazardFraction * 0.5,
				`Heavy-Duty Boots should mostly clear the hazard tax (dirty=${dirty.hazardFraction.toFixed(2)}, clean=${clean.hazardFraction.toFixed(2)})`);
		});
	});

	describe('boosted foe penalty', () => {
		it('boosted foe scores worse than the same foe at neutral', () => {
			const tracker = freshTracker();
			const dragonite = mkTracked('Dragonite', {
				ability: 'multiscale',
				revealedMoves: ['extremespeed', 'earthquake'],
			});
			const calmFoe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
			});
			const angryFoe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				boosts: { atk: 2 },
			});
			const calm = evaluateMatchup(dragonite, calmFoe, tracker);
			const angry = evaluateMatchup(dragonite, angryFoe, tracker);
			assert(angry.score < calm.score,
				`+2 Atk Garchomp should score worse than neutral (calm=${calm.score.toFixed(2)} angry=${angry.score.toFixed(2)})`);
		});
	});

	// Regression: a monotype Electric team forced to switch into a foe
	// whose only revealed move is non-Ground used to happily pick a
	// 4×-weak Ground/Flying teammate. The fix: bestAttackingDamage now
	// always seeds STAB-type proxies for the foe so unrevealed STAB
	// threats still register in the matchup math.
	describe('regression: foe STAB awareness from species', () => {
		it('prefers a Levitate teammate over a 4× Ground-weak teammate vs a Ground STAB foe', () => {
			const tracker = freshTracker();
			// Foe only revealed Dragon Pulse; the AI should still
			// anticipate Earth Power because Garchomp is Ground-type.
			const garchomp = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['dragonpulse'],
			});
			const magnezone = mkTracked('Magnezone', {
				ability: 'magnetpull',
				revealedMoves: ['thunderbolt'],
			});
			const rotomFan = mkTracked('Rotom-Fan', {
				ability: 'levitate',
				revealedMoves: ['airslash'],
			});

			const picked = chooseBestSwitch([magnezone, rotomFan], garchomp, tracker);
			assert(picked, 'should return a chosen mon');
			assert.equal(picked.mon.species, 'rotomfan',
				`should prefer Rotom-Fan (Levitate) over 4× Ground-weak Magnezone ` +
				`(picked ${picked.mon.species})`);
		});

		it('still notices a 4× weak switch-in when the foe has only revealed one STAB', () => {
			const tracker = freshTracker();
			// Foe (Tyranitar) has only revealed Crunch; we should still
			// be afraid of its Rock STAB because TTar is part-Rock.
			const ttar = mkTracked('Tyranitar', {
				ability: 'sandstream',
				revealedMoves: ['crunch'],
			});
			const charizard = mkTracked('Charizard', {
				ability: 'blaze',
				revealedMoves: ['flamethrower'],
			});
			const result = evaluateMatchup(charizard, ttar, tracker);
			assert(result.foeDealFraction > 0.7,
				`Should anticipate STAB Rock threat from Tyranitar even when ` +
				`unrevealed (got ${result.foeDealFraction.toFixed(2)})`);
		});

		// Regression: STAB proxies were hardcoded `category: "Physical"`,
		// so a special-leaning foe (Magnezone) that had only revealed a
		// non-STAB move was scored off its tiny Attack stat — the AI
		// massively under-feared its unrevealed special STAB. Proxies are
		// now emitted in both categories.
		it('fears a special-leaning foe\'s unrevealed STAB (Magnezone Flash Cannon)', () => {
			const tracker = freshTracker();
			// Magnezone (Electric/Steel) has only revealed Thunderbolt;
			// its Steel STAB is 4× on Aurorus (Rock/Ice) and special.
			const magnezone = mkTracked('Magnezone', {
				ability: 'magnetpull',
				revealedMoves: ['thunderbolt'],
				stats: { hp: 322, atk: 168, def: 258, spa: 339, spd: 218, spe: 161 },
			});
			const aurorus = mkTracked('Aurorus', {
				ability: 'refrigerate',
				revealedMoves: ['blizzard'],
			});
			const result = evaluateMatchup(aurorus, magnezone, tracker);
			assert(result.foeDealFraction > 0.6,
				`Should fear Magnezone's unrevealed special Steel STAB into a ` +
				`4×-weak Rock/Ice mon (got ${result.foeDealFraction.toFixed(2)})`);
		});

		// Regression: for our own side `revealedMoves` is seeded complete
		// from the battle request, so synthesising STAB/coverage proxies
		// on top overestimated our output. We now use the known set as-is.
		it('does not invent extra coverage for our own (fully revealed) moveset', () => {
			const tracker = freshTracker();
			// Skarmory (Steel/Flying) only carries Brave Bird offensively.
			// Against Ferrothorn (Steel/Grass) Brave Bird is resisted; the
			// AI must NOT imagine a coverage Fire move that would be SE.
			const skarmory = mkTracked('Skarmory', {
				ability: 'sturdy',
				revealedMoves: ['bravebird', 'roost', 'spikes', 'whirlwind'],
			});
			const ferrothorn = mkTracked('Ferrothorn', {
				ability: 'ironbarbs',
				revealedMoves: ['powerwhip'],
			});
			const result = evaluateMatchup(skarmory, ferrothorn, tracker);
			// An invented 4× Fire coverage proxy would push this well
			// above 0.8; the resisted Brave Bird stays modest.
			assert(result.weDealFraction < 0.5,
				`Skarmory should deal little to Ferrothorn — no imagined Fire ` +
				`coverage (got ${result.weDealFraction.toFixed(2)})`);
		});
	});

	// Regression: the AI didn't reward terrain-seed entry synergies, so
	// it never picked a Grassy Seed holder while Grassy Terrain was up.
	describe('terrain-seed entry synergy', () => {
		it('Grassy Seed holder scores higher when Grassy Terrain is active', () => {
			const trackerNoTerrain = freshTracker();
			const trackerGrassy = freshTracker();
			trackerGrassy.field.terrain = 'grassyterrain';

			const foe = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['earthquake'],
			});
			const tangrowth = mkTracked('Tangrowth', {
				ability: 'regenerator',
				item: 'grassyseed',
				revealedMoves: ['gigadrain'],
			});

			const plain = evaluateMatchup(tangrowth, foe, trackerNoTerrain);
			const synergy = evaluateMatchup(tangrowth, foe, trackerGrassy);
			assert(synergy.score > plain.score + 5,
				`Grassy Seed in Grassy Terrain should boost matchup score ` +
				`(plain=${plain.score.toFixed(2)} synergy=${synergy.score.toFixed(2)})`);
		});

		it('Intimidate bonus shifts the switch decision toward the physical-foe-counter', () => {
			const tracker = freshTracker();
			const garchomp = mkTracked('Garchomp', {
				ability: 'roughskin',
				revealedMoves: ['earthquake'],
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			// Two roughly comparable defensive answers; one has Intimidate.
			const landorus = mkTracked('Landorus-Therian', {
				ability: 'intimidate',
				item: 'leftovers',
				revealedMoves: ['earthquake'],
			});
			const gliscor = mkTracked('Gliscor', {
				ability: 'poisonheal',
				item: 'toxicorb',
				revealedMoves: ['earthquake'],
			});
			const intim = evaluateMatchup(landorus, garchomp, tracker);
			const plain = evaluateMatchup(gliscor, garchomp, tracker);
			assert(intim.score > plain.score,
				`Intimidate should score higher into a physical attacker than ` +
				`a non-Intimidate equivalent (intim=${intim.score.toFixed(2)} ` +
				`plain=${plain.score.toFixed(2)})`);
		});

		// Regression: Unaware on the foe was wrongly treated as cancelling
		// Intimidate's bonus. Unaware only ignores the *opponent's* stat
		// stages during damage calc; the foe still swings with its own
		// Intimidate-lowered Attack, so the bonus must still apply.
		it('Intimidate bonus still applies into an Unaware physical attacker', () => {
			const tracker = freshTracker();
			const unawareFoe = mkTracked('Garchomp', {
				ability: 'unaware',
				revealedMoves: ['earthquake'],
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const landorus = mkTracked('Landorus-Therian', {
				ability: 'intimidate',
				item: 'leftovers',
				revealedMoves: ['earthquake'],
			});
			const gliscor = mkTracked('Gliscor', {
				ability: 'poisonheal',
				item: 'toxicorb',
				revealedMoves: ['earthquake'],
			});
			const intim = evaluateMatchup(landorus, unawareFoe, tracker);
			const plain = evaluateMatchup(gliscor, unawareFoe, tracker);
			assert(intim.score > plain.score,
				`Intimidate should still out-score a non-Intimidate peer even ` +
				`when the physical foe has Unaware (intim=${intim.score.toFixed(2)} ` +
				`plain=${plain.score.toFixed(2)})`);
		});
	});

	// Regression: the AI happily switched in mons that would get
	// OHKO'd on entry (4× weak teammate "just to activate Booster
	// Energy" / sacrifice into a setup-mon to swap back). The fix
	// stacks an explicit penalty when the foe's best move would KO
	// the candidate.
	describe('survivability gate', () => {
		it('refuses to pick a 4× weak switch-in over a neutral one', () => {
			const tracker = freshTracker();
			// Salamence reveals only Earthquake; both candidates take
			// neutral damage from EQ, but Mega Beedrill / Magnezone
			// are 4× weak to either Ice Beam (special) or Earthquake.
			const garchomp = mkTracked('Garchomp', {
				ability: 'sandveil',
				revealedMoves: ['earthquake', 'icebeam'],
			});
			// Magnezone (Electric/Steel) is 4× weak to Earthquake.
			const magnezone = mkTracked('Magnezone', {
				ability: 'magnetpull',
				revealedMoves: ['flashcannon'],
			});
			// Skarmory (Steel/Flying) is immune to Earthquake.
			const skarmory = mkTracked('Skarmory', {
				ability: 'sturdy',
				revealedMoves: ['bravebird'],
			});
			const picked = chooseBestSwitch([magnezone, skarmory], garchomp, tracker);
			assert(picked, 'should return a chosen mon');
			assert.equal(picked.mon.species, 'skarmory',
				`should NOT pick the 4× Ground-weak Magnezone over ` +
				`an EQ-immune Skarmory (picked ${picked.mon.species})`);
		});

		it('explicit survivability penalty drops the score when foe OHKOs', () => {
			const tracker = freshTracker();
			const ttar = mkTracked('Tyranitar', {
				ability: 'sandstream',
				revealedMoves: ['stoneedge', 'crunch'],
			});
			// Charizard takes ~62.5% from Stealth Rock alone (4× Rock
			// weakness), then ~150% from Stone Edge — guaranteed OHKO.
			const charizard = mkTracked('Charizard', {
				ability: 'blaze',
				revealedMoves: ['flamethrower'],
			});
			tracker.sides.p1.stealthRock = true;
			const ms = evaluateMatchup(charizard, ttar, tracker);
			assert(ms.score < -20,
				`Charizard into TTar+SR should be deeply negative ` +
				`(got ${ms.score.toFixed(2)})`);
		});
	});

	// Regression: monotype team Pokemon with weather-speed abilities
	// (Chlorophyll under sun, Swift Swim under rain, etc.) didn't
	// receive an entry bonus, so the AI under-valued them as switch-ins
	// even when the weather was already up.
	describe('weather-speed synergy', () => {
		it('Chlorophyll switch-in is preferred under sun when it outruns the foe', () => {
			const trackerSun = freshTracker();
			trackerSun.field.weather = 'sunnyday';
			const trackerNoSun = freshTracker();
			// Foe is faster than Venusaur normally (base 80 vs 80 → tie,
			// but Garchomp has 102 base Speed → outspeeds without sun;
			// with sun, Venusaur effectively 160 Speed → outspeeds).
			const garchomp = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const venusaur = mkTracked('Venusaur', {
				ability: 'chlorophyll',
				revealedMoves: ['gigadrain'],
				stats: { hp: 364, atk: 226, def: 226, spa: 318, spd: 318, spe: 240 },
			});
			const sunny = evaluateMatchup(venusaur, garchomp, trackerSun);
			const noSun = evaluateMatchup(venusaur, garchomp, trackerNoSun);
			assert(sunny.score > noSun.score + 5,
				`Chlorophyll should boost matchup score under sun ` +
				`(sun=${sunny.score.toFixed(2)} no-sun=${noSun.score.toFixed(2)})`);
		});

		it('Booster Energy holder gets an entry bonus when field will not auto-activate', () => {
			const trackerNeutral = freshTracker();
			const trackerTerrain = freshTracker();
			trackerTerrain.field.terrain = 'electricterrain';
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			// Iron Valiant w/ Quark Drive + Booster Energy. On Electric
			// Terrain it'll boost naturally; off-field, Booster Energy
			// triggers — the entry bonus should reflect "Booster fires
			// only when field won't already cover us".
			const valiantBoosted = mkTracked('Iron Valiant', {
				ability: 'quarkdrive', item: 'boosterenergy',
				revealedMoves: ['moonblast'],
			});
			const neutral = evaluateMatchup(valiantBoosted, foe, trackerNeutral);
			const onTerrain = evaluateMatchup(valiantBoosted, foe, trackerTerrain);
			assert(neutral.score > onTerrain.score,
				`Booster Energy entry bonus should be greater off-field ` +
				`(neutral=${neutral.score.toFixed(2)} terrain=${onTerrain.score.toFixed(2)})`);
		});
	});

	// Regression: stall Pokemon with absorption / punish abilities
	// (Flash Fire, Storm Drain, Water Absorb, etc.) didn't earn an
	// extra switch-in bonus when the foe had revealed a matching move
	// — even though the matchup is essentially "free turn + heal/boost".
	describe('absorb/punish ability switch-in synergy', () => {
		it('Flash Fire user is preferred over a neutral Fire-resist when foe revealed a Fire move', () => {
			const tracker = freshTracker();
			const heatran = mkTracked('Heatran', {
				ability: 'flashfire',
				revealedMoves: ['lavaplume'],
			});
			const garchomp = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			// Charizard is a foe that has revealed Flamethrower.
			const charizard = mkTracked('Charizard', {
				revealedMoves: ['flamethrower'],
				lastMove: 'flamethrower',
				stats: { hp: 297, atk: 226, def: 226, spa: 348, spd: 248, spe: 328 },
			});
			const picked = chooseBestSwitch([garchomp, heatran], charizard, tracker);
			assert(picked, 'should return a chosen mon');
			assert.equal(picked.mon.species, 'heatran',
				`should pick Flash Fire Heatran over Garchomp into a ` +
				`revealed-Flamethrower foe (picked ${picked.mon.species})`);
		});

		it('Water Absorb user beats a generic Water-resist when foe revealed Surf', () => {
			const tracker = freshTracker();
			const vaporeon = mkTracked('Vaporeon', {
				ability: 'waterabsorb',
				revealedMoves: ['scald'],
			});
			const ferrothorn = mkTracked('Ferrothorn', {
				ability: 'ironbarbs',
				revealedMoves: ['powerwhip'],
			});
			const milotic = mkTracked('Milotic', {
				revealedMoves: ['surf'],
				lastMove: 'surf',
			});
			const picked = chooseBestSwitch([ferrothorn, vaporeon], milotic, tracker);
			assert(picked, 'should return a chosen mon');
			assert.equal(picked.mon.species, 'vaporeon',
				`should pick Water Absorb Vaporeon over Grass-resist Ferrothorn ` +
				`(picked ${picked.mon.species})`);
		});

		it('Levitate user gets the absorb bonus into a foe with a Ground move revealed', () => {
			const tracker = freshTracker();
			// Two equally-OK Ground-resisters; Bronzong has Levitate.
			const bronzong = mkTracked('Bronzong', {
				ability: 'levitate',
				revealedMoves: ['psychic'],
			});
			const skarmory = mkTracked('Skarmory', {
				ability: 'sturdy',
				revealedMoves: ['bravebird'],
			});
			const garchomp = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const bronzScore = evaluateMatchup(bronzong, garchomp, tracker);
			const skarmScore = evaluateMatchup(skarmory, garchomp, tracker);
			// Both are immune to EQ via ability/type, so this isn't a
			// damage delta — the absorb-bonus is what distinguishes them.
			assert(bronzScore.score >= skarmScore.score - 1,
				`Levitate Bronzong should be at least as attractive as ` +
				`Steel/Flying Skarmory into Garchomp (bronz=${bronzScore.score.toFixed(2)}, ` +
				`skarm=${skarmScore.score.toFixed(2)})`);
		});

		it('does not bonus an absorb ability when the foe has not revealed a matching move', () => {
			const tracker = freshTracker();
			const heatran = mkTracked('Heatran', {
				ability: 'flashfire',
				revealedMoves: ['lavaplume'],
			});
			const blissey = mkTracked('Blissey', {
				revealedMoves: ['softboiled'],
			});
			const ms = evaluateMatchup(heatran, blissey, tracker);
			// Score should be a normal matchup, not artificially boosted
			// by Flash Fire because Blissey has no revealed Fire moves.
			assert(ms.score < 30,
				`Flash Fire absorb bonus should NOT apply without a ` +
				`revealed Fire move on the foe (score=${ms.score.toFixed(2)})`);
		});
	});

	// Regression: emergency / dominant-outspeeder checks in the
	// HeuristicEngine used raw `stats.spe` while the matchup scorer
	// used `scaledSpeed` (with Swift Swim / Tailwind / Paradox etc).
	// They are now exported from SwitchEvaluator and the speed predicate
	// is required to agree across both layers.
	describe('scaledSpeed exposes weather/paradox/tailwind multipliers', () => {
		const { scaledSpeed } = require(
			'../../../../dist/sim/tools/strategic-ai/mechanics/SwitchEvaluator'
		);

		it('Swift Swim doubles Speed in rain', () => {
			const barraskewda = mkTracked('Barraskewda', {
				ability: 'swiftswim',
				stats: { hp: 286, atk: 348, def: 175, spa: 154, spd: 145, spe: 421 },
			});
			const dry = scaledSpeed(barraskewda, false, '');
			const wet = scaledSpeed(barraskewda, false, 'raindance');
			assert.equal(wet, dry * 2,
				`Swift Swim in rain should double Speed ` +
				`(dry=${dry} wet=${wet})`);
		});

		it('Chlorophyll doubles Speed in sun', () => {
			const venusaur = mkTracked('Venusaur', {
				ability: 'chlorophyll',
				stats: { hp: 364, atk: 232, def: 247, spa: 290, spd: 287, spe: 246 },
			});
			const dry = scaledSpeed(venusaur, false, '');
			const hot = scaledSpeed(venusaur, false, 'sunnyday');
			assert.equal(hot, dry * 2,
				`Chlorophyll in sun should double Speed ` +
				`(dry=${dry} hot=${hot})`);
		});

		it('Tailwind doubles Speed regardless of weather', () => {
			const lugia = mkTracked('Lugia', {
				stats: { hp: 416, atk: 207, def: 318, spa: 248, spd: 339, spe: 251 },
			});
			const noTW = scaledSpeed(lugia, false, '');
			const yesTW = scaledSpeed(lugia, true, '');
			assert.equal(yesTW, noTW * 2,
				`Tailwind should double Speed (noTW=${noTW} yesTW=${yesTW})`);
		});

		it('Quark Drive activates on Electric Terrain set by another source', () => {
			// Highest stat is Speed, so Quark Drive picks Spe → 1.5×.
			const ironMon = mkTracked('Iron Valiant', {
				ability: 'quarkdrive',
				stats: { hp: 250, atk: 200, def: 150, spa: 200, spd: 150, spe: 300 },
			});
			const plain = scaledSpeed(ironMon, false, '', '');
			const onTerrain = scaledSpeed(ironMon, false, '', 'electricterrain');
			assert.equal(onTerrain, Math.floor(plain * 1.5),
				`Quark Drive should give 1.5× Speed on Electric Terrain ` +
				`(plain=${plain} terrain=${onTerrain})`);
		});

		it('Paralysis halves Speed (unless Quick Feet)', () => {
			const me = mkTracked('Garchomp', {
				ability: 'roughskin', status: 'par',
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const quick = mkTracked('Linoone', {
				ability: 'quickfeet', status: 'par',
				stats: { hp: 281, atk: 248, def: 196, spa: 156, spd: 196, spe: 250 },
			});
			const me0 = scaledSpeed(me, false, '');
			const quick0 = scaledSpeed(quick, false, '');
			assert(me0 < 333,
				`Paralysis should halve Speed (got ${me0} for 333 base)`);
			assert(quick0 > 250,
				`Quick Feet + status should *raise* Speed (got ${quick0})`);
		});
	});

	// Regression: Weakness Policy mons should be willing to "tank a
	// SE hit on purpose" to trigger the +2 Atk / +2 SpA boost.
	describe('Weakness Policy bait synergy', () => {
		it('WP holder scores higher into a foe that has revealed a SE move', () => {
			const tracker = freshTracker();
			// Dragonite (Weakness Policy) into a foe with a revealed
			// Ice attack — WP will trigger from the SE hit.
			const dragonite = mkTracked('Dragonite', {
				ability: 'multiscale',
				item: 'weaknesspolicy',
				revealedMoves: ['extremespeed', 'dragonclaw'],
			});
			const weavile = mkTracked('Weavile', {
				revealedMoves: ['icepunch'],
				lastMove: 'icepunch',
			});
			const dragonite2 = mkTracked('Dragonite', {
				ability: 'multiscale',
				item: 'leftovers',
				revealedMoves: ['extremespeed', 'dragonclaw'],
			});
			const wp = evaluateMatchup(dragonite, weavile, tracker);
			const leftovers = evaluateMatchup(dragonite2, weavile, tracker);
			assert(wp.score > leftovers.score + 3,
				`Weakness Policy Dragonite should score higher into a ` +
				`revealed Ice attacker than the Leftovers version ` +
				`(wp=${wp.score.toFixed(2)} lo=${leftovers.score.toFixed(2)})`);
		});
	});
});
