exports.BattleScripts = {
	gen: 6,
	runMove: function (move, pokemon, target, sourceEffect) {
		if (!sourceEffect && toId(move) !== 'struggle') {
			var changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
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
			// Prevent Pursuit from running again against a slower U-turn/Volt Switch/Parting Shot
			pokemon.moveThisTurn = true;
			this.clearActiveMove(true);
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.lastDamage = 0;
		var lockedMove = this.runEvent('LockMove', pokemon);
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
	},
	useMove: function (move, pokemon, target, sourceEffect) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		move = this.getMoveCopy(move);
		if (this.activeMove) move.priority = this.activeMove.priority;
		var baseTarget = move.target;
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}
		if (sourceEffect) move.sourceEffect = sourceEffect.id;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Target changed in ModifyMove, so we must adjust it here
			// Adjust before the next event so the correct target is passed to the
			// event
			target = this.resolveTarget(pokemon, move);
		}
		move = this.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Adjust again
			target = this.resolveTarget(pokemon, move);
		}
		if (!move) return false;

		var attrs = '';
		var missed = false;
		if (pokemon.fainted) {
			return false;
		}

		if (move.isTwoTurnMove && !pokemon.volatiles[move.id]) {
			attrs = '|[still]'; // suppress the default move animation
		}

		var movename = move.name;
		if (move.id === 'hiddenpower') movename = 'Hidden Power';
		if (sourceEffect) attrs += '|[from]' + this.getEffect(sourceEffect);
		this.addMove('move', pokemon, movename, target + attrs);

		if (target === false) {
			this.attrLastMove('[notarget]');
			this.add('-notarget');
			return true;
		}

		if (!this.runEvent('TryMove', pokemon, target, move)) {
			return true;
		}

		if (typeof move.affectedByImmunities === 'undefined') {
			move.affectedByImmunities = (move.category !== 'Status');
		}

		var damage = false;
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.tryMoveHit(target, pokemon, move);
		} else if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
			var targets = [];
			if (move.target === 'allAdjacent') {
				var allyActive = pokemon.side.active;
				for (var i = 0; i < allyActive.length; i++) {
					if (allyActive[i] && Math.abs(i - pokemon.position) <= 1 && i !== pokemon.position && !allyActive[i].fainted) {
						targets.push(allyActive[i]);
					}
				}
			}
			var foeActive = pokemon.side.foe.active;
			var foePosition = foeActive.length - pokemon.position - 1;
			for (var i = 0; i < foeActive.length; i++) {
				if (foeActive[i] && Math.abs(i - foePosition) <= 1 && !foeActive[i].fainted) {
					targets.push(foeActive[i]);
				}
			}
			if (move.selfdestruct) {
				this.faint(pokemon, pokemon, move);
			}
			if (!targets.length) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				return true;
			}
			if (targets.length > 1) move.spreadHit = true;
			damage = 0;
			for (var i = 0; i < targets.length; i++) {
				damage += (this.tryMoveHit(targets[i], pokemon, move, true) || 0);
			}
			if (!pokemon.hp) pokemon.faint();
		} else {
			if (target.fainted && target.side !== pokemon.side) {
				// if a targeted foe faints, the move is retargeted
				target = this.resolveTarget(pokemon, move);
			}
			var lacksTarget = target.fainted;
			if (!lacksTarget) {
				if (move.target === 'adjacentFoe' || move.target === 'adjacentAlly' || move.target === 'normal' || move.target === 'randomNormal') {
					lacksTarget = !this.isAdjacent(target, pokemon);
				}
			}
			if (lacksTarget) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				return true;
			}
			if (target.side.active.length > 1) {
				target = this.runEvent('RedirectTarget', pokemon, pokemon, move, target);
			}
			damage = this.tryMoveHit(target, pokemon, move);
		}
		if (!pokemon.hp) {
			this.faint(pokemon, pokemon, move);
		}

		if (!damage && damage !== 0 && damage !== undefined) {
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			return true;
		}

		if (move.selfdestruct) {
			this.faint(pokemon, pokemon, move);
		}

		if (!move.negateSecondary) {
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
		}
		return true;
	},
	tryMoveHit: function (target, pokemon, move, spreadHit) {
		if (move.selfdestruct && spreadHit) pokemon.hp = 0;

		this.setActiveMove(move, pokemon, target);
		var hitResult = true;

		hitResult = this.singleEvent('PrepareHit', move, {}, target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}
		this.runEvent('PrepareHit', pokemon, target, move);

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
			return false;
		}

		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			if (move.target === 'all') {
				hitResult = this.runEvent('TryHitField', target, pokemon, move);
			} else {
				hitResult = this.runEvent('TryHitSide', target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return true;
			}
			return this.moveHit(target, pokemon, move);
		}

		if (move.affectedByImmunities && !target.runImmunity(move.type, true)) {
			return false;
		}

		if (typeof move.affectedByImmunities === 'undefined') {
			move.affectedByImmunities = (move.category !== 'Status');
		}

		hitResult = this.runEvent('TryHit', target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		var boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

		// calculate true accuracy
		var accuracy = move.accuracy;
		var boosts, boost;
		if (accuracy !== true) {
			if (!move.ignoreAccuracy) {
				boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.clone(pokemon.boosts));
				boost = this.clampIntRange(boosts['accuracy'], -6, 6);
				if (boost > 0) {
					accuracy *= boostTable[boost];
				} else {
					accuracy /= boostTable[-boost];
				}
			}
			if (!move.ignoreEvasion) {
				boosts = this.runEvent('ModifyBoost', target, null, null, Object.clone(target.boosts));
				boost = this.clampIntRange(boosts['evasion'], -6, 6);
				if (boost > 0) {
					accuracy /= boostTable[boost];
				} else if (boost < 0) {
					accuracy *= boostTable[-boost];
				}
			}
		}
		if (move.ohko) { // bypasses accuracy modifiers
			if (!target.volatiles['bounce'] && !target.volatiles['dig'] && !target.volatiles['dive'] && !target.volatiles['fly'] && !target.volatiles['shadowforce'] && !target.volatiles['skydrop']) {
				accuracy = 30;
				if (pokemon.level > target.level) accuracy += (pokemon.level - target.level);
			}
		}
		if (move.alwaysHit) {
			accuracy = true; // bypasses ohko accuracy modifiers
		} else {
			accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
		}
		if (accuracy !== true && this.random(100) >= accuracy) {
			if (!spreadHit) this.attrLastMove('[miss]');
			this.add('-miss', pokemon, target);
			return false;
		}

		var totalDamage = 0;
		var damage = 0;
		pokemon.lastDamage = 0;
		if (move.multihit) {
			var hits = move.multihit;
			if (hits.length) {
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5) {
					if (this.gen >= 5) {
						hits = [2, 2, 3, 3, 4, 5][this.random(6)];
					} else {
						hits = [2, 2, 2, 3, 3, 3, 4, 5][this.random(8)];
					}
				} else {
					hits = this.random(hits[0], hits[1] + 1);
				}
			}
			hits = Math.floor(hits);
			var nullDamage = true;
			var moveDamage;
			// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
			var isSleepUsable = move.sleepUsable || this.getMove(move.sourceEffect).sleepUsable;
			var i;
			for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
				if (pokemon.status === 'slp' && !isSleepUsable) break;

				moveDamage = this.moveHit(target, pokemon, move);
				if (moveDamage === false) break;
				if (nullDamage && (moveDamage || moveDamage === 0)) nullDamage = false;
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage = (moveDamage || 0);
				// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
				totalDamage += damage;
				this.eachEvent('Update');
			}
			if (i === 0) return true;
			if (nullDamage) damage = false;
			this.add('-hitcount', target, i);
		} else {
			damage = this.moveHit(target, pokemon, move);
			totalDamage = damage;
		}

		if (move.recoil) {
			this.damage(this.clampIntRange(Math.round(totalDamage * move.recoil[0] / move.recoil[1]), 1), pokemon, target, 'recoil');
		}

		if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

		if (!damage && damage !== 0) return damage;

		if (target && !move.negateSecondary) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		var damage;
		move = this.getMoveCopy(move);

		if (!moveData) moveData = move;
		if (!moveData.flags) moveData.flags = {};
		var hitResult = true;

		// TryHit events:
		//   STEP 1: we see if the move will succeed at all:
		//   - TryHit, TryHitSide, or TryHitField are run on the move,
		//     depending on move target (these events happen in useMove
		//     or tryMoveHit, not below)
		//   == primary hit line ==
		//   Everything after this only happens on the primary hit (not on
		//   secondary or self-hits)
		//   STEP 2: we see if anything blocks the move from hitting:
		//   - TryFieldHit is run on the target
		//   STEP 3: we see if anything blocks the move from hitting the target:
		//   - If the move's target is a pokemon, TryHit is run on that pokemon

		// Note:
		//   If the move target is `foeSide`:
		//     event target = pokemon 0 on the target side
		//   If the move target is `allySide` or `all`:
		//     event target = the move user
		//
		//   This is because events can't accept actual sides or fields as
		//   targets. Choosing these event targets ensures that the correct
		//   side or field is hit.
		//
		//   It is the `TryHitField` event handler's responsibility to never
		//   use `target`.
		//   It is the `TryFieldHit` event handler's responsibility to read
		//   move.target and react accordingly.
		//   An exception is `TryHitSide` as a single event (but not as a normal
		//   event), which is passed the target side.

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
			var didSomething = false;

			damage = this.getDamage(pokemon, target, moveData);

			// getDamage has several possible return values:
			//
			//   a number:
			//     means that much damage is dealt (0 damage still counts as dealing
			//     damage for the purposes of things like Static)
			//   false:
			//     gives error message: "But it failed!" and move ends
			//   null:
			//     the move ends, with no message (usually, a custom fail message
			//     was already output by an event handler)
			//   undefined:
			//     means no damage is dealt and the move continues
			//
			// basically, these values have the same meanings as they do for event
			// handlers.

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
				if (damage === false) {
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
				var d = target.heal((this.gen < 5 ? Math.floor : Math.round)(target.maxhp * moveData.heal[0] / moveData.heal[1]));
				if (!d && d !== 0) {
					this.add('-fail', target);
					this.debug('heal interrupted');
					return false;
				}
				this.add('-heal', target, target.getHealth);
				didSomething = true;
			}
			if (moveData.status) {
				if (!target.status) {
					hitResult = target.setStatus(moveData.status, pokemon, move);
					didSomething = didSomething || hitResult;
				} else if (!isSecondary) {
					if (target.status === moveData.status) {
						this.add('-fail', target, target.status);
					} else {
						this.add('-fail', target);
					}
					return false;
				}
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
			if (moveData.terrain) {
				hitResult = this.setTerrain(moveData.terrain, pokemon, move);
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
			var selfRoll;
			if (!isSecondary && moveData.self.boosts) selfRoll = this.random(100);
			// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
			if (typeof moveData.self.chance === 'undefined' || selfRoll < moveData.self.chance) {
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
		}
		if (moveData.secondaries && this.runEvent('TrySecondaryHit', target, pokemon, moveData)) {
			var secondaryRoll;
			for (var i = 0; i < moveData.secondaries.length; i++) {
				secondaryRoll = this.random(100);
				if (typeof moveData.secondaries[i].chance === 'undefined' || secondaryRoll < moveData.secondaries[i].chance) {
					this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.canSwitch(target.side)) {
			hitResult = this.runEvent('DragOut', target, pokemon, move);
			if (hitResult) {
				target.forceSwitchFlag = true;
			} else if (hitResult === false) {
				this.add('-fail', target);
			}
		}
		if (move.selfSwitch && pokemon.hp) {
			pokemon.switchFlag = move.selfSwitch;
		}
		return damage;
	},

	canMegaEvo: function (pokemon) {
		var altForme = pokemon.baseTemplate.otherFormes && this.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		if (altForme && altForme.isMega && altForme.requiredMove && pokemon.moves.indexOf(toId(altForme.requiredMove)) > -1) return altForme.species;
		var item = pokemon.getItem();
		if (item.megaEvolves !== pokemon.baseTemplate.baseSpecies || item.megaStone === pokemon.species) return false;
		return item.megaStone;
	},

	runMegaEvo: function (pokemon) {
		var template = this.getTemplate(pokemon.canMegaEvo);
		var side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		var foeActive = side.foe.active;
		for (var i = 0; i < foeActive.length; i++) {
			if (foeActive[i].volatiles['skydrop'] && foeActive[i].volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // mega evolution is permanent
		pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
		this.add('detailschange', pokemon, pokemon.details);
		this.add('-mega', pokemon, template.baseSpecies, template.requiredItem);
		pokemon.setAbility(template.abilities['0']);
		pokemon.baseAbility = pokemon.ability;

		// Limit one mega evolution
		for (var i = 0; i < side.pokemon.length; i++) {
			side.pokemon[i].canMegaEvo = false;
		}
		return true;
	},

	isAdjacent: function (pokemon1, pokemon2) {
		if (pokemon1.fainted || pokemon2.fainted) return false;
		if (pokemon1.side === pokemon2.side) return Math.abs(pokemon1.position - pokemon2.position) === 1;
		return Math.abs(pokemon1.position + pokemon2.position + 1 - pokemon1.side.active.length) <= 1;
	},
	checkAbilities: function (selectedAbilities, defaultAbilities) {
		if (!selectedAbilities.length) return true;
		var selectedAbility = selectedAbilities.pop();
		var isValid = false;
		for (var i = 0; i < defaultAbilities.length; i++) {
			var defaultAbility = defaultAbilities[i];
			if (!defaultAbility) break;
			if (defaultAbility.indexOf(selectedAbility) !== -1) {
				defaultAbilities.splice(i, 1);
				isValid = this.checkAbilities(selectedAbilities, defaultAbilities);
				if (isValid) break;
				defaultAbilities.splice(i, 0, defaultAbility);
			}
		}
		if (!isValid) selectedAbilities.push(selectedAbility);
		return isValid;
	},
	sampleNoReplace: function (list) {
		var length = list.length;
		var index = this.random(length);
		var element = list[index];
		for (var nextIndex = index + 1; nextIndex < length; index += 1, nextIndex += 1) {
			list[index] = list[nextIndex];
		}
		list.pop();
		return element;
	},
	hasMegaEvo: function (template) {
		if (template.otherFormes) {
			var forme = this.getTemplate(template.otherFormes[0]);
			if (forme.requiredItem) {
				var item = this.getItem(forme.requiredItem);
				if (item.megaStone) return true;
			} else if (forme.requiredMove && forme.isMega) {
				return true;
			}
		}
		return false;
	},
	getTeam: function (side, team) {
		var format = side.battle.getFormat();
		if (typeof format.team === 'string' && format.team.substr(0, 6) === 'random') {
			return this[format.team + 'Team'](side);
		} else if (team) {
			return team;
		} else {
			return this.randomTeam(side);
		}
	},
	randomCCTeam: function (side) {
		var team = [];

		var natures = Object.keys(this.data.Natures);
		var items = Object.keys(this.data.Items);

		var hasDexNumber = {};
		var formes = [[], [], [], [], [], []];

		// pick six random pokemon--no repeats, even among formes
		// also need to either normalize for formes or select formes at random
		// unreleased are okay. No CAP for now, but maybe at some later date

		var num;
		for (var i = 0; i < 6; i++) {
			do {
				num = this.random(721) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		for (var id in this.data.Pokedex) {
			if (!(this.data.Pokedex[id].num in hasDexNumber)) continue;
			var template = this.getTemplate(id);
			if (template.learnset && template.species !== 'Pichu-Spiky-eared') {
				formes[hasDexNumber[template.num]].push(template.species);
			}
		}

		for (var i = 0; i < 6; i++) {
			var poke = formes[i][this.random(formes[i].length)];
			var template = this.getTemplate(poke);

			//level balance--calculate directly from stats rather than using some silly lookup table
			var mbstmin = 1307; //sunkern has the lowest modified base stat total, and that total is 807

			var stats = template.baseStats;

			//modified base stat total assumes 31 IVs, 85 EVs in every stat
			var mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			var level = Math.floor(100 * mbstmin / mbst); //initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100); //since damage is roughly proportional to lvl
				mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

				if (mbst >= mbstmin)
					break;
				level++;
			}

			//random gender--already handled by PS?

			//random ability (unreleased hidden are par for the course)
			var abilities = [template.abilities['0']];
			if (template.abilities['1']) {
				abilities.push(template.abilities['1']);
			}
			if (template.abilities['H']) {
				abilities.push(template.abilities['H']);
			}
			var ability = abilities[this.random(abilities.length)];

			//random nature
			var nature = natures[this.random(natures.length)];

			//random item
			var item = '';

			if (template.requiredItem) {
				item = template.requiredItem;
			} else {
				item = items[this.random(items.length)];
			}
			if (this.getItem(item).megaStone) {
				// we'll exclude mega stones for now
				item = items[this.random(items.length)];
			}
			//since we're selecting forme at random, we gotta make sure forme/item combo is correct
			while (poke === 'Arceus' && item.substr(-5) !== 'plate' || poke === 'Giratina' && item === 'griseousorb') {
				item = items[this.random(items.length)];
			}

			//random IVs
			var ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			//random EVs
			var evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			var s = ["hp", "atk", "def", "spa", "spd", "spe"];
			var evpool = 510;
			do {
				var x = s[this.random(s.length)];
				var y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			//random happiness--useless, since return/frustration is currently a "cheat"
			var happiness = this.random(256);

			//random shininess?
			var shiny = !this.random(1024);

			//four random unique moves from movepool. don't worry about "attacking" or "viable"
			var moves;
			var pool = ['struggle'];
			if (poke === 'Smeargle') {
				pool = Object.keys(this.data.Movedex).exclude('struggle', 'chatter', 'magikarpsrevenge');
			} else if (template.learnset) {
				pool = Object.keys(template.learnset);
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = [this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool)];
			}

			team.push({
				name: poke,
				moves: moves,
				ability: ability,
				evs: evs,
				ivs: ivs,
				nature: nature,
				item: item,
				level: level,
				happiness: happiness,
				shiny: shiny
			});
		}

		//console.log(team);
		return team;
	},
	randomHackmonsCCTeam: function (side) {
		var team = [];

		var itemPool = Object.keys(this.data.Items);
		var abilityPool = Object.keys(this.data.Abilities);
		var movePool = Object.keys(this.data.Movedex);
		var naturePool = Object.keys(this.data.Natures);

		var hasDexNumber = {};
		var formes = [[], [], [], [], [], []];

		// pick six random pokemon--no repeats, even among formes
		// also need to either normalize for formes or select formes at random
		// unreleased are okay. No CAP for now, but maybe at some later date

		var num;
		for (var i = 0; i < 6; i++) {
			do {
				num = this.random(721) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		for (var id in this.data.Pokedex) {
			if (!(this.data.Pokedex[id].num in hasDexNumber)) continue;
			var template = this.getTemplate(id);
			if (template.learnset && template.species !== 'Pichu-Spiky-eared') {
				formes[hasDexNumber[template.num]].push(template.species);
			}
		}

		for (var i = 0; i < 6; i++) {
			// Choose forme
			var pokemon = formes[i][this.random(formes[i].length)];
			var template = this.getTemplate(pokemon);

			// Random unique item
			var item = '';
			do {
				item = this.sampleNoReplace(itemPool);
			} while (this.data.Items[item].isNonstandard);

			// Genesect forms are a sprite difference based on its Drives
			if (template.species.substr(0, 9) === 'Genesect-' && item !== toId(template.requiredItem)) pokemon = 'Genesect';

			// Random unique ability
			var ability = '';
			do {
				ability = this.sampleNoReplace(abilityPool);
			} while (this.data.Abilities[ability].isNonstandard);

			// Random unique moves
			var m = [];
			while (true) {
				var moveid = this.sampleNoReplace(movePool);
				if (!this.data.Movedex[moveid].isNonstandard && (moveid === 'hiddenpower' || moveid.substr(0, 11) !== 'hiddenpower')) {
					if (m.push(moveid) >= 4) break;
				}
			}

			// PS overrides your move if you have Struggle in the first slot
			if (m[0] === 'struggle') m.push(m.shift());

			// Random EVs
			var evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			var s = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			var evpool = 510;
			do {
				var x = s[this.random(s.length)];
				var y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			var ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			var nature = naturePool[this.random(naturePool.length)];

			// Level balance
			var mbstmin = 1307;
			var stats = template.baseStats;
			var mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;
			var level = Math.floor(100 * mbstmin / mbst);
			while (level < 100) {
				mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			var happiness = this.random(256);

			// Random shininess
			var shiny = !this.random(1024);

			team.push({
				name: pokemon,
				item: item,
				ability: ability,
				moves: m,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: level,
				happiness: happiness,
				shiny: shiny
			});
		}

		return team;
	},
	randomSet: function (template, slot, noMega) {
		if (slot === undefined) slot = 1;
		var baseTemplate = (template = this.getTemplate(template));
		var name = template.name;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			var stack = 'Template incompatible with random battles: ' + name;
			var fakeErr = {stack: stack};
			require('../crashlogger.js')(fakeErr, 'The randbat set generator');
		}

		// Meloetta-P can be chosen
		if (template.num === 648) {
			name = 'Meloetta';
		}

		// Decide if the Pokemon can mega evolve early, so viable moves for the mega can be generated
		if (!noMega && this.hasMegaEvo(template)) {
			// If there's more than one mega evolution, randomly pick one
			template = this.getTemplate(template.otherFormes[this.random(template.otherFormes.length)]);
		}
		if (template.otherFormes && this.getTemplate(template.otherFormes[0]).isPrimal && this.random(2)) {
			template = this.getTemplate(template.otherFormes[0]);
		}

		var movePool = (template.randomBattleMoves ? template.randomBattleMoves.slice() : Object.keys(template.learnset));
		var moves = [];
		var ability = '';
		var item = '';
		var evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85
		};
		var ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31
		};
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		var hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			hasAbility[template.abilities['H']] = true;
		}
		var availableHP = 0;
		for (var i = 0, len = movePool.length; i < len; i++) {
			if (movePool[i].substr(0, 11) === 'hiddenpower') availableHP++;
		}

		// Moves that heal a fixed amount:
		var RecoveryMove = {
			milkdrink: 1, recover: 1, roost: 1, slackoff: 1, softboiled: 1
		};
		// Moves which drop stats:
		var ContraryMove = {
			leafstorm: 1, overheat: 1, closecombat: 1, superpower: 1, vcreate: 1
		};
		// Moves that boost Attack:
		var PhysicalSetup = {
			bellydrum:1, bulkup:1, coil:1, curse:1, dragondance:1, honeclaws:1, howl:1, poweruppunch:1, shiftgear:1, swordsdance:1
		};
		// Moves which boost Special Attack:
		var SpecialSetup = {
			calmmind:1, chargebeam:1, geomancy:1, nastyplot:1, quiverdance:1, tailglow:1
		};
		// Moves which boost Attack AND Special Attack:
		var MixedSetup = {
			growth:1, workup:1, shellsmash:1
		};
		var SpeedSetup = {
			autotomize:1, agility:1, rockpolish:1
		};
		// These moves can be used even if we aren't setting up to use them:
		var SetupException = {
			dracometeor:1, leafstorm:1, overheat:1,
			extremespeed:1, suckerpunch:1, superpower:1
		};
		var counterAbilities = {
			'Adaptability':1, 'Blaze':1, 'Contrary':1, 'Hustle':1, 'Iron Fist':1,
			'Overgrow':1, 'Skill Link':1, 'Swarm':1, 'Technician':1, 'Torrent':1
		};
		var ateAbilities = {
			'Aerilate':1, 'Pixilate':1, 'Refrigerate':1
		};

		var damagingMoves, damagingMoveIndex, hasMove, counter, setupType, hasStab;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (var k = 0; k < moves.length; k++) {
				if (moves[k].substr(0, 11) === 'hiddenpower') {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moves[k]] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				var moveid = this.sampleNoReplace(movePool);
				if (moveid.substr(0, 11) === 'hiddenpower') {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			damagingMoves = [];
			damagingMoveIndex = {};
			hasStab = false;
			counter = {
				Physical: 0, Special: 0, Status: 0, damage: 0, recovery: 0,
				blaze: 0, overgrow: 0, swarm: 0, torrent: 0,
				adaptability: 0, ate: 0, bite: 0, contrary: 0, hustle: 0,
				ironfist: 0, serenegrace: 0, sheerforce: 0, skilllink: 0, technician: 0,
				inaccurate: 0, priority: 0, recoil: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0, speedsetup: 0
			};
			setupType = '';
			// Iterate through all moves we've chosen so far and keep track of what they do:
			for (var k = 0; k < moves.length; k++) {
				var move = this.getMove(moves[k]);
				var moveid = move.id;
				if (move.damage || move.damageCallback) {
					// Moves that do a set amount of damage:
					counter['damage']++;
					damagingMoves.push(move);
					damagingMoveIndex[moveid] = k;
				} else {
					// Are Physical/Special/Status moves:
					counter[move.category]++;
				}
				// Moves that have a low base power:
				if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
				// Moves that hit multiple times:
				if (move.multihit && move.multihit[1] === 5) counter['skilllink']++;
				// Recoil:
				if (move.recoil) counter['recoil']++;
				// Moves which have a base power, but aren't super-weak like Rapid Spin:
				if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'naturepower') {
					if (hasType[move.type]) {
						counter['adaptability']++;
						// STAB:
						// Certain moves aren't acceptable as a Pokemon's only STAB attack
						if (!(moveid in {bounce:1, fakeout:1, flamecharge:1, quickattack:1, skyattack:1})) hasStab = true;
					}
					if (hasAbility['Protean']) hasStab = true;
					if (move.category === 'Physical') counter['hustle']++;
					if (move.type === 'Fire') counter['blaze']++;
					if (move.type === 'Grass') counter['overgrow']++;
					if (move.type === 'Bug') counter['swarm']++;
					if (move.type === 'Water') counter['torrent']++;
					if (move.type === 'Normal') {
						counter['ate']++;
						if (hasAbility['Refrigerate'] || hasAbility['Pixilate'] || hasAbility['Aerilate']) hasStab = true;
					}
					if (move.flags['bite']) counter['bite']++;
					if (move.flags['punch']) counter['ironfist']++;
					damagingMoves.push(move);
					damagingMoveIndex[moveid] = k;
				}
				// Moves with secondary effects:
				if (move.secondary) {
					counter['sheerforce']++;
					if (move.secondary.chance >= 20) {
						counter['serenegrace']++;
					}
				}
				// Moves with low accuracy:
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter['inaccurate']++;
				// Moves with non-zero priority:
				if (move.priority !== 0) counter['priority']++;

				// Moves that change stats:
				if (RecoveryMove[moveid]) counter['recovery']++;
				if (ContraryMove[moveid]) counter['contrary']++;
				if (PhysicalSetup[moveid]) counter['physicalsetup']++;
				if (SpecialSetup[moveid]) counter['specialsetup']++;
				if (MixedSetup[moveid]) counter['mixedsetup']++;
				if (SpeedSetup[moveid]) counter['speedsetup']++;
			}

			// Choose a setup type:
			if (counter['mixedsetup']) {
				setupType = 'Mixed';
			} else if (counter['specialsetup']) {
				setupType = 'Special';
			} else if (counter['physicalsetup']) {
				setupType = 'Physical';
			}

			// Iterate through the moves again, this time to cull them:
			for (var k = 0; k < moves.length; k++) {
				var moveid = moves[k];
				var move = this.getMove(moveid);
				var rejected = false;
				var isSetup = false;

				switch (moveid) {

				// Not very useful without their supporting moves
				case 'batonpass':
					if (!setupType && !counter['speedsetup'] && !hasMove['cosmicpower'] && !hasMove['substitute'] && !hasMove['wish'] && !hasAbility['Speed Boost']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['protect']) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					break;
				case 'storedpower':
					if (!setupType && !hasMove['cosmicpower']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.Physical + counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish':
					if (counter.Physical + counter.Special < 2 && !setupType && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					if (setupType && hasMove['stormthrow']) rejected = true;
					break;
				case 'defog': case 'pursuit': case 'haze': case 'healingwish': case 'rapidspin': case 'spikes': case 'waterspout':
					if (setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'fakeout':
					if (setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay': case 'nightshade': case 'seismictoss': case 'superfang':
					if (setupType) rejected = true;
					break;
				case 'healbell': case 'trickroom':
					if (!!counter['speedsetup']) rejected = true;
					break;
				case 'memento':
					if (setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'protect':
					if (setupType && (hasAbility['Guts'] || hasAbility['Speed Boost']) && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'stealthrock':
					if (setupType || !!counter['speedsetup'] || hasMove['rest']) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (setupType || counter.Physical + counter.Special < 2) rejected = true;
					if (hasMove['acrobatics'] || hasMove['lightscreen'] || hasMove['reflect'] || hasMove['trickroom'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'uturn':
					if (setupType || !!counter['speedsetup']) rejected = true;
					break;
				case 'voltswitch':
					if (setupType || !!counter['speedsetup'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite':
					if (hasMove['uturn'] && !setupType) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['crunch'] && setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if ((hasMove['crunch'] || hasMove['darkpulse']) && (hasMove['knockoff'] || hasMove['pursuit'])) rejected = true;
					if (!setupType && hasMove['foulplay'] && (hasMove['darkpulse'] || hasMove['pursuit'])) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['outrage'] || hasMove['dragontail']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt'] && !hasMove['raindance']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['thunder'] && hasMove['raindance']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'drainingkiss':
					if (hasMove['dazzlinggleam']) rejected = true;
					break;
				case 'aurasphere': case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if (hasMove['focusblast'] || hasMove['superpower']) rejected = true;
					break;
				case 'closecombat': case 'highjumpkick':
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'focusblast':
					if ((!setupType && hasMove['superpower']) || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'stormthrow':
					if (hasMove['circlethrow'] && (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'superpower':
					if (setupType && (hasMove['drainpunch'] || hasMove['focusblast'])) rejected = true;
					break;
				case 'fierydance': case 'flamethrower':
					if (hasMove['fireblast'] || hasMove['overheat']) rejected = true;
					break;
				case 'fireblast':
					if ((hasMove['flareblitz'] || hasMove['lavaplume']) && !setupType && !counter['speedsetup']) rejected = true;
					break;
				case 'firepunch': case 'sacredfire':
					if (hasMove['flareblitz']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['fireblast'] && (setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'overheat':
					if (hasMove['lavaplume'] || setupType === 'Special') rejected = true;
					break;
				case 'acrobatics': case 'airslash': case 'oblivionwing':
					if (hasMove['bravebird'] || hasMove['hurricane']) rejected = true;
					break;
				case 'phantomforce': case 'shadowforce': case 'shadowsneak':
					if (hasMove['shadowclaw'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['shadowball']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if ((!setupType && hasMove['leafstorm']) || hasMove['petaldance']) rejected = true;
					break;
				case 'leafstorm':
					if (setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'seedbomb': case 'woodhammer':
					if (hasMove['gigadrain'] && setupType !== 'Physical') rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'bodyslam':
					if (hasMove['glare']) rejected = true;
					break;
				case 'explosion':
					if (setupType || hasMove['wish']) rejected = true;
					break;
				case 'hypervoice':
					if (hasMove['naturepower'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (hasStab) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock'] || hasMove['storedpower']) rejected = true;
					break;
				case 'headsmash':
					if (hasMove['stoneedge']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if (hasMove['headsmash'] || hasMove['stoneedge']) rejected = true;
					break;
				case 'flashcannon':
					if (hasMove['ironhead']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['scald'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'raindance':
					if (hasMove['sunnyday'] || (hasMove['rest'] && hasMove['sleeptalk']) || counter.Physical + counter.Special < 2) rejected = true;
					break;
				case 'rest':
					if (!hasMove['sleeptalk'] && movePool.indexOf('sleeptalk') > -1) rejected = true;
					if (hasMove['moonlight'] || hasMove['painsplit'] || hasMove['recover'] || hasMove['synthesis']) rejected = true;
					break;
				case 'roar':
					if (hasMove['dragontail']) rejected = true;
					break;
				case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['wish']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary']) || hasMove['pursuit'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'sunnyday':
					if (hasMove['raindance'] || (hasMove['rest'] && hasMove['sleeptalk']) || counter.Physical + counter.Special < 2) rejected = true;
					break;
				case 'stunspore': case 'thunderwave':
					if (setupType || !!counter['speedsetup']) rejected = true;
					if (hasMove['discharge'] || hasMove['gyroball'] || hasMove['sleeppowder'] || hasMove['spore'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'toxic':
					if (hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['stunspore'] || hasMove['thunderwave'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['lavaplume'] || hasMove['sacredfire'] || hasMove['scald'] || hasMove['spore']) rejected = true;
					break;
				}

				// Increased/decreased priority moves unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				if (move.category === 'Special' && setupType === 'Physical' && !SetupException[move.id]) {
					rejected = true;
				}
				if (move.category === 'Physical' && (setupType === 'Special' || hasMove['acidspray']) && !SetupException[move.id]) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if (setupType && setupType !== 'Mixed' && move.category !== setupType && counter[setupType] < 2) {
					// Mono-attacking with setup and RestTalk is allowed
					if (!isSetup && moveid !== 'rest' && moveid !== 'sleeptalk') rejected = true;
				}

				// Hidden Power isn't good enough
				if (setupType === 'Special' && move.id === 'hiddenpower' && counter['Special'] <= 2 && (!hasMove['shadowball'] || move.type !== 'Fighting')) {
					rejected = true;
				}

				// Remove rejected moves from the move list
				if (rejected && (movePool.length - availableHP || availableHP && (move.id === 'hiddenpower' || !hasMove['hiddenpower']))) {
					moves.splice(k, 1);
					break;
				}

				// Handle Hidden Power IVs
				if (move.id === 'hiddenpower') {
					var HPivs = this.getType(move.type).HPivs;
					for (var iv in HPivs) {
						ivs[iv] = HPivs[iv];
					}
				}
			}
			if (movePool.length && moves.length === 4 && !hasMove['judgment']) {
				// Move post-processing:
				if (damagingMoves.length === 0) {
					// A set shouldn't have no attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (damagingMoves.length === 1) {
					var damagingid = damagingMoves[0].id;
					// Night Shade, Seismic Toss, etc. don't count:
					if (!damagingMoves[0].damage && (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower']))) {
						var replace = false;
						if (damagingid in {counter:1, focuspunch:1, mirrorcoat:1, suckerpunch:1} || (damagingid === 'hiddenpower' && !hasStab)) {
							// Unacceptable as the only attacking move
							replace = true;
						} else {
							if (!hasStab) {
								var damagingType = damagingMoves[0].type;
								if (damagingType === 'Fairy') {
									// Mono-Fairy is acceptable for Psychic types
									if (!hasType['Psychic']) replace = true;
								} else if (damagingType === 'Ice') {
									if (hasType['Normal'] && template.types.length === 1) {
										// Mono-Ice is acceptable for special attacking Normal types that lack Boomburst and Hyper Voice
										if (counter.Physical >= 2 || movePool.indexOf('boomburst') > -1 || movePool.indexOf('hypervoice') > -1) replace = true;
									} else {
										replace = true;
									}
								} else {
									replace = true;
								}
							}
						}
						if (replace) moves.splice(damagingMoveIndex[damagingid], 1);
					}
				} else if (damagingMoves.length === 2) {
					// If you have two attacks, neither is STAB, and the combo isn't Electric/Ice or Fighting/Ghost, reject one of them at random.
					var type1 = damagingMoves[0].type, type2 = damagingMoves[1].type;
					var typeCombo = [type1, type2].sort().join('/');
					if (!hasStab && typeCombo !== 'Electric/Ice' && typeCombo !== 'Fighting/Ghost') {
						var rejectableMoves = [];
						var baseDiff = movePool.length - availableHP;
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[0].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[0].id]);
						}
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[1].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[1].id]);
						}
						if (rejectableMoves.length) {
							moves.splice(rejectableMoves[this.random(rejectableMoves.length)], 1);
						}
					}
				} else if (!hasStab) {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					var rejectableMoves = [];
					var baseDiff = movePool.length - availableHP;
					for (var l = 0; l < damagingMoves.length; l++) {
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[l].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[l].id]);
						}
					}
					if (rejectableMoves.length) {
						moves.splice(rejectableMoves[this.random(rejectableMoves.length)], 1);
					}
				}
			}
		} while (moves.length < 4 && movePool.length);

		// Any moveset modification goes here:
		// moves[0] = 'safeguard';
		if (template.requiredItem && template.requiredItem.slice(-5) === 'Drive' && !hasMove['technoblast']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'technoblast';
			hasMove['technoblast'] = true;
		}
		if (template.id === 'altariamega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'return';
			hasMove['return'] = true;
		}
		if (template.id === 'gardevoirmega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'hypervoice';
			hasMove['hypervoice'] = true;
		}
		if (template.id === 'salamencemega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'return';
			hasMove['return'] = true;
		}
		if (template.id === 'sylveon' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'hypervoice';
			hasMove['hypervoice'] = true;
		}
		if (template.requiredMove && !hasMove[toId(template.requiredMove)]) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = toId(template.requiredMove);
			hasMove[toId(template.requiredMove)] = true;
		}

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {
				hp: 31,
				atk: 31,
				def: 31,
				spa: 31,
				spd: 31,
				spe: 31
			};
		}

		var abilities = Object.values(baseTemplate.abilities).sort(function (a, b) {
			return this.getAbility(b).rating - this.getAbility(a).rating;
		}.bind(this));
		var ability0 = this.getAbility(abilities[0]);
		var ability1 = this.getAbility(abilities[1]);
		var ability2 = this.getAbility(abilities[2]);
		var ability = ability0.name;
		if (abilities[1]) {
			if (abilities[2] && ability2.rating === ability1.rating) {
				if (this.random(2)) ability1 = ability2;
			}
			if (ability0.rating <= ability1.rating) {
				if (this.random(2)) ability = ability1.name;
			} else if (ability0.rating - 0.6 <= ability1.rating) {
				if (!this.random(3)) ability = ability1.name;
			}

			var rejectAbility = false;
			if (ability in counterAbilities) {
				// Adaptability, Blaze, Contrary, Hustle, Iron Fist, Overgrow, Skill Link, Swarm, Technician, Torrent
				rejectAbility = !counter[toId(ability)];
			} else if (ability in ateAbilities) {
				rejectAbility = !counter['ate'];
			} else if (ability === 'Chlorophyll') {
				rejectAbility = !hasMove['sunnyday'];
			} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
				rejectAbility = !counter['inaccurate'];
			} else if (ability === 'Defiant' || ability === 'Moxie') {
				rejectAbility = !counter['Physical'] && !hasMove['batonpass'];
			} else if (ability === 'Gluttony') {
				rejectAbility = true;
			} else if (ability === 'Limber') {
				rejectAbility = template.types.indexOf('Electric') >= 0;
			} else if (ability === 'Lightning Rod') {
				rejectAbility = template.types.indexOf('Ground') >= 0;
			} else if (ability === 'Moody') {
				rejectAbility = template.id !== 'bidoof';
			} else if (ability === 'Poison Heal') {
				rejectAbility = abilities.indexOf('Technician') > -1 && !!counter['technician'];
			} else if (ability === 'Prankster') {
				rejectAbility = !counter['Status'];
			} else if (ability === 'Reckless' || ability === 'Rock Head') {
				rejectAbility = !counter['recoil'];
			} else if (ability === 'Serene Grace') {
				rejectAbility = !counter['serenegrace'] || template.id === 'chansey' || template.id === 'blissey';
			} else if (ability === 'Sheer Force') {
				rejectAbility = !counter['sheerforce'];
			} else if (ability === 'Simple') {
				rejectAbility = !setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
			} else if (ability === 'Strong Jaw') {
				rejectAbility = !counter['bite'];
			} else if (ability === 'Sturdy') {
				rejectAbility = !!counter['recoil'] && !counter['recovery'];
			} else if (ability === 'Swift Swim') {
				rejectAbility = !hasMove['raindance'];
			} else if (ability === 'Unburden') {
				rejectAbility = template.baseStats.spe > 120;
			}

			if (rejectAbility) {
				if (ability === ability1.name) { // or not
					ability = ability0.name;
				} else if (ability1.rating > 1) { // only switch if the alternative doesn't suck
					ability = ability1.name;
				}
			}
			if (abilities.indexOf('Chlorophyll') > -1 && ability !== 'Solar Power' && hasMove['sunnyday']) {
				ability = 'Chlorophyll';
			}
			if (abilities.indexOf('Guts') > -1 && ability !== 'Quick Feet' && hasMove['facade']) {
				ability = 'Guts';
			}
			if (abilities.indexOf('Swift Swim') > -1 && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.indexOf('Unburden') > -1 && hasMove['acrobatics']) {
				ability = 'Unburden';
			}
			if (template.id === 'ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				// Might as well give it Pickup just in case
				ability = 'Pickup';
			} else if (template.id === 'aurorus' && ability === 'Snow Warning' && hasMove['hypervoice']) {
				for (var i = 0; i < moves.length; i++) {
					if (moves[i] === 'hypervoice') {
						moves[i] = 'blizzard';
						counter['ate'] = 0;
						break;
					}
				}
			} else if (template.id === 'combee') {
				// Combee always gets Hustle but its only physical move is Endeavor, which loses accuracy
				ability = 'Honey Gather';
			} else if (template.id === 'lopunny' && hasMove['switcheroo'] && this.random(3)) {
				ability = 'Klutz';
			} else if (template.id === 'mawilemega') {
				// Mega Mawile only needs Intimidate for a starting ability
				ability = 'Intimidate';
			} else if (template.id === 'sigilyph') {
				ability = 'Magic Guard';
			} else if (template.id === 'unfezant') {
				ability = 'Super Luck';
			}
		}

		if (hasMove['gyroball']) {
			ivs.spe = 0;
			evs.atk += evs.spe;
			evs.spe = 0;
		} else if (hasMove['trickroom']) {
			ivs.spe = 0;
			evs.hp += evs.spe;
			evs.spe = 0;
		}

		item = 'Leftovers';
		if (template.requiredItem) {
			item = template.requiredItem;
		} else if (hasMove['magikarpsrevenge']) {
			// PoTD Magikarp
			item = 'Choice Band';
		} else if (template.species === 'Rotom-Fan') {
			// This is just to amuse Zarel
			item = 'Air Balloon';

		// First, the extra high-priority items
		} else if (template.species === 'Clamperl' && !hasMove['shellsmash']) {
			item = 'DeepSeaTooth';
		} else if (template.species === 'Cubone' || template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Shedinja') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (ability === 'Klutz' && hasMove['switcheroo']) {
			// To perma-taunt a Pokemon by giving it Assault Vest
			item = 'Assault Vest';
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (ability === 'Magic Guard' && hasMove['psychoshift']) {
			item = 'Flame Orb';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			var randomNum = this.random(2);
			if (counter.Physical >= 3 && (template.baseStats.spe >= 95 || randomNum)) {
				item = 'Choice Band';
			} else if (counter.Special >= 3 && (template.baseStats.spe >= 95 || randomNum)) {
				item = 'Choice Specs';
			} else {
				item = 'Choice Scarf';
			}
		} else if (template.evos.length) {
			item = 'Eviolite';
		} else if (hasMove['shellsmash']) {
			item = 'White Herb';
		} else if (ability === 'Magic Guard' || ability === 'Sheer Force') {
			item = 'Life Orb';
		} else if (hasMove['bellydrum']) {
			item = 'Sitrus Berry';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost' || hasMove['facade']) {
			item = 'Toxic Orb';
		} else if (ability === 'Harvest') {
			item = hasMove['rest'] ? 'Lum Berry' : 'Sitrus Berry';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		} else if (hasMove['raindance']) {
			item = 'Damp Rock';
		} else if (hasMove['sandstorm']) {
			item = 'Smooth Rock';
		} else if (hasMove['sunnyday']) {
			item = 'Heat Rock';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if (ability === 'Unburden') {
			if (hasMove['fakeout']) {
				item = 'Normal Gem';
			} else if (hasMove['dracometeor'] || hasMove['leafstorm'] || hasMove['overheat']) {
				item = 'White Herb';
			} else if (hasMove['substitute'] || setupType) {
				item = 'Sitrus Berry';
			} else {
				item = 'Red Card';
				for (var m in moves) {
					var move = this.getMove(moves[m]);
					if (hasType[move.type] && move.basePower >= 90) {
						item = move.type + ' Gem';
						break;
					}
				}
			}

		// Medium priority
		} else if (ability === 'Guts') {
			item = hasMove['drainpunch'] ? 'Flame Orb' : 'Toxic Orb';
		} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch']) {
			item = template.baseStats.spe > 82 && template.baseStats.spe < 109 && !counter['priority'] && this.random(3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['fierydance']) {
			item = template.baseStats.spe > 82 && template.baseStats.spe < 109 && !counter['priority'] && this.random(3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (hasMove['eruption'] || hasMove['waterspout']) {
			item = counter.Status <= 1 ? 'Expert Belt' : 'Leftovers';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (ability === 'Speed Boost' && hasMove['protect'] && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (hasMove['outrage'] && (setupType || ability === 'Multiscale')) {
			item = 'Lum Berry';
		} else if (ability === 'Moody' || hasMove['clearsmog'] || hasMove['detect'] || hasMove['protect'] || hasMove['substitute']) {
			item = 'Leftovers';
		} else if (hasMove['lightscreen'] || hasMove['reflect']) {
			item = 'Light Clay';
		} else if (ability === 'Iron Barbs' || ability === 'Rough Skin') {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && (template.baseStats.def + template.baseStats.spd > 189 || hasMove['rapidspin'])) {
			item = 'Assault Vest';
		} else if (counter.Physical + counter.Special >= 4) {
			item = (!!counter['ate'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.Physical + counter.Special >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if ((counter.Physical + counter.Special >= 3) && ability !== 'Sturdy' && !hasMove['dragontail']) {
			item = (setupType || !!counter['speedsetup'] || hasMove['trickroom'] || !!counter['recovery']) ? 'Life Orb' : 'Leftovers';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 285) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && ability !== 'Solid Rock' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (counter.Status <= 1 && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else {
			item = 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		var levelScale = {
			LC: 92,
			'LC Uber': 92,
			NFE: 90,
			PU: 88,
			BL4: 88,
			NU: 86,
			BL3: 84,
			RU: 82,
			BL2: 80,
			UU: 78,
			BL: 76,
			OU: 74,
			CAP: 74,
			Unreleased: 74,
			Uber: 70,
			AG: 68
		};
		var customScale = {
			// Between OU and Uber
			Aegislash: 72, Blaziken: 72, Genesect: 72, 'Genesect-Burn': 72, 'Genesect-Chill': 72, 'Genesect-Douse': 72, 'Genesect-Shock': 72, Greninja: 72, 'Kangaskhan-Mega': 72, 'Lucario-Mega': 72, 'Mawile-Mega': 72,

			// Not holding mega stone
			Altaria: 84, Banette: 86, Beedrill: 86, Charizard: 84, Gardevoir: 80, Heracross: 78, Lopunny: 86, Manectric: 78, Metagross: 78, Pinsir: 84, Sableye: 78, Venusaur: 80,

			// Holistic judgment
			Articuno: 82, Ninetales: 84, Politoed: 84, Regigigas: 86, "Rotom-Fan": 88, Scyther: 84, Sigilyph: 80, Unown: 90
		};
		var level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		if (template.name === 'Magikarp' && hasMove['magikarpsrevenge']) level = 90;
		if (template.name === 'Xerneas' && hasMove['geomancy']) level = 68;

		// Prepare HP for Belly Drum.
		if (hasMove['bellydrum'] && item === 'Sitrus Berry') {
			var hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hp % 2 > 0) {
				evs.hp -= 4;
				evs.atk += 4;
			}
		} else {
			// Prepare HP for double Stealth Rock weaknesses. Those are mutually exclusive with Belly Drum HP check.
			// First, 25% damage.
			if (this.getEffectiveness('Rock', template) === 1) {
				var hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				if (hp % 4 === 0) {
					evs.hp -= 4;
					if (counter.Physical > counter.Special) {
						evs.atk += 4;
					} else {
						evs.spa += 4;
					}
				}
			}

			// Then, prepare it for 50% damage.
			if (this.getEffectiveness('Rock', template) === 2) {
				var hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				if (hp % 2 === 0) {
					evs.hp -= 4;
					if (counter.Physical > counter.Special) {
						evs.atk += 4;
					} else {
						evs.spa += 4;
					}
				}
			}
		}

		return {
			name: name,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: !this.random(1024)
		};
	},
	randomTeam: function (side) {
		var pokemonLeft = 0;
		var pokemon = [];

		var excludedTiers = {'LC':1, 'LC Uber':1, 'NFE':1};
		var allowedNFE = {'Chansey':1, 'Doublade':1, 'Pikachu':1, 'Porygon2':1, 'Scyther':1};

		var pokemonPool = [];
		for (var id in this.data.FormatsData) {
			var template = this.getTemplate(id);
			if (!excludedTiers[template.tier] && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		var potd;
		if (Config.potd && 'Rule:potd' in this.getBanlistTable(this.getFormat())) {
			potd = this.getTemplate(Config.potd);
		}

		var typeCount = {};
		var typeComboCount = {};
		var baseFormes = {};
		var uberCount = 0;
		var puCount = 0;
		var megaCount = 0;

		while (pokemonPool.length && pokemonLeft < 6) {
			var template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Not available on ORAS
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE[template.species]) continue;

			var tier = template.tier;
			switch (tier) {
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.random(18) >= 1) continue;
				break;
			case 'Basculin':
				if (this.random(2) >= 1) continue;
				break;
			case 'Genesect':
				if (this.random(5) >= 1) continue;
				break;
			case 'Gourgeist':
				if (this.random(4) >= 1) continue;
				break;
			case 'Meloetta':
				if (this.random(2) >= 1) continue;
				break;
			case 'Pikachu':
				// Cosplay Pikachu formes have 20% the normal rate (1/30 the normal rate each)
				if (template.species !== 'Pikachu' && this.random(30) >= 1) continue;
			}

			// Limit 2 of any type
			var types = template.types;
			var skip = false;
			for (var t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd && potd.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.species === 'Magikarp') {
						template.randomBattleMoves = ['bounce', 'flail', 'splash', 'magikarpsrevenge'];
					} else if (template.species === 'Delibird') {
						template.randomBattleMoves = ['present', 'bestow'];
					}
				} else if (template.species === potd.species) {
					continue; // No, thanks, I've already got one
				}
			}

			var set = this.randomSet(template, pokemon.length, megaCount);

			// Illusion shouldn't be on the last pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Limit 1 of any type combination
			var typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Limit the number of Megas to one
			var forme = template.otherFormes && this.getTemplate(template.otherFormes[0]);
			var isMegaSet = this.getItem(set.item).megaStone || (forme && forme.isMega && forme.requiredMove && set.moves.indexOf(toId(forme.requiredMove)) >= 0);
			if (isMegaSet && megaCount > 0) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			pokemonLeft++;

			// Increment type counters
			for (var t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Increment mega and base species counters
			if (isMegaSet) megaCount++;
			baseFormes[template.baseSpecies] = 1;
		}
		return pokemon;
	},
	randomDoublesTeam: function (side) {
		var pokemonLeft = 0;
		var pokemon = [];

		var excludedTiers = {'LC':1, 'LC Uber':1, 'NFE':1};
		var allowedNFE = {'Chansey':1, 'Doublade':1, 'Pikachu':1, 'Porygon2':1, 'Scyther':1};

		var pokemonPool = [];
		for (var id in this.data.FormatsData) {
			var template = this.getTemplate(id);
			if (!excludedTiers[template.tier] && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		var potd;
		if (Config.potd && 'Rule:potd' in this.getBanlistTable(this.getFormat())) {
			potd = this.getTemplate(Config.potd);
		}

		var typeCount = {};
		var typeComboCount = {};
		var baseFormes = {};
		var uberCount = 0;
		var puCount = 0;
		var megaCount = 0;

		while (pokemonPool.length && pokemonLeft < 6) {
			var template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Not available on ORAS
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE[template.species]) continue;

			var tier = template.tier;
			switch (tier) {
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.random(18) >= 1) continue;
				break;
			case 'Basculin':
				if (this.random(2) >= 1) continue;
				break;
			case 'Genesect':
				if (this.random(5) >= 1) continue;
				break;
			case 'Gourgeist':
				if (this.random(4) >= 1) continue;
				break;
			case 'Meloetta':
				if (this.random(2) >= 1) continue;
				break;
			case 'Pikachu':
				// Cosplay Pikachu formes have 20% the normal rate (1/30 the normal rate each)
				if (template.species !== 'Pikachu' && this.random(30) >= 1) continue;
			}

			// Limit 2 of any type
			var types = template.types;
			var skip = false;
			for (var t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd && potd.exists) {
				// The Pokemon of the Day belongs in slot 3
				if (pokemon.length === 2) {
					template = potd;
				} else if (template.species === potd.species) {
					continue; // No, thanks, I've already got one
				}
			}

			var set = this.randomDoublesSet(template, pokemon.length, megaCount);

			// Illusion shouldn't be on the last pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Limit 1 of any type combination
			var typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Limit the number of Megas to one
			var forme = template.otherFormes && this.getTemplate(template.otherFormes[0]);
			var isMegaSet = this.getItem(set.item).megaStone || (forme && forme.isMega && forme.requiredMove && set.moves.indexOf(toId(forme.requiredMove)) >= 0);
			if (isMegaSet && megaCount > 0) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			pokemonLeft++;

			// Increment type counters
			for (var t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Increment mega and base species counters
			if (isMegaSet) megaCount++;
			baseFormes[template.baseSpecies] = 1;
		}
		return pokemon;
	},
	randomDoublesSet: function (template, slot, noMega) {
		var baseTemplate = (template = this.getTemplate(template));
		var name = template.name;

		if (!template.exists || (!template.randomDoubleBattleMoves && !template.randomBattleMoves && !template.learnset)) {
			template = this.getTemplate('unown');

			var stack = 'Template incompatible with random battles: ' + name;
			var fakeErr = {stack: stack};
			require('../crashlogger.js')(fakeErr, 'The doubles randbat set generator');
		}

		// Decide if the Pokemon can mega evolve early, so viable moves for the mega can be generated
		if (!noMega && this.hasMegaEvo(template)) {
			// If there's more than one mega evolution, randomly pick one
			template = this.getTemplate(template.otherFormes[this.random(template.otherFormes.length)]);
		}
		if (template.otherFormes && this.getTemplate(template.otherFormes[0]).isPrimal && this.random(2)) {
			template = this.getTemplate(template.otherFormes[0]);
		}

		var movePool = (template.randomDoubleBattleMoves || template.randomBattleMoves);
		movePool = movePool ? movePool.slice() : Object.keys(template.learnset);

		var moves = [];
		var ability = '';
		var item = '';
		var evs = {
			hp: 0,
			atk: 0,
			def: 0,
			spa: 0,
			spd: 0,
			spe: 0
		};
		var ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31
		};
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		var hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			hasAbility[template.abilities['H']] = true;
		}
		var availableHP = 0;
		for (var i = 0, len = movePool.length; i < len; i++) {
			if (movePool[i].substr(0, 11) === 'hiddenpower') availableHP++;
		}

		// Moves which drop stats:
		var ContraryMove = {
			leafstorm: 1, overheat: 1, closecombat: 1, superpower: 1, vcreate: 1
		};
		// Moves that boost Attack:
		var PhysicalSetup = {
			swordsdance:1, dragondance:1, coil:1, bulkup:1, curse:1, bellydrum:1, shiftgear:1, honeclaws:1, howl:1
		};
		// Moves which boost Special Attack:
		var SpecialSetup = {
			nastyplot:1, tailglow:1, quiverdance:1, calmmind:1, chargebeam:1, geomancy:1
		};
		// Moves which boost Attack AND Special Attack:
		var MixedSetup = {
			growth:1, workup:1, shellsmash:1
		};
		// These moves can be used even if we aren't setting up to use them:
		var SetupException = {
			dracometeor:1, leafstorm:1, overheat:1,
			extremespeed:1, suckerpunch:1, superpower:1
		};
		var counterAbilities = {
			'Blaze':1, 'Overgrow':1, 'Swarm':1, 'Torrent':1, 'Contrary':1,
			'Technician':1, 'Skill Link':1, 'Iron Fist':1, 'Adaptability':1, 'Hustle':1
		};
		// -ate Abilities
		var ateAbilities = {
			'Aerilate':1, 'Pixilate':1, 'Refrigerate':1
		};

		var damagingMoves, damagingMoveIndex, hasMove, counter, setupType, hasStab;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (var k = 0; k < moves.length; k++) {
				if (moves[k].substr(0, 11) === 'hiddenpower') {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moves[k]] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				var moveid = toId(this.sampleNoReplace(movePool));
				if (moveid.substr(0, 11) === 'hiddenpower') {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			damagingMoves = [];
			damagingMoveIndex = {};
			hasStab = false;
			counter = {
				Physical: 0, Special: 0, Status: 0, damage: 0,
				technician: 0, skilllink: 0, contrary: 0, sheerforce: 0, ironfist: 0, adaptability: 0, hustle: 0,
				blaze: 0, overgrow: 0, swarm: 0, torrent: 0, serenegrace: 0, ate: 0, bite: 0,
				recoil: 0, inaccurate: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0
			};
			setupType = '';
			// Iterate through all moves we've chosen so far and keep track of what they do:
			for (var k = 0; k < moves.length; k++) {
				var move = this.getMove(moves[k]);
				var moveid = move.id;
				if (move.damage || move.damageCallback) {
					// Moves that do a set amount of damage:
					counter['damage']++;
					damagingMoves.push(move);
					damagingMoveIndex[moveid] = k;
				} else {
					// Are Physical/Special/Status moves:
					counter[move.category]++;
				}
				// Moves that have a low base power:
				if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
				// Moves that hit multiple times:
				if (move.multihit && move.multihit[1] === 5) counter['skilllink']++;
				// Recoil:
				if (move.recoil) counter['recoil']++;
				// Moves which have a base power and aren't super-weak like Rapid Spin:
				if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'naturepower') {
					if (hasType[move.type]) {
						counter['adaptability']++;
						// STAB:
						// Bounce, Flame Charge, Sky Drop aren't considered STABs.
						// If they're in the Pokémon's movepool and are STAB, consider the Pokémon not to have that type as a STAB.
						if (moveid !== 'bounce' && moveid !== 'flamecharge' && moveid !== 'skydrop') hasStab = true;
					}
					if (hasAbility['Protean']) hasStab = true;
					if (move.category === 'Physical') counter['hustle']++;
					if (move.type === 'Fire') counter['blaze']++;
					if (move.type === 'Grass') counter['overgrow']++;
					if (move.type === 'Bug') counter['swarm']++;
					if (move.type === 'Water') counter['torrent']++;
					if (move.type === 'Normal') {
						counter['ate']++;
						if (hasAbility['Refrigerate'] || hasAbility['Pixilate'] || hasAbility['Aerilate']) hasStab = true;
					}
					if (move.flags['punch']) counter['ironfist']++;
					if (move.flags['bite']) counter['bite']++;
					damagingMoves.push(move);
					damagingMoveIndex[moveid] = k;
				}
				// Moves with secondary effects:
				if (move.secondary) {
					counter['sheerforce']++;
					if (move.secondary.chance >= 20) {
						counter['serenegrace']++;
					}
				}
				// Moves with low accuracy:
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) {
					counter['inaccurate']++;
				}
				if (ContraryMove[moveid]) counter['contrary']++;
				if (PhysicalSetup[moveid]) counter['physicalsetup']++;
				if (SpecialSetup[moveid]) counter['specialsetup']++;
				if (MixedSetup[moveid]) counter['mixedsetup']++;
			}

			// Choose a setup type:
			if (counter['mixedsetup']) {
				setupType = 'Mixed';
			} else if (counter['specialsetup']) {
				setupType = 'Special';
			} else if (counter['physicalsetup']) {
				setupType = 'Physical';
			}

			// Iterate through the moves again, this time to cull them:
			for (var k = 0; k < moves.length; k++) {
				var moveid = moves[k];
				var move = this.getMove(moveid);
				var rejected = false;
				var isSetup = false;

				switch (moveid) {
				// not very useful without their supporting moves
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					break;
				case 'endure':
					if (!hasMove['flail'] && !hasMove['endeavor'] && !hasMove['reversal']) rejected = true;
					break;
				case 'focuspunch':
					if (hasMove['sleeptalk'] || !hasMove['substitute']) rejected = true;
					break;
				case 'storedpower':
					if (!hasMove['cosmicpower'] && !setupType) rejected = true;
					break;
				case 'batonpass':
					if (!setupType && !hasMove['substitute'] && !hasMove['cosmicpower'] && !counter['speedsetup'] && !hasAbility['Speed Boost']) rejected = true;
					break;

				// we only need to set up once
				case 'swordsdance': case 'dragondance': case 'coil': case 'curse': case 'bulkup': case 'bellydrum':
					if (counter.Physical < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'nastyplot': case 'tailglow': case 'quiverdance': case 'calmmind': case 'geomancy':
					if (counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'shellsmash': case 'growth': case 'workup':
					if (counter.Physical + counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					isSetup = true;
					break;

				// bad after setup
				case 'seismictoss': case 'nightshade': case 'superfang':
					if (setupType) rejected = true;
					break;
				case 'rapidspin': case 'perishsong': case 'magiccoat': case 'spikes':
					if (setupType) rejected = true;
					break;
				case 'uturn': case 'voltswitch':
					if (setupType || hasMove['agility'] || hasMove['rockpolish'] || hasMove['magnetrise']) rejected = true;
					break;
				case 'relicsong':
					if (setupType) rejected = true;
					break;
				case 'pursuit': case 'protect': case 'haze': case 'stealthrock':
					if (setupType || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'trick': case 'switcheroo':
					if (setupType || counter.Physical + counter.Special < 2) rejected = true;
					if ((hasMove['rest'] && hasMove['sleeptalk']) || hasMove['trickroom'] || hasMove['reflect'] || hasMove['lightscreen'] || hasMove['acrobatics']) rejected = true;
					break;
				case 'dragontail': case 'circlethrow':
					if (hasMove['agility'] || hasMove['rockpolish']) rejected = true;
					if (hasMove['whirlwind'] || hasMove['roar'] || hasMove['encore']) rejected = true;
					break;

				// bit redundant to have both
				// Attacks:
				case 'flamethrower': case 'fierydance':
					if (hasMove['heatwave'] || hasMove['overheat'] || hasMove['fireblast'] || hasMove['blueflare']) rejected = true;
					break;
				case 'overheat':
					if (setupType === 'Special' || hasMove['fireblast']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'surf':
					if (hasMove['scald'] || hasMove['hydropump'] || hasMove['muddywater']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['scald'] || hasMove['muddywater']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['aquatail']) rejected = true;
					break;
				case 'airslash':
					if (hasMove['hurricane']) rejected = true;
					break;
				case 'acrobatics': case 'pluck': case 'drillpeck':
					if (hasMove['bravebird']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasMove['sunnyday'] && !hasAbility['Drought']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if ((!setupType && hasMove['leafstorm']) || hasMove['petaldance']) rejected = true;
					break;
				case 'leafstorm':
					if (setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'seedbomb': case 'woodhammer':
					if (hasMove['gigadrain']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['sunnyday']) rejected = true;
					break;
				case 'firepunch':
					if (hasMove['flareblitz']) rejected = true;
					break;
				case 'crosschop': case 'highjumpkick':
					if (hasMove['closecombat']) rejected = true;
					break;
				case 'drainpunch':
					if (hasMove['closecombat'] || hasMove['crosschop']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'thunderbolt': case 'electroweb':
					if (hasMove['discharge']) rejected = true;
					break;
				case 'stoneedge':
					if (hasMove['rockslide'] || hasMove['headsmash'] || hasMove['rockblast']) rejected = true;
					break;
				case 'headsmash':
					if (hasMove['rockslide']) rejected = true;
					break;
				case 'bonemerang': case 'earthpower':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dragonclaw'] || hasMove['dragontail']) rejected = true;
					break;
				case 'ancientpower':
					if (hasMove['paleowave']) rejected = true;
					break;
				case 'dragonpulse':
					if (hasMove['dracometeor']) rejected = true;
					break;
				case 'moonblast':
					if (hasMove['dazzlinggleam']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['doubleedge'] || hasMove['tailslap'] || hasMove['doublehit']) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock']) rejected = true;
					break;
				case 'fusionbolt':
					if (setupType && hasMove['boltstrike']) rejected = true;
					break;
				case 'boltstrike':
					if (!setupType && hasMove['fusionbolt']) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['crunch'] && setupType !== 'Special') rejected = true;
					break;
				case 'hiddenpowerice':
					if (hasMove['icywind']) rejected = true;
					break;
				case 'quickattack':
					if (hasMove['feint']) rejected = true;
					break;
				case 'wideguard':
					if (hasMove['protect']) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;

				// Status:
				case 'rest':
					if (hasMove['painsplit'] || hasMove['wish'] || hasMove['recover'] || hasMove['moonlight'] || hasMove['synthesis']) rejected = true;
					break;
				case 'softboiled': case 'roost':
					if (hasMove['wish'] || hasMove['recover']) rejected = true;
					break;
				case 'perishsong':
					if (hasMove['roar'] || hasMove['whirlwind'] || hasMove['haze']) rejected = true;
					break;
				case 'roar':
					// Whirlwind outclasses Roar because Soundproof
					if (hasMove['whirlwind'] || hasMove['dragontail'] || hasMove['haze'] || hasMove['circlethrow']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['uturn'] || hasMove['voltswitch'] || hasMove['pursuit']) rejected = true;
					break;
				case 'fakeout':
					if (hasMove['trick'] || hasMove['switcheroo'] || ability === 'Sheer Force')  rejected = true;
					break;
				case 'feint':
					if (hasMove['fakeout']) rejected = true;
					break;
				case 'encore':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['whirlwind'] || hasMove['dragontail'] || hasMove['roar'] || hasMove['circlethrow']) rejected = true;
					break;
				case 'suckerpunch':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'cottonguard':
					if (hasMove['reflect']) rejected = true;
					break;
				case 'lightscreen':
					if (hasMove['calmmind']) rejected = true;
					break;
				case 'rockpolish': case 'agility': case 'autotomize':
					if (!setupType && !hasMove['batonpass'] && hasMove['thunderwave']) rejected = true;
					if ((hasMove['stealthrock'] || hasMove['spikes'] || hasMove['toxicspikes']) && !hasMove['batonpass']) rejected = true;
					break;
				case 'thunderwave':
					if (setupType && (hasMove['rockpolish'] || hasMove['agility'])) rejected = true;
					if (hasMove['discharge'] || hasMove['trickroom']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['yawn'] || hasMove['spore'] || hasMove['sleeppowder']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['willowisp']) rejected = true;
					break;
				case 'trickroom':
					if (hasMove['rockpolish'] || hasMove['agility']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald'] || hasMove['yawn'] || hasMove['spore'] || hasMove['sleeppowder']) rejected = true;
					break;
				case 'toxic':
					if (hasMove['thunderwave'] || hasMove['willowisp'] || hasMove['scald'] || hasMove['yawn'] || hasMove['spore'] || hasMove['sleeppowder']) rejected = true;
					break;
				}

				// Increased/decreased priority moves unneeded with moves that boost only speed
				if (move.priority !== 0 && (hasMove['rockpolish'] || hasMove['agility'])) {
					rejected = true;
				}

				if (move.category === 'Special' && setupType === 'Physical' && !SetupException[move.id]) {
					rejected = true;
				}
				if (move.category === 'Physical' && (setupType === 'Special' || hasMove['acidspray']) && !SetupException[move.id]) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if (setupType === 'Physical' && move.category !== 'Physical' && counter['Physical'] < 2) {
					rejected = true;
				}
				if (setupType === 'Special' && move.category !== 'Special' && counter['Special'] < 2) {
					rejected = true;
				}

				// Hidden Power isn't good enough
				if (setupType === 'Special' && move.id === 'hiddenpower' && counter['Special'] <= 2 && (!hasMove['shadowball'] || move.type !== 'Fighting')) {
					rejected = true;
				}

				// Remove rejected moves from the move list.
				if (rejected && (movePool.length - availableHP || availableHP && (move.id === 'hiddenpower' || !hasMove['hiddenpower']))) {
					moves.splice(k, 1);
					break;
				}

				// Handle HP IVs
				if (move.id === 'hiddenpower') {
					var HPivs = this.getType(move.type).HPivs;
					for (var iv in HPivs) {
						ivs[iv] = HPivs[iv];
					}
				}
			}
			if (movePool.length && moves.length === 4 && !hasMove['judgment']) {
				// Move post-processing:
				if (damagingMoves.length === 0) {
					// A set shouldn't have no attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (damagingMoves.length === 1) {
					var damagingid = damagingMoves[0].id;
					// Night Shade, Seismic Toss, etc. don't count:
					if (!damagingMoves[0].damage && (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower']))) {
						var replace = false;
						if (damagingid in {counter:1, focuspunch:1, mirrorcoat:1, suckerpunch:1} || (damagingid === 'hiddenpower' && !hasStab)) {
							// Unacceptable as the only attacking move
							replace = true;
						} else {
							if (!hasStab) {
								var damagingType = damagingMoves[0].type;
								if (damagingType === 'Fairy') {
									// Mono-Fairy is acceptable for Psychic types
									if (!hasType['Psychic']) replace = true;
								} else if (damagingType === 'Ice') {
									if (hasType['Normal'] && template.types.length === 1) {
										// Mono-Ice is acceptable for special attacking Normal types that lack Boomburst and Hyper Voice
										if (counter.Physical >= 2 || movePool.indexOf('boomburst') > -1 || movePool.indexOf('hypervoice') > -1) replace = true;
									} else {
										replace = true;
									}
								} else {
									replace = true;
								}
							}
						}
						if (replace) moves.splice(damagingMoveIndex[damagingid], 1);
					}
				} else if (damagingMoves.length === 2) {
					// If you have two attacks, neither is STAB, and the combo isn't Ice/Electric or Ghost/Fighting, reject one of them at random.
					var type1 = damagingMoves[0].type, type2 = damagingMoves[1].type;
					var typeCombo = [type1, type2].sort().join('/');
					if (!hasStab && typeCombo !== 'Electric/Ice' && typeCombo !== 'Fighting/Ghost') {
						var rejectableMoves = [];
						var baseDiff = movePool.length - availableHP;
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[0].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[0].id]);
						}
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[1].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[1].id]);
						}
						if (rejectableMoves.length) {
							moves.splice(rejectableMoves[this.random(rejectableMoves.length)], 1);
						}
					}
				} else if (!hasStab) {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					var rejectableMoves = [];
					var baseDiff = movePool.length - availableHP;
					for (var l = 0; l < damagingMoves.length; l++) {
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || damagingMoves[l].id === 'hiddenpower')) {
							rejectableMoves.push(damagingMoveIndex[damagingMoves[l].id]);
						}
					}
					if (rejectableMoves.length) {
						moves.splice(rejectableMoves[this.random(rejectableMoves.length)], 1);
					}
				}
			}
		} while (moves.length < 4 && movePool.length);

		// any moveset modification goes here
		//moves[0] = 'safeguard';
		if (template.requiredItem && template.requiredItem.slice(-5) === 'Drive' && !hasMove['technoblast']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'technoblast';
			hasMove['technoblast'] = true;
		}
		if (template.id === 'altariamega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'return';
			hasMove['return'] = true;
		}
		if (template.id === 'gardevoirmega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'hypervoice';
			hasMove['hypervoice'] = true;
		}
		if (template.id === 'salamencemega' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'return';
			hasMove['return'] = true;
		}
		if (template.id === 'sylveon' && !counter['ate']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'hypervoice';
			hasMove['hypervoice'] = true;
		}
		if (template.id === 'meloettapirouette' && !hasMove['relicsong']) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = 'relicsong';
			hasMove['relicsong'] = true;
		}
		if (template.requiredMove && !hasMove[toId(template.requiredMove)]) {
			delete hasMove[this.getMove(moves[3]).id];
			moves[3] = toId(template.requiredMove);
			hasMove[toId(template.requiredMove)] = true;
		}

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {
				hp: 31,
				atk: 31,
				def: 31,
				spa: 31,
				spd: 31,
				spe: 31
			};
		}

		var abilities = Object.values(baseTemplate.abilities).sort(function (a, b) {
			return this.getAbility(b).rating - this.getAbility(a).rating;
		}.bind(this));
		var ability0 = this.getAbility(abilities[0]);
		var ability1 = this.getAbility(abilities[1]);
		var ability = ability0.name;
		if (abilities[1]) {
			if (ability0.rating <= ability1.rating) {
				if (this.random(2)) ability = ability1.name;
			} else if (ability0.rating - 0.6 <= ability1.rating) {
				if (!this.random(3)) ability = ability1.name;
			}

			var rejectAbility = false;
			if (ability in counterAbilities) {
				rejectAbility = !counter[toId(ability)];
			} else if (ability === 'Rock Head' || ability === 'Reckless') {
				rejectAbility = !counter['recoil'];
			} else if (ability === 'No Guard' || ability === 'Compound Eyes') {
				rejectAbility = !counter['inaccurate'];
			} else if (ability === 'Strong Jaw') {
				rejectAbility = !counter['bite'];
			} else if (ability === 'Sheer Force') {
				rejectAbility = !counter['sheerforce'];
			} else if (ability === 'Serene Grace') {
				rejectAbility = !counter['serenegrace'] && template.species !== 'Blissey' && template.species !== 'Chansey';
			} else if (ability === 'Simple') {
				rejectAbility = !setupType && !hasMove['flamecharge'] && !hasMove['stockpile'];
			} else if (ability === 'Prankster') {
				rejectAbility = !counter['Status'];
			} else if (ability === 'Defiant') {
				rejectAbility = !counter['Physical'] && !hasMove['batonpass'];
			} else if (ability === 'Moody') {
				rejectAbility = template.id !== 'bidoof';
			} else if (ability === 'Lightning Rod') {
				rejectAbility = template.types.indexOf('Ground') >= 0;
			} else if (ability === 'Chlorophyll') {
				rejectAbility = !hasMove['sunnyday'];
			} else if (ability in ateAbilities) {
				rejectAbility = !counter['ate'];
			} else if (ability === 'Unburden') {
				rejectAbility = template.baseStats.spe > 120;
			}

			if (rejectAbility) {
				if (ability === ability1.name) { // or not
					ability = ability0.name;
				} else if (ability1.rating > 0) { // only switch if the alternative doesn't suck
					ability = ability1.name;
				}
			}
			if (abilities.indexOf('Guts') > -1 && ability !== 'Quick Feet' && hasMove['facade']) {
				ability = 'Guts';
			}
			if (abilities.indexOf('Swift Swim') > -1 && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.indexOf('Chlorophyll') > -1 && ability !== 'Solar Power') {
				ability = 'Chlorophyll';
			}
			if (abilities.indexOf('Intimidate') > -1 || template.id === 'mawilemega') {
				ability = 'Intimidate';
			}
			if (template.id === 'ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				// Might as well give it Pickup just in case
				ability = 'Pickup';
			} else if (template.id === 'unfezant') {
				ability = 'Super Luck';
			}
		}

		// Make EVs comply with the sets.
		// Quite simple right now, 252 attack, 252 hp if slow 252 speed if fast, 4 evs for the strong defense.
		// TO-DO: Make this more complex
		if (counter.Special >= 2) {
			evs.atk = 0;
			evs.spa = 252;
		} else if (counter.Physical >= 2) {
			evs.atk = 252;
			evs.spa = 0;
		} else {
			// Fallback in case a Pokémon lacks attacks... go by stats
			if (template.baseStats.spa >= template.baseStats.atk) {
				evs.atk = 0;
				evs.spa = 252;
			} else {
				evs.atk = 252;
				evs.spa = 0;
			}
		}
		if (template.baseStats.spe > 80) {
			evs.spe = 252;
			evs.hp = 4;
		} else {
			evs.hp = 252;
			if (template.baseStats.def > template.baseStats.spd) {
				evs.def = 4;
			} else {
				evs.spd = 4;
			}
		}

		// Naturally slow mons already have the proper EVs, check IVs for Gyro Ball and TR
		if (hasMove['gyroball'] || hasMove['trickroom']) {
			ivs.spe = 0;
		}

		item = 'Sitrus Berry';
		if (template.requiredItem) {
			item = template.requiredItem;
		// First, the extra high-priority items
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove["magikarpsrevenge"]) {
			item = 'Mystic Water';
		} else if (ability === 'Wonder Guard') {
			item = 'Focus Sash';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (hasMove['trick'] && hasMove['gyroball'] && (ability === 'Levitate' || hasType['Flying'])) {
			item = 'Macho Brace';
		} else if (hasMove['trick'] && hasMove['gyroball']) {
			item = 'Iron Ball';
		} else if (hasMove['trick'] || hasMove['switcheroo']) {
			var randomNum = this.random(2);
			if (counter.Physical >= 3 && (template.baseStats.spe >= 95 || randomNum)) {
				item = 'Choice Band';
			} else if (counter.Special >= 3 && (template.baseStats.spe >= 95 || randomNum)) {
				item = 'Choice Specs';
			} else {
				item = 'Choice Scarf';
			}
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';
		} else if (hasMove['naturalgift']) {
			item = 'Liechi Berry';
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (ability === 'Harvest') {
			item = 'Sitrus Berry';
		} else if (template.species === 'Cubone' || template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Clamperl') {
			item = 'DeepSeaTooth';
		} else if (template.species === 'Spiritomb') {
			item = 'Leftovers';
		} else if (template.species === 'Scrafty' && counter['Status'] === 0) {
			item = 'Assault Vest';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Amoonguss') {
			item = 'Black Sludge';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (hasMove['focusenergy'] || (template.species === 'Unfezant' && counter['Physical'] >= 2)) {
			item = 'Scope Lens';
		} else if (template.evos.length) {
			item = 'Eviolite';
		} else if (hasMove['reflect'] && hasMove['lightscreen']) {
			item = 'Light Clay';
		} else if (hasMove['shellsmash']) {
			item = 'White Herb';
		} else if (hasMove['facade'] || ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['raindance']) {
			item = 'Damp Rock';
		} else if (hasMove['sunnyday']) {
			item = 'Heat Rock';
		} else if (hasMove['sandstorm']) {
			item = 'Smooth Rock';
		} else if (hasMove['hail']) {
			item = 'Icy Rock';
		} else if (ability === 'Magic Guard' && hasMove['psychoshift']) {
			item = 'Flame Orb';
		} else if (ability === 'Sheer Force' || ability === 'Magic Guard') {
			item = 'Life Orb';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if (ability === 'Unburden') {
			if (hasMove['fakeout']) {
				item = 'Normal Gem';
			} else if (hasMove['dracometeor'] || hasMove['leafstorm'] || hasMove['overheat']) {
				item = 'White Herb';
			} else if (hasMove['substitute'] || setupType) {
				item = 'Sitrus Berry';
			} else {
				item = 'Red Card';
				for (var m in moves) {
					var move = this.getMove(moves[m]);
					if (hasType[move.type] && move.basePower >= 90) {
						item = move.type + ' Gem';
						break;
					}
				}
			}

		// medium priority
		} else if (ability === 'Guts') {
			item = hasMove['drainpunch'] ? 'Flame Orb' : 'Toxic Orb';
			if ((hasMove['return'] || hasMove['hyperfang']) && !hasMove['facade']) {
				// lol no
				for (var j = 0; j < moves.length; j++) {
					if (moves[j] === 'Return' || moves[j] === 'Hyper Fang') {
						moves[j] = 'Facade';
						break;
					}
				}
			}
		} else if (ability === 'Marvel Scale' && hasMove['psychoshift']) {
			item = 'Flame Orb';
		} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['suckerpunch'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && ability !== 'Sturdy' && ability !== 'Multiscale') {
			item = 'Life Orb';
		} else if (counter.Special >= 4 && !hasMove['eruption'] && !hasMove['waterspout'] && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Shuca Berry';
		} else if (this.getEffectiveness('Ice', template) >= 2) {
			item = 'Yache Berry';
		} else if (this.getEffectiveness('Rock', template) >= 2) {
			item = 'Charti Berry';
		} else if (this.getEffectiveness('Fire', template) >= 2) {
			item = 'Occa Berry';
		} else if (this.getImmunity('Fighting', template) && this.getEffectiveness('Fighting', template) >= 2) {
			item = 'Chople Berry';
		} else if (ability === 'Iron Barbs' || ability === 'Rough Skin') {
			item = 'Rocky Helmet';
		} else if ((template.baseStats.hp + 75) * (template.baseStats.def + template.baseStats.spd + 175) > 60000 || template.species === 'Skarmory' || template.species === 'Forretress') {
			// skarmory and forretress get exceptions for their typing
			item = 'Sitrus Berry';
		} else if (counter.Physical + counter.Special >= 3 && setupType && ability !== 'Sturdy' && ability !== 'Multiscale') {
			item = 'Life Orb';
		} else if (counter.Special >= 3 && setupType && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.def + template.baseStats.spd > 179) {
			item = 'Assault Vest';
		} else if (counter.Physical + counter.Special >= 4) {
			item = 'Expert Belt';
		} else if (hasMove['outrage']) {
			item = 'Lum Berry';
		} else if (hasMove['substitute'] || hasMove['detect'] || hasMove['protect'] || ability === 'Moody') {
			item = 'Leftovers';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Shuca Berry';
		} else if (this.getEffectiveness('Ice', template) >= 1) {
			item = 'Yache Berry';

		// this is the "REALLY can't think of a good item" cutoff
		} else if (counter.Physical + counter.Special >= 2 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd > 315) {
			item = 'Weakness Policy';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (counter.Status <= 1 && ability !== 'Sturdy' && ability !== 'Multiscale') {
			item = 'Life Orb';
		} else {
			item = 'Sitrus Berry';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
		// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
		var bst = template.baseStats.hp + template.baseStats.atk + template.baseStats.def + template.baseStats.spa + template.baseStats.spd + template.baseStats.spe;
		// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
		// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
		var templateAbility = (baseTemplate === template ? ability : template.abilities[0]);
		if (templateAbility === 'Huge Power' || templateAbility === 'Pure Power') {
			bst += template.baseStats.atk;
		} else if (templateAbility === 'Parental Bond') {
			bst += 0.5 * (evs.atk > evs.spa ? template.baseStats.atk : template.baseStats.spa);
		} else if (templateAbility === 'Protean') {
			// Holistic judgment. Don't boost Protean as much as Parental Bond
			bst += 0.3 * (evs.atk > evs.spa ? template.baseStats.atk : template.baseStats.spa);
		} else if (templateAbility === 'Fur Coat') {
			bst += template.baseStats.def ;
		}
		if (item === 'Eviolite') {
			bst += 0.5 * (template.baseStats.def + template.baseStats.spd);
		}
		var level = 70 + Math.floor(((600 - this.clampIntRange(bst, 300, 600)) / 10.34));

		return {
			name: name,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: !this.random(template.id === 'missingno' ? 4 : 1024)
		};
	},
	randomSeasonalStaffTeam: function (side) {
		var team = [];
		var variant = this.random(2);
		// Hardcoded sets of the available Pokémon.
		var sets = {
			// Admins.
			'~Antar': {
				species: 'Quilava', ability: 'Turboblaze', item: 'Eviolite', gender: 'M',
				moves: ['blueflare', ['quiverdance', 'solarbeam', 'moonblast'][this.random(3)], 'sunnyday'],
				baseSignatureMove: 'spikes', signatureMove: "Firebomb",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'~chaos': {
				species: 'Bouffalant', ability: 'Fur Coat', item: 'Red Card', gender: 'M',
				moves: ['precipiceblades', ['recover', 'stockpile', 'swordsdance'][this.random(3)], 'extremespeed', 'explosion'],
				baseSignatureMove: 'embargo', signatureMove: "Forcewin",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant'
			},
			'~Haunter': {
				species: 'Landorus', ability: 'Sheer Force', item: 'Life Orb', gender: 'M',
				moves: ['hurricane', 'earthpower', 'fireblast', 'blizzard', 'thunder'],
				baseSignatureMove: 'quiverdance', signatureMove: "Genius Dance",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'~Jasmine': {
				species: 'Mew', ability: 'Speed Boost', item: 'Focus Sash', gender: 'F',
				moves: ['explosion', 'transform', 'milkdrink', 'storedpower'],
				baseSignatureMove: 'bellydrum', signatureMove: "Lockdown",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold'
			},
			'~Joim': {
				species: 'Zapdos', ability: 'Download', item: 'Leftovers', gender: 'M', shiny: true,
				moves: ['thunderbolt', 'hurricane', ['earthpower', 'roost', 'flamethrower', 'worryseed', 'haze', 'spore'][this.random(6)]],
				baseSignatureMove: 'milkdrink', signatureMove: "Red Bull Drink",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'~The Immortal': {
				species: 'Blastoise', ability: 'Magic Bounce', item: 'Blastoisinite', gender: 'M', shiny: true,
				moves: ['shellsmash', 'steameruption', 'dragontail'],
				baseSignatureMove: 'sleeptalk', signatureMove: "Sleep Walk",
				evs: {hp:252, def:4, spd:252}, nature: 'Sassy'
			},
			'~V4': {
				species: 'Victini', ability: 'Desolate Land', item: (variant === 0 ? ['Life Orb', 'Charcoal', 'Leftovers'][this.random(3)] : ['Life Orb', 'Choice Scarf', 'Leftovers'][this.random(3)]), gender: 'M',
				moves: (variant === 0 ? ['thousandarrows', 'bolt strike', 'shiftgear', 'dragonascent', 'closecombat', 'substitute'] : ['thousandarrows', 'bolt strike', 'dragonascent', 'closecombat']),
				baseSignatureMove: 'vcreate', signatureMove: "V-Generate",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly'
			},
			'~Zarel': {
				species: 'Meloetta', ability: 'Serene Grace', item: '', gender: 'F',
				moves: ['lunardance', 'fierydance', 'perishsong', 'petaldance', 'quiverdance'],
				baseSignatureMove: 'relicsong', signatureMove: "Relic Song Dance",
				evs: {hp:4, atk:252, spa:252}, nature: 'Quiet'
			},
			// Leaders.
			'&hollywood': {
				species: 'Mr. Mime', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['batonpass', ['substitute', 'milkdrink'][this.random(2)], 'encore'],
				baseSignatureMove: 'geomancy', signatureMove: "Meme Mime",
				evs: {hp:252, def:4, spe:252}, nature: 'Timid'
			},
			'&jdarden': {
				species: 'Dragonair', ability: 'Fur Coat', item: 'Eviolite', gender: 'M',
				moves: ['rest', 'sleeptalk', 'quiverdance'], name: 'jdarden',
				baseSignatureMove: 'dragontail', signatureMove: "Wyvern's Wind",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm'
			},
			'&Okuu': {
				species: 'Honchkrow', ability: 'Drought', item: 'Life Orb', gender: 'F',
				moves: [['bravebird', 'sacredfire'][this.random(2)], ['suckerpunch', 'punishment'][this.random(2)], 'roost'],
				baseSignatureMove: 'firespin', signatureMove: "Blazing Star - Ten Evil Stars",
				evs: {atk:252, spa:4, spe:252}, nature: 'Quirky'
			},
			'&sirDonovan': {
				species: 'Togetic', ability: 'Gale Wings', item: 'Eviolite', gender: 'M',
				moves: ['roost', 'hurricane', 'afteryou', 'charm', 'dazzlinggleam'],
				baseSignatureMove: 'mefirst', signatureMove: "Ladies First",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest'
			},
			'&Slayer95': {
				species: 'Scizor', ability: 'Illusion', item: 'Scizorite', gender: 'M',
				moves: ['swordsdance', 'bulletpunch', 'uturn'],
				baseSignatureMove: 'allyswitch', signatureMove: "Spell Steal",
				evs: {atk:252, def:252, spd: 4}, nature: 'Brave'
			},
			'&Sweep': {
				species: 'Omastar', ability: 'Drizzle', item: ['Honey', 'Mail'][this.random(2)], gender: 'M',
				moves: ['shellsmash', 'originpulse', ['thunder', 'icebeam'][this.random(2)]],
				baseSignatureMove: 'kingsshield', signatureMove: "Sweep's Shield",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'&Vacate': {
				species: 'Bibarel', ability: 'Adaptability', item: 'Leftovers', gender: 'M',
				moves: ['earthquake', 'smellingsalts', 'stockpile', 'zenheadbutt', 'waterfall'],
				baseSignatureMove: 'superfang', signatureMove: "Duper Fang",
				evs: {atk:252, def:4, spd:252}, nature: 'Quiet'
			},
			'&verbatim': {
				species: 'Archeops', ability: 'Reckless', item: 'Life Orb', gender: 'M',
				moves: ['headsmash', 'highjumpkick', 'flareblitz', 'volttackle', 'woodhammer'],
				baseSignatureMove: 'bravebird', signatureMove: "Glass Cannon",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly'
			},
			// Mods.
			'@AM': {
				species: 'Tyranitar', ability: 'Adaptability', item: (variant === 1 ? 'Lum Berry' : 'Choice Scarf'), gender: 'M',
				moves: (variant === 1 ? ['earthquake', 'diamondstorm', 'swordsdance', 'meanlook'] : ['knockoff', 'diamondstorm', 'earthquake']),
				baseSignatureMove: 'pursuit', signatureMove: "Predator",
				evs: {atk:252, def:4, spe: 252}, nature: 'Jolly'
			},
			'@antemortem': {
				species: 'Clefable', ability: (variant === 1 ? 'Sheer Force' : 'Multiscale'), item: (variant === 1 ? 'Life Orb' : 'Leftovers'), gender: 'M',
				moves: ['earthpower', 'cosmicpower', 'recover', 'gigadrain'],
				baseSignatureMove: 'drainingkiss', signatureMove: "Postmortem",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest'
			},
			'@Ascriptmaster': {
				species: 'Rotom', ability: 'Teravolt', item: 'Air Balloon', gender: 'M',
				moves: ['chargebeam', 'signalbeam', 'flamethrower', 'aurorabeam', 'dazzlinggleam'],
				baseSignatureMove: 'triattack', signatureMove: "Spectrum Beam",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@asgdf': {
				species: 'Empoleon', ability: 'Filter', item: 'Rocky Helmet', gender: 'M',
				moves: ['scald', 'recover', 'calmmind', 'searingshot', 'encore'],
				baseSignatureMove: 'futuresight', signatureMove: "Obscure Pun",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest'
			},
			'@Barton': {
				species: 'Piloswine', ability: 'Parental Bond', item: 'Eviolite', gender: 'M',
				moves: ['earthquake', 'iciclecrash', 'taunt'],
				baseSignatureMove: 'bulkup', signatureMove: "MDMA Huff",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'@bean': {
				species: 'Liepard', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'encore', 'substitute', 'gastroacid', 'leechseed'],
				baseSignatureMove: 'glare', signatureMove: "Coin Toss",
				evs: {hp:252, def:252, spd:4}, nature: 'Calm'
			},
			'@Beowulf': {
				species: 'Beedrill', ability: 'Download', item: 'Beedrillite', gender: 'M',
				moves: ['spikyshield', 'gunkshot', ['sacredfire', 'boltstrike', 'diamondstorm'][this.random(3)]],
				baseSignatureMove: 'bugbuzz', signatureMove: "Buzzing of the Swarm",
				evs: {hp:4, spa:252, spe:252}, nature: 'Jolly'
			},
			'@BiGGiE': {
				species: 'Snorlax', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['drainpunch', 'diamondstorm', 'kingsshield', 'knockoff', 'precipiceblades'],
				baseSignatureMove: 'dragontail', signatureMove: "Food Rush",
				evs: {hp:4, atk:252, spd:252}, nature: 'Adamant'
			},
			'@Blitzamirin': {
				species: 'Chandelure', ability: 'Prankster', item: 'Red Card', gender: 'M',
				moves: ['heartswap', ['darkvoid', 'substitute'][this.random(2)], ['shadowball', 'blueflare'][this.random(2)]],
				baseSignatureMove: 'oblivionwing', signatureMove: "Pneuma Relinquish",
				evs: {def:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@CoolStoryBrobat': {
				species: 'Crobat', ability: 'Gale Wings', item: 'Black Glasses', gender: 'M',
				moves: ['knockoff', 'bulkup', 'roost', 'closecombat', 'defog'],
				baseSignatureMove: 'bravebird', signatureMove: "Brave Bat",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly'
			},
			'@Dell': {
				species: 'Lucario', ability: 'Simple', item: 'Lucarionite', gender: 'M',
				moves: ['jumpkick', ['flashcannon', 'bulletpunch'][this.random(2)], 'batonpass'],
				baseSignatureMove: 'detect', signatureMove: "Aura Parry",
				evs: {hp:4, atk:216, spa:36, spe:252}, nature: 'Naive'
			},
			'@Eevee General': {
				species: 'Eevee', ability: 'Magic Guard', item: 'Eviolite', gender: 'M',
				moves: ['shiftgear', 'healorder', 'crunch', 'sacredsword', 'doubleedge'],
				baseSignatureMove: 'quickattack', signatureMove: "War Crimes",
				evs: {hp:252, atk:252, def:4}, nature: 'Impish'
			},
			'@Electrolyte': {
				species: 'Elekid', ability: 'Pure Power', item: 'Life Orb', gender: 'M',
				moves: ['volttackle', 'earthquake', ['iciclecrash', 'diamondstorm'][this.random(2)]],
				baseSignatureMove: 'entrainment', signatureMove: "Study",
				evs: {atk:252, spd:4, spe:252}, nature: 'Adamant'
			},
			'@Enguarde': {
				species: 'Gallade', ability: ['Intimidate', 'Hyper Cutter'][this.random(2)], item: 'Galladite', gender: 'M',
				moves: ['psychocut', 'sacredsword', ['nightslash', 'precipiceblades', 'leafblade'][this.random(3)]],
				baseSignatureMove: 'fakeout', signatureMove: "Ready Stance",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant'
			},
			'@Eos': {
				species: 'Drifblim', ability: 'Fur Coat', item: 'Assault Vest', gender: 'M',
				moves: ['oblivionwing', 'paraboliccharge', 'gigadrain', 'drainingkiss'],
				baseSignatureMove: 'shadowball', signatureMove: "Shadow Curse",	//placeholder
				evs: {hp:248, spa:252, spd:8}, nature: 'Modest'
			},
			'@Former Hope': {
				species: 'Froslass', ability: 'Prankster', item: 'Focus Sash', gender: 'M',
				moves: [['icebeam', 'shadowball'][this.random(2)], 'destinybond', 'thunderwave'],
				baseSignatureMove: 'roleplay', signatureMove: "Role Play",
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest'
			},
			'@Genesect': {
				species: 'Genesect', ability: 'Mold Breaker', item: 'Life Orb', gender: 'M',
				moves: ['bugbuzz', 'closecombat', 'extremespeed', 'thunderbolt', 'uturn'],
				baseSignatureMove: 'geargrind', signatureMove: "Grind you're mum",
				evs: {atk:252, spa:252, spe:4}, nature: 'Quiet'
			},
			'@Goddess Briyella': {
				species: 'Floette-Eternal-Flower', ability: 'Magic Bounce', item: 'Big Root', gender: 'M',
				moves: ['cottonguard', 'quiverdance', 'drainingkiss'],
				baseSignatureMove: 'earthpower', signatureMove: "Earth Drain",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest'
			},
			'@Hippopotas': {
				species: 'Hippopotas', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['haze', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb'],
				baseSignatureMove: 'partingshot', signatureMove: "Hazard Pass",
				evs: {hp:252, def:252, spd:4}, ivs: {atk:0, spa:0}, nature: 'Bold'
			},
			'@HYDRO IMPACT': {
				species: 'Charizard', ability: 'Rivalry', item: 'Life Orb', gender: 'M',
				moves: ['airslash', 'flamethrower', 'nobleroar', 'hydropump'],
				baseSignatureMove: 'hydrocannon', signatureMove: "HYDRO IMPACT",
				evs: {atk:4, spa:252, spe:252}, nature: 'Hasty'
			},
			'@imanalt': {
				species: 'Rhydon', ability: 'Prankster', item: 'Eviolite', gender: 'M',
				moves: ['heartswap', 'rockblast', 'stealthrock', 'substitute', 'batonpass'],
				baseSignatureMove: 'naturepower', signatureMove: "FREE GENV BH",
				evs: {hp:252, atk:252, spd:4}, nature: 'Adamant'
			},
			'@innovamania': {
				species: 'Arceus', ability: 'Pick Up', item: 'Black Glasses', gender: 'M',
				moves: [['holdhands', 'trickortreat'][this.random(2)], ['swordsdance', 'agility'][this.random(2)], 'celebrate'],
				baseSignatureMove: 'splash', signatureMove: "Rage Quit",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly'
			},
			'@jas61292': {
				species: 'Malaconda', ability: 'Analytic', item: 'Safety Goggles', gender: 'M',
				moves: ['coil', 'thunderwave', 'icefang', 'powerwhip', 'moonlight'],
				baseSignatureMove: 'crunch', signatureMove: "Minus One",
				evs: {hp:252, atk:252, spd:4}, nature: 'Adamant'
			},
			'@jin of the gale': {
				species: 'Starmie', ability: 'Drizzle', item: 'Damp Rock', gender: 'M',
				moves: ['steameruption', 'hurricane', 'recover', 'psystrike', 'quiverdance'],
				baseSignatureMove: 'rapidspin', signatureMove: "Beyblade",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@Kostitsyn-Kun': {
				species: 'Gothorita', ability: 'Simple', item: 'Eviolite', gender: 'F', //requested
				moves: ['calmmind', 'psyshock', ['dazzlinggleam', 'secretsword'][this.random(2)]],
				baseSignatureMove: 'refresh', signatureMove: "Kawaii-desu uguu~",
				evs: {hp:252, def:136, spe:120}, nature: 'Bold'
			},
			'@kupo': {
				species: 'Pikachu', ability: 'Prankster', item: "Light Ball", gender: 'M',
				moves: ['substitute', 'spore', 'encore'],
				baseSignatureMove: 'transform', signatureMove: "Kupo Nuts",
				evs: {hp:252, def:4, spd:252}, nature: 'Jolly'
			},
			'@Lawrence III': {
				species: 'Lugia', ability: 'Trace', item: "Grip Claw", gender: 'M',
				moves: ['infestation', 'magmastorm', 'oblivionwing'],
				baseSignatureMove: 'gust', signatureMove: "Shadow Storm",
				evs: {hp:248, def:84, spa:92, spd:84}, nature: 'Modest'
			},
			'@Layell': {
				species: 'Sneasel', ability: 'Technician', item: "King's Rock", gender: 'M',
				moves: ['iceshard', 'iciclespear', ['machpunch', 'pursuit', 'knockoff'][this.random(3)]],
				baseSignatureMove: 'protect', signatureMove: "Pixel Protection",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant'
			},
			'@LegitimateUsername': {
				species: 'Shuckle', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['leechseed', 'rest', 'foulplay'],
				baseSignatureMove: 'shellsmash', signatureMove: "Shell Fortress",
				evs: {hp:252, def:228, spd:28}, nature: 'Calm'
			},
			'@Level 51': {
				species: 'Togekiss', ability: 'Parental Bond', item: 'Leftovers', gender: 'M',
				moves: ['seismictoss', 'roost', ['cosmicpower', 'cottonguard'][this.random(2)]],
				baseSignatureMove: 'trumpcard', signatureMove: "Next Level Strats",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm'
			},
			'@Lyto': {
				species: 'Lanturn', ability: 'Magic Bounce', item: 'Leftovers', gender: 'M',
				moves: ['originpulse', 'lightofruin', 'blueflare', 'recover', 'tailglow'],
				baseSignatureMove: 'thundershock', signatureMove: "Gravity Storm",
				evs: {hp:188, spa:252, spe:68}, nature: 'Modest'
			},
			'@Marty': {
				species: 'Houndoom', ability: 'Drought', item: 'Houndoominite', gender: 'M',
				moves: ['nightdaze', 'solarbeam', 'aurasphere', 'thunderbolt', 'earthpower'],
				baseSignatureMove: 'sacredfire', signatureMove: "Immolate",
				evs: {spa:252, spd:4, spe:252}, ivs: {atk:0}, nature: 'Timid'
			},
			'@MattL': {
				species: 'Mandibuzz', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['oblivionwing', 'leechseed', 'quiverdance', 'topsyturvy', 'substitute'],
				baseSignatureMove: 'toxic', signatureMove: "Topology",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold'
			},
			'@Morfent': {
				species: 'Dusknoir', ability: 'Fur Coat', item: "Leftovers", gender: 'M',
				moves: [['recover', 'acidarmor', 'swordsdance', 'willowisp', 'trickroom'][this.random(5)], 'shadowclaw', ['earthquake', 'icepunch', 'thunderpunch'][this.random(3)]],
				baseSignatureMove: 'spikes', signatureMove: "Used Needles",
				evs: {hp:252, atk:4, def:252}, ivs: {spe:0}, nature: 'Impish'
			},
			'@Nani Man': {
				species: 'Gengar', ability: 'Desolate Land', item: 'Black Glasses', gender: 'M', shiny: true,
				moves: ['eruption', 'swagger', 'shadow ball', 'topsyturvy', 'dazzlinggleam'],
				baseSignatureMove: 'fireblast', signatureMove: "Tanned",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@NixHex': {
				species: 'Porygon2', ability: 'No Guard', item: 'Eviolite', gender: 'M', shiny: true,
				moves: ['thunder', 'blizzard', 'overheat', 'triattack', 'recover'],
				baseSignatureMove: 'inferno', signatureMove: "Beautiful Disaster",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest'
			},
			'@Osiris': {
				species: 'Pumpkaboo-Super', ability: 'Bad Dreams', item: 'Eviolite', gender: 'M',
				moves: ['leechseed', 'recover', 'cosmicpower'],
				baseSignatureMove: 'hypnosis', signatureMove: "Restless Sleep",
				evs: {hp:252, def:216, spd:40}, ivs: {atk:0}, nature: 'bold'
			},
			'@phil': {
				species: 'Gastrodon', ability: 'Drizzle', item: 'Shell Bell', gender: 'M',
				moves: ['scald', 'recover', 'gastroacid', 'brine'],
				baseSignatureMove: 'whirlpool', signatureMove: "Slug Attack",
				evs: {hp:252, spa:252, def:4}, nature: 'Quirky'
			},
			'@qtrx': {
				species: 'Unown', ability: 'Levitate', item: 'Focus Sash', gender: 'M',
				moves: [],
				baseSignatureMove: 'meditate', signatureMove: "Hidden Power... Normal?",
				evs: {hp:252, def:4, spa:252}, ivs: {atk:0, spe:0}, nature: 'Quiet'
			},
			'@Queez': {
				species: 'Cubchoo', ability: 'Prankster', item: 'Eviolite', gender: 'M',
				moves: ['pound', 'fly', 'softboiled', 'thunderwave', 'waterpulse'],
				baseSignatureMove: 'leer', signatureMove: "Sneeze",
				evs: {hp:252, def:228, spd:28}, nature: 'Calm'
			},
			'@rekeri': {
				species: 'Tyrantrum', ability: 'Tough Claws', item: 'Life Orb', gender: 'M',
				moves: ['outrage', 'extremespeed', 'stoneedge', 'closecombat'],
				baseSignatureMove: 'headcharge', signatureMove: "Land Before Time",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'@Relados': {
				species: 'Terrakion', ability: 'Guts', item: 'Flame Orb', gender: 'M',
				moves: ['knockoff', 'diamondstorm', 'closecombat', 'iceshard', 'drainpunch'],
				baseSignatureMove: 'stockpile', signatureMove: "Loyalty",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant'
			},
			'@Reverb': {
				species: 'Slaking', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['feint', 'stormthrow', 'blazekick'], // Feint as a countermeasure to the abundance of Protect-based set-up moves.
				baseSignatureMove: 'eggbomb', signatureMove: "fat monkey",
				evs: {hp:252, spd:40, spe:216}, nature: 'Jolly' // EV-nerf.
			},
			'@RosieTheVenusaur': {
				species: 'Venusaur', ability: 'Moxie', item: 'Leftovers', gender: 'F',
				moves: ['flamethrower', 'extremespeed', 'sacredfire', 'knockoff', 'closecombat'],
				baseSignatureMove: 'frenzyplant', signatureMove: "Swag Plant",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'@scalarmotion': {
				species: 'Cryogonal', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['rapidspin', 'willowisp', 'taunt', 'recover', 'voltswitch'],
				baseSignatureMove: 'icebeam', signatureMove: "Eroding Frost",
				evs: {spa:252, spd:4, spe:252}, nature: 'Timid'
			},
			'@Scotteh': {
				species: 'Suicune', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['icebeam', 'steameruption', 'recover', 'nastyplot'],
				baseSignatureMove: 'boomburst', signatureMove: "Geomagnetic Storm",
				evs: {def:252, spa:4, spe:252}, nature: 'Bold'
			},
			'@Shame That': {
				species: 'Weavile', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['substitute', 'captivate', 'reflect', 'rest', 'raindance', 'foresight'],
				baseSignatureMove: 'healingwish', signatureMove: "Extreme Compromise",
				evs: {hp:252, def:4, spe:252}, nature: 'Jolly'
			},
			'@shaymin': {
				species: 'Shaymin-Sky', ability: 'Serene Grace', item: 'Expert Belt', gender: 'F',
				moves: ['seedflare', 'airslash', ['secretsword', 'earthpower', 'roost'][this.random(3)]],
				baseSignatureMove: 'detect', signatureMove: "Flower Garden",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@shrang': {
				species: 'Latias', ability: 'Pixilate', item: ['Latiasite', 'Life Orb', 'Leftovers'][this.random(3)], gender: 'M',
				moves: ['dracometeor', 'roost', 'nastyplot', 'fireblast', 'aurasphere', 'psystrike'], //not QD again senpai >.<
				baseSignatureMove: 'judgment', signatureMove: "Pixilate",	//placeholder
				evs: {hp:160, spa:96, spe:252}, ivs: {atk:0}, nature: 'Timid'
			},
			'@Skitty': {
				species: 'Audino', ability: 'Intimidate', item: 'Audinite', gender: 'M',
				moves: ['acupressure', 'recover', ['taunt', 'cosmicpower', 'magiccoat'][this.random(3)]],
				baseSignatureMove: 'storedpower', signatureMove: "Ultimate Dismissal",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold'
			},
			'@Snowflakes': {
				species: 'Celebi', ability: 'Filter', item: 'Leftovers', gender: 'M',
				moves: [
					['gigadrain', ['recover', 'quiverdance'][this.random(2)], ['icebeam', 'searingshot', 'psystrike', 'thunderbolt', 'aurasphere', 'moonblast'][this.random(6)]],
					['gigadrain', 'recover', [['uturn', 'voltswitch'][this.random(2)], 'thunderwave', 'leechseed', 'healbell', 'healingwish', 'reflect', 'lightscreen', 'stealthrock'][this.random(8)]],
					['gigadrain', 'perishsong', ['recover', ['uturn', 'voltswitch'][this.random(2)], 'leechseed', 'thunderwave', 'healbell'][this.random(5)]],
					['gigadrain', 'recover', ['thunderwave', 'icebeam', ['uturn', 'voltswitch'][this.random(2)], 'psystrike'][this.random(4)]]
				][this.random(4)],
				baseSignatureMove: 'thousandarrows', signatureMove: "Azalea Butt Slam",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest'
			},
			'@Spydreigon': {
				species: 'Hydreigon', ability: 'Mega Launcher', item: 'Life Orb', gender: 'M',
				moves: ['dragonpulse', 'darkpulse', 'aurasphere', 'originpulse', 'shiftgear'],
				baseSignatureMove: 'waterpulse', signatureMove: "Mineral Pulse",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'@Steamroll': {
				species: 'Growlithe', ability: 'Adaptability', item: 'Life Orb', gender: 'M',
				moves: ['flareblitz', 'volttackle', 'closecombat'],
				baseSignatureMove: 'protect', signatureMove: "Conflagration",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant'
			},
			'@SteelEdges': {
				species: 'Alakazam', ability: 'Competitive', item: 'Alakazite', gender: 'M',
				moves: ['bugbuzz', 'hypervoice', 'psystrike', 'batonpass', 'focusblast'],
				baseSignatureMove: 'tailglow', signatureMove: "True Daily Double",
				evs: {hp:4, spa:252, spe:252}, nature: 'Serious'
			},
			'@Temporaryanonymous': {
				species: 'Doublade', ability: 'Tough Claws', item: 'Eviolite', gender: 'M',
				moves: ['swordsdance', ['xscissor', 'sacredsword', 'knockoff'][this.random(3)], 'geargrind'],
				baseSignatureMove: 'shadowsneak', signatureMove: "SPOOPY EDGE CUT",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'@Test2017': {
				species: "Farfetch'd", ability: 'Wonder Guard', item: 'Stick', gender: 'M',
				moves: ['foresight', 'gastroacid', 'nightslash', 'roost', 'thousandarrows'],
				baseSignatureMove: 'karatechop', signatureMove: "Ducktastic",
				evs: {hp:252, atk:252, spe:4}, nature: 'Adamant'
			},
			'@TFC': {
				species: 'Blastoise', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['quiverdance', 'cottonguard', 'storedpower', 'aurasphere', 'slackoff'],
				baseSignatureMove: 'drainpunch', signatureMove: "Chat Flood",
				evs: {atk:252, def:4, spe:252}, nature: 'Modest'
			},
			'@TGMD': {
				species: 'Stoutland', ability: 'Speed Boost', item: 'Life Orb', gender: 'M',
				moves: [['extremespeed', 'sacredsword'][this.random(2)], 'knockoff', 'protect'],
				baseSignatureMove: 'return', signatureMove: "Canine Carnage",
				evs: {hp:32, atk:252, spe:224}, nature: 'Adamant'
			},
			'@Trickster': {
				species: 'Whimsicott', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['swagger', 'spore', 'seedflare', 'recover', 'nastyplot'],
				baseSignatureMove: 'naturepower', signatureMove: "Cometstorm",
				evs: {hp:252, spa:252, spe:4}
			},
			'@WaterBomb': {
				species: 'Poliwrath', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['heartswap', 'softboiled', 'aromatherapy', 'highjumpkick'],
				baseSignatureMove: 'waterfall', signatureMove: "Water Bomb",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'@zdrup': {
				species: 'Slowking', ability: 'Slow Start', item: 'Leftovers', gender: 'M',
				moves: ['psystrike', 'futuresight', 'originpulse', 'slackoff', 'destinybond'],
				baseSignatureMove: 'wish', signatureMove: "Premonition",
				evs: {hp:252, def:4, spd:252}, nature: 'Quiet'
			},
			'@Zebraiken': {
				species: 'zebstrika', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['thunder', ['fire blast', 'focusblast', 'highjumpkick', 'meteormash'][this.random(3)], ['blizzard', 'iciclecrash', 'sleeppowder'][this.random(3)]], // why on earth does he learn Meteor Mash?
				baseSignatureMove: 'detect', signatureMove: "bzzt",
				evs: {atk:4, spa:252, spe:252}, nature: 'Hasty'
			},
			// Drivers.
			'%Acedia': {
				species: 'Slakoth', ability: 'Magic Bounce', item: 'Quick Claw', gender: 'F',
				moves: ['metronome', 'sketch', 'assist', 'swagger', 'foulplay'],
				baseSignatureMove: 'worryseed', signatureMove: "Procrastination",
				evs: {hp:252, atk:252, def:4}, nature: 'Serious'
			},
			'%Aelita': {
				species: 'Porygon-Z', ability: 'Protean', item: 'Life Orb', gender: 'F',
				moves: ['boomburst', 'quiverdance', 'chatter', 'blizzard', 'moonblast'],
				baseSignatureMove: 'thunder', signatureMove: "Energy Field",
				evs: {hp:4, spa:252, spd:252}, nature: 'Modest'
			},
			'%Arcticblast': {
				species: 'Cresselia', ability: 'Levitate', item: 'Sitrus Berry', gender: 'M',
				moves: [
					['fakeout', 'icywind', 'trickroom', 'safeguard', 'thunderwave', 'tailwind', 'knockoff'][this.random(7)],
					['sunnyday', 'moonlight', 'calmmind', 'protect', 'taunt'][this.random(5)],
					['originpulse', 'heatwave', 'hypervoice', 'icebeam', 'moonblast'][this.random(5)]
				],
				baseSignatureMove: 'psychoboost', signatureMove: "Doubles Purism",
				evs: {hp:252, def:120, spa:56, spd:80}, nature: 'Sassy'
			},
			'%Ast☆arA': {
				species: 'Jirachi', ability: 'Cursed Body', item: ['Leftovers', 'Sitrus Berry'][this.random(2)], gender: 'F',
				moves: ['psychic', 'moonblast', 'nastyplot', 'recover', 'surf'],
				baseSignatureMove: 'psywave', signatureMove: "Star Bolt Desperation",
				evs: {hp:4, spa:252, spd:252}, nature: 'Modest'
			},
			'%Astyanax': {
				species: 'Seismitoad', ability: 'Sap Sipper', item: 'Red Card', gender: 'M',
				moves: ['earthquake', 'recover', 'icepunch'],
				baseSignatureMove: 'toxic', signatureMove: "Amphibian Toxin",
				evs: {atk:252, spd:252, spe:4}, nature: 'Adamant'
			},
			'%Audiosurfer': {
				species: 'Audino', ability: 'Prankster', item: 'Audinite', gender: 'M',
				moves: ['boomburst', 'slackoff', 'glare'],
				baseSignatureMove: 'detect', signatureMove: "Audioshield",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest'
			},
			'%birkal': {
				species: 'Rotom-Fan', ability: 'Magic Guard', item: 'Choice Scarf', gender: 'M',
				moves: ['trick', 'aeroblast', ['discharge', 'partingshot', 'recover', 'tailglow'][this.random(4)]],
				baseSignatureMove: 'quickattack', signatureMove: "Caw",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'%bloobblob': {
				species: 'Cinccino', ability: 'Skill Link', item: 'Life Orb', gender: 'M',
				moves: ['bulletseed', 'rockblast', 'uturn', 'tailslap', 'knockoff'],
				baseSignatureMove: 'spikecannon', signatureMove: "Lava Whip",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant'
			},
			'%Crestfall': {
				species: 'Darkrai', ability: 'Parental Bond', item: 'Lum Berry', gender: 'M',
				moves: ['darkpulse', 'icebeam', 'oblivionwing'],
				baseSignatureMove: 'protect', signatureMove: "Final",
				evs: {spa:252, def:4, spe:252}, nature: 'Modest'
			},
			'%dtc': {
				species: 'Charizard', ability: 'Magic Guard', item: 'Charizardite X', gender: 'M',
				moves: ['shiftgear', 'blazekick', 'roost'],
				baseSignatureMove: 'dragonrush', signatureMove: "Dragon Smash",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant'
			},
			'%Feliburn': {
				species: 'Infernape', ability: 'Adaptability', item: 'Expert Belt', gender: 'M',
				moves: ['highjumpkick', 'sacredfire', 'taunt', 'fusionbolt', 'machpunch'],
				baseSignatureMove: 'firepunch', signatureMove: "Falcon Punch",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly'
			},
			'%Hugendugen': {
				species: 'Latios', ability: 'Prankster', item: 'Life Orb', gender: 'M',
				moves: ['taunt', 'dracometeor', 'surf', 'earthpower', 'recover', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'psychup', signatureMove: "Policy Decision",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'%Jellicent': {
				species: 'Jellicent', ability: 'Poison Heal', item: 'Toxic Orb', gender: 'M',
				moves: ['recover', 'freezedry', 'trick', 'substitute'],
				baseSignatureMove: 'surf', signatureMove: "Shot For Shot",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm'
			},
			'%LJDarkrai': {
				species: 'Garchomp', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['dragondance', 'dragonrush', 'gunkshot', 'precipiceblades', 'sleeppowder', 'stoneedge'], name: '%LJDarkrai',
				baseSignatureMove: 'blazekick', signatureMove: "Blaze Blade",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant'
			},
			'%Majorbling': {
				species: 'Dedenne', ability: 'Levitate', item: 'Expert Belt', gender: 'M',
				moves: ['moonblast', 'voltswitch', 'discharge', 'focusblast', 'taunt'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Focus Laser",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid'
			},
			'%Raseri': {
				species: 'Prinplup', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['defog', 'stealthrock', 'toxic', 'roar', 'bravebird'],
				baseSignatureMove: 'scald', signatureMove: "Ban Scald",
				evs: {hp:252, def:228, spd:28}, nature: 'Bold'
			},
			'%Timbuktu': {
				species: 'Heatmor', ability: 'Contrary', item: 'Life Orb', gender: 'M',
				moves: ['overheat', ['hammerarm', 'substitute'][this.random(2)], ['glaciate', 'thunderbolt'][this.random(2)]], // Curse didn't make sense at all so it was changed to Hammer Arm
				baseSignatureMove: 'rockthrow', signatureMove: "Geoblast",
				evs: {spa:252, spd:4, spe:252}, nature: 'Timid'
			},
			'%trinitrotoluene': {
				species: 'Metagross', ability: 'Levitate', item: 'Metagrossite', gender: 'M',
				moves: ['meteormash', 'zenheadbutt', 'hammerarm', 'grassknot', 'earthquake', 'thunderpunch', 'icepunch', 'shiftgear'],
				baseSignatureMove: 'explosion', signatureMove: "Get Haxed",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly'
			},
			'%uselesstrainer': {
				species: 'Scatterbug', ability: 'Skill Link', item: 'Mail', gender: 'M',
				moves: ['explosion', 'stringshot', 'stickyweb', 'spiderweb', 'mist'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Ranting",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly'
			},
			'%xfix': {
				species: 'Xatu', ability: 'Magic Bounce', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				baseSignatureMove: 'metronome', signatureMove: "(Super Glitch)",
				evs: {hp:252, spd:252, def:4}, nature: 'Calm'
			},
			// Voices.
			'+Aldaron': {
				species: 'Conkeldurr', ability: 'Speed Boost', item: 'Assault Vest', gender: 'M',
				moves: ['drainpunch', 'machpunch', 'iciclecrash', 'closecombat', 'earthquake', 'shadowclaw'],
				baseSignatureMove: 'superpower', signatureMove: "Admin Decision",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'+bmelts': {
				species: 'Mewtwo', ability: 'Regenerator', item: 'Mewtwonite X', gender: 'M',
				moves: ['batonpass', 'uturn', 'voltswitch'],
				baseSignatureMove: 'partingshot', signatureMove: "Aaaannnd... he's gone",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'+Cathy': {
				species: 'Aegislash', ability: 'Stance Change', item: 'Life Orb', gender: 'F',
				moves: ['kingsshield', 'shadowsneak', ['calmmind', 'shadowball', 'shadowclaw', 'flashcannon', 'dragontail', 'hyperbeam'][this.random(5)]],
				baseSignatureMove: 'memento', signatureMove: "HP Display Policy",
				evs: {hp:4, atk:252, spa:252}, nature: 'Quiet'
			},
			'+Diatom': {
				species: 'Spiritomb', ability: 'Parental Bond', item: 'Custap Berry', gender: 'M',
				moves: ['psywave', ['poisonfang', 'shadowstrike'][this.random(2)], ['uturn', 'rapidspin'][this.random(2)]],
				baseSignatureMove: 'healingwish', signatureMove: "Be Thankful I Sacrificed Myself",
				evs: {hp:252, def:136, spd:120}, nature: 'Impish'
			},
			'+Limi': {
				species: 'Primeape', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['ingrain', 'doubleedge', 'leechseed'],
				baseSignatureMove: 'growl', signatureMove: "Resilience",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			},
			'+mikel': {
				species: 'Giratina', ability: 'Prankster', item: 'Lum Berry', gender: 'M',
				moves: ['rest', 'recycle', ['toxic', 'willowisp'][this.random(2)]],
				baseSignatureMove: 'swagger', signatureMove: "Trolling Lobby",
				evs: {hp:252, def:128, spd:128}, ivs: {atk:0}, nature: 'Calm'
			},
			'+Great Sage': {
				species: 'Shuckle', ability: 'Harvest', item: 'Leppa Berry', gender: '',
				moves: ['substitute', 'protect', 'batonpass'],
				baseSignatureMove: 'judgment', signatureMove: "Judgment",
				evs: {hp:252, def:28, spd:228}, ivs: {atk:0, def:0, spe:0}, nature: 'Bold'
			},
			'+Redew': {
				species: 'Minun', ability: 'Wonder Guard', item: 'Air Balloon', gender: 'M',
				moves: ['nastyplot', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'recover', signatureMove: "Recover",
				evs:{hp:4, spa:252, spe:252}, nature: 'Modest'
			},
			'+SOMALIA': {
				species: 'Gastrodon', ability: 'Anger Point', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'steameruption', 'earthpower', 'leafstorm', 'substitute'],
				baseSignatureMove: 'energyball', signatureMove: "Ban Everyone",
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest'
			},
			'+TalkTakesTime': {
				species: 'Registeel', ability: 'Flash Fire', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'ironhead', 'bellydrum'],
				baseSignatureMove: 'taunt', signatureMove: "Bot Mute",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant'
			}
		};
		// Generate the team randomly.
		var pool = Object.keys(sets).randomize();
		var ranks = {'~':'admins', '&':'leaders', '@':'mods', '%':'drivers', '+':'voices'};
		var levels = {'~':99, '&':97, '@':96, '%':96, '+':95};
		for (var i = 0; i < 6; i++) {
			var rank = pool[i].charAt(0);
			var set = sets[pool[i]];
			set.level = levels[rank];
			set.name = pool[i];
			if (!set.ivs) {
				set.ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
			} else {
				for (var iv in {hp:31, atk:31, def:31, spa:31, spd:31, spe:31}) {
					set.ivs[iv] = set.ivs[iv] ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) set.evs = {hp:84, atk:84, def:84, spa:84, spd:84, spe:84};
			set.moves = set.moves.sample(3).concat(set.baseSignatureMove);
			team.push(set);
		}

		// Check for Illusion.
		if (team[5].name === '&Slayer95') {
			var temp = team[4];
			team[4] = team[5];
			team[5] = temp;
		}

		return team;
	}
};
