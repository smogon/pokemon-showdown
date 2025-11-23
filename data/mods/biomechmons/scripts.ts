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
					(pokemon.ability === ('neutralizinggas' as ID) || (pokemon.m.scrambled.abilities as {thing: String}[]).some(abils => toID(abils.thing as String) === 'neutralizinggas')) &&
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
						(this.m.scrambled.abilities as {thing: String}[]).some(abils => toID(abils.thing) === 'neutralizinggas'))
					)) && !this.getAbility().flags['cantsuppress']
				)
			);
		},
		// TODO
		setAbility(
			ability: string | Ability, source?: Pokemon | null, sourceEffect?: Effect | null,
			isFromFormeChange = false, isTransform = false,
		) {
			if (!this.hp) return false;
			if (typeof ability === 'string') ability = this.battle.dex.abilities.get(ability);
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			const oldAbility = this.battle.dex.abilities.get(this.ability);
			if (!isFromFormeChange) {
				if (ability.flags['cantsuppress'] || this.getAbility().flags['cantsuppress']) return false;
			}
			if (!isFromFormeChange && !isTransform) {
				const setAbilityEvent: boolean | null = this.battle.runEvent('SetAbility', this, source, sourceEffect, ability);
				if (!setAbilityEvent) return setAbilityEvent;
			}
			this.battle.singleEvent('End', oldAbility, this.abilityState, this, source);
			this.ability = ability.id;
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
		}
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
