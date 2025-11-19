export const Scripts: ModdedBattleScriptsData = {
  gen: 9,
  pokemon: {
    inherit: true,
    addType(newType: string) {
      if (this.terastallized) return false;
      if (this.hasItem('identitycard')) return false;
      this.addedType = newType;
      return true;
    },
    setType(newType: string | string[], enforce = false) {
      if (!enforce) {
        // No Pokemon should be able to have Stellar as a base type
        if (typeof newType === 'string' ? newType === 'Stellar' : newType.includes('Stellar')) return false;

        if (this.hasItem('identitycard')) return false;
        // First type of Arceus, Silvally cannot be normally changed
        if ((this.battle.gen >= 5 && (this.species.num === 493 || this.species.num === 773)) ||
          (this.battle.gen === 4 && this.hasAbility('multitype'))) {
          return false;
        }
        // Terastallized Pokemon cannot have their base type changed except via forme change
        if (this.terastallized) return false;
      }
  
      if (!newType) throw new Error("Must pass type to setType");
      this.types = (typeof newType === 'string' ? [newType] : newType);
      this.addedType = '';
      this.knownType = true;
      this.apparentType = this.types.join('/');
  
      return true;
    },
    setAbility(ability: string | Ability, source?: Pokemon | null, isFromFormeChange = false, isTransform = false) {
      if (!this.hp) return false;
      if (typeof ability === 'string') ability = this.battle.dex.abilities.get(ability);
      const oldAbility = this.ability;
      if (!isFromFormeChange) {
        if (ability.flags && (ability.flags['cantsuppress'] || this.getAbility().flags['cantsuppress'])) return false;
      }
      if (!isFromFormeChange && !isTransform) {
        const setAbilityEvent: boolean | null = this.battle.runEvent('SetAbility', this, source, this.battle.effect, ability);
        if (!setAbilityEvent) return setAbilityEvent;
      }
      this.battle.singleEvent('End', this.battle.dex.abilities.get(oldAbility), this.abilityState, this, source);
      if (this.battle.effect && this.battle.effect.effectType === 'Move' && !isFromFormeChange) {
        this.battle.add(
          '-endability', this, this.battle.dex.abilities.get(oldAbility),
          `[from] move: ${this.battle.dex.moves.get(this.battle.effect.id)}`
        );
      }
      this.ability = ability.id;
      this.abilityState = {id: ability.id, target: this};
      if (ability.id && this.battle.gen > 3 &&
        (!isTransform || oldAbility !== ability.id || this.battle.gen <= 4)) {
        this.battle.singleEvent('Start', ability, this.abilityState, this, source);
      }
      return oldAbility;
    },
    takeDual(source) {
      if (!this.isActive) return false;
      if (!this.ability) return false;
      if (!source) source = this;
      const dual = this.getAbility() as any as Item;
      if (dual.effectType !== 'Item') return false;
      if (this.battle.runEvent('TakeItem', this, source, null, dual)) {
        this.baseAbility = this.ability = '';
        this.abilityData = {id: '', target: this};
        return dual;
      }
      return false;
    },
  },
  /*actions: {
    canMegaEvo(pokemon) {
      const species = pokemon.baseSpecies;
      const altForme = pokemon.baseSpecies.otherFormes && this.dex.species.get(pokemon.baseSpecies.otherFormes[0]);
      const item = pokemon.getItem();
      // Mega Rayquaza
      if ((this.battle.gen <= 7 || this.battle.ruleTable.has('+pokemontag:past') ||
        this.battle.ruleTable.has('+pokemontag:future')) &&
        altForme?.isMega && altForme?.requiredMove &&
        pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) {
        return altForme.name;
      }
      // Temporary hardcode until generation shift
      if ((species.baseSpecies === "Floette" || species.baseSpecies === "Zygarde") && item.megaEvolves === species.name) {
        return item.megaStone;
      }
      if (item.name === "Slowbronite" && pokemon.baseSpecies.name === "Slowbro") {
        return "Slowbro-Mega";
      }
      else if (item.name === "Slowbronite" && pokemon.baseSpecies.name === "Slowbro-Galar") {
        return "Slowbro-Galar-Mega";
      }
      else if (item.name === "Zoroarkite" && pokemon.baseSpecies.name === "Zoroark-Hisui") {
        return "Zoroark-Hisui-Mega";
      }
      else if (item.name === "Scizorite" && pokemon.baseSpecies.name === "Scizor") {
        return "Scizor-Mega";
      }
      else if (item.name === "Scizorite" && pokemon.baseSpecies.name === "Scizor-Galar") {
        return "Scizor-Galar-Mega";
      }
      else if (item.name === "Typhlosionite" && pokemon.baseSpecies.name === "Typhlosion") {
        return "Typhlosion-Mega";
      }
      else if (item.name === "Typhlosionite" && pokemon.baseSpecies.name === "Typhlosion-Hisui") {
        return "Typhlosion-Hisui-Mega";
      }
      else if (item.name === "Medichamite" && pokemon.baseSpecies.name === "Medicham-Hisui") {
        return null;
      }
      else if (item.name === "Sablenite" && pokemon.baseSpecies.name === "Sableye-Unova") {
        return null;
      }
      else if (item.name === "Emboarite" && pokemon.baseSpecies.name === "Emboar-Galar") {
        return null;
      }
      else if (item.name === "Cramorantite" && pokemon.baseSpecies.name === "Cramorant-Gulping") {
        return "Cramorant-Gulping-Mega";
      }
      else if (item.name === "Cramorantite" && pokemon.baseSpecies.name === "Cramorant-Gorging") {
        return "Cramorant-Gorging-Mega";
      }
      else if (item.name === "Toxtricitite" && pokemon.baseSpecies.name === "Toxtricity-Low-Key") {
        return "Toxtricity-Low-Key-Mega";
      }
      return item.megaStone;
    },

    runSwitch(pokemon: Pokemon) {
      this.battle.runEvent('Swap', pokemon);

      if (this.battle.gen >= 5) {
        this.battle.runEvent('SwitchIn', pokemon);
      }

      this.battle.runEvent('EntryHazard', pokemon);

      if (this.battle.gen <= 4) {
        this.battle.runEvent('SwitchIn', pokemon);
      }

      if (this.battle.gen <= 2) {
        // pokemon.lastMove is reset for all Pokemon on the field after a switch. This affects Mirror Move.
        for (const poke of this.battle.getAllActive()) poke.lastMove = null;
        if (!pokemon.side.faintedThisTurn && pokemon.draggedIn !== this.battle.turn) {
          this.battle.runEvent('AfterSwitchInSelf', pokemon);
        }
      }
      if (!pokemon.hp) return false;
      pokemon.isStarted = true;
      if (!pokemon.fainted) {
        this.battle.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
        this.battle.singleEvent('Start', pokemon.getItem(), pokemon.itemState, pokemon);
      }
      if (this.battle.gen === 4) {
        for (const foeActive of pokemon.foes()) {
          foeActive.removeVolatile('substitutebroken');
        }
      }
      this.battle.runEvent('HiveMind', pokemon); // making Hive Mind activate at the appropriate time
      pokemon.addVolatile('indomitablespirit'); // yes this is a really ugly way to do this but it's better than a ruleset okay
      pokemon.draggedIn = null;
      return true;
    },
    modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
      const tr = this.battle.trunc;
      if (!move.type) move.type = '???';
      const type = move.type;

      baseDamage += 2;

      if (move.spreadHit) {
        // multi-target modifier (doubles only)
        const spreadModifier = this.battle.gameType === 'freeforall' ? 0.5 : 0.75;
        this.battle.debug(`Spread modifier: ${spreadModifier}`);
        baseDamage = this.battle.modify(baseDamage, spreadModifier);
      } else if (move.multihitType === 'parentalbond' && move.hit > 1) {
        // Parental Bond modifier
        const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
        this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
        baseDamage = this.battle.modify(baseDamage, bondModifier);
      } else if (move.multihitType === 'multiheaded' as 'parentalbond' && move.hit > 1) {
        // Multiheaded modifier
        const bondModifier = 0.15;
        this.battle.debug(`Multiheaded modifier: ${bondModifier}`);
        baseDamage = this.battle.modify(baseDamage, bondModifier);
      }

      // weather modifier
      baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

      // crit - not a modifier
      const isCrit = target.getMoveHitData(move).crit;
      if (isCrit) {
        baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
      }

      // random factor - also not a modifier
      baseDamage = this.battle.randomizer(baseDamage);

      // STAB
      // The "???" type never gets STAB
      // Not even if you Roost in Gen 4 and somehow manage to use
      // Struggle in the same turn.
      // (On second thought, it might be easier to get a MissingNo.)
      if (type !== '???') {
        let stab: number | [number, number] = 1;

        const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
        if (isSTAB) {
          stab = 1.5;
        }

        // The Stellar tera type makes this incredibly confusing
        // If the move's type does not match one of the user's base types,
        // the Stellar tera type applies a one-time 1.2x damage boost for that type.
        //
        // If the move's type does match one of the user's base types,
        // then the Stellar tera type applies a one-time 2x STAB boost for that type,
        // and then goes back to using the regular 1.5x STAB boost for those types.
        if (pokemon.terastallized === 'Stellar') {
          if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
            stab = isSTAB ? 2 : [4915, 4096];
            move.stellarBoosted = true;
            if (pokemon.species.name !== 'Terapagos-Stellar') {
              pokemon.stellarBoostedTypes.push(type);
            }
          }
        } else {
          if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
            stab = 2;
          }
          stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
        }

        baseDamage = this.battle.modify(baseDamage, stab);
      }

      // types
      let typeMod = target.runEffectiveness(move);
      typeMod = this.battle.clampIntRange(typeMod, -6, 6);
      target.getMoveHitData(move).typeMod = typeMod;
      if (typeMod > 0) {
        if (!suppressMessages) this.battle.add('-supereffective', target);

        for (let i = 0; i < typeMod; i++) {
          baseDamage *= 2;
        }
      }
      if (typeMod < 0) {
        if (!suppressMessages) this.battle.add('-resisted', target);

        for (let i = 0; i > typeMod; i--) {
          baseDamage = tr(baseDamage / 2);
        }
      }

      if (isCrit && !suppressMessages) this.battle.add('-crit', target);

      if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
        if (this.battle.gen < 6 || move.id !== 'facade') {
          baseDamage = this.battle.modify(baseDamage, 0.5);
        }
      }

      // Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
      if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

      // Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
      baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

      if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
        baseDamage = this.battle.modify(baseDamage, 0.25);
        this.battle.add('-zbroken', target);
      }

      // Generation 6-7 moves the check for minimum 1 damage after the final modifier...
      if (this.battle.gen !== 5 && !baseDamage) return 1;

      // ...but 16-bit truncation happens even later, and can truncate to 0
      return tr(baseDamage, 16);
    },




    hitStepMoveHitLoop(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) { // Temporary name
      let damage: (number | boolean | undefined)[] = [];
      for (const i of targets.keys()) {
        damage[i] = 0;
      }
      move.totalDamage = 0;
      pokemon.lastDamage = 0;
      let targetHits = move.multihit || 1;
      if (Array.isArray(targetHits)) {
        // yes, it's hardcoded... meh
        if (targetHits[0] === 2 && targetHits[1] === 5) {
          if (this.battle.gen >= 5) {
            // 35-35-15-15 out of 100 for 2-3-4-5 hits
            targetHits = this.battle.sample([2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
            if (targetHits < 4 && pokemon.hasItem('loadeddice')) {
              targetHits = 5 - this.battle.random(2);
            }
          } else {
            targetHits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
          }
        } else {
          targetHits = this.battle.random(targetHits[0], targetHits[1] + 1);
        }
      }
      if (targetHits === 10 && pokemon.hasItem('loadeddice')) targetHits -= this.battle.random(7);
      targetHits = Math.floor(targetHits);
      let nullDamage = true;
      let moveDamage: (number | boolean | undefined)[] = [];
      // There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
      const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;

      let targetsCopy: (Pokemon | false | null)[] = targets.slice(0);
      let hit: number;
      for (hit = 1; hit <= targetHits; hit++) {
        if (damage.includes(false)) break;
        if (hit > 1 && pokemon.status === 'slp' && (!isSleepUsable || this.battle.gen === 4)) break;
        if (targets.every(target => !target?.hp)) break;
        move.hit = hit;
        if (move.smartTarget && targets.length > 1) {
          targetsCopy = [targets[hit - 1]];
          damage = [damage[hit - 1]];
        } else {
          targetsCopy = targets.slice(0);
        }
        const target = targetsCopy[0]; // some relevant-to-single-target-moves-only things are hardcoded
        if (target && typeof move.smartTarget === 'boolean') {
          if (hit > 1) {
            this.battle.addMove('-anim', pokemon, move.name, target);
          } else {
            this.battle.retargetLastMove(target);
          }
        }

        // like this (Triple Kick)
        if (target && move.multiaccuracy && hit > 1) {
          let accuracy = move.accuracy;
          const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
          if (accuracy !== true) {
            if (!move.ignoreAccuracy) {
              const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
              const boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
              if (boost > 0) {
                accuracy *= boostTable[boost];
              } else {
                accuracy /= boostTable[-boost];
              }
            }
            if (!move.ignoreEvasion) {
              const boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
              const boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
              if (boost > 0) {
                accuracy /= boostTable[boost];
              } else if (boost < 0) {
                accuracy *= boostTable[-boost];
              }
            }
          }
          accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
          if (!move.alwaysHit) {
            accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
            if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) break;
          }
        }

        const moveData = move;
        if (!moveData.flags) moveData.flags = {};

        // Modifies targetsCopy (which is why it's a copy)
        [moveDamage, targetsCopy] = this.spreadMoveHit(targetsCopy, pokemon, move, moveData);

        if (!moveDamage.some(val => val !== false)) break;
        nullDamage = false;

        for (const [i, md] of moveDamage.entries()) {
          // Damage from each hit is individually counted for the
          // purposes of Counter, Metal Burst, and Mirror Coat.
          damage[i] = md === true || !md ? 0 : md;
          // Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
          move.totalDamage += damage[i] as number;
        }
        if (move.mindBlownRecoil) {
          const hpBeforeRecoil = pokemon.hp;
          this.battle.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
          move.mindBlownRecoil = false;
          if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
            this.battle.runEvent('EmergencyExit', pokemon, pokemon);
          }
        }
        this.battle.eachEvent('Update');
        if (!pokemon.hp && targets.length === 1) {
          hit++; // report the correct number of hits for multihit moves
          break;
        }
      }
      // hit is 1 higher than the actual hit count
      if (hit === 1) return damage.fill(false);
      if (nullDamage) damage.fill(false);
      this.battle.faintMessages(false, false, !pokemon.hp);
      if (move.multihit && typeof move.smartTarget !== 'boolean') {
        this.battle.add('-hitcount', targets[0], hit - 1);
      }

      if ((move.recoil || (move.id === 'chloroblast' && !pokemon.hasAbility('explosive') && !pokemon.hasAbility('nevergonnagiveyouup'))) && move.totalDamage) {
        const hpBeforeRecoil = pokemon.hp;
        this.battle.damage(this.calcRecoilDamage(move.totalDamage, move, pokemon), pokemon, pokemon, 'recoil');
        if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
          this.battle.runEvent('EmergencyExit', pokemon, pokemon);
        }
      }

      if (move.struggleRecoil) {
        const hpBeforeRecoil = pokemon.hp;
        let recoilDamage;
        if (this.dex.gen >= 5) {
          recoilDamage = this.battle.clampIntRange(Math.round(pokemon.baseMaxhp / 4), 1);
        } else {
          recoilDamage = this.battle.clampIntRange(this.battle.trunc(pokemon.maxhp / 4), 1);
        }
        this.battle.directDamage(recoilDamage, pokemon, pokemon, { id: 'strugglerecoil' } as Condition);
        if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
          this.battle.runEvent('EmergencyExit', pokemon, pokemon);
        }
      }

      // smartTarget messes up targetsCopy, but smartTarget should in theory ensure that targets will never fail, anyway
      if (move.smartTarget) {
        if (move.smartTarget && targets.length > 1) {
          targetsCopy = [targets[hit - 1]];
        } else {
          targetsCopy = targets.slice(0);
        }
      }

      for (const [i, target] of targetsCopy.entries()) {
        if (target && pokemon !== target) {
          target.gotAttacked(move, moveDamage[i] as number | false | undefined, pokemon);
          if (typeof moveDamage[i] === 'number') {
            target.timesAttacked += hit - 1;
          }
        }
      }

      if (move.ohko && !targets[0].hp) this.battle.add('-ohko');

      if (!damage.some(val => !!val || val === 0)) return damage;

      this.battle.eachEvent('Update');

      this.afterMoveSecondaryEvent(targetsCopy.filter(val => !!val) as Pokemon[], pokemon, move);

      if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
        for (const [i, d] of damage.entries()) {
          // There are no multihit spread moves, so it's safe to use move.totalDamage for multihit moves
          // The previous check was for `move.multihit`, but that fails for Dragon Darts
          const curDamage = targets.length === 1 ? move.totalDamage : d;
          if (typeof curDamage === 'number' && targets[i].hp) {
            const targetHPBeforeDamage = (targets[i].hurtThisTurn || 0) + curDamage;
            if (targets[i].hp <= targets[i].maxhp / 2 && targetHPBeforeDamage > targets[i].maxhp / 2) {
              this.battle.runEvent('EmergencyExit', targets[i], pokemon);
            }
          }
        }
      }

      return damage;
    },

    calcRecoilDamage(damageDealt: number, move: Move, pokemon: Pokemon): number {
      if (move.id === 'chloroblast') return Math.round(pokemon.maxhp / 2);
      return this.battle.clampIntRange(Math.round(damageDealt * move.recoil![0] / move.recoil![1]), 1);
    }*/
  },



  init() {

    // magicmissile 
    this.modData('Learnsets', 'rayquaza').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'mismagius').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'uxie').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'dialga').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'palkia').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'giratina').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'arceus').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'zoroarkhisui').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'delphox').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'drampa').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'wyrdeer').learnset.magicmissile = ['9L1'];
    this.modData('Learnsets', 'ursalunabloodmoon').learnset.magicmissile = ['9L1'];

    // hardwareheat 
    this.modData('Learnsets', 'porygon').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'magnezone').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'genesect').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'magearna').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'magearnaoriginal').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.hardwareheat = ['9L1'];
    this.modData('Learnsets', 'scizorgalar').learnset.hardwareheat = ['9L1'];

    // swarming 
    this.modData('Learnsets', 'porygon').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'mewtwo').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'deoxys').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'baalzebutis').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'snoxin').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'magroach').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'scizorgalar').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'yanma').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'kricketune').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'annoyog').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'accelgor').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'parasect').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'vikavolt').learnset.swarming = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.swarming = ['9L1'];

    // underdog 
    this.modData('Learnsets', 'lillipup').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'herdier').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'stoutland').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'snubbull').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'granbull').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'eevee').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'vaporeon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'jolteon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'flareon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'espeon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'umbreon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'leafeon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'glaceon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'sylveon').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'furfrou').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'growlithe').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'growlithehisui').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'arcanine').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'arcaninehisui').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'yamper').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'boltund').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'watchog').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'furret').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'gumshoos').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'linoonegalar').learnset.underdog = ['9M'];
    this.modData('Learnsets', 'obstagoon').learnset.underdog = ['9M'];

    // natureswrath 
    this.modData('Learnsets', 'comfey').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'florges').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'rillaboom').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'serperior').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'abomasnow').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'exeggutor').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'exeggutoralola').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'gogoat').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'sawsbuck').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'shiftry').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'torterra').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'landorus').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'sautropius').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'wochien').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'venusaur').learnset.natureswrath = ['9M'];
    this.modData('Learnsets', 'trevenant').learnset.natureswrath = ['9M'];

    // flamingsphere 
    this.modData('Learnsets', 'magmar').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'moltres').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'entei').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'hooh').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'magmortar').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'reshiram').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'braixen').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'delphox').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'cinderace').learnset.flamingsphere = ['9M'];
    this.modData('Learnsets', 'scizorgalar').learnset.flamingsphere = ['9M'];

    // fireball 
    this.modData('Learnsets', 'charizard').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'hooh').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'reshiram').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'mismagius').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'delphox').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'ninetales').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'chandelure').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'magmortar').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'cinderace').learnset.fireball = ['9M'];
    this.modData('Learnsets', 'drinferno').learnset.fireball = ['9M'];

    // backfire 
    this.modData('Learnsets', 'reshiram').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'hooh').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'victini').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'blacephalon').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'chimchar').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'monferno').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'infernape').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'tepig').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'pignite').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'emboar').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'emboargalar').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'turtonator').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'litwick').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'lampent').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'chandelure').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'marowakalola').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'vulpix').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'ninetales').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'litleo').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'pyroar').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'fletchinder').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'talonflame').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'cyndaquil').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'quilava').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'typhlosion').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'wizamadol').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'solens').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'charmander').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'charmeleon').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'charizard').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'torchic').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'combusken').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'blaziken').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'ponyta').learnset.backfire = ['9M'];
    this.modData('Learnsets', 'rapidash').learnset.backfire = ['9M'];

    // highwater 
    this.modData('Learnsets', 'squirtle').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'wartortle').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'blastoise').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'tentacruel').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'poliwrath').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'dewgong').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'gyarados').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'vaporeon').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'chinchou').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'lanturn').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'politoed').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'swampert').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'seismitoad').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'jellicent').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'eelektross').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'stunfisk').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'skrelp').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'dragalge').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'volcanion').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'golisopod').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'araquanid').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'grapploct').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'overqwil').learnset.highwater = ['9M'];
    this.modData('Learnsets', 'medidragon').learnset.highwater = ['9M'];

    // seajaws 
    this.modData('Learnsets', 'dracovish').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'gyarados').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'barraskewda').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'sharpedo').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'bruxish').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'drednaw').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'feraligatr').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'basculin').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'basculegion').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'basculegionf').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'carracosta').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'arctovish').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'huntail').learnset.seajaws = ['9L1'];
    this.modData('Learnsets', 'relicanth').learnset.seajaws = ['9L1'];

    // roguewave 
    this.modData('Learnsets', 'basculegion').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'basculegionf').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'floatzel').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'basculin').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'sharpedo').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'azumarill').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'kingdra').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'quaquaval').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'dhelmise').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'armaldo').learnset.roguewave = ['9L1'];

    // parallelcircuit 
    this.modData('Learnsets', 'ironhands').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'ironthorns').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'electivire').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'luxray').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'morpeko').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'zeraora').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'pincurchin').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'zebstrika').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'pikachu').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'pawmi').learnset.parallelcircuit = ['9M'];
    this.modData('Learnsets', 'boltund').learnset.parallelcircuit = ['9M'];

    // musclecare 
    this.modData('Learnsets', 'poliwrath').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'machop').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'tyrogue').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'makuhita').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'meditite').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'riolu').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'sawk').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'throh').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'cobalion').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'terrakion').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'virizion').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'keldeo').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'hawlucha').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'passimian').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'buzzwole').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'cinderace').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'kubfu').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'quaquaval').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'okidogi').learnset.musclecare = ['9L1'];
    this.modData('Learnsets', 'mystao').learnset.musclecare = ['9L1'];

    // dissolution 
    this.modData('Learnsets', 'venusaur').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'arbok').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'vileplume').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'bellsprout').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'weepinbell').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'victreebel').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'tentacool').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'tentacruel').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'grimer').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'grimeralola').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'muk').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'mukalola').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'koffing').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'weezing').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'weezinggalar').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'shuckle').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'gulpin').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'swalot').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'cradily').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'lickilicky').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'seismitoad').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'garbodor').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'accelgor').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'skrelp').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'dragalge').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'sliggoo').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'goodra').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'salazzle').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'nihilego').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'appletun').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'annoyog').learnset.dissolution = ['9M'];
    this.modData('Learnsets', 'badapple').learnset.dissolution = ['9M'];


    // landslide 
    this.modData('Learnsets', 'hippopotas').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'hippowdon').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'mudsdale').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'palossand').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'sandaconda').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'larvitar').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'pupitar').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'tyranitar').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'torterra').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'machamp').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'graveler').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'golem').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'graveleralola').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'golemalola').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'piloswine').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'mamoswine').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'onix').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'steelix').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'rhyhorn').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'rhydon').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'rhyperior').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'coalossal').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'gigalith').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'lairon').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'aggron').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'stonjourner').learnset.landslide = ['9M'];
    this.modData('Learnsets', 'ironthorns').learnset.landslide = ['9M'];

    // epicenter 
    this.modData('Learnsets', 'golem').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'camerupt').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'torterra').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'claydol').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'donphan').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'rhydon').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'rhyperior').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'mudsdale').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'coalossal').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'gigalith').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'copperajah').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'metagross').learnset.epicenter = ['9L1'];
    this.modData('Learnsets', 'ironthorns').learnset.epicenter = ['9L1'];

    // downdraft 
    this.modData('Learnsets', 'rayquaza').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'lugia').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'hooh').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'corviknight').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'latias').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'latios').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'celesteela').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'dragonite').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'salamence').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'talonflame').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'altaria').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'archeops').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'braviary').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'noivern').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'noctowl').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'swellow').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'staraptor').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'articunogalar').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'shiftry').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'ironjugulis').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'cymadalea').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'medidragon').learnset.downdraft = ['9L1'];
    this.modData('Learnsets', 'admistral').learnset.downdraft = ['9L1'];

    // clearmind 
    this.modData('Learnsets', 'deoxys').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'keldeo').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'mew').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'mystao').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'slowpoke').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'slowpokegalar').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'ironleaves').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'orbeetle').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'uxie').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'delphox').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'gardevoir').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'necrozma').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'reuniclus').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'medicham').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'espeon').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'latias').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'latios').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'mewtwo').learnset.clearmind = ['9L1'];
    this.modData('Learnsets', 'wizamadol').learnset.clearmind = ['9L1'];

    // golemstrike 
    this.modData('Learnsets', 'nidoqueen').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'nidoking').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'primeape').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'machamp').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'geodude').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'geodudealola').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'graveler').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'graveleralola').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'golem').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'golemalola').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'grimeralola').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'mukalola').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'hitmonlee').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'hitmonchan').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'rhydon').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'rhyperior').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'aerodactyl').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'dragonite').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'mew').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'sudowoodo').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'smeargle').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'hitmontop').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'tyranitar').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'blaziken').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'aggron').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'armaldo').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'absol').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'regirock').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'groudon').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'infernape').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'lucario').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'toxicroak').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'gallade').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'dialga').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'palkia').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'regigigas').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'arceus').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'pignite').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'emboar').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'timburr').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'gurdurr').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'conkeldurr').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'throh').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'sawk').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'krokorok').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'krookodile').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'darmanitan').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'darmanitangalar').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'dwebble').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'crustle').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'scraggy').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'scrafty').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'tirtouga').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'carracosta').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'archen').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'archeops').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'golurk').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'bisharp').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'terrakion').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'chesnaught').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'diggersby').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'gogoat').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'binacle').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'barbaracle').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'avalugghisui').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'crabrawler').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'crabominable').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'rockruff').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'lycanroc').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'lycanrocdusk').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'lycanrocmidnight').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'solgaleo').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'buzzwole').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'celesteela').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'stakataka').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'runerigus').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'copperajah').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'urshifu').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'urshifurapidstrike').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'kleavor').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'ledian').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'ledixy').learnset.golemstrike = ['9M'];
    this.modData('Learnsets', 'mosquitox').learnset.golemstrike = ['9M'];

    // punishingblow 
    this.modData('Learnsets', 'froslass').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'blacephalon').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'decidueye').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'dhelmise').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'golurk').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'mimikyu').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'annihilape').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'slendawful').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'paranormear').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.punishingblow = ['9M'];
    this.modData('Learnsets', 'trevenant').learnset.punishingblow = ['9M'];
    this.modData('Learnsets', 'basculegion').learnset.punishingblow = ['9L1'];
    this.modData('Learnsets', 'basculegionf').learnset.punishingblow = ['9L1'];

    // condensate 
    this.modData('Learnsets', 'ninetalesalola').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'aurorus').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'lapras').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'arctovish').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'arctozolt').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'kyurem').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'abomasnow').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'glaceon').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'frosmoth').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'vanilluxe').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'froslass').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'cryogonal').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'glastrier').learnset.condensate = ['9L1'];
    this.modData('Learnsets', 'calyrexice').learnset.condensate = ['9L1'];

    // chillblain 
    this.modData('Learnsets', 'sandshrewalola').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'sandslashalola').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'vulpixalola').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'ninetalesalola').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'dewgong').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'cloyster').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'mrmimegalar').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'jynx').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'lapras').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'sneasel').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'swinub').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'piloswine').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'delibird').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'smoochum').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'mew').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'snorunt').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'glalie').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'spheal').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'sealeo').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'regice').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'snover').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'abomasnow').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'weavile').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'glaceon').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'mamoswine').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'froslass').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'rotom').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'castform').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'darumakagalar').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'darmanitangalar').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'vanillite').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'vanillish').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'vanilluxe').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'cubchoo').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'beartic').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'cryogonal').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'kyurem').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'amaura').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'aurorus').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'bergmite').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'avalugg').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'crabominable').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'mrrime').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'snom').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'frosmoth').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'arceus').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'eiscue').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'arctozolt').learnset.chillblain = ['9L1'];

    // indomitablespirit 
    this.modData('Learnsets', 'gastly').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'croagunk').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'snorunt').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'marowakalola').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'sandygast').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'hawlucha').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'jangmoo').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'riolu').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'buzzwole').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'heracross').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'pancham').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'scraggy').learnset.indomitablespirit = ['9M'];
    this.modData('Learnsets', 'poliwag').learnset.indomitablespirit = ['9M'];

    // monkeypunch 
    this.modData('Learnsets', 'primeape').learnset.monkeypunch = ['9L1'];
    this.modData('Learnsets', 'infernape').learnset.monkeypunch = ['9L1'];
    this.modData('Learnsets', 'oranguru').learnset.monkeypunch = ['9L1'];
    this.modData('Learnsets', 'zarude').learnset.monkeypunch = ['9L1'];
    this.modData('Learnsets', 'zarudedada').learnset.monkeypunch = ['9L1'];

    // cosmicpunch 
    this.modData('Learnsets', 'ledian').learnset.cosmicpunch = ['9L1'];
    this.modData('Learnsets', 'metang').learnset.cosmicpunch = ['9L1'];
    this.modData('Learnsets', 'deoxys').learnset.cosmicpunch = ['9L1'];
    this.modData('Learnsets', 'paranormear').learnset.cosmicpunch = ['9L1'];

    // contrariety 
    this.modData('Learnsets', 'larvitar').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'carvanha').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'pawniard').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'sandile').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'zorua').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'tyrunt').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'inkay').learnset.contrariety = ['9M'];
    this.modData('Learnsets', 'rowlet').learnset.contrariety = ['9M'];

    // blackflash 
    this.modData('Learnsets', 'baalzebutis').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'grimillia').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'chienpao').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'chiyu').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'wochien').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'tinglu').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'tyranitar').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'absol').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'gengar').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'hoopa').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'hydreigon').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'ironjugulis').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'moltresgalar').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'paranormear').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'sithbull').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'slendawful').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'zoroark').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'yveltal').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'chandelure').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'guzzlord').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'krookodile').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'inkay').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'malamar').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'necrozma').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'spiritomb').learnset.blackflash = ['9M'];
    this.modData('Learnsets', 'dusknoir').learnset.blackflash = ['9M'];

    // hypnotichorror 
    this.modData('Learnsets', 'gastly').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'haunter').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'gengar').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'zorua').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'zoroark').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'zoruahisui').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'zoroarkhisui').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'darkrai').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'inkay').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'malamar').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'hypno').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'mewtwo').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'mew').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'drifblim').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'hatenna').learnset.hypnotichorror = ['9M'];
    this.modData('Learnsets', 'hatterene').learnset.hypnotichorror = ['9M'];

    // sneakyassault 
    this.modData('Learnsets', 'rattataalola').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'raticatealola').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'meowth').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'persian').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'meowthalola').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'persianalola').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'meowthgalar').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'perrserker').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'gligar').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'sneasel').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'ninjask').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zangoose').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'absol').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'luxray').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'drapion').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'weavile').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'gliscor').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'purrloin').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'liepard').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zorua').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zoroark').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'greninja').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'greninjabond').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'kartana').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zeraora').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zarude').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'zarudedada').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'lokix').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'maushold').learnset.sneakyassault = ['9L1'];
    this.modData('Learnsets', 'slendawful').learnset.sneakyassault = ['9L1'];

    // mercuryshot 
    this.modData('Learnsets', 'squirtle').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'wartortle').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'blastoise').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'piplup').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'prinplup').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'empoleon').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'magnemite').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'magneton').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'magnezone').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'heatran').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'dialga').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'celesteela').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'duraludon').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'kyogre').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'phione').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'manaphy').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'alomomola').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'xurkitree').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'aron').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'lairon').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'aggron').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'clauncher').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'clawitzer').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'meltan').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'melmetal').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'corsolagalar').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'cursola').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'entei').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'clamperl').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'huntail').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'gorebyss').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'frillish').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'jellicent').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'lapras').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'chinchou').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'lanturn').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'tentacool').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'tentacruel').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'wailmer').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'wailord').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'spheal').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'sealeo').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'walrein').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'remoraid').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'octillery').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'registeel').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'koffing').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'weezing').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'weezinggalar').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'volcanion').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'mantyke').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'mantine').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'sliggoohisui').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'goodrahisui').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'genesect').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'magearna').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'magearnaoriginal').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'stonlet').learnset.mercuryshot = ['9M'];
    this.modData('Learnsets', 'rockster').learnset.mercuryshot = ['9M'];

    // sweetheart 
    this.modData('Learnsets', 'wigglytuff').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'chansey').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'bellossom').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'blissey').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'luvdisc').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'audino').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'sylveon').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'florges').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'primarina').learnset.sweetheart = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.sweetheart = ['9L1'];

    // chakraterrain 
    this.modData('Learnsets', 'hitmonchan').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'hitmonlee').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'mew').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'tyrogue').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'hitmontop').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'ralts').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'kirlia').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'gardevoir').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'gallade').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'meditite').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'medicham').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'infernape').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'riolu').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'lucario').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'throh').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'sawk').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'mienfoo').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'mienshao').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'cobalion').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'terrakion').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'virizion').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'keldeo').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'kubfu').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'urshifurapidstrike').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'urshifu').learnset.chakraterrain = ['9L1'];
    this.modData('Learnsets', 'mystao').learnset.chakraterrain = ['9L1'];

    // New movepool changes :

    // Gen 1: 
    this.modData('Learnsets', 'venusaur').learnset.shadowclaw = ['9L1'];
    this.modData('Learnsets', 'venusaur').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'venusaur').learnset.punishingblow = ['9L1'];
    delete this.modData('Learnsets', 'squirtle').learnset.shellsmash;
    delete this.modData('Learnsets', 'wartortle').learnset.shellsmash;
    delete this.modData('Learnsets', 'blastoise').learnset.shellsmash;
    this.modData('Learnsets', 'squirtle').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'wartortle').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'blastoise').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'blastoise').learnset.ironhead = ['9L1'];
    this.modData('Learnsets', 'blastoise').learnset.meteormash = ['9L1'];
    this.modData('Learnsets', 'butterfree').learnset.befuddlepowder = ['9L1'];
    this.modData('Learnsets', 'beedrill').learnset.piercingdart = ['9L1'];
    this.modData('Learnsets', 'pidgeot').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'spearow').learnset.bravebird = ['9L1'];
    this.modData('Learnsets', 'arbok').learnset.meanlook = ['9L1'];
    this.modData('Learnsets', 'arbok').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'pikachurockstar').learnset.bulletpunch = ['9L1'];
    this.modData('Learnsets', 'pikachurockstar').learnset.rapidspin = ['9L1'];
    this.modData('Learnsets', 'pikachubelle').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'pikachubelle').learnset.freezedry = ['9L1'];
    this.modData('Learnsets', 'pikachupopstar').learnset.charm = ['9L1'];
    this.modData('Learnsets', 'pikachupopstar').learnset.dazzlinggleam = ['9L1'];
    this.modData('Learnsets', 'pikachuphd').learnset.psychic = ['9L1'];
    this.modData('Learnsets', 'pikachuphd').learnset.psyshock = ['9L1'];
    this.modData('Learnsets', 'pikachulibre').learnset.machpunch = ['9L1'];
    this.modData('Learnsets', 'pikachulibre').learnset.seismictoss = ['9L1'];
    this.modData('Learnsets', 'sandslash').learnset.spikyshield = ['9L1'];
    this.modData('Learnsets', 'sandslashalola').learnset.spikyshield = ['9L1'];
    this.modData('Learnsets', 'nidoqueen').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'nidoqueen').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'nidoking').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'nidoking').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'clefable').learnset.airslash = ['9L1']; // ZA addition
    this.modData('Learnsets', 'clefable').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'ninetales').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'ninetales').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'ninetalesalola').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'ninetalesalola').learnset.psychic = ['9L1'];
    this.modData('Learnsets', 'wigglytuff').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'parasect').learnset.infestation = ['9L1'];
    this.modData('Learnsets', 'venomoth').learnset.airslash = ['9L1'];
    this.modData('Learnsets', 'venomoth').learnset.shadowball = ['9L1'];
    this.modData('Learnsets', 'dugtrio').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'dugtrioalola').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'persian').learnset.crushclaw = ['9L1'];
    this.modData('Learnsets', 'persian').learnset.grassknot = ['9L1'];
    this.modData('Learnsets', 'persian').learnset.drainingkiss = ['9L1'];
    this.modData('Learnsets', 'persianalola').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'persianalola').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'persianalola').learnset.sludgewave = ['9L1'];
    this.modData('Learnsets', 'persianalola').learnset.drainingkiss = ['9L1'];
    this.modData('Learnsets', 'golduck').learnset.darkpulse = ['9L1'];
    this.modData('Learnsets', 'golduck').learnset.expandingforce = ['9L1'];
    this.modData('Learnsets', 'golduck').learnset.shadowball = ['9L1'];
    this.modData('Learnsets', 'golduck').learnset.thunderbolt = ['9L1'];
    this.modData('Learnsets', 'arcanine').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'arcaninehisui').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'poliwrath').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'poliwrath').learnset.lifedew = ['9L1'];
    this.modData('Learnsets', 'machamp').learnset.machpunch = ['9L1'];
    this.modData('Learnsets', 'machamp').learnset.drainpunch = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.solarblade = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.snaptrap = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.junglehealing = ['9L1'];
    this.modData('Learnsets', 'victreebel').learnset.corrosiveacid = ['9L1'];
    this.modData('Learnsets', 'golem').learnset.rapidspin = ['9L1'];
    this.modData('Learnsets', 'golem').learnset.rockwrecker = ['9L1'];
    this.modData('Learnsets', 'golem').learnset.clusterexplosion = ['9L1'];
    this.modData('Learnsets', 'golemalola').learnset.rapidspin = ['9L1'];
    this.modData('Learnsets', 'golemalola').learnset.rockwrecker = ['9L1'];
    this.modData('Learnsets', 'golemalola').learnset.clusterexplosion = ['9L1'];
    this.modData('Learnsets', 'rapidash').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'rapidashgalar').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'slowbrogalar').learnset.corrosiveacid = ['9L1'];
    this.modData('Learnsets', 'dodrio').learnset.megakick = ['9L1'];
    this.modData('Learnsets', 'dodrio').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'dodrio').learnset.tripleaxel = ['9L1'];
    this.modData('Learnsets', 'dodrio').learnset.triplekick = ['9L1'];
    this.modData('Learnsets', 'dewgong').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'dewgong').learnset.freezedry = ['9L1'];
    this.modData('Learnsets', 'dewgong').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'muk').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'mukalola').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'mukalola').learnset.toxicspikes = ['9L1'];
    this.modData('Learnsets', 'gengar').learnset.jumpscare = ['9L1'];
    this.modData('Learnsets', 'electrode').learnset.wildcharge = ['9L1'];
    this.modData('Learnsets', 'exeggutor').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'exeggutor').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'marowak').learnset.rockpolish = ['9L1'];
    this.modData('Learnsets', 'marowakalola').learnset.jumpscare = ['9L1'];
    this.modData('Learnsets', 'hitmonlee').learnset.tropkick = ['9L1'];
    this.modData('Learnsets', 'hitmonlee').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'hitmonlee').learnset.tripleaxel = ['9L1'];
    this.modData('Learnsets', 'hitmonlee').learnset.acrobatics = ['9L1'];
    this.modData('Learnsets', 'taurospaldeacombat').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'taurospaldeaaqua').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'taurospaldeablaze').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'weezinggalar').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'seaking').learnset.dragondance = ['9L1'];
    this.modData('Learnsets', 'starmie').learnset.bulkup = ['9L1']; // ZA addition
    this.modData('Learnsets', 'starmie').learnset.zenheadbutt = ['9L1']; // ZA addition
    this.modData('Learnsets', 'starmie').learnset.aquajet = ['9L1']; // ZA addition
    this.modData('Learnsets', 'starmie').learnset.liquidation = ['9L1']; // ZA addition
    this.modData('Learnsets', 'pinsir').learnset.megahorn = ['9L1'];
    this.modData('Learnsets', 'eevee').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'eevee').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'vaporeon').learnset.bouncybubble = ['9L1'];
    this.modData('Learnsets', 'jolteon').learnset.buzzybuzz = ['9L1'];
    this.modData('Learnsets', 'jolteon').learnset.grassknot = ['9L1'];
    this.modData('Learnsets', 'flareon').learnset.sizzlyslide = ['9L1'];
    this.modData('Learnsets', 'flareon').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'flareon').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'kabutops').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'kabutops').learnset.firstimpression = ['9L1'];
    this.modData('Learnsets', 'kabutops').learnset.aquacutter = ['9L1'];
    this.modData('Learnsets', 'snorlax').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.aeroblast = ['9L1'];
    this.modData('Learnsets', 'articuno').learnset.froststorm = ['9L1'];
    this.modData('Learnsets', 'articunogalar').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'articunogalar').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'articunogalar').learnset.dazzlinggleam = ['9L1'];
    this.modData('Learnsets', 'zapdos').learnset.thunderstorm = ['9L1'];
    this.modData('Learnsets', 'moltres').learnset.heatstorm = ['9L1'];
    this.modData('Learnsets', 'mew').learnset.genesiswave = ['9L1'];

    // Gen 2:
    this.modData('Learnsets', 'meganium').learnset.dazzlinggleam = ['9L1']; // ZA addition
    this.modData('Learnsets', 'meganium').learnset.alluringvoice = ['9L1']; // ZA addition
    this.modData('Learnsets', 'meganium').learnset.disarmingvoice = ['9L1']; // ZA addition
    this.modData('Learnsets', 'meganium').learnset.earthpower = ['9L1']; // ZA addition
    this.modData('Learnsets', 'meganium').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'meganium').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'typhlosion').learnset.gravity = ['9L1'];
    this.modData('Learnsets', 'typhlosion').learnset.morningsun = ['9L1'];
    this.modData('Learnsets', 'typhlosion').learnset.earthpower = ['9L1'];
    this.modData('Learnsets', 'typhlosionhisui').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'furret').learnset.taunt = ['9M'];
    this.modData('Learnsets', 'noctowl').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'noctowl').learnset.magisterialwind = ['9L1'];
    this.modData('Learnsets', 'noctowl').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'lanturn').learnset.tailglow = ['9L1'];
    this.modData('Learnsets', 'bellossom').learnset.weatherball = ['9L1'];
    this.modData('Learnsets', 'ampharos').learnset.wish = ['9L1'];
    this.modData('Learnsets', 'ampharos').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'azumarill').learnset.bulkup = ['9L1'];
    this.modData('Learnsets', 'azumarill').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'sudowoodo').learnset.teramorphosis = ['9L1'];
    this.modData('Learnsets', 'politoed').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'politoed').learnset.lifedew = ['9L1'];
    this.modData('Learnsets', 'sunflora').learnset.weatherball = ['9L1'];
    this.modData('Learnsets', 'sunflora').learnset.flamethrower = ['9L1'];
    this.modData('Learnsets', 'sunflora').learnset.fireblast = ['9L1'];
    this.modData('Learnsets', 'espeon').learnset.glitzyglow = ['9L1'];
    this.modData('Learnsets', 'espeon').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'umbreon').learnset.baddybad = ['9L1'];
    this.modData('Learnsets', 'umbreon').learnset.nightdaze = ['9L1'];
    this.modData('Learnsets', 'murkrow').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'slowkinggalar').learnset.corrosiveacid = ['9L1'];
    this.modData('Learnsets', 'octillery').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'octillery').learnset.terrainpulse = ['9L1'];
    this.modData('Learnsets', 'mantine').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'raikou').learnset.thunderway = ['9L1'];
    this.modData('Learnsets', 'raikou').learnset.thunderclap = ['9L1'];
    this.modData('Learnsets', 'entei').learnset.fieryfire = ['9L1'];
    this.modData('Learnsets', 'entei').learnset.burningbulwark = ['9L1'];
    this.modData('Learnsets', 'entei').learnset.earthquake = ['9L1'];
    this.modData('Learnsets', 'suicune').learnset.auroraborealis = ['9L1'];
    this.modData('Learnsets', 'suicune').learnset.hydrosteam = ['9L1'];
    this.modData('Learnsets', 'suicune').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'suicune').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'celebi').learnset.revivalblessing = ['9L1'];
    this.modData('Learnsets', 'celebi').learnset.timeparadox = ['9L1'];

    // Gen 3:
    this.modData('Learnsets', 'zigzagoongalar').learnset.extremespeed = ['9L1'];
    this.modData('Learnsets', 'linoonegalar').learnset.extremespeed = ['9L1'];
    this.modData('Learnsets', 'beautifly').learnset.smartstrike = ['9L1'];
    this.modData('Learnsets', 'beautifly').learnset.suckerpunch = ['9L1'];
    this.modData('Learnsets', 'beautifly').learnset.dualwingbeat = ['9L1'];
    this.modData('Learnsets', 'beautifly').learnset.leechlife = ['9L1'];
    this.modData('Learnsets', 'beautifly').learnset.agility = ['9L1'];
    this.modData('Learnsets', 'dustox').learnset.pollenpuff = ['9L1'];
    this.modData('Learnsets', 'dustox').learnset.ragepowder = ['9L1'];
    this.modData('Learnsets', 'ludicolo').learnset.happydance = ['9L1'];
    this.modData('Learnsets', 'shiftry').learnset.windscall = ['9L1'];
    this.modData('Learnsets', 'shiftry').learnset.tripleaxel = ['9L1'];
    this.modData('Learnsets', 'shiftry').learnset.frostbreath = ['9L1'];
    this.modData('Learnsets', 'swellow').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'ralts').learnset.icebeam = ['9L1'];
    this.modData('Learnsets', 'kirlia').learnset.icebeam = ['9L1'];
    this.modData('Learnsets', 'gardevoir').learnset.icebeam = ['9L1'];
    this.modData('Learnsets', 'gardevoir').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'gardevoir').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'masquerain').learnset.glare = ['9L1'];
    this.modData('Learnsets', 'masquerain').learnset.meanlook = ['9L1'];
    this.modData('Learnsets', 'masquerain').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'masquerain').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'breloom').learnset.armthrust = ['9L1'];
    this.modData('Learnsets', 'ninjask').learnset.lightningassault = ['9L1'];
    this.modData('Learnsets', 'whismur').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'exploud').learnset.bigbang = ['9L1'];
    this.modData('Learnsets', 'hariyama').learnset.machpunch = ['9L1'];
    this.modData('Learnsets', 'hariyama').learnset.courtchange = ['9L1'];
    this.modData('Learnsets', 'delcatty').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'manectric').learnset.aurorabeam = ['9L1'];
    this.modData('Learnsets', 'plusle').learnset.icywind = ['9L1'];
    this.modData('Learnsets', 'plusle').learnset.icepunch = ['9L1'];
    this.modData('Learnsets', 'plusle').learnset.doubleshock = ['9L1'];
    this.modData('Learnsets', 'plusle').learnset.energyball = ['9L1'];
    this.modData('Learnsets', 'plusle').learnset.fakeout = ['9L1'];
    this.modData('Learnsets', 'minun').learnset.reflect = ['9L1'];
    this.modData('Learnsets', 'minun').learnset.fakeout = ['9L1'];
    this.modData('Learnsets', 'minun').learnset.doubleshock = ['9L1'];
    this.modData('Learnsets', 'minun').learnset.followme = ['9L1'];
    this.modData('Learnsets', 'minun').learnset.afteryou = ['9L1'];
    this.modData('Learnsets', 'wailord').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'wailord').learnset.superpower = ['9L1'];
    this.modData('Learnsets', 'wailord').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'camerupt').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'grumpig').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'cacturne').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'cacturne').learnset.earthquake = ['9L1'];
    this.modData('Learnsets', 'cacturne').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'altaria').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'claydol').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'lunatone').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'solrock').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'whiscash').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'solrock').learnset.earthquake = ['9L1'];
    this.modData('Learnsets', 'solrock').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.powergem = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.surf = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.hydropump = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.scald = ['9L1'];
    this.modData('Learnsets', 'cradily').learnset.waterpulse = ['9L1'];
    this.modData('Learnsets', 'armaldo').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'armaldo').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'armaldo').learnset.drillrun = ['9L1'];
    this.modData('Learnsets', 'milotic').learnset.moonblast = ['9M'];
    this.modData('Learnsets', 'milotic').learnset.dazzlinggleam = ['9M'];
    this.modData('Learnsets', 'castform').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'castform').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'castform').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'castform').learnset.triattack = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.mefirst = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.copycat = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.focuspunch = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.encore = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'banette').learnset.jumpscare = ['9L1'];
    this.modData('Learnsets', 'chimecho').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'chimecho').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'chimecho').learnset.detectmagic = ['9L1'];
    this.modData('Learnsets', 'chimecho').learnset.boomburst = ['9L1']; // ZA addition
    this.modData('Learnsets', 'absol').learnset.nightdaze = ['9L1'];
    this.modData('Learnsets', 'glalie').learnset.rapidspin = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.iciclecrash = ['9L1'];
    this.modData('Learnsets', 'walrein').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'relicanth').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'metagross').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'metagross').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'metagross').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'regirock').learnset.boulderbuilding = ['9L1'];
    this.modData('Learnsets', 'regirock').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'regice').learnset.icebergpolish = ['9L1'];
    this.modData('Learnsets', 'regice').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'registeel').learnset.alienmetal = ['9L1'];
    this.modData('Learnsets', 'registeel').learnset.recover = ['9L1'];

    // Gen 4:
    this.modData('Learnsets', 'torterra').learnset.weatherball = ['9L1'];
    this.modData('Learnsets', 'staraptor').learnset.intrepidcrash = ['9L1'];
    this.modData('Learnsets', 'bibarel').learnset.earthquake = ['9L1'];
    this.modData('Learnsets', 'bibarel').learnset.icefang = ['9L1'];
    this.modData('Learnsets', 'bibarel').learnset.trailblaze = ['9L1'];
    this.modData('Learnsets', 'luxray').learnset.suckerpunch = ['9L1'];
    this.modData('Learnsets', 'luxray').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'roserade').learnset.quiverdance = ['9L1'];
    this.modData('Learnsets', 'roserade').learnset.poisonivy = ['9L1'];
    this.modData('Learnsets', 'roserade').learnset.mudshot = ['9L1'];
    this.modData('Learnsets', 'rampardos').learnset.wildcharge = ['9L1'];
    this.modData('Learnsets', 'rampardos').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'rampardos').learnset.submission = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.aromatherapy = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.leaftornado = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.leafage = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.magicalleaf = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.leechseed = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.aircutter = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.airslash = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.defog = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'wormadam').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'wormadamsandy').learnset.rockthrow = ['9L1'];
    this.modData('Learnsets', 'wormadamsandy').learnset.rockslide = ['9L1'];
    this.modData('Learnsets', 'wormadamsandy').learnset.powergem = ['9L1'];
    this.modData('Learnsets', 'wormadamsandy').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'wormadamsandy').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.sludge = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.sludgebomb = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.sludgewave = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'wormadamtrash').learnset.thunderwave = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.leechlife = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.zenheadbutt = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.extrasensory = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.throatchop = ['9L1'];
    this.modData('Learnsets', 'mothim').learnset.suckerpunch = ['9L1'];
    this.modData('Learnsets', 'floatzel').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'floatzel').learnset.tripleaxel = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.heatwave = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.flamecharge = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.ember = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.firespin = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.blazekick = ['9L1'];
    this.modData('Learnsets', 'cherrim').learnset.flareblitz = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.agility = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.heatwave = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.hindenburg = ['9L1'];
    this.modData('Learnsets', 'drifblim').learnset.razorwind = ['9L1'];
    this.modData('Learnsets', 'mismagius').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'honchkrow').learnset.dualwingbeat = ['9L1'];
    this.modData('Learnsets', 'honchkrow').learnset.throatchop = ['9L1'];
    this.modData('Learnsets', 'honchkrow').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'skuntank').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'skuntank').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'skuntank').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'skuntank').learnset.corrosiveacid = ['9L1'];
    this.modData('Learnsets', 'bronzong').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'bronzong').learnset.healbell = ['9L1'];
    this.modData('Learnsets', 'bronzong').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'spiritomb').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'chatot').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'lucario').learnset.synchronoise = ['9L1'];
    this.modData('Learnsets', 'lucario').learnset.machpunch = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.hydropump = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.liquidation = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.waterfall = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'croagunk').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'lumineon').learnset.airslash = ['9L1'];
    this.modData('Learnsets', 'lumineon').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'snover').learnset.iciclecrash = ['9L1'];
    this.modData('Learnsets', 'abomasnow').learnset.iciclecrash = ['9L1'];
    this.modData('Learnsets', 'abomasnow').learnset.mountaingale = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.sludgebomb = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.poisonjab = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.poisontail = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.sludge = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.acidarmor = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'lickilicky').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'tangrowth').learnset.stealthrock = ['9L1'];
    this.modData('Learnsets', 'electivire').learnset.doubleshock = ['9L1'];
    this.modData('Learnsets', 'magmortar').learnset.scald = ['9L1'];
    this.modData('Learnsets', 'magmortar').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'togekiss').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'togekiss').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'togekiss').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.agility = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.dragondance = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.outrage = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.dragonrush = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.scaleshot = ['9L1'];
    this.modData('Learnsets', 'yanmega').learnset.dragonpulse = ['9L1'];
    this.modData('Learnsets', 'leafeon').learnset.sappyseed = ['9L1'];
    this.modData('Learnsets', 'leafeon').learnset.sacredsword = ['9L1'];
    this.modData('Learnsets', 'glaceon').learnset.freezyfrost = ['9L1'];
    this.modData('Learnsets', 'porygonz').learnset.conversionz = ['9L1'];
    this.modData('Learnsets', 'mamoswine').learnset.headlongrush = ['9L1'];
    this.modData('Learnsets', 'mamoswine').learnset.mountaingale = ['9L1'];
    this.modData('Learnsets', 'probopass').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'dusknoir').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'dusknoir').learnset.drainpunch = ['9L1'];
    this.modData('Learnsets', 'froslass').learnset.nastyplot = ['9L1']; // ZA addition
    this.modData('Learnsets', 'rotom').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'rotomheat').learnset.heatwave = ['9L1'];
    this.modData('Learnsets', 'rotomwash').learnset.whirlpool = ['9L1'];
    this.modData('Learnsets', 'rotomfrost').learnset.freezedry = ['9L1'];
    this.modData('Learnsets', 'rotomfan').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'rotommow').learnset.leechseed = ['9L1'];
    this.modData('Learnsets', 'uxie').learnset.bodypress = ['9L1'];
    this.modData('Learnsets', 'uxie').learnset.awakening = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.bodypress = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.afteryou = ['9L1'];
    this.modData('Learnsets', 'mesprit').learnset.fulldevotion = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.sacredsword = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.focuspunch = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.superpower = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.bulkup = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.submission = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'azelf').learnset.braveblade = ['9L1'];
    this.modData('Learnsets', 'palkia').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'palkia').learnset.cosmicpower = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.headsmash = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.wildcharge = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.icehammer = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.dragonhammer = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.meteormash = ['9L1'];
    this.modData('Learnsets', 'regigigas').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'giratina').learnset.jumpscare = ['9L1'];
    this.modData('Learnsets', 'shaymin').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'shaymin').learnset.aerialace = ['9L1'];
    this.modData('Learnsets', 'shaymin').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'shaymin').learnset.playrough = ['9L1'];

    // Gen 5:
    this.modData('Learnsets', 'serperior').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'emboar').learnset.ragingfury = ['9L1'];
    this.modData('Learnsets', 'emboar').learnset.supercellslam = ['9L1'];
    this.modData('Learnsets', 'emboar').learnset.submission = ['9L1'];
    this.modData('Learnsets', 'watchog').learnset.megakick = ['9L1'];
    this.modData('Learnsets', 'watchog').learnset.glare = ['9L1'];
    this.modData('Learnsets', 'watchog').learnset.hypervoice = ['9L1'];
    this.modData('Learnsets', 'stoutland').learnset.doubleedge = ['9L1'];
    this.modData('Learnsets', 'stoutland').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'stoutland').learnset.highhorsepower = ['9L1'];
    this.modData('Learnsets', 'stoutland').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'stoutland').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.powerwhip = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.monkeybusiness = ['9L1'];
    this.modData('Learnsets', 'simisage').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.monkeybusiness = ['9L1'];
    this.modData('Learnsets', 'simisear').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.monkeybusiness = ['9L1'];
    this.modData('Learnsets', 'simipour').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'musharna').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.nastyplot = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.hypervoice = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'unfezant').learnset.doubleedge = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.nastyplot = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.hypervoice = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'unfezantf').learnset.doubleedge = ['9L1'];
    this.modData('Learnsets', 'zebstrika').learnset.flareblitz = ['9L1'];
    this.modData('Learnsets', 'zebstrika').learnset.jumpkick = ['9L1'];
    this.modData('Learnsets', 'zebstrika').learnset.highhorsepower = ['9L1'];
    this.modData('Learnsets', 'gigalith').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'gigalith').learnset.thunderbolt = ['9L1'];
    this.modData('Learnsets', 'gigalith').learnset.shoreup = ['9L1'];
    this.modData('Learnsets', 'seismitoad').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'throh').learnset.bodypress = ['9L1'];
    this.modData('Learnsets', 'leavanny').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'krookodile').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.ragingfury = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.psyshock = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.trickroom = ['9L1'];
    this.modData('Learnsets', 'darmanitan').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'maractus').learnset.earthquake = ['9L1'];
    this.modData('Learnsets', 'maractus').learnset.earthpower = ['9L1'];
    this.modData('Learnsets', 'maractus').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'maractus').learnset.sandtomb = ['9L1'];
    this.modData('Learnsets', 'maractus').learnset.sandattack = ['9L1'];
    this.modData('Learnsets', 'crustle').learnset.crabhammer = ['9L1'];
    this.modData('Learnsets', 'crustle').learnset.brickbreak = ['9L1'];
    this.modData('Learnsets', 'crustle').learnset.painsplit = ['9L1'];
    this.modData('Learnsets', 'scrafty').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'sigilyph').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'sigilyph').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'sigilyph').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'cofagrigus').learnset.metalburst = ['9L1'];
    this.modData('Learnsets', 'cofagrigus').learnset.gyroball = ['9L1'];
    this.modData('Learnsets', 'cofagrigus').learnset.ironhead = ['9L1'];
    this.modData('Learnsets', 'cofagrigus').learnset.heavyslam = ['9L1'];
    this.modData('Learnsets', 'cofagrigus').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'lilligant').learnset.weatherball = ['9L1'];
    this.modData('Learnsets', 'lilligant').learnset.earthpower = ['9L1'];
    this.modData('Learnsets', 'lilligant').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'basculin').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'carracosta').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'trubbish').learnset.poisonjab = ['9L1'];
    this.modData('Learnsets', 'garbodor').learnset.poisonjab = ['9L1'];
    this.modData('Learnsets', 'zoroark').learnset.gunkshot = ['9L1'];
    this.modData('Learnsets', 'zoroark').learnset.focuspunch = ['9L1'];
    this.modData('Learnsets', 'zoroark').learnset.superpower = ['9L1'];
    this.modData('Learnsets', 'zoroarkhisui').learnset.chillblain = ['9L1'];
    this.modData('Learnsets', 'zoroarkhisui').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'gothitelle').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'gothitelle').learnset.futuredoom = ['9L1'];
    this.modData('Learnsets', 'reuniclus').learnset.brainblast = ['9L1'];
    this.modData('Learnsets', 'swanna').learnset.quiverdance = ['9L1'];
    this.modData('Learnsets', 'vanilluxe').learnset.hydropump = ['9L1'];
    this.modData('Learnsets', 'vanilluxe').learnset.surf = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.highhorsepower = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.flareblitz = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.flamecharge = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.iciclecrash = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.tripleaxel = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.poltergeist = ['9L1'];
    this.modData('Learnsets', 'sawsbuck').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'escavalier').learnset.firstimpression = ['9L1'];
    this.modData('Learnsets', 'escavalier').learnset.horndrill = ['9L1'];
    this.modData('Learnsets', 'escavalier').learnset.headlongrush = ['9L1'];
    this.modData('Learnsets', 'galvantula').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'ferrothorn').learnset.spikyshield = ['9L1'];
    this.modData('Learnsets', 'klinklang').learnset.rockslide = ['9L1'];
    this.modData('Learnsets', 'beheeyem').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'beartic').learnset.mountaingale = ['9L1'];
    this.modData('Learnsets', 'accelgor').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'stunfiskgalar').learnset.leechlife = ['9L1'];
    this.modData('Learnsets', 'stunfiskgalar').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'stunfiskgalar').learnset.secretpower = ['9L1'];
    this.modData('Learnsets', 'stunfiskgalar').learnset.ironhead = ['9L1'];
    this.modData('Learnsets', 'mienshao').learnset.courtchange = ['9L1'];
    this.modData('Learnsets', 'druddigon').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'bouffalant').learnset.headsmash = ['9L1'];
    this.modData('Learnsets', 'bouffalant').learnset.milkdrink = ['9L1'];
    this.modData('Learnsets', 'bouffalant').learnset.headlongrush = ['9L1'];
    this.modData('Learnsets', 'heatmor').learnset.powerwhip = ['9L1'];
    this.modData('Learnsets', 'hydreigon').learnset.nightdaze = ['9L1'];
    this.modData('Learnsets', 'cobalion').learnset.bodypress = ['9L1'];
    this.modData('Learnsets', 'cobalion').learnset.athosrapier = ['9L1'];
    this.modData('Learnsets', 'virizion').learnset.aramisdagger = ['9L1'];
    this.modData('Learnsets', 'terrakion').learnset.porthosbroadsword = ['9L1'];

    // Gen 6:
    this.modData('Learnsets', 'greninja').learnset.psyshock = ['9L1']; // ZA addition
    this.modData('Learnsets', 'greninja').learnset.flipturn = ['9L1']; // ZA addition
    this.modData('Learnsets', 'greninja').learnset.nastyplot = ['9L1']; // ZA addition
    this.modData('Learnsets', 'greninjabond').learnset.psyshock = ['9L1']; // ZA addition
    this.modData('Learnsets', 'greninjabond').learnset.flipturn = ['9L1']; // ZA addition
    this.modData('Learnsets', 'greninjabond').learnset.nastyplot = ['9L1']; // ZA addition
    this.modData('Learnsets', 'pyroar').learnset.earthpower = ['9L1']; // ZA addition
    this.modData('Learnsets', 'pyroar').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'floetteeternal').learnset.revivalblessing = ['9L1'];
    this.modData('Learnsets', 'floetteeternal').learnset.psychicnoise = ['9L1'];
    this.modData('Learnsets', 'gogoat').learnset.stealthrock = ['9L1'];
    this.modData('Learnsets', 'gogoat').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'gogoat').learnset.stoneedge = ['9L1'];
    this.modData('Learnsets', 'furfrou').learnset.bodyslam = ['9L1'];
    this.modData('Learnsets', 'furfrou').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'furfrou').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'meowstic').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'meowstic').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'meowsticf').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'meowsticf').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'malamar').learnset.bulkup = ['9L1']; // ZA addition
    this.modData('Learnsets', 'malamar').learnset.stealthrock = ['9L1']; // ZA addition
    this.modData('Learnsets', 'malamar').learnset.closecombat = ['9L1']; // ZA addition
    this.modData('Learnsets', 'malamar').learnset.zenheadbutt = ['9L1']; // ZA addition
    this.modData('Learnsets', 'malamar').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'barbaracle').learnset.closecombat = ['9L1']; // ZA addition
    this.modData('Learnsets', 'dragalge').learnset.corrosiveacid = ['9L1'];
    this.modData('Learnsets', 'heliolisk').learnset.earthpower = ['9L1'];
    this.modData('Learnsets', 'heliolisk').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'aurorus').learnset.powergem = ['9L1'];
    this.modData('Learnsets', 'aurorus').learnset.voltswitch = ['9L1'];
    this.modData('Learnsets', 'sylveon').learnset.sparklyswirl = ['9L1'];
    this.modData('Learnsets', 'goomy').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'sliggoo').learnset.purify = ['9L1'];
    this.modData('Learnsets', 'sliggoo').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'sliggoohisui').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'goodra').learnset.purify = ['9L1'];
    this.modData('Learnsets', 'goodra').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'goodrahisui').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'goodrahisui').learnset.steelroller = ['9L1'];
    this.modData('Learnsets', 'trevenant').learnset.highhorsepower = ['9L1'];
    this.modData('Learnsets', 'trevenant').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'gourgeist').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'gourgeist').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'bergmite').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'avalugg').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'avalugg').learnset.fissure = ['9L1'];
    this.modData('Learnsets', 'avalugg').learnset.waterfall = ['9L1'];
    this.modData('Learnsets', 'avalugghisui').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'avalugghisui').learnset.fissure = ['9L1'];
    this.modData('Learnsets', 'noivern').learnset.snarl = ['9L1'];
    this.modData('Learnsets', 'noivern').learnset.wyvernflight = ['9L1'];

    // Gen 7:
    this.modData('Learnsets', 'decidueyehisui').learnset.spikes = ['9L1'];
    this.modData('Learnsets', 'decidueyehisui').learnset.rainofarrows = ['9L1'];
    this.modData('Learnsets', 'incineroar').learnset.rapidspin = ['9L1'];
    this.modData('Learnsets', 'incineroar').learnset.suckerpunch = ['9L1'];
    this.modData('Learnsets', 'incineroar').learnset.victorydance = ['9L1'];
    this.modData('Learnsets', 'popplio').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'brionne').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'primarina').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'gumshoos').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'gumshoos').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'vikavolt').learnset.electroshot = ['9L1'];
    this.modData('Learnsets', 'vikavolt').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'crabominable').learnset.mountaingale = ['9L1'];
    this.modData('Learnsets', 'crabominable').learnset.iceshard = ['9L1'];
    this.modData('Learnsets', 'crabominable').learnset.hammerarm = ['9L1'];
    this.modData('Learnsets', 'oricorio').learnset.healingwish = ['9L1'];
    this.modData('Learnsets', 'oricorio').learnset.destinybond = ['9L1'];
    this.modData('Learnsets', 'lycanroc').learnset.bonerush = ['9L1'];
    this.modData('Learnsets', 'lycanrocmidnight').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'lycanrocmidnight').learnset.moonlight = ['9L1'];
    this.modData('Learnsets', 'wishiwashi').learnset.blizzard = ['9L1'];
    this.modData('Learnsets', 'wishiwashi').learnset.aquajet = ['9L1'];
    this.modData('Learnsets', 'wishiwashi').learnset.thunder = ['9L1'];
    this.modData('Learnsets', 'wishiwashi').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'mudsdale').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'lurantis').learnset.mantisslash = ['9L1'];
    this.modData('Learnsets', 'bewear').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'bewear').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'comfey').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'comfey').learnset.mysticalfire = ['9L1'];
    this.modData('Learnsets', 'passimian').learnset.courtchange = ['9L1'];
    this.modData('Learnsets', 'golisopod').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'golisopod').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'palossand').learnset.knockoff = ['9L1'];
    this.modData('Learnsets', 'palossand').learnset.hex = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.extremespeed = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.taunt = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.bulkup = ['9L1'];
    this.modData('Learnsets', 'silvally').learnset.calmmind = ['9L1'];
    this.modData('Learnsets', 'turtonator').learnset.stealthrock = ['9L1'];
    this.modData('Learnsets', 'turtonator').learnset.lavaplume = ['9L1'];
    this.modData('Learnsets', 'drampa').learnset.chillyreception = ['9L1'];
    this.modData('Learnsets', 'drampa').learnset.earthpower = ['9L1']; // ZA addition
    this.modData('Learnsets', 'mimikyu').learnset.poltergeist = ['9L1'];
    this.modData('Learnsets', 'nihilego').learnset.nastyplot = ['9L1'];
    this.modData('Learnsets', 'buzzwole').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'buzzwole').learnset.landslide = ['9L1'];
    this.modData('Learnsets', 'necrozma').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'necrozma').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'necrozmaduskmane').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'necrozmaduskmane').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'necrozmadawnwings').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'necrozmadawnwings').learnset.aurasphere = ['9L1'];
    this.modData('Learnsets', 'stakataka').learnset.zawall = ['9M'];
    this.modData('Learnsets', 'blacephalon').learnset.poltergeist = ['9L1'];
    this.modData('Learnsets', 'blacephalon').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'zeraora').learnset.skyuppercut = ['9L1'];

    // Gen 8:
    this.modData('Learnsets', 'greedent').learnset.recycle = ['9L1'];
    this.modData('Learnsets', 'greedent').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'orbeetle').learnset.toxic = ['9M'];
    this.modData('Learnsets', 'orbeetle').learnset.gravity = ['9M'];
    this.modData('Learnsets', 'eldegoss').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'eldegoss').learnset.dazzlinggleam = ['9L1'];
    this.modData('Learnsets', 'dubwool').learnset.bodyslam = ['9L1'];
    this.modData('Learnsets', 'dubwool').learnset.milkdrink = ['9L1'];
    this.modData('Learnsets', 'drednaw').learnset.aquajet = ['9L1'];
    this.modData('Learnsets', 'boltund').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'boltund').learnset.extremespeed = ['9L1'];
    this.modData('Learnsets', 'boltund').learnset.icefang = ['9L1'];
    this.modData('Learnsets', 'coalossal').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'coalossal').learnset.lavaplume = ['9L1'];
    this.modData('Learnsets', 'sandaconda').learnset.shoreup = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.toxic = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.ventilation = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.aquajet = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.roguewave = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.wavecrash = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.thunderbolt = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.discharge = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.wildcharge = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.parallelcircuit = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.voltswitch = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.thunder = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.thunderwave = ['9L1'];
    this.modData('Learnsets', 'cramorant').learnset.supercellslam = ['9L1'];
    this.modData('Learnsets', 'toxtricity').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'toxtricity').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'toxtricitylowkey').learnset.sonicboom = ['9L1'];
    this.modData('Learnsets', 'toxtricitylowkey').learnset.closecombat = ['9L1'];
    this.modData('Learnsets', 'centiskorch').learnset.tailslap = ['9L1'];
    this.modData('Learnsets', 'centiskorch').learnset.firstimpression = ['9L1'];
    this.modData('Learnsets', 'centiskorch').learnset.superfang = ['9L1'];
    this.modData('Learnsets', 'grapploct').learnset.stormthrow = ['9L1'];
    this.modData('Learnsets', 'grapploct').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'grapploct').learnset.thunderpunch = ['9L1'];
    this.modData('Learnsets', 'grapploct').learnset.machpunch = ['9L1'];
    this.modData('Learnsets', 'grapploct').learnset.armthrust = ['9L1'];
    this.modData('Learnsets', 'polteageist').learnset.scald = ['9L1'];
    this.modData('Learnsets', 'obstagoon').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'obstagoon').learnset.extremespeed = ['9L1'];
    this.modData('Learnsets', 'perrserker').learnset.bulletpunch = ['9L1'];
    this.modData('Learnsets', 'cursola').learnset.trickroom = ['9L1'];
    this.modData('Learnsets', 'sirfetchd').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'mrrime').learnset.chillyreception = ['9L1'];
    this.modData('Learnsets', 'runerigus').learnset.painsplit = ['9L1'];
    this.modData('Learnsets', 'runerigus').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'alcremie').learnset.moonblast = ['9L1'];
    this.modData('Learnsets', 'falinks').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'frosmoth').learnset.roost = ['9L1'];
    this.modData('Learnsets', 'frosmoth').learnset.freezedry = ['9L1'];
    this.modData('Learnsets', 'frosmoth').learnset.earthpower = ['9L1'];
    this.modData('Learnsets', 'copperajah').learnset.headlongrush = ['9L1'];
    this.modData('Learnsets', 'pincurchin').learnset.voltswitch = ['9L1'];
    this.modData('Learnsets', 'zarude').learnset.honeclaws = ['9L1'];
    this.modData('Learnsets', 'zarudedada').learnset.honeclaws = ['9L1'];
    this.modData('Learnsets', 'regieleki').learnset.superpower = ['9L1'];
    this.modData('Learnsets', 'regieleki').learnset.flameburst = ['9L1'];
    this.modData('Learnsets', 'regieleki').learnset.smartstrike = ['9L1'];
    this.modData('Learnsets', 'regieleki').learnset.flashcannon = ['9L1'];
    this.modData('Learnsets', 'regieleki').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.superpower = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.fireblast = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.flamethrower = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.icefang = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.thunderbolt = ['9L1'];
    this.modData('Learnsets', 'regidrago').learnset.recover = ['9L1'];
    this.modData('Learnsets', 'glastrier').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'glastrier').learnset.mountaingale = ['9L1'];
    this.modData('Learnsets', 'wyrdeer').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'basculegion').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'basculegionf').learnset.shadowsneak = ['9L1'];
    this.modData('Learnsets', 'overqwil').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'overqwil').learnset.explosion = ['9L1'];
    this.modData('Learnsets', 'overqwil').learnset.painsplit = ['9L1'];

    // Gen 9
    this.modData('Learnsets', 'oinkologne').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'oinkolognef').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'lokix').learnset.highjumpkick = ['9L1'];
    this.modData('Learnsets', 'lokix').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'pawmot').learnset.stompingtantrum = ['9L1'];
    this.modData('Learnsets', 'pawmot').learnset.uturn = ['9L1'];
    this.modData('Learnsets', 'bellibolt').learnset.surf = ['9L1'];
    this.modData('Learnsets', 'dachsbun').learnset.slackoff = ['9L1'];
    this.modData('Learnsets', 'maushold').learnset.armthrust = ['9L1'];
    this.modData('Learnsets', 'houndstone').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'houndstone').learnset.stealthrock = ['9L1'];
    this.modData('Learnsets', 'houndstone').learnset.houndshowl = ['9L1'];
    this.modData('Learnsets', 'cetitan').learnset.ningencry = ['9L1'];
    this.modData('Learnsets', 'ceruledge').learnset.agility = ['9L1'];
    this.modData('Learnsets', 'armarouge').learnset.agility = ['9L1'];
    this.modData('Learnsets', 'rabsca').learnset.teleport = ['9L1'];
    this.modData('Learnsets', 'rabsca').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'tinkaton').learnset.fissure = ['9L1'];
    this.modData('Learnsets', 'tinkaton').learnset.spikes = ['9L1'];
    this.modData('Learnsets', 'kilowattrel').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'mabosstiff').learnset.suckerpunch = ['9L1'];
    this.modData('Learnsets', 'brambleghast').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'toedscruel').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'scovillain').learnset.scorchingsands = ['9L1'];
    this.modData('Learnsets', 'bombirdier').learnset.fatbombing = ['9L1'];
    this.modData('Learnsets', 'revavroom').learnset.steelroller = ['9L1'];
    this.modData('Learnsets', 'wugtrio').learnset.flipturn = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.seismictoss = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.softboiled = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.followme = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.afteryou = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.outrage = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.dragonpulse = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.dracometeor = ['9L1'];
    this.modData('Learnsets', 'screamtail').learnset.dragontail = ['9L1'];
    this.modData('Learnsets', 'brutebonnet').learnset.pursuit = ['9L1'];
    this.modData('Learnsets', 'brutebonnet').learnset.partingshot = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.quiverdance = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.focusblast = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.vacuumwave = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.flamethrower = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.airslash = ['9L1'];
    this.modData('Learnsets', 'slitherwing').learnset.hurricane = ['9L1'];
    this.modData('Learnsets', 'ironjugulis').learnset.nastyplot = ['9L1'];
    this.modData('Learnsets', 'ironjugulis').learnset.overheat = ['9L1'];
    this.modData('Learnsets', 'ironthorns').learnset.shiftgear = ['9L1'];
    this.modData('Learnsets', 'baxcalibur').learnset.icehammer = ['9L1']; // ZA addition
    this.modData('Learnsets', 'wochien').learnset.synthesis = ['9L1'];
    this.modData('Learnsets', 'wochien').learnset.toxic = ['9L1'];
    this.modData('Learnsets', 'wochien').learnset.strengthsap = ['9L1'];
    this.modData('Learnsets', 'okidogi').learnset.swordsdance = ['9L1'];
    this.modData('Learnsets', 'fezandipiti').learnset.defog = ['9L1'];
    this.modData('Learnsets', 'fezandipiti').learnset.knockoff = ['9L1'];

    // Return and Frustration
    const noLearn = ['beldum', 'burmy', 'cascoon', 'caterpie', 'combee', 'cosmoem', 'cosmog', 'ditto', 'kakuna', 'kricketot', 'magikarp', 'metapod', 'pyukumuku', 'scatterbug', 
      'silcoon', 'spewpa', 'tynamo', 'unown', 'weedle', 'wobbuffet', 'wurmple', 'wynaut'];
    for (const id in this.dataCache.Pokedex) {
			if (this.dataCache.Learnsets[id] && this.dataCache.Learnsets[id].learnset && !noLearn.includes(id)) {
				this.modData('Learnsets', this.toID(id)).learnset.return = ["9M"];
				this.modData('Learnsets', this.toID(id)).learnset.frustration = ["9M"];
			}
		}

    // HiddenPower
    const stillLearn = ['eevee', 'eeveestarter', 'jolteon', 'flareon', 'vaporeon', 'porygon', 'mew', 'espeon', 'umbreon', 'porygon2', 'unown', 'kecleon', 'leafeon', 'glaceon', 
      'porygonz', 'fennekin', 'braixen', 'delphox', 'sylveon', 'silvally'];
    for (const id in this.dataCache.Pokedex) {
      if (this.dataCache.Learnsets[id] && this.dataCache.Learnsets[id].learnset && !stillLearn.includes(id)) {
        delete this.modData('Learnsets', this.toID(id)).learnset.hiddenpower;
      }
    }
    delete this.modData('Learnsets', 'rockruffdusk').learnset.hiddenpower;
    delete this.modData('Learnsets', 'lycanrocdusk').learnset.hiddenpower;
  }
};
