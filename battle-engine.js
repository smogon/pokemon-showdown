/**
 * Simulator process
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file is where the battle simulation itself happens.
 *
 * The most important part of the simulation happens in runEvent -
 * see that function's definition for details.
 *
 * @license MIT license
 */

require('sugar');

global.Config = require('./config/config.js');

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', function (err) {
		require('./crashlogger.js')(err, 'A simulator process');
		/* var stack = ("" + err.stack).escapeHTML().split("\n").slice(0, 2).join("<br />");
		if (Rooms.lobby) {
			Rooms.lobby.addRaw('<div><b>THE SERVER HAS CRASHED:</b> ' + stack + '<br />Please restart the server.</div>');
			Rooms.lobby.addRaw('<div>You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		}
		Config.modchat = 'crash';
		Rooms.global.lockdown = true; */
	});
}

/**
 * Converts anything to an ID. An ID must have only lowercase alphanumeric
 * characters.
 * If a string is passed, it will be converted to lowercase and
 * non-alphanumeric characters will be stripped.
 * If an object with an ID is passed, its ID will be returned.
 * Otherwise, an empty string will be returned.
 */
global.toId = function (text) {
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;

	return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};

/**
 * Validates a username or Pokemon nickname
 */
global.toName = function (name) {
	name = string(name);
	name = name.replace(/[\|\s\[\]\,]+/g, ' ').trim();
	if (name.length > 18) name = name.substr(0, 18).trim();
	return name;
};

/**
 * Safely ensures the passed variable is a string
 * Simply doing '' + str can crash if str.toString crashes or isn't a function
 * If we're expecting a string and being given anything that isn't a string
 * or a number, it's safe to assume it's an error, and return ''
 */
global.string = function (str) {
	if (typeof str === 'string' || typeof str === 'number') return '' + str;
	return '';
};

global.Tools = require('./tools.js');

var Battles = {};

// Receive and process a message sent using Simulator.prototype.send in
// another process.
process.on('message', function (message) {
	//console.log('CHILD MESSAGE RECV: "' + message + '"');
	var nlIndex = message.indexOf("\n");
	var more = '';
	if (nlIndex > 0) {
		more = message.substr(nlIndex + 1);
		message = message.substr(0, nlIndex);
	}
	var data = message.split('|');
	if (data[1] === 'init') {
		if (!Battles[data[0]]) {
			try {
				Battles[data[0]] = Battle.construct(data[0], data[2], data[3]);
			} catch (err) {
				var stack = err.stack + '\n\n' +
						'Additional information:\n' +
						'message = ' + message;
				var fakeErr = {stack: stack};

				if (!require('./crashlogger.js')(fakeErr, 'A battle')) {
					var ministack = ("" + err.stack).escapeHTML().split("\n").slice(0, 2).join("<br />");
					process.send(data[0] + '\nupdate\n|html|<div class="broadcast-red"><b>A BATTLE PROCESS HAS CRASHED:</b> ' + ministack + '</div>');
				} else {
					process.send(data[0] + '\nupdate\n|html|<div class="broadcast-red"><b>The battle crashed!</b><br />Don\'t worry, we\'re working on fixing it.</div>');
				}
			}
		}
	} else if (data[1] === 'dealloc') {
		if (Battles[data[0]]) Battles[data[0]].destroy();
		delete Battles[data[0]];
	} else {
		var battle = Battles[data[0]];
		if (battle) {
			var prevRequest = battle.currentRequest;
			try {
				battle.receive(data, more);
			} catch (err) {
				var stack = err.stack + '\n\n' +
						'Additional information:\n' +
						'message = ' + message + '\n' +
						'currentRequest = ' + prevRequest + '\n\n' +
						'Log:\n' + battle.log.join('\n');
				var fakeErr = {stack: stack};
				require('./crashlogger.js')(fakeErr, 'A battle');

				var logPos = battle.log.length;
				battle.add('html', '<div class="broadcast-red"><b>The battle crashed</b><br />You can keep playing but it might crash again.</div>');
				var nestedError;
				try {
					battle.makeRequest(prevRequest);
				} catch (e) {
					nestedError = e;
				}
				battle.sendUpdates(logPos);
				if (nestedError) {
					throw nestedError;
				}
			}
		} else if (data[1] === 'eval') {
			try {
				eval(data[2]);
			} catch (e) {}
		}
	}
});

var BattlePokemon = (function () {
	function BattlePokemon(set, side) {
		this.side = side;
		this.battle = side.battle;
		if (typeof set === 'string') set = {name: set};

		// "pre-bound" functions for nicer syntax (avoids repeated use of `bind`)
		this.getHealth = BattlePokemon.getHealth.bind(this);
		this.getDetails = BattlePokemon.getDetails.bind(this);

		this.set = set;

		this.baseTemplate = this.battle.getTemplate(set.species || set.name);
		if (!this.baseTemplate.exists) {
			this.battle.debug('Unidentified species: ' + this.species);
			this.baseTemplate = this.battle.getTemplate('Unown');
		}
		this.species = this.baseTemplate.species;
		if (set.name === set.species || !set.name || !set.species) {
			set.name = this.species;
		}
		this.name = (set.name || set.species || 'Bulbasaur').substr(0, 20);
		this.speciesid = toId(this.species);
		this.template = this.baseTemplate;
		this.moves = [];
		this.baseMoves = this.moves;
		this.movepp = {};
		this.moveset = [];
		this.baseMoveset = [];

		this.level = this.battle.clampIntRange(set.forcedLevel || set.level || 100, 1, 1000);

		var genders = {M:'M', F:'F'};
		this.gender = this.template.gender || genders[set.gender] || (Math.random() * 2 < 1 ? 'M' : 'F');
		if (this.gender === 'N') this.gender = '';
		this.happiness = typeof set.happiness === 'number' ? this.battle.clampIntRange(set.happiness, 0, 255) : 255;
		this.pokeball = this.set.pokeball || 'pokeball';

		this.fullname = this.side.id + ': ' + this.name;
		this.details = this.species + (this.level === 100 ? '' : ', L' + this.level) + (this.gender === '' ? '' : ', ' + this.gender) + (this.set.shiny ? ', shiny' : '');

		this.id = this.fullname; // shouldn't really be used anywhere

		this.statusData = {};
		this.volatiles = {};
		this.negateImmunity = {};

		this.height = this.template.height;
		this.heightm = this.template.heightm;
		this.weight = this.template.weight;
		this.weightkg = this.template.weightkg;

		this.ignore = {};

		this.baseAbility = toId(set.ability);
		this.ability = this.baseAbility;
		this.item = toId(set.item);
		this.canMegaEvo = (this.battle.getItem(this.item).megaEvolves === this.species);
		this.abilityData = {id: this.ability};
		this.itemData = {id: this.item};
		this.speciesData = {id: this.speciesid};

		this.types = this.baseTemplate.types;
		this.typesData = [];

		for (var i = 0, l = this.types.length; i < l; i++) {
			this.typesData.push({
				type: this.types[i],
				suppressed: false,
				isAdded: false
			});
		}

		if (this.set.moves) {
			for (var i = 0; i < this.set.moves.length; i++) {
				var move = this.battle.getMove(this.set.moves[i]);
				if (!move.id) continue;
				if (move.id === 'hiddenpower') {
					if (!this.set.ivs || Object.values(this.set.ivs).every(31)) {
						this.set.ivs = this.battle.getType(move.type).HPivs;
					}
					move = this.battle.getMove('hiddenpower');
				}
				this.baseMoveset.push({
					move: move.name,
					id: move.id,
					pp: (move.noPPBoosts ? move.pp : move.pp * 8 / 5),
					maxpp: (move.noPPBoosts ? move.pp : move.pp * 8 / 5),
					target: (move.nonGhostTarget && !this.hasType('Ghost') ? move.nonGhostTarget : move.target),
					disabled: false,
					used: false
				});
				this.moves.push(move.id);
			}
		}

		if (!this.set.evs) {
			this.set.evs = {
				hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84
			};
		}
		if (!this.set.ivs) {
			this.set.ivs = {
				hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31
			};
		}
		var stats = { hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
		for (var i in stats) {
			if (!this.set.evs[i]) this.set.evs[i] = 0;
			if (!this.set.ivs[i] && this.set.ivs[i] !== 0) this.set.ivs[i] = 31;
		}
		for (var i in this.set.evs) {
			this.set.evs[i] = this.battle.clampIntRange(this.set.evs[i], 0, 255);
		}
		for (var i in this.set.ivs) {
			this.set.ivs[i] = this.battle.clampIntRange(this.set.ivs[i], 0, 31);
		}

		var hpTypes = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'];
		if (this.battle.gen && this.battle.gen === 2) {
			// Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
			var atkDV = Math.floor(this.set.ivs.atk / 2);
			var defDV = Math.floor(this.set.ivs.def / 2);
			var speDV = Math.floor(this.set.ivs.spe / 2);
			var spcDV = Math.floor(this.set.ivs.spa / 2);
			this.hpType = hpTypes[4 * (atkDV % 4) + (defDV % 4)];
			this.hpPower = Math.floor((5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV > 2 ? 3 : spcDV)) / 2 + 31);
		} else {
			// Hidden Power check for gen 3 onwards
			var hpTypeX = 0, hpPowerX = 0;
			var i = 1;
			for (var s in stats) {
				hpTypeX += i * (this.set.ivs[s] % 2);
				hpPowerX += i * (Math.floor(this.set.ivs[s] / 2) % 2);
				i *= 2;
			}
			this.hpType = hpTypes[Math.floor(hpTypeX * 15 / 63)];
			// In Gen 6, Hidden Power is always 60 base power
			this.hpPower = (this.battle.gen && this.battle.gen < 6) ? Math.floor(hpPowerX * 40 / 63) + 30 : 60;
		}

		this.boosts = {
			atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
			accuracy: 0, evasion: 0
		};
		this.stats = {atk:0, def:0, spa:0, spd:0, spe:0};
		this.baseStats = {atk:10, def:10, spa:10, spd:10, spe:10};
		for (var statName in this.baseStats) {
			var stat = this.template.baseStats[statName];
			stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);
			var nature = this.battle.getNature(this.set.nature);
			if (statName === nature.plus) stat *= 1.1;
			if (statName === nature.minus) stat *= 0.9;
			this.baseStats[statName] = Math.floor(stat);
		}

		this.maxhp = Math.floor(Math.floor(2 * this.template.baseStats['hp'] + this.set.ivs['hp'] + Math.floor(this.set.evs['hp'] / 4) + 100) * this.level / 100 + 10);
		if (this.template.baseStats['hp'] === 1) this.maxhp = 1; // shedinja
		this.hp = this.hp || this.maxhp;

		this.baseIvs = this.set.ivs;
		this.baseHpType = this.hpType;
		this.baseHpPower = this.hpPower;

		this.clearVolatile(true);
	}

	BattlePokemon.prototype.trapped = false;
	BattlePokemon.prototype.maybeTrapped = false;
	BattlePokemon.prototype.hp = 0;
	BattlePokemon.prototype.maxhp = 100;
	BattlePokemon.prototype.illusion = null;
	BattlePokemon.prototype.fainted = false;
	BattlePokemon.prototype.lastItem = '';
	BattlePokemon.prototype.ateBerry = false;
	BattlePokemon.prototype.status = '';
	BattlePokemon.prototype.position = 0;

	BattlePokemon.prototype.lastMove = '';
	BattlePokemon.prototype.moveThisTurn = '';

	BattlePokemon.prototype.lastDamage = 0;
	BattlePokemon.prototype.lastAttackedBy = null;
	BattlePokemon.prototype.usedItemThisTurn = false;
	BattlePokemon.prototype.newlySwitched = false;
	BattlePokemon.prototype.beingCalledBack = false;
	BattlePokemon.prototype.isActive = false;
	BattlePokemon.prototype.isStarted = false; // has this pokemon's Start events run yet?
	BattlePokemon.prototype.transformed = false;
	BattlePokemon.prototype.duringMove = false;
	BattlePokemon.prototype.hpType = 'Dark';
	BattlePokemon.prototype.hpPower = 60;
	BattlePokemon.prototype.speed = 0;

	BattlePokemon.prototype.toString = function () {
		var fullname = this.fullname;
		if (this.illusion) fullname = this.illusion.fullname;

		var positionList = 'abcdef';
		if (this.isActive) return fullname.substr(0, 2) + positionList[this.position] + fullname.substr(2);
		return fullname;
	};
	// "static" function
	BattlePokemon.getDetails = function (side) {
		if (this.illusion) return this.illusion.details + '|' + this.getHealth(side);
		return this.details + '|' + this.getHealth(side);
	};
	BattlePokemon.prototype.update = function (init) {
		// reset for Light Metal etc
		this.weightkg = this.template.weightkg;
		// reset for diabled moves
		this.disabledMoves = {};
		this.negateImmunity = {};
		this.trapped = this.maybeTrapped = false;
		// reset for ignore settings
		this.ignore = {};
		for (var i in this.moveset) {
			if (this.moveset[i]) this.moveset[i].disabled = false;
		}
		if (init) return;

		if (this.runImmunity('trapped')) this.battle.runEvent('MaybeTrapPokemon', this);
		for (var i = 0; i < this.battle.sides.length; ++i) {
			var side = this.battle.sides[i];
			if (side === this.side) continue;
			for (var j = 0; j < side.active.length; ++j) {
				var pokemon = side.active[j];
				if (!pokemon || pokemon.fainted ||
					!pokemon.template.abilities) continue;
				for (var k in pokemon.template.abilities) {
					var ability = pokemon.template.abilities[k];
					if (ability === pokemon.ability) {
						// This event was already run above so we don't need
						// to run it again.
						continue;
					}
					if ((k === 'H') && pokemon.template.unreleasedHidden) {
						// unreleased hidden ability
						continue;
					}
					if (this.runImmunity('trapped')) {
						this.battle.singleEvent('FoeMaybeTrapPokemon',
							this.battle.getAbility(ability), {}, this, pokemon);
					}
				}
			}
		}
		this.battle.runEvent('ModifyPokemon', this);

		this.speed = this.getStat('spe');
	};
	BattlePokemon.prototype.calculateStat = function (statName, boost, modifier) {
		statName = toId(statName);
		// var boost = this.boosts[statName];

		if (statName === 'hp') return this.maxhp; // please just read .maxhp directly

		// base stat
		var stat = this.stats[statName];

		// stat boosts
		// boost = this.boosts[statName];
		var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
		if (boost > 6) boost = 6;
		if (boost < -6) boost = -6;
		if (boost >= 0) {
			stat = Math.floor(stat * boostTable[boost]);
		} else {
			stat = Math.floor(stat / boostTable[-boost]);
		}

		// stat modifier
		stat = this.battle.modify(stat, (modifier || 1));

		if (this.battle.getStatCallback) {
			stat = this.battle.getStatCallback(stat, statName, this);
		}

		return stat;
	};
	BattlePokemon.prototype.getStat = function (statName, unboosted, unmodified) {
		statName = toId(statName);

		if (statName === 'hp') return this.maxhp; // please just read .maxhp directly

		// base stat
		var stat = this.stats[statName];

		// stat boosts
		if (!unboosted) {
			var boost = this.boosts[statName];
			var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
			if (boost > 6) boost = 6;
			if (boost < -6) boost = -6;
			if (boost >= 0) {
				stat = Math.floor(stat * boostTable[boost]);
			} else {
				stat = Math.floor(stat / boostTable[-boost]);
			}
		}

		// stat modifier effects
		if (!unmodified) {
			var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
			var statMod = 1;
			statMod = this.battle.runEvent('Modify' + statTable[statName], this, null, null, statMod);
			stat = this.battle.modify(stat, statMod);
		}
		if (this.battle.getStatCallback) {
			stat = this.battle.getStatCallback(stat, statName, this);
		}
		return stat;
	};
	BattlePokemon.prototype.getMoveData = function (move) {
		move = this.battle.getMove(move);
		for (var i = 0; i < this.moveset.length; i++) {
			var moveData = this.moveset[i];
			if (moveData.id === move.id) {
				return moveData;
			}
		}
		return null;
	};
	BattlePokemon.prototype.deductPP = function (move, amount, source) {
		move = this.battle.getMove(move);
		var ppData = this.getMoveData(move);
		var success = false;
		if (ppData) {
			ppData.used = true;
		}
		if (ppData && ppData.pp) {
			ppData.pp -= this.battle.runEvent('DeductPP', this, source || this, move, amount || 1);
			if (ppData.pp <= 0) {
				ppData.pp = 0;
			}
			success = true;
		}
		return success;
	};
	BattlePokemon.prototype.moveUsed = function (move) {
		this.lastMove = this.battle.getMove(move).id;
		this.moveThisTurn = this.lastMove;
	};
	BattlePokemon.prototype.gotAttacked = function (move, damage, source) {
		if (!damage) damage = 0;
		move = this.battle.getMove(move);
		this.lastAttackedBy = {
			pokemon: source,
			damage: damage,
			move: move.id,
			thisTurn: true
		};
	};
	BattlePokemon.prototype.getLockedMove = function () {
		var lockedMove = this.battle.runEvent('LockMove', this);
		if (lockedMove === true) lockedMove = false;
		return lockedMove;
	};
	BattlePokemon.prototype.getMoves = function (lockedMove) {
		if (lockedMove) {
			lockedMove = toId(lockedMove);
			this.trapped = true;
		}
		if (lockedMove === 'recharge') {
			return [{
				move: 'Recharge',
				id: 'recharge'
			}];
		}
		var moves = [];
		var hasValidMove = false;
		for (var i = 0; i < this.moveset.length; i++) {
			var move = this.moveset[i];
			if (lockedMove) {
				if (lockedMove === move.id) {
					return [{
						move: move.move,
						id: move.id
					}];
				}
				continue;
			}
			if (this.disabledMoves[move.id] || !move.pp && (this.battle.gen !== 1 || !this.volatiles['partialtrappinglock'])) {
				move.disabled = true;
			} else if (!move.disabled) {
				hasValidMove = true;
			}
			var moveName = move.move;
			if (move.id === 'hiddenpower') {
				moveName = 'Hidden Power ' + this.hpType;
				if (this.gen < 6) moveName += ' ' + this.hpPower;
			}
			moves.push({
				move: moveName,
				id: move.id,
				pp: move.pp,
				maxpp: move.maxpp,
				target: move.target,
				disabled: move.disabled
			});
		}
		if (lockedMove) {
			return [{
				move: this.battle.getMove(lockedMove).name,
				id: lockedMove
			}];
		}
		if (!hasValidMove) {
			return [{
				move: 'Struggle',
				id: 'struggle'
			}];
		}
		return moves;
	};
	BattlePokemon.prototype.getRequestData = function () {
		var lockedMove = this.getLockedMove();
		var data = {moves: this.getMoves(lockedMove)};
		if (this.trapped) {
			data.trapped = true;
		} else if (this.maybeTrapped) {
			data.maybeTrapped = true;
		}
		return data;
	};
	BattlePokemon.prototype.positiveBoosts = function () {
		var boosts = 0;
		for (var i in this.boosts) {
			if (this.boosts[i] > 0) boosts += this.boosts[i];
		}
		return boosts;
	};
	BattlePokemon.prototype.boostBy = function (boost, source, effect) {
		var changed = false;
		for (var i in boost) {
			var delta = boost[i];
			this.boosts[i] += delta;
			if (this.boosts[i] > 6) {
				delta -= this.boosts[i] - 6;
				this.boosts[i] = 6;
			}
			if (this.boosts[i] < -6) {
				delta -= this.boosts[i] - (-6);
				this.boosts[i] = -6;
			}
			if (delta) changed = true;
		}
		this.update();
		return changed;
	};
	BattlePokemon.prototype.clearBoosts = function () {
		for (var i in this.boosts) {
			this.boosts[i] = 0;
		}
		this.update();
	};
	BattlePokemon.prototype.setBoost = function (boost) {
		for (var i in boost) {
			this.boosts[i] = boost[i];
		}
		this.update();
	};
	BattlePokemon.prototype.copyVolatileFrom = function (pokemon) {
		this.clearVolatile();
		this.boosts = pokemon.boosts;
		for (var i in pokemon.volatiles) {
			if (this.battle.getEffect(i).noCopy) continue;
			// shallow clones
			this.volatiles[i] = Object.clone(pokemon.volatiles[i]);
			if (this.volatiles[i].linkedPokemon) {
				delete pokemon.volatiles[i].linkedPokemon;
				delete pokemon.volatiles[i].linkedStatus;
				this.volatiles[i].linkedPokemon.volatiles[this.volatiles[i].linkedStatus].linkedPokemon = this;
			}
		}
		pokemon.clearVolatile();
		this.update();
		for (var i in this.volatiles) {
			this.battle.singleEvent('Copy', this.getVolatile(i), this.volatiles[i], this);
		}
	};
	BattlePokemon.prototype.transformInto = function (pokemon, user) {
		var template = pokemon.template;
		if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5)) {
			return false;
		}
		if (!template.abilities || (pokemon && pokemon.transformed && this.battle.gen >= 2) || (user && user.transformed && this.battle.gen >= 5)) {
			return false;
		}
		if (!this.formeChange(template, true)) {
			return false;
		}
		this.transformed = true;
		this.typesData = [];
		for (var i = 0, l = pokemon.typesData.length; i < l; i++) {
			this.typesData.push({
				type: pokemon.typesData[i].type,
				suppressed: false,
				isAdded: pokemon.typesData[i].isAdded
			});
		}
		for (var statName in this.stats) {
			this.stats[statName] = pokemon.stats[statName];
		}
		this.moveset = [];
		this.moves = [];
		this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
		this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
		this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
		for (var i = 0; i < pokemon.moveset.length; i++) {
			var move = this.battle.getMove(this.set.moves[i]);
			var moveData = pokemon.moveset[i];
			var moveName = moveData.move;
			if (moveData.id === 'hiddenpower') {
				moveName = 'Hidden Power ' + this.hpType;
			}
			this.moveset.push({
				move: moveName,
				id: moveData.id,
				pp: move.noPPBoosts ? moveData.maxpp : 5,
				maxpp: this.battle.gen >= 5 ? (move.noPPBoosts ? moveData.maxpp : 5) : (this.battle.gen <= 2 ? move.pp : moveData.maxpp),
				target: moveData.target,
				disabled: false
			});
			this.moves.push(toId(moveName));
		}
		for (var j in pokemon.boosts) {
			this.boosts[j] = pokemon.boosts[j];
		}
		this.battle.add('-transform', this, pokemon);
		this.setAbility(pokemon.ability);
		this.update();
		return true;
	};
	BattlePokemon.prototype.formeChange = function (template, dontRecalculateStats) {
		template = this.battle.getTemplate(template);

		if (!template.abilities) return false;
		this.illusion = null;
		this.template = template;
		this.types = template.types;
		this.typesData = [];
		this.types = template.types;
		for (var i = 0, l = this.types.length; i < l; i++) {
			this.typesData.push({
				type: this.types[i],
				suppressed: false,
				isAdded: false
			});
		}
		if (!dontRecalculateStats) {
			for (var statName in this.stats) {
				var stat = this.template.baseStats[statName];
				stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);

				// nature
				var nature = this.battle.getNature(this.set.nature);
				if (statName === nature.plus) stat *= 1.1;
				if (statName === nature.minus) stat *= 0.9;
				this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
			}
			this.speed = this.stats.spe;
		}
		return true;
	};
	BattlePokemon.prototype.clearVolatile = function (init) {
		this.boosts = {
			atk: 0,
			def: 0,
			spa: 0,
			spd: 0,
			spe: 0,
			accuracy: 0,
			evasion: 0
		};

		this.moveset = [];
		this.moves = [];
		// we're copying array contents
		// DO NOT "optimize" it to copy just the pointer
		// if you don't know what a pointer is, please don't
		// touch this code
		for (var i = 0; i < this.baseMoveset.length; i++) {
			this.moveset.push(this.baseMoveset[i]);
			this.moves.push(toId(this.baseMoveset[i].move));
		}
		this.transformed = false;
		this.ability = this.baseAbility;
		this.set.ivs = this.baseIvs;
		this.hpType = this.baseHpType;
		this.hpPower = this.baseHpPower;
		for (var i in this.volatiles) {
			if (this.volatiles[i].linkedStatus) {
				this.volatiles[i].linkedPokemon.removeVolatile(this.volatiles[i].linkedStatus);
			}
		}
		this.volatiles = {};
		this.switchFlag = false;

		this.lastMove = '';
		this.moveThisTurn = '';

		this.lastDamage = 0;
		this.lastAttackedBy = null;
		this.newlySwitched = true;
		this.beingCalledBack = false;

		this.formeChange(this.baseTemplate);

		this.update(init);
	};
	BattlePokemon.prototype.hasType = function (type) {
		if (!type) return false;
		if (Array.isArray(type)) {
			for (var i = 0; i < type.length; i++) {
				if (this.hasType(type[i])) return true;
			}
		} else {
			if (this.getTypes().indexOf(type) > -1) return true;
		}
		return false;
	};
	// returns the amount of damage actually dealt
	BattlePokemon.prototype.faint = function (source, effect) {
		if (this.fainted || this.status === 'fnt') return 0;
		var d = this.hp;
		this.hp = 0;
		this.switchFlag = false;
		this.status = 'fnt';
		// this.fainted = true;
		this.battle.faintQueue.push({
			target: this,
			source: source,
			effect: effect
		});
		return d;
	};
	BattlePokemon.prototype.damage = function (d, source, effect) {
		if (!this.hp) return 0;
		if (d < 1 && d > 0) d = 1;
		d = Math.floor(d);
		if (isNaN(d)) return 0;
		if (d <= 0) return 0;
		this.hp -= d;
		if (this.hp <= 0) {
			d += this.hp;
			this.faint(source, effect);
		}
		return d;
	};
	BattlePokemon.prototype.tryTrap = function () {
		if (this.runImmunity('trapped')) {
			this.trapped = true;
			return true;
		}
		return false;
	};
	BattlePokemon.prototype.hasMove = function (moveid) {
		moveid = toId(moveid);
		if (moveid.substr(0, 11) === 'hiddenpower') moveid = 'hiddenpower';
		for (var i = 0; i < this.moveset.length; i++) {
			if (moveid === this.battle.getMove(this.moveset[i].move).id) {
				return moveid;
			}
		}
		return false;
	};
	BattlePokemon.prototype.getValidMoves = function (lockedMove) {
		var pMoves = this.getMoves(lockedMove);
		var moves = [];
		for (var i = 0; i < pMoves.length; i++) {
			if (!pMoves[i].disabled) {
				moves.push(pMoves[i].id);
			}
		}
		if (!moves.length) return ['struggle'];
		return moves;
	};
	// returns the amount of damage actually healed
	BattlePokemon.prototype.heal = function (d) {
		if (!this.hp) return false;
		d = Math.floor(d);
		if (isNaN(d)) return false;
		if (d <= 0) return false;
		if (this.hp >= this.maxhp) return false;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	};
	// sets HP, returns delta
	BattlePokemon.prototype.sethp = function (d) {
		if (!this.hp) return 0;
		d = Math.floor(d);
		if (isNaN(d)) return;
		if (d < 1) d = 1;
		d = d - this.hp;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	};
	BattlePokemon.prototype.trySetStatus = function (status, source, sourceEffect) {
		if (!this.hp) return false;
		if (this.status) return false;
		return this.setStatus(status, source, sourceEffect);
	};
	BattlePokemon.prototype.cureStatus = function () {
		if (!this.hp) return false;
		// unlike clearStatus, gives cure message
		if (this.status) {
			this.battle.add('-curestatus', this, this.status);
			this.setStatus('');
		}
	};
	BattlePokemon.prototype.setStatus = function (status, source, sourceEffect, ignoreImmunities) {
		if (!this.hp) return false;
		status = this.battle.getEffect(status);
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}

		if (!ignoreImmunities && status.id) {
			// the game currently never ignores immunities
			if (!this.runImmunity(status.id === 'tox' ? 'psn' : status.id)) {
				this.battle.debug('immune to status');
				return false;
			}
		}

		if (this.status === status.id) return false;
		var prevStatus = this.status;
		var prevStatusData = this.statusData;
		if (status.id && !this.battle.runEvent('SetStatus', this, source, sourceEffect, status)) {
			this.battle.debug('set status [' + status.id + '] interrupted');
			return false;
		}

		this.status = status.id;
		this.statusData = {id: status.id, target: this};
		if (source) this.statusData.source = source;
		if (status.duration) {
			this.statusData.duration = status.duration;
		}
		if (status.durationCallback) {
			this.statusData.duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
		}

		if (status.id && !this.battle.singleEvent('Start', status, this.statusData, this, source, sourceEffect)) {
			this.battle.debug('status start [' + status.id + '] interrupted');
			// cancel the setstatus
			this.status = prevStatus;
			this.statusData = prevStatusData;
			return false;
		}
		this.update();
		if (status.id && !this.battle.runEvent('AfterSetStatus', this, source, sourceEffect, status)) {
			return false;
		}
		return true;
	};
	BattlePokemon.prototype.clearStatus = function () {
		// unlike cureStatus, does not give cure message
		return this.setStatus('');
	};
	BattlePokemon.prototype.getStatus = function () {
		return this.battle.getEffect(this.status);
	};
	BattlePokemon.prototype.eatItem = function (item, source, sourceEffect) {
		if (!this.hp || !this.isActive) return false;
		if (!this.item) return false;

		var id = toId(item);
		if (id && this.item !== id) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		item = this.getItem();
		if (this.battle.runEvent('UseItem', this, null, null, item) && this.battle.runEvent('EatItem', this, null, null, item)) {
			this.battle.add('-enditem', this, item, '[eat]');

			this.battle.singleEvent('Eat', item, this.itemData, this, source, sourceEffect);

			this.lastItem = this.item;
			this.item = '';
			this.itemData = {id: '', target: this};
			this.usedItemThisTurn = true;
			this.ateBerry = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	};
	BattlePokemon.prototype.useItem = function (item, source, sourceEffect) {
		if (!this.isActive) return false;
		if (!this.item) return false;

		var id = toId(item);
		if (id && this.item !== id) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		item = this.getItem();
		if (this.battle.runEvent('UseItem', this, null, null, item)) {
			switch (item.id) {
			case 'redcard':
				this.battle.add('-enditem', this, item, '[of] ' + source);
				break;
			default:
				if (!item.isGem) {
					this.battle.add('-enditem', this, item);
				}
				break;
			}

			this.battle.singleEvent('Use', item, this.itemData, this, source, sourceEffect);

			this.lastItem = this.item;
			this.item = '';
			this.itemData = {id: '', target: this};
			this.usedItemThisTurn = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	};
	BattlePokemon.prototype.takeItem = function (source) {
		if (!this.isActive) return false;
		if (!this.item) return false;
		if (!source) source = this;
		var item = this.getItem();
		if (this.battle.runEvent('TakeItem', this, source, null, item)) {
			this.lastItem = '';
			this.item = '';
			this.itemData = {id: '', target: this};
			return item;
		}
		return false;
	};
	BattlePokemon.prototype.setItem = function (item, source, effect) {
		if (!this.hp || !this.isActive) return false;
		item = this.battle.getItem(item);
		this.lastItem = this.item;
		this.item = item.id;
		this.itemData = {id: item.id, target: this};
		if (item.id) {
			this.battle.singleEvent('Start', item, this.itemData, this, source, effect);
		}
		if (this.lastItem) this.usedItemThisTurn = true;
		return true;
	};
	BattlePokemon.prototype.getItem = function () {
		return this.battle.getItem(this.item);
	};
	BattlePokemon.prototype.hasItem = function (item) {
		if (this.ignore['Item']) return false;
		var ownItem = this.item;
		if (!Array.isArray(item)) {
			return ownItem === toId(item);
		}
		return (item.map(toId).indexOf(ownItem) >= 0);
	};
	BattlePokemon.prototype.clearItem = function () {
		return this.setItem('');
	};
	BattlePokemon.prototype.setAbility = function (ability, source, effect, noForce) {
		if (!this.hp) return false;
		ability = this.battle.getAbility(ability);
		var oldAbility = this.ability;
		if (noForce && oldAbility === ability.id) {
			return false;
		}
		if (ability.id in {illusion:1, multitype:1, stancechange:1}) return false;
		if (oldAbility in {multitype:1, stancechange:1}) return false;
		this.ability = ability.id;
		this.abilityData = {id: ability.id, target: this};
		if (ability.id) {
			this.battle.singleEvent('Start', ability, this.abilityData, this, source, effect);
		}
		return oldAbility;
	};
	BattlePokemon.prototype.getAbility = function () {
		return this.battle.getAbility(this.ability);
	};
	BattlePokemon.prototype.hasAbility = function (ability) {
		if (this.ignore['Ability']) return false;
		var ownAbility = this.ability;
		if (!Array.isArray(ability)) {
			return ownAbility === toId(ability);
		}
		return (ability.map(toId).indexOf(ownAbility) >= 0);
	};
	BattlePokemon.prototype.clearAbility = function () {
		return this.setAbility('');
	};
	BattlePokemon.prototype.getNature = function () {
		return this.battle.getNature(this.set.nature);
	};
	BattlePokemon.prototype.addVolatile = function (status, source, sourceEffect, linkedStatus) {
		var result;
		status = this.battle.getEffect(status);
		if (!this.hp && !status.affectsFainted) return false;
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}

		if (this.volatiles[status.id]) {
			if (!status.onRestart) return false;
			return this.battle.singleEvent('Restart', status, this.volatiles[status.id], this, source, sourceEffect);
		}
		if (!this.runImmunity(status.id)) return false;
		result = this.battle.runEvent('TryAddVolatile', this, source, sourceEffect, status);
		if (!result) {
			this.battle.debug('add volatile [' + status.id + '] interrupted');
			return result;
		}
		this.volatiles[status.id] = {id: status.id};
		this.volatiles[status.id].target = this;
		if (source) {
			this.volatiles[status.id].source = source;
			this.volatiles[status.id].sourcePosition = source.position;
		}
		if (sourceEffect) {
			this.volatiles[status.id].sourceEffect = sourceEffect;
		}
		if (status.duration) {
			this.volatiles[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			this.volatiles[status.id].duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
		}
		result = this.battle.singleEvent('Start', status, this.volatiles[status.id], this, source, sourceEffect);
		if (!result) {
			// cancel
			delete this.volatiles[status.id];
			return result;
		}
		if (linkedStatus && source && !source.volatiles[linkedStatus]) {
			source.addVolatile(linkedStatus, this, sourceEffect, status);
			source.volatiles[linkedStatus].linkedPokemon = this;
			source.volatiles[linkedStatus].linkedStatus = status;
			this.volatiles[status].linkedPokemon = source;
			this.volatiles[status].linkedStatus = linkedStatus;
		}
		this.update();
		return true;
	};
	BattlePokemon.prototype.getVolatile = function (status) {
		status = this.battle.getEffect(status);
		if (!this.volatiles[status.id]) return null;
		return status;
	};
	BattlePokemon.prototype.removeVolatile = function (status) {
		if (!this.hp) return false;
		status = this.battle.getEffect(status);
		if (!this.volatiles[status.id]) return false;
		this.battle.singleEvent('End', status, this.volatiles[status.id], this);
		var linkedPokemon = this.volatiles[status.id].linkedPokemon;
		var linkedStatus = this.volatiles[status.id].linkedStatus;
		delete this.volatiles[status.id];
		if (linkedPokemon && linkedPokemon.volatiles[linkedStatus]) {
			linkedPokemon.removeVolatile(linkedStatus);
		}
		this.update();
		return true;
	};
	// "static" function
	BattlePokemon.getHealth = function (side) {
		if (!this.hp) return '0 fnt';
		var hpstring;
		if ((side === true) || (this.side === side) || this.battle.getFormat().debug) {
			hpstring = '' + this.hp + '/' + this.maxhp;
		} else {
			var ratio = this.hp / this.maxhp;
			if (this.battle.reportPercentages) {
				// HP Percentage Mod mechanics
				var percentage = Math.ceil(ratio * 100);
				if ((percentage === 100) && (ratio < 1.0)) {
					percentage = 99;
				}
				hpstring = '' + percentage + '/100';
			} else {
				// In-game accurate pixel health mechanics
				var pixels = Math.floor(ratio * 48) || 1;
				hpstring = '' + pixels + '/48';
				if ((pixels === 9) && (ratio > 0.2)) {
					hpstring += 'y'; // force yellow HP bar
				} else if ((pixels === 24) && (ratio > 0.5)) {
					hpstring += 'g'; // force green HP bar
				}
			}
		}
		if (this.status) hpstring += ' ' + this.status;
		return hpstring;
	};
	BattlePokemon.prototype.setType = function (newType, enforce) {
		// Arceus first type cannot be normally changed
		if (!enforce && this.template.num === 493) return false;

		this.typesData = [{
			type: newType,
			suppressed: false,
			isAdded: false
		}];

		return true;
	};
	BattlePokemon.prototype.addType = function (newType) {
		// removes any types added previously and adds another one

		this.typesData = this.typesData.filter(function (typeData) {
			return !typeData.isAdded;
		}).concat([{
			type: newType,
			suppressed: false,
			isAdded: true
		}]);

		return true;
	};
	BattlePokemon.prototype.getTypes = function (getAll) {
		var types = [];
		for (var i = 0, l = this.typesData.length; i < l; i++) {
			if (getAll || !this.typesData[i].suppressed) {
				types.push(this.typesData[i].type);
			}
		}
		if (types.length) return types;
		if (this.battle.gen >= 5) return ['Normal'];
		return ['???'];
	};
	BattlePokemon.prototype.runImmunity = function (type, message) {
		if (this.fainted) {
			return false;
		}
		if (!type || type === '???') {
			return true;
		}
		if (this.negateImmunity[type]) return true;
		if (!(this.negateImmunity['Type'] && type in this.battle.data.TypeChart)) {
			// Ring Target not active
			if (!this.battle.getImmunity(type, this)) {
				this.battle.debug('natural immunity');
				if (message) {
					this.battle.add('-immune', this, '[msg]');
				}
				return false;
			}
		}
		var immunity = this.battle.runEvent('Immunity', this, null, null, type);
		if (!immunity) {
			this.battle.debug('artificial immunity');
			if (message && immunity !== null) {
				this.battle.add('-immune', this, '[msg]');
			}
			return false;
		}
		return true;
	};
	BattlePokemon.prototype.destroy = function () {
		// deallocate ourself
		// get rid of some possibly-circular references
		this.battle = null;
		this.side = null;
	};
	return BattlePokemon;
})();

var BattleSide = (function () {
	function BattleSide(name, battle, n, team) {
		this.battle = battle;
		this.n = n;
		this.name = name;
		this.pokemon = [];
		this.active = [null];
		this.sideConditions = {};

		this.id = n ? 'p2' : 'p1';

		switch (this.battle.gameType) {
		case 'doubles':
			this.active = [null, null];
			break;
		case 'triples': case 'rotation':
			this.active = [null, null, null];
			break;
		}

		this.team = this.battle.getTeam(this, team);
		for (var i = 0; i < this.team.length && i < 6; i++) {
			//console.log("NEW POKEMON: " + (this.team[i] ? this.team[i].name : '[unidentified]'));
			this.pokemon.push(new BattlePokemon(this.team[i], this));
		}
		this.pokemonLeft = this.pokemon.length;
		for (var i = 0; i < this.pokemon.length; i++) {
			this.pokemon[i].position = i;
		}
	}

	BattleSide.prototype.isActive = false;
	BattleSide.prototype.pokemonLeft = 0;
	BattleSide.prototype.faintedLastTurn = false;
	BattleSide.prototype.faintedThisTurn = false;
	BattleSide.prototype.decision = null;
	BattleSide.prototype.foe = null;

	BattleSide.prototype.toString = function () {
		return this.id + ': ' + this.name;
	};
	BattleSide.prototype.getData = function () {
		var data = {
			name: this.name,
			id: this.id,
			pokemon: []
		};
		for (var i = 0; i < this.pokemon.length; i++) {
			var pokemon = this.pokemon[i];
			data.pokemon.push({
				ident: pokemon.fullname,
				details: pokemon.details,
				condition: pokemon.getHealth(pokemon.side),
				active: (pokemon.position < pokemon.side.active.length),
				stats: {
					atk: pokemon.baseStats['atk'],
					def: pokemon.baseStats['def'],
					spa: pokemon.baseStats['spa'],
					spd: pokemon.baseStats['spd'],
					spe: pokemon.baseStats['spe']
				},
				moves: pokemon.moves.map(function (move) {
					if (move === 'hiddenpower') {
						return move + toId(pokemon.hpType) + (pokemon.hpPower === 70 ? '' : pokemon.hpPower);
					}
					return move;
				}),
				baseAbility: pokemon.baseAbility,
				item: pokemon.item,
				pokeball: pokemon.pokeball,
				canMegaEvo: pokemon.canMegaEvo
			});
		}
		return data;
	};
	BattleSide.prototype.randomActive = function () {
		var actives = this.active.filter(function (active) {
			return active && !active.fainted;
		});
		if (!actives.length) return null;
		var i = Math.floor(Math.random() * actives.length);
		return actives[i];
	};
	BattleSide.prototype.addSideCondition = function (status, source, sourceEffect) {
		status = this.battle.getEffect(status);
		if (this.sideConditions[status.id]) {
			if (!status.onRestart) return false;
			return this.battle.singleEvent('Restart', status, this.sideConditions[status.id], this, source, sourceEffect);
		}
		this.sideConditions[status.id] = {id: status.id};
		this.sideConditions[status.id].target = this;
		if (source) {
			this.sideConditions[status.id].source = source;
			this.sideConditions[status.id].sourcePosition = source.position;
		}
		if (status.duration) {
			this.sideConditions[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			this.sideConditions[status.id].duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
		}
		if (!this.battle.singleEvent('Start', status, this.sideConditions[status.id], this, source, sourceEffect)) {
			delete this.sideConditions[status.id];
			return false;
		}
		this.battle.update();
		return true;
	};
	BattleSide.prototype.getSideCondition = function (status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return null;
		return status;
	};
	BattleSide.prototype.removeSideCondition = function (status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return false;
		this.battle.singleEvent('End', status, this.sideConditions[status.id], this);
		delete this.sideConditions[status.id];
		this.battle.update();
		return true;
	};
	BattleSide.prototype.emitCallback = function () {
		this.battle.send('callback', this.id + "\n" +
			Array.prototype.slice.call(arguments).join('|'));
	};
	BattleSide.prototype.emitRequest = function (update) {
		this.battle.send('request', this.id + "\n" + this.battle.rqid + "\n" + JSON.stringify(update));
	};
	BattleSide.prototype.destroy = function () {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (var i = 0; i < this.pokemon.length; i++) {
			if (this.pokemon[i]) this.pokemon[i].destroy();
			this.pokemon[i] = null;
		}
		this.pokemon = null;
		for (var i = 0; i < this.active.length; i++) {
			this.active[i] = null;
		}
		this.active = null;

		if (this.decision) {
			delete this.decision.side;
			delete this.decision.pokemon;
		}
		this.decision = null;

		// get rid of some possibly-circular references
		this.battle = null;
		this.foe = null;
	};
	return BattleSide;
})();

var Battle = (function () {
	var Battle = {};

	Battle.construct = (function () {
		var battleProtoCache = {};
		return function (roomid, formatarg, rated) {
			var battle = Object.create((function () {
				if (battleProtoCache[formatarg] !== undefined) {
					return battleProtoCache[formatarg];
				}

				// Scripts overrides Battle overrides Scripts overrides Tools
				var tools = Tools.mod(formatarg);
				var proto = Object.create(tools);
				for (var i in Battle.prototype) {
					proto[i] = Battle.prototype[i];
				}
				var battle = Object.create(proto);
				var ret = Object.create(battle);
				tools.install(ret);
				return battleProtoCache[formatarg] = ret;
			})());
			Battle.prototype.init.call(battle, roomid, formatarg, rated);
			return battle;
		};
	})();

	Battle.prototype = {};

	Battle.prototype.init = function (roomid, formatarg, rated) {
		var format = Tools.getFormat(formatarg);

		this.log = [];
		this.sides = [null, null];
		this.roomid = roomid;
		this.id = roomid;
		this.rated = rated;
		this.weatherData = {id:''};
		this.terrainData = {id:''};
		this.pseudoWeather = {};

		this.format = toId(format);
		this.formatData = {id:this.format};

		this.effect = {id:''};
		this.effectData = {id:''};
		this.event = {id:''};

		this.gameType = (format.gameType || 'singles');

		this.queue = [];
		this.faintQueue = [];
		this.messageLog = [];

		// use a random initial seed (64-bit, [high -> low])
		this.startingSeed = this.seed = [Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000)];
	};

	Battle.prototype.turn = 0;
	Battle.prototype.p1 = null;
	Battle.prototype.p2 = null;
	Battle.prototype.lastUpdate = 0;
	Battle.prototype.currentRequest = '';
	Battle.prototype.weather = '';
	Battle.prototype.terrain = '';
	Battle.prototype.ended = false;
	Battle.prototype.started = false;
	Battle.prototype.active = false;
	Battle.prototype.eventDepth = 0;
	Battle.prototype.lastMove = '';
	Battle.prototype.activeMove = null;
	Battle.prototype.activePokemon = null;
	Battle.prototype.activeTarget = null;
	Battle.prototype.midTurn = false;
	Battle.prototype.currentRequest = '';
	Battle.prototype.rqid = 0;
	Battle.prototype.lastMoveLine = 0;
	Battle.prototype.reportPercentages = false;

	Battle.prototype.toString = function () {
		return 'Battle: ' + this.format;
	};


	// This function is designed to emulate the on-cartridge PRNG for Gens 3 and 4, as described in
	// http://www.smogon.com/ingame/rng/pid_iv_creation#pokemon_random_number_generator
	// This RNG uses a 32-bit initial seed

	// This function has three different results, depending on arguments:
	// - random() returns a real number in [0, 1), just like Math.random()
	// - random(n) returns an integer in [0, n)
	// - random(m, n) returns an integer in [m, n)

	// m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.
	/*
	Battle.prototype.random = function (m, n) {
		this.seed = (this.seed * 0x41C64E6D + 0x6073) >>> 0; // truncate the result to the last 32 bits
		var result = this.seed >>> 16; // the first 16 bits of the seed are the random value
		m = Math.floor(m);
		n = Math.floor(n);
		return (m ? (n ? (result % (n - m)) + m : result % m) : result / 0x10000);
	};
	*/

	// This function is designed to emulate the on-cartridge PRNG for Gen 5 and uses a 64-bit initial seed

	// This function has three different results, depending on arguments:
	// - random() returns a real number in [0, 1), just like Math.random()
	// - random(n) returns an integer in [0, n)
	// - random(m, n) returns an integer in [m, n)

	// m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.

	Battle.prototype.random = function (m, n) {
		this.seed = this.nextFrame(); // Advance the RNG
		var result = (this.seed[0] << 16 >>> 0) + this.seed[1]; // Use the upper 32 bits
		m = Math.floor(m);
		n = Math.floor(n);
		result = (m ? (n ? Math.floor(result * (n - m) / 0x100000000) + m : Math.floor(result * m / 0x100000000)) : result / 0x100000000);
		this.debug('randBW(' + (m ? (n ? m + ', ' + n : m) : '') + ') = ' + result);
		return result;
	};

	Battle.prototype.nextFrame = function (n) {
		var seed = this.seed;
		n = n || 1;
		for (var frame = 0; frame < n; ++frame) {
			// The RNG is a Linear Congruential Generator (LCG) in the form: x_{n + 1} = (a x_n + c) % m
			// Where: x_0 is the seed, x_n is the random number after n iterations,
			//     a = 0x5D588B656C078965, c = 0x00269EC3 and m = 2^64
			// Javascript doesnt handle such large numbers properly, so this function does it in 16-bit parts.
			// x_{n + 1} = (x_n * a) + c
			// Let any 64 bit number n = (n[0] << 48) + (n[1] << 32) + (n[2] << 16) + n[3]
			// Then x_{n + 1} =
			//     ((a[3] x_n[0] + a[2] x_n[1] + a[1] x_n[2] + a[0] x_n[3] + c[0]) << 48) +
			//     ((a[3] x_n[1] + a[2] x_n[2] + a[1] x_n[3] + c[1]) << 32) +
			//     ((a[3] x_n[2] + a[2] x_n[3] + c[2]) << 16) +
			//     a[3] x_n[3] + c[3]
			// Which can be generalised where b is the number of 16 bit words in the number:
			//     (Notice how the a[] word starts at b-1, and decrements every time it appears again on the line;
			//         x_n[] starts at b-<line#>-1 and increments to b-1 at the end of the line per line, limiting the length of the line;
			//         c[] is at b-<line#>-1 for each line and the left shift is 16 * <line#>)
			//     ((a[b-1] + x_n[b-1] + c[b-1]) << (16 * 0)) +
			//     ((a[b-1] x_n[b-2] + a[b-2] x_n[b-1] + c[b-2]) << (16 * 1)) +
			//     ((a[b-1] x_n[b-3] + a[b-2] x_n[b-2] + a[b-3] x_n[b-1] + c[b-3]) << (16 * 2)) +
			//     ...
			//     ((a[b-1] x_n[1] + a[b-2] x_n[2] + ... + a[2] x_n[b-2] + a[1] + x_n[b-1] + c[1]) << (16 * (b-2))) +
			//     ((a[b-1] x_n[0] + a[b-2] x_n[1] + ... + a[1] x_n[b-2] + a[0] + x_n[b-1] + c[0]) << (16 * (b-1)))
			// Which produces this equation: \sum_{l=0}^{b-1}\left(\sum_{m=b-l-1}^{b-1}\left\{a[2b-m-l-2] x_n[m]\right\}+c[b-l-1]\ll16l\right)
			// This is all ignoring overflow/carry because that cannot be shown in a pseudo-mathematical equation.
			// The below code implements a optimised version of that equation while also checking for overflow/carry.

			var a = [0x5D58, 0x8B65, 0x6C07, 0x8965];
			var c = [0, 0, 0x26, 0x9EC3];

			var nextSeed = [0, 0, 0, 0];
			var carry = 0;

			for (var cN = seed.length - 1; cN >= 0; --cN) {
				nextSeed[cN] = carry;
				carry = 0;

				var aN = seed.length - 1;
				var seedN = cN;
				for (; seedN < seed.length; --aN, ++seedN) {
					var nextWord = a[aN] * seed[seedN];
					carry += nextWord >>> 16;
					nextSeed[cN] += nextWord & 0xFFFF;
				}
				nextSeed[cN] += c[cN];
				carry += nextSeed[cN] >>> 16;
				nextSeed[cN] &= 0xFFFF;
			}

			seed = nextSeed;
		}
		return seed;
	};

	Battle.prototype.setWeather = function (status, source, sourceEffect) {
		status = this.getEffect(status);
		if (sourceEffect === undefined && this.effect) sourceEffect = this.effect;
		if (source === undefined && this.event && this.event.target) source = this.event.target;

		if (this.weather === status.id) return false;
		if (this.weather && !status.id) {
			var oldstatus = this.getWeather();
			this.singleEvent('End', oldstatus, this.weatherData, this);
		}
		var prevWeather = this.weather;
		var prevWeatherData = this.weatherData;
		this.weather = status.id;
		this.weatherData = {id: status.id};
		if (source) {
			this.weatherData.source = source;
			this.weatherData.sourcePosition = source.position;
		}
		if (status.duration) {
			this.weatherData.duration = status.duration;
		}
		if (status.durationCallback) {
			this.weatherData.duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.weatherData, this, source, sourceEffect)) {
			this.weather = prevWeather;
			this.weatherData = prevWeatherData;
			return false;
		}
		this.update();
		return true;
	};
	Battle.prototype.clearWeather = function () {
		return this.setWeather('');
	};
	Battle.prototype.effectiveWeather = function (target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (!this.runEvent('TryWeather', target)) return '';
		return this.weather;
	};
	Battle.prototype.isWeather = function (weather, target) {
		var ourWeather = this.effectiveWeather(target);
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return (weather.map(toId).indexOf(ourWeather) >= 0);
	};
	Battle.prototype.getWeather = function () {
		return this.getEffect(this.weather);
	};

	Battle.prototype.setTerrain = function (status, source, sourceEffect) {
		status = this.getEffect(status);
		if (sourceEffect === undefined && this.effect) sourceEffect = this.effect;
		if (source === undefined && this.event && this.event.target) source = this.event.target;

		if (this.terrain === status.id) return false;
		if (this.terrain && !status.id) {
			var oldstatus = this.getTerrain();
			this.singleEvent('End', oldstatus, this.terrainData, this);
		}
		var prevTerrain = this.terrain;
		var prevTerrainData = this.terrainData;
		this.terrain = status.id;
		this.terrainData = {id: status.id};
		if (source) {
			this.terrainData.source = source;
			this.terrainData.sourcePosition = source.position;
		}
		if (status.duration) {
			this.terrainData.duration = status.duration;
		}
		if (status.durationCallback) {
			this.terrainData.duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.terrainData, this, source, sourceEffect)) {
			this.terrain = prevTerrain;
			this.terrainData = prevTerrainData;
			return false;
		}
		this.update();
		return true;
	};
	Battle.prototype.clearTerrain = function () {
		return this.setTerrain('');
	};
	Battle.prototype.effectiveTerrain = function (target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (!this.runEvent('TryTerrain', target)) return '';
		return this.terrain;
	};
	Battle.prototype.isTerrain = function (terrain, target) {
		var ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toId(terrain);
		}
		return (terrain.map(toId).indexOf(ourTerrain) >= 0);
	};
	Battle.prototype.getTerrain = function () {
		return this.getEffect(this.terrain);
	};

	Battle.prototype.getFormat = function () {
		return this.getEffect(this.format);
	};
	Battle.prototype.addPseudoWeather = function (status, source, sourceEffect) {
		status = this.getEffect(status);
		if (this.pseudoWeather[status.id]) {
			if (!status.onRestart) return false;
			return this.singleEvent('Restart', status, this.pseudoWeather[status.id], this, source, sourceEffect);
		}
		this.pseudoWeather[status.id] = {id: status.id};
		if (source) {
			this.pseudoWeather[status.id].source = source;
			this.pseudoWeather[status.id].sourcePosition = source.position;
		}
		if (status.duration) {
			this.pseudoWeather[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			this.pseudoWeather[status.id].duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.pseudoWeather[status.id], this, source, sourceEffect)) {
			delete this.pseudoWeather[status.id];
			return false;
		}
		this.update();
		return true;
	};
	Battle.prototype.getPseudoWeather = function (status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return null;
		return status;
	};
	Battle.prototype.removePseudoWeather = function (status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return false;
		this.singleEvent('End', status, this.pseudoWeather[status.id], this);
		delete this.pseudoWeather[status.id];
		this.update();
		return true;
	};
	Battle.prototype.setActiveMove = function (move, pokemon, target) {
		if (!move) move = null;
		if (!pokemon) pokemon = null;
		if (!target) target = pokemon;
		this.activeMove = move;
		this.activePokemon = pokemon;
		this.activeTarget = target;

		// Mold Breaker and the like
		this.update();
	};
	Battle.prototype.clearActiveMove = function (failed) {
		if (this.activeMove) {
			if (!failed) {
				this.lastMove = this.activeMove.id;
			}
			this.activeMove = null;
			this.activePokemon = null;
			this.activeTarget = null;

			// Mold Breaker and the like, again
			this.update();
		}
	};

	Battle.prototype.update = function () {
		var actives = this.p1.active;
		for (var i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].update();
		}
		actives = this.p2.active;
		for (var i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].update();
		}
	};

	// bubbles up
	Battle.comparePriority = function (a, b) { // intentionally not in Battle.prototype
		a.priority = a.priority || 0;
		a.subPriority = a.subPriority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subPriority = b.subPriority || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -1;
			}
			if (typeof b.order !== 'number') {
				return 1;
			}
			if (b.order - a.order) {
				return -(b.order - a.order);
			}
		}
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		return Math.random() - 0.5;
	};
	Battle.prototype.getResidualStatuses = function (thing, callbackType) {
		var statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		//if (statuses[0]) this.debug('match ' + (callbackType || 'residualCallback') + ': ' + statuses[0].status.id);
		return statuses;
	};
	Battle.prototype.eachEvent = function (eventid, effect, relayVar) {
		var actives = [];
		if (!effect && this.effect) effect = this.effect;
		for (var i = 0; i < this.sides.length;i++) {
			var side = this.sides[i];
			for (var j = 0; j < side.active.length; j++) {
				if (side.active[j]) actives.push(side.active[j]);
			}
		}
		actives.sort(function (a, b) {
			if (b.speed - a.speed) {
				return b.speed - a.speed;
			}
			return Math.random() - 0.5;
		});
		for (var i = 0; i < actives.length; i++) {
			if (actives[i].isStarted) {
				this.runEvent(eventid, actives[i], null, effect, relayVar);
			}
		}
	};
	Battle.prototype.residualEvent = function (eventid, relayVar) {
		var statuses = this.getRelevantEffectsInner(this, 'on' + eventid, null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		while (statuses.length) {
			var statusObj = statuses.shift();
			var status = statusObj.status;
			if (statusObj.thing.fainted) continue;
			if (statusObj.statusData && statusObj.statusData.duration) {
				statusObj.statusData.duration--;
				if (!statusObj.statusData.duration) {
					statusObj.end.call(statusObj.thing, status.id);
					continue;
				}
			}
			this.singleEvent(eventid, status, statusObj.statusData, statusObj.thing, relayVar);
		}
	};
	// The entire event system revolves around this function
	// (and its helper functions, getRelevant * )
	Battle.prototype.singleEvent = function (eventid, effect, effectData, target, source, sourceEffect, relayVar) {
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
			return false;
		}
		//this.add('Event: ' + eventid + ' (depth ' + this.eventDepth + ')');
		effect = this.getEffect(effect);
		var hasRelayVar = true;
		if (relayVar === undefined) {
			relayVar = true;
			hasRelayVar = false;
		}

		if (effect.effectType === 'Status' && target.status !== effect.id) {
			// it's changed; call it off
			return relayVar;
		}
		if (target.ignore && target.ignore[effect.effectType]) {
			this.debug(eventid + ' handler suppressed by Gastro Acid, Klutz or Magic Room');
			return relayVar;
		}
		if (target.ignore && target.ignore[effect.effectType + 'Target']) {
			this.debug(eventid + ' handler suppressed by Air Lock');
			return relayVar;
		}

		if (effect['on' + eventid] === undefined) return relayVar;
		var parentEffect = this.effect;
		var parentEffectData = this.effectData;
		var parentEvent = this.event;
		this.effect = effect;
		this.effectData = effectData;
		this.event = {id: eventid, target: target, source: source, effect: sourceEffect};
		this.eventDepth++;
		var args = [target, source, sourceEffect];
		if (hasRelayVar) args.unshift(relayVar);
		var returnVal;
		if (typeof effect['on' + eventid] === 'function') {
			returnVal = effect['on' + eventid].apply(this, args);
		} else {
			returnVal = effect['on' + eventid];
		}
		this.eventDepth--;
		this.effect = parentEffect;
		this.effectData = parentEffectData;
		this.event = parentEvent;
		if (returnVal === undefined) return relayVar;
		return returnVal;
	};
	/**
	 * runEvent is the core of Pokemon Showdown's event system.
	 *
	 * Basic usage
	 * ===========
	 *
	 *   this.runEvent('Blah')
	 * will trigger any onBlah global event handlers.
	 *
	 *   this.runEvent('Blah', target)
	 * will additionally trigger any onBlah handlers on the target, onAllyBlah
	 * handlers on any active pokemon on the target's team, and onFoeBlah
	 * handlers on any active pokemon on the target's foe's team
	 *
	 *   this.runEvent('Blah', target, source)
	 * will additionally trigger any onSourceBlah handlers on the source
	 *
	 *   this.runEvent('Blah', target, source, effect)
	 * will additionally pass the effect onto all event handlers triggered
	 *
	 *   this.runEvent('Blah', target, source, effect, relayVar)
	 * will additionally pass the relayVar as the first argument along all event
	 * handlers
	 *
	 * You may leave any of these null. For instance, if you have a relayVar but
	 * no source or effect:
	 *   this.runEvent('Damage', target, null, null, 50)
	 *
	 * Event handlers
	 * ==============
	 *
	 * Items, abilities, statuses, and other effects like SR, confusion, weather,
	 * or Trick Room can have event handlers. Event handlers are functions that
	 * can modify what happens during an event.
	 *
	 * event handlers are passed:
	 *   function (target, source, effect)
	 * although some of these can be blank.
	 *
	 * certain events have a relay variable, in which case they're passed:
	 *   function (relayVar, target, source, effect)
	 *
	 * Relay variables are variables that give additional information about the
	 * event. For instance, the damage event has a relayVar which is the amount
	 * of damage dealt.
	 *
	 * If a relay variable isn't passed to runEvent, there will still be a secret
	 * relayVar defaulting to `true`, but it won't get passed to any event
	 * handlers.
	 *
	 * After an event handler is run, its return value helps determine what
	 * happens next:
	 * 1. If the return value isn't `undefined`, relayVar is set to the return
	 *	value
	 * 2. If relayVar is falsy, no more event handlers are run
	 * 3. Otherwise, if there are more event handlers, the next one is run and
	 *	we go back to step 1.
	 * 4. Once all event handlers are run (or one of them results in a falsy
	 *	relayVar), relayVar is returned by runEvent
	 *
	 * As a shortcut, an event handler that isn't a function will be interpreted
	 * as a function that returns that value.
	 *
	 * You can have return values mean whatever you like, but in general, we
	 * follow the convention that returning `false` or `null` means
	 * stopping or interrupting the event.
	 *
	 * For instance, returning `false` from a TrySetStatus handler means that
	 * the pokemon doesn't get statused.
	 *
	 * If a failed event usually results in a message like "But it failed!"
	 * or "It had no effect!", returning `null` will suppress that message and
	 * returning `false` will display it. Returning `null` is useful if your
	 * event handler already gave its own custom failure message.
	 *
	 * Returning `undefined` means "don't change anything" or "keep going".
	 * A function that does nothing but return `undefined` is the equivalent
	 * of not having an event handler at all.
	 *
	 * Returning a value means that that value is the new `relayVar`. For
	 * instance, if a Damage event handler returns 50, the damage event
	 * will deal 50 damage instead of whatever it was going to deal before.
	 *
	 * Useful values
	 * =============
	 *
	 * In addition to all the methods and attributes of Tools, Battle, and
	 * Scripts, event handlers have some additional values they can access:
	 *
	 * this.effect:
	 *   the Effect having the event handler
	 * this.effectData:
	 *   the data store associated with the above Effect. This is a plain Object
	 *   and you can use it to store data for later event handlers.
	 * this.effectData.target:
	 *   the Pokemon, Side, or Battle that the event handler's effect was
	 *   attached to.
	 * this.event.id:
	 *   the event ID
	 * this.event.target, this.event.source, this.event.effect:
	 *   the target, source, and effect of the event. These are the same
	 *   variables that are passed as arguments to the event handler, but
	 *   they're useful for functions called by the event handler.
	 */
	Battle.prototype.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
			return false;
		}
		if (!target) target = this;
		var statuses = this.getRelevantEffects(target, 'on' + eventid, 'onSource' + eventid, source);
		var hasRelayVar = true;
		effect = this.getEffect(effect);
		var args = [target, source, effect];
		//console.log('Event: ' + eventid + ' (depth ' + this.eventDepth + ') t:' + target.id + ' s:' + (!source || source.id) + ' e:' + effect.id);
		if (relayVar === undefined || relayVar === null) {
			relayVar = true;
			hasRelayVar = false;
		} else {
			args.unshift(relayVar);
		}

		var parentEvent = this.event;
		this.event = {id: eventid, target: target, source: source, effect: effect, modifier: 1};
		this.eventDepth++;

		if (onEffect && 'on' + eventid in effect) {
			statuses.unshift({status: effect, callback: effect['on' + eventid], statusData: {}, end: null, thing: target});
		}
		for (var i = 0; i < statuses.length; i++) {
			var status = statuses[i].status;
			var thing = statuses[i].thing;
			//this.debug('match ' + eventid + ': ' + status.id + ' ' + status.effectType);
			if (status.effectType === 'Status' && thing.status !== status.id) {
				// it's changed; call it off
				continue;
			}
			if (thing.ignore && thing.ignore[status.effectType] === 'A') {
				// ignore attacking events
				var AttackingEvents = {
					BeforeMove: 1,
					BasePower: 1,
					Immunity: 1,
					Accuracy: 1,
					Damage: 1,
					SubDamage: 1,
					Heal: 1,
					TakeItem: 1,
					UseItem: 1,
					EatItem: 1,
					SetStatus: 1,
					CriticalHit: 1,
					ModifyPokemon: 1,
					ModifyAtk: 1, ModifyDef: 1, ModifySpA: 1, ModifySpD: 1, ModifySpe: 1,
					ModifyBoost: 1,
					ModifyDamage: 1,
					TryHit: 1,
					TryHitSide: 1,
					TrySecondaryHit: 1,
					Hit: 1,
					Boost: 1,
					DragOut: 1
				};
				if (eventid in AttackingEvents) {
					if (eventid !== 'ModifyPokemon') {
						this.debug(eventid + ' handler suppressed by Mold Breaker');
					}
					continue;
				}
			} else if (thing.ignore && thing.ignore[status.effectType]) {
				if (eventid !== 'ModifyPokemon' && eventid !== 'Update') {
					this.debug(eventid + ' handler suppressed by Gastro Acid, Klutz or Magic Room');
				}
				continue;
			}
			if (target.ignore && (target.ignore[status.effectType + 'Target'] || target.ignore[eventid + 'Target'])) {
				this.debug(eventid + ' handler suppressed by Air Lock');
				continue;
			}
			var returnVal;
			if (typeof statuses[i].callback === 'function') {
				var parentEffect = this.effect;
				var parentEffectData = this.effectData;
				this.effect = statuses[i].status;
				this.effectData = statuses[i].statusData;
				this.effectData.target = thing;

				returnVal = statuses[i].callback.apply(this, args);

				this.effect = parentEffect;
				this.effectData = parentEffectData;
			} else {
				returnVal = statuses[i].callback;
			}

			if (returnVal !== undefined) {
				relayVar = returnVal;
				if (!relayVar) break;
				if (hasRelayVar) {
					args[0] = relayVar;
				}
			}
		}

		this.eventDepth--;
		if (this.event.modifier !== 1 && typeof relayVar === 'number') {
			// this.debug(eventid + ' modifier: 0x' + ('0000' + (this.event.modifier * 4096).toString(16)).slice(-4).toUpperCase());
			relayVar = this.modify(relayVar, this.event.modifier);
		}
		this.event = parentEvent;

		return relayVar;
	};
	Battle.prototype.resolveLastPriority = function (statuses, callbackType) {
		var order = false;
		var priority = 0;
		var subOrder = 0;
		var status = statuses[statuses.length - 1];
		if (status.status[callbackType + 'Order']) {
			order = status.status[callbackType + 'Order'];
		}
		if (status.status[callbackType + 'Priority']) {
			priority = status.status[callbackType + 'Priority'];
		} else if (status.status[callbackType + 'SubOrder']) {
			subOrder = status.status[callbackType + 'SubOrder'];
		}

		status.order = order;
		status.priority = priority;
		status.subOrder = subOrder;
		if (status.thing && status.thing.getStat) status.speed = status.thing.speed;
	};
	// bubbles up to parents
	Battle.prototype.getRelevantEffects = function (thing, callbackType, foeCallbackType, foeThing, checkChildren) {
		var statuses = this.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		statuses.sort(Battle.comparePriority);
		//if (statuses[0]) this.debug('match ' + callbackType + ': ' + statuses[0].status.id);
		return statuses;
	};
	Battle.prototype.getRelevantEffectsInner = function (thing, callbackType, foeCallbackType, foeThing, bubbleUp, bubbleDown, getAll) {
		if (!callbackType || !thing) return [];
		var statuses = [];
		var status;

		if (thing.sides) {
			for (var i in this.pseudoWeather) {
				status = this.getPseudoWeather(i);
				if (status[callbackType] !== undefined || (getAll && thing.pseudoWeather[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: this.pseudoWeather[i], end: this.removePseudoWeather, thing: thing});
					this.resolveLastPriority(statuses, callbackType);
				}
			}
			status = this.getWeather();
			if (status[callbackType] !== undefined || (getAll && thing.weatherData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.weatherData, end: this.clearWeather, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			status = this.getTerrain();
			if (status[callbackType] !== undefined || (getAll && thing.terrainData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.terrainData, end: this.clearTerrain, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			status = this.getFormat();
			if (status[callbackType] !== undefined || (getAll && thing.formatData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.formatData, end: function (){}, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			if (bubbleDown) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p1, callbackType, null, null, false, true, getAll));
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p2, callbackType, null, null, false, true, getAll));
			}
			return statuses;
		}

		if (thing.pokemon) {
			for (var i in thing.sideConditions) {
				status = thing.getSideCondition(i);
				if (status[callbackType] !== undefined || (getAll && thing.sideConditions[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: thing.sideConditions[i], end: thing.removeSideCondition, thing: thing});
					this.resolveLastPriority(statuses, callbackType);
				}
			}
			if (foeCallbackType) {
				statuses = statuses.concat(this.getRelevantEffectsInner(thing.foe, foeCallbackType, null, null, false, false, getAll));
			}
			if (bubbleUp) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this, callbackType, null, null, true, false, getAll));
			}
			if (bubbleDown) {
				for (var i = 0;i < thing.active.length;i++) {
					statuses = statuses.concat(this.getRelevantEffectsInner(thing.active[i], callbackType, null, null, false, true, getAll));
				}
			}
			return statuses;
		}

		if (!thing.getStatus) {
			this.debug(JSON.stringify(thing));
			return statuses;
		}
		var status = thing.getStatus();
		if (status[callbackType] !== undefined || (getAll && thing.statusData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.statusData, end: thing.clearStatus, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		for (var i in thing.volatiles) {
			status = thing.getVolatile(i);
			if (status[callbackType] !== undefined || (getAll && thing.volatiles[i][getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: thing.volatiles[i], end: thing.removeVolatile, thing: thing});
				this.resolveLastPriority(statuses, callbackType);
			}
		}
		status = thing.getAbility();
		if (status[callbackType] !== undefined || (getAll && thing.abilityData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.abilityData, end: thing.clearAbility, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		status = thing.getItem();
		if (status[callbackType] !== undefined || (getAll && thing.itemData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.itemData, end: thing.clearItem, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		status = this.getEffect(thing.template.baseSpecies);
		if (status[callbackType] !== undefined) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.speciesData, end: function (){}, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}

		if (foeThing && foeCallbackType && foeCallbackType.substr(0, 8) !== 'onSource') {
			statuses = statuses.concat(this.getRelevantEffectsInner(foeThing, foeCallbackType, null, null, false, false, getAll));
		} else if (foeCallbackType) {
			var foeActive = thing.side.foe.active;
			var allyActive = thing.side.active;
			var eventName = '';
			if (foeCallbackType.substr(0, 8) === 'onSource') {
				eventName = foeCallbackType.substr(8);
				if (foeThing) {
					statuses = statuses.concat(this.getRelevantEffectsInner(foeThing, foeCallbackType, null, null, false, false, getAll));
				}
				foeCallbackType = 'onFoe' + eventName;
				foeThing = null;
			}
			if (foeCallbackType.substr(0, 5) === 'onFoe') {
				eventName = foeCallbackType.substr(5);
				for (var i = 0; i < allyActive.length; i++) {
					if (!allyActive[i] || allyActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAlly' + eventName, null, null, false, false, getAll));
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
				for (var i = 0; i < foeActive.length; i++) {
					if (!foeActive[i] || foeActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
			}
			for (var i = 0; i < foeActive.length; i++) {
				if (!foeActive[i] || foeActive[i].fainted) continue;
				statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], foeCallbackType, null, null, false, false, getAll));
			}
		}
		if (bubbleUp) {
			statuses = statuses.concat(this.getRelevantEffectsInner(thing.side, callbackType, foeCallbackType, null, true, false, getAll));
		}
		return statuses;
	};
	Battle.prototype.getPokemon = function (id) {
		if (typeof id !== 'string') id = id.id;
		for (var i = 0; i < this.p1.pokemon.length; i++) {
			var pokemon = this.p1.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		for (var i = 0; i < this.p2.pokemon.length; i++) {
			var pokemon = this.p2.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		return null;
	};
	Battle.prototype.makeRequest = function (type, requestDetails) {
		if (type) {
			this.currentRequest = type;
			this.rqid++;
			this.p1.decision = null;
			this.p2.decision = null;
		} else {
			type = this.currentRequest;
		}
		this.update();

		// default to no request
		var p1request = null;
		var p2request = null;
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';

		switch (type) {
		case 'switch':
			var switchTable = [];
			var active;
			for (var i=0, l=this.p1.active.length; i<l; i++) {
				active = this.p1.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.any(true)) {
				this.p1.currentRequest = 'switch';
				p1request = {forceSwitch: switchTable, side: this.p1.getData(), rqid: this.rqid};
			}
			switchTable = [];
			for (var i=0, l=this.p2.active.length; i<l; i++) {
				active = this.p2.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.any(true)) {
				this.p2.currentRequest = 'switch';
				p2request = {forceSwitch: switchTable, side: this.p2.getData(), rqid: this.rqid};
			}
			break;

		case 'teampreview':
			this.add('teampreview' + (requestDetails ? '|' + requestDetails : ''));
			this.p1.currentRequest = 'teampreview';
			p1request = {teamPreview: true, side: this.p1.getData(), rqid: this.rqid};
			this.p2.currentRequest = 'teampreview';
			p2request = {teamPreview: true, side: this.p2.getData(), rqid: this.rqid};
			break;

		default:
			var activeData;
			this.p1.currentRequest = 'move';
			activeData = this.p1.active.map(function (pokemon) {
				if (pokemon) return pokemon.getRequestData();
			});
			p1request = {active: activeData, side: this.p1.getData(), rqid: this.rqid};

			this.p2.currentRequest = 'move';
			activeData = this.p2.active.map(function (pokemon) {
				if (pokemon) return pokemon.getRequestData();
			});
			p2request = {active: activeData, side: this.p2.getData(), rqid: this.rqid};
			break;
		}

		if (this.p1 && this.p2) {
			var inactiveSide = -1;
			if (p1request && !p2request) {
				inactiveSide = 0;
			} else if (!p1request && p2request) {
				inactiveSide = 1;
			}
			if (inactiveSide !== this.inactiveSide) {
				this.send('inactiveside', inactiveSide);
				this.inactiveSide = inactiveSide;
			}
		}

		if (p1request) {
			this.p1.emitRequest(p1request);
		} else {
			this.p1.decision = true;
			this.p1.emitRequest({wait: true, side: this.p1.getData()});
		}

		if (p2request) {
			this.p2.emitRequest(p2request);
		} else {
			this.p2.decision = true;
			this.p2.emitRequest({wait: true, side: this.p2.getData()});
		}

		if (this.p2.decision && this.p1.decision) {
			if (this.p2.decision === true && this.p1.decision === true) {
				if (type !== 'move') {
					// TODO: investigate this race condition; should be fixed
					// properly later
					return this.makeRequest('move');
				}
				this.add('html', '<div class="broadcast-red"><b>The battle crashed</b></div>');
				this.win();
			} else {
				// some kind of weird race condition?
				this.commitDecisions();
			}
			return;
		}
	};
	Battle.prototype.tie = function () {
		this.win();
	};
	Battle.prototype.win = function (side) {
		if (this.ended) {
			return false;
		}
		if (side === 'p1' || side === 'p2') {
			side = this[side];
		} else if (side !== this.p1 && side !== this.p2) {
			side = null;
		}
		this.winner = side ? side.name : '';

		this.add('');
		if (side) {
			this.add('win', side.name);
		} else {
			this.add('tie');
		}
		this.ended = true;
		this.active = false;
		this.currentRequest = '';
		return true;
	};
	Battle.prototype.switchIn = function (pokemon, pos) {
		if (!pokemon || pokemon.isActive) return false;
		if (!pos) pos = 0;
		var side = pokemon.side;
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			var lastMove = null;
			lastMove = this.getMove(oldActive.lastMove);
			if (oldActive.switchCopyFlag === 'copyvolatile') {
				delete oldActive.switchCopyFlag;
				pokemon.copyVolatileFrom(oldActive);
			}
		}
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			this.cancelMove(oldActive);
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('switch', pokemon, pokemon.getDetails);
		pokemon.update();
		this.runEvent('SwitchIn', pokemon);
		this.addQueue({pokemon: pokemon, choice: 'runSwitch'});
	};
	Battle.prototype.canSwitch = function (side) {
		var canSwitchIn = [];
		for (var i = side.active.length; i < side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	};
	Battle.prototype.getRandomSwitchable = function (side) {
		var canSwitchIn = [];
		for (var i = side.active.length; i < side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		if (!canSwitchIn.length) {
			return null;
		}
		return canSwitchIn[this.random(canSwitchIn.length)];
	};
	Battle.prototype.dragIn = function (side, pos) {
		if (pos >= side.active.length) return false;
		var pokemon = this.getRandomSwitchable(side);
		if (!pos) pos = 0;
		if (!pokemon || pokemon.isActive) return false;
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			if (!oldActive.hp) {
				return false;
			}
			if (!this.runEvent('DragOut', oldActive)) {
				return false;
			}
			this.runEvent('SwitchOut', oldActive);
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			this.cancelMove(oldActive);
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('drag', pokemon, pokemon.getDetails);
		pokemon.update();
		this.runEvent('SwitchIn', pokemon);
		this.addQueue({pokemon: pokemon, choice: 'runSwitch'});
		return true;
	};
	Battle.prototype.swapPosition = function (pokemon, slot, attributes) {
		var target = pokemon.side.active[slot];
		if (slot !== 1 && (!target || target.fainted)) return false;

		this.add('swap', pokemon, slot, attributes || '');

		var side = pokemon.side;
		side.pokemon[pokemon.position] = target;
		side.pokemon[slot] = pokemon;
		side.active[pokemon.position] = side.pokemon[pokemon.position];
		side.active[slot] = side.pokemon[slot];
		if (target) target.position = pokemon.position;
		pokemon.position = slot;
		return true;
	};
	Battle.prototype.faint = function (pokemon, source, effect) {
		pokemon.faint(source, effect);
	};
	Battle.prototype.nextTurn = function () {
		this.turn++;
		for (var i = 0; i < this.sides.length; i++) {
			for (var j = 0; j < this.sides[i].active.length; j++) {
				var pokemon = this.sides[i].active[j];
				if (!pokemon) continue;
				pokemon.moveThisTurn = '';
				pokemon.usedItemThisTurn = false;
				pokemon.newlySwitched = false;
				if (pokemon.lastAttackedBy) {
					pokemon.lastAttackedBy.thisTurn = false;
				}
				pokemon.activeTurns++;
			}
			this.sides[i].faintedLastTurn = this.sides[i].faintedThisTurn;
			this.sides[i].faintedThisTurn = false;
		}
		this.add('turn', this.turn);

		if (this.gameType === 'triples' && this.sides.map('pokemonLeft').count(1) === this.sides.length) {
			// If only 2 pokemon are left in triples, they must touch each other.
			var center = false;
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					if (!this.sides[i].active[j] || this.sides[i].active[j].fainted) continue;
					if (this.sides[i].active[j].position === 1) break;
					this.swapPosition(this.sides[i].active[j], 1, '[silent]');
					center = true;
					break;
				}
			}
			if (center) this.add('-message', 'Automatic center!');
		}
		this.makeRequest('move');
	};
	Battle.prototype.start = function () {
		if (this.active) return;

		if (!this.p1 || !this.p1.isActive || !this.p2 || !this.p2.isActive) {
			// need two players to start
			return;
		}

		this.p2.emitRequest({side: this.p2.getData()});
		this.p1.emitRequest({side: this.p1.getData()});

		if (this.started) {
			this.makeRequest();
			this.isActive = true;
			this.activeTurns = 0;
			return;
		}
		this.isActive = true;
		this.activeTurns = 0;
		this.started = true;
		this.p2.foe = this.p1;
		this.p1.foe = this.p2;

		this.add('gametype', this.gameType);
		this.add('gen', this.gen);

		var format = this.getFormat();
		Tools.mod(format.mod).getBanlistTable(format); // fill in format ruleset

		this.add('tier', format.name);
		if (this.rated) {
			this.add('rated');
		}
		if (format && format.ruleset) {
			for (var i = 0; i < format.ruleset.length; i++) {
				this.addPseudoWeather(format.ruleset[i]);
			}
		}

		if (!this.p1.pokemon[0] || !this.p2.pokemon[0]) {
			this.add('message', 'Battle not started: One of you has an empty team.');
			return;
		}

		this.residualEvent('TeamPreview');

		this.addQueue({choice:'start'});
		this.midTurn = true;
		if (!this.currentRequest) this.go();
	};
	Battle.prototype.boost = function (boost, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		effect = this.getEffect(effect);
		boost = this.runEvent('Boost', target, source, effect, Object.clone(boost));
		var success = false;
		for (var i in boost) {
			var currentBoost = {};
			currentBoost[i] = boost[i];
			if (boost[i] !== 0 && target.boostBy(currentBoost)) {
				success = true;
				var msg = '-boost';
				if (boost[i] < 0) {
					msg = '-unboost';
					boost[i] = -boost[i];
				}
				switch (effect.id) {
				case 'intimidate': case 'gooey':
					this.add(msg, target, i, boost[i]);
					break;
				default:
					if (effect.effectType === 'Move') {
						this.add(msg, target, i, boost[i]);
					} else {
						this.add(msg, target, i, boost[i], '[from] ' + effect.fullname);
					}
					break;
				}
				this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			}
		}
		this.runEvent('AfterBoost', target, source, effect, boost);
		return success;
	};
	Battle.prototype.damage = function (damage, target, source, effect, instafaint) {
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
			if (effect.effectType === 'Weather' && !target.runImmunity(effect.id)) {
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
		var name = effect.fullname;
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

		if (instafaint && !target.hp) {
			this.debug('instafaint: '+this.faintQueue.map('target').map('name'));
			this.faintMessages(true);
		} else {
			damage = this.runEvent('AfterDamage', target, source, effect, damage);
		}

		return damage;
	};
	Battle.prototype.directDamage = function (damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!damage) return 0;
		damage = this.clampIntRange(damage, 1);

		damage = target.damage(damage, source, effect);
		switch (effect.id) {
		case 'strugglerecoil':
			this.add('-damage', target, target.getHealth, '[from] recoil');
			break;
		case 'confusion':
			this.add('-damage', target, target.getHealth, '[from] confusion');
			break;
		default:
			this.add('-damage', target, target.getHealth);
			break;
		}
		if (target.fainted) this.faint(target);
		return damage;
	};
	Battle.prototype.heal = function (damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		effect = this.getEffect(effect);
		if (damage && damage <= 1) damage = 1;
		damage = Math.floor(damage);
		// for things like Liquid Ooze, the Heal event still happens when nothing is healed.
		damage = this.runEvent('TryHeal', target, source, effect, damage);
		if (!damage) return 0;
		if (!target || !target.hp) return 0;
		if (target.hp >= target.maxhp) return 0;
		damage = target.heal(damage, source, effect);
		switch (effect.id) {
		case 'leechseed':
		case 'rest':
			this.add('-heal', target, target.getHealth, '[silent]');
			break;
		case 'drain':
			this.add('-heal', target, target.getHealth, '[from] drain', '[of] ' + source);
			break;
		case 'wish':
			break;
		default:
			if (effect.effectType === 'Move') {
				this.add('-heal', target, target.getHealth);
			} else if (source && source !== target) {
				this.add('-heal', target, target.getHealth, '[from] ' + effect.fullname, '[of] ' + source);
			} else {
				this.add('-heal', target, target.getHealth, '[from] ' + effect.fullname);
			}
			break;
		}
		this.runEvent('Heal', target, source, effect, damage);
		return damage;
	};
	Battle.prototype.chain = function (previousMod, nextMod) {
		// previousMod or nextMod can be either a number or an array [numerator, denominator]
		if (previousMod.length) previousMod = Math.floor(previousMod[0] * 4096 / previousMod[1]);
		else previousMod = Math.floor(previousMod * 4096);
		if (nextMod.length) nextMod = Math.floor(nextMod[0] * 4096 / nextMod[1]);
		else nextMod = Math.floor(nextMod * 4096);
		return ((previousMod * nextMod + 2048) >> 12) / 4096; // M'' = ((M * M') + 0x800) >> 12
	};
	Battle.prototype.chainModify = function (numerator, denominator) {
		var previousMod = Math.floor(this.event.modifier * 4096);

		if (numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		var nextMod = 0;
		if (this.event.ceilModifier) {
			nextMod = Math.ceil(numerator * 4096 / (denominator || 1));
		} else {
			nextMod = Math.floor(numerator * 4096 / (denominator || 1));
		}

		this.event.modifier = ((previousMod * nextMod + 2048) >> 12) / 4096;
	};
	Battle.prototype.modify = function (value, numerator, denominator) {
		// You can also use:
		// modify(value, [numerator, denominator])
		// modify(value, fraction) - assuming you trust JavaScript's floating-point handler
		if (!denominator) denominator = 1;
		if (numerator && numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		var modifier = Math.floor(numerator * 4096 / denominator);
		return Math.floor((value * modifier + 2048 - 1) / 4096);
	};
	Battle.prototype.getCategory = function (move) {
		move = this.getMove(move);
		return move.category || 'Physical';
	};
	Battle.prototype.getDamage = function (pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

		if (typeof move === 'number') move = {
			basePower: move,
			type: '???',
			category: 'Physical'
		};

		if (move.affectedByImmunities) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		if (move.isSoundBased && (pokemon !== target || this.gen <= 4)) {
			if (!target.runImmunity('sound', true)) {
				return false;
			}
		}

		if (move.ohko) {
			if (target.level > pokemon.level) {
				this.add('-failed', target);
				return false;
			}
			return target.maxhp;
		}

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		if (!move) {
			move = {};
		}
		if (!move.type) move.type = '???';
		var type = move.type;
		// '???' is typeless damage: used for Struggle and Confusion etc
		var category = this.getCategory(move);
		var defensiveCategory = move.defensiveCategory || category;

		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		if (this.gen <= 5) {
			move.critRatio = this.clampIntRange(move.critRatio, 0, 5);
			var critMult = [0, 16, 8, 4, 3, 2];
		} else {
			move.critRatio = this.clampIntRange(move.critRatio, 0, 4);
			var critMult = [0, 16, 8, 2, 1];
		}

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (move.critRatio) {
				move.crit = (this.random(critMult[move.critRatio]) === 0);
			}
		}
		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		var level = pokemon.level;

		var attacker = pokemon;
		var defender = target;
		var attackStat = category === 'Physical' ? 'atk' : 'spa';
		var defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		var attack;
		var defense;

		var atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		var defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

		var ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		var ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}

		if (move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0)) {
			var ignoreOffensive = true;
		}
		if (move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0)) {
			var ignoreDefensive = true;
		}

		if (ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		if (move.useTargetOffensive) attack = defender.calculateStat(attackStat, atkBoosts);
		else attack = attacker.calculateStat(attackStat, atkBoosts);

		if (move.useSourceDefensive) defense = attacker.calculateStat(defenseStat, defBoosts);
		else defense = defender.calculateStat(defenseStat, defBoosts);

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		//int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		var baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			var spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier (TODO: relocate here)
		// crit
		if (move.crit) {
			if (!suppressMessages) this.add('-crit', target);
			baseDamage = this.modify(baseDamage, move.critModifier || (this.gen >= 6 ? 1.5 : 2));
		}

		// randomizer
		// this is not a modifier
		// gen 1-2
		//var randFactor = Math.floor(Math.random() * 39) + 217;
		//baseDamage *= Math.floor(randFactor * 100 / 255) / 100;
		baseDamage = Math.floor(baseDamage * (100 - this.random(16)) / 100);

		// STAB
		if (move.hasSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		var totalTypeMod = 0;

		if (target.negateImmunity[move.type] !== 'IgnoreEffectiveness' || this.getImmunity(move.type, target)) {
			totalTypeMod = this.getEffectiveness(move, target, pokemon);
		}

		totalTypeMod = this.clampIntRange(totalTypeMod, -3, 3);
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (var i = 0; i < totalTypeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (var i = 0; i > totalTypeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		return Math.floor(baseDamage);
	};
	/**
	 * Returns whether a proposed target for a move is valid.
	 */
	Battle.prototype.validTargetLoc = function (targetLoc, source, targetType) {
		var numSlots = source.side.active.length;
		if (!Math.abs(targetLoc) && Math.abs(targetLoc) > numSlots) return false;

		var sourceLoc = -(source.position + 1);
		var isFoe = (targetLoc > 0);
		var isAdjacent = (isFoe ? Math.abs(-(numSlots + 1 - targetLoc) - sourceLoc) <= 1 : Math.abs(targetLoc - sourceLoc) === 1);
		var isSelf = (sourceLoc === targetLoc);

		switch (targetType) {
		case 'randomNormal':
		case 'normal':
			return isAdjacent;
		case 'adjacentAlly':
			return isAdjacent && !isFoe;
		case 'adjacentAllyOrSelf':
			return isAdjacent && !isFoe || isSelf;
		case 'adjacentFoe':
			return isAdjacent && isFoe;
		case 'any':
			return !isSelf;
		}
		return false;
	};
	Battle.prototype.getTargetLoc = function (target, source) {
		if (target.side === source.side) {
			return -(target.position + 1);
		} else {
			return target.position + 1;
		}
	};
	Battle.prototype.validTarget = function (target, source, targetType) {
		return this.validTargetLoc(this.getTargetLoc(target, source), source, targetType);
	};
	Battle.prototype.getTarget = function (decision) {
		var move = this.getMove(decision.move);
		var target;
		if ((move.target !== 'randomNormal') &&
				this.validTargetLoc(decision.targetLoc, decision.pokemon, move.target)) {
			if (decision.targetLoc > 0) {
				target = decision.pokemon.side.foe.active[decision.targetLoc - 1];
			} else {
				target = decision.pokemon.side.active[-decision.targetLoc - 1];
			}
			if (target) {
				if (!target.fainted) {
					// target exists and is not fainted
					return target;
				} else if (target.side === decision.pokemon.side) {
					// fainted allied targets don't retarget
					return false;
				}
			}
			// chosen target not valid, retarget randomly with resolveTarget
		}
		if (!decision.targetPosition || !decision.targetSide) {
			target = this.resolveTarget(decision.pokemon, decision.move);
			decision.targetSide = target.side;
			decision.targetPosition = target.position;
		}
		return decision.targetSide.active[decision.targetPosition];
	};
	Battle.prototype.resolveTarget = function (pokemon, move) {
		// A move was used without a chosen target

		// For instance: Metronome chooses Ice Beam. Since the user didn't
		// choose a target when choosing Metronome, Ice Beam's target must
		// be chosen randomly.

		// The target is chosen randomly from possible targets, EXCEPT that
		// moves that can target either allies or foes will only target foes
		// when used without an explicit target.

		move = this.getMove(move);
		if (move.target === 'adjacentAlly') {
			var adjacentAllies = [pokemon.side.active[pokemon.position - 1], pokemon.side.active[pokemon.position + 1]].filter(function (active) {
				return active && !active.fainted;
			});
			if (adjacentAllies.length) return adjacentAllies[Math.floor(Math.random() * adjacentAllies.length)];
			return pokemon;
		}
		if (move.target === 'self' || move.target === 'all' || move.target === 'allySide' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf') {
			return pokemon;
		}
		if (pokemon.side.active.length > 2) {
			if (move.target === 'adjacentFoe' || move.target === 'normal' || move.target === 'randomNormal') {
				var foeActives = pokemon.side.foe.active;
				var frontPosition = foeActives.length - 1 - pokemon.position;
				var adjacentFoes = foeActives.slice(frontPosition < 1 ? 0 : frontPosition - 1, frontPosition + 2).filter(function (active) {
					return active && !active.fainted;
				});
				if (adjacentFoes.length) return adjacentFoes[Math.floor(Math.random() * adjacentFoes.length)];
				// no valid target at all, return a foe for any possible redirection
			}
		}
		return pokemon.side.foe.randomActive() || pokemon.side.foe.active[0];
	};
	Battle.prototype.checkFainted = function () {
		function isFainted(a) {
			if (!a) return false;
			if (a.fainted) {
				a.switchFlag = true;
				return true;
			}
			return false;
		}
		// make sure these don't get short-circuited out; all switch flags need to be set
		var p1fainted = this.p1.active.map(isFainted);
		var p2fainted = this.p2.active.map(isFainted);
	};
	Battle.prototype.faintMessages = function (lastFirst) {
		if (this.ended) return;
		if (lastFirst && this.faintQueue.length) {
			this.faintQueue.unshift(this.faintQueue.pop());
		}
		var faintData;
		while (this.faintQueue.length) {
			faintData = this.faintQueue.shift();
			if (!faintData.target.fainted) {
				this.add('faint', faintData.target);
				this.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				faintData.target.fainted = true;
				faintData.target.isActive = false;
				faintData.target.isStarted = false;
				faintData.target.side.pokemonLeft--;
				faintData.target.side.faintedThisTurn = true;
			}
		}
		if (!this.p1.pokemonLeft && !this.p2.pokemonLeft) {
			this.win(faintData && faintData.target.side);
			return true;
		}
		if (!this.p1.pokemonLeft) {
			this.win(this.p2);
			return true;
		}
		if (!this.p2.pokemonLeft) {
			this.win(this.p1);
			return true;
		}
		return false;
	};
	Battle.prototype.addQueue = function (decision, noSort, side) {
		if (decision) {
			if (Array.isArray(decision)) {
				for (var i = 0; i < decision.length; i++) {
					this.addQueue(decision[i], noSort);
				}
				return;
			}
			if (!decision.side && side) decision.side = side;
			if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.priority) {
				var priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 6,
					'runSwitch': 6.1,
					'megaEvo': 5.9,
					'residual': -100,
					'team': 102,
					'start': 101
				};
				if (priorities[decision.choice]) {
					decision.priority = priorities[decision.choice];
				}
			}
			if (decision.choice === 'move') {
				if (this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc}, true);
				}
			} else if (decision.choice === 'switch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.speed;
			}
			if (decision.move) {
				var target;

				if (!decision.targetPosition) {
					target = this.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = this.getMoveCopy(decision.move);
				if (!decision.priority) {
					var priority = decision.move.priority;
					priority = this.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);
					decision.priority = priority;
					// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
					if (this.gen > 5) decision.move.priority = priority;
				}
			}
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && decision.choice === 'switch' && decision.target) decision.speed = decision.target.speed;
			if (!decision.speed) decision.speed = decision.pokemon.speed;

			if (decision.choice === 'switch' && !decision.side.pokemon[0].isActive) {
				// if there's no actives, switches happen before activations
				decision.priority = 6.2;
			}

			this.queue.push(decision);
		}
		if (!noSort) {
			this.queue.sort(Battle.comparePriority);
		}
	};
	Battle.prototype.prioritizeQueue = function (decision, source, sourceEffect) {
		if (this.event) {
			if (!source) source = this.event.source;
			if (!sourceEffect) sourceEffect = this.effect;
		}
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i] === decision) {
				this.queue.splice(i, 1);
				break;
			}
		}
		decision.sourceEffect = sourceEffect;
		this.queue.unshift(decision);
	};
	Battle.prototype.willAct = function () {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch' || this.queue[i].choice === 'shift') {	
				return this.queue[i];
			}
		}
		return null;
	};
	Battle.prototype.willMove = function (pokemon) {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return null;
	};
	Battle.prototype.cancelDecision = function (pokemon) {
		var success = false;
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				i--;
				success = true;
			}
		}
		return success;
	};
	Battle.prototype.cancelMove = function (pokemon) {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				return true;
			}
		}
		return false;
	};
	Battle.prototype.willSwitch = function (pokemon) {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'switch' && this.queue[i].pokemon === pokemon) {
				return true;
			}
		}
		return false;
	};
	Battle.prototype.runDecision = function (decision) {
		var pokemon;

		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start':
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
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
			decision.move.beforeTurnCallback.call(this, decision.pokemon, this.getTarget(decision));
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
			return;
			// we return here because the update event would crash since there are no active pokemon yet
			break;
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
			}
			if (decision.pokemon && !decision.pokemon.hp && !decision.pokemon.fainted) {
				if (this.gen <= 4) {
					decision.priority = -101;
					this.addQueue(decision, true);
					this.debug('Pursuit target fainted');
					break;
				}
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				this.debug('Switch target is already active');
				break;
			}
			this.switchIn(decision.target, decision.pokemon.position);
			//decision.target.runSwitchIn();
			break;
		case 'runSwitch':
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
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.residualEvent('Residual');
			break;
		}
		this.clearActiveMove();

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

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.length) {
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

		if (p1switch || p2switch) {
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	};
	Battle.prototype.go = function () {
		this.add('');
		if (this.currentRequest) {
			this.currentRequest = '';
		}

		if (!this.midTurn) {
			this.queue.push({choice:'residual', priority: -100});
			this.queue.push({choice:'beforeTurn', priority: 100});
			this.midTurn = true;
		}
		this.addQueue(null);

		var currentPriority = 6;

		while (this.queue.length) {
			var decision = this.queue.shift();

			/* while (decision.priority < currentPriority && currentPriority > -6) {
				this.eachEvent('Priority', null, currentPriority);
				currentPriority--;
			} */

			this.runDecision(decision);

			if (this.currentRequest) {
				return;
			}

			// if (!this.queue.length || this.queue[0].choice === 'runSwitch') {
			// 	if (this.faintMessages()) return;
			// }

			if (this.ended) return;
		}

		this.nextTurn();
		this.midTurn = false;
		this.queue = [];
	};
	/**
	 * Changes a pokemon's decision.
	 *
	 * The un-modded game should not use this function for anything,
	 * since it rerolls speed ties (which messes up RNG state).
	 *
	 * You probably want the OverrideDecision event (which doesn't
	 * change priority order).
	 */
	Battle.prototype.changeDecision = function (pokemon, decision) {
		this.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		this.addQueue(decision);
	};
	/**
	 * Takes a choice string passed from the client. Starts the next
	 * turn if all required choices have been made.
	 */
	Battle.prototype.choose = function (sideid, choice, rqid) {
		var side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		// This condition should be impossible because the sideid comes
		// from our forked process and if the player id were invalid, we would
		// not have even got to this function.
		if (!side) return; // wtf

		// This condition can occur if the client sends a decision at the
		// wrong time.
		if (!side.currentRequest) return;

		// Make sure the decision is for the right request.
		if ((rqid !== undefined) && (parseInt(rqid, 10) !== this.rqid)) {
			return;
		}

		// It should be impossible for choice not to be a string. Choice comes
		// from splitting the string sent by our forked process, not from the
		// client. However, just in case, we maintain this check for now.
		if (typeof choice === 'string') choice = choice.split(',');

		side.decision = this.parseChoice(choice, side);

		if (this.p1.decision && this.p2.decision) {
			this.commitDecisions();
		}
	};
	Battle.prototype.commitDecisions = function () {
		if (this.p1.decision !== true) {
			this.addQueue(this.p1.decision, true, this.p1);
		}
		if (this.p2.decision !== true) {
			this.addQueue(this.p2.decision, true, this.p2);
		}

		this.currentRequest = '';
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';

		this.p1.decision = true;
		this.p2.decision = true;

		this.go();
	};
	Battle.prototype.undoChoice = function (sideid) {
		var side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		// The following condition can never occur for the reasons given in
		// the choose() function above.
		if (!side) return; // wtf
		// This condition can occur.
		if (!side.currentRequest) return;

		if (side.decision && side.decision.finalDecision) {
			this.debug("Can't cancel decision: the last pokemon could have been trapped");
			return;
		}

		side.decision = false;
	};
	/**
	 * Parses a choice string passed from a client into a decision object
	 * usable by PS's engine.
	 *
	 * Choice validation is also done here.
	 */
	Battle.prototype.parseChoice = function (choices, side) {
		var prevSwitches = {};
		if (!side.currentRequest) return true;

		if (typeof choices === 'string') choices = choices.split(',');

		var decisions = [];
		var len = choices.length;
		if (side.currentRequest === 'move') len = side.active.length;

		var freeSwitchCount = {'switch':0, 'pass':0};
		if (side.currentRequest === 'switch') {
			var canSwitch = side.active.filter(function (mon) {return mon && mon.switchFlag;}).length;
			freeSwitchCount['switch'] = Math.min(canSwitch, side.pokemon.slice(side.active.length).filter(function (mon) {return !mon.fainted;}).length);
			freeSwitchCount['pass'] = canSwitch - freeSwitchCount['switch'];
		}
		for (var i = 0; i < len; i++) {
			var choice = (choices[i] || '').trim();

			var data = '';
			var firstSpaceIndex = choice.indexOf(' ');
			if (firstSpaceIndex >= 0) {
				data = choice.substr(firstSpaceIndex + 1).trim();
				choice = choice.substr(0, firstSpaceIndex).trim();
			}

			switch (side.currentRequest) {
			case 'teampreview':
				if (choice !== 'team' || i > 0) return false;
				break;
			case 'move':
				if (i >= side.active.length) return false;
				if (!side.pokemon[i] || side.pokemon[i].fainted) {
					decisions.push({
						choice: 'pass'
					});
					continue;
				}
				if (choice !== 'move' && choice !== 'switch' && choice !== 'shift') {
					if (i === 0) return false;
					// fallback
					choice = 'move';
					data = '1';
				}
				break;
			case 'switch':
				if (i >= side.active.length) return false;
				if (!side.active[i] || !side.active[i].switchFlag) {
					if (choice !== 'pass') choices.splice(i, 0, 'pass');
					decisions.push({
						choice: 'pass'
					});
					continue;
				}
				if (choice !== 'switch' && choice !== 'pass') return false;
				freeSwitchCount[choice]--;
				break;
			default:
				return false;
			}

			var decision = null;
			switch (choice) {
			case 'team':
				decisions.push({
					choice: 'team',
					side: side,
					team: data
				});
				break;

			case 'switch':
				if (i > side.active.length || i > side.pokemon.length) continue;
				if (side.currentRequest === 'move') {
					if (side.pokemon[i].trapped) {
						//this.debug("Can't switch: The active pokemon is trapped");
						side.emitCallback('trapped', i);
						return false;
					} else if (side.pokemon[i].maybeTrapped) {
						var finalDecision = true;
						for (var j = i + 1; j < side.active.length; ++j) {
							if (side.active[j] && !side.active[j].fainted) {
								finalDecision = false;
							}
						}
						decisions.finalDecision = decisions.finalDecision || finalDecision;
					}
				}

				data = parseInt(data, 10) - 1;
				if (data < 0) data = 0;
				if (data > side.pokemon.length - 1) data = side.pokemon.length - 1;

				if (!side.pokemon[data]) {
					this.debug("Can't switch: You can't switch to a pokemon that doesn't exist");
					return false;
				}
				if (data === i) {
					this.debug("Can't switch: You can't switch to yourself");
					return false;
				}
				if (data < side.active.length) {
					this.debug("Can't switch: You can't switch to an active pokemon");
					return false;
				}
				if (side.pokemon[data].fainted) {
					this.debug("Can't switch: You can't switch to a fainted pokemon");
					return false;
				}
				if (prevSwitches[data]) {
					this.debug("Can't switch: You can't switch to pokemon already queued to be switched");
					return false;
				}
				prevSwitches[data] = true;

				decisions.push({
					choice: 'switch',
					priority: (side.currentRequest === 'switch' ? 101 : undefined),
					pokemon: side.pokemon[i],
					target: side.pokemon[data]
				});
				break;

			case 'shift':
				if (i > side.active.length || i > side.pokemon.length) continue;
				if (this.gameType !== 'triples') {
					this.debug("Can't shift: You can't shift a pokemon to the center except in a triple battle");
					return false;
				}
				if (i === 1) {
					this.debug("Can't shift: You can't shift a pokemon to its own position");
					return false;
				}

				decisions.push({
					choice: 'shift',
					pokemon: side.pokemon[i]
				});
				break;

			case 'move':
				var targetLoc = 0;
				var pokemon = side.pokemon[i];
				var lockedMove = pokemon.getLockedMove();
				var validMoves = pokemon.getValidMoves(lockedMove);
				var moveid = '';

				if (data.substr(data.length - 2) === ' 1') targetLoc = 1;
				if (data.substr(data.length - 2) === ' 2') targetLoc = 2;
				if (data.substr(data.length - 2) === ' 3') targetLoc = 3;
				if (data.substr(data.length - 3) === ' -1') targetLoc = -1;
				if (data.substr(data.length - 3) === ' -2') targetLoc = -2;
				if (data.substr(data.length - 3) === ' -3') targetLoc = -3;

				if (targetLoc) data = data.substr(0, data.lastIndexOf(' '));

				if (lockedMove) targetLoc = (this.runEvent('LockMoveTarget', pokemon) || 0);

				if (data.substr(data.length - 5) === ' mega') {
					if (!lockedMove) {
						decisions.push({
							choice: 'megaEvo',
							pokemon: pokemon
						});
					}
					data = data.substr(0, data.length - 5);
				}

				if (data.search(/^[0-9]+$/) >= 0) {
					moveid = validMoves[parseInt(data, 10) - 1];
				} else {
					moveid = toId(data);
					if (moveid.substr(0, 11) === 'hiddenpower') {
						moveid = 'hiddenpower';
					}
					if (validMoves.indexOf(moveid) < 0) {
						moveid = '';
					}
				}
				if (!moveid) {
					moveid = validMoves[0];
				}

				decisions.push({
					choice: 'move',
					pokemon: pokemon,
					targetLoc: targetLoc,
					move: moveid
				});
				break;

			case 'pass':
				if (i > side.active.length || i > side.pokemon.length) continue;
				if (side.currentRequest !== 'switch') {
					this.debug("No se pudo pasar el turno.");
					return false;
				}
				decisions.push({
					choice: 'pass',
					priority: 102,
					pokemon: side.active[i]
				});
			}
		}
		if (freeSwitchCount['switch'] !== 0 || freeSwitchCount['pass'] !== 0) return false;

		return decisions;
	};
	Battle.prototype.add = function () {
		var parts = Array.prototype.slice.call(arguments);
		var functions = parts.map(function (part) {
			return typeof part === 'function';
		});
		if (functions.indexOf(true) < 0) {
			this.log.push('|' + parts.join('|'));
		} else {
			this.log.push('|split');
			var sides = this.sides.concat(null, true);
			for (var i = 0; i < sides.length; ++i) {
				var line = '';
				for (var j = 0; j < parts.length; ++j) {
					line += '|';
					if (functions[j]) {
						line += parts[j](sides[i]);
					} else {
						line += parts[j];
					}
				}
				this.log.push(line);
			}
		}
	};
	Battle.prototype.addMove = function () {
		this.lastMoveLine = this.log.length;
		this.log.push('|' + Array.prototype.slice.call(arguments).join('|'));
	};
	Battle.prototype.attrLastMove = function () {
		this.log[this.lastMoveLine] += '|' + Array.prototype.slice.call(arguments).join('|');
	};
	Battle.prototype.debug = function (activity) {
		if (this.getFormat().debug) {
			this.add('debug', activity);
		}
	};
	Battle.prototype.debugError = function (activity) {
		this.add('debug', activity);
	};

	// players

	Battle.prototype.join = function (slot, name, avatar, team) {
		if (this.p1 && this.p1.isActive && this.p2 && this.p2.isActive) return false;
		if ((this.p1 && this.p1.isActive && this.p1.name === name) || (this.p2 && this.p2.isActive && this.p2.name === name)) return false;
		if (this.p1 && this.p1.isActive || slot === 'p2') {
			if (this.started) {
				this.p2.name = name;
			} else {
				//console.log("NEW SIDE: " + name);
				this.p2 = new BattleSide(name, this, 1, team);
				this.sides[1] = this.p2;
			}
			if (avatar) this.p2.avatar = avatar;
			this.p2.isActive = true;
			this.add('player', 'p2', this.p2.name, avatar);
		} else {
			if (this.started) {
				this.p1.name = name;
			} else {
				//console.log("NEW SIDE: " + name);
				this.p1 = new BattleSide(name, this, 0, team);
				this.sides[0] = this.p1;
			}
			if (avatar) this.p1.avatar = avatar;
			this.p1.isActive = true;
			this.add('player', 'p1', this.p1.name, avatar);
		}
		this.start();
		return true;
	};
	Battle.prototype.rename = function (slot, name, avatar) {
		if (slot === 'p1' || slot === 'p2') {
			var side = this[slot];
			side.name = name;
			if (avatar) side.avatar = avatar;
			this.add('player', slot, name, side.avatar);
		}
	};
	Battle.prototype.leave = function (slot) {
		if (slot === 'p1' || slot === 'p2') {
			var side = this[slot];
			if (!side) {
				console.log('**** ' + slot + ' tried to leave before it was possible in ' + this.id);
				require('./crashlogger.js')({stack: '**** ' + slot + ' tried to leave before it was possible in ' + this.id}, 'A simulator process');
				return;
			}

			side.emitRequest(null);
			side.isActive = false;
			this.add('player', slot);
			this.active = false;
		}
		return true;
	};

	// IPC

	// Messages sent by this function are received and handled in
	// Simulator.prototype.receive in simulator.js (in another process).
	Battle.prototype.send = function (type, data) {
		if (Array.isArray(data)) data = data.join("\n");
		process.send(this.id + "\n" + type + "\n" + data);
	};
	// This function is called by this process's 'message' event.
	Battle.prototype.receive = function (data, more) {
		this.messageLog.push(data.join(' '));
		var logPos = this.log.length;
		var alreadyEnded = this.ended;
		switch (data[1]) {
		case 'join':
			var team = null;
			try {
				if (more) team = Tools.fastUnpackTeam(more);
			} catch (e) {
				console.log('TEAM PARSE ERROR: ' + more);
				team = null;
			}
			this.join(data[2], data[3], data[4], team);
			break;

		case 'rename':
			this.rename(data[2], data[3], data[4]);
			break;

		case 'leave':
			this.leave(data[2]);
			break;

		case 'chat':
			this.add('chat', data[2], more);
			break;

		case 'win':
		case 'tie':
			this.win(data[2]);
			break;

		case 'choose':
			this.choose(data[2], data[3], data[4]);
			break;

		case 'undo':
			this.undoChoice(data[2]);
			break;

		case 'eval':
			var battle = this;
			var p1 = this.p1;
			var p2 = this.p2;
			var p1active = p1 ? p1.active[0] : null;
			var p2active = p2 ? p2.active[0] : null;
			data[2] = data[2].replace(/\f/g, '\n');
			this.add('', '>>> ' + data[2]);
			try {
				this.add('', '<<< ' + eval(data[2]));
			} catch (e) {
				this.add('', '<<< error: ' + e.message);
			}
			break;
		}

		this.sendUpdates(logPos, alreadyEnded);
	};
	Battle.prototype.sendUpdates = function (logPos, alreadyEnded) {
		if (this.p1 && this.p2) {
			var inactiveSide = -1;
			if (!this.p1.isActive && this.p2.isActive) {
				inactiveSide = 0;
			} else if (this.p1.isActive && !this.p2.isActive) {
				inactiveSide = 1;
			} else if (!this.p1.decision && this.p2.decision) {
				inactiveSide = 0;
			} else if (this.p1.decision && !this.p2.decision) {
				inactiveSide = 1;
			}
			if (inactiveSide !== this.inactiveSide) {
				this.send('inactiveside', inactiveSide);
				this.inactiveSide = inactiveSide;
			}
		}

		if (this.log.length > logPos) {
			if (alreadyEnded !== undefined && this.ended && !alreadyEnded) {
				if (this.rated) {
					var log = {
						turns: this.turn,
						p1: this.p1.name,
						p2: this.p2.name,
						p1team: this.p1.team,
						p2team: this.p2.team,
						log: this.log
					};
					this.send('log', JSON.stringify(log));
				}
				this.send('score', [this.p1.pokemonLeft, this.p2.pokemonLeft]);
				this.send('winupdate', [this.winner].concat(this.log.slice(logPos)));
			} else {
				this.send('update', this.log.slice(logPos));
			}
		}
	};

	Battle.prototype.destroy = function () {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (var i = 0; i < this.sides.length; i++) {
			if (this.sides[i]) this.sides[i].destroy();
			this.sides[i] = null;
		}
		this.p1 = null;
		this.p2 = null;
		for (var i = 0; i < this.queue.length; i++) {
			delete this.queue[i].pokemon;
			delete this.queue[i].side;
			this.queue[i] = null;
		}
		this.queue = null;

		// in case the garbage collector really sucks, at least deallocate the log
		this.log = null;

		// remove from battle list
		Battles[this.id] = null;
	};
	return Battle;
})();

exports.BattlePokemon = BattlePokemon;
exports.BattleSide = BattleSide;
exports.Battle = Battle;
