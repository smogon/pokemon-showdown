import { RESTORATIVE_BERRIES } from "../../../sim/pokemon";

export const Scripts: ModdedBattleScriptsData = {

	pokemon: {
		getAbility() {
			const ability = this.battle.dex.abilities.getByID(this.ability);
			if (ability.exists) return ability;
			return {
				id: this.ability,
				name: this.ability,
				flags: {},
				effectType: "Ability",
				toString() {
					return this.id;
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
						(pokemon.m.scrambled.abilities as { thing: string }[]).some(abils => toID(abils.thing) === 'neutralizinggas')) &&
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
						(this.m.scrambled.abilities as { thing: string }[]).some(abils => toID(abils.thing) === 'neutralizinggas'))
					)) && !this.getAbility().flags['cantsuppress']
				)
			);
		},
		setAbility(ability, source, sourceEffect, isFromFormeChange = false, isTransform = false) {
			let isBMMAbil = false;
			let isOldBMMAbil = false;
			if (!this.hp) return false;
			if (typeof ability === 'string') {
				if (this.battle.dex.abilities.get(ability).exists) {
					ability = this.battle.dex.abilities.get(ability);
				} else {
					ability = {
						id: ability,
						name: ability,
						flags: {},
						effectType: "Ability",
						toString() {
							return this.id;
						},
					} as Ability;
					isBMMAbil = true;
				}
			}
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			let oldAbility;
			if (this.battle.dex.abilities.get(this.ability).exists) {
				oldAbility = this.battle.dex.abilities.get(this.ability);
			} else {
				oldAbility = {
					id: this.ability,
					name: this.ability,
					flags: {},
					effectType: "Ability",
					toString() {
						return this.id;
					},
				} as Ability;
				isOldBMMAbil = true;
			}
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
				} else {
					const isMove = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					this.baseMoveSlots.splice(
						this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id), 1);
					// this.moveSlots.splice(this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.items[isMove].thing) === m.id), 1);
					this.m.scrambled.moves.splice(isMove, 1);
				}
			}
			this.ability = ability.id;
			// ability changes are permanent in BioMechMons
			this.baseAbility = ability.id;
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
					this.baseMoveSlots.push(newMove);
				}
			}
			return oldAbility.id;
		},
		getItem() {
			const item = this.battle.dex.items.getByID(this.item);
			if (item.exists) return item;
			return {
				id: this.item,
				name: this.item,
				effectType: "Item",
				toString() {
					return this.id;
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
				if (toID(this.ability) === 'multitype') return false;
				if (toID(source.ability) === 'multitype') return false;
			}
			const item = this.getItem();
			if (this.battle.runEvent('TakeItem', this, source, null, item)) {
				this.item = '';
				let wrongSlot = (this.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
				if (wrongSlot) {
					this.removeVolatile('ability:' + this.battle.toID(this.m.scrambled.items[wrongSlot].thing));
					this.m.scrambled.abilties.splice(wrongSlot, 1);
				} else if ((this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item')) {
					wrongSlot = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					this.baseMoveSlots.splice(
						this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[wrongSlot].thing) === m.id), 1);
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
			let isBMMItem = false;
			let isOldBMMItem = false;
			if (!this.hp || !this.isActive) return false;
			if (typeof item === 'string') {
				if (this.battle.dex.items.get(item).exists) {
					item = this.battle.dex.items.get(item);
				} else {
					item = {
						id: this.item,
						name: this.item,
						effectType: "Item",
						toString() {
							return this.id;
						},
					} as Item;
					isBMMItem = true;
				}
			}
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
				} else {
					const isMove = (this.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					this.baseMoveSlots.splice(
						this.baseMoveSlots.findIndex(m => this.battle.toID(this.m.scrambled.moves[isMove].thing) === m.id), 1);
					// this.moveSlots.splice(this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.items[isMove].thing) === m.id), 1);
					this.m.scrambled.moves.splice(isMove, 1);
				}
			}
			if (item.id) {
				this.battle.singleEvent('Start', item, this.itemState, this, source, effect);
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
					}
				}
			}
			return true;
		},

		// TODO
		eatItem(force, source, sourceEffect) {
			const item = sourceEffect?.effectType === 'Item' ? sourceEffect :
				this.battle.effect.effectType === 'Item' ? this.battle.effect : this.getItem();
			if (!item) return false;
			if ((!this.hp && this.battle.toID(item.name) !== 'jabocaberry' && this.battle.toID(item.name) !== 'rowapberry') || !this.isActive) return false;

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
					this.removeVolatile(item.id);
					this.m.scrambled.items.splice((this.m.scrambled.items as { thing: string, inSlot: string}[]).findIndex(e => 
						e.thing === this.battle.toID(item.name) && e.inSlot === isBMM), 1);
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

		// TODO
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
					this.removeVolatile(item.id);
					this.m.scrambled.items.splice((this.m.scrambled.items as { thing: string, inSlot: string}[]).findIndex(e => 
						e.thing === this.battle.toID(item.name) && e.inSlot === isBMM), 1);
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
