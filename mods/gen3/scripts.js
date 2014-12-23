exports.BattleScripts = {
	inherit: 'gen5',
	gen: 3,
	init: function () {
		for (var i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
		var specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		var newCategory = '';
		for (var i in this.data.Movedex) {
			if (this.data.Movedex[i].category === 'Status') continue;
			newCategory = specialTypes[this.data.Movedex[i].type] ? 'Special' : 'Physical';
			if (newCategory !== this.data.Movedex[i].category) {
				this.modData('Movedex', i).category = newCategory;
			}
		}
	},
	// Battle scripts
	runDecision: function (decision) {
		var pokemon;

		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start':
			var beginCallback = this.getFormat().onBegin;
			if (beginCallback) beginCallback.call(this);

			this.add('start');
			for (var pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (var pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (var pos = 0; pos < this.p1.pokemon.length; pos++) {
				pokemon = this.p1.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (var pos = 0; pos < this.p2.pokemon.length; pos++) {
				pokemon = this.p2.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.runMove(decision.move, decision.pokemon, this.getTarget(decision), decision.sourceEffect);
			break;
		case 'megaEvo':
			if (this.runMegaEvo) this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			var target = this.getTarget(decision);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team':
			var i = parseInt(decision.team[0], 10) - 1;
			if (i >= 6 || i < 0) return;

			if (decision.team[1]) {
				// validate the choice
				var len = decision.side.pokemon.length;
				var newPokemon = [null, null, null, null, null, null].slice(0, len);
				for (var j = 0; j < len; j++) {
					var i = parseInt(decision.team[j], 10) - 1;
					newPokemon[j] = decision.side.pokemon[i];
				}
				var reject = false;
				for (var j = 0; j < len; j++) {
					if (!newPokemon[j]) reject = true;
				}
				if (!reject) {
					for (var j = 0; j < len; j++) {
						newPokemon[j].position = j;
					}
					decision.side.pokemon = newPokemon;
					return;
				}
			}

			if (i === 0) return;
			pokemon = decision.side.pokemon[i];
			if (!pokemon) return;
			decision.side.pokemon[i] = decision.side.pokemon[0];
			decision.side.pokemon[0] = pokemon;
			decision.side.pokemon[i].position = i;
			decision.side.pokemon[0].position = 0;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		case 'pass':
			if (!decision.priority || decision.priority <= 101) return;
			if (decision.pokemon) {
				decision.pokemon.switchFlag = false;
			}
			break;
		case 'switch':
			if (decision.pokemon) {
				decision.pokemon.beingCalledBack = true;
				var lastMove = this.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
				}
				if (!this.runEvent('SwitchOut', decision.pokemon)) {
					// Warning: DO NOT interrupt a switch-out
					// if you just want to trap a pokemon.
					// To trap a pokemon and prevent it from switching out,
					// (e.g. Mean Look, Magnet Pull) use the 'trapped' flag
					// instead.

					// Note: Nothing in BW or earlier interrupts
					// a switch-out.
					break;
				}
				this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			}
			if (decision.pokemon && !decision.pokemon.hp && !decision.pokemon.fainted) {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					decision.priority = -101;
					this.queue.unshift(decision);
					this.debug('Pursuit target fainted');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				this.debug('Switch target is already active');
				break;
			}
			this.switchIn(decision.target, decision.pokemon.position);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			break;
		case 'shift':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.swapPosition(decision.pokemon, 1);
			break;
		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		}

		// phazing (Roar, etc)

		var self = this;
		function checkForceSwitchFlag(a) {
			if (!a) return false;
			if (a.hp && a.forceSwitchFlag) {
				self.dragIn(a.side, a.position);
			}
			delete a.forceSwitchFlag;
		}
		this.p1.active.forEach(checkForceSwitchFlag);
		this.p2.active.forEach(checkForceSwitchFlag);

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.length || (this.gen <= 3 && this.queue[0].choice in {move:1, residual:1})) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (decision.choice === 'pass') {
			this.eachEvent('Update');
			return false;
		}

		function hasSwitchFlag(a) { return a ? a.switchFlag : false; }
		function removeSwitchFlag(a) { if (a) a.switchFlag = false; }
		var p1switch = this.p1.active.any(hasSwitchFlag);
		var p2switch = this.p2.active.any(hasSwitchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			this.p1.active.forEach(removeSwitchFlag);
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			this.p2.active.forEach(removeSwitchFlag);
			p2switch = false;
		}

		var switchRequest = false;
		if (p1switch || p2switch) {
			if (this.gen <= 1) {
				// in gen 1, fainting ends the turn; residuals do not happen
				this.queue = [];
			}
			this.makeRequest('switch');
			switchRequest = true;
		}

		// Residual is what happens last on gen 3.
		if (decision.choice === 'residual') {
			this.add('');
			this.clearActiveMove(true);
			this.residualEvent('Residual');
		}

		if (switchRequest) return true;

		this.eachEvent('Update');

		return false;
	}
};
