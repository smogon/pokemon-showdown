export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	pokemon: {
		ignoringItem() {
			return !!(
				this.itemState.knockedOff || // Gen 3-4
				(this.battle.gen >= 5 && !this.isActive) ||
				(!this.getItem().ignoreKlutz && this.hasAbility('klutz')) ||
				this.volatiles['embargo'] || this.battle.field.pseudoWeather['magicroom'] ||
				this.volatiles['stench']
			);
		},
	},
};
