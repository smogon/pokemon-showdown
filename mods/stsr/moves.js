exports.BattleMovedex = {
    stealthrock: {
        inherit: true,
        effect: {
            onStart: function (side, source) {
                this.add('-sidestart', side, 'move: Stealth Rock');
                this.effectData.type = source.getTypes()[0];
                this.add('-message', '(' + this.effectData.type + '-type)');
            },
            onSwitchIn: function (pokemon) {
                if (pokemon.hasAbility('voltabsorb') && this.effectData.type === 'Electric') {
                    pokemon.side.removeSideCondition('stealthrock');
                    this.add('-sideend', pokemon.side, 'move: Stealth Rock', '[of] ' + pokemon);
                } else if (pokemon.hasAbility('waterabsorb') && this.effectData.type === 'Water') {
                    pokemon.side.removeSideCondition('stealthrock');
                    this.add('-sideend', pokemon.side, 'move: Stealth Rock', '[of] ' + pokemon);
                } else if (pokemon.runImmunity(this.effectData.type)) {
                    var typeMod = this.getEffectiveness(this.effectData.type, pokemon);
                    var factor = 8;
                    if (typeMod === 1) factor = 4;
                    if (typeMod >= 2) factor = 2;
                    if (typeMod === -1) factor = 16;
                    if (typeMod <= -2) factor = 32;
                    var damage = this.damage(pokemon.maxhp / factor);
                }
            }
        }
    }
};