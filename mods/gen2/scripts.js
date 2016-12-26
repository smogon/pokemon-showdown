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
			basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);
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
		let pokemonLeft = 0;
		let pokemon = [];

		let handicapMons = {'magikarp':1, 'weedle':1, 'kakuna':1, 'caterpie':1, 'metapod':1, 'ditto':1};
		let nuTiers = {'UU':1, 'BL':1, 'NFE':1, 'LC':1};
		let uuTiers = {'NFE':1, 'UU':1, 'BL':1};

		let n = 1;
		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			// FIXME: Not ES-compliant
			if (n++ > 251 || !this.data.FormatsData[id].randomBattleMoves) continue;
			pokemonPool.push(id);
		}

		// Setup storage.
		let typeCount = {};
		let uberCount = 0;
		let nuCount = 0;
		let hasShitmon = false;

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Bias the tiers so you get less shitmons and only one of the two Ubers.
			// If you have a shitmon, you're covered in OUs and Ubers if possible
			let tier = template.tier;
			switch (tier) {
			case 'LC':
				if (nuCount > 1 || hasShitmon) continue;
				break;
			case 'Uber':
				// Unless you have one of the worst mons, in that case we allow luck to give you all Ubers.
				if (uberCount >= 1 && !hasShitmon) continue;
				break;
			default:
				if (uuTiers[tier] && (hasShitmon || (nuCount > 2 && this.random(2) >= 1))) continue;
			}

			// Limit 2 of any type. Diversity and minor weakness count.
			// The second of a same type has halved chance of being added.
			let types = template.types;
			let skip = false;
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 || (typeCount[types[t]] === 1 && this.random(2) >= 1)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// The set passes the limitations.
			let set = this.randomSet(template, pokemon.length);
			pokemon.push(set);

			// Now let's increase the counters. First, the Pokémon left.
			pokemonLeft++;

			// Type counter.
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]]) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}

			// Increment type bias counters.
			if (tier === 'Uber') {
				uberCount++;
			} else if (nuTiers[tier]) {
				nuCount++;
			}

			// Is it a shitmon?
			if (handicapMons[template.speciesid]) hasShitmon = true;
		}

		return pokemon;
	},
	// Random set generation for Gen 2 Random Battles.
	randomSet: function (template, slot) {
		if (slot === undefined) slot = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('unown');

		let movePool = template.randomBattleMoves.slice();
		let moves = [];
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) hasType[template.types[1]] = true;
		let hasMove = {};
		let counter = {};
		let setupType = '';
		let item = 'leftovers';
		let ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		// Moves that boost Attack:
		let PhysicalSetup = {
			swordsdance:1, sharpen:1,
		};
		// Moves which boost Special Attack:
		let SpecialSetup = {
			amnesia:1, growth:1,
		};

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (let k = 0; k < moves.length; k++) {
				if (moves[k].substr(0, 11) === 'hiddenpower') {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moves[k]] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.substr(0, 11) === 'hiddenpower') {
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			counter = {Physical: 0, Special: 0, Status: 0, physicalsetup: 0, specialsetup: 0};
			for (let k = 0; k < moves.length; k++) {
				let move = this.getMove(moves[k]);
				let moveid = move.id;
				if (!move.damage && !move.damageCallback) {
					counter[move.category]++;
				}
				if (PhysicalSetup[moveid]) {
					counter['physicalsetup']++;
				}
				if (SpecialSetup[moveid]) {
					counter['specialsetup']++;
				}
			}

			if (counter['specialsetup']) {
				setupType = 'Special';
			} else if (counter['physicalsetup']) {
				setupType = 'Physical';
			}

			for (let k = 0; k < moves.length; k++) {
				let moveid = moves[k];
				let move = this.getMove(moveid);
				let rejected = false;
				if (moveid.substr(0, 11) === 'hiddenpower') {
					// Check for hidden power DVs
					let HPdvs = this.getType(move.type).HPdvs;
					for (let dv in HPdvs) {
						ivs[dv] = HPdvs[dv] * 2;
					}
					moveid = 'hiddenpower';
				}
				if (!template.essentialMove || moveid !== template.essentialMove) {
					switch (moveid) {
					// bad after setup
					case 'seismictoss': case 'nightshade':
						if (setupType) rejected = true;
						break;
					// bit redundant to have both
					case 'flamethrower':
						if (hasMove['fireblast']) rejected = true;
						break;
					case 'fireblast':
						if (hasMove['flamethrower']) rejected = true;
						break;
					case 'icebeam':
						if (hasMove['blizzard']) rejected = true;
						break;
					// Hydropump and surf are both valid options, just avoid one with eachother.
					case 'hydropump':
						if (hasMove['surf']) rejected = true;
						break;
					case 'surf':
						if (hasMove['hydropump']) rejected = true;
						break;
					case 'petaldance': case 'solarbeam':
						if (hasMove['megadrain'] || hasMove['razorleaf']) rejected = true;
						break;
					case 'megadrain':
						if (hasMove['razorleaf']) rejected = true;
						break;
					case 'thunder':
						if (hasMove['thunderbolt']) rejected = true;
						break;
					case 'thunderbolt':
						if (hasMove['thunder']) rejected = true;
						break;
					case 'bonemerang':
						if (hasMove['earthquake']) rejected = true;
						break;
					case 'rest':
						if (hasMove['recover'] || hasMove['softboiled'] || hasMove['roar']) rejected = true;
						break;
					case 'softboiled':
						if (hasMove['recover']) rejected = true;
						break;
					case 'sharpen':
					case 'swordsdance':
						if (counter['Special'] > counter['Physical'] || hasMove['slash'] || !counter['Physical'] || hasMove['growth']) rejected = true;
						break;
					case 'growth':
						if (counter['Special'] < counter['Physical'] || hasMove['swordsdance'] || hasMove['amnesia']) rejected = true;
						break;
					case 'doubleedge':
						if (hasMove['bodyslam']) rejected = true;
						break;
					case 'mimic':
						if (hasMove['mirrormove']) rejected = true;
						break;
					case 'superfang':
						if (hasMove['bodyslam']) rejected = true;
						break;
					case 'rockslide':
						if (hasMove['earthquake'] && hasMove['bodyslam'] && hasMove['hyperbeam']) rejected = true;
						break;
					case 'bodyslam':
						if (hasMove['thunderwave']) rejected = true;
						break;
					case 'megakick':
						if (hasMove['bodyslam']) rejected = true;
						break;
					case 'eggbomb':
						if (hasMove['hyperbeam']) rejected = true;
						break;
					case 'triattack':
						if (hasMove['doubleedge']) rejected = true;
						break;
					case 'supersonic':
						if (hasMove['confuseray']) rejected = true;
						break;
					case 'poisonpowder':
						if (hasMove['toxic'] || counter['Status'] > 1) rejected = true;
						break;
					case 'stunspore':
						if (hasMove['sleeppowder'] || counter['Status'] > 1) rejected = true;
						break;
					case 'sleeppowder':
						if (hasMove['stunspore'] || counter['Status'] > 2) rejected = true;
						break;
					case 'toxic':
						if (hasMove['sleeppowder'] || hasMove['stunspore'] || counter['Status'] > 1) rejected = true;
						break;
					} // End of switch for moveid
				}
				if (rejected && movePool.length) {
					moves.splice(k, 1);
					break;
				}
				counter[move.category]++;
			} // End of for
		} while (moves.length < 4 && movePool.length);

		// Add specific items.
		switch (template.species) {
		case 'Cubone':
		case 'Marowak':
			item = 'thickclub';
			ivs.atk = 26;
			break;
		case 'Pikachu':
			item = 'lightball';
			break;
		case 'Ditto':
			item = 'metalpowder';
			break;
		}

		let levelScale = {
			LC: 96,
			NFE: 90,
			UU: 85,
			BL: 83,
			OU: 79,
			Uber: 74,
		};
		// Hollistic judgment.
		let customScale = {
			Caterpie: 99, Kakuna: 99, Magikarp: 99, Metapod: 99, Weedle: 99, Pichu: 99, Smoochum: 99,
			Clefairy: 95, "Farfetch'd": 99, Igglybuff: 99, Jigglypuff: 99, Ditto: 99, Mewtwo: 70,
			Dragonite: 85, Cloyster: 83, Staryu: 90,
		};
		let level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		return {
			name: template.name,
			moves: moves,
			ability: 'None',
			evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
			ivs: ivs,
			item: item,
			level: level,
			shiny: false,
			gender: template.gender ? template.gender : 'M',
		};
	},
};
