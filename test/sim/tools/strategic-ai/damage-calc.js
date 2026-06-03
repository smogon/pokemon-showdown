'use strict';

const assert = require('../../../assert');

const { calculateDamage, estimateMaxHp } =
	require('../../../../dist/sim/tools/strategic-ai/mechanics/DamageCalc');
const { Dex } = require('../../../../dist/sim');

function emptySide() {
	return {
		stealthRock: false,
		spikes: 0,
		toxicSpikes: 0,
		stickyWeb: false,
		reflectTurns: 0,
		lightScreenTurns: 0,
		auroraVeilTurns: 0,
		tailwindTurns: 0,
		safeguardTurns: 0,
		mistTurns: 0,
		fainted: 0,
	};
}

function emptyField(weather = '', terrain = '') {
	return {
		weather,
		weatherTurns: 0,
		terrain,
		terrainTurns: 0,
		trickRoom: false,
		trickRoomTurns: 0,
		magicRoom: false,
		wonderRoom: false,
		gravity: false,
		gravityTurns: 0,
	};
}

/**
 * Build a fully-specified `CalcPokemon` from a species name. Defaults
 * to a fully-invested level-100 mon with no boosts.
 */
function mkMon(speciesName, opts = {}) {
	const species = Dex.species.get(speciesName);
	if (!species.exists) throw new Error(`Unknown species: ${speciesName}`);
	const types = opts.types ?? [...species.types];
	return {
		species: species.id,
		types,
		level: opts.level ?? 100,
		ability: opts.ability ?? '',
		item: opts.item ?? '',
		status: opts.status ?? '',
		boosts: opts.boosts ?? {},
		hpFraction: opts.hpFraction ?? 1,
		teraType: opts.teraType,
		terastallized: opts.terastallized ?? false,
		volatiles: new Set(opts.volatiles || []),
	};
}

function calc(opts) {
	return calculateDamage({
		attacker: opts.attacker,
		defender: opts.defender,
		move: Dex.moves.get(opts.move),
		field: opts.field || emptyField(),
		attackerSide: emptySide(),
		defenderSide: emptySide(),
		isDoubles: !!opts.isDoubles,
	});
}

describe('Strategic-AI DamageCalc', () => {
	it('respects type immunity (Earthquake into Levitate Latios)', () => {
		const result = calc({
			attacker: mkMon('Garchomp'),
			defender: mkMon('Latios', { ability: 'levitate' }),
			move: 'earthquake',
		});
		assert(result.immune, 'Earthquake should be immune through Levitate');
		assert.equal(result.avgDamage, 0);
	});

	it('respects type immunity from typing (Normal into Ghost)', () => {
		const result = calc({
			attacker: mkMon('Snorlax'),
			defender: mkMon('Gengar'),
			move: 'bodyslam',
		});
		assert(result.immune, 'Body Slam should be Ghost-immune');
	});

	it('STAB and supereffective: Garchomp Earthquake on Heatran is huge', () => {
		const ground = calc({
			attacker: mkMon('Garchomp'),
			defender: mkMon('Heatran'),
			move: 'earthquake',
		});
		const fire = calc({
			attacker: mkMon('Garchomp'),
			defender: mkMon('Skarmory'),
			move: 'earthquake',
		});
		assert(!ground.immune);
		const groundFraction = ground.avgDamage / ground.defenderMaxHp;
		const fireFraction = fire.avgDamage / fire.defenderMaxHp;
		assert(groundFraction > 0.4, `Earthquake vs Heatran should deal heavy damage; got ${groundFraction.toFixed(2)}`);
		assert(groundFraction > fireFraction * 1.5,
			`Heatran should take more from EQ than Skarmory does (got ${groundFraction.toFixed(2)} vs ${fireFraction.toFixed(2)})`);
	});

	it('hit chance reflects move accuracy', () => {
		const reliable = calc({
			attacker: mkMon('Garchomp'),
			defender: mkMon('Heatran'),
			move: 'earthquake',
		});
		const shaky = calc({
			attacker: mkMon('Hydreigon'),
			defender: mkMon('Heatran'),
			move: 'focusblast',
		});
		assert.equal(reliable.hitChance, 1, 'Earthquake should be 100% accurate');
		assert(shaky.hitChance < 1, 'Focus Blast should be < 100% accurate');
	});

	it('flags status moves as non-damaging', () => {
		const result = calc({
			attacker: mkMon('Toxapex'),
			defender: mkMon('Garchomp'),
			move: 'toxic',
		});
		assert(result.status, 'Toxic should be flagged as a status move');
		assert.equal(result.avgDamage, 0);
	});

	it('koProbability stays in [0, 1]', () => {
		const result = calc({
			attacker: mkMon('Garchomp', { boosts: { atk: 6 } }),
			defender: mkMon('Blissey', { hpFraction: 0.05 }),
			move: 'earthquake',
		});
		assert(result.koProbability >= 0 && result.koProbability <= 1,
			`koProbability should be in [0,1]; got ${result.koProbability}`);
	});

	it('returns DAMAGE_ROLLS in min<=avg<=max order', () => {
		const result = calc({
			attacker: mkMon('Garchomp'),
			defender: mkMon('Heatran'),
			move: 'earthquake',
		});
		assert(result.minDamage <= result.avgDamage,
			`min ${result.minDamage} should be <= avg ${result.avgDamage}`);
		assert(result.avgDamage <= result.maxDamage,
			`avg ${result.avgDamage} should be <= max ${result.maxDamage}`);
	});

	it('multi-hit moves account for the variable hit distribution', () => {
		const result = calc({
			attacker: mkMon('Cinccino', { ability: 'skilllink' }),
			defender: mkMon('Blissey'),
			move: 'tailslap',
		});
		assert(result.minDamage > 0);
		assert(result.maxDamage > result.minDamage,
			'multi-hit moves should produce a range of total damage');
	});

	it('estimateMaxHp returns positive HP for valid species', () => {
		const blissey = estimateMaxHp(mkMon('Blissey'));
		const ferrothorn = estimateMaxHp(mkMon('Ferrothorn'));
		assert(blissey > ferrothorn,
			`Blissey HP (${blissey}) should be greater than Ferrothorn HP (${ferrothorn})`);
		assert(blissey > 600, 'Blissey at 252 HP EV should be over 600 HP');
	});

	it('weather: Rain boosts Water moves and weakens Fire moves', () => {
		const sun = calc({
			attacker: mkMon('Charizard'),
			defender: mkMon('Latios'),
			move: 'flamethrower',
			field: emptyField('sunnyday'),
		});
		const rain = calc({
			attacker: mkMon('Charizard'),
			defender: mkMon('Latios'),
			move: 'flamethrower',
			field: emptyField('raindance'),
		});
		assert(sun.avgDamage > rain.avgDamage,
			`Sun should boost Fire moves over Rain (sun=${sun.avgDamage}, rain=${rain.avgDamage})`);
	});

	// Regression: Booster Energy on Paradox mons (Protosynthesis /
	// Quark Drive) was not boosting the relevant stat in the calc, so
	// the AI rated Iron Valiant / Roaring Moon / Iron Bundle equally
	// before and after consuming the item — which led it to switch
	// them out instead of pressing the boost.
	describe('Paradox abilities (Protosynthesis / Quark Drive)', () => {
		it('Protosynthesis under sun raises damage on its highest stat (Roaring Moon)', () => {
			const sunny = calc({
				attacker: mkMon('Roaring Moon', { ability: 'protosynthesis' }),
				defender: mkMon('Skarmory'),
				move: 'crunch',
				field: emptyField('sunnyday'),
			});
			const noWeather = calc({
				attacker: mkMon('Roaring Moon', { ability: 'protosynthesis' }),
				defender: mkMon('Skarmory'),
				move: 'crunch',
			});
			assert(sunny.avgDamage > noWeather.avgDamage * 1.2,
				`Protosynthesis in sun should boost damage by >20% ` +
				`(sun=${sunny.avgDamage}, off=${noWeather.avgDamage})`);
		});

		it('Booster Energy activates Quark Drive without Electric Terrain (Iron Valiant)', () => {
			// Iron Valiant's base Atk (130) > base SpA (120), so the
			// boost defaults to Atk. Use a physical move to observe it.
			const booster = calc({
				attacker: mkMon('Iron Valiant', {
					ability: 'quarkdrive', item: 'boosterenergy',
				}),
				defender: mkMon('Blissey'),
				move: 'closecombat',
			});
			const plain = calc({
				attacker: mkMon('Iron Valiant', { ability: 'quarkdrive' }),
				defender: mkMon('Blissey'),
				move: 'closecombat',
			});
			assert(booster.avgDamage > plain.avgDamage * 1.2,
				`Booster Energy should activate Quark Drive ` +
				`(boost=${booster.avgDamage}, off=${plain.avgDamage})`);
		});

		it('explicit volatile overrides the auto-detected stat', () => {
			// Force the boost onto Def so a Sp.Atk should NOT see the bump.
			const forced = calc({
				attacker: mkMon('Iron Valiant', {
					ability: 'quarkdrive',
					item: 'boosterenergy',
					volatiles: ['quarkdrivedef'],
				}),
				defender: mkMon('Blissey'),
				move: 'moonblast',
			});
			const plain = calc({
				attacker: mkMon('Iron Valiant', { ability: 'quarkdrive' }),
				defender: mkMon('Blissey'),
				move: 'moonblast',
			});
			// Allow a tiny rounding tolerance; the key check is that
			// forcing Def doesn't raise SpA damage.
			assert(Math.abs(forced.avgDamage - plain.avgDamage) < Math.max(2, plain.avgDamage * 0.05),
				`Defense-typed volatile should NOT lift SpA damage ` +
				`(forced=${forced.avgDamage}, plain=${plain.avgDamage})`);
		});
	});

	// Regression: Solar Power's +50% SpA was missing from the calc, so
	// in sun the AI under-rated Solar-Power abusers (Charizard-Y,
	// Heliolisk, etc.) and routinely switched them out.
	describe('Solar Power', () => {
		it('+50% SpA in sun for Solar Power user', () => {
			const sun = calc({
				attacker: mkMon('Heliolisk', { ability: 'solarpower' }),
				defender: mkMon('Blissey'),
				move: 'thunderbolt',
				field: emptyField('sunnyday'),
			});
			const noSun = calc({
				attacker: mkMon('Heliolisk', { ability: 'solarpower' }),
				defender: mkMon('Blissey'),
				move: 'thunderbolt',
			});
			assert(sun.avgDamage > noSun.avgDamage * 1.4,
				`Solar Power in sun should add ~50% to SpA damage ` +
				`(sun=${sun.avgDamage}, off=${noSun.avgDamage})`);
		});

		it('does not affect physical moves', () => {
			const sun = calc({
				attacker: mkMon('Heliolisk', { ability: 'solarpower' }),
				defender: mkMon('Blissey'),
				move: 'quickattack',
				field: emptyField('sunnyday'),
			});
			const noSun = calc({
				attacker: mkMon('Heliolisk', { ability: 'solarpower' }),
				defender: mkMon('Blissey'),
				move: 'quickattack',
			});
			assert.equal(sun.avgDamage, noSun.avgDamage,
				`Solar Power should not change physical move damage ` +
				`(sun=${sun.avgDamage}, off=${noSun.avgDamage})`);
		});
	});
});
