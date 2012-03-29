function toId(text)
{
	text = text || '';
	if (typeof text !== 'string') return ''; //???
	return text.replace(/ /g, '');
}
function clone(object) {
  var newObj = (object instanceof Array) ? [] : {};
  for (var i in object) {
    if (object[i] && typeof object[i] == "object") {
      newObj[i] = clone(object[i]);
    } else newObj[i] = object[i]
  } return newObj;
};
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}
function objectKeys(object) {
	var keys = [];
	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			keys.push(prop);
		}
	}
	return keys;
}

exports.BattleScripts = {
	runMove: function(move, pokemon, target) {
		move = this.getMove(move);
		this.setActiveMove(move, pokemon, target);
		
		if (pokemon.movedThisTurn || pokemon.runBeforeMove(target, move))
		{
			this.debug(''+pokemon.id+' move interrupted; movedThisTurn: '+pokemon.movedThisTurn);
			this.clearActiveMove(true);
			return;
		}
		if (move.beforeMoveCallback)
		{
			if (move.beforeMoveCallback.call(this, pokemon, target, move))
			{
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.lastDamage = 0;
		pokemon.deductPP(move);
		this.useMove(move, pokemon, target);
		this.runEvent('AfterMove', target, pokemon, move);
		this.runEvent('AfterMoveSelf', pokemon, target, move);
	},
	useMove: function(move, pokemon, target) {
		move = this.getMoveCopy(move);

		this.setActiveMove(move, pokemon, target);
		var canTargetFainted = {
			all: 1, foeSide: 1
		};
		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		move = this.runEvent('ModifyMove',pokemon,target,move,move);
		if (!move) return false;
		
		var attrs = '';
		var moveRoll = Math.random()*100;
		var missed = false;
		if (pokemon.fainted)
		{
			return false;
		}
		var boostTable = [1, 4/3, 5/3, 2, 7/3, 8/3, 3];
		var accuracy = move.accuracy;
		if (accuracy !== true)
		{
			if (!move.ignoreAccuracy)
			{
				if (pokemon.boosts.accuracy > 0)
				{
					accuracy *= boostTable[pokemon.boosts.accuracy];
				}
				else
				{
					accuracy /= boostTable[-pokemon.boosts.accuracy];
				}
			}
			if (!move.ignoreEvasion)
			{
				if (target.boosts.evasion > 0)
				{
					accuracy /= boostTable[target.boosts.evasion];
				}
				else
				{
					accuracy *= boostTable[-target.boosts.evasion];
				}
			}
		}
		if (move.ohko) // bypasses accuracy modifiers
		{
			accuracy = 30;
			if (pokemon.level > target.level) accuracy += (pokemon.level - target.level);
		}
		if (move.alwaysHit) accuracy = true; // bypasses ohko accuracy modifiers
		if (accuracy !== true && moveRoll >= accuracy)
		{
			missed = true;
			attrs = ' miss';
		}
		if (target.fainted && !canTargetFainted[move.target])
		{
			attrs = ' no-target';
		}
		this.add('move '+pokemon.id+' '+move.id+' ??'+attrs);
		if (missed)
		{
			this.add('r-miss '+pokemon.id);
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			if (move.selfdestruct && move.target === 'adjacent')
			{
				this.faint(pokemon, pokemon, move);
			}
			return true;
		}
		if (target.fainted && !canTargetFainted[move.target])
		{
			this.add('r-no-target');
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			if (move.selfdestruct && move.target === 'adjacent')
			{
				this.faint(pokemon, pokemon, move);
			}
			return true;
		}
		if (move.id === 'Return' || move.id === 'Frustration')
		{
			move.basePower = 102;
		}
		
		var damage = 0;
		pokemon.lastDamage = 0;
		if (!move.multihit)
		{
			damage = BattleScripts.moveHit.call(this, target, pokemon, move);
		}
		else
		{
			var hits = move.multihit;
			if (hits.length)
			{
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5)
				{
					var roll = parseInt(Math.random()*20);
					if (roll < 7) hits = 2;
					else if (roll < 14) hits = 3;
					else if (roll < 17) hits = 4;
					else hits = 5;
				}
				else
				{
					hits = hits[0] + (Math.random()*(hits[1]-hits[0]+1));
				}
			}
			hits = Math.floor(hits);
			for (var i=0; i<hits && target.hp; i++)
			{
				var moveDamage = BattleScripts.moveHit.call(this, target, pokemon, move);
				if (moveDamage === false) return true;
				damage += (moveDamage || 0);
			}
			this.add('r-hit-count '+target.id+' '+i);
		}
		
		target.gotAttacked(move, damage, pokemon);
		
		if (move.recoil && pokemon.lastDamage)
		{
			this.damage(pokemon.lastDamage * move.recoil[0] / move.recoil[1], pokemon, target, 'recoil');
		}
		if (move.drain && pokemon.lastDamage)
		{
			this.heal(pokemon.lastDamage * move.drain[0] / move.drain[1], pokemon, target, 'drain');
		}
		if (move.selfdestruct)
		{
			this.faint(pokemon, pokemon, move);
		}
		if (move.afterMoveCallback)
		{
			move.afterMoveCallback.call(this, pokemon, target);
		}
		if (!move.negateSecondary && damage !== false)
		{
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
		}
		return true;
	},
	moveHit: function(target, pokemon, move, moveData, isSecondary, isSelf) {
		move = this.getMoveCopy(move);

		if (!isSecondary && !isSelf) this.setActiveMove(move, pokemon, target);
		var hitResult = true;
		if (!moveData) moveData = move;

		if (typeof move.affectedByImmunities === 'undefined')
		{
			move.affectedByImmunities = (move.category !== 'Status');
		}
		
		// TryHit events:
		//   STEP 1: we see if the move will succeed at all:
		//   - TryHit, TryHitSide, or TryHitField are run on the move,
		//     depending on move target
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
		//   An exception is `TryHitSide`, which is passed the target side.
		
		// Note 2:
		//   In case you didn't notice, FieldHit and HitField mean different things.
		//     TryFieldHit - something in the field was hit
		//     TryHitField - our move has a target of 'all' i.e. the field, and hit
		//   This is a VERY important distinction: Every move triggers
		//   TryFieldHit, but only  moves with a target of "all" (e.g.
		//   Haze) trigger TryHitField.
		
		if (target)
		{
			if (move.target === 'all' && !isSelf)
			{
				hitResult = this.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
			}
			else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf)
			{
				hitResult = this.singleEvent('TryHitSide', moveData, {}, target.side, pokemon, move);
			}
			else
			{
				hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);
			}
			if (!hitResult)
			{
				if (hitResult === false) this.add('r-failed '+target.id);
				return false;
			}
			// only run the hit events for the hit itself, not the secondary or self hits
			if (!isSelf && !isSecondary)
			{
				if (move.target !== 'all' && move.target !== 'foeSide' && move.target !== 'allySide')
				{
					hitResult = this.runEvent('TryHit', target, pokemon, move);
					if (!hitResult)
					{
						if (hitResult === false) this.add('r-failed '+target.id);
						if (hitResult !== 0) // special Substitute hit flag
						{
							return false;
						}
					}
				}
				if (!this.runEvent('TryFieldHit', target, pokemon, move))
				{
					return false;
				}
			}
			
			if (hitResult === 0)
			{
				target = null;
			}
			else if (!hitResult)
			{
				if (hitResult === false) this.add('r-failed '+target.id);
				return false;
			}
		}
		
		if (target)
		{
			var didSomething = false;
			var damage = this.getDamage(pokemon, target, moveData);
			if (damage === false || damage === null)
			{
				this.singleEvent('MoveFail', move, null, target, pokemon, move);
				return false;
			}
			if (move.noFaint && damage >= target.hp)
			{
				damage = target.hp - 1;
			}
			if (damage && !target.fainted)
			{
				damage = this.damage(damage, target, pokemon, move);
				if (!damage) return false;
				didSomething = true;
			}
			else if (damage === false && typeof hitResult === 'undefined')
			{
				this.add('r-failed '+target.id);
			}
			if (moveData.boosts && !target.fainted)
			{
				this.boost(moveData.boosts, target, pokemon, move);
			}
			if (moveData.heal && !target.fainted)
			{
				var d = target.heal(target.maxhp * moveData.heal[0] / moveData.heal[1]);
				if (!d)
				{
					this.add('r-failed '+target.id);
					return false;
				}
				this.add('r-heal '+target.id+' '+target.hpPercent(d)+target.getHealth());
				didSomething = true;
			}
			if (moveData.status)
			{
				if (!target.status)
				{
					target.setStatus(moveData.status, pokemon, move);
				}
				else if (!isSecondary)
				{
					// already-status
					this.add('r-status '+target.id+' '+target.status);
				}
				didSomething = true;
			}
			if (moveData.forceStatus)
			{
				if (target.setStatus(moveData.forceStatus, pokemon, move))
				{
					didSomething = true;
				}
			}
			if (moveData.volatileStatus)
			{
				if (target.addVolatile(moveData.volatileStatus, pokemon, move))
				{
					didSomething = true;
				}
			}
			if (moveData.sideCondition)
			{
				if (target.side.addSideCondition(moveData.sideCondition, pokemon, move))
				{
					didSomething = true;
				}
			}
			if (moveData.weather)
			{
				if (this.setWeather(moveData.weather, pokemon, move))
				{
					didSomething = true;
				}
			}
			if (moveData.pseudoWeather)
			{
				if (this.addPseudoWeather(moveData.pseudoWeather, pokemon, move))
				{
					didSomething = true;
				}
			}
			// Hit events
			//   These are like the TryHit events, except we don't need a FieldHit event.
			//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
			if (move.target === 'all' && !isSelf)
			{
				hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
			}
			else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf)
			{
				hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
			}
			else
			{
				hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
				if (!isSelf && !isSecondary)
				{
					this.runEvent('Hit', target, pokemon, move);
				}
			}
			if (!hitResult && !didSomething)
			{
				if (hitResult === false) this.add('r-failed '+target.id);
				return false;
			}
		}
		if (moveData.self)
		{
			BattleScripts.moveHit.call(this, pokemon, pokemon, move, moveData.self, isSecondary, true);
		}
		if (moveData.secondaries)
		{
			var secondaryRoll;
			for (var i = 0; i < moveData.secondaries.length; i++)
			{
				secondaryRoll = Math.random()*100;
				if (typeof moveData.secondaries[i].chance === 'undefined' || secondaryRoll < moveData.secondaries[i].chance)
				{
					BattleScripts.moveHit.call(this, target, pokemon, move, moveData.secondaries[i], true, isSelf);
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0)
		{
			if (moveData.forceSwitch && this.runEvent('DragOut', target, pokemon, move))
			{
				this.dragIn(target.side);
			}
		}
		if (move.selfSwitch || move.batonPass)
		{
			pokemon.switchFlag = true;
		}
		return damage;
	},
	getTeam: function(side) {
		if (side.battle.getFormat().team === 'random')
		{
			return BattleScripts.randomTeam.call(this, side);
		}
		else if (side.user && side.user.team && side.user.team !== 'random')
		{
			return side.user.team;
		}
		else
		{
			return BattleScripts.randomTeam.call(this,side);
		}
	},
	randomTeam: function(side) {
		var battle = this;
		
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		for (var prop in BattlePokedex) {
			if (BattlePokedex.hasOwnProperty(prop) && BattlePokedex[prop].viable) {
				keys.push(prop);
			}
		}
		keys = shuffle(keys);
		
		var PotD = this.getEffect('PotD');
		var ruleset = this.getFormat().ruleset;
		
		for (var i=0; i<keys.length && pokemonLeft < 6; i++)
		{
			var template = this.getTemplate(keys[i]);
			
			if (!template || !template.name || !template.types) continue;
			if (template.tier === 'CAP' && Math.random()*3>1) continue;
			
			if (ruleset && ruleset[0]==='PotD' && PotD && PotD.onPotD)
			{
				var potd = this.getTemplate(PotD.onPotD);
				if (i===1) template = potd;
				else if (template.species === potd.species) continue; // No thanks, I've already got one
			}
			if (!template || !template.name || !template.types) continue;
			
			if (template.species === 'Magikarp')
			{
				template.viablemoves = ["Magikarp'sRevenge", "Splash", "Bounce"];
			}
			if (template.species === 'Delibird')
			{
				template.viablemoves = ["Present", "Bestow"];
			}
			
			var moveKeys = shuffle(objectKeys(template.viablemoves));
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
			if (template.types[1]) hasType[template.types[1]] = true;
			
			var hasMove = {};
			var counter = {};
			var setupType = '';
			
			var j=0;
			do
			{
				while (moves.length<4 && j<moveKeys.length)
				{
					var moveid = toId(template.viablemoves[moveKeys[j]]);
					//if (j===0) moveid = 'ChargeBeam';
					moves.push(moveid);
					j++;
				}
				
				hasMove = {};
				counter = {
					Physical: 0, Special: 0, Status: 0, damage: 0,
					Technician: 0, SkillLink: 0, Contrary: 0,
					recoil: 0, inaccurate: 0,
					physicalSetup: 0, specialSetup: 0, mixedSetup: 0
				};
				for (var k=0; k<moves.length; k++)
				{
					var moveid = moves[k];
					var move = this.getMove(moveid);
					hasMove[moveid] = true;
					if (move.damage || move.damageCallback)
					{
						counter['damage']++;
					}
					else
					{
						counter[move.category]++;
					}
					if (move.basePower && move.basePower <= 60)
					{
						counter['Technician']++;
					}
					if (move.multihit && move.multihit[1] === 5)
					{
						counter['SkillLink']++;
					}
					if (move.recoil)
					{
						counter['recoil']++;
					}
					if (move.accuracy && move.accuracy !== true && move.accuracy < 90)
					{
						counter['inaccurate']++;
					}
					var ContraryMove = {
						LeafStorm: 1, Overheat: 1, CloseCombat: 1, Superpower: 1, 'V-create': 1
					};
					if (ContraryMove[move.id])
					{
						counter['Contrary']++;
					}
					var PhysicalSetup = {
						SwordsDance:1, DragonDance:1, Coil:1, BulkUp:1, Curse:1
					};
					var SpecialSetup = {
						NastyPlot:1, TailGlow:1, QuiverDance:1, CalmMind:1
					};
					var MixedSetup = {
						Growth:1, WorkUp:1, ShellSmash:1
					};
					if (PhysicalSetup[move.id])
					{
						counter['physicalSetup']++;
					}
					if (SpecialSetup[move.id])
					{
						counter['specialSetup']++;
					}
					if (MixedSetup[move.id])
					{
						counter['mixedSetup']++;
					}
				}
				
				if (counter['mixedSetup'])
				{
					setupType = 'Mixed';
				}
				else if (counter['specialSetup'])
				{
					setupType = 'Special';
				}
				else if (counter['physicalSetup'])
				{
					setupType = 'Physical';
				}
				
				for (var k=0; k<moves.length; k++)
				{
					var moveid = moves[k];
					var move = this.getMove(moveid);
					var rejected = false;
					var isSetup = false;
					
					switch (moveid)
					{
					// not very useful without their supporting moves
					
					case 'SleepTalk':
						if (!hasMove['Rest']) rejected = true;
						if (hasMove['Trick'] || hasMove['Protect'] || hasMove['Substitute'] || hasMove['BellyDrum']) rejected = true;
						break;
					case 'Endure':
						if (!hasMove['Flail'] && !hasMove['Endeavor'] && !hasMove['Reversal']) rejected = true;
						break;
					
					// we only need to set up once
					
					case 'SwordsDance': case 'DragonDance': case 'Coil': case 'Curse': case 'BulkUp':
						if (!counter['Physical'] && !hasMove['BatonPass']) rejected = true;
						if (setupType !== 'Physical' || counter['physicalSetup'] > 1) rejected = true;
						isSetup = true;
						break;
					case 'NastyPlot': case 'TailGlow': case 'QuiverDance': case 'CalmMind':
						if (!counter['Special'] && !hasMove['BatonPass']) rejected = true;
						if (setupType !== 'Special' || counter['specialSetup'] > 1) rejected = true;
						isSetup = true;
						break;
					case 'ShellSmash': case 'Growth': case 'WorkUp':
						if (!counter['Special'] && !counter['Physical'] && !hasMove['BatonPass']) rejected = true;
						if (setupType !== 'Mixed' || counter['mixedSetup'] > 1) rejected = true;
						isSetup = true;
						break;
					
					// bad after setup
					case 'SeismicToss': case 'NightShade': case 'SuperFang':
						if (setupType) rejected = true;
						break;
					case 'KnockOff': case 'Protect': case 'PerishSong': case 'MagicCoat':
						if (setupType) rejected = true;
						break;
					
					// bit redundant to have both
					
					case 'FireBlast':
						if (hasMove['Eruption'] || hasMove['Overheat']) rejected = true;
						break;
					case 'Flamethrower':
						if (hasMove['LavaPlume'] || hasMove['FireBlast'] || hasMove['Overheat']) rejected = true;
						break;
					case 'IceBeam':
						if (hasMove['Blizzard']) rejected = true;
						break;
					case 'Surf':
						if (hasMove['Scald'] || hasMove['HydroPump']) rejected = true;
						break;
					case 'EnergyBall':
					case 'GrassKnot':
					case 'PetalDance':
						if (hasMove['GigaDrain']) rejected = true;
						break;
					case 'SeedBomb':
						if (hasMove['NeedleArm']) rejected = true;
						break;
					case 'FlareBlitz':
						if (hasMove['FirePunch']) rejected = true;
						break;
					case 'Thunderbolt':
						if (hasMove['Discharge'] || hasMove['VoltSwitch'] || hasMove['Thunder']) rejected = true;
						break;
					case 'Discharge':
						if (hasMove['VoltSwitch'] || hasMove['Thunder']) rejected = true;
						break;
					case 'RockSlide':
						if (hasMove['StoneEdge']) rejected = true;
						break;
					case 'DragonClaw':
						if (hasMove['Outrage'] || hasMove['DragonTail']) rejected = true;
						break;
					case 'AncientPower':
						if (hasMove['PaleoWave']) rejected = true;
						break;
					case 'DragonPulse':
						if (hasMove['DracoMeteor']) rejected = true;
						break;
					case 'Return':
						if (hasMove['BodySlam']) rejected = true;
						if (hasMove['Flail']) rejected = true;
						if (hasMove['Facade']) rejected = true;
						break;
					case 'Flail':
						if (hasMove['Facade']) rejected = true;
						break;
					case 'PoisonJab':
						if (hasMove['GunkShot']) rejected = true;
						break;
					case 'Psychic':
						if (hasMove['Psyshock']) rejected = true;
						break;
					
					case 'Yawn':
						if (hasMove['GrassWhistle']) rejected = true;
						break;
					case 'Rest':
						if (hasMove['MorningSun']) rejected = true;
						break;
					case 'Softboiled':
						if (hasMove['Wish']) rejected = true;
						break;
					case 'PerishSong':
						if (hasMove['Roar'] || hasMove['Whirlwind'] || hasMove['Haze']) rejected = true;
						break;
					case 'Whirlwind':
						// outclasses Roar because Soundproof
						if (hasMove['Roar'] || hasMove['Haze']) rejected = true;
						break;
					case 'Roost':
						if (hasMove['Recover']) rejected = true;
						break;
					}
					if (k===3)
					{
						if (counter['Status']>=4)
						{
							// taunt bait, not okay
							rejected = true;
						}
					}
					var SetupException = {
						Overheat:1, DracoMeteor:1, LeafStorm:1,
						VoltSwitch:1, 'U-turn':1,
						SuckerPunch:1, ExtremeSpeed:1
					};
					if (move.category === 'Special' && setupType === 'Physical' && !SetupException[move.id])
					{
						rejected = true;
					}
					if (move.category === 'Physical' && setupType === 'Special' && !SetupException[move.id])
					{
						rejected = true;
					}
					if (setupType === 'Physical' && move.category !== 'Physical' && counter['Physical'] < 2)
					{
						rejected = true;
					}
					if (setupType === 'Special' && move.category !== 'Special' && counter['Special'] < 2)
					{
						rejected = true;
					}
					
					var todoMoves = {
						BeatUp:1,
						Disable:1
					};
					if (todoMoves[move.id]) rejected = true;
					
					if (rejected && j<moveKeys.length)
					{
						moves.splice(k,1);
						break;
					}
				}
				
			} while (moves.length<4 && j<moveKeys.length);
			
			// any moveset modification goes here
			//moves[0] = 'Safeguard';
			
			{
				var abilities = [template.abilities['0']];
				if (template.abilities['1'])
				{
					abilities.push(template.abilities['1']);
				}
				if (template.abilities['DW'])
				{
					abilities.push(template.abilities['DW']);
				}
				abilities.sort(function(a,b){
					return battle.getAbility(b).rating - battle.getAbility(a).rating;
				});
				ability = toId(abilities[0]);
				if (abilities[1])
				{
					var ability0 = this.getAbility(abilities[0]);
					var ability1 = this.getAbility(abilities[1]);
					
					if (ability0.rating <= ability1.rating)
					{
						if (Math.random()*2<1)
						{
							ability = toId(abilities[1]);
						}
					}
					else if (ability0.rating - 0.6 <= ability1.rating)
					{
						if (Math.random()*3<1)
						{
							ability = toId(abilities[1]);
						}
					}
					
					var rejectAbility = false;
					if (ability === 'Contrary' && !counter['Contrary'])
					{
						rejectAbility = true;
					}
					if (ability === 'Technician' && !counter['Technician'])
					{
						rejectAbility = true;
					}
					if (ability === 'SkillLink' && !counter['SkillLink'])
					{
						rejectAbility = true;
					}
					if ((ability === 'RockHead' || ability === 'Reckless') && !counter['recoil'])
					{
						rejectAbility = true;
					}
					if ((ability === 'NoGuard' || ability === 'CompoundEyes') && !counter['inaccurate'])
					{
						rejectAbility = true;
					}
					if (ability === 'Moody')
					{
						rejectAbility = true;
					}
					
					if (rejectAbility)
					{
						if (ability === toId(abilities[1])) // or not
						{
							ability = toId(abilities[0]);
						}
						else
						{
							ability = toId(abilities[1]);
						}
					}
					if ((abilities[1] === 'Guts' || abilities[0] === 'Guts' || abilities[3] === 'Guts') && ability !== 'QuickFeet' && hasMove['Facade'])
					{
						ability = 'Guts';
					}
				}
				
				if (hasMove['GyroBall'])
				{
					ivs.spe = 0;
					//evs.atk += evs.spe;
					evs.spe = 0;
				}
				else if (hasMove['TrickRoom'])
				{
					ivs.spe = 0;
					//evs.hp += evs.spe;
					evs.spe = 0;
				}
				
				item = 'FocusSash';
				if (template.species === 'Giratina-O')
				{
					item = 'GriseousOrb';
				}
				else if (template.species === 'Rotom-S')
				{
					// this is just to amuse myself
					item = 'AirBalloon';
				}
				else if (template.species === 'Delibird')
				{
					// to go along with the Christmas Delibird set
					item = 'Leftovers';
				}
				else if (ability === 'Imposter')
				{
					item = 'ChoiceScarf';
				}
				else if (hasMove["Magikarp'sRevenge"])
				{
					item = 'ChoiceBand';
				}
				else if (ability === 'WonderGuard')
				{
					item = 'FocusSash';
				}
				else if (template.species === 'Unown')
				{
					item = 'ChoiceSpecs';
				}
				else if (hasMove['Trick'] && hasMove['GyroBall'] && (ability === 'Levitate' || hasType['Flying']))
				{
					item = 'MachoBrace';
				}
				else if (hasMove['Trick'] && hasMove['GyroBall'])
				{
					item = 'IronBall';
				}
				else if (counter.Physical >= 3 && (hasMove['Trick'] || hasMove['Switcheroo']))
				{
					item = 'ChoiceBand';
				}
				else if (counter.Special >= 3 && (hasMove['Trick'] || hasMove['Switcheroo']))
				{
					item = 'ChoiceSpecs';
				}
				else if (counter.Status <= 1 && (hasMove['Trick'] || hasMove['Switcheroo']))
				{
					item = 'ChoiceScarf';
				}
				else if (hasMove['Rest'] && !hasMove['SleepTalk'])
				{
					item = 'ChestoBerry';
				}
				else if (hasMove['NaturalGift'])
				{
					item = 'LiechiBerry';
				}
				else if (template.species === 'Cubone' || template.species === 'Marowak')
				{
					item = 'ThickClub';
				}
				else if (template.species === 'Pikachu')
				{
					item = 'LightBall';
				}
				else if (template.species === 'Clamperl')
				{
					item = 'DeepSeaTooth';
				}
				else if (hasMove['Reflect'] && hasMove['LightScreen'])
				{
					item = 'LightClay';
				}
				else if (hasMove['Acrobatics'])
				{
					item = 'FlyingGem';
				}
				else if (hasMove['ShellSmash'])
				{
					item = 'WhiteHerb';
				}
				else if (ability === 'PoisonHeal')
				{
					item = 'ToxicOrb';
				}
				else if (hasMove['RainDance'])
				{
					item = 'DampRock';
				}
				else if (hasMove['SunnyDay'])
				{
					item = 'HeatRock';
				}
				else if (hasMove['Sandstorm']) // lol
				{
					item = 'SmoothRock';
				}
				else if (hasMove['Hail']) // lol
				{
					item = 'IcyRock';
				}
				else if (ability === 'MagicGuard' && hasMove['PsychoShift'])
				{
					item = 'FlameOrb';
				}
				else if (ability === 'SheerForce' || ability === 'MagicGuard')
				{
					item = 'LifeOrb';
				}
				else if (hasMove['Trick'] || hasMove['Switcheroo'])
				{
					item = 'ChoiceScarf';
				}
				else if (ability === 'Guts')
				{
					if (hasMove['DrainPunch'])
					{
						item = 'FlameOrb';
					}
					else
					{
						item = 'ToxicOrb';
					}
					if ((hasMove['Return'] || hasMove['HyperFang']) && !hasMove['Facade'])
					{
						// lol no
						for (var j=0; j<moves.length; j++)
						{
							if (moves[j] === 'Return' || moves[j] === 'HyperFang')
							{
								moves[j] = 'Facade';
								break;
							}
						}
					}
				}
				else if (ability === 'MarvelScale' && hasMove['PsychoShift'])
				{
					item = 'FlameOrb';
				}
				else if (hasMove['Reflect'] || hasMove['LightScreen'])
				{
					// less priority than if you'd had both
					item = 'LightClay';
				}
				else if (counter.Physical >= 4 && !hasMove['FakeOut'] && !hasMove['SuckerPunch'])
				{
					if (Math.random()*3 > 1)
					{
						item = 'ChoiceBand';
					}
					else
					{
						item = 'ExpertBelt';
					}
				}
				else if (counter.Special >= 4)
				{
					if (Math.random()*3 > 1)
					{
						item = 'ChoiceSpecs';
					}
					else
					{
						item = 'ExpertBelt';
					}
				}
				else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate')
				{
					item = 'AirBalloon';
				}
				else if (hasMove['Eruption'] || hasMove['WaterSpout'])
				{
					item = 'ChoiceScarf';
				}
				else if (hasMove['Substitute'] || hasMove['Detect'] || hasMove['Protect'])
				{
					item = 'Leftovers';
				}
				else if ((hasMove['Flail'] || hasMove['Reversal']) && !hasMove['Endure'])
				{
					item = 'FocusSash';
				}
				else if (ability === 'IronBarbs')
				{
					// only Iron Barbs for now
					item = 'RockyHelmet';
				}
				else if ((template.baseStats.hp+75)*(template.baseStats.def+template.baseStats.spd+175) > 60000 || template.species === 'Skarmory' || template.species === 'Forretress')
				{
					// skarmory and forretress get exceptions for their typing
					item = 'Leftovers';
				}
				else if (counter.Physical + counter.Special >= 3 && setupType)
				{
					item = 'LifeOrb';
				}
				else if (counter.Special >= 3 && setupType)
				{
					item = 'LifeOrb';
				}
				else if (counter.Physical + counter.Special >= 4)
				{
					item = 'ExpertBelt';
				}
				else if (i===0)
				{
					item = 'FocusSash';
				}
				
				// this is the "REALLY can't think of a good item" cutoff
				// why not always Leftovers? Because it's boring. :P
				
				else if (hasType['Flying'] || ability === 'Levitate')
				{
					item = 'Leftovers';
				}
				else if (this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate')
				{
					item = 'AirBalloon';
				}
				else if (hasType['Poison'])
				{
					item = 'BlackSludge';
				}
				else if (counter.Status <= 1)
				{
					item = 'LifeOrb';
				}
				/* else if ((template.baseStats.hp+75)*(template.baseStats.def+template.baseStats.spd+175) > 50000)
				{
					item = 'Leftovers';
				}
				else if (this.getEffectiveness('Ground', template) >= 0)
				{
					item = 'AirBalloon';
				} */
				else
				{
					item = 'Leftovers';
				}
				
				if (item === 'Leftovers' && hasType['Poison'])
				{
					item = 'BlackSludge';
				}
			}
			
			var levelScale = {
				LC: 95,
				NFE: 95,
				'LC Uber': 90,
				NU: 90,
				RU: 85,
				BL2: 83,
				UU: 80,
				BL: 78,
				OU: 75,
				CAP: 74,
				G4CAP: 74,
				G5CAP: 74,
				Unreleased: 75,
				Uber: 70
			};
			var customScale = {
				Meloetta: 78,
				Caterpie: 99, Metapod: 99,
				Weedle: 99, Kakuna: 99,
				Hoppip: 99,
				Wurmple: 99, Silcoon: 99, Cascoon: 99,
				Feebas: 99,
				Magikarp: 99
			};
			var level = levelScale[template.tier] || 90;
			if (customScale[template.name]) level = customScale[template.name];
			
			if (template.name === 'Chandelure' && ability === 'ShadowTag') level = 70;
			if (template.name === 'Serperior' && ability === 'Contrary') level = 75;
			if (template.name === 'Rotom-S' && item === 'Balloon') level = 95;
			if (template.name === 'Magikarp' && hasMove['Magikarp\'sRevenge']) level = 85;
			
			pokemon.push({
				name: template.name,
				moves: moves,
				ability: ability,
				evs: evs,
				item: item,
				level: level
			});
			pokemonLeft++;
		}
		return pokemon;
	},
	getNature: function(nature) {
		if (typeof nature === 'string') nature = BattleNatures[nature];
		if (!nature) nature = {};
		return nature;
	},
	natureModify: function(stats, nature) {
		if (typeof nature === 'string') nature = BattleNatures[nature];
		if (!nature) return stats;
		if (nature.plus) stats[nature.plus] *= 1.1;
		if (nature.minus) stats[nature.minus] *= 0.9;
		return stats;
	}
};

var BattleNatures = {
	Adamant: {plus:'atk', minus:'spa'},
	Bashful: {},
	Bold: {plus:'def', minus:'atk'},
	Brave: {plus:'atk', minus:'spe'},
	Calm: {plus:'spd', minus:'atk'},
	Careful: {plus:'spd', minus:'spa'},
	Docile: {},
	Gentle: {plus:'spd', minus:'def'},
	Hardy: {},
	Hasty: {plus:'spe', minus:'def'},
	Impish: {plus:'def', minus:'spa'},
	Jolly: {plus:'spe', minus:'spa'},
	Lax: {plus:'def', minus:'spd'},
	Lonely: {plus:'atk', minus:'def'},
	Mild: {plus:'spa', minus:'def'},
	Modest: {plus:'spa', minus:'atk'},
	Naive: {plus:'spe', minus:'spd'},
	Naughty: {plus:'atk', minus:'spd'},
	Quiet: {plus:'spa', minus:'spe'},
	Quirky: {},
	Rash: {plus:'spa', minus:'spd'},
	Relaxed: {plus:'def', minus:'spe'},
	Sassy: {plus:'spd', minus:'spe'},
	Serious: {},
	Timid: {plus:'spe', minus:'atk'},
};

var BattleScripts = exports.BattleScripts;