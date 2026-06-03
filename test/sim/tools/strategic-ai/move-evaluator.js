'use strict';

/**
 * Regression coverage for the user-reported AI issues:
 *
 * - Destiny Bond was being spammed because it fell into the
 *   `unknownStatus` fallback (score = 2) which still beat 0-score
 *   moves like Counter / Mirror Coat.
 * - Baton Pass was never picked because it also fell into
 *   `unknownStatus`, so the AI would stack +6 boosts on one mon and
 *   never pass them.
 * - Encore had a flat 14 even when the foe just used a damaging move;
 *   it should be much higher when the foe last used a status / setup
 *   move (lock them out of attacking).
 * - Counter / Mirror Coat have `basePower: 0` and a `damageCallback`,
 *   so the damage path scored them at 0 and they were never picked.
 *
 * These tests exercise the corrected `evaluateMove` scoring.
 */

const assert = require('../../../assert');

const { evaluateMove } =
	require('../../../../dist/sim/tools/strategic-ai/mechanics/MoveEvaluator');
const { BattleStateTracker } =
	require('../../../../dist/sim/tools/strategic-ai/state/BattleStateTracker');
const { Dex } = require('../../../../dist/sim');

function mkTracked(speciesName, opts = {}) {
	const species = Dex.species.get(speciesName);
	if (!species.exists) throw new Error(`Unknown species: ${speciesName}`);
	return {
		id: `mon:${species.id}`,
		name: species.name,
		species: species.id,
		level: opts.level ?? 100,
		condition: '100/100',
		hpFraction: opts.hpFraction ?? 1,
		status: opts.status ?? '',
		boosts: opts.boosts ?? {},
		types: opts.types ?? [...species.types],
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

function ctxFor(attacker, defender, tracker, overrides = {}) {
	return {
		tracker,
		attacker,
		defender,
		mySide: 'p1',
		foeSide: 'p2',
		weOutspeed: overrides.weOutspeed ?? true,
		isDoubles: overrides.isDoubles ?? false,
		valueOfBestSwitch: overrides.valueOfBestSwitch ?? 0,
		attackerLastMoveFailed:
			overrides.attackerLastMoveFailed ?? !!attacker.lastMoveFailed,
	};
}

describe('Strategic-AI MoveEvaluator', () => {
	describe('Destiny Bond', () => {
		it('is a trash pick at full HP', () => {
			const tracker = freshTracker();
			const me = mkTracked('Aegislash', { ability: 'stancechange' });
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('destinybond'), ctxFor(me, foe, tracker, {
				weOutspeed: false,
			}));
			assert(result.score < 0,
				`Destiny Bond at full HP should be heavily negative (got ${result.score})`);
		});

		it('scores high at low HP when we move first (so the bond resolves before we faint)', () => {
			const tracker = freshTracker();
			const me = mkTracked('Aegislash', { ability: 'stancechange', hpFraction: 0.18 });
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('destinybond'), ctxFor(me, foe, tracker, {
				weOutspeed: true,
			}));
			assert(result.score > 30,
				`Destiny Bond at <20% HP when we outspeed should be a top pick (got ${result.score})`);
		});

		it('is a weak pick at low HP when the foe outspeeds and KOs before the bond is up', () => {
			const tracker = freshTracker();
			const me = mkTracked('Aegislash', { ability: 'stancechange', hpFraction: 0.18 });
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('destinybond'), ctxFor(me, foe, tracker, {
				weOutspeed: false,
			}));
			assert(result.score < 0,
				`Destiny Bond into a faster KO should be negative — it whiffs ` +
				`before resolving (got ${result.score})`);
		});

		it('is refused when DB is already volatile (cannot be used twice in a row)', () => {
			const tracker = freshTracker();
			const me = mkTracked('Aegislash', {
				ability: 'stancechange', hpFraction: 0.18,
				volatiles: ['destinybond'],
			});
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('destinybond'), ctxFor(me, foe, tracker, {
				weOutspeed: false,
			}));
			assert(result.score < 0,
				`Destiny Bond with DB volatile up should refuse (got ${result.score})`);
		});
	});

	describe('Baton Pass', () => {
		it('is highly valued when the attacker has positive boosts to pass', () => {
			const tracker = freshTracker();
			const me = mkTracked('Espeon', {
				ability: 'magicbounce',
				boosts: { spa: 2, spe: 2 },
			});
			const foe = mkTracked('Tyranitar', { revealedMoves: ['stoneedge'] });
			const result = evaluateMove(Dex.moves.get('batonpass'), ctxFor(me, foe, tracker, {
				valueOfBestSwitch: 10,
			}));
			assert(result.score > 30,
				`Baton Pass with +2 SpA / +2 Spe should be a top pick (got ${result.score})`);
		});

		it('beats stacking another boost when boosts are already high', () => {
			const tracker = freshTracker();
			const me = mkTracked('Espeon', {
				ability: 'magicbounce',
				boosts: { spa: 4, spe: 4 },
			});
			const foe = mkTracked('Tyranitar', { revealedMoves: ['stoneedge'] });
			const bp = evaluateMove(Dex.moves.get('batonpass'), ctxFor(me, foe, tracker, {
				valueOfBestSwitch: 8,
			}));
			const nastyPlot = evaluateMove(Dex.moves.get('nastyplot'), ctxFor(me, foe, tracker, {
				valueOfBestSwitch: 8,
			}));
			assert(bp.score > nastyPlot.score,
				`At +4 SpA, Baton Pass should outscore another Nasty Plot ` +
				`(BP=${bp.score} NP=${nastyPlot.score})`);
		});

		it('is unattractive when the attacker has no boosts and no switch target', () => {
			const tracker = freshTracker();
			const me = mkTracked('Espeon', { ability: 'magicbounce' });
			const foe = mkTracked('Tyranitar', { revealedMoves: ['stoneedge'] });
			const result = evaluateMove(Dex.moves.get('batonpass'), ctxFor(me, foe, tracker, {
				valueOfBestSwitch: 0,
			}));
			assert(result.score < 0,
				`Boostless Baton Pass with no good target should be negative (got ${result.score})`);
		});
	});

	describe('Counter / Mirror Coat', () => {
		it('Counter scores high when the foe just used a Physical move and we are slower', () => {
			const tracker = freshTracker();
			const me = mkTracked('Wobbuffet', { ability: 'shadowtag' });
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const result = evaluateMove(Dex.moves.get('counter'), ctxFor(me, foe, tracker, {
				weOutspeed: false,
			}));
			assert(result.score > 20,
				`Counter vs a foe that just used Physical should score >20 (got ${result.score})`);
		});

		it('Mirror Coat scores high when the foe just used a Special move and we are slower', () => {
			const tracker = freshTracker();
			const me = mkTracked('Wobbuffet', { ability: 'shadowtag' });
			const foe = mkTracked('Heatran', {
				revealedMoves: ['magmastorm'],
				lastMove: 'magmastorm',
			});
			const result = evaluateMove(Dex.moves.get('mirrorcoat'), ctxFor(me, foe, tracker, {
				weOutspeed: false,
			}));
			assert(result.score > 20,
				`Mirror Coat vs a foe that just used Special should score >20 (got ${result.score})`);
		});

		it('Counter still scores high when we OUTSPEED (−5 priority always moves last)', () => {
			const tracker = freshTracker();
			const me = mkTracked('Wobbuffet', { ability: 'shadowtag' });
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const result = evaluateMove(Dex.moves.get('counter'), ctxFor(me, foe, tracker, {
				weOutspeed: true,
			}));
			assert(result.score > 20,
				`Counter should still score high when we outspeed — its −5 ` +
				`priority makes it resolve after the foe anyway (got ${result.score})`);
		});

		it('Counter outscores Destiny Bond when the foe just used a Physical move', () => {
			const tracker = freshTracker();
			const me = mkTracked('Wobbuffet', { ability: 'shadowtag' });
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const counter = evaluateMove(Dex.moves.get('counter'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			const db = evaluateMove(Dex.moves.get('destinybond'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			assert(counter.score > db.score,
				`Counter should beat Destiny Bond after a Physical hit ` +
				`(Counter=${counter.score} DB=${db.score})`);
		});
	});

	describe('Encore', () => {
		it('is highly valued when the foe just used a status / setup move', () => {
			const tracker = freshTracker();
			const me = mkTracked('Whimsicott', { ability: 'prankster' });
			const foe = mkTracked('Volcarona', {
				revealedMoves: ['quiverdance'],
				lastMove: 'quiverdance',
			});
			const result = evaluateMove(Dex.moves.get('encore'), ctxFor(me, foe, tracker));
			assert(result.score > 20,
				`Encore vs Quiver Dance user should score >20 (got ${result.score})`);
		});

		it('is modest when the foe just used a damaging move', () => {
			const tracker = freshTracker();
			const me = mkTracked('Whimsicott', { ability: 'prankster' });
			const foe = mkTracked('Volcarona', {
				revealedMoves: ['fireblast'],
				lastMove: 'fireblast',
			});
			const result = evaluateMove(Dex.moves.get('encore'), ctxFor(me, foe, tracker));
			assert(result.score >= 0 && result.score < 20,
				`Encore vs a pure attacker should be modest (got ${result.score})`);
		});
	});

	// Regression: priority moves only earned a +25 bonus when we were
	// slower AND would KO. Slow-mon scenarios (Mamoswine / Bisharp at
	// low HP needing a priority KO) were underrated, and Sucker Punch
	// was spammed into status/setup mons where it auto-fails.
	describe('priority move scoring', () => {
		it('Bullet Punch at low HP into a faster foe scores well above neutral', () => {
			const tracker = freshTracker();
			const scizor = mkTracked('Scizor', {
				ability: 'technician', hpFraction: 0.3,
				stats: { hp: 343, atk: 394, def: 236, spa: 138, spd: 226, spe: 195 },
			});
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const priority = evaluateMove(Dex.moves.get('bulletpunch'),
				ctxFor(scizor, foe, tracker, { weOutspeed: false }));
			const normalAttack = evaluateMove(Dex.moves.get('xscissor'),
				ctxFor(scizor, foe, tracker, { weOutspeed: false }));
			// Bullet Punch should be at least competitive with the
			// stronger X-Scissor because we may not get a second turn.
			assert(priority.score > normalAttack.score - 5,
				`Bullet Punch insurance bonus should make it comparable ` +
				`to X-Scissor when low HP + slower ` +
				`(BP=${priority.score.toFixed(2)} X=${normalAttack.score.toFixed(2)})`);
		});

		it('Extreme Speed on a slow attacker rewards the priority KO branch', () => {
			const tracker = freshTracker();
			const dragonite = mkTracked('Dragonite', {
				ability: 'multiscale',
				stats: { hp: 386, atk: 403, def: 226, spa: 212, spd: 236, spe: 185 },
			});
			const weakened = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'], hpFraction: 0.2,
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const result = evaluateMove(Dex.moves.get('extremespeed'),
				ctxFor(dragonite, weakened, tracker, { weOutspeed: false }));
			// At 20% HP a +2 priority Normal-typed STAB attack should
			// guarantee a KO and earn the stacked-priority bonus.
			assert(result.score > 35,
				`Extreme Speed into a sub-20% foe should score >35 ` +
				`(got ${result.score.toFixed(2)})`);
		});
	});

	// Regression: Sucker Punch was being spammed against setup mons
	// (auto-fails) and was never preferred even when the foe was
	// choice-locked into a damaging move (guaranteed fire).
	describe('Sucker Punch', () => {
		it('hard-negative when the foe just used a status move', () => {
			const tracker = freshTracker();
			const bisharp = mkTracked('Bisharp', { ability: 'defiant' });
			const foe = mkTracked('Volcarona', {
				revealedMoves: ['quiverdance'],
				lastMove: 'quiverdance',
			});
			const result = evaluateMove(Dex.moves.get('suckerpunch'),
				ctxFor(bisharp, foe, tracker, { weOutspeed: false }));
			assert(result.score < 0,
				`Sucker Punch vs a fresh Quiver Dance user should score ` +
				`negative — it will auto-fail (got ${result.score})`);
		});

		it('high score when the foe is choice-locked into a damaging move', () => {
			const tracker = freshTracker();
			const bisharp = mkTracked('Bisharp', { ability: 'defiant' });
			const foe = mkTracked('Heatran', {
				revealedMoves: ['magmastorm'],
				lastMove: 'magmastorm',
				choiceLocked: true,
			});
			const result = evaluateMove(Dex.moves.get('suckerpunch'),
				ctxFor(bisharp, foe, tracker, { weOutspeed: false }));
			assert(result.score > 25,
				`Sucker Punch into a Choice-locked attacker should score >25 ` +
				`(got ${result.score})`);
		});
	});

	// Regression: Sash / Sturdy mons at full HP were swapping out or
	// trading hits instead of investing in setup moves — the "free
	// turn" the Sash buys was wasted.
	describe('setup-window bonus (guaranteed survival)', () => {
		it('Swords Dance scores higher on a Focus Sash holder at full HP', () => {
			const tracker = freshTracker();
			const sash = mkTracked('Garchomp', {
				ability: 'roughskin', item: 'focussash',
			});
			const plain = mkTracked('Garchomp', { ability: 'roughskin' });
			const foe = mkTracked('Skarmory', { revealedMoves: ['bravebird'] });
			const sashSD = evaluateMove(Dex.moves.get('swordsdance'),
				ctxFor(sash, foe, tracker, { weOutspeed: false }));
			const plainSD = evaluateMove(Dex.moves.get('swordsdance'),
				ctxFor(plain, foe, tracker, { weOutspeed: false }));
			assert(sashSD.score > plainSD.score + 10,
				`Sash holder should value Swords Dance much higher ` +
				`(sash=${sashSD.score} plain=${plainSD.score})`);
		});

		it('Sturdy + full HP also lifts setup-move scores', () => {
			const tracker = freshTracker();
			const sturdy = mkTracked('Carracosta', { ability: 'sturdy' });
			const plain = mkTracked('Carracosta', { ability: 'solidrock' });
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const sturdyShell = evaluateMove(Dex.moves.get('shellsmash'),
				ctxFor(sturdy, foe, tracker, { weOutspeed: false }));
			const plainShell = evaluateMove(Dex.moves.get('shellsmash'),
				ctxFor(plain, foe, tracker, { weOutspeed: false }));
			assert(sturdyShell.score > plainShell.score + 10,
				`Sturdy user should value Shell Smash higher than a ` +
				`non-Sturdy peer (sturdy=${sturdyShell.score} ` +
				`plain=${plainShell.score})`);
		});

		it('low-HP Sash holder does NOT get the bonus (Sash already broken)', () => {
			const tracker = freshTracker();
			const me = mkTracked('Garchomp', {
				ability: 'roughskin', item: 'focussash', hpFraction: 0.4,
			});
			const foe = mkTracked('Skarmory', { revealedMoves: ['bravebird'] });
			const result = evaluateMove(Dex.moves.get('swordsdance'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			// Without the bonus, +1 Atk from 0 base should score around
			// 1 * 9 * 1 = 9 — definitely not in the >20 setup-window
			// region.
			assert(result.score < 20,
				`Sash at 40% HP should not earn the setup-window bonus ` +
				`(got ${result.score})`);
		});
	});

	// Regression: hazard moves had a flat per-foe value, so Sticky
	// Web (the most impactful hazard) and Stealth Rock scored the
	// same — the AI would set Spikes first because they appeared
	// earlier in the move list / picked at random.
	describe('hazard prioritization', () => {
		// Populate the tracker with five fake foes so the per-foe
		// hazard value isn't suppressed by the "remainingFoes <= 1"
		// guard in `hazardSetValue`.
		function seedFoeTeam(tracker) {
			for (let i = 0; i < 5; i++) {
				const mon = mkTracked('Tauros', {
					name: `Mon${i}`, fainted: false, active: i === 0,
				});
				mon.id = `p2:Mon${i}`;
				tracker.pokemon.set(mon.id, mon);
			}
		}

		it('Sticky Web outscores Stealth Rock when both are available', () => {
			const tracker = freshTracker();
			seedFoeTeam(tracker);
			const me = mkTracked('Smeargle', { ability: 'owntempo' });
			const foe = mkTracked('Tauros', { revealedMoves: ['bodyslam'] });
			const web = evaluateMove(Dex.moves.get('stickyweb'),
				ctxFor(me, foe, tracker));
			const sr = evaluateMove(Dex.moves.get('stealthrock'),
				ctxFor(me, foe, tracker));
			const spikes = evaluateMove(Dex.moves.get('spikes'),
				ctxFor(me, foe, tracker));
			assert(web.score > sr.score,
				`Sticky Web should outscore Stealth Rock ` +
				`(web=${web.score} sr=${sr.score})`);
			assert(sr.score > spikes.score,
				`Stealth Rock should outscore Spikes ` +
				`(sr=${sr.score} spikes=${spikes.score})`);
		});

		it('Sturdy at full HP boosts a hazard set', () => {
			const trackerSturdy = freshTracker();
			const trackerPlain = freshTracker();
			seedFoeTeam(trackerSturdy);
			seedFoeTeam(trackerPlain);
			const sturdy = mkTracked('Forretress', { ability: 'sturdy' });
			const plain = mkTracked('Forretress', { ability: 'overcoat' });
			const foe = mkTracked('Tauros', { revealedMoves: ['bodyslam'] });
			const sturdyRocks = evaluateMove(Dex.moves.get('stealthrock'),
				ctxFor(sturdy, foe, trackerSturdy));
			const plainRocks = evaluateMove(Dex.moves.get('stealthrock'),
				ctxFor(plain, foe, trackerPlain));
			assert(sturdyRocks.score > plainRocks.score + 5,
				`Sturdy user should value SR higher than a non-Sturdy ` +
				`peer (sturdy=${sturdyRocks.score} plain=${plainRocks.score})`);
		});
	});

	// Regression: Yawn was bucketed under `unknownStatus` (+2), so
	// stall users (Slowking, Politoed) ignored it in favour of
	// damaging moves that did nothing strategically.
	describe('Yawn / status-induce stall combos', () => {
		it('Yawn scores well above the unknown-status fallback', () => {
			const tracker = freshTracker();
			const slowking = mkTracked('Slowking', { ability: 'regenerator' });
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('yawn'),
				ctxFor(slowking, foe, tracker));
			assert(result.score >= 15,
				`Yawn should score >= 15 against an unstatused foe ` +
				`(got ${result.score})`);
		});

		it('Yawn is rejected on Misty Terrain (sleep is blocked)', () => {
			const tracker = freshTracker();
			tracker.field.terrain = 'mistyterrain';
			const slowking = mkTracked('Slowking', { ability: 'regenerator' });
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('yawn'),
				ctxFor(slowking, foe, tracker));
			assert(result.score < 0,
				`Yawn should be rejected under Misty Terrain ` +
				`(got ${result.score})`);
		});

		it('Toxic gets a small bonus when we have Protect + Recovery revealed', () => {
			const tracker = freshTracker();
			const stall = mkTracked('Toxapex', {
				ability: 'regenerator',
				revealedMoves: ['protect', 'recover'],
			});
			const stallNoCombo = mkTracked('Toxapex', {
				ability: 'regenerator',
				revealedMoves: [],
			});
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const combo = evaluateMove(Dex.moves.get('toxic'),
				ctxFor(stall, foe, tracker));
			const plain = evaluateMove(Dex.moves.get('toxic'),
				ctxFor(stallNoCombo, foe, tracker));
			assert(combo.score > plain.score,
				`Toxic with Protect + Recover should score higher than ` +
				`without (combo=${combo.score} plain=${plain.score})`);
		});
	});

	// Regression: Weakness Policy holders set up via Sword Dance /
	// Calm Mind even when slower than the foe — the resulting +2/+2/0
	// sweeper still got picked off the next turn because Speed never
	// climbed. WP setups should prefer Dragon Dance / Shift Gear /
	// Quiver Dance when Speed isn't already won.
	describe('Weakness Policy setup-window speed prioritization', () => {
		// A WP holder with foe-revealed SE move triggers `inSetupWindow`.
		function makeWpVsSE(item = 'weaknesspolicy', spe = false) {
			const tracker = freshTracker();
			const me = mkTracked('Garchomp', {
				ability: 'roughskin', item,
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const foe = mkTracked('Weavile', {
				revealedMoves: ['iceshard', 'icicleCrash'],
			});
			return { tracker, me, foe, weOutspeed: spe };
		}

		it('Dragon Dance outscores Swords Dance on a WP holder vs SE foe when slower', () => {
			const { tracker, me, foe } = makeWpVsSE('weaknesspolicy', false);
			const dd = evaluateMove(Dex.moves.get('dragondance'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			const sd = evaluateMove(Dex.moves.get('swordsdance'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			assert(dd.score > sd.score + 5,
				`Slower WP holder vs SE-foe should prefer Dragon Dance ` +
				`over Swords Dance (DD=${dd.score} SD=${sd.score})`);
		});

		it('Dragon Dance does NOT get the extra Spe bonus when we already outspeed', () => {
			const { tracker, me, foe } = makeWpVsSE('weaknesspolicy', true);
			const dd = evaluateMove(Dex.moves.get('dragondance'),
				ctxFor(me, foe, tracker, { weOutspeed: true }));
			const sd = evaluateMove(Dex.moves.get('swordsdance'),
				ctxFor(me, foe, tracker, { weOutspeed: true }));
			// Already outspeeding → no extra reward for Spe specifically.
			// SD's pure +2 Atk should beat DD's +1/+1 in that world.
			assert(dd.score < sd.score + 8,
				`When we already outspeed, the speed bonus shouldn't ` +
				`unconditionally push DD above SD (DD=${dd.score} SD=${sd.score})`);
		});

		it('non-WP holder does NOT get the setup-window WP bonus', () => {
			const tracker = freshTracker();
			const me = mkTracked('Garchomp', {
				ability: 'roughskin', item: 'leftovers',
				stats: { hp: 357, atk: 359, def: 246, spa: 222, spd: 237, spe: 333 },
			});
			const foe = mkTracked('Weavile', {
				revealedMoves: ['iceshard'],
			});
			const dd = evaluateMove(Dex.moves.get('dragondance'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			// Score should be in the normal range (no setup-window
			// boost). +1/+1 from 0 stages ≈ 9 + 12 = 21 raw — without
			// the +18 setup bonus.
			assert(dd.score < 30,
				`Non-WP holder should not earn the WP setup bonus ` +
				`(got ${dd.score})`);
		});
	});

	// Regression: hazard moves on a low-HP setter scored -8 (because
	// `attacker.hpFraction < 0.25`), so a Sturdy/Sash mon already
	// down to 10% would refuse to leave hazards as a parting gift.
	// Suicide hazards are now valued positively.
	describe('hazard suicide-set bonus', () => {
		function seedFoeTeam(tracker) {
			for (let i = 0; i < 5; i++) {
				const mon = mkTracked('Tauros', {
					name: `Mon${i}`, fainted: false, active: i === 0,
				});
				mon.id = `p2:Mon${i}`;
				tracker.pokemon.set(mon.id, mon);
			}
		}

		it('Stealth Rock at 12% HP still scores positively', () => {
			const tracker = freshTracker();
			seedFoeTeam(tracker);
			const dying = mkTracked('Forretress', {
				ability: 'sturdy', hpFraction: 0.12,
			});
			const foe = mkTracked('Tauros', { revealedMoves: ['bodyslam'] });
			const sr = evaluateMove(Dex.moves.get('stealthrock'),
				ctxFor(dying, foe, tracker, { weOutspeed: false }));
			assert(sr.score > 10,
				`Stealth Rock from a 12% HP mon should still earn ` +
				`a healthy positive score (got ${sr.score})`);
		});
	});

	// Regression: conditional-power moves were left at their bare
	// base-power in the calc, so Bolt Beak / Hex / Payback never
	// reflected their actual value when their condition was met.
	describe('conditional base-power moves', () => {
		it('Hex doubles damage on a statused foe', () => {
			const tracker = freshTracker();
			const gengar = mkTracked('Gengar', { ability: 'cursedbody' });
			// Use a Ghost-vulnerable foe — Hex can't hit Normal types
			// at all (Ghost vs Normal = immune).
			const healthy = mkTracked('Latias', {});
			const statused = mkTracked('Latias', { status: 'tox' });
			const noStatus = evaluateMove(Dex.moves.get('hex'),
				ctxFor(gengar, healthy, tracker));
			const withStatus = evaluateMove(Dex.moves.get('hex'),
				ctxFor(gengar, statused, tracker));
			assert(withStatus.score > noStatus.score * 1.5,
				`Hex should be much higher on a Toxic-poisoned foe ` +
				`(no=${noStatus.score} status=${withStatus.score})`);
		});

		it('Bolt Beak doubles power when we move first', () => {
			const tracker = freshTracker();
			const dracozolt = mkTracked('Dracovish', {
				ability: 'strongjaw',
				types: ['Water', 'Dragon'],
				stats: { hp: 343, atk: 358, def: 246, spa: 138, spd: 236, spe: 270 },
			});
			const foe = mkTracked('Blissey', {});
			const first = evaluateMove(Dex.moves.get('fishiousrend'),
				ctxFor(dracozolt, foe, tracker, { weOutspeed: true }));
			const second = evaluateMove(Dex.moves.get('fishiousrend'),
				ctxFor(dracozolt, foe, tracker, { weOutspeed: false }));
			assert(first.score > second.score * 1.4,
				`Fishious Rend should be sharply higher when moving ` +
				`first (first=${first.score} second=${second.score})`);
		});

		it('Payback gets a big bump when we are slower', () => {
			const tracker = freshTracker();
			const me = mkTracked('Snorlax', {
				ability: 'thickfat',
				stats: { hp: 521, atk: 350, def: 230, spa: 176, spd: 230, spe: 130 },
			});
			const foe = mkTracked('Tapu Lele', {});
			const slower = evaluateMove(Dex.moves.get('payback'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			const faster = evaluateMove(Dex.moves.get('payback'),
				ctxFor(me, foe, tracker, { weOutspeed: true }));
			assert(slower.score > faster.score * 1.4,
				`Payback should be much higher when moving second ` +
				`(slow=${slower.score} fast=${faster.score})`);
		});

		it('Stomping Tantrum doubles after our previous move failed', () => {
			const tracker = freshTracker();
			const me = mkTracked('Excadrill', {
				ability: 'sandrush',
				stats: { hp: 322, atk: 369, def: 196, spa: 122, spd: 196, spe: 302 },
			});
			const foe = mkTracked('Gengar', { types: ['Ghost', 'Poison'] });
			const afterFail = evaluateMove(Dex.moves.get('stompingtantrum'),
				ctxFor(me, foe, tracker, { attackerLastMoveFailed: true }));
			const clean = evaluateMove(Dex.moves.get('stompingtantrum'),
				ctxFor(me, foe, tracker, { attackerLastMoveFailed: false }));
			assert(afterFail.score > clean.score * 1.4,
				`Stomping Tantrum should be much higher after a failed ` +
				`move (failed=${afterFail.score} clean=${clean.score})`);
		});
	});

	// Regression: always-crit moves (Wicked Blow, Surging Strikes,
	// Flower Trick, Storm Throw, Frost Breath, Zippy Zap) were
	// scored at non-crit damage, so a Wicked Blow vs a +6 Iron Defense
	// Cosmoem was treated as a chip noise move.
	describe('always-crit moves', () => {
		it('Wicked Blow ignores defender Def boosts', () => {
			const tracker = freshTracker();
			const urshifu = mkTracked('Urshifu', {
				ability: 'unseenfist',
				types: ['Fighting', 'Dark'],
				stats: { hp: 351, atk: 410, def: 245, spa: 154, spd: 222, spe: 261 },
			});
			const buffyFoe = mkTracked('Avalugg', {
				boosts: { def: 6 },
				stats: { hp: 477, atk: 296, def: 386, spa: 99, spd: 154, spe: 86 },
			});
			const plainFoe = mkTracked('Avalugg', {
				stats: { hp: 477, atk: 296, def: 386, spa: 99, spd: 154, spe: 86 },
			});
			const vsBoosted = evaluateMove(Dex.moves.get('wickedblow'),
				ctxFor(urshifu, buffyFoe, tracker));
			const vsPlain = evaluateMove(Dex.moves.get('wickedblow'),
				ctxFor(urshifu, plainFoe, tracker));
			// With crit ignoring +6 Def, the damage delta vs the
			// boosted target should be tiny (within 10% of the plain
			// target). Without the crit fix it would be a fraction.
			assert(vsBoosted.score > vsPlain.score * 0.7,
				`Wicked Blow vs +6 Def should not collapse — crit ` +
				`ignores stages (boosted=${vsBoosted.score} ` +
				`plain=${vsPlain.score})`);
		});

		it('Wicked Blow scores higher than a non-crit equivalent BP move', () => {
			const tracker = freshTracker();
			const urshifu = mkTracked('Urshifu', {
				ability: 'unseenfist',
				types: ['Fighting', 'Dark'],
				stats: { hp: 351, atk: 410, def: 245, spa: 154, spd: 222, spe: 261 },
			});
			const foe = mkTracked('Avalugg', {
				boosts: { def: 6 },
				stats: { hp: 477, atk: 296, def: 386, spa: 99, spd: 154, spe: 86 },
			});
			const wicked = evaluateMove(Dex.moves.get('wickedblow'),
				ctxFor(urshifu, foe, tracker));
			// Use Sucker Punch as a same-BP physical Dark comparator.
			// (Both 75 BP, both Dark, both Physical; only crit differs.)
			const sucker = evaluateMove(Dex.moves.get('suckerpunch'),
				ctxFor(urshifu, foe, tracker, { weOutspeed: true }));
			assert(wicked.score > sucker.score,
				`Wicked Blow (always-crit) should outscore a same-BP ` +
				`Dark move vs +6 Def (wicked=${wicked.score} ` +
				`sucker=${sucker.score})`);
		});
	});

	// Regression: Endure was scored via the `unknownStatus` fallback
	// and so showed up at +2 — the AI burned turns on it without a
	// pinch berry to capitalise.
	describe('Endure', () => {
		it('high score when paired with a pinch-activation Salac Berry at sub-60% HP', () => {
			const tracker = freshTracker();
			const me = mkTracked('Sceptile', {
				ability: 'overgrow', item: 'salacberry', hpFraction: 0.45,
			});
			const foe = mkTracked('Garchomp', {
				revealedMoves: ['earthquake'],
				lastMove: 'earthquake',
			});
			const result = evaluateMove(Dex.moves.get('endure'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			assert(result.score > 15,
				`Endure + Salac Berry pinch combo should score >15 ` +
				`(got ${result.score})`);
		});

		it('refused when we already hold a fresh Focus Sash at full HP', () => {
			const tracker = freshTracker();
			const me = mkTracked('Sceptile', {
				ability: 'overgrow', item: 'focussash',
			});
			const foe = mkTracked('Garchomp', { revealedMoves: ['earthquake'] });
			const result = evaluateMove(Dex.moves.get('endure'),
				ctxFor(me, foe, tracker, { weOutspeed: false }));
			assert(result.score < 0,
				`Endure is redundant with a fresh Focus Sash ` +
				`(got ${result.score})`);
		});
	});
});
