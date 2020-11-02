export const Abilities: {[k: string]: ModdedAbilityData} = {
	anticipation: {
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move and raises Speed by one stage.",
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
						move.ohko
					) {
						this.add('-ability', pokemon, 'Anticipation');
						this.boost({spe: 1}, pokemon);
						return;
					}
				}
			}
		},
		name: "Anticipation",
	},
	damp: {
		shortDesc: "Summons Water Sport and Mud Sport upon switching in.",
		name: "Damp",
		onStart() {
			this.field.addPseudoWeather('mudsport');
			this.field.addPseudoWeather('watersport');
		},
	},
	healer: {
		shortDesc: "Heals the user and its allies by 1/16 of their maximum HP at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return;
			for (const ally of pokemon.side.active) {
				this.heal(ally.maxhp / 16);
			}
		},
		onTerrain(pokemon) {
			if (!this.field.isTerrain('grassyterrain')) return;
			for (const ally of pokemon.side.active) {
				this.heal(ally.maxhp / 16);
			}
		},
		name: "Healer",
	},
	illuminate: {
		shortDesc: "Halves damage from Dark and Ghost type moves.",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Illuminate weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Illuminate weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Illuminate",
	},
	stench: {
		shortDesc: "Immunity to Fairy-type moves.",
		onTryHit(pokemon, target, move) {
			if (move.type === 'Fairy') {
				this.add('-immune', pokemon, '[from] ability: Stench');
				return null;
			}
		},
		name: "Stench",
	},
	telepathy: {
		shortDesc: "This Pokemon's Normal-type moves become Psychic-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Psychic';
				// @ts-ignore
				move.telepathyBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			// @ts-ignore
			if (move.telepathyBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Telepathy",
	},
	shellarmor: {
		shortDesc: "No status = all moves hit target on Defense. Use Shell Smash = change abil to Weak Armor.",
		onModifyMove(move, pokemon, target) {
			if (!pokemon.status) move.defensiveCategory = "Physical";
		},
		onAfterMove(pokemon, target, move) {
			if (move.id === 'shellsmash') {
				pokemon.setAbility('weakarmor');
				this.add('-message', `${pokemon.name}'s ability changed to Weak Armor!`);
			}
		},
		name: "Shell Armor",
	},
	battery: {
		shortDesc: "On switch in, this Pokemon and its allies use Charge.",
		onStart(source) {
			for (const ally of source.side.active) {
				this.useMove('charge', ally);
			}
		},
		name: "Battery",
	},
	klutz: {
		shortDesc: "This Pokemon's contact moves remove the target's item. This Pokemon loses its item upon being hit.",
		onAfterMove(attacker, defender, move) {
			if (attacker.hp && move.flags['contact']) {
				const item = defender.takeItem();
				if (item) {
					this.add('-enditem', defender, item.name, '[from] ability: Klutz', '[of] ' + attacker);
				}
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (target.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] ability: Klutz', '[of] ' + target);
				}
			}
		},
		name: "Klutz",
	},
	ironfist: {
		shortDesc: "This Pokemon's punch moves are super effective against Fairy-types.",
		onFoeEffectiveness(typeMod, target, type, move) {
			if (move.flags['punch'] && target?.hasType('Fairy')) return 1;
		},
		name: "Iron Fist",
	},
	receiver: {
		shortDesc: "Permanently copies the ability of the ally that fainted before switching in.",
		onStart(source) {
			if (source.side.faintedThisTurn) {
				const fainted = source.side.faintedThisTurn;
				const bannedAbilities = [
					'battlebond', 'comatose', 'disguise', 'download', 'flowergift', 'forecast', 'gorillatactics', 'gulpmissile', 'hugepower', 'hungerswitch', 'hustle', 'iceface', 'illusion', 'intrepidsword', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'purepower', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode',
				];
				if (bannedAbilities.includes(this.toID(fainted.ability))) return;
				source.setAbility(fainted.ability);
				source.baseAbility = fainted.baseAbility;
				source.ability = fainted.ability;
				this.add('-message', `${source.name} received ${fainted.name}'s ability!`);
			}
		},
		name: "Receiver",
	},
	sweetveil: {
		shortDesc: "On switch-in, this Pokemon's side gets a side condition that heals any active Pokemon by 1/16.",
		onStart(source) {
			source.side.addSideCondition('sweetveilscreen');
		},
		name: "Sweet Veil",
	},
	mummy: {
		shortDesc: "Gives all active Pokemon the Heal Block effect upon switching in.",
		onStart() {
			for (const poke of this.getAllActive()) {
				poke.addVolatile('healblock');
			}
		},
		name: "Mummy",
	},
	runaway: {
		shortDesc: "This Pokemon immediately switches out if an opponent with a super effective/OHKO move switches in.",
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
						move.ohko
					) {
						this.add('-ability', pokemon, 'Run Away');
						pokemon.switchFlag = true;
						return;
					}
				}
			}
		},
		onFoeSwitchIn(pokemon) {
			if (!pokemon || pokemon.fainted) return;
			const me = pokemon.side.foe.active.filter(x => x.getAbility().id === 'runaway')[0];
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.getMove(moveSlot.move);
				if (move.category === 'Status') continue;
				const moveType = move.id === 'hiddenpower' ? pokemon.hpType : move.type;
				if (
					this.dex.getImmunity(moveType, me) && this.dex.getEffectiveness(moveType, me) > 0 ||
					move.ohko
				) {
					this.add('-ability', me, 'Run Away');
					me.switchFlag = true;
					return;
				}
			}
		},
		name: "Run Away",
	},
	tangledfeet: {
		shortDesc: "This Pokemon's first move will have +1 priority until the end of the turn.",
		onModifyPriority(priority, source, target, move) {
			if (source.activeMoveActions > 0) return priority;
			return move.priority + 1;
		},
		name: "Tangled Feet",
	},
};
