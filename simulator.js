function floor(num) {
	return Math.floor(num);
}
function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
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
		this.baseTemplate = selfB.getTemplate(this.species);
	}
	this.species = this.baseTemplate.species;
	if (set.name === set.species || !set.name || !set.species) {
		set.name = this.species;
	}
	this.name = set.name || set.species || 'Bulbasaur';
	this.speciesid = toId(this.species);
	this.template = this.baseTemplate;
	this.moves = [];
	this.baseMoves = this.moves;
	this.movepp = {};
	this.moveset = [];
	this.baseMoveset = [];
	this.trapped = false;

	this.level = clampIntRange(set.level || 100, 1, 100);
	this.hp = 0;
	this.maxhp = 100;
	var genders = {M:'M',F:'F'};
	this.gender = this.template.gender || genders[set.gender] || (Math.random()*2<1?'M':'F');
	if (this.gender === 'N') this.gender = '';

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

	this.hpType = 'Dark';
	this.hpPower = 70;

	if (this.set.moves) {
		for (var i=0; i<this.set.moves.length; i++) {
			var move = selfB.getMove(this.set.moves[i]);
			if (move.id === 'HiddenPower') {
				this.hpType = move.type;
			}
			this.baseMoveset.push({
				move: move.name,
				id: move.id,
				pp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				maxpp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				disabled: false,
				used: false
			});
			this.moves.push(toId(move.name));
		}
	}

	if (!this.set.evs) {
		this.set.evs = {
			hp: 84,
			atk: 84,
			def: 84,
			spa: 84,
			spd: 84,
			spe: 84
		};
	}
	if (!this.set.ivs) {
		this.set.ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31
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

	this.stats = {
		hp: 0,
		atk: 0,
		def: 0,
		spa: 0,
		spd: 0,
		spe: 0
	};
	this.boosts = {
		atk: 0,
		def: 0,
		spa: 0,
		spd: 0,
		spe: 0,
		accuracy: 0,
		evasion: 0
	};
	this.baseBoosts = {
		atk: 0,
		def: 0,
		spa: 0,
		spd: 0,
		spe: 0,
		accuracy: 0,
		evasion: 0
	};
	this.unboostedStats = {
		atk: 0,
		def: 0,
		spa: 0,
		spd: 0,
		spe: 0,
		accuracy: 0,
		evasion: 0
	};
	this.baseStats = this.template.baseStats;
	this.bst = 0;
	for (var i in this.baseStats) {
		this.bst += this.baseStats[i];
	}
	this.bst = this.bst || 10;
	this.types = this.baseTemplate.types;

	this.stats['hp'] = floor(floor(2*selfP.baseStats['hp']+selfP.set.ivs['hp']+floor(selfP.set.evs['hp']/4)+100)*selfP.level / 100 + 10);
	if (this.baseStats['hp'] === 1) this.stats['hp'] = 1; // shedinja
	this.unboostedStats['hp'] = this.stats['hp'];
	this.maxhp = this.stats['hp'];
	this.hp = this.hp || this.maxhp;

	this.toString = function() {
		if (selfP.illusion) return selfP.illusion.fullname;
		return selfP.fullname;
	};
	this.getDetails = function() {
		if (selfP.illusion) return selfP.illusion.details + ' | ' + selfP.getHealth();
		return selfP.details + ' | ' + selfP.getHealth();
	};

	this.update = function(init) {
		selfP.illusion = null;
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
		for (var i in selfP.stats) {
			var stat = selfP.baseStats[i];
			/* if (selfP.set.bstscale && selfP.bst > 520 * 1.06) {
				stat *= 520 / selfP.bst * 1.06; // stat scaling in progress
			}
			if (selfP.set.bstscale && selfP.bst < 520 * 0.94) {
				stat *= 520 / selfP.bst * 0.94; // stat scaling in progress
			} */
			if (i==='hp') {
				continue;
			} else {
				selfP.unboostedStats[i] = floor(floor(2*stat+selfP.set.ivs[i]+floor(selfP.set.evs[i]/4))*selfP.level / 100 + 5);
			}
			selfP.stats[i] = selfP.unboostedStats[i];
		}
		for (var i in selfP.baseBoosts) {
			selfP.boosts[i] = selfP.baseBoosts[i];
		}
		BattleScripts.natureModify(selfP.stats, selfP.set.nature);
		for (var i in selfP.stats) {
			selfP.stats[i] = floor(selfP.stats[i]);
		}
		if (init) return;

		selfB.runEvent('ModifyStats', selfP, null, null, selfP.stats);

		for (var i in selfP.stats) {
			selfP.stats[i] = floor(selfP.stats[i]);
			selfP.unboostedStats[i] = selfP.stats[i];
		}

		var boostTable = [1,1.5,2,2.5,3,3.5,4];
		for (i in selfP.boosts) {
			if (selfP.boosts[i] > 6) selfP.boosts[i] = 6;
			if (selfP.boosts[i] < -6) selfP.boosts[i] = -6;
			if (i === 'accuracy' || i === 'evasion' || i === 'hp') continue; // hp should never happen
			if (selfP.boosts[i] >= 0) {
				selfP.stats[i] = floor(selfP.unboostedStats[i] * boostTable[selfP.boosts[i]]);
			} else {
				selfP.stats[i] = floor(selfP.unboostedStats[i] / boostTable[-selfP.boosts[i]]);
			}
		}

		selfB.runEvent('ModifyPokemon', selfP);
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
	this.deductPP = function(move, amount) {
		move = selfB.getMove(move);
		var ppData = selfP.getMoveData(move);
		var success = false;
		if (ppData) {
			ppData.used = true;
		}
		if (ppData && ppData.pp) {
			if (amount) {
				ppData.pp -= amount;
			} else {
				ppData.pp -= selfB.runEvent('DeductPP', selfP, selfP, move, 1);
			}
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
		source.lastDamage = damage;
		selfP.lastAttackedBy = {
			pokemon: source,
			damage: damage,
			move: move.id,
			thisTurn: true
		};
	};
	this.getMoves = function() {
		var moves = [];
		var hasValidMove = false;
		for (var i=0; i<selfP.moveset.length; i++) {
			var move = selfP.moveset[i];
			if (selfP.disabledMoves[move.id] || !move.pp) {
				move.disabled = true;
			}
			moves.push(move);
			if (!move.disabled) {
				hasValidMove = true;
			}
		}
		if (!hasValidMove) {
			moves = [{
				move: 'Struggle',
				id: 'struggle',
				pp: 1,
				maxpp: 1,
				disabled: false
			}];
		}
		if (selfP.volatiles['mustRecharge']) {
			moves = [{
				move: 'Recharge',
				id: 'Recharge',
				pp: 1,
				maxpp: 1,
				disabled: false
			}];
		}
		return moves;
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
			for (var i=0; i<pokemon.moveset.length; i++) {
				var moveData = pokemon.moveset[i];
				selfP.moveset.push({
					move: selfB.getMove(moveData.id).name,
					id: moveData.id,
					pp: 5,
					maxpp: moveData.maxpp,
					disabled: false
				});
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
		// we're copying array contents
		// DO NOT "optimize" it to copy just the pointer
		// if you don't know what a pointer is, please don't
		// touch this code
		for (var i=0; i<this.baseMoveset.length; i++) {
			this.moveset.push(this.baseMoveset[i]);
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
		d = floor(d);
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
		if (moveid.id) moveid = moveid.id;
		moveid = toId(moveid);
		for (var i=0; i<selfP.moveset.length; i++) {
			if (moveid === selfB.getMove(selfP.moveset[i].move).id) {
				return moveid;
			}
		}
		return false;
	};
	this.canUseMove = function(moveid) {
		if (moveid.id) moveid = moveid.id;
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
		d = floor(d);
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
		d = floor(d);
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
		if (!selfP.hp || !selfP.isActive) return false;
		if (!selfP.item) return false;
		if (!sourceEffect && selfB.effect) sourceEffect = selfB.effect;
		if (!source && selfB.event && selfB.event.target) source = selfB.event.target;
		var item = selfP.getItem();
		if (selfB.runEvent('UseItem', selfP, null, null, item)) {
			switch (item.id) {
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
		//return floor(floor(d*48/selfP.maxhp + 0.5)*100/48);
		return floor(d*100/selfP.maxhp + 0.5);
	};
	this.getHealth = function() {
		if (selfP.fainted) return ' (0 fnt)';
		//var hpp = floor(48*selfP.hp/selfP.maxhp) || 1;
		var hpp = floor(selfP.hp*100/selfP.maxhp + 0.5) || 1;
		if (!selfP.hp) hpp = 0;
		var status = '';
		if (selfP.status) status = ' '+selfP.status;
		return ' ('+hpp+'/100'+status+')';
	};
	this.hpChange = function(d) {
		return ''+selfP.hpPercent(d)+selfP.getHealth();
	};
	this.lockMove = function(moveid) {
		// shortcut function for locking a pokemon into a move
		// not really necessary, btw: you can do this all in effect script
		// actually, you can do nearly everything in effect script
		if (!moveid || (!selfP.hasMove(moveid) && moveid !== 'recharge')) return;
		if (moveid === 'recharge') selfP.disabledMoves['recharge'] = false;
		var moves = selfP.moveset;
		for (var i=0; i<moves.length; i++) {
			if (moves[i].id !== moveid) {
				moves[i].disabled = true;
			}
		}
		selfP.trapped = true;
	};
	this.runImmunity = function(type, message) {
		if (selfP.fainted) {
			return false;
		}
		if (!type || type === '???') {
			return true;
		}
		if (selfP.negateImmunity[type]) return true;
		if (!selfB.getImmunity(type, selfP)) {
			selfB.debug('natural immunity');
			if (message) {
				selfB.add('-immune', selfP);
			}
			return false;
		}
		var immunity = selfB.runEvent('Immunity', selfP, null, null, type);
		if (!immunity) {
			selfB.debug('artificial immunity');
			if (message && immunity !== null) {
				selfB.add('-immune', selfP);
			}
			return false;
		}
		return true;
	};
	this.runBeforeMove = function(target, move) {
		if (selfP.fainted) return true;
		return !selfB.runEvent('BeforeMove', selfP, target, move);
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

function BattleSide(user, battle, n) {
	var selfB = battle;
	var selfS = this;

	this.battle = battle;
	this.n = n;
	this.user = user;
	this.name = user.name;
	this.pokemon = [];
	this.pokemonLeft = 0;
	this.active = [null];
	this.decision = null;
	this.foe = null;
	this.sideConditions = {};

	this.id = (n?'p2':'p1');

	this.team = BattleScripts.getTeam.call(selfB, selfS);
	for (var i=0; i<this.team.length && i<6; i++) {
		console.log("NEW POKEMON: "+(this.team[i]?this.team[i].name:'[unidentified]'));
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
				condition: pokemon.getHealth(),
				active: (pokemon.position < pokemon.side.active.length),
				moves: pokemon.moves,
				ability: pokemon.ability,
				item: pokemon.item
			});
		}
		return data;
	};

	this.randomActive = function() {
		var i = floor(Math.random() * selfS.active.length);
		return selfS.active[i];
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
		if (selfS.user) {
			update.room = selfB.roomid;
			selfS.user.emit('update', update);
		}
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
			delete selfS.decision.user;
		}
		selfS.decision = null;

		// make sure no user is referencing us
		if (selfS.user) {
			delete selfS.user.sides[selfB.roomid];
		}
		selfS.user = null;

		// get rid of some possibly-circular references
		selfS.battle = null;
		selfS.foe = null;
		selfB = null;

		selfS = null;
	};
}

function Battle(roomid, format, rated) {
	var selfB = this;
	this.log = [];
	this.turn = 0;
	this.sides = [null, null];
	this.p1 = null;
	this.p2 = null;
	this.lastUpdate = 0;
	this.curCallback = '';
	this.roomid = roomid;

	this.rated = rated;

	this.weather = '';
	this.weatherData = {id:''};
	this.pseudoWeather = {};

	this.format = toId(format);
	this.formatData = {id:''};

	this.ended = false;
	this.started = false;
	this.active = false;

	this.effect = {id:''};
	this.effectData = {id:''};
	this.event = {id:''};
	this.eventDepth = 0;

	this.toString = function() {
		return 'Battle: '+selfS.format;
	};

	this.setWeather = function(status, source, sourceEffect) {
		status = selfB.getEffect(status);
		if (!sourceEffect && selfB.effect) sourceEffect = selfB.effect;
		if (!source && selfB.event && selfB.event.target) source = selfB.event.target;

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
		if (typeof a.order === 'number' || typeof b.order === 'number') {
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
				actives.push(side.active[j]);
			}
		}
		actives.sort(function(a, b) {
			if (b.stats.spe - a.stats.spe) {
				return b.stats.spe - a.stats.spe;
			}
			return Math.random()-0.5;
		});
		for (var i=0; i<actives.length; i++) {
			selfB.runEvent(eventid, actives[i], null, effect, relayVar);
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
			if (statuses[i].thing.fainted) continue;
			//selfB.debug('match '+eventid+': '+status.id+' '+status.effectType);
			if (status.effectType === 'Status' && statuses[i].thing.status !== status.id) {
				// it's changed; call it off
				continue;
			}
			if (statuses[i].thing.ignore && statuses[i].thing.ignore[status.effectType] === 'A') {
				// ignore attacking events
				var AttackingEvents = {
					BeforeMove: 1,
					BasePower: 1,
					Immunity: 1,
					Damage: 1,
					SubDamage: 1,
					Heal: 1,
					TakeItem: 1,
					UseItem: 1,
					EatItem: 1,
					SetStatus: 1,
					CriticalHit: 1,
					ModifyPokemon: 1,
					ModifyStats: 1,
					TryHit: 1,
					Hit: 1,
					TryFieldHit: 1,
					Boost: 1,
					DragOut: 1
				};
				if (AttackingEvents[eventid]) {
					if (eventid !== 'ModifyPokemon' && eventid !== 'ModifyStats') {
						selfB.debug(eventid+' handler suppressed by Mold Breaker');
					}
					continue;
				}
			} else if (statuses[i].thing.ignore && statuses[i].thing.ignore[status.effectType]) {
				selfB.debug(eventid+' handler suppressed by Klutz or Magic Room');
				continue;
			} else if (target.ignore && target.ignore[status.effectType+'Target']) {
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
				selfB.effectData.target = statuses[i].thing;
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
		var status = statuses[statuses.length-1].status;
		if (status[callbackType+'Order']) {
			order = status[callbackType+'Order'];
		}
		if (status[callbackType+'Priority']) {
			priority = status[callbackType+'Priority'];
		} else if (status[callbackType+'SubOrder']) {
			subOrder = -status[callbackType+'SubOrder'];
		}

		statuses[statuses.length-1].order = order;
		statuses[statuses.length-1].priority = priority;
		statuses[statuses.length-1].subOrder = subOrder;
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
	this.callback = function(type) {
		selfB.curCallback = type;
		if (!selfB.p1.user || !selfB.p2.user) {
			return;
		}
		selfB.update();
		if (type==='switch') {
			if (selfB.p1.active[0].fainted) {
				selfB.p1.decision = null;
				selfB.p1.emitUpdate({request: {forceSwitch: true, side: selfB.p1.getData()}});
			} else {
				selfB.p1.decision = true;
				selfB.p1.emitUpdate({request: {wait: true}});
			}
			if (selfB.p2.active[0].fainted) {
				selfB.p2.decision = null;
				selfB.p2.emitUpdate({request: {forceSwitch: true, side: selfB.p2.getData()}});
			} else {
				selfB.p2.decision = true;
				selfB.p2.emitUpdate({request: {wait: true}});
			}
		} else if (type==='switch-ally') {
			selfB.p2.decision = true;
			selfB.p1.decision = null;
			selfB.p2.emitUpdate({request: {wait: true}});
			selfB.p1.emitUpdate({request: {forceSwitch: true, side: selfB.p1.getData()}});
		} else if (type==='switch-foe') {
			selfB.p1.decision = true;
			selfB.p1.emitUpdate({request: {wait: true}});
			selfB.p2.decision = null;
			selfB.p2.emitUpdate({request: {forceSwitch: true, side: selfB.p2.getData()}});
		} else if (type==='team-preview') {
			selfB.add('teampreview');
			selfB.p1.decision = null;
			selfB.p1.emitUpdate({request: {teamPreview: true, side: selfB.p1.getData()}});
			selfB.p2.decision = null;
			selfB.p2.emitUpdate({request: {teamPreview: true, side: selfB.p2.getData()}});
			selfB.decisionWaiting = true;
		} else {
			var moves;
			var pokemon;
			selfB.p1.decision = null;
			pokemon = selfB.p1.active[0];
			if (!pokemon) {
				selfB.add('message BATTLE CRASHED.');
				return;
			}
			if (pokemon.disabledMoves['recharge'] === false) {
				moves = [{move: 'recharge'}];
			}
			selfB.p1.emitUpdate({request: {moves: pokemon.getMoves(), trapped: pokemon.trapped, side: pokemon.side.getData()}});

			selfB.p2.decision = null;
			pokemon = selfB.p2.active[0];
			if (pokemon.disabledMoves['recharge'] === false) {
				moves = [{move: 'recharge'}];
			}
			selfB.p2.emitUpdate({request: {moves: pokemon.getMoves(), trapped: pokemon.trapped, side: pokemon.side.getData()}});
		}
		if (selfB.p2.decision && selfB.p1.decision) {
			if (type !== 'move') {
				selfB.add('message Attempting to recover from crash.');
				selfB.callback('move');
				return;
			}
			selfB.add('message BATTLE CRASHED.');

			selfB.win();
			return;
		}
		selfB.add('callback', 'decision');
	};
	this.win = function(side) {
		var winSide = false;
		if (selfB.ended) {
			return false;
		}
		if (!side) {
			selfB.winner = '';
		} else if (side === selfB.p1) {
			winSide = side;
			if (selfB.p1.user) {
				selfB.winner = selfB.p1.user.userid;
			}
		} else if (side === selfB.p2) {
			winSide = side;
			if (selfB.p2.user) {
				selfB.winner = selfB.p2.user.userid;
			}
		} else if (selfB.p1.user && side === selfB.p1.user.userid) {
			winSide = selfB.p1;
			selfB.winner = side;
		} else if (selfB.p2.user && side === selfB.p2.user.userid) {
			winSide = selfB.p2;
			selfB.winner = side;
		} else if (selfB.rated && side === selfB.rated.p1) {
			winSide = selfB.p1;
			selfB.winner = side;
		} else if (selfB.rated && side === selfB.rated.p2) {
			winSide = selfB.p2;
			selfB.winner = side;
		} else {
			return false;
		}

		selfB.add('');
		if (winSide) {
			selfB.add('win', winSide.name);
		} else {
			selfB.add('tie');
		}
		selfB.ended = true;
		selfB.active = false;
		selfB.decisionWaiting = false;
		return true;
	};
	this.switchIn = function(pokemon) {
		if (!pokemon) return false;
		var side = pokemon.side;
		if (side.active[0] && !side.active[0].fainted) {
			//selfB.add('switch-out '+side.active[0].id);
		}
		if (side.active[0]) {
			var oldActive = side.active[0];
			var oldpos = pokemon.position;
			oldActive.isActive = false;
			pokemon.position = oldActive.position;
			oldActive.position = oldpos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
		}
		pokemon.clearVolatile();
		var lastMove = null;
		if (side.active[0]) lastMove = selfB.getMove(side.active[0].lastMove);
		if (lastMove && (lastMove.batonPass || (lastMove.self && lastMove.self.batonPass))) {
			pokemon.copyVolatileFrom(side.active[0]);
		}
		side.active[0] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		selfB.add('switch', side.active[0], side.active[0].getDetails());
		selfB.runEvent('SwitchIn', pokemon);
		selfB.addQueue({pokemon: pokemon, choice: 'runSwitch'});
	};
	this.canSwitch = function(side) {
		var canSwitchIn = [];
		for (var i=0; i<side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (pokemon !== side.active[0] && !pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	};
	this.getRandomSwitchable = function(side) {
		var canSwitchIn = [];
		for (var i=0; i<side.pokemon.length; i++) {
			var pokemon = side.pokemon[i];
			if (pokemon !== side.active[0] && !pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		if (!canSwitchIn.length) {
			return null;
		}
		return canSwitchIn[floor(Math.random()*canSwitchIn.length)];
	};
	this.dragIn = function(side) {
		var pokemon = selfB.getRandomSwitchable(side);
		if (!pokemon) return false;
		if (side.active[0]) {
			var oldActive = side.active[0];
			var oldpos = pokemon.position;
			if (!oldActive.hp) {
				return false;
			}
			if (!selfB.runEvent('DragOut', oldActive)) {
				return false;
			}
			selfB.runEvent('SwitchOut', oldActive);
			oldActive.isActive = false;
			pokemon.position = oldActive.position;
			oldActive.position = oldpos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
		}
		pokemon.clearVolatile();
		side.active[0] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		for (var m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		selfB.add('drag', side.active[0], side.active[0].getDetails());
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
		selfB.callback('move');
	};
	this.midTurn = false;
	this.start = function() {
		if (selfB.active) return;

		if (!selfB.p1 || !selfB.p1.user || !selfB.p2 || !selfB.p2.user) {
			// need two players to start
			return;
		}

		selfB.p2.emitUpdate({midBattle: selfB.started, side: 'p2', sideData: selfB.p2.getData()});
		selfB.p1.emitUpdate({midBattle: selfB.started, side: 'p1', sideData: selfB.p1.getData()});

		if (selfB.started) {
			selfB.callback(selfB.curCallback);
			selfB.active = true;
			selfB.activeTurns = 0;
			return;
		}
		selfB.active = true;
		selfB.activeTurns = 0;
		selfB.started = true;
		selfB.p2.foe = selfB.p1;
		selfB.p1.foe = selfB.p2;

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
		if (!selfB.decisionWaiting) selfB.go();
	};
	this.boost = function(boost, target, source, effect) {
		if (selfB.event) {
			if (!target) target = selfB.event.target;
			if (!source) source = selfB.event.source;
			if (!effect) effect = selfB.effect;
		}
		if (!target || !target.hp) return 0;
		effect = selfB.getEffect(effect);
		boost = selfB.runEvent('Boost', target, source, effect, boost);
		for (var i in boost) {
			var currentBoost = {};
			currentBoost[i] = boost[i];
			if (boost[i] > 0 && target.boostBy(currentBoost)) {
				switch (effect.id) {
				default:
					if (effect.effectType === 'Move') {
						selfB.add('-boost', target, i, boost[i]);
					} else {
						selfB.add('-boost', target, i, boost[i], '[from] '+effect.fullname);
					}
					break;
				}
				selfB.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			}
		}
		for (var i in boost) {
			var currentBoost = {};
			currentBoost[i] = boost[i];
			if (boost[i] < 0 && target.boostBy(currentBoost)) {
				switch (effect.id) {
				default:
					if (effect.effectType === 'Move') {
						selfB.add('-unboost', target, i, -boost[i]);
					} else {
						selfB.add('-unboost', target, i, -boost[i], '[from] '+effect.fullname);
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
		if (!damage) return 0;
		damage = clampIntRange(damage, 1);

		if (effect.id !== 'struggle-recoil') { // Struggle recoil is not affected by effects
			if (effect.effectType === 'Weather' && !target.runImmunity(effect.id)) {
				this.debug('weather immunity');
				return 0;
			}
			damage = selfB.runEvent('Damage', target, source, effect, damage);
			if (!damage) {
				this.debug('damage event said zero');
				return 0;
			}
		}
		damage = clampIntRange(damage, 1);
		damage = target.damage(damage, source, effect);
		if (!damage) {
			this.debug('pokemon.damage said zero');
			return 0;
		}
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
		damage = Math.ceil(damage);
		// for things like Liquid Ooze, the Heal event still happens when nothing is healed.
		damage = selfB.runEvent('TryHeal', target, source, effect, damage);
		if (!damage) return 0;
		damage = Math.ceil(damage);
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
		return Math.round(value * modifier / 4096);
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

		if (move.isSoundBased) {
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
			basePower = move.basePowerCallback.call(selfB, pokemon, target);
		}
		if (!basePower) return 0;

		move.critRatio = clampIntRange(move.critRatio, 0, 5);
		var critMult = [0, 16, 8, 4, 3, 2];

		move.crit = move.willCrit || false;
		if (typeof move.willCrit === 'undefined') {
			if (move.critRatio) {
				move.crit = (Math.random()*critMult[move.critRatio] < 1);
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

		var attack = move.category==='Physical'?pokemon.stats.atk:pokemon.stats.spa;
		var defense = move.defensiveCategory==='Physical'?target.stats.def:target.stats.spd;
		var level = pokemon.level;

		if (move.crit) {
			move.ignoreNegativeOffensive = true;
			move.ignorePositiveDefensive = true;
		}
		if (move.ignoreNegativeOffensive && attack < (move.category==='Physical'?pokemon.unboostedStats.atk:pokemon.unboostedStats.spa)) {
			move.ignoreOffensive = true;
		}
		if (move.ignoreOffensive) {
			selfB.debug('Negating (sp)atk boost/penalty.');
			attack = (move.category==='Physical'?pokemon.unboostedStats.atk:pokemon.unboostedStats.spa);
		}
		if (move.ignorePositiveDefensive && defense > (move.defensiveCategory==='Physical'?target.unboostedStats.def:target.unboostedStats.spd)) {
			move.ignoreDefensive = true;
		}
		if (move.ignoreDefensive) {
			selfB.debug('Negating (sp)def boost/penalty.');
			defense = move.defensiveCategory==='Physical'?target.unboostedStats.def:target.unboostedStats.spd;
		}

		//int(int(int(2*L/5+2)*A*P/D)/50);
		var baseDamage = floor(floor(floor(2*level/5+2) * basePower * attack/defense)/50) + 2;

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
		//var randFactor = floor(Math.random()*39)+217;
		//baseDamage *= floor(randFactor * 100 / 255) / 100;
		baseDamage *= Math.round((100 - floor(Math.random() * 16)) / 100);

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
			baseDamage /= 2;
			if (totalTypeMod <= -2) {
				baseDamage /= 2;
			}
		}
		baseDamage = Math.round(baseDamage);

		if (basePower && !floor(baseDamage)) {
			return 1;
		}

		return floor(baseDamage);
	};
	this.getTarget = function(decision) {
		return decision.targetSide.active[decision.targetPosition];
	};
	this.resolveTarget = function(pokemon, move) {
		move = selfB.getMove(move);
		if (move.target === 'self' || move.target === 'all' || move.target === 'allies' || move.target === 'allySide' || move.target === 'ally') {
			return pokemon;
		}
		return pokemon.side.foe.active[0];
	};
	this.runMove = function(move, pokemon, target) {
		move = selfB.getMove(move);
		if (!target) {
			target = selfB.resolveTarget(pokemon, move);
		}

		BattleScripts.runMove.call(selfB, move, pokemon, target);
	};
	this.useMove = function(move, pokemon, target, flags) {
		move = selfB.getMove(move);
		if (!target) target = selfB.resolveTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}

		BattleScripts.useMove.call(selfB, move, pokemon, target, flags);
	};
	this.moveHit = function(target, source, move, a, b) {
		BattleScripts.moveHit.call(selfB, target, source, move, a, b);
	};
	this.checkFainted = function() {
		if (selfB.p1.active[0].fainted || selfB.p2.active[0].fainted) {
			selfB.callback('switch');
			selfB.decisionWaiting = true;
			return true;
		}
		return false;
	};
	this.queue = [];
	this.faintQueue = [];
	this.decisionWaiting = false;
	this.faintMessages = function() {
		while (selfB.faintQueue.length) {
			var faintData = selfB.faintQueue.shift();
			if (!faintData.target.fainted) {
				selfB.add('faint', faintData.target);
				selfB.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				faintData.target.fainted = true;
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
	this.addQueue = function(decision, noSort) {
		if (decision) {
			if (!decision.priority) {
				var priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 6,
					'runSwitch': 5.9,
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
			if (!decision.side) decision.side = decision.pokemon;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && decision.newPokemon) decision.speed = decision.newPokemon.stats.spe;
			if (!decision.speed) decision.speed = decision.pokemon.stats.spe;
			selfB.queue.push(decision);
		}
		if (!noSort) {
			selfB.queue.sort(selfB.comparePriority);
		}
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
			selfB.add('start');
			selfB.switchIn(selfB.p1.pokemon[0]);
			selfB.switchIn(selfB.p2.pokemon[0]);
			selfB.midTurn = true;
			break;
		case 'move':
			if (decision.pokemon !== decision.pokemon.side.active[0]) return false;
			if (decision.pokemon.fainted) return false;
			selfB.runMove(decision.move, decision.pokemon, selfB.getTarget(decision));
			break;
		case 'beforeTurnMove':
			if (decision.pokemon !== decision.pokemon.side.active[0]) return false;
			if (decision.pokemon.fainted) return false;
			selfB.debug('before turn callback: '+decision.move.id);
			decision.move.beforeTurnCallback.call(selfB, decision.pokemon, selfB.getTarget(decision));
			break;
		case 'event':
			selfB.runEvent(decision.event, decision.pokemon);
			break;
		case 'team':
			var i = parseInt(decision.team[0]);
			if (i >= 6 || i < 0) return;

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
				if (!(lastMove.batonPass || (lastMove.self && lastMove.self.batonPass))) {
					// Don't run any event handlers if Baton Pass was used.
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
			}
			if (decision.pokemon && !decision.pokemon.hp && !decision.pokemon.fainted) {
				break;
			}
			selfB.switchIn(decision.newPokemon);
			//decision.pokemon.runSwitchIn();
			break;
		case 'runSwitch':
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
		if (selfB.faintMessages()) return true;
		selfB.eachEvent('Update');
		if (selfB.p1.active[0].switchFlag) {
			selfB.p1.active[0].switchFlag = false;
			if (selfB.canSwitch(selfB.p1)) {
				selfB.callback('switch-ally');
				selfB.decisionWaiting = true;
				return true;
			}
		}
		if (selfB.p2.active[0].switchFlag) {
			selfB.p2.active[0].switchFlag = false;
			if (selfB.canSwitch(selfB.p2)) {
				selfB.callback('switch-foe');
				selfB.decisionWaiting = true;
				return true;
			}
		}
		return false;
	};
	this.go = function() {
		selfB.add('');
		if (selfB.curCallback) {
			selfB.curCallback = '';
		}

		if (selfB.p1.decision && selfB.p1.decision !== true) {
			selfB.addQueue(selfB.p1.decision, true);
			selfB.p1.decision = true;
		}
		if (selfB.p2.decision && selfB.p2.decision !== true) {
			selfB.addQueue(selfB.p2.decision, true);
			selfB.p2.decision = true;
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

			if (selfB.decisionWaiting) {
				return;
			}

			if (!selfB.queue.length || selfB.queue[0].choice === 'runSwitch') {
				if (selfB.faintMessages()) return;
			}

			if (selfB.ended) return;
		}
		if (selfB.checkFainted()) return;

		selfB.nextTurn();
		selfB.midTurn = false;
		selfB.queue = [];
	};
	this.changeDecision = function(pokemon, decision) {
		selfB.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		selfB.addQueue(decision);
	};
	this.decision = function(user, choice, data, recurse) {
		if (!recurse) recurse = 0;
		if (recurse > 2) {
			console.log('infinite recursion; breaking');
			selfB.add('message Stack overflow detected.');
			selfB.add('message BATTLE CRASHED.');

			selfB.win();
			return false; // infinite recursion
		}
		if (!user) return; // wtf
		if (!user.sides[selfB.roomid]) return; // wtf
		var side = user.sides[selfB.roomid];
		var decision = {side: side, choice: choice, priority: 0, speed: 0};
		selfB.cancelDecision(side.active[0]);
		if (choice === 'undo') {
			if (side.decision !== true) {
				// Don't undo a decision if it's not your turn
				side.decision = null;
			}
			return;
		} else if (choice === 'team') {
			if (selfB.curCallback !== 'team-preview') {
				return; // hacker!
			}
			if (!data) {
				return; // hacker!
			}
			decision.team = data;
			side.decision = decision;
		} else if (choice === 'switch') {
			console.log('switching to '+data);
			data = floor(data);
			if (data < 0) data = 0;
			if (data > side.pokemon.length-1) data = side.pokemon.length-1;
			var pokemon = side.pokemon[data];
			if (pokemon && !pokemon.fainted) {
				decision.priority = 6;
				decision.newPokemon = pokemon;
				// todo: wtf
				if (!side.active[0]) {
					selfB.debug("The game hasn't started yet");
					selfB.decision(user, 'move', 'no clue', recurse+1);
					return;
				}
				decision.pokemon = side.active[0];
				if (side.active[0].trapped && selfB.curCallback === 'move') {
					// hacker!
					selfB.debug("Can't switch: The active pokemon is trapped");
					selfB.decision(user, 'move', 'switch trapped', recurse+1);
					return;
				}
				if (decision.pokemon === pokemon) {
					// no
					selfB.debug("Can't switch: You can't switch to an active pokemon");
					selfB.decision(user, 'move', 'null switch', recurse+1);
					return;
				}
				side.decision = decision;
			} else {
				selfB.debug("Can't switch: This pokemon doesn't exist");
				// hacker!
				selfB.decision(user, 'move', 'pokemon doesnt exist', recurse+1);
				return;
			}
		}
		if (choice === 'move') {
			if (selfB.curCallback !== 'move') {
				return; // hacker!
			}
			var move = selfB.getMove(data);
			if (move) {
				if (side.active[0].fainted) {
					// hacker!
					var pokemon = selfB.getRandomSwitchable(side);
					if (!pokemon) {
						// double wtf; the game should be ended
						// by this point

						selfB.add('message A player has no usable pokemon, but the battle didn\'t end.');
						selfB.add('message BATTLE CRASHED.');

						selfB.win();
						return;
					}
					selfB.debug('Hacking detected, using fainted pokemon\'s move; forcing switch to '+pokemon.id);
					selfB.decision(user, 'switch', pokemon.id, recurse+1);
				}
				if (!side.active[0].canUseMove(move)) {
					var badmove = move;
					// hacker!
					move = side.active[0].getValidMoves()[0];
					if (move !== 'Struggle' && move !== 'Recharge') {
						selfB.debug('Hacking detected, '+badmove.id+' not allowed; forcing '+move);
					}
				}
				decision.pokemon = side.active[0];
				decision.move = move;
				side.decision = decision;
			} else {
				// hacker!
				selfB.debug('Move not found: '+data);
				selfB.decision(user, 'move', 'switch trapped', recurse+1);
				return;
			}
		}
		if (selfB.p1.decision && selfB.p2.decision) {
			selfB.decisionWaiting = false;
			selfB.go();
		}
	};
	this.add = function() {
		selfB.log.push('| '+Array.prototype.slice.call(arguments).join(' | '));
	};
	this.debug = function(activity) {
		selfB.add('debug', activity);
	};
	this.join = function(user, slot) {
		if (selfB.p1 && selfB.p1.user && selfB.p2 && selfB.p2.user) return false;
		if (!user) return false; // !!!
		if (user.sides[selfB.roomid]) return false;
		if (selfB.p1 && selfB.p1.user || slot === 2) {
			if (selfB.started) {
				user.sides[selfB.roomid] = selfB.p2;
				selfB.p2.user = user;
				user.sides[selfB.roomid].name = user.name;
			} else {
				console.log("NEW SIDE: "+user.name);
				selfB.p2 = new BattleSide(user, selfB, 1);
				selfB.sides[1] = selfB.p2;
				user.sides[selfB.roomid] = selfB.p2;
			}
			selfB.add('player', 'p2', selfB.p2.name, selfB.p2.user.avatar);
		} else {
			if (selfB.started) {
				user.sides[selfB.roomid] = selfB.p1;
				selfB.p1.user = user;
				selfB.p1.name = user.name;
			} else {
				console.log("NEW SIDE: "+user.name);
				selfB.p1 = new BattleSide(user, selfB, 0);
				selfB.sides[0] = selfB.p1;
				user.sides[selfB.roomid] = selfB.p1;
			}
			selfB.add('player', 'p1', selfB.p1.name, selfB.p1.user.avatar);
		}
		selfB.start();
		return true;
	};
	this.rename = function(user) {
		if (!user || !user.sides[selfB.roomid]) return;
		if (user.sides[selfB.roomid] === selfB.p1) {
			user.sides[selfB.roomid].name = user.name;
			selfB.add('player', 'p1', selfB.p1.name, user.avatar);
		}
		if (user.sides[selfB.roomid] === selfB.p2) {
			user.sides[selfB.roomid].name = user.name;
			selfB.add('player', 'p2', selfB.p2.name, user.avatar);
		}
	};
	this.leave = function(user) {
		if (!user) return false;
		if (!user.sides[selfB.roomid]) return false;
		user.sides[selfB.roomid].emitUpdate({side: 'none'});
		if (selfB.p2 === user.sides[selfB.roomid]) {
			delete user.sides[selfB.roomid];
			selfB.p2.user = null;
			selfB.add('player', 'p2');
			selfB.active = false;
		} else if (selfB.p1 === user.sides[selfB.roomid]) {
			delete user.sides[selfB.roomid];
			selfB.p1.user = null;
			selfB.add('player', 'p1');
			selfB.active = false;
		}
		return true;
	};
	this.getUpdates = function() {
		var prevUpdate = selfB.lastUpdate;
		if (selfB.lastUpdate === selfB.log.length) return null;
		selfB.lastUpdate = selfB.log.length;
		return {
			prevUpdate: prevUpdate,
			updates: selfB.log.slice(prevUpdate),
			active: selfB.active
		};
	};
	this.getUpdatesFrom = function(prevUpdate) {
		if (!prevUpdate) prevUpdate = 0;
		return {
			prevUpdate: prevUpdate,
			updates: selfB.log.slice(prevUpdate)
		};
	};

	// merge in scripts and tools
	for (var i in Tools) {
		if (!this[i]) {
			this[i] = Tools[i];
		}
	}

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
			delete selfB.queue[i].user;
			selfB.queue[i] = null;
		}
		selfB.queue = null;

		// in case the garbage collector really sucks, at least deallocate the log
		selfB.log = null;

		// get rid of some possibly-circular references

		selfB = null;
	};
}

exports.BattlePokemon = BattlePokemon;
exports.BattleSide = BattleSide;
exports.Battle = Battle;
