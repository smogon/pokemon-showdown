export const Scripts: ModdedBattleScriptsData = {

  pokemon: {
    getAbility() {
  		return this.battle.dex.abilities.getByID(this.ability);
    },
    getItem() {
      let item = this.battle.dex.items.getByID(this.item);
      if (item.exists) return item;
      return this.item;
    },
  },
};
