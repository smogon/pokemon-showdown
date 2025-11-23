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
			if (Array.isArray(ability)) {
				if (!ability.map(toID).includes(this.ability)) return false;
			} else {
				if (toID(ability) !== this.ability) return false;
			}
			return !this.ignoringAbility();
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
	},
};
