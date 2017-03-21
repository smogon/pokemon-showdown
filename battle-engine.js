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

const Tools = require('./tools');
const PRNG = require('./prng');

class BattlePokemon {
	constructor(set, side) {
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
			throw new Error(`Unidentified species: ${this.baseTemplate.name}`);
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

		this.trapped = false;
		this.maybeTrapped = false;
		this.maybeDisabled = false;
		this.illusion = null;
		this.fainted = false;
		this.faintQueued = false;
		this.lastItem = '';
		this.ateBerry = false;
		this.status = '';
		this.position = 0;

		this.lastMove = '';
		this.moveThisTurn = '';

		this.lastDamage = 0;
		this.lastAttackedBy = null;
		this.usedItemThisTurn = false;
		this.newlySwitched = false;
		this.beingCalledBack = false;
		this.isActive = false;
		this.isStarted = false; // has this pokemon's Start events run yet?
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

		let hpData = this.battle.getHiddenPower(this.set.ivs);
		this.hpType = set.hpType || hpData.type;
		this.hpPower = hpData.power;

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

		this.clearVolatile(true);

		this.maxhp = this.template.maxHP || this.baseStats.hp;
		this.hp = this.hp || this.maxhp;
	}

	toString() {
		let fullname = this.fullname;
		if (this.illusion) fullname = this.illusion.fullname;

		let positionList = 'abcdef';
		if (this.isActive) return fullname.substr(0, 2) + positionList[this.position] + fullname.substr(2);
		return fullname;
	}
	static getDetails(side) {
		if (this.illusion) return this.illusion.details + '|' + this.getHealth(side);
		return this.details + '|' + this.getHealth(side);
	}
	updateSpeed() {
		this.speed = this.getDecisionSpeed();
	}
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

		if (this.battle.getStatCallback) {
			stat = this.battle.getStatCallback(stat, statName, this);
		}

		return stat;
	}
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
		if (this.battle.getStatCallback) {
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
				if (!move.flags['charge'] || this.volatiles['twoturnmove'] ||
						(move.id === 'solarbeam' && this.battle.isWeather(['sunnyday', 'desolateland'])) ||
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
		return !!((this.battle.gen >= 5 && !this.isActive) || (this.volatiles['gastroacid'] && !(this.ability in {comatose:1, multitype:1, schooling:1, stancechange:1})));
	}
	ignoringItem() {
		return !!((this.battle.gen >= 5 && !this.isActive) || (this.hasAbility('klutz') && !this.getItem().ignoreKlutz) || this.volatiles['embargo'] || this.battle.pseudoWeather['magicroom']);
	}
	deductPP(move, amount, source) {
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
	moveUsed(move, targetLoc) {
		this.lastMove = this.battle.getMove(move).id;
		this.lastMoveTargetLoc = targetLoc;
		this.moveThisTurn = this.lastMove;
	}
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
			let canZMove = this.battle.canZMove(this);
			if (canZMove) data.canZMove = canZMove;
		}

		return data;
	}
	isLastActive() {
		if (!this.isActive) return false;

		let allyActive = this.side.active;
		for (let i = this.position + 1; i < allyActive.length; i++) {
			if (allyActive[i] && !allyActive.fainted) return false;
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
	setBoost(boost) {
		for (let i in boost) {
			this.boosts[i] = boost[i];
		}
	}
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
				this.volatiles[i].linkedPokemon.volatiles[this.volatiles[i].linkedStatus].linkedPokemon = this;
			}
		}
		pokemon.clearVolatile();
		for (let i in this.volatiles) {
			this.battle.singleEvent('Copy', this.getVolatile(i), this.volatiles[i], this);
		}
	}
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
	}
	formeChange(template, source) {
		template = this.battle.getTemplate(template);

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
				if (this.status === 'par') this.modifyStat('spe', 0.25);
				if (this.status === 'brn') this.modifyStat('atk', 0.5);
			}
			this.speed = this.stats.spe;
		}
		return true;
	}
	clearVolatile(init) {
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
	}
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
	// returns the amount of damage actually dealt
	faint(source, effect) {
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
	}
	damage(d, source, effect) {
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
	tryTrap(isHidden) {
		if (this.runStatusImmunity('trapped')) {
			if (this.trapped && isHidden) return true;
			this.trapped = isHidden ? 'hidden' : true;
			return true;
		}
		return false;
	}
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
	// returns the amount of damage actually healed
	heal(d) {
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
	// sets HP, returns delta
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
	trySetStatus(status, source, sourceEffect) {
		return this.setStatus(this.status || status, source, sourceEffect);
	}
	cureStatus(silent) {
		if (!this.hp) return false;
		// unlike clearStatus, gives cure message
		if (this.status) {
			this.battle.add('-curestatus', this, this.status, silent ? '[silent]' : '[msg]');
			this.setStatus('');
		}
	}
	setStatus(status, source, sourceEffect, ignoreImmunities) {
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

		if (!ignoreImmunities && status.id && !(source && source.hasAbility('corrosion') && status.id in {'tox': 1, 'psn': 1})) {
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
	clearStatus() {
		// unlike cureStatus, does not give cure message
		return this.setStatus('');
	}
	getStatus() {
		return this.battle.getEffect(this.status);
	}
	eatItem(item, source, sourceEffect) {
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
	}
	useItem(item, source, sourceEffect) {
		if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
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
	}
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
	setAbility(ability, source, effect, noForce) {
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
	getMegaAbility() {
		if (!this.canMegaEvo) return null;
		const megaTemplate = this.battle.getTemplate(this.canMegaEvo);
		return this.battle.getAbility(megaTemplate.abilities['0']);
	}
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
	addVolatile(status, source, sourceEffect, linkedStatus) {
		let result;
		status = this.battle.getEffect(status);
		if (!this.hp && !status.affectsFainted) return false;
		if (linkedStatus && !source.hp) return false;
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
	}
	getVolatile(status) {
		status = this.battle.getEffect(status);
		if (!this.volatiles[status.id]) return null;
		return status;
	}
	removeVolatile(status) {
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
	}
	static getHealth(side) {
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
	addType(newType) {
		// removes any types added previously and adds another one

		this.addedType = newType;

		return true;
	}
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
	isGrounded(negateImmunity) {
		if ('gravity' in this.battle.pseudoWeather) return true;
		if ('ingrain' in this.volatiles) return true;
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
		this.battle = null;
		this.side = null;
	}
}

class BattleSide {
	/**
	 * @param {string} name
	 * @param {Battle} battle
	 * @param {number} n
	 * @param {any} team
	 */
	constructor(name, battle, n, team) {
		let sideScripts = battle.data.Scripts.side;
		if (sideScripts) Object.assign(this, sideScripts);

		this.getChoice = (this.getChoice || BattleSide.getChoice).bind(this);

		this.battle = battle;
		this.n = n;
		this.name = name;
		/** @type {BattlePokemon[]} */
		this.pokemon = [];
		/** @type {BattlePokemon[]} */
		this.active = [null];
		this.sideConditions = {};

		this.pokemonLeft = 0;
		this.faintedLastTurn = false;
		this.faintedThisTurn = false;
		/**
		 * An object representing what the player has chosen to happen.
		 *
		 * @typedef {Object} Choice
		 * @property {boolean} cantUndo - true if the choice can't be cancelled because of the maybeTrapped issue
		 * @property {string} error - contains error text in the case of a choice error
		 * @property {Action[]} actions - array of chosen actions
		 * @property {number} forcedSwitchesLeft - number of switches left that need to be performed
		 * @property {number} forcedPassesLeft - number of passes left that need to be performed
		 * @property {Set<number>} switchIns - indexes of pokemon chosen to switch in
		 * @property {boolean} zMove - true if a Z-move has already been selected
		 * @property {boolean} mega - true if a mega evolution has already been selected
		 */
		/** @type {?Choice} */
		this.choice = null;
		/**
		 * Must be one of:
		 * 'move' - Move request, at the beginning of every turn
		 * 'switch' - Switch request, at the end of every turn with fainted Pokémon, or mid-turn for U-turn etc
		 * 'teampreview' - Team Preview, at the beginning of a battle
		 * '' - No request (waiting for other player's switch request)
		 */
		this.currentRequest = '';
		this.maxTeamSize = 6;
		/** @type {BattleSide} */
		this.foe = null;

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

	static getChoice(side) {
		if (side !== this && side !== true) return '';
		return this.choice.actions.map(action => {
			switch (action.choice) {
			case 'move':
				let details = ``;
				if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc}`;
				if (action.mega) details += ` mega`;
				if (action.zmove) details += ` zmove`;
				return `move ${toId(action.move)}${details}`;
			case 'switch':
			case 'instaswitch':
				return `switch ${action.target.position + 1}`;
			case 'team':
				return `team ${action.pokemon.position + 1}`;
			default:
				return action.choice;
			}
		}).join(', ');
	}

	toString() {
		return this.id + ': ' + this.name;
	}
	getData() {
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
	}
	randomActive() {
		let actives = this.active.filter(active => active && !active.fainted);
		if (!actives.length) return null;
		let i = Math.floor(Math.random() * actives.length);
		return actives[i];
	}
	addSideCondition(status, source, sourceEffect) {
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
	}
	getSideCondition(status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return null;
		return status;
	}
	removeSideCondition(status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return false;
		this.battle.singleEvent('End', status, this.sideConditions[status.id], this);
		delete this.sideConditions[status.id];
		return true;
	}
	send(...parts) {
		let sideUpdate = '|' + parts.map(part => {
			if (typeof part !== 'function') return part;
			return part(this);
		}).join('|');
		this.battle.send('sideupdate', `${this.id}\n${sideUpdate}`);
	}
	emitCallback(...args) {
		this.battle.send('sideupdate', `${this.id}\n|callback|${args.join('|')}`);
	}
	emitRequest(update) {
		this.battle.send('request', `${this.id}\n${JSON.stringify(update)}`);
	}
	emitChoiceError(message) {
		this.choice.error = message;
		this.battle.send('sideupdate', `${this.id}\n|error|[Invalid choice] ${message}`);
		return false;
	}

	isChoiceDone() {
		if (!this.currentRequest) return true;
		if (this.choice.forcedSwitchesLeft) return false;

		if (this.currentRequest === 'teampreview') {
			return this.choice.actions.length >= Math.min(this.maxTeamSize, this.pokemon.length);
		}

		// current request is move/switch
		this.getChoiceIndex(); // auto-pass
		return this.choice.actions.length >= this.active.length;
	}
	chooseMove(moveText, targetLoc, megaOrZ) {
		if (this.currentRequest !== 'move') {
			return this.emitChoiceError(`Can't move: You need a ${this.currentRequest} response`);
		}
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't move: You do not have a Pokémon in slot ${index + 1}`);
		}
		const autoChoose = !moveText;
		const pokemon = this.active[index];

		if (megaOrZ === true) megaOrZ = 'mega';
		if (!targetLoc) targetLoc = 0;

		// Parse moveText (name or index)
		// If the move is not found, the decision is invalid without requiring further inspection.

		const requestMoves = pokemon.getRequestData().moves;
		let moveid = '';
		let targetType = '';
		if (autoChoose) moveText = 1;
		if (typeof moveText === 'number' || /^[0-9]+$/.test(moveText)) {
			// Parse a one-based move index.
			const moveIndex = +moveText - 1;
			if (moveIndex < 0 || moveIndex >= requestMoves.length || !requestMoves[moveIndex]) {
				return this.emitChoiceError(`Can't move: Your ${pokemon.name} doesn't have a move ${moveIndex + 1}`);
			}
			moveid = requestMoves[moveIndex].id;
			targetType = requestMoves[moveIndex].target;
		} else {
			// Parse a move ID.
			// Move names are also allowed, but may cause ambiguity (see client issue #167).
			moveid = toId(moveText);
			if (moveid.startsWith('hiddenpower')) {
				moveid = 'hiddenpower';
			}
			for (let i = 0; i < requestMoves.length; i++) {
				if (requestMoves[i].id !== moveid) continue;
				targetType = requestMoves[i].target || 'normal';
				break;
			}
			if (!targetType) {
				return this.emitChoiceError(`Can't move: Your ${pokemon.name} doesn't have a move matching ${moveid}`);
			}
		}

		const moves = pokemon.getMoves();
		if (autoChoose) {
			for (let i = 0; i < moves.length; i++) {
				if (!moves[i].disabled) {
					moveid = moves[i].id;
					targetType = requestMoves[i].target;
					break;
				}
			}
		}
		const move = this.battle.getMove(moveid);

		// Z-move

		const zMove = megaOrZ === 'zmove' ? this.battle.getZMove(move, pokemon) : undefined;
		if (megaOrZ === 'zmove' && !zMove) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't use ${move.name} as a Z-move`);
		}
		if (zMove && this.choice.zMove) {
			// TODO: The client shouldn't have sent this request in the first place.
			this.emitCallback('cantz', pokemon);
			return this.emitChoiceError(`Can't move: You can't Z-move more than once per battle`);
		}

		if (zMove) targetType = this.battle.getMove(zMove).target;

		// Validate targetting

		if (autoChoose) {
			targetLoc = 0;
		} else if (this.battle.targetTypeChoices(targetType)) {
			if (!targetLoc && this.active.length >= 2) {
				return this.emitChoiceError(`Can't move: ${move.name} needs a target`);
			}
			if (!this.battle.validTargetLoc(targetLoc, pokemon, targetType)) {
				return this.emitChoiceError(`Can't move: Invalid target for ${move.name}`);
			}
		} else {
			if (targetLoc) {
				return this.emitChoiceError(`Can't move: You can't choose a target for ${move.name}`);
			}
		}

		const lockedMove = pokemon.getLockedMove();
		if (lockedMove) {
			const lockedMoveTarget = this.battle.runEvent('LockMoveTarget', pokemon);
			this.choice.actions.push({
				choice: 'move',
				pokemon: pokemon,
				targetLoc: lockedMoveTarget || 0,
				move: lockedMove,
			});
			return true;
		} else if (!moves.length && !zMove) {
			// Override decision and use Struggle if there are no enabled moves with PP
			// Gen 4 and earlier announce a Pokemon has no moves left before the turn begins, and only to that player's side.
			if (this.gen <= 4) this.send('-activate', pokemon, 'move: Struggle');
			moveid = 'struggle';
		} else if (!zMove) {
			// Check for disabled moves
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
				if (autoChoose) throw new Error(`autoChoose chose a disabled move`);
				this.emitCallback('cant', pokemon, disabledSource, moveid);
				return this.emitChoiceError(`Can't move: ${pokemon.name}'s ${move.name} is disabled`);
			}
			// The chosen move is valid yay
		}

		// Mega evolution

		const mega = (megaOrZ === 'mega');
		if (mega && !pokemon.canMegaEvo) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't mega evolve`);
		}
		if (mega && this.choice.mega) {
			// TODO: The client shouldn't have sent this request in the first place.
			this.emitCallback('cantmega', pokemon);
			return this.emitChoiceError(`Can't move: You can only mega-evolve once per battle`);
		}

		this.choice.actions.push({
			choice: 'move',
			pokemon: pokemon,
			targetLoc: targetLoc,
			move: moveid,
			mega: mega,
			zmove: zMove,
		});

		if (pokemon.maybeDisabled) {
			this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
		}

		if (mega) this.choice.mega = true;
		if (zMove) this.choice.zMove = true;

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkDecisions()) return this;
		return true;
	}
	chooseSwitch(slotText) {
		if (this.currentRequest !== 'move' && this.currentRequest !== 'switch') {
			return this.emitChoiceError(`Can't switch: You need a ${this.currentRequest} response`);
		}
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't switch: You do not have a Pokémon in slot ${index + 1}`);
		}
		const pokemon = this.active[index];
		const autoChoose = !slotText;
		let slot = parseInt(slotText) - 1;
		if (autoChoose) {
			if (this.currentRequest !== 'switch') {
				return this.emitChoiceError(`Can't switch: You need to select a Pokémon to switch in`);
			}
			if (!this.choice.forcedSwitchesLeft) return this.choosePass();
			slot = this.active.length;
			while (this.choice.switchIns.has(slot)) slot++;
		}
		if (isNaN(slot) || slot >= this.pokemon.length) {
			return this.emitChoiceError(`Can't switch: You do not have a Pokémon in slot ${slot + 1} to switch to`);
		} else if (slot < this.active.length) {
			return this.emitChoiceError(`Can't switch: You can't switch to an active Pokémon`);
		} else if (this.choice.switchIns.has(slot)) {
			return this.emitChoiceError(`Can't switch: The Pokémon in slot ${slot + 1} can only switch in once`);
		}
		const targetPokemon = this.pokemon[slot];

		if (targetPokemon.fainted) {
			return this.emitChoiceError(`Can't switch: You can't switch to a fainted Pokémon`);
		}

		if (this.currentRequest === 'move') {
			if (pokemon.trapped) {
				this.emitCallback('trapped', pokemon.position);
				return this.emitChoiceError(`Can't switch: The active Pokémon is trapped`);
			} else if (pokemon.maybeTrapped) {
				this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
			}
		} else if (this.currentRequest === 'switch') {
			if (!this.choice.forcedSwitchesLeft) {
				throw new Error(`Player somehow switched too many Pokemon`);
			}
			this.choice.forcedSwitchesLeft--;
		}

		this.choice.switchIns.add(slot);

		this.choice.actions.push({
			choice: (this.currentRequest === 'switch' ? 'instaswitch' : 'switch'),
			pokemon: pokemon,
			target: targetPokemon,
		});

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkDecisions()) return this;
		return true;
	}
	chooseTeam(data) {
		const autoFill = !data;
		if (autoFill) data = `123456`;
		const positions = ('' + data).split('').map(datum => parseInt(datum) - 1);

		if (autoFill && this.choice.actions.length >= this.maxTeamSize) return true;
		if (this.currentRequest !== 'teampreview') {
			return this.emitChoiceError(`Can't choose for Team Preview: You're not in a Team Preview phase`);
		}

		for (const pos of positions) {
			const index = this.choice.actions.length;
			if (index >= this.maxTeamSize || index >= this.pokemon.length) {
				// client still sends entire team
				break;
				// if (autoFill) break;
				// return this.emitChoiceError(`Can't choose for Team Preview: You are limited to ${this.maxTeamSize} Pokémon`);
			}
			if (isNaN(pos) || pos >= this.pokemon.length) {
				return this.emitChoiceError(`Can't choose for Team Preview: You do not have a Pokémon in slot ${pos + 1}`);
			}
			if (this.choice.switchIns.has(pos)) {
				if (autoFill) continue;
				return this.emitChoiceError(`Can't choose for Team Preview: The Pokémon in slot ${pos + 1} can only switch in once`);
			}

			this.choice.switchIns.add(pos);
			this.choice.actions.push({
				choice: 'team',
				index: index,
				pokemon: this.pokemon[pos],
				priority: -index,
			});
		}

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkDecisions()) return this;
		return true;
	}
	chooseShift(dontPlay) {
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't shift: You do not have a Pokémon in slot ${index + 1}`);
		} else if (this.currentRequest !== 'move') {
			return this.emitChoiceError(`Can't shift: You can only shift during a move phase`);
		} else if (this.battle.gameType !== 'triples') {
			return this.emitChoiceError(`Can't shift: You can only shift to the center in triples`);
		} else if (index === 1) {
			return this.emitChoiceError(`Can't shift: You can only shift from the edge to the center`);
		}
		const pokemon = this.active[index];

		this.choice.actions.push({
			choice: 'shift',
			pokemon: pokemon,
		});

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkDecisions()) return this;
		return true;
	}

	clearChoice() {
		let forcedSwitches = 0;
		let forcedPasses = 0;
		if (this.battle.currentRequest === 'switch') {
			const canSwitchOut = this.active.filter(pokemon => pokemon && pokemon.switchFlag).length;
			const canSwitchIn = this.pokemon.slice(this.active.length).filter(pokemon => pokemon && !pokemon.fainted).length;
			forcedSwitches = Math.min(canSwitchOut, canSwitchIn);
			forcedPasses = canSwitchOut - forcedSwitches;
		}
		this.choice = {
			cantUndo: false,
			error: ``,
			actions: [],
			forcedSwitchesLeft: forcedSwitches,
			forcedPassesLeft: forcedPasses,
			switchIns: new Set(),
		};
	}
	choose(input) {
		if (!this.currentRequest) throw new Error(`Side ${this.name} (${this.id}) has no request`);

		if (this.choice.cantUndo) {
			return this.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
		}

		this.clearChoice();

		const choiceStrings = input.split(',');

		for (let choiceString of choiceStrings) {
			let choiceType = '';
			let data = '';
			choiceString = choiceString.trim();
			let firstSpaceIndex = choiceString.indexOf(' ');
			if (firstSpaceIndex >= 0) {
				data = choiceString.slice(firstSpaceIndex + 1).trim();
				choiceType = choiceString.slice(0, firstSpaceIndex);
			} else {
				choiceType = choiceString;
			}

			switch (choiceType) {
			case 'move':
				let targetLoc = 0;
				if (/\s\-?[1-3]$/.test(data)) {
					targetLoc = parseInt(data.slice(-2));
					data = data.slice(0, data.lastIndexOf(' '));
				}
				const willMega = data.endsWith(' mega') ? 'mega' : '';
				if (willMega) data = data.slice(0, -5);
				const willZ = data.endsWith(' zmove') ? 'zmove' : '';
				if (willZ) data = data.slice(0, -6);
				this.chooseMove(data, targetLoc, willMega || willZ);
				break;
			case 'switch':
				this.chooseSwitch(data);
				break;
			case 'shift':
				if (data) return this.emitChoiceError(`Unrecognized data after "shift": ${data}`);
				this.chooseShift();
				break;
			case 'team':
				if (this.chooseTeam(data)) this.chooseTeam();
				break;
			case 'pass':
			case 'skip':
				if (data) return this.emitChoiceError(`Unrecognized data after "pass": ${data}`);
				this.choosePass();
				break;
			case 'default':
				this.autoChoose();
				break;
			default:
				this.emitChoiceError(`Unrecognized choice: ${choiceString}`);
				break;
			}
		}

		if (this.choice.error) return false;

		return true;
	}
	getChoiceIndex(isPass) {
		let index = this.choice.actions.length;

		if (!isPass) {
			switch (this.currentRequest) {
			case 'move':
				// auto-pass
				while (index < this.active.length && this.active[index].fainted) {
					this.choosePass();
					index++;
				}
				break;
			case 'switch':
				while (index < this.active.length && !this.active[index].switchFlag) {
					this.choosePass();
					index++;
				}
				break;
			}
		}

		return index;
	}

	choosePass() {
		const index = this.getChoiceIndex(true);
		if (index >= this.active.length) return false;
		const pokemon = this.active[index];

		switch (this.currentRequest) {
		case 'switch':
			if (pokemon.switchFlag) { // This condition will always happen if called by Battle#choose()
				if (!this.choice.forcedPassesLeft) {
					return this.emitChoiceError(`Can't pass: You need to switch in a Pokémon to replace ${pokemon.name}`);
				}
				this.choice.forcedPassesLeft--;
			}
			break;
		case 'move':
			if (!pokemon.fainted) {
				return this.emitChoiceError(`Can't pass: Your ${pokemon.name} must make a move (or switch)`);
			}
			break;
		default:
			return this.emitChoiceError(`Can't pass: Not a move or switch request`);
		}

		this.choice.actions.push({
			choice: 'pass',
		});
		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkDecisions()) return this;
		return true;
	}
	chooseDefault() {
		if (!this.battle.LEGACY_API_DO_NOT_USE) throw new Error(`This is a legacy API, it's called autoChoose now`);
		if (this.isChoiceDone()) {
			throw new Error(`You've already chosen actions for ${this.id}.`);
		}
		if (this.currentRequest === 'teampreview') {
			this.chooseTeam();
		} else if (this.currentRequest === 'switch') {
			while (this.chooseSwitch() !== true && !this.isChoiceDone());
		} else if (this.currentRequest === 'move') {
			while (this.chooseMove() !== true && !this.isChoiceDone());
		}
		return this;
	}
	/**
	 * Automatically finish a choice if not currently complete
	 */
	autoChoose() {
		if (this.currentRequest === 'teampreview') {
			if (!this.isChoiceDone()) this.chooseTeam();
		} else if (this.currentRequest === 'switch') {
			while (!this.isChoiceDone()) this.chooseSwitch();
		} else if (this.currentRequest === 'move') {
			while (!this.isChoiceDone()) this.chooseMove();
		}
		return true;
	}

	destroy() {
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

		if (this.choice.actions && this.choice.actions !== true) {
			this.choice.actions.forEach(action => {
				delete action.side;
				delete action.pokemon;
				delete action.target;
			});
		}
		this.choice = null;

		// get rid of some possibly-circular references
		this.battle = null;
		this.foe = null;
	}
}

class Battle extends Tools.BattleDex {
	/**
	 * Initialises a Battle.
	 *
	 * @param {PRNG} [maybePrng]
	 */
	init(format, rated, send, maybePrng) {
		this.log = [];
		/** @type {BattleSide[]} */
		this.sides = [null, null];
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
		this.reportExactHP = !!format.debug;
		this.replayExactHP = !format.team;

		this.queue = [];
		this.faintQueue = [];
		this.messageLog = [];

		this.send = send || (() => {});

		this.turn = 0;
		/** @type {BattleSide} */
		this.p1 = null;
		/** @type {BattleSide} */
		this.p2 = null;
		this.lastUpdate = 0;
		this.weather = '';
		this.terrain = '';
		this.ended = false;
		this.started = false;
		this.active = false;
		this.eventDepth = 0;
		this.lastMove = '';
		this.activeMove = null;
		this.activePokemon = null;
		this.activeTarget = null;
		this.midTurn = false;
		this.currentRequest = '';
		this.lastMoveLine = 0;
		this.reportPercentages = false;
		this.supportCancel = false;
		this.events = null;

		this.abilityOrder = 0;

		this.prng = maybePrng || new PRNG();
		this.prngSeed = this.prng.startingSeed.slice();
	}

	static logReplay(data, isReplay) {
		if (isReplay === true) return data;
		return '';
	}

	toString() {
		return 'Battle: ' + this.format;
	}

	random(m, n) {
		return this.prng.next(m, n);
	}

	setWeather(status, source, sourceEffect) {
		status = this.getEffect(status);
		if (sourceEffect === undefined && this.effect) sourceEffect = this.effect;
		if (source === undefined && this.event && this.event.target) source = this.event.target;

		if (this.weather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.gen > 5 || this.weatherData.duration === 0) {
					return false;
				}
			} else if (this.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
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
	}
	clearWeather() {
		return this.setWeather('');
	}
	effectiveWeather(target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (this.suppressingWeather()) return '';
		return this.weather;
	}
	isWeather(weather, target) {
		let ourWeather = this.effectiveWeather(target);
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return weather.map(toId).includes(ourWeather);
	}
	getWeather() {
		return this.getEffect(this.weather);
	}

	setTerrain(status, source, sourceEffect) {
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
	}
	clearTerrain() {
		return this.setTerrain('');
	}
	effectiveTerrain(target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (!this.runEvent('TryTerrain', target)) return '';
		return this.terrain;
	}
	isTerrain(terrain, target) {
		let ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toId(terrain);
		}
		return terrain.map(toId).includes(ourTerrain);
	}
	getTerrain() {
		return this.getEffect(this.terrain);
	}

	getFormat() {
		return this.getEffect(this.format);
	}
	addPseudoWeather(status, source, sourceEffect) {
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
	}
	getPseudoWeather(status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return null;
		return status;
	}
	removePseudoWeather(status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return false;
		this.singleEvent('End', status, this.pseudoWeather[status.id], this);
		delete this.pseudoWeather[status.id];
		return true;
	}
	suppressingAttackEvents() {
		return this.activePokemon && this.activePokemon.isActive && this.activeMove && this.activeMove.ignoreAbility;
	}
	suppressingWeather() {
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
	}
	setActiveMove(move, pokemon, target) {
		if (!move) move = null;
		if (!pokemon) pokemon = null;
		if (!target) target = pokemon;
		this.activeMove = move;
		this.activePokemon = pokemon;
		this.activeTarget = target;
	}
	clearActiveMove(failed) {
		if (this.activeMove) {
			if (!failed) {
				this.lastMove = this.activeMove.id;
			}
			this.activeMove = null;
			this.activePokemon = null;
			this.activeTarget = null;
		}
	}

	updateSpeed() {
		let actives = this.p1.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
		actives = this.p2.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
	}

	static comparePriority(a, b) {
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
	}
	static compareRedirectOrder(a, b) {
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
	}
	getResidualStatuses(thing, callbackType) {
		let statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		//if (statuses[0]) this.debug('match ' + (callbackType || 'residualCallback') + ': ' + statuses[0].status.id);
		return statuses;
	}
	eachEvent(eventid, effect, relayVar) {
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
			this.runEvent(eventid, actives[i], null, effect, relayVar);
		}
	}
	residualEvent(eventid, relayVar) {
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
	}
	// The entire event system revolves around this function
	// (and its helper functions, getRelevant * )
	singleEvent(eventid, effect, effectData, target, source, sourceEffect, relayVar) {
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
	}
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
	runEvent(eventid, target, source, effect, relayVar, onEffect, fastExit) {
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
			if (status.effectType === 'Ability' && !status.isUnbreakable && this.suppressingAttackEvents() && this.activePokemon !== thing) {
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
					TryAddVolatile: 1,
					TryHit: 1,
					TryHitSide: 1,
					TryMove: 1,
					Boost: 1,
					DragOut: 1,
					Effectiveness: 1,
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
	}
	/**
	 * priorityEvent works just like runEvent, except it exits and returns
	 * on the first non-undefined value instead of only on null/false.
	 */
	priorityEvent(eventid, target, source, effect, relayVar, onEffect) {
		return this.runEvent(eventid, target, source, effect, relayVar, onEffect, true);
	}
	resolveLastPriority(statuses, callbackType) {
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
	}
	// bubbles up to parents
	getRelevantEffects(thing, callbackType, foeCallbackType, foeThing) {
		let statuses = this.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		//if (statuses[0]) this.debug('match ' + callbackType + ': ' + statuses[0].status.id);
		return statuses;
	}
	getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, bubbleUp, bubbleDown, getAll) {
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
	}
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
	on(eventid, target, ...rest) { // rest = [priority, callback]
		if (!eventid) throw new TypeError("Event handlers must have an event to listen to");
		if (!target) throw new TypeError("Event handlers must have a target");
		if (!rest.length) throw new TypeError("Event handlers must have a callback");

		if (target.effectType !== 'Format') {
			throw new TypeError(`${target.effectType} targets are not supported at this time`);
		}

		let callback, priority, order, subOrder, data;
		if (rest.length === 1) {
			[callback] = rest;
			priority = 0;
			order = false;
			subOrder = 0;
		} else {
			[data, callback] = rest;
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

		let eventHandler = {callback, target, priority, order, subOrder};

		let callbackType = `on${eventid}`;
		if (!this.events) this.events = {};
		if (this.events[callbackType] === undefined) {
			this.events[callbackType] = [eventHandler];
		} else {
			this.events[callbackType].push(eventHandler);
		}
	}
	getPokemon(id) {
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
	}
	makeRequest(type) {
		if (type) {
			this.currentRequest = type;
			this.p1.clearChoice();
			this.p2.clearChoice();
		} else {
			type = this.currentRequest;
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
				p1request = {forceSwitch: switchTable, side: this.p1.getData()};
			}
			switchTable = [];
			for (let i = 0, l = this.p2.active.length; i < l; i++) {
				let active = this.p2.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.some(flag => flag === true)) {
				this.p2.currentRequest = 'switch';
				p2request = {forceSwitch: switchTable, side: this.p2.getData()};
			}
			break;
		}

		case 'teampreview':
			let maxTeamSize = 6;
			let teamLengthData = this.getFormat().teamLength;
			if (teamLengthData && teamLengthData.battle) maxTeamSize = teamLengthData.battle;
			this.p1.maxTeamSize = maxTeamSize;
			this.p2.maxTeamSize = maxTeamSize;
			this.add('teampreview' + (maxTeamSize !== 6 ? '|' + maxTeamSize : ''));
			this.p1.currentRequest = 'teampreview';
			p1request = {teamPreview: true, maxTeamSize: maxTeamSize, side: this.p1.getData()};
			this.p2.currentRequest = 'teampreview';
			p2request = {teamPreview: true, maxTeamSize: maxTeamSize, side: this.p2.getData()};
			break;

		default: {
			this.p1.currentRequest = 'move';
			let activeData = this.p1.active.map(pokemon => pokemon && pokemon.getRequestData());
			p1request = {active: activeData, side: this.p1.getData()};

			this.p2.currentRequest = 'move';
			activeData = this.p2.active.map(pokemon => pokemon && pokemon.getRequestData());
			p2request = {active: activeData, side: this.p2.getData()};
			break;
		}

		}

		if (p1request) {
			if (!this.supportCancel || !p2request) p1request.noCancel = true;
			this.p1.emitRequest(p1request);
		} else {
			this.p1.emitRequest({wait: true, side: this.p1.getData()});
		}

		if (p2request) {
			if (!this.supportCancel || !p1request) p2request.noCancel = true;
			this.p2.emitRequest(p2request);
		} else {
			this.p2.emitRequest({wait: true, side: this.p2.getData()});
		}

		if (this.p1.isChoiceDone() && this.p2.isChoiceDone()) {
			throw new Error(`Choices are done immediately after a request`);
		}
	}
	tie() {
		this.win();
	}
	win(side) {
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
	}
	switchIn(pokemon, pos) {
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
		this.insertQueue({pokemon: pokemon, choice: 'runUnnerve'});
		this.insertQueue({pokemon: pokemon, choice: 'runSwitch'});
	}
	canSwitch(side) {
		let canSwitchIn = [];
		for (let i = side.active.length; i < side.pokemon.length; i++) {
			let pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	}
	getRandomSwitchable(side) {
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
	}
	dragIn(side, pos) {
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
			oldActive.illusion = null;
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
			this.singleEvent('PreStart', pokemon.getAbility(), pokemon.abilityData, pokemon);
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
	}
	swapPosition(pokemon, slot, attributes) {
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
	}
	faint(pokemon, source, effect) {
		pokemon.faint(source, effect);
	}
	nextTurn() {
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
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing HP from Struggle. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'drag':
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from being forced to switch. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'switch':
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from repeatedly switching. If this continues, it will be classified as being in an endless loop.</div>');
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
								this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP. If it keeps on not losing PP or HP, it will be classified as being in an endless loop.</div>');
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
				this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(oneStale.name) + ' is in an endless loop' + loopReason + '.' + activationWarning + '</div>');
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
				this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(oneStale.name) + ' is in an endless loop.</div>');
				oneStale.staleWarned = true;
			}
		}

		if (this.gameType === 'triples' && !this.sides.filter(side => side.pokemonLeft > 1).length) {
			// If both sides have one Pokemon left in triples and they are not adjacent, they are both moved to the center.
			let actives = [];
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					if (!this.sides[i].active[j] || this.sides[i].active[j].fainted) continue;
					actives.push(this.sides[i].active[j]);
				}
			}
			if (actives.length > 1 && !this.isAdjacent(actives[0], actives[1])) {
				this.swapPosition(actives[0], 1, '[silent]');
				this.swapPosition(actives[1], 1, '[silent]');
				this.add('-center');
			}
		}

		this.add('turn', this.turn);

		this.makeRequest('move');
	}
	start() {
		if (this.active) return;

		if (!this.p1 || !this.p2) {
			// need two players to start
			return;
		}

		if (this.started) {
			return;
		}
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
		this.add('seed', Battle.logReplay.bind(this, this.prngSeed.join(',')));

		if (format.onBegin) {
			format.onBegin.call(this);
		}
		if (format && format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				this.addPseudoWeather(format.ruleset[i]);
			}
		}

		if (!this.p1.pokemon[0] || !this.p2.pokemon[0]) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		this.residualEvent('TeamPreview');

		this.addQueue({choice: 'start'});
		this.midTurn = true;
		if (!this.currentRequest) this.go();
	}
	boost(boost, target, source, effect, isSecondary, isSelf) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!target.isActive) return false;
		if (this.gen > 5 && !target.side.foe.pokemonLeft) return false;
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
				case 'intimidate': case 'gooey': case 'tanglinghair':
					this.add(msg, target, i, boostBy);
					break;
				case 'zpower':
					this.add(msg, target, i, boostBy, '[zeffect]');
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
	}
	damage(damage, target, source, effect, instafaint) {
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
			if (target.illusion && target.hasAbility('Illusion') && effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.singleEvent('End', this.getAbility('Illusion'), target.abilityData, target, source, effect);
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
	}
	directDamage(damage, target, source, effect) {
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
	}
	heal(damage, target, source, effect) {
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
		case 'zpower':
			this.add('-heal', target, target.getHealth, '[zeffect]');
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
	}
	chain(previousMod, nextMod) {
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
	}
	chainModify(numerator, denominator) {
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
	}
	modify(value, numerator, denominator) {
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
	}
	getCategory(move) {
		move = this.getMove(move);
		return move.category || 'Physical';
	}
	getDamage(pokemon, target, move, suppressMessages) {
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

		// TODO: Find out where this actually goes in the damage calculation
		if (move.isZ && move.zBrokeProtect) {
			baseDamage = this.modify(baseDamage, 0.25);
			this.add('-message', target.name + " couldn't fully protect itself and got hurt! (placeholder)");
		}

		if (this.gen !== 5 && basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	}
	randomizer(baseDamage) {
		return Math.floor(baseDamage * (100 - this.random(16)) / 100);
	}
	/**
	 * Returns whether a proposed target for a move is valid.
	 */
	validTargetLoc(targetLoc, source, targetType) {
		if (targetLoc === 0) return true;
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
	}
	getTargetLoc(target, source) {
		if (target.side === source.side) {
			return -(target.position + 1);
		} else {
			return target.position + 1;
		}
	}
	validTarget(target, source, targetType) {
		return this.validTargetLoc(this.getTargetLoc(target, source), source, targetType);
	}
	getTarget(pokemon, move, targetLoc) {
		move = this.getMove(move);
		let target;
		if ((move.target !== 'randomNormal') &&
				this.validTargetLoc(targetLoc, pokemon, move.target)) {
			if (targetLoc > 0) {
				target = pokemon.side.foe.active[targetLoc - 1];
			} else {
				target = pokemon.side.active[-targetLoc - 1];
			}
			if (target) {
				if (!target.fainted) {
					// target exists and is not fainted
					return target;
				} else if (target.side === pokemon.side) {
					// fainted allied targets don't retarget
					return false;
				}
			}
			// chosen target not valid, retarget randomly with resolveTarget
		}
		return this.resolveTarget(pokemon, move);
	}
	resolveTarget(pokemon, move) {
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
	}
	checkFainted() {
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
	}
	faintMessages(lastFirst) {
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
				faintData.target.side.pokemonLeft--;
				this.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				this.singleEvent('End', this.getAbility(faintData.target.ability), faintData.target.abilityData, faintData.target);
				faintData.target.fainted = true;
				faintData.target.isActive = false;
				faintData.target.isStarted = false;
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
	}
	resolvePriority(decision, midTurn) {
		if (!decision) return;

		if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
		if (!decision.choice && decision.move) decision.choice = 'move';
		if (!decision.priority && decision.priority !== 0) {
			let priorities = {
				'beforeTurn': 100,
				'beforeTurnMove': 99,
				'switch': 7,
				'runUnnerve': 7.3,
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
		if (!midTurn) {
			if (decision.choice === 'move') {
				if (!decision.zmove && this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc});
				}
				if (decision.mega) {
					// TODO: Check that the Pokémon is not affected by Sky Drop.
					// (This is currently being done in `runMegaEvo`).
					this.addQueue({
						choice: 'megaEvo',
						pokemon: decision.pokemon,
					});
				}
			} else if (decision.choice === 'switch' || decision.choice === 'instaswitch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.getDecisionSpeed();
			}
		}

		let deferPriority = this.gen >= 7 && decision.mega && !decision.pokemon.template.isMega;
		if (decision.move) {
			let target;

			if (!decision.targetLoc) {
				target = this.resolveTarget(decision.pokemon, decision.move);
				decision.targetLoc = this.getTargetLoc(target, decision.pokemon);
			}

			decision.move = this.getMoveCopy(decision.move);
			if (!decision.priority && !deferPriority) {
				let move = decision.move;
				if (decision.zmove) {
					let zMoveName = this.getZMove(decision.move, decision.pokemon, true);
					let zMove = this.getMove(zMoveName);
					if (zMove.exists) {
						move = zMove;
					}
				}
				let priority = this.runEvent('ModifyPriority', decision.pokemon, target, move, move.priority);
				decision.priority = priority;
				// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
				if (this.gen > 5) decision.move.priority = priority;
			}
		}
		if (!decision.pokemon && !decision.speed) decision.speed = 1;
		if (!decision.speed && (decision.choice === 'switch' || decision.choice === 'instaswitch') && decision.target) decision.speed = decision.target.getDecisionSpeed();
		if (!decision.speed && !deferPriority) decision.speed = decision.pokemon.getDecisionSpeed();
	}
	addQueue(action) {
		if (Array.isArray(action)) {
			for (let i = 0; i < action.length; i++) {
				this.addQueue(action[i]);
			}
			return;
		}

		if (action.choice === 'pass') return;
		this.resolvePriority(action);
		this.queue.push(action);
	}
	sortQueue() {
		this.queue.sort(Battle.comparePriority);
	}
	insertQueue(decision, midTurn) {
		if (Array.isArray(decision)) {
			for (let i = 0; i < decision.length; i++) {
				this.insertQueue(decision[i]);
			}
			return;
		}

		if (decision.pokemon) decision.pokemon.updateSpeed();
		this.resolvePriority(decision, midTurn);
		for (let i = 0; i < this.queue.length; i++) {
			if (Battle.comparePriority(decision, this.queue[i]) < 0) {
				this.queue.splice(i, 0, decision);
				return;
			}
		}
		this.queue.push(decision);
	}
	prioritizeQueue(decision, source, sourceEffect) {
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
	}
	willAct() {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch' || this.queue[i].choice === 'shift') {
				return this.queue[i];
			}
		}
		return null;
	}
	willMove(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return null;
	}
	cancelDecision(pokemon) {
		let success = false;
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				i--;
				success = true;
			}
		}
		return success;
	}
	cancelMove(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	willSwitch(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if ((this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch') && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return false;
	}
	runDecision(decision) {
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
			this.runMove(decision.move, decision.pokemon, decision.targetLoc, decision.sourceEffect, decision.zmove);
			break;
		case 'megaEvo':
			this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			let target = this.getTarget(decision.pokemon, decision.move, decision.targetLoc);
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
			decision.pokemon.illusion = null;
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
		case 'runUnnerve':
			this.singleEvent('PreStart', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
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
			this.add('upkeep');
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
		} else if (decision.choice === 'megaEvo' && this.gen >= 7) {
			this.eachEvent('Update');
			// In Gen 7, the decision order is recalculated for a Pokémon that mega evolves.
			const moveIndex = this.queue.findIndex(queuedDecision => queuedDecision.pokemon === decision.pokemon && queuedDecision.choice === 'move');
			if (moveIndex >= 0) {
				const moveDecision = this.queue.splice(moveIndex, 1)[0];
				this.insertQueue(moveDecision, true);
			}
			return false;
		} else if (this.queue.length && this.queue[0].choice === 'instaswitch') {
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
	}
	go() {
		this.add('');
		if (this.currentRequest) {
			this.currentRequest = '';
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
	}
	/**
	 * Changes a pokemon's decision, and inserts its new decision
	 * in priority order.
	 *
	 * You'd normally want the OverrideDecision event (which doesn't
	 * change priority order).
	 */
	changeDecision(pokemon, decision) {
		this.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		this.insertQueue(decision);
	}
	/**
	 * Takes a choice string passed from the client. Starts the next
	 * turn if all required choices have been made.
	 */
	choose(sideid, input) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		if (!side) throw new Error(`Invalid side ${sideid}`);

		if (!side.choose(input)) return false;

		this.checkDecisions();
		return true;
	}

	commitDecisions() {
		this.updateSpeed();

		let oldQueue = this.queue;
		this.queue = [];
		let oldFlag = this.LEGACY_API_DO_NOT_USE;
		this.LEGACY_API_DO_NOT_USE = false;
		for (const side of this.sides) {
			side.autoChoose();
		}
		this.LEGACY_API_DO_NOT_USE = oldFlag;
		this.add('choice', this.p1.getChoice, this.p2.getChoice);
		for (const side of this.sides) {
			this.addQueue(side.choice.actions);
		}

		this.sortQueue();
		Array.prototype.push.apply(this.queue, oldQueue);

		this.currentRequest = '';
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';

		this.go();
	}
	undoChoice(sideid) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		if (!side) throw new Error(`Invalid side ${sideid}`);
		if (!side.currentRequest) return;

		if (side.choice.cantUndo) {
			side.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
			return;
		}

		side.clearChoice();
	}
	/**
	 * @return true if both decisions are complete
	 */
	checkDecisions() {
		let totalDecisions = 0;
		if (this.p1.isChoiceDone()) {
			if (!this.supportCancel) this.p1.choice.cantUndo = true;
			totalDecisions++;
		}
		if (this.p2.isChoiceDone()) {
			if (!this.supportCancel) this.p2.choice.cantUndo = true;
			totalDecisions++;
		}
		if (totalDecisions >= this.sides.length) {
			this.commitDecisions();
			return true;
		}
		return false;
	}

	add(...parts) {
		if (!parts.some(part => typeof part === 'function')) {
			this.log.push(`|${parts.join('|')}`);
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
	}
	addMove(...args) {
		this.lastMoveLine = this.log.length;
		this.log.push(`|${args.join('|')}`);
	}
	attrLastMove(...args) {
		this.log[this.lastMoveLine] += `|${args.join('|')}`;
	}
	retargetLastMove(newTarget) {
		let parts = this.log[this.lastMoveLine].split('|');
		parts[4] = newTarget;
		this.log[this.lastMoveLine] = parts.join('|');
	}
	debug(activity) {
		if (this.getFormat().debug) {
			this.add('debug', activity);
		}
	}
	debugError(activity) {
		this.add('debug', activity);
	}

	// players

	join(slot, name, avatar, team) {
		if (this.p1 && this.p2) return false;
		if ((this.p1 && this.p1.name === name) || (this.p2 && this.p2.name === name)) return false;

		let player = null;
		if (this.p1 || slot === 'p2') {
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
		this.add('player', player.id, player.name, avatar);

		this.start();
		return player;
	}

	// This function is called by this process's 'message' event.
	receive(data, more) {
		this.messageLog.push(data.join(' '));
		let logPos = this.log.length;
		let alreadyEnded = this.ended;
		switch (data[1]) {
		case 'join': {
			let team = '';
			if (more) team = Tools.fastUnpackTeam(more);
			this.join(data[2], data[3], data[4], team);
			break;
		}

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
	}
	sendUpdates(logPos, alreadyEnded) {
		if (this.log.length > logPos) {
			if (alreadyEnded !== undefined && this.ended && !alreadyEnded) {
				if (this.rated || Config.logchallenges) {
					let log = {
						seed: this.prngSeed,
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
	}

	destroy() {
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
	}
}

exports.BattlePokemon = BattlePokemon;
exports.BattleSide = BattleSide;
exports.Battle = Battle;

let battleProtoCache = new Map();
exports.construct = function (format, rated, send) {
	format = Tools.getFormat(format);
	let mod = format.mod || 'base';
	if (!battleProtoCache.has(mod)) {
		// Scripts overrides Battle overrides Tools
		let tools = Tools.mod(mod);
		let proto = Object.create(Battle.prototype);
		Object.assign(proto, tools);
		tools.install(proto);
		battleProtoCache.set(mod, proto);
	}
	let battle = Object.create(battleProtoCache.get(mod));
	Battle.prototype.init.call(battle, format, rated, send);
	return battle;
};
