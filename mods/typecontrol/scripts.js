exports.BattleScripts = {
    pokemon: {
        formeChange: function (template, dontRecalculateStats) {
            template = this.battle.getTemplate(template);

            if (!template.abilities) return false;
            this.illusion = null;
            this.template = template;
            this.types = template.types;
            this.typesData = [];

            var battle = this.battle;
            var modTypes = this.name.split('/').slice(0, 2).map(toId).unique().map(function (type) {
                var id = type.charAt(0).toUpperCase() + type.slice(1);
                if (!battle.data.TypeChart.hasOwnProperty(id)) return;
                return id;
            }).compact();
            if (!modTypes.length) modTypes = template.types;

            this.typesData = modTypes.map(function (type) {
                return {
                    type: type,
                    suppressed: false,
                    isAdded: false
                };
            });
            if (!dontRecalculateStats) {
                for (var statName in this.stats) {
                    var stat = this.template.baseStats[statName];
                    stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);

                    // nature
                    var nature = this.battle.getNature(this.set.nature);
                    if (statName === nature.plus) stat *= 1.1;
                    if (statName === nature.minus) stat *= 0.9;
                    this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
                }
                this.speed = this.stats.spe;
            }
            return true;
        }
    }
};