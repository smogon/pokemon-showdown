export const Scripts: ModdedBattleScriptsData = {

  pokemon: {
    getAbility() {
  		return this.battle.dex.abilities.getByID(this.ability);
    },
    getItem() {
  		return this.battle.dex.items.getByID(this.item);
    },
  },
};
