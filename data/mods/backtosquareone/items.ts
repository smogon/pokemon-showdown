export const Items: {[k: string]: ModdedItemData} = {
    abilityshield: {
        name: "Ability Shield",
        spritenum: 0,
        ignoreKlutz: true,
        onSetAbility(ability, target, source, effect) {
            if (effect && effect.effectType === 'Ability' && effect.name !== 'Trace') {
                this.add('-ability', source, effect);
            }
            this.add('-block', target, 'item: Ability Shield');
            return null;
        },
        num: 1881,
        gen: 9
    },
    abomasite: {
        isNonstandard: null,
        name: "Abomasite",
        spritenum: 575,
        megaStone: "Abomasnow-Mega",
        megaEvolves: "Abomasnow",
        itemUser: ["Abomasnow"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 674,
        gen: 6
    },
    absolite: {
        isNonstandard: null,
        name: "Absolite",
        spritenum: 576,
        megaStone: "Absol-Mega",
        megaEvolves: "Absol",
        itemUser: ["Absol"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 677,
        gen: 6
    },
    absorbbulb: {
        name: "Absorb Bulb",
        spritenum: 2,
        fling: {"basePower":30},
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Water') {
                target.useItem();
            }
        },
        boosts: {"spa":1},
        num: 545,
        gen: 5
    },
    adamantcrystal: {
        isNonstandard: "Future",
        name: "Adamant Crystal",
        spritenum: 4,
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if (source?.baseSpecies.num === 483 || pokemon.baseSpecies.num === 483) {
                return false;
            }
            return true;
        },
        forcedForme: "Dialga-Origin",
        itemUser: ["Dialga-Origin"],
        num: 1777,
        gen: 8
    },
    adamantorb: {
        onBasePower(basePower, user, target, move) {
            if (move && user.species.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
                return this.chainModify(1.2);
            }
        },
        name: "Adamant Orb",
        spritenum: 4,
        fling: {"basePower":60},
        onBasePowerPriority: 15,
        itemUser: ["Dialga"],
        num: 135,
        gen: 4
    },
    adrenalineorb: {
        name: "Adrenaline Orb",
        spritenum: 660,
        fling: {"basePower":30},
        onAfterBoost(boost, target, source, effect) {
            // Adrenaline Orb activates if Intimidate is blocked by an ability like Hyper Cutter,
            // which deletes boost.atk,
            // but not if the holder's attack is already at -6 (or +6 if it has Contrary),
            // which sets boost.atk to 0
            if (target.boosts['spe'] === 6 || boost.atk === 0) {
                return;
            }
            if (effect.name === 'Intimidate') {
                target.useItem();
            }
        },
        boosts: {"spe":1},
        num: 846,
        gen: 7
    },
    aerodactylite: {
        isNonstandard: null,
        name: "Aerodactylite",
        spritenum: 577,
        megaStone: "Aerodactyl-Mega",
        megaEvolves: "Aerodactyl",
        itemUser: ["Aerodactyl"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 672,
        gen: 6
    },
    aggronite: {
        isNonstandard: null,
        name: "Aggronite",
        spritenum: 578,
        megaStone: "Aggron-Mega",
        megaEvolves: "Aggron",
        itemUser: ["Aggron"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 667,
        gen: 6
    },
    aguavberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Dragon"},
        onEat(pokemon) {
            this.heal(pokemon.baseMaxhp / 8);
            if (pokemon.getNature().minus === 'spd') {
                pokemon.addVolatile('confusion');
            }
        },
        name: "Aguav Berry",
        spritenum: 5,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 162,
        gen: 3
    },
    airballoon: {
        name: "Air Balloon",
        spritenum: 6,
        fling: {"basePower":10},
        onStart(target) {
            if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
                this.add('-item', target, 'Air Balloon');
            }
        },
        onDamagingHit(damage, target, source, move) {
            this.add('-enditem', target, 'Air Balloon');
            target.item = '';
            target.itemState = { id: '', target };
            this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
        },
        onAfterSubDamage(damage, target, source, effect) {
            this.debug('effect: ' + effect.id);
            if (effect.effectType === 'Move') {
                this.add('-enditem', target, 'Air Balloon');
                target.item = '';
                target.itemState = { id: '', target };
                this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
            }
        },
        num: 541,
        gen: 5
    },
    alakazite: {
        isNonstandard: null,
        name: "Alakazite",
        spritenum: 579,
        megaStone: "Alakazam-Mega",
        megaEvolves: "Alakazam",
        itemUser: ["Alakazam"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 679,
        gen: 6
    },
    aloraichiumz: {
        isNonstandard: null,
        name: "Aloraichium Z",
        spritenum: 655,
        onTakeItem: false,
        zMove: "Stoked Sparksurfer",
        zMoveFrom: "Thunderbolt",
        itemUser: ["Raichu-Alola"],
        num: 803,
        gen: 7
    },
    altarianite: {
        isNonstandard: null,
        name: "Altarianite",
        spritenum: 615,
        megaStone: "Altaria-Mega",
        megaEvolves: "Altaria",
        itemUser: ["Altaria"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 755,
        gen: 6
    },
    ampharosite: {
        isNonstandard: null,
        name: "Ampharosite",
        spritenum: 580,
        megaStone: "Ampharos-Mega",
        megaEvolves: "Ampharos",
        itemUser: ["Ampharos"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 658,
        gen: 6
    },
    apicotberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Ground"},
        name: "Apicot Berry",
        spritenum: 10,
        isBerry: true,
        onEat(pokemon) {
            this.boost({ spd: 1 });
        },
        num: 205,
        gen: 3
    },
    armorfossil: {
        isNonstandard: null,
        name: "Armor Fossil",
        spritenum: 12,
        fling: {"basePower":100},
        num: 104,
        gen: 4
    },
    aspearberry: {
        naturalGift: {"basePower":60,"type":"Ice"},
        name: "Aspear Berry",
        spritenum: 13,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.status === 'frz') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'frz') {
                pokemon.cureStatus();
            }
        },
        num: 153,
        gen: 3
    },
    assaultvest: {
        name: "Assault Vest",
        spritenum: 581,
        fling: {"basePower":80},
        onModifySpDPriority: 1,
        onModifySpD(spd) {
            return this.chainModify(1.5);
        },
        onDisableMove(pokemon) {
            for (const moveSlot of pokemon.moveSlots) {
                if (this.dex.moves.get(moveSlot.move).category === 'Status') {
                    pokemon.disableMove(moveSlot.id);
                }
            }
        },
        num: 640,
        gen: 6
    },
    audinite: {
        isNonstandard: null,
        name: "Audinite",
        spritenum: 617,
        megaStone: "Audino-Mega",
        megaEvolves: "Audino",
        itemUser: ["Audino"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 757,
        gen: 6
    },
    auspiciousarmor: {
        name: "Auspicious Armor",
        spritenum: 0,
        num: 2344,
        gen: 9
    },
    babiriberry: {
        naturalGift: {"basePower":60,"type":"Steel"},
        name: "Babiri Berry",
        spritenum: 17,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 199,
        gen: 4
    },
    banettite: {
        isNonstandard: null,
        name: "Banettite",
        spritenum: 582,
        megaStone: "Banette-Mega",
        megaEvolves: "Banette",
        itemUser: ["Banette"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 668,
        gen: 6
    },
    beastball: {
        name: "Beast Ball",
        spritenum: 661,
        num: 851,
        gen: 7,
        isPokeball: true
    },
    beedrillite: {
        isNonstandard: null,
        name: "Beedrillite",
        spritenum: 628,
        megaStone: "Beedrill-Mega",
        megaEvolves: "Beedrill",
        itemUser: ["Beedrill"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 770,
        gen: 6
    },
    belueberry: {
        naturalGift: {"basePower":80,"type":"Electric"},
        isNonstandard: null,
        name: "Belue Berry",
        spritenum: 21,
        isBerry: true,
        onEat: false,
        num: 183,
        gen: 3
    },
    berryjuice: {
        isNonstandard: null,
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                if (this.runEvent('TryHeal', pokemon) && pokemon.useItem()) {
                    this.heal(20);
                }
            }
        },
        name: "Berry Juice",
        spritenum: 22,
        fling: {"basePower":30},
        num: 43,
        gen: 2
    },
    berrysweet: {
        isNonstandard: null,
        name: "Berry Sweet",
        spritenum: 706,
        fling: {"basePower":10},
        num: 1111,
        gen: 8
    },
    bignugget: {
		name: "Big Nugget",
		spritenum: 27,
		fling: {
			basePower: 130,
		},
		num: 581,
		gen: 5,
	},
    bigroot: {
        onTryHeal(damage, target, source, effect) {
            const heals = ['drain', 'leechseed', 'ingrain', 'aquaring'];
            if (heals.includes(effect.id)) {
                return Math.floor(damage * 1.3);
            }
        },
        name: "Big Root",
        spritenum: 29,
        fling: {"basePower":10},
        onTryHealPriority: 1,
        num: 296,
        gen: 4
    },
    bindingband: {
        name: "Binding Band",
        spritenum: 31,
        fling: {"basePower":30},
        num: 544,
        gen: 5
    },
    blackbelt: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Fighting') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Black Belt",
        spritenum: 32,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 241,
        gen: 2
    },
    blackglasses: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Dark') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Black Glasses",
        spritenum: 35,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 240,
        gen: 2
    },
    blacksludge: {
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        name: "Black Sludge",
        spritenum: 34,
        fling: {"basePower":30},
        onResidual(pokemon) {
            if (pokemon.hasType('Poison')) {
                this.heal(pokemon.baseMaxhp / 16);
            }
            else {
                this.damage(pokemon.baseMaxhp / 8);
            }
        },
        num: 281,
        gen: 4
    },
    blastoisinite: {
        isNonstandard: null,
        name: "Blastoisinite",
        spritenum: 583,
        megaStone: "Blastoise-Mega",
        megaEvolves: "Blastoise",
        itemUser: ["Blastoise"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 661,
        gen: 6
    },
    blazikenite: {
        isNonstandard: null,
        name: "Blazikenite",
        spritenum: 584,
        megaStone: "Blaziken-Mega",
        megaEvolves: "Blaziken",
        itemUser: ["Blaziken"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 664,
        gen: 6
    },
    blueorb: {
        isNonstandard: null,
        name: "Blue Orb",
        spritenum: 41,
        onSwitchIn(pokemon) {
            if (pokemon.isActive && pokemon.baseSpecies.name === 'Kyogre') {
                this.queue.insertChoice({ choice: 'runPrimal', pokemon: pokemon });
            }
        },
        onPrimal(pokemon) {
            pokemon.formeChange('Kyogre-Primal', this.effect, true);
        },
        onTakeItem(item, source) {
            if (source.baseSpecies.baseSpecies === 'Kyogre')
                return false;
            return true;
        },
        itemUser: ["Kyogre"],
        num: 535,
        gen: 6
    },
    blukberry: {
        naturalGift: {"basePower":70,"type":"Fire"},
        isNonstandard: "Unobtainable",
        name: "Bluk Berry",
        spritenum: 44,
        isBerry: true,
        onEat: false,
        num: 165,
        gen: 3
    },
    blunderpolicy: {
        name: "Blunder Policy",
        spritenum: 716,
        fling: {"basePower":80},
        num: 1121,
        gen: 8
    },
    boosterenergy: {
        name: "Booster Energy",
        spritenum: 0,
        onUpdate(pokemon) {
            if (pokemon.transformed)
                return;
            if (this.queue.peek(true)?.choice === 'runSwitch')
                return;
            if (pokemon.hasAbility('protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) {
                pokemon.addVolatile('protosynthesis');
            }
            if (pokemon.hasAbility('quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) {
                pokemon.addVolatile('quarkdrive');
            }
        },
        onTakeItem(item, source) {
            if (source.baseSpecies.tags.includes("Paradox"))
                return false;
            return true;
        },
        num: 1880,
        gen: 9
    },
    bottlecap: {
        name: "Bottle Cap",
        spritenum: 696,
        fling: {"basePower":30},
        num: 795,
        gen: 7
    },
    brightpowder: {
        onModifyAccuracy(accuracy) {
            if (typeof accuracy !== 'number')
                return;
            this.debug('brightpowder - decreasing accuracy');
            return accuracy - 20;
        },
        onModifyAccuracyPriority: 5,
        name: "Bright Powder",
        spritenum: 51,
        fling: {"basePower":10},
        num: 213,
        gen: 2
    },
    buggem: {
        isNonstandard: null,
        name: "Bug Gem",
        spritenum: 53,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Bug' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 558,
        gen: 5
    },
    bugmemory: {
        isNonstandard: null,
        name: "Bug Memory",
        spritenum: 673,
        onMemory: "Bug",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Bug",
        itemUser: ["Silvally-Bug"],
        num: 909,
        gen: 7
    },
    buginiumz: {
        isNonstandard: null,
        name: "Buginium Z",
        spritenum: 642,
        onPlate: "Bug",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Bug",
        forcedForme: "Arceus-Bug",
        num: 787,
        gen: 7
    },
    burndrive: {
        isNonstandard: null,
        name: "Burn Drive",
        spritenum: 54,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
                return false;
            }
            return true;
        },
        onDrive: "Fire",
        forcedForme: "Genesect-Burn",
        itemUser: ["Genesect-Burn"],
        num: 118,
        gen: 5
    },
    cameruptite: {
        isNonstandard: null,
        name: "Cameruptite",
        spritenum: 625,
        megaStone: "Camerupt-Mega",
        megaEvolves: "Camerupt",
        itemUser: ["Camerupt"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 767,
        gen: 6
    },
    cellbattery: {
        name: "Cell Battery",
        spritenum: 60,
        fling: {"basePower":30},
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Electric') {
                target.useItem();
            }
        },
        boosts: {"atk":1},
        num: 546,
        gen: 5
    },
    charcoal: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Fire') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Charcoal",
        spritenum: 61,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 249,
        gen: 2
    },
    charizarditex: {
        isNonstandard: null,
        name: "Charizardite X",
        spritenum: 585,
        megaStone: "Charizard-Mega-X",
        megaEvolves: "Charizard",
        itemUser: ["Charizard"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 660,
        gen: 6
    },
    charizarditey: {
        isNonstandard: null,
        name: "Charizardite Y",
        spritenum: 586,
        megaStone: "Charizard-Mega-Y",
        megaEvolves: "Charizard",
        itemUser: ["Charizard"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 678,
        gen: 6
    },
    chartiberry: {
        naturalGift: {"basePower":60,"type":"Rock"},
        name: "Charti Berry",
        spritenum: 62,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 195,
        gen: 4
    },
    cheriberry: {
        naturalGift: {"basePower":60,"type":"Fire"},
        name: "Cheri Berry",
        spritenum: 63,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.status === 'par') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'par') {
                pokemon.cureStatus();
            }
        },
        num: 149,
        gen: 3
    },
    cherishball: {
        name: "Cherish Ball",
        spritenum: 64,
        num: 16,
        gen: 4,
        isPokeball: true,
        isNonstandard: "Unobtainable"
    },
    chestoberry: {
        naturalGift: {"basePower":60,"type":"Water"},
        name: "Chesto Berry",
        spritenum: 65,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.status === 'slp') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'slp') {
                pokemon.cureStatus();
            }
        },
        num: 150,
        gen: 3
    },
    chilanberry: {
        naturalGift: {"basePower":60,"type":"Normal"},
        name: "Chilan Berry",
        spritenum: 66,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Normal' &&
                (!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))) {
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 200,
        gen: 4
    },
    chilldrive: {
        isNonstandard: null,
        name: "Chill Drive",
        spritenum: 67,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
                return false;
            }
            return true;
        },
        onDrive: "Ice",
        forcedForme: "Genesect-Chill",
        itemUser: ["Genesect-Chill"],
        num: 119,
        gen: 5
    },
    chippedpot: {
        name: "Chipped Pot",
        spritenum: 720,
        fling: {"basePower":80},
        num: 1254,
        gen: 8
    },
    choiceband: {
        onStart() { },
        onModifyMove() { },
        onAfterMove(pokemon) {
            pokemon.addVolatile('choicelock');
        },
        name: "Choice Band",
        spritenum: 68,
        fling: {"basePower":10},
        onModifyAtkPriority: 1,
        onModifyAtk(atk, pokemon) {
            if (pokemon.volatiles['dynamax'])
                return;
            return this.chainModify(1.5);
        },
        isChoice: true,
        num: 220,
        gen: 3
    },
    choicescarf: {
        onStart() { },
        onModifyMove() { },
        onAfterMove(pokemon) {
            pokemon.addVolatile('choicelock');
        },
        name: "Choice Scarf",
        spritenum: 69,
        fling: {"basePower":10},
        onModifySpe(spe, pokemon) {
            if (pokemon.volatiles['dynamax'])
                return;
            return this.chainModify(1.5);
        },
        isChoice: true,
        num: 287,
        gen: 4
    },
    choicespecs: {
        onStart() { },
        onModifyMove() { },
        onAfterMove(pokemon) {
            pokemon.addVolatile('choicelock');
        },
        name: "Choice Specs",
        spritenum: 70,
        fling: {"basePower":10},
        onModifySpAPriority: 1,
        onModifySpA(spa, pokemon) {
            if (pokemon.volatiles['dynamax'])
                return;
            return this.chainModify(1.5);
        },
        isChoice: true,
        num: 297,
        gen: 4
    },
    chopleberry: {
        onSourceModifyDamage(damage, source, target, move) {
            if (move.causedCrashDamage)
                return damage;
            if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        naturalGift: {"basePower":60,"type":"Fighting"},
        name: "Chople Berry",
        spritenum: 71,
        isBerry: true,
        onEat() { },
        num: 189,
        gen: 4
    },
    clawfossil: {
        isNonstandard: null,
        name: "Claw Fossil",
        spritenum: 72,
        fling: {"basePower":100},
        num: 100,
        gen: 3
    },
    clearamulet: {
        name: "Clear Amulet",
        spritenum: 0,
        onTryBoost(boost, target, source, effect) {
            if (source && target === source)
                return;
            let showMsg = false;
            let i;
            for (i in boost) {
                if (boost[i] < 0) {
                    delete boost[i];
                    showMsg = true;
                }
            }
            if (showMsg && !effect.secondaries && effect.id !== 'octolock') {
                this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', '[of] ' + target);
            }
        },
        num: 1882,
        gen: 9
    },
    cloversweet: {
        isNonstandard: null,
        name: "Clover Sweet",
        spritenum: 707,
        fling: {"basePower":10},
        num: 1112,
        gen: 8
    },
    cobaberry: {
        naturalGift: {"basePower":60,"type":"Flying"},
        name: "Coba Berry",
        spritenum: 76,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 192,
        gen: 4
    },
    colburberry: {
        naturalGift: {"basePower":60,"type":"Dark"},
        name: "Colbur Berry",
        spritenum: 78,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 198,
        gen: 4
    },
    cornerstonemask: {
		name: "Cornerstone Mask",
		spritenum: 758,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Cornerstone')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Cornerstone",
		itemUser: ["Ogerpon-Cornerstone"],
		num: 2406,
		gen: 9,
	},
    cornnberry: {
        naturalGift: {"basePower":70,"type":"Bug"},
        isNonstandard: null,
        name: "Cornn Berry",
        spritenum: 81,
        isBerry: true,
        onEat: false,
        num: 175,
        gen: 3
    },
    coverfossil: {
        isNonstandard: null,
        name: "Cover Fossil",
        spritenum: 85,
        fling: {"basePower":100},
        num: 572,
        gen: 5
    },
    covertcloak: {
        name: "Covert Cloak",
        fling: {"basePower":10},
        spritenum: 0,
        onModifySecondaries(secondaries) {
            this.debug('Covert Cloak prevent secondary');
            return secondaries.filter(effect => !!(effect.self || effect.dustproof));
        },
        num: 1885,
        gen: 9
    },
    crackedpot: {
        name: "Cracked Pot",
        spritenum: 719,
        fling: {"basePower":80},
        num: 1253,
        gen: 8
    },
    custapberry: {
        onFractionalPriority() { },
        onBeforeTurn(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.ability === 'gluttony')) {
                const action = this.queue.willMove(pokemon);
                if (!action)
                    return;
                this.queue.insertChoice({
                    choice: 'event',
                    event: 'Custap',
                    priority: action.priority + 0.1,
                    pokemon: action.pokemon,
                    move: action.move,
                    targetLoc: action.targetLoc,
                });
            }
        },
        onCustap(pokemon) {
            const action = this.queue.willMove(pokemon);
            this.debug('custap action: ' + action);
            if (action && pokemon.eatItem()) {
                this.queue.cancelAction(pokemon);
                this.add('-message', "Custap Berry activated.");
                this.runAction(action);
            }
        },
        naturalGift: {"basePower":80,"type":"Ghost"},
        isNonstandard: null,
        name: "Custap Berry",
        spritenum: 86,
        isBerry: true,
        onFractionalPriorityPriority: -2,
        onEat() { },
        num: 210,
        gen: 4
    },
    damprock: {
        name: "Damp Rock",
        spritenum: 88,
        fling: {"basePower":60},
        num: 285,
        gen: 4
    },
    darkgem: {
        isNonstandard: null,
        name: "Dark Gem",
        spritenum: 89,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Dark' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 562,
        gen: 5
    },
    darkmemory: {
        isNonstandard: null,
        name: "Dark Memory",
        spritenum: 683,
        onMemory: "Dark",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Dark",
        itemUser: ["Silvally-Dark"],
        num: 919,
        gen: 7
    },
    darkiniumz: {
        isNonstandard: null,
        name: "Darkinium Z",
        spritenum: 646,
        onPlate: "Dark",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Dark",
        forcedForme: "Arceus-Dark",
        num: 791,
        gen: 7
    },
    dawnstone: {
        name: "Dawn Stone",
        spritenum: 92,
        fling: {"basePower":80},
        num: 109,
        gen: 4
    },
    decidiumz: {
        isNonstandard: null,
        name: "Decidium Z",
        spritenum: 650,
        onTakeItem: false,
        zMove: "Sinister Arrow Raid",
        zMoveFrom: "Spirit Shackle",
        itemUser: ["Decidueye"],
        num: 798,
        gen: 7
    },
    deepseascale: {
        onModifySpD(spd, pokemon) {
            if (pokemon.species.name === 'Clamperl') {
                return this.chainModify(2);
            }
        },
        isNonstandard: null,
        name: "Deep Sea Scale",
        spritenum: 93,
        fling: {"basePower":30},
        onModifySpDPriority: 2,
        itemUser: ["Clamperl"],
        num: 227,
        gen: 3
    },
    deepseatooth: {
        onModifySpA(spa, pokemon) {
            if (pokemon.species.name === 'Clamperl') {
                return this.chainModify(2);
            }
        },
        isNonstandard: null,
        name: "Deep Sea Tooth",
        spritenum: 94,
        fling: {"basePower":90},
        onModifySpAPriority: 1,
        itemUser: ["Clamperl"],
        num: 226,
        gen: 3
    },
    destinyknot: {
        name: "Destiny Knot",
        spritenum: 95,
        fling: {"basePower":10},
        onAttractPriority: -100,
        onAttract(target, source) {
            this.debug('attract intercepted: ' + target + ' from ' + source);
            if (!source || source === target)
                return;
            if (!source.volatiles['attract'])
                source.addVolatile('attract', target);
        },
        num: 280,
        gen: 4
    },
    diancite: {
        isNonstandard: null,
        name: "Diancite",
        spritenum: 624,
        megaStone: "Diancie-Mega",
        megaEvolves: "Diancie",
        itemUser: ["Diancie"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 764,
        gen: 6
    },
    diveball: {
        name: "Dive Ball",
        spritenum: 101,
        num: 7,
        gen: 3,
        isPokeball: true
    },
    domefossil: {
        isNonstandard: null,
        name: "Dome Fossil",
        spritenum: 102,
        fling: {"basePower":100},
        num: 102,
        gen: 3
    },
    dousedrive: {
        isNonstandard: null,
        name: "Douse Drive",
        spritenum: 103,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
                return false;
            }
            return true;
        },
        onDrive: "Water",
        forcedForme: "Genesect-Douse",
        itemUser: ["Genesect-Douse"],
        num: 116,
        gen: 5
    },
    dracoplate: {
        isNonstandard: null,
        name: "Draco Plate",
        spritenum: 105,
        onPlate: "Dragon",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Dragon') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Dragon",
        num: 311,
        gen: 4
    },
    dragonfang: {
        onModifySpA() { },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Dragon Fang",
        spritenum: 106,
        fling: {"basePower":70},
        onBasePowerPriority: 15,
        num: 250,
        gen: 2
    },
    dragongem: {
        isNonstandard: null,
        name: "Dragon Gem",
        spritenum: 107,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Dragon' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 561,
        gen: 5
    },
    dragonmemory: {
        isNonstandard: null,
        name: "Dragon Memory",
        spritenum: 682,
        onMemory: "Dragon",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Dragon",
        itemUser: ["Silvally-Dragon"],
        num: 918,
        gen: 7
    },
    dragonscale: {
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Dragon') {
                return damage * 1.1;
            }
        },
        isNonstandard: null,
        name: "Dragon Scale",
        spritenum: 108,
        fling: {"basePower":30},
        num: 235,
        gen: 2
    },
    dragoniumz: {
        isNonstandard: null,
        name: "Dragonium Z",
        spritenum: 645,
        onPlate: "Dragon",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Dragon",
        forcedForme: "Arceus-Dragon",
        num: 790,
        gen: 7
    },
    dreadplate: {
        isNonstandard: null,
        name: "Dread Plate",
        spritenum: 110,
        onPlate: "Dark",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Dark') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Dark",
        num: 312,
        gen: 4
    },
    dreamball: {
        isNonstandard: "Unobtainable",
        name: "Dream Ball",
        spritenum: 111,
        num: 576,
        gen: 5,
        isPokeball: true
    },
    dubiousdisc: {
        isNonstandard: null,
        name: "Dubious Disc",
        spritenum: 113,
        fling: {"basePower":50},
        num: 324,
        gen: 4
    },
    durinberry: {
        naturalGift: {"basePower":80,"type":"Water"},
        isNonstandard: null,
        name: "Durin Berry",
        spritenum: 114,
        isBerry: true,
        onEat: false,
        num: 182,
        gen: 3
    },
    duskball: {
        name: "Dusk Ball",
        spritenum: 115,
        num: 13,
        gen: 4,
        isPokeball: true
    },
    duskstone: {
        name: "Dusk Stone",
        spritenum: 116,
        fling: {"basePower":80},
        num: 108,
        gen: 4
    },
    earthplate: {
        isNonstandard: null,
        name: "Earth Plate",
        spritenum: 117,
        onPlate: "Ground",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Ground') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Ground",
        num: 305,
        gen: 4
    },
    eeviumz: {
        isNonstandard: null,
        name: "Eevium Z",
        spritenum: 657,
        onTakeItem: false,
        zMove: "Extreme Evoboost",
        zMoveFrom: "Last Resort",
        itemUser: ["Eevee"],
        num: 805,
        gen: 7
    },
    ejectbutton: {
        name: "Eject Button",
        spritenum: 118,
        fling: {"basePower":30},
        onAfterMoveSecondaryPriority: 2,
        onAfterMoveSecondary(target, source, move) {
            if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.flags['futuremove']) {
                if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped())
                    return;
                if (target.volatiles['commanding'] || target.volatiles['commanded'])
                    return;
                for (const pokemon of this.getAllActive()) {
                    if (pokemon.switchFlag === true)
                        return;
                }
                target.switchFlag = true;
                if (target.useItem()) {
                    source.switchFlag = false;
                }
                else {
                    target.switchFlag = false;
                }
            }
        },
        num: 547,
        gen: 5
    },
    ejectpack: {
        name: "Eject Pack",
        spritenum: 714,
        fling: {"basePower":50},
        onAfterBoost(boost, target, source, effect) {
            if (this.activeMove?.id === 'partingshot')
                return;
            let eject = false;
            let i;
            for (i in boost) {
                if (boost[i] < 0) {
                    eject = true;
                }
            }
            if (eject) {
                if (target.hp) {
                    if (!this.canSwitch(target.side))
                        return;
                    if (target.volatiles['commanding'] || target.volatiles['commanded'])
                        return;
                    for (const pokemon of this.getAllActive()) {
                        if (pokemon.switchFlag === true)
                            return;
                    }
                    if (target.useItem())
                        target.switchFlag = true;
                }
            }
        },
        num: 1119,
        gen: 8
    },
    electirizer: {
        isNonstandard: null,
        name: "Electirizer",
        spritenum: 119,
        fling: {"basePower":80},
        num: 322,
        gen: 4
    },
    electricgem: {
        isNonstandard: null,
        name: "Electric Gem",
        spritenum: 120,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status' || move.flags['pledgecombo'])
                return;
            if (move.type === 'Electric' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 550,
        gen: 5
    },
    electricmemory: {
        isNonstandard: null,
        name: "Electric Memory",
        spritenum: 679,
        onMemory: "Electric",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Electric",
        itemUser: ["Silvally-Electric"],
        num: 915,
        gen: 7
    },
    electricseed: {
        name: "Electric Seed",
        spritenum: 664,
        fling: {"basePower":10},
        onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
                pokemon.useItem();
            }
        },
        onTerrainChange(pokemon) {
            if (this.field.isTerrain('electricterrain')) {
                pokemon.useItem();
            }
        },
        boosts: {"def":1},
        num: 881,
        gen: 7
    },
    electriumz: {
        isNonstandard: null,
        name: "Electrium Z",
        spritenum: 634,
        onPlate: "Electric",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Electric",
        forcedForme: "Arceus-Electric",
        num: 779,
        gen: 7
    },
    enigmaberry: {
        name: "Enigma Berry",
        spritenum: 124,
        isBerry: true,
        num: 208,
        gen: 3,
        isNonstandard: "Unobtainable"
    },
    eviolite: {
        name: "Eviolite",
        spritenum: 130,
        fling: {"basePower":40},
        onModifyDefPriority: 2,
        onModifyDef(def, pokemon) {
            if (pokemon.baseSpecies.nfe) {
                return this.chainModify(1.5);
            }
        },
        onModifySpDPriority: 2,
        onModifySpD(spd, pokemon) {
            if (pokemon.baseSpecies.nfe) {
                return this.chainModify(1.5);
            }
        },
        num: 538,
        gen: 5
    },
    expertbelt: {
        name: "Expert Belt",
        spritenum: 132,
        fling: {"basePower":10},
        onModifyDamage(damage, source, target, move) {
            if (move && target.getMoveHitData(move).typeMod > 0) {
                return this.chainModify([4915, 4096]);
            }
        },
        num: 268,
        gen: 4
    },
    fairiumz: {
        isNonstandard: null,
        name: "Fairium Z",
        spritenum: 648,
        onPlate: "Fairy",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Fairy",
        forcedForme: "Arceus-Fairy",
        num: 793,
        gen: 7
    },
    fairyfeather: {
		name: "Fairy Feather",
		spritenum: 754,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 2401,
		gen: 9,
	},
    fairygem: {
        isNonstandard: "Unobtainable",
        name: "Fairy Gem",
        spritenum: 611,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Fairy' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 715,
        gen: 6
    },
    fairymemory: {
        isNonstandard: null,
        name: "Fairy Memory",
        spritenum: 684,
        onMemory: "Fairy",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Fairy",
        itemUser: ["Silvally-Fairy"],
        num: 920,
        gen: 7
    },
    fastball: {
        isNonstandard: null,
        name: "Fast Ball",
        spritenum: 137,
        num: 492,
        gen: 2,
        isPokeball: true
    },
    fightinggem: {
        isNonstandard: null,
        name: "Fighting Gem",
        spritenum: 139,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Fighting' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 553,
        gen: 5
    },
    fightingmemory: {
        isNonstandard: null,
        name: "Fighting Memory",
        spritenum: 668,
        onMemory: "Fighting",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Fighting",
        itemUser: ["Silvally-Fighting"],
        num: 904,
        gen: 7
    },
    fightiniumz: {
        isNonstandard: null,
        name: "Fightinium Z",
        spritenum: 637,
        onPlate: "Fighting",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Fighting",
        forcedForme: "Arceus-Fighting",
        num: 782,
        gen: 7
    },
    figyberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Bug"},
        onEat(pokemon) {
            this.heal(pokemon.baseMaxhp / 8);
            if (pokemon.getNature().minus === 'atk') {
                pokemon.addVolatile('confusion');
            }
        },
        name: "Figy Berry",
        spritenum: 140,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 159,
        gen: 3
    },
    firegem: {
        isNonstandard: null,
        name: "Fire Gem",
        spritenum: 141,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status' || move.flags['pledgecombo'])
                return;
            if (move.type === 'Fire' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 548,
        gen: 5
    },
    firememory: {
        isNonstandard: null,
        name: "Fire Memory",
        spritenum: 676,
        onMemory: "Fire",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Fire",
        itemUser: ["Silvally-Fire"],
        num: 912,
        gen: 7
    },
    firestone: {
        name: "Fire Stone",
        spritenum: 142,
        fling: {"basePower":30},
        num: 82,
        gen: 1
    },
    firiumz: {
        isNonstandard: null,
        name: "Firium Z",
        spritenum: 632,
        onPlate: "Fire",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Fire",
        forcedForme: "Arceus-Fire",
        num: 777,
        gen: 7
    },
    fistplate: {
        isNonstandard: null,
        name: "Fist Plate",
        spritenum: 143,
        onPlate: "Fighting",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Fighting') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Fighting",
        num: 303,
        gen: 4
    },
    flameorb: {
        onResidualOrder: 10,
        onResidualSubOrder: 20,
        name: "Flame Orb",
        spritenum: 145,
        fling: {"basePower":30,"status":"brn"},
        onResidual(pokemon) {
            pokemon.trySetStatus('brn', pokemon);
        },
        num: 273,
        gen: 4
    },
    flameplate: {
        isNonstandard: null,
        name: "Flame Plate",
        spritenum: 146,
        onPlate: "Fire",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Fire') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Fire",
        num: 298,
        gen: 4
    },
    floatstone: {
        name: "Float Stone",
        spritenum: 147,
        fling: {"basePower":30},
        onModifyWeight(weighthg) {
            return this.trunc(weighthg / 2);
        },
        num: 539,
        gen: 5
    },
    flowersweet: {
        isNonstandard: null,
        name: "Flower Sweet",
        spritenum: 708,
        fling: {"basePower":0},
        num: 1113,
        gen: 8
    },
    flyinggem: {
        isNonstandard: null,
        name: "Flying Gem",
        spritenum: 149,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Flying' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 556,
        gen: 5
    },
    flyingmemory: {
        isNonstandard: null,
        name: "Flying Memory",
        spritenum: 669,
        onMemory: "Flying",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Flying",
        itemUser: ["Silvally-Flying"],
        num: 905,
        gen: 7
    },
    flyiniumz: {
        isNonstandard: null,
        name: "Flyinium Z",
        spritenum: 640,
        onPlate: "Flying",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Flying",
        forcedForme: "Arceus-Flying",
        num: 785,
        gen: 7
    },
    focusband: {
        onDamage(damage, target, source, effect) {
            if (this.randomChance(30, 256) && damage >= target.hp && effect && effect.effectType === 'Move') {
                this.add('-activate', target, 'item: Focus Band');
                return target.hp - 1;
            }
        },
        name: "Focus Band",
        spritenum: 150,
        fling: {"basePower":10},
        onDamagePriority: -40,
        num: 230,
        gen: 2
    },
    focussash: {
        onDamage() { },
        onTryHit(target, source, move) {
            if (target !== source && target.hp === target.maxhp) {
                target.addVolatile('focussash');
            }
        },
        condition: {
			duration: 1,
			onDamage(damage, target, source, effect) {
                if (effect && effect.effectType === 'Move' && damage >= target.hp) {
                    this.effectState.activated = true;
                    return target.hp - 1;
                }
            },
			onAfterMoveSecondary(target) {
                if (this.effectState.activated)
                    target.useItem();
                target.removeVolatile('focussash');
            } 
		},
        name: "Focus Sash",
        spritenum: 151,
        fling: {"basePower":10},
        onDamagePriority: -40,
        num: 275,
        gen: 4
    },
    fossilizedbird: {
        isNonstandard: null,
        name: "Fossilized Bird",
        spritenum: 700,
        fling: {"basePower":100},
        num: 1105,
        gen: 8
    },
    fossilizeddino: {
        isNonstandard: null,
        name: "Fossilized Dino",
        spritenum: 703,
        fling: {"basePower":100},
        num: 1108,
        gen: 8
    },
    fossilizeddrake: {
        isNonstandard: null,
        name: "Fossilized Drake",
        spritenum: 702,
        fling: {"basePower":100},
        num: 1107,
        gen: 8
    },
    fossilizedfish: {
        isNonstandard: null,
        name: "Fossilized Fish",
        spritenum: 701,
        fling: {"basePower":100},
        num: 1106,
        gen: 8
    },
    friendball: {
        name: "Friend Ball",
        spritenum: 153,
        num: 497,
        gen: 2,
        isPokeball: true
    },
    fullincense: {
        isNonstandard: null,
        name: "Full Incense",
        spritenum: 155,
        fling: {"basePower":10},
        onFractionalPriority: -0.1,
        num: 316,
        gen: 4
    },
    galaricacuff: {
        isNonstandard: null,
        name: "Galarica Cuff",
        spritenum: 739,
        fling: {"basePower":30},
        num: 1582,
        gen: 8
    },
    galaricawreath: {
        isNonstandard: null,
        name: "Galarica Wreath",
        spritenum: 740,
        fling: {"basePower":30},
        num: 1592,
        gen: 8
    },
    galladite: {
        isNonstandard: null,
        name: "Galladite",
        spritenum: 616,
        megaStone: "Gallade-Mega",
        megaEvolves: "Gallade",
        itemUser: ["Gallade"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 756,
        gen: 6
    },
    ganlonberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Ice"},
        name: "Ganlon Berry",
        spritenum: 158,
        isBerry: true,
        onEat(pokemon) {
            this.boost({ def: 1 });
        },
        num: 202,
        gen: 3
    },
    garchompite: {
        isNonstandard: null,
        name: "Garchompite",
        spritenum: 589,
        megaStone: "Garchomp-Mega",
        megaEvolves: "Garchomp",
        itemUser: ["Garchomp"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 683,
        gen: 6
    },
    gardevoirite: {
        isNonstandard: null,
        name: "Gardevoirite",
        spritenum: 587,
        megaStone: "Gardevoir-Mega",
        megaEvolves: "Gardevoir",
        itemUser: ["Gardevoir"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 657,
        gen: 6
    },
    gengarite: {
        isNonstandard: null,
        name: "Gengarite",
        spritenum: 588,
        megaStone: "Gengar-Mega",
        megaEvolves: "Gengar",
        itemUser: ["Gengar"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 656,
        gen: 6
    },
    ghostgem: {
        isNonstandard: null,
        name: "Ghost Gem",
        spritenum: 161,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Ghost' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 560,
        gen: 5
    },
    ghostmemory: {
        isNonstandard: null,
        name: "Ghost Memory",
        spritenum: 674,
        onMemory: "Ghost",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Ghost",
        itemUser: ["Silvally-Ghost"],
        num: 910,
        gen: 7
    },
    ghostiumz: {
        isNonstandard: null,
        name: "Ghostium Z",
        spritenum: 644,
        onPlate: "Ghost",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Ghost",
        forcedForme: "Arceus-Ghost",
        num: 789,
        gen: 7
    },
    glalitite: {
        isNonstandard: null,
        name: "Glalitite",
        spritenum: 623,
        megaStone: "Glalie-Mega",
        megaEvolves: "Glalie",
        itemUser: ["Glalie"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 763,
        gen: 6
    },
    goldbottlecap: {
        name: "Gold Bottle Cap",
        spritenum: 697,
        fling: {"basePower":30},
        num: 796,
        gen: 7
    },
    grassgem: {
        isNonstandard: null,
        name: "Grass Gem",
        spritenum: 172,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status' || move.flags['pledgecombo'])
                return;
            if (move.type === 'Grass' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 551,
        gen: 5
    },
    grassmemory: {
        isNonstandard: null,
        name: "Grass Memory",
        spritenum: 678,
        onMemory: "Grass",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Grass",
        itemUser: ["Silvally-Grass"],
        num: 914,
        gen: 7
    },
    grassiumz: {
        isNonstandard: null,
        name: "Grassium Z",
        spritenum: 635,
        onPlate: "Grass",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Grass",
        forcedForme: "Arceus-Grass",
        num: 780,
        gen: 7
    },
    grassyseed: {
        name: "Grassy Seed",
        spritenum: 667,
        fling: {"basePower":10},
        onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
                pokemon.useItem();
            }
        },
        onTerrainChange(pokemon) {
            if (this.field.isTerrain('grassyterrain')) {
                pokemon.useItem();
            }
        },
        boosts: {"def":1},
        num: 884,
        gen: 7
    },
    greatball: {
        name: "Great Ball",
        spritenum: 174,
        num: 3,
        gen: 1,
        isPokeball: true
    },
    grepaberry: {
        naturalGift: {"basePower":70,"type":"Flying"},
        name: "Grepa Berry",
        spritenum: 178,
        isBerry: true,
        onEat: false,
        num: 173,
        gen: 3
    },
    gripclaw: {
        name: "Grip Claw",
        spritenum: 179,
        fling: {"basePower":90},
        num: 286,
        gen: 4
    },
    griseouscore: {
        isNonstandard: "Future",
        name: "Griseous Core",
        spritenum: 180,
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) {
                return false;
            }
            return true;
        },
        forcedForme: "Giratina-Origin",
        itemUser: ["Giratina-Origin"],
        num: 1779,
        gen: 8
    },
    griseousorb: {
        onBasePower(basePower, user, target, move) {
            if (user.species.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
                return this.chainModify(1.2);
            }
        },
        onTakeItem(item, pokemon, source) {
            if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) {
                return false;
            }
            return true;
        },
        forcedForme: "Giratina-Origin",
        itemUser: ["Giratina-Origin"],
        name: "Griseous Orb",
        spritenum: 180,
        fling: {"basePower":60},
        onBasePowerPriority: 15,
        num: 112,
        gen: 4
    },
    groundgem: {
        isNonstandard: null,
        name: "Ground Gem",
        spritenum: 182,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Ground' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 555,
        gen: 5
    },
    groundmemory: {
        isNonstandard: null,
        name: "Ground Memory",
        spritenum: 671,
        onMemory: "Ground",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Ground",
        itemUser: ["Silvally-Ground"],
        num: 907,
        gen: 7
    },
    groundiumz: {
        isNonstandard: null,
        name: "Groundium Z",
        spritenum: 639,
        onPlate: "Ground",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Ground",
        forcedForme: "Arceus-Ground",
        num: 784,
        gen: 7
    },
    gyaradosite: {
        isNonstandard: null,
        name: "Gyaradosite",
        spritenum: 589,
        megaStone: "Gyarados-Mega",
        megaEvolves: "Gyarados",
        itemUser: ["Gyarados"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 676,
        gen: 6
    },
    habanberry: {
        naturalGift: {"basePower":60,"type":"Dragon"},
        name: "Haban Berry",
        spritenum: 185,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 197,
        gen: 4
    },
    hardstone: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Rock') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Hard Stone",
        spritenum: 187,
        fling: {"basePower":100},
        onBasePowerPriority: 15,
        num: 238,
        gen: 2
    },
    healball: {
        name: "Heal Ball",
        spritenum: 188,
        num: 14,
        gen: 4,
        isPokeball: true
    },
    hearthflamemask: {
		name: "Hearthflame Mask",
		spritenum: 760,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Hearthflame')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Hearthflame",
		itemUser: ["Ogerpon-Hearthflame"],
		num: 2408,
		gen: 9,
	},
    heatrock: {
        name: "Heat Rock",
        spritenum: 193,
        fling: {"basePower":60},
        num: 284,
        gen: 4
    },
    heavyball: {
        isNonstandard: null,
        name: "Heavy Ball",
        spritenum: 194,
        num: 495,
        gen: 2,
        isPokeball: true
    },
    heavydutyboots: {
        name: "Heavy-Duty Boots",
        spritenum: 715,
        fling: {"basePower":80},
        num: 1120,
        gen: 8
    },
    helixfossil: {
        isNonstandard: null,
        name: "Helix Fossil",
        spritenum: 195,
        fling: {"basePower":100},
        num: 101,
        gen: 3
    },
    heracronite: {
        isNonstandard: null,
        name: "Heracronite",
        spritenum: 590,
        megaStone: "Heracross-Mega",
        megaEvolves: "Heracross",
        itemUser: ["Heracross"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 680,
        gen: 6
    },
    hondewberry: {
        naturalGift: {"basePower":70,"type":"Ground"},
        name: "Hondew Berry",
        spritenum: 213,
        isBerry: true,
        onEat: false,
        num: 172,
        gen: 3
    },
    houndoominite: {
        isNonstandard: null,
        name: "Houndoominite",
        spritenum: 591,
        megaStone: "Houndoom-Mega",
        megaEvolves: "Houndoom",
        itemUser: ["Houndoom"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 666,
        gen: 6
    },
    iapapaberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Dark"},
        onEat(pokemon) {
            this.heal(pokemon.baseMaxhp / 8);
            if (pokemon.getNature().minus === 'def') {
                pokemon.addVolatile('confusion');
            }
        },
        name: "Iapapa Berry",
        spritenum: 217,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 163,
        gen: 3
    },
    icegem: {
        isNonstandard: null,
        name: "Ice Gem",
        spritenum: 218,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Ice' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 552,
        gen: 5
    },
    icememory: {
        isNonstandard: null,
        name: "Ice Memory",
        spritenum: 681,
        onMemory: "Ice",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Ice",
        itemUser: ["Silvally-Ice"],
        num: 917,
        gen: 7
    },
    icestone: {
        name: "Ice Stone",
        spritenum: 693,
        fling: {"basePower":30},
        num: 849,
        gen: 7
    },
    icicleplate: {
        isNonstandard: null,
        name: "Icicle Plate",
        spritenum: 220,
        onPlate: "Ice",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Ice') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Ice",
        num: 302,
        gen: 4
    },
    iciumz: {
        isNonstandard: null,
        name: "Icium Z",
        spritenum: 636,
        onPlate: "Ice",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Ice",
        forcedForme: "Arceus-Ice",
        num: 781,
        gen: 7
    },
    icyrock: {
        name: "Icy Rock",
        spritenum: 221,
        fling: {"basePower":40},
        num: 282,
        gen: 4
    },
    inciniumz: {
        isNonstandard: null,
        name: "Incinium Z",
        spritenum: 651,
        onTakeItem: false,
        zMove: "Malicious Moonsault",
        zMoveFrom: "Darkest Lariat",
        itemUser: ["Incineroar"],
        num: 799,
        gen: 7
    },
    insectplate: {
        isNonstandard: null,
        name: "Insect Plate",
        spritenum: 223,
        onPlate: "Bug",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Bug') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Bug",
        num: 308,
        gen: 4
    },
    ironball: {
        onEffectiveness() { },
        name: "Iron Ball",
        spritenum: 224,
        fling: {"basePower":130},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 278,
        gen: 4
    },
    ironplate: {
        isNonstandard: null,
        name: "Iron Plate",
        spritenum: 225,
        onPlate: "Steel",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Steel') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Steel",
        num: 313,
        gen: 4
    },
    jabocaberry: {
        naturalGift: {"basePower":80,"type":"Dragon"},
        onDamagingHit(damage, target, source, move) {
            if (move.category === 'Physical' && !source.hasAbility('magicguard')) {
                if (target.eatItem()) {
                    this.damage(source.baseMaxhp / 8, source, target, null, true);
                }
            }
        },
        isNonstandard: null,
        name: "Jaboca Berry",
        spritenum: 230,
        isBerry: true,
        onEat() { },
        num: 211,
        gen: 4
    },
    jawfossil: {
        isNonstandard: null,
        name: "Jaw Fossil",
        spritenum: 694,
        fling: {"basePower":100},
        num: 710,
        gen: 6
    },
    kasibberry: {
        naturalGift: {"basePower":60,"type":"Ghost"},
        name: "Kasib Berry",
        spritenum: 233,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 196,
        gen: 4
    },
    kebiaberry: {
        naturalGift: {"basePower":60,"type":"Poison"},
        name: "Kebia Berry",
        spritenum: 234,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 190,
        gen: 4
    },
    keeberry: {
        isNonstandard: null,
        name: "Kee Berry",
        spritenum: 593,
        isBerry: true,
        naturalGift: {"basePower":100,"type":"Fairy"},
        onAfterMoveSecondary(target, source, move) {
            if (move.category === 'Physical') {
                if (move.id === 'present' && move.heal)
                    return;
                target.eatItem();
            }
        },
        onEat(pokemon) {
            this.boost({ def: 1 });
        },
        num: 687,
        gen: 6
    },
    kelpsyberry: {
        naturalGift: {"basePower":70,"type":"Fighting"},
        name: "Kelpsy Berry",
        spritenum: 235,
        isBerry: true,
        onEat: false,
        num: 170,
        gen: 3
    },
    kangaskhanite: {
        isNonstandard: null,
        name: "Kangaskhanite",
        spritenum: 592,
        megaStone: "Kangaskhan-Mega",
        megaEvolves: "Kangaskhan",
        itemUser: ["Kangaskhan"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 675,
        gen: 6
    },
    kingsrock: {
        onModifyMove(move) {
            const affectedByKingsRock = [
                'absorb', 'aeroblast', 'barrage', 'beatup', 'bide', 'bonerush', 'bonemerang', 'cometpunch', 'counter', 'crabhammer', 'crosschop', 'cut', 'dig', 'doublekick', 'doubleslap', 'doubleedge', 'dragonrage', 'drillpeck', 'eggbomb', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'flail', 'fly', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigadrain', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydropump', 'jumpkick', 'karatechop', 'leechlife', 'machpunch', 'magnitude', 'megadrain', 'megakick', 'megapunch', 'megahorn', 'mirrorcoat', 'nightshade', 'outrage', 'payday', 'peck', 'petaldance', 'pinmissile', 'pound', 'present', 'pursuit', 'psywave', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'reversal', 'rockthrow', 'rollout', 'scratch', 'seismictoss', 'selfdestruct', 'skullbash', 'skyattack', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spikecannon', 'strength', 'struggle', 'submission', 'superfang', 'surf', 'swift', 'tackle', 'takedown', 'thief', 'thrash', 'triplekick', 'twineedle', 'visegrip', 'vinewhip', 'vitalthrow', 'watergun', 'waterfall', 'wingattack',
            ];
            if (affectedByKingsRock.includes(move.id)) {
                if (!move.secondaries)
                    move.secondaries = [];
                // The kingsrock flag allows for differentiation from Snore,
                // which can flinch and is also affected by King's Rock
                move.secondaries.push({
                    chance: 12,
                    volatileStatus: 'flinch',
                    kingsrock: true,
                });
            }
        },
        name: "King's Rock",
        spritenum: 236,
        fling: {"basePower":30,"volatileStatus":"flinch"},
        onModifyMovePriority: -1,
        num: 221,
        gen: 2
    },
    kommoniumz: {
        isNonstandard: null,
        name: "Kommonium Z",
        spritenum: 690,
        onTakeItem: false,
        zMove: "Clangorous Soulblaze",
        zMoveFrom: "Clanging Scales",
        itemUser: ["Kommo-o","Kommo-o-Totem"],
        num: 926,
        gen: 7
    },
    laggingtail: {
        name: "Lagging Tail",
        spritenum: 237,
        fling: {"basePower":10},
        onFractionalPriority: -0.1,
        num: 279,
        gen: 4
    },
    lansatberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Flying"},
        name: "Lansat Berry",
        spritenum: 238,
        isBerry: true,
        onEat(pokemon) {
            pokemon.addVolatile('focusenergy');
        },
        num: 206,
        gen: 3
    },
    latiasite: {
        isNonstandard: null,
        name: "Latiasite",
        spritenum: 629,
        megaStone: "Latias-Mega",
        megaEvolves: "Latias",
        itemUser: ["Latias"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 684,
        gen: 6
    },
    latiosite: {
        isNonstandard: null,
        name: "Latiosite",
        spritenum: 630,
        megaStone: "Latios-Mega",
        megaEvolves: "Latios",
        itemUser: ["Latios"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 685,
        gen: 6
    },
    laxincense: {
        onModifyAccuracy(accuracy) {
            if (typeof accuracy !== 'number')
                return;
            this.debug('lax incense - decreasing accuracy');
            return accuracy * 0.95;
        },
        onModifyAccuracyPriority: 5,
        isNonstandard: null,
        name: "Lax Incense",
        spritenum: 240,
        fling: {"basePower":10},
        num: 255,
        gen: 3
    },
    leafstone: {
        name: "Leaf Stone",
        spritenum: 241,
        fling: {"basePower":30},
        num: 85,
        gen: 1
    },
    leek: {
        isNonstandard: null,
        name: "Leek",
        fling: {"basePower":60},
        spritenum: 475,
        onModifyCritRatio(critRatio, user) {
            if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
                return critRatio + 2;
            }
        },
        itemUser: ["Farfetch’d","Farfetch’d-Galar","Sirfetch’d"],
        num: 259,
        gen: 8
    },
    leftovers: {
        onResidualOrder: 5,
        onResidualSubOrder: 1,
        name: "Leftovers",
        spritenum: 242,
        fling: {"basePower":10},
        onResidual(pokemon) {
            this.heal(pokemon.baseMaxhp / 16);
        },
        num: 234,
        gen: 2
    },
    leppaberry: {
        naturalGift: {"basePower":60,"type":"Fighting"},
        name: "Leppa Berry",
        spritenum: 244,
        isBerry: true,
        onUpdate(pokemon) {
            if (!pokemon.hp)
                return;
            if (pokemon.moveSlots.some(move => move.pp === 0)) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
                pokemon.moveSlots.find(move => move.pp < move.maxpp);
            if (!moveSlot)
                return;
            moveSlot.pp += 10;
            if (moveSlot.pp > moveSlot.maxpp)
                moveSlot.pp = moveSlot.maxpp;
            this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
        },
        num: 154,
        gen: 3
    },
    levelball: {
        isNonstandard: null,
        name: "Level Ball",
        spritenum: 246,
        num: 493,
        gen: 2,
        isPokeball: true
    },
    liechiberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Grass"},
        name: "Liechi Berry",
        spritenum: 248,
        isBerry: true,
        onEat(pokemon) {
            this.boost({ atk: 1 });
        },
        num: 201,
        gen: 3
    },
    lifeorb: {
        onModifyDamage() { },
        onAfterMoveSecondarySelf() { },
        onBasePower(basePower, user, target) {
            if (!target.volatiles['substitute']) {
                user.addVolatile('lifeorb');
            }
            return basePower;
        },
        onModifyDamagePhase2(damage, source, target, move) {
            if (!move.flags['futuremove'])
                return damage * 1.3;
        },
        condition: {
			duration: 1,
			onAfterMoveSecondarySelf(source, target, move) {
                if (move && move.effectType === 'Move' && source && source.volatiles['lifeorb']) {
                    this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
                    source.removeVolatile('lifeorb');
                }
            } 
		},
        name: "Life Orb",
        spritenum: 249,
        fling: {"basePower":30},
        num: 270,
        gen: 4
    },
    lightball: {
        onModifySpA() { },
        onBasePower() { },
        onModifyAtk() { },
        name: "Light Ball",
        spritenum: 251,
        fling: {"basePower":30,"status":"par"},
        onModifyAtkPriority: 1,
        onModifySpAPriority: 1,
        itemUser: ["Pikachu","Pikachu-Cosplay","Pikachu-Rock-Star","Pikachu-Belle","Pikachu-Pop-Star","Pikachu-PhD","Pikachu-Libre","Pikachu-Original","Pikachu-Hoenn","Pikachu-Sinnoh","Pikachu-Unova","Pikachu-Kalos","Pikachu-Alola","Pikachu-Partner","Pikachu-Starter","Pikachu-World"],
        num: 236,
        gen: 2
    },
    lightclay: {
        name: "Light Clay",
        spritenum: 252,
        fling: {"basePower":30},
        num: 269,
        gen: 4
    },
    loadeddice: {
        name: "Loaded Dice",
        spritenum: 0,
        onModifyMove(move) {
            if (move.multiaccuracy) {
                delete move.multiaccuracy;
            }
        },
        num: 1886,
        gen: 9
    },
    lopunnite: {
        isNonstandard: null,
        name: "Lopunnite",
        spritenum: 626,
        megaStone: "Lopunny-Mega",
        megaEvolves: "Lopunny",
        itemUser: ["Lopunny"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 768,
        gen: 6
    },
    loveball: {
        isNonstandard: null,
        name: "Love Ball",
        spritenum: 258,
        num: 496,
        gen: 2,
        isPokeball: true
    },
    lovesweet: {
        isNonstandard: null,
        name: "Love Sweet",
        spritenum: 705,
        fling: {"basePower":10},
        num: 1110,
        gen: 8
    },
    lucarionite: {
        isNonstandard: null,
        name: "Lucarionite",
        spritenum: 594,
        megaStone: "Lucario-Mega",
        megaEvolves: "Lucario",
        itemUser: ["Lucario"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 673,
        gen: 6
    },
    luckypunch: {
        onModifyCritRatioPriority: -1,
        onModifyCritRatio(critRatio, user) {
            if (user.species.name === 'Chansey') {
                return 3;
            }
        },
        isNonstandard: null,
        name: "Lucky Punch",
        spritenum: 261,
        fling: {"basePower":40},
        itemUser: ["Chansey"],
        num: 256,
        gen: 2
    },
    lumberry: {
        naturalGift: {"basePower":60,"type":"Flying"},
        name: "Lum Berry",
        spritenum: 262,
        isBerry: true,
        onAfterSetStatusPriority: -1,
        onAfterSetStatus(status, pokemon) {
            pokemon.eatItem();
        },
        onUpdate(pokemon) {
            if (pokemon.status || pokemon.volatiles['confusion']) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            pokemon.cureStatus();
            pokemon.removeVolatile('confusion');
        },
        num: 157,
        gen: 3
    },
    luminousmoss: {
        name: "Luminous Moss",
        spritenum: 595,
        fling: {"basePower":30},
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Water') {
                target.useItem();
            }
        },
        boosts: {"spd":1},
        num: 648,
        gen: 6
    },
    lunaliumz: {
        isNonstandard: null,
        name: "Lunalium Z",
        spritenum: 686,
        onTakeItem: false,
        zMove: "Menacing Moonraze Maelstrom",
        zMoveFrom: "Moongeist Beam",
        itemUser: ["Lunala","Necrozma-Dawn-Wings"],
        num: 922,
        gen: 7
    },
    lureball: {
        isNonstandard: null,
        name: "Lure Ball",
        spritenum: 264,
        num: 494,
        gen: 2,
        isPokeball: true
    },
    lustrousglobe: {
        isNonstandard: "Future",
        name: "Lustrous Globe",
        spritenum: 265,
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if (source?.baseSpecies.num === 484 || pokemon.baseSpecies.num === 484) {
                return false;
            }
            return true;
        },
        forcedForme: "Palkia-Origin",
        itemUser: ["Palkia-Origin"],
        num: 1778,
        gen: 8
    },
    lustrousorb: {
        onBasePower(basePower, user, target, move) {
            if (move && user.species.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
                return this.chainModify(1.2);
            }
        },
        name: "Lustrous Orb",
        spritenum: 265,
        fling: {"basePower":60},
        onBasePowerPriority: 15,
        itemUser: ["Palkia"],
        num: 136,
        gen: 4
    },
    luxuryball: {
        name: "Luxury Ball",
        spritenum: 266,
        num: 11,
        gen: 3,
        isPokeball: true
    },
    lycaniumz: {
        isNonstandard: null,
        name: "Lycanium Z",
        spritenum: 689,
        onTakeItem: false,
        zMove: "Splintered Stormshards",
        zMoveFrom: "Stone Edge",
        itemUser: ["Lycanroc","Lycanroc-Midnight","Lycanroc-Dusk"],
        num: 925,
        gen: 7
    },
    machobrace: {
        isNonstandard: null,
        name: "Macho Brace",
        spritenum: 269,
        ignoreKlutz: true,
        fling: {"basePower":60},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 215,
        gen: 3
    },
    magmarizer: {
        isNonstandard: null,
        name: "Magmarizer",
        spritenum: 272,
        fling: {"basePower":80},
        num: 323,
        gen: 4
    },
    magnet: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Electric') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Magnet",
        spritenum: 273,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 242,
        gen: 2
    },
    magoberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Ghost"},
        onEat(pokemon) {
            this.heal(pokemon.baseMaxhp / 8);
            if (pokemon.getNature().minus === 'spe') {
                pokemon.addVolatile('confusion');
            }
        },
        name: "Mago Berry",
        spritenum: 274,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 161,
        gen: 3
    },
    magostberry: {
        naturalGift: {"basePower":70,"type":"Rock"},
        isNonstandard: null,
        name: "Magost Berry",
        spritenum: 275,
        isBerry: true,
        onEat: false,
        num: 176,
        gen: 3
    },
    mail: {
        isNonstandard: null,
        name: "Mail",
        spritenum: 403,
        onTakeItem(item, source) {
            if (!this.activeMove)
                return false;
            if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet')
                return false;
        },
        num: 137,
        gen: 2
    },
    maliciousarmor: {
        name: "Malicious Armor",
        spritenum: 0,
        num: 1861,
        gen: 9
    },
    manectite: {
        isNonstandard: null,
        name: "Manectite",
        spritenum: 596,
        megaStone: "Manectric-Mega",
        megaEvolves: "Manectric",
        itemUser: ["Manectric"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 682,
        gen: 6
    },
    marangaberry: {
        isNonstandard: null,
        name: "Maranga Berry",
        spritenum: 597,
        isBerry: true,
        naturalGift: {"basePower":100,"type":"Dark"},
        onAfterMoveSecondary(target, source, move) {
            if (move.category === 'Special') {
                target.eatItem();
            }
        },
        onEat(pokemon) {
            this.boost({ spd: 1 });
        },
        num: 688,
        gen: 6
    },
    marshadiumz: {
        isNonstandard: null,
        name: "Marshadium Z",
        spritenum: 654,
        onTakeItem: false,
        zMove: "Soul-Stealing 7-Star Strike",
        zMoveFrom: "Spectral Thief",
        itemUser: ["Marshadow"],
        num: 802,
        gen: 7
    },
    masterball: {
        name: "Master Ball",
        spritenum: 276,
        num: 1,
        gen: 1,
        isPokeball: true
    },
    mawilite: {
        isNonstandard: null,
        name: "Mawilite",
        spritenum: 598,
        megaStone: "Mawile-Mega",
        megaEvolves: "Mawile",
        itemUser: ["Mawile"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 681,
        gen: 6
    },
    meadowplate: {
        isNonstandard: null,
        name: "Meadow Plate",
        spritenum: 282,
        onPlate: "Grass",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Grass') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Grass",
        num: 301,
        gen: 4
    },
    medichamite: {
        isNonstandard: null,
        name: "Medichamite",
        spritenum: 599,
        megaStone: "Medicham-Mega",
        megaEvolves: "Medicham",
        itemUser: ["Medicham"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 665,
        gen: 6
    },
    mentalherb: {
        fling: {"basePower":10},
        onUpdate(pokemon) {
            if (pokemon.volatiles['attract'] && pokemon.useItem()) {
                pokemon.removeVolatile('attract');
                this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
            }
        },
        name: "Mental Herb",
        spritenum: 285,
        num: 219,
        gen: 3
    },
    metagrossite: {
        isNonstandard: null,
        name: "Metagrossite",
        spritenum: 618,
        megaStone: "Metagross-Mega",
        megaEvolves: "Metagross",
        itemUser: ["Metagross"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 758,
        gen: 6
    },
    metalcoat: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Steel') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Metal Coat",
        spritenum: 286,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 233,
        gen: 2
    },
    metalpowder: {
        onModifyDef() { },
        onModifySpD() { },
        isNonstandard: null,
        name: "Metal Powder",
        fling: {"basePower":10},
        spritenum: 287,
        onModifyDefPriority: 2,
        itemUser: ["Ditto"],
        num: 257,
        gen: 2
    },
    metronome: {
        condition: {
			onStart(pokemon) {
                this.effectState.numConsecutive = 0;
                this.effectState.lastMove = '';
            },
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
                if (!pokemon.hasItem('metronome')) {
                    pokemon.removeVolatile('metronome');
                    return;
                }
                if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
                    this.effectState.numConsecutive++;
                }
                else {
                    this.effectState.numConsecutive = 0;
                }
                this.effectState.lastMove = move.id;
            },
			onModifyDamagePhase2(damage, source, target, move) {
                return damage * (1 + (this.effectState.numConsecutive / 10));
            } 
		},
        name: "Metronome",
        spritenum: 289,
        fling: {"basePower":30},
        onStart(pokemon) {
            pokemon.addVolatile('metronome');
        },
        num: 277,
        gen: 4
    },
    mewniumz: {
        isNonstandard: null,
        name: "Mewnium Z",
        spritenum: 658,
        onTakeItem: false,
        zMove: "Genesis Supernova",
        zMoveFrom: "Psychic",
        itemUser: ["Mew"],
        num: 806,
        gen: 7
    },
    mewtwonitex: {
        isNonstandard: null,
        name: "Mewtwonite X",
        spritenum: 600,
        megaStone: "Mewtwo-Mega-X",
        megaEvolves: "Mewtwo",
        itemUser: ["Mewtwo"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 662,
        gen: 6
    },
    mewtwonitey: {
        isNonstandard: null,
        name: "Mewtwonite Y",
        spritenum: 601,
        megaStone: "Mewtwo-Mega-Y",
        megaEvolves: "Mewtwo",
        itemUser: ["Mewtwo"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 663,
        gen: 6
    },
    micleberry: {
        condition: {
			duration: 2,
			onSourceModifyAccuracyPriority: 3,
			onSourceModifyAccuracy(accuracy, target, source) {
                this.add('-enditem', source, 'Micle Berry');
                source.removeVolatile('micleberry');
                if (typeof accuracy === 'number') {
                    return accuracy * 1.2;
                }
            } 
		},
        naturalGift: {"basePower":80,"type":"Rock"},
        isNonstandard: null,
        name: "Micle Berry",
        spritenum: 290,
        isBerry: true,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
                pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            pokemon.addVolatile('micleberry');
        },
        num: 209,
        gen: 4
    },
    mimikiumz: {
        isNonstandard: null,
        name: "Mimikium Z",
        spritenum: 688,
        onTakeItem: false,
        zMove: "Let's Snuggle Forever",
        zMoveFrom: "Play Rough",
        itemUser: ["Mimikyu","Mimikyu-Busted","Mimikyu-Totem","Mimikyu-Busted-Totem"],
        num: 924,
        gen: 7
    },
    mindplate: {
        isNonstandard: null,
        name: "Mind Plate",
        spritenum: 291,
        onPlate: "Psychic",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Psychic') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Psychic",
        num: 307,
        gen: 4
    },
    miracleseed: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Grass') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Miracle Seed",
        fling: {"basePower":30},
        spritenum: 292,
        onBasePowerPriority: 15,
        num: 239,
        gen: 2
    },
    mirrorherb: {
        name: "Mirror Herb",
        fling: {"basePower":10},
        spritenum: 0,
        onFoeAfterBoost(boost, target, source, effect) {
            if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb')
                return;
            const boostPlus = {};
            let statsRaised = false;
            let i;
            for (i in boost) {
                if (boost[i] > 0) {
                    boostPlus[i] = boost[i];
                    statsRaised = true;
                }
            }
            if (!statsRaised)
                return;
            const pokemon = this.effectState.target;
            pokemon.useItem();
            this.boost(boostPlus, pokemon);
        },
        num: 1883,
        gen: 9
    },
    mistyseed: {
        name: "Misty Seed",
        spritenum: 666,
        fling: {"basePower":10},
        onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
                pokemon.useItem();
            }
        },
        onTerrainChange(pokemon) {
            if (this.field.isTerrain('mistyterrain')) {
                pokemon.useItem();
            }
        },
        boosts: {"spd":1},
        num: 883,
        gen: 7
    },
    moonball: {
        isNonstandard: null,
        name: "Moon Ball",
        spritenum: 294,
        num: 498,
        gen: 2,
        isPokeball: true
    },
    moonstone: {
        name: "Moon Stone",
        spritenum: 295,
        fling: {"basePower":30},
        num: 81,
        gen: 1
    },
    muscleband: {
        name: "Muscle Band",
        spritenum: 297,
        fling: {"basePower":10},
        onBasePowerPriority: 16,
        onBasePower(basePower, user, target, move) {
            if (move.category === 'Physical') {
                return this.chainModify([4505, 4096]);
            }
        },
        num: 266,
        gen: 4
    },
    mysticwater: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Water') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Mystic Water",
        spritenum: 300,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 243,
        gen: 2
    },
    nanabberry: {
        naturalGift: {"basePower":70,"type":"Water"},
        isNonstandard: null,
        name: "Nanab Berry",
        spritenum: 302,
        isBerry: true,
        onEat: false,
        num: 166,
        gen: 3
    },
    nestball: {
        name: "Nest Ball",
        spritenum: 303,
        num: 8,
        gen: 3,
        isPokeball: true
    },
    netball: {
        name: "Net Ball",
        spritenum: 304,
        num: 6,
        gen: 3,
        isPokeball: true
    },
    nevermeltice: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Ice') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Never-Melt Ice",
        spritenum: 305,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 246,
        gen: 2
    },
    nomelberry: {
        naturalGift: {"basePower":70,"type":"Dragon"},
        isNonstandard: null,
        name: "Nomel Berry",
        spritenum: 306,
        isBerry: true,
        onEat: false,
        num: 178,
        gen: 3
    },
    normalgem: {
        name: "Normal Gem",
        spritenum: 307,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status' || move.flags['pledgecombo'])
                return;
            if (move.type === 'Normal' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 564,
        gen: 5
    },
    normaliumz: {
        isNonstandard: null,
        name: "Normalium Z",
        spritenum: 631,
        onTakeItem: false,
        zMove: true,
        zMoveType: "Normal",
        num: 776,
        gen: 7
    },
    occaberry: {
        naturalGift: {"basePower":60,"type":"Fire"},
        name: "Occa Berry",
        spritenum: 311,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 184,
        gen: 4
    },
    oddincense: {
        isNonstandard: null,
        name: "Odd Incense",
        spritenum: 312,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Psychic') {
                return this.chainModify([4915, 4096]);
            }
        },
        num: 314,
        gen: 4
    },
    oldamber: {
        isNonstandard: null,
        name: "Old Amber",
        spritenum: 314,
        fling: {"basePower":100},
        num: 103,
        gen: 3
    },
    oranberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Poison"},
        name: "Oran Berry",
        spritenum: 319,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        onEat(pokemon) {
            this.heal(10);
        },
        num: 155,
        gen: 3
    },
    ovalstone: {
        name: "Oval Stone",
        spritenum: 321,
        fling: {"basePower":80},
        num: 110,
        gen: 4
    },
    pamtreberry: {
        naturalGift: {"basePower":70,"type":"Steel"},
        isNonstandard: null,
        name: "Pamtre Berry",
        spritenum: 323,
        isBerry: true,
        onEat: false,
        num: 180,
        gen: 3
    },
    parkball: {
        name: "Park Ball",
        spritenum: 325,
        num: 500,
        gen: 4,
        isPokeball: true,
        isNonstandard: "Unobtainable"
    },
    passhoberry: {
        naturalGift: {"basePower":60,"type":"Water"},
        name: "Passho Berry",
        spritenum: 329,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 185,
        gen: 4
    },
    payapaberry: {
        naturalGift: {"basePower":60,"type":"Psychic"},
        name: "Payapa Berry",
        spritenum: 330,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 193,
        gen: 4
    },
    pechaberry: {
        naturalGift: {"basePower":60,"type":"Electric"},
        name: "Pecha Berry",
        spritenum: 333,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.status === 'psn' || pokemon.status === 'tox') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'psn' || pokemon.status === 'tox') {
                pokemon.cureStatus();
            }
        },
        num: 151,
        gen: 3
    },
    persimberry: {
        naturalGift: {"basePower":60,"type":"Ground"},
        name: "Persim Berry",
        spritenum: 334,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.volatiles['confusion']) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            pokemon.removeVolatile('confusion');
        },
        num: 156,
        gen: 3
    },
    petayaberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Poison"},
        name: "Petaya Berry",
        spritenum: 335,
        isBerry: true,
        onEat(pokemon) {
            this.boost({ spa: 1 });
        },
        num: 204,
        gen: 3
    },
    pidgeotite: {
        isNonstandard: null,
        name: "Pidgeotite",
        spritenum: 622,
        megaStone: "Pidgeot-Mega",
        megaEvolves: "Pidgeot",
        itemUser: ["Pidgeot"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 762,
        gen: 6
    },
    pikaniumz: {
        isNonstandard: null,
        name: "Pikanium Z",
        spritenum: 649,
        onTakeItem: false,
        zMove: "Catastropika",
        zMoveFrom: "Volt Tackle",
        itemUser: ["Pikachu"],
        num: 794,
        gen: 7
    },
    pikashuniumz: {
        isNonstandard: null,
        name: "Pikashunium Z",
        spritenum: 659,
        onTakeItem: false,
        zMove: "10,000,000 Volt Thunderbolt",
        zMoveFrom: "Thunderbolt",
        itemUser: ["Pikachu-Original","Pikachu-Hoenn","Pikachu-Sinnoh","Pikachu-Unova","Pikachu-Kalos","Pikachu-Alola","Pikachu-Partner"],
        num: 836,
        gen: 7
    },
    pinapberry: {
        naturalGift: {"basePower":70,"type":"Grass"},
        isNonstandard: "Unobtainable",
        name: "Pinap Berry",
        spritenum: 337,
        isBerry: true,
        onEat: false,
        num: 168,
        gen: 3
    },
    pinsirite: {
        isNonstandard: null,
        name: "Pinsirite",
        spritenum: 602,
        megaStone: "Pinsir-Mega",
        megaEvolves: "Pinsir",
        itemUser: ["Pinsir"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 671,
        gen: 6
    },
    pixieplate: {
        name: "Pixie Plate",
        spritenum: 610,
        onPlate: "Fairy",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move && move.type === 'Fairy') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Fairy",
        num: 644,
        gen: 6
    },
    plumefossil: {
        isNonstandard: null,
        name: "Plume Fossil",
        spritenum: 339,
        fling: {"basePower":100},
        num: 573,
        gen: 5
    },
    poisonbarb: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Poison') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Poison Barb",
        spritenum: 343,
        fling: {"basePower":70,"status":"psn"},
        onBasePowerPriority: 15,
        num: 245,
        gen: 2
    },
    poisongem: {
        isNonstandard: null,
        name: "Poison Gem",
        spritenum: 344,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Poison' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 554,
        gen: 5
    },
    poisonmemory: {
        isNonstandard: null,
        name: "Poison Memory",
        spritenum: 670,
        onMemory: "Poison",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Poison",
        itemUser: ["Silvally-Poison"],
        num: 906,
        gen: 7
    },
    poisoniumz: {
        isNonstandard: null,
        name: "Poisonium Z",
        spritenum: 638,
        onPlate: "Poison",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Poison",
        forcedForme: "Arceus-Poison",
        num: 783,
        gen: 7
    },
    pokeball: {
        name: "Poke Ball",
        spritenum: 345,
        num: 4,
        gen: 1,
        isPokeball: true
    },
    pomegberry: {
        naturalGift: {"basePower":70,"type":"Ice"},
        name: "Pomeg Berry",
        spritenum: 351,
        isBerry: true,
        onEat: false,
        num: 169,
        gen: 3
    },
    poweranklet: {
        name: "Power Anklet",
        spritenum: 354,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 293,
        gen: 4
    },
    powerband: {
        name: "Power Band",
        spritenum: 355,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 292,
        gen: 4
    },
    powerbelt: {
        name: "Power Belt",
        spritenum: 356,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 290,
        gen: 4
    },
    powerbracer: {
        name: "Power Bracer",
        spritenum: 357,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 289,
        gen: 4
    },
    powerherb: {
        onChargeMove(pokemon, target, move) {
            if (pokemon.useItem()) {
                this.debug('power herb - remove charge turn for ' + move.id);
                this.attrLastMove('[still]');
                this.addMove('-anim', pokemon, move.name, target);
                return false; // skip charge turn
            }
        },
        name: "Power Herb",
        spritenum: 358,
        fling: {"basePower":10},
        num: 271,
        gen: 4
    },
    powerlens: {
        name: "Power Lens",
        spritenum: 359,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 291,
        gen: 4
    },
    powerweight: {
        name: "Power Weight",
        spritenum: 360,
        ignoreKlutz: true,
        fling: {"basePower":70},
        onModifySpe(spe) {
            return this.chainModify(0.5);
        },
        num: 294,
        gen: 4
    },
    premierball: {
        name: "Premier Ball",
        spritenum: 363,
        num: 12,
        gen: 3,
        isPokeball: true
    },
    primariumz: {
        isNonstandard: null,
        name: "Primarium Z",
        spritenum: 652,
        onTakeItem: false,
        zMove: "Oceanic Operetta",
        zMoveFrom: "Sparkling Aria",
        itemUser: ["Primarina"],
        num: 800,
        gen: 7
    },
    prismscale: {
        isNonstandard: null,
        name: "Prism Scale",
        spritenum: 365,
        fling: {"basePower":30},
        num: 537,
        gen: 5
    },
    protectivepads: {
        name: "Protective Pads",
        spritenum: 663,
        fling: {"basePower":30},
        num: 880,
        gen: 7
    },
    protector: {
        isNonstandard: null,
        name: "Protector",
        spritenum: 367,
        fling: {"basePower":80},
        num: 321,
        gen: 4
    },
    psychicgem: {
        isNonstandard: null,
        name: "Psychic Gem",
        spritenum: 369,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Psychic' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 557,
        gen: 5
    },
    psychicmemory: {
        isNonstandard: null,
        name: "Psychic Memory",
        spritenum: 680,
        onMemory: "Psychic",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Psychic",
        itemUser: ["Silvally-Psychic"],
        num: 916,
        gen: 7
    },
    psychicseed: {
        name: "Psychic Seed",
        spritenum: 665,
        fling: {"basePower":10},
        onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
                pokemon.useItem();
            }
        },
        onTerrainChange(pokemon) {
            if (this.field.isTerrain('psychicterrain')) {
                pokemon.useItem();
            }
        },
        boosts: {"spd":1},
        num: 882,
        gen: 7
    },
    psychiumz: {
        isNonstandard: null,
        name: "Psychium Z",
        spritenum: 641,
        onPlate: "Psychic",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Psychic",
        forcedForme: "Arceus-Psychic",
        num: 786,
        gen: 7
    },
    punchingglove: {
        name: "Punching Glove",
        spritenum: 0,
        onBasePowerPriority: 23,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['punch']) {
                this.debug('Punching Glove boost');
                return this.chainModify([4506, 4096]);
            }
        },
        onModifyMovePriority: 1,
        onModifyMove(move) {
            if (move.flags['punch'])
                delete move.flags['contact'];
        },
        num: 1884,
        gen: 9
    },
    qualotberry: {
        naturalGift: {"basePower":70,"type":"Poison"},
        name: "Qualot Berry",
        spritenum: 371,
        isBerry: true,
        onEat: false,
        num: 171,
        gen: 3
    },
    quickball: {
        name: "Quick Ball",
        spritenum: 372,
        num: 15,
        gen: 4,
        isPokeball: true
    },
    quickclaw: {
        onFractionalPriority() { },
        onFractionalPriorityPriority: -2,
        name: "Quick Claw",
        spritenum: 373,
        fling: {"basePower":80},
        num: 217,
        gen: 2
    },
    quickpowder: {
        isNonstandard: null,
        name: "Quick Powder",
        spritenum: 374,
        fling: {"basePower":10},
        onModifySpe(spe, pokemon) {
            if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
                return this.chainModify(2);
            }
        },
        itemUser: ["Ditto"],
        num: 274,
        gen: 4
    },
    rabutaberry: {
        naturalGift: {"basePower":70,"type":"Ghost"},
        isNonstandard: null,
        name: "Rabuta Berry",
        spritenum: 375,
        isBerry: true,
        onEat: false,
        num: 177,
        gen: 3
    },
    rarebone: {
        name: "Rare Bone",
        spritenum: 379,
        fling: {"basePower":100},
        num: 106,
        gen: 4
    },
    rawstberry: {
        naturalGift: {"basePower":60,"type":"Grass"},
        name: "Rawst Berry",
        spritenum: 381,
        isBerry: true,
        onUpdate(pokemon) {
            if (pokemon.status === 'brn') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'brn') {
                pokemon.cureStatus();
            }
        },
        num: 152,
        gen: 3
    },
    razorclaw: {
        name: "Razor Claw",
        spritenum: 382,
        fling: {"basePower":80},
        onModifyCritRatio(critRatio) {
            return critRatio + 1;
        },
        num: 326,
        gen: 4
    },
    razorfang: {
        onModifyMove(move) {
            const affectedByRazorFang = [
                'aerialace', 'aeroblast', 'aircutter', 'airslash', 'aquajet', 'aquatail', 'armthrust', 'assurance', 'attackorder', 'aurasphere', 'avalanche', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'bravebird', 'brickbreak', 'brine', 'bugbite', 'bulletpunch', 'bulletseed', 'chargebeam', 'clamp', 'closecombat', 'cometpunch', 'crabhammer', 'crosschop', 'crosspoison', 'crushgrip', 'cut', 'darkpulse', 'dig', 'discharge', 'dive', 'doublehit', 'doublekick', 'doubleslap', 'doubleedge', 'dracometeor', 'dragonbreath', 'dragonclaw', 'dragonpulse', 'dragonrage', 'dragonrush', 'drainpunch', 'drillpeck', 'earthpower', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firefang', 'firespin', 'flail', 'flashcannon', 'fly', 'forcepalm', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigaimpact', 'grassknot', 'gunkshot', 'gust', 'gyroball', 'hammerarm', 'headsmash', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'icefang', 'iceshard', 'iciclespear', 'ironhead', 'judgment', 'jumpkick', 'karatechop', 'lastresort', 'lavaplume', 'leafblade', 'leafstorm', 'lowkick', 'machpunch', 'magicalleaf', 'magmastorm', 'magnetbomb', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mirrorshot', 'mudbomb', 'mudshot', 'muddywater', 'nightshade', 'nightslash', 'ominouswind', 'outrage', 'overheat', 'payday', 'payback', 'peck', 'petaldance', 'pinmissile', 'pluck', 'poisonjab', 'poisontail', 'pound', 'powergem', 'powerwhip', 'psychoboost', 'psychocut', 'psywave', 'punishment', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'roaroftime', 'rockblast', 'rockclimb', 'rockthrow', 'rockwrecker', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seedbomb', 'seedflare', 'seismictoss', 'selfdestruct', 'shadowclaw', 'shadowforce', 'shadowpunch', 'shadowsneak', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spacialrend', 'spikecannon', 'spitup', 'steelwing', 'stoneedge', 'strength', 'struggle', 'submission', 'suckerpunch', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'thunderfang', 'triplekick', 'trumpcard', 'twister', 'uturn', 'uproar', 'vacuumwave', 'visegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'wakeupslap', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'woodhammer', 'wrap', 'wringout', 'xscissor', 'zenheadbutt',
            ];
            if (affectedByRazorFang.includes(move.id)) {
                if (!move.secondaries)
                    move.secondaries = [];
                move.secondaries.push({
                    chance: 10,
                    volatileStatus: 'flinch',
                });
            }
        },
        isNonstandard: null,
        name: "Razor Fang",
        spritenum: 383,
        fling: {"basePower":30,"volatileStatus":"flinch"},
        onModifyMovePriority: -1,
        num: 327,
        gen: 4
    },
    razzberry: {
        naturalGift: {"basePower":60,"type":"Steel"},
        isNonstandard: null,
        name: "Razz Berry",
        spritenum: 384,
        isBerry: true,
        onEat: false,
        num: 164,
        gen: 3
    },
    reapercloth: {
        isNonstandard: null,
        name: "Reaper Cloth",
        spritenum: 385,
        fling: {"basePower":10},
        num: 325,
        gen: 4
    },
    redcard: {
        name: "Red Card",
        spritenum: 387,
        fling: {"basePower":10},
        onAfterMoveSecondary(target, source, move) {
            if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
                if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
                    return;
                }
                // The item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
                if (target.useItem(source)) {
                    if (this.runEvent('DragOut', source, target, move)) {
                        source.forceSwitchFlag = true;
                    }
                }
            }
        },
        num: 542,
        gen: 5
    },
    redorb: {
        isNonstandard: null,
        name: "Red Orb",
        spritenum: 390,
        onSwitchIn(pokemon) {
            if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon') {
                this.queue.insertChoice({ choice: 'runPrimal', pokemon: pokemon });
            }
        },
        onPrimal(pokemon) {
            pokemon.formeChange('Groudon-Primal', this.effect, true);
        },
        onTakeItem(item, source) {
            if (source.baseSpecies.baseSpecies === 'Groudon')
                return false;
            return true;
        },
        itemUser: ["Groudon"],
        num: 534,
        gen: 6
    },
    repeatball: {
        name: "Repeat Ball",
        spritenum: 401,
        num: 9,
        gen: 3,
        isPokeball: true
    },
    ribbonsweet: {
        isNonstandard: null,
        name: "Ribbon Sweet",
        spritenum: 710,
        fling: {"basePower":10},
        num: 1115,
        gen: 8
    },
    rindoberry: {
        naturalGift: {"basePower":60,"type":"Grass"},
        name: "Rindo Berry",
        spritenum: 409,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 187,
        gen: 4
    },
    ringtarget: {
        name: "Ring Target",
        spritenum: 410,
        fling: {"basePower":10},
        onNegateImmunity: false,
        num: 543,
        gen: 5
    },
    rockgem: {
        isNonstandard: null,
        name: "Rock Gem",
        spritenum: 415,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Rock' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 559,
        gen: 5
    },
    rockincense: {
        isNonstandard: null,
        name: "Rock Incense",
        spritenum: 416,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Rock') {
                return this.chainModify([4915, 4096]);
            }
        },
        num: 315,
        gen: 4
    },
    rockmemory: {
        isNonstandard: null,
        name: "Rock Memory",
        spritenum: 672,
        onMemory: "Rock",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Rock",
        itemUser: ["Silvally-Rock"],
        num: 908,
        gen: 7
    },
    rockiumz: {
        isNonstandard: null,
        name: "Rockium Z",
        spritenum: 643,
        onPlate: "Rock",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Rock",
        forcedForme: "Arceus-Rock",
        num: 788,
        gen: 7
    },
    rockyhelmet: {
        onDamagingHit(damage, target, source, move) {
            if (move.flags['contact']) {
                this.damage(source.baseMaxhp / 6, source, target, null, true);
            }
        },
        name: "Rocky Helmet",
        spritenum: 417,
        fling: {"basePower":60},
        onDamagingHitOrder: 2,
        num: 540,
        gen: 5
    },
    roomservice: {
        name: "Room Service",
        spritenum: 717,
        fling: {"basePower":100},
        onStart(pokemon) {
            if (!pokemon.ignoringItem() && this.field.getPseudoWeather('trickroom')) {
                pokemon.useItem();
            }
        },
        onAnyPseudoWeatherChange() {
            const pokemon = this.effectState.target;
            if (this.field.getPseudoWeather('trickroom')) {
                pokemon.useItem(pokemon);
            }
        },
        boosts: {"spe":-1},
        num: 1122,
        gen: 8
    },
    rootfossil: {
        isNonstandard: null,
        name: "Root Fossil",
        spritenum: 418,
        fling: {"basePower":100},
        num: 99,
        gen: 3
    },
    roseincense: {
        isNonstandard: null,
        name: "Rose Incense",
        spritenum: 419,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Grass') {
                return this.chainModify([4915, 4096]);
            }
        },
        num: 318,
        gen: 4
    },
    roseliberry: {
        name: "Roseli Berry",
        spritenum: 603,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Fairy"},
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 686,
        gen: 6
    },
    rowapberry: {
        naturalGift: {"basePower":80,"type":"Dark"},
        onDamagingHit(damage, target, source, move) {
            if (move.category === 'Special' && !source.hasAbility('magicguard')) {
                if (target.eatItem()) {
                    this.damage(source.baseMaxhp / 8, source, target, null, true);
                }
            }
        },
        isNonstandard: null,
        name: "Rowap Berry",
        spritenum: 420,
        isBerry: true,
        onEat() { },
        num: 212,
        gen: 4
    },
    rustedshield: {
        name: "Rusted Shield",
        spritenum: 699,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) {
                return false;
            }
            return true;
        },
        itemUser: ["Zamazenta-Crowned"],
        num: 1104,
        gen: 8
    },
    rustedsword: {
        name: "Rusted Sword",
        spritenum: 698,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) {
                return false;
            }
            return true;
        },
        itemUser: ["Zacian-Crowned"],
        num: 1103,
        gen: 8
    },
    sablenite: {
        isNonstandard: null,
        name: "Sablenite",
        spritenum: 614,
        megaStone: "Sableye-Mega",
        megaEvolves: "Sableye",
        itemUser: ["Sableye"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 754,
        gen: 6
    },
    sachet: {
        isNonstandard: null,
        name: "Sachet",
        spritenum: 691,
        fling: {"basePower":80},
        num: 647,
        gen: 6
    },
    safariball: {
        isNonstandard: "Unobtainable",
        name: "Safari Ball",
        spritenum: 425,
        num: 5,
        gen: 1,
        isPokeball: true
    },
    safetygoggles: {
        name: "Safety Goggles",
        spritenum: 604,
        fling: {"basePower":80},
        onImmunity(type, pokemon) {
            if (type === 'sandstorm' || type === 'hail' || type === 'powder')
                return false;
        },
        onTryHit(pokemon, source, move) {
            if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) {
                this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
                return null;
            }
        },
        num: 650,
        gen: 6
    },
    sailfossil: {
        isNonstandard: null,
        name: "Sail Fossil",
        spritenum: 695,
        fling: {"basePower":100},
        num: 711,
        gen: 6
    },
    salacberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Fighting"},
        name: "Salac Berry",
        spritenum: 426,
        isBerry: true,
        onEat(pokemon) {
            this.boost({ spe: 1 });
        },
        num: 203,
        gen: 3
    },
    salamencite: {
        isNonstandard: null,
        name: "Salamencite",
        spritenum: 627,
        megaStone: "Salamence-Mega",
        megaEvolves: "Salamence",
        itemUser: ["Salamence"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 769,
        gen: 6
    },
    sceptilite: {
        isNonstandard: null,
        name: "Sceptilite",
        spritenum: 613,
        megaStone: "Sceptile-Mega",
        megaEvolves: "Sceptile",
        itemUser: ["Sceptile"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 753,
        gen: 6
    },
    scizorite: {
        isNonstandard: null,
        name: "Scizorite",
        spritenum: 605,
        megaStone: "Scizor-Mega",
        megaEvolves: "Scizor",
        itemUser: ["Scizor"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 670,
        gen: 6
    },
    scopelens: {
        name: "Scope Lens",
        spritenum: 429,
        fling: {"basePower":30},
        onModifyCritRatio(critRatio) {
            return critRatio + 1;
        },
        num: 232,
        gen: 2
    },
    seaincense: {
        onBasePower() { },
        onModifySpAPriority: 1,
        onModifySpA(spa, user, target, move) {
            if (move?.type === 'Water') {
                return this.chainModify(1.05);
            }
        },
        isNonstandard: null,
        name: "Sea Incense",
        spritenum: 430,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        num: 254,
        gen: 3
    },
    sharpbeak: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Flying') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Sharp Beak",
        spritenum: 436,
        fling: {"basePower":50},
        onBasePowerPriority: 15,
        num: 244,
        gen: 2
    },
    sharpedonite: {
        isNonstandard: null,
        name: "Sharpedonite",
        spritenum: 619,
        megaStone: "Sharpedo-Mega",
        megaEvolves: "Sharpedo",
        itemUser: ["Sharpedo"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 759,
        gen: 6
    },
    shedshell: {
        name: "Shed Shell",
        spritenum: 437,
        fling: {"basePower":10},
        onTrapPokemonPriority: -10,
        onTrapPokemon(pokemon) {
            pokemon.trapped = pokemon.maybeTrapped = false;
        },
        num: 295,
        gen: 4
    },
    shellbell: {
        name: "Shell Bell",
        spritenum: 438,
        fling: {"basePower":30},
        onAfterMoveSecondarySelfPriority: -1,
        onAfterMoveSecondarySelf(pokemon, target, move) {
            if (move.totalDamage && !pokemon.forceSwitchFlag) {
                this.heal(move.totalDamage / 8, pokemon);
            }
        },
        num: 253,
        gen: 3
    },
    shinystone: {
        name: "Shiny Stone",
        spritenum: 439,
        fling: {"basePower":80},
        num: 107,
        gen: 4
    },
    shockdrive: {
        isNonstandard: null,
        name: "Shock Drive",
        spritenum: 442,
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
                return false;
            }
            return true;
        },
        onDrive: "Electric",
        forcedForme: "Genesect-Shock",
        itemUser: ["Genesect-Shock"],
        num: 117,
        gen: 5
    },
    shucaberry: {
        naturalGift: {"basePower":60,"type":"Ground"},
        name: "Shuca Berry",
        spritenum: 443,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 191,
        gen: 4
    },
    silkscarf: {
        onBasePower() { },
        onModifyAtkPriority: 1,
        onModifyAtk(atk, user, target, move) {
            if (move?.type === 'Normal') {
                return this.chainModify(1.1);
            }
        },
        name: "Silk Scarf",
        spritenum: 444,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        num: 251,
        gen: 3
    },
    silverpowder: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Bug') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Silver Powder",
        spritenum: 447,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        num: 222,
        gen: 2
    },
    sitrusberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            this.heal(30);
        },
        naturalGift: {"basePower":60,"type":"Psychic"},
        name: "Sitrus Berry",
        spritenum: 448,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 158,
        gen: 3
    },
    skullfossil: {
        isNonstandard: null,
        name: "Skull Fossil",
        spritenum: 449,
        fling: {"basePower":100},
        num: 105,
        gen: 4
    },
    skyplate: {
        isNonstandard: null,
        name: "Sky Plate",
        spritenum: 450,
        onPlate: "Flying",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Flying') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Flying",
        num: 306,
        gen: 4
    },
    slowbronite: {
        isNonstandard: null,
        name: "Slowbronite",
        spritenum: 620,
        megaStone: "Slowbro-Mega",
        megaEvolves: "Slowbro",
        itemUser: ["Slowbro"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 760,
        gen: 6
    },
    smoothrock: {
        name: "Smooth Rock",
        spritenum: 453,
        fling: {"basePower":10},
        num: 283,
        gen: 4
    },
    snorliumz: {
        isNonstandard: null,
        name: "Snorlium Z",
        spritenum: 656,
        onTakeItem: false,
        zMove: "Pulverizing Pancake",
        zMoveFrom: "Giga Impact",
        itemUser: ["Snorlax"],
        num: 804,
        gen: 7
    },
    snowball: {
        name: "Snowball",
        spritenum: 606,
        fling: {"basePower":30},
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Ice') {
                target.useItem();
            }
        },
        boosts: {"atk":1},
        num: 649,
        gen: 6
    },
    softsand: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Ground') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Soft Sand",
        spritenum: 456,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        num: 237,
        gen: 2
    },
    solganiumz: {
        isNonstandard: null,
        name: "Solganium Z",
        spritenum: 685,
        onTakeItem: false,
        zMove: "Searing Sunraze Smash",
        zMoveFrom: "Sunsteel Strike",
        itemUser: ["Solgaleo","Necrozma-Dusk-Mane"],
        num: 921,
        gen: 7
    },
    souldew: {
        onBasePower() { },
        onModifySpAPriority: 1,
        onModifySpA(spa, pokemon) {
            if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
                return this.chainModify(1.5);
            }
        },
        onModifySpDPriority: 2,
        onModifySpD(spd, pokemon) {
            if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
                return this.chainModify(1.5);
            }
        },
        isNonstandard: null,
        name: "Soul Dew",
        spritenum: 459,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        itemUser: ["Latios","Latias"],
        num: 225,
        gen: 3
    },
    spelltag: {
        onModifyAtk() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Ghost') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifyAtkPriority: 1,
        name: "Spell Tag",
        spritenum: 461,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 247,
        gen: 2
    },
    spelonberry: {
        naturalGift: {"basePower":70,"type":"Dark"},
        isNonstandard: null,
        name: "Spelon Berry",
        spritenum: 462,
        isBerry: true,
        onEat: false,
        num: 179,
        gen: 3
    },
    splashplate: {
        isNonstandard: null,
        name: "Splash Plate",
        spritenum: 463,
        onPlate: "Water",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Water') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Water",
        num: 299,
        gen: 4
    },
    spookyplate: {
        isNonstandard: null,
        name: "Spooky Plate",
        spritenum: 464,
        onPlate: "Ghost",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Ghost') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Ghost",
        num: 310,
        gen: 4
    },
    sportball: {
        isNonstandard: null,
        name: "Sport Ball",
        spritenum: 465,
        num: 499,
        gen: 2,
        isPokeball: true
    },
    starfberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 4) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":80,"type":"Psychic"},
        name: "Starf Berry",
        spritenum: 472,
        isBerry: true,
        onEat(pokemon) {
            const stats = [];
            let stat;
            for (stat in pokemon.boosts) {
                if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
                    stats.push(stat);
                }
            }
            if (stats.length) {
                const randomStat = this.sample(stats);
                const boost = {};
                boost[randomStat] = 2;
                this.boost(boost);
            }
        },
        num: 207,
        gen: 3
    },
    starsweet: {
        isNonstandard: null,
        name: "Star Sweet",
        spritenum: 709,
        fling: {"basePower":10},
        num: 1114,
        gen: 8
    },
    steelixite: {
        isNonstandard: null,
        name: "Steelixite",
        spritenum: 621,
        megaStone: "Steelix-Mega",
        megaEvolves: "Steelix",
        itemUser: ["Steelix"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 761,
        gen: 6
    },
    steelgem: {
        isNonstandard: null,
        name: "Steel Gem",
        spritenum: 473,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            if (move.type === 'Steel' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 563,
        gen: 5
    },
    steelmemory: {
        isNonstandard: null,
        name: "Steel Memory",
        spritenum: 675,
        onMemory: "Steel",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Steel",
        itemUser: ["Silvally-Steel"],
        num: 911,
        gen: 7
    },
    steeliumz: {
        isNonstandard: null,
        name: "Steelium Z",
        spritenum: 647,
        onPlate: "Steel",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Steel",
        forcedForme: "Arceus-Steel",
        num: 792,
        gen: 7
    },
    stick: {
        onModifyCritRatioPriority: -1,
        onModifyCritRatio(critRatio, user) {
            if (user.species.id === 'farfetchd') {
                return 3;
            }
        },
        isNonstandard: null,
        name: "Stick",
        fling: {"basePower":60},
        spritenum: 475,
        itemUser: ["Farfetch’d"],
        num: 259,
        gen: 2
    },
    stickybarb: {
        onResidualOrder: 10,
        onResidualSubOrder: 20,
        name: "Sticky Barb",
        spritenum: 476,
        fling: {"basePower":80},
        onResidual(pokemon) {
            this.damage(pokemon.baseMaxhp / 8);
        },
        onHit(target, source, move) {
            if (source && source !== target && !source.item && move && this.checkMoveMakesContact(move, source, target)) {
                const barb = target.takeItem();
                if (!barb)
                    return; // Gen 4 Multitype
                source.setItem(barb);
                // no message for Sticky Barb changing hands
            }
        },
        num: 288,
        gen: 4
    },
    stoneplate: {
        isNonstandard: null,
        name: "Stone Plate",
        spritenum: 477,
        onPlate: "Rock",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Rock') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Rock",
        num: 309,
        gen: 4
    },
    strangeball: {
        isNonstandard: "Future",
        name: "Strange Ball",
        spritenum: 308,
        num: 1785,
        gen: 8,
        isPokeball: true
    },
    strawberrysweet: {
        isNonstandard: null,
        name: "Strawberry Sweet",
        spritenum: 704,
        fling: {"basePower":10},
        num: 1109,
        gen: 8
    },
    sunstone: {
        name: "Sun Stone",
        spritenum: 480,
        fling: {"basePower":30},
        num: 80,
        gen: 2
    },
    swampertite: {
        isNonstandard: null,
        name: "Swampertite",
        spritenum: 612,
        megaStone: "Swampert-Mega",
        megaEvolves: "Swampert",
        itemUser: ["Swampert"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 752,
        gen: 6
    },
    sweetapple: {
        name: "Sweet Apple",
        spritenum: 711,
        fling: {"basePower":30},
        num: 1116,
        gen: 8
    },
    tamatoberry: {
        naturalGift: {"basePower":70,"type":"Psychic"},
        name: "Tamato Berry",
        spritenum: 486,
        isBerry: true,
        onEat: false,
        num: 174,
        gen: 3
    },
    tangaberry: {
        naturalGift: {"basePower":60,"type":"Bug"},
        name: "Tanga Berry",
        spritenum: 487,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 194,
        gen: 4
    },
    tapuniumz: {
        isNonstandard: null,
        name: "Tapunium Z",
        spritenum: 653,
        onTakeItem: false,
        zMove: "Guardian of Alola",
        zMoveFrom: "Nature's Madness",
        itemUser: ["Tapu Koko","Tapu Lele","Tapu Bulu","Tapu Fini"],
        num: 801,
        gen: 7
    },
    tartapple: {
        name: "Tart Apple",
        spritenum: 712,
        fling: {"basePower":30},
        num: 1117,
        gen: 8
    },
    terrainextender: {
        name: "Terrain Extender",
        spritenum: 662,
        fling: {"basePower":60},
        num: 879,
        gen: 7
    },
    thickclub: {
        onModifyAtk() { },
        isNonstandard: null,
        name: "Thick Club",
        spritenum: 491,
        fling: {"basePower":90},
        onModifyAtkPriority: 1,
        itemUser: ["Marowak","Marowak-Alola","Marowak-Alola-Totem","Cubone"],
        num: 258,
        gen: 2
    },
    throatspray: {
        name: "Throat Spray",
        spritenum: 713,
        fling: {"basePower":30},
        onAfterMoveSecondarySelf(target, source, move) {
            if (move.flags['sound']) {
                target.useItem();
            }
        },
        boosts: {"spa":1},
        num: 1118,
        gen: 8
    },
    thunderstone: {
        name: "Thunder Stone",
        spritenum: 492,
        fling: {"basePower":30},
        num: 83,
        gen: 1
    },
    timerball: {
        name: "Timer Ball",
        spritenum: 494,
        num: 10,
        gen: 3,
        isPokeball: true
    },
    toxicorb: {
        onResidualOrder: 10,
        onResidualSubOrder: 20,
        name: "Toxic Orb",
        spritenum: 515,
        fling: {"basePower":30,"status":"tox"},
        onResidual(pokemon) {
            pokemon.trySetStatus('tox', pokemon);
        },
        num: 272,
        gen: 4
    },
    toxicplate: {
        isNonstandard: null,
        name: "Toxic Plate",
        spritenum: 516,
        onPlate: "Poison",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Poison') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Poison",
        num: 304,
        gen: 4
    },
    tr00: {
        isNonstandard: null,
        name: "TR00",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1130,
        gen: 8
    },
    tr01: {
        isNonstandard: null,
        name: "TR01",
        fling: {"basePower":85},
        spritenum: 721,
        num: 1131,
        gen: 8
    },
    tr02: {
        isNonstandard: null,
        name: "TR02",
        fling: {"basePower":90},
        spritenum: 730,
        num: 1132,
        gen: 8
    },
    tr03: {
        isNonstandard: null,
        name: "TR03",
        fling: {"basePower":110},
        spritenum: 731,
        num: 1133,
        gen: 8
    },
    tr04: {
        isNonstandard: null,
        name: "TR04",
        fling: {"basePower":90},
        spritenum: 731,
        num: 1134,
        gen: 8
    },
    tr05: {
        isNonstandard: null,
        name: "TR05",
        fling: {"basePower":90},
        spritenum: 735,
        num: 1135,
        gen: 8
    },
    tr06: {
        isNonstandard: null,
        name: "TR06",
        fling: {"basePower":110},
        spritenum: 735,
        num: 1136,
        gen: 8
    },
    tr07: {
        isNonstandard: null,
        name: "TR07",
        fling: {"basePower":10},
        spritenum: 722,
        num: 1137,
        gen: 8
    },
    tr08: {
        isNonstandard: null,
        name: "TR08",
        fling: {"basePower":90},
        spritenum: 733,
        num: 1138,
        gen: 8
    },
    tr09: {
        isNonstandard: null,
        name: "TR09",
        fling: {"basePower":110},
        spritenum: 733,
        num: 1139,
        gen: 8
    },
    tr10: {
        isNonstandard: null,
        name: "TR10",
        fling: {"basePower":100},
        spritenum: 725,
        num: 1140,
        gen: 8
    },
    tr11: {
        isNonstandard: null,
        name: "TR11",
        fling: {"basePower":90},
        spritenum: 734,
        num: 1141,
        gen: 8
    },
    tr12: {
        isNonstandard: null,
        name: "TR12",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1142,
        gen: 8
    },
    tr13: {
        isNonstandard: null,
        name: "TR13",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1143,
        gen: 8
    },
    tr14: {
        isNonstandard: null,
        name: "TR14",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1144,
        gen: 8
    },
    tr15: {
        isNonstandard: null,
        name: "TR15",
        fling: {"basePower":110},
        spritenum: 730,
        num: 1145,
        gen: 8
    },
    tr16: {
        isNonstandard: null,
        name: "TR16",
        fling: {"basePower":80},
        spritenum: 731,
        num: 1146,
        gen: 8
    },
    tr17: {
        isNonstandard: null,
        name: "TR17",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1147,
        gen: 8
    },
    tr18: {
        isNonstandard: null,
        name: "TR18",
        fling: {"basePower":80},
        spritenum: 727,
        num: 1148,
        gen: 8
    },
    tr19: {
        isNonstandard: null,
        name: "TR19",
        fling: {"basePower":80},
        spritenum: 721,
        num: 1149,
        gen: 8
    },
    tr20: {
        isNonstandard: null,
        name: "TR20",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1150,
        gen: 8
    },
    tr21: {
        isNonstandard: null,
        name: "TR21",
        fling: {"basePower":10},
        spritenum: 722,
        num: 1151,
        gen: 8
    },
    tr22: {
        isNonstandard: null,
        name: "TR22",
        fling: {"basePower":90},
        spritenum: 724,
        num: 1152,
        gen: 8
    },
    tr23: {
        isNonstandard: null,
        name: "TR23",
        fling: {"basePower":10},
        spritenum: 725,
        num: 1153,
        gen: 8
    },
    tr24: {
        isNonstandard: null,
        name: "TR24",
        fling: {"basePower":120},
        spritenum: 736,
        num: 1154,
        gen: 8
    },
    tr25: {
        isNonstandard: null,
        name: "TR25",
        fling: {"basePower":80},
        spritenum: 734,
        num: 1155,
        gen: 8
    },
    tr26: {
        isNonstandard: null,
        name: "TR26",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1156,
        gen: 8
    },
    tr27: {
        isNonstandard: null,
        name: "TR27",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1157,
        gen: 8
    },
    tr28: {
        isNonstandard: null,
        name: "TR28",
        fling: {"basePower":120},
        spritenum: 727,
        num: 1158,
        gen: 8
    },
    tr29: {
        isNonstandard: null,
        name: "TR29",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1159,
        gen: 8
    },
    tr30: {
        isNonstandard: null,
        name: "TR30",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1160,
        gen: 8
    },
    tr31: {
        isNonstandard: null,
        name: "TR31",
        fling: {"basePower":100},
        spritenum: 729,
        num: 1161,
        gen: 8
    },
    tr32: {
        isNonstandard: null,
        name: "TR32",
        fling: {"basePower":80},
        spritenum: 737,
        num: 1162,
        gen: 8
    },
    tr33: {
        isNonstandard: null,
        name: "TR33",
        fling: {"basePower":80},
        spritenum: 728,
        num: 1163,
        gen: 8
    },
    tr34: {
        isNonstandard: null,
        name: "TR34",
        fling: {"basePower":120},
        spritenum: 734,
        num: 1164,
        gen: 8
    },
    tr35: {
        isNonstandard: null,
        name: "TR35",
        fling: {"basePower":90},
        spritenum: 721,
        num: 1165,
        gen: 8
    },
    tr36: {
        isNonstandard: null,
        name: "TR36",
        fling: {"basePower":95},
        spritenum: 730,
        num: 1166,
        gen: 8
    },
    tr37: {
        isNonstandard: null,
        name: "TR37",
        fling: {"basePower":10},
        spritenum: 737,
        num: 1167,
        gen: 8
    },
    tr38: {
        isNonstandard: null,
        name: "TR38",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1168,
        gen: 8
    },
    tr39: {
        isNonstandard: null,
        name: "TR39",
        fling: {"basePower":120},
        spritenum: 722,
        num: 1169,
        gen: 8
    },
    tr40: {
        isNonstandard: null,
        name: "TR40",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1170,
        gen: 8
    },
    tr41: {
        isNonstandard: null,
        name: "TR41",
        fling: {"basePower":85},
        spritenum: 730,
        num: 1171,
        gen: 8
    },
    tr42: {
        isNonstandard: null,
        name: "TR42",
        fling: {"basePower":90},
        spritenum: 721,
        num: 1172,
        gen: 8
    },
    tr43: {
        isNonstandard: null,
        name: "TR43",
        fling: {"basePower":130},
        spritenum: 730,
        num: 1173,
        gen: 8
    },
    tr44: {
        isNonstandard: null,
        name: "TR44",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1174,
        gen: 8
    },
    tr45: {
        isNonstandard: null,
        name: "TR45",
        fling: {"basePower":90},
        spritenum: 731,
        num: 1175,
        gen: 8
    },
    tr46: {
        isNonstandard: null,
        name: "TR46",
        fling: {"basePower":10},
        spritenum: 729,
        num: 1176,
        gen: 8
    },
    tr47: {
        isNonstandard: null,
        name: "TR47",
        fling: {"basePower":80},
        spritenum: 736,
        num: 1177,
        gen: 8
    },
    tr48: {
        isNonstandard: null,
        name: "TR48",
        fling: {"basePower":10},
        spritenum: 722,
        num: 1178,
        gen: 8
    },
    tr49: {
        isNonstandard: null,
        name: "TR49",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1179,
        gen: 8
    },
    tr50: {
        isNonstandard: null,
        name: "TR50",
        fling: {"basePower":90},
        spritenum: 732,
        num: 1180,
        gen: 8
    },
    tr51: {
        isNonstandard: null,
        name: "TR51",
        fling: {"basePower":10},
        spritenum: 736,
        num: 1181,
        gen: 8
    },
    tr52: {
        isNonstandard: null,
        name: "TR52",
        fling: {"basePower":10},
        spritenum: 729,
        num: 1182,
        gen: 8
    },
    tr53: {
        isNonstandard: null,
        name: "TR53",
        fling: {"basePower":120},
        spritenum: 722,
        num: 1183,
        gen: 8
    },
    tr54: {
        isNonstandard: null,
        name: "TR54",
        fling: {"basePower":10},
        spritenum: 724,
        num: 1184,
        gen: 8
    },
    tr55: {
        isNonstandard: null,
        name: "TR55",
        fling: {"basePower":120},
        spritenum: 730,
        num: 1185,
        gen: 8
    },
    tr56: {
        isNonstandard: null,
        name: "TR56",
        fling: {"basePower":80},
        spritenum: 722,
        num: 1186,
        gen: 8
    },
    tr57: {
        isNonstandard: null,
        name: "TR57",
        fling: {"basePower":80},
        spritenum: 724,
        num: 1187,
        gen: 8
    },
    tr58: {
        isNonstandard: null,
        name: "TR58",
        fling: {"basePower":80},
        spritenum: 737,
        num: 1188,
        gen: 8
    },
    tr59: {
        isNonstandard: null,
        name: "TR59",
        fling: {"basePower":80},
        spritenum: 732,
        num: 1189,
        gen: 8
    },
    tr60: {
        isNonstandard: null,
        name: "TR60",
        fling: {"basePower":80},
        spritenum: 727,
        num: 1190,
        gen: 8
    },
    tr61: {
        isNonstandard: null,
        name: "TR61",
        fling: {"basePower":90},
        spritenum: 727,
        num: 1191,
        gen: 8
    },
    tr62: {
        isNonstandard: null,
        name: "TR62",
        fling: {"basePower":85},
        spritenum: 736,
        num: 1192,
        gen: 8
    },
    tr63: {
        isNonstandard: null,
        name: "TR63",
        fling: {"basePower":80},
        spritenum: 726,
        num: 1193,
        gen: 8
    },
    tr64: {
        isNonstandard: null,
        name: "TR64",
        fling: {"basePower":120},
        spritenum: 722,
        num: 1194,
        gen: 8
    },
    tr65: {
        isNonstandard: null,
        name: "TR65",
        fling: {"basePower":90},
        spritenum: 732,
        num: 1195,
        gen: 8
    },
    tr66: {
        isNonstandard: null,
        name: "TR66",
        fling: {"basePower":120},
        spritenum: 723,
        num: 1196,
        gen: 8
    },
    tr67: {
        isNonstandard: null,
        name: "TR67",
        fling: {"basePower":90},
        spritenum: 725,
        num: 1197,
        gen: 8
    },
    tr68: {
        isNonstandard: null,
        name: "TR68",
        fling: {"basePower":10},
        spritenum: 737,
        num: 1198,
        gen: 8
    },
    tr69: {
        isNonstandard: null,
        name: "TR69",
        fling: {"basePower":80},
        spritenum: 734,
        num: 1199,
        gen: 8
    },
    tr70: {
        isNonstandard: null,
        name: "TR70",
        fling: {"basePower":80},
        spritenum: 729,
        num: 1200,
        gen: 8
    },
    tr71: {
        isNonstandard: null,
        name: "TR71",
        fling: {"basePower":130},
        spritenum: 732,
        num: 1201,
        gen: 8
    },
    tr72: {
        isNonstandard: null,
        name: "TR72",
        fling: {"basePower":120},
        spritenum: 732,
        num: 1202,
        gen: 8
    },
    tr73: {
        isNonstandard: null,
        name: "TR73",
        fling: {"basePower":120},
        spritenum: 724,
        num: 1203,
        gen: 8
    },
    tr74: {
        isNonstandard: null,
        name: "TR74",
        fling: {"basePower":80},
        spritenum: 729,
        num: 1204,
        gen: 8
    },
    tr75: {
        isNonstandard: null,
        name: "TR75",
        fling: {"basePower":100},
        spritenum: 726,
        num: 1205,
        gen: 8
    },
    tr76: {
        isNonstandard: null,
        name: "TR76",
        fling: {"basePower":10},
        spritenum: 726,
        num: 1206,
        gen: 8
    },
    tr77: {
        isNonstandard: null,
        name: "TR77",
        fling: {"basePower":10},
        spritenum: 732,
        num: 1207,
        gen: 8
    },
    tr78: {
        isNonstandard: null,
        name: "TR78",
        fling: {"basePower":95},
        spritenum: 724,
        num: 1208,
        gen: 8
    },
    tr79: {
        isNonstandard: null,
        name: "TR79",
        fling: {"basePower":10},
        spritenum: 729,
        num: 1209,
        gen: 8
    },
    tr80: {
        isNonstandard: null,
        name: "TR80",
        fling: {"basePower":10},
        spritenum: 733,
        num: 1210,
        gen: 8
    },
    tr81: {
        isNonstandard: null,
        name: "TR81",
        fling: {"basePower":95},
        spritenum: 737,
        num: 1211,
        gen: 8
    },
    tr82: {
        isNonstandard: null,
        name: "TR82",
        fling: {"basePower":20},
        spritenum: 734,
        num: 1212,
        gen: 8
    },
    tr83: {
        isNonstandard: null,
        name: "TR83",
        fling: {"basePower":10},
        spritenum: 734,
        num: 1213,
        gen: 8
    },
    tr84: {
        isNonstandard: null,
        name: "TR84",
        fling: {"basePower":80},
        spritenum: 731,
        num: 1214,
        gen: 8
    },
    tr85: {
        isNonstandard: null,
        name: "TR85",
        fling: {"basePower":10},
        spritenum: 721,
        num: 1215,
        gen: 8
    },
    tr86: {
        isNonstandard: null,
        name: "TR86",
        fling: {"basePower":90},
        spritenum: 733,
        num: 1216,
        gen: 8
    },
    tr87: {
        isNonstandard: null,
        name: "TR87",
        fling: {"basePower":80},
        spritenum: 725,
        num: 1217,
        gen: 8
    },
    tr88: {
        isNonstandard: null,
        name: "TR88",
        fling: {"basePower":10},
        spritenum: 730,
        num: 1218,
        gen: 8
    },
    tr89: {
        isNonstandard: null,
        name: "TR89",
        fling: {"basePower":110},
        spritenum: 723,
        num: 1219,
        gen: 8
    },
    tr90: {
        isNonstandard: null,
        name: "TR90",
        fling: {"basePower":90},
        spritenum: 738,
        num: 1220,
        gen: 8
    },
    tr91: {
        isNonstandard: null,
        name: "TR91",
        fling: {"basePower":10},
        spritenum: 724,
        num: 1221,
        gen: 8
    },
    tr92: {
        isNonstandard: null,
        name: "TR92",
        fling: {"basePower":80},
        spritenum: 738,
        num: 1222,
        gen: 8
    },
    tr93: {
        isNonstandard: null,
        name: "TR93",
        fling: {"basePower":85},
        spritenum: 737,
        num: 1223,
        gen: 8
    },
    tr94: {
        isNonstandard: null,
        name: "TR94",
        fling: {"basePower":95},
        spritenum: 725,
        num: 1224,
        gen: 8
    },
    tr95: {
        isNonstandard: null,
        name: "TR95",
        fling: {"basePower":80},
        spritenum: 737,
        num: 1225,
        gen: 8
    },
    tr96: {
        isNonstandard: null,
        name: "TR96",
        fling: {"basePower":90},
        spritenum: 727,
        num: 1226,
        gen: 8
    },
    tr97: {
        isNonstandard: null,
        name: "TR97",
        fling: {"basePower":85},
        spritenum: 734,
        num: 1227,
        gen: 8
    },
    tr98: {
        isNonstandard: null,
        name: "TR98",
        fling: {"basePower":85},
        spritenum: 731,
        num: 1228,
        gen: 8
    },
    tr99: {
        isNonstandard: null,
        name: "TR99",
        fling: {"basePower":80},
        spritenum: 722,
        num: 1229,
        gen: 8
    },
    twistedspoon: {
        onModifySpA() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Psychic') {
                return damage * 1.1;
            }
        },
        onBasePower() { },
        onModifySpAPriority: 1,
        name: "Twisted Spoon",
        spritenum: 520,
        fling: {"basePower":30},
        onBasePowerPriority: 15,
        num: 248,
        gen: 2
    },
    tyranitarite: {
        isNonstandard: null,
        name: "Tyranitarite",
        spritenum: 607,
        megaStone: "Tyranitar-Mega",
        megaEvolves: "Tyranitar",
        itemUser: ["Tyranitar"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 669,
        gen: 6
    },
    ultraball: {
        name: "Ultra Ball",
        spritenum: 521,
        num: 2,
        gen: 1,
        isPokeball: true
    },
    ultranecroziumz: {
        isNonstandard: null,
        name: "Ultranecrozium Z",
        spritenum: 687,
        onTakeItem: false,
        zMove: "Light That Burns the Sky",
        zMoveFrom: "Photon Geyser",
        itemUser: ["Necrozma-Ultra"],
        num: 923,
        gen: 7
    },
    upgrade: {
        isNonstandard: null,
        name: "Up-Grade",
        spritenum: 523,
        fling: {"basePower":30},
        num: 252,
        gen: 2
    },
    utilityumbrella: {
        name: "Utility Umbrella",
        spritenum: 718,
        fling: {"basePower":60},
        onStart(pokemon) {
            if (!pokemon.ignoringItem())
                return;
            if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
                this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
            }
        },
        onUpdate(pokemon) {
            if (!this.effectState.inactive)
                return;
            this.effectState.inactive = false;
            if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
                this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
            }
        },
        onEnd(pokemon) {
            if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
                this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
            }
            this.effectState.inactive = true;
        },
        num: 1123,
        gen: 8
    },
    venusaurite: {
        isNonstandard: null,
        name: "Venusaurite",
        spritenum: 608,
        megaStone: "Venusaur-Mega",
        megaEvolves: "Venusaur",
        itemUser: ["Venusaur"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: 659,
        gen: 6
    },
    wacanberry: {
        naturalGift: {"basePower":60,"type":"Electric"},
        name: "Wacan Berry",
        spritenum: 526,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 186,
        gen: 4
    },
    watergem: {
        isNonstandard: null,
        name: "Water Gem",
        spritenum: 528,
        isGem: true,
        onSourceTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status' || move.flags['pledgecombo'])
                return;
            if (move.type === 'Water' && source.useItem()) {
                source.addVolatile('gem');
            }
        },
        num: 549,
        gen: 5
    },
    watermemory: {
        isNonstandard: null,
        name: "Water Memory",
        spritenum: 677,
        onMemory: "Water",
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
                return false;
            }
            return true;
        },
        forcedForme: "Silvally-Water",
        itemUser: ["Silvally-Water"],
        num: 913,
        gen: 7
    },
    waterstone: {
        name: "Water Stone",
        spritenum: 529,
        fling: {"basePower":30},
        num: 84,
        gen: 1
    },
    wateriumz: {
        isNonstandard: null,
        name: "Waterium Z",
        spritenum: 633,
        onPlate: "Water",
        onTakeItem: false,
        zMove: true,
        zMoveType: "Water",
        forcedForme: "Arceus-Water",
        num: 778,
        gen: 7
    },
    watmelberry: {
        naturalGift: {"basePower":80,"type":"Fire"},
        isNonstandard: null,
        name: "Watmel Berry",
        spritenum: 530,
        isBerry: true,
        onEat: false,
        num: 181,
        gen: 3
    },
    waveincense: {
        isNonstandard: null,
        name: "Wave Incense",
        spritenum: 531,
        fling: {"basePower":10},
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Water') {
                return this.chainModify([4915, 4096]);
            }
        },
        num: 317,
        gen: 4
    },
    weaknesspolicy: {
        name: "Weakness Policy",
        spritenum: 609,
        fling: {"basePower":80},
        onDamagingHit(damage, target, source, move) {
            if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
                target.useItem();
            }
        },
        boosts: {"atk":2,"spa":2},
        num: 639,
        gen: 6
    },
    wellspringmask: {
		name: "Wellspring Mask",
		spritenum: 759,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Wellspring')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Wellspring",
		itemUser: ["Ogerpon-Wellspring"],
		num: 2407,
		gen: 9,
	},
    wepearberry: {
        naturalGift: {"basePower":70,"type":"Electric"},
        isNonstandard: null,
        name: "Wepear Berry",
        spritenum: 533,
        isBerry: true,
        onEat: false,
        num: 167,
        gen: 3
    },
    whippeddream: {
        isNonstandard: null,
        name: "Whipped Dream",
        spritenum: 692,
        fling: {"basePower":80},
        num: 646,
        gen: 6
    },
    whiteherb: {
        name: "White Herb",
        spritenum: 535,
        fling: {"basePower":10},
        onUpdate(pokemon) {
            let activate = false;
            const boosts = {};
            let i;
            for (i in pokemon.boosts) {
                if (pokemon.boosts[i] < 0) {
                    activate = true;
                    boosts[i] = 0;
                }
            }
            if (activate && pokemon.useItem()) {
                pokemon.setBoost(boosts);
                this.add('-clearnegativeboost', pokemon, '[silent]');
            }
        },
        num: 214,
        gen: 3
    },
    widelens: {
        onSourceModifyAccuracyPriority: 4,
        onSourceModifyAccuracy(accuracy) {
            if (typeof accuracy === 'number') {
                return accuracy * 1.1;
            }
        },
        name: "Wide Lens",
        spritenum: 537,
        fling: {"basePower":10},
        num: 265,
        gen: 4
    },
    wikiberry: {
        onUpdate() { },
        onResidualOrder: 10,
        onResidualSubOrder: 4,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        naturalGift: {"basePower":60,"type":"Rock"},
        onEat(pokemon) {
            this.heal(pokemon.baseMaxhp / 8);
            if (pokemon.getNature().minus === 'spa') {
                pokemon.addVolatile('confusion');
            }
        },
        isNonstandard: null,
        name: "Wiki Berry",
        spritenum: 538,
        isBerry: true,
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        num: 160,
        gen: 3
    },
    wiseglasses: {
        name: "Wise Glasses",
        spritenum: 539,
        fling: {"basePower":10},
        onBasePowerPriority: 16,
        onBasePower(basePower, user, target, move) {
            if (move.category === 'Special') {
                return this.chainModify([4505, 4096]);
            }
        },
        num: 267,
        gen: 4
    },
    yacheberry: {
        naturalGift: {"basePower":60,"type":"Ice"},
        name: "Yache Berry",
        spritenum: 567,
        isBerry: true,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
                const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
                if (hitSub)
                    return;
                if (target.eatItem()) {
                    this.debug('-50% reduction');
                    this.add('-enditem', target, this.effect, '[weaken]');
                    return this.chainModify(0.5);
                }
            }
        },
        onEat() { },
        num: 188,
        gen: 4
    },
    zapplate: {
        isNonstandard: null,
        name: "Zap Plate",
        spritenum: 572,
        onPlate: "Electric",
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (move.type === 'Electric') {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
                return false;
            }
            return true;
        },
        forcedForme: "Arceus-Electric",
        num: 300,
        gen: 4
    },
    zoomlens: {
        onSourceModifyAccuracyPriority: 4,
        onSourceModifyAccuracy(accuracy, target) {
            if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
                this.debug('Zoom Lens boosting accuracy');
                return accuracy * 1.2;
            }
        },
        name: "Zoom Lens",
        spritenum: 574,
        fling: {"basePower":10},
        num: 276,
        gen: 4
    },
    berserkgene: {
        isNonstandard: null,
        name: "Berserk Gene",
        spritenum: 388,
        onUpdate(pokemon) {
            if (pokemon.useItem()) {
                pokemon.addVolatile('confusion');
            }
        },
        boosts: {"atk":2},
        num: 0,
        gen: 2
    },
    berry: {
        isNonstandard: null,
        name: "Berry",
        spritenum: 319,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Poison"},
        onResidualOrder: 5,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        onEat(pokemon) {
            this.heal(10);
        },
        num: 155,
        gen: 2
    },
    bitterberry: {
        isNonstandard: null,
        name: "Bitter Berry",
        spritenum: 334,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Ground"},
        onUpdate(pokemon) {
            if (pokemon.volatiles['confusion']) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            pokemon.removeVolatile('confusion');
        },
        num: 156,
        gen: 2
    },
    burntberry: {
        isNonstandard: null,
        name: "Burnt Berry",
        spritenum: 13,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Ice"},
        onUpdate(pokemon) {
            if (pokemon.status === 'frz') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'frz') {
                pokemon.cureStatus();
            }
        },
        num: 153,
        gen: 2
    },
    goldberry: {
        isNonstandard: null,
        name: "Gold Berry",
        spritenum: 448,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Psychic"},
        onResidualOrder: 5,
        onResidual(pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                pokemon.eatItem();
            }
        },
        onTryEatItem(item, pokemon) {
            if (!this.runEvent('TryHeal', pokemon))
                return false;
        },
        onEat(pokemon) {
            this.heal(30);
        },
        num: 158,
        gen: 2
    },
    iceberry: {
        isNonstandard: null,
        name: "Ice Berry",
        spritenum: 381,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Grass"},
        onUpdate(pokemon) {
            if (pokemon.status === 'brn') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'brn') {
                pokemon.cureStatus();
            }
        },
        num: 152,
        gen: 2
    },
    mintberry: {
        isNonstandard: null,
        name: "Mint Berry",
        spritenum: 65,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Water"},
        onUpdate(pokemon) {
            if (pokemon.status === 'slp') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'slp') {
                pokemon.cureStatus();
            }
        },
        num: 150,
        gen: 2
    },
    miracleberry: {
        isNonstandard: null,
        name: "Miracle Berry",
        spritenum: 262,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Flying"},
        onUpdate(pokemon) {
            if (pokemon.status || pokemon.volatiles['confusion']) {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            pokemon.cureStatus();
            pokemon.removeVolatile('confusion');
        },
        num: 157,
        gen: 2
    },
    mysteryberry: {
        isNonstandard: null,
        name: "Mystery Berry",
        spritenum: 244,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Fighting"},
        onUpdate(pokemon) {
            if (!pokemon.hp)
                return;
            const moveSlot = pokemon.lastMove && pokemon.getMoveData(pokemon.lastMove.id);
            if (moveSlot && moveSlot.pp === 0) {
                pokemon.addVolatile('leppaberry');
                pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            let moveSlot;
            if (pokemon.volatiles['leppaberry']) {
                moveSlot = pokemon.volatiles['leppaberry'].moveSlot;
                pokemon.removeVolatile('leppaberry');
            }
            else {
                let pp = 99;
                for (const possibleMoveSlot of pokemon.moveSlots) {
                    if (possibleMoveSlot.pp < pp) {
                        moveSlot = possibleMoveSlot;
                        pp = moveSlot.pp;
                    }
                }
            }
            moveSlot.pp += 5;
            if (moveSlot.pp > moveSlot.maxpp)
                moveSlot.pp = moveSlot.maxpp;
            this.add('-activate', pokemon, 'item: Mystery Berry', moveSlot.move);
        },
        num: 154,
        gen: 2
    },
    pinkbow: {
        onBasePower() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Normal') {
                return damage * 1.1;
            }
        },
        isNonstandard: null,
        name: "Pink Bow",
        spritenum: 444,
        num: 251,
        gen: 2
    },
    polkadotbow: {
        onBasePower() { },
        onModifyDamage(damage, source, target, move) {
            if (move?.type === 'Normal') {
                return damage * 1.1;
            }
        },
        isNonstandard: null,
        name: "Polkadot Bow",
        spritenum: 444,
        num: 251,
        gen: 2
    },
    przcureberry: {
        isNonstandard: null,
        name: "PRZ Cure Berry",
        spritenum: 63,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Fire"},
        onUpdate(pokemon) {
            if (pokemon.status === 'par') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'par') {
                pokemon.cureStatus();
            }
        },
        num: 149,
        gen: 2
    },
    psncureberry: {
        isNonstandard: null,
        name: "PSN Cure Berry",
        spritenum: 333,
        isBerry: true,
        naturalGift: {"basePower":80,"type":"Electric"},
        onUpdate(pokemon) {
            if (pokemon.status === 'psn' || pokemon.status === 'tox') {
                pokemon.eatItem();
            }
        },
        onEat(pokemon) {
            if (pokemon.status === 'psn' || pokemon.status === 'tox') {
                pokemon.cureStatus();
            }
        },
        num: 151,
        gen: 2
    },
    crucibellite: {
        name: "Crucibellite",
        spritenum: 577,
        megaStone: "Crucibelle-Mega",
        megaEvolves: "Crucibelle",
        itemUser: ["Crucibelle"],
        onTakeItem(item, source) {
            if (item.megaEvolves === source.baseSpecies.baseSpecies)
                return false;
            return true;
        },
        num: -1,
        gen: 6,
        isNonstandard: "CAP"
    },
    vilevial: {
        name: "Vile Vial",
        spritenum: 752,
        fling: {"basePower":60},
        onBasePowerPriority: 15,
        onBasePower(basePower, user, target, move) {
            if (user.baseSpecies.num === -66 && ['Poison', 'Flying'].includes(move.type)) {
                return this.chainModify([4915, 4096]);
            }
        },
        onTakeItem(item, pokemon, source) {
            if (source?.baseSpecies.num === -66 || pokemon.baseSpecies.num === -66) {
                return false;
            }
            return true;
        },
        forcedForme: "Venomicon-Epilogue",
        itemUser: ["Venomicon-Epilogue"],
        num: -2,
        gen: 8,
        isNonstandard: "CAP"
    },
}