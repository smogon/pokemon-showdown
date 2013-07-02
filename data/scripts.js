exports.BattleScripts = {
	gen: 5,
	runMove: function(move, pokemon, target, sourceEffect) {
		if (!sourceEffect && toId(move) !== 'struggle') {
			var changedMove = this.runEvent('OverrideDecision', pokemon);
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		move = this.getMove(move);
		if (!target) target = this.resolveTarget(pokemon, move);

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
		move = this.getMove(move);
		baseMove = move;
		move = this.getMoveCopy(move);
		if (!target) target = this.resolveTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}
		if (sourceEffect) move.sourceEffect = sourceEffect.id;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseMove.target !== move.target) {
			//Target changed in ModifyMove, so we must adjust it here
			target = this.resolveTarget(pokemon, move);
		}
		move = this.runEvent('ModifyMove',pokemon,target,move,move);
		if (baseMove.target !== move.target) {
			//check again
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
				if (move.selfdestruct && this.gen == 5) {
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
			for (var i=0; i<hits && target.hp && pokemon.hp; i++) {
				if (!move.sourceEffect && pokemon.status === 'slp') break;

				var moveDamage = this.moveHit(target, pokemon, move);
				if (moveDamage === false) break;
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage = (moveDamage || 0);
				this.eachEvent('Update');
			}
			if (i === 0) return true;
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
		var damage = 0;
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
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
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
	isAdjacent: function(pokemon1, pokemon2) {
		if (!pokemon1.fainted && !pokemon2.fainted && pokemon2.position !== pokemon1.position && Math.abs(pokemon2.position-pokemon1.position) <= 1) {
			return true;
		}
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
				var x=Math.floor(Math.random()*649)+1;
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
			
			//random ability (unreleased DW are par for the course)
			var abilities = [template.abilities['0']];
			if (template.abilities['1']) {
				abilities.push(template.abilities['1']);
			}
			if (template.abilities['DW']) {
				abilities.push(template.abilities['DW']);
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
	randomSet: function(template, i, team) {
		if (i === undefined) i = 1;
		template = this.getTemplate(template);

		if (!template.exists) {
			template = this.getTemplate('unown');
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
		}
		// First determine what our team composition is.
		// We can't know our team ahead of time, so this will be partial data until we've made all our Pokemon.
		var hasWeather = {};
		if (team != undefined) {
			for (var n=0; n<team.length;n++) {
				// Process team's abilities
				var pokeAbility = team[n].ability;
				if (pokeAbility === 'Drought') hasWeather['sun'] = true;
				else if (pokeAbility === 'Drizzle') hasWeather['rain'] = true;
				else if (pokeAbility === 'Snow Warning') hasWeather['hail'] = true;
				else if (pokeAbility === 'Sand Stream') hasWeather['sandstorm'] = true;
				for (var o in team[n].moves) {
					// Process team's moves 
					if (o === 'raindance') hasWeather['rain'] = true;
					if (o === 'sunnyday') hasWeather['sun'] = true;
					if (o === 'sandstorm') hasWeather['sandstorm'] = true;
					if (o === 'hail') hasWeather['hail'] = true;
				}
			}
		}
		
		// Set up template:
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
		var hasAbility = {};
		var abilities = [];
		
		if (template.abilities['0']) {
			var ability0 = template.abilities['0'];
			abilities.push(ability0);
			hasAbility[ability0] = true;
		}
		if (template.abilities['1']) {
			var ability1 = template.abilities['1'];
			abilities.push(ability1);
			hasAbility[ability1] = true;
		}
		if (template.abilities['DW']) {
			var ability2 = template.abilities['DW'];
			abilities.push(ability2);
			hasAbility[ability2] = true;
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
				technician: 0, skilllink: 0, contrary: 0, sheerforce: 0, ironfist: 0, adaptability: 0, hustle: 0, scrappy: 0,
				blaze: 0, overgrow: 0, swarm: 0, torrent: 0,
				recoil: 0, inaccurate: 0, contact: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0,
				tox: 0, par: 0, psn: 0, brn: 0, frz: 0, slp: 0,
				boosts: 0, drops: 0
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
						// Power Gem, Bounce, Aeroblast aren't considered STABs. 
						// If they're in the Pokémon's movepool and are STAB, consider the Pokémon not to have that type as a STAB.
						if (moveid === 'aeroblast' || moveid === 'powergem' || moveid === 'bounce') hasStab[move.type] = false;
					}
					if (move.category === 'Physical') counter['hustle']++;
					if (move.type === 'Fire') counter['blaze']++;
					if (move.type === 'Grass') counter['overgrow']++;
					if (move.type === 'Bug') counter['swarm']++;
					if (move.type === 'Water') counter['torrent']++;
					if (move.type === 'Normal') counter['scrappy']++;
					// Make sure not to count Knock Off, Rapid Spin, etc.
					if (move.basePower > 20 || move.multihit || move.basePowerCallback) {
						damagingMoves.push(move);
						damagingMoveIndex[moveid] = k;
					}
				}
				// Moves with secondary effects:
				if (move.secondary) {
					if (move.secondary.chance > 50) {
						counter['sheerforce']--;
					} else {
						counter['sheerforce']++;
					}
				}
				// Moves that make contact:
				if (move.isContact) {
					counter['contact']++;
				}
				// Moves with low accuracy:
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) {
					counter['inaccurate']++;
				}
				// Moves which affect own stats:
				if (move.self && move.self.boosts || move.boosts || moveid === 'stockpile') {
					var boosts = {};
					if (move.boosts) {
						boosts = move.boosts;
					} else if (moveid === 'stockpile') {
						boosts['def'] = 1;
						boosts['spd'] = 1;
					} else {
						boosts = move.self.boosts;
					}
					var negBoosts = 0;
					var posBoosts = 0;
					for(var n in boosts) {
						if (boosts[n] > 0) {
							posBoosts++;
							counter['boosts']++;
						} else if (boosts[n] < 0) {
							negBoosts++;
							counter['drops']++;
						}
					}
					if (boosts['atk'] > 0 && boosts['spa'] > 0) {
						counter['mixedsetup']++;
					} else if (boosts['atk'] > 0) {
						counter['physicalsetup']++;
					} else if (boosts['spa'] > 0) {
						counter['specialsetup']++;
					}
					if (posBoosts <= 0 && negBoosts > 0) counter['contrary']++;
				}
				// Moves that induce status:
				if (move.status) counter[move.status]++;
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
					if (counter['boosts'] <= counter['drops']) rejected = true;
					break;
				case 'batonpass':
					if (!counter['boosts'] && !hasMove['substitute']) rejected = true;
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
				case 'perishsong':
					if (counter['boosts']) rejected = true;
					if (hasMove['roar'] || hasMove['whirlwind'] || hasMove['haze']) rejected = true;
					break;
				case 'spikes':
					if (setupType) rejected = true;
					break;
				case 'knockoff': case 'magiccoat':
					if (setupType || (hasMove['sleeptalk'] && hasMove['rest'])) rejected = true;
					break;
				case 'foulplay':
					if (counter['physicalsetup']) rejected = true;
					break;
				case 'uturn': case 'voltswitch':
					if (counter['boosts'] || hasMove['magnetrise'] || hasMove['substitute']) rejected = true;
					break;
				case 'relicsong':
					if (setupType) rejected = true;
					break;
				case 'protect': case 'haze': case 'stealthrock':
					if (setupType || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'pursuit':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
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
				case 'fireblast':
					if (hasMove['lavaplume'] || hasMove['overheat'] || hasMove['flamethrower'] || hasMove['fierydance'] || hasMove['blueflare']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['willowisp'] || hasMove['fireblast'] || hasMove['flamethrower'] || hasMove['heatwave']) rejected = true;
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
				case 'bravebird': case 'pluck': case 'drillpeck':
					if (hasMove['acrobatics']) rejected = true;
					break;
				case 'solarbeam':
					if (!hasMove['sunnyday'] || !hasAbility['Drought']) rejected = true;
					if (!hasWeather['sun'] || hasWeather['rain'] || hasWeather['hail'] || hasWeather['sandstorm']) rejected = true;
					if (hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if ((!setupType && hasMove['leafstorm']) || hasMove['petaldance']) rejected = true;
					break;
				case 'leafstorm':
					if (setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['sunnyday'] && !hasMove['raindance'] && !hasMove['sandstorm'] && !hasMove['hail'] && !hasWeather) rejected = true;
					break;
				case 'firepunch':
					if (hasMove['flareblitz']) rejected = true;
					break;
				case 'bugbite':
					if (hasMove['uturn']) rejected = true;
					break;
				case 'crosschop': case 'hijumpkick':
					if (hasMove['closecombat']) rejected = true;
					break;
				case 'drainpunch':
					if (hasMove['closecombat'] || hasMove['hijumpkick'] || hasMove['crosschop']) rejected = true;
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
				case 'bonemerang': case 'earthpower':
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

				// Status:
				case 'rest':
					if (hasMove['painsplit'] || hasMove['wish'] || hasMove['recover'] || hasMove['moonlight'] || hasMove['synthesis']) rejected = true;
					break;
				case 'softboiled': case 'roost':
					if (hasMove['wish'] || hasMove['recover']) rejected = true;
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
				case 'glare': case 'thunderwave':
					if (setupType && (hasMove['rockpolish'] || hasMove['agility'])) rejected = true;
					if (hasMove['discharge'] || hasMove['trickroom']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'raindance':
					if (hasWeather['sun'] || hasWeather['sandstorm'] || hasWeather['hail']) rejected = true;
					break;
				case 'sandstorm':
					if (hasWeather['sun'] || hasWeather['rain'] || hasWeather['hail']) rejected = true;
					break;
				case 'sunnyday': 
					if (hasWeather['rain'] || hasWeather['sandstorm'] || hasWeather['hail']) rejected = true;
					break;
				case 'hail':
					if (hasWeather['sun'] || hasWeather['sandstorm'] || hasWeather['rain']) rejected = true;
					break;
				case 'powerswap':
					if (!counter['drops'] || setupType) rejected = true;
					break;
				}
				
				// Eliminate moves if we have conflicting statuses:
				if (move.status) {
					switch (move.status) {
						case 'tox':
							if (counter['par'] || counter['psn'] || counter['frz'] || counter['slp']) rejected = true;
							// Some Pokemon like running Will-o-Wisp with Toxic:
							if (counter['brn'] && Math.random()*2>1) rejected = true;
							// This is redundant if we're holding a Toxic Orb and have Fling:
							if (hasMove['fling'] && hasAbility['Poison Heal']) rejected = true;
							// De-increment the counter so the other status isn't rejected:
							if (rejected && counter['tox']) counter['tox']--;
							break;
						case 'par':
							if (counter['tox'] || counter['psn'] || counter['brn'] || counter['frz'] || counter['slp']) {
								rejected = true;
								if (counter['par']) counter['par']--;
							}
							break;
						case 'psn':
							if (counter['par'] || counter['tox'] || counter['brn'] || counter['frz'] || counter['slp']) {
								rejected = true;
								if (counter['psn']) counter['psn']--;
							}
							break;
						case 'brn':
							if (counter['par'] > 0 || counter['psn'] > 0 || counter['frz'] > 0 || counter['slp'] > 0) rejected = true;
							if (counter['tox'] > 0 && Math.random()*2>1) rejected = true;
							if (rejected && counter['brn']) counter['brn']--;
							break;
						case 'frz':
							if (counter['par'] > 0 || counter['psn'] > 0 || counter['brn'] > 0 || counter['tox'] > 0 || counter['slp'] > 0) {
								rejected = true;
								if (counter['frz']) counter['frz']--;
							}
							break;
						case 'slp':
							if (counter['par'] > 0 || counter['psn'] > 0 || counter['brn'] > 0 || counter['frz'] > 0 || counter['tox'] > 0) {
								rejected = true;
								if (counter['slp']) counter['slp']--;
							}
							break;
					}
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
					// Have a 60% chance of rejecting one move at random:
					if (Math.random()*1.66>1) moves.splice(Math.floor(Math.random()*moves.length),1);
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
						if (typeCombo === 'Electric/Ice' || typeCombo === 'Fighting/Ghost' || typeCombo === 'Dark/Fightng') rejectCombo = false;
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

		// any hardcoded moveset modification goes here
		// i.e. moves[0] = 'Safeguard';
		
		// Any hardcoded ability modification goes here
		if (template.id === 'combee') {
			// it always gets Hustle but its only physical move is Endeavor, which loses accuracy
			ability = 'Honey Gather';
		} else if (abilities.length === 1) {
			ability = abilities[0];
		}
		
		if (!ability) {
			// Uses the same rating system as abilities.js, only takes into account our current situation
			var abilityRating = {};
			for(var k=0; k<abilities.length; k++) {
				// Not sure what this does, so commenting it out to see what breaks
				/*abilities.sort(function(a,b){
					return this.getAbility(b).rating - this.getAbility(abilities[k]).rating;
				}.bind(this));*/
				var possibleAbility = abilities[k];
				
				// Weather:
				
				if (hasMove['raindance'] || hasWeather['rain']) {
					if (possibleAbility === 'Swift Swim') {
						abilityRating[possibleAbility] = 5;
					} else if (possibleAbility === 'Rain Dish') {
						abilityRating[possibleAbility] = 4;
					// Dry Skin doesn't NEED rain to function, but it appreciates it
					} else if (possibleAbility === 'Dry Skin' && !hasWeather['sun'] && !hasMove['sunnyday']) {
						abilityRating[possibleAbility] = 5;
					} else if (possibleAbility === 'Hydration') {
						abilityRating[possibleAbility] = 5;
					}
				}
				if (hasMove['sunnyday'] || hasWeather['sun']) {
					if (possibleAbility === 'Chlorophyll') {
						abilityRating[possibleAbility] = 5;
					} 
					if (possibleAbility === 'Solar Power') {
						abilityRating[possibleAbility] = 4;
					} 
					if (possibleAbility === 'Flower Gift') {
						abilityRating[possibleAbility] = 5;
					} 
					if (possibleAbility === 'Leaf Guard') {
						// Not as good as Hydration since Rest always fails
						abilityRating[possibleAbility] = 4;
					} 
					if (possibleAbility === 'Dry Skin') {
						abilityRating['Dry Skin'] = -1;
					}
				}
				if (hasMove['hail'] || hasWeather['hail']) {
					if (possibleAbility === 'Ice Body') {
						abilityRating[possibleAbility] = 5;
					}
					if (possibleAbility === 'Snow Cloak') {
						abilityRating[possibleAbility] = 3.5;
					}
					if (possibleAbility === 'Overcoat' && !hasType['Ice']) {
						abilityRating[possibleAbility] = 4;
					}
				} 
				if (hasMove['sandstorm'] || hasWeather['sandstorm']) {
					if (possibleAbility === 'Sand Force') {
						if (template.baseStats.spe > 100 || template.baseStats.def + template.baseStats.spd < 140) {
							abilityRating[possibleAbility] = 5;
						} else {
							abilityRating[possibleAbility] = 3.5;
						}
					}
					if (possibleAbility === 'Sand Rush') {
						// Excadrill and such are too frail to use Sand Rush, but Sandslash likes it because he has low speed and solid defense
						if (template.baseStats.spe < 100 && template.baseStats.def + template.baseStats.spd > 140) {
							abilityRating[possibleAbility] = 5;
						} else {
							abilityRating[possibleAbility] = 3.5;
						}
					} 
					if (possibleAbility === 'Sand Veil') {
						abilityRating[possibleAbility] = 3.5;
					} 
					if (possibleAbility === 'Overcoat' && !hasType['Rock'] && !hasType['Ground'] && !hasType['Steel']) {
						abilityRating[possibleAbility] = 4;
					}
				}			
				if (possibleAbility === 'Drought') {
					abilityRating[possibleAbility] = 5;
					// Exceeding the usual max here, but want to make sure Ninetales always gets Drought if it has Solarbeam
					if (hasMove['solarbeam']) abilityRating[possibleAbility]++;
					// If we have other weathers already it's generally a bad idea
					if (hasWeather['rain']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['hail']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['sandstorm']) abilityRating[possibleAbility] -= 2;
					// In the future, perhaps check team's typing?
				}
				if (possibleAbility === 'Drizzle') {
					abilityRating[possibleAbility] = 5;
					if (hasWeather['sun']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['hail']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['sandstorm']) abilityRating[possibleAbility] -= 2;
				}
				if (possibleAbility === 'Sand Stream') {
					if (hasType['Rock']) {
						abilityRating[possibleAbility] = 5;
					} else {
						abilityRating[possibleAbility] = 4.5;
					}
					if (hasWeather['rain']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['hail']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['sun']) abilityRating[possibleAbility] -= 2;
				}
				if (possibleAbility === 'Snow Warning') {
					abilityRating[possibleAbility] = 4;
					if (hasWeather['rain']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['sun']) abilityRating[possibleAbility] -= 2;
					if (hasWeather['sandstorm']) abilityRating[possibleAbility] -= 2;
				}
				
				// No way of inducing weather, we have to rely on the other side doing it:
				if ((possibleAbility === 'Swift Swim' || possibleAbility === 'Rain Dish' || possibleAbility === 'Hydration') && !hasMove['raindance'] && !hasWeather['rain']) {
					abilityRating[possibleAbility] = 1;
				}
				if ((possibleAbility === 'Chlorophyll' || possibleAbility === 'Solar Power' || possibleAbility === 'Flower Gift' || possibleAbility === 'Leaf Guard') && !hasMove['sunnyday'] && !hasWeather['sun']) {
					abilityRating[possibleAbility] = 1;
				}
				if ((possibleAbility === 'Sand Force' || possibleAbility === 'Sand Rush' || possibleAbility === 'Sand Veil') && !hasMove['sandstorm'] && !hasWeather['sandstorm']) {
					abilityRating[possibleAbility] = 1;
				}
				if ((possibleAbility === 'Snow Cloak' || possibleAbility === 'Ice Body') && !hasMove['hail'] && !hasWeather['hail']) {
					abilityRating[possibleAbility] = 1;
				}
				
				// End of weather stuff
				
				// These abilities give immunities
				if (possibleAbility === 'Water Absorb') {
					var effectiveness = this.getEffectiveness('Water', template);
					if (effectiveness >= 2) {
						abilityRating[possibleAbility] = 5;
					} else if (effectiveness >= 1) {
						abilityRating[possibleAbility] = 4;
					} else {
						abilityRating[possibleAbility] = 3.5;
					}
				}
				if (possibleAbility === 'Motor Drive') {
					if(template.types.indexOf('Ground') > 0) {
						abilityRating[possibleAbility] = 0.5;
					} else {
						var effectiveness = this.getEffectiveness('Electric', template);
						if (effectiveness >= 2) {
							abilityRating[possibleAbility] = 5;
						} else if (effectiveness >= 1) {
							abilityRating[possibleAbility] = 4;
						} else {
							abilityRating[possibleAbility] = 3.5;
						}
					}
				}
				if (possibleAbility === 'Volt Absorb') {
					if(template.types.indexOf('Ground') > 0) {
						abilityRating[possibleAbility] = 0.5;
					} else {
						var effectiveness = this.getEffectiveness('Electric', template);
						if (effectiveness >= 2) {
							abilityRating[possibleAbility] = 5;
						} else if (effectiveness >= 1) {
							abilityRating[possibleAbility] = 4;
						} else {
							abilityRating[possibleAbility] = 3.5;
						}
					}
				}
				if (possibleAbility === 'Lightningrod') {
					if(template.types.indexOf('Ground') > 0) {
						abilityRating[possibleAbility] = 0.5;
					} else {
						var effectiveness = this.getEffectiveness('Electric', template);
						if (effectiveness >= 2) {
							abilityRating[possibleAbility] = 5;
						} else if (effectiveness >= 1) {
							abilityRating[possibleAbility] = 4;
						} else {
							abilityRating[possibleAbility] = 3.5;
						}
					}
				}
				if (possibleAbility === 'Levitate') {
					var effectiveness = this.getEffectiveness('Ground', template);
					if (effectiveness >= 2) {
						abilityRating[possibleAbility] = 5;
					} else if (effectiveness >= 1) {
						abilityRating[possibleAbility] = 4;
					} else {
						abilityRating[possibleAbility] = 3.5;
					}
				}
				if (possibleAbility === 'Flash Fire') {
					var effectiveness = this.getEffectiveness('Fire', template);
					if (effectiveness >= 2) {
						abilityRating[possibleAbility] = 5;
					} else if (effectiveness >= 1) {
						abilityRating[possibleAbility] = 3.5;
					} else {
						// Not as useful as the others since it applies a volatile rather than upping a stat
						abilityRating[possibleAbility] = 3;
					}
					abilityRating[possibleAbility] += counter['blaze'] / 2;
				}
				if (possibleAbility === 'Sap Sipper') {
					var effectiveness = this.getEffectiveness('Grass', template);
					if (effectiveness >= 2) {
						abilityRating[possibleAbility] = 5;
					} else if (effectiveness >= 1) {
						abilityRating[possibleAbility] = 4;
					} else {
						abilityRating[possibleAbility] = 3.5;
					}
					abilityRating[possibleAbility] += counter['Physical'] / 2;
				}
				if (possibleAbility === 'Storm Drain') {
					var effectiveness = this.getEffectiveness('Water', template);
					if (effectiveness >= 2) {
						abilityRating[possibleAbility] = 5;
					} else if (effectiveness >= 1) {
						abilityRating[possibleAbility] = 4;
					} else {
						abilityRating[possibleAbility] = 3.5;
					}
					abilityRating[possibleAbility] += counter['Special'] / 2;
				}
				if (possibleAbility === 'Dry Skin' && !hasWeather['sun'] && !hasMove['sunnyday'] && !hasMove['raindance'] && !hasWeather['rain']) {
					var waterEffectiveness = this.getEffectiveness('Water', template);
					var fireEffectiveness = this.getEffectiveness('Fire', template);
					if (waterEffectiveness >= 2 && fireEffectiveness < 0) {
						abilityRating[possibleAbility] = 5;
					} else if (waterEffectiveness >= 1 && fireEffectiveness < 0) {
						abilityRating[possibleAbility] = 4;
					} else if (fireEffectiveness < 0) {
						abilityRating[possibleAbility] = 3.5;
					} else if (waterEffectiveness >= 2 && fireEffectiveness < 1) {
						abilityRating[possibleAbility] = 3;
					} else if (waterEffectiveness >= 1 && fireEffectiveness < 1) {
						abilityRating[possibleAbility] = 2;
					} else if (fireEffectiveness < 1) {
						abilityRating[possibleAbility] = 1;
					} else {
						abilityRating[possibleAbility] = -1;
					}
				}
				
				// This does the opposite and removes immunities
				
				if (possibleAbility === 'Scrappy') {
					abilityRating[possibleAbility] = 2.5;
					abilityRating[possibleAbility] += counter['scrappy'];
				}
				
				// Status abilities
				
				if (possibleAbility === 'Poison Heal') {
					if (hasMove['fling']) {
						abilityRating[possibleAbility] = 4.5;
					} else if (hasAbility['Technician'] && counter['Technician']) {
						abilityRating[possibleAbility] = 3;
					} else {
						abilityRating[possibleAbility] = 4;
					}
				}
				if (possibleAbility === 'Guts') {
					if (hasMove['substitute'] || hasAbility['Quick Feet']) {
						abilityRating[possibleAbility] = 2.5;
					} else if (counter['scrappy']) {
						// If we don't have Facade, a damaging Normal-type move is replaced with it below
						abilityRating[possibleAbility] = 4.5;
					} else {
						abilityRating[possibleAbility] = 3;
					}
				}
				if (possibleAbility === 'Water Veil' && counter['Physical']) {
					// Stick to a constant naming convention, Game Freak
					abilityRating[possibleAbility] = 3;
				}
				if (possibleAbility === 'Poison Touch') {
					if (counter['tox']) {
						abilityRating[possibleAbility] = 0.5;
					} else if (counter['psn'] || counter['par'] || counter['slp'] || counter['frz']) {
						abilityRating[possibleAbility] = 1.5;
					} else {
						abilityRating[possibleAbility] = 2.5;
					}
					abilityRating[possibleAbility] += counter['contact'];
				}
				if (possibleAbility === 'Quick Feet') {
					if (hasMove['substitute'] || hasType['Poison']) {
						abilityRating[possibleAbility] = 2;
					} else {
						abilityRating[possibleAbility] = 3.5;
					}
				}
				if (possibleAbility === 'Limber') {
					if (template.baseStats.spe < 85) {
						// We're too slow to worry about paralysis.
						abilityRating[possibleAbility] = 0.5;
					} else {
						abilityRating[possibleAbility] = 2;
					}
				}
				
				// These affect stats:
				
				if (possibleAbility === 'Contrary' && counter['contrary']) {
					abilityRating[possibleAbility] = 3 + counter['drops'];
				}
				if (possibleAbility === 'Defiant') {
					abilityRating[possibleAbility] = 1.5 + counter['Physical'];
					if (hasMove['batonpass']) abilityRating[possibleAbility]++;
				}
				if (possibleAbility === 'Simple') {
					abilityRating[possibleAbility] = 0.5 + (counter['boosts'] - counter['drops'])*2;
				}
				if (possibleAbility === 'Moody') {
					if (template.id !== 'bidoof') {
						abilityRating[possibleAbility] = -2;
					} else {
						abilityRating[possibleAbility] = 5;
					}
				}
				if (possibleAbility === 'Moxie') {
					if (counter['drops']) {
						abilityRating[possibleAbility] = 4 - (counter['drops']/2);
					} else if (counter['technician']) {
						abilityRating[possibleAbility] = 4 - (counter['technician']/2);
					}
				}
				
				// These affect status:
				
				if (possibleAbility === 'Prankster') {
					abilityRating[possibleAbility] = 2.5;
					abilityRating[possibleAbility] += counter['Status'];
				}
				// These change the power of certain moves:
				
				if (possibleAbility === 'Technician') {
					abilityRating[possibleAbility] = 2.5 + counter['technician'];
				}
				if (possibleAbility === 'Iron Fist') {
					abilityRating[possibleAbility] = 2.5 + counter['ironfist'];
				}
				if (possibleAbility === 'Sheer Force' || possibleAbility === 'Serene Grace') {
					abilityRating[possibleAbility] = 2.5 + counter['sheerforce'];
				}
				if (possibleAbility === 'Adaptability') {
					abilityRating[possibleAbility] = 2.5 + counter['adaptability'];
				}
				if (possibleAbility === 'Hustle') {
					abilityRating[possibleAbility] = 2 + counter['hustle'];
				}
				// Lower rating for these since they only work at low health
				if (possibleAbility === 'Blaze') {
					abilityRating[possibleAbility] = 1.5 + counter['blaze'];
				}
				if (possibleAbility === 'Overgrow') {
					abilityRating[possibleAbility] = 1.5 + counter['overgrow'];
				}
				if (possibleAbility === 'Swarm') {
					abilityRating[possibleAbility] = 1.5 + counter['swarm'];
				}
				if (possibleAbility === 'Torrent') {
					abilityRating[possibleAbility] = 1.5 + counter['torrent'];
				}
				
				// These affect a small number of moves:
				
				if (possibleAbility === 'Skill Link') {
					abilityRating[possibleAbility] = 2.5 + counter['skilllink'];
				}
				if (possibleAbility === 'Rock Head' || possibleAbility === 'Reckless') {
					abilityRating[possibleAbility] = 2 + counter['recoil'];
				}
				if (possibleAbility === 'No Guard' || possibleAbility === 'Compoundeyes') {
					abilityRating[possibleAbility] = 2.5 + counter['inaccurate'];
				}
				if (possibleAbility === 'Insomnia') {
					if (hasMove['rest']) {
						abilityRating[possibleAbility] = -1;
					} else {
						abilityRating[possibleAbility] = 2;
					}
				}
				if (possibleAbility === 'Truant' && hasMove['entrainment']) {
					// Just for fun
					abilityRating[possibleAbility] = 4;
				}
				
				// Fill in any abilities that don't care about the set we're running:
				if (!abilityRating[possibleAbility]) abilityRating[possibleAbility] = this.getAbility(possibleAbility).rating;
			}
			
			for (var k=0; k<abilities.length; k++) {
				var skip = false;
				var possibleAbility = abilities[k];
				for (var l in abilityRating) {
					if (l === possibleAbility) continue;
					if (abilityRating[l] > abilityRating[possibleAbility] || abilityRating[l] === abilityRating[possibleAbility] && Math.random()*2>1) {
						skip = true;
						break;
					}
				}
				if (skip && abilities.length - 1 !== k) continue;
				ability = possibleAbility;
				break;
			}
		}
		hasAbility[ability] = true;

		{
			if (hasMove['gyroball']) {
				ivs.spe = 0;
				//evs.atk += evs.spe;
				evs.spe = 0;
			} else if (hasMove['trickroom']) {
				ivs.spe = 0;
				//evs.hp += evs.spe;
				evs.spe = 0;
			}

			item = 'Leftovers';
			if (template.requiredItem) {
				item = template.requiredItem;
			} else if (template.species === 'Rotom-Fan') {
				// this is just to amuse myself
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
			} else if ((template.species === 'Wynaut' || template.species === 'Wobbuffet') && hasMove['destinybond'] && Math.random()*2 > 1) {
				item = 'Custap Berry';
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
			} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin' && (ability !== 'Hydration' || (!hasMove['raindance'] && !hasWeather['rain']))) {
				item = 'Chesto Berry';
			} else if (hasMove['naturalgift']) {
				item = 'Liechi Berry';
			} else if (ability === 'Harvest') {
				item = 'Sitrus Berry';
			} else if (template.species === 'Cubone' || template.species === 'Marowak') {
				item = 'Thick Club';
			} else if (template.species === 'Pikachu') {
				item = 'Light Ball';
			} else if (template.species === 'Clamperl') {
				item = 'DeepSeaTooth';
			} else if (hasMove['reflect'] && hasMove['lightscreen']) {
				item = 'Light Clay';
			} else if (hasMove['acrobatics'] && !hasMove['fling']) {
				item = 'Flying Gem';
			} else if (hasMove['shellsmash']) {
				item = 'White Herb';
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
			} else if (ability === 'Unburden' && (counter['Physical'] || counter['Special'])) {
				// Give Unburden mons a random Gem of the type of one of their damaging moves
				var shuffledMoves = moves.randomize();
				for (var m in shuffledMoves) {
					var move = this.getMove(shuffledMoves[m]);
					if (move.basePower || move.basePowerCallback) {
						item = move.type + ' Gem';
						break;
					}
				}
			} else if (ability === 'Guts') {
				// Flame Orb is better if you're staying in longer than 3 turns
				if (hasMove['drainpunch'] || counter['boosts']) {
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
			} else if (hasMove['facade'] || ability === 'Poison Heal' || ability === 'Toxic Boost' || (ability === 'Quick Feet' && !hasType['Poison'] && !hasMove['bellydrum'] && !hasMove['substitute'])) {
				item = 'Toxic Orb';
			} else if (ability === 'Marvel Scale' && hasMove['psychoshift']) {
				item = 'Flame Orb';
			} else if (hasMove['reflect'] || hasMove['lightscreen']) {
				// less priority than if you'd had both
				item = 'Light Clay';
			} else if ((hasMove['eruption'] || hasMove['waterspout']) && !counter['Status']) {
				item = 'Choice Scarf';
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
			} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
				item = 'Air Balloon';
			} else if (hasMove['substitute'] && hasMove['reversal']) {
				var shuffledMoves = moves.randomize();
				for (var m in shuffledMoves) {
					var move = this.getMove(shuffledMoves[m]);
					if (move.basePower || move.basePowerCallback) {
						item = move.type + ' Gem';
						break;
					}
				}
			} else if (ability === 'Iron Barbs') {
				// only Iron Barbs for now
				item = 'Rocky Helmet';
			} else if (hasMove['outrage'] && (setupType || hasMove['substitute'])) {
				item = 'Lum Berry';
			} else if (hasMove['substitute'] || hasMove['detect'] || hasMove['protect'] || ability === 'Moody') {
				item = 'Leftovers';
			} else if ((hasMove['flail'] || hasMove['reversal']) && !hasMove['endure'] && ability !== 'Sturdy') {
				item = 'Focus Sash';
			} else if ((template.baseStats.hp+75)*(template.baseStats.def+template.baseStats.spd+175) > 60000 || template.species === 'Skarmory' || template.species === 'Forretress') {
				// skarmory and forretress get exceptions for their typing
				item = 'Leftovers';
			} else if (counter['drops'] > 1 && ability !== 'Contrary' && !hasMove['superpower']) {
				item = 'White Herb';
			} else if (counter.Physical + counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Special >= 3 && setupType) {
				item = 'Life Orb';
			} else if (counter.Physical + counter.Special >= 4) {
				item = 'Expert Belt';
			} else if ((i===0 || template.baseStats.def + template.baseStats.spd <= 50) && ability !== 'Sturdy' && !counter['recoil']) {
				item = 'Focus Sash';

			// this is the "REALLY can't think of a good item" cutoff
			// why not always Leftovers? Because it's boring. :P

			} else if (this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && !hasMove['magnetrise'] && !hasType['Flying']) {
				item = 'Air Balloon';
			}  else if (this.getEffectiveness('Ice', template) > 1) {
				item = 'Yache Berry';
			} else if (hasType['Flying'] || ability === 'Levitate') {
				item = 'Leftovers';
			} else if (hasType['Poison']) {
				item = 'Black Sludge';
			} else if (counter.Status <= 1) {
				item = 'Life Orb';
			} else {
				item = 'Leftovers';
			}
			
			// Item post-processing
			if (item === 'Leftovers' && hasType['Poison']) {
				item = 'Black Sludge';
			} else if (item === 'Focus Sash') {
				if (hasWeather['sandstorm'] && !hasType['Rock'] && !hasType['Steel'] && !hasType['Ground']) item === 'Leftovers';
				if (hasWeather['hail'] && !hasType['Ice']) item === 'Leftovers';
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
			OU: 74,
			CAP: 74,
			G4CAP: 74,
			G5CAP: 74,
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
			Snover: 95, Vulpix: 95, Excadrill: 78, Ninetales: 78, Tentacruel: 78, Toxicroak: 78, Venusaur: 78, "Tornadus-Therian": 74,

			// Holistic judgment
			Carvanha: 90, Blaziken: 74, "Deoxys-Defense": 74, "Deoxys-Speed": 74, Garchomp: 74, Thundurus: 74
		};
		var level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		if (template.name === 'Chandelure' && ability === 'Shadow Tag') level = 70;
		if (template.name === 'Serperior' && ability === 'Contrary') level = 74;
		if (template.name === 'Magikarp' && hasMove['magikarpsrevenge']) level = 85;
		if (template.name === 'Spinda' && ability !== 'Contrary') level = 95;

		return {
			name: template.name,
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
			if (this.data.FormatsData[i].viableMoves) {
				keys.push(i);
			}
		}
		keys = keys.randomize();

		// PotD stuff
		var potd = {};
		if ('Rule:potd' in this.getFormat().banlistTable) {
			potd = this.getTemplate(config.potd);
		}
		var typeWeaknesses = {}
		for(var t in this.data.TypeChart) {
			typeWeaknesses[t] = 0;
		}
		var typeCount = {};
		var typeComboCount = {};
		var uberCount = 0;
		var nuCount = 0;
		
		var weather = '';
		
		for (var i=0; i<keys.length && pokemonLeft < 6; i++) {
			var template = this.getTemplate(keys[i]);
			if (!template || !template.name || !template.types) continue;
			var tier = template.tier;
			// This tries to limit the amount of Ubers and NUs on one team to promote "fun":
			// LC Pokemon have a hard limit in place at 2; NFEs/NUs/Ubers are also limited to 2 but have a 20% chance of being added anyway.
			// LC/NFE/NU Pokemon all share a counter (so having one of each would make the counter 3), while Ubers have a counter of their own.
			if (tier === 'LC' && nuCount > 1) continue;
			if ((template.evos || tier === 'NU') && nuCount > 1 && Math.random()*5>1) continue;
			if (tier === 'Uber' && uberCount > 1 && Math.random()*5>1) continue;

			// CAPs have 20% the normal rate
			if ((tier === 'G4CAP' || tier === 'G5CAP') && Math.random()*5>1) continue;
			// Arceus formes have 1/17 the normal rate each (so Arceus as a whole has a normal rate)
			if (keys[i].substr(0,6) === 'arceus' && Math.random()*17>1) continue;
			// Basculin formes have 1/2 the normal rate each (so Basculin as a whole has a normal rate)
			if (keys[i].substr(0,8) === 'basculin' && Math.random()*2>1) continue;
			// Not available on BW
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Limit 2 of any type
			var types = template.types.sort();
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
					continue; // No thanks, I've already got one
				}
			}

			var set = this.randomSet(template, i, pokemon);
			
			var setAbility = set.ability;
			// Limit 1 of any type combination
			var typeCombo = types.join();
			if (setAbility === 'Drought' || setAbility === 'Drizzle' || setAbility === 'Sand Stream' || setAbility === 'Snow Warning') {
				// Weather doesn't count towards any limits on type combinations
				typeCombo = setAbility;
				weather = setAbility;
			}
			if (typeCombo in typeComboCount && (!potd || (potd && i !== 1))) continue;
			
			// Limit number of Pokemon weak to any one type.
			// In essence, what this does is it allocates "points" on a per-type basis.
			// Pokemon weak to a type will get positive points in that type, Pokemon that resist get negative points.
			// Pokemon which are 4x weak to something get 2 points for that type, Pokemon that 4x resist get -2.
			// Pokemon which are immune to a type (except Shedinja) get -3 for that type.
			// If a type gets too many points (too many Pokemon are weak or not enough resist), the Pokemon which caused the excess is removed.
			if (setAbility !== 'Imposter') {
				var typeCache = {};
				for(var t in typeWeaknesses) {
					// Don't check Dragon, otherwise every team with a Dragon-type would be forced to also have a Steel-type.
					// If Gen VI comes about and the rumors are true that Fairies are immune to Dragon, this should be removed.
					if (t === 'Dragon') continue;
					var immune = false;
					if (!this.getImmunity(t, template)) {
						immune = true;
					} else if (setAbility === 'Levitate' && t === 'Ground') {
						immune = true;
					} else if (setAbility === 'Flash Fire' && t === 'Fire') {
						immune = true;
					} else if ((setAbility === 'Dry Skin' || setAbility === 'Water Absorb' || setAbility === 'Storm Drain') && t === 'Water') {
						immune = true;
					} else if (setAbility === 'Sap Sipper' && t === 'Grass') {
						immune = true;
					} else if ((setAbility === 'Lightningrod' || setAbility === 'Volt Absorb' || setAbility === 'Motor Drive') && t === 'Electric') {
						immune = true;
					} else if (setAbility === 'Wonder Guard') {
						var effectiveness = this.getEffectiveness(t, template);
						if (effectiveness > 0) {
							typeWeaknesses[t]++;
						} else {
							if (template.name === 'Shedinja') {
								// Sheddy's 1 HP means he dies a lot, and so his immunity shouldn't be weighted so highly.
								typeWeaknesses[t]--;
								typeCache[t] = -1;
								continue;
							} else {
								// In the event Wonder Guard is ever used on anyone else for some reason:
								immune = true;
							}
						}
					}
					if (immune) {
						// Immune Pokemon can save 2 teammates who are 2x weak or 1 teammate who is 4x weak
						typeWeaknesses[t] -= 2;
						typeCache[t] = -2;
						continue;
					}
					
					var effectiveness = this.getEffectiveness(t, template);
					// Air Balloons only work once, so while they provide a plus, it isn't a "true" immunity:
					if ((t === 'Ground' && set.item === 'Air Balloon') || (t === 'Ice' && set.item === 'Yache Berry')) effectiveness /= 2;
					if (setAbility === 'Solid Rock' && effectiveness > 0) effectiveness *= 0.75;
					if (weather === 'Drought') {
						if (t === 'Fire') effectiveness *= 1.5;
						if (t === 'Water') effectiveness *= 0.75;
					} else if (weather === 'Drizzle') {
						if (t === 'Fire') effectiveness *= 0.75;
						if (t === 'Water') effectiveness *= 1.5;
					}
					typeCache[t] = effectiveness;
					typeWeaknesses[t] += effectiveness;
					if (i === 0 || (potd && potd.name && potd.types && i === 1)) continue;
					if (weather === 'Drought') {
						if(setAbility === 'Chlorophyll' || setAbility === 'Solar Power' || setAbility === 'Flower Gift' || setAbility === 'Leaf Guard') continue;
					} else if (weather === 'Drizzle') {
						if (setAbility === 'Swift Swim' || setAbility === 'Rain Dish' || setAbility === 'Hydration') continue;
					} else if (weather === 'Sand Stream') {
						if (setAbility === 'Sand Force' || setAbility === 'Sand Rush' || setAbility === 'Sand Veil') continue;
					} else if (weather === 'Snow Warning') {
						if (setAbility === 'Snow Cloak' || setAbility === 'Ice Body') continue;
					}
					// Change what this is compared to in order to make this more / less strict
					// 0 means every weakness must be matched by a resistance, it likes to favor Spiritomb/Sableye/Eelektross
					// 1 allows a 2x effectiveness deficit or below, usually rejects 4 - 8 Pokemon per side and produces realistic but less random teams
					// 2 allows a 4x effectiveness deficit or below, usually rejects 0 - 3 Pokemon per side and produces fairly decent random teams
					if (typeWeaknesses[t] > 1) {
						skip = true;
						for (var c in typeCache) {
							// Undo everything:
							typeWeaknesses[c] -= typeCache[c];
						}
						break;
					}
				}
			}
			if (skip) continue;
			
			// Okay, the set passes, add it to our team
			pokemon.push(set);

			pokemonLeft++;
			// Now that our Pokemon has passed all checks, we can increment the type counter:
			for (var t=0; t<types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			if (typeCombo === 'Drought' || typeCombo === 'Drizzle' || typeCombo === 'Sand Stream' || typeCombo === 'Snow Warning') weather = typeCombo;
			typeComboCount[typeCombo] = 1;
			// Increment Uber/NU counter:
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'NU' || template.evos || tier === 'LC') {
				nuCount++;
			}
		}
		return pokemon;
	},
	randomSeasonalJJTeam: function(side) {
		// Seasonal Pokemon list
		var seasonalPokemonList = [
			'accelgor', 'aggron', 'arceusbug', 'ariados', 'armaldo', 'aurumoth', 'beautifly', 'beedrill', 'bellossom', 'blastoise',
			'butterfree', 'castform', 'charizard', 'cherrim', 'crawdaunt', 'crustle', 'delcatty', 'drifblim', 'durant',
			'dustox', 'escavalier', 'exeggutor', 'floatzel', 'forretress', 'galvantula', 'genesect', 'groudon', 'hariyama', 'heracross',
			'hooh', 'illumise', 'jumpluff', 'keldeo', 'kingler', 'krabby', 'kricketune', 'krillowatt', 'landorus', 'lapras',
			'leavanny', 'ledian', 'lilligant', 'ludicolo', 'lunatone', 'machamp', 'machoke', 'machop', 'magmar', 'magmortar',
			'malaconda', 'manaphy', 'maractus', 'masquerain', 'meganium', 'meloetta', 'moltres', 'mothim', 'ninetales',
			'ninjask', 'parasect', 'pelipper', 'pikachu', 'pinsir', 'politoed', 'raichu', 'rapidash', 'reshiram', 'rhydon',
			'rhyperior', 'roserade', 'rotomfan', 'rotomheat', 'rotommow', 'sawsbuck', 'scizor', 'scolipede', 'shedinja',
			'shuckle', 'slaking', 'snorlax', 'solrock', 'starmie', 'sudowoodo', 'sunflora', 'syclant', 'tentacool', 'tentacruel',
			'thundurus', 'tornadus', 'tropius', 'vanillish', 'vanillite', 'vanilluxe', 'venomoth', 'venusaur', 'vespiquen',
			'victreebel', 'vileplume', 'volbeat', 'volcarona', 'wailord', 'wormadam', 'wormadamsandy', 'wormadamtrash', 'yanmega', 'zapdos'
		];
		seasonalPokemonList = seasonalPokemonList.randomize();
		var team = [this.randomSet(this.getTemplate('delibird'), 0)];
		
		// Now, let's make the team!
		for (var i=1; i<6; i++) {
			var pokemon = seasonalPokemonList[i];
			var template = this.getTemplate(pokemon);
			var set = this.randomSet(template, i);
			if (template.id in {'vanilluxe':1, 'vanillite':1, 'vanillish':1}) {
				set.moves = ['icebeam', 'weatherball', 'autotomize', 'flashcannon'];
			}
			if (template.id in {'pikachu':1, 'raichu':1}) {
				set.moves = ['thunderbolt', 'surf', 'substitute', 'nastyplot'];
			}
			if (template.id in {'rhydon':1, 'rhyperior':1}) {
				set.moves = ['surf', 'megahorn', 'earthquake', 'rockblast'];
			}
			if (template.id === 'reshiram') {
				set.moves = ['tailwhip', 'dragontail', 'irontail', 'aquatail'];
			}
			if (template.id === 'aggron') {
				set.moves = ['surf', 'earthquake', 'bodyslam', 'rockslide'];
			}
			if (template.id === 'hariyama') {
				set.moves = ['surf', 'closecombat', 'facade', 'fakeout'];
			}
			team.push(set);
		}
		
		return team;
	}
};
