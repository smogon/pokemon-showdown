/**
 * Simulator Pokemon
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */
'use strict';

/**
 * An object representing a Pokemon's move
 *
 * @typedef {Object} MoveSlot
 * @property {string} move
 * @property {string} id
 * @property {number} pp
 * @property {number} maxpp
 * @property {string} target
 * @property {string | boolean} disabled
 * @property {string} [disabledSource]
 * @property {boolean} used
 * @property {boolean} [virtual]
 */

class Pokemon {
	/**
	 * @param {string | AnyObject} set
	 * @param {Side} side
	 */
	constructor(set, side) {
		/**@type {Side} */
		this.side = side;
		/**@type {Battle} */
		this.battle = side.battle;

		let pokemonScripts = this.battle.data.Scripts.pokemon;
		if (pokemonScripts) Object.assign(this, pokemonScripts);

		if (typeof set === 'string') set = {name: set};

		// "pre-bound" functions for nicer syntax
		// allows them to be passed directly to Battle#add
		this.getHealth = (/**@param {Side} side */side => this.getHealthInner(side));
		this.getDetails = (/**@param {Side} side */side => this.getDetailsInner(side));

		this.set = set;

		this.baseTemplate = this.battle.getTemplate(set.species || set.name);
		if (!this.baseTemplate.exists) {
			throw new Error(`Unidentified species: ${this.baseTemplate.name}`);
		}
		this.species = Dex.getSpecies(set.species);
		if (set.name === set.species || !set.name) {
			set.name = this.baseTemplate.baseSpecies;
		}
		this.name = set.name.substr(0, 20);
		this.speciesid = toId(this.species);
		this.template = this.baseTemplate;
		this.moves = [];
		this.baseMoves = this.moves;
		this.movepp = {};
		/**@type {MoveSlot[]} */
		this.moveset = [];
		/**@type {MoveSlot[]} */
		this.baseMoveset = [];
		/**@type {AnyObject} */
		// @ts-ignore - null used for this.formeChange(this.baseTemplate)
		this.baseStats = null;

		this.trapped = false;
		this.maybeTrapped = false;
		this.maybeDisabled = false;
		/**@type {?Pokemon} */
		this.illusion = null;
		this.fainted = false;
		this.faintQueued = false;
		this.lastItem = '';
		this.ateBerry = false;
		/**@type {string} */
		this.status = '';
		this.position = 0;

		this.switchFlag = false;
		this.forceSwitchFlag = false;
		this.switchCopyFlag = '';
		/**@type {?number} */
		this.draggedIn = null;

		this.lastMove = '';
		/**@type {string | boolean} */
		this.moveThisTurn = '';

		this.lastDamage = 0;
		this.lastAttackedBy = null;
		this.usedItemThisTurn = false;
		this.newlySwitched = false;
		this.beingCalledBack = false;
		this.isActive = false;
		this.activeTurns = 0;
		/** Have this pokemon's Start events run yet? */
		this.isStarted = false;
		this.transformed = false;
		this.duringMove = false;
		this.speed = 0;
		this.abilityOrder = 0;

		set.level = this.battle.clampIntRange(set.forcedLevel || set.level || 100, 1, 9999);
		this.level = set.level;

		let genders = {M:'M', F:'F', N:'N'};
		this.gender = genders[set.gender] || this.template.gender || (Math.random() * 2 < 1 ? 'M' : 'F');
		if (this.gender === 'N') this.gender = '';
		this.happiness = typeof set.happiness === 'number' ? this.battle.clampIntRange(set.happiness, 0, 255) : 255;
		this.pokeball = this.set.pokeball || 'pokeball';

		this.fullname = this.side.id + ': ' + this.name;
		this.details = this.species + (this.level === 100 ? '' : ', L' + this.level) + (this.gender === '' ? '' : ', ' + this.gender) + (this.set.shiny ? ', shiny' : '');

		this.id = this.fullname; // shouldn't really be used anywhere

		/**@type {AnyObject} */
		this.statusData = {};
		this.volatiles = {};

		this.heightm = this.template.heightm;
		this.weightkg = this.template.weightkg;

		this.baseAbility = toId(set.ability);
		this.ability = this.baseAbility;
		this.item = toId(set.item);
		this.abilityData = {id: this.ability};
		this.itemData = {id: this.item};
		this.speciesData = {id: this.speciesid};

		/**@type {string[]} */
		this.types = this.baseTemplate.types;
		/**@type {string} */
		this.addedType = '';
		/**@type {boolean} */
		this.knownType = true;

		if (this.set.moves) {
			for (let i = 0; i < this.set.moves.length; i++) {
				let move = this.battle.getMove(this.set.moves[i]);
				if (!move.id) continue;
				if (move.id === 'hiddenpower' && move.type !== 'Normal') {
					if (!set.hpType) set.hpType = move.type;
					move = this.battle.getMove('hiddenpower');
				}
				this.baseMoveset.push({
					move: move.name,
					id: move.id,
					pp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
					maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					disabledSource: '',
					used: false,
				});
				this.moves.push(move.id);
			}
		}

		/** @type {string?} */
		// @ts-ignore
		this.canMegaEvo = this.battle.canMegaEvo(this);
		/** @type {string?} */
		// @ts-ignore
		this.canUltraBurst = this.battle.canUltraBurst(this);

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

		let hpData = this.battle.getHiddenPower(this.set.ivs);
		/**@type {string} */
		this.hpType = set.hpType || hpData.type;
		/**@type {number} */
		this.hpPower = hpData.power;

		/**@type {{[k: string]: number}} */
		this.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
		this.stats = {atk:0, def:0, spa:0, spd:0, spe:0};

		// This is used in gen 1 only, here to avoid code repetition.
		// Only declared if gen 1 to avoid declaring an object we aren't going to need.
		if (this.battle.gen === 1) this.modifiedStats = {atk:0, def:0, spa:0, spd:0, spe:0};

		this.isStale = 0;
		this.isStaleCon = 0;
		this.isStaleHP = this.maxhp;
		this.isStalePPTurns = 0;

		// Transform copies IVs in gen 4 and earlier, so we track the base IVs/HP-type/power
		this.baseIvs = this.set.ivs;
		this.baseHpType = this.hpType;
		this.baseHpPower = this.hpPower;

		this.clearVolatile();

		/**@type {number} */
		this.maxhp = this.template.maxHP || this.baseStats.hp;
		/**@type {number} */
		this.hp = this.hp || this.maxhp;

		this.staleWarned = false;
	}

	toString() {
		let fullname = this.fullname;
		if (this.illusion) fullname = this.illusion.fullname;

		let positionList = 'abcdef';
		if (this.isActive) return fullname.substr(0, 2) + positionList[this.position] + fullname.substr(2);
		return fullname;
	}

	/**
	 * @param {Side} side
	 */
	getDetailsInner(side) {
		if (this.illusion) return this.illusion.details + '|' + this.getHealthInner(side);
		return this.details + '|' + this.getHealthInner(side);
	}

	updateSpeed() {
		this.speed = this.getDecisionSpeed();
	}

	/**
	 * @param {string} statName
	 * @param {number} boost
	 * @param {number} [modifier]
	 */
	calculateStat(statName, boost, modifier) {
		statName = toId(statName);

		if (statName === 'hp') return this.maxhp; // please just read .maxhp directly

		// base stat
		let stat = this.stats[statName];

		// Wonder Room swaps defenses before calculating anything else
		if ('wonderroom' in this.battle.pseudoWeather) {
			if (statName === 'def') {
				stat = this.stats['spd'];
			} else if (statName === 'spd') {
				stat = this.stats['def'];
			}
		}

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

		// @ts-ignore
		if (this.battle.getStatCallback) {
			// @ts-ignore
			stat = this.battle.getStatCallback(stat, statName, this);
		}

		return stat;
	}

	/**
	 * @param {string} statName
	 * @param {boolean} [unboosted]
	 * @param {boolean} [unmodified]
	 */
	getStat(statName, unboosted, unmodified) {
		statName = toId(statName);

		if (statName === 'hp') return this.maxhp; // please just read .maxhp directly

		// base stat
		let stat = this.stats[statName];

		// Download ignores Wonder Room's effect, but this results in
		// stat stages being calculated on the opposite defensive stat
		if (unmodified && 'wonderroom' in this.battle.pseudoWeather) {
			if (statName === 'def') {
				statName = 'spd';
			} else if (statName === 'spd') {
				statName = 'def';
			}
		}

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

		// @ts-ignore
		if (this.battle.getStatCallback) {
			// @ts-ignore
			stat = this.battle.getStatCallback(stat, statName, this, unboosted);
		}
		return stat;
	}

	getDecisionSpeed() {
		let speed = this.getStat('spe', false, false);
		if (speed > 10000) speed = 10000;
		if (this.battle.getPseudoWeather('trickroom')) {
			speed = 0x2710 - speed;
		}
		return speed & 0x1FFF;
	}

	getWeight() {
		let weight = this.template.weightkg;
		weight = this.battle.runEvent('ModifyWeight', this, null, null, weight);
		if (weight < 0.1) weight = 0.1;
		return weight;
	}

	/**
	 * @param {string | Move} move
	 */
	getMoveData(move) {
		move = this.battle.getMove(move);
		for (let i = 0; i < this.moveset.length; i++) {
			let moveData = this.moveset[i];
			if (moveData.id === move.id) {
				return moveData;
			}
		}
		return null;
	}

	/**
	 * @param {Move} move
	 * @param {Pokemon} target
	 */
	getMoveTargets(move, target) {
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
					// @ts-ignore
					if (this.battle.isAdjacent(this, this.side.active[i])) {
						targets.push(this.side.active[i]);
					}
				}
			}
			for (let i = 0; i < this.side.foe.active.length; i++) {
				// @ts-ignore
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
				if (!move.flags['charge'] || this.volatiles['twoturnmove'] ||
						(move.id.startsWith('solarb') && this.battle.isWeather(['sunnyday', 'desolateland'])) ||
						(this.hasItem('powerherb') && move.id !== 'skydrop')) {
					target = this.battle.priorityEvent('RedirectTarget', this, this, move, target);
				}
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
	}

	ignoringAbility() {
		return !!((this.battle.gen >= 5 && !this.isActive) || (this.volatiles['gastroacid'] && !['comatose', 'multitype', 'schooling', 'stancechange'].includes(this.ability)));
	}

	ignoringItem() {
		return !!((this.battle.gen >= 5 && !this.isActive) || (this.hasAbility('klutz') && !this.getItem().ignoreKlutz) || this.volatiles['embargo'] || this.battle.pseudoWeather['magicroom']);
	}

	/**
	 * @param {string | Move} move
	 * @param {number} [amount]
	 */
	deductPP(move, amount) {
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
	}

	/**
	 * @param {string | Move} move
	 * @param {number} targetLoc
	 */
	moveUsed(move, targetLoc) {
		this.lastMove = this.battle.getMove(move).id;
		this.lastMoveTargetLoc = targetLoc;
		this.moveThisTurn = this.lastMove;
	}

	/**
	 * @param {string | Move} move
	 * @param {number} damage
	 * @param {Pokemon} source
	 */
	gotAttacked(move, damage, source) {
		if (!damage) damage = 0;
		move = this.battle.getMove(move);
		this.lastAttackedBy = {
			pokemon: source,
			damage: damage,
			move: move.id,
			thisTurn: true,
		};
	}

	getLockedMove() {
		let lockedMove = this.battle.runEvent('LockMove', this);
		if (lockedMove === true) lockedMove = false;
		return lockedMove;
	}

	/**
	 * @param {string} [lockedMove]
	 * @param {boolean} [restrictData]
	 */
	getMoves(lockedMove, restrictData) {
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
				// @ts-ignore
				moveName = 'Return ' + this.battle.getMove('return').basePowerCallback(this);
			} else if (moveEntry.id === 'frustration') {
				// @ts-ignore
				moveName = 'Frustration ' + this.battle.getMove('frustration').basePowerCallback(this);
			}
			let target = moveEntry.target;
			if (moveEntry.id === 'curse') {
				if (!this.hasType('Ghost')) {
					target = this.battle.getMove('curse').nonGhostTarget || moveEntry.target;
				}
			}
			let disabled = moveEntry.disabled;
			// @ts-ignore
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
	}

	getRequestData() {
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

		if (!lockedMove) {
			if (this.canMegaEvo) data.canMegaEvo = true;
			if (this.canUltraBurst) data.canUltraBurst = true;
			// @ts-ignore
			let canZMove = this.battle.canZMove(this);
			if (canZMove) data.canZMove = canZMove;
		}

		return data;
	}

	isLastActive() {
		if (!this.isActive) return false;

		let allyActive = this.side.active;
		for (let i = this.position + 1; i < allyActive.length; i++) {
			if (allyActive[i] && !allyActive[i].fainted) return false;
		}
		return true;
	}

	positiveBoosts() {
		let boosts = 0;
		for (let i in this.boosts) {
			if (this.boosts[i] > 0) boosts += this.boosts[i];
		}
		return boosts;
	}

	/**
	 * @param {AnyObject} boost
	 */
	boostBy(boost) {
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
	}

	clearBoosts() {
		for (let i in this.boosts) {
			this.boosts[i] = 0;
		}
	}

	/**
	 * @param {AnyObject} boost
	 */
	setBoost(boost) {
		for (let i in boost) {
			this.boosts[i] = boost[i];
		}
	}

	/**
	 * @param {Pokemon} pokemon
	 */
	copyVolatileFrom(pokemon) {
		this.clearVolatile();
		this.boosts = pokemon.boosts;
		for (let i in pokemon.volatiles) {
			if (this.battle.getEffect(i).noCopy) continue;
			// shallow clones
			this.volatiles[i] = Object.assign({}, pokemon.volatiles[i]);
			if (this.volatiles[i].linkedPokemon) {
				delete pokemon.volatiles[i].linkedPokemon;
				delete pokemon.volatiles[i].linkedStatus;
				for (let linkedPoke of this.volatiles[i].linkedPokemon) {
					let linkedPokeLinks = linkedPoke.volatiles[this.volatiles[i].linkedStatus].linkedPokemon;
					linkedPokeLinks[linkedPokeLinks.indexOf(pokemon)] = this;
				}
			}
		}
		pokemon.clearVolatile();
		for (let i in this.volatiles) {
			// @ts-ignore
			this.battle.singleEvent('Copy', this.getVolatile(i), this.volatiles[i], this);
		}
	}

	/**
	 * @param {Pokemon} pokemon
	 * @param {Pokemon} user
	 * @param {Effect} effect
	 */
	transformInto(pokemon, user, effect) {
		let template = pokemon.template;
		if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5)) {
			return false;
		}
		if (!template.abilities || (pokemon && pokemon.transformed && this.battle.gen >= 2) || (user && user.transformed && this.battle.gen >= 5)) {
			return false;
		}
		if (!this.formeChange(template, pokemon)) {
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
		// @ts-ignore
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
				let item = Dex.getItem(this.item);
				let targetForme = (item && item.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
				if (this.template.species !== targetForme) {
					this.formeChange(targetForme);
					this.battle.add('-formechange', this, targetForme);
				}
			}
		}

		return true;
	}

	/**
	 * @param {string | Template} templateId
	 * @param {Pokemon | Effect} [source]
	 */
	formeChange(templateId, source) {
		let template = this.battle.getTemplate(templateId);

		if (!template.abilities) return false;

		template = this.battle.singleEvent('ModifyTemplate', this.battle.getFormat(), null, this, source, null, template);

		if (!template) return false;

		this.template = template;

		this.types = template.types;
		this.addedType = template.addedType || '';
		this.knownType = true;

		if (!source) {
			let stats = this.battle.spreadModify(this.template.baseStats, this.set);
			if (!this.baseStats) this.baseStats = stats;
			for (let statName in this.stats) {
				this.stats[statName] = stats[statName];
				this.baseStats[statName] = stats[statName];
				if (this.modifiedStats) this.modifiedStats[statName] = stats[statName]; // Gen 1: Reset modified stats.
			}
			if (this.battle.gen <= 1) {
				// Gen 1: Re-Apply burn and para drops.
				// FIXME: modifyStat() is only defined for the Gen 1 mod...
				// @ts-ignore
				if (this.status === 'par') this.modifyStat('spe', 0.25);
				// @ts-ignore
				if (this.status === 'brn') this.modifyStat('atk', 0.5);
			}
			this.speed = this.stats.spe;
		}
		return true;
	}

	clearVolatile() {
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
				this.removeLinkedVolatiles(this.volatiles[i].linkedStatus, this.volatiles[i].linkedPokemon);
			}
		}
		this.volatiles = {};
		this.switchFlag = false;
		this.forceSwitchFlag = false;

		this.lastMove = '';
		this.moveThisTurn = '';

		this.lastDamage = 0;
		this.lastAttackedBy = null;
		this.newlySwitched = true;
		this.beingCalledBack = false;

		this.formeChange(this.baseTemplate);
	}

	/**
	 * @param {string} type
	 */
	hasType(type) {
		if (!type) return false;
		if (Array.isArray(type)) {
			for (let i = 0; i < type.length; i++) {
				if (this.hasType(type[i])) return true;
			}
		} else {
			if (this.getTypes().includes(type)) return true;
		}
		return false;
	}

	/**
	 * This function only puts the pokemon in the faint queue;
	 * actually setting of this.fainted comes later when the
	 * faint queue is resolved.
	 *
	 * Returns the amount of damage actually dealt
	 * @param {Pokemon?} source
	 * @param {Effect?} effect
	 */
	faint(source = null, effect = null) {
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
	}

	/**
	 * @param {number} d
	 * @param {Pokemon?} source
	 * @param {Effect?} effect
	 */
	damage(d, source = null, effect = null) {
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
	}

	/**
	 * @param {boolean} isHidden
	 */
	tryTrap(isHidden) {
		if (this.runStatusImmunity('trapped')) {
			if (this.trapped && isHidden) return true;
			this.trapped = isHidden ? 'hidden' : true;
			return true;
		}
		return false;
	}

	/**
	 * @param {string} moveid
	 */
	hasMove(moveid) {
		moveid = toId(moveid);
		if (moveid.substr(0, 11) === 'hiddenpower') moveid = 'hiddenpower';
		for (let i = 0; i < this.moveset.length; i++) {
			if (moveid === this.battle.getMove(this.moveset[i].move).id) {
				return moveid;
			}
		}
		return false;
	}

	/**
	 * @param {string} moveid
	 * @param {boolean} [isHidden]
	 * @param {Effect} [sourceEffect]
	 */
	disableMove(moveid, isHidden, sourceEffect) {
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
	}

	/**
	 * Returns the amount of damage actually healed
	 * @param {number} d
	 * @param {Pokemon?} [source]
	 * @param {Effect?} [effect]
	 */
	heal(d, source = null, effect = null) {
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
	}

	/**
	 * Sets HP, returns delta
	 * @param {number} d
	 */
	sethp(d) {
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
	}

	/**
	 * @param {string} status
	 * @param {Pokemon?} source
	 * @param {Effect?} sourceEffect
	 */
	trySetStatus(status, source = null, sourceEffect = null) {
		return this.setStatus(this.status || status, source, sourceEffect);
	}

	/**
	 * Unlike clearStatus, gives cure message
	 * @param {boolean} silent
	 */
	cureStatus(silent) {
		if (!this.hp) return false;
		if (this.status) {
			this.battle.add('-curestatus', this, this.status, silent ? '[silent]' : '[msg]');
			this.setStatus('');
		}
	}

	/**
	 * @param {string | Effect} status
	 * @param {Pokemon?} [source]
	 * @param {Effect?} [sourceEffect]
	 * @param {boolean} [ignoreImmunities]
	 */
	setStatus(status, source = null, sourceEffect = null, ignoreImmunities = false) {
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

		if (!ignoreImmunities && status.id && !(source && source.hasAbility('corrosion') && ['tox', 'psn'].includes(status.id))) {
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
	}

	/**
	 * Unlike cureStatus, does not give cure message
	 */
	clearStatus() {
		return this.setStatus('');
	}

	getStatus() {
		return this.battle.getEffect(this.status);
	}

	/**
	 * @param {string} itemId
	 * @param {Pokemon} source
	 * @param {Effect} sourceEffect
	 */
	eatItem(itemId, source, sourceEffect) {
		if (!this.hp || !this.isActive) return false;
		if (!this.item) return false;

		let id = toId(itemId);
		if (id && this.item !== id) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		let item = this.getItem();
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
	}

	/**
	 * @param {string} itemName
	 * @param {Pokemon} source
	 * @param {Effect} sourceEffect
	 */
	useItem(itemName, source, sourceEffect) {
		if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
		if (!this.item) return false;

		let id = toId(itemName);
		if (id && this.item !== id) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		let item = this.getItem();
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
	}

	/**
	 * @param {Pokemon} source
	 */
	takeItem(source) {
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
	}

	/**
	 * @param {string |Item} item
	 * @param {Pokemon} [source]
	 * @param {Effect} [effect]
	 */
	setItem(item, source, effect) {
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
	}

	getItem() {
		return this.battle.getItem(this.item);
	}

	/**
	 * @param {string | string[]} item
	 */
	hasItem(item) {
		if (this.ignoringItem()) return false;
		let ownItem = this.item;
		if (!Array.isArray(item)) {
			return ownItem === toId(item);
		}
		return item.map(toId).includes(ownItem);
	}

	clearItem() {
		return this.setItem('');
	}

	/**
	 * @param {string} abilityName
	 * @param {Pokemon} [source]
	 * @param {Effect} [effect]
	 * @param {boolean} [noForce]
	 */
	setAbility(abilityName, source, effect, noForce) {
		if (!this.hp) return false;
		let ability = this.battle.getAbility(abilityName);
		let oldAbility = this.ability;
		if (noForce && oldAbility === ability.id) {
			return false;
		}
		if (!effect || effect.id !== 'transform') {
			if (['illusion', 'multitype', 'stancechange'].includes(ability.id)) return false;
			if (['multitype', 'stancechange'].includes(oldAbility)) return false;
		}
		this.battle.singleEvent('End', this.battle.getAbility(oldAbility), this.abilityData, this, source, effect);
		if (!effect && this.battle.effect && this.battle.effect.effectType === 'Move') {
			this.battle.add('-endability', this, this.battle.getAbility(oldAbility), '[from] move: ' + this.battle.getMove(this.battle.effect.id));
		}
		this.ability = ability.id;
		this.abilityData = {id: ability.id, target: this};
		if (ability.id && this.battle.gen > 3) {
			this.battle.singleEvent('Start', ability, this.abilityData, this, source, effect);
		}
		this.abilityOrder = this.battle.abilityOrder++;
		return oldAbility;
	}

	getAbility() {
		return this.battle.getAbility(this.ability);
	}

	/**
	 * @param {string | string[]} ability
	 */
	hasAbility(ability) {
		if (this.ignoringAbility()) return false;
		let ownAbility = this.ability;
		if (!Array.isArray(ability)) {
			return ownAbility === toId(ability);
		}
		return ability.map(toId).includes(ownAbility);
	}

	clearAbility() {
		return this.setAbility('');
	}

	getNature() {
		return this.battle.getNature(this.set.nature);
	}

	/**
	 * @param {string | Effect} status
	 * @param {Pokemon?} source
	 * @param {Effect?} sourceEffect
	 * @param {string | Effect?} linkedStatus
	 */
	addVolatile(status, source = null, sourceEffect = null, linkedStatus = null) {
		let result;
		status = this.battle.getEffect(status);
		if (!this.hp && !status.affectsFainted) return false;
		if (linkedStatus && source && !source.hp) return false;
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
		if (linkedStatus && source) {
			if (!source.volatiles[linkedStatus.toString()]) {
				source.addVolatile(linkedStatus, this, sourceEffect);
				source.volatiles[linkedStatus.toString()].linkedPokemon = [this];
				source.volatiles[linkedStatus.toString()].linkedStatus = status;
			} else {
				source.volatiles[linkedStatus.toString()].linkedPokemon.push(this);
			}
			this.volatiles[status.toString()].linkedPokemon = [source];
			this.volatiles[status.toString()].linkedStatus = linkedStatus;
		}
		return true;
	}

	/**
	 * @param {string | Effect} status
	 */
	getVolatile(status) {
		status = this.battle.getEffect(status);
		if (!this.volatiles[status.id]) return null;
		return status;
	}

	/**
	 * @param {string | Effect} status
	 */
	removeVolatile(status) {
		if (!this.hp) return false;
		status = this.battle.getEffect(status);
		if (!this.volatiles[status.id]) return false;
		this.battle.singleEvent('End', status, this.volatiles[status.id], this);
		let linkedPokemon = this.volatiles[status.id].linkedPokemon;
		let linkedStatus = this.volatiles[status.id].linkedStatus;
		delete this.volatiles[status.id];
		if (linkedPokemon) {
			this.removeLinkedVolatiles(linkedStatus, linkedPokemon);
		}
		return true;
	}

	/**
	 * @param {string | Effect} linkedStatus
	 * @param {Pokemon[]} linkedPokemon
	 */
	removeLinkedVolatiles(linkedStatus, linkedPokemon) {
		linkedStatus = linkedStatus.toString();
		for (let linkedPoke of linkedPokemon) {
			if (linkedPoke.volatiles[linkedStatus]) {
				linkedPoke.volatiles[linkedStatus].linkedPokemon.splice(linkedPoke.volatiles[linkedStatus].linkedPokemon.indexOf(this), 1);
				if (linkedPoke.volatiles[linkedStatus].linkedPokemon.length === 0) {
					linkedPoke.removeVolatile(linkedStatus);
				}
			}
		}
	}

	/**
	 * @param {Side | boolean} side
	 */
	getHealthInner(side) {
		if (!this.hp) return '0 fnt';
		let hpstring;
		// side === true in replays
		if (side === this.side || this.battle.reportExactHP || (side === true && this.battle.replayExactHP)) {
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
	}

	/**
	 * Sets a type (except on Arceus, who resists type changes)
	 * newType can be an array, but this is for OMs only. The game in
	 * reality doesn't support setting a type to more than one type.
	 * @param {string | string[]} newType
	 * @param {boolean} enforce
	 */
	setType(newType, enforce) {
		// First type of Arceus, Silvally cannot be normally changed
		if (!enforce && (this.template.num === 493 || this.template.num === 773)) return false;

		if (!newType) throw new Error("Must pass type to setType");
		this.types = (typeof newType === 'string' ? [newType] : newType);
		this.addedType = '';
		this.knownType = true;

		return true;
	}

	/**
	 * Removes any types added previously and adds another one
	 * @param {string} newType
	 */
	addType(newType) {
		this.addedType = newType;

		return true;
	}

	/**
	 * @param {boolean} [excludeAdded]
	 */
	getTypes(excludeAdded) {
		let types = this.types;
		if (!excludeAdded && this.addedType) {
			types = types.concat(this.addedType);
		}
		// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
		if ('roost' in this.volatiles && !types.includes('???')) {
			types = types.filter(type => type !== 'Flying');
		}
		if (types.length) return types;
		return [this.battle.gen >= 5 ? 'Normal' : '???'];
	}

	/**
	 * @param {boolean} negateImmunity
	 */
	isGrounded(negateImmunity) {
		if ('gravity' in this.battle.pseudoWeather) return true;
		if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
		if ('smackdown' in this.volatiles) return true;
		let item = (this.ignoringItem() ? '' : this.item);
		if (item === 'ironball') return true;
		// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
		if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
		if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
		if ('magnetrise' in this.volatiles) return false;
		if ('telekinesis' in this.volatiles) return false;
		return item !== 'airballoon';
	}

	isSemiInvulnerable() {
		if (this.volatiles['fly'] || this.volatiles['bounce'] || this.volatiles['skydrop'] || this.volatiles['dive'] || this.volatiles['dig'] || this.volatiles['phantomforce'] || this.volatiles['shadowforce']) {
			return true;
		}
		for (let i = 0; i < this.side.foe.active.length; i++) {
			if (this.side.foe.active[i].volatiles['skydrop'] && this.side.foe.active[i].volatiles['skydrop'].source === this) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Move} move
	 */
	runEffectiveness(move) {
		let totalTypeMod = 0;
		let types = this.getTypes();
		for (let i = 0; i < types.length; i++) {
			let typeMod = this.battle.getEffectiveness(move, types[i]);
			typeMod = this.battle.singleEvent('Effectiveness', move, null, types[i], move, null, typeMod);
			totalTypeMod += this.battle.runEvent('Effectiveness', this, types[i], move, typeMod);
		}
		return totalTypeMod;
	}

	/**
	 * @param {string} type
	 * @param {string | boolean} [message]
	 */
	runImmunity(type, message) {
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
	}

	/**
	 * @param {string} type
	 * @param {string} [message]
	 */
	runStatusImmunity(type, message) {
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
	}

	destroy() {
		// deallocate ourself
		// get rid of some possibly-circular references
		// @ts-ignore - prevent type | null
		this.battle = null;
		// @ts-ignore - prevent type | null
		this.side = null;
	}
}

module.exports = Pokemon;
