import { TriumvirateModeTrivia } from "../../../server/chat-plugins/trivia/trivia";

export const Abilities: {[k: string]: ModdedAbilityData} = {
	angerpoint: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				this.boost({atk: 12}, target, target);
			} 
		},
		onDamagingHit(damage, target, source, move) {
			if (damage && move?.effectType === 'Move') {
				this.boost({atk: 1}, target, target);
			}
		},
		desc: "This Pokemon's Attack is raised by 1 stage when hit. If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "Ups attack on hit. If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		
	},
	battlearmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Battle Armor weaken')
			return this.chainModify(0.8)
		},
		shortDesc: "This Pokemon takes 20% less damage. Cannot be struck by a critical hit.",
		desc: "This Pokemon takes 20% less damage. Cannot be struck by a critical hit.",
		
	},
	battlebond: {
		inherit: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Greninja-Ash', this.effect, true);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {},
	},
	baddreams: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (!target.hasAbility('sweetdreams') && (target.status === 'slp' || target.hasAbility('comatose'))) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
	},
	bigpecks: {
		inherit: true, 
		onTryBoost(boost, target, source, effect) {},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([5325, 4096]);
			}
		},
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.3.",
	},
	blaze: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move && move.type === 'Fire') {
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
			if (move && move.type === 'Fire') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Blaze boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Blaze boost');
					return this.chainModify(1.2);
				}
			}
		},
		shortDesc: "Boost Pokemon's Fire moves by 20%, 50% when below 1/3 HP",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Fire-type attack, and 1.2 otherwise.",

	},
	chlorophyll: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		desc: "If Sunny Day is active, this Pokemon's Speed is boosted by 1.5. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is boosted by 1.5.",
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
			if (source !== target && bestType && !target.getTypes().includes(bestType)) {
				if (!target.setType(bestType)) return;
				this.add('-start', target, 'typechange', bestType, '[from] ability: Color Change');
			}
		},
		desc: "This Pokemon's type changes to one that best resists an incoming move, unless that type is already one of its types. This effect applies right before an incoming hit.",
		shortDesc: "This Pokemon's type changes to the type that best resists an incoming move unless it has that type.",
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
		shortDesc: "This Pokemon can poison or badly poison a Pokemon regardless of its typing. Poison hits Steel super effectively",
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
		shortDesc: "Contact moves used by or against this Pokemon have a 30% chance to burn the opponent.",
	},
	flareboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5. Immune to burn damage",
		shortDesc: "While this Pokemon is burned, its special attacks have 1.5x power. Immune to burn damage.",

	},
	friendguard: {
		inherit: true,
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "This Pokemon's allies receive 1/2 damage from other Pokemon's attacks.",
	},
	heatproof: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return false;
			}
		},
		desc: "The power of Fire-type attacks against this Pokemon is halved. This Pokemon takes no burn damage and ignores burn's damage reduction.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is halved; no burn damage.",
	},
	hypercutter: {
		inherit: true,
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage. This Pokemon's critical hit ratio is raised by 1 stage.",

	},
	illuminate: {
		inherit: true,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			return this.chainModify(1.2);
		},
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.2.",
	},
	illusion: {
		inherit: true,
		onBasePower(power, source) {
			if (source.illusion) {
				this.debug('Illusion - power boost');
				return this.chainModify([5325, 4096]);
			}
		},

		onBeforeMega(pokemon) {
			this.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
		},
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon. This Pokemon's attacks deal 30% more damage while under Illusion",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage. 30% more damage while Illusion persists.",

	},
	immunity: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison') {
				this.debug('Immunity Damage reduction');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it. Half damage from Poison",
	},
	innerfocus: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (move.id === 'focusblast') {
				move.accuracy = 90
			}
		},
		desc: "This Pokemon cannot be made to flinch. This Pokemon is immune to the effect of the Intimidate and Scare Abilities. The Accuracy of this Pokemon's Focus Blast becomes 90%.",
		shortDesc: "This Pokemon cannot be made to flinch. Immune to Intimidate and Scare. Focus Blast's Accuracy becomes 90",

	},
	intrepidsword: {
		inherit: true,
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
		},
		rating: 4,
	},
	ironfist: {
		inherit: true,
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify([5325, 4096]);
			}
		},
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power. Sucker Punch is not boosted.",

	},
	hustle: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifySpA(spa) {
			return this.modify(spa, 1.4);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category !== 'Status' && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
		desc: "This Pokemon's Attack & Special Attack is multiplied by 1.4 and the accuracy of its physical attacks is multiplied by 0.8.",
		shortDesc: "This Pokemon deals 1.4x more damage but accuracy of its attacks is 0.8x.",

	},
	keeneye: {
		inherit: true,
		onModifyAccuracy(accuracy) {
			return this.chainModify(1.2);
		},
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage. This Pokemon has their Accuracy multiplied by 1.2",
		shortDesc: "20% accuracy boost. This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
		
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
		desc: "This Pokemon is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability. The effects of Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity. Thousand Arrows can hit this Pokemon as if it did not have this Ability. While levitating, the power of this Pokemon's Flying-type moves are multiplied by 1.25",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it. 25% boost to Flying moves",
	},
	libero: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		onSwitchIn() {},
		rating: 4.5,
	},
	lightningrod: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (target.getStat('atk') > target.getStat('spa')) {
					if (!this.boost({atk: 1})) {
						this.add('-immune', target, '[from] ability: Lightning Rod');
					}
				} else {
					if (!this.boost({spa: 1})) {
						this.add('-immune', target, '[from] ability: Lightning Rod');
					}
				}
				return null;
				}
			},
			desc: "This Pokemon is immune to Electric-type moves and raises its Highest attack by 1 stage when hit by a Grass-type move.",
			shortDesc: "This Pokemon's Highest attack is raised 1 stage if hit by an Electic move; Electric immunity.",
	},
	limber: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return this.chainModify(1.5);
			}
		},
		shortDesc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it. Takes 30% less recoil damage.",
	},
	longreach: { 
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (move.flags['contact']) {
				delete move.flags['contact'];
			}
		},
		onBasePower(bp, source, target, move) {
			const unmodifiedMove = this.dex.moves.get(move);
			//In ER, this boost only applies to Physical moves. Sorry, Vacuum Wave
			if (!unmodifiedMove.flags['contact'] && unmodifiedMove.category === 'Physical') {
				return this.chainModify(1.2);
			}
		},
		shortDesc: "This pokemon makes no contact. Contactless moves boosted by 1.2",
	},
	magmaarmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' || move.type === 'Water') {
				return this.chainModify(0.7);
			}
		},
		isBreakable: true,
		shortDesc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it. 30% less damage from Ice and Water attacks",

	},
	merciless: {
		inherit: true,
		onModifyCritRatio(critRatio, source, target) {
			if (target && ['psn', 'tox', 'par'].includes(target.status) || target.boosts['spe'] < 0) return 5;
		},
		shortDesc: "All attacks crit foes who are Poisoned, Paralyzed, or with hindered speed.",
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
		shortDesc: "This Pokemon takes no damage from Stealth Rock; Rock Immunity",
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
	neutralizinggas: {
		//TODO: Remove diabling of setter's innates
		inherit: true,
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			// Remove setter's innates before the ability starts
			if (pokemon.m.innates) {
				for (const innate of pokemon.m.innates) {
					if (this.dex.abilities.get(innate).isPermanent || innate === 'neutralizinggas') continue;
					pokemon.removeVolatile('ability:' + innate);
				}
			}
			for (const target of this.getAllActive()) {
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (target.m.innates) {
					for (const innate of target.m.innates) {
						if (this.dex.abilities.get(innate).isPermanent) continue;
						target.removeVolatile('ability:' + innate);
					}
				}
			}
		},
		onEnd(source) {
			this.add('-end', source, 'ability: Neutralizing Gas');
			
			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)
			
			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.m.innates) {
						for (const innate of pokemon.m.innates) {
							// permanent abilities
							if (pokemon.volatiles['ability:' + innate]) continue;
							pokemon.addVolatile('ability:' + innate, pokemon);
						}
					}
				}
			}
		},
	},
	overcoat: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				this.debug('Overcoat weaken')
				return this.chainModify(0.8)
			}
		},
		desc: "This Pokemon is immune to powder moves, damage from Sandstorm, and the effects of Rage Powder and the Effect Spore Ability. This Pokemon takes 10% less damage from Special attacks",
		shortDesc: "This Pokemon is immune to powder moves, Sandstorm damage, and Effect Spore. 20% less damage from Special attacks",
	},
	overgrow: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move && move.type === 'Grass') {
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
			if (move && move.type === 'Grass') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Overgrow boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Overgrow boost');
					return this.chainModify(1.2);
				}
			}
		},
		shortDesc: "Boost Pokemon's Grass moves by 20%, 50% when below 1/3 HP",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Grass-type attack, and 1.2 otherwise.",
	},
	pickup: {
		inherit: true,
		onStart(pokemon) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] ability: Pickup', '[of] ' + pokemon);
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
	protean: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		onSwitchIn() {},
		rating: 4.5,
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
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets.",
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
		desc: "This Pokemon's Speed is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Speed is raised by 2 for each of its stats that is lowered by a foe.",
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		desc: "If Sandstorm is active, this Pokemon's Speed is boosted by 1.5. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is boosted by 1.5; immunity to Sandstorm.",
		
	},
	sapsipper: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (target.getStat('atk') > target.getStat('spa')) {
					if (!this.boost({atk: 1})) {
						this.add('-immune', target, '[from] ability: Sap Sipper');
					}
				} else {
					if (!this.boost({spa: 1})) {
						this.add('-immune', target, '[from] ability: Sap Sipper');
					}
				}
				return null;
				}
			},
		onAllyTryHitSide(target, source, move) {
			if (source === this.effectState.target || !target.isAlly(source)) return;
			if (move.type === 'Grass') {
				if (target.getStat('atk') > target.getStat('spa')) this.boost({atk: 1}, this.effectState.target);
				else this.boost({spa: 1}, this.effectState.target);
				
			}
		},
		desc: "This Pokemon is immune to Grass-type moves and raises its Highest attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Highest attack is raised 1 stage if hit by a Grass move; Grass immunity.",
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
		},
		desc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves. This Pokemon is immune to the effect of the Intimidate and Scare Abilities.",
		shortDesc: "Fighting, Normal moves hit Ghost. Immune to Intimidate and Scare.",
	},
	shellarmor: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Shell Armor weaken')
			return this.chainModify(0.9)
		},
		shortDesc: "This Pokemon takes 10% less damage. Cannot be struck by a critical hit.",
		desc: "This Pokemon takes 10% less damage. Cannot be struck by a critical hit.",

	},
	slushrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(1.5);
			}
		},
		desc: "If Hail is active, this Pokemon's Speed is boosted by 1.5. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's Speed is boosted by 1.5; immunity to Hail.",
		
	},
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
		rating: 4,
	},
	solarpower: {
		inherit: true,
		onWeather() {},
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
		shortDesc: "Contact moves used by or against this Pokemon have a 30% chance to paralyze the opponent.",
	},
	stormdrain: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (target.getStat('atk') > target.getStat('spa')) {
					if (!this.boost({atk: 1})) {
						this.add('-immune', target, '[from] ability: Storm Drain');
					}
				} else {
					if (!this.boost({spa: 1})) {
						this.add('-immune', target, '[from] ability: Storm Drain');
					}
				}
				return null;
				}
			}
	},
	surgesurfer: {
		inherit: true,
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is boosted by 1.5.",

	},
	swarm: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move && move.type === 'Bug') {
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
			if (move && move.type === 'Bug') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Swarm boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Swarm boost');
					return this.chainModify(1.2);
				}
			}
		},
		shortDesc: "Boost Pokemon's Bug moves by 20%, 50% when below 1/3 HP",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Bug-type attack, and 1.2 otherwise.",

	},
	swiftswim: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		desc: "If Rain Dance is active, this Pokemon's Speed is boosted by 1.5. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is boosted by 1.5.",
	},
	teravolt: {
		inherit: true,
		onStart(pokemon) {
			if (!pokemon.types.includes('Electric')) {
				if (!pokemon.addType('Electric')) return;
				this.add('-start', pokemon, 'typeadd', 'Electric', '[from] ability: Teravolt');
			}
		},
		desc: "On switch-in, This Pokemon gains the Electric type in addition to its current typing. Moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		shortDesc: "This Pokemon gains the Electric Type and its moves and their effects ignore the Abilities of other Pokemon.",

	},
	torrent: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move && move.type === 'Water') {
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
			if (move && move.type === 'Water') {
				if (attacker.hp <= attacker.maxhp / 3) {
					this.debug('Full Torrent boost');
					return this.chainModify(1.5);	
				} else {
					this.debug('Lite Torrent boost');
					return this.chainModify(1.2);
				}
			}
		},
		shortDesc: "Boost Pokemon's Water moves by 20%, 50% when below 1/3 HP",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Water-type attack, and 1.2 otherwise.",

	},
	toxicboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				return false;
			}
		},
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5. This Pokemon takes no damage from the effects of Poison or Toxic.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 1.5x power. Immune to Poison and Toxic status damage",

	},
	toxicdebris: {
		inherit: true,
		isNonstandard: null,
		gen: 8
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
	triage: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.flags['heal']) return priority + 1;
		},
	},
	turboblaze: {
		inherit: true,
		onStart(pokemon) {
			if (!pokemon.types.includes('Fire')) {
				if (!pokemon.addType('Fire')) return;
				this.add('-start', pokemon, 'typeadd', 'Fire', '[from] ability: Turboblaze');
			}
		},
		desc: "On switch-in, This Pokemon gains the Fire type in addition to its current typing. Moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		shortDesc: "This Pokemon gains the Fire Type and its moves and their effects ignore the Abilities of other Pokemon.",

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
	victorystar: {
		inherit: true,
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				return this.chainModify([4915, 4096]);
			}
		},
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.2.",

	},
	waterveil: {
		inherit: true,
		onStart(source) {
			this.add('-activate', source, 'ability: Water Veil');
			source.addVolatile('aquaring', source, source.getAbility());
		},
		name: "Water Veil",
		shortDesc: "Summons Aqua Ring on switch-in. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
	},
};
