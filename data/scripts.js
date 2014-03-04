exports.BattleScripts = {
	gen: 6,
	runMove: function(move, pokemon, target, sourceEffect) {
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
			this.debug(''+pokemon.id+' INCONSISTENT STATE, ALREADY MOVED: '+pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		}
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
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
		this.runEvent('AfterMove', target, pokemon, move);
		this.runEvent('AfterMoveSelf', pokemon, target, move);
	},
	useMove: function(move, pokemon, target, sourceEffect) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		move = this.getMoveCopy(move);
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
		if (sourceEffect) attrs += '|[from]'+this.getEffect(sourceEffect);
		this.addMove('move', pokemon, movename, target+attrs);

		if (target === false) {
			this.attrLastMove('[notarget]');
			this.add('-notarget');
			return true;
		}

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
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
			if (move.target === 'all') {
				damage = this.runEvent('TryHitField', target, pokemon, move);
			} else {
				damage = this.runEvent('TryHitSide', target, pokemon, move);
			}
			if (!damage) {
				if (damage === false) this.add('-fail', target);
				return true;
			}
			damage = this.moveHit(target, pokemon, move);
		} else if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
			var targets = [];
			if (move.target === 'allAdjacent') {
				var allyActive = pokemon.side.active;
				for (var i=0; i<allyActive.length; i++) {
					if (allyActive[i] && Math.abs(i-pokemon.position)<=1 && i != pokemon.position && !allyActive[i].fainted) {
						targets.push(allyActive[i]);
					}
				}
			}
			var foeActive = pokemon.side.foe.active;
			var foePosition = foeActive.length-pokemon.position-1;
			for (var i=0; i<foeActive.length; i++) {
				if (foeActive[i] && Math.abs(i-foePosition)<=1 && !foeActive[i].fainted) {
					targets.push(foeActive[i]);
				}
			}
			if (!targets.length) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				if (move.selfdestruct && this.gen >= 5) {
					this.faint(pokemon, pokemon, move);
				}
				return true;
			}
			if (targets.length > 1) move.spreadHit = true;
			damage = 0;
			for (var i=0; i<targets.length; i++) {
				damage += (this.tryMoveHit(targets[i], pokemon, move, true) || 0);
			}
			if (!pokemon.hp) pokemon.faint();
		} else {
			if (target.fainted && target.side !== pokemon.side) {
				// if a targeted foe faints, the move is retargeted
				target = this.resolveTarget(pokemon, move);
			}
			if (target.fainted) {
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
	tryMoveHit: function(target, pokemon, move, spreadHit) {
		if (move.selfdestruct && spreadHit) {
			pokemon.hp = 0;
		}

		if ((move.affectedByImmunities && !target.runImmunity(move.type, true)) || (move.isSoundBased && (pokemon !== target || this.gen <= 4) && !target.runImmunity('sound', true))) {
			return false;
		}

		this.setActiveMove(move, pokemon, target);
		var hitResult = true;

		if (typeof move.affectedByImmunities === 'undefined') {
			move.affectedByImmunities = (move.category !== 'Status');
		}

		hitResult = this.runEvent('TryHit', target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		var boostTable = [1, 4/3, 5/3, 2, 7/3, 8/3, 3];

		// calculate true accuracy
		var accuracy = move.accuracy;
		if (accuracy !== true) {
			if (!move.ignoreAccuracy) {
				if (pokemon.boosts.accuracy > 0) {
					accuracy *= boostTable[pokemon.boosts.accuracy];
				} else {
					accuracy /= boostTable[-pokemon.boosts.accuracy];
				}
			}
			if (!move.ignoreEvasion) {
				if (target.boosts.evasion > 0 && !move.ignorePositiveEvasion) {
					accuracy /= boostTable[target.boosts.evasion];
				} else if (target.boosts.evasion < 0) {
					accuracy *= boostTable[-target.boosts.evasion];
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

		var damage = 0;
		pokemon.lastDamage = 0;
		if (move.multihit) {
			var hits = move.multihit;
			if (hits.length) {
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5) {
					var roll = this.random(6);
					hits = [2,2,3,3,4,5][roll];
				} else {
					hits = this.random(hits[0],hits[1]+1);
				}
			}
			hits = Math.floor(hits);
			var nullDamage = true;
			for (var i=0; i<hits && target.hp && pokemon.hp; i++) {
				if (!move.sourceEffect && !move.sleepUsable && pokemon.status === 'slp') break;

				var moveDamage = this.moveHit(target, pokemon, move);
				if (moveDamage === false) break;
				if (nullDamage && (moveDamage || moveDamage === 0)) nullDamage = false;
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage = (moveDamage || 0);
				this.eachEvent('Update');
			}
			if (i === 0) return true;
			if (nullDamage) damage = false;
			this.add('-hitcount', target, i);
		} else {
			damage = this.moveHit(target, pokemon, move);
		}

		if (target && move.category !== 'Status') target.gotAttacked(move, damage, pokemon);

		if (!damage && damage !== 0) return damage;

		if (target && !move.negateSecondary) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
	moveHit: function(target, pokemon, move, moveData, isSecondary, isSelf) {
		var damage;
		move = this.getMoveCopy(move);

		if (!moveData) moveData = move;
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
			hitResult = this.runEvent('TrySecondaryHit', target, pokemon, moveData);
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
				var d = target.heal(Math.round(target.maxhp * moveData.heal[0] / moveData.heal[1]));
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
			if (moveData.forceSwitch || moveData.selfSwitch) {
				didSomething = true; // at least defer the fail message to later
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
				var ability = pokemon.battle.getAbility(pokemon.ability);
				if (ability.onHit) hitResult = this.singleEvent('Hit', ability, {}, target, pokemon, move);
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
				if (moveData.onAfterHit) hitResult = this.singleEvent('AfterHit', moveData, {}, target, pokemon, move);
			}

			if (!hitResult && !didSomething && !moveData.self) {
				if (!isSelf && !isSecondary) {
					if (hitResult === false || didSomething === false) this.add('-fail', target);
				}
				this.debug('move failed because it did nothing');
				return false;
			}
		}
		if (moveData.self) {
			this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
		}
		if (moveData.secondaries) {
			var secondaryRoll;
			for (var i = 0; i < moveData.secondaries.length; i++) {
				secondaryRoll = this.random(100);
				if (typeof moveData.secondaries[i].chance === 'undefined' || secondaryRoll < moveData.secondaries[i].chance) {
					this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch) {
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

	runMegaEvo: function(pokemon) {
		var side = pokemon.side;
		var item = this.getItem(pokemon.item);
		if (!item.megaStone) return false;
		if (side.megaEvo) return false;
		var template = this.getTemplate(item.megaStone);
		if (!template.isMega) return false;
		if (pokemon.baseTemplate.species !== template.baseSpecies) return false;
		if (pokemon.volatiles.mustrecharge) return false;

		// okay, mega evolution is possible
		this.add('-formechange', pokemon, template.species);
		this.add('message', template.baseSpecies+" has Mega Evolved into Mega "+template.baseSpecies+"!");
		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // mega evolution is permanent :o
		pokemon.setAbility(template.abilities['0']);
		pokemon.baseAbility = pokemon.ability;

		side.megaEvo = 1;
		for (var i = 0; i < side.pokemon.length; i++) side.pokemon[i].canMegaEvo = false;
		return true;
	},

	isAdjacent: function(pokemon1, pokemon2) {
		if (!pokemon1.fainted && !pokemon2.fainted && pokemon2.position !== pokemon1.position && Math.abs(pokemon2.position-pokemon1.position) <= 1) {
			return true;
		}
	},
	checkAbilities: function(selectedAbilities, defaultAbilities) {
		if (!selectedAbilities.length) return true;
		var selectedAbility = selectedAbilities.pop();
		var isValid = false;
		for (var i=0; i<defaultAbilities.length; i++) {
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
	canMegaEvo: function(template) {
		if (template.otherFormes) {
			var forme = this.getTemplate(template.otherFormes[0]);
			if (forme.requiredItem) {
				var item = this.getItem(forme.requiredItem);
				if (item.megaStone) return true;
			}
		}
		return false;
	},
	getTeam: function(side, team) {
		var format = side.battle.getFormat();
		if (format.team === 'random') {
			return this.randomTeam(side);
		} else if (typeof format.team === 'string' && format.team.substr(0,6) === 'random') {
			return this[format.team+'Team'](side);
		} else if (team) {
			return team;
		} else {
			return this.randomTeam(side);
		}
	},
	randomCCTeam: function(side) {
		var teamdexno = [];
		var team = [];

		//pick six random pokmeon--no repeats, even among formes
		//also need to either normalize for formes or select formes at random
		//unreleased are okay. No CAP for now, but maybe at some later date
		for (var i=0; i<6; i++)
		{
			while (true) {
				var x=Math.floor(Math.random()*718)+1;
				if (teamdexno.indexOf(x) === -1) {
					teamdexno.push(x);
					break;
				}
			}
		}

		for (var i=0; i<6; i++) {

			//choose forme
			var formes = [];
			for (var j in this.data.Pokedex) {
				if (this.data.Pokedex[j].num === teamdexno[i] && this.getTemplate(this.data.Pokedex[j].species).learnset && this.data.Pokedex[j].species !== 'Pichu-Spiky-eared') {
					formes.push(this.data.Pokedex[j].species);
				}
			}
			var poke = formes.sample();
			var template = this.getTemplate(poke);

			//level balance--calculate directly from stats rather than using some silly lookup table
			var mbstmin = 1307; //sunkern has the lowest modified base stat total, and that total is 807

			var stats = template.baseStats;

			//modified base stat total assumes 31 IVs, 85 EVs in every stat
			var mbst = (stats["hp"]*2+31+21+100)+10;
			mbst += (stats["atk"]*2+31+21+100)+5;
			mbst += (stats["def"]*2+31+21+100)+5;
			mbst += (stats["spa"]*2+31+21+100)+5;
			mbst += (stats["spd"]*2+31+21+100)+5;
			mbst += (stats["spe"]*2+31+21+100)+5;

			var level = Math.floor(100*mbstmin/mbst); //initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"]*2+31+21+100)*level/100+10);
				mbst += Math.floor(((stats["atk"]*2+31+21+100)*level/100+5)*level/100); //since damage is roughly proportional to lvl
				mbst += Math.floor((stats["def"]*2+31+21+100)*level/100+5);
				mbst += Math.floor(((stats["spa"]*2+31+21+100)*level/100+5)*level/100);
				mbst += Math.floor((stats["spd"]*2+31+21+100)*level/100+5);
				mbst += Math.floor((stats["spe"]*2+31+21+100)*level/100+5);

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
			var ability = abilities.sample();

			//random nature
			var nature = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle", "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Naive", "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"].sample();

			//random item--I guess if it's in items.js, it's okay
			var item = Object.keys(this.data.Items).sample();

			//since we're selecting forme at random, we gotta make sure forme/item combo is correct
			if (template.requiredItem) {
				item = template.requiredItem;
			}
			if (this.getItem(item).megaStone) {
				// we'll exclude mega stones for now
				item = Object.keys(this.data.Items).sample();
			}
			while ((poke === 'Arceus' && item.indexOf("plate") > -1) || (poke === 'Giratina' && item === 'griseousorb')) {
				item = Object.keys(this.data.Items).sample();
			}



			//random IVs
			var ivs = {
				hp: Math.floor(Math.random()*32),
				atk: Math.floor(Math.random()*32),
				def: Math.floor(Math.random()*32),
				spa: Math.floor(Math.random()*32),
				spd: Math.floor(Math.random()*32),
				spe: Math.floor(Math.random()*32)
			};

			//random EVs
			var evs = {
				hp: 0,
				atk: 0,
				def: 0,
				spa: 0,
				spd: 0,
				spe: 0
			};
			var s = ["hp","atk","def","spa","spd","spe"];
			var evpool = 510;
			do
			{
				var x = s.sample();
				var y = Math.floor(Math.random()*Math.min(256-evs[x],evpool+1));
				evs[x]+=y;
				evpool-=y;
			} while (evpool > 0);

			//random happiness--useless, since return/frustration is currently a "cheat"
			var happiness = Math.floor(Math.random()*256);

			//random shininess?
			var shiny = (Math.random()*1024<=1);

			//four random unique moves from movepool. don't worry about "attacking" or "viable"
			var moves;
			var pool = ['struggle'];
			if (poke === 'Smeargle') {
				pool = Object.keys(this.data.Movedex).exclude('struggle', 'chatter');
			} else if (template.learnset) {
				pool = Object.keys(template.learnset);
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves=pool.sample(4);
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
	randomSet: function(template, i) {
		if (i === undefined) i = 1;
		template = this.getTemplate(template);
		var name = template.name;

		if (!template.exists || (!template.viableMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			var stack = 'Template incompatible with random battles: '+name;
			var fakeErr = {stack: stack};
			require('../crashlogger.js')(fakeErr, 'The randbat set generator');
		}

		var moveKeys = Object.keys(template.viableMoves || template.learnset).randomize();
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
		var hasStab = {};
		hasStab[template.types[0]] = true;
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasStab[template.types[1]] = true;
			hasType[template.types[1]] = true;
		}

		var damagingMoves = [];
		var damagingMoveIndex = {};
		var hasMove = {};
		var counter = {};
		var setupType = '';

		var j=0;
		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length<4 && j<moveKeys.length) {
				var moveid = toId(moveKeys[j]);
				j++;
				if (moveid.substr(0,11) === 'hiddenpower') {
					if (!hasMove['hiddenpower']) {
						hasMove['hiddenpower'] = true;
					} else {
						continue;
					}
				}
				moves.push(moveid);
			}

			damagingMoves = [];
			damagingMoveIndex = {};
			hasMove = {};
			counter = {
				Physical: 0, Special: 0, Status: 0, damage: 0,
				technician: 0, skilllink: 0, contrary: 0, sheerforce: 0, ironfist: 0, adaptability: 0, hustle: 0,
				blaze: 0, overgrow: 0, swarm: 0, torrent: 0,
				recoil: 0, inaccurate: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0
			};
			// Iterate through all moves we've chosen so far and keep track of what they do:
			for (var k=0; k<moves.length; k++) {
				var move = this.getMove(moves[k]);
				var moveid = move.id;
				// Keep track of all moves we have:
				hasMove[moveid] = true;
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
				if (move.basePower && move.basePower <= 60) {
					counter['technician']++;
				}
				// Moves that hit multiple times:
				if (move.multihit && move.multihit[1] === 5) {
					counter['skilllink']++;
				}
				// Punching moves:
				if (move.isPunchAttack) {
					counter['ironfist']++;
				}
				// Recoil:
				if (move.recoil) {
					counter['recoil']++;
				}
				// Moves which have a base power:
				if (move.basePower || move.basePowerCallback) {
					if (hasType[move.type]) {
						counter['adaptability']++;
						// STAB:
						// Bounce, Aeroblast aren't considered STABs.
						// If they're in the Pokémon's movepool and are STAB, consider the Pokémon not to have that type as a STAB.
						if (moveid === 'aeroblast' || moveid === 'bounce') hasStab[move.type] = false;
					}
					if (move.category === 'Physical') counter['hustle']++;
					if (move.type === 'Fire') counter['blaze']++;
					if (move.type === 'Grass') counter['overgrow']++;
					if (move.type === 'Bug') counter['swarm']++;
					if (move.type === 'Water') counter['torrent']++;
					// Make sure not to count Knock Off, Rapid Spin, etc.
					if (move.basePower > 20 || move.multihit || move.basePowerCallback) {
						damagingMoves.push(move);
						damagingMoveIndex[moveid] = k;
					}
				}
				// Moves with secondary effects:
				if (move.secondary) {
					if (move.secondary.chance < 50) {
						counter['sheerforce'] -= 5;
					} else {
						counter['sheerforce']++;
					}
				}
				// Moves with low accuracy:
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) {
					counter['inaccurate']++;
				}
				// Moves which drop stats:
				var ContraryMove = {
					leafstorm: 1, overheat: 1, closecombat: 1, superpower: 1, vcreate: 1
				};
				if (ContraryMove[moveid]) {
					counter['contrary']++;
				}
				// Moves that boost Attack:
				var PhysicalSetup = {
					swordsdance:1, dragondance:1, coil:1, bulkup:1, curse:1, bellydrum:1, shiftgear:1, honeclaws:1, howl:1
				};
				// Moves which boost Special Attack:
				var SpecialSetup = {
					nastyplot:1, tailglow:1, quiverdance:1, calmmind:1, chargebeam:1
				};
				// Moves which boost Attack AND Special Attack:
				var MixedSetup = {
					growth:1, workup:1, shellsmash:1
				};

				if (PhysicalSetup[moveid]) {
					counter['physicalsetup']++;
				}
				if (SpecialSetup[moveid]) {
					counter['specialsetup']++;
				}
				if (MixedSetup[moveid]) {
					counter['mixedsetup']++;
				}
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
			for (var k=0; k<moves.length; k++) {
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
					if (!setupType && !hasMove['substitute'] && !hasMove['cosmicpower']) rejected = true;
					break;

				// we only need to set up once
				case 'swordsdance': case 'dragondance': case 'coil': case 'curse': case 'bulkup': case 'bellydrum':
					if (counter.Physical < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'nastyplot': case 'tailglow': case 'quiverdance': case 'calmmind':
					if (counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'shellsmash': case 'growth': case 'workup':
					if (counter.Physical+counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					isSetup = true;
					break;

				// bad after setup
				case 'seismictoss': case 'nightshade': case 'superfang':
					if (setupType) rejected = true;
					break;
				case 'knockoff': case 'perishsong': case 'magiccoat': case 'spikes':
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
					if (setupType || (hasMove['rest'] && hasMove['sleeptalk']) || hasMove['trickroom'] || hasMove['reflect'] || hasMove['lightscreen'] || hasMove['batonpass']) rejected = true;
					break;
				case 'dragontail': case 'circlethrow':
					if (hasMove['agility'] || hasMove['rockpolish']) rejected = true;
					if (hasMove['whirlwind'] || hasMove['roar'] || hasMove['encore']) rejected = true;
					break;

				// bit redundant to have both
				// Attacks:
				case 'flamethrower': case 'fierydance':
					if (hasMove['lavaplume'] || hasMove['overheat'] || hasMove['fireblast'] || hasMove['blueflare']) rejected = true;
					break;
				case 'overheat':
					if (setupType === 'Special' || hasMove['fireblast']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'surf':
					if (hasMove['scald'] || hasMove['hydropump']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['scald']) rejected = true;
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
					if ((!hasMove['sunnyday'] && template.species !== 'Ninetales') || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if ((!setupType && hasMove['leafstorm']) || hasMove['petaldance']) rejected = true;
					break;
				case 'leafstorm':
					if (setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['sunnyday']) rejected = true;
					break;
				case 'firepunch':
					if (hasMove['flareblitz']) rejected = true;
					break;
				case 'bugbite':
					if (hasMove['uturn']) rejected = true;
					break;
				case 'crosschop': case 'highjumpkick':
					if (hasMove['closecombat']) rejected = true;
					break;
				case 'drainpunch':
					if (hasMove['closecombat'] || hasMove['highjumpkick'] || hasMove['crosschop']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || hasMove['voltswitch'] || hasMove['thunder']) rejected = true;
					break;
				case 'discharge': case 'thunder':
					if (hasMove['voltswitch']) rejected = true;
					break;
				case 'rockslide': case 'rockblast':
					if (hasMove['stoneedge'] || hasMove['headsmash']) rejected = true;
					break;
				case 'stoneedge':
					if (hasMove['headsmash']) rejected = true;
					break;
				case 'bonemerang': case 'earthpower': case 'bulldoze':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['outrage'] || hasMove['dragontail']) rejected = true;
					break;
				case 'ancientpower':
					if (hasMove['paleowave']) rejected = true;
					break;
				case 'dragonpulse':
					if (hasMove['dracometeor']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['doubleedge'] || hasMove['tailslap']) rejected = true;
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
				case 'hiddenpowerice':
					if (hasMove['icywind']) rejected = true;
					break;
				case 'drainingkiss':
					if (hasMove['dazzlinggleam']) rejected = true;
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
					if (hasMove['trick'] || hasMove['switcheroo']) rejected = true;
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

				// These moves can be used even if we aren't setting up to use them:
				var SetupException = {
					overheat:1, dracometeor:1, leafstorm:1,
					voltswitch:1, uturn:1,
					suckerpunch:1, extremespeed:1
				};
				if (move.category === 'Special' && setupType === 'Physical' && !SetupException[move.id]) {
					rejected = true;
				}
				if (move.category === 'Physical' && setupType === 'Special' && !SetupException[move.id]) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if (setupType === 'Physical' && move.category !== 'Physical' && counter['Physical'] < 2) {
					rejected = true;
				}
				if (setupType === 'Special' && move.category !== 'Special' && counter['Special'] < 2) {
					rejected = true;
				}

				// Remove rejected moves from the move list.
				if (rejected && j<moveKeys.length) {
					moves.splice(k,1);
					break;
				}

				// handle HP IVs
				if (move.id === 'hiddenpower') {
					var HPivs = this.getType(move.type).HPivs;
					for (var iv in HPivs) {
						ivs[iv] = HPivs[iv];
					}
				}
			}
			if (j<moveKeys.length && moves.length === 4) {
				// Move post-processing:
				if (damagingMoves.length===0) {
					// A set shouldn't have no attacking moves
					moves.splice(Math.floor(Math.random()*moves.length),1);
				} else if (damagingMoves.length===1) {
					// Night Shade, Seismic Toss, etc. don't count:
					if (!damagingMoves[0].damage) {
						damagingid = damagingMoves[0].id;
						damagingType = damagingMoves[0].type;
						var replace = false;
						if (damagingid === 'suckerpunch' || damagingid === 'counter' || damagingid === 'mirrorcoat') {
							// A player shouldn't be forced to rely upon the opponent attacking them to do damage.
							if (!hasMove['encore'] && Math.random()*2>1) replace = true;
						} else if (damagingid === 'focuspunch') {
							// Focus Punch is a bad idea without a sub:
							if (!hasMove['substitute']) replace = true;
						} else if (damagingid.substr(0,11) === 'hiddenpower' && damagingType === 'Ice') {
							// Mono-HP-Ice is never acceptable.
							replace = true;
						} else {
							// If you have one attack, and it's not STAB, Ice, Fire, or Ground, reject it.
							// Mono-Ice/Ground/Fire is only acceptable if the Pokémon's STABs are one of: Poison, Psychic, Steel, Normal, Grass.
							if (!hasStab[damagingType]) {
								if (damagingType === 'Ice' || damagingType === 'Fire' || damagingType === 'Ground') {
									if (!hasStab['Poison'] && !hasStab['Psychic'] && !hasStab['Steel'] && !hasStab['Normal'] && !hasStab['Grass']) {
										replace = true;
									}
								} else {
									replace = true;
								}
							}
						}
						if (replace) moves.splice(damagingMoveIndex[damagingid],1);
					}
				} else if (damagingMoves.length===2) {
					// If you have two attacks, neither is STAB, and the combo isn't Ice/Electric, Ghost/Fighting, or Dark/Fighting, reject one of them at random.
					var type1 = damagingMoves[0].type, type2 = damagingMoves[1].type;
					var typeCombo = [type1, type2].sort().join('/');
					var rejectCombo = true;
					if (!type1 in hasStab && !type2 in hasStab) {
						if (typeCombo === 'Electric/Ice' || typeCombo === 'Fighting/Ghost' || typeCombo === 'Dark/Fighting') rejectCombo = false;
					} else {
						rejectCombo = false;
					}
					if (rejectCombo) moves.splice(Math.floor(Math.random()*moves.length),1);
				} else {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					var isStab = false;
					for (var l=0; l<damagingMoves.length; l++) {
						if (hasStab[damagingMoves[l].type]) {
							isStab = true;
							break;
						}
					}
					if (!isStab) moves.splice(Math.floor(Math.random()*moves.length),1);
				}
			}
		} while (moves.length<4 && j<moveKeys.length);

		// any moveset modification goes here
		//moves[0] = 'Safeguard';
		{
			var abilities = [template.abilities['0']];
			if (template.abilities['1']) {
				abilities.push(template.abilities['1']);
			}
			if (template.abilities['H']) {
				abilities.push(template.abilities['H']);
			}
			abilities.sort(function(a,b){
				return this.getAbility(b).rating - this.getAbility(a).rating;
			}.bind(this));
			var ability0 = this.getAbility(abilities[0]);
			var ability1 = this.getAbility(abilities[1]);
			var ability = ability0.name;
			if (abilities[1]) {

				if (ability0.rating <= ability1.rating) {
					if (Math.random()*2<1) {
						ability = ability1.name;
					}
				} else if (ability0.rating - 0.6 <= ability1.rating) {
					if (Math.random()*3<1) {
						ability = ability1.name;
					}
				}

				var rejectAbility = false;
				if (ability === 'Blaze' && !counter['blaze']) {
					rejectAbility = true;
				}
				if (ability === 'Overgrow' && !counter['overgrow']) {
					rejectAbility = true;
				}
				if (ability === 'Swarm' && !counter['swarm']) {
					rejectAbility = true;
				}
				if (ability === 'Torrent' && !counter['torrent']) {
					rejectAbility = true;
				}
				if (ability === 'Contrary' && !counter['contrary']) {
					rejectAbility = true;
				}
				if (ability === 'Technician' && !counter['technician']) {
					rejectAbility = true;
				}
				if (ability === 'Skill Link' && !counter['skilllink']) {
					rejectAbility = true;
				}
				if (ability === 'Iron Fist' && !counter['ironfist']) {
					rejectAbility = true;
				}
				if (ability === 'Adaptability' && !counter['adaptability']) {
					rejectAbility = true;
				}
				if ((ability === 'Rock Head' || ability === 'Reckless') && !counter['recoil']) {
					rejectAbility = true;
				}
				if ((ability === 'No Guard' || ability === 'Compoundeyes') && !counter['inaccurate']) {
					rejectAbility = true;
				}
				if ((ability === 'Sheer Force' || ability === 'Serene Grace') && !counter['sheerforce']) {
					rejectAbility = true;
				}
				if (ability === 'Hustle' && !counter['hustle']) {
					rejectAbility = true;
				}
				if (ability === 'Simple' && !setupType && !hasMove['flamecharge'] && !hasMove['stockpile']) {
					rejectAbility = true;
				}
				if (ability === 'Prankster' && !counter['Status']) {
					rejectAbility = true;
				}
				if (ability === 'Defiant' && !counter['Physical'] && !hasMove['batonpass']) {
					rejectAbility = true;
				}
				// below 2 checks should be modified, when it becomes possible, to check if the team contains rain or sun
				if (ability === 'Swift Swim' && !hasMove['raindance']) {
					rejectAbility = true;
				}
				if (ability === 'Chlorophyll' && !hasMove['sunnyday']) {
					rejectAbility = true;
				}
				if (ability === 'Moody' && template.id !== 'bidoof') {
					rejectAbility = true;
				}
				if (ability === 'Limber' && template.id === 'stunfisk') {
					rejectAbility = true;
				}
				if (ability === 'Lightningrod' && template.types.indexOf('Ground') >= 0) {
					rejectAbility = true;
				}

				if (rejectAbility) {
					if (ability === ability1.name) { // or not
						ability = ability0.name;
					} else if (ability1.rating > 0) { // only switch if the alternative doesn't suck
						ability = ability1.name;
					}
				}
				if ((abilities[0] === 'Guts' || abilities[1] === 'Guts' || abilities[2] === 'Guts') && ability !== 'Quick Feet' && hasMove['facade']) {
					ability = 'Guts';
				}
				if ((abilities[0] === 'Swift Swim' || abilities[1] === 'Swift Swim' || abilities[2] === 'Swift Swim') && hasMove['raindance']) {
					ability = 'Swift Swim';
				}
				if ((abilities[0] === 'Chlorophyll' || abilities[1] === 'Chlorophyll' || abilities[2] === 'Chlorophyll') && ability !== 'Solar Power' && hasMove['sunnyday']) {
					ability = 'Chlorophyll';
				}
				if (template.id === 'combee') {
					// it always gets Hustle but its only physical move is Endeavor, which loses accuracy
					ability = 'Honey Gather';
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

			var shouldMegaEvo = this.canMegaEvo(template);
			if (template.species === 'Alakazam' || template.species === 'Scizor' || template.species === 'Garchomp') {
				shouldMegaEvo = 'maybe';
			}
			
			if (template.species === 'Latios' || template.species === 'Latias') {
				shouldMegaEvo = false;
			}

			item = 'Leftovers';
			if (template.requiredItem) {
				item = template.requiredItem;
			} else if (template.species === 'Rotom-Fan') {
				// this is just to amuse myself
				// do we really have to keep this
				item = 'Air Balloon';
			} else if (template.species === 'Delibird') {
				// to go along with the Christmas Delibird set
				item = 'Leftovers';

			// First, the extra high-priority items

			} else if (ability === 'Imposter') {
				item = 'Choice Scarf';
			} else if (hasMove["magikarpsrevenge"]) {
				item = 'Choice Band';
			} else if (ability === 'Wonder Guard') {
				item = 'Focus Sash';
			} else if (template.species === 'Unown') {
				item = 'Choice Specs';
			} else if (hasMove['trick'] && hasMove['gyroball'] && (ability === 'Levitate' || hasType['Flying'])) {
				item = 'Macho Brace';
			} else if (hasMove['trick'] && hasMove['gyroball']) {
				item = 'Iron Ball';
			} else if (hasMove['trick'] || hasMove['switcheroo']) {
				var randomNum = Math.random()*2;
				if (counter.Physical >= 3 && (template.baseStats.spe >= 95 || randomNum>1)) {
					item = 'Choice Band';
				} else if (counter.Special >= 3 && (template.baseStats.spe >= 95 || randomNum>1)) {
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
			} else if (template.species === 'Pikachu') {
				item = 'Light Ball';
			} else if (template.species === 'Clamperl') {
				item = 'DeepSeaTooth';
			} else if (template.species === 'Spiritomb') {
				item = 'Leftovers';
			} else if (template.species === 'Dusclops') {
				item = 'Eviolite';
			} else if (shouldMegaEvo === true) {
				item = this.getTemplate(template.otherFormes[0]).requiredItem;
				// Mega Mawile should never start with Sheer Force
				if (template.species === 'Mawile') ability = 'Intimidate';
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
			} else if (hasMove['sandstorm']) { // lol
				item = 'Smooth Rock';
			} else if (hasMove['hail']) { // lol
				item = 'Icy Rock';
			} else if (ability === 'Magic Guard' && hasMove['psychoshift']) {
				item = 'Flame Orb';
			} else if (ability === 'Sheer Force' || ability === 'Magic Guard') {
				item = 'Life Orb';
			} else if (ability === 'Unburden') {
				item = 'Red Card';
				// Give Unburden mons a Normal Gem if they have a Normal-type attacking move
				for (var m in moves) {
					var move = this.getMove(moves[m]);
					if (move.type === 'Normal' && (move.basePower || move.basePowerCallback)) {
						item = 'Normal Gem';
						break;
					}
				}

			// medium priority

			} else if (shouldMegaEvo) {
				item = this.getTemplate(template.otherFormes[0]).requiredItem;
			} else if (ability === 'Guts') {
				if (hasMove['drainpunch']) {
					item = 'Flame Orb';
				} else {
					item = 'Toxic Orb';
				}
				if ((hasMove['return'] || hasMove['hyperfang']) && !hasMove['facade']) {
					// lol no
					for (var j=0; j<moves.length; j++) {
						if (moves[j] === 'Return' || moves[j] === 'HyperFang') {
							moves[j] = 'Facade';
							break;
						}
					}
				}
			} else if (ability === 'Marvel Scale' && hasMove['psychoshift']) {
				item = 'Flame Orb';
			} else if (hasMove['reflect'] || hasMove['lightscreen']) {
				// less priority than if you'd had both
				item = 'Light Clay';
			} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['suckerpunch'] && !hasMove['flamecharge'] && !hasMove['rapidspin']) {
				if (Math.random()*3 > 1) {
					item = 'Choice Band';
				} else {
					item = 'Expert Belt';
				}
			} else if (counter.Special >= 4) {
				if (Math.random()*3 > 1) {
					item = 'Choice Specs';
				} else {
					item = 'Expert Belt';
				}
			} else if (this.getEffectiveness('Ground', template) >= 2 && !hasType['Poison'] && ability !== 'Levitate' && !hasMove['magnetrise']) {
				item = 'Air Balloon';
			} else if ((hasMove['eruption'] || hasMove['waterspout']) && !counter['Status']) {
				item = 'Choice Scarf';
			} else if (hasMove['substitute'] || hasMove['detect'] || hasMove['protect'] || ability === 'Moody') {
				item = 'Leftovers';
			} else if ((hasMove['flail'] || hasMove['reversal']) && !hasMove['endure'] && ability !== 'Sturdy') {
				item = 'Focus Sash';
			} else if (ability === 'Iron Barbs' || ability === 'Rough Skin') {
				item = 'Rocky Helmet';
			} else if ((template.baseStats.hp+75)*(template.baseStats.def+template.baseStats.spd+175) > 60000 || template.species === 'Skarmory' || template.species === 'Forretress') {
				// skarmory and forretress get exceptions for their typing
				item = 'Leftovers';
			} else if (counter.Physical + counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Physical + counter.Special >= 4 && template.baseStats.def + template.baseStats.spd > 179) {
				item = 'Assault Vest';
			} else if (counter.Physical + counter.Special >= 4) {
				item = 'Expert Belt';
			} else if (i===0 && ability !== 'Sturdy' && !counter['recoil']) {
				item = 'Focus Sash';
			} else if (hasMove['outrage']) {
				item = 'Lum Berry';

			// this is the "REALLY can't think of a good item" cutoff
			// why not always Leftovers? Because it's boring. :P

			} else if (counter.Physical + counter.Special >= 2 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd > 315) {
				item = 'Weakness Policy';
			} else if (hasType['Flying'] || ability === 'Levitate') {
				item = 'Leftovers';
			} else if (this.getEffectiveness('Ground', template) >= 1 && !hasType['Poison'] && ability !== 'Levitate' && !hasMove['magnetrise']) {
				item = 'Air Balloon';
			} else if (hasType['Poison']) {
				item = 'Black Sludge';
			} else if (counter.Status <= 1) {
				item = 'Life Orb';
			} else {
				item = 'Leftovers';
			}

			// For Trick / Switcheroo
			if (item === 'Leftovers' && hasType['Poison']) {
				item = 'Black Sludge';
			}
		}

		// 95-86-82-78-74-70
		var levelScale = {
			LC: 95,
			NFE: 90,
			'LC Uber': 86,
			NU: 86,
			BL3: 84,
			RU: 82,
			BL2: 80,
			UU: 78,
			BL: 76,

			'Limbo': 86,
			'Limbo C': 83,
			'Limbo B': 80,
			'Limbo A': 77,

			OU: 74,
			CAP: 74,
			Unreleased: 74,
			Uber: 70
		};
		var customScale = {
			// Really bad Pokemon and jokemons
			Azurill: 99, Burmy: 99, Cascoon: 99, Caterpie: 99, Cleffa: 99, Combee: 99, Feebas: 99, Igglybuff: 99, Happiny: 99, Hoppip: 99,
			Kakuna: 99, Kricketot: 99, Ledyba: 99, Magikarp: 99, Metapod: 99, Pichu: 99, Ralts: 99, Sentret: 99, Shedinja: 99,
			Silcoon: 99, Slakoth: 99, Sunkern: 99, Tynamo: 99, Tyrogue: 99, Unown: 99, Weedle: 99, Wurmple: 99, Zigzagoon: 99,
			Clefairy: 95, Delibird: 95, "Farfetch'd": 95, Jigglypuff: 95, Kirlia: 95, Ledian: 95, Luvdisc: 95, Marill: 95, Skiploom: 95,
			Pachirisu: 90,

			// Eviolite
			Ferroseed: 95, Misdreavus: 95, Munchlax: 95, Murkrow: 95, Natu: 95,
			Gligar: 90, Metang: 90, Monferno: 90, Roselia: 90, Seadra: 90, Togetic: 90, Wartortle: 90, Whirlipede: 90,
			Dusclops: 84, Porygon2: 82, Chansey: 78,

			// Weather or teammate dependent
			Snover: 95, Vulpix: 95, Ninetales: 78, Tentacruel: 78, Toxicroak: 78,

			// Banned mega
			Kangaskhan: 72, Gengar: 72, Blaziken: 72,

			// Holistic judgment
			Carvanha: 90, Lucario: 72, Genesect: 72, Kyurem: 78
		};
		var level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		if (template.name === 'Serperior' && ability === 'Contrary') level = 74;
		if (template.name === 'Magikarp' && hasMove['magikarpsrevenge']) level = 85;
		if (template.name === 'Spinda' && ability !== 'Contrary') level = 95;

		return {
			name: name,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: (Math.random()*1024<=1)
		};
	},
	randomTeam: function(side) {
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		for (var i in this.data.FormatsData) {
			if (this.data.FormatsData[i].viableMoves && !this.data.FormatsData[i].isNonstandard && !this.getTemplate(i).evos.length) {
				keys.push(i);
			}
		}
		keys = keys.randomize();

		// PotD stuff
		var potd = {};
		if ('Rule:potd' in this.getFormat().banlistTable) {
			potd = this.getTemplate(config.potd);
		}

		var typeCount = {};
		var typeComboCount = {};
		var baseFormes = {};
		var uberCount = 0;
		var nuCount = 0;
		var megaCount = 0;

		for (var i=0; i<keys.length && pokemonLeft < 6; i++) {
			var template = this.getTemplate(keys[i]);
			if (!template || !template.name || !template.types) continue;
			var tier = template.tier;
			// This tries to limit the amount of Ubers and NUs on one team to promote "fun":
			// LC Pokemon have a hard limit in place at 2; NFEs/NUs/Ubers are also limited to 2 but have a 20% chance of being added anyway.
			// LC/NFE/NU Pokemon all share a counter (so having one of each would make the counter 3), while Ubers have a counter of their own.
			if (tier === 'LC' && nuCount > 1) continue;
			if ((tier === 'NFE' || tier === 'NU') && nuCount > 1 && Math.random()*5>1) continue;
			if (tier === 'Uber' && uberCount > 1 && Math.random()*5>1) continue;

			// CAPs have 20% the normal rate
			if (tier === 'CAP' && Math.random()*5>1) continue;
			// Arceus formes have 1/18 the normal rate each (so Arceus as a whole has a normal rate)
			if (keys[i].substr(0,6) === 'arceus' && Math.random()*18>1) continue;
			// Basculin formes have 1/2 the normal rate each (so Basculin as a whole has a normal rate)
			if (keys[i].substr(0,8) === 'basculin' && Math.random()*2>1) continue;
			// Genesect formes have 1/5 the normal rate each (so Genesect as a whole has a normal rate)
			if (keys[i].substr(0,8) === 'genesect' && Math.random()*5>1) continue;
			// Not available on XY
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Limit 2 of any type
			var types = template.types;
			var skip = false;
			for (var t=0; t<types.length; t++) {
				if (typeCount[types[t]] > 1 && Math.random()*5>1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd && potd.name && potd.types) {
				// The Pokemon of the Day belongs in slot 2
				if (i===1) {
					template = potd;
					if (template.species === 'Magikarp') {
						template.viableMoves = {magikarpsrevenge:1, splash:1, bounce:1};
					} else if (template.species === 'Delibird') {
						template.viableMoves = {present:1, bestow:1};
					}
				} else if (template.species === potd.species) {
					continue; // No, thanks, I've already got one
				}
			}

			var set = this.randomSet(template, i);

			// Limit 1 of any type combination
			var typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Limit the number of Megas to one, just like in-game
			if (this.getItem(set.item).megaStone && megaCount > 0) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;
			baseFormes[template.baseSpecies] = 1;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			pokemonLeft++;
			// Now that our Pokemon has passed all checks, we can increment the type counter
			for (var t=0; t<types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU and mega counter
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'NU' || tier === 'NFE' || tier === 'LC') {
				nuCount++;
			}
			if (this.getItem(set.item).megaStone) megaCount++;

		}
		return pokemon;
	},
	randomDoublesTeam: function(side) {
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		for (var i in this.data.FormatsData) {
			if (this.data.FormatsData[i].viableMoves && !this.data.FormatsData[i].isNonstandard && !this.getTemplate(i).evos.length) {
				keys.push(i);
			}
		}
		keys = keys.randomize();

		// PotD stuff
		var potd = {};
		if ('Rule:potd' in this.getFormat().banlistTable) {
			potd = this.getTemplate(config.potd);
		}

		var typeCount = {};
		var typeComboCount = {};
		var baseFormes = {};
		var megaCount = 0;

		for (var i=0; i<keys.length && pokemonLeft < 6; i++) {
			var template = this.getTemplate(keys[i]);
			if (!template || !template.name || !template.types) continue;
			var tier = template.tier;
			// Arceus formes have 1/18 the normal rate each (so Arceus as a whole has a normal rate)
			if (keys[i].substr(0,6) === 'arceus' && Math.random()*18>1) continue;
			// Basculin formes have 1/2 the normal rate each (so Basculin as a whole has a normal rate)
			if (keys[i].substr(0,8) === 'basculin' && Math.random()*2>1) continue;
			// Genesect formes have 1/5 the normal rate each (so Genesect as a whole has a normal rate)
			if (keys[i].substr(0,8) === 'genesect' && Math.random()*5>1) continue;
			// Not available on XY
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Limit 2 of any type
			var types = template.types;
			var skip = false;
			for (var t=0; t<types.length; t++) {
				if (typeCount[types[t]] > 1 && Math.random()*5>1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// More potd stuff
			if (potd && potd.name && potd.types) {
				// The Pokemon of the Day belongs in slot 2
				if (i===1) {
					template = potd;
					if (template.species === 'Magikarp') {
						template.viableMoves = {magikarpsrevenge:1, splash:1, bounce:1};
					} else if (template.species === 'Delibird') {
						template.viableMoves = {present:1, bestow:1};
					}
				} else if (template.species === potd.species) {
					continue; // No, thanks, I've already got one
				}
			}

			var set = this.randomDoublesSet(template);

			// Limit 1 of any type combination
			var typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Limit the number of Megas to one, just like in-game
			if (this.getItem(set.item).megaStone && megaCount > 0) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;
			baseFormes[template.baseSpecies] = 1;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			pokemonLeft++;
			// Now that our Pokemon has passed all checks, we can increment the type counter
			for (var t=0; t<types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment mega counter
			if (this.getItem(set.item).megaStone) megaCount++;

		}
		return pokemon;
	},
	randomDoublesSet: function(template) {
		template = this.getTemplate(template);
		var name = template.name;

		if (!template.exists || (!template.viableDoublesMoves && !template.viableMoves && !template.learnset)) {
			template = this.getTemplate('unown');

			var stack = 'Template incompatible with random battles: '+name;
			var fakeErr = {stack: stack};
			require('../crashlogger.js')(fakeErr, 'The randbat set generator');
		}

		var moveKeys = Object.keys(template.viableDoublesMoves || template.viableMoves || template.learnset).randomize();
		// Make protect viable for everyone
		// Delete this once all Pokémon have viable doubles sets
		var hasProtectingMove = false;
		for (var i = 0; i < moveKeys.length && !hasProtectingMove; i++) {
			if (moveKeys[i] in {'protect':1,'detect':1,'kingsshield':1,'spikyshield':1}) hasProtectingMove = true;
		}
		if (!hasProtectingMove) {
			if (template.learnset && 'protect' in template.learnset) moveKeys.push('protect');
		}
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
		var hasStab = {};
		hasStab[template.types[0]] = true;
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasStab[template.types[1]] = true;
			hasType[template.types[1]] = true;
		}

		var damagingMoves = [];
		var damagingMoveIndex = {};
		var hasMove = {};
		var counter = {};
		var setupType = '';

		var j=0;
		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length<4 && j<moveKeys.length) {
				var moveid = toId(moveKeys[j]);
				j++;
				if (moveid.substr(0,11) === 'hiddenpower') {
					if (!hasMove['hiddenpower']) {
						hasMove['hiddenpower'] = true;
					} else {
						continue;
					}
				}
				moves.push(moveid);
			}

			damagingMoves = [];
			damagingMoveIndex = {};
			hasMove = {};
			counter = {
				Physical: 0, Special: 0, Status: 0, damage: 0,
				technician: 0, skilllink: 0, contrary: 0, sheerforce: 0, ironfist: 0, adaptability: 0, hustle: 0,
				blaze: 0, overgrow: 0, swarm: 0, torrent: 0,
				recoil: 0, inaccurate: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0
			};
			// Iterate through all moves we've chosen so far and keep track of what they do:
			for (var k=0; k<moves.length; k++) {
				var move = this.getMove(moves[k]);
				var moveid = move.id;
				// Keep track of all moves we have:
				hasMove[moveid] = true;
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
				if (move.basePower && move.basePower <= 60) {
					counter['technician']++;
				}
				// Moves that hit multiple times:
				if (move.multihit && move.multihit[1] === 5) {
					counter['skilllink']++;
				}
				// Punching moves:
				if (move.isPunchAttack) {
					counter['ironfist']++;
				}
				// Recoil:
				if (move.recoil) {
					counter['recoil']++;
				}
				// Moves which have a base power:
				if (move.basePower || move.basePowerCallback) {
					if (hasType[move.type]) {
						counter['adaptability']++;
						// STAB:
						// Bounce, Aeroblast aren't considered STABs.
						// If they're in the Pokémon's movepool and are STAB, consider the Pokémon not to have that type as a STAB.
						if (moveid === 'aeroblast' || moveid === 'bounce') hasStab[move.type] = false;
					}
					if (move.category === 'Physical') counter['hustle']++;
					if (move.type === 'Fire') counter['blaze']++;
					if (move.type === 'Grass') counter['overgrow']++;
					if (move.type === 'Bug') counter['swarm']++;
					if (move.type === 'Water') counter['torrent']++;
					// Make sure not to count Rapid Spin, etc.
					if (move.basePower > 20 || move.multihit || move.basePowerCallback) {
						damagingMoves.push(move);
						damagingMoveIndex[moveid] = k;
					}
				}
				// Moves with secondary effects:
				if (move.secondary) {
					if (move.secondary.chance < 50) {
						counter['sheerforce'] -= 5;
					} else {
						counter['sheerforce']++;
					}
				}
				// Moves with low accuracy:
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) {
					counter['inaccurate']++;
				}
				// Moves which drop stats:
				var ContraryMove = {
					leafstorm: 1, overheat: 1, closecombat: 1, superpower: 1, vcreate: 1
				};
				if (ContraryMove[moveid]) {
					counter['contrary']++;
				}
				// Moves that boost Attack:
				var PhysicalSetup = {
					swordsdance:1, dragondance:1, coil:1, bulkup:1, curse:1, bellydrum:1, shiftgear:1, honeclaws:1, howl:1
				};
				// Moves which boost Special Attack:
				var SpecialSetup = {
					nastyplot:1, tailglow:1, quiverdance:1, calmmind:1, chargebeam:1
				};
				// Moves which boost Attack AND Special Attack:
				var MixedSetup = {
					growth:1, workup:1, shellsmash:1
				};

				if (PhysicalSetup[moveid]) {
					counter['physicalsetup']++;
				}
				if (SpecialSetup[moveid]) {
					counter['specialsetup']++;
				}
				if (MixedSetup[moveid]) {
					counter['mixedsetup']++;
				}
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
			for (var k=0; k<moves.length; k++) {
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
					if (!setupType && !hasMove['substitute'] && !hasMove['cosmicpower']) rejected = true;
					break;

				// we only need to set up once
				case 'swordsdance': case 'dragondance': case 'coil': case 'curse': case 'bulkup': case 'bellydrum':
					if (counter.Physical < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'nastyplot': case 'tailglow': case 'quiverdance': case 'calmmind':
					if (counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					isSetup = true;
					break;
				case 'shellsmash': case 'growth': case 'workup':
					if (counter.Physical+counter.Special < 2 && !hasMove['batonpass']) rejected = true;
					if (setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					isSetup = true;
					break;

				// bad after setup
				case 'seismictoss': case 'nightshade': case 'superfang':
					if (setupType) rejected = true;
					break;
				case 'knockoff': case 'perishsong': case 'magiccoat': case 'spikes':
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
					if (setupType || (hasMove['rest'] && hasMove['sleeptalk']) || hasMove['trickroom'] || hasMove['reflect'] || hasMove['lightscreen'] || hasMove['batonpass']) rejected = true;
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
					if ((!hasMove['sunnyday'] && template.species !== 'Ninetales') || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if ((!setupType && hasMove['leafstorm']) || hasMove['petaldance']) rejected = true;
					break;
				case 'leafstorm':
					if (setupType && hasMove['gigadrain']) rejected = true;
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
				case 'stoneedge':
					if (hasMove['rockslide']) rejected = true;
					break;
				case 'stoneedge':
					if (hasMove['headsmash']) rejected = true;
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
				case 'return':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['doubleedge'] || hasMove['tailslap']) rejected = true;
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
				case 'hiddenpowerice':
					if (hasMove['icywind']) rejected = true;
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
					if (hasMove['trick'] || hasMove['switcheroo']) rejected = true;
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

				// These moves can be used even if we aren't setting up to use them:
				var SetupException = {
					overheat:1, dracometeor:1, leafstorm:1,
					voltswitch:1, uturn:1,
					suckerpunch:1, extremespeed:1
				};
				if (move.category === 'Special' && setupType === 'Physical' && !SetupException[move.id]) {
					rejected = true;
				}
				if (move.category === 'Physical' && setupType === 'Special' && !SetupException[move.id]) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if (setupType === 'Physical' && move.category !== 'Physical' && counter['Physical'] < 2) {
					rejected = true;
				}
				if (setupType === 'Special' && move.category !== 'Special' && counter['Special'] < 2) {
					rejected = true;
				}

				// Remove rejected moves from the move list.
				if (rejected && j<moveKeys.length) {
					moves.splice(k,1);
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
			if (j<moveKeys.length && moves.length === 4) {
				// Move post-processing:
				if (damagingMoves.length===0) {
					// A set shouldn't have no attacking moves
					moves.splice(Math.floor(Math.random()*moves.length),1);
				} else if (damagingMoves.length===1) {
					// Night Shade, Seismic Toss, etc. don't count:
					if (!damagingMoves[0].damage) {
						damagingid = damagingMoves[0].id;
						damagingType = damagingMoves[0].type;
						var replace = false;
						if (damagingid === 'suckerpunch' || damagingid === 'counter' || damagingid === 'mirrorcoat') {
							// A player shouldn't be forced to rely upon the opponent attacking them to do damage.
							if (!hasMove['encore'] && Math.random()*2>1) replace = true;
						} else if (damagingid === 'focuspunch') {
							// Focus Punch is a bad idea without a sub:
							if (!hasMove['substitute']) replace = true;
						} else if (damagingid.substr(0,11) === 'hiddenpower' && damagingType === 'Ice') {
							// Mono-HP-Ice is never acceptable.
							replace = true;
						} else {
							// If you have one attack, and it's not STAB, Ice, Fire, or Ground, reject it.
							// Mono-Ice/Ground/Fire is only acceptable if the Pokémon's STABs are one of: Poison, Normal, Grass.
							if (!hasStab[damagingType]) {
								if (damagingType === 'Ice' || damagingType === 'Fire' || damagingType === 'Ground') {
									if (!hasStab['Poison'] && !hasStab['Normal'] && !hasStab['Grass']) {
										replace = true;
									}
								} else {
									replace = true;
								}
							}
						}
						if (replace) moves.splice(damagingMoveIndex[damagingid],1);
					}
				} else if (damagingMoves.length===2) {
					// If you have two attacks, neither is STAB, and the combo isn't Ice/Electric, Ghost/Fighting, or Dark/Fighting, reject one of them at random.
					var type1 = damagingMoves[0].type, type2 = damagingMoves[1].type;
					var typeCombo = [type1, type2].sort().join('/');
					var rejectCombo = true;
					if (!type1 in hasStab && !type2 in hasStab) {
						if (typeCombo === 'Electric/Ice' || typeCombo === 'Fighting/Ghost' || typeCombo === 'Dark/Fighting') rejectCombo = false;
					} else {
						rejectCombo = false;
					}
					if (rejectCombo) moves.splice(Math.floor(Math.random()*moves.length),1);
				} else {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					var isStab = false;
					for (var l=0; l<damagingMoves.length; l++) {
						if (hasStab[damagingMoves[l].type]) {
							isStab = true;
							break;
						}
					}
					if (!isStab) moves.splice(Math.floor(Math.random()*moves.length),1);
				}
			}
		} while (moves.length<4 && j<moveKeys.length);

		{
			var abilities = [template.abilities['0']];
			if (template.abilities['1']) {
				abilities.push(template.abilities['1']);
			}
			if (template.abilities['H']) {
				abilities.push(template.abilities['H']);
			}
			abilities.sort(function(a,b){
				return this.getAbility(b).rating - this.getAbility(a).rating;
			}.bind(this));
			var ability0 = this.getAbility(abilities[0]);
			var ability1 = this.getAbility(abilities[1]);
			var ability = ability0.name;
			if (abilities[1]) {

				if (ability0.rating <= ability1.rating) {
					if (Math.random()*2<1) {
						ability = ability1.name;
					}
				} else if (ability0.rating - 0.6 <= ability1.rating) {
					if (Math.random()*3<1) {
						ability = ability1.name;
					}
				}

				var rejectAbility = false;
				if (ability === 'Blaze' && !counter['blaze']) {
					rejectAbility = true;
				}
				if (ability === 'Overgrow' && !counter['overgrow']) {
					rejectAbility = true;
				}
				if (ability === 'Swarm' && !counter['swarm']) {
					rejectAbility = true;
				}
				if (ability === 'Torrent' && !counter['torrent']) {
					rejectAbility = true;
				}
				if (ability === 'Contrary' && !counter['contrary']) {
					rejectAbility = true;
				}
				if (ability === 'Technician' && !counter['technician']) {
					rejectAbility = true;
				}
				if (ability === 'Skill Link' && !counter['skilllink']) {
					rejectAbility = true;
				}
				if (ability === 'Iron Fist' && !counter['ironfist']) {
					rejectAbility = true;
				}
				if (ability === 'Adaptability' && !counter['adaptability']) {
					rejectAbility = true;
				}
				if ((ability === 'Rock Head' || ability === 'Reckless') && !counter['recoil']) {
					rejectAbility = true;
				}
				if ((ability === 'No Guard' || ability === 'Compoundeyes') && !counter['inaccurate']) {
					rejectAbility = true;
				}
				if ((ability === 'Sheer Force' || ability === 'Serene Grace') && !counter['sheerforce']) {
					rejectAbility = true;
				}
				if (ability === 'Hustle' && !counter['hustle']) {
					rejectAbility = true;
				}
				if (ability === 'Simple' && !setupType && !hasMove['flamecharge'] && !hasMove['stockpile']) {
					rejectAbility = true;
				}
				if (ability === 'Prankster' && !counter['Status']) {
					rejectAbility = true;
				}
				if (ability === 'Defiant' && !counter['Physical'] && !hasMove['batonpass']) {
					rejectAbility = true;
				}
				if (ability === 'Moody' && template.id !== 'bidoof') {
					rejectAbility = true;
				}
				if (ability === 'Lightningrod' && template.types.indexOf('Ground') >= 0) {
					rejectAbility = true;
				}

				if (rejectAbility) {
					if (ability === ability1.name) { // or not
						ability = ability0.name;
					} else if (ability1.rating > 0) { // only switch if the alternative doesn't suck
						ability = ability1.name;
					}
				}
				if ((abilities[0] === 'Guts' || abilities[1] === 'Guts' || abilities[2] === 'Guts') && ability !== 'Quick Feet' && hasMove['facade']) {
					ability = 'Guts';
				}
				if ((abilities[0] === 'Swift Swim' || abilities[1] === 'Swift Swim' || abilities[2] === 'Swift Swim') && hasMove['raindance']) {
					ability = 'Swift Swim';
				}
				if ((abilities[0] === 'Chlorophyll' || abilities[1] === 'Chlorophyll' || abilities[2] === 'Chlorophyll') && ability !== 'Solar Power') {
					ability = 'Chlorophyll';
				}
				if (abilities[0] === 'Intimidate' || abilities[1] === 'Intimidate' || abilities[2] === 'Intimidate') {
					ability = 'Intimidate';
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

			var shouldMegaEvo = this.canMegaEvo(template);
			if (template.species === 'Alakazam' || template.species === 'Scizor' || template.species === 'Garchomp') {
				shouldMegaEvo = 'maybe';
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
				var randomNum = Math.random()*2;
				if (counter.Physical >= 3 && (template.baseStats.spe >= 95 || randomNum>1)) {
					item = 'Choice Band';
				} else if (counter.Special >= 3 && (template.baseStats.spe >= 95 || randomNum>1)) {
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
			} else if (template.species === 'Pikachu') {
				item = 'Light Ball';
			} else if (template.species === 'Clamperl') {
				item = 'DeepSeaTooth';
			} else if (template.species === 'Spiritomb') {
				item = 'Leftovers';
			} else if (template.species === 'Dusclops') {
				item = 'Eviolite';
			} else if (template.species === 'Scrafty' && counter['Status'] === 0) {
				item = 'Assault Vest';
			} else if (template.species === 'Amoonguss') {
				item = 'Black Sludge';
			} else if (shouldMegaEvo === true) {
				item = this.getTemplate(template.otherFormes[0]).requiredItem;
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
			} else if (ability === 'Unburden') {
				item = 'Red Card';
				// Give Unburden mons a Normal Gem if they have a Normal-type attacking move
				for (var m in moves) {
					var move = this.getMove(moves[m]);
					if (move.type === 'Normal' && (move.basePower || move.basePowerCallback)) {
						item = 'Normal Gem';
						break;
					}
					// Give power herb to hawlucha if it has sky attack and unburden
					if (template.species === 'Hawlucha' && hasMove['skyattack']) {
						item = 'Power Herb';
						break;
					}
				}

			// medium priority
			} else if (shouldMegaEvo) {
				item = this.getTemplate(template.otherFormes[0]).requiredItem;
			} else if (ability === 'Guts') {
				if (hasMove['drainpunch']) {
					item = 'Flame Orb';
				} else {
					item = 'Toxic Orb';
				}
				if ((hasMove['return'] || hasMove['hyperfang']) && !hasMove['facade']) {
					// lol no
					for (var j=0; j<moves.length; j++) {
						if (moves[j] === 'Return' || moves[j] === 'HyperFang') {
							moves[j] = 'Facade';
							break;
						}
					}
				}
			} else if (ability === 'Marvel Scale' && hasMove['psychoshift']) {
				item = 'Flame Orb';
			} else if (hasMove['reflect'] || hasMove['lightscreen']) {
				// less priority than if you'd had both
				item = 'Light Clay';
			} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['suckerpunch'] && !hasMove['flamecharge'] && !hasMove['rapidspin']) {
				item = 'Expert Belt';
			} else if (counter.Special >= 4) {
				item = 'Expert Belt';
			} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
				item = 'Shuca Berry';
			} else if (this.getEffectiveness('Ice', template) >= 1) {
				item = 'Yache Berry';
			} else if (this.getEffectiveness('Fighting', template) >= 1) {
				item = 'Chople Berry';
			} else if (hasMove['substitute'] || hasMove['detect'] || hasMove['protect'] || ability === 'Moody') {
				item = 'Leftovers';
			} else if ((hasMove['flail'] || hasMove['reversal']) && !hasMove['endure'] && ability !== 'Sturdy') {
				item = 'Focus Sash';
			} else if (ability === 'Iron Barbs' || ability === 'Rough Skin') {
				item = 'Rocky Helmet';
			} else if ((template.baseStats.hp+75)*(template.baseStats.def+template.baseStats.spd+175) > 60000 || template.species === 'Skarmory' || template.species === 'Forretress') {
				// skarmory and forretress get exceptions for their typing
				item = 'Sitrus Berry';
			} else if (counter.Physical + counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Physical + counter.Special >= 4 && template.baseStats.def + template.baseStats.spd > 179) {
				item = 'Assault Vest';
			} else if (counter.Physical + counter.Special >= 4) {
				item = 'Expert Belt';
			} else if (hasMove['outrage']) {
				item = 'Lum Berry';

			// this is the "REALLY can't think of a good item" cutoff
			} else if (counter.Physical + counter.Special >= 2 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd > 315) {
				item = 'Weakness Policy';
			} else if (this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && !hasMove['magnetrise']) {
				item = 'Shuca Berry';
			} else if (hasType['Poison']) {
				item = 'Black Sludge';
			} else if (counter.Status <= 1) {
				item = 'Life Orb';
			} else {
				item = 'Sitrus Berry';
			}

			// For Trick / Switcheroo
			if (item === 'Leftovers' && hasType['Poison']) {
				item = 'Black Sludge';
			}
		}

		// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
		// Every 10.35 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
		// To-do: adjust levels of mons with boosting items (Light Ball, Thick Club etc)
		var itemObj = this.getItem(item);
		if (shouldMegaEvo && itemObj.megaEvolves && itemObj.megaEvolves === template.species) {
			var megaTemplate = this.getTemplate(itemObj.megaStone);
			var bst = megaTemplate.baseStats.hp + megaTemplate.baseStats.atk + megaTemplate.baseStats.def + megaTemplate.baseStats.spa + megaTemplate.baseStats.spd + megaTemplate.baseStats.spe;
		} else {
			var bst = template.baseStats.hp + template.baseStats.atk + template.baseStats.def + template.baseStats.spa + template.baseStats.spd + template.baseStats.spe;
		}
		var level = 70 + Math.floor(((600 - clampIntRange(bst, 300, 600)) / 10.35));

		return {
			name: name,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: (Math.random()*1024<=1)
		};
	}
};
