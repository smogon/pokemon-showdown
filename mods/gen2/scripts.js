'use strict';

/**
 * Gen 2 scripts.
 */
exports.BattleScripts = {
	inherit: 'gen3',
	gen: 2,
	// BattlePokemon scripts.
	pokemon: {
		getStat: function (statName, unboosted, unmodified) {
			statName = toId(statName);
			if (statName === 'hp') return this.maxhp;

			// base stat
			let stat = this.stats[statName];

			// Stat boosts.
			if (!unboosted) {
				let boost = this.boosts[statName];
				if (boost > 6) boost = 6;
				if (boost < -6) boost = -6;
				if (boost >= 0) {
					let boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
					stat = Math.floor(stat * boostTable[boost]);
				} else {
					let numerators = [100, 66, 50, 40, 33, 28, 25];
					stat = Math.floor(stat * numerators[-boost] / 100);
				}

				// On Gen 2 we check modifications here from moves and items
				let statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
				stat = this.battle.runEvent('Modify' + statTable[statName], this, null, null, stat);
			}

			if (!unmodified) {
				// Burn attack drop is checked when you get the attack stat upon switch in and used until switch out.
				if (this.status === 'brn' && statName === 'atk') {
					stat = this.battle.clampIntRange(Math.floor(stat / 2), 1);
				}
			}

			// Gen 2 caps stats at 999 and min is 1.
			stat = this.battle.clampIntRange(stat, 1, 999);

			// Screens
			if (!unboosted) {
				if ((this.side.sideConditions['reflect'] && statName === 'def') || (this.side.sideConditions['lightscreen'] && statName === 'spd')) {
					stat *= 2;
				}
			}

			// Treat here the items.
			if ((this.species in {'Cubone':1, 'Marowak':1} && this.item === 'thickclub' && statName === 'atk') || (this.species === 'Pikachu' && this.item === 'lightball' && statName === 'spa')) {
				stat *= 2;
			} else if (this.species === 'Ditto' && this.item === 'metalpowder' && statName in {'def':1, 'spd':1}) {
				// what. the. fuck. stop playing pokémon
				stat *= 1.5;
			}

			return stat;
		},
	},
	// Battle scripts.
	runMove: function (move, pokemon, targetLoc, sourceEffect) {
		let target = this.getTarget(pokemon, move, targetLoc);
		if (!sourceEffect && toId(move) !== 'struggle') {
			let changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		move = this.getMove(move);
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		this.setActiveMove(move, pokemon, target);

		if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		}
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
			// Prevent invulnerability from persisting until the turn ends
			pokemon.removeVolatile('twoturnmove');
			// End Bide
			pokemon.removeVolatile('bide');
			// Rampage moves end without causing confusion
			delete pokemon.volatiles['lockedmove'];
			this.clearActiveMove(true);
			// This is only run for sleep and fully paralysed.
			this.runEvent('AfterMoveSelf', pokemon, target, move);
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove = this.runEvent('LockMove', pokemon);
		if (lockedMove === true) lockedMove = false;
		if (!lockedMove) {
			if (!pokemon.deductPP(move, null, target) && (move.id !== 'struggle')) {
				this.add('cant', pokemon, 'nopp', move);
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.moveUsed(move);
		this.useMove(move, pokemon, target, sourceEffect);
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		if (!move.selfSwitch && target.hp > 0) this.runEvent('AfterMoveSelf', pokemon, target, move);
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		let damage;
		move = this.getMoveCopy(move);

		if (!moveData) moveData = move;
		let hitResult = true;

		if (move.target === 'all' && !isSelf) {
			hitResult = this.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
		} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
			hitResult = this.singleEvent('TryHitSide', moveData, {}, target.side, pokemon, move);
		} else if (target) {
			hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);
		}
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (target && !isSecondary && !isSelf) {
			hitResult = this.runEvent('TryPrimaryHit', target, pokemon, moveData);
			if (hitResult === 0) {
				// special Substitute flag
				hitResult = true;
				target = null;
			}
		}
		if (target && isSecondary && !moveData.self) {
			hitResult = true;
		}
		if (!hitResult) {
			return false;
		}

		if (target) {
			let didSomething = false;
			damage = this.getDamage(pokemon, target, moveData);

			if ((damage || damage === 0) && !target.fainted) {
				if (move.noFaint && damage >= target.hp) {
					damage = target.hp - 1;
				}
				damage = this.damage(damage, target, pokemon, move);
				if (!(damage || damage === 0)) {
					this.debug('damage interrupted');
					return false;
				}
				didSomething = true;
			}
			if (damage === false || damage === null) {
				if (damage === false && !isSecondary && !isSelf) {
					this.add('-fail', target);
				}
				this.debug('damage calculation interrupted');
				return false;
			}

			if (moveData.boosts && !target.fainted) {
				if (pokemon.volatiles['lockon'] && target === pokemon.volatiles['lockon'].source && target.isSemiInvulnerable() && !isSelf) {
					if (!isSecondary) this.add('-fail', target);
					return false;
				}
				hitResult = this.boost(moveData.boosts, target, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.heal && !target.fainted) {
				let d = target.heal(Math.round(target.maxhp * moveData.heal[0] / moveData.heal[1]));
				if (!d && d !== 0) {
					this.add('-fail', target);
					this.debug('heal interrupted');
					return false;
				}
				this.add('-heal', target, target.getHealth);
				didSomething = true;
			}
			if (moveData.status) {
				hitResult = target.trySetStatus(moveData.status, pokemon, move);
				if (!hitResult && move.status) return hitResult;
				didSomething = didSomething || hitResult;
			}
			if (moveData.forceStatus) {
				hitResult = target.setStatus(moveData.forceStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.volatileStatus) {
				hitResult = target.addVolatile(moveData.volatileStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.sideCondition) {
				hitResult = target.side.addSideCondition(moveData.sideCondition, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.weather) {
				hitResult = this.setWeather(moveData.weather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.pseudoWeather) {
				hitResult = this.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.forceSwitch) {
				if (this.canSwitch(target.side)) didSomething = true; // at least defer the fail message to later
			}
			if (moveData.selfSwitch) {
				if (this.canSwitch(pokemon.side)) didSomething = true; // at least defer the fail message to later
			}
			// Hit events
			//   These are like the TryHit events, except we don't need a FieldHit event.
			//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
			hitResult = null;
			if (move.target === 'all' && !isSelf) {
				if (moveData.onHitField) hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				if (moveData.onHitSide) hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
			} else {
				if (moveData.onHit) hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
				if (moveData.onAfterHit) hitResult = this.singleEvent('AfterHit', moveData, {}, target, pokemon, move);
			}

			if (!hitResult && !didSomething && !moveData.self && !moveData.selfdestruct) {
				if (!isSelf && !isSecondary) {
					if (hitResult === false || didSomething === false) this.add('-fail', target);
				}
				this.debug('move failed because it did nothing');
				return false;
			}
		}
		if (moveData.self) {
			let selfRoll;
			if (!isSecondary && moveData.self.boosts) selfRoll = this.random(100);
			// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
			if (typeof moveData.self.chance === 'undefined' || selfRoll < moveData.self.chance) {
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
		}
		if (moveData.secondaries && this.runEvent('TrySecondaryHit', target, pokemon, moveData)) {
			for (let i = 0; i < moveData.secondaries.length; i++) {
				// We check here whether to negate the probable secondary status if it's burn or freeze.
				// In the game, this is checked and if true, the random number generator is not called.
				// That means that a move that does not share the type of the target can status it.
				// This means tri-attack can burn fire-types and freeze ice-types.
				// Unlike gen 1, though, paralysis works for all unless the target is immune to direct move (ie. ground-types and t-wave).
				if (!(moveData.secondaries[i].status && moveData.secondaries[i].status in {'brn':1, 'frz':1} && target && target.hasType(move.type))) {
					let effectChance = Math.floor(moveData.secondaries[i].chance * 255 / 100);
					if (typeof moveData.secondaries[i].chance === 'undefined' || this.random(256) <= effectChance) {
						this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
					}
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.canSwitch(target.side)) {
			hitResult = this.runEvent('DragOut', target, pokemon, move);
			if (hitResult) {
				this.dragIn(target.side, target.position);
			} else if (hitResult === false) {
				this.add('-fail', target);
			}
		}
		if (move.selfSwitch && pokemon.hp) {
			pokemon.switchFlag = move.selfSwitch;
		}
		return damage;
	},
	getDamage: function (pokemon, target, move, suppressMessages) {
		// First of all, we get the move.
		if (typeof move === 'string') move = this.getMove(move);
		if (typeof move === 'number') {
			move = {
				basePower: move,
				type: '???',
				category: 'Physical',
				willCrit: false,
				flags: {},
			};
		}

		// Let's test for immunities.
		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		// Is it an OHKO move?
		if (move.ohko) {
			return target.maxhp;
		}

		// We edit the damage through move's damage callback
		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}

		// We take damage from damage=level moves
		if (move.damage === 'level') {
			return pokemon.level;
		}

		// If there's a fix move damage, we run it
		if (move.damage) {
			return move.damage;
		}

		// We check the category and typing to calculate later on the damage
		move.category = this.getCategory(move);
		if (!move.defensiveCategory) move.defensiveCategory = move.category;
		// '???' is typeless damage: used for Struggle and Confusion etc
		if (!move.type) move.type = '???';
		let type = move.type;

		// We get the base power and apply basePowerCallback if necessary
		let basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}

		// We check for Base Power
		if (!basePower) {
			if (basePower === 0) return; // Returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		// Checking for the move's Critical Hit ratio
		move.critRatio = this.clampIntRange(move.critRatio, 0, 5);
		let critMult = [0, 16, 8, 4, 3, 2];
		move.crit = move.willCrit || false;
		if (typeof move.willCrit === 'undefined') {
			if (move.critRatio) {
				move.crit = (this.random(critMult[move.critRatio]) === 0);
			}
		}

		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// Happens after crit calculation
		if (basePower) {
			if (move.isSelfHit) {
				move.type = move.baseMoveType;
				basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);
				move.type = '???';
			} else {
				basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);
			}
			if (move.basePowerModifier) {
				basePower *= move.basePowerModifier;
			}
		}
		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		// We now check for attacker and defender
		let level = pokemon.level;
		let attacker = pokemon;
		let defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;
		let atkType = (move.category === 'Physical') ? 'atk' : 'spa';
		let defType = (move.defensiveCategory === 'Physical') ? 'def' : 'spd';
		let unboosted = false;
		let noburndrop = false;

		// The move is a critical hit. Several things happen here.
		if (move.crit) {
			// Level is doubled for damage calculation.
			level *= 2;
			if (!suppressMessages) this.add('-crit', target);
			// Stat level modifications are ignored if they are neutral to or favour the defender.
			// Reflect and Light Screen defensive boosts are only ignored if stat level modifications were also ignored as a result of that.
			if (attacker.boosts[atkType] <= defender.boosts[defType]) {
				unboosted = true;
				noburndrop = true;
			}
		}
		// Get stats now.
		let attack = attacker.getStat(atkType, unboosted, noburndrop);
		let defense = defender.getStat(defType, unboosted);

		// Moves that ignore offense and defense respectively.
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			// The attack drop from the burn is only applied when attacker's attack level is higher than defender's defense level.
			attack = attacker.getStat(atkType, true, true);
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(defType, true, true);
		}

		// When either attack or defense are higher than 256, they are both divided by 4 and moded by 256.
		// This is what cuases the roll over bugs.
		if (attack >= 256 || defense >= 256) {
			attack = this.clampIntRange(Math.floor(attack / 4) % 256, 1);
			defense = this.clampIntRange(Math.floor(defense / 4) % 256, 1);
		}

		// Self destruct moves halve defense at this point.
		if (move.selfdestruct && defType === 'def') {
			defense = this.clampIntRange(Math.floor(defense / 2), 1);
		}

		// Let's go with the calculation now that we have what we need.
		// We do it step by step just like the game does.
		let damage = level * 2;
		damage = Math.floor(damage / 5);
		damage += 2;
		damage *= basePower;
		damage *= attack;
		damage = Math.floor(damage / defense);
		damage = this.clampIntRange(Math.floor(damage / 50), 1, 997);
		damage += 2;

		// Weather modifiers
		if ((this.isWeather('raindance') && type === 'Water') || (this.isWeather('sunnyday') && type === 'Fire')) {
			damage = Math.floor(damage * 1.5);
		} else if ((this.isWeather('raindance') && (type === 'Fire' || move.id === 'solarbeam')) || (this.isWeather('sunnyday') && type === 'Water')) {
			damage = Math.floor(damage / 2);
		}

		// STAB damage bonus, the "???" type never gets STAB
		if (type !== '???' && pokemon.hasType(type)) {
			damage += Math.floor(damage / 2);
		}

		// Type effectiveness
		let totalTypeMod = this.getEffectiveness(type, target);
		// Super effective attack
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);
			damage *= 2;
			if (totalTypeMod >= 2) {
				damage *= 2;
			}
		}
		// Resisted attack
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);
			damage = Math.floor(damage / 2);
			if (totalTypeMod <= -2) {
				damage = Math.floor(damage / 2);
			}
		}

		// Apply random factor is damage is greater than 1, except for Flail and Reversal
		if (!move.noDamageVariance && damage > 1) {
			damage *= this.random(217, 256);
			damage = Math.floor(damage / 255);
		}

		// If damage is less than 1, we return 1
		if (basePower && !Math.floor(damage)) {
			return 1;
		}

		// We are done, this is the final damage
		return damage;
	},
	damage: function (damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		effect = this.getEffect(effect);
		if (!(damage || damage === 0)) return damage;
		if (damage !== 0) damage = this.clampIntRange(damage, 1);

		if (effect.id !== 'struggle-recoil') { // Struggle recoil is not affected by effects
			if (effect.effectType === 'Weather' && !target.runStatusImmunity(effect.id)) {
				this.debug('weather immunity');
				return 0;
			}
			damage = this.runEvent('Damage', target, source, effect, damage);
			if (!(damage || damage === 0)) {
				this.debug('damage event failed');
				return damage;
			}
			if (target.illusion && effect && effect.effectType === 'Move') {
				this.debug('illusion cleared');
				target.illusion = null;
				this.add('replace', target, target.getDetails);
			}
		}
		if (damage !== 0) damage = this.clampIntRange(damage, 1);
		damage = target.damage(damage, source, effect);
		if (source) source.lastDamage = damage;
		let name = effect.fullname;
		if (name === 'tox') name = 'psn';
		switch (effect.id) {
		case 'partiallytrapped':
			this.add('-damage', target, target.getHealth, '[from] ' + this.effectData.sourceEffect.fullname, '[partiallytrapped]');
			break;
		default:
			if (effect.effectType === 'Move') {
				this.add('-damage', target, target.getHealth);
			} else if (source && source !== target) {
				this.add('-damage', target, target.getHealth, '[from] ' + effect.fullname, '[of] ' + source);
			} else {
				this.add('-damage', target, target.getHealth, '[from] ' + name);
			}
			break;
		}

		if (effect.drain && source) {
			this.heal(Math.ceil(damage * effect.drain[0] / effect.drain[1]), source, target, 'drain');
		}

		if (target.fainted || target.hp <= 0) {
			this.debug('instafaint: ' + this.faintQueue.map(entry => entry.target).map(pokemon => pokemon.name));
			this.faintMessages(true);
			target.faint();
		} else {
			damage = this.runEvent('AfterDamage', target, source, effect, damage);
		}

		return damage;
	},
	randomTeam: function (side) {
		let pokemonLeft = 6;
		let pokemon = [];

		let n = 1;
		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			// FIXME: Not ES-compliant
			if (n++ > 251 || !this.data.FormatsData[id].randomSet1) continue;
			pokemonPool.push(id);
		}

		// Setup storage.
		let tierCount = {};
		let typeCount = {};
		let weaknessCount = {
			'Normal':0, 'Fighting':0, 'Flying':0, 'Poison':0, 'Ground':0, 'Rock':0, 'Bug':0, 'Ghost':0, 'Steel':0,
			'Fire':0, 'Water':0, 'Grass':0, 'Electric':0, 'Psychic':0, 'Ice':0, 'Dragon':0, 'Dark':0,
		};
		let resistanceCount = {
			'Normal':0, 'Fighting':0, 'Flying':0, 'Poison':0, 'Ground':0, 'Rock':0, 'Bug':0, 'Ghost':0, 'Steel':0,
			'Fire':0, 'Water':0, 'Grass':0, 'Electric':0, 'Psychic':0, 'Ice':0, 'Dragon':0, 'Dark':0,
		};
		let restrictMoves = {
			'reflect':1, 'lightscreen':1, 'rapidspin':1, 'spikes':1, 'bellydrum':1, 'haze':1,
			'healbell':1, 'thief':1, 'phazing':1, 'sleeptalk':2, 'sleeping':2,
		};

		while (pokemonPool.length && pokemonLeft > 0) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;
			let skip = false;

			// Ensure 1 Uber at most
			// Ensure 2 mons of same tier at most (this includes OU,BL,UU,NU; other tiers not supported yet)
			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				if (tierCount['Uber']) skip = true;
				break;
			default:
				if (tierCount[tier] > 1) skip = true;
			}

			// Ensure the same type not more than twice
			// 33% discard single-type mon if that type already exists
			// 66% discard double-type mon if both types already exist
			let types = template.types;
			if (types.length === 1) {
				if (typeCount[types[0]] > 1) skip = true;
				if (typeCount[types[0]] && this.random(3) === 0) skip = true;
			} else if (types.length === 2) {
				if (typeCount[types[0]] > 1 || typeCount[types[1]] > 1) skip = true;
				if (typeCount[types[0]] && typeCount[types[1]] && this.random(3) > 0) skip = true;
			}

			// Ensure the weakness-resistance balance is 2 points or lower for all types,
			// but ensure no more than 3 pokemon weak to the same regardless.
			let weaknesses = [];
			for (let type in weaknessCount) {
				let weak = this.getImmunity(type, template) && this.getEffectiveness(type, template) > 0;
				if (!weak) continue;
				if (weaknessCount[type] > 2 || weaknessCount[type] - resistanceCount[type] > 1) {
					skip = true;
				}
				weaknesses.push(type);
			}
			let resistances = [];
			for (let type in resistanceCount) {
				let resist = !this.getImmunity(type, template) || this.getEffectiveness(type, template) < 0;
				if (resist) resistances.push(type);
			}

			// In worst case scenario, make sure teams have 6 mons. This shouldn't be necessary
			if (skip && pokemonPool.length + 1 > pokemonLeft) continue;

			// The set passes the randomTeam limitations.
			let set = this.randomSet(template, pokemon.length, restrictMoves);
			if (set.other.discard && pokemonPool.length + 1 > pokemonLeft) continue;

			// The set also passes the randomSet limitations.
			pokemon.push(set.moveset);

			// Now let's update the counters. First, the Pokémon left.
			pokemonLeft--;

			// Moves counter.
			restrictMoves = set.other.restrictMoves;
			let moves = set.moveset.moves;
			for (let i = 0; i < moves.length; i++) {
				if (restrictMoves[moves[i]]) restrictMoves[moves[i]]--;
				if (restrictMoves['phazing'] && (moves[i] === "roar" || moves[i] === "whirlwind")) {
					restrictMoves['phazing']--;
				}
				if (restrictMoves['sleeping'] && (moves[i] === "sleeppowder" || moves[i] === "lovelykiss" || moves[i] === "sing" || moves[i] === "hypnosis" || moves[i] === "spore")) {
					restrictMoves['sleeping']--;
				}
			}

			// Tier counter.
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

			// Type counter.
			for (let i = 0; i < types.length; i++) {
				if (typeCount[types[i]]) {
					typeCount[types[i]]++;
				} else {
					typeCount[types[i]] = 1;
				}
			}

			// Weakness and resistance counter.
			for (let i = 0; i < weaknesses.length; i++) {
				weaknessCount[weaknesses[i]]++;
			}
			for (let i = 0; i < resistances.length; i++) {
				resistanceCount[resistances[i]]++;
			}
		}

		return pokemon;
	},
	// Random set generation for Gen 2 Random Battles.
	randomSet: function (template, slot, restrictMoves) {
		if (slot === undefined) slot = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('unown');

		let randomSetNumber = 0;
		let set = template.randomSet1;
		let moves = [];
		let hasMove = {};
		let item = '';
		let ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		let discard = false;
		let rerollsLeft = 3;
		let isPhazingMove = function (move) {
			return (move === "roar" || move === "whirlwind");
		};
		let isSleepMove = function (move) {
			return (move === "sleeppowder" || move === "lovelykiss" || move === "sing" || move === "hypnosis" || move === "spore");
		};

		// Choose one of the available sets (up to four) at random
		// Prevent certain moves from showing up more than once or twice:
		// sleeptalk, reflect, lightscreen, rapidspin, spikes, bellydrum, heal bell, (p)hazing moves, sleep moves
		do {
			moves = [];
			hasMove = {};

			if (template.randomSet2) {
				randomSetNumber = this.random(15);
				if (randomSetNumber < template.randomSet1.chance) {
					set = template.randomSet1;
				} else if (randomSetNumber < template.randomSet2.chance) {
					set = template.randomSet2;
				} else if (template.randomSet3 && randomSetNumber < template.randomSet3.chance) {
					set = template.randomSet3;
				} else if (template.randomSet4 && randomSetNumber < template.randomSet4.chance) {
					set = template.randomSet4;
				} else if (template.randomSet5) {
					set = template.randomSet5;
				}
			}

			// Even if we want to discard this set, return a proper moveset in case there's no room to discard more Pokemon
			// Add the base moves (between 0 and 4) of the chosen set
			if (set.baseMove1 && moves.length < 4) moves.push(set.baseMove1);
			if (set.baseMove2 && moves.length < 4) moves.push(set.baseMove2);
			if (set.baseMove3 && moves.length < 4) moves.push(set.baseMove3);
			if (set.baseMove4 && moves.length < 4) moves.push(set.baseMove4);

			// Add the filler moves (between 0 and 4) of the chosen set
			if (set.fillerMoves1 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves1);
			if (set.fillerMoves2 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves2);
			if (set.fillerMoves3 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves3);
			if (set.fillerMoves4 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves4);

			// Make sure it's not an undesired moveset according to restrictMoves and the rest of the team
			rerollsLeft--;
			discard = false;
			for (let i = 0; i < moves.length; i++) {
				if (restrictMoves[moves[i]] === 0) { discard = true; break; }
				if (isPhazingMove(moves[i]) && restrictMoves['phazing'] === 0) { discard = true; break; }
				if (isSleepMove(moves[i]) && restrictMoves['sleeping'] === 0) { discard = true; break; }
			}
		} while (rerollsLeft > 0 && discard);

		// many restrictMoves are also rare and/or useful all around, so encourage adding them once to the team
		// Start accounting for this after the first half of the team has been added
		let discourage = false;
		if (!discard && slot > 3) {
			discourage = true;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i] === "sleeptalk" && restrictMoves['sleeptalk'] > 1) { discourage = false; break; }
				if (moves[i] !== "bellydrum" && moves[i] !== "haze" && moves[i] !== "thief" && restrictMoves[moves[i]] > 0) { discourage = false; break; }
				if (isPhazingMove(moves[i]) && restrictMoves['phazing'] > 0) { discourage = false; break; }
				if (isSleepMove(moves[i]) && restrictMoves['sleeping'] > 1) { discourage = false; break; }
			}
		}
		if (discourage && this.random(2) === 0) discard = true;

		// Add the held item
		// TODO: for some reason, items like Thick Club are not working in randbats
		if (set.item) item = set.item[this.random(set.item.length)];

		// Adjust ivs for hiddenpower
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].substr(0, 11) !== 'hiddenpower') continue;
			let hpType = moves[i].substr(11, moves[i].length);
			switch (hpType) {
			case 'dragon': ivs.def = 28; break;
			case 'ice': ivs.def = 26; break;
			case 'psychic': ivs.def = 24; break;
			case 'electric': ivs.atk = 28; break;
			case 'grass': ivs.atk = 28; ivs.def = 28; break;
			case 'water': ivs.atk = 28; ivs.def = 26; break;
			case 'fire': ivs.atk = 28; ivs.def = 24; break;
			case 'steel': ivs.atk = 26; break;
			case 'ghost': ivs.atk = 26; ivs.def = 28; break;
			case 'bug': ivs.atk = 26; ivs.def = 26; break;
			case 'rock': ivs.atk = 26; ivs.def = 24; break;
			case 'ground': ivs.atk = 24; break;
			case 'poison': ivs.atk = 24; ivs.def = 28; break;
			case 'flying': ivs.atk = 24; ivs.def = 26; break;
			case 'fighting': ivs.atk = 24; ivs.def = 24; break;
			}
			if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
			if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
		}

		let levelScale = {
			LC: 90, // unused
			NFE: 84, // unused
			NU: 78,
			UU: 74,
			BL: 70,
			OU: 68,
			Uber: 64,
		};
		let customScale = {
			Caterpie: 99, Kakuna: 99, Magikarp: 99, Metapod: 99, Weedle: 99, // unused
			Unown: 98, Wobbuffet: 82, Ditto: 82,
			Snorlax: 66, Nidoqueen: 70,
		};
		let level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		return {
			moveset: {
				species: template.name,
				moves: moves,
				ability: 'None',
				evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
				ivs: ivs,
				item: item,
				level: level,
				shiny: false,
				gender: template.gender ? template.gender : 'M',
			},
			other: {
				discard: discard,
				restrictMoves: restrictMoves,
			},
		};
	},
	randomMove: function (moves, hasMove, fillerMoves) {
		let index = 0;
		let done = false;

		do {
			index = this.random(fillerMoves.length);
			if (!hasMove[fillerMoves[index]] && !(hasMove[fillerMoves[index].substr(0, 11)])) {
				// push the move if not yet known
				moves.push(fillerMoves[index]);
				done = true;

				if (fillerMoves[index].substr(0, 11) === 'hiddenpower') {
					// only one hiddenpower is allowed
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[fillerMoves[index]] = true;
				}
			}
		} while (!done);
	},
};
