import { Pokemon } from "../../../sim";

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,

	// Hardcoded for poke
	singleEvent(eventid, effect, state, target, source, sourceEffect, relayVar, customCallback) {
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
		}
		if (this.log.length - this.sentLogPos > 1000) {
			this.add('message', 'LINE LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Infinite loop");
		}
		// this.add('Event: ' + eventid + ' (depth ' + this.eventDepth + ')');
		let hasRelayVar = true;
		if (relayVar === undefined) {
			relayVar = true;
			hasRelayVar = false;
		}
		if (effect.effectType === 'Status' && (target instanceof Pokemon) && target.status !== effect.id) {
			// it's changed; call it off
			return relayVar;
		}
		if (eventid === 'SwitchIn' && effect.effectType === 'Ability' && effect.flags['breakable'] &&
			this.suppressingAbility(target as Pokemon)) {
			this.debug(eventid + ' handler suppressed by Mold Breaker');
			return relayVar;
		}
		if (eventid !== 'Start' && eventid !== 'TakeItem' && eventid !== 'SetAbility' && effect.effectType === 'Item' &&
			(target instanceof Pokemon) && target.ignoringItem()) {
			this.debug(eventid + ' handler suppressed by Embargo, Klutz or Magic Room');
			return relayVar;
		}
		// Suppress Neutralizing Gas innate here so that base abilities are properly suppressed
		if (eventid !== 'End' && (effect.effectType === 'Ability' && effect.id !== 'ability:neutralizinggas') &&
			(target instanceof Pokemon) && target.ignoringAbility()) {
			this.debug(eventid + ' handler suppressed by Gastro Acid or Neutralizing Gas');
			return relayVar;
		}
		if (
			effect.effectType === 'Weather' && eventid !== 'FieldStart' && eventid !== 'FieldResidual' &&
			eventid !== 'FieldEnd' && this.field.suppressingWeather()
		) {
			this.debug(eventid + ' handler suppressed by Air Lock');
			return relayVar;
		}

		const callback = customCallback || (effect as any)[`on${eventid}`];
		if (callback === undefined) return relayVar;

		const parentEffect = this.effect;
		const parentEffectState = this.effectState;
		const parentEvent = this.event;

		this.effect = effect;
		this.effectState = state as EffectState || this.initEffectState({});
		this.event = { id: eventid, target, source, effect: sourceEffect };
		this.eventDepth++;

		const args = [target, source, sourceEffect];
		if (hasRelayVar) args.unshift(relayVar);

		let returnVal;
		if (typeof callback === 'function') {
			returnVal = callback.apply(this, args);
		} else {
			returnVal = callback;
		}

		this.eventDepth--;
		this.effect = parentEffect;
		this.effectState = parentEffectState;
		this.event = parentEvent;

		return returnVal === undefined ? relayVar : returnVal;
	},
	field: {
		suppressingWeather() {
			for (const pokemon of this.battle.getAllActive()) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					(pokemon.getAbility().suppressWeather ||
						pokemon.m.innates?.some((k: string) => this.battle.dex.abilities.get(k).suppressWeather))) {
					return true;
				}
			}
			return false;
		},
	},
	pokemon: {
		ignoringAbility() {
			if (this.battle.gen >= 5 && !this.isActive) return true;

			// Certain Abilities won't activate while Transformed, even if they ordinarily couldn't be suppressed (e.g. Disguise)
			if (this.getAbility().flags['notransform'] && this.transformed) return true;
			if (this.getAbility().flags['cantsuppress']) return false;
			if (this.volatiles['gastroacid']) return true;

			// Check if any active pokemon have the ability Neutralizing Gas
			if (this.hasItem('Ability Shield') || this.ability === ('neutralizinggas' as ID)) return false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if ((pokemon.m.innates?.includes('neutralizinggas') || pokemon.ability === ('neutralizinggas' as ID)) &&
					!pokemon.volatiles['gastroacid'] && !pokemon.transformed &&
					!pokemon.abilityState.ending && !this.volatiles['commanding']) {
					return true;
				}
			}

			return false;
		},
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
			ability = this.battle.toID(ability);
			return this.ability === ability || !!this.volatiles['ability:' + ability];
		},
		transformInto(pokemon, effect) {
			const species = pokemon.species;
			if (pokemon.fainted || this.illusion || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5) ||
				(pokemon.transformed && this.battle.gen >= 2) || (this.transformed && this.battle.gen >= 5) ||
				species.name === 'Eternatus-Eternamax') {
				return false;
			}

			if (!this.setSpecies(species, effect, true)) return false;

			this.transformed = true;
			this.weighthg = pokemon.weighthg;

			const types = pokemon.getTypes(true, true);
			this.setType(pokemon.volatiles['roost'] ? pokemon.volatiles['roost'].typeWas : types, true);
			this.addedType = pokemon.addedType;
			this.knownType = this.isAlly(pokemon) && pokemon.knownType;
			this.apparentType = pokemon.apparentType;

			let statName: StatIDExceptHP;
			for (statName in this.storedStats) {
				this.storedStats[statName] = pokemon.storedStats[statName];
				if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats![statName]; // Gen 1: Copy modified stats.
			}
			this.moveSlots = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			this.timesAttacked = pokemon.timesAttacked;
			for (const [i, moveSlot] of pokemon.moveSlots.entries()) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				const move = this.battle.dex.moves.get(moveSlot.id);
				const pp = Math.min(5, move.pp);
				this.moveSlots.push({
					move: moveName,
					id: moveSlot.id,
					pp,
					maxpp: this.battle.gen >= 5 ? pp : this.battle.calculatePP(move, this.ppUps[i] || 0),
					target: moveSlot.target,
					disabled: false,
					used: false,
					virtual: true,
				});
			}
			let boostName: BoostID;
			for (boostName in pokemon.boosts) {
				this.boosts[boostName] = pokemon.boosts[boostName];
			}
			if (this.battle.gen >= 6) {
				// we need to remove all crit volatiles before adding any crit volatiles
				const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
				for (const volatile of volatilesToCopy) this.removeVolatile(volatile);
				for (const volatile of volatilesToCopy) {
					if (pokemon.volatiles[volatile]) {
						this.addVolatile(volatile);
						if (volatile === 'gmaxchistrike') this.volatiles[volatile].layers = pokemon.volatiles[volatile].layers;
						if (volatile === 'dragoncheer') this.volatiles[volatile].hasDragonType = pokemon.volatiles[volatile].hasDragonType;
					}
				}
			}
			if (effect) {
				this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
			} else {
				this.battle.add('-transform', this, pokemon);
			}
			if (this.terastallized && this.terastallized !== this.apparentType) {
				this.battle.add('-start', this, 'typechange', this.terastallized, '[silent]');
				this.apparentType = this.terastallized;
			}
			if (this.battle.gen > 2) {
				this.setAbility(pokemon.ability, this, null, true);
				if (this.m.innates) {
					for (const innate of this.m.innates) {
						this.removeVolatile('ability:' + innate);
					}
				}
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						this.addVolatile('ability:' + innate, this);
					}
				}
			}

			// Change formes based on held items (for Transform)
			// Only ever relevant in Generation 4 since Generation 3 didn't have item-based forme changes
			if (this.battle.gen === 4) {
				if (this.species.num === 487) {
					// Giratina formes
					if (this.species.name === 'Giratina' && this.item === 'griseousorb') {
						this.formeChange('Giratina-Origin');
					} else if (this.species.name === 'Giratina-Origin' && this.item !== 'griseousorb') {
						this.formeChange('Giratina');
					}
				}
				if (this.species.num === 493) {
					// Arceus formes
					const item = this.getItem();
					const targetForme = (item?.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
					if (this.species.name !== targetForme) {
						this.formeChange(targetForme);
					}
				}
			}

			return true;
		},
		/**
		 * Changes this Pokemon's forme to match the given speciesId (or species).
		 * This function handles all changes to stats, ability, type, species, etc.
		 * as well as sending all relevant messages sent to the client.
		 */
		formeChange(speciesId, source, isPermanent, message) {
			if (!source) source = this.battle.effect;

			const rawSpecies = this.battle.dex.species.get(speciesId);

			const species = this.setSpecies(rawSpecies, source);
			if (!species) return false;

			if (this.battle.gen <= 2) return true;

			// The species the opponent sees
			const apparentSpecies =
				this.illusion ? this.illusion.species.name : species.baseSpecies;
			if (isPermanent) {
				this.baseSpecies = rawSpecies;
				this.details = this.getUpdatedDetails();
				this.battle.add('detailschange', this, (this.illusion || this).details);
				if (source.effectType === 'Item') {
					this.canTerastallize = null; // National Dex behavior
					if (source.zMove) {
						this.battle.add('-burst', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Ultra Burst counts as an action for Truant
					} else if (source.isPrimalOrb) {
						if (this.illusion) {
							this.ability = '';
							this.battle.add('-primal', this.illusion);
						} else {
							this.battle.add('-primal', this);
						}
					} else {
						this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
					}
				} else if (source.effectType === 'Status') {
					// Shaymin-Sky -> Shaymin
					this.battle.add('-formechange', this, species.name, message);
				}
			} else {
				if (source.effectType === 'Ability') {
					this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`);
				} else {
					this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message);
				}
			}
			if (isPermanent && !['disguise', 'iceface', 'ability:disguise', 'ability:iceface'].includes(source.id)) {
				if (this.illusion) {
					this.ability = ''; // Don't allow Illusion to wear off
				}
				this.setAbility(species.abilities['0'], null, null, true);
				this.baseAbility = this.ability;
			}
			if (this.terastallized && this.terastallized !== this.apparentType) {
				this.battle.add('-start', this, 'typechange', this.terastallized, '[silent]');
				this.apparentType = this.terastallized;
			}
			return true;
		},
	},
};
