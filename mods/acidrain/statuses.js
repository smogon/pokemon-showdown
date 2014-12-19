exports.BattleStatuses = {
        raindance: {
                effectType: 'Weather',
                duration: 5,
                onBasePower: function (basePower, attacker, defender, move) {
                        if (move.type === 'Water') {
                                this.debug('acid rain water supress');
                                return this.chainModify(0.75);
                        }
                        if (move.type === 'Fire') {
                                this.debug('acid rain fire suppress');
                                return this.chainModify(0.75);
                        }
                },
                onModifySpDPriority: 10,
                onModifySpD: function (spd, pokemon) {
                        if (pokemon.hasType('Rock') && this.isWeather('RainDance')) {
                                return this.modify(spd, 1.5);
                        }
                },
                onImmunity: function (type) {
                        if (type === 'frz') return false;
                },
                onStart: function (battle, source, effect) {
                        if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
                                this.effectData.duration = 0;
                                this.add('-weather', 'RainDance', '[from] ability: ' + effect, '[of] ' + source);
                        } else {
                                this.add('-weather', 'RainDance');
                        }
                },
                onResidualOrder: 1,
                onResidual: function () {
                        this.add('-weather', 'RainDance', '[upkeep]');
                        this.eachEvent('Weather');
                },
                onWeather: function (target) {
                        if (target.runImmunity('sandstorm') && target.runImmunity('hail')) {
                                this.damage(target.maxhp / 8);
                        } else if ((!target.runImmunity('sandstorm') && target.runImmunity('hail')) || (target.runImmunity('sandstorm') && !target.runImmunity('hail'))) {
                                this.damage(target.maxhp / 16);
                        }
                       
                },
                onEnd: function () {
                        this.add('-weather', 'none');
                }
        }
};
