export const Scripts: ModdedBattleScriptsData = {

  pokemon: {
    getAbility() {
      let ability = this.battle.dex.abilities.getByID(this.ability);
      if (ability.exists) return ability;
      return this.battle.dex.abilities.getByID('noability' as ID);
    },
    getItem() {
      let item = this.battle.dex.items.getByID(this.item);
      if (item.exists) return item;
      return this.battle.dex.items.getByID('mail' as ID);
    },
  },
};
