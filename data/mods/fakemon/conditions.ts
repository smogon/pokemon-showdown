/**
 * New battle effects introduced by the Fakemon system.
 *
 * Everything here is a real engine condition: it is stored on the battle, side
 * or Pokemon, ticks down over turns, and takes part in damage calculation and
 * the ability/item/move event chain exactly like a built-in effect.
 *
 * Groups, in order:
 *   1. weather        - Full Moon, Miasma
 *   2. field / rooms  - Haunted Room, Glitched Room, and the pseudo-weathers
 *                       the generated moves set up
 *   3. side conditions - Gasveil, Cotton Field, Live Wire, hazards, relays
 *   4. volatiles      - per-Pokemon effects used by moves and abilities
 */

export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	// ======================================================================
	// 1. WEATHER
	// ======================================================================

	/**
	 * Full Moon (Hallowisp's "Full Moon", Grollf's "Full Moon Beam").
	 * Ghost-type Pokemon hit harder and cannot have their stats lowered.
	 */
	fullmoon: {
		name: 'Full Moon',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source) {
			return source?.hasItem('lunarrock') ? 8 : 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Ghost') {
				this.debug('Full Moon ghost boost');
				return this.chainModify(1.5);
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (!target.hasType('Ghost')) return;
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				this.add('-fail', target, 'unboost', '[from] Full Moon');
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				this.add('-weather', 'FullMoon', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'FullMoon');
			}
		},
		onFieldResidualOrder: 1,
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},

	/** Miasma - a poisonous haze that chips every non-Poison type. */
	fakemonmiasma: {
		name: 'Miasma',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-weather', 'Miasma');
		},
		onFieldResidualOrder: 1,
		onWeather(target) {
			if (target.hasType('Poison') || target.hasType('Steel')) return;
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},

	// ======================================================================
	// 2. FIELD EFFECTS AND ROOMS
	// ======================================================================

	/**
	 * Haunted Room (Spukasten's "Furniture Haunt"). Like Trick Room it is a
	 * pseudo-weather, so it does not overwrite terrain. Every non-Ghost Pokemon
	 * on the field acts as if it also had the Ghost type.
	 */
	hauntedroom: {
		name: 'Haunted Room',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Haunted Room');
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.hasType('Ghost')) pokemon.addVolatile('hauntedroomghost');
			}
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 1,
		onFieldEnd() {
			this.add('-fieldend', 'move: Haunted Room');
			for (const pokemon of this.getAllActive()) pokemon.removeVolatile('hauntedroomghost');
		},
		// Pokemon that switch in while the room is up are affected too.
		onAnySwitchIn(pokemon) {
			if (!pokemon.hasType('Ghost')) pokemon.addVolatile('hauntedroomghost');
		},
	},
	/** The per-Pokemon half of Haunted Room. */
	hauntedroomghost: {
		name: 'hauntedroomghost',
		noCopy: true,
		onStart(pokemon) {
			if (pokemon.hasType('Ghost')) {
				pokemon.removeVolatile('hauntedroomghost');
				return;
			}
			pokemon.addedType = 'Ghost';
			this.add('-start', pokemon, 'typeadd', 'Ghost', '[from] move: Haunted Room');
		},
		onEnd(pokemon) {
			if (pokemon.addedType === 'Ghost') pokemon.addedType = '';
		},
	},

	/**
	 * Glitched Room (Bytebug's "Glitch Matrix"). A room that removes every type
	 * immunity while it is active.
	 */
	glitchedroom: {
		name: 'Glitched Room',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Glitched Room');
		},
		onAnyModifyMove(move) {
			move.ignoreImmunity = true;
		},
		onFieldResidualOrder: 27,
		onFieldResidualSubOrder: 2,
		onFieldEnd() {
			this.add('-fieldend', 'move: Glitched Room');
		},
	},

	/** Blocks all priority moves (Psychic-Terrain-like, but field wide). */
	fakemonprioritylock: {
		name: 'Priority Lock',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Priority Lock');
		},
		onTryMovePriority: 10,
		onTryMove(source, target, move) {
			if (move.priority > 0 && move.category !== 'Status') {
				this.add('-fieldactivate', 'move: Priority Lock');
				return false;
			}
		},
		onFieldResidualOrder: 27,
		onFieldEnd() {
			this.add('-fieldend', 'move: Priority Lock');
		},
	},

	/** Weather lock - clears the weather and stops any new weather for 5 turns. */
	fakemonweatherlock: {
		name: 'Weather Lock',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.field.clearWeather();
			this.add('-fieldstart', 'move: Weather Lock');
		},
		onSetWeather() {
			this.add('-fieldactivate', 'move: Weather Lock');
			return false;
		},
		onFieldResidualOrder: 27,
		onFieldEnd() {
			this.add('-fieldend', 'move: Weather Lock');
		},
	},

	/** A swarm of ants chipping every non-Bug Pokemon. */
	fakemonants: {
		name: 'Ant Swarm',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Ant Swarm');
		},
		onFieldResidualOrder: 27,
		onFieldResidual() {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasType('Bug') || !pokemon.hp) continue;
				this.damage(pokemon.baseMaxhp / 16, pokemon, null, this.dex.conditions.get('fakemonants'));
			}
		},
		onFieldEnd() {
			this.add('-fieldend', 'move: Ant Swarm');
		},
	},

	/** Electrified ground: grounded Pokemon are chipped and slowed. */
	fakemonelectrifiedground: {
		name: 'Electrified Ground',
		effectType: 'Weather',
		duration: 5,
		onFieldStart() {
			this.add('-fieldstart', 'move: Electrified Ground');
		},
		onFieldResidualOrder: 27,
		onFieldResidual() {
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.isGrounded() || !pokemon.hp) continue;
				this.damage(pokemon.baseMaxhp / 16, pokemon, null,
					this.dex.conditions.get('fakemonelectrifiedground'));
				this.boost({ spe: -1 }, pokemon, null, this.dex.conditions.get('fakemonelectrifiedground'));
			}
		},
		onFieldEnd() {
			this.add('-fieldend', 'move: Electrified Ground');
		},
	},

	/** Suppresses every ability on the field. */
	fakemonabilitylock: {
		name: 'Ability Lock',
		effectType: 'Weather',
		duration: 3,
		onFieldStart() {
			this.add('-fieldstart', 'move: Ability Lock');
			for (const pokemon of this.getAllActive()) pokemon.addVolatile('gastroacid');
		},
		onAnySwitchIn(pokemon) {
			pokemon.addVolatile('gastroacid');
		},
		onFieldResidualOrder: 27,
		onFieldEnd() {
			this.add('-fieldend', 'move: Ability Lock');
			for (const pokemon of this.getAllActive()) pokemon.removeVolatile('gastroacid');
		},
	},

	/** EMP field - Steel moves fail and Steel-type abilities are suppressed. */
	fakemonempfield: {
		name: 'EMP Field',
		effectType: 'Weather',
		duration: 3,
		onFieldStart() {
			this.add('-fieldstart', 'move: EMP Field');
		},
		onTryMovePriority: 5,
		onTryMove(source, target, move) {
			if (move.type === 'Steel') {
				this.add('-fieldactivate', 'move: EMP Field');
				return false;
			}
		},
		onFieldResidualOrder: 27,
		onFieldEnd() {
			this.add('-fieldend', 'move: EMP Field');
		},
	},

	// ======================================================================
	// 3. SIDE CONDITIONS
	// ======================================================================

	/**
	 * Gasveil (Gasiferno). The gas hangs over the *opposing* side and doubles
	 * all Fire-type damage those Pokemon take.
	 */
	gasveil: {
		name: 'Gasveil',
		duration: 5,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Gasveil');
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (move.type !== 'Fire') return;
			if (target.side !== (this.effectState.side as Side)) return;
			this.debug('Gasveil doubling Fire damage');
			return this.chainModify(2);
		},
		onSideResidualOrder: 26,
		onSideResidualSubOrder: 10,
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Gasveil');
		},
	},

	/**
	 * Cotton Field (Pompomble's "Cotton Wind"). Its side cannot flinch and
	 * takes 25% less from super effective hits.
	 */
	cottonfield: {
		name: 'Cotton Field',
		duration: 5,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Cotton Field');
		},
		onAnyTryBoost() {},
		onFlinch() {
			return false;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target.side !== (this.effectState.side as Side)) return;
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Cotton Field super effective reduction');
				return this.chainModify(0.75);
			}
		},
		onSideResidualOrder: 26,
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Cotton Field');
		},
	},

	/**
	 * Live Wire (Kabkoloss). An entry hazard of electrified cables: it paralyses
	 * Pokemon switching in, ignores Flying types, and is removed by (and does
	 * not affect) Electric and Ground types.
	 */
	livewire: {
		name: 'Live Wire',
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Live Wire');
		},
		onEntryHazard(pokemon) {
			if (pokemon.hasType('Electric') || pokemon.hasType('Ground')) {
				pokemon.side.removeSideCondition('livewire');
				this.add('-sideend', pokemon.side, 'move: Live Wire', `[of] ${pokemon}`);
				return;
			}
			if (pokemon.hasType('Flying') || !pokemon.isGrounded()) return;
			pokemon.trySetStatus('par', null, this.dex.conditions.get('livewire'));
		},
	},

	/** A bleeding hazard: chips the incoming Pokemon for 1/16. */
	fakemonbleedhazard: {
		name: 'Bleed Hazard',
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Bleed Hazard');
		},
		onEntryHazard(pokemon) {
			if (!pokemon.isGrounded()) return;
			this.damage(pokemon.maxhp / 8, pokemon, null, this.dex.conditions.get('fakemonbleedhazard'));
		},
	},

	/** The replacement gets +2 Speed. */
	fakemonrelayspeed: {
		name: 'Speed Relay',
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Speed Relay');
		},
		onSwitchIn(pokemon) {
			this.boost({ spe: 2 }, pokemon, pokemon, this.dex.conditions.get('fakemonrelayspeed'));
			pokemon.side.removeSideCondition('fakemonrelayspeed');
		},
	},

	/** The replacement is healed and cured. */
	fakemonrelayheal: {
		name: 'Healing Relay',
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Healing Relay');
		},
		onSwitchIn(pokemon) {
			if (pokemon.hp) {
				this.heal(pokemon.maxhp / 4, pokemon);
				pokemon.cureStatus();
			}
			pokemon.side.removeSideCondition('fakemonrelayheal');
		},
	},

	/** Everyone on this side regains 1/8 HP at the end of the turn. */
	fakemonhealingfield: {
		name: 'Healing Field',
		duration: 3,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Healing Field');
		},
		onSideResidualOrder: 26,
		onSideResidual(side) {
			for (const pokemon of side.active) {
				if (pokemon?.hp) this.heal(pokemon.baseMaxhp / 8, pokemon);
			}
		},
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Healing Field');
		},
	},

	/** Ground-type moves fail against this side. */
	fakemongroundward: {
		name: 'Ground Ward',
		duration: 3,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Ground Ward');
		},
		onAnyTryHit(target, source, move) {
			if (move.type === 'Ground' && target.side === (this.effectState.side as Side) &&
				target !== source) {
				this.add('-activate', target, 'move: Ground Ward');
				return null;
			}
		},
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Ground Ward');
		},
	},

	/** Tailwind that only speeds up Fire and Flying types. */
	fakemonthermaldraft: {
		name: 'Thermal Draft',
		duration: 3,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Thermal Draft');
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.hasType('Fire') || pokemon.hasType('Flying')) return this.chainModify(2);
		},
		onSideResidualOrder: 26,
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Thermal Draft');
		},
	},

	/** Reflects special attacks back at the attacker. */
	fakemonspecialmirror: {
		name: 'Special Mirror',
		duration: 3,
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Special Mirror');
		},
		onAnyAfterMoveSecondary(target, source, move) {
			if (move.category !== 'Special' || target.side !== (this.effectState.side as Side)) return;
			if (!source.hp || source === target) return;
			const damage = move.totalDamage;
			if (typeof damage !== 'number' || damage <= 0) return;
			this.damage(Math.floor(damage / 3), source, target,
				this.dex.conditions.get('fakemonspecialmirror'));
		},
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Special Mirror');
		},
	},

	// ======================================================================
	// 4. VOLATILES
	// ======================================================================

	/** Marks a Pokemon that Mega Evolved without a stone. Read by the UI/AI. */
	fakemonmega: {
		name: 'Mega Evolution',
		noCopy: true,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Mega Evolution', '[silent]');
		},
	},

	/** Consecutive-use counter shared by the "power increases each use" moves. */
	fakemonecho: {
		name: 'Echo',
		noCopy: true,
		onStart() {
			this.effectState.hitCount = 1;
		},
		onRestart() {
			this.effectState.hitCount = (this.effectState.hitCount || 0) + 1;
		},
	},

	/** Heals 25% at the end of each turn for three turns. */
	fakemonregen: {
		name: 'Regeneration',
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Regeneration');
		},
		onResidualOrder: 5,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 4, pokemon);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Regeneration');
		},
	},

	/** The next incoming attack misses. */
	fakemondodge: {
		name: 'Dodge',
		duration: 2,
		onStart(pokemon) {
			this.add('-singleturn', pokemon, 'move: Dodge');
		},
		onTryHitPriority: 3,
		onTryHit(target, source, move) {
			if (move.category === 'Status') return;
			this.add('-activate', target, 'move: Dodge');
			target.removeVolatile('fakemondodge');
			return null;
		},
	},

	/** The next move of the charged type is stronger. */
	fakemoncharged: {
		name: 'Charged',
		duration: 2,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Charged');
		},
		onBasePowerPriority: 9,
		onBasePower(basePower, attacker, defender, move) {
			if (move.category === 'Status') return;
			attacker.removeVolatile('fakemoncharged');
			return this.chainModify(1.5);
		},
	},

	/** Guarantees the next move connects. */
	fakemonsurefire: {
		name: 'Sure Fire',
		duration: 2,
		onSourceAccuracy() {
			return true;
		},
		onModifyMove(move) {
			move.accuracy = true;
		},
	},

	/** Grass moves are 1.5x while below half HP. */
	fakemonovergrowth: {
		name: 'Overgrowth',
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Overgrowth');
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp * 2 <= attacker.maxhp) {
				return this.chainModify(1.5);
			}
		},
	},

	/** Redirects Electric moves to the user and powers them up if hit. */
	fakemonlightningrod: {
		name: 'Lightning Rod',
		duration: 2,
		onStart(pokemon) {
			this.add('-singleturn', pokemon, 'move: Lightning Rod');
		},
		onFoeRedirectTargetPriority: 1,
		onFoeRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric') return;
			const holder = this.effectState.target as Pokemon;
			if (holder.isActive && this.validTarget(holder, source, move.target)) return holder;
		},
		onTryHit(target, source, move) {
			if (move.type === 'Electric') move.basePower = Math.max(move.basePower, 100);
		},
	},

	/** Neither the user's weight nor weight-based moves affect it. */
	fakemonweightless: {
		name: 'Weightless',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Weightless');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.basePowerCallback) return this.chainModify(0.5);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Weightless');
		},
	},

	/** Cannot be forced out. */
	fakemonrooted: {
		name: 'Rooted',
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Rooted');
		},
		onDragOut() {
			return null;
		},
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
	},

	/** Reduces the damage of the target's attacks against the user by half. */
	fakemonweakened: {
		name: 'Weakened',
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Weakened');
		},
		onModifyDamage(damage, source, target, move) {
			return this.chainModify(0.5);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Weakened');
		},
	},

	/** Any healing the holder gets is mirrored to the pokemon that applied it. */
	fakemonsharedheal: {
		name: 'Shared Heal',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Shared Heal');
		},
		onTryHeal(damage, target) {
			const other = this.effectState.source as Pokemon | undefined;
			if (other?.hp && damage > 0) this.heal(damage, other, target);
		},
	},

	/** Damage the user takes this turn is copied onto the target. */
	fakemonmirrordamage: {
		name: 'Mirror Damage',
		duration: 2,
		onStart(pokemon) {
			this.add('-singleturn', pokemon, 'move: Mirror Damage');
		},
		onDamagingHit(damage, target, source) {
			if (source?.hp) this.damage(damage, source, target, this.dex.conditions.get('fakemonmirrordamage'));
		},
	},

	/** A bleeding wound: 1/16 max HP per turn. */
	fakemonbleed: {
		name: 'Bleed',
		onStart(pokemon) {
			this.add('-start', pokemon, 'Bleed');
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16, pokemon, null, this.dex.conditions.get('fakemonbleed'));
		},
	},

	/** A burn that also chips Defense every turn. */
	fakemonscorchmark: {
		name: 'Scorch Mark',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Scorch Mark');
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16, pokemon, null,
				this.dex.conditions.get('fakemonscorchmark'));
			this.boost({ def: -1 }, pokemon, null, this.dex.conditions.get('fakemonscorchmark'));
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Scorch Mark');
		},
	},

	/** The held item is disabled and hurts its holder. */
	fakemoncurseditem: {
		name: 'Cursed Item',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Cursed Item');
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (pokemon.item) this.damage(pokemon.baseMaxhp / 8, pokemon);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Cursed Item');
		},
	},

	/** Sound moves are unusable. */
	fakemonsoundlock: {
		name: 'Sound Lock',
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Sound Lock');
		},
		onDisableMove(pokemon) {
			for (const slot of pokemon.moveSlots) {
				if (this.dex.moves.get(slot.id).flags['sound']) pokemon.disableMove(slot.id);
			}
		},
		onBeforeMove(pokemon, target, move) {
			if (move.flags['sound']) {
				this.add('cant', pokemon, 'move: Sound Lock', move);
				return false;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Sound Lock');
		},
	},

	/** Immunity to a single type for a few turns. */
	fakemontypeward: {
		name: 'Type Ward',
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Type Ward');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) return this.chainModify(0.5);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'move: Type Ward');
		},
	},

	/** Repeats the move at half power on the following turn. */
	fakemonrepeat: {
		name: 'Repeat',
		duration: 2,
		onResidualOrder: 4,
		onResidual(pokemon) {
			const move = this.effectState.move as string;
			if (!move || !pokemon.hp) return;
			pokemon.removeVolatile('fakemonrepeat');
			const active = this.dex.getActiveMove(move);
			active.basePower = Math.floor(active.basePower / 2);
			this.actions.useMove(active, pokemon);
		},
		onStart(pokemon, source, sourceEffect) {
			this.effectState.move = sourceEffect?.id;
		},
	},

	/** Punishes contact attackers - one variant per effect the sources describe. */
	fakemonthorns: {
		name: 'Thorns',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Thorns');
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp) {
				this.damage(source.baseMaxhp / 8, source, target, this.dex.conditions.get('fakemonthorns'));
			}
		},
	},
	fakemonretaliatestats: {
		name: 'Retaliation',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Retaliation');
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp) this.boost({ def: -1, spd: -1 }, source, target);
		},
	},
	fakemonretaliateburn: {
		name: 'Scalding Coat',
		duration: 2,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Scalding Coat');
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp) source.trySetStatus('brn', target);
		},
	},
	fakemonretaliatetox: {
		name: 'Venom Coat',
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Venom Coat');
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp) source.trySetStatus('tox', target);
		},
	},
	fakemonretaliatepar: {
		name: 'Static Coat',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Static Coat');
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && source.hp && this.randomChance(1, 5)) {
				source.trySetStatus('par', target);
			}
		},
	},

	// Braces: cut the next incoming hit by a fixed percentage.
	fakemonbrace25: braceCondition(25),
	fakemonbrace30: braceCondition(30),
	fakemonbrace50: braceCondition(50),
};

/** Builds a "reduce the next hit by N%" volatile. */
function braceCondition(percent: number): import('../../../sim/dex-conditions').ModdedConditionData {
	return {
		name: `Brace ${percent}`,
		duration: 2,
		onStart(pokemon) {
			this.add('-singleturn', pokemon, `move: Brace`);
		},
		onSourceModifyDamage(damage, source, target) {
			target.removeVolatile(`fakemonbrace${percent}`);
			return this.chainModify((100 - percent) / 100);
		},
	};
}
