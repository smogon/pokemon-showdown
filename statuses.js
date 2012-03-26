exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' brn');
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.ability !== 'Guts')
			{
				stats.atk /= 2;
			}
		},
		onResidualPriority: 50-9,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		}
	},
	par: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' par');
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.ability !== 'QuickFeet')
			{
				stats.spe /= 4;
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon) {
			if (Math.random()*4 < 1)
			{
				this.add('cant-move '+pokemon.id+' fully-paralyzed');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' slp');
			// 1-3 turns
			this.effectData.startTime = 2+parseInt(Math.random()*3);
			this.effectData.time = this.effectData.startTime;
			if (target.getAbility().isHalfSleep)
			{
				this.effectData.time = Math.floor(this.effectData.time / 2);
			}
		},
		onSwitchIn: function(target) {
			this.effectData.time = this.effectData.startTime;
			if (target.getAbility().isHalfSleep)
			{
				this.effectData.time = Math.floor(this.effectData.time / 2);
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			pokemon.statusData.time--;
			if (!pokemon.statusData.time)
			{
				this.add('r-cure-status '+pokemon.id+' slp');
				pokemon.setStatus('');
				return;
			}
			this.add('residual '+pokemon.id+' slp');
			if (move.sleepUsable)
			{
				return;
			}
			return false;
		}
	},
	frz: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (Math.random()*5 < 1 || move.thawsUser)
			{
				this.add('r-cure-status '+pokemon.id+' frz');
				pokemon.setStatus('');
				return;
			}
			this.add('cant-move '+pokemon.id+' frozen');
			return false;
		},
		onHit: function(target, source, move) {
			if (move.type === 'Fire' || move.id === 'Scald')
			{
				this.add('r-cure-status '+target.id+' frz');
				target.setStatus('');
			}
		}
	},
	psn: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' psn');
		},
		onResidualPriority: 50-9,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('r-status '+target.id+' toxic');
			this.effectData.stage = 0;
		},
		onSwitchIn: function() {
			this.effectData.stage = 0;
		},
		onResidual: function(pokemon) {
			this.effectData.stage++;
			this.damage(pokemon.maxhp*this.effectData.stage/16);
		}
	},
	confusion: {
		// this is a volatile status
		noCopy: true, // doesn't get copied by Baton Pass
		onStart: function(target) {
			this.add('r-volatile '+target.id+' confused');
			this.effectData.time = 2 + parseInt(Math.random()*4);
		},
		onEnd: function(target) {
			this.add('r-volatile '+target.id+' confused end');
		},
		onBeforeMove: function(pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time)
			{
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('residual '+pokemon.id+' confused');
			if (Math.random()*2 < 1)
			{
				return;
			}
			this.add('r-hurt-confusion '+pokemon.id+'');
			this.damage(this.getDamage(pokemon,pokemon,40), pokemon, pokemon, {id:'confusion', effectType:'Move', type:'???'});
			return false;
		}
	},
	flinch: {
		duration: 1,
		onBeforeMove: function(pokemon) {
			if (!this.runEvent('Flinch', pokemon))
			{
				return;
			}
			this.add('flinch '+pokemon.id);
			return false;
		}
	},
	trapped: {
		noCopy: true,
		onModifyPokemon: function(pokemon) {
			if (!this.effectData.source || !this.effectData.source.isActive)
			{
				delete pokemon.volatiles['trapped'];
				return;
			}
			pokemon.trapped = true;
		}
	},
	partiallyTrapped: {
		duration: 5,
		durationCallback: function(target, source) {
			if (source.item === 'GripClaw') return 5;
			return Math.floor(4 + Math.random()*2);
		},
		onResidualPriority: 50-11,
		onResidual: function(pokemon) {
			if (this.effectData.source && !this.effectData.source.isActive)
			{
				pokemon.removeVolatile('partiallyTrapped');
				return;
			}
			this.damage(pokemon.maxhp/16);
		},
		onEnd: function(pokemon) {
			this.add('message '+this.effectData.sourceEffect.id+' ended');
		},
		onModifyPokemon: function(pokemon) {
			pokemon.trapped = true;
		}
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function() {
			return 2 + parseInt(2*Math.random());
		},
		onResidual: function(target) {
			var move = this.getMove(target.lastMove);
			if (!move.self || move.self.volatileStatus !== 'lockedmove')
			{
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
		},
		onEnd: function(target) {
			this.add('r-calm '+target.id);
			target.addVolatile('confusion');
		},
		onModifyPokemon: function(pokemon) {
			pokemon.lockMove(pokemon.lastMove);
		},
		onBeforeTurn: function(pokemon) {
			var move = this.getMove(pokemon.lastMove);
			if (pokemon.lastMove)
			{
				this.debug('Forcing into '+pokemon.lastMove);
				this.changeDecision(pokemon, {move: pokemon.lastMove});
			}
		}
	},
	choicelock: {
		onModifyPokemon: function(pokemon) {
			if (!pokemon.lastMove || !pokemon.hasMove(pokemon.lastMove))
			{
				return;
			}
			if (!pokemon.getItem().isChoice)
			{
				pokemon.removeVolatile('choicelock');
				return;
			}
			var moves = pokemon.moveset;
			for (var i=0; i<moves.length; i++)
			{
				if (moves[i].id !== pokemon.lastMove)
				{
					moves[i].disabled = true;
				}
			}
		}
	},
	mustRecharge: {
		duration: 2,
		onBeforeMove: function(pokemon) {
			this.add('cant-move '+pokemon.id+' must-recharge');
			return false;
		},
		onModifyPokemon: function(pokemon) {
			pokemon.lockMove('recharge');
		}
	},
	futureMove: {
		// this is a side condition
		onStart: function(side) {
			this.effectData.positions = [];
			for (var i=0; i<side.active.length; i++)
			{
				this.effectData.positions[i] = null;
			}
		},
		onResidualPriority: 50-3,
		onResidual: function(side) {
			var finished = true;
			for (var i=0; i<side.active.length; i++)
			{
				var posData = this.effectData.positions[i];
				if (!posData) continue;
				
				posData.duration--;
				
				if (posData.duration > 0)
				{
					finished = false;
					continue;
				}
				
				// time's up; time to hit! :D
				var target = side.foe.active[posData.targetPosition];
				var move = this.getMove(posData.move);
				if (target.fainted)
				{
					this.add('hint '+move.name+' did not hit because the target is fainted.');
					this.effectData.positions[i] = null;
					continue;
				}
				
				this.add('message '+move.name+' hit! (placeholder)');
				target.removeVolatile('Protect');
				target.removeVolatile('Endure');
				
				this.moveHit(target, posData.source, move, posData.moveData);
				
				this.effectData.positions[i] = null;
			}
			if (finished)
			{
				side.removeSideCondition('futureMove');
			}
		}
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		onStart: function() {
			this.effectData.counter = 1;
		},
		onRestart: function() {
			this.effectData.counter++;
			this.effectData.duration = 2;
		}
	},
	
	// weather
	
	// weather is implemented here since it's so important to the game
	
	RainDance: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'DampRock')
			{
				return 8;
			}
			return 5;
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water')
			{
				this.debug('rain water boost');
				return basePower * 1.5;
			}
			if (move.type === 'Fire')
			{
				this.debug('rain fire suppress');
				return basePower * .5;
			}
		},
		onModifyMove: function(move) {
			if (move.id === 'Thunder' || move.id === 'Hurricane')
			{
				move.accuracy = true;
			}
			if (move.id === 'WeatherBall')
			{
				move.type = 'Water';
				move.basePower = 100;
			}
			if (move.id === 'Moonlight' || move.id === 'MorningSun' || move.id === 'Synthesis')
			{
				move.heal = [1,4];
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability')
			{
				this.effectData.duration = 0;
				this.add('r-weather '+source.id+' rain');
			}
			else
			{
				this.add('weather rain');
			}
		},
		onResidualPriority: 50-1,
		onResidual: function() {
			this.add('weather rain');
			this.eachEvent('Weather');
		},
		onEnd: function() {
			this.add('weather none');
		}
	},
	SunnyDay: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'HeatRock')
			{
				return 8;
			}
			return 5;
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire')
			{
				this.debug('Sunny Day fire boost');
				return basePower * 1.5;
			}
			if (move.type === 'Water')
			{
				this.debug('Sunny Day water suppress');
				return basePower * .5;
			}
		},
		onModifyMove: function(move) {
			if (move.id === 'Thunder' || move.id === 'Hurricane')
			{
				move.accuracy = 50;
			}
			if (move.id === 'WeatherBall')
			{
				move.type = 'Fire';
				move.basePower = 100;
			}
			if (move.id === 'Moonlight' || move.id === 'MorningSun' || move.id === 'Synthesis')
			{
				move.heal = [2,3];
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability')
			{
				this.effectData.duration = 0;
				this.add('r-weather '+source.id+' sun');
			}
			else
			{
				this.add('weather sun');
			}
		},
		onImmunity: function(type) {
			if (type === 'frz') return false;
		},
		onResidualPriority: 50-1,
		onResidual: function() {
			this.add('weather sun');
			this.eachEvent('Weather');
		},
		onEnd: function() {
			this.add('weather none');
		}
	},
	Sandstorm: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'SmoothRock')
			{
				return 8;
			}
			return 5;
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.hasType('Rock'))
			{
				stats.spd *= 3/2;
			}
		},
		onModifyMove: function(move) {
			if (move.id === 'WeatherBall')
			{
				move.type = 'Rock';
				move.basePower = 100;
			}
			if (move.id === 'Moonlight' || move.id === 'MorningSun' || move.id === 'Synthesis')
			{
				move.heal = [1,4];
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability')
			{
				this.effectData.duration = 0;
				this.add('r-weather '+source.id+' sandstorm');
			}
			else
			{
				this.add('weather sandstorm');
			}
		},
		onResidualPriority: 50-1,
		onResidual: function() {
			this.add('weather sandstorm');
			this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('weather none');
		}
	},
	Hail: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'IcyRock')
			{
				return 8;
			}
			return 5;
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability')
			{
				this.effectData.duration = 0;
				this.add('r-weather '+source.id+' hail');
			}
			else
			{
				this.add('weather hail');
			}
		},
		onModifyPokemon: function(move) {
			if (move.id === 'WeatherBall')
			{
				move.type = 'Ice';
				move.basePower = 100;
			}
			if (move.id === 'Moonlight' || move.id === 'MorningSun' || move.id === 'Synthesis')
			{
				move.heal = [1,4];
			}
		},
		onModifyMove: function(move) {
			if (move.id === 'Blizzard')
			{
				move.accuracy = true;
			}
			if (move.id === 'WeatherBall')
			{
				move.type = 'Ice';
				move.basePower = 100;
			}
			if (move.id === 'Moonlight' || move.id === 'MorningSun' || move.id === 'Synthesis')
			{
				move.heal = [1,4];
			}
		},
		onResidualPriority: 50-1,
		onResidual: function() {
			this.add('weather hail');
			this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('weather none');
		}
	}
};