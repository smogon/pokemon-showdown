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
					this.m.scrambled.items.splice(isMove, 1);
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
		// TODO
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
				const oldItemState = this.itemState;
				this.battle.clearEffectState(this.itemState);
				this.pendingStaleness = undefined;
				this.battle.singleEvent('End', item, oldItemState, this);
				this.battle.runEvent('AfterTakeItem', this, null, null, item);
				return item;
			}
			return false;
		},
		// TODO
		setItem(item, source, effect) {
			if (!this.hp || !this.isActive) return false;
			if (typeof item === 'string') item = this.battle.dex.items.get(item);

			const effectid = this.battle.effect ? this.battle.effect.id : '';
			if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
				const inflicted = ['trick', 'switcheroo'].includes(effectid);
				const external = inflicted && source && !source.isAlly(this);
				this.pendingStaleness = external ? 'external' : 'internal';
			} else {
				this.pendingStaleness = undefined;
			}
			const oldItem = this.getItem();
			const oldItemState = this.itemState;
			this.item = item.id;
			this.itemState = this.battle.initEffectState({ id: item.id, target: this });
			if (oldItem.exists) this.battle.singleEvent('End', oldItem, oldItemState, this);
			if (item.id) {
				this.battle.singleEvent('Start', item, this.itemState, this, source, effect);
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
