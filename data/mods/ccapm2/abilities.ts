export const Abilities: {[k: string]: ModdedAbilityData} = {
	triggerfinger: {
		shortDesc: "When the Pokemon enters, its first move has +1 priority, but that move's damage is reduced by 1/3.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Trigger Finger');
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.activeMoveActions < 1) {
				return priority + 1;
			}
		},
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.activeMoveActions < 1) {
				return this.chainModify(0.667);
			}
		},
		name: "Trigger Finger",
		rating: 4,
		num: 99991,
	},
	elemental: {
		desc: "The Pokemon is immune to moves of its own types.",
		shortDesc: "The Pokemon is immune to moves of its own types.",
		onTryHit(target, source, move) {
			if (target !== source && target.types.includes(move.type)) {
				this.add('-immune', target, '[from] ability: Elemental');
				return null;
			}
		},
		name: "Elemental",
		rating: 3.5,
		num: 99992,
	},
	embargoact: {
		shortDesc: "As long as the Pokemon is on the field, its opponent's item does not function.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Embargo Act');
		},
		// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		onResidualOrder: 18,
		name: "Embargo Act",
		num: 99993,
	},
	terror: {
		shortDesc: "When the Pokemon enters, its opponent's Speed is reduced by one stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Terror', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spe: -1}, target, pokemon, null, true);
				}
			}
		},
		name: "Terror",
		num: 99994,
	},
	adaptive: {
		shortDesc: "After taking damage (except passive damage such as burns), the Pokemon's HP is restored by 1/8 of the damage taken.",
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Status') {
				this.heal(damage / 4, target);
			}
		},
		name: "Adaptive",
		num: 99995,
	},
	exhaust: {
		desc: "The Pokemon's attacking moves consume 2 PP instead of 1, but their damage is increased by 20%..",
		shortDesc: "The Pokemon's attacking moves consume 2 PP instead of 1, but their damage is increased by 20%..",
		onBasePower(basePower, attacker, defender, move) {
			return this.chainModify(1.2);
		},
		onAfterMove(target, source, move) {
			source.deductPP(move.id, 1);
		},
		name: "Exhaust",
		rating: 2.5,
		num: 99996,
	},
	forager: {
		desc: "Gluttony effect + The Pokemon recycles any Berry it has consumed when it switches out.",
		shortDesc: "Gluttony effect + The Pokemon recycles any Berry it has consumed when it switches out.",
		name: "Forager",
		onSwitchOut(pokemon) {
			if (pokemon.hp && !pokemon.item && this.dex.getItem(pokemon.lastItem).isBerry) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Forager');
			}
		},
		rating: 2.5,
		num: 99997,
	},
	inextremis: {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Special Attack is raised by 1 stage. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.",
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				let statName = 'atk';
				let bestStat = 0;
				let s: StatNameExceptHP;
				for (s in target.storedStats) {
					if (target.storedStats[s] > bestStat) {
						statName = s;
						bestStat = target.storedStats[s];
					}
				}
				this.boost({[statName]: 1});
			}
		},
		name: "In Extremis",
		rating: 2.5,
		num: 99998,
	},
	prepared: {
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, Hidden Power counts as its determined type, and Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.",
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
						this.add('-ability', pokemon, 'Prepared');
						this.heal(pokemon.baseMaxhp / 4);
						return;
					}
				}
			}
		},
		name: "Prepared",
		rating: 0.5,
		num: 99999,
	},
	countershield: {
		shortDesc: "When the Pokemon is hit by a super effective move, the move's damage is reduced by 1/4, and the attacker's HP is reduced by 1/8.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Counter Shield neutralize');
				return this.chainModify(0.75);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		name: "Counter Shield",
		rating: 3,
		num: 99910,
	},
	identitytheft: {
		shortDesc: "Pokemon making contact with this Pokemon have their Ability swapped with this one.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				if (['illusion', 'neutralizinggas', 'identitytheft', 'wonderguard'].includes(target.ability)) return;
				if (move.flags['contact']) {
					const targetAbility = target.setAbility('identitytheft', source);
					if (!targetAbility) return;
					if (target.side === source.side) {
						this.add('-activate', target, 'Skill Swap', '', '', '[of] ' + source);
					} else {
						this.add('-activate', target, 'ability: Identity Theft', this.dex.getAbility(targetAbility).name, 'Identity Theft', '[of] ' + source);
					}
					source.setAbility(targetAbility);
				}
			}
		},
		name: "Identity Theft",
		rating: 2.5,
		num: 99911,
	},
	lagbehind: {
		shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
		onFractionalPriority: -0.1,
		onBasePower(basePower, attacker, defender, move) {
			return this.chainModify(1.3);
		},
		name: "Lag Behind",
		rating: -1,
		num: 99912,
	},
	survey: {
		shortDesc: "On switch-in, this Pokemon's Accuracy is raised by 1 stage.",
		onStart(pokemon) {
			this.boost({accuracy: 1}, pokemon);
		},
		name: "Survey",
		rating: 3,
		num: 99914,
	},
	contradict: {
		desc: "The physical and special categories of this pokemon's attacks are swapped.",
		shortDesc: "The physical and special categories of this pokemon's attacks are swapped",
		// This should be applied directly to the stat as opposed to chaining with the others
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Contradict');
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category === 'Status') {
				return;
			} else if (move.category === 'Physical') {
				move.category = 'Special';
			} else if (move.category === 'Special') {
				move.category = 'Physical';
			}
			if (move.self && move.self.boosts) {
				if (move.self.boosts.atk || move.self.boosts.spa) {
					const c = move.self.boosts.atk;
					move.self.boosts.atk = move.self.boosts.spa;
					move.self.boosts.spa = c;
				}
			}
		},
		name: "Contradict",
		rating: 3.5,
		num: 99915,
	},
	unflagging: {
		shortDesc: "Heals 1/16 at the end of each turn when statused and is immune to non-damage effects of status. Rest fails.",
		onDamagePriority: 1,
		onResidualOrder: 8,
		onResidual(pokemon) {
			if (pokemon.status) {
				this.heal(pokemon.baseMaxhp / 16);
			}
		},
		name: "Unflagging",
		rating: 4,
		num: 99916,
	},
};
