exports.BattleAbilities = {
        "chlorophyll": {
                inherit: true,
                onModifySpe: function (speMod) {
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                return this.chain(speMod, 2);
                        }
                }
        },
        "drought": {
                inherit: true,
                onStart: function (source) {
                        this.setWeather('raindance');
                }
        },
        "flowergift": {
                inherit: true,
                onUpdate: function (pokemon) {
                        if (!pokemon.isActive || pokemon.speciesid !== 'cherrim') return;
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                if (this.effectData.forme !== 'Sunshine') {
                                        this.effectData.forme = 'Sunshine';
                                        this.add('-formechange', pokemon, 'Cherrim-Sunshine');
                                        this.add('-message', pokemon.name + ' transformed! (placeholder)');
                                }
                        } else {
                                if (this.effectData.forme) {
                                        delete this.effectData.forme;
                                        this.add('-formechange', pokemon, 'Cherrim');
                                        this.add('-message', pokemon.name + ' transformed! (placeholder)');
                                }
                        }
                },
                onAllyModifyAtk: function (atk) {
                        if (this.effectData.target.template.speciesid !== 'cherrim') return;
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                return this.chainModify(1.5);
                        }
                },
                onAllyModifySpD: function (spd) {
                        if (this.effectData.target.template.speciesid !== 'cherrim') return;
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                return this.chainModify(1.5);
                        }
                }
        },
        "harvest": {
                inherit: true,
                onResidual: function (pokemon) {
                        if (this.isWeather('sunnyday') || this.isWeather('raindance') || this.random(2) === 0) {
                                if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
                                        pokemon.setItem(pokemon.lastItem);
                                        this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
                                }
                        }
                }
        },
        "icebody": {
                inherit: true,
                onWeather: function (target, source, effect) {
                        if (effect.id === 'hail' || effect.id === 'raindance') {
                                this.heal(target.maxhp / 16);
                        }
                }
        },
        "leafguard": {
                inherit: true,
                onSetStatus: function (pokemon) {
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                return false;
                        }
                },
                onTryHit: function (target, source, move) {
                        if (move && move.id === 'yawn' && (this.isWeather('sunnyday') || this.isWeather('raindance'))) {
                                return false;
                        }
                }
        },
        "sandforce": {
                inherit: true,
                onBasePower: function (basePower, attacker, defender, move) {
                        if (this.isWeather('sandstorm') || this.isWeather('raindance')) {
                                if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
                                        this.debug('Sand Force boost');
                                        return this.chainModify([0x14CD, 0x1000]); // The Sand Force modifier is slightly higher than the normal 1.3 (0x14CC)
                                }
                        }
                },
        },
        "sandrush": {
                inherit: true,
                onModifySpe: function (speMod, pokemon) {
                        if (this.isWeather('sandstorm') || this.isWeather('raindance')) {
                                return this.chain(speMod, 2);
                        }
                },
        },
        "sandstream": {
                inherit: true,
                onStart: function (source) {
                        this.setWeather('raindance');
                }
        },
        "sandveil": {
                inherit: true,
                onAccuracy: function (accuracy) {
                        if (typeof accuracy !== 'number') return;
                        if (this.isWeather('sandstorm') || this.isWeather('raindance')) {
                                this.debug('Sand Veil - decreasing accuracy');
                                return accuracy * 0.8;
                        }
                },
        },
        "snowcloak": {
                inherit: true,
                onAccuracy: function (accuracy) {
                        if (typeof accuracy !== 'number') return;
                        if (this.isWeather('hail') || this.isWeather('raindance')) {
                                this.debug('Snow Cloak - decreasing accuracy');
                                return accuracy * 0.8;
                        }
                }
        },
        "snowwarning": {
                inherit: true,
                onStart: function (source) {
                        this.setWeather('raindance');
                }
        },
        "solarpower": {
                inherit: true,
                onModifySpA: function (spa, pokemon) {
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) {
                                return this.chainModify(1.5);
                        }
                },
                onWeather: function (target, source, effect) {
                        if (effect.id === 'sunnyday' || effect.id === 'raindance') {
                                this.damage(target.maxhp / 8);
                        }
                }
        }
};
