exports.BattleScripts = {
    init: function() {
        for (var i in this.data.Pokedex) {
            var atk = this.data.Pokedex[i].baseStats.atk;
            var def = this.data.Pokedex[i].baseStats.def;
            var spa = this.data.Pokedex[i].baseStats.spa;
            var spd = this.data.Pokedex[i].baseStats.spd;
            if (atk > def) {
                this.data.Pokedex[i].baseStats.def = atk;
            } else {
                this.data.Pokedex[i].baseStats.atk = def;
            }
            if (spa > spd) {
                this.data.Pokedex[i].baseStats.spd = spa;
            } else {
                this.data.Pokedex[i].baseStats.spa = spd;
            }
        }
    }
};