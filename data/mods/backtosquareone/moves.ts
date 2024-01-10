export const Moves: {[k: string]: ModdedMoveData} = {
    "10000000voltthunderbolt": {
        isNonstandard: null,
        num: 719,
        accuracy: true,
        basePower: 195,
        category: "Special",
        name: "10,000,000 Volt Thunderbolt",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "pikashuniumz",
        critRatio: 3,
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    absorb: {
        pp: 20,
        flags: {"protect":1,"mirror":1},
        num: 71,
        accuracy: 100,
        basePower: 20,
        category: "Special",
        name: "Absorb",
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Clever"
    },
    accelerock: {
        num: 709,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Accelerock",
        pp: 20,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Cool"
    },
    acid: {
        secondary: {"chance":33,"boosts":{"def":-1}},
        target: "normal",
        num: 51,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Acid",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        type: "Poison",
        contestType: "Clever"
    },
    acidarmor: {
        pp: 40,
        num: 151,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Acid Armor",
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":2},
        secondary: null,
        target: "self",
        type: "Poison",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    aciddownpour: {
        isNonstandard: null,
        num: 628,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Acid Downpour",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "poisoniumz",
        secondary: null,
        target: "normal",
        type: "Poison",
        contestType: "Cool"
    },
    acidspray: {
        num: 491,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Acid Spray",
        pp: 20,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spd":-2}},
        target: "normal",
        type: "Poison",
        contestType: "Beautiful"
    },
    acrobatics: {
        num: 512,
        accuracy: 100,
        basePower: 55,
        basePowerCallback(pokemon, target, move) {
            if (!pokemon.item) {
                this.debug("BP doubled for no item");
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Acrobatics",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    acupressure: {
        flags: {"snatch":1},
        onHit(target) {
            if (target.volatiles['substitute']) {
                return false;
            }
            const stats = [];
            let stat;
            for (stat in target.boosts) {
                if (target.boosts[stat] < 6) {
                    stats.push(stat);
                }
            }
            if (stats.length) {
                const randomStat = this.sample(stats);
                const boost = {};
                boost[randomStat] = 2;
                this.boost(boost);
            }
            else {
                return false;
            }
        },
        num: 367,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Acupressure",
        pp: 30,
        priority: 0,
        secondary: null,
        target: "adjacentAllyOrSelf",
        type: "Normal",
        zMove: {"effect":"crit2"},
        contestType: "Tough"
    },
    aerialace: {
        num: 332,
        accuracy: true,
        basePower: 60,
        category: "Physical",
        name: "Aerial Ace",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1,"slicing":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    aeroblast: {
        critRatio: 3,
        isNonstandard: null,
        num: 177,
        accuracy: 95,
        basePower: 100,
        category: "Physical",
        name: "Aeroblast",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    afteryou: {
        num: 495,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "After You",
        pp: 15,
        priority: 0,
        flags: {"bypasssub":1,"allyanim":1},
        onHit(target) {
            if (target.side.active.length < 2)
                return false; // fails in singles
            const action = this.queue.willMove(target);
            if (action) {
                this.queue.prioritizeAction(action);
                this.add('-activate', target, 'move: After You');
            }
            else {
                return false;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Cute"
    },
    agility: {
        num: 97,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Agility",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"spe":2},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cool"
    },
    aircutter: {
        basePower: 55,
        num: 314,
        accuracy: 95,
        category: "Physical",
        name: "Air Cutter",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1,"slicing":1,"wind":1},
        critRatio: 2,
        secondary: null,
        target: "allAdjacentFoes",
        type: "Flying",
        contestType: "Cool"
    },
    airslash: {
        pp: 20,
        num: 403,
        accuracy: 95,
        basePower: 75,
        category: "Special",
        name: "Air Slash",
        priority: 0,
        flags: {"protect":1,"mirror":1,"distance":1,"slicing":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    alloutpummeling: {
        isNonstandard: null,
        num: 624,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "All-Out Pummeling",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "fightiniumz",
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    alluringvoice: {
		num: 914,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Alluring Voice",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target?.statsRaisedThisTurn) {
					target.addVolatile('confusion', source, move);
				}
			},
		},
		target: "normal",
		type: "Fairy",
	},
    allyswitch: {
        priority: 1,
        stallingMove: false,
        onPrepareHit() { },
        onHit(pokemon) {
            const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
            if (!pokemon.side.active[newPosition])
                return false;
            if (pokemon.side.active[newPosition].fainted)
                return false;
            this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
        },
        num: 502,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Ally Switch",
        pp: 15,
        flags: {},
        onTryHit(source) {
            if (source.side.active.length === 1)
                return false;
            if (source.side.active.length === 3 && source.position === 1)
                return false;
        },
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    amnesia: {
        boosts: {"spa":2,"spd":2},
        num: 133,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Amnesia",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    anchorshot: {
        isNonstandard: null,
        num: 677,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Anchor Shot",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100},
        target: "normal",
        type: "Steel",
        contestType: "Tough"
    },
    ancientpower: {
        flags: {"contact":1,"protect":1,"mirror":1},
        num: 246,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Ancient Power",
        pp: 5,
        priority: 0,
        secondary: {"chance":10,"self":{"boosts":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}},
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    appleacid: {
        num: 787,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Apple Acid",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spd":-1}},
        target: "normal",
        type: "Grass"
    },
    aquacutter: {
        num: 895,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Aqua Cutter",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"slicing":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    aquajet: {
        num: 453,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Aqua Jet",
        pp: 20,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    aquaring: {
        flags: {},
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Aqua Ring');
            },
			onResidualOrder: 10,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
                this.heal(pokemon.baseMaxhp / 16);
            } 
		},
        num: 392,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Aqua Ring",
        pp: 20,
        priority: 0,
        volatileStatus: "aquaring",
        secondary: null,
        target: "self",
        type: "Water",
        zMove: {"boost":{"def":1}},
        contestType: "Beautiful"
    },
    aquastep: {
        num: 872,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Aqua Step",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"dance":1},
        secondary: {"chance":100,"self":{"boosts":{"spe":1}}},
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    aquatail: {
        num: 401,
        accuracy: 90,
        basePower: 90,
        category: "Physical",
        name: "Aqua Tail",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    armorcannon: {
        num: 890,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Armor Cannon",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"def":-1,"spd":-1}},
        secondary: null,
        target: "normal",
        type: "Fire"
    },
    armthrust: {
        num: 292,
        accuracy: 100,
        basePower: 15,
        category: "Physical",
        name: "Arm Thrust",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    aromatherapy: {
        onHit(target, source) {
            this.add('-cureteam', source, '[from] move: Aromatherapy');
            const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
            for (const ally of allies) {
                ally.clearStatus();
            }
        },
        isNonstandard: null,
        num: 312,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Aromatherapy",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"distance":1},
        target: "allyTeam",
        type: "Grass",
        zMove: {"effect":"heal"},
        contestType: "Clever"
    },
    aromaticmist: {
        num: 597,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Aromatic Mist",
        pp: 20,
        priority: 0,
        flags: {"bypasssub":1},
        boosts: {"spd":1},
        secondary: null,
        target: "adjacentAlly",
        type: "Fairy",
        zMove: {"boost":{"spd":2}},
        contestType: "Beautiful"
    },
    assist: {
        flags: {"noassist":1,"failcopycat":1,"nosleeptalk":1},
        isNonstandard: null,
        num: 274,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Assist",
        pp: 20,
        priority: 0,
        onHit(target) {
            const moves = [];
            for (const pokemon of target.side.pokemon) {
                if (pokemon === target)
                    continue;
                for (const moveSlot of pokemon.moveSlots) {
                    const moveid = moveSlot.id;
                    const move = this.dex.moves.get(moveid);
                    if (move.flags['noassist'] || move.isZ || move.isMax) {
                        continue;
                    }
                    moves.push(moveid);
                }
            }
            let randomMove = '';
            if (moves.length)
                randomMove = this.sample(moves);
            if (!randomMove) {
                return false;
            }
            this.actions.useMove(randomMove, target);
        },
        secondary: null,
        target: "self",
        type: "Normal",
        contestType: "Cute"
    },
    assurance: {
        basePower: 50,
        num: 372,
        accuracy: 100,
        basePowerCallback(pokemon, target, move) {
            if (target.hurtThisTurn) {
                this.debug('BP doubled on damaged target');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Assurance",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    astonish: {
        basePowerCallback(pokemon, target) {
            if (target.volatiles['minimize'])
                return 60;
            return 30;
        },
        num: 310,
        accuracy: 100,
        basePower: 30,
        category: "Physical",
        name: "Astonish",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Ghost",
        contestType: "Cute"
    },
    astralbarrage: {
        num: 825,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Astral Barrage",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Ghost"
    },
    attackorder: {
        num: 454,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Attack Order",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Clever"
    },
    attract: {
        num: 213,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Attract",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"bypasssub":1},
        volatileStatus: "attract",
        condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
                if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
                    this.debug('incompatible gender');
                    return false;
                }
                if (!this.runEvent('Attract', pokemon, source)) {
                    this.debug('Attract event failed');
                    return false;
                }
                if (effect.name === 'Cute Charm') {
                    this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
                }
                else if (effect.name === 'Destiny Knot') {
                    this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
                }
                else {
                    this.add('-start', pokemon, 'Attract');
                }
            },
			onUpdate(pokemon) {
                if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
                    this.debug('Removing Attract volatile on ' + pokemon);
                    pokemon.removeVolatile('attract');
                }
            },
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
                this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
                if (this.randomChance(1, 2)) {
                    this.add('cant', pokemon, 'Attract');
                    return false;
                }
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Attract', '[silent]');
            } 
		},
        onTryImmunity(target, source) {
            return (target.gender === 'M' && source.gender === 'F') || (target.gender === 'F' && source.gender === 'M');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    aurasphere: {
        basePower: 90,
        num: 396,
        accuracy: true,
        category: "Special",
        name: "Aura Sphere",
        pp: 20,
        priority: 0,
        flags: {"bullet":1,"protect":1,"pulse":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Fighting",
        contestType: "Beautiful"
    },
    aurawheel: {
        isNonstandard: null,
        num: 783,
        accuracy: 100,
        basePower: 110,
        category: "Physical",
        name: "Aura Wheel",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"self":{"boosts":{"spe":1}}},
        onTry(source) {
            if (source.species.baseSpecies === 'Morpeko') {
                return;
            }
            this.attrLastMove('[still]');
            this.add('-fail', source, 'move: Aura Wheel');
            this.hint("Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.");
            return null;
        },
        onModifyType(move, pokemon) {
            if (pokemon.species.name === 'Morpeko-Hangry') {
                move.type = 'Dark';
            }
            else {
                move.type = 'Electric';
            }
        },
        target: "normal",
        type: "Electric"
    },
    aurorabeam: {
        secondary: {"chance":33,"boosts":{"atk":-1}},
        num: 62,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Aurora Beam",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    auroraveil: {
        onTry() {
            return this.field.isWeather('hail');
        },
        num: 694,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Aurora Veil",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        sideCondition: "auroraveil",
        condition: {
			duration: 5,
			durationCallback(target, source, effect) {
                if (source?.hasItem('lightclay')) {
                    return 8;
                }
                return 5;
            },
			onAnyModifyDamage(damage, source, target, move) {
                if (target !== source && this.effectState.target.hasAlly(target)) {
                    if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
                        (target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
                        return;
                    }
                    if (!target.getMoveHitData(move).crit && !move.infiltrates) {
                        this.debug('Aurora Veil weaken');
                        if (this.activePerHalf > 1)
                            return this.chainModify([2732, 4096]);
                        return this.chainModify(0.5);
                    }
                }
            },
			onSideStart(side) {
                this.add('-sidestart', side, 'move: Aurora Veil');
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 10,
			onSideEnd(side) {
                this.add('-sideend', side, 'move: Aurora Veil');
            } 
		},
        secondary: null,
        target: "allySide",
        type: "Ice",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    autotomize: {
        volatileStatus: "autotomize",
        onHit(pokemon) {
        },
        condition: {
			noCopy: true,
			onStart(pokemon) {
                if (pokemon.species.weighthg > 1) {
                    this.effectState.multiplier = 1;
                    this.add('-start', pokemon, 'Autotomize');
                }
            },
			onRestart(pokemon) {
                if (pokemon.species.weighthg - (this.effectState.multiplier * 1000) > 1) {
                    this.effectState.multiplier++;
                    this.add('-start', pokemon, 'Autotomize');
                }
            },
			onModifyWeightPriority: 2,
			onModifyWeight(weighthg, pokemon) {
                if (this.effectState.multiplier) {
                    weighthg -= this.effectState.multiplier * 1000;
                    if (weighthg < 1)
                        weighthg = 1;
                    return weighthg;
                }
            } 
		},
        isNonstandard: null,
        num: 475,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Autotomize",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        onTryHit(pokemon) {
            const hasContrary = pokemon.hasAbility('contrary');
            if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) {
                return false;
            }
        },
        boosts: {"spe":2},
        secondary: null,
        target: "self",
        type: "Steel",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    avalanche: {
        num: 419,
        accuracy: 100,
        basePower: 60,
        basePowerCallback(pokemon, target, move) {
            const damagedByTarget = pokemon.attackedBy.some(p => p.source === target && p.damage > 0 && p.thisTurn);
            if (damagedByTarget) {
                this.debug('BP doubled for getting hit by ' + target);
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Avalanche",
        pp: 10,
        priority: -4,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    axekick: {
        num: 853,
        accuracy: 90,
        basePower: 120,
        category: "Physical",
        name: "Axe Kick",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        hasCrashDamage: true,
        onMoveFail(target, source, move) {
            this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
        },
        secondary: {"chance":30,"volatileStatus":"confusion"},
        target: "normal",
        type: "Fighting"
    },
    babydolleyes: {
        num: 608,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Baby-Doll Eyes",
        pp: 30,
        priority: 1,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        boosts: {"atk":-1},
        secondary: null,
        target: "normal",
        type: "Fairy",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    baddybad: {
        accuracy: 100,
        basePower: 90,
        num: 737,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Baddy Bad",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"sideCondition":"reflect"},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    banefulbunker: {
        num: 661,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Baneful Bunker",
        pp: 10,
        priority: 4,
        flags: {"noassist":1,"failcopycat":1},
        stallingMove: true,
        volatileStatus: "banefulbunker",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'move: Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect']) {
                    if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id))
                        return;
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                if (move.smartTarget) {
                    move.smartTarget = false;
                }
                else {
                    this.add('-activate', target, 'move: Protect');
                }
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                if (this.checkMoveMakesContact(move, source, target)) {
                    source.trySetStatus('psn', target);
                }
                return this.NOT_FAIL;
            },
			onHit(target, source, move) {
                if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
                    source.trySetStatus('psn', target);
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    barbbarrage: {
        num: 839,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Barb Barrage",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower, pokemon, target) {
            if (target.status === 'psn' || target.status === 'tox') {
                return this.chainModify(2);
            }
        },
        secondary: {"chance":50,"status":"psn"},
        target: "normal",
        type: "Poison"
    },
    barrage: {
        isNonstandard: null,
        num: 140,
        accuracy: 85,
        basePower: 15,
        category: "Physical",
        name: "Barrage",
        pp: 20,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    barrier: {
        pp: 30,
        isNonstandard: null,
        num: 112,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Barrier",
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":2},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cool"
    },
    batonpass: {
        num: 226,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Baton Pass",
        pp: 40,
        priority: 0,
        flags: {},
        onTryHit(target) {
            if (!this.canSwitch(target.side) || target.volatiles['commanded']) {
                this.attrLastMove('[still]');
                this.add('-fail', target);
                return this.NOT_FAIL;
            }
        },
        self: {},
        selfSwitch: "copyvolatile",
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    beakblast: {
        isNonstandard: null,
        num: 690,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Beak Blast",
        pp: 15,
        priority: -3,
        flags: {"bullet":1,"protect":1,"noassist":1,"failmefirst":1,"nosleeptalk":1,"failcopycat":1,"failinstruct":1},
        priorityChargeCallback(pokemon) {
            pokemon.addVolatile('beakblast');
        },
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'move: Beak Blast');
            },
			onHit(target, source, move) {
                if (this.checkMoveMakesContact(move, source, target)) {
                    source.trySetStatus('brn', target);
                }
            } 
		},
        onAfterMove(pokemon) {
            pokemon.removeVolatile('beakblast');
        },
        secondary: null,
        target: "normal",
        type: "Flying",
        contestType: "Tough"
    },
    beatup: {
        onModifyMove(move, pokemon) {
            move.type = '???';
            move.category = 'Special';
            move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
            move.multihit = move.allies.length;
        },
        condition: {
			duration: 1,
			onModifySpAPriority: -101,
			onModifySpA(atk, pokemon, defender, move) {
                // https://www.smogon.com/forums/posts/8992145/
                // this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
                this.event.modifier = 1;
                return move.allies.shift().species.baseStats.atk;
            },
			onFoeModifySpDPriority: -101,
			onFoeModifySpD(def, pokemon) {
                this.event.modifier = 1;
                return pokemon.species.baseStats.def;
            } 
		},
        basePower: 10,
        basePowerCallback(pokemon, target, move) {
            if (!move.allies?.length)
                return null;
            return 10;
        },
        num: 251,
        accuracy: 100,
        category: "Special",
        name: "Beat Up",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    behemothbash: {
        num: 782,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Behemoth Bash",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"failcopycat":1,"failmimic":1},
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    behemothblade: {
        num: 781,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Behemoth Blade",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1,"failcopycat":1,"failmimic":1},
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    belch: {
        flags: {"protect":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1},
        num: 562,
        accuracy: 90,
        basePower: 120,
        category: "Special",
        name: "Belch",
        pp: 10,
        priority: 0,
        onDisableMove(pokemon) {
            if (!pokemon.ateBerry)
                pokemon.disableMove('belch');
        },
        secondary: null,
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    bellydrum: {
        onHit(target) {
            if (target.boosts.atk >= 6) {
                return false;
            }
            if (target.hp <= target.maxhp / 2) {
                this.boost({ atk: 2 }, null, null, this.dex.conditions.get('bellydrum2'));
                return false;
            }
            this.directDamage(target.maxhp / 2);
            const originalStage = target.boosts.atk;
            let currentStage = originalStage;
            let boosts = 0;
            let loopStage = 0;
            while (currentStage < 6) {
                loopStage = currentStage;
                currentStage++;
                if (currentStage < 6)
                    currentStage++;
                target.boosts.atk = loopStage;
                if (target.getStat('atk', false, true) < 999) {
                    target.boosts.atk = currentStage;
                    continue;
                }
                target.boosts.atk = currentStage - 1;
                break;
            }
            boosts = target.boosts.atk - originalStage;
            target.boosts.atk = originalStage;
            this.boost({ atk: boosts });
        },
        num: 187,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Belly Drum",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Cute"
    },
    bestow: {
        flags: {"protect":1,"mirror":1,"noassist":1,"failcopycat":1},
        isNonstandard: null,
        num: 516,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Bestow",
        pp: 15,
        priority: 0,
        onHit(target, source, move) {
            if (target.item) {
                return false;
            }
            const myItem = source.takeItem();
            if (!myItem)
                return false;
            if (!this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem) || !target.setItem(myItem)) {
                source.item = myItem.id;
                return false;
            }
            this.add('-item', target, myItem.name, '[from] move: Bestow', '[of] ' + source);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":2}},
        contestType: "Cute"
    },
    bide: {
        priority: 0,
        accuracy: true,
        condition: {
			onStart(pokemon) {
                this.effectState.damage = 0;
                this.effectState.time = this.random(2, 4);
                this.add('-start', pokemon, 'Bide');
            },
			onBeforeMove(pokemon, t, move) {
                const currentMove = this.dex.getActiveMove('bide');
                this.effectState.damage += this.lastDamage;
                this.effectState.time--;
                if (!this.effectState.time) {
                    this.add('-end', pokemon, currentMove);
                    if (!this.effectState.damage) {
                        this.debug("Bide failed because no damage was stored");
                        this.add('-fail', pokemon);
                        pokemon.removeVolatile('bide');
                        return false;
                    }
                    const target = this.getRandomTarget(pokemon, 'Pound');
                    this.actions.moveHit(target, pokemon, currentMove, { damage: this.effectState.damage * 2 });
                    pokemon.removeVolatile('bide');
                    return false;
                }
                this.add('-activate', pokemon, 'Bide');
                return false;
            },
			onDisableMove(pokemon) {
                if (!pokemon.hasMove('bide')) {
                    return;
                }
                for (const moveSlot of pokemon.moveSlots) {
                    if (moveSlot.id !== 'bide') {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            } 
		},
        type: "???",
        isNonstandard: null,
        num: 117,
        basePower: 0,
        category: "Physical",
        name: "Bide",
        pp: 10,
        flags: {"contact":1,"protect":1,"nosleeptalk":1,"failinstruct":1},
        volatileStatus: "bide",
        ignoreImmunity: true,
        beforeMoveCallback(pokemon) {
            if (pokemon.volatiles['bide'])
                return true;
        },
        secondary: null,
        target: "self",
        contestType: "Tough"
    },
    bind: {
        ignoreImmunity: true,
        volatileStatus: "partiallytrapped1",
        self: {"volatileStatus":"partialtrappinglock"},
        onHit(target, source) {
            /**
             * The duration of the partially trapped must be always renewed to 2
             * so target doesn't move on trapper switch out as happens in gen 1.
             * However, this won't happen if there's no switch and the trapper is
             * about to end its partial trapping.
             **/
            if (target.volatiles['partiallytrapped1']) {
                if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
                    target.volatiles['partiallytrapped1'].duration = 2;
                }
            }
        },
        accuracy: 75,
        num: 20,
        basePower: 15,
        category: "Physical",
        name: "Bind",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    bite: {
        category: "Physical",
        secondary: {"chance":10,"volatileStatus":"flinch"},
        type: "Normal",
        num: 44,
        accuracy: 100,
        basePower: 60,
        name: "Bite",
        pp: 25,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        target: "normal",
        contestType: "Tough"
    },
    bitterblade: {
        num: 891,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Bitter Blade",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Fire"
    },
    bittermalice: {
        num: 841,
        accuracy: 100,
        basePower: 75,
        category: "Special",
        name: "Bitter Malice",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"atk":-1}},
        target: "normal",
        type: "Ghost"
    },
    blackholeeclipse: {
        isNonstandard: null,
        num: 654,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Black Hole Eclipse",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "darkiniumz",
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Cool"
    },
    blastburn: {
        num: 307,
        accuracy: 90,
        basePower: 150,
        category: "Special",
        name: "Blast Burn",
        pp: 5,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    blazekick: {
        num: 299,
        accuracy: 90,
        basePower: 85,
        category: "Special",
        name: "Blaze Kick",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        critRatio: 2,
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Cool"
    },
    blazingtorque: {
        num: 896,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        isNonstandard: "Unobtainable",
        name: "Blazing Torque",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"failencore":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Fire"
    },
    bleakwindstorm: {
        num: 846,
        accuracy: 80,
        basePower: 100,
        category: "Special",
        name: "Bleakwind Storm",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        onModifyMove(move, pokemon, target) {
            if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
                move.accuracy = true;
            }
        },
        secondary: {"chance":30,"boosts":{"spe":-1}},
        target: "allAdjacentFoes",
        type: "Flying"
    },
    blizzard: {
        accuracy: 90,
        target: "normal",
        onModifyMove() { },
        basePower: 120,
        num: 59,
        category: "Special",
        name: "Blizzard",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: {"chance":30,"status":"frz"},
        type: "Ice",
        contestType: "Beautiful"
    },
    block: {
        flags: {"protect":1,"reflectable":1,"mirror":1},
        num: 335,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Block",
        pp: 5,
        priority: 0,
        onHit(target, source, move) {
            return target.addVolatile('trapped', source, move, 'trapper');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    bloodmoon: {
		num: 901,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Blood Moon",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, cantusetwice: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
    bloomdoom: {
        isNonstandard: null,
        num: 644,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Bloom Doom",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "grassiumz",
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    blueflare: {
        isNonstandard: null,
        num: 551,
        accuracy: 85,
        basePower: 130,
        category: "Special",
        name: "Blue Flare",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":20,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    bodypress: {
        num: 776,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Body Press",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        overrideOffensiveStat: "def",
        secondary: null,
        target: "normal",
        type: "Fighting"
    },
    bodyslam: {
        num: 34,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        name: "Body Slam",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    boltbeak: {
        isNonstandard: null,
        num: 754,
        accuracy: 100,
        basePower: 85,
        basePowerCallback(pokemon, target, move) {
            if (target.newlySwitched || this.queue.willMove(target)) {
                this.debug('Bolt Beak damage boost');
                return move.basePower * 2;
            }
            this.debug('Bolt Beak NOT boosted');
            return move.basePower;
        },
        category: "Physical",
        name: "Bolt Beak",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric"
    },
    boltstrike: {
        isNonstandard: null,
        num: 550,
        accuracy: 85,
        basePower: 130,
        category: "Physical",
        name: "Bolt Strike",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Beautiful"
    },
    boneclub: {
        isNonstandard: null,
        num: 125,
        accuracy: 85,
        basePower: 65,
        category: "Physical",
        name: "Bone Club",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"flinch"},
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    bonemerang: {
        isNonstandard: null,
        num: 155,
        accuracy: 90,
        basePower: 50,
        category: "Physical",
        name: "Bonemerang",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Ground",
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    bonerush: {
        accuracy: 80,
        num: 198,
        basePower: 25,
        category: "Physical",
        name: "Bone Rush",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Ground",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    boomburst: {
        num: 586,
        accuracy: 100,
        basePower: 140,
        category: "Special",
        name: "Boomburst",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: null,
        target: "allAdjacent",
        type: "Normal",
        contestType: "Tough"
    },
    bounce: {
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"gravity":1,"distance":1,"nosleeptalk":1},
        num: 340,
        accuracy: 85,
        basePower: 85,
        category: "Physical",
        name: "Bounce",
        pp: 5,
        priority: 0,
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
                if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
                    return;
                }
                return false;
            },
			onSourceBasePower(basePower, target, source, move) {
                if (move.id === 'gust' || move.id === 'twister') {
                    return this.chainModify(2);
                }
            } 
		},
        secondary: {"chance":30,"status":"par"},
        target: "any",
        type: "Flying",
        contestType: "Cute"
    },
    bouncybubble: {
        basePower: 90,
        pp: 15,
        num: 733,
        accuracy: 100,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Bouncy Bubble",
        priority: 0,
        flags: {"protect":1,"mirror":1,"heal":1},
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Clever"
    },
    branchpoke: {
        num: 785,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Branch Poke",
        pp: 40,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass"
    },
    bravebird: {
        recoil: [1,3],
        num: 413,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Brave Bird",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    breakingswipe: {
        num: 784,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Breaking Swipe",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"atk":-1}},
        target: "allAdjacentFoes",
        type: "Dragon"
    },
    breakneckblitz: {
        isNonstandard: null,
        num: 622,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Breakneck Blitz",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "normaliumz",
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    brickbreak: {
        onTryHit(target, source) {
            // will shatter screens through sub, before you hit
            const foe = source.side.foe;
            foe.removeSideCondition('reflect');
            foe.removeSideCondition('lightscreen');
        },
        num: 280,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Brick Break",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    brine: {
        num: 362,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Brine",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower, pokemon, target) {
            if (target.hp * 2 <= target.maxhp) {
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    brutalswing: {
        num: 693,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Brutal Swing",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacent",
        type: "Dark",
        contestType: "Tough"
    },
    bubble: {
        secondary: {"chance":33,"boosts":{"spe":-1}},
        target: "normal",
        basePower: 20,
        isNonstandard: null,
        num: 145,
        accuracy: 100,
        category: "Special",
        name: "Bubble",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        type: "Water",
        contestType: "Cute"
    },
    bubblebeam: {
        secondary: {"chance":33,"boosts":{"spe":-1}},
        num: 61,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Bubble Beam",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    bugbite: {
        num: 450,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Bug Bite",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onHit(target, source) {
            const item = target.getItem();
            if (source.hp && item.isBerry && target.takeItem(source)) {
                this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] ' + source);
                if (this.singleEvent('Eat', item, null, source, null, null)) {
                    this.runEvent('EatItem', source, null, null, item);
                    if (item.id === 'leppaberry')
                        target.staleness = 'external';
                }
                if (item.onEat)
                    source.ateBerry = true;
            }
        },
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    bugbuzz: {
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 405,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Bug Buzz",
        pp: 10,
        priority: 0,
        secondary: {"chance":10,"boosts":{"spd":-1}},
        target: "normal",
        type: "Bug",
        contestType: "Beautiful"
    },
    bulkup: {
        num: 339,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Bulk Up",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1,"def":1},
        secondary: null,
        target: "self",
        type: "Fighting",
        zMove: {"boost":{"atk":1}},
        contestType: "Cool"
    },
    bulldoze: {
        num: 523,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Bulldoze",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "allAdjacent",
        type: "Ground",
        contestType: "Tough"
    },
    bulletpunch: {
        num: 418,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Bullet Punch",
        pp: 30,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Tough"
    },
    bulletseed: {
        basePower: 10,
        num: 331,
        accuracy: 100,
        category: "Special",
        name: "Bullet Seed",
        pp: 30,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    burningbulwark: {
		num: 908,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Burning Bulwark",
		pp: 10,
		priority: 4,
		flags: {noassist: 1, failcopycat: 1},
		stallingMove: true,
		volatileStatus: 'burningbulwark',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},
    burningjealousy: {
        num: 807,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Burning Jealousy",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100},
        target: "allAdjacentFoes",
        type: "Fire",
        contestType: "Tough"
    },
    burnup: {
        num: 682,
        accuracy: 100,
        basePower: 130,
        category: "Special",
        name: "Burn Up",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        onTryMove(pokemon, target, move) {
            if (pokemon.hasType('Fire'))
                return;
            this.add('-fail', pokemon, 'move: Burn Up');
            this.attrLastMove('[still]');
            return null;
        },
        self: {},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Clever"
    },
    buzzybuzz: {
        basePower: 90,
        pp: 15,
        num: 734,
        accuracy: 100,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Buzzy Buzz",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Clever"
    },
    calmmind: {
        num: 347,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Calm Mind",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"spa":1,"spd":1},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    camouflage: {
        onHit(target) {
            if (target.hasType('Normal') || !target.setType('Normal'))
                return false;
            this.add('-start', target, 'typechange', 'Normal');
        },
        isNonstandard: null,
        num: 293,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Camouflage",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"evasion":1}},
        contestType: "Clever"
    },
    captivate: {
        isNonstandard: null,
        num: 445,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Captivate",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        onTryImmunity(pokemon, source) {
            return (pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M');
        },
        boosts: {"spa":-2},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        zMove: {"boost":{"spd":2}},
        contestType: "Cute"
    },
    catastropika: {
        isNonstandard: null,
        num: 658,
        accuracy: true,
        basePower: 210,
        category: "Physical",
        name: "Catastropika",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "pikaniumz",
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    ceaselessedge: {
        num: 845,
        accuracy: 90,
        basePower: 65,
        category: "Physical",
        name: "Ceaseless Edge",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        onAfterHit(target, source, move) {
            if (!move.hasSheerForce && source.hp) {
                for (const side of source.side.foeSidesWithConditions()) {
                    side.addSideCondition('spikes');
                }
            }
        },
        onAfterSubDamage(damage, target, source, move) {
            if (!move.hasSheerForce && source.hp) {
                for (const side of source.side.foeSidesWithConditions()) {
                    side.addSideCondition('spikes');
                }
            }
        },
        secondary: {},
        target: "normal",
        type: "Dark"
    },
    celebrate: {
        flags: {"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1},
        num: 606,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Celebrate",
        pp: 40,
        priority: 0,
        onTryHit(target, source) {
            this.add('-activate', target, 'move: Celebrate');
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Cute"
    },
    charge: {
        boosts: null,
        condition: {
			onStart(pokemon, source, effect) {
                this.add('-start', pokemon, 'Charge');
            },
			onRestart(pokemon, source, effect) {
                this.add('-start', pokemon, 'Charge');
            },
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
                if (move.type === 'Electric') {
                    this.debug('charge boost');
                    return this.chainModify(2);
                }
            },
			onMoveAborted(pokemon, target, move) {
                if (move.id !== 'charge') {
                    pokemon.removeVolatile('charge');
                }
            },
			onAfterMove(pokemon, target, move) {
                if (move.id !== 'charge') {
                    pokemon.removeVolatile('charge');
                }
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Charge', '[silent]');
            } 
		},
        num: 268,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Charge",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "charge",
        secondary: null,
        target: "self",
        type: "Electric",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    chargebeam: {
        num: 451,
        accuracy: 90,
        basePower: 50,
        category: "Special",
        name: "Charge Beam",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":70,"self":{"boosts":{"spa":1}}},
        target: "normal",
        type: "Electric",
        contestType: "Beautiful"
    },
    charm: {
        type: "Normal",
        num: 204,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Charm",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        boosts: {"atk":-2},
        secondary: null,
        target: "normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    chatter: {
        secondary: {"chance":31,"volatileStatus":"confusion"},
        basePower: 60,
        onModifyMove(move, pokemon) {
            if (pokemon.species.name !== 'Chatot')
                delete move.secondaries;
        },
        flags: {"protect":1,"sound":1,"distance":1,"noassist":1,"failcopycat":1,"failmefirst":1,"nosleeptalk":1,"failmimic":1},
        isNonstandard: null,
        num: 448,
        accuracy: 100,
        category: "Special",
        name: "Chatter",
        pp: 20,
        priority: 0,
        noSketch: true,
        target: "any",
        type: "Flying",
        contestType: "Cute"
    },
    chillingwater: {
        num: 886,
        accuracy: 100,
        basePower: 50,
        category: "Special",
        name: "Chilling Water",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"atk":-1}},
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    chillyreception: {
        num: 881,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Chilly Reception",
        pp: 10,
        priority: 0,
        flags: {},
        weather: "snow",
        selfSwitch: true,
        secondary: null,
        target: "all",
        type: "Ice"
    },
    chipaway: {
        isNonstandard: null,
        num: 498,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Chip Away",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        ignoreDefensive: true,
        ignoreEvasion: true,
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    chloroblast: {
        num: 835,
        accuracy: 95,
        basePower: 150,
        category: "Special",
        name: "Chloroblast",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        mindBlownRecoil: true,
        onAfterMove(pokemon, target, move) {
            if (move.mindBlownRecoil && !move.multihit) {
                const hpBeforeRecoil = pokemon.hp;
                this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Chloroblast'), true);
                if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
                    this.runEvent('EmergencyExit', pokemon, pokemon);
                }
            }
        },
        secondary: null,
        target: "normal",
        type: "Grass"
    },
    circlethrow: {
        num: 509,
        accuracy: 90,
        basePower: 60,
        category: "Physical",
        name: "Circle Throw",
        pp: 10,
        priority: -6,
        flags: {"contact":1,"protect":1,"mirror":1,"noassist":1,"failcopycat":1},
        forceSwitch: true,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    clamp: {
        accuracy: 75,
        pp: 10,
        volatileStatus: "partiallytrapped1",
        self: {"volatileStatus":"partialtrappinglock"},
        onHit(target, source) {
            /**
             * The duration of the partially trapped must be always renewed to 2
             * so target doesn't move on trapper switch out as happens in gen 1.
             * However, this won't happen if there's no switch and the trapper is
             * about to end its partial trapping.
             **/
            if (target.volatiles['partiallytrapped1']) {
                if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
                    target.volatiles['partiallytrapped1'].duration = 2;
                }
            }
        },
        isNonstandard: null,
        num: 128,
        basePower: 35,
        category: "Special",
        name: "Clamp",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    clangingscales: {
        isNonstandard: null,
        num: 691,
        accuracy: 100,
        basePower: 110,
        category: "Special",
        name: "Clanging Scales",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        selfBoost: {"boosts":{"def":-1}},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Dragon",
        contestType: "Tough"
    },
    clangoroussoul: {
        isNonstandard: null,
        num: 775,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Clangorous Soul",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"sound":1,"dance":1},
        onTry(source) {
            if (source.hp <= (source.maxhp * 33 / 100) || source.maxhp === 1)
                return false;
        },
        onTryHit(pokemon, target, move) {
            if (!this.boost(move.boosts))
                return null;
            delete move.boosts;
        },
        onHit(pokemon) {
            this.directDamage(pokemon.maxhp * 33 / 100);
        },
        boosts: {"atk":1,"def":1,"spa":1,"spd":1,"spe":1},
        secondary: null,
        target: "self",
        type: "Dragon"
    },
    clangoroussoulblaze: {
        isNonstandard: null,
        num: 728,
        accuracy: true,
        basePower: 185,
        category: "Special",
        name: "Clangorous Soulblaze",
        pp: 1,
        priority: 0,
        flags: {"sound":1,"bypasssub":1},
        selfBoost: {"boosts":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        isZ: "kommoniumz",
        secondary: {},
        target: "allAdjacentFoes",
        type: "Dragon",
        contestType: "Cool"
    },
    clearsmog: {
        num: 499,
        accuracy: true,
        basePower: 50,
        category: "Special",
        name: "Clear Smog",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit(target) {
            target.clearBoosts();
            this.add('-clearboost', target);
        },
        secondary: null,
        target: "normal",
        type: "Poison",
        contestType: "Beautiful"
    },
    closecombat: {
        num: 370,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Close Combat",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        self: {"boosts":{"def":-1,"spd":-1}},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    coaching: {
        num: 811,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Coaching",
        pp: 10,
        priority: 0,
        flags: {"bypasssub":1,"allyanim":1},
        secondary: null,
        boosts: {"atk":1,"def":1},
        target: "adjacentAlly",
        type: "Fighting"
    },
    coil: {
        num: 489,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Coil",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1,"def":1,"accuracy":1},
        secondary: null,
        target: "self",
        type: "Poison",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    collisioncourse: {
        num: 878,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Collision Course",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onBasePower(basePower, source, target, move) {
            if (target.runEffectiveness(move) > 0) {
                // Placeholder
                this.debug(`collision course super effective buff`);
                return this.chainModify([5461, 4096]);
            }
        },
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    combattorque: {
        num: 899,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        isNonstandard: "Unobtainable",
        name: "Combat Torque",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"failencore":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Fighting"
    },
    cometpunch: {
        isNonstandard: null,
        num: 4,
        accuracy: 85,
        basePower: 18,
        category: "Physical",
        name: "Comet Punch",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        maxMove: {"basePower":100},
        contestType: "Tough"
    },
    comeuppance: {
        num: 894,
        accuracy: 100,
        basePower: 0,
        damageCallback(pokemon) {
            const lastDamagedBy = pokemon.getLastDamagedBy(true);
            if (lastDamagedBy !== undefined) {
                return (lastDamagedBy.damage * 1.5) || 1;
            }
            return 0;
        },
        category: "Physical",
        name: "Comeuppance",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"failmefirst":1},
        onTry(source) {
            const lastDamagedBy = source.getLastDamagedBy(true);
            if (lastDamagedBy === undefined || !lastDamagedBy.thisTurn)
                return false;
        },
        onModifyTarget(targetRelayVar, source, target, move) {
            const lastDamagedBy = source.getLastDamagedBy(true);
            if (lastDamagedBy) {
                targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
            }
        },
        secondary: null,
        target: "scripted",
        type: "Dark",
        contestType: "Cool"
    },
    confide: {
        num: 590,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Confide",
        pp: 20,
        priority: 0,
        flags: {"reflectable":1,"mirror":1,"sound":1,"bypasssub":1},
        boosts: {"spa":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Cute"
    },
    confuseray: {
        num: 109,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Confuse Ray",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        volatileStatus: "confusion",
        secondary: null,
        target: "normal",
        type: "Ghost",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    confusion: {
        num: 93,
        accuracy: 100,
        basePower: 50,
        category: "Special",
        name: "Confusion",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"confusion"},
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    constrict: {
        secondary: {"chance":33,"boosts":{"spe":-1}},
        isNonstandard: null,
        num: 132,
        accuracy: 100,
        basePower: 10,
        category: "Physical",
        name: "Constrict",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    continentalcrush: {
        isNonstandard: null,
        num: 632,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Continental Crush",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "rockiumz",
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Cool"
    },
    conversion: {
        target: "normal",
        onHit(target, source) {
            source.setType(target.getTypes(true));
            this.add('-start', source, 'typechange', source.types.join('/'), '[from] move: Conversion', '[of] ' + target);
        },
        flags: {},
        isNonstandard: null,
        num: 160,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Conversion",
        pp: 30,
        priority: 0,
        secondary: null,
        type: "Normal",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Beautiful"
    },
    conversion2: {
        isNonstandard: null,
        num: 176,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Conversion 2",
        pp: 30,
        priority: 0,
        flags: {"bypasssub":1},
        onHit(target, source) {
            if (!target.lastMoveUsed) {
                return false;
            }
            const possibleTypes = [];
            const attackType = target.lastMoveUsed.type;
            for (const type of this.dex.types.names()) {
                if (source.hasType(type))
                    continue;
                const typeCheck = this.dex.types.get(type).damageTaken[attackType];
                if (typeCheck === 2 || typeCheck === 3) {
                    possibleTypes.push(type);
                }
            }
            if (!possibleTypes.length) {
                return false;
            }
            const randomType = this.sample(possibleTypes);
            if (!source.setType(randomType))
                return false;
            this.add('-start', source, 'typechange', randomType);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Beautiful"
    },
    copycat: {
        onHit(pokemon) {
            if (!this.lastMove || this.dex.moves.get(this.lastMove.id).flags['failcopycat']) {
                return false;
            }
            this.actions.useMove(this.lastMove.id, pokemon);
        },
        flags: {"noassist":1,"failcopycat":1,"nosleeptalk":1},
        num: 383,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Copycat",
        pp: 20,
        priority: 0,
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cute"
    },
    coreenforcer: {
        isNonstandard: null,
        num: 687,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Core Enforcer",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit(target) {
            if (target.getAbility().isPermanent)
                return;
            if (target.newlySwitched || this.queue.willMove(target))
                return;
            target.addVolatile('gastroacid');
        },
        onAfterSubDamage(damage, target) {
            if (target.getAbility().isPermanent)
                return;
            if (target.newlySwitched || this.queue.willMove(target))
                return;
            target.addVolatile('gastroacid');
        },
        secondary: null,
        target: "allAdjacentFoes",
        type: "Dragon",
        zMove: {"basePower":140},
        contestType: "Tough"
    },
    corkscrewcrash: {
        isNonstandard: null,
        num: 638,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Corkscrew Crash",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "steeliumz",
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    corrosivegas: {
        num: 810,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Corrosive Gas",
        pp: 40,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onHit(target, source) {
            const item = target.takeItem(source);
            if (item) {
                this.add('-enditem', target, item.name, '[from] move: Corrosive Gas', '[of] ' + source);
            }
            else {
                this.add('-fail', target, 'move: Corrosive Gas');
            }
        },
        secondary: null,
        target: "allAdjacent",
        type: "Poison"
    },
    cosmicpower: {
        isNonstandard: null,
        num: 322,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Cosmic Power",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":1,"spd":1},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"spd":1}},
        contestType: "Beautiful"
    },
    cottonguard: {
        num: 538,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Cotton Guard",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":3},
        secondary: null,
        target: "self",
        type: "Grass",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    cottonspore: {
        accuracy: 85,
        onTryHit() { },
        target: "normal",
        num: 178,
        basePower: 0,
        category: "Status",
        name: "Cotton Spore",
        pp: 40,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1},
        boosts: {"spe":-2},
        secondary: null,
        type: "Grass",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    counter: {
        ignoreImmunity: true,
        willCrit: false,
        basePower: 1,
        damageCallback(pokemon, target) {
            // Counter mechanics in gen 1:
            // - a move is Counterable if it is Normal or Fighting type, has nonzero Base Power, and is not Counter
            // - if Counter is used by the player, it will succeed if the opponent's last used move is Counterable
            // - if Counter is used by the opponent, it will succeed if the player's last selected move is Counterable
            // - (Counter will thus desync if the target's last used move is not as counterable as the target's last selected move)
            // - if Counter succeeds it will deal twice the last move damage dealt in battle (even if it's from a different pokemon because of a switch)
            const lastMove = target.side.lastMove && this.dex.moves.get(target.side.lastMove.id);
            const lastMoveIsCounterable = lastMove && lastMove.basePower > 0 &&
                ['Normal', 'Fighting'].includes(lastMove.type) && lastMove.id !== 'counter';
            const lastSelectedMove = target.side.lastSelectedMove && this.dex.moves.get(target.side.lastSelectedMove);
            const lastSelectedMoveIsCounterable = lastSelectedMove && lastSelectedMove.basePower > 0 &&
                ['Normal', 'Fighting'].includes(lastSelectedMove.type) && lastSelectedMove.id !== 'counter';
            if (!lastMoveIsCounterable && !lastSelectedMoveIsCounterable) {
                this.debug("Gen 1 Counter: last move was not Counterable");
                this.add('-fail', pokemon);
                return false;
            }
            if (this.lastDamage <= 0) {
                this.debug("Gen 1 Counter: no previous damage exists");
                this.add('-fail', pokemon);
                return false;
            }
            if (!lastMoveIsCounterable || !lastSelectedMoveIsCounterable) {
                this.hint("Desync Clause Mod activated!");
                this.add('-fail', pokemon);
                return false;
            }
            return 2 * this.lastDamage;
        },
        beforeTurnCallback() { },
        onTry() { },
        condition: {},
        priority: -1,
        num: 68,
        accuracy: 100,
        category: "Physical",
        name: "Counter",
        pp: 20,
        flags: {"contact":1,"protect":1,"failmefirst":1,"noassist":1,"failcopycat":1},
        secondary: null,
        target: "scripted",
        type: "Fighting",
        maxMove: {"basePower":75},
        contestType: "Tough"
    },
    courtchange: {
        num: 756,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Court Change",
        pp: 10,
        priority: 0,
        flags: {"mirror":1},
        onHitField(target, source) {
            const sideConditions = [
                'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'gmaxsteelsurge', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire',
            ];
            let success = false;
            if (this.gameType === "freeforall") {
                // random integer from 1-3 inclusive
                const offset = this.random(3) + 1;
                // the list of all sides in counterclockwise order
                const sides = [this.sides[0], this.sides[2], this.sides[1], this.sides[3]];
                const temp = { 0: {}, 1: {}, 2: {}, 3: {} };
                for (const side of sides) {
                    for (const id in side.sideConditions) {
                        if (!sideConditions.includes(id))
                            continue;
                        temp[side.n][id] = side.sideConditions[id];
                        delete side.sideConditions[id];
                        const effectName = this.dex.conditions.get(id).name;
                        this.add('-sideend', side, effectName, '[silent]');
                        success = true;
                    }
                }
                for (let i = 0; i < 4; i++) {
                    const sourceSideConditions = temp[sides[i].n];
                    const targetSide = sides[(i + offset) % 4]; // the next side in rotation
                    for (const id in sourceSideConditions) {
                        targetSide.sideConditions[id] = sourceSideConditions[id];
                        const effectName = this.dex.conditions.get(id).name;
                        let layers = sourceSideConditions[id].layers || 1;
                        for (; layers > 0; layers--)
                            this.add('-sidestart', targetSide, effectName, '[silent]');
                    }
                }
            }
            else {
                const sourceSideConditions = source.side.sideConditions;
                const targetSideConditions = source.side.foe.sideConditions;
                const sourceTemp = {};
                const targetTemp = {};
                for (const id in sourceSideConditions) {
                    if (!sideConditions.includes(id))
                        continue;
                    sourceTemp[id] = sourceSideConditions[id];
                    delete sourceSideConditions[id];
                    success = true;
                }
                for (const id in targetSideConditions) {
                    if (!sideConditions.includes(id))
                        continue;
                    targetTemp[id] = targetSideConditions[id];
                    delete targetSideConditions[id];
                    success = true;
                }
                for (const id in sourceTemp) {
                    targetSideConditions[id] = sourceTemp[id];
                }
                for (const id in targetTemp) {
                    sourceSideConditions[id] = targetTemp[id];
                }
                this.add('-swapsideconditions');
            }
            if (!success)
                return false;
            this.add('-activate', source, 'move: Court Change');
        },
        secondary: null,
        target: "all",
        type: "Normal"
    },
    covet: {
        flags: {"protect":1,"mirror":1,"noassist":1},
        basePower: 40,
        pp: 40,
        num: 343,
        accuracy: 100,
        category: "Physical",
        name: "Covet",
        priority: 0,
        onAfterHit(target, source, move) {
            if (source.item || source.volatiles['gem']) {
                return;
            }
            const yourItem = target.takeItem(source);
            if (!yourItem) {
                return;
            }
            if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
                !source.setItem(yourItem)) {
                target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
                return;
            }
            this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    crabhammer: {
        critRatio: 2,
        accuracy: 85,
        basePower: 90,
        num: 152,
        category: "Special",
        name: "Crabhammer",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    craftyshield: {
        isNonstandard: null,
        num: 578,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Crafty Shield",
        pp: 10,
        priority: 3,
        flags: {},
        sideCondition: "craftyshield",
        onTry() {
            return !!this.queue.willAct();
        },
        condition: {
			duration: 1,
			onSideStart(target, source) {
                this.add('-singleturn', source, 'Crafty Shield');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (['self', 'all'].includes(move.target) || move.category !== 'Status')
                    return;
                this.add('-activate', target, 'move: Crafty Shield');
                return this.NOT_FAIL;
            } 
		},
        secondary: null,
        target: "allySide",
        type: "Fairy",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    crosschop: {
        critRatio: 3,
        num: 238,
        accuracy: 80,
        basePower: 100,
        category: "Physical",
        name: "Cross Chop",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    crosspoison: {
        num: 440,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Cross Poison",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: {"chance":10,"status":"psn"},
        critRatio: 2,
        target: "normal",
        type: "Poison",
        contestType: "Cool"
    },
    crunch: {
        secondary: {"chance":20,"boosts":{"spd":-1}},
        num: 242,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Crunch",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Dark",
        contestType: "Tough"
    },
    crushclaw: {
        num: 306,
        accuracy: 95,
        basePower: 75,
        category: "Physical",
        name: "Crush Claw",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"def":-1}},
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    crushgrip: {
        basePowerCallback(pokemon, target) {
            const bp = Math.floor(target.hp * 120 / target.maxhp) + 1;
            this.debug('BP for ' + target.hp + '/' + target.maxhp + " HP: " + bp);
            return bp;
        },
        isNonstandard: null,
        num: 462,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Crush Grip",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":190},
        maxMove: {"basePower":140},
        contestType: "Tough"
    },
    curse: {
        condition: {
			onStart(pokemon, source) {
                this.add('-start', pokemon, 'Curse', '[of] ' + source);
            },
			onAfterMoveSelf(pokemon) {
                this.damage(pokemon.baseMaxhp / 4);
            } 
		},
        flags: {},
        onModifyMove(move, source, target) {
            if (!source.hasType('Ghost')) {
                delete move.volatileStatus;
                delete move.onHit;
                move.self = { boosts: { atk: 1, def: 1, spe: -1 } };
                move.target = move.nonGhostTarget;
            }
            else if (target?.volatiles['substitute']) {
                delete move.volatileStatus;
                delete move.onHit;
            }
        },
        type: "???",
        target: "normal",
        num: 174,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Curse",
        pp: 10,
        priority: 0,
        volatileStatus: "curse",
        onTryHit(target, source, move) {
            if (!source.hasType('Ghost')) {
                delete move.volatileStatus;
                delete move.onHit;
                move.self = { boosts: { spe: -1, atk: 1, def: 1 } };
            }
            else if (move.volatileStatus && target.volatiles['curse']) {
                return false;
            }
        },
        onHit(target, source) {
            this.directDamage(source.maxhp / 2, source, source);
        },
        secondary: null,
        nonGhostTarget: "self",
        zMove: {"effect":"curse"},
        contestType: "Tough"
    },
    cut: {
        num: 15,
        accuracy: 95,
        basePower: 50,
        category: "Physical",
        name: "Cut",
        pp: 30,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    darkestlariat: {
        num: 663,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        name: "Darkest Lariat",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        ignoreEvasion: true,
        ignoreDefensive: true,
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Cool"
    },
    darkpulse: {
        num: 399,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Dark Pulse",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"pulse":1,"mirror":1,"distance":1},
        secondary: {"chance":20,"volatileStatus":"flinch"},
        target: "any",
        type: "Dark",
        contestType: "Cool"
    },
    darkvoid: {
        accuracy: 80,
        onTry() { },
        isNonstandard: null,
        num: 464,
        basePower: 0,
        category: "Status",
        name: "Dark Void",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "slp",
        secondary: null,
        target: "allAdjacentFoes",
        type: "Dark",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    dazzlinggleam: {
        num: 605,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Dazzling Gleam",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Fairy",
        contestType: "Beautiful"
    },
    decorate: {
        isNonstandard: null,
        num: 777,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Decorate",
        pp: 15,
        priority: 0,
        flags: {"allyanim":1},
        secondary: null,
        boosts: {"atk":2,"spa":2},
        target: "normal",
        type: "Fairy"
    },
    defendorder: {
        num: 455,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Defend Order",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":1,"spd":1},
        secondary: null,
        target: "self",
        type: "Bug",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    defensecurl: {
        num: 111,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Defense Curl",
        pp: 40,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":1},
        volatileStatus: "defensecurl",
        condition: {
			noCopy: true,
			onRestart: () => null 
		},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cute"
    },
    defog: {
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        onHit(pokemon) {
            if (!pokemon.volatiles['substitute'])
                this.boost({ evasion: -1 });
            const sideConditions = ['reflect', 'lightscreen', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock'];
            for (const condition of sideConditions) {
                if (pokemon.side.removeSideCondition(condition)) {
                    this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Defog', '[of] ' + pokemon);
                }
            }
        },
        num: 432,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Defog",
        pp: 15,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Flying",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cool"
    },
    destinybond: {
        onPrepareHit(pokemon) {
            pokemon.removeVolatile('destinybond');
        },
        num: 194,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Destiny Bond",
        pp: 5,
        priority: 0,
        flags: {"bypasssub":1,"noassist":1,"failcopycat":1},
        volatileStatus: "destinybond",
        condition: {
			onStart(pokemon) {
                this.add('-singlemove', pokemon, 'Destiny Bond');
            },
			onFaint(target, source, effect) {
                if (!source || !effect || target.isAlly(source))
                    return;
                if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
                    if (source.volatiles['dynamax']) {
                        this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
                        return;
                    }
                    this.add('-activate', target, 'move: Destiny Bond');
                    source.faint();
                }
            },
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
                if (move.id === 'destinybond')
                    return;
                this.debug('removing Destiny Bond before attack');
                pokemon.removeVolatile('destinybond');
            },
			onMoveAborted(pokemon, target, move) {
                pokemon.removeVolatile('destinybond');
            } 
		},
        secondary: null,
        target: "self",
        type: "Ghost",
        zMove: {"effect":"redirect"},
        contestType: "Clever"
    },
    detect: {
        priority: 2,
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect'])
                    return;
                this.add('-activate', target, 'Protect');
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is NOT reset
                    if (source.volatiles['lockedmove'].trueDuration >= 2) {
                        source.volatiles['lockedmove'].duration = 2;
                    }
                }
                return null;
            } 
		},
        num: 197,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Detect",
        pp: 5,
        flags: {"noassist":1,"failcopycat":1},
        stallingMove: true,
        volatileStatus: "protect",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        secondary: null,
        target: "self",
        type: "Fighting",
        zMove: {"boost":{"evasion":1}},
        contestType: "Cool"
    },
    devastatingdrake: {
        isNonstandard: null,
        num: 652,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Devastating Drake",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "dragoniumz",
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Cool"
    },
    diamondstorm: {
        self: null,
        secondary: {"chance":50,"self":{"boosts":{"def":1}}},
        num: 591,
        accuracy: 95,
        basePower: 100,
        category: "Physical",
        name: "Diamond Storm",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "allAdjacentFoes",
        type: "Rock",
        contestType: "Beautiful"
    },
    dig: {
        basePower: 100,
        condition: {},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            attacker.addVolatile('invulnerability', defender);
            return null;
        },
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"nonsky":1,"nosleeptalk":1},
        num: 91,
        accuracy: 100,
        category: "Physical",
        name: "Dig",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    disable: {
        num: 50,
        accuracy: 55,
        basePower: 0,
        category: "Status",
        name: "Disable",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        volatileStatus: "disable",
        onTryHit(target) {
            // This function should not return if the checks are met. Adding && undefined ensures this happens.
            return target.moveSlots.some(ms => ms.pp > 0) &&
                !('disable' in target.volatiles) &&
                undefined;
        },
        condition: {
			onStart(pokemon) {
                // disable can only select moves that have pp > 0, hence the onTryHit modification
                const moveSlot = this.sample(pokemon.moveSlots.filter(ms => ms.pp > 0));
                this.add('-start', pokemon, 'Disable', moveSlot.move);
                this.effectState.move = moveSlot.id;
                // 1-8 turns (which will in effect translate to 0-7 missed turns for the target)
                this.effectState.time = this.random(1, 9);
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Disable');
            },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
                pokemon.volatiles['disable'].time--;
                if (!pokemon.volatiles['disable'].time) {
                    pokemon.removeVolatile('disable');
                    return;
                }
                if (pokemon.volatiles['bide'])
                    move = this.dex.getActiveMove('bide');
                if (move.id === this.effectState.move) {
                    this.add('cant', pokemon, 'Disable', move);
                    pokemon.removeVolatile('twoturnmove');
                    return false;
                }
            },
			onDisableMove(pokemon) {
                for (const moveSlot of pokemon.moveSlots) {
                    if (moveSlot.id === this.effectState.move) {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Normal"
    },
    disarmingvoice: {
        num: 574,
        accuracy: true,
        basePower: 40,
        category: "Special",
        name: "Disarming Voice",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Fairy",
        contestType: "Cute"
    },
    discharge: {
        num: 435,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Discharge",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "allAdjacent",
        type: "Electric",
        contestType: "Beautiful"
    },
    direclaw: {
        num: 827,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Dire Claw",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":50},
        target: "normal",
        type: "Poison"
    },
    dive: {
        basePower: 60,
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"nonsky":1,"nosleeptalk":1},
        num: 291,
        accuracy: 100,
        category: "Special",
        name: "Dive",
        pp: 10,
        priority: 0,
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
                const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
                attacker.formeChange(forme, move);
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        condition: {
			duration: 2,
			onImmunity(type, pokemon) {
                if (type === 'sandstorm' || type === 'hail')
                    return false;
            },
			onInvulnerability(target, source, move) {
                if (['surf', 'whirlpool'].includes(move.id)) {
                    return;
                }
                return false;
            },
			onSourceModifyDamage(damage, source, target, move) {
                if (move.id === 'surf' || move.id === 'whirlpool') {
                    return this.chainModify(2);
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    dizzypunch: {
        secondary: null,
        isNonstandard: null,
        num: 146,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Dizzy Punch",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    doodle: {
        num: 867,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Doodle",
        pp: 10,
        priority: 0,
        flags: {},
        onHit(target, source, move) {
            let success = false;
            for (const pokemon of source.alliesAndSelf()) {
                if (pokemon.ability === target.ability)
                    continue;
                const oldAbility = pokemon.setAbility(target.ability);
                if (oldAbility) {
                    this.add('-ability', pokemon, target.getAbility().name, '[from] move: Doodle');
                    success = true;
                }
                else if (!success && oldAbility === null) {
                    success = null;
                }
            }
            if (!success) {
                if (success === false) {
                    this.add('-fail', source);
                }
                this.attrLastMove('[still]');
                return this.NOT_FAIL;
            }
        },
        secondary: null,
        target: "adjacentFoe",
        type: "Normal"
    },
    doomdesire: {
        onTry(source, target) {
            if (!target.side.addSlotCondition(target, 'futuremove'))
                return false;
            const moveData = {
                name: "Doom Desire",
                basePower: 120,
                category: "Physical",
                flags: {},
                willCrit: false,
                type: '???',
            };
            const damage = this.actions.getDamage(source, target, moveData, true);
            Object.assign(target.side.slotConditions[target.position]['futuremove'], {
                duration: 3,
                move: 'doomdesire',
                source: source,
                moveData: {
                    id: 'doomdesire',
                    name: "Doom Desire",
                    accuracy: 85,
                    basePower: 0,
                    damage: damage,
                    category: "Physical",
                    flags: { futuremove: 1 },
                    effectType: 'Move',
                    type: '???',
                },
            });
            this.add('-start', source, 'Doom Desire');
            return null;
        },
        accuracy: 85,
        basePower: 120,
        isNonstandard: null,
        num: 353,
        category: "Physical",
        name: "Doom Desire",
        pp: 5,
        priority: 0,
        flags: {"futuremove":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Beautiful"
    },
    doubleedge: {
        basePower: 100,
        recoil: [25,100],
        num: 38,
        accuracy: 100,
        category: "Physical",
        name: "Double-Edge",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    doublehit: {
        num: 458,
        accuracy: 90,
        basePower: 35,
        category: "Physical",
        name: "Double Hit",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":140},
        maxMove: {"basePower":120},
        contestType: "Cool"
    },
    doubleironbash: {
        isNonstandard: "LGPE",
        num: 742,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Double Iron Bash",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        multihit: 2,
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Steel",
        zMove: {"basePower":180},
        maxMove: {"basePower":140},
        contestType: "Clever"
    },
    doublekick: {
        num: 24,
        accuracy: 100,
        basePower: 30,
        category: "Physical",
        name: "Double Kick",
        pp: 30,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Fighting",
        maxMove: {"basePower":80},
        contestType: "Cool"
    },
    doubleshock: {
        num: 892,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Double Shock",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onTryMove(pokemon, target, move) {
            if (pokemon.hasType('Electric'))
                return;
            this.add('-fail', pokemon, 'move: Double Shock');
            this.attrLastMove('[still]');
            return null;
        },
        self: {},
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Clever"
    },
    doubleslap: {
        isNonstandard: null,
        num: 3,
        accuracy: 85,
        basePower: 15,
        category: "Physical",
        name: "Double Slap",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    doubleteam: {
        num: 104,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Double Team",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"evasion":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cool"
    },
    dracometeor: {
        basePower: 140,
        num: 434,
        accuracy: 90,
        category: "Special",
        name: "Draco Meteor",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"spa":-2}},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Beautiful"
    },
    dragonascent: {
        num: 620,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Dragon Ascent",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        self: {"boosts":{"def":-1,"spd":-1}},
        target: "any",
        type: "Flying",
        contestType: "Beautiful"
    },
    dragonbreath: {
        num: 225,
        accuracy: 100,
        basePower: 60,
        category: "Special",
        name: "Dragon Breath",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Dragon",
        contestType: "Cool"
    },
    dragoncheer: {
		num: 913,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Cheer",
		pp: 15,
		priority: 0,
		flags: {bypasssub: 1, allyanim: 1},
		volatileStatus: 'dragoncheer',
		condition: {
			onStart(target, source, effect) {
				if (target.volatiles['focusenergy']) return false;
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Dragon Cheer', '[silent]');
				} else {
					this.add('-start', target, 'move: Dragon Cheer');
				}
				// Store at the start because the boost doesn't change if a Pokemon
				// Terastallizes into Dragon while having this volatile
				// Found by DarkFE:
				// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9894139
				this.effectState.hasDragonType = target.hasType("Dragon");
			},
			onModifyCritRatio(critRatio, source) {
				return critRatio + (this.effectState.hasDragonType ? 2 : 1);
			},
		},
		secondary: null,
		target: "adjacentAlly",
		type: "Dragon",
	},
    dragonclaw: {
        num: 337,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Dragon Claw",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Cool"
    },
    dragondance: {
        num: 349,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Dragon Dance",
        pp: 20,
        priority: 0,
        flags: {"snatch":1,"dance":1},
        boosts: {"atk":1,"spe":1},
        secondary: null,
        target: "self",
        type: "Dragon",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cool"
    },
    dragondarts: {
        num: 751,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Dragon Darts",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"noparentalbond":1},
        multihit: 2,
        smartTarget: true,
        secondary: null,
        target: "normal",
        type: "Dragon",
        maxMove: {"basePower":130}
    },
    dragonenergy: {
        num: 820,
        accuracy: 100,
        basePower: 150,
        basePowerCallback(pokemon, target, move) {
            const bp = move.basePower * pokemon.hp / pokemon.maxhp;
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Dragon Energy",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Dragon"
    },
    dragonhammer: {
        isNonstandard: null,
        num: 692,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Dragon Hammer",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Tough"
    },
    dragonpulse: {
        basePower: 90,
        num: 406,
        accuracy: 100,
        category: "Special",
        name: "Dragon Pulse",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"pulse":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Dragon",
        contestType: "Beautiful"
    },
    dragonrage: {
        basePower: 1,
        isNonstandard: null,
        num: 82,
        accuracy: 100,
        damage: 40,
        category: "Special",
        name: "Dragon Rage",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Cool"
    },
    dragonrush: {
        num: 407,
        accuracy: 75,
        basePower: 100,
        category: "Physical",
        name: "Dragon Rush",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"volatileStatus":"flinch"},
        target: "normal",
        type: "Dragon",
        contestType: "Tough"
    },
    dragontail: {
        num: 525,
        accuracy: 90,
        basePower: 60,
        category: "Physical",
        name: "Dragon Tail",
        pp: 10,
        priority: -6,
        flags: {"contact":1,"protect":1,"mirror":1,"noassist":1,"failcopycat":1},
        forceSwitch: true,
        target: "normal",
        type: "Dragon",
        contestType: "Tough"
    },
    drainingkiss: {
        num: 577,
        accuracy: 100,
        basePower: 50,
        category: "Special",
        name: "Draining Kiss",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"heal":1},
        drain: [3,4],
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Cute"
    },
    drainpunch: {
        basePower: 60,
        pp: 5,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        num: 409,
        accuracy: 100,
        category: "Physical",
        name: "Drain Punch",
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    dreameater: {
        onTryImmunity(target) {
            return target.status === 'slp' && !target.volatiles['substitute'];
        },
        flags: {"protect":1,"mirror":1},
        num: 138,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Dream Eater",
        pp: 15,
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    drillpeck: {
        num: 65,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Drill Peck",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    drillrun: {
        num: 529,
        accuracy: 95,
        basePower: 80,
        category: "Physical",
        name: "Drill Run",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    drumbeating: {
        num: 778,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Drum Beating",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "normal",
        type: "Grass"
    },
    dualchop: {
        isNonstandard: null,
        num: 530,
        accuracy: 90,
        basePower: 40,
        category: "Physical",
        name: "Dual Chop",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Dragon",
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    dualwingbeat: {
        num: 814,
        accuracy: 90,
        basePower: 40,
        category: "Physical",
        name: "Dual Wingbeat",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Flying",
        maxMove: {"basePower":130}
    },
    dynamaxcannon: {
        num: 744,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Dynamax Cannon",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"failencore":1,"nosleeptalk":1,"noparentalbond":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: null,
        target: "normal",
        type: "Dragon"
    },
    dynamicpunch: {
        num: 223,
        accuracy: 50,
        basePower: 100,
        category: "Physical",
        name: "Dynamic Punch",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":100,"volatileStatus":"confusion"},
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    earthpower: {
        num: 414,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Earth Power",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: {"chance":10,"boosts":{"spd":-1}},
        target: "normal",
        type: "Ground",
        contestType: "Beautiful"
    },
    earthquake: {
        num: 89,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Earthquake",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "allAdjacent",
        type: "Ground",
        contestType: "Tough"
    },
    echoedvoice: {
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 497,
        accuracy: 100,
        basePower: 40,
        basePowerCallback(pokemon, target, move) {
            let bp = move.basePower;
            if (this.field.pseudoWeather.echoedvoice) {
                bp = move.basePower * this.field.pseudoWeather.echoedvoice.multiplier;
            }
            this.debug('BP: ' + move.basePower);
            return bp;
        },
        category: "Special",
        name: "Echoed Voice",
        pp: 15,
        priority: 0,
        onTry() {
            this.field.addPseudoWeather('echoedvoice');
        },
        condition: {
			duration: 2,
			onFieldStart() {
                this.effectState.multiplier = 1;
            },
			onFieldRestart() {
                if (this.effectState.duration !== 2) {
                    this.effectState.duration = 2;
                    if (this.effectState.multiplier < 5) {
                        this.effectState.multiplier++;
                    }
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Beautiful"
    },
    eerieimpulse: {
        num: 598,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Eerie Impulse",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"spa":-2},
        secondary: null,
        target: "normal",
        type: "Electric",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    eeriespell: {
        num: 826,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Eerie Spell",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: {"chance":100},
        target: "normal",
        type: "Psychic"
    },
    eggbomb: {
        isNonstandard: null,
        num: 121,
        accuracy: 75,
        basePower: 100,
        category: "Physical",
        name: "Egg Bomb",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    electricterrain: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasItem('terrainextender')) {
                    return 8;
                }
                return 5;
            },
			onSetStatus(status, target, source, effect) {
                if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
                    if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
                        this.add('-activate', target, 'move: Electric Terrain');
                    }
                    return false;
                }
            },
			onTryAddVolatile(status, target) {
                if (!target.isGrounded() || target.isSemiInvulnerable())
                    return;
                if (status.id === 'yawn') {
                    this.add('-activate', target, 'move: Electric Terrain');
                    return null;
                }
            },
			onBasePower(basePower, attacker, defender, move) {
                if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
                    this.debug('electric terrain boost');
                    return this.chainModify(1.5);
                }
            },
			onFieldStart(field, source, effect) {
                if (effect && effect.effectType === 'Ability') {
                    this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
                }
                else {
                    this.add('-fieldstart', 'move: Electric Terrain');
                }
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
                this.add('-fieldend', 'move: Electric Terrain');
            } 
		},
        num: 604,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Electric Terrain",
        pp: 10,
        priority: 0,
        flags: {"nonsky":1},
        terrain: "electricterrain",
        secondary: null,
        target: "all",
        type: "Electric",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    electrify: {
        isNonstandard: null,
        num: 582,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Electrify",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1},
        volatileStatus: "electrify",
        onTryHit(target) {
            if (!this.queue.willMove(target) && target.activeTurns)
                return false;
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'move: Electrify');
            },
			onModifyTypePriority: -2,
			onModifyType(move) {
                if (move.id !== 'struggle') {
                    this.debug('Electrify making move type electric');
                    move.type = 'Electric';
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Electric",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    electroball: {
        basePowerCallback(pokemon, target) {
            const ratio = Math.floor(pokemon.getStat('spe') / Math.max(1, target.getStat('spe')));
            const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
            this.debug('BP: ' + bp);
            return bp;
        },
        num: 486,
        accuracy: 100,
        basePower: 0,
        category: "Special",
        name: "Electro Ball",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    electrodrift: {
        num: 879,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Electro Drift",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onBasePower(basePower, source, target, move) {
            if (target.runEffectiveness(move) > 0) {
                // Placeholder
                this.debug(`electro drift super effective buff`);
                return this.chainModify([5461, 4096]);
            }
        },
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    electroshot: {
		num: 905,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		name: "Electro Shot",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({spa: 1}, attacker, attacker, move);
			if (['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Electric",
	},
    electroweb: {
        num: 527,
        accuracy: 95,
        basePower: 55,
        category: "Special",
        name: "Electroweb",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "allAdjacentFoes",
        type: "Electric",
        contestType: "Beautiful"
    },
    embargo: {
        flags: {"protect":1,"mirror":1},
        onTryHit(pokemon) {
            if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
                return false;
            }
        },
        condition: {
			duration: 5,
			onStart(pokemon) {
                this.add('-start', pokemon, 'Embargo');
            },
			onResidualOrder: 10,
			onResidualSubOrder: 18,
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Embargo');
            } 
		},
        isNonstandard: null,
        num: 373,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Embargo",
        pp: 15,
        priority: 0,
        volatileStatus: "embargo",
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    ember: {
        num: 52,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Ember",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Cute"
    },
    encore: {
        condition: {
			durationCallback() {
                return this.random(3, 7);
            },
			onStart(target) {
                const lockedMove = target.lastMoveEncore?.id || '';
                const moveIndex = lockedMove ? target.moves.indexOf(lockedMove) : -1;
                if (moveIndex < 0 || target.lastMoveEncore?.flags['failencore'] || target.moveSlots[moveIndex].pp <= 0) {
                    // it failed
                    return false;
                }
                this.effectState.move = lockedMove;
                this.add('-start', target, 'Encore');
            },
			onOverrideAction(pokemon) {
                return this.effectState.move;
            },
			onResidualOrder: 13,
			onResidual(target) {
                const lockedMoveIndex = target.moves.indexOf(this.effectState.move);
                if (lockedMoveIndex >= 0 && target.moveSlots[lockedMoveIndex].pp <= 0) {
                    // early termination if you run out of PP
                    target.removeVolatile('encore');
                }
            },
			onEnd(target) {
                this.add('-end', target, 'Encore');
            },
			onDisableMove(pokemon) {
                if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
                    return;
                }
                for (const moveSlot of pokemon.moveSlots) {
                    if (moveSlot.id !== this.effectState.move) {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            } 
		},
        volatileStatus: "encore",
        flags: {"protect":1,"mirror":1,"bypasssub":1,"failencore":1},
        num: 227,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Encore",
        pp: 5,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Cute"
    },
    endeavor: {
        onTry(pokemon, target) {
            if (pokemon.hp >= target.hp) {
                this.add('-fail', pokemon);
                return null;
            }
        },
        num: 283,
        accuracy: 100,
        basePower: 0,
        damageCallback(pokemon, target) {
            return target.getUndynamaxedHP() - pokemon.hp;
        },
        category: "Physical",
        name: "Endeavor",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"noparentalbond":1},
        onTryImmunity(target, pokemon) {
            return pokemon.hp < target.hp;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    endure: {
        priority: 2,
        num: 203,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Endure",
        pp: 10,
        flags: {"noassist":1,"failcopycat":1},
        stallingMove: true,
        volatileStatus: "endure",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'move: Endure');
            },
			onDamagePriority: -10,
			onDamage(damage, target, source, effect) {
                if (effect?.effectType === 'Move' && damage >= target.hp) {
                    this.add('-activate', target, 'move: Endure');
                    return target.hp - 1;
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    energyball: {
        basePower: 80,
        num: 412,
        accuracy: 100,
        category: "Special",
        name: "Energy Ball",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"boosts":{"spd":-1}},
        target: "normal",
        type: "Grass",
        contestType: "Beautiful"
    },
    entrainment: {
        num: 494,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Entrainment",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onTryHit(target, source) {
            if (target === source || target.volatiles['dynamax'])
                return false;
            const additionalBannedSourceAbilities = [
                // Zen Mode included here for compatability with Gen 5-6
                'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode',
            ];
            if (target.ability === source.ability ||
                target.getAbility().isPermanent || target.ability === 'truant' ||
                source.getAbility().isPermanent || additionalBannedSourceAbilities.includes(source.ability)) {
                return false;
            }
        },
        onHit(target, source) {
            const oldAbility = target.setAbility(source.ability);
            if (oldAbility) {
                this.add('-ability', target, target.getAbility().name, '[from] move: Entrainment');
                if (!target.isAlly(source))
                    target.volatileStaleness = 'external';
                return;
            }
            return oldAbility;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Cute"
    },
    eruption: {
        num: 284,
        accuracy: 100,
        basePower: 150,
        basePowerCallback(pokemon, target, move) {
            const bp = move.basePower * pokemon.hp / pokemon.maxhp;
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Eruption",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Fire",
        contestType: "Beautiful"
    },
    esperwing: {
        num: 840,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Esper Wing",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        secondary: {"chance":100,"self":{"boosts":{"spe":1}}},
        target: "normal",
        type: "Psychic"
    },
    eternabeam: {
        flags: {"recharge":1,"protect":1,"mirror":1,"failinstruct":1},
        isNonstandard: null,
        num: 795,
        accuracy: 90,
        basePower: 160,
        category: "Special",
        name: "Eternabeam",
        pp: 5,
        priority: 0,
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Dragon"
    },
    expandingforce: {
        num: 797,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Expanding Force",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower, source) {
            if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
                this.debug('terrain buff');
                return this.chainModify(1.5);
            }
        },
        onModifyMove(move, source, target) {
            if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
                move.target = 'allAdjacentFoes';
            }
        },
        secondary: null,
        target: "normal",
        type: "Psychic"
    },
    explosion: {
        basePower: 170,
        target: "normal",
        noSketch: true,
        num: 153,
        accuracy: 100,
        category: "Physical",
        name: "Explosion",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"noparentalbond":1},
        selfdestruct: "always",
        secondary: null,
        type: "Normal",
        contestType: "Beautiful"
    },
    extrasensory: {
        basePowerCallback(pokemon, target) {
            if (target.volatiles['minimize'])
                return 160;
            return 80;
        },
        pp: 30,
        num: 326,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Extrasensory",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"flinch"},
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    extremeevoboost: {
        isNonstandard: null,
        num: 702,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Extreme Evoboost",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "eeviumz",
        boosts: {"atk":2,"def":2,"spa":2,"spd":2,"spe":2},
        secondary: null,
        target: "self",
        type: "Normal",
        contestType: "Beautiful"
    },
    extremespeed: {
        priority: 1,
        num: 245,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Extreme Speed",
        pp: 5,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    facade: {
        num: 263,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Facade",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onBasePower(basePower, pokemon) {
            if (pokemon.status && pokemon.status !== 'slp') {
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    fairylock: {
        num: 587,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Fairy Lock",
        pp: 10,
        priority: 0,
        flags: {"mirror":1,"bypasssub":1},
        pseudoWeather: "fairylock",
        condition: {
			duration: 2,
			onFieldStart(target) {
                this.add('-fieldactivate', 'move: Fairy Lock');
            },
			onTrapPokemon(pokemon) {
                pokemon.tryTrap();
            } 
		},
        secondary: null,
        target: "all",
        type: "Fairy",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    fairywind: {
        num: 584,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Fairy Wind",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Beautiful"
    },
    fakeout: {
        flags: {"protect":1,"mirror":1},
        priority: 1,
        num: 252,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Fake Out",
        pp: 10,
        onTry(source) {
            if (source.activeMoveActions > 1) {
                this.hint("Fake Out only works on your first turn out.");
                return false;
            }
        },
        secondary: {"chance":100,"volatileStatus":"flinch"},
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    faketears: {
        num: 313,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Fake Tears",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        boosts: {"spd":-2},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"spa":1}},
        contestType: "Cute"
    },
    falsesurrender: {
        num: 793,
        accuracy: true,
        basePower: 80,
        category: "Physical",
        name: "False Surrender",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark"
    },
    falseswipe: {
        num: 206,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "False Swipe",
        pp: 40,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onDamagePriority: -20,
        onDamage(damage, target, source, effect) {
            if (damage >= target.hp)
                return target.hp - 1;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    featherdance: {
        num: 297,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Feather Dance",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1,"dance":1},
        boosts: {"atk":-2},
        secondary: null,
        target: "normal",
        type: "Flying",
        zMove: {"boost":{"def":1}},
        contestType: "Beautiful"
    },
    feint: {
        basePower: 50,
        onTry(source, target) {
            if (!target.volatiles['protect']) {
                this.add('-fail', source);
                return null;
            }
        },
        flags: {"noassist":1,"failcopycat":1},
        num: 364,
        accuracy: 100,
        category: "Physical",
        name: "Feint",
        pp: 10,
        priority: 2,
        breaksProtect: true,
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Clever"
    },
    feintattack: {
        flags: {"protect":1,"mirror":1},
        isNonstandard: null,
        num: 185,
        accuracy: true,
        basePower: 60,
        category: "Special",
        name: "Feint Attack",
        pp: 20,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    fellstinger: {
        basePower: 30,
        onAfterMoveSecondarySelf(pokemon, target, move) {
            if (!target || target.fainted || target.hp <= 0)
                this.boost({ atk: 2 }, pokemon, pokemon, move);
        },
        num: 565,
        accuracy: 100,
        category: "Physical",
        name: "Fell Stinger",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cool"
    },
    ficklebeam: {
		num: 907,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Fickle Beam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePower(basePower, pokemon) {
			if (this.randomChance(3, 10)) {
				this.attrLastMove('[anim] Fickle Beam All Out');
				this.add('-activate', pokemon, 'move: Fickle Beam');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
    fierydance: {
        num: 552,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Fiery Dance",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"dance":1},
        secondary: {"chance":50,"self":{"boosts":{"spa":1}}},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    fierywrath: {
        num: 822,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Fiery Wrath",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":20,"volatileStatus":"flinch"},
        target: "allAdjacentFoes",
        type: "Dark"
    },
    filletaway: {
        num: 868,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Fillet Away",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        onTry(source) {
            if (source.hp <= source.maxhp / 2 || source.maxhp === 1)
                return false;
        },
        onTryHit(pokemon, target, move) {
            if (!this.boost(move.boosts))
                return null;
            delete move.boosts;
        },
        onHit(pokemon) {
            this.directDamage(pokemon.maxhp / 2);
        },
        boosts: {"atk":2,"spa":2,"spe":2},
        secondary: null,
        target: "self",
        type: "Normal"
    },
    finalgambit: {
        flags: {"contact":1,"protect":1},
        num: 515,
        accuracy: 100,
        basePower: 0,
        damageCallback(pokemon) {
            const damage = pokemon.hp;
            pokemon.faint();
            return damage;
        },
        category: "Special",
        name: "Final Gambit",
        pp: 5,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Fighting",
        zMove: {"basePower":180},
        contestType: "Tough"
    },
    fireblast: {
        secondary: {"chance":30,"status":"brn"},
        basePower: 120,
        num: 126,
        accuracy: 85,
        category: "Special",
        name: "Fire Blast",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    firefang: {
        num: 424,
        accuracy: 95,
        basePower: 65,
        category: "Physical",
        name: "Fire Fang",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        secondaries: [{"chance":10,"status":"brn"},{"chance":10,"volatileStatus":"flinch"}],
        target: "normal",
        type: "Fire",
        contestType: "Cool"
    },
    firelash: {
        num: 680,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Fire Lash",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"def":-1}},
        target: "normal",
        type: "Fire",
        contestType: "Cute"
    },
    firepledge: {
        basePower: 50,
        basePowerCallback(target, source, move) {
            if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
                this.add('-combine');
                return 150;
            }
            return 50;
        },
        num: 519,
        accuracy: 100,
        category: "Special",
        name: "Fire Pledge",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1,"pledgecombo":1},
        onPrepareHit(target, source, move) {
            for (const action of this.queue.list) {
                if (!action.move || !action.pokemon?.isActive ||
                    action.pokemon.fainted || action.maxMove || action.zmove) {
                    continue;
                }
                if (action.pokemon.isAlly(source) && ['grasspledge', 'waterpledge'].includes(action.move.id)) {
                    this.queue.prioritizeAction(action, move);
                    this.add('-waiting', source, action.pokemon);
                    return null;
                }
            }
        },
        onModifyMove(move) {
            if (move.sourceEffect === 'waterpledge') {
                move.type = 'Water';
                move.forceSTAB = true;
                move.self = { sideCondition: 'waterpledge' };
            }
            if (move.sourceEffect === 'grasspledge') {
                move.type = 'Fire';
                move.forceSTAB = true;
                move.sideCondition = 'firepledge';
            }
        },
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'Fire Pledge');
            },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
                if (!pokemon.hasType('Fire'))
                    this.damage(pokemon.baseMaxhp / 8, pokemon);
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 8,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'Fire Pledge');
            } 
		},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    firepunch: {
        num: 7,
        accuracy: 100,
        basePower: 75,
        category: "Special",
        name: "Fire Punch",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Tough"
    },
    firespin: {
        accuracy: 70,
        basePower: 15,
        volatileStatus: "partiallytrapped1",
        self: {"volatileStatus":"partialtrappinglock"},
        onHit(target, source) {
            /**
             * The duration of the partially trapped must be always renewed to 2
             * so target doesn't move on trapper switch out as happens in gen 1.
             * However, this won't happen if there's no switch and the trapper is
             * about to end its partial trapping.
             **/
            if (target.volatiles['partiallytrapped1']) {
                if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
                    target.volatiles['partiallytrapped1'].duration = 2;
                }
            }
        },
        num: 83,
        category: "Special",
        name: "Fire Spin",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    firstimpression: {
        num: 660,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "First Impression",
        pp: 10,
        priority: 2,
        flags: {"contact":1,"protect":1,"mirror":1},
        onTry(source) {
            if (source.activeMoveActions > 1) {
                this.hint("First Impression only works on your first turn out.");
                return false;
            }
        },
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    fishiousrend: {
        isNonstandard: null,
        num: 755,
        accuracy: 100,
        basePower: 85,
        basePowerCallback(pokemon, target, move) {
            if (target.newlySwitched || this.queue.willMove(target)) {
                this.debug('Fishious Rend damage boost');
                return move.basePower * 2;
            }
            this.debug('Fishious Rend NOT boosted');
            return move.basePower;
        },
        category: "Physical",
        name: "Fishious Rend",
        pp: 10,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water"
    },
    fissure: {
        num: 90,
        accuracy: 30,
        basePower: 0,
        category: "Physical",
        name: "Fissure",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        ohko: true,
        secondary: null,
        target: "normal",
        type: "Ground",
        zMove: {"basePower":180},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    flail: {
        noDamageVariance: true,
        willCrit: false,
        basePowerCallback(pokemon, target) {
            const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
            let bp;
            if (ratio < 2) {
                bp = 200;
            }
            else if (ratio < 6) {
                bp = 150;
            }
            else if (ratio < 13) {
                bp = 100;
            }
            else if (ratio < 22) {
                bp = 80;
            }
            else if (ratio < 43) {
                bp = 40;
            }
            else {
                bp = 20;
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        num: 175,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Flail",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cute"
    },
    flameburst: {
        isNonstandard: null,
        num: 481,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Flame Burst",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit(target, source, move) {
            for (const ally of target.adjacentAllies()) {
                this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
            }
        },
        onAfterSubDamage(damage, target, source, move) {
            for (const ally of target.adjacentAllies()) {
                this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
            }
        },
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    flamecharge: {
        num: 488,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Flame Charge",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"self":{"boosts":{"spe":1}}},
        target: "normal",
        type: "Fire",
        contestType: "Cool"
    },
    flamewheel: {
        num: 172,
        accuracy: 100,
        basePower: 60,
        category: "Special",
        name: "Flame Wheel",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"defrost":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    flamethrower: {
        basePower: 95,
        num: 53,
        accuracy: 100,
        category: "Special",
        name: "Flamethrower",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    flareblitz: {
        recoil: [1,3],
        num: 394,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Flare Blitz",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"defrost":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Cool"
    },
    flash: {
        accuracy: 70,
        isNonstandard: null,
        num: 148,
        basePower: 0,
        category: "Status",
        name: "Flash",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"accuracy":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"evasion":1}},
        contestType: "Beautiful"
    },
    flashcannon: {
        num: 430,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Flash Cannon",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"boosts":{"spd":-1}},
        target: "normal",
        type: "Steel",
        contestType: "Beautiful"
    },
    flatter: {
        num: 260,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Flatter",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        volatileStatus: "confusion",
        boosts: {"spa":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    fleurcannon: {
        num: 705,
        accuracy: 90,
        basePower: 130,
        category: "Special",
        name: "Fleur Cannon",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"spa":-2}},
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Beautiful"
    },
    fling: {
        num: 374,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Fling",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1,"noparentalbond":1},
        onPrepareHit(target, source, move) {
            if (source.ignoringItem())
                return false;
            const item = source.getItem();
            if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item))
                return false;
            if (!item.fling)
                return false;
            move.basePower = item.fling.basePower;
            this.debug('BP: ' + move.basePower);
            if (item.isBerry) {
                move.onHit = function (foe) {
                    if (this.singleEvent('Eat', item, null, foe, null, null)) {
                        this.runEvent('EatItem', foe, null, null, item);
                        if (item.id === 'leppaberry')
                            foe.staleness = 'external';
                    }
                    if (item.onEat)
                        foe.ateBerry = true;
                };
            }
            else if (item.fling.effect) {
                move.onHit = item.fling.effect;
            }
            else {
                if (!move.secondaries)
                    move.secondaries = [];
                if (item.fling.status) {
                    move.secondaries.push({ status: item.fling.status });
                }
                else if (item.fling.volatileStatus) {
                    move.secondaries.push({ volatileStatus: item.fling.volatileStatus });
                }
            }
            source.addVolatile('fling');
        },
        condition: {
			onUpdate(pokemon) {
                const item = pokemon.getItem();
                pokemon.setItem('');
                pokemon.lastItem = item.id;
                pokemon.usedItemThisTurn = true;
                this.add('-enditem', pokemon, item.name, '[from] move: Fling');
                this.runEvent('AfterUseItem', pokemon, null, null, item);
                pokemon.removeVolatile('fling');
            } 
		},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Cute"
    },
    flipturn: {
        num: 812,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Flip Turn",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        selfSwitch: true,
        secondary: null,
        target: "normal",
        type: "Water"
    },
    floatyfall: {
        num: 731,
        accuracy: 95,
        basePower: 90,
        category: "Physical",
        isNonstandard: "LGPE",
        name: "Floaty Fall",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"gravity":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Flying",
        contestType: "Cool"
    },
    floralhealing: {
        onHit(target, source) {
            let success = false;
            if (this.field.isTerrain('grassyterrain')) {
                success = !!this.heal(this.modify(target.baseMaxhp, 0.667));
            }
            else {
                success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
            }
            if (success && !target.isAlly(source)) {
                target.staleness = 'external';
            }
            if (!success) {
                this.add('-fail', target, 'heal');
                return null;
            }
            return success;
        },
        isNonstandard: null,
        num: 666,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Floral Healing",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"heal":1,"allyanim":1},
        secondary: null,
        target: "normal",
        type: "Fairy",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    flowershield: {
        isNonstandard: null,
        num: 579,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Flower Shield",
        pp: 10,
        priority: 0,
        flags: {"distance":1},
        onHitField(t, source, move) {
            const targets = [];
            for (const pokemon of this.getAllActive()) {
                if (pokemon.hasType('Grass') &&
                    (!pokemon.volatiles['maxguard'] ||
                        this.runEvent('TryHit', pokemon, source, move))) {
                    // This move affects every Grass-type Pokemon in play.
                    targets.push(pokemon);
                }
            }
            let success = false;
            for (const target of targets) {
                success = this.boost({ def: 1 }, target, source, move) || success;
            }
            return success;
        },
        secondary: null,
        target: "all",
        type: "Fairy",
        zMove: {"boost":{"def":1}},
        contestType: "Beautiful"
    },
    flowertrick: {
        num: 870,
        accuracy: true,
        basePower: 70,
        category: "Physical",
        name: "Flower Trick",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        willCrit: true,
        secondary: null,
        target: "normal",
        type: "Grass"
    },
    fly: {
        condition: {},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            attacker.addVolatile('invulnerability', defender);
            return null;
        },
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        basePower: 70,
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"gravity":1,"distance":1},
        num: 19,
        accuracy: 95,
        category: "Physical",
        name: "Fly",
        pp: 15,
        priority: 0,
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Clever"
    },
    flyingpress: {
        basePower: 80,
        num: 560,
        accuracy: 95,
        category: "Physical",
        name: "Flying Press",
        pp: 10,
        flags: {"contact":1,"protect":1,"mirror":1,"gravity":1,"distance":1,"nonsky":1},
        onEffectiveness(typeMod, target, type, move) {
            return typeMod + this.dex.getEffectiveness('Flying', type);
        },
        priority: 0,
        secondary: null,
        target: "any",
        type: "Fighting",
        zMove: {"basePower":170},
        contestType: "Tough"
    },
    focusblast: {
        num: 411,
        accuracy: 70,
        basePower: 120,
        category: "Special",
        name: "Focus Blast",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"boosts":{"spd":-1}},
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    focusenergy: {
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: Focus Energy');
            },
			onModifyMove() { } 
		},
        num: 116,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Focus Energy",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "focusenergy",
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cool"
    },
    focuspunch: {
        priorityChargeCallback() { },
        beforeTurnCallback(pokemon) {
            pokemon.addVolatile('focuspunch');
        },
        beforeMoveCallback() { },
        onTry(pokemon) {
            if (pokemon.volatiles['focuspunch']?.lostFocus) {
                this.attrLastMove('[still]');
                this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
                return null;
            }
        },
        num: 264,
        accuracy: 100,
        basePower: 150,
        category: "Physical",
        name: "Focus Punch",
        pp: 20,
        priority: -3,
        flags: {"contact":1,"protect":1,"punch":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1},
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'move: Focus Punch');
            },
			onHit(pokemon, source, move) {
                if (move.category !== 'Status') {
                    this.effectState.lostFocus = true;
                }
            },
			onTryAddVolatile(status, pokemon) {
                if (status.id === 'flinch')
                    return null;
            } 
		},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    followme: {
        volatileStatus: undefined,
        slotCondition: "followme",
        condition: {
			duration: 1,
			onStart(target, source, effect) {
                this.add('-singleturn', target, 'move: Follow Me');
                this.effectState.slot = target.getSlot();
            },
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
                const userSlot = this.getAtSlot(this.effectState.slot);
                if (this.validTarget(userSlot, source, move.target)) {
                    return userSlot;
                }
            } 
		},
        priority: 3,
        num: 266,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Follow Me",
        pp: 20,
        flags: {"noassist":1,"failcopycat":1},
        onTry(source) {
            return this.activePerHalf > 1;
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    forcepalm: {
        num: 395,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Force Palm",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    foresight: {
        onTryHit(target) {
            if (target.volatiles['foresight'])
                return false;
        },
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Foresight');
            },
			onNegateImmunity(pokemon, type) {
                if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type))
                    return false;
            },
			onModifyBoost(boosts) {
                if (boosts.evasion && boosts.evasion > 0) {
                    boosts.evasion = 0;
                }
            } 
		},
        accuracy: 100,
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        isNonstandard: null,
        num: 193,
        basePower: 0,
        category: "Status",
        name: "Foresight",
        pp: 40,
        priority: 0,
        volatileStatus: "foresight",
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"crit2"},
        contestType: "Clever"
    },
    forestscurse: {
        isNonstandard: null,
        num: 571,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Forest's Curse",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onHit(target) {
            if (target.hasType('Grass'))
                return false;
            if (!target.addType('Grass'))
                return false;
            this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Clever"
    },
    foulplay: {
        num: 492,
        accuracy: 100,
        basePower: 95,
        category: "Physical",
        name: "Foul Play",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        overrideOffensivePokemon: "target",
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    freezedry: {
        num: 573,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Freeze-Dry",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onEffectiveness(typeMod, target, type) {
            if (type === 'Water')
                return 1;
        },
        secondary: {"chance":10,"status":"frz"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    freezeshock: {
        isNonstandard: null,
        num: 553,
        accuracy: 90,
        basePower: 140,
        category: "Physical",
        name: "Freeze Shock",
        pp: 5,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1,"nosleeptalk":1,"failinstruct":1},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    freezingglare: {
        num: 821,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Freezing Glare",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"frz"},
        target: "normal",
        type: "Psychic"
    },
    freezyfrost: {
        accuracy: 100,
        basePower: 90,
        pp: 15,
        num: 739,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Freezy Frost",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit() {
            this.add('-clearallboost');
            for (const pokemon of this.getAllActive()) {
                pokemon.clearBoosts();
            }
        },
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Clever"
    },
    frenzyplant: {
        num: 338,
        accuracy: 90,
        basePower: 150,
        category: "Special",
        name: "Frenzy Plant",
        pp: 5,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1,"nonsky":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    frostbreath: {
        basePower: 40,
        num: 524,
        accuracy: 90,
        category: "Special",
        name: "Frost Breath",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        willCrit: true,
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    frustration: {
        basePowerCallback(pokemon) {
            return Math.floor(((255 - pokemon.happiness) * 10) / 25) || null;
        },
        isNonstandard: null,
        num: 218,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Frustration",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cute"
    },
    furyattack: {
        num: 31,
        accuracy: 85,
        basePower: 15,
        category: "Physical",
        name: "Fury Attack",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    furycutter: {
        onHit(target, source) {
            source.addVolatile('furycutter');
        },
        basePower: 10,
        condition: {
			duration: 2,
			onStart() {
                this.effectState.multiplier = 1;
            },
			onRestart() {
                if (this.effectState.multiplier < 16) {
                    this.effectState.multiplier <<= 1;
                }
                this.effectState.duration = 2;
            } 
		},
        num: 210,
        accuracy: 95,
        basePowerCallback(pokemon, target, move) {
            if (!pokemon.volatiles['furycutter'] || move.hit === 1) {
                pokemon.addVolatile('furycutter');
            }
            const bp = this.clampIntRange(move.basePower * pokemon.volatiles['furycutter'].multiplier, 1, 160);
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Physical",
        name: "Fury Cutter",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cool"
    },
    furyswipes: {
        num: 154,
        accuracy: 80,
        basePower: 18,
        category: "Physical",
        name: "Fury Swipes",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        maxMove: {"basePower":100},
        contestType: "Tough"
    },
    fusionbolt: {
        isNonstandard: null,
        num: 559,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Fusion Bolt",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower, pokemon) {
            if (this.lastSuccessfulMoveThisTurn === 'fusionflare') {
                this.debug('double power');
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    fusionflare: {
        isNonstandard: null,
        num: 558,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Fusion Flare",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        onBasePower(basePower, pokemon) {
            if (this.lastSuccessfulMoveThisTurn === 'fusionbolt') {
                this.debug('double power');
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    futuresight: {
        accuracy: 90,
        basePower: 80,
        pp: 15,
        onTry(source, target) {
            if (!target.side.addSlotCondition(target, 'futuremove'))
                return false;
            const moveData = {
                name: "Future Sight",
                basePower: 80,
                category: "Special",
                flags: { futuremove: 1 },
                willCrit: false,
                type: '???',
            };
            const damage = this.actions.getDamage(source, target, moveData, true);
            Object.assign(target.side.slotConditions[target.position]['futuremove'], {
                duration: 3,
                move: 'futuresight',
                source: source,
                moveData: {
                    id: 'futuresight',
                    name: "Future Sight",
                    accuracy: 90,
                    basePower: 0,
                    damage: damage,
                    category: "Special",
                    flags: { futuremove: 1 },
                    effectType: 'Move',
                    type: '???',
                },
            });
            this.add('-start', source, 'Future Sight');
            return null;
        },
        flags: {"futuremove":1},
        num: 248,
        category: "Special",
        name: "Future Sight",
        priority: 0,
        ignoreImmunity: true,
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    gastroacid: {
        num: 380,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Gastro Acid",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        volatileStatus: "gastroacid",
        onTryHit(target) {
            if (target.getAbility().isPermanent) {
                return false;
            }
            if (target.hasItem('Ability Shield')) {
                this.add('-block', target, 'item: Ability Shield');
                return null;
            }
        },
        condition: {
			onStart(pokemon) {
                if (pokemon.hasItem('Ability Shield'))
                    return false;
                this.add('-endability', pokemon);
                this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
            },
			onCopy(pokemon) {
                if (pokemon.getAbility().isPermanent)
                    pokemon.removeVolatile('gastroacid');
            } 
		},
        secondary: null,
        target: "normal",
        type: "Poison",
        zMove: {"boost":{"spe":1}},
        contestType: "Tough"
    },
    geargrind: {
        isNonstandard: null,
        num: 544,
        accuracy: 85,
        basePower: 50,
        category: "Physical",
        name: "Gear Grind",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Steel",
        zMove: {"basePower":180},
        maxMove: {"basePower":130},
        contestType: "Clever"
    },
    gearup: {
        isNonstandard: null,
        num: 674,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Gear Up",
        pp: 20,
        priority: 0,
        flags: {"snatch":1,"bypasssub":1},
        onHitSide(side, source, move) {
            const targets = side.allies().filter(target => (target.hasAbility(['plus', 'minus']) &&
                (!target.volatiles['maxguard'] || this.runEvent('TryHit', target, source, move))));
            if (!targets.length)
                return false;
            let didSomething = false;
            for (const target of targets) {
                didSomething = this.boost({ atk: 1, spa: 1 }, target, source, move, false, true) || didSomething;
            }
            return didSomething;
        },
        secondary: null,
        target: "allySide",
        type: "Steel",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    genesissupernova: {
        isNonstandard: null,
        num: 703,
        accuracy: true,
        basePower: 185,
        category: "Special",
        name: "Genesis Supernova",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "mewniumz",
        secondary: {"chance":100,"self":{}},
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    geomancy: {
        isNonstandard: null,
        num: 601,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Geomancy",
        pp: 10,
        priority: 0,
        flags: {"charge":1,"nonsky":1,"nosleeptalk":1,"failinstruct":1},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        boosts: {"spa":2,"spd":2,"spe":2},
        secondary: null,
        target: "self",
        type: "Fairy",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Beautiful"
    },
    gigadrain: {
        pp: 5,
        basePower: 60,
        flags: {"protect":1,"mirror":1},
        num: 202,
        accuracy: 100,
        category: "Special",
        name: "Giga Drain",
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Clever"
    },
    gigaimpact: {
        num: 416,
        accuracy: 90,
        basePower: 150,
        category: "Physical",
        name: "Giga Impact",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    gigatonhammer: {
        num: 893,
        accuracy: 100,
        basePower: 160,
        category: "Physical",
        name: "Gigaton Hammer",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onDisableMove(pokemon) {
            if (pokemon.lastMove?.id === 'gigatonhammer')
                pokemon.disableMove('gigatonhammer');
        },
        beforeMoveCallback(pokemon) {
            if (pokemon.lastMove?.id === 'gigatonhammer')
                pokemon.addVolatile('gigatonhammer');
        },
        onAfterMove(pokemon) {
            if (pokemon.removeVolatile('gigatonhammer')) {
                this.add('-hint', "Some effects can force a Pokemon to use Gigaton Hammer again in a row.");
            }
        },
        condition: {},
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    gigavolthavoc: {
        isNonstandard: null,
        num: 646,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Gigavolt Havoc",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "electriumz",
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    glaciallance: {
        basePower: 130,
        num: 824,
        accuracy: 100,
        category: "Physical",
        name: "Glacial Lance",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Ice"
    },
    glaciate: {
        isNonstandard: null,
        num: 549,
        accuracy: 95,
        basePower: 65,
        category: "Special",
        name: "Glaciate",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "allAdjacentFoes",
        type: "Ice",
        contestType: "Beautiful"
    },
    glaiverush: {
        num: 862,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Glaive Rush",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"glaiverush"},
        condition: {
			noCopy: true,
			onStart(pokemon) {
                this.add('-singlemove', pokemon, 'Glaive Rush', '[silent]');
            },
			onAccuracy() {
                return true;
            },
			onSourceModifyDamage() {
                return this.chainModify(2);
            },
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
                this.debug('removing Glaive Rush drawback before attack');
                pokemon.removeVolatile('glaiverush');
            } 
		},
        secondary: null,
        target: "normal",
        type: "Dragon"
    },
    glare: {
        ignoreImmunity: true,
        accuracy: 75,
        num: 137,
        basePower: 0,
        category: "Status",
        name: "Glare",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "par",
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Tough"
    },
    glitzyglow: {
        accuracy: 100,
        basePower: 90,
        num: 736,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Glitzy Glow",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"sideCondition":"lightscreen"},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    gmaxbefuddle: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Befuddle",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Butterfree",
        self: {},
        target: "adjacentFoe",
        type: "Bug",
        contestType: "Cool"
    },
    gmaxcannonade: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Cannonade",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Blastoise",
        self: {},
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'G-Max Cannonade');
            },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
                if (!target.hasType('Water'))
                    this.damage(target.baseMaxhp / 6, target);
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'G-Max Cannonade');
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    gmaxcentiferno: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Centiferno",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Centiskorch",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Fire",
        contestType: "Cool"
    },
    gmaxchistrike: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Chi Strike",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Machamp",
        self: {},
        condition: {
			noCopy: true,
			onStart(target, source, effect) {
                this.effectState.layers = 1;
                if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
                    this.add('-start', target, 'move: G-Max Chi Strike');
                }
            },
			onRestart(target, source, effect) {
                if (this.effectState.layers >= 3)
                    return false;
                this.effectState.layers++;
                if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
                    this.add('-start', target, 'move: G-Max Chi Strike');
                }
            },
			onModifyCritRatio(critRatio) {
                return critRatio + this.effectState.layers;
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Fighting",
        contestType: "Cool"
    },
    gmaxcuddle: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Cuddle",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Eevee",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Normal",
        contestType: "Cool"
    },
    gmaxdepletion: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Depletion",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Duraludon",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Dragon",
        contestType: "Cool"
    },
    gmaxdrumsolo: {
        num: 1000,
        accuracy: true,
        basePower: 160,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Drum Solo",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Rillaboom",
        ignoreAbility: true,
        secondary: null,
        target: "adjacentFoe",
        type: "Grass",
        contestType: "Cool"
    },
    gmaxfinale: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Finale",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Alcremie",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Fairy",
        contestType: "Cool"
    },
    gmaxfireball: {
        num: 1000,
        accuracy: true,
        basePower: 160,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Fireball",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Cinderace",
        ignoreAbility: true,
        secondary: null,
        target: "adjacentFoe",
        type: "Fire",
        contestType: "Cool"
    },
    gmaxfoamburst: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Foam Burst",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Kingler",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    gmaxgoldrush: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Gold Rush",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Meowth",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Normal",
        contestType: "Cool"
    },
    gmaxgravitas: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Gravitas",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Orbeetle",
        self: {"pseudoWeather":"gravity"},
        target: "adjacentFoe",
        type: "Psychic",
        contestType: "Cool"
    },
    gmaxhydrosnipe: {
        num: 1000,
        accuracy: true,
        basePower: 160,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Hydrosnipe",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Inteleon",
        ignoreAbility: true,
        secondary: null,
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    gmaxmalodor: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Malodor",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Garbodor",
        self: {},
        target: "adjacentFoe",
        type: "Poison",
        contestType: "Cool"
    },
    gmaxmeltdown: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Meltdown",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Melmetal",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Steel",
        contestType: "Cool"
    },
    gmaxoneblow: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max One Blow",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Urshifu",
        secondary: null,
        target: "adjacentFoe",
        type: "Dark",
        contestType: "Cool"
    },
    gmaxrapidflow: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Rapid Flow",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Urshifu-Rapid-Strike",
        secondary: null,
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    gmaxreplenish: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Replenish",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Snorlax",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Normal",
        contestType: "Cool"
    },
    gmaxresonance: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Resonance",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Lapras",
        self: {"sideCondition":"auroraveil"},
        secondary: null,
        target: "adjacentFoe",
        type: "Ice",
        contestType: "Cool"
    },
    gmaxsandblast: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Sandblast",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Sandaconda",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Ground",
        contestType: "Cool"
    },
    gmaxsmite: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Smite",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Hatterene",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Fairy",
        contestType: "Cool"
    },
    gmaxsnooze: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Snooze",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Grimmsnarl",
        onHit(target) {
            if (target.status || !target.runStatusImmunity('slp'))
                return;
            if (this.random(2) === 0)
                return;
            target.addVolatile('yawn');
        },
        onAfterSubDamage(damage, target) {
            if (target.status || !target.runStatusImmunity('slp'))
                return;
            if (this.random(2) === 0)
                return;
            target.addVolatile('yawn');
        },
        secondary: null,
        target: "adjacentFoe",
        type: "Dark",
        contestType: "Cool"
    },
    gmaxsteelsurge: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Steelsurge",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Copperajah",
        self: {},
        condition: {
			onSideStart(side) {
                this.add('-sidestart', side, 'move: G-Max Steelsurge');
            },
			onEntryHazard(pokemon) {
                if (pokemon.hasItem('heavydutyboots'))
                    return;
                // Ice Face and Disguise correctly get typed damage from Stealth Rock
                // because Stealth Rock bypasses Substitute.
                // They don't get typed damage from Steelsurge because Steelsurge doesn't,
                // so we're going to test the damage of a Steel-type Stealth Rock instead.
                const steelHazard = this.dex.getActiveMove('Stealth Rock');
                steelHazard.type = 'Steel';
                const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
                this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Steel",
        contestType: "Cool"
    },
    gmaxstonesurge: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Stonesurge",
        pp: 5,
        priority: 0,
        flags: {},
        isMax: "Drednaw",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    gmaxstunshock: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Stun Shock",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Toxtricity",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Electric",
        contestType: "Cool"
    },
    gmaxsweetness: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Sweetness",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Appletun",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Grass",
        contestType: "Cool"
    },
    gmaxtartness: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Tartness",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Flapple",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Grass",
        contestType: "Cool"
    },
    gmaxterror: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Terror",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Gengar",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Ghost",
        contestType: "Cool"
    },
    gmaxvinelash: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Vine Lash",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Venusaur",
        self: {},
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'G-Max Vine Lash');
            },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
                if (!target.hasType('Grass'))
                    this.damage(target.baseMaxhp / 6, target);
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'G-Max Vine Lash');
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Grass",
        contestType: "Cool"
    },
    gmaxvolcalith: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Volcalith",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Coalossal",
        self: {},
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'G-Max Volcalith');
            },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
                if (!target.hasType('Rock'))
                    this.damage(target.baseMaxhp / 6, target);
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'G-Max Volcalith');
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Rock",
        contestType: "Cool"
    },
    gmaxvoltcrash: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Volt Crash",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Pikachu",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Electric",
        contestType: "Cool"
    },
    gmaxwildfire: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Wildfire",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Charizard",
        self: {},
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'G-Max Wildfire');
            },
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
                if (!target.hasType('Fire'))
                    this.damage(target.baseMaxhp / 6, target);
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'G-Max Wildfire');
            } 
		},
        secondary: null,
        target: "adjacentFoe",
        type: "Fire",
        contestType: "Cool"
    },
    gmaxwindrage: {
        num: 1000,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        isNonstandard: "Gigantamax",
        name: "G-Max Wind Rage",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: "Corviknight",
        self: {},
        secondary: null,
        target: "adjacentFoe",
        type: "Flying",
        contestType: "Cool"
    },
    grassknot: {
        onTryHit() { },
        num: 447,
        accuracy: 100,
        basePower: 0,
        basePowerCallback(pokemon, target) {
            const targetWeight = target.getWeight();
            let bp;
            if (targetWeight >= 2000) {
                bp = 120;
            }
            else if (targetWeight >= 1000) {
                bp = 100;
            }
            else if (targetWeight >= 500) {
                bp = 80;
            }
            else if (targetWeight >= 250) {
                bp = 60;
            }
            else if (targetWeight >= 100) {
                bp = 40;
            }
            else {
                bp = 20;
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Grass Knot",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cute"
    },
    grasspledge: {
        basePower: 50,
        basePowerCallback(target, source, move) {
            if (['waterpledge', 'firepledge'].includes(move.sourceEffect)) {
                this.add('-combine');
                return 150;
            }
            return 50;
        },
        num: 520,
        accuracy: 100,
        category: "Special",
        name: "Grass Pledge",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1,"pledgecombo":1},
        onPrepareHit(target, source, move) {
            for (const action of this.queue.list) {
                if (!action.move || !action.pokemon?.isActive ||
                    action.pokemon.fainted || action.maxMove || action.zmove) {
                    continue;
                }
                if (action.pokemon.isAlly(source) && ['waterpledge', 'firepledge'].includes(action.move.id)) {
                    this.queue.prioritizeAction(action, move);
                    this.add('-waiting', source, action.pokemon);
                    return null;
                }
            }
        },
        onModifyMove(move) {
            if (move.sourceEffect === 'waterpledge') {
                move.type = 'Grass';
                move.forceSTAB = true;
                move.sideCondition = 'grasspledge';
            }
            if (move.sourceEffect === 'firepledge') {
                move.type = 'Fire';
                move.forceSTAB = true;
                move.sideCondition = 'firepledge';
            }
        },
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'Grass Pledge');
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 9,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'Grass Pledge');
            },
			onModifySpe(spe, pokemon) {
                return this.chainModify(0.25);
            } 
		},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Beautiful"
    },
    grasswhistle: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        isNonstandard: null,
        num: 320,
        accuracy: 55,
        basePower: 0,
        category: "Status",
        name: "Grass Whistle",
        pp: 15,
        priority: 0,
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    grassyglide: {
        basePower: 70,
        num: 803,
        accuracy: 100,
        category: "Physical",
        name: "Grassy Glide",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onModifyPriority(priority, source, target, move) {
            if (this.field.isTerrain('grassyterrain') && source.isGrounded()) {
                return priority + 1;
            }
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    grassyterrain: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasItem('terrainextender')) {
                    return 8;
                }
                return 5;
            },
			onBasePower(basePower, attacker, defender, move) {
                const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
                if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
                    this.debug('move weakened by grassy terrain');
                    return this.chainModify(0.5);
                }
                if (move.type === 'Grass' && attacker.isGrounded()) {
                    this.debug('grassy terrain boost');
                    return this.chainModify(1.5);
                }
            },
			onFieldStart(field, source, effect) {
                if (effect && effect.effectType === 'Ability') {
                    this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
                }
                else {
                    this.add('-fieldstart', 'move: Grassy Terrain');
                }
            },
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
                if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
                    this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
                }
                else {
                    this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
                }
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
                this.add('-fieldend', 'move: Grassy Terrain');
            } 
		},
        num: 580,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Grassy Terrain",
        pp: 10,
        priority: 0,
        flags: {"nonsky":1},
        terrain: "grassyterrain",
        secondary: null,
        target: "all",
        type: "Grass",
        zMove: {"boost":{"def":1}},
        contestType: "Beautiful"
    },
    gravapple: {
        num: 788,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Grav Apple",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower) {
            if (this.field.getPseudoWeather('gravity')) {
                return this.chainModify(1.5);
            }
        },
        secondary: {"chance":100,"boosts":{"def":-1}},
        target: "normal",
        type: "Grass"
    },
    gravity: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
                    return 7;
                }
                return 5;
            },
			onFieldStart(target, source) {
                if (source?.hasAbility('persistent')) {
                    this.add('-fieldstart', 'move: Gravity', '[persistent]');
                }
                else {
                    this.add('-fieldstart', 'move: Gravity');
                }
                for (const pokemon of this.getAllActive()) {
                    let applies = false;
                    if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
                        applies = true;
                        this.queue.cancelMove(pokemon);
                        pokemon.removeVolatile('twoturnmove');
                    }
                    if (pokemon.volatiles['skydrop']) {
                        applies = true;
                        this.queue.cancelMove(pokemon);
                        if (pokemon.volatiles['skydrop'].source) {
                            this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
                        }
                        pokemon.removeVolatile('skydrop');
                        pokemon.removeVolatile('twoturnmove');
                    }
                    if (pokemon.volatiles['magnetrise']) {
                        applies = true;
                        delete pokemon.volatiles['magnetrise'];
                    }
                    if (pokemon.volatiles['telekinesis']) {
                        applies = true;
                        delete pokemon.volatiles['telekinesis'];
                    }
                    if (applies)
                        this.add('-activate', pokemon, 'move: Gravity');
                }
            },
			onModifyAccuracy(accuracy) {
                if (typeof accuracy !== 'number')
                    return;
                return this.chainModify([6840, 4096]);
            },
			onDisableMove(pokemon) {
                for (const moveSlot of pokemon.moveSlots) {
                    if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
                if (move.flags['gravity'] && !move.isZ) {
                    this.add('cant', pokemon, 'move: Gravity', move);
                    return false;
                }
            },
			onModifyMove(move, pokemon, target) {
                if (move.flags['gravity'] && !move.isZ) {
                    this.add('cant', pokemon, 'move: Gravity', move);
                    return false;
                }
            },
			onFieldResidualOrder: 9,
			onFieldEnd() {
                this.add('-fieldend', 'move: Gravity');
            } 
		},
        num: 356,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Gravity",
        pp: 5,
        priority: 0,
        flags: {"nonsky":1},
        pseudoWeather: "gravity",
        secondary: null,
        target: "all",
        type: "Psychic",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    growl: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        num: 45,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Growl",
        pp: 40,
        priority: 0,
        boosts: {"atk":-1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    growth: {
        boosts: {"spa":1,"spd":1},
        onModifyMove() { },
        pp: 40,
        num: 74,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Growth",
        priority: 0,
        flags: {"snatch":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Beautiful"
    },
    grudge: {
        isNonstandard: null,
        num: 288,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Grudge",
        pp: 5,
        priority: 0,
        flags: {"bypasssub":1},
        volatileStatus: "grudge",
        condition: {
			onStart(pokemon) {
                this.add('-singlemove', pokemon, 'Grudge');
            },
			onFaint(target, source, effect) {
                if (!source || source.fainted || !effect)
                    return;
                if (effect.effectType === 'Move' && !effect.flags['futuremove'] && source.lastMove) {
                    let move = source.lastMove;
                    if (move.isMax && move.baseMove)
                        move = this.dex.moves.get(move.baseMove);
                    for (const moveSlot of source.moveSlots) {
                        if (moveSlot.id === move.id) {
                            moveSlot.pp = 0;
                            this.add('-activate', source, 'move: Grudge', move.name);
                        }
                    }
                }
            },
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
                this.debug('removing Grudge before attack');
                pokemon.removeVolatile('grudge');
            } 
		},
        secondary: null,
        target: "self",
        type: "Ghost",
        zMove: {"effect":"redirect"},
        contestType: "Tough"
    },
    guardianofalola: {
        isNonstandard: null,
        num: 698,
        accuracy: true,
        basePower: 0,
        damageCallback(pokemon, target) {
            const hp75 = Math.floor(target.getUndynamaxedHP() * 3 / 4);
            if (target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] ||
                target.volatiles['spikyshield'] || target.side.getSideCondition('matblock')) {
                this.add('-zbroken', target);
                return this.clampIntRange(Math.ceil(hp75 / 4 - 0.5), 1);
            }
            return this.clampIntRange(hp75, 1);
        },
        category: "Special",
        name: "Guardian of Alola",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "tapuniumz",
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Tough"
    },
    guardsplit: {
        num: 470,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Guard Split",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"allyanim":1},
        onHit(target, source) {
            const newdef = Math.floor((target.storedStats.def + source.storedStats.def) / 2);
            target.storedStats.def = newdef;
            source.storedStats.def = newdef;
            const newspd = Math.floor((target.storedStats.spd + source.storedStats.spd) / 2);
            target.storedStats.spd = newspd;
            source.storedStats.spd = newspd;
            this.add('-activate', source, 'move: Guard Split', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    guardswap: {
        num: 385,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Guard Swap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            const targetBoosts = {};
            const sourceBoosts = {};
            const defSpd = ['def', 'spd'];
            for (const stat of defSpd) {
                targetBoosts[stat] = target.boosts[stat];
                sourceBoosts[stat] = source.boosts[stat];
            }
            source.setBoost(targetBoosts);
            target.setBoost(sourceBoosts);
            this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    guillotine: {
        num: 12,
        accuracy: 30,
        basePower: 0,
        category: "Physical",
        name: "Guillotine",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        ohko: true,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":180},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    gunkshot: {
        accuracy: 70,
        num: 441,
        basePower: 120,
        category: "Physical",
        name: "Gunk Shot",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"psn"},
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    gust: {
        type: "Normal",
        num: 16,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Gust",
        pp: 35,
        priority: 0,
        flags: {"protect":1,"mirror":1,"distance":1,"wind":1},
        secondary: null,
        target: "any",
        contestType: "Clever"
    },
    gyroball: {
        basePowerCallback(pokemon, target) {
            let power = Math.floor(25 * target.getStat('spe') / Math.max(1, pokemon.getStat('spe'))) + 1;
            if (power > 150)
                power = 150;
            this.debug('BP: ' + power);
            return power;
        },
        num: 360,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Gyro Ball",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    hail: {
        isNonstandard: null,
        num: 258,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Hail",
        pp: 10,
        priority: 0,
        flags: {},
        weather: "hail",
        secondary: null,
        target: "all",
        type: "Ice",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    hammerarm: {
        num: 359,
        accuracy: 90,
        basePower: 100,
        category: "Physical",
        name: "Hammer Arm",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        self: {"boosts":{"spe":-1}},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    happyhour: {
        num: 603,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Happy Hour",
        pp: 30,
        priority: 0,
        flags: {},
        onTryHit(target, source) {
            this.add('-activate', target, 'move: Happy Hour');
        },
        secondary: null,
        target: "allySide",
        type: "Normal",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Cute"
    },
    harden: {
        num: 106,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Harden",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    hardpress: {
		num: 912,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((100 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug('BP for ' + hp + '/' + maxHP + " HP: " + bp);
			return bp;
		},
		category: "Physical",
		name: "Hard Press",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
    haze: {
        onHit(target, source) {
            this.add('-activate', target, 'move: Haze');
            this.add('-clearallboost', '[silent]');
            for (const pokemon of this.getAllActive()) {
                pokemon.clearBoosts();
                if (pokemon !== source) {
                    pokemon.cureStatus(true);
                }
                if (pokemon.status === 'tox') {
                    pokemon.setStatus('psn', null, null, true);
                }
                pokemon.updateSpeed();
                // should only clear a specific set of volatiles
                // while technically the toxic counter shouldn't be cleared, the preserved toxic counter is never used again
                // in-game, so it is equivalent to just clear it.
                const silentHack = '|[silent]';
                const silentHackVolatiles = ['disable', 'confusion'];
                const hazeVolatiles = {
                    'disable': '',
                    'confusion': '',
                    'mist': 'Mist',
                    'focusenergy': 'move: Focus Energy',
                    'leechseed': 'move: Leech Seed',
                    'lightscreen': 'Light Screen',
                    'reflect': 'Reflect',
                    'residualdmg': 'Toxic counter',
                };
                for (const v in hazeVolatiles) {
                    if (!pokemon.removeVolatile(v)) {
                        continue;
                    }
                    if (silentHackVolatiles.includes(v)) {
                        // these volatiles have their own onEnd method that prints, so to avoid
                        // double printing and ensure they are still silent, we need to tack on a
                        // silent attribute at the end
                        this.log[this.log.length - 1] += silentHack;
                    }
                    else {
                        this.add('-end', pokemon, hazeVolatiles[v], '[silent]');
                    }
                }
            }
        },
        target: "self",
        num: 114,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Haze",
        pp: 30,
        priority: 0,
        flags: {"bypasssub":1},
        onHitField() {
            this.add('-clearallboost');
            for (const pokemon of this.getAllActive()) {
                pokemon.clearBoosts();
            }
        },
        secondary: null,
        type: "Ice",
        zMove: {"effect":"heal"},
        contestType: "Beautiful"
    },
    headbutt: {
        num: 29,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Headbutt",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    headcharge: {
        isNonstandard: null,
        num: 543,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Head Charge",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [1,4],
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    headlongrush: {
        num: 838,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Headlong Rush",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        self: {"boosts":{"def":-1,"spd":-1}},
        secondary: null,
        target: "normal",
        type: "Ground"
    },
    headsmash: {
        num: 457,
        accuracy: 80,
        basePower: 150,
        category: "Physical",
        name: "Head Smash",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [1,2],
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    healbell: {
        onHit(target, source) {
            this.add('-cureteam', source, '[from] move: Heal Bell');
            for (const pokemon of target.side.pokemon) {
                pokemon.clearStatus();
            }
        },
        flags: {"snatch":1,"sound":1},
        isNonstandard: null,
        num: 215,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Heal Bell",
        pp: 5,
        priority: 0,
        target: "allyTeam",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Beautiful"
    },
    healblock: {
        flags: {"protect":1,"mirror":1},
        condition: {
			duration: 5,
			durationCallback(target, source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
                    return 7;
                }
                return 5;
            },
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: Heal Block');
            },
			onDisableMove(pokemon) {
                for (const moveSlot of pokemon.moveSlots) {
                    if (this.dex.moves.get(moveSlot.id).flags['heal']) {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
                if (move.flags['heal']) {
                    this.add('cant', pokemon, 'move: Heal Block', move);
                    return false;
                }
            },
			onResidualOrder: 10,
			onResidualSubOrder: 17,
			onEnd(pokemon) {
                this.add('-end', pokemon, 'move: Heal Block');
            },
			onTryHeal(damage, pokemon, source, effect) {
                if (effect && (effect.id === 'drain' || effect.id === 'leechseed' || effect.id === 'wish')) {
                    return false;
                }
            } 
		},
        isNonstandard: null,
        num: 377,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Heal Block",
        pp: 15,
        priority: 0,
        volatileStatus: "healblock",
        secondary: null,
        target: "allAdjacentFoes",
        type: "Psychic",
        zMove: {"boost":{"spa":2}},
        contestType: "Clever"
    },
    healingwish: {
        flags: {"heal":1},
        onAfterMove(pokemon) {
            pokemon.switchFlag = true;
        },
        condition: {
			duration: 1,
			onSwitchInPriority: -1,
			onSwitchIn(target) {
                if (target.hp > 0) {
                    target.heal(target.maxhp);
                    target.clearStatus();
                    this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
                    target.side.removeSlotCondition(target, 'healingwish');
                    target.lastMove = this.lastMove;
                }
                else {
                    target.switchFlag = true;
                }
            } 
		},
        num: 361,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Healing Wish",
        pp: 10,
        priority: 0,
        onTryHit(source) {
            if (!this.canSwitch(source.side)) {
                this.attrLastMove('[still]');
                this.add('-fail', source);
                return this.NOT_FAIL;
            }
        },
        selfdestruct: "ifHit",
        slotCondition: "healingwish",
        secondary: null,
        target: "self",
        type: "Psychic",
        contestType: "Beautiful"
    },
    healorder: {
        isNonstandard: null,
        num: 456,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Heal Order",
        pp: 10,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        heal: [1,2],
        secondary: null,
        target: "self",
        type: "Bug",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    healpulse: {
        heal: [1,2],
        onHit() { },
        num: 505,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Heal Pulse",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"pulse":1,"reflectable":1,"distance":1,"heal":1,"allyanim":1},
        secondary: null,
        target: "any",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    heartstamp: {
        isNonstandard: null,
        num: 531,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Heart Stamp",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Psychic",
        contestType: "Cute"
    },
    heartswap: {
        isNonstandard: null,
        num: 391,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Heart Swap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            const targetBoosts = {};
            const sourceBoosts = {};
            let i;
            for (i in target.boosts) {
                targetBoosts[i] = target.boosts[i];
                sourceBoosts[i] = source.boosts[i];
            }
            target.setBoost(sourceBoosts);
            source.setBoost(targetBoosts);
            this.add('-swapboost', source, target, '[from] move: Heart Swap');
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"effect":"crit2"},
        contestType: "Clever"
    },
    heatcrash: {
        onTryHit() { },
        num: 535,
        accuracy: 100,
        basePower: 0,
        basePowerCallback(pokemon, target) {
            const targetWeight = target.getWeight();
            const pokemonWeight = pokemon.getWeight();
            let bp;
            if (pokemonWeight >= targetWeight * 5) {
                bp = 120;
            }
            else if (pokemonWeight >= targetWeight * 4) {
                bp = 100;
            }
            else if (pokemonWeight >= targetWeight * 3) {
                bp = 80;
            }
            else if (pokemonWeight >= targetWeight * 2) {
                bp = 60;
            }
            else {
                bp = 40;
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Physical",
        name: "Heat Crash",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "normal",
        type: "Fire",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    heatwave: {
        basePower: 100,
        num: 257,
        accuracy: 90,
        category: "Special",
        name: "Heat Wave",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: {"chance":10,"status":"brn"},
        target: "allAdjacentFoes",
        type: "Fire",
        contestType: "Beautiful"
    },
    heavyslam: {
        onTryHit() { },
        num: 484,
        accuracy: 100,
        basePower: 0,
        basePowerCallback(pokemon, target) {
            const targetWeight = target.getWeight();
            const pokemonWeight = pokemon.getWeight();
            let bp;
            if (pokemonWeight >= targetWeight * 5) {
                bp = 120;
            }
            else if (pokemonWeight >= targetWeight * 4) {
                bp = 100;
            }
            else if (pokemonWeight >= targetWeight * 3) {
                bp = 80;
            }
            else if (pokemonWeight >= targetWeight * 2) {
                bp = 60;
            }
            else {
                bp = 40;
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Physical",
        name: "Heavy Slam",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    helpinghand: {
        num: 270,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Helping Hand",
        pp: 20,
        priority: 5,
        flags: {"bypasssub":1,"noassist":1,"failcopycat":1},
        volatileStatus: "helpinghand",
        onTryHit(target) {
            if (!target.newlySwitched && !this.queue.willMove(target))
                return false;
        },
        condition: {
			duration: 1,
			onStart(target, source) {
                this.effectState.multiplier = 1.5;
                this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
            },
			onRestart(target, source) {
                this.effectState.multiplier *= 1.5;
                this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
            },
			onBasePowerPriority: 10,
			onBasePower(basePower) {
                this.debug('Boosting from Helping Hand: ' + this.effectState.multiplier);
                return this.chainModify(this.effectState.multiplier);
            } 
		},
        secondary: null,
        target: "adjacentAlly",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    hex: {
        basePower: 50,
        num: 506,
        accuracy: 100,
        basePowerCallback(pokemon, target, move) {
            if (target.status || target.hasAbility('comatose')) {
                this.debug('BP doubled from status condition');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Special",
        name: "Hex",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ghost",
        zMove: {"basePower":160},
        contestType: "Clever"
    },
    hiddenpower: {
        category: "Physical",
        onModifyMove(move, pokemon) {
            move.type = pokemon.hpType || 'Dark';
            const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
            move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
        },
        basePower: 0,
        basePowerCallback(pokemon) {
            const bp = pokemon.hpPower || 70;
            this.debug('BP: ' + bp);
            return bp;
        },
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        name: "Hidden Power",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            move.type = pokemon.hpType || 'Dark';
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Clever"
    },
    hiddenpowerbug: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Bug",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Clever"
    },
    hiddenpowerdark: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Dark",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    hiddenpowerdragon: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Dragon",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Clever"
    },
    hiddenpowerelectric: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Electric",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Clever"
    },
    hiddenpowerfighting: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Fighting",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Clever"
    },
    hiddenpowerfire: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Fire",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Clever"
    },
    hiddenpowerflying: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Flying",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Flying",
        contestType: "Clever"
    },
    hiddenpowerghost: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Ghost",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    hiddenpowergrass: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Grass",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Clever"
    },
    hiddenpowerground: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Ground",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Clever"
    },
    hiddenpowerice: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Ice",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Clever"
    },
    hiddenpowerpoison: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Poison",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Poison",
        contestType: "Clever"
    },
    hiddenpowerpsychic: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Psychic",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    hiddenpowerrock: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Rock",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Clever"
    },
    hiddenpowersteel: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Physical",
        realMove: "Hidden Power",
        name: "Hidden Power Steel",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Clever"
    },
    hiddenpowerwater: {
        basePower: 70,
        isNonstandard: null,
        num: 237,
        accuracy: 100,
        category: "Special",
        realMove: "Hidden Power",
        name: "Hidden Power Water",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Clever"
    },
    highhorsepower: {
        num: 667,
        accuracy: 95,
        basePower: 95,
        category: "Physical",
        name: "High Horsepower",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    highjumpkick: {
        onMoveFail(target, source, move) {
            this.directDamage(1, source, target);
        },
        basePower: 85,
        pp: 20,
        num: 136,
        accuracy: 90,
        category: "Physical",
        name: "High Jump Kick",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"gravity":1},
        hasCrashDamage: true,
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    holdback: {
        num: 610,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Hold Back",
        pp: 40,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onDamagePriority: -20,
        onDamage(damage, target, source, effect) {
            if (damage >= target.hp)
                return target.hp - 1;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    holdhands: {
        flags: {"bypasssub":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1},
        num: 607,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Hold Hands",
        pp: 40,
        priority: 0,
        secondary: null,
        target: "adjacentAlly",
        type: "Normal",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Cute"
    },
    honeclaws: {
        num: 468,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Hone Claws",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1,"accuracy":1},
        secondary: null,
        target: "self",
        type: "Dark",
        zMove: {"boost":{"atk":1}},
        contestType: "Cute"
    },
    hornattack: {
        num: 30,
        accuracy: 100,
        basePower: 65,
        category: "Physical",
        name: "Horn Attack",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    horndrill: {
        num: 32,
        accuracy: 30,
        basePower: 0,
        category: "Physical",
        name: "Horn Drill",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        ohko: true,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":180},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    hornleech: {
        flags: {"contact":1,"protect":1,"mirror":1},
        num: 532,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Horn Leech",
        pp: 10,
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Tough"
    },
    howl: {
        flags: {"snatch":1},
        boosts: {"atk":1},
        target: "self",
        num: 336,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Howl",
        pp: 40,
        priority: 0,
        secondary: null,
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Cool"
    },
    hurricane: {
        basePower: 120,
        num: 542,
        accuracy: 70,
        category: "Special",
        name: "Hurricane",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"distance":1,"wind":1},
        onModifyMove(move, pokemon, target) {
            switch (target?.effectiveWeather()) {
                case 'raindance':
                case 'primordialsea':
                    move.accuracy = true;
                    break;
                case 'sunnyday':
                case 'desolateland':
                    move.accuracy = 50;
                    break;
            }
        },
        secondary: {"chance":30,"volatileStatus":"confusion"},
        target: "any",
        type: "Flying",
        contestType: "Tough"
    },
    hydrocannon: {
        num: 308,
        accuracy: 90,
        basePower: 150,
        category: "Special",
        name: "Hydro Cannon",
        pp: 5,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    hydropump: {
        basePower: 120,
        num: 56,
        accuracy: 80,
        category: "Special",
        name: "Hydro Pump",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    hydrosteam: {
        num: 876,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Hydro Steam",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        thawsTarget: true,
        secondary: null,
        target: "normal",
        type: "Water"
    },
    hydrovortex: {
        isNonstandard: null,
        num: 642,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Hydro Vortex",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "wateriumz",
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    hyperbeam: {
        num: 63,
        accuracy: 90,
        basePower: 150,
        category: "Physical",
        name: "Hyper Beam",
        pp: 5,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1},
        onAfterHit(target, source) {
            if (target.hp > 0) source.addVolatile('mustrecharge');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    hyperdrill: {
        num: 887,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Hyper Drill",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Clever"
    },
    hyperfang: {
        isNonstandard: null,
        num: 158,
        accuracy: 90,
        basePower: 80,
        category: "Physical",
        name: "Hyper Fang",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"flinch"},
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    hyperspacefury: {
        isNonstandard: null,
        num: 621,
        accuracy: true,
        basePower: 100,
        category: "Physical",
        name: "Hyperspace Fury",
        pp: 5,
        priority: 0,
        flags: {"mirror":1,"bypasssub":1},
        breaksProtect: true,
        onTry(source) {
            if (source.species.name === 'Hoopa-Unbound') {
                return;
            }
            this.hint("Only a Pokemon whose form is Hoopa Unbound can use this move.");
            if (source.species.name === 'Hoopa') {
                this.attrLastMove('[still]');
                this.add('-fail', source, 'move: Hyperspace Fury', '[forme]');
                return null;
            }
            this.attrLastMove('[still]');
            this.add('-fail', source, 'move: Hyperspace Fury');
            return null;
        },
        self: {"boosts":{"def":-1}},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Tough"
    },
    hyperspacehole: {
        isNonstandard: null,
        num: 593,
        accuracy: true,
        basePower: 80,
        category: "Special",
        name: "Hyperspace Hole",
        pp: 5,
        priority: 0,
        flags: {"mirror":1,"bypasssub":1},
        breaksProtect: true,
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    hypervoice: {
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 304,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Hyper Voice",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        contestType: "Cool"
    },
    hypnosis: {
        accuracy: 60,
        num: 95,
        basePower: 0,
        category: "Status",
        name: "Hypnosis",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    iceball: {
        isNonstandard: null,
        num: 301,
        accuracy: 90,
        basePower: 30,
        basePowerCallback(pokemon, target, move) {
            let bp = move.basePower;
            const iceballData = pokemon.volatiles['iceball'];
            if (iceballData?.hitCount) {
                bp *= Math.pow(2, iceballData.contactHitCount);
            }
            if (iceballData && pokemon.status !== 'slp') {
                iceballData.hitCount++;
                iceballData.contactHitCount++;
                if (iceballData.hitCount < 5) {
                    iceballData.duration = 2;
                }
            }
            if (pokemon.volatiles['defensecurl']) {
                bp *= 2;
            }
            this.debug("BP: " + bp);
            return bp;
        },
        category: "Special",
        name: "Ice Ball",
        pp: 20,
        priority: 0,
        flags: {"bullet":1,"contact":1,"protect":1,"mirror":1,"noparentalbond":1,"failinstruct":1},
        onModifyMove(move, pokemon, target) {
            if (pokemon.volatiles['iceball'] || pokemon.status === 'slp' || !target)
                return;
            pokemon.addVolatile('iceball');
            // @ts-ignore
            // TS thinks pokemon.volatiles['iceball'] doesn't exist because of the condition on the return above
            // but it does exist now because addVolatile created it
            pokemon.volatiles['iceball'].targetSlot = move.sourceEffect ? pokemon.lastMoveTargetLoc : pokemon.getLocOf(target);
        },
        onAfterMove(source, target, move) {
            const iceballData = source.volatiles["iceball"];
            if (iceballData &&
                iceballData.hitCount === 5 &&
                iceballData.contactHitCount < 5
            // this conditions can only be met in gen7 and gen8dlc1
            // see `disguise` and `iceface` abilities in the resp mod folders
            ) {
                source.addVolatile("rolloutstorage");
                source.volatiles["rolloutstorage"].contactHitCount =
                    iceballData.contactHitCount;
            }
        },
        condition: {
			duration: 1,
			onLockMove: "iceball",
			onStart() {
                this.effectState.hitCount = 0;
                this.effectState.contactHitCount = 0;
            },
			onResidual(target) {
                if (target.lastMove && target.lastMove.id === 'struggle') {
                    // don't lock
                    delete target.volatiles['iceball'];
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    icebeam: {
        basePower: 95,
        num: 58,
        accuracy: 100,
        category: "Special",
        name: "Ice Beam",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"frz"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    iceburn: {
        isNonstandard: null,
        num: 554,
        accuracy: 90,
        basePower: 140,
        category: "Special",
        name: "Ice Burn",
        pp: 5,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1,"nosleeptalk":1,"failinstruct":1},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    icefang: {
        num: 423,
        accuracy: 95,
        basePower: 65,
        category: "Physical",
        name: "Ice Fang",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        secondaries: [{"chance":10,"status":"frz"},{"chance":10,"volatileStatus":"flinch"}],
        target: "normal",
        type: "Ice",
        contestType: "Cool"
    },
    icehammer: {
        isNonstandard: null,
        num: 665,
        accuracy: 90,
        basePower: 100,
        category: "Physical",
        name: "Ice Hammer",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        self: {"boosts":{"spe":-1}},
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Tough"
    },
    icepunch: {
        num: 8,
        accuracy: 100,
        basePower: 75,
        category: "Special",
        name: "Ice Punch",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":10,"status":"frz"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    iceshard: {
        num: 420,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Ice Shard",
        pp: 30,
        priority: 1,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    icespinner: {
        num: 861,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Ice Spinner",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onHit() {
            this.field.clearTerrain();
        },
        onAfterSubDamage() {
            this.field.clearTerrain();
        },
        secondary: null,
        target: "normal",
        type: "Ice"
    },
    iciclecrash: {
        num: 556,
        accuracy: 90,
        basePower: 85,
        category: "Physical",
        name: "Icicle Crash",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Ice",
        contestType: "Beautiful"
    },
    iciclespear: {
        basePower: 10,
        num: 333,
        accuracy: 100,
        category: "Special",
        name: "Icicle Spear",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Ice",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Beautiful"
    },
    icywind: {
        num: 196,
        accuracy: 95,
        basePower: 55,
        category: "Special",
        name: "Icy Wind",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "allAdjacentFoes",
        type: "Ice",
        contestType: "Beautiful"
    },
    imprison: {
        flags: {"bypasssub":1},
        onTryHit(pokemon) {
            for (const target of pokemon.foes()) {
                for (const move of pokemon.moves) {
                    if (target.moves.includes(move))
                        return;
                }
            }
            return false;
        },
        num: 286,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Imprison",
        pp: 10,
        priority: 0,
        volatileStatus: "imprison",
        condition: {
			noCopy: true,
			onStart(target) {
                this.add('-start', target, 'move: Imprison');
            },
			onFoeDisableMove(pokemon) {
                for (const moveSlot of this.effectState.source.moveSlots) {
                    if (moveSlot.id === 'struggle')
                        continue;
                    pokemon.disableMove(moveSlot.id, 'hidden');
                }
                pokemon.maybeDisabled = true;
            },
			onFoeBeforeMovePriority: 4,
			onFoeBeforeMove(attacker, defender, move) {
                if (move.id !== 'struggle' && this.effectState.source.hasMove(move.id) && !move.isZ && !move.isMax) {
                    this.add('cant', attacker, 'move: Imprison', move);
                    return false;
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"spd":2}},
        contestType: "Clever"
    },
    incinerate: {
        basePower: 30,
        onHit(pokemon, source) {
            const item = pokemon.getItem();
            if (item.isBerry && pokemon.takeItem(source)) {
                this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
            }
        },
        num: 510,
        accuracy: 100,
        category: "Special",
        name: "Incinerate",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Fire",
        contestType: "Tough"
    },
    infernalparade: {
        num: 844,
        accuracy: 100,
        basePower: 60,
        basePowerCallback(pokemon, target, move) {
            if (target.status || target.hasAbility('comatose'))
                return move.basePower * 2;
            return move.basePower;
        },
        category: "Special",
        name: "Infernal Parade",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Ghost"
    },
    inferno: {
        num: 517,
        accuracy: 50,
        basePower: 100,
        category: "Special",
        name: "Inferno",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    infernooverdrive: {
        isNonstandard: null,
        num: 640,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Inferno Overdrive",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "firiumz",
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Cool"
    },
    infestation: {
        num: 611,
        accuracy: 100,
        basePower: 20,
        category: "Special",
        name: "Infestation",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    ingrain: {
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: Ingrain');
            },
			onResidualOrder: 10,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
                this.heal(pokemon.baseMaxhp / 16);
            },
			onTrapPokemon(pokemon) {
                pokemon.tryTrap();
            },
			onDragOut(pokemon) {
                this.add('-activate', pokemon, 'move: Ingrain');
                return null;
            } 
		},
        num: 275,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Ingrain",
        pp: 20,
        priority: 0,
        flags: {"snatch":1,"nonsky":1},
        volatileStatus: "ingrain",
        secondary: null,
        target: "self",
        type: "Grass",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    instruct: {
        num: 689,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Instruct",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"bypasssub":1,"allyanim":1,"failinstruct":1},
        onHit(target, source) {
            if (!target.lastMove || target.volatiles['dynamax'])
                return false;
            const lastMove = target.lastMove;
            const moveIndex = target.moves.indexOf(lastMove.id);
            if (lastMove.flags['failinstruct'] || lastMove.isZ || lastMove.isMax ||
                lastMove.flags['charge'] || lastMove.flags['recharge'] ||
                target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
                (target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)) {
                return false;
            }
            this.add('-singleturn', target, 'move: Instruct', '[of] ' + source);
            this.queue.prioritizeAction(this.queue.resolveAction({
                choice: 'move',
                pokemon: target,
                moveid: target.lastMove.id,
                targetLoc: target.lastMoveTargetLoc,
            })[0]);
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    iondeluge: {
        isNonstandard: null,
        num: 569,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Ion Deluge",
        pp: 25,
        priority: 1,
        flags: {},
        pseudoWeather: "iondeluge",
        condition: {
			duration: 1,
			onFieldStart(target, source, sourceEffect) {
                this.add('-fieldactivate', 'move: Ion Deluge');
                this.hint(`Normal-type moves become Electric-type after using ${sourceEffect}.`);
            },
			onModifyTypePriority: -2,
			onModifyType(move) {
                if (move.type === 'Normal') {
                    move.type = 'Electric';
                    this.debug(move.name + "'s type changed to Electric");
                }
            } 
		},
        secondary: null,
        target: "all",
        type: "Electric",
        zMove: {"boost":{"spa":1}},
        contestType: "Beautiful"
    },
    irondefense: {
        num: 334,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Iron Defense",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":2},
        secondary: null,
        target: "self",
        type: "Steel",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    ironhead: {
        num: 442,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Iron Head",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Steel",
        contestType: "Tough"
    },
    irontail: {
        num: 231,
        accuracy: 75,
        basePower: 100,
        category: "Physical",
        name: "Iron Tail",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"boosts":{"def":-1}},
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    ivycudgel: {
		num: 904,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Ivy Cudgel",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		onPrepareHit(target, source, move) {
			if (move.type !== "Grass") {
				this.attrLastMove('[anim] Ivy Cudgel ' + move.type);
			}
		},
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Ogerpon-Wellspring': case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Ogerpon-Hearthflame': case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Ogerpon-Cornerstone': case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Rock';
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
    jawlock: {
        num: 746,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Jaw Lock",
        pp: 10,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        onHit(target, source, move) {
            source.addVolatile('trapped', target, move, 'trapper');
            target.addVolatile('trapped', source, move, 'trapper');
        },
        secondary: null,
        target: "normal",
        type: "Dark"
    },
    jetpunch: {
        num: 857,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Jet Punch",
        pp: 15,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        hasSheerForce: true,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    judgment: {
        isNonstandard: null,
        num: 449,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Judgment",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            if (pokemon.ignoringItem())
                return;
            const item = pokemon.getItem();
            if (item.id && item.onPlate && !item.zMove) {
                move.type = item.onPlate;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Beautiful"
    },
    jumpkick: {
        onMoveFail(target, source, move) {
            this.directDamage(1, source, target);
        },
        basePower: 70,
        pp: 25,
        isNonstandard: null,
        num: 26,
        accuracy: 95,
        category: "Physical",
        name: "Jump Kick",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"gravity":1},
        hasCrashDamage: true,
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    junglehealing: {
        num: 816,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Jungle Healing",
        pp: 10,
        priority: 0,
        flags: {"heal":1,"bypasssub":1,"allyanim":1},
        onHit(pokemon) {
            const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
            return pokemon.cureStatus() || success;
        },
        secondary: null,
        target: "allies",
        type: "Grass"
    },
    karatechop: {
        critRatio: 2,
        type: "Normal",
        isNonstandard: null,
        num: 2,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Karate Chop",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        contestType: "Tough"
    },
    kinesis: {
        isNonstandard: null,
        num: 134,
        accuracy: 80,
        basePower: 0,
        category: "Status",
        name: "Kinesis",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"accuracy":-1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"evasion":1}},
        contestType: "Clever"
    },
    kingsshield: {
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect'] || move.category === 'Status') {
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                this.add('-activate', target, 'move: Protect');
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                if (this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ atk: -2 }, source, target, this.dex.getActiveMove("King's Shield"));
                }
                return this.NOT_FAIL;
            },
			onHit(target, source, move) {
                if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ atk: -2 }, source, target, this.dex.getActiveMove("King's Shield"));
                }
            } 
		},
        isNonstandard: null,
        num: 588,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "King's Shield",
        pp: 10,
        priority: 4,
        flags: {"noassist":1,"failcopycat":1,"failinstruct":1},
        stallingMove: true,
        volatileStatus: "kingsshield",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        secondary: null,
        target: "self",
        type: "Steel",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cool"
    },
    knockoff: {
        onAfterHit(target, source, move) {
            if (!target.item || target.itemState.knockedOff)
                return;
            if (target.ability === 'multitype')
                return;
            const item = target.getItem();
            if (this.runEvent('TakeItem', target, source, move, item)) {
                target.itemState.knockedOff = true;
                this.add('-enditem', target, item.name, '[from] move: Knock Off');
                this.hint("In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.", true);
            }
        },
        basePower: 20,
        onBasePower() { },
        num: 282,
        accuracy: 100,
        category: "Special",
        name: "Knock Off",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    kowtowcleave: {
        num: 869,
        accuracy: true,
        basePower: 85,
        category: "Physical",
        name: "Kowtow Cleave",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        target: "normal",
        type: "Dark"
    },
    landswrath: {
        isNonstandard: null,
        num: 616,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Land's Wrath",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Ground",
        zMove: {"basePower":185},
        contestType: "Beautiful"
    },
    laserfocus: {
        isNonstandard: null,
        num: 673,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Laser Focus",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "laserfocus",
        condition: {
			duration: 2,
			onStart(pokemon, source, effect) {
                if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
                    this.add('-start', pokemon, 'move: Laser Focus', '[silent]');
                }
                else {
                    this.add('-start', pokemon, 'move: Laser Focus');
                }
            },
			onRestart(pokemon) {
                this.effectState.duration = 2;
                this.add('-start', pokemon, 'move: Laser Focus');
            },
			onModifyCritRatio(critRatio) {
                return 5;
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'move: Laser Focus', '[silent]');
            } 
		},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Cool"
    },
    lashout: {
        num: 808,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Lash Out",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onBasePower(basePower, source) {
            if (source.statsLoweredThisTurn) {
                this.debug('lashout buff');
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Dark"
    },
    lastresort: {
        basePower: 130,
        num: 387,
        accuracy: 100,
        category: "Physical",
        name: "Last Resort",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onTry(source) {
            if (source.moveSlots.length < 2)
                return false; // Last Resort fails unless the user knows at least 2 moves
            let hasLastResort = false; // User must actually have Last Resort for it to succeed
            for (const moveSlot of source.moveSlots) {
                if (moveSlot.id === 'lastresort') {
                    hasLastResort = true;
                    continue;
                }
                if (!moveSlot.used)
                    return false;
            }
            return hasLastResort;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    lastrespects: {
        num: 854,
        accuracy: 100,
        basePower: 50,
        basePowerCallback(pokemon, target, move) {
            return 50 + 50 * pokemon.side.totalFainted;
        },
        category: "Physical",
        name: "Last Respects",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ghost"
    },
    lavaplume: {
        num: 436,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Lava Plume",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"brn"},
        target: "allAdjacent",
        type: "Fire",
        contestType: "Tough"
    },
    leafage: {
        num: 670,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Leafage",
        pp: 40,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Tough"
    },
    leafblade: {
        basePower: 70,
        num: 348,
        accuracy: 100,
        category: "Special",
        name: "Leaf Blade",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    leafstorm: {
        basePower: 140,
        num: 437,
        accuracy: 90,
        category: "Special",
        name: "Leaf Storm",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"spa":-2}},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Beautiful"
    },
    leaftornado: {
        isNonstandard: null,
        num: 536,
        accuracy: 90,
        basePower: 65,
        category: "Special",
        name: "Leaf Tornado",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    leechlife: {
        flags: {"contact":1,"protect":1,"mirror":1},
        basePower: 20,
        pp: 15,
        num: 141,
        accuracy: 100,
        category: "Physical",
        name: "Leech Life",
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Clever"
    },
    leechseed: {
        onHit() { },
        condition: {
			onStart(target) {
                this.add('-start', target, 'move: Leech Seed');
            },
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
                const leecher = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
                if (!leecher || leecher.fainted || leecher.hp <= 0) {
                    this.debug('Nothing to leech into');
                    return;
                }
                // We check if leeched Pokémon has Toxic to increase leeched damage.
                let toxicCounter = 1;
                const residualdmg = pokemon.volatiles['residualdmg'];
                if (residualdmg) {
                    residualdmg.counter++;
                    toxicCounter = residualdmg.counter;
                }
                const toLeech = this.clampIntRange(Math.floor(pokemon.baseMaxhp / 16), 1) * toxicCounter;
                const damage = this.damage(toLeech, pokemon, leecher);
                if (residualdmg)
                    this.hint("In Gen 1, Leech Seed's damage is affected by Toxic's counter.", true);
                if (!damage || toLeech > damage) {
                    this.hint("In Gen 1, Leech Seed recovery is not limited by the remaining HP of the seeded Pokemon.", true);
                }
                this.heal(toLeech, leecher, pokemon);
            } 
		},
        num: 73,
        accuracy: 90,
        basePower: 0,
        category: "Status",
        name: "Leech Seed",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        volatileStatus: "leechseed",
        onTryImmunity(target) {
            return !target.hasType('Grass');
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    leer: {
        num: 43,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Leer",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"def":-1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Cool"
    },
    letssnuggleforever: {
        isNonstandard: null,
        num: 726,
        accuracy: true,
        basePower: 190,
        category: "Physical",
        name: "Let's Snuggle Forever",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "mimikiumz",
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Cool"
    },
    lick: {
        basePower: 20,
        num: 122,
        accuracy: 100,
        category: "Physical",
        name: "Lick",
        pp: 30,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Ghost",
        contestType: "Cute"
    },
    lifedew: {
        num: 791,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Life Dew",
        pp: 10,
        priority: 0,
        flags: {"snatch":1,"heal":1,"bypasssub":1},
        heal: [1,4],
        secondary: null,
        target: "allies",
        type: "Water"
    },
    lightofruin: {
        isNonstandard: "Unobtainable",
        num: 617,
        accuracy: 90,
        basePower: 140,
        category: "Special",
        name: "Light of Ruin",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        recoil: [1,2],
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Beautiful"
    },
    lightscreen: {
        num: 113,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Light Screen",
        pp: 30,
        priority: 0,
        flags: {},
        volatileStatus: "lightscreen",
        onTryHit(pokemon) {
            if (pokemon.volatiles['lightscreen']) {
                return false;
            }
        },
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Light Screen');
            } 
		},
        target: "self",
        type: "Psychic"
    },
    lightthatburnsthesky: {
        isNonstandard: null,
        num: 723,
        accuracy: true,
        basePower: 200,
        category: "Special",
        name: "Light That Burns the Sky",
        pp: 1,
        priority: 0,
        flags: {},
        onModifyMove(move, pokemon) {
            if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true))
                move.category = 'Physical';
        },
        ignoreAbility: true,
        isZ: "ultranecroziumz",
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    liquidation: {
        num: 710,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        name: "Liquidation",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"boosts":{"def":-1}},
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    lockon: {
        onTryHit(target) {
            if (target.volatiles['foresight'] || target.volatiles['lockon'])
                return false;
        },
        condition: {
			duration: 2,
			onSourceAccuracy(accuracy, target, source, move) {
                if (move && source === this.effectState.target && target === this.effectState.source)
                    return true;
            } 
		},
        accuracy: 100,
        num: 199,
        basePower: 0,
        category: "Status",
        name: "Lock-On",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit(target, source) {
            source.addVolatile('lockon', target);
            this.add('-activate', source, 'move: Lock-On', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    lovelykiss: {
        isNonstandard: null,
        num: 142,
        accuracy: 75,
        basePower: 0,
        category: "Status",
        name: "Lovely Kiss",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    lowkick: {
        accuracy: 90,
        basePower: 50,
        basePowerCallback() {
            return 50;
        },
        secondary: {"chance":30,"volatileStatus":"flinch"},
        onTryHit() { },
        num: 67,
        category: "Physical",
        name: "Low Kick",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Fighting",
        zMove: {"basePower":160},
        contestType: "Tough"
    },
    lowsweep: {
        basePower: 60,
        num: 490,
        accuracy: 100,
        category: "Physical",
        name: "Low Sweep",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "normal",
        type: "Fighting",
        contestType: "Clever"
    },
    luckychant: {
        flags: {},
        condition: {
			duration: 5,
			onSideStart(side) {
                this.add('-sidestart', side, 'move: Lucky Chant');
            },
			onCriticalHit: false,
			onSideResidualOrder: 6,
			onSideEnd(side) {
                this.add('-sideend', side, 'move: Lucky Chant');
            } 
		},
        isNonstandard: null,
        num: 381,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Lucky Chant",
        pp: 30,
        priority: 0,
        sideCondition: "luckychant",
        secondary: null,
        target: "allySide",
        type: "Normal",
        zMove: {"boost":{"evasion":1}},
        contestType: "Cute"
    },
    luminacrash: {
        num: 855,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Lumina Crash",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spd":-2}},
        target: "normal",
        type: "Psychic"
    },
    lunarblessing: {
        num: 849,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Lunar Blessing",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        onHit(pokemon) {
            const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
            return pokemon.cureStatus() || success;
        },
        secondary: null,
        target: "allies",
        type: "Psychic"
    },
    lunardance: {
        flags: {"heal":1},
        onAfterMove(pokemon) {
            pokemon.switchFlag = true;
        },
        condition: {
			duration: 1,
			onSideStart(side) {
                this.debug('Lunar Dance started on ' + side.name);
            },
			onSwitchInPriority: -1,
			onSwitchIn(target) {
                if (target.getSlot() !== this.effectState.sourceSlot) {
                    return;
                }
                if (target.hp > 0) {
                    target.heal(target.maxhp);
                    target.clearStatus();
                    for (const moveSlot of target.moveSlots) {
                        moveSlot.pp = moveSlot.maxpp;
                    }
                    this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
                    target.side.removeSlotCondition(target, 'lunardance');
                    target.lastMove = this.lastMove;
                }
                else {
                    target.switchFlag = true;
                }
            } 
		},
        num: 461,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Lunar Dance",
        pp: 10,
        priority: 0,
        onTryHit(source) {
            if (!this.canSwitch(source.side)) {
                this.attrLastMove('[still]');
                this.add('-fail', source);
                return this.NOT_FAIL;
            }
        },
        selfdestruct: "ifHit",
        slotCondition: "lunardance",
        secondary: null,
        target: "self",
        type: "Psychic",
        contestType: "Beautiful"
    },
    lunge: {
        num: 679,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Lunge",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"atk":-1}},
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    lusterpurge: {
        isNonstandard: null,
        num: 295,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Luster Purge",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"spd":-1}},
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    machpunch: {
        num: 183,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Mach Punch",
        pp: 30,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    magicalleaf: {
        num: 345,
        accuracy: true,
        basePower: 60,
        category: "Special",
        name: "Magical Leaf",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Beautiful"
    },
    magicaltorque: {
        num: 900,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        isNonstandard: "Unobtainable",
        name: "Magical Torque",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"failencore":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: {"chance":30,"volatileStatus":"confusion"},
        target: "normal",
        type: "Fairy"
    },
    magiccoat: {
        condition: {
			duration: 1,
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
                if (target === source || move.hasBounced || !move.flags['reflectable']) {
                    return;
                }
                target.removeVolatile('magiccoat');
                const newMove = this.dex.getActiveMove(move.id);
                newMove.hasBounced = true;
                this.actions.useMove(newMove, target, source);
                return null;
            } 
		},
        isNonstandard: null,
        num: 277,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Magic Coat",
        pp: 15,
        priority: 4,
        flags: {},
        volatileStatus: "magiccoat",
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"spd":2}},
        contestType: "Beautiful"
    },
    magicpowder: {
        num: 750,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Magic Powder",
        pp: 20,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onHit(target) {
            if (target.getTypes().join() === 'Psychic' || !target.setType('Psychic'))
                return false;
            this.add('-start', target, 'typechange', 'Psychic');
        },
        secondary: null,
        target: "normal",
        type: "Psychic"
    },
    magicroom: {
        priority: -7,
        num: 478,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Magic Room",
        pp: 10,
        flags: {"mirror":1},
        pseudoWeather: "magicroom",
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
                    return 7;
                }
                return 5;
            },
			onFieldStart(target, source) {
                if (source?.hasAbility('persistent')) {
                    this.add('-fieldstart', 'move: Magic Room', '[of] ' + source, '[persistent]');
                }
                else {
                    this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
                }
                for (const mon of this.getAllActive()) {
                    this.singleEvent('End', mon.getItem(), mon.itemState, mon);
                }
            },
			onFieldRestart(target, source) {
                this.field.removePseudoWeather('magicroom');
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
                this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
            } 
		},
        secondary: null,
        target: "all",
        type: "Psychic",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    magmastorm: {
        accuracy: 70,
        basePower: 120,
        num: 463,
        category: "Special",
        name: "Magma Storm",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Tough"
    },
    magnetbomb: {
        isNonstandard: null,
        num: 443,
        accuracy: true,
        basePower: 60,
        category: "Physical",
        name: "Magnet Bomb",
        pp: 20,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    magneticflux: {
        num: 602,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Magnetic Flux",
        pp: 20,
        priority: 0,
        flags: {"snatch":1,"distance":1,"bypasssub":1},
        onHitSide(side, source, move) {
            const targets = side.allies().filter(ally => (ally.hasAbility(['plus', 'minus']) &&
                (!ally.volatiles['maxguard'] || this.runEvent('TryHit', ally, source, move))));
            if (!targets.length)
                return false;
            let didSomething = false;
            for (const target of targets) {
                didSomething = this.boost({ def: 1, spd: 1 }, target, source, move, false, true) || didSomething;
            }
            return didSomething;
        },
        secondary: null,
        target: "allySide",
        type: "Electric",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    magnetrise: {
        flags: {"gravity":1},
        volatileStatus: "magnetrise",
        condition: {
			duration: 5,
			onStart(target) {
                if (target.volatiles['ingrain'] || target.ability === 'levitate')
                    return false;
                this.add('-start', target, 'Magnet Rise');
            },
			onImmunity(type) {
                if (type === 'Ground')
                    return false;
            },
			onResidualOrder: 10,
			onResidualSubOrder: 16,
			onEnd(target) {
                this.add('-end', target, 'Magnet Rise');
            } 
		},
        num: 393,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Magnet Rise",
        pp: 10,
        priority: 0,
        onTry(source, target, move) {
            if (target.volatiles['smackdown'] || target.volatiles['ingrain'])
                return false;
            // Additional Gravity check for Z-move variant
            if (this.field.getPseudoWeather('Gravity')) {
                this.add('cant', source, 'move: Gravity', move);
                return null;
            }
        },
        secondary: null,
        target: "self",
        type: "Electric",
        zMove: {"boost":{"evasion":1}},
        contestType: "Clever"
    },
    magnitude: {
        isNonstandard: null,
        num: 222,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Magnitude",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        onModifyMove(move, pokemon) {
            const i = this.random(100);
            if (i < 5) {
                move.magnitude = 4;
                move.basePower = 10;
            }
            else if (i < 15) {
                move.magnitude = 5;
                move.basePower = 30;
            }
            else if (i < 35) {
                move.magnitude = 6;
                move.basePower = 50;
            }
            else if (i < 65) {
                move.magnitude = 7;
                move.basePower = 70;
            }
            else if (i < 85) {
                move.magnitude = 8;
                move.basePower = 90;
            }
            else if (i < 95) {
                move.magnitude = 9;
                move.basePower = 110;
            }
            else {
                move.magnitude = 10;
                move.basePower = 150;
            }
        },
        onUseMoveMessage(pokemon, target, move) {
            this.add('-activate', pokemon, 'move: Magnitude', move.magnitude);
        },
        secondary: null,
        target: "allAdjacent",
        type: "Ground",
        zMove: {"basePower":140},
        maxMove: {"basePower":140},
        contestType: "Tough"
    },
    makeitrain: {
        num: 874,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Make It Rain",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"spa":-1}},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Steel",
        contestType: "Beautiful"
    },
    maliciousmoonsault: {
        isNonstandard: null,
        num: 696,
        accuracy: true,
        basePower: 180,
        category: "Physical",
        name: "Malicious Moonsault",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "inciniumz",
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Cool"
    },
    malignantchain: {
		num: 919,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		isNonstandard: null,
		name: "Malignant Chain",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'tox',
		},
		target: "normal",
		type: "Poison",
	},
    matblock: {
        isNonstandard: null,
        num: 561,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Mat Block",
        pp: 10,
        priority: 0,
        flags: {"snatch":1,"nonsky":1,"noassist":1,"failcopycat":1},
        stallingMove: true,
        sideCondition: "matblock",
        onTry(source) {
            if (source.activeMoveActions > 1) {
                this.hint("Mat Block only works on your first turn out.");
                return false;
            }
            return !!this.queue.willAct();
        },
        condition: {
			duration: 1,
			onSideStart(target, source) {
                this.add('-singleturn', source, 'Mat Block');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect']) {
                    if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id))
                        return;
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                if (move && (move.target === 'self' || move.category === 'Status'))
                    return;
                this.add('-activate', target, 'move: Mat Block', move.name);
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                return this.NOT_FAIL;
            } 
		},
        secondary: null,
        target: "allySide",
        type: "Fighting",
        zMove: {"boost":{"def":1}},
        contestType: "Cool"
    },
    matchagotcha: {
		num: 902,
		accuracy: 90,
		basePower: 80,
		category: "Special",
		name: "Matcha Gotcha",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1, defrost: 1},
		drain: [1, 2],
		thawsTarget: true,
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Grass",
	},
    maxairstream: {
        isNonstandard: null,
        num: 766,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Airstream",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Flying",
        contestType: "Cool"
    },
    maxdarkness: {
        isNonstandard: null,
        num: 772,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Darkness",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Dark",
        contestType: "Cool"
    },
    maxflare: {
        isNonstandard: null,
        num: 757,
        accuracy: true,
        basePower: 100,
        category: "Physical",
        name: "Max Flare",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Fire",
        contestType: "Cool"
    },
    maxflutterby: {
        isNonstandard: null,
        num: 758,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Flutterby",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Bug",
        contestType: "Cool"
    },
    maxgeyser: {
        isNonstandard: null,
        num: 765,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Geyser",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Water",
        contestType: "Cool"
    },
    maxguard: {
        isNonstandard: null,
        num: 743,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Max Guard",
        pp: 10,
        priority: 4,
        flags: {},
        isMax: true,
        stallingMove: true,
        volatileStatus: "maxguard",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Max Guard');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                const bypassesMaxGuard = [
                    'acupressure', 'afteryou', 'allyswitch', 'aromatherapy', 'aromaticmist', 'coaching', 'confide', 'copycat', 'curse', 'decorate', 'doomdesire', 'feint', 'futuresight', 'gmaxoneblow', 'gmaxrapidflow', 'healbell', 'holdhands', 'howl', 'junglehealing', 'lifedew', 'meanlook', 'perishsong', 'playnice', 'powertrick', 'roar', 'roleplay', 'tearfullook',
                ];
                if (bypassesMaxGuard.includes(move.id))
                    return;
                if (move.smartTarget) {
                    move.smartTarget = false;
                }
                else {
                    this.add('-activate', target, 'move: Max Guard');
                }
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                return this.NOT_FAIL;
            } 
		},
        secondary: null,
        target: "self",
        type: "Normal",
        contestType: "Cool"
    },
    maxhailstorm: {
        isNonstandard: null,
        num: 763,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Hailstorm",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Ice",
        contestType: "Cool"
    },
    maxknuckle: {
        isNonstandard: null,
        num: 761,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Knuckle",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Fighting",
        contestType: "Cool"
    },
    maxlightning: {
        isNonstandard: null,
        num: 759,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Lightning",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Electric",
        contestType: "Cool"
    },
    maxmindstorm: {
        isNonstandard: null,
        num: 769,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Mindstorm",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Psychic",
        contestType: "Cool"
    },
    maxooze: {
        isNonstandard: null,
        num: 764,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Ooze",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Poison",
        contestType: "Cool"
    },
    maxovergrowth: {
        isNonstandard: null,
        num: 773,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Overgrowth",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Grass",
        contestType: "Cool"
    },
    maxphantasm: {
        isNonstandard: null,
        num: 762,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Phantasm",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Ghost",
        contestType: "Cool"
    },
    maxquake: {
        isNonstandard: null,
        num: 771,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Quake",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Ground",
        contestType: "Cool"
    },
    maxrockfall: {
        isNonstandard: null,
        num: 770,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Rockfall",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Rock",
        contestType: "Cool"
    },
    maxstarfall: {
        isNonstandard: null,
        num: 767,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Starfall",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Fairy",
        contestType: "Cool"
    },
    maxsteelspike: {
        isNonstandard: null,
        num: 774,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Steelspike",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Steel",
        contestType: "Cool"
    },
    maxstrike: {
        isNonstandard: null,
        num: 760,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Strike",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Normal",
        contestType: "Cool"
    },
    maxwyrmwind: {
        isNonstandard: null,
        num: 768,
        accuracy: true,
        basePower: 10,
        category: "Physical",
        name: "Max Wyrmwind",
        pp: 10,
        priority: 0,
        flags: {},
        isMax: true,
        self: {},
        target: "adjacentFoe",
        type: "Dragon",
        contestType: "Cool"
    },
    meanlook: {
        flags: {"reflectable":1,"mirror":1},
        num: 212,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Mean Look",
        pp: 5,
        priority: 0,
        onHit(target, source, move) {
            return target.addVolatile('trapped', source, move, 'trapper');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Beautiful"
    },
    meditate: {
        isNonstandard: null,
        num: 96,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Meditate",
        pp: 40,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"atk":1}},
        contestType: "Beautiful"
    },
    mefirst: {
        condition: {
			duration: 1,
			onModifyDamagePhase2(damage) {
                return damage * 1.5;
            } 
		},
        flags: {"protect":1,"bypasssub":1,"noassist":1,"failcopycat":1,"failmefirst":1,"nosleeptalk":1},
        isNonstandard: null,
        num: 382,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Me First",
        pp: 20,
        priority: 0,
        onTryHit(target, pokemon) {
            const action = this.queue.willMove(target);
            if (!action)
                return false;
            const move = this.dex.getActiveMove(action.move.id);
            if (action.zmove || move.isZ || move.isMax)
                return false;
            if (target.volatiles['mustrecharge'])
                return false;
            if (move.category === 'Status' || move.flags['failmefirst'])
                return false;
            pokemon.addVolatile('mefirst');
            this.actions.useMove(move, pokemon, target);
            return null;
        },
        secondary: null,
        target: "adjacentFoe",
        type: "Normal",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    megadrain: {
        pp: 10,
        flags: {"protect":1,"mirror":1},
        num: 72,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Mega Drain",
        priority: 0,
        drain: [1,2],
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"basePower":120},
        contestType: "Clever"
    },
    megahorn: {
        num: 224,
        accuracy: 85,
        basePower: 120,
        category: "Physical",
        name: "Megahorn",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cool"
    },
    megakick: {
        num: 25,
        accuracy: 75,
        basePower: 120,
        category: "Physical",
        name: "Mega Kick",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    megapunch: {
        num: 5,
        accuracy: 85,
        basePower: 80,
        category: "Physical",
        name: "Mega Punch",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    memento: {
        accuracy: true,
        num: 262,
        basePower: 0,
        category: "Status",
        name: "Memento",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        boosts: {"atk":-2,"spa":-2},
        selfdestruct: "ifHit",
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"effect":"healreplacement"},
        contestType: "Tough"
    },
    menacingmoonrazemaelstrom: {
        isNonstandard: null,
        num: 725,
        accuracy: true,
        basePower: 200,
        category: "Special",
        name: "Menacing Moonraze Maelstrom",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "lunaliumz",
        ignoreAbility: true,
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    metalburst: {
        flags: {"protect":1,"mirror":1},
        num: 368,
        accuracy: 100,
        basePower: 0,
        damageCallback(pokemon) {
            const lastDamagedBy = pokemon.getLastDamagedBy(true);
            if (lastDamagedBy !== undefined) {
                return (lastDamagedBy.damage * 1.5) || 1;
            }
            return 0;
        },
        category: "Physical",
        name: "Metal Burst",
        pp: 10,
        priority: 0,
        onTry(source) {
            const lastDamagedBy = source.getLastDamagedBy(true);
            if (lastDamagedBy === undefined || !lastDamagedBy.thisTurn)
                return false;
        },
        onModifyTarget(targetRelayVar, source, target, move) {
            const lastDamagedBy = source.getLastDamagedBy(true);
            if (lastDamagedBy) {
                targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
            }
        },
        secondary: null,
        target: "scripted",
        type: "Steel",
        contestType: "Cool"
    },
    metalclaw: {
        num: 232,
        accuracy: 95,
        basePower: 50,
        category: "Physical",
        name: "Metal Claw",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"self":{"boosts":{"atk":1}}},
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    metalsound: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        num: 319,
        accuracy: 85,
        basePower: 0,
        category: "Status",
        name: "Metal Sound",
        pp: 40,
        priority: 0,
        boosts: {"spd":-2},
        secondary: null,
        target: "normal",
        type: "Steel",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    meteorassault: {
        isNonstandard: null,
        num: 794,
        accuracy: 100,
        basePower: 150,
        category: "Physical",
        name: "Meteor Assault",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"recharge":1,"mirror":1,"failinstruct":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Fighting"
    },
    meteorbeam: {
        num: 800,
        accuracy: 90,
        basePower: 120,
        category: "Special",
        name: "Meteor Beam",
        pp: 10,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            this.boost({ spa: 1 }, attacker, attacker, move);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        secondary: null,
        target: "normal",
        type: "Rock"
    },
    meteormash: {
        accuracy: 85,
        basePower: 100,
        num: 309,
        category: "Physical",
        name: "Meteor Mash",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":20,"self":{"boosts":{"atk":1}}},
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    metronome: {
        noMetronome: ["Metronome","Struggle"],
        flags: {"failencore":1},
        noSketch: true,
        num: 118,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Metronome",
        pp: 10,
        priority: 0,
        onHit(target, source, effect) {
            const moves = this.dex.moves.all().filter(move => ((![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
                !move.realMove && !move.isZ && !move.isMax &&
                (!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
                !effect.noMetronome.includes(move.name)));
            let randomMove = '';
            if (moves.length) {
                moves.sort((a, b) => a.num - b.num);
                randomMove = this.sample(moves).id;
            }
            if (!randomMove)
                return false;
            source.side.lastSelectedMove = this.toID(randomMove);
            this.actions.useMove(randomMove, target);
        },
        secondary: null,
        target: "self",
        type: "Normal",
        contestType: "Cute"
    },
    mightycleave: {
		num: 910,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Mighty Cleave",
		pp: 5,
		priority: 0,
		flags: {contact: 1, mirror: 1, slicing: 1},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
    milkdrink: {
        pp: 10,
        num: 208,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Milk Drink",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        heal: [1,2],
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    mimic: {
        onHit(target, source) {
            const moveslot = source.moves.indexOf('mimic');
            if (moveslot < 0)
                return false;
            const moves = target.moves;
            const moveid = this.sample(moves);
            if (!moveid)
                return false;
            const move = this.dex.moves.get(moveid);
            source.moveSlots[moveslot] = {
                move: move.name,
                id: move.id,
                pp: source.moveSlots[moveslot].pp,
                maxpp: move.pp * 8 / 5,
                target: move.target,
                disabled: false,
                used: false,
                virtual: true,
            };
            this.add('-start', source, 'Mimic', move.name);
        },
        accuracy: 100,
        noSketch: true,
        flags: {"protect":1,"bypasssub":1,"allyanim":1,"failencore":1,"noassist":1},
        num: 102,
        basePower: 0,
        category: "Status",
        name: "Mimic",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cute"
    },
    mindblown: {
        isNonstandard: null,
        num: 720,
        accuracy: 100,
        basePower: 150,
        category: "Special",
        name: "Mind Blown",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        mindBlownRecoil: true,
        onAfterMove(pokemon, target, move) {
            if (move.mindBlownRecoil && !move.multihit) {
                const hpBeforeRecoil = pokemon.hp;
                this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Mind Blown'), true);
                if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
                    this.runEvent('EmergencyExit', pokemon, pokemon);
                }
            }
        },
        secondary: null,
        target: "allAdjacent",
        type: "Fire",
        contestType: "Cool"
    },
    mindreader: {
        onTryHit(target) {
            if (target.volatiles['foresight'] || target.volatiles['lockon'])
                return false;
        },
        accuracy: 100,
        isNonstandard: null,
        num: 170,
        basePower: 0,
        category: "Status",
        name: "Mind Reader",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onHit(target, source) {
            source.addVolatile('lockon', target);
            this.add('-activate', source, 'move: Mind Reader', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    minimize: {
        boosts: {"evasion":1},
        pp: 20,
        condition: {
			noCopy: true,
			onSourceModifyDamage(damage, source, target, move) {
                if (['stomp', 'steamroller'].includes(move.id)) {
                    return this.chainModify(2);
                }
            } 
		},
        num: 107,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Minimize",
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "minimize",
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    miracleeye: {
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        isNonstandard: null,
        num: 357,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Miracle Eye",
        pp: 40,
        priority: 0,
        volatileStatus: "miracleeye",
        onTryHit(target) {
            if (target.volatiles['foresight'])
                return false;
        },
        condition: {
			noCopy: true,
			onStart(pokemon) {
                this.add('-start', pokemon, 'Miracle Eye');
            },
			onNegateImmunity(pokemon, type) {
                if (pokemon.hasType('Dark') && type === 'Psychic')
                    return false;
            },
			onModifyBoost(boosts) {
                if (boosts.evasion && boosts.evasion > 0) {
                    boosts.evasion = 0;
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    mirrorcoat: {
        damageCallback(pokemon, target) {
            const lastAttackedBy = pokemon.getLastAttackedBy();
            if (!lastAttackedBy?.move || !lastAttackedBy.thisTurn)
                return false;
            // Hidden Power counts as physical
            if (this.getCategory(lastAttackedBy.move) === 'Special' && target.lastMove?.id !== 'sleeptalk') {
                return 2 * lastAttackedBy.damage;
            }
            return false;
        },
        beforeTurnCallback() { },
        onTry() { },
        condition: {},
        priority: -1,
        flags: {"protect":1,"failmefirst":1,"noassist":1,"failcopycat":1},
        num: 243,
        accuracy: 100,
        basePower: 0,
        category: "Special",
        name: "Mirror Coat",
        pp: 20,
        secondary: null,
        target: "scripted",
        type: "Psychic",
        contestType: "Beautiful"
    },
    mirrormove: {
        onHit(pokemon) {
            const foe = pokemon.side.foe.active[0];
            if (!foe?.lastMove || foe.lastMove.id === 'mirrormove') {
                return false;
            }
            pokemon.side.lastSelectedMove = foe.lastMove.id;
            this.actions.useMove(foe.lastMove.id, pokemon);
        },
        flags: {"failencore":1},
        noSketch: true,
        onTryHit() { },
        target: "self",
        isNonstandard: null,
        num: 119,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Mirror Move",
        pp: 20,
        priority: 0,
        secondary: null,
        type: "Flying",
        zMove: {"boost":{"atk":2}},
        contestType: "Clever"
    },
    mirrorshot: {
        isNonstandard: null,
        num: 429,
        accuracy: 85,
        basePower: 65,
        category: "Special",
        name: "Mirror Shot",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Steel",
        contestType: "Beautiful"
    },
    mist: {
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Mist');
            },
			onTryBoost(boost, target, source, effect) {
                if (effect.effectType === 'Move' && effect.category !== 'Status')
                    return;
                if (source && target !== source) {
                    let showMsg = false;
                    let i;
                    for (i in boost) {
                        if (boost[i] < 0) {
                            delete boost[i];
                            showMsg = true;
                        }
                    }
                    if (showMsg && !effect.secondaries) {
                        this.add('-activate', target, 'move: Mist');
                    }
                }
            } 
		},
        num: 54,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Mist",
        pp: 30,
        priority: 0,
        flags: {},
        volatileStatus: "mist",
        secondary: null,
        target: "self",
        type: "Ice"
    },
    mistball: {
        isNonstandard: null,
        num: 296,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Mist Ball",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"spa":-1}},
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    mistyexplosion: {
        num: 802,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Misty Explosion",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        selfdestruct: "always",
        onBasePower(basePower, source) {
            if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
                this.debug('misty terrain boost');
                return this.chainModify(1.5);
            }
        },
        secondary: null,
        target: "allAdjacent",
        type: "Fairy"
    },
    mistyterrain: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasItem('terrainextender')) {
                    return 8;
                }
                return 5;
            },
			onSetStatus(status, target, source, effect) {
                if (!target.isGrounded() || target.isSemiInvulnerable())
                    return;
                if (effect && (effect.status || effect.id === 'yawn')) {
                    this.add('-activate', target, 'move: Misty Terrain');
                }
                return false;
            },
			onBasePower(basePower, attacker, defender, move) {
                if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
                    this.debug('misty terrain weaken');
                    return this.chainModify(0.5);
                }
            },
			onFieldStart(field, source, effect) {
                if (effect?.effectType === 'Ability') {
                    this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
                }
                else {
                    this.add('-fieldstart', 'move: Misty Terrain');
                }
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
                this.add('-fieldend', 'Misty Terrain');
            } 
		},
        num: 581,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Misty Terrain",
        pp: 10,
        priority: 0,
        flags: {"nonsky":1},
        terrain: "mistyterrain",
        secondary: null,
        target: "all",
        type: "Fairy",
        zMove: {"boost":{"spd":1}},
        contestType: "Beautiful"
    },
    moonblast: {
        num: 585,
        accuracy: 100,
        basePower: 95,
        category: "Special",
        name: "Moonblast",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"boosts":{"spa":-1}},
        target: "normal",
        type: "Fairy",
        contestType: "Beautiful"
    },
    moongeistbeam: {
        isNonstandard: null,
        num: 714,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Moongeist Beam",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        ignoreAbility: true,
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    moonlight: {
        onHit(pokemon) {
            if (this.field.isWeather(['sunnyday', 'desolateland'])) {
                this.heal(pokemon.maxhp);
            }
            else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
                this.heal(pokemon.baseMaxhp / 4);
            }
            else {
                this.heal(pokemon.baseMaxhp / 2);
            }
        },
        type: "Normal",
        num: 236,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Moonlight",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    morningsun: {
        onHit(pokemon) {
            if (this.field.isWeather(['sunnyday', 'desolateland'])) {
                this.heal(pokemon.maxhp);
            }
            else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
                this.heal(pokemon.baseMaxhp / 4);
            }
            else {
                this.heal(pokemon.baseMaxhp / 2);
            }
        },
        num: 234,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Morning Sun",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    mortalspin: {
        num: 866,
        accuracy: 100,
        basePower: 30,
        category: "Physical",
        name: "Mortal Spin",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onAfterHit(target, pokemon, move) {
            if (!move.hasSheerForce) {
                if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
                    this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', '[of] ' + pokemon);
                }
                const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
                for (const condition of sideConditions) {
                    if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
                        this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', '[of] ' + pokemon);
                    }
                }
                if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
                    pokemon.removeVolatile('partiallytrapped');
                }
            }
        },
        onAfterSubDamage(damage, target, pokemon, move) {
            if (!move.hasSheerForce) {
                if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
                    this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', '[of] ' + pokemon);
                }
                const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
                for (const condition of sideConditions) {
                    if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
                        this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', '[of] ' + pokemon);
                    }
                }
                if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
                    pokemon.removeVolatile('partiallytrapped');
                }
            }
        },
        secondary: {"chance":100,"status":"psn"},
        target: "allAdjacentFoes",
        type: "Poison"
    },
    mountaingale: {
        num: 836,
        accuracy: 85,
        basePower: 100,
        category: "Physical",
        name: "Mountain Gale",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Ice"
    },
    mudbomb: {
        isNonstandard: null,
        num: 426,
        accuracy: 85,
        basePower: 65,
        category: "Special",
        name: "Mud Bomb",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Ground",
        contestType: "Cute"
    },
    mudshot: {
        num: 341,
        accuracy: 95,
        basePower: 55,
        category: "Physical",
        name: "Mud Shot",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    mudslap: {
        num: 189,
        accuracy: 100,
        basePower: 20,
        category: "Physical",
        name: "Mud-Slap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Ground",
        contestType: "Cute"
    },
    mudsport: {
        condition: {
			noCopy: true,
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: Mud Sport');
            },
			onBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
                if (move.type === 'Electric')
                    return this.chainModify(0.5);
            } 
		},
        num: 300,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Mud Sport",
        pp: 15,
        priority: 0,
        flags: {},
        volatileStatus: "mudsport",
        onTryHitField(target, source) {
            if (source.volatiles['mudsport'])
                return false;
        },
        secondary: null,
        target: "all",
        type: "Ground"
    },
    muddywater: {
        basePower: 95,
        num: 330,
        accuracy: 85,
        category: "Special",
        name: "Muddy Water",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: {"chance":30,"boosts":{"accuracy":-1}},
        target: "allAdjacentFoes",
        type: "Water",
        contestType: "Tough"
    },
    multiattack: {
        basePower: 90,
        isNonstandard: null,
        num: 718,
        accuracy: 100,
        category: "Physical",
        name: "Multi-Attack",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            if (pokemon.ignoringItem())
                return;
            move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":185},
        maxMove: {"basePower":95},
        contestType: "Tough"
    },
    mysticalfire: {
        basePower: 65,
        num: 595,
        accuracy: 100,
        category: "Special",
        name: "Mystical Fire",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spa":-1}},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    mysticalpower: {
        num: 832,
        accuracy: 90,
        basePower: 70,
        category: "Special",
        name: "Mystical Power",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"self":{"boosts":{"spa":1}}},
        target: "normal",
        type: "Psychic"
    },
    nastyplot: {
        num: 417,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Nasty Plot",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"spa":2},
        secondary: null,
        target: "self",
        type: "Dark",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    naturalgift: {
        isNonstandard: null,
        num: 363,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Natural Gift",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            if (pokemon.ignoringItem())
                return;
            const item = pokemon.getItem();
            if (!item.naturalGift)
                return;
            move.type = item.naturalGift.type;
        },
        onPrepareHit(target, pokemon, move) {
            if (pokemon.ignoringItem())
                return false;
            const item = pokemon.getItem();
            if (!item.naturalGift)
                return false;
            move.basePower = item.naturalGift.basePower;
            this.debug('BP: ' + move.basePower);
            pokemon.setItem('');
            pokemon.lastItem = item.id;
            pokemon.usedItemThisTurn = true;
            this.runEvent('AfterUseItem', pokemon, null, null, item);
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Clever"
    },
    naturepower: {
        accuracy: 95,
        onHit(target) {
            this.actions.useMove('swift', target);
        },
        flags: {},
        onTryHit() { },
        target: "self",
        isNonstandard: null,
        num: 267,
        basePower: 0,
        category: "Status",
        name: "Nature Power",
        pp: 20,
        priority: 0,
        secondary: null,
        type: "Normal",
        contestType: "Beautiful"
    },
    naturesmadness: {
        isNonstandard: null,
        num: 717,
        accuracy: 90,
        basePower: 0,
        damageCallback(pokemon, target) {
            return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
        },
        category: "Special",
        name: "Nature's Madness",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Tough"
    },
    needlearm: {
        basePowerCallback(pokemon, target) {
            if (target.volatiles['minimize'])
                return 120;
            return 60;
        },
        isNonstandard: null,
        num: 302,
        accuracy: 100,
        basePower: 60,
        category: "Special",
        name: "Needle Arm",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Grass",
        contestType: "Clever"
    },
    neverendingnightmare: {
        isNonstandard: null,
        num: 636,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Never-Ending Nightmare",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "ghostiumz",
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    nightdaze: {
        num: 539,
        accuracy: 95,
        basePower: 85,
        category: "Special",
        name: "Night Daze",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":40,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Dark",
        contestType: "Cool"
    },
    nightmare: {
        condition: {
			noCopy: true,
			onStart(pokemon) {
                if (pokemon.status !== 'slp') {
                    return false;
                }
                this.add('-start', pokemon, 'Nightmare');
            },
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
                if (pokemon.status === 'slp')
                    this.damage(pokemon.baseMaxhp / 4);
            } 
		},
        accuracy: true,
        isNonstandard: null,
        num: 171,
        basePower: 0,
        category: "Status",
        name: "Nightmare",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        volatileStatus: "nightmare",
        secondary: null,
        target: "normal",
        type: "Ghost",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    nightshade: {
        ignoreImmunity: true,
        basePower: 1,
        num: 101,
        accuracy: 100,
        damage: "level",
        category: "Physical",
        name: "Night Shade",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    nightslash: {
        num: 400,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Night Slash",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Cool"
    },
    nobleroar: {
        num: 568,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Noble Roar",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1,"bypasssub":1},
        boosts: {"atk":-1,"spa":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    noretreat: {
        num: 748,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "No Retreat",
        pp: 5,
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "noretreat",
        onTry(source, target, move) {
            if (source.volatiles['noretreat'])
                return false;
            if (source.volatiles['trapped']) {
                delete move.volatileStatus;
            }
        },
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: No Retreat');
            },
			onTrapPokemon(pokemon) {
                pokemon.tryTrap();
            } 
		},
        boosts: {"atk":1,"def":1,"spa":1,"spd":1,"spe":1},
        secondary: null,
        target: "self",
        type: "Fighting"
    },
    noxioustorque: {
        num: 898,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        isNonstandard: "Unobtainable",
        name: "Noxious Torque",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"failencore":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: {"chance":30,"status":"psn"},
        target: "normal",
        type: "Poison"
    },
    nuzzle: {
        num: 609,
        accuracy: 100,
        basePower: 20,
        category: "Physical",
        name: "Nuzzle",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cute"
    },
    oblivionwing: {
        isNonstandard: null,
        num: 613,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Oblivion Wing",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"distance":1,"heal":1},
        drain: [3,4],
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    obstruct: {
        isNonstandard: null,
        num: 792,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Obstruct",
        pp: 10,
        priority: 4,
        flags: {"failinstruct":1},
        stallingMove: true,
        volatileStatus: "obstruct",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect'] || move.category === 'Status') {
                    if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id))
                        return;
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                if (move.smartTarget) {
                    move.smartTarget = false;
                }
                else {
                    this.add('-activate', target, 'move: Protect');
                }
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                if (this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct"));
                }
                return this.NOT_FAIL;
            },
			onHit(target, source, move) {
                if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct"));
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Dark"
    },
    oceanicoperetta: {
        isNonstandard: null,
        num: 697,
        accuracy: true,
        basePower: 195,
        category: "Special",
        name: "Oceanic Operetta",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "primariumz",
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    octazooka: {
        isNonstandard: null,
        num: 190,
        accuracy: 85,
        basePower: 65,
        category: "Special",
        name: "Octazooka",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"accuracy":-1}},
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    octolock: {
        isNonstandard: null,
        num: 753,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Octolock",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onTryImmunity(target) {
            return this.dex.getImmunity('trapped', target);
        },
        volatileStatus: "octolock",
        condition: {
			onStart(pokemon, source) {
                this.add('-start', pokemon, 'move: Octolock', '[of] ' + source);
            },
			onResidualOrder: 14,
			onResidual(pokemon) {
                const source = this.effectState.source;
                if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
                    delete pokemon.volatiles['octolock'];
                    this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
                    return;
                }
                this.boost({ def: -1, spd: -1 }, pokemon, source, this.dex.getActiveMove('octolock'));
            },
			onTrapPokemon(pokemon) {
                if (this.effectState.source && this.effectState.source.isActive)
                    pokemon.tryTrap();
            } 
		},
        secondary: null,
        target: "normal",
        type: "Fighting"
    },
    odorsleuth: {
        accuracy: 100,
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        isNonstandard: null,
        num: 316,
        basePower: 0,
        category: "Status",
        name: "Odor Sleuth",
        pp: 40,
        priority: 0,
        volatileStatus: "foresight",
        onTryHit(target) {
            if (target.volatiles['miracleeye'])
                return false;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Clever"
    },
    ominouswind: {
        isNonstandard: null,
        num: 466,
        accuracy: 100,
        basePower: 60,
        category: "Special",
        name: "Ominous Wind",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"self":{"boosts":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}},
        target: "normal",
        type: "Ghost",
        contestType: "Beautiful"
    },
    orderup: {
        num: 856,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Order Up",
        pp: 10,
        priority: 0,
        flags: {"protect":1},
        onAfterMoveSecondarySelf(pokemon, target, move) {
            if (!pokemon.volatiles['commanded'])
                return;
            const tatsugiri = pokemon.volatiles['commanded'].source;
            if (tatsugiri.baseSpecies.baseSpecies !== 'Tatsugiri')
                return; // Should never happen
            switch (tatsugiri.baseSpecies.forme) {
                case 'Droopy':
                    this.boost({ def: 1 }, pokemon, pokemon);
                    break;
                case 'Stretchy':
                    this.boost({ spe: 1 }, pokemon, pokemon);
                    break;
                default:
                    this.boost({ atk: 1 }, pokemon, pokemon);
                    break;
            }
        },
        secondary: null,
        hasSheerForce: true,
        target: "normal",
        type: "Dragon"
    },
    originpulse: {
        num: 618,
        accuracy: 85,
        basePower: 110,
        category: "Special",
        name: "Origin Pulse",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"pulse":1,"mirror":1},
        target: "allAdjacentFoes",
        type: "Water",
        contestType: "Beautiful"
    },
    outrage: {
        onMoveFail(target, source, move) {
            source.addVolatile('lockedmove');
        },
        onAfterMove(pokemon) {
            if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
                pokemon.removeVolatile('lockedmove');
            }
        },
        basePower: 90,
        pp: 15,
        num: 200,
        accuracy: 100,
        category: "Special",
        name: "Outrage",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"failinstruct":1},
        self: {"volatileStatus":"lockedmove"},
        secondary: null,
        target: "randomNormal",
        type: "Dragon",
        contestType: "Cool"
    },
    overdrive: {
        num: 786,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Overdrive",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Electric"
    },
    overheat: {
        flags: {"contact":1,"protect":1,"mirror":1},
        basePower: 140,
        num: 315,
        accuracy: 90,
        category: "Special",
        name: "Overheat",
        pp: 5,
        priority: 0,
        self: {"boosts":{"spa":-2}},
        secondary: null,
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    painsplit: {
        accuracy: 100,
        num: 220,
        basePower: 0,
        category: "Status",
        name: "Pain Split",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1},
        onHit(target, pokemon) {
            const targetHP = target.getUndynamaxedHP();
            const averagehp = Math.floor((targetHP + pokemon.hp) / 2) || 1;
            const targetChange = targetHP - averagehp;
            target.sethp(target.hp - targetChange);
            this.add('-sethp', target, target.getHealth, '[from] move: Pain Split', '[silent]');
            pokemon.sethp(averagehp);
            this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    paleowave: {
        num: 0,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        isNonstandard: "CAP",
        name: "Paleo Wave",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":20,"boosts":{"atk":-1}},
        target: "normal",
        type: "Rock",
        contestType: "Beautiful"
    },
    paraboliccharge: {
        basePower: 50,
        num: 570,
        accuracy: 100,
        category: "Special",
        name: "Parabolic Charge",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"heal":1},
        drain: [1,2],
        secondary: null,
        target: "allAdjacent",
        type: "Electric",
        contestType: "Clever"
    },
    partingshot: {
        onHit(target, source) {
            this.boost({ atk: -1, spa: -1 }, target, source);
        },
        num: 575,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Parting Shot",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1,"bypasssub":1},
        selfSwitch: true,
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"effect":"healreplacement"},
        contestType: "Cool"
    },
    payback: {
        basePowerCallback(pokemon, target) {
            if (this.queue.willMove(target)) {
                return 50;
            }
            this.debug('BP doubled');
            return 100;
        },
        num: 371,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Payback",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Tough"
    },
    payday: {
        onHit() {
            this.add('-fieldactivate', 'move: Pay Day');
        },
        num: 6,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Pay Day",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Clever"
    },
    peck: {
        num: 64,
        accuracy: 100,
        basePower: 35,
        category: "Physical",
        name: "Peck",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    perishsong: {
        condition: {
			duration: 4,
			onEnd(target) {
                this.add('-start', target, 'perish0');
                target.faint();
            },
			onResidualOrder: 4,
			onResidual(pokemon) {
                const duration = pokemon.volatiles['perishsong'].duration;
                this.add('-start', pokemon, 'perish' + duration);
            } 
		},
        flags: {"sound":1,"distance":1},
        num: 195,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Perish Song",
        pp: 5,
        priority: 0,
        onHitField(target, source, move) {
            let result = false;
            let message = false;
            for (const pokemon of this.getAllActive()) {
                if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
                    this.add('-miss', source, pokemon);
                    result = true;
                }
                else if (this.runEvent('TryHit', pokemon, source, move) === null) {
                    result = true;
                }
                else if (!pokemon.volatiles['perishsong']) {
                    pokemon.addVolatile('perishsong');
                    this.add('-start', pokemon, 'perish3', '[silent]');
                    result = true;
                    message = true;
                }
            }
            if (!result)
                return false;
            if (message)
                this.add('-fieldactivate', 'move: Perish Song');
        },
        secondary: null,
        target: "all",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    petalblizzard: {
        num: 572,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Petal Blizzard",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: null,
        target: "allAdjacent",
        type: "Grass",
        contestType: "Beautiful"
    },
    petaldance: {
        onMoveFail() { },
        onAfterMove(pokemon) {
            if (pokemon.volatiles['lockedmove1'] && pokemon.volatiles['lockedmove1'].duration === 1) {
                pokemon.removeVolatile('lockedmove1');
            }
        },
        basePower: 70,
        pp: 20,
        num: 80,
        accuracy: 100,
        category: "Special",
        name: "Petal Dance",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"dance":1,"failinstruct":1},
        self: {"volatileStatus":"lockedmove1"},
        secondary: null,
        target: "randomNormal",
        type: "Grass",
        contestType: "Beautiful"
    },
    phantomforce: {
        num: 566,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Phantom Force",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"charge":1,"mirror":1,"nosleeptalk":1,"noassist":1,"failinstruct":1},
        breaksProtect: true,
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        condition: {
			duration: 2,
			onInvulnerability: false 
		},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    photongeyser: {
        isNonstandard: null,
        num: 722,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Photon Geyser",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyMove(move, pokemon) {
            if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true))
                move.category = 'Physical';
        },
        ignoreAbility: true,
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    pikapapow: {
        num: 732,
        accuracy: true,
        basePower: 0,
        basePowerCallback(pokemon) {
            const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        isNonstandard: "LGPE",
        name: "Pika Papow",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cute"
    },
    pinmissile: {
        accuracy: 85,
        basePower: 14,
        num: 42,
        category: "Physical",
        name: "Pin Missile",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Bug",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    plasmafists: {
        isNonstandard: null,
        num: 721,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Plasma Fists",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        pseudoWeather: "iondeluge",
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    playnice: {
        num: 589,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Play Nice",
        pp: 20,
        priority: 0,
        flags: {"reflectable":1,"mirror":1,"bypasssub":1},
        boosts: {"atk":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    playrough: {
        num: 583,
        accuracy: 90,
        basePower: 90,
        category: "Physical",
        name: "Play Rough",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"boosts":{"atk":-1}},
        target: "normal",
        type: "Fairy",
        contestType: "Cute"
    },
    pluck: {
        num: 365,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Pluck",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        onHit(target, source) {
            const item = target.getItem();
            if (source.hp && item.isBerry && target.takeItem(source)) {
                this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] ' + source);
                if (this.singleEvent('Eat', item, null, source, null, null)) {
                    this.runEvent('EatItem', source, null, null, item);
                    if (item.id === 'leppaberry')
                        target.staleness = 'external';
                }
                if (item.onEat)
                    source.ateBerry = true;
            }
        },
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cute"
    },
    poisonfang: {
        secondary: {"chance":30,"status":"tox"},
        num: 305,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Poison Fang",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Poison",
        contestType: "Clever"
    },
    poisongas: {
        ignoreImmunity: false,
        accuracy: 55,
        target: "normal",
        num: 139,
        basePower: 0,
        category: "Status",
        name: "Poison Gas",
        pp: 40,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "psn",
        secondary: null,
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    poisonjab: {
        num: 398,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Poison Jab",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"psn"},
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    poisonpowder: {
        ignoreImmunity: false,
        onTryHit() { },
        num: 77,
        accuracy: 75,
        basePower: 0,
        category: "Status",
        name: "Poison Powder",
        pp: 35,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1},
        status: "psn",
        secondary: null,
        target: "normal",
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    poisonsting: {
        secondary: {"chance":20,"status":"psn"},
        num: 40,
        accuracy: 100,
        basePower: 15,
        category: "Physical",
        name: "Poison Sting",
        pp: 35,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Poison",
        contestType: "Clever"
    },
    poisontail: {
        num: 342,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Poison Tail",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        critRatio: 2,
        secondary: {"chance":10,"status":"psn"},
        target: "normal",
        type: "Poison",
        contestType: "Clever"
    },
    pollenpuff: {
        flags: {"bullet":1,"protect":1,"mirror":1},
        onHit(target, source) {
            if (source.isAlly(target)) {
                if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
                    this.add('-immune', target);
                    return null;
                }
            }
        },
        num: 676,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Pollen Puff",
        pp: 15,
        priority: 0,
        onTryHit(target, source, move) {
            if (source.isAlly(target)) {
                move.basePower = 0;
                move.infiltrates = true;
            }
        },
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    poltergeist: {
        num: 809,
        accuracy: 90,
        basePower: 110,
        category: "Physical",
        name: "Poltergeist",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onTry(source, target) {
            return !!target.item;
        },
        onTryHit(target, source, move) {
            this.add('-activate', target, 'move: Poltergeist', this.dex.items.get(target.item).name);
        },
        secondary: null,
        target: "normal",
        type: "Ghost"
    },
    populationbomb: {
        num: 860,
        accuracy: 90,
        basePower: 20,
        category: "Physical",
        name: "Population Bomb",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        multihit: 10,
        multiaccuracy: true,
        secondary: null,
        target: "normal",
        type: "Normal"
    },
    pounce: {
        num: 884,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Pounce",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    pound: {
        num: 1,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Pound",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    powder: {
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Powder');
            },
			onTryMovePriority: 1,
			onTryMove(pokemon, target, move) {
                if (move.type === 'Fire') {
                    this.add('-activate', pokemon, 'move: Powder');
                    this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
                    this.attrLastMove('[still]');
                    return false;
                }
            } 
		},
        isNonstandard: null,
        num: 600,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Powder",
        pp: 20,
        priority: 1,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1,"bypasssub":1},
        volatileStatus: "powder",
        secondary: null,
        target: "normal",
        type: "Bug",
        zMove: {"boost":{"spd":2}},
        contestType: "Clever"
    },
    powdersnow: {
        num: 181,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Powder Snow",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"frz"},
        target: "allAdjacentFoes",
        type: "Ice",
        contestType: "Beautiful"
    },
    powergem: {
        basePower: 70,
        num: 408,
        accuracy: 100,
        category: "Special",
        name: "Power Gem",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Beautiful"
    },
    powershift: {
        num: 829,
        accuracy: true,
        basePower: 0,
        category: "Status",
        isNonstandard: "Unobtainable",
        name: "Power Shift",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        volatileStatus: "powershift",
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Power Shift');
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onCopy(pokemon) {
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Power Shift');
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onRestart(pokemon) {
                pokemon.removeVolatile('Power Shift');
            } 
		},
        secondary: null,
        target: "self",
        type: "Normal"
    },
    powersplit: {
        num: 471,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Power Split",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"allyanim":1},
        onHit(target, source) {
            const newatk = Math.floor((target.storedStats.atk + source.storedStats.atk) / 2);
            target.storedStats.atk = newatk;
            source.storedStats.atk = newatk;
            const newspa = Math.floor((target.storedStats.spa + source.storedStats.spa) / 2);
            target.storedStats.spa = newspa;
            source.storedStats.spa = newspa;
            this.add('-activate', source, 'move: Power Split', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    powerswap: {
        num: 384,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Power Swap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            const targetBoosts = {};
            const sourceBoosts = {};
            const atkSpa = ['atk', 'spa'];
            for (const stat of atkSpa) {
                targetBoosts[stat] = target.boosts[stat];
                sourceBoosts[stat] = source.boosts[stat];
            }
            source.setBoost(targetBoosts);
            target.setBoost(sourceBoosts);
            this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    powertrick: {
        flags: {},
        num: 379,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Power Trick",
        pp: 10,
        priority: 0,
        volatileStatus: "powertrick",
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Power Trick');
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onCopy(pokemon) {
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Power Trick');
                const newatk = pokemon.storedStats.def;
                const newdef = pokemon.storedStats.atk;
                pokemon.storedStats.atk = newatk;
                pokemon.storedStats.def = newdef;
            },
			onRestart(pokemon) {
                pokemon.removeVolatile('Power Trick');
            } 
		},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"boost":{"atk":1}},
        contestType: "Clever"
    },
    powertrip: {
        num: 681,
        accuracy: 100,
        basePower: 20,
        basePowerCallback(pokemon, target, move) {
            const bp = move.basePower + 20 * pokemon.positiveBoosts();
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Physical",
        name: "Power Trip",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Clever"
    },
    poweruppunch: {
        isNonstandard: null,
        num: 612,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Power-Up Punch",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":100,"self":{"boosts":{"atk":1}}},
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    powerwhip: {
        num: 438,
        accuracy: 85,
        basePower: 120,
        category: "Physical",
        name: "Power Whip",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Tough"
    },
    precipiceblades: {
        isNonstandard: null,
        num: 619,
        accuracy: 85,
        basePower: 120,
        category: "Physical",
        name: "Precipice Blades",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        target: "allAdjacentFoes",
        type: "Ground",
        contestType: "Cool"
    },
    present: {
        num: 217,
        accuracy: 90,
        basePower: 0,
        category: "Physical",
        name: "Present",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyMove(move, pokemon, target) {
            const rand = this.random(10);
            if (rand < 2) {
                move.heal = [1, 4];
                move.infiltrates = true;
            }
            else if (rand < 6) {
                move.basePower = 40;
            }
            else if (rand < 9) {
                move.basePower = 80;
            }
            else {
                move.basePower = 120;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    prismaticlaser: {
        isNonstandard: null,
        num: 711,
        accuracy: 100,
        basePower: 160,
        category: "Special",
        name: "Prismatic Laser",
        pp: 10,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    protect: {
        priority: 2,
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect'])
                    return;
                this.add('-activate', target, 'Protect');
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is NOT reset
                    if (source.volatiles['lockedmove'].trueDuration >= 2) {
                        source.volatiles['lockedmove'].duration = 2;
                    }
                }
                return null;
            } 
		},
        num: 182,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Protect",
        pp: 10,
        flags: {"noassist":1,"failcopycat":1},
        stallingMove: true,
        volatileStatus: "protect",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    psybeam: {
        num: 60,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Psybeam",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"confusion"},
        target: "normal",
        type: "Psychic",
        contestType: "Beautiful"
    },
    psyblade: {
        num: 875,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Psyblade",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        onBasePower(basePower, source) {
            if (this.field.isTerrain('electricterrain')) {
                this.debug('psyblade electric terrain boost');
                return this.chainModify(1.5);
            }
        },
        target: "normal",
        type: "Psychic"
    },
    psychup: {
        flags: {"snatch":1,"bypasssub":1},
        onHit(target, source) {
            let i;
            for (i in target.boosts) {
                source.boosts[i] = target.boosts[i];
            }
            this.add('-copyboost', source, target, '[from] move: Psych Up');
        },
        num: 244,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Psych Up",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Clever"
    },
    psychic: {
        secondary: {"chance":33,"boosts":{"spa":-1,"spd":-1}},
        num: 94,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Psychic",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    psychicfangs: {
        num: 706,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        name: "Psychic Fangs",
        pp: 10,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        onTryHit(pokemon) {
            // will shatter screens through sub, before you hit
            pokemon.side.removeSideCondition('reflect');
            pokemon.side.removeSideCondition('lightscreen');
            pokemon.side.removeSideCondition('auroraveil');
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    psychicnoise: {
		num: 917,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Psychic Noise",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'healblock',
		},
		target: "normal",
		type: "Psychic",
	},
    psychicterrain: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasItem('terrainextender')) {
                    return 8;
                }
                return 5;
            },
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
                if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
                    return;
                }
                if (target.isSemiInvulnerable() || target.isAlly(source))
                    return;
                if (!target.isGrounded()) {
                    const baseMove = this.dex.moves.get(effect.id);
                    if (baseMove.priority > 0) {
                        this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
                    }
                    return;
                }
                this.add('-activate', target, 'move: Psychic Terrain');
                return null;
            },
			onBasePower(basePower, attacker, defender, move) {
                if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
                    this.debug('psychic terrain boost');
                    return this.chainModify(1.5);
                }
            },
			onFieldStart(field, source, effect) {
                if (effect && effect.effectType === 'Ability') {
                    this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
                }
                else {
                    this.add('-fieldstart', 'move: Psychic Terrain');
                }
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
                this.add('-fieldend', 'move: Psychic Terrain');
            } 
		},
        num: 678,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Psychic Terrain",
        pp: 10,
        priority: 0,
        flags: {"nonsky":1},
        terrain: "psychicterrain",
        secondary: null,
        target: "all",
        type: "Psychic",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    psychoboost: {
        isNonstandard: null,
        num: 354,
        accuracy: 90,
        basePower: 140,
        category: "Special",
        name: "Psycho Boost",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"boosts":{"spa":-2}},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    psychocut: {
        num: 427,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Psycho Cut",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"slicing":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    psychoshift: {
        accuracy: 90,
        isNonstandard: null,
        num: 375,
        basePower: 0,
        category: "Status",
        name: "Psycho Shift",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onTryHit(target, source, move) {
            if (!source.status)
                return false;
            move.status = source.status;
        },
        self: {},
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spa":2}},
        contestType: "Clever"
    },
    psyshieldbash: {
        num: 828,
        accuracy: 90,
        basePower: 70,
        category: "Physical",
        name: "Psyshield Bash",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"self":{"boosts":{"def":1}}},
        target: "normal",
        type: "Psychic"
    },
    psyshock: {
        num: 473,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        overrideDefensiveStat: "def",
        name: "Psyshock",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Beautiful"
    },
    psystrike: {
        num: 540,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        overrideDefensiveStat: "def",
        name: "Psystrike",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    psywave: {
        basePower: 1,
        damageCallback(pokemon) {
            const psywaveDamage = (this.random(0, this.trunc(1.5 * pokemon.level)));
            if (psywaveDamage <= 0) {
                this.hint("Desync Clause Mod activated!");
                return false;
            }
            return psywaveDamage;
        },
        accuracy: 80,
        isNonstandard: null,
        num: 149,
        category: "Special",
        name: "Psywave",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    pulverizingpancake: {
        isNonstandard: null,
        num: 701,
        accuracy: true,
        basePower: 210,
        category: "Physical",
        name: "Pulverizing Pancake",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "snorliumz",
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    punishment: {
        isNonstandard: null,
        num: 386,
        accuracy: 100,
        basePower: 0,
        basePowerCallback(pokemon, target) {
            let power = 60 + 20 * target.positiveBoosts();
            if (power > 200)
                power = 200;
            this.debug('BP: ' + power);
            return power;
        },
        category: "Physical",
        name: "Punishment",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    purify: {
        onHit(target, source) {
            if (!target.cureStatus())
                return false;
            this.heal(Math.ceil(source.maxhp * 0.5), source);
        },
        isNonstandard: null,
        num: 685,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Purify",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"heal":1},
        secondary: null,
        target: "normal",
        type: "Poison",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Beautiful"
    },
    pursuit: {
        onModifyMove() { },
        condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
                this.debug('Pursuit start');
                let alreadyAdded = false;
                for (const source of this.effectState.sources) {
                    if (source.speed < pokemon.speed || (source.speed === pokemon.speed && this.random(2) === 0)) {
                        // Destiny Bond ends if the switch action "outspeeds" the attacker, regardless of host
                        pokemon.removeVolatile('destinybond');
                    }
                    if (!this.queue.cancelMove(source) || !source.hp)
                        continue;
                    if (!alreadyAdded) {
                        this.add('-activate', pokemon, 'move: Pursuit');
                        alreadyAdded = true;
                    }
                    // Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
                    // If it is, then Mega Evolve before moving.
                    if (source.canMegaEvo || source.canUltraBurst) {
                        for (const [actionIndex, action] of this.queue.entries()) {
                            if (action.pokemon === source && action.choice === 'megaEvo') {
                                this.actions.runMegaEvo(source);
                                this.queue.list.splice(actionIndex, 1);
                                break;
                            }
                        }
                    }
                    this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
                }
            } 
		},
        isNonstandard: null,
        num: 228,
        accuracy: 100,
        basePower: 40,
        basePowerCallback(pokemon, target, move) {
            // You can't get here unless the pursuit succeeds
            if (target.beingCalledBack || target.switchFlag) {
                this.debug('Pursuit damage boost');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Special",
        name: "Pursuit",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        beforeTurnCallback(pokemon) {
            for (const side of this.sides) {
                if (side.hasAlly(pokemon))
                    continue;
                side.addSideCondition('pursuit', pokemon);
                const data = side.getSideConditionData('pursuit');
                if (!data.sources) {
                    data.sources = [];
                }
                data.sources.push(pokemon);
            }
        },
        onTryHit(target, pokemon) {
            target.side.removeSideCondition('pursuit');
        },
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    pyroball: {
        num: 780,
        accuracy: 90,
        basePower: 120,
        category: "Physical",
        name: "Pyro Ball",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1,"bullet":1},
        secondary: {"chance":10,"status":"brn"},
        target: "normal",
        type: "Fire"
    },
    quash: {
        onHit(target) {
            if (this.activePerHalf === 1)
                return false; // fails in singles
            const action = this.queue.willMove(target);
            if (!action)
                return false;
            action.priority = -7.1;
            this.queue.cancelMove(target);
            for (let i = this.queue.list.length - 1; i >= 0; i--) {
                if (this.queue.list[i].choice === 'residual') {
                    this.queue.list.splice(i, 0, action);
                    break;
                }
            }
            this.add('-activate', target, 'move: Quash');
        },
        num: 511,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Quash",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    quickattack: {
        num: 98,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Quick Attack",
        pp: 30,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    quickguard: {
        stallingMove: true,
        onTry(source) {
            return this.queue.willAct() && this.runEvent('StallMove', source);
        },
        onHitSide(side, source) {
            source.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onSideStart(target, source) {
                this.add('-singleturn', source, 'Quick Guard');
            },
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
                // Quick Guard only blocks moves with a natural positive priority
                // (e.g. it doesn't block 0 priority moves boosted by Prankster)
                if (effect && (effect.id === 'feint' || this.dex.moves.get(effect.id).priority <= 0)) {
                    return;
                }
                this.add('-activate', target, 'Quick Guard');
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                return null;
            } 
		},
        num: 501,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Quick Guard",
        pp: 15,
        priority: 3,
        flags: {"snatch":1},
        sideCondition: "quickguard",
        secondary: null,
        target: "allySide",
        type: "Fighting",
        zMove: {"boost":{"def":1}},
        contestType: "Cool"
    },
    quiverdance: {
        num: 483,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Quiver Dance",
        pp: 20,
        priority: 0,
        flags: {"snatch":1,"dance":1},
        boosts: {"spa":1,"spd":1,"spe":1},
        secondary: null,
        target: "self",
        type: "Bug",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    rage: {
        self: {"volatileStatus":"rage"},
        condition: {
			onStart(target, source, effect) {
                this.effectState.move = 'rage';
                this.effectState.accuracy = 255;
            },
			onLockMove: "rage",
			onHit(target, source, move) {
                // Disable and exploding moves boost Rage even if they miss/fail, so they are dealt with separately.
                if (target.boosts.atk < 6 && (move.category !== 'Status' && !move.selfdestruct)) {
                    this.boost({ atk: 1 });
                }
            } 
		},
        isNonstandard: null,
        num: 99,
        accuracy: 100,
        basePower: 20,
        category: "Physical",
        name: "Rage",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    ragefist: {
        num: 889,
        accuracy: 100,
        basePower: 50,
        basePowerCallback(pokemon) {
            return Math.min(350, 50 + 50 * pokemon.timesAttacked);
        },
        category: "Physical",
        name: "Rage Fist",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Ghost"
    },
    ragepowder: {
        priority: 3,
        flags: {"noassist":1,"failcopycat":1},
        num: 476,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Rage Powder",
        pp: 20,
        volatileStatus: "ragepowder",
        onTry(source) {
            return this.activePerHalf > 1;
        },
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'move: Rage Powder');
            },
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
                const ragePowderUser = this.effectState.target;
                if (ragePowderUser.isSkyDropped())
                    return;
                if (source.runStatusImmunity('powder') && this.validTarget(ragePowderUser, source, move.target)) {
                    if (move.smartTarget)
                        move.smartTarget = false;
                    this.debug("Rage Powder redirected target of move");
                    return ragePowderUser;
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Bug",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    ragingbull: {
        num: 873,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Raging Bull",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onTryHit(pokemon) {
            // will shatter screens through sub, before you hit
            pokemon.side.removeSideCondition('reflect');
            pokemon.side.removeSideCondition('lightscreen');
            pokemon.side.removeSideCondition('auroraveil');
        },
        onModifyType(move, pokemon) {
            switch (pokemon.species.name) {
                case 'Tauros-Paldea-Combat':
                    move.type = 'Fighting';
                    break;
                case 'Tauros-Paldea-Blaze':
                    move.type = 'Fire';
                    break;
                case 'Tauros-Paldea-Aqua':
                    move.type = 'Water';
                    break;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal"
    },
    ragingfury: {
        num: 833,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Raging Fury",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {"volatileStatus":"lockedmove"},
        onAfterMove(pokemon) {
            if (pokemon.volatiles['lockedmove']?.duration === 1) {
                pokemon.removeVolatile('lockedmove');
            }
        },
        secondary: null,
        target: "randomNormal",
        type: "Fire"
    },
    raindance: {
        num: 240,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Rain Dance",
        pp: 5,
        priority: 0,
        flags: {},
        weather: "RainDance",
        secondary: null,
        target: "all",
        type: "Water",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    rapidspin: {
        self: {},
        basePower: 20,
        secondary: null,
        num: 229,
        accuracy: 100,
        category: "Physical",
        name: "Rapid Spin",
        pp: 40,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onAfterHit(target, pokemon, move) {
            if (!move.hasSheerForce) {
                if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
                    this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
                }
                const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
                for (const condition of sideConditions) {
                    if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
                        this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
                    }
                }
                if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
                    pokemon.removeVolatile('partiallytrapped');
                }
            }
        },
        onAfterSubDamage(damage, target, pokemon, move) {
            if (!move.hasSheerForce) {
                if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
                    this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
                }
                const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
                for (const condition of sideConditions) {
                    if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
                        this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
                    }
                }
                if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
                    pokemon.removeVolatile('partiallytrapped');
                }
            }
        },
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    razorleaf: {
        critRatio: 2,
        target: "normal",
        num: 75,
        accuracy: 95,
        basePower: 55,
        category: "Special",
        name: "Razor Leaf",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        type: "Grass",
        contestType: "Cool"
    },
    razorshell: {
        num: 534,
        accuracy: 95,
        basePower: 75,
        category: "Physical",
        name: "Razor Shell",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: {"chance":50,"boosts":{"def":-1}},
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    razorwind: {
        critRatio: 1,
        target: "normal",
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        accuracy: 75,
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        isNonstandard: null,
        num: 13,
        basePower: 80,
        category: "Physical",
        name: "Razor Wind",
        pp: 10,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1,"nosleeptalk":1,"failinstruct":1},
        secondary: null,
        type: "Normal",
        contestType: "Cool"
    },
    recover: {
        heal: null,
        onHit(target) {
            if (target.hp === target.maxhp)
                return false;
            // Fail when health is 255 or 511 less than max, unless it is divisible by 256
            if (target.hp === target.maxhp ||
                ((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)) {
                this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
                    "unless the current hp is also divisible by 256.");
                return false;
            }
            this.heal(Math.floor(target.maxhp / 2), target, target);
        },
        pp: 20,
        num: 105,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Recover",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    recycle: {
        flags: {},
        num: 278,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Recycle",
        pp: 10,
        priority: 0,
        onHit(pokemon) {
            if (pokemon.item || !pokemon.lastItem)
                return false;
            const item = pokemon.lastItem;
            pokemon.lastItem = '';
            this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Recycle');
            pokemon.setItem(item);
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    reflect: {
        num: 115,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Reflect",
        pp: 20,
        priority: 0,
        flags: {},
        volatileStatus: "reflect",
        onTryHit(pokemon) {
            if (pokemon.volatiles['reflect']) {
                return false;
            }
        },
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Reflect');
            } 
		},
        secondary: null,
        target: "self",
        type: "Psychic"
    },
    reflecttype: {
        num: 513,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Reflect Type",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            if (source.species && (source.species.num === 493 || source.species.num === 773))
                return false;
            if (source.terastallized)
                return false;
            const oldApparentType = source.apparentType;
            let newBaseTypes = target.getTypes(true).filter(type => type !== '???');
            if (!newBaseTypes.length) {
                if (target.addedType) {
                    newBaseTypes = ['Normal'];
                }
                else {
                    return false;
                }
            }
            this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);
            source.setType(newBaseTypes);
            source.addedType = target.addedType;
            source.knownType = target.isAlly(source) && target.knownType;
            if (!source.knownType)
                source.apparentType = oldApparentType;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    refresh: {
        isNonstandard: null,
        num: 287,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Refresh",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        onHit(pokemon) {
            if (['', 'slp', 'frz'].includes(pokemon.status))
                return false;
            pokemon.cureStatus();
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Cute"
    },
    relicsong: {
        flags: {"protect":1,"mirror":1,"sound":1},
        isNonstandard: null,
        num: 547,
        accuracy: 100,
        basePower: 75,
        category: "Special",
        name: "Relic Song",
        pp: 10,
        priority: 0,
        secondary: {"chance":10,"status":"slp"},
        onHit(target, pokemon, move) {
            if (pokemon.baseSpecies.baseSpecies === 'Meloetta' && !pokemon.transformed) {
                move.willChangeForme = true;
            }
        },
        onAfterMoveSecondarySelf(pokemon, target, move) {
            if (move.willChangeForme) {
                const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
                pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '[msg]');
            }
        },
        target: "allAdjacentFoes",
        type: "Normal",
        contestType: "Beautiful"
    },
    rest: {
        onTry() { },
        onHit(target, source, move) {
            if (target.hp === target.maxhp)
                return false;
            // Fail when health is 255 or 511 less than max, unless it is divisible by 256
            if (target.hp === target.maxhp ||
                ((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)) {
                this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
                    "unless the current hp is also divisible by 256.");
                return false;
            }
            if (!target.setStatus('slp', source, move))
                return false;
            target.statusState.time = 2;
            target.statusState.startTime = 2;
            this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
        },
        secondary: null,
        pp: 10,
        num: 156,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Rest",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        target: "self",
        type: "Psychic",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    retaliate: {
        num: 514,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Retaliate",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onBasePower(basePower, pokemon) {
            if (pokemon.side.faintedLastTurn) {
                this.debug('Boosted for a faint last turn');
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    return: {
        basePowerCallback(pokemon) {
            return Math.floor((pokemon.happiness * 10) / 25) || null;
        },
        isNonstandard: null,
        num: 216,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Return",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cute"
    },
    revelationdance: {
        isNonstandard: null,
        num: 686,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Revelation Dance",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"dance":1},
        onModifyType(move, pokemon) {
            let type = pokemon.getTypes()[0];
            if (type === "Bird")
                type = "???";
            move.type = type;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Beautiful"
    },
    revenge: {
        isNonstandard: null,
        num: 279,
        accuracy: 100,
        basePower: 60,
        basePowerCallback(pokemon, target, move) {
            const damagedByTarget = pokemon.attackedBy.some(p => p.source === target && p.damage > 0 && p.thisTurn);
            if (damagedByTarget) {
                this.debug('BP doubled for getting hit by ' + target);
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Revenge",
        pp: 10,
        priority: -4,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    reversal: {
        noDamageVariance: true,
        willCrit: false,
        basePowerCallback(pokemon, target) {
            const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
            let bp;
            if (ratio < 2) {
                bp = 200;
            }
            else if (ratio < 6) {
                bp = 150;
            }
            else if (ratio < 13) {
                bp = 100;
            }
            else if (ratio < 22) {
                bp = 80;
            }
            else if (ratio < 43) {
                bp = 40;
            }
            else {
                bp = 20;
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        num: 179,
        accuracy: 100,
        basePower: 0,
        category: "Physical",
        name: "Reversal",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        zMove: {"basePower":160},
        contestType: "Cool"
    },
    revivalblessing: {
        num: 863,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Revival Blessing",
        pp: 1,
        noPPBoosts: true,
        priority: 0,
        flags: {},
        onTryHit(source) {
            if (!source.side.pokemon.filter(ally => ally.fainted).length) {
                return false;
            }
        },
        slotCondition: "revivalblessing",
        selfSwitch: true,
        condition: {
			duration: 1 
		},
        secondary: null,
        target: "self",
        type: "Normal"
    },
    risingvoltage: {
        num: 804,
        accuracy: 100,
        basePower: 70,
        basePowerCallback(source, target, move) {
            if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
                if (!source.isAlly(target))
                    this.hint(`${move.name}'s BP doubled on grounded target.`);
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Special",
        name: "Rising Voltage",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric",
        maxMove: {"basePower":140}
    },
    roar: {
        forceSwitch: false,
        onTryHit() { },
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        accuracy: 100,
        num: 46,
        basePower: 0,
        category: "Status",
        name: "Roar",
        pp: 20,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cool"
    },
    roaroftime: {
        num: 459,
        accuracy: 90,
        basePower: 150,
        category: "Special",
        name: "Roar of Time",
        pp: 5,
        priority: 0,
        flags: {"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Beautiful"
    },
    rockblast: {
        accuracy: 80,
        flags: {"protect":1,"mirror":1},
        num: 350,
        basePower: 25,
        category: "Physical",
        name: "Rock Blast",
        pp: 10,
        priority: 0,
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Rock",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Tough"
    },
    rockclimb: {
        isNonstandard: null,
        num: 431,
        accuracy: 85,
        basePower: 90,
        category: "Physical",
        name: "Rock Climb",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"volatileStatus":"confusion"},
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    rockpolish: {
        num: 397,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Rock Polish",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"spe":2},
        secondary: null,
        target: "self",
        type: "Rock",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    rockslide: {
        secondary: null,
        target: "normal",
        num: 157,
        accuracy: 90,
        basePower: 75,
        category: "Physical",
        name: "Rock Slide",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        type: "Rock",
        contestType: "Tough"
    },
    rocksmash: {
        basePower: 20,
        num: 249,
        accuracy: 100,
        category: "Physical",
        name: "Rock Smash",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"def":-1}},
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    rockthrow: {
        accuracy: 65,
        num: 88,
        basePower: 50,
        category: "Physical",
        name: "Rock Throw",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    rocktomb: {
        accuracy: 80,
        basePower: 50,
        pp: 10,
        num: 317,
        category: "Physical",
        name: "Rock Tomb",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spe":-1}},
        target: "normal",
        type: "Rock",
        contestType: "Clever"
    },
    rockwrecker: {
        isNonstandard: null,
        num: 439,
        accuracy: 90,
        basePower: 150,
        category: "Physical",
        name: "Rock Wrecker",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"recharge":1,"protect":1,"mirror":1},
        self: {"volatileStatus":"mustrecharge"},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    roleplay: {
        onTryHit(target, source) {
            if (target.ability === source.ability || source.hasItem('griseousorb'))
                return false;
            const bannedTargetAbilities = ['multitype', 'wonderguard'];
            if (bannedTargetAbilities.includes(target.ability) || source.ability === 'multitype') {
                return false;
            }
        },
        num: 272,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Role Play",
        pp: 10,
        priority: 0,
        flags: {"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            const oldAbility = source.setAbility(target.ability);
            if (oldAbility) {
                this.add('-ability', source, source.getAbility().name, '[from] move: Role Play', '[of] ' + target);
                return;
            }
            return oldAbility;
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Cute"
    },
    rollingkick: {
        isNonstandard: null,
        num: 27,
        accuracy: 85,
        basePower: 60,
        category: "Physical",
        name: "Rolling Kick",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    rollout: {
        num: 205,
        accuracy: 90,
        basePower: 30,
        basePowerCallback(pokemon, target, move) {
            let bp = move.basePower;
            const rolloutData = pokemon.volatiles['rollout'];
            if (rolloutData?.hitCount) {
                bp *= Math.pow(2, rolloutData.contactHitCount);
            }
            if (rolloutData && pokemon.status !== 'slp') {
                rolloutData.hitCount++;
                rolloutData.contactHitCount++;
                if (rolloutData.hitCount < 5) {
                    rolloutData.duration = 2;
                }
            }
            if (pokemon.volatiles['defensecurl']) {
                bp *= 2;
            }
            this.debug("BP: " + bp);
            return bp;
        },
        category: "Physical",
        name: "Rollout",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"noparentalbond":1,"failinstruct":1},
        onModifyMove(move, pokemon, target) {
            if (pokemon.volatiles['rollout'] || pokemon.status === 'slp' || !target)
                return;
            pokemon.addVolatile('rollout');
            // @ts-ignore
            // TS thinks pokemon.volatiles['rollout'] doesn't exist because of the condition on the return above
            // but it does exist now because addVolatile created it
            pokemon.volatiles['rollout'].targetSlot = move.sourceEffect ? pokemon.lastMoveTargetLoc : pokemon.getLocOf(target);
        },
        onAfterMove(source, target, move) {
            const rolloutData = source.volatiles["rollout"];
            if (rolloutData &&
                rolloutData.hitCount === 5 &&
                rolloutData.contactHitCount < 5
            // this conditions can only be met in gen7 and gen8dlc1
            // see `disguise` and `iceface` abilities in the resp mod folders
            ) {
                source.addVolatile("rolloutstorage");
                source.volatiles["rolloutstorage"].contactHitCount =
                    rolloutData.contactHitCount;
            }
        },
        condition: {
			duration: 1,
			onLockMove: "rollout",
			onStart() {
                this.effectState.hitCount = 0;
                this.effectState.contactHitCount = 0;
            },
			onResidual(target) {
                if (target.lastMove && target.lastMove.id === 'struggle') {
                    // don't lock
                    delete target.volatiles['rollout'];
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Cute"
    },
    roost: {
        pp: 10,
        num: 355,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Roost",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        heal: [1,2],
        self: {"volatileStatus":"roost"},
        condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
                if (!target.terastallized) {
                    this.add('-singleturn', target, 'move: Roost');
                }
                else if (target.terastallized === "Flying") {
                    this.add('-hint', "If a Flying Terastallized Pokemon uses Roost, it remains Flying-type.");
                }
            },
			onTypePriority: -1,
			onType(types, pokemon) {
                this.effectState.typeWas = types;
                return types.filter(type => type !== 'Flying');
            } 
		},
        secondary: null,
        target: "self",
        type: "Flying",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    rototiller: {
        isNonstandard: null,
        num: 563,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Rototiller",
        pp: 10,
        priority: 0,
        flags: {"distance":1,"nonsky":1},
        onHitField(target, source) {
            const targets = [];
            let anyAirborne = false;
            for (const pokemon of this.getAllActive()) {
                if (!pokemon.runImmunity('Ground')) {
                    this.add('-immune', pokemon);
                    anyAirborne = true;
                    continue;
                }
                if (pokemon.hasType('Grass')) {
                    // This move affects every grounded Grass-type Pokemon in play.
                    targets.push(pokemon);
                }
            }
            if (!targets.length && !anyAirborne)
                return false; // Fails when there are no grounded Grass types or airborne Pokemon
            for (const pokemon of targets) {
                this.boost({ atk: 1, spa: 1 }, pokemon, source);
            }
        },
        secondary: null,
        target: "all",
        type: "Ground",
        zMove: {"boost":{"atk":1}},
        contestType: "Tough"
    },
    round: {
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 496,
        accuracy: 100,
        basePower: 60,
        basePowerCallback(target, source, move) {
            if (move.sourceEffect === 'round') {
                this.debug('BP doubled');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Special",
        name: "Round",
        pp: 15,
        priority: 0,
        onTry(source, target, move) {
            for (const action of this.queue.list) {
                if (!action.pokemon || !action.move || action.maxMove || action.zmove)
                    continue;
                if (action.move.id === 'round') {
                    this.queue.prioritizeAction(action, move);
                    return;
                }
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Beautiful"
    },
    ruination: {
        num: 877,
        accuracy: 90,
        basePower: 0,
        damageCallback(pokemon, target) {
            return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
        },
        category: "Special",
        name: "Ruination",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Tough"
    },
    sacredfire: {
        isNonstandard: null,
        num: 221,
        accuracy: 95,
        basePower: 100,
        category: "Special",
        name: "Sacred Fire",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        secondary: {"chance":50,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    sacredsword: {
        pp: 20,
        num: 533,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Sacred Sword",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        ignoreEvasion: true,
        ignoreDefensive: true,
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    safeguard: {
        condition: {
			duration: 5,
			durationCallback(target, source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', effect);
                    return 7;
                }
                return 5;
            },
			onSetStatus(status, target, source, effect) {
                if (!effect || !source)
                    return;
                if (effect.id === 'yawn')
                    return;
                if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source))
                    return;
                if (target !== source) {
                    this.debug('interrupting setStatus');
                    if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
                        this.add('-activate', target, 'move: Safeguard');
                    }
                    return null;
                }
            },
			onTryAddVolatile(status, target, source, effect) {
                if (!effect || !source)
                    return;
                if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source))
                    return;
                if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
                    if (effect.effectType === 'Move' && !effect.secondaries)
                        this.add('-activate', target, 'move: Safeguard');
                    return null;
                }
            },
			onSideStart(side) {
                this.add('-sidestart', side, 'Safeguard');
            },
			onSideResidualOrder: 8,
			onSideEnd(side) {
                this.add('-sideend', side, 'Safeguard');
            } 
		},
        num: 219,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Safeguard",
        pp: 25,
        priority: 0,
        flags: {"snatch":1},
        sideCondition: "safeguard",
        secondary: null,
        target: "allySide",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    saltcure: {
        num: 864,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Salt Cure",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        condition: {
			noCopy: true,
			onStart(pokemon) {
                this.add('-start', pokemon, 'Salt Cure');
            },
			onResidualOrder: 13,
			onResidual(pokemon) {
                this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 4 : 8));
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Salt Cure');
            } 
		},
        secondary: {"chance":100,"volatileStatus":"saltcure"},
        target: "normal",
        type: "Rock"
    },
    sandattack: {
        ignoreImmunity: true,
        type: "Normal",
        num: 28,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Sand Attack",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"accuracy":-1},
        secondary: null,
        target: "normal",
        zMove: {"boost":{"evasion":1}},
        contestType: "Cute"
    },
    sandsearstorm: {
        num: 848,
        accuracy: 80,
        basePower: 100,
        category: "Special",
        name: "Sandsear Storm",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        onModifyMove(move, pokemon, target) {
            if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
                move.accuracy = true;
            }
        },
        secondary: {"chance":20,"status":"brn"},
        target: "allAdjacentFoes",
        type: "Ground"
    },
    sandstorm: {
        num: 201,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sandstorm",
        pp: 10,
        priority: 0,
        flags: {"wind":1},
        weather: "Sandstorm",
        secondary: null,
        target: "all",
        type: "Rock",
        zMove: {"boost":{"spe":1}},
        contestType: "Tough"
    },
    sandtomb: {
        accuracy: 70,
        basePower: 15,
        num: 328,
        category: "Physical",
        name: "Sand Tomb",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Clever"
    },
    sappyseed: {
        accuracy: 100,
        basePower: 90,
        pp: 15,
        num: 738,
        category: "Physical",
        isNonstandard: "LGPE",
        name: "Sappy Seed",
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        onHit(target, source) {
            if (target.hasType('Grass'))
                return null;
            target.addVolatile('leechseed', source);
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Clever"
    },
    savagespinout: {
        isNonstandard: null,
        num: 634,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Savage Spin-Out",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "buginiumz",
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cool"
    },
    scald: {
        thawsTarget: false,
        num: 503,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Scald",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    scaleshot: {
        num: 799,
        accuracy: 90,
        basePower: 25,
        category: "Physical",
        name: "Scale Shot",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        selfBoost: {"boosts":{"def":-1,"spe":1}},
        secondary: null,
        target: "normal",
        type: "Dragon",
        zMove: {"basePower":140},
        maxMove: {"basePower":130}
    },
    scaryface: {
        accuracy: 90,
        num: 184,
        basePower: 0,
        category: "Status",
        name: "Scary Face",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        boosts: {"spe":-2},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Tough"
    },
    scorchingsands: {
        num: 815,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Scorching Sands",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        thawsTarget: true,
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Ground"
    },
    scratch: {
        num: 10,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Scratch",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    screech: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        num: 103,
        accuracy: 85,
        basePower: 0,
        category: "Status",
        name: "Screech",
        pp: 40,
        priority: 0,
        boosts: {"def":-2},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Clever"
    },
    searingshot: {
        isNonstandard: null,
        num: 545,
        accuracy: 100,
        basePower: 100,
        category: "Special",
        name: "Searing Shot",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"brn"},
        target: "allAdjacent",
        type: "Fire",
        contestType: "Cool"
    },
    searingsunrazesmash: {
        isNonstandard: null,
        num: 724,
        accuracy: true,
        basePower: 200,
        category: "Physical",
        name: "Searing Sunraze Smash",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "solganiumz",
        ignoreAbility: true,
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    secretpower: {
        secondary: {"chance":30,"status":"par"},
        isNonstandard: null,
        num: 290,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Secret Power",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyMove(move, pokemon) {
            if (this.field.isTerrain(''))
                return;
            move.secondaries = [];
            if (this.field.isTerrain('electricterrain')) {
                move.secondaries.push({
                    chance: 30,
                    status: 'par',
                });
            }
            else if (this.field.isTerrain('grassyterrain')) {
                move.secondaries.push({
                    chance: 30,
                    status: 'slp',
                });
            }
            else if (this.field.isTerrain('mistyterrain')) {
                move.secondaries.push({
                    chance: 30,
                    boosts: {
                        spa: -1,
                    },
                });
            }
            else if (this.field.isTerrain('psychicterrain')) {
                move.secondaries.push({
                    chance: 30,
                    boosts: {
                        spe: -1,
                    },
                });
            }
        },
        target: "normal",
        type: "Normal",
        contestType: "Clever"
    },
    secretsword: {
        isNonstandard: null,
        num: 548,
        accuracy: 100,
        basePower: 85,
        category: "Special",
        overrideDefensiveStat: "def",
        name: "Secret Sword",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Beautiful"
    },
    seedbomb: {
        num: 402,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Seed Bomb",
        pp: 15,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Tough"
    },
    seedflare: {
        isNonstandard: null,
        num: 465,
        accuracy: 85,
        basePower: 120,
        category: "Special",
        name: "Seed Flare",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":40,"boosts":{"spd":-2}},
        target: "normal",
        type: "Grass",
        contestType: "Beautiful"
    },
    seismictoss: {
        ignoreImmunity: true,
        basePower: 1,
        num: 69,
        accuracy: 100,
        damage: "level",
        category: "Physical",
        name: "Seismic Toss",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        maxMove: {"basePower":75},
        contestType: "Tough"
    },
    selfdestruct: {
        basePower: 130,
        target: "normal",
        noSketch: true,
        num: 120,
        accuracy: 100,
        category: "Physical",
        name: "Self-Destruct",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"noparentalbond":1},
        selfdestruct: "always",
        secondary: null,
        type: "Normal",
        contestType: "Beautiful"
    },
    shadowball: {
        num: 247,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Shadow Ball",
        pp: 15,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"boosts":{"spd":-1}},
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    shadowbone: {
        isNonstandard: null,
        num: 708,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        name: "Shadow Bone",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":20,"boosts":{"def":-1}},
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    shadowclaw: {
        num: 421,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Shadow Claw",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    shadowforce: {
        flags: {"contact":1,"charge":1,"mirror":1,"nosleeptalk":1},
        num: 467,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Shadow Force",
        pp: 5,
        priority: 0,
        breaksProtect: true,
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        condition: {
			duration: 2,
			onInvulnerability: false 
		},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    shadowpunch: {
        num: 325,
        accuracy: true,
        basePower: 60,
        category: "Physical",
        name: "Shadow Punch",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    shadowsneak: {
        num: 425,
        accuracy: 100,
        basePower: 40,
        category: "Physical",
        name: "Shadow Sneak",
        pp: 30,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    shadowstrike: {
        num: 0,
        accuracy: 95,
        basePower: 80,
        category: "Physical",
        isNonstandard: "CAP",
        name: "Shadow Strike",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":50,"boosts":{"def":-1}},
        target: "normal",
        type: "Ghost",
        contestType: "Clever"
    },
    sharpen: {
        isNonstandard: null,
        num: 159,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sharpen",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Cute"
    },
    shatteredpsyche: {
        isNonstandard: null,
        num: 648,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Shattered Psyche",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "psychiumz",
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    shedtail: {
        num: 880,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Shed Tail",
        pp: 10,
        priority: 0,
        flags: {},
        volatileStatus: "substitute",
        onTryHit(source) {
            if (!this.canSwitch(source.side)) {
                this.add('-fail', source);
                return this.NOT_FAIL;
            }
            if (source.volatiles['substitute']) {
                this.add('-fail', source, 'move: Shed Tail');
                return this.NOT_FAIL;
            }
            if (source.hp <= Math.ceil(source.maxhp / 2)) {
                this.add('-fail', source, 'move: Shed Tail', '[weak]');
                return this.NOT_FAIL;
            }
        },
        onHit(target) {
            this.directDamage(Math.ceil(target.maxhp / 2));
        },
        self: {},
        selfSwitch: "shedtail",
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"}
    },
    sheercold: {
        ohko: true,
        num: 329,
        accuracy: 30,
        basePower: 0,
        category: "Special",
        name: "Sheer Cold",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ice",
        zMove: {"basePower":180},
        maxMove: {"basePower":130},
        contestType: "Beautiful"
    },
    shellsidearm: {
        num: 801,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Shell Side Arm",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onPrepareHit(target, source, move) {
            if (!source.isAlly(target)) {
                this.attrLastMove('[anim] Shell Side Arm ' + move.category);
            }
        },
        onModifyMove(move, pokemon, target) {
            if (!target)
                return;
            const atk = pokemon.getStat('atk', false, true);
            const spa = pokemon.getStat('spa', false, true);
            const def = target.getStat('def', false, true);
            const spd = target.getStat('spd', false, true);
            const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
            const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
            if (physical > special || (physical === special && this.random(2) === 0)) {
                move.category = 'Physical';
                move.flags.contact = 1;
            }
        },
        onHit(target, source, move) {
            // Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
            if (!source.isAlly(target))
                this.hint(move.category + " Shell Side Arm");
        },
        onAfterSubDamage(damage, target, source, move) {
            if (!source.isAlly(target))
                this.hint(move.category + " Shell Side Arm");
        },
        secondary: {"chance":20,"status":"psn"},
        target: "normal",
        type: "Poison"
    },
    shellsmash: {
        num: 504,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Shell Smash",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":-1,"spd":-1,"atk":2,"spa":2,"spe":2},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    shelltrap: {
        isNonstandard: null,
        num: 704,
        accuracy: 100,
        basePower: 150,
        category: "Special",
        name: "Shell Trap",
        pp: 5,
        priority: -3,
        flags: {"protect":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1},
        priorityChargeCallback(pokemon) {
            pokemon.addVolatile('shelltrap');
        },
        onTryMove(pokemon) {
            if (!pokemon.volatiles['shelltrap']?.gotHit) {
                this.attrLastMove('[still]');
                this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
                return null;
            }
        },
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'move: Shell Trap');
            },
			onHit(pokemon, source, move) {
                if (!pokemon.isAlly(source) && move.category === 'Physical') {
                    this.effectState.gotHit = true;
                    const action = this.queue.willMove(pokemon);
                    if (action) {
                        this.queue.prioritizeAction(action);
                    }
                }
            } 
		},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Fire",
        contestType: "Tough"
    },
    shelter: {
        num: 842,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Shelter",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":2},
        secondary: null,
        target: "self",
        type: "Steel"
    },
    shiftgear: {
        num: 508,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Shift Gear",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"spe":2,"atk":1},
        secondary: null,
        target: "self",
        type: "Steel",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    shockwave: {
        num: 351,
        accuracy: true,
        basePower: 60,
        category: "Special",
        name: "Shock Wave",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    shoreup: {
        onHit(pokemon) {
            let factor = 0.5;
            if (this.field.isWeather('sandstorm')) {
                factor = 0.667;
            }
            const success = !!this.heal(this.modify(pokemon.maxhp, factor));
            if (!success) {
                this.add('-fail', pokemon, 'heal');
                return null;
            }
            return success;
        },
        pp: 10,
        num: 659,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Shore Up",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        type: "Ground",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    signalbeam: {
        isNonstandard: null,
        num: 324,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Signal Beam",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"volatileStatus":"confusion"},
        target: "normal",
        type: "Bug",
        contestType: "Beautiful"
    },
    silktrap: {
        num: 852,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Silk Trap",
        pp: 10,
        priority: 4,
        flags: {},
        stallingMove: true,
        volatileStatus: "silktrap",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect'] || move.category === 'Status') {
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                if (move.smartTarget) {
                    move.smartTarget = false;
                }
                else {
                    this.add('-activate', target, 'move: Protect');
                }
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                if (this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
                }
                return this.NOT_FAIL;
            },
			onHit(target, source, move) {
                if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
                    this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
                }
            } 
		},
        target: "self",
        type: "Bug"
    },
    silverwind: {
        isNonstandard: null,
        num: 318,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Silver Wind",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"self":{"boosts":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}},
        target: "normal",
        type: "Bug",
        contestType: "Beautiful"
    },
    simplebeam: {
        isNonstandard: null,
        num: 493,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Simple Beam",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onTryHit(target) {
            if (target.getAbility().isPermanent || target.ability === 'simple' || target.ability === 'truant') {
                return false;
            }
        },
        onHit(pokemon) {
            const oldAbility = pokemon.setAbility('simple');
            if (oldAbility) {
                this.add('-ability', pokemon, 'Simple', '[from] move: Simple Beam');
                return;
            }
            return oldAbility;
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Cute"
    },
    sing: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        num: 47,
        accuracy: 55,
        basePower: 0,
        category: "Status",
        name: "Sing",
        pp: 15,
        priority: 0,
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Cute"
    },
    sinisterarrowraid: {
        isNonstandard: null,
        num: 695,
        accuracy: true,
        basePower: 180,
        category: "Physical",
        name: "Sinister Arrow Raid",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "decidiumz",
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    sizzlyslide: {
        basePower: 90,
        pp: 15,
        num: 735,
        accuracy: 100,
        category: "Physical",
        isNonstandard: "LGPE",
        name: "Sizzly Slide",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"defrost":1},
        secondary: {"chance":100,"status":"brn"},
        target: "normal",
        type: "Fire",
        contestType: "Clever"
    },
    sketch: {
        flags: {"bypasssub":1,"failencore":1,"noassist":1},
        onHit() {
            // Sketch always fails in Link Battles
            this.add('-nothing');
        },
        isNonstandard: null,
        num: 166,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sketch",
        pp: 1,
        noPPBoosts: true,
        priority: 0,
        noSketch: true,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Clever"
    },
    skillswap: {
        onHit(target, source) {
            const targetAbility = target.ability;
            const sourceAbility = source.ability;
            if (targetAbility === sourceAbility || source.hasItem('griseousorb') || target.hasItem('griseousorb')) {
                return false;
            }
            this.add('-activate', source, 'move: Skill Swap');
            source.setAbility(targetAbility);
            target.setAbility(sourceAbility);
        },
        num: 285,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Skill Swap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1,"allyanim":1},
        onTryHit(target, source) {
            const additionalBannedAbilities = ['hungerswitch', 'illusion', 'neutralizinggas', 'wonderguard'];
            const targetAbility = target.getAbility();
            const sourceAbility = source.getAbility();
            // TODO: research in what order these should be checked
            if (target.volatiles['dynamax'] ||
                targetAbility.isPermanent || sourceAbility.isPermanent ||
                additionalBannedAbilities.includes(target.ability) || additionalBannedAbilities.includes(source.ability)) {
                return false;
            }
            const sourceCanBeSet = this.runEvent('SetAbility', source, source, this.effect, targetAbility);
            if (!sourceCanBeSet)
                return sourceCanBeSet;
            const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, sourceAbility);
            if (!targetCanBeSet)
                return targetCanBeSet;
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    skittersmack: {
        num: 806,
        accuracy: 90,
        basePower: 70,
        category: "Physical",
        name: "Skitter Smack",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spa":-1}},
        target: "normal",
        type: "Bug"
    },
    skullbash: {
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        basePower: 100,
        pp: 15,
        isNonstandard: null,
        num: 130,
        accuracy: 100,
        category: "Physical",
        name: "Skull Bash",
        priority: 0,
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"nosleeptalk":1,"failinstruct":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    skyattack: {
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        critRatio: 1,
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        secondary: null,
        num: 143,
        accuracy: 90,
        basePower: 140,
        category: "Physical",
        name: "Sky Attack",
        pp: 5,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1,"distance":1,"nosleeptalk":1,"failinstruct":1},
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    skydrop: {
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"gravity":1,"distance":1,"nosleeptalk":1},
        onTryHit(target, source, move) {
            if (target.fainted)
                return false;
            if (source.removeVolatile(move.id)) {
                if (target !== source.volatiles['twoturnmove'].source)
                    return false;
                if (target.hasType('Flying')) {
                    this.add('-immune', target);
                    this.add('-end', target, 'Sky Drop');
                    return null;
                }
            }
            else {
                if (target.volatiles['substitute'] || target.isAlly(source)) {
                    return false;
                }
                this.add('-prepare', source, move.name, target);
                source.addVolatile('twoturnmove', target);
                return null;
            }
        },
        isNonstandard: null,
        num: 507,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Sky Drop",
        pp: 10,
        priority: 0,
        onModifyMove(move, source) {
            if (!source.volatiles['skydrop']) {
                move.accuracy = true;
                delete move.flags['contact'];
            }
        },
        onMoveFail(target, source) {
            if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
                source.removeVolatile('skydrop');
                source.removeVolatile('twoturnmove');
                if (target === this.effectState.target) {
                    this.add('-end', target, 'Sky Drop', '[interrupt]');
                }
            }
        },
        onTry(source, target) {
            return !target.fainted;
        },
        onHit(target, source) {
            if (target.hp)
                this.add('-end', target, 'Sky Drop');
        },
        condition: {
			duration: 2,
			onAnyDragOut(pokemon) {
                if (pokemon === this.effectState.target || pokemon === this.effectState.source)
                    return false;
            },
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon(defender) {
                if (defender !== this.effectState.source)
                    return;
                defender.trapped = true;
            },
			onFoeBeforeMovePriority: 12,
			onFoeBeforeMove(attacker, defender, move) {
                if (attacker === this.effectState.source) {
                    attacker.activeMoveActions--;
                    this.debug('Sky drop nullifying.');
                    return null;
                }
            },
			onRedirectTargetPriority: 99,
			onRedirectTarget(target, source, source2) {
                if (source !== this.effectState.target)
                    return;
                if (this.effectState.source.fainted)
                    return;
                return this.effectState.source;
            },
			onAnyInvulnerability(target, source, move) {
                if (target !== this.effectState.target && target !== this.effectState.source) {
                    return;
                }
                if (source === this.effectState.target && target === this.effectState.source) {
                    return;
                }
                if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
                    return;
                }
                return false;
            },
			onAnyBasePower(basePower, target, source, move) {
                if (target !== this.effectState.target && target !== this.effectState.source) {
                    return;
                }
                if (source === this.effectState.target && target === this.effectState.source) {
                    return;
                }
                if (move.id === 'gust' || move.id === 'twister') {
                    this.debug('BP doubled on midair target');
                    return this.chainModify(2);
                }
            },
			onFaint(target) {
                if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
                    this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
                }
            } 
		},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Tough"
    },
    skyuppercut: {
        isNonstandard: null,
        num: 327,
        accuracy: 90,
        basePower: 85,
        category: "Physical",
        name: "Sky Uppercut",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    slackoff: {
        pp: 10,
        num: 303,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Slack Off",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        heal: [1,2],
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    slam: {
        num: 21,
        accuracy: 75,
        basePower: 80,
        category: "Physical",
        name: "Slam",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    slash: {
        critRatio: 2,
        num: 163,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Slash",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    sleeppowder: {
        onTryHit() { },
        num: 79,
        accuracy: 75,
        basePower: 0,
        category: "Status",
        name: "Sleep Powder",
        pp: 15,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1},
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    sleeptalk: {
        flags: {"failencore":1,"nosleeptalk":1},
        onHit(pokemon) {
            const moves = [];
            for (const moveSlot of pokemon.moveSlots) {
                const moveid = moveSlot.id;
                const move = this.dex.moves.get(moveid);
                if (moveid && !move.flags['nosleeptalk'] && !move.flags['charge']) {
                    moves.push(moveid);
                }
            }
            let randomMove = '';
            if (moves.length)
                randomMove = this.sample(moves);
            if (!randomMove)
                return false;
            this.actions.useMove(randomMove, pokemon);
        },
        noSketch: true,
        onTryHit(pokemon) {
            return !pokemon.volatiles['choicelock'] && !pokemon.volatiles['encore'];
        },
        num: 214,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sleep Talk",
        pp: 10,
        priority: 0,
        sleepUsable: true,
        onTry(source) {
            return source.status === 'slp' || source.hasAbility('comatose');
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"crit2"},
        contestType: "Cute"
    },
    sludge: {
        secondary: {"chance":40,"status":"psn"},
        num: 124,
        accuracy: 100,
        basePower: 65,
        category: "Physical",
        name: "Sludge",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    sludgebomb: {
        num: 188,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Sludge Bomb",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"psn"},
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    sludgewave: {
        num: 482,
        accuracy: 100,
        basePower: 95,
        category: "Special",
        name: "Sludge Wave",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"psn"},
        target: "allAdjacent",
        type: "Poison",
        contestType: "Tough"
    },
    smackdown: {
        num: 479,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Smack Down",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        volatileStatus: "smackdown",
        condition: {
			noCopy: true,
			onStart(pokemon) {
                let applies = false;
                if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate'))
                    applies = true;
                if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
                    this.field.getPseudoWeather('gravity'))
                    applies = false;
                if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
                    applies = true;
                    this.queue.cancelMove(pokemon);
                    pokemon.removeVolatile('twoturnmove');
                }
                if (pokemon.volatiles['magnetrise']) {
                    applies = true;
                    delete pokemon.volatiles['magnetrise'];
                }
                if (pokemon.volatiles['telekinesis']) {
                    applies = true;
                    delete pokemon.volatiles['telekinesis'];
                }
                if (!applies)
                    return false;
                this.add('-start', pokemon, 'Smack Down');
            },
			onRestart(pokemon) {
                if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
                    this.queue.cancelMove(pokemon);
                    pokemon.removeVolatile('twoturnmove');
                    this.add('-start', pokemon, 'Smack Down');
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    smartstrike: {
        num: 684,
        accuracy: true,
        basePower: 70,
        category: "Physical",
        name: "Smart Strike",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    smellingsalts: {
        basePower: 60,
        isNonstandard: null,
        num: 265,
        accuracy: 100,
        basePowerCallback(pokemon, target, move) {
            if (target.status === 'par') {
                this.debug('BP doubled on paralyzed target');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Smelling Salts",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onHit(target) {
            if (target.status === 'par')
                target.cureStatus();
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    smog: {
        basePower: 20,
        num: 123,
        accuracy: 70,
        category: "Physical",
        name: "Smog",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":40,"status":"psn"},
        target: "normal",
        type: "Poison",
        contestType: "Tough"
    },
    smokescreen: {
        num: 108,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Smokescreen",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"accuracy":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"evasion":1}},
        contestType: "Clever"
    },
    snaptrap: {
        isNonstandard: null,
        num: 779,
        accuracy: 100,
        basePower: 35,
        category: "Physical",
        name: "Snap Trap",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Grass"
    },
    snarl: {
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 555,
        accuracy: 95,
        basePower: 55,
        category: "Special",
        name: "Snarl",
        pp: 15,
        priority: 0,
        secondary: {"chance":100,"boosts":{"spa":-1}},
        target: "allAdjacentFoes",
        type: "Dark",
        contestType: "Tough"
    },
    snatch: {
        flags: {"bypasssub":1,"noassist":1,"failcopycat":1},
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'Snatch');
            },
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
                const snatchUser = this.effectState.source;
                if (snatchUser.isSkyDropped())
                    return;
                if (!move || move.isZ || move.isMax || !move.flags['snatch']) {
                    return;
                }
                snatchUser.removeVolatile('snatch');
                this.add('-activate', snatchUser, 'move: Snatch', '[of] ' + source);
                this.actions.useMove(move.id, snatchUser);
                return null;
            } 
		},
        isNonstandard: null,
        num: 289,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Snatch",
        pp: 10,
        priority: 4,
        volatileStatus: "snatch",
        secondary: null,
        target: "self",
        type: "Dark",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    snipeshot: {
        num: 745,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Snipe Shot",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        tracksTarget: true,
        secondary: null,
        target: "normal",
        type: "Water"
    },
    snore: {
        basePower: 40,
        flags: {"protect":1,"mirror":1,"sound":1},
        num: 173,
        accuracy: 100,
        category: "Physical",
        name: "Snore",
        pp: 15,
        priority: 0,
        sleepUsable: true,
        onTry(source) {
            return source.status === 'slp' || source.hasAbility('comatose');
        },
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    snowscape: {
        num: 883,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Snowscape",
        pp: 10,
        priority: 0,
        flags: {},
        weather: "snow",
        secondary: null,
        target: "all",
        type: "Ice"
    },
    soak: {
        onHit(target) {
            if (!target.setType('Water')) {
                // Soak should animate even when it fails.
                // Returning false would suppress the animation.
                this.add('-fail', target);
                return null;
            }
            this.add('-start', target, 'typechange', 'Water');
        },
        num: 487,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Soak",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        secondary: null,
        target: "normal",
        type: "Water",
        zMove: {"boost":{"spa":1}},
        contestType: "Cute"
    },
    softboiled: {
        heal: null,
        onHit(target) {
            if (target.hp === target.maxhp)
                return false;
            // Fail when health is 255 or 511 less than max, unless it is divisible by 256
            if (target.hp === target.maxhp ||
                ((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)) {
                this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
                    "unless the current hp is also divisible by 256.");
                return false;
            }
            this.heal(Math.floor(target.maxhp / 2), target, target);
        },
        pp: 10,
        num: 135,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Soft-Boiled",
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    solarbeam: {
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile('twoturnmove')) {
                attacker.removeVolatile('invulnerability');
                return;
            }
            this.add('-prepare', attacker, move.name);
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        onPrepareHit(target, source) {
            return source.status !== 'slp';
        },
        onBasePower() { },
        num: 76,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Solar Beam",
        pp: 10,
        priority: 0,
        flags: {"charge":1,"protect":1,"mirror":1,"nosleeptalk":1,"failinstruct":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    solarblade: {
        num: 669,
        accuracy: 100,
        basePower: 125,
        category: "Physical",
        name: "Solar Blade",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"charge":1,"protect":1,"mirror":1,"slicing":1,"nosleeptalk":1,"failinstruct":1},
        onTryMove(attacker, defender, move) {
            if (attacker.removeVolatile(move.id)) {
                return;
            }
            this.add('-prepare', attacker, move.name);
            if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
                this.attrLastMove('[still]');
                this.addMove('-anim', attacker, move.name, defender);
                return;
            }
            if (!this.runEvent('ChargeMove', attacker, defender, move)) {
                return;
            }
            attacker.addVolatile('twoturnmove', defender);
            return null;
        },
        onBasePower(basePower, pokemon, target) {
            const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snow'];
            if (weakWeathers.includes(pokemon.effectiveWeather())) {
                this.debug('weakened by weather');
                return this.chainModify(0.5);
            }
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    sonicboom: {
        ignoreImmunity: true,
        basePower: 1,
        isNonstandard: null,
        num: 49,
        accuracy: 90,
        damage: 20,
        category: "Physical",
        name: "Sonic Boom",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    soulstealing7starstrike: {
        isNonstandard: null,
        num: 699,
        accuracy: true,
        basePower: 195,
        category: "Physical",
        name: "Soul-Stealing 7-Star Strike",
        pp: 1,
        priority: 0,
        flags: {"contact":1},
        isZ: "marshadiumz",
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    spacialrend: {
        num: 460,
        accuracy: 95,
        basePower: 100,
        category: "Special",
        name: "Spacial Rend",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Dragon",
        contestType: "Beautiful"
    },
    spark: {
        num: 209,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Spark",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    sparklingaria: {
        isNonstandard: null,
        num: 664,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        name: "Sparkling Aria",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: {"dustproof":true,"chance":100,"volatileStatus":"sparklingaria"},
        onAfterMove(source, target, move) {
            for (const pokemon of this.getAllActive()) {
                if (pokemon !== source && pokemon.removeVolatile('sparklingaria') && pokemon.status === 'brn' && !source.fainted) {
                    pokemon.cureStatus();
                }
            }
        },
        target: "allAdjacent",
        type: "Water",
        contestType: "Tough"
    },
    sparklyswirl: {
        accuracy: 100,
        basePower: 90,
        pp: 15,
        num: 740,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Sparkly Swirl",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        self: {},
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Clever"
    },
    spectralthief: {
        isNonstandard: null,
        num: 712,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Spectral Thief",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"bypasssub":1},
        stealsBoosts: true,
        secondary: null,
        target: "normal",
        type: "Ghost",
        contestType: "Cool"
    },
    speedswap: {
        num: 683,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Speed Swap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1,"allyanim":1},
        onHit(target, source) {
            const targetSpe = target.storedStats.spe;
            target.storedStats.spe = source.storedStats.spe;
            source.storedStats.spe = targetSpe;
            this.add('-activate', source, 'move: Speed Swap', '[of] ' + target);
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    spicyextract: {
        num: 858,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Spicy Extract",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"atk":2,"def":-2},
        secondary: null,
        target: "normal",
        type: "Grass"
    },
    spiderweb: {
        flags: {"reflectable":1,"mirror":1},
        isNonstandard: null,
        num: 169,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Spider Web",
        pp: 10,
        priority: 0,
        onHit(target, source, move) {
            return target.addVolatile('trapped', source, move, 'trapper');
        },
        secondary: null,
        target: "normal",
        type: "Bug",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    spikecannon: {
        isNonstandard: null,
        num: 131,
        accuracy: 100,
        basePower: 20,
        category: "Physical",
        name: "Spike Cannon",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        maxMove: {"basePower":120},
        contestType: "Cool"
    },
    spikes: {
        condition: {
			onSideStart(side) {
                if (!this.effectState.layers || this.effectState.layers === 0) {
                    this.add('-sidestart', side, 'Spikes');
                    this.effectState.layers = 1;
                }
                else {
                    return false;
                }
            },
			onSwitchIn(pokemon) {
                if (!pokemon.runImmunity('Ground'))
                    return;
                const damageAmounts = [0, 3];
                this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
            } 
		},
        flags: {},
        num: 191,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Spikes",
        pp: 20,
        priority: 0,
        sideCondition: "spikes",
        secondary: null,
        target: "foeSide",
        type: "Ground",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    spikyshield: {
        num: 596,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Spiky Shield",
        pp: 10,
        priority: 4,
        flags: {"noassist":1,"failcopycat":1},
        stallingMove: true,
        volatileStatus: "spikyshield",
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onStart(target) {
                this.add('-singleturn', target, 'move: Protect');
            },
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
                if (!move.flags['protect']) {
                    if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id))
                        return;
                    if (move.isZ || move.isMax)
                        target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }
                if (move.smartTarget) {
                    move.smartTarget = false;
                }
                else {
                    this.add('-activate', target, 'move: Protect');
                }
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                if (this.checkMoveMakesContact(move, source, target)) {
                    this.damage(source.baseMaxhp / 8, source, target);
                }
                return this.NOT_FAIL;
            },
			onHit(target, source, move) {
                if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
                    this.damage(source.baseMaxhp / 8, source, target);
                }
            } 
		},
        secondary: null,
        target: "self",
        type: "Grass",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    spinout: {
        num: 859,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Spin Out",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        self: {"boosts":{"spe":-2}},
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    spiritbreak: {
        num: 789,
        accuracy: 100,
        basePower: 75,
        category: "Physical",
        name: "Spirit Break",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spa":-1}},
        target: "normal",
        type: "Fairy"
    },
    spiritshackle: {
        num: 662,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Spirit Shackle",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100},
        target: "normal",
        type: "Ghost",
        contestType: "Tough"
    },
    spitup: {
        num: 255,
        accuracy: 100,
        basePower: 0,
        basePowerCallback(pokemon) {
            if (!pokemon.volatiles['stockpile']?.layers)
                return false;
            return pokemon.volatiles['stockpile'].layers * 100;
        },
        category: "Physical",
        name: "Spit Up",
        pp: 10,
        priority: 0,
        flags: {"protect":1},
        onTry(source) {
            return !!source.volatiles['stockpile'];
        },
        onAfterMove(pokemon) {
            pokemon.removeVolatile('stockpile');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    spite: {
        onHit(target) {
            const roll = this.random(2, 6);
            if (target.lastMove && target.deductPP(target.lastMove.id, roll)) {
                this.add("-activate", target, 'move: Spite', target.lastMove.id, roll);
                return;
            }
            return false;
        },
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        num: 180,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Spite",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "normal",
        type: "Ghost",
        zMove: {"effect":"heal"},
        contestType: "Tough"
    },
    splash: {
        num: 150,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Splash",
        pp: 40,
        priority: 0,
        flags: {"gravity":1},
        onTry(source, target, move) {
            // Additional Gravity check for Z-move variant
            if (this.field.getPseudoWeather('Gravity')) {
                this.add('cant', source, 'move: Gravity', move);
                return null;
            }
        },
        onTryHit(target, source) {
            this.add('-nothing');
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"atk":3}},
        contestType: "Cute"
    },
    splinteredstormshards: {
        isNonstandard: null,
        num: 727,
        accuracy: true,
        basePower: 190,
        category: "Physical",
        name: "Splintered Stormshards",
        pp: 1,
        priority: 0,
        flags: {},
        onHit() {
            this.field.clearTerrain();
        },
        onAfterSubDamage() {
            this.field.clearTerrain();
        },
        isZ: "lycaniumz",
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Cool"
    },
    splishysplash: {
        num: 730,
        accuracy: 100,
        basePower: 90,
        category: "Special",
        isNonstandard: "LGPE",
        name: "Splishy Splash",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":30,"status":"par"},
        target: "allAdjacentFoes",
        type: "Water",
        contestType: "Cool"
    },
    spore: {
        onTryHit() { },
        num: 147,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Spore",
        pp: 15,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1},
        status: "slp",
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    spotlight: {
        isNonstandard: null,
        num: 671,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Spotlight",
        pp: 15,
        priority: 3,
        flags: {"protect":1,"reflectable":1,"allyanim":1,"noassist":1,"failcopycat":1},
        volatileStatus: "spotlight",
        onTryHit(target) {
            if (this.activePerHalf === 1)
                return false;
        },
        condition: {
			duration: 1,
			onStart(pokemon) {
                this.add('-singleturn', pokemon, 'move: Spotlight');
            },
			onFoeRedirectTargetPriority: 2,
			onFoeRedirectTarget(target, source, source2, move) {
                if (this.validTarget(this.effectState.target, source, move.target)) {
                    this.debug("Spotlight redirected target of move");
                    return this.effectState.target;
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Cute"
    },
    springtidestorm: {
        num: 831,
        accuracy: 80,
        basePower: 100,
        category: "Special",
        name: "Springtide Storm",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: {"chance":30,"boosts":{"atk":-1}},
        target: "allAdjacentFoes",
        type: "Fairy"
    },
    stealthrock: {
        flags: {},
        num: 446,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Stealth Rock",
        pp: 20,
        priority: 0,
        sideCondition: "stealthrock",
        condition: {
			onSideStart(side) {
                this.add('-sidestart', side, 'move: Stealth Rock');
            },
			onEntryHazard(pokemon) {
                if (pokemon.hasItem('heavydutyboots'))
                    return;
                const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
                this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
            } 
		},
        secondary: null,
        target: "foeSide",
        type: "Rock",
        zMove: {"boost":{"def":1}},
        contestType: "Cool"
    },
    steameruption: {
        num: 592,
        accuracy: 95,
        basePower: 110,
        category: "Special",
        name: "Steam Eruption",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1,"defrost":1},
        thawsTarget: true,
        secondary: {"chance":30,"status":"brn"},
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    steamroller: {
        isNonstandard: null,
        num: 537,
        accuracy: 100,
        basePower: 65,
        category: "Physical",
        name: "Steamroller",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Bug",
        contestType: "Tough"
    },
    steelbeam: {
        num: 796,
        accuracy: 95,
        basePower: 140,
        category: "Special",
        name: "Steel Beam",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        mindBlownRecoil: true,
        onAfterMove(pokemon, target, move) {
            if (move.mindBlownRecoil && !move.multihit) {
                const hpBeforeRecoil = pokemon.hp;
                this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Steel Beam'), true);
                if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
                    this.runEvent('EmergencyExit', pokemon, pokemon);
                }
            }
        },
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    steelroller: {
        num: 798,
        accuracy: 100,
        basePower: 130,
        category: "Physical",
        name: "Steel Roller",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onTry() {
            return !this.field.isTerrain('');
        },
        onHit() {
            this.field.clearTerrain();
        },
        onAfterSubDamage() {
            this.field.clearTerrain();
        },
        secondary: null,
        target: "normal",
        type: "Steel"
    },
    steelwing: {
        num: 211,
        accuracy: 90,
        basePower: 70,
        category: "Physical",
        name: "Steel Wing",
        pp: 25,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":10,"self":{"boosts":{"def":1}}},
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    stickyweb: {
        num: 564,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sticky Web",
        pp: 20,
        priority: 0,
        flags: {"reflectable":1},
        sideCondition: "stickyweb",
        condition: {
			onSideStart(side) {
                this.add('-sidestart', side, 'move: Sticky Web');
            },
			onEntryHazard(pokemon) {
                if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots'))
                    return;
                this.add('-activate', pokemon, 'move: Sticky Web');
                this.boost({ spe: -1 }, pokemon, this.effectState.source, this.dex.getActiveMove('stickyweb'));
            } 
		},
        secondary: null,
        target: "foeSide",
        type: "Bug",
        zMove: {"boost":{"spe":1}},
        contestType: "Tough"
    },
    stockpile: {
        pp: 10,
        condition: {
			noCopy: true,
			onStart(target) {
                this.effectState.layers = 1;
                this.add('-start', target, 'stockpile' + this.effectState.layers);
            },
			onRestart(target) {
                if (this.effectState.layers >= 3)
                    return false;
                this.effectState.layers++;
                this.add('-start', target, 'stockpile' + this.effectState.layers);
            },
			onEnd(target) {
                this.effectState.layers = 0;
                this.add('-end', target, 'Stockpile');
            } 
		},
        num: 254,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Stockpile",
        priority: 0,
        flags: {"snatch":1},
        onTry(source) {
            if (source.volatiles['stockpile'] && source.volatiles['stockpile'].layers >= 3)
                return false;
        },
        volatileStatus: "stockpile",
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Tough"
    },
    stokedsparksurfer: {
        isNonstandard: null,
        num: 700,
        accuracy: true,
        basePower: 175,
        category: "Special",
        name: "Stoked Sparksurfer",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "aloraichiumz",
        secondary: {"chance":100,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    stomp: {
        num: 23,
        accuracy: 100,
        basePower: 65,
        category: "Physical",
        name: "Stomp",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"nonsky":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    stompingtantrum: {
        num: 707,
        accuracy: 100,
        basePower: 75,
        basePowerCallback(pokemon, target, move) {
            if (pokemon.moveLastTurnResult === false) {
                this.debug('doubling Stomping Tantrum BP due to previous move failure');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Stomping Tantrum",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Tough"
    },
    stoneaxe: {
        num: 830,
        accuracy: 90,
        basePower: 65,
        category: "Physical",
        name: "Stone Axe",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        onAfterHit(target, source, move) {
            if (!move.hasSheerForce && source.hp) {
                for (const side of source.side.foeSidesWithConditions()) {
                    side.addSideCondition('stealthrock');
                }
            }
        },
        onAfterSubDamage(damage, target, source, move) {
            if (!move.hasSheerForce && source.hp) {
                for (const side of source.side.foeSidesWithConditions()) {
                    side.addSideCondition('stealthrock');
                }
            }
        },
        secondary: {},
        target: "normal",
        type: "Rock"
    },
    stoneedge: {
        num: 444,
        accuracy: 80,
        basePower: 100,
        category: "Physical",
        name: "Stone Edge",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        secondary: null,
        target: "normal",
        type: "Rock",
        contestType: "Tough"
    },
    storedpower: {
        num: 500,
        accuracy: 100,
        basePower: 20,
        basePowerCallback(pokemon, target, move) {
            const bp = move.basePower + 20 * pokemon.positiveBoosts();
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Stored Power",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Clever"
    },
    stormthrow: {
        basePower: 40,
        isNonstandard: null,
        num: 480,
        accuracy: 100,
        category: "Physical",
        name: "Storm Throw",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        willCrit: true,
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    strangesteam: {
        isNonstandard: null,
        num: 790,
        accuracy: 95,
        basePower: 90,
        category: "Special",
        name: "Strange Steam",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":20,"volatileStatus":"confusion"},
        target: "normal",
        type: "Fairy"
    },
    strength: {
        num: 70,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Strength",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    strengthsap: {
        num: 668,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Strength Sap",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"heal":1},
        onHit(target, source) {
            if (target.boosts.atk === -6)
                return false;
            const atk = target.getStat('atk', false, true);
            const success = this.boost({ atk: -1 }, target, source, null, false, true);
            return !!(this.heal(atk, source, target) || success);
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    stringshot: {
        boosts: {"spe":-1},
        num: 81,
        accuracy: 95,
        basePower: 0,
        category: "Status",
        name: "String Shot",
        pp: 40,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Bug",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    struggle: {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {
			contact: 1, protect: 1,
			failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		noSketch: true,
		onModifyMove(move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Struggle');
		},
		struggleRecoil: true,
		secondary: null,
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
	},
    strugglebug: {
        basePower: 30,
        num: 522,
        accuracy: 100,
        category: "Special",
        name: "Struggle Bug",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"spa":-1}},
        target: "allAdjacentFoes",
        type: "Bug",
        contestType: "Cute"
    },
    stuffcheeks: {
        num: 747,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Stuff Cheeks",
        pp: 10,
        priority: 0,
        flags: {"snatch":1},
        onDisableMove(pokemon) {
            if (!pokemon.getItem().isBerry)
                pokemon.disableMove('stuffcheeks');
        },
        onTry(source) {
            return source.getItem().isBerry;
        },
        onHit(pokemon) {
            if (!this.boost({ def: 2 }))
                return null;
            pokemon.eatItem(true);
        },
        secondary: null,
        target: "self",
        type: "Normal"
    },
    stunspore: {
        onTryHit() { },
        num: 78,
        accuracy: 75,
        basePower: 0,
        category: "Status",
        name: "Stun Spore",
        pp: 30,
        priority: 0,
        flags: {"powder":1,"protect":1,"reflectable":1,"mirror":1},
        status: "par",
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    submission: {
        pp: 25,
        isNonstandard: null,
        num: 66,
        accuracy: 80,
        basePower: 80,
        category: "Physical",
        name: "Submission",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [1,4],
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    substitute: {
        num: 164,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Substitute",
        pp: 10,
        priority: 0,
        volatileStatus: "substitute",
        condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4) + 1;
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit(target, source, move) {
				if (move.drain) {
					this.add('-miss', source);
					this.hint("In the Japanese versions of Gen 1, draining moves always miss against substitutes.");
					return null;
				}
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					const subBlocked = ['lockon', 'meanlook', 'mindreader', 'nightmare'];
					if ((move.status && ['psn', 'tox'].includes(move.status)) || (move.boosts && target !== source) ||
						move.volatileStatus === 'confusion' || subBlocked.includes(move.id)) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				// NOTE: In future generations the damage is capped to the remaining HP of the
				// Substitute, here we deliberately use the uncapped damage when tracking lastDamage etc.
				// Also, multi-hit moves must always deal the same damage as the first hit for any subsequent hits
				let uncappedDamage = move.hit > 1 ? this.lastDamage : this.actions.getDamage(source, target, move);
				if (!uncappedDamage && uncappedDamage !== 0) return null;
				uncappedDamage = this.runEvent('SubDamage', target, source, move, uncappedDamage);
				if (!uncappedDamage && uncappedDamage !== 0) return uncappedDamage;
				this.lastDamage = uncappedDamage;
				target.volatiles['substitute'].hp -= uncappedDamage > target.volatiles['substitute'].hp ?
					target.volatiles['substitute'].hp : uncappedDamage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(Math.round(uncappedDamage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
					}
					if (move.drain) {
						this.heal(Math.ceil(uncappedDamage * move.drain[0] / move.drain[1]), source, target, 'drain');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, uncappedDamage);
				// Add here counter damage
				const lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({source: source, move: move.id, damage: uncappedDamage, thisTurn: true, slot: source.getSlot()});
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = uncappedDamage;
				}
				return 0;
			},
			onAccuracy(accuracy, target, source, move) {
				if (move.id === 'swift') {
					return true;
				}
				return accuracy;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
        secondary: null,
        target: "self",
        type: "Normal",
        flags: {}
    },
    subzeroslammer: {
        isNonstandard: null,
        num: 650,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Subzero Slammer",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "iciumz",
        secondary: null,
        target: "normal",
        type: "Ice",
        contestType: "Cool"
    },
    suckerpunch: {
        onTry(source, target) {
            const action = this.queue.willMove(target);
            if (!action || action.choice !== 'move' || action.move.category === 'Status' || target.volatiles['mustrecharge']) {
                this.add('-fail', source);
                return null;
            }
        },
        basePower: 80,
        num: 389,
        accuracy: 100,
        category: "Physical",
        name: "Sucker Punch",
        pp: 5,
        priority: 1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    sunnyday: {
        num: 241,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Sunny Day",
        pp: 5,
        priority: 0,
        flags: {},
        weather: "sunnyday",
        secondary: null,
        target: "all",
        type: "Fire",
        zMove: {"boost":{"spe":1}},
        contestType: "Beautiful"
    },
    sunsteelstrike: {
        isNonstandard: null,
        num: 713,
        accuracy: 100,
        basePower: 100,
        category: "Physical",
        name: "Sunsteel Strike",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        ignoreAbility: true,
        secondary: null,
        target: "normal",
        type: "Steel",
        contestType: "Cool"
    },
    supercellslam: {
		num: 916,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Supercell Slam",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('Supercell Slam'));
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
    superfang: {
        ignoreImmunity: true,
        basePower: 1,
        num: 162,
        accuracy: 90,
        damageCallback(pokemon, target) {
            return this.clampIntRange(target.getUndynamaxedHP() / 2, 1);
        },
        category: "Physical",
        name: "Super Fang",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    superpower: {
        num: 276,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Superpower",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        self: {"boosts":{"atk":-1,"def":-1}},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    supersonic: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"sound":1},
        num: 48,
        accuracy: 55,
        basePower: 0,
        category: "Status",
        name: "Supersonic",
        pp: 20,
        priority: 0,
        volatileStatus: "confusion",
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    supersonicskystrike: {
        isNonstandard: null,
        num: 626,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Supersonic Skystrike",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "flyiniumz",
        secondary: null,
        target: "normal",
        type: "Flying",
        contestType: "Cool"
    },
    surf: {
        target: "allAdjacentFoes",
        basePower: 95,
        num: 57,
        accuracy: 100,
        category: "Special",
        name: "Surf",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        secondary: null,
        type: "Water",
        contestType: "Beautiful"
    },
    surgingstrikes: {
        num: 818,
        accuracy: 100,
        basePower: 25,
        category: "Physical",
        name: "Surging Strikes",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"punch":1,"mirror":1},
        willCrit: true,
        multihit: 3,
        secondary: null,
        target: "normal",
        type: "Water",
        zMove: {"basePower":140},
        maxMove: {"basePower":130}
    },
    swagger: {
        onTryHit(target, pokemon) {
            if (target.boosts.atk >= 6 || target.getStat('atk', false, true) === 999) {
                this.add('-miss', pokemon);
                return null;
            }
        },
        accuracy: 90,
        num: 207,
        basePower: 0,
        category: "Status",
        name: "Swagger",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        volatileStatus: "confusion",
        boosts: {"atk":2},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Cute"
    },
    swallow: {
        onHit(pokemon) {
            const healAmount = [0.25, 0.5, 1];
            const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
            if (!success)
                this.add('-fail', pokemon, 'heal');
            pokemon.removeVolatile('stockpile');
            return success || null;
        },
        num: 256,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Swallow",
        pp: 10,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        onTry(source) {
            return !!source.volatiles['stockpile'];
        },
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Tough"
    },
    sweetkiss: {
        type: "Normal",
        num: 186,
        accuracy: 75,
        basePower: 0,
        category: "Status",
        name: "Sweet Kiss",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        volatileStatus: "confusion",
        secondary: null,
        target: "normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Cute"
    },
    sweetscent: {
        boosts: {"evasion":-1},
        num: 230,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Sweet Scent",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Cute"
    },
    swift: {
        num: 129,
        accuracy: 100,
        basePower: 60,
        category: "Physical",
        name: "Swift",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        contestType: "Cool"
    },
    switcheroo: {
        onTryHit(target, source, move) {
            if (target.hasAbility('multitype') || source.hasAbility('multitype'))
                return false;
        },
        onHit(target, source, move) {
            const yourItem = target.takeItem(source);
            const myItem = source.takeItem();
            if (target.item || source.item || (!yourItem && !myItem)) {
                if (yourItem)
                    target.item = yourItem.id;
                if (myItem)
                    source.item = myItem.id;
                return false;
            }
            if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
                (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))) {
                if (yourItem)
                    target.item = yourItem.id;
                if (myItem)
                    source.item = myItem.id;
                return false;
            }
            this.add('-activate', source, 'move: Trick', '[of] ' + target);
            if (myItem) {
                target.setItem(myItem);
                this.add('-item', target, myItem, '[from] move: Switcheroo');
            }
            else {
                this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
            }
            if (yourItem) {
                source.setItem(yourItem);
                this.add('-item', source, yourItem, '[from] move: Switcheroo');
            }
            else {
                this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
            }
        },
        num: 415,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Switcheroo",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1,"noassist":1,"failcopycat":1},
        onTryImmunity(target) {
            return !target.hasAbility('stickyhold');
        },
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    swordsdance: {
        pp: 30,
        num: 14,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Swords Dance",
        priority: 0,
        flags: {"snatch":1,"dance":1},
        boosts: {"atk":2},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    synchronoise: {
        basePower: 70,
        pp: 15,
        isNonstandard: null,
        num: 485,
        accuracy: 100,
        category: "Special",
        name: "Synchronoise",
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onTryImmunity(target, source) {
            return target.hasType(source.getTypes());
        },
        secondary: null,
        target: "allAdjacent",
        type: "Psychic",
        contestType: "Clever"
    },
    synthesis: {
        onHit(pokemon) {
            if (this.field.isWeather(['sunnyday', 'desolateland'])) {
                this.heal(pokemon.maxhp);
            }
            else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
                this.heal(pokemon.baseMaxhp / 4);
            }
            else {
                this.heal(pokemon.baseMaxhp / 2);
            }
        },
        num: 235,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Synthesis",
        pp: 5,
        priority: 0,
        flags: {"snatch":1,"heal":1},
        secondary: null,
        target: "self",
        type: "Grass",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Clever"
    },
    syrupbomb: {
		num: 903,
		accuracy: 85,
		basePower: 60,
		category: "Special",
		name: "Syrup Bomb",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
		condition: {
			noCopy: true,
			duration: 4,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Syrup Bomb');
			},
			onResidualOrder: 14,
			onResidual() {
				this.boost({spe: -1});
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Syrup Bomb', '[silent]');
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'syrupbomb',
		},
		target: "normal",
		type: "Grass",
	},
	tachyoncutter: {
		num: 911,
		accuracy: true,
		basePower: 50,
		category: "Special",
		name: "Tachyon Cutter",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, slicing: 1},
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: {basePower: 180},
		maxMove: {basePower: 140},
		contestType: "Clever",
	},
    tackle: {
        accuracy: 95,
        basePower: 35,
        num: 33,
        category: "Physical",
        name: "Tackle",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    tailglow: {
        boosts: {"spa":2},
        isNonstandard: null,
        num: 294,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Tail Glow",
        pp: 20,
        priority: 0,
        flags: {"snatch":1},
        secondary: null,
        target: "self",
        type: "Bug",
        zMove: {"effect":"clearnegativeboost"},
        contestType: "Beautiful"
    },
    tailslap: {
        num: 541,
        accuracy: 85,
        basePower: 25,
        category: "Physical",
        name: "Tail Slap",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":140},
        maxMove: {"basePower":130},
        contestType: "Cute"
    },
    tailwhip: {
        num: 39,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Tail Whip",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        boosts: {"def":-1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Cute"
    },
    tailwind: {
        condition: {
			duration: 3,
			durationCallback(target, source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
                    return 5;
                }
                return 3;
            },
			onSideStart(side, source) {
                if (source?.hasAbility('persistent')) {
                    this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
                }
                else {
                    this.add('-sidestart', side, 'move: Tailwind');
                }
            },
			onModifySpe(spe) {
                return spe * 2;
            },
			onSideResidualOrder: 5,
			onSideEnd(side) {
                this.add('-sideend', side, 'move: Tailwind');
            } 
		},
        pp: 30,
        num: 366,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Tailwind",
        priority: 0,
        flags: {"snatch":1,"wind":1},
        sideCondition: "tailwind",
        secondary: null,
        target: "allySide",
        type: "Flying",
        zMove: {"effect":"crit2"},
        contestType: "Cool"
    },
    takedown: {
        num: 36,
        accuracy: 85,
        basePower: 90,
        category: "Physical",
        name: "Take Down",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [1,4],
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    takeheart: {
        num: 850,
        accuracy: true,
        basePower: 0,
        category: "Status",
        isNonstandard: "Past",
        name: "Take Heart",
        pp: 15,
        priority: 0,
        flags: {"snatch":1},
        onHit(pokemon) {
            const success = !!this.boost({ spa: 1, spd: 1 });
            return pokemon.cureStatus() || success;
        },
        secondary: null,
        target: "self",
        type: "Psychic"
    },
    tarshot: {
        num: 749,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Tar Shot",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        volatileStatus: "tarshot",
        condition: {
			onStart(pokemon) {
                this.add('-start', pokemon, 'Tar Shot');
            },
			onEffectivenessPriority: -2,
			onEffectiveness(typeMod, target, type, move) {
                if (move.type !== 'Fire')
                    return;
                if (!target)
                    return;
                if (type !== target.getTypes()[0])
                    return;
                return typeMod + 1;
            } 
		},
        boosts: {"spe":-1},
        secondary: null,
        target: "normal",
        type: "Rock"
    },
    taunt: {
        flags: {"protect":1,"bypasssub":1},
        condition: {
			duration: 2,
			onStart(target) {
                this.add('-start', target, 'move: Taunt');
            },
			onResidualOrder: 10,
			onResidualSubOrder: 15,
			onEnd(target) {
                this.add('-end', target, 'move: Taunt', '[silent]');
            },
			onDisableMove(pokemon) {
                for (const moveSlot of pokemon.moveSlots) {
                    if (this.dex.moves.get(moveSlot.move).category === 'Status') {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            },
			onBeforeMove(attacker, defender, move) {
                if (move.category === 'Status') {
                    this.add('cant', attacker, 'move: Taunt', move);
                    return false;
                }
            } 
		},
        num: 269,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Taunt",
        pp: 20,
        priority: 0,
        volatileStatus: "taunt",
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"atk":1}},
        contestType: "Clever"
    },
    tearfullook: {
        num: 715,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Tearful Look",
        pp: 20,
        priority: 0,
        flags: {"reflectable":1,"mirror":1},
        boosts: {"atk":-1,"spa":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    teatime: {
        num: 752,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Teatime",
        pp: 10,
        priority: 0,
        flags: {"bypasssub":1},
        onHitField(target, source, move) {
            const targets = [];
            for (const pokemon of this.getAllActive()) {
                if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
                    this.add('-miss', source, pokemon);
                }
                else if (this.runEvent('TryHit', pokemon, source, move) && pokemon.getItem().isBerry) {
                    targets.push(pokemon);
                }
            }
            this.add('-fieldactivate', 'move: Teatime');
            if (!targets.length) {
                this.add('-fail', source, 'move: Teatime');
                this.attrLastMove('[still]');
                return this.NOT_FAIL;
            }
            for (const pokemon of targets) {
                pokemon.eatItem(true);
            }
        },
        secondary: null,
        target: "all",
        type: "Normal"
    },
    technoblast: {
        basePower: 85,
        isNonstandard: null,
        num: 546,
        accuracy: 100,
        category: "Special",
        name: "Techno Blast",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            if (pokemon.ignoringItem())
                return;
            move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cool"
    },
    tectonicrage: {
        isNonstandard: null,
        num: 630,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Tectonic Rage",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "groundiumz",
        secondary: null,
        target: "normal",
        type: "Ground",
        contestType: "Cool"
    },
    teeterdance: {
        flags: {"protect":1},
        num: 298,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Teeter Dance",
        pp: 20,
        priority: 0,
        volatileStatus: "confusion",
        secondary: null,
        target: "allAdjacent",
        type: "Normal",
        zMove: {"boost":{"spa":1}},
        contestType: "Cute"
    },
    telekinesis: {
        isNonstandard: null,
        num: 477,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Telekinesis",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"gravity":1,"allyanim":1},
        volatileStatus: "telekinesis",
        onTry(source, target, move) {
            // Additional Gravity check for Z-move variant
            if (this.field.getPseudoWeather('Gravity')) {
                this.attrLastMove('[still]');
                this.add('cant', source, 'move: Gravity', move);
                return null;
            }
        },
        condition: {
			duration: 3,
			onStart(target) {
                if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseSpecies.baseSpecies) ||
                    target.baseSpecies.name === 'Gengar-Mega') {
                    this.add('-immune', target);
                    return null;
                }
                if (target.volatiles['smackdown'] || target.volatiles['ingrain'])
                    return false;
                this.add('-start', target, 'Telekinesis');
            },
			onAccuracyPriority: -1,
			onAccuracy(accuracy, target, source, move) {
                if (move && !move.ohko)
                    return true;
            },
			onImmunity(type) {
                if (type === 'Ground')
                    return false;
            },
			onUpdate(pokemon) {
                if (pokemon.baseSpecies.name === 'Gengar-Mega') {
                    delete pokemon.volatiles['telekinesis'];
                    this.add('-end', pokemon, 'Telekinesis', '[silent]');
                }
            },
			onResidualOrder: 19,
			onEnd(target) {
                this.add('-end', target, 'Telekinesis');
            } 
		},
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spa":1}},
        contestType: "Clever"
    },
    teleport: {
        priority: 0,
        selfSwitch: false,
        onTry: false,
        num: 100,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Teleport",
        pp: 20,
        flags: {},
        secondary: null,
        target: "self",
        type: "Psychic",
        zMove: {"effect":"heal"},
        contestType: "Cool"
    },
    temperflare: {
		num: 915,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) {
				this.debug('doubling Temper Flare BP due to previous move failure');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Temper Flare",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
    terablast: {
        num: 851,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Tera Blast",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"mustpressure":1},
        onModifyType(move, pokemon, target) {
            if (pokemon.terastallized) {
                move.type = pokemon.teraType;
            }
        },
        onModifyMove(move, pokemon) {
            if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
                move.category = 'Physical';
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal"
    },
    terastarstorm: {
		num: 906,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Tera Starstorm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, noassist: 1, failcopycat: 1, failmimic: 1},
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Terapagos-Stellar') {
				move.type = 'Stellar';
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Terapagos-Stellar') {
				move.target = 'allAdjacentFoes';
			}
		},
		noSketch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},
    terrainpulse: {
        num: 805,
        accuracy: 100,
        basePower: 50,
        category: "Special",
        name: "Terrain Pulse",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"pulse":1},
        onModifyType(move, pokemon) {
            if (!pokemon.isGrounded())
                return;
            switch (this.field.terrain) {
                case 'electricterrain':
                    move.type = 'Electric';
                    break;
                case 'grassyterrain':
                    move.type = 'Grass';
                    break;
                case 'mistyterrain':
                    move.type = 'Fairy';
                    break;
                case 'psychicterrain':
                    move.type = 'Psychic';
                    break;
            }
        },
        onModifyMove(move, pokemon) {
            if (this.field.terrain && pokemon.isGrounded()) {
                move.basePower *= 2;
                this.debug('BP doubled in Terrain');
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130}
    },
    thief: {
        onAfterHit() { },
        secondary: {"chance":100},
        basePower: 40,
        pp: 10,
        num: 168,
        accuracy: 100,
        category: "Special",
        name: "Thief",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"failmefirst":1,"noassist":1,"failcopycat":1},
        target: "normal",
        type: "Dark",
        contestType: "Tough"
    },
    thousandarrows: {
        isNonstandard: "Unobtainable",
        num: 614,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Thousand Arrows",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        onEffectiveness(typeMod, target, type, move) {
            if (move.type !== 'Ground')
                return;
            if (!target)
                return; // avoid crashing when called from a chat plugin
            // ignore effectiveness if the target is Flying type and immune to Ground
            if (!target.runImmunity('Ground')) {
                if (target.hasType('Flying'))
                    return 0;
            }
        },
        volatileStatus: "smackdown",
        ignoreImmunity: {"Ground":true},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Ground",
        zMove: {"basePower":180},
        contestType: "Beautiful"
    },
    thousandwaves: {
        isNonstandard: "Unobtainable",
        num: 615,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Thousand Waves",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1},
        onHit(target, source, move) {
            if (source.isActive)
                target.addVolatile('trapped', source, move, 'trapper');
        },
        secondary: null,
        target: "allAdjacentFoes",
        type: "Ground",
        contestType: "Tough"
    },
    thrash: {
        onMoveFail() { },
        onAfterMove(pokemon) {
            if (pokemon.volatiles['lockedmove1'] && pokemon.volatiles['lockedmove1'].duration === 1) {
                pokemon.removeVolatile('lockedmove1');
            }
        },
        basePower: 90,
        pp: 20,
        num: 37,
        accuracy: 100,
        category: "Physical",
        name: "Thrash",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"failinstruct":1},
        self: {"volatileStatus":"lockedmove1"},
        secondary: null,
        target: "randomNormal",
        type: "Normal",
        contestType: "Tough"
    },
    throatchop: {
        num: 675,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Throat Chop",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        condition: {
			duration: 2,
			onStart(target) {
                this.add('-start', target, 'Throat Chop', '[silent]');
            },
			onDisableMove(pokemon) {
                for (const moveSlot of pokemon.moveSlots) {
                    if (this.dex.moves.get(moveSlot.id).flags['sound']) {
                        pokemon.disableMove(moveSlot.id);
                    }
                }
            },
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
                if (!move.isZ && !move.isMax && move.flags['sound']) {
                    this.add('cant', pokemon, 'move: Throat Chop');
                    return false;
                }
            },
			onModifyMove(move, pokemon, target) {
                if (!move.isZ && !move.isMax && move.flags['sound']) {
                    this.add('cant', pokemon, 'move: Throat Chop');
                    return false;
                }
            },
			onResidualOrder: 22,
			onEnd(target) {
                this.add('-end', target, 'Throat Chop', '[silent]');
            } 
		},
        secondary: {"chance":100},
        target: "normal",
        type: "Dark",
        contestType: "Clever"
    },
    thunder: {
        secondary: {"chance":10,"status":"par"},
        basePower: 120,
        num: 87,
        accuracy: 70,
        category: "Special",
        name: "Thunder",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onModifyMove(move, pokemon, target) {
            switch (target?.effectiveWeather()) {
                case 'raindance':
                case 'primordialsea':
                    move.accuracy = true;
                    break;
                case 'sunnyday':
                case 'desolateland':
                    move.accuracy = 50;
                    break;
            }
        },
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    thunderbolt: {
        basePower: 95,
        num: 85,
        accuracy: 100,
        category: "Special",
        name: "Thunderbolt",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    thundercage: {
        num: 819,
        accuracy: 90,
        basePower: 80,
        category: "Special",
        name: "Thunder Cage",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Electric"
    },
    thunderclap: {
		num: 909,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Thunderclap",
		pp: 5,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
    thunderfang: {
        num: 422,
        accuracy: 95,
        basePower: 65,
        category: "Physical",
        name: "Thunder Fang",
        pp: 15,
        priority: 0,
        flags: {"bite":1,"contact":1,"protect":1,"mirror":1},
        secondaries: [{"chance":10,"status":"par"},{"chance":10,"volatileStatus":"flinch"}],
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    thunderouskick: {
        num: 823,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Thunderous Kick",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"def":-1}},
        target: "normal",
        type: "Fighting"
    },
    thunderpunch: {
        num: 9,
        accuracy: 100,
        basePower: 75,
        category: "Special",
        name: "Thunder Punch",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"punch":1},
        secondary: {"chance":10,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    thundershock: {
        num: 84,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Thunder Shock",
        pp: 30,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: {"chance":10,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    thunderwave: {
        accuracy: 100,
        num: 86,
        basePower: 0,
        category: "Status",
        name: "Thunder Wave",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "par",
        ignoreImmunity: false,
        secondary: null,
        target: "normal",
        type: "Electric",
        zMove: {"boost":{"spd":1}},
        contestType: "Cool"
    },
    tickle: {
        flags: {"protect":1,"reflectable":1,"mirror":1,"bypasssub":1},
        num: 321,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Tickle",
        pp: 20,
        priority: 0,
        boosts: {"atk":-1,"def":-1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    tidyup: {
        num: 882,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Tidy Up",
        pp: 10,
        priority: 0,
        flags: {},
        onHit(pokemon) {
            let success = false;
            for (const active of this.getAllActive()) {
                if (active.removeVolatile('substitute'))
                    success = true;
            }
            const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
            const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
            for (const side of sides) {
                for (const sideCondition of removeAll) {
                    if (side.removeSideCondition(sideCondition)) {
                        this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
                        success = true;
                    }
                }
            }
            if (success)
                this.add('-activate', pokemon, 'move: Tidy Up');
            return !!this.boost({ atk: 1, spe: 1 }, pokemon, pokemon, null, false, true) || success;
        },
        secondary: null,
        target: "self",
        type: "Normal"
    },
    topsyturvy: {
        isNonstandard: null,
        num: 576,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Topsy-Turvy",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onHit(target) {
            let success = false;
            let i;
            for (i in target.boosts) {
                if (target.boosts[i] === 0)
                    continue;
                target.boosts[i] = -target.boosts[i];
                success = true;
            }
            if (!success)
                return false;
            this.add('-invertboost', target, '[from] move: Topsy-Turvy');
        },
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"atk":1}},
        contestType: "Clever"
    },
    torchsong: {
        num: 871,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Torch Song",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"sound":1,"bypasssub":1},
        secondary: {"chance":100,"self":{"boosts":{"spa":1}}},
        target: "normal",
        type: "Fire",
        contestType: "Beautiful"
    },
    torment: {
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        num: 259,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Torment",
        pp: 15,
        priority: 0,
        volatileStatus: "torment",
        condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
                if (pokemon.volatiles['dynamax']) {
                    delete pokemon.volatiles['torment'];
                    return false;
                }
                if (effect?.id === 'gmaxmeltdown')
                    this.effectState.duration = 3;
                this.add('-start', pokemon, 'Torment');
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Torment');
            },
			onDisableMove(pokemon) {
                if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle')
                    pokemon.disableMove(pokemon.lastMove.id);
            } 
		},
        secondary: null,
        target: "normal",
        type: "Dark",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    toxic: {
        ignoreImmunity: false,
        accuracy: 85,
        onPrepareHit() { },
        condition: {
			noCopy: true,
			duration: 1,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
                if (move && source === this.effectState.target)
                    return 0;
            },
			onSourceAccuracy(accuracy, target, source, move) {
                if (move && source === this.effectState.target)
                    return true;
            } 
		},
        num: 92,
        basePower: 0,
        category: "Status",
        name: "Toxic",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "tox",
        secondary: null,
        target: "normal",
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    toxicspikes: {
        flags: {},
        condition: {
			onSideStart(side) {
                this.add('-sidestart', side, 'move: Toxic Spikes');
                this.effectState.layers = 1;
            },
			onSideRestart(side) {
                if (this.effectState.layers >= 2)
                    return false;
                this.add('-sidestart', side, 'move: Toxic Spikes');
                this.effectState.layers++;
            },
			onEntryHazard(pokemon) {
                if (!pokemon.isGrounded())
                    return;
                if (pokemon.hasType('Poison')) {
                    this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
                    pokemon.side.removeSideCondition('toxicspikes');
                }
                else if (pokemon.volatiles['substitute'] || pokemon.hasType('Steel')) {
                    return;
                }
                else if (this.effectState.layers >= 2) {
                    pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
                }
                else {
                    pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
                }
            } 
		},
        num: 390,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Toxic Spikes",
        pp: 20,
        priority: 0,
        sideCondition: "toxicspikes",
        secondary: null,
        target: "foeSide",
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    toxicthread: {
        isNonstandard: null,
        num: 672,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Toxic Thread",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "psn",
        boosts: {"spe":-1},
        secondary: null,
        target: "normal",
        type: "Poison",
        zMove: {"boost":{"spe":1}},
        contestType: "Tough"
    },
    trailblaze: {
        num: 885,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Trailblaze",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"self":{"boosts":{"spe":1}}},
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    transform: {
        noSketch: true,
        flags: {"bypasssub":1,"failencore":1},
        num: 144,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Transform",
        pp: 10,
        priority: 0,
        onHit(target, pokemon) {
            if (!pokemon.transformInto(target)) {
                return false;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"effect":"heal"},
        contestType: "Clever"
    },
    triattack: {
        onHit() { },
        secondary: null,
        num: 161,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Tri Attack",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        target: "normal",
        type: "Normal",
        contestType: "Beautiful"
    },
    trick: {
        onTryHit(target, source, move) {
            if (target.hasAbility('multitype') || source.hasAbility('multitype'))
                return false;
        },
        onHit(target, source, move) {
            const yourItem = target.takeItem(source);
            const myItem = source.takeItem();
            if (target.item || source.item || (!yourItem && !myItem)) {
                if (yourItem)
                    target.item = yourItem.id;
                if (myItem)
                    source.item = myItem.id;
                return false;
            }
            if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
                (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))) {
                if (yourItem)
                    target.item = yourItem.id;
                if (myItem)
                    source.item = myItem.id;
                return false;
            }
            this.add('-activate', source, 'move: Trick', '[of] ' + target);
            if (myItem) {
                target.setItem(myItem);
                this.add('-item', target, myItem, '[from] move: Trick');
            }
            else {
                this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
            }
            if (yourItem) {
                source.setItem(yourItem);
                this.add('-item', source, yourItem, '[from] move: Trick');
            }
            else {
                this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
            }
        },
        num: 271,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Trick",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"allyanim":1,"noassist":1,"failcopycat":1},
        onTryImmunity(target) {
            return !target.hasAbility('stickyhold');
        },
        secondary: null,
        target: "normal",
        type: "Psychic",
        zMove: {"boost":{"spe":2}},
        contestType: "Clever"
    },
    trickortreat: {
        isNonstandard: null,
        num: 567,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Trick-or-Treat",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onHit(target) {
            if (target.hasType('Ghost'))
                return false;
            if (!target.addType('Ghost'))
                return false;
            this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');
            if (target.side.active.length === 2 && target.position === 1) {
                // Curse Glitch
                const action = this.queue.willMove(target);
                if (action && action.move.id === 'curse') {
                    action.targetLoc = -1;
                }
            }
        },
        secondary: null,
        target: "normal",
        type: "Ghost",
        zMove: {"boost":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},
        contestType: "Cute"
    },
    trickroom: {
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
                    return 7;
                }
                return 5;
            },
			onFieldStart(target, source) {
                if (source?.hasAbility('persistent')) {
                    this.add('-fieldstart', 'move: Trick Room', '[of] ' + source, '[persistent]');
                }
                else {
                    this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
                }
            },
			onFieldRestart(target, source) {
                this.field.removePseudoWeather('trickroom');
            },
			onFieldResidualOrder: 13,
			onFieldEnd() {
                this.add('-fieldend', 'move: Trick Room');
            } 
		},
        num: 433,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Trick Room",
        pp: 5,
        priority: -7,
        flags: {"mirror":1},
        pseudoWeather: "trickroom",
        secondary: null,
        target: "all",
        type: "Psychic",
        zMove: {"boost":{"accuracy":1}},
        contestType: "Clever"
    },
    triplearrows: {
        num: 843,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Triple Arrows",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        critRatio: 2,
        secondaries: [{"chance":50,"boosts":{"def":-1}},{"chance":30,"volatileStatus":"flinch"}],
        target: "normal",
        type: "Fighting"
    },
    tripleaxel: {
        num: 813,
        accuracy: 90,
        basePower: 20,
        basePowerCallback(pokemon, target, move) {
            return 20 * move.hit;
        },
        category: "Physical",
        name: "Triple Axel",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 3,
        multiaccuracy: true,
        secondary: null,
        target: "normal",
        type: "Ice",
        zMove: {"basePower":120},
        maxMove: {"basePower":140}
    },
    tripledive: {
        num: 865,
        accuracy: 95,
        basePower: 30,
        category: "Physical",
        name: "Triple Dive",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        multihit: 3,
        secondary: null,
        target: "normal",
        type: "Water"
    },
    triplekick: {
        multiaccuracy: false,
        multihit: [1,3],
        isNonstandard: null,
        num: 167,
        accuracy: 90,
        basePower: 10,
        basePowerCallback(pokemon, target, move) {
            return 10 * move.hit;
        },
        category: "Physical",
        name: "Triple Kick",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        zMove: {"basePower":120},
        maxMove: {"basePower":80},
        contestType: "Cool"
    },
    tropkick: {
        num: 688,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "Trop Kick",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"boosts":{"atk":-1}},
        target: "normal",
        type: "Grass",
        contestType: "Cute"
    },
    trumpcard: {
        isNonstandard: null,
        num: 376,
        accuracy: true,
        basePower: 0,
        basePowerCallback(source, target, move) {
            const callerMoveId = move.sourceEffect || move.id;
            const moveSlot = callerMoveId === 'instruct' ? source.getMoveData(move.id) : source.getMoveData(callerMoveId);
            let bp;
            if (!moveSlot) {
                bp = 40;
            }
            else {
                switch (moveSlot.pp) {
                    case 0:
                        bp = 200;
                        break;
                    case 1:
                        bp = 80;
                        break;
                    case 2:
                        bp = 60;
                        break;
                    case 3:
                        bp = 50;
                        break;
                    default:
                        bp = 40;
                        break;
                }
            }
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Trump Card",
        pp: 5,
        noPPBoosts: true,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Cool"
    },
    twinbeam: {
        num: 888,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Twin Beam",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Psychic",
        contestType: "Cool"
    },
    twineedle: {
        isNonstandard: null,
        num: 41,
        accuracy: 100,
        basePower: 25,
        category: "Physical",
        name: "Twineedle",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        multihit: 2,
        secondary: {"chance":20,"status":"psn"},
        target: "normal",
        type: "Bug",
        maxMove: {"basePower":100},
        contestType: "Cool"
    },
    twinkletackle: {
        isNonstandard: null,
        num: 656,
        accuracy: true,
        basePower: 1,
        category: "Physical",
        name: "Twinkle Tackle",
        pp: 1,
        priority: 0,
        flags: {},
        isZ: "fairiumz",
        secondary: null,
        target: "normal",
        type: "Fairy",
        contestType: "Cool"
    },
    twister: {
        num: 239,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Twister",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        secondary: {"chance":20,"volatileStatus":"flinch"},
        target: "allAdjacentFoes",
        type: "Dragon",
        contestType: "Cool"
    },
    uturn: {
        num: 369,
        accuracy: 100,
        basePower: 70,
        category: "Physical",
        name: "U-turn",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        selfSwitch: true,
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cute"
    },
    upperhand: {
		num: 918,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Upper Hand",
		pp: 15,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(target, pokemon) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || move.priority <= 0.1 || move.category === 'Status') {
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Fighting",
	},
    uproar: {
        condition: {
			onStart(target) {
                this.add('-start', target, 'Uproar');
                // 2-5 turns
                this.effectState.duration = this.random(2, 6);
            },
			onResidual(target) {
                if (target.volatiles['throatchop']) {
                    target.removeVolatile('uproar');
                    return;
                }
                if (target.lastMove && target.lastMove.id === 'struggle') {
                    // don't lock
                    delete target.volatiles['uproar'];
                }
                this.add('-start', target, 'Uproar', '[upkeep]');
            },
			onResidualOrder: 10,
			onResidualSubOrder: 11,
			onEnd(target) {
                this.add('-end', target, 'Uproar');
            },
			onLockMove: "uproar",
			onAnySetStatus(status, pokemon) {
                if (status.id === 'slp') {
                    if (pokemon === this.effectState.target) {
                        this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
                    }
                    else {
                        this.add('-fail', pokemon, 'slp', '[from] Uproar');
                    }
                    return null;
                }
            } 
		},
        basePower: 50,
        flags: {"protect":1,"mirror":1,"sound":1,"nosleeptalk":1},
        num: 253,
        accuracy: 100,
        category: "Physical",
        name: "Uproar",
        pp: 10,
        priority: 0,
        self: {"volatileStatus":"uproar"},
        onTryHit(target) {
            const activeTeam = target.side.activeTeam();
            const foeActiveTeam = target.side.foe.activeTeam();
            for (const [i, allyActive] of activeTeam.entries()) {
                if (allyActive && allyActive.status === 'slp')
                    allyActive.cureStatus();
                const foeActive = foeActiveTeam[i];
                if (foeActive && foeActive.status === 'slp')
                    foeActive.cureStatus();
            }
        },
        secondary: null,
        target: "randomNormal",
        type: "Normal",
        contestType: "Cute"
    },
    vacuumwave: {
        num: 410,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Vacuum Wave",
        pp: 30,
        priority: 1,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    vcreate: {
        num: 557,
        accuracy: 95,
        basePower: 180,
        category: "Physical",
        name: "V-create",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        self: {"boosts":{"spe":-1,"def":-1,"spd":-1}},
        secondary: null,
        target: "normal",
        type: "Fire",
        zMove: {"basePower":220},
        contestType: "Cool"
    },
    veeveevolley: {
        num: 741,
        accuracy: true,
        basePower: 0,
        basePowerCallback(pokemon) {
            const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Physical",
        isNonstandard: "LGPE",
        name: "Veevee Volley",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Cute"
    },
    venomdrench: {
        isNonstandard: null,
        num: 599,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Venom Drench",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        onHit(target, source, move) {
            if (target.status === 'psn' || target.status === 'tox') {
                return !!this.boost({ atk: -1, spa: -1, spe: -1 }, target, source, move);
            }
            return false;
        },
        secondary: null,
        target: "allAdjacentFoes",
        type: "Poison",
        zMove: {"boost":{"def":1}},
        contestType: "Clever"
    },
    venoshock: {
        num: 474,
        accuracy: 100,
        basePower: 65,
        category: "Special",
        name: "Venoshock",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        onBasePower(basePower, pokemon, target) {
            if (target.status === 'psn' || target.status === 'tox') {
                return this.chainModify(2);
            }
        },
        secondary: null,
        target: "normal",
        type: "Poison",
        contestType: "Beautiful"
    },
    victorydance: {
        num: 837,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Victory Dance",
        pp: 10,
        priority: 0,
        flags: {"snatch":1,"dance":1},
        boosts: {"atk":1,"def":1,"spe":1},
        secondary: null,
        target: "self",
        type: "Fighting"
    },
    vinewhip: {
        pp: 10,
        basePower: 35,
        num: 22,
        accuracy: 100,
        category: "Special",
        name: "Vine Whip",
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Cool"
    },
    visegrip: {
        num: 11,
        accuracy: 100,
        basePower: 55,
        category: "Physical",
        name: "Vise Grip",
        pp: 30,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    vitalthrow: {
        isNonstandard: null,
        num: 233,
        accuracy: true,
        basePower: 70,
        category: "Physical",
        name: "Vital Throw",
        pp: 10,
        priority: -1,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Cool"
    },
    voltswitch: {
        num: 521,
        accuracy: 100,
        basePower: 70,
        category: "Special",
        name: "Volt Switch",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        selfSwitch: true,
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    volttackle: {
        secondary: null,
        recoil: [1,3],
        num: 344,
        accuracy: 100,
        basePower: 120,
        category: "Special",
        name: "Volt Tackle",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    wakeupslap: {
        basePower: 60,
        isNonstandard: null,
        num: 358,
        accuracy: 100,
        basePowerCallback(pokemon, target, move) {
            if (target.status === 'slp' || target.hasAbility('comatose')) {
                this.debug('BP doubled on sleeping target');
                return move.basePower * 2;
            }
            return move.basePower;
        },
        category: "Physical",
        name: "Wake-Up Slap",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        onHit(target) {
            if (target.status === 'slp')
                target.cureStatus();
        },
        secondary: null,
        target: "normal",
        type: "Fighting",
        contestType: "Tough"
    },
    waterfall: {
        secondary: null,
        num: 127,
        accuracy: 100,
        basePower: 80,
        category: "Special",
        name: "Waterfall",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Water",
        contestType: "Tough"
    },
    watergun: {
        num: 55,
        accuracy: 100,
        basePower: 40,
        category: "Special",
        name: "Water Gun",
        pp: 25,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cute"
    },
    waterpledge: {
        basePower: 50,
        basePowerCallback(target, source, move) {
            if (['firepledge', 'grasspledge'].includes(move.sourceEffect)) {
                this.add('-combine');
                return 150;
            }
            return 50;
        },
        num: 518,
        accuracy: 100,
        category: "Special",
        name: "Water Pledge",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"nonsky":1,"pledgecombo":1},
        onPrepareHit(target, source, move) {
            for (const action of this.queue) {
                if (action.choice !== 'move')
                    continue;
                const otherMove = action.move;
                const otherMoveUser = action.pokemon;
                if (!otherMove || !action.pokemon || !otherMoveUser.isActive ||
                    otherMoveUser.fainted || action.maxMove || action.zmove) {
                    continue;
                }
                if (otherMoveUser.isAlly(source) && ['firepledge', 'grasspledge'].includes(otherMove.id)) {
                    this.queue.prioritizeAction(action, move);
                    this.add('-waiting', source, otherMoveUser);
                    return null;
                }
            }
        },
        onModifyMove(move) {
            if (move.sourceEffect === 'grasspledge') {
                move.type = 'Grass';
                move.forceSTAB = true;
                move.sideCondition = 'grasspledge';
            }
            if (move.sourceEffect === 'firepledge') {
                move.type = 'Water';
                move.forceSTAB = true;
                move.self = { sideCondition: 'waterpledge' };
            }
        },
        condition: {
			duration: 4,
			onSideStart(targetSide) {
                this.add('-sidestart', targetSide, 'Water Pledge');
            },
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 7,
			onSideEnd(targetSide) {
                this.add('-sideend', targetSide, 'Water Pledge');
            },
			onModifyMove(move, pokemon) {
                if (move.secondaries && move.id !== 'secretpower') {
                    this.debug('doubling secondary chance');
                    for (const secondary of move.secondaries) {
                        if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch')
                            continue;
                        if (secondary.chance)
                            secondary.chance *= 2;
                    }
                    if (move.self?.chance)
                        move.self.chance *= 2;
                }
            } 
		},
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    waterpulse: {
        num: 352,
        accuracy: 100,
        basePower: 60,
        category: "Special",
        name: "Water Pulse",
        pp: 20,
        priority: 0,
        flags: {"protect":1,"pulse":1,"mirror":1,"distance":1},
        secondary: {"chance":20,"volatileStatus":"confusion"},
        target: "any",
        type: "Water",
        contestType: "Beautiful"
    },
    watershuriken: {
        category: "Special",
        num: 594,
        accuracy: 100,
        basePower: 15,
        basePowerCallback(pokemon, target, move) {
            if (pokemon.species.name === 'Greninja-Ash' && pokemon.hasAbility('battlebond') &&
                !pokemon.transformed) {
                return move.basePower + 5;
            }
            return move.basePower;
        },
        name: "Water Shuriken",
        pp: 20,
        priority: 1,
        flags: {"protect":1,"mirror":1},
        multihit: [2,5],
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Cool"
    },
    watersport: {
        condition: {
			noCopy: true,
			onStart(pokemon) {
                this.add('-start', pokemon, 'move: Water Sport');
            },
			onBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
                if (move.type === 'Fire')
                    return this.chainModify(0.5);
            } 
		},
        num: 346,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Water Sport",
        pp: 15,
        priority: 0,
        flags: {},
        volatileStatus: "watersport",
        onTryHitField(target, source) {
            if (source.volatiles['watersport'])
                return false;
        },
        secondary: null,
        target: "all",
        type: "Water"
    },
    waterspout: {
        num: 323,
        accuracy: 100,
        basePower: 150,
        basePowerCallback(pokemon, target, move) {
            const bp = move.basePower * pokemon.hp / pokemon.maxhp;
            this.debug('BP: ' + bp);
            return bp;
        },
        category: "Special",
        name: "Water Spout",
        pp: 5,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        secondary: null,
        target: "allAdjacentFoes",
        type: "Water",
        contestType: "Beautiful"
    },
    wavecrash: {
        num: 834,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Wave Crash",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [33,100],
        secondary: null,
        target: "normal",
        type: "Water"
    },
    weatherball: {
        onModifyMove(move) {
            switch (this.field.effectiveWeather()) {
                case 'sunnyday':
                    move.type = 'Fire';
                    move.category = 'Special';
                    break;
                case 'raindance':
                    move.type = 'Water';
                    move.category = 'Special';
                    break;
                case 'sandstorm':
                    move.type = 'Rock';
                    break;
                case 'hail':
                    move.type = 'Ice';
                    move.category = 'Special';
                    break;
            }
            if (this.field.effectiveWeather())
                move.basePower *= 2;
        },
        num: 311,
        accuracy: 100,
        basePower: 50,
        category: "Physical",
        name: "Weather Ball",
        pp: 10,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        onModifyType(move, pokemon) {
            switch (pokemon.effectiveWeather()) {
                case 'sunnyday':
                case 'desolateland':
                    move.type = 'Fire';
                    break;
                case 'raindance':
                case 'primordialsea':
                    move.type = 'Water';
                    break;
                case 'sandstorm':
                    move.type = 'Rock';
                    break;
                case 'hail':
                case 'snow':
                    move.type = 'Ice';
                    break;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":160},
        maxMove: {"basePower":130},
        contestType: "Beautiful"
    },
    whirlpool: {
        accuracy: 70,
        basePower: 15,
        num: 250,
        category: "Special",
        name: "Whirlpool",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"mirror":1},
        volatileStatus: "partiallytrapped",
        secondary: null,
        target: "normal",
        type: "Water",
        contestType: "Beautiful"
    },
    whirlwind: {
        accuracy: 85,
        forceSwitch: false,
        onTryHit() { },
        priority: 0,
        flags: {"protect":1,"mirror":1,"bypasssub":1},
        num: 18,
        basePower: 0,
        category: "Status",
        name: "Whirlwind",
        pp: 20,
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    wickedblow: {
        basePower: 80,
        num: 817,
        accuracy: 100,
        category: "Physical",
        name: "Wicked Blow",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"punch":1,"mirror":1},
        willCrit: true,
        secondary: null,
        target: "normal",
        type: "Dark"
    },
    wickedtorque: {
        num: 897,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        isNonstandard: "Unobtainable",
        name: "Wicked Torque",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"failencore":1,"failmefirst":1,"nosleeptalk":1,"noassist":1,"failcopycat":1,"failinstruct":1,"failmimic":1},
        secondary: {"chance":10,"status":"slp"},
        target: "normal",
        type: "Dark"
    },
    wideguard: {
        stallingMove: true,
        onTry(source) {
            return this.queue.willAct() && this.runEvent('StallMove', source);
        },
        onHitSide(side, source) {
            source.addVolatile('stall');
        },
        condition: {
			duration: 1,
			onSideStart(target, source) {
                this.add('-singleturn', source, 'Wide Guard');
            },
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
                // Wide Guard blocks damaging spread moves
                if (effect &&
                    (effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes'))) {
                    return;
                }
                this.add('-activate', target, 'move: Wide Guard');
                const lockedmove = source.getVolatile('lockedmove');
                if (lockedmove) {
                    // Outrage counter is reset
                    if (source.volatiles['lockedmove'].duration === 2) {
                        delete source.volatiles['lockedmove'];
                    }
                }
                return null;
            } 
		},
        num: 469,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Wide Guard",
        pp: 10,
        priority: 3,
        flags: {"snatch":1},
        sideCondition: "wideguard",
        secondary: null,
        target: "allySide",
        type: "Rock",
        zMove: {"boost":{"def":1}},
        contestType: "Tough"
    },
    wildboltstorm: {
        num: 847,
        accuracy: 80,
        basePower: 100,
        category: "Special",
        name: "Wildbolt Storm",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"mirror":1,"wind":1},
        onModifyMove(move, pokemon, target) {
            if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
                move.accuracy = true;
            }
        },
        secondary: {"chance":20,"status":"par"},
        target: "allAdjacentFoes",
        type: "Electric"
    },
    wildcharge: {
        num: 528,
        accuracy: 100,
        basePower: 90,
        category: "Physical",
        name: "Wild Charge",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        recoil: [1,4],
        secondary: null,
        target: "normal",
        type: "Electric",
        contestType: "Tough"
    },
    willowisp: {
        accuracy: 75,
        num: 261,
        basePower: 0,
        category: "Status",
        name: "Will-O-Wisp",
        pp: 15,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        status: "brn",
        secondary: null,
        target: "normal",
        type: "Fire",
        zMove: {"boost":{"atk":1}},
        contestType: "Beautiful"
    },
    wingattack: {
        basePower: 35,
        num: 17,
        accuracy: 100,
        category: "Physical",
        name: "Wing Attack",
        pp: 35,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"distance":1},
        secondary: null,
        target: "any",
        type: "Flying",
        contestType: "Cool"
    },
    wish: {
        flags: {"heal":1},
        slotCondition: "Wish",
        condition: {
			duration: 2,
			onResidualOrder: 7,
			onEnd(target) {
                if (!target.fainted) {
                    const source = this.effectState.source;
                    const damage = this.heal(target.baseMaxhp / 2, target, target);
                    if (damage)
                        this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + source.name);
                }
            } 
		},
        num: 273,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Wish",
        pp: 10,
        priority: 0,
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"spd":1}},
        contestType: "Cute"
    },
    withdraw: {
        num: 110,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Withdraw",
        pp: 40,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"def":1},
        secondary: null,
        target: "self",
        type: "Water",
        zMove: {"boost":{"def":1}},
        contestType: "Cute"
    },
    wonderroom: {
        priority: -7,
        num: 472,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Wonder Room",
        pp: 10,
        flags: {"mirror":1},
        pseudoWeather: "wonderroom",
        condition: {
			duration: 5,
			durationCallback(source, effect) {
                if (source?.hasAbility('persistent')) {
                    this.add('-activate', source, 'ability: Persistent', '[move] Wonder Room');
                    return 7;
                }
                return 5;
            },
			onModifyMove(move, source, target) {
                // This code is for moves that use defensive stats as the attacking stat; see below for most of the implementation
                if (!move.overrideOffensiveStat)
                    return;
                const statAndBoosts = move.overrideOffensiveStat;
                if (!['def', 'spd'].includes(statAndBoosts))
                    return;
                move.overrideOffensiveStat = statAndBoosts === 'def' ? 'spd' : 'def';
                this.hint(`${move.name} uses ${statAndBoosts === 'def' ? '' : 'Sp. '}Def boosts when Wonder Room is active.`);
            },
			onFieldStart(field, source) {
                if (source?.hasAbility('persistent')) {
                    this.add('-fieldstart', 'move: Wonder Room', '[of] ' + source, '[persistent]');
                }
                else {
                    this.add('-fieldstart', 'move: Wonder Room', '[of] ' + source);
                }
            },
			onFieldRestart(target, source) {
                this.field.removePseudoWeather('wonderroom');
            },
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 5,
			onFieldEnd() {
                this.add('-fieldend', 'move: Wonder Room');
            } 
		},
        secondary: null,
        target: "all",
        type: "Psychic",
        zMove: {"boost":{"spd":1}},
        contestType: "Clever"
    },
    woodhammer: {
        recoil: [1,3],
        num: 452,
        accuracy: 100,
        basePower: 120,
        category: "Physical",
        name: "Wood Hammer",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Grass",
        contestType: "Tough"
    },
    workup: {
        num: 526,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Work Up",
        pp: 30,
        priority: 0,
        flags: {"snatch":1},
        boosts: {"atk":1,"spa":1},
        secondary: null,
        target: "self",
        type: "Normal",
        zMove: {"boost":{"atk":1}},
        contestType: "Tough"
    },
    worryseed: {
        onTryHit(pokemon) {
            const bannedAbilities = ['multitype', 'truant'];
            if (bannedAbilities.includes(pokemon.ability) || pokemon.hasItem('griseousorb')) {
                return false;
            }
        },
        num: 388,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        name: "Worry Seed",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1,"allyanim":1},
        onTryImmunity(target) {
            // Truant and Insomnia have special treatment; they fail before
            // checking accuracy and will double Stomping Tantrum's BP
            if (target.ability === 'truant' || target.ability === 'insomnia') {
                return false;
            }
        },
        onHit(pokemon) {
            const oldAbility = pokemon.setAbility('insomnia');
            if (oldAbility) {
                this.add('-ability', pokemon, 'Insomnia', '[from] move: Worry Seed');
                if (pokemon.status === 'slp') {
                    pokemon.cureStatus();
                }
                return;
            }
            return oldAbility;
        },
        secondary: null,
        target: "normal",
        type: "Grass",
        zMove: {"boost":{"spe":1}},
        contestType: "Clever"
    },
    wrap: {
        accuracy: 85,
        ignoreImmunity: true,
        volatileStatus: "partiallytrapped1",
        self: {"volatileStatus":"partialtrappinglock"},
        onHit(target, source) {
            /**
             * The duration of the partially trapped must be always renewed to 2
             * so target doesn't move on trapper switch out as happens in gen 1.
             * However, this won't happen if there's no switch and the trapper is
             * about to end its partial trapping.
             **/
            if (target.volatiles['partiallytrapped1']) {
                if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
                    target.volatiles['partiallytrapped1'].duration = 2;
                }
            }
        },
        num: 35,
        basePower: 15,
        category: "Physical",
        name: "Wrap",
        pp: 20,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough"
    },
    wringout: {
        basePowerCallback(pokemon, target) {
            const bp = Math.floor(target.hp * 120 / target.maxhp) + 1;
            this.debug('BP for ' + target.hp + '/' + target.maxhp + " HP: " + bp);
            return bp;
        },
        isNonstandard: null,
        num: 378,
        accuracy: 100,
        basePower: 0,
        category: "Special",
        name: "Wring Out",
        pp: 5,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"basePower":190},
        maxMove: {"basePower":140},
        contestType: "Tough"
    },
    xscissor: {
        num: 404,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "X-Scissor",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1,"slicing":1},
        secondary: null,
        target: "normal",
        type: "Bug",
        contestType: "Cool"
    },
    yawn: {
        condition: {
			noCopy: true,
			duration: 2,
			onStart(target, source) {
                this.add('-start', target, 'move: Yawn', '[of] ' + source);
            },
			onResidualOrder: 10,
			onResidualSubOrder: 19,
			onEnd(target) {
                this.add('-end', target, 'move: Yawn', '[silent]');
                target.trySetStatus('slp', this.effectState.source);
            } 
		},
        num: 281,
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Yawn",
        pp: 10,
        priority: 0,
        flags: {"protect":1,"reflectable":1,"mirror":1},
        volatileStatus: "yawn",
        onTryHit(target) {
            if (target.status || !target.runStatusImmunity('slp')) {
                return false;
            }
        },
        secondary: null,
        target: "normal",
        type: "Normal",
        zMove: {"boost":{"spe":1}},
        contestType: "Cute"
    },
    zapcannon: {
        basePower: 100,
        num: 192,
        accuracy: 50,
        category: "Special",
        name: "Zap Cannon",
        pp: 5,
        priority: 0,
        flags: {"bullet":1,"protect":1,"mirror":1},
        secondary: {"chance":100,"status":"par"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    zenheadbutt: {
        num: 428,
        accuracy: 90,
        basePower: 80,
        category: "Physical",
        name: "Zen Headbutt",
        pp: 15,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":20,"volatileStatus":"flinch"},
        target: "normal",
        type: "Psychic",
        contestType: "Clever"
    },
    zingzap: {
        num: 716,
        accuracy: 100,
        basePower: 80,
        category: "Physical",
        name: "Zing Zap",
        pp: 10,
        priority: 0,
        flags: {"contact":1,"protect":1,"mirror":1},
        secondary: {"chance":30,"volatileStatus":"flinch"},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
    zippyzap: {
        basePower: 50,
        pp: 15,
        willCrit: true,
        secondary: null,
        num: 729,
        accuracy: 100,
        category: "Physical",
        isNonstandard: "LGPE",
        name: "Zippy Zap",
        priority: 2,
        flags: {"contact":1,"protect":1,"mirror":1},
        target: "normal",
        type: "Electric",
        contestType: "Cool"
    },
}