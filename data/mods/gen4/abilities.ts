export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	airlock: {
		inherit: true,
		onSwitchInPriority: 13,
		onSwitchIn(pokemon) {
			pokemon.abilityState.ending = false;
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false;
		},
	},
	angerpoint: {
		inherit: true,
		onAfterSubDamage(damage, defender, attacker, move) {
			if (!defender.hp) return;
			if (move?.effectType === 'Move' && defender.getMoveHitData(move).crit) {
				defender.setBoost({ atk: 6 });
				this.add('-setboost', defender, 'atk', 12, '[from] ability: Anger Point');
			}
		},
		rating: 1.5,
	},
	anticipation: {
		inherit: true,
		onSwitchInPriority: 8,
	},
	baddreams: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 10,
	},
	blaze: {
		inherit: true,
		onModifyAtk: undefined, // no inherit
		onModifySpA: undefined, // no inherit
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
	},
	cloudnine: {
		inherit: true,
		onSwitchInPriority: 13,
		onSwitchIn(pokemon) {
			pokemon.abilityState.ending = false;
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false;
		},
	},
	colorchange: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (!damage || !defender.hp) return;
			const type = move.type;
			if (defender.isActive && move.category !== 'Status' && type !== '???' && !defender.hasType(type)) {
				if (!defender.setType(type)) return false;
				this.add('-start', defender, 'typechange', type, '[from] ability: Color Change');
			}
		},
		onAfterMoveSecondary: undefined, // no inherit
	},
	compoundeyes: {
		onSourceModifyAccuracyPriority: 9,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return this.chainModify(1.3);
		},
		inherit: true,
	},
	cutecharm: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					attacker.addVolatile('attract', this.effectState.defender);
				}
			}
		},
	},
	download: {
		inherit: true,
		onSwitchInPriority: 9,
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const defender of pokemon.foes()) {
				if (defender.volatiles.substitute) continue;
				totaldef += defender.getStat('def', false, true);
				totalspd += defender.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({ spa: 1 });
			} else if (totalspd) {
				this.boost({ atk: 1 });
			}
		},
	},
	drizzle: {
		inherit: true,
		onSwitchInPriority: 11,
	},
	drought: {
		inherit: true,
		onSwitchInPriority: 11,
	},
	effectspore: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact'] && this.randomChance(3, 10)) {
				const status = this.sample(['slp', 'par', 'psn']);
				attacker.trySetStatus(status, defender);
			}
		},
	},
	flamebody: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					attacker.trySetStatus('brn', defender);
				}
			}
		},
	},
	flashfire: {
		inherit: true,
		onTryHit(defender, attacker, move) {
			if (defender !== attacker && move.type === 'Fire') {
				if (defender.status === 'frz') {
					return;
				}
				if (!defender.addVolatile('flashfire')) {
					this.add('-immune', defender, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		condition: {
			inherit: true,
			onModifyAtk: undefined, // no inherit
			onModifySpA: undefined, // no inherit
			onModifyDamagePhase1(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
		},
	},
	flowergift: {
		inherit: true,
		onSwitchInPriority: 2,
		onAllyModifyAtk(atk) {
			if (this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpD(spd) {
			if (this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		flags: { breakable: 1 },
	},
	forecast: {
		inherit: true,
		onSwitchInPriority: 2,
		flags: { notrace: 1 },
	},
	forewarn: {
		inherit: true,
		onSwitchInPriority: 7,
		onStart(pokemon) {
			let warnMoves: Move[] = [];
			let warnBp = 1;
			for (const defender of pokemon.foes()) {
				for (const moveSlot of defender.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [move];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push(move);
					}
				}
			}
			if (!warnMoves.length) return;
			const warnMove = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
		},
	},
	frisk: {
		inherit: true,
		onSwitchInPriority: 6,
		onStart(pokemon) {
			const defender = pokemon.side.randomFoe();
			if (defender?.item) {
				this.add('-item', '', defender.getItem().name, '[from] ability: Frisk', `[of] ${pokemon}`);
			}
		},
	},
	hustle: {
		inherit: true,
		onSourceModifyAccuracyPriority: 7,
		onSourceModifyAccuracy(accuracy, defender, attacker, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return this.chainModify(0.8);
			}
		},
	},
	hydration: {
		inherit: true,
		onResidual: undefined, // no inherit
		onWeather(defender, attacker, effect) {
			if (effect.id === 'raindance' && defender.status) {
				this.add('-activate', defender, 'ability: Hydration');
				defender.cureStatus();
			}
		},
	},
	insomnia: {
		inherit: true,
		rating: 2.5,
	},
	intimidate: {
		inherit: true,
		onSwitchInPriority: 10,
		onStart(pokemon) {
			const activated = pokemon.adjacentFoes().some(defender => (
				!(defender.volatiles['substitute'] || defender.volatiles['substitutebroken']?.move === 'uturn')
			));

			if (!activated) {
				this.hint("In Gen 4, Intimidate does not activate if every defender has a Substitute (or the Substitute was just broken by U-turn).", false, pokemon.side);
				return;
			}
			this.add('-ability', pokemon, 'Intimidate', 'boost');

			for (const defender of pokemon.adjacentFoes()) {
				if (defender.volatiles['substitute']) {
					this.add('-immune', defender);
				} else if (defender.volatiles['substitutebroken']?.move === 'uturn') {
					this.hint("In Gen 4, if U-turn breaks Substitute the incoming Intimidate does nothing.");
				} else {
					this.boost({ atk: -1 }, defender, pokemon, null, true);
				}
			}
		},
	},
	leafguard: {
		inherit: true,
		onSetStatus(status, defender, attacker, effect) {
			if (effect?.id === 'rest') {
				// do nothing
			} else if (this.field.isWeather('sunnyday')) {
				return false;
			}
		},
	},
	lightningrod: {
		inherit: true,
		onTryHit: undefined, // no inherit
		rating: 0,
	},
	liquidooze: {
		inherit: true,
		onSourceTryHeal(damage, defender, attacker, effect) {
			this.debug(`Heal is occurring: ${defender} <- ${attacker} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed'];
			if (canOoze.includes(effect.id) && this.activeMove?.id !== 'dreameater') {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
	},
	magicguard: {
		inherit: true,
		onSetStatus(status, defender, attacker, effect) {
			if (effect?.id === 'toxicspikes') {
				return false;
			}
		},
		rating: 4.5,
	},
	minus: {
		inherit: true,
		onModifySpAPriority: undefined, // no inherit
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('plus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	moldbreaker: {
		inherit: true,
		onSwitchInPriority: 4,
	},
	multitype: {
		inherit: true,
		onTakeItem: false,
		onSetAbility: false, // redundant but hardcoded
	},
	naturalcure: {
		inherit: true,
		onCheckShow: undefined, // no inherit
		onSwitchOut(pokemon) {
			if (!pokemon.status || pokemon.status === 'fnt') return;

			// Because statused/unstatused pokemon are shown after every switch
			// in gen 3-4, Natural Cure's curing is always known to both players

			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure', '[silent]');
			pokemon.clearStatus();
		},
	},
	normalize: {
		inherit: true,
		onModifyMove(move) {
			if (move.id !== 'struggle') {
				move.type = 'Normal';
			}
		},
	},
	overgrow: {
		inherit: true,
		onModifyAtk: undefined, // no inherit
		onModifySpA: undefined, // no inherit
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
	},
	pickup: {
		inherit: true,
		onResidual: undefined, // no inherit
		rating: 0,
		// No competitive use
	},
	plus: {
		inherit: true,
		onModifySpAPriority: undefined, // no inherit
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('minus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	poisonpoint: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					attacker.trySetStatus('psn', defender);
				}
			}
		},
	},
	pressure: {
		inherit: true,
		onSwitchInPriority: 3,
		onDeductPP(defender, attacker) {
			if (defender === attacker) return;
			return 1;
		},
		rating: 1.5,
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				this.damage(attacker.baseMaxhp / 8, attacker, defender);
			}
		},
	},
	sandstream: {
		inherit: true,
		onSwitchInPriority: 11,
	},
	sandveil: {
		inherit: true,
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify(0.8);
			}
		},
	},
	serenegrace: {
		inherit: true,
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'chatter') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
	},
	shedskin: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 3,
	},
	simple: {
		inherit: true,
		onChangeBoost: undefined, // no inherit
		onModifyBoost(boosts) {
			let key: BoostID;
			for (key in boosts) {
				boosts[key]! *= 2;
			}
		},
	},
	slowstart: {
		inherit: true,
		onSwitchInPriority: 5,
	},
	snowcloak: {
		inherit: true,
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return this.chainModify(0.8);
			}
		},
	},
	snowwarning: {
		inherit: true,
		onSwitchInPriority: 11,
	},
	speedboost: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 3,
	},
	stall: {
		inherit: true,
		onFractionalPriority(priority, pokemon) {
			// don't override Lagging Tail and Full Incense's -0.2 fractional priority
			if (priority >= 0) return -0.1;
		},
	},
	static: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					attacker.trySetStatus('par', defender);
				}
			}
		},
	},
	stench: {
		inherit: true,
		onModifyMove: undefined, // no inherit
		rating: 0,
		// No competitive use
	},
	stickyhold: {
		inherit: true,
		onTakeItem(item, pokemon, attacker) {
			if ((attacker && attacker !== pokemon) || (this.activeMove?.id === 'knockoff')) {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
	},
	stormdrain: {
		inherit: true,
		onTryHit: undefined, // no inherit
		rating: 0,
	},
	sturdy: {
		inherit: true,
		onDamage: undefined, // no inherit
		rating: 0,
	},
	swarm: {
		inherit: true,
		onModifyAtk: undefined, // no inherit
		onModifySpA: undefined, // no inherit
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
	},
	synchronize: {
		inherit: true,
		onAfterSetStatus(status, defender, attacker, effect) {
			if (!attacker || attacker === defender) return;
			if (effect?.id === 'toxicspikes') return;
			let id: string = status.id;
			if (id === 'slp' || id === 'frz') return;
			if (id === 'tox') id = 'psn';
			attacker.trySetStatus(id, defender);
		},
	},
	tangledfeet: {
		inherit: true,
		onModifyAccuracyPriority: 6,
		onModifyAccuracy(accuracy, defender) {
			if (typeof accuracy !== 'number') return;
			if (defender?.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return this.chainModify(0.5);
			}
		},
	},
	thickfat: {
		inherit: true,
		onSourceModifyAtk: undefined, // no inherit
		onSourceModifySpA: undefined, // no inherit
		onSourceBasePowerPriority: 1,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
	},
	torrent: {
		inherit: true,
		onModifyAtk: undefined, // no inherit
		onModifySpA: undefined, // no inherit
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
	},
	trace: {
		inherit: true,
		onSwitchInPriority: 12,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const defender = pokemon.side.randomFoe();
			if (!defender || defender.fainted) return;
			const ability = defender.getAbility();
			if (ability.flags['notrace']) return;
			pokemon.setAbility(ability, defender);
		},
		flags: { notrace: 1 },
	},
	truant: {
		inherit: true,
		onBeforeMove(pokemon) {
			if (pokemon.volatiles['truant']) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
		},
		onResidual(pokemon) {
			if (!pokemon.removeVolatile('truant') && pokemon.activeTurns) {
				pokemon.addVolatile('truant');
			}
		},
	},
	vitalspirit: {
		inherit: true,
		rating: 2.5,
	},
	wonderguard: {
		inherit: true,
		onTryHit(defender, attacker, move) {
			if (move.id === 'firefang') {
				this.hint("In Gen 4, Fire Fang is always able to hit through Wonder Guard.", true, defender.side);
				return;
			}
			if (defender === attacker || move.category === 'Status' || move.type === '???') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (defender.runEffectiveness(move) <= 0 || !defender.runImmunity(move)) {
				this.add('-immune', defender, '[from] ability: Wonder Guard');
				return null;
			}
		},
	},
	rebound: {
		inherit: true,
		onTryHitSide: undefined, // no inherit
	},
};
