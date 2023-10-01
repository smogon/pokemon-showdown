export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	pokemon: {
		hasItem(item) {
			if (this.ignoringItem()) return false;
			if (Array.isArray(item)) return item.some(i => this.hasItem(i));
			const itemid = this.battle.toID(item);
			return this.item === itemid || !!this.volatiles['item:' + itemid];
		},
	},
};
