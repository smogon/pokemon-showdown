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

'use strict';

global.Config = require('./config/config.js');

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', err => {
		require('./crashlogger.js')(err, 'A simulator process');
	});
}

global.Tools = require('./tools.js').includeMods();
global.toId = Tools.getId;

let Battle, BattleSide, BattlePokemon;

let Battles = Object.create(null);

require('./repl.js').start('battle-engine-', process.pid, cmd => eval(cmd));

// Receive and process a message sent using Simulator.prototype.send in
// another process.
process.on('message', message => {
	//console.log('CHILD MESSAGE RECV: "' + message + '"');
	let nlIndex = message.indexOf("\n");
	let more = '';
	if (nlIndex > 0) {
		more = message.substr(nlIndex + 1);
		message = message.substr(0, nlIndex);
	}
	let data = message.split('|');
	if (data[1] === 'init') {
		if (!Battles[data[0]]) {
			try {
				Battles[data[0]] = Battle.construct(data[0], data[2], data[3]);
			} catch (err) {
				if (require('./crashlogger.js')(err, 'A battle', {
					message: message,
				}) === 'lockdown') {
					let ministack = Tools.escapeHTML(err.stack).split("\n").slice(0, 2).join("<br />");
					process.send(data[0] + '\nupdate\n|html|<div class="broadcast-red"><b>A BATTLE PROCESS HAS CRASHED:</b> ' + ministack + '</div>');
				} else {
					process.send(data[0] + '\nupdate\n|html|<div class="broadcast-red"><b>The battle crashed!</b><br />Don\'t worry, we\'re working on fixing it.</div>');
				}
			}
		}
	} else if (data[1] === 'dealloc') {
		if (Battles[data[0]] && Battles[data[0]].destroy) {
			Battles[data[0]].destroy();
		} else {
			require('./crashlogger.js')(new Error("Invalid dealloc"), 'A battle', {
				message: message,
			});
		}
		delete Battles[data[0]];
	} else {
		let battle = Battles[data[0]];
		if (battle) {
			let prevRequest = battle.currentRequest;
			let prevRequestDetails = battle.currentRequestDetails || '';
			try {
				battle.receive(data, more);
			} catch (err) {
				require('./crashlogger.js')(err, 'A battle', {
					message: message,
					currentRequest: prevRequest,
					log: '\n' + battle.log.join('\n').replace(/\n\|split\n[^\n]*\n[^\n]*\n[^\n]*\n/g, '\n'),
				});

				let logPos = battle.log.length;
				battle.add('html', '<div class="broadcast-red"><b>The battle crashed</b><br />You can keep playing but it might crash again.</div>');
				let nestedError;
				try {
					battle.makeRequest(prevRequest, prevRequestDetails);
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

process.on('disconnect', () => {
	process.exit();
});

BattlePokemon = (() => {
	function BattlePokemon(set, side) {
		this.side = side;
		this.battle = side.battle;

		let pokemonScripts = this.battle.data.Scripts.pokemon;
		if (pokemonScripts) Object.assign(this, pokemonScripts);

		if (typeof set === 'string') set = {name: set};

		// "pre-bound" functions for nicer syntax (avoids repeated use of `bind`)
		this.getHealth = (this.getHealth || BattlePokemon.getHealth).bind(this);
		this.getDetails = (this.getDetails || BattlePokemon.getDetails).bind(this);

		this.set = set;

		this.baseTemplate = this.battle.getTemplate(set.species || set.name);
		if (!this.baseTemplate.exists) {
			this.battle.debug('Unidentified species: ' + this.species);
			this.baseTemplate = this.battle.getTemplate('Unown');
		}
		this.species = Tools.getSpecies(set.species);
		if (set.name === set.species || !set.name) {
			set.name = this.baseTemplate.baseSpecies;
		}
		this.name = set.name.substr(0, 20);
		this.speciesid = toId(this.species);
		this.template = this.baseTemplate;
		this.moves = [];
		this.baseMoves = this.moves;
		this.movepp = {};
		this.moveset = [];
		this.baseMoveset = [];

		this.level = this.battle.clampIntRange(set.forcedLevel || set.level || 100, 1, 9999);

		let genders = {M:'M', F:'F', N:'N'};
		this.gender = genders[set.gender] || this.template.gender || (Math.random() * 2 < 1 ? 'M' : 'F');
		if (this.gender === 'N') this.gender = '';
		this.happiness = typeof set.happiness === 'number' ? this.battle.clampIntRange(set.happiness, 0, 255) : 255;
		this.pokeball = this.set.pokeball || 'pokeball';

		this.fullname = this.side.id + ': ' + this.name;
		this.details = this.species + (this.level === 100 ? '' : ', L' + this.level) + (this.gender === '' ? '' : ', ' + this.gender) + (this.set.shiny ? ', shiny' : '');

		this.id = this.fullname; // shouldn't really be used anywhere

		this.statusData = {};
		this.volatiles = {};

		this.height = this.template.height;
		this.heightm = this.template.heightm;
		this.weight = this.template.weight;
		this.weightkg = this.template.weightkg;

		this.baseAbility = toId(set.ability);
		this.ability = this.baseAbility;
		this.item = toId(set.item);
		this.abilityData = {id: this.ability};
		this.itemData = {id: this.item};
		this.speciesData = {id: this.speciesid};

		this.types = this.baseTemplate.types;
		this.addedType = '';
		this.knownType = true;

		if (this.set.moves) {
			for (let i = 0; i < this.set.moves.length; i++) {
				let move = this.battle.getMove(this.set.moves[i]);
				if (!move.id) continue;
				if (move.id === 'hiddenpower' && move.type !== 'Normal') {
					const ivValues = this.set.ivs && Object.values(this.set.ivs);
					if (this.battle.gen && this.battle.gen <= 2) {
						if (!ivValues || Math.min.apply(null, ivValues) >= 30) {
							let HPdvs = this.battle.getType(move.type).HPdvs;
							this.set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
							for (let i in HPdvs) {
								this.set.ivs[i] = HPdvs[i] * 2;
							}
						}
					} else {
						if (!ivValues || ivValues.every(val => val === 31)) {
							this.set.ivs = this.battle.getType(move.type).HPivs;
						}
					}
					move = this.battle.getMove('hiddenpower');
				}
				this.baseMoveset.push({
					move: move.name,
					id: move.id,
					pp: (move.noPPBoosts ? move.pp : move.pp * 8 / 5),
					maxpp: (move.noPPBoosts ? move.pp : move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					disabledSource: '',
					used: false,
				});
				this.moves.push(move.id);
			}
		}

		this.canMegaEvo = this.battle.canMegaEvo(this);

		if (!this.set.evs) {
			this.set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		}
		if (!this.set.ivs) {
			this.set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}
		let stats = {hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
		for (let i in stats) {
			if (!this.set.evs[i]) this.set.evs[i] = 0;
			if (!this.set.ivs[i] && this.set.ivs[i] !== 0) this.set.ivs[i] = 31;
		}
		for (let i in this.set.evs) {
			this.set.evs[i] = this.battle.clampIntRange(this.set.evs[i], 0, 255);
		}
		for (let i in this.set.ivs) {
			this.set.ivs[i] = this.battle.clampIntRange(this.set.ivs[i], 0, 31);
		}
		if (this.battle.gen && this.battle.gen <= 2) {
			// We represent DVs using even IVs. Ensure they are in fact even.
			for (let i in this.set.ivs) {
				this.set.ivs[i] &= 30;
			}
		}

		let hpTypes = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'];
		if (this.battle.gen && this.battle.gen === 2) {
			// Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
			let atkDV = Math.floor(this.set.ivs.atk / 2);
			let defDV = Math.floor(this.set.ivs.def / 2);
			let speDV = Math.floor(this.set.ivs.spe / 2);
			let spcDV = Math.floor(this.set.ivs.spa / 2);
			this.hpType = hpTypes[4 * (atkDV % 4) + (defDV % 4)];
			this.hpPower = Math.floor((5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV > 2 ? 3 : spcDV)) / 2 + 31);
		} else {
			// Hidden Power check for gen 3 onwards
			let hpTypeX = 0, hpPowerX = 0;
			let i = 1;
			for (let s in stats) {
				hpTypeX += i * (this.set.ivs[s] % 2);
				hpPowerX += i * (Math.floor(this.set.ivs[s] / 2) % 2);
				i *= 2;
			}
			this.hpType = hpTypes[Math.floor(hpTypeX * 15 / 63)];
			// In Gen 6, Hidden Power is always 60 base power
			this.hpPower = (this.battle.gen && this.battle.gen < 6) ? Math.floor(hpPowerX * 40 / 63) + 30 : 60;
		}

		this.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
		this.stats = {atk:0, def:0, spa:0, spd:0, spe:0};
		this.baseStats = {atk:10, def:10, spa:10, spd:10, spe:10};
		// This is used in gen 1 only, here to avoid code repetition.
		// Only declared if gen 1 to avoid declaring an object we aren't going to need.
		if (this.battle.gen === 1) this.modifiedStats = {atk:0, def:0, spa:0, spd:0, spe:0};
		for (let statName in this.baseStats) {
			let stat = this.template.baseStats[statName];
			stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);
			let nature = this.battle.getNature(this.set.nature);
			if (statName === nature.plus) stat *= 1.1;
			if (statName === nature.minus) stat *= 0.9;
			this.baseStats[statName] = Math.floor(stat);
		}

		this.maxhp = Math.floor(Math.floor(2 * this.template.baseStats['hp'] + this.set.ivs['hp'] + Math.floor(this.set.evs['hp'] / 4) + 100) * this.level / 100 + 10);
		if (this.template.maxHP) this.maxhp = this.template.maxHP; // Shedinja

		this.hp = this.hp || this.maxhp;

		this.isStale = 0;
		this.isStaleCon = 0;
		this.isStaleHP = this.maxhp;
		this.isStalePPTurns = 0;

		// Transform copies IVs in gen 4 and earlier, so we track the base IVs/HP-type/power
		this.baseIvs = this.set.ivs;
		this.baseHpType = this.hpType;
		this.baseHpPower = this.hpPower;

		this.clearVolatile(true);
	}

	BattlePokemon.prototype.trapped = false;
	BattlePokemon.prototype.maybeTrapped = false;
	BattlePokemon.prototype.maybeDisabled = false;
	BattlePokemon.prototype.hp = 0;
	BattlePokemon.prototype.maxhp = 100;
	BattlePokemon.prototype.illusion = null;
	BattlePokemon.prototype.fainted = false;
	BattlePokemon.prototype.faintQueued = false;
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
	BattlePokemon.prototype.abilityOrder = 0;

	BattlePokemon.prototype.toString = function () {
		let fullname = this.fullname;
		if (this.illusion) fullname = this.illusion.fullname;

		let positionList = 'abcdef';
		if (this.isActive) return fullname.substr(0, 2) + positionList[this.position] + fullname.substr(2);
		return fullname;
	};
	// "static" function
	BattlePokemon.getDetails = function (side) {
		if (this.illusion) return this.illusion.details + '|' + this.getHealth(side);
		return this.details + '|' + this.getHealth(side);
	};
	BattlePokemon.prototype.updateSpeed = function () {
		this.speed = this.getDecisionSpeed();
	};
	BattlePokemon.prototype.calculateStat = function (statName, boost, modifier) {
		statName = toId(statName);

		if (statName === 'hp') return this.maxhp; // please just read .maxhp directly

		// base stat
		let stat = this.stats[statName];

		// stat boosts
		// boost = this.boosts[statName];
		let boosts = {};
		boosts[statName] = boost;
		boosts = this.battle.runEvent('ModifyBoost', this, null, null, boosts);
		boost = boosts[statName];
		let boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
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
		let stat = this.stats[statName];

		// stat boosts
		if (!unboosted) {
			let boosts = this.battle.runEvent('ModifyBoost', this, null, null, Object.assign({}, this.boosts));
			let boost = boosts[statName];
			let boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
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
			let statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
			stat = this.battle.runEvent('Modify' + statTable[statName], this, null, null, stat);
		}
		if (this.battle.getStatCallback) {
			stat = this.battle.getStatCallback(stat, statName, this, unboosted);
		}
		return stat;
	};
	BattlePokemon.prototype.getDecisionSpeed = function () {
		let speed = this.getStat('spe');
		if (speed > 10000) speed = 10000;
		if (this.battle.getPseudoWeather('trickroom')) {
			speed = 0x2710 - speed;
		}
		return speed & 0x1FFF;
	};
	BattlePokemon.prototype.getWeight = function () {
		let weight = this.template.weightkg;
		weight = this.battle.runEvent('ModifyWeight', this, null, null, weight);
		if (weight < 0.1) weight = 0.1;
		return weight;
	};
	BattlePokemon.prototype.getMoveData = function (move) {
		move = this.battle.getMove(move);
		for (let i = 0; i < this.moveset.length; i++) {
			let moveData = this.moveset[i];
			if (moveData.id === move.id) {
				return moveData;
			}
		}
		return null;
	};
	BattlePokemon.prototype.getMoveTargets = function (move, target) {
		let targets = [];
		switch (move.target) {
		case 'all':
		case 'foeSide':
		case 'allySide':
		case 'allyTeam':
			if (!move.target.startsWith('foe')) {
				for (let i = 0; i < this.side.active.length; i++) {
					if (!this.side.active[i].fainted) {
						targets.push(this.side.active[i]);
					}
				}
			}
			if (!move.target.startsWith('ally')) {
				for (let i = 0; i < this.side.foe.active.length; i++) {
					if (!this.side.foe.active[i].fainted) {
						targets.push(this.side.foe.active[i]);
					}
				}
			}
			break;
		case 'allAdjacent':
		case 'allAdjacentFoes':
			if (move.target === 'allAdjacent') {
				for (let i = 0; i < this.side.active.length; i++) {
					if (this.battle.isAdjacent(this, this.side.active[i])) {
						targets.push(this.side.active[i]);
					}
				}
			}
			for (let i = 0; i < this.side.foe.active.length; i++) {
				if (this.battle.isAdjacent(this, this.side.foe.active[i])) {
					targets.push(this.side.foe.active[i]);
				}
			}
			break;
		default:
			let selectedTarget = target;
			if (!target || (target.fainted && target.side !== this.side)) {
				// If a targeted foe faints, the move is retargeted
				target = this.battle.resolveTarget(this, move);
			}
			if (target.side.active.length > 1) {
				target = this.battle.priorityEvent('RedirectTarget', this, this, move, target);
			}
			if (selectedTarget !== target) {
				this.battle.retargetLastMove(target);
			}
			targets = [target];

			// Resolve apparent targets for Pressure.
			if (move.pressureTarget) {
				// At the moment, this is the only supported target.
				if (move.pressureTarget === 'foeSide') {
					for (let i = 0; i < this.side.foe.active.length; i++) {
						if (this.side.foe.active[i] && !this.side.foe.active[i].fainted) {
							targets.push(this.side.foe.active[i]);
						}
					}
				}
			}
		}
		return targets;
	};
	BattlePokemon.prototype.ignoringAbility = function () {
		return !!((this.battle.gen >= 5 && !this.isActive) || this.volatiles['gastroacid']);
	};
	BattlePokemon.prototype.ignoringItem = function () {
		return !!((this.battle.gen >= 5 && !this.isActive) || this.hasAbility('klutz') || this.volatiles['embargo'] || this.battle.pseudoWeather['magicroom']);
	};
	BattlePokemon.prototype.deductPP = function (move, amount, source) {
		move = this.battle.getMove(move);
		let ppData = this.getMoveData(move);
		if (!ppData) return false;
		ppData.used = true;
		if (!ppData.pp) return false;

		ppData.pp -= amount || 1;
		if (ppData.pp <= 0) {
			ppData.pp = 0;
		}
		if (ppData.virtual) {
			let foeActive = this.side.foe.active;
			for (let i = 0; i < foeActive.length; i++) {
				if (foeActive[i].isStale >= 2) {
					if (move.selfSwitch) this.isStalePPTurns++;
					return true;
				}
			}
		}
		this.isStalePPTurns = 0;
		return true;
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
			thisTurn: true,
		};
	};
	BattlePokemon.prototype.getLockedMove = function () {
		let lockedMove = this.battle.runEvent('LockMove', this);
		if (lockedMove === true) lockedMove = false;
		return lockedMove;
	};
	BattlePokemon.prototype.getMoves = function (lockedMove, restrictData) {
		if (lockedMove) {
			lockedMove = toId(lockedMove);
			this.trapped = true;
			if (lockedMove === 'recharge') {
				return [{
					move: 'Recharge',
					id: 'recharge',
				}];
			}
			for (let i = 0; i < this.moveset.length; i++) {
				let moveEntry = this.moveset[i];
				if (moveEntry.id !== lockedMove) continue;
				return [{
					move: moveEntry.move,
					id: moveEntry.id,
				}];
			}
			// does this happen?
			return [{
				move: this.battle.getMove(lockedMove).name,
				id: lockedMove,
			}];
		}
		let moves = [];
		let hasValidMove = false;
		for (let i = 0; i < this.moveset.length; i++) {
			let moveEntry = this.moveset[i];

			let moveName = moveEntry.move;
			if (moveEntry.id === 'hiddenpower') {
				moveName = 'Hidden Power ' + this.hpType;
				if (this.battle.gen < 6) moveName += ' ' + this.hpPower;
			} else if (moveEntry.id === 'return') {
				moveName = 'Return ' + this.battle.getMove('return').basePowerCallback(this);
			} else if (moveEntry.id === 'frustration') {
				moveName = 'Frustration ' + this.battle.getMove('frustration').basePowerCallback(this);
			}
			let target = moveEntry.target;
			if (moveEntry.id === 'curse') {
				if (!this.hasType('Ghost')) {
					target = this.battle.getMove('curse').nonGhostTarget || moveEntry.target;
				}
			}
			let disabled = moveEntry.disabled;
			if (moveEntry.pp <= 0 || disabled && this.side.active.length >= 2 && this.battle.targetTypeChoices(target)) {
				disabled = true;
			} else if (disabled === 'hidden' && restrictData) {
				disabled = false;
			}
			if (!disabled) {
				hasValidMove = true;
			}
			moves.push({
				move: moveName,
				id: moveEntry.id,
				pp: moveEntry.pp,
				maxpp: moveEntry.maxpp,
				target: target,
				disabled: disabled,
			});
		}
		if (hasValidMove) return moves;

		return [];
	};
	BattlePokemon.prototype.getRequestData = function () {
		let lockedMove = this.getLockedMove();

		// Information should be restricted for the last active Pokémon
		let isLastActive = this.isLastActive();
		let moves = this.getMoves(lockedMove, isLastActive);
		let data = {moves: moves.length ? moves : [{move: 'Struggle', id: 'struggle'}]};

		if (isLastActive) {
			if (this.maybeDisabled) {
				data.maybeDisabled = true;
			}
			if (this.trapped === true) {
				data.trapped = true;
			} else if (this.maybeTrapped) {
				data.maybeTrapped = true;
			}
		} else {
			if (this.trapped) data.trapped = true;
		}

		if (this.canMegaEvo && !lockedMove) data.canMegaEvo = true;

		return data;
	};
	BattlePokemon.prototype.isLastActive = function () {
		if (!this.isActive) return false;

		let allyActive = this.side.active;
		for (let i = this.position + 1; i < allyActive.length; i++) {
			if (allyActive[i] && !allyActive.fainted) return false;
		}
		return true;
	};
	BattlePokemon.prototype.positiveBoosts = function () {
		let boosts = 0;
		for (let i in this.boosts) {
			if (this.boosts[i] > 0) boosts += this.boosts[i];
		}
		return boosts;
	};
	BattlePokemon.prototype.boostBy = function (boost) {
		let delta = 0;
		for (let i in boost) {
			delta = boost[i];
			this.boosts[i] += delta;
			if (this.boosts[i] > 6) {
				delta -= this.boosts[i] - 6;
				this.boosts[i] = 6;
			}
			if (this.boosts[i] < -6) {
				delta -= this.boosts[i] - (-6);
				this.boosts[i] = -6;
			}
		}
		return delta;
	};
	BattlePokemon.prototype.clearBoosts = function () {
		for (let i in this.boosts) {
			this.boosts[i] = 0;
		}
	};
	BattlePokemon.prototype.setBoost = function (boost) {
		for (let i in boost) {
			this.boosts[i] = boost[i];
		}
	};
	BattlePokemon.prototype.copyVolatileFrom = function (pokemon) {
		this.clearVolatile();
		this.boosts = pokemon.boosts;
		for (let i in pokemon.volatiles) {
			if (this.battle.getEffect(i).noCopy) continue;
			// shallow clones
			this.volatiles[i] = Object.assign({}, pokemon.volatiles[i]);
			if (this.volatiles[i].linkedPokemon) {
				delete pokemon.volatiles[i].linkedPokemon;
				delete pokemon.volatiles[i].linkedStatus;
				this.volatiles[i].linkedPokemon.volatiles[this.volatiles[i].linkedStatus].linkedPokemon = this;
			}
		}
		pokemon.clearVolatile();
		for (let i in this.volatiles) {
			this.battle.singleEvent('Copy', this.getVolatile(i), this.volatiles[i], this);
		}
	};
	BattlePokemon.prototype.transformInto = function (pokemon, user, effect) {
		let template = pokemon.template;
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

		this.types = pokemon.types;
		this.addedType = pokemon.addedType;
		this.knownType = this.side === pokemon.side && pokemon.knownType;

		for (let statName in this.stats) {
			this.stats[statName] = pokemon.stats[statName];
		}
		this.moveset = [];
		this.moves = [];
		this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
		this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
		this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
		for (let i = 0; i < pokemon.moveset.length; i++) {
			let moveData = pokemon.moveset[i];
			let moveName = moveData.move;
			if (moveData.id === 'hiddenpower') {
				moveName = 'Hidden Power ' + this.hpType;
			}
			this.moveset.push({
				move: moveName,
				id: moveData.id,
				pp: moveData.maxpp === 1 ? 1 : 5,
				maxpp: this.battle.gen >= 5 ? (moveData.maxpp === 1 ? 1 : 5) : moveData.maxpp,
				target: moveData.target,
				disabled: false,
				used: false,
				virtual: true,
			});
			this.moves.push(toId(moveName));
		}
		for (let j in pokemon.boosts) {
			this.boosts[j] = pokemon.boosts[j];
		}
		if (effect) {
			this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
		} else {
			this.battle.add('-transform', this, pokemon);
		}
		this.setAbility(pokemon.ability, this, {id: 'transform'});

		// Change formes based on held items (for Transform)
		// Only ever relevant in Generation 4 since Generation 3 didn't have item-based forme changes
		if (this.battle.gen === 4) {
			if (this.template.num === 487) {
				// Giratina formes
				if (this.template.species === 'Giratina' && this.item === 'griseousorb') {
					this.formeChange('Giratina-Origin');
					this.battle.add('-formechange', this, 'Giratina-Origin');
				} else if (this.template.species === 'Giratina-Origin' && this.item !== 'griseousorb') {
					this.formeChange('Giratina');
					this.battle.add('-formechange', this, 'Giratina');
				}
			}
			if (this.template.num === 493) {
				// Arceus formes
				let item = Tools.getItem(this.item);
				let targetForme = (item && item.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
				if (this.template.species !== targetForme) {
					this.formeChange(targetForme);
					this.battle.add('-formechange', this, targetForme);
				}
			}
		}

		return true;
	};
	BattlePokemon.prototype.formeChange = function (template, dontRecalculateStats) {
		template = this.battle.getTemplate(template);

		if (!template.abilities) return false;
		this.illusion = null;
		this.template = template;

		this.types = template.types;
		this.addedType = '';
		this.knownType = true;

		if (!dontRecalculateStats) {
			for (let statName in this.stats) {
				let stat = this.template.baseStats[statName];
				stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);

				// nature
				let nature = this.battle.getNature(this.set.nature);
				if (statName === nature.plus) stat *= 1.1;
				if (statName === nature.minus) stat *= 0.9;
				this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
				// If gen 1, we reset modified stats.
				if (this.battle.gen === 1) {
					this.modifiedStats[statName] = Math.floor(stat);
					// ...and here is where the gen 1 games re-apply burn and para drops.
					if (this.status === 'par' && statName === 'spe') this.modifyStat('spe', 0.25);
					if (this.status === 'brn' && statName === 'atk') this.modifyStat('atk', 0.5);
				}
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
			evasion: 0,
		};

		if (this.battle.gen === 1 && this.baseMoves.includes('mimic') && !this.transformed) {
			let moveslot = this.baseMoves.indexOf('mimic');
			let mimicPP = this.moveset[moveslot] ? this.moveset[moveslot].pp : 16;
			this.moveset = this.baseMoveset.slice();
			this.moveset[moveslot].pp = mimicPP;
		} else {
			this.moveset = this.baseMoveset.slice();
		}
		this.moves = this.moveset.map(move => toId(move.move));

		this.transformed = false;
		this.ability = this.baseAbility;
		this.set.ivs = this.baseIvs;
		this.hpType = this.baseHpType;
		this.hpPower = this.baseHpPower;
		for (let i in this.volatiles) {
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
	};
	BattlePokemon.prototype.hasType = function (type) {
		if (!type) return false;
		if (Array.isArray(type)) {
			for (let i = 0; i < type.length; i++) {
				if (this.hasType(type[i])) return true;
			}
		} else {
			if (this.getTypes().includes(type)) return true;
		}
		return false;
	};
	// returns the amount of damage actually dealt
	BattlePokemon.prototype.faint = function (source, effect) {
		// This function only puts the pokemon in the faint queue;
		// actually setting of this.fainted comes later when the
		// faint queue is resolved.
		if (this.fainted || this.faintQueued) return 0;
		let d = this.hp;
		this.hp = 0;
		this.switchFlag = false;
		this.faintQueued = true;
		this.battle.faintQueue.push({
			target: this,
			source: source,
			effect: effect,
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
	BattlePokemon.prototype.tryTrap = function (isHidden) {
		if (this.runStatusImmunity('trapped')) {
			if (this.trapped && isHidden) return true;
			this.trapped = isHidden ? 'hidden' : true;
			return true;
		}
		return false;
	};
	BattlePokemon.prototype.hasMove = function (moveid) {
		moveid = toId(moveid);
		if (moveid.substr(0, 11) === 'hiddenpower') moveid = 'hiddenpower';
		for (let i = 0; i < this.moveset.length; i++) {
			if (moveid === this.battle.getMove(this.moveset[i].move).id) {
				return moveid;
			}
		}
		return false;
	};
	BattlePokemon.prototype.disableMove = function (moveid, isHidden, sourceEffect) {
		if (!sourceEffect && this.battle.event) {
			sourceEffect = this.battle.effect;
		}
		moveid = toId(moveid);

		for (let move of this.moveset) {
			if (move.id === moveid && move.disabled !== true) {
				move.disabled = (isHidden || true);
				move.disabledSource = (sourceEffect ? sourceEffect.fullname : '');
				break;
			}
		}
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
		return this.setStatus(this.status || status, source, sourceEffect);
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

		if (this.status === status.id) {
			if (sourceEffect && sourceEffect.status === this.status) {
				this.battle.add('-fail', this, this.status);
			} else if (sourceEffect && sourceEffect.status) {
				this.battle.add('-fail', this);
			}
			return false;
		}

		if (!ignoreImmunities && status.id) {
			// the game currently never ignores immunities
			if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
				this.battle.debug('immune to status');
				if (sourceEffect && sourceEffect.status) this.battle.add('-immune', this, '[msg]');
				return false;
			}
		}
		let prevStatus = this.status;
		let prevStatusData = this.statusData;
		if (status.id) {
			let result = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
			if (!result) {
				this.battle.debug('set status [' + status.id + '] interrupted');
				return result;
			}
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

		let id = toId(item);
		if (id && this.item !== id) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		item = this.getItem();
		if (this.battle.runEvent('UseItem', this, null, null, item) && this.battle.runEvent('TryEatItem', this, null, null, item)) {
			this.battle.add('-enditem', this, item, '[eat]');

			this.battle.singleEvent('Eat', item, this.itemData, this, source, sourceEffect);
			this.battle.runEvent('EatItem', this, null, null, item);

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

		let id = toId(item);
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
		if (this.battle.gen === 4) {
			if (toId(this.ability) === 'multitype') return false;
			if (source && toId(source.ability) === 'multitype') return false;
		}
		let item = this.getItem();
		if (this.battle.runEvent('TakeItem', this, source, null, item)) {
			this.item = '';
			this.itemData = {id: '', target: this};
			return item;
		}
		return false;
	};
	BattlePokemon.prototype.setItem = function (item, source, effect) {
		if (!this.hp || !this.isActive) return false;
		item = this.battle.getItem(item);

		let effectid;
		if (this.battle.effect) effectid = this.battle.effect.id;
		if (item.id === 'leppaberry' && effectid !== 'trick' && effectid !== 'switcheroo') {
			this.isStale = 2;
			this.isStaleSource = 'getleppa';
		}
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
		if (this.ignoringItem()) return false;
		let ownItem = this.item;
		if (!Array.isArray(item)) {
			return ownItem === toId(item);
		}
		return item.map(toId).includes(ownItem);
	};
	BattlePokemon.prototype.clearItem = function () {
		return this.setItem('');
	};
	BattlePokemon.prototype.setAbility = function (ability, source, effect, noForce) {
		if (!this.hp) return false;
		ability = this.battle.getAbility(ability);
		let oldAbility = this.ability;
		if (noForce && oldAbility === ability.id) {
			return false;
		}
		if (!effect || effect.id !== 'transform') {
			if (ability.id in {illusion:1, multitype:1, stancechange:1}) return false;
			if (oldAbility in {multitype:1, stancechange:1}) return false;
		}
		this.battle.singleEvent('End', this.battle.getAbility(oldAbility), this.abilityData, this, source, effect);
		this.ability = ability.id;
		this.abilityData = {id: ability.id, target: this};
		if (ability.id && this.battle.gen > 3) {
			this.battle.singleEvent('Start', ability, this.abilityData, this, source, effect);
		}
		this.abilityOrder = this.battle.abilityOrder++;
		return oldAbility;
	};
	BattlePokemon.prototype.getAbility = function () {
		return this.battle.getAbility(this.ability);
	};
	BattlePokemon.prototype.hasAbility = function (ability) {
		if (this.ignoringAbility()) return false;
		let ownAbility = this.ability;
		if (!Array.isArray(ability)) {
			return ownAbility === toId(ability);
		}
		return ability.map(toId).includes(ownAbility);
	};
	BattlePokemon.prototype.clearAbility = function () {
		return this.setAbility('');
	};
	BattlePokemon.prototype.getNature = function () {
		return this.battle.getNature(this.set.nature);
	};
	BattlePokemon.prototype.addVolatile = function (status, source, sourceEffect, linkedStatus) {
		let result;
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
		if (!this.runStatusImmunity(status.id)) return false;
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
		let linkedPokemon = this.volatiles[status.id].linkedPokemon;
		let linkedStatus = this.volatiles[status.id].linkedStatus;
		delete this.volatiles[status.id];
		if (linkedPokemon && linkedPokemon.volatiles[linkedStatus]) {
			linkedPokemon.removeVolatile(linkedStatus);
		}
		return true;
	};
	// "static" function
	BattlePokemon.getHealth = function (side) {
		if (!this.hp) return '0 fnt';
		let hpstring;
		if ((side === true) || (this.side === side) || this.battle.getFormat().debug || this.battle.reportExactHP) {
			hpstring = '' + this.hp + '/' + this.maxhp;
		} else {
			let ratio = this.hp / this.maxhp;
			if (this.battle.reportPercentages) {
				// HP Percentage Mod mechanics
				let percentage = Math.ceil(ratio * 100);
				if ((percentage === 100) && (ratio < 1.0)) {
					percentage = 99;
				}
				hpstring = '' + percentage + '/100';
			} else {
				// In-game accurate pixel health mechanics
				let pixels = Math.floor(ratio * 48) || 1;
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
	/**
	 * Sets a type (except on Arceus, who resists type changes)
	 * newType can be an array, but this is for OMs only. The game in
	 * reality doesn't support setting a type to more than one type.
	 */
	BattlePokemon.prototype.setType = function (newType, enforce) {
		// Arceus first type cannot be normally changed
		if (!enforce && this.template.num === 493) return false;

		if (!newType) throw new Error("Must pass type to setType");
		this.types = (typeof newType === 'string' ? [newType] : newType);
		this.addedType = '';
		this.knownType = true;

		return true;
	};
	BattlePokemon.prototype.addType = function (newType) {
		// removes any types added previously and adds another one

		this.addedType = newType;

		return true;
	};
	BattlePokemon.prototype.getTypes = function (excludeAdded) {
		let types = this.types;
		if (!excludeAdded && this.addedType) {
			types = types.concat(this.addedType);
		}
		if ('roost' in this.volatiles) {
			types = types.filter(type => type !== 'Flying');
		}
		if (types.length) return types;
		return [this.battle.gen >= 5 ? 'Normal' : '???'];
	};
	BattlePokemon.prototype.isGrounded = function (negateImmunity) {
		if ('gravity' in this.battle.pseudoWeather) return true;
		if ('ingrain' in this.volatiles) return true;
		if ('smackdown' in this.volatiles) return true;
		let item = (this.ignoringItem() ? '' : this.item);
		if (item === 'ironball') return true;
		if (!negateImmunity && this.hasType('Flying')) return false;
		if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
		if ('magnetrise' in this.volatiles) return false;
		if ('telekinesis' in this.volatiles) return false;
		return item !== 'airballoon';
	};
	BattlePokemon.prototype.isSemiInvulnerable = function () {
		if (this.volatiles['fly'] || this.volatiles['bounce'] || this.volatiles['skydrop'] || this.volatiles['dive'] || this.volatiles['dig'] || this.volatiles['phantomforce'] || this.volatiles['shadowforce']) {
			return true;
		}
		for (let i = 0; i < this.side.foe.active.length; i++) {
			if (this.side.foe.active[i].volatiles['skydrop'] && this.side.foe.active[i].volatiles['skydrop'].source === this) {
				return true;
			}
		}
		return false;
	};
	BattlePokemon.prototype.runEffectiveness = function (move) {
		let totalTypeMod = 0;
		let types = this.getTypes();
		for (let i = 0; i < types.length; i++) {
			let typeMod = this.battle.getEffectiveness(move, types[i]);
			typeMod = this.battle.singleEvent('Effectiveness', move, null, types[i], move, null, typeMod);
			totalTypeMod += this.battle.runEvent('Effectiveness', this, types[i], move, typeMod);
		}
		return totalTypeMod;
	};
	BattlePokemon.prototype.runImmunity = function (type, message) {
		if (!type || type === '???') {
			return true;
		}
		if (!(type in this.battle.data.TypeChart)) {
			if (type === 'Fairy' || type === 'Dark' || type === 'Steel') return true;
			throw new Error("Use runStatusImmunity for " + type);
		}
		if (this.fainted) {
			return false;
		}
		let isGrounded;
		let negateResult = this.battle.runEvent('NegateImmunity', this, type);
		if (type === 'Ground') {
			isGrounded = this.isGrounded(!negateResult);
			if (isGrounded === null) {
				if (message) {
					this.battle.add('-immune', this, '[msg]', '[from] ability: Levitate');
				}
				return false;
			}
		}
		if (!negateResult) return true;
		if ((isGrounded === undefined && !this.battle.getImmunity(type, this)) || isGrounded === false) {
			if (message) {
				this.battle.add('-immune', this, '[msg]');
			}
			return false;
		}
		return true;
	};
	BattlePokemon.prototype.runStatusImmunity = function (type, message) {
		if (this.fainted) {
			return false;
		}
		if (!type) {
			return true;
		}
		if (!this.battle.getImmunity(type, this)) {
			this.battle.debug('natural status immunity');
			if (message) {
				this.battle.add('-immune', this, '[msg]');
			}
			return false;
		}
		let immunity = this.battle.runEvent('Immunity', this, null, null, type);
		if (!immunity) {
			this.battle.debug('artificial status immunity');
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

BattleSide = (() => {
	function BattleSide(name, battle, n, team) {
		let sideScripts = battle.data.Scripts.side;
		if (sideScripts) Object.assign(this, sideScripts);

		this.getChoice = (this.getChoice || BattleSide.getChoice).bind(this);

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
		for (let i = 0; i < this.team.length && i < 6; i++) {
			//console.log("NEW POKEMON: " + (this.team[i] ? this.team[i].name : '[unidentified]'));
			this.pokemon.push(new BattlePokemon(this.team[i], this));
		}
		this.pokemonLeft = this.pokemon.length;
		for (let i = 0; i < this.pokemon.length; i++) {
			this.pokemon[i].position = i;
		}
	}

	BattleSide.getChoice = function (side) {
		if (side !== this && side !== true) return '';
		return this.choiceData.choices.join(', ');
	};

	BattleSide.prototype.isActive = false;
	BattleSide.prototype.pokemonLeft = 0;
	BattleSide.prototype.faintedLastTurn = false;
	BattleSide.prototype.faintedThisTurn = false;
	BattleSide.prototype.choiceData = null;
	BattleSide.prototype.foe = null;

	BattleSide.prototype.toString = function () {
		return this.id + ': ' + this.name;
	};
	BattleSide.prototype.getData = function () {
		let data = {
			name: this.name,
			id: this.id,
			pokemon: [],
		};
		for (let i = 0; i < this.pokemon.length; i++) {
			let pokemon = this.pokemon[i];
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
					spe: pokemon.baseStats['spe'],
				},
				moves: pokemon.moves.map(move => {
					if (move === 'hiddenpower') {
						return move + toId(pokemon.hpType) + (pokemon.hpPower === 70 ? '' : pokemon.hpPower);
					}
					return move;
				}),
				baseAbility: pokemon.baseAbility,
				item: pokemon.item,
				pokeball: pokemon.pokeball,
			});
		}
		return data;
	};
	BattleSide.prototype.randomActive = function () {
		let actives = this.active.filter(active => active && !active.fainted);
		if (!actives.length) return null;
		let i = Math.floor(Math.random() * actives.length);
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
		return true;
	};
	BattleSide.prototype.send = function () {
		let parts = Array.prototype.slice.call(arguments);
		let sideUpdate = '|' + parts.map(part => {
			if (typeof part !== 'function') return part;
			return part(this);
		}).join('|');
		this.battle.send('sideupdate', this.id + "\n" + sideUpdate);
	};
	BattleSide.prototype.emitCallback = function () {
		this.battle.send('sideupdate', this.id + "\n|callback|" +
			Array.prototype.slice.call(arguments).join('|'));
	};
	BattleSide.prototype.emitRequest = function (update) {
		this.battle.send('request', this.id + "\n" + this.battle.rqid + "\n" + JSON.stringify(update));
	};
	BattleSide.prototype.acceptChoice = function (offset, choiceData) {
		this.battle.send('choice', this.id + "\n" + this.battle.rqid + "\n" + offset + "\n" + JSON.stringify(choiceData));
	};

	BattleSide.prototype.getDecisionsFinished = function () {
		if (this.choiceData.decisions === true) return true;
		if (this.choiceData.skipsIndices.size) return false;
		if (this.currentRequest === 'teampreview') return this.choiceData.choices.length >= this.pokemon.length;
		return this.choiceData.choices.length >= this.active.length;
	};
	BattleSide.prototype.chooseMove = function (data, targetLoc, willMega, dontPlay) {
		if (!targetLoc) targetLoc = 0;
		const activePokemon = this.active[this.choiceData.choices.length];

		/**
		 *  Parse the move identifier (name or index), according to the request sent to the client.
		 *  If the move is not found, the decision is invalid without requiring further inspection.
		 */

		const requestMoves = activePokemon.getRequestData().moves;
		let moveid = data;
		let targetType = '';
		if (typeof data === 'number' || /^[0-9]+$/.test(data)) {
			// Parse a one-based move index.
			const moveIndex = +data - 1;
			if (moveIndex < 0 || moveIndex >= requestMoves.length || !requestMoves[moveIndex]) {
				this.battle.debug("Can't use an unexpected move");
				return false;
			}
			moveid = requestMoves[moveIndex].id;
			targetType = requestMoves[moveIndex].target;
		} else {
			// Parse a move ID.
			// Move names are also allowed, but may cause ambiguity (see client issue #167).
			moveid = toId(data);
			if (moveid.startsWith('hiddenpower')) {
				moveid = 'hiddenpower';
			}
			for (let i = 0; i < requestMoves.length; i++) {
				if (requestMoves[i].id !== moveid) continue;
				targetType = requestMoves[i].target;
				break;
			}
			if (!targetType) {
				this.battle.debug("Can't use an unexpected move");
				return false;
			}
		}

		/**
		 * Validate targetting
		 */

		if (this.battle.targetTypeChoices(targetType)) {
			if (!targetLoc && this.active.length >= 2) {
				this.battle.debug("Can't use the move without a target");
				return false;
			}
		} else {
			if (targetLoc) {
				this.battle.debug("Can't specify a target for the move");
				return false;
			}
		}

		if (targetLoc && !this.battle.validTargetLoc(targetLoc, activePokemon, targetType)) {
			this.battle.debug("Invalid target selected for the move");
			return false;
		}

		/**
		 *  Check whether the chosen move is really valid, accounting for
		 *  effects active in battle which could be unknown for the client.
		 *  Upon reaching this stage, if a new decision is required, a server
		 *  reply is mandatory.
		 */

		const moves = activePokemon.getMoves();
		if (!moves.length) {
			// Override decision and use Struggle if there are no enabled moves with PP
			// Gen 4 and earlier announce a Pokemon has no moves left before the turn begins, and only to that player's side.
			if (this.gen <= 4) this.send('-activate', activePokemon, 'move: Struggle');
			moveid = 'struggle';
		} else {
			// At least a move is valid. Check if the chosen one is.
			// This may include Struggle in Hackmons.
			let isEnabled = false;
			let disabledSource = '';
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].id !== moveid) continue;
				if (!moves[i].disabled) {
					isEnabled = true;
					break;
				} else if (moves[i].disabledSource) {
					disabledSource = moves[i].disabledSource;
				}
			}
			if (!isEnabled) {
				// Request a different choice
				this.emitCallback('cant', activePokemon, disabledSource, moveid);
				return false;
			}
			// The chosen move is valid yay
		}

		if (activePokemon.maybeDisabled) {
			this.choiceData.finalDecision = this.choiceData.finalDecision || activePokemon.isLastActive();
		}

		this.choiceData.choices.push('move ' + moveid + (targetLoc ? ' ' + targetLoc : '') + (willMega ? ' mega' : ''));

		const decision = [];
		if (willMega) {
			// TODO: Check that the Pokémon is not affected by Sky Drop.
			// (This is currently being done in `runMegaEvo`).
			decision.push({
				choice: 'megaEvo',
				pokemon: activePokemon,
			});
		}
		decision.push({
			choice: 'move',
			pokemon: activePokemon,
			targetLoc: targetLoc,
			move: moveid,
		});
		this.choiceData.decisions.push(decision);

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};
	BattleSide.prototype.chooseSwitch = function (data, index, dontPlay) {
		const slot = +data - 1;
		if (slot >= this.pokemon.length || !this.pokemon[slot]) {
			this.battle.debug("Can't switch: You can't switch to a Pokémon that doesn't exist");
			return false;
		}
		if (slot < this.active.length) {
			this.battle.debug("Can't switch: You can't switch to an active Pokémon");
			return false;
		}
		if (this.pokemon[slot].fainted) {
			this.battle.debug("Can't switch: You can't switch to a fainted Pokémon");
			return false;
		}
		if (this.choiceData.enterIndices.has(slot)) {
			this.battle.debug("Can't switch: You can't switch to a Pokémon already queued to be switched");
			return false;
		}

		if (typeof index === 'undefined') index = this.choiceData.choices.length;
		if (index < this.choiceData.choices.length && this.choiceData.choices[index] !== 'skip') {
			this.battle.debug("Can't switch: You can't override the decision for a Pokémon.");
			return false;
		}

		const activePokemon = this.active[index];
		if (this.currentRequest === 'move') {
			if (activePokemon.trapped) {
				this.battle.debug("Can't switch: The active Pokémon is trapped");
				this.emitCallback('trapped', activePokemon.position);
				return false;
			} else if (activePokemon.maybeTrapped) {
				this.choiceData.finalDecision = this.choiceData.finalDecision || activePokemon.isLastActive();
			}
		} else if (this.currentRequest === 'switch') {
			if (this.choiceData.switchCounters.switch[0] >= this.choiceData.switchCounters.switch[1]) {
				this.battle.debug("Can't switch: You can't switch in more Pokémon than there are available.");
				return false;
			}
			this.choiceData.switchCounters.switch[0]++;
		}

		this.choiceData.enterIndices.add(slot);
		this.choiceData.leaveIndices.add(activePokemon.position);

		this.choiceData.choices[index] = 'switch ' + data;
		this.choiceData.decisions[index] = {
			choice: (this.currentRequest === 'switch' ? 'instaswitch' : 'switch'),
			pokemon: activePokemon,
			target: this.pokemon[slot],
		};
		this.choiceData.skipsIndices.delete(index);

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};
	BattleSide.prototype.chooseTeam = function (data, dontPlay) {
		const positions = ('' + data).split('').map(datum => +datum - 1);

		for (const pos of positions) {
			const choiceOffset = this.choiceData.choices.length;
			if (pos >= this.pokemon.length) return false;
			if (this.choiceData.decisions.some(decision => decision.pokemon.position === pos)) return false;

			this.choiceData.choices.push('team ' + (pos + 1));
			this.choiceData.decisions.push({
				choice: 'team',
				side: this,
				index: choiceOffset,
				pokemon: this.pokemon[pos],
				priority: -choiceOffset,
			});
		}

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};
	BattleSide.prototype.chooseShift = function (dontPlay) {
		const activePokemon = this.active[this.choiceData.choices.length];

		this.choiceData.choices.push('shift');
		this.choiceData.decisions.push({
			choice: 'shift',
			pokemon: activePokemon,
		});

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};

	BattleSide.prototype.undoChoices = function (count, nextIndex) {
		if (count === 0 || !this.choiceData.choices.length) return null;
		if (count === true) count = this.choiceData.choices.length;
		if (nextIndex === undefined) nextIndex = this.choiceData.choices.length;
		if (count > nextIndex) return null;

		for (let i = 1; i <= count; i++) {
			this.undoChoice(nextIndex - i);
		}
	};

	BattleSide.prototype.undoChoice = function (index) {
		const decision = this.choiceData.decisions.splice(index, 1)[0];
		if (decision.choice === 'switch' || decision.choice === 'instaswitch') {
			this.choiceData.enterIndices.delete(decision.target.position);
			this.choiceData.leaveIndices.delete(this.choiceData.decisions.length);
			if (this.currentRequest === 'switch') {
				this.choiceData.switchCounters.switch[0]--;
			}
		} else if (decision.choice === 'pass') {
			if (this.currentRequest === 'switch' && decision.pokemon && decision.pokemon.switchFlag) {
				this.choiceData.switchCounters.pass[0]--;
			}
		} else if (this.currentRequest !== 'switch') {
			if (index !== this.choiceData.decisions.length) throw new Error(`Undoing decisions except the last during ${this.currentRequest} phase is unsupported (${index} !== ${this.choiceData.decisions.length})`);
		}
		this.choiceData.choices.splice(index, 1);
	};
	BattleSide.prototype.clearChoice = function () {
		const canSwitchOut = this.active.filter(pokemon => pokemon && pokemon.switchFlag).length;
		const canSwitchIn = this.pokemon.slice(this.active.length).filter(pokemon => pokemon && !pokemon.fainted).length;
		this.choiceData = {
			finalDecision: false,
			choices: [],
			decisions: [],

			switchCounters: {
				'switch': [0, this.battle.currentRequest !== 'switch' ? 0 : Math.min(canSwitchOut, canSwitchIn)],
				'pass': [0, this.battle.currentRequest !== 'switch' ? 0 : canSwitchOut - Math.min(canSwitchOut, canSwitchIn)],
				// When all the decisions go through, it should happen that
				// (switch|pass)Counter[0] === (switch|pass)Counter[1]
				// Otherwise, a player could illegally skip a turn.
				// TODO: Cover this in the test suite.
			},
			enterIndices: new Set(),
			leaveIndices: new Set(),
			skipsIndices: new Set(),
		};
	};

	// Special choices
	BattleSide.prototype.choosePass = function (index, dontPlay) {
		if (typeof index === 'undefined') index = this.choiceData.choices.length;
		if (index < this.choiceData.choices.length && this.choiceData.choices[index] !== 'skip') {
			this.battle.debug("Can't pass: You can't override the decision for a Pokémon.");
			return false;
		}

		const pokemon = this.active[index];

		if (this.currentRequest === 'switch') {
			if (pokemon && pokemon.switchFlag) { // This condition will always happen if called by Battle#choose()
				if (this.choiceData.switchCounters.pass[0] >= this.choiceData.switchCounters.pass[1]) {
					this.battle.debug("Can't pass: You can't skip switching Pokémon in needlessly.");
					return false;
				}
				this.choiceData.switchCounters.pass[0]++;
			}
		}

		this.choiceData.choices[index] = 'pass';
		this.choiceData.decisions[index] = {
			choice: 'pass',
			priority: 102,
			pokemon: pokemon,
		};
		this.choiceData.skipsIndices.delete(this.choiceData.choices.length);

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};
	BattleSide.prototype.chooseSkip = function (index) {
		if (this.currentRequest !== 'switch') {
			this.battle.debug("Can't skip a Pokémon action");
			return false;
		}
		if (this.active.pokemon.filter(pokemon => pokemon && pokemon.switchFlag).length <= 1) {
			this.battle.debug("Can't skip a Pokémon action except in a multiple K.O.");
			return false;
		}
		if (index !== this.choiceData.choices.length) {
			return this;
		}

		this.choiceData.choices.push('skip');
		this.choiceData.decisions.push({
			// Should never hit the battle queue
			choice: 'skip',
			pokemon: this.active[this.choiceData.choices.length],
		});
		this.choiceData.skipsIndices.add(this.choiceData.choices.length);

		return this;
	};
	BattleSide.prototype.chooseDefault = function (dontPlay) {
		const choiceOffset = this.choiceData.choices.length;
		if (this.currentRequest === 'teampreview') {
			const chosenPositions = new Set(this.choiceData.decisions.map(decision => decision.pokemon.position));
			const leftPositions = '012345'.slice(0, this.pokemon.length).split('').filter(pos => !chosenPositions.has(pos));

			for (let i = 0; i < leftPositions.length; i++) {
				const pos = leftPositions[i];
				this.choiceData.choices.push('team ' + (pos + 1));
				this.choiceData.decisions.push({
					choice: 'team',
					side: this,
					pokemon: this.pokemon[pos],
					index: choiceOffset + i,
					priority: -choiceOffset - i,
				});
			}
		} else if (this.currentRequest === 'switch') {
			this.choiceData.choices.length = this.active.length;
			this.choiceData.decisions.length = this.active.length;
			const leaveIndices = [];
			const enterIndices = [];

			for (let i = 0; i < this.pokemon.length; i++) {
				if (!this.pokemon[i]) continue;
				if (i < this.choiceData.choices.length && this.choiceData.choices[i] && this.choiceData.choices[i] !== 'skip') {
					// Already decided
					continue;
				}
				if (i < this.active.length) {
					if (!this.pokemon[i].switchFlag || this.choiceData.leaveIndices.has(i)) continue;
					leaveIndices.push(i);
					this.choiceData.leaveIndices.add(i);
				} else {
					if (this.pokemon[i].fainted || this.choiceData.enterIndices.has(i)) continue;
					enterIndices.push(i);
					this.choiceData.enterIndices.add(i);
				}
			}

			// Some Pokémon might not have available substitutes.
			const willPass = leaveIndices.splice(Math.min(leaveIndices.length, enterIndices.length));
			for (let i = 0; i < leaveIndices.length; i++) {
				this.choiceData.decisions[leaveIndices[i]] = {
					choice: this.foe.currentRequest === 'switch' ? 'instaswitch' : 'switch',
					pokemon: this.active[leaveIndices[i]],
					target: this.pokemon[enterIndices[i]],
				};
				this.choiceData.choices[leaveIndices[i]] = 'switch ' + (enterIndices[i] + 1);
			}
			for (let i = 0; i < willPass.length; i++) {
				this.choiceData.decisions[willPass[i]] = {
					choice: 'pass',
					pokemon: this.active[willPass[i]],
					priority: 102,
				};
				this.choiceData.choices[willPass[i]] = 'pass';
			}
		} else if (this.currentRequest === 'move') {
			for (let i = choiceOffset; i < this.active.length; i++) {
				let pokemon = this.active[i];
				if (!pokemon || pokemon.fainted) continue;

				let lockedMove = pokemon.getLockedMove();
				if (lockedMove) {
					const lockedMoveTarget = this.battle.runEvent('LockMoveTarget', pokemon);
					this.choiceData.choices.push('move ' + lockedMove + (typeof lockedMoveTarget === 'number' ? ' ' + lockedMoveTarget : ''));
					this.choiceData.decisions.push({
						choice: 'move',
						pokemon: pokemon,
						targetLoc: lockedMoveTarget || 0,
						move: lockedMove,
					});
					continue;
				}

				let moveid = 'struggle';
				let moves = pokemon.getMoves();
				for (let j = 0; j < moves.length; j++) {
					if (moves[j].disabled) continue;
					moveid = moves[j].id;
					break;
				}
				this.choiceData.choices.push('move ' + moveid + ' 0');
				this.choiceData.decisions.push({
					choice: 'move',
					pokemon: pokemon,
					targetLoc: 0,
					move: moveid,
				});
			}
		}

		if (!dontPlay && !this.battle.checkDecisions()) return this; // allow chaining
		return true;
	};

	BattleSide.prototype.resolveDecision = function () {
		if (this.currentRequest && !this.getDecisionsFinished()) {
			this.chooseDefault(true);
			this.choiceData.choices = [];
		} else if (this.choiceData.decisions === true) {
			this.choiceData.choices = [];
		}
	};

	BattleSide.prototype.destroy = function () {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (let i = 0; i < this.pokemon.length; i++) {
			if (this.pokemon[i]) this.pokemon[i].destroy();
			this.pokemon[i] = null;
		}
		this.pokemon = null;
		for (let i = 0; i < this.active.length; i++) {
			this.active[i] = null;
		}
		this.active = null;

		if (this.choiceData.decisions && this.choiceData.decisions !== true) {
			this.choiceData.decisions.forEach(decision => {
				delete decision.side;
				delete decision.pokemon;
				delete decision.target;
			});
		}
		this.choiceData = null;

		// get rid of some possibly-circular references
		this.battle = null;
		this.foe = null;
	};
	return BattleSide;
})();

Battle = (() => {
	let Battle = {};

	Battle.construct = (() => {
		let battleProtoCache = new Map();
		return (roomid, formatarg, rated) => {
			let format = Tools.getFormat(formatarg);
			let mod = format.mod || 'base';
			if (!battleProtoCache.has(mod)) {
				// Scripts overrides Battle overrides Scripts overrides Tools
				let tools = Tools.mod(mod);
				let proto = Object.create(tools);
				Object.assign(proto, Battle.prototype);
				let battle = Object.create(proto);
				tools.install(battle);
				battleProtoCache.set(mod, battle);
			}
			let battle = Object.create(battleProtoCache.get(mod));
			Battle.prototype.init.call(battle, roomid, format, rated);
			return battle;
		};
	})();

	Battle.logReplay = function (data, isReplay) {
		if (isReplay === true) return data;
		return '';
	};

	Battle.prototype = {};

	Battle.prototype.init = function (roomid, format, rated) {
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

		this.startingSeed = this.generateSeed();
	};

	Battle.prototype.turn = 0;
	Battle.prototype.p1 = null;
	Battle.prototype.p2 = null;
	Battle.prototype.lastUpdate = 0;
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
	Battle.prototype.currentRequestDetails = '';
	Battle.prototype.rqid = 0;
	Battle.prototype.lastMoveLine = 0;
	Battle.prototype.reportPercentages = false;
	Battle.prototype.supportCancel = false;
	Battle.prototype.events = null;

	Battle.prototype.abilityOrder = 0;

	Battle.prototype.toString = function () {
		return 'Battle: ' + this.format;
	};

	Battle.prototype.generateSeed = function () {
		// use a random initial seed (64-bit, [high -> low])
		this.seed = [
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
		];
		return this.seed;
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
		let result = this.seed >>> 16; // the first 16 bits of the seed are the random value
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
		let result = (this.seed[0] << 16 >>> 0) + this.seed[1]; // Use the upper 32 bits
		m = Math.floor(m);
		n = Math.floor(n);
		result = (m ? (n ? Math.floor(result * (n - m) / 0x100000000) + m : Math.floor(result * m / 0x100000000)) : result / 0x100000000);
		this.debug('randBW(' + (m ? (n ? m + ', ' + n : m) : '') + ') = ' + result);
		return result;
	};

	Battle.prototype.nextFrame = function (n) {
		let seed = this.seed;
		n = n || 1;
		for (let frame = 0; frame < n; ++frame) {
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

			let a = [0x5D58, 0x8B65, 0x6C07, 0x8965];
			let c = [0, 0, 0x26, 0x9EC3];

			let nextSeed = [0, 0, 0, 0];
			let carry = 0;

			for (let cN = seed.length - 1; cN >= 0; --cN) {
				nextSeed[cN] = carry;
				carry = 0;

				let aN = seed.length - 1;
				let seedN = cN;
				for (; seedN < seed.length; --aN, ++seedN) {
					let nextWord = a[aN] * seed[seedN];
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

		if (this.weather === status.id && (this.gen > 2 || status.id === 'sandstorm')) {
			return false;
		}
		if (status.id) {
			let result = this.runEvent('SetWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if (sourceEffect && sourceEffect.weather) {
						this.add('-fail', source, sourceEffect, '[from]: ' + this.weather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.add('-ability', source, sourceEffect, '[from] ' + this.weather, '[fail]');
					}
				}
				return null;
			}
		}
		if (this.weather && !status.id) {
			let oldstatus = this.getWeather();
			this.singleEvent('End', oldstatus, this.weatherData, this);
		}
		let prevWeather = this.weather;
		let prevWeatherData = this.weatherData;
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
		return true;
	};
	Battle.prototype.clearWeather = function () {
		return this.setWeather('');
	};
	Battle.prototype.effectiveWeather = function (target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (this.suppressingWeather()) return '';
		return this.weather;
	};
	Battle.prototype.isWeather = function (weather, target) {
		let ourWeather = this.effectiveWeather(target);
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return weather.map(toId).includes(ourWeather);
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
			let oldstatus = this.getTerrain();
			this.singleEvent('End', oldstatus, this.terrainData, this);
		}
		let prevTerrain = this.terrain;
		let prevTerrainData = this.terrainData;
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
		let ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toId(terrain);
		}
		return terrain.map(toId).includes(ourTerrain);
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
		return true;
	};
	Battle.prototype.suppressingAttackEvents = function () {
		return (this.activePokemon && this.activePokemon.isActive && !this.activePokemon.ignoringAbility() && this.activePokemon.getAbility().stopAttackEvents);
	};
	Battle.prototype.suppressingWeather = function () {
		let pokemon;
		for (let i = 0; i < this.sides.length; i++) {
			for (let j = 0; j < this.sides[i].active.length; j++) {
				pokemon = this.sides[i].active[j];
				if (pokemon && !pokemon.ignoringAbility() && pokemon.getAbility().suppressWeather) {
					return true;
				}
			}
		}
		return false;
	};
	Battle.prototype.setActiveMove = function (move, pokemon, target) {
		if (!move) move = null;
		if (!pokemon) pokemon = null;
		if (!target) target = pokemon;
		this.activeMove = move;
		this.activePokemon = pokemon;
		this.activeTarget = target;
	};
	Battle.prototype.clearActiveMove = function (failed) {
		if (this.activeMove) {
			if (!failed) {
				this.lastMove = this.activeMove.id;
			}
			this.activeMove = null;
			this.activePokemon = null;
			this.activeTarget = null;
		}
	};

	Battle.prototype.updateSpeed = function () {
		let actives = this.p1.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
		actives = this.p2.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
	};

	// intentionally not in Battle.prototype
	Battle.comparePriority = function (a, b) {
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
	// also not in Battle.prototype
	Battle.compareRedirectOrder = function (a, b) {
		a.priority = a.priority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.speed = b.speed || 0;
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.thing.abilityOrder - a.thing.abilityOrder) {
			return -(b.thing.abilityOrder - a.thing.abilityOrder);
		}
		return 0;
	};
	Battle.prototype.getResidualStatuses = function (thing, callbackType) {
		let statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		//if (statuses[0]) this.debug('match ' + (callbackType || 'residualCallback') + ': ' + statuses[0].status.id);
		return statuses;
	};
	Battle.prototype.eachEvent = function (eventid, effect, relayVar) {
		let actives = [];
		if (!effect && this.effect) effect = this.effect;
		for (let i = 0; i < this.sides.length; i++) {
			let side = this.sides[i];
			for (let j = 0; j < side.active.length; j++) {
				if (side.active[j]) actives.push(side.active[j]);
			}
		}
		actives.sort((a, b) => {
			if (b.speed - a.speed) {
				return b.speed - a.speed;
			}
			return Math.random() - 0.5;
		});
		for (let i = 0; i < actives.length; i++) {
			if (actives[i].isStarted) {
				this.runEvent(eventid, actives[i], null, effect, relayVar);
			}
		}
	};
	Battle.prototype.residualEvent = function (eventid, relayVar) {
		let statuses = this.getRelevantEffectsInner(this, 'on' + eventid, null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		while (statuses.length) {
			let statusObj = statuses.shift();
			let status = statusObj.status;
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
		}
		//this.add('Event: ' + eventid + ' (depth ' + this.eventDepth + ')');
		effect = this.getEffect(effect);
		let hasRelayVar = true;
		if (relayVar === undefined) {
			relayVar = true;
			hasRelayVar = false;
		}

		if (effect.effectType === 'Status' && target.status !== effect.id) {
			// it's changed; call it off
			return relayVar;
		}
		if (eventid !== 'Start' && eventid !== 'TakeItem' && eventid !== 'Primal' && effect.effectType === 'Item' && (target instanceof BattlePokemon) && target.ignoringItem()) {
			this.debug(eventid + ' handler suppressed by Embargo, Klutz or Magic Room');
			return relayVar;
		}
		if (eventid !== 'End' && effect.effectType === 'Ability' && (target instanceof BattlePokemon) && target.ignoringAbility()) {
			this.debug(eventid + ' handler suppressed by Gastro Acid');
			return relayVar;
		}
		if (effect.effectType === 'Weather' && eventid !== 'Start' && eventid !== 'Residual' && eventid !== 'End' && this.suppressingWeather()) {
			this.debug(eventid + ' handler suppressed by Air Lock');
			return relayVar;
		}

		if (effect['on' + eventid] === undefined) return relayVar;
		let parentEffect = this.effect;
		let parentEffectData = this.effectData;
		let parentEvent = this.event;
		this.effect = effect;
		this.effectData = effectData;
		this.event = {id: eventid, target: target, source: source, effect: sourceEffect};
		this.eventDepth++;
		let args = [target, source, sourceEffect];
		if (hasRelayVar) args.unshift(relayVar);
		let returnVal;
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
	Battle.prototype.runEvent = function (eventid, target, source, effect, relayVar, onEffect, fastExit) {
		// if (Battle.eventCounter) {
		// 	if (!Battle.eventCounter[eventid]) Battle.eventCounter[eventid] = 0;
		// 	Battle.eventCounter[eventid]++;
		// }
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
		}
		if (!target) target = this;
		let statuses = this.getRelevantEffects(target, 'on' + eventid, 'onSource' + eventid, source);
		if (fastExit) {
			statuses.sort(Battle.compareRedirectOrder);
		} else {
			statuses.sort(Battle.comparePriority);
		}
		let hasRelayVar = true;
		effect = this.getEffect(effect);
		let args = [target, source, effect];
		//console.log('Event: ' + eventid + ' (depth ' + this.eventDepth + ') t:' + target.id + ' s:' + (!source || source.id) + ' e:' + effect.id);
		if (relayVar === undefined || relayVar === null) {
			relayVar = true;
			hasRelayVar = false;
		} else {
			args.unshift(relayVar);
		}

		let parentEvent = this.event;
		this.event = {id: eventid, target: target, source: source, effect: effect, modifier: 1};
		this.eventDepth++;

		if (onEffect && 'on' + eventid in effect) {
			statuses.unshift({status: effect, callback: effect['on' + eventid], statusData: {}, end: null, thing: target});
		}
		for (let i = 0; i < statuses.length; i++) {
			let status = statuses[i].status;
			let thing = statuses[i].thing;
			//this.debug('match ' + eventid + ': ' + status.id + ' ' + status.effectType);
			if (status.effectType === 'Status' && thing.status !== status.id) {
				// it's changed; call it off
				continue;
			}
			if (status.effectType === 'Ability' && this.suppressingAttackEvents() && this.activePokemon !== thing) {
				// ignore attacking events
				let AttackingEvents = {
					BeforeMove: 1,
					BasePower: 1,
					Immunity: 1,
					RedirectTarget: 1,
					Heal: 1,
					SetStatus: 1,
					CriticalHit: 1,
					ModifyAtk: 1, ModifyDef: 1, ModifySpA: 1, ModifySpD: 1, ModifySpe: 1, ModifyAccuracy: 1,
					ModifyBoost: 1,
					ModifyDamage: 1,
					ModifySecondaries: 1,
					ModifyWeight: 1,
					TryHit: 1,
					TryHitSide: 1,
					TryMove: 1,
					Boost: 1,
					DragOut: 1,
				};
				if (eventid in AttackingEvents) {
					this.debug(eventid + ' handler suppressed by Mold Breaker');
					continue;
				} else if (eventid === 'Damage' && effect && effect.effectType === 'Move') {
					this.debug(eventid + ' handler suppressed by Mold Breaker');
					continue;
				}
			}
			if (eventid !== 'Start' && eventid !== 'SwitchIn' && eventid !== 'TakeItem' && status.effectType === 'Item' && (thing instanceof BattlePokemon) && thing.ignoringItem()) {
				if (eventid !== 'Update') {
					this.debug(eventid + ' handler suppressed by Embargo, Klutz or Magic Room');
				}
				continue;
			} else if (eventid !== 'End' && status.effectType === 'Ability' && (thing instanceof BattlePokemon) && thing.ignoringAbility()) {
				if (eventid !== 'Update') {
					this.debug(eventid + ' handler suppressed by Gastro Acid');
				}
				continue;
			}
			if ((status.effectType === 'Weather' || eventid === 'Weather') && eventid !== 'Residual' && eventid !== 'End' && this.suppressingWeather()) {
				this.debug(eventid + ' handler suppressed by Air Lock');
				continue;
			}
			let returnVal;
			if (typeof statuses[i].callback === 'function') {
				let parentEffect = this.effect;
				let parentEffectData = this.effectData;
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
				if (!relayVar || fastExit) break;
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
	/**
	 * priorityEvent works just like runEvent, except it exits and returns
	 * on the first non-undefined value instead of only on null/false.
	 */
	Battle.prototype.priorityEvent = function (eventid, target, source, effect, relayVar, onEffect) {
		return this.runEvent(eventid, target, source, effect, relayVar, onEffect, true);
	};
	Battle.prototype.resolveLastPriority = function (statuses, callbackType) {
		let order = false;
		let priority = 0;
		let subOrder = 0;
		let status = statuses[statuses.length - 1];
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
	Battle.prototype.getRelevantEffects = function (thing, callbackType, foeCallbackType, foeThing) {
		let statuses = this.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		//if (statuses[0]) this.debug('match ' + callbackType + ': ' + statuses[0].status.id);
		return statuses;
	};
	Battle.prototype.getRelevantEffectsInner = function (thing, callbackType, foeCallbackType, foeThing, bubbleUp, bubbleDown, getAll) {
		if (!callbackType || !thing) return [];
		let statuses = [];
		let status;

		if (thing.sides) {
			for (let i in this.pseudoWeather) {
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
				statuses.push({status: status, callback: status[callbackType], statusData: this.formatData, end: function () {}, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			if (this.events && this.events[callbackType] !== undefined) {
				for (let i = 0; i < this.events[callbackType].length; i++) {
					let handler = this.events[callbackType][i];
					let statusData;
					switch (handler.target.effectType) {
					case 'Format':
						statusData = this.formatData;
					}
					statuses.push({status: handler.target, callback: handler.callback, statusData: statusData, end: function () {}, thing: thing, priority: handler.priority, order: handler.order, subOrder: handler.subOrder});
				}
			}
			if (bubbleDown) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p1, callbackType, null, null, false, true, getAll));
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p2, callbackType, null, null, false, true, getAll));
			}
			return statuses;
		}

		if (thing.pokemon) {
			for (let i in thing.sideConditions) {
				status = thing.getSideCondition(i);
				if (status[callbackType] !== undefined || (getAll && thing.sideConditions[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: thing.sideConditions[i], end: thing.removeSideCondition, thing: thing});
					this.resolveLastPriority(statuses, callbackType);
				}
			}
			if (foeCallbackType) {
				statuses = statuses.concat(this.getRelevantEffectsInner(thing.foe, foeCallbackType, null, null, false, false, getAll));
				if (foeCallbackType.substr(0, 5) === 'onFoe') {
					let eventName = foeCallbackType.substr(5);
					statuses = statuses.concat(this.getRelevantEffectsInner(thing.foe, 'onAny' + eventName, null, null, false, false, getAll));
					statuses = statuses.concat(this.getRelevantEffectsInner(thing, 'onAny' + eventName, null, null, false, false, getAll));
				}
			}
			if (bubbleUp) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this, callbackType, null, null, true, false, getAll));
			}
			if (bubbleDown) {
				for (let i = 0; i < thing.active.length; i++) {
					statuses = statuses.concat(this.getRelevantEffectsInner(thing.active[i], callbackType, null, null, false, true, getAll));
				}
			}
			return statuses;
		}

		if (!thing.getStatus) {
			//this.debug(JSON.stringify(thing));
			return statuses;
		}
		status = thing.getStatus();
		if (status[callbackType] !== undefined || (getAll && thing.statusData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.statusData, end: thing.clearStatus, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		for (let i in thing.volatiles) {
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
			statuses.push({status: status, callback: status[callbackType], statusData: thing.speciesData, end: function () {}, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}

		if (foeThing && foeCallbackType && foeCallbackType.substr(0, 8) !== 'onSource') {
			statuses = statuses.concat(this.getRelevantEffectsInner(foeThing, foeCallbackType, null, null, false, false, getAll));
		} else if (foeCallbackType) {
			let foeActive = thing.side.foe.active;
			let allyActive = thing.side.active;
			let eventName = '';
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
				for (let i = 0; i < allyActive.length; i++) {
					if (!allyActive[i] || allyActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAlly' + eventName, null, null, false, false, getAll));
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
				for (let i = 0; i < foeActive.length; i++) {
					if (!foeActive[i] || foeActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
			}
			for (let i = 0; i < foeActive.length; i++) {
				if (!foeActive[i] || foeActive[i].fainted) continue;
				statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], foeCallbackType, null, null, false, false, getAll));
			}
		}
		if (bubbleUp) {
			statuses = statuses.concat(this.getRelevantEffectsInner(thing.side, callbackType, foeCallbackType, null, true, false, getAll));
		}
		return statuses;
	};
	/**
	 * Use this function to attach custom event handlers to a battle. See Battle#runEvent for
	 * more information on how to write callbacks for event handlers.
	 *
	 * Try to use this sparingly. Most event handlers can be simply placed in a format instead.
	 *
	 *     this.on(eventid, target, callback)
	 * will set the callback as an event handler for the target when eventid is called with the
	 * default priority. Currently only valid formats are supported as targets but this will
	 * eventually be expanded to support other target types.
	 *
	 *     this.on(eventid, target, priority, callback)
	 * will set the callback as an event handler for the target when eventid is called with the
	 * provided priority. Priority can either be a number or an object that contains the priority,
	 * order, and subOrder for the evend handler as needed (undefined keys will use default values)
	 */
	Battle.prototype.on = function (eventid, target /*[, priority], callback*/) {
		if (!eventid) throw new TypeError("Event handlers must have an event to listen to");
		if (!target) throw new TypeError("Event handlers must have a target");
		if (arguments.length < 3) throw new TypeError("Event handlers must have a callback");

		if (target.effectType !== 'Format') {
			throw new TypeError("" + target.effectType + " targets are not supported at this time");
		}

		let callback, priority, order, subOrder;
		if (arguments.length === 3) {
			callback = arguments[2];
			priority = 0;
			order = false;
			subOrder = 0;
		} else {
			callback = arguments[3];
			let data = arguments[2];
			if (typeof data === 'object') {
				priority = data['priority'] || 0;
				order = data['order'] || false;
				subOrder = data['subOrder'] || 0;
			} else {
				priority = data || 0;
				order = false;
				subOrder = 0;
			}
		}

		let eventHandler = {callback: callback, target: target, priority: priority, order: order, subOrder: subOrder};

		let callbackType = 'on' + eventid;
		if (!this.events) this.events = {};
		if (this.events[callbackType] === undefined) {
			this.events[callbackType] = [eventHandler];
		} else {
			this.events[callbackType].push(eventHandler);
		}
	};
	Battle.prototype.getPokemon = function (id) {
		if (typeof id !== 'string') id = id.id;
		for (let i = 0; i < this.p1.pokemon.length; i++) {
			let pokemon = this.p1.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		for (let i = 0; i < this.p2.pokemon.length; i++) {
			let pokemon = this.p2.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		return null;
	};
	Battle.prototype.makeRequest = function (type, requestDetails) {
		if (type) {
			this.currentRequest = type;
			this.currentRequestDetails = requestDetails || '';
			this.rqid++;
			this.p1.clearChoice();
			this.p2.clearChoice();
		} else {
			type = this.currentRequest;
			requestDetails = this.currentRequestDetails;
		}

		// default to no request
		let p1request = null;
		let p2request = null;
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';
		let switchTable = [];

		switch (type) {
		case 'switch': {
			for (let i = 0, l = this.p1.active.length; i < l; i++) {
				let active = this.p1.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.some(flag => flag === true)) {
				this.p1.currentRequest = 'switch';
				p1request = {forceSwitch: switchTable, side: this.p1.getData(), rqid: this.rqid};
			}
			switchTable = [];
			for (let i = 0, l = this.p2.active.length; i < l; i++) {
				let active = this.p2.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.some(flag => flag === true)) {
				this.p2.currentRequest = 'switch';
				p2request = {forceSwitch: switchTable, side: this.p2.getData(), rqid: this.rqid};
			}
			break;
		}

		case 'teampreview':
			this.add('teampreview' + (requestDetails ? '|' + requestDetails : ''));
			this.p1.currentRequest = 'teampreview';
			p1request = {teamPreview: true, side: this.p1.getData(), rqid: this.rqid};
			this.p2.currentRequest = 'teampreview';
			p2request = {teamPreview: true, side: this.p2.getData(), rqid: this.rqid};
			break;

		default: {
			this.p1.currentRequest = 'move';
			let activeData = this.p1.active.map(pokemon => pokemon && pokemon.getRequestData());
			p1request = {active: activeData, side: this.p1.getData(), rqid: this.rqid};

			this.p2.currentRequest = 'move';
			activeData = this.p2.active.map(pokemon => pokemon && pokemon.getRequestData());
			p2request = {active: activeData, side: this.p2.getData(), rqid: this.rqid};
			break;
		}

		}

		if (this.p1 && this.p2) {
			let inactiveSide = -1;
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
			if (!this.supportCancel || !p2request) p1request.noCancel = true;
			this.p1.emitRequest(p1request);
		} else {
			this.p1.choiceData.decisions = true;
			this.p1.emitRequest({wait: true, side: this.p1.getData()});
		}

		if (p2request) {
			if (!this.supportCancel || !p1request) p2request.noCancel = true;
			this.p2.emitRequest(p2request);
		} else {
			this.p2.choiceData.decisions = true;
			this.p2.emitRequest({wait: true, side: this.p2.getData()});
		}

		if (this.p1.getDecisionsFinished() && this.p2.getDecisionsFinished()) {
			if (this.p1.choiceData.decisions === true && this.p2.choiceData.decisions === true) {
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
		this.currentRequestDetails = '';
		return true;
	};
	Battle.prototype.switchIn = function (pokemon, pos) {
		if (!pokemon || pokemon.isActive) return false;
		if (!pos) pos = 0;
		let side = pokemon.side;
		if (pos >= side.active.length) {
			throw new Error("Invalid switch position");
		}
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			if (this.cancelMove(oldActive)) {
				for (let i = 0; i < side.foe.active.length; i++) {
					if (side.foe.active[i].isStale >= 2) {
						oldActive.isStaleCon++;
						oldActive.isStaleSource = 'drag';
						break;
					}
				}
			}
			if (oldActive.switchCopyFlag === 'copyvolatile') {
				delete oldActive.switchCopyFlag;
				pokemon.copyVolatileFrom(oldActive);
			}
		}
		pokemon.isActive = true;
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.usedItemThisTurn = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			this.cancelMove(oldActive);
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.activeTurns = 0;
		for (let m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('switch', pokemon, pokemon.getDetails);
		this.insertQueue({pokemon: pokemon, choice: 'runSwitch'});
	};
	Battle.prototype.canSwitch = function (side) {
		let canSwitchIn = [];
		for (let i = side.active.length; i < side.pokemon.length; i++) {
			let pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	};
	Battle.prototype.getRandomSwitchable = function (side) {
		let canSwitchIn = [];
		for (let i = side.active.length; i < side.pokemon.length; i++) {
			let pokemon = side.pokemon[i];
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
		let pokemon = this.getRandomSwitchable(side);
		if (!pos) pos = 0;
		if (!pokemon || pokemon.isActive) return false;
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			if (!oldActive.hp) {
				return false;
			}
			if (!this.runEvent('DragOut', oldActive)) {
				return false;
			}
			this.runEvent('SwitchOut', oldActive);
			this.singleEvent('End', this.getAbility(oldActive.ability), oldActive.abilityData, oldActive);
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.usedItemThisTurn = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			if (this.cancelMove(oldActive)) {
				for (let i = 0; i < side.foe.active.length; i++) {
					if (side.foe.active[i].isStale >= 2) {
						oldActive.isStaleCon++;
						oldActive.isStaleSource = 'drag';
						break;
					}
				}
			}
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		if (this.gen === 2) pokemon.draggedIn = this.turn;
		for (let m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('drag', pokemon, pokemon.getDetails);
		if (this.gen >= 5) {
			this.runEvent('SwitchIn', pokemon);
			if (!pokemon.hp) return true;
			pokemon.isStarted = true;
			if (!pokemon.fainted) {
				this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityData, pokemon);
				this.singleEvent('Start', pokemon.getItem(), pokemon.itemData, pokemon);
			}
		} else {
			this.insertQueue({pokemon: pokemon, choice: 'runSwitch'});
		}
		return true;
	};
	Battle.prototype.swapPosition = function (pokemon, slot, attributes) {
		if (slot >= pokemon.side.active.length) {
			throw new Error("Invalid swap position");
		}
		let target = pokemon.side.active[slot];
		if (slot !== 1 && (!target || target.fainted)) return false;

		this.add('swap', pokemon, slot, attributes || '');

		let side = pokemon.side;
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
		let allStale = true;
		let oneStale = false;
		for (let i = 0; i < this.sides.length; i++) {
			for (let j = 0; j < this.sides[i].active.length; j++) {
				let pokemon = this.sides[i].active[j];
				if (!pokemon) continue;
				pokemon.moveThisTurn = '';
				pokemon.usedItemThisTurn = false;
				pokemon.newlySwitched = false;

				pokemon.maybeDisabled = false;
				for (let entry of pokemon.moveset) {
					entry.disabled = false;
					entry.disabledSource = '';
				}
				this.runEvent('DisableMove', pokemon);
				if (!pokemon.ateBerry) pokemon.disableMove('belch');

				if (pokemon.lastAttackedBy) {
					if (pokemon.lastAttackedBy.pokemon.isActive) {
						pokemon.lastAttackedBy.thisTurn = false;
					} else {
						pokemon.lastAttackedBy = null;
					}
				}

				pokemon.trapped = pokemon.maybeTrapped = false;
				this.runEvent('TrapPokemon', pokemon);
				if (!pokemon.knownType || this.getImmunity('trapped', pokemon)) {
					this.runEvent('MaybeTrapPokemon', pokemon);
				}
				// Disable the faculty to cancel switches if a foe may have a trapping ability
				let foeSide = pokemon.side.foe;
				for (let k = 0; k < foeSide.active.length; ++k) {
					let source = foeSide.active[k];
					if (!source || source.fainted) continue;
					let template = (source.illusion || source).template;
					if (!template.abilities) continue;
					for (let abilitySlot in template.abilities) {
						let abilityName = template.abilities[abilitySlot];
						if (abilityName === source.ability) {
							// pokemon event was already run above so we don't need
							// to run it again.
							continue;
						}
						let banlistTable = this.getFormat().banlistTable;
						if (banlistTable && !('illegal' in banlistTable) && !this.getFormat().team) {
							// hackmons format
							continue;
						} else if (abilitySlot === 'H' && template.unreleasedHidden) {
							// unreleased hidden ability
							continue;
						}
						let ability = this.getAbility(abilityName);
						if (banlistTable && ability.id in banlistTable) continue;
						if (pokemon.knownType && !this.getImmunity('trapped', pokemon)) continue;
						this.singleEvent('FoeMaybeTrapPokemon',
							ability, {}, pokemon, source);
					}
				}

				if (pokemon.fainted) continue;
				if (pokemon.isStale < 2) {
					if (pokemon.isStaleCon >= 2) {
						if (pokemon.hp >= pokemon.isStaleHP - pokemon.maxhp / 100) {
							pokemon.isStale++;
							if (this.firstStaleWarned && pokemon.isStale < 2) {
								switch (pokemon.isStaleSource) {
								case 'struggle':
									this.add('html', '<div class="broadcast-red">' + this.escapeHTML(pokemon.name) + ' isn\'t losing HP from Struggle. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'drag':
									this.add('html', '<div class="broadcast-red">' + this.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from being forced to switch. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'switch':
									this.add('html', '<div class="broadcast-red">' + this.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from repeatedly switching. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								}
							}
						}
						pokemon.isStaleCon = 0;
						pokemon.isStalePPTurns = 0;
						pokemon.isStaleHP = pokemon.hp;
					}
					if (pokemon.isStalePPTurns >= 5) {
						if (pokemon.hp >= pokemon.isStaleHP - pokemon.maxhp / 100) {
							pokemon.isStale++;
							pokemon.isStaleSource = 'ppstall';
							if (this.firstStaleWarned && pokemon.isStale < 2) {
								this.add('html', '<div class="broadcast-red">' + this.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP. If it keeps on not losing PP or HP, it will be classified as being in an endless loop.</div>');
							}
						}
						pokemon.isStaleCon = 0;
						pokemon.isStalePPTurns = 0;
						pokemon.isStaleHP = pokemon.hp;
					}
				}
				if (pokemon.getMoves().length === 0) {
					pokemon.isStaleCon++;
					pokemon.isStaleSource = 'struggle';
				}
				if (pokemon.isStale < 2) {
					allStale = false;
				} else if (pokemon.isStale && !pokemon.staleWarned) {
					oneStale = pokemon;
				}
				if (!pokemon.isStalePPTurns) {
					pokemon.isStaleHP = pokemon.hp;
					if (pokemon.activeTurns) pokemon.isStaleCon = 0;
				}
				if (pokemon.activeTurns) {
					pokemon.isStalePPTurns++;
				}
				pokemon.activeTurns++;
			}
			this.sides[i].faintedLastTurn = this.sides[i].faintedThisTurn;
			this.sides[i].faintedThisTurn = false;
		}
		let banlistTable = this.getFormat().banlistTable;
		if (banlistTable && 'Rule:endlessbattleclause' in banlistTable) {
			if (oneStale) {
				let activationWarning = '<br />If all active Pok&eacute;mon go in an endless loop, Endless Battle Clause will activate.';
				if (allStale) activationWarning = '';
				let loopReason = '';
				switch (oneStale.isStaleSource) {
				case 'struggle':
					loopReason = ": it isn't losing HP from Struggle";
					break;
				case 'drag':
					loopReason = ": it isn't losing PP or HP from being forced to switch";
					break;
				case 'switch':
					loopReason = ": it isn't losing PP or HP from repeatedly switching";
					break;
				case 'getleppa':
					loopReason = ": it got a Leppa Berry it didn't start with";
					break;
				case 'useleppa':
					loopReason = ": it used a Leppa Berry it didn't start with";
					break;
				case 'ppstall':
					loopReason = ": it isn't losing PP or HP";
					break;
				case 'ppoverflow':
					loopReason = ": its PP overflowed";
					break;
				}
				this.add('html', '<div class="broadcast-red">' + this.escapeHTML(oneStale.name) + ' is in an endless loop' + loopReason + '.' + activationWarning + '</div>');
				oneStale.staleWarned = true;
				this.firstStaleWarned = true;
			}
			if (allStale) {
				this.add('message', "All active Pok\u00e9mon are in an endless loop. Endless Battle Clause activated!");
				let leppaPokemon = null;
				for (let i = 0; i < this.sides.length; i++) {
					for (let j = 0; j < this.sides[i].pokemon.length; j++) {
						let pokemon = this.sides[i].pokemon[j];
						if (toId(pokemon.set.item) === 'leppaberry') {
							if (leppaPokemon) {
								leppaPokemon = null; // both sides have Leppa
								this.add('-message', "Both sides started with a Leppa Berry.");
							} else {
								leppaPokemon = pokemon;
							}
							break;
						}
					}
				}
				if (leppaPokemon) {
					this.add('-message', "" + leppaPokemon.side.name + "'s " + leppaPokemon.name + " started with a Leppa Berry and loses.");
					this.win(leppaPokemon.side.foe);
					return;
				}
				this.win();
				return;
			}
		} else {
			if (allStale && !this.staleWarned) {
				this.staleWarned = true;
				this.add('html', '<div class="broadcast-red">If this format had Endless Battle Clause, it would have activated.</div>');
			} else if (oneStale) {
				this.add('html', '<div class="broadcast-red">' + this.escapeHTML(oneStale.name) + ' is in an endless loop.</div>');
				oneStale.staleWarned = true;
			}
		}

		if (this.gameType === 'triples' && !this.sides.filter(side => side.pokemonLeft > 1).length) {
			// If both sides have one Pokemon left in triples and they are not adjacent, they are both moved to the center.
			let center = false;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					if (!this.sides[i].active[j] || this.sides[i].active[j].fainted) continue;
					if (this.sides[i].active[j].position === 1) break;
					this.swapPosition(this.sides[i].active[j], 1, '[silent]');
					center = true;
					break;
				}
			}
			if (center) this.add('-center');
		}

		this.add('turn', this.turn);

		this.makeRequest('move');
	};
	Battle.prototype.start = function () {
		if (this.active) return;

		if (!this.p1 || !this.p1.isActive || !this.p2 || !this.p2.isActive) {
			// need two players to start
			return;
		}

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

		let format = this.getFormat();
		Tools.mod(format.mod).getBanlistTable(format); // fill in format ruleset

		this.add('tier', format.name);
		if (this.rated) {
			this.add('rated');
		}
		this.add('seed', Battle.logReplay.bind(this, this.startingSeed.join(',')));

		if (format.onBegin) {
			format.onBegin.call(this);
		}
		if (format && format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				this.addPseudoWeather(format.ruleset[i]);
			}
		}

		if (!this.p1.pokemon[0] || !this.p2.pokemon[0]) {
			this.add('message', 'Battle not started: One of you has an empty team.');
			return;
		}

		this.residualEvent('TeamPreview');

		this.addQueue({choice: 'start'});
		this.midTurn = true;
		if (!this.currentRequest) this.go();
	};
	Battle.prototype.boost = function (boost, target, source, effect, isSecondary, isSelf) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!target.isActive) return false;
		effect = this.getEffect(effect);
		boost = this.runEvent('Boost', target, source, effect, Object.assign({}, boost));
		let success = null;
		let boosted = false;
		for (let i in boost) {
			let currentBoost = {};
			currentBoost[i] = boost[i];
			let boostBy = target.boostBy(currentBoost);
			let msg = '-boost';
			if (boost[i] < 0) {
				msg = '-unboost';
				boostBy = -boostBy;
			}
			if (boostBy) {
				success = true;
				switch (effect.id) {
				case 'bellydrum':
					this.add('-setboost', target, 'atk', target.boosts['atk'], '[from] move: Belly Drum');
					break;
				case 'bellydrum2':
					this.add(msg, target, i, boostBy, '[silent]');
					this.add('-hint', "In Gen 2, Belly Drum boosts by 2 when it fails.");
					break;
				case 'intimidate': case 'gooey':
					this.add(msg, target, i, boostBy);
					break;
				default:
					if (effect.effectType === 'Move') {
						this.add(msg, target, i, boostBy);
					} else {
						if (effect.effectType === 'Ability' && !boosted) {
							this.add('-ability', target, effect.name, 'boost');
							boosted = true;
						}
						this.add(msg, target, i, boostBy);
					}
					break;
				}
				this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			} else if (effect.effectType === 'Ability') {
				if (isSecondary) this.add(msg, target, i, boostBy);
			} else if (!isSecondary && !isSelf) {
				this.add(msg, target, i, boostBy);
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
		if (!target.isActive) return false;
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
			if (target.illusion && effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.debug('illusion cleared');
				target.illusion = null;
				this.add('replace', target, target.getDetails);
				this.add('-end', target, 'Illusion');
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
		case 'powder':
			this.add('-damage', target, target.getHealth, '[silent]');
			break;
		case 'confused':
			this.add('-damage', target, target.getHealth, '[from] confusion');
			break;
		default:
			if (effect.effectType === 'Move' || !name) {
				this.add('-damage', target, target.getHealth);
			} else if (source && (source !== target || effect.effectType === 'Ability')) {
				this.add('-damage', target, target.getHealth, '[from] ' + name, '[of] ' + source);
			} else {
				this.add('-damage', target, target.getHealth, '[from] ' + name);
			}
			break;
		}

		if (effect.drain && source) {
			this.heal(Math.ceil(damage * effect.drain[0] / effect.drain[1]), source, target, 'drain');
		}

		if (!effect.flags) effect.flags = {};

		if (instafaint && !target.hp) {
			this.debug('instafaint: ' + this.faintQueue.map(entry => entry.target).map(pokemon => pokemon.name));
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
		if (!target.isActive) return false;
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
		if (previousMod.length) {
			previousMod = Math.floor(previousMod[0] * 4096 / previousMod[1]);
		} else {
			previousMod = Math.floor(previousMod * 4096);
		}

		if (nextMod.length) {
			nextMod = Math.floor(nextMod[0] * 4096 / nextMod[1]);
		} else {
			nextMod = Math.floor(nextMod * 4096);
		}
		return ((previousMod * nextMod + 2048) >> 12) / 4096; // M'' = ((M * M') + 0x800) >> 12
	};
	Battle.prototype.chainModify = function (numerator, denominator) {
		let previousMod = Math.floor(this.event.modifier * 4096);

		if (numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		let nextMod = 0;
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
		let modifier = Math.floor(numerator * 4096 / denominator);
		return Math.floor((value * modifier + 2048 - 1) / 4096);
	};
	Battle.prototype.getCategory = function (move) {
		move = this.getMove(move);
		return move.category || 'Physical';
	};
	Battle.prototype.getDamage = function (pokemon, target, move, suppressMessages) {
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

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) {
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
		let type = move.type;
		// '???' is typeless damage: used for Struggle and Confusion etc
		let category = this.getCategory(move);
		let defensiveCategory = move.defensiveCategory || category;

		let basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			critMult = [0, 16, 8, 2, 1];
		}

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				move.crit = (this.random(critMult[critRatio]) === 0);
			}
		}

		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		let level = pokemon.level;

		let attacker = pokemon;
		let defender = target;
		let attackStat = category === 'Physical' ? 'atk' : 'spa';
		let defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		let statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		let attack;
		let defense;

		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		let defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		let ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		let ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		if (move.useTargetOffensive) {
			attack = defender.calculateStat(attackStat, atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		if (move.useSourceDefensive) {
			defense = attacker.calculateStat(defenseStat, defBoosts);
		} else {
			defense = defender.calculateStat(defenseStat, defBoosts);
		}

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		//int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			let spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		// crit
		if (move.crit) {
			baseDamage = this.modify(baseDamage, move.critModifier || (this.gen >= 6 ? 1.5 : 2));
		}

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.hasSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		move.typeMod = target.runEffectiveness(move);

		move.typeMod = this.clampIntRange(move.typeMod, -6, 6);
		if (move.typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < move.typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (move.typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > move.typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (move.crit && !suppressMessages) this.add('-crit', target);

		if (pokemon.status === 'brn' && basePower && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			if (this.gen < 6 || move.id !== 'facade') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
		}

		// Generation 5 sets damage to 1 before the final damage modifiers only
		if (this.gen === 5 && basePower && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (this.gen !== 5 && basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	};
	Battle.prototype.randomizer = function (baseDamage) {
		return Math.floor(baseDamage * (100 - this.random(16)) / 100);
	};
	/**
	 * Returns whether a proposed target for a move is valid.
	 */
	Battle.prototype.validTargetLoc = function (targetLoc, source, targetType) {
		let numSlots = source.side.active.length;
		if (!Math.abs(targetLoc) && Math.abs(targetLoc) > numSlots) return false;

		let sourceLoc = -(source.position + 1);
		let isFoe = (targetLoc > 0);
		let isAdjacent = (isFoe ? Math.abs(-(numSlots + 1 - targetLoc) - sourceLoc) <= 1 : Math.abs(targetLoc - sourceLoc) === 1);
		let isSelf = (sourceLoc === targetLoc);

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
		let move = this.getMove(decision.move);
		let target;
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
			let allyActives = pokemon.side.active;
			let adjacentAllies = [allyActives[pokemon.position - 1], allyActives[pokemon.position + 1]];
			adjacentAllies = adjacentAllies.filter(active => active && !active.fainted);
			if (adjacentAllies.length) return adjacentAllies[Math.floor(Math.random() * adjacentAllies.length)];
			return pokemon;
		}
		if (move.target === 'self' || move.target === 'all' || move.target === 'allySide' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf') {
			return pokemon;
		}
		if (pokemon.side.active.length > 2) {
			if (move.target === 'adjacentFoe' || move.target === 'normal' || move.target === 'randomNormal') {
				let foeActives = pokemon.side.foe.active;
				let frontPosition = foeActives.length - 1 - pokemon.position;
				let adjacentFoes = foeActives.slice(frontPosition < 1 ? 0 : frontPosition - 1, frontPosition + 2);
				adjacentFoes = adjacentFoes.filter(active => active && !active.fainted);
				if (adjacentFoes.length) return adjacentFoes[Math.floor(Math.random() * adjacentFoes.length)];
				// no valid target at all, return a foe for any possible redirection
			}
		}
		return pokemon.side.foe.randomActive() || pokemon.side.foe.active[0];
	};
	Battle.prototype.checkFainted = function () {
		for (let i = 0; i < this.p1.active.length; i++) {
			let pokemon = this.p1.active[i];
			if (pokemon.fainted) {
				pokemon.status = 'fnt';
				pokemon.switchFlag = true;
			}
		}
		for (let i = 0; i < this.p2.active.length; i++) {
			let pokemon = this.p2.active[i];
			if (pokemon.fainted) {
				pokemon.status = 'fnt';
				pokemon.switchFlag = true;
			}
		}
	};
	Battle.prototype.faintMessages = function (lastFirst) {
		if (this.ended) return;
		if (!this.faintQueue.length) return false;
		if (lastFirst) {
			this.faintQueue.unshift(this.faintQueue.pop());
		}
		let faintData;
		while (this.faintQueue.length) {
			faintData = this.faintQueue.shift();
			if (!faintData.target.fainted) {
				this.add('faint', faintData.target);
				this.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				this.singleEvent('End', this.getAbility(faintData.target.ability), faintData.target.abilityData, faintData.target);
				faintData.target.fainted = true;
				faintData.target.isActive = false;
				faintData.target.isStarted = false;
				faintData.target.side.pokemonLeft--;
				faintData.target.side.faintedThisTurn = true;
			}
		}

		if (this.gen <= 1) {
			// in gen 1, fainting skips the rest of the turn, including residuals
			this.queue = [];
		} else if (this.gen <= 3 && this.gameType === 'singles') {
			// in gen 3 or earlier, fainting in singles skips to residuals
			for (let i = 0; i < this.p1.active.length; i++) {
				this.cancelMove(this.p1.active[i]);
				// Stop Pursuit from running
				this.p1.active[i].moveThisTurn = true;
			}
			for (let i = 0; i < this.p2.active.length; i++) {
				this.cancelMove(this.p2.active[i]);
				// Stop Pursuit from running
				this.p2.active[i].moveThisTurn = true;
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
	Battle.prototype.resolvePriority = function (decision) {
		if (decision) {
			if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.priority && decision.priority !== 0) {
				let priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 7,
					'runSwitch': 7.2,
					'runPrimal': 7.1,
					'instaswitch': 101,
					'megaEvo': 6.9,
					'residual': -100,
					'team': 102,
					'start': 101,
				};
				if (decision.choice in priorities) {
					decision.priority = priorities[decision.choice];
				}
			}
			if (decision.choice === 'move') {
				if (this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc});
				}
			} else if (decision.choice === 'switch' || decision.choice === 'instaswitch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.speed;
			}
			if (decision.move) {
				let target;

				if (!decision.targetPosition) {
					target = this.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = this.getMoveCopy(decision.move);
				if (!decision.priority) {
					let priority = decision.move.priority;
					priority = this.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);
					decision.priority = priority;
					// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
					if (this.gen > 5) decision.move.priority = priority;
				}
			}
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && (decision.choice === 'switch' || decision.choice === 'instaswitch') && decision.target) decision.speed = decision.target.speed;
			if (!decision.speed) decision.speed = decision.pokemon.speed;
		}
	};
	Battle.prototype.addQueue = function (decision) {
		if (Array.isArray(decision)) {
			for (let i = 0; i < decision.length; i++) {
				this.addQueue(decision[i]);
			}
			return;
		}

		this.resolvePriority(decision);
		this.queue.push(decision);
	};
	Battle.prototype.sortQueue = function () {
		this.queue.sort(Battle.comparePriority);
	};
	Battle.prototype.insertQueue = function (decision) {
		if (Array.isArray(decision)) {
			for (let i = 0; i < decision.length; i++) {
				this.insertQueue(decision[i]);
			}
			return;
		}

		if (decision.pokemon) decision.pokemon.updateSpeed();
		this.resolvePriority(decision);
		for (let i = 0; i < this.queue.length; i++) {
			if (Battle.comparePriority(decision, this.queue[i]) < 0) {
				this.queue.splice(i, 0, decision);
				return;
			}
		}
		this.queue.push(decision);
	};
	Battle.prototype.prioritizeQueue = function (decision, source, sourceEffect) {
		if (this.event) {
			if (!source) source = this.event.source;
			if (!sourceEffect) sourceEffect = this.effect;
		}
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i] === decision) {
				this.queue.splice(i, 1);
				break;
			}
		}
		decision.sourceEffect = sourceEffect;
		this.queue.unshift(decision);
	};
	Battle.prototype.willAct = function () {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch' || this.queue[i].choice === 'shift') {
				return this.queue[i];
			}
		}
		return null;
	};
	Battle.prototype.willMove = function (pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return null;
	};
	Battle.prototype.cancelDecision = function (pokemon) {
		let success = false;
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				i--;
				success = true;
			}
		}
		return success;
	};
	Battle.prototype.cancelMove = function (pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				return true;
			}
		}
		return false;
	};
	Battle.prototype.willSwitch = function (pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if ((this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch') && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return false;
	};
	Battle.prototype.runDecision = function (decision) {
		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start': {
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			let format = this.getFormat();

			// Remove Pokémon duplicates remaining after `team` decisions.
			this.p1.pokemon = this.p1.pokemon.slice(0, this.p1.pokemonLeft);
			this.p2.pokemon = this.p2.pokemon.slice(0, this.p2.pokemonLeft);

			if (format.teamLength && format.teamLength.battle) {
				// Trim the team: not all of the Pokémon brought to Preview will battle.
				this.p1.pokemon = this.p1.pokemon.slice(0, format.teamLength.battle);
				this.p1.pokemonLeft = this.p1.pokemon.length;
				this.p2.pokemon = this.p2.pokemon.slice(0, format.teamLength.battle);
				this.p2.pokemonLeft = this.p2.pokemon.length;
			}

			this.add('start');
			for (let pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p1.pokemon.length; pos++) {
				let pokemon = this.p1.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (let pos = 0; pos < this.p2.pokemon.length; pos++) {
				let pokemon = this.p2.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.runMove(decision.move, decision.pokemon, this.getTarget(decision), decision.sourceEffect);
			break;
		case 'megaEvo':
			if (decision.pokemon.canMegaEvo) this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			let target = this.getTarget(decision);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		}

		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team': {
			decision.side.pokemon.splice(decision.index, 0, decision.pokemon);
			decision.pokemon.position = decision.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		}

		case 'pass':
			if (!decision.priority || decision.priority <= 101) return;
			if (decision.pokemon) {
				decision.pokemon.switchFlag = false;
			}
			break;
		case 'instaswitch':
		case 'switch':
			if (decision.choice === 'switch' && decision.pokemon.status && this.data.Abilities.naturalcure) {
				this.singleEvent('CheckShow', this.data.Abilities.naturalcure, null, decision.pokemon);
			}
			if (decision.pokemon.hp) {
				decision.pokemon.beingCalledBack = true;
				let lastMove = this.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
					if (this.gen >= 5) {
						this.eachEvent('Update');
					}
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
			this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			if (!decision.pokemon.hp && !decision.pokemon.fainted) {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					decision.priority = -101;
					this.queue.unshift(decision);
					this.add('-hint', 'Pursuit target fainted, switch continues in gen 2-4');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				this.add('-hint', 'Switch failed; switch target is already active');
				break;
			}
			if (decision.choice === 'switch' && decision.pokemon.activeTurns === 1) {
				let foeActive = decision.pokemon.side.foe.active;
				for (let i = 0; i < foeActive.length; i++) {
					if (foeActive[i].isStale >= 2) {
						decision.pokemon.isStaleCon++;
						decision.pokemon.isStaleSource = 'switch';
						break;
					}
				}
			}

			this.switchIn(decision.target, decision.pokemon.position);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', decision.pokemon);
			if (this.gen <= 2 && !decision.pokemon.side.faintedThisTurn && decision.pokemon.draggedIn !== this.turn) this.runEvent('AfterSwitchInSelf', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				decision.pokemon.abilityOrder = this.abilityOrder++;
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			delete decision.pokemon.draggedIn;
			break;
		case 'runPrimal':
			if (!decision.pokemon.transformed) this.singleEvent('Primal', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			break;
		case 'shift': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			decision.pokemon.activeTurns--;
			this.swapPosition(decision.pokemon, 1);
			let foeActive = decision.pokemon.side.foe.active;
			for (let i = 0; i < foeActive.length; i++) {
				if (foeActive[i].isStale >= 2) {
					decision.pokemon.isStaleCon++;
					decision.pokemon.isStaleSource = 'switch';
					break;
				}
			}
			break;
		}

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			this.residualEvent('Residual');
			break;

		case 'skip':
			throw new Error("Decision illegally skipped!");
		}

		// phazing (Roar, etc)
		for (let i = 0; i < this.p1.active.length; i++) {
			let pokemon = this.p1.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}
		for (let i = 0; i < this.p2.active.length; i++) {
			let pokemon = this.p2.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}

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

		let p1switch = this.p1.active.some(mon => mon && mon.switchFlag);
		let p2switch = this.p2.active.some(mon => mon && mon.switchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			for (let i = 0; i < this.p1.active.length; i++) {
				this.p1.active[i].switchFlag = false;
			}
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			for (let i = 0; i < this.p2.active.length; i++) {
				this.p2.active[i].switchFlag = false;
			}
			p2switch = false;
		}

		if (p1switch || p2switch) {
			if (this.gen >= 5) {
				this.eachEvent('Update');
			}
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
			this.currentRequestDetails = '';
		}

		if (!this.midTurn) {
			this.queue.push({choice: 'residual', priority: -100});
			this.queue.unshift({choice: 'beforeTurn', priority: 100});
			this.midTurn = true;
		}

		while (this.queue.length) {
			let decision = this.queue.shift();

			this.runDecision(decision);

			if (this.currentRequest) {
				return;
			}

			if (this.ended) return;
		}

		this.nextTurn();
		this.midTurn = false;
		this.queue = [];
	};
	/**
	 * Changes a pokemon's decision, and inserts its new decision
	 * in priority order.
	 *
	 * You'd normally want the OverrideDecision event (which doesn't
	 * change priority order).
	 */
	Battle.prototype.changeDecision = function (pokemon, decision) {
		this.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		this.insertQueue(decision);
	};
	/**
	 * Takes a choice string passed from the client. Starts the next
	 * turn if all required choices have been made.
	 */
	Battle.prototype.choose = function (sideid, input, rqid) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		// This condition should be impossible because the sideid comes
		// from our forked process and if the player id were invalid, we would
		// not have even got to this function.
		if (!side) return; // wtf

		// This condition can occur if the client sends a decision at the
		// wrong time.
		if (!side.currentRequest) return;

		// Make sure the decision is for the right request.
		if ((rqid !== undefined) && (parseInt(rqid) !== this.rqid)) {
			return;
		}

		if (side.choiceData.finalDecision) {
			this.debug("Can't override decision: the last pokemon could have been trapped or disabled");
			return;
		}

		if (side.getDecisionsFinished()) {
			side.undoChoices(true);
		}

		const choices = this.parseChoice(side, input);
		if (!choices) return; // Malformed input

		let choiceOffset = side.choiceData.choices.indexOf('skip');
		if (choiceOffset < 0) choiceOffset = side.choiceData.choices.length;

		for (let i = 0; i < choices.length; i++) {
			const choiceIndex = i + choiceOffset;
			const pokemon = choiceIndex <= side.active.length ? side.active[choiceIndex] : null;
			const choice = choices[i][0];
			let data = choices[i][1];

			if (side.currentRequest === 'switch' && (!pokemon || !pokemon.switchFlag)) {
				// The choice here must be always `pass`, as it was automatically filled by the parser.
				// Note that this pass isn't included in the `pass` counter, as the player
				// has no freedom regarding this action.
				side.choiceData.choices[choiceIndex] = 'pass';
				side.choiceData.decisions[choiceIndex] = {
					choice: 'pass',
					pokemon: pokemon,
					priority: 102,
				};
				continue;
			} else if (side.currentRequest === 'move') {
				// The same comment regarding passing above applies.
				if (!pokemon || pokemon.fainted) {
					side.choiceData.choices[choiceIndex] = 'pass';
					side.choiceData.decisions[choiceIndex] = {
						choice: 'pass',
					};
					continue;
				}
				// Figure out whether we are locked into a move,
				// and override the choice if that's the case.
				const lockedMove = pokemon.getLockedMove();
				if (lockedMove) {
					const lockedMoveTarget = this.runEvent('LockMoveTarget', pokemon);
					side.choiceData.choices[choiceIndex] = 'move ' + lockedMove + (typeof lockedMoveTarget === 'number' ? ' ' + lockedMoveTarget : '');
					side.choiceData.decisions[choiceIndex] = {
						choice: 'move',
						pokemon: pokemon,
						targetLoc: lockedMoveTarget || 0,
						move: lockedMove,
					};
					continue;
				}
			}

			switch (choice) {
			case 'move': {
				let targetLoc = 0;
				if (/\s\-?[1-3]$/.test(data)) {
					targetLoc = parseInt(data.slice(-2));
					data = data.slice(0, data.lastIndexOf(' '));
				}
				let willMega = data.endsWith(' mega');
				let move = willMega ? data.slice(0, -5) : data; // `move` is expected to be either a one-based index or a move id
				if (!side.chooseMove(move.trim(), targetLoc, willMega, true)) return side.undoChoices(i, choiceIndex);
				break;
			}
			case 'switch':
				if (!side.chooseSwitch(data, pokemon.position, true)) return side.undoChoices(i, choiceIndex);
				break;
			case 'shift':
				if (!side.chooseShift()) return side.undoChoices(i, choiceIndex);
				break;
			case 'team':
				if (!side.chooseTeam(data, true)) return side.undoChoices(i, choiceIndex);
				break;
			case 'pass':
				if (!side.choosePass(pokemon.position, true)) return side.undoChoices(i, choiceIndex);
				break;
			case 'default':
				if (!side.chooseDefault(true)) return side.undoChoices(i, choiceIndex);
				break;
			case 'skip':
				if (!side.chooseSkip(pokemon.position, true)) return side.undoChoices(i, choiceIndex);
				break;
			}
		}

		const queuedDecisions = side.choiceData.choices.length;
		if (queuedDecisions) {
			side.acceptChoice(queuedDecisions, {
				done: side.choiceData.choices.map((choice, index) => choice === 'skip' ? '' : '' + index).join(""),
				leave: Array.from(side.choiceData.leaveIndices).join(""),
				enter: Array.from(side.choiceData.enterIndices).join(""),
				team: side.currentRequest === 'teampreview' ? side.choiceData.decisions.map(decision => decision.pokemon.position + 1).join("") : null,
			});
		}

		this.checkDecisions();
	};

	/**
	 * Parses a choice string passed from a client into a list of
	 * [choice, data] tuples after validating the type of each choice.
	 *
	 * The `data` entry is only validated for type, and it's the
	 * responsibility of the caller to verify its content.
	 *
	 * Zero side effects.
	 */

	Battle.prototype.parseChoice = function (side, input) {
		let isOverride = false;
		let choiceOffset = this.supportPartialDecisions ? side.choiceData.choices.indexOf('skip') : -1;
		if (choiceOffset >= 0) {
			isOverride = true;
		} else {
			choiceOffset = side.choiceData.choices.length;
		}

		const isPreview = side.currentRequest === 'teampreview'; // Team Preview parsing has lots of nuances
		const expectedLength = (isPreview ? side.pokemon.length : side.active.length) - choiceOffset;
		if (isPreview) {
			if (!input.startsWith('team ')) return null;
			input = input.slice(5);
		}

		const parts = isPreview && /^[1-9]+$/.test(input) ? input.split('', expectedLength) : input.split(',', expectedLength); // input
		const choices = new Array(expectedLength); // output
		const teamSlots = isPreview ? new Set(side.choiceData.decisions.map(decision => decision.pokemon.position + 1)) : null; // for autocompletion

		let hasDefault = false;

		for (let i = 0; i < choices.length; i++) {
			if (i >= parts.length) {
				// `parts` can grow due to autocompletion (explained below),
				// so we can't check this before the loop.
				// It won't grow at its end, though...
				if (i < side.active.length && side.currentRequest !== 'teampreview' && (!side.active[i] || (side.currentRequest === 'move' ? side.active[i].fainted : !side.active[i].switchFlag))) {
					parts.push('pass');
				} else if (side.currentRequest !== 'teampreview') {
					// Incomplete request!
					return this.supportPartialDecisions ? choices.slice(0, i) : null;
				} else {
					choices.splice(i, choices.length - i);
					break;
				}
			}
			if (i >= side.choiceData.choices.length) {
				isOverride = false;
			}
			let choice = parts[i].trim();
			let pokemon = side.active[i + choiceOffset];

			let data = '';
			let firstSpaceIndex = choice.indexOf(' ');
			if (firstSpaceIndex >= 0) {
				data = choice.substr(firstSpaceIndex + 1).trim();
				choice = choice.substr(0, firstSpaceIndex).trim();
			} else if (isPreview) {
				// Support for short notation:
				// /choose team 1234
				data = choice;
				choice = 'team';
			}

			if (choice === 'default') {
				// No decisions are allowed after the default.
				if (i + 1 < parts.length) return null;
				hasDefault = true;
			}

			switch (side.currentRequest) {
			case 'teampreview':
				if (choice !== 'team' && choice !== 'default') return null;
				break;
			case 'switch':
				if (!pokemon || !pokemon.switchFlag) {
					// We are going to be friendly towards command-line dubs/triples players,
					// and automatically fill any mandatory passes.
					if (choice !== 'pass' && !(choice === 'skip' && isOverride) && parts.length < choices.length) {
						parts.splice(i, 0, 'pass');
						choice = 'pass';
						data = '';
					}
				} else if (choice === 'pass' && side.active.length <= 1) {
					// Passing only makes sense in the context of a multiple switch-in.
					return null;
				}
				if (choice !== 'switch' && choice !== 'pass' && choice !== 'default' && choice !== 'skip') {
					return null;
				}
				break;
			case 'move':
				if (!pokemon || pokemon.fainted) {
					// Ditto. Automatically fill passes.
					if (choice !== 'pass' && parts.length < choices.length) {
						parts.splice(i, 0, 'pass');
						choice = 'pass';
						data = '';
					}
				} else if (choice === 'pass') {
					return null;
				}
				if (choice !== 'move' && choice !== 'switch' && choice !== 'shift' && choice !== 'pass') {
					return null;
				}
				break;
			}

			if (isOverride && choice !== 'skip' && side.choiceData.choices[i + choiceOffset] !== 'skip') {
				// Either the original or the new choice should be a skip.
				return null;
			}

			switch (choice) {
			case 'move':
				// All sorts of input formats for `move` choices.
				// But at least we are going to restrict its length.
				// In regular play, the longest message for legacy clients is
				// `move Hidden Power Electric -1 mega` (length: 34).
				if (!data || data.length >= 64) return null;
				break;
			case 'switch':
				if (!data || data.length >= 2 || /[^1-9]/.test(data)) return null;
				break;
			case 'team':
				if (!data || data.length >= 2 || /[^1-9]/.test(data)) return null;
				if (data > side.pokemon.length || teamSlots.has(+data)) return null;
				teamSlots.add(+data);
				break;
			case 'shift':
				// Shifting is only a valid choice type in Triples,
				// and only for the Pokémon on the sides.
				if (this.gameType !== 'triples' || i + choiceOffset === 1) return null;
				if (data) return null;
				break;
			case 'skip':
				if (!this.supportPartialDecisions) return null;
				if (data) return null;
				break;
			case 'pass':
			case 'default':
				if (data) return null;
				break;
			default:
				return null;
			}

			choices[i] = [choice, data];
		}

		// Auto-complete multi-slot /team decisions.
		// Also auto-complete single-slot decisions, if it's Singles and no Pokémon in the team has Illusion.
		// We should be able to remove this eventually -it really has no place in this function.
		// TODO: Investigate and patch 3rd party clients that may need this backwards-compat fix.
		if (side.currentRequest === 'teampreview' && !hasDefault && choices.length < side.pokemon.length) {
			if (choices.length >= 2 || choices.length >= 1 && side.active.length <= 1 && !side.pokemon.some(pokemon => pokemon.ability === 'illusion')) {
				for (let i = 1; i <= side.pokemon.length; i++) {
					if (!teamSlots.has(i)) choices.push(['team', i]);
				}
			}
		}

		return choices;
	};

	Battle.prototype.commitDecisions = function () {
		this.updateSpeed();

		let oldQueue = this.queue;
		this.queue = [];
		for (let i = 0; i < this.sides.length; i++) {
			this.sides[i].resolveDecision();
			if (this.sides[i].choiceData.decisions === true) continue;
			this.addQueue(this.sides[i].choiceData.decisions);
		}
		this.add('choice', this.p1.getChoice, this.p2.getChoice);

		this.sortQueue();
		Array.prototype.push.apply(this.queue, oldQueue);

		this.currentRequest = '';
		this.currentRequestDetails = '';
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';

		this.p1.choiceData.decisions = true;
		this.p2.choiceData.decisions = true;

		this.go();
	};
	Battle.prototype.undoChoice = function (sideid, count) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		// The following condition can never occur for the reasons given in
		// the choose() function above.
		if (!side) return; // wtf
		// This condition can occur.
		if (!side.currentRequest) return;

		if (side.choiceData.finalDecision) {
			this.debug("Can't cancel decision: the last pokemon could have been trapped or disabled");
			return;
		}

		const stepsBack = count === undefined || count === '' ? true : +count;
		if (stepsBack !== true && isNaN(stepsBack)) return;

		side.undoChoices(stepsBack);
	};
	Battle.prototype.checkDecisions = function () {
		let totalDecisions = 0;
		if (this.p1.getDecisionsFinished()) {
			if (!this.supportCancel) this.p1.choiceData.finalDecision = true;
			totalDecisions++;
		}
		if (this.p2.getDecisionsFinished()) {
			if (!this.supportCancel) this.p2.choiceData.finalDecision = true;
			totalDecisions++;
		}
		if (totalDecisions >= this.sides.length) {
			this.commitDecisions();
		}
	};

	Battle.prototype.add = function () {
		let parts = Array.prototype.slice.call(arguments);
		if (!parts.some(part => typeof part === 'function')) {
			this.log.push('|' + parts.join('|'));
			return;
		}
		this.log.push('|split');
		let sides = [null, this.sides[0], this.sides[1], true];
		for (let i = 0; i < sides.length; ++i) {
			let sideUpdate = '|' + parts.map(part => {
				if (typeof part !== 'function') return part;
				return part(sides[i]);
			}).join('|');
			this.log.push(sideUpdate);
		}
	};
	Battle.prototype.addMove = function () {
		this.lastMoveLine = this.log.length;
		this.log.push('|' + Array.prototype.slice.call(arguments).join('|'));
	};
	Battle.prototype.attrLastMove = function () {
		this.log[this.lastMoveLine] += '|' + Array.prototype.slice.call(arguments).join('|');
	};
	Battle.prototype.retargetLastMove = function (newTarget) {
		let parts = this.log[this.lastMoveLine].split('|');
		parts[4] = newTarget;
		this.log[this.lastMoveLine] = parts.join('|');
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

		let player = null;
		if (this.p1 && this.p1.isActive || slot === 'p2') {
			if (this.started) {
				this.p2.name = name;
			} else {
				//console.log("NEW SIDE: " + name);
				this.p2 = new BattleSide(name, this, 1, team);
				this.sides[1] = this.p2;
			}
			player = this.p2;
		} else {
			if (this.started) {
				this.p1.name = name;
			} else {
				//console.log("NEW SIDE: " + name);
				this.p1 = new BattleSide(name, this, 0, team);
				this.sides[0] = this.p1;
			}
			player = this.p1;
		}

		if (avatar) player.avatar = avatar;
		player.isActive = true;
		this.add('player', player.id, player.name, avatar);

		this.start();
		return player;
	};
	Battle.prototype.rename = function (slot, name, avatar) {
		if (slot === 'p1' || slot === 'p2') {
			let side = this[slot];
			side.name = name;
			if (avatar) side.avatar = avatar;
			this.add('player', slot, name, side.avatar);
		}
	};
	Battle.prototype.leave = function (slot) {
		if (slot === 'p1' || slot === 'p2') {
			let side = this[slot];
			if (!side) {
				console.log('**** ' + slot + ' tried to leave before it was possible in ' + this.id);
				require('./crashlogger.js')(new Error('**** ' + slot + ' tried to leave before it was possible in ' + this.id), 'A simulator process');
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
	// Battle.prototype.receive in simulator.js (in another process).
	Battle.prototype.send = function (type, data) {
		if (Array.isArray(data)) data = data.join("\n");
		process.send(this.id + "\n" + type + "\n" + data);
	};
	// This function is called by this process's 'message' event.
	Battle.prototype.receive = function (data, more) {
		this.messageLog.push(data.join(' '));
		let logPos = this.log.length;
		let alreadyEnded = this.ended;
		switch (data[1]) {
		case 'join': {
			let team = '';
			try {
				if (more) team = Tools.fastUnpackTeam(more);
			} catch (e) {
				console.log('TEAM PARSE ERROR: ' + more);
				team = null;
			}
			this.join(data[2], data[3], data[4], team);
			break;
		}

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
			this.undoChoice(data[2], data[3]);
			break;

		case 'eval': {
			/* eslint-disable no-eval, no-unused-vars */
			let battle = this;
			let p1 = this.p1;
			let p2 = this.p2;
			let p1active = p1 ? p1.active[0] : null;
			let p2active = p2 ? p2.active[0] : null;
			let target = data.slice(2).join('|').replace(/\f/g, '\n');
			this.add('', '>>> ' + target);
			try {
				this.add('', '<<< ' + eval(target));
			} catch (e) {
				this.add('', '<<< error: ' + e.message);
			}
			/* eslint-enable no-eval, no-unused-vars */
			break;
		}

		default:
		// unhandled
		}

		this.sendUpdates(logPos, alreadyEnded);
	};
	Battle.prototype.sendUpdates = function (logPos, alreadyEnded) {
		if (this.p1 && this.p2) {
			let inactiveSide = -1;
			if (!this.p1.isActive && this.p2.isActive) {
				inactiveSide = 0;
			} else if (this.p1.isActive && !this.p2.isActive) {
				inactiveSide = 1;
			} else {
				let sidesDecided = this.sides.map(side => side.getDecisionsFinished());
				if (sidesDecided[0] && !sidesDecided[1]) {
					inactiveSide = 1;
				} else if (sidesDecided[1] && !sidesDecided[0]) {
					inactiveSide = 0;
				}
			}
			if (inactiveSide !== this.inactiveSide) {
				this.send('inactiveside', inactiveSide);
				this.inactiveSide = inactiveSide;
			}
		}

		if (this.log.length > logPos) {
			if (alreadyEnded !== undefined && this.ended && !alreadyEnded) {
				if (this.rated || Config.logchallenges) {
					let log = {
						seed: this.startingSeed,
						turns: this.turn,
						p1: this.p1.name,
						p2: this.p2.name,
						p1team: this.p1.team,
						p2team: this.p2.team,
						log: this.log,
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
		for (let i = 0; i < this.sides.length; i++) {
			if (this.sides[i]) this.sides[i].destroy();
			this.sides[i] = null;
		}
		this.p1 = null;
		this.p2 = null;
		for (let i = 0; i < this.queue.length; i++) {
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
