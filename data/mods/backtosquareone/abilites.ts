export const Abilities: {[k: string]: ModdedAbilityData} = {
    noability: {
        rating: 0.1,
        isNonstandard: "Past",
        name: "No Ability",
        num: 0
    },
    adaptability: {
        rating: 4,
        onModifyMove(move) {
            move.stab = 2;
        },
        name: "Adaptability",
        num: 91
    },
    aerilate: {
        onBasePower(basePower, pokemon, target, move) {
            if (move.typeChangerBoosted === this.effect)
                return this.chainModify([5325, 4096]);
        },
        rating: 4.5,
        onModifyTypePriority: -1,
        onModifyType(move, pokemon) {
            const noModifyType = [
                'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
            ];
            if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
                !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
                move.type = 'Flying';
                move.typeChangerBoosted = this.effect;
            }
        },
        onBasePowerPriority: 23,
        name: "Aerilate",
        num: 184
    },
    aftermath: {
        onDamagingHit(damage, target, source, move) {
            if (move.flags['contact'] && !target.hp) {
                this.damage(source.baseMaxhp / 4, source, target, null, true);
            }
        },
        rating: 2.5,
        name: "Aftermath",
        onDamagingHitOrder: 1,
        num: 106
    },
    airlock: {
        onSwitchIn() { },
        onStart() { },
        rating: 2,
        onEnd(pokemon) {
            this.eachEvent('WeatherChange', this.effect);
        },
        suppressWeather: true,
        name: "Air Lock",
        num: 76
    },
    analytic: {
        rating: 2.5,
        onBasePowerPriority: 21,
        onBasePower(basePower, pokemon) {
            let boosted = true;
            for (const target of this.getAllActive()) {
                if (target === pokemon)
                    continue;
                if (this.queue.willMove(target)) {
                    boosted = false;
                    break;
                }
            }
            if (boosted) {
                this.debug('Analytic boost');
                return this.chainModify([5325, 4096]);
            }
        },
        name: "Analytic",
        num: 148
    },
    angerpoint: {
        onAfterSubDamage(damage, target, source, move) {
            if (!target.hp)
                return;
            if (move && move.effectType === 'Move' && target.getMoveHitData(move).crit) {
                target.setBoost({ atk: 6 });
                this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
            }
        },
        rating: 1.5,
        onHit(target, source, move) {
            if (!target.hp)
                return;
            if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
                this.boost({ atk: 12 }, target, target);
            }
        },
        name: "Anger Point",
        num: 83
    },
    angershell: {
        onDamage(damage, target, source, effect) {
            if (effect.effectType === "Move" &&
                !effect.multihit &&
                (!effect.negateSecondary && !(effect.hasSheerForce && source.hasAbility('sheerforce')))) {
                this.effectState.checkedAngerShell = false;
            }
            else {
                this.effectState.checkedAngerShell = true;
            }
        },
        onTryEatItem(item) {
            const healingItems = [
                'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
            ];
            if (healingItems.includes(item.id)) {
                return this.effectState.checkedAngerShell;
            }
            return true;
        },
        onAfterMoveSecondary(target, source, move) {
            this.effectState.checkedAngerShell = true;
            if (!source || source === target || !target.hp || !move.totalDamage)
                return;
            const lastAttackedBy = target.getLastAttackedBy();
            if (!lastAttackedBy)
                return;
            const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
            if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
                this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, target, target);
            }
        },
        name: "Anger Shell",
        rating: 3,
        num: 271
    },
    anticipation: {
        onStart(pokemon) {
            for (const target of pokemon.foes()) {
                for (const moveSlot of target.moveSlots) {
                    const move = this.dex.moves.get(moveSlot.move);
                    if (move.category !== 'Status' && (this.dex.getImmunity(move.type, pokemon) && this.dex.getEffectiveness(move.type, pokemon) > 0 ||
                        move.ohko)) {
                        this.add('-ability', pokemon, 'Anticipation');
                        return;
                    }
                }
            }
        },
        rating: 0.5,
        name: "Anticipation",
        num: 107
    },
    arenatrap: {
        rating: 5,
        onFoeTrapPokemon(pokemon) {
            if (!pokemon.isAdjacent(this.effectState.target))
                return;
            if (pokemon.isGrounded()) {
                pokemon.tryTrap(true);
            }
        },
        onFoeMaybeTrapPokemon(pokemon, source) {
            if (!source)
                source = this.effectState.target;
            if (!source || !pokemon.isAdjacent(source))
                return;
            if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
                pokemon.maybeTrapped = true;
            }
        },
        name: "Arena Trap",
        num: 71
    },
    armortail: {
        onFoeTryMove(target, source, move) {
            const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
            if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
                return;
            }
            const armorTailHolder = this.effectState.target;
            if ((source.isAlly(armorTailHolder) || move.target === 'all') && move.priority > 0.1) {
                this.attrLastMove('[still]');
                this.add('cant', armorTailHolder, 'ability: Armor Tail', move, '[of] ' + target);
                return false;
            }
        },
        isBreakable: true,
        name: "Armor Tail",
        rating: 2.5,
        num: 296
    },
    aromaveil: {
        rating: 2,
        onAllyTryAddVolatile(status, target, source, effect) {
            if (['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment'].includes(status.id)) {
                if (effect.effectType === 'Move') {
                    const effectHolder = this.effectState.target;
                    this.add('-block', target, 'ability: Aroma Veil', '[of] ' + effectHolder);
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Aroma Veil",
        num: 165
    },
    asoneglastrier: {
        rating: 3.5,
        onPreStart(pokemon) {
            this.add('-ability', pokemon, 'As One');
            this.add('-ability', pokemon, 'Unnerve');
            this.effectState.unnerved = true;
        },
        onEnd() {
            this.effectState.unnerved = false;
        },
        onFoeTryEatItem() {
            return !this.effectState.unnerved;
        },
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                this.boost({ atk: length }, source, source, this.dex.abilities.get('chillingneigh'));
            }
        },
        isPermanent: true,
        name: "As One (Glastrier)",
        num: 266
    },
    asonespectrier: {
        rating: 3.5,
        onPreStart(pokemon) {
            this.add('-ability', pokemon, 'As One');
            this.add('-ability', pokemon, 'Unnerve');
            this.effectState.unnerved = true;
        },
        onEnd() {
            this.effectState.unnerved = false;
        },
        onFoeTryEatItem() {
            return !this.effectState.unnerved;
        },
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                this.boost({ spa: length }, source, source, this.dex.abilities.get('grimneigh'));
            }
        },
        isPermanent: true,
        name: "As One (Spectrier)",
        num: 267
    },
    aurabreak: {
        rating: 1,
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Aura Break');
        },
        onAnyTryPrimaryHit(target, source, move) {
            if (target === source || move.category === 'Status')
                return;
            move.hasAuraBreak = true;
        },
        isBreakable: true,
        name: "Aura Break",
        num: 188
    },
    baddreams: {
        onResidualOrder: 10,
        onResidualSubOrder: 10,
        rating: 1.5,
        onResidual(pokemon) {
            if (!pokemon.hp)
                return;
            for (const target of pokemon.foes()) {
                if (target.status === 'slp' || target.hasAbility('comatose')) {
                    this.damage(target.baseMaxhp / 8, target, pokemon);
                }
            }
        },
        name: "Bad Dreams",
        num: 123
    },
    ballfetch: {
        rating: 0,
        name: "Ball Fetch",
        num: 237
    },
    battery: {
        rating: 0,
        onAllyBasePowerPriority: 22,
        onAllyBasePower(basePower, attacker, defender, move) {
            if (attacker !== this.effectState.target && move.category === 'Special') {
                this.debug('Battery boost');
                return this.chainModify([5325, 4096]);
            }
        },
        name: "Battery",
        num: 217
    },
    battlearmor: {
        rating: 1,
        onCriticalHit: false,
        isBreakable: true,
        name: "Battle Armor",
        num: 4
    },
    battlebond: {
        onSourceAfterFaint(length, target, source, effect) {
            if (effect?.effectType !== 'Move') {
                return;
            }
            if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
                this.add('-activate', source, 'ability: Battle Bond');
                source.formeChange('Greninja-Ash', this.effect, true);
            }
        },
        onModifyMovePriority: -1,
        onModifyMove(move, attacker) {
            if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
                !attacker.transformed) {
                move.multihit = 3;
            }
        },
        isNonstandard: null,
        rating: 4,
        isPermanent: true,
        name: "Battle Bond",
        num: 210
    },
    beadsofruin: {
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Beads of Ruin');
        },
        onAnyModifySpD(spd, target, source, move) {
            const abilityHolder = this.effectState.target;
            if (target.hasAbility('Beads of Ruin'))
                return;
            if (!move.ruinedSpD?.hasAbility('Beads of Ruin'))
                move.ruinedSpD = abilityHolder;
            if (move.ruinedSpD !== abilityHolder)
                return;
            this.debug('Beads of Ruin SpD drop');
            return this.chainModify(0.75);
        },
        name: "Beads of Ruin",
        rating: 4.5,
        num: 284
    },
    beastboost: {
        rating: 3.5,
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                const bestStat = source.getBestStat(true, true);
                this.boost({ [bestStat]: length }, source);
            }
        },
        name: "Beast Boost",
        num: 224
    },
    berserk: {
        rating: 2,
        onDamage(damage, target, source, effect) {
            if (effect.effectType === "Move" &&
                !effect.multihit &&
                (!effect.negateSecondary && !(effect.hasSheerForce && source.hasAbility('sheerforce')))) {
                this.effectState.checkedBerserk = false;
            }
            else {
                this.effectState.checkedBerserk = true;
            }
        },
        onTryEatItem(item) {
            const healingItems = [
                'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
            ];
            if (healingItems.includes(item.id)) {
                return this.effectState.checkedBerserk;
            }
            return true;
        },
        onAfterMoveSecondary(target, source, move) {
            this.effectState.checkedBerserk = true;
            if (!source || source === target || !target.hp || !move.totalDamage)
                return;
            const lastAttackedBy = target.getLastAttackedBy();
            if (!lastAttackedBy)
                return;
            const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
            if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
                this.boost({ spa: 1 }, target, target);
            }
        },
        name: "Berserk",
        num: 201
    },
    bigpecks: {
        rating: 0.5,
        onTryBoost(boost, target, source, effect) {
            if (source && target === source)
                return;
            if (boost.def && boost.def < 0) {
                delete boost.def;
                if (!effect.secondaries && effect.id !== 'octolock') {
                    this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
                }
            }
        },
        isBreakable: true,
        name: "Big Pecks",
        num: 145
    },
    blaze: {
        onBasePowerPriority: 2,
        onBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
                this.debug('Blaze boost');
                return this.chainModify(1.5);
            }
        },
        name: "Blaze",
        rating: 2,
        num: 66
    },
    bulletproof: {
        rating: 3,
        onTryHit(pokemon, target, move) {
            if (move.flags['bullet']) {
                this.add('-immune', pokemon, '[from] ability: Bulletproof');
                return null;
            }
        },
        isBreakable: true,
        name: "Bulletproof",
        num: 171
    },
    cheekpouch: {
        rating: 2,
        onEatItem(item, pokemon) {
            this.heal(pokemon.baseMaxhp / 3);
        },
        name: "Cheek Pouch",
        num: 167
    },
    chillingneigh: {
        rating: 3,
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                this.boost({ atk: length }, source);
            }
        },
        name: "Chilling Neigh",
        num: 264
    },
    chlorophyll: {
        rating: 3,
        onModifySpe(spe, pokemon) {
            if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
                return this.chainModify(2);
            }
        },
        name: "Chlorophyll",
        num: 34
    },
    clearbody: {
        rating: 2,
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
                this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
            }
        },
        isBreakable: true,
        name: "Clear Body",
        num: 29
    },
    cloudnine: {
        onSwitchIn() { },
        onStart() { },
        rating: 2,
        onEnd(pokemon) {
            this.eachEvent('WeatherChange', this.effect);
        },
        suppressWeather: true,
        name: "Cloud Nine",
        num: 13
    },
    colorchange: {
        onDamagingHit(damage, target, source, move) {
            if (!damage || !target.hp)
                return;
            const type = move.type;
            if (target.isActive && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
                if (!target.setType(type))
                    return false;
                this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
            }
        },
        onAfterMoveSecondary() { },
        rating: 0,
        name: "Color Change",
        num: 16
    },
    comatose: {
        rating: 4,
        onStart(pokemon) {
            this.add('-ability', pokemon, 'Comatose');
        },
        onSetStatus(status, target, source, effect) {
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Comatose');
            }
            return false;
        },
        isPermanent: true,
        name: "Comatose",
        num: 213
    },
    commander: {
        onUpdate(pokemon) {
            const ally = pokemon.allies()[0];
            if (!ally || pokemon.baseSpecies.baseSpecies !== 'Tatsugiri' || ally.baseSpecies.baseSpecies !== 'Dondozo') {
                // Handle any edge cases
                if (pokemon.getVolatile('commanding'))
                    pokemon.removeVolatile('commanding');
                return;
            }
            if (!pokemon.getVolatile('commanding')) {
                // If Dondozo already was commanded this fails
                if (ally.getVolatile('commanded'))
                    return;
                // Cancel all actions this turn for pokemon if applicable
                this.queue.cancelAction(pokemon);
                // Add volatiles to both pokemon
                this.add('-activate', pokemon, 'ability: Commander', '[of] ' + ally);
                pokemon.addVolatile('commanding');
                ally.addVolatile('commanded', pokemon);
                // Continued in conditions.ts in the volatiles
            }
            else {
                if (!ally.fainted)
                    return;
                pokemon.removeVolatile('commanding');
            }
        },
        isPermanent: true,
        name: "Commander",
        rating: 0,
        num: 279
    },
    competitive: {
        rating: 2.5,
        onAfterEachBoost(boost, target, source, effect) {
            if (!source || target.isAlly(source)) {
                if (effect.id === 'stickyweb') {
                    this.hint("Court Change Sticky Web counts as lowering your own Speed, and Competitive only affects stats lowered by foes.", true, source.side);
                }
                return;
            }
            let statsLowered = false;
            let i;
            for (i in boost) {
                if (boost[i] < 0) {
                    statsLowered = true;
                }
            }
            if (statsLowered) {
                this.boost({ spa: 2 }, target, target, null, false, true);
            }
        },
        name: "Competitive",
        num: 172
    },
    compoundeyes: {
        onSourceModifyAccuracyPriority: 9,
        onSourceModifyAccuracy(accuracy) {
            if (typeof accuracy !== 'number')
                return;
            this.debug('compoundeyes - enhancing accuracy');
            return accuracy * 1.3;
        },
        rating: 3,
        name: "Compound Eyes",
        num: 14
    },
    contrary: {
        rating: 4.5,
        onChangeBoost(boost, target, source, effect) {
            if (effect && effect.id === 'zpower')
                return;
            let i;
            for (i in boost) {
                boost[i] *= -1;
            }
        },
        isBreakable: true,
        name: "Contrary",
        num: 126
    },
    corrosion: {
        rating: 2.5,
        name: "Corrosion",
        num: 212
    },
    costar: {
        onStart(pokemon) {
            const ally = pokemon.allies()[0];
            if (!ally)
                return;
            let i;
            for (i in ally.boosts) {
                pokemon.boosts[i] = ally.boosts[i];
            }
            const volatilesToCopy = ['focusenergy', 'gmaxchistrike', 'laserfocus'];
            for (const volatile of volatilesToCopy) {
                if (ally.volatiles[volatile]) {
                    pokemon.addVolatile(volatile);
                    if (volatile === 'gmaxchistrike')
                        pokemon.volatiles[volatile].layers = ally.volatiles[volatile].layers;
                }
                else {
                    pokemon.removeVolatile(volatile);
                }
            }
            this.add('-copyboost', pokemon, ally, '[from] ability: Costar');
        },
        name: "Costar",
        rating: 0,
        num: 294
    },
    cottondown: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            let activated = false;
            for (const pokemon of this.getAllActive()) {
                if (pokemon === target || pokemon.fainted)
                    continue;
                if (!activated) {
                    this.add('-ability', target, 'Cotton Down');
                    activated = true;
                }
                this.boost({ spe: -1 }, pokemon, target, null, true);
            }
        },
        name: "Cotton Down",
        num: 238
    },
    cudchew: {
        onEatItem(item, pokemon) {
            if (item.isBerry && pokemon.addVolatile('cudchew')) {
                pokemon.volatiles['cudchew'].berry = item;
            }
        },
        onEnd(pokemon) {
            delete pokemon.volatiles['cudchew'];
        },
        condition: {
			noCopy: true,
			duration: 2,
			onRestart() {
                this.effectState.duration = 2;
            },
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onEnd(pokemon) {
                if (pokemon.hp) {
                    const item = this.effectState.berry;
                    this.add('-activate', pokemon, 'ability: Cud Chew');
                    this.add('-enditem', pokemon, item.name, '[eat]');
                    if (this.singleEvent('Eat', item, null, pokemon, null, null)) {
                        this.runEvent('EatItem', pokemon, null, null, item);
                    }
                    if (item.onEat)
                        pokemon.ateBerry = true;
                }
            } 
		},
        name: "Cud Chew",
        rating: 2,
        num: 291
    },
    curiousmedicine: {
        rating: 0,
        onStart(pokemon) {
            for (const ally of pokemon.adjacentAllies()) {
                ally.clearBoosts();
                this.add('-clearboost', ally, '[from] ability: Curious Medicine', '[of] ' + pokemon);
            }
        },
        name: "Curious Medicine",
        num: 261
    },
    cursedbody: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            if (source.volatiles['disable'])
                return;
            if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
                if (this.randomChance(3, 10)) {
                    source.addVolatile('disable', this.effectState.target);
                }
            }
        },
        name: "Cursed Body",
        num: 130
    },
    cutecharm: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact']) {
                if (this.randomChance(1, 3)) {
                    source.addVolatile('attract', target);
                }
            }
        },
        rating: 0.5,
        name: "Cute Charm",
        num: 56
    },
    damp: {
        rating: 1,
        onAnyTryMove(target, source, effect) {
            if (['explosion', 'mindblown', 'mistyexplosion', 'selfdestruct'].includes(effect.id)) {
                this.attrLastMove('[still]');
                this.add('cant', this.effectState.target, 'ability: Damp', effect, '[of] ' + target);
                return false;
            }
        },
        onAnyDamage(damage, target, source, effect) {
            if (effect && effect.name === 'Aftermath') {
                return false;
            }
        },
        isBreakable: true,
        name: "Damp",
        num: 6
    },
    dancer: {
        rating: 1.5,
        name: "Dancer",
        num: 216
    },
    darkaura: {
        isBreakable: true,
        rating: 3,
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Dark Aura');
        },
        onAnyBasePowerPriority: 20,
        onAnyBasePower(basePower, source, target, move) {
            if (target === source || move.category === 'Status' || move.type !== 'Dark')
                return;
            if (!move.auraBooster?.hasAbility('Dark Aura'))
                move.auraBooster = this.effectState.target;
            if (move.auraBooster !== this.effectState.target)
                return;
            return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
        },
        name: "Dark Aura",
        num: 186
    },
    dauntlessshield: {
        onStart(pokemon) {
            this.boost({ def: 1 }, pokemon);
        },
        rating: 3.5,
        name: "Dauntless Shield",
        num: 235
    },
    dazzling: {
        rating: 2.5,
        onFoeTryMove(target, source, move) {
            const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
            if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
                return;
            }
            const dazzlingHolder = this.effectState.target;
            if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
                this.attrLastMove('[still]');
                this.add('cant', dazzlingHolder, 'ability: Dazzling', move, '[of] ' + target);
                return false;
            }
        },
        isBreakable: true,
        name: "Dazzling",
        num: 219
    },
    defeatist: {
        rating: -1,
        onModifyAtkPriority: 5,
        onModifyAtk(atk, pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                return this.chainModify(0.5);
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, pokemon) {
            if (pokemon.hp <= pokemon.maxhp / 2) {
                return this.chainModify(0.5);
            }
        },
        name: "Defeatist",
        num: 129
    },
    defiant: {
        rating: 2.5,
        onAfterEachBoost(boost, target, source, effect) {
            if (!source || target.isAlly(source)) {
                if (effect.id === 'stickyweb') {
                    this.hint("Court Change Sticky Web counts as lowering your own Speed, and Defiant only affects stats lowered by foes.", true, source.side);
                }
                return;
            }
            let statsLowered = false;
            let i;
            for (i in boost) {
                if (boost[i] < 0) {
                    statsLowered = true;
                }
            }
            if (statsLowered) {
                this.boost({ atk: 2 }, target, target, null, false, true);
            }
        },
        name: "Defiant",
        num: 128
    },
    deltastream: {
        rating: 4,
        onStart(source) {
            this.field.setWeather('deltastream');
        },
        onAnySetWeather(target, source, weather) {
            const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
            if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id))
                return false;
        },
        onEnd(pokemon) {
            if (this.field.weatherState.source !== pokemon)
                return;
            for (const target of this.getAllActive()) {
                if (target === pokemon)
                    continue;
                if (target.hasAbility('deltastream')) {
                    this.field.weatherState.source = target;
                    return;
                }
            }
            this.field.clearWeather();
        },
        name: "Delta Stream",
        num: 191
    },
    desolateland: {
        rating: 4.5,
        onStart(source) {
            this.field.setWeather('desolateland');
        },
        onAnySetWeather(target, source, weather) {
            const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
            if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id))
                return false;
        },
        onEnd(pokemon) {
            if (this.field.weatherState.source !== pokemon)
                return;
            for (const target of this.getAllActive()) {
                if (target === pokemon)
                    continue;
                if (target.hasAbility('desolateland')) {
                    this.field.weatherState.source = target;
                    return;
                }
            }
            this.field.clearWeather();
        },
        name: "Desolate Land",
        num: 190
    },
    disguise: {
        onDamage(damage, target, source, effect) {
            if (effect && effect.effectType === 'Move' &&
                ['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed) {
                if (["rollout", "iceball"].includes(effect.id)) {
                    source.volatiles[effect.id].contactHitCount--;
                }
                this.add("-activate", target, "ability: Disguise");
                this.effectState.busted = true;
                return 0;
            }
        },
        onUpdate(pokemon) {
            if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
                const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
                pokemon.formeChange(speciesid, this.effect, true);
            }
        },
        rating: 3.5,
        onDamagePriority: 1,
        onCriticalHit(target, source, move) {
            if (!target)
                return;
            if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
                return;
            }
            const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
            if (hitSub)
                return;
            if (!target.runImmunity(move.type))
                return;
            return false;
        },
        onEffectiveness(typeMod, target, type, move) {
            if (!target || move.category === 'Status')
                return;
            if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
                return;
            }
            const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
            if (hitSub)
                return;
            if (!target.runImmunity(move.type))
                return;
            return 0;
        },
        isBreakable: true,
        isPermanent: true,
        name: "Disguise",
        num: 209
    },
    download: {
        rating: 3.5,
        onStart(pokemon) {
            let totaldef = 0;
            let totalspd = 0;
            for (const target of pokemon.foes()) {
                totaldef += target.getStat('def', false, true);
                totalspd += target.getStat('spd', false, true);
            }
            if (totaldef && totaldef >= totalspd) {
                this.boost({ spa: 1 });
            }
            else if (totalspd) {
                this.boost({ atk: 1 });
            }
        },
        name: "Download",
        num: 88
    },
    dragonsmaw: {
        rating: 3.5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Dragon') {
                this.debug('Dragon\'s Maw boost');
                return this.chainModify(1.5);
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Dragon') {
                this.debug('Dragon\'s Maw boost');
                return this.chainModify(1.5);
            }
        },
        name: "Dragon's Maw",
        num: 263
    },
    drizzle: {
        rating: 4,
        onStart(source) {
            for (const action of this.queue) {
                if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre')
                    return;
                if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal')
                    break;
            }
            this.field.setWeather('raindance');
        },
        name: "Drizzle",
        num: 2
    },
    drought: {
        rating: 4,
        onStart(source) {
            for (const action of this.queue) {
                if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'groudon')
                    return;
                if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal')
                    break;
            }
            this.field.setWeather('sunnyday');
        },
        name: "Drought",
        num: 70
    },
    dryskin: {
        rating: 3,
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Water') {
                if (!this.heal(target.baseMaxhp / 4)) {
                    this.add('-immune', target, '[from] ability: Dry Skin');
                }
                return null;
            }
        },
        onSourceBasePowerPriority: 17,
        onSourceBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Fire') {
                return this.chainModify(1.25);
            }
        },
        onWeather(target, source, effect) {
            if (target.hasItem('utilityumbrella'))
                return;
            if (effect.id === 'raindance' || effect.id === 'primordialsea') {
                this.heal(target.baseMaxhp / 8);
            }
            else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
                this.damage(target.baseMaxhp / 8, target, target);
            }
        },
        isBreakable: true,
        name: "Dry Skin",
        num: 87
    },
    earlybird: {
        rating: 1.5,
        name: "Early Bird",
        num: 48
    },
    eartheater: {
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Ground') {
                if (!this.heal(target.baseMaxhp / 4)) {
                    this.add('-immune', target, '[from] ability: Earth Eater');
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Earth Eater",
        rating: 3.5,
        num: 297
    },
    effectspore: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact'] && !source.status) {
                const r = this.random(300);
                if (r < 10) {
                    source.setStatus('slp', target);
                }
                else if (r < 20) {
                    source.setStatus('par', target);
                }
                else if (r < 30) {
                    source.setStatus('psn', target);
                }
            }
        },
        rating: 2,
        name: "Effect Spore",
        num: 27
    },
    electricsurge: {
        rating: 4,
        onStart(source) {
            this.field.setTerrain('electricterrain');
        },
        name: "Electric Surge",
        num: 226
    },
    electromorphosis: {
        onDamagingHitOrder: 1,
        onDamagingHit(damage, target, source, move) {
            target.addVolatile('charge');
        },
        name: "Electromorphosis",
        rating: 2.5,
        num: 280
    },
    embodyaspectcornerstone: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Cornerstone-Tera' && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({def: 1}, pokemon);
			}
		},
		onSwitchIn() {
			delete this.effectState.embodied;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Embody Aspect (Cornerstone)",
		rating: 3.5,
		num: 304,
	},
	embodyaspecthearthflame: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Hearthflame-Tera' && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({atk: 1}, pokemon);
			}
		},
		onSwitchIn() {
			delete this.effectState.embodied;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Embody Aspect (Hearthflame)",
		rating: 3.5,
		num: 303,
	},
	embodyaspectteal: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Teal-Tera' && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({spe: 1}, pokemon);
			}
		},
		onSwitchIn() {
			delete this.effectState.embodied;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Embody Aspect (Teal)",
		rating: 3.5,
		num: 301,
	},
	embodyaspectwellspring: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Wellspring-Tera' && !this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({spd: 1}, pokemon);
			}
		},
		onSwitchIn() {
			delete this.effectState.embodied;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Embody Aspect (Wellspring)",
		rating: 3.5,
		num: 302,
	},
    emergencyexit: {
        rating: 1,
        onEmergencyExit(target) {
            if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag)
                return;
            for (const side of this.sides) {
                for (const active of side.active) {
                    active.switchFlag = false;
                }
            }
            target.switchFlag = true;
            this.add('-activate', target, 'ability: Emergency Exit');
        },
        name: "Emergency Exit",
        num: 194
    },
    fairyaura: {
        isBreakable: true,
        rating: 3,
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Fairy Aura');
        },
        onAnyBasePowerPriority: 20,
        onAnyBasePower(basePower, source, target, move) {
            if (target === source || move.category === 'Status' || move.type !== 'Fairy')
                return;
            if (!move.auraBooster?.hasAbility('Fairy Aura'))
                move.auraBooster = this.effectState.target;
            if (move.auraBooster !== this.effectState.target)
                return;
            return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
        },
        name: "Fairy Aura",
        num: 187
    },
    filter: {
        rating: 3,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.getMoveHitData(move).typeMod > 0) {
                this.debug('Filter neutralize');
                return this.chainModify(0.75);
            }
        },
        isBreakable: true,
        name: "Filter",
        num: 111
    },
    flamebody: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact']) {
                if (this.randomChance(1, 3)) {
                    source.trySetStatus('brn', target);
                }
            }
        },
        rating: 2,
        name: "Flame Body",
        num: 49
    },
    flareboost: {
        rating: 2,
        onBasePowerPriority: 19,
        onBasePower(basePower, attacker, defender, move) {
            if (attacker.status === 'brn' && move.category === 'Special') {
                return this.chainModify(1.5);
            }
        },
        name: "Flare Boost",
        num: 138
    },
    flashfire: {
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Fire') {
                if (move.id === 'willowisp' && (target.hasType('Fire') || target.status || target.volatiles['substitute'])) {
                    return;
                }
                if (target.status === 'frz') {
                    return;
                }
                if (!target.addVolatile('flashfire')) {
                    this.add('-immune', target, '[from] ability: Flash Fire');
                }
                return null;
            }
        },
        condition: {
			noCopy: true,
			onStart(target) {
                this.add('-start', target, 'ability: Flash Fire');
            },
			onModifyDamagePhase1(atk, attacker, defender, move) {
                if (move.type === 'Fire') {
                    this.debug('Flash Fire boost');
                    return this.chainModify(1.5);
                }
            },
			onEnd(target) {
                this.add('-end', target, 'ability: Flash Fire', '[silent]');
            } 
		},
        rating: 3.5,
        onEnd(pokemon) {
            pokemon.removeVolatile('flashfire');
        },
        isBreakable: true,
        name: "Flash Fire",
        num: 18
    },
    flowergift: {
        onAllyModifyAtk(atk) {
            if (this.field.isWeather('sunnyday')) {
                return this.chainModify(1.5);
            }
        },
        onAllyModifySpD(spd) {
            if (this.field.isWeather('sunnyday')) {
                return this.chainModify(1.5);
            }
        },
        rating: 1,
        onStart(pokemon) {
            this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
        },
        onWeatherChange(pokemon) {
            if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed)
                return;
            if (!pokemon.hp)
                return;
            if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
                if (pokemon.species.id !== 'cherrimsunshine') {
                    pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
                }
            }
            else {
                if (pokemon.species.id === 'cherrimsunshine') {
                    pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
                }
            }
        },
        onAllyModifyAtkPriority: 3,
        onAllyModifySpDPriority: 4,
        isBreakable: true,
        name: "Flower Gift",
        num: 122
    },
    flowerveil: {
        rating: 0,
        onAllyTryBoost(boost, target, source, effect) {
            if ((source && target === source) || !target.hasType('Grass'))
                return;
            let showMsg = false;
            let i;
            for (i in boost) {
                if (boost[i] < 0) {
                    delete boost[i];
                    showMsg = true;
                }
            }
            if (showMsg && !effect.secondaries) {
                const effectHolder = this.effectState.target;
                this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
            }
        },
        onAllySetStatus(status, target, source, effect) {
            if (target.hasType('Grass') && source && target !== source && effect && effect.id !== 'yawn') {
                this.debug('interrupting setStatus with Flower Veil');
                if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
                    const effectHolder = this.effectState.target;
                    this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
                }
                return null;
            }
        },
        onAllyTryAddVolatile(status, target) {
            if (target.hasType('Grass') && status.id === 'yawn') {
                this.debug('Flower Veil blocking yawn');
                const effectHolder = this.effectState.target;
                this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
                return null;
            }
        },
        isBreakable: true,
        name: "Flower Veil",
        num: 166
    },
    fluffy: {
        rating: 3.5,
        onSourceModifyDamage(damage, source, target, move) {
            let mod = 1;
            if (move.type === 'Fire')
                mod *= 2;
            if (move.flags['contact'])
                mod /= 2;
            return this.chainModify(mod);
        },
        isBreakable: true,
        name: "Fluffy",
        num: 218
    },
    forecast: {
        rating: 2,
        onStart(pokemon) {
            this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
        },
        onWeatherChange(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed)
                return;
            let forme = null;
            switch (pokemon.effectiveWeather()) {
                case 'sunnyday':
                case 'desolateland':
                    if (pokemon.species.id !== 'castformsunny')
                        forme = 'Castform-Sunny';
                    break;
                case 'raindance':
                case 'primordialsea':
                    if (pokemon.species.id !== 'castformrainy')
                        forme = 'Castform-Rainy';
                    break;
                case 'hail':
                case 'snow':
                    if (pokemon.species.id !== 'castformsnowy')
                        forme = 'Castform-Snowy';
                    break;
                default:
                    if (pokemon.species.id !== 'castform')
                        forme = 'Castform';
                    break;
            }
            if (pokemon.isActive && forme) {
                pokemon.formeChange(forme, this.effect, false, '[msg]');
            }
        },
        name: "Forecast",
        num: 59
    },
    forewarn: {
        onStart(pokemon) {
            let warnMoves = [];
            let warnBp = 1;
            for (const target of pokemon.foes()) {
                for (const moveSlot of target.moveSlots) {
                    const move = this.dex.moves.get(moveSlot.move);
                    let bp = move.basePower;
                    if (move.ohko)
                        bp = 160;
                    if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat')
                        bp = 120;
                    if (!bp && move.category !== 'Status')
                        bp = 80;
                    if (bp > warnBp) {
                        warnMoves = [move];
                        warnBp = bp;
                    }
                    else if (bp === warnBp) {
                        warnMoves.push(move);
                    }
                }
            }
            if (!warnMoves.length)
                return;
            const warnMove = this.sample(warnMoves);
            this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
        },
        rating: 0.5,
        name: "Forewarn",
        num: 108
    },
    friendguard: {
        rating: 0,
        name: "Friend Guard",
        onAnyModifyDamage(damage, source, target, move) {
            if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
                this.debug('Friend Guard weaken');
                return this.chainModify(0.75);
            }
        },
        isBreakable: true,
        num: 132
    },
    frisk: {
        onStart(pokemon) {
            for (const target of pokemon.foes()) {
                if (target.item && !target.itemState.knockedOff) {
                    this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
                }
            }
        },
        rating: 1.5,
        name: "Frisk",
        num: 119
    },
    fullmetalbody: {
        rating: 2,
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
                this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
            }
        },
        name: "Full Metal Body",
        num: 230
    },
    furcoat: {
        rating: 4,
        onModifyDefPriority: 6,
        onModifyDef(def) {
            return this.chainModify(2);
        },
        isBreakable: true,
        name: "Fur Coat",
        num: 169
    },
    galewings: {
        onModifyPriority(priority, pokemon, target, move) {
            if (move && move.type === 'Flying')
                return priority + 1;
        },
        rating: 4,
        name: "Gale Wings",
        num: 177
    },
    galvanize: {
        rating: 4,
        onModifyTypePriority: -1,
        onModifyType(move, pokemon) {
            const noModifyType = [
                'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
            ];
            if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
                !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
                move.type = 'Electric';
                move.typeChangerBoosted = this.effect;
            }
        },
        onBasePowerPriority: 23,
        onBasePower(basePower, pokemon, target, move) {
            if (move.typeChangerBoosted === this.effect)
                return this.chainModify([4915, 4096]);
        },
        name: "Galvanize",
        num: 206
    },
    gluttony: {
        rating: 1.5,
        name: "Gluttony",
        num: 82,
        onStart(pokemon) {
            pokemon.abilityState.gluttony = true;
        },
        onDamage(item, pokemon) {
            pokemon.abilityState.gluttony = true;
        }
    },
    goodasgold: {
        onTryHit(target, source, move) {
            if (move.category === 'Status' && target !== source) {
                this.add('-immune', target, '[from] ability: Good as Gold');
                return null;
            }
        },
        isBreakable: true,
        name: "Good as Gold",
        rating: 5,
        num: 283
    },
    gooey: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            if (this.checkMoveMakesContact(move, source, target, true)) {
                this.add('-ability', target, 'Gooey');
                this.boost({ spe: -1 }, source, target, null, true);
            }
        },
        name: "Gooey",
        num: 183
    },
    gorillatactics: {
        rating: 4.5,
        onStart(pokemon) {
            pokemon.abilityState.choiceLock = "";
        },
        onBeforeMove(pokemon, target, move) {
            if (move.isZOrMaxPowered || move.id === 'struggle')
                return;
            if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
                // Fails unless ability is being ignored (these events will not run), no PP lost.
                this.addMove('move', pokemon, move.name);
                this.attrLastMove('[still]');
                this.debug("Disabled by Gorilla Tactics");
                this.add('-fail', pokemon);
                return false;
            }
        },
        onModifyMove(move, pokemon) {
            if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle')
                return;
            pokemon.abilityState.choiceLock = move.id;
        },
        onModifyAtkPriority: 1,
        onModifyAtk(atk, pokemon) {
            if (pokemon.volatiles['dynamax'])
                return;
            // PLACEHOLDER
            this.debug('Gorilla Tactics Atk Boost');
            return this.chainModify(1.5);
        },
        onDisableMove(pokemon) {
            if (!pokemon.abilityState.choiceLock)
                return;
            if (pokemon.volatiles['dynamax'])
                return;
            for (const moveSlot of pokemon.moveSlots) {
                if (moveSlot.id !== pokemon.abilityState.choiceLock) {
                    pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
                }
            }
        },
        onEnd(pokemon) {
            pokemon.abilityState.choiceLock = "";
        },
        name: "Gorilla Tactics",
        num: 255
    },
    grasspelt: {
        rating: 0.5,
        onModifyDefPriority: 6,
        onModifyDef(pokemon) {
            if (this.field.isTerrain('grassyterrain'))
                return this.chainModify(1.5);
        },
        isBreakable: true,
        name: "Grass Pelt",
        num: 179
    },
    grassysurge: {
        rating: 4,
        onStart(source) {
            this.field.setTerrain('grassyterrain');
        },
        name: "Grassy Surge",
        num: 229
    },
    grimneigh: {
        rating: 3,
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                this.boost({ spa: length }, source);
            }
        },
        name: "Grim Neigh",
        num: 265
    },
    guarddog: {
        onDragOutPriority: 1,
        onDragOut(pokemon) {
            this.add('-activate', pokemon, 'ability: Guard Dog');
            return null;
        },
        onTryBoost(boost, target, source, effect) {
            if (effect.name === 'Intimidate' && boost.atk) {
                delete boost.atk;
                this.boost({ atk: 1 }, target, target, null, false, true);
            }
        },
        name: "Guard Dog",
        rating: 2,
        num: 275
    },
    gulpmissile: {
        rating: 2.5,
        onDamagingHit(damage, target, source, move) {
            if (!source.hp || !source.isActive || target.transformed || target.isSemiInvulnerable())
                return;
            if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
                this.damage(source.baseMaxhp / 4, source, target);
                if (target.species.id === 'cramorantgulping') {
                    this.boost({ def: -1 }, source, target, null, true);
                }
                else {
                    source.trySetStatus('par', target, move);
                }
                target.formeChange('cramorant', move);
            }
        },
        onSourceTryPrimaryHit(target, source, effect) {
            if (effect && effect.id === 'surf' && source.hasAbility('gulpmissile') &&
                source.species.name === 'Cramorant' && !source.transformed) {
                const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
                source.formeChange(forme, effect);
            }
        },
        isPermanent: true,
        name: "Gulp Missile",
        num: 241
    },
    guts: {
        rating: 3,
        onModifyAtkPriority: 5,
        onModifyAtk(atk, pokemon) {
            if (pokemon.status) {
                return this.chainModify(1.5);
            }
        },
        name: "Guts",
        num: 62
    },
    hadronengine: {
        onStart(pokemon) {
            if (!this.field.setTerrain('electricterrain') && this.field.isTerrain('electricterrain')) {
                this.add('-activate', pokemon, 'ability: Hadron Engine');
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, attacker, defender, move) {
            if (this.field.isTerrain('electricterrain')) {
                this.debug('Hadron Engine boost');
                return this.chainModify([5461, 4096]);
            }
        },
        isPermanent: true,
        name: "Hadron Engine",
        rating: 4.5,
        num: 289
    },
    harvest: {
        rating: 2.5,
        name: "Harvest",
        onResidualOrder: 28,
        onResidualSubOrder: 2,
        onResidual(pokemon) {
            if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
                if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
                    pokemon.setItem(pokemon.lastItem);
                    pokemon.lastItem = '';
                    this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
                }
            }
        },
        num: 139
    },
    healer: {
        rating: 0,
        name: "Healer",
        onResidualOrder: 5,
        onResidualSubOrder: 3,
        onResidual(pokemon) {
            for (const allyActive of pokemon.adjacentAllies()) {
                if (allyActive.status && this.randomChance(3, 10)) {
                    this.add('-activate', pokemon, 'ability: Healer');
                    allyActive.cureStatus();
                }
            }
        },
        num: 131
    },
    heatproof: {
        rating: 2,
        onSourceBasePowerPriority: 18,
        onSourceBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Fire') {
                return this.chainModify(0.5);
            }
        },
        onDamage(damage, target, source, effect) {
            if (effect && effect.id === 'brn') {
                return damage / 2;
            }
        },
        isBreakable: true,
        name: "Heatproof",
        num: 85
    },
    heavymetal: {
        rating: 0,
        onModifyWeightPriority: 1,
        onModifyWeight(weighthg) {
            return weighthg * 2;
        },
        isBreakable: true,
        name: "Heavy Metal",
        num: 134
    },
    honeygather: {
        rating: 0,
        name: "Honey Gather",
        num: 118
    },
    hospitality: {
		onStart(pokemon) {
			for (const ally of pokemon.adjacentAllies()) {
				this.heal(ally.baseMaxhp / 4, ally, pokemon);
			}
		},
		flags: {},
		name: "Hospitality",
		rating: 0,
		num: 299,
	},
    hugepower: {
        rating: 5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk) {
            return this.chainModify(2);
        },
        name: "Huge Power",
        num: 37
    },
    hungerswitch: {
        rating: 1,
        onResidualOrder: 29,
        onResidual(pokemon) {
            if (pokemon.species.baseSpecies !== 'Morpeko' || pokemon.transformed)
                return;
            const targetForme = pokemon.species.name === 'Morpeko' ? 'Morpeko-Hangry' : 'Morpeko';
            pokemon.formeChange(targetForme);
        },
        name: "Hunger Switch",
        num: 258
    },
    hustle: {
        onSourceModifyAccuracyPriority: 7,
        onSourceModifyAccuracy(accuracy, target, source, move) {
            if (move.category === 'Physical' && typeof accuracy === 'number') {
                return accuracy * 0.8;
            }
        },
        rating: 3.5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk) {
            return this.modify(atk, 1.5);
        },
        name: "Hustle",
        num: 55
    },
    hydration: {
        onWeather(target, source, effect) {
            if (effect.id === 'raindance' && target.status) {
                this.add('-activate', target, 'ability: Hydration');
                target.cureStatus();
            }
        },
        name: "Hydration",
        rating: 1.5,
        num: 93
    },
    hypercutter: {
        rating: 1.5,
        onTryBoost(boost, target, source, effect) {
            if (source && target === source)
                return;
            if (boost.atk && boost.atk < 0) {
                delete boost.atk;
                if (!effect.secondaries) {
                    this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
                }
            }
        },
        isBreakable: true,
        name: "Hyper Cutter",
        num: 52
    },
    icebody: {
        rating: 1,
        onWeather(target, source, effect) {
            if (effect.id === 'hail' || effect.id === 'snow') {
                this.heal(target.baseMaxhp / 16);
            }
        },
        onImmunity(type, pokemon) {
            if (type === 'hail')
                return false;
        },
        name: "Ice Body",
        num: 115
    },
    iceface: {
        rating: 3,
        onStart(pokemon) {
            if (this.field.isWeather(['hail', 'snow']) &&
                pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
                this.add('-activate', pokemon, 'ability: Ice Face');
                this.effectState.busted = false;
                pokemon.formeChange('Eiscue', this.effect, true);
            }
        },
        onDamagePriority: 1,
        onDamage(damage, target, source, effect) {
            if (effect && effect.effectType === 'Move' && effect.category === 'Physical' &&
                target.species.id === 'eiscue' && !target.transformed) {
                this.add('-activate', target, 'ability: Ice Face');
                this.effectState.busted = true;
                return 0;
            }
        },
        onCriticalHit(target, type, move) {
            if (!target)
                return;
            if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed)
                return;
            if (target.volatiles['substitute'] && !(move.flags['bypasssub'] || move.infiltrates))
                return;
            if (!target.runImmunity(move.type))
                return;
            return false;
        },
        onEffectiveness(typeMod, target, type, move) {
            if (!target)
                return;
            if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed)
                return;
            const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
            if (hitSub)
                return;
            if (!target.runImmunity(move.type))
                return;
            return 0;
        },
        onUpdate(pokemon) {
            if (pokemon.species.id === 'eiscue' && this.effectState.busted) {
                pokemon.formeChange('Eiscue-Noice', this.effect, true);
            }
        },
        onWeatherChange(pokemon, source, sourceEffect) {
            // snow/hail resuming because Cloud Nine/Air Lock ended does not trigger Ice Face
            if (sourceEffect?.suppressWeather)
                return;
            if (!pokemon.hp)
                return;
            if (this.field.isWeather(['hail', 'snow']) &&
                pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
                this.add('-activate', pokemon, 'ability: Ice Face');
                this.effectState.busted = false;
                pokemon.formeChange('Eiscue', this.effect, true);
            }
        },
        isBreakable: true,
        isPermanent: true,
        name: "Ice Face",
        num: 248
    },
    icescales: {
        rating: 4,
        onSourceModifyDamage(damage, source, target, move) {
            if (move.category === 'Special') {
                return this.chainModify(0.5);
            }
        },
        isBreakable: true,
        name: "Ice Scales",
        num: 246
    },
    illuminate: {
        rating: 0,
        name: "Illuminate",
        num: 35
    },
    illusion: {
        rating: 4.5,
        onBeforeSwitchIn(pokemon) {
            pokemon.illusion = null;
            // yes, you can Illusion an active pokemon but only if it's to your right
            for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
                const possibleTarget = pokemon.side.pokemon[i];
                if (!possibleTarget.fainted) {
                    pokemon.illusion = possibleTarget;
                    break;
                }
            }
        },
        onDamagingHit(damage, target, source, move) {
            if (target.illusion) {
                this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
            }
        },
        onEnd(pokemon) {
            if (pokemon.illusion) {
                this.debug('illusion cleared');
                pokemon.illusion = null;
                const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
                    (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
                this.add('replace', pokemon, details);
                this.add('-end', pokemon, 'Illusion');
            }
        },
        onFaint(pokemon) {
            pokemon.illusion = null;
        },
        name: "Illusion",
        num: 149
    },
    immunity: {
        rating: 2,
        onUpdate(pokemon) {
            if (pokemon.status === 'psn' || pokemon.status === 'tox') {
                this.add('-activate', pokemon, 'ability: Immunity');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'psn' && status.id !== 'tox')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Immunity');
            }
            return false;
        },
        isBreakable: true,
        name: "Immunity",
        num: 17
    },
    imposter: {
        rating: 5,
        onSwitchIn(pokemon) {
            this.effectState.switchingIn = true;
        },
        onStart(pokemon) {
            // Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
            if (!this.effectState.switchingIn)
                return;
            // copies across in doubles/triples
            // (also copies across in multibattle and diagonally in free-for-all,
            // but side.foe already takes care of those)
            const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
            if (target) {
                pokemon.transformInto(target, this.dex.abilities.get('imposter'));
            }
            this.effectState.switchingIn = false;
        },
        name: "Imposter",
        num: 150
    },
    infiltrator: {
        rating: 1.5,
        onModifyMove(move) {
            move.infiltrates = true;
        },
        name: "Infiltrator",
        num: 151
    },
    innardsout: {
        rating: 4,
        name: "Innards Out",
        onDamagingHitOrder: 1,
        onDamagingHit(damage, target, source, move) {
            if (!target.hp) {
                this.damage(target.getUndynamaxedHP(damage), source, target);
            }
        },
        num: 215
    },
    innerfocus: {
        rating: 1,
        onTryBoost() { },
        onTryAddVolatile(status, pokemon) {
            if (status.id === 'flinch')
                return null;
        },
        isBreakable: true,
        name: "Inner Focus",
        num: 39
    },
    insomnia: {
        rating: 2.5,
        onUpdate(pokemon) {
            if (pokemon.status === 'slp') {
                this.add('-activate', pokemon, 'ability: Insomnia');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'slp')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Insomnia');
            }
            return false;
        },
        isBreakable: true,
        name: "Insomnia",
        num: 15
    },
    intimidate: {
        onStart(pokemon) {
            let activated = false;
            for (const target of pokemon.adjacentFoes()) {
                if (!target.volatiles['substitute']) {
                    activated = true;
                    break;
                }
            }
            if (!activated) {
                this.hint("In Gen 3, Intimidate does not activate if every target has a Substitute.", false, pokemon.side);
                return;
            }
            this.add('-ability', pokemon, 'Intimidate', 'boost');
            for (const target of pokemon.adjacentFoes()) {
                if (target.volatiles['substitute']) {
                    this.add('-immune', target);
                }
                else {
                    this.boost({ atk: -1 }, target, pokemon, null, true);
                }
            }
        },
        rating: 4,
        name: "Intimidate",
        num: 22
    },
    intrepidsword: {
        onStart(pokemon) {
            this.boost({ atk: 1 }, pokemon);
        },
        rating: 4,
        name: "Intrepid Sword",
        num: 234
    },
    ironbarbs: {
        onDamagingHit(damage, target, source, move) {
            if (move.flags['contact']) {
                this.damage(source.baseMaxhp / 8, source, target, null, true);
            }
        },
        rating: 2.5,
        onDamagingHitOrder: 1,
        name: "Iron Barbs",
        num: 160
    },
    ironfist: {
        rating: 3,
        onBasePowerPriority: 23,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['punch']) {
                this.debug('Iron Fist boost');
                return this.chainModify([4915, 4096]);
            }
        },
        name: "Iron Fist",
        num: 89
    },
    justified: {
        rating: 2.5,
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Dark') {
                this.boost({ atk: 1 });
            }
        },
        name: "Justified",
        num: 154
    },
    keeneye: {
        onModifyMove() { },
        rating: 0.5,
        onTryBoost(boost, target, source, effect) {
            if (source && target === source)
                return;
            if (boost.accuracy && boost.accuracy < 0) {
                delete boost.accuracy;
                if (!effect.secondaries) {
                    this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
                }
            }
        },
        isBreakable: true,
        name: "Keen Eye",
        num: 51
    },
    klutz: {
        rating: -1,
        onStart(pokemon) {
            this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
        },
        name: "Klutz",
        num: 103
    },
    leafguard: {
        onSetStatus(status, target, source, effect) {
            if (effect && effect.id === 'rest') {
                return;
            }
            else if (this.field.isWeather('sunnyday')) {
                return false;
            }
        },
        rating: 0.5,
        onTryAddVolatile(status, target) {
            if (status.id === 'yawn' && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
                this.add('-immune', target, '[from] ability: Leaf Guard');
                return null;
            }
        },
        isBreakable: true,
        name: "Leaf Guard",
        num: 102
    },
    levitate: {
        rating: 3.5,
        isBreakable: true,
        name: "Levitate",
        num: 26
    },
    libero: {
        onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
        rating: 4.5,
        name: "Libero",
        num: 236
    },
    lightmetal: {
        rating: 1,
        onModifyWeight(weighthg) {
            return this.trunc(weighthg / 2);
        },
        isBreakable: true,
        name: "Light Metal",
        num: 135
    },
    lightningrod: {
        onFoeRedirectTarget(target, source, source2, move) {
            if (move.type !== 'Electric')
                return;
            if (this.validTarget(this.effectState.target, source, move.target)) {
                return this.effectState.target;
            }
        },
        isBreakable: true,
        name: "Lightning Rod",
        rating: 0,
        num: 32
    },
    limber: {
        rating: 2,
        onUpdate(pokemon) {
            if (pokemon.status === 'par') {
                this.add('-activate', pokemon, 'ability: Limber');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'par')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Limber');
            }
            return false;
        },
        isBreakable: true,
        name: "Limber",
        num: 7
    },
    lingeringaroma: {
        onDamagingHit(damage, target, source, move) {
            const sourceAbility = source.getAbility();
            if (sourceAbility.isPermanent || sourceAbility.id === 'lingeringaroma') {
                return;
            }
            if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
                const oldAbility = source.setAbility('lingeringaroma', target);
                if (oldAbility) {
                    this.add('-activate', target, 'ability: Lingering Aroma', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
                }
            }
        },
        name: "Lingering Aroma",
        rating: 2,
        num: 268
    },
    liquidooze: {
        onSourceTryHeal(damage, target, source, effect) {
            this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
            const canOoze = ['drain', 'leechseed'];
            if (canOoze.includes(effect.id) && this.activeMove?.id !== 'dreameater') {
                this.damage(damage, null, null, null, true);
                return 0;
            }
        },
        rating: 1.5,
        name: "Liquid Ooze",
        num: 64
    },
    liquidvoice: {
        rating: 1.5,
        onModifyTypePriority: -1,
        onModifyType(move, pokemon) {
            if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
                move.type = 'Water';
            }
        },
        name: "Liquid Voice",
        num: 204
    },
    longreach: {
        rating: 1,
        onModifyMove(move) {
            delete move.flags['contact'];
        },
        name: "Long Reach",
        num: 203
    },
    magicbounce: {
        rating: 4,
        name: "Magic Bounce",
        onTryHitPriority: 1,
        onTryHit(target, source, move) {
            if (target === source || move.hasBounced || !move.flags['reflectable']) {
                return;
            }
            const newMove = this.dex.getActiveMove(move.id);
            newMove.hasBounced = true;
            newMove.pranksterBoosted = false;
            this.actions.useMove(newMove, target, source);
            return null;
        },
        onAllyTryHitSide(target, source, move) {
            if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
                return;
            }
            const newMove = this.dex.getActiveMove(move.id);
            newMove.hasBounced = true;
            newMove.pranksterBoosted = false;
            this.actions.useMove(newMove, this.effectState.target, source);
            return null;
        },
        condition: {
			duration: 1 
		},
        isBreakable: true,
        num: 156
    },
    magicguard: {
        onDamage(damage, target, source, effect) {
            if (effect.effectType !== 'Move') {
                return false;
            }
        },
        onSetStatus(status, target, source, effect) {
            if (effect && effect.id === 'toxicspikes') {
                return false;
            }
        },
        name: "Magic Guard",
        rating: 4.5,
        num: 98
    },
    magician: {
        rating: 1.5,
        onAfterMoveSecondarySelf(source, target, move) {
            if (!move || !target)
                return;
            if (target !== source && move.category !== 'Status') {
                if (source.item || source.volatiles['gem'] || move.id === 'fling')
                    return;
                const yourItem = target.takeItem(source);
                if (!yourItem)
                    return;
                if (!source.setItem(yourItem)) {
                    target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
                    return;
                }
                this.add('-item', source, yourItem, '[from] ability: Magician', '[of] ' + target);
            }
        },
        name: "Magician",
        num: 170
    },
    magmaarmor: {
        rating: 1,
        onUpdate(pokemon) {
            if (pokemon.status === 'frz') {
                this.add('-activate', pokemon, 'ability: Magma Armor');
                pokemon.cureStatus();
            }
        },
        onImmunity(type, pokemon) {
            if (type === 'frz')
                return false;
        },
        isBreakable: true,
        name: "Magma Armor",
        num: 40
    },
    magnetpull: {
        rating: 4,
        onFoeTrapPokemon(pokemon) {
            if (pokemon.hasType('Steel') && pokemon.isAdjacent(this.effectState.target)) {
                pokemon.tryTrap(true);
            }
        },
        onFoeMaybeTrapPokemon(pokemon, source) {
            if (!source)
                source = this.effectState.target;
            if (!source || !pokemon.isAdjacent(source))
                return;
            if (!pokemon.knownType || pokemon.hasType('Steel')) {
                pokemon.maybeTrapped = true;
            }
        },
        name: "Magnet Pull",
        num: 42
    },
    marvelscale: {
        rating: 2.5,
        onModifyDefPriority: 6,
        onModifyDef(def, pokemon) {
            if (pokemon.status) {
                return this.chainModify(1.5);
            }
        },
        isBreakable: true,
        name: "Marvel Scale",
        num: 63
    },
    megalauncher: {
        rating: 3,
        onBasePowerPriority: 19,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['pulse']) {
                return this.chainModify(1.5);
            }
        },
        name: "Mega Launcher",
        num: 178
    },
    merciless: {
        rating: 1.5,
        onModifyCritRatio(critRatio, source, target) {
            if (target && ['psn', 'tox'].includes(target.status))
                return 5;
        },
        name: "Merciless",
        num: 196
    },
    mimicry: {
        rating: 0.5,
        onStart(pokemon) {
            this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
        },
        onTerrainChange(pokemon) {
            let types;
            switch (this.field.terrain) {
                case 'electricterrain':
                    types = ['Electric'];
                    break;
                case 'grassyterrain':
                    types = ['Grass'];
                    break;
                case 'mistyterrain':
                    types = ['Fairy'];
                    break;
                case 'psychicterrain':
                    types = ['Psychic'];
                    break;
                default:
                    types = pokemon.baseSpecies.types;
            }
            const oldTypes = pokemon.getTypes();
            if (oldTypes.join() === types.join() || !pokemon.setType(types))
                return;
            if (this.field.terrain || pokemon.transformed) {
                this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
                if (!this.field.terrain)
                    this.hint("Transform Mimicry changes you to your original un-transformed types.");
            }
            else {
                this.add('-activate', pokemon, 'ability: Mimicry');
                this.add('-end', pokemon, 'typechange', '[silent]');
            }
        },
        name: "Mimicry",
        num: 250
    },
    mindseye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Mind's Eye", "[of] " + target);
				}
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			move.ignoreEvasion = true;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		flags: {breakable: 1},
		name: "Mind's Eye",
		rating: 0,
		num: 300,
	},
    minus: {
        onModifySpA(spa, pokemon) {
            for (const active of this.getAllActive()) {
                if (!active.fainted && active.hasAbility('plus')) {
                    return this.chainModify(1.5);
                }
            }
        },
        name: "Minus",
        rating: 0,
        num: 58
    },
    mirrorarmor: {
        rating: 2,
        onTryBoost(boost, target, source, effect) {
            // Don't bounce self stat changes, or boosts that have already bounced
            if (!source || target === source || !boost || effect.name === 'Mirror Armor')
                return;
            let b;
            for (b in boost) {
                if (boost[b] < 0) {
                    if (target.boosts[b] === -6)
                        continue;
                    const negativeBoost = {};
                    negativeBoost[b] = boost[b];
                    delete boost[b];
                    if (source.hp) {
                        this.add('-ability', target, 'Mirror Armor');
                        this.boost(negativeBoost, source, target, null, true);
                    }
                }
            }
        },
        isBreakable: true,
        name: "Mirror Armor",
        num: 240
    },
    mistysurge: {
        rating: 3.5,
        onStart(source) {
            this.field.setTerrain('mistyterrain');
        },
        name: "Misty Surge",
        num: 228
    },
    moldbreaker: {
        rating: 3.5,
        onStart(pokemon) {
            this.add('-ability', pokemon, 'Mold Breaker');
        },
        onModifyMove(move) {
            move.ignoreAbility = true;
        },
        name: "Mold Breaker",
        num: 104
    },
    moody: {
        onResidual(pokemon) {
            let stats = [];
            const boost = {};
            let statPlus;
            for (statPlus in pokemon.boosts) {
                if (pokemon.boosts[statPlus] < 6) {
                    stats.push(statPlus);
                }
            }
            let randomStat = stats.length ? this.sample(stats) : undefined;
            if (randomStat)
                boost[randomStat] = 2;
            stats = [];
            let statMinus;
            for (statMinus in pokemon.boosts) {
                if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
                    stats.push(statMinus);
                }
            }
            randomStat = stats.length ? this.sample(stats) : undefined;
            if (randomStat)
                boost[randomStat] = -1;
            this.boost(boost, pokemon, pokemon);
        },
        rating: 5,
        onResidualOrder: 28,
        onResidualSubOrder: 2,
        name: "Moody",
        num: 141
    },
    motordrive: {
        rating: 3,
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Electric') {
                if (!this.boost({ spe: 1 })) {
                    this.add('-immune', target, '[from] ability: Motor Drive');
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Motor Drive",
        num: 78
    },
    moxie: {
        rating: 3,
        onSourceAfterFaint(length, target, source, effect) {
            if (effect && effect.effectType === 'Move') {
                this.boost({ atk: length }, source);
            }
        },
        name: "Moxie",
        num: 153
    },
    multiscale: {
        rating: 3.5,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.hp >= target.maxhp) {
                this.debug('Multiscale weaken');
                return this.chainModify(0.5);
            }
        },
        isBreakable: true,
        name: "Multiscale",
        num: 136
    },
    multitype: {
        rating: 4,
        isPermanent: true,
        name: "Multitype",
        num: 121
    },
    mummy: {
        rating: 2,
        name: "Mummy",
        onDamagingHit(damage, target, source, move) {
            const sourceAbility = source.getAbility();
            if (sourceAbility.isPermanent || sourceAbility.id === 'mummy') {
                return;
            }
            if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
                const oldAbility = source.setAbility('mummy', target);
                if (oldAbility) {
                    this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
                }
            }
        },
        num: 152
    },
    myceliummight: {
        onFractionalPriorityPriority: -1,
        onFractionalPriority(priority, pokemon, target, move) {
            if (move.category === 'Status') {
                return -0.1;
            }
        },
        onModifyMove(move) {
            if (move.category === 'Status') {
                move.ignoreAbility = true;
            }
        },
        name: "Mycelium Might",
        rating: 2,
        num: 298
    },
    naturalcure: {
        onCheckShow(pokemon) { },
        onSwitchOut(pokemon) {
            if (!pokemon.status || pokemon.status === 'fnt')
                return;
            // Because statused/unstatused pokemon are shown after every switch
            // in gen 3-4, Natural Cure's curing is always known to both players
            this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
            pokemon.clearStatus();
        },
        rating: 2.5,
        name: "Natural Cure",
        num: 30
    },
    neuroforce: {
        rating: 2.5,
        onModifyDamage(damage, source, target, move) {
            if (move && target.getMoveHitData(move).typeMod > 0) {
                return this.chainModify([5120, 4096]);
            }
        },
        name: "Neuroforce",
        num: 233
    },
    neutralizinggas: {
        rating: 4,
        onPreStart(pokemon) {
            if (pokemon.transformed)
                return;
            this.add('-ability', pokemon, 'Neutralizing Gas');
            pokemon.abilityState.ending = false;
            const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
            for (const target of this.getAllActive()) {
                if (target.hasItem('Ability Shield')) {
                    this.add('-block', target, 'item: Ability Shield');
                    continue;
                }
                if (target.illusion) {
                    this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
                }
                if (target.volatiles['slowstart']) {
                    delete target.volatiles['slowstart'];
                    this.add('-end', target, 'Slow Start', '[silent]');
                }
                if (strongWeathers.includes(target.getAbility().id)) {
                    this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
                }
            }
        },
        onEnd(source) {
            if (source.transformed)
                return;
            for (const pokemon of this.getAllActive()) {
                if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) {
                    return;
                }
            }
            this.add('-end', source, 'ability: Neutralizing Gas');
            // FIXME this happens before the pokemon switches out, should be the opposite order.
            // Not an easy fix since we cant use a supported event. Would need some kind of special event that
            // gathers events to run after the switch and then runs them when the ability is no longer accessible.
            // (If you're tackling this, do note extreme weathers have the same issue)
            // Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
            if (source.abilityState.ending)
                return;
            source.abilityState.ending = true;
            const sortedActive = this.getAllActive();
            this.speedSort(sortedActive);
            for (const pokemon of sortedActive) {
                if (pokemon !== source) {
                    if (pokemon.getAbility().isPermanent)
                        continue; // does not interact with e.g Ice Face, Zen Mode
                    // Will be suppressed by Pokemon#ignoringAbility if needed
                    this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
                    if (pokemon.ability === "gluttony") {
                        pokemon.abilityState.gluttony = false;
                    }
                }
            }
        },
        name: "Neutralizing Gas",
        num: 256
    },
    noguard: {
        rating: 4,
        onAnyInvulnerabilityPriority: 1,
        onAnyInvulnerability(target, source, move) {
            if (move && (source === this.effectState.target || target === this.effectState.target))
                return 0;
        },
        onAnyAccuracy(accuracy, target, source, move) {
            if (move && (source === this.effectState.target || target === this.effectState.target)) {
                return true;
            }
            return accuracy;
        },
        name: "No Guard",
        num: 99
    },
    normalize: {
        onModifyMove(move) {
            if (move.id !== 'struggle') {
                move.type = 'Normal';
            }
        },
        onModifyMovePriority: 1,
        rating: -1,
        onModifyTypePriority: 1,
        onModifyType(move, pokemon) {
            const noModifyType = [
                'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
            ];
            if (!(move.isZ && move.category !== 'Status') && !noModifyType.includes(move.id) &&
                // TODO: Figure out actual interaction
                !(move.name === 'Tera Blast' && pokemon.terastallized)) {
                move.type = 'Normal';
                move.typeChangerBoosted = this.effect;
            }
        },
        onBasePowerPriority: 23,
        onBasePower(basePower, pokemon, target, move) {
            if (move.typeChangerBoosted === this.effect)
                return this.chainModify([4915, 4096]);
        },
        name: "Normalize",
        num: 96
    },
    oblivious: {
        onUpdate(pokemon) {
            if (pokemon.volatiles['attract']) {
                pokemon.removeVolatile('attract');
                this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
            }
        },
        onTryHit(pokemon, target, move) {
            if (move.id === 'captivate') {
                this.add('-immune', pokemon, '[from] Oblivious');
                return null;
            }
        },
        rating: 0.5,
        onTryBoost() { },
        onImmunity(type, pokemon) {
            if (type === 'attract')
                return false;
        },
        isBreakable: true,
        name: "Oblivious",
        num: 12
    },
    opportunist: {
        onFoeAfterBoost(boost, target, source, effect) {
            if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb')
                return;
            const pokemon = this.effectState.target;
            const positiveBoosts = {};
            let i;
            for (i in boost) {
                if (boost[i] > 0) {
                    positiveBoosts[i] = boost[i];
                }
            }
            if (Object.keys(positiveBoosts).length < 1)
                return;
            this.boost(positiveBoosts, pokemon);
        },
        name: "Opportunist",
        rating: 3,
        num: 290
    },
    orichalcumpulse: {
        onStart(pokemon) {
            if (this.field.setWeather('sunnyday')) {
                this.add('-activate', pokemon, 'Orichalcum Pulse', '[source]');
            }
            else if (this.field.isWeather('sunnyday')) {
                this.add('-activate', pokemon, 'ability: Orichalcum Pulse');
            }
        },
        onModifyAtkPriority: 5,
        onModifyAtk(atk, pokemon) {
            if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
                this.debug('Orichalcum boost');
                return this.chainModify([5461, 4096]);
            }
        },
        isPermanent: true,
        name: "Orichalcum Pulse",
        rating: 4.5,
        num: 288
    },
    overcoat: {
        onTryHit() { },
        rating: 0.5,
        onImmunity(type, pokemon) {
            if (type === 'sandstorm' || type === 'hail' || type === 'powder')
                return false;
        },
        onTryHitPriority: 1,
        isBreakable: true,
        name: "Overcoat",
        num: 142
    },
    overgrow: {
        onBasePowerPriority: 2,
        onBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
                this.debug('Overgrow boost');
                return this.chainModify(1.5);
            }
        },
        name: "Overgrow",
        rating: 2,
        num: 65
    },
    owntempo: {
        onTryBoost() { },
        rating: 1.5,
        onUpdate(pokemon) {
            if (pokemon.volatiles['confusion']) {
                this.add('-activate', pokemon, 'ability: Own Tempo');
                pokemon.removeVolatile('confusion');
            }
        },
        onTryAddVolatile(status, pokemon) {
            if (status.id === 'confusion')
                return null;
        },
        onHit(target, source, move) {
            if (move?.volatileStatus === 'confusion') {
                this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
            }
        },
        isBreakable: true,
        name: "Own Tempo",
        num: 20
    },
    parentalbond: {
        rating: 5,
        onPrepareHit(source, target, move) {
            if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
                move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax)
                return;
            move.multihit = 2;
            move.multihitType = 'parentalbond';
        },
        onSourceModifySecondaries(secondaries, target, source, move) {
            if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
                // hack to prevent accidentally suppressing King's Rock/Razor Fang
                return secondaries.filter(effect => effect.volatileStatus === 'flinch');
            }
        },
        name: "Parental Bond",
        num: 185
    },
    pastelveil: {
        rating: 2,
        onStart(pokemon) {
            for (const ally of pokemon.alliesAndSelf()) {
                if (['psn', 'tox'].includes(ally.status)) {
                    this.add('-activate', pokemon, 'ability: Pastel Veil');
                    ally.cureStatus();
                }
            }
        },
        onUpdate(pokemon) {
            if (['psn', 'tox'].includes(pokemon.status)) {
                this.add('-activate', pokemon, 'ability: Pastel Veil');
                pokemon.cureStatus();
            }
        },
        onAllySwitchIn(pokemon) {
            if (['psn', 'tox'].includes(pokemon.status)) {
                this.add('-activate', this.effectState.target, 'ability: Pastel Veil');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (!['psn', 'tox'].includes(status.id))
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Pastel Veil');
            }
            return false;
        },
        onAllySetStatus(status, target, source, effect) {
            if (!['psn', 'tox'].includes(status.id))
                return;
            if (effect?.status) {
                const effectHolder = this.effectState.target;
                this.add('-block', target, 'ability: Pastel Veil', '[of] ' + effectHolder);
            }
            return false;
        },
        isBreakable: true,
        name: "Pastel Veil",
        num: 257
    },
    perishbody: {
        rating: 1,
        onDamagingHit(damage, target, source, move) {
            if (!this.checkMoveMakesContact(move, source, target))
                return;
            let announced = false;
            for (const pokemon of [target, source]) {
                if (pokemon.volatiles['perishsong'])
                    continue;
                if (!announced) {
                    this.add('-ability', target, 'Perish Body');
                    announced = true;
                }
                pokemon.addVolatile('perishsong');
            }
        },
        name: "Perish Body",
        num: 253
    },
    pickpocket: {
        rating: 1,
        onAfterMoveSecondary(target, source, move) {
            if (source && source !== target && move?.flags['contact']) {
                if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
                    return;
                }
                const yourItem = source.takeItem(target);
                if (!yourItem) {
                    return;
                }
                if (!target.setItem(yourItem)) {
                    source.item = yourItem.id;
                    return;
                }
                this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', '[of] ' + source);
                this.add('-item', target, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
            }
        },
        name: "Pickpocket",
        num: 124
    },
    pickup: {
        name: "Pickup",
        rating: 0,
        num: 53
    },
    pixilate: {
        onBasePower(basePower, pokemon, target, move) {
            if (move.typeChangerBoosted === this.effect)
                return this.chainModify([5325, 4096]);
        },
        rating: 4.5,
        onModifyTypePriority: -1,
        onModifyType(move, pokemon) {
            const noModifyType = [
                'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
            ];
            if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
                !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
                move.type = 'Fairy';
                move.typeChangerBoosted = this.effect;
            }
        },
        onBasePowerPriority: 23,
        name: "Pixilate",
        num: 182
    },
    plus: {
        onModifySpA(spa, pokemon) {
            for (const active of this.getAllActive()) {
                if (!active.fainted && active.hasAbility('minus')) {
                    return this.chainModify(1.5);
                }
            }
        },
        name: "Plus",
        rating: 0,
        num: 57
    },
    poisonheal: {
        rating: 4,
        onDamagePriority: 1,
        onDamage(damage, target, source, effect) {
            if (effect.id === 'psn' || effect.id === 'tox') {
                this.heal(target.baseMaxhp / 8);
                return false;
            }
        },
        name: "Poison Heal",
        num: 90
    },
    poisonpoint: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact']) {
                if (this.randomChance(1, 3)) {
                    source.trySetStatus('psn', target);
                }
            }
        },
        rating: 1.5,
        name: "Poison Point",
        num: 38
    },
    poisonpuppeteer: {
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'psn' || status.id === 'tox') {
				target.addVolatile('confusion');
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1},
		name: "Poison Puppeteer",
		rating: 3,
		num: 310,
	},
    poisontouch: {
        rating: 2,
        onModifyMove(move) {
            if (!move?.flags['contact'] || move.target === 'self')
                return;
            if (!move.secondaries) {
                move.secondaries = [];
            }
            move.secondaries.push({
                chance: 30,
                status: 'psn',
                ability: this.dex.abilities.get('poisontouch'),
            });
        },
        name: "Poison Touch",
        num: 143
    },
    powerconstruct: {
        rating: 5,
        onResidualOrder: 29,
        onResidual(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp)
                return;
            if (pokemon.species.id === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2)
                return;
            this.add('-activate', pokemon, 'ability: Power Construct');
            pokemon.formeChange('Zygarde-Complete', this.effect, true);
            pokemon.baseMaxhp = Math.floor(Math.floor(2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
            const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
            pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
            pokemon.maxhp = newMaxHP;
            this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
        },
        isPermanent: true,
        name: "Power Construct",
        num: 211
    },
    powerofalchemy: {
        rating: 0,
        onAllyFaint(target) {
            if (!this.effectState.target.hp)
                return;
            const ability = target.getAbility();
            const additionalBannedAbilities = [
                'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard',
            ];
            if (target.getAbility().isPermanent || additionalBannedAbilities.includes(target.ability))
                return;
            if (this.effectState.target.setAbility(ability)) {
                this.add('-ability', this.effectState.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
            }
        },
        name: "Power of Alchemy",
        num: 223
    },
    powerspot: {
        rating: 1,
        onAllyBasePowerPriority: 22,
        onAllyBasePower(basePower, attacker, defender, move) {
            if (attacker !== this.effectState.target) {
                this.debug('Power Spot boost');
                return this.chainModify([5325, 4096]);
            }
        },
        name: "Power Spot",
        num: 249
    },
    prankster: {
        rating: 4,
        onModifyPriority(priority, pokemon, target, move) {
            if (move?.category === 'Status') {
                move.pranksterBoosted = true;
                return priority + 1;
            }
        },
        name: "Prankster",
        num: 158
    },
    pressure: {
        onStart(pokemon) {
            this.addSplit(pokemon.side.id, ['-ability', pokemon, 'Pressure', '[silent]']);
        },
        onDeductPP(target, source) {
            if (target === source)
                return;
            return 1;
        },
        name: "Pressure",
        rating: 1.5,
        num: 46
    },
    primordialsea: {
        rating: 4.5,
        onStart(source) {
            this.field.setWeather('primordialsea');
        },
        onAnySetWeather(target, source, weather) {
            const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
            if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id))
                return false;
        },
        onEnd(pokemon) {
            if (this.field.weatherState.source !== pokemon)
                return;
            for (const target of this.getAllActive()) {
                if (target === pokemon)
                    continue;
                if (target.hasAbility('primordialsea')) {
                    this.field.weatherState.source = target;
                    return;
                }
            }
            this.field.clearWeather();
        },
        name: "Primordial Sea",
        num: 189
    },
    prismarmor: {
        rating: 3,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.getMoveHitData(move).typeMod > 0) {
                this.debug('Prism Armor neutralize');
                return this.chainModify(0.75);
            }
        },
        name: "Prism Armor",
        num: 232
    },
    propellertail: {
        rating: 0,
        onModifyMovePriority: 1,
        onModifyMove(move) {
            // most of the implementation is in Battle#getTarget
            move.tracksTarget = move.target !== 'scripted';
        },
        name: "Propeller Tail",
        num: 239
    },
    protean: {
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
        rating: 4.5,
        name: "Protean",
        num: 168
    },
    protosynthesis: {
        onStart(pokemon) {
            this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
        },
        onWeatherChange(pokemon) {
            if (pokemon.transformed)
                return;
            // Protosynthesis is not affected by Utility Umbrella
            if (this.field.isWeather('sunnyday')) {
                pokemon.addVolatile('protosynthesis');
            }
            else if (!pokemon.volatiles['protosynthesis']?.fromBooster) {
                pokemon.removeVolatile('protosynthesis');
            }
        },
        onEnd(pokemon) {
            delete pokemon.volatiles['protosynthesis'];
            this.add('-end', pokemon, 'Protosynthesis', '[silent]');
        },
        condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
                if (effect?.id === 'boosterenergy') {
                    this.effectState.fromBooster = true;
                    this.add('-activate', pokemon, 'ability: Protosynthesis', '[fromitem]');
                }
                else {
                    this.add('-activate', pokemon, 'ability: Protosynthesis');
                }
                this.effectState.bestStat = pokemon.getBestStat(false, true);
                this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
            },
			onModifyAtkPriority: 5,
			onModifyAtk(atk, source, target, move) {
                if (this.effectState.bestStat !== 'atk')
                    return;
                this.debug('Protosynthesis atk boost');
                return this.chainModify([5325, 4096]);
            },
			onModifyDefPriority: 6,
			onModifyDef(def, target, source, move) {
                if (this.effectState.bestStat !== 'def')
                    return;
                this.debug('Protosynthesis def boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpAPriority: 5,
			onModifySpA(relayVar, source, target, move) {
                if (this.effectState.bestStat !== 'spa')
                    return;
                this.debug('Protosynthesis spa boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpDPriority: 6,
			onModifySpD(relayVar, target, source, move) {
                if (this.effectState.bestStat !== 'spd')
                    return;
                this.debug('Protosynthesis spd boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpe(spe, pokemon) {
                if (this.effectState.bestStat !== 'spe')
                    return;
                this.debug('Protosynthesis spe boost');
                return this.chainModify(1.5);
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Protosynthesis');
            } 
		},
        isPermanent: true,
        name: "Protosynthesis",
        rating: 3,
        num: 281
    },
    psychicsurge: {
        rating: 4,
        onStart(source) {
            this.field.setTerrain('psychicterrain');
        },
        name: "Psychic Surge",
        num: 227
    },
    punkrock: {
        rating: 3.5,
        onBasePowerPriority: 7,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['sound']) {
                this.debug('Punk Rock boost');
                return this.chainModify([5325, 4096]);
            }
        },
        onSourceModifyDamage(damage, source, target, move) {
            if (move.flags['sound']) {
                this.debug('Punk Rock weaken');
                return this.chainModify(0.5);
            }
        },
        isBreakable: true,
        name: "Punk Rock",
        num: 244
    },
    purepower: {
        rating: 5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk) {
            return this.chainModify(2);
        },
        name: "Pure Power",
        num: 74
    },
    purifyingsalt: {
        onSetStatus(status, target, source, effect) {
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Purifying Salt');
            }
            return false;
        },
        onTryAddVolatile(status, target) {
            if (status.id === 'yawn') {
                this.add('-immune', target, '[from] ability: Purifying Salt');
                return null;
            }
        },
        onSourceModifyAtkPriority: 6,
        onSourceModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Ghost') {
                this.debug('Purifying Salt weaken');
                return this.chainModify(0.5);
            }
        },
        onSourceModifySpAPriority: 5,
        onSourceModifySpA(spa, attacker, defender, move) {
            if (move.type === 'Ghost') {
                this.debug('Purifying Salt weaken');
                return this.chainModify(0.5);
            }
        },
        isBreakable: true,
        name: "Purifying Salt",
        rating: 4,
        num: 272
    },
    quarkdrive: {
        onStart(pokemon) {
            this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
        },
        onTerrainChange(pokemon) {
            if (pokemon.transformed)
                return;
            if (this.field.isTerrain('electricterrain')) {
                pokemon.addVolatile('quarkdrive');
            }
            else if (!pokemon.volatiles['quarkdrive']?.fromBooster) {
                pokemon.removeVolatile('quarkdrive');
            }
        },
        onEnd(pokemon) {
            delete pokemon.volatiles['quarkdrive'];
            this.add('-end', pokemon, 'Quark Drive', '[silent]');
        },
        condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
                if (effect?.id === 'boosterenergy') {
                    this.effectState.fromBooster = true;
                    this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
                }
                else {
                    this.add('-activate', pokemon, 'ability: Quark Drive');
                }
                this.effectState.bestStat = pokemon.getBestStat(false, true);
                this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
            },
			onModifyAtkPriority: 5,
			onModifyAtk(atk, source, target, move) {
                if (this.effectState.bestStat !== 'atk')
                    return;
                this.debug('Quark Drive atk boost');
                return this.chainModify([5325, 4096]);
            },
			onModifyDefPriority: 6,
			onModifyDef(def, target, source, move) {
                if (this.effectState.bestStat !== 'def')
                    return;
                this.debug('Quark Drive def boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpAPriority: 5,
			onModifySpA(relayVar, source, target, move) {
                if (this.effectState.bestStat !== 'spa')
                    return;
                this.debug('Quark Drive spa boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpDPriority: 6,
			onModifySpD(relayVar, target, source, move) {
                if (this.effectState.bestStat !== 'spd')
                    return;
                this.debug('Quark Drive spd boost');
                return this.chainModify([5325, 4096]);
            },
			onModifySpe(spe, pokemon) {
                if (this.effectState.bestStat !== 'spe')
                    return;
                this.debug('Quark Drive spe boost');
                return this.chainModify(1.5);
            },
			onEnd(pokemon) {
                this.add('-end', pokemon, 'Quark Drive');
            } 
		},
        isPermanent: true,
        name: "Quark Drive",
        rating: 3,
        num: 282
    },
    queenlymajesty: {
        rating: 2.5,
        onFoeTryMove(target, source, move) {
            const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
            if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
                return;
            }
            const dazzlingHolder = this.effectState.target;
            if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
                this.attrLastMove('[still]');
                this.add('cant', dazzlingHolder, 'ability: Queenly Majesty', move, '[of] ' + target);
                return false;
            }
        },
        isBreakable: true,
        name: "Queenly Majesty",
        num: 214
    },
    quickdraw: {
        rating: 2.5,
        onFractionalPriorityPriority: -1,
        onFractionalPriority(priority, pokemon, target, move) {
            if (move.category !== "Status" && this.randomChance(3, 10)) {
                this.add('-activate', pokemon, 'ability: Quick Draw');
                return 0.1;
            }
        },
        name: "Quick Draw",
        num: 259
    },
    quickfeet: {
        rating: 2.5,
        onModifySpe(spe, pokemon) {
            if (pokemon.status) {
                return this.chainModify(1.5);
            }
        },
        name: "Quick Feet",
        num: 95
    },
    raindish: {
        onWeather() { },
        onResidualOrder: 10,
        onResidualSubOrder: 3,
        onResidual(pokemon) {
            if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
                this.heal(pokemon.baseMaxhp / 16);
            }
        },
        rating: 1.5,
        name: "Rain Dish",
        num: 44
    },
    rattled: {
        onDamagingHit(damage, target, source, move) {
            if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
                this.boost({ spe: 1 });
            }
        },
        name: "Rattled",
        rating: 1.5,
        num: 155
    },
    receiver: {
        rating: 0,
        onAllyFaint(target) {
            if (!this.effectState.target.hp)
                return;
            const ability = target.getAbility();
            const additionalBannedAbilities = [
                'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard',
            ];
            if (target.getAbility().isPermanent || additionalBannedAbilities.includes(target.ability))
                return;
            if (this.effectState.target.setAbility(ability)) {
                this.add('-ability', this.effectState.target, ability, '[from] ability: Receiver', '[of] ' + target);
            }
        },
        name: "Receiver",
        num: 222
    },
    reckless: {
        rating: 3,
        onBasePowerPriority: 23,
        onBasePower(basePower, attacker, defender, move) {
            if (move.recoil || move.hasCrashDamage) {
                this.debug('Reckless boost');
                return this.chainModify([4915, 4096]);
            }
        },
        name: "Reckless",
        num: 120
    },
    refrigerate: {
        onBasePower(basePower, pokemon, target, move) {
            if (move.typeChangerBoosted === this.effect)
                return this.chainModify([5325, 4096]);
        },
        rating: 4.5,
        onModifyTypePriority: -1,
        onModifyType(move, pokemon) {
            const noModifyType = [
                'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
            ];
            if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
                !(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
                move.type = 'Ice';
                move.typeChangerBoosted = this.effect;
            }
        },
        onBasePowerPriority: 23,
        name: "Refrigerate",
        num: 174
    },
    regenerator: {
        rating: 4.5,
        onSwitchOut(pokemon) {
            pokemon.heal(pokemon.baseMaxhp / 3);
        },
        name: "Regenerator",
        num: 144
    },
    ripen: {
        rating: 2,
        onTryHeal(damage, target, source, effect) {
            if (!effect)
                return;
            if (effect.name === 'Berry Juice' || effect.name === 'Leftovers') {
                this.add('-activate', target, 'ability: Ripen');
            }
            if (effect.isBerry)
                return this.chainModify(2);
        },
        onChangeBoost(boost, target, source, effect) {
            if (effect && effect.isBerry) {
                let b;
                for (b in boost) {
                    boost[b] *= 2;
                }
            }
        },
        onSourceModifyDamagePriority: -1,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.abilityState.berryWeaken) {
                target.abilityState.berryWeaken = false;
                return this.chainModify(0.5);
            }
        },
        onTryEatItemPriority: -1,
        onTryEatItem(item, pokemon) {
            this.add('-activate', pokemon, 'ability: Ripen');
        },
        onEatItem(item, pokemon) {
            const weakenBerries = [
                'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry', 'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry',
            ];
            // Record if the pokemon ate a berry to resist the attack
            pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name);
        },
        name: "Ripen",
        num: 247
    },
    rivalry: {
        rating: 0,
        onBasePowerPriority: 24,
        onBasePower(basePower, attacker, defender, move) {
            if (attacker.gender && defender.gender) {
                if (attacker.gender === defender.gender) {
                    this.debug('Rivalry boost');
                    return this.chainModify(1.25);
                }
                else {
                    this.debug('Rivalry weaken');
                    return this.chainModify(0.75);
                }
            }
        },
        name: "Rivalry",
        num: 79
    },
    rkssystem: {
        rating: 4,
        isPermanent: true,
        name: "RKS System",
        num: 225
    },
    rockhead: {
        rating: 3,
        onDamage(damage, target, source, effect) {
            if (effect.id === 'recoil') {
                if (!this.activeMove)
                    throw new Error("Battle.activeMove is null");
                if (this.activeMove.id !== 'struggle')
                    return null;
            }
        },
        name: "Rock Head",
        num: 69
    },
    rockypayload: {
        onModifyAtkPriority: 5,
        onModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Rock') {
                this.debug('Rocky Payload boost');
                return this.chainModify(1.5);
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Rock') {
                this.debug('Rocky Payload boost');
                return this.chainModify(1.5);
            }
        },
        name: "Rocky Payload",
        rating: 3.5,
        num: 276
    },
    roughskin: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact']) {
                this.damage(source.baseMaxhp / 16, source, target);
            }
        },
        rating: 2.5,
        onDamagingHitOrder: 1,
        name: "Rough Skin",
        num: 24
    },
    runaway: {
        rating: 0,
        name: "Run Away",
        num: 50
    },
    sandforce: {
        rating: 2,
        onBasePowerPriority: 21,
        onBasePower(basePower, attacker, defender, move) {
            if (this.field.isWeather('sandstorm')) {
                if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
                    this.debug('Sand Force boost');
                    return this.chainModify([5325, 4096]);
                }
            }
        },
        onImmunity(type, pokemon) {
            if (type === 'sandstorm')
                return false;
        },
        name: "Sand Force",
        num: 159
    },
    sandrush: {
        rating: 3,
        onModifySpe(spe, pokemon) {
            if (this.field.isWeather('sandstorm')) {
                return this.chainModify(2);
            }
        },
        onImmunity(type, pokemon) {
            if (type === 'sandstorm')
                return false;
        },
        name: "Sand Rush",
        num: 146
    },
    sandspit: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            this.field.setWeather('sandstorm');
        },
        name: "Sand Spit",
        num: 245
    },
    sandstream: {
        rating: 4,
        onStart(source) {
            this.field.setWeather('sandstorm');
        },
        name: "Sand Stream",
        num: 45
    },
    sandveil: {
        onModifyAccuracyPriority: 8,
        onModifyAccuracy(accuracy) {
            if (typeof accuracy !== 'number')
                return;
            if (this.field.isWeather('sandstorm')) {
                this.debug('Sand Veil - decreasing accuracy');
                return accuracy * 0.8;
            }
        },
        rating: 1.5,
        onImmunity(type, pokemon) {
            if (type === 'sandstorm')
                return false;
        },
        isBreakable: true,
        name: "Sand Veil",
        num: 8
    },
    sapsipper: {
        onAllyTryHitSide() { },
        rating: 3,
        onTryHitPriority: 1,
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Grass') {
                if (!this.boost({ atk: 1 })) {
                    this.add('-immune', target, '[from] ability: Sap Sipper');
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Sap Sipper",
        num: 157
    },
    schooling: {
        rating: 3,
        onStart(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed)
                return;
            if (pokemon.hp > pokemon.maxhp / 4) {
                if (pokemon.species.id === 'wishiwashi') {
                    pokemon.formeChange('Wishiwashi-School');
                }
            }
            else {
                if (pokemon.species.id === 'wishiwashischool') {
                    pokemon.formeChange('Wishiwashi');
                }
            }
        },
        onResidualOrder: 29,
        onResidual(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
                pokemon.transformed || !pokemon.hp)
                return;
            if (pokemon.hp > pokemon.maxhp / 4) {
                if (pokemon.species.id === 'wishiwashi') {
                    pokemon.formeChange('Wishiwashi-School');
                }
            }
            else {
                if (pokemon.species.id === 'wishiwashischool') {
                    pokemon.formeChange('Wishiwashi');
                }
            }
        },
        isPermanent: true,
        name: "Schooling",
        num: 208
    },
    scrappy: {
        onTryBoost() { },
        rating: 3,
        onModifyMovePriority: -5,
        onModifyMove(move) {
            if (!move.ignoreImmunity)
                move.ignoreImmunity = {};
            if (move.ignoreImmunity !== true) {
                move.ignoreImmunity['Fighting'] = true;
                move.ignoreImmunity['Normal'] = true;
            }
        },
        name: "Scrappy",
        num: 113
    },
    screencleaner: {
        rating: 2,
        onStart(pokemon) {
            let activated = false;
            for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) {
                for (const side of [pokemon.side, ...pokemon.side.foeSidesWithConditions()]) {
                    if (side.getSideCondition(sideCondition)) {
                        if (!activated) {
                            this.add('-activate', pokemon, 'ability: Screen Cleaner');
                            activated = true;
                        }
                        side.removeSideCondition(sideCondition);
                    }
                }
            }
        },
        name: "Screen Cleaner",
        num: 251
    },
    seedsower: {
        onDamagingHit(damage, target, source, move) {
            this.field.setTerrain('grassyterrain');
        },
        name: "Seed Sower",
        rating: 2.5,
        num: 269
    },
    serenegrace: {
        onModifyMove(move) {
            if (move.secondaries) {
                this.debug('doubling secondary chance');
                for (const secondary of move.secondaries) {
                    if (secondary.chance)
                        secondary.chance *= 2;
                }
            }
        },
        rating: 3.5,
        onModifyMovePriority: -2,
        name: "Serene Grace",
        num: 32
    },
    shadowshield: {
        rating: 3.5,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.hp >= target.maxhp) {
                this.debug('Shadow Shield weaken');
                return this.chainModify(0.5);
            }
        },
        name: "Shadow Shield",
        num: 231
    },
    shadowtag: {
        onFoeTrapPokemon(pokemon) {
            pokemon.trapped = true;
        },
        rating: 5,
        onFoeMaybeTrapPokemon(pokemon, source) {
            if (!source)
                source = this.effectState.target;
            if (!source || !pokemon.isAdjacent(source))
                return;
            if (!pokemon.hasAbility('shadowtag')) {
                pokemon.maybeTrapped = true;
            }
        },
        name: "Shadow Tag",
        num: 23
    },
    sharpness: {
        onBasePowerPriority: 19,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['slicing']) {
                this.debug('Shapness boost');
                return this.chainModify(1.5);
            }
        },
        name: "Sharpness",
        rating: 3.5,
        num: 292
    },
    shedskin: {
        onResidualOrder: 10,
        onResidualSubOrder: 3,
        rating: 3,
        onResidual(pokemon) {
            if (pokemon.hp && pokemon.status && this.randomChance(33, 100)) {
                this.debug('shed skin');
                this.add('-activate', pokemon, 'ability: Shed Skin');
                pokemon.cureStatus();
            }
        },
        name: "Shed Skin",
        num: 61
    },
    sheerforce: {
        rating: 3.5,
        onModifyMove(move, pokemon) {
            if (move.secondaries) {
                delete move.secondaries;
                // Technically not a secondary effect, but it is negated
                delete move.self;
                if (move.id === 'clangoroussoulblaze')
                    delete move.selfBoost;
                // Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
                move.hasSheerForce = true;
            }
        },
        onBasePowerPriority: 21,
        onBasePower(basePower, pokemon, target, move) {
            if (move.hasSheerForce)
                return this.chainModify([5325, 4096]);
        },
        name: "Sheer Force",
        num: 125
    },
    shellarmor: {
        rating: 1,
        onCriticalHit: false,
        isBreakable: true,
        name: "Shell Armor",
        num: 75
    },
    shielddust: {
        rating: 2,
        onModifySecondaries(secondaries) {
            this.debug('Shield Dust prevent secondary');
            return secondaries.filter(effect => !!(effect.self || effect.dustproof));
        },
        isBreakable: true,
        name: "Shield Dust",
        num: 19
    },
    shieldsdown: {
        rating: 3,
        onStart(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed)
                return;
            if (pokemon.hp > pokemon.maxhp / 2) {
                if (pokemon.species.forme !== 'Meteor') {
                    pokemon.formeChange('Minior-Meteor');
                }
            }
            else {
                if (pokemon.species.forme === 'Meteor') {
                    pokemon.formeChange(pokemon.set.species);
                }
            }
        },
        onResidualOrder: 29,
        onResidual(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp)
                return;
            if (pokemon.hp > pokemon.maxhp / 2) {
                if (pokemon.species.forme !== 'Meteor') {
                    pokemon.formeChange('Minior-Meteor');
                }
            }
            else {
                if (pokemon.species.forme === 'Meteor') {
                    pokemon.formeChange(pokemon.set.species);
                }
            }
        },
        onSetStatus(status, target, source, effect) {
            if (target.species.id !== 'miniormeteor' || target.transformed)
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Shields Down');
            }
            return false;
        },
        onTryAddVolatile(status, target) {
            if (target.species.id !== 'miniormeteor' || target.transformed)
                return;
            if (status.id !== 'yawn')
                return;
            this.add('-immune', target, '[from] ability: Shields Down');
            return null;
        },
        isPermanent: true,
        name: "Shields Down",
        num: 197
    },
    simple: {
        onModifyBoost(boosts) {
            let key;
            for (key in boosts) {
                boosts[key] *= 2;
            }
        },
        isBreakable: true,
        name: "Simple",
        rating: 4,
        num: 86
    },
    skilllink: {
        rating: 3,
        onModifyMove(move) {
            if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
                move.multihit = move.multihit[1];
            }
            if (move.multiaccuracy) {
                delete move.multiaccuracy;
            }
        },
        name: "Skill Link",
        num: 92
    },
    slowstart: {
        condition: {
			duration: 5,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
                this.add('-start', target, 'ability: Slow Start');
            },
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon, target, move) {
                // This is because the game checks the move's category in data, rather than what it is currently, unlike e.g. Huge Power
                if (this.dex.moves.get(move.id).category === 'Physical') {
                    return this.chainModify(0.5);
                }
            },
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon, target, move) {
                // Ordinary Z-moves like Breakneck Blitz will halve the user's Special Attack as well
                if (this.dex.moves.get(move.id).category === 'Physical') {
                    return this.chainModify(0.5);
                }
            },
			onModifySpe(spe, pokemon) {
                return this.chainModify(0.5);
            },
			onEnd(target) {
                this.add('-end', target, 'Slow Start');
            } 
		},
        rating: -1,
        onStart(pokemon) {
            pokemon.addVolatile('slowstart');
        },
        onEnd(pokemon) {
            delete pokemon.volatiles['slowstart'];
            this.add('-end', pokemon, 'Slow Start', '[silent]');
        },
        name: "Slow Start",
        num: 112
    },
    slushrush: {
        rating: 3,
        onModifySpe(spe, pokemon) {
            if (this.field.isWeather(['hail', 'snow'])) {
                return this.chainModify(2);
            }
        },
        name: "Slush Rush",
        num: 202
    },
    sniper: {
        rating: 2,
        onModifyDamage(damage, source, target, move) {
            if (target.getMoveHitData(move).crit) {
                this.debug('Sniper boost');
                return this.chainModify(1.5);
            }
        },
        name: "Sniper",
        num: 97
    },
    snowcloak: {
        onModifyAccuracyPriority: 8,
        onModifyAccuracy(accuracy) {
            if (typeof accuracy !== 'number')
                return;
            if (this.field.isWeather('hail')) {
                this.debug('Snow Cloak - decreasing accuracy');
                return accuracy * 0.8;
            }
        },
        rating: 1.5,
        onImmunity(type, pokemon) {
            if (type === 'hail')
                return false;
        },
        isBreakable: true,
        name: "Snow Cloak",
        num: 81
    },
    snowwarning: {
        onStart(source) {
            this.field.setWeather('hail');
        },
        rating: 4,
        name: "Snow Warning",
        num: 117
    },
    solarpower: {
        rating: 2,
        onModifySpAPriority: 5,
        onModifySpA(spa, pokemon) {
            if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
                return this.chainModify(1.5);
            }
        },
        onWeather(target, source, effect) {
            if (target.hasItem('utilityumbrella'))
                return;
            if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
                this.damage(target.baseMaxhp / 8, target, target);
            }
        },
        name: "Solar Power",
        num: 94
    },
    solidrock: {
        rating: 3,
        onSourceModifyDamage(damage, source, target, move) {
            if (target.getMoveHitData(move).typeMod > 0) {
                this.debug('Solid Rock neutralize');
                return this.chainModify(0.75);
            }
        },
        isBreakable: true,
        name: "Solid Rock",
        num: 116
    },
    soulheart: {
        rating: 3.5,
        onAnyFaintPriority: 1,
        onAnyFaint() {
            this.boost({ spa: 1 }, this.effectState.target);
        },
        name: "Soul-Heart",
        num: 220
    },
    soundproof: {
        onAllyTryHitSide() { },
        onTryHit(target, source, move) {
            if (move.flags['sound']) {
                this.add('-immune', target, '[from] ability: Soundproof');
                return null;
            }
        },
        rating: 1.5,
        isBreakable: true,
        name: "Soundproof",
        num: 43
    },
    speedboost: {
        onResidualOrder: 10,
        onResidualSubOrder: 3,
        rating: 4.5,
        onResidual(pokemon) {
            if (pokemon.activeTurns) {
                this.boost({ spe: 1 });
            }
        },
        name: "Speed Boost",
        num: 3
    },
    stakeout: {
        rating: 4.5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk, attacker, defender) {
            if (!defender.activeTurns) {
                this.debug('Stakeout boost');
                return this.chainModify(2);
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, attacker, defender) {
            if (!defender.activeTurns) {
                this.debug('Stakeout boost');
                return this.chainModify(2);
            }
        },
        name: "Stakeout",
        num: 198
    },
    stall: {
        rating: -1,
        onFractionalPriority: -0.1,
        name: "Stall",
        num: 100
    },
    stalwart: {
        rating: 0,
        onModifyMovePriority: 1,
        onModifyMove(move) {
            // most of the implementation is in Battle#getTarget
            move.tracksTarget = move.target !== 'scripted';
        },
        name: "Stalwart",
        num: 242
    },
    stamina: {
        rating: 3.5,
        onDamagingHit(damage, target, source, effect) {
            this.boost({ def: 1 });
        },
        name: "Stamina",
        num: 192
    },
    stancechange: {
        onBeforeMovePriority: 11,
        onBeforeMove(attacker, defender, move) {
            if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed)
                return;
            if (move.category === 'Status' && move.id !== 'kingsshield')
                return;
            const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
            if (attacker.species.name !== targetForme)
                attacker.formeChange(targetForme);
        },
        onModifyMove() { },
        rating: 4,
        onModifyMovePriority: 1,
        isPermanent: true,
        name: "Stance Change",
        num: 176
    },
    static: {
        onDamagingHit(damage, target, source, move) {
            if (damage && move.flags['contact']) {
                if (this.randomChance(1, 3)) {
                    source.trySetStatus('par', target);
                }
            }
        },
        rating: 2,
        name: "Static",
        num: 9
    },
    steadfast: {
        rating: 1,
        onFlinch(pokemon) {
            this.boost({ spe: 1 });
        },
        name: "Steadfast",
        num: 80
    },
    steamengine: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            if (['Water', 'Fire'].includes(move.type)) {
                this.boost({ spe: 6 });
            }
        },
        name: "Steam Engine",
        num: 243
    },
    steelworker: {
        rating: 3.5,
        onModifyAtkPriority: 5,
        onModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Steel') {
                this.debug('Steelworker boost');
                return this.chainModify(1.5);
            }
        },
        onModifySpAPriority: 5,
        onModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Steel') {
                this.debug('Steelworker boost');
                return this.chainModify(1.5);
            }
        },
        name: "Steelworker",
        num: 200
    },
    steelyspirit: {
        rating: 3.5,
        onAllyBasePowerPriority: 22,
        onAllyBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Steel') {
                this.debug('Steely Spirit boost');
                return this.chainModify(1.5);
            }
        },
        name: "Steely Spirit",
        num: 252
    },
    stench: {
        name: "Stench",
        rating: 0,
        num: 1
    },
    stickyhold: {
        onTakeItem(item, pokemon, source) {
            if ((source && source !== pokemon) || (this.activeMove && this.activeMove.id === 'knockoff')) {
                this.add('-activate', pokemon, 'ability: Sticky Hold');
                return false;
            }
        },
        rating: 2,
        isBreakable: true,
        name: "Sticky Hold",
        num: 60
    },
    stormdrain: {
        onTryHit() { },
        rating: 0,
        onAnyRedirectTarget(target, source, source2, move) {
            if (move.type !== 'Water' || move.flags['pledgecombo'])
                return;
            const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
            if (this.validTarget(this.effectState.target, source, redirectTarget)) {
                if (move.smartTarget)
                    move.smartTarget = false;
                if (this.effectState.target !== target) {
                    this.add('-activate', this.effectState.target, 'ability: Storm Drain');
                }
                return this.effectState.target;
            }
        },
        isBreakable: true,
        name: "Storm Drain",
        num: 114
    },
    strongjaw: {
        rating: 3,
        onBasePowerPriority: 19,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['bite']) {
                return this.chainModify(1.5);
            }
        },
        name: "Strong Jaw",
        num: 173
    },
    sturdy: {
        onDamage() { },
        rating: 0,
        onTryHit(pokemon, target, move) {
            if (move.ohko) {
                this.add('-immune', pokemon, '[from] ability: Sturdy');
                return null;
            }
        },
        onDamagePriority: -30,
        isBreakable: true,
        name: "Sturdy",
        num: 5
    },
    suctioncups: {
        rating: 1,
        onDragOutPriority: 1,
        onDragOut(pokemon) {
            this.add('-activate', pokemon, 'ability: Suction Cups');
            return null;
        },
        isBreakable: true,
        name: "Suction Cups",
        num: 21
    },
    superluck: {
        rating: 1.5,
        onModifyCritRatio(critRatio) {
            return critRatio + 1;
        },
        name: "Super Luck",
        num: 105
    },
    supersweetsyrup: {
		onStart(pokemon) {
			if (pokemon.syrupTriggered) return;
			pokemon.syrupTriggered = true;
			this.add('-ability', pokemon, 'Supersweet Syrup');
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Supersweet Syrup', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({evasion: -1}, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Supersweet Syrup",
		rating: 1.5,
		num: 306,
	},
    supremeoverlord: {
        onStart(pokemon) {
            if (pokemon.side.totalFainted) {
                this.add('-activate', pokemon, 'ability: Supreme Overlord');
                const fallen = Math.min(pokemon.side.totalFainted, 5);
                this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
                this.effectState.fallen = fallen;
            }
        },
        onEnd(pokemon) {
            this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
        },
        onBasePowerPriority: 21,
        onBasePower(basePower, attacker, defender, move) {
            if (this.effectState.fallen) {
                const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
                this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/4096`);
                return this.chainModify([powMod[this.effectState.fallen], 4096]);
            }
        },
        name: "Supreme Overlord",
        rating: 4,
        num: 293
    },
    surgesurfer: {
        rating: 3,
        onModifySpe(spe) {
            if (this.field.isTerrain('electricterrain')) {
                return this.chainModify(2);
            }
        },
        name: "Surge Surfer",
        num: 207
    },
    swarm: {
        onBasePowerPriority: 2,
        onBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
                this.debug('Swarm boost');
                return this.chainModify(1.5);
            }
        },
        name: "Swarm",
        rating: 2,
        num: 68
    },
    sweetveil: {
        rating: 2,
        name: "Sweet Veil",
        onAllySetStatus(status, target, source, effect) {
            if (status.id === 'slp') {
                this.debug('Sweet Veil interrupts sleep');
                const effectHolder = this.effectState.target;
                this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
                return null;
            }
        },
        onAllyTryAddVolatile(status, target) {
            if (status.id === 'yawn') {
                this.debug('Sweet Veil blocking yawn');
                const effectHolder = this.effectState.target;
                this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
                return null;
            }
        },
        isBreakable: true,
        num: 175
    },
    swiftswim: {
        rating: 3,
        onModifySpe(spe, pokemon) {
            if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
                return this.chainModify(2);
            }
        },
        name: "Swift Swim",
        num: 33
    },
    symbiosis: {
        onAllyAfterUseItem(item, pokemon) {
            const source = this.effectState.target;
            const myItem = source.takeItem();
            if (!myItem)
                return;
            if (!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
                !pokemon.setItem(myItem)) {
                source.item = myItem.id;
                return;
            }
            this.add('-activate', source, 'ability: Symbiosis', myItem, '[of] ' + pokemon);
        },
        rating: 0,
        name: "Symbiosis",
        num: 180
    },
    synchronize: {
        onAfterSetStatus(status, target, source, effect) {
            if (!source || source === target)
                return;
            if (effect && effect.id === 'toxicspikes')
                return;
            let id = status.id;
            if (id === 'slp' || id === 'frz')
                return;
            if (id === 'tox')
                id = 'psn';
            source.trySetStatus(id, target);
        },
        rating: 2,
        name: "Synchronize",
        num: 28
    },
    swordofruin: {
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Sword of Ruin');
        },
        onAnyModifyDef(def, target, source, move) {
            const abilityHolder = this.effectState.target;
            if (target.hasAbility('Sword of Ruin'))
                return;
            if (!move.ruinedDef?.hasAbility('Sword of Ruin'))
                move.ruinedDef = abilityHolder;
            if (move.ruinedDef !== abilityHolder)
                return;
            this.debug('Sword of Ruin Def drop');
            return this.chainModify(0.75);
        },
        name: "Sword of Ruin",
        rating: 4.5,
        num: 285
    },
    tabletsofruin: {
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Tablets of Ruin');
        },
        onAnyModifyAtk(atk, source, target, move) {
            const abilityHolder = this.effectState.target;
            if (source.hasAbility('Tablets of Ruin'))
                return;
            if (!move.ruinedAtk)
                move.ruinedAtk = abilityHolder;
            if (move.ruinedAtk !== abilityHolder)
                return;
            this.debug('Tablets of Ruin Atk drop');
            return this.chainModify(0.75);
        },
        name: "Tablets of Ruin",
        rating: 4.5,
        num: 284
    },
    tangledfeet: {
        onModifyAccuracyPriority: 6,
        onModifyAccuracy(accuracy, target) {
            if (typeof accuracy !== 'number')
                return;
            if (target?.volatiles['confusion']) {
                this.debug('Tangled Feet - decreasing accuracy');
                return accuracy * 0.5;
            }
        },
        rating: 1,
        isBreakable: true,
        name: "Tangled Feet",
        num: 77
    },
    tanglinghair: {
        rating: 2,
        onDamagingHit(damage, target, source, move) {
            if (this.checkMoveMakesContact(move, source, target, true)) {
                this.add('-ability', target, 'Tangling Hair');
                this.boost({ spe: -1 }, source, target, null, true);
            }
        },
        name: "Tangling Hair",
        num: 221
    },
    technician: {
        onBasePowerPriority: 19,
        rating: 3.5,
        onBasePower(basePower, attacker, defender, move) {
            const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
            this.debug('Base Power: ' + basePowerAfterMultiplier);
            if (basePowerAfterMultiplier <= 60) {
                this.debug('Technician boost');
                return this.chainModify(1.5);
            }
        },
        name: "Technician",
        num: 101
    },
    telepathy: {
        rating: 0,
        onTryHit(target, source, move) {
            if (target !== source && target.isAlly(source) && move.category !== 'Status') {
                this.add('-activate', target, 'ability: Telepathy');
                return null;
            }
        },
        isBreakable: true,
        name: "Telepathy",
        num: 140
    },
    teraformzero: {
		onAfterTerastallization(pokemon) {
			if (pokemon.baseSpecies.name !== 'Terapagos-Stellar') return;
			if (this.field.weather || this.field.terrain) {
				this.add('-ability', pokemon, 'Teraform Zero');
				this.field.clearWeather();
				this.field.clearTerrain();
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1},
		name: "Teraform Zero",
		rating: 3,
		num: 309,
	},
	terashell: {
		onEffectiveness(typeMod, target, type, move) {
			if (!target || target.baseSpecies.name !== 'Terapagos-Terastal') return;
			if (this.effectState.resisted) return -1; // all hits of multi-hit move should be not very effective
			if (move.category === 'Status') return;
			if (!target.runImmunity(move.type)) return; // immunity has priority
			if (target.hp < target.maxhp) return;

			this.add('-activate', target, 'ability: Tera Shell');
			this.effectState.resisted = true;
			return -1;
		},
		onAnyAfterMove() {
			this.effectState.resisted = false;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, breakable: 1},
		name: "Tera Shell",
		rating: 3.5,
		num: 308,
	},
	terashift: {
		onPreStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Terapagos') return;
			if (pokemon.species.forme !== 'Terastal') {
				this.add('-activate', pokemon, 'ability: Tera Shift');
				pokemon.formeChange('Terapagos-Terastal', this.effect, true);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1},
		name: "Tera Shift",
		rating: 3,
		num: 307,
	},
    teravolt: {
        rating: 3.5,
        onStart(pokemon) {
            this.add('-ability', pokemon, 'Teravolt');
        },
        onModifyMove(move) {
            move.ignoreAbility = true;
        },
        name: "Teravolt",
        num: 164
    },
    thermalexchange: {
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Fire') {
                this.boost({ atk: 1 });
            }
        },
        onUpdate(pokemon) {
            if (pokemon.status === 'brn') {
                this.add('-activate', pokemon, 'ability: Thermal Exchange');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'brn')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Thermal Exchange');
            }
            return false;
        },
        name: "Thermal Exchange",
        rating: 2.5,
        num: 270
    },
    thickfat: {
        onSourceBasePowerPriority: 1,
        onSourceBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Ice' || move.type === 'Fire') {
                return this.chainModify(0.5);
            }
        },
        isBreakable: true,
        name: "Thick Fat",
        rating: 3.5,
        num: 47
    },
    tintedlens: {
        rating: 4,
        onModifyDamage(damage, source, target, move) {
            if (target.getMoveHitData(move).typeMod < 0) {
                this.debug('Tinted Lens boost');
                return this.chainModify(2);
            }
        },
        name: "Tinted Lens",
        num: 110
    },
    torrent: {
        onBasePowerPriority: 2,
        onBasePower(basePower, attacker, defender, move) {
            if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
                this.debug('Torrent boost');
                return this.chainModify(1.5);
            }
        },
        name: "Torrent",
        rating: 2,
        num: 67
    },
    toughclaws: {
        rating: 3.5,
        onBasePowerPriority: 21,
        onBasePower(basePower, attacker, defender, move) {
            if (move.flags['contact']) {
                return this.chainModify([5325, 4096]);
            }
        },
        name: "Tough Claws",
        num: 181
    },
    toxicboost: {
        rating: 2.5,
        onBasePowerPriority: 19,
        onBasePower(basePower, attacker, defender, move) {
            if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
                return this.chainModify(1.5);
            }
        },
        name: "Toxic Boost",
        num: 137
    },
    toxicchain: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;

			if (this.randomChance(3, 10)) {
				target.trySetStatus('tox', source);
			}
		},
		flags: {},
		name: "Toxic Chain",
		rating: 4.5,
		num: 305,
	},
    toxicdebris: {
        onDamagingHit(damage, target, source, move) {
            const side = source.isAlly(target) ? source.side.foe : source.side;
            const toxicSpikes = side.sideConditions['toxicspikes'];
            if (move.category === 'Physical' && (!toxicSpikes || toxicSpikes.layers < 2)) {
                this.add('-activate', target, 'ability: Toxic Debris');
                side.addSideCondition('toxicspikes', target);
            }
        },
        name: "Toxic Debris",
        rating: 3.5,
        num: 295
    },
    trace: {
        onUpdate(pokemon) {
            if (!pokemon.isStarted)
                return;
            const target = pokemon.side.randomFoe();
            if (!target || target.fainted)
                return;
            const ability = target.getAbility();
            const bannedAbilities = ['forecast', 'multitype', 'trace'];
            if (bannedAbilities.includes(target.ability)) {
                return;
            }
            if (pokemon.setAbility(ability)) {
                this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
            }
        },
        rating: 2.5,
        onStart(pokemon) {
            // n.b. only affects Hackmons
            // interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
            if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
                this.effectState.gaveUp = true;
            }
            // interaction with Ability Shield is similar to No Ability
            if (pokemon.hasItem('Ability Shield')) {
                this.add('-block', pokemon, 'item: Ability Shield');
                this.effectState.gaveUp = true;
            }
        },
        name: "Trace",
        num: 36
    },
    transistor: {
        onModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Electric') {
                this.debug('Transistor boost');
                return this.chainModify(1.5);
            }
        },
        onModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Electric') {
                this.debug('Transistor boost');
                return this.chainModify(1.5);
            }
        },
        rating: 3.5,
        onModifyAtkPriority: 5,
        onModifySpAPriority: 5,
        name: "Transistor",
        num: 262
    },
    triage: {
        rating: 3.5,
        onModifyPriority(priority, pokemon, target, move) {
            if (move?.flags['heal'])
                return priority + 3;
        },
        name: "Triage",
        num: 205
    },
    truant: {
        onStart() { },
        onSwitchIn(pokemon) {
            pokemon.truantTurn = this.turn !== 0;
        },
        onBeforeMove(pokemon) {
            if (pokemon.truantTurn) {
                this.add('cant', pokemon, 'ability: Truant');
                return false;
            }
        },
        onResidualOrder: 27,
        onResidual(pokemon) {
            pokemon.truantTurn = !pokemon.truantTurn;
        },
        rating: -1,
        onBeforeMovePriority: 9,
        condition: {},
        name: "Truant",
        num: 54
    },
    turboblaze: {
        rating: 3.5,
        onStart(pokemon) {
            this.add('-ability', pokemon, 'Turboblaze');
        },
        onModifyMove(move) {
            move.ignoreAbility = true;
        },
        name: "Turboblaze",
        num: 163
    },
    unaware: {
        rating: 4,
        name: "Unaware",
        onAnyModifyBoost(boosts, pokemon) {
            const unawareUser = this.effectState.target;
            if (unawareUser === pokemon)
                return;
            if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
                boosts['def'] = 0;
                boosts['spd'] = 0;
                boosts['evasion'] = 0;
            }
            if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
                boosts['atk'] = 0;
                boosts['def'] = 0;
                boosts['spa'] = 0;
                boosts['accuracy'] = 0;
            }
        },
        isBreakable: true,
        num: 109
    },
    unburden: {
        condition: {
			onModifySpe(spe, pokemon) {
                if ((!pokemon.item || pokemon.itemState.knockedOff) && !pokemon.ignoringAbility()) {
                    return this.chainModify(2);
                }
            } 
		},
        rating: 3.5,
        onAfterUseItem(item, pokemon) {
            if (pokemon !== this.effectState.target)
                return;
            pokemon.addVolatile('unburden');
        },
        onTakeItem(item, pokemon) {
            pokemon.addVolatile('unburden');
        },
        onEnd(pokemon) {
            pokemon.removeVolatile('unburden');
        },
        name: "Unburden",
        num: 84
    },
    unnerve: {
        rating: 1.5,
        onPreStart(pokemon) {
            this.add('-ability', pokemon, 'Unnerve');
            this.effectState.unnerved = true;
        },
        onStart(pokemon) {
            if (this.effectState.unnerved)
                return;
            this.add('-ability', pokemon, 'Unnerve');
            this.effectState.unnerved = true;
        },
        onEnd() {
            this.effectState.unnerved = false;
        },
        onFoeTryEatItem() {
            return !this.effectState.unnerved;
        },
        name: "Unnerve",
        num: 127
    },
    unseenfist: {
        rating: 2,
        onModifyMove(move) {
            if (move.flags['contact'])
                delete move.flags['protect'];
        },
        name: "Unseen Fist",
        num: 260
    },
    vesselofruin: {
        onStart(pokemon) {
            if (this.suppressingAbility(pokemon))
                return;
            this.add('-ability', pokemon, 'Vessel of Ruin');
        },
        onAnyModifySpA(spa, source, target, move) {
            const abilityHolder = this.effectState.target;
            if (source.hasAbility('Vessel of Ruin'))
                return;
            if (!move.ruinedSpA)
                move.ruinedSpA = abilityHolder;
            if (move.ruinedSpA !== abilityHolder)
                return;
            this.debug('Vessel of Ruin SpA drop');
            return this.chainModify(0.75);
        },
        name: "Vessel of Ruin",
        rating: 4.5,
        num: 284
    },
    victorystar: {
        rating: 2,
        onAnyModifyAccuracyPriority: -1,
        onAnyModifyAccuracy(accuracy, target, source) {
            if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
                return this.chainModify([4506, 4096]);
            }
        },
        name: "Victory Star",
        num: 162
    },
    vitalspirit: {
        rating: 2.5,
        onUpdate(pokemon) {
            if (pokemon.status === 'slp') {
                this.add('-activate', pokemon, 'ability: Vital Spirit');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'slp')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Vital Spirit');
            }
            return false;
        },
        isBreakable: true,
        name: "Vital Spirit",
        num: 72
    },
    voltabsorb: {
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Electric' && move.id !== 'thunderwave') {
                if (!this.heal(target.baseMaxhp / 4)) {
                    this.add('-immune', target, '[from] ability: Volt Absorb');
                }
                return null;
            }
        },
        rating: 3.5,
        isBreakable: true,
        name: "Volt Absorb",
        num: 10
    },
    wanderingspirit: {
        rating: 2.5,
        onDamagingHit(damage, target, source, move) {
            const additionalBannedAbilities = ['hungerswitch', 'illusion', 'neutralizinggas', 'wonderguard'];
            if (source.getAbility().isPermanent || additionalBannedAbilities.includes(source.ability) ||
                target.volatiles['dynamax']) {
                return;
            }
            if (this.checkMoveMakesContact(move, source, target)) {
                const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, source.ability);
                if (!targetCanBeSet)
                    return targetCanBeSet;
                const sourceAbility = source.setAbility('wanderingspirit', target);
                if (!sourceAbility)
                    return;
                if (target.isAlly(source)) {
                    this.add('-activate', target, 'Skill Swap', '', '', '[of] ' + source);
                }
                else {
                    this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', '[of] ' + source);
                }
                target.setAbility(sourceAbility);
            }
        },
        name: "Wandering Spirit",
        num: 254
    },
    waterabsorb: {
        rating: 3.5,
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Water') {
                if (!this.heal(target.baseMaxhp / 4)) {
                    this.add('-immune', target, '[from] ability: Water Absorb');
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Water Absorb",
        num: 11
    },
    waterbubble: {
        rating: 4.5,
        onSourceModifyAtkPriority: 5,
        onSourceModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Fire') {
                return this.chainModify(0.5);
            }
        },
        onSourceModifySpAPriority: 5,
        onSourceModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Fire') {
                return this.chainModify(0.5);
            }
        },
        onModifyAtk(atk, attacker, defender, move) {
            if (move.type === 'Water') {
                return this.chainModify(2);
            }
        },
        onModifySpA(atk, attacker, defender, move) {
            if (move.type === 'Water') {
                return this.chainModify(2);
            }
        },
        onUpdate(pokemon) {
            if (pokemon.status === 'brn') {
                this.add('-activate', pokemon, 'ability: Water Bubble');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'brn')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Water Bubble');
            }
            return false;
        },
        isBreakable: true,
        name: "Water Bubble",
        num: 199
    },
    watercompaction: {
        rating: 1.5,
        onDamagingHit(damage, target, source, move) {
            if (move.type === 'Water') {
                this.boost({ def: 2 });
            }
        },
        name: "Water Compaction",
        num: 195
    },
    waterveil: {
        rating: 2,
        onUpdate(pokemon) {
            if (pokemon.status === 'brn') {
                this.add('-activate', pokemon, 'ability: Water Veil');
                pokemon.cureStatus();
            }
        },
        onSetStatus(status, target, source, effect) {
            if (status.id !== 'brn')
                return;
            if (effect?.status) {
                this.add('-immune', target, '[from] ability: Water Veil');
            }
            return false;
        },
        isBreakable: true,
        name: "Water Veil",
        num: 41
    },
    weakarmor: {
        onDamagingHit(damage, target, source, move) {
            if (move.category === 'Physical') {
                this.boost({ def: -1, spe: 1 }, target, target);
            }
        },
        rating: 0.5,
        name: "Weak Armor",
        num: 133
    },
    wellbakedbody: {
        onTryHit(target, source, move) {
            if (target !== source && move.type === 'Fire') {
                if (!this.boost({ def: 2 })) {
                    this.add('-immune', target, '[from] ability: Well-Baked Body');
                }
                return null;
            }
        },
        isBreakable: true,
        name: "Well-Baked Body",
        rating: 3.5,
        num: 273
    },
    whitesmoke: {
        rating: 2,
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
                this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
            }
        },
        isBreakable: true,
        name: "White Smoke",
        num: 73
    },
    wimpout: {
        rating: 1,
        onEmergencyExit(target) {
            if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag)
                return;
            for (const side of this.sides) {
                for (const active of side.active) {
                    active.switchFlag = false;
                }
            }
            target.switchFlag = true;
            this.add('-activate', target, 'ability: Wimp Out');
        },
        name: "Wimp Out",
        num: 193
    },
    windpower: {
        onDamagingHitOrder: 1,
        onDamagingHit(damage, target, source, move) {
            if (move.flags['wind']) {
                target.addVolatile('charge');
            }
        },
        onAllySideConditionStart(target, source, sideCondition) {
            const pokemon = this.effectState.target;
            if (sideCondition.id === 'tailwind') {
                pokemon.addVolatile('charge');
            }
        },
        name: "Wind Power",
        rating: 1,
        num: 277
    },
    windrider: {
        onStart(pokemon) {
            if (pokemon.side.sideConditions['tailwind']) {
                this.boost({ atk: 1 }, pokemon, pokemon);
            }
        },
        onTryHit(target, source, move) {
            if (target !== source && move.flags['wind']) {
                if (!this.boost({ atk: 1 }, target, target)) {
                    this.add('-immune', target, '[from] ability: Wind Rider');
                }
                return null;
            }
        },
        onAllySideConditionStart(target, source, sideCondition) {
            const pokemon = this.effectState.target;
            if (sideCondition.id === 'tailwind') {
                this.boost({ atk: 1 }, pokemon, pokemon);
            }
        },
        name: "Wind Rider",
        rating: 3.5,
        num: 274
    },
    wonderguard: {
        onTryHit(target, source, move) {
            if (move.id === 'firefang') {
                this.hint("In Gen 4, Fire Fang is always able to hit through Wonder Guard.");
                return;
            }
            if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle')
                return;
            this.debug('Wonder Guard immunity: ' + move.id);
            if (target.runEffectiveness(move) <= 0) {
                this.add('-immune', target, '[from] ability: Wonder Guard');
                return null;
            }
        },
        rating: 5,
        isBreakable: true,
        name: "Wonder Guard",
        num: 25
    },
    wonderskin: {
        rating: 2,
        onModifyAccuracyPriority: 10,
        onModifyAccuracy(accuracy, target, source, move) {
            if (move.category === 'Status' && typeof accuracy === 'number') {
                this.debug('Wonder Skin - setting accuracy to 50');
                return 50;
            }
        },
        isBreakable: true,
        name: "Wonder Skin",
        num: 147
    },
    zenmode: {
        isPermanent: false,
        rating: 0,
        onResidualOrder: 29,
        onResidual(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
                return;
            }
            if (pokemon.hp <= pokemon.maxhp / 2 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
                pokemon.addVolatile('zenmode');
            }
            else if (pokemon.hp > pokemon.maxhp / 2 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
                pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
                pokemon.removeVolatile('zenmode');
            }
        },
        onEnd(pokemon) {
            if (!pokemon.volatiles['zenmode'] || !pokemon.hp)
                return;
            pokemon.transformed = false;
            delete pokemon.volatiles['zenmode'];
            if (pokemon.species.baseSpecies === 'Darmanitan' && pokemon.species.battleOnly) {
                pokemon.formeChange(pokemon.species.battleOnly, this.effect, false, '[silent]');
            }
        },
        condition: {
			onStart(pokemon) {
                if (!pokemon.species.name.includes('Galar')) {
                    if (pokemon.species.id !== 'darmanitanzen')
                        pokemon.formeChange('Darmanitan-Zen');
                }
                else {
                    if (pokemon.species.id !== 'darmanitangalarzen')
                        pokemon.formeChange('Darmanitan-Galar-Zen');
                }
            },
			onEnd(pokemon) {
                if (['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
                    pokemon.formeChange(pokemon.species.battleOnly);
                }
            } 
		},
        name: "Zen Mode",
        num: 161
    },
    zerotohero: {
        onSwitchOut(pokemon) {
            if (pokemon.baseSpecies.baseSpecies !== 'Palafin' || pokemon.transformed)
                return;
            if (pokemon.species.forme !== 'Hero') {
                pokemon.formeChange('Palafin-Hero', this.effect, true);
            }
        },
        onSwitchIn() {
            this.effectState.switchingIn = true;
        },
        onStart(pokemon) {
            if (!this.effectState.switchingIn)
                return;
            this.effectState.switchingIn = false;
            if (pokemon.baseSpecies.baseSpecies !== 'Palafin' || pokemon.transformed)
                return;
            if (!this.effectState.heroMessageDisplayed && pokemon.species.forme === 'Hero') {
                this.add('-activate', pokemon, 'ability: Zero to Hero');
                this.effectState.heroMessageDisplayed = true;
            }
        },
        isPermanent: true,
        name: "Zero to Hero",
        rating: 5,
        num: 278
    },
    mountaineer: {
        rating: 3,
        onDamage(damage, target, source, effect) {
            if (effect && effect.id === 'stealthrock') {
                return false;
            }
        },
        onTryHit(target, source, move) {
            if (move.type === 'Rock' && !target.activeTurns) {
                this.add('-immune', target, '[from] ability: Mountaineer');
                return null;
            }
        },
        isNonstandard: "CAP",
        isBreakable: true,
        name: "Mountaineer",
        num: -2
    },
    rebound: {
        rating: 3,
        isNonstandard: "CAP",
        name: "Rebound",
        onTryHitPriority: 1,
        onTryHit(target, source, move) {
            if (this.effectState.target.activeTurns)
                return;
            if (target === source || move.hasBounced || !move.flags['reflectable']) {
                return;
            }
            const newMove = this.dex.getActiveMove(move.id);
            newMove.hasBounced = true;
            this.actions.useMove(newMove, target, source);
            return null;
        },
        onAllyTryHitSide(target, source, move) {
            if (this.effectState.target.activeTurns)
                return;
            if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
                return;
            }
            const newMove = this.dex.getActiveMove(move.id);
            newMove.hasBounced = true;
            this.actions.useMove(newMove, this.effectState.target, source);
            return null;
        },
        condition: {
			duration: 1 
		},
        isBreakable: true,
        num: -3
    },
    persistent: {
        rating: 3,
        isNonstandard: "CAP",
        name: "Persistent",
        num: -4
    },
}