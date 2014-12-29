exports.BattleItems = {
    "armorfossil": {
        inherit: true,
        onModifyDefPriority: 1,
        onModifyDef: function (def) {
            return this.chainModify(1.5);
        },
        onModifyPokemon: function (pokemon) {
            var moves = pokemon.moveset;
            for (var i = 0; i < moves.length; i++) {
                if (this.getMove(moves[i].move).category === 'Status') {
                    moves[i].disabled = true;
                }
            }
        },
        desc: "Can be revived into Shieldon. Holder's Def is 1.5x, but it can only use damaging moves."
    },
    "brightpowder": {
        inherit: true,
        onAccuracy: function (accuracy) {
            return accuracy;
        },
        onModifyMove: function (move) {
            if (move.category === "Status" && move.priority === 0) {
                move.selfSwitch = true;
            }
        },
        desc: "Holder's non-damaging attacks with 0 priority switch out the holder with a chosen ally."
    },
    "dragonfang": {
        inherit: true,
        onBasePower: function (basePower) {
            return basePower;
        },
        onModifyDamage: function (damage, source, target, move) {
            if (source) {
                source.addVolatile('dragonfang');
                return this.chainModify(1.33);
            }           
        },
        onModifySpe: function (speMod) {
            return this.chain(speMod, 1.33);
        },
        effect: {
            duration: 1,
            onAfterMoveSecondarySelf: function (source, target, move) {
                if (move && move.effectType === 'Move' && source && source.volatiles['dragonfang']) {
                    if (source.hp - source.maxhp/4 <= 3) {
                        this.damage(source.hp, source, source, this.getItem('dragonfang'));
                    } else { 
                        this.damage(source.maxhp / 4, source, source, this.getItem('dragonfang'));
                    }
                    source.removeVolatile('dragonfang');
                }
            }
        },
        desc: "Holder's damaging attacks have 1.33x power; holder's Speed is 1.33x; loses 1/4 max HP after the attack."
    },
    "laggingtail": {
        inherit: true,
        onModifyMove: function (move) {
            if (move.id === "dragontail") {
                move.forceSwitch = false;
                move.self = {
                    onHit: function (pokemon) {
                        if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
                            this.add('-end', pokemon, 'Leech Seed', '[from] move: Dragon Tail', '[of] ' + pokemon);
                        }
                        var sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
                        for (var i in sideConditions) {
                            if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
                                this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Dragon Tail', '[of] ' + pokemon);
                            }
                        }
                        if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
                            this.add('-remove', pokemon, pokemon.volatiles['partiallytrapped'].sourceEffect.name, '[from] move: Dragon Tail', '[of] ' + pokemon, '[partiallytrapped]');
                            delete pokemon.volatiles['partiallytrapped'];
                        }
                    }
                };
            }
        },
        onModifyPriority: function (priority, pokemon, target, move) {
            if (move && move.id === "dragontail") {
                return 0;
            } else {
                return priority;
            }
        },
        desc: "Dragon Tail frees the holder from hazards/partial trap/Leech Seed, and has 0 priority when used by the holder."
    },
    "spelltag": {
        inherit: true,
        onBasePower: function (basePower) {
            return basePower;
        },
        onModifyMove: function (move) {
            if (move.secondaries && move.id !== 'secretpower') {
                for (var i = 0; i < move.secondaries.length; i++) {
                    var t = 0;
                    if (move.secondaries[i].status) {
                        this.debug('doubling secondary chance');
                        t = 1;
                    } else if (move.secondaries[i].boosts && !move.secondaries[i].boosts.accuracy) {
                        this.debug('doubling secondary chance');
                        t = 1;
                    } else if (move.secondaries[i].boosts && move.secondaries[i].boosts.accuracy) {
                        this.debug('zeroing secondary chance');
                        t = -1;
                    }
                    move.secondaries[i].chance *= t + 1;
                }
            }
        },
        desc: "Holder's moves have their secondary effects doubled, if they inflict status or modify stats, but cannot lower accuracy."
    }
};