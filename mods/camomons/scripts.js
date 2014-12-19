exports.BattleScripts = {
    pokemon: {
        formeChange: function (template, dontRecalculateStats) {
            template = this.battle.getTemplate(template);

            if (!template.abilities) return false;
            this.illusion = null;
            this.template = template;
            this.types = template.types;
            this.typesData = [];

            var typingMoves = [];
            for (var i=0, l=Math.min(this.moveset.length, 2); i<l; i++) {
                typingMoves.push(this.battle.getMove(this.moveset[i].id));
            }
            this.typesData = typingMoves.map('type').unique().map(function (type) {
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