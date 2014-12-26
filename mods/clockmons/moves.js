exports.BattleMovedex = {
    "doomdesire": {
        inherit: true,
        desc: "Deals damage to one adjacent target one turn after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Future Sight is already in effect for the target's position. This move ignores Protect and Detect.",
        shortDesc: "Hits one turn after being used.",
        onTryHit: function (target, source) {
            source.side.addSideCondition('futuremove');
            if (source.side.sideConditions['futuremove'].positions[source.position]) {
                return false;
            }
            source.side.sideConditions['futuremove'].positions[source.position] = {
                duration: 2,
                move: 'doomdesire',
                targetPosition: target.position,
                source: source,
                moveData: {
                    basePower: 140,
                    category: "Special",
                    type: 'Steel'
                }
            };
            this.add('-start', source, 'Doom Desire');
            return null;
        }
    },
    "electricterrain": {
        inherit: true,
        desc: "For ten turns, Pokemon on the ground cannot fall asleep. Their Electric-type moves are powered up by 50%.",
        effect: {
            duration: 10,
            onSetStatus: function (status, target, source, effect) {
                if (status.id === 'slp' && target.runImmunity('Ground')) {
                    this.debug('Interrupting sleep from Electric Terrain');
                    return false;
                }
            },
            onBasePower: function (basePower, attacker, defender, move) {
                if (move.type === 'Electric' && attacker.runImmunity('Ground')) {
                    this.debug('electric terrain boost');
                    return this.chainModify(1.5);
                }
            },
            onStart: function () {
                this.add('-fieldstart', 'move: Electric Terrain');
            },
            onResidualOrder: 21,
            onResidualSubOrder: 2,
            onEnd: function () {
                this.add('-fieldend', 'move: Electric Terrain');
            }
        }
    },
    "futuresight": {
        inherit: true,
        desc: "Deals damage to one adjacent target one turn after this move is used. At the end of that turn, the damage is dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position. This move ignores Protect and Detect.",
        shortDesc: "Hits one turn after being used.",
        onTryHit: function (target, source) {
            source.side.addSideCondition('futuremove');
            if (source.side.sideConditions['futuremove'].positions[source.position]) {
                return false;
            }
            source.side.sideConditions['futuremove'].positions[source.position] = {
                duration: 2,
                move: 'futuresight',
                targetPosition: target.position,
                source: source,
                moveData: {
                    basePower: 120,
                    category: "Special",
                    affectedByImmunities: true,
                    type: 'Psychic'
                }
            };
            this.add('-start', source, 'move: Future Sight');
            return null;
        }
    },
    "grassyterrain": {
        inherit: true,
        desc: "For ten turns, Pokemon on the ground restore 1/16 of their HP each turn. Their Grass-type moves are powered up by 50%. Damage caused by Earthquake, Bulldoze or Magnitude is halved.",
        effect: {
            duration: 10,
            onBasePower: function (basePower, attacker, defender, move) {
                var weakenedMoves = {'earthquake':1, 'bulldoze':1, 'magnitude':1};
                if (move.id in weakenedMoves) {
                    this.debug('move weakened by grassy terrain');
                    return this.chainModify(0.5);
                }
                if (move.type === 'Grass' && attacker.runImmunity('Ground')) {
                    this.debug('grassy terrain boost');
                    return this.chainModify(1.5);
                }
            },
            onStart: function (target, source) {
                this.add('-fieldstart', 'move: Grassy Terrain');
            },
            onResidualOrder: 5,
            onResidualSubOrder: 2,
            onResidual: function (battle) {
                this.debug('onResidual battle');
                for (var s in battle.sides) {
                    for (var p in battle.sides[s].active) {
                        if (battle.sides[s].active[p].runImmunity('Ground')) {
                            this.debug('Pokémon is grounded, healing through Grassy Terrain.');
                            this.heal(battle.sides[s].active[p].maxhp / 16, battle.sides[s].active[p], battle.sides[s].active[p]);
                        }
                    }
                }
            },
            onEnd: function () {
                this.add('-fieldend', 'move: Grassy Terrain');
            }
        }
    },
    "gravity": {
        inherit: true,
        desc: "For 10 turns, the evasion of all active Pokemon is 0.6x. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, and the Ability Arena Trap can affect Flying-types or Pokemon with the Ability Levitate. Fails if this move is already in effect.",
        shortDesc: "For 10 turns, negates all Ground immunities.",
        effect: {
            duration: 10,
            durationCallback: function (source, effect) {
                if (source && source.hasAbility('persistent')) {
                    return 13;
                }
                return 10;
            },
            onStart: function () {
                this.add('-fieldstart', 'move: Gravity');
            },
            onAccuracy: function (accuracy) {
                if (typeof accuracy !== 'number') return;
                return accuracy * 5 / 3;
            },
            onModifyPokemonPriority: 100,
            onModifyPokemon: function (pokemon) {
                pokemon.negateImmunity['Ground'] = true;
                var disabledMoves = {bounce:1, fly:1, highjumpkick:1, jumpkick:1, magnetrise:1, skydrop:1, splash:1, telekinesis:1};
                for (var m in disabledMoves) {
                    pokemon.disabledMoves[m] = true;
                }
                var applies = false;
                if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly') || pokemon.removeVolatile('skydrop')) {
                    applies = true;
                    this.cancelMove(pokemon);
                }
                if (pokemon.volatiles['magnetrise']) {
                    applies = true;
                    delete pokemon.volatiles['magnetrise'];
                }
                if (pokemon.volatiles['telekinesis']) {
                    applies = true;
                    delete pokemon.volatiles['telekinesis'];
                }
                if (applies) this.add('-activate', pokemon, 'Gravity');
            },
            onBeforeMove: function (pokemon, target, move) {
                var disabledMoves = {bounce:1, fly:1, highjumpkick:1, jumpkick:1, magnetrise:1, skydrop:1, splash:1, telekinesis:1};
                if (disabledMoves[move.id]) {
                    this.add('cant', pokemon, 'move: Gravity', move);
                    return false;
                }
            },
            onResidualOrder: 22,
            onEnd: function () {
                this.add('-fieldend', 'move: Gravity');
            }
        }
    },
    "hail": {
        inherit: true,
        desc: "For 10 turns, the weather becomes Hail. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are an Ice-type, or have the Abilities Ice Body, Magic Guard, Overcoat, or Snow Cloak. Lasts for 13 turns if the user is holding Icy Rock. Fails if the current weather is Hail.",
        shortDesc: "For 10 turns, hail crashes down."
    },
    "magicroom": {
        inherit: true,
        desc: "For 10 turns, the held items of all active Pokemon have no effect. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.",
        shortDesc: "For 10 turns, all held items have no effect.",
        effect: {
            duration: 10,
            /*durationCallback: function (source, effect) {
                // Persistent isn't updated for BW moves
                if (source && source.hasAbility('Persistent')) {
                    return 7;
                }
                return 5;
            },*/
            onStart: function (target, source) {
                this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
            },
            onModifyPokemonPriority: 1,
            onModifyPokemon: function (pokemon) {
                if (pokemon.getItem().megaEvolves) return;
                pokemon.ignore['Item'] = true;
            },
            onResidualOrder: 25,
            onEnd: function () {
                this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectData.source);
            }
        }
    },
    "mistyterrain": {
        inherit: true,
        desc: "For ten turns, Grounded Pokemon cannot have major status problem inflicted on them by other Pokemon. Dragon-type moves used against them are weakened by 50%.",
        effect: {
            duration: 10,
            onSetStatus: function (status, target, source, effect) {
                if (!target.runImmunity('Ground')) return;
                if (source && source !== target || (effect && effect.id === 'toxicspikes')) {
                    this.debug('misty terrain preventing status');
                    return false;
                }
            },
            onTryHit: function (target, source, move) {
                if (!target.runImmunity('Ground')) return;
                if (move && move.id === 'yawn') {
                    this.debug('misty terrain blocking yawn');
                    return false;
                }
            },
            onBasePower: function (basePower, attacker, defender, move) {
                if (move.type === 'Dragon' && defender.runImmunity('Ground')) {
                    this.debug('misty terrain weaken');
                    return this.chainModify(0.5);
                }
            },
            onStart: function (side) {
                this.add('-fieldstart', 'Misty Terrain');
            },
            onResidualOrder: 21,
            onResidualSubOrder: 2,
            onEnd: function (side) {
                this.add('-fieldend', 'Misty Terrain');
            }
        }
    },
    "raindance": {
        inherit: true,
        desc: "For 10 turns, the weather becomes Rain Dance. The power of Water-type attacks is 1.5x and the power of Fire-type attacks is 0.5x during the effect. Lasts for 13 turns if the user is holding Damp Rock. Fails if the current weather is Rain Dance.",
        shortDesc: "For 10 turns, heavy rain powers Water moves."
    },
    "reflect": {
        inherit: true,
        desc: "For 10 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a double or triple battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Brick Break removes the effect before damage is calculated. Lasts for 13 turns if the user is holding Light Clay.",
        shortDesc: "For 10 turns, physical damage to allies is halved.",
        effect: {
            duration: 10,
            durationCallback: function (target, source, effect) {
                if (source && source.hasItem('lightclay')) {
                    return 13;
                }
                return 10;
            },
            onFoeModifyDamage: function (damage, source, target, move) {
                if (this.getCategory(move) === 'Physical' && target.side === this.effectData.target) {
                    if (!move.crit && !move.ignoreScreens) {
                        this.debug('Reflect weaken');
                        if (source.side.active.length > 1) return this.chainModify(0.66);
                        return this.chainModify(0.5);
                    }
                }
            },
            onStart: function (side) {
                this.add('-sidestart', side, 'Reflect');
            },
            onResidualOrder: 21,
            onEnd: function (side) {
                this.add('-sideend', side, 'Reflect');
            }
        }
    },
    "sandstorm": {
        inherit: true,
        desc: "For 10 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel-type, or have the Abilities Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil. The Special Defense of Rock-types is 1.5x during the effect. Lasts for 13 turns if the user is holding Smooth Rock. Fails if the current weather is Sandstorm.",
        shortDesc: "For 10 turns, a sandstorm rages."
    },
    "spikes": {
        num: 191,
        accuracy: true,
        basePower: 0,
        category: "Status",
        desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in, unless it is a Flying-type or has the Ability Levitate. Can be used up to three times before failing. Foes lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or is hit by Defog. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
        shortDesc: "Hurts grounded foes on switch-in. Max 3 layers.",
        id: "spikes",
        isViable: true,
        name: "Spikes",
        pp: 20,
        priority: 0,
        isBounceable: true,
        sideCondition: 'spikes',
        effect: {
            duration: 9,
            // this is a side condition
            onStart: function (side) {
                this.add('-sidestart', side, 'Spikes');
                this.add('-sidestart', side, 'Spikes');
                this.effectData.layers = 2;
            },
            onRestart: function (side) {
                if (this.effectData.layers >= 3) return false;
                this.add('-sidestart', side, 'Spikes');
                if (this.effectData.layers === 2) {
                    this.effectData.layers++;
                } else {
                    this.add('-sidestart', side, 'Spikes');
                    this.effectData.layers = this.effectData.layers + 2;
                }
            },
            onSwitchIn: function (pokemon) {
                var side = pokemon.side;
                if (!pokemon.runImmunity('Ground')) return;
                var damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
                var damage = this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
            },
            onEnd: function (side) {
                this.add('-sideend', side, 'Spikes');
            }
        },
        secondary: false,
        target: "foeSide",
        type: "Ground"
    },
    "stealthrock": {
        inherit: true,
        desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock-type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin, is hit by Defog, or 8 turns after the first successful instance of the move was used. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.(CAP: Pokemon with the Ability Mountaineer are immune.)",
        effect: {
            duration: 9,
            // this is a side condition
            onStart: function (side) {
                this.add('-sidestart', side, 'move: Stealth Rock');
            },
            onSwitchIn: function (pokemon) {
                var typeMod = this.getEffectiveness('Rock', pokemon);
                var factor = 8;
                if (typeMod === 1) factor = 4;
                if (typeMod >= 2) factor = 2;
                if (typeMod === -1) factor = 16;
                if (typeMod <= -2) factor = 32;
                var damage = this.damage(pokemon.maxhp / factor);
            },
            onEnd: function (side) {
                this.add('-sideend', side, 'move: Stealth Rock');
            }
        }
    },
    "stickyweb": {
        inherit: true,
        desc: "Lowers the Speed stat of the opposing team's Pokemon upon switching into battle. Disappears after 8 turns.",
        effect: {
            duration: 9,
            onStart: function (side) {
                this.add('-sidestart', side, 'move: Sticky Web');
            },
            onSwitchIn: function (pokemon) {
                if (!pokemon.runImmunity('Ground')) return;
                this.add('-activate', pokemon, 'move: Sticky Web');
                this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.getMove('stickyweb'));
            },
            onEnd: function (side) {
                this.add('-sideend', side, 'move: Sticky Web');
            }
        }
    },
    "sunnyday": {
        inherit: true,
        desc: "For 10 turns, the weather becomes Sunny Day. The power of Fire-type attacks is 1.5x and the power of Water-type attacks is 0.5x during the effect. Lasts for 13 turns if the user is holding Heat Rock. Fails if the current weather is Sunny Day.",
        shortDesc: "For 10 turns, intense sunlight powers Fire moves."
    },
    "toxicspikes": {
        inherit: true,
        desc: "Sets up a hazard on the foe's side of the field, poisoning each foe that switches in, unless it is a Flying-type or has the Ability Levitate. Can be used up to two times before failing. Foes become poisoned with one layer and badly poisoned with two layers. Can be removed from the foe's side if any foe uses Rapid Spin, is hit by Defog, a grounded Poison-type switches in, or 8 turns after the first successful instance of the move was used. Safeguard prevents the foe's party from being poisoned on switch-in, but Substitute does not. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
        effect: {
            duration: 9,
            // this is a side condition
            onStart: function (side) {
                this.add('-sidestart', side, 'move: Toxic Spikes');
                this.effectData.layers = 1;
            },
            onRestart: function (side) {
                if (this.effectData.layers >= 2) return false;
                this.add('-sidestart', side, 'move: Toxic Spikes');
                this.effectData.layers++;
            },
            onSwitchIn: function (pokemon) {
                if (!pokemon.runImmunity('Ground')) return;
                if (!pokemon.runImmunity('Poison')) return;
                if (pokemon.hasType('Poison')) {
                    this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
                    pokemon.side.removeSideCondition('toxicspikes');
                } else if (this.effectData.layers >= 2) {
                    pokemon.trySetStatus('tox');
                } else {
                    pokemon.trySetStatus('psn');
                }
            },
            onEnd: function (side) {
                this.add('-sideend', side, 'move: Toxic Spikes');
            }
        }
    },
    "trickroom": {
        inherit: true,
        desc: "For 10 turns, all active Pokemon with lower Speed will move before those with higher Speed, within their priority brackets. If this move is used during the effect, the effect ends. Priority -7.",
        shortDesc: "For 10 turns, slower Pokemon move first.",
        effect: {
            duration: 10,
            durationCallback: function (source, effect) {
                if (source && source.hasAbility('persistent')) {
                    return 13;
                }
                return 10;
            },
            onStart: function (target, source) {
                this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
                this.getStatCallback = function (stat, statName) {
                    // If stat is speed and does not overflow (Trick Room Glitch) return negative speed.
                    if (statName === 'spe' && stat <= 1809) return -stat;
                    return stat;
                };
            },
            onResidualOrder: 23,
            onEnd: function () {
                this.add('-fieldend', 'move: Trick Room');
                this.getStatCallback = null;
            }
        }
    },
    "wonderroom": {
        inherit: true,
        desc: "For 10 turns, all active Pokemon have their Defense and Special Defense stats swapped. Stat stage changes are unaffected. If this move is used during the effect, the effect ends.",
        shortDesc: "For 10 turns, all Defense and Sp. Def stats switch.",
        effect: {
            duration: 10,
            onStart: function (side, source) {
                this.add('-fieldstart', 'move: WonderRoom', '[of] ' + source);
            },
            onModifyMovePriority: -100,
            onModifyMove: function (move) {
                move.defensiveCategory = ((move.defensiveCategory || this.getCategory(move)) === 'Physical' ? 'Special' : 'Physical');
                this.debug('Defensive Category: ' + move.defensiveCategory);
            },
            onResidualOrder: 24,
            onEnd: function () {
                this.add('-fieldend', 'move: Wonder Room');
            }
        }
    }
};