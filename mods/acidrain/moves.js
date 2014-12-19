exports.BattleMovedex = {
        "blizzard": {
                inherit: true,
                onModifyMove: function (move) {
                        if (this.isWeather('hail') || this.isWeather('raindance')) move.accuracy = true;
                }
        },
        "growth": {
                inherit: true,
                onModifyMove: function (move) {
                        if (this.isWeather('sunnyday') || this.isWeather('raindance')) move.boosts = {atk: 2, spa: 2};
                }
        },
        "hail": {
                inherit: true,
                weather: 'raindance'
        },
        "moonlight": {
                inherit: true,
                onHit: function (pokemon) {
                        if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
                        else if (this.isWeather(['sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
                        else if (this.isWeather('raindance')) this.heal(this.modify(pokemon.maxhp, 0.0833));
                        else this.heal(this.modify(pokemon.maxhp, 0.5));
                }
        },
        "morningsun": {
                inherit: true,
                onHit: function (pokemon) {
                        if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
                        else if (this.isWeather(['sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
                        else if (this.isWeather('raindance')) this.heal(this.modify(pokemon.maxhp, 0.0833));
                        else this.heal(this.modify(pokemon.maxhp, 0.5));
                }
        },
        "sandstorm": {
                inherit: true,
                weather: 'raindance'
        },
        "solarbeam": {
                inherit: true,
                onTry: function (attacker, defender, move) {
                        if (attacker.removeVolatile(move.id)) {
                                return;
                        }
                        this.add('-prepare', attacker, move.name, defender);
                        if (this.isWeather('sunnyday') || this.isWeather('raindance') || !this.runEvent('ChargeMove', attacker, defender, move)) {
                                this.add('-anim', attacker, move.name, defender);
                                return;
                        }
                        attacker.addVolatile('twoturnmove', defender);
                        return null;
                },
                onBasePower: function (basePower, pokemon, target) {
                        if (this.isWeather(['sandstorm', 'hail'])) {
                                this.debug('weakened by weather');
                                return this.chainModify(0.5);
                        } else if (this.isWeather('raindance')) {
                                this.debug('super-weakened by weather');
                                return this.chainModify(0.125);
                        }
                }
        },
        "sunnyday": {
                inherit: true,
                weather: 'sandstorm'
        },
        "synthesis": {
                inherit: true,
                onHit: function (pokemon) {
                        if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
                        else if (this.isWeather(['sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
                        else if (this.isWeather('raindance')) this.heal(this.modify(pokemon.maxhp, 0.0833));
                        else this.heal(this.modify(pokemon.maxhp, 0.5));
                }
        },
        "weatherball": {
                inherit: true,
                basePowerCallback: function () {
                        if (this.isWeather('raindance')) return 800; //We have 4 weathers active at once.
                        else if (this.weather) return 100;
                        return 50;
                },
                onModifyMove: function (move) {
                        switch (this.effectiveWeather()) {
                        case 'sunnyday':
                                move.type = 'Fire';
                                break;
                        case 'raindance':
                                move.type = 'Ice'; //Hail is the highest priority weather.
                                break;
                        case 'sandstorm':
                                move.type = 'Rock';
                                break;
                        case 'hail':
                                move.type = 'Ice';
                                break;
                        }
                }
        }
};