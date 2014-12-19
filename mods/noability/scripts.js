exports.BattleScripts = {
    init: function() {
        for (var i in this.data.Pokedex) {
            // Needed because of forme changes
            this.modData('Pokedex', i).abilities['0'] = 'None';
        }
    }
};