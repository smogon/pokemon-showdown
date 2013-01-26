require('sugar');

fs = require('fs');
config = require('./config/config.js');

if (config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', function (err) {
		console.log("\n"+err.stack+"\n");
		fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
			this.write("\n"+err.stack+"\n");
			this.end();
		}).on("error", function (err) {
			console.log("\n"+err.stack+"\n");
		});
		/* var stack = (""+err.stack).split("\n").slice(0,2).join("<br />");
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
		Rooms.lobby.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		config.modchat = 'crash';
		lockdown = true; */
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
toId = function(text) {
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;

	return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
toUserid = toId;

/**
 * Validates a username or Pokemon nickname
 */
var bannedNameStartChars = {'~':1, '&':1, '@':1, '%':1, '+':1, '-':1, '!':1, '?':1, '#':1};
toName = function(name) {
	name = string(name).trim();
	name = name.replace(/(\||\n|\[|\]|\,)/g, '');
	while (bannedNameStartChars[name.substr(0,1)]) {
		name = name.substr(1);
	}
	if (name.length > 18) name = name.substr(0,18);
	return name;
};

/**
 * Escapes a string for HTML
 * If strEscape is true, escapes it for JavaScript, too
 */
sanitize = function(str, strEscape) {
	str = (''+(str||''));
	str = str.escapeHTML();
	if (strEscape) str = str.replace(/'/g, '\\\'');
	return str;
};

/**
 * Safely ensures the passed variable is a string
 * Simply doing ''+str can crash if str.toString crashes or isn't a function
 * If we're expecting a string and being given anything that isn't a string
 * or a number, it's safe to assume it's an error, and return ''
 */
string = function(str) {
	if (typeof str === 'string' || typeof str === 'number') return ''+str;
	return '';
}

/**
 * Converts any variable to an integer (numbers get floored, non-numbers
 * become 0). Then clamps it between min and (optionally) max.
 */
clampIntRange = function(num, min, max) {
	if (typeof num !== 'number') num = 0;
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
};

Data = {};
Tools = require('./tools.js');

var Battles = {};

// Receive and process a message sent using Simulator.prototype.send in
// another process.
process.on('message', function(message) {
	//console.log('CHILD MESSAGE RECV: "'+message+'"');
	var nlIndex = message.indexOf("\n");
	var more = '';
	if (nlIndex > 0) {
		more = message.substr(nlIndex+1);
		message = message.substr(0, nlIndex);
	}
	var data = message.split('|');
	if (data[1] === 'init') {
		if (!Battles[data[0]]) {
			Battles[data[0]] = new Battle(data[0], data[2], data[3]);
		}
	} else if (data[1] === 'dealloc') {
		if (Battles[data[0]]) Battles[data[0]].destroy();
		delete Battles[data[0]];
	} else {
		if (Battles[data[0]]) {
			Battles[data[0]].receive(data, more);
		} else if (data[1] === 'eval') {
			try {
				eval(data[2]);
			} catch (e) {}
		}
	}
});

function BattlePokemon(set, side) {
	var selfB = side.battle;
	var selfS = side;
	var selfP = this;
	this.side = side;
	if (typeof set === 'string') set = {name: set};

	this.baseSet = set;
	this.set = this.baseSet;

	this.baseTemplate = selfB.getTemplate(set.species || set.name);
	if (!this.baseTemplate.exists) {
		selfB.debug('Unidentified species: '+this.species);
		this.baseTemplate = selfB.getTemplate('Bulbasaur');
	}
	this.species = this.baseTemplate.species;
	if (set.name === set.species || !set.name || !set.species) {
		set.name = this.species;
	}
	this.name = (set.name || set.species || 'Bulbasaur').substr(0,20);
	this.speciesid = toId(this.species);
	this.template = this.baseTemplate;
	this.moves = [];
	this.baseMoves = this.moves;
	this.movepp = {};
	this.moveset = [];
	this.baseMoveset = [];
	this.trapped = false;

	this.level = clampIntRange(set.forcedLevel || set.level || 100, 1, 100);
	this.hp = 0;
	this.maxhp = 100;
	var genders = {M:'M',F:'F'};
	this.gender = this.template.gender || genders[set.gender] || (Math.random()*2<1?'M':'F');
	if (this.gender === 'N') this.gender = '';
	this.happiness = typeof set.happiness === 'number' ? clampIntRange(set.happiness, 0, 255) : 255;

	this.fullname = this.side.id + ': ' + this.name;
	this.details = this.species + (this.level==100?'':', L'+this.level) + (this.gender===''?'':', '+this.gender) + (this.set.shiny?', shiny':'');

	this.id = this.fullname; // shouldn't really be used anywhere
	this.illusion = null;

	this.fainted = false;
	this.lastItem = '';
	this.status = '';
	this.statusData = {};
	this.volatiles = {};
	this.position = 0;
	this.lastMove = '';
	this.lastDamage = 0;
	this.lastAttackedBy = null;
	this.movedThisTurn = false;
	this.usedItemThisTurn = false;
	this.newlySwitched = false;
	this.beingCalledBack = false;
	this.isActive = false;
	this.isStarted = false; // has this pokemon's Start events run yet?

	this.transformed = false;
	this.negateImmunity = {};

	this.height = this.template.height;
	this.heightm = this.template.heightm;
	this.weight = this.template.weight;
	this.weightkg = this.template.weightkg;

	this.ignore = {};
	this.duringMove = false;

	this.baseAbility = toId(set.ability);
	this.ability = this.baseAbility;
	this.item = toId(set.item);
	this.abilityData = {id: this.ability};
	this.itemData = {id: this.item};
	this.speciesData = {id: this.speciesid};

	this.hpType = 'Dark';
	this.hpPower = 70;

	this.types = this.baseTemplate.types;

	if (this.set.moves) {
		for (var i=0; i<this.set.moves.length; i++) {
			var move = selfB.getMove(this.set.moves[i]);
			if (!move.id) continue;
			if (move.id === 'hiddenpower') {
				if (!this.set.ivs || Object.values(this.set.ivs).every(31)) {
					this.set.ivs = selfB.getType(move.type).HPivs;
				}
				move = selfB.getMove('hiddenpower');
			}
			this.baseMoveset.push({
				move: move.name,
				id: move.id,
				pp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				maxpp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				target: (move.ghostTarget && (this.types[0]==='Ghost'||this.types[1]==='Ghost') ? move.ghostTarget : move.target),
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
		this.set.evs[i] = clampIntRange(this.set.evs[i], 0, 255);
	}
	for (var i in this.set.ivs) {
		this.set.ivs[i] = clampIntRange(this.set.ivs[i], 0, 31);
	}
	this.speed = 0;

	var hpTypeX = 0, hpPowerX = 0;
	var i = 1;
	for (var s in stats) {
		hpTypeX += i * (this.set.ivs[s] % 2);
		hpPowerX += i * (Math.floor(this.set.ivs[s] / 2) % 2);
		i *= 2;
	}
	var hpTypes = ['Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark'];
	this.hpType = hpTypes[Math.floor(hpTypeX * 15 / 63)];
	this.hpPower = Math.floor(hpPowerX * 40 / 63) + 30;

	this.boosts = {
		atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
		accuracy: 0, evasion: 0
	};
	this.baseBoosts = {
		atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
		accuracy: 0, evasion: 0
	};
	this.baseStats = this.template.baseStats;
	this.bst = 0;
	for (var i in this.baseStats) {
		this.bst += this.baseStats[i];
	}
	this.bst = this.bst || 10;

	this.maxhp = Math.floor(Math.floor(2*selfP.baseStats['hp']+selfP.set.ivs['hp']+Math.floor(selfP.set.evs['hp']/4)+100)*selfP.level / 100 + 10);
	if (this.baseStats['hp'] === 1) this.maxhp = 1; // shedinja
	this.hp = this.hp || this.maxhp;

	this.toString = function() {
		var fullname = selfP.fullname;
		if (selfP.illusion) fullname = selfP.illusion.fullname;

		var positionList = ['a','b','c','d','e','f'];
		if (selfP.isActive) return fullname.substr(0,2) + positionList[selfP.position] + fullname.substr(2);
		return fullname;
	};
	this.getDetails = function() {
		if (selfP.illusion) return selfP.illusion.details + '|' + selfP.getHealth();
		return selfP.details + '|' + selfP.getHealth();
	};

	this.update = function(init) {
		selfP.baseStats = selfP.template.baseStats;
		// reset for Light Metal etc
		selfP.weightkg = selfP.template.weightkg;
		// reset for Forecast etc
		selfP.types = selfP.template.types;
		// reset for diabled moves
		selfP.disabledMoves = {};
		selfP.negateImmunity = {};
		selfP.trapped = false;
		// reset for ignore settings
		selfP.ignore = {};
		for (var i in selfP.moveset) {
			if (selfP.moveset[i]) selfP.moveset[i].disabled = false;
		}
		for (var i in selfP.baseBoosts) {
			selfP.boosts[i] = selfP.baseBoosts[i];
		}
		if (init) return;

		selfB.runEvent('ModifyPokemon', selfP);

		selfP.speed = selfP.getStat('spe');
	};
	this.getStat = function(statName, unboosted, unmodified) {
		statName = toId(statName);
		var boost = selfP.boosts[statName];

		if (statName === 'hp') return selfP.maxhp; // please just read .maxhp directly

		// base stat
		var stat = selfP.baseStats[statName];
		stat = Math.floor(Math.floor(2*stat+selfP.set.ivs[statName]+Math.floor(selfP.set.evs[statName]/4))*selfP.level / 100 + 5);

		// nature
		var nature = selfB.getNature(selfP.set.nature);
		if (statName === nature.plus) stat *= 1.1;
		if (statName === nature.minus) stat *= 0.9;
		stat = Math.floor(stat);

		if (unmodified) return stat;

		// stat modifier effects
		var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		stat = selfB.runEvent('Modify'+statTable[statName], selfP, null, null, stat);
		stat = Math.floor(stat);

		if (unboosted) return stat;

		// stat boosts
		var boostTable = [1,1.5,2,2.5,3,3.5,4];
		if (boost > 6) boost = 6;
		if (boost < -6) boost = -6;
		if (boost >= 0) {
			stat = Math.floor(stat * boostTable[boost]);
		} else {
			stat = Math.floor(stat / boostTable[-boost]);
		}

		return stat;
	};
	this.getMoveData = function(move) {
		move = selfB.getMove(move);
		for (var i=0; i<selfP.moveset.length; i++) {
			var moveData = selfP.moveset[i];
			if (moveData.id === move.id) {
				return moveData;
			}
		}
		return null;
	};
	this.deductPP = function(move, amount, source) {
		move = selfB.getMove(move);
		var ppData = selfP.getMoveData(move);
		var success = false;
		if (ppData) {
			ppData.used = true;
		}
		if (ppData && ppData.pp) {
			ppData.pp -= selfB.runEvent('DeductPP', selfP, source||selfP, move, amount||1);
			if (ppData.pp <= 0) {
				ppData.pp = 0;
			}
			success = true;
		}
		selfP.lastMove = move.id;
		if (!amount) {
			selfP.movedThisTurn = true;
		}
		return success;
	};
	this.gotAttacked = function(move, damage, source) {
		if (!damage) damage = 0;
		move = selfB.getMove(move);
		selfP.lastAttackedBy = {
			pokemon: source,
			damage: damage,
			move: move.id,
			thisTurn: true
		};
	};
	this.getMoves = function() {
		var lockedMove = selfB.runEvent('LockMove', selfP);
		if (lockedMove === true) lockedMove = false;
		if (lockedMove) {
			lockedMove = toId(lockedMove);
			selfP.trapped = true;
		}
		if (selfP.volatiles['mustRecharge'] || lockedMove === 'recharge') {
			return [{
				move: 'Recharge',
				id: 'recharge'
			}];
		}
		var moves = [];
		var hasValidMove = false;
		for (var i=0; i<selfP.moveset.length; i++) {
			var move = selfP.moveset[i];
			if (lockedMove) {
				if (lockedMove === move.id) {
					return [move];
				}
				continue;
			}
			if (selfP.disabledMoves[move.id] || !move.pp) {
				move.disabled = true;
			} else if (!move.disabled) {
				hasValidMove = true;
			}
			var moveName = move.move;
			if (move.id === 'hiddenpower') {
				moveName = 'Hidden Power '+selfP.hpType;
				if (selfP.hpPower != 70) moveName += ' '+selfP.hpPower;
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
				move: selfB.getMove(lockedMove).name,
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
	this.getRequestData = function() {
		return {
			moves: selfP.getMoves(),
			trapped: selfP.trapped
		}
	};
	this.positiveBoosts = function() {
		var boosts = 0;
		for (var i in selfP.boosts) {
			if (selfP.boosts[i] > 0) boosts += selfP.boosts[i];
		}
		return boosts;
	};
	this.boostBy = function(boost, source, effect) {
		var changed = false;
		for (var i in boost) {
			var delta = boost[i];
			selfP.baseBoosts[i] += delta;
			if (selfP.baseBoosts[i] > 6) {
				delta -= selfP.baseBoosts[i] - 6;
				selfP.baseBoosts[i] = 6;
			}
			if (selfP.baseBoosts[i] < -6) {
				delta -= selfP.baseBoosts[i] - (-6);
				selfP.baseBoosts[i] = -6;
			}
			if (delta) changed = true;
		}
		selfP.update();
		return changed;
	};
	this.clearBoosts = function() {
		for (var i in selfP.baseBoosts) {
			selfP.baseBoosts[i] = 0;
		}
		selfP.update();
	};
	this.setBoost = function(boost) {
		for (var i in boost) {
			selfP.baseBoosts[i] = boost[i];
		}
		selfP.update();
	};
	this.copyVolatileFrom = function(pokemon) {
		selfP.clearVolatile();
		selfP.baseBoosts = pokemon.baseBoosts;
		selfP.volatiles = pokemon.volatiles;
		selfP.update();
		pokemon.clearVolatile();
		for (var i in selfP.volatiles) {
			var status = selfP.getVolatile(i);
			if (status.noCopy) {
				delete selfP.volatiles[i];
			}
		}
	};
	this.transformInto = function(baseTemplate) {
		var pokemon = null;
		if (baseTemplate && baseTemplate.template) {
			pokemon = baseTemplate;
			baseTemplate = pokemon.template;
			if (pokemon.fainted || pokemon.illusion || pokemon.volatiles['substitute']) {
				return false;
			}
		} else if (!baseTemplate || !baseTemplate.abilities) {
			baseTemplate = selfB.getTemplate(baseTemplate);
		}
		if (!baseTemplate.abilities || pokemon && pokemon.transformed) {
			return false;
		}
		selfP.transformed = true;
		selfP.template = baseTemplate;
		selfP.baseStats = selfP.template.baseStats;
		selfP.types = baseTemplate.types;
		if (pokemon) {
			selfP.ability = pokemon.ability;
			selfP.set = pokemon.set;
			selfP.moveset = [];
			selfP.moves = [];
			for (var i=0; i<pokemon.moveset.length; i++) {
				var moveData = pokemon.moveset[i];
				var moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power '+selfP.hpType;
				}
				selfP.moveset.push({
					move: moveName,
					id: moveData.id,
					pp: 5,
					maxpp: 5,
					target: moveData.target,
					disabled: false
				});
				selfP.moves.push(toId(moveName));
			}
			for (var j in pokemon.baseBoosts) {
				selfP.baseBoosts[j] = pokemon.baseBoosts[j];
			}
		}
		selfP.update();
		return true;
	};
	this.clearVolatile = function(init) {
		selfP.baseBoosts = {
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
		for (var i=0; i<this.baseMoveset.length; i++) {
			this.moveset.push(this.baseMoveset[i]);
			this.moves.push(toId(this.baseMoveset[i].move));
		}
		selfP.transformed = false;
		selfP.ability = selfP.baseAbility;
		selfP.template = selfP.baseTemplate;
		selfP.baseStats = selfP.template.baseStats;
		selfP.types = selfP.template.types;
		for (var i in selfP.volatiles) {
			if (selfP.volatiles[i].linkedStatus) {
				selfP.volatiles[i].linkedPokemon.removeVolatile(selfP.volatiles[i].linkedStatus);
			}
		}
		selfP.volatiles = {};
		selfP.switchFlag = false;
		selfP.lastMove = '';
		selfP.lastDamage = 0;
		selfP.lastAttackedBy = null;
		selfP.movedThisTurn = false;
		selfP.newlySwitched = true;
		selfP.beingCalledBack = false;
		selfP.update(init);
	};

	this.hasType = function (type) {
		if (!type) return false;
		if (Array.isArray(type)) {
			for (var i=0; i<type.length; i++) {
				if (selfP.hasType(type[i])) return true;
			}
		} else {
			if (selfP.types[0] === type) return true;
			if (selfP.types[1] === type) return true;
		}
		return false;
	};
	// returns the amount of damage actually dealt
	this.faint = function(source, effect) {
		if (selfP.fainted) return 0;
		var d = selfP.hp;
		selfP.hp = 0;
		selfP.switchFlag = false;
		selfP.status = 'fnt';
		//selfP.fainted = true;
		selfB.faintQueue.push({
			target: selfP,
			source: source,
			effect: effect
		});
		return d;
	};
	this.damage = function(d, source, effect) {
		if (!selfP.hp) return 0;
		if (d < 1 && d > 0) d = 1;
		d = Math.floor(d);
		if (isNaN(d)) return 0;
		if (d <= 0) return 0;
		selfP.hp -= d;
		if (selfP.hp <= 0) {
			d += selfP.hp;
			selfP.faint(source, effect);
		}
		return d;
	};
	this.hasMove = function(moveid) {
		moveid = toId(moveid);
		if (moveid.substr(0,11) === 'hiddenpower') moveid = 'hiddenpower';
		for (var i=0; i<selfP.moveset.length; i++) {
			if (moveid === selfB.getMove(selfP.moveset[i].move).id) {
				return moveid;
			}
		}
		return false;
	};
	this.canUseMove = function(moveid) {
		moveid = toId(moveid);
		if (moveid.substr(0,11) === 'hiddenpower') moveid = 'hiddenpower';
		if (!selfP.hasMove(moveid)) return false;
		if (selfP.disabledMoves[moveid]) return false;
		var moveData = selfP.getMoveData(moveid);
		if (!moveData || !moveData.pp || moveData.disabled) return false;
		return true;
	};
	this.getValidMoves = function() {
		var pMoves = selfP.getMoves();
		var moves = [];
		for (var i=0; i<pMoves.length; i++) {
			if (!pMoves[i].disabled) {
				moves.push(pMoves[i].move);
			}
		}
		if (!moves.length) return ['Struggle'];
		return moves;
	};
	// returns the amount of damage actually healed
	this.heal = function(d) {
		if (!selfP.hp) return 0;
		d = Math.floor(d);
		if (isNaN(d)) return 0;
		if (d <= 0) return 0;
		if (selfP.hp >= selfP.maxhp) return 0;
		selfP.hp += d;
		if (selfP.hp > selfP.maxhp) {
			d -= selfP.hp - selfP.maxhp;
			selfP.hp = selfP.maxhp;
		}
		return d;
	};
	// sets HP, returns delta
	this.sethp = function(d) {
		if (!selfP.hp) return 0;
		d = Math.floor(d);
		if (isNaN(d)) return;
		if (d < 1) d = 1;
		d = d-selfP.hp;
		selfP.hp += d;
		if (selfP.hp > selfP.maxhp) {
			d -= selfP.hp - selfP.maxhp;
			selfP.hp = selfP.maxhp;
		}
		return d;
	};
	this.trySetStatus = function(status, source, sourceEffect) {
		if (!selfP.hp) return false;
		if (selfP.status) return false;
		return selfP.setStatus(status, source, sourceEffect);
	};
	this.cureStatus = function() {
		if (!selfP.hp) return false;
		// unlike clearStatus, gives cure message
		if (selfP.status) {
			selfB.add('-curestatus', selfP, selfP.status);
			selfP.setStatus('');
		}
	};
	this.setStatus = function(status, source, sourceEffect, ignoreImmunities) {
		if (!selfP.hp) return false;
		status = selfB.getEffect(status);
		if (selfB.event) {
			if (!source) source = selfB.event.source;
			if (!sourceEffect) sourceEffect = selfB.effect;
		}

		if (!ignoreImmunities && status.id) {
			// the game currently never ignores immunities
			if (!selfP.runImmunity(status.id==='tox'?'psn':status.id)) {
				selfB.debug('immune to status');
				return false;
			}
		}

		if (selfP.status === status.id) return false;
		var prevStatus = selfP.status;
		var prevStatusData = selfP.statusData;
		if (status.id && !selfB.runEvent('SetStatus', selfP, source, sourceEffect, status)) {
			selfB.debug('set status ['+status.id+'] interrupted');
			return false;
		}

		selfP.status = status.id;
		selfP.statusData = {id: status.id, target: selfP};
		if (source) selfP.statusData.source = source;
		if (status.duration) {
			selfP.statusData.duration = status.duration;
		}
		if (status.durationCallback) {
			selfP.statusData.duration = status.durationCallback.call(selfB, selfP, source, sourceEffect);
		}

		if (status.id && !selfB.singleEvent('Start', status, selfP.statusData, selfP, source, sourceEffect)) {
			selfB.debug('status start ['+status.id+'] interrupted');
			// cancel the setstatus
			selfP.status = prevStatus;
			selfP.statusData = prevStatusData;
			return false;
		}
		selfP.update();
		if (status.id && !selfB.runEvent('AfterSetStatus', selfP, source, sourceEffect, status)) {
			return false;
		}
		return true;
	};
	this.clearStatus = function() {
		// unlike cureStatus, does not give cure message
		return selfP.setStatus('');
	};
	this.getStatus = function() {
		return selfB.getEffect(selfP.status);
	};
	this.eatItem = function(source, sourceEffect) {
		if (!selfP.hp || !selfP.isActive) return false;
		if (!selfP.item) return false;
		if (!sourceEffect && selfB.effect) sourceEffect = selfB.effect;
		if (!source && selfB.event && selfB.event.target) source = selfB.event.target;
		var item = selfP.getItem();
		if (selfB.runEvent('UseItem', selfP, null, null, item) && selfB.runEvent('EatItem', selfP, null, null, item)) {
			selfB.add('-enditem', selfP, item, '[eat]');

			selfB.singleEvent('Eat', item, selfP.itemData, selfP, source, sourceEffect);

			selfP.lastItem = selfP.item;
			selfP.item = '';
			selfP.itemData = {id: '', target: selfP};
			selfP.usedItemThisTurn = true;
			return true;
		}
		return false;
	};
	this.useItem = function(source, sourceEffect) {
		if (!selfP.isActive) return false;
		if (!selfP.item) return false;
		if (!sourceEffect && selfB.effect) sourceEffect = selfB.effect;
		if (!source && selfB.event && selfB.event.target) source = selfB.event.target;
		var item = selfP.getItem();
		if (selfB.runEvent('UseItem', selfP, null, null, item)) {
			switch (item.id) {
			case 'redcard':
				selfB.add('-enditem', selfP, item, '[of] '+source);
				break;
			default:
				if (!item.isGem) {
					selfB.add('-enditem', selfP, item);
				}
				break;
			}

			selfB.singleEvent('Use', item, selfP.itemData, selfP, source, sourceEffect);

			selfP.lastItem = selfP.item;
			selfP.item = '';
			selfP.itemData = {id: '', target: selfP};
			selfP.usedItemThisTurn = true;
			return true;
		}
		return false;
	};
	this.takeItem = function(source) {
		if (!selfP.hp || !selfP.isActive) return false;
		if (!selfP.item) return false;
		if (!source) source = selfP;
		var item = selfP.getItem();
		if (selfB.runEvent('TakeItem', selfP, source, null, item)) {
			selfP.lastItem = '';
			selfP.item = '';
			selfP.itemData = {id: '', target: selfP};
			return item;
		}
		return false;
	};
	this.setItem = function(item, source, effect) {
		if (!selfP.hp || !selfP.isActive) return false;
		item = selfB.getItem(item);
		selfP.lastItem = selfP.item;
		selfP.item = item.id;
		selfP.itemData = {id: item.id, target: selfP};
		if (item.id) {
			selfB.singleEvent('Start', item, selfP.itemData, selfP, source, effect);
		}
		if (selfP.lastItem) selfP.usedItemThisTurn = true;
		return true;
	};
	this.getItem = function() {
		return selfB.getItem(selfP.item);
	};
	this.clearItem = function() {
		return selfP.setItem('');
	};
	this.setAbility = function(ability, source, effect) {
		if (!selfP.hp) return false;
		ability = selfB.getAbility(ability);
		if (selfP.ability === ability.id) {
			return false;
		}
		if (ability.id === 'Multitype' || ability.id === 'Illusion' || selfP.ability === 'Multitype') {
			return false;
		}
		selfP.ability = ability.id;
		selfP.abilityData = {id: ability.id, target: selfP};
		if (ability.id) {
			selfB.singleEvent('Start', ability, selfP.abilityData, selfP, source, effect);
		}
		return true;
	};
	this.getAbility = function() {
		return selfB.getAbility(selfP.ability);
	};
	this.clearAbility = function() {
		return selfP.setAbility('');
	};
	this.getNature = function() {
		return selfB.getNature(selfP.set.nature);
	};
	this.addVolatile = function(status, source, sourceEffect) {
		if (!selfP.hp) return false;
		status = selfB.getEffect(status);
		if (selfB.event) {
			if (!source) source = selfB.event.source;
			if (!sourceEffect) sourceEffect = selfB.effect;
		}

		if (selfP.volatiles[status.id]) {
			selfB.singleEvent('Restart', status, selfP.volatiles[status.id], selfP, source, sourceEffect);
			return false;
		}
		if (!selfP.runImmunity(status.id)) return false;
		var result = selfB.runEvent('TryAddVolatile', selfP, source, sourceEffect, status);
		if (!result) {
			selfB.debug('add volatile ['+status.id+'] interrupted');
			return result;
		}
		selfP.volatiles[status.id] = {id: status.id};
		selfP.volatiles[status.id].target = selfP;
		if (source) {
			selfP.volatiles[status.id].source = source;
			selfP.volatiles[status.id].sourcePosition = source.position;
		}
		if (sourceEffect) {
			selfP.volatiles[status.id].sourceEffect = sourceEffect;
		}
		if (status.duration) {
			selfP.volatiles[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			selfP.volatiles[status.id].duration = status.durationCallback.call(selfB, selfP, source, sourceEffect);
		}
		if (!selfB.singleEvent('Start', status, selfP.volatiles[status.id], selfP, source, sourceEffect)) {
			// cancel
			delete selfP.volatiles[status.id];
			return false;
		}
		selfP.update();
		return true;
	};
	this.getVolatile = function(status) {
		status = selfB.getEffect(status);
		if (!selfP.volatiles[status.id]) return null;
		return status;
	};
	this.removeVolatile = function(status) {
		if (!selfP.hp) return false;
		status = selfB.getEffect(status);
		if (!selfP.volatiles[status.id]) return false;
		selfB.singleEvent('End', status, selfP.volatiles[status.id], selfP);
		delete selfP.volatiles[status.id];
		selfP.update();
		return true;
	};
	this.hpPercent = function(d) {
		//return Math.floor(Math.floor(d*48/selfP.maxhp + 0.5)*100/48);
		return Math.floor(d*100/selfP.maxhp + 0.5);
	};
	this.getHealth = function(realHp) {
		if (selfP.fainted) return ' (0 fnt)';
		//var hpp = Math.floor(48*selfP.hp/selfP.maxhp) || 1;
		var hpstring;
		if (realHp) {
			hpstring = ''+selfP.hp+'/'+selfP.maxhp;
		} else {
			var hpp = Math.floor(selfP.hp*100/selfP.maxhp + 0.5) || 1;
			if (!selfP.hp) hpp = 0;
			hpstring = ''+hpp+'/100';
		}
		var status = '';
		if (selfP.status) status = ' '+selfP.status;
		return ' ('+hpstring+status+')';
	};
	this.hpChange = function(d) {
		return ''+selfP.hpPercent(d)+selfP.getHealth();
	};
	this.runImmunity = function(type, message) {
		if (selfP.fainted) {
			return false;
		}
		if (!type || type === '???') {
			return true;
		}
		if (selfP.negateImmunity[type]) return true;
		if (!selfP.negateImmunity['Type'] && !selfB.getImmunity(type, selfP)) {
			selfB.debug('natural immunity');
			if (message) {
				selfB.add('-immune', selfP, '[msg]');
			}
			return false;
		}
		var immunity = selfB.runEvent('Immunity', selfP, null, null, type);
		if (!immunity) {
			selfB.debug('artificial immunity');
			if (message && immunity !== null) {
				selfB.add('-immune', selfP, '[msg]');
			}
			return false;
		}
		return true;
	};
	this.destroy = function() {
		// deallocate ourself

		// get rid of some possibly-circular references
		side = null;
		selfB = null;
		selfS = null;
		selfP.side = null;

		selfP = null;
	};

	selfP.clearVolatile(true);
}

function BattleSide(name, battle, n, team) {
	var selfB = battle;
	var selfS = this;

	this.battle = battle;
	this.n = n;
	this.name = name;
	this.isActive = false;
	this.pokemon = [];
	this.pokemonLeft = 0;
	this.active = [null];
	this.decision = null;
	this.ackRequest = -1;
	this.foe = null;
	this.sideConditions = {};

	this.id = (n?'p2':'p1');

	switch (battle.gameType) {
	case 'doubles':
		this.active = [null, null];
		break;
	}

	this.team = selfB.getTeam(this, team);
	for (var i=0; i<this.team.length && i<6; i++) {
		//console.log("NEW POKEMON: "+(this.team[i]?this.team[i].name:'[unidentified]'));
		this.pokemon.push(new BattlePokemon(this.team[i], this));
	}
	this.pokemonLeft = this.pokemon.length;
	for (var i=0; i<this.pokemon.length; i++) {
		this.pokemon[i].position = i;
	}

	this.toString = function() {
		return selfS.id+': '+selfS.name;
	};

	this.getData = function() {
		var data = {
			name: selfS.name,
			pokemon: []
		};
		for (var i=0; i<selfS.pokemon.length; i++) {
			var pokemon = selfS.pokemon[i];
			data.pokemon.push({
				ident: pokemon.fullname,
				details: pokemon.details,
				condition: pokemon.getHealth(true),
				active: (pokemon.position < pokemon.side.active.length),
				moves: pokemon.moves.map(function(move) {
					if (move === 'hiddenpower') {
						return move + toId(pokemon.hpType) + (pokemon.hpPower == 70?'':pokemon.hpPower);
					}
					return move;
				}),
				baseAbility: pokemon.baseAbility,
				item: pokemon.item
			});
		}
		return data;
	};

	this.randomActive = function() {
		var actives = selfS.active.filter(function(active) {
			return active && !active.fainted;
		});
		if (!actives.length) return null;
		var i = Math.floor(Math.random() * actives.length);
		return actives[i];
	};

	this.addSideCondition = function(status, source, sourceEffect) {
		status = selfB.getEffect(status);
		if (selfS.sideConditions[status.id]) {
			selfB.singleEvent('Restart', status, selfS.sideConditions[status.id], selfS, source, sourceEffect);
			return false;
		}
		selfS.sideConditions[status.id] = {id: status.id};
		selfS.sideConditions[status.id].target = selfS;
		if (source) {
			selfS.sideConditions[status.id].source = source;
			selfS.sideConditions[status.id].sourcePosition = source.position;
		}
		if (status.duration) {
			selfS.sideConditions[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			selfS.sideConditions[status.id].duration = status.durationCallback.call(selfB, selfS, source, sourceEffect);
		}
		if (!selfB.singleEvent('Start', status, selfS.sideConditions[status.id], selfS, source, sourceEffect)) {
			delete selfS.sideConditions[status.id];
			return false;
		}
		selfB.update();
		return true;
	};
	this.getSideCondition = function(status) {
		status = selfB.getEffect(status);
		if (!selfS.sideConditions[status.id]) return null;
		return status;
	};
	this.removeSideCondition = function(status) {
		status = selfB.getEffect(status);
		if (!selfS.sideConditions[status.id]) return false;
		selfB.singleEvent('End', status, selfS.sideConditions[status.id], selfS);
		delete selfS.sideConditions[status.id];
		selfB.update();
		return true;
	};
	this.emitUpdate = function(update) {
		update.room = selfB.id;
		selfB.send('request', this.id+"\n"+selfB.rqid+"\n"+JSON.stringify(update));
	};
	this.destroy = function() {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (var i=0; i<selfS.pokemon.length; i++) {
			if (selfS.pokemon[i]) selfS.pokemon[i].destroy();
			selfS.pokemon[i] = null;
		}
		selfS.pokemon = null;
		for (var i=0; i<selfS.active.length; i++) {
			selfS.active[i] = null;
		}
		selfS.active = null;

		if (selfS.decision) {
			delete selfS.decision.side;
			delete selfS.decision.pokemon;
		}
		selfS.decision = null;

		// get rid of some possibly-circular references
		selfS.battle = null;
		selfS.foe = null;
		selfB = null;

		selfS = null;
	};
} // function BattleSide

function Battle(roomid, format, rated) {
	var selfB = this;

	// merge in scripts and tools
	Tools.mod(format).install(this);
	format = Tools.getFormat(format);

	this.log = [];
	this.turn = 0;
	this.sides = [null, null];
	this.p1 = null;
	this.p2 = null;
	this.lastUpdate = 0;
	this.currentRequest = '';
	this.roomid = roomid;
	this.id = roomid;

	this.rated = rated;

	this.weather = '';
	this.weatherData = {id:''};
	this.pseudoWeather = {};

	this.format = toId(format);
	this.formatData = {id:this.format};

	this.ended = false;
	this.started = false;
	this.active = false;

	this.effect = {id:''};
	this.effectData = {id:''};
	this.event = {id:''};
	this.eventDepth = 0;

	this.toString = function() {
		return 'Battle: '+selfB.format;
	};

	this.gameType = (format.gameType || 'singles');

	// This function is designed to emulate the on-cartridge PRNG, as described in
	// http://www.smogon.com/ingame/rng/pid_iv_creation#pokemon_random_number_generator
	// Gen 5 uses a 64-bit initial seed, but the upper 32 bits are just for the IV RNG,
	// and have no relevance here.

	// This function has three different results, depending on arguments:
	// - random() returns a real number in [0,1), just like Math.random()
	// - random(n) returns an integer in [0,n)
	// - random(m,n) returns an integer in [m,n)

	// m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.

	this.seed = Math.floor(Math.random() * 0xFFFFFFFF); // use a random initial seed

	this.random = function(m, n) {
		selfB.seed = (selfB.seed * 0x41C64E6D + 0x6073) >>> 0; // truncate the result to the last 32 bits
		var result = selfB.seed >>> 16; // the first 16 bits of the seed are the random value
		m = Math.floor(m);
		n = Math.floor(n);
		return (m ? (n ? (result%(n-m))+m : result%m) : result/0x10000);
	};

	this.setWeather = function(status, source, sourceEffect) {
		status = selfB.getEffect(status);
		if (sourceEffect === undefined && selfB.effect) sourceEffect = selfB.effect;
		if (source === undefined && selfB.event && selfB.event.target) source = selfB.event.target;

		if (selfB.weather === status.id) return false;
		if (selfB.weather && !status.id) {
			var oldstatus = selfB.getWeather();
			selfB.singleEvent('End', oldstatus, selfB.weatherData, selfB);
		}
		var prevWeather = selfB.weather;
		var prevWeatherData = selfB.weatherData;
		selfB.weather = status.id;
		selfB.weatherData = {id: status.id};
		if (source) {
			selfB.weatherData.source = source;
			selfB.weatherData.sourcePosition = source.position;
		}
		if (status.duration) {
			selfB.weatherData.duration = status.duration;
		}
		if (status.durationCallback) {
			selfB.weatherData.duration = status.durationCallback.call(selfB, source, sourceEffect);
		}
		if (!selfB.singleEvent('Start', status, selfB.weatherData, selfB, source, sourceEffect)) {
			selfB.weather = prevWeather;
			selfB.weatherData = prevWeatherData;
			return false;
		}
		selfB.update();
		return true;
	};
	this.clearWeather = function() {
		return selfB.setWeather('');
	};
	this.effectiveWeather = function(target) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
		}
		if (!selfB.runEvent('TryWeather', target)) return '';
		return this.weather;
	};
	this.isWeather = function(weather, target) {
		var ourWeather = selfB.effectiveWeather(target);
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return (weather.map(toId).indexOf(ourWeather) >= 0);
	};
	this.getWeather = function() {
		return selfB.getEffect(selfB.weather);
	};
	this.getFormat = function() {
		return selfB.getEffect(selfB.format);
	};
	this.addPseudoWeather = function(status, source, sourceEffect) {
		status = selfB.getEffect(status);
		if (selfB.pseudoWeather[status.id]) {
			selfB.singleEvent('Restart', status, selfB.pseudoWeather[status.id], selfB, source, sourceEffect);
			return false;
		}
		selfB.pseudoWeather[status.id] = {id: status.id};
		if (source) {
			selfB.pseudoWeather[status.id].source = source;
			selfB.pseudoWeather[status.id].sourcePosition = source.position;
		}
		if (status.duration) {
			selfB.pseudoWeather[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			selfB.pseudoWeather[status.id].duration = status.durationCallback.call(selfB, source, sourceEffect);
		}
		if (!selfB.singleEvent('Start', status, selfB.pseudoWeather[status.id], selfB, source, sourceEffect)) {
			delete selfB.pseudoWeather[status.id];
			return false;
		}
		selfB.update();
		return true;
	};
	this.getPseudoWeather = function(status) {
		status = selfB.getEffect(status);
		if (!selfB.pseudoWeather[status.id]) return null;
		return status;
	};
	this.removePseudoWeather = function(status) {
		status = selfB.getEffect(status);
		if (!selfB.pseudoWeather[status.id]) return false;
		selfB.singleEvent('End', status, selfB.pseudoWeather[status.id], selfB);
		delete selfB.pseudoWeather[status.id];
		selfB.update();
		return true;
	};
	this.lastMove = '';
	this.activeMove = null;
	this.activePokemon = null;
	this.activeTarget = null;
	this.setActiveMove = function(move, pokemon, target) {
		if (!move) move = null;
		if (!pokemon) pokemon = null;
		if (!target) target = pokemon;
		selfB.activeMove = move;
		selfB.activePokemon = pokemon;
		selfB.activeTarget = target;

		// Mold Breaker and the like
		selfB.update();
	};
	this.clearActiveMove = function(failed) {
		if (selfB.activeMove) {
			if (!failed) {
				selfB.lastMove = selfB.activeMove.id;
			}
			selfB.activeMove = null;
			selfB.activePokemon = null;
			selfB.activeTarget = null;

			// Mold Breaker and the like, again
			selfB.update();
		}
	};

	this.update = function() {
		var actives = selfB.p1.active;
		for (var i=0; i<actives.length; i++) {
			if (actives[i]) actives[i].update();
		}
		actives = selfB.p2.active;
		for (var i=0; i<actives.length; i++) {
			if (actives[i]) actives[i].update();
		}
	};

	// bubbles up
	this.comparePriority = function(a, b) {
		a.priority = a.priority || 0;
		a.subPriority = a.subPriority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subPriority = b.subPriority || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -(1);
			}
			if (typeof b.order !== 'number') {
				return -(-1);
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
		return Math.random()-0.5;
	};
	this.getResidualStatuses = function(thing, callbackType) {
		var statuses = selfB.getRelevantEffectsInner(thing || selfB, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(selfB.comparePriority);
		//if (statuses[0]) selfB.debug('match '+(callbackType||'residualCallback')+': '+statuses[0].status.id);
		return statuses;
	};
	this.eachEvent = function(eventid, effect, relayVar) {
		var actives = [];
		if (!effect && selfB.effect) effect = selfB.effect;
		for (var i=0; i<selfB.sides.length;i++) {
			var side = selfB.sides[i];
			for (var j=0; j<side.active.length; j++) {
				if (side.active[j]) actives.push(side.active[j]);
			}
		}
		actives.sort(function(a, b) {
			if (b.speed - a.speed) {
				return b.speed - a.speed;
			}
			return Math.random()-0.5;
		});
		for (var i=0; i<actives.length; i++) {
			if (actives[i].isStarted) {
				selfB.runEvent(eventid, actives[i], null, effect, relayVar);
			}
		}
	};
	this.residualEvent = function(eventid, relayVar) {
		var statuses = selfB.getRelevantEffectsInner(selfB, 'on'+eventid, null, null, false, true, 'duration');
		statuses.sort(selfB.comparePriority);
		while (statuses.length) {
			var statusObj = statuses.shift();
			var status = statusObj.status;
			if (statusObj.thing.fainted) continue;
			if (statusObj.statusData && statusObj.statusData.duration) {
				statusObj.statusData.duration--;
				if (!statusObj.statusData.duration) {
					statusObj.end(status.id);
					continue;
				}
			}
			selfB.singleEvent(eventid, status, statusObj.statusData, statusObj.thing, relayVar);
		}
	};
	// The entire event system revolves around this function
	// (and its helper functions, getRelevant*)
	this.singleEvent = function(eventid, effect, effectData, target, source, sourceEffect, relayVar) {
		if (selfB.eventDepth >= 5) {
			// oh fuck
			this.add('message STACK LIMIT EXCEEDED');
			this.add('message PLEASE TELL AESOFT');
			this.add('message Event: '+eventid);
			this.add('message Parent event: '+selfB.event.id);
			return false;
		}
		//this.add('Event: '+eventid+' (depth '+selfB.eventDepth+')');
		effect = selfB.getEffect(effect);

		if (target.fainted) {
			return false;
		}
		if (effect.effectType === 'Status' && target.status !== effect.id) {
			// it's changed; call it off
			return true;
		}
		if (target.ignore && target.ignore[effect.effectType]) {
			selfB.debug(eventid+' handler suppressed by Klutz or Magic Room');
			return true;
		}
		if (target.ignore && target.ignore[effect.effectType+'Target']) {
			selfB.debug(eventid+' handler suppressed by Air Lock');
			return true;
		}

		if (typeof effect['on'+eventid] === 'undefined') return true;
		var parentEffect = selfB.effect;
		var parentEffectData = selfB.effectData;
		var parentEvent = selfB.event;
		selfB.effect = effect;
		selfB.effectData = effectData;
		selfB.event = {id: eventid, target: target, source: source, effect: sourceEffect};
		selfB.eventDepth++;
		var args = [target, source, sourceEffect];
		if (typeof relayVar !== 'undefined') args.unshift(relayVar);
		var returnVal = true;
		if (typeof effect['on'+eventid] === 'function') {
			returnVal = effect['on'+eventid].apply(selfB, args);
		} else {
			returnVal = effect['on'+eventid];
		}
		selfB.eventDepth--;
		selfB.effect = parentEffect;
		selfB.effectData = parentEffectData;
		selfB.event = parentEvent;
		if (typeof returnVal === 'undefined') return true;
		return returnVal;
	};
	this.runEvent = function(eventid, target, source, effect, relayVar) {
		if (selfB.eventDepth >= 5) {
			// oh fuck
			this.add('message STACK LIMIT EXCEEDED');
			this.add('message PLEASE REPORT IN BUG THREAD');
			this.add('message Event: '+eventid);
			this.add('message Parent event: '+selfB.event.id);
			return false;
		}
		if (!target) target = selfB;
		var statuses = selfB.getRelevantEffects(target, 'on'+eventid, 'onSource'+eventid, source);
		var hasRelayVar = true;
		effect = selfB.getEffect(effect);
		var args = [target, source, effect];
		//console.log('Event: '+eventid+' (depth '+selfB.eventDepth+') t:'+target.id+' s:'+(!source||source.id)+' e:'+effect.id);
		if (typeof relayVar === 'undefined' || relayVar === null) {
			relayVar = true;
			hasRelayVar = false;
		} else {
			args.unshift(relayVar);
		}
		for (var i=0; i<statuses.length; i++) {
			var status = statuses[i].status;
			var thing = statuses[i].thing;
			if (thing.fainted) continue;
			//selfB.debug('match '+eventid+': '+status.id+' '+status.effectType);
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
					TryHit: 1,
					TrySecondaryHit: 1,
					Hit: 1,
					TryFieldHit: 1,
					Boost: 1,
					DragOut: 1
				};
				if (eventid in AttackingEvents) {
					if (eventid !== 'ModifyPokemon') {
						selfB.debug(eventid+' handler suppressed by Mold Breaker');
					}
					continue;
				}
			} else if (thing.ignore && thing.ignore[status.effectType]) {
				if (eventid !== 'ModifyPokemon' && eventid !== 'Update') {
					selfB.debug(eventid+' handler suppressed by Klutz or Magic Room');
				}
				continue;
			}
			if (target.ignore && target.ignore[status.effectType+'Target']) {
				selfB.debug(eventid+' handler suppressed by Air Lock');
				continue;
			}
			var returnVal;
			if (typeof statuses[i].callback === 'function') {
				var parentEffect = selfB.effect;
				var parentEffectData = selfB.effectData;
				var parentEvent = selfB.event;
				selfB.effect = statuses[i].status;
				selfB.effectData = statuses[i].statusData;
				selfB.effectData.target = thing;
				selfB.event = {id: eventid, target: target, source: source, effect: effect};
				selfB.eventDepth++;
				returnVal = statuses[i].callback.apply(selfB, args);
				selfB.eventDepth--;
				selfB.effect = parentEffect;
				selfB.effectData = parentEffectData;
				selfB.event = parentEvent;
			} else {
				returnVal = statuses[i].callback;
			}
			if (typeof returnVal !== 'undefined') {
				relayVar = returnVal;
				if (!relayVar) return relayVar;
				if (hasRelayVar) {
					args[0] = relayVar;
				}
			}
		}
		return relayVar;
	};
	this.resolveLastPriority = function(statuses, callbackType) {
		var order = false;
		var priority = 0;
		var subOrder = 0;
		var status = statuses[statuses.length-1];
		if (status.status[callbackType+'Order']) {
			order = status.status[callbackType+'Order'];
		}
		if (status.status[callbackType+'Priority']) {
			priority = status.status[callbackType+'Priority'];
		} else if (status.status[callbackType+'SubOrder']) {
			subOrder = status.status[callbackType+'SubOrder'];
		}

		status.order = order;
		status.priority = priority;
		status.subOrder = subOrder;
		if (status.thing && status.thing.getStat) status.speed = status.thing.speed;
	};
	// bubbles up to parents
	this.getRelevantEffects = function(thing, callbackType, foeCallbackType, foeThing, checkChildren) {
		var statuses = selfB.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		statuses.sort(selfB.comparePriority);
		//if (statuses[0]) selfB.debug('match '+callbackType+': '+statuses[0].status.id);
		return statuses;
	};
	this.getRelevantEffectsInner = function(thing, callbackType, foeCallbackType, foeThing, bubbleUp, bubbleDown, getAll) {
		if (!callbackType || !thing) return [];
		var statuses = [];
		var status;

		if (thing.sides) {
			for (var i in selfB.pseudoWeather) {
				status = selfB.getPseudoWeather(i);
				if (typeof status[callbackType] !== 'undefined' || (getAll && thing.pseudoWeather[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: selfB.pseudoWeather[i], end: selfB.removePseudoWeather, thing: thing});
					selfB.resolveLastPriority(statuses,callbackType);
				}
			}
			status = selfB.getWeather();
			if (typeof status[callbackType] !== 'undefined' || (getAll && thing.weatherData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: selfB.weatherData, end: selfB.clearWeather, thing: thing, priority: status[callbackType+'Priority']||0});
				selfB.resolveLastPriority(statuses,callbackType);
			}
			status = selfB.getFormat();
			if (typeof status[callbackType] !== 'undefined' || (getAll && thing.formatData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: selfB.formatData, end: function(){}, thing: thing, priority: status[callbackType+'Priority']||0});
				selfB.resolveLastPriority(statuses,callbackType);
			}
			if (bubbleDown) {
				statuses = statuses.concat(selfB.getRelevantEffectsInner(selfB.p1, callbackType,null,null,false,true, getAll));
				statuses = statuses.concat(selfB.getRelevantEffectsInner(selfB.p2, callbackType,null,null,false,true, getAll));
			}
			return statuses;
		}

		if (thing.pokemon) {
			for (var i in thing.sideConditions) {
				status = thing.getSideCondition(i);
				if (typeof status[callbackType] !== 'undefined' || (getAll && thing.sideConditions[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: thing.sideConditions[i], end: thing.removeSideCondition, thing: thing});
					selfB.resolveLastPriority(statuses,callbackType);
				}
			}
			if (foeCallbackType) {
				statuses = statuses.concat(selfB.getRelevantEffectsInner(thing.foe, foeCallbackType,null,null,false,false, getAll));
			}
			if (bubbleUp) {
				statuses = statuses.concat(selfB.getRelevantEffectsInner(selfB, callbackType,null,null,true,false, getAll));
			}
			if (bubbleDown) {
				for (var i=0;i<thing.active.length;i++) {
					statuses = statuses.concat(selfB.getRelevantEffectsInner(thing.active[i], callbackType,null,null,false,true, getAll));
				}
			}
			return statuses;
		}

		if (thing.fainted) return statuses;
		if (!thing.getStatus) {
			selfB.debug(JSON.stringify(thing));
			return statuses;
		}
		var status = thing.getStatus();
		if (typeof status[callbackType] !== 'undefined' || (getAll && thing.statusData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.statusData, end: thing.clearStatus, thing: thing});
			selfB.resolveLastPriority(statuses,callbackType);
		}
		for (var i in thing.volatiles) {
			status = thing.getVolatile(i);
			if (typeof status[callbackType] !== 'undefined' || (getAll && thing.volatiles[i][getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: thing.volatiles[i], end: thing.removeVolatile, thing: thing});
				selfB.resolveLastPriority(statuses,callbackType);
			}
		}
		status = thing.getAbility();
		if (typeof status[callbackType] !== 'undefined' || (getAll && thing.abilityData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.abilityData, end: thing.clearAbility, thing: thing});
			selfB.resolveLastPriority(statuses,callbackType);
		}
		status = thing.getItem();
		if (typeof status[callbackType] !== 'undefined' || (getAll && thing.itemData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.itemData, end: thing.clearItem, thing: thing});
			selfB.resolveLastPriority(statuses,callbackType);
		}
		status = selfB.getEffect(thing.species);
		if (typeof status[callbackType] !== 'undefined') {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.speciesData, end: function(){}, thing: thing});
			selfB.resolveLastPriority(statuses,callbackType);
		}

		if (foeThing && foeCallbackType && foeCallbackType.substr(0,8) !== 'onSource') {
			statuses = statuses.concat(selfB.getRelevantEffectsInner(foeThing, foeCallbackType,null,null,false,false, getAll));
		} else if (foeCallbackType) {
			var foeActive = thing.side.foe.active;
			var allyActive = thing.side.active;
			var eventName = '';
			if (foeCallbackType.substr(0,8) === 'onSource') {
				eventName = foeCallbackType.substr(8);
				if (foeThing) {
					statuses = statuses.concat(selfB.getRelevantEffectsInner(foeThing, foeCallbackType,null,null,false,false, getAll));
				}
				foeCallbackType = 'onFoe'+eventName;
				foeThing = null;
			}
			if (foeCallbackType.substr(0,5) === 'onFoe') {
				eventName = foeCallbackType.substr(5);
				for (var i=0; i<allyActive.length; i++) {
					statuses = statuses.concat(selfB.getRelevantEffectsInner(allyActive[i], 'onAlly'+eventName,null,null,false,false, getAll));
					statuses = statuses.concat(selfB.getRelevantEffectsInner(allyActive[i], 'onAny'+eventName,null,null,false,false, getAll));
				}
				for (var i=0; i<foeActive.length; i++) {
					statuses = statuses.concat(selfB.getRelevantEffectsInner(foeActive[i], 'onAny'+eventName,null,null,false,false, getAll));
				}
			}
			for (var i=0; i<foeActive.length; i++) {
				statuses = statuses.concat(selfB.getRelevantEffectsInner(foeActive[i], foeCallbackType,null,null,false,false, getAll));
			}
		}
		if (bubbleUp) {
			statuses = statuses.concat(selfB.getRelevantEffectsInner(thing.side, callbackType, foeCallbackType, null, true, false, getAll));
		}
		return statuses;
	};
	this.getPokemon = function(id) {
		if (typeof id !== 'string') id = id.id;
		for (var i=0; i<selfB.p1.pokemon.length; i++) {
			var pokemon = selfB.p1.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		for (var i=0; i<selfB.p2.pokemon.length; i++) {
			var pokemon = selfB.p2.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		return null;
	};
	this.makeRequest = function(type, requestDetails) {
		if (!selfB.p1.isActive || !selfB.p2.isActive) {
			return;
		}
		if (type) {
			selfB.currentRequest = type;
			selfB.rqid++;
			selfB.p1.decision = null;
			selfB.p2.decision = null;
		} else {
			type = selfB.currentRequest;
		}
		selfB.update();

		// default to no request
		var p1request = null;
		var p2request = null;
		selfB.p1.currentRequest = '';
		selfB.p2.currentRequest = '';

		switch (type) {
		case 'switch':
			var switchablesLeft = 0;
			var switchTable = null;
			function canSwitch(a) {
				return !a.fainted;
			}
			function shouldSwitch(a) {
				if (!a) return false;
				if (!switchablesLeft) {
					a.switchFlag = false;
					return false;
				}
				if (a.switchFlag) switchablesLeft--;
				return !!a.switchFlag;
			}

			switchablesLeft = selfB.p1.pokemon.slice(selfB.p1.active.length).count(canSwitch);
			switchTable = selfB.p1.active.map(shouldSwitch);
			if (switchTable.any(true)) {
				selfB.p1.currentRequest = 'switch';
				p1request = {forceSwitch: switchTable, side: selfB.p1.getData(), rqid: selfB.rqid};
			}
			switchablesLeft = selfB.p2.pokemon.slice(selfB.p2.active.length).count(canSwitch);
			switchTable = selfB.p2.active.map(shouldSwitch);
			if (switchTable.any(true)) {
				selfB.p2.currentRequest = 'switch';
				p2request = {forceSwitch: switchTable, side: selfB.p2.getData(), rqid: selfB.rqid};
			}
			break;

		case 'teampreview':
			selfB.add('teampreview'+(requestDetails?'|'+requestDetails:''));
			selfB.p1.currentRequest = 'teampreview';
			p1request = {teamPreview: true, side: selfB.p1.getData(), rqid: selfB.rqid};
			selfB.p2.currentRequest = 'teampreview';
			p2request = {teamPreview: true, side: selfB.p2.getData(), rqid: selfB.rqid};
			break;

		default:
			var activeData;
			selfB.p1.currentRequest = 'move';
			activeData = selfB.p1.active.map(function(pokemon) {
				if (pokemon) return pokemon.getRequestData();
			});
			p1request = {active: activeData, side: selfB.p1.getData(), rqid: selfB.rqid};

			selfB.p2.currentRequest = 'move';
			activeData = selfB.p2.active.map(function(pokemon) {
				if (pokemon) return pokemon.getRequestData();
			});
			p2request = {active: activeData, side: selfB.p2.getData(), rqid: selfB.rqid};
			break;
		}

		if (selfB.p1 && selfB.p2) {
			var inactiveSide = -1;
			if (p1request && !p2request) {
				inactiveSide = 0;
			} else if (!p1request && p2request) {
				inactiveSide = 1;
			}
			if (inactiveSide !== selfB.inactiveSide) {
				this.send('inactiveside', inactiveSide);
				selfB.inactiveSide = inactiveSide;
			}
		}

		if (p1request) {
			selfB.p1.emitUpdate({
				side: 'p1',
				request: p1request
			});
		} else {
			selfB.p1.decision = true;
			selfB.p1.emitUpdate({request: {wait: true}});
		}

		if (p2request) {
			selfB.p2.emitUpdate({
				side: 'p2',
				request: p2request
			});
		} else {
			selfB.p2.decision = true;
			selfB.p2.emitUpdate({request: {wait: true}});
		}

		if (selfB.p2.decision && selfB.p1.decision) {
			if (type !== 'move') {
				selfB.add('message Attempting to recover from crash.');
				selfB.makeRequest('move');
				return;
			}
			selfB.add('message BATTLE CRASHED.');

			selfB.win();
			return;
		}

		selfB.add('callback', 'decision');
	};
	this.tie = function() {
		selfB.win();
	};
	this.win = function(side) {
		var winSide = false;
		if (selfB.ended) {
			return false;
		}
		if (side === 'p1' || side === 'p2') {
			side = selfB[side];
		} else if (side !== selfB.p1 && side !== selfB.p2) {
			side = null;
		}
		selfB.winner = side?side.name:'';

		selfB.add('');
		if (side) {
			selfB.add('win', side.name);
		} else {
			selfB.add('tie');
		}
		selfB.ended = true;
		selfB.active = false;
		selfB.currentRequest = '';
		return true;
	};
	this.switchIn = function(pokemon, pos) {
		if (!pokemon || pokemon.isActive) return false;
		if (!pos) pos = 0;
		var side = pokemon.side;
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			var lastMove = null;
			lastMove = selfB.getMove(oldActive.lastMove);
			if (oldActive.switchCopyFlag === 'copyvolatile') {
				delete oldActive.switchCopyFlag;
				pokemon.copyVolatileFrom(oldActive);
			}
		}
		selfB.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		selfB.add('switch', side.active[pos], side.active[pos].getDetails());
		pokemon.update();
		selfB.runEvent('SwitchIn', pokemon);
		selfB.addQueue({pokemon: pokemon, choice: 'runSwitch'});
	};
	this.canSwitch = function(side) {
		var canSwitchIn = [];
		for (var i=side.active.length; i<side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	};
	this.getRandomSwitchable = function(side) {
		var canSwitchIn = [];
		for (var i=side.active.length; i<side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		if (!canSwitchIn.length) {
			return null;
		}
		return canSwitchIn[Math.floor(Math.random()*canSwitchIn.length)];
	};
	this.dragIn = function(side, pos) {
		var pokemon = selfB.getRandomSwitchable(side);
		if (!pos) pos = 0;
		if (!pokemon || pokemon.isActive) return false;
		selfB.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			var oldActive = side.active[pos];
			if (!oldActive.hp) {
				return false;
			}
			if (!selfB.runEvent('DragOut', oldActive)) {
				return false;
			}
			selfB.runEvent('SwitchOut', oldActive);
			oldActive.isActive = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		selfB.add('drag', side.active[pos], side.active[pos].getDetails());
		pokemon.update();
		selfB.runEvent('SwitchIn', pokemon);
		selfB.addQueue({pokemon: pokemon, choice: 'runSwitch'});
		return true;
	};
	this.faint = function(pokemon, source, effect) {
		pokemon.faint(source, effect);
	};
	this.nextTurn = function() {
		selfB.turn++;
		for (var i=0; i<selfB.sides.length; i++) {
			for (var j=0; j<selfB.sides[i].active.length; j++) {
				var pokemon = selfB.sides[i].active[j];
				if (!pokemon) continue;
				pokemon.movedThisTurn = false;
				pokemon.usedItemThisTurn = false;
				pokemon.newlySwitched = false;
				if (pokemon.lastAttackedBy) {
					pokemon.lastAttackedBy.thisTurn = false;
				}
				pokemon.activeTurns++;
			}
		}
		selfB.add('turn', selfB.turn);
		selfB.makeRequest('move');
	};
	this.midTurn = false;
	this.start = function() {
		if (selfB.active) return;

		if (!selfB.p1 || !selfB.p1.isActive || !selfB.p2 || !selfB.p2.isActive) {
			// need two players to start
			return;
		}

		selfB.p2.emitUpdate({midBattle: selfB.started, side: 'p2', sideData: selfB.p2.getData()});
		selfB.p1.emitUpdate({midBattle: selfB.started, side: 'p1', sideData: selfB.p1.getData()});

		if (selfB.started) {
			selfB.makeRequest();
			selfB.isActive = true;
			selfB.activeTurns = 0;
			return;
		}
		selfB.isActive = true;
		selfB.activeTurns = 0;
		selfB.started = true;
		selfB.p2.foe = selfB.p1;
		selfB.p1.foe = selfB.p2;

		selfB.add('gametype', selfB.gameType);

		var format = selfB.getFormat();
		selfB.add('tier', format.name);
		if (selfB.rated) {
			selfB.add('rated');
		}
		if (format && format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				selfB.addPseudoWeather(format.ruleset[i]);
			}
		}

		if (!selfB.p1.pokemon[0] || !selfB.p2.pokemon[0]) {
			selfB.add('message Battle not started: One of you has an empty team.');
			return;
		}

		selfB.residualEvent('TeamPreview');

		selfB.addQueue({choice:'start'});
		selfB.midTurn = true;
		if (!selfB.currentRequest) selfB.go();
	};
	this.boost = function(boost, target, source, effect) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
			if (!source) source = selfB.event.source;
			if (!effect) effect = selfB.effect;
		}
		if (!target || !target.hp) return 0;
		effect = selfB.getEffect(effect);
		boost = selfB.runEvent('Boost', target, source, effect, Object.clone(boost));
		for (var i in boost) {
			var currentBoost = {};
			currentBoost[i] = boost[i];
			if (boost[i] !== 0 && target.boostBy(currentBoost)) {
				var msg = '-boost';
				if (boost[i] < 0) {
					msg = '-unboost';
					boost[i] = -boost[i];
				}
				switch (effect.id) {
				case 'intimidate':
					selfB.add(msg, target, i, boost[i]);
					break;
				default:
					if (effect.effectType === 'Move') {
						selfB.add(msg, target, i, boost[i]);
					} else {
						selfB.add(msg, target, i, boost[i], '[from] '+effect.fullname);
					}
					break;
				}
				selfB.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			}
		}
		selfB.runEvent('AfterBoost', target, source, effect, boost);
	};
	this.damage = function(damage, target, source, effect) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
			if (!source) source = selfB.event.source;
			if (!effect) effect = selfB.effect;
		}
		if (!target || !target.hp) return 0;
		effect = selfB.getEffect(effect);
		if (!(damage || damage === 0)) return damage;
		damage = clampIntRange(damage, 1);

		if (effect.id !== 'struggle-recoil') { // Struggle recoil is not affected by effects
			if (effect.effectType === 'Weather' && !target.runImmunity(effect.id)) {
				this.debug('weather immunity');
				return 0;
			}
			damage = selfB.runEvent('Damage', target, source, effect, damage);
			if (!(damage || damage === 0)) {
				this.debug('damage event failed');
				return damage;
			}
		}
		if (damage !== 0) damage = clampIntRange(damage, 1);
		damage = target.damage(damage, source, effect);
		if (source) source.lastDamage = damage;
		var name = effect.fullname;
		if (name === 'tox') name = 'psn';
		switch (effect.id) {
		case 'partiallytrapped':
			selfB.add('-damage', target, target.hpChange(damage), '[from] '+selfB.effectData.sourceEffect.fullname, '[partiallytrapped]');
			break;
		default:
			if (effect.effectType === 'Move') {
				selfB.add('-damage', target, target.hpChange(damage));
			} else if (source && source !== target) {
				selfB.add('-damage', target, target.hpChange(damage), '[from] '+effect.fullname, '[of] '+source);
			} else {
				selfB.add('-damage', target, target.hpChange(damage), '[from] '+name);
			}
			break;
		}

		if (effect.recoil && source) {
			selfB.damage(Math.round(damage * effect.recoil[0] / effect.recoil[1]), source, target, 'recoil');
		}
		if (effect.drain && source) {
			selfB.heal(Math.ceil(damage * effect.drain[0] / effect.drain[1]), source, target, 'drain');
		}

		if (target.fainted) selfB.faint(target);
		else {
			damage = selfB.runEvent('AfterDamage', target, source, effect, damage);
			if (effect && !effect.negateSecondary) {
				selfB.runEvent('Secondary', target, source, effect);
			}
		}
		return damage;
	};
	this.directDamage = function(damage, target, source, effect) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
			if (!source) source = selfB.event.source;
			if (!effect) effect = selfB.effect;
		}
		if (!target || !target.hp) return 0;
		if (!damage) return 0;
		damage = clampIntRange(damage, 1);

		damage = target.damage(damage, source, effect);
		switch (effect.id) {
		case 'strugglerecoil':
			selfB.add('-damage', target, target.hpChange(damage), '[from] recoil');
			break;
		default:
			selfB.add('-damage', target, target.hpChange(damage));
			break;
		}
		if (target.fainted) selfB.faint(target);
		return damage;
	};
	this.heal = function(damage, target, source, effect) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
			if (!source) source = selfB.event.source;
			if (!effect) effect = selfB.effect;
		}
		effect = selfB.getEffect(effect);
		if (damage && damage <= 1) damage = 1;
		damage = Math.floor(damage);
		// for things like Liquid Ooze, the Heal event still happens when nothing is healed.
		damage = selfB.runEvent('TryHeal', target, source, effect, damage);
		if (!damage) return 0;
		if (!target || !target.hp) return 0;
		if (target.hp >= target.maxhp) return 0;
		damage = target.heal(damage, source, effect);
		switch (effect.id) {
		case 'leechseed':
		case 'rest':
			selfB.add('-heal', target, target.hpChange(damage), '[silent]');
			break;
		case 'drain':
			selfB.add('-heal', target, target.hpChange(damage), '[from] drain', '[of] '+source);
			break;
		case 'wish':
			break;
		default:
			if (effect.effectType === 'Move') {
				selfB.add('-heal', target, target.hpChange(damage));
			} else if (source && source !== target) {
				selfB.add('-heal', target, target.hpChange(damage), '[from] '+effect.fullname, '[of] '+source);
			} else {
				selfB.add('-heal', target, target.hpChange(damage), '[from] '+effect.fullname);
			}
			break;
		}
		selfB.runEvent('Heal', target, source, effect, damage);
		return damage;
	};
	this.modify = function(value, numerator, denominator) {
		// You can also use:
		// modify(value, [numerator, denominator])
		// modify(value, fraction) - assuming you trust JavaScript's floating-point handler
		if (!denominator) denominator = 1;
		if (numerator && numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		var modifier = Math.floor(numerator*4096/denominator);
		return Math.floor((value * modifier + 2048 - 1) / 4096);
	};
	this.getDamage = function(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = selfB.getMove(move);

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
			return move.damageCallback.call(selfB, pokemon, target);
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
		if (!move.category) move.category = 'Physical';
		if (!move.defensiveCategory) move.defensiveCategory = move.category;
		if (!move.type) move.type = '???';
		var type = move.type;
		// '???' is typeless damage: used for Struggle and Confusion etc

		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(selfB, pokemon, target, move);
		}
		if (!basePower) return 0;
		basePower = clampIntRange(basePower, 1);

		move.critRatio = clampIntRange(move.critRatio, 0, 5);
		var critMult = [0, 16, 8, 4, 3, 2];

		move.crit = move.willCrit || false;
		if (typeof move.willCrit === 'undefined') {
			if (move.critRatio) {
				move.crit = (selfB.random(critMult[move.critRatio]) === 0);
			}
		}
		if (move.crit) {
			move.crit = selfB.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		if (basePower) {
			basePower = selfB.runEvent('BasePower', pokemon, target, move, basePower);

			if (move.basePowerModifier) {
				basePower *= move.basePowerModifier;
			}
		}
		if (!basePower) return 0;
		basePower = clampIntRange(basePower, 1);

		var level = pokemon.level;

		var attacker = pokemon;
		var defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;

		var attack = attacker.getStat(move.category==='Physical'?'atk':'spa');
		var defense = defender.getStat(move.defensiveCategory==='Physical'?'def':'spd');

		if (move.crit) {
			move.ignoreNegativeOffensive = true;
			move.ignorePositiveDefensive = true;
		}
		if (move.ignoreNegativeOffensive && attack < attacker.getStat(move.category==='Physical'?'atk':'spa', true)) {
			move.ignoreOffensive = true;
		}
		if (move.ignoreOffensive) {
			selfB.debug('Negating (sp)atk boost/penalty.');
			attack = attacker.getStat(move.category==='Physical'?'atk':'spa', true);
		}
		if (move.ignorePositiveDefensive && defense > target.getStat(move.defensiveCategory==='Physical'?'def':'spd', true)) {
			move.ignoreDefensive = true;
		}
		if (move.ignoreDefensive) {
			selfB.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(move.defensiveCategory==='Physical'?'def':'spd', true);
		}

		//int(int(int(2*L/5+2)*A*P/D)/50);
		var baseDamage = Math.floor(Math.floor(Math.floor(2*level/5+2) * basePower * attack/defense)/50) + 2;

		// multi-target modifier (doubles only)
		// weather modifier (TODO: relocate here)
		// crit
		if (move.crit) {
			if (!suppressMessages) selfB.add('-crit', target);
			baseDamage = selfB.modify(baseDamage, move.critModifier || 2);
		}

		// randomizer
		// this is not a modifier
		// gen 1-2
		//var randFactor = Math.floor(Math.random()*39)+217;
		//baseDamage *= Math.floor(randFactor * 100 / 255) / 100;
		baseDamage = Math.floor(baseDamage * (100 - selfB.random(16)) / 100);

		// STAB
		if (type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = selfB.modify(baseDamage, move.stab || 1.5);
		}
		// types
		var totalTypeMod = selfB.getEffectiveness(type, target);
		if (totalTypeMod > 0) {
			if (!suppressMessages) selfB.add('-supereffective', target);
			baseDamage *= 2;
			if (totalTypeMod >= 2) {
				baseDamage *= 2;
			}
		}
		if (totalTypeMod < 0) {
			if (!suppressMessages) selfB.add('-resisted', target);
			baseDamage = Math.floor(baseDamage/2);
			if (totalTypeMod <= -2) {
				baseDamage = Math.floor(baseDamage/2);
			}
		}

		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		if (move.spreadHit) {
			baseDamage = selfB.modify(baseDamage, move.spreadModifier || 0.75);
		}

		return Math.floor(baseDamage);
	};
	/**
	 * Returns whether a proposed target for a move is valid.
	 */
	this.validTargetLoc = function(targetLoc, source, targetType) {
		var numSlots = source.side.active.length;
		if (!Math.abs(targetLoc) && Math.abs(targetLoc) > numSlots) return false;

		var sourceLoc = -(source.position+1);
		var isFoe = (targetLoc > 0);
		var isAdjacent = (isFoe ? Math.abs(-(numSlots+1-targetLoc)-sourceLoc)<=1 : Math.abs(targetLoc-sourceLoc)<=1);
		var isSelf = (sourceLoc === targetLoc);

		switch (targetType) {
		case 'randomNormal':
		case 'normal':
			return isAdjacent && !isSelf;
		case 'adjacentAlly':
			return isAdjacent && !isSelf && !isFoe;
		case 'adjacentAllyOrSelf':
			return isAdjacent && !isFoe;
		case 'adjacentFoe':
			return isAdjacent && isFoe;
		case 'any':
			return !isSelf;
		}
		return false;
	};
	this.validTarget = function(target, source, targetType) {
		var targetLoc;
		if (target.side == source.side) {
			targetLoc = -(target.position+1);
		} else {
			targetLoc = target.position+1;
		}
		return selfB.validTargetLoc(targetLoc, source, targetType);
	};
	this.getTarget = function(decision) {
		var move = selfB.getMove(decision.move);
		var target;
		if ((move.target !== 'randomNormal') &&
				selfB.validTargetLoc(decision.targetLoc, decision.pokemon, move.target)) {
			if (decision.targetLoc > 0) {
				target = decision.pokemon.side.foe.active[decision.targetLoc-1];
			} else {
				target = decision.pokemon.side.active[(-decision.targetLoc)-1];
			}
			if (target && !target.fainted) return target;
		}
		if (!decision.targetPosition || !decision.targetSide) {
			target = selfB.resolveTarget(decision.pokemon, decision.move);
			decision.targetSide = target.side;
			decision.targetPosition = target.position;
		}
		return decision.targetSide.active[decision.targetPosition];
	};
	this.resolveTarget = function(pokemon, move) {
		move = selfB.getMove(move);
		if (move.target === 'adjacentAlly' && pokemon.side.active.length > 1) {
			if (pokemon.side.active[pokemon.position-1]) {
				return pokemon.side.active[pokemon.position-1];
			}
			else if (pokemon.side.active[pokemon.position+1]) {
				return pokemon.side.active[pokemon.position+1];
			}
		}
		if (move.target === 'self' || move.target === 'all' || move.target === 'allySide' || move.target === 'allyTeam' || move.target === 'adjacentAlly' || move.target === 'adjacentAllyOrSelf') {
			return pokemon;
		}
		return pokemon.side.foe.randomActive() || pokemon.side.foe.active[0];
	};
	this.checkFainted = function() {
		function isFainted(a) {
			if (!a) return false;
			if (a.fainted) {
				a.switchFlag = true;
				return true;
			}
			return false;
		}
		// make sure these don't get short-circuited out; all switch flags need to be set
		var p1fainted = selfB.p1.active.map(isFainted);
		var p2fainted = selfB.p2.active.map(isFainted);
	};
	this.queue = [];
	this.faintQueue = [];
	this.currentRequest = '';
	this.rqid = 0;
	this.faintMessages = function() {
		while (selfB.faintQueue.length) {
			var faintData = selfB.faintQueue.shift();
			if (!faintData.target.fainted) {
				selfB.add('faint', faintData.target);
				selfB.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				faintData.target.fainted = true;
				faintData.target.isActive = false;
				faintData.target.isStarted = false;
				faintData.target.side.pokemonLeft--;
			}
		}
		if (!selfB.p1.pokemonLeft && !selfB.p2.pokemonLeft) {
			selfB.win();
			return true;
		}
		if (!selfB.p1.pokemonLeft) {
			selfB.win(selfB.p2);
			return true;
		}
		if (!selfB.p2.pokemonLeft) {
			selfB.win(selfB.p1);
			return true;
		}
		return false;
	};
	this.addQueue = function(decision, noSort, side) {
		if (decision) {
			if (Array.isArray(decision)) {
				for (var i=0; i<decision.length; i++) {
					selfB.addQueue(decision[i], noSort);
				}
				return;
			}
			if (decision.choice === 'pass') return;
			if (!decision.side && side) decision.side = side;
			if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.priority) {
				var priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 6,
					'runSwitch': 6.1,
					'residual': -100,
					'team': 102,
					'start': 101
				};
				if (priorities[decision.choice]) {
					decision.priority = priorities[decision.choice];
				}
			}
			if (decision.choice === 'move') {
				if (selfB.getMove(decision.move).beforeTurnCallback) {
					selfB.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move}, true);
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
					target = selfB.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = selfB.getMove(decision.move);
				if (!decision.priority) {
					var priority = decision.move.priority;
					priority = selfB.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);
					decision.priority = priority;
				}
			}
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && decision.choice === 'switch' && decision.target) decision.speed = decision.target.speed;
			if (!decision.speed) decision.speed = decision.pokemon.speed;

			if (decision.choice === 'switch' && !decision.side.pokemon[0].isActive) {
				// if there's no actives, switches happen before activations
				decision.priority = 6.2;
			}

			selfB.queue.push(decision);
		}
		if (!noSort) {
			selfB.queue.sort(selfB.comparePriority);
		}
	};
	this.prioritizeQueue = function(decision, source, sourceEffect) {
		if (selfB.event) {
			if (!source) source = selfB.event.source;
			if (!sourceEffect) sourceEffect = selfB.effect;
		}
		for (var i=0; i<this.queue.length; i++) {
			if (this.queue[i] === decision) {
				this.queue.splice(i,1);
				break;
			}
		}
		decision.sourceEffect = sourceEffect;
		this.queue.unshift(decision);
	};
	this.willAct = function() {
		for (var i=0; i<selfB.queue.length; i++) {
			if (selfB.queue[i].choice === 'move' || selfB.queue[i].choice === 'switch') {
				return selfB.queue[i];
			}
		}
		return null;
	};
	this.willMove = function(pokemon) {
		for (var i=0; i<selfB.queue.length; i++) {
			if (selfB.queue[i].choice === 'move' && selfB.queue[i].pokemon === pokemon) {
				return selfB.queue[i];
			}
		}
		return null;
	};
	this.cancelDecision = function(pokemon) {
		var success = false;
		for (var i=0; i<selfB.queue.length; i++) {
			if (selfB.queue[i].pokemon === pokemon) {
				selfB.queue.splice(i,1);
				i--;
				success = true;
			}
		}
		return success;
	};
	this.cancelMove = function(pokemon) {
		for (var i=0; i<selfB.queue.length; i++) {
			if (selfB.queue[i].choice === 'move' && selfB.queue[i].pokemon === pokemon) {
				selfB.queue.splice(i,1);
				return true;
			}
		}
		return false;
	};
	this.willSwitch = function(pokemon) {
		for (var i=0; i<selfB.queue.length; i++) {
			if (selfB.queue[i].choice === 'switch' && selfB.queue[i].pokemon === pokemon) {
				return true;
			}
		}
		return false;
	};
	this.runDecision = function(decision) {
		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start':
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			var beginCallback = selfB.getFormat().onBegin;
			if (beginCallback) beginCallback.call(selfB);

			selfB.add('start');
			for (var pos=0; pos<selfB.p1.active.length; pos++) {
				selfB.switchIn(selfB.p1.pokemon[pos], pos);
			}
			for (var pos=0; pos<selfB.p2.active.length; pos++) {
				selfB.switchIn(selfB.p2.pokemon[pos], pos);
			}
			for (var pos=0; pos<selfB.p1.pokemon.length; pos++) {
				var pokemon = selfB.p1.pokemon[pos];
				selfB.singleEvent('Start', selfB.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (var pos=0; pos<selfB.p2.pokemon.length; pos++) {
				var pokemon = selfB.p2.pokemon[pos];
				selfB.singleEvent('Start', selfB.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			selfB.midTurn = true;
			break;
		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			selfB.runMove(decision.move, decision.pokemon, selfB.getTarget(decision), decision.sourceEffect);
			break;
		case 'beforeTurnMove':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			selfB.debug('before turn callback: '+decision.move.id);
			decision.move.beforeTurnCallback.call(selfB, decision.pokemon, selfB.getTarget(decision));
			break;
		case 'event':
			selfB.runEvent(decision.event, decision.pokemon);
			break;
		case 'team':
			var i = parseInt(decision.team[0], 10)-1;
			if (i >= 6 || i < 0) return;

			if (decision.team[1]) {
				// validate the choice
				var newPokemon = [null,null,null,null,null,null];
				for (var j=0; j<6; j++) {
					var i = parseInt(decision.team[j], 10)-1;
					newPokemon[j] = decision.side.pokemon[i];
				}
				var reject = false;
				for (var j=0; j<6; j++) {
					if (!newPokemon[j]) reject = true;
				}
				if (!reject) {
					for (var j=0; j<6; j++) {
						newPokemon[j].position = j;
					}
					decision.side.pokemon = newPokemon;
					return;
				}
			}

			if (i == 0) return;
			var pokemon = decision.side.pokemon[i];
			if (!pokemon) return;
			decision.side.pokemon[i] = decision.side.pokemon[0];
			decision.side.pokemon[0] = pokemon;
			decision.side.pokemon[i].position = i;
			decision.side.pokemon[0].position = 0;
			return;
			// we return here because the update event would crash since there are no active pokemon yet
			break;
		case 'switch':
			if (decision.pokemon) {
				decision.pokemon.beingCalledBack = true;
				var lastMove = selfB.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					selfB.runEvent('BeforeSwitchOut', decision.pokemon);
				}
				if (!selfB.runEvent('SwitchOut', decision.pokemon)) {
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
				selfB.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				selfB.debug('Switch target is already active');
				break;
			}
			selfB.switchIn(decision.target, decision.pokemon.position);
			//decision.target.runSwitchIn();
			break;
		case 'runSwitch':
			decision.pokemon.isStarted = true;
			selfB.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
			selfB.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			break;
		case 'beforeTurn':
			selfB.eachEvent('BeforeTurn');
			break;
		case 'residual':
			selfB.add('');
			selfB.clearActiveMove(true);
			selfB.residualEvent('Residual');
			break;
		}
		selfB.clearActiveMove();

		// phazing (Roar, etc)

		function checkForceSwitchFlag(a) {
			if (!a) return false;
			if (a.hp && a.forceSwitchFlag) {
				selfB.dragIn(a.side, a.position);
			}
			delete a.forceSwitchFlag;
		}
		selfB.p1.active.forEach(checkForceSwitchFlag);
		selfB.p2.active.forEach(checkForceSwitchFlag);

		// fainting

		selfB.faintMessages();
		if (selfB.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!selfB.queue.length) selfB.checkFainted();

		function hasSwitchFlag(a) { return a?a.switchFlag:false; }
		function removeSwitchFlag(a) { if (a) a.switchFlag = false; }
		var p1switch = selfB.p1.active.any(hasSwitchFlag);
		var p2switch = selfB.p2.active.any(hasSwitchFlag);

		if (p1switch && !selfB.canSwitch(selfB.p1)) {
			selfB.p1.active.forEach(removeSwitchFlag);
			p1switch = false;
		}
		if (p2switch && !selfB.canSwitch(selfB.p2)) {
			selfB.p2.active.forEach(removeSwitchFlag);
			p2switch = false;
		}

		if (p1switch || p2switch) {
			selfB.makeRequest('switch');
			return true;
		}

		selfB.eachEvent('Update');

		return false;
	};
	this.go = function() {
		selfB.add('');
		if (selfB.currentRequest) {
			selfB.currentRequest = '';
		}

		if (!selfB.midTurn) {
			selfB.queue.push({choice:'residual', priority: -100});
			selfB.queue.push({choice:'beforeTurn', priority: 100});
			selfB.midTurn = true;
		}
		selfB.addQueue(null);

		var currentPriority = 6;

		while (selfB.queue.length) {
			var decision = selfB.queue.shift();

			/* while (decision.priority < currentPriority && currentPriority > -6) {
				selfB.eachEvent('Priority', null, currentPriority);
				currentPriority--;
			} */

			selfB.runDecision(decision);

			if (selfB.currentRequest) {
				return;
			}

			// if (!selfB.queue.length || selfB.queue[0].choice === 'runSwitch') {
			// 	if (selfB.faintMessages()) return;
			// }

			if (selfB.ended) return;
		}

		selfB.nextTurn();
		selfB.midTurn = false;
		selfB.queue = [];
	};
	this.changeDecision = function(pokemon, decision) {
		selfB.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		selfB.addQueue(decision);
	};
	/**
	 * Takes a choice string passed from the client. Starts the next
	 * turn if all required choices have been made.
	 */
	this.choose = function(sideid, choice, rqid) {
		var side = null;
		if (sideid === 'p1' || sideid === 'p2') side = selfB[sideid];
		// This condition should be impossible because the sideid comes
		// from our forked process and if the player id were invalid, we would
		// not have even got to this function.
		if (!side) return; // wtf

		// This condition can occur if the client sends a decision at the
		// wrong time.
		if (!side.currentRequest) return;

		// Make sure the decision is for the right request.
		if ((rqid !== undefined) && (parseInt(rqid, 10) !== selfB.rqid)) {
			return;
		}

		// It should be impossible for choice not to be a string. Choice comes
		// from splitting the string sent by our forked process, not from the
		// client. However, just in case, we maintain this check for now.
		if (typeof choice === 'string') choice = choice.split(',');

		side.decision = selfB.parseChoice(choice, side);

		if (selfB.p1.decision && selfB.p2.decision) {
			if (selfB.p1.decision !== true) {
				selfB.addQueue(selfB.p1.decision, true, selfB.p1);
			}
			if (selfB.p2.decision !== true) {
				selfB.addQueue(selfB.p2.decision, true, selfB.p2);
			}

			selfB.currentRequest = '';
			selfB.p1.currentRequest = '';
			selfB.p2.currentRequest = '';

			selfB.p1.decision = true;
			selfB.p2.decision = true;

			selfB.go();
		}
	};
	this.undoChoice = function(sideid) {
		var side = null;
		if (sideid === 'p1' || sideid === 'p2') side = selfB[sideid];
		// The following condition can never occur for the reasons given in
		// the choose() function above.
		if (!side) return; // wtf
		// This condition can occur.
		if (!side.currentRequest) return;

		side.decision = false;
	};
	/**
	 * Parses a choice string passed from a client into a decision object
	 * usable by PS's engine.
	 *
	 * Choice validation is also done here.
	 */
	this.parseChoice = function(choices, side) {
		var prevSwitches = {};
		if (!side.currentRequest) return true;

		if (typeof choices === 'string') choices = choices.split(',');

		var decisions = [];
		var len = choices.length;
		if (side.currentRequest === 'move') len = side.active.length;
		for (var i=0; i<len; i++) {
			var choice = (choices[i]||'').trim();

			var data = '';
			var firstSpaceIndex = choice.indexOf(' ');
			if (firstSpaceIndex >= 0) {
				data = choice.substr(firstSpaceIndex+1).trim();
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
				if (choice !== 'move' && choice !== 'switch') {
					if (i === 0) return false;
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
				if (choice !== 'switch') return false;
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
				if (side.pokemon[i].trapped && side.currentRequest === 'move') {
					selfB.debug("Can't switch: The active pokemon is trapped");
					return false;
				}

				data = parseInt(data, 10)-1;
				if (data < 0) data = 0;
				if (data > side.pokemon.length-1) data = side.pokemon.length-1;

				if (!side.pokemon[data]) {
					selfB.debug("Can't switch: You can't switch to a pokemon that doesn't exist");
					return false;
				}
				if (data == i) {
					selfB.debug("Can't switch: You can't switch to yourself");
					return false;
				}
				if (selfB.battleType !== 'triples' && data < side.active.length) {
					selfB.debug("Can't switch: You can't switch to an active pokemon except in triples");
					return false;
				}
				if (side.pokemon[data].fainted) {
					selfB.debug("Can't switch: You can't switch to a fainted pokemon");
					return false;
				}
				if (prevSwitches[data]) {
					selfB.debug("Can't switch: You can't switch to pokemon already queued to be switched");
					return false;
				}
				prevSwitches[data] = true;

				decisions.push({
					choice: 'switch',
					pokemon: side.pokemon[i],
					target: side.pokemon[data]
				});
				break;

			case 'move':
				var targetLoc = 0;

				if (data.substr(data.length-2) === ' 1') targetLoc = 1;
				if (data.substr(data.length-2) === ' 2') targetLoc = 2;
				if (data.substr(data.length-2) === ' 3') targetLoc = 3;
				if (data.substr(data.length-3) === ' -1') targetLoc = -1;
				if (data.substr(data.length-3) === ' -2') targetLoc = -2;
				if (data.substr(data.length-3) === ' -3') targetLoc = -3;

				if (targetLoc) data = data.substr(0, data.lastIndexOf(' '));

				var pokemon = side.pokemon[i];
				var move = '';
				if (data.search(/^[0-9]+$/) >= 0) {
					move = pokemon.getValidMoves()[parseInt(data,10)-1];
				} else {
					move = data;
				}
				if (!pokemon.canUseMove(move)) move = pokemon.getValidMoves()[0];
				move = selfB.getMove(move).id;

				decisions.push({
					choice: 'move',
					pokemon: pokemon,
					targetLoc: targetLoc,
					move: move
				});
				break;
			}
		}
		return decisions;
	};
	this.add = function() {
		selfB.log.push('|'+Array.prototype.slice.call(arguments).join('|'));
	};
	this.lastMoveLine = 0;
	this.addMove = function() {
		selfB.lastMoveLine = selfB.log.length;
		selfB.log.push('|'+Array.prototype.slice.call(arguments).join('|'));
	};
	this.attrLastMove = function() {
		selfB.log[selfB.lastMoveLine] += '|'+Array.prototype.slice.call(arguments).join('|');
	};
	this.debug = function(activity) {
		if (selfB.getFormat().debug) {
			selfB.add('debug', activity);
		}
	};
	this.debugError = function(activity) {
		selfB.add('debug', activity);
	};

	// players

	this.join = function(slot, name, avatar, team) {
		if (selfB.p1 && selfB.p1.isActive && selfB.p2 && selfB.p2.isActive) return false;
		if ((selfB.p1 && selfB.p1.isActive && selfB.p1.name === name) || (selfB.p2 && selfB.p2.isActive && selfB.p2.name === name)) return false;
		if (selfB.p1 && selfB.p1.isActive || slot === 'p2') {
			if (selfB.started) {
				selfB.p2.name = name;
			} else {
				//console.log("NEW SIDE: "+name);
				selfB.p2 = new BattleSide(name, selfB, 1, team);
				selfB.sides[1] = selfB.p2;
			}
			if (avatar) selfB.p2.avatar = avatar;
			selfB.p2.isActive = true;
			selfB.add('player', 'p2', selfB.p2.name, avatar);
		} else {
			if (selfB.started) {
				selfB.p1.name = name;
			} else {
				//console.log("NEW SIDE: "+name);
				selfB.p1 = new BattleSide(name, selfB, 0, team);
				selfB.sides[0] = selfB.p1;
			}
			if (avatar) selfB.p1.avatar = avatar;
			selfB.p1.isActive = true;
			selfB.add('player', 'p1', selfB.p1.name, avatar);
		}
		selfB.start();
		return true;
	};
	this.rename = function(slot, name, avatar) {
		if (slot === 'p1' || slot === 'p2') {
			var side = selfB[slot];
			side.name = name;
			if (avatar) side.avatar = avatar;
			selfB.add('player', slot, name, side.avatar);
		}
	};
	this.leave = function(slot) {
		if (slot === 'p1' || slot === 'p2') {
			var side = selfB[slot];
			side.emitUpdate({side:'none'});
			side.isActive = false;
			selfB.add('player', slot);
			selfB.active = false;
		}
		return true;
	};

	// IPC

	this.messageLog = [];
	// Messages sent by this function are received and handled in
	// Simulator.prototype.receive in simulator.js (in another process).
	this.send = function(type, data) {
		if (Array.isArray(data)) data = data.join("\n");
		process.send(this.id+"\n"+type+"\n"+data);
	};
	// This function is called by this process's 'message' event.
	this.receive = function(data, more) {
		this.messageLog.push(data.join(' '));
		var logPos = selfB.log.length;
		var alreadyEnded = selfB.ended;
		switch (data[1]) {
		case 'join':
			var team = null;
			try {
				if (more) team = JSON.parse(more);
			} catch (e) {
				console.log('TEAM PARSE ERROR: '+more);
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
			var p1active = p1?p1.active[0]:null;
			var p2active = p2?p2.active[0]:null;
			try {
				this.send('update', '|chat|~|<<< '+eval(data[2]));
			} catch (e) {
				this.send('update', '|chatmsg|<<< error: '+e.message);
			}
			return;
			break;
		}

		if (selfB.p1 && selfB.p2) {
			var inactiveSide = -1;
			if (!selfB.p1.isActive && selfB.p2.isActive) {
				inactiveSide = 0;
			} else if (selfB.p1.isActive && !selfB.p2.isActive) {
				inactiveSide = 1;
			} else if (!selfB.p1.decision && selfB.p2.decision) {
				inactiveSide = 0;
			} else if (selfB.p1.decision && !selfB.p2.decision) {
				inactiveSide = 1;
			}
			if (inactiveSide !== selfB.inactiveSide) {
				this.send('inactiveside', inactiveSide);
				selfB.inactiveSide = inactiveSide;
			}
		}

		if (selfB.log.length > logPos) {
			if (selfB.ended && !alreadyEnded) {
				if (selfB.rated) {
					var log = {
						turns: selfB.turn,
						p1: selfB.p1.name,
						p2: selfB.p2.name,
						p1team: selfB.p1.team,
						p2team: selfB.p2.team,
						log: selfB.log
					}
					this.send('log', JSON.stringify(log));
				}
				this.send('winupdate', [selfB.winner].concat(selfB.log.slice(logPos)));
			} else {
				this.send('update', selfB.log.slice(logPos));
			}
		}
	};

	this.destroy = function() {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (var i=0; i<selfB.sides.length; i++) {
			if (selfB.sides[i]) selfB.sides[i].destroy();
			selfB.sides[i] = null;
		}
		selfB.p1 = null;
		selfB.p2 = null;
		for (var i=0; i<selfB.queue.length; i++) {
			delete selfB.queue[i].pokemon;
			delete selfB.queue[i].side;
			selfB.queue[i] = null;
		}
		selfB.queue = null;

		// in case the garbage collector really sucks, at least deallocate the log
		selfB.log = null;

		// remove from battle list
		Battles[selfB.id] = null;

		// get rid of some possibly-circular references

		selfB = null;
	};
}

exports.BattlePokemon = BattlePokemon;
exports.BattleSide = BattleSide;
exports.Battle = Battle;
