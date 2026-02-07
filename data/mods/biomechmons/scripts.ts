import { RESTORATIVE_BERRIES } from "../../../sim/pokemon";

export const Scripts: ModdedBattleScriptsData = {
	pokemon: {
		isGrounded(negateImmunity) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball' || (this.volatiles['item:ironball'] && !this.ignoringItem())) return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			if (item === 'airballoon' || (this.volatiles['item:airballoon'] && !this.ignoringItem())) return false;
			return true;
		},
		getAbility() {
			const ability = this.battle.dex.abilities.getByID(this.ability);
			if (ability.exists) return ability;
			let abil = this.battle.dex.items.getByID(this.ability) as Item | Move;
			if (!abil.exists) abil = this.battle.dex.moves.getByID(this.ability);
			return {
				id: this.ability,
				name: abil.name || this.ability,
				flags: {},
				effectType: "Ability",
				toString() {
					return abil.name || this.id;
				},
			} as Ability;
		},
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
			const abilityid = this.battle.toID(ability);
			return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
		},
		ignoringAbility() {
			// Check if any active pokemon have the ability Neutralizing Gas
			let neutralizinggas = false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if (
					(pokemon.ability === ('neutralizinggas' as ID) ||
						(pokemon.m.scrambled.abilities as { thing: string }[]).some(
							abils => this.battle.toID(abils.thing) === 'neutralizinggas')) &&
							!pokemon.volatiles['gastroacid'] && !pokemon.abilityState.ending
				) {
					neutralizinggas = true;
					break;
				}
			}

			return !!(
				(this.battle.gen >= 5 && !this.isActive) ||
				((this.volatiles['gastroacid'] ||
					(neutralizinggas && (this.ability !== ('neutralizinggas' as ID) ||
						(this.m.scrambled.abilities as { thing: string }[]).some(abils => this.battle.toID(abils.thing) === 'neutralizinggas'))
					)) && !this.getAbility().flags['cantsuppress']
				)
			);
		},
		setAbility(ability, source, sourceEffect, isFromFormeChange = false, isTransform = false) {
			const allThings = new Set([
				...(this.m.scrambled.abilities as { thing: string }[]).map(e => e.thing),
				...(this.m.scrambled.items as { thing: string }[]).map(e => e.thing),
				...(this.m.scrambled.moves as { thing: string }[]).map(e => e.thing),
				this.ability, ...this.moveSlots.map(e => e.move), this.item,
			].map(this.battle.toID));

			let isBMMAbil = false;
			let isOldBMMAbil = false;
			if (!this.hp) return false;
			if (typeof ability === 'string') {
				if (this.battle.dex.abilities.get(ability).exists) {
					ability = this.battle.dex.abilities.get(ability);
				} else {
					const abilString = ability;
					let abil = this.battle.dex.items.get(abilString) as Item | Move;
					if (!abil.exists) abil = this.battle.dex.moves.get(abilString);
					ability = {
						id: abil.id || abilString,
						name: abil.name || abilString,
						flags: {},
						effectType: "Ability",
						toString() {
							return abil.name || abilString;
						},
					} as Ability;
				}
			}
			if (ability.name.length && !this.battle.dex.abilities.get(ability).exists) isBMMAbil = true;
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			let oldAbility;
			if (this.battle.dex.abilities.get(this.ability).exists) {
				oldAbility = this.battle.dex.abilities.get(this.ability);
			} else {
				let abil = this.battle.dex.items.getByID(this.ability) as Item | Move;
				if (!abil.exists) {
					abil = this.battle.dex.moves.getByID(this.ability);
				} else {
					if (!this.battle.runEvent('TakeItem', this, source, null, abil as Item)) return false;
				}
				oldAbility = {
					id: this.ability,
					name: abil.name || this.ability,
					flags: {},
					effectType: "Ability",
					toString() {
						return abil.name || this.id;
					},
				} as Ability;
				isOldBMMAbil = true;
			}

			if (allThings.has(ability.id)) return false;

			if (!isFromFormeChange) {
				if (ability.flags['cantsuppress'] || this.getAbility().flags['cantsuppress']) return false;
			}
			if (!isFromFormeChange && !isTransform) {
				const setAbilityEvent: boolean | null = this.battle.runEvent('SetAbility', this, source, sourceEffect, ability);
				if (!setAbilityEvent) return setAbilityEvent;
			}
			this.battle.singleEvent('End', oldAbility, this.abilityState, this, source);
			if (isOldBMMAbil) {
				const isItem = (this.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					this.removeVolatile('item:' + this.battle.toID(this.m.scrambled.items[isItem].thing));
					this.m.scrambled.items.splice(isItem, 1);
				} else if ((this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					if (!isTransform) {
						let indexOfMove = this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id);
						if (indexOfMove >= 0) this.baseMoveSlots.splice(indexOfMove, 1);
						if (oldAbility.id !== 'mimic') {
							indexOfMove = this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id);
						}
						if (indexOfMove >= 0) this.moveSlots.splice(indexOfMove, 1);
					}
					this.m.scrambled.moves.splice(isMove, 1);
				}
			}
			this.ability = ability.id;
			// ability changes are permanent in BioMechMons
			if (!isTransform && !this.transformed) this.baseAbility = ability.id;
			this.abilityState = this.battle.initEffectState({ id: ability.id, target: this });
			if (sourceEffect && !isFromFormeChange && !isTransform) {
				if (source) {
					this.battle.add('-ability', this, ability.name, oldAbility.name, `[from] ${sourceEffect.fullname}`, `[of] ${source}`);
				} else {
					this.battle.add('-ability', this, ability.name, oldAbility.name, `[from] ${sourceEffect.fullname}`);
				}
			}
			if (ability.id && this.battle.gen > 3 &&
				(!isTransform || oldAbility.id !== ability.id || this.battle.gen <= 4)) {
				this.battle.singleEvent('Start', ability, this.abilityState, this, source);
			}
			if (isBMMAbil) {
				if (this.battle.dex.items.get(ability.id).exists) {
					this.m.scrambled.items.push({ thing: ability.id, inSlot: 'Ability' });
					const effect = 'item:' + this.battle.toID(ability.id);
					this.addVolatile(effect);
					this.volatiles[effect].inSlot = 'Ability';
				} else {
					this.m.scrambled.moves.push({ thing: ability.id, inSlot: 'Ability' });
					const move = Dex.moves.get(ability.id);
					const newMove = {
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					if (!isTransform) {
						this.baseMoveSlots.push(newMove);
						this.moveSlots.push(newMove);
					}
				}
			}
			return oldAbility.id;
		},
		getItem() {
			const item = this.battle.dex.items.getByID(this.item);
			if (item.exists) return item;
			let bmmItem = this.battle.dex.abilities.getByID(this.item) as Ability | Move;
			if (!bmmItem.exists) bmmItem = this.battle.dex.moves.getByID(this.item);
			return {
				id: this.item,
				name: bmmItem.name || this.name,
				effectType: "Item",
				toString() {
					return bmmItem.name || this.id;
				},
			} as Item;
		},
		hasItem(item) {
			if (this.ignoringItem()) return false;
			if (Array.isArray(item)) return item.some(i => this.hasItem(i));
			const itemId = this.battle.toID(item);
			return this.item === itemId || !!this.volatiles['item:' + itemId];
		},
		takeItem(source) {
			if (!this.item) return false;
			if (!source) source = this;
			if (this.battle.gen <= 4) {
				if (source.itemKnockedOff) return false;
				if (this.battle.toID(this.ability) === 'multitype' || (this.m.scrambled.abilities as { thing: string }[])
					.findIndex(e => this.battle.toID(e.thing) === 'multitype') >= 0) {
					return false;
				}
				if (this.battle.toID(source.ability) === 'multitype' || (source.m.scrambled.abilities as { thing: string }[])
					.findIndex(e => this.battle.toID(e.thing) === 'multitype') >= 0) {
					return false;
				}
			}
			const item = this.getItem();
			if (this.battle.runEvent('TakeItem', this, source, null, item)) {
				this.item = '';
				let wrongSlot = (this.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
				if (wrongSlot >= 0) {
					const dexAbil = this.battle.dex.abilities.get(this.m.scrambled.abilities[wrongSlot].thing);
					if (dexAbil.flags['failskillswap']) return false;
					this.removeVolatile('ability:' + this.battle.toID(this.m.scrambled.abilities[wrongSlot].thing));
					this.m.scrambled.abilities.splice(wrongSlot, 1);
				} else if ((this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
					wrongSlot = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					let indexOfMove = this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[wrongSlot].thing) === m.id);
					if (indexOfMove >= 0) this.baseMoveSlots.splice(indexOfMove, 1);
					if (item.id !== 'mimic') {
						indexOfMove = this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[wrongSlot].thing) === m.id);
					}
					if (indexOfMove >= 0) this.moveSlots.splice(indexOfMove, 1);
					this.m.scrambled.moves.splice(wrongSlot, 1);
				}
				const oldItemState = this.itemState;
				this.battle.clearEffectState(this.itemState);
				this.pendingStaleness = undefined;
				this.battle.singleEvent('End', item, oldItemState, this);
				this.battle.runEvent('AfterTakeItem', this, null, null, item);
				return item;
			}
			return false;
		},
		setItem(item, source, effect) {
			const allThings = new Set([
				...(this.m.scrambled.abilities as { thing: string }[]).map(e => e.thing),
				...(this.m.scrambled.items as { thing: string }[]).map(e => e.thing),
				...(this.m.scrambled.moves as { thing: string }[]).map(e => e.thing),
				this.ability, ...this.moveSlots.map(e => e.move), this.item,
			].map(this.battle.toID));

			let isBMMItem = false;
			let isOldBMMItem = false;
			if (!this.hp || !this.isActive) return false;
			if (typeof item === 'string') {
				if (!item.length || this.battle.dex.items.get(item).exists) {
					item = this.battle.dex.items.get(item);
				} else {
					const itemString = item;
					let newData = this.battle.dex.abilities.get(itemString) as Ability | Move;
					if (!newData.exists) {
						newData = this.battle.dex.moves.get(itemString);
					} else {
						if ((newData as Ability).flags['failskillswap']) return false;
					}
					item = {
						id: newData.id || itemString,
						name: newData.name || itemString,
						effectType: "Item",
						toString() {
							return newData.name || itemString;
						},
					} as Item;
				}
			}
			if (item.name.length && !this.battle.dex.items.get(item).exists) isBMMItem = true;
			if (allThings.has(item.id)) return false;
			const effectid = this.battle.effect ? this.battle.effect.id : '';
			if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
				const inflicted = ['trick', 'switcheroo'].includes(effectid);
				const external = inflicted && source && !source.isAlly(this);
				this.pendingStaleness = external ? 'external' : 'internal';
			} else {
				this.pendingStaleness = undefined;
			}
			const oldItem = this.getItem();
			if (!this.battle.dex.items.get(oldItem).exists) isOldBMMItem = true;
			const oldItemState = this.itemState;
			this.item = item.id;
			this.itemState = this.battle.initEffectState({ id: item.id, target: this });
			if (oldItem.exists) this.battle.singleEvent('End', oldItem, oldItemState, this);
			if (isOldBMMItem) {
				const isAbil = (this.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
				if (isAbil >= 0) {
					this.removeVolatile('ability:' + this.battle.toID(this.m.scrambled.items[isAbil].thing));
					this.m.scrambled.abilities.splice(isAbil, 1);
				} else if ((this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
					const isMove = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					let indexOfMove = this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id);
					if (indexOfMove >= 0) this.baseMoveSlots.splice(indexOfMove, 1);
					if (oldItem.id !== 'mimic') {
						indexOfMove = this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id);
					}
					if (indexOfMove >= 0) this.moveSlots.splice(indexOfMove, 1);
					this.m.scrambled.moves.splice(isMove, 1);
				}
			}
			if (item.id) {
				this.battle.singleEvent('Start', item, this.itemState, this, source, effect);
			}
			if (isBMMItem) {
				if (this.battle.dex.abilities.get(item.id).exists) {
					this.m.scrambled.abilities.push({ thing: item.id, inSlot: 'Item' });
					const abileffect = 'ability:' + this.battle.toID(item.id);
					this.addVolatile(abileffect);
					this.volatiles[abileffect].inSlot = 'Item';
				} else {
					this.m.scrambled.moves.push({ thing: item.id, inSlot: 'Item' });
					const move = Dex.moves.get(item.id);
					const newMove = {
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					this.baseMoveSlots.push(newMove);
					this.moveSlots.push(newMove);
				}
			}
			return true;
		},

		eatItem(force, source, sourceEffect) {
			const item = sourceEffect?.effectType === 'Item' ? sourceEffect :
				this.battle.effect.effectType === 'Item' ? this.battle.effect : this.getItem();
			if (!item) return false;
			if ((!this.hp && this.battle.toID(item.name) !== 'jabocaberry' && this.battle.toID(item.name) !== 'rowapberry') ||
				!this.isActive) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event?.target) source = this.battle.event.target;
			// if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// 	// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			// 	return false;
			// }
			if (
				this.battle.runEvent('UseItem', this, null, null, Dex.items.get(item.name)) &&
				(force || this.battle.runEvent('TryEatItem', this, null, null, Dex.items.get(item.name)))
			) {
				this.battle.add('-enditem', this, Dex.items.get(item.name), '[eat]');

				this.battle.singleEvent('Eat', Dex.items.get(item.name), this.itemState, this, source, sourceEffect);
				this.battle.runEvent('EatItem', this, source, sourceEffect, Dex.items.get(item.name));

				if (RESTORATIVE_BERRIES.has(item.id)) {
					switch (this.pendingStaleness) {
					case 'internal':
						if (this.staleness !== 'external') this.staleness = 'internal';
						break;
					case 'external':
						this.staleness = 'external';
						break;
					}
					this.pendingStaleness = undefined;
				}

				const isBMM = this.volatiles[item.id]?.inSlot;
				if (isBMM) {
					const dexItem = this.battle.dex.items.get(item.name);
					this.removeVolatile(item.id);
					const itemIndex = (this.m.scrambled.items as { thing: string, inSlot: string }[]).findIndex(e =>
						this.battle.toID(e.thing) === dexItem.id && e.inSlot === isBMM);
					if (itemIndex >= 0) this.m.scrambled.items.splice(itemIndex, 1);
					if (isBMM === 'Ability') this.setAbility('No Ability');
				} else {
					this.lastItem = this.item;
					this.item = '';
				}
				this.battle.clearEffectState(this.itemState);
				this.usedItemThisTurn = true;
				this.ateBerry = true;
				this.battle.runEvent('AfterUseItem', this, null, null, Dex.items.get(item.name));
				return true;
			}
			return false;
		},

		useItem(source, sourceEffect) {
			const item = sourceEffect?.effectType === 'Item' ? sourceEffect :
				this.battle.effect.effectType === 'Item' ? this.battle.effect : this.getItem();
			if ((!this.hp && !item.isGem) || !this.isActive) return false;
			if (!item) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event?.target) source = this.battle.event.target;
			// const item = this.getItem();
			// if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// 	// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			// 	return false;
			// }
			if (this.battle.runEvent('UseItem', this, null, null, Dex.items.get(item.name))) {
				switch (item.id) {
				case 'redcard':
					this.battle.add('-enditem', this, Dex.items.get(item.name), `[of] ${source}`);
					break;
				default:
					if (item.isGem) {
						this.battle.add('-enditem', this, Dex.items.get(item.name), '[from] gem');
					} else {
						this.battle.add('-enditem', this, Dex.items.get(item.name));
					}
					break;
				}
				if (item.boosts) {
					this.battle.boost(item.boosts, this, source, Dex.items.get(item.name));
				}

				this.battle.singleEvent('Use', Dex.items.get(item.name), this.itemState, this, source, sourceEffect);

				const isBMM = this.volatiles[item.id]?.inSlot;
				if (isBMM) {
					const dexItem = this.battle.dex.items.get(item.name);
					this.removeVolatile(item.id);
					const itemIndex = (this.m.scrambled.items as { thing: string, inSlot: string }[]).findIndex(e =>
						this.battle.toID(e.thing) === dexItem.id && e.inSlot === isBMM);
					if (itemIndex >= 0) this.m.scrambled.items.splice(itemIndex, 1);
					if (isBMM === 'Ability') this.setAbility('No Ability');
				} else {
					this.lastItem = this.item;
					this.item = '';
				}
				this.battle.clearEffectState(this.itemState);
				this.usedItemThisTurn = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		transformInto(pokemon, effect) {
			const species = pokemon.species;
			if (
				pokemon.fainted || this.illusion || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5) ||
				(pokemon.transformed && this.battle.gen >= 2) || (this.transformed && this.battle.gen >= 5) ||
				species.name === 'Eternatus-Eternamax' ||
				(['Ogerpon', 'Terapagos'].includes(species.baseSpecies) && (this.terastallized || pokemon.terastallized)) ||
				this.terastallized === 'Stellar'
			) {
				return false;
			}

			if (this.battle.dex.currentMod === 'gen1stadium' && (
				species.name === 'Ditto' ||
				(this.species.name === 'Ditto' && pokemon.moves.includes('transform'))
			)) {
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
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			this.timesAttacked = pokemon.timesAttacked;
			for (const moveSlot of pokemon.moveSlots) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveSlots.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.maxpp === 1 ? 1 : 5,
					maxpp: this.battle.gen >= 5 ? (moveSlot.maxpp === 1 ? 1 : 5) : moveSlot.maxpp,
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
				// we need to remove all of the overlapping crit volatiles before adding any of them
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
			if (this.terastallized) {
				this.knownType = true;
				this.apparentType = this.terastallized;
			}
			if (this.battle.gen > 2) this.setAbility(pokemon.ability, this, null, true, true);

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

			// Pokemon transformed into Ogerpon cannot Terastallize
			// restoring their ability to tera after they untransform is handled ELSEWHERE
			if (['Ogerpon', 'Terapagos'].includes(this.species.baseSpecies) && this.canTerastallize) this.canTerastallize = false;

			for (const volatile in this.volatiles) {
				if (this.volatiles[volatile].inSlot && this.volatiles[volatile].inSlot === 'Move') {
					this.removeVolatile(volatile);
				}
			}

			for (const volatile in pokemon.volatiles) {
				if (pokemon.volatiles[volatile].inSlot && pokemon.volatiles[volatile].inSlot === 'Move') {
					this.addVolatile(volatile);
					this.volatiles[volatile].inSlot = 'Move';
				}
			}

			return true;
		},
	},
	field: {
		suppressingWeather() {
			for (const pokemon of this.battle.getAllActive()) {
				const innates = Object.keys(pokemon.volatiles).filter(x => x.startsWith('ability:'));
				if (pokemon && !pokemon.ignoringAbility() &&
					(pokemon.getAbility().suppressWeather || innates.some(x => (
						this.battle.dex.abilities.get(x.replace('ability:', '')).suppressWeather
					)))) {
					return true;
				}
			}
			return false;
		},
	},
};
