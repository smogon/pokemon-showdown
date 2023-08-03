export const Abilities: {[k: string]: ModdedAbilityData} = {
	angerpoint: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				this.boost({atk: 12}, target, target);
			} else if (move?.effectType === 'Move') {
				this.boost({atk: 1}, target, target);
			}
		},		
	},
	battlearmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Battle Armor weaken')
			return this.chainModify(0.9)
		}
	},
	blaze: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Blaze boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Blaze boost');
					return this.chainModify(1.2);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Blaze boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Blaze boost');
					return this.chainModify(1.2);
				}
			}
		},
	},
	colorchange: {
		onFoePrepareHit(source, target, move) {
			let bestType;
			let bestTypeMod = 0;
			let typeMod;
			for (const type of this.dex.types.all()) {
				if (!this.dex.getImmunity(move.type, type.id)) {
					//breaks, as immunity is strongest resistance possible
					bestType = type.name;
					break;
				}
				typeMod = this.dex.getEffectiveness(move.type, type.name);
				if (typeMod < bestTypeMod) {
					bestType = type.name;
					bestTypeMod = typeMod
				}
			}
			if (bestType && !target.getTypes().includes(bestType)) {
				if (!target.setType(bestType)) return;
				this.add('-start', target, 'typechange', bestType, '[from] ability: Color Change');
			}


			
		},
		name: "Color Change",
		rating: 5,
		num: 16,
	},
	corrosion: {
		inherit: true,
		onModifyMove(move, source, target) {
			move.onEffectiveness = () => {
					if (move.type !== 'Poison') return;
					if (!target) return; // avoid crashing when called from a chat plugin
					// Super Effective if immune to poison and is Steel-type
					if (!target.runImmunity('Poison')) {
						if (target.hasType('Steel')) return 1;
					}
			}
			if (!move.ignoreImmunity) {
				move.ignoreImmunity = {'Poison': true}
			}
		},
	},
	flamebody: {
		inherit: true,
		onModifyMove(move) {
			if (!move?.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'brn',
				ability: this.dex.abilities.get('flamebody'),
			});
		},
	},
	flareboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
	},
	friendguard: {
		inherit: true,
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.5);
			}
		},
	},
	hypercutter: {
		inherit: true,
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
	},
	illuminate: {
		inherit: true,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			return accuracy + 20;
		}
	},
	illusion: {
		inherit: true,
		onBasePower(power, source) {
			if (source.illusion) {
				this.debug('Illusion - power boost');
				return this.chainModify([5325, 4096]);
			}
		}
	},
	immunity: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison') {
				this.debug('Immunity Damage reduction');
				return this.chainModify(0.8);
			}
		},
	},
	innerfocus: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (move.id === 'focusblast') {
				move.accuracy = 90
			}
		},
	},
	keeneye: {
		inherit: true,
		onModifyAccuracy(accuracy) {
			return this.chainModify(1.1);
		}
	},
	levitate: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Levitate boost');
				return this.chainModify(1.25);	
				}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Levitate boost');
				return this.chainModify(1.25);	
			}
		},
	},
	limber: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return this.chainModify([2868,4096]);
			}
		},
	},
	magmaarmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' || move.type === 'Water') {
				return this.chainModify(0.7);
			}
		},
		isBreakable: true,

	},
	mountaineer: {
		inherit: true,
		isNonstandard: null,
		onTryHit(target, source, move) {
			if (move.type === 'Rock') {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
	},
	// mummy: {
	// 	inherit: true,
	// 	onDamagingHit(damage, target, source, move) {
	// 		if (target.ability === 'mummy') {
	// 			const sourceAbility = source.getAbility();
	// 			if (sourceAbility.isPermanent || sourceAbility.id === 'mummy') {
	// 				return;
	// 			}
	// 			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
	// 				const oldAbility = source.setAbility('mummy', target);
	// 				if (oldAbility) {
	// 					this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
	// 				}
	// 			}
	// 		} else {
	// 			const possibleAbilities = [source.ability, ...(source.m.innates || [])]
	// 			.filter(val => !this.dex.abilities.get(val).isPermanent && val !== 'mummy');
	// 			if (!possibleAbilities.length) return;
	// 			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
	// 				const abil = this.sample(possibleAbilities);
	// 				if (abil === source.ability) {
	// 					const oldAbility = source.setAbility('mummy', target);
	// 					if (oldAbility) {
	// 						this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
	// 					}
	// 				} else {
	// 					source.removeVolatile('ability:' + abil);
	// 					source.addVolatile('ability:mummy', source);
	// 					if (abil) {
	// 						this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(abil).name, '[of] ' + source);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	},
	// },
	// neutralizinggas: {
	// 	//TODO: Remove diabling of setter's innates
	// 	inherit: true,
	// 	// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
	// 	onPreStart(pokemon) {
	// 		this.add('-ability', pokemon, 'Neutralizing Gas');
	// 		pokemon.abilityState.ending = false;
	// 		// Remove setter's innates before the ability starts
	// 		if (pokemon.m.innates) {
	// 			for (const innate of pokemon.m.innates) {
	// 				if (this.dex.abilities.get(innate).isPermanent || innate === 'neutralizinggas') continue;
	// 				pokemon.removeVolatile('ability:' + innate);
	// 			}
	// 		}
	// 		for (const target of this.getAllActive()) {
	// 			if (target.illusion) {
	// 				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
	// 			}
	// 			if (target.volatiles['slowstart']) {
	// 				delete target.volatiles['slowstart'];
	// 				this.add('-end', target, 'Slow Start', '[silent]');
	// 			}
	// 			if (target.m.innates) {
	// 				for (const innate of target.m.innates) {
	// 					if (this.dex.abilities.get(innate).isPermanent) continue;
	// 					target.removeVolatile('ability:' + innate);
	// 				}
	// 			}
	// 		}
	// 	},
	// 	onEnd(source) {
	// 		this.add('-end', source, 'ability: Neutralizing Gas');
			
	// 		// FIXME this happens before the pokemon switches out, should be the opposite order.
	// 		// Not an easy fix since we cant use a supported event. Would need some kind of special event that
	// 		// gathers events to run after the switch and then runs them when the ability is no longer accessible.
	// 		// (If you're tackling this, do note extreme weathers have the same issue)
			
	// 		// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
	// 		if (source.abilityState.ending) return;
	// 		source.abilityState.ending = true;
	// 		const sortedActive = this.getAllActive();
	// 		this.speedSort(sortedActive);
	// 		for (const pokemon of sortedActive) {
	// 			if (pokemon !== source) {
	// 				// Will be suppressed by Pokemon#ignoringAbility if needed
	// 				this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
	// 				if (pokemon.m.innates) {
	// 					for (const innate of pokemon.m.innates) {
	// 						// permanent abilities
	// 						if (pokemon.volatiles['ability:' + innate]) continue;
	// 						pokemon.addVolatile('ability:' + innate, pokemon);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	},
	// },
	overcoat: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				this.debug('Overcoat weaken')
				return this.chainModify(0.9)
			}

		}
	},
	overgrow: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Overgrow boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Overgrow boost');
					return this.chainModify(1.2);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Overgrow boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Overgrow boost');
					return this.chainModify(1.2);
				}
			}
		}
	},
	poisontouch: {
		inherit: true,
		// Activate after Sheer Force to make interaction determistic. The ordering for this ability is
		// an arbitary decision, but is modelled on Stench, which is reflective of on-cart behaviour.
		onModifyMovePriority: -1,
	},
	powerofalchemy: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.target;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'powerofalchemy';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [
				'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard', pokemon.ability, ...(pokemon.m.innates || []),
			];
			possibleAbilities = possibleAbilities
				.filter(val => !this.dex.abilities.get(val).isPermanent && !additionalBannedAbilities.includes(val));
				if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Power of Alchemy', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:powerofalchemy");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	receiver: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.target;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'receiver';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [
				'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard', pokemon.ability, ...(pokemon.m.innates || []),
			];
			possibleAbilities = possibleAbilities
			.filter(val => !this.dex.abilities.get(val).isPermanent && !additionalBannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Receiver', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:receiver");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	rivalry: {
		inherit: true,
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				} 
			}
		},
	},
	runaway: { 
		inherit: true,
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				if (effect.id === 'stickyweb') {
					this.hint("Court Change Sticky Web counts as lowering your own Speed, and Run Away only affects stats lowered by foes.", true, source.side);
				}
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({spe: 2}, target, target, null, false, true);
			}
		},
	},
	scrappy: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', '[of] ' + target);
			}
			if (effect.name === 'Scare' && boost.spa) {
				delete boost.spa;
				this.add('-fail', target, 'unboost', 'Special Attack', '[from] ability: Scrappy', '[of] ' + target);
			}
		}
	},
	shellarmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Shell Armor weaken')
			return this.chainModify(0.9)
		}
	},
	static: {
		inherit: true,
		onModifyMove(move) {
			if (!move?.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'par',
				ability: this.dex.abilities.get('static'),
			});
		},
	},
	swarm: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Swarm boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Swarm boost');
					return this.chainModify(1.2);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Bug') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Swarm boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Swarm boost');
					return this.chainModify(1.2);
				}
			}
		}
	},
	terravolt: {
		inherit: true,
		onStart(pokemon) {
			this.add('-start', pokemon, 'typeadd', 'Electric', '[from] ability: Terravolt');
		},
	},
	torrent: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Torrent boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Torrent boost');
					return this.chainModify(1.2);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Torrent boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Torrent boost');
					return this.chainModify(1.2);
				}
			}
		}
	},
	toxicboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				return false;
			}
		},
	},
	//*** Pokebilities Trace - Commented just in case */
	// trace: {
		// 	inherit: true,
		// 	onUpdate(pokemon) {
			// 		if (!pokemon.isStarted) return;
			// 		const isAbility = pokemon.ability === 'trace';
	// 		const possibleTargets: Pokemon[] = [];
	// 		for (const target of pokemon.side.foe.active) {
	// 			if (target && !target.fainted) {
	// 				possibleTargets.push(target);
	// 			}
	// 		}
	// 		while (possibleTargets.length) {
	// 			const rand = this.random(possibleTargets.length);
	// 			const target = possibleTargets[rand];
	// 			let possibleAbilities = [target.ability];
	// 			if (target.m.innates) possibleAbilities.push(...target.m.innates);
	// 			const additionalBannedAbilities = [
	// 				// Zen Mode included here for compatability with Gen 5-6
	// 				'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode', pokemon.ability, ...(pokemon.m.innates || []),
	// 			];
	// 			possibleAbilities = possibleAbilities
	// 				.filter(val => !this.dex.abilities.get(val).isPermanent && !additionalBannedAbilities.includes(val));
	// 			if (!possibleAbilities.length) {
	// 				possibleTargets.splice(rand, 1);
	// 				continue;
	// 			}
	// 			const ability = this.dex.abilities.get(this.sample(possibleAbilities));
	// 			this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
	// 			if (isAbility) {
	// 				pokemon.setAbility(ability);
	// 			} else {
	// 				pokemon.removeVolatile("ability:trace");
	// 				pokemon.addVolatile("ability:" + ability, pokemon);
	// 			}
	// 			return;
	// 		}
	// 	},
	// },
	turboblaze: {
		inherit: true,
		onStart(pokemon) {
			this.add('-start', pokemon, 'typeadd', 'Fire', '[from] ability: Turboblaze');
		},
	},
	// wanderingspirit: {
	// 	inherit: true,
	// 	onDamagingHit(damage, target, source, move) {
	// 		const isAbility = target.ability === 'wanderingspirit';
	// 		const additionalBannedAbilities = ['hungerswitch', 'illusion', 'neutralizinggas', 'wonderguard'];
	// 		if (isAbility) {
	// 			if (source.getAbility().isPermanent || additionalBannedAbilities.includes(source.ability) ||
	// 				target.volatiles['dynamax']
	// 			) {
	// 				return;
	// 			}

	// 			if (this.checkMoveMakesContact(move, source, target)) {
	// 				const sourceAbility = source.setAbility('wanderingspirit', target);
	// 				if (!sourceAbility) return;
	// 				if (target.isAlly(source)) {
	// 					this.add('-activate', target, 'Skill Swap', '', '', '[of] ' + source);
	// 				} else {
	// 					this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', '[of] ' + source);
	// 				}
	// 				target.setAbility(sourceAbility);
	// 			}
	// 		} else {
	// 			// Make Wandering Spirit replace a random ability
	// 			const possibleAbilities = [source.ability, ...(source.m.innates || [])]
	// 				.filter(val => !this.dex.abilities.get(val).isPermanent && !additionalBannedAbilities.includes(val));
	// 			if (!possibleAbilities.length || target.volatiles['dynamax']) return;
	// 			if (move.flags['contact']) {
	// 				const sourceAbility = this.sample(possibleAbilities);
	// 				if (sourceAbility === source.ability) {
	// 					if (!source.setAbility('wanderingspirit', target)) return;
	// 				} else {
	// 					source.removeVolatile('ability:' + sourceAbility);
	// 					source.addVolatile('ability:wanderingspirit', source);
	// 				}
	// 				if (target.isAlly(source)) {
	// 					this.add('-activate', target, 'Skill Swap', '', '', '[of] ' + source);
	// 				} else {
	// 					this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', '[of] ' + source);
	// 				}
	// 				if (sourceAbility === source.ability) {
	// 					target.setAbility(sourceAbility);
	// 				} else {
	// 					target.removeVolatile('ability:wanderingspirit');
	// 					target.addVolatile('ability:' + sourceAbility, target);
	// 				}
	// 			}
	// 		}
	// 	},
	// },
	waterveil: {
		inherit: true,
		onStart(source) {
			this.add('-activate', source, 'ability: Water Veil');
			source.addVolatile('aquaring', source, source.getAbility());

		}
	},
};
