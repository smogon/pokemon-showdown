import {getName} from "./scripts";

export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	abilityid: {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Aeonic
	changetempo: {
		shortDesc: "Summons Trick Room on switch-in and negates the user's charge/recharge.",
		name: "Change Tempo",
		onStart(target) {
			if (!this.field.getPseudoWeather('trickroom')) {
				this.add('-ability', target, 'Change Tempo');
				this.field.addPseudoWeather('trickroom', target, target.getAbility());
			}
		},
		onChargeMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			this.addMove('-anim', pokemon, move.name, target);
			return false;
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['mustrecharge']) pokemon.removeVolatile('mustrecharge');
		},
	},

	// A Quag To The Past
	quagofruin: {
		shortDesc: "Active Pokemon without this Ability have their Def multiplied by 0.85. Ignores abilities.",
		name: "Quag of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Quag of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Quag of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Quag of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Quag of Ruin Def drop');
			return this.chainModify(0.85);
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
	},
	clodofruin: {
		shortDesc: "Active Pokemon without this Ability have their Atk multiplied by 0.85. Ignores stat changes.",
		name: "Quag of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Clod of Ruin');
		},
		onAnyModifyAtk(atk, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Clod of Ruin')) return;
			if (!move.ruinedAtk?.hasAbility('Clod of Ruin')) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Clod of Ruin Atk drop');
			return this.chainModify(0.85);
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		isBreakable: true,
	},

	// BreadLoeuf
	painfulexit: {
		shortDesc: "When this Pokemon switches out, foes lose 25% HP.",
		name: "Painful Exit",
		onSwitchOut(pokemon) {
			this.add(`c:|${getName('BreadLoeuf')}|Just kidding!! Take this KNUCKLE SANDWICH`);
			for (const foe of pokemon.foes()) {
				if (!foe || foe.fainted || !foe.hp) continue;
				this.add(`-anim`, pokemon, "Tackle", foe);
				this.damage(foe.hp / 4, foe, pokemon);
			}
		},
	},

	// Kennedy
	anfield: {
		shortDesc: "Clears terrain/hazards/pseudo weathers. Summons Anfield Atmosphere.",
		name: "Anfield",
		onStart(target) {
			let success = false;
			if (this.field.terrain) {
				success = this.field.clearTerrain();
			}
			for (const side of this.sides) {
				const remove = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const sideCondition of remove) {
					if (side.removeSideCondition(sideCondition)) {
						success = true;
					}
				}
			}
			if (Object.keys(this.field.pseudoWeather).length) {
				for (const pseudoWeather in this.field.pseudoWeather) {
					if (this.field.removePseudoWeather(pseudoWeather)) success = true;
				}
			}
			if (success) {
				this.add('-activate', target, 'ability: Anfield');
			}
			this.field.addPseudoWeather('anfieldatmosphere', target, target.getAbility());
		},
	},
	youllneverwalkalone: {
		shortDesc: "Boosts Atk, Def, SpD, and Spe by 25% under Anfield Atmosphere.",
		name: "You'll Never Walk Alone",
		onStart(pokemon) {
			this.singleEvent('AnyPseudoWeatherChange', this.effect, this.effectState, pokemon);
		},
		onAnyPseudoWeatherChange(pokemon, source, pseudoWeather) {
			if (pokemon.transformed) return;
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				pokemon.addVolatile('youllneverwalkalone');
			} else {
				pokemon.removeVolatile('youllneverwalkalone');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['youllneverwalkalone'];
			this.add('-end', pokemon, 'You\'ll Never Walk Alone', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				this.add('-activate', pokemon, 'ability: You\'ll Never Walk Alone');
				for (const stat of ['atk', 'def', 'spd', 'spe']) {
					this.add('-start', pokemon, 'ynwa' + stat);
				}
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, source, target, move) {
				this.debug('You\'ll Never Walk Alone atk boost');
				return this.chainModify([5120, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, target, source, move) {
				this.debug('You\'ll Never Walk Alone def boost');
				return this.chainModify([5120, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, target, source, move) {
				this.debug('You\'ll Never Walk Alone spd boost');
				return this.chainModify([5120, 4096]);
			},
			onModifySpe(spe, pokemon) {
				this.debug('You\'ll Never Walk Alone spe boost');
				return this.chainModify([5120, 4096]);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'You\'ll Never Walk Alone');
			},
		},
		isPermanent: true,
	},

	// Kris
	cacophony: {
		name: "Cacophony",
		shortDesc: "Sound moves: 1.5x BP, ignore type-based immunities. Opposing sound fails.",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Cacophony boost');
				return this.chainModify([6144, 4096]);
			}
		},
		onAnyTryMove(source, target, move) {
			if (source !== target && move.flags['sound']) {
				this.add('-immune', target, '[from] ability: Cacophony');
				return null;
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			move.ignoreImmunity = true;
		},
	},

	// Mia
	hacking: {
		name: "Hacking",
		shortDesc: "Hacks into PS and finds out if the enemy has any super effective moves.",
		onStart(pokemon) {
			this.add(`c:|${getName('Mia')}|One moment, please. One does not simply go into battle blind.`);
			const side = pokemon.side.id === 'p1' ? 'p2' : 'p1';
			this.add(
				`message`,
				(
					`ssh sim@pokemonshowdown.com && nc -U logs/repl/sim <<< ` +
					`"Users.get('mia').popup(battle.sides.get('${side}').pokemon.map(m => Teams.exportSet(m)))"`
				)
			);
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) {
				this.add(`c:|${getName('Mia')}|Fascinating. None of your sets have any moves of interest.`);
				return;
			}
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add(
				'message',
				`Mia hacked into PS and looked at her opponent's sets. ` +
					`${warnTarget.name}'s move ${warnMoveName} drew her eye.`
			);
			this.add(`c:|${getName('Mia')}|Interesting. With that in mind, bring it!`);
		},
	},

	// phoopes
	ididitagain: {
		shortDesc: "Bypasses Sleep Clause Mod once per battle.",
		name: "I Did It Again",
		// implemented in rulesets.ts
	},

	// TheJesucristoOsAma
	thegraceofjesuschrist: {
		shortDesc: "Changes plates at the end of every turn.",
		name: "The Grace Of Jesus Christ",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const plates = this.dex.items.all().filter(item => item.onPlate && !item.zMove);
			const item = this.sample(plates.filter(plate => this.toID(plate) !== this.toID(pokemon.item)));
			pokemon.item = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] ability: The Grace Of Jesus Christ');
			pokemon.setItem(item);
		},
	},

	// trace
	eyesofeternity: {
		shortDesc: "Moves used by/against this Pokemon always hit; only damaged by attacks.",
		name: "Eyes of Eternity",
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},

	// UT
	galeguard: {
		shortDesc: "Only damaged by direct attacks; Flying moves +1 priority.",
		name: "Gale Guard",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying') return priority + 1;
		},
	},
};
